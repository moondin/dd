---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 670
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 670 of 867)

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

---[FILE: monitor_alert_delete_sqlserver_fr_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_delete_sqlserver_fr/monitor_alert_delete_sqlserver_fr_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_delete_sqlserver_fr:
    def test_monitor_alert_delete_sqlserver_fr_no_subscriptions(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_sqlserver_fr.monitor_alert_delete_sqlserver_fr.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_sqlserver_fr.monitor_alert_delete_sqlserver_fr import (
                monitor_alert_delete_sqlserver_fr,
            )

            check = monitor_alert_delete_sqlserver_fr()
            result = check.execute()
            assert len(result) == 0

    def test_no_alert_rules(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {AZURE_SUBSCRIPTION_ID: []}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_sqlserver_fr.monitor_alert_delete_sqlserver_fr.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_sqlserver_fr.monitor_alert_delete_sqlserver_fr import (
                monitor_alert_delete_sqlserver_fr,
            )

            check = monitor_alert_delete_sqlserver_fr()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for deleting SQL Server firewall rule in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_sqlserver_fr.monitor_alert_delete_sqlserver_fr.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_sqlserver_fr.monitor_alert_delete_sqlserver_fr import (
                monitor_alert_delete_sqlserver_fr,
            )
            from prowler.providers.azure.services.monitor.monitor_service import (
                AlertRule,
                AlertRuleAllOfCondition,
            )

            monitor_client.alert_rules = {
                AZURE_SUBSCRIPTION_ID: [
                    AlertRule(
                        id="id",
                        name="name",
                        condition=AlertRuleAllOfCondition(
                            all_of=[
                                AlertRuleAnyOfOrLeafCondition(),
                                AlertRuleAnyOfOrLeafCondition(
                                    equals="Microsoft.Sql/servers/firewallRules/delete",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=False,
                        description="description",
                    ),
                    AlertRule(
                        id="id2",
                        name="name2",
                        condition=AlertRuleAllOfCondition(
                            all_of=[
                                AlertRuleAnyOfOrLeafCondition(),
                                AlertRuleAnyOfOrLeafCondition(
                                    equals="Microsoft.Sql/servers/firewallRules/delete",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_delete_sqlserver_fr()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for deleting SQL Server firewall rule in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_service_health_exists_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_service_health_exists/monitor_alert_service_health_exists_test.py

```python
from unittest import mock

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_service_health_exists:
    def test_monitor_alert_service_health_exists_no_subscriptions(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_service_health_exists.monitor_alert_service_health_exists.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_service_health_exists.monitor_alert_service_health_exists import (
                monitor_alert_service_health_exists,
            )

            check = monitor_alert_service_health_exists()
            result = check.execute()
            assert len(result) == 0

    def test_no_alert_rules(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {AZURE_SUBSCRIPTION_ID: []}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_service_health_exists.monitor_alert_service_health_exists.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_service_health_exists.monitor_alert_service_health_exists import (
                monitor_alert_service_health_exists,
            )

            check = monitor_alert_service_health_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is no activity log alert for Service Health in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock()
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_service_health_exists.monitor_alert_service_health_exists.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_service_health_exists.monitor_alert_service_health_exists import (
                monitor_alert_service_health_exists,
            )
            from prowler.providers.azure.services.monitor.monitor_service import (
                AlertRule,
                AlertRuleAllOfCondition,
                AlertRuleAnyOfOrLeafCondition,
            )

            monitor_client.alert_rules = {
                AZURE_SUBSCRIPTION_ID: [
                    AlertRule(
                        id="id1",
                        name="name1",
                        condition=AlertRuleAllOfCondition(
                            all_of=[
                                AlertRuleAnyOfOrLeafCondition(
                                    field="category", equals="ServiceHealth"
                                ),
                                AlertRuleAnyOfOrLeafCondition(
                                    field="properties.incidentType", equals="Incident"
                                ),
                            ]
                        ),
                        enabled=True,
                        description="desc1",
                    ),
                ]
            }
            check = monitor_alert_service_health_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name1"
            assert result[0].resource_id == "id1"
            assert (
                result[0].status_extended
                == f"There is an activity log alert for Service Health in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured_but_disabled(self):
        monitor_client = mock.MagicMock()
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_service_health_exists.monitor_alert_service_health_exists.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_service_health_exists.monitor_alert_service_health_exists import (
                monitor_alert_service_health_exists,
            )
            from prowler.providers.azure.services.monitor.monitor_service import (
                AlertRule,
                AlertRuleAllOfCondition,
                AlertRuleAnyOfOrLeafCondition,
            )

            monitor_client.alert_rules = {
                AZURE_SUBSCRIPTION_ID: [
                    AlertRule(
                        id="id1",
                        name="name1",
                        condition=AlertRuleAllOfCondition(
                            all_of=[
                                AlertRuleAnyOfOrLeafCondition(
                                    field="category", equals="ServiceHealth"
                                ),
                                AlertRuleAnyOfOrLeafCondition(
                                    field="properties.incidentType", equals="Incident"
                                ),
                            ]
                        ),
                        enabled=False,
                        description="desc1",
                    ),
                ]
            }
            check = monitor_alert_service_health_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is no activity log alert for Service Health in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_diagnostic_settings_exists_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_diagnostic_settings_exists/monitor_diagnostic_settings_exists_test.py

```python
from unittest import mock

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_diagnostic_settings_exists:

    def test_monitor_diagnostic_settings_exists_no_subscriptions(
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
                "prowler.providers.azure.services.monitor.monitor_diagnostic_settings_exists.monitor_diagnostic_settings_exists.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_diagnostic_settings_exists.monitor_diagnostic_settings_exists import (
                monitor_diagnostic_settings_exists,
            )

            check = monitor_diagnostic_settings_exists()
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
                "prowler.providers.azure.services.monitor.monitor_diagnostic_settings_exists.monitor_diagnostic_settings_exists.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_diagnostic_settings_exists.monitor_diagnostic_settings_exists import (
                monitor_diagnostic_settings_exists,
            )

            check = monitor_diagnostic_settings_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"No diagnostic settings found in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_diagnostic_settings_configured(self):
        monitor_client = mock.MagicMock
        storage_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_diagnostic_settings_exists.monitor_diagnostic_settings_exists.monitor_client",
                new=monitor_client,
            ),
        ):
            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=set_mocked_azure_provider(),
                ),
                mock.patch(
                    "prowler.providers.azure.services.monitor.monitor_diagnostic_settings_exists.monitor_diagnostic_settings_exists.monitor_client",
                    new=monitor_client,
                ),
            ):
                from prowler.providers.azure.services.monitor.monitor_diagnostic_settings_exists.monitor_diagnostic_settings_exists import (
                    monitor_diagnostic_settings_exists,
                )
                from prowler.providers.azure.services.monitor.monitor_service import (
                    DiagnosticSetting,
                )
                from prowler.providers.azure.services.storage.storage_service import (
                    Account,
                    BlobProperties,
                    DeleteRetentionPolicy,
                    NetworkRuleSet,
                )

                # Create a valid BlobProperties instance
                valid_blob_properties = BlobProperties(
                    id="id",
                    name="name",
                    type="type",
                    default_service_version="default_service_version",
                    container_delete_retention_policy=DeleteRetentionPolicy(
                        enabled=False, days=0
                    ),
                    versioning_enabled=True,
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
                            encryption_type="Microsoft.CustomerManagedKeyVault",
                            minimum_tls_version="TLS1_2",
                            private_endpoint_connections=[],
                            key_expiration_period_in_days="365",
                            location="euwest",
                            blob_properties=valid_blob_properties,
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
                            key_expiration_period_in_days="365",
                            location="euwest",
                            blob_properties=valid_blob_properties,
                        ),
                    ]
                }
                check = monitor_diagnostic_settings_exists()
                result = check.execute()
                assert len(result) == 1
                assert result[0].subscription == AZURE_SUBSCRIPTION_ID
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Diagnostic settings found in subscription {AZURE_SUBSCRIPTION_ID}."
                )
```

--------------------------------------------------------------------------------

---[FILE: monitor_diagnostic_setting_with_appropriate_categories_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_diagnostic_setting_with_appropriate_categories/monitor_diagnostic_setting_with_appropriate_categories_test.py

```python
from unittest import mock

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_diagnostic_setting_with_appropriate_categories:
    def test_monitor_diagnostic_setting_with_appropriate_categories_no_subscriptions(
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
                "prowler.providers.azure.services.monitor.monitor_diagnostic_setting_with_appropriate_categories.monitor_diagnostic_setting_with_appropriate_categories.monitor_client",
                new=monitor_client,
            ),
        ):

            from prowler.providers.azure.services.monitor.monitor_diagnostic_setting_with_appropriate_categories.monitor_diagnostic_setting_with_appropriate_categories import (
                monitor_diagnostic_setting_with_appropriate_categories,
            )

            check = monitor_diagnostic_setting_with_appropriate_categories()
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
                "prowler.providers.azure.services.monitor.monitor_diagnostic_setting_with_appropriate_categories.monitor_diagnostic_setting_with_appropriate_categories.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_diagnostic_setting_with_appropriate_categories.monitor_diagnostic_setting_with_appropriate_categories import (
                monitor_diagnostic_setting_with_appropriate_categories,
            )

            check = monitor_diagnostic_setting_with_appropriate_categories()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "FAIL"
            assert result[0].resource_id == "Monitor"
            assert result[0].resource_name == "Monitor"
            assert (
                result[0].status_extended
                == f"There are no diagnostic settings capturing appropiate categories in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_diagnostic_settings_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_diagnostic_setting_with_appropriate_categories.monitor_diagnostic_setting_with_appropriate_categories.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_diagnostic_setting_with_appropriate_categories.monitor_diagnostic_setting_with_appropriate_categories import (
                monitor_diagnostic_setting_with_appropriate_categories,
            )
            from prowler.providers.azure.services.monitor.monitor_service import (
                DiagnosticSetting,
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
                            mock.MagicMock(category="Recommendation", enabled=False),
                            mock.MagicMock(category="Policy", enabled=True),
                            mock.MagicMock(category="Autoscale", enabled=False),
                            mock.MagicMock(category="ResourceHealth", enabled=False),
                        ],
                        storage_account_id="/subscriptions/1234a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname",
                        storage_account_name="storageaccountname",
                        name="name",
                    ),
                    DiagnosticSetting(
                        id="id2",
                        logs=[
                            mock.MagicMock(category="Administrative", enabled=False),
                            mock.MagicMock(category="Security", enabled=True),
                            mock.MagicMock(category="ServiceHealth", enabled=False),
                            mock.MagicMock(category="Alert", enabled=True),
                            mock.MagicMock(category="Recommendation", enabled=False),
                            mock.MagicMock(category="Policy", enabled=True),
                            mock.MagicMock(category="Autoscale", enabled=False),
                            mock.MagicMock(category="ResourceHealth", enabled=False),
                        ],
                        storage_account_id="/subscriptions/1224a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname2",
                        storage_account_name="storageaccountname2",
                        name="name2",
                    ),
                ]
            }
            check = monitor_diagnostic_setting_with_appropriate_categories()
            result = check.execute()
            assert len(result) == 1
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].status == "PASS"
            assert result[0].resource_id == "Monitor"
            assert result[0].resource_name == "Monitor"
            assert (
                result[0].status_extended
                == f"There is at least one diagnostic setting capturing appropiate categories in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

````
