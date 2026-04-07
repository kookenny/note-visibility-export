# Desktop SDK Reference

**Comprehensive reference for the Caseware Desktop SDK — Working Papers COM, CaseView Scripting, and event scripts.**

> Scraped from developers.caseware.com (authenticated) — 2026-03-18

---

## Table of Contents

- [Desktop SDK Overview](#desktop-sdk-overview)
- [Working Papers COM Getting Started](#working-papers-com-getting-started)
- [Working Papers Event Scripts](#working-papers-event-scripts)
- [Desktop SDK Sub-Pages Directory](#desktop-sdk-sub-pages-directory)
- [Collaborate Developer Workflow](#collaborate-developer-workflow)
- [Collaborate Development Environment](#collaborate-development-environment)
- [CloudBridge Configuration Reference](#cloudbridge-configuration-reference)
- [Provider Bindings SDK Reference](#provider-bindings-sdk-reference)
- [Notebooks SDK Reference](#notebooks-sdk-reference)

---

## Desktop SDK Overview

> Source: `/sdk/desktop/Reference/guide/getting-started.html`

A CaseWare SDK license provides access to advanced features of Working Papers and CaseView not available in standard versions. Requires knowledge of JScript/VBScript and basic COM understanding.

### SDK License Includes

- SDK version of Working Papers (scripts in CaseView, event scripts, layouts, external COM apps)
- API documentation through SDK site
- SDK technical support and consultation via email and online meetings

### Key Capabilities

| Capability | Description |
|-----------|-------------|
| **Working Papers COM** | COM interface for automating WP operations and event scripts |
| **CaseView Scripting** | Built-in script editor for embedding scripts in CaseView forms |
| **External Applications** | COM API accessible from C#, C++, Python, VB |
| **Support** | Direct SDK team access for development and CaseView support |
| **Consulting** | Debugging, escalation, and development team access |

### Requirements

- Working Papers client license (separate SDK add-on)
- Annual SDK EULA required
- License is firm-internal only — no resale or third-party distribution
- Not transferrable to external developers

### CaseView Scripting Requirements

- Application programming background
- JavaScript familiarity
- CaseWare/CaseView experience

### COM/Layout Template Requirements

- Basic ASP technology familiarity
- Basic Windows COM knowledge
- Web development (HTML/CSS)

---

## Working Papers COM Getting Started

> Source: `/sdk/desktop/Reference/guide/workingpapers-getting-started-guide.html`

### Object Model Hierarchy

Objects are arranged hierarchically — most child objects can only be obtained through parent properties. Only `CWApplication` can be created directly.

```
CWApplication (root)
├── Clients
│   └── CWClient
│       ├── Accounts
│       │   └── CWAccount (.Id, .Name, .Balances)
│       │       └── Balances (.Opening, .Closing, .AJE)
│       ├── Documents
│       ├── Journals
│       └── ...
├── Utilities (CWUtilities)
└── ...
```

**Example: Get account opening balance:**
```
Client.Accounts("100").Balances.Opening
```

### Code Examples

#### JScript — External COM
```javascript
var Application = new ActiveXObject("CaseWare.Application");
var Client = Application.Clients.Open2(
  "C:\\Program Files (x86)\\CaseWare\\Data\\Samp01\\Samp01.ac",
  "sup", "sup", Application.ofVirtual
);
Client.Accounts.Get("101").Name = "Petty Cash";
Client.Close();
```

#### C# — With Disposable Wrapper (Recommended)
```csharp
using System;
using CaseWare;
using System.Collections.Generic;

namespace DisposableClientSample {
  class Program {
    static void Main(string[] args) {
      using (var client = new CaseWareClient(
        @"C:\Program Files (x86)\CaseWare\Data\Samp01\Samp01.ac_")) {
        foreach(string id in client.ListAccounts()) {
          Console.WriteLine(id);
        }
      }
    }
  }

  public class CaseWareClient : IDisposable {
    private static CWApplication Application = new CWApplication();
    private CWClient Client;

    public CaseWareClient(string filename) {
      Client = Application.Clients.Open2(
        filename, "sup", "sup", CWOpenFlags.ofVirtual);
      if (Client == null)
        throw new Exception("Client could not be opened");
    }

    public IEnumerable<string> ListAccounts() {
      foreach (CWAccount account in Client.Accounts)
        yield return account.Id;
    }

    public void Dispose() {
      Client.CloseCompressed2(CWCompressFlags.cDefault);
    }
  }
}
```

#### C++ — Smart Pointers
```cpp
#import "C:\\Program Files\\CaseWare\\cw42.dll"
using namespace CaseWare;

HRESULT hr = CoInitialize(NULL);
ICWApplicationPtr application(__uuidof(CWApplication));
ICWClientPtr client = application->Clients->Open(
  "C:\\Program Files\\CaseWare\\Data\\Samp01\\Samp01.ac",
  "SUP", "SUP");

ICWAccountsPtr accounts = client->GetAccounts(gatAccount);
// ... enumerate accounts
CoUninitialize();
```

### Best Practices

1. **Isolate CWI API calls from business logic** — Wrap in a disposable class
2. **Don't release COM objects manually** — Never use `Marshal.ReleaseComObject()`. Close `CWClient` but don't manually release.
3. **Don't install multiple WP versions** on the same COM machine — most recently installed takes precedence

### CaseView — Special Accessor

```javascript
// Always use addActiveXObj in CaseView (never new ActiveXObject)
var oCWApp = addActiveXObj("CaseWare.Application");
// ... use oCWApp ...
delActiveXObj("CaseWare.Application");  // Always pair create/delete
```

**Warning:** Don't create multiple instances of the WP Application object in CaseView Scripting.

### Event Scripts & CSP Pages

In event scripts, CSP pages, and Template Toolbar Buttons, the following objects are injected into global scope:
- `Application` (CWApplication properties/methods)
- `Client` (CWClient)
- `Utilities` (CWUtilities)

### Visual Studio Setup

Add a Reference to the `CaseWare Type Library` from the COM tab. If not listed, reinstall Working Papers.

---

## Working Papers Event Scripts

> Source: Previously scraped from `/developers_content/v1/Desktop-SDK/workingpapers-event-scripts.html`
> (Now at `/sdk/desktop/Reference/guide/workingpapers-event-scripts.html`)

### Event Hook Reference

| Event | Parameters | Description |
|-------|-----------|-------------|
| `OnFileOpen` | — | Fired when an engagement file is opened |
| `OnFileClose` | — | Fired when an engagement file is closed |
| `OnFileNew` | — | Fired when a new engagement file is created |
| `OnImportData` | `importType`, `importFile` | Fired when data is imported |
| `OnCopyMapping` | `templateFile` | Fired when mapping is copied from template |
| `OnFilePublish` | `location` | Fired when a file is published |
| `OnYearEndClose` | `location`, `lockdown` | Fired during year-end close |
| `OnPreProgramLaunch` | `args` | Before program launch (return `false` to cancel) |
| `OnProgramLaunch` | — | After program launches |
| `OnPreProgramTerminate` | — | Before program terminates |
| `OnProgramTerminate` | — | After program terminates |
| `OnPreFilePublish` | — | Before file publish |
| `OnPreAutoMap` | `source` | Before auto-mapping |
| `OnAutoMap` | — | After auto-mapping |
| `OnAddDocuments` | `addType` (0-5), `sourcePath` | When documents are added |
| `OnSignOff` | — | When sign-off occurs |
| `OnTemplateInformation` | — | Template information request |
| `OnPreAssignMapping` | `maptype` | Before mapping assignment |
| `OnPostAssignMapping` | `maptype` | After mapping assignment |

### OnAddDocuments — addType Values

| Value | Description |
|-------|-------------|
| `0` | Document added from file |
| `1` | Document added from scanner |
| `2` | Document added from clipboard |
| `3` | Document added from template |
| `4` | Document added from other source |
| `5` | Document added via drag/drop |

### Global Objects in Event Scripts

| Object | Class | Description |
|--------|-------|-------------|
| `Application` | CWApplication | Root COM object (properties injected into global scope) |
| `Utilities` | CWUtilities | Utility functions |
| `Client` | CWClient | Current engagement file reference |

### Script Locations

- **Global scripts:** Application folder → `Script` subfolder (apply to all engagement files)
- **Local scripts:** Within individual engagement files

---

## Desktop SDK Sub-Pages Directory

All pages under the Desktop SDK section with their current URLs:

### Working Papers COM

| Page | URL |
|------|-----|
| Get started | `/sdk/desktop/Reference/guide/workingpapers-getting-started-guide.html` |
| Working Papers API | `/sdk/desktop/Reference/modules/CaseWare.html` |
| Working Papers enumerations | `/sdk/desktop/Reference/modules/Working%20Papers%20Enumerations.html` |
| Debug WP event scripts | `/sdk/desktop/Reference/guide/DebuggingWPEventScripts.html` |
| Custom metadata | `/sdk/desktop/Reference/guide/workingpapers-custom-metadata.html` |
| Custom import scripting API | `/sdk/desktop/Reference/guide/custom-import-scripting-api.html` |
| Internal browser | `/sdk/desktop/Reference/guide/workingpapers-internal-browser.html` |
| CaseWare Server Pages (CSP) | `/sdk/desktop/Reference/guide/caseware-server-pages.html` |
| Debug CSP pages | `/sdk/desktop/Reference/guide/DebuggingCSPPages.html` |
| Document Manager filter URLs | `/sdk/desktop/Reference/guide/workingpapers-filter-urls.html` |
| Template update guide | `/sdk/desktop/Reference/guide/wp-template-update.html` |
| CaseWare Protocol (cw://) | `/sdk/desktop/Reference/guide/wp-cw-protocol.html` |
| Jump codes | `/sdk/desktop/Reference/guide/wp-jump-codes.html` |
| Template toolbar buttons | `/sdk/desktop/Reference/guide/wp-template-toolbar-buttons.html` |
| Event scripting guide | `/sdk/desktop/Reference/guide/workingpapers-event-scripts.html` |

### Other Desktop SDK Sections

| Section | URL |
|---------|-----|
| CaseView Scripting | (expandable section in sidebar) |
| WP COM version identifier API | (expandable section in sidebar) |
| Document Manager API | (expandable section in sidebar) |
| Archive | (expandable section in sidebar) |

### APIs

| API | URL |
|-----|-----|
| CaseView Scripting API | `/sdk/desktop/Reference/modules/CaseView%20Scripting%20API.html` |
| SE Builder SDK Reference | `/sdk/cloud/Reference/TAXPLAT/index.html` |
| SE API Reference | `/sdk/cloud/Reference/SE/index.html` |
| Working Papers API | `/sdk/desktop/Reference/modules/CaseWare.html` |

---

## Collaborate Developer Workflow

> Source: `/developers_content/v1/Collaborate/Developer-workflow.htm`

### Branch Strategy

Always merge: `develop` → `staging` → `master`

### Partner Deployment Environments

Deployment URLs follow the convention:
```
https://{host-region}.cwcloudpartner.com/{distributor-ID}-{environment}
```

| Branch | Environment | URL Example |
|--------|-------------|-------------|
| `develop` | Development | `https://us.cwcloudpartner.com/tpdev-develop` |
| `staging` | Release/QA | `https://us.cwcloudpartner.com/tpdev-release` |
| `master` | Beta/Production | `https://us.cwcloudpartner.com/tpdev-beta` |

### General Best Practices

1. **Refer to the sample plugin:** https://github.com/caseware/com.caseware.tps.p.sample
2. **Include a readme** with plugin details and implementation info
3. **Specify a version** using semantic versioning in `package.json`

### Sample package.json

```json
{
  "name": "@caseware/com.caseware.tps.p.sample",
  "version": "30.2.1",
  "description": "Collaborate sample plugin",
  "scripts": {
    "dev": "cwproxy --dir ../ --host us.cwcloudtest.com --externalPath p/@caseware/com.caseware.tps.p.sample --externalDestination http://localhost:7070/local",
    "start": "cwproxy --dir ../ --host us.cwcloudtest.com ...",
    "build": "npm install",
    "test": "cwi-plugin-statictests"
  },
  "devDependencies": {
    "nodemon": "^1.11.0",
    "@caseware/cwi-int-plugin-statictests": "^3.0.0",
    "@caseware/cwi-int-cwproxy": "^4.0.0"
  },
  "engines": { "node": ">=8.5.0" }
}
```

### Running and Testing

1. **Install dependencies:** `npm install`
2. **Run static tests:** `npm test`
3. **Start dev proxy:** `npm start` → view at `http://localhost:7777/{YourFirmName}/webapps/`

**Note:** Client-side changes (collaborate.js, welcomeCard.js) visible via proxy. Server-side changes (plugin.xml) require deployment (auto on merge).

### Requesting a Release

1. Create JIRA ticket by duplicating [DIST-2416](https://bugs.caseware.com/browse/DIST-2416)
2. Specify release target: Demo/Release or Production/Master
3. Fill in sign-off (acknowledgment that testing is complete)
4. Fill in product ID, data required, and code version
5. Create PR from staging to master

### Code Review Requirements

- Core files not deleted (package.json, etc.)
- `npm test` passes static tests
- Semantic versioning applied correctly
- No merge conflicts in PR
- Merging to correct branch (develop → staging → master)
- No unnecessary files or unexpected file types

---

## Collaborate Development Environment

> Source: `/developers_content/v1/Collaborate/Set-up-your-development-environment.htm`

### Prerequisites

1. **Request product** — JIRA ticket using [DIST-1925](https://bugs.caseware.com/browse/DIST-1925) template
2. **Sign up for Caseware GitHub** — SSO via `https://github.com/orgs/caseware/sso`
3. **Install Node/NPM** — Minimum Node 12.18.0-14.x, npm 6.13.4+
4. **Confirm environment:**
   - `node -v` → 12.18.0+
   - `npm -v` → 6.13.4+
   - `git --version`
   - SSH keys configured
   - GitHub access verified
5. **Clone and init:** `git clone` → `npm install`

---

## CloudBridge Configuration Reference

> Source: `/developers_content/v1/Get-started-with-CloudBridge/Config-file-options.htm`

### config.json Options

| Option | Type | Description |
|--------|------|-------------|
| `filterTheFollowingProducts` | string[] | Product IDs to show in CloudBridge |
| `checkForUpdateURL` | string | URL to latest version number JSON |
| `updateDownloadURL` | string | URL to latest `.cwp` package |
| `rctIntegration` | boolean | ReviewComp worksheet transfer (mealsEnt, T2S2AW, T2S2W, advertisingWorkchart) |
| `enableGL` | boolean | Enable GL transaction transfer |
| `enableAJ` | boolean | Enable adjustment transfer |
| `enableFileUpload` | boolean | Enable file/folder transfer |
| `enableRisksAndControls` | boolean | Enable risks & controls transfer |
| `enableFSA` | boolean | Enable financial statement areas transfer |
| `enableDocTransfer` | boolean | Enable document transfer section |
| `automap` | boolean | Run `automap.js` from Customizations folder |
| `lang` | string | Interface language (e.g., `"en"`) |
| `defaultIniFile` | string | Default trial balance mapping file |
| `documentMapFile` | string | Document mapping file (was `procedureMapFile`) |
| `documentTransferList` | string[] | Documents list for transfer (supports HTML tags) |
| `excludeZeroBalances` | boolean | Exclude zero-balance accounts |
| `transferSplitUps` | boolean | Transfer individual splitUp accounts vs main |
| `developer` | boolean | Enable developer functions (displayed in orange) |

### CloudBridge Sub-Pages Directory

| Page | URL |
|------|-----|
| Get started | `/developers_content/v1/Get-started-with-CloudBridge/Get-started-with-CloudBridge.htm` |
| About CSP | `/developers_content/v1/Get-started-with-CloudBridge/About-CaseWare-server-pages.htm` |
| Create package | `/developers_content/v1/Get-started-with-CloudBridge/Create-a-new-CloudBridge-package.htm` |
| Install package | `/developers_content/v1/Get-started-with-CloudBridge/Install-a-CloudBridge-package.htm` |
| Export to local server | `/developers_content/v1/Get-started-with-CloudBridge/Export-data-to-a-locally-hosted-server.htm` |
| Translate interface | `/developers_content/v1/Get-started-with-CloudBridge/Translate-the-interface.htm` |
| Filter product types | `/developers_content/v1/Get-started-with-CloudBridge/Filter-product-types.htm` |
| Specify Remap file | `/developers_content/v1/Get-started-with-CloudBridge/Specify-a-Remap-file.htm` |
| Configure auto updates | `/developers_content/v1/Get-started-with-CloudBridge/Configure-automatic-updates.htm` |
| Risks & Controls mapping | `/developers_content/v1/Get-started-with-CloudBridge/Update-the-Risks-and-Controls-mapping-file.htm` |
| Document Transfer mapping | `/developers_content/v1/Get-started-with-CloudBridge/Specify-the-Document-Transfer-mapping-file.htm` |
| Config file options | `/developers_content/v1/Get-started-with-CloudBridge/Config-file-options.htm` |
| Use CloudBridge | `/developers_content/v1/Get-started-with-CloudBridge/Use-CloudBridge.htm` |
| Troubleshooting | `/developers_content/v1/Get-started-with-CloudBridge/Troubleshooting.htm` |

---

## Provider Bindings SDK Reference

> Source: `/developers_content/v1/Get-started-with-import-bindings/Get-started-with-import-bindings.htm`

### Development Environment

| Tool | Requirement |
|------|-------------|
| Node.js | v12.18.0+ (or use nvm) |
| npm | Included with Node |
| npx | `npm install -g npx` |
| Git | Latest |
| Postman | For API testing |
| Terminal | Interactive/TTY required (Inquirer) |
| IDE | VSCode, Atom, Sublime, or IntelliJ |

### GitHub Package Access

```ini
# ~/.npmrc (Linux/Mac) or C:\Users\<username>\.npmrc (Windows)
@caseware:registry=https://npm.pkg.github.com
_authToken=your-access-token
```

PAT requires `repo` + `read:packages` scopes with SSO enabled.

### Secrets Management

1. Create `secrets.json` at repo root (add to `.gitignore`)
2. Define as JSON: `{"CLIENT_ID": "...", "CLIENT_SECRET": "..."}`
3. Encrypt: `npx g @caseware/tools:encrypt-decrypt-secrets`
4. Generates `secrets.json.enc` — safe to commit
5. Reference in package.json:

```json
"cwi": {
  "eks": {
    "configFilepath": "deploy.env",
    "secretsFilepaths": ["secrets.json.enc"]
  }
}
```

### Deployment Workflow

| Stage | Trigger |
|-------|---------|
| **Test** | Push to Development/Release branch (auto-deployed) |
| **Production** | Tag Caseware reviewers in PR on Master (a2rampal, lucas-abr, sauvilla) |

### Context Objects

#### Organization Context

| Property | Description |
|----------|-------------|
| `context.params` | REST parameters |
| `context.params.orgId` | Organization ID |

#### Account Context

| Property | Description |
|----------|-------------|
| `context.params.orgId` | Organization ID |
| `context.params.accountId` | Account ID (`*` = all accounts) |
| `context.flags.ALL_ACCOUNTS` | Request all accounts |
| `context.flags.SPECIFIC_ACCOUNT` | Request specific account |
| `context.timeframe.FROM_DATE` | Start date (JS Date object) |
| `context.timeframe.TO_DATE` | End date (JS Date object) |
| `context.timeframe.PERIODS` | Balance calculation dates |
| `context.timeframe.MONTH_INTERVAL` | 1-12 months skip interval |

#### Transaction Context

| Property | Description |
|----------|-------------|
| `context.params.orgId` | Organization ID |
| `context.params.accountId` | Account ID (`*` = all) |
| `context.flags.ALL_TXNS_ALL_ACCOUNTS` | All txns, all accounts |
| `context.flags.ALL_TXNS_SPECIFIC_ACCOUNT` | All txns, specific account |
| `context.flags.SPECIFIC_TXN_SPECIFIC_ACCOUNT` | Specific txn, specific account |
| `context.timeframe.FROM_DATE` | Start date |
| `context.timeframe.TO_DATE` | End date |

---

## Notebooks SDK Reference

> Source: `/developers_content/v1/Get-started-with-Analytics-AI-Notebooks-SDK/Overview-NotebooksSDK.htm`

### Overview

Python libraries + CLI + dev tooling for developing custom notebooks that run on Caseware Cloud against engagement data. Notebooks combine live runnable code with markdown for data analysis and visualization.

### Prerequisites

- Python programming skills
- Cloud developer onboarding completed
- PyCharm recommended (JupyterLab available)

### Available Notebooks

> Source: `AvailableNotebooks.htm`

A comprehensive catalog of pre-built analytic notebooks and their purposes. Each notebook is linked to its GitHub repository.

| Notebook | Description |
|----------|-------------|
| Angle-based Outlier Detection | Transaction lines plotted; outliers identified by variance of angles between transactions |
| Cluster-based Local Outlier Factor | Transactions grouped into clusters; outliers by cluster size and distance to nearest large cluster |
| Complex Account Combinations | Scores transactions with abnormally large number of accounts (n-percentile ranking) |
| Duplicate Amount by Identifier | Scores rows with duplicate transaction amount, filtered by document type/identifier |
| Duplicate Document Numbers | Identifies duplicate document_numbers by document_type |
| Duplicate Entered Date and Amount by Document Type | Finds identical entered_date + amount by document_type |
| Duplicate Entries | Scores transactions with same date, line count, account IDs, and amounts |
| Ends in 999 | Scores transaction lines ending in 999 (decimals ignored) |
| Ends in Given Value | Scores lines ending in user-specified digit sequences of specified length |
| Excess Supplier Amounts | Identifies transactions higher/lower than median by threshold percentage |
| High/Low Transaction Values | Identifies transactions outside threshold percentage from average |
| High Amounts | Scores transaction lines over a specific threshold |
| High Volume Purchases by Supplier | Identifies abnormally high purchase/sales invoice amounts |
| Histogram-based Outlier Detection | Outliers by relative frequency in histogram |
| Identifying Unmatched and Late Invoices | Identifies late invoices with no corresponding transaction entry |
| Invoices That Exceed Purchase Order Amount | Reports where invoice total exceeds purchase order amount |
| Invoices Use Same Purchase Order | Identifies same purchase order used on multiple invoices |
| Invoices With No Purchase Order | Scores transaction lines without corresponding purchase orders |
| Isolation Forest Outliers | Anomaly detection by transaction characteristics splitting |
| K-Nearest Neighbours | Outliers by distance (radius) between nearby transactions |
| Large Amounts in Selected Period | Identifies large amounts near end of period |
| Large Date Gaps Between Posting Date and Entered Date | Flags lines where gap exceeds user-set value |
| Local Outlier Factor | Outliers by density of nearby transactions |
| Missing Covariance Determinant | Multi-variable outlier detection by distance from mean |
| Missing Descriptions | Scores lines with no description |
| Monthly Purchases by Suppliers | Reports purchases by selected supplier(s) within date range |
| Non-Standard Document Numbers | Scores formats with occurrence below threshold (default 10%) |
| Non Standard Document Numbers - Purchase Invoice by Suppliers | Low-occurrence document formats by selected supplier |
| Numeric Gaps in Document Numbers by Document Type | Identifies gaps in numeric document_number sequences |
| Payments/Purchases Made to Unauthorized Suppliers | Purchases from suppliers not in master file |
| Payments Made to Employees - Payroll and Non-Payroll | Matched payroll/non-payroll disbursements by name/address |
| Principal Component Analysis | Linear transformation preserving vectors; anomalies by direction and magnitude |
| Process Mining | Identifies outlier processes by document_type/number/originating path |
| Purchases by Suppliers Compared to Previous Period | Annual supplier purchase comparison by year-end |
| Rounded Amounts | Scores rounded amounts with increasing weight per rounding degree |
| Same User Entering and Approving | Scores transactions entered and approved by same user |
| Sequence Gaps | Scores transactions before/after gaps in transaction number sequences |
| Specific Keywords | Scores lines containing specific keywords |
| Supplier Sequential Order | Sequential invoice order by supplier (numeric doc numbers only) |
| Transactions Where Entered Date After Fiscal Year End | Posting date before year-end, entered date after |
| Two Digit Benford's Law | Scores by difference between expected and actual two-digit prefix percentages |
| Unmatched Purchase Orders | Purchase orders not matched to an invoice |
| Unusual Account Combinations | Scores highest percentage of infrequently occurring account combinations |
| Unusual Days | Scores transactions on unusual days of week/year (below daily average threshold) |
| Unusual Times | Scores transactions entered during unusual hours (below hourly norm threshold) |
| Unusual Users | Scores users posting less than expected percentage by journal |
| Zero Amounts | Identifies transaction lines where amount is zero |

All notebooks are in the Caseware monorepo: `github.com/caseware/code/blob/develop/apps/notebook/cwi-notebooks/`

---

### Get Started with Notebooks

> Source: `Get-started-with-NotebooksSDK.htm`

**Setup steps (in order):**

1. [Set up a Nexus account](#set-up-a-nexus-account)
2. [Install Poetry](#install-poetry)
3. [Add the cwi repository to Poetry](#add-the-cwi-repository-to-poetry)
4. [Access your Notebooks repository](#access-your-notebooks-repository)
5. [Install the Notebooks SDK](#install-the-notebooks-sdk)
6. [Create a notebook](#create-a-notebook)

---

### Set Up a Nexus Account

> Source: `Set-up-a-Nexus-account.htm`

Sonatype Nexus facilitates the Caseware Cloud Developer Registry, an artifact registry for applications, tools and libraries that are candidates for deployment to Caseware Cloud environments.

1. Ask [Distributor Success](mailto:distributors@caseware.com?subject=Request%20for%20access%20to%20the%20AnalyticsAI%20Notebooks%20SDK) to have you added to the Caseware registry. All developers on your team need to be added.
2. Caseware provides the registry address and username:password pair by email.
3. Log in at `https://registry.developer.caseware.com`
4. Go to your **Account** (top right) and change your password.

---

### Install Poetry

> Source: `Install-poetry.htm`

Poetry is a tool for dependency management and packaging in Python. It uses a `.lock` file to guarantee repeatable runs. See: https://python-poetry.org/docs/#installing-with-the-official-installer

**Mac OS X / Ubuntu:**
```bash
curl -sSL https://install.python-poetry.org | python3 - --version 1.4.2
```

**Windows (PowerShell):**
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py - --version 1.4.2
```

---

### Add the CWI Repository to Poetry

> Source: `Add-cwi-repo-to-poetry.htm`

1. Add the cwi repository to Poetry using the `config` command:
```bash
poetry config repositories.cwi https://registry.developer.caseware.com/repository/pypi-group-CWI/simple
```

2. Configure the credentials for the cwi repository:
```bash
poetry config http-basic.cwi {username} {password}
```

Replace `{username}` and `{password}` with your Nexus credentials.

---

### Access Your Notebooks Repository

> Source: `Access-GitHub-Notebooks-repo.htm`

Caseware grants you access to a notebooks repository in the Caseware monorepo in GitHub where you will manage any notebooks you create. It contains a template notebook and other existing notebooks.

Repository URL format:
```
https://github.com/caseware/{distributor-id}-code/tree/staging/apps
```

**Steps:**
1. Clone the repository using the SSH clone option (Code dropdown > SSH)
2. Copy the clone URL

**Windows:** Go to target directory > right-click > Git Bash Here
**Linux/Mac:** Open terminal and navigate to target location

3. Clone:
```bash
git clone git@github.com/caseware/{distributor-id}-code/tree/staging/apps.git
```

4. Look for the notebook project in the `/apps/notebook` folder.

> **Prerequisite:** SSH key setup instructions are in the [Caseware Cloud developer onboarding guide](../Cloud-developer-onboarding/CaseWare-developer-onboarding.htm).

---

### Install the Notebooks SDK

> Source: `Install-NotebooksSDK.htm`

Run the `yarn` command to install the Notebooks SDK:
```bash
yarn nx run {distributor_id}-notebooks-repository:project-init
```

#### Anatomy of a Caseware Notebook

Every Caseware notebook has these cells:

| Cell | Description |
|------|-------------|
| Notebook setup | Installs Python packages needed for the analysis |
| Notebook description | Contains display name for Analytics AI UI and basic description |
| Notebook configuration | Defines metadata, input/output, default test scores, autorun flag |
| Notebook analysis explanation | Step-by-step description of analysis logic with examples |
| Evaluation | Code that loads data sources, builds analysis, and applies scores |
| Result | Shows results and scored transactions |
| Unit test | Validates accuracy of code in Evaluation cell. **Mandatory, must be last cell.** |

---

### Create a Notebook

> Source: `Create-a-notebook.htm`

**CLI command:**
```bash
poetry run cwi-notebook notebook create
```

**CLI Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `-name` | Text | Yes | The name of the notebook |
| `-id` | Text | Yes | ID of the notebook |
| `-description` | Text | No | Description (default: empty) |
| `-version` | Text | No | Semantic version (default: 1.0.0) |
| `-template` | `[generic \| score \| sample]` | No | Template type. `generic`: custom dataframe output. `score`: AAI transaction scores. `sample`: sampling dataset |
| `-help` | N/A | N/A | Display help message |

#### Setup Cell

Leave as-is. Loads the Notebook SDK extension:
```python
#tags: setup
%load_ext cwi_ipython_ext
```

#### Description Cell

Modify the notebook display name (shown in AnalyticsAI) and description:
```markdown
# Duplicate entries
This test identifies and scores transactions that have the same date, same number of transaction lines, same account IDs, and the same amounts.
```

#### Configuration Cell

Key configuration functions:

| Function | Type | Description |
|----------|------|-------------|
| `configuration.notebook.version` | Numeric | Semantic version, start at 1.0.0 |
| `configuration.notebook.id` | String | Unique notebook identifier |
| `configuration.notebook.autorun` | Boolean | Auto-run on open (scoring template) |
| `configuration.parameters.base_score_default` | Numeric | Base default score (default: 10) |
| `configuration.inputs.add_input(name, required_columns)` | Array | Input name matching output mapping |
| `configuration.outputs.add_output(name, columns)` | Array | Output name matching input mapping |

**Example configuration code:**
```python
#tags: configuration
from cwi_notebook import NotebookConfiguration, NotebookContext
from cwi_notebook.constants import transaction, score_result

configuration = NotebookConfiguration()
configuration.notebook.version = "1.0.1"
configuration.notebook.id = "duplicate_entries"
configuration.notebook.autorun = True
configuration.parameters.base_score_default = 10

configuration.inputs.add_input("purchase_order", [
    transaction.ENTRY_ID, transaction.LINE_NUMBER,
    transaction.POSTING_DATE, transaction.ACCOUNT_ID, transaction.AMOUNT
])
configuration.outputs.add_output("transaction_scores",
    [transaction.ENTRY_ID, score_result.SCORE],
    same_as_input="purchase_order")

context = NotebookContext(configuration)
```

#### Evaluation Cell

Contains the analysis logic. Example (Duplicate Entries):
```python
#tags: evaluation
import pandas as pd

REPEAT_COUNT = "repeat_count"

def get_duplicate_entries(dataset: pd.DataFrame) -> pd.DataFrame:
    dataset = dataset.astype({transaction.AMOUNT: float})
    dataset[transaction.AMOUNT].fillna(0, inplace=True)

    filtered_df = dataset.sort_values(by=[transaction.ENTRY_ID, transaction.ACCOUNT_ID]) \
        .groupby([transaction.ENTRY_ID, transaction.POSTING_DATE], as_index=False) \
        .agg({
            transaction.ACCOUNT_ID: lambda x: ':'.join(x),
            transaction.AMOUNT: lambda x: ':'.join(map(str, x))
        })

    duplicate_count_df = filtered_df.groupby([
        transaction.POSTING_DATE, transaction.ACCOUNT_ID, transaction.AMOUNT
    ]).size().reset_index(drop=False)
    duplicate_count_df.columns = [
        transaction.POSTING_DATE, transaction.ACCOUNT_ID,
        transaction.AMOUNT, REPEAT_COUNT
    ]
    duplicate_count_df = duplicate_count_df[duplicate_count_df[REPEAT_COUNT] > 1]

    filtered_df = filtered_df.merge(duplicate_count_df,
        left_on=[transaction.POSTING_DATE, transaction.ACCOUNT_ID, transaction.AMOUNT],
        right_on=[transaction.POSTING_DATE, transaction.ACCOUNT_ID, transaction.AMOUNT]
    )[[transaction.ENTRY_ID]]
    filtered_df[score_result.SCORE] = pd.Series(1, index=filtered_df.index)
    return filtered_df

transactions = context.get_transactions()
scored_df = get_duplicate_entries(transactions)
context.apply_output(scored_df)
```

> **Note:** Use `apply_output` for general notebooks. Only use `apply_transaction_scores` for scoring notebooks.

#### Result Cell

```python
#tags: result
from cwi_notebook.ui import display_dataset
display_dataset(context.get_output())
```

Also supports `display_json` for JSON output retrievable via `resultNotebookData` API.

#### Unit Test Cell

**Mandatory — must be the last cell in the notebook.**

```python
%%testcase
#tags: testing
import numpy as np
from pandas.testing import assert_frame_equal
import pytest

def test_do_duplicate_entries_returns_good_values():
    # arrange
    lines_array = np.array([
        [transaction.ENTRY_ID, transaction.LINE_NUMBER,
         transaction.ACCOUNT_ID, transaction.POSTING_DATE, transaction.AMOUNT],
        [1, 100, 1000, '2008-06-30 17:30:00.0', 0],
        [2, 101, 1001, '2008-06-30 17:30:00.0', 100],
        [3, 102, 1001, '2008-06-30 17:30:00.0', 100],
        [4, 103, 1000, '2008-06-30 17:30:00.0', np.nan],
        [5, 104, 1000, '2008-06-30 17:30:00.0', 100],
        [6, 105, 1000, '2008-06-30 17:30:00.0', 101.01]
    ])
    expected_array = np.array([[transaction.ENTRY_ID], [1], [4], [2], [3]])
    expected_result = pd.DataFrame(
        index=[0, 1, 2, 3], data=expected_array[1:, 0:],
        columns=expected_array[0, 0:]
    )
    expected_result[score_result.SCORE] = pd.Series(1, dtype="float64",
        index=expected_result.index)
    lines = pd.DataFrame(data=lines_array[1:, 0:], columns=lines_array[0, 0:])

    # act
    result = get_duplicate_entries(lines)

    # assert
    assert result == expected_result
```

---

### Import Data into a Notebook

> Source: `Import-data-into-a-notebook.htm`

#### Dataset Parameters

Import datasets at runtime using `declare_dataset_parameter`:

```python
configuration.parameters.declare_dataset_parameter(
    name="datasets_single",
    label=ref_text("Dataset"),
    default={},
    allow_multiple=False
)
```

**Parameter object properties:**

- **`context`**: Either `imported_dataset` (data imported on Import Data page at `https://{region}.casewarecloud.com/{firm}/e/eng/{engagementId}/s/imports/`) or `analytic_output` (output of an analytic test run)
- **`id`**: For imported datasets = dataset version ID. For analytic outputs = result ID. Get via: `https://{region}.casewarecloud.com/{firm}/e/eng/{engagementId}/s/transactions/api/v1/warehouse/data-sources`
- **`engagement_id`**: ID of the engagement where the dataset belongs
- **`output_name`**: (Analytic outputs only) Specific output name of the analytic test

**Example parameter value:**
```json
[
  {
    "id": "myDatasetId",
    "engagement_id": "myEngagement",
    "context": "imported_dataset"
  },
  {
    "id": "myResultId",
    "engagement_id": "myEngagement",
    "output_name": "myOutputName",
    "context": "analytic_output"
  }
]
```

#### Get Data from Parameters

Retrieve data using `cwi_notebook` context:
```python
def get_dataset_from_parameter(self, parameter: dict) -> pd.DataFrame:
```

Usage:
```python
dataset = context.get_dataset_from_parameter(datasets_single)
```

#### Local Use of Dataset Parameters

Use a notebook configuration file locally. The parameter creates unique input names:

- `imported_dataset` → `engagementId_id`
- `analytic_output` → `engagementid_id_outputname`

**Configuration file example:**
```json
{
  "input_datasets": [
    { "name": "myEngagement_myDatasetId", "file": "./data/imported.csv" },
    { "name": "myEngagement_myResultId_myOutputName", "file": "./data/result.csv" }
  ]
}
```

#### Import Additional Columns (runtime_columns)

```python
configuration.parameters.declare_runtime_columns_parameter(
    name="runtime_columns1",
    label=ref_text("Select sum fields"),
    allow_multiple=False,
    default={
        "sourceType": "input",
        "sourceName": "transactions",
        "columns": [transaction.AMOUNT, transaction.MEASURABLE_QUANTITY]
    }
)
```

- `sourceType`: Always `input`
- `columns`: List of columns to import

#### Define Output Configuration

```python
configuration.outputs.add_output(
    name="output",
    columns=["score"],
    combined_all_inputs_plus_extra=True
)
```

With `combined_all_inputs_plus_extra=True`, output expects a union of all columns from all input datasets + dataset parameters + output-defined columns.

---

### Apply Custom Parameter Values to an Analytic Test

> Source: `Apply-custom-param-values-analytics.htm`

Create predefined configurations (PDCs) to set custom parameter values in any default Caseware (cwi) notebooks or your own authored notebooks.

#### Create a Predefined Configuration (PDC)

1. Open project directory and navigate to `predefined-configs` folder: `/apps/notebook/cwi-notebooks`
2. Create a `.json` file with any name
3. Define the configuration ID:

```
generic.{predefinedConfigurationAuthor}.{analyticId}.{anything}
```

Where:
- `generic` — indicates it is a PDC
- `{predefinedConfigurationAuthor}` — author of the PDC
- `{analyticId}` — composed of `{analyticAuthor}.{analyticName}`
- `{anything}` — additional description/identifier

**Example:** `generic.cwi.cwi.rounded_value.custom_description`

4. Save in `predefined-configs` folder and commit to GitHub

> **Note:** A GitHub Action processes notebooks and PDCs on commit. If tests fail, create a JIRA ticket in the DIST project.

#### Parameter Structure in PDCs

```json
{
  "parameters": [
    { "key": "high_value", "value": 10000 },
    { "key": "low_value_indicator_option", "value": ">=", "fixed": true }
  ]
}
```

- **Changeable:** Without `fixed` attribute or `fixed: false`
- **Unchangeable:** `fixed: true` — cannot be modified

#### Set Custom Parameters via API

**Request structure:**
```json
{
  "analytics": [{
    "configurationId": "pdc_demo",
    "analyticId": "generic.cwi.cwi.rounded_value.rounded_amounts_transaction_line"
  }]
}
```

**With parameter overrides:**
```json
{
  "analytics": [{
    "parameters": [
      { "key": "high_value", "value": 10000 },
      { "key": "low_value_indicator_option", "value": ">=", "fixed": true }
    ],
    "configurationId": "pdc_demo",
    "analyticId": "generic.cwi.cwi.rounded_value.rounded_amounts_transaction_line"
  }]
}
```

**Trigger endpoint:** `analytics-library/api/v1/trigger`

---

### Customize Validation Parameters

> Source: `Customize-validation-parameters.htm`

Functions in the `ParameterConfig` class (cwi_notebook package) for declaring parameters:

#### declare_string_parameter

Declares a string parameter. Default max length: 50 characters.

| Argument | Type | Description |
|----------|------|-------------|
| `name` | str | Parameter name |
| `label` | str | Parameter label |
| `default` | Union[str, List[str]] | Default value (list if `allow_multiple` is true) |
| `allow_multiple` | bool | Whether multiple values are allowed |
| `allowed_values` | Optional[List[str]] | Allowed values, or `None` for any |
| `hint` | str | Help text (default: empty) |
| `custom_validations` | List[ParameterValidation] | Custom validations (default: None) |

**Example:**
```python
declare_string_parameter(
    name="parameter_one",
    label="Parameter 1",
    default="some default value",
    allow_multiple=False
)
```

#### declare_int_parameter

Declares an integer parameter. Same arguments as `declare_string_parameter`.

#### declare_float_parameter

Declares a float parameter. Same arguments as `declare_string_parameter`.

#### declare_percentage_parameter

Declares a percentage parameter (bounds: 0.0–100.0 by default).

| Argument | Type | Description |
|----------|------|-------------|
| `name` | str | Parameter name |
| `label` | str | Parameter label |
| `default` | float | Default value (0.0–100.0) |
| `precision` | int | Decimal precision (default: 2) |
| `hint` | str | Help text (default: empty) |
| `custom_validations` | List[ParameterValidation] | Custom validations |

#### Custom Validations

Create a custom validation to override defaults:
```python
max_length_validation = ParameterValidation("max_length", "75", "PRIMITIVE")
```

`ParameterValidation(name, value, target)`:
- **name**: Validation name (see Available Validations)
- **value**: Validation value
- **target**: `"PRIMITIVE"` (applies to list elements) or `"LIST"` (applies to the list itself)

#### Available Validations

| Validation | Description |
|------------|-------------|
| `required` | Parameter is required. Value is `None` |
| `min`/`max` | Lower/upper bounds for numeric parameters |
| `max_length` | Upper bound for length of lists or strings |
| `no_duplicates` | No duplicate values in list. Value = boolean for case sensitivity |
| `predefined_options` | Restricts to predefined values. Value = list of options |

---

### Deploy a Notebook

> Source: `Deploy-notebooks.htm`

Deploy notebooks from your GitHub repository to UST1 and USQ1 (on push to staging branch).

#### Prerequisites

In your SE product's `product.json`, enable AnalyticsAI in the `feature` property:
```json
"feature": {
    "transactions": true,
    "analyticsai": true
}
```

> See the [SE Authoring guide](https://docs.caseware.com/latest/webapps/en/SE-Authoring/Welcome.htm) and [Configure your SE product](/sdk/cloud/Reference/SE/tutorial-configure-your-se-product.html) for more on product features.

#### Set Up Your GitHub Repository to Publish

In `product.json`, add your notebooks repository under `feature`:

```json
"notebooks": [{
    "repo": "{distributor-id}-code",
    "autoSubscription": false
}]
```

##### Auto-publish all notebooks

Set `autoSubscription` to `true`:
```json
"notebooks": [{
    "repo": "{distributor-id}-code",
    "autoSubscription": true
}]
```

##### Default notebook parameters

These are set for all notebooks without explicit specification:

| Parameter | Type | Description |
|-----------|------|-------------|
| `enabled` | Boolean | Whether notebook can be published (default: true) |
| `autorun` | Boolean | Whether notebook runs automatically on open (default: true) |
| `parameters` | Array | Preset defaults for each notebook |

##### Publish only specific notebooks

Set `autoSubscription` to `false` and specify individual notebooks:

```json
"notebooks": [{
    "repo": "{distributor-id}-code",
    "autoSubscription": false,
    "list": [{
        "notebookid": "YourNotebookID",
        "enabled": true,
        "autorun": false,
        "parameters": { "param1": 20, "param2": "cat" }
    }]
}]
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `notebookid` | String | Must match `configuration.notebook.id` in the notebook's configuration cell |
| `enabled` | Boolean | Whether notebook can be published (default: true) |
| `autorun` | Boolean | Auto-run on open (default: true) |
| `parameters` | Array | Preset defaults |
