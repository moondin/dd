---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 698
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 698 of 867)

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

---[FILE: cloudsql_instance_sqlserver_user_options_flag_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_user_options_flag/cloudsql_instance_sqlserver_user_options_flag_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_sqlserver_user_options_flag:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag import (
                cloudsql_instance_sqlserver_user_options_flag,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_sqlserver_user_options_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_postgres_instance(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag import (
                cloudsql_instance_sqlserver_user_options_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_user_options_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_sqlserver_instance_no_flags(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag import (
                cloudsql_instance_sqlserver_user_options_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_user_options_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 does not have 'user options' flag set."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_sqlserver_instance_user_options_flag_empty(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag import (
                cloudsql_instance_sqlserver_user_options_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[{"name": "user options", "value": ""}],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_user_options_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 does not have 'user options' flag set."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_sqlserver_instance_user_options_flag_set(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_sqlserver_user_options_flag.cloudsql_instance_sqlserver_user_options_flag import (
                cloudsql_instance_sqlserver_user_options_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="SQLSERVER_2019",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[{"name": "user options", "value": "0"}],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_sqlserver_user_options_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "SQL Server Instance instance1 has 'user options' flag set."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_ssl_connections_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_ssl_connections/cloudsql_instance_ssl_connections_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_ssl_connections:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections import (
                cloudsql_instance_ssl_connections,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_ssl_connections()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_instance_ssl_connections_enabled_and_ssl_mode_encrypted(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections import (
                cloudsql_instance_ssl_connections,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=True,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_ssl_connections()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Database Instance instance1 requires SSL connections."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_ssl_connections_disabled_and_ssl_mode_encrypted(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections import (
                cloudsql_instance_ssl_connections,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_ssl_connections()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Database Instance instance1 requires SSL connections."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_ssl_connections_enabled_and_ssl_mode_not_encrypted(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections import (
                cloudsql_instance_ssl_connections,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=True,
                    ssl_mode="ALLOW_UNENCRYPTED_AND_ENCRYPTED",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_ssl_connections()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Database Instance instance1 does not require SSL connections."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_ssl_connections_disabled_and_ssl_mode_not_encrypted(
        self,
    ):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections import (
                cloudsql_instance_ssl_connections,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ALLOW_UNENCRYPTED_AND_ENCRYPTED",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_ssl_connections()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Database Instance instance1 does not require SSL connections."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_ssl_connections_enabled_with_trusted_client_certificates(
        self,
    ):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_ssl_connections.cloudsql_instance_ssl_connections import (
                cloudsql_instance_ssl_connections,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="POSTGRES_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=True,
                    ssl_mode="TRUSTED_CLIENT_CERTIFICATE_REQUIRED",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_ssl_connections()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Database Instance instance1 requires SSL connections."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_service_test.py

```python
from unittest.mock import MagicMock, patch

from googleapiclient.errors import HttpError

from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
    CloudStorage,
    RetentionPolicy,
)
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestCloudStorageService:
    def test_service(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
        ):
            cloudstorage_client = CloudStorage(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert cloudstorage_client.service == "storage"
            assert cloudstorage_client.project_ids == [GCP_PROJECT_ID]

            assert len(cloudstorage_client.buckets) == 2
            assert cloudstorage_client.buckets[0].name == "bucket1"
            assert cloudstorage_client.buckets[0].id.__class__.__name__ == "str"
            assert cloudstorage_client.buckets[0].region == "us"
            assert cloudstorage_client.buckets[0].uniform_bucket_level_access
            assert cloudstorage_client.buckets[0].public

            assert isinstance(
                cloudstorage_client.buckets[0].retention_policy, RetentionPolicy
            )
            assert (
                cloudstorage_client.buckets[0].retention_policy.retention_period == 10
            )
            assert cloudstorage_client.buckets[0].retention_policy.is_locked is False
            assert (
                cloudstorage_client.buckets[0].retention_policy.effective_time is None
            )
            assert cloudstorage_client.buckets[0].project_id == GCP_PROJECT_ID

            assert cloudstorage_client.buckets[1].name == "bucket2"
            assert cloudstorage_client.buckets[1].id.__class__.__name__ == "str"
            assert cloudstorage_client.buckets[1].region == "eu"
            assert not cloudstorage_client.buckets[1].uniform_bucket_level_access
            assert not cloudstorage_client.buckets[1].public
            assert cloudstorage_client.buckets[1].retention_policy is None
            assert cloudstorage_client.buckets[1].project_id == GCP_PROJECT_ID

    def test_vpc_service_controls_blocked(self):
        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
            ) as mock_client,
        ):
            mock_resp = MagicMock()
            mock_resp.status = 403
            mock_resp.reason = "Forbidden"

            vpc_error = HttpError(
                resp=mock_resp,
                content=b'{"error": {"message": "Request is prohibited by organization\'s policy. vpcServiceControlsUniqueIdentifier: 12345"}}',
            )

            mock_buckets = MagicMock()
            mock_buckets.list.return_value.execute.side_effect = vpc_error
            mock_client.return_value.buckets.return_value = mock_buckets

            cloudstorage_client = CloudStorage(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            assert (
                GCP_PROJECT_ID
                in cloudstorage_client.vpc_service_controls_protected_projects
            )
            assert len(cloudstorage_client.buckets) == 0
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_audit_logs_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudstorage/cloudstorage_audit_logs_enabled/cloudstorage_audit_logs_enabled_test.py

```python
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    GCP_US_CENTER1_LOCATION,
    set_mocked_gcp_provider,
)


class TestCloudStorageAuditLogsEnabled:
    def test_no_projects(self):
        cloudresourcemanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage."
                "cloudstorage_audit_logs_enabled."
                "cloudstorage_audit_logs_enabled."
                "cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_audit_logs_enabled.cloudstorage_audit_logs_enabled import (
                cloudstorage_audit_logs_enabled,
            )

            cloudresourcemanager_client.cloud_resource_manager_projects = []
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION

            check = cloudstorage_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_project_with_storage_audit_logs_enabled(self):
        cloudresourcemanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage."
                "cloudstorage_audit_logs_enabled."
                "cloudstorage_audit_logs_enabled."
                "cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                AuditConfig,
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_audit_logs_enabled.cloudstorage_audit_logs_enabled import (
                cloudstorage_audit_logs_enabled,
            )

            project = Project(
                id=GCP_PROJECT_ID,
                audit_logging=True,
                audit_configs=[
                    AuditConfig(
                        service="storage.googleapis.com",
                        log_types=["DATA_READ", "DATA_WRITE"],
                    )
                ],
            )

            cloudresourcemanager_client.cloud_resource_manager_projects = [project]
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = cloudstorage_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Project {GCP_PROJECT_ID} has Data Access audit logs "
                f"(DATA_READ and DATA_WRITE) enabled for Cloud Storage."
            )
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == "test-project"

    def test_project_with_audit_logs_but_no_storage_config(self):
        cloudresourcemanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage."
                "cloudstorage_audit_logs_enabled."
                "cloudstorage_audit_logs_enabled."
                "cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                AuditConfig,
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_audit_logs_enabled.cloudstorage_audit_logs_enabled import (
                cloudstorage_audit_logs_enabled,
            )

            # Project has audit logs enabled but for a different service (not Cloud Storage)
            project = Project(
                id=GCP_PROJECT_ID,
                audit_logging=True,
                audit_configs=[
                    AuditConfig(
                        service="compute.googleapis.com",
                        log_types=["DATA_READ", "DATA_WRITE"],
                    )
                ],
            )

            cloudresourcemanager_client.cloud_resource_manager_projects = [project]
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = cloudstorage_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Project {GCP_PROJECT_ID} has Audit Logs enabled for other services but not for Cloud Storage."
            )
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == "test-project"

    def test_project_without_audit_logs(self):
        cloudresourcemanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage."
                "cloudstorage_audit_logs_enabled."
                "cloudstorage_audit_logs_enabled."
                "cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_audit_logs_enabled.cloudstorage_audit_logs_enabled import (
                cloudstorage_audit_logs_enabled,
            )

            project = Project(
                id=GCP_PROJECT_ID,
                audit_logging=False,
                audit_configs=[],
            )

            cloudresourcemanager_client.cloud_resource_manager_projects = [project]
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = cloudstorage_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Project {GCP_PROJECT_ID} does not have Audit Logs enabled."
            )
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == "test-project"

    def test_project_with_missing_log_types(self):
        cloudresourcemanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage."
                "cloudstorage_audit_logs_enabled."
                "cloudstorage_audit_logs_enabled."
                "cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                AuditConfig,
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_audit_logs_enabled.cloudstorage_audit_logs_enabled import (
                cloudstorage_audit_logs_enabled,
            )

            project = Project(
                id=GCP_PROJECT_ID,
                audit_logging=True,
                audit_configs=[
                    AuditConfig(
                        service="storage.googleapis.com",
                        log_types=["DATA_WRITE"],
                    )
                ],
            )

            cloudresourcemanager_client.cloud_resource_manager_projects = [project]
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = cloudstorage_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"Project {GCP_PROJECT_ID} has Audit Logs enabled for Cloud Storage but is missing some required log types"
                f"(missing: DATA_READ)."
            )
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == "test-project"

    def test_project_with_combined_audit_configs(self):
        cloudresourcemanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage."
                "cloudstorage_audit_logs_enabled."
                "cloudstorage_audit_logs_enabled."
                "cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                AuditConfig,
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_audit_logs_enabled.cloudstorage_audit_logs_enabled import (
                cloudstorage_audit_logs_enabled,
            )

            # Project has both allServices (with DATA_READ)
            # and storage.googleapis.com (with DATA_WRITE)
            project = Project(
                id=GCP_PROJECT_ID,
                audit_logging=True,
                audit_configs=[
                    AuditConfig(
                        service="allServices",
                        log_types=["DATA_READ"],
                    ),
                    AuditConfig(
                        service="storage.googleapis.com",
                        log_types=["DATA_WRITE"],
                    ),
                ],
            )

            cloudresourcemanager_client.cloud_resource_manager_projects = [project]
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = cloudstorage_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Project {GCP_PROJECT_ID} has Data Access audit logs "
                f"(DATA_READ and DATA_WRITE) enabled for Cloud Storage."
            )
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == "test-project"

    def test_project_with_allservices_audit_config(self):
        cloudresourcemanager_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudstorage."
                "cloudstorage_audit_logs_enabled."
                "cloudstorage_audit_logs_enabled."
                "cloudresourcemanager_client",
                new=cloudresourcemanager_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
                AuditConfig,
                Project,
            )
            from prowler.providers.gcp.services.cloudstorage.cloudstorage_audit_logs_enabled.cloudstorage_audit_logs_enabled import (
                cloudstorage_audit_logs_enabled,
            )

            # Project has allServices with both log types
            project = Project(
                id=GCP_PROJECT_ID,
                audit_logging=True,
                audit_configs=[
                    AuditConfig(
                        service="allServices",
                        log_types=["DATA_READ", "DATA_WRITE"],
                    )
                ],
            )

            cloudresourcemanager_client.cloud_resource_manager_projects = [project]
            cloudresourcemanager_client.region = GCP_US_CENTER1_LOCATION
            cloudresourcemanager_client.projects = {
                GCP_PROJECT_ID: GCPProject(
                    id=GCP_PROJECT_ID,
                    number="123456789012",
                    name="test-project",
                    labels={},
                    lifecycle_state="ACTIVE",
                )
            }

            check = cloudstorage_audit_logs_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"Project {GCP_PROJECT_ID} has Data Access audit logs "
                f"(DATA_READ and DATA_WRITE) enabled for Cloud Storage."
            )
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].location == GCP_US_CENTER1_LOCATION
            assert result[0].resource_name == "test-project"
```

--------------------------------------------------------------------------------

````
