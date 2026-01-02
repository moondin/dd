---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 798
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 798 of 991)

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

---[FILE: test_fluent.py]---
Location: mlflow-master/tests/evaluate/logging/test_fluent.py

```python
import pytest

import mlflow
from mlflow.entities import Metric
from mlflow.evaluation import Assessment, Evaluation, log_evaluations
from mlflow.evaluation.assessment import AssessmentSource, AssessmentSourceType
from mlflow.evaluation.evaluation_tag import EvaluationTag

from tests.evaluate.logging.utils import get_evaluation


@pytest.fixture
def end_run_at_test_end():
    yield
    mlflow.end_run()


def test_log_evaluations_with_minimal_params_succeeds():
    inputs1 = {"feature1": 1.0, "feature2": 2.0}
    outputs1 = {"prediction": 0.5}

    inputs2 = {"feature3": 3.0, "feature4": 4.0}
    outputs2 = {"prediction": 0.8}

    with mlflow.start_run():
        # Create evaluation objects
        evaluation1 = Evaluation(inputs=inputs1, outputs=outputs1)
        evaluation2 = Evaluation(inputs=inputs2, outputs=outputs2)

        # Log the evaluations
        logged_evaluations = log_evaluations(evaluations=[evaluation1, evaluation2])
        assert len(logged_evaluations) == 2

        for logged_evaluation, expected_evaluation in zip(
            logged_evaluations, [evaluation1, evaluation2]
        ):
            assert logged_evaluation.inputs == expected_evaluation.inputs
            assert logged_evaluation.outputs == expected_evaluation.outputs
            retrieved_evaluation = get_evaluation(
                evaluation_id=logged_evaluation.evaluation_id,
                run_id=mlflow.active_run().info.run_id,
            )
            assert retrieved_evaluation is not None
            assert retrieved_evaluation.inputs == logged_evaluation.inputs
            assert retrieved_evaluation.outputs == logged_evaluation.outputs


def test_log_evaluations_with_all_params():
    evaluations_data = [
        (
            {"feature1": 1.0, "feature2": 2.0},
            {"prediction": 0.5},
            {"actual": 1.0},
            [
                {
                    "name": "assessment1",
                    "value": 1.0,
                    "source": {
                        "source_type": "HUMAN",
                        "source_id": "user_1",
                    },
                },
                {
                    "name": "assessment2",
                    "value": 0.84,
                    "source": {
                        "source_type": "HUMAN",
                        "source_id": "user_1",
                    },
                },
            ],
            [
                Metric(key="metric1", value=1.4, timestamp=1717047609503, step=0),
                Metric(key="metric2", value=1.2, timestamp=1717047609504, step=0),
            ],
            {"tag1": "value1", "tag2": "value2"},
        ),
        (
            {"feature1": "text1", "feature2": "text2"},
            {"prediction": "output_text"},
            {"actual": "expected_text"},
            [
                Assessment(
                    name="accuracy",
                    value=0.8,
                    source=AssessmentSource(
                        source_type=AssessmentSourceType.HUMAN,
                        source_id="user-1",
                    ),
                )
            ],
            {"metric1": 0.8, "metric2": 0.84},
            {"tag3": "value3", "tag4": "value4"},
        ),
    ]

    inputs_id = "unique-inputs-id"
    request_id = "unique-request-id"

    with mlflow.start_run() as run:
        run_id = run.info.run_id

        evaluations = []
        for inputs, outputs, targets, assessments, metrics, tags in evaluations_data:
            if isinstance(assessments[0], dict):
                assessments = [Assessment.from_dictionary(assessment) for assessment in assessments]

            if isinstance(metrics, dict):
                metrics = [
                    Metric(key=key, value=value, timestamp=0, step=0)
                    for key, value in metrics.items()
                ]

            evaluation = Evaluation(
                inputs=inputs,
                outputs=outputs,
                inputs_id=inputs_id,
                request_id=request_id,
                targets=targets,
                assessments=assessments,
                metrics=metrics,
                tags=tags,
            )
            evaluations.append(evaluation)

        # Log the evaluations
        logged_evaluations = log_evaluations(evaluations=evaluations, run_id=run_id)

        for logged_evaluation, (inputs, outputs, targets, assessments, metrics, tags) in zip(
            logged_evaluations, evaluations_data
        ):
            # Assert the fields of the logged evaluation
            assert logged_evaluation.inputs == inputs
            assert logged_evaluation.outputs == outputs
            assert logged_evaluation.inputs_id == inputs_id
            assert logged_evaluation.request_id == request_id
            assert logged_evaluation.targets == targets

            logged_metrics = (
                {metric.key: metric.value for metric in logged_evaluation.metrics}
                if isinstance(metrics, list) and isinstance(metrics[0], Metric)
                else metrics
            )
            assert {
                metric.key: metric.value for metric in logged_evaluation.metrics
            } == logged_metrics

            logged_tags = (
                {tag.key: tag.value for tag in logged_evaluation.tags}
                if isinstance(tags, list) and isinstance(tags[0], EvaluationTag)
                else tags
            )
            assert {tag.key: tag.value for tag in logged_evaluation.tags} == logged_tags

            assessment_entities = [
                Assessment.from_dictionary(assessment)._to_entity(
                    evaluation_id=logged_evaluation.evaluation_id
                )
                if isinstance(assessment, dict)
                else assessment._to_entity(evaluation_id=logged_evaluation.evaluation_id)
                for assessment in assessments
            ]

            for logged_assessment, assessment_entity in zip(
                logged_evaluation.assessments, assessment_entities
            ):
                assert logged_assessment.name == assessment_entity.name
                assert logged_assessment.boolean_value == assessment_entity.boolean_value
                assert logged_assessment.numeric_value == assessment_entity.numeric_value
                assert logged_assessment.string_value == assessment_entity.string_value
                assert logged_assessment.metadata == assessment_entity.metadata
                assert logged_assessment.source == assessment_entity.source

            retrieved_evaluation = get_evaluation(
                evaluation_id=logged_evaluation.evaluation_id, run_id=run_id
            )
            assert logged_evaluation == retrieved_evaluation


def test_log_evaluations_starts_run_if_not_started(end_run_at_test_end):
    inputs = {"feature1": 1.0, "feature2": {"nested_feature": 2.0}}
    outputs = {"prediction": 0.5}

    # Ensure there is no active run
    if mlflow.active_run() is not None:
        mlflow.end_run()

    # Log evaluation without explicitly starting a run
    logged_evaluation = log_evaluations(evaluations=[Evaluation(inputs=inputs, outputs=outputs)])[0]

    # Verify that a run has been started
    active_run = mlflow.active_run()
    assert active_run is not None, "Expected a run to be started automatically."

    # Retrieve the evaluation using the run ID
    retrieved_evaluation = get_evaluation(
        evaluation_id=logged_evaluation.evaluation_id, run_id=active_run.info.run_id
    )
    assert retrieved_evaluation == logged_evaluation


def test_evaluation_module_exposes_relevant_apis_for_logging():
    import mlflow.evaluation

    assert hasattr(mlflow.evaluation, "log_evaluations")
    assert hasattr(mlflow.evaluation, "Evaluation")
    assert hasattr(mlflow.evaluation, "Assessment")
    assert hasattr(mlflow.evaluation, "AssessmentSource")
    assert hasattr(mlflow.evaluation, "AssessmentSourceType")


def test_log_evaluations_works_properly_with_empty_evaluations_list():
    with mlflow.start_run():
        log_evaluations(evaluations=[])

        artifacts = mlflow.MlflowClient().list_artifacts(mlflow.active_run().info.run_id)
        assert len(artifacts) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_utils.py]---
Location: mlflow-master/tests/evaluate/logging/test_utils.py

```python
from mlflow.entities import Metric
from mlflow.evaluation.assessment import AssessmentEntity, AssessmentSource
from mlflow.evaluation.evaluation import EvaluationEntity
from mlflow.evaluation.evaluation_tag import EvaluationTag
from mlflow.evaluation.utils import evaluations_to_dataframes


def test_evaluations_to_dataframes_basic():
    # Setup an evaluation with minimal data
    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
    )

    evaluations_df, metrics_df, assessments_df, tags_df = evaluations_to_dataframes([evaluation])

    # Check the evaluations DataFrame
    assert len(evaluations_df) == 1
    assert evaluations_df["evaluation_id"].iloc[0] == "eval1"
    assert evaluations_df["run_id"].iloc[0] == "run1"
    assert evaluations_df["inputs_id"].iloc[0] == "inputs1"
    assert evaluations_df["inputs"].iloc[0] == {"feature1": 1.0, "feature2": 2.0}

    # Check that the other DataFrames are empty
    assert metrics_df.empty
    assert assessments_df.empty
    assert tags_df.empty


def test_evaluations_to_dataframes_full_data():
    # Setup an evaluation with full data
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = AssessmentEntity(
        evaluation_id="eval1",
        name="accuracy",
        source=source,
        timestamp=123456789,
        numeric_value=0.95,
        rationale="Good performance",
    )
    metric = Metric(key="metric1", value=0.9, timestamp=1234567890, step=0)
    tag = EvaluationTag(key="tag1", value="value1")

    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
        outputs={"output1": 0.5},
        request_id="request1",
        targets={"target1": 0.6},
        error_code="E001",
        error_message="An error occurred",
        assessments=[assessment],
        metrics=[metric],
        tags=[tag],
    )

    evaluations_df, metrics_df, assessments_df, tags_df = evaluations_to_dataframes([evaluation])

    # Check the evaluations DataFrame
    assert len(evaluations_df) == 1
    assert evaluations_df["evaluation_id"].iloc[0] == "eval1"
    assert evaluations_df["run_id"].iloc[0] == "run1"
    assert evaluations_df["inputs_id"].iloc[0] == "inputs1"
    assert evaluations_df["inputs"].iloc[0] == {"feature1": 1.0, "feature2": 2.0}
    assert evaluations_df["outputs"].iloc[0] == {"output1": 0.5}
    assert evaluations_df["request_id"].iloc[0] == "request1"
    assert evaluations_df["targets"].iloc[0] == {"target1": 0.6}
    assert evaluations_df["error_code"].iloc[0] == "E001"
    assert evaluations_df["error_message"].iloc[0] == "An error occurred"

    # Check the metrics DataFrame
    assert len(metrics_df) == 1
    assert metrics_df["evaluation_id"].iloc[0] == "eval1"
    assert metrics_df["key"].iloc[0] == "metric1"
    assert metrics_df["value"].iloc[0] == 0.9
    assert metrics_df["timestamp"].iloc[0] == 1234567890

    # Check the assessments DataFrame
    assert len(assessments_df) == 1
    assert assessments_df["evaluation_id"].iloc[0] == "eval1"
    assert assessments_df["name"].iloc[0] == "accuracy"
    assert assessments_df["source"].iloc[0] == source.to_dictionary()
    assert assessments_df["boolean_value"].iloc[0] is None
    assert assessments_df["numeric_value"].iloc[0] == 0.95
    assert assessments_df["string_value"].iloc[0] is None
    assert assessments_df["rationale"].iloc[0] == "Good performance"
    assert assessments_df["error_code"].iloc[0] is None
    assert assessments_df["error_message"].iloc[0] is None

    # Check the tags DataFrame
    assert len(tags_df) == 1
    assert tags_df["evaluation_id"].iloc[0] == "eval1"
    assert tags_df["key"].iloc[0] == "tag1"
    assert tags_df["value"].iloc[0] == "value1"


def test_evaluations_to_dataframes_empty():
    # Empty evaluations list
    evaluations_df, metrics_df, assessments_df, tags_df = evaluations_to_dataframes([])

    # Verify that the DataFrames are empty
    assert evaluations_df.empty
    assert metrics_df.empty
    assert assessments_df.empty
    assert tags_df.empty

    # Verify the column names of the empty DataFrames
    expected_evaluation_columns = [
        "evaluation_id",
        "run_id",
        "inputs_id",
        "inputs",
        "outputs",
        "request_id",
        "targets",
        "error_code",
        "error_message",
    ]
    expected_metrics_columns = [
        "evaluation_id",
        "key",
        "value",
        "timestamp",
        "model_id",
        "dataset_name",
        "dataset_digest",
        "run_id",
    ]
    expected_assessments_columns = [
        "evaluation_id",
        "name",
        "source",
        "timestamp",
        "boolean_value",
        "numeric_value",
        "string_value",
        "rationale",
        "metadata",
        "error_code",
        "error_message",
        "span_id",
    ]
    expected_tags_columns = ["evaluation_id", "key", "value"]

    assert list(evaluations_df.columns) == expected_evaluation_columns
    assert list(metrics_df.columns) == expected_metrics_columns
    assert list(assessments_df.columns) == expected_assessments_columns
    assert list(tags_df.columns) == expected_tags_columns


def test_evaluations_to_dataframes_basic():
    # Setup an evaluation with minimal data
    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
    )

    evaluations_df, metrics_df, assessments_df, tags_df = evaluations_to_dataframes([evaluation])

    # Check the evaluations DataFrame
    assert len(evaluations_df) == 1
    assert evaluations_df["evaluation_id"].iloc[0] == "eval1"
    assert evaluations_df["run_id"].iloc[0] == "run1"
    assert evaluations_df["inputs_id"].iloc[0] == "inputs1"
    assert evaluations_df["inputs"].iloc[0] == {"feature1": 1.0, "feature2": 2.0}

    # Check that the other


def test_evaluations_to_dataframes_different_assessments():
    # Different types of assessments in evaluations
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment_1 = AssessmentEntity(
        evaluation_id="eval1",
        name="accuracy",
        source=source,
        timestamp=123456789,
        numeric_value=0.95,
        rationale="Good performance",
    )
    assessment_2 = AssessmentEntity(
        evaluation_id="eval1",
        name="precision",
        source=source,
        timestamp=123456789,
        numeric_value=0.85,
        rationale="Reasonable performance",
    )

    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
        assessments=[assessment_1, assessment_2],
    )

    evaluations_df, metrics_df, assessments_df, tags_df = evaluations_to_dataframes([evaluation])

    # Check the assessments DataFrame
    assert len(assessments_df) == 2
    assert assessments_df["evaluation_id"].iloc[0] == "eval1"
    assert assessments_df["name"].iloc[0] == "accuracy"
    assert assessments_df["numeric_value"].iloc[0] == 0.95

    assert assessments_df["evaluation_id"].iloc[1] == "eval1"
    assert assessments_df["name"].iloc[1] == "precision"
    assert assessments_df["numeric_value"].iloc[1] == 0.85


def test_evaluations_to_dataframes_different_metrics():
    # Different types of metrics in evaluations
    metric_1 = Metric(key="metric1", value=0.9, timestamp=1234567890, step=0)
    metric_2 = Metric(key="metric2", value=0.8, timestamp=1234567891, step=0)

    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
        metrics=[metric_1, metric_2],
    )

    evaluations_df, metrics_df, assessments_df, tags_df = evaluations_to_dataframes([evaluation])

    # Check the metrics DataFrame
    assert len(metrics_df) == 2
    assert metrics_df["evaluation_id"].iloc[0] == "eval1"
    assert metrics_df["key"].iloc[0] == "metric1"
    assert metrics_df["value"].iloc[0] == 0.9
    assert metrics_df["timestamp"].iloc[0] == 1234567890

    assert metrics_df["evaluation_id"].iloc[1] == "eval1"
    assert metrics_df["key"].iloc[1] == "metric2"
    assert metrics_df["value"].iloc[1] == 0.8
    assert metrics_df["timestamp"].iloc[1] == 1234567891


def test_evaluations_to_dataframes_different_tags():
    # Different tags in evaluations
    tag1 = EvaluationTag(key="tag1", value="value1")
    tag2 = EvaluationTag(key="tag2", value="value2")

    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
        tags=[tag1, tag2],
    )

    evaluations_df, metrics_df, assessments_df, tags_df = evaluations_to_dataframes([evaluation])

    # Check the tags DataFrame
    assert len(tags_df) == 2
    assert tags_df["evaluation_id"].iloc[0] == "eval1"
    assert tags_df["key"].iloc[0] == "tag1"
    assert tags_df["value"].iloc[0] == "value1"

    assert tags_df["evaluation_id"].iloc[1] == "eval1"
    assert tags_df["key"].iloc[1] == "tag2"
    assert tags_df["value"].iloc[1] == "value2"
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/tests/evaluate/logging/utils.py

```python
import pandas as pd

from mlflow.evaluation.evaluation import EvaluationEntity as EvaluationEntity
from mlflow.evaluation.utils import (
    _get_assessments_dataframe_schema,
    _get_evaluations_dataframe_schema,
    _get_metrics_dataframe_schema,
    _get_tags_dataframe_schema,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR, RESOURCE_DOES_NOT_EXIST
from mlflow.tracking.client import MlflowClient


def get_evaluation(*, run_id: str, evaluation_id: str) -> EvaluationEntity:
    """
    Retrieves an Evaluation object from an MLflow Run.

    Args:
        run_id (str): ID of the MLflow Run containing the evaluation.
        evaluation_id (str): The ID of the evaluation.

    Returns:
        Evaluation: The Evaluation object.
    """
    client = MlflowClient()
    if not _contains_evaluation_artifacts(client=client, run_id=run_id):
        raise MlflowException(
            "The specified run does not contain any evaluations. "
            "Please log evaluations to the run before retrieving them.",
            error_code=RESOURCE_DOES_NOT_EXIST,
        )

    evaluations_file = client.download_artifacts(run_id=run_id, path="_evaluations.json")
    evaluations_df = _read_evaluations_dataframe(evaluations_file)

    assessments_file = client.download_artifacts(run_id=run_id, path="_assessments.json")
    assessments_df = _read_assessments_dataframe(assessments_file)

    metrics_file = client.download_artifacts(run_id=run_id, path="_metrics.json")
    metrics_df = _read_metrics_dataframe(metrics_file)

    tags_file = client.download_artifacts(run_id=run_id, path="_tags.json")
    tags_df = _read_tags_dataframe(tags_file)

    return _get_evaluation_from_dataframes(
        run_id=run_id,
        evaluation_id=evaluation_id,
        evaluations_df=evaluations_df,
        metrics_df=metrics_df,
        assessments_df=assessments_df,
        tags_df=tags_df,
    )


def _contains_evaluation_artifacts(*, client: MlflowClient, run_id: str) -> bool:
    return {"_evaluations.json", "_metrics.json", "_assessments.json", "_tags.json"}.issubset(
        {file.path for file in client.list_artifacts(run_id)}
    )


def _read_evaluations_dataframe(path: str) -> pd.DataFrame:
    """
    Reads an evaluations DataFrame from a file.

    Args:
        path (str): Path to the file.

    Returns:
        pd.DataFrame: The evaluations DataFrame.
    """
    schema = _get_evaluations_dataframe_schema()
    return pd.read_json(path, orient="split", dtype=schema, convert_dates=False).replace(
        pd.NA, None
    )


def _read_assessments_dataframe(path: str) -> pd.DataFrame:
    """
    Reads an assessments DataFrame from a file.

    Args:
        path (str): Path to the file.

    Returns:
        pd.DataFrame: The assessments DataFrame.
    """
    schema = _get_assessments_dataframe_schema()
    return pd.read_json(path, orient="split", dtype=schema, convert_dates=False).replace(
        pd.NA, None
    )


def _read_metrics_dataframe(path: str) -> pd.DataFrame:
    """
    Reads a metrics DataFrame from a file.

    Args:
        path (str): Path to the file.

    Returns:
        pd.DataFrame: The metrics DataFrame.
    """
    schema = _get_metrics_dataframe_schema()
    return pd.read_json(path, orient="split", dtype=schema, convert_dates=False).replace(
        pd.NA, None
    )


def _read_tags_dataframe(path: str) -> pd.DataFrame:
    """
    Reads a tags DataFrame from a file.

    Args:
        path (str): Path to the file.

    Returns:
        pd.DataFrame: The tags DataFrame.
    """
    schema = _get_tags_dataframe_schema()
    return pd.read_json(path, orient="split", dtype=schema, convert_dates=False).replace(
        pd.NA, None
    )


def _get_evaluation_from_dataframes(
    *,
    run_id: str,
    evaluation_id: str,
    evaluations_df: pd.DataFrame,
    metrics_df: pd.DataFrame,
    assessments_df: pd.DataFrame,
    tags_df: pd.DataFrame,
) -> EvaluationEntity:
    """
    Parses an Evaluation object with the specified evaluation ID from the specified DataFrames.
    """
    evaluation_row = evaluations_df[evaluations_df["evaluation_id"] == evaluation_id]
    if evaluation_row.empty:
        raise MlflowException(
            f"The specified evaluation ID '{evaluation_id}' does not exist in the run '{run_id}'.",
            error_code=RESOURCE_DOES_NOT_EXIST,
        )

    evaluations: list[EvaluationEntity] = _dataframes_to_evaluations(
        evaluations_df=evaluation_row,
        metrics_df=metrics_df,
        assessments_df=assessments_df,
        tags_df=tags_df,
    )
    if len(evaluations) != 1:
        raise MlflowException(
            f"Expected to find a single evaluation with ID '{evaluation_id}', but found "
            f"{len(evaluations)} evaluations.",
            error_code=INTERNAL_ERROR,
        )

    return evaluations[0]


def _dataframes_to_evaluations(
    evaluations_df: pd.DataFrame,
    metrics_df: pd.DataFrame,
    assessments_df: pd.DataFrame,
    tags_df: pd.DataFrame,
) -> list[EvaluationEntity]:
    """
    Converts four separate DataFrames (main evaluation data, metrics, assessments, and tags) back
    into a list of Evaluation entities.

    Args:
        evaluations_df (pd.DataFrame): DataFrame with the main evaluation data
            (excluding assessment and metrics).
        metrics_df (pd.DataFrame): DataFrame with metrics.
        assessments_df (pd.DataFrame): DataFrame with assessments.
        tags_df (pd.DataFrame): DataFrame with tags.

    Returns:
        List[EvaluationEntity]: A list of Evaluation entities created from the DataFrames.
    """
    # Group metrics and assessment by evaluation_id
    metrics_by_eval = _group_dataframe_by_evaluation_id(metrics_df)
    assessments_by_eval = _group_dataframe_by_evaluation_id(assessments_df)
    tags_by_eval = _group_dataframe_by_evaluation_id(tags_df)

    # Convert main DataFrame to list of dictionaries and create Evaluation objects
    evaluations = []
    for eval_dict in evaluations_df.to_dict(orient="records"):
        evaluation_id = eval_dict["evaluation_id"]
        eval_dict["metrics"] = [
            {
                "key": metric["key"],
                "value": metric["value"],
                "timestamp": metric["timestamp"],
                # Evaluation metrics don't have steps, but we're reusing the MLflow Metric
                # class to represent Evaluation metrics as entities in Python for now. Accordingly,
                # we set the step to 0 in order to parse the evaluation metric as an MLflow Metric
                # Python entity
                "step": 0,
                # Also discard the evaluation_id field from the evaluation metric, since this
                # field is not part of the MLflow Metric Python entity
            }
            for metric in metrics_by_eval.get(evaluation_id, [])
        ]
        eval_dict["assessments"] = assessments_by_eval.get(evaluation_id, [])
        eval_dict["tags"] = tags_by_eval.get(evaluation_id, [])
        evaluations.append(EvaluationEntity.from_dictionary(eval_dict))

    return evaluations


def _group_dataframe_by_evaluation_id(df: pd.DataFrame):
    """
    Groups evaluation dataframe rows by 'evaluation_id'.

    Args:
        df (pd.DataFrame): DataFrame to group.

    Returns:
        Dict[str, List]: A dictionary with 'evaluation_id' as keys and lists of entity
            dictionaries as values.
    """
    grouped = df.groupby("evaluation_id", group_keys=False).apply(
        lambda x: x.to_dict(orient="records")
    )
    return grouped.to_dict()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/tests/examples/README.md

```text
# Adding `examples` unit tests to `pytest` test suite

Two types of test runs for code in `examples` directory are supported:

- Examples run by `mlflow run`
- Examples run by another command, such as the `python` interpreter

Each of these types of runs are implemented using `@pytest.mark.parametrize` decorator. Adding a new
example to test involves updating the decorator list as described below.

For purpose of discussion, `new_example_dir` designates the
directory the example code is found, i.e., it is located in `examples/new_example_dir`.

## Examples that utilize `mlflow run` construct

The `@pytest.mark.mark.parametrize` decorator for `def test_mlflow_run_example(directory, params):`
is updated.

If the example is executed by `cd examples/new_example_dir && mlflow run . -P param1=99 -P param2=3`, then
this `tuple` is added to the decorator list

```
("new_example_dir", ["-P", "param1=123", "-P", "param2=99"])
```

as shown below

```
@pytest.mark.parametrize(("directory", "params"), [
    ("sklearn_elasticnet_wine", ["-P", "alpha=0.5"]),
    (os.path.join("sklearn_elasticnet_diabetes", "linux"), []),
    ("new_example_dir", ["-P", "param1=123", "-P", "param2=99"]),
])
def test_mlflow_run_example(directory, params):
```

The `tuple` for an example requiring no parameters is simply:

```
("new_example_dir", []),
```

## Examples that are executed with another command

For an example that is not run by `mlflow run`, the list in
`@pytest.mark.parametrize` decorator for `test_command_example(tmpdir, directory, command):` is updated.

Examples invoked by `cd examples/new_example_dir && python train.py` require this tuple added
to the decorator's list

```
("new_example_dir", ["python", "train.py"]),
```

as shown below

```
@pytest.mark.parametrize(("directory", "command"), [
    ('sklearn_logistic_regression', ['python', 'train.py']),
    ('h2o', ['python', 'random_forest.py']),
    ('quickstart', ['python', 'mlflow_tracking.py']),
    ("new_example_dir", ["python", "train.py"]),
])
def test_command_example(tmpdir, directory, command):
```

If the example requires arguments to run, i.e., `python train.py arg1 arg2`, then the
tuple would look like this

```
('new_example_dir', ['python', 'train.py', 'arg1', 'arg2'])
```
```

--------------------------------------------------------------------------------

---[FILE: test_examples.py]---
Location: mlflow-master/tests/examples/test_examples.py

```python
import os
import re
import shutil
import sys
import uuid
from pathlib import Path

import pytest

import mlflow
from mlflow import cli
from mlflow.utils import process
from mlflow.utils.virtualenv import _get_mlflow_virtualenv_root

from tests.helper_functions import clear_hub_cache, flaky, start_mock_openai_server
from tests.integration.utils import invoke_cli_runner

EXAMPLES_DIR = "examples"


def find_python_env_yaml(directory: Path) -> Path:
    return next(filter(lambda p: p.name == "python_env.yaml", Path(directory).iterdir()))


def replace_mlflow_with_dev_version(yml_path: Path) -> None:
    old_src = yml_path.read_text()
    mlflow_dir = Path(mlflow.__path__[0]).parent
    new_src = re.sub(r"- mlflow.*\n", f"- {mlflow_dir}\n", old_src)
    yml_path.write_text(new_src)


@pytest.fixture(autouse=True)
def clean_up_mlflow_virtual_environments():
    yield

    for path in Path(_get_mlflow_virtualenv_root()).iterdir():
        if path.is_dir():
            shutil.rmtree(path)


@pytest.fixture(scope="module", autouse=True)
def mock_openai():
    # Some examples includes OpenAI API calls, so we start a mock server.
    with start_mock_openai_server() as base_url:
        with pytest.MonkeyPatch.context() as mp:
            mp.setenv("OPENAI_API_BASE", base_url)
            mp.setenv("OPENAI_API_KEY", "test")
            yield


@pytest.mark.notrackingurimock
@flaky()
@pytest.mark.parametrize(
    ("directory", "params"),
    [
        ("h2o", []),
        # TODO: Fix the hyperparam example and re-enable it
        # ("hyperparam", ["-e", "train", "-P", "epochs=1"]),
        # ("hyperparam", ["-e", "random", "-P", "epochs=1"]),
        # ("hyperparam", ["-e", "hyperopt", "-P", "epochs=1"]),
        (
            "lightgbm/lightgbm_native",
            ["-P", "learning_rate=0.1", "-P", "colsample_bytree=0.8", "-P", "subsample=0.9"],
        ),
        ("lightgbm/lightgbm_sklearn", []),
        ("statsmodels", ["-P", "inverse_method=qr"]),
        ("pytorch", ["-P", "epochs=2"]),
        ("sklearn_logistic_regression", []),
        ("sklearn_elasticnet_wine", ["-P", "alpha=0.5"]),
        ("sklearn_elasticnet_diabetes/linux", []),
        ("spacy", []),
        (
            "xgboost/xgboost_native",
            ["-P", "learning_rate=0.3", "-P", "colsample_bytree=0.8", "-P", "subsample=0.9"],
        ),
        ("xgboost/xgboost_sklearn", []),
        ("pytorch/MNIST", ["-P", "max_epochs=1"]),
        ("pytorch/HPOExample", ["-P", "n_trials=2", "-P", "max_epochs=1"]),
        ("pytorch/CaptumExample", ["-P", "max_epochs=50"]),
        ("supply_chain_security", []),
        ("tensorflow", []),
        ("sktime", []),
    ],
)
def test_mlflow_run_example(directory, params, tmp_path):
    # Use tmp_path+uuid as tmp directory to avoid the same
    # directory being reused when re-trying the test since
    # tmp_path is named as the test name
    random_tmp_path = tmp_path / str(uuid.uuid4())
    mlflow.set_tracking_uri(random_tmp_path.joinpath("mlruns").as_uri())
    example_dir = Path(EXAMPLES_DIR, directory)
    tmp_example_dir = random_tmp_path.joinpath(example_dir)
    shutil.copytree(example_dir, tmp_example_dir)
    python_env_path = find_python_env_yaml(tmp_example_dir)
    replace_mlflow_with_dev_version(python_env_path)
    cli_run_list = [tmp_example_dir] + params
    invoke_cli_runner(cli.run, list(map(str, cli_run_list)))


@pytest.mark.notrackingurimock
@pytest.mark.parametrize(
    ("directory", "command"),
    [
        ("docker", ["docker", "build", "-t", "mlflow-docker-example", "-f", "Dockerfile", "."]),
        ("keras", [sys.executable, "train.py"]),
        (
            "lightgbm/lightgbm_native",
            [
                sys.executable,
                "train.py",
                "--learning-rate",
                "0.2",
                "--colsample-bytree",
                "0.8",
                "--subsample",
                "0.9",
            ],
        ),
        ("lightgbm/lightgbm_sklearn", [sys.executable, "train.py"]),
        ("statsmodels", [sys.executable, "train.py", "--inverse-method", "qr"]),
        ("quickstart", [sys.executable, "mlflow_tracking.py"]),
        ("remote_store", [sys.executable, "remote_server.py"]),
        (
            "xgboost/xgboost_native",
            [
                sys.executable,
                "train.py",
                "--learning-rate",
                "0.2",
                "--colsample-bytree",
                "0.8",
                "--subsample",
                "0.9",
            ],
        ),
        ("xgboost/xgboost_sklearn", [sys.executable, "train.py"]),
        ("catboost", [sys.executable, "train.py"]),
        ("prophet", [sys.executable, "train.py"]),
        ("sklearn_autolog", [sys.executable, "linear_regression.py"]),
        ("sklearn_autolog", [sys.executable, "pipeline.py"]),
        ("sklearn_autolog", [sys.executable, "grid_search_cv.py"]),
        ("pyspark_ml_autologging", [sys.executable, "logistic_regression.py"]),
        ("pyspark_ml_autologging", [sys.executable, "one_vs_rest.py"]),
        ("pyspark_ml_autologging", [sys.executable, "pipeline.py"]),
        ("shap", [sys.executable, "regression.py"]),
        ("shap", [sys.executable, "binary_classification.py"]),
        ("shap", [sys.executable, "multiclass_classification.py"]),
        ("shap", [sys.executable, "explainer_logging.py"]),
        ("ray_serve", [sys.executable, "train_model.py"]),
        ("pip_requirements", [sys.executable, "pip_requirements.py"]),
        ("pmdarima", [sys.executable, "train.py"]),
        ("evaluation", [sys.executable, "evaluate_on_binary_classifier.py"]),
        ("evaluation", [sys.executable, "evaluate_on_multiclass_classifier.py"]),
        ("evaluation", [sys.executable, "evaluate_on_regressor.py"]),
        ("evaluation", [sys.executable, "evaluate_with_custom_metrics.py"]),
        ("evaluation", [sys.executable, "evaluate_with_custom_metrics_comprehensive.py"]),
        ("evaluation", [sys.executable, "evaluate_with_model_validation.py"]),
        ("spark_udf", [sys.executable, "spark_udf_datetime.py"]),
        ("pyfunc", [sys.executable, "train.py"]),
        ("tensorflow", [sys.executable, "train.py"]),
        ("transformers", [sys.executable, "conversational.py"]),
        ("transformers", [sys.executable, "load_components.py"]),
        ("transformers", [sys.executable, "simple.py"]),
        ("transformers", [sys.executable, "sentence_transformer.py"]),
        ("transformers", [sys.executable, "whisper.py"]),
        ("sentence_transformers", [sys.executable, "simple.py"]),
        ("tracing", [sys.executable, "fluent.py"]),
        ("tracing", [sys.executable, "client.py"]),
        ("llama_index", [sys.executable, "simple_index.py"]),
        ("llama_index", [sys.executable, "autolog.py"]),
    ],
)
def test_command_example(directory, command):
    cwd_dir = Path(EXAMPLES_DIR, directory)
    assert os.environ.get("MLFLOW_HOME") is not None
    if directory == "transformers":
        # NB: Clearing the huggingface_hub cache is to lower the disk storage pressure for CI
        clear_hub_cache()

    process._exec_cmd(command, cwd=cwd_dir, env=os.environ)
```

--------------------------------------------------------------------------------

---[FILE: test_cli.py]---
Location: mlflow-master/tests/gateway/test_cli.py

```python
from click.testing import CliRunner

from mlflow.gateway.cli import start


def test_start_help():
    runner = CliRunner()
    res = runner.invoke(
        start,
        ["--help"],
        catch_exceptions=False,
    )
    assert res.exit_code == 0


def test_start_invalid_config(tmp_path):
    runner = CliRunner()
    config = tmp_path.joinpath("config.yml")
    res = runner.invoke(
        start,
        ["--config-path", config],
        catch_exceptions=False,
    )
    assert res.exit_code == 2
    assert "does not exist" in res.output

    config.write_text("\t")
    res = runner.invoke(
        start,
        ["--config-path", config],
        catch_exceptions=False,
    )
    assert res.exit_code == 2
    assert "not a valid yaml file" in res.output

    config.write_text(
        """
endpoints:
  - model:
    name: invalid
"""
    )
    res = runner.invoke(
        start,
        ["--config-path", config],
        catch_exceptions=False,
    )
    assert res.exit_code == 2
    assert "The gateway configuration is invalid" in res.output
```

--------------------------------------------------------------------------------

````
