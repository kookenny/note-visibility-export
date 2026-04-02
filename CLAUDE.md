# CaseWare Note Visibility Extractor

## Project Purpose
One-time snapshot tool that extracts note/subnote visibility settings from CaseWare Cloud Smart Engagements (SE) author templates and writes them to an Excel spreadsheet.

## Key File
- `note_visibility_report.py` — the single script; run with `--mock` to test without API access

## API Details
- **Platform:** CaseWare Cloud (internal), hosted at `https://ca.cwcloudpartner.com`
- **Auth:** Cookie-based (JSESSIONID + secid from browser session) — **not** OAuth
- **Main endpoint:** `POST /{tenant}/e/eng/{engagementId}/api/v1.12.0/section/get`
- **Filter pattern to fetch all sections for a document:**
  ```json
  {"filter": {"filter": {"node": "=", "left": {"node": "field", "kind": "section", "field": "document"}, "right": {"node": "string", "value": "<documentId>"}}}}
  ```

## Data Structure
Each section object returned by the API has:
- `id`, `parent`, `order`, `title` — used to build the note → subnote hierarchy
- `parent` = `documentId` → top-level note; `parent` = another section id → subnote
- `order` — fractional-index string; sort lexicographically to get display order
- `visibility.override` — `"default"` | `"show"` | `"hide"`
- `visibility.normallyVisible` — boolean
- `visibility.allConditionsNeeded` — AND (true) / OR (false) logic
- `visibility.conditions` — array of condition objects (structure TBD; use `--debug` to inspect live data)

## Running the Script
```powershell
# Test with sample data (no cookies needed)
python note_visibility_report.py --mock

# Live run (PowerShell)
$env:CW_COOKIES="<full cookie string>"
python note_visibility_report.py

# See raw visibility JSON per section
python note_visibility_report.py --debug
```

## How to Get Your Cookie String
1. Open the template in the browser with DevTools open (F12)
2. Network tab → filter by "section" → click any `section/get` POST request
3. Headers tab → scroll to **Request Headers** → find the `cookie:` line
4. Copy the entire value (semicolon-separated, includes `secid`, `JSESSIONID`, `__username__`, etc.)
5. Paste as `$env:CW_COOKIES="..."` in PowerShell before running

Cookies expire when the browser session ends — re-copy if you get auth errors.

## How to Get engagementId and documentId
- **engagementId:** visible in the browser URL when viewing a template: `.../e/eng/{engagementId}/...`
- **documentId:** DevTools (F12) → Network → filter "section" → click the `section/get` POST → Payload tab → copy the `"value"` field from the filter

## Confirmed Working
- Auth: full browser cookie string sent as `Cookie` request header via `CW_COOKIES` env var
- Main endpoint: `POST /api/v1.12.0/section/get` with document filter returns `{"count": N, "objects": [...]}`
- Section hierarchy: top-level notes identified by parent NOT being in the returned section id set; full tree traversal via `ordered_titled_sections()`
- Section content: extracted from `specification.content` HTML field, stripped to plain text
- Visibility settings: `visibility.override` → "Use default settings" / "Show" / "Hide"; behavior derived as "Hide when" / "Show when"
- Condition structure confirmed: top-level `conditions` array contains flat `response` objects and `condition_group` objects (nested OR groups)

## Condition ID Resolution (confirmed working)
Conditions reference `checklistId`, `procedureId`, `responseId`. Resolution approach:

- **Endpoint:** `POST /api/v1.12.0/procedure/get` filtered by `field: "id"`
- **Procedure name:** `summaryNames.en` or strip HTML from `text` field
- **Response options (Yes/No etc.):** embedded in `settings.responseSets[].responses[]` on the procedure object — each has `id` and `name`
- **Checklist name (condition group label):** fetched via `fetch_procedures_for_checklist()` using `checklistId` filter on `procedure/get`

Key finding: `responseRows` on a procedure has no text — response labels come from `settings.responseSets`, NOT `responseRows`.

The `build_id_lookup()` function fetches every unique `procedureId` individually and builds a flat `{id: name}` dict covering both procedure names and response option names.

## Column Layout (current)
| # | Column | Source |
|---|--------|--------|
| A | Template Name | TEMPLATES config |
| B | Note # | position counter |
| C | Note Title | `title` field of nearest titled ancestor |
| D | Subnote # | section ID prefix |
| E | Subnote Title | `title` field of section |
| F | Section Content | `specification.content` stripped of HTML |
| G | Visibility Setting | `visibility.override` |
| H | Visibility Behavior | derived from override + normallyVisible |
| I | Condition Group | checklist name (unresolved — shows ID prefix) |
| J | Condition Name | procedure name (unresolved — shows ID prefix) |
| K | Expected Response | response name (unresolved — shows ID prefix) |
