---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 227
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 227 of 867)

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

---[FILE: sls_oss_permission_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_oss_permission_changes_alert_enabled/sls_oss_permission_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_oss_permission_changes_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if ("PutBucket" in query and "acl" in query) or (
                    "PutObjectAcl" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for OSS permission changes."
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
                "No SLS Alert configured for OSS permission changes."
            )
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_ram_role_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_ram_role_changes_alert_enabled/sls_ram_role_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_ram_role_changes_alert_enabled",
  "CheckTitle": "Log monitoring and alerts are set up for RAM Role changes",
  "CheckType": [
    "Abnormal account",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "It is recommended that a query and alarm be established for **RAM Role** creation, deletion, and updating activities.",
  "Risk": "Monitoring **role creation**, **deletion**, and **updating** activities will help in identifying potential **malicious actions** at an early stage.\n\nUnauthorized role changes could lead to privilege escalation.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/ram-policy-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for RAM/ResourceManager policy changes",
      "Url": "https://hub.prowler.com/check/sls_ram_role_changes_alert_enabled"
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

---[FILE: sls_ram_role_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_ram_role_changes_alert_enabled/sls_ram_role_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_ram_role_changes_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            # Check configuration for query
            # alert.configuration is a dict. configuration['queryList'] is a list of dicts with 'query'
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                # Check for key terms
                # Query: ("event.serviceName": ResourceManager or "event.serviceName": Ram) ...
                if (
                    ("ResourceManager" in query or "Ram" in query)
                    and "CreatePolicy" in query
                    and "DeletePolicy" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = (
                        f"SLS Alert {alert.name} is configured for RAM Role changes."
                    )
                    report.resource_id = alert.name
                    report.resource_arn = alert.arn
                    report.region = alert.region
                    findings.append(report)
                    break  # Found one query in this alert

            if found:
                break

        if not found:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=sls_client.provider.identity
            )
            report.status = "FAIL"
            report.status_extended = "No SLS Alert configured for RAM Role changes."
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_rds_instance_configuration_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_rds_instance_configuration_changes_alert_enabled/sls_rds_instance_configuration_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_rds_instance_configuration_changes_alert_enabled",
  "CheckTitle": "Log monitoring and alerts are set up for RDS instance configuration changes",
  "CheckType": [
    "Intrusion into applications",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "It is recommended that a **metric filter and alarm** be established for **RDS Instance** configuration changes.",
  "Risk": "Monitoring changes to **RDS Instance configuration** may reduce time to detect and correct **misconfigurations** done on database servers.\n\nThis helps prevent security gaps in database deployments.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/rds-instance-config-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for RDS instance configuration changes",
      "Url": "https://hub.prowler.com/check/sls_rds_instance_configuration_changes_alert_enabled"
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

---[FILE: sls_rds_instance_configuration_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_rds_instance_configuration_changes_alert_enabled/sls_rds_instance_configuration_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_rds_instance_configuration_changes_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if "rds" in query and (
                    "ModifyHASwitchConfig" in query
                    or "ModifyDBInstanceHAConfig" in query
                    or "SwitchDBInstanceHA" in query
                    or "ModifyDBInstanceSpec" in query
                    or "MigrateSecurityIPMode" in query
                    or "ModifySecurityIps" in query
                    or "ModifyDBInstanceSSL" in query
                    or "MigrateToOtherZone" in query
                    or "UpgradeDBInstanceKernelVersion" in query
                    or "UpgradeDBInstanceEngineVersion" in query
                    or "ModifyDBInstanceMaintainTime" in query
                    or "ModifyDBInstanceAutoUpgradeMinorVersion" in query
                    or "AllocateInstancePublicConnection" in query
                    or "ModifyDBInstanceConnectionString" in query
                    or "ModifyDBInstanceNetworkExpireTime" in query
                    or "ReleaseInstancePublicConnection" in query
                    or "SwitchDBInstanceNetType" in query
                    or "ModifyDBInstanceNetworkType" in query
                    or "ModifyDTCSecurityIpHostsForSQLServer" in query
                    or "ModifySecurityGroupConfiguration" in query
                    or "CreateBackup" in query
                    or "ModifyBackupPolicy" in query
                    or "DeleteBackup" in query
                    or "CreateDdrInstance" in query
                    or "ModifyInstanceCrossBackupPolicy" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for RDS instance configuration changes."
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
                "No SLS Alert configured for RDS instance configuration changes."
            )
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_root_account_usage_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_root_account_usage_alert_enabled/sls_root_account_usage_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_root_account_usage_alert_enabled",
  "CheckTitle": "A log monitoring and alerts are set up for usage of root account",
  "CheckType": [
    "Unusual logon",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "Real-time monitoring of API calls can be achieved by directing **ActionTrail Logs** to Log Service and establishing corresponding query and alarms.\n\nIt is recommended that a query and alarm be established for **root account login** attempts.",
  "Risk": "Monitoring for **root account logins** will provide visibility into the use of a fully privileged account and an opportunity to reduce its use.\n\nRoot account usage should be minimized and closely monitored.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/root-account-login-frequent-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for root account usage",
      "Url": "https://hub.prowler.com/check/sls_root_account_usage_alert_enabled"
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

---[FILE: sls_root_account_usage_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_root_account_usage_alert_enabled/sls_root_account_usage_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_root_account_usage_alert_enabled(Check):
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
                    and "event.userIdentity.type" in query
                    and "root-account" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = (
                        f"SLS Alert {alert.name} is configured for root account usage."
                    )
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
            report.status_extended = "No SLS Alert configured for root account usage."
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_security_group_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_security_group_changes_alert_enabled/sls_security_group_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_security_group_changes_alert_enabled",
  "CheckTitle": "A log monitoring and alerts are set up for security group changes",
  "CheckType": [
    "Suspicious network connection",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "Real-time monitoring of API calls can be achieved by directing **ActionTrail Logs** to Log Service and establishing corresponding query and alarms.\n\n**Security Groups** are a stateful packet filter that controls ingress and egress traffic within a VPC. It is recommended that a query and alarm be established for changes to Security Groups.",
  "Risk": "Monitoring changes to **security groups** will help ensure that resources and services are not unintentionally exposed.\n\nUnauthorized security group modifications could lead to **network exposure** and **unauthorized access**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/security-group-config-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for security group changes",
      "Url": "https://hub.prowler.com/check/sls_security_group_changes_alert_enabled"
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

---[FILE: sls_security_group_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_security_group_changes_alert_enabled/sls_security_group_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_security_group_changes_alert_enabled(Check):
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
                    "CreateSecurityGroup" in query
                    or "AuthorizeSecurityGroup" in query
                    or "AuthorizeSecurityGroupEgress" in query
                    or "RevokeSecurityGroup" in query
                    or "RevokeSecurityGroupEgress" in query
                    or "JoinSecurityGroup" in query
                    or "LeaveSecurityGroup" in query
                    or "DeleteSecurityGroup" in query
                    or "ModifySecurityGroupPolicy" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for security group changes."
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
                "No SLS Alert configured for security group changes."
            )
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_unauthorized_api_calls_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_unauthorized_api_calls_alert_enabled/sls_unauthorized_api_calls_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_unauthorized_api_calls_alert_enabled",
  "CheckTitle": "A log monitoring and alerts are set up for unauthorized API calls",
  "CheckType": [
    "Unusual logon",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "Real-time monitoring of API calls can be achieved by directing **ActionTrail Logs** to Log Service and establishing corresponding query and alarms.\n\nIt is recommended that a query and alarm be established for **unauthorized API calls**.",
  "Risk": "Monitoring **unauthorized API calls** will help reveal application errors and may reduce time to detect **malicious activity**.\n\nThis is essential for early detection of potential security breaches.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/unauthorized-api-calls-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for unauthorized API calls",
      "Url": "https://hub.prowler.com/check/sls_unauthorized_api_calls_alert_enabled"
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

---[FILE: sls_unauthorized_api_calls_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_unauthorized_api_calls_alert_enabled/sls_unauthorized_api_calls_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_unauthorized_api_calls_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if "ApiCall" in query and (
                    "NoPermission" in query
                    or "Forbidden" in query
                    or "Forbbiden" in query
                    or "InvalidAccessKeyId" in query
                    or "InvalidSecurityToken" in query
                    or "SignatureDoesNotMatch" in query
                    or "InvalidAuthorization" in query
                    or "AccessForbidden" in query
                    or "NotAuthorized" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for unauthorized API calls."
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
                "No SLS Alert configured for unauthorized API calls."
            )
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_vpc_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_vpc_changes_alert_enabled/sls_vpc_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_vpc_changes_alert_enabled",
  "CheckTitle": "Log monitoring and alerts are set up for VPC changes",
  "CheckType": [
    "Suspicious network connection",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "It is recommended that a **log search/analysis query and alarm** be established for **VPC changes**.",
  "Risk": "Monitoring changes to **VPC** will help ensure VPC traffic flow is not getting impacted.\n\nUnauthorized VPC modifications could disrupt network connectivity or create security vulnerabilities.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/vpc-config-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for VPC changes",
      "Url": "https://hub.prowler.com/check/sls_vpc_changes_alert_enabled"
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

---[FILE: sls_vpc_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_vpc_changes_alert_enabled/sls_vpc_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_vpc_changes_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if ("Ecs" in query or "Vpc" in query) and (
                    "CreateVpc" in query
                    or "DeleteVpc" in query
                    or "DisableVpcClassicLink" in query
                    or "EnableVpcClassicLink" in query
                    or "DeletionProtection" in query
                    or "AssociateVpcCidrBlock" in query
                    or "UnassociateVpcCidrBlock" in query
                    or "RevokeInstanceFromCen" in query
                    or "CreateVSwitch" in query
                    or "DeleteVSwitch" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = (
                        f"SLS Alert {alert.name} is configured for VPC changes."
                    )
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
            report.status_extended = "No SLS Alert configured for VPC changes."
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sls_vpc_network_route_changes_alert_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_vpc_network_route_changes_alert_enabled/sls_vpc_network_route_changes_alert_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "sls_vpc_network_route_changes_alert_enabled",
  "CheckTitle": "Log monitoring and alerts are set up for VPC network route changes",
  "CheckType": [
    "Suspicious network connection",
    "Cloud threat detection"
  ],
  "ServiceName": "sls",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:log:region:account-id:project/project-name/alert/alert-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSLSAlert",
  "Description": "It is recommended that a **metric filter and alarm** be established for **VPC network route** changes.",
  "Risk": "Monitoring changes to **route tables** will help ensure that all VPC traffic flows through an expected path.\n\nUnauthorized route changes could redirect traffic through malicious intermediaries.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/en/doc-detail/91784.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SLS/vpc-network-route-changes-alert.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **SLS Console**\n2. Ensure **ActionTrail** is enabled\n3. Select **Alerts**\n4. Ensure alert rule has been enabled for VPC network route changes",
      "Url": "https://hub.prowler.com/check/sls_vpc_network_route_changes_alert_enabled"
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

---[FILE: sls_vpc_network_route_changes_alert_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/sls/sls_vpc_network_route_changes_alert_enabled/sls_vpc_network_route_changes_alert_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.sls.sls_client import sls_client


class sls_vpc_network_route_changes_alert_enabled(Check):
    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        found = False

        for alert in sls_client.alerts:
            query_list = alert.configuration.get("queryList", [])
            if not query_list:
                continue

            for query_obj in query_list:
                query = query_obj.get("query", "")
                if ("Ecs" in query or "Vpc" in query) and (
                    "CreateRouteEntry" in query
                    or "DeleteRouteEntry" in query
                    or "ModifyRouteEntry" in query
                    or "AssociateRouteTable" in query
                    or "UnassociateRouteTable" in query
                ):
                    found = True
                    report = CheckReportAlibabaCloud(
                        metadata=self.metadata(), resource=alert
                    )
                    report.status = "PASS"
                    report.status_extended = f"SLS Alert {alert.name} is configured for VPC network route changes."
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
                "No SLS Alert configured for VPC network route changes."
            )
            report.resource_id = sls_client.audited_account
            report.resource_arn = sls_client.provider.identity.identity_arn
            report.region = sls_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: vpc_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/vpc/vpc_client.py

```python
from prowler.providers.alibabacloud.services.vpc.vpc_service import VPC
from prowler.providers.common.provider import Provider

vpc_client = VPC(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: vpc_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/vpc/vpc_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from alibabacloud_vpc20160428 import models as vpc_models
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class VPC(AlibabaCloudService):
    """
    VPC (Virtual Private Cloud) service class for Alibaba Cloud.

    This class provides methods to interact with Alibaba Cloud VPC service
    to retrieve VPCs, flow logs, etc.
    """

    def __init__(self, provider):
        # Call AlibabaCloudService's __init__
        super().__init__(__class__.__name__, provider, global_service=False)

        # Fetch VPC resources
        self.vpcs = {}
        self.__threading_call__(self._describe_vpcs)
        self._describe_flow_logs()

    def _describe_vpcs(self, regional_client):
        """List all VPCs in the region."""
        region = getattr(regional_client, "region", "unknown")
        logger.info(f"VPC - Describing VPCs in {region}...")

        try:
            request = vpc_models.DescribeVpcsRequest()
            response = regional_client.describe_vpcs(request)

            if response and response.body and response.body.vpcs:
                for vpc_data in response.body.vpcs.vpc:
                    if not self.audit_resources or is_resource_filtered(
                        vpc_data.vpc_id, self.audit_resources
                    ):
                        vpc_id = vpc_data.vpc_id
                        self.vpcs[vpc_id] = VPCs(
                            id=vpc_id,
                            name=getattr(vpc_data, "vpc_name", vpc_id),
                            region=region,
                            cidr_block=getattr(vpc_data, "cidr_block", ""),
                            description=getattr(vpc_data, "description", ""),
                            create_time=getattr(vpc_data, "creation_time", None),
                            is_default=getattr(vpc_data, "is_default", False),
                            flow_log_enabled=False,  # Will be updated in _describe_flow_logs
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_flow_logs(self):
        """Get flow logs for all VPCs."""
        logger.info("VPC - Describing Flow Logs...")

        for vpc_id, vpc in self.vpcs.items():
            try:
                regional_client = self.regional_clients.get(vpc.region)
                if not regional_client:
                    continue

                request = vpc_models.DescribeFlowLogsRequest()
                request.resource_id = vpc_id
                request.resource_type = "VPC"
                response = regional_client.describe_flow_logs(request)

                if response and response.body and response.body.flow_logs:
                    flow_logs = response.body.flow_logs.flow_log
                    if flow_logs:
                        # Check if any flow log is active
                        for flow_log in flow_logs:
                            status = getattr(flow_log, "status", "")
                            if status == "Active":
                                vpc.flow_log_enabled = True
                                break

            except Exception as error:
                logger.error(
                    f"{vpc.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


# Models for VPC service
class VPCs(BaseModel):
    """VPC model."""

    id: str
    name: str
    region: str
    cidr_block: str
    description: str = ""
    create_time: Optional[datetime] = None
    is_default: bool = False
    flow_log_enabled: bool = False
```

--------------------------------------------------------------------------------

````
