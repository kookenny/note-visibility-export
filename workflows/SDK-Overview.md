# Caseware SDK Overview

> Consolidated reference of all Caseware SDKs available through the developer portal.

---

## SDK Landscape

Caseware provides SDKs across three major use cases:

| Use Case | SDKs / APIs | Prerequisites |
|----------|-------------|---------------|
| **Extend Desktop Apps** | Desktop SDK, Working Papers API, CaseView Scripting API | CW firm, Desktop SDK license, WP license |
| **Develop Cloud Apps** | Cloud SDK, SE API, SE Builder SDK, Notebooks SDK, Provider Bindings SDK, Collaborate, CloudBridge | CW firm, developer registry, SE product |
| **Gather Business Intelligence** | Sherlock API, Sherlock DIST, Sherlock Builder | CW firm, Sherlock license, WP data in Cloud |

---

## 1. Desktop SDK

**Purpose:** Extend Working Papers and CaseView with advanced scripting and automation.

- **Tech stack:** JScript / VBScript, COM automation (Windows-only)
- **Key capabilities:**
  - **COM Interface** — Complete automation of Working Papers operation from external apps (C#, C++, Python via COM)
  - **CaseView Scripting** — Dynamic reports, responsive button actions, custom user prompts
  - **Event Scripts** — 18+ hooks (OnFileNew, OnFileOpen, OnImportData, OnYearEndClose, OnSignOff, etc.)
  - **Template Automation** — Template updates, jump codes for UI command triggering
- **Getting started:** https://developers.caseware.com/sdk/desktop/Reference/guide/getting-started.html
- **CaseView scripting guide:** https://developers.caseware.com/sdk/desktop/Reference/guide/caseview-getting-started-guide.html
- **Working Papers COM guide:** https://developers.caseware.com/sdk/desktop/Reference/guide/workingpapers-getting-started-guide.html

> **Full reference:** See [Desktop-SDK-Reference.md](Desktop-SDK-Reference.md) for COM getting started guide (C#/JScript/C++ code examples), complete event script reference (18+ hooks), Collaborate dev workflow, CloudBridge config, and all sub-page URLs.

### Licensing & Requirements

- Annual SDK EULA, restricted to firm-use only (not transferable)
- Requires: JScript, COM, ASP, HTML/CSS skills
- Windows-only (COM automation)

### Key APIs

| API | Reference |
|-----|-----------|
| Working Papers API | https://developers.caseware.com/sdk/desktop/Reference/modules/CaseWare.html |
| CaseView Scripting API | https://developers.caseware.com/sdk/desktop/Reference/modules/CaseView%20Scripting%20API.html |

### Key Classes

- `CaseViewAppOld` — Core CaseView application object (file ops, scripting, repository management)
- `CWUtilities` — Utility helpers (Base64, streams, dialogs, formatting, date conversion)

---

## 2. Cloud SDK (Platform)

**Purpose:** Build solutions on the Caseware Cloud platform — audit/assurance products, tax packages, custom engagement workflows.

- **Portal (UK):** https://uk.cwcloudpartner.com/uk-develop/sdk/
- **Documentation:** https://uk.cwcloudpartner.com/uk-develop/p/documentation/cloud/Content/Home.htm
- **Getting started:** https://developers.caseware.com/sdk/cloud/Home.htm

### Platform Components

| Component | Description | Docs |
|-----------|-------------|------|
| **SmartEngagement (SE)** | Build engagement products (audit, compilation, tax) | [SE API Ref](https://developers.caseware.com/sdk/cloud/Reference/SE/index.html) |
| **SE Builder** | Tax forms DSL (JSON-based form definitions) | [SE Builder SDK Ref](https://developers.caseware.com/sdk/cloud/Reference/TAXPLAT/index.html) |
| **Collaborate** | Plugin system for Cloud UI customization | [Get onboarded](https://developers.caseware.com/developers_content/v1/Collaborate/Get-onboarded-with-Collaborate.htm) |
| **CloudBridge** | Desktop-to-Cloud bridge | [Get started](https://developers.caseware.com/developers_content/v1/Get-started-with-CloudBridge/Get-started-with-CloudBridge.htm) |
| **OAuth Microservice** | OAuth certification for third-party data access | Internal docs (login required) |

### SE Product Development Workflow

1. **Get onboarded** — Register as developer, get dev registry access
2. **Request a product** — Clone JIRA ticket DIST-1925, receive SE product access
3. **Configure product** — Edit `product.json` (modules, features, entity fields)
4. **Build templates** — Create `.se` template files, support multiple versions
5. **Set up workflows** — Define in `collaborate.json` (stages, triggers)
6. **Configure imports** — Data connectors for accounting software integration
7. **Set up analysis** — Charts module via `com.caseware.analysis`
8. **Test and deploy** — Via Cloud operations pipeline

### SE Product File Structure

```
repository.git/
├── product.json         # Product configuration (root)
├── collaborate.json     # Workflow/stage definitions
├── collaborate.js       # Workflow logic
├── icon.svg             # Product icon
├── set/
│   └── set.json         # Template set metadata
└── form/
    ├── form.json        # Form definition (id, module, name, description)
    ├── formData.js      # Form values (initialize/restore/load/unload)
    ├── calculations.js  # calcBlock pattern with dependency tracking
    ├── tables.js        # Table definitions
    └── diagnostics.js   # Validation rules
```

### product.json Properties

| Property | Description |
|----------|-------------|
| `collaborate` | Collaborate config reference |
| `description` | Product description |
| `feature` | Feature toggles |
| `id` | Unique product identifier |
| `imports` | Data connector IDs (empty = all) |
| `js` | JavaScript files array |
| `module` | Module ID |
| `name` | Product name |
| `productVersion` | Version string |
| `set` | Template set references |
| `version` | Schema version |
| `year` | Product year |

### form.json Properties

| Property | Description |
|----------|-------------|
| `default` | Default value / state |
| `description` | Form description |
| `id` | Unique form identifier |
| `inline` | Inline rendering flag |
| `js` | Associated JS files |
| `module` | Module reference |
| `name` | Display name |
| `ownedValues` | Data ownership declarations |
| `set` | Parent set reference |

### Minimum SE Deployment Files

- `product.json` — Required
- `set.json` — Required
- `form.json` — Required
- `collaborate.json` — Required for workflows
- One `.js` file — Required for calculations

### SE Product Features (API-Configurable)

> Full reference: https://developers.caseware.com/se-authoring/31/List-of-product-features-(API).htm

All features are enabled/disabled via `product.json` properties or Product Settings UI.

| Feature | Config | Description |
|---------|--------|-------------|
| **Additional entity fields** | `customFields` in product.json | Customize fields in Create Entity dialog |
| **Additional annotations** | `com.caseware.reference` module | Enable additional annotation types |
| **Analytics Hub** | Product Settings → Analytics Hub → Enable | Centralized workspace for analytic tests linked to checklist procedures |
| **Areas** | Product Settings | Summarize financial statement groups at higher level for risk assessment |
| **Assertions** | `com.caseware.assertion` module | Enable annotations in Cloud app |
| **Automapping** | `automap` in product.json | Auto-map data file sections on import |
| **Automatic rounding** | `financial-rounding-setup.js` in `js` array | Auto-round financial statements; specify groups that should sum to zero |
| **Carry forward** | Roll forward config | Reuse prior-year information when creating engagements |
| **Checklist** | Feature flag | Enable checklist functionality |
| **Contacts control** | `contactAccess: "READ"` | Grant contacts view access to engagements (recommended for reporting products only) |
| **Content copy** | Product Settings → Features → Content Copy | Copy risks/controls/checklists from other engagements |
| **Cycles** | Feature flag `cycles` | Organize trial balance groups into business cycles |
| **Detailed Documents view** | Feature flag | Make Detailed View default on Documents page |
| **Dimensions** | `"dimensions": true, "trialBalanceDimensions": true` | Assign properties to accounts (multi-dimensional) |
| **Engagement from Source** | `this.canCreateEngagementFromSource = true` in collaborate.js | Create engagements based on existing files |
| **Engagement Properties Prompt** | Feature flag | Show properties prompt when opening new engagements |
| **Engagement Search** | Feature flag | Enable/disable Document Map search field |
| **Envision** | `com.caseware.an.e.analytics.ai` set + `"envisionProfile": true` | Out-of-box data profile dashboards for imported transaction data |
| **Export to Word** | `exportToWordDisabledFS`, `exportToWordDisabledOther` | Enable/disable .docx export for FS and/or other doc types (enabled by default) |
| **Firm customizations** | Enabled by default | Allow firm authors to customize engagement templates |
| **Group audit** | Product Settings → Features → Group Audit | Common work areas across group audit components |
| **Help** | Feature config | Link to product help/information page |
| **Imports** | `imports` array in product.json | Data connectors for accounting software (see Provider Bindings SDK) |
| **Import datasets** | `importTaxonomy` in product.json | GL, subledger, TB imports with schema IDs |
| **Import documents** | `"importDocuments": true` | Copy content from different CW Cloud app templates |
| **Inherent risk factors** | Product Settings → Risk → Fields | Categorize inherent risk factors (Complexity, Subjectivity, Change, Uncertainty, etc.) |
| **Interim reporting** | Feature flag | Enable interim reporting periods |
| **Issues** | Feature flag | Allow users to add review notes/issues |
| **JERR Analytics** | Product Settings → Analytics Hub → Enable JERR | Journal Entry Relevance Ranking for audit testing |
| **Job number** | `"hiddenJobNumber": true` | Hide/show Job Number in Engagement Properties |
| **Lockdown history PDF** | `archive` array in product.json | Include lockdown history as PDF in reference copy |
| **Materiality** | Feature flag `materiality` | Set accepted misstatement thresholds |
| **Prior years** | `"showAllPriorPeriods": true` | Show up to 4 prior period balances (default: 1) |
| **Product class** | `productClass: "PBC"` | Working Papers integration indicator |
| **Query** | Feature flag | Staff-contact collaboration queries |
| **Reimport** | Feature flag | Update account name/number during TB reimport |
| **Review tools** | Feature flag | Enable/disable review tools throughout product |
| **Risk assessment** | Feature flag `riskAssessment` | Risk, Control, and RMM assessment reports |
| **Risk assessment per risk** | Product Settings → Risk → Fields → Assessment of Specific Risks | Individual risk assessment with IR/CR/LMO/MPM scorecards |
| **Roll forward** | product.json prev/next year config | Enable carry forward with year linking |
| **Rounded balances** | Product Settings → Trial Balance → Enable rounded columns | CY-Rounded and PY-Rounded columns matching financial statements |
| **Second reviewer** | Feature flag | Include Final Review option in signoffs |
| **Financial Statements** | `"statement": true` | Show/hide Financial Statements in Create a Document list |
| **Sync trial balance** | `"syncTrialBalance": false` | Show/hide sync TB function in engagement import dialog |
| **Trial balance** | Feature flag | Enable Trial Balance tab in engagement |
| **User-defined groups** | Feature flag | Allow users to add their own financial groups |
| **Validis integration** | Product Settings | Enable data extraction from Validis accounting packages |
| **Workflow** | Feature flag | Read-only workflow or hide workflow status |
| **iXBRL** | XBRL taxonomy config + conversion support file | Inline XBRL financial statements with review mode |

#### Import Dataset Schema IDs

| Dataset | Schema ID |
|---------|-----------|
| General ledger | `cwi.schema.general_ledger` |
| Trial balance | `cwi.schema.accounts` |
| AP - invoices | `cwi.schema.ap_invoices` |
| AP - payments made | `cwi.schema.ap_payments_made` |
| AP - suppliers | `cwi.schema.ap_suppliers` |
| AP - open balances | `cwi.schema.ap_open_balances` |
| AR - invoices | `cwi.schema.ar_invoices` |
| AR - cash received | `cwi.schema.ar_cash_received` |
| AR - customers | `cwi.schema.ar_customers` |
| AR - open balances | `cwi.schema.ar_open_balances` |
| Inventory transactions | `cwi.schema.inventory_transactions` |
| Inventory on hand | `cwi.schema.inventory_on_hand` |
| Other (schemaless) | `"schemaless": true` in feature section |

#### Key Form Sets & Modules

```json
// Risk/Control/Materiality reports
"set": ["com.caseware.ca.general"],
"feature": ["cycles", "riskAssessment"],
"module": ["com.caseware.visualization.charts", "com.caseware.assertion"]

// Specific report (e.g., Controls only)
"form": ["com.caseware.ca.general.control-report"],
"feature": ["cycles"]
```

### Important Disclaimer

> CaseWare's Cloud SDK program is not final. Third-party code deployed to CaseWare servers becomes CaseWare property. CaseWare will not delay releases for third-party products. Developers must implement updates when requested and follow standard dev methodology including automated testing.

### SE Builder SDK (Tax Form Development)

- **Purpose:** Build tax forms for international markets using a JSON-based DSL
- **Object Model:** `wpw.tax` — the root tax platform object
- **Calculations:** `calcBlock` pattern with dependency tracking via `calcUtils.field()` (15+ CalcUtils methods)
- **Code style:** JS files use tab=2/indent=2; JSON files use tab=4/indent=2
- **Reference:** https://developers.caseware.com/sdk/cloud/Reference/TAXPLAT/index.html

> **Full reference:** See [SE-Tutorials-Reference.md](SE-Tutorials-Reference.md) for complete CalcUtils API (sumBucketValues, subtract, table operations, date manipulation), SE API tutorials (product config, features, workflows, templates, analysis), Cloud API V2 query syntax, and SE Authoring sections.

#### Form File Components

| File | Purpose |
|------|---------|
| `form.json` | Form structure definition (fields, layout, types) |
| `formData.js` | initialize / restore / load / unload form values |
| `calculations.js` | calcBlock calculations with dependency chains |
| `tables.js` | Table definitions for tabular data |
| `diagnostics.js` | Validation rules and error checking |

### Collaborate (Plugin System)

- **Purpose:** Extend Caseware Cloud's UI with custom plugins (dashboards, gadgets, integrations)
- **Also known as:** Caseware's Cloud 1.0 platform
- **Plugin types:** Item type (workflows, views, relationships), Entity (actions, services, subtypes), Firm-wide (places, licensing, settings, dashboards)
- **Data scopes:** Engagement data, Firm data, or iframe to external app
- **Branch strategy:** develop → staging → master (partner environments at cwcloudpartner.com)
- **Sample plugin:** https://github.com/caseware/com.caseware.tps.p.sample
- **Onboarding:** https://developers.caseware.com/developers_content/v1/Collaborate/Get-onboarded-with-Collaborate.htm
- **Dev environment:** https://developers.caseware.com/developers_content/v1/Collaborate/Set-up-your-development-environment.htm
- **Developer workflow:** https://developers.caseware.com/developers_content/v1/Collaborate/Developer-workflow.htm

> **Full reference:** See [Desktop-SDK-Reference.md](Desktop-SDK-Reference.md#collaborate-developer-workflow) for dev workflow details (partner environments, cwproxy, static tests, release process, code review requirements).

#### Plugin File Structure

```
com.caseware.tps.p.sample/
├── client/
│   ├── collaborate.js    # Plugin client logic
│   ├── icon.svg          # Plugin icon
│   ├── index.html        # Plugin entry page
│   └── welcomeCard.js    # UI components
├── server/
│   └── plugin.xml        # Plugin server config
└── package.json
```

### CloudBridge

- **Purpose:** Export data from desktop Working Papers to Cloud engagements
- **Tech:** AngularJS client (`controllers.js`) + CaseWare Server Pages (CSP) backend (`index.csp`)
- **Data transfers:** Trial balance (multi-year), adjustments, general ledger, external docs/folders, risks & controls
- **Packages:** Available on BitBucket: `https://bitbucket.org/sesdk/com.caseware.tps.w.cloudbridge/`
- **Config:** `config.json` with 17 options (enableGL, enableAJ, enableFileUpload, enableRisksAndControls, automap, lang, etc.)
- **Getting started:** https://developers.caseware.com/developers_content/v1/Get-started-with-CloudBridge/Get-started-with-CloudBridge.htm

> **Full reference:** See [Desktop-SDK-Reference.md](Desktop-SDK-Reference.md#cloudbridge-configuration-reference) for complete config.json options table and all 14 sub-page URLs.

---

## 3. Notebooks SDK

**Purpose:** Develop custom Python notebooks for analytics that run in Caseware Cloud against engagement data.

- **Tech stack:** Python libraries + CLI tooling + dev environment
- **File format:** `.ipynb` (Jupyter Notebook)
- **Recommended IDE:** PyCharm (with JupyterLab as alternative)
- **Prerequisite:** Complete Cloud developer onboarding first
- **Key capabilities:**
  - Custom risk analysis notebooks
  - Engagement data access from Cloud
  - Deploy and run on Cloud platform
  - Integration with AnalyticsAI
- **Getting started:** https://developers.caseware.com/developers_content/v1/Get-started-with-Analytics-AI-Notebooks-SDK/Overview-NotebooksSDK.htm
- **Installation:** `yarn nx run {distributor_id}-notebooks-repository:project-init`

### Notebook Cell Structure

| Cell | Purpose |
|------|---------|
| Notebook setup | Install Python packages |
| Notebook description | Display name and metadata |
| Analysis cells | Custom risk analysis logic |

---

## 4. Provider Bindings SDK (Data Connectors)

**Purpose:** Create custom data connectors for importing data from accounting software into Cloud engagements.

- **Use case:** When default connectors don't cover a specific accounting package
- **Tech stack:** Node.js (v12.18.0+), npm, npx, Inquirer CLI tooling
- **Source control:** Git + Caseware GitHub monorepo access required
- **Package registry:** `@caseware` packages via GitHub Packages (npmrc with PAT)
- **Getting started:** https://developers.caseware.com/developers_content/v1/Get-started-with-import-bindings/Get-started-with-import-bindings.htm
- **Request access:** JIRA ticket (duplicate DIST-1925) or email distributors@caseware.com

### Connector Types

| Type | Import Method |
|------|--------------|
| **Online** | API calls to third-party accounting software |
| **Desktop** | Physical file upload from local accounting software |

### Data Model (Context Objects)

- **Organization context:** `context.params.orgId` — identifies the accounting org
- **Account context:** `context.params.accountId`, `context.flags` (ALL_ACCOUNTS / SPECIFIC_ACCOUNT), `context.timeframe` (FROM_DATE, TO_DATE, PERIODS)
- **Transaction context:** `context.flags` (ALL_TXNS_ALL_ACCOUNTS / ALL_TXNS_SPECIFIC_ACCOUNT / SPECIFIC_TXN_SPECIFIC_ACCOUNT)

### Organization Model Properties

| Property | Required | Description |
|----------|----------|-------------|
| `id` | Yes | Organization identifier |
| `displayName` | Yes | UI display name |
| `name` | No | Organization name |
| `country` | No | Operating country |
| `currency` | No | Currency code |
| `vatNumber` | No | VAT number |
| `website` | No | Organization website |
| `timezone` | No | Time zone |

### Secrets Management

1. Create `secrets.json` at repo root (add to `.gitignore`)
2. Define secrets as JSON: `{"CLIENT_ID": "...", "CLIENT_SECRET": "..."}`
3. Encrypt: `npx g @caseware/tools:encrypt-decrypt-secrets`
4. Generates `secrets.json.enc` — safe to commit
5. Reference in `package.json` under `cwi.eks.secretsFilepaths`

### Deployment

- **Test:** Push to Development/Release branch → auto-deploy to test environment
- **Production:** Tag Caseware reviewers (a2rampal, lucas-abr, sauvilla) in PR on Master → approved then deployed

### Supported Online Data Connectors (30+)

Key connectors include: Xero, QuickBooks Online, FreshBooks, Dynamics 365 Business Central, Sage 50/Intacct, MYOB, Exact, Datev, Twinfield, Visma, and many more. Full list with module IDs available in the SE Imports & Automap reference.

### Enabling in SE Products

Configure in `product.json`:
- Empty `imports` array = all connectors enabled
- Specific IDs = only those connectors shown (in listed order)
- `com.caseware.import.cloud.utility.all` = all desktop connectors

---

## 5. Sherlock API & SDKs

**Purpose:** Extract engagement data for BI dashboards, monitoring, and data visualization.

- **API type:** REST (JSON-encoded responses)
- **Auth:** Same as Cloud API (API client + bearer token)
- **Endpoints:** 42 GET-based query views
- **Base URL:** `https://{domain}/{firm}/ms/sherlock`

See [Sherlock-API.md](Sherlock-API.md) for full details.

### Sherlock Tools

| Tool | Description | Docs |
|------|-------------|------|
| Sherlock API | Programmatic REST access to engagement data (42 endpoints) | [Get started](https://developers.caseware.com/sherlock/v1/ProgrammaticAPI/Getting-Started.htm) |
| Sherlock Builder | Build custom Sherlock visualizations from Cloud UI | [Get started](https://developers.caseware.com/sherlock-builder/v1/Sherlock-Builder/Get-started-with-Sherlock-Builder.htm) |
| Sherlock DIST | Design/distribute dashboard templates via MyCaseware | [Get started](https://developers.caseware.com/sherlockbi/v1/Sherlock-DIST/Get-started.htm) |
| Sherlock Reader | End-user dashboard viewing | [Docs](https://docs.caseware.com/latest/webapps/en/Explore/Getting-Started/Get-started-with-Sherlock-Reader.htm) |

### Sherlock Builder

- Requires firm admin setup: staff accounts, entities, Sherlock Builder app permission
- **Warning:** Do not change email or revoke license of a Sherlock Builder user — visualizations become inaccessible to ALL users
- WP files must be integrated + published to Cloud for data to populate
- Actions: Create analysis, select datasets, publish visualizations

### Sherlock DIST

- Design custom dashboards, distribute as templates licensed through MyCaseware
- Workflow: Create analysis → View template → Publish → Update → Delete
- Common widgets library available for reuse

---

## 6. Cloud API V2

**Purpose:** Automate practice data management (clients, users, groups, permissions).

- **Transition:** V1 deprecated Oct 30 2025 — V2 replaces site-specific IDs with global GUIDs (CWGuid)
- **Key improvements over V1:** Business units support, tags, expanded filtering
- **Query syntax:** `?search=<fieldName><operator><fieldValue>` — operators: `=`, `<`, `>`, `<>`
- **Getting started:** https://developers.caseware.com/se-authoring/31/Caseware-Cloud-API/Get-started-with-Cloud-API.htm
- **Query syntax:** https://developers.caseware.com/se-authoring/31/Caseware-Cloud-API/query-data-using-get-requests.htm
- **Common use cases:** https://developers.caseware.com/se-authoring/31/Caseware-Cloud-API/Common-use-cases.htm

> **Full reference:** See [SE-Tutorials-Reference.md](SE-Tutorials-Reference.md#cloud-api-v2-query-syntax) for query syntax details (operators, encoding rules, logical operators), common use cases (curl examples for entities, users, roles), and V1→V2 transition guide.

---

## 7. Data Analytics

**Purpose:** Analytics Hub for running analytic tests against engagement data — sampling, population testing, dataset analysis.

- **Getting started:** https://developers.caseware.com/developers_content/v1/Data-Analytics/Whats-new-data-analytics.htm
- **API:** Data Analytics API (under Data Analytics section on developers portal)
- **Notebooks SDK:** Python notebooks for custom analytics (see Section 3)
- **GraphQL:** Additional query interface (available under Data Analytics)

### Key Capabilities (2026-01 release)

- Consolidated sampling workflow (dataset type + method selection in one place)
- Controls Sampling for tests of controls (new)
- Scalable analytics: supports ~80M transaction lines, parallel job execution
- Custom metadata fields on CSV exports via API
- CloudBridge integration for desktop data export

### Sub-Components

| Component | Description |
|-----------|-------------|
| Data Analytics API | REST API for programmatic analytics |
| Notebooks SDK | Python notebooks (see Section 3) |
| GraphQL | GraphQL query interface |
| CloudBridge | Desktop data export (see Section 2) |

---

## 8. Developer Onboarding (All SDKs)

**Reference:** https://developers.caseware.com/developers_content/v1/Cloud-developer-onboarding/CaseWare-developer-onboarding.htm

### Steps

1. **Get Caseware account** — Contact Distributor Success (distributors@caseware.com), receive AD account synced to Azure AD
2. **Sign up for GitHub** — Use Caseware email, SSO via `https://github.com/orgs/caseware/sso`
3. **Configure SSH** — Generate ed25519 key, add to GitHub account
4. **Generate PAT** — GitHub Personal Access Token with `repo` + `read:packages` scopes, enable SSO
5. **Enable 2FA** — Required for Caseware GitHub org
6. **Install tools** — IDE (VSCode/IntelliJ/PyCharm), Postman, Git, Node.js (for JS SDKs)
7. **Access Nexus** — Developer Registry for artifact management (if needed)

### npmrc Configuration (for JS-based SDKs)

```
@caseware:registry=https://npm.pkg.github.com
_authToken=your-access-token
```

File location: `~/.npmrc` (Linux/Mac) or `C:\Users\<username>\.npmrc` (Windows)

---

## Local API Specifications

Full OpenAPI 3.x specs are maintained in `../Cloud SDK API Reference/api-documentation/`:

| API | Version | Endpoints | Schemas | Spec File |
|-----|---------|-----------|---------|-----------|
| SE API | 1.34.0 | 235 | 202 | `se-api.json` |
| Imports Service | 1.3 | 143 | 187 | `imports-api.json` |
| Cloud API V2 | 2.2.0 | 43 | 65 | `api-v2.json` |
| Transactions Platform | 3.0 | 33 | 41 | `transactions-api.json` |
| Analytics Library | 1.42 | 22 | 62 | `analytics-api.json` |
| Sherlock API | 1.0 | 42 | 2 | `sherlock-api.json` |
| Risk Content Library | 1.24.0 | 61 | 87 | `risk-library-api.json` |

Master endpoint index: `../Cloud SDK API Reference/API-INDEX.md`
