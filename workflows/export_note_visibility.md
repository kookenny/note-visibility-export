# Workflow: Export Note Visibility Settings

## Objective
Extract note/subnote visibility settings from a CaseWare Cloud SE author template and write them to an Excel spreadsheet.

## Inputs Required
- Fresh browser cookies from an active CaseWare Cloud session
- `engagementId` — from the browser URL: `.../e/eng/{engagementId}/...`
- `documentId` — from DevTools → Network → section/get POST → Payload → the filter `"value"` field

## Steps

### 1. Get fresh cookies
1. Open the template in Chrome/Edge with DevTools open (F12)
2. Network tab → filter by `section` → click any `section/get` POST request
3. Headers tab → scroll to **Request Headers** → find the `cookie:` line
4. Copy the entire value (everything after `cookie: `)
5. Paste into `.env` as `CW_COOKIES=<value>`

> Cookies expire when the browser session ends. If you get a 401 error, repeat this step.

### 2. Configure templates
Edit `TEMPLATES` in `tools/note_visibility_report.py`:
```python
TEMPLATES = [
    ("Template A", "<engagementId>", "<documentId>"),
]
```

### 3. Run the tool
From the project root:
```bash
CW_COOKIES="$(grep CW_COOKIES .env | cut -d= -f2-)" /c/Users/kenny.koo/AppData/Local/Programs/Python/Python314/python.exe tools/note_visibility_report.py
```

Output is written to `.tmp/note_visibility_report.xlsx`.

### 4. Test without API access
```bash
/c/Users/kenny.koo/AppData/Local/Programs/Python/Python314/python.exe tools/note_visibility_report.py --mock
```

## Output
`.tmp/note_visibility_report.xlsx` — formatted spreadsheet with columns:
Template Name, Note #, Note Title, Subnote #, Subnote Title, Section Content, Visibility Setting, Visibility Behavior, Condition Group, Condition Name, Expected Response

## Edge Cases
- **401 Unauthorised** — cookies expired; re-copy from browser
- **No sections returned** — check `engagementId` and `documentId` are correct
- **File locked** — close the `.xlsx` in Excel before re-running
- **Python not found in bash** — use full path; see Python Installation in CLAUDE.md
