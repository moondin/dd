---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 75
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 75 of 991)

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
Location: mlflow-master/docs/docs/classic-ml/model-registry/index.mdx

```text
---
sidebar_position: 15
toc_max_heading_level: 4
sidebar_label: Overview
pagination_next: model-registry/tutorial
---

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# MLflow Model Registry

The MLflow Model Registry is a centralized model store, set of APIs and a UI designed to
collaboratively manage the full lifecycle of a model. It provides lineage (i.e., which
MLflow experiment and run produced the model), versioning, aliasing, metadata tagging and
annotation support to ensure that you have the full spectrum of information at every stage from development to production deployment.

## Why Model Registry?

As machine learning projects grow in complexity and scale, managing models manually across different environments, teams, and iterations becomes increasingly error-prone and inefficient.
The MLflow Model Registry addresses this challenge by providing a centralized, structured system for organizing and governing ML models throughout their lifecycle.

Using the Model Registry offers the following benefits:

- **🗂️ Version Control**: The registry automatically tracks versions of each model, allowing teams to compare iterations, roll back to previous states, and manage multiple versions in parallel (e.g., staging vs. production).
- **🧬 Model Lineage and Traceability**: Each registered model version is linked to the MLflow run, logged model or notebook that produced it, enabling full reproducibility. You can trace back exactly how a model was trained, with what data and parameters.
- **🚀 Production-Ready Workflows**: Features like model aliases (e.g., @champion) and tags make it easier to manage deployment workflows, promoting models to experimental, staging, or production environments in a controlled and auditable way.
- **🛡️ Governance and Compliance**: With structured metadata, tagging, and role-based access controls (when used with a backend like Databricks or a managed MLflow service), the Model Registry supports governance requirements critical for enterprise-grade ML operations.

Whether you're a solo data scientist or part of a large ML platform team, the Model Registry is a foundational component for scaling reliable and maintainable machine learning systems.

## Concepts

The Model Registry introduces a few concepts that describe and facilitate the full lifecycle of an MLflow Model.

<table>
  <thead>
    <tr>
      <th>Concept</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Model</td>
      <td>
      An MLflow Model is created with one of the model flavor's **`mlflow.<model_flavor>.log_model()`** methods, or **<APILink fn="mlflow.create_external_model"/>** API since MLflow 3.
      Once logged, this model can then be registered with the Model Registry.
      </td>
    </tr>
    <tr>
      <td>Registered Model</td>
      <td>
      An MLflow Model can be registered with the Model Registry. A registered model has a unique name, contains versions, aliases, tags, and other metadata.
      </td>
    </tr>
    <tr>
      <td>Model Version</td>
      <td>
      Each registered model can have one or many versions. When a new model is added to the Model Registry, it is added as version 1. Each new model registered to
      the same model name **increments the version number**. Model versions have tags, which can be useful for tracking attributes of the model version (e.g. _`pre_deploy_checks: "PASSED"`_)
      </td>
    </tr>
    <tr>
      <td>Model URI</td>
      <td>
      You can refer to the registered model by using a URI of this format: `models:/<model-name>/<model-version>`, e.g., if you have a registered model with name "MyModel" and version 1, the URI referring to the model is: `models:/MyModel/1`".
      </td>
    </tr>
    <tr>
      <td>Model Alias</td>
      <td>
      Model aliases allow you to assign a mutable, named reference to a particular version of a registered model. By assigning an alias to a specific model version,
      you can use the alias to refer to that model version via a model URI or the model registry API. For example, you can create an alias named **`champion`** that
      points to version 1 of a model named **`MyModel`**. You can then refer to version 1 of **`MyModel`** by using the URI **`models:/MyModel@champion`**.

      Aliases are especially useful for deploying models. For example, you could assign a **`champion`** alias to the model version intended for production traffic
      and target this alias in production workloads. You can then update the model serving production traffic by reassigning the **`champion`** alias to a different model version.
      </td>
    </tr>
    <tr>
      <td>Tags</td>
      <td>
      Tags are key-value pairs that you associate with registered models and model versions, allowing you to label and categorize them by function or status. For example, you
      could apply a tag with key **`"task"`** and value **`"question-answering"`** (displayed in the UI as **`task:question-answering`**) to registered models intended for question
      answering tasks. At the model version level, you could tag versions undergoing pre-deployment validation with **`validation_status:pending`** and those cleared for deployment
      with **`validation_status:approved`**.
      </td>
    </tr>
    <tr>
      <td>Annotations and Descriptions</td>
      <td>
      You can annotate the top-level model and each version individually using Markdown, including the description and any relevant information useful for the team such as algorithm
      descriptions, datasets employed or the overall methodology involved in a given version's modeling approach.
      </td>
    </tr>

  </tbody>
</table>

## Model Registry in practice

The MLflow Model Registry is available in both open-source (OSS) MLflow and managed platforms like Databricks. Depending on the environment, the registry offers different
levels of integration, governance, and collaboration features.

### Model Registry in OSS MLflow

In the open-source version of MLflow, the Model Registry provides both a UI and API for managing the lifecycle of machine learning models.
You can register models, track versions, add tags and descriptions, and transition models between stages such as Staging and Production.

<details>
  <summary>Register a model in MLflow</summary>

  <Tabs>
    <TabItem label="Python APIs" value="python-apis">
      #### Register a model with MLflow Python APIs

      MLflow provides several ways to register a model version
      ```
      # Option 1: specify `registered_model_name` parameter when logging a model
      mlflow.<flavor>.log_model(..., registered_model_name="<YOUR_MODEL_NAME>")

      # Option 2: register a logged model
      mlflow.register_model(model_uri="<YOUR_MODEL_URI>", name="<YOUR_MODEL_NAME>")
      ```

      After registering the model, you can load it back with the model name and version
      ```
      mlflow.<flavor>.load_model("models:/<YOUR_MODEL_NAME>/<YOUR_MODEL_VERSION>")
      ```

    </TabItem>
    <TabItem label="MLflow UI" value="mlflow-ui">
      #### Register a model on MLflow UI

      1. Open the details page for the MLflow Run containing the logged MLflow model you'd like to register. Select the model folder containing the intended MLflow model in the
        **Artifacts** section.

      ![](/images/oss_registry_1_register.png)

      2. Click the **Register Model** button, which will trigger a modal form to pop up.

      3. In the **Model** dropdown menu on the form, you can either select "Create New Model" (which creates a new registered model with your MLflow model as its initial version)
        or select an existing registered model (which registers your model under it as a new version). The screenshot below demonstrates registering the MLflow model to a new registered
        model named `"iris_model_testing"`.

      ![](/images/oss_registry_2_dialog.png)
    </TabItem>

  </Tabs>
</details>

To learn more about the OSS Model Registry, refer to the [tutorial on the model registry](./tutorial).

### Model Registry in Databricks

Databricks extends MLflow's capabilities by integrating the Model Registry with Unity Catalog, enabling centralized governance, fine-grained access control, and cross-workspace collaboration.

Key benefits of Unity Catalog integration include:

- **🛡️ Enhanced governance**: Apply access policies and permission controls to model assets.
- **🌐 Cross-workspace access**: Register models once and access them across multiple Databricks workspaces.
- **🔗 Model lineage**: Track which notebooks, datasets, and experiments were used to create each model.
- **🔍 Discovery and reuse**: Browse and reuse production-grade models from a shared catalog.

<details>
  <summary>Register a model in Databricks UC</summary>

  <Tabs>
    <TabItem label="Python APIs" value="python-apis">
      #### Register a model to Databricks UC with MLflow Python APIs

      **Prerequisite**: Set tracking uri to Databricks
      ```python
      import mlflow

      mlflow.set_registry_uri("databricks-uc")
      ```

      Use MLflow APIs to register the model
      ```
      # Option 1: specify `registered_model_name` parameter when logging a model
      mlflow.<flavor>.log_model(..., registered_model_name="<YOUR_MODEL_NAME>")

      # Option 2: register a logged model
      mlflow.register_model(model_uri="<YOUR_MODEL_URI>", name="<YOUR_MODEL_NAME>")
      ```

      :::warning
      ML model versions in UC must have a [model signature](../model/signatures). If you want to set a signature on a model that's
      already logged or saved, the <APILink fn="mlflow.models.set_signature"/> API is available for this purpose.
      :::

      After registering the model, you can load it back with the model name and version
      ```
      mlflow.<flavor>.load_model("models:/<YOUR_MODEL_NAME>/<YOUR_MODEL_VERSION>")
      ```

    </TabItem>
    <TabItem label="Databricks UI" value="databricks-ui">
      #### Register a model on Databricks UI

      1. From the experiment run page or models page, click Register model in the upper-right corner of the UI.

      2. In the dialog, select Unity Catalog, and select a destination model from the drop down list.

      ![](/images/uc_register_model_1_dialog.png)

      3. Click Register.

      ![](/images/uc_register_model_2_button.png)

      Registering a model can take time. To monitor progress, navigate to the destination model in Unity Catalog and refresh periodically.
    </TabItem>

  </Tabs>
</details>

For more information, refer to the [Databricks documentation](https://docs.databricks.com/aws/en/machine-learning/manage-model-lifecycle) on managing the model lifecycle.
```

--------------------------------------------------------------------------------

---[FILE: tutorial.mdx]---
Location: mlflow-master/docs/docs/classic-ml/model-registry/tutorial.mdx

```text
---
sidebar_position: 15
toc_max_heading_level: 4
sidebar_label: Tutorial
---

import { APILink } from "@site/src/components/APILink";

# Model Registry Tutorials

Explore the full functionality of the Model Registry in this tutorial — from registering a model and inspecting its structure, to loading a specific model version for further use.

## Model Registry

Throughout this tutorial we will leverage a local tracking server and model registry for simplicity.
However, for production use cases we recommend using a
[remote tracking server](/ml/tracking/tutorials/remote-server).

### Step 0: Install Dependencies

```bash
pip install --upgrade mlflow
```

### Step 1: Register a Model

To use the MLflow model registry, you need to add your MLflow models to it. This is done through
registering a given model via one of the below commands:

- `mlflow.<model_flavor>.log_model(registered_model_name=<model_name>)`: register the model
  **while** logging it to the tracking server.
- `mlflow.register_model(<model_uri>, <model_name>)`: register the model **after** logging it to
  the tracking server. Note that you'll have to log the model before running this command to get a
  model URI.

MLflow has lots of model flavors. In the below example, we'll leverage scikit-learn's
RandomForestRegressor to demonstrate the simplest way to register a model, but note that you
can leverage any [supported model flavor](/ml/model#models_built-in-model-flavors).
In the code snippet below, we start an mlflow run and train a random forest model. We then log some
relevant hyper-parameters, the model mean-squared-error (MSE), and finally log and register the
model itself.

```python
from sklearn.datasets import make_regression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split

import mlflow
import mlflow.sklearn

with mlflow.start_run() as run:
    X, y = make_regression(n_features=4, n_informative=2, random_state=0, shuffle=False)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    params = {"max_depth": 2, "random_state": 42}
    model = RandomForestRegressor(**params)
    model.fit(X_train, y_train)

    # Log parameters and metrics using the MLflow APIs
    mlflow.log_params(params)

    y_pred = model.predict(X_test)
    mlflow.log_metrics({"mse": mean_squared_error(y_test, y_pred)})

    # Log the sklearn model and register as version 1
    mlflow.sklearn.log_model(
        sk_model=model,
        name="sklearn-model",
        input_example=X_train,
        registered_model_name="sk-learn-random-forest-reg-model",
    )
```

```bash title="Example Output"
Successfully registered model 'sk-learn-random-forest-reg-model'.
Created version '1' of model 'sk-learn-random-forest-reg-model'.
```

Great! We've registered a model.

Before moving on, let's highlight some important implementation notes.

- To register a model, you can leverage the `registered_model_name` parameter in the <APILink fn="mlflow.sklearn.log_model" />
  or call <APILink fn="mlflow.register_model" /> after logging the model. Generally, we suggest the former because it's more
  concise.
- [Model Signatures](/ml/model/signatures)
  provide validation for our model inputs and outputs. The `input_example` in `log_model()`
  automatically infers and logs a signature. Again, we suggest using this implementation because
  it's concise.

## Explore the Registered Model

Now that we've logged an experiment and registered the model associated with that experiment run,
let's observe how this information is actually stored both in the MLflow UI and in our local
directory. Note that we can also get this information programmatically, but for explanatory purposes
we'll use the MLflow UI.

### Step 1: Explore the `mlruns` Directory

Given that we're using our local filesystem as our tracking server and model registry, let's observe
the directory structure created when running the python script in the prior step.

Before diving in, it's import to note that MLflow is designed to abstract complexity from the user
and this directory structure is just for illustration purposes. Furthermore, on remote deployments,
which is recommended for production use cases, the tracking server will be
on object store (S3, ADLS, GCS, etc.) and the model registry will be on a relational database
(PostgreSQL, MySQL, etc.).

```
mlruns/
├── 0/                                    # Experiment ID
│   ├── bc6dc2a4f38d47b4b0c99d154bbc77ad/ # Run ID
│   │   ├── metrics/
│   │   │   └── mse                       # Example metric file for mean squared error
│   │   ├── artifacts/                    # Artifacts associated with our run
│   │   │   └── sklearn-model/
│   │   │       ├── python_env.yaml
│   │   │       ├── requirements.txt      # Python package requirements
│   │   │       ├── MLmodel               # MLflow model file with model metadata
│   │   │       ├── model.pkl             # Serialized model file
│   │   │       ├── input_example.json
│   │   │       └── conda.yaml
│   │   ├── tags/
│   │   │   ├── mlflow.user
│   │   │   ├── mlflow.source.git.commit
│   │   │   ├── mlflow.runName
│   │   │   ├── mlflow.source.name
│   │   │   ├── mlflow.log-model.history
│   │   │   └── mlflow.source.type
│   │   ├── params/
│   │   │   ├── max_depth
│   │   │   └── random_state
│   │   └── meta.yaml
│   └── meta.yaml
├── models/                               # Model Registry Directory
    ├── sk-learn-random-forest-reg-model/ # Registered model name
    │   ├── version-1/                    # Model version directory
    │   │   └── meta.yaml
    │   └── meta.yaml
```

The tracking server is organized by _Experiment ID_ and _Run ID_ and is responsible for storing our
experiment artifacts, parameters, and metrics. The model registry, on the other hand, only stores
metadata with pointers to our tracking server.

As you can see, flavors that support [autologging](/ml/tracking/autolog) provide lots of additional
information out-of-the-box. Also note that even if we don't have autologging for our model of
interest, we can easily store this information with explicit logging calls.

One more interesting callout is that by default you get three way to manage your model's
environment: `python_env.yaml` (python virtualenv), `requirements.txt` (PyPi requirements), and
`conda.yaml` (conda env).

Ok, now that we have a very high-level understanding of what is logged, let's use the MLflow UI to
view this information.

### Step 2: Start the Tracking Server

In the same directory as your `mlruns` folder, run the below command.

```bash
mlflow server --host 127.0.0.1 --port 8080
```

```
INFO:     Started server process [26393]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8080 (Press CTRL+C to quit)
```

### Step 3: View the Tracking Server

Assuming there are no errors, you can go to your web browser and visit `http://localhost:8080` to
view the MLflow UI.

First, let's leave the experiment tracking tab and visit the model registry.

<div className="center-div" style={{ width: 1024, maxWidth: "100%" }}>
  ![Model information from the mlflow
  ui.](/images/quickstart/model-registry-quickstart/model-registry-ui.png)
</div>

Next, let's add tags and a model version alias to
[facilitate model deployment](/ml/model-registry/workflow/#deploy-and-organize-models-with-aliases-and-tags).
You can add or edit tags and aliases by clicking on the corresponding `Add` link or pencil icon in
the model version table. Let's...

1. Add a model version tag with a key of `problem_type` and value of `regression`.
2. Add a model version alias of `the_best_model_ever`.

<div className="center-div" style={{ width: 1024, maxWidth: "100%" }}>
  ![Model information from the mlflow
  ui.](/images/quickstart/model-registry-quickstart/model-alias-and-tags.png)
</div>

## Load a Registered Model

To perform inference on a registered model version, we need to load it into memory. There are many
ways to find our model version, but the best method differs depending on the information you have
available. However, in the spirit of a quickstart, the below code snippet shows the simplest way to
load a model from the model registry via a specific model URI and perform inference.

```python
import mlflow.sklearn
from sklearn.datasets import make_regression

model_name = "sk-learn-random-forest-reg-model"
model_version = "latest"

# Load the model from the Model Registry
model_uri = f"models:/{model_name}/{model_version}"
model = mlflow.sklearn.load_model(model_uri)

# Generate a new dataset for prediction and predict
X_new, _ = make_regression(n_features=4, n_informative=2, random_state=0, shuffle=False)
y_pred_new = model.predict(X_new)

print(y_pred_new)
```

Note that if you're not using sklearn, if your model flavor is supported, you should use the
specific model flavor load method e.g. `mlflow.<flavor>.load_model()`. If the model flavor is
not supported, you should leverage <APILink fn="mlflow.pyfunc.load_model" />. Throughout this tutorial
we leverage sklearn for demonstration purposes.

### Example 0: Load via Tracking Server

A model URI is a unique identifier for a serialized model. Given the model artifact is stored with
experiments in the tracking server, you can use the below model URIs to bypass the model registry
and load the artifact into memory.

1. **Absolute local path**: `mlflow.sklearn.load_model("/Users/me/path/to/local/model")`
2. **Relative local path**: `mlflow.sklearn.load_model("relative/path/to/local/model")`
3. **Run id**: `mlflow.sklearn.load_model(f"runs:/{mlflow_run_id}/{run_relative_path_to_model}")`

However, unless you're in the same environment that you logged the model, you typically won't have
the above information. Instead, you should load the model by leveraging the model's name and
version.

### Example 1: Load via Name and Version

To load a model into memory via the `model_name` and monotonically increasing `model_version`,
use the below method:

```python
model = mlflow.sklearn.load_model(f"models:/{model_name}/{model_version}")
```

While this method is quick and easy, the monotonically increasing model version lacks flexibility.
Often, it's more efficient to leverage a model version alias.

### Example 2: Load via Model Version Alias

Model version aliases are user-defined identifiers for a model version. Given they're mutable after
model registration, they decouple model versions from the code that uses them.

For instance, let's say we have a model version alias called `production_model`, corresponding to
a production model. When our team builds a better model that is ready for deployment, we don't have
to change our serving workload code. Instead, in MLflow we reassign the `production_model` alias
from the old model version to the new one. This can be done simply in the UI. In the API, we run
_client.set_registered_model_alias_ with the same model name, alias name, and **new** model version
ID. It's that easy!

In the prior page, we added a model version alias to our model, but here's a programmatic example.

```python
import mlflow.sklearn
from mlflow import MlflowClient

client = MlflowClient()

# Set model version alias
model_name = "sk-learn-random-forest-reg-model"
model_version_alias = "the_best_model_ever"
client.set_registered_model_alias(
    model_name, model_version_alias, "1"
)  # Duplicate of step in UI

# Get information about the model
model_info = client.get_model_version_by_alias(model_name, model_version_alias)
model_tags = model_info.tags
print(model_tags)

# Get the model version using a model URI
model_uri = f"models:/{model_name}@{model_version_alias}"
model = mlflow.sklearn.load_model(model_uri)

print(model)
```

```_ title="Output"
{'problem_type': 'regression'}
RandomForestRegressor(max_depth=2, random_state=42)
```

Model version alias is highly dynamic and can correspond to anything that is meaningful for your
team. The most common example is a deployment state. For instance, let's say we have a `champion`
model in production but are developing `challenger` model that will hopefully out-perform our
production model. You can use `champion` and `challenger` model version aliases to uniquely
identify these model versions for easy access.

That's it! You should now be comfortable...

1. Registering a model
2. Finding a model and modifying the tags and model version alias via the MLflow UI
3. Loading the registered model for inference
```

--------------------------------------------------------------------------------

````
