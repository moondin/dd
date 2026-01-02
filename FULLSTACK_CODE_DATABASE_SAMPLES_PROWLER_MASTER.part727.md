---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 727
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 727 of 867)

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

---[FILE: m365_regions_test.py]---
Location: prowler-master/tests/providers/m365/lib/regions/m365_regions_test.py

```python
from azure.identity import AzureAuthorityHosts

from prowler.providers.m365.lib.regions.regions import (
    MICROSOFT365_CHINA_CLOUD,
    MICROSOFT365_GENERIC_CLOUD,
    MICROSOFT365_US_GOV_CLOUD,
    get_regions_config,
)


class Test_m365_regions:
    def test_get_regions_config(self):
        allowed_regions = [
            "M365Global",
            "M365China",
            "M365USGovernment",
        ]
        expected_output = {
            "M365Global": {
                "authority": None,
                "base_url": MICROSOFT365_GENERIC_CLOUD,
                "credential_scopes": [MICROSOFT365_GENERIC_CLOUD + "/.default"],
            },
            "M365China": {
                "authority": AzureAuthorityHosts.AZURE_CHINA,
                "base_url": MICROSOFT365_CHINA_CLOUD,
                "credential_scopes": [MICROSOFT365_CHINA_CLOUD + "/.default"],
            },
            "M365USGovernment": {
                "authority": AzureAuthorityHosts.AZURE_GOVERNMENT,
                "base_url": MICROSOFT365_US_GOV_CLOUD,
                "credential_scopes": [MICROSOFT365_US_GOV_CLOUD + "/.default"],
            },
        }

        for region in allowed_regions:
            region_config = get_regions_config(region)
            assert region_config == expected_output[region]
```

--------------------------------------------------------------------------------

---[FILE: admincenter_service_test.py]---
Location: prowler-master/tests/providers/m365/services/admincenter/admincenter_service_test.py

```python
import asyncio
from types import SimpleNamespace
from unittest import mock
from unittest.mock import AsyncMock, MagicMock, patch

from prowler.providers.m365.models import M365IdentityInfo
from prowler.providers.m365.services.admincenter.admincenter_service import (
    AdminCenter,
    DirectoryRole,
    Group,
    Organization,
    SharingPolicy,
    User,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


async def mock_admincenter_get_users(_):
    return {
        "user-1@tenant1.es": User(
            id="id-1",
            name="User 1",
            directory_roles=[],
        ),
    }


async def mock_admincenter_get_directory_roles(_):
    return {
        "GlobalAdministrator": DirectoryRole(
            id="id-directory-role",
            name="GlobalAdministrator",
            members=[],
        )
    }


async def mock_admincenter_get_groups(_):
    return {
        "id-1": Group(id="id-1", name="Test", visibility="Public"),
    }


def mock_admincenter_get_organization(_):
    return Organization(
        guid="id-1",
        name="Test",
        customer_lockbox_enabled=False,
    )


def mock_admincenter_get_sharing_policy(_):
    return SharingPolicy(
        guid="id-1",
        name="Test",
        enabled=False,
    )


@patch(
    "prowler.providers.m365.services.admincenter.admincenter_service.AdminCenter._get_users",
    new=mock_admincenter_get_users,
)
@patch(
    "prowler.providers.m365.services.admincenter.admincenter_service.AdminCenter._get_directory_roles",
    new=mock_admincenter_get_directory_roles,
)
@patch(
    "prowler.providers.m365.services.admincenter.admincenter_service.AdminCenter._get_groups",
    new=mock_admincenter_get_groups,
)
@patch(
    "prowler.providers.m365.services.admincenter.admincenter_service.AdminCenter._get_organization_config",
    new=mock_admincenter_get_organization,
)
@patch(
    "prowler.providers.m365.services.admincenter.admincenter_service.AdminCenter._get_sharing_policy",
    new=mock_admincenter_get_sharing_policy,
)
class Test_AdminCenter_Service:
    def test_get_client(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            admincenter_client = AdminCenter(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert admincenter_client.client.__class__.__name__ == "GraphServiceClient"

    def test_get_users(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            admincenter_client = AdminCenter(set_mocked_m365_provider())
            assert len(admincenter_client.users) == 1
            assert admincenter_client.users["user-1@tenant1.es"].id == "id-1"
            assert admincenter_client.users["user-1@tenant1.es"].name == "User 1"

    def test_get_group_settings(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            admincenter_client = AdminCenter(set_mocked_m365_provider())
            assert len(admincenter_client.groups) == 1
            assert admincenter_client.groups["id-1"].id == "id-1"
            assert admincenter_client.groups["id-1"].name == "Test"
            assert admincenter_client.groups["id-1"].visibility == "Public"

    def test_get_directory_roles(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            admincenter_client = AdminCenter(set_mocked_m365_provider())
            assert (
                admincenter_client.directory_roles["GlobalAdministrator"].id
                == "id-directory-role"
            )
            assert (
                len(admincenter_client.directory_roles["GlobalAdministrator"].members)
                == 0
            )

    def test_get_organization(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            admincenter_client = AdminCenter(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert admincenter_client.organization_config.guid == "id-1"
            assert admincenter_client.organization_config.name == "Test"
            assert (
                admincenter_client.organization_config.customer_lockbox_enabled is False
            )
            admincenter_client.powershell.close()

    def test_get_sharing_policy(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            admincenter_client = AdminCenter(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert admincenter_client.sharing_policy.guid == "id-1"
            assert admincenter_client.sharing_policy.name == "Test"
            assert admincenter_client.sharing_policy.enabled is False
            admincenter_client.powershell.close()


def test_admincenter__get_users_handles_pagination():
    admincenter_service = AdminCenter.__new__(AdminCenter)

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
        license_details_response = SimpleNamespace(
            value=[SimpleNamespace(sku_part_number=f"SKU-{user_id}")]
        )
        return SimpleNamespace(
            license_details=SimpleNamespace(
                get=AsyncMock(return_value=license_details_response)
            )
        )

    users_builder = SimpleNamespace(
        get=AsyncMock(return_value=users_response_page_one),
        with_url=with_url_mock,
        by_user_id=MagicMock(side_effect=by_user_id_side_effect),
    )

    admincenter_service.client = SimpleNamespace(users=users_builder)

    users = asyncio.run(admincenter_service._get_users())

    assert len(users) == 3
    assert users_builder.get.await_count == 1
    with_url_mock.assert_called_once_with("next-link")
    assert users["user-1"].license == "SKU-user-1"
    assert users["user-3"].license == "SKU-user-3"
```

--------------------------------------------------------------------------------

---[FILE: admincenter_external_calendar_sharing_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/admincenter/admincenter_external_calendar_sharing_disabled/admincenter_external_calendar_sharing_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_admincenter_external_calendar_sharing_disabled:
    def test_admincenter_no_sharing_policy(self):
        admincenter_client = mock.MagicMock()
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN
        admincenter_client.sharing_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_external_calendar_sharing_disabled.admincenter_external_calendar_sharing_disabled.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_external_calendar_sharing_disabled.admincenter_external_calendar_sharing_disabled import (
                admincenter_external_calendar_sharing_disabled,
            )

            check = admincenter_external_calendar_sharing_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_admincenter_calendar_sharing_disabled(self):
        admincenter_client = mock.MagicMock()
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_external_calendar_sharing_disabled.admincenter_external_calendar_sharing_disabled.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_external_calendar_sharing_disabled.admincenter_external_calendar_sharing_disabled import (
                admincenter_external_calendar_sharing_disabled,
            )
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                SharingPolicy,
            )

            admincenter_client.sharing_policy = SharingPolicy(
                name="test-org",
                guid="org-guid",
                enabled=False,
            )

            check = admincenter_external_calendar_sharing_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "External calendar sharing is disabled at the organization level."
            )
            assert result[0].resource == admincenter_client.sharing_policy.dict()
            assert result[0].resource_name == "test-org"
            assert result[0].resource_id == "org-guid"
            assert result[0].location == "global"

    def test_admincenter_calendar_sharing_enabled(self):
        admincenter_client = mock.MagicMock()
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_external_calendar_sharing_disabled.admincenter_external_calendar_sharing_disabled.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_external_calendar_sharing_disabled.admincenter_external_calendar_sharing_disabled import (
                admincenter_external_calendar_sharing_disabled,
            )
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                SharingPolicy,
            )

            admincenter_client.sharing_policy = SharingPolicy(
                name="test-org",
                guid="org-guid",
                enabled=True,
            )

            check = admincenter_external_calendar_sharing_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "External calendar sharing is enabled at the organization level."
            )
            assert result[0].resource == admincenter_client.sharing_policy.dict()
            assert result[0].resource_name == "test-org"
            assert result[0].resource_id == "org-guid"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: admincenter_groups_not_public_visibility_test.py]---
Location: prowler-master/tests/providers/m365/services/admincenter/admincenter_groups_not_public_visibility/admincenter_groups_not_public_visibility_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_admincenter_groups_not_public_visibility:
    def test_admincenter_no_groups(self):
        admincenter_client = mock.MagicMock
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility import (
                admincenter_groups_not_public_visibility,
            )

            admincenter_client.groups = {}

            check = admincenter_groups_not_public_visibility()
            result = check.execute()
            assert len(result) == 0

    def test_admincenter_user_no_admin(self):
        admincenter_client = mock.MagicMock
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility import (
                admincenter_groups_not_public_visibility,
            )
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                Group,
            )

            id_group1 = str(uuid4())

            admincenter_client.groups = {
                id_group1: Group(id=id_group1, name="Group1", visibility="Private"),
            }

            check = admincenter_groups_not_public_visibility()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Group Group1 has Private visibility."
            assert result[0].resource == admincenter_client.groups[id_group1].dict()
            assert result[0].resource_name == "Group1"
            assert result[0].resource_id == id_group1
            assert result[0].location == "global"

    def test_admincenter_user_admin_compliant_license(self):
        admincenter_client = mock.MagicMock
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility import (
                admincenter_groups_not_public_visibility,
            )
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                Group,
            )

            id_group1 = str(uuid4())

            admincenter_client.groups = {
                id_group1: Group(id=id_group1, name="Group1", visibility="Private"),
            }

            check = admincenter_groups_not_public_visibility()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Group Group1 has Private visibility."
            assert result[0].resource == admincenter_client.groups[id_group1].dict()
            assert result[0].resource_name == "Group1"
            assert result[0].resource_id == id_group1
            assert result[0].location == "global"

    def test_admincenter_group_public_visibility(self):
        admincenter_client = mock.MagicMock
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility import (
                admincenter_groups_not_public_visibility,
            )
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                Group,
            )

            id_group1 = str(uuid4())

            admincenter_client.groups = {
                id_group1: Group(id=id_group1, name="Group1", visibility="Public"),
            }

            check = admincenter_groups_not_public_visibility()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Group Group1 has Public visibility and should be Private."
            )
            assert result[0].resource == admincenter_client.groups[id_group1].dict()
            assert result[0].resource_name == "Group1"
            assert result[0].resource_id == id_group1
            assert result[0].location == "global"

    def test_admincenter_group_none_visibility(self):
        admincenter_client = mock.MagicMock
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_groups_not_public_visibility.admincenter_groups_not_public_visibility import (
                admincenter_groups_not_public_visibility,
            )
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                Group,
            )

            id_group1 = str(uuid4())

            admincenter_client.groups = {
                id_group1: Group(id=id_group1, name="Group1", visibility=None),
            }

            check = admincenter_groups_not_public_visibility()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Group Group1 has None visibility and should be Private."
            )
            assert result[0].resource == admincenter_client.groups[id_group1].dict()
            assert result[0].resource_name == "Group1"
            assert result[0].resource_id == id_group1
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: admincenter_organization_customer_lockbox_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/admincenter/admincenter_organization_customer_lockbox_enabled/admincenter_organization_customer_lockbox_enabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_admincenter_organization_customer_lockbox_enabled:
    def test_admincenter_no_org_config(self):
        admincenter_client = mock.MagicMock()
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN
        admincenter_client.organization_config = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_organization_customer_lockbox_enabled.admincenter_organization_customer_lockbox_enabled.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_organization_customer_lockbox_enabled.admincenter_organization_customer_lockbox_enabled import (
                admincenter_organization_customer_lockbox_enabled,
            )

            check = admincenter_organization_customer_lockbox_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_admincenter_customer_lockbox_enabled(self):
        admincenter_client = mock.MagicMock()
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_organization_customer_lockbox_enabled.admincenter_organization_customer_lockbox_enabled.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_organization_customer_lockbox_enabled.admincenter_organization_customer_lockbox_enabled import (
                admincenter_organization_customer_lockbox_enabled,
            )
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                Organization,
            )

            admincenter_client.organization_config = Organization(
                name="test-org",
                guid="org-guid",
                customer_lockbox_enabled=True,
            )

            check = admincenter_organization_customer_lockbox_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Customer Lockbox is enabled at organization level."
            )
            assert result[0].resource == admincenter_client.organization_config.dict()
            assert result[0].resource_name == "test-org"
            assert result[0].resource_id == "org-guid"
            assert result[0].location == "global"

    def test_admincenter_customer_lockbox_disabled(self):
        admincenter_client = mock.MagicMock()
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_organization_customer_lockbox_enabled.admincenter_organization_customer_lockbox_enabled.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_organization_customer_lockbox_enabled.admincenter_organization_customer_lockbox_enabled import (
                admincenter_organization_customer_lockbox_enabled,
            )
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                Organization,
            )

            admincenter_client.organization_config = Organization(
                name="test-org",
                guid="org-guid",
                customer_lockbox_enabled=False,
            )

            check = admincenter_organization_customer_lockbox_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Customer Lockbox is not enabled at organization level."
            )
            assert result[0].resource == admincenter_client.organization_config.dict()
            assert result[0].resource_name == "test-org"
            assert result[0].resource_id == "org-guid"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: admincenter_settings_password_never_expire_test.py]---
Location: prowler-master/tests/providers/m365/services/admincenter/admincenter_settings_password_never_expire/admincenter_settings_password_never_expire_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_admincenter_settings_password_never_expire:
    def test_admincenter_no_domains(self):
        admincenter_client = mock.MagicMock
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_settings_password_never_expire.admincenter_settings_password_never_expire.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_settings_password_never_expire.admincenter_settings_password_never_expire import (
                admincenter_settings_password_never_expire,
            )

            admincenter_client.password_policy = None

            check = admincenter_settings_password_never_expire()
            result = check.execute()
            assert len(result) == 0

    def test_admincenter_domain_password_expire(self):
        admincenter_client = mock.MagicMock
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_settings_password_never_expire.admincenter_settings_password_never_expire.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                PasswordPolicy,
            )
            from prowler.providers.m365.services.admincenter.admincenter_settings_password_never_expire.admincenter_settings_password_never_expire import (
                admincenter_settings_password_never_expire,
            )

            admincenter_client.password_policy = PasswordPolicy(
                password_validity_period=5
            )

            check = admincenter_settings_password_never_expire()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Tenant Password policy does not have a Password never expires policy."
            )
            assert result[0].resource == admincenter_client.password_policy.dict()
            assert result[0].resource_name == "Password Policy"
            assert result[0].resource_id == "passwordPolicy"
            assert result[0].location == "global"

    def test_admincenter_password_not_expire(self):
        admincenter_client = mock.MagicMock
        admincenter_client.audited_tenant = "audited_tenant"
        admincenter_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.admincenter.admincenter_settings_password_never_expire.admincenter_settings_password_never_expire.admincenter_client",
                new=admincenter_client,
            ),
        ):
            from prowler.providers.m365.services.admincenter.admincenter_service import (
                PasswordPolicy,
            )
            from prowler.providers.m365.services.admincenter.admincenter_settings_password_never_expire.admincenter_settings_password_never_expire import (
                admincenter_settings_password_never_expire,
            )

            admincenter_client.password_policy = PasswordPolicy(
                password_validity_period=2147483647
            )

            check = admincenter_settings_password_never_expire()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Tenant Password policy is set to never expire."
            )
            assert result[0].resource == admincenter_client.password_policy.dict()
            assert result[0].resource_name == "Password Policy"
            assert result[0].resource_id == "passwordPolicy"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

````
