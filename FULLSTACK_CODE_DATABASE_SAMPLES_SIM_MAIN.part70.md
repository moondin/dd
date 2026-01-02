---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 70
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 70 of 933)

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

---[FILE: gitlab.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/gitlab.mdx

```text
---
title: GitLab
description: Interact with GitLab projects, issues, merge requests, and pipelines
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gitlab"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[GitLab](https://gitlab.com/) is a comprehensive DevOps platform that allows teams to manage, collaborate on, and automate their software development lifecycle. With GitLab, you can effortlessly handle source code management, CI/CD, reviews, and collaboration in a single application.

With GitLab in Sim, you can:

- **Manage projects and repositories**: List and retrieve your GitLab projects, access details, and organize your repositories
- **Work with issues**: List, create, and comment on issues to track work and collaborate effectively
- **Handle merge requests**: Review, create, and manage merge requests for code changes and peer reviews
- **Automate CI/CD pipelines**: Trigger, monitor, and interact with GitLab pipelines as part of your automation flows
- **Collaborate with comments**: Add comments to issues or merge requests for efficient communication within your team

Using Sim’s GitLab integration, your agents can programmatically interact with your GitLab projects. Automate project management, issue tracking, code reviews, and pipeline operations seamlessly in your workflows, optimizing your software development process and enhancing collaboration across your team.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate GitLab into the workflow. Can manage projects, issues, merge requests, pipelines, and add comments. Supports all core GitLab DevOps operations.



## Tools

### `gitlab_list_projects`

List GitLab projects accessible to the authenticated user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `owned` | boolean | No | Limit to projects owned by the current user |
| `membership` | boolean | No | Limit to projects the current user is a member of |
| `search` | string | No | Search projects by name |
| `visibility` | string | No | Filter by visibility \(public, internal, private\) |
| `orderBy` | string | No | Order by field \(id, name, path, created_at, updated_at, last_activity_at\) |
| `sort` | string | No | Sort direction \(asc, desc\) |
| `perPage` | number | No | Number of results per page \(default 20, max 100\) |
| `page` | number | No | Page number for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `projects` | array | List of GitLab projects |
| `total` | number | Total number of projects |

### `gitlab_get_project`

Get details of a specific GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path \(e.g., "namespace/project"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `project` | object | The GitLab project details |

### `gitlab_list_issues`

List issues in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `state` | string | No | Filter by state \(opened, closed, all\) |
| `labels` | string | No | Comma-separated list of label names |
| `assigneeId` | number | No | Filter by assignee user ID |
| `milestoneTitle` | string | No | Filter by milestone title |
| `search` | string | No | Search issues by title and description |
| `orderBy` | string | No | Order by field \(created_at, updated_at\) |
| `sort` | string | No | Sort direction \(asc, desc\) |
| `perPage` | number | No | Number of results per page \(default 20, max 100\) |
| `page` | number | No | Page number for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `issues` | array | List of GitLab issues |
| `total` | number | Total number of issues |

### `gitlab_get_issue`

Get details of a specific GitLab issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `issueIid` | number | Yes | Issue number within the project \(the # shown in GitLab UI\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `issue` | object | The GitLab issue details |

### `gitlab_create_issue`

Create a new issue in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `title` | string | Yes | Issue title |
| `description` | string | No | Issue description \(Markdown supported\) |
| `labels` | string | No | Comma-separated list of label names |
| `assigneeIds` | array | No | Array of user IDs to assign |
| `milestoneId` | number | No | Milestone ID to assign |
| `dueDate` | string | No | Due date in YYYY-MM-DD format |
| `confidential` | boolean | No | Whether the issue is confidential |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `issue` | object | The created GitLab issue |

### `gitlab_update_issue`

Update an existing issue in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `issueIid` | number | Yes | Issue internal ID \(IID\) |
| `title` | string | No | New issue title |
| `description` | string | No | New issue description \(Markdown supported\) |
| `stateEvent` | string | No | State event \(close or reopen\) |
| `labels` | string | No | Comma-separated list of label names |
| `assigneeIds` | array | No | Array of user IDs to assign |
| `milestoneId` | number | No | Milestone ID to assign |
| `dueDate` | string | No | Due date in YYYY-MM-DD format |
| `confidential` | boolean | No | Whether the issue is confidential |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `issue` | object | The updated GitLab issue |

### `gitlab_delete_issue`

Delete an issue from a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `issueIid` | number | Yes | Issue internal ID \(IID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the issue was deleted successfully |

### `gitlab_create_issue_note`

Add a comment to a GitLab issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `issueIid` | number | Yes | Issue internal ID \(IID\) |
| `body` | string | Yes | Comment body \(Markdown supported\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `note` | object | The created comment |

### `gitlab_list_merge_requests`

List merge requests in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `state` | string | No | Filter by state \(opened, closed, merged, all\) |
| `labels` | string | No | Comma-separated list of label names |
| `sourceBranch` | string | No | Filter by source branch |
| `targetBranch` | string | No | Filter by target branch |
| `orderBy` | string | No | Order by field \(created_at, updated_at\) |
| `sort` | string | No | Sort direction \(asc, desc\) |
| `perPage` | number | No | Number of results per page \(default 20, max 100\) |
| `page` | number | No | Page number for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequests` | array | List of GitLab merge requests |
| `total` | number | Total number of merge requests |

### `gitlab_get_merge_request`

Get details of a specific GitLab merge request

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `mergeRequestIid` | number | Yes | Merge request internal ID \(IID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequest` | object | The GitLab merge request details |

### `gitlab_create_merge_request`

Create a new merge request in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `sourceBranch` | string | Yes | Source branch name |
| `targetBranch` | string | Yes | Target branch name |
| `title` | string | Yes | Merge request title |
| `description` | string | No | Merge request description \(Markdown supported\) |
| `labels` | string | No | Comma-separated list of label names |
| `assigneeIds` | array | No | Array of user IDs to assign |
| `milestoneId` | number | No | Milestone ID to assign |
| `removeSourceBranch` | boolean | No | Delete source branch after merge |
| `squash` | boolean | No | Squash commits on merge |
| `draft` | boolean | No | Mark as draft \(work in progress\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequest` | object | The created GitLab merge request |

### `gitlab_update_merge_request`

Update an existing merge request in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `mergeRequestIid` | number | Yes | Merge request internal ID \(IID\) |
| `title` | string | No | New merge request title |
| `description` | string | No | New merge request description |
| `stateEvent` | string | No | State event \(close or reopen\) |
| `labels` | string | No | Comma-separated list of label names |
| `assigneeIds` | array | No | Array of user IDs to assign |
| `milestoneId` | number | No | Milestone ID to assign |
| `targetBranch` | string | No | New target branch |
| `removeSourceBranch` | boolean | No | Delete source branch after merge |
| `squash` | boolean | No | Squash commits on merge |
| `draft` | boolean | No | Mark as draft \(work in progress\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequest` | object | The updated GitLab merge request |

### `gitlab_merge_merge_request`

Merge a merge request in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `mergeRequestIid` | number | Yes | Merge request internal ID \(IID\) |
| `mergeCommitMessage` | string | No | Custom merge commit message |
| `squashCommitMessage` | string | No | Custom squash commit message |
| `squash` | boolean | No | Squash commits before merging |
| `shouldRemoveSourceBranch` | boolean | No | Delete source branch after merge |
| `mergeWhenPipelineSucceeds` | boolean | No | Merge when pipeline succeeds |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `mergeRequest` | object | The merged GitLab merge request |

### `gitlab_create_merge_request_note`

Add a comment to a GitLab merge request

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `mergeRequestIid` | number | Yes | Merge request internal ID \(IID\) |
| `body` | string | Yes | Comment body \(Markdown supported\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `note` | object | The created comment |

### `gitlab_list_pipelines`

List pipelines in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `ref` | string | No | Filter by ref \(branch or tag\) |
| `status` | string | No | Filter by status \(created, waiting_for_resource, preparing, pending, running, success, failed, canceled, skipped, manual, scheduled\) |
| `orderBy` | string | No | Order by field \(id, status, ref, updated_at, user_id\) |
| `sort` | string | No | Sort direction \(asc, desc\) |
| `perPage` | number | No | Number of results per page \(default 20, max 100\) |
| `page` | number | No | Page number for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pipelines` | array | List of GitLab pipelines |
| `total` | number | Total number of pipelines |

### `gitlab_get_pipeline`

Get details of a specific GitLab pipeline

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `pipelineId` | number | Yes | Pipeline ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pipeline` | object | The GitLab pipeline details |

### `gitlab_create_pipeline`

Trigger a new pipeline in a GitLab project

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `ref` | string | Yes | Branch or tag to run the pipeline on |
| `variables` | array | No | Array of variables for the pipeline \(each with key, value, and optional variable_type\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pipeline` | object | The created GitLab pipeline |

### `gitlab_retry_pipeline`

Retry a failed GitLab pipeline

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `pipelineId` | number | Yes | Pipeline ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pipeline` | object | The retried GitLab pipeline |

### `gitlab_cancel_pipeline`

Cancel a running GitLab pipeline

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Project ID or URL-encoded path |
| `pipelineId` | number | Yes | Pipeline ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pipeline` | object | The cancelled GitLab pipeline |



## Notes

- Category: `tools`
- Type: `gitlab`
```

--------------------------------------------------------------------------------

---[FILE: gmail.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/gmail.mdx

```text
---
title: Gmail
description: Send, read, search, and move Gmail messages or trigger workflows from Gmail events
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="gmail"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Gmail](https://gmail.com) is Google's popular email service that provides a robust platform for sending, receiving, and managing email communications. With over 1.8 billion active users worldwide, Gmail offers a feature-rich experience with powerful search capabilities, organizational tools, and integration options.

With Gmail, you can:

- **Send and receive emails**: Communicate with contacts through a clean, intuitive interface
- **Organize messages**: Use labels, folders, and filters to keep your inbox organized
- **Search efficiently**: Find specific messages quickly with Google's powerful search technology
- **Automate workflows**: Create filters and rules to automatically process incoming emails
- **Access from anywhere**: Use Gmail across devices with synchronized content and settings
- **Integrate with other services**: Connect with Google Calendar, Drive, and other productivity tools

In Sim, the Gmail integration enables your agents to fully manage emails programmatically with comprehensive automation capabilities. This allows for powerful automation scenarios such as sending notifications, processing incoming messages, extracting information from emails, and managing communication workflows at scale. Your agents can:

- **Compose and send**: Create personalized emails with attachments and send to recipients
- **Read and search**: Find specific messages using Gmail's query syntax and extract content
- **Organize intelligently**: Mark messages as read/unread, archive or unarchive emails, and manage labels
- **Clean up inbox**: Delete messages, move emails between labels, and maintain inbox zero
- **Trigger workflows**: Listen for new emails in real-time, enabling responsive workflows that react to incoming messages

This integration bridges the gap between your AI workflows and email communications, enabling seamless interaction with one of the world's most widely used communication platforms. Whether you're automating customer support responses, processing receipts, managing subscriptions, or coordinating team communications, the Gmail integration provides all the tools you need for comprehensive email automation.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Gmail into the workflow. Can send, read, search, and move emails. Can be used in trigger mode to trigger a workflow when a new email is received.



## Tools

### `gmail_send`

Send emails using Gmail

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `to` | string | Yes | Recipient email address |
| `subject` | string | No | Email subject |
| `body` | string | Yes | Email body content |
| `contentType` | string | No | Content type for the email body \(text or html\) |
| `threadId` | string | No | Thread ID to reply to \(for threading\) |
| `replyToMessageId` | string | No | Gmail message ID to reply to - use the "id" field from Gmail Read results \(not the RFC "messageId"\) |
| `cc` | string | No | CC recipients \(comma-separated\) |
| `bcc` | string | No | BCC recipients \(comma-separated\) |
| `attachments` | file[] | No | Files to attach to the email |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |

### `gmail_draft`

Draft emails using Gmail

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `to` | string | Yes | Recipient email address |
| `subject` | string | No | Email subject |
| `body` | string | Yes | Email body content |
| `contentType` | string | No | Content type for the email body \(text or html\) |
| `threadId` | string | No | Thread ID to reply to \(for threading\) |
| `replyToMessageId` | string | No | Gmail message ID to reply to - use the "id" field from Gmail Read results \(not the RFC "messageId"\) |
| `cc` | string | No | CC recipients \(comma-separated\) |
| `bcc` | string | No | BCC recipients \(comma-separated\) |
| `attachments` | file[] | No | Files to attach to the email draft |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Draft metadata |

### `gmail_read`

Read emails from Gmail

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | No | ID of the message to read |
| `folder` | string | No | Folder/label to read emails from |
| `unreadOnly` | boolean | No | Only retrieve unread messages |
| `maxResults` | number | No | Maximum number of messages to retrieve \(default: 1, max: 10\) |
| `includeAttachments` | boolean | No | Download and include email attachments |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Text content of the email |
| `metadata` | json | Metadata of the email |
| `attachments` | file[] | Attachments of the email |

### `gmail_search`

Search emails in Gmail

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Search query for emails |
| `maxResults` | number | No | Maximum number of results to return |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Search results summary |
| `metadata` | object | Search metadata |

### `gmail_move`

Move emails between Gmail labels/folders

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to move |
| `addLabelIds` | string | Yes | Comma-separated label IDs to add \(e.g., INBOX, Label_123\) |
| `removeLabelIds` | string | No | Comma-separated label IDs to remove \(e.g., INBOX, SPAM\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |

### `gmail_mark_read`

Mark a Gmail message as read

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to mark as read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |

### `gmail_mark_unread`

Mark a Gmail message as unread

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to mark as unread |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |

### `gmail_archive`

Archive a Gmail message (remove from inbox)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to archive |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |

### `gmail_unarchive`

Unarchive a Gmail message (move back to inbox)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to unarchive |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |

### `gmail_delete`

Delete a Gmail message (move to trash)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |

### `gmail_add_label`

Add label(s) to a Gmail message

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to add labels to |
| `labelIds` | string | Yes | Comma-separated label IDs to add \(e.g., INBOX, Label_123\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |

### `gmail_remove_label`

Remove label(s) from a Gmail message

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | Yes | ID of the message to remove labels from |
| `labelIds` | string | Yes | Comma-separated label IDs to remove \(e.g., INBOX, Label_123\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Email metadata |



## Notes

- Category: `tools`
- Type: `gmail`
```

--------------------------------------------------------------------------------

---[FILE: google_calendar.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_calendar.mdx

```text
---
title: Google Calendar
description: Manage Google Calendar events
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_calendar"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Calendar](https://calendar.google.com) is Google's powerful calendar and scheduling service that provides a comprehensive platform for managing events, meetings, and appointments. With seamless integration across Google's ecosystem and widespread adoption, Google Calendar offers robust features for both personal and professional scheduling needs.

With Google Calendar, you can:

- **Create and manage events**: Schedule meetings, appointments, and reminders with detailed information
- **Send calendar invites**: Automatically notify and coordinate with attendees through email invitations
- **Natural language event creation**: Quickly add events using conversational language like "Meeting with John tomorrow at 3pm"
- **View and search events**: Easily find and access your scheduled events across multiple calendars
- **Manage multiple calendars**: Organize different types of events across various calendars

In Sim, the Google Calendar integration enables your agents to programmatically create, read, and manage calendar events. This allows for powerful automation scenarios such as scheduling meetings, sending calendar invites, checking availability, and managing event details. Your agents can create events with natural language input, send automated calendar invitations to attendees, retrieve event information, and list upcoming events. This integration bridges the gap between your AI workflows and calendar management, enabling seamless scheduling automation and coordination with one of the world's most widely used calendar platforms.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Google Calendar into the workflow. Can create, read, update, and list calendar events.



## Tools

### `google_calendar_create`

Create a new event in Google Calendar

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | Calendar ID \(defaults to primary\) |
| `summary` | string | Yes | Event title/summary |
| `description` | string | No | Event description |
| `location` | string | No | Event location |
| `startDateTime` | string | Yes | Start date and time. MUST include timezone offset \(e.g., 2025-06-03T10:00:00-08:00\) OR provide timeZone parameter |
| `endDateTime` | string | Yes | End date and time. MUST include timezone offset \(e.g., 2025-06-03T11:00:00-08:00\) OR provide timeZone parameter |
| `timeZone` | string | No | Time zone \(e.g., America/Los_Angeles\). Required if datetime does not include offset. Defaults to America/Los_Angeles if not provided. |
| `attendees` | array | No | Array of attendee email addresses |
| `sendUpdates` | string | No | How to send updates to attendees: all, externalOnly, or none |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Event creation confirmation message |
| `metadata` | json | Created event metadata including ID, status, and details |

### `google_calendar_list`

List events from Google Calendar

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | Calendar ID \(defaults to primary\) |
| `timeMin` | string | No | Lower bound for events \(RFC3339 timestamp, e.g., 2025-06-03T00:00:00Z\) |
| `timeMax` | string | No | Upper bound for events \(RFC3339 timestamp, e.g., 2025-06-04T00:00:00Z\) |
| `orderBy` | string | No | Order of events returned \(startTime or updated\) |
| `showDeleted` | boolean | No | Include deleted events |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Summary of found events count |
| `metadata` | json | List of events with pagination tokens and event details |

### `google_calendar_get`

Get a specific event from Google Calendar

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | Calendar ID \(defaults to primary\) |
| `eventId` | string | Yes | Event ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Event retrieval confirmation message |
| `metadata` | json | Event details including ID, status, times, and attendees |

### `google_calendar_quick_add`

Create events from natural language text

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | Calendar ID \(defaults to primary\) |
| `text` | string | Yes | Natural language text describing the event \(e.g., "Meeting with John tomorrow at 3pm"\) |
| `attendees` | array | No | Array of attendee email addresses \(comma-separated string also accepted\) |
| `sendUpdates` | string | No | How to send updates to attendees: all, externalOnly, or none |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Event creation confirmation message from natural language |
| `metadata` | json | Created event metadata including parsed details |

### `google_calendar_invite`

Invite attendees to an existing Google Calendar event

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `calendarId` | string | No | Calendar ID \(defaults to primary\) |
| `eventId` | string | Yes | Event ID to invite attendees to |
| `attendees` | array | Yes | Array of attendee email addresses to invite |
| `sendUpdates` | string | No | How to send updates to attendees: all, externalOnly, or none |
| `replaceExisting` | boolean | No | Whether to replace existing attendees or add to them \(defaults to false\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Attendee invitation confirmation message with email delivery status |
| `metadata` | json | Updated event metadata including attendee list and details |



## Notes

- Category: `tools`
- Type: `google_calendar`
```

--------------------------------------------------------------------------------

---[FILE: google_docs.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/google_docs.mdx

```text
---
title: Google Docs
description: Read, write, and create documents
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_docs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google Docs](https://docs.google.com) is a powerful cloud-based document creation and editing service that allows users to create, edit, and collaborate on documents in real-time. As part of Google's productivity suite, Google Docs offers a versatile platform for text documents with robust formatting, commenting, and sharing capabilities.

Learn how to integrate the Google Docs "Read" tool in Sim to effortlessly fetch data from your docs and to integrate into your workflows. This tutorial walks you through connecting Google Docs, setting up data reads, and using that information to automate processes in real-time. Perfect for syncing live data with your agents.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/f41gy9rBHhE"
  title="Use the Google Docs Read tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Learn how to integrate the Google Docs "Update" tool in Sim to effortlessly add content in your docs through your workflows. This tutorial walks you through connecting Google Docs, configuring data writes, and using that information to automate document updates seamlessly. Perfect for maintaining dynamic, real-time documentation with minimal effort.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/L64ROHS2ivA"
  title="Use the Google Docs Update tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Learn how to integrate the Google Docs "Create" tool in Sim to effortlessly generate new documents through your workflows. This tutorial walks you through connecting Google Docs, setting up document creation, and using workflow data to populate content automatically. Perfect for streamlining document generation and enhancing productivity.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/lWpHH4qddWk"
  title="Use the Google Docs Create tool in Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

With Google Docs, you can:

- **Create and edit documents**: Develop text documents with comprehensive formatting options
- **Collaborate in real-time**: Work simultaneously with multiple users on the same document
- **Track changes**: View revision history and restore previous versions
- **Comment and suggest**: Provide feedback and propose edits without changing the original content
- **Access anywhere**: Use Google Docs across devices with automatic cloud synchronization
- **Work offline**: Continue working without internet connection with changes syncing when back online
- **Integrate with other services**: Connect with Google Drive, Sheets, Slides, and third-party applications

In Sim, the Google Docs integration enables your agents to interact directly with document content programmatically. This allows for powerful automation scenarios such as document creation, content extraction, collaborative editing, and document management. Your agents can read existing documents to extract information, write to documents to update content, and create new documents from scratch. This integration bridges the gap between your AI workflows and document management, enabling seamless interaction with one of the world's most widely used document platforms. By connecting Sim with Google Docs, you can automate document workflows, generate reports, extract insights from documents, and maintain documentation - all through your intelligent agents.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Google Docs into the workflow. Can read, write, and create documents.



## Tools

### `google_docs_read`

Read content from a Google Docs document

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | Yes | The ID of the document to read |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Extracted document text content |
| `metadata` | json | Document metadata including ID, title, and URL |

### `google_docs_write`

Write or update content in a Google Docs document

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `documentId` | string | Yes | The ID of the document to write to |
| `content` | string | Yes | The content to write to the document |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | Indicates if document content was updated successfully |
| `metadata` | json | Updated document metadata including ID, title, and URL |

### `google_docs_create`

Create a new Google Docs document

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Yes | The title of the document to create |
| `content` | string | No | The content of the document to create |
| `folderSelector` | string | No | Select the folder to create the document in |
| `folderId` | string | No | The ID of the folder to create the document in \(internal use\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `metadata` | json | Created document metadata including ID, title, and URL |



## Notes

- Category: `tools`
- Type: `google_docs`
```

--------------------------------------------------------------------------------

````
