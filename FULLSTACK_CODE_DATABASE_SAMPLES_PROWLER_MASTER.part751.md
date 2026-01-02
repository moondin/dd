---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 751
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 751 of 867)

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

---[FILE: teams_meeting_recording_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_recording_disabled/teams_meeting_recording_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_recording_disabled:
    def test_no_global_meeting_policy(self):
        teams_client = mock.MagicMock()
        teams_client.global_meeting_policy = None
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_recording_disabled.teams_meeting_recording_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_recording_disabled.teams_meeting_recording_disabled import (
                teams_meeting_recording_disabled,
            )

            check = teams_meeting_recording_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_meeting_recording_enabled(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_recording_disabled.teams_meeting_recording_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_recording_disabled.teams_meeting_recording_disabled import (
                teams_meeting_recording_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_cloud_recording=True
            )

            check = teams_meeting_recording_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == "Meeting recording is enabled by default."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_meeting_recording_disabled(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_recording_disabled.teams_meeting_recording_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_recording_disabled.teams_meeting_recording_disabled import (
                teams_meeting_recording_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_cloud_recording=False
            )

            check = teams_meeting_recording_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "Meeting recording is disabled by default."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"
```

--------------------------------------------------------------------------------

---[FILE: teams_security_reporting_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_security_reporting_enabled/teams_security_reporting_enabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_security_reporting_enabled:
    def test_no_policies(self):
        teams_client = mock.MagicMock()
        teams_client.global_messaging_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_security_reporting_enabled.teams_security_reporting_enabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_security_reporting_enabled.teams_security_reporting_enabled import (
                teams_security_reporting_enabled,
            )

            check = teams_security_reporting_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_security_reporting_properly_configured(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_security_reporting_enabled.teams_security_reporting_enabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_security_reporting_enabled.teams_security_reporting_enabled import (
                teams_security_reporting_enabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMessagingPolicy,
            )

            teams_client.global_messaging_policy = GlobalMessagingPolicy(
                allow_security_end_user_reporting=True
            )

            check = teams_security_reporting_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Security reporting is enabled in Teams messaging policy."
            )
            assert result[0].resource_name == "Teams Security Reporting Settings"
            assert result[0].resource_id == "teamsSecurityReporting"
```

--------------------------------------------------------------------------------

---[FILE: teams_unmanaged_communication_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_unmanaged_communication_disabled/teams_unmanaged_communication_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_unmanaged_communication_disabled:
    def test_no_user_settings(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN
        teams_client.user_settings = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_unmanaged_communication_disabled.teams_unmanaged_communication_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_unmanaged_communication_disabled.teams_unmanaged_communication_disabled import (
                teams_unmanaged_communication_disabled,
            )

            check = teams_unmanaged_communication_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_unmanaged_communication_allowed(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_unmanaged_communication_disabled.teams_unmanaged_communication_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_service import UserSettings
            from prowler.providers.m365.services.teams.teams_unmanaged_communication_disabled.teams_unmanaged_communication_disabled import (
                teams_unmanaged_communication_disabled,
            )

            teams_client.user_settings = UserSettings(
                allow_teams_consumer=True,
            )

            check = teams_unmanaged_communication_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Teams users can communicate with unmanaged users."
            )
            assert result[0].resource == teams_client.user_settings.dict()
            assert result[0].resource_name == "Teams User Settings"
            assert result[0].resource_id == "userSettings"
            assert result[0].location == "global"

    def test_unmanaged_communication_restricted(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_unmanaged_communication_disabled.teams_unmanaged_communication_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_service import UserSettings
            from prowler.providers.m365.services.teams.teams_unmanaged_communication_disabled.teams_unmanaged_communication_disabled import (
                teams_unmanaged_communication_disabled,
            )

            teams_client.user_settings = UserSettings(
                allow_teams_consumer=False,
            )

            check = teams_unmanaged_communication_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Teams users cannot communicate with unmanaged users."
            )
            assert result[0].resource == teams_client.user_settings.dict()
            assert result[0].resource_name == "Teams User Settings"
            assert result[0].resource_id == "userSettings"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: mongodbatlas_fixtures.py]---
Location: prowler-master/tests/providers/mongodbatlas/mongodbatlas_fixtures.py

```python
"""MongoDB Atlas Test Fixtures"""

from mock import MagicMock

from prowler.providers.mongodbatlas.models import (
    MongoDBAtlasIdentityInfo,
    MongoDBAtlasSession,
)
from prowler.providers.mongodbatlas.mongodbatlas_provider import MongodbatlasProvider

# Test credentials
ATLAS_PUBLIC_KEY = "test_public_key"
ATLAS_PRIVATE_KEY = "test_private_key"
ATLAS_BASE_URL = "https://cloud.mongodb.com/api/atlas/v2"

# Test user identity
ORGANIZATION_ID = "test_org_id"
ORGANIZATION_NAME = "test_org_name"

# Test project
PROJECT_ID = "test_project_id"
PROJECT_NAME = "test_project"
ORG_ID = "test_org_id"

# Test cluster
CLUSTER_ID = "test_cluster_id"
CLUSTER_NAME = "test_cluster"
CLUSTER_TYPE = "REPLICASET"
MONGO_VERSION = "7.0"
STATE_NAME = "IDLE"

# Test network access entries
NETWORK_ACCESS_ENTRY_OPEN = {"cidrBlock": "0.0.0.0/0", "comment": "Open to world"}

NETWORK_ACCESS_ENTRY_RESTRICTED = {
    "cidrBlock": "10.0.0.0/8",
    "comment": "Private network",
}

# Mock API responses
MOCK_ORGS_RESPONSE = {
    "results": [
        {
            "id": ORG_ID,
            "name": "Test Organization",
            "isDeleted": False,
        }
    ],
    "totalCount": 1,
}

MOCK_PROJECT_RESPONSE = {
    "id": PROJECT_ID,
    "name": PROJECT_NAME,
    "orgId": ORG_ID,
    "created": "2024-01-01T00:00:00Z",
    "clusterCount": 1,
}

MOCK_CLUSTER_RESPONSE = {
    "id": CLUSTER_ID,
    "name": CLUSTER_NAME,
    "clusterType": CLUSTER_TYPE,
    "mongoDBVersion": MONGO_VERSION,
    "stateName": STATE_NAME,
    "encryptionAtRestProvider": "AWS",
    "backupEnabled": True,
    "providerSettings": {
        "providerName": "AWS",
        "regionName": "US_EAST_1",
        "encryptEBSVolume": True,
    },
}

MOCK_NETWORK_ACCESS_RESPONSE = {
    "results": [NETWORK_ACCESS_ENTRY_OPEN, NETWORK_ACCESS_ENTRY_RESTRICTED],
    "totalCount": 2,
}

MOCK_PAGINATED_PROJECTS_RESPONSE = {"results": [MOCK_PROJECT_RESPONSE], "totalCount": 1}

MOCK_PAGINATED_CLUSTERS_RESPONSE = {"results": [MOCK_CLUSTER_RESPONSE], "totalCount": 1}


# Mocked MongoDB Atlas Provider
def set_mocked_mongodbatlas_provider(
    session: MongoDBAtlasSession = MongoDBAtlasSession(
        public_key=ATLAS_PUBLIC_KEY,
        private_key=ATLAS_PRIVATE_KEY,
        base_url=ATLAS_BASE_URL,
    ),
    identity: MongoDBAtlasIdentityInfo = MongoDBAtlasIdentityInfo(
        organization_id=ORGANIZATION_ID,
        organization_name=ORGANIZATION_NAME,
        roles=["ORGANIZATION_ADMIN"],
    ),
    audit_config: dict = None,
    organization_id: str = None,
    project_id: str = None,
) -> MongodbatlasProvider:

    provider = MagicMock()
    provider.type = "mongodbatlas"
    provider.session = session
    provider.identity = identity
    provider.audit_config = audit_config
    provider.organization_id = organization_id
    provider.project_id = project_id

    return provider
```

--------------------------------------------------------------------------------

---[FILE: mongodbatlas_provider_test.py]---
Location: prowler-master/tests/providers/mongodbatlas/mongodbatlas_provider_test.py

```python
from unittest.mock import MagicMock, patch

import pytest
import requests

from prowler.providers.mongodbatlas.exceptions.exceptions import (
    MongoDBAtlasAuthenticationError,
    MongoDBAtlasCredentialsError,
    MongoDBAtlasIdentityError,
    MongoDBAtlasInvalidOrganizationIdError,
)
from prowler.providers.mongodbatlas.models import (
    MongoDBAtlasIdentityInfo,
    MongoDBAtlasSession,
)
from prowler.providers.mongodbatlas.mongodbatlas_provider import MongodbatlasProvider
from tests.providers.mongodbatlas.mongodbatlas_fixtures import (
    ATLAS_BASE_URL,
    ATLAS_PRIVATE_KEY,
    ATLAS_PUBLIC_KEY,
    MOCK_ORGS_RESPONSE,
    ORGANIZATION_ID,
    ORGANIZATION_NAME,
)


class TestMongodbatlasProvider:
    def test_mongodbatlas_provider_initialization(self):
        """Test MongoDB Atlas provider initialization"""
        with (
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_session",
                return_value=MongoDBAtlasSession(
                    public_key=ATLAS_PUBLIC_KEY,
                    private_key=ATLAS_PRIVATE_KEY,
                    base_url=ATLAS_BASE_URL,
                ),
            ),
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_identity",
                return_value=MongoDBAtlasIdentityInfo(
                    organization_id=ORGANIZATION_ID,
                    organization_name=ORGANIZATION_NAME,
                    roles=["API_KEY"],
                ),
            ),
        ):
            provider = MongodbatlasProvider(
                atlas_public_key=ATLAS_PUBLIC_KEY,
                atlas_private_key=ATLAS_PRIVATE_KEY,
            )

            assert provider.type == "mongodbatlas"
            assert provider.session.public_key == ATLAS_PUBLIC_KEY
            assert provider.session.private_key == ATLAS_PRIVATE_KEY
            assert provider.identity.organization_name == ORGANIZATION_NAME

    def test_setup_session_with_credentials(self):
        """Test session setup with provided credentials"""
        session = MongodbatlasProvider.setup_session(
            atlas_public_key=ATLAS_PUBLIC_KEY,
            atlas_private_key=ATLAS_PRIVATE_KEY,
        )

        assert session.public_key == ATLAS_PUBLIC_KEY
        assert session.private_key == ATLAS_PRIVATE_KEY
        assert session.base_url == ATLAS_BASE_URL

    def test_setup_session_with_environment_variables(self):
        """Test session setup with environment variables"""
        with patch.dict(
            "os.environ",
            {
                "ATLAS_PUBLIC_KEY": ATLAS_PUBLIC_KEY,
                "ATLAS_PRIVATE_KEY": ATLAS_PRIVATE_KEY,
            },
        ):
            session = MongodbatlasProvider.setup_session()

            assert session.public_key == ATLAS_PUBLIC_KEY
            assert session.private_key == ATLAS_PRIVATE_KEY

    def test_setup_session_missing_credentials(self):
        """Test session setup with missing credentials"""
        with patch.dict("os.environ", {}, clear=True):
            with pytest.raises(MongoDBAtlasCredentialsError):
                MongodbatlasProvider.setup_session()

    @patch("requests.get")
    def test_setup_identity_success(self, mock_get):
        """Test successful identity setup"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = MOCK_ORGS_RESPONSE
        mock_get.return_value = mock_response

        session = MongoDBAtlasSession(
            public_key=ATLAS_PUBLIC_KEY,
            private_key=ATLAS_PRIVATE_KEY,
        )

        identity = MongodbatlasProvider.setup_identity(session)

        assert identity.organization_id == MOCK_ORGS_RESPONSE["results"][0]["id"]
        assert identity.organization_name == MOCK_ORGS_RESPONSE["results"][0]["name"]
        assert identity.roles == ["ORGANIZATION_ADMIN"]

    @patch("requests.get")
    def test_setup_identity_authentication_error(self, mock_get):
        """Test identity setup with authentication error"""
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_response.raise_for_status.side_effect = requests.HTTPError(
            "401 Unauthorized"
        )
        mock_get.return_value = mock_response

        session = MongoDBAtlasSession(
            public_key=ATLAS_PUBLIC_KEY,
            private_key=ATLAS_PRIVATE_KEY,
        )

        with pytest.raises(MongoDBAtlasAuthenticationError):
            MongodbatlasProvider.setup_identity(session)

    @patch("requests.get")
    def test_setup_identity_api_error(self, mock_get):
        """Test identity setup with API error"""
        mock_get.side_effect = requests.RequestException("Network error")

        session = MongoDBAtlasSession(
            public_key=ATLAS_PUBLIC_KEY,
            private_key=ATLAS_PRIVATE_KEY,
        )

        with pytest.raises(MongoDBAtlasIdentityError):
            MongodbatlasProvider.setup_identity(session)

    def test_test_connection_success(self):
        """Test successful connection test"""
        with (
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_session",
                return_value=MongoDBAtlasSession(
                    public_key=ATLAS_PUBLIC_KEY,
                    private_key=ATLAS_PRIVATE_KEY,
                ),
            ),
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_identity",
                return_value=MongoDBAtlasIdentityInfo(
                    organization_id=ORGANIZATION_ID,
                    organization_name=ORGANIZATION_NAME,
                    roles=["ORGANIZATION_ADMIN"],
                ),
            ),
        ):
            connection = MongodbatlasProvider.test_connection(
                atlas_public_key=ATLAS_PUBLIC_KEY,
                atlas_private_key=ATLAS_PRIVATE_KEY,
            )

            assert connection.is_connected is True

    def test_test_connection_failure(self):
        """Test failed connection test"""
        with (
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_session",
                side_effect=MongoDBAtlasCredentialsError("Missing credentials"),
            ),
        ):
            connection = MongodbatlasProvider.test_connection(raise_on_exception=False)

            assert connection.is_connected is False
            assert connection.error is not None

    def test_test_connection_with_matching_provider_id(self):
        """Test connection test with matching provider_id"""
        with (
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_session",
                return_value=MongoDBAtlasSession(
                    public_key=ATLAS_PUBLIC_KEY,
                    private_key=ATLAS_PRIVATE_KEY,
                ),
            ),
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_identity",
                return_value=MongoDBAtlasIdentityInfo(
                    organization_id=ORGANIZATION_ID,
                    organization_name=ORGANIZATION_NAME,
                    roles=["ORGANIZATION_ADMIN"],
                ),
            ),
        ):
            connection = MongodbatlasProvider.test_connection(
                atlas_public_key=ATLAS_PUBLIC_KEY,
                atlas_private_key=ATLAS_PRIVATE_KEY,
                provider_id=ORGANIZATION_ID,
            )

            assert connection.is_connected is True

    def test_test_connection_with_mismatched_provider_id(self):
        """Test connection test with mismatched provider_id raises error"""
        different_org_id = "different_org_id"
        with (
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_session",
                return_value=MongoDBAtlasSession(
                    public_key=ATLAS_PUBLIC_KEY,
                    private_key=ATLAS_PRIVATE_KEY,
                ),
            ),
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_identity",
                return_value=MongoDBAtlasIdentityInfo(
                    organization_id=ORGANIZATION_ID,
                    organization_name=ORGANIZATION_NAME,
                    roles=["ORGANIZATION_ADMIN"],
                ),
            ),
        ):
            with pytest.raises(MongoDBAtlasInvalidOrganizationIdError) as exc_info:
                MongodbatlasProvider.test_connection(
                    atlas_public_key=ATLAS_PUBLIC_KEY,
                    atlas_private_key=ATLAS_PRIVATE_KEY,
                    provider_id=different_org_id,
                )

            assert different_org_id in str(exc_info.value)

    def test_test_connection_with_mismatched_provider_id_no_raise(self):
        """Test connection test with mismatched provider_id always raises error regardless of raise_on_exception"""
        different_org_id = "different_org_id"
        with (
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_session",
                return_value=MongoDBAtlasSession(
                    public_key=ATLAS_PUBLIC_KEY,
                    private_key=ATLAS_PRIVATE_KEY,
                ),
            ),
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_identity",
                return_value=MongoDBAtlasIdentityInfo(
                    organization_id=ORGANIZATION_ID,
                    organization_name=ORGANIZATION_NAME,
                    roles=["ORGANIZATION_ADMIN"],
                ),
            ),
        ):
            # MongoDBAtlasInvalidOrganizationIdError is always raised regardless of raise_on_exception
            with pytest.raises(MongoDBAtlasInvalidOrganizationIdError) as exc_info:
                MongodbatlasProvider.test_connection(
                    atlas_public_key=ATLAS_PUBLIC_KEY,
                    atlas_private_key=ATLAS_PRIVATE_KEY,
                    provider_id=different_org_id,
                    raise_on_exception=False,
                )

            assert different_org_id in str(exc_info.value)

    def test_provider_properties(self):
        """Test provider properties"""
        with (
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_session",
                return_value=MongoDBAtlasSession(
                    public_key=ATLAS_PUBLIC_KEY,
                    private_key=ATLAS_PRIVATE_KEY,
                ),
            ),
            patch(
                "prowler.providers.mongodbatlas.mongodbatlas_provider.MongodbatlasProvider.setup_identity",
                return_value=MongoDBAtlasIdentityInfo(
                    organization_id=ORGANIZATION_ID,
                    organization_name=ORGANIZATION_NAME,
                    roles=["ORGANIZATION_ADMIN"],
                ),
            ),
        ):
            provider = MongodbatlasProvider(
                atlas_public_key=ATLAS_PUBLIC_KEY,
                atlas_private_key=ATLAS_PRIVATE_KEY,
                atlas_project_id="test_project",
            )

            assert provider.type == "mongodbatlas"
            assert provider.project_id == "test_project"
            assert provider.session.public_key == ATLAS_PUBLIC_KEY
            assert provider.identity.organization_name == ORGANIZATION_NAME
```

--------------------------------------------------------------------------------

````
