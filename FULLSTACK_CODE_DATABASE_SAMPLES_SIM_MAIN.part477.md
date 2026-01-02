---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 477
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 477 of 933)

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

---[FILE: pipedrive.ts]---
Location: sim-main/apps/sim/blocks/blocks/pipedrive.ts

```typescript
import { PipedriveIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { PipedriveResponse } from '@/tools/pipedrive/types'

export const PipedriveBlock: BlockConfig<PipedriveResponse> = {
  type: 'pipedrive',
  name: 'Pipedrive',
  description: 'Interact with Pipedrive CRM',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Pipedrive into your workflow. Manage deals, contacts, sales pipeline, projects, activities, files, and communications with powerful CRM capabilities.',
  docsLink: 'https://docs.sim.ai/tools/pipedrive',
  category: 'tools',
  bgColor: '#2E6936',
  icon: PipedriveIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get All Deals', id: 'get_all_deals' },
        { label: 'Get Deal', id: 'get_deal' },
        { label: 'Create Deal', id: 'create_deal' },
        { label: 'Update Deal', id: 'update_deal' },
        { label: 'Get Files', id: 'get_files' },
        { label: 'Get Mail Threads', id: 'get_mail_messages' },
        { label: 'Get Mail Thread Messages', id: 'get_mail_thread' },
        { label: 'Get Pipelines', id: 'get_pipelines' },
        { label: 'Get Pipeline Deals', id: 'get_pipeline_deals' },
        { label: 'Get Projects', id: 'get_projects' },
        { label: 'Create Project', id: 'create_project' },
        { label: 'Get Activities', id: 'get_activities' },
        { label: 'Create Activity', id: 'create_activity' },
        { label: 'Update Activity', id: 'update_activity' },
        { label: 'Get Leads', id: 'get_leads' },
        { label: 'Create Lead', id: 'create_lead' },
        { label: 'Update Lead', id: 'update_lead' },
        { label: 'Delete Lead', id: 'delete_lead' },
      ],
      value: () => 'get_all_deals',
    },
    {
      id: 'credential',
      title: 'Pipedrive Account',
      type: 'oauth-input',
      serviceId: 'pipedrive',
      requiredScopes: [
        'base',
        'deals:full',
        'contacts:full',
        'leads:full',
        'activities:full',
        'mail:full',
        'projects:full',
      ],
      placeholder: 'Select Pipedrive account',
      required: true,
    },
    {
      id: 'status',
      title: 'Status',
      type: 'dropdown',
      options: [
        { label: 'All (not deleted)', id: '' },
        { label: 'Open', id: 'open' },
        { label: 'Won', id: 'won' },
        { label: 'Lost', id: 'lost' },
      ],
      value: () => '',
      condition: { field: 'operation', value: ['get_all_deals'] },
    },
    {
      id: 'person_id',
      title: 'Person ID',
      type: 'short-input',
      placeholder: 'Filter by person ID',
      condition: { field: 'operation', value: ['get_all_deals'] },
    },
    {
      id: 'org_id',
      title: 'Organization ID',
      type: 'short-input',
      placeholder: 'Filter by organization ID',
      condition: { field: 'operation', value: ['get_all_deals'] },
    },
    {
      id: 'pipeline_id',
      title: 'Pipeline ID',
      type: 'short-input',
      placeholder: 'Filter by pipeline ID ',
      condition: { field: 'operation', value: ['get_all_deals'] },
    },
    {
      id: 'updated_since',
      title: 'Updated Since',
      type: 'short-input',
      placeholder: 'Date (2025-01-01T10:20:00Z)',
      condition: { field: 'operation', value: ['get_all_deals'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (default 100, max 500)',
      condition: { field: 'operation', value: ['get_all_deals'] },
    },
    {
      id: 'deal_id',
      title: 'Deal ID',
      type: 'short-input',
      placeholder: 'Enter deal ID',
      required: true,
      condition: { field: 'operation', value: ['get_deal', 'update_deal'] },
    },
    {
      id: 'title',
      title: 'Title',
      type: 'short-input',
      placeholder: 'Enter deal title',
      required: true,
      condition: { field: 'operation', value: ['create_deal'] },
    },
    {
      id: 'value',
      title: 'Value',
      type: 'short-input',
      placeholder: 'Monetary value ',
      condition: { field: 'operation', value: ['create_deal', 'update_deal'] },
    },
    {
      id: 'currency',
      title: 'Currency',
      type: 'short-input',
      placeholder: 'Currency code (e.g., USD, EUR)',
      condition: { field: 'operation', value: ['create_deal'] },
    },
    {
      id: 'person_id',
      title: 'Person ID',
      type: 'short-input',
      placeholder: 'Associated person ID ',
      condition: { field: 'operation', value: ['create_deal'] },
    },
    {
      id: 'org_id',
      title: 'Organization ID',
      type: 'short-input',
      placeholder: 'Associated organization ID ',
      condition: { field: 'operation', value: ['create_deal'] },
    },
    {
      id: 'pipeline_id',
      title: 'Pipeline ID',
      type: 'short-input',
      placeholder: 'Pipeline ID ',
      condition: { field: 'operation', value: ['create_deal'] },
    },
    {
      id: 'stage_id',
      title: 'Stage ID',
      type: 'short-input',
      placeholder: 'Stage ID ',
      condition: { field: 'operation', value: ['create_deal', 'update_deal'] },
    },
    {
      id: 'status',
      title: 'Status',
      type: 'dropdown',
      options: [
        { label: 'Open', id: 'open' },
        { label: 'Won', id: 'won' },
        { label: 'Lost', id: 'lost' },
      ],
      value: () => 'open',
      condition: { field: 'operation', value: ['create_deal', 'update_deal'] },
    },
    {
      id: 'expected_close_date',
      title: 'Expected Close Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD ',
      condition: { field: 'operation', value: ['create_deal', 'update_deal'] },
    },
    {
      id: 'title',
      title: 'New Title',
      type: 'short-input',
      placeholder: 'New deal title ',
      condition: { field: 'operation', value: ['update_deal'] },
    },
    {
      id: 'deal_id',
      title: 'Deal ID',
      type: 'short-input',
      placeholder: 'Filter by deal ID ',
      condition: { field: 'operation', value: ['get_files'] },
    },
    {
      id: 'person_id',
      title: 'Person ID',
      type: 'short-input',
      placeholder: 'Filter by person ID ',
      condition: { field: 'operation', value: ['get_files'] },
    },
    {
      id: 'org_id',
      title: 'Organization ID',
      type: 'short-input',
      placeholder: 'Filter by organization ID ',
      condition: { field: 'operation', value: ['get_files'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (default 100, max 500)',
      condition: { field: 'operation', value: ['get_files'] },
    },
    {
      id: 'folder',
      title: 'Folder',
      type: 'dropdown',
      options: [
        { label: 'Inbox', id: 'inbox' },
        { label: 'Drafts', id: 'drafts' },
        { label: 'Sent', id: 'sent' },
        { label: 'Archive', id: 'archive' },
      ],
      value: () => 'inbox',
      condition: { field: 'operation', value: ['get_mail_messages'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (default 50)',
      condition: { field: 'operation', value: ['get_mail_messages'] },
    },
    {
      id: 'thread_id',
      title: 'Thread ID',
      type: 'short-input',
      placeholder: 'Enter mail thread ID',
      required: true,
      condition: { field: 'operation', value: ['get_mail_thread'] },
    },
    {
      id: 'sort_by',
      title: 'Sort By',
      type: 'dropdown',
      options: [
        { label: 'ID', id: 'id' },
        { label: 'Update Time', id: 'update_time' },
        { label: 'Add Time', id: 'add_time' },
      ],
      value: () => 'id',
      condition: { field: 'operation', value: ['get_pipelines'] },
    },
    {
      id: 'sort_direction',
      title: 'Sort Direction',
      type: 'dropdown',
      options: [
        { label: 'Ascending', id: 'asc' },
        { label: 'Descending', id: 'desc' },
      ],
      value: () => 'asc',
      condition: { field: 'operation', value: ['get_pipelines'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (default 100, max 500)',
      condition: { field: 'operation', value: ['get_pipelines'] },
    },
    {
      id: 'cursor',
      title: 'Cursor',
      type: 'short-input',
      placeholder: 'Pagination cursor (optional)',
      condition: { field: 'operation', value: ['get_pipelines'] },
    },
    {
      id: 'pipeline_id',
      title: 'Pipeline ID',
      type: 'short-input',
      placeholder: 'Enter pipeline ID',
      required: true,
      condition: { field: 'operation', value: ['get_pipeline_deals'] },
    },
    {
      id: 'stage_id',
      title: 'Stage ID',
      type: 'short-input',
      placeholder: 'Filter by stage ID ',
      condition: { field: 'operation', value: ['get_pipeline_deals'] },
    },
    {
      id: 'status',
      title: 'Status',
      type: 'dropdown',
      options: [
        { label: 'All', id: '' },
        { label: 'Open', id: 'open' },
        { label: 'Won', id: 'won' },
        { label: 'Lost', id: 'lost' },
      ],
      value: () => '',
      condition: { field: 'operation', value: ['get_pipeline_deals'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (default 100, max 500)',
      condition: { field: 'operation', value: ['get_pipeline_deals'] },
    },
    {
      id: 'project_id',
      title: 'Project ID',
      type: 'short-input',
      placeholder: 'Project ID',
      condition: { field: 'operation', value: ['get_projects'] },
    },
    {
      id: 'status',
      title: 'Status',
      type: 'dropdown',
      options: [
        { label: 'All', id: '' },
        { label: 'Open', id: 'open' },
        { label: 'Completed', id: 'completed' },
      ],
      value: () => '',
      condition: { field: 'operation', value: ['get_projects'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (default 100, max 500)',
      condition: { field: 'operation', value: ['get_projects'] },
    },
    {
      id: 'title',
      title: 'Title',
      type: 'short-input',
      placeholder: 'Enter project title',
      required: true,
      condition: { field: 'operation', value: ['create_project'] },
    },
    {
      id: 'description',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Project description ',
      condition: { field: 'operation', value: ['create_project'] },
    },
    {
      id: 'start_date',
      title: 'Start Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD ',
      condition: { field: 'operation', value: ['create_project'] },
    },
    {
      id: 'end_date',
      title: 'End Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD ',
      condition: { field: 'operation', value: ['create_project'] },
    },
    {
      id: 'deal_id',
      title: 'Deal ID',
      type: 'short-input',
      placeholder: 'Filter by deal ID ',
      condition: { field: 'operation', value: ['get_activities', 'create_activity'] },
    },
    {
      id: 'person_id',
      title: 'Person ID',
      type: 'short-input',
      placeholder: 'Filter by person ID ',
      condition: { field: 'operation', value: ['get_activities', 'create_activity'] },
    },
    {
      id: 'org_id',
      title: 'Organization ID',
      type: 'short-input',
      placeholder: 'Filter by organization ID ',
      condition: { field: 'operation', value: ['get_activities', 'create_activity'] },
    },
    {
      id: 'type',
      title: 'Activity Type',
      type: 'dropdown',
      options: [
        { label: 'All', id: '' },
        { label: 'Call', id: 'call' },
        { label: 'Meeting', id: 'meeting' },
        { label: 'Task', id: 'task' },
        { label: 'Deadline', id: 'deadline' },
        { label: 'Email', id: 'email' },
        { label: 'Lunch', id: 'lunch' },
      ],
      value: () => '',
      condition: { field: 'operation', value: ['get_activities'] },
    },
    {
      id: 'done',
      title: 'Completion Status',
      type: 'dropdown',
      options: [
        { label: 'All', id: '' },
        { label: 'Not Done', id: '0' },
        { label: 'Done', id: '1' },
      ],
      value: () => '',
      condition: { field: 'operation', value: ['get_activities'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (default 100, max 500)',
      condition: { field: 'operation', value: ['get_activities'] },
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Activity subject/title',
      required: true,
      condition: { field: 'operation', value: ['create_activity', 'update_activity'] },
    },
    {
      id: 'type',
      title: 'Activity Type',
      type: 'dropdown',
      options: [
        { label: 'Call', id: 'call' },
        { label: 'Meeting', id: 'meeting' },
        { label: 'Task', id: 'task' },
        { label: 'Deadline', id: 'deadline' },
        { label: 'Email', id: 'email' },
        { label: 'Lunch', id: 'lunch' },
      ],
      value: () => 'task',
      required: true,
      condition: { field: 'operation', value: ['create_activity'] },
    },
    {
      id: 'due_date',
      title: 'Due Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD',
      required: true,
      condition: { field: 'operation', value: ['create_activity', 'update_activity'] },
    },
    {
      id: 'due_time',
      title: 'Due Time',
      type: 'short-input',
      placeholder: 'HH:MM ',
      condition: { field: 'operation', value: ['create_activity', 'update_activity'] },
    },
    {
      id: 'duration',
      title: 'Duration',
      type: 'short-input',
      placeholder: 'HH:MM ',
      condition: { field: 'operation', value: ['create_activity', 'update_activity'] },
    },
    {
      id: 'note',
      title: 'Notes',
      type: 'long-input',
      placeholder: 'Activity notes ',
      condition: { field: 'operation', value: ['create_activity', 'update_activity'] },
    },
    {
      id: 'activity_id',
      title: 'Activity ID',
      type: 'short-input',
      placeholder: 'Enter activity ID',
      required: true,
      condition: { field: 'operation', value: ['update_activity'] },
    },
    {
      id: 'done',
      title: 'Mark as Done',
      type: 'dropdown',
      options: [
        { label: 'Not Done', id: '0' },
        { label: 'Done', id: '1' },
      ],
      value: () => '0',
      condition: { field: 'operation', value: ['update_activity'] },
    },
    {
      id: 'lead_id',
      title: 'Lead ID',
      type: 'short-input',
      placeholder: 'Lead ID',
      condition: { field: 'operation', value: ['get_leads', 'update_lead', 'delete_lead'] },
    },
    {
      id: 'archived',
      title: 'Archived',
      type: 'dropdown',
      options: [
        { label: 'Active Leads', id: 'false' },
        { label: 'Archived Leads', id: 'true' },
      ],
      value: () => 'false',
      condition: { field: 'operation', value: ['get_leads'] },
    },
    {
      id: 'title',
      title: 'Title',
      type: 'short-input',
      placeholder: 'Enter lead title',
      required: true,
      condition: { field: 'operation', value: ['create_lead'] },
    },
    {
      id: 'title',
      title: 'New Title',
      type: 'short-input',
      placeholder: 'New lead title',
      condition: { field: 'operation', value: ['update_lead'] },
    },
    {
      id: 'person_id',
      title: 'Person ID',
      type: 'short-input',
      placeholder: 'Person ID to link lead to',
      condition: { field: 'operation', value: ['create_lead', 'update_lead', 'get_leads'] },
    },
    {
      id: 'organization_id',
      title: 'Organization ID',
      type: 'short-input',
      placeholder: 'Organization ID to link lead to',
      condition: { field: 'operation', value: ['create_lead', 'update_lead', 'get_leads'] },
    },
    {
      id: 'owner_id',
      title: 'Owner ID',
      type: 'short-input',
      placeholder: 'Owner user ID',
      condition: { field: 'operation', value: ['create_lead', 'update_lead', 'get_leads'] },
    },
    {
      id: 'value_amount',
      title: 'Value Amount',
      type: 'short-input',
      placeholder: 'Potential value amount',
      condition: { field: 'operation', value: ['create_lead', 'update_lead'] },
    },
    {
      id: 'value_currency',
      title: 'Value Currency',
      type: 'short-input',
      placeholder: 'Currency code (e.g., USD, EUR)',
      condition: { field: 'operation', value: ['create_lead', 'update_lead'] },
    },
    {
      id: 'expected_close_date',
      title: 'Expected Close Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD',
      condition: { field: 'operation', value: ['create_lead', 'update_lead'] },
    },
    {
      id: 'is_archived',
      title: 'Archive Lead',
      type: 'dropdown',
      options: [
        { label: 'No', id: 'false' },
        { label: 'Yes', id: 'true' },
      ],
      value: () => 'false',
      condition: { field: 'operation', value: ['update_lead'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (default 100)',
      condition: { field: 'operation', value: ['get_leads'] },
    },
  ],
  tools: {
    access: [
      'pipedrive_get_all_deals',
      'pipedrive_get_deal',
      'pipedrive_create_deal',
      'pipedrive_update_deal',
      'pipedrive_get_files',
      'pipedrive_get_mail_messages',
      'pipedrive_get_mail_thread',
      'pipedrive_get_pipelines',
      'pipedrive_get_pipeline_deals',
      'pipedrive_get_projects',
      'pipedrive_create_project',
      'pipedrive_get_activities',
      'pipedrive_create_activity',
      'pipedrive_update_activity',
      'pipedrive_get_leads',
      'pipedrive_create_lead',
      'pipedrive_update_lead',
      'pipedrive_delete_lead',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'get_all_deals':
            return 'pipedrive_get_all_deals'
          case 'get_deal':
            return 'pipedrive_get_deal'
          case 'create_deal':
            return 'pipedrive_create_deal'
          case 'update_deal':
            return 'pipedrive_update_deal'
          case 'get_files':
            return 'pipedrive_get_files'
          case 'get_mail_messages':
            return 'pipedrive_get_mail_messages'
          case 'get_mail_thread':
            return 'pipedrive_get_mail_thread'
          case 'get_pipelines':
            return 'pipedrive_get_pipelines'
          case 'get_pipeline_deals':
            return 'pipedrive_get_pipeline_deals'
          case 'get_projects':
            return 'pipedrive_get_projects'
          case 'create_project':
            return 'pipedrive_create_project'
          case 'get_activities':
            return 'pipedrive_get_activities'
          case 'create_activity':
            return 'pipedrive_create_activity'
          case 'update_activity':
            return 'pipedrive_update_activity'
          case 'get_leads':
            return 'pipedrive_get_leads'
          case 'create_lead':
            return 'pipedrive_create_lead'
          case 'update_lead':
            return 'pipedrive_update_lead'
          case 'delete_lead':
            return 'pipedrive_delete_lead'
          default:
            throw new Error(`Unknown operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, operation, ...rest } = params

        const cleanParams: Record<string, any> = {
          credential,
        }

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            cleanParams[key] = value
          }
        })

        return cleanParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Pipedrive access token' },
    deal_id: { type: 'string', description: 'Deal ID' },
    title: { type: 'string', description: 'Title' },
    value: { type: 'string', description: 'Monetary value' },
    currency: { type: 'string', description: 'Currency code' },
    person_id: { type: 'string', description: 'Person ID' },
    org_id: { type: 'string', description: 'Organization ID' },
    pipeline_id: { type: 'string', description: 'Pipeline ID' },
    stage_id: { type: 'string', description: 'Stage ID' },
    status: { type: 'string', description: 'Status' },
    expected_close_date: { type: 'string', description: 'Expected close date' },
    updated_since: { type: 'string', description: 'Updated since timestamp' },
    limit: { type: 'string', description: 'Result limit' },
    folder: { type: 'string', description: 'Mail folder' },
    thread_id: { type: 'string', description: 'Mail thread ID' },
    sort_by: { type: 'string', description: 'Field to sort by' },
    sort_direction: { type: 'string', description: 'Sorting direction' },
    cursor: { type: 'string', description: 'Pagination cursor' },
    project_id: { type: 'string', description: 'Project ID' },
    description: { type: 'string', description: 'Description' },
    start_date: { type: 'string', description: 'Start date' },
    end_date: { type: 'string', description: 'End date' },
    activity_id: { type: 'string', description: 'Activity ID' },
    subject: { type: 'string', description: 'Activity subject' },
    type: { type: 'string', description: 'Activity type' },
    due_date: { type: 'string', description: 'Due date' },
    due_time: { type: 'string', description: 'Due time' },
    duration: { type: 'string', description: 'Duration' },
    done: { type: 'string', description: 'Completion status' },
    note: { type: 'string', description: 'Notes' },
    lead_id: { type: 'string', description: 'Lead ID' },
    archived: { type: 'string', description: 'Archived status' },
    value_amount: { type: 'string', description: 'Value amount' },
    value_currency: { type: 'string', description: 'Value currency' },
    is_archived: { type: 'string', description: 'Archive status' },
  },
  outputs: {
    deals: { type: 'json', description: 'Array of deal objects' },
    deal: { type: 'json', description: 'Single deal object' },
    files: { type: 'json', description: 'Array of file objects' },
    messages: { type: 'json', description: 'Array of mail message objects' },
    pipelines: { type: 'json', description: 'Array of pipeline objects' },
    projects: { type: 'json', description: 'Array of project objects' },
    project: { type: 'json', description: 'Single project object' },
    activities: { type: 'json', description: 'Array of activity objects' },
    activity: { type: 'json', description: 'Single activity object' },
    leads: { type: 'json', description: 'Array of lead objects' },
    lead: { type: 'json', description: 'Single lead object' },
    metadata: { type: 'json', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: polymarket.ts]---
Location: sim-main/apps/sim/blocks/blocks/polymarket.ts

```typescript
import { PolymarketIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'

export const PolymarketBlock: BlockConfig = {
  type: 'polymarket',
  name: 'Polymarket',
  description: 'Access prediction markets data from Polymarket',
  longDescription:
    'Integrate Polymarket prediction markets into the workflow. Can get markets, market, events, event, tags, series, orderbook, price, midpoint, price history, last trade price, spread, tick size, positions, trades, and search.',
  docsLink: 'https://docs.sim.ai/tools/polymarket',
  category: 'tools',
  bgColor: '#4C82FB',
  icon: PolymarketIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Markets', id: 'get_markets' },
        { label: 'Get Market', id: 'get_market' },
        { label: 'Get Events', id: 'get_events' },
        { label: 'Get Event', id: 'get_event' },
        { label: 'Get Tags', id: 'get_tags' },
        { label: 'Search', id: 'search' },
        { label: 'Get Series', id: 'get_series' },
        { label: 'Get Series by ID', id: 'get_series_by_id' },
        { label: 'Get Orderbook', id: 'get_orderbook' },
        { label: 'Get Price', id: 'get_price' },
        { label: 'Get Midpoint', id: 'get_midpoint' },
        { label: 'Get Price History', id: 'get_price_history' },
        { label: 'Get Last Trade Price', id: 'get_last_trade_price' },
        { label: 'Get Spread', id: 'get_spread' },
        { label: 'Get Tick Size', id: 'get_tick_size' },
        { label: 'Get Positions', id: 'get_positions' },
        { label: 'Get Trades', id: 'get_trades' },
      ],
      value: () => 'get_markets',
    },
    // Get Market fields - marketId or slug (one is required)
    {
      id: 'marketId',
      title: 'Market ID',
      type: 'short-input',
      placeholder: 'Market ID (required if no slug)',
      condition: { field: 'operation', value: ['get_market'] },
    },
    {
      id: 'marketSlug',
      title: 'Market Slug',
      type: 'short-input',
      placeholder: 'Market slug (required if no ID)',
      condition: { field: 'operation', value: ['get_market'] },
    },
    // Get Event fields - eventId or slug (one is required)
    {
      id: 'eventId',
      title: 'Event ID',
      type: 'short-input',
      placeholder: 'Event ID (required if no slug)',
      condition: { field: 'operation', value: ['get_event'] },
    },
    {
      id: 'eventSlug',
      title: 'Event Slug',
      type: 'short-input',
      placeholder: 'Event slug (required if no ID)',
      condition: { field: 'operation', value: ['get_event'] },
    },
    // Series ID for get_series_by_id
    {
      id: 'seriesId',
      title: 'Series ID',
      type: 'short-input',
      placeholder: 'Series ID',
      required: true,
      condition: { field: 'operation', value: ['get_series_by_id'] },
    },
    // Search query
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Search term',
      required: true,
      condition: { field: 'operation', value: ['search'] },
    },
    // User wallet address for Data API operations
    {
      id: 'user',
      title: 'User Wallet Address',
      type: 'short-input',
      placeholder: 'Wallet address',
      required: true,
      condition: { field: 'operation', value: ['get_positions'] },
    },
    {
      id: 'user',
      title: 'User Wallet Address',
      type: 'short-input',
      placeholder: 'Wallet address (optional filter)',
      condition: { field: 'operation', value: ['get_trades'] },
    },
    // Market filter for positions and trades
    {
      id: 'market',
      title: 'Market ID',
      type: 'short-input',
      placeholder: 'Market ID (optional filter)',
      condition: { field: 'operation', value: ['get_positions', 'get_trades'] },
    },
    // Token ID for CLOB operations
    {
      id: 'tokenId',
      title: 'Token ID',
      type: 'short-input',
      placeholder: 'CLOB Token ID from market',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'get_orderbook',
          'get_price',
          'get_midpoint',
          'get_price_history',
          'get_last_trade_price',
          'get_spread',
          'get_tick_size',
        ],
      },
    },
    // Side for price query
    {
      id: 'side',
      title: 'Side',
      type: 'dropdown',
      options: [
        { label: 'Buy', id: 'buy' },
        { label: 'Sell', id: 'sell' },
      ],
      condition: { field: 'operation', value: ['get_price'] },
      required: true,
    },
    // Price history specific fields
    {
      id: 'interval',
      title: 'Interval',
      type: 'dropdown',
      options: [
        { label: 'None (use timestamps)', id: '' },
        { label: '1 Minute', id: '1m' },
        { label: '1 Hour', id: '1h' },
        { label: '6 Hours', id: '6h' },
        { label: '1 Day', id: '1d' },
        { label: '1 Week', id: '1w' },
        { label: 'Max', id: 'max' },
      ],
      condition: { field: 'operation', value: ['get_price_history'] },
    },
    {
      id: 'fidelity',
      title: 'Fidelity (minutes)',
      type: 'short-input',
      placeholder: 'Data resolution in minutes (e.g., 60)',
      condition: { field: 'operation', value: ['get_price_history'] },
    },
    {
      id: 'startTs',
      title: 'Start Timestamp',
      type: 'short-input',
      placeholder: 'Unix timestamp UTC (if no interval)',
      condition: { field: 'operation', value: ['get_price_history'] },
    },
    {
      id: 'endTs',
      title: 'End Timestamp',
      type: 'short-input',
      placeholder: 'Unix timestamp UTC (if no interval)',
      condition: { field: 'operation', value: ['get_price_history'] },
    },
    // Filters for list operations
    {
      id: 'closed',
      title: 'Status',
      type: 'dropdown',
      options: [
        { label: 'All', id: '' },
        { label: 'Active Only', id: 'false' },
        { label: 'Closed Only', id: 'true' },
      ],
      condition: { field: 'operation', value: ['get_markets', 'get_events'] },
    },
    {
      id: 'order',
      title: 'Sort By',
      type: 'dropdown',
      options: [
        { label: 'Default', id: '' },
        { label: 'Volume', id: 'volumeNum' },
        { label: 'Liquidity', id: 'liquidityNum' },
        { label: 'Start Date', id: 'startDate' },
        { label: 'End Date', id: 'endDate' },
        { label: 'Created At', id: 'createdAt' },
        { label: 'Updated At', id: 'updatedAt' },
      ],
      condition: { field: 'operation', value: ['get_markets'] },
    },
    {
      id: 'orderEvents',
      title: 'Sort By',
      type: 'dropdown',
      options: [
        { label: 'Default', id: '' },
        { label: 'Volume', id: 'volume' },
        { label: 'Liquidity', id: 'liquidity' },
        { label: 'Start Date', id: 'startDate' },
        { label: 'End Date', id: 'endDate' },
        { label: 'Created At', id: 'createdAt' },
        { label: 'Updated At', id: 'updatedAt' },
      ],
      condition: { field: 'operation', value: ['get_events'] },
    },
    {
      id: 'ascending',
      title: 'Sort Order',
      type: 'dropdown',
      options: [
        { label: 'Descending', id: 'false' },
        { label: 'Ascending', id: 'true' },
      ],
      condition: { field: 'operation', value: ['get_markets', 'get_events'] },
    },
    {
      id: 'tagId',
      title: 'Tag ID',
      type: 'short-input',
      placeholder: 'Filter by tag ID',
      condition: { field: 'operation', value: ['get_markets', 'get_events'] },
    },
    // Pagination fields
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Number of results (max 50)',
      condition: {
        field: 'operation',
        value: ['get_markets', 'get_events', 'get_tags', 'search', 'get_series', 'get_trades'],
      },
    },
    {
      id: 'offset',
      title: 'Offset',
      type: 'short-input',
      placeholder: 'Pagination offset',
      condition: {
        field: 'operation',
        value: ['get_markets', 'get_events', 'get_tags', 'search', 'get_series', 'get_trades'],
      },
    },
  ],
  tools: {
    access: [
      'polymarket_get_markets',
      'polymarket_get_market',
      'polymarket_get_events',
      'polymarket_get_event',
      'polymarket_get_tags',
      'polymarket_search',
      'polymarket_get_series',
      'polymarket_get_series_by_id',
      'polymarket_get_orderbook',
      'polymarket_get_price',
      'polymarket_get_midpoint',
      'polymarket_get_price_history',
      'polymarket_get_last_trade_price',
      'polymarket_get_spread',
      'polymarket_get_tick_size',
      'polymarket_get_positions',
      'polymarket_get_trades',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'get_markets':
            return 'polymarket_get_markets'
          case 'get_market':
            return 'polymarket_get_market'
          case 'get_events':
            return 'polymarket_get_events'
          case 'get_event':
            return 'polymarket_get_event'
          case 'get_tags':
            return 'polymarket_get_tags'
          case 'search':
            return 'polymarket_search'
          case 'get_series':
            return 'polymarket_get_series'
          case 'get_series_by_id':
            return 'polymarket_get_series_by_id'
          case 'get_orderbook':
            return 'polymarket_get_orderbook'
          case 'get_price':
            return 'polymarket_get_price'
          case 'get_midpoint':
            return 'polymarket_get_midpoint'
          case 'get_price_history':
            return 'polymarket_get_price_history'
          case 'get_last_trade_price':
            return 'polymarket_get_last_trade_price'
          case 'get_spread':
            return 'polymarket_get_spread'
          case 'get_tick_size':
            return 'polymarket_get_tick_size'
          case 'get_positions':
            return 'polymarket_get_positions'
          case 'get_trades':
            return 'polymarket_get_trades'
          default:
            return 'polymarket_get_markets'
        }
      },
      params: (params) => {
        const { operation, marketSlug, eventSlug, orderEvents, order, ...rest } = params
        const cleanParams: Record<string, any> = {}

        // Map marketSlug to slug for get_market
        if (operation === 'get_market' && marketSlug) {
          cleanParams.slug = marketSlug
        }

        // Map eventSlug to slug for get_event
        if (operation === 'get_event' && eventSlug) {
          cleanParams.slug = eventSlug
        }

        // Map order field based on operation (markets use volumeNum/liquidityNum, events use volume/liquidity)
        if (operation === 'get_markets' && order) {
          cleanParams.order = order
        } else if (operation === 'get_events' && orderEvents) {
          cleanParams.order = orderEvents
        }

        // Convert numeric fields from string to number for get_price_history
        if (operation === 'get_price_history') {
          if (rest.fidelity) cleanParams.fidelity = Number(rest.fidelity)
          if (rest.startTs) cleanParams.startTs = Number(rest.startTs)
          if (rest.endTs) cleanParams.endTs = Number(rest.endTs)
          rest.fidelity = undefined
          rest.startTs = undefined
          rest.endTs = undefined
        }

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            cleanParams[key] = value
          }
        })

        return cleanParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    marketId: { type: 'string', description: 'Market ID' },
    marketSlug: { type: 'string', description: 'Market slug' },
    eventId: { type: 'string', description: 'Event ID' },
    eventSlug: { type: 'string', description: 'Event slug' },
    seriesId: { type: 'string', description: 'Series ID' },
    query: { type: 'string', description: 'Search query' },
    user: { type: 'string', description: 'User wallet address' },
    market: { type: 'string', description: 'Market ID filter' },
    tokenId: { type: 'string', description: 'CLOB Token ID' },
    side: { type: 'string', description: 'Order side (buy/sell)' },
    interval: { type: 'string', description: 'Price history interval' },
    fidelity: { type: 'number', description: 'Data resolution in minutes' },
    startTs: { type: 'number', description: 'Start timestamp (Unix)' },
    endTs: { type: 'number', description: 'End timestamp (Unix)' },
  },
  outputs: {
    // List operations
    markets: { type: 'json', description: 'Array of market objects (get_markets)' },
    events: { type: 'json', description: 'Array of event objects (get_events)' },
    tags: { type: 'json', description: 'Array of tag objects (get_tags)' },
    series: {
      type: 'json',
      description: 'Array or single series object (get_series, get_series_by_id)',
    },
    positions: { type: 'json', description: 'Array of position objects (get_positions)' },
    trades: { type: 'json', description: 'Array of trade objects (get_trades)' },
    // Single item operations
    market: { type: 'json', description: 'Single market object (get_market)' },
    event: { type: 'json', description: 'Single event object (get_event)' },
    // Search
    results: {
      type: 'json',
      description: 'Search results with markets, events, profiles (search)',
    },
    // CLOB operations
    orderbook: { type: 'json', description: 'Order book with bids and asks (get_orderbook)' },
    price: { type: 'string', description: 'Market price (get_price, get_last_trade_price)' },
    midpoint: { type: 'string', description: 'Midpoint price (get_midpoint)' },
    history: { type: 'json', description: 'Price history entries (get_price_history)' },
    spread: { type: 'json', description: 'Bid-ask spread (get_spread)' },
    tickSize: { type: 'string', description: 'Minimum tick size (get_tick_size)' },
  },
}
```

--------------------------------------------------------------------------------

````
