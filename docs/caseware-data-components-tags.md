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
