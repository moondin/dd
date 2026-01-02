---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 446
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 446 of 933)

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

---[FILE: registry.ts]---
Location: sim-main/apps/sim/blocks/registry.ts

```typescript
import { AgentBlock } from '@/blocks/blocks/agent'
import { AhrefsBlock } from '@/blocks/blocks/ahrefs'
import { AirtableBlock } from '@/blocks/blocks/airtable'
import { ApiBlock } from '@/blocks/blocks/api'
import { ApiTriggerBlock } from '@/blocks/blocks/api_trigger'
import { ApifyBlock } from '@/blocks/blocks/apify'
import { ApolloBlock } from '@/blocks/blocks/apollo'
import { ArxivBlock } from '@/blocks/blocks/arxiv'
import { AsanaBlock } from '@/blocks/blocks/asana'
// import { BoxBlock } from '@/blocks/blocks/box' // TODO: Box OAuth integration
import { BrowserUseBlock } from '@/blocks/blocks/browser_use'
import { CalendlyBlock } from '@/blocks/blocks/calendly'
import { ChatTriggerBlock } from '@/blocks/blocks/chat_trigger'
import { ClayBlock } from '@/blocks/blocks/clay'
import { ConditionBlock } from '@/blocks/blocks/condition'
import { ConfluenceBlock } from '@/blocks/blocks/confluence'
import { CursorBlock } from '@/blocks/blocks/cursor'
import { DatadogBlock } from '@/blocks/blocks/datadog'
import { DiscordBlock } from '@/blocks/blocks/discord'
import { DropboxBlock } from '@/blocks/blocks/dropbox'
import { DuckDuckGoBlock } from '@/blocks/blocks/duckduckgo'
import { DynamoDBBlock } from '@/blocks/blocks/dynamodb'
import { ElasticsearchBlock } from '@/blocks/blocks/elasticsearch'
import { ElevenLabsBlock } from '@/blocks/blocks/elevenlabs'
import { EvaluatorBlock } from '@/blocks/blocks/evaluator'
import { ExaBlock } from '@/blocks/blocks/exa'
import { FileBlock } from '@/blocks/blocks/file'
import { FirecrawlBlock } from '@/blocks/blocks/firecrawl'
import { FunctionBlock } from '@/blocks/blocks/function'
import { GenericWebhookBlock } from '@/blocks/blocks/generic_webhook'
import { GitHubBlock } from '@/blocks/blocks/github'
import { GitLabBlock } from '@/blocks/blocks/gitlab'
import { GmailBlock } from '@/blocks/blocks/gmail'
import { GoogleSearchBlock } from '@/blocks/blocks/google'
import { GoogleCalendarBlock } from '@/blocks/blocks/google_calendar'
import { GoogleDocsBlock } from '@/blocks/blocks/google_docs'
import { GoogleDriveBlock } from '@/blocks/blocks/google_drive'
import { GoogleFormsBlock } from '@/blocks/blocks/google_form'
import { GoogleGroupsBlock } from '@/blocks/blocks/google_groups'
import { GoogleSheetsBlock } from '@/blocks/blocks/google_sheets'
import { GoogleSlidesBlock } from '@/blocks/blocks/google_slides'
import { GoogleVaultBlock } from '@/blocks/blocks/google_vault'
import { GrafanaBlock } from '@/blocks/blocks/grafana'
import { GuardrailsBlock } from '@/blocks/blocks/guardrails'
import { HubSpotBlock } from '@/blocks/blocks/hubspot'
import { HuggingFaceBlock } from '@/blocks/blocks/huggingface'
import { HumanInTheLoopBlock } from '@/blocks/blocks/human_in_the_loop'
import { HunterBlock } from '@/blocks/blocks/hunter'
import { ImageGeneratorBlock } from '@/blocks/blocks/image_generator'
import { IncidentioBlock } from '@/blocks/blocks/incidentio'
import { InputTriggerBlock } from '@/blocks/blocks/input_trigger'
import { IntercomBlock } from '@/blocks/blocks/intercom'
import { JinaBlock } from '@/blocks/blocks/jina'
import { JiraBlock } from '@/blocks/blocks/jira'
import { KalshiBlock } from '@/blocks/blocks/kalshi'
import { KnowledgeBlock } from '@/blocks/blocks/knowledge'
import { LinearBlock } from '@/blocks/blocks/linear'
import { LinkedInBlock } from '@/blocks/blocks/linkedin'
import { LinkupBlock } from '@/blocks/blocks/linkup'
import { MailchimpBlock } from '@/blocks/blocks/mailchimp'
import { MailgunBlock } from '@/blocks/blocks/mailgun'
import { ManualTriggerBlock } from '@/blocks/blocks/manual_trigger'
import { McpBlock } from '@/blocks/blocks/mcp'
import { Mem0Block } from '@/blocks/blocks/mem0'
import { MemoryBlock } from '@/blocks/blocks/memory'
import { MicrosoftExcelBlock } from '@/blocks/blocks/microsoft_excel'
import { MicrosoftPlannerBlock } from '@/blocks/blocks/microsoft_planner'
import { MicrosoftTeamsBlock } from '@/blocks/blocks/microsoft_teams'
import { MistralParseBlock } from '@/blocks/blocks/mistral_parse'
import { MongoDBBlock } from '@/blocks/blocks/mongodb'
import { MySQLBlock } from '@/blocks/blocks/mysql'
import { Neo4jBlock } from '@/blocks/blocks/neo4j'
import { NoteBlock } from '@/blocks/blocks/note'
import { NotionBlock } from '@/blocks/blocks/notion'
import { OneDriveBlock } from '@/blocks/blocks/onedrive'
import { OpenAIBlock } from '@/blocks/blocks/openai'
import { OutlookBlock } from '@/blocks/blocks/outlook'
import { ParallelBlock } from '@/blocks/blocks/parallel'
import { PerplexityBlock } from '@/blocks/blocks/perplexity'
import { PineconeBlock } from '@/blocks/blocks/pinecone'
import { PipedriveBlock } from '@/blocks/blocks/pipedrive'
import { PolymarketBlock } from '@/blocks/blocks/polymarket'
import { PostgreSQLBlock } from '@/blocks/blocks/postgresql'
import { PostHogBlock } from '@/blocks/blocks/posthog'
import { QdrantBlock } from '@/blocks/blocks/qdrant'
import { RDSBlock } from '@/blocks/blocks/rds'
import { RedditBlock } from '@/blocks/blocks/reddit'
import { ResendBlock } from '@/blocks/blocks/resend'
import { ResponseBlock } from '@/blocks/blocks/response'
import { RouterBlock } from '@/blocks/blocks/router'
import { RssBlock } from '@/blocks/blocks/rss'
import { S3Block } from '@/blocks/blocks/s3'
import { SalesforceBlock } from '@/blocks/blocks/salesforce'
import { ScheduleBlock } from '@/blocks/blocks/schedule'
import { SearchBlock } from '@/blocks/blocks/search'
import { SendGridBlock } from '@/blocks/blocks/sendgrid'
import { SentryBlock } from '@/blocks/blocks/sentry'
import { SerperBlock } from '@/blocks/blocks/serper'
import { ServiceNowBlock } from '@/blocks/blocks/servicenow'
import { SftpBlock } from '@/blocks/blocks/sftp'
import { SharepointBlock } from '@/blocks/blocks/sharepoint'
import { ShopifyBlock } from '@/blocks/blocks/shopify'
import { SlackBlock } from '@/blocks/blocks/slack'
import { SmtpBlock } from '@/blocks/blocks/smtp'
import { SpotifyBlock } from '@/blocks/blocks/spotify'
import { SSHBlock } from '@/blocks/blocks/ssh'
import { StagehandBlock } from '@/blocks/blocks/stagehand'
import { StartTriggerBlock } from '@/blocks/blocks/start_trigger'
import { StarterBlock } from '@/blocks/blocks/starter'
import { StripeBlock } from '@/blocks/blocks/stripe'
import { SttBlock } from '@/blocks/blocks/stt'
import { SupabaseBlock } from '@/blocks/blocks/supabase'
import { TavilyBlock } from '@/blocks/blocks/tavily'
import { TelegramBlock } from '@/blocks/blocks/telegram'
import { ThinkingBlock } from '@/blocks/blocks/thinking'
import { TranslateBlock } from '@/blocks/blocks/translate'
import { TrelloBlock } from '@/blocks/blocks/trello'
import { TtsBlock } from '@/blocks/blocks/tts'
import { TwilioSMSBlock } from '@/blocks/blocks/twilio'
import { TwilioVoiceBlock } from '@/blocks/blocks/twilio_voice'
import { TypeformBlock } from '@/blocks/blocks/typeform'
import { VariablesBlock } from '@/blocks/blocks/variables'
import { VideoGeneratorBlock } from '@/blocks/blocks/video_generator'
import { VisionBlock } from '@/blocks/blocks/vision'
import { WaitBlock } from '@/blocks/blocks/wait'
import { WealthboxBlock } from '@/blocks/blocks/wealthbox'
import { WebflowBlock } from '@/blocks/blocks/webflow'
import { WebhookBlock } from '@/blocks/blocks/webhook'
import { WhatsAppBlock } from '@/blocks/blocks/whatsapp'
import { WikipediaBlock } from '@/blocks/blocks/wikipedia'
import { WordPressBlock } from '@/blocks/blocks/wordpress'
import { WorkflowBlock } from '@/blocks/blocks/workflow'
import { WorkflowInputBlock } from '@/blocks/blocks/workflow_input'
import { XBlock } from '@/blocks/blocks/x'
import { YouTubeBlock } from '@/blocks/blocks/youtube'
import { ZendeskBlock } from '@/blocks/blocks/zendesk'
import { ZepBlock } from '@/blocks/blocks/zep'
import { ZoomBlock } from '@/blocks/blocks/zoom'
import type { BlockConfig } from '@/blocks/types'
import { SQSBlock } from './blocks/sqs'

// Registry of all available blocks, alphabetically sorted
export const registry: Record<string, BlockConfig> = {
  agent: AgentBlock,
  ahrefs: AhrefsBlock,
  airtable: AirtableBlock,
  api: ApiBlock,
  api_trigger: ApiTriggerBlock,
  apify: ApifyBlock,
  apollo: ApolloBlock,
  arxiv: ArxivBlock,
  asana: AsanaBlock,
  // box: BoxBlock, // TODO: Box OAuth integration
  browser_use: BrowserUseBlock,
  calendly: CalendlyBlock,
  chat_trigger: ChatTriggerBlock,
  clay: ClayBlock,
  condition: ConditionBlock,
  confluence: ConfluenceBlock,
  cursor: CursorBlock,
  datadog: DatadogBlock,
  discord: DiscordBlock,
  dropbox: DropboxBlock,
  duckduckgo: DuckDuckGoBlock,
  elevenlabs: ElevenLabsBlock,
  elasticsearch: ElasticsearchBlock,
  evaluator: EvaluatorBlock,
  exa: ExaBlock,
  file: FileBlock,
  firecrawl: FirecrawlBlock,
  function: FunctionBlock,
  generic_webhook: GenericWebhookBlock,
  github: GitHubBlock,
  gitlab: GitLabBlock,
  gmail: GmailBlock,
  grafana: GrafanaBlock,
  guardrails: GuardrailsBlock,
  google_calendar: GoogleCalendarBlock,
  google_docs: GoogleDocsBlock,
  google_drive: GoogleDriveBlock,
  google_forms: GoogleFormsBlock,
  google_search: GoogleSearchBlock,
  google_sheets: GoogleSheetsBlock,
  google_slides: GoogleSlidesBlock,
  google_vault: GoogleVaultBlock,
  google_groups: GoogleGroupsBlock,
  hubspot: HubSpotBlock,
  huggingface: HuggingFaceBlock,
  human_in_the_loop: HumanInTheLoopBlock,
  hunter: HunterBlock,
  image_generator: ImageGeneratorBlock,
  incidentio: IncidentioBlock,
  input_trigger: InputTriggerBlock,
  intercom: IntercomBlock,
  jina: JinaBlock,
  jira: JiraBlock,
  kalshi: KalshiBlock,
  knowledge: KnowledgeBlock,
  linear: LinearBlock,
  linkedin: LinkedInBlock,
  linkup: LinkupBlock,
  mailchimp: MailchimpBlock,
  mailgun: MailgunBlock,
  manual_trigger: ManualTriggerBlock,
  mcp: McpBlock,
  mem0: Mem0Block,
  memory: MemoryBlock,
  microsoft_excel: MicrosoftExcelBlock,
  microsoft_planner: MicrosoftPlannerBlock,
  microsoft_teams: MicrosoftTeamsBlock,
  mistral_parse: MistralParseBlock,
  mongodb: MongoDBBlock,
  mysql: MySQLBlock,
  neo4j: Neo4jBlock,
  note: NoteBlock,
  notion: NotionBlock,
  onedrive: OneDriveBlock,
  openai: OpenAIBlock,
  outlook: OutlookBlock,
  parallel_ai: ParallelBlock,
  perplexity: PerplexityBlock,
  pinecone: PineconeBlock,
  pipedrive: PipedriveBlock,
  polymarket: PolymarketBlock,
  postgresql: PostgreSQLBlock,
  posthog: PostHogBlock,
  qdrant: QdrantBlock,
  rds: RDSBlock,
  sqs: SQSBlock,
  dynamodb: DynamoDBBlock,
  reddit: RedditBlock,
  resend: ResendBlock,
  response: ResponseBlock,
  rss: RssBlock,
  router: RouterBlock,
  s3: S3Block,
  salesforce: SalesforceBlock,
  schedule: ScheduleBlock,
  search: SearchBlock,
  sendgrid: SendGridBlock,
  sentry: SentryBlock,
  servicenow: ServiceNowBlock,
  serper: SerperBlock,
  sharepoint: SharepointBlock,
  shopify: ShopifyBlock,
  slack: SlackBlock,
  spotify: SpotifyBlock,
  smtp: SmtpBlock,
  sftp: SftpBlock,
  ssh: SSHBlock,
  stagehand: StagehandBlock,
  starter: StarterBlock,
  start_trigger: StartTriggerBlock,
  stt: SttBlock,
  tts: TtsBlock,
  stripe: StripeBlock,
  supabase: SupabaseBlock,
  tavily: TavilyBlock,
  telegram: TelegramBlock,
  thinking: ThinkingBlock,
  translate: TranslateBlock,
  trello: TrelloBlock,
  twilio_sms: TwilioSMSBlock,
  twilio_voice: TwilioVoiceBlock,
  typeform: TypeformBlock,
  variables: VariablesBlock,
  video_generator: VideoGeneratorBlock,
  vision: VisionBlock,
  wait: WaitBlock,
  wealthbox: WealthboxBlock,
  webflow: WebflowBlock,
  webhook: WebhookBlock,
  whatsapp: WhatsAppBlock,
  wikipedia: WikipediaBlock,
  wordpress: WordPressBlock,
  workflow: WorkflowBlock,
  workflow_input: WorkflowInputBlock,
  x: XBlock,
  youtube: YouTubeBlock,
  zep: ZepBlock,
  zendesk: ZendeskBlock,
  zoom: ZoomBlock,
}

export const getBlock = (type: string): BlockConfig | undefined => {
  // Direct lookup first
  if (registry[type]) {
    return registry[type]
  }
  // Fallback: normalize hyphens to underscores (e.g., 'microsoft-teams' -> 'microsoft_teams')
  const normalized = type.replace(/-/g, '_')
  return registry[normalized]
}

export const getBlockByToolName = (toolName: string): BlockConfig | undefined => {
  return Object.values(registry).find((block) => block.tools?.access?.includes(toolName))
}

export const getBlocksByCategory = (category: 'blocks' | 'tools' | 'triggers'): BlockConfig[] =>
  Object.values(registry).filter((block) => block.category === category)

export const getAllBlockTypes = (): string[] => Object.keys(registry)

export const isValidBlockType = (type: string): type is string =>
  type in registry || type.replace(/-/g, '_') in registry

export const getAllBlocks = (): BlockConfig[] => Object.values(registry)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/blocks/types.ts
Signals: React

```typescript
import type { JSX, SVGProps } from 'react'
import type { ToolResponse } from '@/tools/types'

export type BlockIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element
export type ParamType = 'string' | 'number' | 'boolean' | 'json' | 'array'
export type PrimitiveValueType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'json'
  | 'array'
  | 'files'
  | 'any'

export type BlockCategory = 'blocks' | 'tools' | 'triggers'

// Authentication modes for sub-blocks and summaries
export enum AuthMode {
  OAuth = 'oauth',
  ApiKey = 'api_key',
  BotToken = 'bot_token',
}

export type GenerationType =
  | 'javascript-function-body'
  | 'typescript-function-body'
  | 'json-schema'
  | 'json-object'
  | 'system-prompt'
  | 'custom-tool-schema'
  | 'sql-query'
  | 'postgrest'
  | 'mongodb-filter'
  | 'mongodb-pipeline'
  | 'mongodb-sort'
  | 'mongodb-documents'
  | 'mongodb-update'
  | 'neo4j-cypher'
  | 'neo4j-parameters'

export type SubBlockType =
  | 'short-input' // Single line input
  | 'long-input' // Multi-line input
  | 'dropdown' // Select menu
  | 'combobox' // Searchable dropdown with text input
  | 'slider' // Range input
  | 'table' // Grid layout
  | 'code' // Code editor
  | 'switch' // Toggle button
  | 'tool-input' // Tool configuration
  | 'checkbox-list' // Multiple selection
  | 'grouped-checkbox-list' // Grouped, scrollable checkbox list with select all
  | 'condition-input' // Conditional logic
  | 'eval-input' // Evaluation input
  | 'time-input' // Time input
  | 'oauth-input' // OAuth credential selector
  | 'webhook-config' // Webhook configuration
  | 'schedule-save' // Schedule save button with status display
  | 'file-selector' // File selector for Google Drive, etc.
  | 'project-selector' // Project selector for Jira, Discord, etc.
  | 'channel-selector' // Channel selector for Slack, Discord, etc.
  | 'user-selector' // User selector for Slack, etc.
  | 'folder-selector' // Folder selector for Gmail, etc.
  | 'knowledge-base-selector' // Knowledge base selector
  | 'knowledge-tag-filters' // Multiple tag filters for knowledge bases
  | 'document-selector' // Document selector for knowledge bases
  | 'document-tag-entry' // Document tag entry for creating documents
  | 'mcp-server-selector' // MCP server selector
  | 'mcp-tool-selector' // MCP tool selector
  | 'mcp-dynamic-args' // MCP dynamic arguments based on tool schema
  | 'input-format' // Input structure format
  | 'response-format' // Response structure format
  | 'trigger-save' // Trigger save button with validation
  | 'file-upload' // File uploader
  | 'input-mapping' // Map parent variables to child workflow input schema
  | 'variables-input' // Variable assignments for updating workflow variables
  | 'messages-input' // Multiple message inputs with role and content for LLM message history
  | 'workflow-selector' // Workflow selector for agent tools
  | 'workflow-input-mapper' // Dynamic workflow input mapper based on selected workflow
  | 'text' // Read-only text display

/**
 * Selector types that require display name hydration
 * These show IDs/keys that need to be resolved to human-readable names
 */
export const SELECTOR_TYPES_HYDRATION_REQUIRED: SubBlockType[] = [
  'oauth-input',
  'channel-selector',
  'user-selector',
  'file-selector',
  'folder-selector',
  'project-selector',
  'knowledge-base-selector',
  'workflow-selector',
  'document-selector',
  'variables-input',
  'mcp-server-selector',
  'mcp-tool-selector',
] as const

export type ExtractToolOutput<T> = T extends ToolResponse ? T['output'] : never

export type ToolOutputToValueType<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends string
        ? 'string'
        : T[K] extends number
          ? 'number'
          : T[K] extends boolean
            ? 'boolean'
            : T[K] extends object
              ? 'json'
              : 'any'
    }
  : never

export type BlockOutput =
  | PrimitiveValueType
  | { [key: string]: PrimitiveValueType | Record<string, any> }

/**
 * Condition for showing an output field.
 * Uses the same pattern as SubBlockConfig.condition
 */
export interface OutputCondition {
  field: string
  value: string | number | boolean | Array<string | number | boolean>
  not?: boolean
  and?: {
    field: string
    value: string | number | boolean | Array<string | number | boolean> | undefined
    not?: boolean
  }
}

export type OutputFieldDefinition =
  | PrimitiveValueType
  | {
      type: PrimitiveValueType
      description?: string
      /**
       * Optional condition for when this output should be shown.
       * If not specified, the output is always shown.
       * Uses the same condition format as subBlocks.
       */
      condition?: OutputCondition
    }

export interface ParamConfig {
  type: ParamType
  description?: string
  schema?: {
    type: string
    properties: Record<string, any>
    required?: string[]
    additionalProperties?: boolean
    items?: {
      type: string
      properties?: Record<string, any>
      required?: string[]
      additionalProperties?: boolean
    }
  }
}

export interface SubBlockConfig {
  id: string
  title?: string
  type: SubBlockType
  mode?: 'basic' | 'advanced' | 'both' | 'trigger' // Default is 'both' if not specified. 'trigger' means only shown in trigger mode
  canonicalParamId?: string
  required?:
    | boolean
    | {
        field: string
        value: string | number | boolean | Array<string | number | boolean>
        not?: boolean
        and?: {
          field: string
          value: string | number | boolean | Array<string | number | boolean> | undefined
          not?: boolean
        }
      }
    | (() => {
        field: string
        value: string | number | boolean | Array<string | number | boolean>
        not?: boolean
        and?: {
          field: string
          value: string | number | boolean | Array<string | number | boolean> | undefined
          not?: boolean
        }
      })
  defaultValue?: string | number | boolean | Record<string, unknown> | Array<unknown>
  options?:
    | {
        label: string
        id: string
        icon?: React.ComponentType<{ className?: string }>
        group?: string
      }[]
    | (() => {
        label: string
        id: string
        icon?: React.ComponentType<{ className?: string }>
        group?: string
      }[])
  min?: number
  max?: number
  columns?: string[]
  placeholder?: string
  password?: boolean
  readOnly?: boolean
  showCopyButton?: boolean
  connectionDroppable?: boolean
  hidden?: boolean
  hideFromPreview?: boolean // Hide this subblock from the workflow block preview
  requiresFeature?: string // Environment variable name that must be truthy for this subblock to be visible
  description?: string
  value?: (params: Record<string, any>) => string
  grouped?: boolean
  scrollable?: boolean
  maxHeight?: number
  selectAllOption?: boolean
  condition?:
    | {
        field: string
        value: string | number | boolean | Array<string | number | boolean>
        not?: boolean
        and?: {
          field: string
          value: string | number | boolean | Array<string | number | boolean> | undefined
          not?: boolean
        }
      }
    | (() => {
        field: string
        value: string | number | boolean | Array<string | number | boolean>
        not?: boolean
        and?: {
          field: string
          value: string | number | boolean | Array<string | number | boolean> | undefined
          not?: boolean
        }
      })
  // Props specific to 'code' sub-block type
  language?: 'javascript' | 'json' | 'python'
  generationType?: GenerationType
  collapsible?: boolean // Whether the code block can be collapsed
  defaultCollapsed?: boolean // Whether the code block is collapsed by default
  // OAuth specific properties - serviceId is the canonical identifier for OAuth services
  serviceId?: string
  requiredScopes?: string[]
  // File selector specific properties
  mimeType?: string
  // File upload specific properties
  acceptedTypes?: string
  multiple?: boolean
  maxSize?: number
  // Slider-specific properties
  step?: number
  integer?: boolean
  // Long input specific properties
  rows?: number
  // Multi-select functionality
  multiSelect?: boolean
  // Wand configuration for AI assistance
  wandConfig?: {
    enabled: boolean
    prompt: string // Custom prompt template for this subblock
    generationType?: GenerationType // Optional custom generation type
    placeholder?: string // Custom placeholder for the prompt input
    maintainHistory?: boolean // Whether to maintain conversation history
  }
  /**
   * Declarative dependency hints for cross-field clearing or invalidation.
   * Supports two formats:
   * - Simple array: `['credential']` - all fields must have values (AND logic)
   * - Object with all/any: `{ all: ['authMethod'], any: ['credential', 'botToken'] }`
   *   - `all`: all listed fields must have values (AND logic)
   *   - `any`: at least one field must have a value (OR logic)
   */
  dependsOn?: string[] | { all?: string[]; any?: string[] }
  // Copyable-text specific: Use webhook URL from webhook management hook
  useWebhookUrl?: boolean
  // Trigger-save specific: The trigger ID for validation and saving
  triggerId?: string
  // Dropdown specific: Function to fetch options dynamically (for multi-select or single-select)
  fetchOptions?: (
    blockId: string,
    subBlockId: string
  ) => Promise<Array<{ label: string; id: string }>>
}

export interface BlockConfig<T extends ToolResponse = ToolResponse> {
  type: string
  name: string
  description: string
  category: BlockCategory
  longDescription?: string
  bestPractices?: string
  docsLink?: string
  bgColor: string
  icon: BlockIcon
  subBlocks: SubBlockConfig[]
  triggerAllowed?: boolean
  authMode?: AuthMode
  tools: {
    access: string[]
    config?: {
      tool: (params: Record<string, any>) => string
      params?: (params: Record<string, any>) => Record<string, any>
    }
  }
  inputs: Record<string, ParamConfig>
  outputs: Record<string, OutputFieldDefinition> & {
    visualization?: {
      type: 'image'
      url: string
    }
  }
  hideFromToolbar?: boolean
  triggers?: {
    enabled: boolean
    available: string[] // List of trigger IDs this block supports
  }
}

export interface OutputConfig {
  type: BlockOutput
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/blocks/utils.ts

```typescript
import type { BlockOutput, OutputFieldDefinition, SubBlockConfig } from '@/blocks/types'

/**
 * Checks if a field is included in the dependsOn config.
 * Handles both simple array format and object format with all/any fields.
 */
export function isDependency(dependsOn: SubBlockConfig['dependsOn'], field: string): boolean {
  if (!dependsOn) return false
  if (Array.isArray(dependsOn)) return dependsOn.includes(field)
  return dependsOn.all?.includes(field) || dependsOn.any?.includes(field) || false
}

/**
 * Gets all dependency fields as a flat array.
 * Handles both simple array format and object format with all/any fields.
 */
export function getDependsOnFields(dependsOn: SubBlockConfig['dependsOn']): string[] {
  if (!dependsOn) return []
  if (Array.isArray(dependsOn)) return dependsOn
  return [...(dependsOn.all || []), ...(dependsOn.any || [])]
}

export function resolveOutputType(
  outputs: Record<string, OutputFieldDefinition>
): Record<string, BlockOutput> {
  const resolvedOutputs: Record<string, BlockOutput> = {}

  for (const [key, outputType] of Object.entries(outputs)) {
    // Handle new format: { type: 'string', description: '...' }
    if (typeof outputType === 'object' && outputType !== null && 'type' in outputType) {
      resolvedOutputs[key] = outputType.type as BlockOutput
    } else {
      // Handle old format: just the type as string, or other object formats
      resolvedOutputs[key] = outputType as BlockOutput
    }
  }

  return resolvedOutputs
}
```

--------------------------------------------------------------------------------

---[FILE: agent.test.ts]---
Location: sim-main/apps/sim/blocks/blocks/agent.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AgentBlock } from '@/blocks/blocks/agent'

vi.mock('@/blocks', () => ({
  getAllBlocks: vi.fn(() => [
    {
      type: 'tool-type-1',
      tools: {
        access: ['tool-id-1'],
      },
    },
    {
      type: 'tool-type-2',
      tools: {
        access: ['tool-id-2'],
      },
    },
  ]),
}))

describe('AgentBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const paramsFunction = AgentBlock.tools.config?.params

  if (!paramsFunction) {
    throw new Error('AgentBlock.tools.config.params function is missing')
  }

  describe('tools.config.params function', () => {
    it('should pass through params when no tools array is provided', () => {
      const params = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        // No tools provided
      }

      const result = paramsFunction(params)
      expect(result).toEqual(params)
    })

    it('should filter out tools with usageControl set to "none"', () => {
      const params = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        tools: [
          {
            type: 'tool-type-1',
            title: 'Tool 1',
            usageControl: 'auto',
          },
          {
            type: 'tool-type-2',
            title: 'Tool 2',
            usageControl: 'none', // Should be filtered out
          },
          {
            type: 'custom-tool',
            title: 'Custom Tool',
            schema: {
              function: {
                name: 'custom_function',
                description: 'A custom function',
                parameters: { type: 'object', properties: {} },
              },
            },
            usageControl: 'force',
          },
        ],
      }

      const result = paramsFunction(params)

      // Verify that transformed tools contains only the tools not set to 'none'
      expect(result.tools.length).toBe(2)

      // Verify the tool titles (custom identifiers that we can check)
      const toolIds = result.tools.map((tool: any) => tool.name)
      expect(toolIds).toContain('Tool 1')
      expect(toolIds).not.toContain('Tool 2')
      expect(toolIds).toContain('Custom Tool')
    })

    it('should set default usageControl to "auto" if not specified', () => {
      const params = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        tools: [
          {
            type: 'tool-type-1',
            title: 'Tool 1',
            // No usageControl specified, should default to 'auto'
          },
        ],
      }

      const result = paramsFunction(params)

      // Verify that the tool has usageControl set to 'auto'
      expect(result.tools[0].usageControl).toBe('auto')
    })

    it('should correctly transform custom tools', () => {
      const params = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        tools: [
          {
            type: 'custom-tool',
            title: 'Custom Tool',
            schema: {
              function: {
                name: 'custom_function',
                description: 'A custom function description',
                parameters: {
                  type: 'object',
                  properties: {
                    param1: { type: 'string' },
                  },
                },
              },
            },
            usageControl: 'force',
          },
        ],
      }

      const result = paramsFunction(params)

      // Verify custom tool transformation
      expect(result.tools[0]).toEqual({
        id: 'custom_function',
        name: 'Custom Tool',
        description: 'A custom function description',
        params: {},
        parameters: {
          type: 'object',
          properties: {
            param1: { type: 'string' },
          },
        },
        type: 'custom-tool',
        usageControl: 'force',
      })
    })

    it('should handle an empty tools array', () => {
      const params = {
        model: 'gpt-4o',
        systemPrompt: 'You are a helpful assistant.',
        tools: [], // Empty array
      }

      const result = paramsFunction(params)

      // Verify that transformed tools is an empty array
      expect(result.tools).toEqual([])
    })
  })
})
```

--------------------------------------------------------------------------------

````
