from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from scripts.capability_status_report import (
    CAPABILITIES,
    CapabilitySpec,
    CheckResult,
    build_report,
    check_executable,
    evaluate_capability,
    main,
    render_markdown,
)


class CapabilityStatusReportTests(unittest.TestCase):
    def test_evaluate_capability_available(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            script_path = root / "capability.py"
            script_path.write_text("print('ok')\n", encoding="utf-8")
            spec = CapabilitySpec(
                key="demo",
                name="demo",
                kind="primitive",
                category="test",
                path="capability.py",
                required_checks=("a",),
                optional_checks=("b",),
            )

            with mock.patch("scripts.capability_status_report.REPO_ROOT", root):
                result = evaluate_capability(
                    spec,
                    {
                        "a": CheckResult(True, "required ok"),
                        "b": CheckResult(True, "optional ok"),
                    },
                )
            self.assertEqual(result["status"], "available")

    def test_evaluate_capability_degraded_when_optional_missing(self) -> None:
        spec = CapabilitySpec(
            key="demo",
            name="demo",
            kind="primitive",
            category="test",
            path="scripts/capability_status_report.py",
            required_checks=("a",),
            optional_checks=("b",),
        )
        result = evaluate_capability(
            spec,
            {
                "a": CheckResult(True, "required ok"),
                "b": CheckResult(False, "optional missing"),
            },
        )
        self.assertEqual(result["status"], "degraded")

    def test_evaluate_capability_unavailable_when_required_missing(self) -> None:
        spec = CapabilitySpec(
            key="demo",
            name="demo",
            kind="primitive",
            category="test",
            path="scripts/capability_status_report.py",
            required_checks=("a",),
        )
        result = evaluate_capability(
            spec,
            {
                "a": CheckResult(False, "required missing"),
            },
        )
        self.assertEqual(result["status"], "unavailable")

    def test_build_report_aggregates_summary(self) -> None:
        fake_checks = {"repo_root": CheckResult(True, "/repo")}
        fake_caps = [
            {"status": "available"},
            {"status": "degraded"},
            {"status": "unavailable"},
        ]
        fake_skills = [{"name": "skill-a", "status": "available", "path": "/tmp/skill"}]
        with (
            mock.patch("scripts.capability_status_report.build_check_catalog", return_value=fake_checks),
            mock.patch("scripts.capability_status_report.collect_skills", return_value=fake_skills),
            mock.patch("scripts.capability_status_report.evaluate_capability", side_effect=fake_caps),
            mock.patch("scripts.capability_status_report.CAPABILITIES", (object(), object(), object())),
        ):
            report = build_report()
        self.assertEqual(report["summary"]["available"], 1)
        self.assertEqual(report["summary"]["degraded"], 1)
        self.assertEqual(report["summary"]["unavailable"], 1)
        self.assertEqual(report["summary"]["skills"], 1)

    def test_render_markdown_contains_sections(self) -> None:
        report = {
            "generated_at": "2026-03-22T00:00:00+00:00",
            "repo_root": "/repo",
            "summary": {"available": 1, "degraded": 0, "unavailable": 0, "skills": 1},
            "shared_checks": {"repo_root": {"ok": True, "detail": "/repo"}},
            "capabilities": [
                {
                    "name": "demo",
                    "kind": "primitive",
                    "category": "test",
                    "status": "available",
                    "path": "scripts/demo.py",
                }
            ],
            "skills": [{"name": "skill-a", "status": "available", "path": "/tmp/skill"}],
        }
        text = render_markdown(report)
        self.assertIn("# Capability Status Report", text)
        self.assertIn("## Shared Checks", text)
        self.assertIn("## Capabilities", text)
        self.assertIn("## Skills", text)

    def test_main_writes_reports(self) -> None:
        fake_report = {
            "generated_at": "2026-03-22T00:00:00+00:00",
            "repo_root": "/repo",
            "summary": {"available": 1, "degraded": 0, "unavailable": 0, "skills": 0},
            "shared_checks": {},
            "capabilities": [],
            "skills": [],
        }
        with tempfile.TemporaryDirectory() as tmpdir:
            with (
                mock.patch("scripts.capability_status_report.build_report", return_value=fake_report),
                mock.patch("sys.argv", ["capability_status_report.py", "--output-dir", tmpdir, "--stdout-format", "json"]),
                mock.patch("builtins.print") as printed,
            ):
                rc = main()
            self.assertEqual(rc, 0)
            self.assertTrue((Path(tmpdir) / "latest.json").exists())
            self.assertTrue((Path(tmpdir) / "latest.md").exists())
            printed.assert_called()
            json.loads((Path(tmpdir) / "latest.json").read_text(encoding="utf-8"))

    def test_check_executable_finds_ytdlp_in_repo_venv(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            binary = root / ".venv_ytdlp" / "bin" / "yt-dlp"
            binary.parent.mkdir(parents=True, exist_ok=True)
            binary.write_text("#!/bin/sh\n", encoding="utf-8")
            with (
                mock.patch("scripts.capability_status_report.REPO_ROOT", root),
                mock.patch("scripts.capability_status_report.Path.cwd", return_value=root),
                mock.patch("scripts.capability_status_report.shutil.which", return_value=None),
            ):
                ok, detail = check_executable("yt-dlp")
            self.assertTrue(ok)
            self.assertEqual(detail, str(binary))

    def test_openai_capabilities_registered(self) -> None:
        keys = {spec.key for spec in CAPABILITIES}
        self.assertIn("openai_image_generate", keys)
        self.assertIn("openai_planet_texture_experiment", keys)

    def test_openai_capability_requires_openai_key(self) -> None:
        spec = CapabilitySpec(
            key="openai_image_generate",
            name="openai_image_generate",
            kind="primitive",
            category="ai",
            path="scripts/capability_status_report.py",
            required_checks=("env:openai_api_key",),
        )
        result = evaluate_capability(
            spec,
            {
                "env:openai_api_key": CheckResult(False, "missing any of: OPENAI_API_KEY"),
            },
        )
        self.assertEqual(result["status"], "unavailable")


if __name__ == "__main__":
    unittest.main()
