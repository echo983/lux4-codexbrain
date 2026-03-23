import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assetCardUrl,
  compactMetaLabel,
  inferDocKind,
  nbssObjectUrl,
} from '../src/content_runtime.js';

test('nbssObjectUrl normalizes NBSS fid', () => {
  globalThis.window = { location: { hostname: '192.168.1.66' } };
  assert.equal(nbssObjectUrl('NBSS:0xabc123'), 'http://192.168.1.66:8080/nbss/0xABC123');
  assert.equal(nbssObjectUrl('bad'), '');
});

test('inferDocKind prefers asset-card markers', () => {
  assert.equal(inferDocKind({ doc_kind: 'asset_card' }), 'asset_card');
  assert.equal(inferDocKind({ card_schema: 'deep_asset_card_v1' }), 'asset_card');
  assert.equal(inferDocKind({ table: 'google_keep_asset_cards_directmd_eval200' }), 'asset_card');
  assert.equal(inferDocKind({ doc_id: 'keep_123' }), 'asset_card');
  assert.equal(inferDocKind({ doc_id: 'raw_123' }), 'raw_text');
});

test('assetCardUrl and compactMetaLabel build compact stable values', () => {
  assert.equal(
    assetCardUrl({ doc_id: 'keep_abc', table: 'google_keep_asset_cards_directmd_eval200' }),
    '/var/google_keep_asset_cards_directmd_eval200/keep_abc.md',
  );
  assert.equal(
    compactMetaLabel({ source_type: 'google_keep', created_at: '2026-03-23' }),
    'keep260323',
  );
  assert.equal(compactMetaLabel({ source_type: 'custom' }), 'custom');
});
