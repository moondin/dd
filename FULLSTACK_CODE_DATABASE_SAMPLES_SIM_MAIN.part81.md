---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 81
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 81 of 933)

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

---[FILE: notion.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/notion.mdx

```text
---
title: Notion
description: Manage Notion pages
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="notion"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Notion](https://www.notion.so) is an all-in-one workspace that combines notes, documents, wikis, and project management tools into a single platform. It offers a flexible and customizable environment where users can create, organize, and collaborate on content in various formats.

With Notion, you can:

- **Create versatile content**: Build documents, wikis, databases, kanban boards, calendars, and more
- **Organize information**: Structure content hierarchically with nested pages and powerful databases
- **Collaborate seamlessly**: Share workspaces and pages with team members for real-time collaboration
- **Customize your workspace**: Design your ideal workflow with flexible templates and building blocks
- **Connect information**: Link between pages and databases to create a knowledge network
- **Access anywhere**: Use Notion across web, desktop, and mobile platforms with automatic syncing

In Sim, the Notion integration enables your agents to interact directly with your Notion workspace programmatically. This allows for powerful automation scenarios such as knowledge management, content creation, and information retrieval. Your agents can:

- **Read Notion pages**: Extract content and metadata from any Notion page.
- **Read Notion databases**: Retrieve database structure and information.
- **Write to pages**: Append new content to existing Notion pages.
- **Create new pages**: Generate new Notion pages under a parent page, with custom titles and content.
- **Query databases**: Search and filter database entries using advanced filter and sort criteria.
- **Search workspace**: Search across your entire Notion workspace for pages or databases matching specific queries.
- **Create new databases**: Programmatically create new databases with custom properties and structure.

This integration bridges the gap between your AI workflows and your knowledge base, enabling seamless documentation and information management. By connecting Sim with Notion, you can automate documentation processes, maintain up-to-date information repositories, generate reports, and organize information intelligently—all through your intelligent agents.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate with Notion into the workflow. Can read page, read database, create page, create database, append content, query database, and search workspace.



## Tools

### `notion_read`

Read content from a Notion page

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `pageId` | string | Yes | The ID of the Notion page to read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Page content in markdown format with headers, paragraphs, lists, and todos |
| `metadata` | object | Page metadata including title, URL, and timestamps |

### `notion_read_database`

Read database information and structure from Notion

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | Yes | The ID of the Notion database to read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Database information including title, properties schema, and metadata |
| `metadata` | object | Database metadata including title, ID, URL, timestamps, and properties schema |

### `notion_write`

Append content to a Notion page

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `pageId` | string | Yes | The ID of the Notion page to append content to |
| `content` | string | Yes | The content to append to the page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message confirming content was appended to page |

### `notion_create_page`

Create a new page in Notion

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | Yes | ID of the parent page |
| `title` | string | No | Title of the new page |
| `content` | string | No | Optional content to add to the page upon creation |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message confirming page creation |
| `metadata` | object | Page metadata including title, page ID, URL, and timestamps |

### `notion_query_database`

Query and filter Notion database entries with advanced filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | Yes | The ID of the database to query |
| `filter` | string | No | Filter conditions as JSON \(optional\) |
| `sorts` | string | No | Sort criteria as JSON array \(optional\) |
| `pageSize` | number | No | Number of results to return \(default: 100, max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Formatted list of database entries with their properties |
| `metadata` | object | Query metadata including total results count, pagination info, and raw results array |

### `notion_search`

Search across all pages and databases in Notion workspace

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | No | Search terms \(leave empty to get all pages\) |
| `filterType` | string | No | Filter by object type: page, database, or leave empty for all |
| `pageSize` | number | No | Number of results to return \(default: 100, max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Formatted list of search results including pages and databases |
| `metadata` | object | Search metadata including total results count, pagination info, and raw results array |

### `notion_create_database`

Create a new database in Notion with custom properties

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | Yes | ID of the parent page where the database will be created |
| `title` | string | Yes | Title for the new database |
| `properties` | string | No | Database properties as JSON object \(optional, will create a default "Name" property if empty\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message with database details and properties list |
| `metadata` | object | Database metadata including ID, title, URL, creation time, and properties schema |



## Notes

- Category: `tools`
- Type: `notion`
```

--------------------------------------------------------------------------------

---[FILE: onedrive.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/onedrive.mdx

```text
---
title: OneDrive
description: Create, upload, download, list, and delete files
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="onedrive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[OneDrive](https://onedrive.live.com) is Microsoft’s cloud storage and file synchronization service that allows users to securely store, access, and share files across devices. Integrated deeply into the Microsoft 365 ecosystem, OneDrive supports seamless collaboration, version control, and real-time access to content across teams and organizations.

Learn how to integrate the OneDrive tool in Sim to automatically pull, manage, and organize your cloud files within your workflows. This tutorial walks you through connecting OneDrive, setting up file access, and using stored content to power automation. Ideal for syncing essential documents and media with your agents in real time.

With OneDrive, you can:

- **Store files securely in the cloud**: Upload and access documents, images, and other files from any device
- **Organize your content**: Create structured folders and manage file versions with ease
- **Collaborate in real time**: Share files, edit them simultaneously with others, and track changes
- **Access across devices**: Use OneDrive from desktop, mobile, and web platforms
- **Integrate with Microsoft 365**: Work seamlessly with Word, Excel, PowerPoint, and Teams
- **Control permissions**: Share files and folders with custom access settings and expiration controls

In Sim, the OneDrive integration enables your agents to directly interact with your cloud storage. Agents can upload new files to specific folders, retrieve and read existing files, and list folder contents to dynamically organize and access information. This integration allows your agents to incorporate file operations into intelligent workflows — automating document intake, content analysis, and structured storage management. By connecting Sim with OneDrive, you empower your agents to manage and use cloud documents programmatically, eliminating manual steps and enhancing automation with secure, real-time file access.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate OneDrive into the workflow. Can create text and Excel files, upload files, download files, list files, and delete files or folders.



## Tools

### `onedrive_upload`

Upload a file to OneDrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | Yes | The name of the file to upload |
| `file` | file | No | The file to upload \(binary\) |
| `content` | string | No | The text content to upload \(if no file is provided\) |
| `mimeType` | string | No | The MIME type of the file to create \(e.g., text/plain for .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet for .xlsx\) |
| `folderSelector` | string | No | Select the folder to upload the file to |
| `manualFolderId` | string | No | Manually entered folder ID \(advanced mode\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the file was uploaded successfully |
| `file` | object | The uploaded file object with metadata including id, name, webViewLink, webContentLink, and timestamps |

### `onedrive_create_folder`

Create a new folder in OneDrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `folderName` | string | Yes | Name of the folder to create |
| `folderSelector` | string | No | Select the parent folder to create the folder in |
| `manualFolderId` | string | No | Manually entered parent folder ID \(advanced mode\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the folder was created successfully |
| `file` | object | The created folder object with metadata including id, name, webViewLink, and timestamps |

### `onedrive_download`

Download a file from OneDrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Yes | The ID of the file to download |
| `fileName` | string | No | Optional filename override |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | file | Downloaded file stored in execution files |

### `onedrive_list`

List files and folders in OneDrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | No | Select the folder to list files from |
| `manualFolderId` | string | No | The manually entered folder ID \(advanced mode\) |
| `query` | string | No | A query to filter the files |
| `pageSize` | number | No | The number of files to return |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether files were listed successfully |
| `files` | array | Array of file and folder objects with metadata |
| `nextPageToken` | string | Token for retrieving the next page of results \(optional\) |

### `onedrive_delete`

Delete a file or folder from OneDrive

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | Yes | The ID of the file or folder to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the file was deleted successfully |
| `deleted` | boolean | Confirmation that the file was deleted |
| `fileId` | string | The ID of the deleted file |



## Notes

- Category: `tools`
- Type: `onedrive`
```

--------------------------------------------------------------------------------

---[FILE: openai.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/openai.mdx

```text
---
title: Embeddings
description: Generate Open AI embeddings
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="openai"
  color="#10a37f"
/>

{/* MANUAL-CONTENT-START:intro */}
[OpenAI](https://www.openai.com) is a leading AI research and deployment company that offers a suite of powerful AI models and APIs. OpenAI provides cutting-edge technologies including large language models (like GPT-4), image generation (DALL-E), and embeddings that enable developers to build sophisticated AI-powered applications.

With OpenAI, you can:

- **Generate text**: Create human-like text for various applications using GPT models
- **Create images**: Transform text descriptions into visual content with DALL-E
- **Produce embeddings**: Convert text into numerical vectors for semantic search and analysis
- **Build AI assistants**: Develop conversational agents with specialized knowledge
- **Process and analyze data**: Extract insights and patterns from unstructured text
- **Translate languages**: Convert content between different languages with high accuracy
- **Summarize content**: Condense long-form text while preserving key information

In Sim, the OpenAI integration enables your agents to leverage these powerful AI capabilities programmatically as part of their workflows. This allows for sophisticated automation scenarios that combine natural language understanding, content generation, and semantic analysis. Your agents can generate vector embeddings from text, which are numerical representations that capture semantic meaning, enabling advanced search, classification, and recommendation systems. Additionally, through the DALL-E integration, agents can create images from text descriptions, opening up possibilities for visual content generation. This integration bridges the gap between your workflow automation and state-of-the-art AI capabilities, enabling your agents to understand context, generate relevant content, and make intelligent decisions based on semantic understanding. By connecting Sim with OpenAI, you can create agents that process information more intelligently, generate creative content, and deliver more personalized experiences to users.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Embeddings into the workflow. Can generate embeddings from text.



## Tools

### `openai_embeddings`

Generate embeddings from text using OpenAI

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `input` | string | Yes | Text to generate embeddings for |
| `model` | string | No | Model to use for embeddings |
| `encodingFormat` | string | No | The format to return the embeddings in |
| `apiKey` | string | Yes | OpenAI API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Embeddings generation results |



## Notes

- Category: `tools`
- Type: `openai`
```

--------------------------------------------------------------------------------

---[FILE: outlook.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/outlook.mdx

```text
---
title: Outlook
description: Send, read, draft, forward, and move Outlook email messages
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="outlook"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Outlook](https://outlook.office365.com) is a comprehensive email and calendar platform that helps users manage communications, schedules, and tasks efficiently. As part of Microsoft's productivity suite, Outlook offers robust tools for sending and organizing emails, coordinating meetings, and integrating seamlessly with Microsoft 365 applications — enabling individuals and teams to stay organized and connected across devices.

With Microsoft Outlook, you can:

- **Send and receive emails**: Communicate clearly and professionally with individuals or distribution lists  
- **Manage calendars and events**: Schedule meetings, set reminders, and view availability  
- **Organize your inbox**: Use folders, categories, and rules to keep your email streamlined  
- **Access contacts and tasks**: Keep track of key people and action items in one place  
- **Integrate with Microsoft 365**: Work seamlessly with Word, Excel, Teams, and other Microsoft apps  
- **Access across devices**: Use Outlook on desktop, web, and mobile with real-time sync  
- **Maintain privacy and security**: Leverage enterprise-grade encryption and compliance controls

In Sim, the Microsoft Outlook integration enables your agents to interact directly with email and calendar data programmatically with full email management capabilities. This allows for powerful automation scenarios across your entire email workflow. Your agents can:

- **Send and draft**: Compose professional emails with attachments and save drafts for later
- **Read and forward**: Access inbox messages and forward important communications to team members
- **Organize efficiently**: Mark emails as read or unread, move messages between folders, and copy emails for reference
- **Clean up inbox**: Delete unwanted messages and maintain organized folder structures
- **Trigger workflows**: React to new emails in real-time, enabling responsive automation based on incoming messages

By connecting Sim with Microsoft Outlook, you enable intelligent agents to automate communications, streamline scheduling, maintain visibility into organizational correspondence, and keep inboxes organized — all within your workflow ecosystem. Whether you're managing customer communications, processing invoices, coordinating team updates, or automating follow-ups, the Outlook integration provides enterprise-grade email automation capabilities.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Outlook into the workflow. Can read, draft, send, forward, and move email messages. Can be used in trigger mode to trigger a workflow when a new email is received.



## Tools

### `outlook_send`

Send emails using Outlook

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `to` | string | Yes | Recipient email address |
| `subject` | string | Yes | Email subject |
| `body` | string | Yes | Email body content |
| `contentType` | string | No | Content type for the email body \(text or html\) |
| `replyToMessageId` | string | No | Message ID to reply to \(for threading\) |
| `conversationId` | string | No | Conversation ID for threading |
| `cc` | string | No | CC recipients \(comma-separated\) |
| `bcc` | string | No | BCC recipients \(comma-separated\) |
| `attachments` | file[] | No | Files to attach to the email |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Email send success status |
| `status` | string | Delivery status of the email |
| `timestamp` | string | Timestamp when email was sent |
| `message` | string | Success or error message |

### `outlook_draft`

Draft emails using Outlook

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `to` | string | Yes | Recipient email address |
| `subject` | string | Yes | Email subject |
| `body` | string | Yes | Email body content |
| `contentType` | string | No | Content type for the email body \(text or html\) |
| `cc` | string | No | CC recipients \(comma-separated\) |
| `bcc` | string | No | BCC recipients \(comma-separated\) |
| `attachments` | file[] | No | Files to attach to the email draft |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Email draft creation success status |
| `messageId` | string | Unique identifier for the drafted email |
| `status` | string | Draft status of the email |
| `subject` | string | Subject of the drafted email |
| `timestamp` | string | Timestamp when draft was created |
| `message` | string | Success or error message |

### `outlook_read`

Read emails from Outlook

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `folder` | string | No | Folder ID to read emails from \(default: Inbox\) |
| `maxResults` | number | No | Maximum number of emails to retrieve \(default: 1, max: 10\) |
| `includeAttachments` | boolean | No | Download and include email attachments |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or status message |
| `results` | array | Array of email message objects |
| `attachments` | file[] | All email attachments flattened from all emails |

### `outlook_forward`

Forward an existing Outlook message to specified recipients

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | The ID of the message to forward |
| `to` | string | Yes | Recipient email address\(es\), comma-separated |
| `comment` | string | No | Optional comment to include with the forwarded message |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `results` | object | Delivery result details |

### `outlook_move`

Move emails between Outlook folders

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to move |
| `destinationId` | string | Yes | ID of the destination folder |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Email move success status |
| `message` | string | Success or error message |
| `messageId` | string | ID of the moved message |
| `newFolderId` | string | ID of the destination folder |

### `outlook_mark_read`

Mark an Outlook message as read

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to mark as read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `message` | string | Success or error message |
| `messageId` | string | ID of the message |
| `isRead` | boolean | Read status of the message |

### `outlook_mark_unread`

Mark an Outlook message as unread

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to mark as unread |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `message` | string | Success or error message |
| `messageId` | string | ID of the message |
| `isRead` | boolean | Read status of the message |

### `outlook_delete`

Delete an Outlook message (move to Deleted Items)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `message` | string | Success or error message |
| `messageId` | string | ID of the deleted message |
| `status` | string | Deletion status |

### `outlook_copy`

Copy an Outlook message to another folder

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to copy |
| `destinationId` | string | Yes | ID of the destination folder |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Email copy success status |
| `message` | string | Success or error message |
| `originalMessageId` | string | ID of the original message |
| `copiedMessageId` | string | ID of the copied message |
| `destinationFolderId` | string | ID of the destination folder |



## Notes

- Category: `tools`
- Type: `outlook`
```

--------------------------------------------------------------------------------

---[FILE: parallel_ai.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/parallel_ai.mdx

```text
---
title: Parallel AI
description: Web research with Parallel AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="parallel_ai"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Parallel AI](https://parallel.ai/) is an advanced web search and content extraction platform designed to deliver comprehensive, high-quality results for any query. By leveraging intelligent processing and large-scale data extraction, Parallel AI enables users and agents to access, analyze, and synthesize information from across the web with speed and accuracy.

With Parallel AI, you can:

- **Search the web intelligently**: Retrieve relevant, up-to-date information from a wide range of sources  
- **Extract and summarize content**: Get concise, meaningful excerpts from web pages and documents  
- **Customize search objectives**: Tailor queries to specific needs or questions for targeted results  
- **Process results at scale**: Handle large volumes of search results with advanced processing options  
- **Integrate with workflows**: Use Parallel AI within Sim to automate research, content gathering, and knowledge extraction  
- **Control output granularity**: Specify the number of results and the amount of content per result  
- **Secure API access**: Protect your searches and data with API key authentication

In Sim, the Parallel AI integration empowers your agents to perform web searches and extract content programmatically. This enables powerful automation scenarios such as real-time research, competitive analysis, content monitoring, and knowledge base creation. By connecting Sim with Parallel AI, you unlock the ability for agents to gather, process, and utilize web data as part of your automated workflows.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Parallel AI into the workflow. Can search the web, extract information from URLs, and conduct deep research.



## Tools

### `parallel_search`

Search the web using Parallel AI. Provides comprehensive search results with intelligent processing and content extraction.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `objective` | string | Yes | The search objective or question to answer |
| `search_queries` | string | No | Optional comma-separated list of search queries to execute |
| `processor` | string | No | Processing method: base or pro \(default: base\) |
| `max_results` | number | No | Maximum number of results to return \(default: 5\) |
| `max_chars_per_result` | number | No | Maximum characters per result \(default: 1500\) |
| `apiKey` | string | Yes | Parallel AI API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Search results with excerpts from relevant pages |

### `parallel_extract`

Extract targeted information from specific URLs using Parallel AI. Processes provided URLs to pull relevant content based on your objective.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `urls` | string | Yes | Comma-separated list of URLs to extract information from |
| `objective` | string | Yes | What information to extract from the provided URLs |
| `excerpts` | boolean | Yes | Include relevant excerpts from the content |
| `full_content` | boolean | Yes | Include full page content |
| `apiKey` | string | Yes | Parallel AI API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Extracted information from the provided URLs |

### `parallel_deep_research`

Conduct comprehensive deep research across the web using Parallel AI. Synthesizes information from multiple sources with citations. Can take up to 15 minutes to complete.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `input` | string | Yes | Research query or question \(up to 15,000 characters\) |
| `processor` | string | No | Compute level: base, lite, pro, ultra, ultra2x, ultra4x, ultra8x \(default: base\) |
| `include_domains` | string | No | Comma-separated list of domains to restrict research to \(source policy\) |
| `exclude_domains` | string | No | Comma-separated list of domains to exclude from research \(source policy\) |
| `apiKey` | string | Yes | Parallel AI API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `status` | string | Task status \(completed, failed\) |
| `run_id` | string | Unique ID for this research task |
| `message` | string | Status message |
| `content` | object | Research results \(structured based on output_schema\) |
| `basis` | array | Citations and sources with reasoning and confidence levels |



## Notes

- Category: `tools`
- Type: `parallel_ai`
```

--------------------------------------------------------------------------------

---[FILE: perplexity.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/perplexity.mdx

```text
---
title: Perplexity
description: Use Perplexity AI for chat and search
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="perplexity"
  color="#20808D"
/>

{/* MANUAL-CONTENT-START:intro */}
[Perplexity AI](https://www.perplexity.ai) is an AI-powered search engine and answer engine that combines the capabilities of large language models with real-time web search to provide accurate, up-to-date information and comprehensive answers to complex questions.

With Perplexity AI, you can:

- **Get accurate answers**: Receive comprehensive responses to questions with citations from reliable sources
- **Access real-time information**: Obtain up-to-date information through Perplexity's web search capabilities
- **Explore topics in depth**: Dive deeper into subjects with follow-up questions and related information
- **Verify information**: Check the credibility of answers through provided sources and references
- **Generate content**: Create summaries, analyses, and creative content based on current information
- **Research efficiently**: Streamline research processes with comprehensive answers to complex queries
- **Interact conversationally**: Engage in natural dialogue to refine questions and explore topics

In Sim, the Perplexity integration enables your agents to leverage these powerful AI capabilities programmatically as part of their workflows. This allows for sophisticated automation scenarios that combine natural language understanding, real-time information retrieval, and content generation. Your agents can formulate queries, receive comprehensive answers with citations, and incorporate this information into their decision-making processes or outputs. This integration bridges the gap between your workflow automation and access to current, reliable information, enabling your agents to make more informed decisions and provide more accurate responses. By connecting Sim with Perplexity, you can create agents that stay current with the latest information, provide well-researched answers, and deliver more valuable insights to users - all without requiring manual research or information gathering.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Perplexity into the workflow. Can generate completions using Perplexity AI chat models or perform web searches with advanced filtering.



## Tools

### `perplexity_chat`

Generate completions using Perplexity AI chat models

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | No | System prompt to guide the model behavior |
| `content` | string | Yes | The user message content to send to the model |
| `model` | string | Yes | Model to use for chat completions \(e.g., sonar, mistral\) |
| `max_tokens` | number | No | Maximum number of tokens to generate |
| `temperature` | number | No | Sampling temperature between 0 and 1 |
| `apiKey` | string | Yes | Perplexity API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Generated text content |
| `model` | string | Model used for generation |
| `usage` | object | Token usage information |

### `perplexity_search`

Get ranked search results from Perplexity

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | A search query or array of queries \(max 5 for multi-query search\) |
| `max_results` | number | No | Maximum number of search results to return \(1-20, default: 10\) |
| `search_domain_filter` | array | No | List of domains/URLs to limit search results to \(max 20\) |
| `max_tokens_per_page` | number | No | Maximum number of tokens retrieved from each webpage \(default: 1024\) |
| `country` | string | No | Country code to filter search results \(e.g., US, GB, DE\) |
| `search_recency_filter` | string | No | Filter results by recency: hour, day, week, month, or year |
| `search_after_date` | string | No | Include only content published after this date \(format: MM/DD/YYYY\) |
| `search_before_date` | string | No | Include only content published before this date \(format: MM/DD/YYYY\) |
| `apiKey` | string | Yes | Perplexity API key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Array of search results |



## Notes

- Category: `tools`
- Type: `perplexity`
```

--------------------------------------------------------------------------------

````
