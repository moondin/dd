---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 853
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 853 of 991)

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

---[FILE: test_mcp.py]---
Location: mlflow-master/tests/mcp/test_mcp.py

```python
import sys
from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

import mlflow
from mlflow.mcp import server


@pytest_asyncio.fixture()
async def client() -> AsyncIterator[Client]:
    transport = StdioTransport(
        command=sys.executable,
        args=[server.__file__],
        env={"MLFLOW_TRACKING_URI": mlflow.get_tracking_uri()},
    )
    async with Client(transport) as client:
        yield client


@pytest.mark.asyncio
async def test_list_tools(client: Client):
    tools = await client.list_tools()
    assert sorted(t.name for t in tools) == [
        "delete_assessment",
        "delete_trace_tag",
        "delete_traces",
        "evaluate_traces",
        "get_assessment",
        "get_trace",
        "list_scorers",
        "log_expectation",
        "log_feedback",
        "register_llm_judge",
        "search_traces",
        "set_trace_tag",
        "update_assessment",
    ]


@pytest.mark.asyncio
async def test_call_tool(client: Client):
    with mlflow.start_span() as span:
        pass

    result = await client.call_tool(
        "get_trace",
        {"trace_id": span.trace_id},
        timeout=5,
    )
    assert span.trace_id in result.content[0].text

    experiment = mlflow.search_experiments(max_results=1)[0]
    result = await client.call_tool(
        "search_traces",
        {"experiment_id": experiment.experiment_id},
        timeout=5,
    )
    assert span.trace_id in result.content[0].text

    result = await client.call_tool(
        "delete_traces",
        {
            "experiment_id": experiment.experiment_id,
            "trace_ids": span.trace_id,
        },
        timeout=5,
    )
    result = await client.call_tool(
        "get_trace",
        {"trace_id": span.trace_id},
        timeout=5,
        raise_on_error=False,
    )
    assert result.is_error is True


@pytest.mark.asyncio
async def test_list_prompts(client: Client):
    prompts = await client.list_prompts()
    prompt_names = [p.name for p in prompts]

    # Should have at least the genai_analyze_experiment prompt
    assert "genai_analyze_experiment" in prompt_names

    # Find the analyze experiment prompt
    analyze_prompt = next(p for p in prompts if p.name == "genai_analyze_experiment")
    assert "experiment" in analyze_prompt.description.lower()
    assert "traces" in analyze_prompt.description.lower()


@pytest.mark.asyncio
async def test_get_prompt(client: Client):
    # Get the analyze experiment prompt
    result = await client.get_prompt("genai_analyze_experiment")

    # Should return messages
    assert len(result.messages) > 0

    # Content should contain the AI command instructions
    content = result.messages[0].content.text
    assert "Analyze Experiment" in content
    assert "Step 1: Setup and Configuration" in content
    assert "MLflow" in content
```

--------------------------------------------------------------------------------

---[FILE: test_metric_base.py]---
Location: mlflow-master/tests/metrics/test_metric_base.py

```python
from mlflow.metrics.base import MetricValue


def test_metric_value():
    metricValue1 = MetricValue(
        scores=[1, 2, 3],
        justifications=["foo", "bar", "baz"],
        aggregate_results={"mean": 2},
    )

    metricValue2 = MetricValue(
        scores=[1, 2, 3],
        justifications=["foo", "bar", "baz"],
    )

    metricValue3 = MetricValue(scores=["1", "2", "3"])

    metricValue4 = MetricValue(scores=[1, "2", "3"])

    assert metricValue1.scores == [1, 2, 3]
    assert metricValue1.justifications == ["foo", "bar", "baz"]
    assert metricValue1.aggregate_results == {"mean": 2}

    assert metricValue2.scores == [1, 2, 3]
    assert metricValue2.justifications == ["foo", "bar", "baz"]
    assert metricValue2.aggregate_results == {
        "mean": 2.0,
        "p90": 2.8,
        "variance": 0.6666666666666666,
    }

    assert metricValue3.scores == ["1", "2", "3"]
    assert metricValue3.justifications is None
    assert metricValue3.aggregate_results is None

    assert metricValue4.scores == [1, "2", "3"]
    assert metricValue4.justifications is None
    assert metricValue4.aggregate_results is None
```

--------------------------------------------------------------------------------

---[FILE: test_metric_definitions.py]---
Location: mlflow-master/tests/metrics/test_metric_definitions.py

```python
import inspect
import io
import sys
from unittest import mock

import pandas as pd
import pytest

from mlflow.metrics import (
    MetricValue,
    ari_grade_level,
    bleu,
    exact_match,
    f1_score,
    flesch_kincaid_grade_level,
    mae,
    mape,
    max_error,
    mse,
    ndcg_at_k,
    precision_at_k,
    precision_score,
    r2_score,
    recall_at_k,
    recall_score,
    rmse,
    rouge1,
    rouge2,
    rougeL,
    rougeLsum,
    toxicity,
)


@pytest.mark.parametrize(
    "metric",
    [
        ari_grade_level(),
        exact_match(),
        flesch_kincaid_grade_level(),
        rouge1(),
        rouge2(),
        rougeL(),
        rougeLsum(),
        toxicity(),
        bleu(),
    ],
)
def test_return_type_and_len_with_target(metric):
    predictions = pd.Series(["sentence not", "random text", "a", "c"])
    targets = pd.Series(["sentence not", "random text", "a", "c"])

    result = metric.eval_fn(predictions, targets)
    assert isinstance(result, MetricValue)
    if result.scores:
        assert len(result.scores) == len(predictions) == len(targets)

    predictions = pd.Series([])
    targets = pd.Series([])
    result = metric.eval_fn(predictions, targets)
    assert result is None


def _is_toxic(score):
    return score > 0.5


def test_toxicity():
    predictions = pd.Series(["A normal sentence", "All women are bad"])
    result = toxicity().eval_fn(predictions, None, {})
    assert not _is_toxic(result.scores[0])
    assert _is_toxic(result.scores[1])
    assert result.aggregate_results["ratio"] == 0.5
    assert result.aggregate_results["mean"] == (result.scores[0] + result.scores[1]) / 2
    assert result.scores[0] < result.aggregate_results["p90"] < result.scores[1]
    assert "variance" in result.aggregate_results
    assert toxicity()(predictions=predictions) == result


def test_flesch_kincaid_grade_level():
    predictions = pd.Series(
        [
            "This is a sentence.",
            (
                "This is a much longer and more complicated sentence than the previous one, "
                "so this sentence should have a higher grade level score."
            ),
        ]
    )
    result = flesch_kincaid_grade_level().eval_fn(predictions, None, {})
    assert result.scores[0] < result.scores[1]
    assert result.aggregate_results["mean"] == (result.scores[0] + result.scores[1]) / 2
    assert result.scores[0] < result.aggregate_results["p90"] < result.scores[1]
    assert "variance" in result.aggregate_results
    assert flesch_kincaid_grade_level()(predictions=predictions) == result


def test_ari_grade_level():
    predictions = pd.Series(
        [
            "This is a sentence.",
            (
                "This is a much longer and more complicated sentence than the previous one, "
                "so this sentence should have a higher grade level score."
            ),
        ]
    )
    result = ari_grade_level().eval_fn(predictions, None, {})
    assert result.scores[0] < result.scores[1]
    assert result.aggregate_results["mean"] == (result.scores[0] + result.scores[1]) / 2
    assert result.scores[0] < result.aggregate_results["p90"] < result.scores[1]
    assert "variance" in result.aggregate_results
    assert ari_grade_level()(predictions=predictions) == result


def test_exact_match():
    predictions = pd.Series(["sentence not", "random text", "a", "c"])
    targets = pd.Series(["sentence not", "random text", "a", "c"])

    result = exact_match().eval_fn(predictions, targets, {})
    assert result.aggregate_results["exact_match"] == 1.0
    assert exact_match()(predictions=predictions, targets=targets) == result

    predictions = pd.Series(["not sentence", "random text", "b", "c"])
    targets = pd.Series(["sentence not", "random text", "a", "c"])
    result = exact_match().eval_fn(predictions, targets, {})
    assert result.aggregate_results["exact_match"] == 0.5


def test_rouge1():
    predictions = pd.Series(["a", "d c"])
    targets = pd.Series(["d", "b c"])
    result = rouge1().eval_fn(predictions, targets, {})
    assert result.scores[0] == 0.0
    assert result.scores[1] == 0.5
    assert result.aggregate_results["mean"] == 0.25
    assert result.aggregate_results["p90"] == 0.45
    assert result.aggregate_results["variance"] == 0.0625
    assert rouge1()(predictions=predictions, targets=targets) == result


def test_rouge2():
    predictions = pd.Series(["a e", "b c e"])
    targets = pd.Series(["a e", "b c d"])
    result = rouge2().eval_fn(predictions, targets, {})
    assert result.scores[0] == 1.0
    assert result.scores[1] == 0.5
    assert result.aggregate_results["mean"] == 0.75
    assert result.aggregate_results["p90"] == 0.95
    assert result.aggregate_results["variance"] == 0.0625
    assert rouge2()(predictions=predictions, targets=targets) == result


def test_rougeL():
    predictions = pd.Series(["a", "b c"])
    targets = pd.Series(["d", "b c"])
    result = rougeL().eval_fn(predictions, targets, {})
    assert result.scores[0] == 0.0
    assert result.scores[1] == 1.0
    assert result.aggregate_results["mean"] == 0.5
    assert result.aggregate_results["p90"] == 0.9
    assert result.aggregate_results["variance"] == 0.25
    assert rougeL()(predictions=predictions, targets=targets) == result


def test_rougeLsum():
    predictions = pd.Series(["a", "b c"])
    targets = pd.Series(["d", "b c"])
    result = rougeLsum().eval_fn(predictions, targets, {})
    assert result.scores[0] == 0.0
    assert result.scores[1] == 1.0
    assert result.aggregate_results["mean"] == 0.5
    assert result.aggregate_results["p90"] == 0.9
    assert result.aggregate_results["variance"] == 0.25
    assert rougeLsum()(predictions=predictions, targets=targets) == result


def test_fails_to_load_metric():
    from mlflow.metrics.metric_definitions import _cached_evaluate_load

    _cached_evaluate_load.cache_clear()

    predictions = pd.Series(["random text", "This is a sentence"])
    e = ImportError("mocked error")
    with (
        mock.patch(
            "mlflow.metrics.metric_definitions._cached_evaluate_load", side_effect=e
        ) as mock_load,
        mock.patch("mlflow.metrics.metric_definitions._logger.warning") as mock_warning,
    ):
        toxicity().eval_fn(predictions, None, {})
        mock_load.assert_called_once_with("toxicity", module_type="measurement")
        mock_warning.assert_called_once_with(
            f"Failed to load 'toxicity' metric (error: {e!r}), skipping metric logging.",
        )


def test_mae():
    predictions = pd.Series([1.0, 2.0, 0.0])
    targets = pd.Series([1.0, 2.0, 3.0])
    result = mae().eval_fn(predictions, targets, {})
    assert result.aggregate_results["mean_absolute_error"] == 1.0
    assert mae()(predictions=predictions, targets=targets) == result


def test_mse():
    predictions = pd.Series([1.0, 2.0, 0.0])
    targets = pd.Series([1.0, 2.0, 3.0])
    result = mse().eval_fn(predictions, targets, {})
    assert result.aggregate_results["mean_squared_error"] == 3.0
    assert mse()(predictions=predictions, targets=targets) == result


def test_rmse():
    predictions = pd.Series([4.0, 5.0, 0.0])
    targets = pd.Series([1.0, 2.0, 3.0])
    result = rmse().eval_fn(predictions, targets, {})
    assert result.aggregate_results["root_mean_squared_error"] == 3.0
    assert rmse()(predictions=predictions, targets=targets) == result


def test_r2_score():
    predictions = pd.Series([1.0, 2.0, 3.0])
    targets = pd.Series([3.0, 2.0, 1.0])
    result = r2_score().eval_fn(predictions, targets, {})
    assert result.aggregate_results["r2_score"] == -3.0
    assert r2_score()(predictions=predictions, targets=targets) == result


def test_max_error():
    predictions = pd.Series([1.0, 2.0, 3.0])
    targets = pd.Series([3.0, 2.0, 1.0])
    result = max_error().eval_fn(predictions, targets, {})
    assert result.aggregate_results["max_error"] == 2.0
    assert max_error()(predictions=predictions, targets=targets) == result


def test_mape_error():
    predictions = pd.Series([1.0, 1.0, 1.0])
    targets = pd.Series([2.0, 2.0, 2.0])
    result = mape().eval_fn(predictions, targets, {})
    assert result.aggregate_results["mean_absolute_percentage_error"] == 0.5
    assert mape()(predictions=predictions, targets=targets) == result


def test_binary_recall_score():
    predictions = pd.Series([0, 0, 1, 1, 0, 0, 0, 1])
    targets = pd.Series([1, 1, 1, 1, 0, 0, 0, 0])
    result = recall_score().eval_fn(predictions, targets, {})
    assert abs(result.aggregate_results["recall_score"] - 0.5) < 1e-3
    assert recall_score()(predictions=predictions, targets=targets) == result


def test_binary_precision():
    predictions = pd.Series([0, 0, 1, 1, 0, 0, 0, 1])
    targets = pd.Series([1, 1, 1, 1, 0, 0, 0, 0])
    result = precision_score().eval_fn(predictions, targets, {})
    assert abs(result.aggregate_results["precision_score"] == 0.666) < 1e-3
    assert precision_score()(predictions=predictions, targets=targets) == result


def test_binary_f1_score():
    predictions = pd.Series([0, 0, 1, 1, 0, 0, 0, 1])
    targets = pd.Series([1, 1, 1, 1, 0, 0, 0, 0])
    result = f1_score().eval_fn(predictions, targets, {})
    assert abs(result.aggregate_results["f1_score"] - 0.5713) < 1e-3
    assert f1_score()(predictions=predictions, targets=targets) == result


def test_precision_at_k():
    predictions = pd.Series([["a", "b"], ["c", "d"], ["e"], ["f", "g"]])
    targets = pd.Series([["a", "b"], ["c", "b"], ["e"], ["c"]])
    result = precision_at_k(4).eval_fn(predictions, targets)

    assert result.scores == [1.0, 0.5, 1.0, 0.0]
    assert result.aggregate_results == {
        "mean": 2.5 / 4,
        "p90": 1.0,
        "variance": 0.171875,
    }
    assert precision_at_k(4)(predictions=predictions, targets=targets) == result


def test_recall_at_k():
    predictions = pd.Series([["a", "b"], ["c", "d", "e"], [], ["f", "g"], ["a", "a", "a"]])
    targets = pd.Series([["a", "b", "c", "d"], ["c", "b", "a", "d"], [], [], ["a", "c"]])
    result = recall_at_k(4).eval_fn(predictions, targets)

    assert result.scores == [0.5, 0.5, 1.0, 0.0, 0.5]
    assert result.aggregate_results == {
        "mean": 0.5,
        "p90": 0.8,
        "variance": 0.1,
    }
    assert recall_at_k(4)(predictions=predictions, targets=targets) == result


def test_ndcg_at_k():
    # normal cases
    data = pd.DataFrame(
        [
            {"target": [], "prediction": [], "k": [3], "ndcg": 1},  # no error is made
            {"target": [], "prediction": ["1", "2"], "k": [3], "ndcg": 0},
            {"target": ["1"], "prediction": [], "k": [3], "ndcg": 0},
            {"target": ["1"], "prediction": ["1"], "k": [3], "ndcg": 1},
            {"target": ["1"], "prediction": ["2"], "k": [3], "ndcg": 0},
        ]
    )
    predictions = data["prediction"]
    targets = data["target"]
    result = ndcg_at_k(3).eval_fn(predictions, targets)
    assert ndcg_at_k(3)(predictions=predictions, targets=targets) == result

    assert result.scores == data["ndcg"].to_list()
    assert pytest.approx(result.aggregate_results["mean"]) == 0.4
    assert pytest.approx(result.aggregate_results["p90"]) == 1.0
    assert pytest.approx(result.aggregate_results["variance"]) == 0.24

    # test different k values
    predictions = pd.Series([["1", "2"]])
    targets = pd.Series([["1"]])
    ndcg = [1, 1, 1]
    for i in range(3):
        k = i + 1
        result = ndcg_at_k(k).eval_fn(predictions, targets)
        assert pytest.approx(result.scores[0]) == ndcg[i]

    # test different k values and prediction orders
    predictions = pd.Series([["2", "1", "3"]])
    targets = pd.Series([["1", "2", "3"]])
    ndcg = [1, 1, 1, 1]
    for i in range(4):
        k = i + 1
        result = ndcg_at_k(k).eval_fn(predictions, targets)
        assert pytest.approx(result.scores[0]) == ndcg[i]

    # test different k values
    predictions = pd.Series([["4", "5", "1"]])
    targets = pd.Series([["1", "2", "3"]])
    ndcg = [0, 0, 0.2346394, 0.2346394]
    for i in range(4):
        k = i + 1
        result = ndcg_at_k(k).eval_fn(predictions, targets)
        assert pytest.approx(result.scores[0]) == ndcg[i]

    # test duplicate predictions
    predictions = pd.Series([["1", "1", "2", "5", "5"], ["1_1", "1_2", "2", "5", "6"]])
    targets = pd.Series([["1", "2", "3"], ["1_1", "1_2", "2", "3"]])
    for i in range(4):
        k = i + 1
        result = ndcg_at_k(k).eval_fn(predictions, targets)
        # row 1 and 2 have the same ndcg score
        assert pytest.approx(result.scores[0]) == pytest.approx(result.scores[1])

    # test duplicate targets
    predictions = pd.Series([["1", "2", "3"], ["1", "2", "3"]])
    targets = pd.Series([["1", "1", "1"], ["1"]])
    for i in range(4):
        k = i + 1
        result = ndcg_at_k(k).eval_fn(predictions, targets)
        # row 1 and 2 have the same ndcg score
        assert pytest.approx(result.scores[0]) == pytest.approx(result.scores[1])

    predictions = pd.Series([["c", "c", "c"]])
    targets = pd.Series([["a", "b"]])
    result = ndcg_at_k(k=3).eval_fn(predictions, targets)
    assert result.scores[0] == 0.0


def test_bleu():
    predictions = ["hello world", "this is a test"]
    targets = ["hello world", "this is a test sentence"]
    result = bleu().eval_fn(predictions, targets)
    assert result.scores == [0.0, 0.7788007830714049]
    assert result.justifications is None
    assert result.aggregate_results["mean"] == 0.38940039153570244
    assert result.aggregate_results["p90"] == 0.7009207047642644
    assert result.aggregate_results["variance"] == 0.15163266492815836

    predictions = ["hello there general kenobi", "foo bar foobar"]
    targets = ["hello there general kenobi", "hello there !", "foo bar foobar"]
    result = bleu().eval_fn(predictions, targets)
    assert result.scores == [1.0, 0.0]
    assert result.justifications is None
    assert result.aggregate_results["mean"] == 0.5
    assert result.aggregate_results["p90"] == 0.9
    assert result.aggregate_results["variance"] == 0.25


def test_builtin_metric_call_signature():
    metric = ndcg_at_k(3)
    assert inspect.signature(metric).parameters.keys() == {"predictions", "targets"}

    captured_output = io.StringIO()
    sys.stdout = captured_output
    try:
        help(metric)
    finally:
        sys.stdout = sys.__stdout__

    assert "__call__ = _call_method(self, *, predictions, targets)" in captured_output.getvalue()
```

--------------------------------------------------------------------------------

---[FILE: test_base.py]---
Location: mlflow-master/tests/metrics/genai/test_base.py

```python
import re

from mlflow.metrics.genai import EvaluationExample


def test_evaluation_example_str():
    example1 = str(
        EvaluationExample(
            input="This is an input",
            output="This is an output",
            score=5,
            justification="This is a justification",
            grading_context={"foo": "bar"},
        )
    )
    example1_expected = """
        Example Input:
        This is an input

        Example Output:
        This is an output

        Additional information used by the model:
        key: foo
        value:
        bar

        Example score: 5
        Example justification: This is a justification
        """
    assert re.sub(r"\s+", "", example1_expected) == re.sub(r"\s+", "", example1)

    example2 = str(
        EvaluationExample(
            input="This is an input", output="This is an output", score=5, justification="It works"
        )
    )
    example2_expected = """
        Example Input:
        This is an input

        Example Output:
        This is an output

        Example score: 5
        Example justification: It works
        """
    assert re.sub(r"\s+", "", example2_expected) == re.sub(r"\s+", "", example2)

    example3 = str(
        EvaluationExample(
            input="This is an input",
            output="This is an output",
            score=5,
            justification="This is a justification",
            grading_context="Baz baz",
        )
    )
    example3_expected = """
        Example Input:
        This is an input

        Example Output:
        This is an output

        Additional information used by the model:
        Baz baz

        Example score: 5
        Example justification: This is a justification
        """
    assert re.sub(r"\s+", "", example3_expected) == re.sub(r"\s+", "", example3)
```

--------------------------------------------------------------------------------

````
