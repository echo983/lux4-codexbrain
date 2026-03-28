export function nbssObjectUrl(fid) {
  const value = String(fid || '').trim();
  const match = value.match(/^NBSS:0x([0-9A-Fa-f]+)$/);
  if (!match) return '';
  return `http://${window.location.hostname}:8080/nbss/0x${match[1].toUpperCase()}`;
}

export function normalizeNamespaceId(value) {
  const text = String(value || '').trim();
  return text || '';
}

export function payloadNamespaceId(payload) {
  return normalizeNamespaceId(payload?.namespace_id || payload?.namespaceId);
}

export function matchesNamespaceFilter(payload, namespaceId) {
  const activeNamespaceId = normalizeNamespaceId(namespaceId);
  if (!activeNamespaceId) return true;
  return payloadNamespaceId(payload) === activeNamespaceId;
}

export function readPlanetUrlState(search = window.location.search) {
  const params = new URLSearchParams(search || '');
  return {
    namespaceId: normalizeNamespaceId(params.get('namespaceId')),
  };
}

export function inferDocKind(payload) {
  if (payload.doc_kind === 'asset_card') return 'asset_card';
  if (String(payload.card_schema || '').trim()) return 'asset_card';
  if (payload.table === 'google_keep_asset_cards_directmd_eval200') return 'asset_card';
  if (String(payload.doc_id || '').startsWith('keep_')) return 'asset_card';
  return 'raw_text';
}

export function assetCardUrl(payload) {
  if (inferDocKind(payload) !== 'asset_card' || !payload.doc_id) return '';
  if (payload.card_schema && payload.card_schema !== 'deep_asset_card_v1') return '';
  return `/var/google_keep_asset_cards_directmd_eval200/${encodeURIComponent(payload.doc_id)}.md`;
}

export function compactMetaLabel(payload) {
  const source = payload.source_type === 'google_keep' ? 'keep' : String(payload.source_type || 'doc').slice(0, 6);
  const rawDate = String(payload.card_created_at || payload.created_at || '').trim();
  const date = rawDate.slice(0, 10);
  const normalized = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!normalized) return source;
  return `${source}${normalized[1].slice(2)}${normalized[2]}${normalized[3]}`;
}

export async function loadText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}
