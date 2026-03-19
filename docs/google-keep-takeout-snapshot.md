# Google Keep Takeout Snapshot Detection

This document defines how this repository recognizes that a `notFinder LLM Snapshot` is primarily a Google Keep takeout snapshot and is therefore eligible for Google Keep conversion, asset-card generation, and RAG ingestion.

The preferred name for the container format remains:

- **notFinder LLM Snapshot**

The Google Keep classification is a higher-level judgment about the contents inside the snapshot.

## Detection Philosophy

This is not treated as a strict protocol validation problem.

It is treated as a content-structure judgment:

- Does the snapshot primarily contain Google Keep note exports?
- Is there enough evidence to continue with the Keep pipeline?

The judgment should be made from evidence, not from a single magic marker.

## Strong Positive Signals

A snapshot is a strong Google Keep takeout candidate when most of the following are true:

1. Many note-like path pairs exist as `.json` and `.html`.
2. The `.json` note objects repeatedly contain Keep-style fields such as:
   - `title`
   - `createdTimestampUsec`
   - `userEditedTimestampUsec`
   - `isArchived`
   - `isPinned`
   - `isTrashed`
3. Many notes contain at least one of:
   - `textContent`
   - `textContentHtml`
   - `listContent`
4. Some notes may also contain:
   - `labels`
   - `annotations`
5. The `.html` companions are consistent with exported note renderings.

## Typical Keep JSON Shapes

Common text-note shape:

```json
{
  "title": "Example",
  "textContent": "...",
  "textContentHtml": "...",
  "createdTimestampUsec": 1770000000000000,
  "userEditedTimestampUsec": 1770000000000000,
  "isArchived": true,
  "isPinned": false,
  "isTrashed": false,
  "color": "DEFAULT",
  "labels": [{"name": "IDEA"}]
}
```

Common checklist-note shape:

```json
{
  "title": "Checklist",
  "listContent": [
    {"text": "Item A", "isChecked": false},
    {"text": "Item B", "isChecked": true}
  ],
  "createdTimestampUsec": 1770000000000000,
  "userEditedTimestampUsec": 1770000000000000,
  "isArchived": true,
  "isPinned": false,
  "isTrashed": false,
  "color": "DEFAULT"
}
```

## Negative Signals

Do not classify a snapshot as Google Keep takeout when one or more of these dominate:

1. Most `.json` files do not resemble note objects.
2. The snapshot mostly contains unrelated business exports, APIs, or arbitrary app payloads.
3. `.html` files are absent or clearly unrelated to note rendering.
4. Note-like records are rare compared with total content.

## Practical Decision Rule

Continue with the Keep pipeline only if:

1. The snapshot is a valid `notFinder LLM Snapshot`.
2. A substantial portion of note-like `.json` objects match the Keep field patterns above.
3. The snapshot appears to be primarily or materially composed of Google Keep note exports.

If these conditions are not met, stop and do not run:

- Keep JSON -> Markdown conversion
- Deep Asset Card generation
- Keep-note RAG ingestion

## Evidence From This Repository

The snapshot:

- `NBSS:0xC0D5E78ED81CE90F`

already shows strong Keep evidence:

- many `.json` / `.html` note pairs
- repeated Keep note schemas
- text notes, checklist notes, and annotation-bearing notes

Example repository primitives used on this snapshot:

- [parse_notfinder_llm_snapshot.py](/root/lux4-codexbrain/scripts/parse_notfinder_llm_snapshot.py)
- [google_keep_json_to_md.py](/root/lux4-codexbrain/scripts/google_keep_json_to_md.py)

## Future Skill Guidance

When this is later turned into a skill, the skill should:

1. First judge whether the snapshot is a Google Keep takeout snapshot.
2. State the evidence briefly.
3. Continue only if the evidence is strong enough.
4. Avoid pretending that every `notFinder LLM Snapshot` is automatically a Keep export.
