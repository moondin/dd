---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 205
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 205 of 991)

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

---[FILE: autologging.md]---
Location: mlflow-master/examples/synapseml/autologging.md

```text
## MLflow automatic Logging with SynapseML

[MLflow automatic logging](https://www.mlflow.org/docs/latest/tracking.html#automatic-logging) allows you to log metrics, parameters, and models without the need for explicit log statements.
SynapseML supports autologging for every model in the library.

Install SynapseML library following this [guidance](https://microsoft.github.io/SynapseML/docs/getting_started/installation/)

Default mlflow [log_model_allowlist file](https://github.com/mlflow/mlflow/blob/master/mlflow/pyspark/ml/log_model_allowlist.txt) already includes some SynapseML models. To enable more models, you could use `mlflow.pyspark.ml.autolog(log_model_allowlist=YOUR_SET_OF_MODELS)` function, or follow the below guidance by specifying a link to the file and update spark configuration.

To enable autologging with your custom log_model_allowlist file:

1. Put your customized log_model_allowlist file at a place that your code has access to. ([SynapseML official log_model_allowlist file](https://mmlspark.blob.core.windows.net/publicwasb/log_model_allowlist.txt))
   For example:

- In Synapse `wasb://<containername>@<accountname>.blob.core.windows.net/PATH_TO_YOUR/log_model_allowlist.txt`
- In Databricks `/dbfs/FileStore/PATH_TO_YOUR/log_model_allowlist.txt`.

2. Set spark configuration `spark.mlflow.pysparkml.autolog.logModelAllowlistFile` to the path of your `log_model_allowlist.txt` file.
3. Call `mlflow.pyspark.ml.autolog()` before your training code to enable autologging for all supported models.

Note:

If you want to support autologging of PySpark models not present in the log_model_allowlist file, you can add such models to the file.

## Configuration process in Databricks as an example

1. Install latest MLflow via `%pip install mlflow -u`
2. Upload your customized `log_model_allowlist.txt` file to dbfs by clicking File/Upload Data button on Databricks UI.
3. Set Cluster Spark configuration following [this documentation](https://docs.microsoft.com/en-us/azure/databricks/clusters/configure#spark-configuration)

```
spark.mlflow.pysparkml.autolog.logModelAllowlistFile /dbfs/FileStore/PATH_TO_YOUR/log_model_allowlist.txt
```

4. Run the following line before your training code executes.

```python
import mlflow

mlflow.pyspark.ml.autolog()
```

You can customize how autologging works by supplying appropriate [parameters](https://www.mlflow.org/docs/latest/python_api/mlflow.pyspark.ml.html#mlflow.pyspark.ml.autolog).

5. To find your experiment's results via the `Experiments` tab of the MLflow UI.
   <img src="https://mmlspark.blob.core.windows.net/graphics/adb_experiments.png" width="1200" />

## Example for ConditionalKNNModel

```python
from pyspark.ml.linalg import Vectors
from synapse.ml.nn import ConditionalKNN

df = spark.createDataFrame(
    [
        (Vectors.dense(2.0, 2.0, 2.0), "foo", 1),
        (Vectors.dense(2.0, 2.0, 4.0), "foo", 3),
        (Vectors.dense(2.0, 2.0, 6.0), "foo", 4),
        (Vectors.dense(2.0, 2.0, 8.0), "foo", 3),
        (Vectors.dense(2.0, 2.0, 10.0), "foo", 1),
        (Vectors.dense(2.0, 2.0, 12.0), "foo", 2),
        (Vectors.dense(2.0, 2.0, 14.0), "foo", 0),
        (Vectors.dense(2.0, 2.0, 16.0), "foo", 1),
        (Vectors.dense(2.0, 2.0, 18.0), "foo", 3),
        (Vectors.dense(2.0, 2.0, 20.0), "foo", 0),
        (Vectors.dense(2.0, 4.0, 2.0), "foo", 2),
        (Vectors.dense(2.0, 4.0, 4.0), "foo", 4),
        (Vectors.dense(2.0, 4.0, 6.0), "foo", 2),
        (Vectors.dense(2.0, 4.0, 8.0), "foo", 2),
        (Vectors.dense(2.0, 4.0, 10.0), "foo", 4),
        (Vectors.dense(2.0, 4.0, 12.0), "foo", 3),
        (Vectors.dense(2.0, 4.0, 14.0), "foo", 2),
        (Vectors.dense(2.0, 4.0, 16.0), "foo", 1),
        (Vectors.dense(2.0, 4.0, 18.0), "foo", 4),
        (Vectors.dense(2.0, 4.0, 20.0), "foo", 4),
    ],
    ["features", "values", "labels"],
)

cnn = ConditionalKNN().setOutputCol("prediction")
cnnm = cnn.fit(df)

test_df = spark.createDataFrame(
    [
        (Vectors.dense(2.0, 2.0, 2.0), "foo", 1, [0, 1]),
        (Vectors.dense(2.0, 2.0, 4.0), "foo", 4, [0, 1]),
        (Vectors.dense(2.0, 2.0, 6.0), "foo", 2, [0, 1]),
        (Vectors.dense(2.0, 2.0, 8.0), "foo", 4, [0, 1]),
        (Vectors.dense(2.0, 2.0, 10.0), "foo", 4, [0, 1]),
    ],
    ["features", "values", "labels", "conditioner"],
)

display(cnnm.transform(test_df))
```

This code should log one run with a ConditionalKNNModel artifact and its parameters.
<img src="https://mmlspark.blob.core.windows.net/graphics/autologgingRunSample.png" width="1200" />
```

--------------------------------------------------------------------------------

---[FILE: collect_system_metrics.py]---
Location: mlflow-master/examples/system_metrics/collect_system_metrics.py

```python
import time

import mlflow

if __name__ == "__main__":
    mlflow.enable_system_metrics_logging()
    with mlflow.start_run() as run:
        time.sleep(11)

    client = mlflow.MlflowClient()
    mlflow_run = client.get_run(run.info.run_id)
    print(mlflow_run.data.metrics)
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/examples/tensorflow/conda.yaml

```yaml
name: tutorial
channels:
  - conda-forge
dependencies:
  - python=3.8
  - pip
  - pip:
      - mlflow>=2.0
      - tensorflow>=2.8
```

--------------------------------------------------------------------------------

---[FILE: MLProject]---
Location: mlflow-master/examples/tensorflow/MLProject

```text
name: tensorflow_linear_regression_example

python_env: python_env.yaml

entry_points:
  main:
    command: "python train.py"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/tensorflow/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow>=2.0
  - tensorflow>=2.8
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/tensorflow/train.py

```python
# tensorflow 2.x core api
import tensorflow as tf
from sklearn.datasets import fetch_california_housing

import mlflow
from mlflow.models import infer_signature


class Normalize(tf.Module):
    """Data Normalization class"""

    def __init__(self, x):
        # Initialize the mean and standard deviation for normalization
        self.mean = tf.math.reduce_mean(x, axis=0)
        self.std = tf.math.reduce_std(x, axis=0)

    def norm(self, x):
        return (x - self.mean) / self.std

    def unnorm(self, x):
        return (x * self.std) + self.mean


class LinearRegression(tf.Module):
    """Linear Regression model class"""

    def __init__(self):
        self.built = False

    @tf.function
    def __call__(self, x):
        # Initialize the model parameters on the first call
        if not self.built:
            # Randomly generate the weight vector and bias term
            rand_w = tf.random.uniform(shape=[x.shape[-1], 1])
            rand_b = tf.random.uniform(shape=[])
            self.w = tf.Variable(rand_w)
            self.b = tf.Variable(rand_b)
            self.built = True
        y = tf.add(tf.matmul(x, self.w), self.b)
        return tf.squeeze(y, axis=1)


class ExportModule(tf.Module):
    """Exporting TF model"""

    def __init__(self, model, norm_x, norm_y):
        # Initialize pre and postprocessing functions
        self.model = model
        self.norm_x = norm_x
        self.norm_y = norm_y

    @tf.function(input_signature=[tf.TensorSpec(shape=[None, None], dtype=tf.float32)])
    def __call__(self, x):
        # Run the ExportModule for new data points
        x = self.norm_x.norm(x)
        y = self.model(x)
        y = self.norm_y.unnorm(y)
        return y


def mse_loss(y_pred, y):
    """Calculating Mean Square Error Loss function"""
    return tf.reduce_mean(tf.square(y_pred - y))


if __name__ == "__main__":
    # Set a random seed for reproducible results
    tf.random.set_seed(42)

    # Load dataset
    dataset = fetch_california_housing(as_frame=True)["frame"]
    # Drop missing values
    dataset = dataset.dropna()
    # using only 1500
    dataset = dataset[:1500]
    dataset_tf = tf.convert_to_tensor(dataset, dtype=tf.float32)

    # Split dataset into train and test
    dataset_shuffled = tf.random.shuffle(dataset_tf, seed=42)
    train_data = dataset_shuffled[100:]
    test_data = dataset_shuffled[:100]
    x_train = train_data[:, :-1]
    y_train = train_data[:, -1]
    x_test = test_data[:, :-1]
    y_test = test_data[:, -1]
    # Data normalization
    norm_x = Normalize(x_train)
    norm_y = Normalize(y_train)
    x_train_norm = norm_x.norm(x_train)
    y_train_norm = norm_y.norm(y_train)
    x_test_norm = norm_x.norm(x_test)
    y_test_norm = norm_y.norm(y_test)

    with mlflow.start_run():
        # Initialize linear regression model
        lin_reg = LinearRegression()

        # Use mini batches for memory efficiency and faster convergence
        batch_size = 32
        train_dataset = tf.data.Dataset.from_tensor_slices((x_train_norm, y_train_norm))
        train_dataset = train_dataset.shuffle(buffer_size=x_train.shape[0]).batch(batch_size)
        test_dataset = tf.data.Dataset.from_tensor_slices((x_test_norm, y_test_norm))
        test_dataset = test_dataset.shuffle(buffer_size=x_test.shape[0]).batch(batch_size)

        # Set training parameters
        epochs = 100
        learning_rate = 0.01
        train_losses = []
        test_losses = []

        # Format training loop
        for epoch in range(epochs):
            batch_losses_train = []
            batch_losses_test = []

            # Iterate through the training data
            for x_batch, y_batch in train_dataset:
                with tf.GradientTape() as tape:
                    y_pred_batch = lin_reg(x_batch)
                    batch_loss = mse_loss(y_pred_batch, y_batch)
                # Update parameters with respect to the gradient calculations
                grads = tape.gradient(batch_loss, lin_reg.variables)
                for g, v in zip(grads, lin_reg.variables):
                    v.assign_sub(learning_rate * g)
                # Keep track of batch-level training performance
                batch_losses_train.append(batch_loss)

            # Iterate through the testing data
            for x_batch, y_batch in test_dataset:
                y_pred_batch = lin_reg(x_batch)
                batch_loss = mse_loss(y_pred_batch, y_batch)
                # Keep track of batch-level testing performance
                batch_losses_test.append(batch_loss)

            # Keep track of epoch-level model performance
            train_loss = tf.reduce_mean(batch_losses_train)
            test_loss = tf.reduce_mean(batch_losses_test)
            train_losses.append(train_loss)
            test_losses.append(test_loss)
            if epoch % 10 == 0:
                mlflow.log_metric(key="train_losses", value=train_loss, step=epoch)
                mlflow.log_metric(key="test_losses", value=test_loss, step=epoch)
                print(f"Mean squared error for step {epoch}: {train_loss.numpy():0.3f}")

        # Log the parameters
        mlflow.log_params(
            {
                "epochs": epochs,
                "learning_rate": learning_rate,
                "batch_size": batch_size,
            }
        )
        # Log the final metrics
        mlflow.log_metrics(
            {
                "final_train_loss": train_loss.numpy(),
                "final_test_loss": test_loss.numpy(),
            }
        )
        print(f"\nFinal train loss: {train_loss:0.3f}")
        print(f"Final test loss: {test_loss:0.3f}")

        # Export the tensorflow model
        lin_reg_export = ExportModule(model=lin_reg, norm_x=norm_x, norm_y=norm_y)

        # Infer model signature
        predictions = lin_reg_export(x_test)
        signature = infer_signature(x_test.numpy(), predictions.numpy())

        mlflow.tensorflow.log_model(lin_reg_export, name="model", signature=signature)
```

--------------------------------------------------------------------------------

---[FILE: client.py]---
Location: mlflow-master/examples/tracing/client.py

```python
"""
This example demonstrates how to create a trace with multiple spans using the low-level MLflow client APIs.
"""

import mlflow

exp = mlflow.set_experiment("mlflow-tracing-example")
exp_id = exp.experiment_id

# Initialize MLflow client.
client = mlflow.MlflowClient()


def run(x: int, y: int) -> int:
    # Create a trace. The `start_trace` API returns a root span of the trace.
    root_span = client.start_trace(
        name="my_trace",
        inputs={"x": x, "y": y},
        # Tags are key-value pairs associated with the trace.
        # You can update the tags later using `client.set_trace_tag` API.
        tags={
            "fruit": "apple",
            "vegetable": "carrot",
        },
    )

    z = x + y

    # Trace ID is a unique identifier for the trace. You will need this ID
    # to interact with the trace later using the MLflow client.
    trace_id = root_span.trace_id

    # Create a child span of the root span.
    child_span = client.start_span(
        name="child_span",
        # Specify the trace ID to which the child span belongs.
        trace_id=trace_id,
        # Also specify the ID of the parent span to build the span hierarchy.
        # You can access the span ID via `span_id` property of the span object.
        parent_id=root_span.span_id,
        # Each span has its own inputs.
        inputs={"z": z},
        # Attributes are key-value pairs associated with the span.
        attributes={
            "model": "my_model",
            "temperature": 0.5,
        },
    )

    z = z**2

    # End the child span. Please make sure to end the child span before ending the root span.
    client.end_span(
        trace_id=trace_id,
        span_id=child_span.span_id,
        # Set the output(s) of the span.
        outputs=z,
        # Set the completion status, such as "OK" (default), "ERROR", etc.
        status="OK",
    )

    z = z + 1

    # End the root span.
    client.end_trace(
        trace_id=trace_id,
        # Set the output(s) of the span.
        outputs=z,
    )

    return z


assert run(1, 2) == 10

# Retrieve the trace just created using get_last_active_trace_id() API.
trace_id = mlflow.get_last_active_trace_id()
trace = client.get_trace(trace_id)

# Alternatively, you can use search_traces() API
# to retrieve the traces from the tracking server.
trace = client.search_traces(experiment_ids=[exp_id])[0]
assert trace.info.tags["fruit"] == "apple"
assert trace.info.tags["vegetable"] == "carrot"

# Update the tags using set_trace_tag() and delete_trace_tag() APIs.
client.set_trace_tag(trace.info.trace_id, "fruit", "orange")
client.delete_trace_tag(trace.info.trace_id, "vegetable")

trace = client.get_trace(trace.info.trace_id)
assert trace.info.tags["fruit"] == "orange"
assert "vegetable" not in trace.info.tags

# Print the trace in JSON format
print(trace.to_json(pretty=True))

print(
    "\033[92m"
    + "🤖Now run `mlflow server` and open MLflow UI to see the trace visualization!"
    + "\033[0m"
)
```

--------------------------------------------------------------------------------

---[FILE: fluent.py]---
Location: mlflow-master/examples/tracing/fluent.py

```python
"""
This example demonstrates how to create a trace with multiple spans using the high-level MLflow fluent APIs.
"""

import mlflow

mlflow.set_experiment("mlflow-tracing-example")


# Decorating the function with `@mlflow.trace` decorator is the easiest way to trace your function.
# MLflow will create a trace for function calls and automatically
# captures function name, inputs, output, and more.
@mlflow.trace
def f1(x: int) -> int:
    return x + 1


# You can also specify additional metadata for the trace
@mlflow.trace(
    span_type="math",
    attributes={"operation": "addition"},
)
def f2(x: int) -> int:
    # MLflow keeps track of the call hierarchy. Calling `f1` inside
    # `f2` will create a child span `f1` under the `f2` span.
    x = f1(x) + 2

    # You can also create a span for an arbitrary block of code using `with mlflow.start_span` context manager.
    with mlflow.start_span(name="leaf", attributes={"operation": "exponentiation"}) as span:
        # Inputs and outputs need to be set explicitly for manually created spans.
        span.set_inputs({"x": x})
        x = x**2
        span.set_outputs({"x": x})

    return x


assert f2(1) == 16

# You can access the last trace via get_last_active_trace_id API.
trace_id = mlflow.get_last_active_trace_id()
trace = mlflow.get_trace(trace_id)

# Alternatively, you can use `search_traces` API to retrieve
# traces that meet certain criteria.
traces = mlflow.search_traces(
    filter_string="timestamp > 0",
    max_results=1,
)

# Print the trace in JSON format
print(trace.to_json(pretty=True))

print(
    "\033[92m"
    + "🤖Now run `mlflow server` and open MLflow UI to see the trace visualization!"
    + "\033[0m"
)
```

--------------------------------------------------------------------------------

---[FILE: langchain_auto.py]---
Location: mlflow-master/examples/tracing/langchain_auto.py

```python
"""
This example demonstrates how to enable automatic tracing for LangChain.

Note: this example requires the `langchain` and `langchain-openai` package to be installed.
"""

import json
import os

from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain_openai import OpenAI

import mlflow

exp = mlflow.set_experiment("mlflow-tracing-langchain")
exp_id = exp.experiment_id

# This example uses OpenAI LLM. If you want to use other LLMs, you can
# uncomment the following line and replace `OpenAI` with the desired LLM class.
assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."


# You can enable automatic tracing for LangChain by simply calling `mlflow langchain.autolog()`.
# (Note: By default this only enables tracing and does not log any other artifacts such as
#  models, dataset, etc. To enable auto logging of other artifacts, please refer to the example
#  at examples/langchain/chain_autolog.py)
mlflow.langchain.autolog()

# Build a simple chain
prompt = PromptTemplate(
    input_variables=["question"], template="Please answer this question: {question}"
)
llm = OpenAI(temperature=0.9)
chain = prompt | llm | StrOutputParser()

# Invoke the chain. Each invocation will generate a new trace.
chain.invoke({"question": "What is the capital of Japan?"})
chain.invoke({"question": "How many animals are there in the world?"})
chain.invoke({"question": "Who is the first person to land on the moon?"})

# Retrieve the traces
traces = mlflow.search_traces(experiment_ids=[exp_id], max_results=3, return_type="list")
print(json.dumps([t.to_dict() for t in traces], indent=2))

print(
    "\033[92m"
    + "🤖Now run `mlflow server` and open MLflow UI to see the trace visualization!"
    + "\033[0m"
)
```

--------------------------------------------------------------------------------

---[FILE: multithreading.py]---
Location: mlflow-master/examples/tracing/multithreading.py

```python
"""
This example demonstrates how to create a trace to track the execution of a multi-threaded application.

To trace a multi-threaded operation, you need to use the low-level MLflow client APIs to create a trace and spans, because the high-level fluent APIs are not thread-safe.
"""

import contextvars
from concurrent.futures import ThreadPoolExecutor, as_completed

import openai

import mlflow

exp = mlflow.set_experiment("mlflow-tracing-example")
exp_id = exp.experiment_id

client = openai.OpenAI()

# Enable MLflow Tracing for OpenAI
mlflow.openai.autolog()


@mlflow.trace
def worker(question: str) -> str:
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": question},
    ]
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.1,
        max_tokens=100,
    )
    return response.choices[0].message.content


@mlflow.trace
def main(questions: list[str]) -> list[str]:
    results = []
    # Almost same as how you would use ThreadPoolExecutor, but two additional steps
    #  1. Copy the context in the main thread using copy_context()
    #  2. Use ctx.run() to run the worker in the copied context
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = []
        for question in questions:
            ctx = contextvars.copy_context()
            futures.append(executor.submit(ctx.run, worker, question))
        results.extend(future.result() for future in as_completed(futures))
    return results


questions = [
    "What is the capital of France?",
    "What is the capital of Germany?",
]

main(questions)

print(
    "\033[92m"
    + "🤖Now run `mlflow server` and open MLflow UI to see the trace visualization!"
    + "\033[0m"
)
```

--------------------------------------------------------------------------------

---[FILE: conversational.py]---
Location: mlflow-master/examples/transformers/conversational.py

```python
import transformers

import mlflow

conversational_pipeline = transformers.pipeline(model="microsoft/DialoGPT-medium")

signature = mlflow.models.infer_signature(
    "Hi there, chatbot!",
    mlflow.transformers.generate_signature_output(conversational_pipeline, "Hi there, chatbot!"),
)

with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model=conversational_pipeline,
        name="chatbot",
        task="conversational",
        signature=signature,
        input_example="A clever and witty question",
    )

# Load the conversational pipeline as an interactive chatbot

chatbot = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)

first = chatbot.predict("What is the best way to get to Antarctica?")

print(f"Response: {first}")

second = chatbot.predict("What kind of boat should I use?")

print(f"Response: {second}")
```

--------------------------------------------------------------------------------

---[FILE: load_components.py]---
Location: mlflow-master/examples/transformers/load_components.py

```python
import transformers

import mlflow

translation_pipeline = transformers.pipeline(
    task="translation_en_to_fr",
    model=transformers.T5ForConditionalGeneration.from_pretrained("t5-small"),
    tokenizer=transformers.T5TokenizerFast.from_pretrained("t5-small", model_max_length=100),
)

signature = mlflow.models.infer_signature(
    "Hi there, chatbot!",
    mlflow.transformers.generate_signature_output(translation_pipeline, "Hi there, chatbot!"),
)

with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model=translation_pipeline,
        name="french_translator",
        signature=signature,
    )

translation_components = mlflow.transformers.load_model(
    model_info.model_uri, return_type="components"
)

for key, value in translation_components.items():
    print(f"{key} -> {type(value).__name__}")

response = translation_pipeline("MLflow is great!")

print(response)

reconstructed_pipeline = transformers.pipeline(**translation_components)

reconstructed_response = reconstructed_pipeline(
    "transformers makes using Deep Learning models easy and fun!"
)

print(reconstructed_response)
```

--------------------------------------------------------------------------------

````
