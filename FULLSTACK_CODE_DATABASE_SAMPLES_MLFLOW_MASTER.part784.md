---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 784
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 784 of 991)

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

---[FILE: test_dspy_evaluate.py]---
Location: mlflow-master/tests/dspy/test_dspy_evaluate.py

```python
import importlib.metadata

import dspy
import pandas as pd
import pytest
from dspy.utils.dummies import DummyLM
from packaging.version import Version

import mlflow
import mlflow.utils
import mlflow.utils.autologging_utils
from mlflow.tracing.constant import TraceMetadataKey

from tests.openai.test_openai_evaluate import purge_traces
from tests.tracing.helper import get_traces, reset_autolog_state  # noqa: F401

if Version(importlib.metadata.version("dspy")) < Version("2.5.17"):
    pytest.skip("Evaluation test requires dspy>=2.5.17", allow_module_level=True)

_EVAL_DATA = pd.DataFrame(
    {
        "inputs": [
            "What is MLflow?",
            "What is Spark?",
        ],
        "ground_truth": [
            "MLflow is an open-source platform to manage the ML lifecycle.",
            "Spark is a unified analytics engine for big data processing.",
        ],
    }
)


def get_fake_model():
    dspy.settings.configure(
        lm=DummyLM(
            {
                "What is MLflow?": {
                    "answer": "MLflow is an open-source platform to manage the ML lifecycle.",
                    "reasoning": "No reasoning provided.",
                },
                "What is Spark?": {
                    "answer": "Spark is a unified analytics engine for big data processing.",
                    "reasoning": "No reasoning provided.",
                },
            }
        )
    )

    class CoT(dspy.Module):
        def __init__(self):
            super().__init__()
            self.generate_answer = dspy.ChainOfThought("question -> answer")

        def forward(self, question):
            prediction = self.generate_answer(question=question)
            return dspy.Prediction(answer=prediction.answer)

    return CoT()


@pytest.mark.parametrize(
    "config",
    [
        None,
        {"log_traces": False},
        {"log_traces": True},
    ],
)
@pytest.mark.usefixtures("reset_autolog_state")
def test_dspy_evaluate(config):
    if config:
        mlflow.dspy.autolog(**config)

    is_trace_disabled = config and not config.get("log_traces", True)
    is_trace_enabled = config and config.get("log_traces", True)

    cot = get_fake_model()

    def model(inputs):
        return [cot(question).answer for question in inputs["inputs"]]

    with mlflow.start_run() as run:
        eval_result = mlflow.evaluate(
            model,
            data=_EVAL_DATA,
            targets="ground_truth",
            extra_metrics=[mlflow.metrics.exact_match()],
        )
    assert eval_result.metrics["exact_match/v1"] == 1.0

    # Traces should not be logged when disabled explicitly
    if is_trace_disabled:
        assert len(get_traces()) == 0
    else:
        assert len(get_traces()) == 2
        assert run.info.run_id == get_traces()[0].info.request_metadata[TraceMetadataKey.SOURCE_RUN]

    purge_traces()

    # Test original autolog configs is restored
    cot(question="What is MLflow?")
    assert len(get_traces()) == (1 if is_trace_enabled else 0)


@pytest.mark.skip(
    reason="DSPy pyfunc wrapper does not support batch inputs, which is required for eval. "
    "Unskip when we add support for batch inputs."
)
@pytest.mark.usefixtures("reset_autolog_state")
def test_dspy_pyfunc_evaluate():
    with mlflow.start_run() as run:
        model_info = mlflow.dspy.log_model(get_fake_model(), name="model")
        eval_result = mlflow.evaluate(
            model_info.model_uri,
            data=_EVAL_DATA,
            targets="ground_truth",
            extra_metrics=[mlflow.metrics.exact_match()],
        )
    assert eval_result.metrics["exact_match/v1"] == 1.0

    # Traces should be automatically enabled during evaluation
    assert len(get_traces()) == 2
    assert run.info.run_id == get_traces()[0].info.request_metadata[TraceMetadataKey.SOURCE_RUN]


@pytest.mark.parametrize("globally_disabled", [True, False])
@pytest.mark.usefixtures("reset_autolog_state")
def test_dspy_evaluate_should_not_log_traces_when_disabled(globally_disabled):
    if globally_disabled:
        mlflow.autolog(disable=True)
    else:
        mlflow.dspy.autolog(disable=True)

    cot = get_fake_model()

    def model(inputs):
        return [cot(question).answer for question in inputs["inputs"]]

    with mlflow.start_run():
        eval_result = mlflow.evaluate(
            model,
            data=_EVAL_DATA,
            targets="ground_truth",
            extra_metrics=[mlflow.metrics.exact_match()],
        )
    assert eval_result.metrics["exact_match/v1"] == 1.0
    assert len(get_traces()) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_dspy_util.py]---
Location: mlflow-master/tests/dspy/test_dspy_util.py

```python
import importlib.metadata
import json

import dspy
import pytest
from packaging.version import Version

import mlflow
from mlflow.dspy.util import (
    log_dspy_dataset,
    log_dspy_lm_state,
    log_dspy_module_params,
    save_dspy_module_state,
)
from mlflow.tracking import MlflowClient


@pytest.mark.skipif(
    Version(importlib.metadata.version("dspy")) < Version("2.5.43"),
    reason="dump_state works differently in older versions",
)
def test_save_dspy_module_state(tmp_path):
    program = dspy.ChainOfThought("question -> answer")

    with mlflow.start_run() as run:
        save_dspy_module_state(program)

    client = MlflowClient()
    artifacts = (x.path for x in client.list_artifacts(run.info.run_id))
    assert "model.json" in artifacts
    client.download_artifacts(run_id=run.info.run_id, path="model.json", dst_path=tmp_path)
    loaded_program = dspy.ChainOfThought("b -> a")
    loaded_program.load(tmp_path / "model.json")
    assert loaded_program.dump_state() == program.dump_state()


def test_log_dspy_module_state_params():
    program = dspy.Predict("question -> answer: list[str]")
    program.demos = [
        dspy.Example(question="What are cities in Japan?", answer=["Tokyo", "Osaka"]).with_inputs(
            "question"
        ),
    ]

    with mlflow.start_run() as run:
        log_dspy_module_params(program)

    run = mlflow.last_active_run()

    # DSPy >= 3.0 changed how list values are flattened
    expected_params = {
        "Predict.signature.fields.0.description": "${question}",
        "Predict.signature.fields.0.prefix": "Question:",
        "Predict.signature.fields.1.description": "${answer}",
        "Predict.signature.fields.1.prefix": "Answer:",
        "Predict.signature.instructions": "Given the fields `question`, produce the fields `answer`.",  # noqa: E501
        "Predict.demos.0.question": "What are cities in Japan?",
    }

    if Version(importlib.metadata.version("dspy")).major >= 3:
        expected_params.update(
            {
                "Predict.demos.0.answer.0": "Tokyo",
                "Predict.demos.0.answer.1": "Osaka",
            }
        )
    else:
        expected_params["Predict.demos.0.answer"] = "['Tokyo', 'Osaka']"

    assert run.data.params == expected_params


def test_log_dataset(tmp_path):
    dataset = [
        dspy.Example(question="What is 1 + 1?", answer="2").with_inputs("question"),
        dspy.Example(question="What is 2 + 2?", answer="4").with_inputs("question"),
    ]

    with mlflow.start_run() as run:
        log_dspy_dataset(dataset, "dataset.json")

    client = MlflowClient()
    artifacts = (x.path for x in client.list_artifacts(run.info.run_id))
    assert "dataset.json" in artifacts
    client.download_artifacts(run_id=run.info.run_id, path="dataset.json", dst_path=tmp_path)
    saved_dataset = json.loads((tmp_path / "dataset.json").read_text())
    assert saved_dataset == {
        "columns": ["question", "answer"],
        "data": [
            ["What is 1 + 1?", "2"],
            ["What is 2 + 2?", "4"],
        ],
    }


def test_log_dspy_lm_state():
    lm = dspy.LM(
        model="openai/gpt-4o-mini",
        temperature=0.7,
        max_tokens=1000,
        cache=True,
        top_p=0.9,
        api_key="secret-key",
        api_base="https://api.openai.com",
    )
    with dspy.context(lm=lm):
        with mlflow.start_run():
            log_dspy_lm_state()

        run = mlflow.last_active_run()
        assert "lm_params" in run.data.params

        lm_params = json.loads(run.data.params["lm_params"])

        # Verify expected attributes are present
        assert lm_params == {
            "model": "openai/gpt-4o-mini",
            "cache": True,
            "model_type": "chat",
            "temperature": 0.7,
            "max_tokens": 1000,
            "top_p": 0.9,
        }

        # Verify sensitive attributes are filtered out
        assert "api_key" not in lm_params
        assert "api_base" not in lm_params
```

--------------------------------------------------------------------------------

---[FILE: test_save.py]---
Location: mlflow-master/tests/dspy/test_save.py

```python
import importlib
import json
from unittest import mock

import dspy
import dspy.teleprompt
import pytest
from dspy.utils.dummies import DummyLM, dummy_rm
from packaging.version import Version

import mlflow
from mlflow.models import Model, ModelSignature
from mlflow.types.schema import ColSpec, Schema

from tests.helper_functions import (
    _assert_pip_requirements,
    _compare_logged_code_paths,
    _mlflow_major_version_string,
    expect_status_code,
    pyfunc_serve_and_score_model,
)

_DSPY_VERSION = Version(importlib.metadata.version("dspy"))

_DSPY_UNDER_2_6 = _DSPY_VERSION < Version("2.6.0")

_DSPY_2_6_23_OR_OLDER = _DSPY_VERSION <= Version("2.6.23")
skip_if_2_6_23_or_older = pytest.mark.skipif(
    _DSPY_2_6_23_OR_OLDER,
    reason="Streaming API is only supported in dspy 2.6.24 or later.",
)

_REASONING_KEYWORD = "rationale" if _DSPY_UNDER_2_6 else "reasoning"


@pytest.fixture
def dummy_model():
    return DummyLM(
        [{"answer": answer, _REASONING_KEYWORD: "reason"} for answer in ["4", "6", "8", "10"]]
    )


class CoT(dspy.Module):
    def __init__(self):
        super().__init__()
        self.prog = dspy.ChainOfThought("question -> answer")

    def forward(self, question):
        return self.prog(question=question)


class NumericalCoT(dspy.Module):
    def __init__(self):
        super().__init__()
        self.prog = dspy.ChainOfThought("question -> answer: int")

    def forward(self, question):
        return self.prog(question=question).answer


@pytest.fixture(autouse=True)
def reset_dspy_settings():
    yield

    dspy.settings.configure(lm=None, rm=None)


def test_basic_save():
    dspy_model = CoT()
    dspy.settings.configure(lm=dspy.LM(model="openai/gpt-4o-mini", max_tokens=250))

    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(dspy_model, name="model")

    # Clear the lm setting to test the loading logic.
    dspy.settings.configure(lm=None)

    loaded_model = mlflow.dspy.load_model(model_info.model_uri)

    # Check that the global settings is popped back.
    assert dspy.settings.lm.model == "openai/gpt-4o-mini"
    assert isinstance(loaded_model, CoT)


def test_save_compiled_model(dummy_model):
    train_data = [
        "What is 2 + 2?",
        "What is 3 + 3?",
        "What is 4 + 4?",
        "What is 5 + 5?",
    ]
    train_label = ["4", "6", "8", "10"]
    trainset = [
        dspy.Example(question=q, answer=a).with_inputs("question")
        for q, a in zip(train_data, train_label)
    ]

    def dummy_metric(program):
        return 1.0

    dspy.settings.configure(lm=dummy_model)

    dspy_model = CoT()
    optimizer = dspy.teleprompt.BootstrapFewShot(metric=dummy_metric)
    optimized_cot = optimizer.compile(dspy_model, trainset=trainset)

    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(optimized_cot, name="model")

    # Clear the lm setting to test the loading logic.
    dspy.settings.configure(lm=None)

    loaded_model = mlflow.dspy.load_model(model_info.model_uri)

    assert isinstance(loaded_model, CoT)
    assert loaded_model.prog.predictors()[0].demos == optimized_cot.prog.predictors()[0].demos


def test_dspy_save_preserves_object_state():
    class GenerateAnswer(dspy.Signature):
        """Answer questions with short factoid answers."""

        context = dspy.InputField(desc="may contain relevant facts")
        question = dspy.InputField()
        answer = dspy.OutputField(desc="often between 1 and 5 words")

    class RAG(dspy.Module):
        def __init__(self, num_passages=3):
            super().__init__()

            self.retrieve = dspy.Retrieve(k=num_passages)
            self.generate_answer = dspy.ChainOfThought(GenerateAnswer)

        def forward(self, question):
            assert question == "What is 2 + 2?"
            context = self.retrieve(question).passages
            prediction = self.generate_answer(context=context, question=question)
            return dspy.Prediction(context=context, answer=prediction.answer)

    def dummy_metric(*args, **kwargs):
        return 1.0

    model = DummyLM([{"answer": answer, "reasoning": "reason"} for answer in ["4", "6", "8", "10"]])
    rm = dummy_rm(passages=["dummy1", "dummy2", "dummy3"])
    dspy.settings.configure(lm=model, rm=rm)

    train_data = [
        "What is 2 + 2?",
        "What is 3 + 3?",
        "What is 4 + 4?",
        "What is 5 + 5?",
    ]
    train_label = ["4", "6", "8", "10"]
    trainset = [
        dspy.Example(question=q, answer=a).with_inputs("question").with_inputs("reasoning")
        for q, a in zip(train_data, train_label)
    ]

    dspy_model = RAG()
    optimizer = dspy.teleprompt.BootstrapFewShot(metric=dummy_metric)
    optimized_cot = optimizer.compile(dspy_model, trainset=trainset)

    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(optimized_cot, name="model")

    original_settings = dict(dspy.settings.config)
    original_settings["traces"] = None

    # Clear the lm setting to test the loading logic.
    dspy.settings.configure(lm=None)

    model_url = model_info.model_uri

    input_examples = {"inputs": ["What is 2 + 2?"]}
    # test that the model can be served
    response = pyfunc_serve_and_score_model(
        model_uri=model_url,
        data=json.dumps(input_examples),
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )
    expect_status_code(response, 200)

    loaded_model = mlflow.dspy.load_model(model_url)
    assert isinstance(loaded_model, RAG)
    assert loaded_model.retrieve is not None
    assert (
        loaded_model.generate_answer.predictors()[0].demos
        == optimized_cot.generate_answer.predictors()[0].demos
    )

    loaded_settings = dict(dspy.settings.config)
    loaded_settings["traces"] = None

    assert loaded_settings["lm"].model == original_settings["lm"].model
    assert loaded_settings["lm"].model_type == original_settings["lm"].model_type
    assert loaded_settings["rm"].__dict__ == original_settings["rm"].__dict__

    del (
        loaded_settings["lm"],
        original_settings["lm"],
        loaded_settings["rm"],
        original_settings["rm"],
    )

    assert original_settings == loaded_settings


def test_load_logged_model_in_native_dspy(dummy_model):
    dspy_model = CoT()
    # Arbitrary set the demo to test saving/loading has no data loss.
    dspy_model.prog.predictors()[0].demos = [
        "What is 2 + 2?",
        "What is 3 + 3?",
        "What is 4 + 4?",
        "What is 5 + 5?",
    ]
    dspy.settings.configure(lm=dummy_model)

    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(dspy_model, name="model")
    loaded_dspy_model = mlflow.dspy.load_model(model_info.model_uri)

    assert isinstance(loaded_dspy_model, CoT)
    assert loaded_dspy_model.prog.predictors()[0].demos == dspy_model.prog.predictors()[0].demos


def test_serving_logged_model(dummy_model):
    class CoT(dspy.Module):
        def __init__(self):
            super().__init__()
            self.prog = dspy.ChainOfThought("question -> answer")

        def forward(self, question):
            assert question == "What is 2 + 2?"
            return self.prog(question=question)

    dspy_model = CoT()
    dspy.settings.configure(lm=dummy_model)

    input_examples = {"inputs": ["What is 2 + 2?"]}
    input_schema = Schema([ColSpec("string")])
    output_schema = Schema([ColSpec("string")])
    signature = ModelSignature(inputs=input_schema, outputs=output_schema)

    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(
            dspy_model,
            name=artifact_path,
            signature=signature,
            input_example=["What is 2 + 2?"],
        )
        model_uri = model_info.model_uri
    dspy.settings.configure(lm=None)

    response = pyfunc_serve_and_score_model(
        model_uri=model_uri,
        data=json.dumps(input_examples),
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )

    expect_status_code(response, 200)

    json_response = json.loads(response.content)

    assert _REASONING_KEYWORD in json_response["predictions"]
    assert "answer" in json_response["predictions"]


def test_log_model_multi_inputs(dummy_model):
    class MultiInputCoT(dspy.Module):
        def __init__(self):
            super().__init__()
            self.prog = dspy.ChainOfThought("question, hint -> answer")

        def forward(self, question, hint):
            assert question == "What is 2 + 2?"
            assert hint == "Hint: 2 + 2 = ?"
            return self.prog(question=question, hint=hint)

    dspy_model = MultiInputCoT()

    dspy.settings.configure(lm=dummy_model)

    input_example = {"question": "What is 2 + 2?", "hint": "Hint: 2 + 2 = ?"}

    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(
            dspy_model,
            name="model",
            input_example=input_example,
        )

    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    assert loaded_model.predict(input_example) == {"answer": "6", _REASONING_KEYWORD: "reason"}

    response = pyfunc_serve_and_score_model(
        model_uri=model_info.model_uri,
        data=json.dumps({"inputs": [input_example]}),
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )

    expect_status_code(response, 200)

    json_response = json.loads(response.content)

    assert _REASONING_KEYWORD in json_response["predictions"]
    assert "answer" in json_response["predictions"]


def test_save_chat_model_with_string_output(dummy_model):
    class CoT(dspy.Module):
        def __init__(self):
            super().__init__()
            self.prog = dspy.ChainOfThought("question -> answer")

        def forward(self, inputs):
            # DSPy chat model's inputs is a list of dict with keys roles (optional) and content.
            # And here we output a single string.
            return self.prog(question=inputs[0]["content"]).answer

    dspy_model = CoT()
    dspy.settings.configure(lm=dummy_model)

    input_examples = {"messages": [{"role": "user", "content": "What is 2 + 2?"}]}

    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(
            dspy_model,
            name=artifact_path,
            task="llm/v1/chat",
            input_example=input_examples,
        )
    loaded_pyfunc = mlflow.pyfunc.load_model(model_info.model_uri)
    response = loaded_pyfunc.predict(input_examples)

    assert "choices" in response
    assert len(response["choices"]) == 1
    assert "message" in response["choices"][0]
    # The content should just be a string.
    assert response["choices"][0]["message"]["content"] == "4"


def test_serve_chat_model(dummy_model):
    class CoT(dspy.Module):
        def __init__(self):
            super().__init__()
            self.prog = dspy.ChainOfThought("question -> answer")

        def forward(self, inputs):
            return self.prog(question=inputs[0]["content"])

    dspy_model = CoT()
    dspy.settings.configure(lm=dummy_model)

    input_examples = {"messages": [{"role": "user", "content": "What is 2 + 2?"}]}

    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(
            dspy_model,
            name=artifact_path,
            task="llm/v1/chat",
            input_example=input_examples,
        )
    dspy.settings.configure(lm=None)

    response = pyfunc_serve_and_score_model(
        model_uri=model_info.model_uri,
        data=json.dumps(input_examples),
        content_type="application/json",
        extra_args=["--env-manager", "local"],
    )

    expect_status_code(response, 200)

    json_response = json.loads(response.content)

    assert "choices" in json_response
    assert len(json_response["choices"]) == 1
    assert "message" in json_response["choices"][0]
    assert _REASONING_KEYWORD in json_response["choices"][0]["message"]["content"]
    assert "answer" in json_response["choices"][0]["message"]["content"]


def test_code_paths_is_used():
    artifact_path = "model"
    dspy_model = CoT()
    with (
        mlflow.start_run(),
        mock.patch("mlflow.dspy.load._add_code_from_conf_to_system_path") as add_mock,
    ):
        model_info = mlflow.dspy.log_model(dspy_model, name=artifact_path, code_paths=[__file__])
        _compare_logged_code_paths(__file__, model_info.model_uri, "dspy")
        mlflow.dspy.load_model(model_info.model_uri)
        add_mock.assert_called()


def test_additional_pip_requirements():
    expected_mlflow_version = _mlflow_major_version_string()
    artifact_path = "model"
    dspy_model = CoT()
    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(
            dspy_model, name=artifact_path, extra_pip_requirements=["dummy"]
        )

        _assert_pip_requirements(model_info.model_uri, [expected_mlflow_version, "dummy"])


def test_infer_signature_from_input_examples(dummy_model):
    artifact_path = "model"
    dspy_model = CoT()
    dspy.settings.configure(lm=dummy_model)
    with mlflow.start_run():
        model_info = mlflow.dspy.log_model(
            dspy_model, name=artifact_path, input_example="what is 2 + 2?"
        )

        loaded_model = Model.load(model_info.model_uri)
        assert loaded_model.signature.inputs == Schema([ColSpec("string")])
        assert loaded_model.signature.outputs == Schema(
            [
                ColSpec(name="answer", type="string"),
                ColSpec(name=_REASONING_KEYWORD, type="string"),
            ]
        )


@skip_if_2_6_23_or_older
def test_predict_stream_unsupported_schema(dummy_model):
    dspy_model = NumericalCoT()
    dspy.settings.configure(lm=dummy_model)

    model_info = mlflow.dspy.log_model(dspy_model, name="model")
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)

    assert not loaded_model._model_meta.flavors["python_function"]["streamable"]
    output = loaded_model.predict_stream({"question": "What is 2 + 2?"})
    with pytest.raises(
        mlflow.exceptions.MlflowException,
        match="This model does not support predict_stream method.",
    ):
        next(output)


@skip_if_2_6_23_or_older
def test_predict_stream_success(dummy_model):
    dspy_model = CoT()
    dspy.settings.configure(lm=dummy_model)

    model_info = mlflow.dspy.log_model(
        dspy_model, name="model", input_example={"question": "what is 2 + 2?"}
    )
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)

    assert loaded_model._model_meta.flavors["python_function"]["streamable"]
    results = []

    def dummy_streamify(*args, **kwargs):
        # In dspy>=3, `StreamResponse` requires `is_last_chunk` argument.
        # https://github.com/stanfordnlp/dspy/pull/8587
        extra_kwargs = {"is_last_chunk": False} if _DSPY_VERSION.major >= 3 else {}
        yield dspy.streaming.StreamResponse(
            predict_name="prog.predict",
            signature_field_name="answer",
            chunk="2",
            **extra_kwargs,
        )
        extra_kwargs = {"is_last_chunk": True} if _DSPY_VERSION.major >= 3 else {}
        yield dspy.streaming.StreamResponse(
            predict_name="prog.predict",
            signature_field_name=_REASONING_KEYWORD,
            chunk="reason",
            **extra_kwargs,
        )

    with mock.patch("dspy.streamify", return_value=dummy_streamify):
        output = loaded_model.predict_stream({"question": "What is 2 + 2?"})
        for o in output:
            results.append(o)

    assert len(results) == 2
    extra_kwargs = {"is_last_chunk": False} if _DSPY_VERSION.major >= 3 else {}
    assert results[0] == {
        "predict_name": "prog.predict",
        "signature_field_name": "answer",
        "chunk": "2",
        **extra_kwargs,
    }
    extra_kwargs = {"is_last_chunk": True} if _DSPY_VERSION.major >= 3 else {}
    assert results[1] == {
        "predict_name": "prog.predict",
        "signature_field_name": _REASONING_KEYWORD,
        "chunk": "reason",
        **extra_kwargs,
    }


def test_predict_output(dummy_model):
    class MockModelReturningNonPrediction(dspy.Module):
        def forward(self, question):
            # Return a plain dict instead of dspy.Prediction
            return {"answer": "4", "custom_field": "custom_value"}

    class MockModelReturningPrediction(dspy.Module):
        def forward(self, question):
            # Return a dspy.Prediction
            prediction = dspy.Prediction()
            prediction.answer = "4"
            prediction.custom_field = "custom_value"
            return prediction

    dspy.settings.configure(lm=dummy_model)

    non_prediction_model = MockModelReturningNonPrediction()
    model_info = mlflow.dspy.log_model(non_prediction_model, name="non_prediction_model")
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    result = loaded_model.predict("What is 2 + 2?")

    assert isinstance(result, dict)
    assert result == {"answer": "4", "custom_field": "custom_value"}

    prediction_model = MockModelReturningPrediction()
    model_info = mlflow.dspy.log_model(prediction_model, name="prediction_model")
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    result = loaded_model.predict("What is 2 + 2?")

    assert isinstance(result, dict)
    assert result == {"answer": "4", "custom_field": "custom_value"}
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/entities/conftest.py

```python
import random
import uuid

import pytest

from mlflow.entities import (
    Dataset,
    DatasetInput,
    InputTag,
    LifecycleStage,
    Metric,
    Param,
    RunData,
    RunInfo,
    RunInputs,
    RunStatus,
    RunTag,
)
from mlflow.utils.time import get_current_time_millis

from tests.helper_functions import random_int, random_str


@pytest.fixture
def run_data():
    metrics = [
        Metric(
            key=random_str(10),
            value=random_int(0, 1000),
            timestamp=get_current_time_millis() + random_int(-1e4, 1e4),
            step=random_int(),
        )
    ]
    params = [Param(random_str(10), random_str(random_int(10, 35))) for _ in range(10)]
    tags = [RunTag(random_str(10), random_str(random_int(10, 35))) for _ in range(10)]

    rd = RunData(metrics=metrics, params=params, tags=tags)

    return rd, metrics, params, tags


@pytest.fixture
def run_info():
    run_id = str(uuid.uuid4())
    experiment_id = str(random_int(10, 2000))
    user_id = random_str(random_int(10, 25))
    run_name = random_str(random_int(10, 25))
    status = RunStatus.to_string(random.choice(RunStatus.all_status()))
    start_time = random_int(1, 10)
    end_time = start_time + random_int(1, 10)
    lifecycle_stage = LifecycleStage.ACTIVE
    artifact_uri = random_str(random_int(10, 40))
    ri = RunInfo(
        run_id=run_id,
        run_name=run_name,
        experiment_id=experiment_id,
        user_id=user_id,
        status=status,
        start_time=start_time,
        end_time=end_time,
        lifecycle_stage=lifecycle_stage,
        artifact_uri=artifact_uri,
    )
    return (
        ri,
        run_id,
        run_name,
        experiment_id,
        user_id,
        status,
        start_time,
        end_time,
        lifecycle_stage,
        artifact_uri,
    )


@pytest.fixture
def run_inputs():
    datasets = [
        DatasetInput(
            dataset=Dataset(
                name="name1", digest="digest1", source_type="my_source_type", source="source"
            ),
            tags=[InputTag(key="key", value="value")],
        )
    ]

    run_inputs = RunInputs(dataset_inputs=datasets)

    return run_inputs, datasets
```

--------------------------------------------------------------------------------

````
