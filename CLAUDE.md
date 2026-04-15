# Caseware Note Visibility Extractor

## Project Purpose
One-time snapshot tool that extracts note/subnote visibility settings from Caseware Cloud Smart Engagements (SE) author templates and writes them to an Excel spreadsheet.

## Project Structure
```
tools/              # Python scripts
  note_visibility_report.py
web/                # Flask web frontend
  app.py            #   Backend (serves UI + /api/generate endpoint)
  static/
    index.html      #   Single-page UI
    styles.css      #   Caseware design system CSS
    app.js          #   URL parsing, fetch, download logic
workflows/          # SOPs + SDK/platform reference docs
  export_note_visibility.md
  API-Quick-Reference.md, Cloud-SDK-Platform.md, Desktop-SDK-Reference.md,
  SDK-Overview.md, SE-Authoring-Guide.md, SE-Tutorials-Reference.md,
  Sherlock-API.md
docs/               # Caseware domain knowledge (cross-project reuse)
  caseware-cloud-api.md, caseware-data-*.md, caseware-design-system.md
.tmp/               # Output files (gitignored, regenerated as needed)
.env                # Per-environment OAuth credentials (CW_CA_*, CW_US_*, etc.) or CW_COOKIES (gitignored)
requirements.txt    # Python dependencies
```

See [workflows/export_note_visibility.md](workflows/export_note_visibility.md) for step-by-step run instructions.

## Web UI
The preferred way to generate reports. Paste a Caseware document URL and click Generate.

```bash
pip install -r requirements.txt
python web/app.py
# Open http://localhost:5000
```

The URL field auto-extracts `tenant`, `engagementId`, and `documentId` from the pasted URL. The optional Report Name field controls the download filename.

## API Details
- **Platform:** Caseware Cloud (internal), hosted at `https://ca.cwcloudpartner.com`
- **Auth:** Per-environment OAuth client credentials (preferred, 30-min token) or cookie-based fallback. Credentials are keyed by hostname prefix: `CW_CA_CLIENT_ID` for `ca.cwcloudpartner.com`, `CW_US_CLIENT_ID` for `us.cwcloudpartner.com`, etc. Falls back to generic `CW_CLIENT_ID` if no prefixed vars exist.
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
- `tagging.component` — `{categoryId: [tagId, ...]}` mapping; tag names resolved via `tag/get` endpoint (tags with `subKind: "component"`)

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

Key finding: `[note]` type sections all have `title = "Note"` in the API — the user-visible note name is NOT stored on these containers. The actual meaningful titles are on the child `[content]` sections.

Key finding: Visibility conditions primarily live on `[note]` container sections (420 vs 30 on `[content]`). They are NOT reliably duplicated onto child `[content]` sections. The code uses `_effective_visibility()` to walk up the parent chain and inherit conditions from the nearest ancestor that carries them.

Key finding: The Hide/Show direction is derived from `visibility.normallyVisible`, NOT from `visibility.override`. `normallyVisible=false` → "Show when" (normally hidden, shows when conditions met; 418/420 note sections); `normallyVisible=true` → "Hide when" (normally visible, hides when conditions met). The `override` field is almost always `"default"` when conditions are present.

## Confirmed Working
- Auth: Per-environment OAuth via `CW_{PREFIX}_CLIENT_ID` + `CW_{PREFIX}_CLIENT_SECRET` (e.g. `CW_CA_*`, `CW_US_*`); falls back to generic `CW_CLIENT_ID` + `CW_CLIENT_SECRET`, then to browser cookie string via `CW_COOKIES`
- Main endpoint: `POST /api/v1.12.0/section/get` with document filter returns `{"count": N, "objects": [...]}`
- Section hierarchy: container types (`note`, `heading`, `settings`, `toc`) excluded from `ordered_titled_sections()`; `find_nearest_titled_ancestor()` also skips container types
- Section content: extracted from `specification.content` HTML field, stripped to plain text; placeholder spans wrapped in `(( ))`; dynamic-text formula spans resolved via section attachables and wrapped in `[[ ]]`; untitled child sections (text bodies) are merged into the parent section's content column
- Visibility settings: `_effective_visibility()` walks up parent chain to inherit conditions from `[note]` containers; Hide/Show direction derived from `normallyVisible` (false→"Show when", true→"Hide when"); `override` field rarely set to anything other than `"default"`
- Condition structure confirmed: top-level `conditions` array contains flat `response` objects, `condition_group` objects (nested OR groups), `organization_type` conditions (entity-level org type), and `consolidation` conditions
- Components: `section.tagging.component` maps `{categoryId: [tagId]}` → resolved via `tag/get` endpoint filtering for `subKind: "component"`; tag `name` field has the human-readable label (e.g. "NFP")

## Condition ID Resolution (confirmed working)
Conditions reference `checklistId`, `procedureId`, `responseId`. Resolution approach:

- **Endpoint:** `POST /api/v1.12.0/procedure/get` filtered by `field: "id"`
- **Procedure name:** `summaryNames.en` or strip HTML from `text` field
- **Response options (Yes/No etc.):** resolved from three sources in priority order:
  1. Checklist-level defaults: `checklist/get` → `settings.responseSets[].responses[]` — these are the default response sets (e.g. Yes/No) that procedures inherit
  2. Sibling procedures: `procedure/get` filtered by `checklistId` → any procedure in the same checklist may define `settings.responseSets[].responses[]`
  3. The referenced procedure itself: `procedure/get` by `id` → `settings.responseSets[].responses[]`
- **Checklist name (condition group label):** the `checklistId` is itself a procedure ID — fetch it via `procedure/get` filtered by `field: "id"` and read `summaryNames.en` or strip HTML from `text`. Do NOT walk up the `parentId` chain (that returns an ancestor's name, not the checklist's own name).

Key finding: `responseRows` on a procedure has no text — response labels come from `settings.responseSets`, NOT `responseRows`.

Key finding: `checklistId` values from conditions are NOT document IDs — they are procedure IDs. `document/get` returns a separate namespace and cannot resolve them.

Key finding: `checklistId.id` in conditions points to the **content ID** of the checklist document, not the document's own `id`. The document object has a `content` field whose value matches the `checklistId`. Resolution: `fetch_document_lookup()` indexes both `doc["id"]` and `doc["content"]` → label, so both map to `"number name"` (e.g. `"6-15 Financial statements optimiser"`).

The `build_id_lookup()` function builds a flat `{id: name}` dict by: (1) fetching checklist-level default responseSets via `checklist/get`, (2) fetching all procedures per referenced checklist to pick up sibling responseSets, and (3) fetching individually-referenced procedures for their names and any remaining responseSets.

## Organization Type Conditions
Conditions with `type: "organization_type"` reference entity-level organization types (e.g. "CCPC", "S-Corporation") set on the Entity in Caseware Collaborate. The condition object is self-contained with these fields:
- `organizationType` — broad category string (e.g. `"corporation"`, `"partnership"`, `"individual"`, `"public_company"`)
- `customOrganizationTypeId` — specific type as PascalCase string (e.g. `"CorporationControlledPrivateCorporation"`, `"GeneralPartnership"`)
- `countryCode` — e.g. `"CA"`, `"US"`

Resolution uses a static `_ORG_TYPE_LABELS` mapping (covers CA and US org types). Falls back to PascalCase splitting for unknown values. No API call needed.

## Consolidation Conditions
Conditions with `type: "consolidation"` have a boolean `consolidated` field. Displayed as Condition Name = "Consolidation", Expected Response = "Consolidated" or "Not consolidated".

## Column Layout (current)
| # | Column | Source |
|---|--------|--------|
| A | Note Group Title | title of top-level grouping ancestor |
| B | Note Title | `title` field of nearest non-container titled ancestor |
| C | Subnote Title | `title` field of section |
| D | Content Title | leaf section title |
| E | Section Content | `specification.content` stripped of HTML; placeholders in `(( ))`, dynamic text in `[[ ]]` |
| F | Visibility | "Hide when" / "Show when" / "Hide" / "Show" / "Use default settings" — shown only on the first condition row per section |
| G | Condition Group | checklist name — shown only on the first row of each group |
| H | Condition Name | procedure name from `summaryNames.en` or stripped `text`; or "Organization Type" / "Consolidation" for entity-level conditions |
| I | Expected Response | response label from `settings.responseSets[].responses[]`; or org type name / "Consolidated" for entity-level conditions |
| J | Components | comma-separated component tag names from `tagging.component` |
