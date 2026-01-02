---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 80
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 80 of 933)

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

---[FILE: microsoft_teams.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/microsoft_teams.mdx

```text
---
title: Microsoft Teams
description: Manage messages, reactions, and members in Teams
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_teams"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://teams.microsoft.com) is a robust communication and collaboration platform that enables users to engage in real-time messaging, meetings, and content sharing within teams and organizations. As part of Microsoft's productivity ecosystem, Microsoft Teams offers seamless chat functionality integrated with Office 365, allowing users to post messages, coordinate work, and stay connected across devices and workflows.

With Microsoft Teams, you can:

- **Send and receive messages**: Communicate instantly with individuals or groups in chat threads  
- **Collaborate in real-time**: Share updates and information across teams within channels and chats  
- **Organize conversations**: Maintain context with threaded discussions and persistent chat history  
- **Share files and content**: Attach and view documents, images, and links directly in chat  
- **Integrate with Microsoft 365**: Seamlessly connect with Outlook, SharePoint, OneDrive, and more  
- **Access across devices**: Use Teams on desktop, web, and mobile with cloud-synced conversations  
- **Secure communication**: Leverage enterprise-grade security and compliance features

In Sim, the Microsoft Teams integration enables your agents to interact directly with chat messages programmatically. This allows for powerful automation scenarios such as sending updates, posting alerts, coordinating tasks, and responding to conversations in real time. Your agents can write new messages to chats or channels, update content based on workflow data, and engage with users where collaboration happens. By integrating Sim with Microsoft Teams, you bridge the gap between intelligent workflows and team communication — empowering your agents to streamline collaboration, automate communication tasks, and keep your teams aligned.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Microsoft Teams into the workflow. Read, write, update, and delete chat and channel messages. Reply to messages, add reactions, and list team/channel members. Can be used in trigger mode to trigger a workflow when a message is sent to a chat or channel. To mention users in messages, wrap their name in `<at>` tags: `<at>userName</at>`



## Tools

### `microsoft_teams_read_chat`

Read content from a Microsoft Teams chat

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Yes | The ID of the chat to read from |
| `includeAttachments` | boolean | No | Download and include message attachments \(hosted contents\) into storage |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Teams chat read operation success status |
| `messageCount` | number | Number of messages retrieved from chat |
| `chatId` | string | ID of the chat that was read from |
| `messages` | array | Array of chat message objects |
| `attachmentCount` | number | Total number of attachments found |
| `attachmentTypes` | array | Types of attachments found |
| `content` | string | Formatted content of chat messages |
| `attachments` | file[] | Uploaded attachments for convenience \(flattened\) |

### `microsoft_teams_write_chat`

Write or update content in a Microsoft Teams chat

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Yes | The ID of the chat to write to |
| `content` | string | Yes | The content to write to the message |
| `files` | file[] | No | Files to attach to the message |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Teams chat message send success status |
| `messageId` | string | Unique identifier for the sent message |
| `chatId` | string | ID of the chat where message was sent |
| `createdTime` | string | Timestamp when message was created |
| `url` | string | Web URL to the message |
| `updatedContent` | boolean | Whether content was successfully updated |

### `microsoft_teams_read_channel`

Read content from a Microsoft Teams channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Yes | The ID of the team to read from |
| `channelId` | string | Yes | The ID of the channel to read from |
| `includeAttachments` | boolean | No | Download and include message attachments \(hosted contents\) into storage |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Teams channel read operation success status |
| `messageCount` | number | Number of messages retrieved from channel |
| `teamId` | string | ID of the team that was read from |
| `channelId` | string | ID of the channel that was read from |
| `messages` | array | Array of channel message objects |
| `attachmentCount` | number | Total number of attachments found |
| `attachmentTypes` | array | Types of attachments found |
| `content` | string | Formatted content of channel messages |
| `attachments` | file[] | Uploaded attachments for convenience \(flattened\) |

### `microsoft_teams_write_channel`

Write or send a message to a Microsoft Teams channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Yes | The ID of the team to write to |
| `channelId` | string | Yes | The ID of the channel to write to |
| `content` | string | Yes | The content to write to the channel |
| `files` | file[] | No | Files to attach to the message |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Teams channel message send success status |
| `messageId` | string | Unique identifier for the sent message |
| `teamId` | string | ID of the team where message was sent |
| `channelId` | string | ID of the channel where message was sent |
| `createdTime` | string | Timestamp when message was created |
| `url` | string | Web URL to the message |
| `updatedContent` | boolean | Whether content was successfully updated |

### `microsoft_teams_update_chat_message`

Update an existing message in a Microsoft Teams chat

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Yes | The ID of the chat containing the message |
| `messageId` | string | Yes | The ID of the message to update |
| `content` | string | Yes | The new content for the message |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the update was successful |
| `messageId` | string | ID of the updated message |
| `updatedContent` | boolean | Whether content was successfully updated |

### `microsoft_teams_update_channel_message`

Update an existing message in a Microsoft Teams channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Yes | The ID of the team |
| `channelId` | string | Yes | The ID of the channel containing the message |
| `messageId` | string | Yes | The ID of the message to update |
| `content` | string | Yes | The new content for the message |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the update was successful |
| `messageId` | string | ID of the updated message |
| `updatedContent` | boolean | Whether content was successfully updated |

### `microsoft_teams_delete_chat_message`

Soft delete a message in a Microsoft Teams chat

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | Yes | The ID of the chat containing the message |
| `messageId` | string | Yes | The ID of the message to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the deletion was successful |
| `deleted` | boolean | Confirmation of deletion |
| `messageId` | string | ID of the deleted message |

### `microsoft_teams_delete_channel_message`

Soft delete a message in a Microsoft Teams channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Yes | The ID of the team |
| `channelId` | string | Yes | The ID of the channel containing the message |
| `messageId` | string | Yes | The ID of the message to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the deletion was successful |
| `deleted` | boolean | Confirmation of deletion |
| `messageId` | string | ID of the deleted message |

### `microsoft_teams_reply_to_message`

Reply to an existing message in a Microsoft Teams channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Yes | The ID of the team |
| `channelId` | string | Yes | The ID of the channel |
| `messageId` | string | Yes | The ID of the message to reply to |
| `content` | string | Yes | The reply content |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the reply was successful |
| `messageId` | string | ID of the reply message |
| `updatedContent` | boolean | Whether content was successfully sent |

### `microsoft_teams_get_message`

Get a specific message from a Microsoft Teams chat or channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | No | The ID of the team \(for channel messages\) |
| `channelId` | string | No | The ID of the channel \(for channel messages\) |
| `chatId` | string | No | The ID of the chat \(for chat messages\) |
| `messageId` | string | Yes | The ID of the message to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the retrieval was successful |
| `content` | string | The message content |
| `metadata` | object | Message metadata including sender, timestamp, etc. |

### `microsoft_teams_set_reaction`

Add an emoji reaction to a message in Microsoft Teams

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | No | The ID of the team \(for channel messages\) |
| `channelId` | string | No | The ID of the channel \(for channel messages\) |
| `chatId` | string | No | The ID of the chat \(for chat messages\) |
| `messageId` | string | Yes | The ID of the message to react to |
| `reactionType` | string | Yes | The emoji reaction \(e.g., ❤️, 👍, 😊\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the reaction was added successfully |
| `reactionType` | string | The emoji that was added |
| `messageId` | string | ID of the message |

### `microsoft_teams_unset_reaction`

Remove an emoji reaction from a message in Microsoft Teams

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | No | The ID of the team \(for channel messages\) |
| `channelId` | string | No | The ID of the channel \(for channel messages\) |
| `chatId` | string | No | The ID of the chat \(for chat messages\) |
| `messageId` | string | Yes | The ID of the message |
| `reactionType` | string | Yes | The emoji reaction to remove \(e.g., ❤️, 👍, 😊\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the reaction was removed successfully |
| `reactionType` | string | The emoji that was removed |
| `messageId` | string | ID of the message |

### `microsoft_teams_list_team_members`

List all members of a Microsoft Teams team

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Yes | The ID of the team |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the listing was successful |
| `members` | array | Array of team members |
| `memberCount` | number | Total number of members |

### `microsoft_teams_list_channel_members`

List all members of a Microsoft Teams channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | Yes | The ID of the team |
| `channelId` | string | Yes | The ID of the channel |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the listing was successful |
| `members` | array | Array of channel members |
| `memberCount` | number | Total number of members |



## Notes

- Category: `tools`
- Type: `microsoft_teams`
```

--------------------------------------------------------------------------------

---[FILE: mistral_parse.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/mistral_parse.mdx

```text
---
title: Mistral Parser
description: Extract text from PDF documents
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mistral_parse"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
The Mistral Parse tool provides a powerful way to extract and process content from PDF documents using [Mistral's OCR API](https://mistral.ai/). This tool leverages advanced optical character recognition to accurately extract text and structure from PDF files, making it easy to incorporate document data into your agent workflows.

With the Mistral Parse tool, you can:

- **Extract text from PDFs**: Accurately convert PDF content to text, markdown, or JSON formats
- **Process PDFs from URLs**: Directly extract content from PDFs hosted online by providing their URLs
- **Maintain document structure**: Preserve formatting, tables, and layout from the original PDFs
- **Extract images**: Optionally include embedded images from the PDFs
- **Select specific pages**: Process only the pages you need from multi-page documents

The Mistral Parse tool is particularly useful for scenarios where your agents need to work with PDF content, such as analyzing reports, extracting data from forms, or processing text from scanned documents. It simplifies the process of making PDF content available to your agents, allowing them to work with information stored in PDFs just as easily as with direct text input.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Mistral Parse into the workflow. Can extract text from uploaded PDF documents, or from a URL.



## Tools

### `mistral_parser`

Parse PDF documents using Mistral OCR API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `filePath` | string | Yes | URL to a PDF document to be processed |
| `fileUpload` | object | No | File upload data from file-upload component |
| `resultType` | string | No | Type of parsed result \(markdown, text, or json\). Defaults to markdown. |
| `includeImageBase64` | boolean | No | Include base64-encoded images in the response |
| `pages` | array | No | Specific pages to process \(array of page numbers, starting from 0\) |
| `imageLimit` | number | No | Maximum number of images to extract from the PDF |
| `imageMinSize` | number | No | Minimum height and width of images to extract from the PDF |
| `apiKey` | string | Yes | Mistral API key \(MISTRAL_API_KEY\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the PDF was parsed successfully |
| `content` | string | Extracted content in the requested format \(markdown, text, or JSON\) |
| `metadata` | object | Processing metadata including jobId, fileType, pageCount, and usage info |



## Notes

- Category: `tools`
- Type: `mistral_parse`
```

--------------------------------------------------------------------------------

---[FILE: mongodb.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/mongodb.mdx

```text
---
title: MongoDB
description: Connect to MongoDB database
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mongodb"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
The [MongoDB](https://www.mongodb.com/) tool enables you to connect to a MongoDB database and perform a wide range of document-oriented operations directly within your agentic workflows. With flexible configuration and secure connection management, you can easily interact with and manipulate your data.

With the MongoDB tool, you can:

- **Find documents**: Query collections and retrieve documents with the `mongodb_query` operation using rich query filters.
- **Insert documents**: Add one or multiple documents to a collection using the `mongodb_insert` operation.
- **Update documents**: Modify existing documents with the `mongodb_update` operation by specifying filter criteria and the update actions.
- **Delete documents**: Remove documents from a collection using the `mongodb_delete` operation, specifying filters and deletion options.
- **Aggregate data**: Run complex aggregation pipelines with the `mongodb_execute` operation to transform and analyze your data.

The MongoDB tool is ideal for workflows where your agents need to manage or analyze structured, document-based data. Whether it's processing user-generated content, managing app data, or powering analytics, the MongoDB tool streamlines your data access and manipulation in a secure, programmatic way.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate MongoDB into the workflow. Can find, insert, update, delete, and aggregate data.



## Tools

### `mongodb_query`

Execute find operation on MongoDB collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MongoDB server hostname or IP address |
| `port` | number | Yes | MongoDB server port \(default: 27017\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | No | MongoDB username |
| `password` | string | No | MongoDB password |
| `authSource` | string | No | Authentication database |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `collection` | string | Yes | Collection name to query |
| `query` | string | No | MongoDB query filter as JSON string |
| `limit` | number | No | Maximum number of documents to return |
| `sort` | string | No | Sort criteria as JSON string |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `documents` | array | Array of documents returned from the query |
| `documentCount` | number | Number of documents returned |

### `mongodb_insert`

Insert documents into MongoDB collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MongoDB server hostname or IP address |
| `port` | number | Yes | MongoDB server port \(default: 27017\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | No | MongoDB username |
| `password` | string | No | MongoDB password |
| `authSource` | string | No | Authentication database |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `collection` | string | Yes | Collection name to insert into |
| `documents` | array | Yes | Array of documents to insert |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `documentCount` | number | Number of documents inserted |
| `insertedId` | string | ID of inserted document \(single insert\) |
| `insertedIds` | array | Array of inserted document IDs \(multiple insert\) |

### `mongodb_update`

Update documents in MongoDB collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MongoDB server hostname or IP address |
| `port` | number | Yes | MongoDB server port \(default: 27017\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | No | MongoDB username |
| `password` | string | No | MongoDB password |
| `authSource` | string | No | Authentication database |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `collection` | string | Yes | Collection name to update |
| `filter` | string | Yes | Filter criteria as JSON string |
| `update` | string | Yes | Update operations as JSON string |
| `upsert` | boolean | No | Create document if not found |
| `multi` | boolean | No | Update multiple documents |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `matchedCount` | number | Number of documents matched by filter |
| `modifiedCount` | number | Number of documents modified |
| `documentCount` | number | Total number of documents affected |
| `insertedId` | string | ID of inserted document \(if upsert\) |

### `mongodb_delete`

Delete documents from MongoDB collection

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MongoDB server hostname or IP address |
| `port` | number | Yes | MongoDB server port \(default: 27017\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | No | MongoDB username |
| `password` | string | No | MongoDB password |
| `authSource` | string | No | Authentication database |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `collection` | string | Yes | Collection name to delete from |
| `filter` | string | Yes | Filter criteria as JSON string |
| `multi` | boolean | No | Delete multiple documents |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `deletedCount` | number | Number of documents deleted |
| `documentCount` | number | Total number of documents affected |

### `mongodb_execute`

Execute MongoDB aggregation pipeline

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MongoDB server hostname or IP address |
| `port` | number | Yes | MongoDB server port \(default: 27017\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | No | MongoDB username |
| `password` | string | No | MongoDB password |
| `authSource` | string | No | Authentication database |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `collection` | string | Yes | Collection name to execute pipeline on |
| `pipeline` | string | Yes | Aggregation pipeline as JSON string |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `documents` | array | Array of documents returned from aggregation |
| `documentCount` | number | Number of documents returned |



## Notes

- Category: `tools`
- Type: `mongodb`
```

--------------------------------------------------------------------------------

---[FILE: mysql.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/mysql.mdx

```text
---
title: MySQL
description: Connect to MySQL database
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mysql"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
The [MySQL](https://www.mysql.com/) tool enables you to connect to any MySQL database and perform a wide range of database operations directly within your agentic workflows. With secure connection handling and flexible configuration, you can easily manage and interact with your data.

With the MySQL tool, you can:

- **Query data**: Execute SELECT queries to retrieve data from your MySQL tables using the `mysql_query` operation.
- **Insert records**: Add new rows to your tables with the `mysql_insert` operation by specifying the table and data to insert.
- **Update records**: Modify existing data in your tables using the `mysql_update` operation, providing the table, new data, and WHERE conditions.
- **Delete records**: Remove rows from your tables with the `mysql_delete` operation, specifying the table and WHERE conditions.
- **Execute raw SQL**: Run any custom SQL command using the `mysql_execute` operation for advanced use cases.

The MySQL tool is ideal for scenarios where your agents need to interact with structured data—such as automating reporting, syncing data between systems, or powering data-driven workflows. It streamlines database access, making it easy to read, write, and manage your MySQL data programmatically.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate MySQL into the workflow. Can query, insert, update, delete, and execute raw SQL.



## Tools

### `mysql_query`

Execute SELECT query on MySQL database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MySQL server hostname or IP address |
| `port` | number | Yes | MySQL server port \(default: 3306\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Database username |
| `password` | string | Yes | Database password |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `query` | string | Yes | SQL SELECT query to execute |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of rows returned from the query |
| `rowCount` | number | Number of rows returned |

### `mysql_insert`

Insert new record into MySQL database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MySQL server hostname or IP address |
| `port` | number | Yes | MySQL server port \(default: 3306\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Database username |
| `password` | string | Yes | Database password |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `table` | string | Yes | Table name to insert into |
| `data` | object | Yes | Data to insert as key-value pairs |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of inserted rows |
| `rowCount` | number | Number of rows inserted |

### `mysql_update`

Update existing records in MySQL database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MySQL server hostname or IP address |
| `port` | number | Yes | MySQL server port \(default: 3306\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Database username |
| `password` | string | Yes | Database password |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `table` | string | Yes | Table name to update |
| `data` | object | Yes | Data to update as key-value pairs |
| `where` | string | Yes | WHERE clause condition \(without WHERE keyword\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of updated rows |
| `rowCount` | number | Number of rows updated |

### `mysql_delete`

Delete records from MySQL database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MySQL server hostname or IP address |
| `port` | number | Yes | MySQL server port \(default: 3306\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Database username |
| `password` | string | Yes | Database password |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `table` | string | Yes | Table name to delete from |
| `where` | string | Yes | WHERE clause condition \(without WHERE keyword\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of deleted rows |
| `rowCount` | number | Number of rows deleted |

### `mysql_execute`

Execute raw SQL query on MySQL database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | MySQL server hostname or IP address |
| `port` | number | Yes | MySQL server port \(default: 3306\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Database username |
| `password` | string | Yes | Database password |
| `ssl` | string | No | SSL connection mode \(disabled, required, preferred\) |
| `query` | string | Yes | Raw SQL query to execute |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `rows` | array | Array of rows returned from the query |
| `rowCount` | number | Number of rows affected |



## Notes

- Category: `tools`
- Type: `mysql`
```

--------------------------------------------------------------------------------

---[FILE: neo4j.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/neo4j.mdx

```text
---
title: Neo4j
description: Connect to Neo4j graph database
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="neo4j"
  color="#FFFFFF"
/>

## Usage Instructions

Integrate Neo4j graph database into the workflow. Can query, create, merge, update, and delete nodes and relationships.



## Tools

### `neo4j_query`

Execute MATCH queries to read nodes and relationships from Neo4j graph database. For best performance and to prevent large result sets, include LIMIT in your query (e.g., 

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | Neo4j server hostname or IP address |
| `port` | number | Yes | Neo4j server port \(default: 7687 for Bolt protocol\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Neo4j username |
| `password` | string | Yes | Neo4j password |
| `encryption` | string | No | Connection encryption mode \(enabled, disabled\) |
| `cypherQuery` | string | Yes | Cypher query to execute \(typically MATCH statements\) |
| `parameters` | object | No | Parameters for the Cypher query as a JSON object. Use for any dynamic values including LIMIT \(e.g., query: "MATCH \(n\) RETURN n LIMIT $limit", parameters: \{limit: 100\}\). |
| `parameters` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `records` | array | Array of records returned from the query |
| `recordCount` | number | Number of records returned |
| `summary` | json | Query execution summary with timing and counters |

### `neo4j_create`

Execute CREATE statements to add new nodes and relationships to Neo4j graph database

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | Neo4j server hostname or IP address |
| `port` | number | Yes | Neo4j server port \(default: 7687 for Bolt protocol\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Neo4j username |
| `password` | string | Yes | Neo4j password |
| `encryption` | string | No | Connection encryption mode \(enabled, disabled\) |
| `cypherQuery` | string | Yes | Cypher CREATE statement to execute |
| `parameters` | object | No | Parameters for the Cypher query as a JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `summary` | json | Creation summary with counters for nodes and relationships created |

### `neo4j_merge`

Execute MERGE statements to find or create nodes and relationships in Neo4j (upsert operation)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | Neo4j server hostname or IP address |
| `port` | number | Yes | Neo4j server port \(default: 7687 for Bolt protocol\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Neo4j username |
| `password` | string | Yes | Neo4j password |
| `encryption` | string | No | Connection encryption mode \(enabled, disabled\) |
| `cypherQuery` | string | Yes | Cypher MERGE statement to execute |
| `parameters` | object | No | Parameters for the Cypher query as a JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `summary` | json | Merge summary with counters for nodes/relationships created or matched |

### `neo4j_update`

Execute SET statements to update properties of existing nodes and relationships in Neo4j

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | Neo4j server hostname or IP address |
| `port` | number | Yes | Neo4j server port \(default: 7687 for Bolt protocol\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Neo4j username |
| `password` | string | Yes | Neo4j password |
| `encryption` | string | No | Connection encryption mode \(enabled, disabled\) |
| `cypherQuery` | string | Yes | Cypher query with MATCH and SET statements to update properties |
| `parameters` | object | No | Parameters for the Cypher query as a JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `summary` | json | Update summary with counters for properties set |

### `neo4j_delete`

Execute DELETE or DETACH DELETE statements to remove nodes and relationships from Neo4j

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | Neo4j server hostname or IP address |
| `port` | number | Yes | Neo4j server port \(default: 7687 for Bolt protocol\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Neo4j username |
| `password` | string | Yes | Neo4j password |
| `encryption` | string | No | Connection encryption mode \(enabled, disabled\) |
| `cypherQuery` | string | Yes | Cypher query with MATCH and DELETE/DETACH DELETE statements |
| `parameters` | object | No | Parameters for the Cypher query as a JSON object |
| `detach` | boolean | No | Whether to use DETACH DELETE to remove relationships before deleting nodes |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `summary` | json | Delete summary with counters for nodes and relationships deleted |

### `neo4j_execute`

Execute arbitrary Cypher queries on Neo4j graph database for complex operations

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `host` | string | Yes | Neo4j server hostname or IP address |
| `port` | number | Yes | Neo4j server port \(default: 7687 for Bolt protocol\) |
| `database` | string | Yes | Database name to connect to |
| `username` | string | Yes | Neo4j username |
| `password` | string | Yes | Neo4j password |
| `encryption` | string | No | Connection encryption mode \(enabled, disabled\) |
| `cypherQuery` | string | Yes | Cypher query to execute \(any valid Cypher statement\) |
| `parameters` | object | No | Parameters for the Cypher query as a JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `records` | array | Array of records returned from the query |
| `recordCount` | number | Number of records returned |
| `summary` | json | Execution summary with timing and counters |



## Notes

- Category: `tools`
- Type: `neo4j`
```

--------------------------------------------------------------------------------

````
