---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 334
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 334 of 867)

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

---[FILE: databricks_workspace_vnet_injection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/databricks/databricks_workspace_vnet_injection_enabled/databricks_workspace_vnet_injection_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "databricks_workspace_vnet_injection_enabled",
  "CheckTitle": "Ensure Azure Databricks workspaces are deployed in a customer-managed VNet (VNet Injection)",
  "CheckType": [],
  "ServiceName": "databricks",
  "SubServiceName": "",
  "ResourceIdTemplate": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Databricks/workspaces/{workspaceName}",
  "Severity": "medium",
  "ResourceType": "AzureDatabricksWorkspace",
  "Description": "Checks whether Azure Databricks workspaces are deployed in a customer-managed Virtual Network (VNet Injection) instead of a Databricks-managed VNet.",
  "Risk": "Using a Databricks-managed VNet limits control over network security policies, firewall configurations, and routing, increasing the risk of unauthorized access or data exfiltration.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject",
  "Remediation": {
    "Code": {
      "CLI": "az databricks workspace create --name <databricks-workspace-name> --resource-group <resource-group-name> --location <region> --managed-resource-group <managed-rg-name> --enable-no-public-ip true --network-security-group-rule \"NoAzureServices\" --public-network-access Disabled --custom-virtual-network-id /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<vnet-name>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Deploy Databricks workspaces into a customer-managed VNet to ensure better control over network security and compliance.",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Databricks/check-for-vnet-injection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: databricks_workspace_vnet_injection_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/databricks/databricks_workspace_vnet_injection_enabled/databricks_workspace_vnet_injection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.databricks.databricks_client import (
    databricks_client,
)


class databricks_workspace_vnet_injection_enabled(Check):
    """
    Ensure Azure Databricks workspaces are deployed in a customer-managed VNet (VNet Injection).

    This check evaluates whether each Azure Databricks workspace in the subscription is configured to use VNet Injection, meaning it is deployed in a customer-managed virtual network (VNet).

    - PASS: The workspace is deployed in a customer-managed VNet (custom_managed_vnet_id is set).
    - FAIL: The workspace is not deployed in a customer-managed VNet (VNet Injection is not enabled).
    """

    def execute(self):
        findings = []
        for subscription, workspaces in databricks_client.workspaces.items():
            for workspace in workspaces.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=workspace
                )
                report.subscription = subscription
                if workspace.custom_managed_vnet_id:
                    report.status = "PASS"
                    report.status_extended = f"Databricks workspace {workspace.name} in subscription {subscription} is deployed in a customer-managed VNet ({workspace.custom_managed_vnet_id})."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Databricks workspace {workspace.name} in subscription {subscription} is not deployed in a customer-managed VNet (VNet Injection is not enabled)."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_client.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_client.py

```python
from prowler.providers.azure.services.defender.defender_service import Defender
from prowler.providers.common.provider import Provider

defender_client = Defender(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: defender_service.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_service.py
Signals: Pydantic

```python
from datetime import timedelta
from typing import Dict, Optional

import requests
from azure.core.exceptions import ClientAuthenticationError, ResourceNotFoundError
from azure.mgmt.security import SecurityCenter
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class Defender(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(SecurityCenter, provider)

        self.pricings = self._get_pricings()
        self.auto_provisioning_settings = self._get_auto_provisioning_settings()
        self.assessments = self._get_assessments()
        self.settings = self._get_settings()
        self.security_contact_configurations = self._get_security_contacts(
            token=provider.session.get_token(
                "https://management.azure.com/.default"
            ).token
        )
        self.iot_security_solutions = self._get_iot_security_solutions()
        self.jit_policies = self._get_jit_policies()

    def _get_pricings(self):
        logger.info("Defender - Getting pricings...")
        pricings = {}
        for subscription_name, client in self.clients.items():
            try:
                pricings_list = client.pricings.list(
                    scope_id=f"subscriptions/{self.subscriptions[subscription_name]}"
                )
                pricings.update({subscription_name: {}})
                for pricing in pricings_list.value:
                    pricings[subscription_name].update(
                        {
                            pricing.name: Pricing(
                                resource_id=pricing.id,
                                resource_name=pricing.name,
                                pricing_tier=getattr(pricing, "pricing_tier", None),
                                free_trial_remaining_time=pricing.free_trial_remaining_time,
                                extensions=dict(
                                    [
                                        (extension.name, extension.is_enabled)
                                        for extension in (
                                            pricing.extensions
                                            if getattr(pricing, "extensions", None)
                                            else []
                                        )
                                    ]
                                ),
                            )
                        }
                    )
            except ResourceNotFoundError as error:
                if "Subscription Not Registered" in error.message:
                    logger.error(
                        f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: Subscription Not Registered - Please register to Microsoft.Security in order to view your security status"
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return pricings

    def _get_auto_provisioning_settings(self):
        logger.info("Defender - Getting auto provisioning settings...")
        auto_provisioning = {}
        for subscription_name, client in self.clients.items():
            try:
                auto_provisioning_settings = client.auto_provisioning_settings.list()
                auto_provisioning.update({subscription_name: {}})
                for ap in auto_provisioning_settings:
                    auto_provisioning[subscription_name].update(
                        {
                            ap.name: AutoProvisioningSetting(
                                resource_id=ap.id,
                                resource_name=ap.name,
                                resource_type=ap.type,
                                auto_provision=ap.auto_provision,
                            )
                        }
                    )
            except ClientAuthenticationError as error:
                if "Subscription Not Registered" in error.message:
                    logger.error(
                        f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: Subscription Not Registered - Please register to Microsoft.Security in order to view your security status"
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return auto_provisioning

    def _get_assessments(self):
        logger.info("Defender - Getting assessments...")
        assessments = {}
        for subscription_name, client in self.clients.items():
            try:
                assessments_list = client.assessments.list(
                    f"subscriptions/{self.subscriptions[subscription_name]}"
                )
                assessments.update({subscription_name: {}})
                for assessment in assessments_list:
                    assessments[subscription_name].update(
                        {
                            assessment.display_name: Assesment(
                                resource_id=assessment.id,
                                resource_name=assessment.name,
                                status=getattr(
                                    getattr(assessment, "status", None), "code", None
                                ),
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return assessments

    def _get_settings(self):
        logger.info("Defender - Getting settings...")
        settings = {}
        for subscription_name, client in self.clients.items():
            try:
                settings_list = client.settings.list()
                settings.update({subscription_name: {}})
                for setting in settings_list:
                    settings[subscription_name].update(
                        {
                            setting.name: Setting(
                                resource_id=setting.id,
                                resource_type=setting.type,
                                kind=setting.kind,
                                enabled=setting.enabled,
                            )
                        }
                    )
            except ClientAuthenticationError as error:
                if "Subscription Not Registered" in error.message:
                    logger.error(
                        f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: Subscription Not Registered - Please register to Microsoft.Security in order to view your security status"
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return settings

    def _get_security_contacts(self, token: str) -> dict[str, dict]:
        """
        Get all security contacts configuration for all subscriptions.

        Args:
            token: The authentication token to make the request.

        Returns:
            A dictionary of security contacts for all subscriptions.
        """
        logger.info("Defender - Getting security contacts...")
        security_contacts = {}
        for subscription_name, subscription_id in self.subscriptions.items():
            try:
                url = f"https://management.azure.com/subscriptions/{subscription_id}/providers/Microsoft.Security/securityContacts?api-version=2023-12-01-preview"
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                }
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                contact_configurations = response.json().get("value", [])
                security_contacts[subscription_name] = {}
                for contact_configuration in contact_configurations:
                    props = contact_configuration.get("properties", {})

                    # Map notificationsByRole.state from "On"/"Off" to boolean
                    notifications_by_role_state = props.get(
                        "notificationsByRole", {}
                    ).get("state", "Off")
                    notifications_by_role_state_bool = (
                        notifications_by_role_state.lower() == "on"
                    )
                    notifications_by_role_roles = props.get(
                        "notificationsByRole", {}
                    ).get("roles", [])

                    # Extract minimalRiskLevel and minimalSeverity from notificationsSources
                    attack_path_minimal_risk_level = None
                    alert_minimal_severity = None
                    for source in props.get("notificationsSources", []):
                        if source.get("sourceType") == "AttackPath":
                            value = source.get("minimalRiskLevel")
                            if value is not None:
                                attack_path_minimal_risk_level = value
                        elif source.get("sourceType") == "Alert":
                            value = source.get("minimalSeverity")
                            if value is not None:
                                alert_minimal_severity = value

                    security_contacts[subscription_name][
                        contact_configuration.get("name", "default")
                    ] = SecurityContactConfiguration(
                        id=contact_configuration.get("id", ""),
                        name=contact_configuration.get("name", "default"),
                        enabled=props.get("isEnabled", False),
                        emails=props.get("emails", "").split(";"),
                        phone=props.get("phone", ""),
                        notifications_by_role=NotificationsByRole(
                            state=notifications_by_role_state_bool,
                            roles=notifications_by_role_roles,
                        ),
                        attack_path_minimal_risk_level=attack_path_minimal_risk_level,
                        alert_minimal_severity=alert_minimal_severity,
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return security_contacts

    def _get_iot_security_solutions(self):
        logger.info("Defender - Getting IoT Security Solutions...")
        iot_security_solutions = {}
        for subscription_name, client in self.clients.items():
            try:
                iot_security_solutions_list = (
                    client.iot_security_solution.list_by_subscription()
                )
                iot_security_solutions.update({subscription_name: {}})
                for iot_security_solution in iot_security_solutions_list:
                    iot_security_solutions[subscription_name].update(
                        {
                            iot_security_solution.id: IoTSecuritySolution(
                                resource_id=iot_security_solution.id,
                                name=iot_security_solution.name,
                                status=iot_security_solution.status,
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return iot_security_solutions

    def _get_jit_policies(self) -> dict[str, dict]:
        """
        Get all JIT policies for all subscriptions.

        Returns:
            A dictionary of JIT policies for each subscription. The format will be:
            {
                "subscription_name": {
                    "jit_policy_id": JITPolicy
                }
            }
        """
        logger.info("Defender - Getting JIT policies...")
        jit_policies = {}
        for subscription_name, client in self.clients.items():
            try:
                jit_policies[subscription_name] = {}
                policies = client.jit_network_access_policies.list()
                for policy in policies:
                    vm_ids = set()
                    for vm in getattr(policy, "virtual_machines", []):
                        vm_ids.add(vm.id)
                    jit_policies[subscription_name].update(
                        {
                            policy.id: JITPolicy(
                                id=policy.id,
                                name=policy.name,
                                location=getattr(policy, "location", "Global"),
                                vm_ids=vm_ids,
                            ),
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return jit_policies


class Pricing(BaseModel):
    resource_id: str
    resource_name: str
    pricing_tier: str
    free_trial_remaining_time: timedelta
    extensions: Dict[str, bool] = {}


class AutoProvisioningSetting(BaseModel):
    resource_id: str
    resource_name: str
    resource_type: str
    auto_provision: str


class Assesment(BaseModel):
    resource_id: str
    resource_name: str
    status: Optional[str] = None


class Setting(BaseModel):
    resource_id: str
    resource_type: str
    kind: str
    enabled: bool


class NotificationsByRole(BaseModel):
    """
    Defines whether to send email notifications from Microsoft Defender for Cloud to persons with specific RBAC roles on the subscription.

    Attributes:
        state: Whether notifications by role are enabled.
        roles: List of Azure roles (e.g., 'Owner', 'Admin') to be notified.
    """

    state: bool
    roles: list[str]


class SecurityContactConfiguration(BaseModel):
    """
    Represents the configuration of an Azure Security Center security contact.

    Attributes:
        id: The unique resource ID of the security contact.
        name: The name of the security contact (usually 'default').
        enabled: Whether the security contact is enabled. If enabled, the security contact will receive notifications, otherwise it will not.
        emails: List of email addresses to notify.
        phone: Contact phone number.
        notifications_by_role: Defines whether to send email notifications from Microsoft Defender for Cloud to persons with specific RBAC roles on the subscription.
        attack_path_minimal_risk_level: Minimal risk level for Attack Path notifications (e.g., 'Critical').
        alert_minimal_severity: Minimal severity for Alert notifications (e.g., 'Medium').
    """

    id: str
    name: str
    enabled: bool
    emails: list[str]
    phone: Optional[str] = None
    notifications_by_role: NotificationsByRole
    attack_path_minimal_risk_level: Optional[str] = None
    alert_minimal_severity: Optional[str] = None


class IoTSecuritySolution(BaseModel):
    resource_id: str
    name: str
    status: str


class JITPolicy(BaseModel):
    id: str
    name: str
    location: str = ""
    vm_ids: list[str] = []
```

--------------------------------------------------------------------------------

---[FILE: defender_additional_email_configured_with_a_security_contact.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_additional_email_configured_with_a_security_contact/defender_additional_email_configured_with_a_security_contact.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_additional_email_configured_with_a_security_contact",
  "CheckTitle": "Ensure 'Additional email addresses' is Configured with a Security Contact Email",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureEmailNotifications",
  "Description": "Microsoft Defender for Cloud emails the subscription owners whenever a high-severity alert is triggered for their subscription. You should provide a security contact email address as an additional email address.",
  "Risk": "Microsoft Defender for Cloud emails the Subscription Owner to notify them about security alerts. Adding your Security Contact's email address to the 'Additional email addresses' field ensures that your organization's Security Team is included in these alerts. This ensures that the proper people are aware of any potential compromise in order to mitigate the risk in a timely fashion.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/security-center/security-center-provide-security-contact-details",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/SecurityCenter/security-contact-email.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-security-contact-emails-is-set#terraform"
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Defender for Cloud 3. Click on Environment Settings 4. Click on the appropriate Management Group, Subscription, or Workspace 5. Click on Email notifications 6. Enter a valid security contact email address (or multiple addresses separated by commas) in the Additional email addresses field 7. Click Save",
      "Url": "https://learn.microsoft.com/en-us/rest/api/defenderforcloud/security-contacts/list?view=rest-defenderforcloud-2020-01-01-preview&tabs=HTTP"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_additional_email_configured_with_a_security_contact.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_additional_email_configured_with_a_security_contact/defender_additional_email_configured_with_a_security_contact.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_additional_email_configured_with_a_security_contact(Check):
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

                if len(contact_configuration.emails) > 0:
                    report.status = "PASS"
                    report.status_extended = f"There is another correct email configured for subscription {subscription_name}."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"There is not another correct email configured for subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_assessments_vm_endpoint_protection_installed.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_assessments_vm_endpoint_protection_installed/defender_assessments_vm_endpoint_protection_installed.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_assessments_vm_endpoint_protection_installed",
  "CheckTitle": "Ensure that Endpoint Protection for all Virtual Machines is installed",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Security/assessments",
  "Description": "Install endpoint protection for all virtual machines.",
  "Risk": "Installing endpoint protection systems (like anti-malware for Azure) provides for real-time protection capability that helps identify and remove viruses, spyware, and other malicious software. These also offer configurable alerts when known-malicious or unwanted software attempts to install itself or run on Azure systems.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/security/fundamentals/antimalware",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/VirtualMachines/install-endpoint-protection.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Follow Microsoft Azure documentation to install endpoint protection from the security center. Alternatively, you can employ your own endpoint protection tool for your OS.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Endpoint protection will incur an additional cost to you."
}
```

--------------------------------------------------------------------------------

---[FILE: defender_assessments_vm_endpoint_protection_installed.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_assessments_vm_endpoint_protection_installed/defender_assessments_vm_endpoint_protection_installed.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_assessments_vm_endpoint_protection_installed(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            assessments,
        ) in defender_client.assessments.items():
            if (
                "Install endpoint protection solution on virtual machines"
                in assessments
            ):
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=assessments[
                        "Install endpoint protection solution on virtual machines"
                    ],
                )
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"Endpoint protection is set up in all VMs in subscription {subscription_name}."

                if (
                    assessments[
                        "Install endpoint protection solution on virtual machines"
                    ].status
                    == "Unhealthy"
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Endpoint protection is not set up in all VMs in subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_attack_path_notifications_properly_configured.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_attack_path_notifications_properly_configured/defender_attack_path_notifications_properly_configured.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_attack_path_notifications_properly_configured",
  "CheckTitle": "Ensure that email notifications for attack paths are enabled with minimal risk level",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureEmailNotifications",
  "Description": "Ensure that Microsoft Defender for Cloud is configured to send email notifications for attack paths identified in the Azure subscription with an appropriate minimal risk level.",
  "Risk": "If attack path notifications are not enabled, security teams may not be promptly informed about exploitable attack sequences, increasing the risk of delayed mitigation and potential breaches.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/configure-email-notifications",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/configure-email-notifications",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable attack path email notifications in Microsoft Defender for Cloud to ensure that security teams are notified when potential attack paths are identified. Configure the minimal risk level as appropriate for your organization.",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/configure-email-notifications"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_attack_path_notifications_properly_configured.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_attack_path_notifications_properly_configured/defender_attack_path_notifications_properly_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_attack_path_notifications_properly_configured(Check):
    """
    Ensure that email notifications for attack paths are enabled.

    This check evaluates whether Microsoft Defender for Cloud is configured to send email notifications for attack paths in each Azure subscription.
    - PASS: Notifications are enabled for attack paths with a risk level set (not None) and equal or higher than the configured minimum.
    - FAIL: Notifications are not enabled for attack paths in the subscription or the risk level is too low.
    """

    def execute(self) -> list[Check_Report_Azure]:
        findings = []

        # Get the minimal risk level from config, default to 'High'
        risk_levels = ["Low", "Medium", "High", "Critical"]
        min_risk_level = defender_client.audit_config.get(
            "defender_attack_path_minimal_risk_level", "High"
        )
        if min_risk_level not in risk_levels:
            min_risk_level = "High"
        min_risk_index = risk_levels.index(min_risk_level)

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
                actual_risk_level = getattr(
                    contact_configuration, "attack_path_minimal_risk_level", None
                )
                if not actual_risk_level or actual_risk_level not in risk_levels:
                    report.status = "FAIL"
                    report.status_extended = f"Attack path notifications are not enabled in subscription {subscription_name} for security contact {contact_configuration.name}."
                else:
                    actual_risk_index = risk_levels.index(actual_risk_level)
                    if actual_risk_index <= min_risk_index:
                        report.status = "PASS"
                        report.status_extended = f"Attack path notifications are enabled with minimal risk level {actual_risk_level} in subscription {subscription_name} for security contact {contact_configuration.name}."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"Attack path notifications are enabled with minimal risk level {actual_risk_level} in subscription {subscription_name} for security contact {contact_configuration.name}."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_auto_provisioning_log_analytics_agent_vms_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_auto_provisioning_log_analytics_agent_vms_on/defender_auto_provisioning_log_analytics_agent_vms_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "defender_auto_provisioning_log_analytics_agent_vms_on",
  "CheckTitle": "Ensure that Auto provisioning of 'Log Analytics agent for Azure VMs' is Set to 'On'",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AzureDefenderPlan",
  "Description": "Ensure that Auto provisioning of 'Log Analytics agent for Azure VMs' is Set to 'On'. The Microsoft Monitoring Agent scans for various security-related configurations and events such as system updates, OS vulnerabilities, endpoint protection, and provides alerts.",
  "Risk": "Missing critical security information about your Azure VMs, such as security alerts, security recommendations, and change tracking.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/security-center/security-center-data-security",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/SecurityCenter/automatic-provisioning-of-monitoring-agent.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure comprehensive visibility into possible security vulnerabilities, including missing updates, misconfigured operating system security settings, and active threats, allowing for timely mitigation and improved overall security posture",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/monitoring-components"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_auto_provisioning_log_analytics_agent_vms_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_auto_provisioning_log_analytics_agent_vms_on/defender_auto_provisioning_log_analytics_agent_vms_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_auto_provisioning_log_analytics_agent_vms_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            auto_provisioning_settings,
        ) in defender_client.auto_provisioning_settings.items():
            for auto_provisioning_setting in auto_provisioning_settings.values():
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=auto_provisioning_setting,
                )
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"Defender Auto Provisioning Log Analytics Agents from subscription {subscription_name} is set to ON."

                if auto_provisioning_setting.auto_provision != "On":
                    report.status = "FAIL"
                    report.status_extended = f"Defender Auto Provisioning Log Analytics Agents from subscription {subscription_name} is set to OFF."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_auto_provisioning_vulnerabilty_assessments_machines_on.py]---
Location: prowler-master/prowler/providers/azure/services/defender/defender_auto_provisioning_vulnerabilty_assessments_machines_on/defender_auto_provisioning_vulnerabilty_assessments_machines_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.defender.defender_client import defender_client


class defender_auto_provisioning_vulnerabilty_assessments_machines_on(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            assessments,
        ) in defender_client.assessments.items():
            if (
                "Machines should have a vulnerability assessment solution"
                in assessments
            ):
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=assessments[
                        "Machines should have a vulnerability assessment solution"
                    ],
                )
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"Vulnerability assessment is set up in all VMs in subscription {subscription_name}."

                if (
                    assessments[
                        "Machines should have a vulnerability assessment solution"
                    ].status
                    == "Unhealthy"
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Vulnerability assessment is not set up in all VMs in subscription {subscription_name}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
