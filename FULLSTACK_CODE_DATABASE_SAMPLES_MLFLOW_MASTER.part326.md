---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 326
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 326 of 991)

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
Location: mlflow-master/mlflow/metrics/genai/metric_definitions.py

```python
from typing import Any

from mlflow.exceptions import MlflowException
from mlflow.metrics.genai.base import EvaluationExample
from mlflow.metrics.genai.genai_metric import make_genai_metric
from mlflow.metrics.genai.utils import _MIGRATION_GUIDE, _get_latest_metric_version
from mlflow.models import EvaluationMetric
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR, INVALID_PARAMETER_VALUE
from mlflow.utils.annotations import deprecated
from mlflow.utils.class_utils import _get_class_from_string


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def answer_similarity(
    model: str | None = None,
    metric_version: str | None = None,
    examples: list[EvaluationExample] | None = None,
    metric_metadata: dict[str, Any] | None = None,
    parameters: dict[str, Any] | None = None,
    extra_headers: dict[str, str] | None = None,
    proxy_url: str | None = None,
    max_workers: int = 10,
) -> EvaluationMetric:
    """
    This function will create a genai metric used to evaluate the answer similarity of an LLM
    using the model provided. Answer similarity will be assessed by the semantic similarity of the
    output to the ``ground_truth``, which should be specified in the ``targets`` column. High
    scores mean that your model outputs contain similar information as the ground_truth, while
    low scores mean that outputs may disagree with the ground_truth.

    The ``targets`` eval_arg must be provided as part of the input dataset or output
    predictions. This can be mapped to a column of a different name using ``col_mapping``
    in the ``evaluator_config`` parameter, or using the ``targets`` parameter in mlflow.evaluate().

    An MlflowException will be raised if the specified version for this metric does not exist.

    Args:
        model: (Optional) Model uri of the judge model that will be used to compute the metric,
            e.g., ``openai:/gpt-4``. Refer to the `LLM-as-a-Judge Metrics <https://mlflow.org/docs/latest/llms/llm-evaluate/index.html#selecting-the-llm-as-judge-model>`_
            documentation for the supported model types and their URI format.
        metric_version: (Optional) The version of the answer similarity metric to use.
            Defaults to the latest version.
        examples: (Optional) Provide a list of examples to help the judge model evaluate the
            answer similarity. It is highly recommended to add examples to be used as a reference to
            evaluate the new results.
        metric_metadata: (Optional) Dictionary of metadata to be attached to the
            EvaluationMetric object. Useful for model evaluators that require additional
            information to determine how to evaluate this metric.
        parameters: (Optional) Dictionary of parameters to be passed to the judge model,
            e.g., {"temperature": 0.5}. When specified, these parameters will override
            the default parameters defined in the metric implementation.
        extra_headers: (Optional) Dictionary of extra headers to be passed to the judge model.
        proxy_url: (Optional) Proxy URL to be used for the judge model. This is useful when the
            judge model is served via a proxy endpoint, not directly via LLM provider services.
            If not specified, the default URL for the LLM provider will be used
            (e.g., https://api.openai.com/v1/chat/completions for OpenAI chat models).
        max_workers: (Optional) The maximum number of workers to use for judge scoring.
            Defaults to 10 workers.

    Returns:
        A metric object
    """
    if metric_version is None:
        metric_version = _get_latest_metric_version()
    class_name = f"mlflow.metrics.genai.prompts.{metric_version}.AnswerSimilarityMetric"
    try:
        answer_similarity_class_module = _get_class_from_string(class_name)
    except ModuleNotFoundError:
        raise MlflowException(
            f"Failed to find answer similarity metric for version {metric_version}."
            f" Please check the version",
            error_code=INVALID_PARAMETER_VALUE,
        ) from None
    except Exception as e:
        raise MlflowException(
            f"Failed to construct answer similarity metric {metric_version}. Error: {e!r}",
            error_code=INTERNAL_ERROR,
        ) from None

    if examples is None:
        examples = answer_similarity_class_module.default_examples
    if model is None:
        model = answer_similarity_class_module.default_model

    return make_genai_metric(
        name="answer_similarity",
        definition=answer_similarity_class_module.definition,
        grading_prompt=answer_similarity_class_module.grading_prompt,
        include_input=False,
        examples=examples,
        version=metric_version,
        model=model,
        grading_context_columns=answer_similarity_class_module.grading_context_columns,
        parameters=parameters or answer_similarity_class_module.parameters,
        aggregations=["mean", "variance", "p90"],
        greater_is_better=True,
        metric_metadata=metric_metadata,
        extra_headers=extra_headers,
        proxy_url=proxy_url,
        max_workers=max_workers,
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def answer_correctness(
    model: str | None = None,
    metric_version: str | None = None,
    examples: list[EvaluationExample] | None = None,
    metric_metadata: dict[str, Any] | None = None,
    parameters: dict[str, Any] | None = None,
    extra_headers: dict[str, str] | None = None,
    proxy_url: str | None = None,
    max_workers: int = 10,
) -> EvaluationMetric:
    """
    This function will create a genai metric used to evaluate the answer correctness of an LLM
    using the model provided. Answer correctness will be assessed by the accuracy of the provided
    output based on the ``ground_truth``, which should be specified in the ``targets`` column.
    High scores mean that your model outputs contain similar information as the ground_truth and
    that this information is correct, while low scores mean that outputs may disagree with the
    ground_truth or that the information in the output is incorrect. Note that this builds onto
    answer_similarity.

    The ``targets`` eval_arg must be provided as part of the input dataset or output
    predictions. This can be mapped to a column of a different name using ``col_mapping``
    in the ``evaluator_config`` parameter, or using the ``targets`` parameter in mlflow.evaluate().

    An MlflowException will be raised if the specified version for this metric does not exist.

    Args:
        model: (Optional) Model uri of the judge model that will be used to compute the metric,
            e.g., ``openai:/gpt-4``. Refer to the `LLM-as-a-Judge Metrics <https://mlflow.org/docs/latest/llms/llm-evaluate/index.html#selecting-the-llm-as-judge-model>`_
            documentation for the supported model types and their URI format.
        metric_version: The version of the answer correctness metric to use.
            Defaults to the latest version.
        examples: Provide a list of examples to help the judge model evaluate the
            answer correctness. It is highly recommended to add examples to be used as a reference
            to evaluate the new results.
        metric_metadata: (Optional) Dictionary of metadata to be attached to the
            EvaluationMetric object. Useful for model evaluators that require additional
            information to determine how to evaluate this metric.
        parameters: (Optional) Dictionary of parameters to be passed to the judge model,
            e.g., {"temperature": 0.5}. When specified, these parameters will override
            the default parameters defined in the metric implementation.
        extra_headers: (Optional) Dictionary of extra headers to be passed to the judge model.
        proxy_url: (Optional) Proxy URL to be used for the judge model. This is useful when the
            judge model is served via a proxy endpoint, not directly via LLM provider services.
            If not specified, the default URL for the LLM provider will be used
            (e.g., https://api.openai.com/v1/chat/completions for OpenAI chat models).
        max_workers: (Optional) The maximum number of workers to use for judge scoring.
            Defaults to 10 workers.

    Returns:
        A metric object
    """
    if metric_version is None:
        metric_version = _get_latest_metric_version()
    class_name = f"mlflow.metrics.genai.prompts.{metric_version}.AnswerCorrectnessMetric"
    try:
        answer_correctness_class_module = _get_class_from_string(class_name)
    except ModuleNotFoundError:
        raise MlflowException(
            f"Failed to find answer correctness metric for version {metric_version}."
            f"Please check the version",
            error_code=INVALID_PARAMETER_VALUE,
        ) from None
    except Exception as e:
        raise MlflowException(
            f"Failed to construct answer correctness metric {metric_version}. Error: {e!r}",
            error_code=INTERNAL_ERROR,
        ) from None

    if examples is None:
        examples = answer_correctness_class_module.default_examples
    if model is None:
        model = answer_correctness_class_module.default_model

    return make_genai_metric(
        name="answer_correctness",
        definition=answer_correctness_class_module.definition,
        grading_prompt=answer_correctness_class_module.grading_prompt,
        examples=examples,
        version=metric_version,
        model=model,
        grading_context_columns=answer_correctness_class_module.grading_context_columns,
        parameters=parameters or answer_correctness_class_module.parameters,
        aggregations=["mean", "variance", "p90"],
        greater_is_better=True,
        metric_metadata=metric_metadata,
        extra_headers=extra_headers,
        proxy_url=proxy_url,
        max_workers=max_workers,
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def faithfulness(
    model: str | None = None,
    metric_version: str | None = _get_latest_metric_version(),
    examples: list[EvaluationExample] | None = None,
    metric_metadata: dict[str, Any] | None = None,
    parameters: dict[str, Any] | None = None,
    extra_headers: dict[str, str] | None = None,
    proxy_url: str | None = None,
    max_workers: int = 10,
) -> EvaluationMetric:
    """
    This function will create a genai metric used to evaluate the faithfullness of an LLM using the
    model provided. Faithfulness will be assessed based on how factually consistent the output
    is to the ``context``. High scores mean that the outputs contain information that is in
    line with the context, while low scores mean that outputs may disagree with the context
    (input is ignored).

    The ``context`` eval_arg must be provided as part of the input dataset or output
    predictions. This can be mapped to a column of a different name using ``col_mapping``
    in the ``evaluator_config`` parameter.

    An MlflowException will be raised if the specified version for this metric does not exist.

    Args:
        model: (Optional) Model uri of the judge model that will be used to compute the metric,
            e.g., ``openai:/gpt-4``. Refer to the `LLM-as-a-Judge Metrics <https://mlflow.org/docs/latest/llms/llm-evaluate/index.html#selecting-the-llm-as-judge-model>`_
            documentation for the supported model types and their URI format.
        metric_version: The version of the faithfulness metric to use.
            Defaults to the latest version.
        examples: Provide a list of examples to help the judge model evaluate the
            faithfulness. It is highly recommended to add examples to be used as a reference to
            evaluate the new results.
        metric_metadata: (Optional) Dictionary of metadata to be attached to the
            EvaluationMetric object. Useful for model evaluators that require additional
            information to determine how to evaluate this metric.
        parameters: (Optional) Dictionary of parameters to be passed to the judge model,
            e.g., {"temperature": 0.5}. When specified, these parameters will override
            the default parameters defined in the metric implementation.
        extra_headers: (Optional) Dictionary of extra headers to be passed to the judge model.
        proxy_url: (Optional) Proxy URL to be used for the judge model. This is useful when the
            judge model is served via a proxy endpoint, not directly via LLM provider services.
            If not specified, the default URL for the LLM provider will be used
            (e.g., https://api.openai.com/v1/chat/completions for OpenAI chat models).
        max_workers: (Optional) The maximum number of workers to use for judge scoring.
            Defaults to 10 workers.

    Returns:
        A metric object
    """
    class_name = f"mlflow.metrics.genai.prompts.{metric_version}.FaithfulnessMetric"
    try:
        faithfulness_class_module = _get_class_from_string(class_name)
    except ModuleNotFoundError:
        raise MlflowException(
            f"Failed to find faithfulness metric for version {metric_version}."
            f" Please check the version",
            error_code=INVALID_PARAMETER_VALUE,
        ) from None
    except Exception as e:
        raise MlflowException(
            f"Failed to construct faithfulness metric {metric_version}. Error: {e!r}",
            error_code=INTERNAL_ERROR,
        ) from None

    if examples is None:
        examples = faithfulness_class_module.default_examples
    if model is None:
        model = faithfulness_class_module.default_model

    return make_genai_metric(
        name="faithfulness",
        definition=faithfulness_class_module.definition,
        grading_prompt=faithfulness_class_module.grading_prompt,
        include_input=False,
        examples=examples,
        version=metric_version,
        model=model,
        grading_context_columns=faithfulness_class_module.grading_context_columns,
        parameters=parameters or faithfulness_class_module.parameters,
        aggregations=["mean", "variance", "p90"],
        greater_is_better=True,
        metric_metadata=metric_metadata,
        extra_headers=extra_headers,
        proxy_url=proxy_url,
        max_workers=max_workers,
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def answer_relevance(
    model: str | None = None,
    metric_version: str | None = _get_latest_metric_version(),
    examples: list[EvaluationExample] | None = None,
    metric_metadata: dict[str, Any] | None = None,
    parameters: dict[str, Any] | None = None,
    extra_headers: dict[str, str] | None = None,
    proxy_url: str | None = None,
    max_workers: int = 10,
) -> EvaluationMetric:
    """
    This function will create a genai metric used to evaluate the answer relevance of an LLM
    using the model provided. Answer relevance will be assessed based on the appropriateness and
    applicability of the output with respect to the input. High scores mean that your model
    outputs are about the same subject as the input, while low scores mean that outputs may
    be non-topical.

    An MlflowException will be raised if the specified version for this metric does not exist.

    Args:
        model: (Optional) Model uri of the judge model that will be used to compute the metric,
            e.g., ``openai:/gpt-4``. Refer to the `LLM-as-a-Judge Metrics <https://mlflow.org/docs/latest/llms/llm-evaluate/index.html#selecting-the-llm-as-judge-model>`_
            documentation for the supported model types and their URI format.
        metric_version: The version of the answer relevance metric to use.
            Defaults to the latest version.
        examples: Provide a list of examples to help the judge model evaluate the
            answer relevance. It is highly recommended to add examples to be used as a reference to
            evaluate the new results.
        metric_metadata: (Optional) Dictionary of metadata to be attached to the
            EvaluationMetric object. Useful for model evaluators that require additional
            information to determine how to evaluate this metric.
        parameters: (Optional) Dictionary of parameters to be passed to the judge model,
            e.g., {"temperature": 0.5}. When specified, these parameters will override
            the default parameters defined in the metric implementation.
        extra_headers: (Optional) Dictionary of extra headers to be passed to the judge model.
        proxy_url: (Optional) Proxy URL to be used for the judge model. This is useful when the
            judge model is served via a proxy endpoint, not directly via LLM provider services.
            If not specified, the default URL for the LLM provider will be used
            (e.g., https://api.openai.com/v1/chat/completions for OpenAI chat models).
        max_workers: (Optional) The maximum number of workers to use for judge scoring.
            Defaults to 10 workers.

    Returns:
        A metric object
    """
    class_name = f"mlflow.metrics.genai.prompts.{metric_version}.AnswerRelevanceMetric"
    try:
        answer_relevance_class_module = _get_class_from_string(class_name)
    except ModuleNotFoundError:
        raise MlflowException(
            f"Failed to find answer relevance metric for version {metric_version}."
            f" Please check the version",
            error_code=INVALID_PARAMETER_VALUE,
        ) from None
    except Exception as e:
        raise MlflowException(
            f"Failed to construct answer relevance metric {metric_version}. Error: {e!r}",
            error_code=INTERNAL_ERROR,
        ) from None

    if examples is None:
        examples = answer_relevance_class_module.default_examples
    if model is None:
        model = answer_relevance_class_module.default_model

    return make_genai_metric(
        name="answer_relevance",
        definition=answer_relevance_class_module.definition,
        grading_prompt=answer_relevance_class_module.grading_prompt,
        examples=examples,
        version=metric_version,
        model=model,
        parameters=parameters or answer_relevance_class_module.parameters,
        aggregations=["mean", "variance", "p90"],
        greater_is_better=True,
        metric_metadata=metric_metadata,
        extra_headers=extra_headers,
        proxy_url=proxy_url,
        max_workers=max_workers,
    )


@deprecated(since="3.4.0", impact=_MIGRATION_GUIDE)
def relevance(
    model: str | None = None,
    metric_version: str | None = None,
    examples: list[EvaluationExample] | None = None,
    metric_metadata: dict[str, Any] | None = None,
    parameters: dict[str, Any] | None = None,
    extra_headers: dict[str, str] | None = None,
    proxy_url: str | None = None,
    max_workers: int = 10,
) -> EvaluationMetric:
    """
    This function will create a genai metric used to evaluate the evaluate the relevance of an
    LLM using the model provided. Relevance will be assessed by the appropriateness, significance,
    and applicability of the output with respect to the input and ``context``. High scores mean
    that the model has understood the context and correct extracted relevant information from
    the context, while low score mean that output has completely ignored the question and the
    context and could be hallucinating.

    The ``context`` eval_arg must be provided as part of the input dataset or output
    predictions. This can be mapped to a column of a different name using ``col_mapping``
    in the ``evaluator_config`` parameter.

    An MlflowException will be raised if the specified version for this metric does not exist.

    Args:
        model: (Optional) Model uri of the judge model that will be used to compute the metric,
            e.g., ``openai:/gpt-4``. Refer to the `LLM-as-a-Judge Metrics <https://mlflow.org/docs/latest/llms/llm-evaluate/index.html#selecting-the-llm-as-judge-model>`_
            documentation for the supported model types and their URI format.
        metric_version: (Optional) The version of the relevance metric to use.
            Defaults to the latest version.
        examples: (Optional) Provide a list of examples to help the judge model evaluate the
            relevance. It is highly recommended to add examples to be used as a reference to
            evaluate the new results.
        metric_metadata: (Optional) Dictionary of metadata to be attached to the
            EvaluationMetric object. Useful for model evaluators that require additional
            information to determine how to evaluate this metric.
        parameters: (Optional) Dictionary of parameters to be passed to the judge model,
            e.g., {"temperature": 0.5}. When specified, these parameters will override
            the default parameters defined in the metric implementation.
        extra_headers: (Optional) Dictionary of extra headers to be passed to the judge model.
        proxy_url: (Optional) Proxy URL to be used for the judge model. This is useful when the
            judge model is served via a proxy endpoint, not directly via LLM provider services.
            If not specified, the default URL for the LLM provider will be used
            (e.g., https://api.openai.com/v1/chat/completions for OpenAI chat models).
        max_workers: (Optional) The maximum number of workers to use for judge scoring.
            Defaults to 10 workers.

    Returns:
        A metric object
    """
    if metric_version is None:
        metric_version = _get_latest_metric_version()
    class_name = f"mlflow.metrics.genai.prompts.{metric_version}.RelevanceMetric"
    try:
        relevance_class_module = _get_class_from_string(class_name)
    except ModuleNotFoundError:
        raise MlflowException(
            f"Failed to find relevance metric for version {metric_version}."
            f"Please check the version",
            error_code=INVALID_PARAMETER_VALUE,
        ) from None
    except Exception as e:
        raise MlflowException(
            f"Failed to construct relevance metric {metric_version}. Error: {e!r}",
            error_code=INTERNAL_ERROR,
        ) from None

    if examples is None:
        examples = relevance_class_module.default_examples
    if model is None:
        model = relevance_class_module.default_model

    return make_genai_metric(
        name="relevance",
        definition=relevance_class_module.definition,
        grading_prompt=relevance_class_module.grading_prompt,
        examples=examples,
        version=metric_version,
        model=model,
        grading_context_columns=relevance_class_module.grading_context_columns,
        parameters=parameters or relevance_class_module.parameters,
        aggregations=["mean", "variance", "p90"],
        greater_is_better=True,
        metric_metadata=metric_metadata,
        extra_headers=extra_headers,
        proxy_url=proxy_url,
        max_workers=max_workers,
    )
```

--------------------------------------------------------------------------------

---[FILE: model_utils.py]---
Location: mlflow-master/mlflow/metrics/genai/model_utils.py
Signals: Pydantic

```python
import logging
import os
from typing import TYPE_CHECKING, Any

import requests

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

if TYPE_CHECKING:
    from mlflow.gateway.providers import BaseProvider

_logger = logging.getLogger(__name__)


def get_endpoint_type(endpoint_uri: str) -> str | None:
    """
    Get the type of the endpoint if it is MLflow deployment
    endpoint. For other endpoints e.g. OpenAI, or if the
    endpoint does not specify type, return None.
    """
    schema, path = _parse_model_uri(endpoint_uri)

    if schema != "endpoints":
        return None

    from pydantic import BaseModel

    from mlflow.deployments import get_deploy_client

    client = get_deploy_client()

    endpoint = client.get_endpoint(path)
    # TODO: Standardize the return type of `get_endpoint` and remove this check
    endpoint = endpoint.dict() if isinstance(endpoint, BaseModel) else endpoint
    return endpoint.get("task", endpoint.get("endpoint_type"))


# TODO: improve this name
def score_model_on_payload(
    model_uri,
    payload,
    eval_parameters=None,
    extra_headers=None,
    proxy_url=None,
    endpoint_type=None,
):
    """Call the model identified by the given uri with the given string prompt."""
    from mlflow.deployments import get_deploy_client

    eval_parameters = eval_parameters or {}
    extra_headers = extra_headers or {}

    prefix, suffix = _parse_model_uri(model_uri)

    if prefix in ["gateway", "endpoints"]:
        if isinstance(payload, str) and endpoint_type is None:
            client = get_deploy_client()
            endpoint_type = client.get_endpoint(suffix).endpoint_type
        return call_deployments_api(suffix, payload, eval_parameters, endpoint_type)
    elif prefix in ("model", "runs"):
        # TODO: call _load_model_or_server
        raise NotImplementedError

    # Import here to avoid loading gateway module at the top level
    from mlflow.gateway.provider_registry import is_supported_provider

    if is_supported_provider(prefix):
        return _call_llm_provider_api(
            prefix, suffix, payload, eval_parameters, extra_headers, proxy_url
        )

    raise MlflowException(
        f"Unknown model uri prefix '{prefix}'",
        error_code=INVALID_PARAMETER_VALUE,
    )


def _parse_model_uri(model_uri: str) -> tuple[str, str]:
    """Parse a model URI of the form "<provider>:/<model-name>"."""
    # urllib.parse.urlparse is not used because provider names with underscores
    # (e.g., vertex_ai) are invalid in RFC 3986 URI schemes and would fail parsing.
    match model_uri.split(":/", 1):
        case [provider, model_path] if provider and model_path.lstrip("/"):
            return provider, model_path.lstrip("/")
        case _:
            raise MlflowException(
                f"Malformed model uri '{model_uri}'. The URI must be in the format of "
                "<provider>:/<model-name>, e.g., 'openai:/gpt-4.1-mini'.",
                error_code=INVALID_PARAMETER_VALUE,
            )


_PREDICT_ERROR_MSG = """\
Failed to call the deployment endpoint. Please check the deployment URL \
is set correctly and the input payload is valid.\n
- Error: {e}\n
- Deployment URI: {uri}\n
- Input payload: {payload}"""


def _is_supported_llm_provider(schema: str) -> bool:
    from mlflow.gateway.provider_registry import provider_registry

    return schema in provider_registry.keys()


def _call_llm_provider_api(
    provider_name: str,
    model: str,
    input_data: str,
    eval_parameters: dict[str, Any],
    extra_headers: dict[str, str],
    proxy_url: str | None = None,
) -> str:
    """
    Invoke chat endpoint of various LLM providers.

    Under the hood, this function uses the MLflow Gateway to transform the input/output data
    for different LLM providers.

    Args:
        provider_name: The provider name, e.g., "anthropic".
        model: The model name, e.g., "claude-3-5-sonnet"
        input_data: The input string prompt to send to the model as a chat message.
        eval_parameters: The additional parameters to send to the model, e.g. temperature.
        extra_headers: The additional headers to send to the provider.
        proxy_url: Proxy URL to be used for the judge model. If not specified, the default
            URL for the LLM provider will be used.
    """
    from mlflow.gateway.config import Provider
    from mlflow.gateway.schemas import chat

    provider = _get_provider_instance(provider_name, model)

    chat_request = chat.RequestPayload(
        model=model,
        messages=[
            chat.RequestMessage(role="user", content=input_data),
        ],
        **eval_parameters,
    )

    # Filter out keys in the payload to the specified ones + "messages".
    # Does not include "model" key here because some providers do not accept it as a
    # part of the payload. Whether or not to include "model" key must be determined
    # by each provider implementation.
    filtered_keys = {"messages", *eval_parameters.keys()}

    payload = {
        k: v
        for k, v in chat_request.model_dump(exclude_none=True).items()
        if (v is not None) and (k in filtered_keys)
    }
    chat_payload = provider.adapter_class.chat_to_model(payload, provider.config)
    chat_payload.update(eval_parameters)

    if provider_name in [Provider.AMAZON_BEDROCK, Provider.BEDROCK]:
        if proxy_url or extra_headers:
            _logger.warning(
                "Proxy URL and extra headers are not supported for Bedrock LLMs. "
                "Ignoring the provided proxy URL and extra headers.",
            )
        response = provider._request(chat_payload)
    else:
        response = _send_request(
            endpoint=proxy_url or provider.get_endpoint_url("llm/v1/chat"),
            headers={**provider.headers, **extra_headers},
            payload=chat_payload,
        )
    chat_response = provider.adapter_class.model_to_chat(response, provider.config)
    if len(chat_response.choices) == 0:
        raise MlflowException(
            "Failed to score the provided input as the judge LLM did not return "
            "any chat completion results in the response."
        )
    content = chat_response.choices[0].message.content

    # NB: Evaluation only handles text content for now.
    return content[0].text if isinstance(content, list) else content


def _get_provider_instance(provider: str, model: str) -> "BaseProvider":
    """Get the provider instance for the given provider name and the model name."""
    from mlflow.gateway.config import EndpointConfig, Provider

    def _get_route_config(config):
        return EndpointConfig(
            name=provider,
            endpoint_type="llm/v1/chat",
            model={
                "provider": provider,
                "name": model,
                "config": config.model_dump(),
            },
        )

    # NB: Not all LLM providers in MLflow Gateway are supported here. We can add
    # new ones as requested, as long as the provider support chat endpoints.
    if provider == Provider.OPENAI:
        from mlflow.gateway.providers.openai import OpenAIConfig, OpenAIProvider
        from mlflow.openai.model import _get_api_config, _OAITokenHolder

        api_config = _get_api_config()
        api_token = _OAITokenHolder(api_config.api_type)
        api_token.refresh()

        config = OpenAIConfig(
            openai_api_key=api_token.token,
            openai_api_type=api_config.api_type or "openai",
            openai_api_base=api_config.api_base,
            openai_api_version=api_config.api_version,
            openai_deployment_name=api_config.deployment_id,
            openai_organization=api_config.organization,
        )
        return OpenAIProvider(_get_route_config(config))

    elif provider == Provider.ANTHROPIC:
        from mlflow.gateway.providers.anthropic import AnthropicConfig, AnthropicProvider

        config = AnthropicConfig(anthropic_api_key=os.environ.get("ANTHROPIC_API_KEY"))
        return AnthropicProvider(_get_route_config(config))

    elif provider in [Provider.AMAZON_BEDROCK, Provider.BEDROCK]:
        from mlflow.gateway.config import AWSIdAndKey, AWSRole
        from mlflow.gateway.providers.bedrock import AmazonBedrockConfig, AmazonBedrockProvider

        if aws_role_arn := os.environ.get("AWS_ROLE_ARN"):
            aws_config = AWSRole(
                aws_region=os.environ.get("AWS_REGION"),
                aws_role_arn=aws_role_arn,
            )
        else:
            aws_config = AWSIdAndKey(
                aws_region=os.environ.get("AWS_REGION"),
                aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
                aws_session_token=os.environ.get("AWS_SESSION_TOKEN"),
            )
        config = AmazonBedrockConfig(aws_config=aws_config)
        return AmazonBedrockProvider(_get_route_config(config))

    # # Cohere provider implementation seems to be broken and does not work with
    # # their latest APIs. Uncomment once the provider implementation is fixed.
    # elif provider == Provider.COHERE:
    #     from mlflow.gateway.providers.cohere import CohereConfig, CohereProvider

    #     config = CohereConfig(cohere_api_key=os.environ.get("COHERE_API_KEY"))
    #     return CohereProvider(_get_route_config(config))

    elif provider == Provider.MISTRAL:
        from mlflow.gateway.providers.mistral import MistralConfig, MistralProvider

        config = MistralConfig(mistral_api_key=os.environ.get("MISTRAL_API_KEY"))
        return MistralProvider(_get_route_config(config))

    elif provider == Provider.TOGETHERAI:
        from mlflow.gateway.providers.togetherai import TogetherAIConfig, TogetherAIProvider

        config = TogetherAIConfig(togetherai_api_key=os.environ.get("TOGETHERAI_API_KEY"))
        return TogetherAIProvider(_get_route_config(config))

    raise MlflowException(f"Provider '{provider}' is not supported for evaluation.")


def _send_request(
    endpoint: str, headers: dict[str, str], payload: dict[str, Any]
) -> dict[str, Any]:
    try:
        response = requests.post(
            url=endpoint,
            headers=headers,
            json=payload,
            timeout=60,
        )
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        raise MlflowException(
            f"Failed to call LLM endpoint at {endpoint}.\n- Error: {e}\n- Input payload: {payload}."
        )

    return response.json()


def call_deployments_api(
    deployment_uri: str,
    input_data: str | dict[str, Any],
    eval_parameters: dict[str, Any] | None = None,
    endpoint_type: str | None = None,
):
    """Call the deployment endpoint with the given payload and parameters.

    Args:
        deployment_uri: The URI of the deployment endpoint.
        input_data: The input string or dictionary to send to the endpoint.
            - If it is a string, MLflow tries to construct the payload based on the endpoint type.
            - If it is a dictionary, MLflow directly sends it to the endpoint.
        eval_parameters: The evaluation parameters to send to the endpoint.
        endpoint_type: The type of the endpoint. If specified, must be 'llm/v1/completions'
            or 'llm/v1/chat'. If not specified, MLflow tries to get the endpoint type
            from the endpoint, and if not found, directly sends the payload to the endpoint.

    Returns:
        The unpacked response from the endpoint.
    """
    from mlflow.deployments import get_deploy_client

    client = get_deploy_client()

    if isinstance(input_data, str):
        payload = _construct_payload_from_str(input_data, endpoint_type)
    elif isinstance(input_data, dict):
        # If the input is a dictionary, we assume it is already in the correct format
        payload = input_data
    else:
        raise MlflowException(
            f"Invalid input data type {type(input_data)}. Must be a string or a dictionary.",
            error_code=INVALID_PARAMETER_VALUE,
        )
    payload = {**payload, **(eval_parameters or {})}

    try:
        response = client.predict(endpoint=deployment_uri, inputs=payload)
    except Exception as e:
        raise MlflowException(
            _PREDICT_ERROR_MSG.format(e=e, uri=deployment_uri, payload=payload)
        ) from e

    return _parse_response(response, endpoint_type)


def _construct_payload_from_str(prompt: str, endpoint_type: str) -> dict[str, Any]:
    """
    Construct the payload from the input string based on the endpoint type.
    If the endpoint type is not specified or unsupported one, raise an exception.
    """
    if endpoint_type == "llm/v1/completions":
        return {"prompt": prompt}
    elif endpoint_type == "llm/v1/chat":
        return {"messages": [{"role": "user", "content": prompt}]}
    else:
        raise MlflowException(
            f"Unsupported endpoint type: {endpoint_type}. If string input is provided, "
            "the endpoint type must be 'llm/v1/completions' or 'llm/v1/chat'.",
            error_code=INVALID_PARAMETER_VALUE,
        )


def _parse_response(
    response: dict[str, Any], endpoint_type: str | None
) -> str | None | dict[str, Any]:
    if endpoint_type == "llm/v1/completions":
        return _parse_completions_response_format(response)
    elif endpoint_type == "llm/v1/chat":
        return _parse_chat_response_format(response)
    else:
        return response


def _parse_chat_response_format(response):
    try:
        text = response["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError):
        text = None
    return text


def _parse_completions_response_format(response):
    try:
        text = response["choices"][0]["text"]
    except (KeyError, IndexError, TypeError):
        text = None
    return text
```

--------------------------------------------------------------------------------

---[FILE: prompt_template.py]---
Location: mlflow-master/mlflow/metrics/genai/prompt_template.py

```python
import string
from typing import Any


class PromptTemplate:
    """A prompt template for a language model.

    A prompt template consists of an array of strings that will be concatenated together. It accepts
    a set of parameters from the user that can be used to generate a prompt for a language model.

    The template can be formatted using f-strings.

    Example:

        .. code-block:: python

            from mlflow.metrics.genai.prompt_template import PromptTemplate

            # Instantiation using initializer
            prompt = PromptTemplate(template_str="Say {foo} {baz}")

            # Instantiation using partial_fill
            prompt = PromptTemplate(template_str="Say {foo} {baz}").partial_fill(foo="bar")

            # Format the prompt
            prompt.format(baz="qux")
    """

    def __init__(self, template_str: str | list[str]):
        self.template_strs = [template_str] if isinstance(template_str, str) else template_str

    @property
    def variables(self):
        return {
            fname
            for template_str in self.template_strs
            for _, fname, _, _ in string.Formatter().parse(template_str)
            if fname
        }

    def format(self, **kwargs: Any) -> str:
        safe_kwargs = {k: v for k, v in kwargs.items() if v is not None}
        formatted_strs = []
        for template_str in self.template_strs:
            extracted_variables = [
                fname for _, fname, _, _ in string.Formatter().parse(template_str) if fname
            ]
            if all(item in safe_kwargs.keys() for item in extracted_variables):
                formatted_strs.append(template_str.format(**safe_kwargs))

        return "".join(formatted_strs)

    def partial_fill(self, **kwargs: Any) -> "PromptTemplate":
        safe_kwargs = {k: v for k, v in kwargs.items() if v is not None}
        new_template_strs = []
        for template_str in self.template_strs:
            extracted_variables = [
                fname for _, fname, _, _ in string.Formatter().parse(template_str) if fname
            ]
            safe_available_kwargs = {
                k: safe_kwargs.get(k, "{" + k + "}") for k in extracted_variables
            }
            new_template_strs.append(template_str.format_map(safe_available_kwargs))

        return PromptTemplate(template_str=new_template_strs)

    def __str__(self) -> str:
        return "".join(self.template_strs)
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/metrics/genai/utils.py

```python
_MIGRATION_GUIDE = (
    "Use the new GenAI evaluation functionality instead. See "
    "https://mlflow.org/docs/latest/genai/eval-monitor/legacy-llm-evaluation/ "
    "for the migration guide."
)


def _get_latest_metric_version():
    return "v1"


def _get_default_model():
    return "openai:/gpt-4"
```

--------------------------------------------------------------------------------

````
