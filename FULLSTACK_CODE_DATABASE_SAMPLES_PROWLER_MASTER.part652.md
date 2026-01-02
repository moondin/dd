---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 652
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 652 of 867)

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

---[FILE: app_ftp_deployment_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_ftp_deployment_disabled/app_ftp_deployment_disabled_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_ftp_deployment_disabled:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled import (
                app_ftp_deployment_disabled,
            )

            check = app_ftp_deployment_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscriptions_empty(self):
        app_client = mock.MagicMock
        app_client.apps = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled import (
                app_ftp_deployment_disabled,
            )

            check = app_ftp_deployment_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_app_configurations_none(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled import (
                app_ftp_deployment_disabled,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=None,
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ftp_deployment_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FTP is enabled for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_ftp_deployment_disabled(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled import (
                app_ftp_deployment_disabled,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(ftps_state="AllAllowed"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ftp_deployment_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FTP is enabled for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_ftp_deploy_enabled(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ftp_deployment_disabled.app_ftp_deployment_disabled import (
                app_ftp_deployment_disabled,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(ftps_state="Disabled"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ftp_deployment_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"FTP is disabled for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_function_access_keys_configured_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_function_access_keys_configured/app_function_access_keys_configured_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_function_access_keys_configured:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_access_keys_configured.app_function_access_keys_configured.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_access_keys_configured.app_function_access_keys_configured import (
                app_function_access_keys_configured,
            )

            app_client.functions = {}

            check = app_function_access_keys_configured()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscription_empty(self):
        app_client = mock.MagicMock
        app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_access_keys_configured.app_function_access_keys_configured.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_access_keys_configured.app_function_access_keys_configured import (
                app_function_access_keys_configured,
            )

            check = app_function_access_keys_configured()
            result = check.execute()
            assert len(result) == 0

    def test_app_function_no_keys(self):
        app_client = mock.MagicMock
        app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_access_keys_configured.app_function_access_keys_configured.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_access_keys_configured.app_function_access_keys_configured import (
                app_function_access_keys_configured,
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

            check = app_function_access_keys_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 does not have function keys configured."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_function_using_functions_keys(self):
        app_client = mock.MagicMock
        app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_access_keys_configured.app_function_access_keys_configured.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_access_keys_configured.app_function_access_keys_configured import (
                app_function_access_keys_configured,
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
                        function_keys={
                            "default": "key1",
                            "key2": "key2",
                        },
                        enviroment_variables={},
                        identity=None,
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_access_keys_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Function function1 has function keys configured."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_function_application_insights_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_function_application_insights_enabled/app_function_application_insights_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_function_application_insights_enabled:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled import (
                app_function_application_insights_enabled,
            )

            app_client.functions = {}

            check = app_function_application_insights_enabled()
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
                "prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled import (
                app_function_application_insights_enabled,
            )

            app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

            check = app_function_application_insights_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_app_function_no_app_insights(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled import (
                app_function_application_insights_enabled,
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

            check = app_function_application_insights_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 is not using Application Insights."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_function_using_app_insights(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled import (
                app_function_application_insights_enabled,
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
                        enviroment_variables={"APPINSIGHTS_INSTRUMENTATIONKEY": "1234"},
                        identity=None,
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_application_insights_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Function function1 is using Application Insights."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_function_using_app_insights_different_key(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled import (
                app_function_application_insights_enabled,
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
                        enviroment_variables={"APPINSIGHTS_INSTRUMENTATIONKEY": "1234"},
                        identity=None,
                        public_access=False,
                        vnet_subnet_id=None,
                        ftps_state="AllAllowed",
                    )
                }
            }

            check = app_function_application_insights_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Function function1 is using Application Insights."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_function_with_app_insights_no_key(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_application_insights_enabled.app_function_application_insights_enabled import (
                app_function_application_insights_enabled,
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

            check = app_function_application_insights_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 is not using Application Insights."
            )
            assert result[0].resource_id == function_id
            assert result[0].resource_name == "function1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_function_ftps_deployment_disabled_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_function_ftps_deployment_disabled/app_function_ftps_deployment_disabled_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_function_ftps_deployment_disabled:
    def test_no_subscriptions(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled import (
                app_function_ftps_deployment_disabled,
            )

            app_client.functions = {}

            check = app_function_ftps_deployment_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_subscription_empty(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled import (
                app_function_ftps_deployment_disabled,
            )

            app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

            check = app_function_ftps_deployment_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_function_ftp_deployment_enabled(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled import (
                app_function_ftps_deployment_disabled,
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

            check = app_function_ftps_deployment_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 has FTP deployment enabled"
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].location == "West Europe"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_function_ftps_deployment_enabled(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled import (
                app_function_ftps_deployment_disabled,
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
                        ftps_state="FtpsOnly",
                    )
                }
            }

            check = app_function_ftps_deployment_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 has FTPS deployment enabled"
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].location == "West Europe"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_function_ftp_and_ftps_deployment_disabled(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_ftps_deployment_disabled.app_function_ftps_deployment_disabled import (
                app_function_ftps_deployment_disabled,
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
                        ftps_state="Disabled",
                    )
                }
            }

            check = app_function_ftps_deployment_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Function function1 has FTP and FTPS deployment disabled"
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].location == "West Europe"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
```

--------------------------------------------------------------------------------

---[FILE: app_function_identity_is_configured_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_function_identity_is_configured/app_function_identity_is_configured_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_function_identity_is_configured:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_is_configured.app_function_identity_is_configured.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_is_configured.app_function_identity_is_configured import (
                app_function_identity_is_configured,
            )

            app_client.functions = {}

            check = app_function_identity_is_configured()
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
                "prowler.providers.azure.services.app.app_function_identity_is_configured.app_function_identity_is_configured.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_is_configured.app_function_identity_is_configured import (
                app_function_identity_is_configured,
            )

            app_client.functions = {AZURE_SUBSCRIPTION_ID: {}}

            check = app_function_identity_is_configured()
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
                "prowler.providers.azure.services.app.app_function_identity_is_configured.app_function_identity_is_configured.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_is_configured.app_function_identity_is_configured import (
                app_function_identity_is_configured,
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

            check = app_function_identity_is_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Function function1 does not have a managed identity enabled."
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_function_identity_configured(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_function_identity_is_configured.app_function_identity_is_configured.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_function_identity_is_configured.app_function_identity_is_configured import (
                app_function_identity_is_configured,
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

            check = app_function_identity_is_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Function function1 has a SystemAssigned identity enabled."
            )
            assert result[0].resource_name == "function1"
            assert result[0].resource_id == function_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

````
