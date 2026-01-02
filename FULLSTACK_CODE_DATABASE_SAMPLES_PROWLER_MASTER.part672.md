---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 672
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 672 of 867)

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

---[FILE: mysql_flexible_server_audit_log_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/mysql/mysql_flexible_server_audit_log_enabled/mysql_flexible_server_audit_log_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.mysql.mysql_service import (
    Configuration,
    FlexibleServer,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_mysql_flexible_server_audit_log_enabled:
    def test_mysql_no_subscriptions(self):
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_enabled.mysql_flexible_server_audit_log_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_enabled.mysql_flexible_server_audit_log_enabled import (
                mysql_flexible_server_audit_log_enabled,
            )

            check = mysql_flexible_server_audit_log_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_mysql_no_servers(self):
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_enabled.mysql_flexible_server_audit_log_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_enabled.mysql_flexible_server_audit_log_enabled import (
                mysql_flexible_server_audit_log_enabled,
            )

            check = mysql_flexible_server_audit_log_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_mysql_audit_log_disabled(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={
                        "audit_log_enabled": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/audit_log_enabled",
                            description="description",
                            value="OFF",
                        )
                    },
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_enabled.mysql_flexible_server_audit_log_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_enabled.mysql_flexible_server_audit_log_enabled import (
                mysql_flexible_server_audit_log_enabled,
            )

            check = mysql_flexible_server_audit_log_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/audit_log_enabled"
            )
            assert (
                result[0].status_extended
                == f"Audit log is disabled for server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_mysql_audit_log_enabled(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={
                        "audit_log_enabled": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/audit_log_enabled",
                            description="description",
                            value="ON",
                        )
                    },
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_enabled.mysql_flexible_server_audit_log_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_enabled.mysql_flexible_server_audit_log_enabled import (
                mysql_flexible_server_audit_log_enabled,
            )

            check = mysql_flexible_server_audit_log_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/audit_log_enabled"
            )
            assert (
                result[0].status_extended
                == f"Audit log is enabled for server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_minimum_tls_version_12_test.py]---
Location: prowler-master/tests/providers/azure/services/mysql/mysql_flexible_server_minimum_tls_version_12/mysql_flexible_server_minimum_tls_version_12_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.mysql.mysql_service import (
    Configuration,
    FlexibleServer,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_mysql_flexible_server_minimum_tls_version_12:
    def test_mysql_no_subscriptions(self):
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12 import (
                mysql_flexible_server_minimum_tls_version_12,
            )

            check = mysql_flexible_server_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 0

    def test_mysql_no_servers(self):
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12 import (
                mysql_flexible_server_minimum_tls_version_12,
            )

            check = mysql_flexible_server_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 0

    def test_mysql_no_tls_configuration(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={},
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12 import (
                mysql_flexible_server_minimum_tls_version_12,
            )

            check = mysql_flexible_server_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].resource_id == "/subscriptions/resource_id"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"TLS version is not configured in server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_mysql_flexible_server_minimum_tls_version_12(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={
                        "tls_version": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/tls_version",
                            description="description",
                            value="TLSv1.2",
                        )
                    },
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12 import (
                mysql_flexible_server_minimum_tls_version_12,
            )

            check = mysql_flexible_server_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/tls_version"
            )
            assert (
                result[0].status_extended
                == f"TLS version is TLSv1.2 in server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}. This version of TLS is considered secure."
            )

    def test_mysql_tls_version_is_1_3(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={
                        "tls_version": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/tls_version",
                            description="description",
                            value="TLSv1.3",
                        )
                    },
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12 import (
                mysql_flexible_server_minimum_tls_version_12,
            )

            check = mysql_flexible_server_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/tls_version"
            )
            assert (
                result[0].status_extended
                == f"TLS version is TLSv1.3 in server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}. This version of TLS is considered secure."
            )

    def test_mysql_tls_version_is_not_1_2(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={
                        "tls_version": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/tls_version",
                            description="description",
                            value="TLSv1.1",
                        )
                    },
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12 import (
                mysql_flexible_server_minimum_tls_version_12,
            )

            check = mysql_flexible_server_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/tls_version"
            )
            assert (
                result[0].status_extended
                == f"TLS version is TLSv1.1 in server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}. There is at leat one version of TLS that is considered insecure."
            )

    def test_mysql_tls_version_is_1_1_and_1_3(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={
                        "tls_version": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/tls_version",
                            description="description",
                            value="TLSv1.1,TLSv1.3",
                        )
                    },
                )
            }
        }
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_minimum_tls_version_12.mysql_flexible_server_minimum_tls_version_12 import (
                mysql_flexible_server_minimum_tls_version_12,
            )

            check = mysql_flexible_server_minimum_tls_version_12()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/tls_version"
            )
            assert (
                result[0].status_extended
                == f"TLS version is TLSv1.1,TLSv1.3 in server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}. There is at leat one version of TLS that is considered insecure."
            )
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_ssl_connection_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/mysql/mysql_flexible_server_ssl_connection_enabled/mysql_flexible_server_ssl_connection_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.azure.services.mysql.mysql_service import (
    Configuration,
    FlexibleServer,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_mysql_flexible_server_ssl_connection_enabled:
    def test_mysql_no_subscriptions(self):
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled import (
                mysql_flexible_server_ssl_connection_enabled,
            )

            check = mysql_flexible_server_ssl_connection_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_mysql_no_servers(self):
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {AZURE_SUBSCRIPTION_ID: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled import (
                mysql_flexible_server_ssl_connection_enabled,
            )

            check = mysql_flexible_server_ssl_connection_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_mysql_connection_enabled(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={
                        "require_secure_transport": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/require_secure_transport",
                            description="description",
                            value="ON",
                        )
                    },
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled import (
                mysql_flexible_server_ssl_connection_enabled,
            )

            check = mysql_flexible_server_ssl_connection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/require_secure_transport"
            )
            assert (
                result[0].status_extended
                == f"SSL connection is enabled for server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_mysql_ssl_connection_disabled(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={
                        "require_secure_transport": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/require_secure_transport",
                            description="description",
                            value="OFF",
                        )
                    },
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled import (
                mysql_flexible_server_ssl_connection_enabled,
            )

            check = mysql_flexible_server_ssl_connection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/require_secure_transport"
            )
            assert (
                result[0].status_extended
                == f"SSL connection is disabled for server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_mysql_ssl_connection_no_configuration(self):
        server_name = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id": FlexibleServer(
                    resource_id="/subscriptions/resource_id",
                    name=server_name,
                    location="location",
                    version="version",
                    configurations={},
                )
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled import (
                mysql_flexible_server_ssl_connection_enabled,
            )

            check = mysql_flexible_server_ssl_connection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].resource_id == "/subscriptions/resource_id"
            assert result[0].location == "location"
            assert (
                result[0].status_extended
                == f"SSL connection is disabled for server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_mysql_ssl_connection_enabled_and_disabled(self):
        server_name_1 = str(uuid4())
        server_name_2 = str(uuid4())
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {
            AZURE_SUBSCRIPTION_ID: {
                "/subscriptions/resource_id1": FlexibleServer(
                    resource_id="/subscriptions/resource_id1",
                    name=server_name_1,
                    location="location",
                    version="version",
                    configurations={
                        "require_secure_transport": Configuration(
                            resource_id=f"/subscriptions/{server_name_1}/configurations/require_secure_transport",
                            description="description",
                            value="ON",
                        )
                    },
                ),
                "/subscriptions/resource_id2": FlexibleServer(
                    resource_id="/subscriptions/resource_id2",
                    name=server_name_2,
                    location="location",
                    version="version",
                    configurations={
                        "require_secure_transport": Configuration(
                            resource_id=f"/subscriptions/{server_name_2}/configurations/require_secure_transport",
                            description="description",
                            value="OFF",
                        )
                    },
                ),
            }
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_ssl_connection_enabled.mysql_flexible_server_ssl_connection_enabled import (
                mysql_flexible_server_ssl_connection_enabled,
            )

            check = mysql_flexible_server_ssl_connection_enabled()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name_1
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name_1}/configurations/require_secure_transport"
            )
            assert (
                result[0].status_extended
                == f"SSL connection is enabled for server {server_name_1} in subscription {AZURE_SUBSCRIPTION_ID}."
            )
            assert result[1].status == "FAIL"
            assert result[1].subscription == AZURE_SUBSCRIPTION_ID
            assert result[1].resource_name == server_name_2
            assert result[0].location == "location"
            assert (
                result[1].resource_id
                == f"/subscriptions/{server_name_2}/configurations/require_secure_transport"
            )
            assert (
                result[1].status_extended
                == f"SSL connection is disabled for server {server_name_2} in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: network_service_test.py]---
Location: prowler-master/tests/providers/azure/services/network/network_service_test.py

```python
from unittest.mock import patch

from azure.mgmt.network.models import FlowLog

from prowler.providers.azure.services.network.network_service import (
    BastionHost,
    Network,
    NetworkWatcher,
    PublicIp,
    SecurityGroup,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_network_get_security_groups(_):
    return {
        AZURE_SUBSCRIPTION_ID: [
            SecurityGroup(
                id="id",
                name="name",
                location="location",
                security_rules=[],
            )
        ]
    }


def mock_network_get_bastion_hosts(_):
    return {
        AZURE_SUBSCRIPTION_ID: [
            BastionHost(
                id="id",
                name="name",
                location="location",
            )
        ]
    }


def mock_network_get_network_watchers(_):
    return {
        AZURE_SUBSCRIPTION_ID: [
            NetworkWatcher(
                id="id",
                name="name",
                location="location",
                flow_logs=[FlowLog(enabled=True, retention_policy=90)],
            )
        ]
    }


def mock_network_get_public_ip_addresses(_):
    return {
        AZURE_SUBSCRIPTION_ID: [
            PublicIp(
                id="id",
                name="name",
                location="location",
                ip_address="ip_address",
            )
        ]
    }


@patch(
    "prowler.providers.azure.services.network.network_service.Network._get_security_groups",
    new=mock_network_get_security_groups,
)
@patch(
    "prowler.providers.azure.services.network.network_service.Network._get_bastion_hosts",
    new=mock_network_get_bastion_hosts,
)
@patch(
    "prowler.providers.azure.services.network.network_service.Network._get_network_watchers",
    new=mock_network_get_network_watchers,
)
@patch(
    "prowler.providers.azure.services.network.network_service.Network._get_public_ip_addresses",
    new=mock_network_get_public_ip_addresses,
)
class Test_Network_Service:
    def test_get_client(self):
        network = Network(set_mocked_azure_provider())
        assert (
            network.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "NetworkManagementClient"
        )

    def test_get_security_groups(self):
        network = Network(set_mocked_azure_provider())
        assert (
            network.security_groups[AZURE_SUBSCRIPTION_ID][0].__class__.__name__
            == "SecurityGroup"
        )
        assert network.security_groups[AZURE_SUBSCRIPTION_ID][0].id == "id"
        assert network.security_groups[AZURE_SUBSCRIPTION_ID][0].name == "name"
        assert network.security_groups[AZURE_SUBSCRIPTION_ID][0].location == "location"
        assert network.security_groups[AZURE_SUBSCRIPTION_ID][0].security_rules == []

    def test_get_network_watchers(self):
        network = Network(set_mocked_azure_provider())
        assert (
            network.network_watchers[AZURE_SUBSCRIPTION_ID][0].__class__.__name__
            == "NetworkWatcher"
        )
        assert network.network_watchers[AZURE_SUBSCRIPTION_ID][0].id == "id"
        assert network.network_watchers[AZURE_SUBSCRIPTION_ID][0].name == "name"
        assert network.network_watchers[AZURE_SUBSCRIPTION_ID][0].location == "location"
        assert network.network_watchers[AZURE_SUBSCRIPTION_ID][0].flow_logs == [
            FlowLog(enabled=True, retention_policy=90)
        ]

    def _get_flow_logs(self):
        network = Network(set_mocked_azure_provider())
        nw_name = "name"
        assert (
            network.network_watchers[AZURE_SUBSCRIPTION_ID][0]
            .flow_logs[nw_name][0]
            .__class__.__name__
            == "FlowLog"
        )
        assert network.network_watchers[AZURE_SUBSCRIPTION_ID][0].flow_logs == [
            FlowLog(enabled=True, retention_policy=90)
        ]
        assert (
            network.network_watchers[AZURE_SUBSCRIPTION_ID][0].flow_logs[0].enabled
            is True
        )
        assert (
            network.network_watchers[AZURE_SUBSCRIPTION_ID][0]
            .flow_logs[0]
            .retention_policy
            == 90
        )

    def _get_bastion_hosts(self):
        network = Network(set_mocked_azure_provider())
        assert (
            network.bastion_hosts[AZURE_SUBSCRIPTION_ID][0].__class__.__name__
            == "BastionHost"
        )
        assert network.bastion_hosts[AZURE_SUBSCRIPTION_ID][0].id == "id"
        assert network.bastion_hosts[AZURE_SUBSCRIPTION_ID][0].name == "name"
        assert network.bastion_hosts[AZURE_SUBSCRIPTION_ID][0].location == "location"

    def _get_public_ip_addresses(self):
        network = Network(set_mocked_azure_provider())
        assert (
            network.public_ip_addresses[AZURE_SUBSCRIPTION_ID][0].__class__.__name__
            == "PublicIp"
        )
        assert network.public_ip_addresses[AZURE_SUBSCRIPTION_ID][0].id == "id"
        assert network.public_ip_addresses[AZURE_SUBSCRIPTION_ID][0].name == "name"
        assert (
            network.public_ip_addresses[AZURE_SUBSCRIPTION_ID][0].location == "location"
        )
        assert (
            network.public_ip_addresses[AZURE_SUBSCRIPTION_ID][0].ip_address
            == "ip_address"
        )
```

--------------------------------------------------------------------------------

````
