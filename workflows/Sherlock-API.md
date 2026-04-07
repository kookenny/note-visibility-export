# Sherlock API — Deep Dive

> Programmatically extract engagement data for analysis and visualization.
>
> **Source:** Authenticated content from developers.caseware.com (scraped 2026-03-17)

---

## Overview

| Property | Value |
|----------|-------|
| **API Type** | REST (JSON-encoded) |
| **Version** | 1.0 |
| **Base URL** | `https://{domain}/{firm}/ms/sherlock` |
| **Auth** | Bearer token (OAuth 2.0 client credentials grant) |
| **Total Endpoints** | 42 |
| **Schemas** | `QueryStatus`, `UserDetails` |
| **License** | Apache 2.0 |
| **Contact** | support@caseware.com |
| **Token Lifetime** | 30 minutes |
| **Auth Protocol** | OAuth 2.0 client credentials (server-to-server, no end-user) |

### Prerequisites

- Caseware firm account
- Caseware Sherlock license (from my.caseware.com)
- Working Papers data stored in Caseware Cloud
- API client registration

---

## Authentication

Sherlock uses the same authentication as the Caseware Cloud API.

### Steps

1. **Log into Caseware Cloud** firm
2. **Navigate to** Cloud menu → Settings → Integration → API Settings
3. **Create API client** — provide alias, receive Client ID and Client Secret (max 5 clients per firm)
4. **Obtain API token** — POST to `/auth/token`
5. **Use token** as Bearer auth in all subsequent requests

### Sample Auth Request

```bash
curl --location --request POST \
  'https://<region>.casewarecloud.com/<firm>/ms/caseware-cloud/api/v1/auth/token' \
  --header 'accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "ClientId": "<your-client-id>",
    "ClientSecret": "<your-client-secret>",
    "Language": "en"
  }'
```

### Sample Auth Response

```json
{
  "Token": "ZTBmMGVkZTktNWRmOC0zM2ZiLTIwOWItNmI5YWYwOGQyNjgyOjQyMTlkYjZkLWI4NjctMDZlMS01ODhjLWEyNzMwMmIwYzNkOQ=="
}
```

---

## Request Workflow

Sherlock queries are **asynchronous**:

1. **Send GET request** to a query view endpoint
2. **Check response status**:
   - `RUNNING` → copy the `jobId`, poll `/api/v1/status/{jobId}`
   - `SUCCEEDED` → download data from `fileUrl`
3. **Download CSV** from the signed S3 URL in `fileUrl`

### Sample Response — RUNNING

```json
{
  "fileUrl": "",
  "jobId": "b05d988a-7766-4c6a-984a-1884de9257b5",
  "errorMsg": null,
  "errorDetail": null,
  "status": "RUNNING"
}
```

### Poll for Status

```bash
curl --location --request GET \
  'https://<region>.casewarecloud.com/<firm>/ms/sherlock/api/v1/status/b05d988a-7766-4c6a-984a-1884de9257b5' \
  --header 'accept: application/json' \
  --header 'Authorization: Bearer <your-token>'
```

### Sample Response — SUCCEEDED

```json
{
  "fileUrl": "https://ust1-s3-sherlock-athena-query-results-bucket-1.s3.amazonaws.com/<jobId>.csv?<signed-params>",
  "jobId": "b05d988a-7766-4c6a-984a-1884de9257b5",
  "errorMsg": null,
  "errorDetail": null,
  "status": "SUCCEEDED"
}
```

---

## Endpoints — Query Views

All query endpoints are GET requests under `/api/v1/query/view/`.

### Standard Views

| Endpoint | Operation ID | Description |
|----------|-------------|-------------|
| `/api/v1/query/view/accountsummary` | `getAccountSummaryView` | Account summary data |
| `/api/v1/query/view/balance` | `getBalanceView` | Balance data |
| `/api/v1/query/view/consolidatedentities` | `getConsolidatedEntitiesView` | Consolidated entities |
| `/api/v1/query/view/cv` | `getCV` | CaseView data |
| `/api/v1/query/view/cvcontrol` | `getCVControl` | CaseView control data |
| `/api/v1/query/view/cvmlp` | `getCVMLP` | CaseView MLP data |
| `/api/v1/query/view/cvrisk` | `getCVRisk` | CaseView risk data |
| `/api/v1/query/view/document` | `getDocumentView` | Document data |
| `/api/v1/query/view/documentv2` | `getDocumentV2View` | Document data (v2) |
| `/api/v1/query/view/engagementproperties` | `getEngagementPropertiesView` | Engagement properties |
| `/api/v1/query/view/grouping` | `getGroupingView` | Grouping data |
| `/api/v1/query/view/history` | `getHistoryView` | History data |
| `/api/v1/query/view/historyv2` | `getHistoryV2View` | History data (v2) |
| `/api/v1/query/view/issue` | `getIssueView` | Issue data |
| `/api/v1/query/view/issuev2` | `getIssueV2View` | Issue data (v2) |
| `/api/v1/query/view/mapping` | `getMappingView` | Mapping data |
| `/api/v1/query/view/metadata` | `getMetadataView` | Metadata |
| `/api/v1/query/view/trialbalance` | `getTrialBalanceView` | Trial balance |
| `/api/v1/query/view/user` | `getUserView` | User data |
| `/api/v1/query/view/usergroup` | `getUsergroupView` | User group data |
| `/api/v1/query/view/userv2` | `getUserV2View` | User data (v2) |

### Parquet Views (High-Performance)

Parquet views query optimized columnar storage tables:

| Endpoint | Operation ID |
|----------|-------------|
| `/api/v1/query/view/parquetaccountsummary` | `getParquetAccountSummaryView` |
| `/api/v1/query/view/parquetbalance` | `getParquetBalanceView` |
| `/api/v1/query/view/parquetconsolidatedentities` | `getParquetConsolidatedEntitiesView` |
| `/api/v1/query/view/parquetcv` | `getParquetCV` |
| `/api/v1/query/view/parquetcvcontrol` | `getParquetCVControl` |
| `/api/v1/query/view/parquetcvmlp` | `getParquetCVMLP` |
| `/api/v1/query/view/parquetcvrisk` | `getParquetCVRisk` |
| `/api/v1/query/view/parquetdocument` | `getParquetDocumentView` |
| `/api/v1/query/view/parquetengagementproperties` | `getParquetEngagementPropertiesView` |
| `/api/v1/query/view/parquetgrouping` | `getParquetGroupingView` |
| `/api/v1/query/view/parquethistory` | `getParquetHistoryView` |
| `/api/v1/query/view/parquetissue` | `getParquetIssueView` |
| `/api/v1/query/view/parquetmapping` | `getParquetMappingView` |
| `/api/v1/query/view/parquetmetadata` | `getParquetMetadataView` |
| `/api/v1/query/view/parquettrialbalance` | `getParquetTrialBalanceView` |
| `/api/v1/query/view/parquetuser` | `getParquetUserView` |
| `/api/v1/query/view/parquetusergroup` | `getParquetUsergroupView` |

### Utility Endpoints

| Endpoint | Operation ID | Description |
|----------|-------------|-------------|
| `/api/v1/status/{jobId}` | `getQueryStatus` | Check query job status |
| `/api/v1/table/{tableName}` | `getDataByTableName` | Generic table query |
| `/api/v1/plugin-user/extractionstatus` | `extractionStatus` | Firm extraction status (deprecated) |
| `/api/v1/session/login` | `loginUsingGET` | Session login / current user |

---

## Data Schemas

### QueryStatus

```json
{
  "errorDetail": "string | null",
  "errorMsg": "string | null",
  "fileUrl": "string | null",
  "jobId": "string | null",
  "status": "string | null"   // "RUNNING" | "SUCCEEDED" | error states
}
```

### UserDetails

```json
{
  "admin": true,
  "backgroundColor": "string",
  "image": "string",
  "userEmail": "string",
  "userFirstName": "string",
  "userId": "string",
  "userInitials": "string",
  "userLastName": "string",
  "username": "string"
}
```

---

## Sherlock Ecosystem

| Tool | Purpose | Docs |
|------|---------|------|
| **Sherlock API** | Programmatic REST data extraction | [Getting Started](https://developers.caseware.com/sherlock/v1/ProgrammaticAPI/Getting-Started.htm) |
| **Sherlock Builder** | Build custom dashboards | [Getting Started](https://developers.caseware.com/sherlock-builder/v1/Sherlock-Builder/Get-started-with-Sherlock-Builder.htm) |
| **Sherlock DIST** | Distributor-level customization | [Getting Started](https://developers.caseware.com/sherlockbi/v1/Sherlock-DIST/Get-started.htm) |

---

## Data Availability Matrix

Not all endpoints return data from both Working Papers (WP) and Cloud Engagements (SE).

| Endpoint | Data Source |
|----------|------------|
| Account Summary (`accountsummary`) | **Both** WP and SE |
| Trial Balance (`trialbalance`) | **Both** WP and SE |
| Mappings (`mappings`) | **Both** WP and SE |
| Metadata (`metadata`) | **Both** WP and SE |
| Documents v2 (`documentv2`) | **Both** WP and SE |
| Issues v2 (`issuev2`) | **Both** WP and SE |
| Risk (`cvrisk`) | **Both** WP and SE |
| Balances (`balance`) | WP only |
| CaseView (`cv`) | WP only |
| Consolidated Entities (`consolidatedentities`) | WP only |
| Controls (`cvcontrol`) | WP only |
| Documents (`document`) | WP only |
| Engagement Properties (`engagementproperties`) | WP only |
| Groupings (`grouping`) | WP only |
| History (`history`) | WP only |
| History v2 (`historyv2`) | WP only |
| Issues (`issue`) | WP only |
| Management Letter Points (`cvmlp`) | WP only |
| Users (`user`) | WP only |
| Users v2 (`userv2`) | WP only |
| User Groups (`usergroup`) | WP only |

### Source Parameter

For endpoints supporting both data sources, use the `source` query parameter:

```
# Cloud engagements only
?source=CloudEngagements&q=grouptype="financial"

# Working Papers only
?source=WorkingPapers&q=groupdesc="Current Assets - Cash"

# Both (default — omit source parameter)
?q=yearend=2019
```

---

## Query Syntax

### SQL-style Operators (Programmatic API)

| Operator | Description | Example |
|----------|-------------|---------|
| `AND` | Join filters | `yearend=2018 AND yearend=2019` |
| `OR` | Alternate filters | `yearend=2018 OR yearend=2019` |
| `=` | Equal to | `currentliabilities=400000` |
| `>=` | Greater than or equal | `currentliabilities>=400000` |
| `<=` | Less than or equal | `currentliabilities<=122212` |
| `<>` | Not equal to | `yearend<>2020` |

**Operator precedence:** AND takes precedence over OR. Use parentheses to override:

```sql
-- Without parentheses (AND binds tighter):
yearend=2020 AND groupno="10" OR groupno="20"
-- Equivalent to: (yearend=2020 AND groupno="10") OR groupno="20"

-- With parentheses (explicit grouping):
yearend=2020 AND (groupno="10" OR groupno="20")
```

### JSON-style Operators (Best Practices / Newer Syntax)

| Format | Syntax | Example |
|--------|--------|---------|
| Equals | `{"fieldname": value}` | `{"lastmodified": "2025-07-01"}` |
| Between | `{"fieldname": {"$bt": [val1, val2]}}` | `{"lastmodified": {"$bt": ["2025-06-01", "2025-06-30"]}}` |
| Greater than | `{"fieldname": {"$gt": value}}` | `{"yearend": {"$gt": 2020}}` |
| Greater/equal | `{"fieldname": {"$gte": value}}` | `{"yearend": {"$gte": 2020}}` |
| Not equal | `{"fieldname": {"$ne": value}}` | _Not applicable to yearend/lastmodified_ |
| Less than | `{"fieldname": {"$lt": value}}` | _Not applicable to yearend/lastmodified_ |
| Less/equal | `{"fieldname": {"$lte": value}}` | _Not applicable to yearend/lastmodified_ |

**Important:** All JSON query values must be URL-encoded. Use https://www.urlencoder.org/ for conversion.

---

## Filtering Recommendations

### Performance Tips

- **Always use filters** — large firms can have massive datasets
- **Most common filters:** specific file names or year end
- **Global limit:** `limit n` suffix limits row count: `q=yearend=2019 limit 20`
- **No ordering:** Results are unordered (no paging function)

### Mandatory yearend Parameter

These endpoints **require** `yearend=YYYY` (only `=` operator, one year at a time):

- `cv`, `balance`, `issue`, `history`, `document`

Queries to these endpoints **fail** if yearend is not provided.

### File Name Filtering

```
# Single file
filename="file1.ac"

# Multiple files
filename="file1.ac" AND filename="file2"
```

### Date Filtering

```
# After a date
lastmodified>"2019-01-01"

# Date range
lastmodified>"2016-01-01" AND lastmodified<"2018-01-01"
```

### Balance Filtering

Filter zero balances with: `openingbalance>0`

Available balance columns: `openingbalance`, `finalbalance`, `py1`, `py2`, `py3`, `py4`

### String vs Numeric Values

- **Strings:** Wrap in double quotes — `filename="QRS Corp 12-31-18.ac"`
- **Numerics:** No quotes — `finalbalance>=5000`
- **Field names with spaces:** Wrap in double quotes — `"Consolidation File Name"="Remy Desjardins"`

### Entity Names

Spaces in entity names are replaced with underscores in CSV output (e.g., "Acme Entity" → `Acme_Entity`).

---

## Known Issues

| Issue | Detail |
|-------|--------|
| **Unordered results** | Same query may return results in different order each time |
| **Backslashes removed** | `C:\Program Files\...` → `C:Program Files...` in output |
| **cvmlp colon bug** | cvmlp endpoint returns empty if query contains a colon |
| **Entity name not updating** | Entity name changes may not propagate immediately |

---

## Local Spec

Full OpenAPI 3.0 specification: `../Cloud SDK API Reference/api-documentation/sherlock-api.json` (1,963 lines)

Endpoint index: `../Cloud SDK API Reference/API-INDEX.md` (Sherlock section)
