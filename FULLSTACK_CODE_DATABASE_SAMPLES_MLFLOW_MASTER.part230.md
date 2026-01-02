---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 230
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 230 of 991)

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

---[FILE: ag2_logger.py]---
Location: mlflow-master/mlflow/ag2/ag2_logger.py

```python
import functools
import logging
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from autogen import Agent, ConversableAgent
from autogen.logger.base_logger import BaseLogger
from openai.types.chat import ChatCompletion

from mlflow.entities.span import NoOpSpan, Span, SpanType
from mlflow.entities.span_event import SpanEvent
from mlflow.entities.span_status import SpanStatus, SpanStatusCode
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.fluent import start_span_no_context
from mlflow.tracing.utils import capture_function_input_args
from mlflow.utils.autologging_utils import autologging_is_disabled
from mlflow.utils.autologging_utils.safety import safe_patch

# For GroupChat, a single "received_message" events are passed around multiple
# internal layers and thus too verbose if we show them all. Therefore we ignore
# some of the message senders listed below.
_EXCLUDED_MESSAGE_SENDERS = ["chat_manager", "checking_agent"]

_logger = logging.getLogger(__name__)


FLAVOR_NAME = "ag2"


@dataclass
class _PendingSpan:
    """A span waiting for parent relocation, with its end data stored."""

    span: Span
    outputs: Any
    end_time_ns: int


@dataclass
class ChatState:
    """
    Represents the state of a chat session.
    """

    # The root span object that scopes the entire single chat session. All spans
    # such as LLM, function calls, in the chat session should be children of this span.
    session_span: Span | None = None
    # The last message object in the chat session.
    last_message: Any | None = None
    # The timestamp (ns) of the last message in the chat session.
    last_message_timestamp: int = 0
    # LLM/Tool Spans created after the last message in the chat session.
    # We consider them as operations for generating the next message and
    # re-locate them under the corresponding message span.
    # These spans are not ended yet to avoid premature export before parent relocation.
    pending_spans: list[_PendingSpan] = field(default_factory=list)

    def clear(self):
        self.session_span = None
        self.last_message = None
        self.last_message_timestamp = 0
        self.pending_spans = []


def _catch_exception(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            _logger.error(f"Error occurred during AutoGen tracing: {e}")

    return wrapper


class MlflowAg2Logger(BaseLogger):
    def __init__(self):
        self._chat_state = ChatState()

    def start(self) -> str:
        return "session_id"

    @_catch_exception
    def log_new_agent(self, agent: ConversableAgent, init_args: dict[str, Any]) -> None:
        """
        This handler is called whenever a new agent instance is created.
        Here we patch the agent's methods to start and end a trace around its chat session.
        """
        # TODO: Patch generate_reply() method as well
        if hasattr(agent, "initiate_chat"):
            safe_patch(
                FLAVOR_NAME,
                agent.__class__,
                "initiate_chat",
                # Setting root_only = True because sometimes compounded agent calls initiate_chat()
                # method of its sub-agents, which should not start a new trace.
                self._get_patch_function(root_only=True),
            )
        if hasattr(agent, "register_function"):

            def patched(original, _self, function_map, **kwargs):
                original(_self, function_map, **kwargs)
                # Wrap the newly registered tools to start and end a span around its invocation.
                for name, f in function_map.items():
                    if f is not None:
                        _self._function_map[name] = functools.partial(
                            self._get_patch_function(span_type=SpanType.TOOL), f
                        )

            safe_patch(FLAVOR_NAME, agent.__class__, "register_function", patched)

    def _get_patch_function(self, span_type: str = SpanType.UNKNOWN, root_only: bool = False):
        """
        Patch a function to start and end a span around its invocation.

        Args:
            f: The function to patch.
            span_name: The name of the span. If None, the function name is used.
            span_type: The type of the span. Default is SpanType.UNKNOWN.
            root_only: If True, only create a span if it is the root of the chat session.
                When there is an existing root span for the chat session, the function will
                not create a new span.
        """

        def _wrapper(original, *args, **kwargs):
            # If autologging is disabled, just run the original function. This is a safety net to
            # prevent patching side effects from being effective after autologging is disabled.
            if autologging_is_disabled(FLAVOR_NAME):
                return original(*args, **kwargs)

            if self._chat_state.session_span is None:
                # Create the trace per chat session
                span = start_span_no_context(
                    name=original.__name__,
                    span_type=span_type,
                    inputs=capture_function_input_args(original, args, kwargs),
                    attributes={SpanAttributeKey.MESSAGE_FORMAT: "ag2"},
                )
                self._chat_state.session_span = span
                try:
                    result = original(*args, **kwargs)
                except Exception as e:
                    result = None
                    self._record_exception(span, e)
                    raise e
                finally:
                    # End any pending spans before ending the session
                    # This ensures they get exported even if an error occurred
                    for pending in self._chat_state.pending_spans:
                        pending.span.end(outputs=pending.outputs, end_time_ns=pending.end_time_ns)

                    span.end(outputs=result)
                    # Clear the state to start a new chat session
                    self._chat_state.clear()
            elif not root_only:
                span = self._start_span_in_session(
                    name=original.__name__,
                    span_type=span_type,
                    inputs=capture_function_input_args(original, args, kwargs),
                )
                try:
                    result = original(*args, **kwargs)
                except Exception as e:
                    result = None
                    self._record_exception(span, e)
                    raise e
                finally:
                    # Don't end the span yet - defer ending until after parent relocation
                    # to avoid premature export with incorrect parent_id
                    end_time_ns = time.time_ns()
                    self._chat_state.pending_spans.append(_PendingSpan(span, result, end_time_ns))
            else:
                result = original(*args, **kwargs)
            return result

        return _wrapper

    def _record_exception(self, span: Span, e: Exception):
        try:
            span.set_status(SpanStatus(SpanStatusCode.ERROR, str(e)))
            span.add_event(SpanEvent.from_exception(e))
        except Exception as e:
            _logger.warning(
                "Failed to record exception in span.", exc_info=_logger.isEnabledFor(logging.DEBUG)
            )

    def _start_span_in_session(
        self,
        name: str,
        span_type: str,
        inputs: dict[str, Any],
        attributes: dict[str, Any] | None = None,
        start_time_ns: int | None = None,
    ) -> Span:
        """
        Start a span in the current chat session.
        """
        if self._chat_state.session_span is None:
            _logger.warning("Failed to start span. No active chat session.")
            return NoOpSpan()

        # Add MESSAGE_FORMAT attribute for AG2 spans
        attributes = attributes or {}
        attributes[SpanAttributeKey.MESSAGE_FORMAT] = "ag2"

        return start_span_no_context(
            # Tentatively set the parent ID to the session root span, because we
            # cannot create a span without a parent span (otherwise it will start
            # a new trace). The actual parent will be determined once the chat
            # message is received.
            parent_span=self._chat_state.session_span,
            name=name,
            span_type=span_type,
            inputs=inputs,
            attributes=attributes,
            start_time_ns=start_time_ns,
        )

    @_catch_exception
    def log_event(self, source: str | Agent, name: str, **kwargs: dict[str, Any]):
        event_end_time = time.time_ns()
        if name == "received_message":
            if (self._chat_state.last_message is not None) and (
                kwargs.get("sender") not in _EXCLUDED_MESSAGE_SENDERS
            ):
                span = self._start_span_in_session(
                    name=kwargs["sender"],
                    # Last message is recorded as the input of the next message
                    inputs=self._chat_state.last_message,
                    span_type=SpanType.AGENT,
                    start_time_ns=self._chat_state.last_message_timestamp,
                )
                # Re-locate the pending spans under this message span BEFORE ending them
                # This ensures spans are exported with the correct parent_id
                for pending in self._chat_state.pending_spans:
                    pending.span._span._parent = span._span.context
                    # Now end the span with its stored outputs and end_time
                    pending.span.end(outputs=pending.outputs, end_time_ns=pending.end_time_ns)
                self._chat_state.pending_spans = []

                # End the message span after all children have been relocated and ended
                span.end(outputs=kwargs, end_time_ns=event_end_time)

            self._chat_state.last_message = kwargs
            self._chat_state.last_message_timestamp = event_end_time

    @_catch_exception
    def log_chat_completion(
        self,
        invocation_id: uuid.UUID,
        client_id: int,
        wrapper_id: int,
        source: str | Agent,
        request: dict[str, float | str | list[dict[str, str]]],
        response: str | ChatCompletion,
        is_cached: int,
        cost: float,
        start_time: str,
    ) -> None:
        # The start_time passed from AutoGen is in UTC timezone.
        start_dt = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S.%f")
        start_dt = start_dt.replace(tzinfo=timezone.utc)
        start_time_ns = int(start_dt.timestamp() * 1e9)
        span = self._start_span_in_session(
            name="chat_completion",
            span_type=SpanType.LLM,
            inputs=request,
            attributes={
                "source": source,
                "client_id": client_id,
                "invocation_id": invocation_id,
                "wrapper_id": wrapper_id,
                "cost": cost,
                "is_cached": is_cached,
            },
            start_time_ns=start_time_ns,
        )
        if usage := self._parse_usage(response):
            span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)

        # Defer ending until after parent relocation
        # to avoid premature export with incorrect parent_id
        end_time_ns = time.time_ns()
        self._chat_state.pending_spans.append(_PendingSpan(span, response, end_time_ns))

    def _parse_usage(self, output: Any) -> dict[str, int] | None:
        usage = getattr(output, "usage", None)
        if usage is None:
            return None
        input_tokens = usage.prompt_tokens
        output_tokens = usage.completion_tokens
        total_tokens = usage.total_tokens
        if total_tokens is None and None not in (input_tokens, output_tokens):
            total_tokens = input_tokens + output_tokens
        return {
            TokenUsageKey.INPUT_TOKENS: input_tokens,
            TokenUsageKey.OUTPUT_TOKENS: output_tokens,
            TokenUsageKey.TOTAL_TOKENS: total_tokens,
        }

    # The following methods are not used but are required to implement the BaseLogger interface.
    @_catch_exception
    def log_function_use(self, *args: Any, **kwargs: Any):
        pass

    @_catch_exception
    def log_new_wrapper(self, wrapper, init_args):
        pass

    @_catch_exception
    def log_new_client(self, client, wrapper, init_args):
        pass

    @_catch_exception
    def stop(self) -> None:
        pass

    @_catch_exception
    def get_connection(self):
        pass
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/ag2/__init__.py

```python
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration

FLAVOR_NAME = "ag2"


def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from ag2 to MLflow. Currently, MLflow
    only supports tracing for ag2 agents.

    Args:
        log_traces: If ``True``, traces are logged for AG2 agents by using runtime logging.
            If ``False``, no traces are collected during inference. Default to ``True``.
        disable: If ``True``, disables the AG2 autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during AG2
            autologging. If ``False``, show all events and warnings.
    """
    from autogen import runtime_logging

    from mlflow.ag2.ag2_logger import MlflowAg2Logger

    # NB: The @autologging_integration annotation is used for adding shared logic. However, one
    # caveat is that the wrapped function is NOT executed when disable=True is passed. This prevents
    # us from running cleaning up logging when autologging is turned off. To workaround this, we
    # annotate _autolog() instead of this entrypoint, and define the cleanup logic outside it.
    # TODO: since this implementation is inconsistent, explore a universal way to solve the issue.
    if log_traces and not disable:
        runtime_logging.start(logger=MlflowAg2Logger())
    else:
        runtime_logging.stop()

    _autolog(log_traces=log_traces, disable=disable, silent=silent)


# This is required by mlflow.autolog()
autolog.integration_name = FLAVOR_NAME


@autologging_integration(FLAVOR_NAME)
def _autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    This is a dummy function only for the purpose of adding the autologging_integration annotation.
    We cannot add the annotation directly to the autolog() function above due to the reason
    mentioned in the comment above. Note that this function MUST declare the same signature as the
    autolog(), otherwise the annotation will not work properly.
    """
    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )
```

--------------------------------------------------------------------------------

---[FILE: autolog_v1.py]---
Location: mlflow-master/mlflow/agno/autolog_v1.py

```python
"""
Autologging logic for Agno V1 using MLflow's tracing API.
"""

import logging
from typing import Any

import mlflow
from mlflow.entities import SpanType
from mlflow.entities.span import LiveSpan
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.utils import construct_full_inputs
from mlflow.utils.autologging_utils.config import AutoLoggingConfig

FLAVOR_NAME = "agno"
_logger = logging.getLogger(__name__)


def _compute_span_name(instance, original) -> str:
    try:
        from agno.tools.function import FunctionCall

        if isinstance(instance, FunctionCall):
            tool_name = None
            for attr in ["function_name", "name", "tool_name"]:
                if val := getattr(instance, attr, None):
                    return val
            if not tool_name and hasattr(instance, "function"):
                underlying_fn = getattr(instance, "function")
                for attr in ["name", "__name__", "function_name"]:
                    if val := getattr(underlying_fn, attr, None):
                        return val
            if not tool_name:
                return "AgnoToolCall"

    except ImportError:
        pass

    return f"{instance.__class__.__name__}.{original.__name__}"


def _parse_tools(tools) -> list[dict[str, Any]]:
    result = []
    for tool in tools or []:
        try:
            if data := tool.model_dumps(exclude_none=True):
                result.append({"type": "function", "function": data})
        except Exception:
            # Fallback to string representation
            result.append({"name": str(tool)})
    return result


def _get_agent_attributes(instance) -> dict[str, Any]:
    agent_attr: dict[str, Any] = {}
    for key, value in instance.__dict__.items():
        if key == "tools":
            value = _parse_tools(value)
        if value is not None:
            agent_attr[key] = value
    return agent_attr


def _get_tools_attribute(instance) -> dict[str, Any]:
    return {
        key: val
        for key, val in vars(instance.function).items()
        if not key.startswith("_") and val is not None
    }


def _set_span_inputs_attributes(span: LiveSpan, instance: Any, raw_inputs: dict[str, Any]) -> None:
    try:
        from agno.agent import Agent
        from agno.team import Team

        if isinstance(instance, (Agent, Team)):
            span.set_attributes(_get_agent_attributes(instance))
            # Filter out None values from inputs because Agent/Team's
            # run method has so many optional arguments.
            span.set_inputs({k: v for k, v in raw_inputs.items() if v is not None})
            return
    except Exception as exc:  # pragma: no cover
        _logger.debug("Unable to attach agent attributes: %s", exc)

    try:
        from agno.tools.function import FunctionCall

        if isinstance(instance, FunctionCall):
            span.set_inputs(instance.arguments)
            if tool_data := _get_tools_attribute(instance):
                span.set_attributes(tool_data)
            return
    except Exception as exc:  # pragma: no cover
        _logger.debug("Unable to set function attrcalling inputs and attributes: %s", exc)

    try:
        from agno.models.message import Message

        if (
            (messages := raw_inputs.get("messages"))
            and isinstance(messages, list)
            and all(isinstance(m, Message) for m in messages)
        ):
            raw_inputs["messages"] = [m.to_dict() for m in messages]
            span.set_inputs(raw_inputs)
            return
    except Exception as exc:  # pragma: no cover
        _logger.debug("Unable to parse input message: %s", exc)

    span.set_inputs(raw_inputs)


def _get_span_type(instance) -> str:
    try:
        from agno.agent import Agent
        from agno.models.base import Model
        from agno.storage.base import Storage
        from agno.team import Team
        from agno.tools.function import FunctionCall

    except ImportError:
        return SpanType.UNKNOWN
    if isinstance(instance, (Agent, Team)):
        return SpanType.AGENT
    if isinstance(instance, FunctionCall):
        return SpanType.TOOL
    if isinstance(instance, Storage):
        return SpanType.MEMORY
    if isinstance(instance, Model):
        return SpanType.LLM
    return SpanType.UNKNOWN


def _parse_usage(result) -> dict[str, int] | None:
    usage = getattr(result, "metrics", None) or getattr(result, "session_metrics", None)
    if not usage:
        return None

    return {
        TokenUsageKey.INPUT_TOKENS: sum(usage.get("input_tokens")),
        TokenUsageKey.OUTPUT_TOKENS: sum(usage.get("output_tokens")),
        TokenUsageKey.TOTAL_TOKENS: sum(usage.get("total_tokens")),
    }


def _set_span_outputs(span: LiveSpan, result: Any) -> None:
    from agno.run.response import RunResponse
    from agno.run.team import TeamRunResponse

    if isinstance(result, (RunResponse, TeamRunResponse)):
        span.set_outputs(result.to_dict())
    else:
        span.set_outputs(result)

    if usage := _parse_usage(result):
        span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)


async def patched_async_class_call(original, self, *args, **kwargs):
    cfg = AutoLoggingConfig.init(flavor_name=FLAVOR_NAME)
    if not cfg.log_traces:
        return await original(self, *args, **kwargs)

    span_name = _compute_span_name(self, original)
    span_type = _get_span_type(self)

    with mlflow.start_span(name=span_name, span_type=span_type) as span:
        raw_inputs = construct_full_inputs(original, self, *args, **kwargs)
        _set_span_inputs_attributes(span, self, raw_inputs)

        result = await original(self, *args, **kwargs)

        _set_span_outputs(span, result)
        return result


def patched_class_call(original, self, *args, **kwargs):
    cfg = AutoLoggingConfig.init(flavor_name=FLAVOR_NAME)
    if not cfg.log_traces:
        return original(self, *args, **kwargs)

    span_name = _compute_span_name(self, original)
    span_type = _get_span_type(self)

    with mlflow.start_span(name=span_name, span_type=span_type) as span:
        raw_inputs = construct_full_inputs(original, self, *args, **kwargs)
        _set_span_inputs_attributes(span, self, raw_inputs)

        result = original(self, *args, **kwargs)

        _set_span_outputs(span, result)
        return result
```

--------------------------------------------------------------------------------

---[FILE: autolog_v2.py]---
Location: mlflow-master/mlflow/agno/autolog_v2.py

```python
"""
Autologging logic for Agno V2 (>= 2.0.0) using OpenTelemetry instrumentation.
"""

import importlib.metadata as _meta
import logging

from packaging.version import Version

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.tracing.utils.otlp import MLFLOW_EXPERIMENT_ID_HEADER

_logger = logging.getLogger(__name__)
_agno_instrumentor = None


# AGNO SDK doesn't provide version parameter from 1.7.1 onwards. Hence we capture the
# latest version manually

try:
    import agno

    if not hasattr(agno, "__version__"):
        try:
            agno.__version__ = _meta.version("agno")
        except _meta.PackageNotFoundError:
            agno.__version__ = "1.7.7"
except ImportError:
    pass


def _is_agno_v2() -> bool:
    """Check if Agno V2 (>= 2.0.0) is installed."""
    try:
        return Version(_meta.version("agno")).major >= 2
    except _meta.PackageNotFoundError:
        return False


def _setup_otel_instrumentation() -> None:
    """Set up OpenTelemetry instrumentation for Agno V2."""
    global _agno_instrumentor

    if _agno_instrumentor is not None:
        _logger.debug("OpenTelemetry instrumentation already set up for Agno V2")
        return

    try:
        from openinference.instrumentation.agno import AgnoInstrumentor
        from opentelemetry import trace
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor

        from mlflow.tracking.fluent import _get_experiment_id

        tracking_uri = mlflow.get_tracking_uri()

        tracking_uri = tracking_uri.rstrip("/")
        endpoint = f"{tracking_uri}/v1/traces"

        experiment_id = _get_experiment_id()

        exporter = OTLPSpanExporter(
            endpoint=endpoint, headers={MLFLOW_EXPERIMENT_ID_HEADER: experiment_id}
        )

        tracer_provider = trace.get_tracer_provider()
        if not isinstance(tracer_provider, TracerProvider):
            tracer_provider = TracerProvider()
            trace.set_tracer_provider(tracer_provider)

        tracer_provider.add_span_processor(BatchSpanProcessor(exporter))

        _agno_instrumentor = AgnoInstrumentor()
        _agno_instrumentor.instrument()
        _logger.debug("OpenTelemetry instrumentation enabled for Agno V2")

    except ImportError as exc:
        raise MlflowException(
            "Failed to set up OpenTelemetry instrumentation for Agno V2. "
            "Please install the following required packages: "
            "'pip install opentelemetry-exporter-otlp openinference-instrumentation-agno'. "
        ) from exc
    except Exception as exc:
        _logger.warning("Failed to set up OpenTelemetry instrumentation for Agno V2: %s", exc)


def _uninstrument_otel() -> None:
    """Uninstrument OpenTelemetry for Agno V2."""
    global _agno_instrumentor

    try:
        if _agno_instrumentor is not None:
            _agno_instrumentor.uninstrument()
            _agno_instrumentor = None
            _logger.debug("OpenTelemetry instrumentation disabled for Agno V2")
        else:
            _logger.warning("Instrumentor instance not found, cannot uninstrument")
    except Exception as exc:
        _logger.warning("Failed to uninstrument Agno V2: %s", exc)
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/agno/utils.py

```python
import importlib
import logging
import pkgutil

from agno.models.base import Model
from agno.storage.base import Storage

_logger = logging.getLogger(__name__)


def discover_storage_backends():
    # 1. Import all storage modules
    import agno.storage as pkg

    for _, modname, _ in pkgutil.iter_modules(pkg.__path__):
        try:
            importlib.import_module(f"{pkg.__name__}.{modname}")
        except ImportError as e:
            _logger.debug(f"Failed to import {modname}: {e}")
            continue

    # 2. Recursively collect subclasses
    def all_subclasses(cls):
        for sub in cls.__subclasses__():
            yield sub
            yield from all_subclasses(sub)

    return list(all_subclasses(Storage))


def find_model_subclasses():
    # 1. Import all Model modules
    import agno.models as pkg

    for _, modname, _ in pkgutil.iter_modules(pkg.__path__):
        try:
            importlib.import_module(f"{pkg.__name__}.{modname}")
        except ImportError as e:
            _logger.debug(f"Failed to import {modname}: {e}")
            continue

    # 2. Recursively collect subclasses
    def all_subclasses(cls):
        for sub in cls.__subclasses__():
            yield sub
            yield from all_subclasses(sub)

    models = list(all_subclasses(Model))
    # Sort so that more specific classes are patched before their bases
    models.sort(key=lambda c: len(c.__mro__), reverse=True)
    return models
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/agno/__init__.py

```python
import inspect
import logging

from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.annotations import experimental
from mlflow.utils.autologging_utils import autologging_integration, safe_patch

FLAVOR_NAME = "agno"
_logger = logging.getLogger(__name__)


@experimental(version="3.3.0")
def autolog(*, log_traces: bool = True, disable: bool = False, silent: bool = False) -> None:
    """
    Enables (or disables) and configures autologging from Agno to MLflow.

    For Agno V2 (>= 2.0.0), this uses OpenTelemetry instrumentation via OpenInference.

    Args:
        log_traces: If ``True``, traces are logged for Agno Agents.
        disable: If ``True``, disables Agno autologging.
        silent: If ``True``, suppresses all MLflow event logs and warnings.
    """
    from mlflow.agno.autolog_v1 import patched_async_class_call, patched_class_call
    from mlflow.agno.autolog_v2 import _is_agno_v2, _setup_otel_instrumentation, _uninstrument_otel

    # NB: The @autologging_integration annotation is used for adding shared logic. However, one
    # caveat is that the wrapped function is NOT executed when disable=True is passed. This prevents
    # us from running cleaning up logging when autologging is turned off. To workaround this, we
    # annotate _autolog() instead of this entrypoint, and define the cleanup logic outside it.
    # This needs to be called before doing any safe-patching (otherwise safe-patch will be no-op).
    _autolog(log_traces=log_traces, disable=disable, silent=silent)

    # Check if Agno V2 is installed
    if _is_agno_v2():
        _logger.debug("Detected Agno V2, using OpenTelemetry instrumentation")
        if disable or not log_traces:
            _uninstrument_otel()
        else:
            _setup_otel_instrumentation()
        _record_event(
            AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
        )
        return

    # For Agno V1, use the existing patching method
    from mlflow.agno.utils import discover_storage_backends, find_model_subclasses

    class_map = {
        "agno.agent.Agent": ["run", "arun"],
        "agno.team.Team": ["run", "arun"],
        "agno.tools.function.FunctionCall": ["execute", "aexecute"],
    }

    if storages := discover_storage_backends():
        class_map.update(
            {
                cls.__module__ + "." + cls.__name__: [
                    "create",
                    "read",
                    "upsert",
                    "drop",
                    "upgrade_schema",
                ]
                for cls in storages
            }
        )

    if models := find_model_subclasses():
        class_map.update(
            {
                # TODO: Support streaming
                cls.__module__ + "." + cls.__name__: ["invoke", "ainvoke"]
                for cls in models
            }
        )

    for cls_path, methods in class_map.items():
        mod_name, cls_name = cls_path.rsplit(".", 1)
        try:
            module = __import__(mod_name, fromlist=[cls_name])
            cls = getattr(module, cls_name)
        except (ImportError, AttributeError) as exc:
            _logger.debug("Agno autologging: failed to import %s – %s", cls_path, exc)
            continue

        for method_name in methods:
            try:
                original = getattr(cls, method_name)
                wrapper = (
                    patched_async_class_call
                    if inspect.iscoroutinefunction(original)
                    else patched_class_call
                )
                safe_patch(FLAVOR_NAME, cls, method_name, wrapper)
            except AttributeError as exc:
                _logger.debug(
                    "Agno autologging: cannot patch %s.%s – %s", cls_path, method_name, exc
                )

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )


# This is required by mlflow.autolog()
autolog.integration_name = FLAVOR_NAME


@autologging_integration(FLAVOR_NAME)
def _autolog(
    log_traces: bool,
    disable: bool = False,
    silent: bool = False,
):
    pass
```

--------------------------------------------------------------------------------

---[FILE: ai_command_utils.py]---
Location: mlflow-master/mlflow/ai_commands/ai_command_utils.py

```python
"""Core module for managing MLflow commands."""

import os
import re
from pathlib import Path
from typing import Any

import yaml


def parse_frontmatter(content: str) -> tuple[dict[str, Any], str]:
    """Parse frontmatter from markdown content.

    Args:
        content: Markdown content with optional YAML frontmatter.

    Returns:
        Tuple of (metadata dict, body content).
    """
    if not content.startswith("---"):
        return {}, content

    match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if not match:
        return {}, content

    try:
        metadata = yaml.safe_load(match.group(1)) or {}
    except yaml.YAMLError:
        # If YAML parsing fails, return empty metadata
        return {}, content

    body = match.group(2)
    return metadata, body


def list_commands(namespace: str | None = None) -> list[dict[str, Any]]:
    """List all available commands with metadata.

    Args:
        namespace: Optional namespace to filter commands.

    Returns:
        List of command dictionaries with keys: key, namespace, description.
    """
    # We're in mlflow/commands/core.py, so parent is mlflow/commands/
    commands_dir = Path(__file__).parent
    commands = []

    if not commands_dir.exists():
        return commands

    for md_file in commands_dir.glob("**/*.md"):
        try:
            content = md_file.read_text()
            metadata, _ = parse_frontmatter(content)

            # Build command key from path (e.g., genai/analyze_experiment)
            relative_path = md_file.relative_to(commands_dir)
            # Use forward slashes consistently across platforms
            command_key = str(relative_path.with_suffix("")).replace(os.sep, "/")

            # Filter by namespace if specified
            if namespace and not command_key.startswith(f"{namespace}/"):
                continue

            commands.append(
                {
                    "key": command_key,
                    "namespace": metadata.get("namespace", ""),
                    "description": metadata.get("description", "No description"),
                }
            )
        except Exception:
            # Skip files that can't be read or parsed
            continue

    return sorted(commands, key=lambda x: x["key"])


def get_command(key: str) -> str:
    """Get command content by key.

    Args:
        key: Command key (e.g., 'genai/analyze_experiment').

    Returns:
        Full markdown content of the command.

    Raises:
        FileNotFoundError: If command not found.
    """
    # We're in mlflow/commands/core.py, so parent is mlflow/commands/
    commands_dir = Path(__file__).parent
    # Convert forward slashes to OS-specific separators for file path
    key_parts = key.split("/")
    command_path = commands_dir.joinpath(*key_parts).with_suffix(".md")

    if not command_path.exists():
        raise FileNotFoundError(f"Command '{key}' not found")

    return command_path.read_text()


def get_command_body(key: str) -> str:
    """Get command body content without frontmatter.

    Args:
        key: Command key (e.g., 'genai/analyze_experiment').

    Returns:
        Command body content without YAML frontmatter.

    Raises:
        FileNotFoundError: If command not found.
    """
    content = get_command(key)
    _, body = parse_frontmatter(content)
    return body
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/ai_commands/__init__.py

```python
"""CLI commands for managing MLflow AI commands."""

import click

from mlflow.ai_commands.ai_command_utils import (
    get_command,
    get_command_body,
    list_commands,
    parse_frontmatter,
)
from mlflow.telemetry.events import AiCommandRunEvent
from mlflow.telemetry.track import _record_event

__all__ = ["get_command", "get_command_body", "list_commands", "parse_frontmatter", "commands"]


@click.group("ai-commands")
def commands() -> None:
    """Manage MLflow AI commands for LLMs."""


@commands.command("list")
@click.option("--namespace", help="Filter commands by namespace")
def list_cmd(namespace: str | None) -> None:
    """List all available AI commands."""
    cmd_list = list_commands(namespace)

    if not cmd_list:
        if namespace:
            click.echo(f"No AI commands found in namespace '{namespace}'")
        else:
            click.echo("No AI commands found")
        return

    for cmd in cmd_list:
        click.echo(f"{cmd['key']}: {cmd['description']}")


@commands.command("get")
@click.argument("key")
def get_cmd(key: str) -> None:
    """Get a specific AI command by key."""
    try:
        content = get_command(key)
        click.echo(content)
    except FileNotFoundError as e:
        click.echo(f"Error: {e}", err=True)
        raise click.Abort()


@commands.command("run")
@click.argument("key")
def run_cmd(key: str) -> None:
    """Get a command formatted for execution by an AI assistant."""
    try:
        _record_event(AiCommandRunEvent, {"command_key": key, "context": "cli"})

        content = get_command(key)
        _, body = parse_frontmatter(content)

        # Add prefix instructing the assistant to execute the workflow
        prefix = (
            "The user has run an MLflow AI command via CLI. "
            "Start executing the workflow immediately without any preamble.\n\n"
        )

        click.echo(prefix + body)
    except FileNotFoundError as e:
        click.echo(f"Error: {e}", err=True)
        raise click.Abort()
```

--------------------------------------------------------------------------------

````
