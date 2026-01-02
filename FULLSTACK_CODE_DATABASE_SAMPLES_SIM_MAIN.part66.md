---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 66
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 66 of 933)

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

---[FILE: datadog.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/datadog.mdx

```text
---
title: Datadog
description: Monitor infrastructure, applications, and logs with Datadog
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="datadog"
  color="#632CA6"
/>

{/* MANUAL-CONTENT-START:intro */}
[Datadog](https://datadoghq.com/) is a comprehensive monitoring and analytics platform for infrastructure, applications, logs, and more. It enables organizations to gain real-time visibility into the health and performance of systems, detect anomalies, and automate incident response.

With Datadog, you can:

- **Monitor metrics**: Collect, visualize, and analyze metrics from servers, cloud services, and custom applications.
- **Query time series data**: Run advanced queries on performance metrics for trend analysis and reporting.
- **Manage monitors and events**: Set up monitors to detect issues, trigger alerts, and create events for observability.
- **Handle downtimes**: Schedule and programmatically manage planned downtimes to suppress alerts during maintenance.
- **Analyze logs and traces** *(with additional setup in Datadog)*: Centralize and inspect logs or distributed traces for deeper troubleshooting.

Sim’s Datadog integration lets your agents automate these operations and interact with your Datadog account programmatically. Use it to submit custom metrics, query timeseries data, manage monitors, create events, and streamline your monitoring workflows directly within Sim automations.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Datadog monitoring into workflows. Submit metrics, manage monitors, query logs, create events, handle downtimes, and more.



## Tools

### `datadog_submit_metrics`

Submit custom metrics to Datadog. Use for tracking application performance, business metrics, or custom monitoring data.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `series` | string | Yes | JSON array of metric series to submit. Each series should include metric name, type \(gauge/rate/count\), points \(timestamp/value pairs\), and optional tags. |
| `apiKey` | string | Yes | Datadog API key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the metrics were submitted successfully |
| `errors` | array | Any errors that occurred during submission |

### `datadog_query_timeseries`

Query metric timeseries data from Datadog. Use for analyzing trends, creating reports, or retrieving metric values.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Datadog metrics query \(e.g., "avg:system.cpu.user\{*\}"\) |
| `from` | number | Yes | Start time as Unix timestamp in seconds |
| `to` | number | Yes | End time as Unix timestamp in seconds |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `series` | array | Array of timeseries data with metric name, tags, and data points |
| `status` | string | Query status |

### `datadog_create_event`

Post an event to the Datadog event stream. Use for deployment notifications, alerts, or any significant occurrences.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string | Yes | Event title |
| `text` | string | Yes | Event body/description. Supports markdown. |
| `alertType` | string | No | Alert type: error, warning, info, success, user_update, recommendation, or snapshot |
| `priority` | string | No | Event priority: normal or low |
| `host` | string | No | Host name to associate with this event |
| `tags` | string | No | Comma-separated list of tags \(e.g., "env:production,service:api"\) |
| `aggregationKey` | string | No | Key to aggregate events together |
| `sourceTypeName` | string | No | Source type name for the event |
| `dateHappened` | number | No | Unix timestamp when the event occurred \(defaults to now\) |
| `apiKey` | string | Yes | Datadog API key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `event` | object | The created event details |

### `datadog_create_monitor`

Create a new monitor/alert in Datadog. Monitors can track metrics, service checks, events, and more.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `name` | string | Yes | Monitor name |
| `type` | string | Yes | Monitor type: metric alert, service check, event alert, process alert, log alert, query alert, composite, synthetics alert, slo alert |
| `query` | string | Yes | Monitor query \(e.g., "avg\(last_5m\):avg:system.cpu.idle\{*\} &lt; 20"\) |
| `message` | string | No | Message to include with notifications. Can include @-mentions and markdown. |
| `tags` | string | No | Comma-separated list of tags |
| `priority` | number | No | Monitor priority \(1-5, where 1 is highest\) |
| `options` | string | No | JSON string of monitor options \(thresholds, notify_no_data, renotify_interval, etc.\) |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `monitor` | object | The created monitor details |

### `datadog_get_monitor`

Retrieve details of a specific monitor by ID.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | Yes | The ID of the monitor to retrieve |
| `groupStates` | string | No | Comma-separated group states to include: alert, warn, no data, ok |
| `withDowntimes` | boolean | No | Include downtime data with the monitor |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `monitor` | object | The monitor details |

### `datadog_list_monitors`

List all monitors in Datadog with optional filtering by name, tags, or state.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `groupStates` | string | No | Comma-separated group states to filter by: alert, warn, no data, ok |
| `name` | string | No | Filter monitors by name \(partial match\) |
| `tags` | string | No | Comma-separated list of tags to filter by |
| `monitorTags` | string | No | Comma-separated list of monitor tags to filter by |
| `withDowntimes` | boolean | No | Include downtime data with monitors |
| `page` | number | No | Page number for pagination \(0-indexed\) |
| `pageSize` | number | No | Number of monitors per page \(max 1000\) |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `monitors` | array | List of monitors |

### `datadog_mute_monitor`

Mute a monitor to temporarily suppress notifications.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | Yes | The ID of the monitor to mute |
| `scope` | string | No | Scope to mute \(e.g., "host:myhost"\). If not specified, mutes all scopes. |
| `end` | number | No | Unix timestamp when the mute should end. If not specified, mutes indefinitely. |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the monitor was successfully muted |

### `datadog_query_logs`

Search and retrieve logs from Datadog. Use for troubleshooting, analysis, or monitoring.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | Log search query \(e.g., "service:web-app status:error"\) |
| `from` | string | Yes | Start time in ISO-8601 format or relative \(e.g., "now-1h"\) |
| `to` | string | Yes | End time in ISO-8601 format or relative \(e.g., "now"\) |
| `limit` | number | No | Maximum number of logs to return \(default: 50, max: 1000\) |
| `sort` | string | No | Sort order: timestamp \(oldest first\) or -timestamp \(newest first\) |
| `indexes` | string | No | Comma-separated list of log indexes to search |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `logs` | array | List of log entries |

### `datadog_send_logs`

Send log entries to Datadog for centralized logging and analysis.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `logs` | string | Yes | JSON array of log entries. Each entry should have message and optionally ddsource, ddtags, hostname, service. |
| `apiKey` | string | Yes | Datadog API key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the logs were sent successfully |

### `datadog_create_downtime`

Schedule a downtime to suppress monitor notifications during maintenance windows.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `scope` | string | Yes | Scope to apply downtime to \(e.g., "host:myhost", "env:production", or "*" for all\) |
| `message` | string | No | Message to display during downtime |
| `start` | number | No | Unix timestamp for downtime start \(defaults to now\) |
| `end` | number | No | Unix timestamp for downtime end |
| `timezone` | string | No | Timezone for the downtime \(e.g., "America/New_York"\) |
| `monitorId` | string | No | Specific monitor ID to mute |
| `monitorTags` | string | No | Comma-separated monitor tags to match \(e.g., "team:backend,priority:high"\) |
| `muteFirstRecoveryNotification` | boolean | No | Mute the first recovery notification |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `downtime` | object | The created downtime details |

### `datadog_list_downtimes`

List all scheduled downtimes in Datadog.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `currentOnly` | boolean | No | Only return currently active downtimes |
| `monitorId` | string | No | Filter by monitor ID |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `downtimes` | array | List of downtimes |

### `datadog_cancel_downtime`

Cancel a scheduled downtime.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `downtimeId` | string | Yes | The ID of the downtime to cancel |
| `apiKey` | string | Yes | Datadog API key |
| `applicationKey` | string | Yes | Datadog Application key |
| `site` | string | No | Datadog site/region \(default: datadoghq.com\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the downtime was successfully canceled |



## Notes

- Category: `tools`
- Type: `datadog`
```

--------------------------------------------------------------------------------

---[FILE: discord.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/discord.mdx

```text
---
title: Discord
description: Interact with Discord
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="discord"
  color="#5865F2"
/>

{/* MANUAL-CONTENT-START:intro */}
[Discord](https://discord.com) is a powerful communication platform that allows you to connect with friends, communities, and teams. It offers a range of features for team collaboration, including text channels, voice channels, and video calls.

With a Discord account or bot, you can:

- **Send messages**: Send messages to a specific channel
- **Get messages**: Get messages from a specific channel
- **Get server**: Get information about a specific server
- **Get user**: Get information about a specific user

In Sim, the Discord integration enables your agents to access and leverage your organization's Discord servers. Agents can retrieve information from Discord channels, search for specific users, get server information, and send messages. This allows your workflows to integrate with your Discord communities, automate notifications, and create interactive experiences.

> **Important:** To read message content, your Discord bot needs the "Message Content Intent" enabled in the Discord Developer Portal. Without this permission, you'll still receive message metadata but the content field will appear empty.

Discord components in Sim use efficient lazy loading, only fetching data when needed to minimize API calls and prevent rate limiting. Token refreshing happens automatically in the background to maintain your connection.

### Setting Up Your Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and navigate to the "Bot" tab
3. Create a bot and copy your bot token
4. Under "Privileged Gateway Intents", enable the **Message Content Intent** to read message content
5. Invite your bot to your servers with appropriate permissions
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Comprehensive Discord integration: messages, threads, channels, roles, members, invites, and webhooks.



## Tools

### `discord_send_message`

Send a message to a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID to send the message to |
| `content` | string | No | The text content of the message |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `files` | file[] | No | Files to attach to the message |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Discord message data |

### `discord_get_messages`

Retrieve messages from a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID to retrieve messages from |
| `limit` | number | No | Maximum number of messages to retrieve \(default: 10, max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Container for messages data |

### `discord_get_server`

Retrieve information about a Discord server (guild)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Discord server \(guild\) information |

### `discord_get_user`

Retrieve information about a Discord user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | Discord bot token for authentication |
| `userId` | string | Yes | The Discord user ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Discord user information |

### `discord_edit_message`

Edit an existing message in a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID containing the message |
| `messageId` | string | Yes | The ID of the message to edit |
| `content` | string | No | The new text content for the message |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Updated Discord message data |

### `discord_delete_message`

Delete a message from a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID containing the message |
| `messageId` | string | Yes | The ID of the message to delete |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_add_reaction`

Add a reaction emoji to a Discord message

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID containing the message |
| `messageId` | string | Yes | The ID of the message to react to |
| `emoji` | string | Yes | The emoji to react with \(unicode emoji or custom emoji in name:id format\) |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_remove_reaction`

Remove a reaction from a Discord message

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID containing the message |
| `messageId` | string | Yes | The ID of the message with the reaction |
| `emoji` | string | Yes | The emoji to remove \(unicode emoji or custom emoji in name:id format\) |
| `userId` | string | No | The user ID whose reaction to remove \(omit to remove bot's own reaction\) |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_pin_message`

Pin a message in a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID containing the message |
| `messageId` | string | Yes | The ID of the message to pin |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_unpin_message`

Unpin a message in a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID containing the message |
| `messageId` | string | Yes | The ID of the message to unpin |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_create_thread`

Create a thread in a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID to create the thread in |
| `name` | string | Yes | The name of the thread \(1-100 characters\) |
| `messageId` | string | No | The message ID to create a thread from \(if creating from existing message\) |
| `autoArchiveDuration` | number | No | Duration in minutes to auto-archive the thread \(60, 1440, 4320, 10080\) |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Created thread data |

### `discord_join_thread`

Join a thread in Discord

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `threadId` | string | Yes | The thread ID to join |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_leave_thread`

Leave a thread in Discord

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `threadId` | string | Yes | The thread ID to leave |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_archive_thread`

Archive or unarchive a thread in Discord

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `threadId` | string | Yes | The thread ID to archive/unarchive |
| `archived` | boolean | Yes | Whether to archive \(true\) or unarchive \(false\) the thread |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Updated thread data |

### `discord_create_channel`

Create a new channel in a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `name` | string | Yes | The name of the channel \(1-100 characters\) |
| `type` | number | No | Channel type \(0=text, 2=voice, 4=category, 5=announcement, 13=stage\) |
| `topic` | string | No | Channel topic \(0-1024 characters\) |
| `parentId` | string | No | Parent category ID for the channel |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Created channel data |

### `discord_update_channel`

Update a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID to update |
| `name` | string | No | The new name for the channel |
| `topic` | string | No | The new topic for the channel |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Updated channel data |

### `discord_delete_channel`

Delete a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID to delete |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_get_channel`

Get information about a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID to retrieve |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Channel data |

### `discord_create_role`

Create a new role in a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `name` | string | Yes | The name of the role |
| `color` | number | No | RGB color value as integer \(e.g., 0xFF0000 for red\) |
| `hoist` | boolean | No | Whether to display role members separately from online members |
| `mentionable` | boolean | No | Whether the role can be mentioned |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Created role data |

### `discord_update_role`

Update a role in a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `roleId` | string | Yes | The role ID to update |
| `name` | string | No | The new name for the role |
| `color` | number | No | RGB color value as integer |
| `hoist` | boolean | No | Whether to display role members separately |
| `mentionable` | boolean | No | Whether the role can be mentioned |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Updated role data |

### `discord_delete_role`

Delete a role from a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `roleId` | string | Yes | The role ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_assign_role`

Assign a role to a member in a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `userId` | string | Yes | The user ID to assign the role to |
| `roleId` | string | Yes | The role ID to assign |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_remove_role`

Remove a role from a member in a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `userId` | string | Yes | The user ID to remove the role from |
| `roleId` | string | Yes | The role ID to remove |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_kick_member`

Kick a member from a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `userId` | string | Yes | The user ID to kick |
| `reason` | string | No | Reason for kicking the member |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_ban_member`

Ban a member from a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `userId` | string | Yes | The user ID to ban |
| `reason` | string | No | Reason for banning the member |
| `deleteMessageDays` | number | No | Number of days to delete messages for \(0-7\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_unban_member`

Unban a member from a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `userId` | string | Yes | The user ID to unban |
| `reason` | string | No | Reason for unbanning the member |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_get_member`

Get information about a member in a Discord server

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `userId` | string | Yes | The user ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Member data |

### `discord_update_member`

Update a member in a Discord server (e.g., change nickname)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |
| `userId` | string | Yes | The user ID to update |
| `nick` | string | No | New nickname for the member \(null to remove\) |
| `mute` | boolean | No | Whether to mute the member in voice channels |
| `deaf` | boolean | No | Whether to deafen the member in voice channels |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Updated member data |

### `discord_create_invite`

Create an invite link for a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID to create an invite for |
| `maxAge` | number | No | Duration of invite in seconds \(0 = never expires, default 86400\) |
| `maxUses` | number | No | Max number of uses \(0 = unlimited, default 0\) |
| `temporary` | boolean | No | Whether invite grants temporary membership |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Created invite data |

### `discord_get_invite`

Get information about a Discord invite

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `inviteCode` | string | Yes | The invite code to retrieve |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Invite data |

### `discord_delete_invite`

Delete a Discord invite

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `inviteCode` | string | Yes | The invite code to delete |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |

### `discord_create_webhook`

Create a webhook in a Discord channel

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `channelId` | string | Yes | The Discord channel ID to create the webhook in |
| `name` | string | Yes | Name of the webhook \(1-80 characters\) |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Created webhook data |

### `discord_execute_webhook`

Execute a Discord webhook to send a message

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `webhookId` | string | Yes | The webhook ID |
| `webhookToken` | string | Yes | The webhook token |
| `content` | string | Yes | The message content to send |
| `username` | string | No | Override the default username of the webhook |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Message sent via webhook |

### `discord_get_webhook`

Get information about a Discord webhook

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `webhookId` | string | Yes | The webhook ID to retrieve |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Webhook data |

### `discord_delete_webhook`

Delete a Discord webhook

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | The bot token for authentication |
| `webhookId` | string | Yes | The webhook ID to delete |
| `serverId` | string | Yes | The Discord server ID \(guild ID\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |



## Notes

- Category: `tools`
- Type: `discord`
```

--------------------------------------------------------------------------------

````
