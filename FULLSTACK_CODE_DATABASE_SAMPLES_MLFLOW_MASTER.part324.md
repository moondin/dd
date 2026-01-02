---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 324
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 324 of 991)

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

---[FILE: metric_definitions.py]---
Location: mlflow-master/mlflow/metrics/metric_definitions.py

```python
import functools
import logging
import subprocess
import tempfile
from pathlib import Path

import numpy as np

from mlflow.environment_variables import _MLFLOW_TESTING
from mlflow.metrics.base import MetricValue, standard_aggregations

_logger = logging.getLogger(__name__)


# used to silently fail with invalid metric params
def noop(*args, **kwargs):
    return None


targets_col_specifier = "the column specified by the `targets` parameter"
predictions_col_specifier = (
    "the column specified by the `predictions` parameter or the model output column"
)


def _validate_text_data(data, metric_name, col_specifier):
    """Validates that the data is a list of strs and is non-empty"""
    if data is None or len(data) == 0:
        _logger.warning(
            f"Cannot calculate {metric_name} for empty inputs: "
            f"{col_specifier} is empty or the parameter is not specified. Skipping metric logging."
        )
        return False

    for row, line in enumerate(data):
        if not isinstance(line, str):
            _logger.warning(
                f"Cannot calculate {metric_name} for non-string inputs. "
                f"Non-string found for {col_specifier} on row {row}. Skipping metric logging."
            )
            return False

    return True


def _validate_array_like_id_data(data, metric_name, col_specifier):
    """Validates that the data is a list of lists/np.ndarrays of strings/ints and is non-empty"""
    if data is None or len(data) == 0:
        return False

    for index, value in data.items():
        if not (
            (isinstance(value, list) and all(isinstance(val, (str, int)) for val in value))
            or (
                isinstance(value, np.ndarray)
                and (np.issubdtype(value.dtype, str) or np.issubdtype(value.dtype, int))
            )
        ):
            _logger.warning(
                f"Cannot calculate metric '{metric_name}' for non-arraylike of string or int "
                f"inputs. Non-arraylike of strings/ints found for {col_specifier} on row "
                f"{index}, value {value}. Skipping metric logging."
            )
            return False

    return True


def _load_from_github(path: str, module_type: str = "metric"):
    import evaluate

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)
        subprocess.check_call(
            [
                "git",
                "clone",
                "--filter=blob:none",
                "--no-checkout",
                "https://github.com/huggingface/evaluate.git",
                tmpdir,
            ]
        )
        path = f"{module_type}s/{path}"
        subprocess.check_call(["git", "sparse-checkout", "set", path], cwd=tmpdir)
        subprocess.check_call(["git", "checkout"], cwd=tmpdir)
        return evaluate.load(str(tmpdir / path))


@functools.lru_cache(maxsize=8)
def _cached_evaluate_load(path: str, module_type: str = "metric"):
    import evaluate

    try:
        return evaluate.load(path, module_type=module_type)
    except (FileNotFoundError, OSError):
        if _MLFLOW_TESTING.get():
            # `evaluate.load` is highly unstable and often fails due to a network error or
            # huggingface hub being down. In testing, we want to avoid this instability, so we
            # load the metric from the evaluate repository on GitHub.
            return _load_from_github(path, module_type=module_type)
        raise


def _toxicity_eval_fn(predictions, targets=None, metrics=None):
    if not _validate_text_data(predictions, "toxicity", predictions_col_specifier):
        return
    try:
        toxicity = _cached_evaluate_load("toxicity", module_type="measurement")
    except Exception as e:
        _logger.warning(
            f"Failed to load 'toxicity' metric (error: {e!r}), skipping metric logging."
        )
        return

    scores = toxicity.compute(predictions=predictions)["toxicity"]
    toxicity_ratio = toxicity.compute(predictions=predictions, aggregation="ratio")[
        "toxicity_ratio"
    ]
    return MetricValue(
        scores=scores,
        aggregate_results={
            **standard_aggregations(scores),
            "ratio": toxicity_ratio,
        },
    )


def _flesch_kincaid_eval_fn(predictions, targets=None, metrics=None):
    if not _validate_text_data(predictions, "flesch_kincaid", predictions_col_specifier):
        return

    try:
        import textstat
    except ImportError:
        _logger.warning(
            "Failed to import textstat for flesch kincaid metric, skipping metric logging. "
            "Please install textstat using 'pip install textstat'."
        )
        return

    scores = [textstat.flesch_kincaid_grade(prediction) for prediction in predictions]
    return MetricValue(
        scores=scores,
        aggregate_results=standard_aggregations(scores),
    )


def _ari_eval_fn(predictions, targets=None, metrics=None):
    if not _validate_text_data(predictions, "ari", predictions_col_specifier):
        return

    try:
        import textstat
    except ImportError:
        _logger.warning(
            "Failed to import textstat for automated readability index metric, "
            "skipping metric logging. "
            "Please install textstat using 'pip install textstat'."
        )
        return

    scores = [textstat.automated_readability_index(prediction) for prediction in predictions]
    return MetricValue(
        scores=scores,
        aggregate_results=standard_aggregations(scores),
    )


def _accuracy_eval_fn(predictions, targets=None, metrics=None, sample_weight=None):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import accuracy_score

        acc = accuracy_score(y_true=targets, y_pred=predictions, sample_weight=sample_weight)
        return MetricValue(aggregate_results={"exact_match": acc})


def _rouge1_eval_fn(predictions, targets=None, metrics=None):
    if not _validate_text_data(targets, "rouge1", targets_col_specifier) or not _validate_text_data(
        predictions, "rouge1", predictions_col_specifier
    ):
        return

    try:
        rouge = _cached_evaluate_load("rouge")
    except Exception as e:
        _logger.warning(f"Failed to load 'rouge' metric (error: {e!r}), skipping metric logging.")
        return

    scores = rouge.compute(
        predictions=predictions,
        references=targets,
        rouge_types=["rouge1"],
        use_aggregator=False,
    )["rouge1"]
    return MetricValue(
        scores=scores,
        aggregate_results=standard_aggregations(scores),
    )


def _rouge2_eval_fn(predictions, targets=None, metrics=None):
    if not _validate_text_data(targets, "rouge2", targets_col_specifier) or not _validate_text_data(
        predictions, "rouge2", predictions_col_specifier
    ):
        return

    try:
        rouge = _cached_evaluate_load("rouge")
    except Exception as e:
        _logger.warning(f"Failed to load 'rouge' metric (error: {e!r}), skipping metric logging.")
        return

    scores = rouge.compute(
        predictions=predictions,
        references=targets,
        rouge_types=["rouge2"],
        use_aggregator=False,
    )["rouge2"]
    return MetricValue(
        scores=scores,
        aggregate_results=standard_aggregations(scores),
    )


def _rougeL_eval_fn(predictions, targets=None, metrics=None):
    if not _validate_text_data(targets, "rougeL", targets_col_specifier) or not _validate_text_data(
        predictions, "rougeL", predictions_col_specifier
    ):
        return

    try:
        rouge = _cached_evaluate_load("rouge")
    except Exception as e:
        _logger.warning(f"Failed to load 'rouge' metric (error: {e!r}), skipping metric logging.")
        return

    scores = rouge.compute(
        predictions=predictions,
        references=targets,
        rouge_types=["rougeL"],
        use_aggregator=False,
    )["rougeL"]
    return MetricValue(
        scores=scores,
        aggregate_results=standard_aggregations(scores),
    )


def _rougeLsum_eval_fn(predictions, targets=None, metrics=None):
    if not _validate_text_data(
        targets, "rougeLsum", targets_col_specifier
    ) or not _validate_text_data(predictions, "rougeLsum", predictions_col_specifier):
        return

    try:
        rouge = _cached_evaluate_load("rouge")
    except Exception as e:
        _logger.warning(f"Failed to load 'rouge' metric (error: {e!r}), skipping metric logging.")
        return

    scores = rouge.compute(
        predictions=predictions,
        references=targets,
        rouge_types=["rougeLsum"],
        use_aggregator=False,
    )["rougeLsum"]
    return MetricValue(
        scores=scores,
        aggregate_results=standard_aggregations(scores),
    )


def _mae_eval_fn(predictions, targets=None, metrics=None, sample_weight=None):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import mean_absolute_error

        mae = mean_absolute_error(targets, predictions, sample_weight=sample_weight)
        return MetricValue(aggregate_results={"mean_absolute_error": mae})


def _mse_eval_fn(predictions, targets=None, metrics=None, sample_weight=None):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import mean_squared_error

        mse = mean_squared_error(targets, predictions, sample_weight=sample_weight)
        return MetricValue(aggregate_results={"mean_squared_error": mse})


def _root_mean_squared_error(*, y_true, y_pred, sample_weight):
    try:
        from sklearn.metrics import root_mean_squared_error
    except ImportError:
        # If root_mean_squared_error is unavailable, fall back to
        # `mean_squared_error(..., squared=False)`, which is deprecated in scikit-learn >= 1.4.
        from sklearn.metrics import mean_squared_error

        return mean_squared_error(
            y_true=y_true, y_pred=y_pred, sample_weight=sample_weight, squared=False
        )
    else:
        return root_mean_squared_error(y_true=y_true, y_pred=y_pred, sample_weight=sample_weight)


def _rmse_eval_fn(predictions, targets=None, metrics=None, sample_weight=None):
    if targets is not None and len(targets) != 0:
        rmse = _root_mean_squared_error(
            y_true=targets, y_pred=predictions, sample_weight=sample_weight
        )
        return MetricValue(aggregate_results={"root_mean_squared_error": rmse})


def _r2_score_eval_fn(predictions, targets=None, metrics=None, sample_weight=None):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import r2_score

        r2 = r2_score(targets, predictions, sample_weight=sample_weight)
        return MetricValue(aggregate_results={"r2_score": r2})


def _max_error_eval_fn(predictions, targets=None, metrics=None):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import max_error

        error = max_error(targets, predictions)
        return MetricValue(aggregate_results={"max_error": error})


def _mape_eval_fn(predictions, targets=None, metrics=None, sample_weight=None):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import mean_absolute_percentage_error

        mape = mean_absolute_percentage_error(targets, predictions, sample_weight=sample_weight)
        return MetricValue(aggregate_results={"mean_absolute_percentage_error": mape})


def _recall_eval_fn(
    predictions, targets=None, metrics=None, pos_label=1, average="binary", sample_weight=None
):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import recall_score

        recall = recall_score(
            targets, predictions, pos_label=pos_label, average=average, sample_weight=sample_weight
        )
        return MetricValue(aggregate_results={"recall_score": recall})


def _precision_eval_fn(
    predictions, targets=None, metrics=None, pos_label=1, average="binary", sample_weight=None
):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import precision_score

        precision = precision_score(
            targets,
            predictions,
            pos_label=pos_label,
            average=average,
            sample_weight=sample_weight,
        )
        return MetricValue(aggregate_results={"precision_score": precision})


def _f1_score_eval_fn(
    predictions, targets=None, metrics=None, pos_label=1, average="binary", sample_weight=None
):
    if targets is not None and len(targets) != 0:
        from sklearn.metrics import f1_score

        f1 = f1_score(
            targets,
            predictions,
            pos_label=pos_label,
            average=average,
            sample_weight=sample_weight,
        )
        return MetricValue(aggregate_results={"f1_score": f1})


def _precision_at_k_eval_fn(k):
    if not (isinstance(k, int) and k > 0):
        _logger.warning(
            f"Cannot calculate 'precision_at_k' for invalid parameter 'k'. "
            f"'k' should be a positive integer; found: {k}. Skipping metric logging."
        )
        return noop

    def _fn(predictions, targets):
        if not _validate_array_like_id_data(
            predictions, "precision_at_k", predictions_col_specifier
        ) or not _validate_array_like_id_data(targets, "precision_at_k", targets_col_specifier):
            return

        scores = []
        for target, prediction in zip(targets, predictions):
            # only include the top k retrieved chunks
            ground_truth = set(target)
            retrieved = prediction[:k]
            relevant_doc_count = sum(1 for doc in retrieved if doc in ground_truth)
            if len(retrieved) > 0:
                scores.append(relevant_doc_count / len(retrieved))
            else:
                # when no documents are retrieved, precision is 0
                scores.append(0)

        return MetricValue(scores=scores, aggregate_results=standard_aggregations(scores))

    return _fn


def _expand_duplicate_retrieved_docs(predictions, targets):
    counter = {}
    expanded_predictions = []
    expanded_targets = targets
    for doc_id in predictions:
        if doc_id not in counter:
            counter[doc_id] = 1
            expanded_predictions.append(doc_id)
        else:
            counter[doc_id] += 1
            new_doc_id = (
                f"{doc_id}_bc574ae_{counter[doc_id]}"  # adding a random string to avoid collisions
            )
            expanded_predictions.append(new_doc_id)
            if doc_id in expanded_targets:
                expanded_targets.add(new_doc_id)
    return expanded_predictions, expanded_targets


def _prepare_row_for_ndcg(predictions, targets):
    """Prepare data one row from predictions and targets to y_score, y_true for ndcg calculation.

    Args:
        predictions: A list of strings of at most k doc IDs retrieved.
        targets: A list of strings of ground-truth doc IDs.

    Returns:
        y_true : ndarray of shape (1, n_docs) Representing the ground-truth relevant docs.
            n_docs is the number of unique docs in union of predictions and targets.
        y_score : ndarray of shape (1, n_docs) Representing the retrieved docs.
            n_docs is the number of unique docs in union of predictions and targets.
    """
    # sklearn does an internal sort of y_score, so to preserve the order of our retrieved
    # docs, we need to modify the relevance value slightly
    eps = 1e-6

    # support predictions containing duplicate doc ID
    targets = set(targets)
    predictions, targets = _expand_duplicate_retrieved_docs(predictions, targets)

    all_docs = targets.union(predictions)
    doc_id_to_index = {doc_id: i for i, doc_id in enumerate(all_docs)}
    n_labels = max(len(doc_id_to_index), 2)  # sklearn.metrics.ndcg_score requires at least 2 labels
    y_true = np.zeros((1, n_labels), dtype=np.float32)
    y_score = np.zeros((1, n_labels), dtype=np.float32)
    for i, doc_id in enumerate(predictions):
        # "1 - i * eps" means we assign higher score to docs that are ranked higher,
        # but all scores are still approximately 1.
        y_score[0, doc_id_to_index[doc_id]] = 1 - i * eps
    for doc_id in targets:
        y_true[0, doc_id_to_index[doc_id]] = 1
    return y_score, y_true


def _ndcg_at_k_eval_fn(k):
    if not (isinstance(k, int) and k > 0):
        _logger.warning(
            f"Cannot calculate 'ndcg_at_k' for invalid parameter 'k'. "
            f"'k' should be a positive integer; found: {k}. Skipping metric logging."
        )
        return noop

    def _fn(predictions, targets):
        from sklearn.metrics import ndcg_score

        if not _validate_array_like_id_data(
            predictions, "ndcg_at_k", predictions_col_specifier
        ) or not _validate_array_like_id_data(targets, "ndcg_at_k", targets_col_specifier):
            return

        scores = []
        for ground_truth, retrieved in zip(targets, predictions):
            # 1. If no ground truth doc IDs are provided and no documents are retrieved,
            # the score is 1.
            if len(retrieved) == 0 and len(ground_truth) == 0:
                scores.append(1)  # no error is made
                continue
            # 2. If no ground truth doc IDs are provided and documents are retrieved,
            # the score is 0.
            # 3. If ground truth doc IDs are provided and no documents are retrieved,
            # the score is 0.
            if len(retrieved) == 0 or len(ground_truth) == 0:
                scores.append(0)
                continue

            # only include the top k retrieved chunks
            y_score, y_true = _prepare_row_for_ndcg(retrieved[:k], ground_truth)
            score = ndcg_score(y_true, y_score, k=len(retrieved[:k]), ignore_ties=True)
            scores.append(score)

        return MetricValue(scores=scores, aggregate_results=standard_aggregations(scores))

    return _fn


def _recall_at_k_eval_fn(k):
    if not (isinstance(k, int) and k > 0):
        _logger.warning(
            f"Cannot calculate 'recall_at_k' for invalid parameter 'k'. "
            f"'k' should be a positive integer; found: {k}. Skipping metric logging."
        )
        return noop

    def _fn(predictions, targets):
        if not _validate_array_like_id_data(
            predictions, "recall_at_k", predictions_col_specifier
        ) or not _validate_array_like_id_data(targets, "recall_at_k", targets_col_specifier):
            return

        scores = []
        for target, prediction in zip(targets, predictions):
            # only include the top k retrieved chunks
            ground_truth = set(target)
            retrieved = set(prediction[:k])
            relevant_doc_count = len(ground_truth.intersection(retrieved))
            if len(ground_truth) > 0:
                scores.append(relevant_doc_count / len(ground_truth))
            elif len(retrieved) == 0:
                # there are 0 retrieved and ground truth docs, so reward for the match
                scores.append(1)
            else:
                # there are > 0 retrieved, but 0 ground truth, so penalize
                scores.append(0)

        return MetricValue(scores=scores, aggregate_results=standard_aggregations(scores))

    return _fn


def _bleu_eval_fn(predictions, targets=None, metrics=None):
    # Validate input data
    if not _validate_text_data(targets, "bleu", targets_col_specifier):
        _logger.error(
            """Target validation failed.
            Ensure targets are valid for BLEU computation."""
        )
        return
    if not _validate_text_data(predictions, "bleu", predictions_col_specifier):
        _logger.error(
            """Prediction validation failed.
            Ensure predictions are valid for BLEU computation."""
        )
        return

    # Load BLEU metric
    try:
        bleu = _cached_evaluate_load("bleu")
    except Exception as e:
        _logger.warning(f"Failed to load 'bleu' metric (error: {e!r}), skipping metric logging.")
        return

    # Calculate BLEU scores for each prediction-target pair
    result = []
    invalid_indices = []

    for i, (prediction, target) in enumerate(zip(predictions, targets)):
        if len(target) == 0 or len(prediction) == 0:
            invalid_indices.append(i)
            result.append(0)  # Append 0 as a placeholder for invalid entries
            continue

        try:
            score = bleu.compute(predictions=[prediction], references=[[target]])
            result.append(score["bleu"])
        except Exception as e:
            _logger.warning(f"Failed to calculate BLEU for row {i} (error: {e!r}). Skipping.")
            result.append(0)  # Append 0 for consistency if an unexpected error occurs

    # Log warning for any invalid indices
    if invalid_indices:
        _logger.warning(
            f"BLEU score calculation skipped for the following indices "
            f"due to empty target or prediction: {invalid_indices}. "
            f"A score of 0 was appended for these entries."
        )

    # Return results
    if not result:
        _logger.warning("No BLEU scores were calculated due to input errors.")
        return

    return MetricValue(
        scores=result,
        aggregate_results=standard_aggregations(result),
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/metrics/__init__.py

```python
import os

from mlflow.metrics import genai
from mlflow.metrics.base import MetricValue
from mlflow.metrics.genai.utils import _MIGRATION_GUIDE
from mlflow.metrics.metric_definitions import (
    _accuracy_eval_fn,
    _ari_eval_fn,
    _bleu_eval_fn,
    _f1_score_eval_fn,
    _flesch_kincaid_eval_fn,
    _mae_eval_fn,
    _mape_eval_fn,
    _max_error_eval_fn,
    _mse_eval_fn,
    _ndcg_at_k_eval_fn,
    _precision_at_k_eval_fn,
    _precision_eval_fn,
    _r2_score_eval_fn,
    _recall_at_k_eval_fn,
    _recall_eval_fn,
    _rmse_eval_fn,
    _rouge1_eval_fn,
    _rouge2_eval_fn,
    _rougeL_eval_fn,
    _rougeLsum_eval_fn,
    _toxicity_eval_fn,
)
from mlflow.models import (
    EvaluationMetric,
    make_metric,
)
from mlflow.utils.annotations import deprecated


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def latency() -> EvaluationMetric:
    """
    This function will create a metric for calculating latency. Latency is determined by the time
    it takes to generate a prediction for a given input. Note that computing latency requires
    each row to be predicted sequentially, which will likely slow down the evaluation process.
    """
    return make_metric(
        eval_fn=lambda x: MetricValue(),
        greater_is_better=False,
        name="latency",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def token_count(encoding: str = "cl100k_base") -> EvaluationMetric:
    """
    This function will create a metric for calculating token_count. Token count is calculated
    using tiktoken by using the `cl100k_base` tokenizer.

    Note: For air-gapped environments, you can set the TIKTOKEN_CACHE_DIR environment variable
    to specify a local cache directory for tiktoken to avoid downloading the tokenizer files.
    """

    def _token_count_eval_fn(predictions, targets=None, metrics=None):
        import tiktoken

        # ref: https://github.com/openai/tiktoken/issues/75
        # Only set TIKTOKEN_CACHE_DIR if not already set by user
        if "TIKTOKEN_CACHE_DIR" not in os.environ:
            os.environ["TIKTOKEN_CACHE_DIR"] = ""
        enc = tiktoken.get_encoding(encoding)

        num_tokens = []
        for prediction in predictions:
            if isinstance(prediction, str):
                num_tokens.append(len(enc.encode(prediction)))
            else:
                num_tokens.append(None)

        return MetricValue(
            scores=num_tokens,
            aggregate_results={},
        )

    return make_metric(
        eval_fn=_token_count_eval_fn,
        greater_is_better=True,
        name="token_count",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def toxicity() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `toxicity`_ using the model
    `roberta-hate-speech-dynabench-r4`_, which defines hate as "abusive speech targeting
    specific group characteristics, such as ethnic origin, religion, gender, or sexual
    orientation."

    The score ranges from 0 to 1, where scores closer to 1 are more toxic. The default threshold
    for a text to be considered "toxic" is 0.5.

    Aggregations calculated for this metric:
        - ratio (of toxic input texts)

    .. _toxicity: https://huggingface.co/spaces/evaluate-measurement/toxicity
    .. _roberta-hate-speech-dynabench-r4: https://huggingface.co/facebook/roberta-hate-speech-dynabench-r4-target
    """
    return make_metric(
        eval_fn=_toxicity_eval_fn,
        greater_is_better=False,
        name="toxicity",
        long_name="toxicity/roberta-hate-speech-dynabench-r4",
        version="v1",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def flesch_kincaid_grade_level() -> EvaluationMetric:
    """
    This function will create a metric for calculating `flesch kincaid grade level`_ using
    `textstat`_.

    This metric outputs a number that approximates the grade level needed to comprehend the text,
    which will likely range from around 0 to 15 (although it is not limited to this range).

    Aggregations calculated for this metric:
        - mean

    .. _flesch kincaid grade level:
        https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch%E2%80%93Kincaid_grade_level
    .. _textstat: https://pypi.org/project/textstat/
    """
    return make_metric(
        eval_fn=_flesch_kincaid_eval_fn,
        greater_is_better=False,
        name="flesch_kincaid_grade_level",
        version="v1",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def ari_grade_level() -> EvaluationMetric:
    """
    This function will create a metric for calculating `automated readability index`_ using
    `textstat`_.

    This metric outputs a number that approximates the grade level needed to comprehend the text,
    which will likely range from around 0 to 15 (although it is not limited to this range).

    Aggregations calculated for this metric:
        - mean

    .. _automated readability index: https://en.wikipedia.org/wiki/Automated_readability_index
    .. _textstat: https://pypi.org/project/textstat/
    """
    return make_metric(
        eval_fn=_ari_eval_fn,
        greater_is_better=False,
        name="ari_grade_level",
        long_name="automated_readability_index_grade_level",
        version="v1",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def exact_match() -> EvaluationMetric:
    """
    This function will create a metric for calculating `accuracy`_ using sklearn.

    This metric only computes an aggregate score which ranges from 0 to 1.

    .. _accuracy: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html
    """
    return make_metric(
        eval_fn=_accuracy_eval_fn, greater_is_better=True, name="exact_match", version="v1"
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def rouge1() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `rouge1`_.

    The score ranges from 0 to 1, where a higher score indicates higher similarity.
    `rouge1`_ uses unigram based scoring to calculate similarity.

    Aggregations calculated for this metric:
        - mean

    .. _rouge1: https://huggingface.co/spaces/evaluate-metric/rouge
    """
    return make_metric(
        eval_fn=_rouge1_eval_fn,
        greater_is_better=True,
        name="rouge1",
        version="v1",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def rouge2() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `rouge2`_.

    The score ranges from 0 to 1, where a higher score indicates higher similarity.
    `rouge2`_ uses bigram based scoring to calculate similarity.

    Aggregations calculated for this metric:
        - mean

    .. _rouge2: https://huggingface.co/spaces/evaluate-metric/rouge
    """
    return make_metric(
        eval_fn=_rouge2_eval_fn,
        greater_is_better=True,
        name="rouge2",
        version="v1",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def rougeL() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `rougeL`_.

    The score ranges from 0 to 1, where a higher score indicates higher similarity.
    `rougeL`_ uses unigram based scoring to calculate similarity.

    Aggregations calculated for this metric:
        - mean

    .. _rougeL: https://huggingface.co/spaces/evaluate-metric/rouge
    """
    return make_metric(
        eval_fn=_rougeL_eval_fn,
        greater_is_better=True,
        name="rougeL",
        version="v1",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def rougeLsum() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `rougeLsum`_.

    The score ranges from 0 to 1, where a higher score indicates higher similarity.
    `rougeLsum`_ uses longest common subsequence based scoring to calculate similarity.

    Aggregations calculated for this metric:
        - mean

    .. _rougeLsum: https://huggingface.co/spaces/evaluate-metric/rouge
    """
    return make_metric(
        eval_fn=_rougeLsum_eval_fn,
        greater_is_better=True,
        name="rougeLsum",
        version="v1",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def precision_at_k(k) -> EvaluationMetric:
    """
    This function will create a metric for calculating ``precision_at_k`` for retriever models.

    This metric computes a score between 0 and 1 for each row representing the precision of the
    retriever model at the given ``k`` value. If no relevant documents are retrieved, the score is
    0, indicating that no relevant docs are retrieved. Let ``x = min(k, # of retrieved doc IDs)``.
    Then, in all other cases, the precision at k is calculated as follows:

        ``precision_at_k`` = (# of relevant retrieved doc IDs in top-``x`` ranked docs) / ``x``.
    """
    return make_metric(
        eval_fn=_precision_at_k_eval_fn(k),
        greater_is_better=True,
        name=f"precision_at_{k}",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def recall_at_k(k) -> EvaluationMetric:
    """
    This function will create a metric for calculating ``recall_at_k`` for retriever models.

    This metric computes a score between 0 and 1 for each row representing the recall ability of
    the retriever model at the given ``k`` value. If no ground truth doc IDs are provided and no
    documents are retrieved, the score is 1. However, if no ground truth doc IDs are provided and
    documents are retrieved, the score is 0. In all other cases, the recall at k is calculated as
    follows:

        ``recall_at_k`` = (# of unique relevant retrieved doc IDs in top-``k`` ranked docs) / (# of
        ground truth doc IDs)
    """
    return make_metric(
        eval_fn=_recall_at_k_eval_fn(k),
        greater_is_better=True,
        name=f"recall_at_{k}",
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def ndcg_at_k(k) -> EvaluationMetric:
    """
    This function will create a metric for evaluating `NDCG@k`_ for retriever models.

    NDCG score is capable of handling non-binary notions of relevance. However, for simplicity,
    we use binary relevance here. The relevance score for documents in the ground truth is 1,
    and the relevance score for documents not in the ground truth is 0.

    The NDCG score is calculated using sklearn.metrics.ndcg_score with the following edge cases
    on top of the sklearn implementation:

    1. If no ground truth doc IDs are provided and no documents are retrieved, the score is 1.
    2. If no ground truth doc IDs are provided and documents are retrieved, the score is 0.
    3. If ground truth doc IDs are provided and no documents are retrieved, the score is 0.
    4. If duplicate doc IDs are retrieved and the duplicate doc IDs are in the ground truth,
       they will be treated as different docs. For example, if the ground truth doc IDs are
       [1, 2] and the retrieved doc IDs are [1, 1, 1, 3], the score will be equivalent to
       ground truth doc IDs [10, 11, 12, 2] and retrieved doc IDs [10, 11, 12, 3].

    .. _NDCG@k: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ndcg_score.html
    """
    return make_metric(
        eval_fn=_ndcg_at_k_eval_fn(k),
        greater_is_better=True,
        name=f"ndcg_at_{k}",
    )


# General Regression Metrics
def mae() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `mae`_.

    This metric computes an aggregate score for the mean absolute error for regression.

    .. _mae: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html
    """
    return make_metric(
        eval_fn=_mae_eval_fn,
        greater_is_better=False,
        name="mean_absolute_error",
    )


def mse() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `mse`_.

    This metric computes an aggregate score for the mean squared error for regression.

    .. _mse: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html
    """
    return make_metric(
        eval_fn=_mse_eval_fn,
        greater_is_better=False,
        name="mean_squared_error",
    )


def rmse() -> EvaluationMetric:
    """
    This function will create a metric for evaluating the square root of `mse`_.

    This metric computes an aggregate score for the root mean absolute error for regression.

    .. _mse: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html
    """

    return make_metric(
        eval_fn=_rmse_eval_fn,
        greater_is_better=False,
        name="root_mean_squared_error",
    )


def r2_score() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `r2_score`_.

    This metric computes an aggregate score for the coefficient of determination. R2 ranges from
    negative infinity to 1, and measures the percentage of variance explained by the predictor
    variables in a regression.

    .. _r2_score: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.r2_score.html
    """
    return make_metric(
        eval_fn=_r2_score_eval_fn,
        greater_is_better=True,
        name="r2_score",
    )


def max_error() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `max_error`_.

    This metric computes an aggregate score for the maximum residual error for regression.

    .. _max_error: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.max_error.html
    """
    return make_metric(
        eval_fn=_max_error_eval_fn,
        greater_is_better=False,
        name="max_error",
    )


def mape() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `mape`_.

    This metric computes an aggregate score for the mean absolute percentage error for regression.

    .. _mape: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_percentage_error.html
    """
    return make_metric(
        eval_fn=_mape_eval_fn,
        greater_is_better=False,
        name="mean_absolute_percentage_error",
    )


# Binary Classification Metrics


def recall_score() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `recall`_ for classification.

    This metric computes an aggregate score between 0 and 1 for the recall of a classification task.

    .. _recall: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html
    """
    return make_metric(eval_fn=_recall_eval_fn, greater_is_better=True, name="recall_score")


def precision_score() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `precision`_ for classification.

    This metric computes an aggregate score between 0 and 1 for the precision of
    classification task.

    .. _precision: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html
    """
    return make_metric(eval_fn=_precision_eval_fn, greater_is_better=True, name="precision_score")


def f1_score() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `f1_score`_ for binary classification.

    This metric computes an aggregate score between 0 and 1 for the F1 score (F-measure) of a
    classification task. F1 score is defined as 2 * (precision * recall) / (precision + recall).

    .. _f1_score: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html
    """
    return make_metric(eval_fn=_f1_score_eval_fn, greater_is_better=True, name="f1_score")


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def bleu() -> EvaluationMetric:
    """
    This function will create a metric for evaluating `bleu`_.

    The BLEU scores range from 0 to 1, with higher scores indicating greater similarity to
    reference texts. BLEU considers n-gram precision and brevity penalty. While adding more
    references can boost the score, perfect scores are rare and not essential for effective
    evaluation.

    Aggregations calculated for this metric:
        - mean
        - variance
        - p90

    .. _bleu: https://huggingface.co/spaces/evaluate-metric/bleu
    """
    return make_metric(
        eval_fn=_bleu_eval_fn,
        greater_is_better=True,
        name="bleu",
        version="v1",
    )


__all__ = [
    "EvaluationMetric",
    "MetricValue",
    "make_metric",
    "flesch_kincaid_grade_level",
    "ari_grade_level",
    "exact_match",
    "rouge1",
    "rouge2",
    "rougeL",
    "rougeLsum",
    "toxicity",
    "mae",
    "mse",
    "rmse",
    "r2_score",
    "max_error",
    "mape",
    "recall_score",
    "precision_score",
    "f1_score",
    "token_count",
    "latency",
    "genai",
    "bleu",
]
```

--------------------------------------------------------------------------------

````
