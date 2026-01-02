---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 662
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 662 of 867)

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

---[FILE: entra_conditional_access_policy_require_mfa_for_management_api_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_conditional_access_policy_require_mfa_for_management_api/entra_conditional_access_policy_require_mfa_for_management_api_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_conditional_access_policy_require_mfa_for_management_api:
    def test_entra_no_subscriptions(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api import (
                entra_conditional_access_policy_require_mfa_for_management_api,
            )

            entra_client.conditional_access_policy = {}

            check = entra_conditional_access_policy_require_mfa_for_management_api()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_no_policies(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api import (
                entra_conditional_access_policy_require_mfa_for_management_api,
            )

            entra_client.conditional_access_policy = {DOMAIN: {}}

            check = entra_conditional_access_policy_require_mfa_for_management_api()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Conditional Access Policy"
            assert result[0].resource_id == "Conditional Access Policy"
            assert (
                result[0].status_extended
                == "Conditional Access Policy does not require MFA for management API."
            )

    def test_entra_tenant_policy_no_mfa(self):
        entra_client = mock.MagicMock
        policy_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api import (
                entra_conditional_access_policy_require_mfa_for_management_api,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            policy = ConditionalAccessPolicy(
                id=policy_id,
                name="Test Policy",
                state="enabled",
                users={"include": ["All"]},
                target_resources={"include": ["797f4846-ba00-4fd7-ba43-dac1f8f63013"]},
                access_controls={"grant": ["grant"]},
            )

            entra_client.conditional_access_policy = {DOMAIN: {policy_id: policy}}

            check = entra_conditional_access_policy_require_mfa_for_management_api()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Conditional Access Policy"
            assert result[0].resource_id == "Conditional Access Policy"
            assert (
                result[0].status_extended
                == "Conditional Access Policy does not require MFA for management API."
            )

    def test_entra_tenant_policy_mfa(self):
        entra_client = mock.MagicMock
        policy_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api import (
                entra_conditional_access_policy_require_mfa_for_management_api,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            policy = ConditionalAccessPolicy(
                id=policy_id,
                name="Test Policy",
                state="enabled",
                users={"include": ["All"]},
                target_resources={"include": ["797f4846-ba00-4fd7-ba43-dac1f8f63013"]},
                access_controls={"grant": ["grant", "MFA"]},
            )

            entra_client.conditional_access_policy = {DOMAIN: {policy_id: policy}}

            check = entra_conditional_access_policy_require_mfa_for_management_api()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Test Policy"
            assert result[0].resource_id == policy_id
            assert (
                result[0].status_extended
                == "Conditional Access Policy requires MFA for management API."
            )

    def test_entra_tenant_policy_mfa_disabled(self):
        entra_client = mock.MagicMock
        policy_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api import (
                entra_conditional_access_policy_require_mfa_for_management_api,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            policy = ConditionalAccessPolicy(
                id=policy_id,
                name="Test Policy",
                state="disabled",
                users={"include": ["All"]},
                target_resources={"include": ["797f4846-ba00-4fd7-ba43-dac1f8f63013"]},
                access_controls={"grant": ["grant", "MFA"]},
            )

            entra_client.conditional_access_policy = {DOMAIN: {policy_id: policy}}

            check = entra_conditional_access_policy_require_mfa_for_management_api()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Conditional Access Policy"
            assert result[0].resource_id == "Conditional Access Policy"
            assert (
                result[0].status_extended
                == "Conditional Access Policy does not require MFA for management API."
            )

    def test_entra_tenant_policy_mfa_no_target(self):
        entra_client = mock.MagicMock
        policy_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api import (
                entra_conditional_access_policy_require_mfa_for_management_api,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            policy = ConditionalAccessPolicy(
                id=policy_id,
                name="Test Policy",
                state="enabled",
                users={"include": ["All"]},
                target_resources={"include": []},
                access_controls={"grant": ["grant", "MFA"]},
            )

            entra_client.conditional_access_policy = {DOMAIN: {policy_id: policy}}

            check = entra_conditional_access_policy_require_mfa_for_management_api()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Conditional Access Policy"
            assert result[0].resource_id == "Conditional Access Policy"
            assert (
                result[0].status_extended
                == "Conditional Access Policy does not require MFA for management API."
            )

    def test_entra_tenant_policy_mfa_no_users(self):
        entra_client = mock.MagicMock
        policy_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_conditional_access_policy_require_mfa_for_management_api.entra_conditional_access_policy_require_mfa_for_management_api import (
                entra_conditional_access_policy_require_mfa_for_management_api,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            policy = ConditionalAccessPolicy(
                id=policy_id,
                name="Test Policy",
                state="enabled",
                users={"include": []},
                target_resources={"include": ["797f4846-ba00-4fd7-ba43-dac1f8f63013"]},
                access_controls={"grant": ["grant", "MFA"]},
            )

            entra_client.conditional_access_policy = {DOMAIN: {policy_id: policy}}

            check = entra_conditional_access_policy_require_mfa_for_management_api()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Conditional Access Policy"
            assert result[0].resource_id == "Conditional Access Policy"
            assert (
                result[0].status_extended
                == "Conditional Access Policy does not require MFA for management API."
            )
```

--------------------------------------------------------------------------------

---[FILE: entra_global_admin_in_less_than_five_users_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_global_admin_in_less_than_five_users/entra_global_admin_in_less_than_five_users_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_global_admin_in_less_than_five_users:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users import (
                entra_global_admin_in_less_than_five_users,
            )

            entra_client.directory_roles = {}

            entra_client.users = {}

            check = entra_global_admin_in_less_than_five_users()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_empty(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users import (
                entra_global_admin_in_less_than_five_users,
            )

            entra_client.directory_roles = {DOMAIN: {}}

            entra_client.users = {DOMAIN: {}}

            check = entra_global_admin_in_less_than_five_users()
            result = check.execute()
            assert len(result) == 0

    def test_entra_less_than_five_global_admins(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users import (
                entra_global_admin_in_less_than_five_users,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                DirectoryRole,
                User,
            )

            id = str(uuid4())
            id_user1 = str(uuid4())
            id_user2 = str(uuid4())

            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(
                        id=id,
                        members=[
                            User(id=id_user1, name="User1"),
                            User(id=id_user2, name="User2"),
                        ],
                    )
                }
            }

            entra_client.users = {
                DOMAIN: {
                    f"User1@{DOMAIN}": User(id=id_user1, name="User1"),
                    f"User2@{DOMAIN}": User(id=id_user2, name="User2"),
                }
            }

            check = entra_global_admin_in_less_than_five_users()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "There are 2 global administrators."
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Global Administrator"
            assert result[0].resource_id == id

    def test_entra_more_than_five_global_admins(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users import (
                entra_global_admin_in_less_than_five_users,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                DirectoryRole,
                User,
            )

            id = str(uuid4())
            id_user1 = str(uuid4())
            id_user2 = str(uuid4())
            id_user3 = str(uuid4())
            id_user4 = str(uuid4())
            id_user5 = str(uuid4())
            id_user6 = str(uuid4())

            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(
                        id=id,
                        members=[
                            User(id=id_user1, name="User1"),
                            User(id=id_user2, name="User2"),
                            User(id=id_user3, name="User3"),
                            User(id=id_user4, name="User4"),
                            User(id=id_user5, name="User5"),
                            User(id=id_user6, name="User6"),
                        ],
                    )
                }
            }

            entra_client.users = {
                DOMAIN: {
                    f"User1@{DOMAIN}": User(id=id_user1, name="User1"),
                    f"User2@{DOMAIN}": User(id=id_user2, name="User2"),
                    f"User3@{DOMAIN}": User(id=id_user3, name="User3"),
                    f"User4@{DOMAIN}": User(id=id_user4, name="User4"),
                    f"User5@{DOMAIN}": User(id=id_user5, name="User5"),
                    f"User6@{DOMAIN}": User(id=id_user6, name="User6"),
                }
            }

            check = entra_global_admin_in_less_than_five_users()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "There are 6 global administrators. It should be less than five."
            )
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Global Administrator"
            assert result[0].resource_id == id

    def test_entra_exactly_five_global_admins(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_global_admin_in_less_than_five_users.entra_global_admin_in_less_than_five_users import (
                entra_global_admin_in_less_than_five_users,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                DirectoryRole,
                User,
            )

            id = str(uuid4())
            id_user1 = str(uuid4())
            id_user2 = str(uuid4())
            id_user3 = str(uuid4())
            id_user4 = str(uuid4())
            id_user5 = str(uuid4())

            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(
                        id=id,
                        members=[
                            User(id=id_user1, name="User1"),
                            User(id=id_user2, name="User2"),
                            User(id=id_user3, name="User3"),
                            User(id=id_user4, name="User4"),
                            User(id=id_user5, name="User5"),
                        ],
                    )
                }
            }

            entra_client.users = {
                DOMAIN: {
                    f"User1@{DOMAIN}": User(id=id_user1, name="User1"),
                    f"User2@{DOMAIN}": User(id=id_user2, name="User2"),
                    f"User3@{DOMAIN}": User(id=id_user3, name="User3"),
                    f"User4@{DOMAIN}": User(id=id_user4, name="User4"),
                    f"User5@{DOMAIN}": User(id=id_user5, name="User5"),
                }
            }

            check = entra_global_admin_in_less_than_five_users()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "There are 5 global administrators. It should be less than five."
            )
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Global Administrator"
            assert result[0].resource_id == id
```

--------------------------------------------------------------------------------

---[FILE: entra_non_privileged_user_has_mfa_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_non_privileged_user_has_mfa/entra_non_privileged_user_has_mfa_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_non_privileged_user_has_mfa:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa import (
                entra_non_privileged_user_has_mfa,
            )

            entra_client.users = {}

            check = entra_non_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_no_users(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa import (
                entra_non_privileged_user_has_mfa,
            )

            entra_client.users = {DOMAIN: {}}

            check = entra_non_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 0

    def test_entra_user_no_privileged_no_mfa(self):
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa import (
                entra_non_privileged_user_has_mfa,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthMethod,
                DirectoryRole,
                User,
            )

            user = User(
                id=user_id,
                name="foo",
                authentication_methods=[AuthMethod(id=str(uuid4()), type="foo")],
            )

            entra_client.users = {DOMAIN: {f"foo@{DOMAIN}": user}}
            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(id=str(uuid4()), members=[])
                }
            }

            check = entra_non_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Non-privileged user foo does not have MFA."
            )
            assert result[0].resource_name == "foo"
            assert result[0].resource_id == user_id
            assert result[0].subscription == f"Tenant: {DOMAIN}"

    def test_entra_user_no_privileged_mfa(self):
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa import (
                entra_non_privileged_user_has_mfa,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthMethod,
                DirectoryRole,
                User,
            )

            user = User(
                id=user_id,
                name="foo",
                authentication_methods=[
                    AuthMethod(id=str(uuid4()), type="foo"),
                    AuthMethod(id=str(uuid4()), type="bar"),
                ],
            )

            entra_client.users = {DOMAIN: {f"foo@{DOMAIN}": user}}
            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(id=str(uuid4()), members=[])
                }
            }

            check = entra_non_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Non-privileged user foo has MFA."
            assert result[0].resource_name == "foo"
            assert result[0].resource_id == user_id
            assert result[0].subscription == f"Tenant: {DOMAIN}"

    def test_entra_user_privileged_no_mfa(self):
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa import (
                entra_non_privileged_user_has_mfa,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthMethod,
                DirectoryRole,
                User,
            )

            user = User(
                id=user_id,
                name="foo",
                authentication_methods=[AuthMethod(id=str(uuid4()), type="foo")],
            )

            entra_client.users = {DOMAIN: {f"foo@{DOMAIN}": user}}
            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(
                        id=str(uuid4()), members=[user]
                    )
                }
            }

            check = entra_non_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 0

    def test_entra_user_privileged_mfa(self):
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_non_privileged_user_has_mfa.entra_non_privileged_user_has_mfa import (
                entra_non_privileged_user_has_mfa,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthMethod,
                DirectoryRole,
                User,
            )

            user = User(
                id=user_id,
                name="foo",
                authentication_methods=[
                    AuthMethod(id=str(uuid4()), type="foo"),
                    AuthMethod(id=str(uuid4()), type="bar"),
                ],
            )

            entra_client.users = {DOMAIN: {f"foo@{DOMAIN}": user}}
            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(
                        id=str(uuid4()), members=[user]
                    )
                }
            }

            check = entra_non_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_default_users_cannot_create_security_groups_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_policy_default_users_cannot_create_security_groups/entra_policy_default_users_cannot_create_security_groups_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_policy_default_users_cannot_create_security_groups:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock
        entra_client.authorization_policy = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_default_users_cannot_create_security_groups.entra_policy_default_users_cannot_create_security_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_default_users_cannot_create_security_groups.entra_policy_default_users_cannot_create_security_groups import (
                entra_policy_default_users_cannot_create_security_groups,
            )

            check = entra_policy_default_users_cannot_create_security_groups()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_empty(self):
        entra_client = mock.MagicMock
        entra_client.authorization_policy = {DOMAIN: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_default_users_cannot_create_security_groups.entra_policy_default_users_cannot_create_security_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_default_users_cannot_create_security_groups.entra_policy_default_users_cannot_create_security_groups import (
                entra_policy_default_users_cannot_create_security_groups,
            )

            check = entra_policy_default_users_cannot_create_security_groups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert (
                result[0].status_extended
                == "Non-privileged users are able to create security groups via the Access Panel and the Azure administration portal."
            )

    def test_entra_default_user_role_permissions_allowed_to_create_security_groups(
        self,
    ):
        entra_client = mock.MagicMock
        id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_default_users_cannot_create_security_groups.entra_policy_default_users_cannot_create_security_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_default_users_cannot_create_security_groups.entra_policy_default_users_cannot_create_security_groups import (
                entra_policy_default_users_cannot_create_security_groups,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Test",
                    description="Test",
                    default_user_role_permissions=DefaultUserRolePermissions(
                        allowed_to_create_security_groups=True
                    ),
                    guest_invite_settings="everyone",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_default_users_cannot_create_security_groups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Non-privileged users are able to create security groups via the Access Panel and the Azure administration portal."
            )
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"

    def test_entra_default_user_role_permissions_not_allowed_to_create_security_groups(
        self,
    ):
        entra_client = mock.MagicMock
        id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_default_users_cannot_create_security_groups.entra_policy_default_users_cannot_create_security_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_default_users_cannot_create_security_groups.entra_policy_default_users_cannot_create_security_groups import (
                entra_policy_default_users_cannot_create_security_groups,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Test",
                    description="Test",
                    default_user_role_permissions=DefaultUserRolePermissions(
                        allowed_to_create_security_groups=False
                    ),
                    guest_invite_settings="everyone",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_default_users_cannot_create_security_groups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Non-privileged users are not able to create security groups via the Access Panel and the Azure administration portal."
            )
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"
```

--------------------------------------------------------------------------------

````
