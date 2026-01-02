---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 461
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 461 of 933)

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

---[FILE: grafana.ts]---
Location: sim-main/apps/sim/blocks/blocks/grafana.ts

```typescript
import { GrafanaIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { GrafanaResponse } from '@/tools/grafana/types'

export const GrafanaBlock: BlockConfig<GrafanaResponse> = {
  type: 'grafana',
  name: 'Grafana',
  description: 'Interact with Grafana dashboards, alerts, and annotations',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Grafana into workflows. Manage dashboards, alerts, annotations, data sources, folders, and monitor health status.',
  docsLink: 'https://docs.sim.ai/tools/grafana',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GrafanaIcon,
  subBlocks: [
    // Operation dropdown
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        // Dashboards
        { label: 'List Dashboards', id: 'grafana_list_dashboards' },
        { label: 'Get Dashboard', id: 'grafana_get_dashboard' },
        { label: 'Create Dashboard', id: 'grafana_create_dashboard' },
        { label: 'Update Dashboard', id: 'grafana_update_dashboard' },
        { label: 'Delete Dashboard', id: 'grafana_delete_dashboard' },
        // Alerts
        { label: 'List Alert Rules', id: 'grafana_list_alert_rules' },
        { label: 'Get Alert Rule', id: 'grafana_get_alert_rule' },
        { label: 'Create Alert Rule', id: 'grafana_create_alert_rule' },
        { label: 'Update Alert Rule', id: 'grafana_update_alert_rule' },
        { label: 'Delete Alert Rule', id: 'grafana_delete_alert_rule' },
        { label: 'List Contact Points', id: 'grafana_list_contact_points' },
        // Annotations
        { label: 'Create Annotation', id: 'grafana_create_annotation' },
        { label: 'List Annotations', id: 'grafana_list_annotations' },
        { label: 'Update Annotation', id: 'grafana_update_annotation' },
        { label: 'Delete Annotation', id: 'grafana_delete_annotation' },
        // Data Sources
        { label: 'List Data Sources', id: 'grafana_list_data_sources' },
        { label: 'Get Data Source', id: 'grafana_get_data_source' },
        // Folders
        { label: 'List Folders', id: 'grafana_list_folders' },
        { label: 'Create Folder', id: 'grafana_create_folder' },
      ],
      value: () => 'grafana_list_dashboards',
    },

    // Base Configuration (common to all operations)
    {
      id: 'baseUrl',
      title: 'Grafana URL',
      type: 'short-input',
      placeholder: 'https://your-grafana.com',
      required: true,
    },
    {
      id: 'apiKey',
      title: 'Service Account Token',
      type: 'short-input',
      placeholder: 'glsa_...',
      password: true,
      required: true,
    },
    {
      id: 'organizationId',
      title: 'Organization ID',
      type: 'short-input',
      placeholder: 'Optional - for multi-org instances',
    },

    // Data Source operations
    {
      id: 'dataSourceId',
      title: 'Data Source ID',
      type: 'short-input',
      placeholder: 'Enter data source ID or UID',
      required: true,
      condition: {
        field: 'operation',
        value: 'grafana_get_data_source',
      },
    },

    // Dashboard operations
    {
      id: 'dashboardUid',
      title: 'Dashboard UID',
      type: 'short-input',
      placeholder: 'Enter dashboard UID',
      required: true,
      condition: {
        field: 'operation',
        value: ['grafana_get_dashboard', 'grafana_update_dashboard', 'grafana_delete_dashboard'],
      },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Filter dashboards by title',
      condition: { field: 'operation', value: 'grafana_list_dashboards' },
    },
    {
      id: 'tag',
      title: 'Filter by Tag',
      type: 'short-input',
      placeholder: 'tag1, tag2 (comma-separated)',
      condition: { field: 'operation', value: 'grafana_list_dashboards' },
    },

    // Create/Update Dashboard
    {
      id: 'title',
      title: 'Dashboard Title',
      type: 'short-input',
      placeholder: 'Enter dashboard title',
      required: true,
      condition: { field: 'operation', value: 'grafana_create_dashboard' },
    },
    {
      id: 'folderUid',
      title: 'Folder UID',
      type: 'short-input',
      placeholder: 'Optional - folder to create dashboard in',
      condition: {
        field: 'operation',
        value: [
          'grafana_create_dashboard',
          'grafana_update_dashboard',
          'grafana_create_alert_rule',
        ],
      },
    },
    {
      id: 'tags',
      title: 'Tags',
      type: 'short-input',
      placeholder: 'tag1, tag2 (comma-separated)',
      condition: {
        field: 'operation',
        value: ['grafana_create_dashboard', 'grafana_update_dashboard'],
      },
    },
    {
      id: 'panels',
      title: 'Panels (JSON)',
      type: 'long-input',
      placeholder: 'JSON array of panel configurations',
      condition: {
        field: 'operation',
        value: ['grafana_create_dashboard', 'grafana_update_dashboard'],
      },
    },
    {
      id: 'message',
      title: 'Commit Message',
      type: 'short-input',
      placeholder: 'Optional version message',
      condition: {
        field: 'operation',
        value: ['grafana_create_dashboard', 'grafana_update_dashboard'],
      },
    },

    // Alert Rule operations
    {
      id: 'alertRuleUid',
      title: 'Alert Rule UID',
      type: 'short-input',
      placeholder: 'Enter alert rule UID',
      required: true,
      condition: {
        field: 'operation',
        value: ['grafana_get_alert_rule', 'grafana_update_alert_rule', 'grafana_delete_alert_rule'],
      },
    },
    {
      id: 'alertTitle',
      title: 'Alert Title',
      type: 'short-input',
      placeholder: 'Enter alert rule name',
      condition: {
        field: 'operation',
        value: ['grafana_create_alert_rule', 'grafana_update_alert_rule'],
      },
    },
    {
      id: 'folderUid',
      title: 'Folder UID',
      type: 'short-input',
      placeholder: 'Folder UID for the alert rule',
      condition: {
        field: 'operation',
        value: ['grafana_create_alert_rule', 'grafana_update_alert_rule'],
      },
    },
    {
      id: 'ruleGroup',
      title: 'Rule Group',
      type: 'short-input',
      placeholder: 'Enter rule group name',
      condition: {
        field: 'operation',
        value: ['grafana_create_alert_rule', 'grafana_update_alert_rule'],
      },
    },
    {
      id: 'condition',
      title: 'Condition',
      type: 'short-input',
      placeholder: 'Condition refId (e.g., A)',
      condition: {
        field: 'operation',
        value: ['grafana_create_alert_rule', 'grafana_update_alert_rule'],
      },
    },
    {
      id: 'data',
      title: 'Query Data (JSON)',
      type: 'long-input',
      placeholder: 'JSON array of query/expression data objects',
      condition: {
        field: 'operation',
        value: ['grafana_create_alert_rule', 'grafana_update_alert_rule'],
      },
    },
    {
      id: 'forDuration',
      title: 'For Duration',
      type: 'short-input',
      placeholder: '5m (e.g., 5m, 1h)',
      condition: {
        field: 'operation',
        value: ['grafana_create_alert_rule', 'grafana_update_alert_rule'],
      },
    },
    {
      id: 'noDataState',
      title: 'No Data State',
      type: 'dropdown',
      options: [
        { label: 'No Data', id: 'NoData' },
        { label: 'Alerting', id: 'Alerting' },
        { label: 'OK', id: 'OK' },
      ],
      value: () => 'NoData',
      condition: {
        field: 'operation',
        value: ['grafana_create_alert_rule', 'grafana_update_alert_rule'],
      },
    },
    {
      id: 'execErrState',
      title: 'Error State',
      type: 'dropdown',
      options: [
        { label: 'Alerting', id: 'Alerting' },
        { label: 'OK', id: 'OK' },
      ],
      value: () => 'Alerting',
      condition: {
        field: 'operation',
        value: ['grafana_create_alert_rule', 'grafana_update_alert_rule'],
      },
    },

    // Annotation operations
    {
      id: 'text',
      title: 'Annotation Text',
      type: 'long-input',
      placeholder: 'Enter annotation text...',
      required: true,
      condition: {
        field: 'operation',
        value: ['grafana_create_annotation', 'grafana_update_annotation'],
      },
    },
    {
      id: 'annotationTags',
      title: 'Tags',
      type: 'short-input',
      placeholder: 'tag1, tag2 (comma-separated)',
      condition: {
        field: 'operation',
        value: [
          'grafana_create_annotation',
          'grafana_update_annotation',
          'grafana_list_annotations',
        ],
      },
    },
    {
      id: 'annotationDashboardUid',
      title: 'Dashboard UID',
      type: 'short-input',
      placeholder: 'Enter dashboard UID',
      required: true,
      condition: {
        field: 'operation',
        value: ['grafana_create_annotation', 'grafana_list_annotations'],
      },
    },
    {
      id: 'panelId',
      title: 'Panel ID',
      type: 'short-input',
      placeholder: 'Optional - attach to specific panel',
      condition: {
        field: 'operation',
        value: ['grafana_create_annotation', 'grafana_list_annotations'],
      },
    },
    {
      id: 'time',
      title: 'Time (epoch ms)',
      type: 'short-input',
      placeholder: 'Optional - defaults to now',
      condition: {
        field: 'operation',
        value: ['grafana_create_annotation', 'grafana_update_annotation'],
      },
    },
    {
      id: 'timeEnd',
      title: 'End Time (epoch ms)',
      type: 'short-input',
      placeholder: 'Optional - for range annotations',
      condition: {
        field: 'operation',
        value: ['grafana_create_annotation', 'grafana_update_annotation'],
      },
    },
    {
      id: 'annotationId',
      title: 'Annotation ID',
      type: 'short-input',
      placeholder: 'Enter annotation ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['grafana_update_annotation', 'grafana_delete_annotation'],
      },
    },
    {
      id: 'from',
      title: 'From Time (epoch ms)',
      type: 'short-input',
      placeholder: 'Filter from time',
      condition: { field: 'operation', value: 'grafana_list_annotations' },
    },
    {
      id: 'to',
      title: 'To Time (epoch ms)',
      type: 'short-input',
      placeholder: 'Filter to time',
      condition: { field: 'operation', value: 'grafana_list_annotations' },
    },

    // Folder operations
    {
      id: 'folderTitle',
      title: 'Folder Title',
      type: 'short-input',
      placeholder: 'Enter folder title',
      required: true,
      condition: { field: 'operation', value: 'grafana_create_folder' },
    },
    {
      id: 'folderUidNew',
      title: 'Folder UID',
      type: 'short-input',
      placeholder: 'Optional - auto-generated if not provided',
      condition: { field: 'operation', value: 'grafana_create_folder' },
    },
  ],
  tools: {
    access: [
      'grafana_get_dashboard',
      'grafana_list_dashboards',
      'grafana_create_dashboard',
      'grafana_update_dashboard',
      'grafana_delete_dashboard',
      'grafana_list_alert_rules',
      'grafana_get_alert_rule',
      'grafana_create_alert_rule',
      'grafana_update_alert_rule',
      'grafana_delete_alert_rule',
      'grafana_list_contact_points',
      'grafana_create_annotation',
      'grafana_list_annotations',
      'grafana_update_annotation',
      'grafana_delete_annotation',
      'grafana_list_data_sources',
      'grafana_get_data_source',
      'grafana_list_folders',
      'grafana_create_folder',
    ],
    config: {
      tool: (params) => {
        // Convert numeric string fields to numbers
        if (params.panelId) {
          params.panelId = Number(params.panelId)
        }
        if (params.annotationId) {
          params.annotationId = Number(params.annotationId)
        }
        if (params.time) {
          params.time = Number(params.time)
        }
        if (params.timeEnd) {
          params.timeEnd = Number(params.timeEnd)
        }
        if (params.from) {
          params.from = Number(params.from)
        }
        if (params.to) {
          params.to = Number(params.to)
        }

        // Map subblock fields to tool parameter names
        if (params.alertTitle) {
          params.title = params.alertTitle
        }
        if (params.folderTitle) {
          params.title = params.folderTitle
        }
        if (params.folderUidNew) {
          params.uid = params.folderUidNew
        }
        if (params.annotationTags) {
          params.tags = params.annotationTags
        }
        if (params.annotationDashboardUid) {
          params.dashboardUid = params.annotationDashboardUid
        }

        return params.operation
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    baseUrl: { type: 'string', description: 'Grafana instance URL' },
    apiKey: { type: 'string', description: 'Service Account Token' },
    organizationId: { type: 'string', description: 'Organization ID (optional)' },
    // Dashboard inputs
    dashboardUid: { type: 'string', description: 'Dashboard UID' },
    title: { type: 'string', description: 'Dashboard or folder title' },
    folderUid: { type: 'string', description: 'Folder UID' },
    tags: { type: 'string', description: 'Comma-separated tags' },
    panels: { type: 'string', description: 'JSON array of panels' },
    message: { type: 'string', description: 'Commit message' },
    query: { type: 'string', description: 'Search query' },
    tag: { type: 'string', description: 'Filter by tag' },
    // Alert inputs
    alertRuleUid: { type: 'string', description: 'Alert rule UID' },
    alertTitle: { type: 'string', description: 'Alert rule title' },
    ruleGroup: { type: 'string', description: 'Rule group name' },
    condition: { type: 'string', description: 'Alert condition refId' },
    data: { type: 'string', description: 'Query data JSON' },
    forDuration: { type: 'string', description: 'Duration before firing' },
    noDataState: { type: 'string', description: 'State on no data' },
    execErrState: { type: 'string', description: 'State on error' },
    // Annotation inputs
    text: { type: 'string', description: 'Annotation text' },
    annotationId: { type: 'number', description: 'Annotation ID' },
    panelId: { type: 'number', description: 'Panel ID' },
    time: { type: 'number', description: 'Start time (epoch ms)' },
    timeEnd: { type: 'number', description: 'End time (epoch ms)' },
    from: { type: 'number', description: 'Filter from time' },
    to: { type: 'number', description: 'Filter to time' },
    // Data source inputs
    dataSourceId: { type: 'string', description: 'Data source ID or UID' },
  },
  outputs: {
    // Health outputs
    version: { type: 'string', description: 'Grafana version' },
    database: { type: 'string', description: 'Database health status' },
    status: { type: 'string', description: 'Health status' },
    // Dashboard outputs
    dashboard: { type: 'json', description: 'Dashboard JSON' },
    meta: { type: 'json', description: 'Dashboard metadata' },
    dashboards: { type: 'json', description: 'List of dashboards' },
    uid: { type: 'string', description: 'Created/updated UID' },
    url: { type: 'string', description: 'Dashboard URL' },
    // Alert outputs
    rules: { type: 'json', description: 'Alert rules list' },
    contactPoints: { type: 'json', description: 'Contact points list' },
    // Annotation outputs
    annotations: { type: 'json', description: 'Annotations list' },
    id: { type: 'number', description: 'Annotation ID' },
    // Data source outputs
    dataSources: { type: 'json', description: 'Data sources list' },
    // Folder outputs
    folders: { type: 'json', description: 'Folders list' },
    // Common
    message: { type: 'string', description: 'Status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: guardrails.ts]---
Location: sim-main/apps/sim/blocks/blocks/guardrails.ts

```typescript
import { ShieldCheckIcon } from '@/components/icons'
import { isHosted } from '@/lib/core/config/feature-flags'
import type { BlockConfig } from '@/blocks/types'
import { getHostedModels, getProviderIcon } from '@/providers/utils'
import { useProvidersStore } from '@/stores/providers/store'
import type { ToolResponse } from '@/tools/types'

const getCurrentOllamaModels = () => {
  const providersState = useProvidersStore.getState()
  return providersState.providers.ollama.models
}

export interface GuardrailsResponse extends ToolResponse {
  output: {
    passed: boolean
    validationType: string
    input: string
    error?: string
    score?: number
    reasoning?: string
  }
}

export const GuardrailsBlock: BlockConfig<GuardrailsResponse> = {
  type: 'guardrails',
  name: 'Guardrails',
  description: 'Validate content with guardrails',
  longDescription:
    'Validate content using guardrails. Check if content is valid JSON, matches a regex pattern, detect hallucinations using RAG + LLM scoring, or detect PII.',
  bestPractices: `
  - Reference block outputs using <blockName.output> syntax in the Content field
  - Use JSON validation to ensure structured output from LLMs before parsing
  - Use regex validation for format checking (emails, phone numbers, URLs, etc.)
  - Use hallucination check to validate LLM outputs against knowledge base content
  - Use PII detection to block or mask sensitive personal information
  - Access validation result with <guardrails.passed> (true/false)
  - For hallucination check, access <guardrails.score> (0-10 confidence) and <guardrails.reasoning>
  - For PII detection, access <guardrails.detectedEntities> and <guardrails.maskedText>
  - Chain with Condition block to handle validation failures
  `,
  docsLink: 'https://docs.sim.ai/blocks/guardrails',
  category: 'blocks',
  bgColor: '#3D642D',
  icon: ShieldCheckIcon,
  subBlocks: [
    {
      id: 'input',
      title: 'Content to Validate',
      type: 'long-input',
      placeholder: 'Enter content to validate',
      required: true,
    },
    {
      id: 'validationType',
      title: 'Validation Type',
      type: 'dropdown',
      required: true,
      options: [
        { label: 'Valid JSON', id: 'json' },
        { label: 'Regex Match', id: 'regex' },
        { label: 'Hallucination Check', id: 'hallucination' },
        { label: 'PII Detection', id: 'pii' },
      ],
      defaultValue: 'json',
    },
    {
      id: 'regex',
      title: 'Regex Pattern',
      type: 'short-input',
      placeholder: 'e.g., ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      required: true,
      condition: {
        field: 'validationType',
        value: ['regex'],
      },
    },
    {
      id: 'knowledgeBaseId',
      title: 'Knowledge Base',
      type: 'knowledge-base-selector',
      placeholder: 'Select knowledge base',
      multiSelect: false,
      required: true,
      condition: {
        field: 'validationType',
        value: ['hallucination'],
      },
    },
    {
      id: 'model',
      title: 'Model',
      type: 'combobox',
      placeholder: 'Type or select a model...',
      required: true,
      options: () => {
        const providersState = useProvidersStore.getState()
        const baseModels = providersState.providers.base.models
        const ollamaModels = providersState.providers.ollama.models
        const openrouterModels = providersState.providers.openrouter.models
        const allModels = Array.from(new Set([...baseModels, ...ollamaModels, ...openrouterModels]))

        return allModels.map((model) => {
          const icon = getProviderIcon(model)
          return { label: model, id: model, ...(icon && { icon }) }
        })
      },
      condition: {
        field: 'validationType',
        value: ['hallucination'],
      },
    },
    {
      id: 'threshold',
      title: 'Confidence',
      type: 'slider',
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 3,
      condition: {
        field: 'validationType',
        value: ['hallucination'],
      },
    },
    {
      id: 'topK',
      title: 'Number of Chunks to Retrieve',
      type: 'slider',
      min: 1,
      max: 20,
      step: 1,
      defaultValue: 5,
      mode: 'advanced',
      condition: {
        field: 'validationType',
        value: ['hallucination'],
      },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your API key',
      password: true,
      connectionDroppable: false,
      required: true,
      // Show API key field only for hallucination validation
      // Hide for hosted models and Ollama models
      condition: () => {
        const baseCondition = {
          field: 'validationType' as const,
          value: ['hallucination'],
        }

        if (isHosted) {
          // In hosted mode, hide for hosted models
          return {
            ...baseCondition,
            and: {
              field: 'model' as const,
              value: getHostedModels(),
              not: true, // Show for all models EXCEPT hosted ones
            },
          }
        }
        // In self-hosted mode, hide for Ollama models
        return {
          ...baseCondition,
          and: {
            field: 'model' as const,
            value: getCurrentOllamaModels(),
            not: true, // Show for all models EXCEPT Ollama ones
          },
        }
      },
    },
    {
      id: 'piiEntityTypes',
      title: 'PII Types to Detect',
      type: 'grouped-checkbox-list',
      maxHeight: 400,
      options: [
        // Common PII types
        { label: 'Person name', id: 'PERSON', group: 'Common' },
        { label: 'Email address', id: 'EMAIL_ADDRESS', group: 'Common' },
        { label: 'Phone number', id: 'PHONE_NUMBER', group: 'Common' },
        { label: 'Location', id: 'LOCATION', group: 'Common' },
        { label: 'Date or time', id: 'DATE_TIME', group: 'Common' },
        { label: 'IP address', id: 'IP_ADDRESS', group: 'Common' },
        { label: 'URL', id: 'URL', group: 'Common' },
        { label: 'Credit card number', id: 'CREDIT_CARD', group: 'Common' },
        { label: 'International bank account number (IBAN)', id: 'IBAN_CODE', group: 'Common' },
        { label: 'Cryptocurrency wallet address', id: 'CRYPTO', group: 'Common' },
        { label: 'Medical license number', id: 'MEDICAL_LICENSE', group: 'Common' },
        { label: 'Nationality / religion / political group', id: 'NRP', group: 'Common' },

        // USA
        { label: 'US bank account number', id: 'US_BANK_NUMBER', group: 'USA' },
        { label: 'US driver license number', id: 'US_DRIVER_LICENSE', group: 'USA' },
        {
          label: 'US individual taxpayer identification number (ITIN)',
          id: 'US_ITIN',
          group: 'USA',
        },
        { label: 'US passport number', id: 'US_PASSPORT', group: 'USA' },
        { label: 'US Social Security number', id: 'US_SSN', group: 'USA' },

        // UK
        { label: 'UK National Insurance number', id: 'UK_NINO', group: 'UK' },
        { label: 'UK NHS number', id: 'UK_NHS', group: 'UK' },

        // Spain
        { label: 'Spanish NIF number', id: 'ES_NIF', group: 'Spain' },
        { label: 'Spanish NIE number', id: 'ES_NIE', group: 'Spain' },

        // Italy
        { label: 'Italian fiscal code', id: 'IT_FISCAL_CODE', group: 'Italy' },
        { label: 'Italian driver license', id: 'IT_DRIVER_LICENSE', group: 'Italy' },
        { label: 'Italian identity card', id: 'IT_IDENTITY_CARD', group: 'Italy' },
        { label: 'Italian passport', id: 'IT_PASSPORT', group: 'Italy' },

        // Poland
        { label: 'Polish PESEL', id: 'PL_PESEL', group: 'Poland' },

        // Singapore
        { label: 'Singapore NRIC/FIN', id: 'SG_NRIC_FIN', group: 'Singapore' },

        // Australia
        { label: 'Australian business number (ABN)', id: 'AU_ABN', group: 'Australia' },
        { label: 'Australian company number (ACN)', id: 'AU_ACN', group: 'Australia' },
        { label: 'Australian tax file number (TFN)', id: 'AU_TFN', group: 'Australia' },
        { label: 'Australian Medicare number', id: 'AU_MEDICARE', group: 'Australia' },

        // India
        { label: 'Indian Aadhaar', id: 'IN_AADHAAR', group: 'India' },
        { label: 'Indian PAN', id: 'IN_PAN', group: 'India' },
        { label: 'Indian vehicle registration', id: 'IN_VEHICLE_REGISTRATION', group: 'India' },
        { label: 'Indian voter number', id: 'IN_VOTER', group: 'India' },
        { label: 'Indian passport', id: 'IN_PASSPORT', group: 'India' },
      ],
      condition: {
        field: 'validationType',
        value: ['pii'],
      },
    },
    {
      id: 'piiMode',
      title: 'Action',
      type: 'dropdown',
      required: true,
      options: [
        { label: 'Block Request', id: 'block' },
        { label: 'Mask PII', id: 'mask' },
      ],
      defaultValue: 'block',
      condition: {
        field: 'validationType',
        value: ['pii'],
      },
    },
    {
      id: 'piiLanguage',
      title: 'Language',
      type: 'dropdown',
      options: [
        { label: 'English', id: 'en' },
        { label: 'Spanish', id: 'es' },
        { label: 'Italian', id: 'it' },
        { label: 'Polish', id: 'pl' },
        { label: 'Finnish', id: 'fi' },
      ],
      defaultValue: 'en',
      condition: {
        field: 'validationType',
        value: ['pii'],
      },
    },
  ],
  tools: {
    access: ['guardrails_validate'],
  },
  inputs: {
    input: {
      type: 'string',
      description: 'Content to validate (automatically receives input from wired block)',
    },
    validationType: {
      type: 'string',
      description: 'Type of validation to perform (json, regex, hallucination, or pii)',
    },
    regex: {
      type: 'string',
      description: 'Regex pattern for regex validation',
    },
    knowledgeBaseId: {
      type: 'string',
      description: 'Knowledge base ID for hallucination check',
    },
    threshold: {
      type: 'string',
      description: 'Confidence threshold (0-10 scale, default: 3, scores below fail)',
    },
    topK: {
      type: 'string',
      description: 'Number of chunks to retrieve from knowledge base (default: 5)',
    },
    model: {
      type: 'string',
      description: 'LLM model for hallucination scoring (default: gpt-4o-mini)',
    },
    apiKey: {
      type: 'string',
      description: 'API key for LLM provider (optional if using hosted)',
    },
    piiEntityTypes: {
      type: 'json',
      description: 'PII entity types to detect (array of strings, empty = detect all)',
    },
    piiMode: {
      type: 'string',
      description: 'PII action mode: block or mask',
    },
    piiLanguage: {
      type: 'string',
      description: 'Language for PII detection (default: en)',
    },
  },
  outputs: {
    input: {
      type: 'string',
      description: 'Original input that was validated',
    },
    maskedText: {
      type: 'string',
      description: 'Text with PII masked (only for PII detection in mask mode)',
    },
    validationType: {
      type: 'string',
      description: 'Type of validation performed',
    },
    passed: {
      type: 'boolean',
      description: 'Whether validation passed (true/false)',
    },
    score: {
      type: 'number',
      description:
        'Confidence score (0-10, 0=hallucination, 10=grounded, only for hallucination check)',
    },
    reasoning: {
      type: 'string',
      description: 'Reasoning for confidence score (only for hallucination check)',
    },
    detectedEntities: {
      type: 'array',
      description: 'Detected PII entities (only for PII detection)',
    },
    error: {
      type: 'string',
      description: 'Error message if validation failed',
    },
  },
}
```

--------------------------------------------------------------------------------

````
