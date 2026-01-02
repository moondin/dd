---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 341
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 341 of 867)

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

---[FILE: monitor_client.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_client.py

```python
from prowler.providers.azure.services.monitor.monitor_service import Monitor
from prowler.providers.common.provider import Provider

monitor_client = Monitor(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: monitor_service.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_service.py

```python
from dataclasses import dataclass
from typing import List, Optional

from azure.mgmt.monitor import MonitorManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class Monitor(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(MonitorManagementClient, provider)

        self.diagnostics_settings = self._get_diagnostics_settings()
        self.alert_rules = self.get_alert_rules()

    def _get_diagnostics_settings(self):
        logger.info("Monitor - Getting diagnostics settings...")
        diagnostics_settings_list = []
        diagnostics_settings = {}
        for subscription, client in self.clients.items():
            try:
                diagnostics_settings_list = self.diagnostic_settings_with_uri(
                    subscription,
                    f"subscriptions/{self.subscriptions[subscription]}/",
                    client,
                )
                diagnostics_settings.update({subscription: diagnostics_settings_list})
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return diagnostics_settings

    def diagnostic_settings_with_uri(self, subscription, uri, client):
        diagnostics_settings = []
        try:
            settings = client.diagnostic_settings.list(resource_uri=uri)
            for setting in settings:
                diagnostics_settings.append(
                    DiagnosticSetting(
                        id=setting.id,
                        name=setting.id.split("/")[-1],
                        storage_account_name=(
                            setting.storage_account_id.split("/")[-1]
                            if getattr(setting, "storage_account_id", None)
                            else None
                        ),
                        logs=[
                            LogSettings(
                                category=log_settings.category,
                                category_group=log_settings.category_group,
                                enabled=log_settings.enabled,
                            )
                            for log_settings in (getattr(setting, "logs", []) or [])
                        ],
                        storage_account_id=setting.storage_account_id,
                        workspace_id=getattr(setting, "workspace_id", None),
                    )
                )
        except Exception as error:
            logger.error(
                f"Subscription id: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return diagnostics_settings

    def get_alert_rules(self):
        logger.info("Monitor - Getting alert rules...")
        alert_rules = {}
        for subscription, client in self.clients.items():
            try:
                alert_rules.update({subscription: []})
                rules = client.activity_log_alerts.list_by_subscription_id()
                for rule in rules:
                    alert_rules[subscription].append(
                        AlertRule(
                            id=rule.id,
                            name=rule.name,
                            condition=AlertRuleAllOfCondition(
                                all_of=[
                                    AlertRuleAnyOfOrLeafCondition(
                                        field=condition.field,
                                        equals=condition.equals,
                                    )
                                    for condition in getattr(
                                        getattr(rule, "condition", None), "all_of", []
                                    )
                                ]
                            ),
                            enabled=rule.enabled,
                            description=rule.description,
                        )
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return alert_rules


@dataclass
class LogSettings:
    category: str
    category_group: str
    enabled: bool


@dataclass
class DiagnosticSetting:
    id: str
    storage_account_id: str
    storage_account_name: str
    logs: List[LogSettings]
    name: str
    workspace_id: Optional[str] = None


@dataclass
class AlertRuleAnyOfOrLeafCondition:
    field: str
    equals: str


@dataclass
class AlertRuleAllOfCondition:
    all_of: List[AlertRuleAnyOfOrLeafCondition]


@dataclass
class AlertRule:
    id: str
    name: str
    condition: AlertRuleAllOfCondition
    enabled: bool
    description: Optional[str]
```

--------------------------------------------------------------------------------

---[FILE: monitor_alerts.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/lib/monitor_alerts.py

```python
"""
This module contains functions related to monitoring alerts in Azure.
"""


def check_alert_rule(alert_rule, expected_equal) -> bool:
    """
    Checks if an alert rule meets the specified condition.

    Args:
        alert_rule: An object representing the alert rule to be checked.
        expected_equal: The expected value for the "operationName" field.

    Returns:
        A boolean value indicating whether the alert rule meets the condition.
    """

    if alert_rule.enabled:
        for element in alert_rule.condition.all_of:
            if element.field == "operationName" and element.equals == expected_equal:
                return True

    return False
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_policy_assignment.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_policy_assignment/monitor_alert_create_policy_assignment.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_create_policy_assignment",
  "CheckTitle": "Ensure that Activity Log Alert exists for Create Policy Assignment",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the Create Policy Assignment event.",
  "Risk": "Monitoring for create policy assignment events gives insight into changes done in 'Azure policy - assignments' and can reduce the time it takes to detect unsolicited changes.",
  "RelatedUrl": "https://azure.microsoft.com/en-us/updates/classic-alerting-monitoring-retirement",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Authorization/policyAssignments/write and level=<verbose | information | warning | error | critical> --scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription ID> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/create-alert-for-create-policy-assignment-events.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Policy assignment (policyAssignments). 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Create policy assignment (Microsoft.Authorization/policyAssignments). 12. Select the Actions tab. 13. To use an existing action group, click elect action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
      "Url": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, no monitoring alerts are created."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_policy_assignment.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_policy_assignment/monitor_alert_create_policy_assignment.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_create_policy_assignment(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Authorization/policyAssignments/write"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for creating Policy Assignments in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for creating Policy Assignments in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_nsg.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_update_nsg/monitor_alert_create_update_nsg.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_create_update_nsg",
  "CheckTitle": "Ensure that Activity Log Alert exists for Create or Update Network Security Group",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an Activity Log Alert for the Create or Update Network Security Group event.",
  "Risk": "Monitoring for Create or Update Network Security Group events gives insight into network access changes and may reduce the time it takes to detect suspicious activity.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Network/networkSecurityGroups/write and level=verbose --scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' --subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/create-update-network-security-group-rule-alert-in-use.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Network security groups. 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Create or Update Network Security Group (Microsoft.Network/networkSecurityGroups). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
      "Url": "https://azure.microsoft.com/en-us/updates/classic-alerting-monitoring-retirement"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, no monitoring alerts are created."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_nsg.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_update_nsg/monitor_alert_create_update_nsg.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_create_update_nsg(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Network/networkSecurityGroups/write"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for creating/updating Network Security Groups in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for creating/updating Network Security Groups in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_public_ip_address_rule.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_update_public_ip_address_rule/monitor_alert_create_update_public_ip_address_rule.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_create_update_public_ip_address_rule",
  "CheckTitle": "Ensure that Activity Log Alert exists for Create or Update Public IP Address rule",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the Create or Update Public IP Addresses rule.",
  "Risk": "Monitoring for Create or Update Public IP Address events gives insight into network access changes and may reduce the time it takes to detect suspicious activity.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Network/publicIPAddresses/write and level=<verbose | information | warning | error | critical>--scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/create-or-update-public-ip-alert.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Public IP addresses. 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Create or Update Public Ip Address (Microsoft.Network/publicIPAddresses). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
      "Url": "https://azure.microsoft.com/en-us/updates/classic-alerting-monitoring-retirement"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, no monitoring alerts are created."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_public_ip_address_rule.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_update_public_ip_address_rule/monitor_alert_create_update_public_ip_address_rule.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_create_update_public_ip_address_rule(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Network/publicIPAddresses/write"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for creating/updating Public IP address rule in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for creating/updating Public IP address rule in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_security_solution.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_update_security_solution/monitor_alert_create_update_security_solution.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_create_update_security_solution",
  "CheckTitle": "Ensure that Activity Log Alert exists for Create or Update Security Solution",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the Create or Update Security Solution event.",
  "Risk": "Monitoring for Create or Update Security Solution events gives insight into changes to the active security solutions and may reduce the time it takes to detect suspicious activity.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Security/securitySolutions/write and level=<verbose | information | warning | error | critical>--scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/create-or-update-security-solution-alert.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Security Solutions (securitySolutions). 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Create or Update Security Solutions (Microsoft.Security/securitySolutions). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
      "Url": "https://azure.microsoft.com/en-us/updates/classic-alerting-monitoring-retirement"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, no monitoring alerts are created."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_security_solution.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_update_security_solution/monitor_alert_create_update_security_solution.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_create_update_security_solution(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Security/securitySolutions/write"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for creating/updating Security Solution in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for creating/updating Security Solution in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_sqlserver_fr.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_update_sqlserver_fr/monitor_alert_create_update_sqlserver_fr.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_create_update_sqlserver_fr",
  "CheckTitle": "Ensure that Activity Log Alert exists for Create or Update SQL Server Firewall Rule",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the Create or Update SQL Server Firewall Rule event.",
  "Risk": "Monitoring for Create or Update SQL Server Firewall Rule events gives insight into network access changes and may reduce the time it takes to detect suspicious activity.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Sql/servers/firewallRules/write and level=<verbose | information | warning | error | critical>--scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/create-or-update-or-delete-sql-server-firewall-rule-alert.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Server Firewall Rule (servers/firewallRules). 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Create/Update server firewall rule (Microsoft.Sql/servers/firewallRules). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
      "Url": "https://azure.microsoft.com/en-us/updates/classic-alerting-monitoring-retirement"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, no monitoring alerts are created."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_create_update_sqlserver_fr.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_create_update_sqlserver_fr/monitor_alert_create_update_sqlserver_fr.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_create_update_sqlserver_fr(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Sql/servers/firewallRules/write"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for creating/updating SQL Server firewall rule in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for creating/updating SQL Server firewall rule in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_nsg.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_nsg/monitor_alert_delete_nsg.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_delete_nsg",
  "CheckTitle": "Ensure that Activity Log Alert exists for Delete Network Security Group",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the Delete Network Security Group event.",
  "Risk": "Monitoring for 'Delete Network Security Group' events gives insight into network access changes and may reduce the time it takes to detect suspicious activity.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Network/networkSecurityGroups/delete and level=<verbose | information | warning | error | critical>--scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/delete-network-security-group-rule-alert-in-use.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Network security groups. 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Delete Network Security Group (Microsoft.Network/networkSecurityGroups). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
      "Url": "https://azure.microsoft.com/en-us/updates/classic-alerting-monitoring-retirement"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, no monitoring alerts are created."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_nsg.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_nsg/monitor_alert_delete_nsg.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_delete_nsg(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Network/networkSecurityGroups/delete"
                ) or check_alert_rule(
                    alert_rule, "Microsoft.ClassicNetwork/networkSecurityGroups/delete"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for deleting Network Security Groups in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for deleting Network Security Groups in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_policy_assignment.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_policy_assignment/monitor_alert_delete_policy_assignment.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_delete_policy_assignment",
  "CheckTitle": "Ensure that Activity Log Alert exists for Delete Policy Assignment",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the Delete Policy Assignment event.",
  "Risk": "Monitoring for delete policy assignment events gives insight into changes done in 'azure policy - assignments' and can reduce the time it takes to detect unsolicited changes.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/rest/api/monitor/activitylogalerts/createorupdate",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Authorization/policyAssignments/delete and level=<verbose | information | warning | error | critical> --scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/delete-policy-assignment-alert-in-use.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Policy assignment (policyAssignments). 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Delete policy assignment (Microsoft.Authorization/policyAssignments). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
      "Url": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, no monitoring alerts are created."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_policy_assignment.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_policy_assignment/monitor_alert_delete_policy_assignment.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_delete_policy_assignment(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Authorization/policyAssignments/delete"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for deleting policy assignment in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for deleting policy assignment in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
