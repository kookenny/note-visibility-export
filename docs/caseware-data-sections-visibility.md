# Caseware Data Model: Sections & Visibility

## Section Object Shape

Each section returned by `section/get` has:

```
id              — unique section ID
parent          — parent section ID (or documentId for top-level)
order           — fractional-index string (sort lexicographically for display order)
title           — display title (but see gotchas below)
type            — section type (see taxonomy)
document        — the document this section belongs to
visibility      — visibility settings object
tagging         — component/tag assignments
specification   — contains content HTML, formula refs, etc.
attachables     — map of {referenceId: {calculated: "..."}} for dynamic text
```

## Section Type Taxonomy

Sections fall into two categories:

### Container Types (structural wrappers — excluded from output)

| Type | Example Title | Notes |
|------|--------------|-------|
| `heading` | "Notes Area" | Top-level document area grouping |
| `note` | "Note" | Per-note wrapper; always has generic title "Note" |
| `settings` | "Settings" | Template settings section |
| `toc` | "Table of Contents" | Auto-generated TOC |

### Content Types (carry real titles and visibility — included in output)

| Type | Example |
|------|---------|
| `content` | "Cash - no cash flow" |
| `table` | "Statement of Financial Position" |
| `analysis` | "Analysis" |
| `grouping` | "Notice to Reader" |

### Key Gotchas

- **`note` sections always have `title = "Note"`** in the API. The user-visible note name is NOT on these containers — it's on child `content` sections, or in `specification.title`.
- When getting a section's title, check `specification.title` as a fallback for `note` types.
- Container types should be excluded from output but still traversed for hierarchy and visibility inheritance.

## Section Hierarchy

- `parent = documentId` -> top-level section (child of the document)
- `parent = sectionId` -> child of another section
- `order` field is a fractional-index string — sort **lexicographically**, not numerically

### Hierarchy Levels (for note documents)

| Level | Numbering | Description |
|-------|-----------|-------------|
| 1 | 1, 2, 3... | Top-level notes (children of `heading` type) |
| 2 | a, b, c... | Subnotes (children of top-level notes) |
| 3 | i, ii, iii... | Items (children of subnotes) |
| 4 | — | Content sections (leaf nodes with actual titles) |

### Ancestor Chain Building

When building ancestor chains (for Note Group / Note / Subnote columns):
- Walk up the `parent` chain
- **Skip** structural containers (`heading`, `settings`, `toc`) — they don't carry meaningful titles
- **Include** `note` types (they can carry titles via `specification.title`)
- The chain gives you: `[great-grandparent, grandparent, parent]` -> maps to `[Note Group, Note, Subnote]`

## Visibility Model

### Fields

```
visibility.override          — "default" | "show" | "hide"
visibility.normallyVisible   — boolean (THE KEY FIELD)
visibility.allConditionsNeeded — boolean (AND/OR logic)
visibility.conditions        — array of condition objects
```

### Hide vs Show Direction

**Critical**: The direction is derived from `normallyVisible`, NOT from `override`.

| `normallyVisible` | Meaning | Direction Label |
|-------------------|---------|-----------------|
| `false` | Section is normally hidden; shows when conditions are met | **"Show when"** |
| `true` | Section is normally visible; hides when conditions are met | **"Hide when"** |

- In practice, ~418/420 note sections use `normallyVisible=false` ("Show when")
- The `override` field is almost always `"default"` when conditions are present
- If `override` is `"show"` or `"hide"` with no conditions -> literal "Show" or "Hide"

### Condition Quantifier

- `allConditionsNeeded = true` -> **"all"** (AND logic) -> e.g. "Show when all"
- `allConditionsNeeded = false` -> **"any"** (OR logic) -> e.g. "Show when any"

### Effective Visibility (Inheritance)

**Critical**: Visibility conditions primarily live on `note` container sections (420 vs 30 on `content` sections). They are NOT reliably duplicated onto child `content` sections.

Resolution pattern — walk up the parent chain to inherit from the nearest ancestor carrying conditions:

```
1. Check current section for visibility conditions
2. If none, walk up parent chain
3. Use the first ancestor that has non-empty conditions
4. Inherit that ancestor's normallyVisible, allConditionsNeeded, and conditions
```

### Condition Structure

The `conditions` array contains two types of objects:

**1. Flat `response` condition:**
```json
{
  "type": "response",
  "checklistId": {"id": "..."},
  "procedureId": {"id": "..."},
  "responseId":  {"id": "..."}
}
```

**2. `condition_group` (nested OR group):**
```json
{
  "type": "condition_group",
  "checklistId": {"id": "..."},
  "allConditionsNeeded": false,
  "conditions": [
    {"type": "response", "procedureId": {...}, "responseId": {...}, ...},
    ...
  ]
}
```

Condition groups have their own `allConditionsNeeded` flag (typically `false` = OR within the group).

## Section Content Extraction

Content lives in `specification.content` as HTML. Processing steps:

1. **Placeholder spans**: `<span placeholder="...">text</span>` -> wrap in `(( ))` -> `((text))`
2. **Dynamic-text formula spans**: `<span formula="refId">...</span>` -> resolve `refId` via `section.attachables[refId].calculated` -> wrap in `[[ ]]` -> `[[value]]`
3. **Strip remaining HTML tags** (replace with space)
4. **Unescape HTML entities** (`&amp;` -> `&`, `&#160;` -> space)
5. **Collapse whitespace** to single spaces

### Untitled Child Section Merging

Sections without titles (body text children) are merged into the parent section's content. Sort untitled children by `order`, extract and strip their content, append to parent's content with newline separator.
