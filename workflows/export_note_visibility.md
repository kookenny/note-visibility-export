# Workflow: Export Note Visibility Settings

## Objective
Extract note/subnote visibility settings from a Caseware Cloud SE author template and write them to an Excel spreadsheet.

## Prerequisites
- `.env` with `CW_CLIENT_ID` + `CW_CLIENT_SECRET` (OAuth, preferred) or `CW_COOKIES` (cookie fallback)
- Python dependencies: `pip install -r requirements.txt`

## Option A: Web UI (recommended)

1. Start the server: `python web/app.py`
2. Open http://localhost:5000
3. Paste a Caseware document URL (e.g. `https://ca.cwcloudpartner.com/{tenant}/e/eng/{engagementId}/index.jsp#/efinancials/{documentId}`)
4. Optionally enter a Report Name (used in the download filename)
5. Click **Generate Report** — the Excel file downloads automatically

## Option B: CLI

### 1. Configure auth
Set OAuth credentials in `.env` (preferred):
```
CW_CLIENT_ID=...
CW_CLIENT_SECRET=...
```

Or fall back to browser cookies:
1. Open the template in Chrome/Edge with DevTools open (F12)
2. Network tab → filter by `section` → click any `section/get` POST request
3. Headers tab → copy the `cookie:` value
4. Paste into `.env` as `CW_COOKIES=<value>`

> Cookies expire when the browser session ends. If you get a 401 error, re-copy them.

### 2. Configure templates
Edit `TEMPLATES` in `tools/note_visibility_report.py`:
```python
TEMPLATES = [
    ("Template A", "<engagementId>", "<documentId>"),
]
```

### 3. Run the tool
```bash
python tools/note_visibility_report.py
```

Output is written to `.tmp/note_visibility_report.xlsx`.

### 4. Test without API access
```bash
python tools/note_visibility_report.py --mock
```

## Output
Excel spreadsheet with columns:
Note Group Title, Note #, Note Title, Subnote Letter, Subnote Title, Item Numeral, Content Title, Section Content, Visibility, Condition Group, Condition Name, Expected Response, Components

## Edge Cases
- **401 Unauthorised** — cookies expired or OAuth credentials invalid
- **No sections returned** — check `engagementId` and `documentId` are correct
- **File locked** — close the `.xlsx` in Excel before re-running (CLI only)
- **Python not found in bash** — use full path; see Python Installation in CLAUDE.md
