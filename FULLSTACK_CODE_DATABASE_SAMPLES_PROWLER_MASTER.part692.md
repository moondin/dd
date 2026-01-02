---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 692
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 692 of 867)

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

---[FILE: gcp_mutelist_test.py]---
Location: prowler-master/tests/providers/gcp/lib/mutelist/gcp_mutelist_test.py

```python
import yaml
from mock import MagicMock

from prowler.providers.gcp.lib.mutelist.mutelist import GCPMutelist
from tests.lib.outputs.fixtures.fixtures import generate_finding_output

MUTELIST_FIXTURE_PATH = "tests/providers/gcp/lib/mutelist/fixtures/gcp_mutelist.yaml"


class TestGCPMutelist:
    def test_get_mutelist_file_from_local_file(self):
        mutelist = GCPMutelist(mutelist_path=MUTELIST_FIXTURE_PATH)

        with open(MUTELIST_FIXTURE_PATH) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        assert mutelist.mutelist == mutelist_fixture
        assert mutelist.mutelist_file_path == MUTELIST_FIXTURE_PATH

    def test_get_mutelist_file_from_local_file_non_existent(self):
        mutelist_path = "tests/lib/mutelist/fixtures/not_present"
        mutelist = GCPMutelist(mutelist_path=mutelist_path)

        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path == mutelist_path

    def test_validate_mutelist_not_valid_key(self):
        mutelist_path = MUTELIST_FIXTURE_PATH
        with open(mutelist_path) as f:
            mutelist_fixture = yaml.safe_load(f)["Mutelist"]

        mutelist_fixture["Accounts1"] = mutelist_fixture["Accounts"]
        del mutelist_fixture["Accounts"]

        mutelist = GCPMutelist(mutelist_content=mutelist_fixture)

        assert len(mutelist.validate_mutelist(mutelist_fixture)) == 0
        assert mutelist.mutelist == {}
        assert mutelist.mutelist_file_path is None

    def test_is_finding_muted(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "project_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = GCPMutelist(mutelist_content=mutelist_content)

        finding = MagicMock
        finding.check_metadata = MagicMock
        finding.check_metadata.CheckID = "check_test"
        finding.status = "FAIL"
        finding.resource_name = "test_resource"
        finding.location = "test-location"
        finding.resource_tags = []
        finding.project_id = "project_1"

        assert mutelist.is_finding_muted(finding)

    def test_mute_finding(self):
        # Mutelist
        mutelist_content = {
            "Accounts": {
                "project_1": {
                    "Checks": {
                        "check_test": {
                            "Regions": ["*"],
                            "Resources": ["test_resource"],
                        }
                    }
                }
            }
        }

        mutelist = GCPMutelist(mutelist_content=mutelist_content)

        finding_1 = generate_finding_output(
            check_id="service_check_test",
            status="FAIL",
            account_uid="project_1",
            region="test-region",
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

---[FILE: gcp_mutelist.yaml]---
Location: prowler-master/tests/providers/gcp/lib/mutelist/fixtures/gcp_mutelist.yaml

```yaml
### Account, Check and/or Region can be * to apply for all the cases.
### Resources and tags are lists that can have either Regex or Keywords.
### Tags is an optional list that matches on tuples of 'key=value' and are "ANDed" together.
### Use an alternation Regex to match one of multiple tags with "ORed" logic.
### For each check you can except Accounts, Regions, Resources and/or Tags.
###########################  MUTELIST EXAMPLE  ###########################
Mutelist:
  Accounts:
    "project_1":
      Checks:
        "apikeys_api_restrictions_configured":
          Regions:
            - "*"
          Resources:
            - "resource_1"
            - "resource_2"
```

--------------------------------------------------------------------------------

---[FILE: accesscontextmanager_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/accesscontextmanager/accesscontextmanager_service_test.py

```python
from unittest.mock import MagicMock, patch

from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestAccessContextManagerService:
    def test_service(self):
        # Mock cloudresourcemanager_client before importing accesscontextmanager
        mock_crm_client = MagicMock()
        mock_crm_client.organizations = [
            MagicMock(id="123456789", name="Organization 1"),
        ]

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                new=mock_api_client,
            ),
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service.cloudresourcemanager_client",
                new=mock_crm_client,
            ),
        ):
            from prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service import (
                AccessContextManager,
            )

            accesscontextmanager_client = AccessContextManager(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert accesscontextmanager_client.service == "accesscontextmanager"
            assert accesscontextmanager_client.project_ids == [GCP_PROJECT_ID]

            # Should have 2 service perimeters from the first access policy
            assert len(accesscontextmanager_client.service_perimeters) == 2

            # First service perimeter
            assert (
                accesscontextmanager_client.service_perimeters[0].name
                == "accessPolicies/123456/servicePerimeters/perimeter1"
            )
            assert (
                accesscontextmanager_client.service_perimeters[0].title
                == "Test Perimeter 1"
            )
            assert (
                accesscontextmanager_client.service_perimeters[0].perimeter_type
                == "PERIMETER_TYPE_REGULAR"
            )
            assert accesscontextmanager_client.service_perimeters[0].resources == [
                f"projects/{GCP_PROJECT_ID}"
            ]
            assert accesscontextmanager_client.service_perimeters[
                0
            ].restricted_services == [
                "storage.googleapis.com",
                "bigquery.googleapis.com",
            ]
            assert (
                accesscontextmanager_client.service_perimeters[0].policy_name
                == "accessPolicies/123456"
            )

            # Second service perimeter
            assert (
                accesscontextmanager_client.service_perimeters[1].name
                == "accessPolicies/123456/servicePerimeters/perimeter2"
            )
            assert (
                accesscontextmanager_client.service_perimeters[1].title
                == "Test Perimeter 2"
            )
            assert (
                accesscontextmanager_client.service_perimeters[1].perimeter_type
                == "PERIMETER_TYPE_BRIDGE"
            )
            assert accesscontextmanager_client.service_perimeters[1].resources == []
            assert accesscontextmanager_client.service_perimeters[
                1
            ].restricted_services == [
                "compute.googleapis.com",
            ]
            assert (
                accesscontextmanager_client.service_perimeters[1].policy_name
                == "accessPolicies/123456"
            )

    def test_get_service_perimeters_access_policies_error(self):
        """Test error handling when listing access policies fails."""
        mock_crm_client = MagicMock()
        mock_crm_client.organizations = [
            MagicMock(id="123456789", name="Organization 1"),
        ]

        mock_client = MagicMock()

        def mock_list_access_policies_error(parent):
            return_value = MagicMock()
            return_value.execute.side_effect = Exception("Access denied")
            return return_value

        mock_client.accessPolicies().list = mock_list_access_policies_error

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                return_value=mock_client,
            ),
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service.cloudresourcemanager_client",
                new=mock_crm_client,
            ),
        ):
            from prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service import (
                AccessContextManager,
            )

            accesscontextmanager_client = AccessContextManager(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert len(accesscontextmanager_client.service_perimeters) == 0

    def test_get_service_perimeters_list_perimeters_error(self):
        """Test error handling when listing service perimeters fails."""
        mock_crm_client = MagicMock()
        mock_crm_client.organizations = [
            MagicMock(id="123456789", name="Organization 1"),
        ]

        mock_client = MagicMock()

        def mock_list_access_policies(parent):
            return_value = MagicMock()
            return_value.execute.return_value = {
                "accessPolicies": [{"name": "accessPolicies/123456"}]
            }
            return return_value

        def mock_list_perimeters_error(parent):
            return_value = MagicMock()
            return_value.execute.side_effect = Exception("Permission denied")
            return return_value

        mock_client.accessPolicies().list = mock_list_access_policies
        mock_client.accessPolicies().list_next.return_value = None
        mock_client.accessPolicies().servicePerimeters().list = (
            mock_list_perimeters_error
        )

        with (
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__is_api_active__",
                new=mock_is_api_active,
            ),
            patch(
                "prowler.providers.gcp.lib.service.service.GCPService.__generate_client__",
                return_value=mock_client,
            ),
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            patch(
                "prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service.cloudresourcemanager_client",
                new=mock_crm_client,
            ),
        ):
            from prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_service import (
                AccessContextManager,
            )

            accesscontextmanager_client = AccessContextManager(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert len(accesscontextmanager_client.service_perimeters) == 0
```

--------------------------------------------------------------------------------

---[FILE: apikeys_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/apikeys/apikeys_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.apikeys.apikeys_service import APIKeys
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestAPIKeysService:
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
            api_keys_client = APIKeys(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert api_keys_client.service == "apikeys"
            assert api_keys_client.project_ids == [GCP_PROJECT_ID]

            assert len(api_keys_client.keys) == 2

            assert api_keys_client.keys[0].name == "key1"
            assert api_keys_client.keys[0].id.__class__.__name__ == "str"
            assert api_keys_client.keys[0].creation_time == "2021-01-01T00:00:00Z"
            assert api_keys_client.keys[0].restrictions.__class__.__name__ == "dict"
            assert api_keys_client.keys[0].project_id == GCP_PROJECT_ID

            assert api_keys_client.keys[1].name == "key2"
            assert api_keys_client.keys[1].id.__class__.__name__ == "str"
            assert api_keys_client.keys[1].creation_time == "2021-01-01T00:00:00Z"
            assert api_keys_client.keys[1].restrictions.__class__.__name__ == "dict"
            assert api_keys_client.keys[1].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: apikeys_api_restrictions_configured_test.py]---
Location: prowler-master/tests/providers/gcp/services/apikeys/apikeys_api_restrictions_configured/apikeys_api_restrictions_configured_test.py

```python
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_apikeys_api_restrictions_configured:
    def test_apikeys_no_keys(self):
        apikeys_client = mock.MagicMock()
        apikeys_client.keys = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_api_restrictions_configured.apikeys_api_restrictions_configured.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_api_restrictions_configured.apikeys_api_restrictions_configured import (
                apikeys_api_restrictions_configured,
            )

            check = apikeys_api_restrictions_configured()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_key(self):
        from prowler.providers.gcp.services.apikeys.apikeys_service import Key

        key = Key(
            name="test",
            id="123",
            creation_time="2023-06-01T11:21:41.627509Z",
            restrictions={
                "apiTargets": [
                    {"service": "dns.googleapis.com"},
                    {"service": "oslogin.googleapis.com"},
                ]
            },
            project_id=GCP_PROJECT_ID,
        )

        apikeys_client = mock.MagicMock()
        apikeys_client.project_ids = [GCP_PROJECT_ID]
        apikeys_client.keys = [key]
        apikeys_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_api_restrictions_configured.apikeys_api_restrictions_configured.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_api_restrictions_configured.apikeys_api_restrictions_configured import (
                apikeys_api_restrictions_configured,
            )

            check = apikeys_api_restrictions_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"API key {key.name} has restrictions configured.",
                result[0].status_extended,
            )
            assert result[0].resource_id == key.id

    def test_one_key_without_restrictions(self):
        from prowler.providers.gcp.services.apikeys.apikeys_service import Key

        key = Key(
            name="test",
            id="123",
            creation_time="2022-06-05T11:21:41.627509Z",
            restrictions={},
            project_id=GCP_PROJECT_ID,
        )

        apikeys_client = mock.MagicMock()
        apikeys_client.project_ids = [GCP_PROJECT_ID]
        apikeys_client.keys = [key]
        apikeys_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_api_restrictions_configured.apikeys_api_restrictions_configured.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_api_restrictions_configured.apikeys_api_restrictions_configured import (
                apikeys_api_restrictions_configured,
            )

            check = apikeys_api_restrictions_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"API key {key.name} does not have restrictions configured.",
                result[0].status_extended,
            )
            assert result[0].resource_id == key.id

    def test_one_key_with_cloudapis_restriction(self):
        from prowler.providers.gcp.services.apikeys.apikeys_service import Key

        key = Key(
            name="test",
            id="123",
            creation_time="2022-06-05T11:21:41.627509Z",
            restrictions={
                "apiTargets": [
                    {"service": "dns.googleapis.com"},
                    {"service": "oslogin.googleapis.com"},
                    {"service": "cloudapis.googleapis.com"},
                ]
            },
            project_id=GCP_PROJECT_ID,
        )

        apikeys_client = mock.MagicMock()
        apikeys_client.project_ids = [GCP_PROJECT_ID]
        apikeys_client.keys = [key]
        apikeys_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_api_restrictions_configured.apikeys_api_restrictions_configured.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_api_restrictions_configured.apikeys_api_restrictions_configured import (
                apikeys_api_restrictions_configured,
            )

            check = apikeys_api_restrictions_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"API key {key.name} does not have restrictions configured.",
                result[0].status_extended,
            )
            assert result[0].resource_id == key.id
```

--------------------------------------------------------------------------------

---[FILE: apikeys_key_exists_test.py]---
Location: prowler-master/tests/providers/gcp/services/apikeys/apikeys_key_exists/apikeys_key_exists_test.py

```python
from re import search
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_apikeys_key_exists:
    def test_apikeys_no_keys(self):
        apikeys_client = mock.MagicMock()
        apikeys_client.project_ids = [GCP_PROJECT_ID]
        apikeys_client.keys = []
        apikeys_client.region = "global"
        apikeys_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_key_exists.apikeys_key_exists.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_key_exists.apikeys_key_exists import (
                apikeys_key_exists,
            )

            check = apikeys_key_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"Project {GCP_PROJECT_ID} does not have active API Keys.",
                result[0].status_extended,
            )
            assert result[0].resource_id == GCP_PROJECT_ID

    def test_one_compliant_key(self):
        from prowler.providers.gcp.services.apikeys.apikeys_service import Key

        key = Key(
            name="test",
            id="123",
            creation_time="2023-06-01T11:21:41.627509Z",
            restrictions={},
            project_id=GCP_PROJECT_ID,
        )

        apikeys_client = mock.MagicMock()
        apikeys_client.project_ids = [GCP_PROJECT_ID]
        apikeys_client.keys = [key]
        apikeys_client.region = "global"
        apikeys_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_key_exists.apikeys_key_exists.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_key_exists.apikeys_key_exists import (
                apikeys_key_exists,
            )

            check = apikeys_key_exists()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"Project {GCP_PROJECT_ID} has active API Keys.",
                result[0].status_extended,
            )
            assert result[0].resource_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: apikeys_key_rotated_in_90_days_test.py]---
Location: prowler-master/tests/providers/gcp/services/apikeys/apikeys_key_rotated_in_90_days/apikeys_key_rotated_in_90_days_test.py

```python
from datetime import datetime, timedelta, timezone
from re import search
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_apikeys_key_rotated_in_90_days:
    def test_apikeys_no_keys(self):
        apikeys_client = mock.MagicMock()
        apikeys_client.keys = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_key_rotated_in_90_days.apikeys_key_rotated_in_90_days.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_key_rotated_in_90_days.apikeys_key_rotated_in_90_days import (
                apikeys_key_rotated_in_90_days,
            )

            check = apikeys_key_rotated_in_90_days()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_key(self):
        from prowler.providers.gcp.services.apikeys.apikeys_service import Key

        key = Key(
            name="test",
            id="123",
            creation_time=(datetime.now(timezone.utc) - timedelta(30)).strftime(
                "%Y-%m-%dT%H:%M:%S.%f%z"
            ),
            restrictions={},
            project_id=GCP_PROJECT_ID,
        )

        apikeys_client = mock.MagicMock()
        apikeys_client.project_ids = [GCP_PROJECT_ID]
        apikeys_client.keys = [key]
        apikeys_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_key_rotated_in_90_days.apikeys_key_rotated_in_90_days.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_key_rotated_in_90_days.apikeys_key_rotated_in_90_days import (
                apikeys_key_rotated_in_90_days,
            )

            check = apikeys_key_rotated_in_90_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                f"API key {key.name} created in less than 90 days.",
                result[0].status_extended,
            )
            assert result[0].resource_id == key.id

    def test_one_key_with_more_than_90_days(self):
        from prowler.providers.gcp.services.apikeys.apikeys_service import Key

        key = Key(
            name="test",
            id="123",
            creation_time=(datetime.now(timezone.utc) - timedelta(100)).strftime(
                "%Y-%m-%dT%H:%M:%S.%f%z"
            ),
            restrictions={},
            project_id=GCP_PROJECT_ID,
        )

        apikeys_client = mock.MagicMock()
        apikeys_client.project_ids = [GCP_PROJECT_ID]
        apikeys_client.keys = [key]
        apikeys_client.region = "global"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.apikeys.apikeys_key_rotated_in_90_days.apikeys_key_rotated_in_90_days.apikeys_client",
                new=apikeys_client,
            ),
        ):
            from prowler.providers.gcp.services.apikeys.apikeys_key_rotated_in_90_days.apikeys_key_rotated_in_90_days import (
                apikeys_key_rotated_in_90_days,
            )

            check = apikeys_key_rotated_in_90_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"API key {key.name} creation date has more than 90 days.",
                result[0].status_extended,
            )
            assert result[0].resource_id == key.id
```

--------------------------------------------------------------------------------

---[FILE: artifacts_container_analysis_enabled_test.py]---
Location: prowler-master/tests/providers/gcp/services/artifacts/artifacts_container_analysis_enabled/artifacts_container_analysis_enabled_test.py

```python
from unittest import mock

from prowler.providers.gcp.models import GCPProject
from prowler.providers.gcp.services.serviceusage.serviceusage_service import Service
from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_artifacts_container_analysis_enabled:
    def test_serviceusage_no_active_services(self):
        serviceusage_client = mock.MagicMock()
        serviceusage_client.active_services = {}
        serviceusage_client.project_ids = [GCP_PROJECT_ID]
        serviceusage_client.region = "global"
        serviceusage_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.artifacts.artifacts_container_analysis_enabled.artifacts_container_analysis_enabled.serviceusage_client",
                new=serviceusage_client,
            ),
        ):
            from prowler.providers.gcp.services.artifacts.artifacts_container_analysis_enabled.artifacts_container_analysis_enabled import (
                artifacts_container_analysis_enabled,
            )

            check = artifacts_container_analysis_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"AR Container Analysis is not enabled in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "containeranalysis.googleapis.com"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "AR Container Analysis"
            assert result[0].location == serviceusage_client.region

    def test_serviceusage_active_cloudasset(self):
        serviceusage_client = mock.MagicMock()
        serviceusage_client.active_services = {
            GCP_PROJECT_ID: [
                Service(
                    name="containeranalysis.googleapis.com",
                    title="AR Container Analysis",
                    project_id=GCP_PROJECT_ID,
                )
            ]
        }
        serviceusage_client.project_ids = [GCP_PROJECT_ID]
        serviceusage_client.region = "global"
        serviceusage_client.projects = {
            GCP_PROJECT_ID: GCPProject(
                id=GCP_PROJECT_ID,
                number="123456789012",
                name="test",
                labels={},
                lifecycle_state="ACTIVE",
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.artifacts.artifacts_container_analysis_enabled.artifacts_container_analysis_enabled.serviceusage_client",
                new=serviceusage_client,
            ),
        ):
            from prowler.providers.gcp.services.artifacts.artifacts_container_analysis_enabled.artifacts_container_analysis_enabled import (
                artifacts_container_analysis_enabled,
            )

            check = artifacts_container_analysis_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"AR Container Analysis is enabled in project {GCP_PROJECT_ID}."
            )
            assert result[0].resource_id == "containeranalysis.googleapis.com"
            assert result[0].project_id == GCP_PROJECT_ID
            assert result[0].resource_name == "AR Container Analysis"
            assert result[0].location == serviceusage_client.region
```

--------------------------------------------------------------------------------

---[FILE: bigquery_service_test.py]---
Location: prowler-master/tests/providers/gcp/services/bigquery/bigquery_service_test.py

```python
from unittest.mock import patch

from prowler.providers.gcp.services.bigquery.bigquery_service import BigQuery
from tests.providers.gcp.gcp_fixtures import (
    GCP_PROJECT_ID,
    mock_api_client,
    mock_is_api_active,
    set_mocked_gcp_provider,
)


class TestBigQueryService:
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
            bigquery_client = BigQuery(
                set_mocked_gcp_provider(project_ids=[GCP_PROJECT_ID])
            )
            assert bigquery_client.service == "bigquery"
            assert bigquery_client.project_ids == [GCP_PROJECT_ID]

            assert len(bigquery_client.datasets) == 2

            assert bigquery_client.datasets[0].name == "unique_dataset1_name"
            assert bigquery_client.datasets[0].id.__class__.__name__ == "str"
            assert bigquery_client.datasets[0].region == "US"
            assert bigquery_client.datasets[0].cmk_encryption
            assert bigquery_client.datasets[0].public
            assert bigquery_client.datasets[0].project_id == GCP_PROJECT_ID

            assert bigquery_client.datasets[1].name == "unique_dataset2_name"
            assert bigquery_client.datasets[1].id.__class__.__name__ == "str"
            assert bigquery_client.datasets[1].region == "EU"
            assert not bigquery_client.datasets[1].cmk_encryption
            assert not bigquery_client.datasets[1].public
            assert bigquery_client.datasets[1].project_id == GCP_PROJECT_ID

            assert len(bigquery_client.tables) == 2

            assert bigquery_client.tables[0].name == "unique_table1_name"
            assert bigquery_client.tables[0].id.__class__.__name__ == "str"
            assert bigquery_client.tables[0].region == "US"
            assert bigquery_client.tables[0].cmk_encryption
            assert bigquery_client.tables[0].project_id == GCP_PROJECT_ID

            assert bigquery_client.tables[1].name == "unique_table2_name"
            assert bigquery_client.tables[1].id.__class__.__name__ == "str"
            assert bigquery_client.tables[1].region == "US"
            assert not bigquery_client.tables[1].cmk_encryption
            assert bigquery_client.tables[1].project_id == GCP_PROJECT_ID
```

--------------------------------------------------------------------------------

---[FILE: bigquery_dataset_cmk_encryption_test.py]---
Location: prowler-master/tests/providers/gcp/services/bigquery/bigquery_dataset_cmk_encryption/bigquery_dataset_cmk_encryption_test.py

```python
from unittest import mock

from tests.providers.gcp.gcp_fixtures import GCP_PROJECT_ID, set_mocked_gcp_provider


class Test_bigquery_dataset_cmk_encryption:
    def test_bigquery_no_datasets(self):
        bigquery_client = mock.MagicMock()
        bigquery_client.datasets = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_dataset_cmk_encryption.bigquery_dataset_cmk_encryption.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_dataset_cmk_encryption.bigquery_dataset_cmk_encryption import (
                bigquery_dataset_cmk_encryption,
            )

            check = bigquery_dataset_cmk_encryption()
            result = check.execute()
            assert len(result) == 0

    def test_one_compliant_dataset(self):
        bigquery_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_dataset_cmk_encryption.bigquery_dataset_cmk_encryption.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_dataset_cmk_encryption.bigquery_dataset_cmk_encryption import (
                bigquery_dataset_cmk_encryption,
            )
            from prowler.providers.gcp.services.bigquery.bigquery_service import Dataset

            dataset = Dataset(
                name="test",
                id="1234567890",
                region="us-central1",
                cmk_encryption=True,
                public=False,
                project_id=GCP_PROJECT_ID,
            )
            bigquery_client.project_ids = [GCP_PROJECT_ID]
            bigquery_client.datasets = [dataset]

            check = bigquery_dataset_cmk_encryption()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Dataset {dataset.name} is encrypted with Customer-Managed Keys (CMKs)."
            )
            assert result[0].resource_id == dataset.id
            assert result[0].resource_name == dataset.name
            assert result[0].project_id == dataset.project_id
            assert result[0].location == dataset.region

    def test_one_non_compliant_dataset(self):
        bigquery_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_gcp_provider(),
            ),
            mock.patch(
                "prowler.providers.gcp.services.bigquery.bigquery_dataset_cmk_encryption.bigquery_dataset_cmk_encryption.bigquery_client",
                new=bigquery_client,
            ),
        ):
            from prowler.providers.gcp.services.bigquery.bigquery_dataset_cmk_encryption.bigquery_dataset_cmk_encryption import (
                bigquery_dataset_cmk_encryption,
            )
            from prowler.providers.gcp.services.bigquery.bigquery_service import Dataset

            dataset = Dataset(
                name="test",
                id="1234567890",
                region="us-central1",
                cmk_encryption=False,
                public=False,
                project_id=GCP_PROJECT_ID,
            )

            bigquery_client.project_ids = [GCP_PROJECT_ID]
            bigquery_client.datasets = [dataset]

            check = bigquery_dataset_cmk_encryption()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Dataset {dataset.name} is not encrypted with Customer-Managed Keys (CMKs)."
            )
            assert result[0].resource_id == dataset.id
            assert result[0].resource_name == dataset.name
            assert result[0].project_id == dataset.project_id
            assert result[0].location == dataset.region
```

--------------------------------------------------------------------------------

````
