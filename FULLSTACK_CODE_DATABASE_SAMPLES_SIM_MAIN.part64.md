---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 64
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 64 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: apollo.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/apollo.mdx

```text
---
title: Apollo
description: Search, enrich, and manage contacts with Apollo.io
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apollo"
  color="#EBF212"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apollo.io](https://apollo.io/) is a leading sales intelligence and engagement platform that empowers users to find, enrich, and engage contacts and companies at scale. Apollo.io combines an extensive contact database with robust enrichment and workflow automation tools, assisting sales, marketing, and recruiting teams to accelerate growth.

With Apollo.io, you can:

- **Search millions of contacts and companies**: Find precise leads using advanced filters
- **Enrich leads and accounts**: Fill in missing details with verified data and up-to-date information
- **Manage and organize CRM records**: Keep your people and company data accurate and actionable
- **Automate outreach**: Add contacts to sequences and create follow-up tasks directly from Apollo.io

In Sim, the Apollo.io integration allows your agents to perform core Apollo operations programmatically:

- **Search people and companies**: Use `apollo_people_search` to discover new leads using flexible filters.
- **Enrich people data**: Use `apollo_people_enrich` to augment contacts with verified information.
- **Enrich people in bulk**: Use `apollo_people_bulk_enrich` for large-scale enrichment of multiple contacts at once.
- **Search and enrich companies**: Use `apollo_company_search` and `apollo_company_enrich` to discover and update key company information.

This enables your agents to build powerful workflows for prospecting, CRM enrichment, and automation without manual data entry or switching tabs. Integrate Apollo.io as a dynamic data source and CRM engine — empowering your agents to identify, qualify, and reach out to leads seamlessly as part of their daily operations.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrates Apollo.io into the workflow. Search for people and companies, enrich contact data, manage your CRM contacts and accounts, add contacts to sequences, and create tasks.



## Tools

### `apollo_people_search`

Search Apollo

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `person_titles` | array | No | Job titles to search for \(e.g., \["CEO", "VP of Sales"\]\) |
| `person_locations` | array | No | Locations to search in \(e.g., \["San Francisco, CA", "New York, NY"\]\) |
| `person_seniorities` | array | No | Seniority levels \(e.g., \["senior", "executive", "manager"\]\) |
| `organization_names` | array | No | Company names to search within |
| `q_keywords` | string | No | Keywords to search for |
| `page` | number | No | Page number for pagination \(default: 1\) |
| `per_page` | number | No | Results per page \(default: 25, max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `people` | json | Array of people matching the search criteria |
| `metadata` | json | Pagination information including page, per_page, and total_entries |

### `apollo_people_enrich`

Enrich data for a single person using Apollo

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `first_name` | string | No | First name of the person |
| `last_name` | string | No | Last name of the person |
| `email` | string | No | Email address of the person |
| `organization_name` | string | No | Company name where the person works |
| `domain` | string | No | Company domain \(e.g., apollo.io\) |
| `linkedin_url` | string | No | LinkedIn profile URL |
| `reveal_personal_emails` | boolean | No | Reveal personal email addresses \(uses credits\) |
| `reveal_phone_number` | boolean | No | Reveal phone numbers \(uses credits\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `person` | json | Enriched person data from Apollo |
| `metadata` | json | Enrichment metadata including enriched status |

### `apollo_people_bulk_enrich`

Enrich data for up to 10 people at once using Apollo

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `people` | array | Yes | Array of people to enrich \(max 10\) |
| `reveal_personal_emails` | boolean | No | Reveal personal email addresses \(uses credits\) |
| `reveal_phone_number` | boolean | No | Reveal phone numbers \(uses credits\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `people` | json | Array of enriched people data |
| `metadata` | json | Bulk enrichment metadata including total and enriched counts |

### `apollo_organization_search`

Search Apollo

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `organization_locations` | array | No | Company locations to search |
| `organization_num_employees_ranges` | array | No | Employee count ranges \(e.g., \["1-10", "11-50"\]\) |
| `q_organization_keyword_tags` | array | No | Industry or keyword tags |
| `q_organization_name` | string | No | Organization name to search for |
| `page` | number | No | Page number for pagination |
| `per_page` | number | No | Results per page \(max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `organizations` | json | Array of organizations matching the search criteria |
| `metadata` | json | Pagination information including page, per_page, and total_entries |

### `apollo_organization_enrich`

Enrich data for a single organization using Apollo

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `organization_name` | string | No | Name of the organization \(at least one of organization_name or domain is required\) |
| `domain` | string | No | Company domain \(e.g., apollo.io\) \(at least one of domain or organization_name is required\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `organization` | json | Enriched organization data from Apollo |
| `metadata` | json | Enrichment metadata including enriched status |

### `apollo_organization_bulk_enrich`

Enrich data for up to 10 organizations at once using Apollo

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `organizations` | array | Yes | Array of organizations to enrich \(max 10\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `organizations` | json | Array of enriched organization data |
| `metadata` | json | Bulk enrichment metadata including total and enriched counts |

### `apollo_contact_create`

Create a new contact in your Apollo database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `first_name` | string | Yes | First name of the contact |
| `last_name` | string | Yes | Last name of the contact |
| `email` | string | No | Email address of the contact |
| `title` | string | No | Job title |
| `account_id` | string | No | Apollo account ID to associate with |
| `owner_id` | string | No | User ID of the contact owner |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contact` | json | Created contact data from Apollo |
| `metadata` | json | Creation metadata including created status |

### `apollo_contact_update`

Update an existing contact in your Apollo database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `contact_id` | string | Yes | ID of the contact to update |
| `first_name` | string | No | First name of the contact |
| `last_name` | string | No | Last name of the contact |
| `email` | string | No | Email address |
| `title` | string | No | Job title |
| `account_id` | string | No | Apollo account ID |
| `owner_id` | string | No | User ID of the contact owner |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contact` | json | Updated contact data from Apollo |
| `metadata` | json | Update metadata including updated status |

### `apollo_contact_search`

Search your team

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `q_keywords` | string | No | Keywords to search for |
| `contact_stage_ids` | array | No | Filter by contact stage IDs |
| `page` | number | No | Page number for pagination |
| `per_page` | number | No | Results per page \(max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contacts` | json | Array of contacts matching the search criteria |
| `metadata` | json | Pagination information including page, per_page, and total_entries |

### `apollo_contact_bulk_create`

Create up to 100 contacts at once in your Apollo database. Supports deduplication to prevent creating duplicate contacts. Master key required.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `contacts` | array | Yes | Array of contacts to create \(max 100\). Each contact should include first_name, last_name, and optionally email, title, account_id, owner_id |
| `run_dedupe` | boolean | No | Enable deduplication to prevent creating duplicate contacts. When true, existing contacts are returned without modification |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `created_contacts` | json | Array of newly created contacts |
| `existing_contacts` | json | Array of existing contacts \(when deduplication is enabled\) |
| `metadata` | json | Bulk creation metadata including counts of created and existing contacts |

### `apollo_contact_bulk_update`

Update up to 100 existing contacts at once in your Apollo database. Each contact must include an id field. Master key required.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `contacts` | array | Yes | Array of contacts to update \(max 100\). Each contact must include id field, and optionally first_name, last_name, email, title, account_id, owner_id |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `updated_contacts` | json | Array of successfully updated contacts |
| `failed_contacts` | json | Array of contacts that failed to update |
| `metadata` | json | Bulk update metadata including counts of updated and failed contacts |

### `apollo_account_create`

Create a new account (company) in your Apollo database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `name` | string | Yes | Company name |
| `website_url` | string | No | Company website URL |
| `phone` | string | No | Company phone number |
| `owner_id` | string | No | User ID of the account owner |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `account` | json | Created account data from Apollo |
| `metadata` | json | Creation metadata including created status |

### `apollo_account_update`

Update an existing account in your Apollo database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `account_id` | string | Yes | ID of the account to update |
| `name` | string | No | Company name |
| `website_url` | string | No | Company website URL |
| `phone` | string | No | Company phone number |
| `owner_id` | string | No | User ID of the account owner |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `account` | json | Updated account data from Apollo |
| `metadata` | json | Update metadata including updated status |

### `apollo_account_search`

Search your team

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `q_keywords` | string | No | Keywords to search for in account data |
| `owner_id` | string | No | Filter by account owner user ID |
| `account_stage_ids` | array | No | Filter by account stage IDs |
| `page` | number | No | Page number for pagination |
| `per_page` | number | No | Results per page \(max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `accounts` | json | Array of accounts matching the search criteria |
| `metadata` | json | Pagination information including page, per_page, and total_entries |

### `apollo_account_bulk_create`

Create up to 100 accounts at once in your Apollo database. Note: Apollo does not apply deduplication - duplicate accounts may be created if entries share similar names or domains. Master key required.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `accounts` | array | Yes | Array of accounts to create \(max 100\). Each account should include name \(required\), and optionally website_url, phone, owner_id |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `created_accounts` | json | Array of newly created accounts |
| `failed_accounts` | json | Array of accounts that failed to create |
| `metadata` | json | Bulk creation metadata including counts of created and failed accounts |

### `apollo_account_bulk_update`

Update up to 1000 existing accounts at once in your Apollo database (higher limit than contacts!). Each account must include an id field. Master key required.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `accounts` | array | Yes | Array of accounts to update \(max 1000\). Each account must include id field, and optionally name, website_url, phone, owner_id |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `updated_accounts` | json | Array of successfully updated accounts |
| `failed_accounts` | json | Array of accounts that failed to update |
| `metadata` | json | Bulk update metadata including counts of updated and failed accounts |

### `apollo_opportunity_create`

Create a new deal for an account in your Apollo database (master key required)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `name` | string | Yes | Name of the opportunity/deal |
| `account_id` | string | Yes | ID of the account this opportunity belongs to |
| `amount` | number | No | Monetary value of the opportunity |
| `stage_id` | string | No | ID of the deal stage |
| `owner_id` | string | No | User ID of the opportunity owner |
| `close_date` | string | No | Expected close date \(ISO 8601 format\) |
| `description` | string | No | Description or notes about the opportunity |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `opportunity` | json | Created opportunity data from Apollo |
| `metadata` | json | Creation metadata including created status |

### `apollo_opportunity_search`

Search and list all deals/opportunities in your team

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `q_keywords` | string | No | Keywords to search for in opportunity names |
| `account_ids` | array | No | Filter by specific account IDs |
| `stage_ids` | array | No | Filter by deal stage IDs |
| `owner_ids` | array | No | Filter by opportunity owner IDs |
| `page` | number | No | Page number for pagination |
| `per_page` | number | No | Results per page \(max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `opportunities` | json | Array of opportunities matching the search criteria |
| `metadata` | json | Pagination information including page, per_page, and total_entries |

### `apollo_opportunity_get`

Retrieve complete details of a specific deal/opportunity by ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `opportunity_id` | string | Yes | ID of the opportunity to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `opportunity` | json | Complete opportunity data from Apollo |
| `metadata` | json | Retrieval metadata including found status |

### `apollo_opportunity_update`

Update an existing deal/opportunity in your Apollo database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key |
| `opportunity_id` | string | Yes | ID of the opportunity to update |
| `name` | string | No | Name of the opportunity/deal |
| `amount` | number | No | Monetary value of the opportunity |
| `stage_id` | string | No | ID of the deal stage |
| `owner_id` | string | No | User ID of the opportunity owner |
| `close_date` | string | No | Expected close date \(ISO 8601 format\) |
| `description` | string | No | Description or notes about the opportunity |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `opportunity` | json | Updated opportunity data from Apollo |
| `metadata` | json | Update metadata including updated status |

### `apollo_sequence_search`

Search for sequences/campaigns in your team

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `q_name` | string | No | Search sequences by name |
| `active` | boolean | No | Filter by active status \(true for active sequences, false for inactive\) |
| `page` | number | No | Page number for pagination |
| `per_page` | number | No | Results per page \(max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `sequences` | json | Array of sequences/campaigns matching the search criteria |
| `metadata` | json | Pagination information including page, per_page, and total_entries |

### `apollo_sequence_add_contacts`

Add contacts to an Apollo sequence

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `sequence_id` | string | Yes | ID of the sequence to add contacts to |
| `contact_ids` | array | Yes | Array of contact IDs to add to the sequence |
| `emailer_campaign_id` | string | No | Optional emailer campaign ID |
| `send_email_from_user_id` | string | No | User ID to send emails from |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contacts_added` | json | Array of contact IDs added to the sequence |
| `metadata` | json | Sequence metadata including sequence_id and total_added count |

### `apollo_task_create`

Create a new task in Apollo

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `note` | string | Yes | Task note/description |
| `contact_id` | string | No | Contact ID to associate with |
| `account_id` | string | No | Account ID to associate with |
| `due_at` | string | No | Due date in ISO format |
| `priority` | string | No | Task priority |
| `type` | string | No | Task type |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `task` | json | Created task data from Apollo |
| `metadata` | json | Creation metadata including created status |

### `apollo_task_search`

Search for tasks in Apollo

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |
| `contact_id` | string | No | Filter by contact ID |
| `account_id` | string | No | Filter by account ID |
| `completed` | boolean | No | Filter by completion status |
| `page` | number | No | Page number for pagination |
| `per_page` | number | No | Results per page \(max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tasks` | json | Array of tasks matching the search criteria |
| `metadata` | json | Pagination information including page, per_page, and total_entries |

### `apollo_email_accounts`

Get list of team

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Apollo API key \(master key required\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `email_accounts` | json | Array of team email accounts linked in Apollo |
| `metadata` | json | Metadata including total count of email accounts |



## Notes

- Category: `tools`
- Type: `apollo`
```

--------------------------------------------------------------------------------

---[FILE: arxiv.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/arxiv.mdx

```text
---
title: ArXiv
description: Search and retrieve academic papers from ArXiv
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="arxiv"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[ArXiv](https://arxiv.org/) is a free, open-access repository of scientific research papers in fields such as physics, mathematics, computer science, quantitative biology, quantitative finance, statistics, electrical engineering, systems science, and economics. ArXiv provides a vast collection of preprints and published articles, making it a primary resource for researchers and practitioners worldwide.

With ArXiv, you can:

- **Search for academic papers**: Find research by keywords, author names, titles, categories, and more
- **Retrieve paper metadata**: Access abstracts, author lists, publication dates, and other bibliographic information
- **Download full-text PDFs**: Obtain the complete text of most papers for in-depth study
- **Explore author contributions**: View all papers by a specific author
- **Stay up-to-date**: Discover the latest submissions and trending topics in your field

In Sim, the ArXiv integration enables your agents to programmatically search, retrieve, and analyze scientific papers from ArXiv. This allows you to automate literature reviews, build research assistants, or incorporate up-to-date scientific knowledge into your agentic workflows. Use ArXiv as a dynamic data source for research, discovery, and knowledge extraction within your Sim projects.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrates ArXiv into the workflow. Can search for papers, get paper details, and get author papers. Does not require OAuth or an API key.



## Tools

### `arxiv_search`

Search for academic papers on ArXiv by keywords, authors, titles, or other fields.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `searchQuery` | string | Yes | The search query to execute |
| `searchField` | string | No | Field to search in: all, ti \(title\), au \(author\), abs \(abstract\), co \(comment\), jr \(journal\), cat \(category\), rn \(report number\) |
| `maxResults` | number | No | Maximum number of results to return \(default: 10, max: 2000\) |
| `sortBy` | string | No | Sort by: relevance, lastUpdatedDate, submittedDate \(default: relevance\) |
| `sortOrder` | string | No | Sort order: ascending, descending \(default: descending\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `papers` | json | Array of papers matching the search query |

### `arxiv_get_paper`

Get detailed information about a specific ArXiv paper by its ID.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `paperId` | string | Yes | ArXiv paper ID \(e.g., "1706.03762"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `paper` | json | Detailed information about the requested ArXiv paper |

### `arxiv_get_author_papers`

Search for papers by a specific author on ArXiv.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authorName` | string | Yes | Author name to search for |
| `maxResults` | number | No | Maximum number of results to return \(default: 10, max: 2000\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `authorPapers` | json | Array of papers authored by the specified author |



## Notes

- Category: `tools`
- Type: `arxiv`
```

--------------------------------------------------------------------------------

---[FILE: asana.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/asana.mdx

```text
---
title: Asana
description: Interact with Asana
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="asana"
  color="#E0E0E0"
/>

## Usage Instructions

Integrate Asana into the workflow. Can read, write, and update tasks.



## Tools

### `asana_get_task`

Retrieve a single task by GID or get multiple tasks with filters

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | No | The globally unique identifier \(GID\) of the task. If not provided, will get multiple tasks. |
| `workspace` | string | No | Workspace GID to filter tasks \(required when not using taskGid\) |
| `project` | string | No | Project GID to filter tasks |
| `limit` | number | No | Maximum number of tasks to return \(default: 50\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `ts` | string | Timestamp of the response |
| `gid` | string | Task globally unique identifier |
| `resource_type` | string | Resource type \(task\) |
| `resource_subtype` | string | Resource subtype |
| `name` | string | Task name |
| `notes` | string | Task notes or description |
| `completed` | boolean | Whether the task is completed |
| `assignee` | object | Assignee details |

### `asana_create_task`

Create a new task in Asana

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Yes | Workspace GID where the task will be created |
| `name` | string | Yes | Name of the task |
| `notes` | string | No | Notes or description for the task |
| `assignee` | string | No | User GID to assign the task to |
| `due_on` | string | No | Due date in YYYY-MM-DD format |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `ts` | string | Timestamp of the response |
| `gid` | string | Task globally unique identifier |
| `name` | string | Task name |
| `notes` | string | Task notes or description |
| `completed` | boolean | Whether the task is completed |
| `created_at` | string | Task creation timestamp |
| `permalink_url` | string | URL to the task in Asana |

### `asana_update_task`

Update an existing task in Asana

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | Yes | The globally unique identifier \(GID\) of the task to update |
| `name` | string | No | Updated name for the task |
| `notes` | string | No | Updated notes or description for the task |
| `assignee` | string | No | Updated assignee user GID |
| `completed` | boolean | No | Mark task as completed or not completed |
| `due_on` | string | No | Updated due date in YYYY-MM-DD format |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `ts` | string | Timestamp of the response |
| `gid` | string | Task globally unique identifier |
| `name` | string | Task name |
| `notes` | string | Task notes or description |
| `completed` | boolean | Whether the task is completed |
| `modified_at` | string | Task last modified timestamp |

### `asana_get_projects`

Retrieve all projects from an Asana workspace

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Yes | Workspace GID to retrieve projects from |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `ts` | string | Timestamp of the response |
| `projects` | array | Array of projects |

### `asana_search_tasks`

Search for tasks in an Asana workspace

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | Yes | Workspace GID to search tasks in |
| `text` | string | No | Text to search for in task names |
| `assignee` | string | No | Filter tasks by assignee user GID |
| `projects` | array | No | Array of project GIDs to filter tasks by |
| `completed` | boolean | No | Filter by completion status |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `ts` | string | Timestamp of the response |
| `tasks` | array | Array of matching tasks |

### `asana_add_comment`

Add a comment (story) to an Asana task

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | Yes | The globally unique identifier \(GID\) of the task |
| `text` | string | Yes | The text content of the comment |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `ts` | string | Timestamp of the response |
| `gid` | string | Comment globally unique identifier |
| `text` | string | Comment text content |
| `created_at` | string | Comment creation timestamp |
| `created_by` | object | Comment author details |



## Notes

- Category: `tools`
- Type: `asana`
```

--------------------------------------------------------------------------------

---[FILE: browser_use.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/browser_use.mdx

```text
---
title: Browser Use
description: Run browser automation tasks
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="browser_use"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[BrowserUse](https://browser-use.com/) is a powerful browser automation platform that enables you to create and run browser tasks programmatically. It provides a way to automate web interactions through natural language instructions, allowing you to navigate websites, fill forms, extract data, and perform complex sequences of actions without writing code.

With BrowserUse, you can:

- **Automate web interactions**: Navigate to websites, click buttons, fill forms, and perform other browser actions
- **Extract data**: Scrape content from websites, including text, images, and structured data
- **Execute complex workflows**: Chain multiple actions together to complete sophisticated web tasks
- **Monitor task execution**: Watch browser tasks run in real-time with visual feedback
- **Process results programmatically**: Receive structured output from web automation tasks

In Sim, the BrowserUse integration allows your agents to interact with the web as if they were human users. This enables scenarios like research, data collection, form submission, and web testing - all through simple natural language instructions. Your agents can gather information from websites, interact with web applications, and perform actions that would typically require manual browsing, expanding their capabilities to include the entire web as a resource.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Browser Use into the workflow. Can navigate the web and perform actions as if a real user was interacting with the browser.



## Tools

### `browser_use_run_task`

Runs a browser automation task using BrowserUse

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `task` | string | Yes | What should the browser agent do |
| `variables` | json | No | Optional variables to use as secrets \(format: \{key: value\}\) |
| `format` | string | No | No description |
| `save_browser_data` | boolean | No | Whether to save browser data |
| `model` | string | No | LLM model to use \(default: gpt-4o\) |
| `apiKey` | string | Yes | API key for BrowserUse API |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | Task execution identifier |
| `success` | boolean | Task completion status |
| `output` | json | Task output data |
| `steps` | json | Execution steps taken |



## Notes

- Category: `tools`
- Type: `browser_use`
```

--------------------------------------------------------------------------------

````
