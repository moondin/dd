---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 832
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 832 of 991)

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

---[FILE: test_builtin_scorers_registration.py]---
Location: mlflow-master/tests/genai/scorers/test_builtin_scorers_registration.py

```python
from pathlib import Path
from typing import Iterator
from unittest import mock

import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.genai.scorers import RetrievalRelevance, Safety, Scorer
from mlflow.genai.scorers.base import ScorerSamplingConfig


@pytest.fixture
def mock_databricks_tracking_uri() -> Iterator[mock.Mock]:
    with mock.patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri", return_value="databricks"
    ) as mock_uri:
        yield mock_uri


@pytest.mark.parametrize(
    ("scorer_class", "model"),
    [
        (Safety, "openai:/gpt-4"),
        (Safety, "anthropic:/claude-3-opus"),
        (RetrievalRelevance, "openai:/gpt-4"),
        (RetrievalRelevance, "anthropic:/claude-3"),
    ],
)
def test_non_databricks_model_cannot_register(
    scorer_class: type[Scorer], model: str, mock_databricks_tracking_uri: mock.Mock
):
    scorer = scorer_class(model=model)
    with pytest.raises(
        MlflowException, match="The scorer's judge model must use Databricks as a model provider"
    ):
        scorer.register()
    mock_databricks_tracking_uri.assert_called()


def test_safety_with_databricks_model_can_register(mock_databricks_tracking_uri: mock.Mock):
    with mock.patch(
        "mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer"
    ) as mock_add:
        scorer = Safety(model="databricks:/my-judge-model")
        registered = scorer.register()

    assert registered.name == "safety"
    mock_add.assert_called_once()
    mock_databricks_tracking_uri.assert_called()


def test_builtin_scorer_without_custom_model_can_register(mock_databricks_tracking_uri: mock.Mock):
    with mock.patch(
        "mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer"
    ) as mock_add:
        # Safety with default model (None)
        scorer = Safety()
        registered = scorer.register()
        assert registered.name == "safety"
        mock_add.assert_called_once()

        mock_add.reset_mock()

        # RetrievalRelevance with default model (None)
        scorer = RetrievalRelevance()
        registered = scorer.register()

    assert registered.name == "retrieval_relevance"
    mock_add.assert_called_once()
    mock_databricks_tracking_uri.assert_called()


def test_scorer_start_with_non_databricks_model_fails(mock_databricks_tracking_uri: mock.Mock):
    scorer = Safety(model="openai:/gpt-4")
    with pytest.raises(
        MlflowException, match="The scorer's judge model must use Databricks as a model provider"
    ):
        scorer.start(sampling_config=ScorerSamplingConfig(sample_rate=0.5))
    mock_databricks_tracking_uri.assert_called()


def test_scorer_update_with_non_databricks_model_fails(mock_databricks_tracking_uri: mock.Mock):
    scorer = Safety(model="anthropic:/claude-3")
    with pytest.raises(
        MlflowException, match="The scorer's judge model must use Databricks as a model provider"
    ):
        scorer.update(sampling_config=ScorerSamplingConfig(sample_rate=0.3))
    mock_databricks_tracking_uri.assert_called()


def test_scorer_stop_with_non_databricks_model_fails(mock_databricks_tracking_uri: mock.Mock):
    scorer = RetrievalRelevance(model="openai:/gpt-4")
    with pytest.raises(
        MlflowException, match="The scorer's judge model must use Databricks as a model provider"
    ):
        scorer.stop()
    mock_databricks_tracking_uri.assert_called()


@pytest.mark.parametrize(
    ("scorer_class", "model", "expected_name"),
    [
        (Safety, "openai:/gpt-4", "safety"),
        (Safety, "anthropic:/claude-3-opus", "safety"),
        (RetrievalRelevance, "openai:/gpt-4", "retrieval_relevance"),
        (RetrievalRelevance, "anthropic:/claude-3", "retrieval_relevance"),
    ],
)
def test_non_databricks_backend_allows_any_model(
    scorer_class: type[Scorer], model: str, expected_name: str, tmp_path: Path
):
    tracking_uri = f"sqlite:///{tmp_path}/test.db"
    mlflow.set_tracking_uri(tracking_uri)

    with mock.patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri",
        return_value=tracking_uri,
    ) as mock_get_tracking_uri:
        experiment_id = mlflow.create_experiment("test_any_model_allowed")

        # Non-Databricks models should work with MLflow backend
        scorer = scorer_class(model=model)
        registered = scorer.register(experiment_id=experiment_id)
        assert registered.name == expected_name

        mock_get_tracking_uri.assert_called()


def test_error_message_shows_actual_model(mock_databricks_tracking_uri: mock.Mock):
    model = "openai:/gpt-4-turbo"
    scorer = Safety(model=model)

    with pytest.raises(MlflowException, match=f"Got {model}"):
        scorer.register()

    mock_databricks_tracking_uri.assert_called()
```

--------------------------------------------------------------------------------

---[FILE: test_registered_scorers_scheduling.py]---
Location: mlflow-master/tests/genai/scorers/test_registered_scorers_scheduling.py

```python
from unittest.mock import patch

import pytest

from mlflow.exceptions import MlflowException
from mlflow.genai.scorers import Guidelines, scorer
from mlflow.genai.scorers.base import Scorer, ScorerSamplingConfig


@pytest.fixture(autouse=True)
def mock_databricks_runtime():
    from mlflow.genai.scorers.registry import DatabricksStore

    with (
        patch("mlflow.tracking.get_tracking_uri", return_value="databricks"),
        patch(
            "mlflow.tracking._tracking_service.utils.get_tracking_uri", return_value="databricks"
        ),
        patch("mlflow.genai.scorers.base.is_in_databricks_runtime", return_value=True),
        patch("mlflow.genai.scorers.base.is_databricks_uri", return_value=True),
        patch("mlflow.genai.scorers.registry._get_scorer_store") as mock_get_store,
    ):
        mock_store = DatabricksStore()
        mock_get_store.return_value = mock_store
        yield


@scorer
def length_check(outputs):
    """Check if response is adequately detailed"""
    return len(str(outputs)) > 100


@scorer
def serialization_scorer(outputs) -> bool:
    """Scorer for serialization tests"""
    return len(outputs) > 5


def test_scorer_register():
    my_scorer = length_check
    with patch("mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer") as mock_add:
        registered = my_scorer.register(name="my_length_check")

    # Check immutability - returns new instance
    assert registered is not my_scorer
    assert registered.name == "my_length_check"
    assert registered._sampling_config.sample_rate == 0.0
    assert registered._sampling_config.filter_string is None

    # Check that the original scorer is unchanged
    assert my_scorer.name == "length_check"
    assert my_scorer._sampling_config is None

    # Check the mock was called correctly
    mock_add.assert_called_once()
    call_args = mock_add.call_args.kwargs
    assert call_args["name"] == "my_length_check"
    assert call_args["sample_rate"] == 0.0
    assert call_args["filter_string"] is None


def test_scorer_register_default_name():
    my_scorer = length_check
    with patch("mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer") as mock_add:
        registered = my_scorer.register()

    assert registered.name == "length_check"  # Uses scorer's name
    mock_add.assert_called_once()
    assert mock_add.call_args.kwargs["name"] == "length_check"


def test_scorer_start():
    my_scorer = length_check
    my_scorer = my_scorer._create_copy()
    my_scorer.name = "my_length_check"
    my_scorer._sampling_config = ScorerSamplingConfig(sample_rate=0.0)

    with patch(
        "mlflow.genai.scorers.registry.DatabricksStore.update_registered_scorer"
    ) as mock_update:
        # Mock the return value
        mock_update.return_value = my_scorer._create_copy()
        mock_update.return_value.name = "my_length_check"
        mock_update.return_value._sampling_config = ScorerSamplingConfig(
            sample_rate=0.5, filter_string="trace.status = 'OK'"
        )

        started = my_scorer.start(
            sampling_config=ScorerSamplingConfig(
                sample_rate=0.5, filter_string="trace.status = 'OK'"
            )
        )

    # Check immutability
    assert started is not my_scorer
    assert started.name == "my_length_check"
    assert started._sampling_config.sample_rate == 0.5
    assert started._sampling_config.filter_string == "trace.status = 'OK'"

    # Original unchanged
    assert my_scorer._sampling_config.sample_rate == 0.0

    # Check mock called correctly
    mock_update.assert_called_once()
    call_args = mock_update.call_args.kwargs
    assert call_args["name"] == "my_length_check"
    assert call_args["sample_rate"] == 0.5
    assert call_args["filter_string"] == "trace.status = 'OK'"


@pytest.mark.parametrize("sample_rate", [0, -0.1])
def test_scorer_start_with_zero_sample_rate_raises_error(sample_rate):
    with pytest.raises(MlflowException, match="sample rate must be greater than 0"):
        length_check.start(sampling_config=ScorerSamplingConfig(sample_rate=sample_rate))


def test_scorer_start_not_registered():
    my_scorer = length_check

    # Should work fine - start doesn't require pre-registration
    with patch(
        "mlflow.genai.scorers.registry.DatabricksStore.update_registered_scorer"
    ) as mock_update:
        mock_update.return_value = my_scorer._create_copy()
        my_scorer.start(sampling_config=ScorerSamplingConfig(sample_rate=0.5))

    assert mock_update.called


def test_scorer_update():
    my_scorer = length_check
    my_scorer = my_scorer._create_copy()
    my_scorer.name = "my_length_check"
    my_scorer._sampling_config = ScorerSamplingConfig(sample_rate=0.5, filter_string="old filter")

    with patch(
        "mlflow.genai.scorers.registry.DatabricksStore.update_registered_scorer"
    ) as mock_update:
        # Mock the return value
        mock_update.return_value = my_scorer._create_copy()
        mock_update.return_value._sampling_config = ScorerSamplingConfig(
            sample_rate=0.4, filter_string="old filter"
        )

        # Update with new config
        updated = my_scorer.update(
            sampling_config=ScorerSamplingConfig(sample_rate=0.4, filter_string="old filter")
        )

    assert updated._sampling_config.sample_rate == 0.4
    assert updated._sampling_config.filter_string == "old filter"

    # Check mock was called correctly
    mock_update.assert_called_once()
    call_args = mock_update.call_args.kwargs
    assert call_args["name"] == "my_length_check"
    assert call_args["sample_rate"] == 0.4
    assert call_args["filter_string"] == "old filter"


def test_scorer_stop():
    my_scorer = length_check
    my_scorer = my_scorer._create_copy()
    my_scorer.name = "my_length_check"
    my_scorer._sampling_config = ScorerSamplingConfig(sample_rate=0.5)

    with patch(
        "mlflow.genai.scorers.registry.DatabricksStore.update_registered_scorer"
    ) as mock_update:
        # Mock the return value
        mock_update.return_value = my_scorer._create_copy()
        mock_update.return_value._sampling_config = ScorerSamplingConfig(sample_rate=0.0)

        stopped = my_scorer.stop()

    assert stopped._sampling_config.sample_rate == 0.0
    mock_update.assert_called_once()
    assert mock_update.call_args.kwargs["sample_rate"] == 0.0


def test_scorer_register_with_experiment_id():
    my_scorer = length_check
    with patch("mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer") as mock_add:
        my_scorer.register(name="test_scorer", experiment_id="exp123")

    mock_add.assert_called_once()
    call_args = mock_add.call_args.kwargs
    assert call_args["experiment_id"] == "exp123"
    assert call_args["name"] == "test_scorer"


def test_scorer_start_with_name_param():
    my_scorer = length_check
    # Scorer doesn't need name modification

    with patch(
        "mlflow.genai.scorers.registry.DatabricksStore.update_registered_scorer"
    ) as mock_update:
        mock_update.return_value = my_scorer._create_copy()
        mock_update.return_value.name = "different_name"
        mock_update.return_value._sampling_config = ScorerSamplingConfig(sample_rate=0.7)

        started = my_scorer.start(
            name="different_name", sampling_config=ScorerSamplingConfig(sample_rate=0.7)
        )

    assert started.name == "different_name"
    assert started._sampling_config.sample_rate == 0.7

    mock_update.assert_called_once()
    call_args = mock_update.call_args.kwargs
    assert call_args["name"] == "different_name"


def test_scorer_update_with_all_params():
    my_scorer = length_check
    my_scorer = my_scorer._create_copy()
    my_scorer.name = "original_name"

    with patch(
        "mlflow.genai.scorers.registry.DatabricksStore.update_registered_scorer"
    ) as mock_update:
        mock_update.return_value = my_scorer._create_copy()
        mock_update.return_value._sampling_config = ScorerSamplingConfig(
            sample_rate=0.9, filter_string="new_filter"
        )

        my_scorer.update(
            name="override_name",
            experiment_id="exp456",
            sampling_config=ScorerSamplingConfig(sample_rate=0.9, filter_string="new_filter"),
        )

    mock_update.assert_called_once()
    call_args = mock_update.call_args.kwargs
    assert call_args["name"] == "override_name"
    assert call_args["experiment_id"] == "exp456"
    assert call_args["sample_rate"] == 0.9
    assert call_args["filter_string"] == "new_filter"


def test_builtin_scorer_register():
    guidelines_scorer = Guidelines(guidelines="Be helpful")

    # Verify original serialization
    original_dump = guidelines_scorer.model_dump()
    assert original_dump["name"] == "guidelines"

    with patch("mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer"):
        # Register with custom name
        registered = guidelines_scorer.register(name="my_guidelines")

    assert registered is not guidelines_scorer
    assert registered.name == "my_guidelines"
    assert registered._sampling_config.sample_rate == 0.0

    # Check original fields preserved
    assert registered.guidelines == "Be helpful"

    # Verify serialization reflects the new name (key test for BuiltinScorers)
    registered_dump = registered.model_dump()
    assert registered_dump["name"] == "my_guidelines"

    # Verify original scorer is unchanged
    assert guidelines_scorer.name == "guidelines"
    original_dump_after = guidelines_scorer.model_dump()
    assert original_dump_after["name"] == "guidelines"


def test_builtin_scorer_update():
    guidelines_scorer = Guidelines(guidelines="Be helpful")
    guidelines_scorer = guidelines_scorer._create_copy()
    guidelines_scorer.name = "my_guidelines"
    guidelines_scorer._sampling_config = ScorerSamplingConfig(sample_rate=0.5)

    with patch(
        "mlflow.genai.scorers.registry.DatabricksStore.update_registered_scorer"
    ) as mock_update:
        # Mock the return value
        mock_update.return_value = guidelines_scorer._create_copy()
        mock_update.return_value._sampling_config = ScorerSamplingConfig(sample_rate=0.3)

        updated = guidelines_scorer.update(sampling_config=ScorerSamplingConfig(sample_rate=0.3))

    assert updated._sampling_config.sample_rate == 0.3
    assert updated.guidelines == "Be helpful"  # Original field preserved


def test_all_methods_are_immutable():
    original = length_check

    # Set up some state
    original = original._create_copy()
    original.name = "original_name"
    original._sampling_config = ScorerSamplingConfig(sample_rate=0.1, filter_string="original")

    # Test each method
    with patch("mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer"):
        registered = original.register(name="new_name")
        assert registered is not original
        assert original.name == "original_name"  # Unchanged

    with patch(
        "mlflow.genai.scorers.registry.DatabricksStore.update_registered_scorer"
    ) as mock_update:
        # Mock return values
        mock_update.return_value = original._create_copy()
        mock_update.return_value._sampling_config = ScorerSamplingConfig(sample_rate=0.9)

        started = original.start(sampling_config=ScorerSamplingConfig(sample_rate=0.9))
        assert started is not original
        assert original._sampling_config.sample_rate == 0.1  # Unchanged

        mock_update.return_value = original._create_copy()
        mock_update.return_value._sampling_config = ScorerSamplingConfig(
            sample_rate=0.1, filter_string="new filter"
        )

        updated = original.update(
            sampling_config=ScorerSamplingConfig(sample_rate=0.1, filter_string="new filter")
        )
        assert updated is not original
        assert original._sampling_config.filter_string == "original"  # Unchanged

        mock_update.return_value = original._create_copy()
        mock_update.return_value._sampling_config = ScorerSamplingConfig(sample_rate=0.0)

        stopped = original.stop()
        assert stopped is not original
        assert original._sampling_config.sample_rate == 0.1  # Unchanged


def test_class_scorer_cannot_be_registered():
    class CustomScorer(Scorer):
        name: str = "custom"

        def __call__(self, outputs):
            return True

    custom_scorer = CustomScorer()

    # Test all methods that require registrable scorers
    with pytest.raises(MlflowException, match="Scorer must be a builtin or decorator scorer"):
        custom_scorer.register()

    with pytest.raises(MlflowException, match="Scorer must be a builtin or decorator scorer"):
        custom_scorer.start(sampling_config=ScorerSamplingConfig(sample_rate=0.5))

    with pytest.raises(MlflowException, match="Scorer must be a builtin or decorator scorer"):
        custom_scorer.update(sampling_config=ScorerSamplingConfig(sample_rate=0.5))

    with pytest.raises(MlflowException, match="Scorer must be a builtin or decorator scorer"):
        custom_scorer.stop()


def test_register_with_custom_name_updates_serialization():
    # Use the pre-defined scorer to avoid source extraction issues
    test_scorer = serialization_scorer

    # Serialize to populate cache
    original_dump = test_scorer.model_dump()
    assert original_dump["name"] == "serialization_scorer"

    with patch("mlflow.genai.scorers.registry.DatabricksStore.add_registered_scorer") as mock_add:
        # Register with custom name
        registered = test_scorer.register(name="custom_test_name")

    # Verify the registered scorer has the correct name
    assert registered.name == "custom_test_name"

    # Verify serialization reflects the new name
    registered_dump = registered.model_dump()
    assert registered_dump["name"] == "custom_test_name"

    # Verify original scorer is unchanged
    assert test_scorer.name == "serialization_scorer"

    # Verify the server was called with the correct name
    mock_add.assert_called_once()
    assert mock_add.call_args.kwargs["name"] == "custom_test_name"
```

--------------------------------------------------------------------------------

---[FILE: test_scorer.py]---
Location: mlflow-master/tests/genai/scorers/test_scorer.py

```python
from collections import defaultdict
from unittest.mock import call, patch

import pandas as pd
import pytest

import mlflow
from mlflow.entities import Assessment, AssessmentSource, AssessmentSourceType, Feedback
from mlflow.entities.assessment_error import AssessmentError
from mlflow.genai import Scorer, scorer
from mlflow.genai.judges import make_judge
from mlflow.genai.judges.utils import CategoricalRating
from mlflow.genai.scorers import Correctness, Guidelines, RetrievalGroundedness
from mlflow.genai.scorers.base import SerializedScorer
from mlflow.genai.scorers.registry import get_scorer, list_scorers


@pytest.fixture(autouse=True)
def increase_db_pool_size(monkeypatch):
    # Set larger pool size for tests to handle concurrent trace creation
    # test_extra_traces_from_customer_scorer_should_be_cleaned_up test requires this
    # to reduce flakiness
    monkeypatch.setenv("MLFLOW_SQLALCHEMYSTORE_POOL_SIZE", "20")
    monkeypatch.setenv("MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW", "40")
    return


def always_yes(inputs, outputs, expectations, trace):
    return "yes"


class AlwaysYesScorer(Scorer):
    def __call__(self, inputs, outputs, expectations, trace):
        return "yes"


@pytest.fixture
def sample_data():
    return pd.DataFrame(
        {
            "inputs": [
                {"message": [{"role": "user", "content": "What is Spark??"}]},
                {
                    "messages": [
                        {"role": "user", "content": "How can you minimize data shuffling in Spark?"}
                    ]
                },
            ],
            "outputs": [
                {"choices": [{"message": {"content": "actual response for first question"}}]},
                {"choices": [{"message": {"content": "actual response for second question"}}]},
            ],
            "expectations": [
                {"expected_response": "expected response for first question"},
                {"expected_response": "expected response for second question"},
            ],
        }
    )


@pytest.mark.parametrize("dummy_scorer", [AlwaysYesScorer(name="always_yes"), scorer(always_yes)])
def test_scorer_existence_in_metrics(sample_data, dummy_scorer, is_in_databricks):
    result = mlflow.genai.evaluate(data=sample_data, scorers=[dummy_scorer])
    assert any("always_yes" in metric for metric in result.metrics.keys())


@pytest.mark.parametrize(
    "dummy_scorer", [AlwaysYesScorer(name="always_no"), scorer(name="always_no")(always_yes)]
)
def test_scorer_name_works(sample_data, dummy_scorer, is_in_databricks):
    _SCORER_NAME = "always_no"
    result = mlflow.genai.evaluate(data=sample_data, scorers=[dummy_scorer])
    assert any(_SCORER_NAME in metric for metric in result.metrics.keys())


def test_trace_passed_to_builtin_scorers_correctly(
    sample_rag_trace, is_in_databricks, monkeypatch: pytest.MonkeyPatch
):
    if not is_in_databricks:
        pytest.skip("OSS GenAI evaluator doesn't support passing traces yet")

    # Disable logging traces to MLflow to avoid calling mlflow APIs which need to be mocked
    monkeypatch.setenv("AGENT_EVAL_LOG_TRACES_TO_MLFLOW_ENABLED", "false")

    # Remove expected_facts from trace to avoid validation error (can only have one)
    sample_rag_trace.info.assessments = [
        a for a in sample_rag_trace.info.assessments if a.name != "expected_facts"
    ]

    with (
        patch(
            "databricks.agents.evals.judges.correctness",
            return_value=Feedback(name="correctness", value=CategoricalRating.YES),
        ) as mock_correctness,
        patch(
            "databricks.agents.evals.judges.guidelines",
            return_value=Feedback(name="guidelines", value=CategoricalRating.YES),
        ) as mock_guidelines,
        patch(
            "databricks.agents.evals.judges.groundedness",
            return_value=Feedback(name="groundedness", value=CategoricalRating.YES),
        ) as mock_groundedness,
    ):
        mlflow.genai.evaluate(
            data=pd.DataFrame({"trace": [sample_rag_trace]}),
            scorers=[
                RetrievalGroundedness(name="retrieval_groundedness"),
                Correctness(name="correctness"),
                Guidelines(name="english", guidelines=["write in english"]),
            ],
        )

    assert mock_correctness.call_count == 1
    assert mock_guidelines.call_count == 1
    assert mock_groundedness.call_count == 2  # Called per retriever span

    mock_correctness.assert_called_once_with(
        request="{'question': 'query'}",
        response="answer",
        expected_facts=None,
        expected_response="expected answer",
        assessment_name="correctness",
    )
    mock_guidelines.assert_called_once_with(
        guidelines=["write in english"],
        context={"request": "{'question': 'query'}", "response": "answer"},
        assessment_name="english",
    )
    mock_groundedness.assert_has_calls(
        [
            call(
                request="{'question': 'query'}",
                response="answer",
                retrieved_context=[
                    {"content": "content_1", "doc_uri": "url_1"},
                    {"content": "content_2", "doc_uri": "url_2"},
                ],
                assessment_name="retrieval_groundedness",
            ),
            call(
                request="{'question': 'query'}",
                response="answer",
                retrieved_context=[
                    {"content": "content_3"},
                ],
                assessment_name="retrieval_groundedness",
            ),
        ]
    )


def test_trace_passed_to_custom_scorer_correctly(sample_data, is_in_databricks):
    if not is_in_databricks:
        pytest.skip("OSS GenAI evaluator doesn't support passing traces yet")

    actual_call_args_list = []

    @scorer
    def dummy_scorer(inputs, outputs, expectations, trace) -> float:
        actual_call_args_list.append(
            {
                "inputs": inputs,
                "outputs": outputs,
                "expectations": expectations,
            }
        )
        return 0.0

    mlflow.genai.evaluate(data=sample_data, scorers=[dummy_scorer])

    assert len(actual_call_args_list) == len(sample_data)

    # Prepare expected arguments, keyed by expected_response for matching
    sample_data_set = defaultdict(set)
    for i in range(len(sample_data)):
        sample_data_set["inputs"].add(str(sample_data["inputs"][i]))
        sample_data_set["outputs"].add(str(sample_data["outputs"][i]))
        sample_data_set["expectations"].add(
            str(sample_data["expectations"][i]["expected_response"])
        )

    for actual_args in actual_call_args_list:
        # do any check since actual passed input could be reformatted and larger than sample input
        assert any(
            sample_data_input in str(actual_args["inputs"])
            for sample_data_input in sample_data_set["inputs"]
        )
        assert str(actual_args["outputs"]) in sample_data_set["outputs"]
        assert (
            str(actual_args["expectations"]["expected_response"]) in sample_data_set["expectations"]
        )


def test_trace_passed_correctly(is_in_databricks):
    if not is_in_databricks:
        pytest.skip("OSS GenAI evaluator doesn't support passing traces yet")

    @mlflow.trace
    def predict_fn(question):
        return "output: " + str(question)

    actual_call_args_list = []

    @scorer
    def dummy_scorer(inputs, outputs, trace):
        actual_call_args_list.append(
            {
                "inputs": inputs,
                "outputs": outputs,
                "trace": trace,
            }
        )
        return 0.0

    data = [
        {"inputs": {"question": "input1"}},
        {"inputs": {"question": "input2"}},
    ]
    mlflow.genai.evaluate(
        predict_fn=predict_fn,
        data=data,
        scorers=[dummy_scorer],
    )

    assert len(actual_call_args_list) == len(data)
    for actual_args in actual_call_args_list:
        assert actual_args["trace"] is not None
        trace = actual_args["trace"]
        # check if the input is present in the trace
        assert any(
            str(data[i]["inputs"]["question"]) in str(trace.data.request) for i in range(len(data))
        )
        # check if predict_fn was run by making output it starts with "output:"
        assert "output:" in str(trace.data.response)[:10]


@pytest.mark.parametrize(
    "scorer_return",
    [
        "yes",
        42,
        42.0,
        # Feedback object.
        Feedback(name="big_question", value=42, rationale="It's the answer to everything"),
        # List of Feedback objects.
        [
            Feedback(name="big_question", value=42, rationale="It's the answer to everything"),
            Feedback(name="small_question", value=1, rationale="Not sure, just a guess"),
        ],
    ],
)
def test_scorer_on_genai_evaluate(sample_data, scorer_return, is_in_databricks):
    @scorer
    def dummy_scorer(inputs, outputs):
        return scorer_return

    results = mlflow.genai.evaluate(
        data=sample_data,
        scorers=[dummy_scorer],
    )
    if isinstance(scorer_return, Assessment):
        assert any(scorer_return.name in metric for metric in results.metrics.keys())
    elif isinstance(scorer_return, list) and all(
        isinstance(item, Assessment) for item in scorer_return
    ):
        assert any(
            item.name in metric for item in scorer_return for metric in results.metrics.keys()
        )
    else:
        assert any("dummy_scorer" in metric for metric in results.metrics.keys())


def test_custom_scorer_allow_none_return():
    @scorer
    def dummy_scorer(inputs, outputs):
        return None

    assert dummy_scorer.run(inputs={"question": "query"}, outputs="answer") is None


def test_scorer_returns_feedback_with_error(sample_data, is_in_databricks):
    @scorer
    def dummy_scorer(inputs):
        return Feedback(
            name="feedback_with_error",
            error=AssessmentError(error_code="500", error_message="This is an error"),
            source=AssessmentSource(source_type=AssessmentSourceType.LLM_JUDGE, source_id="gpt"),
            metadata={"index": 0},
        )

    results = mlflow.genai.evaluate(
        data=sample_data,
        scorers=[dummy_scorer],
    )

    # Scorer should not be in result when it returns an error
    assert all("dummy_scorer" not in metric for metric in results.metrics.keys())


@pytest.mark.parametrize(
    ("scorer_return", "expected_feedback_name"),
    [
        # Single feedback object with default name -> should be renamed to "my_scorer"
        (Feedback(value=42, rationale="rationale"), "my_scorer"),
        # Single feedback object with custom name -> should NOT be renamed to "my_scorer"
        (Feedback(name="custom_name", value=42, rationale="rationale"), "custom_name"),
    ],
)
def test_custom_scorer_overwrites_default_feedback_name(scorer_return, expected_feedback_name):
    @scorer
    def my_scorer(inputs, outputs):
        return scorer_return

    feedback = my_scorer.run(
        inputs={"question": "What is the capital of France?"},
        outputs="The capital of France is Paris.",
    )
    assert feedback.name == expected_feedback_name
    assert feedback.value == 42


def test_custom_scorer_does_not_overwrite_feedback_name_when_returning_list():
    @scorer
    def my_scorer(inputs, outputs):
        return [
            Feedback(name="big_question", value=42, rationale="It's the answer to everything"),
            Feedback(name="small_question", value=1, rationale="Not sure, just a guess"),
        ]

    feedbacks = my_scorer.run(
        inputs={"question": "What is the capital of France?"},
        outputs="The capital of France is Paris.",
    )
    assert feedbacks[0].name == "big_question"
    assert feedbacks[1].name == "small_question"


def test_custom_scorer_registration_blocked_for_non_databricks_uri():
    experiment_id = mlflow.create_experiment("test_security_experiment")

    @scorer
    def test_custom_scorer(outputs) -> bool:
        return len(outputs) > 0

    with pytest.raises(
        mlflow.exceptions.MlflowException,
        match="Custom scorer registration.*not supported outside of Databricks tracking",
    ):
        test_custom_scorer.register(experiment_id=experiment_id, name="test_scorer")

    mlflow.delete_experiment(experiment_id)


def test_custom_scorer_loading_blocked_for_non_databricks_uri():
    serialized = SerializedScorer(
        name="malicious_scorer",
        is_session_level_scorer=False,
        call_source="import os\nos.system('echo hacked')\nreturn True",
        call_signature="(outputs)",
        original_func_name="malicious_scorer",
    )

    with pytest.raises(
        mlflow.exceptions.MlflowException, match="Loading custom scorer.*not supported"
    ):
        Scorer._reconstruct_decorator_scorer(serialized)


def test_custom_scorer_loading_blocked_for_databricks_remote_access():
    serialized = SerializedScorer(
        name="malicious_scorer",
        is_session_level_scorer=False,
        call_source="import os\nos.system('echo hacked')\nreturn True",
        call_signature="(outputs)",
        original_func_name="malicious_scorer",
    )

    with (
        patch("mlflow.genai.scorers.base.is_in_databricks_runtime", return_value=False),
        patch("mlflow.genai.scorers.base.is_databricks_uri", return_value=True),
    ):
        with pytest.raises(
            mlflow.exceptions.MlflowException, match="via remote access is not supported"
        ):
            Scorer._reconstruct_decorator_scorer(serialized)


def test_custom_scorer_error_message_renders_code_snippet_legibly():
    serialized = SerializedScorer(
        name="complex_scorer",
        is_session_level_scorer=False,
        call_source=(
            "if not outputs:\n"
            "    return 0\n"
            "score = 0\n"
            "for word in outputs.split():\n"
            "    if word.isupper():\n"
            "        score += 2\n"
            "    else:\n"
            "        score += 1\n"
            "return score"
        ),
        call_signature="(outputs)",
        original_func_name="complex_scorer",
    )

    with pytest.raises(
        mlflow.exceptions.MlflowException, match="is not supported outside of"
    ) as exc_info:
        Scorer._reconstruct_decorator_scorer(serialized)

    error_msg = str(exc_info.value)

    assert "Registered scorer code:" in error_msg
    assert "from mlflow.genai import scorer" in error_msg
    assert "@scorer" in error_msg
    assert "def complex_scorer(outputs):" in error_msg

    expected_code = """
from mlflow.genai import scorer

@scorer
def complex_scorer(outputs):
    if not outputs:
        return 0
    score = 0
    for word in outputs.split():
        if word.isupper():
            score += 2
        else:
            score += 1
    return score"""

    assert expected_code.strip() in error_msg


def test_make_judge_scorer_works_without_databricks_uri():
    experiment_id = mlflow.create_experiment("test_make_judge_experiment")

    judge_scorer = make_judge(
        instructions="Evaluate if the {{outputs}} is helpful and relevant",
        name="helpfulness_judge",
        feedback_value_type=str,
    )

    registered_scorer = judge_scorer.register(experiment_id=experiment_id, name="helpfulness_judge")

    assert registered_scorer is not None
    assert registered_scorer.name == "helpfulness_judge"

    retrieved_scorer = get_scorer(name="helpfulness_judge", experiment_id=experiment_id)
    assert retrieved_scorer is not None
    assert retrieved_scorer.name == "helpfulness_judge"

    scorers = list_scorers(experiment_id=experiment_id)
    assert len(scorers) == 1
    assert scorers[0].name == "helpfulness_judge"

    mlflow.delete_experiment(experiment_id)
```

--------------------------------------------------------------------------------

````
