# Caseware Data Model: Checklist Procedures

> Validated against API version **v1.12.0** on the US environment (cwus-develop), April 2026.

## Overview

Checklists in CaseWare Cloud SE are documents of type `"checklist"` containing procedure objects. Procedures form a tree hierarchy with groups, sub-groups, and leaf procedures that carry response settings, assertions, authoritative references, and visibility conditions.

## Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `procedure/get` | Fetch procedures (filter by `checklistId`) |
| `checklist/get` | Fetch checklist objects (includes default settings) |
| `document/get` | Fetch all documents (to resolve names and IDs) |
| `tag/get` | Fetch all tags (for assertion and area resolution) |

## ChecklistId Mapping (Critical Gotcha)

Procedures reference their parent checklist via the `checklistId` field, which points to the **document's `content` field**, not the document's `id`.

```
Document object:
  id: "1Vf2hAI6QZ-Yl1kw0cExtg"       ← URL fragment uses this
  content: "IE42iHdGTYOJtaQAU3Pl3Q"   ← procedures use this as checklistId

Procedure object:
  checklistId: "IE42iHdGTYOJtaQAU3Pl3Q"  ← matches document.content
```

**URL fragments** (`#/checklist/{id}` or `#/efinancials/{id}`) reference the document `id`. To fetch procedures, map to the `content` field first.

**Resolution**: When building a document lookup, index both `doc["id"]` and `doc["content"]` to the same label.

## Procedure Object Shape

```json
{
  "id": "procedure-uuid",
  "type": "group | procedure | conclusion | taxabstract",
  "text": "<p>HTML procedure body text</p>",
  "summaryNames": {"en": "Plain text summary"},
  "checklistId": "content-field-of-parent-document",
  "parentId": "parent-procedure-id",
  "order": "fractional-index-string",
  "visible": true,
  "settings": { ... },
  "visibility": { ... },
  "guidances": {"en": "<p>Lightbulb guidance HTML</p>"},
  "guidance": "<p>Lightbulb guidance HTML</p>",
  "tags": ["tagId1", "tagId2", ...],
  "tagging": { "baseassertion": {...}, "component": {...} },
  "attachables": { "refId": { "kind": "citation", ... } }
}
```

### Procedure Type Field

| `type` | Description | Row styling |
|--------|-------------|-------------|
| `group` | Organizational heading (e.g. "Procedures", "Assessed risks") | Section header (blue fill) |
| `procedure` | Regular procedure or sub-procedure | Normal data row |
| `conclusion` | Conclusion section | Normal data row |
| `taxabstract` | Tax abstract | Normal data row |

### Procedure Name

Priority: `summaryNames.en` → strip HTML from `text` field. Note: `summaryNames` is often `{}` (empty) — fall back to stripping HTML from `text`.

### Procedure Hierarchy

- `parentId` points to the parent procedure
- `order` is a fractional-index string (sort lexicographically)
- Root procedures have no `parentId` or `parentId` not in the procedure set
- Build tree via DFS traversal sorted by `order` at each level

## Settings & Checklist Defaults

### Checklist-Level Defaults

Fetched via `checklist/get` (empty body `{}`). Returns all checklists in the engagement. Each has a `settings` object containing default response configuration that procedures inherit.

```json
{
  "id": "checklist-content-id",
  "settings": {
    "notePlaceholder": "Response and comments",
    "notePlaceholders": {"en": "Response and comments"},
    "allowNote": true,
    "allowSignOffs": true,
    "allowMultipleRows": false,
    "showResponsesBelow": false,
    "responseSets": [
      {
        "id": "...",
        "type": "picklist",
        "description": "",
        "descriptions": {"en": ""},
        "displayInline": true,
        "responses": [
          {"id": "...", "name": "Completed, no exceptions", "nonOptimal": false},
          {"id": "...", "name": "Completed with exceptions", "nonOptimal": true}
        ]
      }
    ]
  }
}
```

### Procedure-Level Settings

Procedures with explicit settings override the checklist defaults. Procedures without `settings.responseSets` inherit from the checklist.

**Field name differences from other CaseWare APIs:**

| Procedure Setting | Field Name | Notes |
|-------------------|-----------|-------|
| Allow Sign offs | `allowSignOffs` | Capital O (not `allowSignoffs`) |
| Allow Input Notes | `allowNote` | Not `allowInputNotes` |
| Notes Placeholder | `notePlaceholder` / `notePlaceholders.en` | Not `notesPlaceholder` |
| Show Response Beneath | `showResponsesBelow` | Not `showResponseBeneathProcedure` |
| Response Type | `responseSets[].type` | On the responseSet, not on settings |
| Response Placeholder | `responseSets[].description` / `.descriptions.en` | Not `placeholder` |

### Response Sets

Each `responseSet` contains:
- `type`: `"picklist"` | `"manual"` | `"multi-picklist"`
- `displayInline`: boolean
- `description` / `descriptions.en`: placeholder text
- `responses[]`: array of `{id, name, names.en, nonOptimal, visible}`

A procedure can have multiple response sets (e.g., one Manual + one Multi-Picklist). Each gets its own row in the output.

## Authoritative References (Standards)

Standards like "AU-C 520.05" are stored in **`proc.attachables`** as objects with `kind: "citation"`.

```json
{
  "attachables": {
    "refId": {
      "kind": "citation",
      "label": "AU-C 520.05",
      "labels": {"en": "AU-C 520.05"},
      "order": "\"",
      ...
    }
  }
}
```

**Extraction**: Filter attachables by `kind == "citation"`, read `labels.en` or `label`, sort by `order`.

## Assertions (C, E, A, V, PD)

Authors select from exactly 5 assertions in the UI: **Completeness (C), Existence (E), Accuracy (A), Valuation (V), Presentation and Disclosure (PD)**.

### API Storage Model

The API stores 14 "baseassertion" tags (subKind=`baseassertion`) organized under two parent groups:

| Parent Group | Child Baseassertions |
|-------------|---------------------|
| Classes of Transactions (CoT) | Occurrence, Completeness, Accuracy, Cutoff, Classification, Presentation |
| Account Balances (AB) | Existence, Completeness, Rights and obligations, Accuracy/valuation/allocation, Classification, Presentation |

Procedures store these in `tagging.baseassertion`:
```json
{
  "tagging": {
    "baseassertion": {
      "<categoryId>": ["<tagId>", "<tagId>", ...]
    }
  }
}
```

Resolve tag IDs via `tag/get` endpoint.

### Mapping Baseassertions to the 5 Assertions

| Rule | Detection |
|------|-----------|
| **C** | `Completeness` present (either group) |
| **E** | `Existence` present (AB group) |
| **A** | `Accuracy` (CoT) present OR `Accuracy, valuation and allocation` (AB) present |
| **V** | `Acc,val,alloc` (AB) present AND `Accuracy` (CoT) NOT present; OR all 6 AB tags present |
| **PD** | `Presentation` present (either group) |

**The V rule explained**: When an author selects only A (not V), the API stores `Accuracy`(CoT) + `Acc,val,alloc`(AB) as a paired set. When both A and V are selected, only `Acc,val,alloc`(AB) appears (without standalone `Accuracy`). When all 5 are selected, all 12 leaf tags are present.

**Ignore for assertion mapping**: Occurrence, Cutoff, Rights and obligations, Classification — these are sub-categories that don't map to standalone UI assertions.

## Lightbulb Guidance

Guidance text stored in:
- `guidances.en` (preferred — HTML string)
- `guidance` (fallback — HTML string)

Present on both `procedure` and `group` type procedures. Strip HTML for plain text output.

## Visibility Conditions on Procedures

Procedures use the same visibility model as sections, with additional condition types.

### Visibility Object

```json
{
  "visibility": {
    "normallyVisible": false,
    "allConditionsNeeded": false,
    "override": "default",
    "conditions": [...]
  }
}
```

Direction: `normallyVisible=false` → "Show when", `normallyVisible=true` → "Hide when".

### Inheritance

Procedures without conditions inherit from the nearest ancestor (via `parentId` chain) that has conditions. Display as "Inherited from above."

### Condition Types

**Types shared with sections:**
1. `response` — standard response condition (see caseware-data-sections-visibility.md)
2. `condition_group` — nested group with own `allConditionsNeeded` flag
3. `organization_type` — entity org type (self-contained)
4. `consolidation` — consolidated entity flag (self-contained)

**Checklist-specific types:**

**5. `rmm_rank` — Risk of Material Misstatement assessment:**
```json
{
  "type": "rmm_rank",
  "tagId": {"id": "area-tag-id"},
  "assertionIds": ["baseassertion-tag-id-1", "baseassertion-tag-id-2"],
  "rmm": "medium",
  "operator": "ge"
}
```
- `tagId` → financial statement area (subKind=`area`), e.g. "Cash & cash equivalents"
- `assertionIds` → baseassertion tags (subKind=`baseassertion`)
- `rmm` → `"low"` | `"medium"` | `"high"`
- `operator` → `"ge"` (>=) | `"gt"` (>) | `"eq"` (=)

Multiple `rmm_rank` conditions with the same area/level/operator but different assertionIds should be merged — combine all assertion names into one display string.

**6. `enum_value` — Visibility form / configuration value:**
```json
{
  "type": "enum_value",
  "key": "VISIBILITYFORM.oQejtgTmRm24UskBPACwwg",
  "conditionValue": "testing"
}
```
- `key` format: `VISIBILITYFORM.{areaTagId}` — resolve the tag ID for the area name
- `conditionValue` → the enum value to match

**7. `boolean_value` — Boolean flag condition:**
```json
{
  "type": "boolean_value",
  "key": "ACCOUNTINGEST.SigEstCash",
  "conditionValue": true
}
```
- `key` → dot-separated identifier (e.g. accounting estimate significance)
- `conditionValue` → `true` or `false`

## Dynamic Text (Formulas)

Procedure `text` HTML may contain `<span formula="refId">` placeholders that the UI renders as "dynamic text" or "Formula" chips. The resolved value for the current engagement is in `proc.attachables[refId].calculated`; the full expression/rules live in the same attachable.

Two flavours of formula attachable appear on procedures:

1. **Local conditional formulas** — the attachable has a `values[]` array with condition/output pairs. Condition types mirror visibility (`response`, `consolidation`, `always_true`). When no condition matches, `calculated` is an empty string and the chip renders blank in the UI.
2. **Global glossary references** — the attachable has a `formula` field like `wording("@<tag_id>")` (optionally wrapped, e.g. `sentencecase(wording("@<tag_id>"))`). The referenced tag is a glossary term with `subKind: "wording"` — fetch via `tag/get` filtered on `subKind=wording` (see `caseware-data-components-tags.md`).

Full data shape for both flavours is documented in `caseware-data-sections-visibility.md` under "Formula Attachable Shape" — procedures share the same structure as sections.

**Build a formula map** for inline rendering:

```python
def build_formula_map(proc):
    return {a["referenceId"]: a["calculated"].strip()
            for a in (proc.get("attachables") or {}).values()
            if a.get("referenceId") and (a.get("calculated") or "").strip()}
```

Then wrap `<span formula="X">` occurrences with `[[value]]` (or `[[?]]` if the value is empty) during HTML stripping so the gap stays visible.
