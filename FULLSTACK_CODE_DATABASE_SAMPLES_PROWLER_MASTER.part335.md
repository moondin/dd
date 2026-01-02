---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 335
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 335 of 867)

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

---[FILE: defender_container_images_resolved_vulnerabilities.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_container_images_resolved_vulnerabilities/defender_container_images_resolved_vulnerabilities.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_container_images_resolved_vulnerabilities",
  "CheckTitle": "Container images used by containers should have vulnerabilities resolved",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Security/assessments",
  "Description": "Container images used by containers should have vulnerabilities resolved. Azure Defender for Container Registries can help you identify and resolve vulnerabilities in your container images. It provides vulnerability scanning and prioritized security recommendations for your container images. You can use Azure Defender for Container Registries to scan your container images for vulnerabilities and get prioritized security recommendations to resolve them. You can also use Azure Defender for Container Registries to monitor your container registries for security threats and get prioritized security recommendations to resolve them. Azure Defender for Container Registries integrates with Azure Security Center to provide a unified view of security across your container registries and other Azure resources. Azure Defender for Container Registries is part of Azure Defender, which provides advanced threat protection for your hybrid workloads. Azure Defender uses advanced analytics and global threat intelligence to detect attacks that might otherwise go unnoticed.",
  "Risk": "If vulnerabilities are not resolved, attackers can exploit them to gain unauthorized access to your containerized applications and data.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-check-health",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "",
      "Url": "https://learn.microsoft.com/en-us/azure/container-registry/scan-images-defender"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_container_images_resolved_vulnerabilities.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_container_images_resolved_vulnerabilities/defender_container_images_resolved_vulnerabilities.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_container_images_resolved_vulnerabilities(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            assessments,
        ) in defender_client.assessments.items():
            if (
                "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)"
                in assessments
                and getattr(
                    assessments[
                        "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)"
                    ],
                    "status",
                    "NotApplicable",
                )
                != "NotApplicable"
            ):
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=assessments[
                        "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)"
                    ],
                )
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"Azure running container images do not have unresolved vulnerabilities in subscription '{subscription_name}'."
                if (
                    assessments[
                        "Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)"
                    ].status
                    == "Unhealthy"
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Azure running container images have unresolved vulnerabilities in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_container_images_scan_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_container_images_scan_enabled/defender_container_images_scan_enabled.metadata.json
Signals: Docker

```json
{
  "Provider": "azure",
  "CheckID": "defender_container_images_scan_enabled",
  "CheckTitle": "Ensure Image Vulnerability Scanning using Azure Defender image scanning or a third party provider",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Security",
  "Description": "Scan images being deployed to Azure (AKS) for vulnerabilities. Vulnerability scanning for images stored in Azure Container Registry is generally available in Azure Security Center. This capability is powered by Qualys, a leading provider of information security. When you push an image to Container Registry, Security Center automatically scans it, then checks for known vulnerabilities in packages or dependencies defined in the file. When the scan completes (after about 10 minutes), Security Center provides details and a security classification for each vulnerability detected, along with guidance on how to remediate issues and protect vulnerable attack surfaces.",
  "Risk": "Vulnerabilities in software packages can be exploited by hackers or malicious users to obtain unauthorized access to local cloud resources. Azure Defender and other third party products allow images to be scanned for known vulnerabilities.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/container-registry/container-registry-check-health",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "",
      "Url": "https://learn.microsoft.com/en-us/azure/container-registry/scan-images-defender"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "When using an Azure container registry, you might occasionally encounter problems. For example, you might not be able to pull a container image because of an issue with Docker in your local environment. Or, a network issue might prevent you from connecting to the registry."
}
```

--------------------------------------------------------------------------------

---[FILE: defender_container_images_scan_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_container_images_scan_enabled/defender_container_images_scan_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_container_images_scan_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "Containers" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["Containers"]
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = (
                    f"Container image scan is enabled in subscription {subscription}."
                )
                if not pricings["Containers"].extensions.get(
                    "ContainerRegistriesVulnerabilityAssessments"
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Container image scan is disabled in subscription {subscription}."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_app_services_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_app_services_is_on/defender_ensure_defender_for_app_services_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_app_services_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for App Services Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for App Services Is Set To 'On' ",
  "Risk": "Turning on Microsoft Defender for App Service enables threat detection for App Service, providing threat intelligence, anomaly detection, and behavior analytics in the Microsoft Defender for Cloud.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/defender-app-service.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-azure-defender-is-set-to-on-for-app-service#terraform"
    },
    "Recommendation": {
      "Text": "By default, Microsoft Defender for Cloud is not enabled for your App Service instances. Enabling the Defender security service for App Service instances allows for advanced security defense using threat detection capabilities provided by Microsoft Security Response Center.",
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

---[FILE: defender_ensure_defender_for_app_services_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_app_services_is_on/defender_ensure_defender_for_app_services_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_app_services_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "AppServices" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["AppServices"]
                )
                report.subscription = subscription
                report.resource_name = "Defender plan App Services"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for App Services from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["AppServices"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for App Services from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_arm_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_arm_is_on/defender_ensure_defender_for_arm_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_arm_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for Azure Resource Manager Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for Azure Resource Manager Is Set To 'On' ",
  "Risk": "Scanning resource requests lets you be alerted every time there is suspicious activity in order to prevent a security threat from being introduced.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable  Microsoft Defender for Azure Resource Manager",
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

---[FILE: defender_ensure_defender_for_arm_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_arm_is_on/defender_ensure_defender_for_arm_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_arm_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "Arm" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["Arm"]
                )
                report.subscription = subscription
                report.resource_name = "Defender plan ARM"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for ARM from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["Arm"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for ARM from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_azure_sql_databases_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_azure_sql_databases_is_on/defender_ensure_defender_for_azure_sql_databases_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_azure_sql_databases_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for Azure SQL Databases Is Set To 'On'  ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for Azure SQL Databases Is Set To 'On'  ",
  "Risk": "Turning on Microsoft Defender for Azure SQL Databases enables threat detection for Azure SQL database servers, providing threat intelligence, anomaly detection, and behavior analytics in the Microsoft Defender for Cloud.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/defender-azure-sql.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-azure-defender-is-set-to-on-for-azure-sql-database-servers#terraform"
    },
    "Recommendation": {
      "Text": "By default, Microsoft Defender for Cloud is disabled for all your SQL database servers. Defender for Cloud monitors your SQL database servers for threats such as SQL injection, brute-force attacks, and privilege abuse. The security service provides action-oriented security alerts with details of the suspicious activity and guidance on how to mitigate the security threats.",
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

---[FILE: defender_ensure_defender_for_azure_sql_databases_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_azure_sql_databases_is_on/defender_ensure_defender_for_azure_sql_databases_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_azure_sql_databases_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "SqlServers" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["SqlServers"]
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for Azure SQL DB Servers from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["SqlServers"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for Azure SQL DB Servers from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_containers_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_containers_is_on/defender_ensure_defender_for_containers_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_containers_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for Containers Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for Containers Is Set To 'On' ",
  "Risk": "Ensure that Microsoft Defender for Cloud is enabled for all your Azure containers. Turning on the Defender for Cloud service enables threat detection for containers, providing threat intelligence, anomaly detection, and behavior analytics.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/defender-container.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-azure-defender-is-set-to-on-for-container-registries#terraform"
    },
    "Recommendation": {
      "Text": "By default, Microsoft Defender for Cloud is not enabled for your Azure cloud containers. Enabling the Defender security service for Azure containers allows for advanced security defense against threats, using threat detection capabilities provided by the Microsoft Security Response Center (MSRC).",
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

---[FILE: defender_ensure_defender_for_containers_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_containers_is_on/defender_ensure_defender_for_containers_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_containers_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "Containers" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["Containers"]
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for Containers from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["Containers"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for Containers from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_cosmosdb_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_cosmosdb_is_on/defender_ensure_defender_for_cosmosdb_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_cosmosdb_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for Cosmos DB Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for Cosmos DB Is Set To 'On' ",
  "Risk": "In scanning Cosmos DB requests within a subscription, requests are compared to a heuristic list of potential security threats. These threats could be a result of a security breach within your services, thus scanning for them could prevent a potential security threat from being introduced.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "By default, Microsoft Defender for Cloud is not enabled for your App Service instances. Enabling the Defender security service for App Service instances allows for advanced security defense using threat detection capabilities provided by Microsoft Security Response Center.",
      "Url": "Enable Microsoft Defender for Cosmos DB"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_cosmosdb_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_cosmosdb_is_on/defender_ensure_defender_for_cosmosdb_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_cosmosdb_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "CosmosDbs" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["CosmosDbs"]
                )
                report.subscription = subscription
                report.resource_name = "Defender plan Cosmos DB"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for Cosmos DB from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["CosmosDbs"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for Cosmos DB from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_databases_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_databases_is_on/defender_ensure_defender_for_databases_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_databases_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for Databases Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for Databases Is Set To 'On' ",
  "Risk": "Enabling Microsoft Defender for Azure SQL Databases allows your organization more granular control of the infrastructure running your database software",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Microsoft Defender for Azure SQL Databases",
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

---[FILE: defender_ensure_defender_for_databases_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_databases_is_on/defender_ensure_defender_for_databases_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_databases_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if (
                "SqlServers" in pricings
                and "SqlServerVirtualMachines" in pricings
                and "OpenSourceRelationalDatabases" in pricings
                and "CosmosDbs" in pricings
            ):
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["SqlServers"]
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for Databases from subscription {subscription} is set to ON (pricing tier standard)."
                if (
                    pricings["SqlServers"].pricing_tier != "Standard"
                    or pricings["SqlServerVirtualMachines"].pricing_tier != "Standard"
                    or pricings["OpenSourceRelationalDatabases"].pricing_tier
                    != "Standard"
                    or pricings["CosmosDbs"].pricing_tier != "Standard"
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for Databases from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_dns_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_dns_is_on/defender_ensure_defender_for_dns_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_dns_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for DNS Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for DNS Is Set To 'On' ",
  "Risk": "DNS lookups within a subscription are scanned and compared to a dynamic list of websites that might be potential security threats. These threats could be a result of a security breach within your services, thus scanning for them could prevent a potential security threat from being introduced.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "By default, Microsoft Defender for Cloud is not enabled for your App Service instances. Enabling the Defender security service for App Service instances allows for advanced security defense using threat detection capabilities provided by Microsoft Security Response Center.",
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

---[FILE: defender_ensure_defender_for_dns_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_dns_is_on/defender_ensure_defender_for_dns_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_dns_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "Dns" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["Dns"]
                )
                report.subscription = subscription
                report.resource_name = "Defender plan DNS"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for DNS from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["Dns"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for DNS from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_keyvault_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_keyvault_is_on/defender_ensure_defender_for_keyvault_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_keyvault_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for KeyVault Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for KeyVault Is Set To 'On' ",
  "Risk": "By default, Microsoft Defender for Cloud is disabled for Azure key vaults. Defender for Cloud detects unusual and potentially harmful attempts to access or exploit your Azure Key Vault data. This layer of protection allows you to address threats without being a security expert, and without the need to use and manage third-party security monitoring tools or services.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/defender-key-vault.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-azure-defender-is-set-to-on-for-key-vault#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that Microsoft Defender for Cloud is enabled for Azure key vaults. Key Vault is the Azure cloud service that safeguards encryption keys and secrets like certificates, connection-based strings, and passwords.",
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

---[FILE: defender_ensure_defender_for_keyvault_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_keyvault_is_on/defender_ensure_defender_for_keyvault_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_keyvault_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "KeyVaults" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=pricings["KeyVaults"]
                )
                report.subscription = subscription
                report.resource_name = "Defender plan KeyVaults"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for KeyVaults from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["KeyVaults"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for KeyVaults from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_os_relational_databases_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_os_relational_databases_is_on/defender_ensure_defender_for_os_relational_databases_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_os_relational_databases_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for Open-Source Relational Databases Is Set To 'On' ",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for Open-Source Relational Databases Is Set To 'On' ",
  "Risk": "Turning on Microsoft Defender for Open-source relational databases enables threat detection for Open-source relational databases, providing threat intelligence, anomaly detection, and behavior analytics in the Microsoft Defender for Cloud.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enabling Microsoft Defender for Open-source relational databases allows for greater defense-in-depth, with threat detection provided by the Microsoft Security Response Center (MSRC).",
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

---[FILE: defender_ensure_defender_for_os_relational_databases_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_os_relational_databases_is_on/defender_ensure_defender_for_os_relational_databases_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_os_relational_databases_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "OpenSourceRelationalDatabases" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=pricings["OpenSourceRelationalDatabases"],
                )
                report.subscription = subscription
                report.resource_name = "Defender plan Open-Source Relational Databases"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for Open-Source Relational Databases from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["OpenSourceRelationalDatabases"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for Open-Source Relational Databases from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_ensure_defender_for_server_is_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_server_is_on/defender_ensure_defender_for_server_is_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_ensure_defender_for_server_is_on",
  "CheckTitle": "Ensure That Microsoft Defender for Servers Is Set to 'On'",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure That Microsoft Defender for Servers Is Set to 'On'",
  "Risk": "Turning on Microsoft Defender for Servers enables threat detection for Servers, providing threat intelligence, anomaly detection, and behavior analytics in the Microsoft Defender for Cloud.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/microsoft-defender-vm-server.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-azure-defender-is-set-to-on-for-servers#terraform"
    },
    "Recommendation": {
      "Text": "Enabling Microsoft Defender for Cloud standard pricing tier allows for better security assessment with threat detection provided by the Microsoft Security Response Center (MSRC), advanced security policies, adaptive application control, network threat detection, and regulatory compliance management.",
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

---[FILE: defender_ensure_defender_for_server_is_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_ensure_defender_for_server_is_on/defender_ensure_defender_for_server_is_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_ensure_defender_for_server_is_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, pricings in defender_client.pricings.items():
            if "VirtualMachines" in pricings:
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=pricings["VirtualMachines"],
                )
                report.subscription = subscription
                report.resource_name = "Defender plan Servers"
                report.status = "PASS"
                report.status_extended = f"Defender plan Defender for Servers from subscription {subscription} is set to ON (pricing tier standard)."
                if pricings["VirtualMachines"].pricing_tier != "Standard":
                    report.status = "FAIL"
                    report.status_extended = f"Defender plan Defender for Servers from subscription {subscription} is set to OFF (pricing tier not standard)."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
