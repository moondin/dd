---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 510
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 510 of 933)

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

---[FILE: index.mdx]---
Location: sim-main/apps/sim/content/blog/openai-vs-n8n-vs-sim/index.mdx

```text
---
slug: openai-vs-n8n-vs-sim
title: 'OpenAI AgentKit vs n8n vs Sim: AI Agent Workflow Builder Comparison'
description: OpenAI just released AgentKit for building AI agents. How does it compare to workflow automation platforms like n8n and purpose-built AI agent builders like Sim?
date: 2025-10-06
updated: 2025-10-06
authors:
  - emir
readingTime: 9
tags: [AI Agents, Workflow Automation, OpenAI AgentKit, n8n, Sim, MCP]
ogImage: /studio/openai-vs-n8n-vs-sim/workflow.png
canonical: https://sim.ai/studio/openai-vs-n8n-vs-sim
draft: false
---

When building AI agent workflows, developers often evaluate multiple platforms to find the right fit for their needs. Three platforms frequently come up in these discussions: OpenAI's new AgentKit, the established workflow automation tool n8n, and Sim, a purpose-built AI agent workflow builder. While all three enable AI agent development, they take fundamentally different approaches, each with distinct strengths and ideal use cases.

## What is OpenAI AgentKit?

OpenAI AgentKit is a set of building blocks designed to help developers take AI agents from prototype to production. Built on top of the OpenAI Responses API, it provides a structured approach to building and deploying intelligent agents.

![OpenAI AgentKit workflow interface](/studio/openai-vs-n8n-vs-sim/openai.png)

### Core Features

#### Agent Builder Canvas

AgentKit provides a visual canvas where developers can design and build agents. This interface allows you to model complex workflows visually, making it easier to understand and iterate on agent behavior. The builder is powered by OpenAI's Responses API.

#### ChatKit for Embedded Interfaces

ChatKit enables developers to embed chat interfaces to run workflows directly within their applications. It includes custom widgets that you can create and integrate, with the ability to preview interfaces right in the workflow builder before deployment.

![OpenAI AgentKit custom widgets interface](/studio/openai-vs-n8n-vs-sim/widgets.png)

#### Comprehensive Evaluation System

AgentKit includes out-of-the-box evaluation capabilities to measure agent performance. Features include datasets to assess agent nodes, prompt optimization tools, and the ability to run evaluations on external models beyond OpenAI's ecosystem.

#### Connectors and Integrations

The platform provides connectors to integrate with both internal tools and external services, enabling agents to interact with your existing tech stack.

#### API Publishing

Once your agent is ready, the publish feature allows you to integrate it as an API inside your codebase, making deployment straightforward.

#### Built-in Guardrails

AgentKit comes with guardrails out of the box, helping ensure agent behavior stays within defined boundaries and safety parameters.

### What AgentKit Doesn't Offer

While AgentKit is powerful for building agents, it has some limitations:

- Only able to run OpenAI models—no support for other AI providers
- Cannot make generic API requests in workflows—limited to MCP (Model Context Protocol) integrations only
- Not an open-source platform
- No workflow templates to accelerate development
- No execution logs or detailed monitoring for debugging and observability
- No ability to trigger workflows via external integrations
- Limited out-of-the-box integration options compared to dedicated workflow automation platforms

## What is n8n?

n8n is a workflow automation platform that excels at connecting various services and APIs together. While it started as a general automation tool, n8n has evolved to support AI agent workflows alongside its traditional integration capabilities.

![n8n workflow automation interface](/studio/openai-vs-n8n-vs-sim/n8n.png)

### Core Capabilities

#### Extensive Integration Library

n8n's primary strength lies in its vast library of pre-built integrations. With hundreds of connectors for popular services, it makes it easy to connect disparate systems without writing custom code.

#### Visual Workflow Builder

The platform provides a node-based visual interface for building workflows. Users can drag and drop nodes representing different services and configure how data flows between them.

#### Flexible Triggering Options

n8n supports various ways to trigger workflows, including webhooks, scheduled executions, and manual triggers, making it versatile for different automation scenarios.

#### AI and LLM Integration

More recently, n8n has added support for AI models and agent-like capabilities, allowing users to incorporate language models into their automation workflows.

#### Self-Hosting Options

n8n offers both cloud-hosted and self-hosted deployment options, giving organizations control over their data and infrastructure.

### Primary Use Cases

n8n is best suited for:

- Traditional workflow automation and service integration
- Data synchronization between business tools
- Event-driven automation workflows
- Simple AI-enhanced automations

### What n8n Doesn't Offer

While n8n is excellent for traditional automation, it has some limitations for AI agent development:

- No SDK to build workflows programmatically—limited to visual builder only
- Not fully open source but fair-use licensed, with some restrictions
- Free trial limited to 14 days, after which paid plans are required
- Limited/complex parallel execution handling

## What is Sim?

Sim is a fully open-source platform (Apache 2.0 license) specifically designed for AI agent development. Unlike platforms that added AI capabilities as an afterthought, Sim was created from the ground up to address the unique challenges of building, testing, and deploying production-ready AI agents.

### Comprehensive AI Agent Platform

#### Visual AI Workflow Builder

Sim provides an intuitive drag-and-drop canvas where developers can build complex AI agent workflows visually. The platform supports sophisticated agent architectures, including multi-agent systems, conditional logic, loops, and parallel execution paths. Additionally, Sim's built-in AI Copilot can assist you directly in the editor, helping you build and modify workflows faster with intelligent suggestions and explanations.

![Sim visual workflow builder with AI agent blocks](/studio/openai-vs-n8n-vs-sim/sim.png)

#### AI Copilot for Workflow Building

Sim includes an intelligent in-editor AI assistant that helps you build and edit workflows faster. Copilot can explain complex concepts, suggest best practices, and even make changes to your workflow when you approve them. Using the @ context menu, you can reference workflows, blocks, knowledge bases, documentation, templates, and execution logs—giving Copilot the full context it needs to provide accurate, relevant assistance. This dramatically accelerates workflow development compared to building from scratch.

![Sim AI Copilot assisting with workflow development](/studio/openai-vs-n8n-vs-sim/copilot.png)

#### Pre-Built Workflow Templates

Get started quickly with Sim's extensive library of pre-built workflow templates. Browse templates across categories like Marketing, Sales, Finance, Support, and Artificial Intelligence. Each template is a production-ready workflow you can customize for your needs, saving hours of development time. Templates are created by the Sim team and community members, with popularity ratings and integration counts to help you find the right starting point.

![Sim workflow templates gallery](/studio/openai-vs-n8n-vs-sim/templates.png)

#### 80+ Built-in Integrations

Out of the box, Sim connects with 80+ services including multiple AI providers (OpenAI, Anthropic, Google, Groq, Cerebras, local Ollama models), communication tools (Gmail, Slack, Teams, Telegram, WhatsApp), productivity apps (Notion, Google Sheets, Airtable, Monday.com), and developer tools (GitHub, GitLab).

#### Multiple Trigger Options

Unlike AgentKit, Sim workflows can be triggered in multiple ways: chat interfaces, REST APIs, webhooks, scheduled jobs, or external events from integrated services like Slack and GitHub. This flexibility ensures your agents can be activated however your use case demands.

#### Real-Time Team Collaboration

Sim enables multiple team members to work simultaneously on the same workflow with real-time editing, commenting, and comprehensive permissions management. This makes it ideal for teams building complex agent systems together.

#### Advanced Agent Capabilities

The platform includes specialized blocks for AI agents, RAG (Retrieval-Augmented Generation) systems, function calling, code execution, data processing, and evaluation. These purpose-built components enable developers to create sophisticated agentic workflows without custom coding.

#### Intelligent Knowledge Base with Vector Search

Sim's native knowledge base goes far beyond simple document storage. Powered by pgvector, it provides semantic search that understands meaning and context, not just keywords. Upload documents in multiple formats (PDF, Word, Excel, Markdown, and more), and Sim automatically processes them with intelligent chunking, generates vector embeddings, and makes them instantly searchable. The knowledge base supports natural language queries, concept-based retrieval, multi-language understanding, and configurable chunk sizes (100-4,000 characters). This makes building RAG agents straightforward—your AI can search through your organization's knowledge with context-aware precision.

#### Comprehensive Execution Logging and Monitoring

Sim provides enterprise-grade logging that captures every detail of workflow execution. Track workflow runs with execution IDs, view block-level logs with precise timing and duration metrics, monitor token usage and costs per execution, and debug failures with detailed error traces and trace spans. The logging system integrates with Copilot—you can reference execution logs directly in your Copilot conversations to understand what happened and troubleshoot issues. This level of observability is essential for production AI agents where understanding behavior and debugging issues quickly is critical.

![Sim execution logs and monitoring dashboard](/studio/openai-vs-n8n-vs-sim/logs.png)

#### Custom Integrations via MCP Protocol

Beyond the 80+ built-in integrations, Sim supports the Model Context Protocol (MCP), allowing developers to create custom integrations for proprietary systems or specialized tools.

#### Flexible Deployment Options

Sim offers both cloud-hosted and self-hosted deployment options. Organizations can run Sim on their own infrastructure for complete control, or use the managed cloud service for simplicity. The platform is SOC2 and HIPAA compliant, ensuring enterprise-level security.

#### Production-Ready Infrastructure

The platform includes everything needed for production deployments: background job processing, webhook handling, monitoring, and API management. Workflows can be published as REST API endpoints, embedded via SDKs, or run through chat interfaces.

### What You Can Build with Sim

- **AI Assistants & Chatbots:** Intelligent agents that search the web, access calendars, send emails, and interact with business tools
- **Business Process Automation:** Automate repetitive tasks like data entry, report generation, customer support, and content creation
- **Data Processing & Analysis:** Extract insights from documents, analyze datasets, generate reports, and sync data between systems
- **API Integration Workflows:** Connect multiple services into unified endpoints and orchestrate complex business logic
- **RAG Systems:** Build sophisticated retrieval-augmented generation pipelines with custom knowledge bases

### Drawbacks to Consider

While Sim excels at AI agent workflows, there are some tradeoffs:

- Fewer pre-built integrations compared to n8n's extensive library—though Sim's 80+ integrations cover most AI agent use cases and MCP protocol enables custom integrations

## Key Differences

While all three platforms enable AI agent development, they excel in different areas:

### OpenAI AgentKit

**Best for:** Teams deeply invested in the OpenAI ecosystem who prioritize evaluation and testing capabilities. Ideal when you need tight integration with OpenAI's latest models and want built-in prompt optimization and evaluation tools.

**Limitations:** Locked into OpenAI models only, not open-source, no workflow templates or execution logs, limited triggering options, and fewer out-of-the-box integrations.

### n8n

**Best for:** Traditional workflow automation with some AI enhancement. Excellent when your primary need is connecting business tools and services, with AI as a complementary feature rather than the core focus.

**Limitations:** No SDK for programmatic workflow building, fair-use licensing (not fully open source), 14-day trial limitation, and AI agent capabilities are newer and less mature compared to its traditional automation features.

### Sim

**Best for:** Building production-ready AI agent workflows that require flexibility, collaboration, and comprehensive tooling. Ideal for teams that need AI Copilot assistance, advanced knowledge base features, detailed logging, and the ability to work across multiple AI providers with purpose-built agentic workflow tools.

**Limitations:** Fewer integrations than n8n's extensive library, though the 80+ built-in integrations and MCP protocol support cover most AI agent needs.

## Which Should You Choose?

The right platform depends on your specific needs and context:

Choose **OpenAI AgentKit** if you're exclusively using OpenAI models and want to build chat interfaces with the ChatKit. It's a solid choice for teams that want to stay within OpenAI's ecosystem and prioritize testing capabilities.

Choose **n8n** if your primary use case is traditional workflow automation between business tools, with occasional AI enhancement. It's ideal for organizations already familiar with n8n who want to add some AI capabilities to existing automations.

Choose **Sim** if you're building AI agents as your primary objective and need a platform purpose-built for that use case. Sim provides the most comprehensive feature set for agentic workflows, with AI Copilot to accelerate development, parallel execution handling, intelligent knowledge base for RAG applications, detailed execution logging for production monitoring, flexibility across AI providers, extensive integrations, team collaboration, and deployment options that scale from prototype to production.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/sim/content/blog/series-a/index.mdx

```text
---
slug: series-a
title: '$7M Series A'
description: We’re excited to share that Sim has raised a $7M Series A led by Standard Capital to accelerate our vision for agentic workflows.
date: 2025-11-12
updated: 2025-11-12
authors:
  - waleed
  - emir
readingTime: 4
tags: [Announcement, Funding, Series A, Sim, YCombinator]
ogImage: /studio/series-a/cover.png
ogAlt: 'Sim team photo in front of neon logo'
about: ['Artificial Intelligence', 'Agentic Workflows', 'Startups', 'Funding']
timeRequired: PT4M
canonical: https://sim.ai/studio/series-a
featured: true
draft: false
---

![Sim team photo](/studio/series-a/team.png)

## Why we’re excited

Today we’re announcing our $7M Series A led by Standard Capital with participation from Perplexity Fund, SV Angel, YCombinator, and notable angels like Paul Graham, Paul Bucheit, Ali Rowghani, Kaz Nejatian, and many more. 
This investment helps us double‑down on our mission: make it simple for teams to build, ship, and scale agentic workflows in production.

## How we got here

We started earlier this year in our apartment in San Francisco. 
The goal was to rebuild our entire previous company (if you can call it that) from scratch on a visual framework. 
We figured that if we could at least build an AI sales and marketing operation solely using building blocks on a canvas, then anyone could build anything. 
Soon after, we'd built the foundation of what would become Sim. 
We were hellbent on being Open Source from day one, and we're proud that we've stuck to that commitment. 

## Progress so far

In just a short few months, Sim has grown from 0->18k Github stars, 60,000+ developers on the platform, and 100+ companies ranging from startups to large enterprises using Sim in production. 
We've processed over 10M+ workflows and are growing rapidly. 
We've built a stellar team of engineers who are passionate about building the future of agentic workflows.

## Our vision

We believe the next wave of software is agentic. 
Teams will compose specialized agents that reason, retrieve, and act—safely and reliably—across their business. 
Our focus is to provide the infrastructure and UX that make this practical at scale: from prototyping to production, from single‑agent flows to complex multi‑agent systems. 

On one end of the spectrum, there are SDKs and frameworks that are complex and require a lot of code to build and manage, and on the other end of the spectrum, there are platforms that are easy to use but severely limit in what you can build. 
Sim offers a platform that is both easy to use and powerful enough to build complex agentic workflows.

If you strip away the applications, workflows are all that's left. They're the foundation of the software industry, and they're the foundation of the future powered by Sim.

## What’s next

We’ll invest in building the community around Sim, and we'll continue to be relentlessly focused on building the best platform for agentic workflows. 

## We’re hiring

If you’re excited about agentic systems and want to help define the future of this space, we’d love to talk. We’re hiring across engineering, engineering, and more engineering. Oh, and design. [Apply here](https://sim.ai/careers)

— Team Sim
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/executor/constants.ts

```typescript
export enum BlockType {
  PARALLEL = 'parallel',
  LOOP = 'loop',
  ROUTER = 'router',
  CONDITION = 'condition',

  START_TRIGGER = 'start_trigger',
  STARTER = 'starter',
  TRIGGER = 'trigger',

  FUNCTION = 'function',
  AGENT = 'agent',
  API = 'api',
  EVALUATOR = 'evaluator',
  VARIABLES = 'variables',

  RESPONSE = 'response',
  HUMAN_IN_THE_LOOP = 'human_in_the_loop',
  WORKFLOW = 'workflow',
  WORKFLOW_INPUT = 'workflow_input',

  WAIT = 'wait',

  NOTE = 'note',

  SENTINEL_START = 'sentinel_start',
  SENTINEL_END = 'sentinel_end',
}

export const TRIGGER_BLOCK_TYPES = [
  BlockType.START_TRIGGER,
  BlockType.STARTER,
  BlockType.TRIGGER,
] as const

export const METADATA_ONLY_BLOCK_TYPES = [
  BlockType.LOOP,
  BlockType.PARALLEL,
  BlockType.NOTE,
] as const

export type LoopType = 'for' | 'forEach' | 'while' | 'doWhile'

export type SentinelType = 'start' | 'end'

export type ParallelType = 'collection' | 'count'

export const EDGE = {
  CONDITION_PREFIX: 'condition-',
  CONDITION_TRUE: 'condition-true',
  CONDITION_FALSE: 'condition-false',
  ROUTER_PREFIX: 'router-',
  LOOP_CONTINUE: 'loop_continue',
  LOOP_CONTINUE_ALT: 'loop-continue-source',
  LOOP_EXIT: 'loop_exit',
  ERROR: 'error',
  SOURCE: 'source',
  DEFAULT: 'default',
} as const

export const LOOP = {
  TYPE: {
    FOR: 'for' as LoopType,
    FOR_EACH: 'forEach' as LoopType,
    WHILE: 'while' as LoopType,
    DO_WHILE: 'doWhile',
  },

  SENTINEL: {
    PREFIX: 'loop-',
    START_SUFFIX: '-sentinel-start',
    END_SUFFIX: '-sentinel-end',
    START_TYPE: 'start' as SentinelType,
    END_TYPE: 'end' as SentinelType,
    START_NAME_PREFIX: 'Loop Start',
    END_NAME_PREFIX: 'Loop End',
  },
} as const

export const PARALLEL = {
  TYPE: {
    COLLECTION: 'collection' as ParallelType,
    COUNT: 'count' as ParallelType,
  },

  BRANCH: {
    PREFIX: '₍',
    SUFFIX: '₎',
  },

  DEFAULT_COUNT: 1,
} as const

export const REFERENCE = {
  START: '<',
  END: '>',
  PATH_DELIMITER: '.',
  ENV_VAR_START: '{{',
  ENV_VAR_END: '}}',
  PREFIX: {
    LOOP: 'loop',
    PARALLEL: 'parallel',
    VARIABLE: 'variable',
  },
} as const

export const SPECIAL_REFERENCE_PREFIXES = [
  REFERENCE.PREFIX.LOOP,
  REFERENCE.PREFIX.PARALLEL,
  REFERENCE.PREFIX.VARIABLE,
] as const

export const LOOP_REFERENCE = {
  ITERATION: 'iteration',
  INDEX: 'index',
  ITEM: 'item',
  INDEX_PATH: 'loop.index',
} as const

export const PARALLEL_REFERENCE = {
  INDEX: 'index',
  CURRENT_ITEM: 'currentItem',
  ITEMS: 'items',
} as const

export const DEFAULTS = {
  BLOCK_TYPE: 'unknown',
  BLOCK_TITLE: 'Untitled Block',
  WORKFLOW_NAME: 'Workflow',
  MAX_LOOP_ITERATIONS: 1000,
  MAX_WORKFLOW_DEPTH: 10,
  EXECUTION_TIME: 0,
  TOKENS: {
    PROMPT: 0,
    COMPLETION: 0,
    TOTAL: 0,
  },
  COST: {
    INPUT: 0,
    OUTPUT: 0,
    TOTAL: 0,
  },
} as const

export const HTTP = {
  STATUS: {
    OK: 200,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500,
  },
  CONTENT_TYPE: {
    JSON: 'application/json',
    EVENT_STREAM: 'text/event-stream',
  },
} as const

export const AGENT = {
  DEFAULT_MODEL: 'claude-sonnet-4-5',
  DEFAULT_FUNCTION_TIMEOUT: 600000, // 10 minutes for custom tool code execution
  REQUEST_TIMEOUT: 600000, // 10 minutes for LLM API requests
  CUSTOM_TOOL_PREFIX: 'custom_',
} as const

export const ROUTER = {
  DEFAULT_MODEL: 'gpt-4o',
  DEFAULT_TEMPERATURE: 0,
  INFERENCE_TEMPERATURE: 0.1,
} as const

export const EVALUATOR = {
  DEFAULT_MODEL: 'gpt-4o',
  DEFAULT_TEMPERATURE: 0.1,
  RESPONSE_SCHEMA_NAME: 'evaluation_response',
  JSON_INDENT: 2,
} as const

export const CONDITION = {
  ELSE_LABEL: 'else',
  ELSE_TITLE: 'else',
} as const

export const PAUSE_RESUME = {
  OPERATION: {
    HUMAN: 'human',
    API: 'api',
  },
  PATH: {
    API_RESUME: '/api/resume',
    UI_RESUME: '/resume',
  },
} as const

export function buildResumeApiUrl(
  baseUrl: string | undefined,
  workflowId: string,
  executionId: string,
  contextId: string
): string {
  const prefix = baseUrl ?? ''
  return `${prefix}${PAUSE_RESUME.PATH.API_RESUME}/${workflowId}/${executionId}/${contextId}`
}

export function buildResumeUiUrl(
  baseUrl: string | undefined,
  workflowId: string,
  executionId: string
): string {
  const prefix = baseUrl ?? ''
  return `${prefix}${PAUSE_RESUME.PATH.UI_RESUME}/${workflowId}/${executionId}`
}

export const PARSING = {
  JSON_RADIX: 10,
  PREVIEW_LENGTH: 200,
  PREVIEW_SUFFIX: '...',
} as const

export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'files' | 'plain'

export interface ConditionConfig {
  id: string
  label?: string
  condition: string
}

export function isTriggerBlockType(blockType: string | undefined): boolean {
  return TRIGGER_BLOCK_TYPES.includes(blockType as any)
}

export function isMetadataOnlyBlockType(blockType: string | undefined): boolean {
  return METADATA_ONLY_BLOCK_TYPES.includes(blockType as any)
}

export function isWorkflowBlockType(blockType: string | undefined): boolean {
  return blockType === BlockType.WORKFLOW || blockType === BlockType.WORKFLOW_INPUT
}

export function isSentinelBlockType(blockType: string | undefined): boolean {
  return blockType === BlockType.SENTINEL_START || blockType === BlockType.SENTINEL_END
}

export function isConditionBlockType(blockType: string | undefined): boolean {
  return blockType === BlockType.CONDITION
}

export function isRouterBlockType(blockType: string | undefined): boolean {
  return blockType === BlockType.ROUTER
}

export function isAgentBlockType(blockType: string | undefined): boolean {
  return blockType === BlockType.AGENT
}

export function isAnnotationOnlyBlock(blockType: string | undefined): boolean {
  return blockType === BlockType.NOTE
}

export function supportsHandles(blockType: string | undefined): boolean {
  return !isAnnotationOnlyBlock(blockType)
}

export function getDefaultTokens() {
  return {
    prompt: DEFAULTS.TOKENS.PROMPT,
    completion: DEFAULTS.TOKENS.COMPLETION,
    total: DEFAULTS.TOKENS.TOTAL,
  }
}

export function getDefaultCost() {
  return {
    input: DEFAULTS.COST.INPUT,
    output: DEFAULTS.COST.OUTPUT,
    total: DEFAULTS.COST.TOTAL,
  }
}

export function buildReference(path: string): string {
  return `${REFERENCE.START}${path}${REFERENCE.END}`
}

export function buildLoopReference(property: string): string {
  return buildReference(`${REFERENCE.PREFIX.LOOP}${REFERENCE.PATH_DELIMITER}${property}`)
}

export function buildParallelReference(property: string): string {
  return buildReference(`${REFERENCE.PREFIX.PARALLEL}${REFERENCE.PATH_DELIMITER}${property}`)
}

export function buildVariableReference(variableName: string): string {
  return buildReference(`${REFERENCE.PREFIX.VARIABLE}${REFERENCE.PATH_DELIMITER}${variableName}`)
}

export function buildBlockReference(blockId: string, path?: string): string {
  return buildReference(path ? `${blockId}${REFERENCE.PATH_DELIMITER}${path}` : blockId)
}

export function buildLoopIndexCondition(maxIterations: number): string {
  return `${buildLoopReference(LOOP_REFERENCE.INDEX)} < ${maxIterations}`
}

export function buildEnvVarReference(varName: string): string {
  return `${REFERENCE.ENV_VAR_START}${varName}${REFERENCE.ENV_VAR_END}`
}

export function isReference(value: string): boolean {
  return value.startsWith(REFERENCE.START) && value.endsWith(REFERENCE.END)
}

export function isEnvVarReference(value: string): boolean {
  return value.startsWith(REFERENCE.ENV_VAR_START) && value.endsWith(REFERENCE.ENV_VAR_END)
}

export function extractEnvVarName(reference: string): string {
  return reference.substring(
    REFERENCE.ENV_VAR_START.length,
    reference.length - REFERENCE.ENV_VAR_END.length
  )
}

export function extractReferenceContent(reference: string): string {
  return reference.substring(REFERENCE.START.length, reference.length - REFERENCE.END.length)
}

export function parseReferencePath(reference: string): string[] {
  const content = extractReferenceContent(reference)
  return content.split(REFERENCE.PATH_DELIMITER)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/executor/index.ts

```typescript
/**
 * Executor - Main entry point
 * Exports the DAG executor as the default executor
 */

export { DAGExecutor as Executor } from '@/executor/execution/executor'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/executor/types.ts

```typescript
import type { TraceSpan } from '@/lib/logs/types'
import type { BlockOutput } from '@/blocks/types'
import type { SerializedBlock, SerializedWorkflow } from '@/serializer/types'

export interface UserFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  key: string
  context?: string
}

export interface ParallelPauseScope {
  parallelId: string
  branchIndex: number
  branchTotal?: number
}

export interface LoopPauseScope {
  loopId: string
  iteration: number
}

export interface PauseMetadata {
  contextId: string
  blockId: string
  response: any
  timestamp: string
  parallelScope?: ParallelPauseScope
  loopScope?: LoopPauseScope
  resumeLinks?: {
    apiUrl: string
    uiUrl: string
    contextId: string
    executionId: string
    workflowId: string
  }
}

export type ResumeStatus = 'paused' | 'resumed' | 'failed' | 'queued' | 'resuming'

export interface PausePoint {
  contextId: string
  blockId?: string
  response: any
  registeredAt: string
  resumeStatus: ResumeStatus
  snapshotReady: boolean
  parallelScope?: ParallelPauseScope
  loopScope?: LoopPauseScope
  resumeLinks?: {
    apiUrl: string
    uiUrl: string
    contextId: string
    executionId: string
    workflowId: string
  }
}

export interface SerializedSnapshot {
  snapshot: string
  triggerIds: string[]
}

export interface NormalizedBlockOutput {
  [key: string]: any
  content?: string
  model?: string
  tokens?: {
    prompt?: number
    completion?: number
    total?: number
  }
  toolCalls?: {
    list: any[]
    count: number
  }
  files?: UserFile[]
  selectedPath?: {
    blockId: string
    blockType?: string
    blockTitle?: string
  }
  selectedOption?: string
  conditionResult?: boolean
  result?: any
  stdout?: string
  executionTime?: number
  data?: any
  status?: number
  headers?: Record<string, string>
  error?: string
  childTraceSpans?: TraceSpan[]
  childWorkflowName?: string
  _pauseMetadata?: PauseMetadata
}

export interface BlockLog {
  blockId: string
  blockName?: string
  blockType?: string
  startedAt: string
  endedAt: string
  durationMs: number
  success: boolean
  output?: any
  input?: any
  error?: string
  loopId?: string
  parallelId?: string
  iterationIndex?: number
}

export interface ExecutionMetadata {
  requestId?: string
  workflowId?: string
  workspaceId?: string
  startTime?: string
  endTime?: string
  duration: number
  pendingBlocks?: string[]
  isDebugSession?: boolean
  context?: ExecutionContext
  workflowConnections?: Array<{ source: string; target: string }>
  status?: 'running' | 'paused' | 'completed'
  pausePoints?: string[]
  resumeChain?: {
    parentExecutionId?: string
    depth: number
  }
  userId?: string
  executionId?: string
  triggerType?: string
  triggerBlockId?: string
  useDraftState?: boolean
  resumeFromSnapshot?: boolean
}

export interface BlockState {
  output: NormalizedBlockOutput
  executed: boolean
  executionTime: number
}

export interface ExecutionContext {
  workflowId: string
  workspaceId?: string
  executionId?: string
  userId?: string
  isDeployedContext?: boolean

  blockStates: ReadonlyMap<string, BlockState>
  executedBlocks: ReadonlySet<string>

  blockLogs: BlockLog[]
  metadata: ExecutionMetadata
  environmentVariables: Record<string, string>
  workflowVariables?: Record<string, any>

  decisions: {
    router: Map<string, string>
    condition: Map<string, string>
  }

  completedLoops: Set<string>

  loopExecutions?: Map<
    string,
    {
      iteration: number
      currentIterationOutputs: Map<string, any>
      allIterationOutputs: any[][]
      maxIterations?: number
      item?: any
      items?: any[]
      condition?: string
      skipFirstConditionCheck?: boolean
      loopType?: 'for' | 'forEach' | 'while' | 'doWhile'
    }
  >

  parallelExecutions?: Map<
    string,
    {
      parallelId: string
      totalBranches: number
      branchOutputs: Map<number, any[]>
      completedCount: number
      totalExpectedNodes: number
      parallelType?: 'count' | 'collection'
      items?: any[]
    }
  >

  parallelBlockMapping?: Map<
    string,
    {
      originalBlockId: string
      parallelId: string
      iterationIndex: number
    }
  >

  currentVirtualBlockId?: string

  activeExecutionPath: Set<string>

  workflow?: SerializedWorkflow

  stream?: boolean
  selectedOutputs?: string[]
  edges?: Array<{ source: string; target: string }>

  onStream?: (streamingExecution: StreamingExecution) => Promise<void>
  onBlockStart?: (blockId: string, blockName: string, blockType: string) => Promise<void>
  onBlockComplete?: (
    blockId: string,
    blockName: string,
    blockType: string,
    output: any
  ) => Promise<void>

  // Cancellation support
  isCancelled?: boolean

  // Dynamically added nodes that need to be scheduled (e.g., from parallel expansion)
  pendingDynamicNodes?: string[]
}

export interface ExecutionResult {
  success: boolean
  output: NormalizedBlockOutput
  error?: string
  logs?: BlockLog[]
  metadata?: ExecutionMetadata
  status?: 'completed' | 'paused'
  pausePoints?: PausePoint[]
  snapshotSeed?: SerializedSnapshot
  _streamingMetadata?: {
    loggingSession: any
    processedInput: any
  }
}

export interface StreamingExecution {
  stream: ReadableStream
  execution: ExecutionResult & { isStreaming?: boolean }
}

export interface BlockExecutor {
  canExecute(block: SerializedBlock): boolean

  execute(
    block: SerializedBlock,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<BlockOutput>
}

export interface BlockHandler {
  canHandle(block: SerializedBlock): boolean

  execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<BlockOutput | StreamingExecution>

  executeWithNode?: (
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>,
    nodeMetadata: {
      nodeId: string
      loopId?: string
      parallelId?: string
      branchIndex?: number
      branchTotal?: number
    }
  ) => Promise<BlockOutput | StreamingExecution>
}

export interface Tool<P = any, O = Record<string, any>> {
  id: string
  name: string
  description: string
  version: string

  params: {
    [key: string]: {
      type: string
      required?: boolean
      description?: string
      default?: any
    }
  }

  request?: {
    url?: string | ((params: P) => string)
    method?: string
    headers?: (params: P) => Record<string, string>
    body?: (params: P) => Record<string, any>
  }

  transformResponse?: (response: any) => Promise<{
    success: boolean
    output: O
    error?: string
  }>
}

export interface ToolRegistry {
  [key: string]: Tool
}

export interface ResponseFormatStreamProcessor {
  processStream(
    originalStream: ReadableStream,
    blockId: string,
    selectedOutputs: string[],
    responseFormat?: any
  ): ReadableStream
}
```

--------------------------------------------------------------------------------

````
