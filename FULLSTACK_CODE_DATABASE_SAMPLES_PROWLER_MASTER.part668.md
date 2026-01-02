---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 668
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 668 of 867)

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

---[FILE: keyvault_rbac_secret_expiration_set_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_rbac_secret_expiration_set/keyvault_rbac_secret_expiration_set_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.keyvault.v2023_07_01.models import SecretAttributes, VaultProperties

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_rbac_secret_expiration_set:
    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set import (
                keyvault_rbac_secret_expiration_set,
            )

            check = keyvault_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 0

    def test_no_secrets(self):
        keyvault_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set import (
                keyvault_rbac_secret_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id="id",
                        name="name",
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=True,
                        ),
                        keys=[],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 0

    def test_key_vaults_invalid_secrets(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())
        secret_name = "Secret"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set import (
                keyvault_rbac_secret_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                Secret,
            )

            secret = Secret(
                id="id",
                name=secret_name,
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=None),
            )
            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=True,
                        ),
                        keys=[],
                        secrets=[secret],
                    )
                ]
            }
            check = keyvault_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has the secret {secret_name} without expiration date set."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_invalid_multiple_secrets(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())
        secret1_name = "Secret1"
        secret2_name = "Secret2"

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set import (
                keyvault_rbac_secret_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                Secret,
            )

            secret1 = Secret(
                id="id",
                name=secret1_name,
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=None),
            )
            secret2 = Secret(
                id="id",
                name=secret2_name,
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=84934),
            )
            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=True,
                        ),
                        keys=[],
                        secrets=[secret1, secret2],
                    )
                ]
            }
            check = keyvault_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has the secret {secret1_name} without expiration date set."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_valid_keys(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_rbac_secret_expiration_set.keyvault_rbac_secret_expiration_set import (
                keyvault_rbac_secret_expiration_set,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                Secret,
            )

            secret = Secret(
                id="id",
                name="name",
                enabled=False,
                location="location",
                attributes=SecretAttributes(expires=None),
            )
            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=True,
                        ),
                        keys=[],
                        secrets=[secret],
                    )
                ]
            }
            check = keyvault_rbac_secret_expiration_set()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} has all the secrets with expiration date set."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: keyvault_recoverable_test.py]---
Location: prowler-master/tests/providers/azure/services/keyvault/keyvault_recoverable/keyvault_recoverable_test.py

```python
from unittest import mock
from uuid import uuid4

from azure.mgmt.keyvault.v2023_07_01.models import SecretAttributes, VaultProperties

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_keyvault_recoverable:

    def test_no_key_vaults(self):
        keyvault_client = mock.MagicMock
        keyvault_client.key_vaults = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_recoverable.keyvault_recoverable.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_recoverable.keyvault_recoverable import (
                keyvault_recoverable,
            )

            check = keyvault_recoverable()
            result = check.execute()
            assert len(result) == 0

    def test_key_vaults_no_purge(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_recoverable.keyvault_recoverable.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_recoverable.keyvault_recoverable import (
                keyvault_recoverable,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
            )

            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=True,
                            enable_soft_delete=True,
                            enable_purge_protection=False,
                        ),
                        keys=[],
                        secrets=[],
                    )
                ]
            }
            check = keyvault_recoverable()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} is not recoverable."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_no_soft_delete(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_recoverable.keyvault_recoverable.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_recoverable.keyvault_recoverable import (
                keyvault_recoverable,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                Secret,
            )

            secret1 = Secret(
                id="id",
                name="name",
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=None, enabled=True),
            )
            secret2 = Secret(
                id="id",
                name="name",
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=84934, enabled=True),
            )
            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=True,
                            enable_soft_delete=True,
                            enable_purge_protection=False,
                        ),
                        keys=[],
                        secrets=[secret1, secret2],
                    )
                ]
            }
            check = keyvault_recoverable()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} is not recoverable."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"

    def test_key_vaults_valid_configuration(self):
        keyvault_client = mock.MagicMock
        keyvault_name = "Keyvault Name"
        keyvault_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.keyvault.keyvault_recoverable.keyvault_recoverable.keyvault_client",
                new=keyvault_client,
            ),
        ):
            from prowler.providers.azure.services.keyvault.keyvault_recoverable.keyvault_recoverable import (
                keyvault_recoverable,
            )
            from prowler.providers.azure.services.keyvault.keyvault_service import (
                KeyVaultInfo,
                Secret,
            )

            secret = Secret(
                id="id",
                name="name",
                enabled=True,
                location="location",
                attributes=SecretAttributes(expires=None, enabled=False),
            )
            keyvault_client.key_vaults = {
                AZURE_SUBSCRIPTION_ID: [
                    KeyVaultInfo(
                        id=keyvault_id,
                        name=keyvault_name,
                        location="westeurope",
                        resource_group="resource_group",
                        properties=VaultProperties(
                            tenant_id="tenantid",
                            sku="sku",
                            enable_rbac_authorization=True,
                            enable_soft_delete=True,
                            enable_purge_protection=True,
                        ),
                        keys=[],
                        secrets=[secret],
                    )
                ]
            }
            check = keyvault_recoverable()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Keyvault {keyvault_name} from subscription {AZURE_SUBSCRIPTION_ID} is recoverable."
            )
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == keyvault_name
            assert result[0].resource_id == keyvault_id
            assert result[0].location == "westeurope"
```

--------------------------------------------------------------------------------

---[FILE: monitor_service_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_service_test.py

```python
from unittest import mock
from unittest.mock import patch

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_service import (
    AlertRule,
    AlertRuleAllOfCondition,
    DiagnosticSetting,
    Monitor,
)
from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


def mock_monitor_get_diagnostics_settings(_):
    return {
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
            )
        ]
    }


@patch(
    "prowler.providers.azure.services.monitor.monitor_service.Monitor._get_diagnostics_settings",
    new=mock_monitor_get_diagnostics_settings,
)
class Test_Monitor_Service:
    def test_get_client(self):
        monitor = Monitor(set_mocked_azure_provider())
        assert (
            monitor.clients[AZURE_SUBSCRIPTION_ID].__class__.__name__
            == "MonitorManagementClient"
        )

    def test__get_subscriptions__(self):
        monitor = Monitor(set_mocked_azure_provider())
        assert monitor.subscriptions.__class__.__name__ == "dict"

    def test__get_diagnostics_settings(self):
        monitor = Monitor(set_mocked_azure_provider())
        assert len(monitor.diagnostics_settings) == 1
        assert monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].id == "id"
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[0].enabled
            is True
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[0].category
            == "Administrative"
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[1].enabled
            is True
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[1].category
            == "Security"
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[2].category
            == "ServiceHealth"
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[3].enabled
            is True
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[3].category
            == "Alert"
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[4].category
            == "Recommendation"
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[5].enabled
            is True
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[5].category
            == "Policy"
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[6].category
            == "Autoscale"
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].logs[7].category
            == "ResourceHealth"
        )
        assert (
            monitor.diagnostics_settings[AZURE_SUBSCRIPTION_ID][0].storage_account_id
            == "/subscriptions/1234a5-123a-123a-123a-1234567890ab/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/storageaccountname"
        )

    def test__monitor_alerts_false__(self):
        alert_rule = AlertRule(
            id="id",
            name="name",
            condition=AlertRuleAllOfCondition(
                all_of=[
                    AlertRuleAnyOfOrLeafCondition(),
                    AlertRuleAnyOfOrLeafCondition(
                        equals="Microsoft.Authorization/policyAssignments/write",
                        field="operationName",
                    ),
                ]
            ),
            enabled=False,
            description="description",
        )

        assert not check_alert_rule(
            alert_rule, "Microsoft.Authorization/policyAssignments/write"
        )

    def test__monitor_alerts_true__(self):
        alert_rule = AlertRule(
            id="id",
            name="name",
            condition=AlertRuleAllOfCondition(
                all_of=[
                    AlertRuleAnyOfOrLeafCondition(),
                    AlertRuleAnyOfOrLeafCondition(
                        equals="Microsoft.Authorization/policyAssignments/write",
                        field="operationName",
                    ),
                ]
            ),
            enabled=True,
            description="description",
        )

        assert check_alert_rule(
            alert_rule, "Microsoft.Authorization/policyAssignments/write"
        )

    def test__monitor_alerts_false_equal__(self):
        alert_rule = AlertRule(
            id="id",
            name="name",
            condition=AlertRuleAllOfCondition(
                all_of=[
                    AlertRuleAnyOfOrLeafCondition(),
                    AlertRuleAnyOfOrLeafCondition(
                        equals="Microsoft.Authorization/policyAssingments/write",
                        field="operationName",
                    ),
                ]
            ),
            enabled=True,
            description="description",
        )

        assert not check_alert_rule(
            alert_rule, "Microsoft.Authorization/policyAssignments/write"
        )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_policy_assignment_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_create_policy_assignment/monitor_alert_create_policy_assignment_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_create_policy_assignment:
    def test_monitor_alert_create_policy_assignment_no_subscriptions(self):
        monitor_client = mock.MagicMock
        monitor_client.alert_rules = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_policy_assignment.monitor_alert_create_policy_assignment.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_policy_assignment.monitor_alert_create_policy_assignment import (
                monitor_alert_create_policy_assignment,
            )

            check = monitor_alert_create_policy_assignment()
            result = check.execute()
            assert len(result) == 0

    def test_no_alert_rules(self):
        monitor_client = mock.MagicMock
        monitor_client.alert_rules = {AZURE_SUBSCRIPTION_ID: []}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_policy_assignment.monitor_alert_create_policy_assignment.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_policy_assignment.monitor_alert_create_policy_assignment import (
                monitor_alert_create_policy_assignment,
            )

            check = monitor_alert_create_policy_assignment()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for creating Policy Assignments in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_policy_assignment.monitor_alert_create_policy_assignment.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_policy_assignment.monitor_alert_create_policy_assignment import (
                monitor_alert_create_policy_assignment,
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
                                    equals="Microsoft.Authorization/policyAssignments/write",
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
                                    equals="Microsoft.Authorization/policyAssignments/write",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_create_policy_assignment()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for creating Policy Assignments in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_nsg_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_create_update_nsg/monitor_alert_create_update_nsg_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_create_update_nsg:
    def test_monitor_alert_create_update_nsg_no_subscriptions(self):
        monitor_client = mock.MagicMock
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_nsg.monitor_alert_create_update_nsg.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_nsg.monitor_alert_create_update_nsg import (
                monitor_alert_create_update_nsg,
            )

            check = monitor_alert_create_update_nsg()
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
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_nsg.monitor_alert_create_update_nsg.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_nsg.monitor_alert_create_update_nsg import (
                monitor_alert_create_update_nsg,
            )

            check = monitor_alert_create_update_nsg()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for creating/updating Network Security Groups in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_nsg.monitor_alert_create_update_nsg.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_nsg.monitor_alert_create_update_nsg import (
                monitor_alert_create_update_nsg,
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
                                    equals="Microsoft.Network/networkSecurityGroups/write",
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
                                    equals="Microsoft.Network/networkSecurityGroups/write",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_create_update_nsg()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for creating/updating Network Security Groups in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

````
