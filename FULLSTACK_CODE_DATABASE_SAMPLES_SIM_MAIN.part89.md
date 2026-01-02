---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 89
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 89 of 933)

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

---[FILE: slack.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/slack.mdx

```text
---
title: Slack
description: Send, update, delete messages, add reactions in Slack or trigger workflows from Slack events
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="slack"
  color="#611f69"
/>

{/* MANUAL-CONTENT-START:intro */}
[Slack](https://www.slack.com/) is a business communication platform that offers teams a unified place for messaging, tools, and files.

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/J5jz3UaWmE8"
  title="Slack Integration with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

With Slack, you can:

- **Automate agent notifications**: Send real-time updates from your Sim agents to any Slack channel
- **Create webhook endpoints**: Configure Slack bots as webhooks to trigger Sim workflows from Slack activities
- **Enhance agent workflows**: Integrate Slack messaging into your agents to deliver results, alerts, and status updates
- **Create and share Slack canvases**: Programmatically generate collaborative documents (canvases) in Slack channels
- **Read messages from channels**: Retrieve and process recent messages from any Slack channel for monitoring or workflow triggers
- **Manage bot messages**: Update, delete, and add reactions to messages sent by your bot

In Sim, the Slack integration enables your agents to programmatically interact with Slack with full message management capabilities as part of their workflows:

- **Send messages**: Agents can send formatted messages to any Slack channel or user, supporting Slack's mrkdwn syntax for rich formatting
- **Update messages**: Edit previously sent bot messages to correct information or provide status updates
- **Delete messages**: Remove bot messages when they're no longer needed or contain errors
- **Add reactions**: Express sentiment or acknowledgment by adding emoji reactions to any message
- **Create canvases**: Create and share Slack canvases (collaborative documents) directly in channels, enabling richer content sharing and documentation
- **Read messages**: Read recent messages from channels, allowing for monitoring, reporting, or triggering further actions based on channel activity
- **Download files**: Retrieve files shared in Slack channels for processing or archival

This allows for powerful automation scenarios such as sending notifications with dynamic updates, managing conversational flows with editable status messages, acknowledging important messages with reactions, and maintaining clean channels by removing outdated bot messages. Your agents can deliver timely information, update messages as workflows progress, create collaborative documents, or alert team members when attention is needed. This integration bridges the gap between your AI workflows and your team's communication, ensuring everyone stays informed with accurate, up-to-date information. By connecting Sim with Slack, you can create agents that keep your team updated with relevant information at the right time, enhance collaboration by sharing and updating insights automatically, and reduce the need for manual status updates—all while leveraging your existing Slack workspace where your team already communicates.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Slack into the workflow. Can send, update, and delete messages, create canvases, read messages, and add reactions. Requires Bot Token instead of OAuth in advanced mode. Can be used in trigger mode to trigger a workflow when a message is sent to a channel.



## Tools

### `slack_message`

Send messages to Slack channels or direct messages. Supports Slack mrkdwn formatting.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `channel` | string | No | Target Slack channel \(e.g., #general\) |
| `userId` | string | No | Target Slack user ID for direct messages \(e.g., U1234567890\) |
| `text` | string | Yes | Message text to send \(supports Slack mrkdwn formatting\) |
| `thread_ts` | string | No | Thread timestamp to reply to \(creates thread reply\) |
| `files` | file[] | No | Files to attach to the message |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | object | Complete message object with all properties returned by Slack |
| `ts` | string | Message timestamp |
| `channel` | string | Channel ID where message was sent |
| `fileCount` | number | Number of files uploaded \(when files are attached\) |

### `slack_canvas`

Create and share Slack canvases in channels. Canvases are collaborative documents within Slack.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `channel` | string | Yes | Target Slack channel \(e.g., #general\) |
| `title` | string | Yes | Title of the canvas |
| `content` | string | Yes | Canvas content in markdown format |
| `document_content` | object | No | Structured canvas document content |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `canvas_id` | string | ID of the created canvas |
| `channel` | string | Channel where canvas was created |
| `title` | string | Title of the canvas |

### `slack_message_reader`

Read the latest messages from Slack channels. Retrieve conversation history with filtering options.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `channel` | string | No | Slack channel to read messages from \(e.g., #general\) |
| `userId` | string | No | User ID for DM conversation \(e.g., U1234567890\) |
| `limit` | number | No | Number of messages to retrieve \(default: 10, max: 100\) |
| `oldest` | string | No | Start of time range \(timestamp\) |
| `latest` | string | No | End of time range \(timestamp\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `messages` | array | Array of message objects from the channel |

### `slack_list_channels`

List all channels in a Slack workspace. Returns public and private channels the bot has access to.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `includePrivate` | boolean | No | Include private channels the bot is a member of \(default: true\) |
| `excludeArchived` | boolean | No | Exclude archived channels \(default: true\) |
| `limit` | number | No | Maximum number of channels to return \(default: 100, max: 200\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `channels` | array | Array of channel objects from the workspace |

### `slack_list_members`

List all members (user IDs) in a Slack channel. Use with Get User Info to resolve IDs to names.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `channel` | string | Yes | Channel ID to list members from |
| `limit` | number | No | Maximum number of members to return \(default: 100, max: 200\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `members` | array | Array of user IDs who are members of the channel \(e.g., U1234567890\) |

### `slack_list_users`

List all users in a Slack workspace. Returns user profiles with names and avatars.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `includeDeleted` | boolean | No | Include deactivated/deleted users \(default: false\) |
| `limit` | number | No | Maximum number of users to return \(default: 100, max: 200\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | Array of user objects from the workspace |

### `slack_get_user`

Get detailed information about a specific Slack user by their user ID.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `userId` | string | Yes | User ID to look up \(e.g., U1234567890\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `user` | object | Detailed user information |

### `slack_download`

Download a file from Slack

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `fileId` | string | Yes | The ID of the file to download |
| `fileName` | string | No | Optional filename override |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | file | Downloaded file stored in execution files |

### `slack_update_message`

Update a message previously sent by the bot in Slack

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `channel` | string | Yes | Channel ID where the message was posted \(e.g., C1234567890\) |
| `timestamp` | string | Yes | Timestamp of the message to update \(e.g., 1405894322.002768\) |
| `text` | string | Yes | New message text \(supports Slack mrkdwn formatting\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | object | Complete updated message object with all properties returned by Slack |
| `content` | string | Success message |
| `metadata` | object | Updated message metadata |

### `slack_delete_message`

Delete a message previously sent by the bot in Slack

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `channel` | string | Yes | Channel ID where the message was posted \(e.g., C1234567890\) |
| `timestamp` | string | Yes | Timestamp of the message to delete \(e.g., 1405894322.002768\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Deleted message metadata |

### `slack_add_reaction`

Add an emoji reaction to a Slack message

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `authMethod` | string | No | Authentication method: oauth or bot_token |
| `botToken` | string | No | Bot token for Custom Bot |
| `channel` | string | Yes | Channel ID where the message was posted \(e.g., C1234567890\) |
| `timestamp` | string | Yes | Timestamp of the message to react to \(e.g., 1405894322.002768\) |
| `name` | string | Yes | Name of the emoji reaction \(without colons, e.g., thumbsup, heart, eyes\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | Success message |
| `metadata` | object | Reaction metadata |



## Notes

- Category: `tools`
- Type: `slack`
```

--------------------------------------------------------------------------------

---[FILE: smtp.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/smtp.mdx

```text
---
title: SMTP
description: Send emails via any SMTP mail server
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="smtp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SMTP (Simple Mail Transfer Protocol)](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) is the foundational standard for email transmission across the Internet. By connecting to any SMTP-compatible server—such as Gmail, Outlook, or your organization's own mail infrastructure—you can send emails programmatically and automate your outbound communications.

SMTP integration allows you to fully customize email sending through direct server connectivity, supporting both basic and advanced email use cases. With SMTP, you can control every aspect of message delivery, recipient management, and content formatting, making it suitable for transactional notifications, bulk mailings, and any automated workflow requiring robust outbound email delivery.

**Key features available via SMTP integration include:**

- **Universal Email Delivery:** Send emails using any SMTP server by configuring standard server connection parameters.
- **Customizable Sender and Recipients:** Specify sender address, display name, primary recipients, as well as CC and BCC fields.
- **Rich Content Support:** Send plain text or richly formatted HTML emails according to your requirements.
- **Attachments:** Include multiple files as attachments in outgoing emails.
- **Flexible Security:** Connect using TLS, SSL, or standard (unencrypted) protocols as supported by your SMTP provider.
- **Advanced Headers:** Set reply-to headers and other advanced email options to cater for complex mailflows and user interactions.

By integrating SMTP with Sim, agents and workflows can programmatically send emails as part of any automated process—ranging from sending notifications and confirmations, to automating external communications, reporting, and document delivery. This offers a highly flexible, provider-agnostic approach to managing email directly within your AI-driven processes.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Send emails using any SMTP server (Gmail, Outlook, custom servers, etc.). Configure SMTP connection settings and send emails with full control over content, recipients, and attachments.



## Tools

### `smtp_send_mail`

Send emails via SMTP server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `smtpHost` | string | Yes | SMTP server hostname \(e.g., smtp.gmail.com\) |
| `smtpPort` | number | Yes | SMTP server port \(587 for TLS, 465 for SSL\) |
| `smtpUsername` | string | Yes | SMTP authentication username |
| `smtpPassword` | string | Yes | SMTP authentication password |
| `smtpSecure` | string | Yes | Security protocol \(TLS, SSL, or None\) |
| `from` | string | Yes | Sender email address |
| `to` | string | Yes | Recipient email address |
| `subject` | string | Yes | Email subject |
| `body` | string | Yes | Email body content |
| `contentType` | string | No | Content type \(text or html\) |
| `fromName` | string | No | Display name for sender |
| `cc` | string | No | CC recipients \(comma-separated\) |
| `bcc` | string | No | BCC recipients \(comma-separated\) |
| `replyTo` | string | No | Reply-to email address |
| `attachments` | file[] | No | Files to attach to the email |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the email was sent successfully |
| `messageId` | string | Message ID from SMTP server |
| `to` | string | Recipient email address |
| `subject` | string | Email subject |
| `error` | string | Error message if sending failed |



## Notes

- Category: `tools`
- Type: `smtp`
```

--------------------------------------------------------------------------------

````
