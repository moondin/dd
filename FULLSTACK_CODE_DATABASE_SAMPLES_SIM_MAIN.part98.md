---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 98
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 98 of 933)

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
Location: sim-main/apps/docs/content/docs/en/triggers/index.mdx

```text
---
title: Overview
description: Triggers are the core ways to start Sim workflows
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

<div className="flex justify-center">
  <Image
    src="/static/blocks/triggers.png"
    alt="Triggers Overview"
    width={500}
    height={350}
    className="my-6"
  />
</div>

## Core Triggers

Use the Start block for everything originating from the editor, deploy-to-API, or deploy-to-chat experiences. Other triggers remain available for event-driven workflows:

<Cards>
  <Card title="Start" href="/triggers/start">
    Unified entry point that supports editor runs, API deployments and chat deployments
  </Card>
  <Card title="Webhook" href="/triggers/webhook">
    Receive external webhook payloads
  </Card>
  <Card title="Schedule" href="/triggers/schedule">
    Cron or interval based execution
  </Card>
  <Card title="RSS Feed" href="/triggers/rss">
    Monitor RSS and Atom feeds for new content
  </Card>
</Cards>

## Quick Comparison

| Trigger | Start condition |
|---------|-----------------|
| **Start** | Editor runs, deploy-to-API requests, or chat messages |
| **Schedule** | Timer managed in schedule block |
| **Webhook** | On inbound HTTP request |
| **RSS Feed** | New item published to feed |

> The Start block always exposes `input`, `conversationId`, and `files` fields. Add custom fields to the input format for additional structured data.

## Using Triggers

1. Drop the Start block in the start slot (or an alternate trigger like Webhook/Schedule).
2. Configure any required schema or auth.
3. Connect the block to the rest of the workflow.

> Deployments power every trigger. Update the workflow, redeploy, and all trigger entry points pick up the new snapshot. Learn more in [Execution → Deployment Snapshots](/execution).

## Manual Execution Priority

When you click **Run** in the editor, Sim automatically selects which trigger to execute based on the following priority order:

1. **Start Block** (highest priority)
2. **Schedule Triggers**
3. **External Triggers** (webhooks, integrations like Slack, Gmail, Airtable, etc.)

If your workflow has multiple triggers, the highest priority trigger will be executed. For example, if you have both a Start block and a Webhook trigger, clicking Run will execute the Start block.

**External triggers with mock payloads**: When external triggers (webhooks and integrations) are executed manually, Sim automatically generates mock payloads based on the trigger's expected data structure. This ensures downstream blocks can resolve variables correctly during testing.
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/en/triggers/meta.json

```json
{
  "pages": ["index", "start", "schedule", "webhook", "rss"]
}
```

--------------------------------------------------------------------------------

---[FILE: rss.mdx]---
Location: sim-main/apps/docs/content/docs/en/triggers/rss.mdx

```text
---
title: RSS Feed
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

The RSS Feed block monitors RSS and Atom feeds – when new items are published, your workflow triggers automatically.

<div className="flex justify-center">
  <Image
    src="/static/blocks/rss.png"
    alt="RSS Feed Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuration

1. **Add RSS Feed Block** - Drag the RSS Feed block to start your workflow
2. **Enter Feed URL** - Paste the URL of any RSS or Atom feed
3. **Deploy** - Deploy your workflow to activate polling

Once deployed, the feed is checked every minute for new items.

## Output Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Item title |
| `link` | string | Item link |
| `pubDate` | string | Publication date |
| `item` | object | Raw item with all fields |
| `feed` | object | Raw feed metadata |

Access mapped fields directly (`<rss.title>`) or use the raw objects for any field (`<rss.item.author>`, `<rss.feed.language>`).

## Use Cases

- **Content monitoring** - Track blogs, news sites, or competitor updates
- **Podcast automation** - Trigger workflows when new episodes drop
- **Release tracking** - Monitor GitHub releases, changelogs, or product updates
- **Social aggregation** - Collect content from platforms that expose RSS feeds

<Callout>
RSS triggers only fire for items published after you save the trigger. Existing feed items are not processed.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: schedule.mdx]---
Location: sim-main/apps/docs/content/docs/en/triggers/schedule.mdx

```text
---
title: Schedule
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

The Schedule block automatically triggers workflows on a recurring schedule at specified intervals or times.

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule.png"
    alt="Schedule Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Schedule Options

Configure when your workflow runs using the dropdown options:

<Tabs items={['Simple Intervals', 'Cron Expressions']}>
  <Tab>
    <ul className="list-disc space-y-1 pl-6">
      <li><strong>Every few minutes</strong>: 5, 15, 30 minute intervals</li>
      <li><strong>Hourly</strong>: Every hour or every few hours</li>
      <li><strong>Daily</strong>: Once or multiple times per day</li>
      <li><strong>Weekly</strong>: Specific days of the week</li>
      <li><strong>Monthly</strong>: Specific days of the month</li>
    </ul>
  </Tab>
  <Tab>
    <p>Use cron expressions for advanced scheduling:</p>
    <div className="text-sm space-y-1">
      <div><code>0 9 * * 1-5</code> - Every weekday at 9 AM</div>
      <div><code>*/15 * * * *</code> - Every 15 minutes</div>
      <div><code>0 0 1 * *</code> - First day of each month</div>
    </div>
  </Tab>
</Tabs>

## Configuring Schedules

When a workflow is scheduled:
- The schedule becomes **active** and shows the next execution time
- Click the **"Scheduled"** button to deactivate the schedule
- Schedules automatically deactivate after **3 consecutive failures**

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-2.png"
    alt="Active Schedule Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Disabled Schedules

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="Disabled Schedule"
    width={500}
    height={400}
    className="my-6"
  />
</div>

Disabled schedules show when they were last active. Click the **"Disabled"** badge to reactivate the schedule.

<Callout>
Schedule blocks cannot receive incoming connections and serve as pure workflow triggers.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: start.mdx]---
Location: sim-main/apps/docs/content/docs/en/triggers/start.mdx

```text
---
title: Start
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The Start block is the default trigger for workflows built in Sim. It collects structured inputs and fans out to the rest of your graph for editor tests, API deployments, and chat experiences.

<div className="flex justify-center">
  <Image
    src="/static/start.png"
    alt="Start block with Input Format fields"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout type="info">
The Start block sits in the start slot when you create a workflow. Keep it there when you want the same entry point to serve editor runs, deploy-to-API requests, and chat sessions. Swap it with Webhook or Schedule triggers when you only need event-driven execution.
</Callout>

## Fields exposed by Start

The Start block emits different data depending on the execution surface:

- **Input Format fields** — Every field you add becomes available as <code>&lt;start.fieldName&gt;</code>. For example, a `customerId` field shows up as <code>&lt;start.customerId&gt;</code> in downstream blocks and templates.
- **Chat-only fields** — When the workflow runs from the chat side panel or a deployed chat experience, Sim also provides <code>&lt;start.input&gt;</code> (latest user message), <code>&lt;start.conversationId&gt;</code> (active session id), and <code>&lt;start.files&gt;</code> (chat attachments).

Keep Input Format fields scoped to the names you expect to reference later—those values are the only structured fields shared across editor, API, and chat runs.

## Configure the Input Format

Use the Input Format sub-block to define the schema that applies across execution modes:

1. Add a field for each value you want to collect.
2. Choose a type (`string`, `number`, `boolean`, `object`, `array`, or `files`). File fields accept uploads from chat and API callers.
3. Provide default values when you want the manual run modal to populate test data automatically. These defaults are ignored for deployed executions.
4. Reorder fields to control how they appear in the editor form.

Reference structured values downstream with expressions such as <code>&lt;start.customerId&gt;</code> depending on the block you connect.

## How it behaves per entry point

<Tabs items={['Editor run', 'Deploy to API', 'Deploy to chat']}>
  <Tab>
    When you click <strong>Run</strong> in the editor, the Start block renders the Input Format as a form. Default values make it easy to retest without retyping data. Submitting the form triggers the workflow immediately and the values become available on <code>&lt;start.fieldName&gt;</code> (for example <code>&lt;start.sampleField&gt;</code>).

    File fields in the form upload directly into the corresponding{' '}
    <code>&lt;start.fieldName&gt;</code>; use those values to feed downstream
    tools or storage steps.
  </Tab>
  <Tab>
    Deploying to API turns the Input Format into a JSON contract for clients. Each field becomes part of the request body, and Sim coerces primitive types on ingestion. File fields expect objects that reference uploaded files; use the execution file upload endpoint before invoking the workflow.

    API callers can include additional optional properties. They are preserved
    inside <code>&lt;start.fieldName&gt;</code> outputs so you can experiment
    without redeploying immediately.
  </Tab>
  <Tab>
    In chat deployments the Start block binds to the active conversation. The latest message fills <code>&lt;start.input&gt;</code>, the session identifier is available at <code>&lt;start.conversationId&gt;</code>, and user attachments appear on <code>&lt;start.files&gt;</code>, alongside any Input Format fields scoped as <code>&lt;start.fieldName&gt;</code>.

    If you launch chat with additional structured context (for example from an embed), it merges into the corresponding <code>&lt;start.fieldName&gt;</code> outputs, keeping downstream blocks consistent with API and manual runs.
  </Tab>
</Tabs>

## Referencing Start data downstream

- Connect <code>&lt;start.fieldName&gt;</code> directly into agents, tools, or functions that expect structured payloads.
- Use templating syntax like <code>&lt;start.sampleField&gt;</code> or <code>&lt;start.files[0].url&gt;</code> (chat only) in prompt fields.
- Keep <code>&lt;start.conversationId&gt;</code> handy when you need to group outputs, update conversation history, or call back into the chat API.

## Best practices

- Treat the Start block as the single entry point when you want to support both API and chat callers.
- Prefer named Input Format fields over parsing raw JSON in downstream nodes; type coercion happens automatically.
- Add validation or routing immediately after Start if certain fields are required for your workflow to succeed.
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/en/triggers/webhook.mdx

```text
---
title: Webhooks  
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Webhooks allow external services to trigger workflow execution by sending HTTP requests to your workflow. Sim supports two approaches for webhook-based triggers.

## Generic Webhook Trigger

The Generic Webhook block creates a flexible endpoint that can receive any payload and trigger your workflow:

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Generic Webhook Configuration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

### How It Works

1. **Add Generic Webhook Block** - Drag the Generic Webhook block to start your workflow
2. **Configure Payload** - Set up the expected payload structure (optional)
3. **Get Webhook URL** - Copy the automatically generated unique endpoint
4. **External Integration** - Configure your external service to send POST requests to this URL
5. **Workflow Execution** - Every request to the webhook URL triggers the workflow

### Features

- **Flexible Payload**: Accepts any JSON payload structure
- **Automatic Parsing**: Webhook data is automatically parsed and available to subsequent blocks
- **Authentication**: Optional bearer token or custom header authentication
- **Rate Limiting**: Built-in protection against abuse
- **Deduplication**: Prevents duplicate executions from repeated requests

<Callout type="info">
The Generic Webhook trigger fires every time the webhook URL receives a request, making it perfect for real-time integrations.
</Callout>

## Trigger Mode for Service Blocks

Alternatively, you can use specific service blocks (like Slack, GitHub, etc.) in "trigger mode" to create more specialized webhook endpoints:

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="slack-trigger.mp4" width={700} height={450} />
</div>

### Setting Up Trigger Mode

1. **Add Service Block** - Choose a service block (e.g., Slack, GitHub, Airtable)
2. **Enable Trigger Mode** - Toggle "Use as Trigger" in the block settings
3. **Configure Service** - Set up authentication and event filters specific to that service
4. **Webhook Registration** - The service automatically registers the webhook with the external platform
5. **Event-Based Execution** - Workflow triggers only for specific events from that service

### When to Use Each Approach

**Use Generic Webhook when:**
- Integrating with custom applications or services
- You need maximum flexibility in payload structure
- Working with services that don't have dedicated blocks
- Building internal integrations

**Use Trigger Mode when:**
- Working with supported services (Slack, GitHub, etc.)
- You want service-specific event filtering
- You need automatic webhook registration
- You want structured data handling for that service

## Supported Services for Trigger Mode

**Development & Project Management**
- GitHub - Issues, PRs, pushes, releases, workflow runs
- Jira - Issue events, worklogs
- Linear - Issues, comments, projects, cycles, labels

**Communication**
- Slack - Messages, mentions, reactions
- Microsoft Teams - Chat messages, channel notifications
- Telegram - Bot messages, commands
- WhatsApp - Messaging events

**Email**
- Gmail - New emails (polling), label changes
- Outlook - New emails (polling), folder events

**CRM & Sales**
- HubSpot - Contacts, companies, deals, tickets, conversations
- Stripe - Payments, subscriptions, customers

**Forms & Surveys**
- Typeform - Form submissions
- Google Forms - Form responses
- Webflow - Collection items, form submissions

**Other**
- Airtable - Record changes
- Twilio Voice - Incoming calls, call status

## Security and Best Practices

### Authentication Options

- **Bearer Tokens**: Include `Authorization: Bearer <token>` header
- **Custom Headers**: Define custom authentication headers

### Payload Handling

- **Validation**: Validate incoming payloads to prevent malformed data
- **Size Limits**: Webhooks have payload size limits for security
- **Error Handling**: Configure error responses for invalid requests

### Testing Webhooks

1. Use tools like Postman or curl to test your webhook endpoints
2. Check workflow execution logs for debugging
3. Verify payload structure matches your expectations
4. Test authentication and error scenarios

<Callout type="warning">
Always validate and sanitize incoming webhook data before processing it in your workflows.
</Callout>

## Common Use Cases

### Real-time Notifications
- Slack messages triggering automated responses
- Email notifications for critical events

### CI/CD Integration  
- GitHub pushes triggering deployment workflows
- Build status updates
- Automated testing pipelines

### Data Synchronization
- Airtable changes updating other systems
- Form submissions triggering follow-up actions
- E-commerce order processing

### Customer Support
- Support ticket creation workflows
- Automated escalation processes
- Multi-channel communication routing
```

--------------------------------------------------------------------------------

---[FILE: environment-variables.mdx]---
Location: sim-main/apps/docs/content/docs/en/variables/environment-variables.mdx

```text
---
title: Environment Variables
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

Environment variables provide a secure way to manage configuration values and secrets across your workflows, including API keys and other sensitive data that your workflows need to access. They keep secrets out of your workflow definitions while making them available during execution.

## Variable Types

Environment variables in Sim work at two levels:

- **Personal Environment Variables**: Private to your account, only you can see and use them
- **Workspace Environment Variables**: Shared across the entire workspace, available to all team members

<Callout type="info">
Workspace environment variables take precedence over personal ones when there's a naming conflict.
</Callout>

## Setting up Environment Variables

Navigate to Settings to configure your environment variables:

<Image
  src="/static/environment/environment-1.png"
  alt="Environment variables modal for creating new variables"
  width={500}
  height={350}
/>

From your workspace settings, you can create and manage both personal and workspace-level environment variables. Personal variables are private to your account, while workspace variables are shared with all team members.

### Making Variables Workspace-Scoped

Use the workspace scope toggle to make variables available to your entire team:

<Image
  src="/static/environment/environment-2.png"
  alt="Toggle workspace scope for environment variables"
  width={500}
  height={350}
/>

When you enable workspace scope, the variable becomes available to all workspace members and can be used in any workflow within that workspace.

### Workspace Variables View

Once you have workspace-scoped variables, they appear in your environment variables list:

<Image
  src="/static/environment/environment-3.png"
  alt="Workspace-scoped variables in the environment variables list"
  width={500}
  height={350}
/>

## Using Variables in Workflows

To reference environment variables in your workflows, use the `{{}}` notation. When you type `{{` in any input field, a dropdown will appear showing both your personal and workspace-level environment variables. Simply select the variable you want to use.

<Image
  src="/static/environment/environment-4.png"
  alt="Using environment variables with double brace notation"
  width={500}
  height={350}
/>

## How Variables are Resolved

**Workspace variables always take precedence** over personal variables, regardless of who runs the workflow.

When no workspace variable exists for a key, personal variables are used:
- **Manual runs (UI)**: Your personal variables
- **Automated runs (API, webhook, schedule, deployed chat)**: Workflow owner's personal variables

<Callout type="info">
Personal variables are best for testing. Use workspace variables for production workflows.
</Callout>

## Security Best Practices

### For Sensitive Data
- Store API keys, tokens, and passwords as environment variables instead of hardcoding them
- Use workspace variables for shared resources that multiple team members need
- Keep personal credentials in personal variables

### Variable Naming
- Use descriptive names: `DATABASE_URL` instead of `DB`
- Follow consistent naming conventions across your team
- Consider prefixes to avoid conflicts: `PROD_API_KEY`, `DEV_API_KEY`

### Access Control
- Workspace environment variables respect workspace permissions
- Only users with write access or higher can create/modify workspace variables
- Personal variables are always private to the individual user
```

--------------------------------------------------------------------------------

---[FILE: workflow-variables.mdx]---
Location: sim-main/apps/docs/content/docs/en/variables/workflow-variables.mdx

```text
---
title: Workflow Variables
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Variables in Sim act as a global store for data that can be accessed and modified by any block in your workflow, allowing you to store and share data across your workflow with global variables. They provide a powerful way to share information between different parts of your workflow, maintain state, and create more dynamic applications.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables.mp4" />
</div>

<Callout type="info">
  Variables allow you to store and share data across your entire workflow, making it easy to
  maintain state and create complex, interconnected systems.
</Callout>

## Overview

The Variables feature serves as a central data store for your workflow, enabling you to:

<Steps>
  <Step>
    <strong>Store global data</strong>: Create variables that persist throughout workflow execution
  </Step>
  <Step>
    <strong>Share information between blocks</strong>: Access the same data from any block in your
    workflow
  </Step>
  <Step>
    <strong>Maintain workflow state</strong>: Keep track of important values as your workflow runs
  </Step>
  <Step>
    <strong>Create dynamic workflows</strong>: Build more flexible systems that can adapt based on
    stored values
  </Step>
</Steps>

## Creating Variables

You can create and manage variables from the Variables panel in the sidebar. Each variable has:

- **Name**: A unique identifier used to reference the variable
- **Value**: The data stored in the variable (supports various data types)
- **Description** (optional): A note explaining the variable's purpose

## Accessing Variables

Variables can be accessed from any block in your workflow using the variable dropdown. Simply:

1. Type `<` in any text field within a block
2. Browse the dropdown menu to select from available variables
3. Select the variable you want to use

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables-dropdown.mp4" />
</div>

<Callout>
  You can also drag the connection tag into a field to open the variable dropdown and access
  available variables.
</Callout>

## Variable Types

Variables in Sim can store various types of data:

<Tabs items={['Text', 'Numbers', 'Boolean', 'Objects', 'Arrays']}>
  <Tab>
    ```
    "Hello, World!"
    ```
    <p className="mt-2">Text variables store strings of characters. They're useful for storing messages, names, and other text data.</p>
  </Tab>
  <Tab>
    ```
    42
    ```
    <p className="mt-2">Number variables store numeric values that can be used in calculations or comparisons.</p>
  </Tab>
  <Tab>
    ```
    true
    ```
    <p className="mt-2">Boolean variables store true/false values, perfect for flags and condition checks.</p>
  </Tab>
  <Tab>
    ```json
    {
      "name": "John",
      "age": 30,
      "city": "New York"
    }
    ```
    <p className="mt-2">Object variables store structured data with properties and values.</p>
  </Tab>
  <Tab>
    ```json
    [1, 2, 3, "four", "five"]
    ```
    <p className="mt-2">Array variables store ordered collections of items.</p>
  </Tab>
</Tabs>

## Using Variables in Blocks

When you access a variable from a block, you can:

- **Read its value**: Use the variable's current value in your block's logic
- **Modify it**: Update the variable's value based on your block's processing
- **Use it in expressions**: Include variables in expressions and calculations

## Variable Scope

Variables in Sim have global scope, meaning:

- They are accessible from any block in your workflow
- Changes to variables persist throughout workflow execution
- Variables maintain their values between runs, unless explicitly reset

## Best Practices

- **Use Descriptive Names**: Choose variable names that clearly indicate what the variable represents. For example, use `userPreferences` instead of `up`.
- **Document Your Variables**: Add descriptions to your variables to help other team members understand their purpose and usage.
- **Consider Variable Scope**: Remember that variables are global and can be modified by any block. Design your workflow with this in mind to prevent unexpected behavior.
- **Initialize Variables Early**: Set up and initialize your variables at the beginning of your workflow to ensure they're available when needed.
- **Handle Missing Variables**: Always consider the case where a variable might not yet exist or might have an unexpected value. Add appropriate validation in your blocks.
- **Limit Variable Count**: Keep the number of variables manageable. Too many variables can make your workflow difficult to understand and maintain.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/es/index.mdx

```text
---
title: Documentación
---

import { Card, Cards } from 'fumadocs-ui/components/card'

# Documentación de Sim

Bienvenido a Sim, un constructor visual de flujos de trabajo para aplicaciones de IA. Crea potentes agentes de IA, flujos de trabajo de automatización y canales de procesamiento de datos conectando bloques en un lienzo.

## Inicio rápido

<Cards>
  <Card title="Introducción" href="/introduction">
    Aprende lo que puedes construir con Sim
  </Card>
  <Card title="Primeros pasos" href="/getting-started">
    Crea tu primer flujo de trabajo en 10 minutos
  </Card>
  <Card title="Bloques de flujo de trabajo" href="/blocks">
    Aprende sobre los bloques de construcción
  </Card>
  <Card title="Herramientas e integraciones" href="/tools">
    Explora más de 80 integraciones incorporadas
  </Card>
</Cards>

## Conceptos fundamentales

<Cards>
  <Card title="Conexiones" href="/connections">
    Comprende cómo fluyen los datos entre bloques
  </Card>
  <Card title="Variables" href="/variables">
    Trabaja con variables de flujo de trabajo y de entorno
  </Card>
  <Card title="Ejecución" href="/execution">
    Monitoriza las ejecuciones de flujos de trabajo y gestiona costos
  </Card>
  <Card title="Disparadores" href="/triggers">
    Inicia flujos de trabajo mediante API, webhooks o programaciones
  </Card>
</Cards>

## Características avanzadas

<Cards>
  <Card title="Gestión de equipo" href="/permissions/roles-and-permissions">
    Configura roles y permisos del espacio de trabajo
  </Card>
  <Card title="Integración MCP" href="/mcp">
    Conecta servicios externos con el Protocolo de Contexto de Modelo
  </Card>
  <Card title="SDKs" href="/sdks">
    Integra Sim en tus aplicaciones
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: agent.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/agent.mdx

```text
---
title: Agente
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque Agente conecta tu flujo de trabajo con Modelos de Lenguaje Grandes (LLMs). Procesa entradas en lenguaje natural, llama a herramientas externas y genera salidas estructuradas o no estructuradas.

<div className="flex justify-center">
  <Image
    src="/static/blocks/agent.png"
    alt="Configuración del bloque Agente"
    width={500}
    height={400}
    className="my-6"
  />
</div> 

## Opciones de configuración

### Prompt del sistema

El prompt del sistema establece los parámetros operativos y las restricciones de comportamiento del agente. Esta configuración define el rol del agente, la metodología de respuesta y los límites de procesamiento para todas las solicitudes entrantes.

```markdown
You are a helpful assistant that specializes in financial analysis.
Always provide clear explanations and cite sources when possible.
When responding to questions about investments, include risk disclaimers.
```

### Prompt del usuario

El prompt del usuario representa los datos de entrada principales para el procesamiento de inferencia. Este parámetro acepta texto en lenguaje natural o datos estructurados que el agente analizará y a los que responderá. Las fuentes de entrada incluyen:

- **Configuración estática**: Entrada de texto directa especificada en la configuración del bloque
- **Entrada dinámica**: Datos pasados desde bloques anteriores a través de interfaces de conexión
- **Generación en tiempo de ejecución**: Contenido generado programáticamente durante la ejecución del flujo de trabajo

### Selección de modelo

El bloque Agente admite múltiples proveedores de LLM a través de una interfaz de inferencia unificada. Los modelos disponibles incluyen:

- **OpenAI**: GPT-5.1, GPT-5, GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 4.5 Sonnet, Claude Opus 4.1
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Otros proveedores**: Groq, Cerebras, xAI, Azure OpenAI, OpenRouter
- **Modelos locales**: modelos compatibles con Ollama o VLLM

### Temperatura

Controla la aleatoriedad y creatividad de la respuesta:

- **Baja (0-0.3)**: Determinista y enfocada. Mejor para tareas factuales y precisión.
- **Media (0.3-0.7)**: Equilibrio entre creatividad y enfoque. Buena para uso general.
- **Alta (0.7-2.0)**: Creativa y variada. Ideal para lluvia de ideas y generación de contenido.

### Clave API

Tu clave API para el proveedor LLM seleccionado. Se almacena de forma segura y se utiliza para la autenticación.

### Herramientas

Amplía las capacidades del agente con integraciones externas. Selecciona entre más de 60 herramientas predefinidas o define funciones personalizadas.

**Categorías disponibles:**
- **Comunicación**: Gmail, Slack, Telegram, WhatsApp, Microsoft Teams
- **Fuentes de datos**: Notion, Google Sheets, Airtable, Supabase, Pinecone
- **Servicios web**: Firecrawl, Google Search, Exa AI, automatización de navegador
- **Desarrollo**: GitHub, Jira, Linear
- **Servicios de IA**: OpenAI, Perplexity, Hugging Face, ElevenLabs

**Modos de ejecución:**
- **Auto**: El modelo decide cuándo usar herramientas según el contexto
- **Requerido**: La herramienta debe ser llamada en cada solicitud
- **Ninguno**: Herramienta disponible pero no sugerida al modelo

### Formato de respuesta

El parámetro de formato de respuesta impone la generación de salidas estructuradas mediante la validación de esquemas JSON. Esto asegura respuestas consistentes y legibles por máquina que se ajustan a estructuras de datos predefinidas:

```json
{
  "name": "user_analysis",
  "schema": {
    "type": "object",
    "properties": {
      "sentiment": {
        "type": "string",
        "enum": ["positive", "negative", "neutral"]
      },
      "confidence": {
        "type": "number",
        "minimum": 0,
        "maximum": 1
      }
    },
    "required": ["sentiment", "confidence"]
  }
}
```

Esta configuración restringe la salida del modelo para que cumpla con el esquema especificado, evitando respuestas de texto libre y asegurando la generación de datos estructurados.

### Acceso a los resultados

Después de que un agente completa su tarea, puedes acceder a sus salidas:

- **`<agent.content>`**: El texto de respuesta del agente o datos estructurados
- **`<agent.tokens>`**: Estadísticas de uso de tokens (prompt, completion, total)
- **`<agent.tool_calls>`**: Detalles de cualquier herramienta que el agente utilizó durante la ejecución
- **`<agent.cost>`**: Costo estimado de la llamada a la API (si está disponible)

## Funciones avanzadas

### Memoria + Agente: Historial de conversación

Utiliza un bloque `Memory` con un `id` consistente (por ejemplo, `chat`) para persistir mensajes entre ejecuciones, e incluir ese historial en el prompt del Agente.

- Añade el mensaje del usuario antes del Agente
- Lee el historial de conversación para contexto
- Añade la respuesta del Agente después de que se ejecute

Consulta la referencia del bloque [`Memory`](/tools/memory) para más detalles.

## Salidas

- **`<agent.content>`**: Texto de respuesta del agente
- **`<agent.tokens>`**: Estadísticas de uso de tokens
- **`<agent.tool_calls>`**: Detalles de ejecución de herramientas
- **`<agent.cost>`**: Costo estimado de la llamada a la API

## Ejemplos de casos de uso

**Automatización de atención al cliente** - Gestiona consultas con acceso a base de datos y herramientas

```
API (Ticket) → Agent (Postgres, KB, Linear) → Gmail (Reply) → Memory (Save)
```

**Análisis de contenido multi-modelo** - Analiza contenido con diferentes modelos de IA

```
Function (Process) → Agent (GPT-4o Technical) → Agent (Claude Sentiment) → Function (Report)
```

**Asistente de investigación con herramientas** - Investiga con búsqueda web y acceso a documentos

```
Input → Agent (Google Search, Notion) → Function (Compile Report)
```

## Mejores prácticas

- **Sé específico en los prompts del sistema**: Define claramente el rol, tono y limitaciones del agente. Cuanto más específicas sean tus instrucciones, mejor podrá el agente cumplir con su propósito.
- **Elige la configuración de temperatura adecuada**: Usa configuraciones de temperatura más bajas (0-0.3) cuando la precisión sea importante, o aumenta la temperatura (0.7-2.0) para respuestas más creativas o variadas.
- **Aprovecha las herramientas eficazmente**: Integra herramientas que complementen el propósito del agente y mejoren sus capacidades. Sé selectivo con las herramientas que proporcionas para evitar sobrecargar al agente. Para tareas con poco solapamiento, usa otro bloque de Agente para obtener mejores resultados.
```

--------------------------------------------------------------------------------

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/es/blocks/api.mdx

```text
---
title: API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

El bloque API conecta tu flujo de trabajo con servicios externos a través de peticiones HTTP. Admite los métodos GET, POST, PUT, DELETE y PATCH para interactuar con APIs REST.

<div className="flex justify-center">
  <Image
    src="/static/blocks/api.png"
    alt="Bloque API"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Opciones de configuración

### URL

La URL del endpoint para la petición API. Puede ser:

- Una URL estática introducida directamente en el bloque
- Una URL dinámica conectada desde la salida de otro bloque
- Una URL con parámetros de ruta

### Método

Selecciona el método HTTP para tu petición:

- **GET**: Recuperar datos del servidor
- **POST**: Enviar datos al servidor para crear un recurso
- **PUT**: Actualizar un recurso existente en el servidor
- **DELETE**: Eliminar un recurso del servidor
- **PATCH**: Actualizar parcialmente un recurso existente

### Parámetros de consulta

Define pares clave-valor que se añadirán a la URL como parámetros de consulta. Por ejemplo:

```
Key: apiKey
Value: your_api_key_here

Key: limit
Value: 10
```

Estos se añadirían a la URL como `?apiKey=your_api_key_here&limit=10`.

### Cabeceras

Configura las cabeceras HTTP para tu petición. Las cabeceras comunes incluyen:

```
Key: Content-Type
Value: application/json

Key: Authorization
Value: Bearer your_token_here
```

### Cuerpo de la petición

Para métodos que admiten un cuerpo de petición (POST, PUT, PATCH), puedes definir los datos a enviar. El cuerpo puede ser:

- Datos JSON introducidos directamente en el bloque
- Datos conectados desde la salida de otro bloque
- Generados dinámicamente durante la ejecución del flujo de trabajo

### Acceso a los resultados

Después de que se complete una petición API, puedes acceder a sus salidas:

- **`<api.data>`**: Los datos del cuerpo de respuesta de la API
- **`<api.status>`**: Código de estado HTTP (200, 404, 500, etc.)
- **`<api.headers>`**: Cabeceras de respuesta del servidor
- **`<api.error>`**: Detalles del error si la petición falló

## Funciones avanzadas

### Construcción dinámica de URL

Construye URLs dinámicamente usando variables de bloques anteriores:

```javascript
// In a Function block before the API
const userId = <start.userId>;
const apiUrl = `https://api.example.com/users/${userId}/profile`;
```

### Reintentos de solicitudes

El bloque API maneja automáticamente:
- Tiempos de espera de red con retroceso exponencial
- Respuestas de límite de tasa (códigos de estado 429)
- Errores del servidor (códigos de estado 5xx) con lógica de reintento
- Fallos de conexión con intentos de reconexión

### Validación de respuestas

Valida las respuestas de la API antes de procesarlas:

```javascript
// In a Function block after the API
if (<api.status> === 200) {
  const data = <api.data>;
  // Process successful response
} else {
  // Handle error response
  console.error(`API Error: ${<api.status>}`);
}
```

## Salidas

- **`<api.data>`**: Datos del cuerpo de respuesta de la API
- **`<api.status>`**: Código de estado HTTP
- **`<api.headers>`**: Cabeceras de respuesta
- **`<api.error>`**: Detalles del error si la solicitud falló

## Ejemplos de casos de uso

**Obtener datos de perfil de usuario** - Recuperar información de usuario de un servicio externo

```
Function (Build ID) → API (GET /users/{id}) → Function (Format) → Response
```

**Procesamiento de pagos** - Procesar pagos a través de la API de Stripe

```
Function (Validate) → API (Stripe) → Condition (Success) → Supabase (Update)
```

## Mejores prácticas

- **Usar variables de entorno para datos sensibles**: No codificar directamente claves API o credenciales
- **Manejar errores con elegancia**: Conectar lógica de manejo de errores para solicitudes fallidas
- **Validar respuestas**: Comprobar códigos de estado y formatos de respuesta antes de procesar datos
- **Respetar límites de tasa**: Tener en cuenta los límites de tasa de la API e implementar la limitación apropiada
```

--------------------------------------------------------------------------------

````
