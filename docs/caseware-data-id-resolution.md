# Caseware Data Model: Condition ID Resolution

## Overview

Visibility conditions reference three types of IDs that must be resolved to human-readable names:

| Field | Points to | Display column |
|-------|-----------|----------------|
| `checklistId` | Checklist/document containing the procedure | Condition Group |
| `procedureId` | The question/procedure being evaluated | Condition Name |
| `responseId` | The expected answer (Yes/No/etc.) | Expected Response |

All three are wrapper objects: `{"id": "actual-id-string", "authorId": "..."}`. Extract the `.id` field for lookups.

## Procedure Name Resolution

**Endpoint:** `POST procedure/get` filtered by `field: "id"`

**Name extraction priority:**
1. `summaryNames.en` (preferred — clean text)
2. Resolve dynamic-text formulas via `build_formula_map(proc)` + `strip_html(text, formula_map=fmap)` — required for EU/localized templates where `summaryNames` is empty and `text` contains only `<span formula="...">` elements with resolved values in `attachables[].calculated`
3. Strip HTML from `text` field (final fallback — may contain markup)

## Response Option Resolution

Response labels live on the **procedure object** at:

```
procedure.settings.responseSets[].responses[].{id, name}
```

Each response option has an `id` and `name` (e.g. `"Yes"`, `"No"`, `"N/A"`).

### Critical Gotcha

**`responseRows` on a procedure has NO text.** Never use `responseRows` for response labels. Always use `settings.responseSets[].responses[]`.

## Checklist Name Resolution

Checklist IDs require a multi-strategy resolution approach, tried in order:

### Strategy 0: Fetch as procedure (most reliable)

The `checklistId` is often itself a procedure ID. Fetch via `procedure/get` filtered by `field: "id"` and read `summaryNames.en` or stripped `text`.

### Strategy 1a: Fetch as document/checklist/workpaper

Try these endpoints in order with the checklist ID:
- `document/get`
- `checklist/get`
- `workpaper/get`

For each, try both a filter-based payload and a simple `{"id": checklistId}` payload. Look for `name`, `names.en`, `title`, `titles.en`, or `description` fields.

### Strategy 1b: Fetch as section

Try `section/get` with `field: "id"` filter. If found, use the section's title.

### Strategy 2: Walk procedure parentId chain

1. Fetch all procedures for the checklist
2. Starting from any procedure, walk up `parentId` chain
3. **Stop when** the parent's `checklistId` differs from the target — don't walk to the root (that returns an ancestor's name, not the checklist's own name)

## Document ID vs Content ID Gotcha

**Critical**: `checklistId.id` in conditions points to the document's **`content` field**, not the document's own `id` field.

The document object has two ID-like fields:
```json
{
  "id": "document-own-id",
  "content": "content-id-that-conditions-reference",
  "number": "6-15",
  "names": {"en": "Financial statements optimiser"}
}
```

**Resolution**: When building a document lookup, index **both** `doc["id"]` and `doc["content"]` to the same label (`"6-15 Financial statements optimiser"`). This ensures conditions can resolve regardless of which ID they reference.

## The `build_id_lookup()` Pattern

Recommended approach for bulk ID resolution:

1. **Collect** all unique `procedureId` and `checklistId` values from all section conditions (recurse into `condition_group` nested conditions)
2. **Fetch documents** once upfront via `document/get` with empty body — seed the lookup with `{docId: "number name", contentId: "number name"}`
3. **Resolve checklist names** — try local lookup first, then fetch via multi-strategy approach above
4. **Fetch each procedure** individually via `procedure/get` by ID — extract procedure name + all response option names from `settings.responseSets`
5. **Result**: flat `{id: name}` dict covering procedure names, response option names, and checklist/document names

This lookup dict is then used during row generation to resolve all condition references in O(1).

## Checklist ID Resolution

**Critical**: The `checklistId` on procedures points to the document's **`content` field**, not its `id` field. Additionally, URL fragments (`#/checklist/{id}`) reference the document's `id`. To fetch procedures for a checklist opened via URL:

1. Parse the document `id` from the URL fragment
2. Look up the document to find its `content` field
3. Use the `content` field as the `checklistId` filter for `procedure/get`

Build a `{doc_id: content_id}` mapping from `document/get` results for this translation.

### Checklist Default Settings

The `checklist/get` endpoint (empty body) returns checklist objects indexed by their `content` field ID. Each contains a `settings` object with default `responseSets`, `notePlaceholder`, `allowSignOffs`, etc. Procedures without explicit settings inherit these defaults.

## Self-Contained Condition Types

Not all condition types require API lookups. These are resolved directly from their condition object fields:

### `organization_type`

The condition object contains `customOrganizationTypeId` (a PascalCase string like `"GeneralPartnership"`) and `organizationType` (broad category like `"partnership"`). Resolved via a static label mapping (e.g. `"GeneralPartnership"` → `"General Partnership"`). Falls back to PascalCase word splitting for unknown values. No API endpoint exists for org type definitions.

### `consolidation`

The condition object contains a boolean `consolidated` field. Displayed as `"Consolidated"` or `"Not consolidated"`. No lookup needed.

### `tag` (financial group)

References a trial balance financial tag via `tagId`. Resolve the tag name via `tag/get` filtered to `subKind: "financial"` (using `build_financial_tag_lookup()`). The remaining fields (`threshold`, `balanceTypes`, `consolidated`) are self-contained display values.

### `language` (content language)

Contains an ISO 639-1 `language` code (e.g. `"en"`, `"sv"`). Resolved to a human-readable name via a static label mapping. No API call needed.
