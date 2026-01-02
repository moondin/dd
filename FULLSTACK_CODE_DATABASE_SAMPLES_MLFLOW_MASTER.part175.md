---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 175
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 175 of 991)

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

---[FILE: evaluate_on_binary_classifier.py]---
Location: mlflow-master/examples/evaluation/evaluate_on_binary_classifier.py

```python
import shap
import xgboost
from sklearn.model_selection import train_test_split

import mlflow
from mlflow.models import infer_signature

# Load the UCI Adult Dataset
X, y = shap.datasets.adult()

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

# Fit an XGBoost binary classifier on the training data split
model = xgboost.XGBClassifier().fit(X_train, y_train)

# Infer model signature
predictions = model.predict(X_train)
signature = infer_signature(X_train, predictions)

# Build the Evaluation Dataset from the test set
eval_data = X_test
eval_data["label"] = y_test

with mlflow.start_run() as run:
    # Log the XGBoost binary classifier model to MLflow
    model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)

    # Evaluate the logged model
    result = mlflow.evaluate(
        model_info.model_uri,
        eval_data,
        targets="label",
        model_type="classifier",
        evaluators=["default"],
    )

print(f"metrics:\n{result.metrics}")
print(f"artifacts:\n{result.artifacts}")
```

--------------------------------------------------------------------------------

---[FILE: evaluate_on_multiclass_classifier.py]---
Location: mlflow-master/examples/evaluation/evaluate_on_multiclass_classifier.py

```python
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

import mlflow

X, y = make_classification(n_samples=10000, n_classes=10, n_informative=5, random_state=1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

with mlflow.start_run() as run:
    model = LogisticRegression(solver="liblinear").fit(X_train, y_train)
    model_info = mlflow.sklearn.log_model(model, name="model")
    result = mlflow.evaluate(
        model_info.model_uri,
        X_test,
        targets=y_test,
        model_type="classifier",
        evaluators="default",
        evaluator_config={"log_model_explainability": True, "explainability_nsamples": 1000},
    )

print(f"run_id={run.info.run_id}")
print(f"metrics:\n{result.metrics}")
print(f"artifacts:\n{result.artifacts}")
```

--------------------------------------------------------------------------------

---[FILE: evaluate_on_regressor.py]---
Location: mlflow-master/examples/evaluation/evaluate_on_regressor.py

```python
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

import mlflow

california_housing_data = fetch_california_housing()

X_train, X_test, y_train, y_test = train_test_split(
    california_housing_data.data, california_housing_data.target, test_size=0.33, random_state=42
)

with mlflow.start_run() as run:
    model = LinearRegression().fit(X_train, y_train)
    model_info = mlflow.sklearn.log_model(model, name="model")

    result = mlflow.evaluate(
        model_info.model_uri,
        X_test,
        targets=y_test,
        model_type="regressor",
        evaluators="default",
        feature_names=california_housing_data.feature_names,
        evaluator_config={"explainability_nsamples": 1000},
    )

print(f"metrics:\n{result.metrics}")
print(f"artifacts:\n{result.artifacts}")
```

--------------------------------------------------------------------------------

---[FILE: evaluate_with_custom_code_metrics.py]---
Location: mlflow-master/examples/evaluation/evaluate_with_custom_code_metrics.py

```python
import os

import openai
import pandas as pd

import mlflow
from mlflow.metrics import make_metric
from mlflow.metrics.base import MetricValue, standard_aggregations

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."


# Helper function to check if a string is valid python code
def is_valid_python_code(code: str) -> bool:
    try:
        compile(code, "<string>", "exec")
        return True
    except SyntaxError:
        return False


# Create an evaluation function that iterates through the predictions
def eval_fn(predictions):
    scores = [int(is_valid_python_code(prediction)) for prediction in predictions]
    return MetricValue(
        scores=scores,
        aggregate_results=standard_aggregations(scores),
    )


# Create an EvaluationMetric object for the python code metric
valid_code_metric = make_metric(
    eval_fn=eval_fn, greater_is_better=False, name="valid_python_code", version="v1"
)

eval_df = pd.DataFrame(
    {
        "input": [
            "SELECT * FROM ",
            "import pandas",
            "def hello_world",
        ],
    }
)

with mlflow.start_run() as run:
    system_prompt = (
        "Generate code that is less than 50 characters. Return only python code and nothing else."
    )
    logged_model = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "{question}"},
        ],
    )

    results = mlflow.evaluate(
        logged_model.model_uri,
        eval_df,
        model_type="text",
        extra_metrics=[valid_code_metric],
    )
    print(results)

    eval_table = results.tables["eval_results_table"]
    print(eval_table)
```

--------------------------------------------------------------------------------

---[FILE: evaluate_with_custom_metrics.py]---
Location: mlflow-master/examples/evaluation/evaluate_with_custom_metrics.py

```python
import os

import matplotlib.pyplot as plt
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

import mlflow
from mlflow.models import infer_signature, make_metric

# loading the California housing dataset
cali_housing = fetch_california_housing(as_frame=True)

# split the dataset into train and test partitions
X_train, X_test, y_train, y_test = train_test_split(
    cali_housing.data, cali_housing.target, test_size=0.2, random_state=123
)

# train the model
lin_reg = LinearRegression().fit(X_train, y_train)

# Infer model signature
predictions = lin_reg.predict(X_train)
signature = infer_signature(X_train, predictions)

# creating the evaluation dataframe
eval_data = X_test.copy()
eval_data["target"] = y_test


def squared_diff_plus_one(eval_df, _builtin_metrics):
    """
    This example custom metric function creates a metric based on the ``prediction`` and
    ``target`` columns in ``eval_df`.
    """
    return np.sum(np.abs(eval_df["prediction"] - eval_df["target"] + 1) ** 2)


def sum_on_target_divided_by_two(_eval_df, builtin_metrics):
    """
    This example custom metric function creates a metric derived from existing metrics in
    ``builtin_metrics``.
    """
    return builtin_metrics["sum_on_target"] / 2


def prediction_target_scatter(eval_df, _builtin_metrics, artifacts_dir):
    """
    This example custom artifact generates and saves a scatter plot to ``artifacts_dir`` that
    visualizes the relationship between the predictions and targets for the given model to a
    file as an image artifact.
    """
    plt.scatter(eval_df["prediction"], eval_df["target"])
    plt.xlabel("Targets")
    plt.ylabel("Predictions")
    plt.title("Targets vs. Predictions")
    plot_path = os.path.join(artifacts_dir, "example_scatter_plot.png")
    plt.savefig(plot_path)
    return {"example_scatter_plot_artifact": plot_path}


with mlflow.start_run() as run:
    model_info = mlflow.sklearn.log_model(lin_reg, name="model", signature=signature)
    result = mlflow.evaluate(
        model=model_info.model_uri,
        data=eval_data,
        targets="target",
        model_type="regressor",
        evaluators=["default"],
        extra_metrics=[
            make_metric(
                eval_fn=squared_diff_plus_one,
                greater_is_better=False,
            ),
            make_metric(
                eval_fn=sum_on_target_divided_by_two,
                greater_is_better=True,
            ),
        ],
        custom_artifacts=[prediction_target_scatter],
    )

print(f"metrics:\n{result.metrics}")
print(f"artifacts:\n{result.artifacts}")
```

--------------------------------------------------------------------------------

---[FILE: evaluate_with_custom_metrics_comprehensive.py]---
Location: mlflow-master/examples/evaluation/evaluate_with_custom_metrics_comprehensive.py

```python
import numpy as np
import pandas as pd
from matplotlib.figure import Figure
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

import mlflow
from mlflow.models import infer_signature, make_metric

# loading the California housing dataset
cali_housing = fetch_california_housing(as_frame=True)

# split the dataset into train and test partitions
X_train, X_test, y_train, y_test = train_test_split(
    cali_housing.data, cali_housing.target, test_size=0.2, random_state=123
)

# train the model
lin_reg = LinearRegression().fit(X_train, y_train)

# Infer model signature
predictions = lin_reg.predict(X_train)
signature = infer_signature(X_train, predictions)

# creating the evaluation dataframe
eval_data = X_test.copy()
eval_data["target"] = y_test


def custom_metric(eval_df, _builtin_metrics):
    return np.sum(np.abs(eval_df["prediction"] - eval_df["target"] + 1) ** 2)


class ExampleClass:
    def __init__(self, x):
        self.x = x


def custom_artifact(eval_df, builtin_metrics, _artifacts_dir):
    example_np_arr = np.array([1, 2, 3])
    example_df = pd.DataFrame({"test": [2.2, 3.1], "test2": [3, 2]})
    example_dict = {"hello": "there", "test_list": [0.1, 0.3, 4]}
    example_dict.update(builtin_metrics)
    example_dict_2 = '{"a": 3, "b": [1, 2, 3]}'
    example_image = Figure()
    ax = example_image.subplots()
    ax.scatter(eval_df["prediction"], eval_df["target"])
    ax.set_xlabel("Targets")
    ax.set_ylabel("Predictions")
    ax.set_title("Targets vs. Predictions")
    example_custom_class = ExampleClass(10)

    return {
        "example_np_arr_from_obj_saved_as_npy": example_np_arr,
        "example_df_from_obj_saved_as_csv": example_df,
        "example_dict_from_obj_saved_as_json": example_dict,
        "example_image_from_obj_saved_as_png": example_image,
        "example_dict_from_json_str_saved_as_json": example_dict_2,
        "example_class_from_obj_saved_as_pickle": example_custom_class,
    }


with mlflow.start_run() as run:
    model_info = mlflow.sklearn.log_model(lin_reg, name="model", signature=signature)
    result = mlflow.evaluate(
        model=model_info.model_uri,
        data=eval_data,
        targets="target",
        model_type="regressor",
        evaluators=["default"],
        extra_metrics=[
            make_metric(
                eval_fn=custom_metric,
                greater_is_better=False,
            )
        ],
        custom_artifacts=[
            custom_artifact,
        ],
    )

print(f"metrics:\n{result.metrics}")
print(f"artifacts:\n{result.artifacts}")
```

--------------------------------------------------------------------------------

---[FILE: evaluate_with_function.py]---
Location: mlflow-master/examples/evaluation/evaluate_with_function.py

```python
import shap
import xgboost
from sklearn.model_selection import train_test_split

import mlflow

# Load the UCI Adult Dataset
X, y = shap.datasets.adult()

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

# Fit an XGBoost binary classifier on the training data split
model = xgboost.XGBClassifier().fit(X_train, y_train)

# Build the Evaluation Dataset from the test set
eval_data = X_test
eval_data["label"] = y_test


# Define a function that calls the model's predict method
def fn(X):
    return model.predict(X)


with mlflow.start_run() as run:
    # Evaluate the function without logging the model
    result = mlflow.evaluate(
        fn,
        eval_data,
        targets="label",
        model_type="classifier",
        evaluators=["default"],
    )

print(f"metrics:\n{result.metrics}")
print(f"artifacts:\n{result.artifacts}")
```

--------------------------------------------------------------------------------

---[FILE: evaluate_with_llm_judge.py]---
Location: mlflow-master/examples/evaluation/evaluate_with_llm_judge.py

```python
import os

import openai
import pandas as pd

import mlflow
from mlflow.metrics.genai import EvaluationExample, answer_similarity

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."


# testing with OpenAI gpt-4o-mini
example = EvaluationExample(
    input="What is MLflow?",
    output="MLflow is an open-source platform for managing machine "
    "learning workflows, including experiment tracking, model packaging, "
    "versioning, and deployment, simplifying the ML lifecycle.",
    score=4,
    justification="The definition effectively explains what MLflow is "
    "its purpose, and its developer. It could be more concise for a 5-score.",
    grading_context={
        "ground_truth": "MLflow is an open-source platform for managing "
        "the end-to-end machine learning (ML) lifecycle. It was developed by Databricks, "
        "a company that specializes in big data and machine learning solutions. MLflow is "
        "designed to address the challenges that data scientists and machine learning "
        "engineers face when developing, training, and deploying machine learning models."
    },
)

answer_similarity_metric = answer_similarity(examples=[example])

eval_df = pd.DataFrame(
    {
        "inputs": [
            "What is MLflow?",
            "What is Spark?",
            "What is Python?",
        ],
        "ground_truth": [
            "MLflow is an open-source platform for managing the end-to-end machine learning (ML) lifecycle. It was developed by Databricks, a company that specializes in big data and machine learning solutions. MLflow is designed to address the challenges that data scientists and machine learning engineers face when developing, training, and deploying machine learning models.",
            "Apache Spark is an open-source, distributed computing system designed for big data processing and analytics. It was developed in response to limitations of the Hadoop MapReduce computing model, offering improvements in speed and ease of use. Spark provides libraries for various tasks such as data ingestion, processing, and analysis through its components like Spark SQL for structured data, Spark Streaming for real-time data processing, and MLlib for machine learning tasks",
            "Python is a high-level programming language that was created by Guido van Rossum and released in 1991. It emphasizes code readability and allows developers to express concepts in fewer lines of code than languages like C++ or Java. Python is used in various domains, including web development, scientific computing, data analysis, and machine learning.",
        ],
    }
)

with mlflow.start_run() as run:
    system_prompt = "Answer the following question in two sentences"
    logged_model = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "{question}"},
        ],
    )

    results = mlflow.evaluate(
        logged_model.model_uri,
        eval_df,
        targets="ground_truth",
        model_type="question-answering",
        extra_metrics=[answer_similarity_metric],
    )
    print(results)

    eval_table = results.tables["eval_results_table"]
    print(eval_table)
```

--------------------------------------------------------------------------------

---[FILE: evaluate_with_model_validation.py]---
Location: mlflow-master/examples/evaluation/evaluate_with_model_validation.py

```python
import shap
import xgboost
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split

import mlflow
from mlflow.models import MetricThreshold, infer_signature, make_metric

# load UCI Adult Data Set; segment it into training and test sets
X, y = shap.datasets.adult()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

# train a candidate XGBoost model
candidate_model = xgboost.XGBClassifier().fit(X_train, y_train)
candidate_signature = infer_signature(X_train, candidate_model.predict(X_train))

# train a baseline dummy model
baseline_model = DummyClassifier(strategy="uniform").fit(X_train, y_train)
baseline_signature = infer_signature(X_train, baseline_model.predict(X_train))

# construct an evaluation dataset from the test set
eval_data = X_test
eval_data["label"] = y_test


# Define a custom metric to evaluate against
def double_positive(_eval_df, builtin_metrics):
    return builtin_metrics["true_positives"] * 2


# Define criteria for model to be validated against
thresholds = {
    # Specify metric value threshold
    "precision_score": MetricThreshold(
        threshold=0.7, greater_is_better=True
    ),  # precision should be >=0.7
    # Specify model comparison thresholds
    "recall_score": MetricThreshold(
        min_absolute_change=0.1,  # recall should be at least 0.1 greater than baseline model recall
        min_relative_change=0.1,  # recall should be at least 10 percent greater than baseline model recall
        greater_is_better=True,
    ),
    # Specify both metric value and model comparison thresholds
    "accuracy_score": MetricThreshold(
        threshold=0.8,  # accuracy should be >=0.8
        min_absolute_change=0.05,  # accuracy should be at least 0.05 greater than baseline model accuracy
        min_relative_change=0.05,  # accuracy should be at least 5 percent greater than baseline model accuracy
        greater_is_better=True,
    ),
    # Specify threshold for custom metric
    "double_positive": MetricThreshold(
        threshold=1e5,
        greater_is_better=False,  # double_positive should be <=1e5
    ),
}

double_positive_metric = make_metric(
    eval_fn=double_positive,
    greater_is_better=False,
)

with mlflow.start_run() as run:
    # Note: in most model validation use-cases the baseline model should instead b
    # a previously trained model (such as the current production model)
    baseline_model_uri = mlflow.sklearn.log_model(
        baseline_model, name="baseline_model", signature=baseline_signature
    ).model_uri

    # Evaluate the baseline model
    baseline_result = mlflow.evaluate(
        baseline_model_uri,
        eval_data,
        targets="label",
        model_type="classifier",
        extra_metrics=[double_positive_metric],
        # set to env_manager to "virtualenv" or "conda" to score the candidate and baseline models
        # in isolated Python environments where their dependencies are restored.
        env_manager="local",
    )

    # Evaluate the candidate model
    candidate_model_uri = mlflow.sklearn.log_model(
        candidate_model, name="candidate_model", signature=candidate_signature
    ).model_uri

    candidate_result = mlflow.evaluate(
        candidate_model_uri,
        eval_data,
        targets="label",
        model_type="classifier",
        extra_metrics=[double_positive_metric],
        env_manager="local",
    )


# Validate the candidate result against the baseline
mlflow.validate_evaluation_results(
    candidate_result=candidate_result,
    baseline_result=baseline_result,
    validation_thresholds=thresholds,
)
# If you would like to catch model validation failures, you can add try except clauses around
# the mlflow.evaluate() call and catch the ModelValidationFailedException, imported at the top
# of this file.
```

--------------------------------------------------------------------------------

---[FILE: evaluate_with_qa_metrics.py]---
Location: mlflow-master/examples/evaluation/evaluate_with_qa_metrics.py

```python
import openai
import pandas as pd

import mlflow

eval_df = pd.DataFrame(
    {
        "inputs": [
            "What is MLflow?",
            "What is Spark?",
            "What is Python?",
        ],
        "ground_truth": [
            "MLflow is an open-source platform for managing the end-to-end machine learning (ML) lifecycle. It was developed by Databricks, a company that specializes in big data and machine learning solutions. MLflow is designed to address the challenges that data scientists and machine learning engineers face when developing, training, and deploying machine learning models.",
            "Apache Spark is an open-source, distributed computing system designed for big data processing and analytics. It was developed in response to limitations of the Hadoop MapReduce computing model, offering improvements in speed and ease of use. Spark provides libraries for various tasks such as data ingestion, processing, and analysis through its components like Spark SQL for structured data, Spark Streaming for real-time data processing, and MLlib for machine learning tasks",
            "Python is a high-level programming language that was created by Guido van Rossum and released in 1991. It emphasizes code readability and allows developers to express concepts in fewer lines of code than languages like C++ or Java. Python is used in various domains, including web development, scientific computing, data analysis, and machine learning.",
        ],
    }
)

with mlflow.start_run() as run:
    system_prompt = "Answer the following question in two sentences"
    logged_model = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "{question}"},
        ],
    )

    results = mlflow.evaluate(
        logged_model.model_uri,
        eval_df,
        targets="ground_truth",
        model_type="question-answering",
        evaluators="default",
    )
    print(results.metrics)

    eval_table = results.tables["eval_results_table"]
    print(eval_table)
```

--------------------------------------------------------------------------------

---[FILE: evaluate_with_static_dataset.py]---
Location: mlflow-master/examples/evaluation/evaluate_with_static_dataset.py

```python
import shap
import xgboost
from sklearn.model_selection import train_test_split

import mlflow

# Load the UCI Adult Dataset
X, y = shap.datasets.adult()

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

# Fit an XGBoost binary classifier on the training data split
model = xgboost.XGBClassifier().fit(X_train, y_train)

# Build the Evaluation Dataset from the test set
y_test_pred = model.predict(X=X_test)
eval_data = X_test
eval_data["label"] = y_test
eval_data["predictions"] = y_test_pred


with mlflow.start_run() as run:
    # Evaluate the static dataset without providing a model
    result = mlflow.evaluate(
        data=eval_data,
        targets="label",
        predictions="predictions",
        model_type="classifier",
    )

print(f"metrics:\n{result.metrics}")
print(f"artifacts:\n{result.artifacts}")
```

--------------------------------------------------------------------------------

````
