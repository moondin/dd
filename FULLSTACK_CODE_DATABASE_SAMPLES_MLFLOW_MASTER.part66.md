---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 66
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 66 of 991)

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
Location: mlflow-master/docs/docs/classic-ml/deployment/deploy-model-locally/index.mdx

```text
---
sidebar_position: 1
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";

# Deploy MLflow Model as a Local Inference Server

MLflow allows you to deploy your model locally using just a single command.
This approach is ideal for lightweight applications or for testing your model locally before moving
it to a staging or production environment.

If you are new to MLflow model deployment, please read the guide on [MLflow Deployment](/ml/deployment)
first to understand the basic concepts of MLflow models and deployments.

## Deploying Inference Server

Before deploying, you must have an MLflow Model. If you don't have one, you can create a sample scikit-learn model by following the [MLflow Tracking Quickstart](/ml/getting-started).
Remember to note down the model URI, such as `models:/<model_id>` (or `models:/<model_name>/<model_version>` if you registered the model in the [MLflow Model Registry](/ml/model-registry)).

Once you have the model ready, deploying to a local server is straightforward. Use the <APILink fn="mlflow.server.cli" hash="mlflow-models-serve">mlflow models serve</APILink> command for a one-step deployment.
This command starts a local server that listens on the specified port and serves your model. Refer to the <APILink fn="mlflow.server.cli" hash="mlflow-models-serve">CLI reference</APILink> for available options.

```bash
mlflow models serve -m runs:/<run_id>/model -p 5000
```

You can then send a test request to the server as follows:

```bash
curl http://127.0.0.1:5000/invocations -H "Content-Type:application/json"  --data '{"inputs": [[1, 2], [3, 4], [5, 6]]}'
```

Several command line options are available to customize the server's behavior. For instance, the `--env-manager` option allows you to
choose a specific environment manager, like Anaconda, to create the virtual environment. The `mlflow models` module also provides
additional useful commands, such as building a Docker image or generating a Dockerfile. For comprehensive details, please refer
to the <APILink fn="mlflow.server.cli" hash="mlflow-models">MLflow CLI Reference</APILink>.

## Inference Server Specification \{#local-inference-server-spec}

### Endpoints

The inference server provides 4 endpoints:

- `/invocations`: An inference endpoint that accepts POST requests with input data and returns predictions.

- `/ping`: Used for health checks.

- `/health`: Same as /ping

- `/version`: Returns the MLflow version.

### Accepted Input Formats

The `/invocations` endpoint accepts CSV or JSON inputs. The input format must be specified in the
`Content-Type` header as either `application/json` or `application/csv`.

#### CSV Input

CSV input must be a valid pandas.DataFrame CSV representation. For example:

`curl http://127.0.0.1:5000/invocations -H 'Content-Type: application/csv' --data '1,2,3,4'`

#### JSON Input

You can either pass a flat dictionary corresponding to the desired model payload or wrap the
payload in a dict with a dict key that specifies your payload format.

##### Wrapped Payload Dict

If your model format is not supported above or you want to avoid transforming your input data to
the required payload format, you can leverage the dict payload structures below.

<Table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`dataframe_split`</td>
      <td>Pandas DataFrames in the `split` orientation.</td>
      <td>
        ```
        {"dataframe_split": pandas_df.to_dict(orient="split")}
        ```
      </td>
    </tr>
    <tr>
      <td>`dataframe_records`</td>
      <td>Pandas DataFrame in the records orientation. **We do not recommend using this format because it is not guaranteed to preserve column ordering.**</td>
      <td>
        ```
        {"dataframe_records": pandas_df.to_dict(orient="records")}
        ```
      </td>
    </tr>
    <tr>
      <td>`instances`</td>
      <td>Tensor input formatted as described in [TF Serving's API docs](https://www.tensorflow.org/tfx/serving/api_rest#request_format_2) where the provided inputs will be cast to Numpy arrays.</td>
      <td>
        ```
        {"instances": [1.0, 2.0, 5.0]}
        ```
      </td>
    </tr>
    <tr>
      <td>`inputs`</td>
      <td>Same as `instances` but with a different key.</td>
      <td>
        ```
        {"inputs": [["Cheese"], ["and", "Crackers"]]}
        ```
      </td>
    </tr>
  </tbody>
</Table>

```python title="Example"
# Prerequisite: serve a custom pyfunc OpenAI model (not mlflow.openai) on localhost:5678
#   that defines inputs in the below format and params of `temperature` and `max_tokens`

import json
import requests

payload = json.dumps(
    {
        "inputs": {"messages": [{"role": "user", "content": "Tell a joke!"}]},
        "params": {
            "temperature": 0.5,
            "max_tokens": 20,
        },
    }
)
response = requests.post(
    url=f"http://localhost:5678/invocations",
    data=payload,
    headers={"Content-Type": "application/json"},
)
print(response.json())
```

The JSON input can also include an optional `params` field for passing additional parameters.
Valid parameter types are `Union[DataType, List[DataType], None]`, where DataType
is <APILink fn="mlflow.types.DataType">`MLflow data types`</APILink>. To pass parameters,
a valid [Model Signature](/ml/model/signatures) with `params` must be defined.

```bash
curl http://127.0.0.1:5000/invocations -H 'Content-Type: application/json' -d '{
    "inputs": {"question": ["What color is it?"],
                "context": ["Some people said it was green but I know that it is pink."]},
    "params": {"max_answer_len": 10}
}'
```

:::note
Since JSON discards type information, MLflow will cast the JSON input to the input type specified
in the model's schema if available. If your model is sensitive to input types, it is recommended that
a schema is provided for the model to ensure that type mismatch errors do not occur at inference time.
In particular, Deep Learning models are typically strict about input types and will need a model schema in order
for the model to score correctly. For complex data types, see [Encoding complex data](#encoding-complex-data) below.
:::

##### Raw Payload Dict

If your payload is in a format that your mlflow served model will accept and it's in the supported
models below, you can pass a raw payload dict.

<Table>
  <thead>
    <tr>
      <th>Supported Request Format</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>OpenAI Chat</td>
      <td>[OpenAI chat request payload](https://platform.openai.com/docs/api-reference/chat/create)†</td>
      <td>
        ```
        {
            "messages": [{"role": "user", "content": "Tell a joke!"}],  # noqa
            "temperature": 0.0,
        }
        ```
      </td>
    </tr>
  </tbody>
</Table>

† Note that the `model` argument **should not** be included when using the OpenAI APIs, due to its configuration being set by the MLflow model instance. All other parameters can be freely used, provided that they are defined within the `params` argument within the logged model signature.

```python title="Example"
# Prerequisite: serve a Pyfunc model accepts OpenAI-compatible chat requests on localhost:5678 that defines
#   `temperature` and `max_tokens` as parameters within the logged model signature

import json
import requests

payload = json.dumps(
    {
        "messages": [{"role": "user", "content": "Tell a joke!"}],
        "temperature": 0.5,
        "max_tokens": 20,
    }
)
requests.post(
    url=f"http://localhost:5678/invocations",
    data=payload,
    headers={"Content-Type": "application/json"},
)
print(requests.json())
```

#### Encoding complex data

Complex data types, such as dates or binary, do not have a native JSON representation. If you include a model
signature, MLflow can automatically decode supported data types from JSON. The following data type conversions
are supported:

- binary: data is expected to be base64 encoded, MLflow will automatically base64 decode.

- datetime: data is expected to be encoded as a string according to
  [ISO 8601 specification](https://www.iso.org/iso-8601-date-and-time-format.html).
  MLflow will parse this into the appropriate datetime representation on the given platform.

Example requests:

```bash
# record-oriented DataFrame input with binary column "b"
curl http://127.0.0.1:5000/invocations -H 'Content-Type: application/json' -d '[
    {"a": 0, "b": "dGVzdCBiaW5hcnkgZGF0YSAw"},
    {"a": 1, "b": "dGVzdCBiaW5hcnkgZGF0YSAx"},
    {"a": 2, "b": "dGVzdCBiaW5hcnkgZGF0YSAy"}
]'

# record-oriented DataFrame input with datetime column "b"
curl http://127.0.0.1:5000/invocations -H 'Content-Type: application/json' -d '[
    {"a": 0, "b": "2020-01-01T00:00:00Z"},
    {"a": 1, "b": "2020-02-01T12:34:56Z"},
    {"a": 2, "b": "2021-03-01T00:00:00Z"}
]'
```

## Serving Frameworks

By default, MLflow uses [FastAPI](https://fastapi.tiangolo.com/), a modern ASGI web application framework for Python, to serve the inference endpoint.
FastAPI handles requests asynchronously and is recognized as one of the fastest Python frameworks. This production-ready framework works well for most use cases.
Additionally, MLflow also integrates with [MLServer](https://mlserver.readthedocs.io/en/latest) as an alternative serving engine. MLServer achieves
higher performance and scalability by leveraging asynchronous request/response paradigm and workload offloading. Also MLServer is used as the core Python
inference server in Kubernetes-native frameworks like [Seldon Core](https://docs.seldon.io/projects/seldon-core/en/latest) and
[KServe (formerly known as KFServing)](https://kserve.github.io/website), hence which provides advanced features such as canary deployment and
auto scaling out of the box.

<Table>
  <thead>
    <tr>
      <th></th>
      <th>
        <div className="max-height-img-container" style={{ maxHeight: 60 }}>
          <span>![](/images/logos/fastapi-logo.svg)</span>
        </div>
      </th>
      <th>
        <div className="max-height-img-container" style={{ maxHeight: 60 }}>
          <span>![](/images/logos/seldon-mlserver-logo.png)</span>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>**Use Case**</td>
      <td>Standard usecases including local testing.</td>
      <td>High-scale production environment.</td>
    </tr>
    <tr>
      <td>**Set Up**</td>
      <td>FastAPI is installed by default with MLflow.</td>
      <td>Needs to be installed separately.</td>
    </tr>
    <tr>
      <td>**Performance**</td>
      <td>FastAPI natively supports asynchronous request handling, making it well-suited for I/O-bound tasks including ML workloads. Refer to [FastAPI Benchmark](https://fastapi.tiangolo.com/benchmarks/) for the benchmarks and comparisons with other Python frameworks.</td>
      <td>Designed for high-performance ML workloads, often delivering better throughput and efficiency. MLServer support asynchronous request/response paradigm, by offloading ML inference workload to a separate worker pool (processes), so that the server can continue to accept new requests while the inference is being processed. Please refer to the [MLServer Parallel Inference](https://mlserver.readthedocs.io/en/latest/user-guide/parallel-inference.html) for more details on how they achieve this. Additionally, MLServer supports [Adaptive Bacthing](https://mlserver.readthedocs.io/en/latest/user-guide/adaptive-batching.html) that transparently batch requests together to improve throughput and efficiency.</td>
    </tr>
    <tr>
      <td>**Scalability**</td>
      <td>While FastAPI works well in a distributed environment in general, MLflow simply runs it with `uvicorn` and does not support horizontal scaling out of the box.</td>
      <td>Additionally to the support for parallel inference as mentioned above, MLServer is used as the core inference server in Kubernetes-native frameworks such as [Seldon Core](https://docs.seldon.io/projects/seldon-core/en/latest/) and [KServe](https://kserve.github.io/website/) (formerly known as KFServing). By deploying [MLflow models to Kubernetes with MLServer](/ml/deployment/deploy-model-to-kubernetes), you can leverage the advanced features of these frameworks such as autoscaling to achieve high scalability.</td>
    </tr>
  </tbody>
</Table>

MLServer exposes the same scoring API through the `/invocations` endpoint.
To deploy with MLServer, first install additional dependencies with `pip install mlflow[extras]`,
then execute the deployment command with the `--enable-mlserver` option. For example,

```bash
mlflow models serve -m runs:/<run_id>/model -p 5000 --enable-mlserver
```

To read more about the integration between MLflow and MLServer, please check the [end-to-end example](https://mlserver.readthedocs.io/en/latest/examples/mlflow/README.html) in the MLServer documentation.
You can also find guides to deploy MLflow models to a Kubernetes cluster using MLServer in [Deploying a model to Kubernetes](/ml/deployment/deploy-model-to-kubernetes).

## Running Batch Inference

Instead of running an online inference endpoint, you can execute a single batch inference job on local files using
the <APILink fn="mlflow.server.cli" hash="mlflow-models-predict">mlflow models predict</APILink> command. The following command runs the model
prediction on `input.csv` and outputs the results to `output.csv`.

<Tabs>
  <TabItem default label="Bash" value="bash">
    ```bash
    mlflow models predict -m models:/<model_id> -i input.csv -o output.csv
    ```
  </TabItem>
  <TabItem label="Python" value="python">
    ```python
    import mlflow

    model = mlflow.pyfunc.load_model("models:/<model_id>")
    predictions = model.predict(pd.read_csv("input.csv"))
    predictions.to_csv("output.csv")
    ```

  </TabItem>
</Tabs>

## Troubleshooting
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/deployment/deploy-model-to-kubernetes/index.mdx

```text
---
sidebar_position: 3
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { CardGroup, PageCard } from "@site/src/components/Card";
import { APILink } from "@site/src/components/APILink";

# Deploy MLflow Model to Kubernetes

## Using MLServer as the Inference Server

By default, MLflow deployment uses [FastAPI](https://fastapi.tiangolo.com/), a widely used ASGI web application framework for Python,
to serve the inference endpoint. However, FastAPI does not support horizontal scaling natively and might not be suitable for production use cases
at scale. To address this gap, MLflow integrates with [MLServer](https://mlserver.readthedocs.io/en/latest) as an alternative deployment option, which is used
as a core Python inference server in Kubernetes-native frameworks like [Seldon Core](https://docs.seldon.ai/seldon-core-2) and
[KServe](https://kserve.github.io/website) (formerly known as KFServing). Using MLServer, you can take advantage of the scalability and reliability
of Kubernetes to serve your model at scale. See [Serving Framework](/ml/deployment/deploy-model-locally#serving-frameworks) for the detailed comparison between FastAPI and MLServer,
and why MLServer is a better choice for ML production use cases.

## Building a Docker Image for MLflow Model \{#build-docker-for-deployment}

The essential step to deploy an MLflow model to Kubernetes is to build a Docker image that contains the MLflow model and the inference server. This can be done via
`build-docker` CLI command or Python API.

<Tabs>
  <TabItem default label="CLI" value="cli">
    ```bash
    mlflow models build-docker -m runs:/<run_id>/model -n <image_name> --enable-mlserver
    ```
    If you want to use the bare-bones FastAPI server instead of MLServer, remove the ``--enable-mlserver`` flag. For other options, see
    the <APILink fn="mlflow.server.cli" hash="mlflow-models-build-docker">build-docker</APILink> command documentation.
  </TabItem>
  <TabItem label="Python" value="python">
    ```python
    import mlflow

    mlflow.models.build_docker(
        model_uri=f"models:/{model_id}",
        name="<image_name>",
        enable_mlserver=True,
    )
    ```

    If you want to use the bare-bones FastAPI server instead of MLServer, remove ``enable_mlserver=True``. For other options, see
    the <APILink fn="mlflow.models.build_docker">mlflow.models.build_docker</APILink> function documentation.

  </TabItem>
</Tabs>

:::warning important
Since MLflow 2.10.1, the Docker image spec has been changed to reduce the image size and improve the performance.
Most notably, Java is no longer installed in the image except for the Java model flavor such as `spark`.
If you need to install Java for other flavors, e.g. custom Python model that uses SparkML, please specify the `--install-java` flag to enforce Java installation.
:::

## Deployment Steps

Please refer to the following partner documentations for deploying MLflow Models to Kubernetes using MLServer. You can also follow the tutorial below to learn the end-to-end process including environment setup, model training, and deployment.

- [Deploy MLflow models with KServe InferenceService](https://kserve.github.io/website/latest/modelserving/v1beta1/mlflow/v2)
- [Deploy MLflow models to Seldon Core](https://docs.seldon.ai/seldon-core-2/user-guide/examples/model-zoo#mlflow-wine-model)

## Tutorial

You can also learn how to train a model in MLflow and deploy to Kubernetes in the following tutorial:

<CardGroup>
  <PageCard headerText="Develop ML model with MLflow and deploy to Kubernetes" link="/ml/deployment/deploy-model-to-kubernetes/tutorial" text="This tutorial walks you through the end-to-end ML development process from training a machine learning model, compare the performance, and deploy the model to Kubernetes using KServe." />
</CardGroup>
```

--------------------------------------------------------------------------------

---[FILE: tutorial.mdx]---
Location: mlflow-master/docs/docs/classic-ml/deployment/deploy-model-to-kubernetes/tutorial.mdx

```text
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { APILink } from "@site/src/components/APILink";

# Develop ML model with MLflow and deploy to Kubernetes

:::note
This tutorial assumes that you have access to a Kubernetes cluster. However, you can also complete this tutorial on your local machine
by using local cluster emulation tools such as [Kind](https://kind.sigs.k8s.io/docs/user/quick-start) or [Minikube](https://minikube.sigs.k8s.io/docs/start).
:::

This guide demonstrates how to use MLflow end-to-end for:

- Training a linear regression model with [MLflow Tracking](/ml/tracking).
- Conducting hyper-parameter tuning to find the best model.
- Packaging the model weights and dependencies as an [MLflow Model](/ml/model).
- Testing model serving locally with [mlserver](https://mlserver.readthedocs.io/en/latest/) using the <APILink fn="mlflow.server.cli" hash="mlflow-models-serve">mlflow models serve</APILink> command.
- Deploying the model to a Kubernetes cluster using [KServe](https://kserve.github.io/website/) with MLflow.

We will cover an end-to-end model development process including model training and testing within this tutorial.
If you already have a model and simply want to learn how to deploy it to Kubernetes, you can skip to [Step 6 - Test Model Serving Locally](#step-6-test-model-serving-locally).

## Introduction: Scalable Model Serving with KServe and MLServer

MLflow provides an easy-to-use interface for deploying models within a FastAPI-based inference server. You can deploy the same inference
server to a Kubernetes cluster by containerizing it using the `mlflow models build-docker` command. However, this approach may not be scalable
and could be unsuitable for production use cases. FastAPI is not designed for high performance and scale ([why?](/ml/deployment/deploy-model-locally#serving-frameworks)), and also
manually managing multiple instances of inference servers is backbreaking.

Fortunately, MLflow offers a solution for this. MLflow provides an alternative inference engine that is better suited for larger-scale inference deployments with its support for [MLServer](https://mlserver.readthedocs.io/en/latest),
which enables one-step deployment to popular serverless model serving frameworks on Kubernetes, such as [KServe](https://kserve.github.io/website), and
[Seldon Core](https://docs.seldon.io/projects/seldon-core/en/latest).

### What is KServe?

[KServe](https://kserve.github.io/website), formally known as KFServing, provides performant, scalable, and highly-abstracted interfaces for common machine learning frameworks like Tensorflow, XGBoost, scikit-learn, and Pytorch.
It offers advanced features that aid in operating large-scale machine learning systems, such as **autoscaling**, **canary rollout**, **A/B testing**, **monitoring**,
**explainability**, and more, leveraging the Kubernetes ecosystem, including [KNative](https://knative.dev) and [Istio](https://istio.io).

### Benefits of using MLflow with KServe

While KServe enables highly scalable and production-ready model serving, deploying your model there might require some effort.
MLflow simplifies the process of deploying models to a Kubernetes cluster with KServe and MLServer. Additionally, it offers seamless **end-to-end model management**
as a single place to manage the entire ML lifecycle. This includes [experiment tracking](/ml/tracking), [model packaging](/ml/model),
[versioning](/ml/model-registry), [evaluation](/ml/evaluation), and [deployment](/ml/deployment), which we will cover in this tutorial.

## Step 1: Installing MLflow and Additional Dependencies

First, please install mlflow to your local machine using the following command:

```bash
pip install mlflow[mlserver]
```

`[extras]` will install additional dependencies required for this tutorial including [mlserver](https://mlserver.readthedocs.io/en/latest) and
[scikit-learn](https://scikit-learn.org/stable). Note that scikit-learn is not required for deployment, just for training the example model used in this tutorial.

You can check if MLflow is installed correctly by running:

```bash
mlflow --version
```

## Step 2: Setting Up a Kubernetes Cluster

<Tabs>
  <TabItem default label="Kubernetes Cluster" value="kubernetes-cluster">
    If you already have access to a Kubernetes cluster, you can install KServe to your cluster by following [the official instructions](https://github.com/kserve/kserve#hammer_and_wrench-installation).
  </TabItem>
  <TabItem label="Local Machine Emulation" value="local-machine-emulation">
    You can follow [KServe QuickStart](https://kserve.github.io/website/latest/get_started) to set up a local cluster with [Kind](https://kind.sigs.k8s.io/docs/user/quick-start) and install KServe on it.
  </TabItem>
</Tabs>

Now that you have a Kubernetes cluster running as a deployment target, let's move on to creating the MLflow Model to deploy.

## Step 3: Training the Model

In this tutorial, we will train and deploy a simple regression model that predicts the quality of wine.

Let's start from training a model with the default hyperparameters. Execute the following code in a notebook or as a Python script.

:::note
For the sake of convenience, we use the <APILink fn="mlflow.sklearn.autolog" /> function.
This function allows MLflow to automatically log the appropriate set of model parameters and metrics during training. To learn more about the auto-logging feature
or how to log manually instead, see the [MLflow Tracking documentation](/ml/tracking).
:::

```python
import mlflow

import numpy as np
from sklearn import datasets, metrics
from sklearn.linear_model import ElasticNet
from sklearn.model_selection import train_test_split


def eval_metrics(pred, actual):
    rmse = np.sqrt(metrics.mean_squared_error(actual, pred))
    mae = metrics.mean_absolute_error(actual, pred)
    r2 = metrics.r2_score(actual, pred)
    return rmse, mae, r2


# Set th experiment name
mlflow.set_experiment("wine-quality")

# Enable auto-logging to MLflow
mlflow.sklearn.autolog()

# Load wine quality dataset
X, y = datasets.load_wine(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25)

# Start a run and train a model
with mlflow.start_run(run_name="default-params"):
    lr = ElasticNet()
    lr.fit(X_train, y_train)

    y_pred = lr.predict(X_test)
    rmse, mae, r2 = eval_metrics(y_pred, y_test)
```

Now you have trained a model, let's check if the parameters and metrics are logged correctly, via the MLflow UI.
You can start the MLflow UI by running the following command in your terminal:

```bash
mlflow server --port 5000
```

Then visit http://localhost:5000 to open the UI.

<div className="center-div" style={{ width: "80%" }}>
  ![](/images/deployment/tracking-ui-default.png)
</div>

Please open the experient named "wine-quality" on the left, then click the run named "default-params" in the table.
For this case, you should see parameters including `alpha` and `l1_ratio` and metrics like `training_score` and `mean_absolute_error_X_test`.

## Step 4: Running Hyperparameter Tuning

Now that we have established a baseline model, let's attempt to improve its performance by tuning the hyperparameters.
We will conduct a random search to identify the optimal combination of `alpha` and `l1_ratio`.

```python
from scipy.stats import uniform
from sklearn.model_selection import RandomizedSearchCV

lr = ElasticNet()

# Define distribution to pick parameter values from
distributions = dict(
    alpha=uniform(loc=0, scale=10),  # sample alpha uniformly from [-5.0, 5.0]
    l1_ratio=uniform(),  # sample l1_ratio uniformlyfrom [0, 1.0]
)

# Initialize random search instance
clf = RandomizedSearchCV(
    estimator=lr,
    param_distributions=distributions,
    # Optimize for mean absolute error
    scoring="neg_mean_absolute_error",
    # Use 5-fold cross validation
    cv=5,
    # Try 100 samples. Note that MLflow only logs the top 5 runs.
    n_iter=100,
)

# Start a parent run
with mlflow.start_run(run_name="hyperparameter-tuning"):
    search = clf.fit(X_train, y_train)

    # Evaluate the best model on test dataset
    y_pred = clf.best_estimator_.predict(X_test)
    rmse, mae, r2 = eval_metrics(y_pred, y_test)
    mlflow.log_metrics(
        {
            "mean_squared_error_X_test": rmse,
            "mean_absolute_error_X_test": mae,
            "r2_score_X_test": r2,
        }
    )
```

When you reopen the MLflow UI, you should notice that the run "hyperparameter-tuning" contains 5 child runs. MLflow utilizes parent-child relationship, which is particularly
useful for grouping a set of runs, such as those in hyper parameter tuning. Here the auto-logging is enabled and MLflow automatically create child runs for the top 5 runs
based on the `scoring` metric, which is negative mean absolute error in this example.

<div className="center-div" style={{ width: "80%" }}>
  ![](/images/deployment/hyper-parameter-tuning-ui.png)
</div>

To compare the results and identify the best model, you can utilize the visualization feature in the MLflow UI.

1. Select the first job ("default-params") and the parent job for hyperparameter tuning ("hyperparameter-turning").
2. Click on the "Chart" tab to visualize the metrics in a chart.
3. By default, a few bar charts for a predefined set of metrics are displayed.
4. You can add different chart, such as a scatter plot, to compare multiple metrics. For example, we can see the best model from hyperparameter tuning outperforms the default parameter model, in the mean squared error on the test dataset:

You can check the best combination of hyperparameters by looking at the parent run "hyperparameter-tuning".
In this example, the best model was `alpha=0.11714084185001972` and `l1_ratio=0.3599780644783639` (you may see different results).

:::note
To learn more about hyperparameter tuning with MLflow, please refer to [Hyperparameter Tuning with MLflow and Optuna](/ml/traditional-ml/tutorials/hyperparameter-tuning).
:::

## Step 5: Packaging the Model and Dependencies

Since we are using autologging, MLflow automatically logs the [Model](/ml/model) for each run. This process conveniently packages the model weight
and dependencies in a ready-to-deploy format.

:::note
In practice, it is also recommended to use [MLflow Model Registry](/ml/model-registry) for registering and managing your models.
:::

Let's take a brief look at how this format appears. You can view the logged model through the `Artifacts` tab on the Run detail page.

```
model
├── MLmodel
├── model.pkl
├── conda.yaml
├── python_env.yaml
└── requirements.txt
```

`model.pkl` is the file containing the serialized model weight. `MLmodel` includes general metadata that instructs MLflow on how to load the model.
The other files specify the dependencies required to run the model.

:::note
If you opt for manual logging, you will need to log the model explicitly using the <APILink fn="mlflow.sklearn.log_model">`mlflow.sklearn.log_model`</APILink>
function, as shown below:

```python
mlflow.sklearn.log_model(lr, name="model")
```

:::

## Step 6: Testing Model Serving Locally \{#step-6-test-model-serving-locally}

Before deploying the model, let's first test that the model can be served locally. As outlined in the
[Deploy MLflow Model Locally](/ml/deployment/deploy-model-locally), you can run a local inference server with just a single command.
Remember to use the `enable-mlserver` flag, which instructs MLflow to use MLServer as the inference server. This ensures the model runs in the
same manner as it would in Kubernetes.

```bash
mlflow models serve -m models:/<model_id_for_your_best_iteration> -p 1234 --enable-mlserver
```

This command starts a local server listening on port 1234. You can send a request to the server using `curl` command:

```bash
$ curl -X POST -H "Content-Type:application/json" --data '{"inputs": [[14.23, 1.71, 2.43, 15.6, 127.0, 2.8, 3.06, 0.28, 2.29, 5.64, 1.04, 3.92, 1065.0]]}' http://127.0.0.1:1234/invocations

{"predictions": [-0.03416275504140387]}
```

For more information about the request format and response formats, refer to the [Inference Server Specification](/ml/deployment/deploy-model-locally/#local-inference-server-spec).

## Step 7: Deploying the Model to KServe

Finally, we are all set to deploy the model to the Kubernetes cluster.

### Create Namespace

First, create a test namespace for deploying KServe resources and your model:

```bash
kubectl create namespace mlflow-kserve-test
```

### Create Deployment Configuration

Create a YAML file describing the model deployment to KServe.

There are two ways to specify the model for deployment in KServe configuration file:

1. Build a Docker image with the model and specify the image URI.
2. Specify the model URI directly (this only works if your model is stored in remote storage).

Please open the tabs below for details on each approach.

<Tabs>
  <TabItem default label="Using Docker Image" value="using-docker-image">
    #### Register Docker Account

    Since KServe cannot resolve a locally built Docker image, you need to push the image to a Docker registry.
    For this tutorial, we'll push the image to [Docker Hub](https://hub.docker.com), but you can use any other Docker registry,
    such as [Amazon ECR](https://aws.amazon.com/ecr) or a private registry.

    If you don't have a Docker Hub account yet, create one at https://hub.docker.com/signup.

    #### Build a Docker Image

    Build a ready-to-deploy Docker image with the `mlflow models build-docker` command:

    ```bash
    mlflow models build-docker -m runs:/<run_id_for_your_best_run>/model -n <your_dockerhub_user_name>/mlflow-wine-classifier --enable-mlserver
    ```

    This command builds a Docker image with the model and dependencies, tagging it as `mlflow-wine-classifier:latest`.

    #### Push the Docker Image

    After building the image, push it to Docker Hub (or to another registry using the appropriate command):

    ```bash
    docker push <your_dockerhub_user_name>/mlflow-wine-classifier
    ```

    #### Write Deployment Configuration

    Then create a YAML file like this:

    ```yaml
    apiVersion: "serving.kserve.io/v1beta1"
    kind: "InferenceService"
    metadata:
      name: "mlflow-wine-classifier"
      namespace: "mlflow-kserve-test"
    spec:
      predictor:
        containers:
          - name: "mlflow-wine-classifier"
            image: "<your_docker_user_name>/mlflow-wine-classifier"
            ports:
              - containerPort: 8080
                protocol: TCP
            env:
              - name: PROTOCOL
                value: "v2"
    ```

  </TabItem>
  <TabItem label="Using Model URI" value="using-model-uri">
    #### Get Remote Model URI

    KServe configuration allows direct specification of the model URI. However, it doesn't resolve MLflow-specific URI schemas like `runs:/` and `model:/`,
    nor local file URIs like `file:///`. We need to specify the model URI in a remote storage URI format e.g. `s3://xxx` or `gs://xxx`.
    By default, MLflow stores the model in the local file system, so you need to configure MLflow to store the model in remote storage.
    Please refer to [Artifact Store](/ml/tracking#artifact-stores) for setup instructions.

    After configuring the artifact store, load and re-log the best model to the new artifact store, or repeat the model training steps.

    #### Create Deployment Configuration

    With the remote model URI, create a YAML file:

    ```yaml
    apiVersion: "serving.kserve.io/v1beta1"
    kind: "InferenceService"
    metadata:
      name: "mlflow-wine-classifier"
      namespace: "mlflow-kserve-test"
    spec:
      predictor:
        model:
          modelFormat:
            name: mlflow
          protocolVersion: v2
          storageUri: "<your_model_uri>"
    ```

  </TabItem>
</Tabs>

### Deploy Inference Service

Run the following `kubectl` command to deploy a new `InferenceService` to your Kubernetes cluster:

```bash
$ kubectl apply -f YOUR_CONFIG_FILE.yaml

inferenceservice.serving.kserve.io/mlflow-wine-classifier created
```

You can check the status of the deployment by running:

```bash
$ kubectl get inferenceservice mlflow-wine-classifier

NAME                     URL                                                     READY   PREV   LATEST   PREVROLLEDOUTREVISION   LATESTREADYREVISION
mlflow-wine-classifier   http://mlflow-wine-classifier.mlflow-kserve-test.local   True             100                    mlflow-wine-classifier-100
```

:::note
It may take a few minutes for the deployment status to be ready. For detailed deployment status and logs,
run `kubectl get inferenceservice mlflow-wine-classifier -oyaml`.
:::

### Test the Deployment

Once the deployment is ready, you can send a test request to the server.

First, create a JSON file with test data and save it as `test-input.json`. Ensure the request data is formatted for the [V2 Inference Protocol](https://kserve.github.io/website/latest/reference/swagger-ui/#modelinferrequestinferinputtensor),
because we created the model with `protocolVersion: v2`. The request should look like this:

```json
{
  "inputs": [
    {
      "name": "input",
      "shape": [13],
      "datatype": "FP32",
      "data": [14.23, 1.71, 2.43, 15.6, 127.0, 2.8, 3.06, 0.28, 2.29, 5.64, 1.04, 3.92, 1065.0]
    }
  ]
}
```

Then send the request to your inference service:

<Tabs>
  <TabItem default label="Kubernetes Cluster" value="kubernetes-custer">
    Assuming your cluster is exposed via LoadBalancer, follow [these instructions](https://kserve.github.io/website/0.10/get_started/first_isvc/#4-determine-the-ingress-ip-and-ports) to find the Ingress IP and port.
    Then send a test request using ``curl`` command:

    ```bash
    $ SERVICE_HOSTNAME=$(kubectl get inferenceservice mlflow-wine-classifier -n mlflow-kserve-test -o jsonpath='{.status.url}' | cut -d "/" -f 3)
    $ curl -v \
      -H "Host: ${SERVICE_HOSTNAME}" \
      -H "Content-Type: application/json" \
      -d @./test-input.json \
      http://${INGRESS_HOST}:${INGRESS_PORT}/v2/models/mlflow-wine-classifier/infer
    ```

  </TabItem>
  <TabItem label="Local Machine Emulation" value="local-machine-emulation">
    Typically, Kubernetes clusters expose services via LoadBalancer, but a local cluster created by ``kind`` doesn't have one.
    In this case, you can access the inference service via port-forwarding.

    Open a new terminal and run the following command to forward the port:

    ```bash
    $ INGRESS_GATEWAY_SERVICE=$(kubectl get svc -n istio-system --selector="app=istio-ingressgateway" -o jsonpath='{.items[0].metadata.name}')
    $ kubectl port-forward -n istio-system svc/${INGRESS_GATEWAY_SERVICE} 8080:80

    Forwarding from 127.0.0.1:8080 -> 8080
    Forwarding from [::1]:8080 -> 8080
    ```

    Then, in the original terminal, send a test request to the server:

    ```bash
    $ SERVICE_HOSTNAME=$(kubectl get inferenceservice mlflow-wine-classifier -n mlflow-kserve-test -o jsonpath='{.status.url}' | cut -d "/" -f 3)
    $ curl -v \
      -H "Host: ${SERVICE_HOSTNAME}" \
      -H "Content-Type: application/json" \
      -d @./test-input.json \
      http://localhost:8080/v2/models/mlflow-wine-classifier/infer
    ```

  </TabItem>
</Tabs>

## Troubleshooting

If you have any trouble during deployment, please consult with the [KServe official documentation](https://kserve.github.io/website)
and their [MLflow Deployment Guide](https://kserve.github.io/website/0.10/modelserving/v1beta1/mlflow/v2).

## Conclusion

Congratulations on completing the guide! In this tutorial, you have learned how to use MLflow for training a model, running hyperparameter tuning,
and deploying the model to Kubernetes cluster.

**Further readings**:

- [MLflow Tracking](/ml/tracking) - Explore more about MLflow Tracking and various ways to manage experiments and models, such as team collaboration.
- [MLflow Model Registry](/ml/model-registry) - Discover more about MLflow Model Registry for managing model versions and stages in a centralized model store.
- [MLflow Deployment](/ml/deployment) - Learn more about MLflow deployment and different deployment targets.
- [KServe official documentation](https://kserve.github.io/website/) - Dive deeper into KServe and its advanced features, including autoscaling, canary rollout, A/B testing, monitoring, explainability, etc.
- [Seldon Core official documentation](https://docs.seldon.io/projects/seldon-core/en/latest/) - Learn about Seldon Core, an alternative serverless model serving framework we support for Kubernetes.
```

--------------------------------------------------------------------------------

````
