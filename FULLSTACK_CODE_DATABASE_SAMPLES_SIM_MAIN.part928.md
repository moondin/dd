---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:37Z
part: 928
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 928 of 933)

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

---[FILE: test_client.py]---
Location: sim-main/packages/python-sdk/tests/test_client.py

```python
"""
Tests for the Sim Python SDK
"""

import pytest
from unittest.mock import Mock, patch
from simstudio import SimStudioClient, SimStudioError, WorkflowExecutionResult, WorkflowStatus


def test_simstudio_client_initialization():
    """Test SimStudioClient initialization."""
    client = SimStudioClient(api_key="test-api-key", base_url="https://test.sim.ai")
    assert client.api_key == "test-api-key"
    assert client.base_url == "https://test.sim.ai"


def test_simstudio_client_default_base_url():
    """Test SimStudioClient with default base URL."""
    client = SimStudioClient(api_key="test-api-key")
    assert client.api_key == "test-api-key"
    assert client.base_url == "https://sim.ai"


def test_set_api_key():
    """Test setting a new API key."""
    client = SimStudioClient(api_key="test-api-key")
    client.set_api_key("new-api-key")
    assert client.api_key == "new-api-key"


def test_set_base_url():
    """Test setting a new base URL."""
    client = SimStudioClient(api_key="test-api-key")
    client.set_base_url("https://new.sim.ai/")
    assert client.base_url == "https://new.sim.ai"


def test_set_base_url_strips_trailing_slash():
    """Test that base URL strips trailing slash."""
    client = SimStudioClient(api_key="test-api-key")
    client.set_base_url("https://test.sim.ai/")
    assert client.base_url == "https://test.sim.ai"


@patch('simstudio.requests.Session.get')
def test_validate_workflow_returns_false_on_error(mock_get):
    """Test that validate_workflow returns False when request fails."""
    mock_get.side_effect = SimStudioError("Network error")
    
    client = SimStudioClient(api_key="test-api-key")
    result = client.validate_workflow("test-workflow-id")
    
    assert result is False
    mock_get.assert_called_once_with("https://sim.ai/api/workflows/test-workflow-id/status")


def test_simstudio_error():
    """Test SimStudioError creation."""
    error = SimStudioError("Test error", "TEST_CODE", 400)
    assert str(error) == "Test error"
    assert error.code == "TEST_CODE"
    assert error.status == 400


def test_workflow_execution_result():
    """Test WorkflowExecutionResult data class."""
    result = WorkflowExecutionResult(
        success=True,
        output={"data": "test"},
        metadata={"duration": 1000}
    )
    assert result.success is True
    assert result.output == {"data": "test"}
    assert result.metadata == {"duration": 1000}


def test_workflow_status():
    """Test WorkflowStatus data class."""
    status = WorkflowStatus(
        is_deployed=True,
        deployed_at="2023-01-01T00:00:00Z",
        needs_redeployment=False
    )
    assert status.is_deployed is True
    assert status.deployed_at == "2023-01-01T00:00:00Z"
    assert status.needs_redeployment is False


@patch('simstudio.requests.Session.close')
def test_context_manager(mock_close):
    """Test SimStudioClient as context manager."""
    with SimStudioClient(api_key="test-api-key") as client:
        assert client.api_key == "test-api-key"
    # Should close without error
    mock_close.assert_called_once()


# Tests for async execution
@patch('simstudio.requests.Session.post')
def test_async_execution_returns_task_id(mock_post):
    """Test async execution returns AsyncExecutionResult."""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.status_code = 202
    mock_response.json.return_value = {
        "success": True,
        "taskId": "task-123",
        "status": "queued",
        "createdAt": "2024-01-01T00:00:00Z",
        "links": {"status": "/api/jobs/task-123"}
    }
    mock_response.headers.get.return_value = None
    mock_post.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")
    result = client.execute_workflow(
        "workflow-id",
        input_data={"message": "Hello"},
        async_execution=True
    )

    assert result.success is True
    assert result.task_id == "task-123"
    assert result.status == "queued"
    assert result.links["status"] == "/api/jobs/task-123"

    # Verify X-Execution-Mode header was set
    call_args = mock_post.call_args
    assert call_args[1]["headers"]["X-Execution-Mode"] == "async"


@patch('simstudio.requests.Session.post')
def test_sync_execution_returns_result(mock_post):
    """Test sync execution returns WorkflowExecutionResult."""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "success": True,
        "output": {"result": "completed"},
        "logs": []
    }
    mock_response.headers.get.return_value = None
    mock_post.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")
    result = client.execute_workflow(
        "workflow-id",
        input_data={"message": "Hello"},
        async_execution=False
    )

    assert result.success is True
    assert result.output == {"result": "completed"}
    assert not hasattr(result, 'task_id')


@patch('simstudio.requests.Session.post')
def test_async_header_not_set_when_false(mock_post):
    """Test X-Execution-Mode header is not set when async_execution is None."""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.status_code = 200
    mock_response.json.return_value = {"success": True, "output": {}}
    mock_response.headers.get.return_value = None
    mock_post.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")
    client.execute_workflow("workflow-id", input_data={"message": "Hello"})

    call_args = mock_post.call_args
    assert "X-Execution-Mode" not in call_args[1]["headers"]


# Tests for job status
@patch('simstudio.requests.Session.get')
def test_get_job_status_success(mock_get):
    """Test getting job status."""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.json.return_value = {
        "success": True,
        "taskId": "task-123",
        "status": "completed",
        "metadata": {
            "startedAt": "2024-01-01T00:00:00Z",
            "completedAt": "2024-01-01T00:01:00Z",
            "duration": 60000
        },
        "output": {"result": "done"}
    }
    mock_response.headers.get.return_value = None
    mock_get.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key", base_url="https://test.sim.ai")
    result = client.get_job_status("task-123")

    assert result["taskId"] == "task-123"
    assert result["status"] == "completed"
    assert result["output"]["result"] == "done"
    mock_get.assert_called_once_with("https://test.sim.ai/api/jobs/task-123")


@patch('simstudio.requests.Session.get')
def test_get_job_status_not_found(mock_get):
    """Test job not found error."""
    mock_response = Mock()
    mock_response.ok = False
    mock_response.status_code = 404
    mock_response.reason = "Not Found"
    mock_response.json.return_value = {
        "error": "Job not found",
        "code": "JOB_NOT_FOUND"
    }
    mock_response.headers.get.return_value = None
    mock_get.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")

    with pytest.raises(SimStudioError) as exc_info:
        client.get_job_status("invalid-task")
    assert "Job not found" in str(exc_info.value)


# Tests for retry with rate limiting
@patch('simstudio.requests.Session.post')
@patch('simstudio.time.sleep')
def test_execute_with_retry_success_first_attempt(mock_sleep, mock_post):
    """Test retry succeeds on first attempt."""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "success": True,
        "output": {"result": "success"}
    }
    mock_response.headers.get.return_value = None
    mock_post.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")
    result = client.execute_with_retry("workflow-id", input_data={"message": "test"})

    assert result.success is True
    assert mock_post.call_count == 1
    assert mock_sleep.call_count == 0


@patch('simstudio.requests.Session.post')
@patch('simstudio.time.sleep')
def test_execute_with_retry_retries_on_rate_limit(mock_sleep, mock_post):
    """Test retry retries on rate limit error."""
    rate_limit_response = Mock()
    rate_limit_response.ok = False
    rate_limit_response.status_code = 429
    rate_limit_response.json.return_value = {
        "error": "Rate limit exceeded",
        "code": "RATE_LIMIT_EXCEEDED"
    }
    import time
    rate_limit_response.headers.get.side_effect = lambda h: {
        'retry-after': '1',
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': str(int(time.time()) + 60)
    }.get(h)

    success_response = Mock()
    success_response.ok = True
    success_response.status_code = 200
    success_response.json.return_value = {
        "success": True,
        "output": {"result": "success"}
    }
    success_response.headers.get.return_value = None

    mock_post.side_effect = [rate_limit_response, success_response]

    client = SimStudioClient(api_key="test-api-key")
    result = client.execute_with_retry(
        "workflow-id",
        input_data={"message": "test"},
        max_retries=3,
        initial_delay=0.01
    )

    assert result.success is True
    assert mock_post.call_count == 2
    assert mock_sleep.call_count == 1


@patch('simstudio.requests.Session.post')
@patch('simstudio.time.sleep')
def test_execute_with_retry_max_retries_exceeded(mock_sleep, mock_post):
    """Test retry throws after max retries."""
    mock_response = Mock()
    mock_response.ok = False
    mock_response.status_code = 429
    mock_response.json.return_value = {
        "error": "Rate limit exceeded",
        "code": "RATE_LIMIT_EXCEEDED"
    }
    mock_response.headers.get.side_effect = lambda h: '1' if h == 'retry-after' else None
    mock_post.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")

    with pytest.raises(SimStudioError) as exc_info:
        client.execute_with_retry(
            "workflow-id",
            input_data={"message": "test"},
            max_retries=2,
            initial_delay=0.01
        )

    assert "Rate limit exceeded" in str(exc_info.value)
    assert mock_post.call_count == 3  # Initial + 2 retries


@patch('simstudio.requests.Session.post')
def test_execute_with_retry_no_retry_on_other_errors(mock_post):
    """Test retry does not retry on non-rate-limit errors."""
    mock_response = Mock()
    mock_response.ok = False
    mock_response.status_code = 500
    mock_response.reason = "Internal Server Error"
    mock_response.json.return_value = {
        "error": "Server error",
        "code": "INTERNAL_ERROR"
    }
    mock_response.headers.get.return_value = None
    mock_post.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")

    with pytest.raises(SimStudioError) as exc_info:
        client.execute_with_retry("workflow-id", input_data={"message": "test"})

    assert "Server error" in str(exc_info.value)
    assert mock_post.call_count == 1  # No retries


# Tests for rate limit info
def test_get_rate_limit_info_returns_none_initially():
    """Test rate limit info is None before any API calls."""
    client = SimStudioClient(api_key="test-api-key")
    info = client.get_rate_limit_info()
    assert info is None


@patch('simstudio.requests.Session.post')
def test_get_rate_limit_info_after_api_call(mock_post):
    """Test rate limit info is populated after API call."""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.status_code = 200
    mock_response.json.return_value = {"success": True, "output": {}}
    mock_response.headers.get.side_effect = lambda h: {
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '95',
        'x-ratelimit-reset': '1704067200'
    }.get(h)
    mock_post.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")
    client.execute_workflow("workflow-id", input_data={})

    info = client.get_rate_limit_info()
    assert info is not None
    assert info.limit == 100
    assert info.remaining == 95
    assert info.reset == 1704067200


# Tests for usage limits
@patch('simstudio.requests.Session.get')
def test_get_usage_limits_success(mock_get):
    """Test getting usage limits."""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.json.return_value = {
        "success": True,
        "rateLimit": {
            "sync": {
                "isLimited": False,
                "limit": 100,
                "remaining": 95,
                "resetAt": "2024-01-01T01:00:00Z"
            },
            "async": {
                "isLimited": False,
                "limit": 50,
                "remaining": 48,
                "resetAt": "2024-01-01T01:00:00Z"
            },
            "authType": "api"
        },
        "usage": {
            "currentPeriodCost": 1.23,
            "limit": 100.0,
            "plan": "pro"
        }
    }
    mock_response.headers.get.return_value = None
    mock_get.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key", base_url="https://test.sim.ai")
    result = client.get_usage_limits()

    assert result.success is True
    assert result.rate_limit["sync"]["limit"] == 100
    assert result.rate_limit["async"]["limit"] == 50
    assert result.usage["currentPeriodCost"] == 1.23
    assert result.usage["plan"] == "pro"
    mock_get.assert_called_once_with("https://test.sim.ai/api/users/me/usage-limits")


@patch('simstudio.requests.Session.get')
def test_get_usage_limits_unauthorized(mock_get):
    """Test usage limits with invalid API key."""
    mock_response = Mock()
    mock_response.ok = False
    mock_response.status_code = 401
    mock_response.reason = "Unauthorized"
    mock_response.json.return_value = {
        "error": "Invalid API key",
        "code": "UNAUTHORIZED"
    }
    mock_response.headers.get.return_value = None
    mock_get.return_value = mock_response

    client = SimStudioClient(api_key="invalid-key")

    with pytest.raises(SimStudioError) as exc_info:
        client.get_usage_limits()
    assert "Invalid API key" in str(exc_info.value)


# Tests for streaming with selectedOutputs
@patch('simstudio.requests.Session.post')
def test_execute_workflow_with_stream_and_selected_outputs(mock_post):
    """Test execution with stream and selectedOutputs parameters."""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.status_code = 200
    mock_response.json.return_value = {"success": True, "output": {}}
    mock_response.headers.get.return_value = None
    mock_post.return_value = mock_response

    client = SimStudioClient(api_key="test-api-key")
    client.execute_workflow(
        "workflow-id",
        input_data={"message": "test"},
        stream=True,
        selected_outputs=["agent1.content", "agent2.content"]
    )

    call_args = mock_post.call_args
    request_body = call_args[1]["json"]

    assert request_body["message"] == "test"
    assert request_body["stream"] is True
    assert request_body["selectedOutputs"] == ["agent1.content", "agent2.content"]
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: sim-main/packages/ts-sdk/.gitignore

```text
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build output
dist/
build/

# Coverage reports
coverage/
*.lcov

# Cache directories
.turbo/
.cache/
.parcel-cache/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo

# Logs
logs
*.log
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: sim-main/packages/ts-sdk/package.json

```json
{
  "name": "simstudio-ts-sdk",
  "version": "0.1.1",
  "description": "Sim SDK - Execute workflows programmatically",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "bun run build:tsc",
    "build:tsc": "tsc",
    "dev:watch": "tsc --watch",
    "prepublishOnly": "bun run build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "files": [
    "dist"
  ],
  "keywords": [
    "simstudio",
    "ai",
    "workflow",
    "sdk",
    "api",
    "automation",
    "typescript"
  ],
  "author": "Sim",
  "license": "Apache-2.0",
  "dependencies": {
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "@types/node": "^20.5.1",
    "typescript": "^5.1.6",
    "vitest": "^3.0.8",
    "@vitest/coverage-v8": "^3.0.8"
  },
  "engines": {
    "node": ">=16"
  },
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/simstudioai/sim.git",
    "directory": "packages/ts-sdk"
  },
  "homepage": "https://sim.ai",
  "bugs": {
    "url": "https://github.com/simstudioai/sim/issues"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: sim-main/packages/ts-sdk/README.md

```text
# Sim TypeScript SDK

The official TypeScript/JavaScript SDK for [Sim](https://sim.ai), allowing you to execute workflows programmatically from your applications.

## Installation

```bash
npm install simstudio-ts-sdk
# or 
yarn add simstudio-ts-sdk
# or
bun add simstudio-ts-sdk
```

## Quick Start

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

// Initialize the client
const client = new SimStudioClient({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://sim.ai' // optional, defaults to https://sim.ai
});

// Execute a workflow
try {
  const result = await client.executeWorkflow('workflow-id');
  console.log('Workflow executed successfully:', result);
} catch (error) {
  console.error('Workflow execution failed:', error);
}
```

## API Reference

### SimStudioClient

#### Constructor

```typescript
new SimStudioClient(config: SimStudioConfig)
```

- `config.apiKey` (string): Your Sim API key
- `config.baseUrl` (string, optional): Base URL for the Sim API (defaults to `https://sim.ai`)

#### Methods

##### executeWorkflow(workflowId, options?)

Execute a workflow with optional input data.

```typescript
const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello, world!' },
  timeout: 30000 // 30 seconds
});
```

**Parameters:**
- `workflowId` (string): The ID of the workflow to execute
- `options` (ExecutionOptions, optional):
  - `input` (any): Input data to pass to the workflow. File objects are automatically converted to base64.
  - `timeout` (number): Timeout in milliseconds (default: 30000)

**Returns:** `Promise<WorkflowExecutionResult>`

##### getWorkflowStatus(workflowId)

Get the status of a workflow (deployment status, etc.).

```typescript
const status = await client.getWorkflowStatus('workflow-id');
console.log('Is deployed:', status.isDeployed);
```

**Parameters:**
- `workflowId` (string): The ID of the workflow

**Returns:** `Promise<WorkflowStatus>`

##### validateWorkflow(workflowId)

Validate that a workflow is ready for execution.

```typescript
const isReady = await client.validateWorkflow('workflow-id');
if (isReady) {
  // Workflow is deployed and ready
}
```

**Parameters:**
- `workflowId` (string): The ID of the workflow

**Returns:** `Promise<boolean>`

##### executeWorkflowSync(workflowId, options?)

Execute a workflow and poll for completion (useful for long-running workflows).

```typescript
const result = await client.executeWorkflowSync('workflow-id', {
  input: { data: 'some input' },
  timeout: 60000
});
```

**Parameters:**
- `workflowId` (string): The ID of the workflow to execute
- `options` (ExecutionOptions, optional):
  - `input` (any): Input data to pass to the workflow
  - `timeout` (number): Timeout for the initial request in milliseconds

**Returns:** `Promise<WorkflowExecutionResult>`

##### setApiKey(apiKey)

Update the API key.

```typescript
client.setApiKey('new-api-key');
```

##### setBaseUrl(baseUrl)

Update the base URL.

```typescript
client.setBaseUrl('https://my-custom-domain.com');
```

## Types

### WorkflowExecutionResult

```typescript
interface WorkflowExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  logs?: any[];
  metadata?: {
    duration?: number;
    executionId?: string;
    [key: string]: any;
  };
  traceSpans?: any[];
  totalDuration?: number;
}
```

### WorkflowStatus

```typescript
interface WorkflowStatus {
  isDeployed: boolean;
  deployedAt?: string;
  needsRedeployment: boolean;
}
```

### SimStudioError

```typescript
class SimStudioError extends Error {
  code?: string;
  status?: number;
}
```

## Examples

### Basic Workflow Execution

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function runWorkflow() {
  try {
    // Check if workflow is ready
    const isReady = await client.validateWorkflow('my-workflow-id');
    if (!isReady) {
      throw new Error('Workflow is not deployed or ready');
    }

    // Execute the workflow
    const result = await client.executeWorkflow('my-workflow-id', {
      input: {
        message: 'Process this data',
        userId: '12345'
      }
    });

    if (result.success) {
      console.log('Output:', result.output);
      console.log('Duration:', result.metadata?.duration);
    } else {
      console.error('Workflow failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

runWorkflow();
```

### Error Handling

```typescript
import { SimStudioClient, SimStudioError } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeWithErrorHandling() {
  try {
    const result = await client.executeWorkflow('workflow-id');
    return result;
  } catch (error) {
    if (error instanceof SimStudioError) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          console.error('Invalid API key');
          break;
        case 'TIMEOUT':
          console.error('Workflow execution timed out');
          break;
        case 'USAGE_LIMIT_EXCEEDED':
          console.error('Usage limit exceeded');
          break;
        case 'INVALID_JSON':
          console.error('Invalid JSON in request body');
          break;
        default:
          console.error('Workflow error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

### Environment Configuration

```typescript
// Using environment variables
const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!,
  baseUrl: process.env.SIM_BASE_URL // optional
});
```

### File Upload

File objects are automatically detected and converted to base64 format. Include them in your input under the field name matching your workflow's API trigger input format:

The SDK converts File objects to this format:
```typescript
{
  type: 'file',
  data: 'data:mime/type;base64,base64data',
  name: 'filename',
  mime: 'mime/type'
}
```

Alternatively, you can manually provide files using the URL format:
```typescript
{
  type: 'url',
  data: 'https://example.com/file.pdf',
  name: 'file.pdf',
  mime: 'application/pdf'
}
```

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';
import fs from 'fs';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

// Node.js: Read file and create File object
const fileBuffer = fs.readFileSync('./document.pdf');
const file = new File([fileBuffer], 'document.pdf', { type: 'application/pdf' });

// Include files under the field name from your API trigger's input format
const result = await client.executeWorkflow('workflow-id', {
  input: {
    documents: [file],  // Field name must match your API trigger's file input field
    instructions: 'Process this document'
  }
});

// Browser: From file input
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);

  const result = await client.executeWorkflow('workflow-id', {
    input: {
      attachments: files,  // Field name must match your API trigger's file input field
      query: 'Analyze these files'
    }
  });
};
```

## Getting Your API Key

1. Log in to your [Sim](https://sim.ai) account
2. Navigate to your workflow
3. Click on "Deploy" to deploy your workflow
4. Select or create an API key during the deployment process
5. Copy the API key to use in your application

## Development

### Running Tests

To run the tests locally:

1. Clone the repository and navigate to the TypeScript SDK directory:
   ```bash
   cd packages/ts-sdk
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Run the tests:
   ```bash
   bun run test
   ```

### Building

Build the TypeScript SDK:

```bash
bun run build
```

This will compile TypeScript files to JavaScript and generate type declarations in the `dist/` directory.

### Development Mode

For development with auto-rebuild:

```bash
bun run dev
```

## Requirements

- Node.js 18+
- TypeScript 5.0+ (for TypeScript projects)

## License

Apache-2.0
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: sim-main/packages/ts-sdk/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: vitest.config.ts]---
Location: sim-main/packages/ts-sdk/vitest.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    conditions: ['node', 'default'],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: basic-usage.ts]---
Location: sim-main/packages/ts-sdk/examples/basic-usage.ts

```typescript
import { SimStudioClient, SimStudioError } from '../src/index'

// Example 1: Basic workflow execution
async function basicExample() {
  const client = new SimStudioClient({
    apiKey: process.env.SIM_API_KEY!,
    baseUrl: 'https://sim.ai',
  })

  try {
    // Execute a workflow without input
    const result = await client.executeWorkflow('your-workflow-id')

    if (result.success) {
      console.log('✅ Workflow executed successfully!')
      console.log('Output:', result.output)
      console.log('Duration:', result.metadata?.duration, 'ms')
    } else {
      console.log('❌ Workflow failed:', result.error)
    }
  } catch (error) {
    if (error instanceof SimStudioError) {
      console.error('SDK Error:', error.message, 'Code:', error.code)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

// Example 2: Workflow execution with input data
async function withInputExample() {
  const client = new SimStudioClient({
    apiKey: process.env.SIM_API_KEY!,
  })

  try {
    const result = await client.executeWorkflow('your-workflow-id', {
      input: {
        message: 'Hello from SDK!',
        userId: '12345',
        data: {
          type: 'analysis',
          parameters: {
            includeMetadata: true,
            format: 'json',
          },
        },
      },
      timeout: 60000, // 60 seconds
    })

    if (result.success) {
      console.log('✅ Workflow executed successfully!')
      console.log('Output:', result.output)
      if (result.metadata?.duration) {
        console.log('Duration:', result.metadata.duration, 'ms')
      }
    } else {
      console.log('❌ Workflow failed:', result.error)
    }
  } catch (error) {
    if (error instanceof SimStudioError) {
      console.error('SDK Error:', error.message, 'Code:', error.code)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

// Example 3: Workflow validation and status checking
async function statusExample() {
  const client = new SimStudioClient({
    apiKey: process.env.SIM_API_KEY!,
  })

  try {
    // Check if workflow is ready
    const isReady = await client.validateWorkflow('your-workflow-id')
    console.log('Workflow ready:', isReady)

    // Get detailed status
    const status = await client.getWorkflowStatus('your-workflow-id')
    console.log('Status:', {
      deployed: status.isDeployed,
      needsRedeployment: status.needsRedeployment,
      deployedAt: status.deployedAt,
    })

    if (status.isDeployed) {
      // Execute the workflow
      const result = await client.executeWorkflow('your-workflow-id')

      if (result.success) {
        console.log('✅ Workflow executed successfully!')
        console.log('Output:', result.output)
      } else {
        console.log('❌ Workflow failed:', result.error)
      }
    }
  } catch (error) {
    if (error instanceof SimStudioError) {
      console.error('SDK Error:', error.message, 'Code:', error.code)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

// Example 4: Workflow execution with streaming
async function streamingExample() {
  const client = new SimStudioClient({
    apiKey: process.env.SIM_API_KEY!,
  })

  try {
    const result = await client.executeWorkflow('your-workflow-id', {
      input: {
        message: 'Count to five',
      },
      stream: true,
      selectedOutputs: ['agent1.content'], // Use blockName.attribute format
      timeout: 60000,
    })

    if (result.success) {
      console.log('✅ Workflow executed successfully!')
      console.log('Output:', result.output)
      console.log('Duration:', result.metadata?.duration, 'ms')
    } else {
      console.log('❌ Workflow failed:', result.error)
    }
  } catch (error) {
    if (error instanceof SimStudioError) {
      console.error('SDK Error:', error.message, 'Code:', error.code)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

// Run examples
if (require.main === module) {
  async function runExamples() {
    console.log('🚀 Running Sim SDK Examples\n')

    try {
      await basicExample()
      console.log('\n✅ Basic example completed')

      await withInputExample()
      console.log('\n✅ Input example completed')

      await statusExample()
      console.log('\n✅ Status example completed')

      await streamingExample()
      console.log('\n✅ Streaming example completed')
    } catch (error) {
      console.error('Error running examples:', error)
    }
  }

  runExamples()
}
```

--------------------------------------------------------------------------------

````
