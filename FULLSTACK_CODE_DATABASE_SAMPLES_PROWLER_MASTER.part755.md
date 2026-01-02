---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 755
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 755 of 867)

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

---[FILE: projects_auditing_enabled_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/projects/projects_auditing_enabled/projects_auditing_enabled_test.py

```python
from unittest import mock

from prowler.providers.mongodbatlas.services.projects.projects_service import (
    AuditConfig,
    Project,
)
from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    ORG_ID,
    PROJECT_ID,
    PROJECT_NAME,
    set_mocked_mongodbatlas_provider,
)


class Test_projects_auditing_enabled:
    def test_no_projects(self):
        projects_client = mock.MagicMock
        projects_client.projects = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled import (
                projects_auditing_enabled,
            )

            check = projects_auditing_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_projects_auditing_enabled(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[],
                project_settings=None,
                audit_config=AuditConfig(
                    enabled=True,
                    audit_filter=None,
                ),
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled import (
                projects_auditing_enabled,
            )

            check = projects_auditing_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Project {project_name} has database auditing enabled."
            )

    def test_projects_auditing_enabled_with_filter(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        audit_filter = '{"atype": "authenticate", "param": {"user": "admin"}}'
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[],
                project_settings=None,
                audit_config=AuditConfig(
                    enabled=True,
                    audit_filter=audit_filter,
                ),
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled import (
                projects_auditing_enabled,
            )

            check = projects_auditing_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Project {project_name} has database auditing enabled. Audit filter configured: {audit_filter}"
            )

    def test_projects_auditing_disabled(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[],
                project_settings=None,
                audit_config=AuditConfig(
                    enabled=False,
                    audit_filter=None,
                ),
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled import (
                projects_auditing_enabled,
            )

            check = projects_auditing_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {project_name} does not have database auditing enabled."
            )

    def test_projects_no_audit_config(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[],
                project_settings=None,
                audit_config=None,
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_auditing_enabled.projects_auditing_enabled import (
                projects_auditing_enabled,
            )

            check = projects_auditing_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {project_name} does not have audit configuration available."
            )
```

--------------------------------------------------------------------------------

---[FILE: projects_network_access_list_exposed_to_internet.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/projects/projects_network_access_list_exposed_to_internet/projects_network_access_list_exposed_to_internet.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.mongodbatlas.models import MongoDBAtlasNetworkAccessEntry
from prowler.providers.mongodbatlas.services.projects.projects_service import Project
from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    ORG_ID,
    PROJECT_ID,
    PROJECT_NAME,
    set_mocked_mongodbatlas_provider,
)


class TestProjectsNetworkAccessListNotOpenToWorld:
    def _create_project_with_network_entries(self, network_entries):
        """Helper method to create a project with network access entries"""
        return Project(
            id=PROJECT_ID,
            name=PROJECT_NAME,
            org_id=ORG_ID,
            created="2024-01-01T00:00:00Z",
            cluster_count=0,
            network_access_entries=network_entries,
            project_settings={},
            audit_config={},
        )

    def _execute_check_with_project(self, project):
        """Helper method to execute check with a project"""
        projects_client = MagicMock()
        projects_client.projects = {PROJECT_ID: project}

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            patch(
                "prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet.projects_client",
                new=projects_client,
            ),
        ):
            from prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet import (
                projects_network_access_list_exposed_to_internet,
            )

            check = projects_network_access_list_exposed_to_internet()
            return check.execute()

    def test_check_with_no_network_access_entries(self):
        """Test check with no network access entries"""
        project = self._create_project_with_network_entries([])
        reports = self._execute_check_with_project(project)

        assert len(reports) == 1
        assert reports[0].status == "FAIL"
        assert "has no network access list entries" in reports[0].status_extended

    def test_check_with_open_world_cidr(self):
        """Test check with open world CIDR block"""
        network_entries = [
            MongoDBAtlasNetworkAccessEntry(
                cidr_block="0.0.0.0/0", comment="Open to world"
            )
        ]
        project = self._create_project_with_network_entries(network_entries)
        reports = self._execute_check_with_project(project)

        assert len(reports) == 1
        assert reports[0].status == "FAIL"
        assert "open to the world" in reports[0].status_extended
        assert "0.0.0.0/0" in reports[0].status_extended

    def test_check_with_open_world_ipv6(self):
        """Test check with open world IPv6 CIDR block"""
        network_entries = [
            MongoDBAtlasNetworkAccessEntry(
                cidr_block="::/0", comment="Open to world IPv6"
            )
        ]
        project = self._create_project_with_network_entries(network_entries)
        reports = self._execute_check_with_project(project)

        assert len(reports) == 1
        assert reports[0].status == "FAIL"
        assert "open to the world" in reports[0].status_extended
        assert "::/0" in reports[0].status_extended

    def test_check_with_open_world_ip_address(self):
        """Test check with open world IP address"""
        network_entries = [
            MongoDBAtlasNetworkAccessEntry(
                ip_address="0.0.0.0", comment="Open to world IP"
            )
        ]
        project = self._create_project_with_network_entries(network_entries)
        reports = self._execute_check_with_project(project)

        assert len(reports) == 1
        assert reports[0].status == "FAIL"
        assert "open to the world" in reports[0].status_extended
        assert "0.0.0.0" in reports[0].status_extended

    def test_check_with_restricted_access(self):
        """Test check with properly restricted access"""
        network_entries = [
            MongoDBAtlasNetworkAccessEntry(
                cidr_block="10.0.0.0/8", comment="Private network"
            ),
            MongoDBAtlasNetworkAccessEntry(
                ip_address="192.168.1.100", comment="Specific IP"
            ),
        ]
        project = self._create_project_with_network_entries(network_entries)
        reports = self._execute_check_with_project(project)

        assert len(reports) == 1
        assert reports[0].status == "PASS"
        assert "properly configured" in reports[0].status_extended
        assert "2 restricted entries" in reports[0].status_extended

    def test_check_with_mixed_access(self):
        """Test check with mixed access (both restricted and open)"""
        network_entries = [
            MongoDBAtlasNetworkAccessEntry(
                cidr_block="10.0.0.0/8", comment="Private network"
            ),
            MongoDBAtlasNetworkAccessEntry(
                cidr_block="0.0.0.0/0", comment="Open to world"
            ),
        ]
        project = self._create_project_with_network_entries(network_entries)
        reports = self._execute_check_with_project(project)

        assert len(reports) == 1
        assert reports[0].status == "FAIL"
        assert "open to the world" in reports[0].status_extended
        assert "0.0.0.0/0" in reports[0].status_extended

    def test_check_with_aws_security_group(self):
        """Test check with AWS security group entry"""
        network_entries = [
            MongoDBAtlasNetworkAccessEntry(
                aws_security_group="sg-12345678", comment="AWS security group"
            )
        ]
        project = self._create_project_with_network_entries(network_entries)
        reports = self._execute_check_with_project(project)

        assert len(reports) == 1
        assert reports[0].status == "PASS"
        assert "properly configured" in reports[0].status_extended
```

--------------------------------------------------------------------------------

---[FILE: projects_network_access_list_exposed_to_internet_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/services/projects/projects_network_access_list_exposed_to_internet/projects_network_access_list_exposed_to_internet_test.py

```python
from unittest import mock

from prowler.providers.mongodbatlas.services.projects.projects_service import (
    MongoDBAtlasNetworkAccessEntry,
    Project,
)
from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    ORG_ID,
    PROJECT_ID,
    PROJECT_NAME,
    set_mocked_mongodbatlas_provider,
)


class Test_projects_network_access_list_exposed_to_internet:
    def test_no_projects(self):
        projects_client = mock.MagicMock
        projects_client.projects = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet import (
                projects_network_access_list_exposed_to_internet,
            )

            check = projects_network_access_list_exposed_to_internet()
            result = check.execute()
            assert len(result) == 0

    def test_projects_no_network_access_entries(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[],
                project_settings=None,
                audit_config=None,
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet import (
                projects_network_access_list_exposed_to_internet,
            )

            check = projects_network_access_list_exposed_to_internet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {project_name} has no network access list entries configured, which may allow unrestricted access."
            )

    def test_projects_open_world_cidr_ipv4(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[
                    MongoDBAtlasNetworkAccessEntry(
                        cidr_block="0.0.0.0/0",
                        comment="Open to world",
                    )
                ],
                project_settings=None,
                audit_config=None,
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet import (
                projects_network_access_list_exposed_to_internet,
            )

            check = projects_network_access_list_exposed_to_internet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {project_name} has network access entries open to the world: CIDR: 0.0.0.0/0. This allows unrestricted access from anywhere on the internet."
            )

    def test_projects_open_world_cidr_ipv6(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[
                    MongoDBAtlasNetworkAccessEntry(
                        cidr_block="::/0",
                        comment="Open to world IPv6",
                    )
                ],
                project_settings=None,
                audit_config=None,
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet import (
                projects_network_access_list_exposed_to_internet,
            )

            check = projects_network_access_list_exposed_to_internet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {project_name} has network access entries open to the world: CIDR: ::/0. This allows unrestricted access from anywhere on the internet."
            )

    def test_projects_open_world_ip_address(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[
                    MongoDBAtlasNetworkAccessEntry(
                        ip_address="0.0.0.0",
                        comment="Open to world IP",
                    )
                ],
                project_settings=None,
                audit_config=None,
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet import (
                projects_network_access_list_exposed_to_internet,
            )

            check = projects_network_access_list_exposed_to_internet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {project_name} has network access entries open to the world: IP: 0.0.0.0. This allows unrestricted access from anywhere on the internet."
            )

    def test_projects_restricted_access(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[
                    MongoDBAtlasNetworkAccessEntry(
                        cidr_block="10.0.0.0/8",
                        comment="Private network",
                    ),
                    MongoDBAtlasNetworkAccessEntry(
                        ip_address="192.168.1.100",
                        comment="Specific IP",
                    ),
                ],
                project_settings=None,
                audit_config=None,
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet import (
                projects_network_access_list_exposed_to_internet,
            )

            check = projects_network_access_list_exposed_to_internet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Project {project_name} has properly configured network access list with 2 restricted entries."
            )

    def test_projects_mixed_access(self):
        projects_client = mock.MagicMock
        project_name = PROJECT_NAME
        projects_client.projects = {
            PROJECT_ID: Project(
                id=PROJECT_ID,
                name=project_name,
                org_id=ORG_ID,
                created="2024-01-01T00:00:00Z",
                cluster_count=1,
                network_access_entries=[
                    MongoDBAtlasNetworkAccessEntry(
                        cidr_block="10.0.0.0/8",
                        comment="Private network",
                    ),
                    MongoDBAtlasNetworkAccessEntry(
                        cidr_block="0.0.0.0/0",
                        comment="Open to world",
                    ),
                ],
                project_settings=None,
                audit_config=None,
                location="global",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_mongodbatlas_provider(),
            ),
            mock.patch(
                "prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet.projects_client",
                new=projects_client,
            ),
        ):

            from prowler.providers.mongodbatlas.services.projects.projects_network_access_list_exposed_to_internet.projects_network_access_list_exposed_to_internet import (
                projects_network_access_list_exposed_to_internet,
            )

            check = projects_network_access_list_exposed_to_internet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_id == PROJECT_ID
            assert result[0].resource_name == project_name
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Project {project_name} has network access entries open to the world: CIDR: 0.0.0.0/0. This allows unrestricted access from anywhere on the internet."
            )
```

--------------------------------------------------------------------------------

---[FILE: nhn_fixtures.py]---
Location: prowler-master/tests/providers/nhn/nhn_fixtures.py

```python
from mock import MagicMock

from prowler.providers.nhn.nhn_provider import NhnProvider


def set_mocked_nhn_provider(
    username="test_user",
    password="test_password",
    tenant_id="tenant123",
    audit_config=None,
    fixer_config=None,
):
    """
    Creates a mocked NHN Provider object for testing without real network calls.
    """
    provider = MagicMock(spec=NhnProvider)  # or just MagicMock()

    provider.type = "nhn"
    provider._username = username
    provider._password = password
    provider._tenant_id = tenant_id
    provider._token = "fake_keystone_token"

    provider.session = MagicMock()

    provider.audit_config = audit_config
    provider.fixer_config = fixer_config

    return provider
```

--------------------------------------------------------------------------------

---[FILE: nhn_provider_test.py]---
Location: prowler-master/tests/providers/nhn/nhn_provider_test.py

```python
import os
from unittest.mock import MagicMock, patch

import pytest

from prowler.providers.common.models import Connection
from prowler.providers.nhn.nhn_provider import NhnProvider


class TestNhnProvider:
    @patch.dict(
        os.environ,
        {
            "NHN_USERNAME": "env_user",
            "NHN_PASSWORD": "env_pass",
            "NHN_TENANT_ID": "env_tenant",
        },
    )
    @patch("prowler.providers.nhn.nhn_provider.load_and_validate_config_file")
    @patch("requests.post")
    def test_nhn_provider_init_success(self, mock_post, mock_load_config):
        """
        Test a successful initialization of NhnProvider
        with valid username/password/tenant_id and a Keystone token response = 200.
        """
        # 1) Mock load_and_validate_config_file to avoid reading real config file
        mock_load_config.return_value = {}

        # 2) Mock the requests.post to simulate a successful token response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "access": {"token": {"id": "fake_keystone_token"}}
        }
        mock_post.return_value = mock_response

        # 3) Create provider
        provider = NhnProvider(
            username="test_user",
            password="test_pass",
            tenant_id="test_tenant",
        )

        # 4) Assertions
        assert provider._token == "fake_keystone_token"
        assert provider.session is not None
        assert provider.session.headers["X-Auth-Token"] == "fake_keystone_token"

    @patch.dict(os.environ, {}, clear=True)
    @patch(
        "prowler.providers.nhn.nhn_provider.load_and_validate_config_file",
        return_value={},
    )
    def test_nhn_provider_init_missing_args(self, mock_load_config):
        """
        Test initialization when username/password/tenant_id is missing => ValueError
        """
        with pytest.raises(ValueError) as exc_info:
            NhnProvider(username="", password="secret", tenant_id="tenant")
        assert "requires username, password and tenant_id" in str(exc_info.value)

    @patch(
        "prowler.providers.nhn.nhn_provider.load_and_validate_config_file",
        return_value={},
    )
    @patch("requests.post")
    def test_nhn_provider_init_token_fail(self, mock_post, mock_load_config):
        """
        Test the case where Keystone token request fails (non-200)
        => provider._session remains None
        """
        mock_post.return_value.status_code = 401
        mock_post.return_value.text = "Unauthorized"

        with pytest.raises(ValueError) as exc_info:
            NhnProvider(
                username="test_user",
                password="test_pass",
                tenant_id="tenant123",
            )

        assert "Failed to get NHN token" in str(exc_info.value)

    @patch("prowler.providers.nhn.nhn_provider.requests")
    def test_test_connection_success(self, mock_requests):
        """
        Test test_connection static method => success case
        """
        # 1) Mock token success
        mock_post_response = MagicMock()
        mock_post_response.status_code = 200
        mock_post_response.json.return_value = {
            "access": {"token": {"id": "fake_keystone_token"}}
        }
        # 2) Mock /servers success
        mock_get_response = MagicMock()
        mock_get_response.status_code = 200
        mock_requests.post.return_value = mock_post_response
        mock_requests.get.return_value = mock_get_response

        conn = NhnProvider.test_connection(
            username="test_user",
            password="test_pass",
            tenant_id="tenant123",
            raise_on_exception=True,
        )

        assert isinstance(conn, Connection)
        assert conn.is_connected is True
        assert conn.error is None

    @patch("prowler.providers.nhn.nhn_provider.requests")
    def test_test_connection_token_fail(self, mock_requests):
        """
        Test test_connection => token request fails => returns Connection(error=...)
        """
        mock_requests.post.return_value.status_code = 403
        mock_requests.post.return_value.text = "Forbidden"

        conn = NhnProvider.test_connection(
            username="bad_user",
            password="bad_pass",
            tenant_id="tenant123",
            raise_on_exception=False,  # so we don't raise, we get Connection object
        )
        assert conn.is_connected is False
        assert conn.error is not None
        assert "Failed to get token" in str(conn.error)

    @patch("prowler.providers.nhn.nhn_provider.requests")
    def test_test_connection_servers_fail(self, mock_requests):
        """
        Test test_connection => token OK, but /servers fails => returns Connection(error=...)
        """
        # Keystone token success
        mock_post_response = MagicMock()
        mock_post_response.status_code = 200
        mock_post_response.json.return_value = {
            "access": {"token": {"id": "fake_keystone_token"}}
        }
        mock_requests.post.return_value = mock_post_response

        # /servers fail
        mock_get_response = MagicMock()
        mock_get_response.status_code = 500
        mock_get_response.text = "Internal Server Error"
        mock_requests.get.return_value = mock_get_response

        conn = NhnProvider.test_connection(
            username="test_user",
            password="test_pass",
            tenant_id="tenant123",
            raise_on_exception=False,
        )
        assert conn.is_connected is False
        assert conn.error is not None
        assert "/servers call failed" in str(conn.error)
```

--------------------------------------------------------------------------------

---[FILE: nhn_mutelist_test.py]---
Location: prowler-master/tests/providers/nhn/lib/mutelist/nhn_mutelist_test.py

```python
import yaml
from mock import MagicMock

from prowler.providers.nhn.lib.mutelist.mutelist import NHNMutelist
from tests.lib.outputs.fixtures.fixtures import generate_finding_output

MUTELIST_FIXTURE_PATH = "tests/providers/nhn/lib/mutelist/fixtures/nhn_mutelist.yaml"


class TestNHNMutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = NHNMutelist(mutelist_path=MUTELIST_FIXTURE_PATH)

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/lib/mutelist/fixtures/not_present"
        mutelist = NHNMutelist(mutelist_path=mutelist_path)

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_validate_mutelist_not_valid_key(self):
        mutelist_path = MUTELIST_FIXTURE_PATH
        with open(mutelist_path) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        mutelist_fixture["Accounts1"] = mutelist_fixture["Accounts"]
        del mutelist_fixture["Accounts"]

        mutelist = NHNMutelist(mutelist_content=mutelist_fixture)

        assert len(mutelist.validate_mutelist(mutelist_fixture)) == 0
        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path is None

    def test_is_finding_muted(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "resource_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = NHNMutelist(mutelist_content=mutelist_content)

        finding = MagicMock()
        finding.resource_id = "resource_1"
        finding.check_metadata = MagicMock()
        finding.check_metadata.CheckID = "check_test"
        finding.status = "FAIL"
        finding.resource_name = "test_resource"
        finding.location = "test_region"
        finding.resource_tags = {}

        assert mutelist.is_finding_muted(finding)

    def test_mute_finding(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "resource_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = NHNMutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="service_check_test",
            status="FAIL",
            account_uid="resource_1",
            region="test_region",
            resource_uid="test_resource",
            resource_tags={},
            muted=False,
        )

        muted_finding = mutelist.mute_finding(finding=finding_1)

        assert muted_finding.status == "MUTED"
        assert muted_finding.muted
        assert muted_finding.raw["status"] == "FAIL"
```

--------------------------------------------------------------------------------

---[FILE: nhn_mutelist.yaml]---
Location: prowler-master/tests/providers/nhn/lib/mutelist/fixtures/nhn_mutelist.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "subscription_1":
      Checks:
        "compute_instance_public_ip":
          Regions:
            - "*"
          Resources:
            - "resource_1"
            - "resource_2"
```

--------------------------------------------------------------------------------

````
