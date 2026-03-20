# PVLog Head

This repository uses the name **PVLog Head** for the binary snapshot entry object stored in NBSS with the `PVLOGHD^` magic.

It is not a text manifest. It is the binary entry point for reconstructing the live file world by following linked `PVLOGSG^` segments.

## Repository Primitive

Use:

```bash
python3 scripts/parse_pvlog_head.py inspect NBSS:0xD2F8984FDFC41007
```

Or a bare FID:

```bash
python3 scripts/parse_pvlog_head.py list 0xD2F8984FDFC41007
```

To read a projected file:

```bash
python3 scripts/parse_pvlog_head.py read 0xD2F8984FDFC41007 ".notFinder/me"
```

## Binary Layout

### Head

- magic: `PVLOGHD^`
- version: little-endian `u32`
- current segment fid: little-endian `u64`

### Segment

- magic: `PVLOGSG^`
- version: little-endian `u32`
- previous segment fid: little-endian `u64`
- record count: little-endian `u32`
- record payload area

## Supported Record Types

- `MKDIR` (`raw_type=1`)
- `FILE_V1` direct (`raw_type=2`)
- `FILE_V1_MANIFEST` (`raw_type=3`)
- `FILE_V2` overlay/versioned (`raw_type=8`)

`FILE_V2` records expose:

- `path`
- `vid`
- optional `prev_vid`
- `size`
- `ts`
- `base_ref`

`base_ref` currently supports:

- `DIRECT`
- `MANIFEST`
- `VERSION`

## Current Behavior

- `inspect` prints JSON metadata and projected path samples
- `inspect --full` includes parsed segments and records
- `list` prints the latest visible path set
- `read` walks records from newest to oldest and resolves the first readable backing object for the target path
