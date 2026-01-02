---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 753
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 753 of 867)

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

---[FILE: clusters_backup_enabled_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/clusters/clusters_backup_enabled/clusters_backup_enabled_test.py

```python
from unittest import mock

# Mock Provider.get_global_provider() before importing clusters_service
with mock.patch(
    "prowler.providers.common.provider.Provider.get_global_provider"
) as mock_get_global_provider:
    mock_provider = mock.MagicMock()
    mock_provider.session = mock.MagicMock()
    mock_provider.session.base_url = "https://cloud.mongodb.com/api/atlas/v1.0"
    mock_provider.audit_config = {}
    mock_get_global_provider.return_value = mock_provider

    from prowler.providers.mongodbatlas.services.clusters.clusters_service import (
        Cluster,
    )

from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    CLUSTER_ID,
    CLUSTER_NAME,
    CLUSTER_TYPE,
    MONGO_VERSION,
    PROJECT_ID,
    PROJECT_NAME,
    STATE_NAME,
    set_mocked_mongodbatlas_provider,
)


class Test_clusters_backup_enabled:
    def test_no_clusters(self):
        clusters_client = mock.MagicMock
        clusters_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_backup_enabled.clusters_backup_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_backup_enabled.clusters_backup_enabled import (
                clusters_backup_enabled,
            )

            check = clusters_backup_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_clusters_backup_enabled(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                auth_enabled=False,
                ssl_enabled=False,
                backup_enabled=True,
                encryption_at_rest_provider=None,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_backup_enabled.clusters_backup_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_backup_enabled.clusters_backup_enabled import (
                clusters_backup_enabled,
            )

            check = clusters_backup_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has backup enabled."
            )

    def test_clusters_backup_disabled(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                auth_enabled=False,
                ssl_enabled=False,
                backup_enabled=False,
                encryption_at_rest_provider=None,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_backup_enabled.clusters_backup_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_backup_enabled.clusters_backup_enabled import (
                clusters_backup_enabled,
            )

            check = clusters_backup_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} does not have backup enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: clusters_encryption_at_rest_enabled_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/clusters/clusters_encryption_at_rest_enabled/clusters_encryption_at_rest_enabled_test.py

```python
from unittest import mock

# Mock Provider.get_global_provider() before importing clusters_service
with mock.patch(
    "prowler.providers.common.provider.Provider.get_global_provider"
) as mock_get_global_provider:
    mock_provider = mock.MagicMock()
    mock_provider.session = mock.MagicMock()
    mock_provider.session.base_url = "https://cloud.mongodb.com/api/atlas/v1.0"
    mock_provider.audit_config = {}
    mock_get_global_provider.return_value = mock_provider

    from prowler.providers.mongodbatlas.services.clusters.clusters_service import (
        Cluster,
    )

from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    CLUSTER_ID,
    CLUSTER_NAME,
    CLUSTER_TYPE,
    MONGO_VERSION,
    PROJECT_ID,
    PROJECT_NAME,
    STATE_NAME,
    set_mocked_mongodbatlas_provider,
)


class Test_clusters_encryption_at_rest_enabled:
    def test_no_clusters(self):
        clusters_client = mock.MagicMock
        clusters_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_clusters_encryption_at_rest_enabled_aws(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                encryption_at_rest_provider="AWS",
                backup_enabled=False,
                auth_enabled=False,
                ssl_enabled=False,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has encryption at rest enabled with provider: AWS."
            )

    def test_clusters_encryption_at_rest_enabled_azure(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                encryption_at_rest_provider="AZURE",
                backup_enabled=False,
                auth_enabled=False,
                ssl_enabled=False,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has encryption at rest enabled with provider: AZURE."
            )

    def test_clusters_encryption_at_rest_enabled_gcp(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                encryption_at_rest_provider="GCP",
                backup_enabled=False,
                auth_enabled=False,
                ssl_enabled=False,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has encryption at rest enabled with provider: GCP."
            )

    def test_clusters_encryption_at_rest_disabled_none(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                encryption_at_rest_provider="NONE",
                backup_enabled=False,
                auth_enabled=False,
                ssl_enabled=False,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has encryption at rest explicitly disabled."
            )

    def test_clusters_encryption_at_rest_unsupported_provider(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                encryption_at_rest_provider="UNSUPPORTED",
                backup_enabled=False,
                auth_enabled=False,
                ssl_enabled=False,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has an unsupported encryption provider: UNSUPPORTED."
            )

    def test_clusters_encryption_at_rest_enabled_ebs(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                encryption_at_rest_provider=None,
                backup_enabled=False,
                auth_enabled=False,
                ssl_enabled=False,
                provider_settings={"encryptEBSVolume": True},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has EBS volume encryption enabled."
            )

    def test_clusters_encryption_at_rest_disabled(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                encryption_at_rest_provider=None,
                backup_enabled=False,
                auth_enabled=False,
                ssl_enabled=False,
                provider_settings={"encryptEBSVolume": False},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} does not have encryption at rest enabled."
            )

    def test_clusters_encryption_at_rest_disabled_empty_settings(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                encryption_at_rest_provider=None,
                backup_enabled=False,
                auth_enabled=False,
                ssl_enabled=False,
                provider_settings=None,
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_encryption_at_rest_enabled.clusters_encryption_at_rest_enabled import (
                clusters_encryption_at_rest_enabled,
            )

            check = clusters_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} does not have encryption at rest enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: clusters_tls_enabled_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/clusters/clusters_tls_enabled/clusters_tls_enabled_test.py

```python
from unittest import mock

# Mock Provider.get_global_provider() before importing clusters_service
with mock.patch(
    "prowler.providers.common.provider.Provider.get_global_provider"
) as mock_get_global_provider:
    mock_provider = mock.MagicMock()
    mock_provider.session = mock.MagicMock()
    mock_provider.session.base_url = "https://cloud.mongodb.com/api/atlas/v1.0"
    mock_provider.audit_config = {}
    mock_get_global_provider.return_value = mock_provider

    from prowler.providers.mongodbatlas.services.clusters.clusters_service import (
        Cluster,
    )

from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    CLUSTER_ID,
    CLUSTER_NAME,
    CLUSTER_TYPE,
    MONGO_VERSION,
    PROJECT_ID,
    PROJECT_NAME,
    STATE_NAME,
    set_mocked_mongodbatlas_provider,
)


class Test_clusters_tls_enabled:
    def test_no_clusters(self):
        clusters_client = mock.MagicMock
        clusters_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_tls_enabled.clusters_tls_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_tls_enabled.clusters_tls_enabled import (
                clusters_tls_enabled,
            )

            check = clusters_tls_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_clusters_tls_enabled(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                auth_enabled=False,
                ssl_enabled=True,
                backup_enabled=False,
                encryption_at_rest_provider=None,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_tls_enabled.clusters_tls_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_tls_enabled.clusters_tls_enabled import (
                clusters_tls_enabled,
            )

            check = clusters_tls_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} has TLS authentication enabled."
            )

    def test_clusters_tls_disabled(self):
        clusters_client = mock.MagicMock
        cluster_name = CLUSTER_NAME
        project_name = PROJECT_NAME
        clusters_client.clusters = {
            f"{PROJECT_ID}:{CLUSTER_NAME}": Cluster(
                id=CLUSTER_ID,
                name=cluster_name,
                project_id=PROJECT_ID,
                project_name=project_name,
                mongo_db_version=MONGO_VERSION,
                cluster_type=CLUSTER_TYPE,
                state_name=STATE_NAME,
                auth_enabled=False,
                ssl_enabled=False,
                backup_enabled=False,
                encryption_at_rest_provider=None,
                provider_settings={},
                replication_specs=[],
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.clusters.clusters_tls_enabled.clusters_tls_enabled.clusters_client",
                new=clusters_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.clusters.clusters_tls_enabled.clusters_tls_enabled import (
                clusters_tls_enabled,
            )

            check = clusters_tls_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_name == cluster_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_name} in project {project_name} does not have TLS authentication enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: organizations_service_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/organizations/organizations_service_test.py

```python
from unittest.mock import patch

from prowler.providers.mongodbatlas.services.organizations.organizations_service import (
    Organization,
    Organizations,
    OrganizationSettings,
)
from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    ORG_ID,
    set_mocked_mongodbatlas_provider,
)


def mock_organizations_list_organizations(_):
    return {
        ORG_ID: Organization(
            id=ORG_ID,
            name="Test Organization",
            settings=OrganizationSettings(
                api_access_list_required=True,
                ip_access_list_enabled=True,
                ip_access_list=["192.168.1.0/24"],
                multi_factor_auth_required=True,
                security_contact="security@example.com",
                max_service_account_secret_validity_in_hours=8,
            ),
            location="global",
        )
    }


@patch(
    "prowler.providers.mongodbatlas.services.organizations.organizations_service.Organizations._list_organizations",
    new=mock_organizations_list_organizations,
)
class Test_Organizations_Service:
    def test_get_client(self):
        organizations_service_client = Organizations(set_mocked_mongodbatlas_provider())
        assert organizations_service_client.__class__.__name__ == "Organizations"

    def test_list_organizations(self):
        organizations_service_client = Organizations(set_mocked_mongodbatlas_provider())
        assert len(organizations_service_client.organizations) == 1

        organization = organizations_service_client.organizations[ORG_ID]

        assert organization.id == ORG_ID
        assert organization.name == "Test Organization"
        assert organization.location == "global"
        assert organization.settings is not None
        assert organization.settings.api_access_list_required is True
        assert organization.settings.ip_access_list_enabled is True
        assert organization.settings.ip_access_list == ["192.168.1.0/24"]
        assert organization.settings.multi_factor_auth_required is True
        assert organization.settings.security_contact == "security@example.com"
        assert organization.settings.max_service_account_secret_validity_in_hours == 8


class Test_Organizations_Service_Integration:
    def setup_method(self):
        self.mock_provider = set_mocked_mongodbatlas_provider()

    def test_list_organizations_with_real_api_calls(self):
        """Test organizations listing with mocked API responses"""
        with patch.object(Organizations, "__init__", lambda x, y: None):
            organizations_service = Organizations(self.mock_provider)
            organizations_service.provider = self.mock_provider

            # Mock _paginate_request to return organization data
            mock_org_data = [{"id": ORG_ID, "name": "Test Organization"}]
            with patch.object(
                organizations_service, "_paginate_request", return_value=mock_org_data
            ):
                # Mock _make_request to return settings data
                mock_settings = {
                    "apiAccessListRequired": True,
                    "ipAccessListEnabled": True,
                    "ipAccessList": ["192.168.1.0/24"],
                    "multiFactorAuthRequired": True,
                    "securityContact": "security@example.com",
                    "maxServiceAccountSecretValidityInHours": 8,
                }
                with patch.object(
                    organizations_service, "_make_request", return_value=mock_settings
                ):
                    organizations = organizations_service._list_organizations()

                    assert len(organizations) == 1
                    assert ORG_ID in organizations

                    organization = organizations[ORG_ID]
                    assert organization.name == "Test Organization"
                    assert organization.settings is not None
                    assert organization.settings.api_access_list_required is True

    def test_list_organizations_api_error_handling(self):
        """Test that API errors are handled gracefully"""
        with patch.object(Organizations, "__init__", lambda x, y: None):
            organizations_service = Organizations(self.mock_provider)
            organizations_service.provider = self.mock_provider

            # Mock _paginate_request to raise an exception
            with patch.object(
                organizations_service,
                "_paginate_request",
                side_effect=Exception("API Error"),
            ):
                with patch(
                    "prowler.providers.mongodbatlas.services.organizations.organizations_service.logger"
                ) as mock_logger:
                    organizations = organizations_service._list_organizations()

                    # Should be empty due to API error
                    assert len(organizations) == 0
                    # Should log error
                    mock_logger.error.assert_called()

    def test_organization_settings_error_handling(self):
        """Test that organization settings errors are handled gracefully"""
        with patch.object(Organizations, "__init__", lambda x, y: None):
            organizations_service = Organizations(self.mock_provider)
            organizations_service.provider = self.mock_provider

            # Mock _paginate_request to return organization data
            mock_org_data = [{"id": ORG_ID, "name": "Test Organization"}]
            with patch.object(
                organizations_service, "_paginate_request", return_value=mock_org_data
            ):
                # Mock _make_request to raise an exception for settings
                with patch.object(
                    organizations_service,
                    "_make_request",
                    side_effect=Exception("Settings API Error"),
                ):
                    with patch(
                        "prowler.providers.mongodbatlas.services.organizations.organizations_service.logger"
                    ) as mock_logger:
                        organizations = organizations_service._list_organizations()

                        # Should still create organization but with None settings
                        assert len(organizations) == 1
                        assert ORG_ID in organizations

                        organization = organizations[ORG_ID]
                        assert organization.name == "Test Organization"
                        assert organization.settings is None
                        # Should log error for settings
                        mock_logger.error.assert_called()


class Test_Organization_Model:
    def test_organization_model_creation(self):
        """Test Organization model creation with all fields"""
        settings = OrganizationSettings(
            api_access_list_required=True,
            ip_access_list_enabled=True,
            ip_access_list=["192.168.1.0/24"],
            multi_factor_auth_required=True,
            security_contact="security@example.com",
            max_service_account_secret_validity_in_hours=8,
        )

        organization = Organization(
            id=ORG_ID,
            name="Test Organization",
            settings=settings,
            location="global",
        )

        assert organization.id == ORG_ID
        assert organization.name == "Test Organization"
        assert organization.location == "global"
        assert organization.settings == settings

    def test_organization_settings_model_creation(self):
        """Test OrganizationSettings model creation with all fields"""
        settings = OrganizationSettings(
            api_access_list_required=True,
            ip_access_list_enabled=True,
            ip_access_list=["192.168.1.0/24", "10.0.0.0/8"],
            multi_factor_auth_required=True,
            security_contact="security@example.com",
            max_service_account_secret_validity_in_hours=24,
        )

        assert settings.api_access_list_required is True
        assert settings.ip_access_list_enabled is True
        assert settings.ip_access_list == ["192.168.1.0/24", "10.0.0.0/8"]
        assert settings.multi_factor_auth_required is True
        assert settings.security_contact == "security@example.com"
        assert settings.max_service_account_secret_validity_in_hours == 24
```

--------------------------------------------------------------------------------

````
