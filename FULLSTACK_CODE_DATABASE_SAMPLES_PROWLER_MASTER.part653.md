---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 653
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 653 of 867)

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

---[FILE: app_function_identity_without_admin_privileges_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_function_identity_without_admin_privileges/app_function_identity_without_admin_privileges_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.config import USER_ACCESS_ADMINISTRATOR_ROLE_ID
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_function_identity_without_admin_privileges:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges import (
                app_function_identity_without_admin_privileges,
            )

            app_client.functions = {}

            check = app_function_identity_without_admin_privileges()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscription_empty(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges import (
                app_function_identity_without_admin_privileges,
            )

            app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

            check = app_function_identity_without_admin_privileges()
            result = check.execute()
            assert len(result) == 0

    def test_app_function_no_identity(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges import (
                app_function_identity_without_admin_privileges,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp

            function_id = str(uuid4())

            app_client.functions = {
                AZURE_SUBSCRIPTION_ID: {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={},
                        identity=None,
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_identity_without_admin_privileges()
            result = check.execute()
            assert len(result) == 0

    def test_app_function_no_admin_roles(self):
        app_client = mock.MagicMock
        iam_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges.app_client",
                new=app_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges import (
                app_function_identity_without_admin_privileges,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp
            from prowler.providers.azure.services.iam.iam_service import (
                Role,
                RoleAssignment,
            )

            function_id = str(uuid4())

            app_client.functions = {
                AZURE_SUBSCRIPTION_ID: {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={},
                        identity=mock.MagicMock(principal_id="123"),
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            iam_client.role_assignments = {
                AZURE_SUBSCRIPTION_ID: {
                    "role-assignment-id-1": RoleAssignment(
                        id="role-assignment-id-1",
                        name="role-assignment-name-1",
                        scope="/subscriptions/{}/resourceGroups/rg/providers/Microsoft.Web/sites/function1".format(
                            AZURE_SUBSCRIPTION_ID
                        ),
                        agent_id="123",
                        agent_type="User",
                        role_id="role-id-1",
                    )
                }
            }

            iam_client.roles = {
                AZURE_SUBSCRIPTION_ID: {
                    "role-id-1": Role(
                        id="role-id-1",
                        name="role1",
                        type="BuiltInRole",
                        assignable_scopes=[],
                        permissions=[],
                    )
                }
            }

            check = app_function_identity_without_admin_privileges()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Function function1 has a managed identity enabled but without admin privileges."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_function_admin_roles(self):
        app_client = mock.MagicMock
        iam_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges.app_client",
                new=app_client,
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges.iam_client",
                new=iam_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_without_admin_privileges.app_function_identity_without_admin_privileges import (
                app_function_identity_without_admin_privileges,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp
            from prowler.providers.azure.services.iam.iam_service import (
                Role,
                RoleAssignment,
            )

            function_id = str(uuid4())
            function_scope = f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/resourceGroups/rg/providers/Microsoft.Web/sites/function1"
            app_client.functions = {
                "subscription-name-1": {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={},
                        identity=mock.MagicMock(principal_id="123"),
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            iam_client.subscriptions = {
                "subscription-name-1": AZURE_SUBSCRIPTION_ID,
            }

            iam_client.role_assignments = {
                "subscription-name-1": {
                    "role-assignment-id-2": RoleAssignment(
                        id="role-assignment-id-2",
                        name="role-assignment-name-2",
                        scope=function_scope,
                        agent_id="123",
                        agent_type="User",
                        role_id=USER_ACCESS_ADMINISTRATOR_ROLE_ID,
                    )
                }
            }

            iam_client.roles = {
                "subscription-name-1": {
                    f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Authorization/roleDefinitions/{USER_ACCESS_ADMINISTRATOR_ROLE_ID}": Role(
                        id=f"/subscriptions/{AZURE_SUBSCRIPTION_ID}/providers/Microsoft.Authorization/roleDefinitions/{USER_ACCESS_ADMINISTRATOR_ROLE_ID}",
                        name="User Access Administrator",
                        type="BuiltInRole",
                        assignable_scopes=[],
                        permissions=[],
                    ),
                }
            }

            check = app_function_identity_without_admin_privileges()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 has a managed identity enabled and it is configure with admin privileges using role User Access Administrator."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == "subscription-name-1"
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_function_latest_runtime_version_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_function_latest_runtime_version/app_function_latest_runtime_version_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_function_latest_runtime_version:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_latest_runtime_version.app_function_latest_runtime_version.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_latest_runtime_version.app_function_latest_runtime_version import (
                app_function_latest_runtime_version,
            )

            app_client.functions = {}

            check = app_function_latest_runtime_version()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscription_empty(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_latest_runtime_version.app_function_latest_runtime_version.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_latest_runtime_version.app_function_latest_runtime_version import (
                app_function_latest_runtime_version,
            )

            app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

            check = app_function_latest_runtime_version()
            result = check.execute()
            assert len(result) == 0

    def test_app_function_runtime_is_latest(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_latest_runtime_version.app_function_latest_runtime_version.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_latest_runtime_version.app_function_latest_runtime_version import (
                app_function_latest_runtime_version,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp

            function_id = str(uuid4())

            app_client.functions = {
                AZURE_SUBSCRIPTION_ID: {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={"FUNCTIONS_EXTENSION_VERSION": "~4"},
                        identity=None,
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_latest_runtime_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "Function function1 is using the latest runtime."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_function_runtime_is_not_latest(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_latest_runtime_version.app_function_latest_runtime_version.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_latest_runtime_version.app_function_latest_runtime_version import (
                app_function_latest_runtime_version,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp

            function_id = str(uuid4())

            app_client.functions = {
                AZURE_SUBSCRIPTION_ID: {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={"FUNCTIONS_EXTENSION_VERSION": "2"},
                        identity=None,
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_latest_runtime_version()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "Function function1 is not using the latest runtime. The current runtime is '2' and should be '~4'."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_function_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_function_not_publicly_accessible/app_function_not_publicly_accessible_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_function_not_publicly_accessible:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_not_publicly_accessible.app_function_not_publicly_accessible.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_not_publicly_accessible.app_function_not_publicly_accessible import (
                app_function_not_publicly_accessible,
            )

            app_client.functions = {}

            check = app_function_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscription_empty(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_not_publicly_accessible.app_function_not_publicly_accessible.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_not_publicly_accessible.app_function_not_publicly_accessible import (
                app_function_not_publicly_accessible,
            )

            app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

            check = app_function_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_app_function_not_publicly_accessible(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_not_publicly_accessible.app_function_not_publicly_accessible.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_not_publicly_accessible.app_function_not_publicly_accessible import (
                app_function_not_publicly_accessible,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp

            function_id = str(uuid4())

            app_client.functions = {
                AZURE_SUBSCRIPTION_ID: {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={},
                        identity=mock.MagicMock(type="SystemAssigned"),
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Function function1 is not publicly accessible."
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_function_publicly_accessible(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_not_publicly_accessible.app_function_not_publicly_accessible.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_not_publicly_accessible.app_function_not_publicly_accessible import (
                app_function_not_publicly_accessible,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp

            function_id = str(uuid4())

            app_client.functions = {
                AZURE_SUBSCRIPTION_ID: {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={},
                        identity=mock.MagicMock(type="SystemAssigned"),
                        public_access=True,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 is publicly accessible."
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_function_vnet_integration_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_function_vnet_integration_enabled/app_function_vnet_integration_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_function_vnet_integration_enabled:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_vnet_integration_enabled.app_function_vnet_integration_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_vnet_integration_enabled.app_function_vnet_integration_enabled import (
                app_function_vnet_integration_enabled,
            )

            app_client.functions = {}

            check = app_function_vnet_integration_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscription_empty(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_vnet_integration_enabled.app_function_vnet_integration_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_vnet_integration_enabled.app_function_vnet_integration_enabled import (
                app_function_vnet_integration_enabled,
            )

            app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

            check = app_function_vnet_integration_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_app_function_vnet_integration_enabled(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_vnet_integration_enabled.app_function_vnet_integration_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_vnet_integration_enabled.app_function_vnet_integration_enabled import (
                app_function_vnet_integration_enabled,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp

            function_id = str(uuid4())

            app_client.functions = {
                AZURE_SUBSCRIPTION_ID: {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={},
                        identity=None,
                        public_access=True,
                        vnet_subnet_id="vnet_subnet_id",
                        ftps_state="FtpsOnly",
                    )
                }
            }

            check = app_function_vnet_integration_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Function function1 has Virtual Network integration enabled with subnet 'vnet_subnet_id' enabled."
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].location == "West Europe"

    def test_app_function_vnet_integration_disabled(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_vnet_integration_enabled.app_function_vnet_integration_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_vnet_integration_enabled.app_function_vnet_integration_enabled import (
                app_function_vnet_integration_enabled,
            )
            from prowler.providers.azure.services.app.app_service import FunctionApp

            function_id = str(uuid4())

            app_client.functions = {
                AZURE_SUBSCRIPTION_ID: {
                    function_id: FunctionApp(
                        id=function_id,
                        name="function1",
                        location="West Europe",
                        kind="functionapp,linux",
                        function_keys={},
                        enviroment_variables={},
                        identity=None,
                        public_access=True,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_vnet_integration_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 does not have virtual network integration enabled."
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

````
