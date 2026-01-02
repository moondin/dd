---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 42
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 42 of 991)

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

---[FILE: mlflow.data.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.data.rst

```text
mlflow.data
============

The ``mlflow.data`` module helps you record your model training and evaluation datasets to
runs with MLflow Tracking, as well as retrieve dataset information from runs. It provides the
following important interfaces:

* :py:class:`Dataset <mlflow.data.dataset.Dataset>`: Represents a dataset used in model training or
  evaluation, including features, targets, predictions, and metadata such as the dataset's name, digest (hash)
  schema, profile, and source. You can log this metadata to a run in MLflow Tracking using
  the :py:func:`mlflow.log_input()` API. ``mlflow.data`` provides APIs for constructing
  :py:class:`Datasets <mlflow.data.dataset.Dataset>` from a variety of Python data objects, including
  Pandas DataFrames (:py:func:`mlflow.data.from_pandas()`), NumPy arrays
  (:py:func:`mlflow.data.from_numpy()`), Spark DataFrames (:py:func:`mlflow.data.from_spark()`
  / :py:func:`mlflow.data.load_delta()`), Polars DataFrames (:py:func:`mlflow.data.from_polars()`), and more.

* :py:func:`DatasetSource <mlflow.data.dataset_source.DatasetSource>`: Represents the source of a
  dataset. For example, this may be a directory of files stored in S3, a Delta Table, or a web URL.
  Each :py:class:`Dataset <mlflow.data.dataset.Dataset>` references the source from which it was
  derived. A :py:class:`Dataset <mlflow.data.dataset.Dataset>`'s features and targets may differ
  from the source if transformations and filtering were applied. You can get the
  :py:func:`DatasetSource <mlflow.data.dataset_source.DatasetSource>` of a dataset logged to a
  run in MLflow Tracking using the :py:func:`mlflow.data.get_source()` API.

The following example demonstrates how to use ``mlflow.data`` to log a training dataset to a run,
retrieve information about the dataset from the run, and load the dataset's source.

.. code-block:: python

    import mlflow.data
    import pandas as pd
    from mlflow.data.pandas_dataset import PandasDataset

    # Construct a Pandas DataFrame using iris flower data from a web URL
    dataset_source_url = "http://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv"
    df = pd.read_csv(dataset_source_url)
    # Construct an MLflow PandasDataset from the Pandas DataFrame, and specify the web URL
    # as the source
    dataset: PandasDataset = mlflow.data.from_pandas(df, source=dataset_source_url)

    with mlflow.start_run():
        # Log the dataset to the MLflow Run. Specify the "training" context to indicate that the
        # dataset is used for model training
        mlflow.log_input(dataset, context="training")

    # Retrieve the run, including dataset information
    run = mlflow.get_run(mlflow.last_active_run().info.run_id)
    dataset_info = run.inputs.dataset_inputs[0].dataset
    print(f"Dataset name: {dataset_info.name}")
    print(f"Dataset digest: {dataset_info.digest}")
    print(f"Dataset profile: {dataset_info.profile}")
    print(f"Dataset schema: {dataset_info.schema}")

    # Load the dataset's source, which downloads the content from the source URL to the local
    # filesystem
    dataset_source = mlflow.data.get_source(dataset_info)
    dataset_source.load()

.. autoclass:: mlflow.data.dataset.Dataset
    :members:
    :undoc-members:
    :show-inheritance:

.. autoclass:: mlflow.data.dataset_source.DatasetSource
    :members:
    :undoc-members:
    :show-inheritance:
    :exclude-members: from_json

    .. method:: from_json(cls, source_json: str) -> DatasetSource

.. autofunction:: mlflow.data.get_source


pandas
~~~~~~

.. autofunction:: mlflow.data.from_pandas

.. autoclass:: mlflow.data.pandas_dataset.PandasDataset()
    :members:
    :undoc-members:
    :exclude-members: to_pyfunc, to_evaluation_dataset


NumPy
~~~~~

.. autofunction:: mlflow.data.from_numpy

.. autoclass:: mlflow.data.numpy_dataset.NumpyDataset()
    :members:
    :undoc-members:
    :exclude-members: to_pyfunc, to_evaluation_dataset


Spark
~~~~~

.. autofunction:: mlflow.data.load_delta

.. autofunction:: mlflow.data.from_spark

.. autoclass:: mlflow.data.spark_dataset.SparkDataset()
    :members:
    :undoc-members:
    :exclude-members: to_pyfunc, to_evaluation_dataset


Hugging Face 
~~~~~~~~~~~~

.. autofunction:: mlflow.data.huggingface_dataset.from_huggingface

.. autoclass:: mlflow.data.huggingface_dataset.HuggingFaceDataset()
    :members:
    :undoc-members:
    :exclude-members: to_pyfunc


TensorFlow 
~~~~~~~~~~~~

.. autofunction:: mlflow.data.tensorflow_dataset.from_tensorflow

.. autoclass:: mlflow.data.tensorflow_dataset.TensorFlowDataset()
    :members:
    :undoc-members:
    :exclude-members: to_pyfunc, 

.. autoclass:: mlflow.data.evaluation_dataset.EvaluationDataset()
    :members:
    :undoc-members:


polars
~~~~~~

.. autofunction:: mlflow.data.from_polars

.. autoclass:: mlflow.data.polars_dataset.PolarsDataset()
    :members:
    :undoc-members:
    :exclude-members: to_pyfunc, to_evaluation_dataset


Dataset Sources 
~~~~~~~~~~~~~~~~

.. autoclass:: mlflow.data.filesystem_dataset_source.FileSystemDatasetSource()
    :members:
    :undoc-members:

.. autoclass:: mlflow.data.http_dataset_source.HTTPDatasetSource()
    :members:
    :undoc-members:
    
.. autoclass:: mlflow.data.huggingface_dataset_source.HuggingFaceDatasetSource()
    :members:
    :undoc-members:
    :exclude-members:

.. autoclass:: mlflow.data.delta_dataset_source.DeltaDatasetSource()
    :members:
    :undoc-members:

.. autoclass:: mlflow.data.spark_dataset_source.SparkDatasetSource()
    :members:
    :undoc-members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.deployments.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.deployments.rst

```text
mlflow.deployments
==================

.. automodule:: mlflow.deployments
    :members:
    :undoc-members:
    :exclude-members: PredictionsResponse

.. autoclass:: mlflow.deployments.PredictionsResponse
    :members:
    :undoc-members:
    :exclude-members: from_json
```

--------------------------------------------------------------------------------

---[FILE: mlflow.dspy.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.dspy.rst

```text
mlflow.dspy
==================

.. automodule:: mlflow.dspy
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.entities.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.entities.rst

```text
mlflow.entities
===============

.. automodule:: mlflow.entities
    :members:
    :undoc-members:

.. automodule:: mlflow.entities.model_registry
    :members:
    :undoc-members:
    :exclude-members: Prompt

.. automodule:: mlflow.store.entities
    :members:
    :undoc-members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.environment_variables.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.environment_variables.rst

```text
mlflow.environment_variables
============================

.. automodule:: mlflow.environment_variables
    :members:
    :undoc-members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.gateway.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.gateway.rst

```text
mlflow.gateway
==============

.. automodule:: mlflow.gateway
    :members:
    :undoc-members:

.. automodule:: mlflow.gateway.base_models
    :members: ConfigModel

.. automodule:: mlflow.gateway.config
    :members:
    :undoc-members:
    :exclude-members: model_computed_fields
```

--------------------------------------------------------------------------------

---[FILE: mlflow.gemini.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.gemini.rst

```text
mlflow.gemini
==============

.. automodule:: mlflow.gemini
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.genai.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.genai.rst

```text
mlflow.genai
============

.. automodule:: mlflow.genai
    :members:
    :undoc-members:
    :show-inheritance:

.. automodule:: mlflow.genai.scorers
    :members:
    :undoc-members:
    :show-inheritance:
    :exclude-members: Scorer

.. automodule:: mlflow.genai.scorers.deepeval
    :members:
    :undoc-members:
    :show-inheritance:
    :exclude-members: DeepEvalScorer

.. automodule:: mlflow.genai.datasets
    :members:
    :undoc-members:
    :show-inheritance:

.. automodule:: mlflow.genai.label_schemas
    :members:
    :undoc-members:
    :show-inheritance:

.. automodule:: mlflow.genai.optimize
    :members:
    :undoc-members:
    :show-inheritance:

.. automodule:: mlflow.genai.judges
    :members:
    :undoc-members:
    :show-inheritance:

.. automodule:: mlflow.genai.agent_server
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.groq.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.groq.rst

```text
mlflow.groq
================

.. automodule:: mlflow.groq
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.h2o.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.h2o.rst

```text
mlflow.h2o
==========

.. automodule:: mlflow.h2o
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.haystack.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.haystack.rst

```text
mlflow.haystack
==================

.. automodule:: mlflow.haystack
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.johnsnowlabs.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.johnsnowlabs.rst

```text
mlflow.johnsnowlabs
===================

.. automodule:: mlflow.johnsnowlabs
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.keras.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.keras.rst

```text
mlflow.keras
==================

.. automodule:: mlflow.keras.autolog
    :members:
    :undoc-members:
    :show-inheritance:

.. automodule:: mlflow.keras.callback
    :members:
    :undoc-members:
    :show-inheritance:

.. automodule:: mlflow.keras.load
    :members:
    :undoc-members:
    :show-inheritance:

.. automodule:: mlflow.keras.save
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.langchain.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.langchain.rst

```text
mlflow.langchain
==================

.. automodule:: mlflow.langchain
    :members:
    :undoc-members:
    :show-inheritance:

.. autoclass:: mlflow.langchain.chat_agent_langgraph.ChatAgentState

.. autoclass:: mlflow.langchain.chat_agent_langgraph.ChatAgentToolNode

.. autoclass:: mlflow.langchain.output_parsers.ChatAgentOutputParser
```

--------------------------------------------------------------------------------

---[FILE: mlflow.lightgbm.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.lightgbm.rst

```text
mlflow.lightgbm
===============

.. automodule:: mlflow.lightgbm
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.litellm.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.litellm.rst

```text
mlflow.litellm
==============

.. automodule:: mlflow.litellm
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.llama_index.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.llama_index.rst

```text
mlflow.llama_index
==================

.. automodule:: mlflow.llama_index
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.metrics.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.metrics.rst

```text
mlflow.metrics
==============

The ``mlflow.metrics`` module helps you quantitatively and qualitatively measure your models. 

.. autoclass:: mlflow.metrics.EvaluationMetric

These :py:class:`EvaluationMetric <mlflow.metrics.EvaluationMetric>` are used by the :py:func:`mlflow.evaluate()` API, either computed automatically depending on the ``model_type`` or specified via the ``extra_metrics`` parameter.

The following code demonstrates how to use :py:func:`mlflow.evaluate()` with an  :py:class:`EvaluationMetric <mlflow.metrics.EvaluationMetric>`.

.. code-block:: python

    import mlflow
    from mlflow.metrics.genai import EvaluationExample, answer_similarity

    eval_df = pd.DataFrame(
        {
            "inputs": [
                "What is MLflow?",
            ],
            "ground_truth": [
                "MLflow is an open-source platform for managing the end-to-end machine learning lifecycle. It was developed by Databricks, a company that specializes in big data and machine learning solutions. MLflow is designed to address the challenges that data scientists and machine learning engineers face when developing, training, and deploying machine learning models.",
            ],
        }
    )

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
    results = mlflow.evaluate(
        logged_model.model_uri,
        eval_df,
        targets="ground_truth",
        model_type="question-answering",
        extra_metrics=[answer_similarity_metric],
    )

Information about how an :py:class:`EvaluationMetric <mlflow.metrics.EvaluationMetric>` is calculated, such as the grading prompt used is available via the ``metric_details`` property.

.. code-block:: python

    import mlflow
    from mlflow.metrics.genai import relevance

    my_relevance_metric = relevance()
    print(my_relevance_metric.metric_details)

Evaluation results are stored as :py:class:`MetricValue <mlflow.metrics.MetricValue>`. Aggregate results are logged to the MLflow run as metrics, while per-example results are logged to the MLflow run as artifacts in the form of an evaluation table.

.. autoclass:: mlflow.metrics.MetricValue

We provide the following builtin factory functions to create :py:class:`EvaluationMetric <mlflow.metrics.EvaluationMetric>` for evaluating models. These metrics are computed automatically depending on the ``model_type``. For more information on the ``model_type`` parameter, see :py:func:`mlflow.evaluate()` API.

Regressor Metrics
-----------------

.. autofunction:: mlflow.metrics.mae

.. autofunction:: mlflow.metrics.mape

.. autofunction:: mlflow.metrics.max_error

.. autofunction:: mlflow.metrics.mse

.. autofunction:: mlflow.metrics.rmse

.. autofunction:: mlflow.metrics.r2_score

Classifier Metrics
------------------

.. autofunction:: mlflow.metrics.precision_score

.. autofunction:: mlflow.metrics.recall_score

.. autofunction:: mlflow.metrics.f1_score

Text Metrics
------------

.. autofunction:: mlflow.metrics.ari_grade_level

.. autofunction:: mlflow.metrics.flesch_kincaid_grade_level

Question Answering Metrics
---------------------------

Includes all of the above **Text Metrics** as well as the following:

.. autofunction:: mlflow.metrics.exact_match

.. autofunction:: mlflow.metrics.rouge1

.. autofunction:: mlflow.metrics.rouge2

.. autofunction:: mlflow.metrics.rougeL

.. autofunction:: mlflow.metrics.rougeLsum

.. autofunction:: mlflow.metrics.toxicity

.. autofunction:: mlflow.metrics.token_count

.. autofunction:: mlflow.metrics.latency

.. autofunction:: mlflow.metrics.bleu

Retriever Metrics
-----------------

The following metrics are built-in metrics for the ``'retriever'`` model type, meaning they will be 
automatically calculated with a default ``retriever_k`` value of 3. 

To evaluate document retrieval models, it is recommended to use a dataset with the following 
columns:

- Input queries
- Retrieved relevant doc IDs
- Ground-truth doc IDs

Alternatively, you can also provide a function through the ``model`` parameter to represent 
your retrieval model. The function should take a Pandas DataFrame containing input queries and 
ground-truth relevant doc IDs, and return a DataFrame with a column of retrieved relevant doc IDs.

A "doc ID" is a string or integer that uniquely identifies a document. Each row of the retrieved and
ground-truth doc ID columns should consist of a list or numpy array of doc IDs.

Parameters:

- ``targets``: A string specifying the column name of the ground-truth relevant doc IDs
- ``predictions``: A string specifying the column name of the retrieved relevant doc IDs in either 
  the static dataset or the Dataframe returned by the ``model`` function
- ``retriever_k``: A positive integer specifying the number of retrieved docs IDs to consider for 
  each input query. ``retriever_k`` defaults to 3. You can change ``retriever_k`` by using the 
  :py:func:`mlflow.evaluate` API:

    1. .. code-block:: python

        # with a model and using `evaluator_config`
        mlflow.evaluate(
            model=retriever_function,
            data=data,
            targets="ground_truth",
            model_type="retriever",
            evaluators="default",
            evaluator_config={"retriever_k": 5}
        )
    2. .. code-block:: python

        # with a static dataset and using `extra_metrics`
        mlflow.evaluate(
            data=data,
            predictions="predictions_param",
            targets="targets_param",
            model_type="retriever",
            extra_metrics = [
                mlflow.metrics.precision_at_k(5),
                mlflow.metrics.precision_at_k(6),
                mlflow.metrics.recall_at_k(5),
                mlflow.metrics.ndcg_at_k(5)
            ]   
        )
    
    NOTE: In the 2nd method, it is recommended to omit the ``model_type`` as well, or else 
    ``precision@3`` and ``recall@3`` will be  calculated in  addition to ``precision@5``, 
    ``precision@6``, ``recall@5``, and ``ndcg_at_k@5``.

.. autofunction:: mlflow.metrics.precision_at_k

.. autofunction:: mlflow.metrics.recall_at_k

.. autofunction:: mlflow.metrics.ndcg_at_k

Users create their own :py:class:`EvaluationMetric <mlflow.metrics.EvaluationMetric>` using the :py:func:`make_metric <mlflow.metrics.make_metric>` factory function

.. autofunction:: mlflow.metrics.make_metric

.. automodule:: mlflow.metrics
    :members:
    :undoc-members:
    :show-inheritance:
    :exclude-members: MetricValue, EvaluationMetric, make_metric, EvaluationExample, ari_grade_level, flesch_kincaid_grade_level, exact_match, rouge1, rouge2, rougeL, rougeLsum, toxicity, answer_similarity, answer_correctness, faithfulness, answer_relevance, mae, mape, max_error, mse, rmse, r2_score, precision_score, recall_score, f1_score, token_count, latency, precision_at_k, recall_at_k, ndcg_at_k, bleu

Generative AI Metrics
---------------------

We also provide generative AI ("genai") :py:class:`EvaluationMetric <mlflow.metrics.EvaluationMetric>`\s for evaluating text models. These metrics use an LLM to evaluate the quality of a model's output text. Note that your use of a third party LLM service (e.g., OpenAI) for evaluation may be subject to and governed by the LLM service's terms of use. The following factory functions help you customize the intelligent metric to your use case.

.. automodule:: mlflow.metrics.genai
    :members:
    :undoc-members:
    :show-inheritance:
    :exclude-members: EvaluationExample, make_genai_metric

You can also create your own generative AI :py:class:`EvaluationMetric <mlflow.metrics.EvaluationMetric>`\s using the :py:func:`make_genai_metric <mlflow.metrics.genai.make_genai_metric>` factory function.

.. autofunction:: mlflow.metrics.genai.make_genai_metric

When using generative AI :py:class:`EvaluationMetric <mlflow.metrics.EvaluationMetric>`\s, it is important to pass in an :py:class:`EvaluationExample <mlflow.metrics.genai.EvaluationExample>`

.. autoclass:: mlflow.metrics.genai.EvaluationExample

Users must set the appropriate environment variables for the LLM service they are using for 
evaluation. For example, if you are using OpenAI's API, you must set the ``OPENAI_API_KEY`` 
environment variable. If using Azure OpenAI, you must also set the ``OPENAI_API_TYPE``, 
``OPENAI_API_VERSION``, ``OPENAI_API_BASE``, and ``OPENAI_DEPLOYMENT_NAME`` environment variables. 
See `Azure OpenAI documentation <https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/switching-endpoints>`_
Users do not need to set these environment variables if they are using a gateway route.
```

--------------------------------------------------------------------------------

---[FILE: mlflow.mistral.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.mistral.rst

```text
mlflow.mistral
==============

.. automodule:: mlflow.mistral
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.models.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.models.rst

```text
mlflow.models
==============

.. automodule:: mlflow.models
    :members:
    :undoc-members:
    :show-inheritance:
    :exclude-members: EvaluationMetric

.. autoclass:: mlflow.models.model.ModelInfo
    :members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.onnx.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.onnx.rst

```text
mlflow.onnx
==================

.. automodule:: mlflow.onnx
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.openai.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.openai.rst

```text
mlflow.openai
=============

.. automodule:: mlflow.openai
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.paddle.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.paddle.rst

```text
mlflow.paddle
==================

.. automodule:: mlflow.paddle
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.pmdarima.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.pmdarima.rst

```text
mlflow.pmdarima
===============

.. automodule:: mlflow.pmdarima
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.projects.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.projects.rst

```text
mlflow.projects
===============

.. automodule:: mlflow.projects
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.prophet.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.prophet.rst

```text
mlflow.prophet
==================

.. automodule:: mlflow.prophet
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.pydantic_ai.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.pydantic_ai.rst

```text
mlflow.pydantic_ai
==================

.. automodule:: mlflow.pydantic_ai
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.pyfunc.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.pyfunc.rst

```text
mlflow.pyfunc
=============

.. automodule:: mlflow.pyfunc
    :members:
    :undoc-members:
    :show-inheritance:

.. Include ``get_default_pip_requirements`` and ``get_default_conda_env``,
   which are imported from `mlflow.pyfunc.model`, in the `mlflow.pyfunc` namespace
.. autofunction:: mlflow.pyfunc.get_default_pip_requirements
.. autofunction:: mlflow.pyfunc.get_default_conda_env

.. Include ``PythonModelContext`` as a renamed class to avoid documenting constructor parameters.
   This class is meant to be constructed implicitly, and users should only be aware of its
   documented member properties.
.. autoclass:: mlflow.pyfunc.PythonModelContext()
    :members:
    :undoc-members:

.. Include ``PythonModel``, which is imported from `mlflow.pyfunc.model`, in the
   `mlflow.pyfunc` namespace
.. autoclass:: mlflow.pyfunc.PythonModel
    :members:
    :undoc-members:

.. Include ``ChatModel``, which is imported from `mlflow.pyfunc.model`, in the
   `mlflow.pyfunc` namespace
.. autoclass:: mlflow.pyfunc.ChatModel
    :members:
    :undoc-members:

.. Include ``ChatAgent``, which is imported from `mlflow.pyfunc.model`, in the
   `mlflow.pyfunc` namespace
.. autoclass:: mlflow.pyfunc.ChatAgent
    :members:
    :undoc-members:

.. Include ``ResponsesAgent``, which is imported from `mlflow.pyfunc.model`, in the
   `mlflow.pyfunc` namespace
.. autoclass:: mlflow.pyfunc.ResponsesAgent
    :members:
    :undoc-members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.pyspark.ml.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.pyspark.ml.rst

```text
mlflow.pyspark.ml
=================

.. automodule:: mlflow.pyspark.ml
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.pytorch.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.pytorch.rst

```text
mlflow.pytorch
==================

.. automodule:: mlflow.pytorch
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.rst

```text
mlflow
======

.. automodule:: mlflow
    :members:
    :undoc-members:
    :exclude-members:
        MlflowClient,
        add_trace,
        trace,
        start_span,
        start_span_no_context,
        get_trace,
        search_traces,
        log_assessment,
        log_expectation,
        log_feedback,
        update_assessment,
        delete_assessment,
        get_current_active_span,
        get_last_active_trace_id,
        create_external_model,
        delete_logged_model_tag,
        finalize_logged_model,
        get_logged_model,
        initialize_logged_model,
        last_logged_model,
        search_logged_models,
        set_active_model,
        set_logged_model_tags,
        log_model_params,
        clear_active_model,
        load_prompt,
        register_prompt,
        search_prompts,
        set_prompt_alias,
        delete_prompt_alias,

.. _mlflow-tracing-fluent-python-apis:

MLflow Tracing APIs
===================

The ``mlflow`` module provides a set of high-level APIs for `MLflow Tracing <../llms/tracing/index.html>`_. For the detailed
guidance on how to use these tracing APIs, please refer to the `Tracing Fluent APIs Guide <../llms/tracing/index.html#tracing-fluent-apis>`_.

.. autofunction:: mlflow.trace
.. autofunction:: mlflow.start_span
.. autofunction:: mlflow.start_span_no_context
.. autofunction:: mlflow.get_trace
.. autofunction:: mlflow.search_traces
.. autofunction:: mlflow.get_current_active_span
.. autofunction:: mlflow.get_last_active_trace_id
.. autofunction:: mlflow.add_trace
.. autofunction:: mlflow.log_assessment
.. autofunction:: mlflow.log_expectation
.. autofunction:: mlflow.log_feedback
.. autofunction:: mlflow.update_assessment
.. autofunction:: mlflow.delete_assessment

.. automodule:: mlflow.tracing
    :members:
    :undoc-members:
    :noindex:

.. _mlflow-logged-model-fluent-python-apis:

MLflow Logged Model APIs
========================

The ``mlflow`` module provides a set of high-level APIs to interact with ``MLflow Logged Models``.

.. autofunction:: mlflow.clear_active_model
.. autofunction:: mlflow.create_external_model
.. autofunction:: mlflow.delete_logged_model_tag
.. autofunction:: mlflow.finalize_logged_model
.. autofunction:: mlflow.get_logged_model
.. autofunction:: mlflow.initialize_logged_model
.. autofunction:: mlflow.last_logged_model
.. autofunction:: mlflow.search_logged_models
.. autofunction:: mlflow.set_active_model
.. autofunction:: mlflow.set_logged_model_tags
.. autofunction:: mlflow.log_model_params
```

--------------------------------------------------------------------------------

---[FILE: mlflow.sagemaker.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.sagemaker.rst

```text
mlflow.sagemaker
================

.. automodule:: mlflow.sagemaker
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.sentence_transformers.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.sentence_transformers.rst

```text
mlflow.sentence_transformers
============================

.. automodule:: mlflow.sentence_transformers
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.server.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.server.rst

```text
mlflow.server
=============

.. automodule:: mlflow.server
    :members: get_app_client
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.shap.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.shap.rst

```text
mlflow.shap
===========

.. automodule:: mlflow.shap
    :members:
    :undoc-members:
    :show-inheritance:
    :exclude-members: save_model
```

--------------------------------------------------------------------------------

---[FILE: mlflow.sklearn.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.sklearn.rst

```text
mlflow.sklearn
==============

.. automodule:: mlflow.sklearn
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.smolagents.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.smolagents.rst

```text
mlflow.smolagents
==================

.. automodule:: mlflow.smolagents
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.spacy.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.spacy.rst

```text
mlflow.spacy
============

.. automodule:: mlflow.spacy
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.spark.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.spark.rst

```text
mlflow.spark
===============

.. automodule:: mlflow.spark
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.statsmodels.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.statsmodels.rst

```text
mlflow.statsmodels
==================

.. automodule:: mlflow.statsmodels
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.strands.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.strands.rst

```text
mlflow.strands
==================

.. automodule:: mlflow.strands
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.system_metrics.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.system_metrics.rst

```text
mlflow.system_metrics
======================

.. automodule:: mlflow.system_metrics
    :members:
    :undoc-members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.tensorflow.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.tensorflow.rst

```text
mlflow.tensorflow
==================

.. automodule:: mlflow.tensorflow
    :members:
    :undoc-members:
    :show-inheritance:

.. autoclass:: mlflow.tensorflow.MlflowCallback
    :members:
    :undoc-members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.tracing.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.tracing.rst

```text
mlflow.tracing
==============

.. attention::

    The ``mlflow.tracing`` namespace only contains a few utility functions fo managing traces. The main entry point for MLflow
    Tracing is :ref:`Tracing Fluent APIs <mlflow-tracing-fluent-python-apis>` defined directly under the
    :py:mod:`mlflow` namespace, or the low-level `Tracing Client APIs <../llms/tracing/index.html#tracing-client-apis>`_

.. automodule:: mlflow.tracing
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.transformers.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.transformers.rst

```text
mlflow.transformers
===================

.. automodule:: mlflow.transformers
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.types.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.types.rst

```text
mlflow.types
==============

.. automodule:: mlflow.types
    :members:
    :show-inheritance:

.. automodule:: mlflow.types.responses
    :members:

.. automodule:: mlflow.types.responses_helpers
    :members:

.. automodule:: mlflow.types.agent
    :members:

.. automodule:: mlflow.types.llm
    :members:

.. automodule:: mlflow.types.chat
    :members:

.. automodule:: mlflow.types.schema
    :members: Array, Map, Object, Property, AnyType
    :undoc-members:

.. automodule:: mlflow.types.llm._BaseDataclass
    :undoc-members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.utils.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.utils.rst

```text
mlflow.utils
==================

.. automodule:: mlflow.utils.async_logging
    :members:
    :undoc-members:

.. automodule:: mlflow.utils.async_logging.run_operations
    :members:
    :undoc-members:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.webhooks.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.webhooks.rst

```text
mlflow.webhooks
===============

.. automodule:: mlflow.webhooks
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.xgboost.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/mlflow.xgboost.rst

```text
mlflow.xgboost
==============

.. automodule:: mlflow.xgboost
    :members:
    :undoc-members:
    :show-inheritance:
```

--------------------------------------------------------------------------------

---[FILE: mlflow.exceptions.rst]---
Location: mlflow-master/docs/api_reference/source/python_api/exceptions/mlflow.exceptions.rst

```text
:orphan:

mlflow.exceptions
=================

.. exception:: mlflow.exceptions.MlflowException(message, error_code=1, **kwargs)

    Generic exception thrown when an MLflow operation fails

.. automodule:: mlflow.exceptions
    :members:
    :undoc-members:
    :show-inheritance:
    :exclude-members:
        MlflowException
```

--------------------------------------------------------------------------------

````
