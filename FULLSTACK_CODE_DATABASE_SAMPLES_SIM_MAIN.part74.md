---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 74
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 74 of 933)

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

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/index.mdx

```text
---
title: Overview
description: Powerful tools to enhance your agentic workflows
---

import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Video } from '@/components/ui/video';

Tools are powerful components in Sim that allow your workflows to interact with external services, process data, and perform specialized tasks. They extend the capabilities of your agents and workflows by providing access to various APIs and services.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="toolbar.mp4" width={700} height={450} />
</div>

## What is a Tool?

A tool is a specialized component that provides a specific functionality or integration with external services. Tools can be used to search the web, interact with databases, process images, generate text or images, communicate via messaging platforms, and much more.

## Using Tools in Workflows

There are two primary ways to use tools in your Sim workflows:

<Steps>
  <Step>
    <strong>As Standalone Blocks</strong>: Tools can be added as individual
    blocks on the canvas when you need deterministic, direct access to their
    functionality. This gives you precise control over when and how the tool is
    called.
  </Step>
  <Step>
    <strong>As Agent Tools</strong>: Tools can be added to Agent blocks by
    clicking "Add tools" and configuring the required parameters. This allows
    agents to dynamically choose which tools to use based on the context and
    requirements of the task.
  </Step>
</Steps>

## Tool Configuration

Each tool requires specific configuration to function properly. Common configuration elements include:

- **API Keys**: Many tools require authentication through API keys
- **Connection Parameters**: Endpoints, database identifiers, etc.
- **Input Formatting**: How data should be structured for the tool
- **Output Handling**: How to process the results from the tool

## Available Tools

Sim provides a diverse collection of tools for various purposes, including:

- **AI and Language Processing**: OpenAI, ElevenLabs, Translation services
- **Search and Research**: Google Search, Tavily, Exa, Perplexity
- **Document Manipulation**: Google Docs, Google Sheets, Notion, Confluence
- **Media Processing**: Vision, Image Generator
- **Communication**: Slack, WhatsApp, Twilio SMS, Gmail
- **Data Storage**: Pinecone, Supabase, Airtable
- **Development**: GitHub

Each tool has its own dedicated documentation page with detailed instructions on configuration and usage.

## Tool Outputs

Tools typically return structured data that can be processed by subsequent blocks in your workflow. The format of this data varies depending on the tool and operation but generally includes:

- The main content or result
- Metadata about the operation
- Status information

Refer to each tool's specific documentation to understand its exact output format.
```

--------------------------------------------------------------------------------

---[FILE: intercom.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/intercom.mdx

```text
---
title: Intercom
description: Manage contacts, companies, conversations, tickets, and messages in Intercom
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="intercom"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Intercom](https://www.intercom.com/) is a leading customer communications platform that enables you to manage and automate your interactions with contacts, companies, conversations, tickets, and messages—all in one place. The Intercom integration in Sim lets your agents programmatically manage customer relationships, support requests, and conversations directly from your automated workflows.

With the Intercom tools, you can:

- **Contacts Management:** Create, get, update, list, search, and delete contacts—automate your CRM processes and keep your customer records up-to-date.
- **Company Management:** Create new companies, retrieve company details, and list all companies related to your users or business clients.
- **Conversation Handling:** Get, list, reply to, and search through conversations—allowing agents to track ongoing support threads, provide answers, and automate follow-up actions.
- **Ticket Management:** Create and retrieve tickets programmatically, helping you automate customer service, support issue tracking, and workflow escalations.
- **Send Messages:** Trigger messages to users or leads for onboarding, support, or marketing, all from within your workflow automation.

By integrating Intercom tools into Sim, you empower your workflows to communicate directly with your users, automate customer support processes, manage leads, and streamline communications at scale. Whether you need to create new contacts, keep customer data synchronized, manage support tickets, or send personalized engagement messages, the Intercom tools provide a comprehensive way to manage customer interactions as part of your intelligent automations.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Intercom into the workflow. Can create, get, update, list, search, and delete contacts; create, get, and list companies; get, list, reply, and search conversations; create and get tickets; and create messages.



## Tools

### `intercom_create_contact`

Create a new contact in Intercom with email, external_id, or role

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `email` | string | No | The contact's email address |
| `external_id` | string | No | A unique identifier for the contact provided by the client |
| `phone` | string | No | The contact's phone number |
| `name` | string | No | The contact's name |
| `avatar` | string | No | An avatar image URL for the contact |
| `signed_up_at` | number | No | The time the user signed up as a Unix timestamp |
| `last_seen_at` | number | No | The time the user was last seen as a Unix timestamp |
| `owner_id` | string | No | The id of an admin that has been assigned account ownership of the contact |
| `unsubscribed_from_emails` | boolean | No | Whether the contact is unsubscribed from emails |
| `custom_attributes` | string | No | Custom attributes as JSON object \(e.g., \{"attribute_name": "value"\}\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Created contact data |

### `intercom_get_contact`

Get a single contact by ID from Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Yes | Contact ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Contact data |

### `intercom_update_contact`

Update an existing contact in Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Yes | Contact ID to update |
| `email` | string | No | The contact's email address |
| `phone` | string | No | The contact's phone number |
| `name` | string | No | The contact's name |
| `avatar` | string | No | An avatar image URL for the contact |
| `signed_up_at` | number | No | The time the user signed up as a Unix timestamp |
| `last_seen_at` | number | No | The time the user was last seen as a Unix timestamp |
| `owner_id` | string | No | The id of an admin that has been assigned account ownership of the contact |
| `unsubscribed_from_emails` | boolean | No | Whether the contact is unsubscribed from emails |
| `custom_attributes` | string | No | Custom attributes as JSON object \(e.g., \{"attribute_name": "value"\}\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Updated contact data |

### `intercom_list_contacts`

List all contacts from Intercom with pagination support

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | No | Number of results per page \(max: 150\) |
| `starting_after` | string | No | Cursor for pagination - ID to start after |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | List of contacts |

### `intercom_search_contacts`

Search for contacts in Intercom using a query

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Search query \(e.g., \{"field":"email","operator":"=","value":"user@example.com"\}\) |
| `per_page` | number | No | Number of results per page \(max: 150\) |
| `starting_after` | string | No | Cursor for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Search results |

### `intercom_delete_contact`

Delete a contact from Intercom by ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Yes | Contact ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Deletion result |

### `intercom_create_company`

Create or update a company in Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `company_id` | string | Yes | Your unique identifier for the company |
| `name` | string | No | The name of the company |
| `website` | string | No | The company website |
| `plan` | string | No | The company plan name |
| `size` | number | No | The number of employees in the company |
| `industry` | string | No | The industry the company operates in |
| `monthly_spend` | number | No | How much revenue the company generates for your business. Note: This field truncates floats to whole integers \(e.g., 155.98 becomes 155\) |
| `custom_attributes` | string | No | Custom attributes as JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Created or updated company data |

### `intercom_get_company`

Retrieve a single company by ID from Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Yes | Company ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Company data |

### `intercom_list_companies`

List all companies from Intercom with pagination support. Note: This endpoint has a limit of 10,000 companies that can be returned using pagination. For datasets larger than 10,000 companies, use the Scroll API instead.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | No | Number of results per page |
| `page` | number | No | Page number |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | List of companies |

### `intercom_get_conversation`

Retrieve a single conversation by ID from Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Yes | Conversation ID to retrieve |
| `display_as` | string | No | Set to "plaintext" to retrieve messages in plain text |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Conversation data |

### `intercom_list_conversations`

List all conversations from Intercom with pagination support

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | No | Number of results per page \(max: 150\) |
| `starting_after` | string | No | Cursor for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | List of conversations |

### `intercom_reply_conversation`

Reply to a conversation as an admin in Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | Yes | Conversation ID to reply to |
| `message_type` | string | Yes | Message type: "comment" or "note" |
| `body` | string | Yes | The text body of the reply |
| `admin_id` | string | No | The ID of the admin authoring the reply. If not provided, a default admin \(Operator/Fin\) will be used. |
| `attachment_urls` | string | No | Comma-separated list of image URLs \(max 10\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Updated conversation with reply |

### `intercom_search_conversations`

Search for conversations in Intercom using a query

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Search query as JSON object |
| `per_page` | number | No | Number of results per page \(max: 150\) |
| `starting_after` | string | No | Cursor for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Search results |

### `intercom_create_ticket`

Create a new ticket in Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `ticket_type_id` | string | Yes | The ID of the ticket type |
| `contacts` | string | Yes | JSON array of contact identifiers \(e.g., \[\{"id": "contact_id"\}\]\) |
| `ticket_attributes` | string | Yes | JSON object with ticket attributes including _default_title_ and _default_description_ |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Created ticket data |

### `intercom_get_ticket`

Retrieve a single ticket by ID from Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `ticketId` | string | Yes | Ticket ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Ticket data |

### `intercom_create_message`

Create and send a new admin-initiated message in Intercom

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `message_type` | string | Yes | Message type: "inapp" or "email" |
| `subject` | string | No | The subject of the message \(for email type\) |
| `body` | string | Yes | The body of the message |
| `from_type` | string | Yes | Sender type: "admin" |
| `from_id` | string | Yes | The ID of the admin sending the message |
| `to_type` | string | Yes | Recipient type: "contact" |
| `to_id` | string | Yes | The ID of the contact receiving the message |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Created message data |



## Notes

- Category: `tools`
- Type: `intercom`
```

--------------------------------------------------------------------------------

---[FILE: jina.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/jina.mdx

```text
---
title: Jina
description: Search the web or extract content from URLs
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jina"
  color="#333333"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jina AI](https://jina.ai/) is a powerful content extraction tool that seamlessly integrates with Sim to transform web content into clean, readable text. This integration allows developers to easily incorporate web content processing capabilities into their agentic workflows.

Jina AI Reader specializes in extracting the most relevant content from web pages, removing clutter, advertisements, and formatting issues to produce clean, structured text that's optimized for language models and other text processing tasks.

With the Jina AI integration in Sim, you can:

- **Extract clean content** from any web page by simply providing a URL
- **Process complex web layouts** into structured, readable text
- **Maintain important context** while removing unnecessary elements
- **Prepare web content** for further processing in your agent workflows
- **Streamline research tasks** by quickly converting web information into usable data

This integration is particularly valuable for building agents that need to gather and process information from the web, conduct research, or analyze online content as part of their workflow.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Jina AI into the workflow. Search the web and get LLM-friendly results, or extract clean content from specific URLs with advanced parsing options.



## Tools

### `jina_read_url`

Extract and process web content into clean, LLM-friendly text using Jina AI Reader. Supports advanced content parsing, link gathering, and multiple output formats with configurable processing options.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | The URL to read and convert to markdown |
| `useReaderLMv2` | boolean | No | Whether to use ReaderLM-v2 for better quality \(3x token cost\) |
| `gatherLinks` | boolean | No | Whether to gather all links at the end |
| `jsonResponse` | boolean | No | Whether to return response in JSON format |
| `apiKey` | string | Yes | Your Jina AI API key |
| `withImagesummary` | boolean | No | Gather all images from the page with metadata |
| `retainImages` | string | No | Control image inclusion: "none" removes all, "all" keeps all |
| `returnFormat` | string | No | Output format: markdown, html, text, screenshot, or pageshot |
| `withIframe` | boolean | No | Include iframe content in extraction |
| `withShadowDom` | boolean | No | Extract Shadow DOM content |
| `noCache` | boolean | No | Bypass cached content for real-time retrieval |
| `withGeneratedAlt` | boolean | No | Generate alt text for images using VLM |
| `robotsTxt` | string | No | Bot User-Agent for robots.txt checking |
| `dnt` | boolean | No | Do Not Track - prevents caching/tracking |
| `noGfm` | boolean | No | Disable GitHub Flavored Markdown |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | The extracted content from the URL, processed into clean, LLM-friendly text |
| `links` | array | List of links found on the page \(when gatherLinks or withLinksummary is enabled\) |
| `images` | array | List of images found on the page \(when withImagesummary is enabled\) |

### `jina_search`

Search the web and return top 5 results with LLM-friendly content. Each result is automatically processed through Jina Reader API. Supports geographic filtering, site restrictions, and pagination.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `q` | string | Yes | Search query string |
| `apiKey` | string | Yes | Your Jina AI API key |
| `num` | number | No | Maximum number of results per page \(default: 5\) |
| `site` | string | No | Restrict results to specific domain\(s\). Can be comma-separated for multiple sites \(e.g., "jina.ai,github.com"\) |
| `withFavicon` | boolean | No | Include website favicons in results |
| `withImagesummary` | boolean | No | Gather all images from result pages with metadata |
| `withLinksummary` | boolean | No | Gather all links from result pages |
| `retainImages` | string | No | Control image inclusion: "none" removes all, "all" keeps all |
| `noCache` | boolean | No | Bypass cached content for real-time retrieval |
| `withGeneratedAlt` | boolean | No | Generate alt text for images using VLM |
| `respondWith` | string | No | Set to "no-content" to get only metadata without page content |
| `returnFormat` | string | No | Output format: markdown, html, text, screenshot, or pageshot |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Array of search results, each containing title, description, url, and LLM-friendly content |



## Notes

- Category: `tools`
- Type: `jina`
```

--------------------------------------------------------------------------------

````
