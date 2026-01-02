---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 119
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 119 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/governance/ai-gateway/index.mdx

```text
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import TabsWrapper from "@site/src/components/TabsWrapper";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import { Shield, Globe, Zap, Settings, Code, Users, Wrench, Play, Database, BarChart3 } from "lucide-react";

# MLflow AI Gateway

:::warning
MLflow AI Gateway does not support Windows.
:::

MLflow AI Gateway provides a unified interface for deploying and managing multiple LLM providers within your organization. It simplifies interactions with services like OpenAI, Anthropic, and others through a single, secure endpoint.

The gateway server excels in production environments where organizations need to manage multiple LLM providers securely while maintaining operational flexibility and developer productivity.

<FeatureHighlights features={[
  {
    icon: Globe,
    title: "Unified Interface",
    description: "Access multiple LLM providers through a single endpoint, eliminating the need to integrate with each provider individually."
  },
  {
    icon: Shield,
    title: "Centralized Security",
    description: "Store API keys in one secure location with request/response logging for audit trails and compliance."
  },
  {
    icon: Database,
    title: "Provider Abstraction",
    description: "Switch between OpenAI, Anthropic, Azure OpenAI, and other providers without changing your application code."
  },
  {
    icon: Zap,
    title: "Zero-Downtime Updates",
    description: "Add, remove, or modify endpoints dynamically without restarting the server or disrupting running applications."
  },
  {
    icon: BarChart3,
    title: "Cost Optimization",
    description: "Monitor usage across providers and optimize costs by routing requests to the most efficient models."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Shared endpoint configurations and standardized access patterns across development teams."
  }
]} />

## Getting Started

Choose your path to get up and running with MLflow AI Gateway:

<TilesGrid>
  <TileCard
    icon={Wrench}
    title="Setup"
    description="Install MLflow, configure environment, and start your gateway server"
    href="./setup"
    linkText="Start setup →"
  />
  <TileCard
    icon={Settings}
    title="Configuration"
    description="Configure providers, endpoints, and advanced gateway settings"
    href="./configuration"
    linkText="Configure providers →"
  />
  <TileCard
    icon={Play}
    title="Usage"
    description="Query endpoints with Python client and REST APIs"
    href="./usage"
    linkText="Start using →"
  />
  <TileCard
    icon={Code}
    title="Integration"
    description="Integrate with applications, frameworks, and production systems"
    href="./integration"
    linkText="Learn integrations →"
  />
</TilesGrid>

## Quick Start

Get your AI Gateway running with OpenAI in under 5 minutes:

<TabsWrapper>
<Tabs>
<TabItem value="install" label="1. Install" default>

Install MLflow with gateway dependencies:

```bash
pip install 'mlflow[gateway]'
```

</TabItem>
<TabItem value="configure" label="2. Configure">

Set your OpenAI API key:

```bash
export OPENAI_API_KEY=your_api_key_here
```

Create a simple configuration file `config.yaml`:

```yaml
endpoints:
  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-3.5-turbo
      config:
        openai_api_key: $OPENAI_API_KEY
```

</TabItem>
<TabItem value="start" label="3. Start Server">

Start the gateway server:

```bash
mlflow gateway start --config-path config.yaml --port 5000
```

Your gateway is now running at `http://localhost:5000`

</TabItem>
<TabItem value="test" label="4. Test">

Test your endpoint:

```bash
curl -X POST http://localhost:5000/gateway/chat/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

</TabItem>
</Tabs>
</TabsWrapper>

## Supported Providers

MLflow AI Gateway supports a comprehensive range of LLM providers:

| Provider              | Chat | Chat function calling | Completions | Embeddings | Notes                                    |
| --------------------- | ---- | --------------------- | ----------- | ---------- | ---------------------------------------- |
| OpenAI                | ✅   | ✅                    | ✅          | ✅         | GPT-4, GPT-5, text-embedding models      |
| Azure OpenAI          | ✅   | ✅                    | ✅          | ✅         | Enterprise OpenAI with Azure integration |
| Anthropic             | ✅   | ✅                    | ✅          | ❌         | Claude models via Anthropic API          |
| Gemini                | ✅   | ✅                    | ✅          | ✅         | Gemini models via Gemini API             |
| AWS Bedrock Claude    | ✅   | ✅                    | ✅          | ✅         | Claude models provided by AWS Bedrock    |
| AWS Bedrock Titan     | ❌   | ❌                    | ✅          | ❌         | Titan models provided by AWS Bedrock     |
| AWS Bedrock AI21      | ❌   | ❌                    | ✅          | ❌         | AI21 models provided by AWS Bedrock      |
| MLflow Models         | ✅   | ❌                    | ✅          | ✅         | Your own deployed MLflow models          |
| Cohere (deprecated)   | ✅   | ❌                    | ✅          | ✅         | Command and embedding models             |
| PaLM (deprecated)     | ✅   | ❌                    | ✅          | ✅         | Google's PaLM models                     |
| MosaicML (deprecated) | ✅   | ❌                    | ✅          | ❌         | MPT models and custom deployments        |

## Core Concepts

Understanding these key concepts will help you effectively use the AI Gateway:

### Endpoints

Endpoints are named configurations that define how to access a specific model from a provider. Each endpoint specifies the model, provider settings, and access parameters.

### Providers

Providers are the underlying LLM services (OpenAI, Anthropic, etc.) that actually serve the models. The gateway abstracts away provider-specific details.

### Routes

Routes define the URL structure for accessing endpoints. The gateway automatically creates routes based on your endpoint configurations.

### Dynamic Updates

The gateway supports hot-reloading of configurations, allowing you to add, modify, or remove endpoints without restarting the server.

## Next Steps

Ready to dive deeper? Explore these resources:

<TilesGrid>
  <TileCard
    icon={Wrench}
    title="Setup Guide"
    description="Get started with installation, environment setup, and server configuration"
    href="./setup"
    linkText="Start setup →"
  />
  <TileCard
    icon={Play}
    title="Usage Guide"
    description="Learn basic querying patterns with Python client and REST APIs"
    href="./usage"
    linkText="Learn usage →"
  />
  <TileCard
    icon={Code}
    title="Integration Guide"
    description="Integrate with applications, frameworks, and production systems"
    href="./integration"
    linkText="View integrations →"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: integration.mdx]---
Location: mlflow-master/docs/docs/genai/governance/ai-gateway/integration.mdx

```text
# AI Gateway Integration

import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Settings, Book, Play } from "lucide-react";

Learn how to integrate the MLflow AI Gateway with applications, frameworks, and production systems.

## Application Integrations

### FastAPI Integration

Build REST APIs that proxy requests to the AI Gateway, adding your own business logic, authentication, and data processing:

```python
from fastapi import FastAPI, HTTPException
from mlflow.deployments import get_deploy_client

app = FastAPI()
client = get_deploy_client("http://localhost:5000")


@app.post("/chat")
async def chat_endpoint(message: str):
    try:
        response = client.predict(
            endpoint="chat", inputs={"messages": [{"role": "user", "content": message}]}
        )
        return {"response": response["choices"][0]["message"]["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/embed")
async def embed_endpoint(text: str):
    try:
        response = client.predict(endpoint="embeddings", inputs={"input": text})
        return {"embedding": response["data"][0]["embedding"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Flask Integration

Create Flask applications that integrate AI capabilities using familiar request/response patterns:

```python
from flask import Flask, request, jsonify
from mlflow.deployments import get_deploy_client

app = Flask(__name__)
client = get_deploy_client("http://localhost:5000")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        response = client.predict(
            endpoint="chat",
            inputs={"messages": [{"role": "user", "content": data["message"]}]},
        )
        return jsonify({"response": response["choices"][0]["message"]["content"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
```

### Async/Await Support

Handle multiple concurrent requests efficiently using asyncio for high-throughput applications:

```python
import asyncio
import aiohttp
import json


async def async_query_gateway(endpoint, data):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"http://localhost:5000/gateway/{endpoint}/invocations",
            headers={"Content-Type": "application/json"},
            data=json.dumps(data),
        ) as response:
            return await response.json()


async def main():
    # Concurrent requests
    tasks = [
        async_query_gateway(
            "chat", {"messages": [{"role": "user", "content": f"Question {i}"}]}
        )
        for i in range(5)
    ]

    responses = await asyncio.gather(*tasks)
    for i, response in enumerate(responses):
        print(f"Response {i}: {response['choices'][0]['message']['content']}")


# Run async example
asyncio.run(main())
```

## LangChain Integration

### Setup

LangChain provides pre-built components that work directly with the AI Gateway, enabling easy integration with LangChain's ecosystem of tools and chains:

```python
from langchain_community.llms import MLflowAIGateway
from langchain_community.embeddings import MlflowAIGatewayEmbeddings
from langchain_community.chat_models import ChatMLflowAIGateway

# Configure LangChain to use your gateway
gateway_uri = "http://localhost:5000"
```

### Chat Models

Create LangChain chat models that route through your gateway, allowing you to switch providers without changing your application code:

```python
# Chat model
chat = ChatMLflowAIGateway(
    gateway_uri=gateway_uri,
    route="chat",
    params={
        "temperature": 0.7,
        "top_p": 0.95,
    },
)

# Generate response
from langchain_core.messages import HumanMessage, SystemMessage

messages = [
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content="What is LangChain?"),
]

response = chat(messages)
print(response.content)
```

### Embeddings

Use gateway-powered embeddings for vector search, semantic similarity, and RAG applications:

```python
# Embeddings
embeddings = MlflowAIGatewayEmbeddings(gateway_uri=gateway_uri, route="embeddings")

# Generate embeddings
text_embeddings = embeddings.embed_documents(
    ["This is a document", "This is another document"]
)

query_embedding = embeddings.embed_query("This is a query")
```

### Complete RAG Example

Build a complete Retrieval-Augmented Generation (RAG) system using the gateway for both embeddings and chat completion:

```python
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import RetrievalQA

# Load documents
loader = TextLoader("path/to/document.txt")
documents = loader.load()

# Split documents
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

# Create vector store
vectorstore = FAISS.from_documents(docs, embeddings)

# Create QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=chat, chain_type="stuff", retriever=vectorstore.as_retriever()
)

# Query the system
question = "What is the main topic of the document?"
result = qa_chain.run(question)
print(result)
```

## OpenAI Compatibility

The AI Gateway provides OpenAI-compatible endpoints, allowing you to migrate existing OpenAI applications with minimal code changes:

```python
import openai

# Configure OpenAI client to use the gateway
openai.api_base = "http://localhost:5000/gateway/chat"
openai.api_key = "not-needed"  # Gateway handles authentication

# Use standard OpenAI client
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",  # Endpoint name in your gateway config
    messages=[{"role": "user", "content": "Hello, AI Gateway!"}],
)

print(response.choices[0].message.content)
```

## MLflow Models Integration

Deploy your own custom models alongside external providers for a unified interface to both proprietary and third-party models.

### Registering Models

Train and register your models using MLflow's standard workflow, then expose them through the gateway:

```python
import mlflow
import mlflow.pyfunc

# Log and register a model
with mlflow.start_run():
    # Your model training code here
    mlflow.pyfunc.log_model(
        name="my_model",
        python_model=MyCustomModel(),
        registered_model_name="custom-chat-model",
    )

# Deploy the model
# Then configure it in your gateway config.yaml:
```

```yaml
endpoints:
  - name: custom-model
    endpoint_type: llm/v1/chat
    model:
      provider: mlflow-model-serving
      name: custom-chat-model
      config:
        model_server_url: http://localhost:5001
```

## Production Best Practices

### Performance Optimization

1. **Connection Pooling**: Use persistent HTTP connections for high-throughput applications
2. **Batch Requests**: Group multiple requests when possible
3. **Async Operations**: Use async/await for concurrent requests
4. **Caching**: Implement response caching for repeated queries

### Error Handling

```python
import time
from mlflow.deployments import get_deploy_client
from mlflow.exceptions import MlflowException


def robust_query(client, endpoint, inputs, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.predict(endpoint=endpoint, inputs=inputs)
        except MlflowException as e:
            if attempt < max_retries - 1:
                time.sleep(2**attempt)  # Exponential backoff
                continue
            raise e


# Usage
client = get_deploy_client("http://localhost:5000")
response = robust_query(
    client, "chat", {"messages": [{"role": "user", "content": "Hello"}]}
)
```

### Security

1. **Use HTTPS** in production
2. **Implement authentication** at the application level
3. **Validate inputs** before sending to the gateway
4. **Monitor usage** and implement rate limiting

### Monitoring and Logging

```python
import logging
from mlflow.deployments import get_deploy_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def monitored_query(client, endpoint, inputs):
    start_time = time.time()
    try:
        logger.info(f"Querying endpoint: {endpoint}")
        response = client.predict(endpoint=endpoint, inputs=inputs)
        duration = time.time() - start_time
        logger.info(f"Query completed in {duration:.2f}s")
        return response
    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"Query failed after {duration:.2f}s: {e}")
        raise
```

### Load Balancing

For high-availability setups, consider running multiple gateway instances:

```python
import random
from mlflow.deployments import get_deploy_client

# Multiple gateway instances
gateway_urls = ["http://gateway1:5000", "http://gateway2:5000", "http://gateway3:5000"]


def get_client():
    url = random.choice(gateway_urls)
    return get_deploy_client(url)


# Use with automatic failover
def resilient_query(endpoint, inputs, max_retries=3):
    for attempt in range(max_retries):
        try:
            client = get_client()
            return client.predict(endpoint=endpoint, inputs=inputs)
        except Exception as e:
            if attempt < max_retries - 1:
                continue
            raise e
```

## Health and Monitoring

```python
# Check gateway health via HTTP
import requests


def check_gateway_health(gateway_url):
    try:
        response = requests.get(f"{gateway_url}/health")
        return {
            "status": response.status_code,
            "healthy": response.status_code == 200,
            "response": response.json() if response.status_code == 200 else None,
        }
    except requests.RequestException as e:
        return {"status": "error", "healthy": False, "error": str(e)}


# Example usage
health = check_gateway_health("http://localhost:5000")
print(f"Gateway Health: {health}")
```

## Next Steps

<TilesGrid>
  <TileCard
    icon={Settings}
    title="Configuration Guide"
    description="Learn how to configure providers and advanced settings"
    href="/genai/governance/ai-gateway/configuration"
    linkText="Configure providers →"
  />
  <TileCard
    icon={Play}
    title="Usage Guide"
    description="Master basic querying and client usage patterns"
    href="/genai/governance/ai-gateway/usage"
    linkText="Learn usage →"
  />
  <TileCard
    icon={Book}
    title="Tutorial"
    description="Complete step-by-step walkthrough from setup to deployment"
    href="/genai/governance/ai-gateway"
    linkText="Follow tutorial →"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: setup.mdx]---
Location: mlflow-master/docs/docs/genai/governance/ai-gateway/setup.mdx

```text
# AI Gateway Setup

import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import TabsWrapper from "@site/src/components/TabsWrapper";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { Settings, Play, Wrench } from "lucide-react";

Get your MLflow AI Gateway up and running quickly with this step-by-step setup guide.

## Installation

The AI Gateway requires MLflow with additional dependencies for server functionality. The `[gateway]` extra includes FastAPI, Uvicorn, and other serving components:

```bash
pip install 'mlflow[gateway]'
```

## Environment Setup

Store your API keys as environment variables to keep them secure and separate from your configuration files. The gateway reads these variables when connecting to providers:

```bash
# OpenAI
export OPENAI_API_KEY=sk-...

# Azure OpenAI
export AZURE_OPENAI_API_KEY=your-azure-key
export AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/

# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# AWS Bedrock
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1

# Cohere
export COHERE_API_KEY=...
```

## Basic Server Configuration

The gateway uses a YAML configuration file to define endpoints. Each endpoint specifies a provider, model, and authentication details. Start with a simple configuration and expand as needed:

<TabsWrapper>
<Tabs>
<TabItem value="simple" label="Simple Setup" default>

```yaml
endpoints:
  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-3.5-turbo
      config:
        openai_api_key: $OPENAI_API_KEY
```

</TabItem>
<TabItem value="multiple" label="Multiple Endpoints">

```yaml
endpoints:
  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-3.5-turbo
      config:
        openai_api_key: $OPENAI_API_KEY

  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: openai
      name: gpt-3.5-turbo-instruct
      config:
        openai_api_key: $OPENAI_API_KEY

  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: openai
      name: text-embedding-ada-002
      config:
        openai_api_key: $OPENAI_API_KEY
```

</TabItem>

<TabItem value="route" label="Traffic route">

```yaml
endpoints:
  - name: chat1
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-3.5-turbo
      config:
        openai_api_key: $OPENAI_API_KEY

  - name: chat2
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-4.1
      config:
        openai_api_key: $OPENAI_API_KEY

routes:
  - name: chat-route
    task_type: llm/v1/chat
    destinations:
      - name: chat1
        traffic_percentage: 80
      - name: chat2
        traffic_percentage: 20
    routing_strategy: TRAFFIC_SPLIT
```

</TabItem>
</Tabs>
</TabsWrapper>

## Starting the Gateway Server

The MLflow CLI provides a simple command to start the gateway server. The server will validate your configuration file and start endpoints for all defined providers.

### Basic Start

This starts the server with default settings on localhost port 5000:

```bash
mlflow gateway start --config-path config.yaml
```

The server will start on `http://localhost:5000` by default.

### Custom Configuration

For production or specific networking requirements, customize the host, port, and worker processes:

```bash
mlflow gateway start \
  --config-path config.yaml \
  --port 8080 \
  --host 0.0.0.0 \
  --workers 4
```

### Command Line Options

| Option          | Description                     | Default   |
| --------------- | ------------------------------- | --------- |
| `--config-path` | Path to YAML configuration file | Required  |
| `--port`        | Port number for the server      | 5000      |
| `--host`        | Host address to bind to         | 127.0.0.1 |
| `--workers`     | Number of worker processes      | 1         |

## Verification

### Check Server Status

Verify the gateway is running and healthy with a simple HTTP health check:

```bash
# Check if server is responding
curl http://localhost:5000/health
```

### View API Documentation

The gateway automatically generates interactive API documentation using FastAPI's built-in Swagger UI:

```
http://localhost:5000/docs
```

### Test a Simple Request

Send a test request to the chat endpoint to verify your endpoint configuration is working correctly:

```bash
curl -X POST http://localhost:5000/gateway/chat/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Send a test request to the "chat-route" route to verify your route configuration is working correctly:

```bash
curl -X POST http://localhost:5000/gateway/chat-route/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Troubleshooting

### Common Issues

**Missing API Keys:**

```
Error: Provider 'openai' requires 'openai_api_key' configuration
```

Solution: Ensure environment variables are set before starting the server.

**Port Conflicts:**

```
Error: Port 5000 is already in use
```

Solution: Use a different port with `--port` or stop the conflicting process.

**Configuration Errors:**

```
Error: Invalid configuration file
```

Solution: Check YAML syntax and required fields. Configuration is validated when starting the server.

### Validation

Configuration is automatically validated when starting the server. Any errors will be displayed with helpful messages to guide you in fixing the issues.

## Next Steps

Once your gateway is running, learn how to configure providers and endpoints:

<TilesGrid>
  <TileCard
    icon={Settings}
    title="Configuration Guide"
    description="Learn how to configure providers, endpoints, and advanced settings"
    href="/genai/governance/ai-gateway/configuration"
    linkText="Configure providers →"
  />
  <TileCard
    icon={Play}
    title="Usage Guide"
    description="Start querying endpoints with Python client and REST APIs"
    href="/genai/governance/ai-gateway/usage"
    linkText="Start using →"
  />
  <TileCard
    icon={Wrench}
    title="Integration Guide"
    description="Integrate with applications, frameworks, and production systems"
    href="/genai/governance/ai-gateway/integration"
    linkText="Learn integrations →"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: usage.mdx]---
Location: mlflow-master/docs/docs/genai/governance/ai-gateway/usage.mdx

```text
# AI Gateway Usage

import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Settings, Book, Home } from "lucide-react";

Learn how to query your AI Gateway endpoints, integrate with applications, and leverage different APIs and tools.

## Basic Querying

### REST API Requests

The gateway exposes REST endpoints that follow OpenAI-compatible patterns. Each endpoint / route accepts JSON payloads and returns structured responses. Use these when integrating with applications that don't have MLflow client libraries:

```bash
# Chat completions
curl -X POST http://localhost:5000/gateway/chat/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ]
  }'

# Text completions
curl -X POST http://localhost:5000/gateway/completions/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "The future of AI is",
    "max_tokens": 100
  }'

# Embeddings
curl -X POST http://localhost:5000/gateway/embeddings/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Text to embed"
  }'
```

### Query Parameters

These parameters control model behavior and are supported across most providers. Different models may support different subsets of these parameters:

#### Chat Completions

```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is machine learning?"}
  ],
  "temperature": 0.7,
  "max_tokens": 150,
  "top_p": 0.9,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0,
  "stop": ["\n\n"],
  "stream": false
}
```

#### Text Completions

```json
{
  "prompt": "Once upon a time",
  "temperature": 0.8,
  "max_tokens": 100,
  "top_p": 1.0,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0,
  "stop": [".", "!"],
  "stream": false
}
```

#### Embeddings

```json
{
  "input": ["Text to embed", "Another text"],
  "encoding_format": "float"
}
```

### Streaming Responses

Enable streaming for real-time response generation:

```bash
curl -X POST http://localhost:5000/gateway/chat/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Write a story"}],
    "stream": true
  }'
```

## Python Client Integration

### OpenAI python SDK client (Recommended)

MLflow gateway allows developers to use serving models through OpenAI's SDK.

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:5000/v1",
    # API key is not needed, it is configured in gateway server side.
    api_key="",
)

messages = [{"role": "user", "content": "How are you ?"}]

response = client.chat.completions.create(
    # The model name must be set to either endpoint name or route name
    # that is configured in gateway YAML file.
    model="chat",
    messages=messages,
)
print(response.choices[0].message)
```

Streaming API is also supported:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:5000/v1",
    # API key is not needed, it is configured in gateway server side.
    api_key="",
)

messages = [{"role": "user", "content": "How are you ?"}]

response = client.chat.completions.create(
    # The model name must be set to either endpoint name or route name
    # that is configured in gateway YAML file.
    model="chat",
    messages=messages,
    stream=True,
)

for chunk in stream:
    print(chunk)
    print(chunk.choices[0].delta)
    print("****************")
```

### MLflow Deployments Client

The MLflow deployments client provides a Python interface that handles authentication, error handling, and response parsing. Use this when building Python applications:

```python
from mlflow.deployments import get_deploy_client

# Create a client for the gateway
client = get_deploy_client("http://localhost:5000")

# Query a chat endpoint
response = client.predict(
    endpoint="chat",
    inputs={"messages": [{"role": "user", "content": "What is MLflow?"}]},
)

print(response["choices"][0]["message"]["content"])
```

### Advanced Client Usage

Build reusable functions for common operations like streaming responses and batch embedding generation:

```python
from mlflow.deployments import get_deploy_client

# Initialize client
client = get_deploy_client("http://localhost:5000")


# Chat with streaming
def stream_chat(prompt):
    response = client.predict(
        endpoint="chat",
        inputs={
            "messages": [{"role": "user", "content": prompt}],
            "stream": True,
            "temperature": 0.7,
        },
    )

    for chunk in response:
        if chunk["choices"][0]["delta"].get("content"):
            print(chunk["choices"][0]["delta"]["content"], end="")


# Generate embeddings
def get_embeddings(texts):
    response = client.predict(endpoint="embeddings", inputs={"input": texts})
    return [item["embedding"] for item in response["data"]]


# Example usage
stream_chat("Explain quantum computing")
embeddings = get_embeddings(["Hello world", "MLflow AI Gateway"])
```

### Error Handling

Proper error handling helps you distinguish between network issues, authentication problems, and model-specific errors:

```python
from mlflow.deployments import get_deploy_client
from mlflow.exceptions import MlflowException

client = get_deploy_client("http://localhost:5000")

try:
    response = client.predict(
        endpoint="chat", inputs={"messages": [{"role": "user", "content": "Hello"}]}
    )
    print(response)
except MlflowException as e:
    print(f"MLflow error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Streaming Responses

For long-form content generation, enable streaming to receive partial responses as they're generated instead of waiting for the complete response:

```bash
curl -X POST http://localhost:5000/gateway/chat/invocations \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Write a story"}],
    "stream": true
  }'
```

## API Reference

### Gateway Management

Query the gateway's current configuration and available endpoints programmatically:

```python
from mlflow.deployments import get_deploy_client

client = get_deploy_client("http://localhost:5000")

# List available endpoints
endpoints = client.list_endpoints()
for endpoint in endpoints:
    print(f"Endpoint: {endpoint['name']}")

# Get endpoint details
endpoint_info = client.get_endpoint("chat")
print(f"Model: {endpoint_info.get('model', {}).get('name', 'N/A')}")
print(f"Provider: {endpoint_info.get('model', {}).get('provider', 'N/A')}")

# Note: Route creation, updates, and deletion are typically done
# through configuration file changes, not programmatically
```

### Health Monitoring

Monitor gateway availability and responsiveness for production deployments:

```python
import requests

try:
    response = requests.get("http://localhost:5000/health")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("Gateway is healthy")
except requests.RequestException as e:
    print(f"Health check failed: {e}")
```

## Next Steps

<TilesGrid>
  <TileCard
    icon={Settings}
    title="Integration Guide"
    description="Integrate with applications, frameworks, and production systems"
    href="/genai/governance/ai-gateway/integration"
    linkText="Learn integrations →"
  />
  <TileCard
    icon={Book}
    title="Tutorial"
    description="Complete step-by-step walkthrough from setup to deployment"
    href="/genai/governance/ai-gateway"
    linkText="Follow tutorial →"
  />
  <TileCard
    icon={Home}
    title="Configuration Guide"
    description="Learn how to configure providers and advanced settings"
    href="/genai/governance/ai-gateway/configuration"
    linkText="Configure providers →"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
