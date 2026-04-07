# Cloud SDK Platform Architecture

> Architecture reference for the Caseware Cloud SDK platform — components, plugin system, product development lifecycle.

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Caseware Cloud                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Collaborate  │  │     SE       │  │   Sherlock     │  │
│  │  (UI Plugins) │  │ (Engagements)│  │  (BI / Data)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘  │
│         │                 │                  │           │
│  ┌──────┴─────────────────┴──────────────────┴────────┐  │
│  │              Cloud API V2 (REST)                    │  │
│  │    /auth/token → Bearer token authentication        │  │
│  └──────┬─────────────────┬──────────────────┬────────┘  │
│         │                 │                  │           │
│  ┌──────┴───────┐  ┌─────┴──────┐  ┌────────┴───────┐  │
│  │   OAuth      │  │  Imports   │  │  Analytics     │  │
│  │ Microservice │  │  Service   │  │   Library      │  │
│  └──────────────┘  └────────────┘  └────────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ CloudBridge  │  │ Transactions │  │ Risk Content  │  │
│  │ (Desktop↔CW) │  │  Platform   │  │   Library     │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Component Details

### Collaborate (Plugin System)

- Also known as Caseware's **Cloud 1.0 platform**
- Plugin architecture for extending Cloud functionality
- Plugin definition in `plugin.xml` (server) + `collaborate.js` (client) + `collaborate.json` (workflows)
- Onboarding: https://developers.caseware.com/developers_content/v1/Collaborate/Get-onboarded-with-Collaborate.htm

#### Plugin Features by Scope

| Scope | Features |
|-------|----------|
| **Item type** | Workflows, views/filters, relationships, custom actions, custom metadata |
| **Entity** | Custom actions, custom metadata, services, subtypes |
| **Firm-wide** | Places, licensing, firm settings pages, gadgets/dashboards |

#### Plugin Data Sources

| Scope | Description |
|-------|-------------|
| **Engagement** | Store app data in own DB, inform Cloud about common engagement data |
| **Firm** | Single-source firm data via APIs (firm, entity, user level) |
| **Other** | iframe loading pointing to external app with Cloud auth |

#### Plugin File Structure

```
com.caseware.tps.p.sample/
├── client/
│   ├── collaborate.js    # Plugin client logic
│   ├── icon.svg          # Plugin icon
│   ├── index.html        # Plugin entry page
│   └── welcomeCard.js    # UI components
├── server/
│   └── plugin.xml        # Plugin server config (changes only visible after deployment)
└── package.json
```

### SmartEngagement (SE)

The primary product framework for cloud engagement solutions.

**Product structure:**
```
SE Product/
├── product.json           # Product configuration (modules, features)
├── *.se                   # Template files (e.g., com.caseware.uk.audit.2024.se)
├── collaborate.json       # Workflow definitions
├── *-calculations.js      # Form calculation files (calcBlock pattern)
└── forms/                 # SE Builder form definitions (JSON DSL)
```

**Key modules (enabled in product.json):**
- `com.caseware.analysis` — Analysis charts
- `com.caseware.visualization.charts` — Visualization
- `com.caseware.reference` — Additional annotations
- Tax modules — SE Builder forms engine

**SE API:** 235 endpoints covering accounts, adjustments, issues, responses, workflows, documents, entities, and more. Full spec: `../Cloud SDK API Reference/api-documentation/se-api.json`

### SE Builder SDK

- **Purpose:** Build tax forms for international markets using JSON-based DSL
- **Object Model:** `wpw.tax` — root tax platform object
- **Calculations:** `calcBlock` pattern with dependency tracking via `calcUtils.field()`
- **Code style:** JS uses tab=2/indent=2; JSON uses tab=4/indent=2
- **Editor:** IntelliJ recommended
- **Reference:** https://developers.caseware.com/sdk/cloud/Reference/TAXPLAT/index.html

#### Form File Components

| File | Purpose |
|------|---------|
| `form.json` | Form structure definition (fields, layout, types) |
| `formData.js` | initialize / restore / load / unload form values |
| `calculations.js` | calcBlock calculations with dependency chains |
| `tables.js` | Table definitions for tabular data |
| `diagnostics.js` | Validation rules and error checking |

### Imports Service

- Data connectors for accounting software integration
- Default connectors for major packages
- Custom connectors via Provider Bindings SDK
- Subledger dataset type registration
- Automap column mappings
- 143 endpoints — Full spec: `../Cloud SDK API Reference/api-documentation/imports-api.json`

### OAuth Microservice

- Provides OAuth certification capabilities
- Used for authorizing third-party data access
- Handles access delegation without exposing passwords
- Integrated into data connector workflows

### CloudBridge

- Exports data from desktop Working Papers to Cloud engagements
- **Tech:** AngularJS client (`controllers.js`) + CaseWare Server Pages (`index.csp`) backend
- **Data transfers:** Trial balance (multi-year), adjustments, general ledger, external docs/folders, risks & controls
- **Packages:** Available on BitBucket: `https://bitbucket.org/sesdk/com.caseware.tps.w.cloudbridge/`
- Getting started: https://developers.caseware.com/developers_content/v1/Get-started-with-CloudBridge/Get-started-with-CloudBridge.htm

#### CloudBridge Sub-Topics

| Topic | URL |
|-------|-----|
| About CaseWare Server Pages (CSP) | `.../About-CaseWare-server-pages.htm` |
| Create a new CloudBridge package | `.../Create-a-new-CloudBridge-package.htm` |
| Install a CloudBridge package | `.../Install-a-CloudBridge-package.htm` |
| Export data to locally hosted server | `.../Export-data-to-a-locally-hosted-server.htm` |
| Translate the interface | `.../Translate-the-interface.htm` |
| Filter product types | `.../Filter-product-types.htm` |
| Specify a Remap file | `.../Specify-a-Remap-file.htm` |
| Configure automatic updates | `.../Configure-automatic-updates.htm` |
| Risks and Controls mapping | `.../Update-the-Risks-and-Controls-mapping-file.htm` |
| Document Transfer mapping | `.../Specify-the-Document-Transfer-mapping-file.htm` |
| Config file options | `.../Config-file-options.htm` |
| Use CloudBridge | `.../Use-CloudBridge.htm` |
| Troubleshooting | `.../Troubleshooting.htm` |

---

## Authentication Architecture

All APIs use the same auth flow:

```
Client App                      Cloud API
    │                              │
    │  POST /auth/token            │
    │  {ClientId, ClientSecret}    │
    │ ────────────────────────────>│
    │                              │
    │  {Token: "base64..."}        │
    │ <────────────────────────────│
    │                              │
    │  GET /api/v1/...             │
    │  Authorization: Bearer <tok> │
    │ ────────────────────────────>│
    │                              │
    │  JSON response               │
    │ <────────────────────────────│
```

**Constraints:**
- Max 5 API clients per firm
- 1 application per API client recommended
- Tokens obtained from: `https://{region}.casewarecloud.com/{firm}/ms/caseware-cloud/api/v1/auth/token`
- **V2 endpoint:** `https://{region}.casewarecloud.com/{firm}/ms/caseware-cloud/api/v2/auth/token`
- **Protocol:** OAuth 2.0 client credentials grant (server-to-server, no end-user)

### Session Lifetime

- Each authentication generates a **new 30-minute session**
- Previous sessions are **not invalidated** by new tokens
- A **client secret reset** invalidates all existing sessions for that API client

### Rate Limiting

Cloud API uses a **token bucket algorithm**:

| Header | Description |
|--------|-------------|
| `x-ratelimit-burst-capacity` | Maximum tokens the bucket can hold (usable per second) |
| `x-ratelimit-remaining` | Tokens left in the bucket |
| `x-ratelimit-replenish-rate` | Tokens replenished per second |
| `x-ratelimit-requested-tokens` | Tokens consumed by the current request |

When no tokens are available: **HTTP 429** (Too Many Requests). Do not hard-code rate limit values — they may change.

### Viewing Live API Docs

Navigate to your firm's SDK app to see live endpoint documentation:

```
https://{region}.casewarecloud.com/{firm}/sdk
```

Expand `/caseware-cloud` or `/sherlock` on the left panel to browse endpoints, parameters, and response samples.

---

## API Inventory (Local Specs)

| # | API | Version | Endpoints | Schemas | Base URL Pattern |
|---|-----|---------|-----------|---------|------------------|
| 1 | SE API | 1.34.0 | 235 | 202 | `/{firm}/ms/se` |
| 2 | Imports Service | 1.3 | 143 | 187 | `/{firm}/ms/imports` |
| 3 | Cloud API V2 | 2.2.0 | 43 | 65 | `/{firm}/ms/caseware-cloud` |
| 4 | Transactions Platform | 3.0 | 33 | 41 | `/{firm}/ms/transactions` |
| 5 | Analytics Library | 1.42 | 22 | 62 | `/{firm}/ms/analytics` |
| 6 | Sherlock API | 1.0 | 42 | 2 | `/{firm}/ms/sherlock` |
| 7 | Risk Content Library | 1.24.0 | 61 | 87 | `/{firm}/e/eng/{engagement}/s/risk-library` |

**Total: 579 endpoints, 646 schemas**

---

## UK Region Details

- **UK Partner Portal:** https://uk.cwcloudpartner.com/
- **UK SDK Path:** https://uk.cwcloudpartner.com/uk-develop/sdk/
- **UK Cloud SDK Docs:** https://uk.cwcloudpartner.com/uk-develop/p/documentation/cloud/Content/Home.htm
- **UK Getting Started:** https://uk.cwcloudpartner.com/uk-develop/p/documentation/cloud/Content/Topics/cloud-sdk/GettingStarted.html
- **UK What's New:** https://uk.cwcloudpartner.com/uk-develop/p/documentation/cloud/Content/Topics/cloud-sdk/WhatsNew.html

---

## Development Environment

### SE Developer Mode Setup

1. Get onboarded as developer: https://developers.caseware.com/developers_content/v1/Get-started-with-SE-Builder/Step-1-Get-onboarded-as-a-developer.htm
2. Set up NPM development environment
3. Configure `product.json`
4. Place files in correct product structure locations
5. Use developer registry for package management

### Notebooks SDK Setup

1. Install via yarn: `yarn nx run {distributor_id}-notebooks-repository:project-init`
2. Requires GitHub credentials and developer registry access
3. Python environment for notebook development

---

## Licensing Model

SE products support multiple billing methods:

| Method | Description |
|--------|-------------|
| Firm (one-time fee) | Default — single purchase price |
| Pay Per User | Charge per staff member (requires `resource-based-billing` module) |

Product naming: "Cloud" cannot be used in product names (marketing can describe as cloud-based).
