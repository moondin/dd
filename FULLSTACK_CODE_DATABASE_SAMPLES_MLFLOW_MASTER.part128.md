---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 128
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 128 of 991)

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

---[FILE: lightweight-sdk.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/lightweight-sdk.mdx

```text
import { CardGroup, TitleCard } from "@site/src/components/Card";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import NebiusLogo from '@site/static/images/logos/nebius-logo.png';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Lightweight Tracing SDK Optimized for Production Usage

MLflow offers a lightweight tracing SDK package called `mlflow-tracing` that includes only the essential functionality for tracing and monitoring of your GenAI applications. This package is designed for production environments where minimizing dependencies and deployment size is critical.

## Why Use the Lightweight SDK?

<CardGroup cols={2}>
    <TitleCard
        title="🏎️ Faster Deployment"
        description="The package size and dependencies are significantly smaller than the full MLflow package, allowing for faster deployment times in dynamic environments such as Docker containers, serverless functions, and cloud-based applications."
    />
    <TitleCard
        title="🔧 Simplified Dependency Management"
        description="A smaller set of dependencies means less work keeping up with dependency updates, security patches, and potential breaking changes from upstream libraries. It also reduces the chances of dependency collisions and incompatibilities."
    />
    <TitleCard
        title="📦 Enhanced Portability"
        description="With fewer dependencies, MLflow Tracing can be seamlessly deployed across different environments and platforms, without worrying about compatibility issues."
    />
    <TitleCard
        title="🔒 Reduced Security Risk"
        description="Each dependency potentially introduces security vulnerabilities. By reducing the number of dependencies, MLflow Tracing minimizes the attack surface and reduces the risk of security breaches."
    />
</CardGroup>

## Installation

Install the lightweight SDK using pip:

```bash
pip install mlflow-tracing
```

:::warning
Do not install the full `mlflow` package together with the lightweight `mlflow-tracing` SDK, as this may cause version conflicts and namespace resolution issues.
:::

## Quickstart

Here's a simple example using the lightweight SDK with OpenAI for logging traces to an experiment on a remote MLflow server:

```python
import mlflow
import openai

# Set the tracking URI to your MLflow server
mlflow.set_tracking_uri("http://your-mlflow-server:5000")
mlflow.set_experiment("genai-production-monitoring")

# Enable auto-tracing for OpenAI
mlflow.openai.autolog()

# Use OpenAI as usual - traces will be automatically logged
client = openai.OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini", messages=[{"role": "user", "content": "What is MLflow?"}]
)

print(response.choices[0].message.content)
```

## Choose Your Backend

The lightweight SDK works with various observability platforms. Choose your preferred option and follow the instructions to set up your tracing backend.

<Tabs>
  <TabItem value="self-hosting" label="Self-Hosted MLflow" default>
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

          MLflow is a **fully open-source project**, allowing you to self-host your own MLflow server in your own infrastructure. This is a great option if you want to have full control over your data and are restricted in using cloud-based services.

          In self-hosting mode, you will be responsible for running the tracking server instance and scaling it to your needs. We **strongly recommend** using a SQL-based tracking server on top of a performant database to minimize operational overhead and ensure high availability.

          **Setup Steps:**
          1. Install MLflow server: `pip install mlflow[extras]`
          2. Configure backend store (PostgreSQL/MySQL recommended)
          3. Configure artifact store (S3, Azure Blob, GCS, etc.)
          4. Start server: `mlflow server --backend-store-uri postgresql://... --default-artifact-root s3://...`

          Refer to the [tracking server setup guide](/ml/tracking#tracking-setup) for detailed guidance.

        </div>
        <div class="flex-item padding-md">
          <video src={useBaseUrl("/images/llms/tracing/tracing-top.mp4")} controls loop autoPlay muted aria-label="MLflow Tracing" />
        </div>
      </div>
    </div>

  </TabItem>

  <TabItem value="databricks" label="Databricks">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

          [Databricks Lakehouse Monitoring for GenAI](https://docs.databricks.com/aws/en/generative-ai/agent-evaluation/monitoring) is a go-to solution for monitoring your GenAI application with MLflow Tracing. It provides access to a robust, fully functional monitoring dashboard for operational excellence and quality analysis.

          Lakehouse Monitoring for GenAI can be used regardless of whether your application is hosted on Databricks or not.

          [Sign up for free](https://signup.databricks.com/?destination_url=/ml/experiments-signup?source=OSS_DOCS&dbx_source=TRY_MLFLOW&signup_experience_step=EXPRESS&provider=MLFLOW&utm_source=OSS_DOCS) and [get started in a minute](https://docs.databricks.com/aws/en/generative-ai/agent-evaluation/monitoring) to run your GenAI application with complete observability.
        </div>

        <div class="flex-item padding-md">
          <video src="https://assets.docs.databricks.com/_static/images/generative-ai/monitoring/monitoring-hero.mp4" controls loop autoPlay muted aria-label="Databricks Monitoring" />
        </div>
      </div>
    </div>

  </TabItem>

  <TabItem value="opentelemetry" label="OpenTelemetry">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

          MLflow Tracing is **built on the OpenTelemetry tracing spec**, an industry-standard framework for observability, making it a vendor-neutral solution for monitoring your GenAI applications.

          If you are using OpenTelemetry as part of your observability tech stack, you can use MLflow Tracing without any additional service onboarding. Simply configure the OTLP endpoint and MLflow will export traces to your existing observability platform.

          **Setup Example:**
          ```bash
          export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="http://your-collector:4317/v1/traces"
          export OTEL_SERVICE_NAME="genai-app"
          ```

          Refer to the [OpenTelemetry Integration](/genai/tracing/opentelemetry/export) documentation for detailed setup instructions.
        </div>
        <div class="flex-item padding-md">
          ![OpenTelemetry Backend Examples](/images/llms/tracing/otel-backend-examples.png)
        </div>
      </div>
    </div>

  </TabItem>

  <TabItem value="sagemaker" label="Amazon SageMaker">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

          [MLflow on Amazon SageMaker](https://aws.amazon.com/sagemaker-ai/experiments/) is a fully managed service offered as part of the SageMaker platform by AWS, including tracing and other MLflow features such as model registry.

          MLflow Tracing offers a one-line solution for [tracing Amazon Bedrock](/genai/tracing/integrations/listing/bedrock), making it the best suitable solution for monitoring GenAI application powered by AWS and Amazon Bedrock.

        </div>

        <div class="flex-item padding-md">
          ![Managed MLflow on SageMaker](https://d1.awsstatic.com/deploy-mlflow-models.3eb857c5790a44b461845a630e3a231229838443.png)
        </div>
      </div>
    </div>

  </TabItem>

  <TabItem value="nebius" label="Nebius">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

          [Nebius](https://nebius.com/services/managed-mlflow), a cutting-edge cloud platform for GenAI explorers, offers a fully managed MLflow server. Combining the powerful GPU infrastructure of Nebius for training and hosting LLMs/foundation models with the observability capabilities of MLflow Tracing, Nebius serves as a comprehensive platform for AI/ML developers.

          **Key Features:**
          - Fully managed MLflow service
          - High-performance GPU infrastructure
          - Integrated LLM training and serving
          - Enterprise-grade observability

          Refer to the [Nebius documentation](https://nebius.com/services/managed-mlflow) for more details about the managed MLflow service.

        </div>
        <div class="flex-item padding-md">
          <img src={NebiusLogo} alt="Nebius Logo" width="80%" />
        </div>
      </div>
    </div>

  </TabItem>

</Tabs>

## Supported Features

The lightweight SDK includes all essential tracing functionalities for monitoring your GenAI applications. Click the cards below to learn more about each supported feature.

<CardGroup cols={1}>
    <TitleCard
        title="⚡️ Automatic Tracing for 15+ AI Libraries"
        description="MLflow Tracing SDK supports one-line integration with all of the most popular LLM/GenAI libraries including OpenAI, Anthropic, LangChain, LlamaIndex, Hugging Face, DSPy, and any LLM provider that conforms to OpenAI API format. This automatic tracing capability allows you to monitor your GenAI application with minimal effort and easily switch between different libraries."
        link="/genai/tracing/integrations/"
    />
    <TitleCard
        title="⚙️ Manual Instrumentation"
        description="MLflow Tracing SDK provides a simple and intuitive API for manually instrumenting your GenAI application. Manual instrumentation and automatic tracing can be used together, allowing you to trace advanced applications containing custom code and have fine-grained control over the tracing behavior."
        link="/genai/tracing/app-instrumentation/manual-tracing"
    />
    <TitleCard
        title="🏷️ Tagging and Filtering Traces"
        description="By annotating traces with custom tags, you can add more context to your traces to group them and simplify the process of searching for them later. This is useful when you want to trace an application that runs across multiple request sessions or track specific user interactions."
        link="/genai/tracing/track-users-sessions"
    />
    <TitleCard
        title="🔍 Advanced Search and Querying"
        description="Search and filter traces using powerful SQL-like syntax based on execution time, status, tags, metadata, and other attributes. Perfect for debugging issues, analyzing performance patterns, and monitoring production applications."
        link="/genai/tracing/search-traces"
    />
    <TitleCard
        title="📊 Production Monitoring"
        description="Configure asynchronous logging, handle high-volume tracing, and integrate with enterprise observability platforms. Includes comprehensive production deployment patterns and best practices for scaling your tracing infrastructure."
        link="/genai/tracing/prod-tracing"
    />
</CardGroup>

## Production Configuration Example

Here's a complete example of setting up the lightweight SDK for production use:

```python
import mlflow
import os
from your_app import process_user_request

# Configure MLflow for production
mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "http://mlflow-server:5000"))
mlflow.set_experiment(os.getenv("MLFLOW_EXPERIMENT_NAME", "production-genai-app"))

# Enable automatic tracing for your LLM library
mlflow.openai.autolog()  # or mlflow.langchain.autolog(), etc.


@mlflow.trace
def handle_user_request(user_id: str, session_id: str, message: str):
    """Production endpoint with comprehensive tracing."""

    # Add production context to trace
    mlflow.update_current_trace(
        tags={
            "user_id": user_id,
            "session_id": session_id,
            "environment": "production",
            "service_version": os.getenv("SERVICE_VERSION", "1.0.0"),
        }
    )

    try:
        # Your application logic here
        response = process_user_request(message)

        # Log success metrics
        mlflow.update_current_trace(
            tags={"response_length": len(response), "processing_successful": True}
        )

        return response

    except Exception as e:
        # Log error information
        mlflow.update_current_trace(
            tags={
                "error": True,
                "error_type": type(e).__name__,
                "error_message": str(e),
            },
        )
        raise
```

## Features Not Included

The following MLflow features are not available in the lightweight package:

- **MLflow Tracking Server and UI** - Use the full MLflow package to run the server
- **Run Management APIs** - `mlflow.start_run()`, `mlflow.log_metric()`, etc.
- **Model Logging and Evaluation** - Model serialization and evaluation frameworks
- **Model Registry** - Model versioning and lifecycle management
- **MLflow Projects** - Reproducible ML project format
- **MLflow Recipes** - Predefined ML workflows
- **Other MLflow Components** - Features unrelated to tracing

For these features, use the full MLflow package: `pip install mlflow`

## Migration from Full MLflow

If you're currently using the full MLflow package and want to switch to the lightweight SDK for production:

### 1. Update Dependencies

```bash
# Remove full MLflow
pip uninstall mlflow

# Install lightweight SDK
pip install mlflow-tracing
```

### 2. Update Import Statements

Most tracing functionality remains the same:

```python
# These imports work the same way
import mlflow
import mlflow.openai
from mlflow.tracing import trace

# These features are NOT available in mlflow-tracing:
# import mlflow.sklearn  # ❌ Model logging
# mlflow.start_run()     # ❌ Run management
# mlflow.log_metric()    # ❌ Metric logging
```

### 3. Update Configuration

Focus on tracing-specific configuration:

```python
# Configure tracking URI (same as before)
mlflow.set_tracking_uri("http://your-server:5000")
mlflow.set_experiment("your-experiment")


# Tracing works the same way
@mlflow.trace
def your_function():
    # Your code here
    pass
```

## Package Size Comparison

| Package          | Size    | Dependencies | Use Case                                        |
| ---------------- | ------- | ------------ | ----------------------------------------------- |
| `mlflow`         | ~1000MB | 20+ packages | Development, experimentation, full ML lifecycle |
| `mlflow-tracing` | ~5MB    | 5-8 packages | Production tracing, monitoring, observability   |

The lightweight SDK is **95% smaller** than the full MLflow package, making it ideal for:

- Container deployments
- Serverless functions
- Edge computing
- Production microservices
- CI/CD pipelines

## Summary

The MLflow Tracing SDK provides a production-optimized solution for monitoring GenAI applications with:

- **Minimal footprint** for fast deployments
- **Full tracing capabilities** for comprehensive monitoring
- **Flexible backend options** from self-hosted to enterprise platforms
- **Easy migration path** from full MLflow package
- **Production-ready features** including async logging and error handling

Whether you're running a small prototype or a large-scale production system, the lightweight SDK provides the observability you need without the overhead you don't.
```

--------------------------------------------------------------------------------

---[FILE: prod-tracing.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/prod-tracing.mdx

```text
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { Card } from "@site/src/components/Card";

# Production Monitoring for GenAI Applications

Machine learning projects don't conclude with their initial launch. Ongoing monitoring and incremental enhancements are critical for long-term success. MLflow Tracing offers comprehensive observability for your production applications, supporting the iterative process of continuous improvement while ensuring quality delivery to users.

## Key Monitoring Areas

Understanding what to monitor helps you focus on metrics that actually impact user experience and business outcomes. Rather than trying to monitor everything, focus on areas that provide actionable insights for your specific application and user base.

<Tabs>
  <TabItem value="operational" label="Operational Metrics" default>
    **Performance and Reliability**: Monitor end-to-end response times from user request to final response, including LLM inference latency, retrieval system performance, and component-level bottlenecks. Track overall error rates, LLM API failures, timeout occurrences, and dependency failures to maintain system reliability.

    **Resource Utilization**: Monitor token consumption patterns, API cost tracking, request throughput, and system resource usage to optimize performance and control costs.

    **Business Metrics**: Track user engagement rates, session completion rates, feature adoption, and user satisfaction scores to understand the business impact of your application.

  </TabItem>
  <TabItem value="quality" label="Quality Metrics">
    **Response Quality**: Assess response relevance to user queries, factual accuracy, completeness of responses, and consistency across similar queries to ensure your application meets user needs.

    **Safety and Compliance**: Monitor for harmful content detection, bias monitoring, privacy compliance, and regulatory adherence, which is especially important for applications in regulated industries.

    **User Experience Quality**: Track response helpfulness, clarity and readability, appropriate tone and style, and multi-turn conversation quality to optimize user satisfaction.

    **Domain-Specific Quality**: Implement metrics that vary by application type, such as technical accuracy for specialized domains, citation quality for RAG applications, code quality for programming assistants, or creative quality for content generation.

  </TabItem>
  <TabItem value="business" label="Business Impact">
    **User Behavior**: Monitor session duration and depth, feature usage patterns, user retention rates, and conversion metrics to understand how users engage with your application.

    **Operational Efficiency**: Track support ticket reduction, process automation success, time savings for users, and task completion rates to measure operational improvements.

    **Cost-Benefit Analysis**: Compare infrastructure costs versus value delivered, ROI on GenAI investment, productivity improvements, and customer satisfaction impact to justify and optimize your GenAI initiatives.

  </TabItem>
</Tabs>

## Setting Up Tracing for Production Endpoints

When deploying your GenAI application to production, you need to configure MLflow Tracing to send traces to your MLflow tracking server. This configuration forms the foundation for all production observability capabilities.

<Card>
  <div className="flex-column">
    <div className="flex-row">
      <div className="flex-item">
        #### Pro Tip: Using the Lightweight Tracing SDK

        The [MLflow Tracing SDK `mlflow-tracing`](/genai/tracing/lightweight-sdk) is a lightweight package that only includes the minimum set of dependencies to instrument your code/models/agents with MLflow Tracing.


        **⚡️ Faster Deployment**: Significantly smaller package size and fewer dependencies enable quicker deployments in containers and serverless environments

        **🔧 Simple Dependency Management**: Reduced dependencies mean less maintenance overhead and fewer potential conflicts

        **📦 Enhanced Portability**: Easily deploy across different platforms with minimal compatibility concerns

        **🔒 Improved Security**: Smaller attack surface with fewer dependencies reduces security risks

        **🚀 Performance Optimizations**: Optimized for high-volume tracing in production environments
      </div>
    </div>

  </div>
</Card>

<br/>

:::warning Compatibility Warning
When installing the MLflow Tracing SDK, make sure the environment **does not have** the full MLflow package installed. Having both packages in the same environment might cause conflicts and unexpected behaviors.
:::

### Environment Variable Configuration

Configure the following environment variables in your production environment. See [Production Monitoring Configurations](#production-monitoring-configurations) below for more details about these configurations.

```bash
# Required: Set MLflow Tracking URI
export MLFLOW_TRACKING_URI="http://your-mlflow-server:5000"

# Optional: Configure the experiment name for organizing traces
export MLFLOW_EXPERIMENT_NAME="production-genai-app"

# Optional: Configure async logging (recommended for production)
export MLFLOW_ENABLE_ASYNC_TRACE_LOGGING=true
export MLFLOW_ASYNC_TRACE_LOGGING_MAX_WORKERS=10
export MLFLOW_ASYNC_TRACE_LOGGING_MAX_QUEUE_SIZE=1000

# Optional: Configure trace sampling ratio (default is 1.0)
export MLFLOW_TRACE_SAMPLING_RATIO=0.1
```

## Self-Hosted Tracking Server

You can use the MLflow tracking server to store production traces. However, the tracking server is optimized for offline experience and generally not suitable for handling hyper-scale traffic. For high-volume production workloads, consider using OpenTelemetry integration with dedicated observability platforms.

If you choose to use the tracking server in production, we **strongly recommend**:

1. **Use SQL-based tracking server** on top of a scalable database and artifact storage
2. **Configure proper indexing** on trace tables for better query performance
3. **Set up periodic deletion** for trace data management
4. **Monitor server performance** and scale appropriately

Refer to the [tracking server setup guide](/ml/tracking#tracking-setup) for more details.

### Performance Considerations

**Database**: Use PostgreSQL or MySQL for better concurrent write performance rather than SQLite for production deployments.

**Storage**: Use cloud storage (S3, Azure Blob, GCS) for artifact storage to ensure scalability and reliability.

**Indexing**: Ensure proper indexes on `timestamp_ms`, `status`, and frequently queried tag columns to maintain query performance as trace volume grows.

**Retention**: Implement data retention policies to manage storage costs and maintain system performance over time.

### Docker Deployment Example

When deploying with Docker, pass environment variables through your container configuration:

```dockerfile
# Dockerfile
FROM python:3.9-slim

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application code
COPY . /app
WORKDIR /app

# Set default environment variables (can be overridden at runtime)
ENV MLFLOW_TRACKING_URI=""
ENV MLFLOW_EXPERIMENT_NAME="production-genai-app"
ENV MLFLOW_ENABLE_ASYNC_TRACE_LOGGING=true

CMD ["python", "app.py"]
```

Run the container with environment variables:

```bash
docker run -d \
  -e MLFLOW_TRACKING_URI="http://your-mlflow-server:5000" \
  -e MLFLOW_EXPERIMENT_NAME="production-genai-app" \
  -e MLFLOW_ENABLE_ASYNC_TRACE_LOGGING=true \
  -e APP_VERSION="1.0.0" \
  your-app:latest
```

### Kubernetes Deployment Example

For Kubernetes deployments, use ConfigMaps and Secrets:

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mlflow-config
data:
  MLFLOW_TRACKING_URI: 'http://mlflow-server:5000'
  MLFLOW_EXPERIMENT_NAME: 'production-genai-app'
  MLFLOW_ENABLE_ASYNC_TRACE_LOGGING: 'true'

---
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: genai-app
spec:
  template:
    spec:
      containers:
        - name: app
          image: your-app:latest
          envFrom:
            - configMapRef:
                name: mlflow-config
          env:
            - name: APP_VERSION
              value: '1.0.0'
```

## OpenTelemetry Backends

MLflow Traces can be exported to any OpenTelemetry-compatible backend. See the [OpenTelemetry Integration](/genai/tracing/opentelemetry/export) documentation for more details.

## Managed Monitoring with Databricks

Databricks also offers a [managed solution](https://docs.databricks.com/aws/en/generative-ai/agent-evaluation/monitoring) for monitoring your GenAI applications that integrates with MLflow Tracing.

![Monitoring Hero](https://assets.docs.databricks.com/_static/images/generative-ai/monitoring/monitoring-hero.gif)

Capabilities include:

- Track **operational metrics** like request volume, latency, errors, and cost.
- Monitor **quality metrics** such as correctness, safety, context sufficiency, and more using managed evaluation.
- Configure **custom metrics** with Python function.
- Root cause analysis by looking at the recorded **traces** from MLflow Tracing.
- Support for applications hosted outside of Databricks

## Production Monitoring Configurations

### Asynchronous Trace Logging

For production applications, MLflow logs traces asynchronously by default to prevent blocking your application:

| Environment Variable                        | Description                                                                                                                                                                                                                                                   | Default Value |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `MLFLOW_ENABLE_ASYNC_TRACE_LOGGING`         | Whether to log traces asynchronously. When set to `False`, traces will be logged in a blocking manner.                                                                                                                                                        | `True`        |
| `MLFLOW_ASYNC_TRACE_LOGGING_MAX_WORKERS`    | The maximum number of worker threads to use for async trace logging per process. Increasing this allows higher throughput of trace logging, but also increases CPU usage and memory consumption.                                                              | `10`          |
| `MLFLOW_ASYNC_TRACE_LOGGING_MAX_QUEUE_SIZE` | The maximum number of traces that can be queued before being logged to backend by the worker threads. When the queue is full, new traces will be discarded. Increasing this allows higher durability of trace logging, but also increases memory consumption. | `1000`        |
| `MLFLOW_ASYNC_TRACE_LOGGING_RETRY_TIMEOUT`  | The timeout in seconds for retrying failed trace logging. When a trace logging fails, it will be retried up to this timeout with backoff, after which it will be discarded.                                                                                   | `500`         |

Example configuration for high-volume applications:

```bash
export MLFLOW_ENABLE_ASYNC_TRACE_LOGGING=true
export MLFLOW_ASYNC_TRACE_LOGGING_MAX_WORKERS=20
export MLFLOW_ASYNC_TRACE_LOGGING_MAX_QUEUE_SIZE=2000
export MLFLOW_ASYNC_TRACE_LOGGING_RETRY_TIMEOUT=600
```

### Sampling Traces

For a high-volume application, you may want to reduce the number of traces exported to the backend. You can configure the sampling ratio to control the number of traces exported.

| Environment Variable          | Description                                                                                                                   | Default Value |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `MLFLOW_TRACE_SAMPLING_RATIO` | The sampling ratio for traces. When set to `0.0`, no traces will be exported. When set to `1.0`, all traces will be exported. | `1.0`         |

The default value is `1.0`, which means all traces will be exported. When set to less than `1.0`, say `0.1`, only 10% of the traces will be exported. The sampling is done at the trace level, meaning that all spans in some traces will be exported or discarded together.

## Adding Context to Production Traces

In production environments, enriching traces with contextual information is crucial for understanding user behavior, debugging issues, and improving your GenAI application. This context enables you to analyze user interactions, track quality across different segments, and identify patterns that lead to better or worse outcomes.

### Tracking Request, Session, and User Context

Production applications need to track multiple pieces of context simultaneously. Here's a comprehensive example showing how to track all of these in a FastAPI application:

```python
import mlflow
import os
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")  # FastAPI decorator should be outermost
@mlflow.trace  # Ensure @mlflow.trace is the inner decorator
def handle_chat(request: Request, chat_request: ChatRequest):
    # Retrieve all context from request headers
    client_request_id = request.headers.get("X-Request-ID")
    session_id = request.headers.get("X-Session-ID")
    user_id = request.headers.get("X-User-ID")

    # Update the current trace with all context and environment metadata
    mlflow.update_current_trace(
        client_request_id=client_request_id,
        tags={
            # Session context - groups traces from multi-turn conversations
            "mlflow.trace.session": session_id,
            # User context - associates traces with specific users
            "mlflow.trace.user": user_id,
            # Environment metadata - tracks deployment context
            "environment": "production",
            "app_version": os.getenv("APP_VERSION", "1.0.0"),
            "deployment_id": os.getenv("DEPLOYMENT_ID", "unknown"),
            "region": os.getenv("REGION", "us-east-1"),
        },
    )

    # Your application logic for processing the chat message
    response_text = f"Processed message: '{chat_request.message}'"

    return {"response": response_text}
```

### Feedback Collection

Capturing user feedback on specific interactions is essential for understanding quality and improving your GenAI application:

```python
import mlflow
from mlflow.client import MlflowClient
from fastapi import FastAPI, Query, Request
from pydantic import BaseModel
from typing import Optional
from mlflow.entities import AssessmentSource

app = FastAPI()


class FeedbackRequest(BaseModel):
    is_correct: bool  # True for correct, False for incorrect
    comment: Optional[str] = None


@app.post("/chat_feedback")
def handle_chat_feedback(
    request: Request,
    client_request_id: str = Query(
        ..., description="The client request ID from the original chat request"
    ),
    feedback: FeedbackRequest = ...,
):
    """
    Collect user feedback for a specific chat interaction identified by client_request_id.
    """
    # Search for the trace with the matching client_request_id
    client = MlflowClient()
    experiment = client.get_experiment_by_name("production-genai-app")
    traces = client.search_traces(experiment_ids=[experiment.experiment_id])
    traces = [
        trace for trace in traces if trace.info.client_request_id == client_request_id
    ][:1]

    if not traces:
        return {
            "status": "error",
            "message": f"Unable to find data for client request ID: {client_request_id}",
        }, 500

    # Log feedback using MLflow's log_feedback API
    mlflow.log_feedback(
        trace_id=traces[0].info.trace_id,
        name="response_is_correct",
        value=feedback.is_correct,
        source=AssessmentSource(
            source_type="HUMAN", source_id=request.headers.get("X-User-ID")
        ),
        rationale=feedback.comment,
    )

    return {
        "status": "success",
        "message": "Feedback recorded successfully",
        "trace_id": traces[0].info.trace_id,
    }
```

### Querying Traces with Context

Use the contextual information to analyze production behavior:

```python
import mlflow

# Query traces by user
user_traces = mlflow.search_traces(
    experiment_ids=[experiment.experiment_id],
    filter_string="tags.`mlflow.trace.user` = 'user-jane-doe-12345'",
    max_results=100,
)

# Query traces by session
session_traces = mlflow.search_traces(
    experiment_ids=[experiment.experiment_id],
    filter_string="tags.`mlflow.trace.session` = 'session-def-456'",
    max_results=100,
)

# Query traces by environment
production_traces = mlflow.search_traces(
    experiment_ids=[experiment.experiment_id],
    filter_string="tags.environment = 'production'",
    max_results=100,
)
```

## Summary

Production monitoring with MLflow Tracing provides comprehensive observability for your GenAI applications. Understanding how users actually interact with your application, monitoring quality and performance in real-world conditions, and tracking the business impact of your GenAI initiatives are all essential for long-term success.

Key recommendations for successful production deployments include using `mlflow-tracing` for production deployments to minimize dependencies and optimize performance, configuring async logging for high-volume applications to prevent blocking, adding rich context with tags and metadata for effective debugging and analysis, implementing feedback collection for quality monitoring and continuous improvement, considering OpenTelemetry integration for enterprise observability platforms, and monitoring performance while implementing proper error handling.

Whether you're using self-hosted MLflow, integrating with enterprise observability platforms through OpenTelemetry, or leveraging Databricks Mosaic AI's advanced capabilities, MLflow Tracing provides the foundation for understanding and improving your production GenAI applications.

## Next Steps

**[Searching for traces](/genai/tracing/search-traces)**: Understand how to access trace data for analysis with UI or API.

**[Track Users & Sessions](/genai/tracing/track-users-sessions)**: Implement user and session context tracking for better monitoring insights
```

--------------------------------------------------------------------------------

````
