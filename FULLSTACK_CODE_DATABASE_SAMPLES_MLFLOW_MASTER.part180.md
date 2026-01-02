---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 180
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 180 of 991)

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

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/mlflow_models/README.md

```text
# Guide to using an MLflow served model with MLflow Deployments

In order to utilize MLflow Deployments with MLflow model serving, a few steps must be taken
in addition to those for configuring access to SaaS models (such as Anthropic and OpenAI). The first and most obvious
step that must be taken prior to interfacing with an MLflow served model is that a model needs to be logged to the
MLflow tracking server.

An important consideration for deciding whether to interface MLflow Deployments with a specific model is to evaluate the PyFunc interface that the model will
return after being called for inference. Due to the fact that the MLflow AI Gateway defines a specific response signature, expectations for each endpoint type's payload contents
must be met in order for a endpoint to be valid.

For example, an embeddings endpoint (llm/v1/embeddings endpoint type) is designed to return embeddings data as a collection (a list) of floats that correspond to each of the
input strings that are sent for embeddings inference to a service. The expectation that the embeddings endpoint definition has is that the data is in a particular format. Specifically one that
is capable of having the embeddings data extractable from a service response. Therefore, an MLflow model that returns data in the format below is perfectly valid.

```json
{
  "predictions": [
    [0.0, 0.1],
    [1.0, 0.0]
  ]
}
```

However, a return value from a serving endpoint via a custom PyFunc of the form below will not work.

```json
{
  "predictions": [
    {
      "embedding": [0.0, 0.1]
    },
    {
      "embedding": [1.0, 0.0]
    }
  ]
}
```

It is important to note that the MLflow AI Gateway does not perform validation on a configured endpoint until the point of querying. Creating a endpoint that interfaces with the
MLflow model server that is returning a payload that is incompatible with the configured endpoint type definition will raise 502 exceptions only when queried.

> **NOTE:** It is important to validate the output response of a model served by MLflow to ensure compatibility with the MLflow Deployments endpoint definitions. Not all model outputs are compatible with given endpoint types.

## Creating and logging an embeddings model

To start, we need a model that is capable of generating embeddings. For this example, we'll use
the `sentence_transformers` library and the corresponding MLflow flavor.

```python
from sentence_transformers import SentenceTransformer
import mlflow


model = SentenceTransformer(model_name_or_path="all-MiniLM-L6-v2")
artifact_path = "embeddings_model"

with mlflow.start_run():
    model_info = mlflow.sentence_transformers.log_model(
        model,
        name=artifact_path,
    )
```

## Generate the cli command for starting a local MLflow Model Serving endpoint for this embeddings model

```python
print(f"mlflow models serve -m {model_info.model_uri} -h 127.0.0.1 -p 9020 --no-conda")
```

Copy the output from the print statement to the clipboard.

## Starting the model server for the embeddings model

With the printed string from running the above command copied to the clipboard, open a new terminal
and paste the string. Leave the terminal window open and running.

```commandline
mlflow models serve -m file:///Users/me/demos/mlruns/0/2bfcdcb66eaf4c88abe8e0c7bcab639e/artifacts/embeddings_model -h 127.0.0.1 -p 9020 --no-conda
```

## Update the config.yaml to add a new embeddings endpoint

After assigning a valid port and ensuring that the model server starts correctly:

```commandline
2023/08/08 17:36:44 INFO mlflow.models.flavor_backend_registry: Selected backend for flavor 'python_function'
2023/08/08 17:36:44 INFO mlflow.pyfunc.backend: === Running command 'exec uvicorn --host 127.0.0.1 --port 9020 --workers 1 mlflow.pyfunc.scoring_server.app:app'
INFO:     Started server process [6992]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:9020
```

The scoring server is ready to receive traffic.

Update the MLflow AI Gateway configuration file (config.yaml) with the new endpoint:

```yaml
endpoints:
  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: mlflow-model-serving
      name: sentence-transformer
      config:
        model_server_url: http://127.0.0.1:9020
```

The key component here is the `model_server_url`. For serving an MLflow LLM, this url must match to the service that you are specifying for the
Model Serving server.

> **NOTE:** The MLflow Model Server does not have to be running in order to update the configuration file or to start the MLflow AI Gateway. In order to respond to submitted queries, it is required to be running.

## Creating and logging a fill mask model

To support an additional endpoint for generating a mask fill response from masked input text, we need to log an appropriate model.
For this tutorial example, we'll use a `transformers` `Pipeline` wrapping a `BertForMaskedLM` torch model and will log this pipeline using the MLflow `transformers` flavor.

```python
from transformers import AutoTokenizer, AutoModelForMaskedLM
import mlflow


lm_architecture = "bert-base-cased"
artifact_path = "mask_fill_model"

tokenizer = AutoTokenizer.from_pretrained(lm_architecture)
model = AutoModelForMaskedLM.from_pretrained(lm_architecture)

components = {"model": model, "tokenizer": tokenizer}

with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model=components,
        name=artifact_path,
    )
```

## Generate the cli command for starting a local MLflow Model Serving endpoint for this fill mask model

```python
print(f"mlflow models serve -m {model_info.model_uri} -h 127.0.0.1 -p 9010 --no-conda")
```

## Starting the model server for the fill mask model

Using the command printed to stdout from above, open a new terminal (do not close the terminal that is currently running the embeddings model being served!)
and paste the command.

```commandline
mlflow models serve -m file:///Users/me/demos/mlruns/0/bc8bdb7fb90c406eb95603a97742cef8/artifacts/mask_fill_model -h 127.0.0.1 -p 9010 --no-conda
```

## Update the config.yaml to add a new completions endpoint

Ensure that the MLflow serving endpoint starts and is ready for traffic.

```commandline
2023/08/08 17:39:14 INFO mlflow.models.flavor_backend_registry: Selected backend for flavor 'python_function'
2023/08/08 17:39:14 INFO mlflow.pyfunc.backend: === Running command 'exec uvicorn --host 127.0.0.1 --port 9010 --workers 1 mlflow.pyfunc.scoring_server.app:app'
INFO:     Started server process [6992]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:9010
```

Add the entry to the MLflow AI Gateway configuration file. The final file should match [the config file](config.yaml)

## Create a completions model using MPT-7B-instruct (optional, see notes below)

> **NOTE:** If your system does not have a CUDA-compatible GPU and you have not installed torch with the appropriate CUDA libraries, it is not recommended to attempt to run this portion of the example.
> The inference performance of the MPT-7B-instruct model running on CPU is very slow.
> It is also not recommended to add this model to an MLflow model serving environment that does not have a sufficiently powerful GPU available.

### Download the MPT-7B instruct model and tokenizer to a local directory cache

```python
from huggingface_hub import snapshot_download

snapshot_location = snapshot_download(
    repo_id="mosaicml/mpt-7b-instruct", local_dir="mpt-7b"
)
```

### Define the PyFunc model that will be used for the completions endpoint

```python
import transformers
import mlflow
import torch


class MPT(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        """
        This method initializes the tokenizer and language model
        using the specified model snapshot directory.
        """
        # Initialize tokenizer and language model
        self.tokenizer = transformers.AutoTokenizer.from_pretrained(
            context.artifacts["snapshot"], padding_side="left"
        )

        config = transformers.AutoConfig.from_pretrained(
            context.artifacts["snapshot"], trust_remote_code=True
        )
        # Comment out this configuration setting if not running on a GPU or if triton is not installed.
        # Note that triton dramatically improves the inference speed performance
        config.attn_config["attn_impl"] = "triton"

        self.model = transformers.AutoModelForCausalLM.from_pretrained(
            context.artifacts["snapshot"],
            config=config,
            torch_dtype=torch.bfloat16,
            trust_remote_code=True,
        )

        # NB: If you do not have a CUDA-capable device or have torch installed with CUDA support
        # this setting will not function correctly. Setting device to 'cpu' is valid, but
        # the performance will be very slow.
        self.model.to(device="cuda")

        self.model.eval()

    def _build_prompt(self, instruction):
        """
        This method generates the prompt for the model.
        """
        INSTRUCTION_KEY = "### Instruction:"
        RESPONSE_KEY = "### Response:"
        INTRO_BLURB = (
            "Below is an instruction that describes a task. "
            "Write a response that appropriately completes the request."
        )

        return f"""{INTRO_BLURB}
        {INSTRUCTION_KEY}
        {instruction}
        {RESPONSE_KEY}
        """

    def predict(self, context, model_input, params=None):
        """
        This method generates prediction for the given input.
        """
        prompt = model_input["prompt"][0]
        temperature = model_input.get("temperature", [1.0])[0]
        max_tokens = model_input.get("max_tokens", [100])[0]

        # Build the prompt
        prompt = self._build_prompt(prompt)

        # Encode the input and generate prediction
        # NB: Sending the tokenized inputs to the GPU here explicitly will not work if your system does not have CUDA support.
        # If attempting to run this with only CPU support, change 'cuda' to 'cpu'
        encoded_input = self.tokenizer.encode(prompt, return_tensors="pt").to("cuda")
        output = self.model.generate(
            encoded_input,
            do_sample=True,
            temperature=temperature,
            max_new_tokens=max_tokens,
        )

        # Decode the prediction to text
        generated_text = self.tokenizer.decode(output[0], skip_special_tokens=True)

        # Removing the prompt from the generated text
        prompt_length = len(self.tokenizer.encode(prompt, return_tensors="pt")[0])
        generated_response = self.tokenizer.decode(
            output[0][prompt_length:], skip_special_tokens=True
        )

        return {"candidates": [generated_response]}
```

### Specify the model signature, input example, and log the custom model

```python
import pandas as pd
import mlflow
from mlflow.models.signature import ModelSignature
from mlflow.types import DataType, Schema, ColSpec

# Define input and output schema
input_schema = Schema(
    [
        ColSpec(DataType.string, "prompt"),
        ColSpec(DataType.double, "temperature"),
        ColSpec(DataType.long, "max_tokens"),
    ]
)
output_schema = Schema([ColSpec(DataType.string, "candidates")])
signature = ModelSignature(inputs=input_schema, outputs=output_schema)


# Define input example
input_example = pd.DataFrame(
    {"prompt": ["What is machine learning?"], "temperature": [0.5], "max_tokens": [100]}
)

with mlflow.start_run():
    mlflow.pyfunc.log_model(
        name="mpt-7b-instruct",
        python_model=MPT(),
        artifacts={"snapshot": snapshot_location},
        pip_requirements=[
            "torch",
            "transformers",
            "accelerate",
            "einops",
            "sentencepiece",
        ],
        input_example=input_example,
        signature=signature,
    )
```

## Starting the model server for mpt-7B-instruct (Optional)

Due to the size and complexity of the MPT-7B-instruct model, it is highly advised to only attempt to serve this model in an environment that has:

- A powerful GPU that is capable of holding the model weights in GPU memory
- triton installed

In order to initialize the MLflow Model Server for a large model such as MPT-7B, a slightly modified cli command must be used. Most notably, the timeout duration must be increased from the
default of 60 seconds and it is highly recommended to utilize only a single Gunicorn worker (since each worker will load its own copy of the model, there is a distinct possibility of crashing the server environment with an out of memory fault).

```commandline
mlflow models serve -m file:///Users/me/demos/mlruns/0/92d017e23ca04ffa919a935ed54e9334/artifacts/mpt-7b-instruct -h 127.0.0.1 -p 9030 -t 1200 -w 1 --no-conda
```

## Update the config.yaml to add the MPT-7B-instruct endpoint (Optional)

> **NOTE** If you are adding this endpoint for the example, you will have to manually edit the config.yaml. If the server that is running the MPT-7B-instruct custom PyFunc model's inference does not have GPU support,
> the performance for inference will take a very long time (CPU inference with this model can take tens of minutes for a single query).

```yaml
endpoints:
  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: mlflow-model-serving
      name: sentence-transformer
      config:
        model_server_url: http://127.0.0.1:9020
  - name: fillmask
    endpoint_type: llm/v1/completions
    model:
      provider: mlflow-model-serving
      name: fill-mask
      config:
        model_server_url: http://127.0.0.1:9010
  - name: mpt-instruct
    endpoint_type: llm/v1/completions
    model:
      provider: mlflow-model-serving
      name: mpt-7b-instruct
      config:
        model_server_url: http://127.0.0.1:9030
```

## Start the MLflow AI Gateway

Now that both endpoints (or all 3, if adding in the optional MPT-7B-instruct model endpoint) are defined within the configuration YAML file and the Model Serving servers are ready to receive queries, we can start the MLflow AI Gateway.

```sh
mlflow gateway start --config-path examples/gateway/mlflow_serving/config.yaml --port 7000
```

If adding the mpt-7b-instruct model, start the MLflow AI Gateway by directing the `--config-path` argument to the location of the `config.yaml` file that you've created with the endpoint's addition.

## Query the MLflow AI Gateway

See the [example script](example.py) within this directory to see how to query these two models that are being served.

### Query the mpt-7B-instruct endpoint (Optional)

In order to query the mpt-7b-instruct model, the example shown in the script can be modified by adding an additional query call, as shown below:

```python
# Querying the optional mpt-7b-instruct endpoint
response_mpt = query(
    endpoint="mpt-instruct",
    data={
        "prompt": "What is the purpose of an attention mask in a transformers model?",
        "temperature": 0.1,
        "max_tokens": 200,
    },
)
print(f"Fluent API response for mpt-instruct: {response_mpt}")
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/mosaicml/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: mosaicml
      name: mpt-7b-instruct
      config:
        mosaicml_api_key: $MOSAICML_API_KEY

  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: mosaicml
      name: instructor-xl
      config:
        mosaicml_api_key: $MOSAICML_API_KEY

  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: mosaicml
      name: llama2-70b-chat
      config:
        mosaicml_api_key: $MOSAICML_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/mosaicml/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"MosaicML endpoints: {client.list_endpoints()}\n")
    print(f"MosaicML completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions request
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "What is the world record for flapjack consumption in a single sitting?",
            "temperature": 0.1,
        },
    )
    print(f"MosaicML response for completions: {response_completions}")

    # Embeddings request
    response_embeddings = client.predict(
        endpoint="embeddings",
        inputs={"input": ["Do you carry the Storm Trooper costume in size 2T?"]},
    )
    print(f"MosaicML response for embeddings: {response_embeddings}")

    # Chat example
    response_chat = client.predict(
        endpoint="chat",
        inputs={
            "messages": [
                {
                    "role": "system",
                    "content": "You are a talented European rapper with a background in US history",
                },
                {
                    "role": "user",
                    "content": "Please recite the preamble to the US Constitution as if it were "
                    "written today by a rapper from Reykjavík",
                },
            ]
        },
    )
    print(f"MosaicML response for chat: {response_chat}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/mosaicml/README.md

```text
## Example endpoint configuration for MosaicML

To see an example of specifying both the completions and the embeddings endpoints for MosaicML, see [the configuration](config.yaml) YAML file.

This configuration file specifies three endpoints: 'completions', 'embeddings', and 'chat', using MosaicML's models 'mpt-7b-instruct', 'instructor-xl', and 'llama2-70b-chat', respectively.

## Setting a MosaicML API Key

This example requires a [MosaicML API key](https://docs.mosaicml.com/en/latest/getting_started.html):

```sh
export MOSAICML_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/openai/config.yaml

```yaml
endpoints:
  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-4o-mini
      config:
        openai_api_key: $OPENAI_API_KEY
    limit:
      renewal_period: minute
      calls: 10

  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: openai
      name: gpt-4o-mini
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

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/openai/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"OpenAI endpoints: {client.list_endpoints()}\n")
    print(f"OpenAI endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions example
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "How many patties could be stacked on a cheeseburger before issues arise?",
            "max_tokens": 200,
            "temperature": 0.25,
        },
    )
    print(f"OpenAI completions response: {response_completions}")

    # Chat example
    response_chat = client.predict(
        endpoint="chat",
        inputs={
            "messages": [
                {
                    "role": "user",
                    "content": "Please recite the preamble to the US Constitution as if it were "
                    "written today by a rapper from Reykjavík",
                }
            ]
        },
    )
    print(f"OpenAI completions response: {response_chat}")

    # Embeddings example
    response_embeddings = client.predict(
        endpoint="embeddings",
        inputs={
            "input": "When you say 'enriched', what exactly are you enriching the cereal with?"
        },
    )
    print(f"OpenAI response for embeddings: {response_embeddings}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/openai/README.md

```text
## Example endpoint configuration for OpenAI

To view an example of OpenAI endpoint configurations, see [the configuration example](config.yaml) YAML file for OpenAI.

This configuration shows all 3 supported endpoint types: chat, completions, and embeddings.

## Setting the OpenAI API Key

An OpenAI API key is required for the configuration. If you haven't already, obtain an [OpenAI API key](https://platform.openai.com/account/api-keys).

With the key, export it to your environment variables. Replace the '...' with your actual API key:

```sh
export OPENAI_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/palm/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: palm
      name: text-bison-001
      config:
        palm_api_key: $PALM_API_KEY

  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: palm
      name: embedding-gecko-001
      config:
        palm_api_key: $PALM_API_KEY

  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: palm
      name: chat-bison-001
      config:
        palm_api_key: $PALM_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/palm/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"PaLM endpoints: {client.list_endpoints()}\n")
    print(f"PaLM completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions request
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "What is the world record for flapjack consumption in a single sitting?",
            "temperature": 0.1,
        },
    )
    print(f"PaLM response for completions: {response_completions}")

    # Embeddings request
    response_embeddings = client.predict(
        endpoint="embeddings",
        inputs={"input": ["Do you carry the Storm Trooper costume in size 2T?"]},
    )
    print(f"PaLM response for embeddings: {response_embeddings}")

    # Chat example
    response_chat = client.predict(
        endpoint="chat",
        inputs={
            "messages": [
                {
                    "role": "system",
                    "content": "You are a talented European rapper with a background in US history",
                },
                {
                    "role": "user",
                    "content": "Please recite the preamble to the US Constitution as if it were "
                    "written today by a rapper from Reykjavík",
                },
            ]
        },
    )
    print(f"PaLM response for chat: {response_chat}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/palm/README.md

```text
## Example endpoint configuration for PaLM

To see an example of specifying both the completions and the embeddings endpoints for PaLM, see [the configuration](config.yaml) YAML file.

This configuration file specifies three endpoints: 'completions', 'embeddings', and 'chat', using PaLM's models 'text-bison-001', 'embedding-gecko-001', and 'chat-bison-001', respectively.

## Setting a PaLM API Key

This example requires a [PaLM API key](https://developers.generativeai.google/tutorials/setup):

```sh
export PALM_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/plugin/config.yaml

```yaml
endpoints:
  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: my_llm
      name: my-model-0.1.2
      config:
        my_llm_api_key: $MY_LLM_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/plugin/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://127.0.0.1:7000")

    print(f"Plugin endpoints: {client.list_endpoints()}\n")
    print(f"Plugin chat endpoint info: {client.get_endpoint(endpoint='chat')}\n")

    # Chat request
    response_chat = client.predict(
        endpoint="chat",
        inputs={
            "messages": [
                {
                    "role": "user",
                    "content": "Tell me a joke",
                }
            ]
        },
    )
    print(f"Plugin response for chat: {response_chat}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/plugin/README.md

```text
## Example endpoint configuration for plugin provider

To see an example of specifying the chat endpoint for a plugin provider,
see [the configuration](config.yaml) YAML file.

We implement our plugin provider package `my_llm` under `./my-llm` folder. It implements the chat method.

This configuration file specifies one endpoint: 'chat', using the model 'my-model-0.1.2'.

## Setting up the server

First, install the provider package `my_llm`:

```sh
pip install -e ./my-llm
```

Then, start the server:

```sh
MY_LLM_API_KEY=some-api-key mlflow gateway start --config-path config.yaml --port 7000
```

To clean up the installed package after the example, run

```sh
pip uninstall my_llm
```
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: mlflow-master/examples/gateway/plugin/my-llm/pyproject.toml

```toml
[project]
name = "my_llm"
version = "1.0"

[project.entry-points."mlflow.gateway.providers"]
my_llm = "my_llm.providers:MyLLMProvider"

[tool.setuptools.packages.find]
include = ["my_llm*"]
namespaces = false
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: mlflow-master/examples/gateway/plugin/my-llm/my_llm/config.py
Signals: Pydantic

```python
import os

from pydantic import field_validator

from mlflow.gateway.base_models import ConfigModel


class MyLLMConfig(ConfigModel):
    my_llm_api_key: str

    @field_validator("my_llm_api_key", mode="before")
    def validate_my_llm_api_key(cls, value):
        if value.startswith("$"):
            # This resolves the API key from an environment variable
            env_var_name = value[1:]
            if env_var := os.getenv(env_var_name):
                return env_var
            else:
                raise ValueError(f"Environment variable {env_var_name!r} is not set")
        return value
```

--------------------------------------------------------------------------------

---[FILE: providers.py]---
Location: mlflow-master/examples/gateway/plugin/my-llm/my_llm/providers.py

```python
import time

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.providers import BaseProvider
from mlflow.gateway.schemas import chat
from my_llm.config import MyLLMConfig


class MyLLMProvider(BaseProvider):
    NAME = "MyLLM"
    CONFIG_TYPE = MyLLMConfig

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(config.model.config, MyLLMConfig):
            raise TypeError(f"Unexpected config type {config.model.config}")
        self.my_llm_config: MyLLMConfig = config.model.config

    async def chat(self, payload: chat.RequestPayload) -> chat.ResponsePayload:
        return chat.ResponsePayload(
            id="id-123",
            created=int(time.time()),
            model=self.config.model.name,
            choices=[
                chat.Choice(
                    index=0,
                    message=chat.ResponseMessage(
                        role="assistant", content="This is a response from MyLLMProvider"
                    ),
                )
            ],
            usage=chat.ChatUsage(
                prompt_tokens=10,
                completion_tokens=18,
                total_tokens=28,
            ),
        )
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/togetherai/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: togetherai
      name: mistralai/Mixtral-8x7B-v0.1
      config:
        togetherai_api_key: $TOGETHERAI_API_KEY

  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: togetherai
      name: mistralai/Mixtral-8x7B-Instruct-v0.1
      config:
        togetherai_api_key: $TOGETHERAI_API_KEY

  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: togetherai
      name: togethercomputer/m2-bert-80M-8k-retrieval
      config:
        togetherai_api_key: $TOGETHERAI_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/togetherai/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"Togetherai endpoints: {client.list_endpoints()}\n")
    print(f"Togetherai completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")
    print(f"Togetherai chat endpoint info: {client.get_endpoint(endpoint='chat')}\n")
    print(f"Togetherai embeddings endpoint info: {client.get_endpoint(endpoint='embeddings')}\n")

    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "Who is the protagonist in Witcher 3 Wild Hunt?",
            "max_tokens": 200,
            "temperature": 0.1,
        },
    )

    print(f"Togetherai response for completions: {response_completions}")

    response_embeddings = client.predict(
        endpoint="embeddings",
        inputs={
            "input": ["Who is Wes Montgomery?"],
        },
    )

    print(f"Togetherai response for embeddings: {response_embeddings}")

    response_chat = client.predict(
        endpoint="chat",
        inputs={
            "messages": [{"role": "user", "content": "Get out of the sunlight's way Alexander!"}],
        },
    )

    print(f"Togetherai response for chat: {response_chat}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/togetherai/README.md

```text
## Example endpoint configuration for TogetherAI

To see an example of specifying both the completions and the embeddings endpoints for TogetherAI, see [the configuration](config.yaml) YAML file.

This configuration file specifies two endpoints: 'completions' and 'embeddings', both using TogetherAI's provided models 'mistralai/Mixtral-8x7B-v0.1' and 'togethercomputer/m2-bert-80M-8k-retrieval', respectively.

## Setting a Mistral API Key

This example requires a [TogetherAI API key](https://docs.together.ai/docs/):

```sh
export TOGETHERAI_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/uc_functions/README.md

```text
# Unity Catalog Integration

This example demonstrates how to use the Unity Catalog (UC) integration with MLflow AI Gateway.

## Pre-requisites

1. Install the required packages:

```bash
pip install mlflow openai databricks-sdk
```

2. Create the UC function used in `run.py` by running the following command on Databricks notebook:

```
%sql

CREATE OR REPLACE FUNCTION
my.uc_func.add (
  x INTEGER COMMENT 'The first number to add.',
  y INTEGER COMMENT 'The second number to add.'
)
RETURNS INTEGER
LANGUAGE SQL
RETURN x + y
```

To define your own function, see https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-sql-function.html#create-function-sql-and-python.

3. Create a SQL warehouse in Databricks by following the instructions at https://docs.databricks.com/en/compute/sql-warehouse/create.html.

## Running the example script

First, run the deployments server:

```bash
# Required to authenticate with Databricks. See https://docs.databricks.com/en/dev-tools/auth/index.html#supported-authentication-types-by-databricks-tool-or-sdk for other authentication methods.
export DATABRICKS_HOST="..."   # e.g. https://my.databricks.com
export DATABRICKS_TOKEN="..."

# Required to execute UC functions. See https://docs.databricks.com/en/integrations/compute-details.html#get-connection-details-for-a-databricks-compute-resource for how to get the http path of your warehouse.
# The last part of the http path is the warehouse ID.
#
# /sql/1.0/warehouses/1234567890123456
#                     ^^^^^^^^^^^^^^^^
export DATABRICKS_WAREHOUSE_ID="..."

# Enable Unity Catalog integration
export MLFLOW_ENABLE_UC_FUNCTIONS=true

mlflow gateway start --config-path examples/gateway/openai/config.yaml --port 7000
```

Once the server starts running, run the example script:

```bash
# Replace `my.uc_func.add` if your UC function has a different name
python examples/gateway/uc_functions/run.py  --uc-function-name my.uc_func.add
```
```

--------------------------------------------------------------------------------

---[FILE: run.py]---
Location: mlflow-master/examples/gateway/uc_functions/run.py

```python
import argparse
import json

import openai


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--uc-function-name",
        type=str,
        required=True,
        help="Name of the UC function to use",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    client = openai.OpenAI(base_url="http://localhost:7000/v1")

    print("----- UC function -----")
    uc_function = {
        "type": "uc_function",
        "uc_function": {
            "name": args.uc_function_name,
        },
    }

    resp = client.chat.completions.create(
        model="chat",
        messages=[
            {
                "role": "user",
                "content": "What is the result of 1 + 2?",
            }
        ],
        tools=[uc_function],
    )
    print(resp.choices[0].message.content)

    print("----- UC function + User-defined function -----")
    user_defined_function = {
        "type": "function",
        "function": {
            "description": "Multiply numbers",
            "name": "multiply",
            "parameters": {
                "type": "object",
                "properties": {
                    "x": {
                        "type": "integer",
                        "description": "First number",
                    },
                    "y": {
                        "type": "integer",
                        "description": "Second number",
                    },
                },
                "required": ["x", "y"],
            },
        },
    }

    def multiply(x: int, y: int) -> int:
        return x * y

    msg = {
        "role": "user",
        "content": (
            "What is the result of 1 + 2? What is the result of 3 + 4? What is the result of 5 * 6?"
        ),
    }
    resp = client.chat.completions.create(
        model="chat",
        messages=[msg],
        tools=[
            user_defined_function,
            uc_function,
        ],
    )

    print(resp.choices[0].message.content)
    print(resp.choices[0].message.tool_calls)

    multiply_call = resp.choices[0].message.tool_calls[0].function
    assert multiply_call.name == "multiply"
    resp = client.chat.completions.create(
        model="chat",
        messages=[
            msg,
            {
                "role": "assistant",
                "content": resp.choices[0].message.content,
            },
            {
                "role": "assistant",
                "content": "",
                "tool_calls": resp.choices[0].message.tool_calls,
            },
            {
                "role": "tool",
                "tool_call_id": resp.choices[0].message.tool_calls[0].id,
                "content": str(multiply(**json.loads(multiply_call.arguments))),
            },
        ],
    )

    print(resp.choices[0].message.content)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/gemini/tracing.py

```python
"""
This is an example for leveraging MLflow's auto tracing capabilities for Gemini.

For more information about MLflow Tracing, see: https://mlflow.org/docs/latest/llms/tracing/index.html
"""

import os

import mlflow

# Turn on auto tracing for Gemini by calling mlflow.gemini.autolog()
mlflow.gemini.autolog()

# Import the SDK and configure your API key.
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Use the generate_content method to generate responses to your prompts.
response = client.models.generate_content(
    model="gemini-1.5-flash", contents="The opposite of hot is"
)
print(response.text)

# Also leverage the chat feature to conduct multi-turn interactions
chat = client.chats.create(model="gemini-1.5-flash")
response = chat.send_message("In one sentence, explain how a computer works to a young child.")
print(response.text)
response = chat.send_message("Okay, how about a more detailed explanation to a high schooler?")
print(response.text)

# Count tokens for your statement
response = client.models.count_tokens("The quick brown fox jumps over the lazy dog.")
print(response.total_tokens)

# Generate text embeddings for your content
text = "Hello world"
result = client.models.embed_content(model="text-embedding-004", contents=text)
print(result["embedding"])
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/groq/tracing.py

```python
"""
This is an example for leveraging MLflow's auto tracing capabilities for Groq.

For more information about MLflow Tracing, see: https://mlflow.org/docs/latest/llms/tracing/index.html
"""

import groq

import mlflow

# Turn on auto tracing for Groq by calling mlflow.groq.autolog()
mlflow.groq.autolog()

client = groq.Groq()

# Use the create method to create new message
message = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of low latency LLMs.",
        }
    ],
)

print(message.choices[0].message.content)
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/h2o/MLproject

```text
name: h2o-example
python_env: python_env.yaml

entry_points:
    main:
        command: "python random_forest.py"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/h2o/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - h2o
  - mlflow>=1.0
  - numpy
  - pandas
```

--------------------------------------------------------------------------------

````
