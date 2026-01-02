---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 482
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 482 of 933)

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

---[FILE: salesforce.ts]---
Location: sim-main/apps/sim/blocks/blocks/salesforce.ts

```typescript
import { SalesforceIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { SalesforceResponse } from '@/tools/salesforce/types'

export const SalesforceBlock: BlockConfig<SalesforceResponse> = {
  type: 'salesforce',
  name: 'Salesforce',
  description: 'Interact with Salesforce CRM',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Salesforce into your workflow. Manage accounts, contacts, leads, opportunities, cases, and tasks with powerful automation capabilities.',
  docsLink: 'https://docs.sim.ai/tools/salesforce',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: SalesforceIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Accounts', id: 'get_accounts' },
        { label: 'Create Account', id: 'create_account' },
        { label: 'Update Account', id: 'update_account' },
        { label: 'Delete Account', id: 'delete_account' },
        { label: 'Get Contacts', id: 'get_contacts' },
        { label: 'Create Contact', id: 'create_contact' },
        { label: 'Update Contact', id: 'update_contact' },
        { label: 'Delete Contact', id: 'delete_contact' },
        { label: 'Get Leads', id: 'get_leads' },
        { label: 'Create Lead', id: 'create_lead' },
        { label: 'Update Lead', id: 'update_lead' },
        { label: 'Delete Lead', id: 'delete_lead' },
        { label: 'Get Opportunities', id: 'get_opportunities' },
        { label: 'Create Opportunity', id: 'create_opportunity' },
        { label: 'Update Opportunity', id: 'update_opportunity' },
        { label: 'Delete Opportunity', id: 'delete_opportunity' },
        { label: 'Get Cases', id: 'get_cases' },
        { label: 'Create Case', id: 'create_case' },
        { label: 'Update Case', id: 'update_case' },
        { label: 'Delete Case', id: 'delete_case' },
        { label: 'Get Tasks', id: 'get_tasks' },
        { label: 'Create Task', id: 'create_task' },
        { label: 'Update Task', id: 'update_task' },
        { label: 'Delete Task', id: 'delete_task' },
        { label: 'List Reports', id: 'list_reports' },
        { label: 'Get Report', id: 'get_report' },
        { label: 'Run Report', id: 'run_report' },
        { label: 'List Report Types', id: 'list_report_types' },
        { label: 'List Dashboards', id: 'list_dashboards' },
        { label: 'Get Dashboard', id: 'get_dashboard' },
        { label: 'Refresh Dashboard', id: 'refresh_dashboard' },
        { label: 'Run SOQL Query', id: 'query' },
        { label: 'Get More Query Results', id: 'query_more' },
        { label: 'Describe Object', id: 'describe_object' },
        { label: 'List Objects', id: 'list_objects' },
      ],
      value: () => 'get_accounts',
    },
    {
      id: 'credential',
      title: 'Salesforce Account',
      type: 'oauth-input',
      serviceId: 'salesforce',
      requiredScopes: ['api', 'refresh_token', 'openid', 'offline_access'],
      placeholder: 'Select Salesforce account',
      required: true,
    },
    // Common fields for GET operations
    {
      id: 'fields',
      title: 'Fields to Return',
      type: 'short-input',
      placeholder: 'Comma-separated fields',
      condition: {
        field: 'operation',
        value: [
          'get_accounts',
          'get_contacts',
          'get_leads',
          'get_opportunities',
          'get_cases',
          'get_tasks',
        ],
      },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Max results (default: 100)',
      condition: {
        field: 'operation',
        value: [
          'get_accounts',
          'get_contacts',
          'get_leads',
          'get_opportunities',
          'get_cases',
          'get_tasks',
        ],
      },
    },
    {
      id: 'orderBy',
      title: 'Order By',
      type: 'short-input',
      placeholder: 'Field and direction (e.g., "Name ASC")',
      condition: {
        field: 'operation',
        value: [
          'get_accounts',
          'get_contacts',
          'get_leads',
          'get_opportunities',
          'get_cases',
          'get_tasks',
        ],
      },
    },
    // Account fields
    {
      id: 'accountId',
      title: 'Account ID',
      type: 'short-input',
      placeholder: 'Salesforce Account ID',
      condition: {
        field: 'operation',
        value: [
          'update_account',
          'delete_account',
          'create_contact',
          'update_contact',
          'create_case',
        ],
      },
    },
    {
      id: 'name',
      title: 'Name',
      type: 'short-input',
      placeholder: 'Name',
      condition: {
        field: 'operation',
        value: ['create_account', 'update_account', 'create_opportunity', 'update_opportunity'],
      },
    },
    {
      id: 'type',
      title: 'Type',
      type: 'short-input',
      placeholder: 'Type',
      condition: { field: 'operation', value: ['create_account', 'update_account'] },
    },
    {
      id: 'industry',
      title: 'Industry',
      type: 'short-input',
      placeholder: 'Industry',
      condition: { field: 'operation', value: ['create_account', 'update_account'] },
    },
    {
      id: 'phone',
      title: 'Phone',
      type: 'short-input',
      placeholder: 'Phone',
      condition: {
        field: 'operation',
        value: [
          'create_account',
          'update_account',
          'create_contact',
          'update_contact',
          'create_lead',
          'update_lead',
        ],
      },
    },
    {
      id: 'website',
      title: 'Website',
      type: 'short-input',
      placeholder: 'Website',
      condition: { field: 'operation', value: ['create_account', 'update_account'] },
    },
    // Contact fields
    {
      id: 'contactId',
      title: 'Contact ID',
      type: 'short-input',
      placeholder: 'Contact ID',
      condition: {
        field: 'operation',
        value: ['get_contacts', 'update_contact', 'delete_contact', 'create_case'],
      },
    },
    {
      id: 'lastName',
      title: 'Last Name',
      type: 'short-input',
      placeholder: 'Last name',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact', 'create_lead', 'update_lead'],
      },
    },
    {
      id: 'firstName',
      title: 'First Name',
      type: 'short-input',
      placeholder: 'First name',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact', 'create_lead', 'update_lead'],
      },
    },
    {
      id: 'email',
      title: 'Email',
      type: 'short-input',
      placeholder: 'Email',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact', 'create_lead', 'update_lead'],
      },
    },
    {
      id: 'title',
      title: 'Job Title',
      type: 'short-input',
      placeholder: 'Job title',
      condition: {
        field: 'operation',
        value: ['create_contact', 'update_contact', 'create_lead', 'update_lead'],
      },
    },
    // Lead fields
    {
      id: 'leadId',
      title: 'Lead ID',
      type: 'short-input',
      placeholder: 'Lead ID',
      condition: { field: 'operation', value: ['get_leads', 'update_lead', 'delete_lead'] },
    },
    {
      id: 'company',
      title: 'Company',
      type: 'short-input',
      placeholder: 'Company name',
      condition: { field: 'operation', value: ['create_lead', 'update_lead'] },
    },
    {
      id: 'status',
      title: 'Status',
      type: 'short-input',
      placeholder: 'Status',
      condition: {
        field: 'operation',
        value: [
          'create_lead',
          'update_lead',
          'create_case',
          'update_case',
          'create_task',
          'update_task',
        ],
      },
    },
    {
      id: 'leadSource',
      title: 'Lead Source',
      type: 'short-input',
      placeholder: 'Lead source',
      condition: { field: 'operation', value: ['create_lead', 'update_lead'] },
    },
    // Opportunity fields
    {
      id: 'opportunityId',
      title: 'Opportunity ID',
      type: 'short-input',
      placeholder: 'Opportunity ID',
      condition: {
        field: 'operation',
        value: ['get_opportunities', 'update_opportunity', 'delete_opportunity'],
      },
    },
    {
      id: 'stageName',
      title: 'Stage Name',
      type: 'short-input',
      placeholder: 'Stage name',
      condition: { field: 'operation', value: ['create_opportunity', 'update_opportunity'] },
    },
    {
      id: 'closeDate',
      title: 'Close Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (required for create)',
      condition: { field: 'operation', value: ['create_opportunity', 'update_opportunity'] },
      required: true,
    },
    {
      id: 'amount',
      title: 'Amount',
      type: 'short-input',
      placeholder: 'Deal amount',
      condition: { field: 'operation', value: ['create_opportunity', 'update_opportunity'] },
    },
    {
      id: 'probability',
      title: 'Probability',
      type: 'short-input',
      placeholder: 'Win probability (0-100)',
      condition: { field: 'operation', value: ['create_opportunity', 'update_opportunity'] },
    },
    // Case fields
    {
      id: 'caseId',
      title: 'Case ID',
      type: 'short-input',
      placeholder: 'Case ID',
      condition: { field: 'operation', value: ['get_cases', 'update_case', 'delete_case'] },
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Subject',
      condition: {
        field: 'operation',
        value: ['create_case', 'update_case', 'create_task', 'update_task'],
      },
    },
    {
      id: 'priority',
      title: 'Priority',
      type: 'short-input',
      placeholder: 'Priority',
      condition: {
        field: 'operation',
        value: ['create_case', 'update_case', 'create_task', 'update_task'],
      },
    },
    {
      id: 'origin',
      title: 'Origin',
      type: 'short-input',
      placeholder: 'Origin (e.g., Phone, Email, Web)',
      condition: { field: 'operation', value: ['create_case'] },
    },
    // Task fields
    {
      id: 'taskId',
      title: 'Task ID',
      type: 'short-input',
      placeholder: 'Task ID',
      condition: { field: 'operation', value: ['get_tasks', 'update_task', 'delete_task'] },
    },
    {
      id: 'activityDate',
      title: 'Due Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD',
      condition: { field: 'operation', value: ['create_task', 'update_task'] },
    },
    {
      id: 'whoId',
      title: 'Related Contact/Lead ID',
      type: 'short-input',
      placeholder: 'Contact or Lead ID',
      condition: { field: 'operation', value: ['create_task'] },
    },
    {
      id: 'whatId',
      title: 'Related Account/Opportunity ID',
      type: 'short-input',
      placeholder: 'Account or Opportunity ID',
      condition: { field: 'operation', value: ['create_task'] },
    },
    // Report fields
    {
      id: 'reportId',
      title: 'Report ID',
      type: 'short-input',
      placeholder: 'Report ID',
      condition: { field: 'operation', value: ['get_report', 'run_report'] },
      required: true,
    },
    {
      id: 'folderName',
      title: 'Folder Name',
      type: 'short-input',
      placeholder: 'Filter by folder name',
      condition: { field: 'operation', value: ['list_reports', 'list_dashboards'] },
    },
    {
      id: 'searchTerm',
      title: 'Search Term',
      type: 'short-input',
      placeholder: 'Search reports by name',
      condition: { field: 'operation', value: ['list_reports'] },
    },
    {
      id: 'includeDetails',
      title: 'Include Details',
      type: 'short-input',
      placeholder: 'Include detail rows (true/false)',
      condition: { field: 'operation', value: ['run_report'] },
    },
    {
      id: 'filters',
      title: 'Report Filters',
      type: 'long-input',
      placeholder: 'JSON array of report filters',
      condition: { field: 'operation', value: ['run_report'] },
    },
    // Dashboard fields
    {
      id: 'dashboardId',
      title: 'Dashboard ID',
      type: 'short-input',
      placeholder: 'Dashboard ID',
      condition: { field: 'operation', value: ['get_dashboard', 'refresh_dashboard'] },
      required: true,
    },
    // Query fields
    {
      id: 'query',
      title: 'SOQL Query',
      type: 'long-input',
      placeholder: 'SELECT Id, Name FROM Account LIMIT 10',
      condition: { field: 'operation', value: ['query'] },
      required: true,
    },
    {
      id: 'nextRecordsUrl',
      title: 'Next Records URL',
      type: 'short-input',
      placeholder: 'URL from previous query response',
      condition: { field: 'operation', value: ['query_more'] },
      required: true,
    },
    {
      id: 'objectName',
      title: 'Object Name',
      type: 'short-input',
      placeholder: 'API name (e.g., Account, Lead, Custom_Object__c)',
      condition: { field: 'operation', value: ['describe_object'] },
      required: true,
    },
    // Long-input fields at the bottom
    {
      id: 'description',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Description',
      condition: {
        field: 'operation',
        value: [
          'create_account',
          'update_account',
          'create_contact',
          'update_contact',
          'create_lead',
          'update_lead',
          'create_opportunity',
          'update_opportunity',
          'create_case',
          'update_case',
          'create_task',
          'update_task',
        ],
      },
    },
  ],
  tools: {
    access: [
      'salesforce_get_accounts',
      'salesforce_create_account',
      'salesforce_update_account',
      'salesforce_delete_account',
      'salesforce_get_contacts',
      'salesforce_create_contact',
      'salesforce_update_contact',
      'salesforce_delete_contact',
      'salesforce_get_leads',
      'salesforce_create_lead',
      'salesforce_update_lead',
      'salesforce_delete_lead',
      'salesforce_get_opportunities',
      'salesforce_create_opportunity',
      'salesforce_update_opportunity',
      'salesforce_delete_opportunity',
      'salesforce_get_cases',
      'salesforce_create_case',
      'salesforce_update_case',
      'salesforce_delete_case',
      'salesforce_get_tasks',
      'salesforce_create_task',
      'salesforce_update_task',
      'salesforce_delete_task',
      'salesforce_list_reports',
      'salesforce_get_report',
      'salesforce_run_report',
      'salesforce_list_report_types',
      'salesforce_list_dashboards',
      'salesforce_get_dashboard',
      'salesforce_refresh_dashboard',
      'salesforce_query',
      'salesforce_query_more',
      'salesforce_describe_object',
      'salesforce_list_objects',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'get_accounts':
            return 'salesforce_get_accounts'
          case 'create_account':
            return 'salesforce_create_account'
          case 'update_account':
            return 'salesforce_update_account'
          case 'delete_account':
            return 'salesforce_delete_account'
          case 'get_contacts':
            return 'salesforce_get_contacts'
          case 'create_contact':
            return 'salesforce_create_contact'
          case 'update_contact':
            return 'salesforce_update_contact'
          case 'delete_contact':
            return 'salesforce_delete_contact'
          case 'get_leads':
            return 'salesforce_get_leads'
          case 'create_lead':
            return 'salesforce_create_lead'
          case 'update_lead':
            return 'salesforce_update_lead'
          case 'delete_lead':
            return 'salesforce_delete_lead'
          case 'get_opportunities':
            return 'salesforce_get_opportunities'
          case 'create_opportunity':
            return 'salesforce_create_opportunity'
          case 'update_opportunity':
            return 'salesforce_update_opportunity'
          case 'delete_opportunity':
            return 'salesforce_delete_opportunity'
          case 'get_cases':
            return 'salesforce_get_cases'
          case 'create_case':
            return 'salesforce_create_case'
          case 'update_case':
            return 'salesforce_update_case'
          case 'delete_case':
            return 'salesforce_delete_case'
          case 'get_tasks':
            return 'salesforce_get_tasks'
          case 'create_task':
            return 'salesforce_create_task'
          case 'update_task':
            return 'salesforce_update_task'
          case 'delete_task':
            return 'salesforce_delete_task'
          case 'list_reports':
            return 'salesforce_list_reports'
          case 'get_report':
            return 'salesforce_get_report'
          case 'run_report':
            return 'salesforce_run_report'
          case 'list_report_types':
            return 'salesforce_list_report_types'
          case 'list_dashboards':
            return 'salesforce_list_dashboards'
          case 'get_dashboard':
            return 'salesforce_get_dashboard'
          case 'refresh_dashboard':
            return 'salesforce_refresh_dashboard'
          case 'query':
            return 'salesforce_query'
          case 'query_more':
            return 'salesforce_query_more'
          case 'describe_object':
            return 'salesforce_describe_object'
          case 'list_objects':
            return 'salesforce_list_objects'
          default:
            throw new Error(`Unknown operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, operation, ...rest } = params
        const cleanParams: Record<string, any> = { credential }
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
    credential: { type: 'string', description: 'Salesforce credential' },
  },
  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: { type: 'json', description: 'Operation result data' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: schedule.ts]---
Location: sim-main/apps/sim/blocks/blocks/schedule.ts
Signals: React

```typescript
import type { SVGProps } from 'react'
import { createElement } from 'react'
import { Clock } from 'lucide-react'
import type { BlockConfig } from '@/blocks/types'

const ScheduleIcon = (props: SVGProps<SVGSVGElement>) => createElement(Clock, props)

export const ScheduleBlock: BlockConfig = {
  type: 'schedule',
  triggerAllowed: true,
  name: 'Schedule',
  description: 'Trigger workflow execution on a schedule',
  docsLink: 'https://docs.sim.ai/triggers/schedule',
  longDescription:
    'Integrate Schedule into the workflow. Can trigger a workflow on a schedule configuration.',
  bestPractices: `
  - Search up examples with schedule blocks to understand YAML syntax. 
  - Prefer the custom cron expression input method over the other schedule configuration methods. 
  - Clarify the timezone if the user doesn't specify it.
  `,
  category: 'triggers',
  bgColor: '#6366F1',
  icon: ScheduleIcon,

  subBlocks: [
    {
      id: 'scheduleType',
      type: 'dropdown',
      title: 'Run frequency',
      options: [
        { label: 'Every X Minutes', id: 'minutes' },
        { label: 'Hourly', id: 'hourly' },
        { label: 'Daily', id: 'daily' },
        { label: 'Weekly', id: 'weekly' },
        { label: 'Monthly', id: 'monthly' },
        { label: 'Custom (Cron)', id: 'custom' },
      ],
      value: () => 'daily',
      required: true,
      mode: 'trigger',
    },

    {
      id: 'minutesInterval',
      type: 'short-input',
      title: 'Interval (minutes)',
      placeholder: '15',
      required: true,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: 'minutes' },
    },

    {
      id: 'hourlyMinute',
      type: 'short-input',
      title: 'Minute',
      placeholder: '0-59',
      required: true,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: 'hourly' },
    },

    {
      id: 'dailyTime',
      type: 'time-input',
      title: 'Time',
      required: true,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: 'daily' },
    },

    {
      id: 'weeklyDay',
      type: 'dropdown',
      title: 'Day of week',
      options: [
        { label: 'Monday', id: 'MON' },
        { label: 'Tuesday', id: 'TUE' },
        { label: 'Wednesday', id: 'WED' },
        { label: 'Thursday', id: 'THU' },
        { label: 'Friday', id: 'FRI' },
        { label: 'Saturday', id: 'SAT' },
        { label: 'Sunday', id: 'SUN' },
      ],
      required: true,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: 'weekly' },
    },

    {
      id: 'weeklyDayTime',
      type: 'time-input',
      title: 'Time',
      required: true,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: 'weekly' },
    },

    {
      id: 'monthlyDay',
      type: 'short-input',
      title: 'Day of month',
      placeholder: '1-31',
      required: true,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: 'monthly' },
    },

    {
      id: 'monthlyTime',
      type: 'time-input',
      title: 'Time',
      required: true,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: 'monthly' },
    },

    {
      id: 'cronExpression',
      type: 'short-input',
      title: 'Cron expression',
      placeholder: '0 0 * * *',
      required: true,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: 'custom' },
    },

    {
      id: 'timezone',
      type: 'dropdown',
      title: 'Timezone',
      options: [
        { label: 'UTC', id: 'UTC' },
        { label: 'US Eastern (UTC-5)', id: 'America/New_York' },
        { label: 'US Central (UTC-6)', id: 'America/Chicago' },
        { label: 'US Mountain (UTC-7)', id: 'America/Denver' },
        { label: 'US Pacific (UTC-8)', id: 'America/Los_Angeles' },
        { label: 'Mexico City (UTC-6)', id: 'America/Mexico_City' },
        { label: 'São Paulo (UTC-3)', id: 'America/Sao_Paulo' },
        { label: 'London (UTC+0)', id: 'Europe/London' },
        { label: 'Paris (UTC+1)', id: 'Europe/Paris' },
        { label: 'Berlin (UTC+1)', id: 'Europe/Berlin' },
        { label: 'Dubai (UTC+4)', id: 'Asia/Dubai' },
        { label: 'India (UTC+5:30)', id: 'Asia/Kolkata' },
        { label: 'Singapore (UTC+8)', id: 'Asia/Singapore' },
        { label: 'China (UTC+8)', id: 'Asia/Shanghai' },
        { label: 'Hong Kong (UTC+8)', id: 'Asia/Hong_Kong' },
        { label: 'Tokyo (UTC+9)', id: 'Asia/Tokyo' },
        { label: 'Sydney (UTC+10)', id: 'Australia/Sydney' },
        { label: 'Auckland (UTC+12)', id: 'Pacific/Auckland' },
      ],
      value: () => 'UTC',
      required: false,
      mode: 'trigger',
      condition: { field: 'scheduleType', value: ['minutes', 'hourly'], not: true },
    },

    {
      id: 'scheduleSave',
      type: 'schedule-save',
      mode: 'trigger',
      hideFromPreview: true,
    },

    {
      id: 'scheduleId',
      type: 'short-input',
      hidden: true,
      mode: 'trigger',
    },
  ],

  tools: {
    access: [], // No external tools needed
  },

  inputs: {}, // No inputs - schedule triggers initiate workflows

  outputs: {}, // No outputs - schedule triggers initiate workflow execution
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/blocks/blocks/search.ts

```typescript
import { SearchIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'

export const SearchBlock: BlockConfig = {
  type: 'search',
  name: 'Search',
  description: 'Search the web ($0.01 per search)',
  longDescription: 'Search the web using the Search tool. Each search costs $0.01 per query.',
  bgColor: '#3B82F6',
  icon: SearchIcon,
  category: 'tools',
  docsLink: 'https://docs.sim.ai/tools/search',
  subBlocks: [
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter your search query...',
      required: true,
    },
  ],
  tools: {
    access: ['search_tool'],
    config: {
      tool: () => 'search_tool',
    },
  },
  inputs: {
    query: { type: 'string', description: 'Search query' },
  },
  outputs: {
    results: { type: 'json', description: 'Search results' },
    query: { type: 'string', description: 'The search query' },
    totalResults: { type: 'number', description: 'Total number of results' },
    source: { type: 'string', description: 'Search source (exa)' },
    cost: { type: 'json', description: 'Cost information ($0.01)' },
  },
}
```

--------------------------------------------------------------------------------

````
