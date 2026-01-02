---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 322
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 322 of 991)

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

---[FILE: pyfunc_wrapper.py]---
Location: mlflow-master/mlflow/llama_index/pyfunc_wrapper.py

```python
import asyncio
import threading
import uuid
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from llama_index.core import QueryBundle

from mlflow.models.utils import _convert_llm_input_data

CHAT_ENGINE_NAME = "chat"
QUERY_ENGINE_NAME = "query"
RETRIEVER_ENGINE_NAME = "retriever"
SUPPORTED_ENGINES = {CHAT_ENGINE_NAME, QUERY_ENGINE_NAME, RETRIEVER_ENGINE_NAME}

_CHAT_MESSAGE_HISTORY_PARAMETER_NAME = "chat_history"


def _convert_llm_input_data_with_unwrapping(data):
    """
    Transforms the input data to the format expected by the LlamaIndex engine.

    TODO: Migrate the unwrapping logic to mlflow.evaluate() function or _convert_llm_input_data,
    # because it is not specific to LlamaIndex.
    """
    data = _convert_llm_input_data(data)

    # For mlflow.evaluate() call, the input dataset will be a pandas DataFrame. The DF should have
    # a column named "inputs" which contains the actual query data. After the preprocessing, the
    # each row will be passed here as a dictionary with the key "inputs". Therefore, we need to
    # extract the actual query data from the dictionary.
    if isinstance(data, dict) and ("inputs" in data):
        data = data["inputs"]

    return data


def _format_predict_input_query_engine_and_retriever(data) -> "QueryBundle":
    """Convert pyfunc input to a QueryBundle."""
    from llama_index.core import QueryBundle

    data = _convert_llm_input_data_with_unwrapping(data)

    if isinstance(data, str):
        return QueryBundle(query_str=data)
    elif isinstance(data, dict):
        return QueryBundle(**data)
    elif isinstance(data, list):
        # NB: handle pandas returning lists when there is a single row
        prediction_input = [_format_predict_input_query_engine_and_retriever(d) for d in data]
        return prediction_input if len(prediction_input) > 1 else prediction_input[0]
    else:
        raise ValueError(
            f"Unsupported input type: {type(data)}. It must be one of "
            "[str, dict, list, numpy.ndarray, pandas.DataFrame]"
        )


class _LlamaIndexModelWrapperBase:
    def __init__(
        self,
        llama_model,  # Engine or Workflow
        model_config: dict[str, Any] | None = None,
    ):
        self._llama_model = llama_model
        self.model_config = model_config or {}

    @property
    def index(self):
        return self._llama_model.index

    def get_raw_model(self):
        return self._llama_model

    def _predict_single(self, *args, **kwargs) -> Any:
        raise NotImplementedError

    def _format_predict_input(self, data):
        raise NotImplementedError

    def _do_inference(self, input, params: dict[str, Any] | None) -> dict[str, Any]:
        """
        Perform engine inference on a single engine input e.g. not an iterable of
        engine inputs. The engine inputs must already be preprocessed/cleaned.
        """

        if isinstance(input, dict):
            return self._predict_single(**input, **(params or {}))
        else:
            return self._predict_single(input, **(params or {}))

    def predict(self, data, params: dict[str, Any] | None = None) -> list[str] | str:
        data = self._format_predict_input(data)

        if isinstance(data, list):
            return [self._do_inference(x, params) for x in data]
        else:
            return self._do_inference(data, params)


class ChatEngineWrapper(_LlamaIndexModelWrapperBase):
    @property
    def engine_type(self):
        return CHAT_ENGINE_NAME

    def _predict_single(self, *args, **kwargs) -> str:
        return self._llama_model.chat(*args, **kwargs).response

    @staticmethod
    def _convert_chat_message_history_to_chat_message_objects(
        data: dict[str, Any],
    ) -> dict[str, Any]:
        from llama_index.core.llms import ChatMessage

        if chat_message_history := data.get(_CHAT_MESSAGE_HISTORY_PARAMETER_NAME):
            if isinstance(chat_message_history, list):
                if all(isinstance(message, dict) for message in chat_message_history):
                    data[_CHAT_MESSAGE_HISTORY_PARAMETER_NAME] = [
                        ChatMessage(**message) for message in chat_message_history
                    ]
                else:
                    raise ValueError(
                        f"Unsupported input type: {type(chat_message_history)}. "
                        "It must be a list of dicts."
                    )

        return data

    def _format_predict_input(self, data) -> str | dict[str, Any] | list[Any]:
        data = _convert_llm_input_data_with_unwrapping(data)

        if isinstance(data, str):
            return data
        elif isinstance(data, dict):
            return self._convert_chat_message_history_to_chat_message_objects(data)
        elif isinstance(data, list):
            # NB: handle pandas returning lists when there is a single row
            prediction_input = [self._format_predict_input(d) for d in data]
            return prediction_input if len(prediction_input) > 1 else prediction_input[0]
        else:
            raise ValueError(
                f"Unsupported input type: {type(data)}. It must be one of "
                "[str, dict, list, numpy.ndarray, pandas.DataFrame]"
            )


class QueryEngineWrapper(_LlamaIndexModelWrapperBase):
    @property
    def engine_type(self):
        return QUERY_ENGINE_NAME

    def _predict_single(self, *args, **kwargs) -> str:
        return self._llama_model.query(*args, **kwargs).response

    def _format_predict_input(self, data) -> "QueryBundle":
        return _format_predict_input_query_engine_and_retriever(data)


class RetrieverEngineWrapper(_LlamaIndexModelWrapperBase):
    @property
    def engine_type(self):
        return RETRIEVER_ENGINE_NAME

    def _predict_single(self, *args, **kwargs) -> list[dict[str, Any]]:
        response = self._llama_model.retrieve(*args, **kwargs)
        return [node.dict() for node in response]

    def _format_predict_input(self, data) -> "QueryBundle":
        return _format_predict_input_query_engine_and_retriever(data)


class WorkflowWrapper(_LlamaIndexModelWrapperBase):
    @property
    def index(self):
        raise NotImplementedError("LlamaIndex Workflow does not have an index")

    @property
    def engine_type(self):
        raise NotImplementedError("LlamaIndex Workflow is not an engine")

    def predict(self, data, params: dict[str, Any] | None = None) -> list[str] | str:
        inputs = self._format_predict_input(data, params)

        # LlamaIndex Workflow runs async but MLflow pyfunc doesn't support async inference yet.
        predictions = self._wait_async_task(self._run_predictions(inputs))

        # Even if the input is single instance, the signature enforcement convert it to a Pandas
        # DataFrame with a single row. In this case, we should unwrap the result (list) so it
        # won't be inconsistent with the output without signature enforcement.
        should_unwrap = len(data) == 1 and isinstance(predictions, list)
        return predictions[0] if should_unwrap else predictions

    def _format_predict_input(
        self, data, params: dict[str, Any] | None = None
    ) -> list[dict[str, Any]]:
        inputs = _convert_llm_input_data_with_unwrapping(data)
        params = params or {}
        if isinstance(inputs, dict):
            return [{**inputs, **params}]
        return [{**x, **params} for x in inputs]

    async def _run_predictions(self, inputs: list[dict[str, Any]]) -> asyncio.Future:
        tasks = [self._predict_single(x) for x in inputs]
        return await asyncio.gather(*tasks)

    async def _predict_single(self, x: dict[str, Any]) -> Any:
        if not isinstance(x, dict):
            raise ValueError(f"Unsupported input type: {type(x)}. It must be a dictionary.")
        return await self._llama_model.run(**x)

    def _wait_async_task(self, task: asyncio.Future) -> Any:
        """
        A utility function to run async tasks in a blocking manner.

        If there is no event loop running already, for example, in a model serving endpoint,
        we can simply create a new event loop and run the task there. However, in a notebook
        environment (or pytest with asyncio decoration), there is already an event loop running
        at the root level and we cannot start a new one.
        """
        if not self._is_event_loop_running():
            return asyncio.new_event_loop().run_until_complete(task)
        else:
            # NB: The popular way to run async task where an event loop is already running is to
            # use nest_asyncio. However, nest_asyncio.apply() breaks the async OpenAI client
            # somehow, which is used for the most of LLM calls in LlamaIndex including Databricks
            # LLMs. Therefore, we use a hacky workaround that creates a new thread and run the
            # new event loop there. This may degrade the performance compared to the native
            # asyncio, but it should be fine because this is only used in the notebook env.
            results = None
            exception = None

            def _run():
                nonlocal results, exception

                try:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    results = loop.run_until_complete(task)
                except Exception as e:
                    exception = e
                finally:
                    loop.close()

            thread = threading.Thread(
                target=_run, name=f"mlflow_llamaindex_async_task_runner_{uuid.uuid4().hex[:8]}"
            )
            thread.start()
            thread.join()

            if exception:
                raise exception

            return results

    def _is_event_loop_running(self) -> bool:
        try:
            loop = asyncio.get_running_loop()
            return loop is not None
        except Exception:
            return False


def create_pyfunc_wrapper(
    model: Any,
    engine_type: str | None = None,
    model_config: dict[str, Any] | None = None,
):
    """
    A factory function that creates a Pyfunc wrapper around a LlamaIndex index/engine/workflow.

    Args:
        model: A LlamaIndex index/engine/workflow.
        engine_type: The type of the engine. Only required if `model` is an index
            and must be one of [chat, query, retriever].
        model_config: A dictionary of model configuration parameters.
    """
    try:
        from llama_index.core.workflow import Workflow

        if isinstance(model, Workflow):
            return _create_wrapper_from_workflow(model, model_config)
    except ImportError:
        pass

    from llama_index.core.indices.base import BaseIndex

    if isinstance(model, BaseIndex):
        return _create_wrapper_from_index(model, engine_type, model_config)
    else:
        # Engine does not have a common base class so we assume
        # everything else is an engine
        return _create_wrapper_from_engine(model, model_config)


def _create_wrapper_from_index(index, engine_type: str, model_config: dict[str, Any] | None = None):
    model_config = model_config or {}
    if engine_type == QUERY_ENGINE_NAME:
        engine = index.as_query_engine(**model_config)
        return QueryEngineWrapper(engine, model_config)
    elif engine_type == CHAT_ENGINE_NAME:
        engine = index.as_chat_engine(**model_config)
        return ChatEngineWrapper(engine, model_config)
    elif engine_type == RETRIEVER_ENGINE_NAME:
        engine = index.as_retriever(**model_config)
        return RetrieverEngineWrapper(engine, model_config)
    else:
        raise ValueError(
            f"Unsupported engine type: {engine_type}. It must be one of {SUPPORTED_ENGINES}"
        )


def _create_wrapper_from_engine(engine: Any, model_config: dict[str, Any] | None = None):
    from llama_index.core.base.base_query_engine import BaseQueryEngine
    from llama_index.core.chat_engine.types import BaseChatEngine
    from llama_index.core.retrievers import BaseRetriever

    if isinstance(engine, BaseChatEngine):
        return ChatEngineWrapper(engine, model_config)
    elif isinstance(engine, BaseQueryEngine):
        return QueryEngineWrapper(engine, model_config)
    elif isinstance(engine, BaseRetriever):
        return RetrieverEngineWrapper(engine, model_config)
    else:
        raise ValueError(
            f"Unsupported engine type: {type(engine)}. It must be one of {SUPPORTED_ENGINES}"
        )


def _create_wrapper_from_workflow(workflow: Any, model_config: dict[str, Any] | None = None):
    return WorkflowWrapper(workflow, model_config)
```

--------------------------------------------------------------------------------

---[FILE: serialize_objects.py]---
Location: mlflow-master/mlflow/llama_index/serialize_objects.py
Signals: Pydantic

```python
import importlib
import inspect
import json
import logging
from typing import Any, Callable

from llama_index.core import PromptTemplate
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.callbacks.base import CallbackManager
from llama_index.core.schema import BaseComponent

_logger = logging.getLogger(__name__)


def _get_object_import_path(o: object) -> str:
    if not inspect.isclass(o):
        o = o.__class__

    module_name = inspect.getmodule(o).__name__
    class_name = o.__qualname__

    # Validate the import
    module = importlib.import_module(module_name)
    if not hasattr(module, class_name):
        raise ValueError(f"Module {module} does not have {class_name}")

    return f"{module_name}.{class_name}"


def _sanitize_api_key(object_as_dict: dict[str, str]) -> dict[str, str]:
    return {k: v for k, v in object_as_dict.items() if "api_key" not in k.lower()}


def object_to_dict(o: object):
    if isinstance(o, (list, tuple)):
        return [object_to_dict(v) for v in o]

    if isinstance(o, BaseComponent):
        # we can't serialize callables in the model fields
        callable_fields = set()
        # Access model_fields from the class to avoid pydantic deprecation warning
        fields = (
            o.__class__.model_fields if hasattr(o.__class__, "model_fields") else o.model_fields
        )
        for k, v in fields.items():
            field_val = getattr(o, k, None)
            # Exclude all callable fields, including those with default values
            # to prevent serialization issues in llama_index
            if callable(field_val):
                callable_fields.add(k)
        # exclude default values from serialization to avoid
        # unnecessary clutter in the serialized object
        o_state_as_dict = o.to_dict(exclude=callable_fields)

        if o_state_as_dict != {}:
            o_state_as_dict = _sanitize_api_key(o_state_as_dict)
            o_state_as_dict.pop("class_name")
        else:
            return o_state_as_dict

        return {
            "object_constructor": _get_object_import_path(o),
            "object_kwargs": o_state_as_dict,
        }
    else:
        return None


def _construct_prompt_template_object(
    constructor: Callable[..., PromptTemplate], kwargs: dict[str, Any]
) -> PromptTemplate:
    """Construct a PromptTemplate object based on the constructor and kwargs.

    This method is necessary because the `template_vars` cannot be passed directly to the
    constructor and needs to be set on an instantiated object.
    """
    if template := kwargs.pop("template", None):
        prompt_template = constructor(template)
        for k, v in kwargs.items():
            setattr(prompt_template, k, v)

        return prompt_template
    else:
        raise ValueError(
            "'template' is a required kwargs and is not present in the prompt template kwargs."
        )


def dict_to_object(object_representation: dict[str, Any]) -> object:
    if "object_constructor" not in object_representation:
        raise ValueError("'object_constructor' key not found in dict.")
    if "object_kwargs" not in object_representation:
        raise ValueError("'object_kwargs' key not found in dict.")

    constructor_str = object_representation["object_constructor"]
    kwargs = object_representation["object_kwargs"]

    import_path, class_name = constructor_str.rsplit(".", 1)
    module = importlib.import_module(import_path)

    if isinstance(module, PromptTemplate):
        return _construct_prompt_template_object(module, kwargs)
    else:
        object_class = getattr(module, class_name)

        # Many embeddings model accepts parameter `model`, while BaseEmbedding accepts `model_name`.
        # Both parameters will be serialized as kwargs, but passing both to the constructor will
        # raise duplicate argument error. Some class like OpenAIEmbedding handles this in its
        # constructor, but not all integrations do. Therefore, we have to handle it here.
        # E.g. https://github.com/run-llama/llama_index/blob/2b18eb4654b14c68d63f6239cddb10740668fbc8/llama-index-integrations/embeddings/llama-index-embeddings-openai/llama_index/embeddings/openai/base.py#L316-L320
        if (
            issubclass(object_class, BaseEmbedding)
            and (model := kwargs.get("model"))
            and (model_name := kwargs.get("model_name"))
            and model == model_name
        ):
            kwargs.pop("model_name")

        return object_class.from_dict(kwargs)


def _deserialize_dict_of_objects(path: str) -> dict[str, Any]:
    with open(path) as f:
        to_deserialize = json.load(f)

        output = {}
        for k, v in to_deserialize.items():
            if isinstance(v, list):
                output.update({k: [dict_to_object(vv) for vv in v]})
            else:
                output.update({k: dict_to_object(v)})

        return output


def serialize_settings(path: str) -> None:
    """Serialize the global LlamaIndex Settings object to a JSON file at the given path."""
    from llama_index.core import Settings

    _logger.info(
        "API key(s) will be removed from the global Settings object during serialization "
        "to protect against key leakage. At inference time, the key(s) must be passed as "
        "environment variables."
    )

    to_serialize = {}
    unsupported_objects = []

    for k, v in Settings.__dict__.items():
        if v is None:
            continue

        # Setting.callback_manager is default to an empty CallbackManager instance.
        if (k == "_callback_manager") and isinstance(v, CallbackManager) and v.handlers == []:
            continue

        def _convert(obj):
            object_json = object_to_dict(obj)
            if object_json is None:
                prop_name = k.removeprefix("_")
                unsupported_objects.append((prop_name, v))
            return object_json

        if isinstance(v, list):
            to_serialize[k] = [_convert(obj) for obj in v if v is not None]
        else:
            if (object_json := _convert(v)) and (object_json is not None):
                to_serialize[k] = object_json

    if unsupported_objects:
        msg = (
            "The following objects in Settings are not supported for serialization and will not "
            "be logged with your model. MLflow only supports serialization of objects that inherit "
            "from llama_index.core.schema.BaseComponent.\n"
        )
        msg += "\n".join(f" - {type(v).__name__} for Settings.{k}" for k, v in unsupported_objects)
        _logger.info(msg)

    with open(path, "w") as f:
        json.dump(to_serialize, f, indent=2)


def deserialize_settings(path: str):
    """Deserialize the global LlamaIndex Settings object from a JSON file at the given path."""
    settings_dict = _deserialize_dict_of_objects(path)

    from llama_index.core import Settings

    for k, v in settings_dict.items():
        # To use the property setter rather than directly setting the private attribute e.g. _llm
        k = k.removeprefix("_")
        setattr(Settings, k, v)
```

--------------------------------------------------------------------------------

````
