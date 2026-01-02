---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 332
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 332 of 867)

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

---[FILE: app_function_ftps_deployment_disabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_ftps_deployment_disabled/app_function_ftps_deployment_disabled.metadata.json
Signals: Docker

```json
{
  "Provider": "azure",
  "CheckID": "app_function_ftps_deployment_disabled",
  "CheckTitle": "Ensure that FTP and FTPS deployments are disabled for Azure Functions to prevent unauthorized access and data breaches.",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "function",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Azure FTP deployment endpoints are unencrypted and public, making them vulnerable to attacks. Disabling FTP and FTPS deployments enhances security by preventing unauthorized access to login credentials and sensitive codebases.",
  "Risk": "If left enabled, attackers can intercept network traffic and gain full control of the app or service, leading to potential data breaches and unauthorized modifications.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/app-service/deploy-ftp",
  "Remediation": {
    "Code": {
      "CLI": "az webapp config set --resource-group <resource-group> --name <app-name> --ftps-state Disabled",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "",
      "Arm": ""
    },
    "Recommendation": {
      "Text": "It is recommended to disable FTP and FTPS deployments for Azure Functions to mitigate security risks. Instead, consider using more secure deployment methods such as Docker contianer or enabling continuous deployment with GitHub Actions.",
      "Url": "https://learn.microsoft.com/en-us/azure/azure-functions/functions-deployment-technologies?tabs=windows#trigger-syncing"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check ensures that Azure Functions are deployed securely, reducing the attack surface and protecting sensitive information."
}
```

--------------------------------------------------------------------------------

---[FILE: app_function_ftps_deployment_disabled.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_ftps_deployment_disabled/app_function_ftps_deployment_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_function_ftps_deployment_disabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            functions,
        ) in app_client.functions.items():
            for function in functions.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=function)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"Function {function.name} has {'FTP' if function.ftps_state == 'AllAllowed' else 'FTPS' if function.ftps_state == 'FtpsOnly' else 'FTP or FTPS'} deployment enabled"
                if function.ftps_state == "Disabled":
                    report.status = "PASS"
                    report.status_extended = (
                        f"Function {function.name} has FTP and FTPS deployment disabled"
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_function_identity_is_configured.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_identity_is_configured/app_function_identity_is_configured.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_function_identity_is_configured",
  "CheckTitle": "Ensure Azure function has system or user assigned managed identity configured",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "function",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Azure Functions should have managed identities configured for enhanced security and access control.",
  "Risk": "Not using managed identities can lead to less secure authentication and authorization practices, potentially exposing sensitive data.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview",
  "Remediation": {
    "Code": {
      "CLI": "az functionapp identity assign --name <function_name> --resource-group <resource_group> --identities [system]",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Functions/azure-function-system-assigned-identity.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to enable managed identities for Azure Functions to enhance security and access control. This allows the function app to easily access other Azure resources securely and with the appropriate permissions.",
      "Url": "https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: app_function_identity_is_configured.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_identity_is_configured/app_function_identity_is_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_function_identity_is_configured(Check):
    def execute(self):
        findings = []

        for (
            subscription_name,
            functions,
        ) in app_client.functions.items():
            for function in functions.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=function)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"Function {function.name} does not have a managed identity enabled."

                if function.identity:
                    report.status = "PASS"
                    report.status_extended = f"Function {function.name} has a {function.identity.type if getattr(function.identity, 'type', '') else 'managed'} identity enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_function_identity_without_admin_privileges.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_identity_without_admin_privileges/app_function_identity_without_admin_privileges.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_function_identity_without_admin_privileges",
  "CheckTitle": "Ensure that your Azure functions are not configured with an identity with admin privileges",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "function",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "It is important to ensure that Azure functions are not configured with administrative privileges to maintain the principle of least privilege and reduce the attack surface. By limiting the privileges of Azure functions, potential security risks and data leaks can be mitigated.",
  "Risk": "If Azure functions are configured with administrative privileges, it increases the risk of unauthorized access, privilege escalation, and data breaches. Attackers can exploit these privileges to gain access to sensitive data and compromise the entire system.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Functions/azure-function-admin-permissions.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To remediate this issue, ensure that Azure functions are not configured with an identity that has administrative privileges. Instead, use the principle of least privilege to grant only the necessary permissions to Azure functions. For more information, refer to the official documentation: Use the principle of least privilege.",
      "Url": "https://docs.microsoft.com/en-us/azure/architecture/framework/security/design-identity-authorization#use-the-principle-of-least-privilege"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check helps prevent privilege escalation attacks and ensures that Azure functions operate with the necessary permissions, reducing the impact of potential security breaches."
}
```

--------------------------------------------------------------------------------

---[FILE: app_function_identity_without_admin_privileges.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_identity_without_admin_privileges/app_function_identity_without_admin_privileges.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.config import (
    CONTRIBUTOR_ROLE_ID,
    OWNER_ROLE_ID,
    ROLE_BASED_ACCESS_CONTROL_ADMINISTRATOR_ROLE_ID,
    USER_ACCESS_ADMINISTRATOR_ROLE_ID,
)
from prowler.providers.azure.services.app.app_client import app_client
from prowler.providers.azure.services.iam.iam_client import iam_client


class app_function_identity_without_admin_privileges(Check):
    def execute(self):
        findings = []

        for (
            subscription_name,
            functions,
        ) in app_client.functions.items():
            for function in functions.values():
                if function.identity:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=function
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = f"Function {function.name} has a managed identity enabled but without admin privileges."

                    admin_roles_assigned = []

                    for role_assignment in iam_client.role_assignments[
                        subscription_name
                    ].values():
                        if (
                            role_assignment.agent_id == function.identity.principal_id
                            and role_assignment.role_id
                            in [
                                CONTRIBUTOR_ROLE_ID,
                                OWNER_ROLE_ID,
                                ROLE_BASED_ACCESS_CONTROL_ADMINISTRATOR_ROLE_ID,
                                USER_ACCESS_ADMINISTRATOR_ROLE_ID,
                            ]
                        ):
                            admin_roles_assigned.append(
                                getattr(
                                    iam_client.roles[subscription_name].get(
                                        f"/subscriptions/{iam_client.subscriptions[subscription_name]}/providers/Microsoft.Authorization/roleDefinitions/{role_assignment.role_id}"
                                    ),
                                    "name",
                                    "",
                                )
                            )

                    if admin_roles_assigned:
                        report.status = "FAIL"
                        report.status_extended = f"Function {function.name} has a managed identity enabled and it is configure with admin privileges using {'roles: ' + ', '.join(admin_roles_assigned) if len(admin_roles_assigned) > 1 else 'role ' + admin_roles_assigned[0]}."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_function_latest_runtime_version.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_latest_runtime_version/app_function_latest_runtime_version.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_function_latest_runtime_version",
  "CheckTitle": "Ensure Azure Functions are using the latest supported runtime",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "function",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Keeping Azure Functions up to date with the latest supported runtime version is crucial for security and performance. Updates often include security patches and enhancements, helping to protect against known vulnerabilities and potential exploits. Additionally, newer runtime versions may offer improved functionality and optimized resource utilization.",
  "Risk": "Using outdated runtime versions may introduce security risks and performance degradation. Outdated runtimes may have unpatched vulnerabilities, making them susceptible to attacks.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/azure-functions/functions-versions",
  "Remediation": {
    "Code": {
      "CLI": "az functionapp config appsettings set --name <function_app_name> --resource-group <resource_group_name> --settings FUNCTIONS_EXTENSION_VERSION=~4",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Functions/azure-function-runtime-version.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "",
      "Url": "https://learn.microsoft.com/en-us/azure/azure-functions/migrate-version-3-version-4?tabs=net8%2Cazure-cli%2Cwindows&pivots=programming-language-python"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Stay informed about the latest security updates and patch releases for Azure Functions to maintain a secure and up-to-date environment."
}
```

--------------------------------------------------------------------------------

---[FILE: app_function_latest_runtime_version.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_latest_runtime_version/app_function_latest_runtime_version.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_function_latest_runtime_version(Check):
    def execute(self):
        findings = []

        for (
            subscription_name,
            functions,
        ) in app_client.functions.items():
            for function in functions.values():
                if function.enviroment_variables is not None:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=function
                    )
                    report.subscription = subscription_name
                    report.status = "PASS"
                    report.status_extended = (
                        f"Function {function.name} is using the latest runtime."
                    )

                    if (
                        function.enviroment_variables.get(
                            "FUNCTIONS_EXTENSION_VERSION", ""
                        )
                        != "~4"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Function {function.name} is not using the latest runtime. The current runtime is '{function.enviroment_variables.get('FUNCTIONS_EXTENSION_VERSION', '')}' and should be '~4'."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_function_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_not_publicly_accessible/app_function_not_publicly_accessible.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_function_not_publicly_accessible",
  "CheckTitle": "Ensure Azure Functions are not publicly accessible",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "function",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Azure Functions should not be exposed to the public internet. Restricting access helps protect applications from potential threats and reduces the attack surface.",
  "Risk": "Exposing Azure Functions to the public internet increases the risk of unauthorized access, data breaches, and other security threats.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/azure-functions/functions-networking-options",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Functions/azure-function-exposed.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review the Azure Functions security guidelines and ensure that access restrictions are in place. Use Azure Private Link and Key Vault for enhanced security.",
      "Url": "https://learn.microsoft.com/en-us/azure/app-service/overview-access-restrictions"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: app_function_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_not_publicly_accessible/app_function_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_function_not_publicly_accessible(Check):
    def execute(self):
        findings = []

        for (
            subscription_name,
            functions,
        ) in app_client.functions.items():
            for function in functions.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=function)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = (
                    f"Function {function.name} is publicly accessible."
                )

                if not function.public_access:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Function {function.name} is not publicly accessible."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_function_vnet_integration_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_vnet_integration_enabled/app_function_vnet_integration_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_function_vnet_integration_enabled",
  "CheckTitle": "Ensure Virtual Network Integration is Enabled for Azure Functions",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "function",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Enabling Virtual Network Integration for Azure Functions provides an additional layer of security by restricting access to selected virtual network subnets. This helps to protect your Function Apps from unauthorized access and potential threats.",
  "Risk": "Without Virtual Network Integration, your Function Apps may be exposed to the public internet, increasing the risk of unauthorized access and potential security breaches.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/azure-functions/functions-networking-options#virtual-network-integration",
  "Remediation": {
    "Code": {
      "CLI": "az functionapp vnet-integration update --name <function_app_name> --resource-group <resource_group_name> --vnet <vnet_name> --subnet <subnet_name>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Functions/azure-function-vnet-integration-on.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to enable Virtual Network Integration for Azure Functions to enhance security and protect against unauthorized access.",
      "Url": "https://docs.microsoft.com/en-us/azure/azure-functions/functions-networking-options#enable-virtual-network-integration"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: app_function_vnet_integration_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_vnet_integration_enabled/app_function_vnet_integration_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_function_vnet_integration_enabled(Check):
    def execute(self):
        findings = []

        for (
            subscription_name,
            functions,
        ) in app_client.functions.items():
            for function in functions.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=function)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"Function {function.name} does not have virtual network integration enabled."

                if function.vnet_subnet_id:
                    report.status = "PASS"
                    report.status_extended = f"Function {function.name} has Virtual Network integration enabled with subnet '{function.vnet_subnet_id}' enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_http_logs_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_http_logs_enabled/app_http_logs_enabled.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "app_http_logs_enabled",
  "CheckTitle": "Ensure that logging for Azure AppService 'HTTP logs' is enabled",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Microsoft.Web/sites/config",
  "Description": "Enable AppServiceHTTPLogs diagnostic log category for Azure App Service instances to ensure all http requests are captured and centrally logged.",
  "Risk": "Capturing web requests can be important supporting information for security analysts performing monitoring and incident response activities. Once logging, these logs can be ingested into SIEM or other central aggregation point for the organization.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/security/benchmark/azure/mcsb-logging-threat-detection#lt-3-enable-logging-for-security-investigation",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-logging-policies/ensure-that-app-service-enables-http-logging#terraform"
    },
    "Recommendation": {
      "Text": "1. Go to App Services For each App Service: 2. Go to Diagnostic Settings 3. Click Add Diagnostic Setting 4. Check the checkbox next to 'HTTP logs' 5. Configure a destination based on your specific logging consumption capability (for example Stream to an event hub and then consuming with SIEM integration for Event Hub logging).",
      "Url": "https://docs.microsoft.com/en-us/azure/app-service/troubleshoot-diagnostic-logs"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Log consumption and processing will incur additional cost."
}
```

--------------------------------------------------------------------------------

---[FILE: app_http_logs_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_http_logs_enabled/app_http_logs_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_http_logs_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, apps in app_client.apps.items():
            for app in apps.values():
                if "functionapp" not in app.kind:
                    report = Check_Report_Azure(metadata=self.metadata(), resource=app)
                    report.subscription = subscription_name
                    report.status = "FAIL"
                    if not app.monitor_diagnostic_settings:
                        report.status_extended = f"App {app.name} does not have a diagnostic setting in subscription {subscription_name}."
                    else:
                        for diagnostic_setting in app.monitor_diagnostic_settings:
                            report.status_extended = f"App {app.name} does not have HTTP Logs enabled in diagnostic setting {diagnostic_setting.name} in subscription {subscription_name}"
                            for log in diagnostic_setting.logs:
                                if log.category == "AppServiceHTTPLogs" and log.enabled:
                                    report.status = "PASS"
                                    report.status_extended = f"App {app.name} has HTTP Logs enabled in diagnostic setting {diagnostic_setting.name} in subscription {subscription_name}"
                                    break
                                elif log.category_group == "allLogs" and log.enabled:
                                    report.status = "PASS"
                                    report.status_extended = f"App {app.name} has allLogs category group which includes HTTP Logs enabled in diagnostic setting {diagnostic_setting.name} in subscription {subscription_name}"
                                    break
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_minimum_tls_version_12.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_minimum_tls_version_12/app_minimum_tls_version_12.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_minimum_tls_version_12",
  "CheckTitle": "Ensure Web App is using the latest version of TLS encryption",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Web/sites/config",
  "Description": "The TLS (Transport Layer Security) protocol secures transmission of data over the internet using standard encryption technology. Encryption should be set with the latest version of TLS. App service allows TLS 1.2 by default, which is the recommended TLS level by industry standards such as PCI DSS.",
  "Risk": "App service currently allows the web app to set TLS versions 1.0, 1.1 and 1.2. It is highly recommended to use the latest TLS 1.2 version for web app secure connections.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-bindings#enforce-tls-versions",
  "Remediation": {
    "Code": {
      "CLI": "az webapp config set --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME> --min-tls-version 1.2",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/latest-version-of-tls-encryption-in-use.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_6#terraform"
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to App Services 3. Click on each App 4. Under Setting section, Click on TLS/SSL settings 5. Under the Bindings pane, ensure that Minimum TLS Version set to 1.2 under Protocol Settings",
      "Url": "https://docs.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-data-protection#dp-3-encrypt-sensitive-data-in-transit"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, TLS Version feature will be set to 1.2 when a new app is created using the command-line tool or Azure Portal console."
}
```

--------------------------------------------------------------------------------

---[FILE: app_minimum_tls_version_12.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_minimum_tls_version_12/app_minimum_tls_version_12.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_minimum_tls_version_12(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            apps,
        ) in app_client.apps.items():
            for app in apps.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=app)
                report.subscription = subscription_name
                report.status = "FAIL"
                report.status_extended = f"Minimum TLS version is not set to 1.2 for app '{app.name}' in subscription '{subscription_name}'."

                if app.configurations and getattr(
                    app.configurations, "min_tls_version", ""
                ) in ["1.2", "1.3"]:
                    report.status = "PASS"
                    report.status_extended = f"Minimum TLS version is set to {app.configurations.min_tls_version} for app '{app.name}' in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_register_with_identity.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_register_with_identity/app_register_with_identity.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_register_with_identity",
  "CheckTitle": "Ensure that Register with Azure Active Directory is enabled on App Service",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Managed service identity in App Service provides more security by eliminating secrets from the app, such as credentials in the connection strings. When registering with Azure Active Directory in App Service, the app will connect to other Azure services securely without the need for usernames and passwords.",
  "Risk": "App Service provides a highly scalable, self-patching web hosting service in Azure. It also provides a managed identity for apps, which is a turn-key solution for securing access to Azure SQL Database and other Azure services.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad?tabs=workforce-tenant",
  "Remediation": {
    "Code": {
      "CLI": "az webapp identity assign --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/enable-registration-with-microsoft-entra-id.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-iam-policies/bc_azr_iam_1#terraform"
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to App Services 3. Click on each App 4. Under Setting section, Click on Identity 5. Under the System assigned pane, set Status to On",
      "Url": "https://learn.microsoft.com/en-us/azure/app-service/scenario-secure-app-authentication-app-service"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, Managed service identity via Azure AD is disabled."
}
```

--------------------------------------------------------------------------------

---[FILE: app_register_with_identity.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_register_with_identity/app_register_with_identity.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_register_with_identity(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            apps,
        ) in app_client.apps.items():
            for app in apps.values():
                report = Check_Report_Azure(metadata=self.metadata(), resource=app)
                report.subscription = subscription_name
                report.status = "PASS"
                report.status_extended = f"App '{app.name}' in subscription '{subscription_name}' has an identity configured."

                if not app.identity:
                    report.status = "FAIL"
                    report.status_extended = f"App '{app.name}' in subscription '{subscription_name}' does not have an identity configured."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: appinsights_client.py]---
Location: prowler-master/prowler/providers/azure/services/appinsights/appinsights_client.py

```python
from prowler.providers.azure.services.appinsights.appinsights_service import AppInsights
from prowler.providers.common.provider import Provider

appinsights_client = AppInsights(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: appinsights_service.py]---
Location: prowler-master/prowler/providers/azure/services/appinsights/appinsights_service.py
Signals: Pydantic

```python
from azure.mgmt.applicationinsights import ApplicationInsightsManagementClient
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class AppInsights(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(ApplicationInsightsManagementClient, provider)
        self.components = self._get_components()

    def _get_components(self):
        logger.info("AppInsights - Getting components...")
        components = {}

        for subscription_name, client in self.clients.items():
            try:
                components_list = client.components.list()
                components.update({subscription_name: {}})

                for component in components_list:
                    components[subscription_name].update(
                        {
                            component.app_id: Component(
                                resource_id=component.id,
                                resource_name=component.name,
                                location=component.location,
                                instrumentation_key=getattr(
                                    component, "instrumentation_key", "Not Found"
                                ),
                            )
                        }
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        return components


class Component(BaseModel):
    resource_id: str
    resource_name: str
    location: str
    instrumentation_key: str
```

--------------------------------------------------------------------------------

---[FILE: appinsights_ensure_is_configured.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/appinsights/appinsights_ensure_is_configured/appinsights_ensure_is_configured.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "appinsights_ensure_is_configured",
  "CheckTitle": "Ensure Application Insights are Configured.",
  "CheckType": [],
  "ServiceName": "appinsights",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Microsoft.Insights/components",
  "Description": "Application Insights within Azure act as an Application Performance Monitoring solution providing valuable data into how well an application performs and additional information when performing incident response. The types of log data collected include application metrics, telemetry data, and application trace logging data providing organizations with detailed information about application activity and application transactions. Both data sets help organizations adopt a proactive and retroactive means to handle security and performance related metrics within their modern applications.",
  "Risk": "Configuring Application Insights provides additional data not found elsewhere within Azure as part of a much larger logging and monitoring program within an organization's Information Security practice. The types and contents of these logs will act as both a potential cost saving measure (application performance) and a means to potentially confirm the source of a potential incident (trace logging). Metrics and Telemetry data provide organizations with a proactive approach to cost savings by monitoring an application's performance, while the trace logging data provides necessary details in a reactive incident response scenario by helping organizations identify the potential source of an incident within their application.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview",
  "Remediation": {
    "Code": {
      "CLI": "az monitor app-insights component create --app <app name> --resource-group <resource group name> --location <location> --kind 'web' --retention-time <INT days to retain logs> --workspace <log analytics workspace ID> -- subscription <subscription ID>",
      "NativeIaC": "",
      "Other": "https://www.tenable.com/audits/items/CIS_Microsoft_Azure_Foundations_v2.0.0_L2.audit:8a7a608d180042689ad9d3f16aa359f1",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to Application Insights 2. Under the Basics tab within the PROJECT DETAILS section, select the Subscription 3. Select the Resource group 4. Within the INSTANCE DETAILS, enter a Name 5. Select a Region 6. Next to Resource Mode, select Workspace-based 7. Within the WORKSPACE DETAILS, select the Subscription for the log analytics workspace 8. Select the appropriate Log Analytics Workspace 9. Click Next:Tags > 10. Enter the appropriate Tags as Name, Value pairs. 11. Click Next:Review+Create 12. Click Create.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Because Application Insights relies on a Log Analytics Workspace, an organization will incur additional expenses when using this service."
}
```

--------------------------------------------------------------------------------

---[FILE: appinsights_ensure_is_configured.py]---
Location: prowler-master/prowler/providers/azure/services/appinsights/appinsights_ensure_is_configured/appinsights_ensure_is_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.appinsights.appinsights_client import (
    appinsights_client,
)


class appinsights_ensure_is_configured(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for subscription_name, components in appinsights_client.components.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource={})
            report.status = "PASS"
            report.subscription = subscription_name
            report.resource_name = "AppInsights"
            report.resource_id = "AppInsights"
            report.status_extended = f"There is at least one AppInsight configured in subscription {subscription_name}."

            if len(components) < 1:
                report.status = "FAIL"
                report.status_extended = f"There are no AppInsight configured in subscription {subscription_name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
