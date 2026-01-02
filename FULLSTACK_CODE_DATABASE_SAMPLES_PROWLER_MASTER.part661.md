---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 661
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 661 of 867)

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

---[FILE: defender_ensure_notify_emails_to_owners_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_notify_emails_to_owners/defender_ensure_notify_emails_to_owners_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import (
    NotificationsByRole,
    SecurityContactConfiguration,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_notify_emails_to_owners:
    def test_defender_no_subscriptions(self):
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_emails_to_owners.defender_ensure_notify_emails_to_owners.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_emails_to_owners.defender_ensure_notify_emails_to_owners import (
                defender_ensure_notify_emails_to_owners,
            )

            check = defender_ensure_notify_emails_to_owners()
            result = check.execute()
            assert len(result) == 0

    def test_defender_no_notify_emails_to_owners(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name="default",
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Contributor"]
                    ),
                    alert_minimal_severity="Critical",
                    attack_path_minimal_risk_level=None,
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_emails_to_owners.defender_ensure_notify_emails_to_owners.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_emails_to_owners.defender_ensure_notify_emails_to_owners import (
                defender_ensure_notify_emails_to_owners,
            )

            check = defender_ensure_notify_emails_to_owners()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == resource_id

    def test_defender_notify_emails_to_owners_off(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name="default",
                    enabled=True,
                    emails=[""],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=False, roles=["Owner", "Contributor"]
                    ),
                    alert_minimal_severity="Critical",
                    attack_path_minimal_risk_level=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_emails_to_owners.defender_ensure_notify_emails_to_owners.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_emails_to_owners.defender_ensure_notify_emails_to_owners import (
                defender_ensure_notify_emails_to_owners,
            )

            check = defender_ensure_notify_emails_to_owners()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"The Owner role is not notified for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id

    def test_defender_notify_emails_to_owners(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock()
        defender_client.security_contact_configurations = {
            AZURE_SUBSCRIPTION_ID: {
                resource_id: SecurityContactConfiguration(
                    id=resource_id,
                    name="default",
                    enabled=True,
                    emails=["test@test.es"],
                    phone="",
                    notifications_by_role=NotificationsByRole(
                        state=True, roles=["Owner", "Contributor"]
                    ),
                    alert_minimal_severity="Critical",
                    attack_path_minimal_risk_level=None,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_notify_emails_to_owners.defender_ensure_notify_emails_to_owners.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_notify_emails_to_owners.defender_ensure_notify_emails_to_owners import (
                defender_ensure_notify_emails_to_owners,
            )

            check = defender_ensure_notify_emails_to_owners()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"The Owner role is notified for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "default"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_system_updates_are_applied_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_system_updates_are_applied/defender_ensure_system_updates_are_applied_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Assesment
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_system_updates_are_applied:
    def test_defender_no_app_services(self):
        defender_client = mock.MagicMock
        defender_client.assessments = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied import (
                defender_ensure_system_updates_are_applied,
            )

            check = defender_ensure_system_updates_are_applied()
            result = check.execute()
            assert len(result) == 0

    def test_defender_machines_no_log_analytics_installed(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Log Analytics agent should be installed on virtual machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Unhealthy",
                ),
                "Machines should be configured to periodically check for missing system updates": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
                "System updates should be installed on your machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied import (
                defender_ensure_system_updates_are_applied,
            )

            check = defender_ensure_system_updates_are_applied()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"System updates are not applied for all the VMs in the subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "vm1"
            assert result[0].resource_id == resource_id

    def test_defender_machines_no_configured_to_periodically_check_for_system_updates(
        self,
    ):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Log Analytics agent should be installed on virtual machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
                "Machines should be configured to periodically check for missing system updates": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Unhealthy",
                ),
                "System updates should be installed on your machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied import (
                defender_ensure_system_updates_are_applied,
            )

            check = defender_ensure_system_updates_are_applied()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"System updates are not applied for all the VMs in the subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "vm1"
            assert result[0].resource_id == resource_id

    def test_defender_machines_no_system_updates_installed(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Log Analytics agent should be installed on virtual machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
                "Machines should be configured to periodically check for missing system updates": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
                "System updates should be installed on your machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Unhealthy",
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied import (
                defender_ensure_system_updates_are_applied,
            )

            check = defender_ensure_system_updates_are_applied()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"System updates are not applied for all the VMs in the subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "vm1"
            assert result[0].resource_id == resource_id

    def test_defender_machines_configured_to_periodically_check_for_system_updates_and_system_updates_installed(
        self,
    ):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.assessments = {
            AZURE_SUBSCRIPTION_ID: {
                "Log Analytics agent should be installed on virtual machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
                "Machines should be configured to periodically check for missing system updates": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
                "System updates should be installed on your machines": Assesment(
                    resource_id=resource_id,
                    resource_name="vm1",
                    status="Healthy",
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_system_updates_are_applied.defender_ensure_system_updates_are_applied import (
                defender_ensure_system_updates_are_applied,
            )

            check = defender_ensure_system_updates_are_applied()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"System updates are applied for all the VMs in the subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "vm1"
            assert result[0].resource_id == resource_id
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_wdatp_is_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/defender/defender_ensure_wdatp_is_enabled/defender_ensure_wdatp_is_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.defender.defender_service import Setting
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_defender_ensure_wdatp_is_enabled:
    def test_defender_no_settings(self):
        defender_client = mock.MagicMock
        defender_client.settings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_wdatp_is_enabled.defender_ensure_wdatp_is_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_wdatp_is_enabled.defender_ensure_wdatp_is_enabled import (
                defender_ensure_wdatp_is_enabled,
            )

            check = defender_ensure_wdatp_is_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_defender_wdatp_disabled(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.settings = {
            AZURE_SUBSCRIPTION_ID: {
                "WDATP": Setting(
                    resource_id=resource_id,
                    resource_type="Microsoft.Security/locations/settings",
                    kind="DataExportSettings",
                    enabled=False,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_wdatp_is_enabled.defender_ensure_wdatp_is_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_wdatp_is_enabled.defender_ensure_wdatp_is_enabled import (
                defender_ensure_wdatp_is_enabled,
            )

            check = defender_ensure_wdatp_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Microsoft Defender for Endpoint integration is disabled for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "WDATP"
            assert result[0].resource_id == resource_id

    def test_defender_wdatp_enabled(self):
        resource_id = str(uuid4())
        defender_client = mock.MagicMock
        defender_client.settings = {
            AZURE_SUBSCRIPTION_ID: {
                "WDATP": Setting(
                    resource_id=resource_id,
                    resource_type="Microsoft.Security/locations/settings",
                    kind="DataExportSettings",
                    enabled=True,
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_wdatp_is_enabled.defender_ensure_wdatp_is_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_wdatp_is_enabled.defender_ensure_wdatp_is_enabled import (
                defender_ensure_wdatp_is_enabled,
            )

            check = defender_ensure_wdatp_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Microsoft Defender for Endpoint integration is enabled for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "WDATP"
            assert result[0].resource_id == resource_id

    def test_defender_wdatp_no_settings(self):
        defender_client = mock.MagicMock
        defender_client.settings = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.defender.defender_ensure_wdatp_is_enabled.defender_ensure_wdatp_is_enabled.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.defender.defender_ensure_wdatp_is_enabled.defender_ensure_wdatp_is_enabled import (
                defender_ensure_wdatp_is_enabled,
            )

            check = defender_ensure_wdatp_is_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Microsoft Defender for Endpoint integration not exists for subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "WDATP"
            assert result[0].resource_id == "WDATP"
```

--------------------------------------------------------------------------------

---[FILE: entra_service_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_service_test.py

```python
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

from prowler.providers.azure.models import AzureIdentityInfo
from prowler.providers.azure.services.entra.entra_service import (
    AuthorizationPolicy,
    ConditionalAccessPolicy,
    DirectoryRole,
    Entra,
    GroupSetting,
    NamedLocation,
    SecurityDefault,
    User,
)
from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


async def mock_entra_get_users(_):
    return {
        DOMAIN: {
            "user-1@tenant1.es": User(id="id-1", name="User 1"),
        }
    }


async def mock_entra_get_authorization_policy(_):
    return {
        DOMAIN: AuthorizationPolicy(
            id="id-1",
            name="Name 1",
            description="Description 1",
            guest_invite_settings="none",
            guest_user_role_id=uuid4(),
        )
    }


async def mock_entra_get_group_settings(_):
    return {
        DOMAIN: {
            "id-1": GroupSetting(
                name="Test",
                template_id="id-group-setting",
                settings=[],
            )
        }
    }


async def mock_entra_get_security_default(_):
    return {
        DOMAIN: SecurityDefault(
            id="id-security-default",
            name="Test",
            is_enabled=True,
        )
    }


async def mock_entra_get_named_locations(_):
    return {
        DOMAIN: {
            "id-1": NamedLocation(
                id="id-1",
                name="Test",
                ip_ranges_addresses=[],
                is_trusted=False,
            )
        }
    }


async def mock_entra_get_directory_roles(_):
    return {
        DOMAIN: {
            "GlobalAdministrator": DirectoryRole(
                id="id-directory-role",
                members=[],
            )
        }
    }


async def mock_entra_get_conditional_access_policy(_):
    return {
        DOMAIN: {
            "id-1": ConditionalAccessPolicy(
                id="id-1",
                state="enabled",
                name="Test",
                users={"include": ["All"], "exclude": []},
                target_resources={
                    "include": ["797f4846-ba00-4fd7-ba43-dac1f8f63013"],
                    "exclude": [],
                },
                access_controls={"grant": ["MFA", "compliantDevice"], "block": []},
            )
        }
    }


@patch(
    "prowler.providers.azure.services.entra.entra_service.Entra._get_users",
    new=mock_entra_get_users,
)
@patch(
    "prowler.providers.azure.services.entra.entra_service.Entra._get_authorization_policy",
    new=mock_entra_get_authorization_policy,
)
@patch(
    "prowler.providers.azure.services.entra.entra_service.Entra._get_group_settings",
    new=mock_entra_get_group_settings,
)
@patch(
    "prowler.providers.azure.services.entra.entra_service.Entra._get_security_default",
    new=mock_entra_get_security_default,
)
@patch(
    "prowler.providers.azure.services.entra.entra_service.Entra._get_named_locations",
    new=mock_entra_get_named_locations,
)
@patch(
    "prowler.providers.azure.services.entra.entra_service.Entra._get_directory_roles",
    new=mock_entra_get_directory_roles,
)
@patch(
    "prowler.providers.azure.services.entra.entra_service.Entra._get_conditional_access_policy",
    new=mock_entra_get_conditional_access_policy,
)
class Test_Entra_Service:
    def test_get_client(self):
        entra_client = Entra(
            set_mocked_azure_provider(identity=AzureIdentityInfo(tenant_domain=DOMAIN))
        )
        assert entra_client.clients[DOMAIN].__class__.__name__ == "GraphServiceClient"

    def test__get_subscriptions__(self):
        entra_client = Entra(set_mocked_azure_provider())
        assert entra_client.subscriptions.__class__.__name__ == "dict"

    def test_get_users(self):
        entra_client = Entra(set_mocked_azure_provider())
        assert len(entra_client.users) == 1
        assert entra_client.users[DOMAIN]["user-1@tenant1.es"].id == "id-1"
        assert entra_client.users[DOMAIN]["user-1@tenant1.es"].name == "User 1"
        assert (
            len(entra_client.users[DOMAIN]["user-1@tenant1.es"].authentication_methods)
            == 0
        )

    def test_get_authorization_policy(self):
        entra_client = Entra(set_mocked_azure_provider())
        assert entra_client.authorization_policy[DOMAIN].id == "id-1"
        assert entra_client.authorization_policy[DOMAIN].name == "Name 1"
        assert entra_client.authorization_policy[DOMAIN].description == "Description 1"
        assert not entra_client.authorization_policy[
            DOMAIN
        ].default_user_role_permissions

    def test_get_group_settings(self):
        entra_client = Entra(set_mocked_azure_provider())
        assert entra_client.group_settings[DOMAIN]["id-1"].name == "Test"
        assert (
            entra_client.group_settings[DOMAIN]["id-1"].template_id
            == "id-group-setting"
        )
        assert len(entra_client.group_settings[DOMAIN]["id-1"].settings) == 0

    def test_get_security_default(self):
        entra_client = Entra(set_mocked_azure_provider())
        assert entra_client.security_default[DOMAIN].id == "id-security-default"
        assert entra_client.security_default[DOMAIN].name == "Test"
        assert entra_client.security_default[DOMAIN].is_enabled

    def test_get_named_locations(self):
        entra_client = Entra(set_mocked_azure_provider())
        assert entra_client.named_locations[DOMAIN]["id-1"].name == "Test"
        assert (
            len(entra_client.named_locations[DOMAIN]["id-1"].ip_ranges_addresses) == 0
        )
        assert not entra_client.named_locations[DOMAIN]["id-1"].is_trusted

    def test_get_directory_roles(self):
        entra_client = Entra(set_mocked_azure_provider())
        assert (
            entra_client.directory_roles[DOMAIN]["GlobalAdministrator"].id
            == "id-directory-role"
        )
        assert (
            len(entra_client.directory_roles[DOMAIN]["GlobalAdministrator"].members)
            == 0
        )

    def test_get_conditional_access_policy(self):
        entra_client = Entra(set_mocked_azure_provider())
        assert len(entra_client.conditional_access_policy) == 1
        assert len(entra_client.conditional_access_policy[DOMAIN]) == 1
        assert entra_client.conditional_access_policy[DOMAIN]["id-1"]
        assert entra_client.conditional_access_policy[DOMAIN]["id-1"].name == "Test"
        assert entra_client.conditional_access_policy[DOMAIN]["id-1"].state == "enabled"
        assert entra_client.conditional_access_policy[DOMAIN]["id-1"].users[
            "include"
        ] == ["All"]
        assert (
            entra_client.conditional_access_policy[DOMAIN]["id-1"].users["exclude"]
            == []
        )
        assert entra_client.conditional_access_policy[DOMAIN]["id-1"].target_resources[
            "include"
        ] == ["797f4846-ba00-4fd7-ba43-dac1f8f63013"]
        assert (
            entra_client.conditional_access_policy[DOMAIN]["id-1"].target_resources[
                "exclude"
            ]
            == []
        )
        assert entra_client.conditional_access_policy[DOMAIN]["id-1"].access_controls[
            "grant"
        ] == ["MFA", "compliantDevice"]
        assert (
            entra_client.conditional_access_policy[DOMAIN]["id-1"].access_controls[
                "block"
            ]
            == []
        )


def test_azure_entra__get_users_handles_pagination():
    entra_service = Entra.__new__(Entra)

    users_page_one = [
        SimpleNamespace(id="user-1", display_name="User 1"),
        SimpleNamespace(id="user-2", display_name="User 2"),
    ]
    users_page_two = [
        SimpleNamespace(id="user-3", display_name="User 3"),
    ]

    users_response_page_one = SimpleNamespace(
        value=users_page_one,
        odata_next_link="next-link",
    )
    users_response_page_two = SimpleNamespace(
        value=users_page_two, odata_next_link=None
    )

    users_with_url_builder = SimpleNamespace(
        get=AsyncMock(return_value=users_response_page_two)
    )
    with_url_mock = MagicMock(return_value=users_with_url_builder)

    def by_user_id_side_effect(user_id):
        auth_methods_response = SimpleNamespace(
            value=[
                SimpleNamespace(
                    id=f"{user_id}-method",
                    odata_type="#microsoft.graph.passwordAuthenticationMethod",
                )
            ]
        )
        return SimpleNamespace(
            authentication=SimpleNamespace(
                methods=SimpleNamespace(
                    get=AsyncMock(return_value=auth_methods_response)
                )
            )
        )

    users_builder = SimpleNamespace(
        get=AsyncMock(return_value=users_response_page_one),
        with_url=with_url_mock,
        by_user_id=MagicMock(side_effect=by_user_id_side_effect),
    )

    entra_service.clients = {"tenant-1": SimpleNamespace(users=users_builder)}

    users = asyncio.run(entra_service._get_users())

    assert len(users["tenant-1"]) == 3
    assert users_builder.get.await_count == 1
    with_url_mock.assert_called_once_with("next-link")
    assert users["tenant-1"]["user-1"].authentication_methods[0].id == "user-1-method"
    assert (
        users["tenant-1"]["user-3"].authentication_methods[0].type
        == "#microsoft.graph.passwordAuthenticationMethod"
    )
```

--------------------------------------------------------------------------------

````
