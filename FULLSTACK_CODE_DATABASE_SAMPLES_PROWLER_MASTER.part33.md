---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 33
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 33 of 867)

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

---[FILE: test_decorators.py]---
Location: prowler-master/api/src/backend/api/tests/test_decorators.py
Signals: Django

```python
import uuid
from unittest.mock import call, patch

import pytest
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError

from api.db_utils import POSTGRES_TENANT_VAR, SET_CONFIG_QUERY
from api.decorators import handle_provider_deletion, set_tenant
from api.exceptions import ProviderDeletedException


@pytest.mark.django_db
class TestSetTenantDecorator:
    @patch("api.decorators.connection.cursor")
    def test_set_tenant(self, mock_cursor):
        mock_cursor.return_value.__enter__.return_value = mock_cursor

        @set_tenant
        def random_func(arg):
            return arg

        tenant_id = str(uuid.uuid4())

        result = random_func("test_arg", tenant_id=tenant_id)

        assert (
            call(SET_CONFIG_QUERY, [POSTGRES_TENANT_VAR, tenant_id])
            in mock_cursor.execute.mock_calls
        )
        assert result == "test_arg"

    def test_set_tenant_exception(self):
        @set_tenant
        def random_func(arg):
            return arg

        with pytest.raises(KeyError):
            random_func("test_arg")


@pytest.mark.django_db
class TestHandleProviderDeletionDecorator:
    def test_success_no_exception(self, tenants_fixture, providers_fixture):
        """Decorated function runs normally when no exception is raised."""
        tenant = tenants_fixture[0]
        provider = providers_fixture[0]

        @handle_provider_deletion
        def task_func(**kwargs):
            return "success"

        result = task_func(
            tenant_id=str(tenant.id),
            provider_id=str(provider.id),
        )
        assert result == "success"

    @patch("api.decorators.rls_transaction")
    @patch("api.decorators.Provider.objects.filter")
    def test_provider_deleted_with_provider_id(
        self, mock_filter, mock_rls, tenants_fixture
    ):
        """Raises ProviderDeletedException when provider_id provided and provider deleted."""
        tenant = tenants_fixture[0]
        deleted_provider_id = str(uuid.uuid4())

        mock_rls.return_value.__enter__ = lambda s: None
        mock_rls.return_value.__exit__ = lambda s, *args: None
        mock_filter.return_value.exists.return_value = False

        @handle_provider_deletion
        def task_func(**kwargs):
            raise ObjectDoesNotExist("Some object not found")

        with pytest.raises(ProviderDeletedException) as exc_info:
            task_func(tenant_id=str(tenant.id), provider_id=deleted_provider_id)

        assert deleted_provider_id in str(exc_info.value)

    @patch("api.decorators.rls_transaction")
    @patch("api.decorators.Provider.objects.filter")
    @patch("api.decorators.Scan.objects.filter")
    def test_provider_deleted_with_scan_id(
        self, mock_scan_filter, mock_provider_filter, mock_rls, tenants_fixture
    ):
        """Raises ProviderDeletedException when scan exists but provider deleted."""
        tenant = tenants_fixture[0]
        scan_id = str(uuid.uuid4())
        provider_id = str(uuid.uuid4())

        mock_rls.return_value.__enter__ = lambda s: None
        mock_rls.return_value.__exit__ = lambda s, *args: None

        mock_scan = type("MockScan", (), {"provider_id": provider_id})()
        mock_scan_filter.return_value.first.return_value = mock_scan
        mock_provider_filter.return_value.exists.return_value = False

        @handle_provider_deletion
        def task_func(**kwargs):
            raise ObjectDoesNotExist("Some object not found")

        with pytest.raises(ProviderDeletedException) as exc_info:
            task_func(tenant_id=str(tenant.id), scan_id=scan_id)

        assert provider_id in str(exc_info.value)

    @patch("api.decorators.rls_transaction")
    @patch("api.decorators.Scan.objects.filter")
    def test_scan_deleted_cascade(self, mock_scan_filter, mock_rls, tenants_fixture):
        """Raises ProviderDeletedException when scan was deleted (CASCADE from provider)."""
        tenant = tenants_fixture[0]
        scan_id = str(uuid.uuid4())

        mock_rls.return_value.__enter__ = lambda s: None
        mock_rls.return_value.__exit__ = lambda s, *args: None
        mock_scan_filter.return_value.first.return_value = None

        @handle_provider_deletion
        def task_func(**kwargs):
            raise ObjectDoesNotExist("Some object not found")

        with pytest.raises(ProviderDeletedException) as exc_info:
            task_func(tenant_id=str(tenant.id), scan_id=scan_id)

        assert scan_id in str(exc_info.value)

    @patch("api.decorators.rls_transaction")
    @patch("api.decorators.Provider.objects.filter")
    def test_provider_exists_reraises_original(
        self, mock_filter, mock_rls, tenants_fixture, providers_fixture
    ):
        """Re-raises original exception when provider still exists."""
        tenant = tenants_fixture[0]
        provider = providers_fixture[0]

        mock_rls.return_value.__enter__ = lambda s: None
        mock_rls.return_value.__exit__ = lambda s, *args: None
        mock_filter.return_value.exists.return_value = True

        @handle_provider_deletion
        def task_func(**kwargs):
            raise ObjectDoesNotExist("Actual object missing")

        with pytest.raises(ObjectDoesNotExist):
            task_func(tenant_id=str(tenant.id), provider_id=str(provider.id))

    @patch("api.decorators.rls_transaction")
    @patch("api.decorators.Provider.objects.filter")
    def test_integrity_error_provider_deleted(
        self, mock_filter, mock_rls, tenants_fixture
    ):
        """Raises ProviderDeletedException on IntegrityError when provider deleted."""
        tenant = tenants_fixture[0]
        deleted_provider_id = str(uuid.uuid4())

        mock_rls.return_value.__enter__ = lambda s: None
        mock_rls.return_value.__exit__ = lambda s, *args: None
        mock_filter.return_value.exists.return_value = False

        @handle_provider_deletion
        def task_func(**kwargs):
            raise IntegrityError("FK constraint violation")

        with pytest.raises(ProviderDeletedException):
            task_func(tenant_id=str(tenant.id), provider_id=deleted_provider_id)

    def test_missing_provider_and_scan_raises_assertion(self, tenants_fixture):
        """Raises AssertionError when neither provider_id nor scan_id in kwargs."""

        @handle_provider_deletion
        def task_func(**kwargs):
            raise ObjectDoesNotExist("Some object not found")

        with pytest.raises(AssertionError) as exc_info:
            task_func(tenant_id=str(tenants_fixture[0].id))

        assert "provider or scan" in str(exc_info.value)
```

--------------------------------------------------------------------------------

---[FILE: test_middleware.py]---
Location: prowler-master/api/src/backend/api/tests/test_middleware.py
Signals: Django

```python
from unittest.mock import MagicMock, patch

import pytest
from django.http import HttpResponse
from django.test import RequestFactory

from api.middleware import APILoggingMiddleware


@pytest.mark.django_db
@patch("logging.getLogger")
def test_api_logging_middleware_logging(mock_logger):
    factory = RequestFactory()

    request = factory.get("/test-path?param1=value1&param2=value2")
    request.method = "GET"

    response = HttpResponse()
    response.status_code = 200

    get_response = MagicMock(return_value=response)

    with patch("api.middleware.extract_auth_info") as mock_extract_auth_info:
        mock_extract_auth_info.return_value = {
            "user_id": "user123",
            "tenant_id": "tenant456",
            "api_key_prefix": "pk_test",
        }

        with patch("api.middleware.logging.getLogger") as mock_get_logger:
            mock_logger = MagicMock()
            mock_get_logger.return_value = mock_logger

            middleware = APILoggingMiddleware(get_response)

            with patch("api.middleware.time.time") as mock_time:
                mock_time.side_effect = [1000.0, 1001.0]  # Start time and end time

                middleware(request)

                get_response.assert_called_once_with(request)

                mock_extract_auth_info.assert_called_once_with(request)

                expected_extra = {
                    "user_id": "user123",
                    "tenant_id": "tenant456",
                    "api_key_prefix": "pk_test",
                    "method": "GET",
                    "path": "/test-path",
                    "query_params": {"param1": "value1", "param2": "value2"},
                    "status_code": 200,
                    "duration": 1.0,
                }

                mock_logger.info.assert_called_once_with("", extra=expected_extra)
```

--------------------------------------------------------------------------------

---[FILE: test_mixins.py]---
Location: prowler-master/api/src/backend/api/tests/test_mixins.py

```python
import json
from uuid import uuid4

import pytest
from django_celery_results.models import TaskResult
from rest_framework import status
from rest_framework.response import Response

from api.exceptions import (
    TaskFailedException,
    TaskInProgressException,
    TaskNotFoundException,
)
from api.models import Task, User
from api.rls import Tenant
from api.v1.mixins import PaginateByPkMixin, TaskManagementMixin


@pytest.mark.django_db
class TestPaginateByPkMixin:
    @pytest.fixture
    def tenant(self):
        return Tenant.objects.create(name="Test Tenant")

    @pytest.fixture
    def users(self, tenant):
        # Create 5 users with proper email field
        users = []
        for i in range(5):
            user = User.objects.create(email=f"user{i}@example.com", name=f"User {i}")
            users.append(user)
        return users

    class DummyView(PaginateByPkMixin):
        def __init__(self, page):
            self._page = page

        def paginate_queryset(self, qs):
            return self._page

        def get_serializer(self, queryset, many):
            class S:
                def __init__(self, data):
                    # serialize to list of ids
                    self.data = [obj.id for obj in data] if many else queryset.id

            return S(queryset)

        def get_paginated_response(self, data):
            return Response({"results": data}, status=status.HTTP_200_OK)

    def test_no_pagination(self, users):
        base_qs = User.objects.all().order_by("id")
        view = self.DummyView(page=None)
        resp = view.paginate_by_pk(
            request=None, base_queryset=base_qs, manager=User.objects
        )
        # since no pagination, should return all ids in order
        expected = [u.id for u in base_qs]
        assert isinstance(resp, Response)
        assert resp.data == expected

    def test_with_pagination(self, users):
        base_qs = User.objects.all().order_by("id")
        # simulate paging to first 2 ids
        page = [base_qs[1].id, base_qs[3].id]
        view = self.DummyView(page=page)
        resp = view.paginate_by_pk(
            request=None, base_queryset=base_qs, manager=User.objects
        )
        # should fetch only those two users, in the same order as page
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data == {"results": page}


@pytest.mark.django_db
class TestTaskManagementMixin:
    class DummyView(TaskManagementMixin):
        pass

    @pytest.fixture
    def tenant(self):
        return Tenant.objects.create(name="Test Tenant")

    @pytest.fixture(autouse=True)
    def cleanup(self):
        Task.objects.all().delete()
        TaskResult.objects.all().delete()

    def test_no_task_and_no_taskresult_raises_not_found(self):
        view = self.DummyView()
        with pytest.raises(TaskNotFoundException):
            view.check_task_status("task_xyz", {"foo": "bar"})

    def test_no_task_and_no_taskresult_returns_none_when_not_raising(self):
        view = self.DummyView()
        result = view.check_task_status(
            "task_xyz", {"foo": "bar"}, raise_on_not_found=False
        )
        assert result is None

    def test_taskresult_pending_raises_in_progress(self):
        task_kwargs = {"foo": "bar"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="task_xyz",
            task_kwargs=json.dumps(task_kwargs),
            status="PENDING",
        )
        view = self.DummyView()
        with pytest.raises(TaskInProgressException) as excinfo:
            view.check_task_status("task_xyz", task_kwargs, raise_on_not_found=False)
        assert hasattr(excinfo.value, "task_result")
        assert excinfo.value.task_result == tr

    def test_taskresult_started_raises_in_progress(self):
        task_kwargs = {"foo": "bar"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="task_xyz",
            task_kwargs=json.dumps(task_kwargs),
            status="STARTED",
        )
        view = self.DummyView()
        with pytest.raises(TaskInProgressException) as excinfo:
            view.check_task_status("task_xyz", task_kwargs, raise_on_not_found=False)
        assert hasattr(excinfo.value, "task_result")
        assert excinfo.value.task_result == tr

    def test_taskresult_progress_raises_in_progress(self):
        task_kwargs = {"foo": "bar"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="task_xyz",
            task_kwargs=json.dumps(task_kwargs),
            status="PROGRESS",
        )
        view = self.DummyView()
        with pytest.raises(TaskInProgressException) as excinfo:
            view.check_task_status("task_xyz", task_kwargs, raise_on_not_found=False)
        assert hasattr(excinfo.value, "task_result")
        assert excinfo.value.task_result == tr

    def test_taskresult_failure_raises_failed(self):
        task_kwargs = {"a": 1}
        TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="task_fail",
            task_kwargs=json.dumps(task_kwargs),
            status="FAILURE",
        )
        view = self.DummyView()
        with pytest.raises(TaskFailedException):
            view.check_task_status("task_fail", task_kwargs, raise_on_not_found=False)

    def test_taskresult_failure_returns_none_when_not_raising(self):
        task_kwargs = {"a": 1}
        TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="task_fail",
            task_kwargs=json.dumps(task_kwargs),
            status="FAILURE",
        )
        view = self.DummyView()
        result = view.check_task_status(
            "task_fail", task_kwargs, raise_on_failed=False, raise_on_not_found=False
        )
        assert result is None

    def test_taskresult_success_returns_none(self):
        task_kwargs = {"x": 2}
        TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="task_ok",
            task_kwargs=json.dumps(task_kwargs),
            status="SUCCESS",
        )
        view = self.DummyView()
        # should not raise, and returns None
        assert (
            view.check_task_status("task_ok", task_kwargs, raise_on_not_found=False)
            is None
        )

    def test_taskresult_revoked_returns_none(self):
        task_kwargs = {"x": 2}
        TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="task_revoked",
            task_kwargs=json.dumps(task_kwargs),
            status="REVOKED",
        )
        view = self.DummyView()
        # should not raise, and returns None
        assert (
            view.check_task_status(
                "task_revoked", task_kwargs, raise_on_not_found=False
            )
            is None
        )

    def test_task_with_failed_status_raises_failed(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="FAILURE",
        )
        task = Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        with pytest.raises(TaskFailedException) as excinfo:
            view.check_task_status("scan_task", task_kwargs)
        # Check that the exception contains the expected task
        assert hasattr(excinfo.value, "task")
        assert excinfo.value.task == task

    def test_task_with_cancelled_status_raises_failed(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="REVOKED",
        )
        task = Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        with pytest.raises(TaskFailedException) as excinfo:
            view.check_task_status("scan_task", task_kwargs)
        # Check that the exception contains the expected task
        assert hasattr(excinfo.value, "task")
        assert excinfo.value.task == task

    def test_task_with_failed_status_returns_task_when_not_raising(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="FAILURE",
        )
        task = Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        result = view.check_task_status("scan_task", task_kwargs, raise_on_failed=False)
        assert result == task

    def test_task_with_completed_status_returns_none(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="SUCCESS",
        )
        Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        result = view.check_task_status("scan_task", task_kwargs)
        assert result is None

    def test_task_with_executing_status_returns_task(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="STARTED",
        )
        task = Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        result = view.check_task_status("scan_task", task_kwargs)
        assert result is not None
        assert result.pk == task.pk

    def test_task_with_pending_status_returns_task(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="PENDING",
        )
        task = Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        result = view.check_task_status("scan_task", task_kwargs)
        assert result is not None
        assert result.pk == task.pk

    def test_get_task_response_if_running_returns_none_for_completed_task(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="SUCCESS",
        )
        Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        result = view.get_task_response_if_running("scan_task", task_kwargs)
        assert result is None

    def test_get_task_response_if_running_returns_none_for_no_task(self):
        view = self.DummyView()
        result = view.get_task_response_if_running(
            "nonexistent", {"foo": "bar"}, raise_on_not_found=False
        )
        assert result is None

    def test_get_task_response_if_running_returns_202_for_executing_task(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="STARTED",
        )
        task = Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        result = view.get_task_response_if_running("scan_task", task_kwargs)

        assert isinstance(result, Response)
        assert result.status_code == status.HTTP_202_ACCEPTED
        assert "Content-Location" in result.headers
        # The response should contain the serialized task data
        assert result.data is not None
        assert "id" in result.data
        assert str(result.data["id"]) == str(task.id)

    def test_get_task_response_if_running_returns_none_for_available_task(self, tenant):
        task_kwargs = {"provider_id": "test"}
        tr = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs),
            status="PENDING",
        )
        Task.objects.create(tenant=tenant, task_runner_task=tr)
        view = self.DummyView()
        result = view.get_task_response_if_running("scan_task", task_kwargs)
        # PENDING maps to AVAILABLE, which is not EXECUTING, so should return None
        assert result is None

    def test_kwargs_filtering_works_correctly(self, tenant):
        # Create tasks with different kwargs
        task_kwargs_1 = {"provider_id": "test1", "scan_type": "full"}
        task_kwargs_2 = {"provider_id": "test2", "scan_type": "quick"}

        tr1 = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs_1),
            status="STARTED",
        )
        tr2 = TaskResult.objects.create(
            task_id=str(uuid4()),
            task_name="scan_task",
            task_kwargs=json.dumps(task_kwargs_2),
            status="STARTED",
        )

        task1 = Task.objects.create(tenant=tenant, task_runner_task=tr1)
        task2 = Task.objects.create(tenant=tenant, task_runner_task=tr2)

        view = self.DummyView()

        # Should find task1 when searching for its kwargs
        result1 = view.check_task_status("scan_task", {"provider_id": "test1"})
        assert result1 is not None
        assert result1.pk == task1.pk

        # Should find task2 when searching for its kwargs
        result2 = view.check_task_status("scan_task", {"provider_id": "test2"})
        assert result2 is not None
        assert result2.pk == task2.pk

        # Should not find anything when searching for non-existent kwargs
        result3 = view.check_task_status(
            "scan_task", {"provider_id": "test3"}, raise_on_not_found=False
        )
        assert result3 is None
```

--------------------------------------------------------------------------------

---[FILE: test_models.py]---
Location: prowler-master/api/src/backend/api/tests/test_models.py
Signals: Django

```python
import pytest
from allauth.socialaccount.models import SocialApp
from django.core.exceptions import ValidationError

from api.db_router import MainRouter
from api.models import Resource, ResourceTag, SAMLConfiguration, SAMLDomainIndex


@pytest.mark.django_db
class TestResourceModel:
    def test_setting_tags(self, providers_fixture):
        provider, *_ = providers_fixture
        tenant_id = provider.tenant_id

        resource = Resource.objects.create(
            tenant_id=tenant_id,
            provider=provider,
            uid="arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0",
            name="My Instance 1",
            region="us-east-1",
            service="ec2",
            type="prowler-test",
        )

        tags = [
            ResourceTag.objects.create(
                tenant_id=tenant_id,
                key="key",
                value="value",
            ),
            ResourceTag.objects.create(
                tenant_id=tenant_id,
                key="key2",
                value="value2",
            ),
        ]

        resource.upsert_or_delete_tags(tags)

        assert len(tags) == len(resource.tags.filter(tenant_id=tenant_id))

        tags_dict = resource.get_tags(tenant_id=tenant_id)

        for tag in tags:
            assert tag.key in tags_dict
            assert tag.value == tags_dict[tag.key]

    def test_adding_tags(self, resources_fixture):
        resource, *_ = resources_fixture
        tenant_id = str(resource.tenant_id)

        tags = [
            ResourceTag.objects.create(
                tenant_id=tenant_id,
                key="env",
                value="test",
            ),
        ]
        before_count = len(resource.tags.filter(tenant_id=tenant_id))

        resource.upsert_or_delete_tags(tags)

        assert before_count + 1 == len(resource.tags.filter(tenant_id=tenant_id))

        tags_dict = resource.get_tags(tenant_id=tenant_id)

        assert "env" in tags_dict
        assert tags_dict["env"] == "test"

    def test_adding_duplicate_tags(self, resources_fixture):
        resource, *_ = resources_fixture
        tenant_id = str(resource.tenant_id)

        tags = resource.tags.filter(tenant_id=tenant_id)

        before_count = len(resource.tags.filter(tenant_id=tenant_id))

        resource.upsert_or_delete_tags(tags)

        # should be the same number of tags
        assert before_count == len(resource.tags.filter(tenant_id=tenant_id))

    def test_add_tags_none(self, resources_fixture):
        resource, *_ = resources_fixture
        tenant_id = str(resource.tenant_id)
        resource.upsert_or_delete_tags(None)

        assert len(resource.tags.filter(tenant_id=tenant_id)) == 0
        assert resource.get_tags(tenant_id=tenant_id) == {}

    def test_clear_tags(self, resources_fixture):
        resource, *_ = resources_fixture
        tenant_id = str(resource.tenant_id)
        resource.clear_tags()

        assert len(resource.tags.filter(tenant_id=tenant_id)) == 0
        assert resource.get_tags(tenant_id=tenant_id) == {}


# @pytest.mark.django_db
# class TestFindingModel:
#     def test_add_finding_with_long_uid(
#         self, providers_fixture, scans_fixture, resources_fixture
#     ):
#         provider, *_ = providers_fixture
#         tenant_id = provider.tenant_id

#         long_uid = "1" * 500
#         _ = Finding.objects.create(
#             tenant_id=tenant_id,
#             uid=long_uid,
#             delta=Finding.DeltaChoices.NEW,
#             check_metadata={},
#             status=StatusChoices.PASS,
#             status_extended="",
#             severity="high",
#             impact="high",
#             raw_result={},
#             check_id="test_check",
#             scan=scans_fixture[0],
#             first_seen_at=None,
#             muted=False,
#             compliance={},
#         )
#         assert Finding.objects.filter(uid=long_uid).exists()


@pytest.mark.django_db
class TestSAMLConfigurationModel:
    VALID_METADATA = """<?xml version='1.0' encoding='UTF-8'?>
    <md:EntityDescriptor entityID='TEST' xmlns:md='urn:oasis:names:tc:SAML:2.0:metadata'>
    <md:IDPSSODescriptor WantAuthnRequestsSigned='false' protocolSupportEnumeration='urn:oasis:names:tc:SAML:2.0:protocol'>
        <md:KeyDescriptor use='signing'>
        <ds:KeyInfo xmlns:ds='http://www.w3.org/2000/09/xmldsig#'>
            <ds:X509Data>
            <ds:X509Certificate>FAKECERTDATA</ds:X509Certificate>
            </ds:X509Data>
        </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:SingleSignOnService Binding='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST' Location='https://idp.test/sso'/>
    </md:IDPSSODescriptor>
    </md:EntityDescriptor>
    """

    def test_creates_valid_configuration(self, tenants_fixture):
        tenant = tenants_fixture[0]
        config = SAMLConfiguration.objects.using(MainRouter.admin_db).create(
            email_domain="ssoexample.com",
            metadata_xml=TestSAMLConfigurationModel.VALID_METADATA,
            tenant=tenant,
        )

        assert config.email_domain == "ssoexample.com"
        assert SocialApp.objects.filter(client_id="ssoexample.com").exists()

    def test_email_domain_with_at_symbol_fails(self, tenants_fixture):
        tenant = tenants_fixture[0]
        config = SAMLConfiguration(
            email_domain="invalid@domain.com",
            metadata_xml=TestSAMLConfigurationModel.VALID_METADATA,
            tenant=tenant,
        )

        with pytest.raises(ValidationError) as exc_info:
            config.clean()

        errors = exc_info.value.message_dict
        assert "email_domain" in errors
        assert "Domain must not contain @" in errors["email_domain"][0]

    def test_duplicate_email_domain_fails(self, tenants_fixture):
        tenant1, tenant2, *_ = tenants_fixture

        SAMLConfiguration.objects.using(MainRouter.admin_db).create(
            email_domain="duplicate.com",
            metadata_xml=TestSAMLConfigurationModel.VALID_METADATA,
            tenant=tenant1,
        )

        config = SAMLConfiguration(
            email_domain="duplicate.com",
            metadata_xml=TestSAMLConfigurationModel.VALID_METADATA,
            tenant=tenant2,
        )

        with pytest.raises(ValidationError) as exc_info:
            config.clean()

        errors = exc_info.value.message_dict
        assert "tenant" in errors
        assert "There is a problem with your email domain." in errors["tenant"][0]

    def test_duplicate_tenant_config_fails(self, tenants_fixture):
        tenant = tenants_fixture[0]

        SAMLConfiguration.objects.using(MainRouter.admin_db).create(
            email_domain="unique1.com",
            metadata_xml=TestSAMLConfigurationModel.VALID_METADATA,
            tenant=tenant,
        )

        config = SAMLConfiguration(
            email_domain="unique2.com",
            metadata_xml=TestSAMLConfigurationModel.VALID_METADATA,
            tenant=tenant,
        )

        with pytest.raises(ValidationError) as exc_info:
            config.clean()

        errors = exc_info.value.message_dict
        assert "tenant" in errors
        assert (
            "A SAML configuration already exists for this tenant."
            in errors["tenant"][0]
        )

    def test_invalid_metadata_xml_fails(self, tenants_fixture):
        tenant = tenants_fixture[0]
        config = SAMLConfiguration(
            email_domain="brokenxml.com",
            metadata_xml="<bad<xml>",
            tenant=tenant,
        )

        with pytest.raises(ValidationError) as exc_info:
            config._parse_metadata()

        errors = exc_info.value.message_dict
        assert "metadata_xml" in errors
        assert "Invalid XML" in errors["metadata_xml"][0]
        assert "not well-formed" in errors["metadata_xml"][0]

    def test_metadata_missing_sso_fails(self, tenants_fixture):
        tenant = tenants_fixture[0]
        xml = """<md:EntityDescriptor entityID="x" xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
                <md:IDPSSODescriptor></md:IDPSSODescriptor>
                </md:EntityDescriptor>"""
        config = SAMLConfiguration(
            email_domain="nosso.com",
            metadata_xml=xml,
            tenant=tenant,
        )

        with pytest.raises(ValidationError) as exc_info:
            config._parse_metadata()

        errors = exc_info.value.message_dict
        assert "metadata_xml" in errors
        assert "Missing SingleSignOnService" in errors["metadata_xml"][0]

    def test_metadata_missing_certificate_fails(self, tenants_fixture):
        tenant = tenants_fixture[0]
        xml = """<md:EntityDescriptor entityID="x" xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
                    <md:IDPSSODescriptor>
                        <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://example.com/sso"/>
                    </md:IDPSSODescriptor>
                </md:EntityDescriptor>"""
        config = SAMLConfiguration(
            email_domain="nocert.com",
            metadata_xml=xml,
            tenant=tenant,
        )

        with pytest.raises(ValidationError) as exc_info:
            config._parse_metadata()

        errors = exc_info.value.message_dict
        assert "metadata_xml" in errors
        assert "X509Certificate" in errors["metadata_xml"][0]

    def test_deletes_saml_configuration_and_related_objects(self, tenants_fixture):
        tenant = tenants_fixture[0]
        email_domain = "deleteme.com"

        # Create the configuration
        config = SAMLConfiguration.objects.using(MainRouter.admin_db).create(
            email_domain=email_domain,
            metadata_xml=TestSAMLConfigurationModel.VALID_METADATA,
            tenant=tenant,
        )

        # Verify that the SocialApp and SAMLDomainIndex exist
        assert SocialApp.objects.filter(client_id=email_domain).exists()
        assert (
            SAMLDomainIndex.objects.using(MainRouter.admin_db)
            .filter(email_domain=email_domain)
            .exists()
        )

        # Delete the configuration
        config.delete()

        # Verify that the configuration and its related objects are deleted
        assert (
            not SAMLConfiguration.objects.using(MainRouter.admin_db)
            .filter(pk=config.pk)
            .exists()
        )
        assert not SocialApp.objects.filter(client_id=email_domain).exists()
        assert (
            not SAMLDomainIndex.objects.using(MainRouter.admin_db)
            .filter(email_domain=email_domain)
            .exists()
        )

    def test_duplicate_entity_id_fails_on_creation(self, tenants_fixture):
        tenant1, tenant2, *_ = tenants_fixture
        SAMLConfiguration.objects.using(MainRouter.admin_db).create(
            email_domain="first.com",
            metadata_xml=self.VALID_METADATA,
            tenant=tenant1,
        )

        config = SAMLConfiguration(
            email_domain="second.com",
            metadata_xml=self.VALID_METADATA,
            tenant=tenant2,
        )

        with pytest.raises(ValidationError) as exc_info:
            config.save()

        errors = exc_info.value.message_dict
        assert "metadata_xml" in errors
        assert "There is a problem with your metadata." in errors["metadata_xml"][0]
```

--------------------------------------------------------------------------------

````
