---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 669
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 669 of 867)

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

---[FILE: monitor_alert_create_update_public_ip_address_rule_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_create_update_public_ip_address_rule/monitor_alert_create_update_public_ip_address_rule_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_create_update_security_solution:
    def test_monitor_alert_create_update_public_ip_address_rule_no_subscriptions(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_public_ip_address_rule.monitor_alert_create_update_public_ip_address_rule.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_public_ip_address_rule.monitor_alert_create_update_public_ip_address_rule import (
                monitor_alert_create_update_public_ip_address_rule,
            )

            check = monitor_alert_create_update_public_ip_address_rule()
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
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_public_ip_address_rule.monitor_alert_create_update_public_ip_address_rule.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_public_ip_address_rule.monitor_alert_create_update_public_ip_address_rule import (
                monitor_alert_create_update_public_ip_address_rule,
            )

            check = monitor_alert_create_update_public_ip_address_rule()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for creating/updating Public IP address rule in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_public_ip_address_rule.monitor_alert_create_update_public_ip_address_rule.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_public_ip_address_rule.monitor_alert_create_update_public_ip_address_rule import (
                monitor_alert_create_update_public_ip_address_rule,
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
                                    equals="Microsoft.Network/publicIPAddresses/write",
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
                                    equals="Microsoft.Network/publicIPAddresses/write",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_create_update_public_ip_address_rule()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for creating/updating Public IP address rule in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_security_solution_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_create_update_security_solution/monitor_alert_create_update_security_solution_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_create_update_security_solution:
    def test_monitor_alert_create_update_security_solution_no_subscriptions(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_security_solution.monitor_alert_create_update_security_solution.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_security_solution.monitor_alert_create_update_security_solution import (
                monitor_alert_create_update_security_solution,
            )

            check = monitor_alert_create_update_security_solution()
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
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_security_solution.monitor_alert_create_update_security_solution.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_security_solution.monitor_alert_create_update_security_solution import (
                monitor_alert_create_update_security_solution,
            )

            check = monitor_alert_create_update_security_solution()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for creating/updating Security Solution in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_security_solution.monitor_alert_create_update_security_solution.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_security_solution.monitor_alert_create_update_security_solution import (
                monitor_alert_create_update_security_solution,
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
                                    equals="Microsoft.Security/securitySolutions/write",
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
                                    equals="Microsoft.Security/securitySolutions/write",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_create_update_security_solution()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for creating/updating Security Solution in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_sqlserver_fr_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_create_update_sqlserver_fr/monitor_alert_create_update_sqlserver_fr_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_create_update_sqlserver_fr:
    def test_monitor_alert_create_update_sqlserver_fr_no_subscriptions(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_sqlserver_fr.monitor_alert_create_update_sqlserver_fr.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_sqlserver_fr.monitor_alert_create_update_sqlserver_fr import (
                monitor_alert_create_update_sqlserver_fr,
            )

            check = monitor_alert_create_update_sqlserver_fr()
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
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_sqlserver_fr.monitor_alert_create_update_sqlserver_fr.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_sqlserver_fr.monitor_alert_create_update_sqlserver_fr import (
                monitor_alert_create_update_sqlserver_fr,
            )

            check = monitor_alert_create_update_sqlserver_fr()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for creating/updating SQL Server firewall rule in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_create_update_sqlserver_fr.monitor_alert_create_update_sqlserver_fr.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_create_update_sqlserver_fr.monitor_alert_create_update_sqlserver_fr import (
                monitor_alert_create_update_sqlserver_fr,
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
                                    equals="Microsoft.Sql/servers/firewallRules/write",
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
                                    equals="Microsoft.Sql/servers/firewallRules/write",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_create_update_sqlserver_fr()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for creating/updating SQL Server firewall rule in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_nsg_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_delete_nsg/monitor_alert_delete_nsg_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_delete_nsg:
    def test_monitor_alert_delete_nsg_no_subscriptions(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_nsg.monitor_alert_delete_nsg.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_nsg.monitor_alert_delete_nsg import (
                monitor_alert_delete_nsg,
            )

            check = monitor_alert_delete_nsg()
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
                "prowler.providers.azure.services.monitor.monitor_alert_delete_nsg.monitor_alert_delete_nsg.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_nsg.monitor_alert_delete_nsg import (
                monitor_alert_delete_nsg,
            )

            check = monitor_alert_delete_nsg()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for deleting Network Security Groups in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_nsg.monitor_alert_delete_nsg.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_nsg.monitor_alert_delete_nsg import (
                monitor_alert_delete_nsg,
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
                                    equals="Microsoft.Network/networkSecurityGroups/delete",
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
                                    equals="Microsoft.Network/networkSecurityGroups/delete",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_delete_nsg()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for deleting Network Security Groups in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_policy_assignment_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_delete_policy_assignment/monitor_alert_delete_policy_assignment_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_delete_policy_assignment:
    def test_monitor_alert_delete_policy_assignment_no_subscriptions(self):
        monitor_client = mock.MagicMock
        monitor_client.alert_rules = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_policy_assignment.monitor_alert_delete_policy_assignment.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_policy_assignment.monitor_alert_delete_policy_assignment import (
                monitor_alert_delete_policy_assignment,
            )

            check = monitor_alert_delete_policy_assignment()
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
                "prowler.providers.azure.services.monitor.monitor_alert_delete_policy_assignment.monitor_alert_delete_policy_assignment.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_policy_assignment.monitor_alert_delete_policy_assignment import (
                monitor_alert_delete_policy_assignment,
            )

            check = monitor_alert_delete_policy_assignment()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for deleting policy assignment in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_policy_assignment.monitor_alert_delete_policy_assignment.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_policy_assignment.monitor_alert_delete_policy_assignment import (
                monitor_alert_delete_policy_assignment,
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
                                    equals="Microsoft.Authorization/policyAssignments/delete",
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
                                    equals="Microsoft.Authorization/policyAssignments/delete",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_delete_policy_assignment()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for deleting policy assignment in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_public_ip_address_rule_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_delete_public_ip_address_rule/monitor_alert_delete_public_ip_address_rule_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_create_update_security_solution:
    def test_monitor_alert_delete_public_ip_address_rule_no_subscriptions(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_public_ip_address_rule.monitor_alert_delete_public_ip_address_rule.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_public_ip_address_rule.monitor_alert_delete_public_ip_address_rule import (
                monitor_alert_delete_public_ip_address_rule,
            )

            check = monitor_alert_delete_public_ip_address_rule()
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
                "prowler.providers.azure.services.monitor.monitor_alert_delete_public_ip_address_rule.monitor_alert_delete_public_ip_address_rule.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_public_ip_address_rule.monitor_alert_delete_public_ip_address_rule import (
                monitor_alert_delete_public_ip_address_rule,
            )

            check = monitor_alert_delete_public_ip_address_rule()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for deleting public IP address rule in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_public_ip_address_rule.monitor_alert_delete_public_ip_address_rule.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_public_ip_address_rule.monitor_alert_delete_public_ip_address_rule import (
                monitor_alert_delete_public_ip_address_rule,
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
                                    equals="Microsoft.Network/publicIPAddresses/delete",
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
                                    equals="Microsoft.Network/publicIPAddresses/delete",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_delete_public_ip_address_rule()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for deleting public IP address rule in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_security_solution_test.py]---
Location: prowler-master/tests/providers/azure/services/monitor/monitor_alert_delete_security_solution/monitor_alert_delete_security_solution_test.py

```python
from unittest import mock

from azure.mgmt.monitor.models import AlertRuleAnyOfOrLeafCondition

from tests.providers.azure.azure_fixtures import (
    AZURE_SUBSCRIPTION_ID,
    set_mocked_azure_provider,
)


class Test_monitor_alert_create_update_security_solution:
    def test_monitor_alert_delete_security_solution_no_subscriptions(self):
        monitor_client = mock.MagicMock()
        monitor_client.alert_rules = {}
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_security_solution.monitor_alert_delete_security_solution.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_security_solution.monitor_alert_delete_security_solution import (
                monitor_alert_delete_security_solution,
            )

            check = monitor_alert_delete_security_solution()
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
                "prowler.providers.azure.services.monitor.monitor_alert_delete_security_solution.monitor_alert_delete_security_solution.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_security_solution.monitor_alert_delete_security_solution import (
                monitor_alert_delete_security_solution,
            )

            check = monitor_alert_delete_security_solution()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "Monitor"
            assert result[0].resource_id == "Monitor"
            assert (
                result[0].status_extended
                == f"There is not an alert for deleting Security Solution in subscription {AZURE_SUBSCRIPTION_ID}."
            )

    def test_alert_rules_configured(self):
        monitor_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.monitor.monitor_alert_delete_security_solution.monitor_alert_delete_security_solution.monitor_client",
                new=monitor_client,
            ),
        ):
            from prowler.providers.azure.services.monitor.monitor_alert_delete_security_solution.monitor_alert_delete_security_solution import (
                monitor_alert_delete_security_solution,
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
                                    equals="Microsoft.Security/securitySolutions/delete",
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
                                    equals="Microsoft.Security/securitySolutions/delete",
                                    field="operationName",
                                ),
                            ]
                        ),
                        enabled=True,
                        description="description2",
                    ),
                ]
            }
            check = monitor_alert_delete_security_solution()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == AZURE_SUBSCRIPTION_ID
            assert result[0].resource_name == "name2"
            assert result[0].resource_id == "id2"
            assert (
                result[0].status_extended
                == f"There is an alert configured for deleting Security Solution in subscription {AZURE_SUBSCRIPTION_ID}."
            )
```

--------------------------------------------------------------------------------

````
