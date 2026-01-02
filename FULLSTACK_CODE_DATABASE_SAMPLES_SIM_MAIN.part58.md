---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 58
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 58 of 933)

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

---[FILE: human-in-the-loop.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/human-in-the-loop.mdx

```text
---
title: Human in the Loop
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

The Human in the Loop block pauses workflow execution and waits for human intervention before continuing. Use it to add approval gates, collect feedback, or gather additional input at critical decision points.

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-1.png"
    alt="Human in the Loop Block Configuration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

When execution reaches this block, the workflow pauses indefinitely until a human provides input through the approval portal, API, or webhook.

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-2.png"
    alt="Human in the Loop Approval Portal"
    width={700}
    height={500}
    className="my-6"
  />
</div>

## Configuration Options

### Paused Output

Defines what data is displayed to the approver. This is the context shown in the approval portal to help them make an informed decision.

Use the visual builder or JSON editor to structure the data. Reference workflow variables using `<blockName.output>` syntax.

```json
{
  "customerName": "<agent1.content.name>",
  "proposedAction": "<router1.selectedPath>",
  "confidenceScore": "<evaluator1.score>",
  "generatedEmail": "<agent2.content>"
}
```

### Notification

Configures how approvers are alerted when approval is needed. Supported channels include:

- **Slack** - Messages to channels or DMs
- **Gmail** - Email with approval link
- **Microsoft Teams** - Team channel notifications
- **SMS** - Text alerts via Twilio
- **Webhooks** - Custom notification systems

Include the approval URL (`<blockId.url>`) in your notification messages so approvers can access the portal.

### Resume Input

Defines the fields approvers fill in when responding. This data becomes available to downstream blocks after the workflow resumes.

```json
{
  "approved": {
    "type": "boolean",
    "description": "Approve or reject this request"
  },
  "comments": {
    "type": "string",
    "description": "Optional feedback or explanation"
  }
}
```

Access resume data in downstream blocks using `<blockId.resumeInput.fieldName>`. 

## Approval Methods

<Tabs items={['Approval Portal', 'API', 'Webhook']}>
  <Tab>
    ### Approval Portal
    
    Every block generates a unique portal URL (`<blockId.url>`) with a visual interface showing all paused output data and form fields for resume input. Mobile-responsive and secure.
    
    Share this URL in notifications for approvers to review and respond.
  </Tab>
  <Tab>
    ### REST API
    
    Programmatically resume workflows:
    
    ```bash
    POST /api/workflows/{workflowId}/executions/{executionId}/resume/{blockId}
    
    {
      "approved": true,
      "comments": "Looks good to proceed"
    }
    ```
    
    Build custom approval UIs or integrate with existing systems.
  </Tab>
  <Tab>
    ### Webhook
    
    Add a webhook tool to the Notification section to send approval requests to external systems. Integrate with ticketing systems like Jira or ServiceNow.
  </Tab>
</Tabs>

## Common Use Cases

**Content Approval** - Review AI-generated content before publishing
```
Agent → Human in the Loop → API (Publish)
```

**Multi-Stage Approvals** - Chain multiple approval steps for high-stakes decisions
```
Agent → Human in the Loop (Manager) → Human in the Loop (Director) → Execute
```

**Data Validation** - Verify extracted data before processing
```
Agent (Extract) → Human in the Loop (Validate) → Function (Process)
```

**Quality Control** - Review AI outputs before sending to customers
```
Agent (Generate) → Human in the Loop (QA) → Gmail (Send)
```

## Block Outputs

**`url`** - Unique URL for the approval portal  
**`resumeInput.*`** - All fields defined in Resume Input become available after the workflow resumes

Access using `<blockId.resumeInput.fieldName>`.

## Example

**Paused Output:**
```json
{
  "title": "<agent1.content.title>",
  "body": "<agent1.content.body>",
  "qualityScore": "<evaluator1.score>"
}
```

**Resume Input:**
```json
{
  "approved": { "type": "boolean" },
  "feedback": { "type": "string" }
}
```

**Downstream Usage:**
```javascript
// Condition block
<approval1.resumeInput.approved> === true
```
The example below shows an approval portal as seen by an approver after the workflow is paused. Approvers can review the data and provide inputs as a part of the workflow resumption. The approval portal can be accessed directly via the unique URL, `<blockId.url>`.

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="hitl-resume.mp4" width={700} height={450} />
</div>

## Related Blocks

- **[Condition](/blocks/condition)** - Branch based on approval decisions
- **[Variables](/blocks/variables)** - Store approval history and metadata
- **[Response](/blocks/response)** - Return workflow results to API callers
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/index.mdx

```text
---
title: Overview
description: The building components of your AI workflows
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Blocks are the building components you connect together to create AI workflows. Think of them as specialized modules that each handle a specific task—from chatting with AI models to making API calls or processing data.

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## Core Block Types

Sim provides essential block types that handle the core functions of AI workflows:

### Processing Blocks
- **[Agent](/blocks/agent)** - Chat with AI models (OpenAI, Anthropic, Google, local models)
- **[Function](/blocks/function)** - Run custom JavaScript/TypeScript code
- **[API](/blocks/api)** - Connect to external services via HTTP requests

### Logic Blocks
- **[Condition](/blocks/condition)** - Branch workflow paths based on boolean expressions
- **[Router](/blocks/router)** - Use AI to intelligently route requests to different paths
- **[Evaluator](/blocks/evaluator)** - Score and assess content quality using AI

### Control Flow Blocks
- **[Variables](/blocks/variables)** - Set and manage workflow-scoped variables
- **[Wait](/blocks/wait)** - Pause workflow execution for a specified time delay
- **[Human in the Loop](/blocks/human-in-the-loop)** - Pause for human approval and feedback before continuing

### Output Blocks
- **[Response](/blocks/response)** - Format and return final results from your workflow

## How Blocks Work

Each block has three main components:

**Inputs**: Data coming into the block from other blocks or user input
**Configuration**: Settings that control how the block behaves
**Outputs**: Data the block produces for other blocks to use

<Steps>
  <Step>
    <strong>Receive Input</strong>: Block receives data from connected blocks or user input
  </Step>
  <Step>
    <strong>Process</strong>: Block processes the input according to its configuration
  </Step>
  <Step>
    <strong>Output Results</strong>: Block produces output data for the next blocks in the workflow
  </Step>
</Steps>

## Connecting Blocks

You create workflows by connecting blocks together. The output of one block becomes the input of another:

- **Drag to connect**: Drag from an output port to an input port
- **Multiple connections**: One output can connect to multiple inputs
- **Branching paths**: Some blocks can route to different paths based on conditions

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## Common Patterns

### Sequential Processing
Connect blocks in a chain where each block processes the output of the previous one:
```
User Input → Agent → Function → Response
```

### Conditional Branching
Use Condition or Router blocks to create different paths:
```
User Input → Router → Agent A (for questions)
                   → Agent B (for commands)
```

### Quality Control
Use Evaluator blocks to assess and filter outputs:
```
Agent → Evaluator → Condition → Response (if good)
                              → Agent (retry if bad)
```

## Block Configuration

Each block type has specific configuration options:

**All Blocks**:
- Input/output connections
- Error handling behavior
- Execution timeout settings

**AI Blocks** (Agent, Router, Evaluator):
- Model selection (OpenAI, Anthropic, Google, local)
- API keys and authentication
- Temperature and other model parameters
- System prompts and instructions

**Logic Blocks** (Condition, Function):
- Custom expressions or code
- Variable references
- Execution environment settings

**Integration Blocks** (API, Response):
- Endpoint configuration
- Headers and authentication
- Request/response formatting

<Cards>
  <Card title="Agent Block" href="/blocks/agent">
    Connect to AI models and create intelligent responses
  </Card>
  <Card title="Function Block" href="/blocks/function">
    Run custom code to process and transform data
  </Card>
  <Card title="API Block" href="/blocks/api">
    Integrate with external services and APIs
  </Card>
  <Card title="Condition Block" href="/blocks/condition">
    Create branching logic based on data evaluation
  </Card>
  <Card title="Human in the Loop Block" href="/blocks/human-in-the-loop">
    Pause for human approval and feedback before continuing
  </Card>
  <Card title="Variables Block" href="/blocks/variables">
    Set and manage workflow-scoped variables
  </Card>
  <Card title="Wait Block" href="/blocks/wait">
    Pause workflow execution for specified time delays
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: loop.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/loop.mdx

```text
---
title: Loop
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The Loop block is a container that executes blocks repeatedly. Iterate over collections, repeat operations a fixed number of times, or continue while a condition is met.

<Callout type="info">
  Loop blocks are container nodes that hold other blocks inside them. The contained blocks execute multiple times based on your configuration.
</Callout>

## Configuration Options

### Loop Type

Choose between four types of loops:

<Tabs items={['For Loop', 'ForEach Loop', 'While Loop', 'Do-While Loop']}>
  <Tab>
    **For Loop (Iterations)** - A numeric loop that executes a fixed number of times:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-1.png"
        alt="For Loop with iterations"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Use this when you need to repeat an operation a specific number of times.
    
    ```
    Example: Run 5 times
    - Iteration 1
    - Iteration 2
    - Iteration 3
    - Iteration 4
    - Iteration 5
    ```
  </Tab>
  <Tab>
    **ForEach Loop (Collection)** - A collection-based loop that iterates over each item in an array or object:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-2.png"
        alt="ForEach Loop with collection"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Use this when you need to process a collection of items.
    
    ```
    Example: Process ["apple", "banana", "orange"]
    - Iteration 1: Process "apple"
    - Iteration 2: Process "banana"
    - Iteration 3: Process "orange"
    ```
  </Tab>
  <Tab>
    **While Loop (Condition-based)** - Continues executing while a condition evaluates to true:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-3.png"
        alt="While Loop with condition"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Use this when you need to loop until a specific condition is met. The condition is checked **before** each iteration.

    ```
    Example: While {"<variable.i>"} < 10
    - Check condition → Execute if true
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Execute if true
    - Check condition → Exit if false
    ```
  </Tab>
  <Tab>
    **Do-While Loop (Condition-based)** - Executes at least once, then continues while a condition is true:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-4.png"
        alt="Do-While Loop with condition"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Use this when you need to execute at least once, then loop until a condition is met. The condition is checked **after** each iteration.

    ```
    Example: Do-while {"<variable.i>"} < 10
    - Execute blocks
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Continue if true
    - Check condition → Exit if false
    ```
  </Tab>
</Tabs>

## How to Use Loops

### Creating a Loop

1. Drag a Loop block from the toolbar onto your canvas
2. Configure the loop type and parameters
3. Drag other blocks inside the loop container
4. Connect the blocks as needed

### Accessing Results

After a loop completes, you can access aggregated results:

- **`<loop.results>`**: Array of results from all loop iterations

## Example Use Cases

**Processing API Results** - ForEach loop processes customer records from an API
```
API (Fetch) → Loop (ForEach) → Agent (Analyze) → Function (Store)
```

**Iterative Content Generation** - For loop generates multiple content variations
```
Loop (5x) → Agent (Generate) → Evaluator (Score) → Function (Select Best)
```

**Counter with While Loop** - While loop processes items with counter
```
Variables (i=0) → Loop (While i<10) → Agent (Process) → Variables (i++)
```

## Advanced Features

### Limitations

<Callout type="warning">
  Container blocks (Loops and Parallels) cannot be nested inside each other. This means:
  - You cannot place a Loop block inside another Loop block
  - You cannot place a Parallel block inside a Loop block
  - You cannot place any container block inside another container block
  
  If you need multi-dimensional iteration, consider restructuring your workflow to use sequential loops or process data in stages.
</Callout>

<Callout type="info">
  Loops execute sequentially, not in parallel. If you need concurrent execution, use the Parallel block instead.
</Callout>

## Inputs and Outputs

<Tabs items={['Configuration', 'Variables', 'Results']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>Loop Type</strong>: Choose between 'for', 'forEach', 'while', or 'doWhile'
      </li>
      <li>
        <strong>Iterations</strong>: Number of times to execute (for loops)
      </li>
      <li>
        <strong>Collection</strong>: Array or object to iterate over (forEach loops)
      </li>
      <li>
        <strong>Condition</strong>: Boolean expression to evaluate (while/do-while loops)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.currentItem</strong>: Current item being processed
      </li>
      <li>
        <strong>loop.index</strong>: Current iteration number (0-based)
      </li>
      <li>
        <strong>loop.items</strong>: Full collection (forEach loops)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.results</strong>: Array of all iteration results
      </li>
      <li>
        <strong>Structure</strong>: Results maintain iteration order
      </li>
      <li>
        <strong>Access</strong>: Available in blocks after the loop
      </li>
    </ul>
  </Tab>
</Tabs>

## Best Practices

- **Set reasonable limits**: Keep iteration counts reasonable to avoid long execution times
- **Use ForEach for collections**: When processing arrays or objects, use ForEach instead of For loops
- **Handle errors gracefully**: Consider adding error handling inside loops for robust workflows
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/en/blocks/meta.json

```json
{
  "pages": [
    "index",
    "agent",
    "api",
    "condition",
    "evaluator",
    "function",
    "guardrails",
    "human-in-the-loop",
    "loop",
    "parallel",
    "response",
    "router",
    "variables",
    "wait",
    "workflow"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: parallel.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/parallel.mdx

```text
---
title: Parallel
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The Parallel block is a container that executes multiple instances concurrently for faster workflow processing. Process items simultaneously instead of sequentially.

<Callout type="info">
  Parallel blocks are container nodes that execute their contents multiple times simultaneously, unlike loops which execute sequentially.
</Callout>

## Configuration Options

### Parallel Type

Choose between two types of parallel execution:

<Tabs items={['Count-based', 'Collection-based']}>
  <Tab>
    **Count-based Parallel** - Execute a fixed number of parallel instances:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-1.png"
        alt="Count-based parallel execution"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Use this when you need to run the same operation multiple times concurrently.
    
    ```
    Example: Run 5 parallel instances
    - Instance 1 ┐
    - Instance 2 ├─ All execute simultaneously
    - Instance 3 │
    - Instance 4 │
    - Instance 5 ┘
    ```
  </Tab>
  <Tab>
    **Collection-based Parallel** - Distribute a collection across parallel instances:
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-2.png"
        alt="Collection-based parallel execution"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    Each instance processes one item from the collection simultaneously.
    
    ```
    Example: Process ["task1", "task2", "task3"] in parallel
    - Instance 1: Process "task1" ┐
    - Instance 2: Process "task2" ├─ All execute simultaneously
    - Instance 3: Process "task3" ┘
    ```
  </Tab>
</Tabs>

## How to Use Parallel Blocks

### Creating a Parallel Block

1. Drag a Parallel block from the toolbar onto your canvas
2. Configure the parallel type and parameters
3. Drag a single block inside the parallel container
4. Connect the block as needed

### Accessing Results

After a parallel block completes, you can access aggregated results:

- **`<parallel.results>`**: Array of results from all parallel instances

## Example Use Cases

**Batch API Processing** - Process multiple API calls simultaneously
```
Parallel (Collection) → API (Call Endpoint) → Function (Aggregate)
```

**Multi-Model AI Processing** - Get responses from multiple AI models concurrently
```
Parallel (["gpt-4o", "claude-3.7-sonnet", "gemini-2.5-pro"]) → Agent → Evaluator (Select Best)
```

## Advanced Features

### Result Aggregation

Results from all parallel instances are automatically collected:

```javascript
// In a Function block after the parallel
const allResults = input.parallel.results;
// Returns: [result1, result2, result3, ...]
```

### Instance Isolation

Each parallel instance runs independently:
- Separate variable scopes
- No shared state between instances
- Failures in one instance don't affect others

### Limitations

<Callout type="warning">
  Container blocks (Loops and Parallels) cannot be nested inside each other. This means:
  - You cannot place a Loop block inside a Parallel block
  - You cannot place another Parallel block inside a Parallel block
  - You cannot place any container block inside another container block
</Callout>

<Callout type="info">
  While parallel execution is faster, be mindful of:
  - API rate limits when making concurrent requests
  - Memory usage with large datasets
  - Maximum of 20 concurrent instances to prevent resource exhaustion
</Callout>

## Parallel vs Loop

Understanding when to use each:

| Feature | Parallel | Loop |
|---------|----------|------|
| Execution | Concurrent | Sequential |
| Speed | Faster for independent operations | Slower but ordered |
| Order | No guaranteed order | Maintains order |
| Use case | Independent operations | Dependent operations |
| Resource usage | Higher | Lower |

## Inputs and Outputs

<Tabs items={['Configuration', 'Variables', 'Results']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>Parallel Type</strong>: Choose between 'count' or 'collection'
      </li>
      <li>
        <strong>Count</strong>: Number of instances to run (count-based)
      </li>
      <li>
        <strong>Collection</strong>: Array or object to distribute (collection-based)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.currentItem</strong>: Item for this instance
      </li>
      <li>
        <strong>parallel.index</strong>: Instance number (0-based)
      </li>
      <li>
        <strong>parallel.items</strong>: Full collection (collection-based)
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.results</strong>: Array of all instance results
      </li>
      <li>
        <strong>Access</strong>: Available in blocks after the parallel
      </li>
    </ul>
  </Tab>
</Tabs>

## Best Practices

- **Independent operations only**: Ensure operations don't depend on each other
- **Handle rate limits**: Add delays or throttling for API-heavy workflows
- **Error handling**: Each instance should handle its own errors gracefully
```

--------------------------------------------------------------------------------

---[FILE: response.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/response.mdx

```text
---
title: Response
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The Response block formats and sends structured HTTP responses back to API callers. Use it to return workflow results with proper status codes and headers.

<div className="flex justify-center">
  <Image
    src="/static/blocks/response.png"
    alt="Response Block Configuration"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout type="info">
  Response blocks are terminal blocks - they end workflow execution and cannot connect to other blocks.
</Callout>

## Configuration Options

### Response Data

The response data is the main content that will be sent back to the API caller. This should be formatted as JSON and can include:

- Static values
- Dynamic references to workflow variables using the `<variable.name>` syntax
- Nested objects and arrays
- Any valid JSON structure

### Status Code

Set the HTTP status code for the response (defaults to 200):

**Success (2xx):**
- **200**: OK - Standard success response
- **201**: Created - Resource successfully created
- **204**: No Content - Success with no response body

**Client Error (4xx):**
- **400**: Bad Request - Invalid request parameters
- **401**: Unauthorized - Authentication required
- **404**: Not Found - Resource doesn't exist
- **422**: Unprocessable Entity - Validation errors

**Server Error (5xx):**
- **500**: Internal Server Error - Server-side error
- **502**: Bad Gateway - External service error
- **503**: Service Unavailable - Service temporarily down

### Response Headers

Configure additional HTTP headers to include in the response.

Headers are configured as key-value pairs:

| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Cache-Control | no-cache |
| X-API-Version | 1.0 |

## Example Use Cases

**API Endpoint Response** - Return structured data from a search API
```
Agent (Search) → Function (Format & Paginate) → Response (200, JSON)
```

**Webhook Confirmation** - Acknowledge webhook receipt and processing
```
Webhook Trigger → Function (Process) → Response (200, Confirmation)
```

**Error Response Handling** - Return appropriate error responses
```
Condition (Error Detected) → Router → Response (400/500, Error Details)
```

## Outputs

Response blocks are terminal - they end workflow execution and send the HTTP response to the API caller. No outputs are available to downstream blocks.

## Variable References

Use the `<variable.name>` syntax to dynamically insert workflow variables into your response:

```json
{
  "user": {
    "id": "<variable.userId>",
    "name": "<variable.userName>",
    "email": "<variable.userEmail>"
  },
  "query": "<variable.searchQuery>",
  "results": "<variable.searchResults>",
  "totalFound": "<variable.resultCount>",
  "processingTime": "<variable.executionTime>ms"
}
```

<Callout type="warning">
  Variable names are case-sensitive and must match exactly with the variables available in your workflow.
</Callout>

## Best Practices

- **Use meaningful status codes**: Choose appropriate HTTP status codes that accurately reflect the outcome of the workflow
- **Structure your responses consistently**: Maintain a consistent JSON structure across all your API endpoints for better developer experience
- **Include relevant metadata**: Add timestamps and version information to help with debugging and monitoring
- **Handle errors gracefully**: Use conditional logic in your workflow to set appropriate error responses with descriptive messages
- **Validate variable references**: Ensure all referenced variables exist and contain the expected data types before the Response block executes
```

--------------------------------------------------------------------------------

---[FILE: router.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/router.mdx

```text
---
title: Router
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

The Router block uses AI to intelligently route workflows based on content analysis. Unlike Condition blocks that use simple rules, Routers understand context and intent.

<div className="flex justify-center">
  <Image
    src="/static/blocks/router.png"
    alt="Router Block with Multiple Paths"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Router vs Condition

**Use Router when:**
- AI-powered content analysis is needed
- Working with unstructured or varying content
- Intent-based routing is required (e.g., "route support tickets to departments")

**Use Condition when:**
- Simple rule-based decisions are sufficient
- Working with structured data or numeric comparisons
- Fast, deterministic routing is needed

## Configuration Options

### Content/Prompt

The content or prompt that the Router will analyze to make routing decisions. This can be:

- A direct user query or input
- Output from a previous block
- A system-generated message

### Target Blocks

The possible destination blocks that the Router can select from. The Router will automatically detect connected blocks, but you can also:

- Customize the descriptions of target blocks to improve routing accuracy
- Specify routing criteria for each target block
- Exclude certain blocks from being considered as routing targets

### Model Selection

Choose an AI model to power the routing decision:

- **OpenAI**: GPT-4o, o1, o3, o4-mini, gpt-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Other Providers**: Groq, Cerebras, xAI, DeepSeek
- **Local Models**: Ollama or VLLM compatible models

Use models with strong reasoning capabilities like GPT-4o or Claude 3.7 Sonnet for best results.

### API Key

Your API key for the selected LLM provider. This is securely stored and used for authentication.

## Outputs

- **`<router.prompt>`**: Summary of the routing prompt
- **`<router.selected_path>`**: Chosen destination block
- **`<router.tokens>`**: Token usage statistics
- **`<router.cost>`**: Estimated routing cost
- **`<router.model>`**: Model used for decision-making

## Example Use Cases

**Customer Support Triage** - Route tickets to specialized departments
```
Input (Ticket) → Router → Agent (Engineering) or Agent (Finance)
```

**Content Classification** - Classify and route user-generated content
```
Input (Feedback) → Router → Workflow (Product) or Workflow (Technical)
```

**Lead Qualification** - Route leads based on qualification criteria
```
Input (Lead) → Router → Agent (Enterprise Sales) or Workflow (Self-serve)
```


## Best Practices

- **Provide clear target descriptions**: Help the Router understand when to select each destination with specific, detailed descriptions
- **Use specific routing criteria**: Define clear conditions and examples for each path to improve accuracy
- **Implement fallback paths**: Connect a default destination for when no specific path is appropriate
- **Test with diverse inputs**: Ensure the Router handles various input types, edge cases, and unexpected content
- **Monitor routing performance**: Review routing decisions regularly and refine criteria based on actual usage patterns
- **Choose appropriate models**: Use models with strong reasoning capabilities for complex routing decisions
```

--------------------------------------------------------------------------------

---[FILE: variables.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/variables.mdx

```text
---
title: Variables
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

The Variables block updates workflow variables during execution. Variables must first be initialized in your workflow's Variables section, then you can use this block to update their values as your workflow runs.

<div className="flex justify-center">
  <Image
    src="/static/blocks/variables.png"
    alt="Variables Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout>
  Access variables anywhere in your workflow using `<variable.variableName>` syntax.
</Callout>

## How to Use Variables

### 1. Initialize in Workflow Variables

First, create your variables in the workflow's Variables section (accessible from the workflow settings):

```
customerEmail = ""
retryCount = 0
currentStatus = "pending"
```

### 2. Update with Variables Block

Use the Variables block to update these values during execution:

```
customerEmail = <api.email>
retryCount = <variable.retryCount> + 1
currentStatus = "processing"
```

### 3. Access Anywhere

Reference variables in any block:

```
Agent prompt: "Send email to <variable.customerEmail>"
Condition: <variable.retryCount> < 5
API body: {"status": "<variable.currentStatus>"}
```

## Example Use Cases

**Loop Counter and State** - Track progress through iterations
```
Loop → Agent (Process) → Variables (itemsProcessed + 1) → Variables (Store lastResult)
```

**Retry Logic** - Track API retry attempts
```
API (Try) → Variables (retryCount + 1) → Condition (retryCount < 3)
```

**Dynamic Configuration** - Store user context for workflow
```
API (Fetch Profile) → Variables (userId, userTier) → Agent (Personalize)
```

## Outputs

- **`<variables.assignments>`**: JSON object with all variable assignments from this block

## Best Practices

- **Initialize in workflow settings**: Always create variables in the workflow Variables section before using them
- **Update dynamically**: Use Variables blocks to update values based on block outputs or calculations
- **Use in loops**: Perfect for tracking state across iterations
- **Name descriptively**: Use clear names like `currentIndex`, `totalProcessed`, or `lastError`
```

--------------------------------------------------------------------------------

---[FILE: wait.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/wait.mdx

```text
---
title: Wait
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

The Wait block pauses your workflow for a specified amount of time before continuing to the next block. Use it to add delays between actions, respect API rate limits, or space out operations.

<div className="flex justify-center">
  <Image
    src="/static/blocks/wait.png"
    alt="Wait Block"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## Configuration

### Wait Amount

Enter the duration to pause execution:
- **Input**: Positive number
- **Maximum**: 600 seconds (10 minutes) or 10 minutes

### Unit

Choose the time unit:
- **Seconds**: For short, precise delays
- **Minutes**: For longer pauses

<Callout type="info">
  Wait blocks can be cancelled by stopping the workflow. The maximum wait time is 10 minutes.
</Callout>

## Outputs

- **`<wait.waitDuration>`**: The wait duration in milliseconds
- **`<wait.status>`**: Status of the wait ('waiting', 'completed', or 'cancelled')

## Example Use Cases

**API Rate Limiting** - Stay within API rate limits between requests
```
API (Request 1) → Wait (2s) → API (Request 2)
```

**Timed Notifications** - Send follow-up messages after a delay
```
Function (Send Email) → Wait (5min) → Function (Follow-up)
```

**Processing Delays** - Wait for external system to complete processing
```
API (Trigger Job) → Wait (30s) → API (Check Status)
```

## Best Practices

- **Keep waits reasonable**: Use Wait for delays up to 10 minutes. For longer delays, consider scheduled workflows
- **Monitor execution time**: Remember that waits extend total workflow duration
```

--------------------------------------------------------------------------------

---[FILE: workflow.mdx]---
Location: sim-main/apps/docs/content/docs/en/blocks/workflow.mdx

```text
---
title: Workflow Block
description: Run another workflow inside the current flow
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

## What It Does

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow.png'
    alt='Workflow block configuration'
    width={500}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

Drop a Workflow block when you want to call a child workflow as part of a larger flow. The block runs the latest deployed version of that workflow, waits for it to finish, and then continues with the parent.

## Configure It

1. **Pick a workflow** from the dropdown (self-references are blocked to prevent loops).
2. **Map inputs**: If the child workflow has an Input Form trigger, you'll see each field and can connect parent variables. The mapped values are what the child receives.

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow-2.png'
    alt='Workflow block with input mapping example'
    width={700}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

3. **Outputs**: After the child finishes, the block exposes:
   - `result` – the child workflow's final response
   - `success` – whether it ran without errors
   - `error` – message when the run fails

## Deployment Status Badge

The Workflow block displays a deployment status badge to help you track whether the child workflow is ready to execute:

- **Deployed** – The child workflow has been deployed and is ready to use. The block will execute the current deployed version.
- **Undeployed** – The child workflow has never been deployed. You must deploy it before the Workflow block can execute it.
- **Redeploy** – Changes have been detected in the child workflow since the last deployment. Click the badge to redeploy the child workflow with the latest changes.

<Callout type="warn">
The Workflow block always executes the most recent deployed version of the child workflow, not the editor version. Make sure to redeploy after making changes to ensure the block uses the latest logic.
</Callout>

## Execution Notes

- Child workflows run in the same workspace context, so environment variables and tools carry over.
- The block uses deployment versioning: any API, schedule, webhook, manual, or chat execution calls the deployed snapshot. Redeploy the child when you change it.
- If the child fails, the block raises an error unless you handle it downstream.

<Callout>
Keep child workflows focused. Small, reusable flows make it easier to combine them without creating deep nesting.
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/en/connections/basics.mdx

```text
---
title: Basics
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Video } from '@/components/ui/video'

## How Connections Work

Connections are the pathways that allow data to flow between blocks in your workflow. In Sim, connections define how information passes from one block to another, enabling data flow throughout your workflow.

<Callout type="info">
  Each connection represents a directed relationship where data flows from a source block's output
  to a destination block's input.
</Callout>

### Creating Connections

<Steps>
  <Step>
    <strong>Select Source Block</strong>: Click on the output port of the block you want to connect
    from
  </Step>
  <Step>
    <strong>Draw Connection</strong>: Drag to the input port of the destination block
  </Step>
  <Step>
    <strong>Confirm Connection</strong>: Release to create the connection
  </Step>
</Steps>

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="connections-build.mp4" width={700} height={450} />
</div>

### Connection Flow

The flow of data through connections follows these principles:

1. **Directional Flow**: Data always flows from outputs to inputs
2. **Execution Order**: Blocks execute in order based on their connections
3. **Data Transformation**: Data may be transformed as it passes between blocks
4. **Conditional Paths**: Some blocks (like Router and Condition) can direct flow to different paths

<Callout type="warning">
  Deleting a connection will immediately stop data flow between the blocks. Make sure this is
  intended before removing connections.
</Callout>
```

--------------------------------------------------------------------------------

````
