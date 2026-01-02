---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 671
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 671 of 867)

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

---[FILE: monitor_storage_account_with_activity_logs_cmk_encrypted_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_storage_account_with_activity_logs_cmk_encrypted/monitor_storage_account_with_activity_logs_cmk_encrypted_test.py

```python
from unittest import mock

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_storage_account_with_activity_logs_cmk_encrypted:
    def test_monitor_storage_account_with_activity_logs_cmk_encrypted_no_subscriptions(
        self,
    ):
        monitor_client = mock.MagicMock
        monitor_client.diagnostics_settings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_storage_account_with_activity_logs_cmk_encrypted import (
                monitor_storage_account_with_activity_logs_cmk_encrypted,
            )

            check = monitor_storage_account_with_activity_logs_cmk_encrypted()
            result = check.execute()
            assert len(result) == 0

    def test_no_diagnostic_settings(self):
        monitor_client = mock.MagicMock
        monitor_client.diagnostics_settings = {AZURE_SUBSCRIPTION_ID: []}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_storage_account_with_activity_logs_cmk_encrypted import (
                monitor_storage_account_with_activity_logs_cmk_encrypted,
            )

            check = monitor_storage_account_with_activity_logs_cmk_encrypted()
            result = check.execute()
            assert len(result) == 0

    def test_diagnostic_settings_configured(self):
        monitor_client = mock.MagicMock
        storage_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_client",
                new=monitor_client,
            ),
        ):
            with mock.patch(
                "prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_storage_account_with_activity_logs_cmk_encrypted.storage_client",
                new=storage_client,
            ):
                from prowler.providers.azure.services.monitor.monitor_service import (
                    DiagnosticSetting,
                )
                from prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_cmk_encrypted.monitor_storage_account_with_activity_logs_cmk_encrypted import (
                    monitor_storage_account_with_activity_logs_cmk_encrypted,
                )
                from prowler.providers.azure.services.storage.storage_service import (
                    Account,
                    BlobProperties,
                    DeleteRetentionPolicy,
                    NetworkRuleSet,
                )

                monitor_client.diagnostics_settings = {
                    AZURE_SUBSCRIPTION_ID: [
                        DiagnosticSetting(
                            id="id",
                            logs=[
                                mock.MagicMock(category="Administrative", enabled=True),
                                mock.MagicMock(category="Security", enabled=True),
                                mock.MagicMock(category="ServiceHealth", enabled=False),
                                mock.MagicMock(category="Alert", enabled=True),
                                mock.MagicMock(
                                    category="Recommendation", enabled=False
                                ),
                                mock.MagicMock(category="Policy", enabled=True),
                                mock.MagicMock(category="Autoscale", enabled=False),
                            ],
                            storage_account_id="/subscriptions/1234a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname1",
                            storage_account_name="storageaccountname1",
                            name="name",
                        ),
                        DiagnosticSetting(
                            id="id2",
                            logs=[
                                mock.MagicMock(category="Administrative", enabled=True),
                                mock.MagicMock(category="Security", enabled=True),
                                mock.MagicMock(category="ServiceHealth", enabled=False),
                                mock.MagicMock(category="Alert", enabled=True),
                                mock.MagicMock(
                                    category="Recommendation", enabled=False
                                ),
                                mock.MagicMock(category="Policy", enabled=True),
                                mock.MagicMock(category="Autoscale", enabled=False),
                            ],
                            storage_account_id="/subscriptions/1224a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname2",
                            storage_account_name="storageaccountname2",
                            name="name2",
                        ),
                    ]
                }
                storage_client.storage_accounts = {
                    AZURE_SUBSCRIPTION_ID: [
                        Account(
                            id="/subscriptions/1234a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname1",
                            name="storageaccountname1",
                            resouce_group_name="rg",
                            enable_https_traffic_only=True,
                            infrastructure_encryption=True,  # bool
                            allow_blob_public_access=True,
                            network_rule_set=NetworkRuleSet(
                                bypass="AzureServices", default_action="Allow"
                            ),
                            encryption_type="Microsoft.CustomerManagedKeyVault",
                            minimum_tls_version="TLS1_2",
                            private_endpoint_connections=[],
                            key_expiration_period_in_days="365",  # str
                            location="euwest",
                            blob_properties=BlobProperties(
                                id="id",
                                name="name",
                                type="type",
                                default_service_version="default_service_version",
                                container_delete_retention_policy=DeleteRetentionPolicy(
                                    enabled=True, days=7
                                ),
                                versioning_enabled=True,
                            ),
                        ),
                        Account(
                            id="/subscriptions/1224a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname2",
                            name="storageaccountname2",
                            resouce_group_name="rg",
                            enable_https_traffic_only=False,
                            infrastructure_encryption=True,  # bool
                            allow_blob_public_access=False,
                            network_rule_set=NetworkRuleSet(
                                bypass="AzureServices", default_action="Allow"
                            ),
                            encryption_type="Microsoft.Storage",
                            minimum_tls_version="TLS1_2",
                            private_endpoint_connections=[],
                            key_expiration_period_in_days="365",  # str
                            location="euwest",
                            blob_properties=BlobProperties(
                                id="id",
                                name="name",
                                type="type",
                                default_service_version="default_service_version",
                                container_delete_retention_policy=DeleteRetentionPolicy(
                                    enabled=True, days=7
                                ),
                                versioning_enabled=False,
                            ),
                        ),
                    ]
                }

                check = monitor_storage_account_with_activity_logs_cmk_encrypted()
                result = check.execute()
                assert len(result) == 2
                assert result[0].subscription == AZURE_SUBSCRIPTION_ID
                assert result[0].status == "PASS"
                assert result[0].resource_name == "storageaccountname1"
                assert result[0].location == "euwest"
                assert (
                    result[0].resource_id
                    == "/subscriptions/1234a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname1"
                )
                assert (
                    result[0].status_extended
                    == f"Storage account {storage_client.storage_accounts[AZURE_SUBSCRIPTION_ID][0].name} storing activity log in subscription {AZURE_SUBSCRIPTION_ID} is encrypted with Customer Managed Key or not necessary."
                )
                assert result[1].status == "FAIL"
                assert result[1].resource_name == "storageaccountname2"
                assert result[1].location == "euwest"
                assert (
                    result[1].resource_id
                    == "/subscriptions/1224a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname2"
                )
                assert (
                    result[1].status_extended
                    == f"Storage account {storage_client.storage_accounts[AZURE_SUBSCRIPTION_ID][1].name} storing activity log in subscription {AZURE_SUBSCRIPTION_ID} is not encrypted with Customer Managed Key."
                )
```

--------------------------------------------------------------------------------

---[FILE: monitor_storage_account_with_activity_logs_is_private_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_storage_account_with_activity_logs_is_private/monitor_storage_account_with_activity_logs_is_private_test.py

```python
from unittest import mock

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_storage_account_with_activity_logs_is_private:
    def test_monitor_storage_account_with_activity_logs_is_private_no_subscriptions(
        self,
    ):
        monitor_client = mock.MagicMock
        monitor_client.diagnostics_settings = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_is_private.monitor_storage_account_with_activity_logs_is_private.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_is_private.monitor_storage_account_with_activity_logs_is_private import (
                monitor_storage_account_with_activity_logs_is_private,
            )

            check = monitor_storage_account_with_activity_logs_is_private()
            result = check.execute()
            assert len(result) == 0

    def test_no_diagnostic_settings(self):
        monitor_client = mock.MagicMock
        monitor_client.diagnostics_settings = {AZURE_SUBSCRIPTION_ID: []}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_is_private.monitor_storage_account_with_activity_logs_is_private.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_is_private.monitor_storage_account_with_activity_logs_is_private import (
                monitor_storage_account_with_activity_logs_is_private,
            )

            check = monitor_storage_account_with_activity_logs_is_private()
            result = check.execute()
            assert len(result) == 0

    def test_diagnostic_settings_configured(self):
        monitor_client = mock.MagicMock
        storage_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_is_private.monitor_storage_account_with_activity_logs_is_private.monitor_client",
                new=monitor_client,
            ),
        ):
            with mock.patch(
                "prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_is_private.monitor_storage_account_with_activity_logs_is_private.storage_client",
                new=storage_client,
            ):
                from prowler.providers.azure.services.monitor.monitor_service import (
                    DiagnosticSetting,
                )
                from prowler.providers.azure.services.monitor.monitor_storage_account_with_activity_logs_is_private.monitor_storage_account_with_activity_logs_is_private import (
                    monitor_storage_account_with_activity_logs_is_private,
                )
                from prowler.providers.azure.services.storage.storage_service import (
                    Account,
                    BlobProperties,
                    DeleteRetentionPolicy,
                    NetworkRuleSet,
                )

                monitor_client.diagnostics_settings = {
                    AZURE_SUBSCRIPTION_ID: [
                        DiagnosticSetting(
                            id="id",
                            logs=[
                                mock.MagicMock(category="Administrative", enabled=True),
                                mock.MagicMock(category="Security", enabled=True),
                                mock.MagicMock(category="ServiceHealth", enabled=False),
                                mock.MagicMock(category="Alert", enabled=True),
                                mock.MagicMock(
                                    category="Recommendation", enabled=False
                                ),
                                mock.MagicMock(category="Policy", enabled=True),
                                mock.MagicMock(category="Autoscale", enabled=False),
                            ],
                            storage_account_id="/subscriptions/1234a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname1",
                            storage_account_name="storageaccountname1",
                            name="name",
                        ),
                        DiagnosticSetting(
                            id="id2",
                            logs=[
                                mock.MagicMock(category="Administrative", enabled=True),
                                mock.MagicMock(category="Security", enabled=True),
                                mock.MagicMock(category="ServiceHealth", enabled=False),
                                mock.MagicMock(category="Alert", enabled=True),
                                mock.MagicMock(
                                    category="Recommendation", enabled=False
                                ),
                                mock.MagicMock(category="Policy", enabled=True),
                                mock.MagicMock(category="Autoscale", enabled=False),
                            ],
                            storage_account_id="/subscriptions/1224a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname2",
                            storage_account_name="storageaccountname2",
                            name="name2",
                        ),
                    ]
                }
                storage_client.storage_accounts = {
                    AZURE_SUBSCRIPTION_ID: [
                        Account(
                            id="/subscriptions/1234a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname1",
                            name="storageaccountname1",
                            resouce_group_name="rg",
                            enable_https_traffic_only=True,
                            infrastructure_encryption=True,
                            allow_blob_public_access=True,
                            network_rule_set=NetworkRuleSet(
                                bypass="AzureServices", default_action="Allow"
                            ),
                            encryption_type="Microsoft.Storage",
                            minimum_tls_version="TLS1_2",
                            private_endpoint_connections=[],
                            key_expiration_period_in_days=365,
                            location="euwest",
                            blob_properties=BlobProperties(
                                id="id",
                                name="name",
                                type="type",
                                default_service_version="default_service_version",
                                container_delete_retention_policy=DeleteRetentionPolicy(
                                    enabled=True, days=7
                                ),
                                versioning_enabled=True,
                            ),
                        ),
                        Account(
                            id="/subscriptions/1224a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname2",
                            name="storageaccountname2",
                            resouce_group_name="rg",
                            enable_https_traffic_only=False,
                            infrastructure_encryption=True,
                            allow_blob_public_access=False,
                            network_rule_set=NetworkRuleSet(
                                bypass="AzureServices", default_action="Allow"
                            ),
                            encryption_type="Microsoft.Storage",
                            minimum_tls_version="TLS1_2",
                            private_endpoint_connections=[],
                            key_expiration_period_in_days=365,
                            location="euwest",
                            blob_properties=BlobProperties(
                                id="id",
                                name="name",
                                type="type",
                                default_service_version="default_service_version",
                                container_delete_retention_policy=DeleteRetentionPolicy(
                                    enabled=True, days=7
                                ),
                                versioning_enabled=False,
                            ),
                        ),
                    ]
                }
                check = monitor_storage_account_with_activity_logs_is_private()
                result = check.execute()
                assert len(result) == 2
                assert result[0].subscription == AZURE_SUBSCRIPTION_ID
                assert result[0].status == "FAIL"
                assert result[0].location == "euwest"
                assert (
                    result[0].resource_id
                    == "/subscriptions/1234a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname1"
                )
                assert result[0].resource_name == "storageaccountname1"
                assert (
                    result[0].status_extended
                    == f"Blob public access enabled in storage account {storage_client.storage_accounts[AZURE_SUBSCRIPTION_ID][0].name} storing activity logs in subscription {AZURE_SUBSCRIPTION_ID}."
                )
                assert result[1].subscription == AZURE_SUBSCRIPTION_ID
                assert result[1].status == "PASS"
                assert result[1].location == "euwest"
                assert (
                    result[1].resource_id
                    == "/subscriptions/1224a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname2"
                )
                assert result[1].resource_name == "storageaccountname2"
                assert (
                    result[1].status_extended
                    == f"Blob public access disabled in storage account {storage_client.storage_accounts[AZURE_SUBSCRIPTION_ID][1].name} storing activity logs in subscription {AZURE_SUBSCRIPTION_ID}."
                )
```

--------------------------------------------------------------------------------

---[FILE: mysql_service_test.py]---
Location: prowler-master/tests/providers/azure/services/mysql/mysql_service_test.py

```python
from unittest.mock import patch

from prowler.providers.azure.services.mysql.mysql_service import (
    Configuration,
    FlexibleServer,
    MySQL,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_mysql_get_servers(_):
    return {
        AZURE_SUBSCRIPTION_ID: {
            "/subscriptions/resource_id": FlexibleServer(
                resource_id="/subscriptions/resource_id",
                name="test",
                location="location",
                version="version",
                configurations={
                    "test": Configuration(
                        resource_id="/subscriptions/test/resource_id",
                        description="description",
                        value="value",
                    )
                },
            )
        }
    }


def mock_mysql_get_configurations(_):
    return {
        "test": Configuration(
            resource_id="/subscriptions/resource_id",
            description="description",
            value="value",
        )
    }


@patch(
    "prowler.providers.azure.services.mysql.mysql_service.MySQL._get_flexible_servers",
    new=mock_mysql_get_servers,
)
@patch(
    "prowler.providers.azure.services.mysql.mysql_service.MySQL._get_configurations",
    new=mock_mysql_get_configurations,
)
class Test_MySQL_Service:
    def test_get_client(self):
        mysql = MySQL(set_mocked_azure_provider())
        assert (
            mysql.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "MySQLManagementClient"
        )

    def test__get_subscriptions__(self):
        mysql = MySQL(set_mocked_azure_provider())
        assert mysql.subscriptions.__class__.__name__ == "dict"

    def test_get_flexible_servers(self):
        mysql = MySQL(set_mocked_azure_provider())
        assert len(mysql.flexible_servers) == 1
        assert (
            mysql.flexible_servers[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].resource_id
            == "/subscriptions/resource_id"
        )
        assert (
            mysql.flexible_servers[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].location
            == "location"
        )
        assert (
            mysql.flexible_servers[AZURE_SUBSCRIPTION_ID][
                "/subscriptions/resource_id"
            ].version
            == "version"
        )
        assert (
            len(
                mysql.flexible_servers[AZURE_SUBSCRIPTION_ID][
                    "/subscriptions/resource_id"
                ].configurations
            )
            == 1
        )
        assert (
            mysql.flexible_servers[AZURE_SUBSCRIPTION_ID]["/subscriptions/resource_id"]
            .configurations["test"]
            .resource_id
            == "/subscriptions/test/resource_id"
        )
        assert (
            mysql.flexible_servers[AZURE_SUBSCRIPTION_ID]["/subscriptions/resource_id"]
            .configurations["test"]
            .description
            == "description"
        )
        assert (
            mysql.flexible_servers[AZURE_SUBSCRIPTION_ID]["/subscriptions/resource_id"]
            .configurations["test"]
            .value
            == "value"
        )

    def test_get_configurations(self):
        mysql = MySQL(set_mocked_azure_provider())
        configurations = mysql._get_configurations()

        assert len(configurations) == 1
        assert configurations["test"].resource_id == "/subscriptions/resource_id"
        assert configurations["test"].description == "description"
        assert configurations["test"].value == "value"
```

--------------------------------------------------------------------------------

---[FILE: mysql_flexible_server_audit_log_connection_activated_test.py]---
Location: prowler-master/tests/providers/azure/services/mysql/mysql_flexible_server_audit_log_connection_activated/mysql_flexible_server_audit_log_connection_activated_test.py

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


class Test_mysql_flexible_server_audit_log_connection_activated:
    def test_mysql_no_subscriptions(self):
        mysql_client = mock.MagicMock
        mysql_client.flexible_servers = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated import (
                mysql_flexible_server_audit_log_connection_activated,
            )

            check = mysql_flexible_server_audit_log_connection_activated()
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
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated import (
                mysql_flexible_server_audit_log_connection_activated,
            )

            check = mysql_flexible_server_audit_log_connection_activated()
            result = check.execute()
            assert len(result) == 0

    def test_mysql_audit_log_connection_not_connection(self):
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
                        "audit_log_events": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/audit_log_events",
                            description="description",
                            value="ADMIN,DDL",
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
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated import (
                mysql_flexible_server_audit_log_connection_activated,
            )

            check = mysql_flexible_server_audit_log_connection_activated()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/audit_log_events"
            )
            assert (
                result[0].status_extended
                == f"Audit log is disabled for server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_mysql_audit_log_connection_activated(self):
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
                        "audit_log_events": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/audit_log_events",
                            description="description",
                            value="CONNECTION",
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
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated import (
                mysql_flexible_server_audit_log_connection_activated,
            )

            check = mysql_flexible_server_audit_log_connection_activated()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/audit_log_events"
            )
            assert (
                result[0].status_extended
                == f"Audit log is enabled for server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_mysql_audit_log_connection_activated_with_other_options(self):
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
                        "audit_log_events": Configuration(
                            resource_id=f"/subscriptions/{server_name}/configurations/audit_log_events",
                            description="description",
                            value="ADMIN,GENERAL,CONNECTION,DDL",
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
                "prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated.mysql_client",
                new=mysql_client,
            ),
        ):
            from prowler.providers.azure.services.mysql.mysql_flexible_server_audit_log_connection_activated.mysql_flexible_server_audit_log_connection_activated import (
                mysql_flexible_server_audit_log_connection_activated,
            )

            check = mysql_flexible_server_audit_log_connection_activated()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == server_name
            assert result[0].location == "location"
            assert (
                result[0].resource_id
                == f"/subscriptions/{server_name}/configurations/audit_log_events"
            )
            assert (
                result[0].status_extended
                == f"Audit log is enabled for server {server_name} in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

````
