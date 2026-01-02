---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 38
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 38 of 867)

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

---[FILE: test_providers.py]---
Location: prowler-master/api/src/backend/api/tests/integration/test_providers.py
Signals: Django

```python
from unittest.mock import Mock, patch

import pytest
from conftest import get_api_tokens, get_authorization_header
from django.urls import reverse
from rest_framework.test import APIClient

from api.models import Provider


@patch("api.v1.views.Task.objects.get")
@patch("api.v1.views.delete_provider_task.delay")
@pytest.mark.django_db
def test_delete_provider_without_executing_task(
    mock_delete_task, mock_task_get, create_test_user, tenants_fixture, tasks_fixture
):
    client = APIClient()

    test_user = "test_email@prowler.com"
    test_password = "Test_password1@"

    prowler_task = tasks_fixture[0]
    task_mock = Mock()
    task_mock.id = prowler_task.id
    mock_delete_task.return_value = task_mock
    mock_task_get.return_value = prowler_task

    user_creation_response = client.post(
        reverse("user-list"),
        data={
            "data": {
                "type": "users",
                "attributes": {
                    "name": "test",
                    "email": test_user,
                    "password": test_password,
                },
            }
        },
        format="vnd.api+json",
    )
    assert user_creation_response.status_code == 201

    access_token, _ = get_api_tokens(client, test_user, test_password)
    auth_headers = get_authorization_header(access_token)

    create_provider_response = client.post(
        reverse("provider-list"),
        data={
            "data": {
                "type": "providers",
                "attributes": {
                    "provider": Provider.ProviderChoices.AWS,
                    "uid": "123456789012",
                },
            }
        },
        format="vnd.api+json",
        headers=auth_headers,
    )
    assert create_provider_response.status_code == 201
    provider_id = create_provider_response.json()["data"]["id"]
    provider_uid = create_provider_response.json()["data"]["attributes"]["uid"]

    remove_provider = client.delete(
        reverse("provider-detail", kwargs={"pk": provider_id}),
        headers=auth_headers,
    )
    assert remove_provider.status_code == 202

    recreate_provider_response = client.post(
        reverse("provider-list"),
        data={
            "data": {
                "type": "providers",
                "attributes": {
                    "provider": Provider.ProviderChoices.AWS,
                    "uid": provider_uid,
                },
            }
        },
        format="vnd.api+json",
        headers=auth_headers,
    )
    assert recreate_provider_response.status_code == 201
```

--------------------------------------------------------------------------------

---[FILE: test_rls_transaction.py]---
Location: prowler-master/api/src/backend/api/tests/integration/test_rls_transaction.py
Signals: Django

```python
"""Tests for rls_transaction retry and fallback logic."""

import pytest
from django.db import DEFAULT_DB_ALIAS
from rest_framework_json_api.serializers import ValidationError

from api.db_utils import rls_transaction


@pytest.mark.django_db
class TestRLSTransaction:
    """Simple integration tests for rls_transaction using real DB."""

    @pytest.fixture
    def tenant(self, tenants_fixture):
        return tenants_fixture[0]

    def test_success_on_primary(self, tenant):
        """Basic: transaction succeeds on primary database."""
        with rls_transaction(str(tenant.id), using=DEFAULT_DB_ALIAS) as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            assert result == (1,)

    def test_invalid_uuid_raises_validation_error(self):
        """Invalid UUID raises ValidationError before DB operations."""
        with pytest.raises(ValidationError, match="Must be a valid UUID"):
            with rls_transaction("not-a-uuid", using=DEFAULT_DB_ALIAS):
                pass

    def test_custom_parameter_name(self, tenant):
        """Test custom RLS parameter name."""
        custom_param = "api.custom_id"
        with rls_transaction(
            str(tenant.id), parameter=custom_param, using=DEFAULT_DB_ALIAS
        ) as cursor:
            cursor.execute("SELECT current_setting(%s, true)", [custom_param])
            result = cursor.fetchone()
            assert result == (str(tenant.id),)
```

--------------------------------------------------------------------------------

---[FILE: test_tenants.py]---
Location: prowler-master/api/src/backend/api/tests/integration/test_tenants.py
Signals: Django

```python
from unittest.mock import patch

import pytest
from django.urls import reverse

from conftest import TEST_USER, TEST_PASSWORD, get_api_tokens, get_authorization_header


@patch("api.v1.views.schedule_provider_scan")
@pytest.mark.django_db
def test_check_resources_between_different_tenants(
    schedule_mock,
    enforce_test_user_db_connection,
    authenticated_api_client,
    tenants_fixture,
    set_user_admin_roles_fixture,
):
    client = authenticated_api_client

    tenant1 = str(tenants_fixture[0].id)
    tenant2 = str(tenants_fixture[1].id)

    tenant1_token, _ = get_api_tokens(
        client, TEST_USER, TEST_PASSWORD, tenant_id=tenant1
    )
    tenant2_token, _ = get_api_tokens(
        client, TEST_USER, TEST_PASSWORD, tenant_id=tenant2
    )

    tenant1_headers = get_authorization_header(tenant1_token)
    tenant2_headers = get_authorization_header(tenant2_token)

    # Create a provider on tenant 1
    provider_data = {
        "data": {
            "type": "providers",
            "attributes": {
                "alias": "test_provider_tenant_1",
                "provider": "aws",
                "uid": "123456789012",
            },
        }
    }
    provider1_response = client.post(
        reverse("provider-list"),
        data=provider_data,
        format="vnd.api+json",
        headers=tenant1_headers,
    )
    assert provider1_response.status_code == 201
    provider1_id = provider1_response.json()["data"]["id"]

    # Create a provider on tenant 2
    provider_data = {
        "data": {
            "type": "providers",
            "attributes": {
                "alias": "test_provider_tenant_2",
                "provider": "aws",
                "uid": "123456789013",
            },
        }
    }
    provider2_response = client.post(
        reverse("provider-list"),
        data=provider_data,
        format="vnd.api+json",
        headers=tenant2_headers,
    )
    assert provider2_response.status_code == 201
    provider2_id = provider2_response.json()["data"]["id"]

    # Try to get the provider from tenant 1 on tenant 2 and vice versa
    tenant1_response = client.get(
        reverse("provider-detail", kwargs={"pk": provider1_id}),
        headers=tenant2_headers,
    )
    assert tenant1_response.status_code == 404
    tenant2_response = client.get(
        reverse("provider-detail", kwargs={"pk": provider1_id}),
        headers=tenant1_headers,
    )
    assert tenant2_response.status_code == 200
    assert tenant2_response.json()["data"]["id"] == provider1_id

    # Vice versa

    tenant2_response = client.get(
        reverse("provider-detail", kwargs={"pk": provider2_id}),
        headers=tenant1_headers,
    )
    assert tenant2_response.status_code == 404
    tenant1_response = client.get(
        reverse("provider-detail", kwargs={"pk": provider2_id}),
        headers=tenant2_headers,
    )
    assert tenant1_response.status_code == 200
    assert tenant1_response.json()["data"]["id"] == provider2_id
```

--------------------------------------------------------------------------------

---[FILE: mixins.py]---
Location: prowler-master/api/src/backend/api/v1/mixins.py
Signals: Django

```python
from django.urls import reverse
from django_celery_results.models import TaskResult
from rest_framework import status
from rest_framework.response import Response

from api.exceptions import (
    TaskFailedException,
    TaskInProgressException,
    TaskNotFoundException,
)
from api.models import StateChoices, Task
from api.v1.serializers import TaskSerializer


class DisablePaginationMixin:
    disable_pagination_query_param = "page[disable]"
    disable_pagination_truthy_values = {"true"}

    def should_disable_pagination(self) -> bool:
        if not hasattr(self, "request"):
            return False
        value = self.request.query_params.get(self.disable_pagination_query_param)
        if value is None:
            return False
        return str(value).lower() in self.disable_pagination_truthy_values

    def paginate_queryset(self, queryset):
        if self.should_disable_pagination():
            return None
        return super().paginate_queryset(queryset)


class PaginateByPkMixin:
    """
    Mixin to paginate on a list of PKs (cheaper than heavy JOINs),
    re-fetch the full objects with the desired select/prefetch,
    re-sort them to preserve DB ordering, then serialize + return.
    """

    def paginate_by_pk(
        self,
        request,  # noqa: F841
        base_queryset,
        manager,
        select_related: list | None = None,
        prefetch_related: list | None = None,
    ) -> Response:
        """
        Paginate a queryset by primary key.

        This method is useful when you want to paginate a queryset that has been
        filtered or annotated in a way that would be lost if you used the default
        pagination method.
        """
        pk_list = base_queryset.values_list("id", flat=True)
        page = self.paginate_queryset(pk_list)
        if page is None:
            return Response(self.get_serializer(base_queryset, many=True).data)

        queryset = manager.filter(id__in=page)

        if select_related:
            queryset = queryset.select_related(*select_related)
        if prefetch_related:
            queryset = queryset.prefetch_related(*prefetch_related)

        # Optimize tags loading, if applicable
        if hasattr(self, "_optimize_tags_loading"):
            queryset = self._optimize_tags_loading(queryset)

        queryset = sorted(queryset, key=lambda obj: page.index(obj.id))

        serialized = self.get_serializer(queryset, many=True).data
        return self.get_paginated_response(serialized)


class TaskManagementMixin:
    """
    Mixin to manage task status checking.

    This mixin provides functionality to check if a task with specific parameters
    is running, completed, failed, or doesn't exist. It returns the task when running
    and raises specific exceptions for failed/not found scenarios that can be handled
    at the view level.
    """

    def check_task_status(
        self,
        task_name: str,
        task_kwargs: dict,
        raise_on_failed: bool = True,
        raise_on_not_found: bool = True,
    ) -> Task | None:
        """
        Check the status of a task with given name and kwargs.

        This method first checks for a related Task object, and if not found,
        checks TaskResult directly. If a TaskResult is found and running but
        there's no related Task, it raises TaskInProgressException.

        Args:
            task_name (str): The name of the task to check
            task_kwargs (dict): The kwargs to match against the task
            raise_on_failed (bool): Whether to raise exception if task failed
            raise_on_not_found (bool): Whether to raise exception if task not found

        Returns:
            Task | None: The task instance if found (regardless of state), None if not found and raise_on_not_found=False

        Raises:
            TaskFailedException: If task failed and raise_on_failed=True
            TaskNotFoundException: If task not found and raise_on_not_found=True
            TaskInProgressException: If task is running but no related Task object exists
        """
        # First, try to find a Task object with related TaskResult
        try:
            # Build the filter for task kwargs
            task_filter = {
                "task_runner_task__task_name": task_name,
            }

            # Add kwargs filters - we need to check if the task kwargs contain our parameters
            for key, value in task_kwargs.items():
                task_filter["task_runner_task__task_kwargs__contains"] = str(value)

            task = (
                Task.objects.filter(**task_filter)
                .select_related("task_runner_task")
                .order_by("-inserted_at")
                .first()
            )

            if task:
                # Get task state using the same logic as TaskSerializer
                task_state_mapping = {
                    "PENDING": StateChoices.AVAILABLE,
                    "STARTED": StateChoices.EXECUTING,
                    "PROGRESS": StateChoices.EXECUTING,
                    "SUCCESS": StateChoices.COMPLETED,
                    "FAILURE": StateChoices.FAILED,
                    "REVOKED": StateChoices.CANCELLED,
                }

                celery_status = (
                    task.task_runner_task.status if task.task_runner_task else None
                )
                task_state = task_state_mapping.get(
                    celery_status or "", StateChoices.AVAILABLE
                )

                # Check task state and raise exceptions accordingly
                if task_state in (StateChoices.FAILED, StateChoices.CANCELLED):
                    if raise_on_failed:
                        raise TaskFailedException(task=task)
                    return task
                elif task_state == StateChoices.COMPLETED:
                    return None

                return task

        except Task.DoesNotExist:
            pass

        # If no Task found, check TaskResult directly
        try:
            # Build the filter for TaskResult
            task_result_filter = {
                "task_name": task_name,
            }

            # Add kwargs filters - check if the task kwargs contain our parameters
            for key, value in task_kwargs.items():
                task_result_filter["task_kwargs__contains"] = str(value)

            task_result = (
                TaskResult.objects.filter(**task_result_filter)
                .order_by("-date_created")
                .first()
            )

            if task_result:
                # Check if the TaskResult indicates a running task
                if task_result.status in ["PENDING", "STARTED", "PROGRESS"]:
                    # Task is running but no related Task object exists
                    raise TaskInProgressException(task_result=task_result)
                elif task_result.status == "FAILURE":
                    if raise_on_failed:
                        raise TaskFailedException(task=None)
                # For other statuses (SUCCESS, REVOKED), we don't have a Task to return,
                # so we treat it as not found

        except TaskResult.DoesNotExist:
            pass

        # No task found at all
        if raise_on_not_found:
            raise TaskNotFoundException()
        return None

    def get_task_response_if_running(
        self,
        task_name: str,
        task_kwargs: dict,
        raise_on_failed: bool = True,
        raise_on_not_found: bool = True,
    ) -> Response | None:
        """
        Get a 202 response with task details if the task is currently running.

        This method is useful for endpoints that should return task status when
        a background task is in progress, similar to the compliance overview endpoints.

        Args:
            task_name (str): The name of the task to check
            task_kwargs (dict): The kwargs to match against the task

        Returns:
            Response | None: 202 response with task details if running, None otherwise
        """
        task = self.check_task_status(
            task_name=task_name,
            task_kwargs=task_kwargs,
            raise_on_failed=raise_on_failed,
            raise_on_not_found=raise_on_not_found,
        )

        if not task:
            return None

        # Get task state
        task_state_mapping = {
            "PENDING": StateChoices.AVAILABLE,
            "STARTED": StateChoices.EXECUTING,
            "PROGRESS": StateChoices.EXECUTING,
            "SUCCESS": StateChoices.COMPLETED,
            "FAILURE": StateChoices.FAILED,
            "REVOKED": StateChoices.CANCELLED,
        }

        celery_status = task.task_runner_task.status if task.task_runner_task else None
        task_state = task_state_mapping.get(celery_status or "", StateChoices.AVAILABLE)

        if task_state == StateChoices.EXECUTING:
            self.response_serializer_class = TaskSerializer
            serializer = TaskSerializer(task)
            return Response(
                data=serializer.data,
                status=status.HTTP_202_ACCEPTED,
                headers={
                    "Content-Location": reverse("task-detail", kwargs={"pk": task.id})
                },
            )
```

--------------------------------------------------------------------------------

````
