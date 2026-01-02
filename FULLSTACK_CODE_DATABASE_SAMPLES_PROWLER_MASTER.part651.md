---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 651
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 651 of 867)

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

---[FILE: app_ensure_java_version_is_latest_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_ensure_java_version_is_latest/app_ensure_java_version_is_latest_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_ensure_java_version_is_latest:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest import (
                app_ensure_java_version_is_latest,
            )

            check = app_ensure_java_version_is_latest()
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
                "prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest import (
                app_ensure_java_version_is_latest,
            )

            check = app_ensure_java_version_is_latest()
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
                "prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest import (
                app_ensure_java_version_is_latest,
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
            check = app_ensure_java_version_is_latest()
            result = check.execute()
            assert len(result) == 0

    def test_app_linux_java_version_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        app_client.audit_config = {"java_latest_version": "17"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest import (
                app_ensure_java_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(
                            linux_fx_version="Tomcat|9.0-java17", java_version=None
                        ),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_java_version_is_latest()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Java version is set to 'java 17' for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_linux_java_version_not_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        app_client.audit_config = {"java_latest_version": "17"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest import (
                app_ensure_java_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(
                            linux_fx_version="Tomcat|9.0-java11", java_version=None
                        ),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_java_version_is_latest()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Java version is set to 'Tomcat|9.0-java11', but should be set to 'java 17' for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_windows_java_version_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        app_client.audit_config = {"java_latest_version": "17"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest import (
                app_ensure_java_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(
                            linux_fx_version="", java_version="17"
                        ),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_java_version_is_latest()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Java version is set to 'java 17' for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_windows_java_version_not_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock
        app_client.audit_config = {"java_latest_version": "17"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest import (
                app_ensure_java_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(
                            linux_fx_version="", java_version="11"
                        ),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_java_version_is_latest()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Java version is set to 'java11', but should be set to 'java 17' for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_linux_php_version_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        app_client.audit_config = {"java_latest_version": "17"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_java_version_is_latest.app_ensure_java_version_is_latest import (
                app_ensure_java_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(
                            linux_fx_version="php|8.0", java_version=None
                        ),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_java_version_is_latest()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_php_version_is_latest_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_ensure_php_version_is_latest/app_ensure_php_version_is_latest_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_ensure_php_version_is_latest:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest import (
                app_ensure_php_version_is_latest,
            )

            check = app_ensure_php_version_is_latest()
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
                "prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest import (
                app_ensure_php_version_is_latest,
            )

            check = app_ensure_php_version_is_latest()
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
                "prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest import (
                app_ensure_php_version_is_latest,
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
            check = app_ensure_php_version_is_latest()
            result = check.execute()
            assert len(result) == 0

    def test_app_php_version_not_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        app_client.audit_config = {"php_latest_version": "8.2"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest import (
                app_ensure_php_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(linux_fx_version="php|8.0"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_php_version_is_latest()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"PHP version is set to 'php|8.0', the latest version that you could use is the '8.2' version, for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_php_version_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        app_client.audit_config = {"php_latest_version": "8.2"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_php_version_is_latest.app_ensure_php_version_is_latest import (
                app_ensure_php_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(linux_fx_version="php|8.2"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_php_version_is_latest()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"PHP version is set to '8.2' for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_python_version_is_latest_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_ensure_python_version_is_latest/app_ensure_python_version_is_latest_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_ensure_python_version_is_latest:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest import (
                app_ensure_python_version_is_latest,
            )

            check = app_ensure_python_version_is_latest()
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
                "prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest import (
                app_ensure_python_version_is_latest,
            )

            check = app_ensure_python_version_is_latest()
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
                "prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest import (
                app_ensure_python_version_is_latest,
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
            check = app_ensure_python_version_is_latest()
            result = check.execute()
            assert len(result) == 0

    def test_app_python_version_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        app_client.audit_config = {"python_latest_version": "3.12"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest import (
                app_ensure_python_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(linux_fx_version="python|3.12"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_python_version_is_latest()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Python version is set to '3.12' for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_python_version_not_latest(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        app_client.audit_config = {"python_latest_version": "3.12"}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_python_version_is_latest.app_ensure_python_version_is_latest import (
                app_ensure_python_version_is_latest,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(linux_fx_version="python|3.10"),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_python_version_is_latest()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Python version is 'python|3.10', the latest version that you could use is the '3.12' version, for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_using_http20_test.py]---
Location: prowler-master/tests/providers/azure/services/app/app_ensure_using_http20/app_ensure_using_http20_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_app_ensure_using_http20:
    def test_app_no_subscriptions(self):
        app_client = mock.MagicMock
        app_client.apps = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20 import (
                app_ensure_using_http20,
            )

            check = app_ensure_using_http20()
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
                "prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20 import (
                app_ensure_using_http20,
            )

            check = app_ensure_using_http20()
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
                "prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20 import (
                app_ensure_using_http20,
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
            check = app_ensure_using_http20()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"HTTP/2.0 is not enabled for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_http20_enabled(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20 import (
                app_ensure_using_http20,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(http20_enabled=True),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_using_http20()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"HTTP/2.0 is enabled for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"

    def test_app_http20_not_enabled(self):
        resource_id = f"/subscriptions/{uuid4()}"
        app_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20.app_client",
                new=app_client,
            ),
        ):
            from prowler.providers.azure.services.app.app_ensure_using_http20.app_ensure_using_http20 import (
                app_ensure_using_http20,
            )
            from prowler.providers.azure.services.app.app_service import WebApp

            app_client.apps = {
                AZURE_SUBSCRIPTION_ID: {
                    resource_id: WebApp(
                        resource_id=resource_id,
                        name="app_id-1",
                        auth_enabled=True,
                        configurations=mock.MagicMock(http20_enabled=False),
                        client_cert_mode="Ignore",
                        https_only=False,
                        identity=None,
                        location="West Europe",
                    )
                }
            }
            check = app_ensure_using_http20()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"HTTP/2.0 is not enabled for app 'app_id-1' in subscription '{AZURE_SUBSCRIPTION_ID}'."
            )
            assert result[0].resource_id == resource_id
            assert result[0].resource_name == "app_id-1"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].location == "West Europe"
```

--------------------------------------------------------------------------------

````
