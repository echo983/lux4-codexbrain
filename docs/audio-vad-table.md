# Audio VAD Table

This repository adopts the `VAD table` pipeline from the NBSS audio workflow.

Canonical flow:

`source audio -> decode/normalize -> VAD -> turn adjudication -> finalized segment -> Whisper async -> VAD table`

Repository primitives:

- `scripts/nbss_audio_preprocessor.py`
- `scripts/nbss_audio_client.py`
- `scripts/nbss_turn_detector.py`
- `scripts/nbss_vad_client.py`
- `scripts/nbss_vad_table_builder.py`

Notes:

- the primary output object is an `AudioVADTable`
- source audio remains in NBSS
- normalized audio is stored as its own NBSS object when preprocessing is needed
- each finalized speech segment is stored as its own NBSS object
- segment transcription is asynchronous inside the builder
- current dependency bootstrap can load optional packages from:
  - `refs/nbssUse/.venv`
  - `/root/nbssUse/.venv`

Suggested `AudioVADTable` top-level fields:

- `type`
- `schema_version`
- `status`
- `source_audio_fid`
- `normalized_audio_fid`
- `sample_rate`
- `channels`
- `total_duration_sec`
- `segment_count`
- `speech_duration_sec`
- `speech_ratio`
- `primary_language`
- `is_multilingual`
- `segments`
- `vad_meta`

Each segment row should include:

- `segment_id`
- `start`
- `end`
- `duration`
- `audio_fid`
- `turn_complete`
- `turn_probability`
- `turn_source`
- `language`
- `language_confidence`
- `transcription_status`
- `text`
- `transcript_fid`
