---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 79
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 79 of 933)

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

---[FILE: mailgun.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/mailgun.mdx

```text
---
title: Mailgun
description: Send emails and manage mailing lists with Mailgun
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mailgun"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mailgun](https://www.mailgun.com) is a powerful email delivery service designed for developers and businesses to send, receive, and track emails effortlessly. Mailgun enables you to leverage robust APIs for reliable transactional and marketing email, flexible mailing list management, and advanced event tracking.

With Mailgun's comprehensive feature set, you can automate key email operations and closely monitor deliverability and recipient engagement. This makes it an ideal solution for workflow automation where communications, notifications, and campaign mails are core parts of your processes.

Key features of Mailgun include:

- **Transactional Email Sending:** Deliver high-volume emails such as account notifications, receipts, alerts, and password resets.
- **Rich Email Content:** Send both plain text and HTML emails, and use tags for categorizing and tracking your messages.
- **Mailing List Management:** Create, update, and manage mailing lists and members to send grouped communications efficiently.
- **Domain Information:** Retrieve details about your sending domains to monitor configuration and health.
- **Event Tracking:** Analyze email deliverability and engagement with detailed event data on sent messages.
- **Message Retrieval:** Access stored messages for compliance, analysis, or troubleshooting needs.

By integrating Mailgun into Sim, your agents are empowered to programmatically send emails, manage email lists, access domain information, and monitor real-time events as part of automated workflows. This allows for intelligent, data-driven engagement with your users directly from your AI-powered processes.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Mailgun into your workflow. Send transactional emails, manage mailing lists and members, view domain information, and track email events. Supports text and HTML emails, tags for tracking, and comprehensive list management.



## Tools

### `mailgun_send_message`

Send an email using Mailgun API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Mailgun API key |
| `domain` | string | Yes | Mailgun domain \(e.g., mg.example.com\) |
| `from` | string | Yes | Sender email address |
| `to` | string | Yes | Recipient email address \(comma-separated for multiple\) |
| `subject` | string | Yes | Email subject |
| `text` | string | No | Plain text body of the email |
| `html` | string | No | HTML body of the email |
| `cc` | string | No | CC email address \(comma-separated for multiple\) |
| `bcc` | string | No | BCC email address \(comma-separated for multiple\) |
| `tags` | string | No | Tags for the email \(comma-separated\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the message was sent successfully |
| `id` | string | Message ID |
| `message` | string | Response message from Mailgun |

### `mailgun_get_message`

Retrieve a stored message by its key

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Mailgun API key |
| `domain` | string | Yes | Mailgun domain |
| `messageKey` | string | Yes | Message storage key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the request was successful |
| `recipients` | string | Message recipients |
| `from` | string | Sender email |
| `subject` | string | Message subject |
| `bodyPlain` | string | Plain text body |
| `strippedText` | string | Stripped text |
| `strippedSignature` | string | Stripped signature |
| `bodyHtml` | string | HTML body |
| `strippedHtml` | string | Stripped HTML |
| `attachmentCount` | number | Number of attachments |
| `timestamp` | number | Message timestamp |
| `messageHeaders` | json | Message headers |
| `contentIdMap` | json | Content ID map |

### `mailgun_list_messages`

List events (logs) for messages sent through Mailgun

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Mailgun API key |
| `domain` | string | Yes | Mailgun domain |
| `event` | string | No | Filter by event type \(accepted, delivered, failed, opened, clicked, etc.\) |
| `limit` | number | No | Maximum number of events to return \(default: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the request was successful |
| `items` | json | Array of event items |
| `paging` | json | Paging information |

### `mailgun_create_mailing_list`

Create a new mailing list

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Mailgun API key |
| `address` | string | Yes | Mailing list address \(e.g., list@example.com\) |
| `name` | string | No | Mailing list name |
| `description` | string | No | Mailing list description |
| `accessLevel` | string | No | Access level: readonly, members, or everyone |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the list was created successfully |
| `message` | string | Response message |
| `list` | json | Created mailing list details |

### `mailgun_get_mailing_list`

Get details of a mailing list

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Mailgun API key |
| `address` | string | Yes | Mailing list address |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the request was successful |
| `list` | json | Mailing list details |

### `mailgun_add_list_member`

Add a member to a mailing list

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Mailgun API key |
| `listAddress` | string | Yes | Mailing list address |
| `address` | string | Yes | Member email address |
| `name` | string | No | Member name |
| `vars` | string | No | JSON string of custom variables |
| `subscribed` | boolean | No | Whether the member is subscribed |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the member was added successfully |
| `message` | string | Response message |
| `member` | json | Added member details |

### `mailgun_list_domains`

List all domains for your Mailgun account

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Mailgun API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the request was successful |
| `totalCount` | number | Total number of domains |
| `items` | json | Array of domain objects |

### `mailgun_get_domain`

Get details of a specific domain

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Mailgun API key |
| `domain` | string | Yes | Domain name |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the request was successful |
| `domain` | json | Domain details |



## Notes

- Category: `tools`
- Type: `mailgun`
```

--------------------------------------------------------------------------------

---[FILE: mem0.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/mem0.mdx

```text
---
title: Mem0
description: Agent memory management
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mem0"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mem0](https://mem0.ai) is a powerful memory management system designed specifically for AI agents. It provides a persistent, searchable memory store that enables agents to remember past interactions, learn from experiences, and maintain context across conversations and workflow executions.

With Mem0, you can:

- **Store agent memories**: Save conversation history, user preferences, and important context
- **Retrieve relevant information**: Use semantic search to find the most relevant past interactions
- **Build context-aware agents**: Enable your agents to reference past conversations and maintain continuity
- **Personalize interactions**: Tailor responses based on user history and preferences
- **Implement long-term memory**: Create agents that learn and adapt over time
- **Scale memory management**: Handle memory needs for multiple users and complex workflows

In Sim, the Mem0 integration enables your agents to maintain persistent memory across workflow executions. This allows for more natural, context-aware interactions where agents can recall past conversations, remember user preferences, and build upon previous interactions. By connecting Sim with Mem0, you can create agents that feel more human-like in their ability to remember and learn from past experiences. The integration supports adding new memories, searching existing memories semantically, and retrieving specific memory records. This memory management capability is essential for building sophisticated agents that can maintain context over time, personalize interactions based on user history, and continuously improve their performance through accumulated knowledge.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Mem0 into the workflow. Can add, search, and retrieve memories.



## Tools

### `mem0_add_memories`

Add memories to Mem0 for persistent storage and retrieval

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | User ID associated with the memory |
| `messages` | json | Yes | Array of message objects with role and content |
| `apiKey` | string | Yes | Your Mem0 API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ids` | array | Array of memory IDs that were created |
| `memories` | array | Array of memory objects that were created |

### `mem0_search_memories`

Search for memories in Mem0 using semantic search

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | User ID to search memories for |
| `query` | string | Yes | Search query to find relevant memories |
| `limit` | number | No | Maximum number of results to return |
| `apiKey` | string | Yes | Your Mem0 API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `searchResults` | array | Array of search results with memory data, each containing id, data, and score |
| `ids` | array | Array of memory IDs found in the search results |

### `mem0_get_memories`

Retrieve memories from Mem0 by ID or filter criteria

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `userId` | string | Yes | User ID to retrieve memories for |
| `memoryId` | string | No | Specific memory ID to retrieve |
| `startDate` | string | No | Start date for filtering by created_at \(format: YYYY-MM-DD\) |
| `endDate` | string | No | End date for filtering by created_at \(format: YYYY-MM-DD\) |
| `limit` | number | No | Maximum number of results to return |
| `apiKey` | string | Yes | Your Mem0 API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `memories` | array | Array of retrieved memory objects |
| `ids` | array | Array of memory IDs that were retrieved |



## Notes

- Category: `tools`
- Type: `mem0`
```

--------------------------------------------------------------------------------

---[FILE: memory.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/memory.mdx

```text
---
title: Memory
description: Add memory store
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="memory"
  color="#F64F9E"
/>

## Usage Instructions

Integrate Memory into the workflow. Can add, get a memory, get all memories, and delete memories.



## Tools

### `memory_add`

Add a new memory to the database or append to existing memory with the same ID.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | No | Conversation identifier \(e.g., user-123, session-abc\). If a memory with this conversationId already exists for this block, the new message will be appended to it. |
| `id` | string | No | Legacy parameter for conversation identifier. Use conversationId instead. Provided for backwards compatibility. |
| `role` | string | Yes | Role for agent memory \(user, assistant, or system\) |
| `content` | string | Yes | Content for agent memory |
| `blockId` | string | No | Optional block ID. If not provided, uses the current block ID from execution context, or defaults to "default". |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the memory was added successfully |
| `memories` | array | Array of memory objects including the new or updated memory |
| `error` | string | Error message if operation failed |

### `memory_get`

Retrieve memory by conversationId, blockId, blockName, or a combination. Returns all matching memories.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | No | Conversation identifier \(e.g., user-123, session-abc\). If provided alone, returns all memories for this conversation across all blocks. |
| `id` | string | No | Legacy parameter for conversation identifier. Use conversationId instead. Provided for backwards compatibility. |
| `blockId` | string | No | Block identifier. If provided alone, returns all memories for this block across all conversations. If provided with conversationId, returns memories for that specific conversation in this block. |
| `blockName` | string | No | Block name. Alternative to blockId. If provided alone, returns all memories for blocks with this name. If provided with conversationId, returns memories for that conversation in blocks with this name. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the memory was retrieved successfully |
| `memories` | array | Array of memory objects with conversationId, blockId, blockName, and data fields |
| `message` | string | Success or error message |
| `error` | string | Error message if operation failed |

### `memory_get_all`

Retrieve all memories from the database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether all memories were retrieved successfully |
| `memories` | array | Array of all memory objects with key, conversationId, blockId, blockName, and data fields |
| `message` | string | Success or error message |
| `error` | string | Error message if operation failed |

### `memory_delete`

Delete memories by conversationId, blockId, blockName, or a combination. Supports bulk deletion.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | No | Conversation identifier \(e.g., user-123, session-abc\). If provided alone, deletes all memories for this conversation across all blocks. |
| `id` | string | No | Legacy parameter for conversation identifier. Use conversationId instead. Provided for backwards compatibility. |
| `blockId` | string | No | Block identifier. If provided alone, deletes all memories for this block across all conversations. If provided with conversationId, deletes memories for that specific conversation in this block. |
| `blockName` | string | No | Block name. Alternative to blockId. If provided alone, deletes all memories for blocks with this name. If provided with conversationId, deletes memories for that conversation in blocks with this name. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the memory was deleted successfully |
| `message` | string | Success or error message |
| `error` | string | Error message if operation failed |



## Notes

- Category: `blocks`
- Type: `memory`
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/en/tools/meta.json

```json
{
  "pages": [
    "index",
    "ahrefs",
    "airtable",
    "apify",
    "apollo",
    "arxiv",
    "asana",
    "browser_use",
    "calendly",
    "clay",
    "confluence",
    "cursor",
    "datadog",
    "discord",
    "dropbox",
    "duckduckgo",
    "dynamodb",
    "elasticsearch",
    "elevenlabs",
    "exa",
    "file",
    "firecrawl",
    "github",
    "gitlab",
    "gmail",
    "google_calendar",
    "google_docs",
    "google_drive",
    "google_forms",
    "google_groups",
    "google_search",
    "google_sheets",
    "google_slides",
    "google_vault",
    "grafana",
    "hubspot",
    "huggingface",
    "hunter",
    "image_generator",
    "incidentio",
    "intercom",
    "jina",
    "jira",
    "kalshi",
    "knowledge",
    "linear",
    "linkedin",
    "linkup",
    "mailchimp",
    "mailgun",
    "mem0",
    "memory",
    "microsoft_excel",
    "microsoft_planner",
    "microsoft_teams",
    "mistral_parse",
    "mongodb",
    "mysql",
    "neo4j",
    "notion",
    "onedrive",
    "openai",
    "outlook",
    "parallel_ai",
    "perplexity",
    "pinecone",
    "pipedrive",
    "polymarket",
    "postgresql",
    "posthog",
    "qdrant",
    "rds",
    "reddit",
    "resend",
    "s3",
    "salesforce",
    "search",
    "sendgrid",
    "sentry",
    "serper",
    "servicenow",
    "sftp",
    "sharepoint",
    "shopify",
    "slack",
    "smtp",
    "spotify",
    "sqs",
    "ssh",
    "stagehand",
    "stripe",
    "stt",
    "supabase",
    "tavily",
    "telegram",
    "thinking",
    "translate",
    "trello",
    "tts",
    "twilio_sms",
    "twilio_voice",
    "typeform",
    "video_generator",
    "vision",
    "wealthbox",
    "webflow",
    "whatsapp",
    "wikipedia",
    "wordpress",
    "x",
    "youtube",
    "zendesk",
    "zep",
    "zoom"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: microsoft_excel.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/microsoft_excel.mdx

```text
---
title: Microsoft Excel
description: Read, write, and update data
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_excel"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-365/excel) is a powerful spreadsheet application that enables data management, analysis, and visualization. Through the Microsoft Excel integration in Sim, you can programmatically read, write, and manipulate spreadsheet data to support your workflow automation needs.

With Microsoft Excel integration, you can:

- **Read Spreadsheet Data**: Access data from specific ranges, sheets, and cells
- **Write and Update Data**: Add new data or modify existing spreadsheet content
- **Manage Tables**: Create and manipulate tabular data structures
- **Handle Multiple Sheets**: Work with multiple worksheets in a workbook
- **Process Data**: Import, export, and transform spreadsheet data

In Sim, the Microsoft Excel integration provides seamless access to spreadsheet functionality through OAuth authentication. You can read data from specific ranges, write new information, update existing cells, and handle various data formats. The integration supports both reading and writing operations with flexible input and output options. This enables you to build workflows that can effectively manage spreadsheet data, whether you're extracting information for analysis, updating records automatically, or maintaining data consistency across your applications.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Microsoft Excel into the workflow. Can read, write, update, add to table, and create new worksheets.



## Tools

### `microsoft_excel_read`

Read data from a Microsoft Excel spreadsheet

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to read from |
| `range` | string | No | The range of cells to read from. Accepts "SheetName!A1:B2" for explicit ranges or just "SheetName" to read the used range of that sheet. If omitted, reads the used range of the first sheet. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | object | Range data from the spreadsheet |

### `microsoft_excel_write`

Write data to a Microsoft Excel spreadsheet

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to write to |
| `range` | string | No | The range of cells to write to |
| `values` | array | Yes | The data to write to the spreadsheet |
| `valueInputOption` | string | No | The format of the data to write |
| `includeValuesInResponse` | boolean | No | Whether to include the written values in the response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `updatedRange` | string | The range that was updated |
| `updatedRows` | number | Number of rows that were updated |
| `updatedColumns` | number | Number of columns that were updated |
| `updatedCells` | number | Number of cells that were updated |
| `metadata` | object | Spreadsheet metadata |

### `microsoft_excel_table_add`

Add new rows to a Microsoft Excel table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet containing the table |
| `tableName` | string | Yes | The name of the table to add rows to |
| `values` | array | Yes | The data to add to the table \(array of arrays or array of objects\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `index` | number | Index of the first row that was added |
| `values` | array | Array of rows that were added to the table |
| `metadata` | object | Spreadsheet metadata |

### `microsoft_excel_worksheet_add`

Create a new worksheet (sheet) in a Microsoft Excel workbook

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | Yes | The ID of the Excel workbook to add the worksheet to |
| `worksheetName` | string | Yes | The name of the new worksheet. Must be unique within the workbook and cannot exceed 31 characters |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `worksheet` | object | Details of the newly created worksheet |



## Notes

- Category: `tools`
- Type: `microsoft_excel`
```

--------------------------------------------------------------------------------

---[FILE: microsoft_planner.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/microsoft_planner.mdx

```text
---
title: Microsoft Planner
description: Manage tasks, plans, and buckets in Microsoft Planner
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_planner"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Planner](https://www.microsoft.com/en-us/microsoft-365/planner) is a task management tool that helps teams organize work visually using boards, tasks, and buckets. Integrated with Microsoft 365, it offers a simple, intuitive way to manage team projects, assign responsibilities, and track progress.

With Microsoft Planner, you can:

- **Create and manage tasks**: Add new tasks with due dates, priorities, and assigned users
- **Organize with buckets**: Group tasks by phase, status, or category to reflect your team’s workflow
- **Visualize project status**: Use boards, charts, and filters to monitor workload and track progress
- **Stay integrated with Microsoft 365**: Seamlessly connect tasks with Teams, Outlook, and other Microsoft tools

In Sim, the Microsoft Planner integration allows your agents to programmatically create, read, and manage tasks as part of their workflows. Agents can generate new tasks based on incoming requests, retrieve task details to drive decisions, and track status across projects — all without human intervention. Whether you're building workflows for client onboarding, internal project tracking, or follow-up task generation, integrating Microsoft Planner with Sim gives your agents a structured way to coordinate work, automate task creation, and keep teams aligned.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Microsoft Planner into the workflow. Manage tasks, plans, buckets, and task details including checklists and references.



## Tools

### `microsoft_planner_read_task`

Read tasks from Microsoft Planner - get all user tasks or all tasks from a specific plan

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | string | No | The ID of the plan to get tasks from \(if not provided, gets all user tasks\) |
| `taskId` | string | No | The ID of the task to get |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether tasks were retrieved successfully |
| `tasks` | array | Array of task objects with filtered properties |
| `metadata` | object | Metadata including planId, userId, and planUrl |

### `microsoft_planner_create_task`

Create a new task in Microsoft Planner

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Yes | The ID of the plan where the task will be created |
| `title` | string | Yes | The title of the task |
| `description` | string | No | The description of the task |
| `dueDateTime` | string | No | The due date and time for the task \(ISO 8601 format\) |
| `assigneeUserId` | string | No | The user ID to assign the task to |
| `bucketId` | string | No | The bucket ID to place the task in |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the task was created successfully |
| `task` | object | The created task object with all properties |
| `metadata` | object | Metadata including planId, taskId, and taskUrl |

### `microsoft_planner_update_task`

Update a task in Microsoft Planner

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Yes | The ID of the task to update |
| `etag` | string | Yes | The ETag value from the task to update \(If-Match header\) |
| `title` | string | No | The new title of the task |
| `bucketId` | string | No | The bucket ID to move the task to |
| `dueDateTime` | string | No | The due date and time for the task \(ISO 8601 format\) |
| `startDateTime` | string | No | The start date and time for the task \(ISO 8601 format\) |
| `percentComplete` | number | No | The percentage of task completion \(0-100\) |
| `priority` | number | No | The priority of the task \(0-10\) |
| `assigneeUserId` | string | No | The user ID to assign the task to |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the task was updated successfully |
| `message` | string | Success message when task is updated |
| `task` | object | The updated task object with all properties |
| `taskId` | string | ID of the updated task |
| `etag` | string | New ETag after update - use this for subsequent operations |
| `metadata` | object | Metadata including taskId, planId, and taskUrl |

### `microsoft_planner_delete_task`

Delete a task from Microsoft Planner

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Yes | The ID of the task to delete |
| `etag` | string | Yes | The ETag value from the task to delete \(If-Match header\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the task was deleted successfully |
| `deleted` | boolean | Confirmation of deletion |
| `metadata` | object | Additional metadata |

### `microsoft_planner_list_plans`

List all plans shared with the current user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether plans were retrieved successfully |
| `plans` | array | Array of plan objects shared with the current user |
| `metadata` | object | Metadata including userId and count |

### `microsoft_planner_read_plan`

Get details of a specific Microsoft Planner plan

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Yes | The ID of the plan to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the plan was retrieved successfully |
| `plan` | object | The plan object with all properties |
| `metadata` | object | Metadata including planId and planUrl |

### `microsoft_planner_list_buckets`

List all buckets in a Microsoft Planner plan

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Yes | The ID of the plan |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether buckets were retrieved successfully |
| `buckets` | array | Array of bucket objects |
| `metadata` | object | Metadata including planId and count |

### `microsoft_planner_read_bucket`

Get details of a specific bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Yes | The ID of the bucket to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the bucket was retrieved successfully |
| `bucket` | object | The bucket object with all properties |
| `metadata` | object | Metadata including bucketId and planId |

### `microsoft_planner_create_bucket`

Create a new bucket in a Microsoft Planner plan

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `planId` | string | Yes | The ID of the plan where the bucket will be created |
| `name` | string | Yes | The name of the bucket |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the bucket was created successfully |
| `bucket` | object | The created bucket object with all properties |
| `metadata` | object | Metadata including bucketId and planId |

### `microsoft_planner_update_bucket`

Update a bucket in Microsoft Planner

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Yes | The ID of the bucket to update |
| `name` | string | No | The new name of the bucket |
| `etag` | string | Yes | The ETag value from the bucket to update \(If-Match header\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the bucket was updated successfully |
| `bucket` | object | The updated bucket object with all properties |
| `metadata` | object | Metadata including bucketId and planId |

### `microsoft_planner_delete_bucket`

Delete a bucket from Microsoft Planner

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | Yes | The ID of the bucket to delete |
| `etag` | string | Yes | The ETag value from the bucket to delete \(If-Match header\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the bucket was deleted successfully |
| `deleted` | boolean | Confirmation of deletion |
| `metadata` | object | Additional metadata |

### `microsoft_planner_get_task_details`

Get detailed information about a task including checklist and references

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Yes | The ID of the task |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the task details were retrieved successfully |
| `taskDetails` | object | The task details including description, checklist, and references |
| `etag` | string | The ETag value for this task details - use this for update operations |
| `metadata` | object | Metadata including taskId |

### `microsoft_planner_update_task_details`

Update task details including description, checklist items, and references in Microsoft Planner

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | Yes | The ID of the task |
| `etag` | string | Yes | The ETag value from the task details to update \(If-Match header\) |
| `description` | string | No | The description of the task |
| `checklist` | object | No | Checklist items as a JSON object |
| `references` | object | No | References as a JSON object |
| `previewType` | string | No | Preview type: automatic, noPreview, checklist, description, or reference |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the task details were updated successfully |
| `taskDetails` | object | The updated task details object with all properties |
| `metadata` | object | Metadata including taskId |



## Notes

- Category: `tools`
- Type: `microsoft_planner`
```

--------------------------------------------------------------------------------

````
