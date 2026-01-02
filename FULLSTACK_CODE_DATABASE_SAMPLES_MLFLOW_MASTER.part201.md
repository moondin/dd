---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 201
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 201 of 991)

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

---[FILE: simple.py]---
Location: mlflow-master/examples/sentence_transformers/simple.py

```python
from sentence_transformers import SentenceTransformer

import mlflow
import mlflow.sentence_transformers

model = SentenceTransformer("all-MiniLM-L6-v2")

example_sentences = ["This is a sentence.", "This is another sentence."]

# Define the signature
signature = mlflow.models.infer_signature(
    model_input=example_sentences,
    model_output=model.encode(example_sentences),
)

# Log the model using mlflow
with mlflow.start_run():
    logged_model = mlflow.sentence_transformers.log_model(
        model=model,
        name="sbert_model",
        signature=signature,
        input_example=example_sentences,
    )

# Load option 1: mlflow.pyfunc.load_model returns a PyFuncModel
loaded_model = mlflow.pyfunc.load_model(logged_model.model_uri)
embeddings1 = loaded_model.predict(["hello world", "i am mlflow"])

# Load option 2: mlflow.sentence_transformers.load_model returns a SentenceTransformer
loaded_model = mlflow.sentence_transformers.load_model(logged_model.model_uri)
embeddings2 = loaded_model.encode(["hello world", "i am mlflow"])

print(embeddings1)

"""
>> [[-3.44772562e-02  3.10232025e-02  6.73496164e-03  2.61089969e-02
  ...
  2.37922110e-02 -2.28897743e-02  3.89375277e-02  3.02067865e-02]
 [ 4.81191138e-03 -9.33756605e-02  6.95968643e-02  8.09735525e-03
  ...
   6.57437667e-02 -2.72239652e-02  4.02687863e-02 -1.05599344e-01]]
"""
```

--------------------------------------------------------------------------------

---[FILE: binary_classification.py]---
Location: mlflow-master/examples/shap/binary_classification.py

```python
import os

import numpy as np
import shap
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier

import mlflow
from mlflow.artifacts import download_artifacts
from mlflow.tracking import MlflowClient

# prepare training data
X, y = load_breast_cancer(return_X_y=True, as_frame=True)
X = X.iloc[:50, :8]
y = y.iloc[:50]

# train a model
model = RandomForestClassifier()
model.fit(X, y)

# log an explanation
with mlflow.start_run() as run:
    mlflow.shap.log_explanation(lambda X: model.predict_proba(X)[:, 1], X)

# list artifacts
client = MlflowClient()
artifact_path = "model_explanations_shap"
artifacts = [x.path for x in client.list_artifacts(run.info.run_id, artifact_path)]
print("# artifacts:")
print(artifacts)

# load back the logged explanation
dst_path = download_artifacts(run_id=run.info.run_id, artifact_path=artifact_path)
base_values = np.load(os.path.join(dst_path, "base_values.npy"))
shap_values = np.load(os.path.join(dst_path, "shap_values.npy"))

# show a force plot
shap.force_plot(float(base_values), shap_values[0, :], X.iloc[0, :], matplotlib=True)
```

--------------------------------------------------------------------------------

---[FILE: explainer_logging.py]---
Location: mlflow-master/examples/shap/explainer_logging.py

```python
import shap
import sklearn
from sklearn.datasets import load_diabetes

import mlflow

# prepare training data
X, y = load_diabetes(return_X_y=True, as_frame=True)

# train a model
model = sklearn.ensemble.RandomForestRegressor(n_estimators=100)
model.fit(X, y)

# create an explainer
explainer_original = shap.Explainer(model.predict, X, algorithm="permutation")

# log an explainer
with mlflow.start_run() as run:
    mlflow.shap.log_explainer(explainer_original, artifact_path="shap_explainer")

    # load back the explainer
    explainer_new = mlflow.shap.load_explainer(f"runs:/{run.info.run_id}/shap_explainer")

    # run explainer on data
    shap_values = explainer_new(X[:5])

    print(shap_values)
```

--------------------------------------------------------------------------------

---[FILE: multiclass_classification.py]---
Location: mlflow-master/examples/shap/multiclass_classification.py

```python
import os

import numpy as np
import shap
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier

import mlflow
from mlflow.artifacts import download_artifacts
from mlflow.tracking import MlflowClient

# prepare training data
X, y = load_iris(return_X_y=True, as_frame=True)


# train a model
model = RandomForestClassifier()
model.fit(X, y)

# log an explanation
with mlflow.start_run() as run:
    mlflow.shap.log_explanation(model.predict_proba, X)

# list artifacts
client = MlflowClient()
artifact_path = "model_explanations_shap"
artifacts = [x.path for x in client.list_artifacts(run.info.run_id, artifact_path)]
print("# artifacts:")
print(artifacts)

# load back the logged explanation
dst_path = download_artifacts(run_id=run.info.run_id, artifact_path=artifact_path)
base_values = np.load(os.path.join(dst_path, "base_values.npy"))
shap_values = np.load(os.path.join(dst_path, "shap_values.npy"))

# show a force plot
shap.force_plot(base_values[0], shap_values[0, :, 0], X.iloc[0, :], matplotlib=True)
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/shap/README.md

```text
# SHAP Examples

Examples demonstrating use of the `mlflow.shap` APIs for model explainability.

| File                                                         | Task                      | Description                                                    |
| :----------------------------------------------------------- | :------------------------ | :------------------------------------------------------------- |
| [regression.py](regression.py)                               | Regression                | Log explanations for a LinearRegression model                  |
| [binary_classification.py](binary_classification.py)         | Binary classification     | Log explanations for a binary RandomForestClassifier model     |
| [multiclass_classification.py](multiclass_classification.py) | Multiclass classification | Log explanations for a multiclass RandomForestClassifier model |

## Prerequisites

Run the following command to install required packages:

```
pip install mlflow scikit-learn shap matplotlib
```

## How to run the scripts

```bash
python <script_name>
```

## How to view the logged explanations:

- Run `mlflow server` to launch the MLflow UI.
- Open http://127.0.0.1:5000 on your browser.
- Click the latest run in the runs table.
- Scroll down to the artifact viewer.
- Open a folder named `model_explanations_shap`.
```

--------------------------------------------------------------------------------

---[FILE: regression.py]---
Location: mlflow-master/examples/shap/regression.py

```python
import os

import numpy as np
import shap
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression

import mlflow
from mlflow.artifacts import download_artifacts
from mlflow.tracking import MlflowClient

# prepare training data
X, y = load_diabetes(return_X_y=True, as_frame=True)
X = X.iloc[:50, :4]
y = y.iloc[:50]

# train a model
model = LinearRegression()
model.fit(X, y)

# log an explanation
with mlflow.start_run() as run:
    mlflow.shap.log_explanation(model.predict, X)

# list artifacts
client = MlflowClient()
artifact_path = "model_explanations_shap"
artifacts = [x.path for x in client.list_artifacts(run.info.run_id, artifact_path)]
print("# artifacts:")
print(artifacts)

# load back the logged explanation
dst_path = download_artifacts(run_id=run.info.run_id, artifact_path=artifact_path)
base_values = np.load(os.path.join(dst_path, "base_values.npy"))
shap_values = np.load(os.path.join(dst_path, "shap_values.npy"))

# show a force plot
shap.force_plot(float(base_values), shap_values[0, :], X.iloc[0, :], matplotlib=True)
```

--------------------------------------------------------------------------------

---[FILE: grid_search_cv.py]---
Location: mlflow-master/examples/sklearn_autolog/grid_search_cv.py

```python
from pprint import pprint

import pandas as pd
from sklearn import datasets, svm
from sklearn.model_selection import GridSearchCV
from utils import fetch_logged_data

import mlflow


def main():
    mlflow.sklearn.autolog()

    iris = datasets.load_iris()
    parameters = {"kernel": ("linear", "rbf"), "C": [1, 10]}
    svc = svm.SVC()
    clf = GridSearchCV(svc, parameters)

    clf.fit(iris.data, iris.target)
    run_id = mlflow.last_active_run().info.run_id

    # show data logged in the parent run
    print("========== parent run ==========")
    for key, data in fetch_logged_data(run_id).items():
        print(f"\n---------- logged {key} ----------")
        pprint(data)

    # show data logged in the child runs
    filter_child_runs = f"tags.mlflow.parentRunId = '{run_id}'"
    runs = mlflow.search_runs(filter_string=filter_child_runs)
    param_cols = [f"params.{p}" for p in parameters.keys()]
    metric_cols = ["metrics.mean_test_score"]

    print("\n========== child runs ==========\n")
    pd.set_option("display.max_columns", None)  # prevent truncating columns
    print(runs[["run_id", *param_cols, *metric_cols]])


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: linear_regression.py]---
Location: mlflow-master/examples/sklearn_autolog/linear_regression.py

```python
from pprint import pprint

import numpy as np
from sklearn.linear_model import LinearRegression
from utils import fetch_logged_data

import mlflow


def main():
    # enable autologging
    mlflow.sklearn.autolog()

    # prepare training data
    X = np.array([[1, 1], [1, 2], [2, 2], [2, 3]])
    y = np.dot(X, np.array([1, 2])) + 3

    # train a model
    model = LinearRegression()
    model.fit(X, y)
    run_id = mlflow.last_active_run().info.run_id
    print(f"Logged data and model in run {run_id}")

    # show logged data
    for key, data in fetch_logged_data(run_id).items():
        print(f"\n---------- logged {key} ----------")
        pprint(data)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: pipeline.py]---
Location: mlflow-master/examples/sklearn_autolog/pipeline.py

```python
from pprint import pprint

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from utils import fetch_logged_data

import mlflow


def main():
    # enable autologging
    mlflow.sklearn.autolog()

    # prepare training data
    X = np.array([[1, 1], [1, 2], [2, 2], [2, 3]])
    y = np.dot(X, np.array([1, 2])) + 3

    # train a model
    pipe = Pipeline([("scaler", StandardScaler()), ("lr", LinearRegression())])
    pipe.fit(X, y)
    run_id = mlflow.last_active_run().info.run_id
    print(f"Logged data and model in run: {run_id}")

    # show logged data
    for key, data in fetch_logged_data(run_id).items():
        print(f"\n---------- logged {key} ----------")
        pprint(data)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/sklearn_autolog/README.md

```text
# Examples for scikit-learn Autologging

| File                                           | Description                                         |
| :--------------------------------------------- | :-------------------------------------------------- |
| [linear_regression.py](./linear_regression.py) | Train a [LinearRegression][lr] model                |
| [pipeline.py](./pipeline.py)                   | Train a [Pipeline][pipe] model                      |
| [grid_search_cv.py](./grid_search_cv.py)       | Perform a parameter search using [GridSearchCV][gs] |

[lr]: https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html
[pipe]: https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html
[gs]: https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/examples/sklearn_autolog/utils.py

```python
from mlflow.tracking import MlflowClient


def yield_artifacts(run_id, path=None):
    """Yield all artifacts in the specified run"""
    client = MlflowClient()
    for item in client.list_artifacts(run_id, path):
        if item.is_dir:
            yield from yield_artifacts(run_id, item.path)
        else:
            yield item.path


def fetch_logged_data(run_id):
    """Fetch params, metrics, tags, and artifacts in the specified run"""
    client = MlflowClient()
    data = client.get_run(run_id).data
    # Exclude system tags: https://www.mlflow.org/docs/latest/tracking.html#system-tags
    tags = {k: v for k, v in data.tags.items() if not k.startswith("mlflow.")}
    artifacts = list(yield_artifacts(run_id))
    return {
        "params": data.params,
        "metrics": data.metrics,
        "tags": tags,
        "artifacts": artifacts,
    }
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/sklearn_elasticnet_diabetes/README.md

```text
# Scikit-learn ElasticNet Diabetes Example

This example trains an ElasticNet regression model for predicting diabetes progression. The example uses [matplotlib](https://matplotlib.org/), which requires different Python dependencies for Linux and OSX. The [linux](linux) and [osx](osx) subdirectories include appropriate MLflow projects for each respective platform.
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/sklearn_elasticnet_diabetes/linux/MLproject

```text
name: tutorial

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      alpha: {type: float, default: 0.01}
      l1_ratio: {type: float, default: 0.1}
    command: "python train_diabetes.py {alpha} {l1_ratio}"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/sklearn_elasticnet_diabetes/linux/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - numpy
  - matplotlib
  - pandas
  - scipy
  - scikit-learn
  - cloudpickle
```

--------------------------------------------------------------------------------

---[FILE: train_diabetes.py]---
Location: mlflow-master/examples/sklearn_elasticnet_diabetes/linux/train_diabetes.py

```python
#
# train_diabetes.py
#
#   MLflow model using ElasticNet (sklearn) and Plots ElasticNet Descent Paths
#
#   Uses the sklearn Diabetes dataset to predict diabetes progression using ElasticNet
#       The predicted "progression" column is a quantitative measure of disease progression one year after baseline
#       http://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_diabetes.html
#   Combines the above with the Lasso Coordinate Descent Path Plot
#       http://scikit-learn.org/stable/auto_examples/linear_model/plot_lasso_coordinate_descent_path.html
#       Original author: Alexandre Gramfort <alexandre.gramfort@inria.fr>; License: BSD 3 clause
#
#  Usage:
#    python train_diabetes.py 0.01 0.01
#    python train_diabetes.py 0.01 0.75
#    python train_diabetes.py 0.01 1.0
#

import sys
import warnings
from itertools import cycle

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn import datasets
from sklearn.linear_model import ElasticNet, enet_path
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

# Load Diabetes datasets
diabetes = datasets.load_diabetes()
X = diabetes.data
y = diabetes.target

# Create pandas DataFrame for sklearn ElasticNet linear_model
Y = np.array([y]).transpose()
d = np.concatenate((X, Y), axis=1)
cols = diabetes.feature_names + ["progression"]
data = pd.DataFrame(d, columns=cols)


# Import mlflow
import mlflow
import mlflow.sklearn
from mlflow.models import infer_signature


# Evaluate metrics
def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2


if __name__ == "__main__":
    warnings.filterwarnings("ignore")
    np.random.seed(40)

    # Split the data into training and test sets. (0.75, 0.25) split.
    train, test = train_test_split(data)

    # The predicted column is "progression" which is a quantitative measure of disease progression one year after baseline
    train_x = train.drop(["progression"], axis=1)
    test_x = test.drop(["progression"], axis=1)
    train_y = train[["progression"]]
    test_y = test[["progression"]]

    alpha = float(sys.argv[1]) if len(sys.argv) > 1 else 0.05
    l1_ratio = float(sys.argv[2]) if len(sys.argv) > 2 else 0.05

    # Run ElasticNet
    lr = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, random_state=42)
    lr.fit(train_x, train_y)
    predicted_qualities = lr.predict(test_x)
    (rmse, mae, r2) = eval_metrics(test_y, predicted_qualities)

    # Print out ElasticNet model metrics
    print(f"Elasticnet model (alpha={alpha:f}, l1_ratio={l1_ratio:f}):")
    print(f"  RMSE: {rmse}")
    print(f"  MAE: {mae}")
    print(f"  R2: {r2}")

    # Infer model signature
    predictions = lr.predict(train_x)
    signature = infer_signature(train_x, predictions)

    # Log mlflow attributes for mlflow UI
    mlflow.log_param("alpha", alpha)
    mlflow.log_param("l1_ratio", l1_ratio)
    mlflow.log_metric("rmse", rmse)
    mlflow.log_metric("r2", r2)
    mlflow.log_metric("mae", mae)
    mlflow.sklearn.log_model(lr, name="model", signature=signature)

    # Compute paths
    eps = 5e-3  # the smaller it is the longer is the path

    print("Computing regularization path using the elastic net.")
    alphas_enet, coefs_enet, _ = enet_path(X, y, eps=eps, l1_ratio=l1_ratio)

    # Display results
    fig = plt.figure(1)
    ax = plt.gca()

    colors = cycle(["b", "r", "g", "c", "k"])
    neg_log_alphas_enet = -np.log10(alphas_enet)
    for coef_e, c in zip(coefs_enet, colors):
        l2 = plt.plot(neg_log_alphas_enet, coef_e, linestyle="--", c=c)

    plt.xlabel("-Log(alpha)")
    plt.ylabel("coefficients")
    title = "ElasticNet Path by alpha for l1_ratio = " + str(l1_ratio)
    plt.title(title)
    plt.axis("tight")

    # Save figures
    fig.savefig("ElasticNet-paths.png")

    # Close plot
    plt.close(fig)

    # Log artifacts (output files)
    mlflow.log_artifact("ElasticNet-paths.png")
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/sklearn_elasticnet_diabetes/osx/MLproject

```text
name: tutorial

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      alpha: {type: float, default: 0.01}
      l1_ratio: {type: float, default: 0.1}
    command: "python train_diabetes.py {alpha} {l1_ratio}"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/sklearn_elasticnet_diabetes/osx/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow>=1.0
  - cloudpickle
  - numpy
  - matplotlib
  - pandas
  - scikit-learn
```

--------------------------------------------------------------------------------

---[FILE: train_diabetes.py]---
Location: mlflow-master/examples/sklearn_elasticnet_diabetes/osx/train_diabetes.py

```python
#
# train_diabetes.py
#
#   MLflow model using ElasticNet (sklearn) and Plots ElasticNet Descent Paths
#
#   Uses the sklearn Diabetes dataset to predict diabetes progression using ElasticNet
#       The predicted "progression" column is a quantitative measure of disease progression one year after baseline
#       http://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_diabetes.html
#   Combines the above with the Lasso Coordinate Descent Path Plot
#       http://scikit-learn.org/stable/auto_examples/linear_model/plot_lasso_coordinate_descent_path.html
#       Original author: Alexandre Gramfort <alexandre.gramfort@inria.fr>; License: BSD 3 clause
#
#  Usage:
#    python train_diabetes.py 0.01 0.01
#    python train_diabetes.py 0.01 0.75
#    python train_diabetes.py 0.01 1.0
#

import sys
import warnings
from itertools import cycle

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn import datasets
from sklearn.linear_model import ElasticNet, enet_path
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

# Load Diabetes datasets
diabetes = datasets.load_diabetes()
X = diabetes.data
y = diabetes.target

# Create pandas DataFrame for sklearn ElasticNet linear_model
Y = np.array([y]).transpose()
d = np.concatenate((X, Y), axis=1)
cols = diabetes.feature_names + ["progression"]
data = pd.DataFrame(d, columns=cols)


# Import mlflow
import mlflow
import mlflow.sklearn
from mlflow.models import infer_signature


# Evaluate metrics
def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2


if __name__ == "__main__":
    warnings.filterwarnings("ignore")
    np.random.seed(40)

    # Split the data into training and test sets. (0.75, 0.25) split.
    train, test = train_test_split(data)

    # The predicted column is "progression" which is a quantitative measure of disease progression one year after baseline
    train_x = train.drop(["progression"], axis=1)
    test_x = test.drop(["progression"], axis=1)
    train_y = train[["progression"]]
    test_y = test[["progression"]]

    alpha = float(sys.argv[1]) if len(sys.argv) > 1 else 0.05
    l1_ratio = float(sys.argv[2]) if len(sys.argv) > 2 else 0.05

    # Run ElasticNet
    lr = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, random_state=42)
    lr.fit(train_x, train_y)
    predicted_qualities = lr.predict(test_x)
    (rmse, mae, r2) = eval_metrics(test_y, predicted_qualities)

    # Print out ElasticNet model metrics
    print(f"Elasticnet model (alpha={alpha:f}, l1_ratio={l1_ratio:f}):")
    print(f"  RMSE: {rmse}")
    print(f"  MAE: {mae}")
    print(f"  R2: {r2}")

    # Infer model signature
    predictions = lr.predict(train_x)
    signature = infer_signature(train_x, predictions)

    # Log mlflow attributes for mlflow UI
    mlflow.log_param("alpha", alpha)
    mlflow.log_param("l1_ratio", l1_ratio)
    mlflow.log_metric("rmse", rmse)
    mlflow.log_metric("r2", r2)
    mlflow.log_metric("mae", mae)
    mlflow.sklearn.log_model(lr, name="model", signature=signature)

    # Compute paths
    eps = 5e-3  # the smaller it is the longer is the path

    print("Computing regularization path using the elastic net.")
    alphas_enet, coefs_enet, _ = enet_path(X, y, eps=eps, l1_ratio=l1_ratio)

    # Display results
    fig = plt.figure(1)
    ax = plt.gca()

    colors = cycle(["b", "r", "g", "c", "k"])
    neg_log_alphas_enet = -np.log10(alphas_enet)
    for coef_e, c in zip(coefs_enet, colors):
        l2 = plt.plot(neg_log_alphas_enet, coef_e, linestyle="--", c=c)

    plt.xlabel("-Log(alpha)")
    plt.ylabel("coefficients")
    title = "ElasticNet Path by alpha for l1_ratio = " + str(l1_ratio)
    plt.title(title)
    plt.axis("tight")

    # Save figures
    fig.savefig("ElasticNet-paths.png")

    # Close plot
    plt.close(fig)

    # Log artifacts (output files)
    mlflow.log_artifact("ElasticNet-paths.png")
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/examples/sklearn_elasticnet_wine/conda.yaml

```yaml
name: tutorial
channels:
  - conda-forge
dependencies:
  - python=3.9
  - pip
  - pip:
      - scikit-learn==1.4.2
      - mlflow>=1.0
      - pandas
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/sklearn_elasticnet_wine/MLproject

```text
name: tutorial

python_env: python_env.yaml

entry_points:
  main:
    parameters:
      alpha: {type: float, default: 0.5}
      l1_ratio: {type: float, default: 0.1}
    command: "python train.py {alpha} {l1_ratio}"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/sklearn_elasticnet_wine/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - scikit-learn==1.4.2
  - mlflow>=1.0
  - pandas
```

--------------------------------------------------------------------------------

---[FILE: train.ipynb]---
Location: mlflow-master/examples/sklearn_elasticnet_wine/train.ipynb

```text
{
 "cells": [
  {
   "attachments": {},
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# MLflow Training Tutorial\n",
    "\n",
    "This `train.pynb` Jupyter notebook predicts the quality of wine using [sklearn.linear_model.ElasticNet](http://scikit-learn.org/stable/modules/generated/sklearn.linear_model.ElasticNet.html).  \n",
    "\n",
    "> This is the Jupyter notebook version of the `train.py` example\n",
    "\n",
    "Attribution\n",
    "* The data set used in this example is from http://archive.ics.uci.edu/ml/datasets/Wine+Quality\n",
    "* P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis.\n",
    "* Modeling wine preferences by data mining from physicochemical properties. In Decision Support Systems, Elsevier, 47(4):547-553, 2009.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [],
   "source": [
    "import logging\n",
    "import warnings\n",
    "\n",
    "\n",
    "# Wine Quality Sample\n",
    "def train(in_alpha, in_l1_ratio):\n",
    "    import numpy as np\n",
    "    import pandas as pd\n",
    "    from sklearn.linear_model import ElasticNet\n",
    "    from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score\n",
    "    from sklearn.model_selection import train_test_split\n",
    "\n",
    "    import mlflow\n",
    "    import mlflow.sklearn\n",
    "    from mlflow.models import infer_signature\n",
    "\n",
    "    logging.basicConfig(level=logging.WARN)\n",
    "    logger = logging.getLogger(__name__)\n",
    "\n",
    "    def eval_metrics(actual, pred):\n",
    "        rmse = np.sqrt(mean_squared_error(actual, pred))\n",
    "        mae = mean_absolute_error(actual, pred)\n",
    "        r2 = r2_score(actual, pred)\n",
    "        return rmse, mae, r2\n",
    "\n",
    "    warnings.filterwarnings(\"ignore\")\n",
    "    np.random.seed(40)\n",
    "\n",
    "    # Read the wine-quality csv file from the URL\n",
    "    csv_url = (\n",
    "        \"http://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv\"\n",
    "    )\n",
    "    try:\n",
    "        data = pd.read_csv(csv_url, sep=\";\")\n",
    "    except Exception as e:\n",
    "        logger.exception(\n",
    "            f\"Unable to download training & test CSV, check your internet connection. Error: {e}\"\n",
    "        )\n",
    "\n",
    "    # Split the data into training and test sets. (0.75, 0.25) split.\n",
    "    train, test = train_test_split(data)\n",
    "\n",
    "    # The predicted column is \"quality\" which is a scalar from [3, 9]\n",
    "    train_x = train.drop([\"quality\"], axis=1)\n",
    "    test_x = test.drop([\"quality\"], axis=1)\n",
    "    train_y = train[[\"quality\"]]\n",
    "    test_y = test[[\"quality\"]]\n",
    "\n",
    "    # Set default values if no alpha is provided\n",
    "    alpha = 0.5 if float(in_alpha) is None else float(in_alpha)\n",
    "\n",
    "    # Set default values if no l1_ratio is provided\n",
    "    l1_ratio = 0.5 if float(in_l1_ratio) is None else float(in_l1_ratio)\n",
    "\n",
    "    # Useful for multiple runs (only doing one run in this sample notebook)\n",
    "    with mlflow.start_run():\n",
    "        # Execute ElasticNet\n",
    "        lr = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, random_state=42)\n",
    "        lr.fit(train_x, train_y)\n",
    "\n",
    "        # Evaluate Metrics\n",
    "        predicted_qualities = lr.predict(test_x)\n",
    "        (rmse, mae, r2) = eval_metrics(test_y, predicted_qualities)\n",
    "\n",
    "        # Print out metrics\n",
    "        print(f\"Elasticnet model (alpha={alpha:f}, l1_ratio={l1_ratio:f}):\")\n",
    "        print(f\"  RMSE: {rmse}\")\n",
    "        print(f\"  MAE: {mae}\")\n",
    "        print(f\"  R2: {r2}\")\n",
    "\n",
    "        # Infer model signature\n",
    "        predictions = lr.predict(train_x)\n",
    "        signature = infer_signature(train_x, predictions)\n",
    "\n",
    "        # Log parameter, metrics, and model to MLflow\n",
    "        mlflow.log_param(\"alpha\", alpha)\n",
    "        mlflow.log_param(\"l1_ratio\", l1_ratio)\n",
    "        mlflow.log_metric(\"rmse\", rmse)\n",
    "        mlflow.log_metric(\"r2\", r2)\n",
    "        mlflow.log_metric(\"mae\", mae)\n",
    "\n",
    "        mlflow.sklearn.log_model(lr, name=\"model\", signature=signature)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Elasticnet model (alpha=0.500000, l1_ratio=0.500000):\n",
      "  RMSE: 0.82224284975954\n",
      "  MAE: 0.6278761410160691\n",
      "  R2: 0.12678721972772689\n"
     ]
    }
   ],
   "source": [
    "train(0.5, 0.5)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Elasticnet model (alpha=0.200000, l1_ratio=0.200000):\n",
      "  RMSE: 0.7859129997062342\n",
      "  MAE: 0.6155290394093894\n",
      "  R2: 0.20224631822892092\n"
     ]
    }
   ],
   "source": [
    "train(0.2, 0.2)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Elasticnet model (alpha=0.100000, l1_ratio=0.100000):\n",
      "  RMSE: 0.7792546522251949\n",
      "  MAE: 0.6112547988118587\n",
      "  R2: 0.2157063843066196\n"
     ]
    }
   ],
   "source": [
    "train(0.1, 0.1)"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.6.5"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/sklearn_elasticnet_wine/train.py

```python
# The data set used in this example is from http://archive.ics.uci.edu/ml/datasets/Wine+Quality
# P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis.
# Modeling wine preferences by data mining from physicochemical properties. In Decision Support Systems, Elsevier, 47(4):547-553, 2009.

import logging
import sys
import warnings
from urllib.parse import urlparse

import numpy as np
import pandas as pd
from sklearn.linear_model import ElasticNet
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

import mlflow
import mlflow.sklearn
from mlflow.models import infer_signature

logging.basicConfig(level=logging.WARN)
logger = logging.getLogger(__name__)


def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2


if __name__ == "__main__":
    warnings.filterwarnings("ignore")
    np.random.seed(40)

    # Read the wine-quality csv file from the URL
    csv_url = (
        "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-red.csv"
    )
    try:
        data = pd.read_csv(csv_url, sep=";")
    except Exception as e:
        logger.exception(
            "Unable to download training & test CSV, check your internet connection. Error: %s", e
        )

    # Split the data into training and test sets. (0.75, 0.25) split.
    train, test = train_test_split(data)

    # The predicted column is "quality" which is a scalar from [3, 9]
    train_x = train.drop(["quality"], axis=1)
    test_x = test.drop(["quality"], axis=1)
    train_y = train[["quality"]]
    test_y = test[["quality"]]

    alpha = float(sys.argv[1]) if len(sys.argv) > 1 else 0.5
    l1_ratio = float(sys.argv[2]) if len(sys.argv) > 2 else 0.5

    with mlflow.start_run():
        lr = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, random_state=42)
        lr.fit(train_x, train_y)

        predicted_qualities = lr.predict(test_x)

        (rmse, mae, r2) = eval_metrics(test_y, predicted_qualities)

        print(f"Elasticnet model (alpha={alpha:f}, l1_ratio={l1_ratio:f}):")
        print(f"  RMSE: {rmse}")
        print(f"  MAE: {mae}")
        print(f"  R2: {r2}")

        mlflow.log_param("alpha", alpha)
        mlflow.log_param("l1_ratio", l1_ratio)
        mlflow.log_metric("rmse", rmse)
        mlflow.log_metric("r2", r2)
        mlflow.log_metric("mae", mae)

        predictions = lr.predict(train_x)
        signature = infer_signature(train_x, predictions)

        tracking_url_type_store = urlparse(mlflow.get_tracking_uri()).scheme

        # Model registry does not work with file store
        if tracking_url_type_store != "file":
            # Register the model
            # There are other ways to use the Model Registry, which depends on the use case,
            # please refer to the doc for more information:
            # https://mlflow.org/docs/latest/model-registry.html#api-workflow
            mlflow.sklearn.log_model(
                lr, name="model", registered_model_name="ElasticnetWineModel", signature=signature
            )
        else:
            mlflow.sklearn.log_model(lr, name="model", signature=signature)
```

--------------------------------------------------------------------------------

````
