# Google Keep Deep Asset Card Evaluation

This document records early real-snapshot quality checks for Deep Asset Cards generated from the notFinder Google Keep takeout snapshot:

- `NBSS:0xC0D5E78ED81CE90F`

## Evaluation Runs

### Run A: 10 medium-length notes

- Output directory:
  - `var/google_keep_asset_cards_eval10_v3/`
- Result:
  - 10/10 cards generated successfully
  - required source FID metadata present
  - `priority` normalized to stable enum values
  - `category_path` normalized to slash-delimited taxonomy strings
  - malformed JSON from the model no longer breaks the whole run

Observed quality:

- Overall quality is good enough to continue
- Technical and theory notes produce useful retrieval anchors
- Chinese-first output is much more stable than earlier drafts
- Some cards still overstate abstraction slightly, but not enough to block retrieval use

Conclusion:

- Deep Asset Card generation is viable for medium-length Google Keep notes
- Current quality is suitable for continued retrieval pipeline work

### Run B: 10 random notes across varied lengths, parallelized

- Output directory:
  - `var/google_keep_asset_cards_eval10_random_v1/`
- Seed:
  - `20260318`
- Generation workers:
  - `4`
- Result:
  - 10/10 cards generated successfully
  - parallel generation completed without corrupting output structure
  - quality remained broadly consistent across mixed note sizes and subjects

Observed quality:

- Stronger notes:
  - technical designs
  - abstract frameworks
  - structured research notes
- Weaker notes:
  - some short notes
  - some creative or fictional notes
- Remaining issue:
  - `priority` is still biased high
  - some short or imaginative notes get mildly over-interpreted

Conclusion:

- The quality conclusion from the medium-note run still holds under random mixed-length sampling
- The current card format is stable enough for broader ingestion and retrieval experiments
- Further prompt tuning is optional, not mandatory for the next step

## Practical Decision

At this stage:

- continue with batch card generation
- ingest cards into LanceDB
- validate retrieval quality on real queries

Do not block on further card-template polishing unless retrieval tests reveal concrete failures.
