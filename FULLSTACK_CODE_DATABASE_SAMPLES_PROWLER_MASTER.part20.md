---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 20
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 20 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: pagination.py]---
Location: prowler-master/api/src/backend/api/pagination.py

```python
from drf_spectacular_jsonapi.schemas.pagination import JsonApiPageNumberPagination


class ComplianceOverviewPagination(JsonApiPageNumberPagination):
    page_size = 50
    max_page_size = 100
```

--------------------------------------------------------------------------------

---[FILE: partitions.py]---
Location: prowler-master/api/src/backend/api/partitions.py
Signals: Django

```python
from datetime import datetime, timezone
from typing import Generator, Optional

from dateutil.relativedelta import relativedelta
from django.conf import settings
from psqlextra.partitioning import (
    PostgresPartitioningManager,
    PostgresRangePartition,
    PostgresRangePartitioningStrategy,
    PostgresTimePartitionSize,
    PostgresPartitioningError,
)
from psqlextra.partitioning.config import PostgresPartitioningConfig
from uuid6 import UUID

from api.models import Finding, ResourceFindingMapping
from api.rls import RowLevelSecurityConstraint
from api.uuid_utils import datetime_to_uuid7


class PostgresUUIDv7RangePartition(PostgresRangePartition):
    def __init__(
        self,
        from_values: UUID,
        to_values: UUID,
        size: PostgresTimePartitionSize,
        name_format: Optional[str] = None,
        **kwargs,
    ) -> None:
        self.from_values = from_values
        self.to_values = to_values
        self.size = size
        self.name_format = name_format

        self.rls_statements = None
        if "rls_statements" in kwargs:
            self.rls_statements = kwargs["rls_statements"]

        start_timestamp_ms = self.from_values.time

        self.start_datetime = datetime.fromtimestamp(
            start_timestamp_ms / 1000, timezone.utc
        )

    def name(self) -> str:
        if not self.name_format:
            raise PostgresPartitioningError("Unknown size/unit")

        return self.start_datetime.strftime(self.name_format).lower()

    def deconstruct(self) -> dict:
        return {
            **super().deconstruct(),
            "size_unit": self.size.unit.value,
            "size_value": self.size.value,
        }

    def create(
        self,
        model,
        schema_editor,
        comment,
    ) -> None:
        super().create(model, schema_editor, comment)

        # if this model has RLS statements, add them to the partition
        if isinstance(self.rls_statements, list):
            schema_editor.add_constraint(
                model,
                constraint=RowLevelSecurityConstraint(
                    "tenant_id",
                    name=f"rls_on_{self.name()}",
                    partition_name=self.name(),
                    statements=self.rls_statements,
                ),
            )


class PostgresUUIDv7PartitioningStrategy(PostgresRangePartitioningStrategy):
    def __init__(
        self,
        size: PostgresTimePartitionSize,
        count: int,
        start_date: datetime = None,
        max_age: Optional[relativedelta] = None,
        name_format: Optional[str] = None,
        **kwargs,
    ) -> None:
        self.start_date = start_date.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )
        self.size = size
        self.count = count
        self.max_age = max_age
        self.name_format = name_format

        self.rls_statements = None
        if "rls_statements" in kwargs:
            self.rls_statements = kwargs["rls_statements"]

    def to_create(self) -> Generator[PostgresUUIDv7RangePartition, None, None]:
        current_datetime = (
            self.start_date if self.start_date else self.get_start_datetime()
        )

        for _ in range(self.count):
            end_datetime = (
                current_datetime + self.size.as_delta() - relativedelta(microseconds=1)
            )
            start_uuid7 = datetime_to_uuid7(current_datetime)
            end_uuid7 = datetime_to_uuid7(end_datetime)

            yield PostgresUUIDv7RangePartition(
                from_values=start_uuid7,
                to_values=end_uuid7,
                size=self.size,
                name_format=self.name_format,
                rls_statements=self.rls_statements,
            )

            current_datetime += self.size.as_delta()

    def to_delete(self) -> Generator[PostgresUUIDv7RangePartition, None, None]:
        if not self.max_age:
            return

        current_datetime = self.get_start_datetime() - self.max_age

        while True:
            end_datetime = current_datetime + self.size.as_delta()
            start_uuid7 = datetime_to_uuid7(current_datetime)
            end_uuid7 = datetime_to_uuid7(end_datetime)

            # dropping table will delete indexes and policies
            yield PostgresUUIDv7RangePartition(
                from_values=start_uuid7,
                to_values=end_uuid7,
                size=self.size,
                name_format=self.name_format,
            )

            current_datetime -= self.size.as_delta()

    def get_start_datetime(self) -> datetime:
        """
        Gets the start of the current month in UTC timezone.

        This function returns a `datetime` object set to the first day of the current
        month, at midnight (00:00:00), in UTC.

        Returns:
            datetime: A `datetime` object representing the start of the current month in UTC.
        """
        return datetime.now(timezone.utc).replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )


def relative_days_or_none(value):
    if value is None:
        return None
    return relativedelta(days=value)


#
# To manage the partitions, run `python manage.py pgpartition --using admin`
#
# For more info on the partitioning manager, see https://github.com/SectorLabs/django-postgres-extra
manager = PostgresPartitioningManager(
    [
        PostgresPartitioningConfig(
            model=Finding,
            strategy=PostgresUUIDv7PartitioningStrategy(
                start_date=datetime.now(timezone.utc),
                size=PostgresTimePartitionSize(
                    months=settings.FINDINGS_TABLE_PARTITION_MONTHS
                ),
                count=settings.FINDINGS_TABLE_PARTITION_COUNT,
                max_age=relative_days_or_none(
                    settings.FINDINGS_TABLE_PARTITION_MAX_AGE_MONTHS
                ),
                name_format="%Y_%b",
                rls_statements=["SELECT", "INSERT", "UPDATE", "DELETE"],
            ),
        ),
        # ResourceFindingMapping should always follow the Finding partitioning
        PostgresPartitioningConfig(
            model=ResourceFindingMapping,
            strategy=PostgresUUIDv7PartitioningStrategy(
                start_date=datetime.now(timezone.utc),
                size=PostgresTimePartitionSize(
                    months=settings.FINDINGS_TABLE_PARTITION_MONTHS
                ),
                count=settings.FINDINGS_TABLE_PARTITION_COUNT,
                max_age=relative_days_or_none(
                    settings.FINDINGS_TABLE_PARTITION_MAX_AGE_MONTHS
                ),
                name_format="%Y_%b",
                rls_statements=["SELECT"],
            ),
        ),
    ]
)
```

--------------------------------------------------------------------------------

---[FILE: renderers.py]---
Location: prowler-master/api/src/backend/api/renderers.py

```python
from contextlib import nullcontext

from rest_framework_json_api.renderers import JSONRenderer

from api.db_utils import rls_transaction


class APIJSONRenderer(JSONRenderer):
    """JSONRenderer override to apply tenant RLS when there are included resources in the request."""

    def render(self, data, accepted_media_type=None, renderer_context=None):
        request = renderer_context.get("request")
        tenant_id = getattr(request, "tenant_id", None) if request else None
        db_alias = getattr(request, "db_alias", None) if request else None
        include_param_present = "include" in request.query_params if request else False

        # Use rls_transaction if needed for included resources, otherwise do nothing
        context_manager = (
            rls_transaction(tenant_id, using=db_alias)
            if tenant_id and include_param_present
            else nullcontext()
        )
        with context_manager:
            return super().render(data, accepted_media_type, renderer_context)
```

--------------------------------------------------------------------------------

---[FILE: rls.py]---
Location: prowler-master/api/src/backend/api/rls.py
Signals: Django

```python
from typing import Any
from uuid import uuid4

from django.core.exceptions import ValidationError
from django.db import DEFAULT_DB_ALIAS, models
from django.db.backends.ddl_references import Statement, Table

from api.db_utils import DB_USER, POSTGRES_TENANT_VAR


class Tenant(models.Model):
    """
    The Tenant is the basic grouping in the system. It is used to separate data between customers.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    inserted_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "tenants"

    class JSONAPIMeta:
        resource_name = "tenants"


class RowLevelSecurityConstraint(models.BaseConstraint):
    """
    Model constraint to enforce row-level security on a tenant based model, in addition to the least privileges.

    The constraint can be applied to a partitioned table by specifying the `partition_name` keyword argument.
    """

    rls_sql_query = """
        ALTER TABLE %(table_name)s ENABLE ROW LEVEL SECURITY;
        ALTER TABLE %(table_name)s FORCE ROW LEVEL SECURITY;
    """

    policy_sql_query = """
        CREATE POLICY %(db_user)s_%(table_name)s_{statement}
        ON %(table_name)s
        FOR {statement}
        TO %(db_user)s
        {clause} (
            CASE
                WHEN current_setting('%(tenant_setting)s', True) IS NULL THEN FALSE
                ELSE %(field_column)s = current_setting('%(tenant_setting)s')::uuid
            END
        );
    """

    grant_sql_query = """
        GRANT {statement} ON %(table_name)s TO %(db_user)s;
    """

    drop_sql_query = """
        ALTER TABLE %(table_name)s NO FORCE ROW LEVEL SECURITY;
        ALTER TABLE %(table_name)s DISABLE ROW LEVEL SECURITY;
        REVOKE ALL ON TABLE %(table_name)s FROM %(db_user)s;
    """

    drop_policy_sql_query = """
        DROP POLICY IF EXISTS %(db_user)s_%(raw_table_name)s_{statement} ON %(table_name)s;
    """

    def __init__(
        self, field: str, name: str, statements: list | None = None, **kwargs
    ) -> None:
        super().__init__(name=name)
        self.target_field: str = field
        self.statements = statements or ["SELECT"]
        self.partition_name = None
        if "partition_name" in kwargs:
            self.partition_name = kwargs["partition_name"]

    def create_sql(self, model: Any, schema_editor: Any) -> Any:
        field_column = schema_editor.quote_name(self.target_field)

        policy_queries = ""
        grant_queries = ""
        for statement in self.statements:
            clause = f"{'WITH CHECK' if statement == 'INSERT' else 'USING'}"
            policy_queries = f"{policy_queries}{self.policy_sql_query.format(statement=statement, clause=clause)}"
            grant_queries = (
                f"{grant_queries}{self.grant_sql_query.format(statement=statement)}"
            )

        full_create_sql_query = f"{self.rls_sql_query}{policy_queries}{grant_queries}"

        table_name = model._meta.db_table
        if self.partition_name:
            table_name = f"{table_name}_{self.partition_name}"

        return Statement(
            full_create_sql_query,
            table_name=table_name,
            field_column=field_column,
            db_user=DB_USER,
            tenant_setting=POSTGRES_TENANT_VAR,
            partition_name=self.partition_name,
        )

    def remove_sql(self, model: Any, schema_editor: Any) -> Any:
        field_column = schema_editor.quote_name(self.target_field)
        raw_table_name = model._meta.db_table
        table_name = raw_table_name
        if self.partition_name:
            raw_table_name = f"{raw_table_name}_{self.partition_name}"
            table_name = raw_table_name

        full_drop_sql_query = (
            f"{self.drop_sql_query}"
            f"{''.join([self.drop_policy_sql_query.format(statement=statement) for statement in self.statements])}"
        )
        return Statement(
            full_drop_sql_query,
            table_name=Table(table_name, schema_editor.quote_name),
            raw_table_name=raw_table_name,
            field_column=field_column,
            db_user=DB_USER,
            partition_name=self.partition_name,
        )

    def __eq__(self, other: object) -> bool:
        if isinstance(other, RowLevelSecurityConstraint):
            return self.name == other.name and self.target_field == other.target_field
        return super().__eq__(other)

    def deconstruct(self) -> tuple[str, tuple, dict]:
        path, _, kwargs = super().deconstruct()
        return (path, (self.target_field,), kwargs)

    def validate(self, model, instance, exclude=None, using=DEFAULT_DB_ALIAS):  # noqa: F841
        if not hasattr(instance, "tenant_id"):
            raise ValidationError(f"{model.__name__} does not have a tenant_id field.")


class BaseSecurityConstraint(models.BaseConstraint):
    """Model constraint to grant the least privileges to the API database user."""

    grant_sql_query = """
        GRANT {statement} ON %(table_name)s TO %(db_user)s;
    """

    drop_sql_query = """
        REVOKE ALL ON TABLE %(table_name) TO %(db_user)s;
    """

    def __init__(self, name: str, statements: list | None = None) -> None:
        super().__init__(name=name)
        self.statements = statements or ["SELECT"]

    def create_sql(self, model: Any, schema_editor: Any) -> Any:
        grant_queries = ""
        for statement in self.statements:
            grant_queries = (
                f"{grant_queries}{self.grant_sql_query.format(statement=statement)}"
            )

        return Statement(
            grant_queries,
            table_name=model._meta.db_table,
            db_user=DB_USER,
        )

    def remove_sql(self, model: Any, schema_editor: Any) -> Any:
        return Statement(
            self.drop_sql_query,
            table_name=Table(model._meta.db_table, schema_editor.quote_name),
            db_user=DB_USER,
        )

    def __eq__(self, other: object) -> bool:
        if isinstance(other, BaseSecurityConstraint):
            return self.name == other.name
        return super().__eq__(other)

    def deconstruct(self) -> tuple[str, tuple, dict]:
        path, args, kwargs = super().deconstruct()
        return path, args, kwargs


class RowLevelSecurityProtectedModel(models.Model):
    tenant = models.ForeignKey("Tenant", on_delete=models.CASCADE)

    class Meta:
        abstract = True
```

--------------------------------------------------------------------------------

---[FILE: schema_extensions.py]---
Location: prowler-master/api/src/backend/api/schema_extensions.py

```python
from drf_spectacular.extensions import OpenApiAuthenticationExtension
from drf_spectacular.openapi import AutoSchema


class CombinedJWTOrAPIKeyAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = "api.authentication.CombinedJWTOrAPIKeyAuthentication"
    name = "JWT or API Key"

    def get_security_definition(self, auto_schema: AutoSchema):  # noqa: F841
        return {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Supports both JWT Bearer tokens and API Key authentication. "
            "Use `Bearer <token>` for JWT or `Api-Key <key>` for API keys.",
        }
```

--------------------------------------------------------------------------------

---[FILE: schema_hooks.py]---
Location: prowler-master/api/src/backend/api/schema_hooks.py

```python
def _pick_task_response_component(components):
    schemas = components.get("schemas", {}) or {}
    for candidate in ("TaskResponse",):
        if candidate in schemas:
            return candidate
    return None


def _extract_task_example_from_components(components):
    schemas = components.get("schemas", {}) or {}
    candidate = "TaskResponse"
    doc = schemas.get(candidate)
    if isinstance(doc, dict) and "example" in doc:
        return doc["example"]

    res = schemas.get(candidate)
    if isinstance(res, dict) and "example" in res:
        example = res["example"]
        return example if "data" in example else {"data": example}

    # Fallback
    return {
        "data": {
            "type": "tasks",
            "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
            "attributes": {
                "inserted_at": "2019-08-24T14:15:22Z",
                "completed_at": "2019-08-24T14:15:22Z",
                "name": "string",
                "state": "available",
                "result": None,
                "task_args": None,
                "metadata": None,
            },
        }
    }


def attach_task_202_examples(result, generator, request, public):  # noqa: F841
    if not isinstance(result, dict):
        return result

    components = result.get("components", {}) or {}
    task_resp_component = _pick_task_response_component(components)
    task_example = _extract_task_example_from_components(components)

    paths = result.get("paths", {}) or {}
    for path_item in paths.values():
        if not isinstance(path_item, dict):
            continue

        for method_obj in path_item.values():
            if not isinstance(method_obj, dict):
                continue

            responses = method_obj.get("responses", {}) or {}
            resp_202 = responses.get("202")
            if not isinstance(resp_202, dict):
                continue

            content = resp_202.get("content", {}) or {}
            jsonapi = content.get("application/vnd.api+json")
            if not isinstance(jsonapi, dict):
                continue

            # Inject example if missing
            if "examples" not in jsonapi and "example" not in jsonapi:
                jsonapi["examples"] = {
                    "Task queued": {
                        "summary": "Task queued",
                        "value": task_example,
                    }
                }

            # Rewrite schema $ref if needed
            if task_resp_component:
                schema = jsonapi.get("schema")
                must_replace = False
                if not isinstance(schema, dict):
                    must_replace = True
                else:
                    ref = schema.get("$ref")
                    if not ref:
                        must_replace = True
                    else:
                        current = ref.split("/")[-1]
                        if current != task_resp_component:
                            must_replace = True

                if must_replace:
                    jsonapi["schema"] = {
                        "$ref": f"#/components/schemas/{task_resp_component}"
                    }

    return result
```

--------------------------------------------------------------------------------

---[FILE: signals.py]---
Location: prowler-master/api/src/backend/api/signals.py
Signals: Django, Celery

```python
from celery import states
from celery.signals import before_task_publish
from config.celery import celery_app
from django.db.models.signals import post_delete, pre_delete
from django.dispatch import receiver
from django_celery_results.backends.database import DatabaseBackend

from api.db_utils import delete_related_daily_task
from api.models import (
    LighthouseProviderConfiguration,
    LighthouseTenantConfiguration,
    Membership,
    Provider,
    TenantAPIKey,
    User,
)


def create_task_result_on_publish(sender=None, headers=None, **kwargs):  # noqa: F841
    """Celery signal to store TaskResult entries when tasks reach the broker."""
    db_result_backend = DatabaseBackend(celery_app)
    request = type("request", (object,), headers)

    db_result_backend.store_result(
        headers["id"],
        None,
        states.PENDING,
        traceback=None,
        request=request,
    )


before_task_publish.connect(
    create_task_result_on_publish, dispatch_uid="create_task_result_on_publish"
)


@receiver(post_delete, sender=Provider)
def delete_provider_scan_task(sender, instance, **kwargs):  # noqa: F841
    # Delete the associated periodic task when the provider is deleted
    delete_related_daily_task(instance.id)


@receiver(pre_delete, sender=User)
def revoke_user_api_keys(sender, instance, **kwargs):  # noqa: F841
    """
    Revoke all API keys associated with a user before deletion.

    The entity field will be set to NULL by on_delete=SET_NULL,
    but we explicitly revoke the keys to prevent further use.
    """
    TenantAPIKey.objects.filter(entity=instance).update(revoked=True)


@receiver(post_delete, sender=Membership)
def revoke_membership_api_keys(sender, instance, **kwargs):  # noqa: F841
    """
    Revoke all API keys when a user is removed from a tenant.

    When a membership is deleted, all API keys created by that user
    in that tenant should be revoked to prevent further access.
    """
    TenantAPIKey.objects.filter(
        entity=instance.user, tenant_id=instance.tenant.id
    ).update(revoked=True)


@receiver(pre_delete, sender=LighthouseProviderConfiguration)
def cleanup_lighthouse_defaults_before_delete(sender, instance, **kwargs):  # noqa: F841
    """
    Ensure tenant Lighthouse defaults do not reference a soon-to-be-deleted provider.

    This runs for both per-instance deletes and queryset (bulk) deletes.
    """
    try:
        tenant_cfg = LighthouseTenantConfiguration.objects.get(
            tenant_id=instance.tenant_id
        )
    except LighthouseTenantConfiguration.DoesNotExist:
        return

    updated = False
    defaults = tenant_cfg.default_models or {}

    if instance.provider_type in defaults:
        defaults.pop(instance.provider_type, None)
        tenant_cfg.default_models = defaults
        updated = True

    if tenant_cfg.default_provider == instance.provider_type:
        tenant_cfg.default_provider = ""
        updated = True

    if updated:
        tenant_cfg.save()
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: prowler-master/api/src/backend/api/utils.py
Signals: Django

```python
from datetime import datetime, timezone

from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import Subquery
from rest_framework.exceptions import NotFound, ValidationError

from api.db_router import MainRouter
from api.db_utils import rls_transaction
from api.exceptions import InvitationTokenExpiredException
from api.models import Integration, Invitation, Processor, Provider, Resource
from api.v1.serializers import FindingMetadataSerializer
from prowler.lib.outputs.jira.jira import Jira, JiraBasicAuthError
from prowler.providers.aws.aws_provider import AwsProvider
from prowler.providers.aws.lib.s3.s3 import S3
from prowler.providers.aws.lib.security_hub.security_hub import SecurityHub
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.common.models import Connection
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.github.github_provider import GithubProvider
from prowler.providers.iac.iac_provider import IacProvider
from prowler.providers.kubernetes.kubernetes_provider import KubernetesProvider
from prowler.providers.m365.m365_provider import M365Provider
from prowler.providers.mongodbatlas.mongodbatlas_provider import MongodbatlasProvider
from prowler.providers.oraclecloud.oraclecloud_provider import OraclecloudProvider


class CustomOAuth2Client(OAuth2Client):
    def __init__(self, client_id, secret, *args, **kwargs):
        # Remove any duplicate "scope_delimiter" from kwargs
        # Bug present in dj-rest-auth after version v7.0.1
        # https://github.com/iMerica/dj-rest-auth/issues/673
        kwargs.pop("scope_delimiter", None)
        super().__init__(client_id, secret, *args, **kwargs)


def merge_dicts(default_dict: dict, replacement_dict: dict) -> dict:
    """
    Recursively merge two dictionaries, using `default_dict` as the base and `replacement_dict` for overriding values.

    Args:
        default_dict (dict): The base dictionary containing default key-value pairs.
        replacement_dict (dict): The dictionary containing values that should override those in `default_dict`.

    Returns:
        dict: A new dictionary containing all keys from `default_dict` with values from `replacement_dict` replacing
              any overlapping keys. If a key in both `default_dict` and `replacement_dict` contains dictionaries,
              this function will merge them recursively.
    """
    result = default_dict.copy()

    for key, value in replacement_dict.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            if value:
                result[key] = merge_dicts(result[key], value)
            else:
                result[key] = value
        else:
            result[key] = value

    return result


def return_prowler_provider(
    provider: Provider,
) -> [
    AwsProvider
    | AzureProvider
    | GcpProvider
    | GithubProvider
    | IacProvider
    | KubernetesProvider
    | M365Provider
    | MongodbatlasProvider
    | OraclecloudProvider
]:
    """Return the Prowler provider class based on the given provider type.

    Args:
        provider (Provider): The provider object containing the provider type and associated secrets.

    Returns:
        AwsProvider | AzureProvider | GcpProvider | GithubProvider | IacProvider | KubernetesProvider | M365Provider | OraclecloudProvider | MongodbatlasProvider: The corresponding provider class.

    Raises:
        ValueError: If the provider type specified in `provider.provider` is not supported.
    """
    match provider.provider:
        case Provider.ProviderChoices.AWS.value:
            prowler_provider = AwsProvider
        case Provider.ProviderChoices.GCP.value:
            prowler_provider = GcpProvider
        case Provider.ProviderChoices.AZURE.value:
            prowler_provider = AzureProvider
        case Provider.ProviderChoices.KUBERNETES.value:
            prowler_provider = KubernetesProvider
        case Provider.ProviderChoices.M365.value:
            prowler_provider = M365Provider
        case Provider.ProviderChoices.GITHUB.value:
            prowler_provider = GithubProvider
        case Provider.ProviderChoices.MONGODBATLAS.value:
            prowler_provider = MongodbatlasProvider
        case Provider.ProviderChoices.IAC.value:
            prowler_provider = IacProvider
        case Provider.ProviderChoices.ORACLECLOUD.value:
            prowler_provider = OraclecloudProvider
        case _:
            raise ValueError(f"Provider type {provider.provider} not supported")
    return prowler_provider


def get_prowler_provider_kwargs(
    provider: Provider, mutelist_processor: Processor | None = None
) -> dict:
    """Get the Prowler provider kwargs based on the given provider type.

    Args:
        provider (Provider): The provider object containing the provider type and associated secret.
        mutelist_processor (Processor): The mutelist processor object containing the mutelist configuration.

    Returns:
        dict: The provider kwargs for the corresponding provider class.
    """
    prowler_provider_kwargs = provider.secret.secret
    if provider.provider == Provider.ProviderChoices.AZURE.value:
        prowler_provider_kwargs = {
            **prowler_provider_kwargs,
            "subscription_ids": [provider.uid],
        }
    elif provider.provider == Provider.ProviderChoices.GCP.value:
        prowler_provider_kwargs = {
            **prowler_provider_kwargs,
            "project_ids": [provider.uid],
        }
    elif provider.provider == Provider.ProviderChoices.KUBERNETES.value:
        prowler_provider_kwargs = {**prowler_provider_kwargs, "context": provider.uid}
    elif provider.provider == Provider.ProviderChoices.GITHUB.value:
        if provider.uid:
            prowler_provider_kwargs = {
                **prowler_provider_kwargs,
                "organizations": [provider.uid],
            }
    elif provider.provider == Provider.ProviderChoices.IAC.value:
        # For IaC provider, uid contains the repository URL
        # Extract the access token if present in the secret
        prowler_provider_kwargs = {
            "scan_repository_url": provider.uid,
        }
        if "access_token" in provider.secret.secret:
            prowler_provider_kwargs["oauth_app_token"] = provider.secret.secret[
                "access_token"
            ]
    elif provider.provider == Provider.ProviderChoices.MONGODBATLAS.value:
        prowler_provider_kwargs = {
            **prowler_provider_kwargs,
            "atlas_organization_id": provider.uid,
        }

    if mutelist_processor:
        mutelist_content = mutelist_processor.configuration.get("Mutelist", {})
        # IaC provider doesn't support mutelist (uses Trivy's built-in logic)
        if mutelist_content and provider.provider != Provider.ProviderChoices.IAC.value:
            prowler_provider_kwargs["mutelist_content"] = mutelist_content

    return prowler_provider_kwargs


def initialize_prowler_provider(
    provider: Provider,
    mutelist_processor: Processor | None = None,
) -> (
    AwsProvider
    | AzureProvider
    | GcpProvider
    | GithubProvider
    | IacProvider
    | KubernetesProvider
    | M365Provider
    | MongodbatlasProvider
    | OraclecloudProvider
):
    """Initialize a Prowler provider instance based on the given provider type.

    Args:
        provider (Provider): The provider object containing the provider type and associated secrets.
        mutelist_processor (Processor): The mutelist processor object containing the mutelist configuration.

    Returns:
        AwsProvider | AzureProvider | GcpProvider | GithubProvider | IacProvider | KubernetesProvider | M365Provider | OraclecloudProvider | MongodbatlasProvider: An instance of the corresponding provider class
            (`AwsProvider`, `AzureProvider`, `GcpProvider`, `GithubProvider`, `IacProvider`, `KubernetesProvider`, `M365Provider`, `OraclecloudProvider` or `MongodbatlasProvider`) initialized with the
            provider's secrets.
    """
    prowler_provider = return_prowler_provider(provider)
    prowler_provider_kwargs = get_prowler_provider_kwargs(provider, mutelist_processor)
    return prowler_provider(**prowler_provider_kwargs)


def prowler_provider_connection_test(provider: Provider) -> Connection:
    """Test the connection to a Prowler provider based on the given provider type.

    Args:
        provider (Provider): The provider object containing the provider type and associated secrets.

    Returns:
        Connection: A connection object representing the result of the connection test for the specified provider.
    """
    prowler_provider = return_prowler_provider(provider)

    try:
        prowler_provider_kwargs = provider.secret.secret
    except Provider.secret.RelatedObjectDoesNotExist as secret_error:
        return Connection(is_connected=False, error=secret_error)

    # For IaC provider, construct the kwargs properly for test_connection
    if provider.provider == Provider.ProviderChoices.IAC.value:
        # Don't pass repository_url from secret, use scan_repository_url with the UID
        iac_test_kwargs = {
            "scan_repository_url": provider.uid,
            "raise_on_exception": False,
        }
        # Add access_token if present in the secret
        if "access_token" in prowler_provider_kwargs:
            iac_test_kwargs["access_token"] = prowler_provider_kwargs["access_token"]
        return prowler_provider.test_connection(**iac_test_kwargs)
    else:
        return prowler_provider.test_connection(
            **prowler_provider_kwargs,
            provider_id=provider.uid,
            raise_on_exception=False,
        )


def prowler_integration_connection_test(integration: Integration) -> Connection:
    """Test the connection to a Prowler integration based on the given integration type.

    Args:
        integration (Integration): The integration object containing the integration type and associated credentials.

    Returns:
        Connection: A connection object representing the result of the connection test for the specified integration.
    """
    if integration.integration_type == Integration.IntegrationChoices.AMAZON_S3:
        return S3.test_connection(
            **integration.credentials,
            bucket_name=integration.configuration["bucket_name"],
            raise_on_exception=False,
        )
    # TODO: It is possible that we can unify the connection test for all integrations, but need refactoring
    # to avoid code duplication. Actually the AWS integrations are similar, so SecurityHub and S3 can be unified
    # making some changes in the SDK.
    elif (
        integration.integration_type == Integration.IntegrationChoices.AWS_SECURITY_HUB
    ):
        # Get the provider associated with this integration
        provider_relationship = integration.integrationproviderrelationship_set.first()
        if not provider_relationship:
            return Connection(
                is_connected=False, error="No provider associated with this integration"
            )

        credentials = (
            integration.credentials
            if integration.credentials
            else provider_relationship.provider.secret.secret
        )
        connection = SecurityHub.test_connection(
            aws_account_id=provider_relationship.provider.uid,
            raise_on_exception=False,
            **credentials,
        )

        # Only save regions if connection is successful
        if connection.is_connected:
            regions_status = {r: True for r in connection.enabled_regions}
            regions_status.update({r: False for r in connection.disabled_regions})

            # Save regions information in the integration configuration
            integration.configuration["regions"] = regions_status
            integration.save()
        else:
            # Reset regions information if connection fails
            integration.configuration["regions"] = {}
            integration.save()

        return connection
    elif integration.integration_type == Integration.IntegrationChoices.JIRA:
        jira_connection = Jira.test_connection(
            **integration.credentials,
            raise_on_exception=False,
        )
        project_keys = jira_connection.projects if jira_connection.is_connected else {}
        with rls_transaction(str(integration.tenant_id)):
            integration.configuration["projects"] = project_keys
            integration.save()
        return jira_connection
    elif integration.integration_type == Integration.IntegrationChoices.SLACK:
        pass
    else:
        raise ValueError(
            f"Integration type {integration.integration_type} not supported"
        )


def validate_invitation(
    invitation_token: str, email: str, raise_not_found=False
) -> Invitation:
    """
    Validates an invitation based on the provided token and email.

    This function attempts to retrieve an Invitation object using the given
    `invitation_token` and `email`. It performs several checks to ensure that
    the invitation is valid, not expired, and in the correct state for acceptance.

    Args:
        invitation_token (str): The token associated with the invitation.
        email (str): The email address associated with the invitation.
        raise_not_found (bool, optional): If True, raises a `NotFound` exception
            when the invitation is not found. If False, raises a `ValidationError`.
            Defaults to False.

    Returns:
        Invitation: The validated Invitation object.

    Raises:
        NotFound: If `raise_not_found` is True and the invitation does not exist.
        ValidationError: If the invitation does not exist and `raise_not_found`
            is False, or if the invitation is invalid or in an incorrect state.
        InvitationTokenExpiredException: If the invitation has expired.

    Notes:
        - This function uses the admin database connector to bypass RLS protection
          since the invitation may belong to a tenant the user is not a member of yet.
        - If the invitation has expired, its state is updated to EXPIRED, and an
          `InvitationTokenExpiredException` is raised.
        - Only invitations in the PENDING state can be accepted.

    Examples:
        invitation = validate_invitation("TOKEN123", "user@example.com")
    """
    try:
        # Admin DB connector is used to bypass RLS protection since the invitation belongs to a tenant the user
        # is not a member of yet
        invitation = Invitation.objects.using(MainRouter.admin_db).get(
            token=invitation_token, email__iexact=email
        )
    except Invitation.DoesNotExist:
        if raise_not_found:
            raise NotFound(detail="Invitation is not valid.")
        else:
            raise ValidationError({"invitation_token": "Invalid invitation code."})

    # Check if the invitation has expired
    if invitation.expires_at < datetime.now(timezone.utc):
        invitation.state = Invitation.State.EXPIRED
        invitation.save(using=MainRouter.admin_db)
        raise InvitationTokenExpiredException()

    # Check the state of the invitation
    if invitation.state != Invitation.State.PENDING:
        raise ValidationError(
            {"invitation_token": "This invitation is no longer valid."}
        )

    return invitation


# ToRemove after removing the fallback mechanism in /findings/metadata
def get_findings_metadata_no_aggregations(tenant_id: str, filtered_queryset):
    filtered_ids = filtered_queryset.order_by().values("id")

    relevant_resources = Resource.all_objects.filter(
        tenant_id=tenant_id, findings__id__in=Subquery(filtered_ids)
    ).only("service", "region", "type")

    aggregation = relevant_resources.aggregate(
        services=ArrayAgg("service", flat=True),
        regions=ArrayAgg("region", flat=True),
        resource_types=ArrayAgg("type", flat=True),
    )

    services = sorted(set(aggregation["services"] or []))
    regions = sorted({region for region in aggregation["regions"] or [] if region})
    resource_types = sorted(set(aggregation["resource_types"] or []))

    # Aggregate categories from findings
    categories_set = set()
    for categories_list in filtered_queryset.values_list("categories", flat=True):
        if categories_list:
            categories_set.update(categories_list)
    categories = sorted(categories_set)

    result = {
        "services": services,
        "regions": regions,
        "resource_types": resource_types,
        "categories": categories,
    }

    serializer = FindingMetadataSerializer(data=result)
    serializer.is_valid(raise_exception=True)

    return serializer.data


def initialize_prowler_integration(integration: Integration) -> Jira:
    # TODO Refactor other integrations to use this function
    if integration.integration_type == Integration.IntegrationChoices.JIRA:
        try:
            return Jira(**integration.credentials)
        except JiraBasicAuthError as jira_auth_error:
            with rls_transaction(str(integration.tenant_id)):
                integration.configuration["projects"] = {}
                integration.connected = False
                integration.connection_last_checked_at = datetime.now(tz=timezone.utc)
                integration.save()
            raise jira_auth_error
```

--------------------------------------------------------------------------------

````
