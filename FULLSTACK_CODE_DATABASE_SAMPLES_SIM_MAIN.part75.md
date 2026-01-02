---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 75
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 75 of 933)

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

---[FILE: jira.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/jira.mdx

```text
---
title: Jira
description: Interact with Jira
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jira"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jira](https://www.atlassian.com/jira) is a leading project management and issue tracking platform that helps teams plan, track, and manage agile software development projects effectively. As part of the Atlassian suite, Jira has become the industry standard for software development teams and project management professionals worldwide.

Jira provides a comprehensive set of tools for managing complex projects through its flexible and customizable workflow system. With its robust API and integration capabilities, Jira enables teams to streamline their development processes and maintain clear visibility of project progress.

Key features of Jira include:

- Agile Project Management: Support for Scrum and Kanban methodologies with customizable boards and workflows
- Issue Tracking: Sophisticated tracking system for bugs, stories, epics, and tasks with detailed reporting
- Workflow Automation: Powerful automation rules to streamline repetitive tasks and processes
- Advanced Search: JQL (Jira Query Language) for complex issue filtering and reporting

In Sim, the Jira integration allows your agents to seamlessly interact with your project management workflow. This creates opportunities for automated issue creation, updates, and tracking as part of your AI workflows. The integration enables agents to create, retrieve, and update Jira issues programmatically, facilitating automated project management tasks and ensuring that important information is properly tracked and documented. By connecting Sim with Jira, you can build intelligent agents that maintain project visibility while automating routine project management tasks, enhancing team productivity and ensuring consistent project tracking.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Jira into the workflow. Can read, write, and update issues. Can also trigger workflows based on Jira webhook events.



## Tools

### `jira_retrieve`

Retrieve detailed information about a specific Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `projectId` | string | No | Jira project ID \(optional; not required to retrieve a single issue\). |
| `issueKey` | string | Yes | Jira issue key to retrieve \(e.g., PROJ-123\) |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key \(e.g., PROJ-123\) |
| `summary` | string | Issue summary |
| `description` | json | Issue description content |
| `created` | string | Issue creation timestamp |
| `updated` | string | Issue last updated timestamp |
| `issue` | json | Complete issue object with all fields |

### `jira_update`

Update a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `projectId` | string | No | Jira project ID to update issues in. If not provided, all issues will be retrieved. |
| `issueKey` | string | Yes | Jira issue key to update |
| `summary` | string | No | New summary for the issue |
| `description` | string | No | New description for the issue |
| `status` | string | No | New status for the issue |
| `priority` | string | No | New priority for the issue |
| `assignee` | string | No | New assignee for the issue |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Updated issue key \(e.g., PROJ-123\) |
| `summary` | string | Issue summary after update |

### `jira_write`

Write a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `projectId` | string | Yes | Project ID for the issue |
| `summary` | string | Yes | Summary for the issue |
| `description` | string | No | Description for the issue |
| `priority` | string | No | Priority for the issue |
| `assignee` | string | No | Assignee for the issue |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |
| `issueType` | string | Yes | Type of issue to create \(e.g., Task, Story\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Created issue key \(e.g., PROJ-123\) |
| `summary` | string | Issue summary |
| `url` | string | URL to the created issue |

### `jira_bulk_read`

Retrieve multiple Jira issues in bulk

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `projectId` | string | Yes | Jira project ID |
| `cloudId` | string | No | Jira cloud ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `issues` | array | Array of Jira issues with ts, summary, description, created, and updated timestamps |

### `jira_delete_issue`

Delete a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to delete \(e.g., PROJ-123\) |
| `deleteSubtasks` | boolean | No | Whether to delete subtasks. If false, parent issues with subtasks cannot be deleted. |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Deleted issue key |

### `jira_assign_issue`

Assign a Jira issue to a user

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to assign \(e.g., PROJ-123\) |
| `accountId` | string | Yes | Account ID of the user to assign the issue to. Use "-1" for automatic assignment or null to unassign. |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key that was assigned |
| `assigneeId` | string | Account ID of the assignee |

### `jira_transition_issue`

Move a Jira issue between workflow statuses (e.g., To Do -> In Progress)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to transition \(e.g., PROJ-123\) |
| `transitionId` | string | Yes | ID of the transition to execute \(e.g., "11" for "To Do", "21" for "In Progress"\) |
| `comment` | string | No | Optional comment to add when transitioning the issue |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key that was transitioned |
| `transitionId` | string | Applied transition ID |

### `jira_search_issues`

Search for Jira issues using JQL (Jira Query Language)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `jql` | string | Yes | JQL query string to search for issues \(e.g., "project = PROJ AND status = Open"\) |
| `startAt` | number | No | The index of the first result to return \(for pagination\) |
| `maxResults` | number | No | Maximum number of results to return \(default: 50\) |
| `fields` | array | No | Array of field names to return \(default: \['summary', 'status', 'assignee', 'created', 'updated'\]\) |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `total` | number | Total number of matching issues |
| `startAt` | number | Pagination start index |
| `maxResults` | number | Maximum results per page |
| `issues` | array | Array of matching issues with key, summary, status, assignee, created, updated |

### `jira_add_comment`

Add a comment to a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to add comment to \(e.g., PROJ-123\) |
| `body` | string | Yes | Comment body text |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key the comment was added to |
| `commentId` | string | Created comment ID |
| `body` | string | Comment text content |

### `jira_get_comments`

Get all comments from a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to get comments from \(e.g., PROJ-123\) |
| `startAt` | number | No | Index of the first comment to return \(default: 0\) |
| `maxResults` | number | No | Maximum number of comments to return \(default: 50\) |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `total` | number | Total number of comments |
| `comments` | array | Array of comments with id, author, body, created, updated |

### `jira_update_comment`

Update an existing comment on a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key containing the comment \(e.g., PROJ-123\) |
| `commentId` | string | Yes | ID of the comment to update |
| `body` | string | Yes | Updated comment text |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `commentId` | string | Updated comment ID |
| `body` | string | Updated comment text |

### `jira_delete_comment`

Delete a comment from a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key containing the comment \(e.g., PROJ-123\) |
| `commentId` | string | Yes | ID of the comment to delete |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `commentId` | string | Deleted comment ID |

### `jira_get_attachments`

Get all attachments from a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to get attachments from \(e.g., PROJ-123\) |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `attachments` | array | Array of attachments with id, filename, size, mimeType, created, author |

### `jira_delete_attachment`

Delete an attachment from a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `attachmentId` | string | Yes | ID of the attachment to delete |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `attachmentId` | string | Deleted attachment ID |

### `jira_add_worklog`

Add a time tracking worklog entry to a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to add worklog to \(e.g., PROJ-123\) |
| `timeSpentSeconds` | number | Yes | Time spent in seconds |
| `comment` | string | No | Optional comment for the worklog entry |
| `started` | string | No | Optional start time in ISO format \(defaults to current time\) |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key the worklog was added to |
| `worklogId` | string | Created worklog ID |
| `timeSpentSeconds` | number | Time spent in seconds |

### `jira_get_worklogs`

Get all worklog entries from a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to get worklogs from \(e.g., PROJ-123\) |
| `startAt` | number | No | Index of the first worklog to return \(default: 0\) |
| `maxResults` | number | No | Maximum number of worklogs to return \(default: 50\) |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `total` | number | Total number of worklogs |
| `worklogs` | array | Array of worklogs with id, author, timeSpentSeconds, timeSpent, comment, created, updated, started |

### `jira_update_worklog`

Update an existing worklog entry on a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key containing the worklog \(e.g., PROJ-123\) |
| `worklogId` | string | Yes | ID of the worklog entry to update |
| `timeSpentSeconds` | number | No | Time spent in seconds |
| `comment` | string | No | Optional comment for the worklog entry |
| `started` | string | No | Optional start time in ISO format |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `worklogId` | string | Updated worklog ID |

### `jira_delete_worklog`

Delete a worklog entry from a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key containing the worklog \(e.g., PROJ-123\) |
| `worklogId` | string | Yes | ID of the worklog entry to delete |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `worklogId` | string | Deleted worklog ID |

### `jira_create_issue_link`

Create a link relationship between two Jira issues

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `inwardIssueKey` | string | Yes | Jira issue key for the inward issue \(e.g., PROJ-123\) |
| `outwardIssueKey` | string | Yes | Jira issue key for the outward issue \(e.g., PROJ-456\) |
| `linkType` | string | Yes | The type of link relationship \(e.g., "Blocks", "Relates to", "Duplicates"\) |
| `comment` | string | No | Optional comment to add to the issue link |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `inwardIssue` | string | Inward issue key |
| `outwardIssue` | string | Outward issue key |
| `linkType` | string | Type of issue link |
| `linkId` | string | Created link ID |

### `jira_delete_issue_link`

Delete a link between two Jira issues

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `linkId` | string | Yes | ID of the issue link to delete |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `linkId` | string | Deleted link ID |

### `jira_add_watcher`

Add a watcher to a Jira issue to receive notifications about updates

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to add watcher to \(e.g., PROJ-123\) |
| `accountId` | string | Yes | Account ID of the user to add as watcher |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `watcherAccountId` | string | Added watcher account ID |

### `jira_remove_watcher`

Remove a watcher from a Jira issue

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `domain` | string | Yes | Your Jira domain \(e.g., yourcompany.atlassian.net\) |
| `issueKey` | string | Yes | Jira issue key to remove watcher from \(e.g., PROJ-123\) |
| `accountId` | string | Yes | Account ID of the user to remove as watcher |
| `cloudId` | string | No | Jira Cloud ID for the instance. If not provided, it will be fetched using the domain. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `ts` | string | Timestamp of the operation |
| `issueKey` | string | Issue key |
| `watcherAccountId` | string | Removed watcher account ID |



## Notes

- Category: `tools`
- Type: `jira`
```

--------------------------------------------------------------------------------

---[FILE: kalshi.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/kalshi.mdx

```text
---
title: Kalshi
description: Access prediction markets and trade on Kalshi
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="kalshi"
  color="#09C285"
/>

{/* MANUAL-CONTENT-START:intro */}
[Kalshi](https://kalshi.com) is a federally regulated exchange where users can trade directly on the outcomes of future events—prediction markets. Kalshi’s robust API and Sim integration enable agents and workflows to programmatically access all aspects of the platform, supporting everything from research and analytics to automated trading and monitoring.

With Kalshi’s integration in Sim, you can:

- **Market & Event Data:** Search, filter, and retrieve real-time and historical data for markets and events; fetch granular details on market status, series, event groupings, and more.
- **Account & Balance Management:** Access account balances, available funds, and monitor real-time open positions.
- **Order & Trade Management:** Place new orders, cancel existing ones, view open orders, retrieve a live orderbook, and access complete trade histories.
- **Execution Analysis:** Fetch recent trades, historical fills, and candlestick data for backtesting or market structure research.
- **Monitoring:** Check exchange-wide or series-level status, receive real-time updates about market changes or trading halts, and automate responses.
- **Automation Ready:** Build end-to-end automated agents and dashboards that consume, analyze, and trade on real-world event probabilities.

By using these unified tools and endpoints, you can seamlessly incorporate Kalshi’s prediction markets, live trading capabilities, and deep event data into your AI-powered applications, dashboards, and workflows—enabling sophisticated, automated decision-making tied to real-world outcomes.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Kalshi prediction markets into the workflow. Can get markets, market, events, event, balance, positions, orders, orderbook, trades, candlesticks, fills, series, exchange status, and place/cancel/amend trades.



## Tools

### `kalshi_get_markets`

Retrieve a list of prediction markets from Kalshi with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `status` | string | No | Filter by status \(unopened, open, closed, settled\) |
| `seriesTicker` | string | No | Filter by series ticker |
| `eventTicker` | string | No | Filter by event ticker |
| `limit` | string | No | Number of results \(1-1000, default: 100\) |
| `cursor` | string | No | Pagination cursor for next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `markets` | array | Array of market objects |
| `paging` | object | Pagination cursor for fetching more results |

### `kalshi_get_market`

Retrieve details of a specific prediction market by ticker

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | Yes | The market ticker \(e.g., "KXBTC-24DEC31"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `market` | object | Market object with details |

### `kalshi_get_events`

Retrieve a list of events from Kalshi with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `status` | string | No | Filter by status \(open, closed, settled\) |
| `seriesTicker` | string | No | Filter by series ticker |
| `withNestedMarkets` | string | No | Include nested markets in response \(true/false\) |
| `limit` | string | No | Number of results \(1-200, default: 200\) |
| `cursor` | string | No | Pagination cursor for next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `events` | array | Array of event objects |
| `paging` | object | Pagination cursor for fetching more results |

### `kalshi_get_event`

Retrieve details of a specific event by ticker

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `eventTicker` | string | Yes | The event ticker |
| `withNestedMarkets` | string | No | Include nested markets in response \(true/false\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `event` | object | Event object with details |

### `kalshi_get_balance`

Retrieve your account balance and portfolio value from Kalshi

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Yes | Your Kalshi API Key ID |
| `privateKey` | string | Yes | Your RSA Private Key \(PEM format\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `balance` | number | Account balance in cents |
| `portfolioValue` | number | Portfolio value in cents |
| `balanceDollars` | number | Account balance in dollars |
| `portfolioValueDollars` | number | Portfolio value in dollars |

### `kalshi_get_positions`

Retrieve your open positions from Kalshi

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Yes | Your Kalshi API Key ID |
| `privateKey` | string | Yes | Your RSA Private Key \(PEM format\) |
| `ticker` | string | No | Filter by market ticker |
| `eventTicker` | string | No | Filter by event ticker \(max 10 comma-separated\) |
| `settlementStatus` | string | No | Filter by settlement status \(all, unsettled, settled\). Default: unsettled |
| `limit` | string | No | Number of results \(1-1000, default: 100\) |
| `cursor` | string | No | Pagination cursor for next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `positions` | array | Array of position objects |
| `paging` | object | Pagination cursor for fetching more results |

### `kalshi_get_orders`

Retrieve your orders from Kalshi with optional filtering

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Yes | Your Kalshi API Key ID |
| `privateKey` | string | Yes | Your RSA Private Key \(PEM format\) |
| `ticker` | string | No | Filter by market ticker |
| `eventTicker` | string | No | Filter by event ticker \(max 10 comma-separated\) |
| `status` | string | No | Filter by status \(resting, canceled, executed\) |
| `limit` | string | No | Number of results \(1-200, default: 100\) |
| `cursor` | string | No | Pagination cursor for next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `orders` | array | Array of order objects |
| `paging` | object | Pagination cursor for fetching more results |

### `kalshi_get_order`

Retrieve details of a specific order by ID from Kalshi

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Yes | Your Kalshi API Key ID |
| `privateKey` | string | Yes | Your RSA Private Key \(PEM format\) |
| `orderId` | string | Yes | The order ID to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `order` | object | Order object with details |

### `kalshi_get_orderbook`

Retrieve the orderbook (yes and no bids) for a specific market

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | Yes | Market ticker \(e.g., KXBTC-24DEC31\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `orderbook` | object | Orderbook with yes/no bids and asks |

### `kalshi_get_trades`

Retrieve recent trades across all markets

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Number of results \(1-1000, default: 100\) |
| `cursor` | string | No | Pagination cursor for next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `trades` | array | Array of trade objects |
| `paging` | object | Pagination cursor for fetching more results |

### `kalshi_get_candlesticks`

Retrieve OHLC candlestick data for a specific market

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | Yes | Series ticker |
| `ticker` | string | Yes | Market ticker \(e.g., KXBTC-24DEC31\) |
| `startTs` | number | Yes | Start timestamp \(Unix seconds\) |
| `endTs` | number | Yes | End timestamp \(Unix seconds\) |
| `periodInterval` | number | Yes | Period interval: 1 \(1min\), 60 \(1hour\), or 1440 \(1day\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `candlesticks` | array | Array of OHLC candlestick data |

### `kalshi_get_fills`

Retrieve your portfolio

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Yes | Your Kalshi API Key ID |
| `privateKey` | string | Yes | Your RSA Private Key \(PEM format\) |
| `ticker` | string | No | Filter by market ticker |
| `orderId` | string | No | Filter by order ID |
| `minTs` | number | No | Minimum timestamp \(Unix milliseconds\) |
| `maxTs` | number | No | Maximum timestamp \(Unix milliseconds\) |
| `limit` | string | No | Number of results \(1-1000, default: 100\) |
| `cursor` | string | No | Pagination cursor for next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `fills` | array | Array of fill/trade objects |
| `paging` | object | Pagination cursor for fetching more results |

### `kalshi_get_series_by_ticker`

Retrieve details of a specific market series by ticker

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | Yes | Series ticker |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `series` | object | Series object with details |

### `kalshi_get_exchange_status`

Retrieve the current status of the Kalshi exchange (trading and exchange activity)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `status` | object | Exchange status with trading_active and exchange_active flags |

### `kalshi_create_order`

Create a new order on a Kalshi prediction market

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Yes | Your Kalshi API Key ID |
| `privateKey` | string | Yes | Your RSA Private Key \(PEM format\) |
| `ticker` | string | Yes | Market ticker \(e.g., KXBTC-24DEC31\) |
| `side` | string | Yes | Side of the order: 'yes' or 'no' |
| `action` | string | Yes | Action type: 'buy' or 'sell' |
| `count` | string | Yes | Number of contracts \(minimum 1\) |
| `type` | string | No | Order type: 'limit' or 'market' \(default: limit\) |
| `yesPrice` | string | No | Yes price in cents \(1-99\) |
| `noPrice` | string | No | No price in cents \(1-99\) |
| `yesPriceDollars` | string | No | Yes price in dollars \(e.g., "0.56"\) |
| `noPriceDollars` | string | No | No price in dollars \(e.g., "0.56"\) |
| `clientOrderId` | string | No | Custom order identifier |
| `expirationTs` | string | No | Unix timestamp for order expiration |
| `timeInForce` | string | No | Time in force: 'fill_or_kill', 'good_till_canceled', 'immediate_or_cancel' |
| `buyMaxCost` | string | No | Maximum cost in cents \(auto-enables fill_or_kill\) |
| `postOnly` | string | No | Set to 'true' for maker-only orders |
| `reduceOnly` | string | No | Set to 'true' for position reduction only |
| `selfTradePreventionType` | string | No | Self-trade prevention: 'taker_at_cross' or 'maker' |
| `orderGroupId` | string | No | Associated order group ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `order` | object | The created order object |

### `kalshi_cancel_order`

Cancel an existing order on Kalshi

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Yes | Your Kalshi API Key ID |
| `privateKey` | string | Yes | Your RSA Private Key \(PEM format\) |
| `orderId` | string | Yes | The order ID to cancel |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `order` | object | The canceled order object |
| `reducedBy` | number | Number of contracts canceled |

### `kalshi_amend_order`

Modify the price or quantity of an existing order on Kalshi

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | Yes | Your Kalshi API Key ID |
| `privateKey` | string | Yes | Your RSA Private Key \(PEM format\) |
| `orderId` | string | Yes | The order ID to amend |
| `ticker` | string | Yes | Market ticker |
| `side` | string | Yes | Side of the order: 'yes' or 'no' |
| `action` | string | Yes | Action type: 'buy' or 'sell' |
| `clientOrderId` | string | Yes | The original client-specified order ID |
| `updatedClientOrderId` | string | Yes | The new client-specified order ID after amendment |
| `count` | string | No | Updated quantity for the order |
| `yesPrice` | string | No | Updated yes price in cents \(1-99\) |
| `noPrice` | string | No | Updated no price in cents \(1-99\) |
| `yesPriceDollars` | string | No | Updated yes price in dollars \(e.g., "0.56"\) |
| `noPriceDollars` | string | No | Updated no price in dollars \(e.g., "0.56"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `order` | object | The amended order object |



## Notes

- Category: `tools`
- Type: `kalshi`
```

--------------------------------------------------------------------------------

---[FILE: knowledge.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/knowledge.mdx

```text
---
title: Knowledge
description: Use vector search
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="knowledge"
  color="#00B0B0"
/>

{/* MANUAL-CONTENT-START:intro */}
Sim's Knowledge Base is a powerful native feature that enables you to create, manage, and query custom knowledge bases directly within the platform. Using advanced AI embeddings and vector search technology, the Knowledge Base block allows you to build intelligent search capabilities into your workflows, making it easy to find and utilize relevant information across your organization.

The Knowledge Base system provides a comprehensive solution for managing organizational knowledge through its flexible and scalable architecture. With its built-in vector search capabilities, teams can perform semantic searches that understand meaning and context, going beyond traditional keyword matching.

Key features of the Knowledge Base include:

- Semantic Search: Advanced AI-powered search that understands meaning and context, not just keywords
- Vector Embeddings: Automatic conversion of text into high-dimensional vectors for intelligent similarity matching
- Custom Knowledge Bases: Create and manage multiple knowledge bases for different purposes or departments
- Flexible Content Types: Support for various document formats and content types
- Real-time Updates: Immediate indexing of new content for instant searchability

In Sim, the Knowledge Base block enables your agents to perform intelligent semantic searches across your custom knowledge bases. This creates opportunities for automated information retrieval, content recommendations, and knowledge discovery as part of your AI workflows. The integration allows agents to search and retrieve relevant information programmatically, facilitating automated knowledge management tasks and ensuring that important information is easily accessible. By leveraging the Knowledge Base block, you can build intelligent agents that enhance information discovery while automating routine knowledge management tasks, improving team efficiency and ensuring consistent access to organizational knowledge.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Knowledge into the workflow. Can search, upload chunks, and create documents.



## Tools

### `knowledge_search`

Search for similar content in a knowledge base using vector similarity

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `knowledgeBaseId` | string | Yes | ID of the knowledge base to search in |
| `query` | string | No | Search query text \(optional when using tag filters\) |
| `topK` | number | No | Number of most similar results to return \(1-100\) |
| `tagFilters` | array | No | Array of tag filters with tagName and tagValue properties |
| `items` | object | No | No description |
| `properties` | string | No | No description |
| `tagName` | string | No | No description |
| `tagValue` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | Array of search results from the knowledge base |

### `knowledge_upload_chunk`

Upload a new chunk to a document in a knowledge base

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `knowledgeBaseId` | string | Yes | ID of the knowledge base containing the document |
| `documentId` | string | Yes | ID of the document to upload the chunk to |
| `content` | string | Yes | Content of the chunk to upload |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | object | Information about the uploaded chunk |

### `knowledge_create_document`

Create a new document in a knowledge base

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `knowledgeBaseId` | string | Yes | ID of the knowledge base containing the document |
| `name` | string | Yes | Name of the document |
| `content` | string | Yes | Content of the document |
| `tag1` | string | No | Tag 1 value for the document |
| `tag2` | string | No | Tag 2 value for the document |
| `tag3` | string | No | Tag 3 value for the document |
| `tag4` | string | No | Tag 4 value for the document |
| `tag5` | string | No | Tag 5 value for the document |
| `tag6` | string | No | Tag 6 value for the document |
| `tag7` | string | No | Tag 7 value for the document |
| `documentTagsData` | array | No | Structured tag data with names, types, and values |
| `items` | object | No | No description |
| `properties` | string | No | No description |
| `tagName` | string | No | No description |
| `tagValue` | string | No | No description |
| `tagType` | string | No | No description |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `data` | object | Information about the created document |



## Notes

- Category: `blocks`
- Type: `knowledge`
```

--------------------------------------------------------------------------------

````
