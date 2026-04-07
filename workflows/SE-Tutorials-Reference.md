# SE Tutorials & API Reference

**SE API tutorials, SE Builder calculations, Cloud API V2, and Cloud Engagements authoring cross-reference.**

> Scraped from developers.caseware.com (authenticated) — 2026-03-18

---

## Table of Contents

- [SE API Tutorial: SmartEngagement Basics](#se-api-tutorial-smartengagement-basics)
- [SE API Tutorial: Configure Your SE Product](#se-api-tutorial-configure-your-se-product)
- [SE API Tutorial: Multiple Templates](#se-api-tutorial-multiple-templates)
- [SE API Tutorial: Workflows & Triggers](#se-api-tutorial-workflows--triggers)
- [SE API Tutorial: Analysis Module](#se-api-tutorial-analysis-module)
- [SE Builder: Form Calculations](#se-builder-form-calculations)
- [Cloud API V2: Query Syntax](#cloud-api-v2-query-syntax)
- [Cloud API V2: Common Use Cases](#cloud-api-v2-common-use-cases)
- [Cloud API V2: V1 → V2 Transition Guide](#cloud-api-v2-v1--v2-transition-guide)
- [Cloud Engagements Authoring](#cloud-engagements-authoring) → See [SE-Authoring-Guide.md](SE-Authoring-Guide.md)

---

## SE API Tutorial: SmartEngagement Basics

> Source: `/developers_content/v1/SmartEngagements/tutorial-SmartEngagement.html`

### Product File Hierarchy

```
com.company.product/
├── product.json          # Product definition (root config)
├── modules/
│   └── module.json       # Module definitions
├── sets/
│   └── com.company.set/
│       ├── set.json      # Set schema definition
│       └── forms/
│           └── form-id/
│               ├── form.json    # Form structure
│               └── form.js      # Form logic
└── collaborate.js        # Carry-forward & versioning config
```

### product.json Schema

| Property | Type | Description |
|----------|------|-------------|
| `collaborate` | string | Collaborate product ID |
| `description` | string | Product description |
| `feature` | object | Feature flags (see Configure tutorial) |
| `id` | string | Product unique identifier |
| `imports` | array | Enabled import connectors |
| `js` | array | JavaScript files to load |
| `module` | array | Module definitions to include |
| `name` | string | Product display name |
| `productVersion` | string | Version string |
| `set` | array | Set definitions to include |
| `version` | string | Product version |
| `year` | number | Product year |

### set.json Schema

Defines the structure of a set (grouping of forms). Key properties include set ID, name, and form references.

### form.json Schema

| Property | Type | Description |
|----------|------|-------------|
| `default` | boolean | Whether this is the default form |
| `description` | string | Form description |
| `id` | string | Form unique identifier |
| `inline` | boolean | Render inline vs standalone |
| `js` | string | JavaScript file reference |
| `module` | string | Parent module ID |
| `name` | string | Form display name |
| `ownedValues` | array | Values this form owns |
| `set` | string | Parent set ID |
| `unique` | boolean | Whether form is unique per engagement |
| `version` | string | Form version |

### Web Component Forms

Forms can be defined as Web Components:

```json
{
  "type": "web_component",
  "tagName": "my-form-element",
  "lazyLoad": true
}
```

### module.json

Defines module-level configuration. Modules group related functionality (e.g., `com.caseware.analysis`, `com.caseware.assertion`).

### collaborate.js — Carry Forward Configuration

```javascript
module.exports = {
  id: "com.company.product",
  versions: ["2026", "2025", "2024"],
  versionsHeading: "Template Year",
  canRollForward: true,
  duplicateVersionWarning: "This will create a duplicate engagement for the same year.",
  // Second reviewer setup
  secondReviewer: {
    enabled: true
  }
};
```

### Testing

Uses **Jasmine** test framework for unit tests.

---

## SE API Tutorial: Configure Your SE Product

> Source: `/developers_content/v1/SmartEngagements/tutorial-configure-your-se-product.html`

### Feature Flags Reference (product.json `feature` object)

| Feature | Type | Description |
|---------|------|-------------|
| `transactions` | boolean | Enable transaction views |
| `areas` | boolean | Financial statement areas |
| `autoMap` | boolean | Auto-mapping of imported data |
| `checklist` | boolean | Checklist feature |
| `cycles` | boolean | Audit cycles |
| `detailedDocumentsView` | boolean | Detailed documents view |
| `importDocuments` | boolean | Document import capability |
| `dimensions` | boolean | Dimensional analysis |
| `secondReviewer` | boolean | Second reviewer workflow |
| `alwaysShowEngPropIfCreated` | boolean | Always show engagement properties |
| `engagementSearch` | boolean | Engagement search functionality |
| `issues` | boolean | Issues tracking |
| `materiality` | boolean | Materiality calculations |
| `showAllPriorPeriods` | boolean | Show all prior periods |
| `query` | boolean | Query management |
| `interimReporting` | array | Interim reporting periods |
| `reviewerTools` | boolean | Reviewer tools panel |
| `riskAssessment` | boolean | Risk assessment module |
| `rollforward` | boolean | Roll-forward capability |
| `statement` | boolean | **Deprecated** — financial statements |
| `trialBalance` | boolean | Trial balance views |
| `syncTrialBalance` | boolean | TB sync with data source |
| `addUserDefinedFinancialGroup` | boolean | Custom financial groupings |
| `xbrl` | boolean | XBRL tagging/export |
| `analyticsai` | boolean | AnalyticsAI integration |
| `workflow` | object | Workflow config (`readonly`, `hide`) |
| `reimport` | boolean | Re-import data capability |

### Interim Reporting Values

```json
"interimReporting": ["MONTH", "QUARTER", "HALF", "YEAR"]
```

### Available Modules

| Module ID | Purpose |
|-----------|---------|
| `com.caseware.assertion` | Assertion management |
| `com.caseware.visualization.charts` | Chart visualizations |
| `com.caseware.analysis` | Analysis definitions |
| `com.caseware.consolidation` | Group consolidation |
| `com.caseware.reference` | Reference annotations (7 types) |

### Reference Annotation Types (com.caseware.reference)

The reference module supports 7 annotation types for linking checklist/form items to supporting evidence.

### Sets Example

```json
{
  "id": "com.caseware.ca.general",
  "forms": [
    "control-report",
    "enhanced-materiality",
    "misstatements-summary",
    "risk-assessment",
    "risk-report"
  ]
}
```

### Form Override System

Forms can override default behavior per-product using the form override system in product.json.

### Additional Product Configuration

| Property | Type | Description |
|----------|------|-------------|
| `contactAccess` | object | Contact access controls |
| `externalLifecycle` | object | External lifecycle management |
| `archive` | object | Archive settings (DRC w/ `readyToPrint`) |
| `firmCustomization` | object | Firm-level customization options |
| `plugins` | object | Plugin config (`displayName`, `customServices`, `customFields`) |
| `productClass` | string | Product class: `PBC` or `ANALYTICS` |
| `billing` | object | Billing config: `requiresPaymentPerInstance`, `requiresPaymentPerUser` |
| `help` | string | Help URL |
| `notes` | string | Notes URL |

### Plugin Custom Fields

```json
"plugins": {
  "displayName": "My Plugin",
  "customServices": [...],
  "customFields": [
    {
      "type": "MultipleChoice",
      "name": "fieldName",
      "options": [...]
    }
  ]
}
```

---

## SE API Tutorial: Multiple Templates

> Source: `/developers_content/v1/SmartEngagements/tutorial-multiple-templates.html`

### Multi-Year Template Management

Products can support multiple template versions (e.g., one per year). Managed via `collaborate.js`:

```javascript
module.exports = {
  versions: ["2026", "2025", "2024"],
  versionsHeading: "Template Year",
  duplicateVersionWarning: "A 2026 engagement already exists.",
  firmSettingsPages: [...],
  
  // Default template determined by `previous` tag chain
  // Most recent version without `previous` tag is the default
};
```

### Folder Structure for Multiple Templates

Each template year has its own folder structure under the product root. The `previous` tag chain determines which template is the default when creating new engagements.

### Hiding a Template

To hide a template from the product selection UI, remove it from the `versions` array in `collaborate.js`. Existing engagements on that template continue to work.

---

## SE API Tutorial: Workflows & Triggers

> Source: `/developers_content/v1/SmartEngagements/tutorial-workflows.html`

### Workflow Definition (collaborate.json)

```json
{
  "id": "my-workflow",
  "name": "Audit Workflow",
  "description": "Standard audit engagement workflow",
  "workflowStages": [
    {
      "key": "planning",
      "stageName": "Planning",
      "description": "Initial planning phase",
      "displayColor": "#4CAF50",
      "translations": [
        {
          "language": "fr",
          "name": "Planification",
          "description": "Phase de planification initiale"
        }
      ],
      "triggers": [
        {
          "toStage": "fieldwork",
          "condition": "QUERY_COMPLETE"
        }
      ]
    }
  ]
}
```

### WorkflowStage Properties

| Property | Type | Description |
|----------|------|-------------|
| `key` | string | Unique stage identifier |
| `stageName` | string | Display name |
| `description` | string | Stage description |
| `displayColor` | string | Hex color for UI display |
| `translations` | array | Internationalization (language/name/description) |
| `triggers` | array | Transition triggers (toStage + condition) |

### Predefined Trigger Conditions

| Condition | Description |
|-----------|-------------|
| `NEW_ACCOUNT` | A new account is created |
| `QUERY_OPEN` | A query is opened |
| `QUERY_RESPONDED` | A query receives a response |
| `QUERY_COMPLETE` | A query is marked complete |

---

## SE API Tutorial: Analysis Module

> Source: `/developers_content/v1/SmartEngagements/tutorial-analysis-module.html`

### Required Modules

```json
"module": [
  "com.caseware.analysis",
  "com.caseware.visualization.charts"
]
```

### Definition Files

Analysis definitions are JavaScript files placed in a `definitions/` folder and listed in the product.json `js` array:

```json
"js": [
  "definitions/my-analysis.js"
]
```

### Analysis Definition Structure

```javascript
wpw.injectedAnalysisDefinitions = [
  {
    // ComponentDefinition with GUID
    guid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    name: "My Analysis",
    tagBasedTitleNumber: true  // Dynamic chart titles based on tags
  }
];
```

### Key Properties

| Property | Description |
|----------|-------------|
| `guid` | Unique identifier for the analysis component (GUID format) |
| `tagBasedTitleNumber` | When `true`, generates dynamic chart titles based on tag numbers |

---

## SE Builder: Form Calculations

> Source: `/developers_content/v1/Get-started-with-SE-Builder/tutorial-Calculations.html`

### CalcBlock System

Calculations are defined using `wpw.tax.create.calcBlocks()`:

```javascript
wpw.tax.create.calcBlocks("form-id", function(calcUtils) {
  // Dependencies auto-tracked via calcUtils.field()
  
  var fieldA = calcUtils.field("fieldA");
  var fieldB = calcUtils.field("fieldB");
  
  calcUtils.field("total").setValue(fieldA.value + fieldB.value);
});
```

### CalcUtils API

| Method | Description |
|--------|-------------|
| `calcUtils.field(fieldId)` | Get field reference (auto-tracks dependency) |
| `calcUtils.sumBucketValues(bucketId)` | Sum all values in a bucket |
| `calcUtils.subtract(a, b)` | Subtract b from a |
| `calcUtils.sumByKey(array, key)` | Sum values by key in collection |
| `calcUtils.equals(a, b)` | Equality check |
| `calcUtils.getGlobalValue(key)` | Get global engagement value |
| `calcUtils.setRepeatSummaryValue(key, val)` | Set value on repeat summary |
| `calcUtils.form(formId).field(fieldId)` | Cross-form field access |
| `calcUtils.removeValue(fieldId)` | Remove a calculated value |

### Table Operations

| Method | Description |
|--------|-------------|
| `getCellValue(tableId, row, col)` | Get cell value from table |
| `setCellValue(tableId, row, col, val)` | Set cell value in table |
| `addTableRow(tableId)` | Add row to table |
| `removeTableRow(tableId, rowIndex)` | Remove row from table |
| `copyTableRow(tableId, fromRow, toRow)` | Copy row data |

### Date Manipulation

```javascript
// Date utility
var today = wpw.tax.date();
var nextMonth = wpw.tax.date().addMonths(1);
```

### Best Practices

- Split calculations into independent blocks for better performance
- Return async promises for long-running calculations
- Use `calcUtils.field()` for dependency tracking — don't access values directly
- CalcBlocks re-execute automatically when dependencies change

---

## Cloud API V2: Query Syntax

> Source: `/se-authoring/31/Caseware-Cloud-API/query-data-using-get-requests.htm`

### Search Parameter Syntax

```
?search=<fieldName><operator><fieldValue>
```

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `=` | Equals | `?search=name='John'` |
| `<` | Less than | `?search=age<30` |
| `>` | Greater than | `?search=age>18` |
| `<>` | Not equals | `?search=status<>'inactive'` |

### Value Encoding Rules

| Data Type | Format | Example |
|-----------|--------|---------|
| Text | Single quotes | `name='John Smith'` |
| Numbers | No quotes | `age=25` |
| Booleans | Unquoted | `active=true` |
| Dates | ISO format | `created='2026-01-15T00:00:00Z'` |

**All values must be URL-encoded** (spaces → `%20`, `@` → `%40`, etc.)

### Logical Operators

| Operator | Precedence | Example |
|----------|-----------|---------|
| `AND` | Higher | `name='John' AND age>18` |
| `OR` | Lower | `status='active' OR status='pending'` |

Combined: `name='John' AND (status='active' OR status='pending')`

---

## Cloud API V2: Common Use Cases

> Source: `/se-authoring/31/Caseware-Cloud-API/Common-use-cases.htm`

### Filter by CWGuid

1. Retrieve CWGuid from a search result
2. Use as path parameter: `GET /api/v2/entities/{cwGuid}`

### Filter Entities by EntityNo

Entity numbers must be left-padded to 10 characters:

```bash
curl -X GET "https://{host}/{firm}/cw/api/v2/entities?search=entityNo='0000000042'"
```

### Filter by Entity Metadata

Use metadata GUID syntax:

```bash
curl -X GET "https://{host}/{firm}/cw/api/v2/entities?search=metadata[{GUID}]='value'"
```

### Filter by entityId

```bash
curl -X GET "https://{host}/{firm}/cw/api/v2/entities?search=entityId='ABC123'"
```

### Filter Users by Email

`@` must be URL-encoded as `%40`:

```bash
curl -X GET "https://{host}/{firm}/cw/api/v2/users?search=email='user%40example.com'"
```

### Filter Roles by Name

```bash
curl -X GET "https://{host}/{firm}/cw/api/v2/roles?search=name='Auditor'"
```

### Filter Confidential WP Bundles

```bash
curl -X GET "https://{host}/{firm}/cw/api/v2/engagements?search=confidential=true"
```

---

## Cloud API V2: V1 → V2 Transition Guide

> Source: Cloud API V2 transition guide page

### Key V2 Improvements

| Area | V1 | V2 |
|------|----|----|
| Identifiers | Site-specific IDs | Global GUIDs (CWGuid) |
| Business Units | Not supported | Full BU support |
| Tags | Not supported | Tag management |
| Filter power | Basic | Extended filter operators |

### Timeline

- **V1 deprecated:** October 30, 2025
- **V2 available:** Now (parallel operation supported)

### Migration Approaches

| Approach | Description |
|----------|-------------|
| **Phased** | Migrate endpoints one at a time, keeping V1 for unmigrated |
| **Full switch** | Migrate all endpoints simultaneously |

### Key Migration: Entities

- V1 used `entityId` (site-specific)
- V2 uses `CWGuid` (globally unique)
- Retrieve CWGuid via search, then use as path parameter

### FAQ

- V1 and V2 can run in parallel during migration
- No new API clients needed — same authentication
- All V1 functionality available in V2

---

## Cloud Engagements Authoring

> **Full documentation moved to [SE-Authoring-Guide.md](SE-Authoring-Guide.md)** — comprehensive reference covering all 22 sections (~150+ pages) from `/se-authoring/31/`.

### 404 Pages (Removed/Moved)

The following SE Builder tutorial pages return 404 and appear to have been removed:

- Tax Optimizer Checklist
- Dynamic SE Tables
- Embed SE Builder Forms in SE Documents
