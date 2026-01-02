---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 195
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 195 of 991)

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

---[FILE: chat_completions.py]---
Location: mlflow-master/examples/openai/chat_completions.py

```python
import logging
import os

import openai
import pandas as pd

import mlflow
from mlflow.models.signature import ModelSignature
from mlflow.types.schema import ColSpec, ParamSchema, ParamSpec, Schema

logging.getLogger("mlflow").setLevel(logging.ERROR)

# Uncomment the following lines to run this script without using a real OpenAI API key.
# os.environ["MLFLOW_TESTING"] = "true"
# os.environ["OPENAI_API_KEY"] = "test"

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."


print(
    """
# ******************************************************************************
# Single variable
# ******************************************************************************
"""
)
with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[{"role": "user", "content": "Tell me a joke about {animal}."}],
    )


model = mlflow.pyfunc.load_model(model_info.model_uri)
df = pd.DataFrame(
    {
        "animal": [
            "cats",
            "dogs",
        ]
    }
)
print(model.predict(df))

list_of_dicts = [
    {"animal": "cats"},
    {"animal": "dogs"},
]
print(model.predict(list_of_dicts))

list_of_strings = [
    "cats",
    "dogs",
]
print(model.predict(list_of_strings))
print(
    """
# ******************************************************************************
# Multiple variables
# ******************************************************************************
"""
)
with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[{"role": "user", "content": "Tell me a {adjective} joke about {animal}."}],
    )


model = mlflow.pyfunc.load_model(model_info.model_uri)
df = pd.DataFrame(
    {
        "adjective": ["funny", "scary"],
        "animal": ["cats", "dogs"],
    }
)
print(model.predict(df))


list_of_dicts = [
    {"adjective": "funny", "animal": "cats"},
    {"adjective": "scary", "animal": "dogs"},
]
print(model.predict(list_of_dicts))

print(
    """
# ******************************************************************************
# Multiple prompts
# ******************************************************************************
"""
)
with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[
            {"role": "system", "content": "You are {person}"},
            {"role": "user", "content": "Let me hear your thoughts on {topic}"},
        ],
    )


model = mlflow.pyfunc.load_model(model_info.model_uri)
df = pd.DataFrame(
    {
        "person": ["Elon Musk", "Jeff Bezos"],
        "topic": ["AI", "ML"],
    }
)
print(model.predict(df))

list_of_dicts = [
    {"person": "Elon Musk", "topic": "AI"},
    {"person": "Jeff Bezos", "topic": "ML"},
]
print(model.predict(list_of_dicts))


print(
    """
# ******************************************************************************
# No input variables
# ******************************************************************************
"""
)
with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[{"role": "system", "content": "You are Elon Musk"}],
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
df = pd.DataFrame(
    {
        "question": [
            "Let me hear your thoughts on AI",
            "Let me hear your thoughts on ML",
        ],
    }
)
print(model.predict(df))

list_of_dicts = [
    {"question": "Let me hear your thoughts on AI"},
    {"question": "Let me hear your thoughts on ML"},
]
model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(list_of_dicts))

list_of_strings = [
    "Let me hear your thoughts on AI",
    "Let me hear your thoughts on ML",
]
model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(list_of_strings))


print(
    """
# ******************************************************************************
# Inference parameters with chat completions
# ******************************************************************************
"""
)
with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[{"role": "user", "content": "Tell me a joke about {animal}."}],
        signature=ModelSignature(
            inputs=Schema([ColSpec(type="string", name=None)]),
            outputs=Schema([ColSpec(type="string", name=None)]),
            params=ParamSchema(
                [
                    ParamSpec(name="temperature", default=0, dtype="float"),
                ]
            ),
        ),
    )


model = mlflow.pyfunc.load_model(model_info.model_uri)
df = pd.DataFrame(
    {
        "animal": [
            "cats",
            "dogs",
        ]
    }
)
print(model.predict(df, params={"temperature": 1}))
```

--------------------------------------------------------------------------------

---[FILE: completions.py]---
Location: mlflow-master/examples/openai/completions.py

```python
import os

import openai

import mlflow
from mlflow.models.signature import ModelSignature
from mlflow.types.schema import ColSpec, ParamSchema, ParamSpec, Schema

assert "OPENAI_API_KEY" in os.environ, " OPENAI_API_KEY environment variable must be set"

print(
    """
# ******************************************************************************
# Completions indicating prompt template
# ******************************************************************************
"""
)

with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="text-davinci-002",
        task=openai.completions,
        name="model",
        prompt="Classify the following tweet's sentiment: '{tweet}'.",
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(["I believe in a better world"]))


print(
    """
# ******************************************************************************
# Completions using inference parameters
# ******************************************************************************
"""
)
with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="text-davinci-002",
        task=openai.completions,
        name="model",
        prompt="Classify the following tweet's sentiment: '{tweet}'.",
        signature=ModelSignature(
            inputs=Schema([ColSpec(type="string", name=None)]),
            outputs=Schema([ColSpec(type="string", name=None)]),
            params=ParamSchema(
                [
                    ParamSpec(name="max_tokens", default=16, dtype="long"),
                    ParamSpec(name="temperature", default=0, dtype="float"),
                    ParamSpec(name="best_of", default=1, dtype="long"),
                ]
            ),
        ),
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(["I believe in a better world"], params={"temperature": 1, "best_of": 5}))
```

--------------------------------------------------------------------------------

---[FILE: embeddings.py]---
Location: mlflow-master/examples/openai/embeddings.py

```python
import os

import numpy as np
import openai

import mlflow
from mlflow.models.signature import ModelSignature
from mlflow.types.schema import ColSpec, ParamSchema, ParamSpec, Schema, TensorSpec

assert "OPENAI_API_KEY" in os.environ, " OPENAI_API_KEY environment variable must be set"


print(
    """
# ******************************************************************************
# Text embeddings
# ******************************************************************************
"""
)

with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="text-embedding-ada-002",
        task=openai.embeddings,
        name="model",
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(["hello", "world"]))


print(
    """
# ******************************************************************************
# Text embeddings with batch_size parameter
# ******************************************************************************
"""
)

with mlflow.start_run():
    mlflow.openai.log_model(
        model="text-embedding-ada-002",
        task=openai.embeddings,
        name="model",
        signature=ModelSignature(
            inputs=Schema([ColSpec(type="string", name=None)]),
            outputs=Schema([TensorSpec(type=np.dtype("float64"), shape=(-1,))]),
            params=ParamSchema([ParamSpec(name="batch_size", dtype="long", default=1024)]),
        ),
    )

model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(["hello", "world"], params={"batch_size": 16}))
```

--------------------------------------------------------------------------------

---[FILE: spark_udf.py]---
Location: mlflow-master/examples/openai/spark_udf.py

```python
import os

import openai
from pyspark.sql import SparkSession

import mlflow

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."

with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        messages=[{"role": "user", "content": "Tell me a {adjective} joke about {animal}."}],
        name="model",
    )

with SparkSession.builder.getOrCreate() as spark:
    spark_udf = mlflow.pyfunc.spark_udf(
        spark=spark, model_uri=model_info.model_uri, result_type="string"
    )
    df = spark.createDataFrame(
        [
            ("funny", "cats"),
            ("scary", "dogs"),
            ("sad", "rabbits"),
        ],
        ["adjective", "animal"],
    )
    df.withColumn("answer", spark_udf("adjective", "animal")).show()
```

--------------------------------------------------------------------------------

---[FILE: instantiated_client.py]---
Location: mlflow-master/examples/openai/autologging/instantiated_client.py

```python
import argparse
import os

import openai

import mlflow

mlflow.openai.autolog(
    log_input_examples=True,
    log_model_signatures=True,
    log_models=True,
    registered_model_name="openai_model",
)

parser = argparse.ArgumentParser()
parser.add_argument("--api-key", type=str, help="OpenAI API key")
args = parser.parse_args()
api_key = args.api_key

client = openai.OpenAI(api_key=api_key)

messages = [
    {
        "role": "user",
        "content": "tell me a joke in 50 words",
    }
]

output = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    temperature=0,
)
print(output)

# We automatically log the model and trace related artifacts
# A model with name `openai_model` is registered, we can load it back as a PyFunc model
# Note that the logged model does not contain any credentials. So, to use the loaded model,
# you will still need to configure the OpenAI API key as an environment variable.
os.environ["OPENAI_API_KEY"] = api_key
model_name = "openai_model"
model_version = 1
loaded_model = mlflow.pyfunc.load_model(f"models:/{model_name}/{model_version}")
print(loaded_model.predict("what is the capital of France?"))
```

--------------------------------------------------------------------------------

---[FILE: module_client.py]---
Location: mlflow-master/examples/openai/autologging/module_client.py

```python
import os

import openai

import mlflow

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."

mlflow.openai.autolog(
    log_input_examples=True,
    log_model_signatures=True,
    log_models=True,
    registered_model_name="openai_model",
)

messages = [
    {
        "role": "user",
        "content": "tell me a joke in 50 words",
    }
]

output = openai.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    temperature=0,
)
print(output)

# We automatically log the model and trace related artifacts
# A model with name `openai_model` is registered, we can load it back as a PyFunc model
model_name = "openai_model"
model_version = 1
loaded_model = mlflow.pyfunc.load_model(f"models:/{model_name}/{model_version}")
print(loaded_model.predict("what is the capital of France?"))
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/openai/autologging/README.md

```text
# OpenAI Autologging Examples

## Using OpenAI client

The recommended way of using `openai` is to instantiate a client
using `openai.OpenAI()`. You can run the following example to use
autologging using such client.

Before running these examples, ensure that you have the following additional libraries installed:

```shell
pip install tenacity tiktoken 'openai>=1.17'
```

You can run the example via your command prompt as follows:

```shell
python examples/openai/autologging/instantiated_client.py --api-key="your-api-key"
```

## Using module-level client

`openai` exposes a module client instance that can be used to make requests.
You can run the following example to use autologging with the module client.

```shell
export OPENAI_API_KEY="your-api-key"
python examples/openai/autologging/module_client.py
```
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/paddle/MLproject

```text
name: paddlepaddle

python_env: python_env.yaml

entry_points:
  main:
    command: "python train.py"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/paddle/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - paddlepaddle==2.1.0
  - cloudpickle==1.6.0
```

--------------------------------------------------------------------------------

---[FILE: train_high_level_api.py]---
Location: mlflow-master/examples/paddle/train_high_level_api.py

```python
import numpy as np
import paddle

import mlflow.paddle

train_dataset = paddle.text.datasets.UCIHousing(mode="train")
eval_dataset = paddle.text.datasets.UCIHousing(mode="test")


class UCIHousing(paddle.nn.Layer):
    def __init__(self):
        super().__init__()
        self.fc_ = paddle.nn.Linear(13, 1, None)

    def forward(self, inputs):
        pred = self.fc_(inputs)
        return pred


model = paddle.Model(UCIHousing())
optim = paddle.optimizer.Adam(learning_rate=0.01, parameters=model.parameters())
model.prepare(optim, paddle.nn.MSELoss())

model.fit(train_dataset, epochs=6, batch_size=8, verbose=1)

with mlflow.start_run() as run:
    mlflow.paddle.log_model(model, name="model")
    print(f"Model saved in run {run.info.run_id}")

    # load model
    model_path = mlflow.get_artifact_uri("model")
    pd_model = mlflow.paddle.load_model(model_path)
    np_test_data = np.array([x[0] for x in eval_dataset])
    print(pd_model(np_test_data))
```

--------------------------------------------------------------------------------

---[FILE: train_low_level_api.py]---
Location: mlflow-master/examples/paddle/train_low_level_api.py

```python
import numpy as np
import paddle
import paddle.nn.functional as F
from paddle.nn import Linear
from sklearn import preprocessing
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

import mlflow.paddle


def load_data():
    X, y = load_diabetes(return_X_y=True)

    min_max_scaler = preprocessing.MinMaxScaler()
    X_min_max = min_max_scaler.fit_transform(X)
    X_normalized = preprocessing.scale(X_min_max, with_std=False)

    X_train, X_test, y_train, y_test = train_test_split(
        X_normalized, y, test_size=0.2, random_state=42
    )

    y_train = y_train.reshape(-1, 1)
    y_test = y_test.reshape(-1, 1)
    return np.concatenate((X_train, y_train), axis=1), np.concatenate((X_test, y_test), axis=1)


class Regressor(paddle.nn.Layer):
    def __init__(self):
        super().__init__()

        self.fc = Linear(in_features=13, out_features=1)

    @paddle.jit.to_static
    def forward(self, inputs):
        x = self.fc(inputs)
        return x


if __name__ == "__main__":
    model = Regressor()
    model.train()
    training_data, test_data = load_data()

    opt = paddle.optimizer.SGD(learning_rate=0.01, parameters=model.parameters())

    EPOCH_NUM = 10
    BATCH_SIZE = 10

    for epoch_id in range(EPOCH_NUM):
        np.random.shuffle(training_data)
        mini_batches = [
            training_data[k : k + BATCH_SIZE] for k in range(0, len(training_data), BATCH_SIZE)
        ]
        for iter_id, mini_batch in enumerate(mini_batches):
            x = np.array(mini_batch[:, :-1]).astype("float32")
            y = np.array(mini_batch[:, -1:]).astype("float32")
            house_features = paddle.to_tensor(x)
            prices = paddle.to_tensor(y)

            predicts = model(house_features)

            loss = F.square_error_cost(predicts, label=prices)
            avg_loss = paddle.mean(loss)
            if iter_id % 20 == 0:
                print(f"epoch: {epoch_id}, iter: {iter_id}, loss is: {avg_loss.numpy()}")

            avg_loss.backward()
            opt.step()
            opt.clear_grad()

    with mlflow.start_run() as run:
        mlflow.log_param("learning_rate", 0.01)
        mlflow.paddle.log_model(model, name="model")
        print(f"Model saved in run {mlflow.active_run().info.run_id}")

        # load model
        model_path = mlflow.get_artifact_uri("model")
        pd_model = mlflow.paddle.load_model(model_path)
        np_test_data = np.array(test_data).astype("float32")
        print(pd_model(np_test_data[:, :-1]))
```

--------------------------------------------------------------------------------

---[FILE: pip_requirements.py]---
Location: mlflow-master/examples/pip_requirements/pip_requirements.py

```python
"""
This example demonstrates how to specify pip requirements using `pip_requirements` and
`extra_pip_requirements` when logging a model via `mlflow.*.log_model`.
"""

import tempfile

import sklearn
import xgboost as xgb
from sklearn.datasets import load_iris

import mlflow
from mlflow.artifacts import download_artifacts
from mlflow.models.signature import infer_signature


def read_lines(path):
    with open(path) as f:
        return f.read().splitlines()


def get_pip_requirements(artifact_uri, return_constraints=False):
    req_path = download_artifacts(artifact_uri=f"{artifact_uri}/requirements.txt")
    reqs = read_lines(req_path)

    if return_constraints:
        con_path = download_artifacts(artifact_uri=f"{artifact_uri}/constraints.txt")
        cons = read_lines(con_path)
        return set(reqs), set(cons)

    return set(reqs)


def main():
    iris = load_iris()
    dtrain = xgb.DMatrix(iris.data, iris.target)
    model = xgb.train({}, dtrain)
    predictions = model.predict(dtrain)
    signature = infer_signature(dtrain.get_data(), predictions)

    xgb_req = f"xgboost=={xgb.__version__}"
    sklearn_req = f"scikit-learn=={sklearn.__version__}"

    with mlflow.start_run():
        # Default (both `pip_requirements` and `extra_pip_requirements` are unspecified)
        artifact_path = "default"
        model_info = mlflow.xgboost.log_model(model, name=artifact_path, signature=signature)
        pip_reqs = get_pip_requirements(model_info.artifact_path)
        assert xgb_req in pip_reqs, pip_reqs

        # Overwrite the default set of pip requirements using `pip_requirements`
        artifact_path = "pip_requirements"
        model_info = mlflow.xgboost.log_model(
            model, name=artifact_path, pip_requirements=[sklearn_req], signature=signature
        )
        pip_reqs = get_pip_requirements(model_info.artifact_path)
        assert sklearn_req in pip_reqs, pip_reqs

        # Add extra pip requirements on top of the default set of pip requirements
        # using `extra_pip_requirements`
        artifact_path = "extra_pip_requirements"
        model_info = mlflow.xgboost.log_model(
            model, name=artifact_path, extra_pip_requirements=[sklearn_req], signature=signature
        )
        pip_reqs = get_pip_requirements(model_info.artifact_path)
        assert pip_reqs.issuperset({xgb_req, sklearn_req}), pip_reqs

        # Specify pip requirements using a requirements file
        with tempfile.NamedTemporaryFile("w", suffix=".requirements.txt") as f:
            f.write(sklearn_req)
            f.flush()

            # Path to a pip requirements file
            artifact_path = "requirements_file_path"
            model_info = mlflow.xgboost.log_model(
                model, name=artifact_path, pip_requirements=f.name, signature=signature
            )
            pip_reqs = get_pip_requirements(model_info.artifact_path)
            assert sklearn_req in pip_reqs, pip_reqs

            # List of pip requirement strings
            artifact_path = "requirements_file_list"
            model_info = mlflow.xgboost.log_model(
                model,
                name=artifact_path,
                pip_requirements=[xgb_req, f"-r {f.name}"],
                signature=signature,
            )
            pip_reqs = get_pip_requirements(model_info.artifact_path)
            assert pip_reqs.issuperset({xgb_req, sklearn_req}), pip_reqs

        # Using a constraints file
        with tempfile.NamedTemporaryFile("w", suffix=".constraints.txt") as f:
            f.write(sklearn_req)
            f.flush()

            artifact_path = "constraints_file"
            model_info = mlflow.xgboost.log_model(
                model,
                name=artifact_path,
                pip_requirements=[xgb_req, f"-c {f.name}"],
                signature=signature,
            )
            pip_reqs, pip_cons = get_pip_requirements(
                model_info.artifact_path, return_constraints=True
            )
            assert pip_reqs.issuperset({xgb_req, "-c constraints.txt"}), pip_reqs
            assert pip_cons == {sklearn_req}, pip_cons


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/pmdarima/MLproject

```text
name: pmdarima-example
python_env: python_env.yaml
entry_points:
  main:
    command: "python train.py"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/pmdarima/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - pmdarima
  - mlflow>=1.23.1
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/pmdarima/train.py

```python
import json

import numpy as np
from pmdarima import auto_arima, model_selection
from pmdarima.datasets import load_wineind

import mlflow
from mlflow.models import infer_signature

ARTIFACT_PATH = "model"


def calculate_cv_metrics(model, endog, metric, cv):
    cv_metric = model_selection.cross_val_score(model, endog, cv=cv, scoring=metric, verbose=0)
    return cv_metric[~np.isnan(cv_metric)].mean()


with mlflow.start_run():
    data = load_wineind()

    train, test = model_selection.train_test_split(data, train_size=150)

    print("Training AutoARIMA model...")
    arima = auto_arima(
        train,
        error_action="ignore",
        trace=False,
        suppress_warnings=True,
        maxiter=5,
        seasonal=True,
        m=12,
    )

    print("Model trained. \nExtracting parameters...")
    parameters = arima.get_params(deep=True)

    metrics = {x: getattr(arima, x)() for x in ["aicc", "aic", "bic", "hqic", "oob"]}

    # Cross validation backtesting
    cross_validator = model_selection.RollingForecastCV(h=10, step=20, initial=60)

    for x in ["smape", "mean_absolute_error", "mean_squared_error"]:
        metrics[x] = calculate_cv_metrics(arima, data, x, cross_validator)

    print(f"Metrics: \n{json.dumps(metrics, indent=2)}")
    print(f"Parameters: \n{json.dumps(parameters, indent=2)}")

    predictions = arima.predict(n_periods=30, return_conf_int=False)
    signature = infer_signature(train, predictions)

    model_info = mlflow.pmdarima.log_model(
        pmdarima_model=arima, name=ARTIFACT_PATH, signature=signature
    )
    mlflow.log_params(parameters)
    mlflow.log_metrics(metrics)

    print(f"Model artifact logged to: {model_info.model_uri}")

loaded_model = mlflow.pmdarima.load_model(model_info.model_uri)

forecast = loaded_model.predict(30)

print(f"Forecast: \n{forecast}")
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/prophet/MLproject

```text
name: prophet_example

python_env: python_env.yaml

entry_points:
  main:
    command: "python train.py"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/prophet/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - prophet>=1.0.1
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/prophet/train.py

```python
import numpy as np
import pandas as pd
from prophet import Prophet, serialize
from prophet.diagnostics import cross_validation, performance_metrics

import mlflow

SOURCE_DATA = (
    "https://raw.githubusercontent.com/facebook/prophet/master/examples/example_retail_sales.csv"
)
np.random.seed(12345)


def extract_params(pr_model):
    params = {attr: getattr(pr_model, attr) for attr in serialize.SIMPLE_ATTRIBUTES}
    return {k: v for k, v in params.items() if isinstance(v, (int, float, str, bool))}


sales_data = pd.read_csv(SOURCE_DATA)

with mlflow.start_run():
    model = Prophet().fit(sales_data)

    params = extract_params(model)

    metrics_raw = cross_validation(
        model=model,
        horizon="365 days",
        period="180 days",
        initial="710 days",
        parallel="threads",
        disable_tqdm=True,
    )

    cv_metrics = performance_metrics(metrics_raw)
    metrics = cv_metrics.drop(columns=["horizon"]).mean().to_dict()

    # The training data can be retrieved from the fit model for convenience
    train = model.history

    model_info = mlflow.prophet.log_model(
        model, name="prophet_model", input_example=train[["ds"]].head(10)
    )
    mlflow.log_params(params)
    mlflow.log_metrics(metrics)


loaded_model = mlflow.prophet.load_model(model_info.model_uri)

forecast = loaded_model.predict(loaded_model.make_future_dataframe(60))

forecast = forecast[["ds", "yhat"]].tail(90)

print(f"forecast:\n${forecast.head(30)}")
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/pydanticai/tracing.py
Signals: Pydantic

```python
"""
This is an example for leveraging MLflow's auto tracing capabilities for Pydantic AI.
Most codes are from https://ai.pydantic.dev/examples/bank-support/.
"""

import mlflow
import mlflow.pydantic_ai

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("Pydantic AI Example")
mlflow.pydantic_ai.autolog(disable=False)

from dataclasses import dataclass

from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext


class DatabaseConn:
    """This is a fake database for example purposes.

    In reality, you'd be connecting to an external database
    (e.g. PostgreSQL) to get information about customers.
    """

    @classmethod
    async def customer_name(cls, *, id: int) -> str | None:
        if id == 123:
            return "John"

    @classmethod
    async def customer_balance(cls, *, id: int, include_pending: bool) -> float:
        if id == 123 and include_pending:
            return 123.45
        else:
            raise ValueError("Customer not found")


@dataclass
class SupportDependencies:
    customer_id: int
    db: DatabaseConn


class SupportOutput(BaseModel):
    support_advice: str = Field(description="Advice returned to the customer")
    block_card: bool = Field(description="Whether to block their card or not")
    risk: int = Field(description="Risk level of query", ge=0, le=10)


support_agent = Agent(
    "openai:gpt-4o",
    deps_type=SupportDependencies,
    output_type=SupportOutput,
    system_prompt=(
        "You are a support agent in our bank, give the "
        "customer support and judge the risk level of their query. "
        "Reply using the customer's name."
    ),
    instrument=True,
)


@support_agent.system_prompt
async def add_customer_name(ctx: RunContext[SupportDependencies]) -> str:
    customer_name = await ctx.deps.db.customer_name(id=ctx.deps.customer_id)
    return f"The customer's name is {customer_name!r}"


@support_agent.tool
async def customer_balance(ctx: RunContext[SupportDependencies], include_pending: bool) -> str:
    """Returns the customer's current account balance."""
    balance = await ctx.deps.db.customer_balance(
        id=ctx.deps.customer_id,
        include_pending=include_pending,
    )
    return f"${balance:.2f}"


if __name__ == "__main__":
    deps = SupportDependencies(customer_id=123, db=DatabaseConn())
    result = support_agent.run_sync("What is my balance?", deps=deps)
    print(result.output)

    result = support_agent.run_sync("I just lost my card!", deps=deps)
    print(result.output)
```

--------------------------------------------------------------------------------

---[FILE: custom_code.py]---
Location: mlflow-master/examples/pyfunc/custom_code.py

```python
flower_classes = ["setosa", "versicolor", "virginica"]


def iris_classes(preds):
    return [flower_classes[x] for x in preds]
```

--------------------------------------------------------------------------------

---[FILE: infer_model_code_paths.py]---
Location: mlflow-master/examples/pyfunc/infer_model_code_paths.py

```python
from typing import Any

from custom_code import iris_classes

import mlflow


class CustomPredict(mlflow.pyfunc.PythonModel):
    """Custom pyfunc class used to create customized mlflow models"""

    def predict(self, context, model_input, params: dict[str, Any] | None = None):
        prediction = [x % 3 for x in model_input]
        return iris_classes(prediction)


with mlflow.start_run(run_name="test_custom_model_with_inferred_code_paths"):
    # log a custom model
    model_info = mlflow.pyfunc.log_model(
        name="artifacts",
        infer_code_paths=True,
        python_model=CustomPredict(),
    )
    print(f"Model URI: {model_info.model_uri}")
```

--------------------------------------------------------------------------------

---[FILE: model_as_code.py]---
Location: mlflow-master/examples/pyfunc/model_as_code.py

```python
# This example demonstrates defining a model directly from code.
# This feature allows for defining model logic within a python script, module, or notebook that is stored
# directly as serialized code, as opposed to object serialization that would otherwise occur when saving
# or logging a model object.
# This script defines the model's logic and specifies which class within the file contains the model code.
# The companion example to this, model_as_code_driver.py, is the driver code that performs the  logging and
# loading of this model definition.
import os

import pandas as pd

import mlflow
from mlflow import pyfunc

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."


class AIModel(pyfunc.PythonModel):
    @mlflow.trace(name="chain", span_type="CHAIN")
    def predict(self, context, model_input):
        if isinstance(model_input, pd.DataFrame):
            model_input = model_input["input"].tolist()

        responses = []
        for user_input in model_input:
            response = self.get_open_ai_model_response(str(user_input))
            responses.append(response.choices[0].message.content)

        return pd.DataFrame({"response": responses})

    @mlflow.trace(name="open_ai", span_type="LLM")
    def get_open_ai_model_response(self, user_input):
        from openai import OpenAI

        return OpenAI().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant. You are here to provide useful information to the user.",
                },
                {
                    "role": "user",
                    "content": user_input,
                },
            ],
        )


# IMPORTANT: The model code needs to call `mlflow.models.set_model()` to set the model,
# which will be loaded back using `mlflow.pyfunc.load_model` for inference.
mlflow.models.set_model(AIModel())
```

--------------------------------------------------------------------------------

---[FILE: model_as_code_driver.py]---
Location: mlflow-master/examples/pyfunc/model_as_code_driver.py

```python
# This is an example for logging a Python model from code using the
# mlflow.pyfunc.log_model API. When a path to a valid Python script is submitted to the
# python_model argument, the model code itself is serialized instead of the model object.
# Within the targeted script, the model implementation must be defined and set by
# using the mlflow.models.set_model API.

import pandas as pd

import mlflow

input_example = ["What is the weather like today?"]

# Specify the path to the model notebook
model_path = "model_as_code.py"
print(f"Model path: {model_path}")

print("Logging model as code using Pyfunc log model API")
with mlflow.start_run():
    model_info = mlflow.pyfunc.log_model(
        python_model=model_path,
        name="ai-model",
        input_example=input_example,
    )

print("Loading model using Pyfunc load model API")
pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)
output = pyfunc_model.predict(pd.DataFrame(input_example, columns=["input"]))
print(f"Output: {output}")
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/pyfunc/README.md

```text
# Pyfunc model example

This example demonstrates the use of a pyfunc model with custom inference logic.
More specifically:

- train a simple classification model
- create a _pyfunc_ model that encapsulates the classification model with an attached module for custom inference logic

## Structure of this example

This examples contains a `train.py` file that trains a scikit-learn model with iris dataset and uses MLflow Tracking APIs to log the model. The nested **mlflow run** delivers the packaging of `pyfunc` model and `custom_code` module is attached
to act as a custom inference logic layer in inference time.

```
├── train.py
├── infer_model_code_path.py
└── custom_code.py
```

## Running this example

1. Train and log the model

```
$ python train.py
```

or train and log the model using inferred code paths

```
$ python infer_model_code_paths.py
```

2. Serve the pyfunc model

```bash
# Replace <pyfunc_run_id> with the run ID obtained in the previous step
$ mlflow models serve -m "runs:/<pyfunc_run_id>/model" -p 5001
```

3. Send a request

```
$ curl http://127.0.0.1:5001/invocations -H 'Content-Type: application/json' -d '{
  "dataframe_records": [[1, 1, 1, 1]]
}'
```

The response should look like this:

```
[0]
```
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/pyfunc/train.py

```python
import os
from typing import Any

from custom_code import iris_classes
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

import mlflow
from mlflow.models import infer_signature


class CustomPredict(mlflow.pyfunc.PythonModel):
    """Custom pyfunc class used to create customized mlflow models"""

    def load_context(self, context):
        self.model = mlflow.sklearn.load_model(context.artifacts["custom_model"])

    def predict(self, context, model_input, params: dict[str, Any] | None = None):
        prediction = self.model.predict(model_input)
        return iris_classes(prediction)


X, y = load_iris(return_X_y=True, as_frame=True)
params = {"C": 1.0, "random_state": 42}
classifier = LogisticRegression(**params).fit(X, y)

predictions = classifier.predict(X)
signature = infer_signature(X, predictions)

with mlflow.start_run(run_name="test_pyfunc") as run:
    model_info = mlflow.sklearn.log_model(sk_model=classifier, name="model", signature=signature)

    # start a child run to create custom imagine model
    with mlflow.start_run(run_name="test_custom_model", nested=True):
        print(f"Pyfunc run ID: {run.info.run_id}")
        # log a custom model
        mlflow.pyfunc.log_model(
            name="artifacts",
            code_paths=[os.getcwd()],
            artifacts={"custom_model": model_info.model_uri},
            python_model=CustomPredict(),
            signature=signature,
        )
```

--------------------------------------------------------------------------------

---[FILE: logistic_regression.py]---
Location: mlflow-master/examples/pyspark_ml_autologging/logistic_regression.py

```python
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.feature import VectorAssembler
from pyspark.sql import SparkSession
from sklearn.datasets import load_iris

import mlflow

with SparkSession.builder.getOrCreate() as spark:
    df = load_iris(as_frame=True).frame.rename(columns={"target": "label"})
    df = spark.createDataFrame(df)
    df = VectorAssembler(inputCols=df.columns[:-1], outputCol="features").transform(df)
    train, test = df.randomSplit([0.8, 0.2])

    mlflow.pyspark.ml.autolog()
    lor = LogisticRegression(maxIter=5)

    with mlflow.start_run():
        lorModel = lor.fit(train)

    pred = lorModel.transform(test)
    pred.select(lorModel.getPredictionCol()).show(10)
```

--------------------------------------------------------------------------------

---[FILE: one_vs_rest.py]---
Location: mlflow-master/examples/pyspark_ml_autologging/one_vs_rest.py

```python
from pyspark.ml.classification import LogisticRegression, OneVsRest
from pyspark.ml.feature import VectorAssembler
from pyspark.sql import SparkSession
from sklearn.datasets import load_iris

import mlflow

with SparkSession.builder.getOrCreate() as spark:
    df = load_iris(as_frame=True).frame.rename(columns={"target": "label"})
    df = spark.createDataFrame(df)
    df = VectorAssembler(inputCols=df.columns[:-1], outputCol="features").transform(df)
    train, test = df.randomSplit([0.8, 0.2])

    mlflow.pyspark.ml.autolog()
    lor = LogisticRegression(maxIter=5)
    ovr = OneVsRest(classifier=lor)

    with mlflow.start_run():
        ovrModel = ovr.fit(train)

    pred = ovrModel.transform(test)
    pred.select(ovrModel.getPredictionCol()).show(10)
```

--------------------------------------------------------------------------------

````
