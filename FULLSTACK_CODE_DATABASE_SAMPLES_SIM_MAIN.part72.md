---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 72
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 72 of 933)

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

---[FILE: grafana.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/grafana.mdx

```text
---
title: Grafana
description: Interact with Grafana dashboards, alerts, and annotations
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="grafana"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Grafana](https://grafana.com/) is a leading open-source platform for monitoring, observability, and visualization. It allows users to query, visualize, alert on, and analyze data from a variety of sources, making it an essential tool for infrastructure and application monitoring.

With Grafana, you can:

- **Visualize data**: Build and customize dashboards to display metrics, logs, and traces in real time
- **Monitor health and status**: Check the health of your Grafana instance and connected data sources
- **Manage alerts and annotations**: Set up alert rules, manage notifications, and annotate dashboards with important events
- **Organize content**: Organize dashboards and data sources into folders for better access management

In Sim, the Grafana integration empowers your agents to interact directly with your Grafana instance via API, enabling actions such as:

- Checking the Grafana server, database, and data source health status
- Retrieving, listing, and managing dashboards, alert rules, annotations, data sources, and folders
- Automating the monitoring of your infrastructure by integrating Grafana data and alerts into your workflow automations

These capabilities enable Sim agents to monitor systems, proactively respond to alerts, and help ensure the reliability and visibility of your services — all as part of your automated workflows.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Grafana into workflows. Manage dashboards, alerts, annotations, data sources, folders, and monitor health status.



## Tools

### `grafana_get_dashboard`

Get a dashboard by its UID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `dashboardUid` | string | Yes | The UID of the dashboard to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `dashboard` | json | The full dashboard JSON object |
| `meta` | json | Dashboard metadata \(version, permissions, etc.\) |

### `grafana_list_dashboards`

Search and list all dashboards

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `query` | string | No | Search query to filter dashboards by title |
| `tag` | string | No | Filter by tag \(comma-separated for multiple tags\) |
| `folderIds` | string | No | Filter by folder IDs \(comma-separated\) |
| `starred` | boolean | No | Only return starred dashboards |
| `limit` | number | No | Maximum number of dashboards to return |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `dashboards` | array | List of dashboard search results |

### `grafana_create_dashboard`

Create a new dashboard

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `title` | string | Yes | The title of the new dashboard |
| `folderUid` | string | No | The UID of the folder to create the dashboard in |
| `tags` | string | No | Comma-separated list of tags |
| `timezone` | string | No | Dashboard timezone \(e.g., browser, utc\) |
| `refresh` | string | No | Auto-refresh interval \(e.g., 5s, 1m, 5m\) |
| `panels` | string | No | JSON array of panel configurations |
| `overwrite` | boolean | No | Overwrite existing dashboard with same title |
| `message` | string | No | Commit message for the dashboard version |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | The numeric ID of the created dashboard |
| `uid` | string | The UID of the created dashboard |
| `url` | string | The URL path to the dashboard |
| `status` | string | Status of the operation \(success\) |
| `version` | number | The version number of the dashboard |
| `slug` | string | URL-friendly slug of the dashboard |

### `grafana_update_dashboard`

Update an existing dashboard. Fetches the current dashboard and merges your changes.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `dashboardUid` | string | Yes | The UID of the dashboard to update |
| `title` | string | No | New title for the dashboard |
| `folderUid` | string | No | New folder UID to move the dashboard to |
| `tags` | string | No | Comma-separated list of new tags |
| `timezone` | string | No | Dashboard timezone \(e.g., browser, utc\) |
| `refresh` | string | No | Auto-refresh interval \(e.g., 5s, 1m, 5m\) |
| `panels` | string | No | JSON array of panel configurations |
| `overwrite` | boolean | No | Overwrite even if there is a version conflict |
| `message` | string | No | Commit message for this version |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | The numeric ID of the updated dashboard |
| `uid` | string | The UID of the updated dashboard |
| `url` | string | The URL path to the dashboard |
| `status` | string | Status of the operation \(success\) |
| `version` | number | The new version number of the dashboard |
| `slug` | string | URL-friendly slug of the dashboard |

### `grafana_delete_dashboard`

Delete a dashboard by its UID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `dashboardUid` | string | Yes | The UID of the dashboard to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `title` | string | The title of the deleted dashboard |
| `message` | string | Confirmation message |
| `id` | number | The ID of the deleted dashboard |

### `grafana_list_alert_rules`

List all alert rules in the Grafana instance

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `rules` | array | List of alert rules |

### `grafana_get_alert_rule`

Get a specific alert rule by its UID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `alertRuleUid` | string | Yes | The UID of the alert rule to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `uid` | string | Alert rule UID |
| `title` | string | Alert rule title |
| `condition` | string | Alert condition |
| `data` | json | Alert rule query data |
| `folderUID` | string | Parent folder UID |
| `ruleGroup` | string | Rule group name |
| `noDataState` | string | State when no data is returned |
| `execErrState` | string | State on execution error |
| `annotations` | json | Alert annotations |
| `labels` | json | Alert labels |

### `grafana_create_alert_rule`

Create a new alert rule

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `title` | string | Yes | The title of the alert rule |
| `folderUid` | string | Yes | The UID of the folder to create the alert in |
| `ruleGroup` | string | Yes | The name of the rule group |
| `condition` | string | Yes | The refId of the query or expression to use as the alert condition |
| `data` | string | Yes | JSON array of query/expression data objects |
| `forDuration` | string | No | Duration to wait before firing \(e.g., 5m, 1h\) |
| `noDataState` | string | No | State when no data is returned \(NoData, Alerting, OK\) |
| `execErrState` | string | No | State on execution error \(Alerting, OK\) |
| `annotations` | string | No | JSON object of annotations |
| `labels` | string | No | JSON object of labels |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `uid` | string | The UID of the created alert rule |
| `title` | string | Alert rule title |
| `folderUID` | string | Parent folder UID |
| `ruleGroup` | string | Rule group name |

### `grafana_update_alert_rule`

Update an existing alert rule. Fetches the current rule and merges your changes.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `alertRuleUid` | string | Yes | The UID of the alert rule to update |
| `title` | string | No | New title for the alert rule |
| `folderUid` | string | No | New folder UID to move the alert to |
| `ruleGroup` | string | No | New rule group name |
| `condition` | string | No | New condition refId |
| `data` | string | No | New JSON array of query/expression data objects |
| `forDuration` | string | No | Duration to wait before firing \(e.g., 5m, 1h\) |
| `noDataState` | string | No | State when no data is returned \(NoData, Alerting, OK\) |
| `execErrState` | string | No | State on execution error \(Alerting, OK\) |
| `annotations` | string | No | JSON object of annotations |
| `labels` | string | No | JSON object of labels |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `uid` | string | The UID of the updated alert rule |
| `title` | string | Alert rule title |
| `folderUID` | string | Parent folder UID |
| `ruleGroup` | string | Rule group name |

### `grafana_delete_alert_rule`

Delete an alert rule by its UID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `alertRuleUid` | string | Yes | The UID of the alert rule to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Confirmation message |

### `grafana_list_contact_points`

List all alert notification contact points

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contactPoints` | array | List of contact points |

### `grafana_create_annotation`

Create an annotation on a dashboard or as a global annotation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `text` | string | Yes | The text content of the annotation |
| `tags` | string | No | Comma-separated list of tags |
| `dashboardUid` | string | Yes | UID of the dashboard to add the annotation to |
| `panelId` | number | No | ID of the panel to add the annotation to |
| `time` | number | No | Start time in epoch milliseconds \(defaults to now\) |
| `timeEnd` | number | No | End time in epoch milliseconds \(for range annotations\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | The ID of the created annotation |
| `message` | string | Confirmation message |

### `grafana_list_annotations`

Query annotations by time range, dashboard, or tags

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `from` | number | No | Start time in epoch milliseconds |
| `to` | number | No | End time in epoch milliseconds |
| `dashboardUid` | string | Yes | Dashboard UID to query annotations from |
| `panelId` | number | No | Filter by panel ID |
| `tags` | string | No | Comma-separated list of tags to filter by |
| `type` | string | No | Filter by type \(alert or annotation\) |
| `limit` | number | No | Maximum number of annotations to return |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `annotations` | array | List of annotations |

### `grafana_update_annotation`

Update an existing annotation

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `annotationId` | number | Yes | The ID of the annotation to update |
| `text` | string | Yes | New text content for the annotation |
| `tags` | string | No | Comma-separated list of new tags |
| `time` | number | No | New start time in epoch milliseconds |
| `timeEnd` | number | No | New end time in epoch milliseconds |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | The ID of the updated annotation |
| `message` | string | Confirmation message |

### `grafana_delete_annotation`

Delete an annotation by its ID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `annotationId` | number | Yes | The ID of the annotation to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Confirmation message |

### `grafana_list_data_sources`

List all data sources configured in Grafana

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `dataSources` | array | List of data sources |

### `grafana_get_data_source`

Get a data source by its ID or UID

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `dataSourceId` | string | Yes | The ID or UID of the data source to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | Data source ID |
| `uid` | string | Data source UID |
| `name` | string | Data source name |
| `type` | string | Data source type |
| `url` | string | Data source connection URL |
| `database` | string | Database name \(if applicable\) |
| `isDefault` | boolean | Whether this is the default data source |
| `jsonData` | json | Additional data source configuration |

### `grafana_list_folders`

List all folders in Grafana

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `limit` | number | No | Maximum number of folders to return |
| `page` | number | No | Page number for pagination |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `folders` | array | List of folders |

### `grafana_create_folder`

Create a new folder in Grafana

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Grafana Service Account Token |
| `baseUrl` | string | Yes | Grafana instance URL \(e.g., https://your-grafana.com\) |
| `organizationId` | string | No | Organization ID for multi-org Grafana instances |
| `title` | string | Yes | The title of the new folder |
| `uid` | string | No | Optional UID for the folder \(auto-generated if not provided\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | number | The numeric ID of the created folder |
| `uid` | string | The UID of the created folder |
| `title` | string | The title of the created folder |
| `url` | string | The URL path to the folder |
| `hasAcl` | boolean | Whether the folder has custom ACL permissions |
| `canSave` | boolean | Whether the current user can save the folder |
| `canEdit` | boolean | Whether the current user can edit the folder |
| `canAdmin` | boolean | Whether the current user has admin rights on the folder |
| `canDelete` | boolean | Whether the current user can delete the folder |
| `createdBy` | string | Username of who created the folder |
| `created` | string | Timestamp when the folder was created |
| `updatedBy` | string | Username of who last updated the folder |
| `updated` | string | Timestamp when the folder was last updated |
| `version` | number | Version number of the folder |



## Notes

- Category: `tools`
- Type: `grafana`
```

--------------------------------------------------------------------------------

---[FILE: hubspot.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/hubspot.mdx

```text
---
title: HubSpot
description: Interact with HubSpot CRM or trigger workflows from HubSpot events
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hubspot"
  color="#FF7A59"
/>

{/* MANUAL-CONTENT-START:intro */}
[HubSpot](https://www.hubspot.com) is a comprehensive CRM platform that provides a full suite of marketing, sales, and customer service tools to help businesses grow better. With its powerful automation capabilities and extensive API, HubSpot has become one of the world's leading CRM platforms, serving businesses of all sizes across industries.

HubSpot CRM offers a complete solution for managing customer relationships, from initial contact through to long-term customer success. The platform combines contact management, deal tracking, marketing automation, and customer service tools into a unified system that helps teams stay aligned and focused on customer success.

Key features of HubSpot CRM include:

- Contact & Company Management: Comprehensive database for storing and organizing customer and prospect information
- Deal Pipeline: Visual sales pipeline for tracking opportunities through customizable stages
- Marketing Events: Track and manage marketing campaigns and events with detailed attribution
- Ticket Management: Customer support ticketing system for tracking and resolving customer issues
- Quotes & Line Items: Create and manage sales quotes with detailed product line items
- User & Team Management: Organize teams, assign ownership, and track user activity across the platform

In Sim, the HubSpot integration enables your AI agents to seamlessly interact with your CRM data and automate key business processes. This creates powerful opportunities for intelligent lead qualification, automated contact enrichment, deal management, customer support automation, and data synchronization across your tech stack. The integration allows agents to create, retrieve, update, and search across all major HubSpot objects, enabling sophisticated workflows that can respond to CRM events, maintain data quality, and ensure your team has the most up-to-date customer information. By connecting Sim with HubSpot, you can build AI agents that automatically qualify leads, route support tickets, update deal stages based on customer interactions, generate quotes, and keep your CRM data synchronized with other business systems—ultimately increasing team productivity and improving customer experiences.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate HubSpot into your workflow. Manage contacts, companies, deals, tickets, and other CRM objects with powerful automation capabilities. Can be used in trigger mode to start workflows when contacts are created, deleted, or updated.



## Tools

### `hubspot_get_users`

Retrieve all users from HubSpot account

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Number of results to return \(default: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `users` | array | Array of HubSpot user objects |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_list_contacts`

Retrieve all contacts from HubSpot account with pagination support

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Maximum number of results per page \(max 100, default 100\) |
| `after` | string | No | Pagination cursor for next page of results |
| `properties` | string | No | Comma-separated list of properties to return \(e.g., "email,firstname,lastname"\) |
| `associations` | string | No | Comma-separated list of object types to retrieve associated IDs for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contacts` | array | Array of HubSpot contact objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_get_contact`

Retrieve a single contact by ID or email from HubSpot

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Yes | The ID or email of the contact to retrieve |
| `idProperty` | string | No | Property to use as unique identifier \(e.g., "email"\). If not specified, uses record ID |
| `properties` | string | No | Comma-separated list of properties to return |
| `associations` | string | No | Comma-separated list of object types to retrieve associated IDs for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contact` | object | HubSpot contact object with properties |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_create_contact`

Create a new contact in HubSpot. Requires at least one of: email, firstname, or lastname

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `properties` | object | Yes | Contact properties as JSON object. Must include at least one of: email, firstname, or lastname |
| `associations` | array | No | Array of associations to create with the contact \(e.g., companies, deals\). Each object should have "to" \(with "id"\) and "types" \(with "associationCategory" and "associationTypeId"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contact` | object | Created HubSpot contact object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_update_contact`

Update an existing contact in HubSpot by ID or email

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | Yes | The ID or email of the contact to update |
| `idProperty` | string | No | Property to use as unique identifier \(e.g., "email"\). If not specified, uses record ID |
| `properties` | object | Yes | Contact properties to update as JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contact` | object | Updated HubSpot contact object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_search_contacts`

Search for contacts in HubSpot using filters, sorting, and queries

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | No | Array of filter groups. Each group contains filters with propertyName, operator, and value |
| `sorts` | array | No | Array of sort objects with propertyName and direction \("ASCENDING" or "DESCENDING"\) |
| `query` | string | No | Search query string |
| `properties` | array | No | Array of property names to return |
| `limit` | number | No | Maximum number of results to return \(max 100\) |
| `after` | string | No | Pagination cursor for next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contacts` | array | Array of matching HubSpot contact objects |
| `total` | number | Total number of matching contacts |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_list_companies`

Retrieve all companies from HubSpot account with pagination support

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Maximum number of results per page \(max 100, default 100\) |
| `after` | string | No | Pagination cursor for next page of results |
| `properties` | string | No | Comma-separated list of properties to return |
| `associations` | string | No | Comma-separated list of object types to retrieve associated IDs for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `companies` | array | Array of HubSpot company objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_get_company`

Retrieve a single company by ID or domain from HubSpot

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Yes | The ID or domain of the company to retrieve |
| `idProperty` | string | No | Property to use as unique identifier \(e.g., "domain"\). If not specified, uses record ID |
| `properties` | string | No | Comma-separated list of properties to return |
| `associations` | string | No | Comma-separated list of object types to retrieve associated IDs for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `company` | object | HubSpot company object with properties |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_create_company`

Create a new company in HubSpot

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `properties` | object | Yes | Company properties as JSON object \(e.g., name, domain, city, industry\) |
| `associations` | array | No | Array of associations to create with the company |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `company` | object | Created HubSpot company object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_update_company`

Update an existing company in HubSpot by ID or domain

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | Yes | The ID or domain of the company to update |
| `idProperty` | string | No | Property to use as unique identifier \(e.g., "domain"\). If not specified, uses record ID |
| `properties` | object | Yes | Company properties to update as JSON object |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `company` | object | Updated HubSpot company object |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_search_companies`

Search for companies in HubSpot using filters, sorting, and queries

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | No | Array of filter groups. Each group contains filters with propertyName, operator, and value |
| `sorts` | array | No | Array of sort objects with propertyName and direction \("ASCENDING" or "DESCENDING"\) |
| `query` | string | No | Search query string |
| `properties` | array | No | Array of property names to return |
| `limit` | number | No | Maximum number of results to return \(max 100\) |
| `after` | string | No | Pagination cursor for next page |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `companies` | array | Array of matching HubSpot company objects |
| `total` | number | Total number of matching companies |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |

### `hubspot_list_deals`

Retrieve all deals from HubSpot account with pagination support

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `limit` | string | No | Maximum number of results per page \(max 100, default 100\) |
| `after` | string | No | Pagination cursor for next page of results |
| `properties` | string | No | Comma-separated list of properties to return |
| `associations` | string | No | Comma-separated list of object types to retrieve associated IDs for |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deals` | array | Array of HubSpot deal objects |
| `paging` | object | Pagination information |
| `metadata` | object | Operation metadata |
| `success` | boolean | Operation success status |



## Notes

- Category: `tools`
- Type: `hubspot`
```

--------------------------------------------------------------------------------

---[FILE: huggingface.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/huggingface.mdx

```text
---
title: Hugging Face
description: Use Hugging Face Inference API
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="huggingface"
  color="#0B0F19"
/>

{/* MANUAL-CONTENT-START:intro */}
[HuggingFace](https://huggingface.co/) is a leading AI platform that provides access to thousands of pre-trained machine learning models and powerful inference capabilities. With its extensive model hub and robust API, HuggingFace offers comprehensive tools for both research and production AI applications.
With HuggingFace, you can:

Access pre-trained models: Utilize models for text generation, translation, image processing, and more
Generate AI completions: Create content using state-of-the-art language models through the Inference API
Natural language processing: Process and analyze text with specialized NLP models
Deploy at scale: Host and serve models for production applications
Customize models: Fine-tune existing models for specific use cases

In Sim, the HuggingFace integration enables your agents to programmatically generate completions using the HuggingFace Inference API. This allows for powerful automation scenarios such as content generation, text analysis, code completion, and creative writing. Your agents can generate completions with natural language prompts, access specialized models for different tasks, and integrate AI-generated content into workflows. This integration bridges the gap between your AI workflows and machine learning capabilities, enabling seamless AI-powered automation with one of the world's most comprehensive ML platforms.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Hugging Face into the workflow. Can generate completions using the Hugging Face Inference API.



## Tools

### `huggingface_chat`

Generate completions using Hugging Face Inference API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | No | System prompt to guide the model behavior |
| `content` | string | Yes | The user message content to send to the model |
| `provider` | string | Yes | The provider to use for the API request \(e.g., novita, cerebras, etc.\) |
| `model` | string | Yes | Model to use for chat completions \(e.g., deepseek/deepseek-v3-0324\) |
| `maxTokens` | number | No | Maximum number of tokens to generate |
| `temperature` | number | No | Sampling temperature \(0-2\). Higher values make output more random |
| `apiKey` | string | Yes | Hugging Face API token |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Chat completion results |



## Notes

- Category: `tools`
- Type: `huggingface`
```

--------------------------------------------------------------------------------

````
