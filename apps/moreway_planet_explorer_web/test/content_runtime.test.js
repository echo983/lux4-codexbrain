import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assetCardUrl,
  compactMetaLabel,
  inferDocKind,
  matchesNamespaceFilter,
  nbssObjectUrl,
  payloadNamespaceId,
  readPlanetUrlState,
} from '../src/content_runtime.js';

test('nbssObjectUrl normalizes NBSS fid', () => {
  globalThis.window = { location: { hostname: '192.168.1.66' } };
  assert.equal(nbssObjectUrl('NBSS:0xabc123'), 'http://192.168.1.66:8080/nbss/0xABC123');
  assert.equal(nbssObjectUrl('bad'), '');
});

test('inferDocKind prefers asset-card markers', () => {
  assert.equal(inferDocKind({ doc_kind: 'asset_card' }), 'asset_card');
  assert.equal(inferDocKind({ card_schema: 'deep_asset_card_v1' }), 'asset_card');
  assert.equal(inferDocKind({ card_schema: 'mobile_capture_asset_card_v1' }), 'asset_card');
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
    assetCardUrl({ doc_id: 'mobile_abc', card_schema: 'mobile_capture_asset_card_v1' }),
    '',
  );
  assert.equal(
    compactMetaLabel({ source_type: 'google_keep', created_at: '2026-03-23' }),
    'keep260323',
  );
  assert.equal(
    compactMetaLabel({ source_type: 'mobile_photo_group', card_created_at: '2026-03-28T18:01:25Z' }),
    'mobile260328',
  );
  assert.equal(compactMetaLabel({ source_type: 'custom' }), 'custom');
});

test('namespace helpers normalize payload and url state', () => {
  assert.equal(payloadNamespaceId({ namespace_id: ' ns_user_a13f09cd ' }), 'ns_user_a13f09cd');
  assert.equal(payloadNamespaceId({ namespaceId: 'ns_team_42d91ab0' }), 'ns_team_42d91ab0');
  assert.equal(matchesNamespaceFilter({ namespace_id: 'ns_user_a13f09cd' }, 'ns_user_a13f09cd'), true);
  assert.equal(matchesNamespaceFilter({ namespace_id: 'ns_other' }, 'ns_user_a13f09cd'), false);
  assert.deepEqual(readPlanetUrlState('?namespaceId=ns_user_a13f09cd'), {
    namespaceId: 'ns_user_a13f09cd',
  });
});
