---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 743
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 743 of 867)

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

---[FILE: entra_managed_device_required_for_authentication_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_managed_device_required_for_authentication/entra_managed_device_required_for_authentication_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.m365.services.entra.entra_service import (
    ApplicationsConditions,
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
    Conditions,
    GrantControlOperator,
    GrantControls,
    PersistentBrowser,
    SessionControls,
    SignInFrequency,
    SignInFrequencyInterval,
    UsersConditions,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_entra_managed_device_required_for_authentication:
    def test_entra_no_conditional_access_policies(self):
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_managed_device_required_for_authentication.entra_managed_device_required_for_authentication.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_managed_device_required_for_authentication.entra_managed_device_required_for_authentication import (
                entra_managed_device_required_for_authentication,
            )

            entra_client.conditional_access_policies = {}

            check = entra_managed_device_required_for_authentication()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No Conditional Access Policy requires a managed device for authentication."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Conditional Access Policies"
            assert result[0].resource_id == "conditionalAccessPolicies"
            assert result[0].location == "global"

    def test_entra_managed_device_disabled(self):
        id = str(uuid4())
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_managed_device_required_for_authentication.entra_managed_device_required_for_authentication.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_managed_device_required_for_authentication.entra_managed_device_required_for_authentication import (
                entra_managed_device_required_for_authentication,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name="Test",
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=[],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=[],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[], operator=GrantControlOperator.OR
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.TIME_BASED,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.DISABLED,
                )
            }

            check = entra_managed_device_required_for_authentication()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No Conditional Access Policy requires a managed device for authentication."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Conditional Access Policies"
            assert result[0].resource_id == "conditionalAccessPolicies"
            assert result[0].location == "global"

    def test_entra_managed_device_enabled_for_reporting(self):
        id = str(uuid4())
        display_name = "Test"
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_managed_device_required_for_authentication.entra_managed_device_required_for_authentication.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_managed_device_required_for_authentication.entra_managed_device_required_for_authentication import (
                entra_managed_device_required_for_authentication,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name=display_name,
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["All"],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[
                            ConditionalAccessGrantControl.MFA,
                            ConditionalAccessGrantControl.DOMAIN_JOINED_DEVICE,
                        ],
                        operator=GrantControlOperator.OR,
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.TIME_BASED,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.ENABLED_FOR_REPORTING,
                )
            }

            check = entra_managed_device_required_for_authentication()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Conditional Access Policy '{display_name}' reports the requirement of a managed device for authentication but does not enforce it."
            )
            assert (
                result[0].resource
                == entra_client.conditional_access_policies[id].dict()
            )

            assert result[0].resource_name == display_name
            assert result[0].resource_id == id
            assert result[0].location == "global"

    def test_entra_managed_device_enabled(self):
        id = str(uuid4())
        display_name = "Test"
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_managed_device_required_for_authentication.entra_managed_device_required_for_authentication.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_managed_device_required_for_authentication.entra_managed_device_required_for_authentication import (
                entra_managed_device_required_for_authentication,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name=display_name,
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["All"],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[
                            ConditionalAccessGrantControl.MFA,
                            ConditionalAccessGrantControl.DOMAIN_JOINED_DEVICE,
                        ],
                        operator=GrantControlOperator.OR,
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.TIME_BASED,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.ENABLED,
                )
            }

            check = entra_managed_device_required_for_authentication()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Conditional Access Policy '{display_name}' does require a managed device for authentication."
            )
            assert (
                result[0].resource
                == entra_client.conditional_access_policies[id].dict()
            )

            assert result[0].resource_name == display_name
            assert result[0].resource_id == id
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: entra_managed_device_required_for_mfa_registration_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_managed_device_required_for_mfa_registration/entra_managed_device_required_for_mfa_registration_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.m365.services.entra.entra_service import (
    ApplicationsConditions,
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
    Conditions,
    GrantControlOperator,
    GrantControls,
    PersistentBrowser,
    SessionControls,
    SignInFrequency,
    SignInFrequencyInterval,
    UserAction,
    UsersConditions,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_entra_managed_device_required_for_mfa_registration:
    def test_entra_no_conditional_access_policies(self):
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_managed_device_required_for_mfa_registration.entra_managed_device_required_for_mfa_registration.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_managed_device_required_for_mfa_registration.entra_managed_device_required_for_mfa_registration import (
                entra_managed_device_required_for_mfa_registration,
            )

            entra_client.conditional_access_policies = {}

            check = entra_managed_device_required_for_mfa_registration()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No Conditional Access Policy requires a managed device for MFA registration."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Conditional Access Policies"
            assert result[0].resource_id == "conditionalAccessPolicies"
            assert result[0].location == "global"

    def test_entra_managed_device_disabled(self):
        id = str(uuid4())
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_managed_device_required_for_mfa_registration.entra_managed_device_required_for_mfa_registration.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_managed_device_required_for_mfa_registration.entra_managed_device_required_for_mfa_registration import (
                entra_managed_device_required_for_mfa_registration,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name="Test",
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=[],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=[],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[], operator=GrantControlOperator.OR
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.TIME_BASED,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.DISABLED,
                )
            }

            check = entra_managed_device_required_for_mfa_registration()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No Conditional Access Policy requires a managed device for MFA registration."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Conditional Access Policies"
            assert result[0].resource_id == "conditionalAccessPolicies"
            assert result[0].location == "global"

    def test_entra_managed_device_enabled_for_reporting(self):
        id = str(uuid4())
        display_name = "Test"
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_managed_device_required_for_mfa_registration.entra_managed_device_required_for_mfa_registration.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_managed_device_required_for_mfa_registration.entra_managed_device_required_for_mfa_registration import (
                entra_managed_device_required_for_mfa_registration,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name=display_name,
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["All"],
                            excluded_applications=[],
                            included_user_actions=[UserAction.REGISTER_SECURITY_INFO],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[
                            ConditionalAccessGrantControl.MFA,
                            ConditionalAccessGrantControl.DOMAIN_JOINED_DEVICE,
                        ],
                        operator=GrantControlOperator.OR,
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.TIME_BASED,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.ENABLED_FOR_REPORTING,
                )
            }

            check = entra_managed_device_required_for_mfa_registration()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Conditional Access Policy '{display_name}' reports the requirement of a managed device for MFA registration but does not enforce it."
            )
            assert (
                result[0].resource
                == entra_client.conditional_access_policies[id].dict()
            )

            assert result[0].resource_name == display_name
            assert result[0].resource_id == id
            assert result[0].location == "global"

    def test_entra_managed_device_enabled(self):
        id = str(uuid4())
        display_name = "Test"
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_managed_device_required_for_mfa_registration.entra_managed_device_required_for_mfa_registration.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_managed_device_required_for_mfa_registration.entra_managed_device_required_for_mfa_registration import (
                entra_managed_device_required_for_mfa_registration,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name=display_name,
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["All"],
                            excluded_applications=[],
                            included_user_actions=[UserAction.REGISTER_SECURITY_INFO],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[
                            ConditionalAccessGrantControl.MFA,
                            ConditionalAccessGrantControl.DOMAIN_JOINED_DEVICE,
                        ],
                        operator=GrantControlOperator.OR,
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.TIME_BASED,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.ENABLED,
                )
            }

            check = entra_managed_device_required_for_mfa_registration()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Conditional Access Policy '{display_name}' does require a managed device for MFA registration."
            )
            assert (
                result[0].resource
                == entra_client.conditional_access_policies[id].dict()
            )

            assert result[0].resource_name == display_name
            assert result[0].resource_id == id
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: entra_password_hash_sync_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_password_hash_sync_enabled/entra_password_hash_sync_enabled_test.py

```python
from unittest import mock

from prowler.providers.m365.services.entra.entra_service import Organization
from tests.providers.m365.m365_fixtures import set_mocked_m365_provider


class Test_entra_password_hash_sync_enabled:
    def test_password_hash_sync_enabled(self):
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_password_hash_sync_enabled.entra_password_hash_sync_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_password_hash_sync_enabled.entra_password_hash_sync_enabled import (
                entra_password_hash_sync_enabled,
            )

            org = Organization(
                id="org1",
                name="Organization 1",
                on_premises_sync_enabled=True,
            )
            entra_client.organizations = [org]

            check = entra_password_hash_sync_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Password hash synchronization is enabled for hybrid Microsoft Entra deployments."
            )
            assert result[0].resource_id == "org1"
            assert result[0].resource_name == "Organization 1"
            assert result[0].location == "global"
            assert result[0].resource == org.dict()

    def test_password_hash_sync_disabled(self):
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_password_hash_sync_enabled.entra_password_hash_sync_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_password_hash_sync_enabled.entra_password_hash_sync_enabled import (
                entra_password_hash_sync_enabled,
            )

            org1 = Organization(
                id="org1",
                name="Organization 1",
                on_premises_sync_enabled=False,
            )
            org2 = Organization(
                id="org2",
                name="Organization 2",
                on_premises_sync_enabled=True,
            )
            entra_client.organizations = [org1, org2]

            check = entra_password_hash_sync_enabled()
            result = check.execute()

            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Password hash synchronization is not enabled for hybrid Microsoft Entra deployments."
            )
            assert result[0].resource_id == "org1"
            assert result[0].resource_name == "Organization 1"
            assert result[0].location == "global"
            assert result[0].resource == org1.dict()
            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "Password hash synchronization is enabled for hybrid Microsoft Entra deployments."
            )
            assert result[1].resource_id == "org2"
            assert result[1].resource_name == "Organization 2"
            assert result[1].location == "global"
            assert result[1].resource == org2.dict()

    def test_password_hash_sync_disabled_two_org(self):
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_password_hash_sync_enabled.entra_password_hash_sync_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_password_hash_sync_enabled.entra_password_hash_sync_enabled import (
                entra_password_hash_sync_enabled,
            )

            org = Organization(
                id="org2",
                name="Organization 2",
                on_premises_sync_enabled=False,
            )
            entra_client.organizations = [org]

            check = entra_password_hash_sync_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Password hash synchronization is not enabled for hybrid Microsoft Entra deployments."
            )
            assert result[0].resource_id == "org2"
            assert result[0].resource_name == "Organization 2"
            assert result[0].location == "global"
            assert result[0].resource == org.dict()

    def test_empty_organization(self):
        entra_client = mock.MagicMock()
        entra_client.organization = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_password_hash_sync_enabled.entra_password_hash_sync_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_password_hash_sync_enabled.entra_password_hash_sync_enabled import (
                entra_password_hash_sync_enabled,
            )

            check = entra_password_hash_sync_enabled()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: microsoft365_entra_policy_ensure_default_user_cannot_create_tenants_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_policy_ensure_default_user_cannot_create_tenants/microsoft365_entra_policy_ensure_default_user_cannot_create_tenants_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.m365.services.entra.entra_service import (
    AuthorizationPolicy,
    DefaultUserRolePermissions,
)
from tests.providers.m365.m365_fixtures import set_mocked_m365_provider


class Test_entra_policy_ensure_default_user_cannot_create_tenants:
    def test_entra_empty_tenant(self):
        entra_client = mock.MagicMock
        entra_client.authorization_policy = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants import (
                entra_policy_ensure_default_user_cannot_create_tenants,
            )

            check = entra_policy_ensure_default_user_cannot_create_tenants()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Tenant creation is not disabled for non-admin users."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert result[0].location == "global"

    def test_entra_default_user_role_permissions_allowed_to_create_tenants(self):
        id = str(uuid4())
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants import (
                entra_policy_ensure_default_user_cannot_create_tenants,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id=id,
                name="Test",
                description="Test",
                default_user_role_permissions=DefaultUserRolePermissions(
                    allowed_to_create_tenants=True
                ),
            )

            check = entra_policy_ensure_default_user_cannot_create_tenants()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Tenant creation is not disabled for non-admin users."
            )
            assert result[0].resource == entra_client.authorization_policy.dict()
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].location == "global"

    def test_entra_default_user_role_permissions_not_allowed_to_create_tenants(self):
        id = str(uuid4())
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants import (
                entra_policy_ensure_default_user_cannot_create_tenants,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id=id,
                name="Test",
                description="Test",
                default_user_role_permissions=DefaultUserRolePermissions(
                    allowed_to_create_tenants=False
                ),
            )

            check = entra_policy_ensure_default_user_cannot_create_tenants()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Tenant creation is disabled for non-admin users."
            )
            assert result[0].resource == entra_client.authorization_policy.dict()
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

````
