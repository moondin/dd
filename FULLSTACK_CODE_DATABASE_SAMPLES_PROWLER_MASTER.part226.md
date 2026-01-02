---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 226
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 226 of 867)

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

---[FILE: securitycenter_vulnerability_scan_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_vulnerability_scan_enabled/securitycenter_vulnerability_scan_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "securitycenter_vulnerability_scan_enabled",
  "CheckTitle": "Scheduled vulnerability scan is enabled on all servers",
  "CheckType": [
    "Malicious software",
    "Web application threat detection"
  ],
  "ServiceName": "securitycenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:sas::account-id:vulnerability-scan-config",
  "Severity": "high",
  "ResourceType": "AlibabaCloudSecurityCenterVulConfig",
  "Description": "Ensure that **scheduled vulnerability scan** is enabled on all servers.\n\nBe sure that vulnerability scanning is performed periodically to discover system vulnerabilities in time.",
  "Risk": "Without **scheduled vulnerability scans** enabled, system vulnerabilities may not be discovered in a timely manner, leaving systems exposed to **known security threats** and **exploits**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/109076.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SecurityCenter/enable-scheduled-vulnerability-scan.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun sas ModifyVulConfig --Type <vul_type> --Config on",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **Security Center Console**\n2. Select **Vulnerabilities**\n3. Click **Settings**\n4. Apply all types of vulnerabilities (`yum`, `cve`, `sys`, `cms`, `emg`)\n5. Enable **High** (asap) and **Medium** (later) vulnerability scan levels",
      "Url": "https://hub.prowler.com/check/securitycenter_vulnerability_scan_enabled"
    }
  },
  "Categories": [
    "vulnerabilities"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_vulnerability_scan_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_vulnerability_scan_enabled/securitycenter_vulnerability_scan_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.securitycenter.securitycenter_client import (
    securitycenter_client,
)


class securitycenter_vulnerability_scan_enabled(Check):
    """Check if scheduled vulnerability scan is enabled on all servers."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # Required vulnerability types that must be enabled
        required_vul_types = ["yum", "cve", "sys", "cms", "emg"]

        # Required scan levels: "asap" (high) and "later" (medium)
        required_scan_levels = ["asap", "later"]

        vul_configs = securitycenter_client.vul_configs
        concern_necessity = securitycenter_client.concern_necessity

        # Check vulnerability types
        disabled_types = []
        for vul_type in required_vul_types:
            config = vul_configs.get(vul_type)
            if not config or not config.enabled:
                disabled_types.append(vul_type)

        # Check scan levels
        missing_levels = []
        for level in required_scan_levels:
            if level not in concern_necessity:
                missing_levels.append(level)

        # Create report
        report = CheckReportAlibabaCloud(metadata=self.metadata(), resource={})
        report.region = securitycenter_client.region
        report.resource_id = securitycenter_client.audited_account
        report.resource_arn = f"acs:sas::{securitycenter_client.audited_account}:vulnerability-scan-config"

        if not disabled_types and not missing_levels:
            report.status = "PASS"
            report.status_extended = (
                "Scheduled vulnerability scan is enabled for all vulnerability types "
                "(yum, cve, sys, cms, emg) and all required scan levels (high/asap, medium/later) are enabled."
            )
        else:
            report.status = "FAIL"
            issues = []
            if disabled_types:
                issues.append(
                    f"Vulnerability types disabled: {', '.join(disabled_types)}"
                )
            if missing_levels:
                level_names = {"asap": "high", "later": "medium"}
                missing_names = [
                    level_names.get(level, level) for level in missing_levels
                ]
                issues.append(
                    f"Scan levels not enabled: {', '.join(missing_names)} ({', '.join(missing_levels)})"
                )
            report.status_extended = (
                "Scheduled vulnerability scan is not properly configured. "
                + "; ".join(issues)
            )

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_client.py

```python
from prowler.providers.alibabacloud.services.sls.sls_service import Sls
from prowler.providers.common.provider import Provider

sls_client = Sls(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: sls_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_service.py
Signals: Pydantic

```python
from alibabacloud_sls20201230 import models as sls_models
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class Alert(BaseModel):
    name: str
    display_name: str
    state: str
    schedule: dict
    configuration: dict
    project: str
    region: str
    arn: str = ""


class LogStore(BaseModel):
    name: str
    project: str
    retention_forever: bool
    retention_days: int
    region: str
    arn: str = ""


class Sls(AlibabaCloudService):
    def __init__(self, provider):
        super().__init__("sls", provider)
        self.alerts = []
        self.log_stores = []
        self._get_alerts()
        self._get_log_stores()

    def _get_alerts(self):
        for region in self.regional_clients:
            client = self.regional_clients[region]
            try:
                # List Projects
                list_project_request = sls_models.ListProjectRequest(offset=0, size=500)
                projects_resp = client.list_project(list_project_request)

                if projects_resp.body and projects_resp.body.projects:
                    for project in projects_resp.body.projects:
                        project_name = project.project_name

                        # List Alerts for each project
                        list_alert_request = sls_models.ListAlertsRequest(
                            offset=0, size=500
                        )
                        try:
                            alerts_resp = client.list_alerts(
                                project_name, list_alert_request
                            )
                            if alerts_resp.body and alerts_resp.body.results:
                                for alert in alerts_resp.body.results:
                                    self.alerts.append(
                                        Alert(
                                            name=alert.name,
                                            display_name=alert.display_name,
                                            state=alert.state,
                                            schedule=(
                                                alert.schedule.to_map()
                                                if alert.schedule
                                                else {}
                                            ),
                                            configuration=(
                                                alert.configuration.to_map()
                                                if alert.configuration
                                                else {}
                                            ),
                                            project=project_name,
                                            region=region,
                                            arn=f"acs:log:{region}:{self.audited_account}:project/{project_name}/alert/{alert.name}",
                                        )
                                    )
                        except Exception as e:
                            logger.error(
                                f"{region} -- {e.__class__.__name__}[{e.__traceback__.tb_lineno}]: {e}"
                            )
            except Exception as error:
                logger.error(
                    f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_log_stores(self):
        for region in self.regional_clients:
            client = self.regional_clients[region]
            try:
                # List Projects
                list_project_request = sls_models.ListProjectRequest(offset=0, size=500)
                projects_resp = client.list_project(list_project_request)

                if projects_resp.body and projects_resp.body.projects:
                    for project in projects_resp.body.projects:
                        project_name = project.project_name

                        # List LogStores for each project
                        list_logstores_request = sls_models.ListLogStoresRequest(
                            offset=0, size=500
                        )
                        try:
                            logstores_resp = client.list_log_stores(
                                project_name, list_logstores_request
                            )
                            if logstores_resp.body and logstores_resp.body.logstores:
                                for logstore_name in logstores_resp.body.logstores:
                                    try:
                                        logstore_resp = client.get_log_store(
                                            project_name, logstore_name
                                        )
                                        if logstore_resp.body:
                                            self.log_stores.append(
                                                LogStore(
                                                    name=logstore_name,
                                                    project=project_name,
                                                    retention_forever=False,
                                                    retention_days=logstore_resp.body.ttl,
                                                    region=region,
                                                    arn=f"acs:log:{region}:{self.audited_account}:project/{project_name}/logstore/{logstore_name}",
                                                )
                                            )
                                    except Exception as e:
                                        logger.error(
                                            f"{region} -- {e.__class__.__name__}[{e.__traceback__.tb_lineno}]: {e}"
                                        )

                        except Exception as e:
                            logger.error(
                                f"{region} -- {e.__class__.__name__}[{e.__traceback__.tb_lineno}]: {e}"
                            )

            except Exception as error:
                logger.error(
                    f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
```

--------------------------------------------------------------------------------

---[FILE: sls_cloud_firewall_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_cloud_firewall_changes_alert_enabled/sls_cloud_firewall_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_cloud_firewall_changes_alert_enabled",
  "CheckTitle": "Log monitoring and alerts are set up for Cloud Firewall changes",
  "CheckType": [
    "Suspicious network connection",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "It is recommended that a **metric filter and alarm** be established for **Cloud Firewall** rule changes.",
  "Risk": "Monitoring for **Create** or **Update** firewall rule events gives insight into network access changes and may reduce the time it takes to detect **suspicious activity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/cloudfirewall-control-policy-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for Cloud Firewall changes",
      "Url": "https://hub.prowler.com/check/sls_cloud_firewall_changes_alert_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sls_cloud_firewall_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_cloud_firewall_changes_alert_enabled/sls_cloud_firewall_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_cloud_firewall_changes_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if "Cloudfw" in query and (
                    "CreateVpcFirewallControlPolicy" in query
                    or "DeleteVpcFirewallControlPolicy" in query
                    or "ModifyVpcFirewallControlPolicy" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for Cloud Firewall changes."
                    report.resource_id = alert.name
                    report.resource_arn = alert.arn
                    report.region = alert.region
                    findings.append(report)
                    break

            if found:
                break

        if not found:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=sls_client.provider.identity
            )
            report.status = "FAIL"
            report.status_extended = (
                "No SLS Alert configured for Cloud Firewall changes."
            )
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_customer_created_cmk_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_customer_created_cmk_changes_alert_enabled/sls_customer_created_cmk_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_customer_created_cmk_changes_alert_enabled",
  "CheckTitle": "A log monitoring and alerts are set up for disabling or deletion of customer created CMKs",
  "CheckType": [
    "Sensitive file tampering",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "Real-time monitoring of API calls can be achieved by directing **ActionTrail Logs** to Log Service and establishing corresponding query and alarms.\n\nIt is recommended that a query and alarm be established for customer-created **KMS keys** which have changed state to disabled or deletion.",
  "Risk": "Data encrypted with **disabled or deleted keys** will no longer be accessible.\n\nThis could lead to **data loss** or **business disruption** if keys are inadvertently or maliciously disabled.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/kms-cmk-config-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for disabling or deletion of customer-created CMKs",
      "Url": "https://hub.prowler.com/check/sls_customer_created_cmk_changes_alert_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sls_customer_created_cmk_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_customer_created_cmk_changes_alert_enabled/sls_customer_created_cmk_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_customer_created_cmk_changes_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if "Kms" in query and (
                    "DisableKey" in query
                    or "ScheduleKeyDeletion" in query
                    or "DeleteKeyMaterial" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for disabling or deletion of customer created CMKs."
                    report.resource_id = alert.name
                    report.resource_arn = alert.arn
                    report.region = alert.region
                    findings.append(report)
                    break

            if found:
                break

        if not found:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=sls_client.provider.identity
            )
            report.status = "FAIL"
            report.status_extended = "No SLS Alert configured for disabling or deletion of customer created CMKs."
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_logstore_retention_period.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_logstore_retention_period/sls_logstore_retention_period.metadata.json
Signals: Next.js

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_logstore_retention_period",
  "CheckTitle": "Logstore data retention period is set to the recommended period (default 365 days)",
  "CheckType": [
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/logstore/logstore-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSLogStore",
  "Description": "Ensure **Activity Log Retention** is set for **365 days** or greater.",
  "Risk": "Logstore lifecycle controls how your activity log is exported and retained. It is recommended to retain your activity log for **365 days or more** to have time to respond to any incidents.\n\nShort retention periods may result in loss of **forensic evidence** needed for security investigations.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/48990.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/sufficient-logstore-data-retention-period.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Find the project in the Projects section\n3. Click **Modify** icon next to the Logstore\n4. Modify the `Data Retention Period` to `365` or greater",
      "Url": "https://hub.prowler.com/check/sls_logstore_retention_period"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sls_logstore_retention_period.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_logstore_retention_period/sls_logstore_retention_period.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_logstore_retention_period(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # Get configurable max days from audit config (default: 365 days)
        min_log_retention_days = sls_client.audit_config.get(
            "min_log_retention_days", 365
        )

        for log_store in sls_client.log_stores:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=log_store
            )
            report.resource_id = log_store.name
            report.resource_arn = log_store.arn
            report.region = log_store.region

            # Check retention
            if log_store.retention_days >= min_log_retention_days:
                report.status = "PASS"
                report.status_extended = f"SLS LogStore {log_store.name} in project {log_store.project} has retention set to {log_store.retention_days} days (>= {min_log_retention_days} days)."
            else:
                report.status = "FAIL"
                report.status_extended = f"SLS LogStore {log_store.name} in project {log_store.project} has retention set to {log_store.retention_days} days (less than {min_log_retention_days} days)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_management_console_authentication_failures_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_management_console_authentication_failures_alert_enabled/sls_management_console_authentication_failures_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_management_console_authentication_failures_alert_enabled",
  "CheckTitle": "A log monitoring and alerts are set up for Management Console authentication failures",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "Real-time monitoring of API calls can be achieved by directing **ActionTrail Logs** to Log Service and establishing corresponding query and alarms.\n\nIt is recommended that a query and alarm be established for **failed console authentication attempts**.",
  "Risk": "Monitoring **failed console logins** may decrease lead time to detect an attempt to **brute force** a credential, which may provide an indicator (such as source IP) that can be used in other event correlation.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/account-continuous-login-failures-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for Management Console authentication failures",
      "Url": "https://hub.prowler.com/check/sls_management_console_authentication_failures_alert_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sls_management_console_authentication_failures_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_management_console_authentication_failures_alert_enabled/sls_management_console_authentication_failures_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_management_console_authentication_failures_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if "ConsoleSignin" in query and "event.errorCode" in query:
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for Management Console authentication failures."
                    report.resource_id = alert.name
                    report.resource_arn = alert.arn
                    report.region = alert.region
                    findings.append(report)
                    break

            if found:
                break

        if not found:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=sls_client.provider.identity
            )
            report.status = "FAIL"
            report.status_extended = "No SLS Alert configured for Management Console authentication failures."
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_management_console_signin_without_mfa_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_management_console_signin_without_mfa_alert_enabled/sls_management_console_signin_without_mfa_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_management_console_signin_without_mfa_alert_enabled",
  "CheckTitle": "A log monitoring and alerts are set up for Management Console sign-in without MFA",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "Real-time monitoring of API calls can be achieved by directing **ActionTrail Logs** to Log Service and establishing corresponding query and alarms.\n\nIt is recommended that a query and alarm be established for console logins that are not protected by **multi-factor authentication (MFA)**.",
  "Risk": "Monitoring for **single-factor console logins** will increase visibility into accounts that are not protected by MFA.\n\nThis helps identify potential security gaps in authentication enforcement.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/single-factor-console-logins-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for Management Console sign-in without MFA",
      "Url": "https://hub.prowler.com/check/sls_management_console_signin_without_mfa_alert_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sls_management_console_signin_without_mfa_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_management_console_signin_without_mfa_alert_enabled/sls_management_console_signin_without_mfa_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_management_console_signin_without_mfa_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if (
                    "ConsoleSignin" in query
                    and "addionalEventData.loginAccount" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for Management Console sign-in without MFA."
                    report.resource_id = alert.name
                    report.resource_arn = alert.arn
                    report.region = alert.region
                    findings.append(report)
                    break

            if found:
                break

        if not found:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=sls_client.provider.identity
            )
            report.status = "FAIL"
            report.status_extended = (
                "No SLS Alert configured for Management Console sign-in without MFA."
            )
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_oss_bucket_policy_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_oss_bucket_policy_changes_alert_enabled/sls_oss_bucket_policy_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_oss_bucket_policy_changes_alert_enabled",
  "CheckTitle": "A log monitoring and alerts are set up for OSS bucket policy changes",
  "CheckType": [
    "Sensitive file tampering",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "Real-time monitoring of API calls can be achieved by directing **ActionTrail Logs** to Log Service and establishing corresponding query and alarms.\n\nIt is recommended that a query and alarm be established for changes to **OSS bucket policies**.",
  "Risk": "Monitoring changes to **OSS bucket policies** may reduce time to detect and correct **permissive policies** on sensitive OSS buckets.\n\nThis helps prevent unintended data exposure.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/oss-bucket-authority-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for OSS bucket policy changes",
      "Url": "https://hub.prowler.com/check/sls_oss_bucket_policy_changes_alert_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sls_oss_bucket_policy_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_oss_bucket_policy_changes_alert_enabled/sls_oss_bucket_policy_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_oss_bucket_policy_changes_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if (
                    "PutBucketLifecycle" in query
                    or "PutBucketPolicy" in query
                    or "PutBucketCors" in query
                    or "PutBucketEncryption" in query
                    or "PutBucketReplication" in query
                    or "DeleteBucketPolicy" in query
                    or "DeleteBucketCors" in query
                    or "DeleteBucketLifecycle" in query
                    or "DeleteBucketEncryption" in query
                    or "DeleteBucketReplication" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for OSS bucket policy changes."
                    report.resource_id = alert.name
                    report.resource_arn = alert.arn
                    report.region = alert.region
                    findings.append(report)
                    break

            if found:
                break

        if not found:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=sls_client.provider.identity
            )
            report.status = "FAIL"
            report.status_extended = (
                "No SLS Alert configured for OSS bucket policy changes."
            )
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_oss_permission_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_oss_permission_changes_alert_enabled/sls_oss_permission_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_oss_permission_changes_alert_enabled",
  "CheckTitle": "Log monitoring and alerts are set up for OSS permission changes",
  "CheckType": [
    "Sensitive file tampering",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "It is recommended that a **metric filter and alarm** be established for **OSS Bucket RAM** changes.",
  "Risk": "Monitoring changes to **OSS permissions** may reduce time to detect and correct permissions on sensitive OSS buckets and objects inside the bucket.\n\nThis helps prevent **unauthorized access** to stored data.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/oss-bucket-permission-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **OSS logging** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for OSS permission changes",
      "Url": "https://hub.prowler.com/check/sls_oss_permission_changes_alert_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
