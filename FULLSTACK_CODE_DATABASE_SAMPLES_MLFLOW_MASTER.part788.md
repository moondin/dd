---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 788
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 788 of 991)

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

---[FILE: test_gateway_secrets.py]---
Location: mlflow-master/tests/entities/test_gateway_secrets.py

```python
from mlflow.entities import GatewaySecretInfo


def test_secret_creation_full():
    secret = GatewaySecretInfo(
        secret_id="test-secret-id",
        secret_name="my_api_key",
        masked_value="sk-...abc123",
        created_at=1234567890000,
        last_updated_at=1234567890000,
        provider="openai",
        created_by="test_user",
        last_updated_by="test_user",
    )

    assert secret.secret_id == "test-secret-id"
    assert secret.secret_name == "my_api_key"
    assert secret.masked_value == "sk-...abc123"
    assert secret.created_at == 1234567890000
    assert secret.last_updated_at == 1234567890000
    assert secret.provider == "openai"
    assert secret.created_by == "test_user"
    assert secret.last_updated_by == "test_user"


def test_secret_creation_minimal():
    secret = GatewaySecretInfo(
        secret_id="minimal-secret-id",
        secret_name="minimal_key",
        masked_value="key-...xyz",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    assert secret.secret_id == "minimal-secret-id"
    assert secret.secret_name == "minimal_key"
    assert secret.masked_value == "key-...xyz"
    assert secret.created_at == 1234567890000
    assert secret.last_updated_at == 1234567890000
    assert secret.provider is None
    assert secret.created_by is None
    assert secret.last_updated_by is None


def test_secret_with_provider():
    providers = ["openai", "anthropic", "cohere", "bedrock"]

    for provider in providers:
        secret = GatewaySecretInfo(
            secret_id=f"{provider}-secret-id",
            secret_name=f"{provider}_key",
            masked_value=f"key-...{provider}",
            created_at=1234567890000,
            last_updated_at=1234567890000,
            provider=provider,
        )

        assert secret.provider == provider
        assert secret.secret_name == f"{provider}_key"


def test_secret_masked_value_formats():
    test_cases = [
        "sk-...abc123",
        "***",
        "AKIAIO...EXAMPLE",
        "glpat-...xyz",
    ]

    for masked_value in test_cases:
        secret = GatewaySecretInfo(
            secret_id="test-id",
            secret_name="test_key",
            masked_value=masked_value,
            created_at=1234567890000,
            last_updated_at=1234567890000,
        )

        assert secret.masked_value == masked_value


def test_secret_audit_fields():
    secret = GatewaySecretInfo(
        secret_id="audit-secret-id",
        secret_name="audit_key",
        masked_value="key-...audit",
        created_at=1234567890000,
        last_updated_at=9876543210000,
        created_by="user_1",
        last_updated_by="user_2",
    )

    assert secret.created_at == 1234567890000
    assert secret.last_updated_at == 9876543210000
    assert secret.created_by == "user_1"
    assert secret.last_updated_by == "user_2"


def test_secret_proto_round_trip():
    secret = GatewaySecretInfo(
        secret_id="secret-proto",
        secret_name="proto_api_key",
        masked_value="sk-...proto",
        created_at=1234567890000,
        last_updated_at=1234567891000,
        provider="openai",
        created_by="proto_user",
        last_updated_by="proto_user_2",
    )

    proto = secret.to_proto()
    restored = GatewaySecretInfo.from_proto(proto)

    assert restored.secret_id == secret.secret_id
    assert restored.secret_name == secret.secret_name
    assert restored.masked_value == secret.masked_value
    assert restored.created_at == secret.created_at
    assert restored.last_updated_at == secret.last_updated_at
    assert restored.provider == secret.provider
    assert restored.created_by == secret.created_by
    assert restored.last_updated_by == secret.last_updated_by


def test_secret_with_auth_config():
    auth_config = {"region": "us-west-2", "project_id": "my-project"}
    secret = GatewaySecretInfo(
        secret_id="auth-config-secret",
        secret_name="bedrock_key",
        masked_value="key-...bedrock",
        created_at=1234567890000,
        last_updated_at=1234567890000,
        provider="bedrock",
        auth_config=auth_config,
    )

    assert secret.auth_config == auth_config
    assert secret.auth_config["region"] == "us-west-2"
    assert secret.auth_config["project_id"] == "my-project"


def test_secret_auth_config_proto_round_trip():
    auth_config = {"region": "eu-central-1", "api_version": "2024-01"}
    secret = GatewaySecretInfo(
        secret_id="auth-config-proto",
        secret_name="config_key",
        masked_value="key-...config",
        created_at=1234567890000,
        last_updated_at=1234567891000,
        provider="anthropic",
        auth_config=auth_config,
        created_by="config_user",
        last_updated_by="config_user",
    )

    proto = secret.to_proto()
    restored = GatewaySecretInfo.from_proto(proto)

    assert restored.auth_config == secret.auth_config
    assert restored.auth_config["region"] == "eu-central-1"
    assert restored.auth_config["api_version"] == "2024-01"
```

--------------------------------------------------------------------------------

---[FILE: test_input_tag.py]---
Location: mlflow-master/tests/entities/test_input_tag.py

```python
from mlflow.entities import InputTag


def _check(input_tag, key, value):
    assert isinstance(input_tag, InputTag)
    assert input_tag.key == key
    assert input_tag.value == value


def test_creation_and_hydration():
    key = "my_key"
    value = "my_value"
    input_tag = InputTag(key, value)
    _check(input_tag, key, value)

    as_dict = {
        "key": key,
        "value": value,
    }
    assert dict(input_tag) == as_dict

    proto = input_tag.to_proto()
    input_tag2 = InputTag.from_proto(proto)
    _check(input_tag2, key, value)

    input_tag3 = InputTag.from_dictionary(as_dict)
    _check(input_tag3, key, value)
```

--------------------------------------------------------------------------------

---[FILE: test_metric.py]---
Location: mlflow-master/tests/entities/test_metric.py

```python
import re

import pytest

from mlflow.entities import Metric
from mlflow.exceptions import MlflowException
from mlflow.utils.time import get_current_time_millis

from tests.helper_functions import random_int, random_str


def _check(metric, key, value, timestamp, step):
    assert type(metric) == Metric
    assert metric.key == key
    assert metric.value == value
    assert metric.timestamp == timestamp
    assert metric.step == step


def test_creation_and_hydration():
    key = random_str()
    value = 10000
    ts = get_current_time_millis()
    step = random_int()

    metric = Metric(key, value, ts, step)
    _check(metric, key, value, ts, step)

    as_dict = {
        "key": key,
        "value": value,
        "timestamp": ts,
        "step": step,
        "model_id": None,
        "dataset_digest": None,
        "dataset_name": None,
        "run_id": None,
    }
    assert dict(metric) == as_dict

    proto = metric.to_proto()
    metric2 = metric.from_proto(proto)
    _check(metric2, key, value, ts, step)

    metric3 = Metric.from_dictionary(as_dict)
    _check(metric3, key, value, ts, step)


def test_metric_to_from_dictionary():
    # Create a Metric object
    original_metric = Metric(key="accuracy", value=0.95, timestamp=1623079352000, step=1)

    # Convert the Metric object to a dictionary
    metric_dict = original_metric.to_dictionary()

    # Verify the dictionary representation
    expected_dict = {
        "key": "accuracy",
        "value": 0.95,
        "timestamp": 1623079352000,
        "step": 1,
        "model_id": None,
        "dataset_digest": None,
        "dataset_name": None,
        "run_id": None,
    }
    assert metric_dict == expected_dict

    # Create a new Metric object from the dictionary
    recreated_metric = Metric.from_dictionary(metric_dict)

    # Verify the recreated Metric object matches the original
    assert recreated_metric == original_metric
    assert recreated_metric.key == original_metric.key
    assert recreated_metric.value == original_metric.value
    assert recreated_metric.timestamp == original_metric.timestamp
    assert recreated_metric.step == original_metric.step


def test_metric_from_dictionary_missing_keys():
    # Dictionary with missing keys
    incomplete_dict = {
        "key": "accuracy",
        "value": 0.95,
        "timestamp": 1623079352000,
    }

    with pytest.raises(
        MlflowException, match=re.escape("Missing required keys ['step'] in metric dictionary")
    ):
        Metric.from_dictionary(incomplete_dict)

    # Another dictionary with different missing keys
    another_incomplete_dict = {
        "key": "accuracy",
        "step": 1,
    }

    with pytest.raises(
        MlflowException,
        match=re.escape("Missing required keys ['value', 'timestamp'] in metric dictionary"),
    ):
        Metric.from_dictionary(another_incomplete_dict)
```

--------------------------------------------------------------------------------

---[FILE: test_param.py]---
Location: mlflow-master/tests/entities/test_param.py

```python
from mlflow.entities import Param

from tests.helper_functions import random_int, random_str


def _check(param, key, value):
    assert isinstance(param, Param)
    assert param.key == key
    assert param.value == value


def test_creation_and_hydration():
    key = random_str(random_int(10, 25))  # random string on size in range [10, 25]
    value = random_str(random_int(55, 75))  # random string on size in range [55, 75]
    param = Param(key, value)
    _check(param, key, value)

    as_dict = {"key": key, "value": value}
    assert dict(param) == as_dict

    proto = param.to_proto()
    param2 = Param.from_proto(proto)
    _check(param2, key, value)

    param3 = Param.from_dictionary(as_dict)
    _check(param3, key, value)
```

--------------------------------------------------------------------------------

---[FILE: test_prompt.py]---
Location: mlflow-master/tests/entities/test_prompt.py
Signals: Pydantic

```python
import json

import pytest
from pydantic import ValidationError

from mlflow.entities.model_registry import PromptModelConfig
from mlflow.entities.model_registry.model_version import ModelVersion
from mlflow.entities.model_registry.prompt_version import (
    IS_PROMPT_TAG_KEY,
    PROMPT_TEXT_TAG_KEY,
    PromptVersion,
)
from mlflow.exceptions import MlflowException
from mlflow.prompt.constants import PROMPT_MODEL_CONFIG_TAG_KEY
from mlflow.prompt.registry_utils import model_version_to_prompt_version
from mlflow.protos.model_registry_pb2 import ModelVersionTag


def test_prompt_initialization():
    prompt = PromptVersion(name="my_prompt", version=1, template="Hello, {{name}}!")
    assert prompt.name == "my_prompt"
    assert prompt.version == 1
    assert prompt.template == "Hello, {{name}}!"
    assert prompt.uri == "prompts:/my_prompt/1"
    # Public property should not return the reserved tag
    assert prompt.tags == {}
    assert prompt._tags[IS_PROMPT_TAG_KEY] == "true"
    assert prompt._tags[PROMPT_TEXT_TAG_KEY] == "Hello, {{name}}!"


@pytest.mark.parametrize(
    ("template", "expected"),
    [
        ("Hello, {{name}}!", {"name"}),
        ("Hello, {{ title }} {{ name }}!", {"title", "name"}),
        ("Hello, {{ person.name.first }}", {"person.name.first"}),
        ("Hello, {{name1}}", {"name1"}),
        # Invalid variables will be ignored
        ("Hello, {name}", set()),
        ("Hello, {{123name}}", set()),
    ],
)
def test_prompt_variables_extraction(template, expected):
    prompt = PromptVersion(name="test", version=1, template=template)
    assert prompt.variables == expected


@pytest.mark.parametrize(
    ("template", "expected"),
    [
        ("Hello, {{name}}!", "Hello, {name}!"),
        ("Hello, {{ title }} {{ name }}!", "Hello, {title} {name}!"),
        ("Hello, {{ person.name.first }}", "Hello, {person.name.first}"),
        ("Hello, {{name1}}", "Hello, {name1}"),
        ("Hello, {name}", "Hello, {name}"),
    ],
)
def test_prompt_to_single_brace_format(template, expected):
    prompt = PromptVersion(name="test", version=1, template=template)
    assert prompt.to_single_brace_format() == expected


def test_prompt_format():
    prompt = PromptVersion(name="test", version=1, template="Hello, {{title}} {{name}}!")
    result = prompt.format(title="Ms.", name="Alice")
    assert result == "Hello, Ms. Alice!"

    # By default, missing variables raise an error
    with pytest.raises(MlflowException, match="Missing variables: {'name'}"):
        prompt.format(title="Ms.")

    # Partial formatting
    result = prompt.format(title="Ms.", allow_partial=True)
    assert result.template == "Hello, Ms. {{name}}!"
    assert result.variables == {"name"}

    # Non-string values
    result = prompt.format(title="Ms.", allow_partial=True)
    result = prompt.format(title=1, name=True)
    assert result == "Hello, 1 True!"


@pytest.mark.parametrize(
    ("path_value", "unicode_value", "expected"),
    [
        ("C:\\Users\\test\\file.txt", "test", "Path: C:\\Users\\test\\file.txt, Unicode: test"),
        ("test", "\\u0041\\u0042", "Path: test, Unicode: \\u0041\\u0042"),
        ("line1\nline2", "test", "Path: line1\nline2, Unicode: test"),
        ("test[0-9]+", "test", "Path: test[0-9]+, Unicode: test"),
        (
            "C:\\Users\\test[0-9]+\\file.txt",
            "\\u0041\\u0042",
            "Path: C:\\Users\\test[0-9]+\\file.txt, Unicode: \\u0041\\u0042",
        ),
        ('test"quoted"', "test", 'Path: test"quoted", Unicode: test'),
        ("test(1)", "test", "Path: test(1), Unicode: test"),
        ("$100", "test", "Path: $100, Unicode: test"),
    ],
)
def test_prompt_format_backslash_escape(path_value: str, unicode_value: str, expected: str):
    prompt = PromptVersion(name="test", version=1, template="Path: {{path}}, Unicode: {{unicode}}")
    result = prompt.format(path=path_value, unicode=unicode_value)
    assert result == expected


@pytest.mark.parametrize(
    ("style", "question", "expected_content"),
    [
        ("helpful", "What is C:\\Users\\test?", "What is C:\\Users\\test?"),
        ("helpful", "Unicode: \\u0041\\u0042", "Unicode: \\u0041\\u0042"),
        ("friendly", "Line 1\nLine 2", "Line 1\nLine 2"),
        ("professional", "Pattern: [0-9]+", "Pattern: [0-9]+"),
        (
            "expert",
            "Path: C:\\Users\\test[0-9]+\\file.txt",
            "Path: C:\\Users\\test[0-9]+\\file.txt",
        ),
        ("casual", 'He said "Hello"', 'He said "Hello"'),
    ],
)
def test_prompt_format_chat_backslash_escape(style: str, question: str, expected_content: str):
    chat_template = [
        {"role": "system", "content": "You are a {{style}} assistant."},
        {"role": "user", "content": "{{question}}"},
    ]
    prompt = PromptVersion(name="test", version=1, template=chat_template)

    result = prompt.format(style=style, question=question)
    expected = [
        {"role": "system", "content": f"You are a {style} assistant."},
        {"role": "user", "content": expected_content},
    ]
    assert result == expected


def test_prompt_from_model_version():
    model_config_json = json.dumps({"model_name": "gpt-5", "temperature": 0.7, "max_tokens": 1000})
    model_version = ModelVersion(
        name="my-prompt",
        version=1,
        description="test",
        creation_timestamp=123,
        tags=[
            ModelVersionTag(key=IS_PROMPT_TAG_KEY, value="true"),
            ModelVersionTag(key=PROMPT_TEXT_TAG_KEY, value="Hello, {{name}}!"),
            ModelVersionTag(key=PROMPT_MODEL_CONFIG_TAG_KEY, value=model_config_json),
        ],
        aliases=["alias"],
    )

    prompt = model_version_to_prompt_version(model_version)
    assert prompt.name == "my-prompt"
    assert prompt.version == 1
    assert prompt.description == "test"
    assert prompt.creation_timestamp == 123
    assert prompt.template == "Hello, {{name}}!"
    assert prompt.model_config == {"model_name": "gpt-5", "temperature": 0.7, "max_tokens": 1000}
    assert prompt.tags == {}
    assert prompt.aliases == ["alias"]

    invalid_model_version = ModelVersion(
        name="my-prompt",
        version=1,
        creation_timestamp=123,
        # Missing the is_prompt tag
        tags=[ModelVersionTag(key=PROMPT_TEXT_TAG_KEY, value="Hello, {{name}}!")],
    )

    with pytest.raises(MlflowException, match="Name `my-prompt` is registered as a model"):
        model_version_to_prompt_version(invalid_model_version)

    invalid_model_version = ModelVersion(
        name="my-prompt",
        version=1,
        creation_timestamp=123,
        # Missing the prompt text tag
        tags=[ModelVersionTag(key=IS_PROMPT_TAG_KEY, value="true")],
    )

    with pytest.raises(MlflowException, match="Prompt `my-prompt` does not contain a prompt text"):
        model_version_to_prompt_version(invalid_model_version)


def test_prompt_with_model_config_dict():
    model_config = {
        "model_name": "gpt-5",
        "temperature": 0.7,
        "top_p": 0.9,
        "max_tokens": 1000,
    }
    prompt = PromptVersion(
        name="my_prompt",
        version=1,
        template="Hello, {{name}}!",
        model_config=model_config,
    )
    assert prompt.model_config == model_config

    # Test prompt without model_config
    prompt_without_config = PromptVersion(name="my_prompt", version=2, template="Hello, {{name}}!")
    assert prompt_without_config.model_config is None


def test_prompt_with_model_config_instance():
    config = PromptModelConfig(model_name="gpt-5", temperature=0.7, max_tokens=1000)
    prompt = PromptVersion(
        name="my_prompt",
        version=1,
        template="Hello, {{name}}!",
        model_config=config,
    )
    # Should be stored as dict
    assert prompt.model_config == {"model_name": "gpt-5", "temperature": 0.7, "max_tokens": 1000}


def test_prompt_with_model_config_instance_and_extra_params():
    config = PromptModelConfig(
        model_name="gpt-5",
        temperature=0.5,
        extra_params={"anthropic_version": "2023-06-01", "custom": "value"},
    )
    prompt = PromptVersion(
        name="my_prompt",
        version=1,
        template="Hello, {{name}}!",
        model_config=config,
    )
    # extra_params should be merged at top level
    assert prompt.model_config == {
        "model_name": "gpt-5",
        "temperature": 0.5,
        "anthropic_version": "2023-06-01",
        "custom": "value",
    }


def test_prompt_model_config_instance_validates():
    with pytest.raises(ValidationError, match="Input should be greater than or equal to 0"):
        PromptModelConfig(temperature=-0.5)

    with pytest.raises(ValidationError, match="Input should be greater than 0"):
        PromptModelConfig(max_tokens=0)

    # This should not raise during PromptVersion construction
    config = PromptModelConfig(model_name="gpt-5", temperature=0.7)
    PromptVersion(name="test", version=1, template="{{x}}", model_config=config)


def test_prompt_model_config_basic():
    config = PromptModelConfig(model_name="gpt-5", temperature=0.7, max_tokens=1000)
    assert config.model_name == "gpt-5"
    assert config.temperature == 0.7
    assert config.max_tokens == 1000
    assert config.top_p is None
    assert config.extra_params == {}


def test_prompt_model_config_with_extra_params():
    config = PromptModelConfig(
        model_name="gpt-5",
        temperature=0.7,
        extra_params={"anthropic_version": "2023-06-01", "custom_param": "value"},
    )
    assert config.model_name == "gpt-5"
    assert config.extra_params == {"anthropic_version": "2023-06-01", "custom_param": "value"}


def test_prompt_model_config_to_dict():
    config = PromptModelConfig(model_name="gpt-5", temperature=0.7, max_tokens=1000)
    config_dict = config.to_dict()
    assert config_dict == {"model_name": "gpt-5", "temperature": 0.7, "max_tokens": 1000}
    # None values should not be included
    assert "top_p" not in config_dict
    assert "top_k" not in config_dict


def test_prompt_model_config_to_dict_with_extra_params():
    config = PromptModelConfig(
        model_name="gpt-5",
        temperature=0.7,
        extra_params={"custom_param": "value", "another_param": 123},
    )
    config_dict = config.to_dict()
    # extra_params should be merged at top level
    assert config_dict == {
        "model_name": "gpt-5",
        "temperature": 0.7,
        "custom_param": "value",
        "another_param": 123,
    }
    assert "extra_params" not in config_dict


def test_prompt_model_config_from_dict():
    config_dict = {"model_name": "gpt-5", "temperature": 0.7, "max_tokens": 1000}
    config = PromptModelConfig.from_dict(config_dict)
    assert config.model_name == "gpt-5"
    assert config.temperature == 0.7
    assert config.max_tokens == 1000


def test_prompt_model_config_from_dict_with_unknown_fields():
    config_dict = {
        "model_name": "gpt-5",
        "temperature": 0.7,
        "custom_param": "value",
        "another_param": 123,
    }
    config = PromptModelConfig.from_dict(config_dict)
    assert config.model_name == "gpt-5"
    assert config.temperature == 0.7
    assert config.extra_params == {"custom_param": "value", "another_param": 123}


@pytest.mark.parametrize(
    ("field", "value", "error_match"),
    [
        ("temperature", "invalid", r"Input should be a valid number"),
        ("temperature", -0.5, r"Input should be greater than or equal to 0"),
        ("max_tokens", 100.5, r"Input should be a valid integer"),
        ("max_tokens", 0, r"Input should be greater than 0"),
        ("top_p", "invalid", r"Input should be a valid number"),
        ("top_p", 1.5, r"Input should be less than or equal to 1"),
        ("top_k", 10.5, r"Input should be a valid integer"),
        ("top_k", 0, r"Input should be greater than 0"),
        ("frequency_penalty", "invalid", r"Input should be a valid number"),
        ("presence_penalty", "invalid", r"Input should be a valid number"),
        ("stop_sequences", "not a list", r"Input should be a valid list"),
        ("stop_sequences", ["valid", 123], r"Input should be a valid string"),
        ("extra_params", "not a dict", r"Input should be a valid dictionary"),
    ],
)
def test_prompt_model_config_validation(field, value, error_match):
    from pydantic import ValidationError

    with pytest.raises(ValidationError, match=error_match):
        PromptModelConfig(**{field: value})


def test_prompt_model_config_empty():
    config = PromptModelConfig()
    assert config.model_name is None
    assert config.temperature is None
    assert config.max_tokens is None
    assert config.to_dict() == {}
```

--------------------------------------------------------------------------------

---[FILE: test_run.py]---
Location: mlflow-master/tests/entities/test_run.py

```python
import json

import pytest

from mlflow.entities import (
    Dataset,
    DatasetInput,
    LifecycleStage,
    LoggedModelOutput,
    Metric,
    Run,
    RunData,
    RunInfo,
    RunInputs,
    RunOutputs,
    RunStatus,
)
from mlflow.exceptions import MlflowException

from tests.entities.test_run_data import _check as run_data_check
from tests.entities.test_run_info import _check as run_info_check
from tests.entities.test_run_inputs import _check as run_inputs_check


def _check_run(run, ri, rd_metrics, rd_params, rd_tags, datasets):
    run_info_check(
        run.info,
        ri.run_id,
        ri.experiment_id,
        ri.user_id,
        ri.status,
        ri.start_time,
        ri.end_time,
        ri.lifecycle_stage,
        ri.artifact_uri,
    )
    run_data_check(run.data, rd_metrics, rd_params, rd_tags)
    run_inputs_check(run.inputs, datasets)


def test_creation_and_hydration(run_data, run_info, run_inputs):
    run_data, metrics, params, tags = run_data
    (
        run_info,
        run_id,
        run_name,
        experiment_id,
        user_id,
        status,
        start_time,
        end_time,
        lifecycle_stage,
        artifact_uri,
    ) = run_info
    run_inputs, datasets = run_inputs
    run_outputs = RunOutputs(model_outputs=[LoggedModelOutput(model_id="model-id-1", step=3)])

    run1 = Run(run_info, run_data, run_inputs, run_outputs)

    _check_run(run1, run_info, metrics, params, tags, datasets)

    expected_info_dict = {
        "run_id": run_id,
        "run_name": run_name,
        "experiment_id": experiment_id,
        "user_id": user_id,
        "status": status,
        "start_time": start_time,
        "end_time": end_time,
        "lifecycle_stage": lifecycle_stage,
        "artifact_uri": artifact_uri,
    }
    assert run1.to_dictionary() == {
        "info": expected_info_dict,
        "data": {
            "metrics": {m.key: m.value for m in metrics},
            "params": {p.key: p.value for p in params},
            "tags": {t.key: t.value for t in tags},
        },
        "inputs": {
            "dataset_inputs": [
                {
                    "dataset": {
                        "digest": "digest1",
                        "name": "name1",
                        "profile": None,
                        "schema": None,
                        "source": "source",
                        "source_type": "my_source_type",
                    },
                    "tags": {"key": "value"},
                }
            ],
            "model_inputs": [],
        },
        "outputs": {
            "model_outputs": [{"model_id": "model-id-1", "step": 3}],
        },
    }
    # Run must be json serializable
    json.dumps(run1.to_dictionary())

    proto = run1.to_proto()
    run2 = Run.from_proto(proto)
    _check_run(run2, run_info, metrics, params, tags, datasets)
    assert run2.outputs.model_outputs == [LoggedModelOutput(model_id="model-id-1", step=3)]
    assert run2.outputs.to_dictionary() == {
        "model_outputs": [{"model_id": "model-id-1", "step": 3}],
    }

    run3 = Run(run_info, None, None)
    assert run3.to_dictionary() == {"info": expected_info_dict}

    run4 = Run(run_info, None)
    assert run4.to_dictionary() == {"info": expected_info_dict}


def test_string_repr():
    run_info = RunInfo(
        run_id="hi",
        run_name="name",
        experiment_id=0,
        user_id="user-id",
        status=RunStatus.FAILED,
        start_time=0,
        end_time=1,
        lifecycle_stage=LifecycleStage.ACTIVE,
    )
    metrics = [Metric(key=f"key-{i}", value=i, timestamp=0, step=i) for i in range(3)]
    run_data = RunData(metrics=metrics, params=[], tags=[])
    dataset_inputs = DatasetInput(
        dataset=Dataset(
            name="name1", digest="digest1", source_type="my_source_type", source="source"
        ),
        tags=[],
    )
    run_inputs = RunInputs(dataset_inputs=dataset_inputs)
    run1 = Run(run_info, run_data, run_inputs)
    expected = (
        "<Run: data=<RunData: metrics={'key-0': 0, 'key-1': 1, 'key-2': 2}, "
        "params={}, tags={}>, info=<RunInfo: artifact_uri=None, end_time=1, "
        "experiment_id=0, lifecycle_stage='active', run_id='hi', run_name='name', "
        "start_time=0, status=4, user_id='user-id'>, inputs=<RunInputs: "
        "dataset_inputs=<DatasetInput: dataset=<Dataset: digest='digest1', "
        "name='name1', profile=None, schema=None, source='source', "
        "source_type='my_source_type'>, tags=[]>, model_inputs=[]>, outputs=None>"
    )
    assert str(run1) == expected


def test_creating_run_with_absent_info_throws_exception(run_data, run_inputs):
    run_data = run_data[0]
    with pytest.raises(MlflowException, match="run_info cannot be None"):
        Run(None, run_data, run_inputs)
```

--------------------------------------------------------------------------------

---[FILE: test_run_data.py]---
Location: mlflow-master/tests/entities/test_run_data.py

```python
from mlflow.entities import RunData


def _check_metrics(metric_objs, metrics_dict, expected_metrics):
    assert {m.key for m in metric_objs} == {m.key for m in expected_metrics}
    assert {m.value for m in metric_objs} == {m.value for m in expected_metrics}
    assert {m.timestamp for m in metric_objs} == {m.timestamp for m in expected_metrics}
    assert {m.step for m in metric_objs} == {m.step for m in expected_metrics}
    assert len(metrics_dict) == len(expected_metrics)
    assert metrics_dict == {m.key: m.value for m in expected_metrics}


def _check_params(params_dict, expected_params):
    assert params_dict == {p.key: p.value for p in expected_params}


def _check_tags(tags_dict, expected_tags):
    assert tags_dict == {t.key: t.value for t in expected_tags}


def _check(rd, metrics, params, tags):
    assert isinstance(rd, RunData)
    _check_metrics(rd._metric_objs, rd.metrics, metrics)
    _check_params(rd.params, params)
    _check_tags(rd.tags, tags)


def test_creation_and_hydration(run_data):
    rd, metrics, params, tags = run_data
    _check(rd, metrics, params, tags)
    as_dict = {
        "metrics": {m.key: m.value for m in metrics},
        "params": {p.key: p.value for p in params},
        "tags": {t.key: t.value for t in tags},
    }
    assert dict(rd) == as_dict
    proto = rd.to_proto()
    rd2 = RunData.from_proto(proto)
    _check(rd2, metrics, params, tags)
```

--------------------------------------------------------------------------------

---[FILE: test_run_info.py]---
Location: mlflow-master/tests/entities/test_run_info.py

```python
from mlflow.entities import RunInfo


def _check(
    ri,
    run_id,
    experiment_id,
    user_id,
    status,
    start_time,
    end_time,
    lifecycle_stage,
    artifact_uri,
):
    assert isinstance(ri, RunInfo)
    assert ri.run_id == run_id
    assert ri.experiment_id == experiment_id
    assert ri.user_id == user_id
    assert ri.status == status
    assert ri.start_time == start_time
    assert ri.end_time == end_time
    assert ri.lifecycle_stage == lifecycle_stage
    assert ri.artifact_uri == artifact_uri


def test_creation_and_hydration(run_info):
    (
        ri1,
        run_id,
        run_name,
        experiment_id,
        user_id,
        status,
        start_time,
        end_time,
        lifecycle_stage,
        artifact_uri,
    ) = run_info
    _check(
        ri1,
        run_id,
        experiment_id,
        user_id,
        status,
        start_time,
        end_time,
        lifecycle_stage,
        artifact_uri,
    )
    as_dict = {
        "run_id": run_id,
        "run_name": run_name,
        "experiment_id": experiment_id,
        "user_id": user_id,
        "status": status,
        "start_time": start_time,
        "end_time": end_time,
        "lifecycle_stage": lifecycle_stage,
        "artifact_uri": artifact_uri,
    }
    assert dict(ri1) == as_dict

    proto = ri1.to_proto()
    ri2 = RunInfo.from_proto(proto)
    _check(
        ri2,
        run_id,
        experiment_id,
        user_id,
        status,
        start_time,
        end_time,
        lifecycle_stage,
        artifact_uri,
    )
    ri3 = RunInfo.from_dictionary(as_dict)
    _check(
        ri3,
        run_id,
        experiment_id,
        user_id,
        status,
        start_time,
        end_time,
        lifecycle_stage,
        artifact_uri,
    )
    # Test that we can add a field to RunInfo and still deserialize it from a dictionary
    dict_copy_0 = as_dict.copy()
    dict_copy_0["my_new_field"] = "new field value"
    ri4 = RunInfo.from_dictionary(dict_copy_0)
    _check(
        ri4,
        run_id,
        experiment_id,
        user_id,
        status,
        start_time,
        end_time,
        lifecycle_stage,
        artifact_uri,
    )


def test_searchable_attributes():
    assert set(RunInfo.get_searchable_attributes()) == {
        "status",
        "artifact_uri",
        "start_time",
        "user_id",
        "end_time",
        "run_name",
        "run_id",
    }
```

--------------------------------------------------------------------------------

---[FILE: test_run_inputs.py]---
Location: mlflow-master/tests/entities/test_run_inputs.py

```python
from mlflow.entities import RunInputs
from mlflow.entities.dataset_input import DatasetInput


def _check_inputs(run_datasets, datasets):
    for d1, d2 in zip(run_datasets, datasets):
        assert d1.dataset.digest == d2.dataset.digest
        assert d1.dataset.name == d2.dataset.name
        assert d1.dataset.source_type == d2.dataset.source_type
        assert d1.dataset.source == d2.dataset.source
        for t1, t2 in zip(d1.tags, d2.tags):
            assert t1.key == t2.key
            assert t1.value == t2.value


def _check(inputs, datasets):
    assert isinstance(inputs, RunInputs)
    _check_inputs(inputs.dataset_inputs, datasets)


def test_creation_and_hydration(run_inputs):
    run_inputs, datasets = run_inputs
    _check(run_inputs, datasets)
    as_dict = {
        "dataset_inputs": [
            {
                "dataset": {
                    "digest": "digest1",
                    "name": "name1",
                    "profile": None,
                    "schema": None,
                    "source": "source",
                    "source_type": "my_source_type",
                },
                "tags": {"key": "value"},
            }
        ],
        "model_inputs": [],
    }
    assert run_inputs.to_dictionary() == as_dict
    proto = run_inputs.to_proto()
    run_inputs2 = RunInputs.from_proto(proto)
    _check(run_inputs2, datasets)
    assert isinstance(run_inputs2.dataset_inputs[0], DatasetInput)
```

--------------------------------------------------------------------------------

---[FILE: test_run_status.py]---
Location: mlflow-master/tests/entities/test_run_status.py

```python
import pytest

from mlflow.entities import RunStatus


def test_all_status_covered():
    # ensure that all known status are returned. Test will fail if new status are added to PB
    all_statuses = {
        RunStatus.RUNNING,
        RunStatus.SCHEDULED,
        RunStatus.FINISHED,
        RunStatus.FAILED,
        RunStatus.KILLED,
    }
    assert all_statuses == set(RunStatus.all_status())


def test_status_mappings():
    # test enum to string mappings
    assert RunStatus.to_string(RunStatus.RUNNING) == "RUNNING"
    assert RunStatus.RUNNING == RunStatus.from_string("RUNNING")

    assert RunStatus.to_string(RunStatus.SCHEDULED) == "SCHEDULED"
    assert RunStatus.SCHEDULED == RunStatus.from_string("SCHEDULED")

    assert RunStatus.to_string(RunStatus.FINISHED) == "FINISHED"
    assert RunStatus.FINISHED == RunStatus.from_string("FINISHED")

    assert RunStatus.to_string(RunStatus.FAILED) == "FAILED"
    assert RunStatus.FAILED == RunStatus.from_string("FAILED")

    assert RunStatus.to_string(RunStatus.KILLED) == "KILLED"
    assert RunStatus.KILLED == RunStatus.from_string("KILLED")

    with pytest.raises(Exception, match=r"Could not get string corresponding to run status -120"):
        RunStatus.to_string(-120)

    with pytest.raises(
        Exception, match=r"Could not get run status corresponding to string the IMPO"
    ):
        RunStatus.from_string("the IMPOSSIBLE status string")


def test_is_terminated():
    assert RunStatus.is_terminated(RunStatus.FAILED)
    assert RunStatus.is_terminated(RunStatus.FINISHED)
    assert RunStatus.is_terminated(RunStatus.KILLED)
    assert not RunStatus.is_terminated(RunStatus.SCHEDULED)
    assert not RunStatus.is_terminated(RunStatus.RUNNING)
```

--------------------------------------------------------------------------------

````
