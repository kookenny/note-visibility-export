# Caseware Note Visibility Extractor

Extracts note/subnote visibility settings from Caseware Cloud Smart Engagement (SE) author templates and writes them to an Excel spreadsheet.

## Setup

```bash
pip install -r requirements.txt
```

Create a `.env` file with per-environment OAuth credentials (see `CLAUDE.md` for details):

```
# Canada
CW_CA_CLIENT_ID=...
CW_CA_CLIENT_SECRET=...

# United States
CW_US_CLIENT_ID=...
CW_US_CLIENT_SECRET=...

# Europe
CW_EU_CLIENT_ID=...
CW_EU_CLIENT_SECRET=...
```

## Usage

### Web UI (preferred)

```bash
python web/app.py
# Open http://localhost:5000
```

Paste a Caseware document URL, optionally set a report name, and click Generate.

### CLI

```bash
python tools/note_visibility_report.py --mock    # Test with sample data
python tools/note_visibility_report.py --debug   # See raw visibility JSON
```

See [workflows/export_note_visibility.md](workflows/export_note_visibility.md) for full run instructions.

## Project Structure

```
tools/              Python scripts (note_visibility_report.py)
web/                Flask web frontend (app.py + static assets)
workflows/          SOPs and SDK/platform reference docs
docs/               Caseware domain knowledge docs (cross-project reuse)
.tmp/               Output files (gitignored)
```
