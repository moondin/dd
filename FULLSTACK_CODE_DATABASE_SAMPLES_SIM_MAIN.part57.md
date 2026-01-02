---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 57
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 57 of 933)

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

---[FILE: workflow-variables.mdx]---
Location: sim-main/apps/docs/content/docs/de/variables/workflow-variables.mdx

```text
---
title: Workflow-Variablen
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Variablen in Sim fungieren als globaler Speicher für Daten, auf die von jedem Block in Ihrem Workflow zugegriffen und die von jedem Block geändert werden können, sodass Sie Daten über Ihren Workflow hinweg mit globalen Variablen speichern und teilen können. Sie bieten eine leistungsstarke Möglichkeit, Informationen zwischen verschiedenen Teilen Ihres Workflows auszutauschen, den Status beizubehalten und dynamischere Anwendungen zu erstellen.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables.mp4" />
</div>

<Callout type="info">
  Variablen ermöglichen es Ihnen, Daten über Ihren gesamten Workflow hinweg zu speichern und zu teilen, was es einfach macht,
  den Status beizubehalten und komplexe, miteinander verbundene Systeme zu erstellen.
</Callout>

## Überblick

Die Variablen-Funktion dient als zentraler Datenspeicher für Ihren Workflow und ermöglicht Ihnen:

<Steps>
  <Step>
    <strong>Globale Daten speichern</strong>: Erstellen Sie Variablen, die während der gesamten Workflow-Ausführung bestehen bleiben
  </Step>
  <Step>
    <strong>Informationen zwischen Blöcken teilen</strong>: Greifen Sie von jedem Block in Ihrem Workflow auf dieselben Daten zu
  </Step>
  <Step>
    <strong>Workflow-Status beibehalten</strong>: Behalten Sie wichtige Werte im Auge, während Ihr Workflow läuft
  </Step>
  <Step>
    <strong>Dynamische Workflows erstellen</strong>: Bauen Sie flexiblere Systeme, die sich basierend auf gespeicherten Werten anpassen können
  </Step>
</Steps>

## Variablen erstellen

Sie können Variablen über das Variablen-Panel in der Seitenleiste erstellen und verwalten. Jede Variable hat:

- **Name**: Eine eindeutige Kennung, die zum Referenzieren der Variable verwendet wird
- **Wert**: Die in der Variable gespeicherten Daten (unterstützt verschiedene Datentypen)
- **Beschreibung** (optional): Eine Notiz, die den Zweck der Variable erklärt

## Auf Variablen zugreifen

Auf Variablen kann von jedem Block in Ihrem Workflow über das Variablen-Dropdown zugegriffen werden. Einfach:

1. Gib `<` in ein beliebiges Textfeld innerhalb eines Blocks ein
2. Durchsuche das Dropdown-Menü, um aus verfügbaren Variablen auszuwählen
3. Wähle die Variable aus, die du verwenden möchtest

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables-dropdown.mp4" />
</div>

<Callout>
  Du kannst auch das Verbindungs-Tag in ein Feld ziehen, um das Variablen-Dropdown zu öffnen und auf
  verfügbare Variablen zuzugreifen.
</Callout>

## Variablentypen

Variablen in Sim können verschiedene Arten von Daten speichern:

<Tabs items={['Text', 'Numbers', 'Boolean', 'Objects', 'Arrays']}>
  <Tab>

    ```
    "Hello, World!"
    ```

    <p className="mt-2">Textvariablen speichern Zeichenketten. Sie sind nützlich für die Speicherung von Nachrichten, Namen und anderen Textdaten.</p>
  </Tab>
  <Tab>

    ```
    42
    ```

    <p className="mt-2">Zahlenvariablen speichern numerische Werte, die in Berechnungen oder Vergleichen verwendet werden können.</p>
  </Tab>
  <Tab>

    ```
    true
    ```

    <p className="mt-2">Boolesche Variablen speichern Wahr/Falsch-Werte, perfekt für Flags und Bedingungsprüfungen.</p>
  </Tab>
  <Tab>

    ```json
    {
      "name": "John",
      "age": 30,
      "city": "New York"
    }
    ```

    <p className="mt-2">Objektvariablen speichern strukturierte Daten mit Eigenschaften und Werten.</p>
  </Tab>
  <Tab>

    ```json
    [1, 2, 3, "four", "five"]
    ```

    <p className="mt-2">Array-Variablen speichern geordnete Sammlungen von Elementen.</p>
  </Tab>
</Tabs>

## Verwendung von Variablen in Blöcken

Wenn du auf eine Variable aus einem Block zugreifst, kannst du:

- **Ihren Wert lesen**: Verwende den aktuellen Wert der Variable in der Logik deines Blocks
- **Sie modifizieren**: Aktualisiere den Wert der Variable basierend auf der Verarbeitung deines Blocks
- **Sie in Ausdrücken verwenden**: Füge Variablen in Ausdrücke und Berechnungen ein

## Variablenbereich

Variablen in Sim haben einen globalen Geltungsbereich, das bedeutet:

- Sie sind von jedem Block in deinem Workflow aus zugänglich
- Änderungen an Variablen bleiben während der gesamten Workflow-Ausführung bestehen
- Variablen behalten ihre Werte zwischen den Durchläufen bei, sofern sie nicht explizit zurückgesetzt werden

## Best Practices

- **Verwende beschreibende Namen**: Wähle Variablennamen, die klar angeben, was die Variable darstellt. Verwende zum Beispiel `userPreferences` anstatt `up`.
- **Dokumentiere deine Variablen**: Füge deinen Variablen Beschreibungen hinzu, um anderen Teammitgliedern zu helfen, ihren Zweck und ihre Verwendung zu verstehen.
- **Berücksichtige den Variablenbereich**: Denke daran, dass Variablen global sind und von jedem Block modifiziert werden können. Gestalte deinen Workflow mit diesem Gedanken, um unerwartetes Verhalten zu vermeiden.
- **Initialisiere Variablen frühzeitig**: Richte deine Variablen am Anfang deines Workflows ein und initialisiere sie, um sicherzustellen, dass sie bei Bedarf verfügbar sind.
- **Behandle fehlende Variablen**: Berücksichtige immer den Fall, dass eine Variable möglicherweise noch nicht existiert oder einen unerwarteten Wert haben könnte. Füge in deinen Blöcken eine entsprechende Validierung hinzu.
- **Begrenze die Anzahl der Variablen**: Halte die Anzahl der Variablen überschaubar. Zu viele Variablen können deinen Workflow schwer verständlich und wartbar machen.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/index.mdx

```text
---
title: Documentation
---

import { Card, Cards } from 'fumadocs-ui/components/card'

# Sim Documentation

Welcome to Sim, a visual workflow builder for AI applications. Build powerful AI agents, automation workflows, and data processing pipelines by connecting blocks on a canvas.

## Quick Start

<Cards>
  <Card title="Introduction" href="/introduction">
    Learn what you can build with Sim
  </Card>
  <Card title="Getting Started" href="/getting-started">
    Create your first workflow in 10 minutes
  </Card>
  <Card title="Workflow Blocks" href="/blocks">
    Learn about the building blocks
  </Card>
  <Card title="Tools & Integrations" href="/tools">
    Explore 80+ built-in integrations
  </Card>
</Cards>

## Core Concepts

<Cards>
  <Card title="Connections" href="/connections">
    Understand how data flows between blocks
  </Card>
  <Card title="Variables" href="/variables">
    Work with workflow and environment variables
  </Card>
  <Card title="Execution" href="/execution">
    Monitor workflow runs and manage costs
  </Card>
  <Card title="Triggers" href="/triggers">
    Start workflows via API, webhooks, or schedules
  </Card>
</Cards>

## Advanced Features

<Cards>
  <Card title="Team Management" href="/permissions/roles-and-permissions">
    Set up workspace roles and permissions
  </Card>
  <Card title="MCP Integration" href="/mcp">
    Connect external services with Model Context Protocol
  </Card>
  <Card title="SDKs" href="/sdks">
    Integrate Sim into your applications
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/en/meta.json

```json
{
  "title": "Sim Documentation",
  "pages": [
    "./introduction/index",
    "./getting-started/index",
    "triggers",
    "blocks",
    "tools",
    "connections",
    "mcp",
    "copilot",
    "knowledgebase",
    "variables",
    "execution",
    "permissions",
    "sdks",
    "self-hosting"
  ],
  "defaultOpen": false
}
```

--------------------------------------------------------------------------------

---[FILE: agent.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/agent.mdx

```text
---
title: Agent
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The Agent block connects your workflow to Large Language Models (LLMs). It processes natural language inputs, calls external tools, and generates structured or unstructured outputs.

<div className="flex justify-center">
  <Image
    src="/static/blocks/agent.png"
    alt="Agent Block Configuration"
    width={500}
    height={400}
    className="my-6"
  />
</div> 

## Configuration Options

### System Prompt

The system prompt establishes the agent's operational parameters and behavioral constraints. This configuration defines the agent's role, response methodology, and processing boundaries for all incoming requests.

```markdown
You are a helpful assistant that specializes in financial analysis.
Always provide clear explanations and cite sources when possible.
When responding to questions about investments, include risk disclaimers.
```

### User Prompt

The user prompt represents the primary input data for inference processing. This parameter accepts natural language text or structured data that the agent will analyze and respond to. Input sources include:

- **Static Configuration**: Direct text input specified in the block configuration
- **Dynamic Input**: Data passed from upstream blocks through connection interfaces
- **Runtime Generation**: Programmatically generated content during workflow execution

### Model Selection

The Agent block supports multiple LLM providers through a unified inference interface. Available models include:

- **OpenAI**: GPT-5.1, GPT-5, GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 4.5 Sonnet, Claude Opus 4.1
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Other Providers**: Groq, Cerebras, xAI, Azure OpenAI, OpenRouter
- **Local Models**: Ollama or VLLM compatible models

### Temperature

Controls response randomness and creativity:

- **Low (0-0.3)**: Deterministic and focused. Best for factual tasks and accuracy.
- **Medium (0.3-0.7)**: Balanced creativity and focus. Good for general use.
- **High (0.7-2.0)**: Creative and varied. Ideal for brainstorming and content generation.

### API Key

Your API key for the selected LLM provider. This is securely stored and used for authentication.

### Tools

Extend agent capabilities with external integrations. Select from 60+ pre-built tools or define custom functions.

**Available Categories:**
- **Communication**: Gmail, Slack, Telegram, WhatsApp, Microsoft Teams
- **Data Sources**: Notion, Google Sheets, Airtable, Supabase, Pinecone
- **Web Services**: Firecrawl, Google Search, Exa AI, browser automation
- **Development**: GitHub, Jira, Linear
- **AI Services**: OpenAI, Perplexity, Hugging Face, ElevenLabs

**Execution Modes:**
- **Auto**: Model decides when to use tools based on context
- **Required**: Tool must be called in every request
- **None**: Tool available but not suggested to model

### Response Format

The Response Format parameter enforces structured output generation through JSON Schema validation. This ensures consistent, machine-readable responses that conform to predefined data structures:

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

This configuration constrains the model's output to comply with the specified schema, preventing free-form text responses and ensuring structured data generation.

### Accessing Results

After an agent completes, you can access its outputs:

- **`<agent.content>`**: The agent's response text or structured data
- **`<agent.tokens>`**: Token usage statistics (prompt, completion, total)
- **`<agent.tool_calls>`**: Details of any tools the agent used during execution
- **`<agent.cost>`**: Estimated cost of the API call (if available)

## Advanced Features

### Memory + Agent: Conversation History

Use a `Memory` block with a consistent `id` (for example, `chat`) to persist messages between runs, and include that history in the Agent's prompt.

- Add the user's message before the Agent
- Read the conversation history for context
- Append the Agent's reply after it runs

See the [`Memory`](/tools/memory) block reference for details.

## Outputs

- **`<agent.content>`**: Agent's response text
- **`<agent.tokens>`**: Token usage statistics
- **`<agent.tool_calls>`**: Tool execution details
- **`<agent.cost>`**: Estimated API call cost

## Example Use Cases

**Customer Support Automation** - Handle inquiries with database and tool access
```
API (Ticket) → Agent (Postgres, KB, Linear) → Gmail (Reply) → Memory (Save)
```

**Multi-Model Content Analysis** - Analyze content with different AI models
```
Function (Process) → Agent (GPT-4o Technical) → Agent (Claude Sentiment) → Function (Report)
```

**Tool-Powered Research Assistant** - Research with web search and document access
```
Input → Agent (Google Search, Notion) → Function (Compile Report)
```

## Best Practices

- **Be specific in system prompts**: Clearly define the agent's role, tone, and limitations. The more specific your instructions are, the better the agent will be able to fulfill its intended purpose.
- **Choose the right temperature setting**: Use lower temperature settings (0-0.3) when accuracy is important, or increase temperature (0.7-2.0) for more creative or varied responses
- **Leverage tools effectively**: Integrate tools that complement the agent's purpose and enhance its capabilities. Be selective about which tools you provide to avoid overwhelming the agent. For tasks with little overlap, use another Agent block for the best results.
```

--------------------------------------------------------------------------------

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/api.mdx

```text
---
title: API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The API block connects your workflow to external services through HTTP requests. Supports GET, POST, PUT, DELETE, and PATCH methods for interacting with REST APIs.

<div className="flex justify-center">
  <Image
    src="/static/blocks/api.png"
    alt="API Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuration Options

### URL

The endpoint URL for the API request. This can be:

- A static URL entered directly in the block
- A dynamic URL connected from another block's output
- A URL with path parameters

### Method

Select the HTTP method for your request:

- **GET**: Retrieve data from the server
- **POST**: Send data to the server to create a resource
- **PUT**: Update an existing resource on the server
- **DELETE**: Remove a resource from the server
- **PATCH**: Partially update an existing resource

### Query Parameters

Define key-value pairs that will be appended to the URL as query parameters. For example:

```
Key: apiKey
Value: your_api_key_here

Key: limit
Value: 10
```

These would be added to the URL as `?apiKey=your_api_key_here&limit=10`.

### Headers

Configure HTTP headers for your request. Common headers include:

```
Key: Content-Type
Value: application/json

Key: Authorization
Value: Bearer your_token_here
```

### Request Body

For methods that support a request body (POST, PUT, PATCH), you can define the data to send. The body can be:

- JSON data entered directly in the block
- Data connected from another block's output
- Dynamically generated during workflow execution

### Accessing Results

After an API request completes, you can access its outputs:

- **`<api.data>`**: The response body data from the API
- **`<api.status>`**: HTTP status code (200, 404, 500, etc.)
- **`<api.headers>`**: Response headers from the server
- **`<api.error>`**: Error details if the request failed

## Advanced Features

### Dynamic URL Construction

Build URLs dynamically using variables from previous blocks:

```javascript
// In a Function block before the API
const userId = <start.userId>;
const apiUrl = `https://api.example.com/users/${userId}/profile`;
```

### Request Retries

The API block automatically handles:
- Network timeouts with exponential backoff
- Rate limit responses (429 status codes)
- Server errors (5xx status codes) with retry logic
- Connection failures with reconnection attempts

### Response Validation

Validate API responses before processing:

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

## Outputs

- **`<api.data>`**: Response body data from the API
- **`<api.status>`**: HTTP status code
- **`<api.headers>`**: Response headers
- **`<api.error>`**: Error details if request failed

## Example Use Cases

**Fetch User Profile Data** - Retrieve user information from external service
```
Function (Build ID) → API (GET /users/{id}) → Function (Format) → Response
```

**Payment Processing** - Process payment through Stripe API
```
Function (Validate) → API (Stripe) → Condition (Success) → Supabase (Update)
```

## Best Practices

- **Use environment variables for sensitive data**: Don't hardcode API keys or credentials
- **Handle errors gracefully**: Connect error handling logic for failed requests
- **Validate responses**: Check status codes and response formats before processing data
- **Respect rate limits**: Be mindful of API rate limits and implement appropriate throttling
```

--------------------------------------------------------------------------------

---[FILE: condition.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/condition.mdx

```text
---
title: Condition
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The Condition block branches workflow execution based on boolean expressions. Evaluate conditions using previous block outputs and route to different paths without requiring an LLM.

<div className="flex justify-center">
  <Image
    src="/static/blocks/condition.png"
    alt="Condition Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuration Options

### Conditions

Define one or more conditions that will be evaluated. Each condition includes:

- **Expression**: A JavaScript/TypeScript expression that evaluates to true or false
- **Path**: The destination block to route to if the condition is true
- **Description**: Optional explanation of what the condition checks

You can create multiple conditions that are evaluated in order, with the first matching condition determining the execution path.

### Condition Expression Format

Conditions use JavaScript syntax and can reference input values from previous blocks.

<Tabs items={['Score Threshold', 'Text Analysis', 'Multiple Conditions']}>
  <Tab>
    ```javascript
    // Check if a score is above a threshold
    <agent.score> > 75
    ```
  </Tab>
  <Tab>
    ```javascript
    // Check if a text contains specific keywords
    <agent.text>.includes('urgent') || <agent.text>.includes('emergency')
    ```
  </Tab>
  <Tab>
    ```javascript
    // Check multiple conditions
    <agent.age> >= 18 && <agent.country> === 'US'
    ```
  </Tab>
</Tabs>


### Accessing Results

After a condition evaluates, you can access its outputs:

- **`<condition.result>`**: Boolean result of the condition evaluation
- **`<condition.matched_condition>`**: ID of the condition that was matched
- **`<condition.content>`**: Description of the evaluation result
- **`<condition.path>`**: Details of the chosen routing destination

## Advanced Features

### Complex Expressions

Use JavaScript operators and functions in conditions:

```javascript
// String operations
<user.email>.endsWith('@company.com')

// Array operations
<api.tags>.includes('urgent')

// Mathematical operations
<agent.confidence> * 100 > 85

// Date comparisons
new Date(<api.created_at>) > new Date('2024-01-01')
```

### Multiple Condition Evaluation

Conditions are evaluated in order until one matches:

```javascript
// Condition 1: Check for high priority
<ticket.priority> === 'high'

// Condition 2: Check for urgent keywords
<ticket.subject>.toLowerCase().includes('urgent')

// Condition 3: Default fallback
true
```

### Error Handling

Conditions automatically handle:
- Undefined or null values with safe evaluation
- Type mismatches with appropriate fallbacks
- Invalid expressions with error logging
- Missing variables with default values

## Outputs

- **`<condition.result>`**: Boolean result of the evaluation
- **`<condition.matched_condition>`**: ID of the matched condition
- **`<condition.content>`**: Description of the evaluation result
- **`<condition.path>`**: Details of the chosen routing destination

## Example Use Cases

**Customer Support Routing** - Route tickets based on priority
```
API (Ticket) → Condition (priority === 'high') → Agent (Escalation) or Agent (Standard)
```

**Content Moderation** - Filter content based on analysis
```
Agent (Analyze) → Condition (toxicity > 0.7) → Moderation or Publish
```

**User Onboarding Flow** - Personalize onboarding based on user type
```
Function (Process) → Condition (account_type === 'enterprise') → Advanced or Simple
```

## Best Practices

- **Order conditions correctly**: Place more specific conditions before general ones to ensure specific logic takes precedence over fallbacks
- **Use the else branch when needed**: If no conditions match and the else branch is not connected, the workflow branch will end gracefully. Connect the else branch if you need a fallback path for unmatched cases
- **Keep expressions simple**: Use clear, straightforward boolean expressions for better readability and easier debugging
- **Document your conditions**: Add descriptions to explain the purpose of each condition for better team collaboration and maintenance
- **Test edge cases**: Verify conditions handle boundary values correctly by testing with values at the edges of your condition ranges
```

--------------------------------------------------------------------------------

---[FILE: evaluator.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/evaluator.mdx

```text
---
title: Evaluator
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The Evaluator block uses AI to score and assess content quality against custom metrics. Perfect for quality control, A/B testing, and ensuring AI outputs meet specific standards.

<div className="flex justify-center">
  <Image
    src="/static/blocks/evaluator.png"
    alt="Evaluator Block Configuration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuration Options

### Evaluation Metrics

Define custom metrics to evaluate content against. Each metric includes:

- **Name**: A short identifier for the metric
- **Description**: A detailed explanation of what the metric measures
- **Range**: The numeric range for scoring (e.g., 1-5, 0-10)

Example metrics:

```
Accuracy (1-5): How factually accurate is the content?
Clarity (1-5): How clear and understandable is the content?
Relevance (1-5): How relevant is the content to the original query?
```

### Content

The content to be evaluated. This can be:

- Directly provided in the block configuration
- Connected from another block's output (typically an Agent block)
- Dynamically generated during workflow execution

### Model Selection

Choose an AI model to perform the evaluation:

- **OpenAI**: GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Other Providers**: Groq, Cerebras, xAI, DeepSeek
- **Local Models**: Ollama or VLLM compatible models

Use models with strong reasoning capabilities like GPT-4o or Claude 3.7 Sonnet for best results.

### API Key

Your API key for the selected LLM provider. This is securely stored and used for authentication.

## Example Use Cases

**Content Quality Assessment** - Evaluate content before publication
```
Agent (Generate) → Evaluator (Score) → Condition (Check threshold) → Publish or Revise
```

**A/B Testing Content** - Compare multiple AI-generated responses
```
Parallel (Variations) → Evaluator (Score Each) → Function (Select Best) → Response
```

**Customer Support Quality Control** - Ensure responses meet quality standards
```
Agent (Support Response) → Evaluator (Score) → Function (Log) → Condition (Review if Low)
```

## Outputs

- **`<evaluator.content>`**: Summary of the evaluation with scores
- **`<evaluator.model>`**: Model used for evaluation
- **`<evaluator.tokens>`**: Token usage statistics
- **`<evaluator.cost>`**: Estimated evaluation cost

## Best Practices

- **Use specific metric descriptions**: Clearly define what each metric measures to get more accurate evaluations
- **Choose appropriate ranges**: Select scoring ranges that provide enough granularity without being overly complex
- **Connect with Agent blocks**: Use Evaluator blocks to assess Agent block outputs and create feedback loops
- **Use consistent metrics**: For comparative analysis, maintain consistent metrics across similar evaluations
- **Combine multiple metrics**: Use several metrics to get a comprehensive evaluation
```

--------------------------------------------------------------------------------

---[FILE: function.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/function.mdx

```text
---
title: Function
---

import { Image } from '@/components/ui/image'

The Function block executes custom JavaScript or TypeScript code in your workflows. Transform data, perform calculations, or implement custom logic.

<div className="flex justify-center">
  <Image
    src="/static/blocks/function.png"
    alt="Function Block with Code Editor"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Outputs

- **`<function.result>`**: The value returned from your function
- **`<function.stdout>`**: Console.log() output from your code

## Example Use Cases

**Data Processing Pipeline** - Transform API response into structured data
```
API (Fetch) → Function (Process & Validate) → Function (Calculate Metrics) → Response
```

**Business Logic Implementation** - Calculate loyalty scores and tiers
```
Agent (Get History) → Function (Calculate Score) → Function (Determine Tier) → Condition (Route)
```

**Data Validation and Sanitization** - Validate and clean user input
```
Input → Function (Validate & Sanitize) → API (Save to Database)
```

### Example: Loyalty Score Calculator

```javascript title="loyalty-calculator.js"
// Process customer data and calculate loyalty score
const { purchaseHistory, accountAge, supportTickets } = <agent>;

// Calculate metrics
const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0);
const purchaseFrequency = purchaseHistory.length / (accountAge / 365);
const ticketRatio = supportTickets.resolved / supportTickets.total;

// Calculate loyalty score (0-100)
const spendScore = Math.min(totalSpent / 1000 * 30, 30);
const frequencyScore = Math.min(purchaseFrequency * 20, 40);
const supportScore = ticketRatio * 30;

const loyaltyScore = Math.round(spendScore + frequencyScore + supportScore);

return {
  customer: <agent.name>,
  loyaltyScore,
  loyaltyTier: loyaltyScore >= 80 ? "Platinum" : loyaltyScore >= 60 ? "Gold" : "Silver",
  metrics: { spendScore, frequencyScore, supportScore }
};
```

## Best Practices

- **Keep functions focused**: Write functions that do one thing well to improve maintainability and debugging
- **Handle errors gracefully**: Use try/catch blocks to handle potential errors and provide meaningful error messages
- **Test edge cases**: Ensure your code handles unusual inputs, null values, and boundary conditions correctly
- **Optimize for performance**: Be mindful of computational complexity and memory usage for large datasets
- **Use console.log() for debugging**: Leverage stdout output to debug and monitor function execution
```

--------------------------------------------------------------------------------

---[FILE: guardrails.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/guardrails.mdx

```text
---
title: Guardrails
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

The Guardrails block validates and protects your AI workflows by checking content against multiple validation types. Ensure data quality, prevent hallucinations, detect PII, and enforce format requirements before content moves through your workflow.

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails.png"
    alt="Guardrails Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Validation Types

### JSON Validation

Validates that content is properly formatted JSON. Perfect for ensuring structured LLM outputs can be safely parsed.

**Use Cases:**
- Validate JSON responses from Agent blocks before parsing
- Ensure API payloads are properly formatted
- Check structured data integrity

**Output:**
- `passed`: `true` if valid JSON, `false` otherwise
- `error`: Error message if validation fails (e.g., "Invalid JSON: Unexpected token...")

### Regex Validation

Checks if content matches a specified regular expression pattern.

**Use Cases:**
- Validate email addresses
- Check phone number formats
- Verify URLs or custom identifiers
- Enforce specific text patterns

**Configuration:**
- **Regex Pattern**: The regular expression to match against (e.g., `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` for emails)

**Output:**
- `passed`: `true` if content matches pattern, `false` otherwise
- `error`: Error message if validation fails

### Hallucination Detection

Uses Retrieval-Augmented Generation (RAG) with LLM scoring to detect when AI-generated content contradicts or isn't grounded in your knowledge base.

**How It Works:**
1. Queries your knowledge base for relevant context
2. Sends both the AI output and retrieved context to an LLM
3. LLM assigns a confidence score (0-10 scale)
   - **0** = Full hallucination (completely ungrounded)
   - **10** = Fully grounded (completely supported by knowledge base)
4. Validation passes if score ≥ threshold (default: 3)

**Configuration:**
- **Knowledge Base**: Select from your existing knowledge bases
- **Model**: Choose LLM for scoring (requires strong reasoning - GPT-4o, Claude 3.7 Sonnet recommended)
- **API Key**: Authentication for selected LLM provider (auto-hidden for hosted/Ollama or VLLM compatible models)
- **Confidence Threshold**: Minimum score to pass (0-10, default: 3)
- **Top K** (Advanced): Number of knowledge base chunks to retrieve (default: 10)

**Output:**
- `passed`: `true` if confidence score ≥ threshold
- `score`: Confidence score (0-10)
- `reasoning`: LLM's explanation for the score
- `error`: Error message if validation fails

**Use Cases:**
- Validate Agent responses against documentation
- Ensure customer support answers are factually accurate
- Verify generated content matches source material
- Quality control for RAG applications

### PII Detection

Detects personally identifiable information using Microsoft Presidio. Supports 40+ entity types across multiple countries and languages.

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails-2.png"
    alt="PII Detection Configuration"
    width={700}
    height={450}
    className="my-6"
  />
</div>

**How It Works:**
1. Pass content to validate (e.g., `<agent1.content>`)
2. Select PII types to detect using the modal selector
3. Choose detection mode (Detect or Mask)
4. Content is scanned for matching PII entities
5. Returns detection results and optionally masked text

<div className="mx-auto w-3/5 overflow-hidden rounded-lg">
  <Video src="guardrails.mp4" width={500} height={350} />
</div>

**Configuration:**
- **PII Types to Detect**: Select from grouped categories via modal selector
  - **Common**: Person name, Email, Phone, Credit card, IP address, etc.
  - **USA**: SSN, Driver's license, Passport, etc.
  - **UK**: NHS number, National insurance number
  - **Spain**: NIF, NIE, CIF
  - **Italy**: Fiscal code, Driver's license, VAT code
  - **Poland**: PESEL, NIP, REGON
  - **Singapore**: NRIC/FIN, UEN
  - **Australia**: ABN, ACN, TFN, Medicare
  - **India**: Aadhaar, PAN, Passport, Voter number
- **Mode**: 
  - **Detect**: Only identify PII (default)
  - **Mask**: Replace detected PII with masked values
- **Language**: Detection language (default: English)

**Output:**
- `passed`: `false` if any selected PII types are detected
- `detectedEntities`: Array of detected PII with type, location, and confidence
- `maskedText`: Content with PII masked (only if mode = "Mask")
- `error`: Error message if validation fails

**Use Cases:**
- Block content containing sensitive personal information
- Mask PII before logging or storing data
- Compliance with GDPR, HIPAA, and other privacy regulations
- Sanitize user inputs before processing

## Configuration

### Content to Validate

The input content to validate. This typically comes from:
- Agent block outputs: `<agent.content>`
- Function block results: `<function.output>`
- API responses: `<api.output>`
- Any other block output

### Validation Type

Choose from four validation types:
- **Valid JSON**: Check if content is properly formatted JSON
- **Regex Match**: Verify content matches a regex pattern
- **Hallucination Check**: Validate against knowledge base with LLM scoring
- **PII Detection**: Detect and optionally mask personally identifiable information

## Outputs

All validation types return:

- **`<guardrails.passed>`**: Boolean indicating if validation passed
- **`<guardrails.validationType>`**: The type of validation performed
- **`<guardrails.input>`**: The original input that was validated
- **`<guardrails.error>`**: Error message if validation failed (optional)

Additional outputs by type:

**Hallucination Check:**
- **`<guardrails.score>`**: Confidence score (0-10)
- **`<guardrails.reasoning>`**: LLM's explanation

**PII Detection:**
- **`<guardrails.detectedEntities>`**: Array of detected PII entities
- **`<guardrails.maskedText>`**: Content with PII masked (if mode = "Mask")

## Example Use Cases

**Validate JSON Before Parsing** - Ensure Agent output is valid JSON
```
Agent (Generate) → Guardrails (Validate) → Condition (Check passed) → Function (Parse)
```

**Prevent Hallucinations** - Validate customer support responses against knowledge base
```
Agent (Response) → Guardrails (Check KB) → Condition (Score ≥ 3) → Send or Flag
```

**Block PII in User Inputs** - Sanitize user-submitted content
```
Input → Guardrails (Detect PII) → Condition (No PII) → Process or Reject
```

## Best Practices

- **Chain with Condition blocks**: Use `<guardrails.passed>` to branch workflow logic based on validation results
- **Use JSON validation before parsing**: Always validate JSON structure before attempting to parse LLM outputs
- **Choose appropriate PII types**: Only select the PII entity types relevant to your use case for better performance
- **Set reasonable confidence thresholds**: For hallucination detection, adjust threshold based on your accuracy requirements (higher = stricter)
- **Use strong models for hallucination detection**: GPT-4o or Claude 3.7 Sonnet provide more accurate confidence scoring
- **Mask PII for logging**: Use "Mask" mode when you need to log or store content that may contain PII
- **Test regex patterns**: Validate your regex patterns thoroughly before deploying to production
- **Monitor validation failures**: Track `<guardrails.error>` messages to identify common validation issues

<Callout type="info">
  Guardrails validation happens synchronously in your workflow. For hallucination detection, choose faster models (like GPT-4o-mini) if latency is critical.
</Callout>
```

--------------------------------------------------------------------------------

````
