---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 342
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 342 of 867)

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

---[FILE: monitor_alert_delete_public_ip_address_rule.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_public_ip_address_rule/monitor_alert_delete_public_ip_address_rule.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_delete_public_ip_address_rule",
  "CheckTitle": "Ensure that Activity Log Alert exists for Delete Public IP Address rule",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the Delete Public IP Address rule.",
  "Risk": "Monitoring for Delete Public IP Address events gives insight into network access changes and may reduce the time it takes to detect suspicious activity.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Network/publicIPAddresses/delete and level=<verbose | information | warning | error | critical>--scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/delete-public-ip-alert.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Public IP addresses. 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Delete Public Ip Address (Microsoft.Network/publicIPAddresses). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
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

---[FILE: monitor_alert_delete_public_ip_address_rule.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_public_ip_address_rule/monitor_alert_delete_public_ip_address_rule.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_delete_public_ip_address_rule(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Network/publicIPAddresses/delete"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for deleting public IP address rule in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for deleting public IP address rule in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_security_solution.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_security_solution/monitor_alert_delete_security_solution.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_delete_security_solution",
  "CheckTitle": "Ensure that Activity Log Alert exists for Delete Security Solution",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the Delete Security Solution event.",
  "Risk": "Monitoring for Delete Security Solution events gives insight into changes to the active security solutions and may reduce the time it takes to detect suspicious activity.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Security/securitySolutions/delete and level=<verbose | information | warning | error | critical>--scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/delete-security-solution-alert.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Security Solutions (securitySolutions). 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Delete Security Solutions (Microsoft.Security/securitySolutions). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.curitySolutions). 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Create or Update Security Solutions (Microsoft.Security/securitySolutions). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
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

---[FILE: monitor_alert_delete_security_solution.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_security_solution/monitor_alert_delete_security_solution.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_delete_security_solution(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Security/securitySolutions/delete"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for deleting Security Solution in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for deleting Security Solution in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_delete_sqlserver_fr.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_sqlserver_fr/monitor_alert_delete_sqlserver_fr.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_delete_sqlserver_fr",
  "CheckTitle": "Ensure that Activity Log Alert exists for Delete SQL Server Firewall Rule",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Create an activity log alert for the 'Delete SQL Server Firewall Rule.'",
  "Risk": "Monitoring for Delete SQL Server Firewall Rule events gives insight into SQL network access changes and may reduce the time it takes to detect suspicious activity.",
  "RelatedUrl": "https://docs.microsoft.com/en-in/azure/azure-monitor/platform/alerts-activity-log",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --resource-group '<resource group name>' --condition category=Administrative and operationName=Microsoft.Sql/servers/firewallRules/delete and level=<verbose | information | warning | error | critical>--scope '/subscriptions/<subscription ID>' --name '<activity log rule name>' -- subscription <subscription id> --action-group <action group ID> --location global",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/ActivityLog/create-or-update-or-delete-sql-server-firewall-rule-alert.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Monitor blade. 2. Select Alerts. 3. Select Create. 4. Select Alert rule. 5. Under Filter by subscription, choose a subscription. 6. Under Filter by resource type, select Server Firewall Rule (servers/firewallRules). 7. Under Filter by location, select All. 8. From the results, select the subscription. 9. Select Done. 10. Select the Condition tab. 11. Under Signal name, click Delete server firewall rule (Microsoft.Sql/servers/firewallRules). 12. Select the Actions tab. 13. To use an existing action group, click Select action groups. To create a new action group, click Create action group. Fill out the appropriate details for the selection. 14. Select the Details tab. 15. Select a Resource group, provide an Alert rule name and an optional Alert rule description. 16. Click Review + create. 17. Click Create.",
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

---[FILE: monitor_alert_delete_sqlserver_fr.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_delete_sqlserver_fr/monitor_alert_delete_sqlserver_fr.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.lib.monitor_alerts import check_alert_rule
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_delete_sqlserver_fr(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                if check_alert_rule(
                    alert_rule, "Microsoft.Sql/servers/firewallRules/delete"
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=alert_rule
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"There is an alert configured for deleting SQL Server firewall rule in subscription {subscription_name}."
                    break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is not an alert for deleting SQL Server firewall rule in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_service_health_exists.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_service_health_exists/monitor_alert_service_health_exists.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_alert_service_health_exists",
  "CheckTitle": "Ensure that an Activity Log Alert exists for Service Health",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "Ensure that an Azure activity log alert is configured to trigger when Service Health events occur within your Microsoft Azure cloud account. The alert should activate when new events match the specified conditions in the alert rule configuration.",
  "Risk": "Lack of monitoring for Service Health events may result in missing critical service issues, planned maintenance, security advisories, or other changes that could impact Azure services and regions in use.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/service-health/overview",
  "Remediation": {
    "Code": {
      "CLI": "az monitor activity-log alert create --subscription <subscription-id> --resource-group <resource-group> --name <alert-rule> --condition category=ServiceHealth and properties.incidentType=Incident --scope /subscriptions/<subscription-id> --action-group <action-group>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/ActivityLog/service-health-alert.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create an activity log alert for Service Health events and configure an action group to notify appropriate personnel.",
      "Url": "https://learn.microsoft.com/en-us/azure/service-health/alerts-activity-log-service-notifications-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, in your Azure subscription there will not be any activity log alerts configured for Service Health events."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_alert_service_health_exists.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_alert_service_health_exists/monitor_alert_service_health_exists.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_alert_service_health_exists(Check):
    def execute(self) -> list[Check_Report_Azure]:
        findings = []

        for (
            subscription_name,
            activity_log_alerts,
        ) in monitor_client.alert_rules.items():
            for alert_rule in activity_log_alerts:
                # Check if alert rule is enabled and has required Service Health conditions
                if alert_rule.enabled:
                    has_service_health_category = False
                    has_incident_type_incident = False
                    for element in alert_rule.condition.all_of:
                        if (
                            element.field == "category"
                            and element.equals == "ServiceHealth"
                        ):
                            has_service_health_category = True
                        if (
                            element.field == "properties.incidentType"
                            and element.equals == "Incident"
                        ):
                            has_incident_type_incident = True

                    if has_service_health_category and has_incident_type_incident:
                        report = Check_Report_Azure(
                            metadata=self.metadata(), resource=alert_rule
                        )
                        report.subscription = subscription_name
                        report.status = "PASS"
                        report.status_extended = f"There is an activity log alert for Service Health in subscription {subscription_name}."
                        break
            else:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "Monitor"
                report.resource_id = "Monitor"
                report.status = "FAIL"
                report.status_extended = f"There is no activity log alert for Service Health in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_diagnostic_settings_exists.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_diagnostic_settings_exists/monitor_diagnostic_settings_exists.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_diagnostic_settings_exists",
  "CheckTitle": "Ensure that a 'Diagnostic Setting' exists for Subscription Activity Logs ",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Monitor",
  "Description": "Enable Diagnostic settings for exporting activity logs. Diagnostic settings are available for each individual resource within a subscription. Settings should be configured for all appropriate resources for your environment.",
  "Risk": "A diagnostic setting controls how a diagnostic log is exported. By default, logs are retained only for 90 days. Diagnostic settings should be defined so that logs can be exported and stored for a longer duration in order to analyze security activities within an Azure subscription.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/cli/azure/monitor/diagnostic-settings?view=azure-cli-latest",
  "Remediation": {
    "Code": {
      "CLI": "az monitor diagnostic-settings subscription create --subscription <subscription id> --name <diagnostic settings name> --location <location> <[- -event-hub <event hub ID> --event-hub-auth-rule <event hub auth rule ID>] [-- storage-account <storage account ID>] [--workspace <log analytics workspace ID>] --logs '<JSON encoded categories>' (e.g. [{category:Security,enabled:true},{category:Administrative,enabled:true},{cat egory:Alert,enabled:true},{category:Policy,enabled:true}])",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Monitor/subscription-activity-log-diagnostic-settings.html#trendmicro",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To enable Diagnostic Settings on a Subscription: 1. Go to Monitor 2. Click on Activity Log 3. Click on Export Activity Logs 4. Click + Add diagnostic setting 5. Enter a Diagnostic setting name 6. Select Categories for the diagnostic settings 7. Select the appropriate Destination details (this may be Log Analytics, Storage Account, Event Hub, or Partner solution) 8. Click Save To enable Diagnostic Settings on a specific resource: 1. Go to Monitor 2. Click Diagnostic settings 3. Click on the resource that has a diagnostics status of disabled 4. Select Add Diagnostic Setting 5. Enter a Diagnostic setting name 6. Select the appropriate log, metric, and destination. (this may be Log Analytics, Storage Account, Event Hub, or Partner solution) 7. Click save Repeat these step for all resources as needed.",
      "Url": "https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs#export-the-activity-log-with-a-log-profile"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, diagnostic setting is not set."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_diagnostic_settings_exists.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_diagnostic_settings_exists/monitor_diagnostic_settings_exists.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_diagnostic_settings_exists(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            diagnostic_settings,
        ) in monitor_client.diagnostics_settings.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource={})
            report.subscription = subscription_name
            report.resource_name = "Diagnostic Settings"
            report.resource_id = "diagnostic_settings"
            report.status = "FAIL"
            report.status_extended = (
                f"No diagnostic settings found in subscription {subscription_name}."
            )
            if diagnostic_settings:
                report.status = "PASS"
                report.status_extended = (
                    f"Diagnostic settings found in subscription {subscription_name}."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_diagnostic_setting_with_appropriate_categories.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_diagnostic_setting_with_appropriate_categories/monitor_diagnostic_setting_with_appropriate_categories.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_diagnostic_setting_with_appropriate_categories",
  "CheckTitle": "Ensure Diagnostic Setting captures appropriate categories",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "Configuring Diagnostic Settings",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Monitor",
  "Description": "Prerequisite: A Diagnostic Setting must exist. If a Diagnostic Setting does not exist, the navigation and options within this recommendation will not be available. Please review the recommendation at the beginning of this subsection titled: 'Ensure that a 'Diagnostic Setting' exists.' The diagnostic setting should be configured to log the appropriate activities from the control/management plane.",
  "Risk": "A diagnostic setting controls how the diagnostic log is exported. Capturing the diagnostic setting categories for appropriate control/management plane activities allows proper alerting.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings",
  "Remediation": {
    "Code": {
      "CLI": "az monitor diagnostic-settings subscription create --subscription <subscription id> --name <diagnostic settings name> --location <location> <[- -event-hub <event hub ID> --event-hub-auth-rule <event hub auth rule ID>] [-- storage-account <storage account ID>] [--workspace <log analytics workspace ID>] --logs '[{category:Security,enabled:true},{category:Administrative,enabled:true},{ca tegory:Alert,enabled:true},{category:Policy,enabled:true}]'>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Monitor/diagnostic-setting-categories.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Go to Azure Monitor 2. Click Activity log 3. Click on Export Activity Logs 4. Select the Subscription from the drop down menu 5. Click on Add diagnostic setting 6. Enter a name for your new Diagnostic Setting 7. Check the following categories: Administrative, Alert, Policy, and Security 8. Choose the destination details according to your organization's needs.",
      "Url": "https://learn.microsoft.com/en-us/azure/storage/common/manage-storage-analytics-logs?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json&tabs=azure-portal"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "When the diagnostic setting is created using Azure Portal, by default no categories are selected."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_diagnostic_setting_with_appropriate_categories.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_diagnostic_setting_with_appropriate_categories/monitor_diagnostic_setting_with_appropriate_categories.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.monitor_client import monitor_client


class monitor_diagnostic_setting_with_appropriate_categories(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            diagnostic_settings,
        ) in monitor_client.diagnostics_settings.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource={})
            report.subscription = subscription_name
            report.resource_name = "Monitor"
            report.resource_id = "Monitor"
            report.status = "FAIL"
            report.status_extended = f"There are no diagnostic settings capturing appropiate categories in subscription {subscription_name}."
            administrative_enabled = False
            security_enabled = False
            service_health_enabled = False
            alert_enabled = False
            for diagnostic_setting in diagnostic_settings:
                for log in diagnostic_setting.logs:
                    if log.category == "Administrative" and log.enabled:
                        administrative_enabled = True
                    if log.category == "Security" and log.enabled:
                        security_enabled = True
                    if log.category == "Alert" and log.enabled:
                        service_health_enabled = True
                    if log.category == "Policy" and log.enabled:
                        alert_enabled = True

                    if (
                        administrative_enabled
                        and security_enabled
                        and service_health_enabled
                        and alert_enabled
                    ):
                        report.status = "PASS"
                        report.status_extended = f"There is at least one diagnostic setting capturing appropiate categories in subscription {subscription_name}."
                        break
                if (
                    administrative_enabled
                    and security_enabled
                    and service_health_enabled
                    and alert_enabled
                ):
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_storage_account_with_activity_logs_cmk_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_storage_account_with_activity_logs_cmk_encrypted/monitor_storage_account_with_activity_logs_cmk_encrypted.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_storage_account_with_activity_logs_cmk_encrypted",
  "CheckTitle": "Ensure the storage account containing the container with activity logs is encrypted with Customer Managed Key",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Monitor",
  "Description": "Storage accounts with the activity log exports can be configured to use CustomerManaged Keys (CMK).",
  "Risk": "Configuring the storage account with the activity log export container to use CMKs provides additional confidentiality controls on log data, as a given user must have read permission on the corresponding storage account and must be granted decrypt permission by the CMK.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-data-protection#dp-5-encrypt-sensitive-data-at-rest",
  "Remediation": {
    "Code": {
      "CLI": "az storage account update --name <name of the storage account> --resource-group <resource group for a storage account> --encryption-key-source=Microsoft.Keyvault --encryption-key-vault <Key Vault URI> --encryption-key-name <KeyName> --encryption-key-version <Key Version>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Monitor/use-cmk-for-activity-log-storage-container-encryption.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-storage-accounts-use-customer-managed-key-for-encryption#terraform"
    },
    "Recommendation": {
      "Text": "1. Go to Activity log 2. Select Export 3. Select Subscription 4. In section Storage Account, note the name of the Storage account 5. Close the Export Audit Logs blade. Close the Monitor - Activity Log blade. 6. In right column, Click service Storage Accounts to access Storage account blade 7. Click on the storage account name noted in step 4. This will open blade specific to that storage account 8. Under Security + networking, click Encryption. 9. Ensure Customer-managed keys is selected and Key URI is set.",
      "Url": "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log?tabs=cli#managing-legacy-log-profiles"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "NOTE: You must have your key vault setup to utilize this. All Audit Logs will be encrypted with a key you provide. You will need to set up customer managed keys separately, and you will select which key to use via the instructions here. You will be responsible for the lifecycle of the keys, and will need to manually replace them at your own determined intervals to keep the data secure."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_storage_account_with_activity_logs_cmk_encrypted.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_storage_account_with_activity_logs_cmk_encrypted/monitor_storage_account_with_activity_logs_cmk_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.monitor_client import monitor_client
from prowler.providers.azure.services.storage.storage_client import storage_client


class monitor_storage_account_with_activity_logs_cmk_encrypted(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            diagnostic_settings,
        ) in monitor_client.diagnostics_settings.items():
            for diagnostic_setting in diagnostic_settings:
                for storage_account in storage_client.storage_accounts[
                    subscription_name
                ]:
                    if storage_account.name == diagnostic_setting.storage_account_name:
                        report = Check_Report_Azure(
                            metadata=self.metadata(), resource=storage_account
                        )
                        report.subscription = subscription_name
                        if storage_account.encryption_type == "Microsoft.Storage":
                            report.status = "FAIL"
                            report.status_extended = f"Storage account {storage_account.name} storing activity log in subscription {subscription_name} is not encrypted with Customer Managed Key."
                        else:
                            report.status = "PASS"
                            report.status_extended = f"Storage account {storage_account.name} storing activity log in subscription {subscription_name} is encrypted with Customer Managed Key or not necessary."

                        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitor_storage_account_with_activity_logs_is_private.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_storage_account_with_activity_logs_is_private/monitor_storage_account_with_activity_logs_is_private.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "monitor_storage_account_with_activity_logs_is_private",
  "CheckTitle": "Ensure the Storage Container Storing the Activity Logs is not Publicly Accessible",
  "CheckType": [],
  "ServiceName": "monitor",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Monitor",
  "Description": "The storage account container containing the activity log export should not be publicly accessible.",
  "Risk": "Allowing public access to activity log content may aid an adversary in identifying weaknesses in the affected account's use or configuration.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings",
  "Remediation": {
    "Code": {
      "CLI": "az storage container set-permission --name insights-activity-logs --account-name <Storage Account Name> --public-access off",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Monitor/check-for-publicly-accessible-activity-log-storage-container.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-logging-policies/ensure-the-storage-container-storing-the-activity-logs-is-not-publicly-accessible#terraform"
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Search for Storage Accounts to access Storage account blade 3. Click on the storage account name 4. Click on Configuration under settings 5. Select Enabled under 'Allow Blob public access'",
      "Url": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-network-security#ns-2-secure-cloud-services-with-network-controls"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Configuring container Access policy to private will remove access from the container for everyone except owners of the storage account. Access policy needs to be set explicitly in order to allow access to other desired users."
}
```

--------------------------------------------------------------------------------

---[FILE: monitor_storage_account_with_activity_logs_is_private.py]---
Location: prowler-master/prowler/providers/azure/services/monitor/monitor_storage_account_with_activity_logs_is_private/monitor_storage_account_with_activity_logs_is_private.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.monitor.monitor_client import monitor_client
from prowler.providers.azure.services.storage.storage_client import storage_client


class monitor_storage_account_with_activity_logs_is_private(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            diagnostic_settings,
        ) in monitor_client.diagnostics_settings.items():
            for diagnostic_setting in diagnostic_settings:
                for storage_account in storage_client.storage_accounts[
                    subscription_name
                ]:
                    if storage_account.name == diagnostic_setting.storage_account_name:
                        report = Check_Report_Azure(
                            metadata=self.metadata(), resource=storage_account
                        )
                        report.subscription = subscription_name
                        if storage_account.allow_blob_public_access:
                            report.status = "FAIL"
                            report.status_extended = f"Blob public access enabled in storage account {storage_account.name} storing activity logs in subscription {subscription_name}."
                        else:
                            report.status = "PASS"
                            report.status_extended = f"Blob public access disabled in storage account {storage_account.name} storing activity logs in subscription {subscription_name}."

                        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: mysql_client.py]---
Location: prowler-master/prowler/providers/azure/services/mysql/mysql_client.py

```python
from prowler.providers.azure.services.mysql.mysql_service import MySQL
from prowler.providers.common.provider import Provider

mysql_client = MySQL(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
