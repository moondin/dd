---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 179
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 179 of 991)

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

---[FILE: train.py]---
Location: mlflow-master/examples/flower_classifier/train.py

```python
"""
Example of image classification with MLflow using Keras to classify flowers from photos. The data is
taken from ``http://download.tensorflow.org/example_images/flower_photos.tgz`` and may be
downloaded during running this project if it is missing.
"""

import math
import os
import tarfile

import click
import keras
import numpy as np
import tensorflow as tf
from image_pyfunc import decode_and_resize_image, log_model
from keras.applications import vgg16
from keras.callbacks import Callback
from keras.layers import Dense, Flatten, Input, Lambda
from keras.models import Model
from keras.utils import np_utils
from sklearn.model_selection import train_test_split

import mlflow
from mlflow.models import infer_signature


def download_input():
    import requests

    url = "http://download.tensorflow.org/example_images/flower_photos.tgz"
    print("downloading '{}' into '{}'".format(url, os.path.abspath("flower_photos.tgz")))
    r = requests.get(url)
    with open("flower_photos.tgz", "wb") as f:
        f.write(r.content)

    print("decompressing flower_photos.tgz to '{}'".format(os.path.abspath("flower_photos")))
    with tarfile.open("flower_photos.tgz") as tar:
        tar.extractall(path="./")


@click.command(
    help="Trains an Keras model on flower_photos dataset. "
    "The input is expected as a directory tree with pictures for each category in a "
    "folder named by the category. "
    "The model and its metrics are logged with mlflow."
)
@click.option("--epochs", type=click.INT, default=1, help="Maximum number of epochs to evaluate.")
@click.option(
    "--batch-size", type=click.INT, default=16, help="Batch size passed to the learning algo."
)
@click.option("--image-width", type=click.INT, default=224, help="Input image width in pixels.")
@click.option("--image-height", type=click.INT, default=224, help="Input image height in pixels.")
@click.option("--seed", type=click.INT, default=97531, help="Seed for the random generator.")
@click.option("--training-data", type=click.STRING, default="./flower_photos")
@click.option("--test-ratio", type=click.FLOAT, default=0.2)
def run(training_data, test_ratio, epochs, batch_size, image_width, image_height, seed):
    image_files = []
    labels = []
    domain = {}
    print("Training model with the following parameters:")
    for param, value in locals().items():
        print("  ", param, "=", value)

    if training_data == "./flower_photos" and not os.path.exists(training_data):
        print("Input data not found, attempting to download the data from the web.")
        download_input()

    for dirname, _, files in os.walk(training_data):
        for filename in files:
            if filename.endswith("jpg"):
                image_files.append(os.path.join(dirname, filename))
                clazz = os.path.basename(dirname)
                if clazz not in domain:
                    domain[clazz] = len(domain)
                labels.append(domain[clazz])

    train(
        image_files,
        labels,
        domain,
        epochs=epochs,
        test_ratio=test_ratio,
        batch_size=batch_size,
        image_width=image_width,
        image_height=image_height,
        seed=seed,
    )


class MlflowLogger(Callback):
    """
    Keras callback for logging metrics and final model with MLflow.

    Metrics are logged after every epoch. The logger keeps track of the best model based on the
    validation metric. At the end of the training, the best model is logged with MLflow.
    """

    def __init__(self, model, x_train, y_train, x_valid, y_valid, **kwargs):
        self._model = model
        self._best_val_loss = math.inf
        self._train = (x_train, y_train)
        self._valid = (x_valid, y_valid)
        self._pyfunc_params = kwargs
        self._best_weights = None

    def on_epoch_end(self, epoch, logs=None):
        """
        Log Keras metrics with MLflow. Update the best model if the model improved on the validation
        data.
        """
        if not logs:
            return
        for name, value in logs.items():
            name = "valid_" + name[4:] if name.startswith("val_") else "train_" + name
            mlflow.log_metric(name, value)
        val_loss = logs["val_loss"]
        if val_loss < self._best_val_loss:
            # Save the "best" weights
            self._best_val_loss = val_loss
            self._best_weights = [x.copy() for x in self._model.get_weights()]

    def on_train_end(self, *args, **kwargs):
        """
        Log the best model with MLflow and evaluate it on the train and validation data so that the
        metrics stored with MLflow reflect the logged model.
        """
        self._model.set_weights(self._best_weights)
        x, y = self._train
        train_res = self._model.evaluate(x=x, y=y)
        for name, value in zip(self._model.metrics_names, train_res):
            mlflow.log_metric(f"train_{name}", value)
        x, y = self._valid
        valid_res = self._model.evaluate(x=x, y=y)
        for name, value in zip(self._model.metrics_names, valid_res):
            mlflow.log_metric(f"valid_{name}", value)
        signature = infer_signature(x, y)
        log_model(keras_model=self._model, signature=signature, **self._pyfunc_params)


def _imagenet_preprocess_tf(x):
    return (x / 127.5) - 1


def _create_model(input_shape, classes):
    image = Input(input_shape)
    lambda_layer = Lambda(_imagenet_preprocess_tf)
    preprocessed_image = lambda_layer(image)
    model = vgg16.VGG16(
        classes=classes, input_tensor=preprocessed_image, weights=None, include_top=False
    )

    x = Flatten(name="flatten")(model.output)
    x = Dense(4096, activation="relu", name="fc1")(x)
    x = Dense(4096, activation="relu", name="fc2")(x)
    x = Dense(classes, activation="softmax", name="predictions")(x)
    return Model(inputs=model.input, outputs=x)


def train(
    image_files,
    labels,
    domain,
    image_width=224,
    image_height=224,
    epochs=1,
    batch_size=16,
    test_ratio=0.2,
    seed=None,
):
    """
    Train VGG16 model on provided image files. This will create a new MLflow run and log all
    parameters, metrics and the resulting model with MLflow. The resulting model is an instance
    of KerasImageClassifierPyfunc - a custom python function model that embeds all necessary
    preprocessing together with the VGG16 Keras model. The resulting model can be applied
    directly to image base64 encoded image data.

    Args:
        image_files: List of image files to be used for training.
        labels: List of labels for the image files.
        domain: Dictionary representing the domain of the response.
            Provides mapping label-name -> label-id.
        image_width: Width of the input image in pixels.
        image_height: Height of the input image in pixels.
        epochs: Number of epochs to train the model for.
        batch_size: Batch size used during training.
        test_ratio: Fraction of dataset to be used for validation. This data will not be used
            during training.
        seed: Random seed. Used e.g. when splitting the dataset into train / validation.

    """
    assert len(set(labels)) == len(domain)

    input_shape = (image_width, image_height, 3)

    with mlflow.start_run():
        mlflow.log_param("epochs", str(epochs))
        mlflow.log_param("batch_size", str(batch_size))
        mlflow.log_param("validation_ratio", str(test_ratio))
        if seed:
            mlflow.log_param("seed", str(seed))

        def _read_image(filename):
            with open(filename, "rb") as f:
                return f.read()

        with tf.Graph().as_default() as g:
            with tf.compat.v1.Session(graph=g).as_default():
                dims = input_shape[:2]
                x = np.array([decode_and_resize_image(_read_image(x), dims) for x in image_files])
                y = np_utils.to_categorical(np.array(labels), num_classes=len(domain))
                train_size = 1 - test_ratio
                x_train, x_valid, y_train, y_valid = train_test_split(
                    x, y, random_state=seed, train_size=train_size
                )
                model = _create_model(input_shape=input_shape, classes=len(domain))
                model.compile(
                    optimizer=keras.optimizers.SGD(decay=1e-5, nesterov=True, momentum=0.9),
                    loss=keras.losses.categorical_crossentropy,
                    metrics=["accuracy"],
                )
                sorted_domain = sorted(domain.keys(), key=lambda x: domain[x])
                model.fit(
                    x=x_train,
                    y=y_train,
                    validation_data=(x_valid, y_valid),
                    epochs=epochs,
                    batch_size=batch_size,
                    callbacks=[
                        MlflowLogger(
                            model=model,
                            x_train=x_train,
                            y_train=y_train,
                            x_valid=x_valid,
                            y_valid=y_valid,
                            artifact_path="model",
                            domain=sorted_domain,
                            image_dims=input_shape,
                        )
                    ],
                )


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/README.md

```text
# MLflow AI Gateway

The examples provided within this directory show how to get started with individual providers and at least
one of the supported endpoint types. When configuring an instance of the MLflow AI Gateway, multiple providers,
instances of endpoint types, and model versions can be specified for each query endpoint on the server.

## Example configuration files

Within this directory are example config files for each of the supported providers. If using these as a guide
for configuring a large number of endpoints, ensure that the placeholder names (i.e., "completions", "chat", "embeddings")
are modified to prevent collisions. These names are provided for clarity only for the examples and real-world
use cases should define a relevant and meaningful endpoint name to eliminate ambiguity and minimize the chances of name collisions.

# Getting Started with MLflow AI Gateway for OpenAI

This guide will walk you through the installation and basic setup of the MLflow AI Gateway.
Within sub directories of this examples section, you can find specific executable examples
that can be used to validate a given provider's configuration through the MLflow AI Gateway.
Let's get started.

## Step 1: Installing the MLflow AI Gateway

The MLflow AI Gateway is best installed from PyPI. Open your terminal and use the following pip command:

```sh
# Installation from PyPI
pip install 'mlflow[genai]'
```

For those interested in development or in using the most recent build of the MLflow AI Gateway, you may choose to install from the fork of the repository:

```sh
# Installation from the repository
pip install -e '.[genai]'
```

## Step 2: Configuring Endpoints

Each provider has a distinct set of allowable endpoint types (i.e., chat, completions, etc) and
specific requirements for the initialization of the endpoints to interface with their services.
For full examples of configurations and supported endpoint types, see:

- [OpenAI](openai/config.yaml)
- [MosaicML](mosaicml/config.yaml)
- [Anthropic](anthropic/config.yaml)
- [Cohere](cohere/config.yaml)
- [AI21 Labs](ai21labs/config.yaml)
- [PaLM](palm/config.yaml)
- [AzureOpenAI](azure_openai/config.yaml)
- [Mistral](mistral/config.yaml)
- [TogetherAI](togetherai/config.yaml)

## Step 3: Setting Access Keys

See information on specific methods of obtaining and setting the access keys within the provider-specific documentation within this directory.

## Step 4: Starting the MLflow AI Gateway

With the MLflow configuration file in place and access key(s) set, you can now start the MLflow AI Gateway.
Replace `<provider>` with the actual path to the MLflow configuration file for the provider of your choice:

```sh
mlflow gateway start --config-path examples/gateway/<provider>/config.yaml --port 7000

# For example:
mlflow gateway start --config-path examples/gateway/openai/config.yaml --port 7000
```

## Step 5: Accessing the Interactive API Documentation

With the MLflow AI Gateway up and running, access its interactive API documentation by navigating to the following URL:

http://127.0.0.1:7000/docs

## Step 6: Sending Test Requests

After successfully setting up the MLflow AI Gateway, you can send a test request using the provided Python script.
Replace <provider> with the name of the provider example test script that you'd like to use:

```sh
python examples/gateway/<provider>/example.py
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/ai21_labs/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: ai21labs
      name: j2-mid
      config:
        ai21labs_api_key: $AI21LABS_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/ai21_labs/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"AI21 Labs endpoints: {client.list_endpoints()}\n")
    print(f"AI21 Labs completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions request
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "What is the world record for flapjack consumption in a single sitting?",
            "temperature": 0.1,
        },
    )
    print(f"AI21 Labs response for completions: {response_completions}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/ai21_labs/README.md

```text
## Example endpoint configuration for AI21 Labs

To set up your MLflow configuration file, include a single endpoint for the completions endpoint as shown in the [AI21 labs configuration](config.yaml) YAML file.

## Obtaining and Setting the AI21 Labs API Key

To obtain an AI21 Labs API key, you need to create an account and subscribe to the service at [AI21 Labs](https://studio.ai21.com/account/api-key?source=docs).

After obtaining the key, you can export it to your environment variables. Make sure to replace the '...' with your actual API key:

```sh
export AI21LABS_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/anthropic/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: anthropic
      name: claude-1.3-100k
      config:
        anthropic_api_key: $ANTHROPIC_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/anthropic/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"Anthropic endpoints: {client.list_endpoints()}\n")
    print(f"Anthropic completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions request
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "How many average size European ferrets can fit inside a standard olympic "
            "size swimming pool?",
            "max_tokens": 5000,
        },
    )
    print(f"Anthropic response for completions: {response_completions}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/anthropic/README.md

```text
## Example endpoint configuration for Anthropic

To set up your MLflow configuration file, include a single endpoint for the completions endpoint as shown in the [anthropic configuration](config.yaml) YAML file.

## Obtaining and Setting the Anthropic API Key

To obtain an Anthropic API key, you need to create an account and subscribe to the service at [Anthropic](https://docs.anthropic.com/claude/docs/getting-access-to-claude).

After obtaining the key, you can export it to your environment variables. Make sure to replace the '...' with your actual API key:

```sh
export ANTHROPIC_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/azure_openai/config.yaml

```yaml
endpoints:
  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-4o-mini
      config:
        openai_api_type: "azure"
        openai_api_key: $OPENAI_API_KEY
        openai_deployment_name: "{your_deployment_name}"
        openai_api_base: "https://{your_resource_name}-azureopenai.openai.azure.com/"
        openai_api_version: "2023-05-15"

  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: openai
      name: gpt-4o-mini
      config:
        openai_api_type: "azuread"
        openai_api_key: $AZURE_AAD_TOKEN
        openai_deployment_name: "{your_deployment_name}"
        openai_api_base: "https://{your_resource_name}-azureopenai.openai.azure.com/"
        openai_api_version: "2023-05-15"

  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: openai
      name: text-embedding-ada-002
      config:
        openai_api_type: "azure"
        openai_api_key: $OPENAI_API_KEY
        openai_deployment_name: "{your_deployment_name}"
        openai_api_base: "https://{your_resource_name}-azureopenai.openai.azure.com/"
        openai_api_version: "2023-05-15"
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/azure_openai/README.md

```text
## Example endpoint configuration for Azure OpenAI

The following example configuration shows the 3 supported endpoints for Azure OpenAI: chat, completions, and embeddings.
Additionally, it illustrates the two separate api types that are supported for this service.

- `azure` api type: uses a generated token that is applied by setting the API token key directly to an environment variable
- `azuread` api type: uses Azure Active Directory for supplying the active directory key to be used to an environment variable

Depending on how your users will be interacting with the MLflow AI Gateway, a single access paradigm (either `azure` **or** `azuread` is recommended, not a mix of both).

See the [Azure OpenAI configuration](config.yaml) YAML file for example configurations showing all supported endpoint types and the different token access types.

## Setting the Azure OpenAI API Key

In order to get access to the Azure OpenAI service, [see the documentation](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service) guidance in the cognitive services portal.
With the key, export it to your environment variables.

Replace the '...' with your actual API key:

```sh
export OPENAI_API_KEY=...
```

## Validating the Azure OpenAI endpoint

See the [OpenAI Example](../openai/example.py) for testing the Azure OpenAI endpoints. The usage is identical to the standard OpenAI integration from an API perspective.
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/bedrock/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: amazon-bedrock
      name: amazon.titan-tg1-large
      config:
        aws_config:
          aws_region: us-east-1
          aws_access_key_id: $AWS_ACCESS_KEY_ID
          aws_secret_access_key: $AWS_SECRET_ACCESS_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/bedrock/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"Bedrock endpoints: {client.list_endpoints()}\n")
    print(f"Bedrock completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions example
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "How many patties could be stacked on a cheeseburger before issues arise?",
            "max_tokens": 200,
            "temperature": 0.25,
        },
    )
    print(f"Bedrock completions response: {response_completions}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/bedrock/README.md

```text
## Example endpoint configuration for Amazon Bedrock

To view an example of a Bedrock endpoint configuration, see [the configuration example](config.yaml) YAML file.

## Credentials

Valid AWS credentials are required for this example. Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to valid credentials, or run in an environment with those variables set.
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/cohere/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: cohere
      name: command
      config:
        cohere_api_key: $COHERE_API_KEY

  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: cohere
      name: embed-english-light-v2.0
      config:
        cohere_api_key: $COHERE_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/cohere/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"Cohere endpoints: {client.list_endpoints()}\n")
    print(f"Cohere completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions request
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "What is the world record for flapjack consumption in a single sitting?",
            "temperature": 0.1,
        },
    )
    print(f"Cohere response for completions: {response_completions}")

    # Embeddings request
    response_embeddings = client.predict(
        endpoint="embeddings",
        inputs={"input": ["Do you carry the Storm Trooper costume in size 2T?"]},
    )
    print(f"Cohere response for embeddings: {response_embeddings}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/cohere/README.md

```text
## Example endpoint configuration for Cohere

To see an example of specifying both the completions and the embeddings endpoints for Cohere, see [the configuration](config.yaml) YAML file.

This configuration file specifies two endpoints: 'completions' and 'embeddings', both using Cohere's models 'command' and 'embed-english-light-v2.0', respectively.

## Setting a Cohere API Key

This example requires a [Cohere API key](https://docs.cohere.com/docs/going-live):

```sh
export COHERE_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/gemini/config.yaml

```yaml
endpoints:
  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: gemini
      name: gemini-embedding-exp-03-07
      config:
        gemini_api_key: $GEMINI_API_KEY

  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: gemini
      name: gemini-2.0-flash
      config:
        gemini_api_key: $GEMINI_API_KEY

  - name: chat
    endpoint_type: llm/v1/chat
    model:
      provider: gemini
      name: gemini-2.0-flash
      config:
        gemini_api_key: $GEMINI_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/gemini/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"Gemini endpoints: {client.list_endpoints()}\n")
    print(f"Gemini completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

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
            ],
            "temperature": 0.1,
            "top_p": 1,
            "n": 3,
            "max_tokens": 1000,
            "top_k": 40,
        },
    )
    print(f"Gemini response for chat: {response_chat}")

    # Embeddings request
    response_embeddings = client.predict(
        endpoint="embeddings",
        inputs={
            "input": [
                "Describe the main differences between renewable and nonrenewable energy sources."
            ]
        },
    )
    print(f"Gemini response for embeddings: {response_embeddings}\n")

    # Completions request
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "Describe the main differences between renewable and nonrenewable energy sources.",
            "temperature": 0.1,
            "stop": ["."],
            "n": 3,
            "max_tokens": 100,
            "top_k": 40,
            "top_p": 0.5,
        },
    )
    print(f"Gemini response for completions: {response_completions}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/gemini/README.md

```text
## Example endpoint configuration for GEMINI

To see an example of specifying both the completions and embeddings endpoints for Gemini, see [the configuration](config.yaml) YAML file.

This configuration file specifies three endpoints: 'completions', 'embeddings', and 'chat', using Gemini's model gemini-2.0-flash for completions and chat and gemini-embedding-exp-03-07 for embeddings.

## Setting a GEMINI API Key

This example requires a [GEMINI API key](https://ai.google.dev/gemini-api/docs/api-key):

```sh
export GEMINI_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/huggingface/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: "huggingface-text-generation-inference"
      name: falcon-7b-instruct
      config:
        hf_server_url: http://127.0.0.1:8080
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/huggingface/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"Hugging Face TGI endpoints: {client.list_endpoints()}\n")
    print(
        f"Hugging Face completions endpoint info: {client.get_endpoint(endpoint='completions')}\n"
    )

    # Completions request
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": ("What is Deep Learning?"),
            "temperature": 0.1,
        },
    )

    print(f"Hugging Face TGI response for completions: {response_completions}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/huggingface/README.md

```text
## Example endpoint configuration for Huggingface Text Generation Inference

[Huggingface Text Generation Inference (TGI)](https://huggingface.co/docs/text-generation-inference/index) is a comprehensive toolkit designed for deploying and serving Large Language Models (LLMs) efficiently. It offers optimized support for various popular open-source LLMs such as Llama, Falcon, StarCoder, BLOOM, and GPT-Neo. TGI comes with various built-in optimizations and features, such as:

- Simple launcher to serve most popular LLMs
- Tensor Parallelism for faster inference on multiple GPUs
- Safetensors weight loading
- Optimized transformers code for inference using Flash Attention and Paged Attention on the most popular architectures

It should be noted that only a [selection of models](https://huggingface.co/docs/text-generation-inference/supported_models) are optimized for TGI, which uses custom CUDA kernels for faster inference. You can add the flag `--disable-custom-kernels`` at the end of the docker run command if you wish to disable them. If the above list lacks the model you would like to serve, or in the case you created a custom created model, you can try to initialize and serve the model anyways. However, since the model is not optimized for TGI, performance is not guaranteed.

For a more detailed description of all features, please go to the [documentation](https://huggingface.co/docs/text-generation-inference/index).

## Getting Started

> **NOTE** This example is tested on a Linux Machine (Debian 11) with a NVIDIA A100 GPU.

To configure the MLflow AI Gateway with Huggingface Text Generation Inference, a few additional steps need to be followed. The initial step involves deploying a Huggingface model on the TGI server, which is illustrated in the next section.

The recommended approach for deploying the TGI server is by utilizing the [official Docker container](ghcr.io/huggingface/text-generation-inference:1.1.1). Docker is an open-source platform that provides a streamlined solution for automating the deployment, scaling, and management of applications through containers. These containers encompass all the essential dependencies required for seamless execution, including libraries, binaries, and configuration files. To install Docker, please refer to the [installation guide](https://docs.docker.com/get-docker/).

Before proceeding, it is important to verify that your machine has the appropriate hardware to initiate the server. TGI optimized models are compatible with NVIDIA A100, A10G, and T4 GPUs. While other GPU hardware may still provide performance advantages, certain operations such as flash attention and paged attention will not be executed. If you intend to run the container on a machine lacking GPUs or CUDA support, you can eliminate the `--gpus all` flag and include `--disable-custom-kernels`. However, please note that the CPU is not the intended platform for the server, and this choice significantly impacts performance.

#### Installing the NVIDIA Container Toolkit

To begin, the installation of the NVIDIA container toolkit is necessary. This toolkit is essential for running GPU-accelerated containers. Execute the following command to acquire all the requisite packages [ref the code]:

```sh
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list \
  && \
    sudo apt-get update
```

Install the NVIDIA Container toolkit by running the following command.

```
sudo apt-get install -y nvidia-container-toolkit
```

#### Running the TGI server.

After you installed the NVIDIA Container toolkit, you can run the following Docker command to to start a TGI server on your local machine on port `8000`. This will load a [falcon-7b-instruct](https://huggingface.co/tiiuae/falcon-7b-instruct) model on the TGI server.

```
model=tiiuae/falcon-7b-instruct
volume=$PWD/data # share a volume with the Docker container to avoid downloading weights every run
docker run --gpus all --shm-size 1g -p 8000:80 -v $volume:/data ghcr.io/huggingface/text-generation-inference:1.1.1 --model-id $model
```

After the TGI server is deployed, run the following script to verify that it is working correctly:

```
import requests
headers = {
    "Content-Type": "application/json",
}
data = {
    'inputs': 'What is Deep Learning?',
    'parameters': {
        'max_new_tokens': 20,
    },
}
response = requests.post('http://127.0.0.1:8000/generate', headers=headers, json=data)
print(response.json())
# {'generated_text': '\nDeep learning is a branch of machine learning that uses artificial neural networks to learn and make decisions.'}
```

## Update the config.yaml to add a new embeddings endpoint

After you started the server, update the MLflow AI Gateway configuration file [config.yaml](config.yaml) and add the server as a new endpoint:

```
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: "huggingface-text-generation-inference"
      name: llm
      config:
        hf_server_url: http://127.0.0.1:8000/generate
```

## Starting the MLflow AI Gateway

After the configuration file is created, you can start the MLflow AI Gateway by running the following command:

```
mlflow gateway start --config-path examples/gateway/huggingface/config.yaml --port 7000
```

## Querying the endpoint

See the [example script](example.py) within this directory to see how to query the `falcon-7b-instruct` model that is served.

## Setting the parameters of TGI

When you make a request to the MLflow Deployments server, the information you provide in the request body will be sent to TGI. This gives you more control over the output you receive from TGI. However, it's important to note that you cannot turn off `details` and `decoder_input_details`, as they are necessary for TGI endpoints to work correctly.
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/mistral/config.yaml

```yaml
endpoints:
  - name: completions
    endpoint_type: llm/v1/completions
    model:
      provider: mistral
      name: mistral-tiny
      config:
        mistral_api_key: $MISTRAL_API_KEY

  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: mistral
      name: mistral-embed
      config:
        mistral_api_key: $MISTRAL_API_KEY
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/mistral/example.py

```python
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"Mistral endpoints: {client.list_endpoints()}\n")
    print(f"Mistral completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions request
    response_completions = client.predict(
        endpoint="completions",
        inputs={
            "prompt": "How many average size European ferrets can fit inside a standard olympic?",
            "temperature": 0.1,
        },
    )
    print(f"Mistral response for completions: {response_completions}")

    # Embeddings request
    response_embeddings = client.predict(
        endpoint="embeddings",
        inputs={
            "input": [
                "How does your culture celebrate the New Year, and how does it differ from other countries' "
                "celebrations?"
            ]
        },
    )
    print(f"Mistral response for embeddings: {response_embeddings}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/gateway/mistral/README.md

```text
## Example endpoint configuration for Mistral

To see an example of specifying both the completions and the embeddings endpoints for Mistral, see [the configuration](config.yaml) YAML file.

This configuration file specifies two endpoints: 'completions' and 'embeddings', both using Mistral's models 'mistral-tiny' and 'mistral-embed', respectively.

## Setting a Mistral API Key

This example requires a [Mistral API key](https://docs.mistral.ai/):

```sh
export MISTRAL_API_KEY=...
```
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/examples/gateway/mlflow_models/config.yaml

```yaml
endpoints:
  - name: fillmask
    endpoint_type: llm/v1/completions
    model:
      provider: mlflow-model-serving
      name: mask-fill
      config:
        model_server_url: http://127.0.0.1:9010
  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: mlflow-model-serving
      name: sentence-transformer
      config:
        model_server_url: http://127.0.0.1:9020
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/gateway/mlflow_models/example.py

```python
# Prior to running the example code below, view the README.md within this directory
from mlflow.deployments import get_deploy_client


def main():
    client = get_deploy_client("http://localhost:7000")

    print(f"MLflow model endpoints: {client.list_endpoints()}\n")
    print(f"MLflow completions endpoint info: {client.get_endpoint(endpoint='completions')}\n")

    # Completions query
    response_completions = client.predict(
        endpoint="fillmask",
        inputs={
            "prompt": "I like to [MASK] cars!",
        },
    )
    print(f"MLflow model response for completions: {response_completions}")

    # Embeddings query
    response_embeddings = client.predict(
        endpoint="embeddings",
        inputs={
            "input"[
                "MLflow Deployments sure is useful!",
                "Word embeddings are very useful",
            ]
        },
    )

    print(f"MLflow model response for embeddings: {response_embeddings}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
