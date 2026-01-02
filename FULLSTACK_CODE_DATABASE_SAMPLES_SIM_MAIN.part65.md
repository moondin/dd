---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 65
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 65 of 933)

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

---[FILE: calendly.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/calendly.mdx

```text
---
title: Calendly
description: Manage Calendly scheduling and events
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="calendly"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Calendly](https://calendly.com/) is a popular scheduling automation platform that helps you book meetings, events, and appointments with ease. With Calendly, teams and individuals can streamline scheduling, reduce back-and-forth emails, and automate tasks around events.

With the Sim Calendly integration, your agents can:

- **Retrieve information about your account and scheduled events**: Use tools to fetch user info, event types, and scheduled events for analysis or automation.
- **Manage event types and scheduling**: Access and list available event types for users or organizations, retrieve details about specific event types, and monitor scheduled meetings and invitee data.
- **Automate follow-ups and workflows**: When users schedule, reschedule, or cancel meetings, Sim agents can automatically trigger corresponding workflows—such as sending reminders, updating CRMs, or notifying participants.
- **Integrate easily using webhooks**: Set up Sim workflows to respond to real-time Calendly webhook events, including when invitees schedule, cancel, or interact with routing forms.

Whether you want to automate meeting prep, manage invites, or run custom workflows in response to scheduling activity, the Calendly tools in Sim give you flexible and secure access. Unlock new automation by reacting instantly to scheduling changes—streamlining your team's operations and communications.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Calendly into your workflow. Manage event types, scheduled events, invitees, and webhooks. Can also trigger workflows based on Calendly webhook events (invitee scheduled, invitee canceled, routing form submitted). Requires Personal Access Token.



## Tools

### `calendly_get_current_user`

Get information about the currently authenticated Calendly user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Calendly Personal Access Token |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `resource` | object | Current user information |

### `calendly_list_event_types`

Retrieve a list of all event types for a user or organization

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Calendly Personal Access Token |
| `user` | string | No | Return only event types that belong to this user \(URI format\) |
| `organization` | string | No | Return only event types that belong to this organization \(URI format\) |
| `count` | number | No | Number of results per page \(default: 20, max: 100\) |
| `pageToken` | string | No | Page token for pagination |
| `sort` | string | No | Sort order for results \(e.g., "name:asc", "name:desc"\) |
| `active` | boolean | No | When true, show only active event types. When false or unchecked, show all event types \(both active and inactive\). |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `collection` | array | Array of event type objects |

### `calendly_get_event_type`

Get detailed information about a specific event type

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Calendly Personal Access Token |
| `eventTypeUuid` | string | Yes | Event type UUID \(can be full URI or just the UUID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `resource` | object | Event type details |

### `calendly_list_scheduled_events`

Retrieve a list of scheduled events for a user or organization

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Calendly Personal Access Token |
| `user` | string | No | Return events that belong to this user \(URI format\). Either "user" or "organization" must be provided. |
| `organization` | string | No | Return events that belong to this organization \(URI format\). Either "user" or "organization" must be provided. |
| `invitee_email` | string | No | Return events where invitee has this email |
| `count` | number | No | Number of results per page \(default: 20, max: 100\) |
| `max_start_time` | string | No | Return events with start time before this time \(ISO 8601 format\) |
| `min_start_time` | string | No | Return events with start time after this time \(ISO 8601 format\) |
| `pageToken` | string | No | Page token for pagination |
| `sort` | string | No | Sort order for results \(e.g., "start_time:asc", "start_time:desc"\) |
| `status` | string | No | Filter by status \("active" or "canceled"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `collection` | array | Array of scheduled event objects |

### `calendly_get_scheduled_event`

Get detailed information about a specific scheduled event

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Calendly Personal Access Token |
| `eventUuid` | string | Yes | Scheduled event UUID \(can be full URI or just the UUID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `resource` | object | Scheduled event details |

### `calendly_list_event_invitees`

Retrieve a list of invitees for a scheduled event

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Calendly Personal Access Token |
| `eventUuid` | string | Yes | Scheduled event UUID \(can be full URI or just the UUID\) |
| `count` | number | No | Number of results per page \(default: 20, max: 100\) |
| `email` | string | No | Filter invitees by email address |
| `pageToken` | string | No | Page token for pagination |
| `sort` | string | No | Sort order for results \(e.g., "created_at:asc", "created_at:desc"\) |
| `status` | string | No | Filter by status \("active" or "canceled"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `collection` | array | Array of invitee objects |

### `calendly_cancel_event`

Cancel a scheduled event

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Calendly Personal Access Token |
| `eventUuid` | string | Yes | Scheduled event UUID to cancel \(can be full URI or just the UUID\) |
| `reason` | string | No | Reason for cancellation \(will be sent to invitees\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `resource` | object | Cancellation details |



## Notes

- Category: `tools`
- Type: `calendly`
```

--------------------------------------------------------------------------------

---[FILE: clay.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/clay.mdx

```text
---
title: Clay
description: Populate Clay workbook
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="clay"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Clay](https://www.clay.com/) is a data enrichment and workflow automation platform that helps teams streamline lead generation, research, and data operations through powerful integrations and flexible inputs.

Learn how to use the Clay Tool in Sim to seamlessly insert data into a Clay workbook through webhook triggers. This tutorial walks you through setting up a webhook, configuring data mapping, and automating real-time updates to your Clay workbooks. Perfect for streamlining lead generation and data enrichment directly from your workflow!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cx_75X5sI_s"
  title="Clay Integration with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

With Clay, you can:

- **Enrich agent outputs**: Automatically feed your Sim agent data into Clay tables for structured tracking and analysis
- **Trigger workflows via webhooks**: Use Clay’s webhook support to initiate Sim agent tasks from within Clay
- **Leverage data loops**: Seamlessly iterate over enriched data rows with agents that operate across dynamic datasets

In Sim, the Clay integration allows your agents to push structured data into Clay tables via webhooks. This makes it easy to collect, enrich, and manage dynamic outputs such as leads, research summaries, or action items—all in a collaborative, spreadsheet-like interface. Your agents can populate rows in real time, enabling asynchronous workflows where AI-generated insights are captured, reviewed, and used by your team. Whether you're automating research, enriching CRM data, or tracking operational outcomes, Clay becomes a living data layer that interacts intelligently with your agents. By connecting Sim with Clay, you gain a powerful way to operationalize agent results, loop over datasets with precision, and maintain a clean, auditable record of AI-driven work.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Clay into the workflow. Can populate a table with data.



## Tools

### `clay_populate`

Populate Clay with data from a JSON file. Enables direct communication and notifications with timestamp tracking and channel confirmation.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `webhookURL` | string | Yes | The webhook URL to populate |
| `data` | json | Yes | The data to populate |
| `authToken` | string | No | Optional auth token for Clay webhook authentication \(most webhooks do not require this\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | json | Response data from Clay webhook |
| `metadata` | object | Webhook response metadata |



## Notes

- Category: `tools`
- Type: `clay`
```

--------------------------------------------------------------------------------

---[FILE: confluence.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/confluence.mdx

```text
---
title: Confluence
description: Interact with Confluence
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="confluence"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Confluence](https://www.atlassian.com/software/confluence) is Atlassian's powerful team collaboration and knowledge management platform. It serves as a centralized workspace where teams can create, organize, and share information across departments and organizations.

With Confluence, you can:

- **Create structured documentation**: Build comprehensive wikis, project plans, and knowledge bases with rich formatting
- **Collaborate in real-time**: Work together on documents with teammates, with comments, mentions, and editing capabilities
- **Organize information hierarchically**: Structure content with spaces, pages, and nested hierarchies for intuitive navigation
- **Integrate with other tools**: Connect with Jira, Trello, and other Atlassian products for seamless workflow integration
- **Control access permissions**: Manage who can view, edit, or comment on specific content

In Sim, the Confluence integration enables your agents to access and leverage your organization's knowledge base. Agents can retrieve information from Confluence pages, search for specific content, and even update documentation when needed. This allows your workflows to incorporate the collective knowledge stored in your Confluence instance, making it possible to build agents that can reference internal documentation, follow established procedures, and maintain up-to-date information resources as part of their operations.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Confluence into the workflow. Can read, create, update, delete pages, manage comments, attachments, labels, and search content.



## Tools

### `confluence_retrieve`

Retrieve content from Confluence pages using the Confluence API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `pageId` | string | Yes | Confluence page ID to retrieve |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of retrieval |
| `pageId` | string | Confluence page ID |
| `content` | string | Page content with HTML tags stripped |
| `title` | string | Page title |

### `confluence_update`

Update a Confluence page using the Confluence API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `pageId` | string | Yes | Confluence page ID to update |
| `title` | string | No | New title for the page |
| `content` | string | No | New content for the page in Confluence storage format |
| `version` | number | No | Version number of the page \(required for preventing conflicts\) |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of update |
| `pageId` | string | Confluence page ID |
| `title` | string | Updated page title |
| `success` | boolean | Update operation success status |

### `confluence_create_page`

Create a new page in a Confluence space.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `spaceId` | string | Yes | Confluence space ID where the page will be created |
| `title` | string | Yes | Title of the new page |
| `content` | string | Yes | Page content in Confluence storage format \(HTML\) |
| `parentId` | string | No | Parent page ID if creating a child page |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of creation |
| `pageId` | string | Created page ID |
| `title` | string | Page title |
| `url` | string | Page URL |

### `confluence_delete_page`

Delete a Confluence page (moves it to trash where it can be restored).

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `pageId` | string | Yes | Confluence page ID to delete |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of deletion |
| `pageId` | string | Deleted page ID |
| `deleted` | boolean | Deletion status |

### `confluence_search`

Search for content across Confluence pages, blog posts, and other content.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `query` | string | Yes | Search query string |
| `limit` | number | No | Maximum number of results to return \(default: 25\) |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of search |
| `results` | array | Search results |

### `confluence_create_comment`

Add a comment to a Confluence page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `pageId` | string | Yes | Confluence page ID to comment on |
| `comment` | string | Yes | Comment text in Confluence storage format |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of creation |
| `commentId` | string | Created comment ID |
| `pageId` | string | Page ID |

### `confluence_list_comments`

List all comments on a Confluence page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `pageId` | string | Yes | Confluence page ID to list comments from |
| `limit` | number | No | Maximum number of comments to return \(default: 25\) |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of retrieval |
| `comments` | array | List of comments |

### `confluence_update_comment`

Update an existing comment on a Confluence page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `commentId` | string | Yes | Confluence comment ID to update |
| `comment` | string | Yes | Updated comment text in Confluence storage format |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of update |
| `commentId` | string | Updated comment ID |
| `updated` | boolean | Update status |

### `confluence_delete_comment`

Delete a comment from a Confluence page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `commentId` | string | Yes | Confluence comment ID to delete |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of deletion |
| `commentId` | string | Deleted comment ID |
| `deleted` | boolean | Deletion status |

### `confluence_upload_attachment`

Upload a file as an attachment to a Confluence page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `pageId` | string | Yes | Confluence page ID to attach the file to |
| `file` | file | Yes | The file to upload as an attachment |
| `fileName` | string | No | Optional custom file name for the attachment |
| `comment` | string | No | Optional comment to add to the attachment |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of upload |
| `attachmentId` | string | Uploaded attachment ID |
| `title` | string | Attachment file name |
| `fileSize` | number | File size in bytes |
| `mediaType` | string | MIME type of the attachment |
| `downloadUrl` | string | Download URL for the attachment |
| `pageId` | string | Page ID the attachment was added to |

### `confluence_list_attachments`

List all attachments on a Confluence page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `pageId` | string | Yes | Confluence page ID to list attachments from |
| `limit` | number | No | Maximum number of attachments to return \(default: 25\) |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of retrieval |
| `attachments` | array | List of attachments |

### `confluence_delete_attachment`

Delete an attachment from a Confluence page (moves to trash).

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `attachmentId` | string | Yes | Confluence attachment ID to delete |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of deletion |
| `attachmentId` | string | Deleted attachment ID |
| `deleted` | boolean | Deletion status |

### `confluence_list_labels`

List all labels on a Confluence page.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `pageId` | string | Yes | Confluence page ID to list labels from |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of retrieval |
| `labels` | array | List of labels |

### `confluence_get_space`

Get details about a specific Confluence space.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `spaceId` | string | Yes | Confluence space ID to retrieve |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of retrieval |
| `spaceId` | string | Space ID |
| `name` | string | Space name |
| `key` | string | Space key |
| `type` | string | Space type |
| `status` | string | Space status |
| `url` | string | Space URL |

### `confluence_list_spaces`

List all Confluence spaces accessible to the user.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Confluence domain \(e.g., yourcompany.atlassian.net\) |
| `limit` | number | No | Maximum number of spaces to return \(default: 25\) |
| `cloudId` | string | No | Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of retrieval |
| `spaces` | array | List of spaces |



## Notes

- Category: `tools`
- Type: `confluence`
```

--------------------------------------------------------------------------------

---[FILE: cursor.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/cursor.mdx

```text
---
title: Cursor
description: Launch and manage Cursor cloud agents to work on GitHub repositories
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="cursor"
  color="#1E1E1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Cursor](https://www.cursor.so/) is an AI IDE and cloud-based platform that lets you launch and manage powerful AI agents able to work directly on your GitHub repositories. Cursor agents can automate development tasks, enhance your team's productivity, and collaborate with you by making code changes, responding to natural language instructions, and maintaining conversation history about their activities.

With Cursor, you can:

- **Launch cloud agents for codebases**: Instantly create new AI agents that work on your repositories in the cloud
- **Delegate coding tasks using natural language**: Guide agents with written instructions, amendments, and clarifications
- **Monitor progress and outputs**: Retrieve agent status, view detailed results, and inspect current or completed tasks
- **Access full conversation history**: Review all prompts and AI responses for transparency and auditability
- **Control and manage agent lifecycle**: List active agents, terminate agents, and manage API-based agent launches and follow-ups

In Sim, the Cursor integration enables your agents and workflows to interact programmatically with Cursor cloud agents. This means you can use Sim to:

- List all cloud agents and browse their current state (`cursor_list_agents`)
- Retrieve up-to-date status and outputs for any agent (`cursor_get_agent`)
- View the full conversation history for any coding agent (`cursor_get_conversation`)
- Add follow-up instructions or new prompts to a running agent
- Manage and terminate agents as needed

This integration helps you combine the flexible intelligence of Sim agents with the powerful development automation capabilities of Cursor, making it possible to scale AI-driven development across your projects.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Interact with Cursor Cloud Agents API to launch AI agents that can work on your GitHub repositories. Supports launching agents, adding follow-up instructions, checking status, viewing conversations, and managing agent lifecycle.



## Tools

### `cursor_list_agents`

List all cloud agents for the authenticated user with optional pagination.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Cursor API key |
| `limit` | number | No | Number of agents to return \(default: 20, max: 100\) |
| `cursor` | string | No | Pagination cursor from previous response |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Human-readable list of agents |
| `metadata` | object | Agent list metadata |

### `cursor_get_agent`

Retrieve the current status and results of a cloud agent.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Cursor API key |
| `agentId` | string | Yes | Unique identifier for the cloud agent \(e.g., bc_abc123\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Human-readable agent details |
| `metadata` | object | Agent metadata |

### `cursor_get_conversation`

Retrieve the conversation history of a cloud agent, including all user prompts and assistant responses.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Cursor API key |
| `agentId` | string | Yes | Unique identifier for the cloud agent \(e.g., bc_abc123\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Human-readable conversation history |
| `metadata` | object | Conversation metadata |

### `cursor_launch_agent`

Start a new cloud agent to work on a GitHub repository with the given instructions.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Cursor API key |
| `repository` | string | Yes | GitHub repository URL \(e.g., https://github.com/your-org/your-repo\) |
| `ref` | string | No | Branch, tag, or commit to work from \(defaults to default branch\) |
| `promptText` | string | Yes | The instruction text for the agent |
| `promptImages` | string | No | JSON array of image objects with base64 data and dimensions |
| `model` | string | No | Model to use \(leave empty for auto-selection\) |
| `branchName` | string | No | Custom branch name for the agent to use |
| `autoCreatePr` | boolean | No | Automatically create a PR when the agent finishes |
| `openAsCursorGithubApp` | boolean | No | Open the PR as the Cursor GitHub App |
| `skipReviewerRequest` | boolean | No | Skip requesting reviewers on the PR |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message with agent details |
| `metadata` | object | Launch result metadata |

### `cursor_add_followup`

Add a follow-up instruction to an existing cloud agent.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Cursor API key |
| `agentId` | string | Yes | Unique identifier for the cloud agent \(e.g., bc_abc123\) |
| `followupPromptText` | string | Yes | The follow-up instruction text for the agent |
| `promptImages` | string | No | JSON array of image objects with base64 data and dimensions \(max 5\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Result metadata |

### `cursor_stop_agent`

Stop a running cloud agent. This pauses the agent without deleting it.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Cursor API key |
| `agentId` | string | Yes | Unique identifier for the cloud agent \(e.g., bc_abc123\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Result metadata |

### `cursor_delete_agent`

Permanently delete a cloud agent. This action cannot be undone.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Cursor API key |
| `agentId` | string | Yes | Unique identifier for the cloud agent \(e.g., bc_abc123\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Result metadata |



## Notes

- Category: `tools`
- Type: `cursor`
```

--------------------------------------------------------------------------------

````
