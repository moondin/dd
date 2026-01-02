---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 696
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 696 of 991)

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

---[FILE: uc_oss_rest_store.py]---
Location: mlflow-master/mlflow/store/_unity_catalog/registry/uc_oss_rest_store.py

```python
import functools
import os
import shutil
from contextlib import contextmanager

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.protos.unity_catalog_oss_messages_pb2 import (
    READ_WRITE_MODEL_VERSION,
    CreateModelVersion,
    CreateRegisteredModel,
    DeleteModelVersion,
    DeleteRegisteredModel,
    FinalizeModelVersion,
    GenerateTemporaryModelVersionCredential,
    GetModelVersion,
    GetRegisteredModel,
    ListModelVersions,
    ListRegisteredModels,
    ModelVersionInfo,
    RegisteredModelInfo,
    TemporaryCredentials,
    UpdateModelVersion,
    UpdateRegisteredModel,
)
from mlflow.protos.unity_catalog_oss_service_pb2 import UnityCatalogService
from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository
from mlflow.store.entities.paged_list import PagedList
from mlflow.store.model_registry.base_rest_store import BaseRestStore
from mlflow.utils._unity_catalog_oss_utils import (
    get_model_version_from_uc_oss_proto,
    get_model_version_search_from_uc_oss_proto,
    get_registered_model_from_uc_oss_proto,
    get_registered_model_search_from_uc_oss_proto,
    parse_model_name,
)
from mlflow.utils._unity_catalog_utils import (
    get_artifact_repo_from_storage_info,
    get_full_name_from_sc,
)
from mlflow.utils.oss_registry_utils import get_oss_host_creds
from mlflow.utils.proto_json_utils import message_to_json
from mlflow.utils.rest_utils import (
    _UC_OSS_REST_API_PATH_PREFIX,
    call_endpoint,
    extract_all_api_info_for_service,
    extract_api_info_for_service,
)
from mlflow.utils.uri import is_file_uri, is_fuse_or_uc_volumes_uri

_METHOD_TO_INFO = extract_api_info_for_service(UnityCatalogService, _UC_OSS_REST_API_PATH_PREFIX)
_METHOD_TO_ALL_INFO = extract_all_api_info_for_service(
    UnityCatalogService, _UC_OSS_REST_API_PATH_PREFIX
)


def _raise_unsupported_arg(arg_name, message=None):
    messages = [
        f"Argument '{arg_name}' is unsupported for models in the Unity Catalog.",
    ]
    if message is not None:
        messages.append(message)
    raise MlflowException(" ".join(messages))


def _require_arg_unspecified(arg_name, arg_value, default_values=None, message=None):
    default_values = [None] if default_values is None else default_values
    if arg_value not in default_values:
        _raise_unsupported_arg(arg_name, message)


class UnityCatalogOssStore(BaseRestStore):
    """
    Client for an Open Source Unity Catalog Server accessed via REST API calls.
    """

    def __init__(self, store_uri):
        super().__init__(get_host_creds=functools.partial(get_oss_host_creds, store_uri))
        self.tracking_uri = None  # OSS has no tracking URI

    def _get_response_from_method(self, method):
        method_to_response = {
            CreateRegisteredModel: RegisteredModelInfo,
            CreateModelVersion: ModelVersionInfo,
            UpdateRegisteredModel: RegisteredModelInfo,
            DeleteRegisteredModel: DeleteRegisteredModel,
            DeleteModelVersion: DeleteModelVersion.Response,
            GetRegisteredModel: RegisteredModelInfo,
            GetModelVersion: ModelVersionInfo,
            FinalizeModelVersion: ModelVersionInfo,
            UpdateModelVersion: ModelVersionInfo,
            GenerateTemporaryModelVersionCredential: TemporaryCredentials,
            ListRegisteredModels: ListRegisteredModels.Response,
            ListModelVersions: ListModelVersions.Response,
        }
        return method_to_response[method]()

    def _get_endpoint_from_method(self, method):
        return _METHOD_TO_INFO[method]

    def _get_all_endpoints_from_method(self, method):
        return _METHOD_TO_ALL_INFO[method]

    def create_registered_model(self, name, tags=None, description=None, deployment_job_id=None):
        """
        Create a new registered model in backend store.

        Args:
            name: Name of the new model. This is expected to be unique in the backend store.
            tags: Not supported for Unity Catalog OSS yet.
            description: Description of the model.
            deployment_job_id: Optional deployment job ID.

        Returns:
            A single object of :py:class:`mlflow.entities.model_registry.RegisteredModel`
            created in the backend.

        """
        [catalog_name, schema_name, model_name] = name.split(".")
        comment = description or ""
        # RegisteredModelInfo is inlined in the request and the response.
        # https://docs.databricks.com/api/workspace/registeredmodels/create
        # TODO: Update the above reference to UC OSS documentation when it's available
        req_body = message_to_json(
            CreateRegisteredModel(
                name=model_name,
                catalog_name=catalog_name,
                schema_name=schema_name,
                comment=comment,
            )
        )
        registered_model_info = self._call_endpoint(CreateRegisteredModel, req_body)
        return get_registered_model_from_uc_oss_proto(registered_model_info)

    def update_registered_model(self, name, description, deployment_job_id=None):
        """
        Update description of the registered model.

        Args:
            name: Registered model name.
            description: New description.
            deployment_job_id: Optional deployment job ID.

        Returns:
            A single updated :py:class:`mlflow.entities.model_registry.RegisteredModel` object.
        """
        full_name = get_full_name_from_sc(name, None)
        comment = description or ""
        req_body = message_to_json(
            UpdateRegisteredModel(
                full_name=full_name,
                comment=comment,
            )
        )
        endpoint, method = _METHOD_TO_INFO[UpdateRegisteredModel]
        registered_model_info = self._edit_endpoint_and_call(
            endpoint=endpoint,
            method=method,
            req_body=req_body,
            full_name=full_name,
            proto_name=UpdateRegisteredModel,
        )
        return get_registered_model_from_uc_oss_proto(registered_model_info)

    def rename_registered_model(self, name, new_name):
        raise NotImplementedError("Method not implemented")

    def delete_registered_model(self, name):
        """
        Delete the registered model.
        Backend raises exception if a registered model with given name does not exist.

        Args:
            name: Registered model name.

        Returns:
            None
        """
        full_name = get_full_name_from_sc(name, None)
        req_body = message_to_json(
            DeleteRegisteredModel(
                full_name=full_name,
            )
        )
        endpoint, method = _METHOD_TO_INFO[DeleteRegisteredModel]
        self._edit_endpoint_and_call(
            endpoint=endpoint,
            method=method,
            req_body=req_body,
            full_name=full_name,
            proto_name=DeleteRegisteredModel,
        )

    def search_registered_models(
        self, filter_string=None, max_results=None, order_by=None, page_token=None
    ):
        """
        Search for registered models in backend that satisfy the filter criteria.

        Args:
            filter_string: Filter query string, defaults to searching all registered models.
            max_results: Maximum number of registered models desired.
            order_by: List of column names with ASC|DESC annotation, to be used for ordering
                matching search results.
            page_token: Token specifying the next page of results. It should be obtained from
                a ``search_registered_models`` call.

        Returns:
            A PagedList of :py:class:`mlflow.entities.model_registry.RegisteredModel` objects
            that satisfy the search expressions. The pagination token for the next page can be
            obtained via the ``token`` attribute of the object.

        """
        _require_arg_unspecified("filter_string", filter_string)
        _require_arg_unspecified("order_by", order_by)
        req_body = message_to_json(
            ListRegisteredModels(
                max_results=max_results,
                page_token=page_token,
            )
        )
        endpoint, method = _METHOD_TO_INFO[ListRegisteredModels]
        response_proto = call_endpoint(
            self.get_host_creds(),
            endpoint=endpoint,
            method=method,
            json_body=req_body,
            response_proto=self._get_response_from_method(ListRegisteredModels),
        )
        registered_models = [
            get_registered_model_search_from_uc_oss_proto(registered_model)
            for registered_model in response_proto.registered_models
        ]
        return PagedList(registered_models, response_proto.next_page_token)

    def get_registered_model(self, name):
        full_name = get_full_name_from_sc(name, None)
        req_body = message_to_json(GetRegisteredModel(full_name=full_name))
        endpoint, method = _METHOD_TO_INFO[GetRegisteredModel]
        registered_model_info = self._edit_endpoint_and_call(
            endpoint=endpoint,
            method=method,
            req_body=req_body,
            full_name=full_name,
            proto_name=GetRegisteredModel,
            version=None,
        )
        return get_registered_model_from_uc_oss_proto(registered_model_info)

    def get_latest_versions(self, name, stages=None):
        raise NotImplementedError("Method not implemented")

    def set_registered_model_tag(self, name, tag):
        raise NotImplementedError("Method not implemented")

    def delete_registered_model_tag(self, name, key):
        raise NotImplementedError("Method not implemented")

    def create_model_version(
        self,
        name,
        source,
        run_id=None,
        tags=None,
        run_link=None,
        description=None,
        local_model_path=None,
        model_id: str | None = None,
    ):
        with self._local_model_dir(source, local_model_path) as local_model_dir:
            [catalog_name, schema_name, model_name] = name.split(".")
            req_body = message_to_json(
                CreateModelVersion(
                    model_name=model_name,
                    catalog_name=catalog_name,
                    schema_name=schema_name,
                    source=source,
                    run_id=run_id,
                    comment=description,
                )
            )
            model_version = self._call_endpoint(CreateModelVersion, req_body)
            store = self._get_artifact_repo(model_version)
            store.log_artifacts(local_dir=local_model_dir, artifact_path="")
            endpoint, method = _METHOD_TO_INFO[FinalizeModelVersion]
            finalize_req_body = message_to_json(
                FinalizeModelVersion(full_name=name, version=model_version.version)
            )
            registered_model_version = self._edit_endpoint_and_call(
                endpoint=endpoint,
                method=method,
                req_body=finalize_req_body,
                full_name=name,
                proto_name=FinalizeModelVersion,
                version=model_version.version,
            )
            return get_model_version_from_uc_oss_proto(registered_model_version)

    def update_model_version(self, name, version, description):
        full_name = get_full_name_from_sc(name, None)
        version = int(version)
        req_body = message_to_json(
            UpdateModelVersion(
                full_name=full_name,
                version=version,
                comment=description,
            )
        )
        endpoint, method = _METHOD_TO_INFO[UpdateModelVersion]
        registered_model_version = self._edit_endpoint_and_call(
            endpoint=endpoint,
            method=method,
            req_body=req_body,
            full_name=full_name,
            proto_name=UpdateModelVersion,
            version=version,
        )
        return get_model_version_from_uc_oss_proto(registered_model_version)

    def transition_model_version_stage(self, name, version, stage, archive_existing_versions):
        raise NotImplementedError("Method not implemented")

    def delete_model_version(self, name, version):
        full_name = get_full_name_from_sc(name, None)
        version = int(version)
        req_body = message_to_json(DeleteModelVersion(full_name=full_name, version=version))
        endpoint, method = _METHOD_TO_INFO[DeleteModelVersion]
        return self._edit_endpoint_and_call(
            endpoint=endpoint,
            method=method,
            req_body=req_body,
            full_name=full_name,
            proto_name=FinalizeModelVersion,
            version=version,
        )

    # This method exists to return the actual UC response object,
    # which contains the storage location
    def _get_model_version_endpoint_response(self, name, version):
        full_name = get_full_name_from_sc(name, None)
        version = int(version)
        req_body = message_to_json(GetModelVersion(full_name=full_name, version=version))
        endpoint, method = _METHOD_TO_INFO[GetModelVersion]
        return self._edit_endpoint_and_call(
            endpoint=endpoint,
            method=method,
            req_body=req_body,
            full_name=full_name,
            proto_name=GetModelVersion,
            version=version,
        )

    def get_model_version(self, name, version):
        return get_model_version_from_uc_oss_proto(
            self._get_model_version_endpoint_response(name, version)
        )

    def search_model_versions(
        self, filter_string=None, max_results=None, order_by=None, page_token=None
    ):
        """
        Search for model versions in backend that satisfy the filter criteria.

        Args:
            filter_string: A filter string expression. Currently supports a single filter
                condition either name of model like ``name = 'model_name'``
            max_results: Maximum number of model versions desired.
            order_by: List of column names with ASC|DESC annotation, to be used for ordering
                matching search results.
            page_token: Token specifying the next page of results. It should be obtained from
                a ``search_model_versions`` call.

        Returns:
            A PagedList of :py:class:`mlflow.entities.model_registry.ModelVersion`
            objects that satisfy the search expressions. The pagination token for the next
            page can be obtained via the ``token`` attribute of the object.

        """
        _require_arg_unspecified(arg_name="order_by", arg_value=order_by)
        full_name = parse_model_name(filter_string)
        req_body = message_to_json(
            ListModelVersions(full_name=full_name, page_token=page_token, max_results=max_results)
        )
        endpoint, method = _METHOD_TO_INFO[ListModelVersions]
        response_proto = self._edit_endpoint_and_call(
            endpoint=endpoint,
            method=method,
            req_body=req_body,
            full_name=full_name,
            proto_name=ListModelVersions,
        )
        model_versions = [
            get_model_version_search_from_uc_oss_proto(mvd) for mvd in response_proto.model_versions
        ]
        return PagedList(model_versions, response_proto.next_page_token)

    def set_model_version_tag(self, name, version, tag):
        raise NotImplementedError("Method not implemented")

    def delete_model_version_tag(self, name, version, key):
        raise NotImplementedError("Method not implemented")

    def set_registered_model_alias(self, name, alias, version):
        raise NotImplementedError("Method not implemented")

    def delete_registered_model_alias(self, name, alias):
        raise NotImplementedError("Method not implemented")

    def get_model_version_by_alias(self, name, alias):
        raise NotImplementedError("Method not implemented")

    def _get_artifact_repo(self, model_version):
        if is_file_uri(model_version.storage_location):
            return LocalArtifactRepository(artifact_uri=model_version.storage_location)

        def base_credential_refresh_def():
            return self._get_temporary_model_version_write_credentials_oss(
                model_name=model_version.model_name,
                catalog_name=model_version.catalog_name,
                schema_name=model_version.schema_name,
                version=model_version.version,
            )

        scoped_token = base_credential_refresh_def()

        return get_artifact_repo_from_storage_info(
            storage_location=model_version.storage_location,
            scoped_token=scoped_token,
            base_credential_refresh_def=base_credential_refresh_def,
            is_oss=True,
        )

    def _get_temporary_model_version_write_credentials_oss(
        self, model_name, catalog_name, schema_name, version
    ):
        """
        Get temporary credentials for uploading model version files

        Args:
            name: Registered model name.
            version: Model version number.

        Returns:
            mlflow.protos.unity_catalog_oss_messages_pb2.TemporaryCredentials containing
            temporary model version credentials.
        """
        req_body = message_to_json(
            GenerateTemporaryModelVersionCredential(
                catalog_name=catalog_name,
                schema_name=schema_name,
                model_name=model_name,
                version=int(version),
                operation=READ_WRITE_MODEL_VERSION,
            )
        )
        return self._call_endpoint(GenerateTemporaryModelVersionCredential, req_body)

    def get_model_version_download_uri(self, name, version):
        response = self._get_model_version_endpoint_response(name, int(version))
        return response.storage_location

    @contextmanager
    def _local_model_dir(self, source, local_model_path):
        if local_model_path is not None:
            yield local_model_path
        else:
            try:
                local_model_dir = mlflow.artifacts.download_artifacts(
                    artifact_uri=source, tracking_uri=self.tracking_uri
                )
            except Exception as e:
                raise MlflowException(
                    "Unable to download model artifacts from source artifact location "
                    f"'{source}' in order to upload them to Unity Catalog. Please ensure "
                    "the source artifact location exists and that you can download from "
                    f"it via mlflow.artifacts.download_artifacts(). Original error: {e}"
                ) from e
            try:
                yield local_model_dir
            finally:
                # Clean up temporary model directory at end of block. We assume a temporary
                # model directory was created if the `source` is not a local path
                # (must be downloaded from remote to a temporary directory) and
                # `local_model_dir` is not a FUSE-mounted path. The check for FUSE-mounted
                # paths is important as mlflow.artifacts.download_artifacts() can return
                # a FUSE mounted path equivalent to the (remote) source path in some cases,
                # e.g. return /dbfs/some/path for source dbfs:/some/path.
                if not os.path.exists(source) and not is_fuse_or_uc_volumes_uri(local_model_dir):
                    shutil.rmtree(local_model_dir)

    def _edit_endpoint_and_call(
        self, endpoint, method, req_body, full_name, proto_name, version=None
    ):
        if version is not None:
            endpoint = endpoint.replace("{full_name}", full_name).replace("{version}", str(version))
        else:
            endpoint = endpoint.replace("{full_name}", full_name)
        return call_endpoint(
            self.get_host_creds(),
            endpoint=endpoint,
            method=method,
            json_body=req_body,
            response_proto=self._get_response_from_method(proto_name),
        )
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/store/_unity_catalog/registry/utils.py

```python
"""
Utility functions for converting between Unity Catalog proto and MLflow entities.
"""

import json

from mlflow.entities.model_registry.prompt import Prompt
from mlflow.entities.model_registry.prompt_version import PromptVersion
from mlflow.prompt.constants import RESPONSE_FORMAT_TAG_KEY
from mlflow.protos.unity_catalog_prompt_messages_pb2 import (
    PromptAlias as ProtoPromptAlias,
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


def proto_to_mlflow_tags(proto_tags: list[ProtoPromptTag]) -> dict[str, str]:
    """Convert proto prompt tags to MLflow tags dictionary."""
    return {tag.key: tag.value for tag in proto_tags} if proto_tags else {}


def mlflow_tags_to_proto(tags: dict[str, str]) -> list[ProtoPromptTag]:
    """Convert MLflow tags dictionary to proto prompt tags."""
    return [ProtoPromptTag(key=k, value=v) for k, v in tags.items()] if tags else []


def proto_version_tags_to_mlflow_tags(
    proto_tags: list[ProtoPromptVersionTag],
) -> dict[str, str]:
    """Convert proto prompt version tags to MLflow tags dictionary."""
    return {tag.key: tag.value for tag in proto_tags} if proto_tags else {}


def mlflow_tags_to_proto_version_tags(tags: dict[str, str]) -> list[ProtoPromptVersionTag]:
    """Convert MLflow tags dictionary to proto prompt version tags."""
    return [ProtoPromptVersionTag(key=k, value=v) for k, v in tags.items()] if tags else []


def proto_info_to_mlflow_prompt_info(
    proto_info,  # Prompt type from protobuf
    prompt_tags: dict[str, str] | None = None,
) -> Prompt:
    """Convert proto Prompt to MLflow PromptInfo entity.

    Prompt doesn't have template or version fields.
    This is used for create_prompt and search_prompts responses.
    """
    tags = proto_to_mlflow_tags(proto_info.tags) if proto_info.tags else {}
    if prompt_tags:
        tags.update(prompt_tags)

    return Prompt(
        name=proto_info.name,
        description=proto_info.description,
        tags=tags,
    )


def proto_to_mlflow_prompt(
    proto_version,  # PromptVersion type from protobuf
) -> PromptVersion:
    """Convert proto PromptVersion to MLflow prompt entity.

    PromptVersion has template and version fields.
    This is used for get_prompt_version responses.
    """
    # Extract version tags
    version_tags = (
        proto_version_tags_to_mlflow_tags(proto_version.tags) if proto_version.tags else {}
    )
    if RESPONSE_FORMAT_TAG_KEY in version_tags:
        response_format = json.loads(version_tags[RESPONSE_FORMAT_TAG_KEY])
    else:
        response_format = None

    version_tags = {
        key: value for key, value in version_tags.items() if not key.startswith("_mlflow")
    }

    # Extract aliases
    aliases = []
    if hasattr(proto_version, "aliases") and proto_version.aliases:
        aliases = [alias.alias for alias in proto_version.aliases]

    if not proto_version.version:
        raise ValueError("Prompt is missing its version field.")
    version = int(proto_version.version)

    return PromptVersion(
        name=proto_version.name,
        version=version,
        template=json.loads(proto_version.template),
        commit_message=proto_version.description,
        creation_timestamp=proto_version.creation_timestamp,
        tags=version_tags,
        aliases=aliases,
        response_format=response_format,
    )


def mlflow_prompt_to_proto(prompt: PromptVersion) -> ProtoPromptVersion:
    """Convert MLflow prompt entity to proto prompt version."""
    proto_version = ProtoPromptVersion()
    proto_version.name = prompt.name
    proto_version.version = str(prompt.version)
    proto_version.template = prompt.template
    if prompt.commit_message:
        proto_version.description = prompt.commit_message
    if prompt.creation_timestamp:
        proto_version.creation_timestamp = prompt.creation_timestamp

    # Add version tags
    if prompt.tags:
        proto_version.tags.extend(mlflow_tags_to_proto_version_tags(prompt.tags))

    # Add aliases
    if prompt.aliases:
        for alias in prompt.aliases:
            alias_proto = ProtoPromptAlias()
            alias_proto.alias = alias
            alias_proto.version = str(prompt.version)
            proto_version.aliases.append(alias_proto)

    return proto_version
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/store/_unity_catalog/registry/__init__.py

```python
from mlflow.store._unity_catalog.registry import (
    rest_store as rest_store,
)
from mlflow.store._unity_catalog.registry import (
    uc_oss_rest_store as uc_oss_rest_store,
)
```

--------------------------------------------------------------------------------

---[FILE: autolog.py]---
Location: mlflow-master/mlflow/strands/autolog.py

```python
import json
import logging

from opentelemetry.context import Context
from opentelemetry.sdk.trace import (
    ReadableSpan as OTelReadableSpan,
)
from opentelemetry.sdk.trace import (
    Span as OTelSpan,
)
from opentelemetry.sdk.trace import (
    TracerProvider as SDKTracerProvider,
)
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, SpanExporter
from opentelemetry.trace import (
    NoOpTracer,
    NoOpTracerProvider,
    ProxyTracerProvider,
    get_tracer_provider,
    set_tracer_provider,
)

from mlflow.entities import SpanType
from mlflow.entities.span import LiveSpan, create_mlflow_span
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.provider import _get_tracer
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import (
    _bypass_attribute_guard,
    get_mlflow_span_for_otel_span,
    get_otel_attribute,
)

_logger = logging.getLogger(__name__)


class StrandsSpanProcessor(SimpleSpanProcessor):
    def __init__(self):
        self.span_exporter = SpanExporter()

    def on_start(self, span: OTelSpan, parent_context: Context | None = None):
        tracer = _get_tracer(__name__)
        if isinstance(tracer, NoOpTracer):
            return

        tracer.span_processor.on_start(span, parent_context)
        trace_id = get_otel_attribute(span, SpanAttributeKey.REQUEST_ID)
        mlflow_span = create_mlflow_span(span, trace_id)
        InMemoryTraceManager.get_instance().register_span(mlflow_span)

    def on_end(self, span: OTelReadableSpan) -> None:
        mlflow_span = get_mlflow_span_for_otel_span(span)
        if mlflow_span is None:
            _logger.debug("Span not found in the map. Skipping end.")
            return
        with _bypass_attribute_guard(mlflow_span._span):
            _set_span_type(mlflow_span, span)
            _set_inputs_outputs(mlflow_span, span)
            _set_token_usage(mlflow_span, span)
        tracer = _get_tracer(__name__)
        tracer.span_processor.on_end(span)


def setup_strands_tracing():
    processor = StrandsSpanProcessor()
    provider = get_tracer_provider()
    if isinstance(provider, (NoOpTracerProvider, ProxyTracerProvider)):
        new_provider = SDKTracerProvider()
        new_provider.add_span_processor(processor)
        set_tracer_provider(new_provider)
    else:
        if not any(
            isinstance(p, StrandsSpanProcessor)
            for p in provider._active_span_processor._span_processors
        ):
            provider.add_span_processor(processor)


def teardown_strands_tracing():
    provider = get_tracer_provider()
    if isinstance(provider, SDKTracerProvider):
        span_processors = getattr(provider._active_span_processor, "_span_processors", ())
        provider._active_span_processor._span_processors = tuple(
            p for p in span_processors if not isinstance(p, StrandsSpanProcessor)
        )


def _set_span_type(mlflow_span: LiveSpan, span: OTelReadableSpan) -> None:
    operation = span.attributes.get("gen_ai.operation.name")
    # "invoke_agent" for single agent and "invoke_{agent_name}" for multi agents
    if isinstance(operation, str) and operation.startswith("invoke_"):
        mlflow_span.set_span_type(SpanType.AGENT)
    elif operation == "execute_tool":
        mlflow_span.set_span_type(SpanType.TOOL)
    elif operation == "chat":
        mlflow_span.set_span_type(SpanType.CHAT_MODEL)
    else:
        pass


def _parse_json(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except Exception:
            return value
    return value


def _set_inputs_outputs(mlflow_span: LiveSpan, span: OTelReadableSpan) -> None:
    inputs = []
    outputs = []
    for event in span.events:
        if event.name in {"gen_ai.user.message", "gen_ai.tool.message"}:
            content = _parse_json(event.attributes.get("content"))
            role = "user" if event.name == "gen_ai.user.message" else "tool"
            inputs.append({"role": role, "content": content})
        elif event.name == "gen_ai.choice":
            message = _parse_json(event.attributes.get("message"))
            outputs.append(message)
    if inputs:
        mlflow_span.set_inputs(inputs)
    if outputs:
        mlflow_span.set_outputs(outputs if len(outputs) > 1 else outputs[0])


def _set_token_usage(mlflow_span: LiveSpan, span: OTelReadableSpan) -> None:
    # Strands agents contain complete token usage information in the AGENT span
    # We don't need to set token usage for the AGENT span to avoid double counting
    if mlflow_span.get_attribute(SpanAttributeKey.SPAN_TYPE) == SpanType.AGENT:
        return

    usage = {}
    if (v := span.attributes.get("gen_ai.usage.input_tokens")) is not None:
        usage[TokenUsageKey.INPUT_TOKENS] = v
    if (v := span.attributes.get("gen_ai.usage.output_tokens")) is not None:
        usage[TokenUsageKey.OUTPUT_TOKENS] = v
    if (v := span.attributes.get("gen_ai.usage.total_tokens")) is not None:
        usage[TokenUsageKey.TOTAL_TOKENS] = v
    if usage:
        mlflow_span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/strands/__init__.py

```python
import logging

from mlflow.strands.autolog import setup_strands_tracing, teardown_strands_tracing
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.annotations import experimental
from mlflow.utils.autologging_utils import autologging_integration

FLAVOR_NAME = "strands"
_logger = logging.getLogger(__name__)


@experimental(version="3.4.0")
def autolog(log_traces: bool = True, disable: bool = False, silent: bool = False):
    """
    Enables (or disables) and configures autologging from Strands Agents SDK to MLflow.

    Args:
        log_traces: If ``True``, traces are logged for Strands Agents.
        disable: If ``True``, disables Strands autologging.
        silent: If ``True``, suppresses all MLflow event logs and warnings.
    """
    _autolog(log_traces=log_traces, disable=disable, silent=silent)
    if disable or not log_traces:
        teardown_strands_tracing()
    else:
        setup_strands_tracing()

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )


# This is required by mlflow.autolog()
autolog.integration_name = FLAVOR_NAME


@autologging_integration(FLAVOR_NAME)
def _autolog(log_traces: bool = True, disable: bool = False, silent: bool = False):
    """
    This function exists solely to attach the autologging_integration decorator without
    preventing cleanup logic from running when disable=True. Do not add implementation here.
    """
```

--------------------------------------------------------------------------------

````
