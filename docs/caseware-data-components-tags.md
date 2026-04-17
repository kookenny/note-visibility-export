# Caseware Data Model: Components & Tags

## Overview

Sections can be tagged with "components" — labels like "NFP", "Charities and foundation" that categorize content by applicability. These are stored in the section's `tagging` field and resolved via the `tag/get` endpoint.

## Section Tagging Structure

```json
{
  "tagging": {
    "component": {
      "<categoryId>": ["<tagId>", "<tagId>", ...],
      "<categoryId>": ["<tagId>"]
    }
  }
}
```

- `tagging.component` is a map of `{categoryId: [tagId, ...]}`
- Categories group related tags; the category ID itself is not needed for display
- Multiple categories can exist; each contains one or more tag IDs

## Tag Resolution

**Endpoint:** `POST tag/get` with empty body `{}`

Returns all tags in the engagement. Filter **client-side** by `subKind: "component"` to isolate component tags.

**Tag object shape:**
```json
{
  "id": "tag-uuid",
  "name": "NFP",
  "subKind": "component",
  ...
}
```

The `name` field contains the human-readable label.

## Building Component Strings

1. Fetch all tags once per engagement -> build `{tagId: name}` lookup (filtered to `subKind: "component"`)
2. For each section, iterate all `tagging.component` category values
3. Resolve each `tagId` via the lookup
4. **Deduplicate** (same tag can appear in multiple categories)
5. **Sort alphabetically** for consistent display
6. **Join with comma** -> e.g. `"Charities and foundation, NFP"`

## Usage in Output

Components appear as a single comma-separated string in the report's Components column, providing at-a-glance visibility into which content applies to which entity types.

## Financial Tag Lookup

Tags with `subKind: "financial"` represent trial balance line items (e.g. "Cash & cash equivalents"). They are referenced in `tag`-type visibility conditions (financial group conditions). The `build_financial_tag_lookup()` function builds a `{tag_id: "number name"}` map from `tag/get` results filtered to `subKind: "financial"`, using `name`, `names.en`, or first available language value, prefixed with the tag's `number` field if present.

To avoid duplicate API calls, `fetch_all_tags()` fetches all tags once and the result is shared between `fetch_component_lookup()` and `build_financial_tag_lookup()`.

## Other Tag SubKinds

The `tag/get` endpoint returns tags with various `subKind` values beyond `"component"`:

| subKind | Description | Used by |
|---------|-------------|---------|
| `component` | Content applicability labels (NFP, Commercial, etc.) | Sections, Procedures |
| `assertion` | The 5 AICPA assertions (C, E, A, V, PD) — number field = abbreviation | Reference only |
| `baseassertion` | 14 detailed sub-assertions under CoT and AB groups | Procedure tagging |
| `area` | Financial statement areas (Cash, Receivables, etc.) | RMM conditions, visibility |
| `cycle` | Audit cycles (Revenue, Payroll, etc.) | Engagement structure |
| `folder` | Workflow folders | Document organization |
| `phase` | Audit phases (Planning, Fieldwork, etc.) | Document organization |
| `financial` | Financial statement line items | Financial statements |
| `wording` | Dynamic wording/terminology tags | Template text |
| `hierarchicallabel` | Control hierarchy labels | Risk assessment |
| `dimension` | NFP functional dimensions | Financial statements |
| `structure` | Engagement structure type | Engagement config |

### Baseassertion Tags and Assertions

Procedure assertions are stored via `baseassertion` tags, NOT via `assertion` tags directly. See `caseware-data-checklist-procedures.md` for the full mapping from 14 baseassertions to the 5 UI assertions (C, E, A, V, PD).

### Area Tags

Area tags (subKind=`area`) represent financial statement areas like "Cash & cash equivalents". They are referenced in `rmm_rank` visibility conditions as `tagId` and in `enum_value` conditions as part of the key string. Resolve via `tag/get`.

### Wording (Glossary) Tags

Tags with `subKind: "wording"` are **global glossary terms** — the "dynamic text" chips authors see in the UI under "Term Settings". They are referenced from procedure/section HTML via `<span formula="refId">` where the corresponding attachable's `formula` field reads `wording("@<tag_id>")` (may be nested, e.g. `sentencecase(wording("@<tag_id>"))`).

**There is no dedicated endpoint.** Glossary data lives inside the generic tag model. Queries to `glossary/get`, `term/get`, `wording/get`, etc. return 500 or empty. Fetch via:

```json
POST tag/get
{"filter": {"filter": {
  "node": "=",
  "left":  {"node": "field", "kind": "tag", "field": "subKind"},
  "right": {"node": "string", "value": "wording"}
}}}
```

**Tag shape:**

```json
{
  "id": "LlP1mos5SEG1OSGQRmGdNg",
  "subKind": "wording",
  "kind": "tag",
  "name": "Terminology changes based on accounting framework used (acronym)",
  "names": {"en": "..."},
  "parent": "K9T61nbzRoCQY5Q7Jlt_yw",   // another wording tag = group header
  "category": "h5eAhvLCMU-oStkZaaIpxA", // NOT a tag; don't resolve via tag/get
  "attachables": {
    "<att-id>": {
      "kind": "calculation",
      "referenceId": "...",
      "formula": "wording(\"@...\")",
      "calculated": "ASPE",
      "values": [
        {"condition": { "type": "organization_type", "organizationType": "not_for_profit",
                        "customOrganizationTypeId": "RegisteredCharity", "countryCode": "CA"},
         "value": "\"ASNPO\""},
        {"condition": {"type": "always_true"}, "value": "\"ASPE\""}
      ],
      "languageValues": [ ... ]  // same shape, values are {en: "..."} maps
    }
  }
}
```

**Group header tags:** A tag whose `parent` field points back at another wording tag treats that parent as a UI group (e.g. "Accounting framework" is the parent of "Terminology changes..."). Group-header tags typically have no meaningful `values` — they exist only to label a group in the UI.

**Value parsing:** The `value` strings in `values[]` are JSON-quoted; use `json.loads(raw)` then strip NBSP/whitespace. An empty JSON string (`"\"\""`) means no text is emitted when that condition matches — use a placeholder like `"[[?]]"` or `(empty)` in output.

**Condition types in wording tags:**

| Type | Notes |
|------|-------|
| `organization_type` | Fields: `organizationType`, `customOrganizationTypeId`, `countryCode`. Used almost exclusively in wording terms (not typical for procedure visibility). |
| `always_true` | Fallback/default value. Last entry in `values[]`. |
| `response` | Same shape as visibility response conditions (`checklistId`/`procedureId`/`responseId`). Resolve via the same `_format_response_condition` helper. |
| `consolidation` | Same as visibility consolidation conditions. |

**Formula-to-term extraction**: regex `r'wording\("@([^"]+)"\)'` on the attachable's `formula` string pulls the `<tag_id>` (leading `@` is not part of the tag ID).
