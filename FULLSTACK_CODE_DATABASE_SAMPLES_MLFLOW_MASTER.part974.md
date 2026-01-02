---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 974
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 974 of 991)

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

---[FILE: test_transformers_peft_model.py]---
Location: mlflow-master/tests/transformers/test_transformers_peft_model.py

```python
import importlib

import pytest
import transformers
from packaging.version import Version

import mlflow
from mlflow.models import Model
from mlflow.transformers.peft import get_peft_base_model, is_peft_model

SKIP_IF_PEFT_NOT_AVAILABLE = pytest.mark.skipif(
    (
        importlib.util.find_spec("peft") is None
        or Version(transformers.__version__) <= Version("4.25.1")
    ),
    reason="PEFT is not installed or Transformer version is too old",
)
pytestmark = SKIP_IF_PEFT_NOT_AVAILABLE


def test_is_peft_model(peft_pipeline, small_qa_pipeline):
    assert is_peft_model(peft_pipeline.model)
    assert not is_peft_model(small_qa_pipeline.model)


def test_get_peft_base_model(peft_pipeline):
    base_model = get_peft_base_model(peft_pipeline.model)
    assert base_model.__class__.__name__ == "BertForSequenceClassification"
    assert base_model.name_or_path == "Elron/bleurt-tiny-512"


def test_get_peft_base_model_prompt_learning(small_qa_pipeline):
    from peft import PeftModel, PromptTuningConfig, TaskType

    peft_config = PromptTuningConfig(
        task_type=TaskType.QUESTION_ANS,
        num_virtual_tokens=10,
        peft_type="PROMPT_TUNING",
    )
    peft_model = PeftModel(small_qa_pipeline.model, peft_config)

    base_model = get_peft_base_model(peft_model)
    assert base_model.__class__.__name__ == "MobileBertForQuestionAnswering"
    assert base_model.name_or_path == "csarron/mobilebert-uncased-squad-v2"


def test_save_and_load_peft_pipeline(peft_pipeline, tmp_path):
    import peft

    from tests.transformers.test_transformers_model_export import HF_COMMIT_HASH_PATTERN

    mlflow.transformers.save_model(
        transformers_model=peft_pipeline,
        path=tmp_path,
    )

    # For PEFT, only the adapter model should be saved
    assert tmp_path.joinpath("peft").exists()
    assert not tmp_path.joinpath("model").exists()
    assert not tmp_path.joinpath("components").exists()

    # Validate the contents of MLModel file
    flavor_conf = Model.load(str(tmp_path.joinpath("MLmodel"))).flavors["transformers"]
    assert "model_binary" not in flavor_conf
    assert HF_COMMIT_HASH_PATTERN.match(flavor_conf["source_model_revision"])
    assert flavor_conf["peft_adaptor"] == "peft"

    # Validate peft is recorded to requirements.txt
    with open(tmp_path.joinpath("requirements.txt")) as f:
        assert f"peft=={peft.__version__}" in f.read()

    loaded_pipeline = mlflow.transformers.load_model(tmp_path)
    assert isinstance(loaded_pipeline.model, peft.PeftModel)
    loaded_pipeline.predict("Hi")


def test_save_and_load_peft_components(peft_pipeline, tmp_path, capsys):
    from peft import PeftModel

    mlflow.transformers.save_model(
        transformers_model={
            "model": peft_pipeline.model,
            "tokenizer": peft_pipeline.tokenizer,
        },
        path=tmp_path,
    )

    # PEFT pipeline construction error should not be raised
    peft_err_msg = (
        "The model 'PeftModelForSequenceClassification' is not supported for text-classification"
    )
    assert peft_err_msg not in capsys.readouterr().err

    loaded_pipeline = mlflow.transformers.load_model(tmp_path)
    assert isinstance(loaded_pipeline.model, PeftModel)
    loaded_pipeline.predict("Hi")


def test_log_peft_pipeline(peft_pipeline):
    from peft import PeftModel

    with mlflow.start_run():
        model_info = mlflow.transformers.log_model(peft_pipeline, name="model", input_example="hi")

    loaded_pipeline = mlflow.transformers.load_model(model_info.model_uri)
    assert isinstance(loaded_pipeline.model, PeftModel)
    loaded_pipeline.predict("Hi")
```

--------------------------------------------------------------------------------

---[FILE: test_transformers_prompt_templating.py]---
Location: mlflow-master/tests/transformers/test_transformers_prompt_templating.py

```python
from unittest.mock import MagicMock

import pytest
import transformers
import yaml
from packaging.version import Version

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.transformers import _SUPPORTED_PROMPT_TEMPLATING_TASK_TYPES, _validate_prompt_template
from mlflow.transformers.flavor_config import FlavorKey

# session fixtures to prevent saving and loading a ~400mb model every time
TEST_PROMPT_TEMPLATE = "Answer the following question like a pirate:\nQ: {prompt}\nA: "

UNSUPPORTED_PIPELINES = [
    "audio-classification",
    "automatic-speech-recognition",
    "text-to-audio",
    "text-to-speech",
    "text-classification",
    "sentiment-analysis",
    "token-classification",
    "ner",
    "question-answering",
    "table-question-answering",
    "visual-question-answering",
    "vqa",
    "document-question-answering",
    "translation",
    "zero-shot-classification",
    "zero-shot-image-classification",
    "zero-shot-audio-classification",
    "conversational",
    "image-classification",
    "image-segmentation",
    "image-to-text",
    "object-detection",
    "zero-shot-object-detection",
    "depth-estimation",
    "video-classification",
    "mask-generation",
]

if Version(transformers.__version__) >= Version("4.34.1"):
    UNSUPPORTED_PIPELINES.append("image-to-image")


@pytest.fixture(scope="session")
def small_text_generation_model():
    return transformers.pipeline("text-generation", model="distilgpt2")


@pytest.fixture(scope="session")
def saved_transformers_model_path(tmp_path_factory, small_text_generation_model):
    tmp_path = tmp_path_factory.mktemp("model")
    mlflow.transformers.save_model(
        transformers_model=small_text_generation_model,
        path=tmp_path,
        prompt_template=TEST_PROMPT_TEMPLATE,
    )
    return tmp_path


@pytest.mark.parametrize(
    "template",
    [
        "{multiple} {placeholders}",
        "No placeholders",
        "Placeholder {that} isn't `prompt`",
        "Placeholder without a {} name",
        "Placeholder with {prompt} and {} empty",
        1001,  # not a string
    ],
)
def test_prompt_validation_throws_on_invalid_templates(template):
    match = (
        "Argument `prompt_template` must be a string with a single format arg, 'prompt'."
        if isinstance(template, str)
        else "Argument `prompt_template` must be a string"
    )
    with pytest.raises(MlflowException, match=match):
        _validate_prompt_template(template)


@pytest.mark.parametrize(
    "template",
    [
        "Single placeholder {prompt}",
        "Text can be before {prompt} and after",
        # the formatter will interpret the double braces as a literal single brace
        "Escaped braces {{ work fine {prompt} }}",
    ],
)
def test_prompt_validation_succeeds_on_valid_templates(template):
    assert _validate_prompt_template(template) is None


# test that prompt is saved to mlmodel file and is present in model load
def test_prompt_save_and_load(saved_transformers_model_path):
    mlmodel_path = saved_transformers_model_path / MLMODEL_FILE_NAME
    with open(mlmodel_path) as f:
        mlmodel_dict = yaml.safe_load(f)

    assert mlmodel_dict["metadata"][FlavorKey.PROMPT_TEMPLATE] == TEST_PROMPT_TEMPLATE

    model = mlflow.pyfunc.load_model(saved_transformers_model_path)
    assert model._model_impl.prompt_template == TEST_PROMPT_TEMPLATE
    assert model._model_impl.model_config["return_full_text"] is False


def test_model_save_override_return_full_text(tmp_path, small_text_generation_model):
    mlflow.transformers.save_model(
        transformers_model=small_text_generation_model,
        path=tmp_path,
        prompt_template=TEST_PROMPT_TEMPLATE,
        model_config={"return_full_text": True},
    )
    model = mlflow.pyfunc.load_model(tmp_path)
    assert model._model_impl.model_config["return_full_text"] is True


def test_saving_prompt_throws_on_unsupported_task():
    model = transformers.pipeline("text-generation", model="distilgpt2")

    for pipeline_type in UNSUPPORTED_PIPELINES:
        # mock the task by setting it explicitly
        model.task = pipeline_type

        with pytest.raises(
            MlflowException,
            match=f"Prompt templating is not supported for the `{pipeline_type}` task type.",
        ):
            mlflow.transformers.save_model(
                transformers_model=model,
                path="model",
                prompt_template=TEST_PROMPT_TEMPLATE,
            )


def test_prompt_formatting(saved_transformers_model_path):
    model_impl = mlflow.pyfunc.load_model(saved_transformers_model_path)._model_impl

    # test that the formatting function throws for unsupported pipelines
    # this is a bit of a redundant test, because the function is explicitly
    # called only on supported pipelines.
    for pipeline_type in UNSUPPORTED_PIPELINES:
        model_impl.pipeline = MagicMock(task=pipeline_type, return_value="")
        with pytest.raises(
            MlflowException,
            match="_format_prompt_template called on an unexpected pipeline type.",
        ):
            result = model_impl._format_prompt_template("test")

    # test that supported pipelines apply the prompt template
    for pipeline_type in _SUPPORTED_PROMPT_TEMPLATING_TASK_TYPES:
        model_impl.pipeline = MagicMock(task=pipeline_type, return_value="")
        result = model_impl._format_prompt_template("test")
        assert result == TEST_PROMPT_TEMPLATE.format(prompt="test")

        result_list = model_impl._format_prompt_template(["item1", "item2"])
        assert result_list == [
            TEST_PROMPT_TEMPLATE.format(prompt="item1"),
            TEST_PROMPT_TEMPLATE.format(prompt="item2"),
        ]


# test that prompt is used in pyfunc predict
@pytest.mark.parametrize(
    ("task", "pipeline_fixture", "output_key"),
    [
        ("feature-extraction", "feature_extraction_pipeline", None),
        ("fill-mask", "fill_mask_pipeline", "token_str"),
        ("summarization", "summarizer_pipeline", "summary_text"),
        ("text2text-generation", "text2text_generation_pipeline", "generated_text"),
        ("text-generation", "text_generation_pipeline", "generated_text"),
    ],
)
def test_prompt_used_in_predict(task, pipeline_fixture, output_key, request, tmp_path):
    pipeline = request.getfixturevalue(pipeline_fixture)

    if task == "summarization" and Version(transformers.__version__) > Version("4.44.2"):
        pytest.skip(
            reason="Multi-task pipeline has a loading issue with Transformers 4.45.x. "
            "See https://github.com/huggingface/transformers/issues/33398 for more details."
        )

    model_path = tmp_path / "model"
    mlflow.transformers.save_model(
        transformers_model=pipeline,
        path=model_path,
        prompt_template=TEST_PROMPT_TEMPLATE,
    )

    model = mlflow.pyfunc.load_model(model_path)
    prompt = "What is MLflow?"
    formatted_prompt = TEST_PROMPT_TEMPLATE.format(prompt=prompt)
    mock_response = "MLflow be a tool fer machine lernin'"
    mock_return = [[{output_key: formatted_prompt + mock_response}]]

    model._model_impl.pipeline = MagicMock(
        spec=model._model_impl.pipeline, task=task, return_value=mock_return
    )

    model.predict(prompt)

    # check that the underlying pipeline was called with the formatted prompt template
    if task == "text-generation":
        model._model_impl.pipeline.assert_called_once_with(
            [formatted_prompt], return_full_text=False
        )
    else:
        model._model_impl.pipeline.assert_called_once_with([formatted_prompt])


def test_prompt_and_llm_inference_task(tmp_path, request):
    pipeline = request.getfixturevalue("text_generation_pipeline")

    model_path = tmp_path / "model"
    mlflow.transformers.save_model(
        transformers_model=pipeline,
        path=model_path,
        prompt_template=TEST_PROMPT_TEMPLATE,
        task="llm/v1/completions",
    )

    model = mlflow.pyfunc.load_model(model_path)

    prompt = "What is MLflow?"
    formatted_prompt = TEST_PROMPT_TEMPLATE.format(prompt=prompt)
    mock_return = [[{"generated_token_ids": [1, 2, 3]}]]

    model._model_impl.pipeline = MagicMock(
        spec=model._model_impl.pipeline, task="text-generation", return_value=mock_return
    )

    model.predict({"prompt": prompt})

    model._model_impl.pipeline.assert_called_once_with(
        [formatted_prompt], return_full_text=None, return_tensors=True
    )
```

--------------------------------------------------------------------------------

---[FILE: test_transformers_signature.py]---
Location: mlflow-master/tests/transformers/test_transformers_signature.py

```python
import json
import time
from unittest import mock

import pytest

from mlflow.models.signature import ModelSignature
from mlflow.transformers import _try_import_conversational_pipeline
from mlflow.transformers.signature import (
    _TEXT2TEXT_SIGNATURE,
    format_input_example_for_special_cases,
    infer_or_get_default_signature,
)
from mlflow.types.schema import ColSpec, DataType, Schema


@pytest.mark.parametrize(
    ("pipeline_name", "example", "expected_signature"),
    [
        (
            "small_qa_pipeline",
            {"question": "Who's house?", "context": "The house is owned by Run."},
            ModelSignature(
                inputs=Schema(
                    [
                        ColSpec(DataType.string, name="question"),
                        ColSpec(DataType.string, name="context"),
                    ]
                ),
                outputs=Schema([ColSpec(DataType.string)]),
            ),
        ),
        (
            "zero_shot_pipeline",
            {
                "sequences": "My dog loves to eat spaghetti",
                "candidate_labels": ["happy", "sad"],
                "hypothesis_template": "This example talks about how the dog is {}",
            },
            ModelSignature(
                inputs=Schema(
                    [
                        ColSpec(DataType.string, name="sequences"),
                        # in transformers, we internally convert values of candidate_labels
                        # to string for zero_shot_pipeline
                        ColSpec(DataType.string, name="candidate_labels"),
                        ColSpec(DataType.string, name="hypothesis_template"),
                    ]
                ),
                outputs=Schema(
                    [
                        ColSpec(DataType.string, name="sequence"),
                        ColSpec(DataType.string, name="labels"),
                        ColSpec(DataType.double, name="scores"),
                    ]
                ),
            ),
        ),
        (
            "text_classification_pipeline",
            "We're just going to have to agree to disagree, then.",
            ModelSignature(
                inputs=Schema([ColSpec(DataType.string)]),
                outputs=Schema(
                    [ColSpec(DataType.string, name="label"), ColSpec(DataType.double, name="score")]
                ),
            ),
        ),
        (
            "table_question_answering_pipeline",
            {
                "query": "how many widgets?",
                "table": json.dumps({"units": ["100", "200"], "widgets": ["500", "500"]}),
            },
            ModelSignature(
                inputs=Schema(
                    [ColSpec(DataType.string, name="query"), ColSpec(DataType.string, name="table")]
                ),
                outputs=Schema([ColSpec(DataType.string)]),
            ),
        ),
        (
            "summarizer_pipeline",
            "If you write enough tests, you can be sure that your code isn't broken.",
            ModelSignature(
                inputs=Schema([ColSpec(DataType.string)]),
                outputs=Schema([ColSpec(DataType.string)]),
            ),
        ),
        (
            "translation_pipeline",
            "No, I am your father.",
            ModelSignature(
                inputs=Schema([ColSpec(DataType.string)]),
                outputs=Schema([ColSpec(DataType.string)]),
            ),
        ),
        (
            "text_generation_pipeline",
            ["models are", "apples are"],
            ModelSignature(
                inputs=Schema([ColSpec(DataType.string)]),
                outputs=Schema([ColSpec(DataType.string)]),
            ),
        ),
        (
            "text2text_generation_pipeline",
            ["man apple pie", "dog pizza eat"],
            ModelSignature(
                inputs=Schema([ColSpec(DataType.string)]),
                outputs=Schema([ColSpec(DataType.string)]),
            ),
        ),
        (
            "fill_mask_pipeline",
            ["I use stacks of <mask> to buy things", "I <mask> the whole bowl of cherries"],
            ModelSignature(
                inputs=Schema([ColSpec("string")]),
                outputs=Schema([ColSpec("string")]),
            ),
        ),
        (
            "conversational_pipeline",
            "What's shaking, my robot homie?",
            ModelSignature(
                inputs=Schema([ColSpec(DataType.string)]),
                outputs=Schema([ColSpec(DataType.string)]),
            ),
        ),
        (
            "ner_pipeline",
            "Blue apples are not a thing",
            ModelSignature(
                inputs=Schema([ColSpec(DataType.string)]),
                outputs=Schema([ColSpec(DataType.string)]),
            ),
        ),
    ],
)
def test_signature_inference(pipeline_name, example, expected_signature, request):
    if pipeline_name == "conversational_pipeline" and _try_import_conversational_pipeline() is None:
        pytest.skip("Conversation model is deprecated and removed.")
    pipeline = request.getfixturevalue(pipeline_name)

    default_signature = infer_or_get_default_signature(pipeline)
    assert default_signature == expected_signature

    signature_from_input_example = infer_or_get_default_signature(pipeline, example=example)
    assert signature_from_input_example == expected_signature


def test_infer_signature_timeout_then_fall_back_to_default(text_generation_pipeline, monkeypatch):
    monkeypatch.setenv("MLFLOW_INPUT_EXAMPLE_INFERENCE_TIMEOUT", "1")  # Set timeout to 1 second

    # Mock _TransformersWrapper.predict to simulate a long-running prediction
    def _slow_predict(*args, **kwargs):
        time.sleep(10)
        return 0

    with mock.patch("mlflow.transformers._TransformersWrapper.predict", side_effect=_slow_predict):
        signature = infer_or_get_default_signature(text_generation_pipeline, example=["test"])

    assert signature == _TEXT2TEXT_SIGNATURE


def test_infer_signature_prediction_error_then_fall_back_to_default(text_generation_pipeline):
    with mock.patch(
        "mlflow.transformers._TransformersWrapper.predict", side_effect=ValueError("Error")
    ):
        signature = infer_or_get_default_signature(text_generation_pipeline, example=["test"])

    assert signature == _TEXT2TEXT_SIGNATURE


@pytest.mark.parametrize(
    ("pipeline_name", "example", "expected"),
    [
        (
            "fill_mask_pipeline",
            ["I use stacks of <mask> to buy things", "I <mask> the whole bowl of cherries"],
            ["I use stacks of <mask> to buy things", "I <mask> the whole bowl of cherries"],
        ),
        (
            "zero_shot_pipeline",
            {
                "sequences": ["My dog loves to eat spaghetti", "My dog hates going to the vet"],
                "candidate_labels": ["happy", "sad"],
                "hypothesis_template": "This example talks about how the dog is {}",
            },
            {
                "sequences": ["My dog loves to eat spaghetti", "My dog hates going to the vet"],
                # candidate_labels should be converted to string
                "candidate_labels": '["happy", "sad"]',
                "hypothesis_template": "This example talks about how the dog is {}",
            },
        ),
    ],
)
def test_format_input_example_for_special_cases(request, pipeline_name, example, expected):
    pipeline = request.getfixturevalue(pipeline_name)
    formatted_example = format_input_example_for_special_cases(example, pipeline)
    assert formatted_example == expected
```

--------------------------------------------------------------------------------

---[FILE: test_genai_types.py]---
Location: mlflow-master/tests/types/test_genai_types.py
Signals: Pydantic

```python
import pytest
from pydantic import ValidationError

from mlflow.types.chat import ChatCompletionResponse


def test_instantiation_chat_completion():
    response_structure = {
        "id": "1",
        "object": "1",
        "created": 1,
        "model": "model",
        "choices": [
            {
                "index": 0,
                "message": {"role": "user", "content": "hi"},
                "finish_reason": None,
            },
            {
                "index": 1,
                "message": {"role": "user", "content": "there"},
                "finish_reason": "STOP",
            },
        ],
        "usage": {"prompt_tokens": 12, "completion_tokens": 22, "total_tokens": 34},
    }

    response = ChatCompletionResponse(**response_structure)

    assert response.id == "1"
    assert response.object == "1"
    assert response.created == 1
    assert response.model == "model"
    assert len(response.choices) == 2
    assert response.choices[0].index == 0
    assert response.choices[0].message.content == "hi"
    assert response.choices[1].finish_reason == "STOP"
    assert response.usage.prompt_tokens == 12
    assert response.usage.completion_tokens == 22
    assert response.usage.total_tokens == 34


def test_invalid_chat_completion():
    invalid_response_structure = {
        "id": "1",
        "model": "model",
        "choices": [
            {
                "index": 0,
                "message": {"role": "user", "content": "hi"},
            }
        ],
        "usage": {"prompt_tokens": 12, "completion_tokens": 22, "total_tokens": 34},
    }

    with pytest.raises(ValidationError, match="1 validation error for ChatCompletionResponse"):
        ChatCompletionResponse(**invalid_response_structure)
```

--------------------------------------------------------------------------------

````
