---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 828
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 828 of 991)

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

---[FILE: test_optimize.py]---
Location: mlflow-master/tests/genai/optimize/test_optimize.py

```python
from typing import Any

import pandas as pd
import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.genai.optimize.optimize import optimize_prompts
from mlflow.genai.optimize.optimizers.base import BasePromptOptimizer
from mlflow.genai.optimize.types import EvaluationResultRecord, PromptOptimizerOutput
from mlflow.genai.prompts import register_prompt
from mlflow.genai.scorers import scorer
from mlflow.models.model import PromptVersion
from mlflow.utils.import_hooks import _post_import_hooks


class MockPromptOptimizer(BasePromptOptimizer):
    def __init__(self, reflection_model="openai:/gpt-4o-mini"):
        self.model_name = reflection_model

    def optimize(
        self,
        eval_fn: Any,
        train_data: list[dict[str, Any]],
        target_prompts: dict[str, str],
        enable_tracking: bool = True,
    ) -> PromptOptimizerOutput:
        optimized_prompts = {}
        for prompt_name, template in target_prompts.items():
            # Simple optimization: add "Be precise and accurate. " prefix
            optimized_prompts[prompt_name] = f"Be precise and accurate. {template}"

        # Verify the optimization by calling eval_fn
        eval_fn(optimized_prompts, train_data)

        return PromptOptimizerOutput(
            optimized_prompts=optimized_prompts,
            initial_eval_score=0.5,
            final_eval_score=0.9,
        )


@pytest.fixture
def sample_translation_prompt() -> PromptVersion:
    return register_prompt(
        name="test_translation_prompt",
        template="Translate the following text to {{language}}: {{input_text}}",
    )


@pytest.fixture
def sample_summarization_prompt() -> PromptVersion:
    return register_prompt(
        name="test_summarization_prompt",
        template="Summarize this text: {{text}}",
    )


@pytest.fixture
def sample_dataset() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "inputs": [
                {"input_text": "Hello", "language": "Spanish"},
                {"input_text": "World", "language": "French"},
                {"input_text": "Goodbye", "language": "Spanish"},
            ],
            "outputs": [
                "Hola",
                "Monde",
                "Adiós",
            ],
        }
    )


@pytest.fixture
def sample_summarization_dataset() -> list[dict[str, Any]]:
    return [
        {
            "inputs": {
                "text": "This is a long document that needs to be summarized into key points."
            },
            "outputs": "Key points summary",
        },
        {
            "inputs": {"text": "Another document with important information for summarization."},
            "outputs": "Important info summary",
        },
    ]


def sample_predict_fn(input_text: str, language: str) -> str:
    mlflow.genai.load_prompt("prompts:/test_translation_prompt/1")
    translations = {
        ("Hello", "Spanish"): "Hola",
        ("World", "French"): "Monde",
        ("Goodbye", "Spanish"): "Adiós",
    }

    # Verify that auto logging is enabled during the evaluation.
    assert len(_post_import_hooks) > 0
    return translations.get((input_text, language), f"translated_{input_text}")


def sample_summarization_fn(text: str) -> str:
    return f"Summary of: {text[:20]}..."


@mlflow.genai.scorers.scorer(name="equivalence")
def equivalence(outputs, expectations):
    return 1.0 if outputs == expectations["expected_response"] else 0.0


def test_optimize_prompts_single_prompt(
    sample_translation_prompt: PromptVersion, sample_dataset: pd.DataFrame
):
    mock_optimizer = MockPromptOptimizer()

    result = optimize_prompts(
        predict_fn=sample_predict_fn,
        train_data=sample_dataset,
        prompt_uris=[
            f"prompts:/{sample_translation_prompt.name}/{sample_translation_prompt.version}"
        ],
        optimizer=mock_optimizer,
        scorers=[equivalence],
    )

    assert len(result.optimized_prompts) == 1
    optimized_prompt = result.optimized_prompts[0]
    assert optimized_prompt.name == sample_translation_prompt.name
    assert optimized_prompt.version == sample_translation_prompt.version + 1
    assert "Be precise and accurate." in optimized_prompt.template
    expected_template = "Translate the following text to {{language}}: {{input_text}}"
    assert expected_template in optimized_prompt.template
    assert result.initial_eval_score == 0.5
    assert result.final_eval_score == 0.9


def test_optimize_prompts_multiple_prompts(
    sample_translation_prompt: PromptVersion,
    sample_summarization_prompt: PromptVersion,
    sample_dataset: pd.DataFrame,
):
    mock_optimizer = MockPromptOptimizer()

    result = optimize_prompts(
        predict_fn=sample_predict_fn,
        train_data=sample_dataset,
        prompt_uris=[
            f"prompts:/{sample_translation_prompt.name}/{sample_translation_prompt.version}",
            f"prompts:/{sample_summarization_prompt.name}/{sample_summarization_prompt.version}",
        ],
        optimizer=mock_optimizer,
        scorers=[equivalence],
    )

    assert len(result.optimized_prompts) == 2
    prompt_names = {prompt.name for prompt in result.optimized_prompts}
    assert sample_translation_prompt.name in prompt_names
    assert sample_summarization_prompt.name in prompt_names
    assert result.initial_eval_score == 0.5
    assert result.final_eval_score == 0.9

    for prompt in result.optimized_prompts:
        assert "Be precise and accurate." in prompt.template


def test_optimize_prompts_eval_function_behavior(
    sample_translation_prompt: PromptVersion, sample_dataset: pd.DataFrame
):
    class TestingOptimizer(BasePromptOptimizer):
        def __init__(self):
            self.model_name = "openai:/gpt-4o-mini"
            self.eval_fn_calls = []

        def optimize(self, eval_fn, dataset, target_prompts, enable_tracking=True):
            # Test that eval_fn works correctly
            test_prompts = {
                "test_translation_prompt": "Prompt Candidate: "
                "Translate {{input_text}} to {{language}}"
            }
            results = eval_fn(test_prompts, dataset)
            self.eval_fn_calls.append((test_prompts, results))

            # Verify results structure
            assert isinstance(results, list)
            assert len(results) == len(dataset)
            for i, result in enumerate(results):
                assert isinstance(result, EvaluationResultRecord)
                assert result.inputs == dataset[i]["inputs"]
                assert result.outputs == dataset[i]["outputs"]
                assert result.score == 1
                assert result.trace is not None

            return PromptOptimizerOutput(optimized_prompts=target_prompts)

    predict_called_count = 0

    def predict_fn(input_text, language):
        prompt = mlflow.genai.load_prompt("prompts:/test_translation_prompt/1").format(
            input_text=input_text, language=language
        )
        nonlocal predict_called_count
        # the first call to the predict_fn is the model check
        if predict_called_count > 0:
            # validate the prompt is replaced with the candidate prompt
            assert "Prompt Candidate" in prompt
        predict_called_count += 1

        return sample_predict_fn(input_text=input_text, language=language)

    testing_optimizer = TestingOptimizer()

    optimize_prompts(
        predict_fn=predict_fn,
        train_data=sample_dataset,
        prompt_uris=[
            f"prompts:/{sample_translation_prompt.name}/{sample_translation_prompt.version}"
        ],
        optimizer=testing_optimizer,
        scorers=[equivalence],
    )

    assert len(testing_optimizer.eval_fn_calls) == 1
    _, eval_results = testing_optimizer.eval_fn_calls[0]
    assert len(eval_results) == 3  # Number of records in sample_dataset
    assert predict_called_count == 4  # 3 records in sample_dataset + 1 for the prediction check


def test_optimize_prompts_with_list_dataset(
    sample_translation_prompt: PromptVersion, sample_summarization_dataset: list[dict[str, Any]]
):
    mock_optimizer = MockPromptOptimizer()

    def summarization_predict_fn(text):
        return f"Summary: {text[:10]}..."

    result = optimize_prompts(
        predict_fn=summarization_predict_fn,
        train_data=sample_summarization_dataset,
        prompt_uris=[
            f"prompts:/{sample_translation_prompt.name}/{sample_translation_prompt.version}"
        ],
        optimizer=mock_optimizer,
        scorers=[equivalence],
    )

    assert len(result.optimized_prompts) == 1
    assert result.initial_eval_score == 0.5
    assert result.final_eval_score == 0.9


def test_optimize_prompts_with_model_name(
    sample_translation_prompt: PromptVersion, sample_dataset: pd.DataFrame
):
    class TestOptimizer(BasePromptOptimizer):
        def __init__(self):
            self.model_name = "test/custom-model"

        def optimize(self, eval_fn, dataset, target_prompts, enable_tracking=True):
            return PromptOptimizerOutput(optimized_prompts=target_prompts)

    testing_optimizer = TestOptimizer()

    result = optimize_prompts(
        predict_fn=sample_predict_fn,
        train_data=sample_dataset,
        prompt_uris=[
            f"prompts:/{sample_translation_prompt.name}/{sample_translation_prompt.version}"
        ],
        optimizer=testing_optimizer,
        scorers=[equivalence],
    )

    assert len(result.optimized_prompts) == 1


def test_optimize_prompts_warns_on_unused_prompt(
    sample_translation_prompt: PromptVersion,
    sample_summarization_prompt: PromptVersion,
    sample_dataset: pd.DataFrame,
    capsys,
):
    mock_optimizer = MockPromptOptimizer()

    # Create predict_fn that only uses translation prompt, not summarization prompt
    def predict_fn_single_prompt(input_text, language):
        prompt = mlflow.genai.load_prompt("prompts:/test_translation_prompt/1")
        prompt.format(input_text=input_text, language=language)
        return sample_predict_fn(input_text=input_text, language=language)

    result = optimize_prompts(
        predict_fn=predict_fn_single_prompt,
        train_data=sample_dataset,
        prompt_uris=[
            f"prompts:/{sample_translation_prompt.name}/{sample_translation_prompt.version}",
            f"prompts:/{sample_summarization_prompt.name}/{sample_summarization_prompt.version}",
        ],
        optimizer=mock_optimizer,
        scorers=[equivalence],
    )

    assert len(result.optimized_prompts) == 2

    captured = capsys.readouterr()
    assert "prompts were not used during evaluation" in captured.err
    assert "test_summarization_prompt" in captured.err


def test_optimize_prompts_with_custom_scorers(
    sample_translation_prompt: PromptVersion, sample_dataset: pd.DataFrame
):
    # Create a custom scorer for case-insensitive matching
    @scorer(name="case_insensitive_match")
    def case_insensitive_match(outputs, expectations):
        # Extract expected_response if expectations is a dict
        if isinstance(expectations, dict) and "expected_response" in expectations:
            expected_value = expectations["expected_response"]
        else:
            expected_value = expectations
        return 1.0 if str(outputs).lower() == str(expected_value).lower() else 0.5

    class MetricTestOptimizer(BasePromptOptimizer):
        def __init__(self):
            self.model_name = "openai:/gpt-4o-mini"
            self.captured_scores = []

        def optimize(self, eval_fn, dataset, target_prompts, enable_tracking=True):
            # Run eval_fn and capture the scores
            results = eval_fn(target_prompts, dataset)
            self.captured_scores = [r.score for r in results]
            return PromptOptimizerOutput(optimized_prompts=target_prompts)

    testing_optimizer = MetricTestOptimizer()

    # Create dataset with outputs that will test custom scorer
    test_dataset = pd.DataFrame(
        {
            "inputs": [
                {"input_text": "Hello", "language": "Spanish"},
                {"input_text": "World", "language": "French"},
            ],
            "outputs": ["HOLA", "monde"],  # Different cases to test custom scorer
        }
    )

    def predict_fn(input_text, language):
        mlflow.genai.load_prompt("prompts:/test_translation_prompt/1")
        # Return lowercase outputs
        return {"Hello": "hola", "World": "monde"}.get(input_text, "unknown")

    result = optimize_prompts(
        predict_fn=predict_fn,
        train_data=test_dataset,
        prompt_uris=[
            f"prompts:/{sample_translation_prompt.name}/{sample_translation_prompt.version}"
        ],
        scorers=[case_insensitive_match],
        optimizer=testing_optimizer,
    )

    # Verify custom scorer was used
    # "hola" vs "HOLA" (case insensitive match) -> 1.0
    # "monde" vs "monde" (exact match) -> 1.0
    assert testing_optimizer.captured_scores == [1.0, 1.0]
    assert len(result.optimized_prompts) == 1


@pytest.mark.parametrize(
    ("train_data", "error_match"),
    [
        # Empty dataset validation (handled by _convert_eval_set_to_df)
        ([], "The dataset is empty"),
        # Missing inputs validation (handled by _convert_eval_set_to_df)
        ([{"outputs": "Hola"}], "Either `inputs` or `trace` column is required"),
        # Empty inputs validation
        (
            [{"inputs": {}, "outputs": "Hola"}],
            "Record 0 is missing required 'inputs' field or it is empty",
        ),
    ],
)
def test_optimize_prompts_validation_errors(
    sample_translation_prompt: PromptVersion,
    train_data: list[dict[str, Any]],
    error_match: str,
):
    with pytest.raises(MlflowException, match=error_match):
        optimize_prompts(
            predict_fn=sample_predict_fn,
            train_data=train_data,
            prompt_uris=[
                f"prompts:/{sample_translation_prompt.name}/{sample_translation_prompt.version}"
            ],
            optimizer=MockPromptOptimizer(),
            scorers=[equivalence],
        )


def test_optimize_prompts_with_chat_prompt(
    sample_translation_prompt: PromptVersion, sample_dataset: pd.DataFrame
):
    chat_prompt = register_prompt(
        name="test_chat_prompt",
        template=[{"role": "user", "content": "{{input_text}}"}],
    )
    with pytest.raises(MlflowException, match="Only text prompts can be optimized"):
        optimize_prompts(
            predict_fn=sample_predict_fn,
            train_data=sample_dataset,
            prompt_uris=[f"prompts:/{chat_prompt.name}/{chat_prompt.version}"],
            optimizer=MockPromptOptimizer(),
            scorers=[equivalence],
        )
```

--------------------------------------------------------------------------------

---[FILE: test_util.py]---
Location: mlflow-master/tests/genai/optimize/test_util.py
Signals: Pydantic

```python
from typing import Any, Union

import pytest
from pydantic import BaseModel

from mlflow.entities.assessment import Feedback
from mlflow.exceptions import MlflowException
from mlflow.genai.judges import CategoricalRating
from mlflow.genai.optimize.util import (
    create_metric_from_scorers,
    infer_type_from_value,
    validate_train_data,
)
from mlflow.genai.scorers import scorer


@pytest.mark.parametrize(
    ("input_value", "expected_type"),
    [
        (None, type(None)),
        (True, bool),
        (42, int),
        (3.14, float),
        ("hello", str),
    ],
)
def test_infer_primitive_types(input_value, expected_type):
    assert infer_type_from_value(input_value) == expected_type


@pytest.mark.parametrize(
    ("input_list", "expected_type"),
    [
        ([], list[Any]),
        ([1, 2, 3], list[int]),
        (["a", "b", "c"], list[str]),
        ([1.0, 2.0, 3.0], list[float]),
        ([True, False, True], list[bool]),
        ([1, "hello", True], list[Union[int, str, bool]]),  # noqa: UP007
        ([1, "hello", True], list[int | str | bool]),
        ([1, 2.0], list[int | float]),
        ([[1, 2], [3, 4]], list[list[int]]),
        ([["a"], ["b", "c"]], list[list[str]]),
    ],
)
def test_infer_list_types(input_list, expected_type):
    assert infer_type_from_value(input_list) == expected_type


@pytest.mark.parametrize(
    ("input_dict", "expected_fields"),
    [
        ({"name": "John", "age": 30, "active": True}, {"name": str, "age": int, "active": bool}),
        ({"score": 95.5, "passed": True}, {"score": float, "passed": bool}),
    ],
)
def test_infer_simple_dict(input_dict, expected_fields):
    result = infer_type_from_value(input_dict)

    assert isinstance(result, type)
    assert issubclass(result, BaseModel)

    for field_name, expected_type in expected_fields.items():
        assert result.__annotations__[field_name] == expected_type


def test_infer_nested_dict():
    data = {
        "user": {"name": "John", "scores": [85, 90, 95]},
        "settings": {"enabled": True, "theme": "dark"},
    }
    result = infer_type_from_value(data)

    assert isinstance(result, type)
    assert issubclass(result, BaseModel)

    # Check nested model types
    user_model = result.__annotations__["user"]
    settings_model = result.__annotations__["settings"]

    assert issubclass(user_model, BaseModel)
    assert issubclass(settings_model, BaseModel)

    # Check nested field types
    assert user_model.__annotations__["name"] == str
    assert user_model.__annotations__["scores"] == list[int]
    assert settings_model.__annotations__["enabled"] == bool
    assert settings_model.__annotations__["theme"] == str


@pytest.mark.parametrize(
    ("model_class", "model_data"),
    [
        (
            type("UserModel", (BaseModel,), {"__annotations__": {"name": str, "age": int}}),
            {"name": "John", "age": 30},
        ),
        (
            type("ProductModel", (BaseModel,), {"__annotations__": {"id": int, "price": float}}),
            {"id": 1, "price": 99.99},
        ),
    ],
)
def test_infer_pydantic_model(model_class, model_data):
    model = model_class(**model_data)
    result = infer_type_from_value(model)
    assert result == model_class


@pytest.mark.parametrize(
    "type_to_infer",
    [
        type("CustomClass", (), {}),
        type("AnotherClass", (), {"custom_attr": 42}),
    ],
)
def test_infer_unsupported_type(type_to_infer):
    obj = type_to_infer()
    assert infer_type_from_value(obj) == Any


@pytest.mark.parametrize(
    ("input_dict", "model_name"),
    [
        ({"name": "John", "age": 30}, "UserData"),
        ({"id": 1, "value": "test"}, "TestModel"),
    ],
)
def test_model_name_parameter(input_dict, model_name):
    result = infer_type_from_value(input_dict, model_name=model_name)
    assert result.__name__ == model_name


@pytest.mark.parametrize(
    ("score", "expected_score"),
    [
        (CategoricalRating.YES, 1.0),
        (CategoricalRating.NO, 0.0),
        ("yes", 1.0),
        ("no", 0.0),
        (True, 1.0),
        (False, 0.0),
        (1, 1.0),
        (0, 0.0),
        (1.0, 1.0),
        (0.0, 0.0),
    ],
)
def test_create_metric_from_scorers_with_single_score(score, expected_score):
    @scorer(name="test_scorer")
    def test_scorer(inputs, outputs):
        return Feedback(name="test_scorer", value=score, rationale="test rationale")

    metric = create_metric_from_scorers([test_scorer])

    result = metric({"input": "test"}, {"output": "result"}, {}, None)
    assert result[0] == expected_score
    assert result[1] == {"test_scorer": "test rationale"}


def test_create_metric_from_scorers_with_multiple_categorical_ratings():
    @scorer(name="scorer1")
    def scorer1(inputs, outputs):
        return Feedback(name="scorer1", value=CategoricalRating.YES, rationale="rationale1")

    @scorer(name="scorer2")
    def scorer2(inputs, outputs):
        return Feedback(name="scorer2", value=CategoricalRating.YES, rationale="rationale2")

    metric = create_metric_from_scorers([scorer1, scorer2])

    # Should average: (1.0 + 1.0) / 2 = 1.0
    result = metric({"input": "test"}, {"output": "result"}, {}, None)
    assert result[0] == 1.0
    assert result[1] == {"scorer1": "rationale1", "scorer2": "rationale2"}


@pytest.mark.parametrize(
    ("train_data", "scorers", "expected_error"),
    [
        # Empty inputs
        (
            [{"inputs": {}, "outputs": "result"}],
            [],
            "Record 0 is missing required 'inputs' field or it is empty",
        ),
        # Missing inputs
        (
            [{"outputs": "result"}],
            [],
            "Record 0 is missing required 'inputs' field or it is empty",
        ),
    ],
)
def test_validate_train_data_errors(train_data, scorers, expected_error):
    import pandas as pd

    with pytest.raises(MlflowException, match=expected_error):
        validate_train_data(pd.DataFrame(train_data), scorers, lambda **kwargs: None)


@pytest.mark.parametrize(
    "train_data",
    [
        # Valid with outputs
        [{"inputs": {"text": "hello"}, "outputs": "result"}],
        # Valid with expectations
        [{"inputs": {"text": "hello"}, "expectations": {"expected": "result"}}],
        # Multiple valid records
        [
            {"inputs": {"text": "hello"}, "outputs": "result1"},
            {"inputs": {"text": "world"}, "expectations": {"expected": "result2"}},
        ],
        # Falsy but valid values: False as output
        [{"inputs": {"text": "hello"}, "outputs": False}],
    ],
)
def test_validate_train_data_success(train_data):
    import pandas as pd

    validate_train_data(pd.DataFrame(train_data), [], lambda **kwargs: None)
```

--------------------------------------------------------------------------------

---[FILE: test_gepa_optimizer.py]---
Location: mlflow-master/tests/genai/optimize/optimizers/test_gepa_optimizer.py

```python
import sys
from typing import Any
from unittest.mock import MagicMock, Mock, patch

import pytest
from packaging.version import Version

from mlflow.genai.optimize.optimizers.gepa_optimizer import GepaPromptOptimizer
from mlflow.genai.optimize.types import EvaluationResultRecord, PromptOptimizerOutput


@pytest.fixture
def sample_train_data():
    return [
        {
            "inputs": {"question": "What is 2+2?"},
            "outputs": "4",
        },
        {
            "inputs": {"question": "What is the capital of France?"},
            "outputs": "Paris",
        },
        {
            "inputs": {"question": "What is 3*3?"},
            "outputs": "9",
        },
        {
            "inputs": {"question": "What color is the sky?"},
            "outputs": "Blue",
        },
    ]


@pytest.fixture
def sample_target_prompts():
    return {
        "system_prompt": "You are a helpful assistant.",
        "instruction": "Answer the following question: {{question}}",
    }


@pytest.fixture
def mock_eval_fn():
    def eval_fn(candidate_prompts: dict[str, str], dataset: list[dict[str, Any]]):
        return [
            EvaluationResultRecord(
                inputs=record["inputs"],
                outputs="outputs",
                expectations=record["outputs"],
                score=0.8,
                trace={"info": "mock trace"},
                rationales={"score": "mock rationale"},
            )
            for record in dataset
        ]

    return eval_fn


def test_gepa_optimizer_initialization():
    optimizer = GepaPromptOptimizer(reflection_model="openai:/gpt-4o")
    assert optimizer.reflection_model == "openai:/gpt-4o"
    assert optimizer.max_metric_calls == 100
    assert optimizer.display_progress_bar is False
    assert optimizer.gepa_kwargs == {}


def test_gepa_optimizer_initialization_with_custom_params():
    optimizer = GepaPromptOptimizer(
        reflection_model="openai:/gpt-4o",
        max_metric_calls=100,
        display_progress_bar=True,
    )
    assert optimizer.reflection_model == "openai:/gpt-4o"
    assert optimizer.max_metric_calls == 100
    assert optimizer.display_progress_bar is True
    assert optimizer.gepa_kwargs == {}


def test_gepa_optimizer_initialization_with_gepa_kwargs():
    gepa_kwargs_example = {"foo": "bar"}
    optimizer = GepaPromptOptimizer(
        reflection_model="openai:/gpt-4o",
        gepa_kwargs=gepa_kwargs_example,
    )
    assert optimizer.reflection_model == "openai:/gpt-4o"
    assert optimizer.max_metric_calls == 100
    assert optimizer.display_progress_bar is False
    assert optimizer.gepa_kwargs == gepa_kwargs_example


def test_gepa_optimizer_optimize(
    sample_train_data: list[dict[str, Any]],
    sample_target_prompts: dict[str, str],
    mock_eval_fn: Any,
):
    mock_gepa_module = MagicMock()
    mock_modules = {
        "gepa": mock_gepa_module,
        "gepa.core": MagicMock(),
        "gepa.core.adapter": MagicMock(),
    }
    mock_result = Mock()
    mock_result.best_candidate = {
        "system_prompt": "You are a highly skilled assistant.",
        "instruction": "Please answer this question carefully: {{question}}",
    }
    mock_result.val_aggregate_scores = [0.5, 0.6, 0.8, 0.9]  # Mock scores for testing
    mock_gepa_module.optimize.return_value = mock_result
    mock_gepa_module.EvaluationBatch = MagicMock()
    optimizer = GepaPromptOptimizer(
        reflection_model="openai:/gpt-4o-mini", max_metric_calls=50, display_progress_bar=True
    )

    with patch.dict(sys.modules, mock_modules):
        result = optimizer.optimize(
            eval_fn=mock_eval_fn,
            train_data=sample_train_data,
            target_prompts=sample_target_prompts,
        )

    # Verify result
    assert isinstance(result, PromptOptimizerOutput)
    assert result.optimized_prompts == mock_result.best_candidate
    assert "system_prompt" in result.optimized_prompts
    assert "instruction" in result.optimized_prompts
    # Verify scores are extracted
    assert result.initial_eval_score == 0.5  # First score
    assert result.final_eval_score == 0.9  # Max score

    # Verify GEPA was called with correct parameters
    mock_gepa_module.optimize.assert_called_once()
    call_kwargs = mock_gepa_module.optimize.call_args.kwargs

    assert call_kwargs["seed_candidate"] == sample_target_prompts
    assert call_kwargs["adapter"] is not None
    assert call_kwargs["max_metric_calls"] == 50
    assert call_kwargs["reflection_lm"] == "openai/gpt-4o-mini"
    assert call_kwargs["display_progress_bar"] is True
    assert len(call_kwargs["trainset"]) == 4


def test_gepa_optimizer_optimize_with_custom_reflection_model(
    sample_train_data: list[dict[str, Any]],
    sample_target_prompts: dict[str, str],
    mock_eval_fn: Any,
):
    mock_gepa_module = MagicMock()
    mock_modules = {
        "gepa": mock_gepa_module,
        "gepa.core": MagicMock(),
        "gepa.core.adapter": MagicMock(),
    }
    mock_result = Mock()
    mock_result.best_candidate = sample_target_prompts
    mock_result.val_aggregate_scores = []
    mock_gepa_module.optimize.return_value = mock_result
    mock_gepa_module.EvaluationBatch = MagicMock()

    optimizer = GepaPromptOptimizer(
        reflection_model="anthropic:/claude-3-5-sonnet-20241022",
    )

    with patch.dict(sys.modules, mock_modules):
        optimizer.optimize(
            eval_fn=mock_eval_fn,
            train_data=sample_train_data,
            target_prompts=sample_target_prompts,
        )

    call_kwargs = mock_gepa_module.optimize.call_args.kwargs
    assert call_kwargs["reflection_lm"] == "anthropic/claude-3-5-sonnet-20241022"


def test_gepa_optimizer_optimize_with_custom_gepa_params(
    sample_train_data: list[dict[str, Any]],
    sample_target_prompts: dict[str, str],
    mock_eval_fn: Any,
):
    mock_gepa_module = MagicMock()
    mock_modules = {
        "gepa": mock_gepa_module,
        "gepa.core": MagicMock(),
        "gepa.core.adapter": MagicMock(),
    }
    mock_result = Mock()
    mock_result.best_candidate = sample_target_prompts
    mock_result.val_aggregate_scores = []
    mock_gepa_module.optimize.return_value = mock_result
    mock_gepa_module.EvaluationBatch = MagicMock()

    optimizer = GepaPromptOptimizer(
        reflection_model="openai:/gpt-4o-mini", gepa_kwargs={"foo": "bar"}
    )

    with patch.dict(sys.modules, mock_modules):
        optimizer.optimize(
            eval_fn=mock_eval_fn,
            train_data=sample_train_data,
            target_prompts=sample_target_prompts,
        )

    call_kwargs = mock_gepa_module.optimize.call_args.kwargs
    assert call_kwargs["foo"] == "bar"


def test_gepa_optimizer_optimize_model_name_parsing(
    sample_train_data: list[dict[str, Any]],
    sample_target_prompts: dict[str, str],
    mock_eval_fn: Any,
):
    mock_gepa_module = MagicMock()
    mock_modules = {
        "gepa": mock_gepa_module,
        "gepa.core": MagicMock(),
        "gepa.core.adapter": MagicMock(),
    }
    mock_result = Mock()
    mock_result.best_candidate = sample_target_prompts
    mock_result.val_aggregate_scores = []
    mock_gepa_module.optimize.return_value = mock_result
    mock_gepa_module.EvaluationBatch = MagicMock()

    optimizer = GepaPromptOptimizer(reflection_model="openai:/gpt-4o")

    with patch.dict(sys.modules, mock_modules):
        optimizer.optimize(
            eval_fn=mock_eval_fn,
            train_data=sample_train_data,
            target_prompts=sample_target_prompts,
        )

    call_kwargs = mock_gepa_module.optimize.call_args.kwargs
    assert call_kwargs["reflection_lm"] == "openai/gpt-4o"


def test_gepa_optimizer_import_error(
    sample_train_data: list[dict[str, Any]],
    sample_target_prompts: dict[str, str],
    mock_eval_fn: Any,
):
    with patch.dict("sys.modules", {"gepa": None}):
        optimizer = GepaPromptOptimizer(reflection_model="openai:/gpt-4o")

        with pytest.raises(ImportError, match="GEPA is not installed"):
            optimizer.optimize(
                eval_fn=mock_eval_fn,
                train_data=sample_train_data,
                target_prompts=sample_target_prompts,
            )


def test_gepa_optimizer_single_record_dataset(
    sample_target_prompts: dict[str, str], mock_eval_fn: Any
):
    single_record_data = [
        {
            "inputs": {"question": "What is 2+2?"},
            "outputs": "4",
        }
    ]

    mock_gepa_module = MagicMock()
    mock_modules = {
        "gepa": mock_gepa_module,
        "gepa.core": MagicMock(),
        "gepa.core.adapter": MagicMock(),
    }
    mock_result = Mock()
    mock_result.best_candidate = sample_target_prompts
    mock_result.val_aggregate_scores = []
    mock_gepa_module.optimize.return_value = mock_result
    mock_gepa_module.EvaluationBatch = MagicMock()

    optimizer = GepaPromptOptimizer(reflection_model="openai:/gpt-4o")

    with patch.dict(sys.modules, mock_modules):
        optimizer.optimize(
            eval_fn=mock_eval_fn,
            train_data=single_record_data,
            target_prompts=sample_target_prompts,
        )

    call_kwargs = mock_gepa_module.optimize.call_args.kwargs
    assert len(call_kwargs["trainset"]) == 1


def test_gepa_optimizer_custom_adapter_evaluate(
    sample_train_data: list[dict[str, Any]],
    sample_target_prompts: dict[str, str],
    mock_eval_fn: Any,
):
    mock_gepa_module = MagicMock()
    mock_modules = {
        "gepa": mock_gepa_module,
        "gepa.core": MagicMock(),
        "gepa.core.adapter": MagicMock(),
    }
    mock_result = Mock()
    mock_result.best_candidate = sample_target_prompts
    mock_result.val_aggregate_scores = []
    mock_gepa_module.optimize.return_value = mock_result
    mock_gepa_module.EvaluationBatch = MagicMock()

    optimizer = GepaPromptOptimizer(reflection_model="openai:/gpt-4o")

    with patch.dict(sys.modules, mock_modules):
        result = optimizer.optimize(
            eval_fn=mock_eval_fn,
            train_data=sample_train_data,
            target_prompts=sample_target_prompts,
        )

    call_kwargs = mock_gepa_module.optimize.call_args.kwargs
    assert "adapter" in call_kwargs
    assert call_kwargs["adapter"] is not None
    assert result.optimized_prompts == sample_target_prompts


def test_make_reflective_dataset_with_traces(
    sample_target_prompts: dict[str, str], mock_eval_fn: Any
):
    mock_gepa_module = MagicMock()
    mock_modules = {
        "gepa": mock_gepa_module,
        "gepa.core": MagicMock(),
        "gepa.core.adapter": MagicMock(),
    }
    mock_gepa_module.EvaluationBatch = MagicMock()
    mock_gepa_module.GEPAAdapter = object
    optimizer = GepaPromptOptimizer(reflection_model="openai:/gpt-4o")

    with patch.dict(sys.modules, mock_modules):
        captured_adapter = None

        def mock_optimize_fn(**kwargs):
            nonlocal captured_adapter
            captured_adapter = kwargs["adapter"]
            mock_result = Mock()
            mock_result.best_candidate = sample_target_prompts
            mock_result.val_aggregate_scores = []
            return mock_result

        mock_gepa_module.optimize = mock_optimize_fn

        # Call optimize to create the inner adapter
        optimizer.optimize(
            eval_fn=mock_eval_fn,
            train_data=[{"inputs": {"question": "test"}, "outputs": "test"}],
            target_prompts=sample_target_prompts,
        )

    # Now test make_reflective_dataset with the captured adapter
    mock_trace = Mock()
    mock_span1 = Mock()
    mock_span1.name = "llm_call"
    mock_span1.inputs = {"prompt": "What is 2+2?"}
    mock_span1.outputs = {"response": "4"}

    mock_span2 = Mock()
    mock_span2.name = "retrieval"
    mock_span2.inputs = {"query": "math"}
    mock_span2.outputs = {"documents": ["doc1", "doc2"]}

    mock_trace.data.spans = [mock_span1, mock_span2]

    # Create mock trajectories
    mock_trajectory1 = Mock()
    mock_trajectory1.trace = mock_trace
    mock_trajectory1.inputs = {"question": "What is 2+2?"}
    mock_trajectory1.outputs = "4"
    mock_trajectory1.expectations = {"expected_response": "4"}

    mock_trajectory2 = Mock()
    mock_trajectory2.trace = None
    mock_trajectory2.inputs = {"question": "What is the capital of France?"}
    mock_trajectory2.outputs = "Paris"
    mock_trajectory2.expectations = {"expected_response": "Paris"}

    # Create mock evaluation batch
    mock_eval_batch = Mock()
    mock_eval_batch.trajectories = [mock_trajectory1, mock_trajectory2]
    mock_eval_batch.scores = [0.9, 0.7]

    # Test make_reflective_dataset
    candidate = {"system_prompt": "You are helpful"}
    components_to_update = ["system_prompt", "instruction"]

    result = captured_adapter.make_reflective_dataset(
        candidate, mock_eval_batch, components_to_update
    )

    # Verify result structure
    assert isinstance(result, dict)
    assert "system_prompt" in result
    assert "instruction" in result

    system_data = result["system_prompt"]
    assert len(system_data) == 2
    assert system_data[0]["component_name"] == "system_prompt"
    assert system_data[0]["current_text"] == "You are helpful"
    assert system_data[0]["score"] == 0.9
    assert system_data[0]["inputs"] == {"question": "What is 2+2?"}
    assert system_data[0]["outputs"] == "4"
    assert system_data[0]["expectations"] == {"expected_response": "4"}
    assert system_data[0]["index"] == 0

    # Verify trace spans
    assert len(system_data[0]["trace"]) == 2
    assert system_data[0]["trace"][0]["name"] == "llm_call"
    assert system_data[0]["trace"][0]["inputs"] == {"prompt": "What is 2+2?"}
    assert system_data[0]["trace"][0]["outputs"] == {"response": "4"}
    assert system_data[0]["trace"][1]["name"] == "retrieval"

    # Verify second record (no trace)
    assert system_data[1]["trace"] == []
    assert system_data[1]["score"] == 0.7
    assert system_data[1]["inputs"] == {"question": "What is the capital of France?"}
    assert system_data[1]["outputs"] == "Paris"
    assert system_data[1]["expectations"] == {"expected_response": "Paris"}


@pytest.mark.parametrize("gepa_version", ["0.0.9", "0.0.18", "0.1.0"])
@pytest.mark.parametrize("enable_tracking", [True, False])
def test_gepa_optimizer_version_check(
    sample_train_data: list[dict[str, Any]],
    sample_target_prompts: dict[str, str],
    mock_eval_fn: Any,
    gepa_version: str,
    enable_tracking: bool,
):
    mock_gepa_module = MagicMock()
    mock_modules = {
        "gepa": mock_gepa_module,
        "gepa.core": MagicMock(),
        "gepa.core.adapter": MagicMock(),
    }
    mock_result = Mock()
    mock_result.best_candidate = sample_target_prompts
    mock_result.val_aggregate_scores = []
    mock_gepa_module.optimize.return_value = mock_result
    mock_gepa_module.EvaluationBatch = MagicMock()

    optimizer = GepaPromptOptimizer(reflection_model="openai:/gpt-4o")

    with (
        patch.dict(sys.modules, mock_modules),
        patch("importlib.metadata.version", return_value=gepa_version),
    ):
        optimizer.optimize(
            eval_fn=mock_eval_fn,
            train_data=sample_train_data,
            target_prompts=sample_target_prompts,
            enable_tracking=enable_tracking,
        )

    call_kwargs = mock_gepa_module.optimize.call_args.kwargs

    if Version(gepa_version) < Version("0.0.10"):
        assert "use_mlflow" not in call_kwargs
    else:
        assert "use_mlflow" in call_kwargs
        assert call_kwargs["use_mlflow"] == enable_tracking
```

--------------------------------------------------------------------------------

````
