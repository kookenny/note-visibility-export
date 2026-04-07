# SE Authoring Guide — Cloud Engagements (v31)

**Comprehensive reference for authoring Cloud Engagement (Smart Engagement / SE) products.**

> Scraped from developers.caseware.com/se-authoring/31/ — 2026-03-18

---

## Table of Contents

- [What's New](#whats-new)
- [Cloud Engagements Roles](#cloud-engagements-roles)
- [Get Started](#get-started)
- [Product Settings](#product-settings)
- [Groupings](#groupings)
- [Visibility Logic](#visibility-logic)
- [Engagement Glossary & Dynamic Text](#engagement-glossary--dynamic-text)
- [Checklists](#checklists)
- [Queries](#queries)
- [Letters and Memos](#letters-and-memos)
- [Financial Statements](#financial-statements)
- [XBRL](#xbrl)
- [Risk Library](#risk-library)
- [Data Analytics](#data-analytics)
- [Multilingual Support](#multilingual-support)
- [Cloud Connector: Office 365](#cloud-connector-office-365)
- [Microsoft Office Documents](#microsoft-office-documents)
- [Smart Copy-Paste](#smart-copy-paste)
- [Reports](#reports)
- [Global Components](#global-components)
- [Finalize and Distribute](#finalize-and-distribute)
- [Performance and Scalability Metrics](#performance-and-scalability-metrics)

---

## What's New

> Source: `Whats-new.htm`, `Fixes-in-the-latest-SE-release.htm`

### New in SE 2026-03 Beta

Most new enhancements are disabled by default during busy season. Request UAT access to test specific enhancements.

#### Authoring Features

**Prevent engagement lockdown when work is incomplete** — `#primaryauthor #firmauthor #enterpriseauthor`
- Prevent lockdown when visible documents aren't signed off or issues are unresolved
- Audit report date disabled when engagement is incomplete
- Issues flagged "Consideration for next year" don't block lockdown
- Warning shown for scheduled lockdowns if new unsigned docs/unresolved issues appear
- Follows same precedence rules as other lockdown settings
- **Limitation**: Not included in firms using Modern API for lockdown

#### End-User Features

**Add timestamp to draft watermark on PDF** — Timestamp with draft watermark on FS PDFs. Appears in print preview, Download PDF (WMK), Download as PDF/A (WMK). Follows regional settings; date uses short date format from Product Settings.

**Carry forward issues flagged for next year** — Issues flagged "Consideration for next year" now carry forward automatically. No custom logic needed.

**Lockdown date aligns with product settings** — Automatic lockdown occurs at 11:59 PM on the configured lockdown date.

**Expanded date format options** — Date placeholders and data-linked checklist dates now support Long, Medium, and Short formats via a selector. All render using formats defined in Product Settings > Dates.

**Control audit report date backdating** — New Lockdown setting to enable/disable backdating validation.

**Cloud Connector Excel in reference downloads** — DRC includes static copies of Cloud Connector Excel files with dynamic content replaced by static values.

### Fixes (SE 2026-03)

- **SE-61099**: Materiality/Performance Materiality values not appearing in Entity Details
- **SE-60869**: Account numbers changing in US Review consolidation engagements
- **SE-61825**: Signoff icons right-aligned instead of left-aligned on Documents page

---

## Cloud Engagements Roles

> Source: `Primary-author.htm`, `Network-author.htm`, `Firm-author.htm`, `End-user.htm`

Four main roles in Cloud Engagements:

### Primary Author

Distributor development teams and product owners who create SE products.

**Goal**: Create and set up an SE product, author the product template, perform development tasks, distribute the product.

| Sub-Role | Highlights |
|----------|-----------|
| **Product Manager** | Owns product roadmap, develops epics/user stories, coordinates across functions |
| **Content Developer** | Authors templates per requirements, reviews client feedback, evaluates template changes |
| **Solution Developer** | Handles custom coding (JS, HTML, XML, JSON), uses CWI scripting APIs |
| **Forms Developer** | Builds custom solutions with SE Builder, develops microservices |

### Enterprise Author

Enables accountancy networks and large multi-office firms to customize product templates for their member firms. Has a dedicated Cloud site for enterprise authoring. Goal: Customize default product content for enterprise needs.

### Firm Author

Administrators who customize product templates with firm-specific branding and methodology.

**Goal**: Customize default product content for firm needs — add content, set up firm logo, modify or suppress default content.

### End User

Managers, partners, accountants, auditors who perform engagements. Roles include:

| Role | Key Responsibilities |
|------|---------------------|
| **Manager Partner** | Establish firm policies, approve engagement acceptance, decide technology |
| **Engagement Partner** | Responsible for engagement performance, reviews key documents, approves deliverables |
| **EQCR** | Objectively evaluates significant judgments by engagement team, must complete before report dating |
| **Consultant** | Specialized expertise (Tax, Valuations, Actuarial, IT) |
| **Senior Manager** | Technical interpretations, detail/general review, escalate issues |
| **Audit Manager** | Reviews engagements for firm policy compliance, coaches staff |
| **Senior Accountant** | Plans engagement, drafts budget, assigns tasks, key point of contact |
| **Staff Accountant** | Completes less complex execution areas (e.g., Cash, Expenses Testing) |
| **Client Contact** | Client-side point of contact, responds to questions, provides documents |

---

## Get Started

> Source: `Welcome.htm`, `Request-a-product.htm`, `Enable-or-disable-features-in-your-product.htm`, `Create-and-manage-the-product-template.htm`, `Workflow-(how-to-author-your-product-template).htm`, `Licensing-and-pricing.htm`, `Recommendations.htm`, `List-of-product-features-(API).htm`

### Welcome

Cloud Engagements authoring covers concepts, workflows, and tasks for designing and distributing Cloud Engagement products. Products can be audits, review & compilation, assurance, tax, compliance engagements.

### Request a Product

Clone the JIRA ticket **DIST-1925** and provide:

| Field | Description |
|-------|-------------|
| **Description** | Brief product description |
| **Key Dates** | Development Start, Client Beta Release, Release to Production |
| **Kick-off Meeting** | Yes (no experience), Yes (present solution), No |
| **Gap Analysis** | Required Caseware Platform analysis |
| **Business Case** | Reason, market size, MVP workflow |
| **Product Manager/Lead Dev** | Name + email |
| **Type** | Smart Engagement Template (e), Collaborate Plugin (p), Microservice (m) |
| **Product Name** | Unique name (no "Cloud" in name) |
| **Development Firm** | URL for development firm |
| **Base SE template** | Base template to copy from (default: `com.caseware.tps.e.generic`) |

### Enable or Disable Features

Add/remove properties in `product.json` to toggle features. Changes apply only to **new engagements**.

**Generic Features**: Additional Entity Fields, Annotations, Carry forward, Checklist, Contacts, Copy content, Detailed Documents View, Engagement Properties Prompt, Search, FS option, Firm Customizations, Help, Import Documents, Issues, Job Number, Lockdown history PDF, Product Class, Query, Roll Forward, Second Reviewer, Workflow

**Audit Features**: Analytics Hub, Areas, Assertions, Automapping, Cycles, Envision, Forms/Form sets, Group audit, Imports, Inherent risk factors, Interim Reporting, Journal Entry Relevance Ranking, Materiality, Prior Years, Reimport, Review Tools, Risk Assessment, Risk Assessment per Risk, Trial Balance, User Defined Financials Groups

**Financial Reporting Features**: Automapping, Dimensions, Final rounded balances, Forms/Form sets, Imports, Interim Reporting, Reimport, Prior Years, Review Tools, Trial Balance, User Defined Financials Groups, iXBRL

**Tax Features**: Automapping, Forms/Form sets, Imports, Interim Reporting, Reimport, Prior Years, Review Tools, Trial Balance, User Defined Financials Groups

### Create and Manage the Product Template

**Template Versioning**: `1.2.3.4-x` where 1=Caseware version, 2=Primary author, 3=Enterprise author, 4=Firm author, -x=Saved draft version. Each save increments `-x`.

**Create a Draft**: Cloud menu → Settings → Product name → Manage Template → Create Draft

**Open Existing Draft**: Cloud menu → Settings → Product name → Manage Template → Open Draft

**Delete Draft**: Cloud menu → Settings → Product name → Manage Template → Delete Draft → Create Draft

### Authoring Workflow

1. **Create a draft template** — Start from Cloud menu > Settings
2. **Enable features** — Configure `product.json` for your product type
3. **Set up product settings** — Formatting, signoff, phases, terminology
4. **Author documents** — Checklists, queries, financial statements, letters
5. **Test the template** — Create test engagements
6. **Finalize and distribute** — Publish template for end users

### Licensing and Pricing

SE products are licensed through Caseware International. Pricing depends on product type, market, and distribution model. Contact CWI for licensing details.

### Recommendations

- Plan template structure before authoring
- Use consistent naming conventions
- Test with representative data
- Document customizations for firm/enterprise authors
- Follow Caseware's best practices for performance

### List of Product Features (API)

All features available through the `product.json` API for enabling/disabling product capabilities programmatically. Each feature has a corresponding property key and boolean value.

---

## Product Settings

> Source: 31 pages covering product-level configuration

### Formatting and Localization

Configure date formats, number formats, and currency settings. Define short, medium, and long date formats. Set decimal separators, thousands separators, and negative number display.

### Multiple Content Languages

Set up multi-language support for product templates. Define primary and secondary languages. Configure language-specific content for checklists, financial statements, and other documents.

### Engagement Phases

Define engagement phases to organize workflow:
- **Planning** — Preliminary assessment and planning
- **Execution** — Performing engagement procedures
- **Conclusion** — Summarizing findings and conclusions
- **Reporting** — Generating deliverables

Custom phases can be added. Each phase can have documents assigned to it.

### Assertions

Add financial statement assertions (e.g., Existence, Completeness, Valuation, Rights & Obligations, Presentation & Disclosure). Assertions link to risk assessment and testing procedures.

### Areas and Cycles

**Areas** organize engagement content by business process or financial statement line item (e.g., Revenue, Cash, Inventory).

**Cycles** (business cycles) group related areas for testing purposes (e.g., Revenue & Receipts, Purchases & Payments).

### Dimensions

Add dimensions for multi-dimensional reporting. Dimensions allow slicing data by additional attributes beyond the standard chart of accounts.

### Financial Statements Settings

Customize FS-specific settings including rounding options, column configurations, and display preferences.

### Enable New Queries Layout

Activates the redesigned query interface with improved question management and response tracking.

### Customize Terminology

Override default terminology with firm/product-specific terms. Common customizations:
- "Engagement" → "Assignment" or "Job"
- "Checklist" → "Program"
- "Procedure" → "Step"

### Define Components

Components allow content assignment based on engagement characteristics (e.g., listed vs. non-listed entity, group vs. standalone). Documents, checklists, and procedures can be assigned to components.

### Enable Data Page

Activates the Data page in engagements for direct data access and management.

### Enable Signoff for Trial Balance and Adjustments

Adds signoff requirements for trial balance and adjustment entries.

### Enable Planning Balances

Allows engagement teams to enter and track planning balances alongside actual balances.

### Enable New TB Import Workflow

Activates the modernized trial balance import workflow for CSV and Excel file imports with improved mapping and validation.

### Enable New Documents Page Layout

Switches to the redesigned documents page with improved navigation and organization.

### Enable Validis Integration

Connects SE products to Validis for automated financial data extraction and validation.

### Customize Lockdown Settings

Configure engagement lockdown behavior:
- Set lockdown period (days after audit report date)
- Enable/disable automatic lockdown
- Configure lockdown warnings
- Control backdating of audit report date

### Enable Sampling

Activates statistical and non-statistical sampling tools in the engagement.

### Customize Trial Balance Groups Display Settings

Configure how trial balance group structures are displayed, including nesting, sorting, and visual hierarchy.

### Set Up Custom Forms

Configure custom SE Builder forms for data collection and display. Forms use JSON schema with JavaScript logic.

### Enable Tax and Prescribed Accounts Groupings

Adds tax-specific and prescribed account grouping structures to the trial balance.

### Set Up Bulk Print

Configure bulk printing options for engagement documents. Set default print order, inclusion/exclusion rules, and output format preferences.

### Add Risk Reference Code

Assign reference codes to risks for consistent identification and cross-referencing.

### Enable New Risk Module

Activates the redesigned risk assessment module with improved risk identification, assessment, and response tracking.

### Associate Risk Library

Link a risk library to the product. Risk libraries provide pre-defined risks, controls, and responses.

### Enable Controls in Risk Module

Adds control assessment capabilities to the risk module for evaluating internal controls.

### Enable Central Planning

Activates central planning features for coordinating audit procedures across multiple areas.

### Define Signoff Roles

Configure preparer, reviewer, and second reviewer roles with specific permissions and requirements.

### Set Up Signoff Schemes

Create signoff schemes defining the required sequence of approvals for different document types.

### Review and Customize Signoff Schemes

Modify existing signoff schemes. Configure which roles must sign off, the required order, and whether signoff is mandatory or optional per document type.

---

## Groupings

> Source: `Define-groupings.htm`, `Group-properties.htm`, `Export-groupings-from-Working-Papers-to-Excel.htm`, `Set-up-mapping-between-financial-group-structures-synced-TB-across-products.htm`, `Subtotal-across-multiple-groups-in-a-trial-balance.htm`

### Define Groupings

Groupings organize trial balance accounts into hierarchical structures for financial reporting. Each grouping has a code, name, and type (Asset, Liability, Equity, Revenue, Expense).

**To add a grouping**: Navigate to the trial balance view → Select Groupings → Add Group → Configure properties.

### Group Properties

| Property | Description |
|----------|-------------|
| **Code** | Unique identifier for the group |
| **Name** | Display name |
| **Type** | Financial statement classification (Asset, Liability, etc.) |
| **Sign** | Display sign convention (Normal, Opposite) |
| **Parent** | Parent group for nesting |
| **Sort Order** | Display order within parent |
| **Note Association** | Link to financial statement note |

### Export Groupings from Working Papers

Export existing account structures from CaseWare Working Papers to Excel for mapping into SE products. This accelerates the transition from desktop to cloud products.

### Mapping Between Financial Group Structures

Set up mappings between different financial group structures when synchronizing trial balances across products. This ensures accounts are correctly classified regardless of the source product's grouping schema.

### Subtotal Across Multiple Groups

Configure subtotal rows that aggregate balances from multiple groups in the trial balance display, useful for custom report layouts.

---

## Visibility Logic

> Source: `What-are-visibility-settings.htm`, `Visibility-conditions.htm`, `Examples-of-visibility-settings.htm`, `Precedence-rules-in-visibility-settings.htm`, `Export-the-visibility-settings.htm`

### What Are Visibility Settings

Visibility settings control when content appears in an engagement based on conditions. They apply to checklists, procedures, financial statements, queries, letters, and memos.

### Visibility Conditions

Conditions can be based on:
- **Component assignments** — Show/hide based on selected components
- **Engagement properties** — Entity type, industry, listing status
- **Phase** — Current engagement phase
- **Custom conditions** — Data-driven rules using engagement data

**Operators**: Equals, Not Equals, Contains, Greater Than, Less Than, Is Empty, Is Not Empty

### Examples

- Show a procedure only for listed entities: Component = "Listed"
- Hide a note when balance is zero: Account Balance = 0 → Hide
- Show tax-specific content: Product class includes "Tax"

### Precedence Rules

When multiple visibility rules conflict:
1. **Document-level** settings override product-level settings
2. **Firm author** settings override primary author settings
3. **Enterprise author** settings override primary and firm settings
4. More specific rules always take precedence over general rules

### Export Visibility Settings

Export all visibility settings to Excel for review, documentation, and auditing of content display rules.

---

## Engagement Glossary & Dynamic Text

> Source: `What's-the-engagement-glossary.htm`, `Define-engagement-glossary-terms.htm`, `What's-dynamic-text.htm`, `Conditions-for-glossary-terms-and-dynamic-text-display-logic.htm`

### Engagement Glossary

The engagement glossary is a centralized dictionary of terms that can be referenced throughout documents. When a glossary term changes, all references update automatically.

**Use cases**: Entity name, fiscal year, reporting framework, currency, partner name.

### Define Glossary Terms

Navigate to Product Settings → Engagement Glossary → Add Term. Each term has:
- **Key**: Unique identifier
- **Default Value**: Pre-populated value
- **User Editable**: Whether end users can modify the value
- **Description**: Help text for users

### Dynamic Text

Dynamic text inserts engagement-specific values into document content. Uses placeholder syntax to reference:
- Glossary terms
- Entity details
- Engagement dates
- Financial data

### Conditions for Display Logic

Glossary terms and dynamic text can have conditional display logic:
- Show different text based on entity type
- Hide text when data is not available
- Apply formatting rules based on conditions

---

## Checklists

> Source: 18 pages covering checklist authoring

### Add a Checklist

Create a new checklist document in the product template. Checklists contain structured procedures with response types for standardized audit/engagement work.

### Checklist Authoring Workflow

1. Add the checklist document
2. Define the structure (groups, subgroups, procedures)
3. Configure response types for procedures
4. Add guidance information
5. Set up preferences (links, data links, references)
6. Configure settings (visibility, components, signoff)
7. Review layout and test

### Response Types

| Type | Description |
|------|-------------|
| **Yes/No/N/A** | Simple tri-state response |
| **Text** | Free-text entry |
| **Date** | Date picker |
| **Number** | Numeric entry |
| **Dropdown** | Select from predefined options |
| **Multi-select** | Multiple option selection |
| **Table** | Tabular data entry |
| **Document Reference** | Link to other documents |

### Guidance Information

Add instructional text at the checklist, group, or procedure level. Guidance can include:
- Explanatory text
- Links to standards
- Step-by-step instructions
- Examples

### Groups and Subgroups

Organize procedures into logical groups:
- **Group**: Top-level organizational unit (e.g., "Revenue Testing")
- **Subgroup**: Nested organizational unit (e.g., "Substantive Procedures")
- Procedures belong to groups/subgroups

### Add a Procedure

Procedures are the individual steps within a checklist. Each procedure has:
- Description (rich text with links and data links)
- Response type
- Guidance information
- Visibility settings
- Component assignments

### Response Type Configuration

Assign response types to procedures to define how engagement teams enter responses. Multiple response types can be combined on a single procedure.

### Checklist Preferences

**Links**: Add hyperlinks in procedure descriptions to external resources or other documents.

**Data Links**: Insert dynamic data from the engagement (account balances, dates, entity details) directly into procedure descriptions using the fx (data link) function.

**Authoritative References**: Add references to professional standards (ISA, GAAS, IFRS) to procedures.

**Document References**: Link procedures to related documents in the engagement.

**Annotations**: Add author-to-user notes on procedures explaining intent or expected approach.

### Checklist Settings

**Default Settings**: Review and modify default visibility, signoff requirements, and display options.

**Procedure Settings**: Configure individual procedure behavior including mandatory completion, carryforward, and response validation.

**Visibility Logic**: Set conditions for showing/hiding procedures based on engagement properties, components, or data conditions.

**Component Assignment**: Assign checklists and procedures to components so they appear only for relevant engagement types.

### Layout

**Rearrange Procedures**: Drag and drop to reorder procedures, groups, and subgroups.

**Sample Response Types**: Review examples of common response type configurations.

**Sample Checklist Document**: View a complete sample checklist showing best practices for structure and content.

---

## Queries

> Source: 16 pages covering query authoring

### Add a Query Template (New Design)

Create a query document using the new design. Queries collect information from external parties (clients, third parties).

### Query Authoring Workflow

1. Add the query template
2. Define contact instructions
3. Create question sets and individual questions
4. Configure response types
5. Set up preferences (links, data links, document references)
6. Configure settings (visibility, author IDs, components)
7. Review layout and test

### Contact Instructions

Add instructions for the engagement team on how to reach the query recipient, including:
- Contact name and title
- Organization
- Email and phone
- Mailing address
- Special instructions

### Question Sets

Group related questions into question sets. Question sets organize the query into logical sections (e.g., "Bank Confirmation", "Legal Matters").

### Query Questions

Individual questions within a question set. Each question has:
- Question text (rich text with formatting)
- Response type
- Required/optional designation
- Cross-references to checklist procedures

### Responses

Configure how recipients respond to questions:
- Text responses
- Yes/No/N/A
- Date pickers
- Numeric fields
- Document attachments

### Query Preferences

**Links**: Add hyperlinks in question text to reference materials or external resources.

**Data Links**: Insert engagement data (balances, dates, entity names) into question text using the fx function.

**Document References**: Link questions to related engagement documents.

**Checklist Procedure Links**: Connect query questions to corresponding checklist procedures for audit trail.

### Query Settings

**Question Settings**: Configure individual question behavior, mandatory completion rules, and response validation.

**Visibility Logic**: Set conditions for showing/hiding questions based on engagement properties.

**Author IDs**: Assign author identifiers for tracking who created or last modified each question.

**Component Assignment**: Assign queries to specific components.

### Layout

**Rearrange Questions**: Drag and drop to reorder questions and question sets.

**Sample Query Template**: View a complete sample query showing best practices.

---

## Letters and Memos

> Source: 14 pages covering letter/memo authoring

### Authoring Workflow

1. Create the letter or memo document
2. Define content structure (grouping areas, text sections)
3. Add guidance information
4. Configure preferences (links, data links, placeholders)
5. Set up settings (print options, visibility, components)
6. Configure layout (TOC, headers/footers, page breaks)
7. Review with sample

### Content

**Guidance Information**: Add instructional text to guide engagement teams on when and how to use the letter.

**Grouping Areas**: Organize letter content into logical sections. Each grouping area can have its own visibility rules.

**Text**: Add rich text content including paragraphs, lists, tables, and formatted text. Supports data links and placeholders.

### Preferences

**Links**: Add or remove hyperlinks in letter/memo text.

**Data Links**: Insert dynamic engagement data using the fx function. Data links update automatically when source data changes.

**Placeholders**: Add placeholders for:
- Entity name and details
- Engagement dates
- Partner/staff names
- Custom values
- Date placeholders now support Long, Medium, and Short format types

### Settings

**Print Options**: Configure print settings including:
- Paper size and orientation
- Margins
- Header/footer content
- Page numbering
- Watermark options

**Visibility Logic**: Set display conditions for the entire letter or individual sections.

**Component Assignment**: Assign letters to specific engagement components.

### Layout and Samples

**Table of Contents**: Insert an auto-generated TOC based on document headings.

**Headers and Footers**: Add page headers/footers with entity name, date, page numbers, and custom text.

**Page Breaks**: Insert manual page breaks between sections.

**Letter Sample**: View a complete sample letter demonstrating best practices for structure, formatting, and content.

---

## Financial Statements

> Source: ~40 pages covering FS authoring

### Overview

Financial statements are the primary deliverable for many engagement types. SE authoring provides comprehensive tools for building dynamic, data-driven financial statements.

### Add the Financial Statements Document

Add an FS document to your product template. This creates the foundational structure for authoring.

### Table of Contents

Insert an auto-generated TOC that updates based on content areas, notes, and headings.

### FS Authoring Workflow

1. Add the FS document
2. Define content areas (balance sheet, income statement, etc.)
3. Add notes and text sections
4. Configure dynamic tables
5. Set up visibility logic and diagnostics
6. Configure print options and layout
7. Test with sample data

### Available Features for Users

End users can:
- View and interact with financial statements
- Toggle between rounding modes
- Print to PDF with watermarks
- Compare current/prior year
- Navigate via table of contents
- View/hide notes
- Customize column display

### Content Areas

**Add/Remove Content Areas**: Create sections for each financial statement component (Balance Sheet, Income Statement, Cash Flow Statement, Statement of Changes in Equity, Notes).

**Rename Content Areas**: Customize section names to match jurisdictional requirements.

**Analysis Section**: Add analytical sections for trend analysis and commentary.

**Statement of Cash Flows**: Configure cash flow statement structure with direct or indirect method.

**Exclude Content**: Mark content areas for conditional exclusion based on engagement properties.

**Embed PDF**: Embed PDF documents within financial statements (e.g., auditor independence declaration).

### Notes and Text

**Add Text**: Insert rich text content in financial statement sections. Supports formatting, lists, and tables.

**Links in Text**: Add hyperlinks to standards, regulations, or other references.

**Data Links**: Insert dynamic financial data values using the fx function.

**Placeholders**: Add date, entity name, and custom placeholders with format selectors (Long, Medium, Short for dates).

**Financial Statement Notes**: Create note sections with numbering, cross-references, and conditional display.

**Hide Sub-level Headings**: Control visibility of nested headings within notes.

**Note Associations**: Link notes to specific financial statement line items for automatic "see Note X" references.

**Exclude Notes**: Set conditions for when notes should be hidden (e.g., when related balance is zero).

**Note References in Text**: Insert cross-references to notes within text sections.

**Change Note References**: Update existing note references when notes are reorganized.

**Notes Library**: Create a reusable library of note templates for consistency across products.

**Export Notes to Custom Form**: Export financial statement notes data to SE Builder custom forms.

### Dynamic Tables

**Workflow**: Create dynamic tables → Add rows → Add columns → Configure settings → Apply formatting.

**Add Rows**: Define table rows from:
- Trial balance groups
- Custom groups
- Calculated rows
- Subtotal rows
- Spacer/separator rows

**Add Columns**: Configure columns for:
- Current year balances
- Prior year balances
- Variance (absolute and percentage)
- Custom calculated columns
- Note reference columns

**Column Settings**: Configure column width, alignment, number formatting, and visibility.

**Display Row Balances with Opposite Sign**: Reverse sign convention for specific rows (e.g., show liabilities as positive).

**Cell Calculations**: Add formulas to table cells using row/column references.

**Cell References**: Reference values from other cells, rows, or columns within the table.

**Note References in Tables**: Insert note reference numbers in table cells linking to the notes section.

**User-Editable Rows**: Allow end users to add custom rows directly in the table during engagement.

**Custom Groups**: Create custom groupings within tables that don't correspond to trial balance groups.

**Exclude from Custom Group Totals**: Exclude specific rows from custom group subtotals.

**Display Options for Rows**: Control row display (always show, hide when zero, merge with next row).

**Hide Header Rows**: Control visibility of dynamic table header rows.

**Zero Balance Columns**: Configure display behavior for columns where all values are zero.

**Group Columns**: Create visual column groupings with spanning headers.

**Underline/Overline Options**: Set default and per-row underline and overline styles for totals and subtotals.

**Currency Symbol Options**: Configure default and per-row currency symbol display.

**Display Options for Accounts/Groups**: Control how individual accounts and groups appear in tables.

**Font Size**: Adjust dynamic table font size independently from document font size.

**Page Breaks**: Insert page breaks within dynamic tables.

**Table Format**: Change overall table formatting (borders, shading, spacing).

**Copy/Cut Tables**: Duplicate or move entire tables between content areas.

### Settings

**Visibility Logic**: Set conditions for showing/hiding content areas, notes, and sections.

**Diagnostics**: Set up validation rules that check for common errors (missing notes, unbalanced statements, rounding differences).

**Rounding Differences**: Configure which group absorbs rounding differences when using rounded figures.

**Consolidated Data**: Specify whether to use consolidated or standalone data in group audit scenarios.

**Print Options**: Configure print settings including paper size, margins, orientation, watermark, and PDF format options.

**Component Assignment**: Assign financial statements to specific engagement components.

**Numbered Headings**: Customize heading numbering formats (1.1, 1.1.1, a, b, c, etc.).

### Layout

**Rearrange Areas**: Drag and drop to reorder content areas within the financial statements.

**Page Breaks**: Insert manual page breaks between content areas.

**Headers/Footers**: Add page headers and footers with dynamic content (entity name, date, page numbers).

**Font Sizes and Spacing**: Customize font sizes and line spacing for headings, body text, and notes.

### Best Practices and Samples

**Best Practices**:
- Use consistent grouping structures across products
- Test with maximum data volumes
- Use dynamic tables instead of static text for financial data
- Configure diagnostics early in the authoring process
- Follow performance recommendations for large templates

**Performance Testing Reference**: Benchmarks and recommendations for template performance including table row limits, note count thresholds, and optimal configuration patterns.

**Sample Notes Structure**: Example notes organization showing typical note hierarchy.

**Sample Financial Statements Document**: Complete sample showing all FS features in use.

**Rounding Recommendations**: Guidance on rounding approaches for authors, including group selection for rounding differences and display precision.

---

## XBRL

> Source: `Whats-new-xbrl.htm`, `Release-history-xbrl.htm`, `Get-started-with-internal-XBRL-tools.htm`, `Review-and-add-XBRL-tags.htm`, `Add-or-edit-a-context.htm`, `Add-a-dimensional-or-typed-dimensional-context.htm`, `Add-a-footnote.htm`, `Mark-contexts-as-a-favorite.htm`, `Add-or-edit-a-numeric.htm`, `Export-XBRL-reports.htm`

### Overview

XBRL (eXtensible Business Reporting Language) tagging enables structured data markup on financial statements for regulatory filing (iXBRL format).

### Getting Started

**Introducing the XBRL Tool**: The XBRL tool integrates with financial statements authoring, allowing authors to tag financial data with XBRL taxonomies. Supports multiple taxonomies per jurisdiction.

**Internal XBRL Tools**: Set up internal XBRL tagging tools for your product. Requires enabling the iXBRL feature in product settings and configuring the appropriate taxonomy.

### Tagging

**Review and Add Tags**: Navigate to financial statements → Open XBRL panel → Select elements to tag. Tags are applied to table cells, text sections, and notes.

**Contexts**: Define reporting contexts specifying:
- Entity identifier
- Reporting period (instant or duration)
- Scenario/segment details

**Dimensional Contexts**: Add XBRL dimensions for multi-dimensional reporting (e.g., by business segment, geographic region). Supports both explicit and typed dimensions.

**Footnotes**: Add XBRL footnotes to tagged values providing additional context or explanation.

**Favorite Contexts**: Mark frequently used contexts as favorites for quick access during tagging.

**Numerics**: Add or edit numeric tags specifying unit of measure, precision/decimals, and sign convention.

**Export Reports**: Export XBRL reports in iXBRL format for filing. Reports include validation results and filing readiness checks.

### Release History

Monthly XBRL updates from January 2025 through February 2026 covering taxonomy updates, bug fixes, and new tagging features.

---

## Risk Library

> Source: `Create-a-risk-library.htm`, `Add-a-risk-library-version.htm`, `Test-a-risk-library-version.htm`, `Publish-a-risk-library-version.htm`

### Create a Risk Library

Risk libraries contain pre-defined risks, controls, and audit responses. Create a library to standardize risk assessment across engagements.

**Steps**: Navigate to Risk Libraries → Create New → Define library name and description → Add risk categories.

### Add a Risk Library Version

Create versions to track changes over time. Each version can contain updated risks, new controls, or modified responses. Versioning ensures backward compatibility with existing engagements.

### Test a Risk Library Version

Test the risk library version in a sandbox engagement before publishing:
1. Create a test engagement
2. Associate the draft risk library version
3. Verify risks populate correctly
4. Check control linkages
5. Validate response templates

### Publish a Risk Library Version

Publishing makes the version available to all engagements using the associated product. Published versions are immutable — create a new version for changes.

---

## Data Analytics

> Source: `Customize-analytic-test.htm`, `Link-analytics-to-checklist-procedure.htm`, `Manage-analytics-tests-in-the-Analytics-Hub.htm`

### Customize Analytic Tests

Create and customize data analytic tests for engagement-specific analysis. Tests can be configured with:
- Parameters (thresholds, date ranges, account selections)
- Visualization settings
- Expected outcome rules

### Link Analytics to Checklist Procedures

Connect analytics results directly to checklist procedures so that:
- Test results pre-populate procedure responses
- Exceptions are automatically flagged
- Audit trail connects analytics to procedures

### Analytics Hub Management

Manage all analytic tests from the centralized Analytics Hub:
- View test status and results
- Enable/disable tests per engagement
- Configure test parameters
- Review exception reports

---

## Multilingual Support

> Source: `What-is-multi--language-support.htm`, `Recommendations-for-multi--language-implementation.htm`, `Use--case---A-product-with-French-and-English-language-support.htm`

### Overview

Multi-language support allows SE products to present content in multiple languages, enabling firms to serve clients in different regions with a single product template.

### Recommendations

- Define the primary language during initial product setup
- Use the engagement glossary for language-specific terms
- Use language tokens/keys for translatable content
- Test all supported languages before publishing
- Consider font and character encoding requirements
- Plan for languages that require right-to-left text support

### Use Case: French and English

Example implementation for a bilingual product:
1. Set up English as primary language, French as secondary
2. Configure content language settings in Product Settings
3. Add French translations for all user-facing content
4. Configure language-specific financial statement formats
5. Test with both language selections

---

## Cloud Connector: Office 365

> Source: `How-to-get-started-with-Cloud-Connector.htm`, `Data-linkage-and-realtime-updates.htm`, `Insert-data-using-the-right-pane.htm`, `Insert-data-using-MS-Excel-formula-dialog.htm`, `Insert-data-using-MS-Excel-formula-bar.htm`, `List-of-Cloud-Connector-functions.htm`

### Getting Started

Cloud Connector integrates Microsoft Excel (Office 365) with Caseware Cloud engagements, enabling real-time data exchange between Excel workbooks and SE engagement data.

**Prerequisites**: Office 365 license, Cloud Connector add-in installed in Excel, engagement access with appropriate permissions.

### Data Linkage and Real-Time Updates

Cloud Connector uses formulas to create live links between Excel cells and engagement data sources. When engagement data changes, linked Excel values update in real-time.

### Insert Data Methods

**Right Pane**: Use the Cloud Connector right pane to browse available data sources and insert data links visually.

**Excel Formula Dialog**: Use Excel's formula dialog to build Cloud Connector functions with parameter guidance.

**Excel Formula Bar**: Type Cloud Connector functions directly in the formula bar for experienced users.

### Cloud Connector Functions

Available functions for accessing engagement data from Excel:

| Function | Description |
|----------|-------------|
| `CWDATA` | Retrieve a single data value |
| `CWLIST` | Retrieve a list of values |
| `CWTABLE` | Retrieve tabular data |
| `CWENTITY` | Get entity-level information |
| `CWBALANCE` | Get account balance for specified period |
| `CWGROUPBALANCE` | Get group total balance |
| `CWPROPERTY` | Get engagement property value |

---

## Microsoft Office Documents

> Source: `Add-new-Word-and-Excel-documents.htm`

### Add Word and Excel Documents

Add Microsoft Word (.docx) and Excel (.xlsx) documents to the product template. These documents:
- Are stored within the engagement
- Support Cloud Connector data links (Excel)
- Can be assigned to components
- Have signoff and review workflows
- Can be included in bulk print

---

## Smart Copy-Paste

> Source: `What-is-Smart-Copy---Paste.htm`, `Copy-content-from-another-template.htm`, `Resolve-conflicts-in-financial-statements.htm`, `Current-limitations-in-smart-copy---paste.htm`

### Overview

Smart Copy-Paste allows authors to copy content between product templates while maintaining structural integrity and references. This accelerates template development by reusing content from existing products.

### Copy Content from Another Template

1. Open the target template in authoring mode
2. Select Smart Copy-Paste from the tools menu
3. Choose the source template
4. Select content to copy (checklists, procedures, FS sections, notes)
5. Review and confirm the copy operation

### Resolve Conflicts in Financial Statements

When pasting content, conflicts may arise from:
- Duplicate group codes
- Conflicting note numbers
- Mismatched column configurations
- Different grouping structures

The conflict resolution wizard guides authors through resolving each conflict.

### Current Limitations

- Cannot copy between different product types (audit → tax)
- Custom form configurations are not copied
- Some JavaScript logic may need manual updates
- Visibility conditions referencing product-specific properties need review
- XBRL tags are not preserved during copy

---

## Reports

> Source: `Set-up-the-Risk-report.htm`, `Set-up-the-Control-report.htm`, `Set-up-the-Risk-of-Material-Misstatements-(RMM)-Assessment-report.htm`, `Set-up-the-Materiality-document.htm`, `Set-up-the-Summary-of-Misstatements.htm`

### Risk Report

Configure the risk report to summarize identified risks, risk levels, and planned audit responses. Settings include:
- Risk categories to include
- Display order (by area, cycle, or risk level)
- Column configuration
- Print formatting

### Control Report

Set up the control assessment report showing:
- Identified controls per risk
- Control effectiveness ratings
- Design and operating effectiveness assessments
- Remediation tracking

### Risk of Material Misstatements (RMM) Assessment Report

Configure the RMM report combining inherent risk and control risk assessments:
- Risk matrix display
- Assertion-level assessments
- Planned audit response alignment
- Overall engagement risk summary

### Materiality Document

Set up the materiality document for calculating and documenting:
- Overall materiality
- Performance materiality
- Specific item materiality
- Clearly trivial threshold
- Materiality benchmarks and percentages

### Summary of Misstatements

Configure the misstatements summary document to track:
- Identified misstatements (factual, judgmental, projected)
- Aggregation by area/cycle
- Impact on materiality thresholds
- Management representation status

---

## Global Components

> Source: `Accounting-Estimates-Context-view.htm`, `Audit-response-table.htm`, `Cash-flow-import-copy-paste-tool.htm`, `Dimensions-allocation-worksheets.htm`, `Partner-and-manager-summary.htm`, `Sherlock-integration-se-checklist-procedure-responses.htm`, `How-to-identify-the-procedure-ID.htm`

### Accounting Estimates - Context View

Provides a structured view for documenting and evaluating accounting estimates. Includes fields for:
- Estimate description and method
- Source data and assumptions
- Prior year comparison
- Management's point estimate vs. auditor's range
- Conclusion

### Audit Response Table

A configurable table linking identified risks to planned audit responses. Authors configure:
- Columns for risk description, assertion, response type, timing
- Pre-populated and user-editable fields
- Integration with risk module data

### Dynamic Audit Response Table

Extended version of the Audit Response Table with dynamic data population from the risk assessment module.

### Cash Flow Import / Copy-Paste Tool

Tool for importing cash flow data into the statement of cash flows:
- Import from Excel via copy-paste
- Map imported columns to cash flow categories
- Validate imported data against trial balance

### Dimensions Allocation Worksheets

Worksheets for allocating dimension-specific balances across reporting units or segments. Used in multi-dimensional reporting scenarios.

### Partner and Manager Summary

Pre-configured summary document for partners and managers showing:
- Engagement status overview
- Key findings and issues
- Materiality summary
- Outstanding items
- Signoff progress

### Sherlock Integration

Integration between Sherlock AI analysis and SE checklist procedure responses. When Sherlock analysis identifies findings, they can be automatically linked to relevant checklist procedures.

### Tips and FAQ: Identify Procedure ID

How to find the unique procedure ID for any checklist procedure — useful for API integration and debugging.

---

## Finalize and Distribute

> Source: `Workflow-(how-to-finalize-your-draft).htm`, `Finalize-your-draft.htm`, `Distribute-the-template.htm`

### Finalization Workflow

1. Complete all content authoring
2. Review template settings and configurations
3. Run diagnostics and fix any errors
4. Create a test engagement and validate
5. Finalize the draft
6. Distribute the template

### Finalize Your Draft

Before finalizing:
- Ensure all content is complete
- Verify visibility logic works as expected
- Check all component assignments
- Review signoff configurations
- Test print output (PDF)
- Validate XBRL tagging (if applicable)

**To finalize**: Navigate to Manage Template → Finalize Draft. This publishes the template version and makes it available for distribution.

### Distribute the Template

After finalizing, distribute the template to make it available for end users:
- The template becomes available to firms subscribed to the product
- Existing engagements are not affected (changes only apply to new engagements)
- Firm and enterprise authors can then apply their customizations on top

---

## Performance and Scalability Metrics

> Source: `Performance-and-scalability-metrics.htm`

### Benchmarks and Recommendations

Performance metrics for SE product templates:

| Metric | Recommended Maximum |
|--------|-------------------|
| **Checklist procedures** | Varies by document complexity |
| **Financial statement notes** | Monitor rendering time with 50+ notes |
| **Dynamic table rows** | Follow table-specific limits |
| **Total documents** | Consider engagement load time |
| **Visibility conditions** | Minimize complex nested conditions |

**Performance Tips**:
- Reduce unnecessary visibility conditions
- Optimize dynamic table configurations
- Limit the number of data links per page
- Test with representative data volumes
- Monitor engagement creation time as template grows
- Use components to reduce content for simpler engagement types
