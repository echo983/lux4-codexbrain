export function createResultsPanel({
  resultsSummaryEl,
  resultsListEl,
  inferDocKind,
  compactMetaLabel,
  nbssObjectUrl,
  assetCardUrl,
  getSelectedPayload,
  loadText,
}) {
  const resultContentCache = new Map();

  function escapeHtml(text) {
    return String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  function stripFrontmatter(markdown) {
    const text = String(markdown || '');
    if (!text.startsWith('---\n')) return text;
    const end = text.indexOf('\n---\n', 4);
    if (end === -1) return text;
    return text.slice(end + 5);
  }

  function compactLines(text, maxLines = 4) {
    return String(text || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, maxLines)
      .join('\n');
  }

  function formatContent(text) {
    const escaped = escapeHtml(text);
    // Simple regex to convert **text** to <b>text</b>
    return escaped.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  }

  function parseAssetCardSummary(markdown, fallbackPreview = '') {
    const body = stripFrontmatter(markdown);
    const coreView = body.match(/\*\*核心观点\*\*[：:]\s*(.+)/)?.[1]?.trim() || '';
    const intent = body.match(/\*\*意图识别\*\*[：:]\s*(.+)/)?.[1]?.trim() || '';
    const cognitiveAsset = body.match(/\*\*认知资产\*\*[：:]\s*(.+)/)?.[1]?.trim() || '';
    const rawContent = body
      .replace(/^# .+$/m, '')
      .replace(/^>.+$/gm, '')
      .replace(/^## .+$/gm, '')
      .trim();
    const preview = compactLines(rawContent || fallbackPreview, 5);
    return { coreView, intent, cognitiveAsset, preview };
  }

  function parseRawMarkdownPreview(text) {
    const raw = String(text || '');
    const lines = raw.split(/\r?\n/);
    const sliced = lines.slice(11).join('\n');
    return compactLines(sliced || raw, 5);
  }

  async function hydrateFocusResultsContent(focusResults, renderFocusResults) {
    const targets = focusResults.slice(0, 10);
    const jobs = targets.map(async (entry) => {
      const payload = entry.payload;
      const key = payload.keep_md_fid || payload.doc_id || payload.path_in_snapshot || payload.title;
      if (!key || resultContentCache.has(key)) return;
      if (inferDocKind(payload) === 'asset_card') {
        const url = assetCardUrl(payload);
        if (!url) {
          resultContentCache.set(key, parseAssetCardSummary('', payload.text_preview || ''));
          return;
        }
        try {
          const markdown = await loadText(url);
          resultContentCache.set(key, parseAssetCardSummary(markdown, payload.text_preview || ''));
        } catch {
          resultContentCache.set(key, parseAssetCardSummary('', payload.text_preview || ''));
        }
        return;
      }
      const mdUrl = nbssObjectUrl(payload.keep_md_fid);
      if (!mdUrl) {
        resultContentCache.set(key, {
          coreView: '',
          intent: '',
          cognitiveAsset: '',
          preview: parseRawMarkdownPreview(payload.text_preview || ''),
        });
        return;
      }
      try {
        const markdown = await loadText(mdUrl);
        resultContentCache.set(key, {
          coreView: '',
          intent: '',
          cognitiveAsset: '',
          preview: parseRawMarkdownPreview(markdown),
        });
      } catch {
        resultContentCache.set(key, {
          coreView: '',
          intent: '',
          cognitiveAsset: '',
          preview: parseRawMarkdownPreview(payload.text_preview || ''),
        });
      }
    });
    await Promise.all(jobs);
    renderFocusResults(true);
  }

  function renderFocusResults(focusResults, force = false) {
    if (!focusResults.length) {
      resultsSummaryEl.textContent = '当前视锥中心附近暂无可见文档。';
      resultsListEl.innerHTML = '<div class="results-empty">转动或缩放星球，列表会按视觉中心实时更新。</div>';
      return;
    }

    resultsSummaryEl.textContent = `视觉中心附近文档 ${focusResults.length} 条，按屏幕中心距离排序。`;
    const selectedPayload = getSelectedPayload();
    resultsListEl.innerHTML = focusResults.map((entry, idx) => {
      const payload = entry.payload;
      const isAssetCard = inferDocKind(payload) === 'asset_card';
      const emoji = isAssetCard ? '💎' : '📄';
      const title = `${emoji} ${payload.title || payload.path_in_snapshot || payload.doc_id || 'Untitled'}`;
      const compactMeta = compactMetaLabel(payload);
      const mdUrl = nbssObjectUrl(payload.keep_md_fid);
      const cardUrl = assetCardUrl(payload);
      const cacheKey = payload.keep_md_fid || payload.doc_id || payload.path_in_snapshot || payload.title;
      const cached = resultContentCache.get(cacheKey) || null;
      const preview = cached?.preview || parseRawMarkdownPreview(payload.text_preview || '');
      const selectedClass = selectedPayload && (
        (selectedPayload.keep_md_fid && payload.keep_md_fid && selectedPayload.keep_md_fid === payload.keep_md_fid) ||
        (selectedPayload.doc_id && payload.doc_id && selectedPayload.doc_id === payload.doc_id)
      ) ? ' is-selected' : '';
      const assetLines = isAssetCard ? `
        <div class="result-asset-lines">
          ${cached?.coreView ? `<div class="result-asset-line"><div class="result-asset-key">核心观点</div><div class="result-asset-value">${formatContent(cached.coreView)}</div></div>` : ''}
          ${cached?.intent ? `<div class="result-asset-line"><div class="result-asset-key">意图识别</div><div class="result-asset-value">${formatContent(cached.intent)}</div></div>` : ''}
          ${cached?.cognitiveAsset ? `<div class="result-asset-line"><div class="result-asset-key">认知资产</div><div class="result-asset-value">${formatContent(cached.cognitiveAsset)}</div></div>` : ''}
        </div>
      ` : '';
      const links = `
        <div class="result-links">
          ${mdUrl ? `<a class="result-link" href="${escapeHtml(mdUrl)}" target="_blank" rel="noreferrer">查看笔记原文</a>` : ''}
          ${cardUrl ? `<a class="result-link" href="${escapeHtml(cardUrl)}" target="_blank" rel="noreferrer">查看 AI 分析</a>` : ''}
        </div>
      `;
      return `
        <article class="result-card${selectedClass}${isAssetCard ? ' is-asset-card' : ''}">
          <div class="result-rank">
            <span>#${idx + 1} · 中心距离 ${entry.distance.toFixed(3)}</span>
            <span class="result-rank-meta">${escapeHtml(compactMeta)}</span>
          </div>
          <div class="result-title-wrap">
            <h2 class="result-title">${mdUrl ? `<a href="${escapeHtml(mdUrl)}" target="_blank" rel="noreferrer">${escapeHtml(title)}</a>` : escapeHtml(title)}</h2>
            ${links}
          </div>
          ${assetLines}
          ${!isAssetCard ? `<p class="result-preview">${escapeHtml(preview)}</p>` : ''}
        </article>
      `;
    }).join('');
  }

  return {
    hydrateFocusResultsContent,
    renderFocusResults,
  };
}
