# notFinder LLM Snapshot

This repository uses the name **notFinder LLM Snapshot** for the text snapshot format exported by the notFinder file system on top of NBSS.

It is a text manifest format intended for LLM and agent consumption rather than a normal end-user document.

## Source Example

- `NBSS:0xC0D5E78ED81CE90F`

## Header Fields

Typical header fields:

- `endpoint`
- `internal_name`
- `version`
- `head_fid`
- `exported_at_ms`
- `columns`

Example:

```text
endpoint: http://192.168.1.66:9090
internal_name: ...
version: 2
head_fid: 0xB9AABC405F658FC7
exported_at_ms: 1773797747266
columns: pid    vid    prev    fid    size    mode    ts
```

## Sections

### `paths:`

The `paths:` section is a `pid -> path` mapping table.

Example:

```text
paths:
0    .notFinder/me
1    1024密码.html
2    1024密码.json
```

### Record Table

After the path map, the manifest contains one tab-separated record per versioned object.

Columns are declared in the header. In version 2 the common columns are:

- `pid`
- `vid`
- `prev`
- `fid`
- `size`
- `mode`
- `ts`

Interpretation:

- `pid`: path id that resolves through the `paths:` table
- `vid`: version id
- `prev`: previous version id, or `-`
- `fid`: underlying NBSS object reference
- `size`: payload size in bytes
- `mode`: mode/type field from exporter
- `ts`: timestamp in milliseconds

## Intended Use

This format is useful for:

- enumerating snapshot contents
- recovering the path dictionary
- reading version chains
- locating the underlying NBSS object ids referenced by the snapshot

It is not itself the projected file contents. It is a snapshot manifest.

## Repository Primitive

Use:

```bash
python3 scripts/parse_notfinder_llm_snapshot.py NBSS:0xC0D5E78ED81CE90F --summary-only
```

Or parse a downloaded local file:

```bash
python3 scripts/parse_notfinder_llm_snapshot.py ./snapshot.txt
```
