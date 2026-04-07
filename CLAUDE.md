# CaseWare Note Visibility Extractor

## Project Purpose
One-time snapshot tool that extracts note/subnote visibility settings from CaseWare Cloud Smart Engagements (SE) author templates and writes them to an Excel spreadsheet.

## Project Structure
```
tools/              # Python scripts
  note_visibility_report.py
workflows/          # SOPs
  export_note_visibility.md
.tmp/               # Output files (gitignored, regenerated as needed)
.env                # CW_COOKIES (gitignored — expires each session)
```

See [workflows/export_note_visibility.md](workflows/export_note_visibility.md) for step-by-step run instructions.

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
- `visibility.conditions` — array of condition objects; contains flat `response` objects and `condition_group` objects (nested OR groups)

## Python Installation
The Python executable location depends on the machine. Known locations:
- **Work laptop (kenny.koo):** `C:\Users\kenny.koo\AppData\Local\Programs\Python\Python314\python.exe`
- **Original machine (Kenny):** `C:\Users\Kenny\AppData\Local\Programs\Python\Python314\python.exe`

Use the full path when running from bash (e.g. in Claude Code terminal), as `python` / `python3` / `py` are not on the bash PATH. PowerShell can use `python` directly.

If unsure which machine you're on, run:
```bash
find "/c/Users/$USER/AppData/Local" -name "python.exe" 2>/dev/null
```

## Running the Script
See [workflows/export_note_visibility.md](workflows/export_note_visibility.md) for full instructions.

```bash
# Test with sample data (no cookies needed)
python tools/note_visibility_report.py --mock

# See raw visibility JSON per section
python tools/note_visibility_report.py --debug
```

## How to Get engagementId and documentId
- **engagementId:** visible in the browser URL when viewing a template: `.../e/eng/{engagementId}/...`
- **documentId:** DevTools (F12) → Network → filter "section" → click the `section/get` POST → Payload tab → copy the `"value"` field from the filter

## Section Type Taxonomy (confirmed)
The API returns sections with a `type` field. Types fall into two categories:

**Container types** (excluded from output — structural wrappers with no meaningful title):
| Type | Example title | Notes |
|------|--------------|-------|
| `heading` | "Notes Area" | Top-level document area grouping |
| `note` | "Note" | Per-note wrapper; all have generic title "Note" |
| `settings` | "Settings" | Template settings section |
| `toc` | "Table of Contents" | Auto-generated TOC |

**Content types** (included in output — carry real titles and visibility):
| Type | Example |
|------|---------|
| `content` | "Cash - no cash flow" |
| `table` | "Statement of Financial Position" |
| `analysis` | "Analysis" |
| `grouping` | "Notice to Reader" |

Key finding: `[note]` type sections all have `title = "Note"` in the API — the user-visible note name is NOT stored on these containers. The actual meaningful titles and visibility conditions are on the child `[content]` sections. Visibility on `[note]` and its `[content]` child is identical (duplicated), so processing only `[content]` is sufficient.

Key finding: `[content]` sections that are children of `[note]` containers carry both the meaningful title AND the visibility conditions. `[note]` sections can be safely skipped.

## Confirmed Working
- Auth: full browser cookie string sent as `Cookie` request header via `CW_COOKIES` env var
- Main endpoint: `POST /api/v1.12.0/section/get` with document filter returns `{"count": N, "objects": [...]}`
- Section hierarchy: container types (`note`, `heading`, `settings`, `toc`) excluded from `ordered_titled_sections()`; `find_nearest_titled_ancestor()` also skips container types
- Section content: extracted from `specification.content` HTML field, stripped to plain text; untitled child sections (text bodies) are merged into the parent section's content column
- Visibility settings: `visibility.override` → "Use default settings" / "Show" / "Hide"; behavior derived as "Hide when" / "Show when"
- Condition structure confirmed: top-level `conditions` array contains flat `response` objects and `condition_group` objects (nested OR groups)

## Condition ID Resolution (confirmed working)
Conditions reference `checklistId`, `procedureId`, `responseId`. Resolution approach:

- **Endpoint:** `POST /api/v1.12.0/procedure/get` filtered by `field: "id"`
- **Procedure name:** `summaryNames.en` or strip HTML from `text` field
- **Response options (Yes/No etc.):** embedded in `settings.responseSets[].responses[]` on the procedure object — each has `id` and `name`
- **Checklist name (condition group label):** the `checklistId` is itself a procedure ID — fetch it via `procedure/get` filtered by `field: "id"` and read `summaryNames.en` or strip HTML from `text`. Do NOT walk up the `parentId` chain (that returns an ancestor's name, not the checklist's own name).

Key finding: `responseRows` on a procedure has no text — response labels come from `settings.responseSets`, NOT `responseRows`.

Key finding: `checklistId` values from conditions are NOT document IDs — they are procedure IDs. `document/get` returns a separate namespace and cannot resolve them.

Key finding: `checklistId.id` in conditions points to the **content ID** of the checklist document, not the document's own `id`. The document object has a `content` field whose value matches the `checklistId`. Resolution: `fetch_document_lookup()` indexes both `doc["id"]` and `doc["content"]` → label, so both map to `"number name"` (e.g. `"6-15 Financial statements optimiser"`).

The `build_id_lookup()` function fetches every unique `procedureId` individually and builds a flat `{id: name}` dict covering both procedure names and response option names.

## Column Layout (current)
| # | Column | Source |
|---|--------|--------|
| A | Template Name | TEMPLATES config |
| B | Note # | position counter |
| C | Note Title | `title` field of nearest non-container titled ancestor |
| D | Subnote # | section ID prefix |
| E | Subnote Title | `title` field of section |
| F | Section Content | `specification.content` stripped of HTML |
| G | Visibility Setting | `visibility.override` |
| H | Visibility Behavior | derived from override + normallyVisible |
| I | Condition Group | checklist name resolved via `procedure/get` by checklist ID |
| J | Condition Name | procedure name from `summaryNames.en` or stripped `text` |
| K | Expected Response | response label from `settings.responseSets[].responses[]` |
