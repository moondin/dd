---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 942
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 942 of 991)

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

---[FILE: test_uc_prompt_utils.py]---
Location: mlflow-master/tests/store/_unity_catalog/registry/test_uc_prompt_utils.py

```python
import json

from mlflow.entities.model_registry.prompt import Prompt
from mlflow.entities.model_registry.prompt_version import PromptVersion
from mlflow.prompt.constants import (
    PROMPT_TYPE_TAG_KEY,
    PROMPT_TYPE_TEXT,
    RESPONSE_FORMAT_TAG_KEY,
)
from mlflow.protos.unity_catalog_prompt_messages_pb2 import (
    Prompt as ProtoPrompt,
)
from mlflow.protos.unity_catalog_prompt_messages_pb2 import (
    PromptTag as ProtoPromptTag,
)
from mlflow.protos.unity_catalog_prompt_messages_pb2 import (
    PromptVersion as ProtoPromptVersion,
)
from mlflow.protos.unity_catalog_prompt_messages_pb2 import (
    PromptVersionTag as ProtoPromptVersionTag,
)
from mlflow.store._unity_catalog.registry.utils import (
    mlflow_prompt_to_proto,
    mlflow_tags_to_proto,
    mlflow_tags_to_proto_version_tags,
    proto_info_to_mlflow_prompt_info,
    proto_to_mlflow_prompt,
    proto_to_mlflow_tags,
    proto_version_tags_to_mlflow_tags,
)


def test_proto_to_mlflow_tags():
    # Test with empty tags
    assert proto_to_mlflow_tags([]) == {}

    # Test with tags
    proto_tags = [
        ProtoPromptTag(key="key1", value="value1"),
        ProtoPromptTag(key="key2", value="value2"),
    ]
    expected = {"key1": "value1", "key2": "value2"}
    assert proto_to_mlflow_tags(proto_tags) == expected

    # Test with None
    assert proto_to_mlflow_tags(None) == {}


def test_mlflow_tags_to_proto():
    # Test with empty tags
    assert mlflow_tags_to_proto({}) == []

    # Test with tags
    tags = {"key1": "value1", "key2": "value2"}
    proto_tags = mlflow_tags_to_proto(tags)
    assert len(proto_tags) == 2
    assert all(isinstance(tag, ProtoPromptTag) for tag in proto_tags)
    assert {tag.key: tag.value for tag in proto_tags} == tags

    # Test with None
    assert mlflow_tags_to_proto(None) == []


def test_proto_info_to_mlflow_prompt_info():
    # Create test proto info
    proto_info = ProtoPrompt(
        name="test_prompt",
        description="Test prompt description",
        tags=[
            ProtoPromptTag(key="key1", value="value1"),
            ProtoPromptTag(key="key2", value="value2"),
        ],
    )

    # Test without prompt tags
    prompt_info = proto_info_to_mlflow_prompt_info(proto_info)
    assert isinstance(prompt_info, Prompt)
    assert prompt_info.name == "test_prompt"
    assert prompt_info.description == "Test prompt description"
    assert prompt_info.tags == {"key1": "value1", "key2": "value2"}

    # Test with additional prompt tags
    prompt_tags = {"tag1": "value1", "tag2": "value2"}
    prompt_info = proto_info_to_mlflow_prompt_info(proto_info, prompt_tags)
    expected_tags = {
        "key1": "value1",
        "key2": "value2",
        "tag1": "value1",
        "tag2": "value2",
    }
    assert prompt_info.tags == expected_tags


def test_proto_to_mlflow_prompt():
    # Test with version tags - the key behavior we care about
    proto_version = ProtoPromptVersion()
    proto_version.name = "test_prompt"
    proto_version.version = "1"
    proto_version.template = json.dumps("Hello {{name}}!")
    proto_version.description = "Test description"

    # Add version tags
    proto_version.tags.extend(
        [
            ProtoPromptVersionTag(key="env", value="production"),
            ProtoPromptVersionTag(key="author", value="alice"),
            ProtoPromptVersionTag(key=PROMPT_TYPE_TAG_KEY, value=PROMPT_TYPE_TEXT),
            ProtoPromptVersionTag(
                key=RESPONSE_FORMAT_TAG_KEY,
                value=json.dumps(
                    {
                        "type": "json_schema",
                        "json_schema": {
                            "name": "test_schema",
                            "schema": {
                                "type": "object",
                                "properties": {"name": {"type": "string"}},
                            },
                        },
                    }
                ),
            ),
        ]
    )

    result = proto_to_mlflow_prompt(proto_version)

    # The critical test: version tags should go to tags
    expected_tags = {"env": "production", "author": "alice"}
    assert result.template == "Hello {{name}}!"
    assert result.response_format == {
        "type": "json_schema",
        "json_schema": {
            "name": "test_schema",
            "schema": {"type": "object", "properties": {"name": {"type": "string"}}},
        },
    }
    assert result.tags == expected_tags

    # Test with no tags
    proto_no_tags = ProtoPromptVersion()
    proto_no_tags.name = "no_tags_prompt"
    proto_no_tags.version = "2"
    proto_no_tags.template = json.dumps("Simple template")

    result_no_tags = proto_to_mlflow_prompt(proto_no_tags)
    assert result_no_tags.tags == {}


def test_mlflow_prompt_to_proto():
    # Create test prompt (skip timestamp for simplicity)
    prompt = PromptVersion(
        name="test_prompt",
        version=1,
        template="Hello {{name}}!",
        commit_message="Test prompt",
        tags={"key1": "value1", "key2": "value2"},
        aliases=["production"],
    )

    # Convert to proto
    proto_version = mlflow_prompt_to_proto(prompt)

    # Verify conversion
    assert isinstance(proto_version, ProtoPromptVersion)
    assert proto_version.name == "test_prompt"
    assert proto_version.version == "1"
    assert proto_version.template == "Hello {{name}}!"
    assert proto_version.description == "Test prompt"
    tags_dict = {tag.key: tag.value for tag in proto_version.tags}
    assert tags_dict == {"key1": "value1", "key2": "value2"}

    # Test with empty fields
    prompt = PromptVersion(name="test_prompt", version=1, template="Hello {{name}}!")
    proto_version = mlflow_prompt_to_proto(prompt)
    assert len(proto_version.tags) == 0


def test_proto_version_tags_to_mlflow_tags():
    # Test with empty tags
    assert proto_version_tags_to_mlflow_tags([]) == {}

    # Test with version tags
    proto_tags = [
        ProtoPromptVersionTag(key="key1", value="value1"),
        ProtoPromptVersionTag(key="key2", value="value2"),
    ]
    expected = {"key1": "value1", "key2": "value2"}
    assert proto_version_tags_to_mlflow_tags(proto_tags) == expected

    # Test with None
    assert proto_version_tags_to_mlflow_tags(None) == {}


def test_mlflow_tags_to_proto_version_tags():
    # Test with empty tags
    assert mlflow_tags_to_proto_version_tags({}) == []

    # Test with tags
    tags = {"key1": "value1", "key2": "value2"}
    proto_tags = mlflow_tags_to_proto_version_tags(tags)
    assert len(proto_tags) == 2
    assert all(isinstance(tag, ProtoPromptVersionTag) for tag in proto_tags)
    assert {tag.key: tag.value for tag in proto_tags} == tags

    # Test with None
    assert mlflow_tags_to_proto_version_tags(None) == []
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/strands/conftest.py

```python
import pytest

import mlflow


@pytest.fixture(autouse=True)
def clear_autolog_state(reset_tracing):
    # Reset strands tracer singleton to clear cached tracer provider
    try:
        import strands.telemetry.tracer as strands_tracer

        strands_tracer._tracer_instance = None
    except Exception:
        pass

    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    for key in list(AUTOLOGGING_INTEGRATIONS.keys()):
        AUTOLOGGING_INTEGRATIONS[key].clear()
    mlflow.utils.import_hooks._post_import_hooks = {}
```

--------------------------------------------------------------------------------

---[FILE: test_strands_tracing.py]---
Location: mlflow-master/tests/strands/test_strands_tracing.py

```python
import json
from collections.abc import AsyncIterator, Sequence
from typing import Any

from strands import Agent
from strands.models.model import Model
from strands.tools.tools import PythonAgentTool

import mlflow
from mlflow.entities import SpanType
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.tracing.provider import trace_disabled

from tests.tracing.helper import get_traces


async def sum_tool(tool_use, **_):
    a = tool_use["input"]["a"]
    b = tool_use["input"]["b"]
    return {
        "toolUseId": tool_use["toolUseId"],
        "status": "success",
        "content": [{"json": a + b}],
    }


tool = PythonAgentTool(
    "sum",
    {
        "name": "sum",
        "description": "add numbers 1 2",
        "inputSchema": {
            "type": "object",
            "properties": {"a": {"type": "number"}, "b": {"type": "number"}},
            "required": ["a", "b"],
        },
    },
    sum_tool,
)


class DummyModel(Model):
    def __init__(self, response_text: str, in_tokens: int = 1, out_tokens: int = 1):
        self.response_text = response_text
        self.in_tokens = in_tokens
        self.out_tokens = out_tokens
        self.config = {}

    def update_config(self, **model_config):
        self.config.update(model_config)

    def get_config(self):
        return self.config

    async def structured_output(self, output_model, prompt, system_prompt=None, **kwargs):
        if False:
            yield {}

    async def stream(
        self,
        messages: Sequence[dict[str, Any]],
        tool_specs: Any | None = None,
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> AsyncIterator[dict[str, Any]]:
        yield {"messageStart": {"role": "assistant"}}
        yield {"contentBlockStart": {"start": {}}}
        yield {"contentBlockDelta": {"delta": {"text": self.response_text}}}
        yield {"contentBlockStop": {}}
        yield {"messageStop": {"stopReason": "end_turn"}}
        yield {
            "metadata": {
                "usage": {
                    "inputTokens": self.in_tokens,
                    "outputTokens": self.out_tokens,
                    "totalTokens": self.in_tokens + self.out_tokens,
                },
                "metrics": {"latencyMs": 0},
            }
        }


class ToolCallingModel(Model):
    def __init__(
        self,
        response_text: str,
        tool_input: dict[str, Any] | None = None,
        tool_name: str = "sum",
    ):
        self.response_text = response_text
        self.tool_input = tool_input or {"a": 1, "b": 2}
        self.tool_name = tool_name
        self.config = {}
        self._call_count = 0

    def update_config(self, **model_config: Any) -> None:
        self.config.update(model_config)

    def get_config(self) -> dict[str, object]:
        return self.config

    async def structured_output(
        self,
        output_model: Any,
        prompt: Any,
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> AsyncIterator[dict[str, Any]]:
        if False:
            yield {}

    async def stream(
        self,
        messages: Sequence[dict[str, Any]],
        tool_specs: Any | None = None,
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> AsyncIterator[dict[str, Any]]:
        if self._call_count == 0:
            self._call_count += 1
            yield {"messageStart": {"role": "assistant"}}
            yield {
                "contentBlockStart": {
                    "start": {
                        "toolUse": {
                            "toolUseId": "tool-1",
                            "name": self.tool_name,
                        }
                    }
                }
            }
            yield {
                "contentBlockDelta": {"delta": {"toolUse": {"input": json.dumps(self.tool_input)}}}
            }
            yield {"contentBlockStop": {}}
            yield {"messageStop": {"stopReason": "tool_use"}}
            yield {
                "metadata": {
                    "usage": {
                        "inputTokens": 1,
                        "outputTokens": 1,
                        "totalTokens": 2,
                    },
                    "metrics": {"latencyMs": 0},
                }
            }
        else:
            yield {"messageStart": {"role": "assistant"}}
            yield {"contentBlockStart": {"start": {}}}
            yield {"contentBlockDelta": {"delta": {"text": self.response_text}}}
            yield {"contentBlockStop": {}}
            yield {"messageStop": {"stopReason": "end_turn"}}
            yield {
                "metadata": {
                    "usage": {
                        "inputTokens": 1,
                        "outputTokens": 1,
                        "totalTokens": 2,
                    },
                    "metrics": {"latencyMs": 0},
                }
            }


def test_strands_autolog_single_trace():
    mlflow.strands.autolog()

    agent = Agent(model=DummyModel("hi", 1, 2), name="agent")
    agent("hello")

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    agent_span = next(span for span in spans if span.span_type == SpanType.AGENT)
    assert agent_span.inputs == [{"role": "user", "content": [{"text": "hello"}]}]
    assert agent_span.outputs.strip() == "hi"

    usage_spans = [span for span in spans if span.attributes.get(SpanAttributeKey.CHAT_USAGE)]
    assert usage_spans, "expected at least one child span recording token usage"
    assert usage_spans[0].attributes[SpanAttributeKey.CHAT_USAGE] == {
        "input_tokens": 1,
        "output_tokens": 2,
        "total_tokens": 3,
    }
    assert traces[0].info.token_usage == {
        "input_tokens": 1,
        "output_tokens": 2,
        "total_tokens": 3,
    }

    mlflow.strands.autolog(disable=True)
    agent("bye")
    assert len(get_traces()) == 1


def test_function_calling_creates_single_trace():
    mlflow.strands.autolog()

    agent = Agent(model=ToolCallingModel("3"), tools=[tool], name="agent")
    agent("add numbers 1 2 1 2")

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    agent_span = spans[0]
    assert agent_span.span_type == SpanType.AGENT
    tool_span = spans[3]
    assert tool_span.span_type == SpanType.TOOL
    assert agent_span.inputs == [{"role": "user", "content": [{"text": "add numbers 1 2 1 2"}]}]
    assert agent_span.outputs == 3
    assert tool_span.inputs == [{"role": "tool", "content": {"a": 1, "b": 2}}]
    assert tool_span.outputs == [{"json": 3}]


def test_multiple_agents_single_trace():
    mlflow.strands.autolog()

    agent2 = Agent(model=DummyModel("hi"), name="agent2")

    async def sum_and_call_agent2(
        tool_use: dict[str, Any],
        **_: Any,
    ) -> dict[str, Any]:
        a = tool_use["input"]["a"]
        b = tool_use["input"]["b"]
        await agent2.invoke_async("hello")
        return {
            "toolUseId": tool_use["toolUseId"],
            "status": "success",
            "content": [{"json": a + b}],
        }

    tool_with_agent2 = PythonAgentTool(
        "sum",
        {
            "name": "sum",
            "description": "add numbers 1 2",
            "inputSchema": {
                "type": "object",
                "properties": {"a": {"type": "number"}, "b": {"type": "number"}},
                "required": ["a", "b"],
            },
        },
        sum_and_call_agent2,
    )

    agent1 = Agent(model=ToolCallingModel("3"), tools=[tool_with_agent2], name="agent1")
    agent1("add numbers 1 2")

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    agent1_span = spans[0]
    assert agent1_span.name == "invoke_agent agent1"
    tool_span = spans[3]
    assert tool_span.span_type == SpanType.TOOL
    agent2_span = spans[4]
    assert agent2_span.name == "invoke_agent agent2"
    assert agent1_span.inputs == [{"role": "user", "content": [{"text": "add numbers 1 2"}]}]
    assert agent1_span.outputs == 3
    assert tool_span.inputs == [{"role": "tool", "content": {"a": 1, "b": 2}}]
    assert tool_span.outputs == [{"json": 3}]
    assert agent2_span.inputs == [{"role": "user", "content": [{"text": "hello"}]}]
    assert agent2_span.outputs.strip() == "hi"
    # top-level span should contain the sum of both the chat spans. this is set
    # when we translate the genai semantic conventions into mlflow attributes.
    assert agent1_span.attributes[SpanAttributeKey.CHAT_USAGE] == {
        "input_tokens": 2,
        "output_tokens": 2,
        "total_tokens": 4,
    }
    # agent2 span should contain the token usage for its single chat span
    assert agent2_span.attributes[SpanAttributeKey.CHAT_USAGE] == {
        "input_tokens": 1,
        "output_tokens": 1,
        "total_tokens": 2,
    }


def test_autolog_disable_prevents_new_traces():
    mlflow.strands.autolog()

    agent1 = Agent(model=DummyModel("hi"), name="agent1")
    agent2 = Agent(model=DummyModel("cya"), name="agent2")

    agent1("hello")
    assert len(get_traces()) == 1

    mlflow.strands.autolog(disable=True)
    agent2("bye")
    assert len(get_traces()) == 1


def test_autolog_does_not_raise_npe_when_tracing_disabled():
    mlflow.strands.autolog()

    agent = Agent(model=DummyModel("hi"), name="agent")

    @trace_disabled
    def run():
        agent("hello")

    run()
    assert len(get_traces()) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_collect_metrics.py]---
Location: mlflow-master/tests/system_metrics/test_collect_metrics.py

```python
from mlflow.system_metrics.metrics.cpu_monitor import CPUMonitor
from mlflow.system_metrics.metrics.disk_monitor import DiskMonitor
from mlflow.system_metrics.metrics.gpu_monitor import GPUMonitor
from mlflow.system_metrics.metrics.network_monitor import NetworkMonitor


def test_cpu_monitor():
    cpu_monitor = CPUMonitor()
    cpu_monitor.collect_metrics()

    assert isinstance(cpu_monitor.metrics["cpu_utilization_percentage"], list)
    assert isinstance(cpu_monitor.metrics["system_memory_usage_megabytes"], list)

    cpu_monitor.collect_metrics()
    aggregated_metrics = cpu_monitor.aggregate_metrics()
    assert isinstance(aggregated_metrics["cpu_utilization_percentage"], float)
    assert isinstance(aggregated_metrics["system_memory_usage_megabytes"], float)

    cpu_monitor.clear_metrics()
    assert cpu_monitor.metrics == {}


def test_gpu_monitor():
    try:
        gpu_monitor = GPUMonitor()
    except Exception:
        # If nvidia-ml-py is not installed, or there is no GPU, then `gpu_monitor` creation
        # will fail. In this case we skip the test.
        return

    gpu_monitor.collect_metrics()

    assert isinstance(gpu_monitor.metrics["gpu_0_memory_usage_percentage"], list)
    assert isinstance(gpu_monitor.metrics["gpu_0_memory_usage_megabytes"], list)
    assert isinstance(gpu_monitor.metrics["gpu_0_utilization_percentage"], list)
    assert isinstance(gpu_monitor.metrics["gpu_0_power_usage_watts"], list)
    assert isinstance(gpu_monitor.metrics["gpu_0_power_usage_percentage"], list)

    gpu_monitor.collect_metrics()
    aggregated_metrics = gpu_monitor.aggregate_metrics()
    assert isinstance(aggregated_metrics["gpu_0_memory_usage_percentage"], float)
    assert isinstance(aggregated_metrics["gpu_0_memory_usage_megabytes"], float)
    assert isinstance(aggregated_metrics["gpu_0_utilization_percentage"], float)
    assert isinstance(aggregated_metrics["gpu_0_power_usage_watts"], float)
    assert isinstance(aggregated_metrics["gpu_0_power_usage_percentage"], float)

    gpu_monitor.clear_metrics()
    assert len(gpu_monitor.metrics.keys) == 0


def test_disk_monitor():
    disk_monitor = DiskMonitor()
    disk_monitor.collect_metrics()

    assert len(disk_monitor.metrics.keys()) > 0
    assert isinstance(disk_monitor.metrics["disk_usage_percentage"], list)
    assert isinstance(disk_monitor.metrics["disk_usage_megabytes"], list)
    assert isinstance(disk_monitor.metrics["disk_available_megabytes"], list)

    disk_monitor.collect_metrics()
    aggregated_metrics = disk_monitor.aggregate_metrics()
    assert len(aggregated_metrics.keys()) > 0

    assert isinstance(aggregated_metrics["disk_usage_percentage"], float)
    assert isinstance(aggregated_metrics["disk_usage_megabytes"], float)
    assert isinstance(aggregated_metrics["disk_available_megabytes"], float)

    disk_monitor.clear_metrics()
    assert len(disk_monitor.metrics.keys()) == 0


def test_network_monitor():
    network_monitor = NetworkMonitor()
    network_monitor.collect_metrics()

    assert len(network_monitor.metrics.keys()) > 0
    assert isinstance(network_monitor.metrics["network_receive_megabytes"], float)
    assert isinstance(network_monitor.metrics["network_transmit_megabytes"], float)

    network_monitor.collect_metrics()
    aggregated_metrics = network_monitor.aggregate_metrics()
    assert len(aggregated_metrics.keys()) > 0

    assert isinstance(aggregated_metrics["network_receive_megabytes"], float)
    assert isinstance(aggregated_metrics["network_transmit_megabytes"], float)

    network_monitor.clear_metrics()
    assert len(network_monitor.metrics.keys()) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_system_metrics_logging.py]---
Location: mlflow-master/tests/system_metrics/test_system_metrics_logging.py

```python
import threading
import time
from typing import Any, Callable

import pytest

import mlflow
from mlflow.system_metrics.system_metrics_monitor import SystemMetricsMonitor


@pytest.fixture(autouse=True)
def disable_system_metrics_logging():
    yield
    # Unset the environment variables to avoid affecting other test cases.
    mlflow.disable_system_metrics_logging()
    mlflow.set_system_metrics_sampling_interval(None)
    mlflow.set_system_metrics_samples_before_logging(None)
    mlflow.set_system_metrics_node_id(None)


def wait_for_condition(
    condition_func: Callable[[], Any], timeout: int = 10, check_interval: int = 1
) -> None:
    start_time = time.time()
    while time.time() - start_time < timeout:
        if condition_func():
            return
        time.sleep(check_interval)
    pytest.fail(f"Condition not met within {timeout} seconds.")


def test_manual_system_metrics_monitor():
    metric_test = "system/cpu_utilization_percentage"
    with mlflow.start_run(log_system_metrics=False) as run:
        system_monitor = SystemMetricsMonitor(
            run.info.run_id,
            sampling_interval=0.1,
            samples_before_logging=2,
        )
        system_monitor.start()
        thread_names = [thread.name for thread in threading.enumerate()]
        # Check the system metrics monitoring thread has been started.
        assert "SystemMetricsMonitor" in thread_names

        wait_for_condition(
            lambda: len(mlflow.MlflowClient().get_metric_history(run.info.run_id, metric_test)) > 1
        )
    wait_for_condition(
        lambda: "SystemMetricsMonitor" not in [thread.name for thread in threading.enumerate()]
    )

    mlflow_run = mlflow.get_run(run.info.run_id)
    metrics = mlflow_run.data.metrics

    expected_metrics_name = [
        "cpu_utilization_percentage",
        "system_memory_usage_megabytes",
        "disk_usage_percentage",
        "disk_usage_megabytes",
        "disk_available_megabytes",
        "network_receive_megabytes",
        "network_transmit_megabytes",
    ]
    expected_metrics_name = [f"system/{name}" for name in expected_metrics_name]
    for name in expected_metrics_name:
        assert name in metrics

    # Check the step is correctly logged.
    metrics_history = mlflow.MlflowClient().get_metric_history(run.info.run_id, metric_test)
    assert metrics_history[-1].step > 0


def test_automatic_system_metrics_monitor():
    metric_test = "system/cpu_utilization_percentage"
    mlflow.enable_system_metrics_logging()
    mlflow.set_system_metrics_sampling_interval(0.2)
    mlflow.set_system_metrics_samples_before_logging(2)
    with mlflow.start_run() as run:
        thread_names = [thread.name for thread in threading.enumerate()]
        # Check the system metrics monitoring thread has been started.
        assert "SystemMetricsMonitor" in thread_names

        wait_for_condition(
            lambda: len(mlflow.MlflowClient().get_metric_history(run.info.run_id, metric_test)) > 1
        )

    wait_for_condition(
        lambda: "SystemMetricsMonitor" not in [thread.name for thread in threading.enumerate()]
    )

    mlflow_run = mlflow.get_run(run.info.run_id)
    metrics = mlflow_run.data.metrics

    expected_metrics_name = [
        "cpu_utilization_percentage",
        "system_memory_usage_megabytes",
        "disk_usage_percentage",
        "disk_usage_megabytes",
        "disk_available_megabytes",
        "network_receive_megabytes",
        "network_transmit_megabytes",
    ]
    expected_metrics_name = [f"system/{name}" for name in expected_metrics_name]
    for name in expected_metrics_name:
        assert name in metrics

    # Check the step is correctly logged.
    metrics_history = mlflow.MlflowClient().get_metric_history(run.info.run_id, metric_test)
    assert metrics_history[-1].step > 0


def test_automatic_system_metrics_monitor_resume_existing_run():
    mlflow.enable_system_metrics_logging()
    mlflow.set_system_metrics_sampling_interval(0.2)
    mlflow.set_system_metrics_samples_before_logging(2)
    with mlflow.start_run() as run:
        time.sleep(2)

    wait_for_condition(
        lambda: "SystemMetricsMonitor" not in [thread.name for thread in threading.enumerate()]
    )

    # Get the last step.
    metrics_history = mlflow.MlflowClient().get_metric_history(
        run.info.run_id, "system/cpu_utilization_percentage"
    )
    last_step = metrics_history[-1].step

    with mlflow.start_run(run.info.run_id) as run:
        time.sleep(2)
    mlflow_run = mlflow.get_run(run.info.run_id)
    metrics = mlflow_run.data.metrics

    expected_metrics_name = [
        "cpu_utilization_percentage",
        "system_memory_usage_megabytes",
        "disk_usage_percentage",
        "disk_usage_megabytes",
        "disk_available_megabytes",
        "network_receive_megabytes",
        "network_transmit_megabytes",
    ]
    expected_metrics_name = [f"system/{name}" for name in expected_metrics_name]
    for name in expected_metrics_name:
        assert name in metrics

    # Check the step is correctly resumed.
    metrics_history = mlflow.MlflowClient().get_metric_history(
        run.info.run_id, "system/cpu_utilization_percentage"
    )
    assert metrics_history[-1].step > last_step


def test_system_metrics_monitor_with_multi_node():
    mlflow.enable_system_metrics_logging()
    mlflow.set_system_metrics_sampling_interval(0.2)
    mlflow.set_system_metrics_samples_before_logging(2)

    with mlflow.start_run() as run:
        run_id = run.info.run_id

    node_ids = ["0", "1", "2", "3"]
    for node_id in node_ids:
        mlflow.set_system_metrics_node_id(node_id)
        with mlflow.start_run(run_id=run_id, log_system_metrics=True):
            wait_for_condition(
                lambda: any(
                    k.startswith(f"system/{node_id}/")
                    for k in mlflow.get_run(run_id).data.metrics.keys()
                )
            )

    mlflow_run = mlflow.get_run(run_id)
    metrics = mlflow_run.data.metrics

    for node_id in node_ids:
        expected_metric_name = f"system/{node_id}/cpu_utilization_percentage"
        assert expected_metric_name in metrics.keys()
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/telemetry/conftest.py

```python
from unittest.mock import Mock, patch

import pytest

import mlflow
import mlflow.telemetry.utils
from mlflow.telemetry.client import TelemetryClient, _set_telemetry_client, get_telemetry_client
from mlflow.version import VERSION


@pytest.fixture(autouse=True)
def terminate_telemetry_client():
    yield
    if client := get_telemetry_client():
        client._clean_up()
        # set to None to avoid side effect in other tests
        _set_telemetry_client(None)


@pytest.fixture
def mock_requests():
    """Fixture to mock requests.post and capture telemetry records."""
    captured_records = []

    url_status_code_map = {
        "http://127.0.0.1:9999/nonexistent": 404,
        "http://127.0.0.1:9999/unauthorized": 401,
        "http://127.0.0.1:9999/forbidden": 403,
        "http://127.0.0.1:9999/bad_request": 400,
    }

    def mock_post(url, json=None, **kwargs):
        if url in url_status_code_map:
            mock_response = Mock()
            mock_response.status_code = url_status_code_map[url]
            return mock_response
        if url == "http://localhost:9999":
            if json and "records" in json:
                captured_records.extend(json["records"])
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "status": "success",
                "count": len(json.get("records", [])) if json else 0,
            }
            return mock_response
        return Mock(status_code=404)

    with patch("requests.post", side_effect=mock_post):
        yield captured_records


@pytest.fixture(autouse=True)
def mock_requests_get(request):
    if request.node.get_closest_marker("no_mock_requests_get"):
        yield
        return

    with patch("mlflow.telemetry.client.requests.get") as mock_get:
        mock_get.return_value = Mock(
            status_code=200,
            json=Mock(
                return_value={
                    "mlflow_version": VERSION,
                    "disable_telemetry": False,
                    "ingestion_url": "http://localhost:9999",
                    "rollout_percentage": 100,
                    "disable_events": [],
                    "disable_sdks": [],
                }
            ),
        )
        yield


@pytest.fixture
def mock_telemetry_client(mock_requests_get, mock_requests):
    with TelemetryClient() as client:
        client.activate()
        # ensure config is fetched before the test
        client._config_thread.join(timeout=1)
        yield client


@pytest.fixture(autouse=True)
def is_mlflow_testing(monkeypatch):
    # enable telemetry by default when running tests in local with dev version
    monkeypatch.setattr(mlflow.telemetry.utils, "_IS_MLFLOW_TESTING_TELEMETRY", True)


@pytest.fixture
def bypass_env_check(monkeypatch):
    monkeypatch.setattr(mlflow.telemetry.utils, "_IS_MLFLOW_TESTING_TELEMETRY", False)
    monkeypatch.setattr(mlflow.telemetry.utils, "_IS_IN_CI_ENV_OR_TESTING", False)
    monkeypatch.setattr(mlflow.telemetry.utils, "_IS_MLFLOW_DEV_VERSION", False)
```

--------------------------------------------------------------------------------

---[FILE: helper_functions.py]---
Location: mlflow-master/tests/telemetry/helper_functions.py

```python
import json
from typing import Any


def validate_telemetry_record(
    mock_telemetry_client,
    mock_requests,
    event_name: str,
    params=None,
    *,
    status="success",
    search_index=True,
    check_params=True,
) -> dict[str, Any]:
    """
    Validate the telemetry record at the given index.
    """
    mock_telemetry_client.flush()

    if search_index:
        event_names = [record["data"]["event_name"] for record in mock_requests]
        idx = event_names.index(event_name)
    else:
        idx = 0

    record = mock_requests[idx]
    data = record["data"]
    assert data["event_name"] == event_name
    if check_params:
        if params:
            # Compare as dictionaries instead of JSON strings to avoid order-dependency
            actual_params = json.loads(data["params"]) if data["params"] else None
            assert actual_params == params
        else:
            assert data["params"] is None
    assert data["status"] == status
    assert data["duration_ms"] is not None
    mock_requests.clear()
    return data
```

--------------------------------------------------------------------------------

````
