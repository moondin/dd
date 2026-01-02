---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 336
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 336 of 867)

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

---[FILE: defender_ensure_defender_for_sql_servers_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_sql_servers_is_on/defender_ensure_defender_for_sql_servers_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_sql_servers_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for SQL Servers on Machines Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for SQL Servers on Machines Is Set To 'On' ",
  "Risk": "Turning on Microsoft Defender for SQL servers on machines enables threat detection for SQL servers on machines, providing threat intelligence, anomaly detection, and behavior analytics in the Microsoft Defender for Cloud.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/defender-sql-server-virtual-machines.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-azure-defender-is-set-to-on-for-sql-servers-on-machines#terraform"
    },
    "Recommendation": {
      "Text": "By default, Microsoft Defender for Cloud is disabled for the Microsoft SQL servers running on virtual machines. Defender for Cloud for SQL Server virtual machines continuously monitors your SQL database servers for threats such as SQL injection, brute-force attacks, and privilege abuse. The security service provides security alerts together with details of the suspicious activity and guidance on how to mitigate to the security threats.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_sql_servers_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_sql_servers_is_on/defender_ensure_defender_for_sql_servers_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_sql_servers_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "SqlServerVirtualMachines" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=pricings["SqlServerVirtualMachines"],
                )
                report.subscription = subscription
                report.resource_name = "Defender plan SQL Server VMs"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for SQL Server VMs from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["SqlServerVirtualMachines"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for SQL Server VMs from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_storage_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_storage_is_on/defender_ensure_defender_for_storage_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_storage_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for Storage Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for Storage Is Set To 'On' ",
  "Risk": "Ensure that Microsoft Defender for Cloud is enabled for your Microsoft Azure storage accounts. Defender for storage accounts is an Azure-native layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit your Azure cloud storage accounts.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/defender-storage.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-azure-defender-is-set-to-on-for-storage#terraform"
    },
    "Recommendation": {
      "Text": "By default, Microsoft Defender for Cloud is disabled for your storage accounts. Enabling the Defender security service for Azure storage accounts allows for advanced security defense using threat detection capabilities provided by the Microsoft Security Response Center (MSRC). MSRC investigates all reports of security vulnerabilities affecting Microsoft products and services, including Azure cloud services.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_storage_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_storage_is_on/defender_ensure_defender_for_storage_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_storage_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "StorageAccounts" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=pricings["StorageAccounts"],
                )
                report.subscription = subscription
                report.resource_name = "Defender plan Storage Accounts"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for Storage Accounts from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["StorageAccounts"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for Storage Accounts from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_iot_hub_defender_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_iot_hub_defender_is_on/defender_ensure_iot_hub_defender_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_iot_hub_defender_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for IoT Hub Is Set To 'On'",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "DefenderIoT",
  "Description": "Microsoft Defender for IoT acts as a central security hub for IoT devices within your organization.",
  "Risk": "IoT devices are very rarely patched and can be potential attack vectors for enterprise networks. Updating their network configuration to use a central security hub allows for detection of these breaches.",
  "RelatedUrl": "https://azure.microsoft.com/en-us/services/iot-defender/#overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Go to IoT Hub. 2. Select a IoT Hub to validate. 3. Select Overview in Defender for IoT. 4. Click on Secure your IoT solution, and complete the onboarding.",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-iot/device-builders/quickstart-onboard-iot-hub"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling Microsoft Defender for IoT will incur additional charges dependent on the level of usage."
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_iot_hub_defender_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_iot_hub_defender_is_on/defender_ensure_iot_hub_defender_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_iot_hub_defender_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            iot_security_solutions,
        ) in defender_client.iot_security_solutions.items():
            if not iot_security_solutions:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.status = "FAIL"
                report.subscription = subscription_name
                report.resource_name = "IoT Hub Defender"
                report.resource_id = "IoT Hub Defender"
                report.status_extended = f"No IoT Security Solutions found in the subscription {subscription_name}."
                findings.append(report)
            else:
                for iot_security_solution in iot_security_solutions.values():
                    report = Check_Report_Azure(
                        metadata=self.metadata(),
                        resource=iot_security_solution,
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"The security solution {iot_security_solution.name} is enabled in subscription {subscription_name}."

                    if iot_security_solution.status != "Enabled":
                        report.status = "FAIL"
                        report.status_extended = f"The security solution {iot_security_solution.name} is disabled in subscription {subscription_name}"

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_mcas_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_mcas_is_enabled/defender_ensure_mcas_is_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_mcas_is_enabled",
  "CheckTitle": "Ensure that Microsoft Defender for Cloud Apps integration with Microsoft Defender for Cloud is Selected",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DefenderSettings",
  "Description": "This integration setting enables Microsoft Defender for Cloud Apps (formerly 'Microsoft Cloud App Security' or 'MCAS' - see additional info) to communicate with Microsoft Defender for Cloud.",
  "Risk": "Microsoft Defender for Cloud offers an additional layer of protection by using Azure Resource Manager events, which is considered to be the control plane for Azure. By analyzing the Azure Resource Manager records, Microsoft Defender for Cloud detects unusual or potentially harmful operations in the Azure subscription environment. Several of the preceding analytics are powered by Microsoft Defender for Cloud Apps. To benefit from these analytics, subscription must have a Cloud App Security license. Microsoft Defender for Cloud Apps works only with Standard Tier subscriptions.",
  "RelatedUrl": "https://learn.microsoft.com/en-in/azure/defender-for-cloud/defender-for-cloud-introduction#secure-cloud-applications",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/defender-cloud-apps-integration.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu. 2. Select Microsoft Defender for Cloud. 3. Select Environment Settings blade. 4. Select the subscription. 5. Check App Service Defender Plan to On. 6. Select Save.",
      "Url": "https://docs.microsoft.com/en-us/rest/api/securitycenter/settings/list"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Microsoft Defender for Cloud Apps works with Standard pricing tier Subscription. Choosing the Standard pricing tier of Microsoft Defender for Cloud incurs an additional cost per resource."
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_mcas_is_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_mcas_is_enabled/defender_ensure_mcas_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_mcas_is_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            settings,
        ) in defender_client.settings.items():
            if "MCAS" not in settings:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "MCAS"
                report.resource_id = "MCAS"
                report.status = "FAIL"
                report.status_extended = f"Microsoft Defender for Cloud Apps not exists for subscription {subscription_name}."
            else:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=settings["MCAS"]
                )
                report.subscription = subscription_name
                report.resource_name = "MCAS"
                if settings["MCAS"].enabled:
                    report.status = "PASS"
                    report.status_extended = f"Microsoft Defender for Cloud Apps is enabled for subscription {subscription_name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Microsoft Defender for Cloud Apps is disabled for subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_notify_alerts_severity_is_high.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_notify_alerts_severity_is_high/defender_ensure_notify_alerts_severity_is_high.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_notify_alerts_severity_is_high",
  "CheckTitle": "Ensure that email notifications are configured for alerts with a minimum severity of 'High' or lower",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureEmailNotifications",
  "Description": "Microsoft Defender for Cloud sends email notifications when alerts of a certain severity level or higher are triggered. By setting the minimum severity to 'High', 'Medium', or even 'Low', you ensure that alerts with equal or greater severity (e.g., High or Critical) are still delivered. Selecting a lower threshold like 'Low' results in more comprehensive alert coverage.",
  "Risk": "If this setting is too restrictive (e.g., set to 'Critical' only), important security alerts with 'High' or 'Medium' severity might be missed. Ensuring that 'High' or a lower threshold is configured helps security teams stay informed about significant threats and respond in a timely manner.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/email-notifications-alerts#manage-notifications-on-email",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/enable-high-severity-email-notifications.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/bc_azr_general_4#terraform"
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu. 2. Select Microsoft Defender for Cloud. 3. Click on Environment Settings. 4. Click on the appropriate Management Group, Subscription, or Workspace. 5. Click on Email notifications. 6. Under 'Notify about alerts with the following severity (or higher)', select at least 'High' (or optionally 'Medium' or 'Low' for broader coverage). 7. Click Save.",
      "Url": "https://docs.microsoft.com/en-us/rest/api/securitycenter/securitycontacts/list"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_notify_alerts_severity_is_high.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_notify_alerts_severity_is_high/defender_ensure_notify_alerts_severity_is_high.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_notify_alerts_severity_is_high(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            security_contact_configurations,
        ) in defender_client.security_contact_configurations.items():
            for contact_configuration in security_contact_configurations.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=contact_configuration
                )
                report.resource_name = (
                    contact_configuration.name
                    if contact_configuration.name
                    else "Security Contact"
                )
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"Notifications are not enabled for alerts with a minimum severity of high or lower in subscription {subscription_name}."

                if (
                    contact_configuration.alert_minimal_severity
                    and contact_configuration.alert_minimal_severity != "Critical"
                ):
                    report.status = "PASS"
                    report.status_extended = f"Notifications are enabled for alerts with a minimum severity of high or lower ({contact_configuration.alert_minimal_severity}) in subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_notify_emails_to_owners.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_notify_emails_to_owners/defender_ensure_notify_emails_to_owners.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_notify_emails_to_owners",
  "CheckTitle": "Ensure That 'All users with the following roles' is set to 'Owner'",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureEmailNotifications",
  "Description": "Enable security alert emails to subscription owners.",
  "Risk": "Enabling security alert emails to subscription owners ensures that they receive security alert emails from Microsoft. This ensures that they are aware of any potential security issues and can mitigate the risk in a timely fashion.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/security-center/security-center-provide-security-contact-details",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/email-to-subscription-owners.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Defender for Cloud 3. Click on Environment Settings 4. Click on the appropriate Management Group, Subscription, or Workspace 5. Click on Email notifications 6. In the drop down of the All users with the following roles field select Owner 7. Click Save",
      "Url": "https://docs.microsoft.com/en-us/rest/api/securitycenter/securitycontacts/list"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_notify_emails_to_owners.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_notify_emails_to_owners/defender_ensure_notify_emails_to_owners.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_notify_emails_to_owners(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            security_contact_configurations,
        ) in defender_client.security_contact_configurations.items():
            for contact_configuration in security_contact_configurations.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=contact_configuration,
                )
                report.resource_name = (
                    contact_configuration.name
                    if contact_configuration.name
                    else "Security Contact"
                )
                report.subscription = subscription_name
                if (
                    contact_configuration.notifications_by_role.state
                    and "Owner" in contact_configuration.notifications_by_role.roles
                ):
                    report.status = "PASS"
                    report.status_extended = f"The Owner role is notified for subscription {subscription_name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"The Owner role is not notified for subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_system_updates_are_applied.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_system_updates_are_applied/defender_ensure_system_updates_are_applied.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_system_updates_are_applied",
  "CheckTitle": "Ensure that Microsoft Defender Recommendation for 'Apply system updates' status is 'Completed'",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderRecommendation",
  "Description": "Ensure that the latest OS patches for all virtual machines are applied.",
  "Risk": "The Azure Security Center retrieves a list of available security and critical updates from Windows Update or Windows Server Update Services (WSUS), depending on which service is configured on a Windows VM. The security center also checks for the latest updates in Linux systems. If a VM is missing a system update, the security center will recommend system updates be applied.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-posture-vulnerability-management#pv-7-rapidly-and-automatically-remediate-software-vulnerabilities",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/apply-latest-os-patches.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Follow Microsoft Azure documentation to apply security patches from the security center. Alternatively, you can employ your own patch assessment and management tool to periodically assess, report, and install the required security patches for your OS.",
      "Url": "https://learn.microsoft.com/en-us/azure/virtual-machines/updates-maintenance-overview"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Running Microsoft Defender for Cloud incurs additional charges for each resource monitored. Please see attached reference for exact charges per hour."
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_system_updates_are_applied.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_system_updates_are_applied/defender_ensure_system_updates_are_applied.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_system_updates_are_applied(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            assessments,
        ) in defender_client.assessments.items():
            if (
                "Log Analytics agent should be installed on virtual machines"
                in assessments
                and "Machines should be configured to periodically check for missing system updates"
                in assessments
                and "System updates should be installed on your machines" in assessments
            ):
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=assessments[
                        "System updates should be installed on your machines"
                    ],
                )
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"System updates are applied for all the VMs in the subscription {subscription_name}."

                if (
                    assessments[
                        "Log Analytics agent should be installed on virtual machines"
                    ].status
                    == "Unhealthy"
                    or assessments[
                        "Machines should be configured to periodically check for missing system updates"
                    ].status
                    == "Unhealthy"
                    or assessments[
                        "System updates should be installed on your machines"
                    ].status
                    == "Unhealthy"
                ):
                    report.status = "FAIL"
                    report.status_extended = f"System updates are not applied for all the VMs in the subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_wdatp_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_wdatp_is_enabled/defender_ensure_wdatp_is_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_wdatp_is_enabled",
  "CheckTitle": "Ensure that Microsoft Defender for Endpoint integration with Microsoft Defender for Cloud is selected",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DefenderSettings",
  "Description": "This integration setting enables Microsoft Defender for Endpoint (formerly 'Advanced Threat Protection' or 'ATP' or 'WDATP' - see additional info) to communicate with Microsoft Defender for Cloud.",
  "Risk": "Microsoft Defender for Endpoint integration brings comprehensive Endpoint Detection and Response (EDR) capabilities within Microsoft Defender for Cloud. This integration helps to spot abnormalities, as well as detect and respond to advanced attacks on endpoints monitored by Microsoft Defender for Cloud. MDE works only with Standard Tier subscriptions.",
  "RelatedUrl": "https://learn.microsoft.com/en-in/azure/defender-for-cloud/integration-defender-for-endpoint?tabs=windows",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/defender-endpoint-integration.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/azure-server-integration?view=o365-worldwide"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Microsoft Defender for Endpoint works with Standard pricing tier Subscription. Choosing the Standard pricing tier of Microsoft Defender for Cloud incurs an additional cost per resource."
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_wdatp_is_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_wdatp_is_enabled/defender_ensure_wdatp_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_wdatp_is_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            settings,
        ) in defender_client.settings.items():
            if "WDATP" not in settings:
                report = Check_Report_Azure(metadata=self.metadata(), resource={})
                report.subscription = subscription_name
                report.resource_name = "WDATP"
                report.resource_id = "WDATP"
                report.status = "FAIL"
                report.status_extended = f"Microsoft Defender for Endpoint integration not exists for subscription {subscription_name}."
            else:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=settings["WDATP"]
                )
                report.subscription = subscription_name
                report.resource_name = "WDATP"
                if settings["WDATP"].enabled:
                    report.status = "PASS"
                    report.status_extended = f"Microsoft Defender for Endpoint integration is enabled for subscription {subscription_name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Microsoft Defender for Endpoint integration is disabled for subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_client.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_client.py

```python
from prowler.providers.azure.services.entra.entra_service import Entra
from prowler.providers.common.provider import Provider

entra_client = Entra(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
