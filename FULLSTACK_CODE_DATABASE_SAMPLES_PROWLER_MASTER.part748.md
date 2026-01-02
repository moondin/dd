---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 748
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 748 of 867)

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

---[FILE: sharepoint_external_sharing_managed_test.py]---
Location: prowler-master/tests/providers/m365/services/sharepoint/sharepoint_external_sharing_managed/sharepoint_external_sharing_managed_test.py

```python
import uuid
from unittest import mock

from prowler.providers.m365.services.sharepoint.sharepoint_service import (
    SharePointSettings,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_sharepoint_external_sharing_managed:
    def test_external_sharing_invalid_mode(self):
        """
        Test when sharingDomainRestrictionMode is set to an invalid value (not "allowList" ni "blockList"):
        The check should FAIL with the default message.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed import (
                sharepoint_external_sharing_managed,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                legacyAuth=True,
                resharingEnabled=False,
                sharingDomainRestrictionMode="none",
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_external_sharing_managed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "SharePoint external sharing is not managed through domain restrictions."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_external_sharing_disabled(self):
        """
        Test when external sharing is disabled at organization level:
        The check should PASS since domain restrictions are not applicable.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed import (
                sharepoint_external_sharing_managed,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="Disabled",
                sharingAllowedDomainList=[],
                sharingBlockedDomainList=[],
                legacyAuth=True,
                resharingEnabled=False,
                sharingDomainRestrictionMode="none",
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_external_sharing_managed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "External sharing is disabled at organization level."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_allow_list_empty(self):
        """
        Test when sharingDomainRestrictionMode is "allowList" but AllowedDomainList is empty:
        The check should FAIL with a message indicating the list is empty.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed import (
                sharepoint_external_sharing_managed,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=[],
                sharingBlockedDomainList=["blocked-domain.com"],
                legacyAuth=True,
                resharingEnabled=False,
                sharingDomainRestrictionMode="allowList",
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_external_sharing_managed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "SharePoint external sharing is managed through domain restrictions with mode 'allowList' but the list is empty."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_block_list_empty(self):
        """
        Test when sharingDomainRestrictionMode is "blockList" but BlockedDomainList is empty:
        The check should FAIL with a message indicating the list is empty.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed import (
                sharepoint_external_sharing_managed,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=[],
                legacyAuth=True,
                resharingEnabled=False,
                sharingDomainRestrictionMode="blockList",
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_external_sharing_managed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "SharePoint external sharing is managed through domain restrictions with mode 'blockList' but the list is empty."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_allow_list_non_empty(self):
        """
        Test when sharingDomainRestrictionMode is "allowList" and AllowedDomainList is not empty:
        The check should PASS.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed import (
                sharepoint_external_sharing_managed,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                legacyAuth=True,
                resharingEnabled=False,
                sharingDomainRestrictionMode="allowList",
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_external_sharing_managed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SharePoint external sharing is managed through domain restrictions with mode 'allowList'."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_block_list_non_empty(self):
        """
        Test when sharingDomainRestrictionMode is "blockList" and BlockedDomainList is not empty:
        The check should PASS.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed import (
                sharepoint_external_sharing_managed,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                legacyAuth=True,
                resharingEnabled=False,
                sharingDomainRestrictionMode="blockList",
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_external_sharing_managed()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SharePoint external sharing is managed through domain restrictions with mode 'blockList'."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_empty_settings(self):
        """
        Test when sharepoint_client.settings is empty:
        The check should return an empty list of findings.
        """
        sharepoint_client = mock.MagicMock
        sharepoint_client.settings = {}
        sharepoint_client.tenant_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_managed.sharepoint_external_sharing_managed import (
                sharepoint_external_sharing_managed,
            )

            check = sharepoint_external_sharing_managed()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_external_sharing_restricted_test.py]---
Location: prowler-master/tests/providers/m365/services/sharepoint/sharepoint_external_sharing_restricted/sharepoint_external_sharing_restricted_test.py

```python
import uuid
from unittest import mock

from prowler.providers.m365.services.sharepoint.sharepoint_service import (
    SharePointSettings,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_sharepoint_external_sharing_restricted:
    def test_external_sharing_restricted(self):
        """
        Test when sharingCapability is set to an allowed value (e.g. "ExternalUserSharingOnly"):
        The check should PASS because external sharing is restricted.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_restricted.sharepoint_external_sharing_restricted.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_restricted.sharepoint_external_sharing_restricted import (
                sharepoint_external_sharing_restricted,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                sharingDomainRestrictionMode="allowList",
                resharingEnabled=False,
                legacyAuth=True,
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_external_sharing_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "External sharing is restricted to external user sharing or more restrictive."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_external_sharing_not_restricted(self):
        """
        Test when sharingCapability is set to a non-restricted value (e.g. "ExternalUserAndGuestSharing"):
        The check should FAIL because external sharing is not restricted.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_restricted.sharepoint_external_sharing_restricted.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_restricted.sharepoint_external_sharing_restricted import (
                sharepoint_external_sharing_restricted,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserAndGuestSharing",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                sharingDomainRestrictionMode="allowList",
                resharingEnabled=False,
                legacyAuth=True,
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_external_sharing_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "External sharing is not restricted and guests users can access."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_empty_settings(self):
        """
        Test when sharepoint_client.settings is empty:
        The check should return an empty list of findings.
        """
        sharepoint_client = mock.MagicMock
        sharepoint_client.settings = {}
        sharepoint_client.tenant_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_restricted.sharepoint_external_sharing_restricted.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_external_sharing_restricted.sharepoint_external_sharing_restricted import (
                sharepoint_external_sharing_restricted,
            )

            check = sharepoint_external_sharing_restricted()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_guest_sharing_restricted_test.py]---
Location: prowler-master/tests/providers/m365/services/sharepoint/sharepoint_guest_sharing_restricted/sharepoint_guest_sharing_restricted_test.py

```python
import uuid
from unittest import mock

from prowler.providers.m365.services.sharepoint.sharepoint_service import (
    SharePointSettings,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_sharepoint_guest_sharing_restricted:
    def test_guest_sharing_restricted(self):
        """
        Test when resharingEnabled is False:
        The check should PASS because guest sharing is restricted.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_guest_sharing_restricted.sharepoint_guest_sharing_restricted.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_guest_sharing_restricted.sharepoint_guest_sharing_restricted import (
                sharepoint_guest_sharing_restricted,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                sharingDomainRestrictionMode="allowList",
                legacyAuth=True,
                resharingEnabled=False,
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_guest_sharing_restricted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "Guest sharing is restricted; guest users cannot share items they do not own."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_guest_sharing_not_restricted(self):
        """
        Test when resharingEnabled is True:
        The check should FAIL because guest sharing is not restricted.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_guest_sharing_restricted.sharepoint_guest_sharing_restricted.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_guest_sharing_restricted.sharepoint_guest_sharing_restricted import (
                sharepoint_guest_sharing_restricted,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                sharingDomainRestrictionMode="allowList",
                legacyAuth=True,
                resharingEnabled=True,
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_guest_sharing_restricted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "Guest sharing is not restricted; guest users can share items they do not own."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_empty_settings(self):
        """
        Test when sharepoint_client.settings is empty:
        The check should return an empty list of findings.
        """
        sharepoint_client = mock.MagicMock
        sharepoint_client.settings = {}
        sharepoint_client.tenant_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_guest_sharing_restricted.sharepoint_guest_sharing_restricted.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_guest_sharing_restricted.sharepoint_guest_sharing_restricted import (
                sharepoint_guest_sharing_restricted,
            )

            check = sharepoint_guest_sharing_restricted()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_modern_authentication_required_test.py]---
Location: prowler-master/tests/providers/m365/services/sharepoint/sharepoint_modern_authentication_required/sharepoint_modern_authentication_required_test.py

```python
import uuid
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_sharepoint_modern_authentication_required:
    def test_sharepoint_modern_authentication_disabled(self):
        """
        Test when legacyAuth is False:
        The check should PASS, as SharePoint does not allow access to apps that don't use modern authentication.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_modern_authentication_required.sharepoint_modern_authentication_required.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_modern_authentication_required.sharepoint_modern_authentication_required import (
                sharepoint_modern_authentication_required,
            )
            from prowler.providers.m365.services.sharepoint.sharepoint_service import (
                SharePointSettings,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserAndGuestSharing",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                sharingDomainRestrictionMode="allowList",
                resharingEnabled=False,
                legacyAuth=False,
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_modern_authentication_required()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "Microsoft 365 SharePoint does not allow access to apps that don't use modern authentication."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_sharepoint_modern_authentication_enabled(self):
        """
        Test when legacyAuth is True:
        The check should FAIL, as SharePoint allows access to apps that don't use modern authentication.
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_modern_authentication_required.sharepoint_modern_authentication_required.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_modern_authentication_required.sharepoint_modern_authentication_required import (
                sharepoint_modern_authentication_required,
            )
            from prowler.providers.m365.services.sharepoint.sharepoint_service import (
                SharePointSettings,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserAndGuestSharing",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                sharingDomainRestrictionMode="allowList",
                resharingEnabled=False,
                legacyAuth=True,
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_modern_authentication_required()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "Microsoft 365 SharePoint allows access to apps that don't use modern authentication."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_sharepoint_empty_settings(self):
        """
        Test when sharepoint_client.settings is empty:
        The check should return an empty list of findings.
        """
        sharepoint_client = mock.MagicMock
        sharepoint_client.settings = {}
        sharepoint_client.tenant_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_modern_authentication_required.sharepoint_modern_authentication_required.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_modern_authentication_required.sharepoint_modern_authentication_required import (
                sharepoint_modern_authentication_required,
            )

            check = sharepoint_modern_authentication_required()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_onedrive_sync_restricted_unmanaged_devices_test.py]---
Location: prowler-master/tests/providers/m365/services/sharepoint/sharepoint_onedrive_sync_restricted_unmanaged_devices/sharepoint_onedrive_sync_restricted_unmanaged_devices_test.py

```python
import uuid
from unittest import mock

from prowler.providers.m365.services.sharepoint.sharepoint_service import (
    SharePointSettings,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_sharepoint_onedrive_sync_restricted_unmanaged_devices:
    def test_no_allowed_domain_guids(self):
        """
        Test when there are no allowed domain guids for OneDrive sync app


        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_onedrive_sync_restricted_unmanaged_devices import (
                sharepoint_onedrive_sync_restricted_unmanaged_devices,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=["allowed-domain.com"],
                sharingBlockedDomainList=["blocked-domain.com"],
                legacyAuth=True,
                resharingEnabled=False,
                sharingDomainRestrictionMode="none",
                allowedDomainGuidsForSyncApp=[],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_onedrive_sync_restricted_unmanaged_devices()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Microsoft 365 SharePoint allows OneDrive sync to unmanaged devices."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_allowed_domain_guids(self):
        """
        Test when there are allowed domain guids for OneDrive sync app
        """
        sharepoint_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_onedrive_sync_restricted_unmanaged_devices import (
                sharepoint_onedrive_sync_restricted_unmanaged_devices,
            )

            sharepoint_client.settings = SharePointSettings(
                sharingCapability="ExternalUserSharingOnly",
                sharingAllowedDomainList=[],
                sharingBlockedDomainList=["blocked-domain.com"],
                legacyAuth=True,
                resharingEnabled=False,
                sharingDomainRestrictionMode="allowList",
                allowedDomainGuidsForSyncApp=[uuid.uuid4()],
            )
            sharepoint_client.tenant_domain = DOMAIN

            check = sharepoint_onedrive_sync_restricted_unmanaged_devices()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Microsoft 365 SharePoint does not allow OneDrive sync to unmanaged devices."
            )
            assert result[0].resource_id == "sharepointSettings"
            assert result[0].location == "global"
            assert result[0].resource_name == "SharePoint Settings"
            assert result[0].resource == sharepoint_client.settings.dict()

    def test_empty_settings(self):
        """
        Test when sharepoint_client.settings is empty:
        The check should return an empty list of findings.
        """
        sharepoint_client = mock.MagicMock
        sharepoint_client.settings = {}
        sharepoint_client.tenant_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch("prowler.providers.m365.lib.service.service.M365PowerShell"),
            mock.patch(
                "prowler.providers.m365.services.sharepoint.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_client",
                new=sharepoint_client,
            ),
        ):
            from prowler.providers.m365.services.sharepoint.sharepoint_onedrive_sync_restricted_unmanaged_devices.sharepoint_onedrive_sync_restricted_unmanaged_devices import (
                sharepoint_onedrive_sync_restricted_unmanaged_devices,
            )

            check = sharepoint_onedrive_sync_restricted_unmanaged_devices()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
