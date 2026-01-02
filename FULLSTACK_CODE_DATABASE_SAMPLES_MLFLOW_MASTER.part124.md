---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 124
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 124 of 991)

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

---[FILE: pydantic-ai-optimization.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/optimize-prompts/pydantic-ai-optimization.mdx

```text
---
sidebar_position: 9
sidebar_label: Pydantic AI Optimization
---

import { APILink } from "@site/src/components/APILink";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Optimizing Prompts for Pydantic AI

<p style={{display: 'flex', justifyContent: 'center', margin: '1em 0'}}>
  <img src={useBaseUrl("/images/logos/pydanticai-logo.png")} alt="Pydantic AI Logo" style={{width: 300, objectFit: 'contain'}} />
</p>

This guide demonstrates how to leverage <APILink fn="mlflow.genai.optimize_prompts" /> alongside [Pydantic AI](https://ai.pydantic.dev/) to enhance your agent's prompts automatically. The <APILink fn="mlflow.genai.optimize_prompts" /> API is framework-agnostic, enabling you to perform end-to-end prompt optimization of your agents from any framework using state-of-the-art techniques. For more information about the API, please visit [Optimize Prompts](/genai/prompt-registry/optimize-prompts).

## Prerequisites

```bash
pip install -U pydantic-ai mlflow gepa litellm nest_asyncio
```

Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key"
```

Set tracking server and MLflow experiment:

```python
import mlflow

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("Pydantic AI Optimization")
```

## Basic Example

Here's a complete example of optimizing a customer support agent built with Pydantic AI. This example demonstrates how to optimize system and user prompts in a Pydantic AI agent, showing the minimal code changes needed to integrate prompt optimization into your Pydantic AI applications.

```python
import mlflow
from mlflow.genai.scorers import Correctness
from mlflow.genai.optimize.optimizers import GepaPromptOptimizer
from pydantic_ai import Agent

# If you're inside notebooks, please uncomment the following lines.
# import nest_asyncio
# nest_asyncio.apply()

# Step 1: Register your initial prompts
system_prompt = mlflow.genai.register_prompt(
    name="customer-support-system",
    template="You are a helpful customer support agent for an e-commerce platform. "
    "Assist customers with their questions about orders, returns, and products.",
)

user_prompt = mlflow.genai.register_prompt(
    name="customer-support-query",
    template="Customer inquiry: {{query}}",
)


# Step 2: Create a prediction function that uses Pydantic AI
@mlflow.trace
def predict_fn(query):
    # Load prompts from registry
    system_prompt = mlflow.genai.load_prompt("prompts:/customer-support-system@latest")
    user_prompt = mlflow.genai.load_prompt("prompts:/customer-support-query@latest")

    # Initialize agent with system prompt
    agent = Agent(
        model="openai:gpt-5-mini",
        system_prompt=system_prompt.template,
    )

    # Format user message and run agent
    formatted_query = user_prompt.format(query=query)
    result = agent.run_sync(formatted_query)

    return result.output


# Step 3: Prepare training data
dataset = [
    {
        "inputs": {"query": "Where is my order #12345?"},
        "expectations": {
            "expected_response": "I'd be happy to help you track your order #12345. "
            "Please check your email for a tracking link, or I can look it up for you if you provide your email address."
        },
    },
    {
        "inputs": {"query": "How do I return a defective product?"},
        "expectations": {
            "expected_response": "I'm sorry to hear your product is defective. You can initiate a return "
            "through your account's order history within 30 days of purchase. We'll send you a prepaid shipping label."
        },
    },
    {
        "inputs": {"query": "Do you have this item in blue?"},
        "expectations": {
            "expected_response": "I'd be happy to check product availability for you. "
            "Could you please provide the product name or SKU so I can verify if it's available in blue?"
        },
    },
    # more data...
]

# Step 4: Optimize the prompts
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[system_prompt.uri, user_prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-5"),
    scorers=[Correctness(model="openai:/gpt-5")],
)

# Step 5: Use the optimized prompts
optimized_system_prompt = result.optimized_prompts[0]
optimized_user_prompt = result.optimized_prompts[1]

print(f"Optimized system prompt URI: {optimized_system_prompt.uri}")
print(f"Optimized system template: {optimized_system_prompt.template}")
print(f"Optimized user prompt URI: {optimized_user_prompt.uri}")
print(f"Optimized user template: {optimized_user_prompt.template}")

# Since your agent already uses @latest, it will automatically use the optimized prompts
predict_fn("Can I get a refund for order #67890?")
```
```

--------------------------------------------------------------------------------

---[FILE: request-features.mdx]---
Location: mlflow-master/docs/docs/genai/references/request-features.mdx

```text
import GitHubIssues from '@site/src/components/GitHubIssues';

# Request Features

Your feedback drives our roadmap! Vote on the most requested features (👍) and share your ideas to help us build what matters most to you.

<GitHubIssues repo="mlflow/mlflow" label="domain/genai" maxIssues={10} />
```

--------------------------------------------------------------------------------

---[FILE: agent-server.mdx]---
Location: mlflow-master/docs/docs/genai/serving/agent-server.mdx

```text
import { APILink } from "@site/src/components/APILink";

# MLflow Agent Server

## Agent Server Features

:::note
The MLflow Agent Server was released with MLflow 3.6.0. It is currently under active development and is marked as Experimental. Public APIs are subject to change, and new features are being added to enhance its functionality.
:::

- Simple FastAPI server to host agents at `/invocations` endpoint
- Decorator-based function registration (`@invoke`, `@stream`) for easy agent development
- Automatic request and response validation for Responses API schema agents
- Automatic MLflow tracing integration and aggregation

## Full Example

In this example, we'll use the openai-agents-sdk to define our Responses API compatible agent. See [the openai-agents-sdk quickstart](https://openai.github.io/openai-agents-python/quickstart/#create-your-first-agent) for more information.

0. Install the openai-agents-sdk and mlflow, and set your OpenAI API key:

   ```bash
   pip install -U openai-agents mlflow>=3.6.0
   export OPENAI_API_KEY=sk-...
   ```

1. Define your agent in `agent.py` and create methods to annotate with `@invoke`:

   ```python
   from agents import Agent, Runner
   from mlflow.genai.agent_server import invoke, stream
   from mlflow.types.responses import ResponsesAgentRequest, ResponsesAgentResponse

   agent = Agent(
       name="Math Tutor",
       instructions="You provide help with math problems. Explain your reasoning and include examples",
   )


   @invoke()
   async def non_streaming(request: ResponsesAgentRequest) -> ResponsesAgentResponse:
       msgs = [i.model_dump() for i in request.input]
       result = await Runner.run(agent, msgs)
       return ResponsesAgentResponse(
           output=[item.to_input_item() for item in result.new_items]
       )


   # You can also optionally register a @stream function to support streaming responses
   ```

2. Define a `start_server.py` file to start the `AgentServer`:

   ```python
   # Need to import the agent to register the functions with the server
   import agent  # noqa: F401
   from mlflow.genai.agent_server import (
       AgentServer,
       setup_mlflow_git_based_version_tracking,
   )

   agent_server = AgentServer("ResponsesAgent")
   app = agent_server.app

   # Optionally, set up MLflow git-based version tracking
   # to correspond your agent's traces to a specific git commit
   setup_mlflow_git_based_version_tracking()


   def main():
       # To support multiple workers, pass the app as an import string
       agent_server.run(app_import_string="start_server:app")


   if __name__ == "__main__":
       main()
   ```

## Deploying and Testing Your Agent

Run your agent server with the `--reload` flag to automatically reload the server on code changes:

```bash
python3 start_server.py --reload
# Pass in a number of workers to support multiple concurrent requests
# python3 start_server.py --workers 4
# Pass in a port to run the server on
# python3 start_server.py --reload --port 8000
```

Send a request to the server to test your agent out:

```bash
curl -X POST http://localhost:8000/invocations \
   -H "Content-Type: application/json" \
   -d '{ "input": [{ "role": "user", "content": "What is the 14th Fibonacci number?"}]}'
```

After testing your agent, you can view the traces in the MLflow UI by clicking on "Traces" tab.

If you have registered a `@stream` function, you can send a streaming request to the server by passing in `"stream": true`:

```bash
curl -X POST http://localhost:8000/invocations \
   -H "Content-Type: application/json" \
   -d '{
    "input": [{ "role": "user", "content": "What is the 14th Fibonacci number?"}],
    "stream": true
    }'
```

## Evaluating Your Agent

You can use <APILink fn="mlflow.genai.evaluate" /> to evaluate your agent. See the [Evaluating Agents](/genai/eval-monitor/) guide and [Scorer](/genai/eval-monitor/scorers) documentation for more information.

1. Define a file like `eval_agent.py` to evaluate your agent:

   ```python
   import asyncio

   import mlflow

   # need to import agent for our @invoke-registered function to be found
   from agent import agent  # noqa: F401
   from mlflow.genai.agent_server import get_invoke_function
   from mlflow.genai.scorers import RelevanceToQuery, Safety
   from mlflow.types.responses import ResponsesAgentRequest, ResponsesAgentResponse

   eval_dataset = [
       {
           "inputs": {
               "request": {
                   "input": [
                       {"role": "user", "content": "What's the 15th Fibonacci number"}
                   ]
               }
           },
           "expected_response": "The 15th Fibonacci number is 610.",
       }
   ]


   def sync_invoke_fn(request: dict) -> ResponsesAgentResponse:
       # Get the invoke function that was registered via @invoke decorator in your agent
       invoke_fn = get_invoke_function()
       return asyncio.run(invoke_fn(ResponsesAgentRequest(**request)))


   mlflow.genai.evaluate(
       data=eval_dataset,
       predict_fn=sync_invoke_fn,
       scorers=[RelevanceToQuery(), Safety()],
   )
   ```

2. Run the evaluation:

   ```bash
   python3 eval_agent.py
   ```

   You should see the evaluation results and MLflow run information in the console output. In the MLflow UI, you can find the resulting runs from the evaluation on the experiment page. Click the run name to view the aggregated metrics and metadata in the overview pane.
```

--------------------------------------------------------------------------------

---[FILE: custom-apps.mdx]---
Location: mlflow-master/docs/docs/genai/serving/custom-apps.mdx

```text
# Custom Serving Applications

MLflow's custom serving applications allow you to build sophisticated model serving solutions that go beyond simple prediction endpoints. Using the PyFunc framework, you can create custom applications with complex preprocessing, postprocessing, multi-model inference, and business logic integration.

## Overview

Custom serving applications in MLflow are built using the `mlflow.pyfunc.PythonModel` class, which provides a flexible framework for creating deployable models with custom logic. This approach is ideal when you need to:

- 🔄 Implement advanced preprocessing and postprocessing logic
- 🧠 Combine multiple models within a single serving pipeline
- ✅ Apply business rules and custom validation checks
- 🔣 Support diverse input and output data formats
- 🌐 Integrate seamlessly with external systems or databases

## Custom PyFunc Model

### Custom Model

Here's an example of a custom PyFunc model:

```python
import mlflow
import pandas as pd
import json
from typing import Dict, List, Any
import openai  # or any other LLM client


class CustomLLMModel(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        """Load LLM configuration and initialize client"""
        # Load model configuration from artifacts
        config_path = context.artifacts.get("config", "config.json")
        with open(config_path, "r") as f:
            self.config = json.load(f)

        # Initialize LLM client
        self.client = openai.OpenAI(api_key=self.config["api_key"])
        self.model_name = self.config["model_name"]
        self.system_prompt = self.config.get(
            "system_prompt", "You are a helpful assistant."
        )

    def predict(self, context, model_input):
        """Core LLM prediction logic"""
        if isinstance(model_input, pd.DataFrame):
            # Handle DataFrame input with prompts
            responses = []
            for _, row in model_input.iterrows():
                user_prompt = row.get("prompt", row.get("input", ""))
                processed_prompt = self._preprocess_prompt(user_prompt)
                response = self._generate_response(processed_prompt)
                post_processed = self._postprocess_response(response)
                responses.append(post_processed)
            return pd.DataFrame({"response": responses})
        elif isinstance(model_input, dict):
            # Handle single prompt
            user_prompt = model_input.get("prompt", model_input.get("input", ""))
            processed_prompt = self._preprocess_prompt(user_prompt)
            response = self._generate_response(processed_prompt)
            return self._postprocess_response(response)
        else:
            # Handle string input
            processed_prompt = self._preprocess_prompt(str(model_input))
            response = self._generate_response(processed_prompt)
            return self._postprocess_response(response)

    def _preprocess_prompt(self, prompt: str) -> str:
        """Custom prompt preprocessing logic"""
        # Example: Add context, format prompt, apply templates
        template = self.config.get("prompt_template", "{prompt}")
        return template.format(prompt=prompt)

    def _generate_response(self, prompt: str) -> str:
        """Core LLM inference"""
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=self.config.get("temperature", 0.7),
                max_tokens=self.config.get("max_tokens", 1000),
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating response: {str(e)}"

    def _postprocess_response(self, response: str) -> str:
        """Custom response postprocessing logic"""
        # Example: format output, apply filters, extract specific parts
        if self.config.get("strip_whitespace", True):
            response = response.strip()

        max_length = self.config.get("max_response_length")
        if max_length and len(response) > max_length:
            response = response[:max_length] + "..."

        return response


# Example configuration
config = {
    "api_key": "your-api-key",
    "model_name": "gpt-4",
    "system_prompt": "You are an expert data analyst. Provide clear, concise answers.",
    "temperature": 0.3,
    "max_tokens": 500,
    "prompt_template": "Context: Data Analysis Task\n\nQuestion: {prompt}\n\nAnswer:",
    "strip_whitespace": True,
    "max_response_length": 1000,
}

# Save configuration
with open("config.json", "w") as f:
    json.dump(config, f)

# Log the model
with mlflow.start_run():
    # Log configuration as artifact
    mlflow.log_artifact("config.json")

    # Create input example
    input_example = pd.DataFrame(
        {"prompt": ["What is machine learning?", "Explain neural networks"]}
    )

    model_info = mlflow.pyfunc.log_model(
        name="custom_llm_model",
        python_model=CustomLLMModel(),
        artifacts={"config": "config.json"},
        input_example=input_example,
    )
```

### Multi-Model Ensemble

Create a custom application that combines multiple LLMs with different strengths:

```python
import mlflow
import mlflow.pyfunc
import pandas as pd
import json
import openai
import anthropic
from typing import List, Dict, Any


class MultiLLMEnsemble(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        """Load multiple LLM configurations from artifacts"""
        # Load ensemble configuration
        config_path = context.artifacts["ensemble_config"]
        with open(config_path, "r") as f:
            self.config = json.load(f)

        # Initialize multiple LLM clients
        self.llm_clients = {}

        # OpenAI client
        if "openai" in self.config["models"]:
            self.llm_clients["openai"] = openai.OpenAI(
                api_key=self.config["models"]["openai"]["api_key"]
            )

        # Anthropic client
        if "anthropic" in self.config["models"]:
            self.llm_clients["anthropic"] = anthropic.Anthropic(
                api_key=self.config["models"]["anthropic"]["api_key"]
            )

        # Add other LLM clients as needed

        self.voting_strategy = self.config.get("voting_strategy", "weighted_average")
        self.model_weights = self.config.get("model_weights", {})

    def predict(self, context, model_input):
        """Ensemble prediction with multiple LLMs"""
        if isinstance(model_input, pd.DataFrame):
            responses = []
            for _, row in model_input.iterrows():
                prompt = row.get("prompt", row.get("input", ""))
                task_type = row.get("task_type", "general")
                ensemble_response = self._generate_ensemble_response(prompt, task_type)
                responses.append(ensemble_response)
            return pd.DataFrame({"response": responses})
        else:
            prompt = model_input.get("prompt", str(model_input))
            task_type = (
                model_input.get("task_type", "general")
                if isinstance(model_input, dict)
                else "general"
            )
            return self._generate_ensemble_response(prompt, task_type)

    def _generate_ensemble_response(
        self, prompt: str, task_type: str = "general"
    ) -> str:
        """Generate responses from multiple LLMs and combine them"""
        responses = {}

        # Get task-specific model configuration
        task_config = self.config.get("task_routing", {}).get(task_type, {})
        active_models = task_config.get("models", list(self.llm_clients.keys()))

        # Generate responses from each active model
        for model_name in active_models:
            if model_name in self.llm_clients:
                response = self._generate_single_response(model_name, prompt, task_type)
                responses[model_name] = response

        # Combine responses based on voting strategy
        return self._combine_responses(responses, task_type)

    def _generate_single_response(
        self, model_name: str, prompt: str, task_type: str
    ) -> str:
        """Generate response from a single LLM"""
        model_config = self.config["models"][model_name]

        try:
            if model_name == "openai":
                response = self.llm_clients["openai"].chat.completions.create(
                    model=model_config["model_name"],
                    messages=[
                        {
                            "role": "system",
                            "content": model_config.get("system_prompt", ""),
                        },
                        {"role": "user", "content": prompt},
                    ],
                    temperature=model_config.get("temperature", 0.7),
                    max_tokens=model_config.get("max_tokens", 1000),
                )
                return response.choices[0].message.content

            elif model_name == "anthropic":
                response = self.llm_clients["anthropic"].messages.create(
                    model=model_config["model_name"],
                    max_tokens=model_config.get("max_tokens", 1000),
                    temperature=model_config.get("temperature", 0.7),
                    messages=[{"role": "user", "content": prompt}],
                )
                return response.content[0].text

            # Add other LLM implementations here

        except Exception as e:
            return f"Error from {model_name}: {str(e)}"

    def _combine_responses(self, responses: Dict[str, str], task_type: str) -> str:
        """Combine multiple LLM responses using specified strategy"""
        if self.voting_strategy == "best_for_task":
            # Route to best model for specific task type
            task_config = self.config.get("task_routing", {}).get(task_type, {})
            preferred_model = task_config.get("preferred_model")
            if preferred_model and preferred_model in responses:
                return responses[preferred_model]

        elif self.voting_strategy == "consensus":
            # Return response if multiple models agree (simplified)
            response_list = list(responses.values())
            if len(set(response_list)) == 1:
                return response_list[0]
            else:
                # If no consensus, return the longest response
                return max(response_list, key=len)

        elif self.voting_strategy == "weighted_combination":
            # Combine responses with weights (simplified text combination)
            combined_response = "Combined insights:\n\n"
            for model_name, response in responses.items():
                weight = self.model_weights.get(model_name, 1.0)
                combined_response += (
                    f"[{model_name.upper()} - Weight: {weight}]: {response}\n\n"
                )
            return combined_response

        # Default: return first available response
        return list(responses.values())[0] if responses else "No response generated"


# Example ensemble configuration
ensemble_config = {
    "voting_strategy": "best_for_task",
    "models": {
        "openai": {
            "api_key": "your-openai-key",
            "model_name": "gpt-4",
            "system_prompt": "You are a helpful assistant specialized in technical analysis.",
            "temperature": 0.3,
            "max_tokens": 800,
        },
        "anthropic": {
            "api_key": "your-anthropic-key",
            "model_name": "claude-3-sonnet-20240229",
            "temperature": 0.5,
            "max_tokens": 1000,
        },
    },
    "task_routing": {
        "code_analysis": {"models": ["openai"], "preferred_model": "openai"},
        "creative_writing": {"models": ["anthropic"], "preferred_model": "anthropic"},
        "general": {"models": ["openai", "anthropic"], "preferred_model": "openai"},
    },
    "model_weights": {"openai": 0.6, "anthropic": 0.4},
}

# Save configuration
with open("ensemble_config.json", "w") as f:
    json.dump(ensemble_config, f)

# Log the ensemble model
with mlflow.start_run():
    # Log configuration as artifact
    mlflow.log_artifact("ensemble_config.json")

    # Create input example
    input_example = pd.DataFrame(
        {
            "prompt": ["Explain quantum computing", "Write a creative story about AI"],
            "task_type": ["general", "creative_writing"],
        }
    )

    mlflow.pyfunc.log_model(
        name="multi_llm_ensemble",
        python_model=MultiLLMEnsemble(),
        artifacts={"ensemble_config": "ensemble_config.json"},
        input_example=input_example,
    )
```

## Serving Custom Applications

### Local Serving

Once you've created and saved your custom application, serve it locally:

```bash
# Serve from saved model path
mlflow models serve -m ./path/to/custom/model -p 5000

# Serve from Model Registry
mlflow models serve -m "models:/CustomApp/Production" -p 5000
```

### Docker Deployment

Build a Docker image for your custom application:

```bash
# Build Docker image
mlflow models build-docker -m ./path/to/custom/model -n custom-app

# Run the container
docker run -p 5000:8080 custom-app
```

### Testing Custom Applications

Test your custom serving application:

```python
import requests
import pandas as pd
import json

# Prepare test data
test_data = pd.DataFrame(
    {
        "feature1": [1.0, 2.0, 3.0],
        "feature2": [0.5, 1.5, 2.5],
        "customer_value": [5000, 15000, 3000],
    }
)

# Convert to the expected input format
input_data = {"inputs": test_data.to_dict("records")}

# Make prediction request
response = requests.post(
    "http://localhost:5000/invocations",
    headers={"Content-Type": "application/json"},
    data=json.dumps(input_data),
)

print("Response:", response.json())
```

## Best Practices for Custom Applications

### Error Handling

Implement comprehensive error handling:

```python
def predict(self, context, model_input):
    try:
        # Validate input
        self._validate_input(model_input)

        # Process and predict
        result = self._process_prediction(model_input)

        return result

    except ValueError as e:
        # Handle validation errors
        return {"error": f"Validation error: {str(e)}"}
    except Exception as e:
        # Handle unexpected errors
        return {"error": f"Prediction failed: {str(e)}"}
```

### Performance Optimization

- 💤 Lazy Loading: Defer loading large artifacts until they're needed
- 🗂️ Caching: Store and reuse results of frequent computations
- 📦 Batch Processing: Handle multiple inputs in a single, efficient operation
- 🧹 Memory Management: Release unused resources after each request or task

### Testing and Validation

- 🧪 Unit Testing: Test individual components of your custom model in isolation
- 🔗 Integration Testing: Verify the full prediction pipeline end-to-end
- ✅ Output Validation: Ensure correct output formats and robust error handling
- 🚀 Performance Testing: Evaluate scalability using realistic data volumes and loads

### Documentation

Document your custom applications thoroughly:

- 📥 Input/Output Specifications: Clearly define expected input formats and output structures
- ⚙️ Business Logic: Document the core logic and decision-making rules
- ⚡ Performance Characteristics: Describe expected throughput, latency, and resource usage
- ❗ Error Handling: Specify how errors are detected, managed, and communicated

## Integration with Databricks

In Databricks Managed MLflow, custom applications can take advantage of additional features:

- **☁️ Serverless Compute**: Automatic scaling based on demand
- **🔐 Security Integration**: Built-in authentication and authorization
- **📈 Monitoring**: Advanced metrics and logging capabilities
- **🗂️ Version Management**: Seamless model version management with Unity Catalog

Note that the creation and management of serving endpoints is handled differently in Databricks compared to MLflow OSS, with additional UI and API capabilities for enterprise deployment.

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are specified in the conda environment
2. **Artifact Loading**: Verify artifact paths are correct and accessible
3. **Memory Issues**: Monitor memory usage with large models or datasets
4. **Serialization**: Use [`models-from-code`](/ml/model/models-from-code/) feature when logging models that are not picklable

### Debugging Tips

- 🧾 **Enable [tracing](/genai/tracing)** to track execution flow
- 🧪 **Test components individually** before integration
- 📊 **Use small test datasets** for initial validation
- 🖥️ **Monitor resource usage** during development

Custom serving applications provide the flexibility to build production-ready ML systems that integrate seamlessly with your business requirements while maintaining the reliability and scalability of MLflow's serving infrastructure.
```

--------------------------------------------------------------------------------

````
