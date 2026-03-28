import test from 'node:test';
import assert from 'node:assert/strict';

import { createResultsPanel } from '../src/results_panel.js';

function makeElements() {
  return {
    resultsSummaryEl: { textContent: '' },
    resultsListEl: { innerHTML: '' },
  };
}

test('results panel renders empty state', () => {
  const { resultsSummaryEl, resultsListEl } = makeElements();
  const panel = createResultsPanel({
    resultsSummaryEl,
    resultsListEl,
    activeNamespaceId: '',
    inferDocKind: () => 'raw_text',
    compactMetaLabel: () => 'keep260323',
    nbssObjectUrl: () => '',
    assetCardUrl: () => '',
    getSelectedPayload: () => null,
    loadText: async () => '',
  });

  panel.renderFocusResults([]);

  assert.match(resultsSummaryEl.textContent, /暂无可见文档/);
  assert.match(resultsListEl.innerHTML, /results-empty/);
});

test('results panel hydrates and renders asset card summary fields', async () => {
  const { resultsSummaryEl, resultsListEl } = makeElements();
  const panel = createResultsPanel({
    resultsSummaryEl,
    resultsListEl,
    activeNamespaceId: '',
    inferDocKind: () => 'asset_card',
    compactMetaLabel: () => 'keep260323',
    nbssObjectUrl: () => 'http://example/raw.md',
    assetCardUrl: () => 'http://example/card.md',
    getSelectedPayload: () => null,
    loadText: async () => [
      '# 标题',
      '**核心观点**：核心内容',
      '**意图识别**：帮助理解',
      '**认知资产**：抽象框架',
    ].join('\n'),
  });

  const focusResults = [
    {
      distance: 0.12,
      payload: {
        doc_id: 'keep_1',
        keep_md_fid: 'NBSS:0x1',
        title: '测试卡片',
        text_preview: '',
      },
    },
  ];

  panel.renderFocusResults(focusResults);
  await panel.hydrateFocusResultsContent(focusResults, (force) => panel.renderFocusResults(focusResults, force));

  assert.match(resultsSummaryEl.textContent, /1 条/);
  assert.match(resultsListEl.innerHTML, /核心观点/);
  assert.match(resultsListEl.innerHTML, /意图识别/);
  assert.match(resultsListEl.innerHTML, /认知资产/);
});

test('results panel renders mobile capture asset cards without keep markdown fetch', async () => {
  const { resultsSummaryEl, resultsListEl } = makeElements();
  let loadCalls = 0;
  const panel = createResultsPanel({
    resultsSummaryEl,
    resultsListEl,
    activeNamespaceId: 'ns_lab_4ac91e20',
    inferDocKind: () => 'asset_card',
    compactMetaLabel: () => 'mobile260328',
    nbssObjectUrl: () => '',
    assetCardUrl: () => '',
    getSelectedPayload: () => null,
    loadText: async () => {
      loadCalls += 1;
      return '';
    },
  });

  const focusResults = [
    {
      distance: 0.08,
      payload: {
        doc_id: 'mobile_capture_1',
        card_schema: 'mobile_capture_asset_card_v1',
        title: '检验报告领取说明',
        summary: '西班牙巴塞罗那实验室的检验结果领取与线上查询说明。',
        content_completeness: 'partial',
        observation_confidence: 'medium',
        text_preview: '',
      },
    },
  ];

  panel.renderFocusResults(focusResults);
  await panel.hydrateFocusResultsContent(focusResults, (force) => panel.renderFocusResults(focusResults, force));

  assert.equal(loadCalls, 0);
  assert.match(resultsSummaryEl.textContent, /namespace=ns_lab_4ac91e20/);
  assert.match(resultsSummaryEl.textContent, /1 条/);
  assert.match(resultsListEl.innerHTML, /检验报告领取说明/);
  assert.match(resultsListEl.innerHTML, /巴塞罗那实验室/);
  assert.match(resultsListEl.innerHTML, /完整度：partial/);
  assert.match(resultsListEl.innerHTML, /观察置信度：medium/);
});
