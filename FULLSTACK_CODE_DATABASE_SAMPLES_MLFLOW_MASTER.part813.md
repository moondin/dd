---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 813
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 813 of 991)

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

---[FILE: test_context.py]---
Location: mlflow-master/tests/genai/evaluate/test_context.py

```python
import threading
from unittest import mock

import pytest

import mlflow
from mlflow.environment_variables import MLFLOW_TRACKING_USERNAME
from mlflow.genai.evaluation.context import NoneContext, _set_context, eval_context, get_context


@pytest.fixture(autouse=True)
def reset_context():
    yield
    _set_context(NoneContext())


def test_context_get_experiment_and_run_id():
    exp_id = mlflow.set_experiment("Test").experiment_id

    @eval_context
    def _test():
        assert exp_id == get_context().get_mlflow_experiment_id()
        assert get_context().get_mlflow_run_id() is None

    _test()


def test_context_get_run_id_active_run():
    @eval_context
    def _test():
        with mlflow.start_run() as run:
            assert run.info.run_id == get_context().get_mlflow_run_id()

    _test()


def test_context_get_run_id_explicitly_set():
    @eval_context
    def _test():
        context = get_context()
        context.set_mlflow_run_id("test-run-id")
        assert context.get_mlflow_run_id() == "test-run-id"

        run_id = None

        def _target():
            nonlocal run_id
            run_id = get_context().get_mlflow_run_id()

        thread = threading.Thread(target=_target)
        thread.start()
        assert run_id == "test-run-id"

    _test()


def test_context_get_user_name(monkeypatch):
    monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, "test-user")

    @eval_context
    def _test():
        assert get_context().get_user_name() == "test-user"

    _test()


def test_context_get_user_name_no_user_set():
    with mock.patch(
        "mlflow.tracking.context.default_context.DefaultRunContext.tags", return_value={}
    ):

        @eval_context
        def _test():
            assert get_context().get_user_name() == "unknown"

        _test()
```

--------------------------------------------------------------------------------

---[FILE: test_entities.py]---
Location: mlflow-master/tests/genai/evaluate/test_entities.py

```python
from mlflow.entities.dataset_record_source import DatasetRecordSource, DatasetRecordSourceType
from mlflow.genai.evaluation.entities import EvalItem


def test_eval_item_from_dataset_row_extracts_source():
    source = DatasetRecordSource(
        source_type=DatasetRecordSourceType.TRACE,
        source_data={"trace_id": "tr-123", "session_id": "session_1"},
    )

    row = {
        "inputs": {"question": "test"},
        "outputs": "answer",
        "expectations": {},
        "source": source,
    }

    eval_item = EvalItem.from_dataset_row(row)

    assert eval_item.source == source
    assert eval_item.source.source_data["session_id"] == "session_1"
    assert eval_item.inputs == {"question": "test"}
    assert eval_item.outputs == "answer"


def test_eval_item_from_dataset_row_handles_missing_source():
    row = {
        "inputs": {"question": "test"},
        "outputs": "answer",
        "expectations": {},
    }

    eval_item = EvalItem.from_dataset_row(row)

    assert eval_item.source is None
    assert eval_item.inputs == {"question": "test"}
    assert eval_item.outputs == "answer"
```

--------------------------------------------------------------------------------

````
