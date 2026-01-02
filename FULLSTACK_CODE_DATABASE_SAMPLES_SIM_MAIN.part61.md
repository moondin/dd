---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 61
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 61 of 933)

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

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/en/knowledgebase/tags.mdx

```text
---
title: Tags and Filtering
---

import { Video } from '@/components/ui/video'

Tags provide a powerful way to organize your documents and create precise filtering for your vector searches. By combining tag-based filtering with semantic search, you can retrieve exactly the content you need from your knowledgebase.

## Adding Tags to Documents

You can add custom tags to any document in your knowledgebase to organize and categorize your content for easier retrieval.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag.mp4" width={700} height={450} />
</div>

### Tag Management
- **Custom tags**: Create your own tag system that fits your workflow
- **Multiple tags per document**: Apply as many tags as needed to each document, there are 7 tag slots available per knowledgebase that are shared by all documents in the knowledgebase
- **Tag organization**: Group related documents with consistent tagging

### Tag Best Practices
- **Consistent naming**: Use standardized tag names across your documents
- **Descriptive tags**: Use clear, meaningful tag names
- **Regular cleanup**: Remove unused or outdated tags periodically

## Using Tags in Knowledge Blocks

Tags become powerful when combined with the Knowledge block in your workflows. You can filter your searches to specific tagged content, ensuring your AI agents get the most relevant information.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag2.mp4" width={700} height={450} />
</div>

## Search Modes

The Knowledge block supports three different search modes depending on what you provide:

### 1. Tag-Only Search
When you **only provide tags** (no search query):
- **Direct retrieval**: Fetches all documents that have the specified tags
- **No vector search**: Results are based purely on tag matching
- **Fast performance**: Quick retrieval without semantic processing
- **Exact matching**: Only documents with all specified tags are returned

**Use case**: When you need all documents from a specific category or project

### 2. Vector Search Only
When you **only provide a search query** (no tags):
- **Semantic search**: Finds content based on meaning and context
- **Full knowledgebase**: Searches across all documents
- **Relevance ranking**: Results ordered by semantic similarity
- **Natural language**: Use questions or phrases to find relevant content

**Use case**: When you need the most relevant content regardless of organization

### 3. Combined Tag Filtering + Vector Search
When you **provide both tags and a search query**:
1. **First**: Filter documents to only those with the specified tags
2. **Then**: Perform vector search within that filtered subset
3. **Result**: Semantically relevant content from your tagged documents only

**Use case**: When you need relevant content from a specific category or project

### Search Configuration

#### Tag Filtering
- **Multiple tags**: Use multiple tags for OR logic (document must have one or more of the tags)
- **Tag combinations**: Mix different tag types for precise filtering
- **Case sensitivity**: Tag matching is case-insensitive
- **Partial matching**: Exact tag name matching required

#### Vector Search Parameters
- **Query complexity**: Natural language questions work best
- **Result limits**: Configure how many chunks to retrieve
- **Relevance threshold**: Set minimum similarity scores
- **Context window**: Adjust chunk size for your use case

## Integration with Workflows

### Knowledge Block Configuration
1. **Select knowledgebase**: Choose which knowledgebase to search
2. **Add tags**: Specify filtering tags (optional)
3. **Enter query**: Add your search query (optional)
4. **Configure results**: Set number of chunks to retrieve
5. **Test search**: Preview results before using in workflow

### Dynamic Tag Usage
- **Variable tags**: Use workflow variables as tag values
- **Conditional filtering**: Apply different tags based on workflow logic
- **Context-aware search**: Adjust tags based on conversation context
- **Multi-step filtering**: Refine searches through workflow steps

### Performance Optimization
- **Efficient filtering**: Tag filtering happens before vector search for better performance
- **Caching**: Frequently used tag combinations are cached for speed
- **Parallel processing**: Multiple tag searches can run simultaneously
- **Resource management**: Automatic optimization of search resources

## Getting Started with Tags

1. **Plan your tag structure**: Decide on consistent naming conventions
2. **Start tagging**: Add relevant tags to your existing documents
3. **Test combinations**: Experiment with tag + search query combinations
4. **Integrate into workflows**: Use the Knowledge block with your tagging strategy
5. **Refine over time**: Adjust your tagging approach based on search results

Tags transform your knowledgebase from a simple document store into a precisely organized, searchable intelligence system that your AI workflows can navigate with surgical precision.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/mcp/index.mdx

```text
---
title: MCP (Model Context Protocol)
---

import { Image } from '@/components/ui/image'
import { Callout } from 'fumadocs-ui/components/callout'

The Model Context Protocol ([MCP](https://modelcontextprotocol.com/)) allows you to connect external tools and services using a standardized protocol, enabling you to integrate APIs and services directly into your workflows. With MCP, you can extend Sim's capabilities by adding custom integrations that work seamlessly with your agents and workflows.

## What is MCP?

MCP is an open standard that enables AI assistants to securely connect to external data sources and tools. It provides a standardized way to:

- Connect to databases, APIs, and file systems
- Access real-time data from external services
- Execute custom tools and scripts
- Maintain secure, controlled access to external resources

## Configuring MCP Servers

MCP servers provide collections of tools that your agents can use. Configure them in workspace settings:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-1.png"
    alt="Configuring MCP Server in Settings"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. Navigate to your workspace settings
2. Go to the **MCP Servers** section
3. Click **Add MCP Server**
4. Enter the server configuration details
5. Save the configuration

<Callout type="info">
You can also configure MCP servers directly from the toolbar in an Agent block for quick setup.
</Callout>

## Using MCP Tools in Agents

Once MCP servers are configured, their tools become available within your agent blocks:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-2.png"
    alt="Using MCP Tool in Agent Block"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. Open an **Agent** block
2. In the **Tools** section, you'll see available MCP tools
3. Select the tools you want the agent to use
4. The agent can now access these tools during execution

## Standalone MCP Tool Block

For more granular control, you can use the dedicated MCP Tool block to execute specific MCP tools:

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-3.png"
    alt="Standalone MCP Tool Block"
    width={700}
    height={450}
    className="my-6"
  />
</div>

The MCP Tool block allows you to:
- Execute any configured MCP tool directly
- Pass specific parameters to the tool
- Use the tool's output in subsequent workflow steps
- Chain multiple MCP tools together

### When to Use MCP Tool vs Agent

**Use Agent with MCP tools when:**
- You want the AI to decide which tools to use
- You need complex reasoning about when and how to use tools
- You want natural language interaction with the tools

**Use MCP Tool block when:**
- You need deterministic tool execution
- You want to execute a specific tool with known parameters
- You're building structured workflows with predictable steps

## Permission Requirements

MCP functionality requires specific workspace permissions:

| Action | Required Permission |
|--------|-------------------|
| Configure MCP servers in settings | **Admin** |
| Use MCP tools in agents | **Write** or **Admin** |
| View available MCP tools | **Read**, **Write**, or **Admin** |
| Execute MCP Tool blocks | **Write** or **Admin** |

## Common Use Cases

### Database Integration
Connect to databases to query, insert, or update data within your workflows.

### API Integrations
Access external APIs and web services that don't have built-in Sim integrations.

### File System Access
Read, write, and manipulate files on local or remote file systems.

### Custom Business Logic
Execute custom scripts or tools specific to your organization's needs.

### Real-time Data Access
Fetch live data from external systems during workflow execution.

## Security Considerations

- MCP servers run with the permissions of the user who configured them
- Always verify MCP server sources before installation
- Use environment variables for sensitive configuration data
- Review MCP server capabilities before granting access to agents

## Troubleshooting

### MCP Server Not Appearing
- Verify the server configuration is correct
- Check that you have the required permissions
- Ensure the MCP server is running and accessible

### Tool Execution Failures
- Verify tool parameters are correctly formatted
- Check MCP server logs for error messages
- Ensure required authentication is configured

### Permission Errors
- Confirm your workspace permission level
- Check if the MCP server requires additional authentication
- Verify the server is properly configured for your workspace
```

--------------------------------------------------------------------------------

---[FILE: roles-and-permissions.mdx]---
Location: sim-main/apps/docs/content/docs/en/permissions/roles-and-permissions.mdx

```text
---
title: "Roles and Permissions"
---

import { Video } from '@/components/ui/video'

When you invite team members to your organization or workspace, you'll need to choose what level of access to give them. This guide explains what each permission level allows users to do, helping you understand team roles and what access each permission level provides.

## How to Invite Someone to a Workspace

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="invitations.mp4" width={700} height={450} />
</div>

## Workspace Permission Levels

When inviting someone to a workspace, you can assign one of three permission levels:

| Permission | What They Can Do |
|------------|------------------|
| **Read** | View workflows, see execution results, but cannot make any changes |
| **Write** | Create and edit workflows, run workflows, manage environment variables |
| **Admin** | Everything Write can do, plus invite/remove users and manage workspace settings |

## What Each Permission Level Can Do

Here's a detailed breakdown of what users can do with each permission level:

### Read Permission
**Perfect for:** Stakeholders, observers, or team members who need visibility but shouldn't make changes

**What they can do:**
- View all workflows in the workspace
- See workflow execution results and logs
- Browse workflow configurations and settings
- View environment variables (but not edit them)

**What they cannot do:**
- Create, edit, or delete workflows
- Run or deploy workflows
- Change any workspace settings
- Invite other users

### Write Permission  
**Perfect for:** Developers, content creators, or team members actively working on automation

**What they can do:**
- Everything Read users can do, plus:
- Create, edit, and delete workflows
- Run and deploy workflows
- Add, edit, and delete workspace environment variables
- Use all available tools and integrations
- Collaborate in real-time on workflow editing

**What they cannot do:**
- Invite or remove users from the workspace
- Change workspace settings
- Delete the workspace

### Admin Permission
**Perfect for:** Team leads, project managers, or technical leads who need to manage the workspace

**What they can do:**
- Everything Write users can do, plus:
- Invite new users to the workspace with any permission level
- Remove users from the workspace
- Manage workspace settings and integrations
- Configure external tool connections
- Delete workflows created by other users

**What they cannot do:**
- Delete the workspace (only the workspace owner can do this)
- Remove the workspace owner from the workspace

---

## Workspace Owner vs Admin

Every workspace has one **Owner** (the person who created it) plus any number of **Admins**.

### Workspace Owner
- Has all Admin permissions
- Can delete the workspace
- Cannot be removed from the workspace
- Can transfer ownership to another user

### Workspace Admin  
- Can do everything except delete the workspace or remove the owner
- Can be removed from the workspace by the owner or other admins

---

## Common Scenarios

### Adding a New Developer to Your Team
1. **Organization level**: Invite them as an **Organization Member**
2. **Workspace level**: Give them **Write** permission so they can create and edit workflows

### Adding a Project Manager
1. **Organization level**: Invite them as an **Organization Member** 
2. **Workspace level**: Give them **Admin** permission so they can manage the team and see everything

### Adding a Stakeholder or Client
1. **Organization level**: Invite them as an **Organization Member**
2. **Workspace level**: Give them **Read** permission so they can see progress but not make changes

---

## Environment Variables

Users can create two types of environment variables:

### Personal Environment Variables
- Only visible to the individual user
- Available in all workflows they run
- Managed in user settings

### Workspace Environment Variables
- **Read permission**: Can see variable names and values
- **Write/Admin permission**: Can add, edit, and delete variables
- Available to all workspace members
- If a personal variable has the same name as a workspace variable, the personal one takes priority

---

## Best Practices

### Start with Minimal Permissions
Give users the lowest permission level they need to do their job. You can always increase permissions later.

### Use Organization Structure Wisely
- Make trusted team leads **Organization Admins**
- Most team members should be **Organization Members**
- Reserve workspace **Admin** permissions for people who need to manage users

### Review Permissions Regularly
Periodically review who has access to what, especially when team members change roles or leave the company.

### Environment Variable Security
- Use personal environment variables for sensitive API keys
- Use workspace environment variables for shared configuration
- Regularly audit who has access to sensitive variables

---

## Organization Roles

When inviting someone to your organization, you can assign one of two roles:

### Organization Admin
**What they can do:**
- Invite and remove team members from the organization
- Create new workspaces
- Manage billing and subscription settings
- Access all workspaces within the organization

### Organization Member  
**What they can do:**
- Access workspaces they've been specifically invited to
- View the list of organization members
- Cannot invite new people or manage organization settings
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/en/sdks/meta.json

```json
{
  "title": "SDKs",
  "pages": ["python", "typescript"]
}
```

--------------------------------------------------------------------------------

---[FILE: python.mdx]---
Location: sim-main/apps/docs/content/docs/en/sdks/python.mdx

```text
---
title: Python
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

The official Python SDK for Sim allows you to execute workflows programmatically from your Python applications using the official Python SDK.

<Callout type="info">
  The Python SDK supports Python 3.8+ with async execution support, automatic rate limiting with exponential backoff, and usage tracking.
</Callout>

## Installation

Install the SDK using pip:

```bash
pip install simstudio-sdk
```

## Quick Start

Here's a simple example to get you started:

```python
from simstudio import SimStudioClient

# Initialize the client
client = SimStudioClient(
    api_key="your-api-key-here",
    base_url="https://sim.ai"  # optional, defaults to https://sim.ai
)

# Execute a workflow
try:
    result = client.execute_workflow("workflow-id")
    print("Workflow executed successfully:", result)
except Exception as error:
    print("Workflow execution failed:", error)
```

## API Reference

### SimStudioClient

#### Constructor

```python
SimStudioClient(api_key: str, base_url: str = "https://sim.ai")
```

**Parameters:**
- `api_key` (str): Your Sim API key
- `base_url` (str, optional): Base URL for the Sim API

#### Methods

##### execute_workflow()

Execute a workflow with optional input data.

```python
result = client.execute_workflow(
    "workflow-id",
    input_data={"message": "Hello, world!"},
    timeout=30.0  # 30 seconds
)
```

**Parameters:**
- `workflow_id` (str): The ID of the workflow to execute
- `input_data` (dict, optional): Input data to pass to the workflow
- `timeout` (float, optional): Timeout in seconds (default: 30.0)
- `stream` (bool, optional): Enable streaming responses (default: False)
- `selected_outputs` (list[str], optional): Block outputs to stream in `blockName.attribute` format (e.g., `["agent1.content"]`)
- `async_execution` (bool, optional): Execute asynchronously (default: False)

**Returns:** `WorkflowExecutionResult | AsyncExecutionResult`

When `async_execution=True`, returns immediately with a task ID for polling. Otherwise, waits for completion.

##### get_workflow_status()

Get the status of a workflow (deployment status, etc.).

```python
status = client.get_workflow_status("workflow-id")
print("Is deployed:", status.is_deployed)
```

**Parameters:**
- `workflow_id` (str): The ID of the workflow

**Returns:** `WorkflowStatus`

##### validate_workflow()

Validate that a workflow is ready for execution.

```python
is_ready = client.validate_workflow("workflow-id")
if is_ready:
    # Workflow is deployed and ready
    pass
```

**Parameters:**
- `workflow_id` (str): The ID of the workflow

**Returns:** `bool`

##### get_job_status()

Get the status of an async job execution.

```python
status = client.get_job_status("task-id-from-async-execution")
print("Status:", status["status"])  # 'queued', 'processing', 'completed', 'failed'
if status["status"] == "completed":
    print("Output:", status["output"])
```

**Parameters:**
- `task_id` (str): The task ID returned from async execution

**Returns:** `Dict[str, Any]`

**Response fields:**
- `success` (bool): Whether the request was successful
- `taskId` (str): The task ID
- `status` (str): One of `'queued'`, `'processing'`, `'completed'`, `'failed'`, `'cancelled'`
- `metadata` (dict): Contains `startedAt`, `completedAt`, and `duration`
- `output` (any, optional): The workflow output (when completed)
- `error` (any, optional): Error details (when failed)
- `estimatedDuration` (int, optional): Estimated duration in milliseconds (when processing/queued)

##### execute_with_retry()

Execute a workflow with automatic retry on rate limit errors using exponential backoff.

```python
result = client.execute_with_retry(
    "workflow-id",
    input_data={"message": "Hello"},
    timeout=30.0,
    max_retries=3,           # Maximum number of retries
    initial_delay=1.0,       # Initial delay in seconds
    max_delay=30.0,          # Maximum delay in seconds
    backoff_multiplier=2.0   # Exponential backoff multiplier
)
```

**Parameters:**
- `workflow_id` (str): The ID of the workflow to execute
- `input_data` (dict, optional): Input data to pass to the workflow
- `timeout` (float, optional): Timeout in seconds
- `stream` (bool, optional): Enable streaming responses
- `selected_outputs` (list, optional): Block outputs to stream
- `async_execution` (bool, optional): Execute asynchronously
- `max_retries` (int, optional): Maximum number of retries (default: 3)
- `initial_delay` (float, optional): Initial delay in seconds (default: 1.0)
- `max_delay` (float, optional): Maximum delay in seconds (default: 30.0)
- `backoff_multiplier` (float, optional): Backoff multiplier (default: 2.0)

**Returns:** `WorkflowExecutionResult | AsyncExecutionResult`

The retry logic uses exponential backoff (1s → 2s → 4s → 8s...) with ±25% jitter to prevent thundering herd. If the API provides a `retry-after` header, it will be used instead.

##### get_rate_limit_info()

Get the current rate limit information from the last API response.

```python
rate_limit_info = client.get_rate_limit_info()
if rate_limit_info:
    print("Limit:", rate_limit_info.limit)
    print("Remaining:", rate_limit_info.remaining)
    print("Reset:", datetime.fromtimestamp(rate_limit_info.reset))
```

**Returns:** `RateLimitInfo | None`

##### get_usage_limits()

Get current usage limits and quota information for your account.

```python
limits = client.get_usage_limits()
print("Sync requests remaining:", limits.rate_limit["sync"]["remaining"])
print("Async requests remaining:", limits.rate_limit["async"]["remaining"])
print("Current period cost:", limits.usage["currentPeriodCost"])
print("Plan:", limits.usage["plan"])
```

**Returns:** `UsageLimits`

**Response structure:**
```python
{
    "success": bool,
    "rateLimit": {
        "sync": {
            "isLimited": bool,
            "limit": int,
            "remaining": int,
            "resetAt": str
        },
        "async": {
            "isLimited": bool,
            "limit": int,
            "remaining": int,
            "resetAt": str
        },
        "authType": str  # 'api' or 'manual'
    },
    "usage": {
        "currentPeriodCost": float,
        "limit": float,
        "plan": str  # e.g., 'free', 'pro'
    }
}
```

##### set_api_key()

Update the API key.

```python
client.set_api_key("new-api-key")
```

##### set_base_url()

Update the base URL.

```python
client.set_base_url("https://my-custom-domain.com")
```

##### close()

Close the underlying HTTP session.

```python
client.close()
```

## Data Classes

### WorkflowExecutionResult

```python
@dataclass
class WorkflowExecutionResult:
    success: bool
    output: Optional[Any] = None
    error: Optional[str] = None
    logs: Optional[List[Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    trace_spans: Optional[List[Any]] = None
    total_duration: Optional[float] = None
```

### AsyncExecutionResult

```python
@dataclass
class AsyncExecutionResult:
    success: bool
    task_id: str
    status: str  # 'queued'
    created_at: str
    links: Dict[str, str]  # e.g., {"status": "/api/jobs/{taskId}"}
```

### WorkflowStatus

```python
@dataclass
class WorkflowStatus:
    is_deployed: bool
    deployed_at: Optional[str] = None
    needs_redeployment: bool = False
```

### RateLimitInfo

```python
@dataclass
class RateLimitInfo:
    limit: int
    remaining: int
    reset: int
    retry_after: Optional[int] = None
```

### UsageLimits

```python
@dataclass
class UsageLimits:
    success: bool
    rate_limit: Dict[str, Any]
    usage: Dict[str, Any]
```

### SimStudioError

```python
class SimStudioError(Exception):
    def __init__(self, message: str, code: Optional[str] = None, status: Optional[int] = None):
        super().__init__(message)
        self.code = code
        self.status = status
```

**Common error codes:**
- `UNAUTHORIZED`: Invalid API key
- `TIMEOUT`: Request timed out
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `USAGE_LIMIT_EXCEEDED`: Usage limit exceeded
- `EXECUTION_ERROR`: Workflow execution failed

## Examples

### Basic Workflow Execution

<Steps>
  <Step title="Initialize the client">
    Set up the SimStudioClient with your API key.
  </Step>
  <Step title="Validate the workflow">
    Check if the workflow is deployed and ready for execution.
  </Step>
  <Step title="Execute the workflow">
    Run the workflow with your input data.
  </Step>
  <Step title="Handle the result">
    Process the execution result and handle any errors.
  </Step>
</Steps>

```python
import os
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def run_workflow():
    try:
        # Check if workflow is ready
        is_ready = client.validate_workflow("my-workflow-id")
        if not is_ready:
            raise Exception("Workflow is not deployed or ready")

        # Execute the workflow
        result = client.execute_workflow(
            "my-workflow-id",
            input_data={
                "message": "Process this data",
                "user_id": "12345"
            }
        )

        if result.success:
            print("Output:", result.output)
            print("Duration:", result.metadata.get("duration") if result.metadata else None)
        else:
            print("Workflow failed:", result.error)
            
    except Exception as error:
        print("Error:", error)

run_workflow()
```

### Error Handling

Handle different types of errors that may occur during workflow execution:

```python
from simstudio import SimStudioClient, SimStudioError
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_with_error_handling():
    try:
        result = client.execute_workflow("workflow-id")
        return result
    except SimStudioError as error:
        if error.code == "UNAUTHORIZED":
            print("Invalid API key")
        elif error.code == "TIMEOUT":
            print("Workflow execution timed out")
        elif error.code == "USAGE_LIMIT_EXCEEDED":
            print("Usage limit exceeded")
        elif error.code == "INVALID_JSON":
            print("Invalid JSON in request body")
        else:
            print(f"Workflow error: {error}")
        raise
    except Exception as error:
        print(f"Unexpected error: {error}")
        raise
```

### Context Manager Usage

Use the client as a context manager to automatically handle resource cleanup:

```python
from simstudio import SimStudioClient
import os

# Using context manager to automatically close the session
with SimStudioClient(api_key=os.getenv("SIM_API_KEY")) as client:
    result = client.execute_workflow("workflow-id")
    print("Result:", result)
# Session is automatically closed here
```

### Batch Workflow Execution

Execute multiple workflows efficiently:

```python
from simstudio import SimStudioClient
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))   

def execute_workflows_batch(workflow_data_pairs):
    """Execute multiple workflows with different input data."""
    results = []
    
    for workflow_id, input_data in workflow_data_pairs:
        try:
            # Validate workflow before execution
            if not client.validate_workflow(workflow_id):
                print(f"Skipping {workflow_id}: not deployed")
                continue
                
            result = client.execute_workflow(workflow_id, input_data)
            results.append({
                "workflow_id": workflow_id,
                "success": result.success,
                "output": result.output,
                "error": result.error
            })
            
        except Exception as error:
            results.append({
                "workflow_id": workflow_id,
                "success": False,
                "error": str(error)
            })
    
    return results

# Example usage
workflows = [
    ("workflow-1", {"type": "analysis", "data": "sample1"}),
    ("workflow-2", {"type": "processing", "data": "sample2"}),
]

results = execute_workflows_batch(workflows)
for result in results:
    print(f"Workflow {result['workflow_id']}: {'Success' if result['success'] else 'Failed'}")
```

### Async Workflow Execution

Execute workflows asynchronously for long-running tasks:

```python
import os
import time
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_async():
    try:
        # Start async execution
        result = client.execute_workflow(
            "workflow-id",
            input_data={"data": "large dataset"},
            async_execution=True  # Execute asynchronously
        )

        # Check if result is an async execution
        if hasattr(result, 'task_id'):
            print(f"Task ID: {result.task_id}")
            print(f"Status endpoint: {result.links['status']}")

            # Poll for completion
            status = client.get_job_status(result.task_id)

            while status["status"] in ["queued", "processing"]:
                print(f"Current status: {status['status']}")
                time.sleep(2)  # Wait 2 seconds
                status = client.get_job_status(result.task_id)

            if status["status"] == "completed":
                print("Workflow completed!")
                print(f"Output: {status['output']}")
                print(f"Duration: {status['metadata']['duration']}")
            else:
                print(f"Workflow failed: {status['error']}")

    except Exception as error:
        print(f"Error: {error}")

execute_async()
```

### Rate Limiting and Retry

Handle rate limits automatically with exponential backoff:

```python
import os
from simstudio import SimStudioClient, SimStudioError

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_with_retry_handling():
    try:
        # Automatically retries on rate limit
        result = client.execute_with_retry(
            "workflow-id",
            input_data={"message": "Process this"},
            max_retries=5,
            initial_delay=1.0,
            max_delay=60.0,
            backoff_multiplier=2.0
        )

        print(f"Success: {result}")
    except SimStudioError as error:
        if error.code == "RATE_LIMIT_EXCEEDED":
            print("Rate limit exceeded after all retries")

            # Check rate limit info
            rate_limit_info = client.get_rate_limit_info()
            if rate_limit_info:
                from datetime import datetime
                reset_time = datetime.fromtimestamp(rate_limit_info.reset)
                print(f"Rate limit resets at: {reset_time}")

execute_with_retry_handling()
```

### Usage Monitoring

Monitor your account usage and limits:

```python
import os
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def check_usage():
    try:
        limits = client.get_usage_limits()

        print("=== Rate Limits ===")
        print("Sync requests:")
        print(f"  Limit: {limits.rate_limit['sync']['limit']}")
        print(f"  Remaining: {limits.rate_limit['sync']['remaining']}")
        print(f"  Resets at: {limits.rate_limit['sync']['resetAt']}")
        print(f"  Is limited: {limits.rate_limit['sync']['isLimited']}")

        print("\nAsync requests:")
        print(f"  Limit: {limits.rate_limit['async']['limit']}")
        print(f"  Remaining: {limits.rate_limit['async']['remaining']}")
        print(f"  Resets at: {limits.rate_limit['async']['resetAt']}")
        print(f"  Is limited: {limits.rate_limit['async']['isLimited']}")

        print("\n=== Usage ===")
        print(f"Current period cost: ${limits.usage['currentPeriodCost']:.2f}")
        print(f"Limit: ${limits.usage['limit']:.2f}")
        print(f"Plan: {limits.usage['plan']}")

        percent_used = (limits.usage['currentPeriodCost'] / limits.usage['limit']) * 100
        print(f"Usage: {percent_used:.1f}%")

        if percent_used > 80:
            print("⚠️  Warning: You are approaching your usage limit!")

    except Exception as error:
        print(f"Error checking usage: {error}")

check_usage()
```

### Streaming Workflow Execution

Execute workflows with real-time streaming responses:

```python
from simstudio import SimStudioClient
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_with_streaming():
    """Execute workflow with streaming enabled."""
    try:
        # Enable streaming for specific block outputs
        result = client.execute_workflow(
            "workflow-id",
            input_data={"message": "Count to five"},
            stream=True,
            selected_outputs=["agent1.content"]  # Use blockName.attribute format
        )

        print("Workflow result:", result)
    except Exception as error:
        print("Error:", error)

execute_with_streaming()
```

The streaming response follows the Server-Sent Events (SSE) format:

```
data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":"One"}

data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":", two"}

data: {"event":"done","success":true,"output":{},"metadata":{"duration":610}}

data: [DONE]
```

**Flask Streaming Example:**

```python
from flask import Flask, Response, stream_with_context
import requests
import json
import os

app = Flask(__name__)

@app.route('/stream-workflow')
def stream_workflow():
    """Stream workflow execution to the client."""

    def generate():
        response = requests.post(
            'https://sim.ai/api/workflows/WORKFLOW_ID/execute',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': os.getenv('SIM_API_KEY')
            },
            json={
                'message': 'Generate a story',
                'stream': True,
                'selectedOutputs': ['agent1.content']
            },
            stream=True
        )

        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                if decoded_line.startswith('data: '):
                    data = decoded_line[6:]  # Remove 'data: ' prefix

                    if data == '[DONE]':
                        break

                    try:
                        parsed = json.loads(data)
                        if 'chunk' in parsed:
                            yield f"data: {json.dumps(parsed)}\n\n"
                        elif parsed.get('event') == 'done':
                            yield f"data: {json.dumps(parsed)}\n\n"
                            print("Execution complete:", parsed.get('metadata'))
                    except json.JSONDecodeError:
                        pass

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream'
    )

if __name__ == '__main__':
    app.run(debug=True)
```

### Environment Configuration

Configure the client using environment variables:

<Tabs items={['Development', 'Production']}>
  <Tab value="Development">
    ```python
    import os
    from simstudio import SimStudioClient

    # Development configuration
    client = SimStudioClient(
        api_key=os.getenv("SIM_API_KEY")
        base_url=os.getenv("SIM_BASE_URL", "https://sim.ai")
    )
    ```
  </Tab>
  <Tab value="Production">
    ```python
    import os
    from simstudio import SimStudioClient

    # Production configuration with error handling
    api_key = os.getenv("SIM_API_KEY")
    if not api_key:
        raise ValueError("SIM_API_KEY environment variable is required")

    client = SimStudioClient(
        api_key=api_key,
        base_url=os.getenv("SIM_BASE_URL", "https://sim.ai")
    )
    ```
  </Tab>
</Tabs>

## Getting Your API Key

<Steps>
  <Step title="Log in to Sim">
    Navigate to [Sim](https://sim.ai) and log in to your account.
  </Step>
  <Step title="Open your workflow">
    Navigate to the workflow you want to execute programmatically.
  </Step>
  <Step title="Deploy your workflow">
    Click on "Deploy" to deploy your workflow if it hasn't been deployed yet.
  </Step>
  <Step title="Create or select an API key">
    During the deployment process, select or create an API key.
  </Step>
  <Step title="Copy the API key">
    Copy the API key to use in your Python application.
  </Step>
</Steps>

## Requirements

- Python 3.8+
- requests >= 2.25.0

## License

Apache-2.0
```

--------------------------------------------------------------------------------

````
