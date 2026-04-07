# Programming Architecture

**Caseware SDK & API system documentation — consolidated reference for development architecture.**

> Last updated: 2026-03-18 (authenticated content from developers.caseware.com)

---

## Contents

| Document | Description |
|----------|-------------|
| [SDK-Overview.md](SDK-Overview.md) | All 8 Caseware SDKs — Desktop, Cloud SE, SE Builder, Notebooks, Provider Bindings, Collaborate, CloudBridge, Data Analytics |
| [SE-Tutorials-Reference.md](SE-Tutorials-Reference.md) | SE API tutorials (product config, workflows, templates, analysis), SE Builder calculations, Cloud API V2 query syntax & use cases |
| [SE-Authoring-Guide.md](SE-Authoring-Guide.md) | **SE Authoring (v31)** — 22 sections, 150+ pages: roles, product settings, checklists, queries, financial statements, XBRL, risk library, analytics, multilingual, Cloud Connector, reports, global components, finalize & distribute |
| [Desktop-SDK-Reference.md](Desktop-SDK-Reference.md) | Desktop SDK — WP COM guide (C#/JScript/C++ examples), event scripts (18+ hooks), Collaborate dev workflow, CloudBridge config, Provider Bindings context objects, Notebooks SDK |
| [Sherlock-API.md](Sherlock-API.md) | Sherlock API deep-dive — authentication, query syntax, data availability, filtering |
| [Cloud-SDK-Platform.md](Cloud-SDK-Platform.md) | Cloud SDK platform architecture — component details, auth flow, rate limiting |
| [API-Quick-Reference.md](API-Quick-Reference.md) | Comprehensive link reference — all portals, SDKs, APIs, sub-pages |

### Coverage Summary

| Area | Content Captured |
|------|-----------------|
| Desktop SDK | COM interface (C#/JScript/C++ examples), CaseView scripting, event scripts (18+ hooks), COM object model, best practices, licensing |
| Cloud SDK / SE | Product structure, product.json schema (12 properties), form.json schema (11 properties), feature flags (25+), modules, sets, deployment files |
| SE Tutorials | SmartEngagement Basics, Configure SE Product, Multiple Templates, Workflows & Triggers, Analysis Module — full inline content |
| SE Builder | wpw.tax object model, calcBlock system, CalcUtils API (15+ methods), table operations, date manipulation |
| **SE Authoring** | **22 sections covering 150+ pages**: What's New, Roles, Get Started, Product Settings (31 options), Groupings, Visibility Logic, Glossary & Dynamic Text, Checklists (18 pages), Queries (16 pages), Letters & Memos (14 pages), Financial Statements (~40 pages), XBRL (10 pages), Risk Library, Data Analytics, Multilingual, Cloud Connector (6 functions), Office Docs, Smart Copy-Paste, Reports, Global Components, Finalize & Distribute, Performance Metrics |
| Collaborate | Plugin architecture, developer workflow (branch strategy, partner environments, cwproxy, release process, code review), dev environment setup |
| CloudBridge | Data transfer capabilities, config.json (17 options), 14 sub-pages with URLs, CSP pages |
| Provider Bindings | Data connectors, context objects (organization/account/transaction), secrets management, deployment workflow, GitHub package access |
| Notebooks SDK | Python libraries + CLI, 45+ analytic notebooks catalog, Poetry/Nexus setup, notebook create/import/deploy workflows, validation parameters API |
| Sherlock API | 42 endpoints, query syntax (SQL+JSON), data availability matrix, filtering |
| Sherlock Builder | Firm setup, visualization creation, dataset access |
| Sherlock DIST | Template distribution via MyCaseware, common widgets |
| Data Analytics | Sampling, controls testing, scalability (80M txns), CSV metadata, GraphQL |
| Cloud API V2 | Query syntax (operators, encoding), common use cases (curl examples), V1→V2 transition guide, GUIDs replacing IDs |
| Developer Onboarding | GitHub SSO, SSH, PAT, 2FA, npmrc, Nexus registry |

---

## Related Workspace Projects

| Project | Path |
|---------|------|
| Cloud SDK API Reference | `../Cloud SDK API Reference/` — OpenAPI specs (7 APIs, 579 endpoints, 646 schemas) |
| CW Template Comparison Tool | `../CW Template Comparison Tool/` — SE template comparison tooling |
| UKCAUD AI Project | `../UKCAUD AI Project/` — AI project frontend (placeholder) |

---

## Key Portals

- **UK Cloud Partner SDK**: https://uk.cwcloudpartner.com/uk-develop/sdk/
- **Cloud SDK Documentation**: https://uk.cwcloudpartner.com/uk-develop/p/documentation/cloud/Content/Home.htm
- **Caseware Developers Portal**: https://developers.caseware.com/
- **SDK Search**: https://developers.caseware.com/new-search?search=SDK
