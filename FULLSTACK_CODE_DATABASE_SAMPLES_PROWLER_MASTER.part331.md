---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 331
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 331 of 867)

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

---[FILE: app_client_certificates_on.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_client_certificates_on/app_client_certificates_on.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_client_certificates_on",
  "CheckTitle": "Ensure the web app has 'Client Certificates (Incoming client certificates)' set to 'On'",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Web/sites/config",
  "Description": "Client certificates allow for the app to request a certificate for incoming requests. Only clients that have a valid certificate will be able to reach the app.",
  "Risk": "The TLS mutual authentication technique in enterprise environments ensures the authenticity of clients to the server. If incoming client certificates are enabled, then only an authenticated client who has valid certificates can access the app.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/app-service-web-configure-tls-mutual-auth?tabs=azurecli",
  "Remediation": {
    "Code": {
      "CLI": "az webapp update --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME> --set clientCertEnabled=true",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_7#terraform"
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to App Services 3. Click on each App 4. Under the Settings section, Click on Configuration, then General settings 5. Set the option Client certificate mode located under Incoming client certificates to Require",
      "Url": "https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-identity-management#im-4-authenticate-server-and-services"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Utilizing and maintaining client certificates will require additional work to obtain and manage replacement and key rotation."
}
```

--------------------------------------------------------------------------------

---[FILE: app_client_certificates_on.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_client_certificates_on/app_client_certificates_on.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_client_certificates_on(Check):
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
                report.status_extended = f"Clients are required to present a certificate for app '{app.name}' in subscription '{subscription_name}'."

                if app.client_cert_mode != "Required":
                    report.status = "FAIL"
                    report.status_extended = f"Clients are not required to present a certificate for app '{app.name}' in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_auth_is_set_up.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_auth_is_set_up/app_ensure_auth_is_set_up.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_ensure_auth_is_set_up",
  "CheckTitle": "Ensure App Service Authentication is set up for apps in Azure App Service",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Azure App Service Authentication is a feature that can prevent anonymous HTTP requests from reaching a Web Application or authenticate those with tokens before they reach the app. If an anonymous request is received from a browser, App Service will redirect to a logon page. To handle the logon process, a choice from a set of identity providers can be made, or a custom authentication mechanism can be implemented.",
  "Risk": "By Enabling App Service Authentication, every incoming HTTP request passes through it before being handled by the application code. It also handles authentication of users with the specified provider (Azure Active Directory, Facebook, Google, Microsoft Account, and Twitter), validation, storing and refreshing of tokens, managing the authenticated sessions and injecting identity information into request headers.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization",
  "Remediation": {
    "Code": {
      "CLI": "az webapp auth update --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME> --enabled true",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/enable-app-service-authentication.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/bc_azr_general_2#terraform"
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to App Services 3. Click on each App 4. Under Setting section, click on Authentication 5. If no identity providers are set up, then click Add identity provider 6. Choose other parameters as per your requirements and click on Add",
      "Url": "https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#website-contributor"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This is only required for App Services which require authentication. Enabling on site like a marketing or support website will prevent unauthenticated access which would be undesirable. Adding Authentication requirement will increase cost of App Service and require additional security components to facilitate the authentication"
}
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_auth_is_set_up.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_auth_is_set_up/app_ensure_auth_is_set_up.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_ensure_auth_is_set_up(Check):
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
                report.status_extended = f"Authentication is set up for app '{app.name}' in subscription '{subscription_name}'."

                if not app.auth_enabled:
                    report.status = "FAIL"
                    report.status_extended = f"Authentication is not set up for app '{app.name}' in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_http_is_redirected_to_https.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_http_is_redirected_to_https/app_ensure_http_is_redirected_to_https.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_ensure_http_is_redirected_to_https",
  "CheckTitle": "Ensure Web App Redirects All HTTP traffic to HTTPS in Azure App Service",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Web/sites/config",
  "Description": "Azure Web Apps allows sites to run under both HTTP and HTTPS by default. Web apps can be accessed by anyone using non-secure HTTP links by default. Non-secure HTTP requests can be restricted and all HTTP requests redirected to the secure HTTPS port. It is recommended to enforce HTTPS-only traffic.",
  "Risk": "Enabling HTTPS-only traffic will redirect all non-secure HTTP requests to HTTPS ports. HTTPS uses the TLS/SSL protocol to provide a secure connection which is both encrypted and authenticated. It is therefore important to support HTTPS for the security benefits.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-bindings#enforce-https",
  "Remediation": {
    "Code": {
      "CLI": "az webapp update --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME> --set httpsOnly=true",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/enable-https-only-traffic.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_5#terraform"
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to App Services 3. Click on each App 4. Under Setting section, Click on Configuration 5. In the General Settings section, set the HTTPS Only to On 6. Click Save",
      "Url": "https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-data-protection#dp-3-encrypt-sensitive-data-in-transit"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "When it is enabled, every incoming HTTP request is redirected to the HTTPS port. This means an extra level of security will be added to the HTTP requests made to the app."
}
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_http_is_redirected_to_https.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_http_is_redirected_to_https/app_ensure_http_is_redirected_to_https.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_ensure_http_is_redirected_to_https(Check):
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
                report.status_extended = f"HTTP is redirected to HTTPS for app '{app.name}' in subscription '{subscription_name}'."

                if not app.https_only:
                    report.status = "FAIL"
                    report.status_extended = f"HTTP is not redirected to HTTPS for app '{app.name}' in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_java_version_is_latest.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_java_version_is_latest/app_ensure_java_version_is_latest.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_ensure_java_version_is_latest",
  "CheckTitle": "Ensure that 'Java version' is the latest, if used to run the Web App",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Periodically, newer versions are released for Java software either due to security flaws or to include additional functionality. Using the latest Java version for web apps is recommended in order to take advantage of security fixes, if any, and/or new functionalities of the newer version.",
  "Risk": "Newer versions may contain security enhancements and additional functionality. Using the latest software version is recommended in order to take advantage of enhancements and new capabilities. With each software installation, organizations need to determine if a given update meets their requirements. They must also verify the compatibility and support provided for any additional software against the update revision that is selected.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=portal#general-settings",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/latest-version-of-java.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-java-version-is-the-latest-if-used-to-run-the-web-app#terraform"
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to App Services 3. Click on each App 4. Under Settings section, click on Configuration 5. Click on the General settings pane and ensure that for a Stack of Java the Major Version and Minor Version reflect the latest stable and supported release, and that the Java web server version is set to the auto-update option. NOTE: No action is required if Java version is set to Off, as Java is not used by your web app.",
      "Url": "https://learn.microsoft.com/en-us/azure/app-service/configure-language-java?pivots=platform-linux#choosing-a-java-runtime-version"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "If your app is written using version-dependent features or libraries, they may not be available on the latest version. If you wish to upgrade, research the impact thoroughly. Upgrading may have unforeseen consequences that could result in downtime."
}
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_java_version_is_latest.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_java_version_is_latest/app_ensure_java_version_is_latest.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_ensure_java_version_is_latest(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            apps,
        ) in app_client.apps.items():
            for app in apps.values():
                linux_framework = getattr(app.configurations, "linux_fx_version", "")
                windows_framework_version = getattr(
                    app.configurations, "java_version", None
                )

                if "java" in linux_framework.lower() or windows_framework_version:
                    report = Check_Report_Azure(metadata=self.metadata(), resource=app)
                    report.subscription = subscription_name
                    report.status = "FAIL"
                    java_latest_version = app_client.audit_config.get(
                        "java_latest_version", "17"
                    )
                    report.status_extended = f"Java version is set to '{f'java{windows_framework_version}' if windows_framework_version else linux_framework}', but should be set to 'java {java_latest_version}' for app '{app.name}' in subscription '{subscription_name}'."

                    if (
                        f"java{java_latest_version}" in linux_framework
                        or java_latest_version == windows_framework_version
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Java version is set to 'java {java_latest_version}' for app '{app.name}' in subscription '{subscription_name}'."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_php_version_is_latest.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_php_version_is_latest/app_ensure_php_version_is_latest.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_ensure_php_version_is_latest",
  "CheckTitle": "Ensure That 'PHP version' is the Latest, If Used to Run the Web App",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Periodically newer versions are released for PHP software either due to security flaws or to include additional functionality. Using the latest PHP version for web apps is recommended in order to take advantage of security fixes, if any, and/or additional functionalities of the newer version.",
  "Risk": "Newer versions may contain security enhancements and additional functionality. Using the latest software version is recommended in order to take advantage of enhancements and new capabilities. With each software installation, organizations need to determine if a given update meets their requirements. They must also verify the compatibility and support provided for any additional software against the update revision that is selected.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=portal#general-settings",
  "Remediation": {
    "Code": {
      "CLI": "az webapp config set --resource-group <resource group name> --name <app name> [--linux-fx-version <php runtime version>][--php-version <php version>]",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/latest-version-of-php.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-php-version-is-the-latest-if-used-to-run-the-web-app#terraform"
    },
    "Recommendation": {
      "Text": "1. From Azure Home open the Portal Menu in the top left 2. Go to App Services 3. Click on each App 4. Under Settings section, click on Configuration 5. Click on the General settings pane, ensure that for a Stack of PHP the Major Version and Minor Version reflect the latest stable and supported release. NOTE: No action is required If PHP version is set to Off or is set with an empty value as PHP is not used by your web app",
      "Url": "https://learn.microsoft.com/en-us/azure/app-service/configure-language-php?pivots=platform-linux#set-php-version"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "If your app is written using version-dependent features or libraries, they may not be available on the latest version. If you wish to upgrade, research the impact thoroughly. Upgrading may have unforeseen consequences that could result in downtime"
}
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_php_version_is_latest.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_php_version_is_latest/app_ensure_php_version_is_latest.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_ensure_php_version_is_latest(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            apps,
        ) in app_client.apps.items():
            for app in apps.values():
                framework = getattr(app.configurations, "linux_fx_version", "")

                if "php" in framework.lower() or getattr(
                    app.configurations, "php_version", ""
                ):
                    report = Check_Report_Azure(metadata=self.metadata(), resource=app)
                    report.subscription = subscription_name
                    report.status = "FAIL"

                    php_latest_version = app_client.audit_config.get(
                        "php_latest_version", "8.2"
                    )

                    report.status_extended = f"PHP version is set to '{framework}', the latest version that you could use is the '{php_latest_version}' version, for app '{app.name}' in subscription '{subscription_name}'."

                    if (
                        php_latest_version in framework
                        or getattr(app.configurations, "php_version", None)
                        == php_latest_version
                    ):
                        report.status = "PASS"
                        report.status_extended = f"PHP version is set to '{php_latest_version}' for app '{app.name}' in subscription '{subscription_name}'."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_python_version_is_latest.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_python_version_is_latest/app_ensure_python_version_is_latest.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_ensure_python_version_is_latest",
  "CheckTitle": "Ensure that 'Python version' is the Latest Stable Version, if Used to Run the Web App",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Periodically, newer versions are released for Python software either due to security flaws or to include additional functionality. Using the latest full Python version for web apps is recommended in order to take advantage of security fixes, if any, and/or additional functionalities of the newer version.",
  "Risk": "Newer versions may contain security enhancements and additional functionality. Using the latest software version is recommended in order to take advantage of enhancements and new capabilities. With each software installation, organizations need to determine if a given update meets their requirements. They must also verify the compatibility and support provided for any additional software against the update revision that is selected. Using the latest full version will keep your stack secure to vulnerabilities and exploits.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=portal#general-settings",
  "Remediation": {
    "Code": {
      "CLI": "az webapp config set --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME> [--linux-fx-version 'PYTHON|3.12']",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/latest-version-of-python.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-python-version-is-the-latest-if-used-to-run-the-web-app"
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. From Azure Home open the Portal Menu in the top left 2. Go to App Services 3. Click on each App 4. Under Settings section, click on Configuration 5. Click on the General settings pane and ensure that the Major Version and the Minor Version is set to the latest stable version available (Python 3.11, at the time of writing) NOTE: No action is required if Python version is set to Off, as Python is not used by your web app.",
      "Url": "https://learn.microsoft.com/en-us/azure/app-service/configure-language-python#configure-python-version"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "If your app is written using version-dependent features or libraries, they may not be available on the latest version. If you wish to upgrade, research the impact thoroughly. Upgrading may have unforeseen consequences that could result in downtime."
}
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_python_version_is_latest.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_python_version_is_latest/app_ensure_python_version_is_latest.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_ensure_python_version_is_latest(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            subscription_name,
            apps,
        ) in app_client.apps.items():
            for app in apps.values():
                framework = getattr(app.configurations, "linux_fx_version", "")

                if "python" in framework.lower() or getattr(
                    app.configurations, "python_version", ""
                ):
                    report = Check_Report_Azure(metadata=self.metadata(), resource=app)
                    report.subscription = subscription_name
                    report.status = "FAIL"
                    python_latest_version = app_client.audit_config.get(
                        "python_latest_version", "3.12"
                    )
                    report.status_extended = f"Python version is '{framework}', the latest version that you could use is the '{python_latest_version}' version, for app '{app.name}' in subscription '{subscription_name}'."

                    if (
                        python_latest_version in framework
                        or getattr(app.configurations, "python_version", None)
                        == python_latest_version
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Python version is set to '{python_latest_version}' for app '{app.name}' in subscription '{subscription_name}'."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_using_http20.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_using_http20/app_ensure_using_http20.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_ensure_using_http20",
  "CheckTitle": "Ensure that 'HTTP Version' is the Latest, if Used to Run the Web App",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Periodically, newer versions are released for HTTP either due to security flaws or to include additional functionality. Using the latest HTTP version for web apps to take advantage of security fixes, if any, and/or new functionalities of the newer version.",
  "Risk": "Newer versions may contain security enhancements and additional functionality. Using the latest version is recommended in order to take advantage of enhancements and new capabilities. With each software installation, organizations need to determine if a given update meets their requirements. They must also verify the compatibility and support provided for any additional software against the update revision that is selected. HTTP 2.0 has additional performance improvements on the head-of-line blocking problem of old HTTP version, header compression, and prioritization of requests. HTTP 2.0 no longer supports HTTP 1.1's chunked transfer encoding mechanism, as it provides its own, more efficient, mechanisms for data streaming.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=portal#general-settings",
  "Remediation": {
    "Code": {
      "CLI": "az webapp config set --resource-group <RESOURCE_GROUP_NAME> --name <APP_NAME> --http20-enabled true",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/enable-http-2-for-app-service-web-applications.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Login to Azure Portal using https://portal.azure.com 2. Go to App Services 3. Click on each App 4. Under Setting section, Click on Configuration 5. Set HTTP version to 2.0 under General settings",
      "Url": "https://azure.microsoft.com/en-us/blog/announcing-http-2-support-in-azure-app-service/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "https://learn.microsoft.com/en-us/security/benchmark/azure/security-controls-v3-posture-vulnerability-management#pv-7-rapidly-and-automatically-remediate-software-vulnerabilities"
}
```

--------------------------------------------------------------------------------

---[FILE: app_ensure_using_http20.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_ensure_using_http20/app_ensure_using_http20.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_ensure_using_http20(Check):
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
                report.status_extended = f"HTTP/2.0 is not enabled for app '{app.name}' in subscription '{subscription_name}'."

                if app.configurations and getattr(
                    app.configurations, "http20_enabled", False
                ):
                    report.status = "PASS"
                    report.status_extended = f"HTTP/2.0 is enabled for app '{app.name}' in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_ftp_deployment_disabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_ftp_deployment_disabled/app_ftp_deployment_disabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_ftp_deployment_disabled",
  "CheckTitle": "Ensure FTP deployments are Disabled",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Microsoft.Web/sites/config",
  "Description": "By default, Azure Functions, Web, and API Services can be deployed over FTP. If FTP is required for an essential deployment workflow, FTPS should be required for FTP login for all App Service Apps and Functions.",
  "Risk": "Azure FTP deployment endpoints are public. An attacker listening to traffic on a wifi network used by a remote employee or a corporate network could see login traffic in clear-text which would then grant them full control of the code base of the app or service. This finding is more severe if User Credentials for deployment are set at the subscription level rather than using the default Application Credentials which are unique per App.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/app-service/deploy-ftp?tabs=portal",
  "Remediation": {
    "Code": {
      "CLI": "az webapp config set --resource-group <resource group name> --name <app name> --ftps-state [disabled|FtpsOnly]",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/AppService/ftp-access-disabled.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-ftp-deployments-are-disabled#terraform"
    },
    "Recommendation": {
      "Text": "1. Go to the Azure Portal 2. Select App Services 3. Click on an app 4. Select Settings and then Configuration 5. Under General Settings, for the Platform Settings, the FTP state should be set to Disabled or FTPS Only",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Any deployment workflows that rely on FTP or FTPs rather than the WebDeploy or HTTPs endpoints may be affected."
}
```

--------------------------------------------------------------------------------

---[FILE: app_ftp_deployment_disabled.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_ftp_deployment_disabled/app_ftp_deployment_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_ftp_deployment_disabled(Check):
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
                report.status_extended = f"FTP is enabled for app '{app.name}' in subscription '{subscription_name}'."
                if (
                    app.configurations
                    and getattr(app.configurations, "ftps_state", "AllAllowed")
                    != "AllAllowed"
                ):
                    report.status = "PASS"
                    report.status_extended = f"FTP is disabled for app '{app.name}' in subscription '{subscription_name}'."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_function_access_keys_configured.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_access_keys_configured/app_function_access_keys_configured.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_function_access_keys_configured",
  "CheckTitle": "Ensure that Azure Functions are using access keys for enhanced security",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "function",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Azure Functions provide a way to secure HTTP function endpoints during development and production. Using access keys adds an extra layer of protection, ensuring that only authorized users or systems can access the functions. This is particularly important when dealing with public apps or sensitive data.",
  "Risk": "Unprotected function endpoints may be vulnerable to unauthorized access, leading to potential data breaches or malicious activity.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=python-v2%2Cisolated-process%2Cnodejs-v4%2Cfunctionsv2&pivots=programming-language-csharp#authorization-keys",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Functions/azure-function-anonymous-access.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use access keys to secure Azure Functions. You can create and manage keys in the Azure portal or using the Azure CLI. For more information, see the official documentation.",
      "Url": "https://learn.microsoft.com/en-us/azure/azure-functions/security-concepts?tabs=v4#function-access-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "For additional security, consider using managed identities and key vaults along with access keys. This provides granular control over resource access and improves auditability."
}
```

--------------------------------------------------------------------------------

---[FILE: app_function_access_keys_configured.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_access_keys_configured/app_function_access_keys_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_function_access_keys_configured(Check):
    def execute(self):
        findings = []

        for (
            subscription_name,
            functions,
        ) in app_client.functions.items():
            for function in functions.values():
                if function.function_keys is not None:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=function
                    )
                    report.subscription = subscription_name
                    report.status = "FAIL"
                    report.status_extended = f"Function {function.name} does not have function keys configured."

                    if len(function.function_keys) > 0:
                        report.status = "PASS"
                        report.status_extended = (
                            f"Function {function.name} has function keys configured."
                        )

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: app_function_application_insights_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_application_insights_enabled/app_function_application_insights_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "app_function_application_insights_enabled",
  "CheckTitle": "Ensure Function App has Application Insights configured",
  "CheckType": [],
  "ServiceName": "app",
  "SubServiceName": "function",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Web/sites",
  "Description": "Application Insights is a powerful tool for monitoring the performance and health of Azure Function Apps. It provides valuable insights into exceptions, performance issues, and usage patterns, enabling timely detection and resolution of issues.",
  "Risk": "Without Application Insights, you may miss critical errors, performance degradation, or abnormal behavior in your Function App, potentially impacting availability and user experience.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Functions/function-app-insights-on.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Application Insights for your Azure Function App to monitor its performance and health.",
      "Url": "https://learn.microsoft.com/en-us/azure/azure-monitor/app/monitor-functions"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: app_function_application_insights_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/app/app_function_application_insights_enabled/app_function_application_insights_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.app.app_client import app_client


class app_function_application_insights_enabled(Check):
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
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Function {function.name} is not using Application Insights."
                    )

                    if function.enviroment_variables.get(
                        "APPINSIGHTS_INSTRUMENTATIONKEY", None
                    ) or function.enviroment_variables.get(
                        "APPLICATIONINSIGHTS_CONNECTION_STRING", None
                    ):
                        report.status = "PASS"
                        report.status_extended = (
                            f"Function {function.name} is using Application Insights."
                        )

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
