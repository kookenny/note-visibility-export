# Caseware Cloud API Reference

> Validated against API version **v1.12.0**. If the API version changes, verify endpoints and response shapes still hold.

## Hosting

Multi-region cloud instances, each on its own subdomain:

| Region | Host |
|--------|------|
| Canada | `ca.cwcloudpartner.com` |
| US | `us.cwcloudpartner.com` |

Additional regions follow the same `{prefix}.cwcloudpartner.com` pattern.

## Authentication

### OAuth Client Credentials (preferred)

Per-environment env vars keyed by hostname prefix:

```
CW_CA_CLIENT_ID=...
CW_CA_CLIENT_SECRET=...
CW_US_CLIENT_ID=...
CW_US_CLIENT_SECRET=...
```

Prefix derivation: take the first segment of the hostname (`ca.cwcloudpartner.com` -> `CA`).

Falls back to generic `CW_CLIENT_ID` / `CW_CLIENT_SECRET` if no prefixed vars exist.

**Token endpoint:**
```
POST /{tenant}/ms/caseware-cloud/api/v1/auth/token
```

**Request body:**
```json
{"ClientId": "...", "ClientSecret": "...", "Language": "en"}
```

**Response:**
```json
{"Token": "eyJ..."}
```

Token is valid for ~30 minutes. Use as `Authorization: Bearer {token}`.

### Cookie Fallback

Set `CW_COOKIES` env var with the full browser cookie string (copy from DevTools -> Network -> any API request -> Headers -> `cookie:` value). Expires when the browser session ends.

## URL Structure

```
https://{host}/{tenant}/e/eng/{engagementId}/api/v1.12.0/{resource}/{verb}
```

- **host**: e.g. `ca.cwcloudpartner.com`
- **tenant**: e.g. `ca-develop` (path segment after host in browser URL)
- **engagementId**: UUID visible in browser URL: `.../e/eng/{engagementId}/...`

### URL Parsing Regex

Extract host, tenant, engagementId, and documentId from a browser document URL:

```
https?://([^/]+)/([^/]+)/e/eng/([^/]+)/[^#]*#/efinancials/([^/?\s]+)
```

Groups: `(host)`, `(tenant)`, `(engagementId)`, `(documentId)`

## Common Endpoints

All endpoints use `POST` with JSON body and return JSON.

| Endpoint | Purpose |
|----------|---------|
| `section/get` | Fetch sections (notes, content, tables, etc.) |
| `procedure/get` | Fetch procedures (checklist questions) |
| `document/get` | Fetch all documents in an engagement |
| `tag/get` | Fetch all tags (filter client-side by `subKind`) |
| `checklist/get` | Fetch checklist objects (includes default settings for procedures) |

### Session Headers

```
Accept: application/json
Content-Type: application/json
Authorization: Bearer {token}   (or Cookie: {cookies} for fallback)
```

## Filter Pattern

The API uses a node-based query DSL for filtering:

```json
{
  "filter": {
    "filter": {
      "node": "=",
      "left":  {"node": "field", "kind": "<resource>", "field": "<fieldName>"},
      "right": {"node": "string", "value": "<value>"}
    }
  }
}
```

Example — fetch all sections for a document:
```json
{
  "filter": {
    "filter": {
      "node": "=",
      "left":  {"node": "field", "kind": "section", "field": "document"},
      "right": {"node": "string", "value": "<documentId>"}
    }
  }
}
```

## Response Wrapper Flexibility

**Important gotcha:** The API does not return a consistent wrapper. Responses may be:

- A bare JSON array `[...]`
- `{"objects": [...]}`
- `{"count": N, "objects": [...]}`
- Any other wrapper key containing a list

Always probe for the list inside the response. Recommended approach:

1. If `isinstance(data, list)` -> use directly
2. Try known keys: `objects`, `sections`, `items`, `results`, `data`
3. Scan for any key whose value is a list
4. Handle single-object wrappers: `{"object": {...}}`

## Checklist URL Fragments

Browser URLs use two fragment patterns for documents:
- `#/efinancials/{documentId}` — financial statements and other documents
- `#/checklist/{documentId}` — checklist documents

Both reference the document's `id` field. Procedures use the document's `content` field as their `checklistId`. See `caseware-data-checklist-procedures.md` for the full mapping.

**Regex for both patterns:**
```
#/(?:efinancials|checklist)/([^/?\s]+)
```

## Error Handling

- **401 Unauthorised**: Session cookies expired or OAuth token invalid. Re-authenticate.
- Non-2xx responses: Check `resp.text` for error details (first 500 chars is usually sufficient).

## How to Find engagementId and documentId

- **engagementId**: visible in the browser URL: `.../e/eng/{engagementId}/...`
- **documentId**: DevTools (F12) -> Network -> filter "section" -> click a `section/get` POST -> Payload tab -> copy the `"value"` field from the filter
