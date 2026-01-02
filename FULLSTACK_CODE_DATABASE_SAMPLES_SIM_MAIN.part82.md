---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 82
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 82 of 933)

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

---[FILE: pinecone.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/pinecone.mdx

```text
---
title: Pinecone
description: Use Pinecone vector database
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pinecone"
  color="#0D1117"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pinecone](https://www.pinecone.io) is a vector database designed for building high-performance vector search applications. It enables efficient storage, management, and similarity search of high-dimensional vector embeddings, making it ideal for AI applications that require semantic search capabilities.

With Pinecone, you can:

- **Store vector embeddings**: Efficiently manage high-dimensional vectors at scale
- **Perform similarity search**: Find the most similar vectors to a query vector in milliseconds
- **Build semantic search**: Create search experiences based on meaning rather than keywords
- **Implement recommendation systems**: Generate personalized recommendations based on content similarity
- **Deploy machine learning models**: Operationalize ML models that rely on vector similarity
- **Scale seamlessly**: Handle billions of vectors with consistent performance
- **Maintain real-time indexes**: Update your vector database in real-time as new data arrives

In Sim, the Pinecone integration enables your agents to leverage vector search capabilities programmatically as part of their workflows. This allows for sophisticated automation scenarios that combine natural language processing with semantic search and retrieval. Your agents can generate embeddings from text, store these vectors in Pinecone indexes, and perform similarity searches to find the most relevant information. This integration bridges the gap between your AI workflows and vector search infrastructure, enabling more intelligent information retrieval based on semantic meaning rather than exact keyword matching. By connecting Sim with Pinecone, you can create agents that understand context, retrieve relevant information from large datasets, and deliver more accurate and personalized responses to users - all without requiring complex infrastructure management or specialized knowledge of vector databases.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Pinecone into the workflow. Can generate embeddings, upsert text, search with text, fetch vectors, and search with vectors.



## Tools

### `pinecone_generate_embeddings`

Generate embeddings from text using Pinecone

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Yes | Model to use for generating embeddings |
| `inputs` | array | Yes | Array of text inputs to generate embeddings for |
| `apiKey` | string | Yes | Pinecone API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | array | Generated embeddings data with values and vector type |
| `model` | string | Model used for generating embeddings |
| `vector_type` | string | Type of vector generated \(dense/sparse\) |
| `usage` | object | Usage statistics for embeddings generation |

### `pinecone_upsert_text`

Insert or update text records in a Pinecone index

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Yes | Full Pinecone index host URL |
| `namespace` | string | Yes | Namespace to upsert records into |
| `records` | array | Yes | Record or array of records to upsert, each containing _id, text, and optional metadata |
| `apiKey` | string | Yes | Pinecone API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `statusText` | string | Status of the upsert operation |
| `upsertedCount` | number | Number of records successfully upserted |

### `pinecone_search_text`

Search for similar text in a Pinecone index

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Yes | Full Pinecone index host URL |
| `namespace` | string | No | Namespace to search in |
| `searchQuery` | string | Yes | Text to search for |
| `topK` | string | No | Number of results to return |
| `fields` | array | No | Fields to return in the results |
| `filter` | object | No | Filter to apply to the search |
| `rerank` | object | No | Reranking parameters |
| `apiKey` | string | Yes | Pinecone API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `matches` | array | Search results with ID, score, and metadata |

### `pinecone_search_vector`

Search for similar vectors in a Pinecone index

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Yes | Full Pinecone index host URL |
| `namespace` | string | No | Namespace to search in |
| `vector` | array | Yes | Vector to search for |
| `topK` | number | No | Number of results to return |
| `filter` | object | No | Filter to apply to the search |
| `includeValues` | boolean | No | Include vector values in response |
| `includeMetadata` | boolean | No | Include metadata in response |
| `apiKey` | string | Yes | Pinecone API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `matches` | array | Vector search results with ID, score, values, and metadata |
| `namespace` | string | Namespace where the search was performed |

### `pinecone_fetch`

Fetch vectors by ID from a Pinecone index

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | Yes | Full Pinecone index host URL |
| `ids` | array | Yes | Array of vector IDs to fetch |
| `namespace` | string | No | Namespace to fetch vectors from |
| `apiKey` | string | Yes | Pinecone API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `matches` | array | Fetched vectors with ID, values, metadata, and score |



## Notes

- Category: `tools`
- Type: `pinecone`
```

--------------------------------------------------------------------------------

---[FILE: pipedrive.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/pipedrive.mdx

```text
---
title: Pipedrive
description: Interact with Pipedrive CRM
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pipedrive"
  color="#2E6936"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pipedrive](https://www.pipedrive.com) is a powerful sales-focused CRM platform designed to help sales teams manage leads, track deals, and optimize their sales pipeline. Built with simplicity and effectiveness in mind, Pipedrive has become a favorite among sales professionals and growing businesses worldwide for its intuitive visual pipeline management and actionable sales insights.

Pipedrive provides a comprehensive suite of tools for managing the entire sales process from lead capture to deal closure. With its robust API and extensive integration capabilities, Pipedrive enables sales teams to automate repetitive tasks, maintain data consistency, and focus on what matters most—closing deals.

Key features of Pipedrive include:

- Visual Sales Pipeline: Intuitive drag-and-drop interface for managing deals through customizable sales stages
- Lead Management: Comprehensive lead inbox for capturing, qualifying, and converting potential opportunities
- Activity Tracking: Sophisticated system for scheduling and tracking calls, meetings, emails, and tasks
- Project Management: Built-in project tracking capabilities for post-sale customer success and delivery
- Email Integration: Native mailbox integration for seamless communication tracking within the CRM

In Sim, the Pipedrive integration allows your AI agents to seamlessly interact with your sales workflow. This creates opportunities for automated lead qualification, deal creation and updates, activity scheduling, and pipeline management as part of your AI-powered sales processes. The integration enables agents to create, retrieve, update, and manage deals, leads, activities, and projects programmatically, facilitating intelligent sales automation and ensuring that critical customer information is properly tracked and acted upon. By connecting Sim with Pipedrive, you can build AI agents that maintain sales pipeline visibility, automate routine CRM tasks, qualify leads intelligently, and ensure no opportunities slip through the cracks—enhancing sales team productivity and driving consistent revenue growth.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Pipedrive into your workflow. Manage deals, contacts, sales pipeline, projects, activities, files, and communications with powerful CRM capabilities.



## Tools

### `pipedrive_get_all_deals`

Retrieve all deals from Pipedrive with optional filters

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `status` | string | No | Only fetch deals with a specific status. Values: open, won, lost. If omitted, all not deleted deals are returned |
| `person_id` | string | No | If supplied, only deals linked to the specified person are returned |
| `org_id` | string | No | If supplied, only deals linked to the specified organization are returned |
| `pipeline_id` | string | No | If supplied, only deals in the specified pipeline are returned |
| `updated_since` | string | No | If set, only deals updated after this time are returned. Format: 2025-01-01T10:20:00Z |
| `limit` | string | No | Number of results to return \(default: 100, max: 500\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deals` | array | Array of deal objects from Pipedrive |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_get_deal`

Retrieve detailed information about a specific deal

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Yes | The ID of the deal to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deal` | object | Deal object with full details |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_create_deal`

Create a new deal in Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Yes | The title of the deal |
| `value` | string | No | The monetary value of the deal |
| `currency` | string | No | Currency code \(e.g., USD, EUR\) |
| `person_id` | string | No | ID of the person this deal is associated with |
| `org_id` | string | No | ID of the organization this deal is associated with |
| `pipeline_id` | string | No | ID of the pipeline this deal should be placed in |
| `stage_id` | string | No | ID of the stage this deal should be placed in |
| `status` | string | No | Status of the deal: open, won, lost |
| `expected_close_date` | string | No | Expected close date in YYYY-MM-DD format |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deal` | object | The created deal object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_update_deal`

Update an existing deal in Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | Yes | The ID of the deal to update |
| `title` | string | No | New title for the deal |
| `value` | string | No | New monetary value for the deal |
| `status` | string | No | New status: open, won, lost |
| `stage_id` | string | No | New stage ID for the deal |
| `expected_close_date` | string | No | New expected close date in YYYY-MM-DD format |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deal` | object | The updated deal object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_get_files`

Retrieve files from Pipedrive with optional filters

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | No | Filter files by deal ID |
| `person_id` | string | No | Filter files by person ID |
| `org_id` | string | No | Filter files by organization ID |
| `limit` | string | No | Number of results to return \(default: 100, max: 500\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `files` | array | Array of file objects from Pipedrive |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_get_mail_messages`

Retrieve mail threads from Pipedrive mailbox

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `folder` | string | No | Filter by folder: inbox, drafts, sent, archive \(default: inbox\) |
| `limit` | string | No | Number of results to return \(default: 50\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `messages` | array | Array of mail thread objects from Pipedrive mailbox |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_get_mail_thread`

Retrieve all messages from a specific mail thread

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `thread_id` | string | Yes | The ID of the mail thread |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `messages` | array | Array of mail message objects from the thread |
| `metadata` | object | Operation metadata including thread ID |
| `success` | boolean | Operation success status |

### `pipedrive_get_pipelines`

Retrieve all pipelines from Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `sort_by` | string | No | Field to sort by: id, update_time, add_time \(default: id\) |
| `sort_direction` | string | No | Sorting direction: asc, desc \(default: asc\) |
| `limit` | string | No | Number of results to return \(default: 100, max: 500\) |
| `cursor` | string | No | For pagination, the marker representing the first item on the next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pipelines` | array | Array of pipeline objects from Pipedrive |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_get_pipeline_deals`

Retrieve all deals in a specific pipeline

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `pipeline_id` | string | Yes | The ID of the pipeline |
| `stage_id` | string | No | Filter by specific stage within the pipeline |
| `status` | string | No | Filter by deal status: open, won, lost |
| `limit` | string | No | Number of results to return \(default: 100, max: 500\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deals` | array | Array of deal objects from the pipeline |
| `metadata` | object | Operation metadata including pipeline ID |
| `success` | boolean | Operation success status |

### `pipedrive_get_projects`

Retrieve all projects or a specific project from Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `project_id` | string | No | Optional: ID of a specific project to retrieve |
| `status` | string | No | Filter by project status: open, completed, deleted \(only for listing all\) |
| `limit` | string | No | Number of results to return \(default: 100, max: 500, only for listing all\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `projects` | array | Array of project objects \(when listing all\) |
| `project` | object | Single project object \(when project_id is provided\) |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_create_project`

Create a new project in Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Yes | The title of the project |
| `description` | string | No | Description of the project |
| `start_date` | string | No | Project start date in YYYY-MM-DD format |
| `end_date` | string | No | Project end date in YYYY-MM-DD format |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `project` | object | The created project object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_get_activities`

Retrieve activities (tasks) from Pipedrive with optional filters

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | No | Filter activities by deal ID |
| `person_id` | string | No | Filter activities by person ID |
| `org_id` | string | No | Filter activities by organization ID |
| `type` | string | No | Filter by activity type \(call, meeting, task, deadline, email, lunch\) |
| `done` | string | No | Filter by completion status: 0 for not done, 1 for done |
| `limit` | string | No | Number of results to return \(default: 100, max: 500\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `activities` | array | Array of activity objects from Pipedrive |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_create_activity`

Create a new activity (task) in Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `subject` | string | Yes | The subject/title of the activity |
| `type` | string | Yes | Activity type: call, meeting, task, deadline, email, lunch |
| `due_date` | string | Yes | Due date in YYYY-MM-DD format |
| `due_time` | string | No | Due time in HH:MM format |
| `duration` | string | No | Duration in HH:MM format |
| `deal_id` | string | No | ID of the deal to associate with |
| `person_id` | string | No | ID of the person to associate with |
| `org_id` | string | No | ID of the organization to associate with |
| `note` | string | No | Notes for the activity |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `activity` | object | The created activity object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_update_activity`

Update an existing activity (task) in Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `activity_id` | string | Yes | The ID of the activity to update |
| `subject` | string | No | New subject/title for the activity |
| `due_date` | string | No | New due date in YYYY-MM-DD format |
| `due_time` | string | No | New due time in HH:MM format |
| `duration` | string | No | New duration in HH:MM format |
| `done` | string | No | Mark as done: 0 for not done, 1 for done |
| `note` | string | No | New notes for the activity |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `activity` | object | The updated activity object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_get_leads`

Retrieve all leads or a specific lead from Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | No | Optional: ID of a specific lead to retrieve |
| `archived` | string | No | Get archived leads instead of active ones |
| `owner_id` | string | No | Filter by owner user ID |
| `person_id` | string | No | Filter by person ID |
| `organization_id` | string | No | Filter by organization ID |
| `limit` | string | No | Number of results to return \(default: 100, max: 500\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `leads` | array | Array of lead objects \(when listing all\) |
| `lead` | object | Single lead object \(when lead_id is provided\) |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_create_lead`

Create a new lead in Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Yes | The name of the lead |
| `person_id` | string | No | ID of the person \(REQUIRED unless organization_id is provided\) |
| `organization_id` | string | No | ID of the organization \(REQUIRED unless person_id is provided\) |
| `owner_id` | string | No | ID of the user who will own the lead |
| `value_amount` | string | No | Potential value amount |
| `value_currency` | string | No | Currency code \(e.g., USD, EUR\) |
| `expected_close_date` | string | No | Expected close date in YYYY-MM-DD format |
| `visible_to` | string | No | Visibility: 1 \(Owner & followers\), 3 \(Entire company\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `lead` | object | The created lead object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_update_lead`

Update an existing lead in Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Yes | The ID of the lead to update |
| `title` | string | No | New name for the lead |
| `person_id` | string | No | New person ID |
| `organization_id` | string | No | New organization ID |
| `owner_id` | string | No | New owner user ID |
| `value_amount` | string | No | New value amount |
| `value_currency` | string | No | New currency code \(e.g., USD, EUR\) |
| `expected_close_date` | string | No | New expected close date in YYYY-MM-DD format |
| `is_archived` | string | No | Archive the lead: true or false |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `lead` | object | The updated lead object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `pipedrive_delete_lead`

Delete a specific lead from Pipedrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | Yes | The ID of the lead to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | object | Deletion confirmation data |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |



## Notes

- Category: `tools`
- Type: `pipedrive`
```

--------------------------------------------------------------------------------

---[FILE: polymarket.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/polymarket.mdx

```text
---
title: Polymarket
description: Access prediction markets data from Polymarket
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="polymarket"
  color="#4C82FB"
/>

{/* MANUAL-CONTENT-START:intro */}
[Polymarket](https://polymarket.com) is a decentralized prediction markets platform where users can trade on the outcome of future events using blockchain technology. Polymarket provides a comprehensive API, enabling developers and agents to access live market data, event listings, price information, and orderbook statistics to power data-driven workflows and AI automations.

With Polymarket’s API and Sim integration, you can enable agents to programmatically retrieve prediction market information, explore open markets and associated events, analyze historical price data, and access orderbooks and market midpoints. This creates new possibilities for research, automated analysis, and developing intelligent agents that react to real-time event probabilities derived from market prices.

Key features of the Polymarket integration include:

- **Market Listing & Filtering:** List all current or historical prediction markets, filter by tag, sort, and paginate through results.
- **Market Detail:** Retrieve details for a single market by market ID or slug, including its outcomes and status.
- **Event Listings:** Access lists of Polymarket events and detailed event information.
- **Orderbook & Price Data:** Analyze the orderbook, get the latest market prices, view the midpoint, or obtain historical price information for any market.
- **Automation Ready:** Build agents or tools that react programmatically to market developments, changing odds, or specific event outcomes.

By using these documented API endpoints, you can seamlessly integrate Polymarket’s rich on-chain prediction market data into your own AI workflows, dashboards, research tools, and trading automations.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Polymarket prediction markets into the workflow. Can get markets, market, events, event, tags, series, orderbook, price, midpoint, price history, last trade price, spread, tick size, positions, trades, and search.



## Tools

### `polymarket_get_markets`

Retrieve a list of prediction markets from Polymarket with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `closed` | string | No | Filter by closed status \(true/false\). Use false for active markets only. |
| `order` | string | No | Sort field \(e.g., volumeNum, liquidityNum, startDate, endDate, createdAt\) |
| `ascending` | string | No | Sort direction \(true for ascending, false for descending\) |
| `tagId` | string | No | Filter by tag ID |
| `limit` | string | No | Number of results per page \(max 50\) |
| `offset` | string | No | Pagination offset \(skip this many results\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `markets` | array | Array of market objects |

### `polymarket_get_market`

Retrieve details of a specific prediction market by ID or slug

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `marketId` | string | No | The market ID. Required if slug is not provided. |
| `slug` | string | No | The market slug \(e.g., "will-trump-win"\). Required if marketId is not provided. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `market` | object | Market object with details |

### `polymarket_get_events`

Retrieve a list of events from Polymarket with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `closed` | string | No | Filter by closed status \(true/false\). Use false for active events only. |
| `order` | string | No | Sort field \(e.g., volume, liquidity, startDate, endDate, createdAt\) |
| `ascending` | string | No | Sort direction \(true for ascending, false for descending\) |
| `tagId` | string | No | Filter by tag ID |
| `limit` | string | No | Number of results per page \(max 50\) |
| `offset` | string | No | Pagination offset \(skip this many results\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `events` | array | Array of event objects |

### `polymarket_get_event`

Retrieve details of a specific event by ID or slug

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `eventId` | string | No | The event ID. Required if slug is not provided. |
| `slug` | string | No | The event slug \(e.g., "2024-presidential-election"\). Required if eventId is not provided. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `event` | object | Event object with details |

### `polymarket_get_tags`

Retrieve available tags for filtering markets from Polymarket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Number of results per page \(max 50\) |
| `offset` | string | No | Pagination offset \(skip this many results\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tags` | array | Array of tag objects with id, label, and slug |

### `polymarket_search`

Search for markets, events, and profiles on Polymarket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Search query term |
| `limit` | string | No | Number of results per page \(max 50\) |
| `offset` | string | No | Pagination offset |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | object | Search results containing markets, events, and profiles arrays |

### `polymarket_get_series`

Retrieve series (related market groups) from Polymarket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Number of results per page \(max 50\) |
| `offset` | string | No | Pagination offset \(skip this many results\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `series` | array | Array of series objects |

### `polymarket_get_series_by_id`

Retrieve a specific series (related market group) by ID from Polymarket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `seriesId` | string | Yes | The series ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `series` | object | Series object with details |

### `polymarket_get_orderbook`

Retrieve the order book summary for a specific token

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Yes | The CLOB token ID \(from market clobTokenIds\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `orderbook` | object | Order book with bids and asks arrays |

### `polymarket_get_price`

Retrieve the market price for a specific token and side

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Yes | The CLOB token ID \(from market clobTokenIds\) |
| `side` | string | Yes | Order side: buy or sell |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `price` | string | Market price |

### `polymarket_get_midpoint`

Retrieve the midpoint price for a specific token

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Yes | The CLOB token ID \(from market clobTokenIds\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `midpoint` | string | Midpoint price |

### `polymarket_get_price_history`

Retrieve historical price data for a specific market token

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Yes | The CLOB token ID \(from market clobTokenIds\) |
| `interval` | string | No | Duration ending at current time \(1m, 1h, 6h, 1d, 1w, max\). Mutually exclusive with startTs/endTs. |
| `fidelity` | number | No | Data resolution in minutes \(e.g., 60 for hourly\) |
| `startTs` | number | No | Start timestamp \(Unix seconds UTC\) |
| `endTs` | number | No | End timestamp \(Unix seconds UTC\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `history` | array | Array of price history entries with timestamp \(t\) and price \(p\) |

### `polymarket_get_last_trade_price`

Retrieve the last trade price for a specific token

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Yes | The CLOB token ID \(from market clobTokenIds\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `price` | string | Last trade price |

### `polymarket_get_spread`

Retrieve the bid-ask spread for a specific token

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Yes | The CLOB token ID \(from market clobTokenIds\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `spread` | object | Bid-ask spread with bid and ask prices |

### `polymarket_get_tick_size`

Retrieve the minimum tick size for a specific token

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | Yes | The CLOB token ID \(from market clobTokenIds\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `tickSize` | string | Minimum tick size |

### `polymarket_get_positions`

Retrieve user positions from Polymarket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `user` | string | Yes | User wallet address |
| `market` | string | No | Optional market ID to filter positions |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `positions` | array | Array of position objects |

### `polymarket_get_trades`

Retrieve trade history from Polymarket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `user` | string | No | User wallet address to filter trades |
| `market` | string | No | Market ID to filter trades |
| `limit` | string | No | Number of results per page \(max 50\) |
| `offset` | string | No | Pagination offset \(skip this many results\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `trades` | array | Array of trade objects |



## Notes

- Category: `tools`
- Type: `polymarket`
```

--------------------------------------------------------------------------------

````
