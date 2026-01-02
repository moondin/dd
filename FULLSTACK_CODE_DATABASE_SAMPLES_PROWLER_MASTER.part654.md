---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 654
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 654 of 867)

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

---[FILE: app_http_logs_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_http_logs_enabled/app_http_logs_enabled_test.py

```python
from unittest import mock

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_http_logs_enabled:

    def test_app_http_logs_enabled_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled.app_client",
                new=app_client,
            ),
        ):

            from prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled import (
                app_http_logs_enabled,
            )

            check = app_http_logs_enabled()
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
                "prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity import (
                app_register_with_identity,
            )

            check = app_register_with_identity()
            result = check.execute()
            assert len(result) == 0

    def test_no_diagnostics_settings(self):
        app_client = mock.MagicMock()
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled import (
                app_http_logs_enabled,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    "resource_id": WebApp(
                        resource_id="resource_id",
                        name="app1",
                        auth_enabled=True,
                        configurations=None,
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        kind="webapps",
                        location="West Europe",
                    )
                }
            }

            check = app_http_logs_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].resource_name == "app1"
            assert result[0].resource_id == "resource_id"
            assert (
                result[0].status_extended
                == f"App app1 does not have a diagnostic setting in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID

    def test_diagnostic_setting_configured(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled import (
                app_http_logs_enabled,
            )
            from prowler.providers.azure.services.app.app_service import WebApp
            from prowler.providers.azure.services.monitor.monitor_service import (
                DiagnosticSetting,
            )

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    "resource_id1": WebApp(
                        resource_id="resource_id1",
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=None,
                        client_cert_mode="Ignore",
                        https_only=False,
                        kind="functionapp",
                        identity=mock.MagicMock,
                        location="West Europe",
                        monitor_diagnostic_settings=[
                            DiagnosticSetting(
                                id="id1/id1",
                                logs=[
                                    mock.MagicMock(
                                        category="AppServiceHTTPLogs",
                                        category_group=None,
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceConsoleLogs",
                                        category_group=None,
                                        enabled=False,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceAppLogs",
                                        category_group=None,
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceAuditLogs",
                                        category_group=None,
                                        enabled=False,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceIPSecAuditLogs",
                                        category_group=None,
                                        enabled=False,
                                    ),
                                    mock.MagicMock(
                                        category="AppServicePlatformLogs",
                                        category_group=None,
                                        enabled=False,
                                    ),
                                ],
                                storage_account_name="storage_account_name1",
                                storage_account_id="storage_account_id1",
                                name="name_diagnostic_setting1",
                            ),
                        ],
                    ),
                    "resource_id2": WebApp(
                        resource_id="resource_id2",
                        name="app_id-2",
                        auth_enabled=True,
                        configurations=None,
                        client_cert_mode="Ignore",
                        https_only=False,
                        kind="WebApp",
                        identity=mock.MagicMock,
                        location="West Europe",
                        monitor_diagnostic_settings=[
                            DiagnosticSetting(
                                id="id2/id2",
                                logs=[
                                    mock.MagicMock(
                                        category="AppServiceHTTPLogs",
                                        category_group=None,
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceConsoleLogs",
                                        category_group=None,
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceAppLogs",
                                        category_group=None,
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceAuditLogs",
                                        category_group=None,
                                        enabled=False,
                                    ),
                                    mock.MagicMock(
                                        category="AppServiceIPSecAuditLogs",
                                        category_group=None,
                                        enabled=True,
                                    ),
                                    mock.MagicMock(
                                        category="AppServicePlatformLogs",
                                        category_group=None,
                                        enabled=False,
                                    ),
                                ],
                                storage_account_name="storage_account_name2",
                                storage_account_id="storage_account_id2",
                                name="name_diagnostic_setting2",
                            ),
                        ],
                    ),
                }
            }
            check = app_http_logs_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "app_id-2"
            assert result[0].resource_id == "resource_id2"
            assert (
                result[0].status_extended
                == f"App app_id-2 has HTTP Logs enabled in diagnostic setting name_diagnostic_setting2 in subscription {AZURE_SUBSCRIPTION_ID}"
            )

    def test_diagnostic_setting_with_all_logs_category_group(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled import (
                app_http_logs_enabled,
            )
            from prowler.providers.azure.services.app.app_service import WebApp
            from prowler.providers.azure.services.monitor.monitor_service import (
                DiagnosticSetting,
            )

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    "resource_id3": WebApp(
                        resource_id="resource_id3",
                        name="app_id-3",
                        auth_enabled=True,
                        configurations=None,
                        client_cert_mode="Ignore",
                        https_only=False,
                        kind="WebApp",
                        identity=mock.MagicMock,
                        location="West Europe",
                        monitor_diagnostic_settings=[
                            DiagnosticSetting(
                                id="id3/id3",
                                logs=[
                                    mock.MagicMock(
                                        category=None,
                                        category_group="allLogs",
                                        enabled=True,
                                    ),
                                ],
                                storage_account_name="storage_account_name3",
                                storage_account_id="storage_account_id3",
                                name="name_diagnostic_setting3",
                            ),
                        ],
                    ),
                }
            }
            check = app_http_logs_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "app_id-3"
            assert result[0].resource_id == "resource_id3"
            assert (
                result[0].status_extended
                == f"App app_id-3 has allLogs category group which includes HTTP Logs enabled in diagnostic setting name_diagnostic_setting3 in subscription {AZURE_SUBSCRIPTION_ID}"
            )

    def test_diagnostic_setting_with_all_logs_category_group_disabled(self):
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_http_logs_enabled.app_http_logs_enabled import (
                app_http_logs_enabled,
            )
            from prowler.providers.azure.services.app.app_service import WebApp
            from prowler.providers.azure.services.monitor.monitor_service import (
                DiagnosticSetting,
            )

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    "resource_id4": WebApp(
                        resource_id="resource_id4",
                        name="app_id-4",
                        auth_enabled=True,
                        configurations=None,
                        client_cert_mode="Ignore",
                        https_only=False,
                        kind="WebApp",
                        identity=mock.MagicMock,
                        location="West Europe",
                        monitor_diagnostic_settings=[
                            DiagnosticSetting(
                                id="id4/id4",
                                logs=[
                                    mock.MagicMock(
                                        category=None,
                                        category_group="allLogs",
                                        enabled=False,  # Disabled
                                    ),
                                ],
                                storage_account_name="storage_account_name4",
                                storage_account_id="storage_account_id4",
                                name="name_diagnostic_setting4",
                            ),
                        ],
                    ),
                }
            }
            check = app_http_logs_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "app_id-4"
            assert result[0].resource_id == "resource_id4"
            assert (
                result[0].status_extended
                == f"App app_id-4 does not have HTTP Logs enabled in diagnostic setting name_diagnostic_setting4 in subscription {AZURE_SUBSCRIPTION_ID}"
            )
```

--------------------------------------------------------------------------------

---[FILE: app_minimum_tls_version_12_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_minimum_tls_version_12/app_minimum_tls_version_12_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_minimum_tls_version_12:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12 import (
                app_minimum_tls_version_12,
            )

            check = app_minimum_tls_version_12()
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
                "prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12 import (
                app_minimum_tls_version_12,
            )

            check = app_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 0

    def test_app_none_configurations(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12 import (
                app_minimum_tls_version_12,
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
            check = app_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Minimum TLS version is not set to 1.2 for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_min_tls_version_12(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12 import (
                app_minimum_tls_version_12,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(min_tls_version="1.2"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Minimum TLS version is set to 1.2 for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_min_tls_version_10(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12 import (
                app_minimum_tls_version_12,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=False,
                        configurations=mock.MagicMock(min_tls_version="1.0"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Minimum TLS version is not set to 1.2 for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_min_tls_version_13(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_minimum_tls_version_12.app_minimum_tls_version_12 import (
                app_minimum_tls_version_12,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=False,
                        configurations=mock.MagicMock(min_tls_version="1.3"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Minimum TLS version is set to 1.3 for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_register_with_identity_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_register_with_identity/app_register_with_identity_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_register_with_identity:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity import (
                app_register_with_identity,
            )

            check = app_register_with_identity()
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
                "prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity import (
                app_register_with_identity,
            )

            check = app_register_with_identity()
            result = check.execute()
            assert len(result) == 0

    def test_app_none_configurations(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity import (
                app_register_with_identity,
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
            check = app_register_with_identity()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"App 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}' does not have an identity configured."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_identity(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_register_with_identity.app_register_with_identity import (
                app_register_with_identity,
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
                        identity=mock.MagicMock,
                        location="West Europe",
                    )
                }
            }
            check = app_register_with_identity()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"App 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}' has an identity configured."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: appinsights_service_test.py]---
Location: prowler-master/tests/providers/azure/services/appinsights/appinsights_service_test.py

```python
from unittest.mock import patch

from prowler.providers.azure.services.appinsights.appinsights_service import (
    AppInsights,
    Component,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_appinsights_get_components(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "app_id-1": Component(
                resource_id="/subscriptions/resource_id",
                resource_name="AppInsightsTest",
                location="westeurope",
                instrumentation_key="",
            )
        }
    }


@patch(
    "prowler.providers.azure.services.appinsights.appinsights_service.AppInsights._get_components",
    new=mock_appinsights_get_components,
)
class Test_AppInsights_Service:
    def test_get_client(self):
        app_insights = AppInsights(set_mocked_azure_provider())
        assert (
            app_insights.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "ApplicationInsightsManagementClient"
        )

    def test__get_subscriptions__(self):
        app_insights = AppInsights(set_mocked_azure_provider())
        assert app_insights.subscriptions.__class__.__name__ == "dict"

    def test_get_components(self):
        appinsights = AppInsights(set_mocked_azure_provider())
        assert len(appinsights.components) == 1
        assert (
            appinsights.components[AZURE_SUBSCRIPTION_ID]["app_id-1"].resource_id
            == "/subscriptions/resource_id"
        )
        assert (
            appinsights.components[AZURE_SUBSCRIPTION_ID]["app_id-1"].resource_name
            == "AppInsightsTest"
        )
        assert (
            appinsights.components[AZURE_SUBSCRIPTION_ID]["app_id-1"].location
            == "westeurope"
        )
```

--------------------------------------------------------------------------------

---[FILE: appinsights_ensure_is_configured_test.py]---
Location: prowler-master/tests/providers/azure/services/appinsights/appinsights_ensure_is_configured/appinsights_ensure_is_configured_test.py

```python
from unittest import mock

from prowler.providers.azure.services.appinsights.appinsights_service import Component
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_appinsights_ensure_is_configured:
    def test_appinsights_no_subscriptions(self):
        appinsights_client = mock.MagicMock
        appinsights_client.components = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.appinsights.appinsights_ensure_is_configured.appinsights_ensure_is_configured.appinsights_client",
                new=appinsights_client,
            ),
        ):
            from prowler.providers.azure.services.appinsights.appinsights_ensure_is_configured.appinsights_ensure_is_configured import (
                appinsights_ensure_is_configured,
            )

            check = appinsights_ensure_is_configured()
            result = check.execute()
            assert len(result) == 0

    def test_no_appinsights(self):
        appinsights_client = mock.MagicMock
        appinsights_client.components = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.appinsights.appinsights_ensure_is_configured.appinsights_ensure_is_configured.appinsights_client",
                new=appinsights_client,
            ),
        ):
            from prowler.providers.azure.services.appinsights.appinsights_ensure_is_configured.appinsights_ensure_is_configured import (
                appinsights_ensure_is_configured,
            )

            check = appinsights_ensure_is_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "FAIL"
            assert result[0].resource_id == "AppInsights"
            assert result[0].resource_name == "AppInsights"
            assert result[0].location == "global"
            assert (
                result[0].status_extended
                == f"There are no AppInsight configured in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_appinsights_configured(self):
        appinsights_client = mock.MagicMock
        appinsights_client.components = {
            AZURE_SUBSCRIPTION_ID: {
                "app_id-1": Component(
                    resource_id="/subscriptions/resource_id",
                    resource_name="AppInsightsTest",
                    location="westeurope",
                    instrumentation_key="",
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.appinsights.appinsights_ensure_is_configured.appinsights_ensure_is_configured.appinsights_client",
                new=appinsights_client,
            ),
        ):
            from prowler.providers.azure.services.appinsights.appinsights_ensure_is_configured.appinsights_ensure_is_configured import (
                appinsights_ensure_is_configured,
            )

            check = appinsights_ensure_is_configured()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "PASS"
            assert result[0].resource_id == "AppInsights"
            assert result[0].resource_name == "AppInsights"
            assert result[0].location == "global"
            assert (
                result[0].status_extended
                == f"There is at least one AppInsight configured in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

````
