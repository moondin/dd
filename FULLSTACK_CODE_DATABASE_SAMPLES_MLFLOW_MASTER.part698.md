---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 698
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 698 of 991)

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

---[FILE: events.py]---
Location: mlflow-master/mlflow/telemetry/events.py

```python
import inspect
import sys
from enum import Enum
from typing import Any

from mlflow.entities import Feedback
from mlflow.telemetry.constant import GENAI_MODULES, MODULES_TO_CHECK_IMPORT


class Event:
    name: str

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        """
        Parse the arguments and return the params.
        """
        return None


class CreateExperimentEvent(Event):
    name: str = "create_experiment"

    @classmethod
    def parse_result(cls, result: Any) -> dict[str, Any] | None:
        # create_experiment API returns the experiment id
        return {"experiment_id": result}


class CreatePromptEvent(Event):
    name: str = "create_prompt"


class LoadPromptEvent(Event):
    name: str = "load_prompt"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        name_or_uri = arguments.get("name_or_uri", "")
        # Check if alias is used (format: "prompts:/name@alias")
        uses_alias = "@" in name_or_uri
        return {"uses_alias": uses_alias}


class StartTraceEvent(Event):
    name: str = "start_trace"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        # Capture the set of currently imported packages at trace start time to
        # understand the flavor of the trace.
        return {"imports": [pkg for pkg in GENAI_MODULES if pkg in sys.modules]}


class LogAssessmentEvent(Event):
    name: str = "log_assessment"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        from mlflow.entities.assessment import Expectation, Feedback

        assessment = arguments.get("assessment")
        if assessment is None:
            return None

        if isinstance(assessment, Expectation):
            return {"type": "expectation", "source_type": assessment.source.source_type}
        elif isinstance(assessment, Feedback):
            return {"type": "feedback", "source_type": assessment.source.source_type}


class EvaluateEvent(Event):
    name: str = "evaluate"


class GenAIEvaluateEvent(Event):
    name: str = "genai_evaluate"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        from mlflow.genai.scorers.base import Scorer
        from mlflow.genai.scorers.builtin_scorers import BuiltInScorer

        record_params = {}

        # Track if predict_fn is provided
        record_params["predict_fn_provided"] = arguments.get("predict_fn") is not None

        # Track eval data type
        eval_data = arguments.get("data")
        if eval_data is not None:
            from mlflow.genai.evaluation.utils import _get_eval_data_type

            record_params.update(_get_eval_data_type(eval_data))

        # Track scorer information
        scorers = arguments.get("scorers") or []
        scorer_info = [
            {
                "class": (
                    type(scorer).__name__
                    if isinstance(scorer, BuiltInScorer)
                    else "UserDefinedScorer"
                ),
                "kind": scorer.kind.value,
                "scope": "session" if scorer.is_session_level_scorer else "response",
            }
            for scorer in scorers
            if isinstance(scorer, Scorer)
        ]
        record_params["scorer_info"] = scorer_info

        return record_params

    @classmethod
    def parse_result(cls, result: Any) -> dict[str, Any] | None:
        _, telemetry_data = result

        if not isinstance(telemetry_data, dict):
            return None

        return telemetry_data


class CreateLoggedModelEvent(Event):
    name: str = "create_logged_model"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        if flavor := arguments.get("flavor"):
            return {"flavor": flavor.removeprefix("mlflow.")}
        return None


class GetLoggedModelEvent(Event):
    name: str = "get_logged_model"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        return {
            "imports": [pkg for pkg in MODULES_TO_CHECK_IMPORT if pkg in sys.modules],
        }


class CreateRegisteredModelEvent(Event):
    name: str = "create_registered_model"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        tags = arguments.get("tags") or {}
        return {"is_prompt": _is_prompt(tags)}


class CreateRunEvent(Event):
    name: str = "create_run"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        # Capture the set of currently imported packages at run creation time to
        # understand how MLflow is used together with other libraries. Collecting
        # this data at run creation ensures accuracy and completeness.
        return {
            "imports": [pkg for pkg in MODULES_TO_CHECK_IMPORT if pkg in sys.modules],
            "experiment_id": arguments.get("experiment_id"),
        }


class CreateModelVersionEvent(Event):
    name: str = "create_model_version"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        tags = arguments.get("tags") or {}
        return {"is_prompt": _is_prompt(tags)}


class CreateDatasetEvent(Event):
    name: str = "create_dataset"


class MergeRecordsEvent(Event):
    name: str = "merge_records"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        if arguments is None:
            return None

        records = arguments.get("records")
        if records is None:
            return None

        try:
            count = len(records)
        except TypeError:
            return None

        if count == 0:
            return None

        input_type = type(records).__name__.lower()
        if "dataframe" in input_type:
            input_type = "pandas"
        elif isinstance(records, list):
            first_elem = records[0]
            if hasattr(first_elem, "__class__") and first_elem.__class__.__name__ == "Trace":
                input_type = "list[trace]"
            elif isinstance(first_elem, dict):
                input_type = "list[dict]"
            else:
                input_type = "list"
        else:
            input_type = "other"

        return {"record_count": count, "input_type": input_type}


def _is_prompt(tags: dict[str, str]) -> bool:
    try:
        from mlflow.prompt.constants import IS_PROMPT_TAG_KEY
    except ImportError:
        return False
    return tags.get(IS_PROMPT_TAG_KEY, "false").lower() == "true"


class CreateWebhookEvent(Event):
    name: str = "create_webhook"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        events = arguments.get("events") or []
        return {"events": [str(event) for event in events]}


class PromptOptimizationEvent(Event):
    name: str = "prompt_optimization"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        result = {}

        # Track the optimizer type used
        if optimizer := arguments.get("optimizer"):
            result["optimizer_type"] = type(optimizer).__name__
        else:
            result["optimizer_type"] = None

        # Track the number of prompts being optimized
        prompt_uris = arguments.get("prompt_uris") or []
        try:
            result["prompt_count"] = len(prompt_uris)
        except TypeError:
            result["prompt_count"] = None

        # Track if custom scorers are provided and how many
        scorers = arguments.get("scorers")
        try:
            result["scorer_count"] = len(scorers)
        except TypeError:
            result["scorer_count"] = None

        # Track if custom aggregation is provided
        result["custom_aggregation"] = arguments.get("aggregation") is not None

        return result


class LogDatasetEvent(Event):
    name: str = "log_dataset"


class LogMetricEvent(Event):
    name: str = "log_metric"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        return {"synchronous": arguments.get("synchronous")}


class LogParamEvent(Event):
    name: str = "log_param"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        return {"synchronous": arguments.get("synchronous")}


class LogBatchEvent(Event):
    name: str = "log_batch"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        return {
            "metrics": bool(arguments.get("metrics")),
            "params": bool(arguments.get("params")),
            "tags": bool(arguments.get("tags")),
            "synchronous": arguments.get("synchronous"),
        }


class McpRunEvent(Event):
    name: str = "mcp_run"


class AiCommandRunEvent(Event):
    name: str = "ai_command_run"


class GitModelVersioningEvent(Event):
    name: str = "git_model_versioning"


class InvokeCustomJudgeModelEvent(Event):
    name: str = "invoke_custom_judge_model"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        from mlflow.metrics.genai.model_utils import _parse_model_uri

        model_uri = arguments.get("model_uri")
        if not model_uri:
            return {"model_provider": None}

        model_provider, _ = _parse_model_uri(model_uri)
        return {"model_provider": model_provider}


class MakeJudgeEvent(Event):
    name: str = "make_judge"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        model = arguments.get("model")
        if model and isinstance(model, str):
            model_provider = model.split(":")[0] if ":" in model else None
            return {"model_provider": model_provider}
        return {"model_provider": None}


class AlignJudgeEvent(Event):
    name: str = "align_judge"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        result = {}

        if (traces := arguments.get("traces")) is not None:
            try:
                result["trace_count"] = len(traces)
            except TypeError:
                result["trace_count"] = None

        if optimizer := arguments.get("optimizer"):
            result["optimizer_type"] = type(optimizer).__name__
        else:
            result["optimizer_type"] = "default"

        return result


class AutologgingEvent(Event):
    name: str = "autologging"


class TraceSource(str, Enum):
    """Source of a trace received by the MLflow server."""

    MLFLOW_PYTHON_CLIENT = "MLFLOW_PYTHON_CLIENT"
    UNKNOWN = "UNKNOWN"


class TracesReceivedByServerEvent(Event):
    name: str = "traces_received_by_server"


class ScorerCallEvent(Event):
    name: str = "scorer_call"

    @classmethod
    def parse(cls, arguments: dict[str, Any]) -> dict[str, Any] | None:
        from mlflow.genai.scorers.base import Scorer
        from mlflow.genai.scorers.builtin_scorers import BuiltInScorer

        scorer_instance = arguments.get("self")
        if not isinstance(scorer_instance, Scorer):
            return None

        callsite = "direct_scorer_call"
        for frame_info in inspect.stack()[:10]:
            frame_filename = frame_info.filename
            frame_function = frame_info.function

            if "mlflow/genai/scorers/base" in frame_filename.replace("\\", "/"):
                if frame_function == "run":
                    callsite = "genai.evaluate"
                    break

        return {
            "scorer_class": (
                type(scorer_instance).__name__
                if isinstance(scorer_instance, BuiltInScorer)
                else "UserDefinedScorer"
            ),
            "scorer_kind": scorer_instance.kind.value,
            "is_session_level_scorer": scorer_instance.is_session_level_scorer,
            "callsite": callsite,
        }

    @classmethod
    def parse_result(cls, result: Any) -> dict[str, Any] | None:
        if isinstance(result, Feedback):
            return {"has_feedback_error": result.error is not None}

        if isinstance(result, list) and result and all(isinstance(f, Feedback) for f in result):
            return {"has_feedback_error": any(f.error is not None for f in result)}

        return {"has_feedback_error": False}
```

--------------------------------------------------------------------------------

---[FILE: installation_id.py]---
Location: mlflow-master/mlflow/telemetry/installation_id.py

```python
import json
import os
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path

from mlflow.utils.os import is_windows
from mlflow.version import VERSION

_KEY_INSTALLATION_ID = "installation_id"
_CACHE_LOCK = threading.RLock()
_INSTALLATION_ID_CACHE: str | None = None


def get_or_create_installation_id() -> str | None:
    """
    Return a persistent installation ID if available, otherwise generate a new one and store it.

    This function MUST NOT raise an exception.
    """
    global _INSTALLATION_ID_CACHE

    if _INSTALLATION_ID_CACHE is not None:
        return _INSTALLATION_ID_CACHE

    try:
        with _CACHE_LOCK:
            # Double check after acquiring the lock to avoid race condition
            if _INSTALLATION_ID_CACHE is not None:
                return _INSTALLATION_ID_CACHE

            if loaded := _load_installation_id_from_disk():
                _INSTALLATION_ID_CACHE = loaded
                return loaded

            new_id = str(uuid.uuid4())
            _write_installation_id_to_disk(new_id)
            # Set installation ID after writing to disk because disk write might fail
            _INSTALLATION_ID_CACHE = new_id
            return new_id
    except Exception:
        # Any failure must be non-fatal; keep using in-memory cache only.
        return None


def _load_installation_id_from_disk() -> str | None:
    path = _get_telemetry_file_path()
    if not path.exists():
        return None

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        raw = data.get(_KEY_INSTALLATION_ID)
        # NB: Parse as UUID to validate the format, but return the original string
        if isinstance(raw, str) and raw:
            uuid.UUID(raw)
            return raw
        return None
    except Exception:
        return None


def _get_telemetry_file_path() -> Path:
    if is_windows() and (appdata := os.getenv("APPDATA")):
        base = Path(appdata)
    else:
        xdg = os.getenv("XDG_CONFIG_HOME")
        base = Path(xdg) if xdg else Path.home() / ".config"
    return base / "mlflow" / "telemetry.json"


def _write_installation_id_to_disk(installation_id: str) -> None:
    path = _get_telemetry_file_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    config = {
        _KEY_INSTALLATION_ID: installation_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_version": VERSION,
        "schema_version": 1,
    }
    # NB: We atomically write to a temporary file and then replace the real file
    # to avoid risks of partial writes (e.g., if the process crashes or is killed midway).
    # Writing directly to "path" may result in a corrupted file if interrupted,
    # so we write to a ".tmp" file first and then rename, which is atomic on most filesystems.
    tmp_path = path.with_suffix(".tmp")
    tmp_path.write_text(json.dumps(config), encoding="utf-8")
    tmp_path.replace(path)
```

--------------------------------------------------------------------------------

---[FILE: schemas.py]---
Location: mlflow-master/mlflow/telemetry/schemas.py

```python
import json
import platform
import sys
from dataclasses import dataclass
from enum import Enum
from typing import Any

from mlflow.version import IS_MLFLOW_SKINNY, IS_TRACING_SDK_ONLY, VERSION


class Status(str, Enum):
    UNKNOWN = "unknown"
    SUCCESS = "success"
    FAILURE = "failure"


@dataclass
class Record:
    event_name: str
    timestamp_ns: int
    params: dict[str, Any] | None = None
    status: Status = Status.UNKNOWN
    duration_ms: int | None = None
    # installation and session ID usually comes from the telemetry client,
    # but callers can override with these fields (e.g. in UI telemetry records)
    installation_id: str | None = None
    session_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        result = {
            "timestamp_ns": self.timestamp_ns,
            "event_name": self.event_name,
            # dump params to string so we can parse them easily in ETL pipeline
            "params": json.dumps(self.params) if self.params else None,
            "status": self.status.value,
            "duration_ms": self.duration_ms,
        }
        if self.installation_id:
            result["installation_id"] = self.installation_id
        if self.session_id:
            result["session_id"] = self.session_id
        return result


class SourceSDK(str, Enum):
    MLFLOW_TRACING = "mlflow-tracing"
    MLFLOW = "mlflow"
    MLFLOW_SKINNY = "mlflow-skinny"


def get_source_sdk() -> SourceSDK:
    if IS_TRACING_SDK_ONLY:
        return SourceSDK.MLFLOW_TRACING
    elif IS_MLFLOW_SKINNY:
        return SourceSDK.MLFLOW_SKINNY
    else:
        return SourceSDK.MLFLOW


@dataclass
class TelemetryInfo:
    session_id: str
    source_sdk: str = get_source_sdk().value
    mlflow_version: str = VERSION
    schema_version: int = 2
    python_version: str = (
        f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    )
    operating_system: str = platform.platform()
    tracking_uri_scheme: str | None = None
    installation_id: str | None = None


@dataclass
class TelemetryConfig:
    ingestion_url: str
    disable_events: set[str]
```

--------------------------------------------------------------------------------

---[FILE: track.py]---
Location: mlflow-master/mlflow/telemetry/track.py

```python
import functools
import inspect
import logging
import time
from typing import Any, Callable, ParamSpec, TypeVar

from mlflow.environment_variables import MLFLOW_EXPERIMENT_ID
from mlflow.telemetry.client import get_telemetry_client
from mlflow.telemetry.events import Event
from mlflow.telemetry.schemas import Record, Status
from mlflow.telemetry.utils import _log_error, is_telemetry_disabled

P = ParamSpec("P")
R = TypeVar("R")

_logger = logging.getLogger(__name__)


def record_usage_event(event: type[Event]) -> Callable[[Callable[P, R]], Callable[P, R]]:
    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            if is_telemetry_disabled() or _is_telemetry_disabled_for_event(event):
                return func(*args, **kwargs)

            success = True
            result = None
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                return result  # noqa: RET504
            except Exception:
                success = False
                raise
            finally:
                try:
                    duration_ms = int((time.time() - start_time) * 1000)
                    _add_telemetry_record(func, args, kwargs, success, duration_ms, event, result)
                except Exception as e:
                    _log_error(f"Failed to record telemetry event {event.name}: {e}")

        return wrapper

    return decorator


def _add_telemetry_record(
    func: Callable[..., Any],
    args: tuple[Any, ...],
    kwargs: dict[str, Any],
    success: bool,
    duration_ms: int,
    event: type[Event],
    result: Any,
) -> None:
    try:
        if client := get_telemetry_client():
            signature = inspect.signature(func)
            bound_args = signature.bind(*args, **kwargs)
            bound_args.apply_defaults()

            arguments = dict(bound_args.arguments)
            record_params = event.parse(arguments) or {}
            if hasattr(event, "parse_result"):
                record_params.update(event.parse_result(result))
            if experiment_id := MLFLOW_EXPERIMENT_ID.get():
                record_params["mlflow_experiment_id"] = experiment_id
            record = Record(
                event_name=event.name,
                timestamp_ns=time.time_ns(),
                params=record_params or None,
                status=Status.SUCCESS if success else Status.FAILURE,
                duration_ms=duration_ms,
            )
            client.add_record(record)
    except Exception as e:
        _log_error(f"Failed to generate telemetry record for event {event.name}: {e}")


def _record_event(event: type[Event], params: dict[str, Any] | None = None) -> None:
    try:
        if client := get_telemetry_client():
            if experiment_id := MLFLOW_EXPERIMENT_ID.get():
                params["mlflow_experiment_id"] = experiment_id
            client.add_record(
                Record(
                    event_name=event.name,
                    params=params,
                    timestamp_ns=time.time_ns(),
                    status=Status.SUCCESS,
                    duration_ms=0,
                )
            )
    except Exception as e:
        _log_error(f"Failed to record telemetry event {event.name}: {e}")


def _is_telemetry_disabled_for_event(event: type[Event]) -> bool:
    try:
        if client := get_telemetry_client():
            if client.config:
                return event.name in client.config.disable_events
            # when config is not fetched yet, we assume telemetry is enabled and
            # append records. After fetching the config, we check the telemetry
            # status and drop the records if disabled.
            else:
                return False
        # telemetry is disabled
        else:
            return True
    except Exception as e:
        _log_error(f"Failed to check telemetry status for event {event.name}: {e}")
        return True
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/telemetry/utils.py

```python
import logging
import os
from typing import Any

import requests
from packaging.version import Version

from mlflow.environment_variables import (
    _MLFLOW_TELEMETRY_LOGGING,
    _MLFLOW_TESTING_TELEMETRY,
    MLFLOW_DISABLE_TELEMETRY,
)
from mlflow.telemetry.constant import (
    CONFIG_STAGING_URL,
    CONFIG_URL,
    FALLBACK_UI_CONFIG,
    UI_CONFIG_STAGING_URL,
    UI_CONFIG_URL,
)
from mlflow.version import VERSION

_logger = logging.getLogger(__name__)


def _is_ci_env_or_testing() -> bool:
    """
    Check if the current environment is a CI environment.
    If so, we should not track telemetry.
    """
    env_vars = {
        "PYTEST_CURRENT_TEST",  # https://docs.pytest.org/en/stable/example/simple.html#pytest-current-test-environment-variable
        "GITHUB_ACTIONS",  # https://docs.github.com/en/actions/reference/variables-reference?utm_source=chatgpt.com#default-environment-variables
        "CI",  # set by many CI providers
        "CIRCLECI",  # https://circleci.com/docs/variables/#built-in-environment-variables
        "GITLAB_CI",  # https://docs.gitlab.com/ci/variables/predefined_variables/#predefined-variables
        "JENKINS_URL",  # https://www.jenkins.io/doc/book/pipeline/jenkinsfile/#using-environment-variables
        "TRAVIS",  # https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
        "TF_BUILD",  # https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml#system-variables
        "BITBUCKET_BUILD_NUMBER",  # https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/
        "CODEBUILD_BUILD_ARN",  # https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
        "BUILDKITE",  # https://buildkite.com/docs/pipelines/configure/environment-variables
        "TEAMCITY_VERSION",  # https://www.jetbrains.com/help/teamcity/predefined-build-parameters.html#Predefined+Server+Build+Parameters
        "CLOUD_RUN_EXECUTION",  # https://cloud.google.com/run/docs/reference/container-contract#env-vars
        # runbots
        "RUNBOT_HOST_URL",
        "RUNBOT_BUILD_NAME",
        "RUNBOT_WORKER_ID",
    }
    # For most of the cases, the env var existing means we are in CI
    for var in env_vars:
        if var in os.environ:
            return True
    return False


# NB: implement the function here to avoid unnecessary imports inside databricks_utils
def _is_in_databricks() -> bool:
    # check if in databricks runtime
    if "DATABRICKS_RUNTIME_VERSION" in os.environ:
        return True
    if os.path.exists("/databricks/DBR_VERSION"):
        return True

    # check if in databricks model serving environment
    if os.environ.get("IS_IN_DB_MODEL_SERVING_ENV", "false").lower() == "true":
        return True

    return False


_IS_MLFLOW_DEV_VERSION = Version(VERSION).is_devrelease
_IS_IN_CI_ENV_OR_TESTING = _is_ci_env_or_testing()
_IS_IN_DATABRICKS = _is_in_databricks()
_IS_MLFLOW_TESTING_TELEMETRY = _MLFLOW_TESTING_TELEMETRY.get()


def is_telemetry_disabled() -> bool:
    try:
        if _IS_MLFLOW_TESTING_TELEMETRY:
            return False
        return (
            MLFLOW_DISABLE_TELEMETRY.get()
            or os.environ.get("DO_NOT_TRACK", "false").lower() == "true"
            or _IS_IN_CI_ENV_OR_TESTING
            or _IS_IN_DATABRICKS
            or _IS_MLFLOW_DEV_VERSION
        )
    except Exception as e:
        _log_error(f"Failed to check telemetry disabled status: {e}")
        return True


def _get_config_url(version: str, is_ui: bool = False) -> str | None:
    """
    Get the config URL for the given MLflow version.
    """
    version_obj = Version(version)

    if version_obj.is_devrelease or _IS_MLFLOW_TESTING_TELEMETRY:
        base_url = UI_CONFIG_STAGING_URL if is_ui else CONFIG_STAGING_URL
        return f"{base_url}/{version}.json"

    if version_obj.base_version == version or (
        version_obj.is_prerelease and version_obj.pre[0] == "rc"
    ):
        base_url = UI_CONFIG_URL if is_ui else CONFIG_URL
        return f"{base_url}/{version}.json"

    return None


def _log_error(message: str) -> None:
    if _MLFLOW_TELEMETRY_LOGGING.get():
        _logger.error(message, exc_info=True)


def fetch_ui_telemetry_config() -> dict[str, Any]:
    # Check if telemetry is disabled
    if is_telemetry_disabled():
        return FALLBACK_UI_CONFIG

    # Get config URL
    config_url = _get_config_url(VERSION, is_ui=True)
    if not config_url:
        return FALLBACK_UI_CONFIG

    # Fetch config from remote URL
    try:
        response = requests.get(config_url, timeout=1)
        if response.status_code != 200:
            return FALLBACK_UI_CONFIG

        return response.json()
    except Exception as e:
        _log_error(f"Failed to fetch UI telemetry config: {e}")
        return FALLBACK_UI_CONFIG
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/telemetry/__init__.py

```python
from mlflow.telemetry.client import get_telemetry_client, set_telemetry_client

__all__ = ["get_telemetry_client", "set_telemetry_client"]
```

--------------------------------------------------------------------------------

---[FILE: autologging.py]---
Location: mlflow-master/mlflow/tensorflow/autologging.py

```python
import numpy as np
import tensorflow
from tensorflow.keras.callbacks import TensorBoard

from mlflow.utils.autologging_utils import (
    INPUT_EXAMPLE_SAMPLE_ROWS,
    ExceptionSafeClass,
)


class _TensorBoard(TensorBoard, metaclass=ExceptionSafeClass):
    pass


def _extract_input_example_from_tensor_or_ndarray(
    input_features: tensorflow.Tensor | np.ndarray,
) -> np.ndarray:
    """
    Extracts first `INPUT_EXAMPLE_SAMPLE_ROWS` from the next_input, which can either be of
    numpy array or tensor type.

    Args:
        input_features: an input of type `np.ndarray` or `tensorflow.Tensor`

    Returns:
        A slice (of limit `INPUT_EXAMPLE_SAMPLE_ROWS`)  of the input of type `np.ndarray`.
        Returns `None` if the type of `input_features` is unsupported.

    Examples
    --------
    when next_input is nd.array:
    >>> input_data = np.array([1, 2, 3, 4, 5, 6, 7, 8])
    >>> _extract_input_example_from_tensor_or_ndarray(input_data)
    array([1, 2, 3, 4, 5])


    when next_input is tensorflow.Tensor:
    >>> input_data = tensorflow.convert_to_tensor([1, 2, 3, 4, 5, 6])
    >>> _extract_input_example_from_tensor_or_ndarray(input_data)
    array([1, 2, 3, 4, 5])
    """

    input_feature_slice = None
    if isinstance(input_features, tensorflow.Tensor):
        input_feature_slice = input_features.numpy()[0:INPUT_EXAMPLE_SAMPLE_ROWS]
    elif isinstance(input_features, np.ndarray):
        input_feature_slice = input_features[0:INPUT_EXAMPLE_SAMPLE_ROWS]
    return input_feature_slice


def _extract_sample_numpy_dict(
    input_numpy_features_dict: dict[str, np.ndarray],
) -> dict[str, np.ndarray] | np.ndarray:
    """
    Extracts `INPUT_EXAMPLE_SAMPLE_ROWS` sample from next_input
    as numpy array of dict(str -> ndarray) type.

    Args:
        input_numpy_features_dict: A tensor or numpy array

    Returns:
        A slice (limit `INPUT_EXAMPLE_SAMPLE_ROWS`)  of the input of same type as next_input.
        Returns `None` if the type of `input_numpy_features_dict` is unsupported.

    Examples
    --------
    when next_input is dict:
    >>> input_data = {"a": np.array([1, 2, 3, 4, 5, 6, 7, 8])}
    >>> _extract_sample_numpy_dict(input_data)
    {'a': array([1, 2, 3, 4, 5])}

    """
    sliced_data_as_numpy = None
    if isinstance(input_numpy_features_dict, dict):
        sliced_data_as_numpy = {
            k: _extract_input_example_from_tensor_or_ndarray(v)
            for k, v in input_numpy_features_dict.items()
        }
    return sliced_data_as_numpy


def _extract_input_example_from_batched_tf_dataset(
    dataset: tensorflow.data.Dataset,
) -> np.ndarray | dict[str, np.ndarray]:
    """
    Extracts sample feature tensors from the input dataset as numpy array.
    Input Dataset's tensors must contain tuple of (features, labels) that are
    used for tensorflow/keras train or fit methods


    Args:
        dataset: a tensorflow batched/unbatched dataset representing tuple of (features, labels)

    Returns:
        a numpy array of length `INPUT_EXAMPLE_SAMPLE_ROWS`
        Returns `None` if the type of `dataset` slices are unsupported.

    Examples
    --------
    >>> input_dataset = tensorflow.data.Dataset.from_tensor_slices(
    ...     (
    ...         {
    ...             "SepalLength": np.array(list(range(0, 20))),
    ...             "SepalWidth": np.array(list(range(0, 20))),
    ...             "PetalLength": np.array(list(range(0, 20))),
    ...             "PetalWidth": np.array(list(range(0, 20))),
    ...         },
    ...         np.array(list(range(0, 20))),
    ...     )
    ... ).batch(10)
    >>> _extract_input_example_from_batched_tf_dataset(input_dataset)
    {'SepalLength': array([0, 1, 2, 3, 4]),
    'SepalWidth': array([0, 1, 2, 3, 4]),
    'PetalLength': array([0, 1, 2, 3, 4]),
    'PetalWidth': array([0, 1, 2, 3, 4])}

    """
    limited_df_iter = list(dataset.take(INPUT_EXAMPLE_SAMPLE_ROWS))
    first_batch = limited_df_iter[0]
    input_example_slice = None
    if isinstance(first_batch, tuple):
        features = first_batch[0]
        if isinstance(features, dict):
            input_example_slice = _extract_sample_numpy_dict(features)
        elif isinstance(features, (np.ndarray, tensorflow.Tensor)):
            input_example_slice = _extract_input_example_from_tensor_or_ndarray(features)
    return input_example_slice


def extract_input_example_from_tf_input_fn(input_fn):
    """
    Extracts sample data from dict (str -> ndarray),
    ``tensorflow.Tensor`` or ``tensorflow.data.Dataset`` type.

    Args:
        input_fn: Tensorflow's input function used for train method

    Returns:
        A slice (of limit ``mlflow.utils.autologging_utils.INPUT_EXAMPLE_SAMPLE_ROWS``)
        of the input of type `np.ndarray`.
        Returns `None` if the return type of ``input_fn`` is unsupported.
    """

    input_training_data = input_fn()
    input_features = None
    if isinstance(input_training_data, tuple):
        features = input_training_data[0]
        if isinstance(features, dict):
            input_features = _extract_sample_numpy_dict(features)
        elif isinstance(features, (np.ndarray, tensorflow.Tensor)):
            input_features = _extract_input_example_from_tensor_or_ndarray(features)
    elif isinstance(input_training_data, tensorflow.data.Dataset):
        input_features = _extract_input_example_from_batched_tf_dataset(input_training_data)
    return input_features


def extract_tf_keras_input_example(input_training_data):
    """
    Generates a sample ndarray or dict (str -> ndarray)
    from the input type 'x' for keras ``fit`` or ``fit_generator``

    Args:
        input_training_data: Keras input function used for ``fit`` or ``fit_generator`` methods.

    Returns:
        a slice of type ndarray or
        dict (str -> ndarray) limited to
        ``mlflow.utils.autologging_utils.INPUT_EXAMPLE_SAMPLE_ROWS``.
        Throws ``MlflowException`` exception, if input_training_data is unsupported.
        Returns `None` if the type of input_training_data is unsupported.
    """
    input_data_slice = None
    if isinstance(input_training_data, tensorflow.keras.utils.Sequence):
        input_training_data = input_training_data[:][0]

    if isinstance(input_training_data, (np.ndarray, tensorflow.Tensor)):
        input_data_slice = _extract_input_example_from_tensor_or_ndarray(input_training_data)
    elif isinstance(input_training_data, dict):
        input_data_slice = _extract_sample_numpy_dict(input_training_data)
    elif isinstance(input_training_data, tensorflow.data.Dataset):
        input_data_slice = _extract_input_example_from_batched_tf_dataset(input_training_data)
    return input_data_slice
```

--------------------------------------------------------------------------------

````
