---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 650
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 650 of 867)

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

---[FILE: app_service_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_service_test.py

```python
from unittest import mock
from unittest.mock import MagicMock, patch

from azure.mgmt.web.models import ManagedServiceIdentity, SiteConfigResource

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)

# TODO: we have to fix this test not to use MagicMock but set the App service while mocking the import of the Monitor client
# def mock_app_get_apps(_):
#     return {
#         AZURE_SUBSCRIPTION_ID: {
#             "/subscriptions/resource_id": WebApp(
#                 resource_id="/subscriptions/resource_id",
#                 configurations=SiteConfigResource(),
#                 identity=ManagedServiceIdentity(type="SystemAssigned"),
#                 auth_enabled=True,
#                 client_cert_mode="Required",
#                 https_only=True,
#                 monitor_diagnostic_settings=[
#                     DiagnosticSetting(
#                         id="id2/id2",
#                         logs=[
#                             mock.MagicMock(
#                                 category="AppServiceHTTPLogs",
#                                 enabled=False,
#                             ),
#                             mock.MagicMock(
#                                 category="AppServiceConsoleLogs",
#                                 enabled=True,
#                             ),
#                             mock.MagicMock(
#                                 category="AppServiceAppLogs",
#                                 enabled=True,
#                             ),
#                             mock.MagicMock(
#                                 category="AppServiceAuditLogs",
#                                 enabled=False,
#                             ),
#                             mock.MagicMock(
#                                 category="AppServiceIPSecAuditLogs",
#                                 enabled=True,
#                             ),
#                             mock.MagicMock(
#                                 category="AppServicePlatformLogs",
#                                 enabled=False,
#                             ),
#                         ],
#                         storage_account_name="storage_account_name2",
#                         storage_account_id="storage_account_id2",
#                         name="name_diagnostic_setting2",
#                     ),
#                 ],
#             )
#         }
#     }


# @patch(
#     "prowler.providers.azure.services.app.app_service.App._get_apps",
#     new=mock_app_get_apps,
# )
class Test_App_Service:
    def test_app_service_(self):
        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            patch(
                "prowler.providers.azure.services.monitor.monitor_service.Monitor",
                new=MagicMock(),
            ),
        ):
            from prowler.providers.azure.services.app.app_service import WebApp
            from prowler.providers.azure.services.monitor.monitor_service import (
                DiagnosticSetting,
            )

            app_service = MagicMock()
            app_service.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    "/subscriptions/resource_id": WebApp(
                        resource_id="/subscriptions/resource_id",
                        name="app_id-1",
                        configurations=SiteConfigResource(),
                        identity=ManagedServiceIdentity(type="SystemAssigned"),
                        auth_enabled=True,
                        client_cert_mode="Required",
                        https_only=True,
                        location="West Europe",
                        monitor_diagnostic_settings=[
                            DiagnosticSetting(
                                id="id2/id2",
                                logs=[
                                    mock.MagicMock(
                                        category="AppServiceHTTPLogs",
                                        enabled=False,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceConsoleLogs",
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceAppLogs",
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceAuditLogs",
                                        enabled=False,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceIPSecAuditLogs",
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServicePlatformLogs",
                                        enabled=False,
                                    ),
                                ],
                                storage_account_name="storage_account_name2",
                                storage_account_id="storage_account_id2",
                                name="name_diagnostic_setting2",
                            ),
                        ],
                    )
                }
            }
        # assert (
        #     app_service.clients[AZURE_SUBSCRIPTION_ID][0].__class__.__name__
        #     == "WebSiteManagementClient"
        # )
        assert len(app_service.apps) == 1
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].resource_id
            == "/subscriptions/resource_id"
        )
        assert app_service.apps[AZURE_SUBSCRIPTION_ID][
            "/subscriptions/resource_id"
        ].auth_enabled
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].client_cert_mode
            == "Required"
        )
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].location
            == "West Europe"
        )
        assert app_service.apps[AZURE_SUBSCRIPTION_ID][
            "/subscriptions/resource_id"
        ].https_only
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].identity.type
            == "SystemAssigned"
        )
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].configurations.__class__.__name__
            == "SiteConfigResource"
        )
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID]["/subscriptions/resource_id"]
            .monitor_diagnostic_settings[0]
            .id
            == "id2/id2"
        )
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID]["/subscriptions/resource_id"]
            .monitor_diagnostic_settings[0]
            .logs[0]
            .category
            == "AppServiceHTTPLogs"
        )
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID]["/subscriptions/resource_id"]
            .monitor_diagnostic_settings[0]
            .storage_account_name
            == "storage_account_name2"
        )
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID]["/subscriptions/resource_id"]
            .monitor_diagnostic_settings[0]
            .storage_account_id
            == "storage_account_id2"
        )
        assert (
            app_service.apps[AZURE_SUBSCRIPTION_ID]["/subscriptions/resource_id"]
            .monitor_diagnostic_settings[0]
            .name
            == "name_diagnostic_setting2"
        )

    def test_app_service_get_functions(self):
        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            patch(
                "prowler.providers.azure.services.monitor.monitor_service.Monitor",
                new=MagicMock(),
            ),
        ):
            from prowler.providers.azure.services.app.app_service import FunctionApp

            mock_function = FunctionApp(
                id="/subscriptions/resource_id",
                name="functionapp-1",
                location="West Europe",
                kind="functionapp",
                function_keys=None,
                enviroment_variables=None,
                identity=ManagedServiceIdentity(type="SystemAssigned"),
                public_access=True,
                vnet_subnet_id="",
                ftps_state="FtpsOnly",
            )

            app_service = MagicMock()
            app_service.functions = {
                "mock-subscription": {"/subscriptions/resource_id": mock_function}
            }

            assert (
                app_service.functions["mock-subscription"][
                    "/subscriptions/resource_id"
                ].ftps_state
                == "FtpsOnly"
            )
            assert (
                app_service.functions["mock-subscription"][
                    "/subscriptions/resource_id"
                ].name
                == "functionapp-1"
            )
```

--------------------------------------------------------------------------------

---[FILE: app_client_certificates_on_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_client_certificates_on/app_client_certificates_on_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_client_certificates_on:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_client_certificates_on.app_client_certificates_on.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_client_certificates_on.app_client_certificates_on import (
                app_client_certificates_on,
            )

            check = app_client_certificates_on()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscription_empty(self):
        app_client = mock.MagicMock
        app_client.apps = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_client_certificates_on.app_client_certificates_on.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_client_certificates_on.app_client_certificates_on import (
                app_client_certificates_on,
            )

            check = app_client_certificates_on()
            result = check.execute()
            assert len(result) == 0

    def test_app_client_certificates_on(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_client_certificates_on.app_client_certificates_on.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_client_certificates_on.app_client_certificates_on import (
                app_client_certificates_on,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=None,
                        client_cert_mode="Required",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_client_certificates_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Clients are required to present a certificate for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_client_certificates_off(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_client_certificates_on.app_client_certificates_on.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_client_certificates_on.app_client_certificates_on import (
                app_client_certificates_on,
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
            check = app_client_certificates_on()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Clients are not required to present a certificate for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_auth_is_set_up_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_ensure_auth_is_set_up/app_ensure_auth_is_set_up_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_ensure_auth_is_set_up:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_auth_is_set_up.app_ensure_auth_is_set_up.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_auth_is_set_up.app_ensure_auth_is_set_up import (
                app_ensure_auth_is_set_up,
            )

            check = app_ensure_auth_is_set_up()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscription_empty(self):
        app_client = mock.MagicMock
        app_client.apps = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_auth_is_set_up.app_ensure_auth_is_set_up.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_auth_is_set_up.app_ensure_auth_is_set_up import (
                app_ensure_auth_is_set_up,
            )

            check = app_ensure_auth_is_set_up()
            result = check.execute()
            assert len(result) == 0

    def test_app_auth_enabled(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_auth_is_set_up.app_ensure_auth_is_set_up.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_auth_is_set_up.app_ensure_auth_is_set_up import (
                app_ensure_auth_is_set_up,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_auth_is_set_up()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Authentication is set up for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_name == "app_id-1"
            assert result[0].resource_id == resource_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_auth_disabled(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_auth_is_set_up.app_ensure_auth_is_set_up.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_auth_is_set_up.app_ensure_auth_is_set_up import (
                app_ensure_auth_is_set_up,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=False,
                        configurations=mock.MagicMock(),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_auth_is_set_up()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Authentication is not set up for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_name == "app_id-1"
            assert result[0].resource_id == resource_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_http_is_redirected_to_https_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_ensure_http_is_redirected_to_https/app_ensure_http_is_redirected_to_https_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_ensure_http_is_redirected_to_https:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_http_is_redirected_to_https.app_ensure_http_is_redirected_to_https.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_http_is_redirected_to_https.app_ensure_http_is_redirected_to_https import (
                app_ensure_http_is_redirected_to_https,
            )

            check = app_ensure_http_is_redirected_to_https()
            result = check.execute()
            assert len(result) == 0

    def test_app_subscriptions_empty_empty(self):
        app_client = mock.MagicMock
        app_client.apps = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_http_is_redirected_to_https.app_ensure_http_is_redirected_to_https.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_http_is_redirected_to_https.app_ensure_http_is_redirected_to_https import (
                app_ensure_http_is_redirected_to_https,
            )

            check = app_ensure_http_is_redirected_to_https()
            result = check.execute()
            assert len(result) == 0

    def test_app_http_to_https(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_http_is_redirected_to_https.app_ensure_http_is_redirected_to_https.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_http_is_redirected_to_https.app_ensure_http_is_redirected_to_https import (
                app_ensure_http_is_redirected_to_https,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_http_is_redirected_to_https()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"HTTP is not redirected to HTTPS for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_name == "app_id-1"
            assert result[0].resource_id == resource_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_http_to_https_enabled(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_http_is_redirected_to_https.app_ensure_http_is_redirected_to_https.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_http_is_redirected_to_https.app_ensure_http_is_redirected_to_https import (
                app_ensure_http_is_redirected_to_https,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(),
                        client_cert_mode="Ignore",
                        https_only=True,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_http_is_redirected_to_https()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"HTTP is redirected to HTTPS for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_name == "app_id-1"
            assert result[0].resource_id == resource_id
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

````
