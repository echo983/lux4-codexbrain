use std::fs::{self, OpenOptions};
use std::io::{self, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

use anyhow::{anyhow, Context, Result};
use crossterm::event::{self, Event, KeyCode, KeyEventKind};
use crossterm::execute;
use crossterm::terminal::{
    disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen,
};
use ratatui::backend::CrosstermBackend;
use ratatui::layout::{Constraint, Direction, Layout, Rect};
use ratatui::style::{Color, Modifier, Style};
use ratatui::text::{Line, Text};
use ratatui::widgets::{Block, Borders, Cell, Clear, Paragraph, Row, Table, TableState, Wrap};
use ratatui::{Frame, Terminal};
use serde::Serialize;

const REFRESH_INTERVAL: Duration = Duration::from_secs(2);
const LOG_TAIL_LINES: usize = 18;
const STATUS_SNAPSHOT_PATH: &str = "var/daemon_manager/status.json";
const EVENT_LOG_PATH: &str = "var/logs/daemon_manager_events.jsonl";

#[derive(Clone, Copy, Debug, Serialize)]
struct DaemonSpec {
    name: &'static str,
    module: &'static str,
    port: u16,
    description: &'static str,
    log_path: &'static str,
}

#[derive(Clone, Debug, Serialize)]
struct DaemonStatus {
    spec: DaemonSpec,
    pid: Option<u32>,
    listening: bool,
    healthy: bool,
    state: String,
    last_error: Option<String>,
}

#[derive(Clone, Debug, Serialize)]
struct Snapshot {
    ts: u64,
    daemons: Vec<DaemonStatus>,
}

#[derive(Clone, Debug, Serialize)]
struct EventLog<'a> {
    ts: u64,
    event: &'a str,
    daemon: &'a str,
    detail: String,
}

enum Mode {
    Tui,
    StatusJson,
    StartAll,
    StopAll,
    StartOne(String),
    StopOne(String),
    RestartOne(String),
}

struct App {
    repo_root: PathBuf,
    daemons: Vec<DaemonStatus>,
    selected: usize,
    table_state: TableState,
    flash_message: String,
    show_help: bool,
    last_refresh: Instant,
}

fn main() -> Result<()> {
    let repo_root = resolve_repo_root()?;
    let mode = parse_mode()?;
    ensure_manager_dirs(&repo_root)?;
    match mode {
        Mode::Tui => run_tui(repo_root),
        other => run_command(repo_root, other),
    }
}

fn resolve_repo_root() -> Result<PathBuf> {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    manifest_dir
        .parent()
        .and_then(Path::parent)
        .map(Path::to_path_buf)
        .ok_or_else(|| anyhow!("failed to resolve repo root from CARGO_MANIFEST_DIR"))
}

fn parse_mode() -> Result<Mode> {
    let args = std::env::args().skip(1).collect::<Vec<_>>();
    if args.is_empty() {
        return Ok(Mode::Tui);
    }
    match args[0].as_str() {
        "status" if args.get(1).map(String::as_str) == Some("--json") => Ok(Mode::StatusJson),
        "start-all" => Ok(Mode::StartAll),
        "stop-all" => Ok(Mode::StopAll),
        "start" => Ok(Mode::StartOne(
            args.get(1).cloned().ok_or_else(|| anyhow!("missing daemon name"))?,
        )),
        "stop" => Ok(Mode::StopOne(
            args.get(1).cloned().ok_or_else(|| anyhow!("missing daemon name"))?,
        )),
        "restart" => Ok(Mode::RestartOne(
            args.get(1).cloned().ok_or_else(|| anyhow!("missing daemon name"))?,
        )),
        other => Err(anyhow!("unsupported command: {}", other)),
    }
}

fn run_command(repo_root: PathBuf, mode: Mode) -> Result<()> {
    match mode {
        Mode::StatusJson => {
            let snapshot = write_snapshot(&repo_root, None)?;
            println!("{}", serde_json::to_string_pretty(&snapshot)?);
            Ok(())
        }
        Mode::StartAll => {
            for spec in daemon_specs() {
                let pid = start_daemon(&repo_root, spec)?;
                append_event(&repo_root, "start", spec.name, format!("pid={}", pid))?;
            }
            let snapshot = write_snapshot(&repo_root, None)?;
            println!("{}", serde_json::to_string_pretty(&snapshot)?);
            Ok(())
        }
        Mode::StopAll => {
            for spec in daemon_specs() {
                let stopped = stop_daemon(spec)?;
                append_event(
                    &repo_root,
                    "stop",
                    spec.name,
                    if stopped { "stopped".to_string() } else { "not_running".to_string() },
                )?;
            }
            let snapshot = write_snapshot(&repo_root, None)?;
            println!("{}", serde_json::to_string_pretty(&snapshot)?);
            Ok(())
        }
        Mode::StartOne(name) => {
            let spec = lookup_spec(&name)?;
            let pid = start_daemon(&repo_root, spec)?;
            append_event(&repo_root, "start", spec.name, format!("pid={}", pid))?;
            let snapshot = write_snapshot(&repo_root, None)?;
            println!("{}", serde_json::to_string_pretty(&snapshot)?);
            Ok(())
        }
        Mode::StopOne(name) => {
            let spec = lookup_spec(&name)?;
            let stopped = stop_daemon(spec)?;
            append_event(
                &repo_root,
                "stop",
                spec.name,
                if stopped { "stopped".to_string() } else { "not_running".to_string() },
            )?;
            let snapshot = write_snapshot(&repo_root, None)?;
            println!("{}", serde_json::to_string_pretty(&snapshot)?);
            Ok(())
        }
        Mode::RestartOne(name) => {
            let spec = lookup_spec(&name)?;
            let _ = stop_daemon(spec)?;
            std::thread::sleep(Duration::from_millis(300));
            let pid = start_daemon(&repo_root, spec)?;
            append_event(&repo_root, "restart", spec.name, format!("pid={}", pid))?;
            let snapshot = write_snapshot(&repo_root, None)?;
            println!("{}", serde_json::to_string_pretty(&snapshot)?);
            Ok(())
        }
        Mode::Tui => unreachable!(),
    }
}

fn run_tui(repo_root: PathBuf) -> Result<()> {
    let mut terminal = init_terminal()?;
    let result = run_app(&mut terminal, repo_root);
    restore_terminal()?;
    result
}

fn init_terminal() -> Result<Terminal<CrosstermBackend<io::Stdout>>> {
    enable_raw_mode().context("failed to enable raw mode")?;
    execute!(io::stdout(), EnterAlternateScreen).context("failed to enter alternate screen")?;
    let backend = CrosstermBackend::new(io::stdout());
    Terminal::new(backend).context("failed to create terminal")
}

fn restore_terminal() -> Result<()> {
    disable_raw_mode().context("failed to disable raw mode")?;
    execute!(io::stdout(), LeaveAlternateScreen).context("failed to leave alternate screen")?;
    Ok(())
}

fn run_app(terminal: &mut Terminal<CrosstermBackend<io::Stdout>>, repo_root: PathBuf) -> Result<()> {
    let mut app = App::new(repo_root)?;
    loop {
        terminal.draw(|frame| draw(frame, &mut app))?;
        if event::poll(Duration::from_millis(250)).context("failed to poll terminal events")? {
            if let Event::Key(key) = event::read().context("failed to read terminal event")? {
                if key.kind != KeyEventKind::Press {
                    continue;
                }
                match key.code {
                    KeyCode::Char('q') => break,
                    KeyCode::Char('h') => app.toggle_help(),
                    KeyCode::Down | KeyCode::Char('j') => app.next(),
                    KeyCode::Up | KeyCode::Char('k') => app.previous(),
                    KeyCode::Char('r') => app.refresh()?,
                    KeyCode::Char('s') => app.start_selected()?,
                    KeyCode::Char('x') => app.stop_selected()?,
                    KeyCode::Char('R') => app.restart_selected()?,
                    KeyCode::Char('S') => app.start_all()?,
                    KeyCode::Char('X') => app.stop_all()?,
                    _ => {}
                }
            }
        }
        if app.last_refresh.elapsed() >= REFRESH_INTERVAL {
            app.refresh()?;
        }
    }
    Ok(())
}

impl App {
    fn new(repo_root: PathBuf) -> Result<Self> {
        let mut app = Self {
            repo_root,
            daemons: daemon_specs()
                .into_iter()
                .map(|spec| DaemonStatus {
                    spec,
                    pid: None,
                    listening: false,
                    healthy: false,
                    state: "unknown".to_string(),
                    last_error: None,
                })
                .collect(),
            selected: 0,
            table_state: TableState::default(),
            flash_message: String::new(),
            show_help: false,
            last_refresh: Instant::now() - REFRESH_INTERVAL,
        };
        app.table_state.select(Some(0));
        app.refresh()?;
        Ok(app)
    }

    fn next(&mut self) {
        if self.show_help {
            return;
        }
        if self.daemons.is_empty() {
            return;
        }
        self.selected = (self.selected + 1) % self.daemons.len();
        self.table_state.select(Some(self.selected));
    }

    fn previous(&mut self) {
        if self.show_help {
            return;
        }
        if self.daemons.is_empty() {
            return;
        }
        self.selected = if self.selected == 0 {
            self.daemons.len() - 1
        } else {
            self.selected - 1
        };
        self.table_state.select(Some(self.selected));
    }

    fn refresh(&mut self) -> Result<()> {
        let previous = Some(self.daemons.clone());
        self.daemons = collect_statuses(&self.repo_root)?;
        write_snapshot(&self.repo_root, previous.as_deref())?;
        if self.selected >= self.daemons.len() {
            self.selected = self.daemons.len().saturating_sub(1);
        }
        self.table_state.select(Some(self.selected));
        self.last_refresh = Instant::now();
        Ok(())
    }

    fn toggle_help(&mut self) {
        self.show_help = !self.show_help;
        self.flash_message = if self.show_help {
            "help opened".to_string()
        } else {
            "help closed".to_string()
        };
    }

    fn selected_spec(&self) -> Result<DaemonSpec> {
        self.daemons
            .get(self.selected)
            .map(|status| status.spec)
            .ok_or_else(|| anyhow!("no daemon selected"))
    }

    fn start_selected(&mut self) -> Result<()> {
        let spec = self.selected_spec()?;
        let pid = start_daemon(&self.repo_root, spec)?;
        append_event(&self.repo_root, "start", spec.name, format!("pid={}", pid))?;
        self.flash_message = format!("started {} with pid {}", spec.name, pid);
        self.refresh()
    }

    fn stop_selected(&mut self) -> Result<()> {
        let spec = self.selected_spec()?;
        let stopped = stop_daemon(spec)?;
        append_event(
            &self.repo_root,
            "stop",
            spec.name,
            if stopped { "stopped".to_string() } else { "not_running".to_string() },
        )?;
        self.flash_message = if stopped {
            format!("stopped {}", spec.name)
        } else {
            format!("{} was not running", spec.name)
        };
        self.refresh()
    }

    fn restart_selected(&mut self) -> Result<()> {
        let spec = self.selected_spec()?;
        let _ = stop_daemon(spec)?;
        std::thread::sleep(Duration::from_millis(300));
        let pid = start_daemon(&self.repo_root, spec)?;
        append_event(&self.repo_root, "restart", spec.name, format!("pid={}", pid))?;
        self.flash_message = format!("restarted {} with pid {}", spec.name, pid);
        self.refresh()
    }

    fn start_all(&mut self) -> Result<()> {
        let mut started = Vec::new();
        for spec in daemon_specs() {
            let pid = start_daemon(&self.repo_root, spec)?;
            append_event(&self.repo_root, "start", spec.name, format!("pid={}", pid))?;
            started.push(format!("{}:{}", spec.name, pid));
        }
        self.flash_message = format!("started all daemons [{}]", started.join(", "));
        self.refresh()
    }

    fn stop_all(&mut self) -> Result<()> {
        let mut stopped = Vec::new();
        for spec in daemon_specs() {
            let ok = stop_daemon(spec)?;
            append_event(
                &self.repo_root,
                "stop",
                spec.name,
                if ok { "stopped".to_string() } else { "not_running".to_string() },
            )?;
            stopped.push(format!("{}:{}", spec.name, if ok { "stopped" } else { "skip" }));
        }
        self.flash_message = format!("stopped all daemons [{}]", stopped.join(", "));
        self.refresh()
    }
}

fn daemon_specs() -> Vec<DaemonSpec> {
    vec![
        DaemonSpec {
            name: "lux4_daemon",
            module: "lux4_daemon",
            port: 18473,
            description: "Main incoming message daemon",
            log_path: "var/logs/lux4_daemon.stdout.log",
        },
        DaemonSpec {
            name: "moreway_search_service",
            module: "moreway_search_service",
            port: 18561,
            description: "Search and mobile card detail API",
            log_path: "var/logs/moreway_search_service.stdout.log",
        },
        DaemonSpec {
            name: "visual_asset_card_service",
            module: "visual_asset_card_service",
            port: 18574,
            description: "Visual card ingest service",
            log_path: "var/logs/visual_asset_card_service.stdout.log",
        },
    ]
}

fn lookup_spec(name: &str) -> Result<DaemonSpec> {
    daemon_specs()
        .into_iter()
        .find(|spec| spec.name == name)
        .ok_or_else(|| anyhow!("unknown daemon: {}", name))
}

fn collect_statuses(repo_root: &Path) -> Result<Vec<DaemonStatus>> {
    daemon_specs()
        .into_iter()
        .map(|spec| inspect_daemon(repo_root, spec))
        .collect::<Result<Vec<_>>>()
}

fn inspect_daemon(repo_root: &Path, spec: DaemonSpec) -> Result<DaemonStatus> {
    let pid = current_pid(spec)?;
    let listening = is_port_listening(spec.port)?;
    let healthy = if listening { health_check(spec.port) } else { false };
    let state = if healthy {
        "healthy"
    } else if listening {
        "listening"
    } else if pid.is_some() {
        "starting"
    } else {
        "stopped"
    };
    Ok(DaemonStatus {
        spec,
        pid,
        listening,
        healthy,
        state: state.to_string(),
        last_error: if healthy || state == "stopped" {
            None
        } else {
            latest_error_line(&repo_root.join(spec.log_path))
        },
    })
}

fn current_pid(spec: DaemonSpec) -> Result<Option<u32>> {
    let pattern = format!("python3 -m {}", spec.module);
    let output = Command::new("bash")
        .arg("-lc")
        .arg(format!("pgrep -f {}", shell_quote(&pattern)))
        .output()
        .with_context(|| format!("failed to inspect pid for {}", spec.name))?;
    if !output.status.success() {
        return Ok(None);
    }
    let stdout = String::from_utf8_lossy(&output.stdout);
    let pid = stdout
        .lines()
        .find_map(|line| line.trim().parse::<u32>().ok());
    Ok(pid)
}

fn is_port_listening(port: u16) -> Result<bool> {
    let output = Command::new("bash")
        .arg("-lc")
        .arg(format!("ss -ltn '( sport = :{} )' | tail -n +2", port))
        .output()
        .context("failed to inspect listening sockets")?;
    Ok(!String::from_utf8_lossy(&output.stdout).trim().is_empty())
}

fn health_check(port: u16) -> bool {
    let url = format!("http://127.0.0.1:{}/healthz", port);
    match ureq::get(&url).timeout(Duration::from_secs(2)).call() {
        Ok(response) => response.status() == 200,
        Err(_) => false,
    }
}

fn start_daemon(repo_root: &Path, spec: DaemonSpec) -> Result<u32> {
    fs::create_dir_all(repo_root.join("var/logs")).context("failed to create log dir")?;
    let log_path = repo_root.join(spec.log_path);
    let log_file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .with_context(|| format!("failed to open log file for {}", spec.name))?;
    let stderr_file = log_file
        .try_clone()
        .with_context(|| format!("failed to clone log file for {}", spec.name))?;
    let mut command = Command::new("python3");
    command
        .arg("-m")
        .arg(spec.module)
        .current_dir(repo_root)
        .stdin(Stdio::null())
        .stdout(Stdio::from(log_file))
        .stderr(Stdio::from(stderr_file))
        .env("PYTHONPATH", "src");
    for (key, value) in load_dotenv(repo_root.join(".env"))? {
        command.env(key, value);
    }
    let child = command
        .spawn()
        .with_context(|| format!("failed to spawn {}", spec.name))?;
    let pid = child.id();
    std::thread::sleep(Duration::from_millis(500));
    let live_pid = current_pid(spec)?;
    let listening = is_port_listening(spec.port)?;
    if live_pid.is_none() && !listening {
        let detail = latest_log_line(&log_path).unwrap_or_else(|| "process exited before becoming ready".to_string());
        return Err(anyhow!("{} failed to stay up: {}", spec.name, detail));
    }
    Ok(pid)
}

fn stop_daemon(spec: DaemonSpec) -> Result<bool> {
    let pid = current_pid(spec)?;
    if let Some(pid) = pid {
        let status = Command::new("kill")
            .arg(pid.to_string())
            .status()
            .with_context(|| format!("failed to stop {}", spec.name))?;
        return Ok(status.success());
    }
    Ok(false)
}

fn ensure_manager_dirs(repo_root: &Path) -> Result<()> {
    fs::create_dir_all(repo_root.join("var/daemon_manager"))?;
    fs::create_dir_all(repo_root.join("var/logs"))?;
    let event_log_path = repo_root.join(EVENT_LOG_PATH);
    if !event_log_path.exists() {
        fs::write(&event_log_path, b"")?;
    }
    Ok(())
}

fn write_snapshot(repo_root: &Path, previous: Option<&[DaemonStatus]>) -> Result<Snapshot> {
    let statuses = collect_statuses(repo_root)?;
    if let Some(previous_statuses) = previous {
        for current in &statuses {
            if let Some(old) = previous_statuses.iter().find(|item| item.spec.name == current.spec.name) {
                if old.state != current.state || old.pid != current.pid || old.healthy != current.healthy {
                    append_event(
                        repo_root,
                        "state_change",
                        current.spec.name,
                        format!(
                            "{} -> {} (pid={:?} healthy={})",
                            old.state, current.state, current.pid, current.healthy
                        ),
                    )?;
                }
            }
        }
    }
    let snapshot = Snapshot {
        ts: now_ts(),
        daemons: statuses,
    };
    let path = repo_root.join(STATUS_SNAPSHOT_PATH);
    fs::write(&path, serde_json::to_vec_pretty(&snapshot)?)
        .with_context(|| format!("failed to write {}", path.display()))?;
    Ok(snapshot)
}

fn append_event(repo_root: &Path, event: &str, daemon: &str, detail: String) -> Result<()> {
    let record = EventLog {
        ts: now_ts(),
        event,
        daemon,
        detail,
    };
    let path = repo_root.join(EVENT_LOG_PATH);
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)
        .with_context(|| format!("failed to open {}", path.display()))?;
    serde_json::to_writer(&mut file, &record)?;
    writeln!(&mut file)?;
    Ok(())
}

fn now_ts() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_else(|_| Duration::from_secs(0))
        .as_secs()
}

fn draw(frame: &mut Frame<'_>, app: &mut App) {
    let layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3),
            Constraint::Length(10),
            Constraint::Min(8),
            Constraint::Length(3),
        ])
        .split(frame.size());

    let title = Paragraph::new(Text::from(vec![
        Line::from("Daemon Manager"),
        Line::from("j/k move  s start  x stop  R restart  S start-all  X stop-all  h help  q quit"),
    ]))
    .block(Block::default().borders(Borders::ALL).title("Control"));
    frame.render_widget(title, layout[0]);

    draw_table(frame, app, layout[1]);
    draw_log_panel(frame, app, layout[2]);

    let footer_text = format!(
        "keys: j/k move  s start  x stop  R restart  S start-all  X stop-all  r refresh  h help  q quit | {}",
        app.flash_message
    );
    let footer = Paragraph::new(footer_text)
        .style(Style::default().fg(Color::Yellow))
        .block(Block::default().borders(Borders::ALL).title("Hints"));
    frame.render_widget(footer, layout[3]);

    if app.show_help {
        draw_help_overlay(frame);
    }
}

fn draw_table(frame: &mut Frame<'_>, app: &mut App, area: Rect) {
    let rows = app.daemons.iter().map(|daemon| {
        let pid = daemon
            .pid
            .map(|value| value.to_string())
            .unwrap_or_else(|| "-".to_string());
        Row::new(vec![
            Cell::from(daemon.spec.name),
            Cell::from(daemon.state.as_str()),
            Cell::from(pid),
            Cell::from(daemon.spec.port.to_string()),
            Cell::from(daemon.spec.description),
        ])
    });
    let table = Table::new(
        rows,
        [
            Constraint::Length(26),
            Constraint::Length(12),
            Constraint::Length(10),
            Constraint::Length(8),
            Constraint::Min(24),
        ],
    )
    .header(
        Row::new(vec!["Daemon", "State", "PID", "Port", "Description"])
            .style(Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD)),
    )
    .highlight_style(Style::default().bg(Color::DarkGray))
    .block(Block::default().borders(Borders::ALL).title("Daemons"));
    frame.render_stateful_widget(table, area, &mut app.table_state);
}

fn draw_log_panel(frame: &mut Frame<'_>, app: &App, area: Rect) {
    let Some(selected) = app.daemons.get(app.selected) else {
        return;
    };
    let log_path = app.repo_root.join(selected.spec.log_path);
    let mut lines = vec![
        Line::from(format!("module: {}", selected.spec.module)),
        Line::from(format!("daemon log: {}", log_path.display())),
        Line::from(format!(
            "monitor snapshot: {}",
            app.repo_root.join(STATUS_SNAPSHOT_PATH).display()
        )),
        Line::from(format!(
            "monitor events: {}",
            app.repo_root.join(EVENT_LOG_PATH).display()
        )),
    ];
    if let Some(pid) = selected.pid {
        lines.push(Line::from(format!("pid: {}", pid)));
    }
    lines.push(Line::from(String::new()));
    lines.extend(tail_lines(&log_path, LOG_TAIL_LINES).into_iter().map(Line::from));
    let log_view = Paragraph::new(Text::from(lines))
        .wrap(Wrap { trim: false })
        .block(Block::default().borders(Borders::ALL).title("Selected Log Tail"));
    frame.render_widget(log_view, area);
}

fn draw_help_overlay(frame: &mut Frame<'_>) {
    let area = centered_rect(70, 70, frame.size());
    let help_lines = vec![
        Line::from("Daemon Manager Help"),
        Line::from(""),
        Line::from("j / k or arrows: move selection"),
        Line::from("s: start selected daemon"),
        Line::from("x: stop selected daemon"),
        Line::from("R: restart selected daemon"),
        Line::from("S: start all daemons"),
        Line::from("X: stop all daemons"),
        Line::from("r: refresh statuses and rewrite snapshot"),
        Line::from("h: toggle this help page"),
        Line::from("q: quit"),
        Line::from(""),
        Line::from(format!("status snapshot: {}", STATUS_SNAPSHOT_PATH)),
        Line::from(format!("event log: {}", EVENT_LOG_PATH)),
    ];
    let widget = Paragraph::new(Text::from(help_lines))
        .wrap(Wrap { trim: false })
        .style(Style::default().fg(Color::White))
        .block(
            Block::default()
                .borders(Borders::ALL)
                .title("Help")
                .style(Style::default().bg(Color::Black)),
        );
    frame.render_widget(Clear, area);
    frame.render_widget(Block::default().style(Style::default().bg(Color::Black)), area);
    frame.render_widget(widget, area);
}

fn tail_lines(path: &Path, limit: usize) -> Vec<String> {
    match fs::read_to_string(path) {
        Ok(content) => {
            let mut lines = content.lines().map(ToString::to_string).collect::<Vec<_>>();
            if lines.len() > limit {
                lines = lines.split_off(lines.len() - limit);
            }
            if lines.is_empty() {
                vec!["<empty log>".to_string()]
            } else {
                lines
            }
        }
        Err(_) => vec!["<log file not found>".to_string()],
    }
}

fn latest_log_line(path: &Path) -> Option<String> {
    fs::read_to_string(path).ok().and_then(|content| {
        content
            .lines()
            .rev()
            .map(str::trim)
            .find(|line| !line.is_empty())
            .map(ToString::to_string)
    })
}

fn latest_error_line(path: &Path) -> Option<String> {
    let content = fs::read_to_string(path).ok()?;
    content.lines().rev().map(str::trim).find_map(|line| {
        if line.is_empty() {
            return None;
        }
        let lower = line.to_ascii_lowercase();
        if lower.contains("traceback")
            || lower.contains("error")
            || lower.contains("exception")
            || lower.contains("runtimeerror")
            || lower.contains("address already in use")
        {
            return Some(line.to_string());
        }
        None
    })
}

fn centered_rect(percent_x: u16, percent_y: u16, area: Rect) -> Rect {
    let vertical = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Percentage((100 - percent_y) / 2),
            Constraint::Percentage(percent_y),
            Constraint::Percentage((100 - percent_y) / 2),
        ])
        .split(area);
    Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Percentage((100 - percent_x) / 2),
            Constraint::Percentage(percent_x),
            Constraint::Percentage((100 - percent_x) / 2),
        ])
        .split(vertical[1])[1]
}

fn load_dotenv(path: PathBuf) -> Result<Vec<(String, String)>> {
    if !path.exists() {
        return Ok(Vec::new());
    }
    let mut items = Vec::new();
    for raw_line in fs::read_to_string(&path)
        .with_context(|| format!("failed to read {}", path.display()))?
        .lines()
    {
        let line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let line = if let Some(rest) = line.strip_prefix("export ") {
            rest.trim()
        } else {
            line
        };
        let Some((key, raw_value)) = line.split_once('=') else {
            continue;
        };
        let key = key.trim();
        if key.is_empty() {
            continue;
        }
        let mut value = raw_value.trim().to_string();
        if value.len() >= 2 {
            let first = value.as_bytes()[0] as char;
            let last = value.as_bytes()[value.len() - 1] as char;
            if (first == '"' && last == '"') || (first == '\'' && last == '\'') {
                value = value[1..value.len() - 1].to_string();
            }
        }
        items.push((key.to_string(), value));
    }
    Ok(items)
}

fn shell_quote(raw: &str) -> String {
    format!("'{}'", raw.replace('\'', "'\"'\"'"))
}
