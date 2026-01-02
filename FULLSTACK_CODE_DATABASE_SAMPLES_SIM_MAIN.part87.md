---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 87
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 87 of 933)

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

---[FILE: sendgrid.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/sendgrid.mdx

```text
---
title: SendGrid
description: Send emails and manage contacts, lists, and templates with SendGrid
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sendgrid"
  color="#1A82E2"
/>

{/* MANUAL-CONTENT-START:intro */}
[SendGrid](https://sendgrid.com) is a leading cloud-based email delivery platform trusted by developers and businesses to send reliable transactional and marketing emails at scale. With its robust APIs and powerful tools, SendGrid enables you to manage all aspects of your email communication, from sending notifications and receipts to managing complex marketing campaigns.

SendGrid empowers users with a full suite of email operations, allowing you to automate critical email workflows and closely manage contact lists, templates, and recipient engagement. Its seamless integration with Sim enables agents and workflows to deliver targeted messages, maintain dynamic contact and recipient lists, trigger personalized emails through templates, and track the results in real time.

Key features of SendGrid include:

- **Transactional Email:** Send automated and high-volume transactional emails (like notifications, receipts, and password resets).
- **Dynamic Templates:** Use rich HTML or text templates with dynamic data for highly personalized communication at scale.
- **Contact Management:** Add and update marketing contacts, manage recipient lists, and target segments for campaigns.
- **Attachments Support:** Include one or more file attachments in your emails.
- **Comprehensive API Coverage:** Programmatically manage emails, contacts, lists, templates, suppression groups, and more.

By connecting SendGrid with Sim, your agents can:

- Send both simple and advanced (templated or multi-recipient) emails as part of any workflow.
- Manage and segment contacts and lists automatically.
- Leverage templates for consistency and dynamic personalization.
- Track and respond to email engagement within your automated processes.

This integration allows you to automate all critical communication flows, ensure messages reach the right audience, and maintain control over your organization’s email strategy, directly from Sim workflows.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate SendGrid into your workflow. Send transactional emails, manage marketing contacts and lists, and work with email templates. Supports dynamic templates, attachments, and comprehensive contact management.



## Tools

### `sendgrid_send_mail`

Send an email using SendGrid API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `from` | string | Yes | Sender email address \(must be verified in SendGrid\) |
| `fromName` | string | No | Sender name |
| `to` | string | Yes | Recipient email address |
| `toName` | string | No | Recipient name |
| `subject` | string | No | Email subject \(required unless using a template with pre-defined subject\) |
| `content` | string | No | Email body content \(required unless using a template with pre-defined content\) |
| `contentType` | string | No | Content type \(text/plain or text/html\) |
| `cc` | string | No | CC email address |
| `bcc` | string | No | BCC email address |
| `replyTo` | string | No | Reply-to email address |
| `replyToName` | string | No | Reply-to name |
| `attachments` | file[] | No | Files to attach to the email |
| `templateId` | string | No | SendGrid template ID to use |
| `dynamicTemplateData` | json | No | JSON object of dynamic template data |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the email was sent successfully |
| `messageId` | string | SendGrid message ID |
| `to` | string | Recipient email address |
| `subject` | string | Email subject |

### `sendgrid_add_contact`

Add a new contact to SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `email` | string | Yes | Contact email address |
| `firstName` | string | No | Contact first name |
| `lastName` | string | No | Contact last name |
| `customFields` | json | No | JSON object of custom field key-value pairs \(use field IDs like e1_T, e2_N, e3_D, not field names\) |
| `listIds` | string | No | Comma-separated list IDs to add the contact to |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobId` | string | Job ID for tracking the async contact creation |
| `email` | string | Contact email address |
| `firstName` | string | Contact first name |
| `lastName` | string | Contact last name |
| `message` | string | Status message |

### `sendgrid_get_contact`

Get a specific contact by ID from SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `contactId` | string | Yes | Contact ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | Contact ID |
| `email` | string | Contact email address |
| `firstName` | string | Contact first name |
| `lastName` | string | Contact last name |
| `createdAt` | string | Creation timestamp |
| `updatedAt` | string | Last update timestamp |
| `listIds` | json | Array of list IDs the contact belongs to |
| `customFields` | json | Custom field values |

### `sendgrid_search_contacts`

Search for contacts in SendGrid using a query

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `query` | string | Yes | Search query \(e.g., \"email LIKE '%example.com%' AND CONTAINS\(list_ids, 'list-id'\)\"\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `contacts` | json | Array of matching contacts |
| `contactCount` | number | Total number of contacts found |

### `sendgrid_delete_contacts`

Delete one or more contacts from SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `contactIds` | string | Yes | Comma-separated contact IDs to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobId` | string | Job ID for the deletion request |

### `sendgrid_create_list`

Create a new contact list in SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `name` | string | Yes | List name |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | List ID |
| `name` | string | List name |
| `contactCount` | number | Number of contacts in the list |

### `sendgrid_get_list`

Get a specific list by ID from SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `listId` | string | Yes | List ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | List ID |
| `name` | string | List name |
| `contactCount` | number | Number of contacts in the list |

### `sendgrid_list_all_lists`

Get all contact lists from SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `pageSize` | number | No | Number of lists to return per page \(default: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `lists` | json | Array of lists |

### `sendgrid_delete_list`

Delete a contact list from SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `listId` | string | Yes | List ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success message |

### `sendgrid_add_contacts_to_list`

Add or update contacts and assign them to a list in SendGrid (uses PUT /v3/marketing/contacts)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `listId` | string | Yes | List ID to add contacts to |
| `contacts` | json | Yes | JSON array of contact objects. Each contact must have at least: email \(or phone_number_id/external_id/anonymous_id\). Example: \[\{"email": "user@example.com", "first_name": "John"\}\] |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobId` | string | Job ID for tracking the async operation |
| `message` | string | Status message |

### `sendgrid_remove_contacts_from_list`

Remove contacts from a specific list in SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `listId` | string | Yes | List ID |
| `contactIds` | string | Yes | Comma-separated contact IDs to remove from the list |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `jobId` | string | Job ID for the request |

### `sendgrid_create_template`

Create a new email template in SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `name` | string | Yes | Template name |
| `generation` | string | No | Template generation type \(legacy or dynamic, default: dynamic\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | Template ID |
| `name` | string | Template name |
| `generation` | string | Template generation |
| `updatedAt` | string | Last update timestamp |
| `versions` | json | Array of template versions |

### `sendgrid_get_template`

Get a specific template by ID from SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `templateId` | string | Yes | Template ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | Template ID |
| `name` | string | Template name |
| `generation` | string | Template generation |
| `updatedAt` | string | Last update timestamp |
| `versions` | json | Array of template versions |

### `sendgrid_list_templates`

Get all email templates from SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `generations` | string | No | Filter by generation \(legacy, dynamic, or both\) |
| `pageSize` | number | No | Number of templates to return per page \(default: 20\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `templates` | json | Array of templates |

### `sendgrid_delete_template`

Delete an email template from SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `templateId` | string | Yes | Template ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `message` | string | Status or success message |
| `messageId` | string | Email message ID \(send_mail\) |
| `to` | string | Recipient email address \(send_mail\) |
| `subject` | string | Email subject \(send_mail, create_template_version\) |
| `id` | string | Resource ID |
| `jobId` | string | Job ID for async operations |
| `email` | string | Contact email address |
| `firstName` | string | Contact first name |
| `lastName` | string | Contact last name |
| `createdAt` | string | Creation timestamp |
| `updatedAt` | string | Last update timestamp |
| `listIds` | json | Array of list IDs the contact belongs to |
| `customFields` | json | Custom field values |
| `contacts` | json | Array of contacts |
| `contactCount` | number | Number of contacts |
| `lists` | json | Array of lists |
| `name` | string | Resource name |
| `templates` | json | Array of templates |
| `generation` | string | Template generation |
| `versions` | json | Array of template versions |
| `templateId` | string | Template ID |
| `active` | boolean | Whether template version is active |
| `htmlContent` | string | HTML content |
| `plainContent` | string | Plain text content |

### `sendgrid_create_template_version`

Create a new version of an email template in SendGrid

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | SendGrid API key |
| `templateId` | string | Yes | Template ID |
| `name` | string | Yes | Version name |
| `subject` | string | Yes | Email subject line |
| `htmlContent` | string | No | HTML content of the template |
| `plainContent` | string | No | Plain text content of the template |
| `active` | boolean | No | Whether this version is active \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id` | string | Version ID |
| `templateId` | string | Template ID |
| `name` | string | Version name |
| `subject` | string | Email subject |
| `active` | boolean | Whether this version is active |
| `htmlContent` | string | HTML content |
| `plainContent` | string | Plain text content |
| `updatedAt` | string | Last update timestamp |



## Notes

- Category: `tools`
- Type: `sendgrid`
```

--------------------------------------------------------------------------------

---[FILE: sentry.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/sentry.mdx

```text
---
title: Sentry
description: Manage Sentry issues, projects, events, and releases
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sentry"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
Supercharge your error monitoring and application reliability with [Sentry](https://sentry.io/) — the industry-leading platform for real-time error tracking, performance monitoring, and release management. Seamlessly integrate Sentry into your automated agent workflows to easily monitor issues, track critical events, manage projects, and orchestrate releases across all your applications and services.

With the Sentry tool, you can:

- **Monitor and triage issues**: Fetch comprehensive lists of issues using the `sentry_issues_list` operation and retrieve detailed information on individual errors and bugs via `sentry_issues_get`. Instantly access metadata, tags, stack traces, and statistics to reduce mean time to resolution.
- **Track event data**: Analyze specific error and event instances with `sentry_events_list` and `sentry_events_get`, providing deep insight into error occurrences and user impact.
- **Manage projects and teams**: Use `sentry_projects_list` and `sentry_project_get` to enumerate and review all your Sentry projects, ensuring smooth team collaboration and centralized configuration.
- **Coordinate releases**: Automate version tracking, deployment health, and change management across your codebase with operations like `sentry_releases_list`, `sentry_release_get`, and more.
- **Gain powerful application insights**: Leverage advanced filters and queries to find unresolved or high-priority issues, aggregate event statistics over time, and track regressions as your codebase evolves.

Sentry's integration empowers engineering and DevOps teams to detect issues early, prioritize the most impactful bugs, and continuously improve application health across development stacks. Programmatically orchestrate workflow automation for modern observability, incident response, and release lifecycle management—reducing downtime and increasing user satisfaction.

**Key Sentry operations available**:
- `sentry_issues_list`: List Sentry issues for organizations and projects, with powerful search and filtering.
- `sentry_issues_get`: Retrieve detailed information for a specific Sentry issue.
- `sentry_events_list`: Enumerate the events for a particular issue for root-cause analysis.
- `sentry_events_get`: Get full detail on an individual event, including stack traces, context, and metadata.
- `sentry_projects_list`: List all Sentry projects within your organization.
- `sentry_project_get`: Retrieve configuration and details for a specific project.
- `sentry_releases_list`: List recent releases and their deployment status.
- `sentry_release_get`: Retrieve detailed release information, including associated commits and issues.

Whether you're proactively managing app health, troubleshooting production errors, or automating release workflows, Sentry equips you with world-class monitoring, actionable alerts, and seamless DevOps integration. Boost your software quality and search visibility by leveraging Sentry for error tracking, observability, and release management—all from your agentic workflows.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Sentry into the workflow. Monitor issues, manage projects, track events, and coordinate releases across your applications.



## Tools

### `sentry_issues_list`

List issues from Sentry for a specific organization and optionally a specific project. Returns issue details including status, error counts, and last seen timestamps.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `projectSlug` | string | No | Filter issues by specific project slug \(optional\) |
| `query` | string | No | Search query to filter issues. Supports Sentry search syntax \(e.g., "is:unresolved", "level:error"\) |
| `statsPeriod` | string | No | Time period for stats \(e.g., "24h", "7d", "30d"\). Defaults to 24h if not specified. |
| `cursor` | string | No | Pagination cursor for retrieving next page of results |
| `limit` | number | No | Number of issues to return per page \(default: 25, max: 100\) |
| `status` | string | No | Filter by issue status: unresolved, resolved, ignored, or muted |
| `sort` | string | No | Sort order: date, new, freq, priority, or user \(default: date\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `issues` | array | List of Sentry issues |

### `sentry_issues_get`

Retrieve detailed information about a specific Sentry issue by its ID. Returns complete issue details including metadata, tags, and statistics.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `issueId` | string | Yes | The unique ID of the issue to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `issue` | object | Detailed information about the Sentry issue |

### `sentry_issues_update`

Update a Sentry issue by changing its status, assignment, bookmark state, or other properties. Returns the updated issue details.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `issueId` | string | Yes | The unique ID of the issue to update |
| `status` | string | No | New status for the issue: resolved, unresolved, ignored, or resolvedInNextRelease |
| `assignedTo` | string | No | User ID or email to assign the issue to. Use empty string to unassign. |
| `isBookmarked` | boolean | No | Whether to bookmark the issue |
| `isSubscribed` | boolean | No | Whether to subscribe to issue updates |
| `isPublic` | boolean | No | Whether the issue should be publicly visible |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `issue` | object | The updated Sentry issue |

### `sentry_projects_list`

List all projects in a Sentry organization. Returns project details including name, platform, teams, and configuration.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `cursor` | string | No | Pagination cursor for retrieving next page of results |
| `limit` | number | No | Number of projects to return per page \(default: 25, max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `projects` | array | List of Sentry projects |

### `sentry_projects_get`

Retrieve detailed information about a specific Sentry project by its slug. Returns complete project details including teams, features, and configuration.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `projectSlug` | string | Yes | The ID or slug of the project to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `project` | object | Detailed information about the Sentry project |

### `sentry_projects_create`

Create a new Sentry project in an organization. Requires a team to associate the project with. Returns the created project details.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `name` | string | Yes | The name of the project |
| `teamSlug` | string | Yes | The slug of the team that will own this project |
| `slug` | string | No | URL-friendly project identifier \(auto-generated from name if not provided\) |
| `platform` | string | No | Platform/language for the project \(e.g., javascript, python, node, react-native\). If not specified, defaults to "other" |
| `defaultRules` | boolean | No | Whether to create default alert rules \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `project` | object | The newly created Sentry project |

### `sentry_projects_update`

Update a Sentry project by changing its name, slug, platform, or other settings. Returns the updated project details.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `projectSlug` | string | Yes | The slug of the project to update |
| `name` | string | No | New name for the project |
| `slug` | string | No | New URL-friendly project identifier |
| `platform` | string | No | New platform/language for the project \(e.g., javascript, python, node\) |
| `isBookmarked` | boolean | No | Whether to bookmark the project |
| `digestsMinDelay` | number | No | Minimum delay \(in seconds\) for digest notifications |
| `digestsMaxDelay` | number | No | Maximum delay \(in seconds\) for digest notifications |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `project` | object | The updated Sentry project |

### `sentry_events_list`

List events from a Sentry project. Can be filtered by issue ID, query, or time period. Returns event details including context, tags, and user information.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `projectSlug` | string | Yes | The slug of the project to list events from |
| `issueId` | string | No | Filter events by a specific issue ID |
| `query` | string | No | Search query to filter events. Supports Sentry search syntax \(e.g., "user.email:*@example.com"\) |
| `cursor` | string | No | Pagination cursor for retrieving next page of results |
| `limit` | number | No | Number of events to return per page \(default: 50, max: 100\) |
| `statsPeriod` | string | No | Time period to query \(e.g., "24h", "7d", "30d"\). Defaults to 90d if not specified. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `events` | array | List of Sentry events |

### `sentry_events_get`

Retrieve detailed information about a specific Sentry event by its ID. Returns complete event details including stack traces, breadcrumbs, context, and user information.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `projectSlug` | string | Yes | The slug of the project |
| `eventId` | string | Yes | The unique ID of the event to retrieve |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `event` | object | Detailed information about the Sentry event |

### `sentry_releases_list`

List releases for a Sentry organization or project. Returns release details including version, commits, deploy information, and associated projects.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `projectSlug` | string | No | Filter releases by specific project slug \(optional\) |
| `query` | string | No | Search query to filter releases \(e.g., version name pattern\) |
| `cursor` | string | No | Pagination cursor for retrieving next page of results |
| `limit` | number | No | Number of releases to return per page \(default: 25, max: 100\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `releases` | array | List of Sentry releases |

### `sentry_releases_create`

Create a new release in Sentry. A release is a version of your code deployed to an environment. Can include commit information and associated projects. Returns the created release details.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `version` | string | Yes | Version identifier for the release \(e.g., "2.0.0", "my-app@1.0.0", or a git commit SHA\) |
| `projects` | string | Yes | Comma-separated list of project slugs to associate with this release |
| `ref` | string | No | Git reference \(commit SHA, tag, or branch\) for this release |
| `url` | string | No | URL pointing to the release \(e.g., GitHub release page\) |
| `dateReleased` | string | No | ISO 8601 timestamp for when the release was deployed \(defaults to current time\) |
| `commits` | string | No | JSON array of commit objects with id, repository \(optional\), and message \(optional\). Example: \[\{"id":"abc123","message":"Fix bug"\}\] |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `release` | object | The newly created Sentry release |

### `sentry_releases_deploy`

Create a deploy record for a Sentry release in a specific environment. Deploys track when and where releases are deployed. Returns the created deploy details.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | Yes | Sentry API authentication token |
| `organizationSlug` | string | Yes | The slug of the organization |
| `version` | string | Yes | Version identifier of the release being deployed |
| `environment` | string | Yes | Environment name where the release is being deployed \(e.g., "production", "staging"\) |
| `name` | string | No | Optional name for this deploy \(e.g., "Deploy v2.0 to Production"\) |
| `url` | string | No | URL pointing to the deploy \(e.g., CI/CD pipeline URL\) |
| `dateStarted` | string | No | ISO 8601 timestamp for when the deploy started \(defaults to current time\) |
| `dateFinished` | string | No | ISO 8601 timestamp for when the deploy finished |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `deploy` | object | The newly created deploy record |



## Notes

- Category: `tools`
- Type: `sentry`
```

--------------------------------------------------------------------------------

---[FILE: serper.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/serper.mdx

```text
---
title: Serper
description: Search the web using Serper
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="serper"
  color="#2B3543"
/>

{/* MANUAL-CONTENT-START:intro */}
[Serper](https://www.serper.com/) is a Google Search API that provides developers with programmatic access to Google search results. It offers a reliable, high-performance way to integrate Google search capabilities into applications without the complexity of web scraping or the limitations of other search APIs.

With Serper, you can:

- **Access Google search results**: Get structured data from Google search results programmatically
- **Perform different search types**: Run web searches, image searches, news searches, and more
- **Retrieve rich metadata**: Obtain titles, snippets, URLs, and other relevant information from search results
- **Scale your applications**: Build search-powered features with a reliable and fast API
- **Avoid rate limiting**: Get consistent access to search results without worrying about IP blocks

In Sim, the Serper integration enables your agents to leverage the power of web search as part of their workflows. This allows for sophisticated automation scenarios that require up-to-date information from the internet. Your agents can formulate search queries, retrieve relevant results, and use this information to make decisions or provide responses. This integration bridges the gap between your workflow automation and the vast knowledge available on the web, enabling your agents to access real-time information without manual intervention. By connecting Sim with Serper, you can create agents that stay current with the latest information, provide more accurate responses, and deliver more value to users.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Serper into the workflow. Can search the web.



## Tools

### `serper_search`

A powerful web search tool that provides access to Google search results through Serper.dev API. Supports different types of searches including regular web search, news, places, and images, with each result containing relevant metadata like titles, URLs, snippets, and type-specific information.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | The search query |
| `num` | number | No | Number of results to return |
| `gl` | string | No | Country code for search results |
| `hl` | string | No | Language code for search results |
| `type` | string | No | Type of search to perform |
| `apiKey` | string | Yes | Serper API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `searchResults` | array | Search results with titles, links, snippets, and type-specific metadata \(date for news, rating for places, imageUrl for images\) |



## Notes

- Category: `tools`
- Type: `serper`
```

--------------------------------------------------------------------------------

---[FILE: servicenow.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/servicenow.mdx

```text
---
title: ServiceNow
description: Create, read, update, and delete ServiceNow records
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="servicenow"
  color="#032D42"
/>

{/* MANUAL-CONTENT-START:intro */}
[ServiceNow](https://www.servicenow.com/) is a powerful cloud platform designed to streamline and automate IT service management (ITSM), workflows, and business processes across your organization. ServiceNow enables you to manage incidents, requests, tasks, users, and more using its extensive API.

With ServiceNow, you can:

- **Automate IT workflows**: Create, read, update, and delete records in any ServiceNow table, such as incidents, tasks, change requests, and users.
- **Integrate systems**: Connect ServiceNow with your other tools and processes for seamless automation.
- **Maintain a single source of truth**: Keep all your service and operations data organized and accessible.
- **Drive operational efficiency**: Reduce manual work and improve service quality with customizable workflows and automation.

In Sim, the ServiceNow integration enables your agents to interact directly with your ServiceNow instance as part of their workflows. Agents can create, read, update, or delete records in any ServiceNow table and leverage ticket or user data for sophisticated automation and decision-making. This integration bridges your workflow automation and IT operations, empowering your agents to manage service requests, incidents, users, and assets without manual intervention. By connecting Sim with ServiceNow, you can automate service management tasks, improve response times, and ensure consistent, secure access to your organization's vital service data.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate ServiceNow into your workflow. Create, read, update, and delete records in any ServiceNow table including incidents, tasks, change requests, users, and more.



## Tools

### `servicenow_create_record`

Create a new record in a ServiceNow table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Yes | ServiceNow instance URL \(e.g., https://instance.service-now.com\) |
| `username` | string | Yes | ServiceNow username |
| `password` | string | Yes | ServiceNow password |
| `tableName` | string | Yes | Table name \(e.g., incident, task, sys_user\) |
| `fields` | json | Yes | Fields to set on the record \(JSON object\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `record` | json | Created ServiceNow record with sys_id and other fields |
| `metadata` | json | Operation metadata |

### `servicenow_read_record`

Read records from a ServiceNow table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Yes | ServiceNow instance URL \(e.g., https://instance.service-now.com\) |
| `username` | string | Yes | ServiceNow username |
| `password` | string | Yes | ServiceNow password |
| `tableName` | string | Yes | Table name |
| `sysId` | string | No | Specific record sys_id |
| `number` | string | No | Record number \(e.g., INC0010001\) |
| `query` | string | No | Encoded query string \(e.g., "active=true^priority=1"\) |
| `limit` | number | No | Maximum number of records to return |
| `fields` | string | No | Comma-separated list of fields to return |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `records` | array | Array of ServiceNow records |
| `metadata` | json | Operation metadata |

### `servicenow_update_record`

Update an existing record in a ServiceNow table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Yes | ServiceNow instance URL \(e.g., https://instance.service-now.com\) |
| `username` | string | Yes | ServiceNow username |
| `password` | string | Yes | ServiceNow password |
| `tableName` | string | Yes | Table name |
| `sysId` | string | Yes | Record sys_id to update |
| `fields` | json | Yes | Fields to update \(JSON object\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `record` | json | Updated ServiceNow record |
| `metadata` | json | Operation metadata |

### `servicenow_delete_record`

Delete a record from a ServiceNow table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | Yes | ServiceNow instance URL \(e.g., https://instance.service-now.com\) |
| `username` | string | Yes | ServiceNow username |
| `password` | string | Yes | ServiceNow password |
| `tableName` | string | Yes | Table name |
| `sysId` | string | Yes | Record sys_id to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Whether the deletion was successful |
| `metadata` | json | Operation metadata |



## Notes

- Category: `tools`
- Type: `servicenow`
```

--------------------------------------------------------------------------------

````
