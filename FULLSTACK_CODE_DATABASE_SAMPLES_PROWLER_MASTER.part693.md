---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 693
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 693 of 867)

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

---[FILE: bigquery_dataset_public_access_test.py]---
Location: prowler-master/tests/providers/gcp/services/bigquery/bigquery_dataset_public_access/bigquery_dataset_public_access_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_bigquery_dataset_public_access:
    def test_bigquery_no_datasets(self):
        bigquery_client = mock.MagicMock()
        bigquery_client.datasets = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_dataset_public_access.bigquery_dataset_public_access.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_dataset_public_access.bigquery_dataset_public_access import (
                bigquery_dataset_public_access,
            )

            check = bigquery_dataset_public_access()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_dataset(self):
        from prowler.providers.gcp.services.bigquery.bigquery_service import Dataset

        dataset = Dataset(
            name="test",
            id="1234567890",
            region="us-central1",
            cmk_encryption=False,
            public=False,
            project_id=GCP_PROJECT_ID,
        )

        bigquery_client = mock.MagicMock()
        bigquery_client.project_ids = [GCP_PROJECT_ID]
        bigquery_client.datasets = [dataset]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_dataset_public_access.bigquery_dataset_public_access.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_dataset_public_access.bigquery_dataset_public_access import (
                bigquery_dataset_public_access,
            )

            check = bigquery_dataset_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Dataset {dataset.name} is not publicly accessible."
            )
            assert result[0].resource_id == dataset.id
            assert result[0].resource_name == dataset.name
            assert result[0].project_id == dataset.project_id
            assert result[0].location == dataset.region

    def test_one_non_compliant_dataset(self):
        from prowler.providers.gcp.services.bigquery.bigquery_service import Dataset

        dataset = Dataset(
            name="test",
            id="1234567890",
            region="us-central1",
            cmk_encryption=False,
            public=True,
            project_id=GCP_PROJECT_ID,
        )

        bigquery_client = mock.MagicMock()
        bigquery_client.project_ids = [GCP_PROJECT_ID]
        bigquery_client.datasets = [dataset]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_dataset_public_access.bigquery_dataset_public_access.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_dataset_public_access.bigquery_dataset_public_access import (
                bigquery_dataset_public_access,
            )

            check = bigquery_dataset_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Dataset {dataset.name} is publicly accessible."
            )
            assert result[0].resource_id == dataset.id
            assert result[0].resource_name == dataset.name
            assert result[0].project_id == dataset.project_id
            assert result[0].location == dataset.region
```

--------------------------------------------------------------------------------

---[FILE: bigquery_table_cmk_encryption_test.py]---
Location: prowler-master/tests/providers/gcp/services/bigquery/bigquery_table_cmk_encryption/bigquery_table_cmk_encryption_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_bigquery_table_cmk_encryption:
    def test_bigquery_no_tables(self):
        bigquery_client = mock.MagicMock()
        bigquery_client.tables = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_table_cmk_encryption.bigquery_table_cmk_encryption.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_table_cmk_encryption.bigquery_table_cmk_encryption import (
                bigquery_table_cmk_encryption,
            )

            check = bigquery_table_cmk_encryption()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_table(self):
        bigquery_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_table_cmk_encryption.bigquery_table_cmk_encryption.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_service import Table
            from prowler.providers.gcp.services.bigquery.bigquery_table_cmk_encryption.bigquery_table_cmk_encryption import (
                bigquery_table_cmk_encryption,
            )

            table = Table(
                name="test",
                id="1234567890",
                region="us-central1",
                cmk_encryption=True,
                project_id=GCP_PROJECT_ID,
            )

            bigquery_client.project_ids = [GCP_PROJECT_ID]
            bigquery_client.tables = [table]

            check = bigquery_table_cmk_encryption()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Table {table.name} is encrypted with Customer-Managed Keys (CMKs)."
            )
            assert result[0].resource_id == table.id
            assert result[0].resource_name == table.name
            assert result[0].project_id == table.project_id
            assert result[0].location == table.region

    def test_one_non_compliant_table(self):
        bigquery_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_table_cmk_encryption.bigquery_table_cmk_encryption.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_service import Table
            from prowler.providers.gcp.services.bigquery.bigquery_table_cmk_encryption.bigquery_table_cmk_encryption import (
                bigquery_table_cmk_encryption,
            )

            table = Table(
                name="test",
                id="1234567890",
                region="us-central1",
                cmk_encryption=False,
                project_id=GCP_PROJECT_ID,
            )

            bigquery_client.project_ids = [GCP_PROJECT_ID]
            bigquery_client.tables = [table]

            check = bigquery_table_cmk_encryption()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Table {table.name} is not encrypted with Customer-Managed Keys (CMKs)."
            )
            assert result[0].resource_id == table.id
            assert result[0].resource_name == table.name
            assert result[0].project_id == table.project_id
            assert result[0].location == table.region
```

--------------------------------------------------------------------------------

---[FILE: cloudresourcemanager_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudresourcemanager/cloudresourcemanager_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
    CloudResourceManager,
)
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestCloudResourceManagerService:
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
            api_keys_client = CloudResourceManager(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert api_keys_client.service == "cloudresourcemanager"
            assert api_keys_client.project_ids == [GCP_PROJECT_ID]

            assert len(api_keys_client.cloud_resource_manager_projects) == 1
            assert (
                api_keys_client.cloud_resource_manager_projects[0].id == GCP_PROJECT_ID
            )
            assert (
                api_keys_client.cloud_resource_manager_projects[0].number
                == "123456789012"
            )
            assert api_keys_client.cloud_resource_manager_projects[0].audit_logging

            assert len(api_keys_client.bindings) == 2
            assert (
                api_keys_client.bindings[0].role
                == "roles/resourcemanager.organizationAdmin"
            )
            assert len(api_keys_client.bindings[0].members) == 4
            assert api_keys_client.bindings[0].members[0] == "user:mike@example.com"
            assert api_keys_client.bindings[0].members[1] == "group:admins@example.com"
            assert api_keys_client.bindings[0].members[2] == "domain:google.com"
            assert (
                api_keys_client.bindings[0].members[3]
                == "serviceAccount:my-project-id@appspot.gserviceaccount.com"
            )
            assert api_keys_client.bindings[0].project_id == GCP_PROJECT_ID
            assert (
                api_keys_client.bindings[1].role
                == "roles/resourcemanager.organizationViewer"
            )
            assert len(api_keys_client.bindings[1].members) == 1
            assert api_keys_client.bindings[1].members[0] == "user:eve@example.com"
            assert api_keys_client.bindings[1].project_id == GCP_PROJECT_ID

            assert len(api_keys_client.organizations) == 2
            assert api_keys_client.organizations[0].id == "123456789"
            assert api_keys_client.organizations[0].name == "Organization 1"
            assert api_keys_client.organizations[1].id == "987654321"
            assert api_keys_client.organizations[1].name == "Organization 2"
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.cloudsql.cloudsql_service import CloudSQL
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestCloudSQLService:
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
            cloudsql_client = CloudSQL(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert cloudsql_client.service == "sqladmin"
            assert cloudsql_client.project_ids == [GCP_PROJECT_ID]

            assert len(cloudsql_client.instances) == 2

            assert cloudsql_client.instances[0].name == "instance1"
            assert cloudsql_client.instances[0].version == "MYSQL_5_7"
            assert cloudsql_client.instances[0].region == "us-central1"
            assert cloudsql_client.instances[0].ip_addresses == [
                {"type": "PRIMARY", "ipAddress": "66.66.66.66"}
            ]
            assert cloudsql_client.instances[0].public_ip
            assert cloudsql_client.instances[0].require_ssl
            assert cloudsql_client.instances[0].ssl_mode == "ENCRYPTED_ONLY"
            assert cloudsql_client.instances[0].automated_backups
            assert cloudsql_client.instances[0].authorized_networks == [
                {"value": "test"}
            ]
            assert cloudsql_client.instances[0].flags == []
            assert cloudsql_client.instances[0].project_id == GCP_PROJECT_ID

            assert cloudsql_client.instances[1].name == "instance2"
            assert cloudsql_client.instances[1].version == "POSTGRES_9_6"
            assert cloudsql_client.instances[1].region == "us-central1"
            assert cloudsql_client.instances[1].ip_addresses == [
                {"type": "PRIMARY", "ipAddress": "22.22.22.22"}
            ]
            assert cloudsql_client.instances[1].public_ip
            assert not cloudsql_client.instances[1].require_ssl
            assert (
                cloudsql_client.instances[1].ssl_mode
                == "ALLOW_UNENCRYPTED_AND_ENCRYPTED"
            )
            assert not cloudsql_client.instances[1].automated_backups
            assert cloudsql_client.instances[1].authorized_networks == [
                {"value": "test"}
            ]
            assert cloudsql_client.instances[1].flags == []
            assert cloudsql_client.instances[1].project_id == GCP_PROJECT_ID

    def test_instances_without_backup_configuration(self):
        """Test that CloudSQL service handles instances without backupConfiguration field"""

        def mock_api_client_without_backup_config(*args, **kwargs):
            from unittest.mock import MagicMock

            client = MagicMock()

            client.instances().list().execute.return_value = {
                "items": [
                    {
                        "name": "instance_no_backup_config",
                        "databaseVersion": "MYSQL_8_0",
                        "region": "us-east1",
                        "ipAddresses": [{"type": "PRIVATE", "ipAddress": "10.0.0.1"}],
                        "settings": {
                            "ipConfiguration": {
                                "requireSsl": True,
                                "sslMode": "ENCRYPTED_ONLY",
                                "authorizedNetworks": [],
                            },
                            "databaseFlags": [],
                            # backupConfiguration is missing
                        },
                    }
                ]
            }
            client.instances().list_next.return_value = None

            return client

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client_without_backup_config,
            ),
        ):
            cloudsql_client = CloudSQL(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            # Should handle gracefully with default value
            assert len(cloudsql_client.instances) == 1
            assert cloudsql_client.instances[0].name == "instance_no_backup_config"
            assert (
                cloudsql_client.instances[0].automated_backups is False
            )  # Default value

    def test_instances_with_empty_backup_configuration(self):
        """Test that CloudSQL service handles instances with empty backupConfiguration"""

        def mock_api_client_with_empty_backup_config(*args, **kwargs):
            from unittest.mock import MagicMock

            client = MagicMock()

            client.instances().list().execute.return_value = {
                "items": [
                    {
                        "name": "instance_empty_backup_config",
                        "databaseVersion": "POSTGRES_14",
                        "region": "europe-west1",
                        "ipAddresses": [
                            {"type": "PRIMARY", "ipAddress": "34.34.34.34"}
                        ],
                        "settings": {
                            "ipConfiguration": {
                                "requireSsl": False,
                            },
                            "backupConfiguration": {},  # Empty but present
                        },
                    }
                ]
            }
            client.instances().list_next.return_value = None

            return client

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client_with_empty_backup_config,
            ),
        ):
            cloudsql_client = CloudSQL(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            # Should handle gracefully with default value when 'enabled' key is missing
            assert len(cloudsql_client.instances) == 1
            assert cloudsql_client.instances[0].name == "instance_empty_backup_config"
            assert (
                cloudsql_client.instances[0].automated_backups is False
            )  # Default value

    def test_instances_without_settings_fields(self):
        """Test that CloudSQL service handles instances with minimal settings"""

        def mock_api_client_with_minimal_settings(*args, **kwargs):
            from unittest.mock import MagicMock

            client = MagicMock()

            client.instances().list().execute.return_value = {
                "items": [
                    {
                        "name": "instance_minimal",
                        "databaseVersion": "SQLSERVER_2019_STANDARD",
                        "region": "asia-east1",
                        "settings": {},  # Minimal settings object
                    }
                ]
            }
            client.instances().list_next.return_value = None

            return client

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client_with_minimal_settings,
            ),
        ):
            cloudsql_client = CloudSQL(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )

            # Should handle gracefully with all default values
            assert len(cloudsql_client.instances) == 1
            assert cloudsql_client.instances[0].name == "instance_minimal"
            assert cloudsql_client.instances[0].automated_backups is False
            assert cloudsql_client.instances[0].require_ssl is False
            assert (
                cloudsql_client.instances[0].ssl_mode
                == "ALLOW_UNENCRYPTED_AND_ENCRYPTED"
            )
            assert cloudsql_client.instances[0].authorized_networks == []
            assert cloudsql_client.instances[0].flags == []
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_automated_backups_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_automated_backups/cloudsql_instance_automated_backups_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_automated_backups:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_automated_backups.cloudsql_instance_automated_backups.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_automated_backups.cloudsql_instance_automated_backups import (
                cloudsql_instance_automated_backups,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_automated_backups()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_instance_with_automated_backups(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_automated_backups.cloudsql_instance_automated_backups.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_automated_backups.cloudsql_instance_automated_backups import (
                cloudsql_instance_automated_backups,
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

            check = cloudsql_instance_automated_backups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Database Instance instance1 has automated backups configured."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_without_automated_backups(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_automated_backups.cloudsql_instance_automated_backups.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_automated_backups.cloudsql_instance_automated_backups import (
                cloudsql_instance_automated_backups,
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
                    automated_backups=False,
                    authorized_networks=[],
                    flags=[],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_automated_backups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Database Instance instance1 does not have automated backups configured."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_mysql_local_infile_flag_test.py]---
Location: prowler-master/tests/providers/gcp/services/cloudsql/cloudsql_instance_mysql_local_infile_flag/cloudsql_instance_mysql_local_infile_flag_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import (
    GCP_EU1_LOCATION,
    GCP_PROJECT_ID,
    set_mocked_gcp_provider,
)


class Test_cloudsql_instance_mysql_local_infile_flag:
    def test_no_cloudsql_instances(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag import (
                cloudsql_instance_mysql_local_infile_flag,
            )

            cloudsql_client.instances = []

            check = cloudsql_instance_mysql_local_infile_flag()
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
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag import (
                cloudsql_instance_mysql_local_infile_flag,
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

            check = cloudsql_instance_mysql_local_infile_flag()
            result = check.execute()
            assert len(result) == 0

    def test_cloudsql_instance_with_no_flags(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag import (
                cloudsql_instance_mysql_local_infile_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="MYSQL_15",
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

            check = cloudsql_instance_mysql_local_infile_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "MySQL Instance instance1 does not have 'local_infile' flag set to 'off'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_with_local_infile_flag_off(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag import (
                cloudsql_instance_mysql_local_infile_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="MYSQL_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[{"name": "local_infile", "value": "off"}],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_mysql_local_infile_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "MySQL Instance instance1 has 'local_infile' flag set to 'off'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID

    def test_cloudsql_instance_with_local_infile_flag_on(self):
        cloudsql_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag.cloudsql_client",
                new=cloudsql_client,
            ),
        ):
            from prowler.providers.gcp.services.cloudsql.cloudsql_instance_mysql_local_infile_flag.cloudsql_instance_mysql_local_infile_flag import (
                cloudsql_instance_mysql_local_infile_flag,
            )
            from prowler.providers.gcp.services.cloudsql.cloudsql_service import (
                Instance,
            )

            cloudsql_client.instances = [
                Instance(
                    name="instance1",
                    version="MYSQL_15",
                    ip_addresses=[],
                    region=GCP_EU1_LOCATION,
                    public_ip=False,
                    require_ssl=False,
                    ssl_mode="ENCRYPTED_ONLY",
                    automated_backups=True,
                    authorized_networks=[],
                    flags=[{"name": "local_infile", "value": "on"}],
                    project_id=GCP_PROJECT_ID,
                )
            ]

            check = cloudsql_instance_mysql_local_infile_flag()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "MySQL Instance instance1 does not have 'local_infile' flag set to 'off'."
            )
            assert result[0].resource_id == "instance1"
            assert result[0].resource_name == "instance1"
            assert result[0].location == GCP_EU1_LOCATION
            assert result[0].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

````
