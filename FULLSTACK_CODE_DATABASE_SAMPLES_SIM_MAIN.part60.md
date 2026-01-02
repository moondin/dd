---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 60
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 60 of 933)

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

---[FILE: costs.mdx]---
Location: sim-main/apps/docs/content/docs/en/execution/costs.mdx

```text
---
title: Cost Calculation
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim automatically calculates costs for all workflow executions, providing transparent pricing based on AI model usage and execution charges. Understanding these costs helps you optimize workflows and manage your budget effectively.

## How Costs Are Calculated

Every workflow execution includes two cost components:

**Base Execution Charge**: $0.001 per execution

**AI Model Usage**: Variable cost based on token consumption
```javascript
modelCost = (inputTokens × inputPrice + outputTokens × outputPrice) / 1,000,000
totalCost = baseExecutionCharge + modelCost
```

<Callout type="info">
  AI model prices are per million tokens. The calculation divides by 1,000,000 to get the actual cost. Workflows without AI blocks only incur the base execution charge.
</Callout>

## Model Breakdown in Logs

For workflows using AI blocks, you can view detailed cost information in the logs:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-cost.png"
    alt="Model Breakdown"
    width={600}
    height={400}
    className="my-6"
  />
</div>

The model breakdown shows:
- **Token Usage**: Input and output token counts for each model
- **Cost Breakdown**: Individual costs per model and operation
- **Model Distribution**: Which models were used and how many times
- **Total Cost**: Aggregate cost for the entire workflow execution

## Pricing Options

<Tabs items={['Hosted Models', 'Bring Your Own API Key']}>
  <Tab>
    **Hosted Models** - Sim provides API keys with a 2.5x pricing multiplier:

    **OpenAI**
    | Model | Base Price (Input/Output) | Hosted Price (Input/Output) |
    |-------|---------------------------|----------------------------|
    | GPT-5.1 | $1.25 / $10.00 | $3.13 / $25.00 |
    | GPT-5 | $1.25 / $10.00 | $3.13 / $25.00 |
    | GPT-5 Mini | $0.25 / $2.00 | $0.63 / $5.00 |
    | GPT-5 Nano | $0.05 / $0.40 | $0.13 / $1.00 |
    | GPT-4o | $2.50 / $10.00 | $6.25 / $25.00 |
    | GPT-4.1 | $2.00 / $8.00 | $5.00 / $20.00 |
    | GPT-4.1 Mini | $0.40 / $1.60 | $1.00 / $4.00 |
    | GPT-4.1 Nano | $0.10 / $0.40 | $0.25 / $1.00 |
    | o1 | $15.00 / $60.00 | $37.50 / $150.00 |
    | o3 | $2.00 / $8.00 | $5.00 / $20.00 |
    | o4 Mini | $1.10 / $4.40 | $2.75 / $11.00 |

    **Anthropic**
    | Model | Base Price (Input/Output) | Hosted Price (Input/Output) |
    |-------|---------------------------|----------------------------|
    | Claude Opus 4.5 | $5.00 / $25.00 | $12.50 / $62.50 |
    | Claude Opus 4.1 | $15.00 / $75.00 | $37.50 / $187.50 |
    | Claude Sonnet 4.5 | $3.00 / $15.00 | $7.50 / $37.50 |
    | Claude Sonnet 4.0 | $3.00 / $15.00 | $7.50 / $37.50 |
    | Claude Haiku 4.5 | $1.00 / $5.00 | $2.50 / $12.50 |

    **Google**
    | Model | Base Price (Input/Output) | Hosted Price (Input/Output) |
    |-------|---------------------------|----------------------------|
    | Gemini 3 Pro Preview | $2.00 / $12.00 | $5.00 / $30.00 |
    | Gemini 2.5 Pro | $0.15 / $0.60 | $0.38 / $1.50 |
    | Gemini 2.5 Flash | $0.15 / $0.60 | $0.38 / $1.50 |

    *The 2.5x multiplier covers infrastructure and API management costs.*
  </Tab>

  <Tab>
    **Your Own API Keys** - Use any model at base pricing:

    | Provider | Example Models | Input / Output |
    |----------|----------------|----------------|
    | Deepseek | V3, R1 | $0.75 / $1.00 |
    | xAI | Grok 4 Latest, Grok 3 | $3.00 / $15.00 |
    | Groq | Llama 4 Scout, Llama 3.3 70B | $0.11 / $0.34 |
    | Cerebras | Llama 4 Scout, Llama 3.3 70B | $0.11 / $0.34 |
    | Ollama | Local models | Free |
    | VLLM | Local models | Free |

    *Pay providers directly with no markup*
  </Tab>
</Tabs>

<Callout type="warning">
  Pricing shown reflects rates as of September 10, 2025. Check provider documentation for current pricing.
</Callout>

## Cost Optimization Strategies

- **Model Selection**: Choose models based on task complexity. Simple tasks can use GPT-4.1-nano while complex reasoning might need o1 or Claude Opus.
- **Prompt Engineering**: Well-structured, concise prompts reduce token usage without sacrificing quality.
- **Local Models**: Use Ollama or VLLM for non-critical tasks to eliminate API costs entirely.
- **Caching and Reuse**: Store frequently used results in variables or files to avoid repeated AI model calls.
- **Batch Processing**: Process multiple items in a single AI request rather than making individual calls.

## Usage Monitoring

Monitor your usage and billing in Settings → Subscription:

- **Current Usage**: Real-time usage and costs for the current period
- **Usage Limits**: Plan limits with visual progress indicators
- **Billing Details**: Projected charges and minimum commitments
- **Plan Management**: Upgrade options and billing history

### Programmatic Usage Tracking

You can query your current usage and limits programmatically using the API:

**Endpoint:**
```text
GET /api/users/me/usage-limits
```

**Authentication:**
- Include your API key in the `X-API-Key` header

**Example Request:**
```bash
curl -X GET -H "X-API-Key: YOUR_API_KEY" -H "Content-Type: application/json" https://sim.ai/api/users/me/usage-limits
```

**Example Response:**
```json
{
  "success": true,
  "rateLimit": {
    "sync": {
      "isLimited": false,
      "requestsPerMinute": 25,
      "maxBurst": 50,
      "remaining": 50,
      "resetAt": "2025-09-08T22:51:55.999Z"
    },
    "async": {
      "isLimited": false,
      "requestsPerMinute": 200,
      "maxBurst": 400,
      "remaining": 400,
      "resetAt": "2025-09-08T22:51:56.155Z"
    },
    "authType": "api"
  },
  "usage": {
    "currentPeriodCost": 12.34,
    "limit": 100,
    "plan": "pro"
  }
}
```

**Rate Limit Fields:**
- `requestsPerMinute`: Sustained rate limit (tokens refill at this rate)
- `maxBurst`: Maximum tokens you can accumulate (burst capacity)
- `remaining`: Current tokens available (can be up to `maxBurst`)

**Response Fields:**
- `currentPeriodCost` reflects usage in the current billing period
- `limit` is derived from individual limits (Free/Pro) or pooled organization limits (Team/Enterprise)
- `plan` is the highest-priority active plan associated with your user

## Plan Limits

Different subscription plans have different usage limits:

| Plan | Monthly Usage Limit | Rate Limits (per minute) |
|------|-------------------|-------------------------|
| **Free** | $10 | 5 sync, 10 async |
| **Pro** | $100 | 10 sync, 50 async |
| **Team** | $500 (pooled) | 50 sync, 100 async |
| **Enterprise** | Custom | Custom |

## Billing Model

Sim uses a **base subscription + overage** billing model:

### How It Works

**Pro Plan ($20/month):**
- Monthly subscription includes $20 of usage
- Usage under $20 → No additional charges
- Usage over $20 → Pay the overage at month end
- Example: $35 usage = $20 (subscription) + $15 (overage)

**Team Plan ($40/seat/month):**
- Pooled usage across all team members
- Overage calculated from total team usage
- Organization owner receives one bill

**Enterprise Plans:**
- Fixed monthly price, no overages
- Custom usage limits per agreement

### Threshold Billing

When unbilled overage reaches $50, Sim automatically bills the full unbilled amount.

**Example:**
- Day 10: $70 overage → Bill $70 immediately
- Day 15: Additional $35 usage ($105 total) → Already billed, no action
- Day 20: Another $50 usage ($155 total, $85 unbilled) → Bill $85 immediately

This spreads large overage charges throughout the month instead of one large bill at period end.

## Cost Management Best Practices

1. **Monitor Regularly**: Check your usage dashboard frequently to avoid surprises
2. **Set Budgets**: Use plan limits as guardrails for your spending
3. **Optimize Workflows**: Review high-cost executions and optimize prompts or model selection
4. **Use Appropriate Models**: Match model complexity to task requirements
5. **Batch Similar Tasks**: Combine multiple requests when possible to reduce overhead

## Next Steps

- Review your current usage in [Settings → Subscription](https://sim.ai/settings/subscription)
- Learn about [Logging](/execution/logging) to track execution details
- Explore the [External API](/execution/api) for programmatic cost monitoring
- Check out [workflow optimization techniques](/blocks) to reduce costs
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/execution/index.mdx

```text
---
title: Overview
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Sim's execution engine brings your workflows to life by processing blocks in the correct order, managing data flow, and handling errors gracefully, so you can understand exactly how workflows are executed in Sim.

<Callout type="info">
  Every workflow execution follows a deterministic path based on your block connections and logic, ensuring predictable and reliable results.
</Callout>

## Documentation Overview

<Cards>
  <Card title="Execution Basics" href="/execution/basics">
    Learn about the fundamental execution flow, block types, and how data flows through your
    workflow
  </Card>

  <Card title="Logging" href="/execution/logging">
    Monitor workflow executions with comprehensive logging and real-time visibility
  </Card>
  
  <Card title="Cost Calculation" href="/execution/costs">
    Understand how workflow execution costs are calculated and optimized
  </Card>
  
  <Card title="External API" href="/execution/api">
    Access execution logs and set up webhooks programmatically via REST API
  </Card>
</Cards>

## Key Concepts

### Topological Execution
Blocks execute in dependency order, similar to how a spreadsheet recalculates cells. The execution engine automatically determines which blocks can run based on completed dependencies.

### Path Tracking
The engine actively tracks execution paths through your workflow. Router and Condition blocks dynamically update these paths, ensuring only relevant blocks execute.

### Layer-Based Processing
Instead of executing blocks one-by-one, the engine identifies layers of blocks that can run in parallel, optimizing performance for complex workflows.

### Execution Context
Each workflow maintains a rich context during execution containing:
- Block outputs and states
- Active execution paths
- Loop and parallel iteration tracking
- Environment variables
- Routing decisions


## Deployment Snapshots

All public entry points—API, Chat, Schedule, Webhook, and Manual runs—execute the workflow’s active deployment snapshot. Publish a new deployment whenever you change the canvas so every trigger uses the updated version.

<div className='flex justify-center my-6'>
  <Image
    src='/static/execution/deployment-versions.png'
    alt='Deployment versions table'
    width={500}
    height={280}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

The Deploy modal keeps a full version history—inspect any snapshot, compare it against your draft, and promote or roll back with one click when you need to restore a prior release.

## Programmatic Execution

Execute workflows from your applications using our official SDKs:

```bash
# TypeScript/JavaScript
npm install simstudio-ts-sdk

# Python
pip install simstudio-sdk
```

```typescript
// TypeScript Example
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({ 
  apiKey: 'your-api-key' 
});

const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello' }
});
```

## Best Practices

### Design for Reliability
- Handle errors gracefully with appropriate fallback paths
- Use environment variables for sensitive data
- Add logging to Function blocks for debugging

### Optimize Performance
- Minimize external API calls where possible
- Use parallel execution for independent operations
- Cache results with Memory blocks when appropriate

### Monitor Executions
- Review logs regularly to understand performance patterns
- Track costs for AI model usage
- Use workflow snapshots to debug issues

## What's Next?

Start with [Execution Basics](/execution/basics) to understand how workflows run, then explore [Logging](/execution/logging) to monitor your executions and [Cost Calculation](/execution/costs) to optimize your spending.
```

--------------------------------------------------------------------------------

---[FILE: logging.mdx]---
Location: sim-main/apps/docs/content/docs/en/execution/logging.mdx

```text
---
title: Logging
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Sim provides comprehensive logging for all workflow executions, giving you complete visibility into how your workflows run, what data flows through them, and where issues might occur.

## Logging System

Sim offers two complementary logging interfaces to match different workflows and use cases:

### Real-Time Console

During manual or chat workflow execution, logs appear in real-time in the Console panel on the right side of the workflow editor:

<div className="flex justify-center">
  <Image
    src="/static/logs/console.png"
    alt="Real-time Console Panel"
    width={400}
    height={300}
    className="my-6"
  />
</div>

The console shows:
- Block execution progress with active block highlighting
- Real-time outputs as blocks complete
- Execution timing for each block
- Success/error status indicators

### Logs Page

All workflow executions—whether triggered manually, via API, Chat, Schedule, or Webhook—are logged to the dedicated Logs page:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs.png"
    alt="Logs Page"
    width={600}
    height={400}
    className="my-6"
  />
</div>

The Logs page provides:
- Comprehensive filtering by time range, status, trigger type, folder, and workflow
- Search functionality across all logs
- Live mode for real-time updates
- 7-day log retention (upgradeable for longer retention)

## Log Details Sidebar

Clicking on any log entry opens a detailed sidebar view:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-sidebar.png"
    alt="Logs Sidebar Details"
    width={600}
    height={400}
    className="my-6"
  />
</div>

### Block Input/Output

View the complete data flow for each block with tabs to switch between:

<Tabs items={['Output', 'Input']}>
  <Tab>
    **Output Tab** shows the block's execution result:
    - Structured data with JSON formatting
    - Markdown rendering for AI-generated content
    - Copy button for easy data extraction
  </Tab>
  
  <Tab>
    **Input Tab** displays what was passed to the block:
    - Resolved variable values
    - Referenced outputs from other blocks
    - Environment variables used
    - API keys are automatically redacted for security
  </Tab>
</Tabs>

### Execution Timeline

For workflow-level logs, view detailed execution metrics:
- Start and end timestamps
- Total workflow duration
- Individual block execution times
- Performance bottleneck identification

## Workflow Snapshots

For any logged execution, click "View Snapshot" to see the exact workflow state at execution time:

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-frozen-canvas.png"
    alt="Workflow Snapshot"
    width={600}
    height={400}
    className="my-6"
  />
</div>

The snapshot provides:
- Frozen canvas showing the workflow structure
- Block states and connections as they were during execution
- Click any block to see its inputs and outputs
- Useful for debugging workflows that have since been modified

<Callout type="info">
  Workflow snapshots are only available for executions after the enhanced logging system was introduced. Older migrated logs show a "Logged State Not Found" message.
</Callout>

## Log Retention

- **Free Plan**: 7 days of log retention
- **Pro Plan**: 30 days of log retention
- **Team Plan**: 90 days of log retention
- **Enterprise Plan**: Custom retention periods available

## Best Practices

### For Development
- Use the real-time console for immediate feedback during testing
- Check block inputs and outputs to verify data flow
- Use workflow snapshots to compare working vs. broken versions

### For Production
- Monitor the Logs page regularly for errors or performance issues
- Set up filters to focus on specific workflows or time periods
- Use live mode during critical deployments to watch executions in real-time

### For Debugging
- Always check the execution timeline to identify slow blocks
- Compare inputs between working and failing executions
- Use workflow snapshots to see the exact state when issues occurred

## Next Steps

- Learn about [Cost Calculation](/execution/costs) to understand workflow pricing
- Explore the [External API](/execution/api) for programmatic log access
- Set up [Notifications](/execution/api#notifications) for real-time alerts via webhook, email, or Slack
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/en/execution/meta.json

```json
{
  "pages": ["index", "basics", "api", "logging", "costs"]
}
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/getting-started/index.mdx

```text
---
title: Getting Started
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import {
  AgentIcon,
  ApiIcon,
  ChartBarIcon,
  CodeIcon,
  ConditionalIcon,
  ConnectIcon,
  ExaAIIcon,
  FirecrawlIcon,
  GmailIcon,
  NotionIcon,
  PerplexityIcon,
  SlackIcon,
} from '@/components/icons'
import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

Build your first AI workflow in 10 minutes. In this tutorial, you'll create a people research agent that uses advanced LLM-powered search tools to extract and structure information about individuals.

<Callout type="info">
  This tutorial covers the essential concepts of building workflows in Sim. Estimated completion time: 10 minutes.
</Callout>

## What You'll Build

A people research agent that:
1. Accepts user input through a chat interface
2. Searches the web using AI-powered tools (Exa and Linkup)
3. Extracts and structures information about individuals
4. Returns formatted JSON data with location, profession, and education

<Image
  src="/static/getting-started/started-1.png"
  alt="Getting Started Example"
  width={800}
  height={500}
/>

## Step-by-Step Tutorial

<Steps>
  <Step title="Create a workflow and add an AI agent">
    Click **New Workflow** in the dashboard and name it "Getting Started".
    
    Every new workflow includes a **Start block** by default—this is the entry point that receives user input. Since we'll trigger this workflow via chat, no configuration is needed for the Start block.
    
    Drag an **Agent Block** onto the canvas from the left panel and configure it:
    - **Model**: Select "OpenAI GPT-4o"
    - **System Prompt**: "You are a people research agent. When given a person's name, use your available search tools to find comprehensive information about them including their location, profession, educational background, and other relevant details."
    - **User Prompt**: Drag the connection from the Start block's output into this field to connect `<start.input>` to the user prompt
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-2.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Add search tools to the agent">
    Enhance your agent with web search capabilities. Click on the Agent block to select it.
    
    In the **Tools** section:
    - Click **Add Tool**
    - Select **Exa** and **Linkup** from the available tools
    - Provide your API keys for both tools to enable web search and data access
    
    <div className="mx-auto w-3/5 overflow-hidden rounded-lg">
      <Video src="getting-started/started-3.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Test your workflow">
    Test your workflow using the **Chat panel** on the right side of the screen.
    
    In the chat panel:
    - Click the dropdown and select `agent1.content` to view the agent's output
    - Enter a test message: "John is a software engineer from San Francisco who studied Computer Science at Stanford University."
    - Click **Send** to execute the workflow
    
    The agent will analyze the person and return structured information.
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-4.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Configure structured output">
    Configure your agent to return structured JSON data. Click on the Agent block to select it.
    
    In the **Response Format** section:
    - Click the **magic wand icon** (✨) next to the schema field
    - Enter the prompt: "create a schema named person, that contains location, profession, and education"
    - The AI will automatically generate the JSON schema
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-5.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="Test with structured output">
    Return to the **Chat panel** to test the structured response format.
    
    With the response format configured, new output options are now available:
    - Click the dropdown and select the structured output option (the schema you just created)
    - Enter a test message: "Sarah is a marketing manager from New York who has an MBA from Harvard Business School."
    - Click **Send** to execute the workflow
    
    The agent will now return structured JSON output with the person's information organized into location, profession, and education fields.
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-6.mp4" width={700} height={450} />
    </div>
  </Step>
</Steps>

## What You've Built

You've successfully created an AI workflow that:
- ✅ Accepts user input through a chat interface
- ✅ Processes unstructured text using AI
- ✅ Integrates external search tools (Exa and Linkup)
- ✅ Returns structured JSON data with AI-generated schemas
- ✅ Demonstrates real-time testing and iteration
- ✅ Showcases the power of visual, no-code development

## Key Concepts You Learned

### Block Types Used

<Files>
  <File
    name="Start Block"
    icon={<ConnectIcon className="h-4 w-4" />}
    annotation="Entry point for user input (auto-included)"
  />
  <File
    name="Agent Block"
    icon={<AgentIcon className="h-4 w-4" />}
    annotation="AI model for text processing and analysis"
  />
</Files>

### Core Workflow Concepts

**Data Flow**  
Connect blocks by dragging connections to pass data between workflow steps

**Chat Interface**  
Test workflows in real-time with the chat panel and select different output options

**Tool Integration**  
Extend agent capabilities by integrating external services like Exa and Linkup

**Variable References**  
Access block outputs using the `<blockName.output>` syntax

**Structured Output**  
Define JSON schemas to ensure consistent, formatted responses from AI

**AI-Generated Schemas**  
Use the magic wand (✨) to generate schemas from natural language prompts

**Iterative Development**  
Build, test, and refine workflows quickly with immediate feedback

## Next Steps

<Cards>
  <Card title="Explore Workflow Blocks" href="/blocks">
    Discover API, Function, Condition, and other workflow blocks
  </Card>
  <Card title="Browse Integrations" href="/tools">
    Connect 80+ services including Gmail, Slack, Notion, and more
  </Card>
  <Card title="Add Custom Logic" href="/blocks/function">
    Write custom functions for advanced data processing
  </Card>
  <Card title="Deploy Your Workflow" href="/execution">
    Make your workflow accessible via REST API or webhooks
  </Card>
</Cards>

## Resources

**Need detailed explanations?** Visit the [Blocks documentation](/blocks) for comprehensive guides on each component.

**Looking for integrations?** Explore the [Tools documentation](/tools) to see all 80+ available integrations.

**Ready to go live?** Learn about [Execution and Deployment](/execution) to make your workflows production-ready.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/introduction/index.mdx

```text
---
title: Introduction
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Sim is an open-source visual workflow builder for building and deploying AI agent workflows. Design intelligent automation systems using a no-code interface—connect AI models, databases, APIs, and business tools through an intuitive drag-and-drop canvas. Whether you're building chatbots, automating business processes, or orchestrating complex data pipelines, Sim provides the tools to bring your AI workflows to life.

<div className="flex justify-center">
  <Image
    src="/static/introduction.png"
    alt="Sim visual workflow canvas"
    width={700}
    height={450}
    className="my-6"
  />
</div>

## What You Can Build

**AI Assistants & Chatbots**  
Build intelligent conversational agents that integrate with your tools and data. Enable capabilities like web search, calendar management, email automation, and seamless interaction with business systems.

**Business Process Automation**  
Eliminate manual tasks across your organization. Automate data entry, generate reports, respond to customer inquiries, and streamline content creation workflows.

**Data Processing & Analysis**  
Transform raw data into actionable insights. Extract information from documents, perform dataset analysis, generate automated reports, and synchronize data across platforms.

**API Integration Workflows**  
Orchestrate complex multi-service interactions. Create unified API endpoints, implement sophisticated business logic, and build event-driven automation systems.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/chat-workflow.mp4" width={700} height={450} />
</div>

## How It Works

**Visual Workflow Editor**  
Design workflows using an intuitive drag-and-drop canvas. Connect AI models, databases, APIs, and third-party services through a visual, no-code interface that makes complex automation logic easy to understand and maintain.

**Modular Block System**  
Build with specialized components: processing blocks (AI agents, API calls, custom functions), logic blocks (conditional branching, loops, routers), and output blocks (responses, evaluators). Each block handles a specific task in your workflow.

**Flexible Execution Triggers**  
Launch workflows through multiple channels including chat interfaces, REST APIs, webhooks, scheduled cron jobs, or external events from platforms like Slack and GitHub.

**Real-time Collaboration**  
Enable your team to build together. Multiple users can edit workflows simultaneously with live updates and granular permission controls.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/build-workflow.mp4" width={700} height={450} />
</div>

## Integrations

Sim provides native integrations with 80+ services across multiple categories:

- **AI Models**: OpenAI, Anthropic, Google Gemini, Groq, Cerebras, local models via Ollama or VLLM
- **Communication**: Gmail, Slack, Microsoft Teams, Telegram, WhatsApp  
- **Productivity**: Notion, Google Workspace, Airtable, Monday.com
- **Development**: GitHub, Jira, Linear, automated browser testing
- **Search & Data**: Google Search, Perplexity, Firecrawl, Exa AI
- **Databases**: PostgreSQL, MySQL, Supabase, Pinecone, Qdrant

For custom integrations, leverage our [MCP (Model Context Protocol) support](/mcp) to connect any external service or tool.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/integrations-sidebar.mp4" width={700} height={450} />
</div>

## Copilot

**Ask Questions & Get Guidance**  
Copilot answers questions about Sim, explains your workflows, and provides suggestions for improvements. Use the `@` symbol to reference workflows, blocks, documentation, knowledge, and logs for contextual assistance.

**Build & Edit Workflows**  
Switch to Agent mode to let Copilot propose and apply changes directly to your canvas. Add blocks, configure settings, wire variables, and restructure workflows with natural language commands.

**Adaptive Reasoning Levels**  
Choose from Fast, Auto, Advanced, or Behemoth modes depending on task complexity. Start with Fast for simple questions, scale up to Behemoth for complex architectural changes and deep debugging.

Learn more about [Copilot capabilities](/copilot) and how to maximize productivity with AI assistance.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/copilot-workflow.mp4" width={700} height={450} />
</div>

## Deployment Options

**Cloud-Hosted**  
Launch immediately at [sim.ai](https://sim.ai) with fully managed infrastructure, automatic scaling, and built-in observability. Focus on building workflows while we handle the operations.

**Self-Hosted**  
Deploy on your own infrastructure using Docker Compose or Kubernetes. Maintain complete control over your data with support for local AI models through Ollama integration.

## Next Steps

Ready to build your first AI workflow?

<Cards>
  <Card title="Getting Started" href="/getting-started">
    Create your first workflow in 10 minutes
  </Card>
  <Card title="Workflow Blocks" href="/blocks">
    Learn about the building blocks
  </Card>
  <Card title="Tools & Integrations" href="/tools">
    Explore 80+ built-in integrations
  </Card>
  <Card title="Team Permissions" href="/permissions/roles-and-permissions">
    Set up workspace roles and permissions
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/knowledgebase/index.mdx

```text
---
title: Overview
description: Upload, process, and search through your documents with intelligent vector search and chunking
---

import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

The knowledgebase allows you to upload, process, and search through your documents with intelligent vector search and chunking. Documents of various types are automatically processed, embedded, and made searchable. Your documents are intelligently chunked, and you can view, edit, and search through them using natural language queries.

## Upload and Processing

Simply upload your documents to get started. Sim automatically processes them in the background, extracting text, creating embeddings, and breaking them into searchable chunks.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-1.mp4" width={700} height={450} />
</div>

The system handles the entire processing pipeline for you:

1. **Text Extraction**: Content is extracted from your documents using specialized parsers for each file type
2. **Intelligent Chunking**: Documents are broken into meaningful chunks with configurable size and overlap
3. **Embedding Generation**: Vector embeddings are created for semantic search capabilities
4. **Processing Status**: Track the progress as your documents are processed

## Supported File Types

Sim supports PDF, Word (DOC/DOCX), plain text (TXT), Markdown (MD), HTML, Excel (XLS/XLSX), PowerPoint (PPT/PPTX), and CSV files. Files can be up to 100MB each, with optimal performance for files under 50MB. You can upload multiple documents simultaneously, and PDF files include OCR processing for scanned documents.

## Viewing and Editing Chunks

Once your documents are processed, you can view and edit the individual chunks. This gives you full control over how your content is organized and searched.

<Image src="/static/knowledgebase/knowledgebase.png" alt="Document chunks view showing processed content" width={800} height={500} />

### Chunk Configuration
- **Default chunk size**: 1,024 characters
- **Configurable range**: 100-4,000 characters per chunk
- **Smart overlap**: 200 characters by default for context preservation
- **Hierarchical splitting**: Respects document structure (sections, paragraphs, sentences)

### Editing Capabilities
- **Edit chunk content**: Modify the text content of individual chunks
- **Adjust chunk boundaries**: Merge or split chunks as needed
- **Add metadata**: Enhance chunks with additional context
- **Bulk operations**: Manage multiple chunks efficiently

## Advanced PDF Processing

For PDF documents, Sim offers enhanced processing capabilities:

### OCR Support
When configured with Azure or [Mistral OCR](https://docs.mistral.ai/ocr/):
- **Scanned document processing**: Extract text from image-based PDFs
- **Mixed content handling**: Process PDFs with both text and images
- **High accuracy**: Advanced AI models ensure accurate text extraction

## Using The Knowledge Block in Workflows

Once your documents are processed, you can use them in your AI workflows through the Knowledge block. This enables Retrieval-Augmented Generation (RAG), allowing your AI agents to access and reason over your document content to provide more accurate, contextual responses.

<Image src="/static/knowledgebase/knowledgebase-2.png" alt="Using Knowledge Block in Workflows" width={800} height={500} />

### Knowledge Block Features
- **Semantic search**: Find relevant content using natural language queries
- **Context integration**: Automatically include relevant chunks in agent prompts
- **Dynamic retrieval**: Search happens in real-time during workflow execution
- **Relevance scoring**: Results ranked by semantic similarity

### Integration Options
- **System prompts**: Provide context to your AI agents
- **Dynamic context**: Search and include relevant information during conversations
- **Multi-document search**: Query across your entire knowledgebase
- **Filtered search**: Combine with tags for precise content retrieval

## Vector Search Technology

Sim uses vector search powered by [pgvector](https://github.com/pgvector/pgvector) to understand the meaning and context of your content:

### Semantic Understanding
- **Contextual search**: Finds relevant content even when exact keywords don't match
- **Concept-based retrieval**: Understands relationships between ideas
- **Multi-language support**: Works across different languages
- **Synonym recognition**: Finds related terms and concepts

### Search Capabilities
- **Natural language queries**: Ask questions in plain English
- **Similarity search**: Find conceptually similar content
- **Hybrid search**: Combines vector and traditional keyword search
- **Configurable results**: Control the number and relevance threshold of results

## Document Management

### Organization Features
- **Bulk upload**: Upload multiple files at once via the asynchronous API
- **Processing status**: Real-time updates on document processing
- **Search and filter**: Find documents quickly in large collections
- **Metadata tracking**: Automatic capture of file information and processing details

### Security and Privacy
- **Secure storage**: Documents stored with enterprise-grade security
- **Access control**: Workspace-based permissions
- **Processing isolation**: Each workspace has isolated document processing
- **Data retention**: Configure document retention policies

## Getting Started

1. **Navigate to your knowledgebase**: Access from your workspace sidebar
2. **Upload documents**: Drag and drop or select files to upload
3. **Monitor processing**: Watch as documents are processed and chunked
4. **Explore chunks**: View and edit the processed content
5. **Add to workflows**: Use the Knowledge block to integrate with your AI agents

The knowledgebase transforms your static documents into an intelligent, searchable resource that your AI workflows can leverage for more informed and contextual responses.
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/en/knowledgebase/meta.json

```json
{
  "title": "Knowledgebase",
  "pages": ["index", "tags"]
}
```

--------------------------------------------------------------------------------

````
