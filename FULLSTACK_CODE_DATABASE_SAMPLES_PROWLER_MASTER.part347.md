---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 347
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 347 of 867)

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

---[FILE: sqlserver_recommended_minimal_tls_version.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_recommended_minimal_tls_version/sqlserver_recommended_minimal_tls_version.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_recommended_minimal_tls_version(Check):
    def execute(self) -> List[Check_Report_Azure]:
        findings = []
        recommended_minimal_tls_versions = sqlserver_client.audit_config.get(
            "recommended_minimal_tls_versions", ["1.2", "1.3"]
        )
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} is using TLS version {sql_server.minimal_tls_version} as minimal accepted which is not recommended. Please use one of the recommended versions: {', '.join(recommended_minimal_tls_versions)}."
                if sql_server.minimal_tls_version in recommended_minimal_tls_versions:
                    report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} is using version {sql_server.minimal_tls_version} as minimal accepted which is recommended."
                    report.status = "PASS"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_tde_encrypted_with_cmk.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_tde_encrypted_with_cmk/sqlserver_tde_encrypted_with_cmk.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_tde_encrypted_with_cmk",
  "CheckTitle": "Ensure SQL server's Transparent Data Encryption (TDE) protector is encrypted with Customer-managed key",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Transparent Data Encryption (TDE) with Customer-managed key support provides increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties.",
  "Risk": "Customer-managed key support for Transparent Data Encryption (TDE) allows user control of TDE encryption keys and restricts who can access them and when. Azure Key Vault, Azure cloud-based external key management system, is the first key management service where TDE has integrated support for Customer-managed keys. With Customer-managed key support, the database encryption key is protected by an asymmetric key stored in the Key Vault. The asymmetric key is set at the server level and inherited by all databases under that server",
  "RelatedUrl": "https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption-byok-azure-sql",
  "Remediation": {
    "Code": {
      "CLI": "az sql server tde-key set --resource-group resourceName --server dbServerName --server-key-type {AzureKeyVault} --kid keyIdentifier",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Sql/use-byok-for-transparent-data-encryption.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Go to SQL servers For the desired server instance 2. Click On Transparent data encryption 3. Set Transparent data encryption to Customer-managed key 4. Browse through your key vaults to Select an existing key or create a new key in the Azure Key Vault. 5. Check Make selected key the default TDE protector",
      "Url": "https://learn.microsoft.com/en-us/azure/azure-sql/database/transparent-data-encryption-byok-overview?view=azuresql"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Once TDE protector is encrypted with a Customer-managed key, it transfers entire responsibility of respective key management on to you, and hence you should be more careful about doing any operations on the particular key in order to keep data from corresponding SQL server and Databases hosted accessible. When deploying Customer Managed Keys, it is prudent to ensure that you also deploy an automated toolset for managing these keys (this should include discovery and key rotation), and Keys should be stored in an HSM or hardware backed keystore, such as Azure Key Vault. As far as toolsets go, check with your cryptographic key provider, as they may well provide one as an add-on to their service."
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_tde_encrypted_with_cmk.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_tde_encrypted_with_cmk/sqlserver_tde_encrypted_with_cmk.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_tde_encrypted_with_cmk(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                databases = (
                    sql_server.databases if sql_server.databases is not None else []
                )
                if len(databases) > 0:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=sql_server
                    )
                    report.subscription = subscription
                    found_disabled = False
                    if (
                        sql_server.encryption_protector.server_key_type
                        == "AzureKeyVault"
                    ):
                        for database in databases:
                            if found_disabled:
                                break
                            if database.tde_encryption.status == "Enabled":
                                report.status = "PASS"
                                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has TDE enabled with CMK."
                            else:
                                report.status = "FAIL"
                                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has TDE disabled with CMK."
                                found_disabled = True
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has TDE disabled without CMK."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_tde_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_tde_encryption_enabled/sqlserver_tde_encryption_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_tde_encryption_enabled",
  "CheckTitle": "Ensure SQL server's Transparent Data Encryption (TDE) protector is encrypted",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Enable Transparent Data Encryption on every SQL server.",
  "Risk": "Azure SQL Database transparent data encryption helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/transparent-data-encryption-with-azure-sql-database",
  "Remediation": {
    "Code": {
      "CLI": "az sql db tde set --resource-group resourceGroup --server dbServerName --database dbName --status Enabled",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Sql/data-encryption.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Go to SQL databases 2. For each DB instance 3. Click on Transparent data encryption 4. Set Data encryption to On",
      "Url": "https://learn.microsoft.com/en-us/azure/azure-sql/database/transparent-data-encryption-byok-overview?view=azuresql"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_tde_encryption_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_tde_encryption_enabled/sqlserver_tde_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_tde_encryption_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                databases = (
                    sql_server.databases if sql_server.databases is not None else []
                )
                if len(databases) > 0:
                    for database in databases:
                        if database.name.lower() == "master":
                            continue
                        report = Check_Report_Azure(
                            metadata=self.metadata(), resource=database
                        )
                        report.subscription = subscription
                        if database.tde_encryption.status == "Enabled":
                            report.status = "PASS"
                            report.status_extended = f"Database {database.name} from SQL Server {sql_server.name} from subscription {subscription} has TDE enabled"
                        else:
                            report.status = "FAIL"
                            report.status_extended = f"Database {database.name} from SQL Server {sql_server.name} from subscription {subscription} has TDE disabled"
                        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_unrestricted_inbound_access.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_unrestricted_inbound_access/sqlserver_unrestricted_inbound_access.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_unrestricted_inbound_access",
  "CheckTitle": "Ensure no Azure SQL Databases allow ingress from 0.0.0.0/0 (ANY IP)",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "SQLServer",
  "Description": "Ensure that there are no firewall rules allowing traffic from 0.0.0.0-255.255.255.255",
  "Risk": "Azure SQL servers provide a firewall that, by default, blocks all Internet connections. When the rule (0.0.0.0-255.255.255.255) is used, the server can be accessed by any source from the Internet, incrementing significantly the attack surface of the SQL Server. It is recommended to use more granular firewall rules.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview",
  "Remediation": {
    "Code": {
      "CLI": "az sql server firewall-rule delete --resource-group resource_group_name --server sql_server_name --name rule_name",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Sql/unrestricted-sql-database-access.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-networking-policies/bc_azr_networking_4#terraform"
    },
    "Recommendation": {
      "Text": "Remove firewall rules allowing all sources and, instead, use more granular rules",
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

---[FILE: sqlserver_unrestricted_inbound_access.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_unrestricted_inbound_access/sqlserver_unrestricted_inbound_access.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_unrestricted_inbound_access(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} does not have firewall rules allowing 0.0.0.0-255.255.255.255."
                for firewall_rule in sql_server.firewall_rules:
                    if (
                        firewall_rule.start_ip_address == "0.0.0.0"
                        and firewall_rule.end_ip_address == "255.255.255.255"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has firewall rules allowing 0.0.0.0-255.255.255.255."
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_va_emails_notifications_admins_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_va_emails_notifications_admins_enabled/sqlserver_va_emails_notifications_admins_enabled.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_va_emails_notifications_admins_enabled",
  "CheckTitle": "Ensure that Vulnerability Assessment (VA) setting 'Also send email notifications to admins and subscription owners' is set for each SQL Server",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Enable Vulnerability Assessment (VA) setting 'Also send email notifications to admins and subscription owners'.",
  "Risk": "VA scan reports and alerts will be sent to admins and subscription owners by enabling setting 'Also send email notifications to admins and subscription owners'. This may help in reducing time required for identifying risks and taking corrective measures.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/sql-database/sql-vulnerability-assessment",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-va-setting-also-send-email-notifications-to-admins-and-subscription-owners-is-set-for-an-sql-server#terraform"
    },
    "Recommendation": {
      "Text": "1. Go to SQL servers 2. Select a server instance 3. Click on Security Center 4. Select Configure next to Enabled at subscription-level 5. In Section Vulnerability Assessment Settings, configure Storage Accounts if not already 6. Check/enable 'Also send email notifications to admins and subscription owners' 7. Click Save",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/sql-azure-vulnerability-assessment-enable"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling the Microsoft Defender for SQL features will incur additional costs for each SQL server."
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_va_emails_notifications_admins_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_va_emails_notifications_admins_enabled/sqlserver_va_emails_notifications_admins_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_va_emails_notifications_admins_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment disabled."
                if (
                    sql_server.vulnerability_assessment
                    and sql_server.vulnerability_assessment.storage_container_path
                ):
                    report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment enabled but no scan reports configured for subscription admins."
                    if (
                        sql_server.vulnerability_assessment.recurring_scans
                        and sql_server.vulnerability_assessment.recurring_scans.email_subscription_admins
                    ):
                        report.status = "PASS"
                        report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment enabled and scan reports configured for subscription admins."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_va_periodic_recurring_scans_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_va_periodic_recurring_scans_enabled/sqlserver_va_periodic_recurring_scans_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_va_periodic_recurring_scans_enabled",
  "CheckTitle": "Ensure that Vulnerability Assessment (VA) setting 'Periodic recurring scans' is set to 'on' for each SQL server",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Enable Vulnerability Assessment (VA) Periodic recurring scans for critical SQL servers and corresponding SQL databases.",
  "Risk": "VA setting 'Periodic recurring scans' schedules periodic (weekly) vulnerability scanning for the SQL server and corresponding Databases. Periodic and regular vulnerability scanning provides risk visibility based on updated known vulnerability signatures and best practices.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/sql-database/sql-vulnerability-assessment",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Sql/periodic-vulnerability-scans.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-va-setting-periodic-recurring-scans-is-enabled-on-a-sql-server#terraform"
    },
    "Recommendation": {
      "Text": "1. Go to SQL servers 2. For each server instance 3. Click on Security Center 4. In Section Vulnerability Assessment Settings, set Storage Account if not already 5. Toggle 'Periodic recurring scans' to ON. 6. Click Save",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/sql-azure-vulnerability-assessment-enable"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling the Azure Defender for SQL feature will incur additional costs for each SQL server."
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_va_periodic_recurring_scans_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_va_periodic_recurring_scans_enabled/sqlserver_va_periodic_recurring_scans_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_va_periodic_recurring_scans_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment disabled."
                if (
                    sql_server.vulnerability_assessment
                    and sql_server.vulnerability_assessment.storage_container_path
                ):
                    report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment enabled but no recurring scans."
                    if (
                        sql_server.vulnerability_assessment.recurring_scans
                        and sql_server.vulnerability_assessment.recurring_scans.is_enabled
                    ):
                        report.status = "PASS"
                        report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has periodic recurring scans enabled."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_va_scan_reports_configured.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_va_scan_reports_configured/sqlserver_va_scan_reports_configured.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_va_scan_reports_configured",
  "CheckTitle": "Ensure that Vulnerability Assessment (VA) setting 'Send scan reports to' is configured for a SQL server",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Configure 'Send scan reports to' with email addresses of concerned data owners/stakeholders for a critical SQL servers.",
  "Risk": "Vulnerability Assessment (VA) scan reports and alerts will be sent to email addresses configured at 'Send scan reports to'. This may help in reducing time required for identifying risks and taking corrective measures",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/sql-database/sql-vulnerability-assessment",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-va-setting-send-scan-reports-to-is-configured-for-a-sql-server#terraform"
    },
    "Recommendation": {
      "Text": "1. Go to SQL servers 2. Select a server instance 3. Select Microsoft Defender for Cloud 4. Select Configure next to Enablement status 5. Set Microsoft Defender for SQL to On 6. Under Vulnerability Assessment Settings, select a Storage Account 7. Set Periodic recurring scans to On 8. Under Send scan reports to, provide email addresses for data owners and stakeholders 9. Click Save",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/sql-azure-vulnerability-assessment-enable"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling the Microsoft Defender for SQL features will incur additional costs for each SQL server."
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_va_scan_reports_configured.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_va_scan_reports_configured/sqlserver_va_scan_reports_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_va_scan_reports_configured(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment disabled."
                if (
                    sql_server.vulnerability_assessment
                    and sql_server.vulnerability_assessment.storage_container_path
                ):
                    report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment enabled but no scan reports configured."
                    if sql_server.vulnerability_assessment.recurring_scans and (
                        (
                            sql_server.vulnerability_assessment.recurring_scans.email_subscription_admins
                        )
                        or (
                            sql_server.vulnerability_assessment.recurring_scans.emails
                            and len(
                                sql_server.vulnerability_assessment.recurring_scans.emails
                            )
                            > 0
                        )
                    ):
                        report.status = "PASS"
                        report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment enabled and scan reports configured."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_vulnerability_assessment_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_vulnerability_assessment_enabled/sqlserver_vulnerability_assessment_enabled.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_vulnerability_assessment_enabled",
  "CheckTitle": "Ensure that Vulnerability Assessment (VA) is enabled on a SQL server by setting a Storage Account",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Enable Vulnerability Assessment (VA) service scans for critical SQL servers and corresponding SQL databases.",
  "Risk": "The Vulnerability Assessment service scans databases for known security vulnerabilities and highlights deviations from best practices, such as misconfigurations, excessive permissions, and unprotected sensitive data. Results of the scan include actionable steps to resolve each issue and provide customized remediation scripts where applicable. Additionally, an assessment report can be customized by setting an acceptable baseline for permission configurations, feature configurations, and database settings.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/sql-database/sql-vulnerability-assessment",
  "Remediation": {
    "Code": {
      "CLI": "Update-AzSqlServerVulnerabilityAssessmentSetting -ResourceGroupName resource_group_name -ServerName Server_Name -StorageAccountName Storage_Name_from_same_subscription_and_same_Location -ScanResultsContainerName vulnerability-assessment -RecurringScansInterval Weekly -EmailSubscriptionAdmins $true -NotificationEmail @('mail1@mail.com' , 'mail2@mail.com')",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Sql/vulnerability-assessment-sql-servers.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-vulnerability-assessment-va-is-enabled-on-a-sql-server-by-setting-a-storage-account"
    },
    "Recommendation": {
      "Text": "1. Go to SQL servers 2. Select a server instance 3. Click on Security Center 4. Select Configure next to Enabled at subscription-level 5. In Section Vulnerability Assessment Settings, Click Select Storage account 6. Choose Storage Account (Existing or Create New). Click Ok 7. Click Save",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/sql-azure-vulnerability-assessment-enable"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling the Microsoft Defender for SQL features will incur additional costs for each SQL server."
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_vulnerability_assessment_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_vulnerability_assessment_enabled/sqlserver_vulnerability_assessment_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_vulnerability_assessment_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment disabled."
                if (
                    sql_server.vulnerability_assessment
                    and sql_server.vulnerability_assessment.storage_container_path
                    is not None
                ):
                    report.status = "PASS"
                    report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has vulnerability assessment enabled."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: storage_client.py]---
Location: prowler-master/prowler/providers/azure/services/storage/storage_client.py

```python
from prowler.providers.azure.services.storage.storage_service import Storage
from prowler.providers.common.provider import Provider

storage_client = Storage(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
