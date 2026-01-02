---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 665
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 665 of 867)

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

---[FILE: entra_user_with_vm_access_has_mfa_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_user_with_vm_access_has_mfa/entra_user_with_vm_access_has_mfa_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.config import VIRTUAL_MACHINE_ADMINISTRATOR_LOGIN_ROLE_ID
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    DOMAIN,
    set_mocked_azure_provider,
)


class Test_iam_assignment_priviledge_access_vm_has_mfa:
    def test_iam_no_roles(self):
        iam_client = mock.MagicMock
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa import (
                entra_user_with_vm_access_has_mfa,
            )

            iam_client.role_assignments = {}
            entra_client.users = {}

            check = entra_user_with_vm_access_has_mfa()
            result = check.execute()
            assert len(result) == 0

    def test_entra_user_with_vm_access_has_mfa(self):
        iam_client = mock.MagicMock
        role_assigment_id = str(uuid4())
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.iam_client",
                new=iam_client,
            ),
        ):
            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=set_mocked_azure_provider(),
                ),
                mock.patch(
                    "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.entra_client",
                    new=entra_client,
                ),
            ):
                from prowler.providers.azure.services.entra.entra_service import (
                    AuthMethod,
                    User,
                )
                from prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa import (
                    entra_user_with_vm_access_has_mfa,
                )
                from prowler.providers.azure.services.iam.iam_service import (
                    RoleAssignment,
                )

                iam_client.role_assignments = {
                    AZURE_SUBSCRIPTION_ID: {
                        role_assigment_id: RoleAssignment(
                            id=role_assigment_id,
                            name="test",
                            scope=AZURE_SUBSCRIPTION_ID,
                            role_id=VIRTUAL_MACHINE_ADMINISTRATOR_LOGIN_ROLE_ID,
                            agent_type="User",
                            agent_id=user_id,
                        )
                    }
                }

                entra_client.users = {
                    DOMAIN: {
                        f"test@{DOMAIN}": User(
                            id=user_id,
                            name="test",
                            authentication_methods=[
                                AuthMethod(id=str(uuid4()), type="Password"),
                                AuthMethod(
                                    id=str(uuid4()), type="MicrosoftAuthenticator"
                                ),
                            ],
                        )
                    }
                }

                check = entra_user_with_vm_access_has_mfa()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"User test can access VMs in subscription {AZURE_SUBSCRIPTION_ID} but it has MFA."
                )
                assert result[0].subscription == AZURE_SUBSCRIPTION_ID
                assert result[0].resource_name == "test"
                assert result[0].resource_id == user_id

    def test_entra_user_with_vm_access_has_mfa_no_mfa(self):
        iam_client = mock.MagicMock
        role_assigment_id = str(uuid4())
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.iam_client",
                new=iam_client,
            ),
        ):
            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=set_mocked_azure_provider(),
                ),
                mock.patch(
                    "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.entra_client",
                    new=entra_client,
                ),
            ):
                from prowler.providers.azure.services.entra.entra_service import (
                    AuthMethod,
                    User,
                )
                from prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa import (
                    entra_user_with_vm_access_has_mfa,
                )
                from prowler.providers.azure.services.iam.iam_service import (
                    RoleAssignment,
                )

                iam_client.role_assignments = {
                    AZURE_SUBSCRIPTION_ID: {
                        role_assigment_id: RoleAssignment(
                            id=role_assigment_id,
                            name="test",
                            scope=AZURE_SUBSCRIPTION_ID,
                            role_id=VIRTUAL_MACHINE_ADMINISTRATOR_LOGIN_ROLE_ID,
                            agent_type="User",
                            agent_id=user_id,
                        )
                    }
                }

                entra_client.users = {
                    DOMAIN: {
                        f"test@{DOMAIN}": User(
                            id=user_id,
                            name="test",
                            authentication_methods=[
                                AuthMethod(id=str(uuid4()), type="Password"),
                            ],
                        )
                    }
                }

                check = entra_user_with_vm_access_has_mfa()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"User test without MFA can access VMs in subscription {AZURE_SUBSCRIPTION_ID}"
                )
                assert result[0].subscription == AZURE_SUBSCRIPTION_ID
                assert result[0].resource_name == "test"
                assert result[0].resource_id == user_id

    def test_entra_user_with_vm_access_has_mfa_no_user(self):
        iam_client = mock.MagicMock
        role_assigment_id = str(uuid4())
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.iam_client",
                new=iam_client,
            ),
        ):
            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=set_mocked_azure_provider(),
                ),
                mock.patch(
                    "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.entra_client",
                    new=entra_client,
                ),
            ):
                from prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa import (
                    entra_user_with_vm_access_has_mfa,
                )
                from prowler.providers.azure.services.iam.iam_service import (
                    RoleAssignment,
                )

                iam_client.role_assignments = {
                    AZURE_SUBSCRIPTION_ID: {
                        role_assigment_id: RoleAssignment(
                            id=role_assigment_id,
                            name="test",
                            scope=AZURE_SUBSCRIPTION_ID,
                            role_id=VIRTUAL_MACHINE_ADMINISTRATOR_LOGIN_ROLE_ID,
                            agent_type="User",
                            agent_id=user_id,
                        )
                    }
                }

                entra_client.users = {DOMAIN: {}}

                check = entra_user_with_vm_access_has_mfa()
                result = check.execute()
                assert len(result) == 0

    def test_entra_user_with_vm_access_has_mfa_no_role(self):
        iam_client = mock.MagicMock
        role_assigment_id = str(uuid4())
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.iam_client",
                new=iam_client,
            ),
        ):
            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=set_mocked_azure_provider(),
                ),
                mock.patch(
                    "prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa.entra_client",
                    new=entra_client,
                ),
            ):
                from prowler.providers.azure.services.entra.entra_service import (
                    AuthMethod,
                    User,
                )
                from prowler.providers.azure.services.entra.entra_user_with_vm_access_has_mfa.entra_user_with_vm_access_has_mfa import (
                    entra_user_with_vm_access_has_mfa,
                )
                from prowler.providers.azure.services.iam.iam_service import (
                    RoleAssignment,
                )

                iam_client.role_assignments = {
                    AZURE_SUBSCRIPTION_ID: {
                        role_assigment_id: RoleAssignment(
                            id=role_assigment_id,
                            name="test",
                            scope=AZURE_SUBSCRIPTION_ID,
                            role_id=str(uuid4()),
                            agent_type="User",
                            agent_id=user_id,
                        )
                    }
                }

                entra_client.users = {
                    DOMAIN: {
                        f"test@{DOMAIN}": User(
                            id=user_id,
                            name="test",
                            authentication_methods=[
                                AuthMethod(id=str(uuid4()), type="Password"),
                                AuthMethod(
                                    id=str(uuid4()), type="MicrosoftAuthenticator"
                                ),
                            ],
                        )
                    }
                }

                check = entra_user_with_vm_access_has_mfa()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: user_privileges_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/lib/user_privileges_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.entra.entra_service import User
from prowler.providers.azure.services.entra.lib.user_privileges import (
    is_privileged_user,
)


class Test_user_privileges_test:
    def test_user_in_privileged_roles(self):
        user_id = str(uuid4())
        privileged_roles = {"admin": mock.MagicMock()}
        privileged_roles["admin"].members = [User(id=user_id, name="user1")]

        user = User(id=user_id, name="user1")
        assert is_privileged_user(user, privileged_roles)

    def test_user_not_in_privileged_roles(self):
        user_id = str(uuid4())
        privileged_roles = {"admin": mock.MagicMock()}
        privileged_roles["admin"].members = [User(id=str(uuid4()), name="user2")]

        user = User(id=user_id, name="user1")
        assert not is_privileged_user(user, privileged_roles)
```

--------------------------------------------------------------------------------

---[FILE: iam_custom_role_has_permissions_to_administer_resource_locks_test.py]---
Location: prowler-master/tests/providers/azure/services/iam/iam_custom_role_has_permissions_to_administer_resource_locks/iam_custom_role_has_permissions_to_administer_resource_locks_test.py

```python
from unittest import mock

from azure.mgmt.authorization.v2022_04_01.models import Permission

from prowler.providers.azure.services.iam.iam_service import Role
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_iam_custom_role_has_permissions_to_administer_resource_locks:
    def test_iam_no_roles(self):
        defender_client = mock.MagicMock
        defender_client.custom_roles = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks.iam_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks import (
                iam_custom_role_has_permissions_to_administer_resource_locks,
            )

            check = iam_custom_role_has_permissions_to_administer_resource_locks()
            result = check.execute()
            assert len(result) == 0

    def test_iam_custom_owner_role_created_with_lock_administration_permissions(
        self,
    ):
        defender_client = mock.MagicMock
        role_name = "test-role"
        defender_client.custom_roles = {
            AZURE_SUBSCRIPTION_ID: {
                "test-role-id": Role(
                    id="test-role-id",
                    name=role_name,
                    type="CustomRole",
                    assignable_scopes=["/.*", "/test"],
                    permissions=[
                        Permission(
                            actions=[
                                "Microsoft.Authorization/locks/*",
                                "microsoft.aadiam/azureADMetrics/read",
                            ]
                        )
                    ],
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks.iam_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks import (
                iam_custom_role_has_permissions_to_administer_resource_locks,
            )

            check = iam_custom_role_has_permissions_to_administer_resource_locks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Role {role_name} from subscription {AZURE_SUBSCRIPTION_ID} has permission to administer resource locks."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].resource_id
                == defender_client.custom_roles[AZURE_SUBSCRIPTION_ID][
                    "test-role-id"
                ].id
            )
            assert result[0].resource_name == role_name

    def test_iam_custom_owner_role_created_with_no_lock_administration_permissions(
        self,
    ):
        defender_client = mock.MagicMock
        role_name = "test-role"
        defender_client.custom_roles = {
            AZURE_SUBSCRIPTION_ID: {
                "test-role-id": Role(
                    id="test-role-id",
                    name=role_name,
                    type="CustomRole",
                    assignable_scopes=["/*"],
                    permissions=[Permission(actions=["*"])],
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks.iam_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks import (
                iam_custom_role_has_permissions_to_administer_resource_locks,
            )

            check = iam_custom_role_has_permissions_to_administer_resource_locks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Role {role_name} from subscription {AZURE_SUBSCRIPTION_ID} has no permission to administer resource locks."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].resource_id
                == defender_client.custom_roles[AZURE_SUBSCRIPTION_ID][
                    "test-role-id"
                ].id
            )
            assert result[0].resource_name == role_name

    def test_iam_custom_owner_roles_created_with_lock_administration_permissions(
        self,
    ):
        defender_client = mock.MagicMock
        role_name = "test-role"
        role_name2 = "test-role2"
        defender_client.custom_roles = {
            AZURE_SUBSCRIPTION_ID: {
                "test-role-id": Role(
                    id="test-role-id",
                    name=role_name,
                    type="CustomRole",
                    assignable_scopes=["/.*", "/test"],
                    permissions=[
                        Permission(
                            actions=[
                                "Microsoft.Authorization/locks/*",
                                "microsoft.aadiam/azureADMetrics/read",
                            ]
                        )
                    ],
                ),
                "test-role-id2": Role(
                    id="test-role-id2",
                    name=role_name2,
                    type="CustomRole",
                    assignable_scopes=["/.*", "/test"],
                    permissions=[
                        Permission(
                            actions=[
                                "Microsoft.Authorization/locks/*",
                                "microsoft.aadiam/azureADMetrics/read",
                            ]
                        )
                    ],
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks.iam_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks import (
                iam_custom_role_has_permissions_to_administer_resource_locks,
            )

            check = iam_custom_role_has_permissions_to_administer_resource_locks()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Role {role_name} from subscription {AZURE_SUBSCRIPTION_ID} has permission to administer resource locks."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].resource_id
                == defender_client.custom_roles[AZURE_SUBSCRIPTION_ID][
                    "test-role-id"
                ].id
            )

    def test_iam_custom_roles_empty_list_but_with_key(self):
        defender_client = mock.MagicMock
        defender_client.custom_roles = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks.iam_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_custom_role_has_permissions_to_administer_resource_locks.iam_custom_role_has_permissions_to_administer_resource_locks import (
                iam_custom_role_has_permissions_to_administer_resource_locks,
            )

            check = iam_custom_role_has_permissions_to_administer_resource_locks()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_role_user_access_admin_restricted_test.py]---
Location: prowler-master/tests/providers/azure/services/iam/iam_role_user_access_admin_restricted/iam_role_user_access_admin_restricted_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.iam.iam_service import Role, RoleAssignment
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_iam_role_user_access_admin_restricted:
    def test_iam_no_role_assignments(self):
        iam_client = mock.MagicMock
        iam_client.role_assignments = {}
        iam_client.roles = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_role_user_access_admin_restricted.iam_role_user_access_admin_restricted.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_role_user_access_admin_restricted.iam_role_user_access_admin_restricted import (
                iam_role_user_access_admin_restricted,
            )

            check = iam_role_user_access_admin_restricted()
            result = check.execute()
            assert len(result) == 0

    def test_iam_user_access_administrator_role_assigned(self):
        iam_client = mock.MagicMock
        role_id = str(uuid4())
        role_assignment_id = str(uuid4())
        agent_id = str(uuid4())
        role_name = "User Access Administrator"

        iam_client.subscriptions = {
            "subscription-name-1": AZURE_SUBSCRIPTION_ID,
        }

        iam_client.role_assignments = {
            "subscription-name-1": {
                role_assignment_id: RoleAssignment(
                    id=role_assignment_id,
                    name="test-assignment",
                    scope=f"/subscriptions/{AZURE_SUBSCRIPTION_ID}",
                    agent_id=agent_id,
                    agent_type="User",
                    role_id=role_id,
                )
            }
        }
        iam_client.roles = {
            "subscription-name-1": {
                f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Authorization/roleDefinitions/{role_id}": Role(
                    id=role_id,
                    name=role_name,
                    type="BuiltInRole",
                    assignable_scopes=[f"/subscriptions/{AZURE_SUBSCRIPTION_ID}"],
                    permissions=[],
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_role_user_access_admin_restricted.iam_role_user_access_admin_restricted.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_role_user_access_admin_restricted.iam_role_user_access_admin_restricted import (
                iam_role_user_access_admin_restricted,
            )

            check = iam_role_user_access_admin_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Role assignment test-assignment in subscription subscription-name-1 grants User Access Administrator role to User {agent_id}."
            )
            assert result[0].subscription == "subscription-name-1"
            assert result[0].resource_id == role_assignment_id

    def test_iam_non_user_access_administrator_role_assigned(self):
        iam_client = mock.MagicMock
        role_id = str(uuid4())
        role_assignment_id = str(uuid4())
        agent_id = str(uuid4())
        role_name = "Reader"

        iam_client.subscriptions = {
            "subscription-name-1": AZURE_SUBSCRIPTION_ID,
        }

        iam_client.role_assignments = {
            "subscription-name-1": {
                role_assignment_id: RoleAssignment(
                    id=role_assignment_id,
                    name="test-assignment",
                    scope=f"/subscriptions/{AZURE_SUBSCRIPTION_ID}",
                    agent_id=agent_id,
                    agent_type="User",
                    role_id=role_id,
                )
            }
        }
        iam_client.roles = {
            "subscription-name-1": {
                f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Authorization/roleDefinitions/{role_id}": Role(
                    id=role_id,
                    name=role_name,
                    type="BuiltInRole",
                    assignable_scopes=[f"/subscriptions/{AZURE_SUBSCRIPTION_ID}"],
                    permissions=[],
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_role_user_access_admin_restricted.iam_role_user_access_admin_restricted.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_role_user_access_admin_restricted.iam_role_user_access_admin_restricted import (
                iam_role_user_access_admin_restricted,
            )

            check = iam_role_user_access_admin_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Role assignment test-assignment in subscription subscription-name-1 does not grant User Access Administrator role."
            )
            assert result[0].subscription == "subscription-name-1"
            assert result[0].resource_id == role_assignment_id
```

--------------------------------------------------------------------------------

---[FILE: iam_subscription_roles_owner_custom_not_created_test.py]---
Location: prowler-master/tests/providers/azure/services/iam/iam_subscription_roles_owner_custom_not_created/iam_subscription_roles_owner_custom_not_created_test.py

```python
from unittest import mock

from azure.mgmt.authorization.v2022_04_01.models import Permission

from prowler.providers.azure.services.iam.iam_service import Role
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_iam_subscription_roles_owner_custom_not_created:
    def test_iam_no_roles(self):
        defender_client = mock.MagicMock
        defender_client.custom_roles = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_subscription_roles_owner_custom_not_created.iam_subscription_roles_owner_custom_not_created.iam_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_subscription_roles_owner_custom_not_created.iam_subscription_roles_owner_custom_not_created import (
                iam_subscription_roles_owner_custom_not_created,
            )

            check = iam_subscription_roles_owner_custom_not_created()
            result = check.execute()
            assert len(result) == 0

    def test_iam_custom_owner_role_created_with_all(self):
        defender_client = mock.MagicMock
        role_name = "test-role"
        defender_client.custom_roles = {
            AZURE_SUBSCRIPTION_ID: {
                "test-role-id": Role(
                    id="test-role-id",
                    name=role_name,
                    type="CustomRole",
                    assignable_scopes=["/*"],
                    permissions=[Permission(actions="*")],
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_subscription_roles_owner_custom_not_created.iam_subscription_roles_owner_custom_not_created.iam_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_subscription_roles_owner_custom_not_created.iam_subscription_roles_owner_custom_not_created import (
                iam_subscription_roles_owner_custom_not_created,
            )

            check = iam_subscription_roles_owner_custom_not_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Role {role_name} from subscription {AZURE_SUBSCRIPTION_ID} is a custom owner role."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].resource_id
                == defender_client.custom_roles[AZURE_SUBSCRIPTION_ID][
                    "test-role-id"
                ].id
            )
            assert result[0].resource_name == role_name

    def test_iam_custom_owner_role_created_with_no_permissions(self):
        defender_client = mock.MagicMock
        role_name = "test-role"
        defender_client.custom_roles = {
            AZURE_SUBSCRIPTION_ID: {
                "test-role-id": Role(
                    id="test-role-id",
                    name=role_name,
                    type="type-role",
                    assignable_scopes=[""],
                    permissions=[Permission()],
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.iam.iam_subscription_roles_owner_custom_not_created.iam_subscription_roles_owner_custom_not_created.iam_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.azure.services.iam.iam_subscription_roles_owner_custom_not_created.iam_subscription_roles_owner_custom_not_created import (
                iam_subscription_roles_owner_custom_not_created,
            )

            check = iam_subscription_roles_owner_custom_not_created()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Role {role_name} from subscription {AZURE_SUBSCRIPTION_ID} is not a custom owner role."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert (
                result[0].resource_id
                == defender_client.custom_roles[AZURE_SUBSCRIPTION_ID][
                    "test-role-id"
                ].id
            )
            assert result[0].resource_name == role_name
```

--------------------------------------------------------------------------------

````
