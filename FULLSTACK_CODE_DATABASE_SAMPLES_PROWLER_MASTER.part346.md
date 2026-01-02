---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 346
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 346 of 867)

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

---[FILE: postgresql_flexible_server_log_retention_days_greater_3.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_log_retention_days_greater_3/postgresql_flexible_server_log_retention_days_greater_3.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "postgresql_flexible_server_log_retention_days_greater_3",
  "CheckTitle": "Ensure Server Parameter 'log_retention_days' is greater than 3 days for PostgreSQL Database Server",
  "CheckType": [],
  "ServiceName": "postgresql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "PostgreSQL",
  "Description": "Ensure log_retention_days on PostgreSQL Servers is set to an appropriate value.",
  "Risk": "Configuring log_retention_days determines the duration in days that Azure Database for PostgreSQL retains log files. Query and error logs can be used to identify, troubleshoot, and repair configuration errors and sub-optimal performance.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/postgresql/howto-configure-server-parameters-using-portal",
  "Remediation": {
    "Code": {
      "CLI": "az postgres server configuration set --resource-group <resourceGroupName> --server-name <serverName> --name log_retention_days --value <4-7>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/PostgreSQL/log-retention-days.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "From Azure Portal 1. From Azure Home select the Portal Menu. 2. Go to Azure Database for PostgreSQL servers. 3. For each database, click on Server parameters. 4. Search for log_retention_days. 5. Input a value between 4 and 7 (inclusive) and click Save. From Azure CLI Use the below command to update log_retention_days configuration. az postgres server configuration set --resource-group <resourceGroupName> -- server-name <serverName> --name log_retention_days --value <4-7> From Powershell Use the below command to update log_retention_days configuration. Update-AzPostgreSqlConfiguration -ResourceGroupName <ResourceGroupName> - ServerName <ServerName> -Name log_retention_days -Value <4-7>",
      "Url": "https://learn.microsoft.com/en-us/rest/api/postgresql/singleserver/configurations/list-by-server?view=rest-postgresql-singleserver-2017-12-01&tabs=HTTP"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Configuring this setting will result in logs being retained for the specified number of days. If this is configured on a high traffic server, the log may grow quickly to occupy a large amount of disk space. In this case you may want to set this to a lower number."
}
```

--------------------------------------------------------------------------------

---[FILE: postgresql_flexible_server_log_retention_days_greater_3.py]---
Location: prowler-master/prowler/providers/azure/services/postgresql/postgresql_flexible_server_log_retention_days_greater_3/postgresql_flexible_server_log_retention_days_greater_3.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.postgresql.postgresql_client import (
    postgresql_client,
)


class postgresql_flexible_server_log_retention_days_greater_3(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for (
            subscription,
            flexible_servers,
        ) in postgresql_client.flexible_servers.items():
            for server in flexible_servers:
                report = Check_Report_Azure(metadata=self.metadata(), resource=server)
                report.subscription = subscription
                report.status = "FAIL"
                report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has log_retention disabled"
                if server.log_retention_days:
                    report.status_extended = f"Flexible Postgresql server {server.name} from subscription {subscription} has log_retention set to {server.log_retention_days}"
                    if (
                        int(server.log_retention_days) > 3
                        and int(server.log_retention_days) < 8
                    ):
                        report.status = "PASS"
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: recovery_client.py]---
Location: prowler-master/prowler/providers/azure/services/recovery/recovery_client.py

```python
from prowler.providers.azure.services.recovery.recovery_service import Recovery
from prowler.providers.common.provider import Provider

recovery_client = Recovery(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: recovery_service.py]---
Location: prowler-master/prowler/providers/azure/services/recovery/recovery_service.py
Signals: Pydantic

```python
from typing import Optional

from azure.mgmt.recoveryservices import RecoveryServicesClient
from azure.mgmt.recoveryservicesbackup import RecoveryServicesBackupClient
from azure.mgmt.recoveryservicesbackup.activestamp.models import DataSourceType
from pydantic import BaseModel, Field

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class BackupItem(BaseModel):
    """Model that represents a backup item."""

    id: str
    name: str
    workload_type: Optional[DataSourceType]
    backup_policy_id: Optional[str] = None


class BackupPolicy(BaseModel):
    """Model that represents a backup policy."""

    id: str
    name: str
    retention_days: Optional[int] = None


class BackupVault(BaseModel):
    """Model that represents a backup vault."""

    id: str
    name: str
    location: str
    backup_protected_items: dict[str, BackupItem] = Field(default_factory=dict)
    backup_policies: dict[str, BackupPolicy] = Field(default_factory=dict)


class Recovery(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(RecoveryServicesClient, provider)
        self.vaults: dict[str, dict[str, BackupVault]] = self._get_vaults()
        RecoveryBackup(provider, self.vaults)

    def _get_vaults(self) -> dict[str, dict[str, BackupVault]]:
        """
        Retrieve all Recovery Services vaults for each subscription.

        Returns:
            Nested dictionary of vaults by subscription.
        """
        logger.info("Recovery - Getting Recovery Services vaults...")
        vaults_dict: dict[str, dict[str, BackupVault]] = {}
        try:
            vaults_dict: dict[str, dict[str, BackupVault]] = {}
            for subscription_name, client in self.clients.items():
                vaults = client.vaults.list_by_subscription_id()
                vaults_dict[subscription_name] = {}
                for vault in vaults:
                    vault_obj = BackupVault(
                        id=vault.id,
                        name=vault.name,
                        location=vault.location,
                    )
                    vaults_dict[subscription_name][vault_obj.id] = vault_obj
        except Exception as error:
            logger.error(
                f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return vaults_dict


class RecoveryBackup(AzureService):
    def __init__(
        self, provider: AzureProvider, vaults: dict[str, dict[str, BackupVault]]
    ):
        super().__init__(RecoveryServicesBackupClient, provider)
        for subscription_name, vaults in vaults.items():
            for vault in vaults.values():
                vault.backup_protected_items = self._get_backup_protected_items(
                    subscription_name=subscription_name, vault=vault
                )
                vault.backup_policies = self._get_backup_policies(
                    subscription_name=subscription_name, vault=vault
                )

    def _get_backup_protected_items(
        self, subscription_name: str, vault: BackupVault
    ) -> dict[str, BackupItem]:
        """
        Retrieve all backup protected items for a given vault.
        """
        logger.info("Recovery - Getting backup protected items...")
        backup_protected_items_dict: dict[str, BackupItem] = {}
        try:
            backup_protected_items = self.clients[
                subscription_name
            ].backup_protected_items.list(
                vault_name=vault.name,
                resource_group_name=vault.id.split("/")[4],
            )
            for item in backup_protected_items:
                item_properties = getattr(item, "properties", None)
                backup_protected_items_dict[item.id] = BackupItem(
                    id=item.id,
                    name=item.name,
                    workload_type=(
                        item_properties.workload_type if item_properties else None
                    ),
                    backup_policy_id=(
                        item_properties.policy_id if item_properties else None
                    ),
                )
        except Exception as error:
            logger.error(
                f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return backup_protected_items_dict

    def _get_backup_policies(
        self, subscription_name: str, vault: BackupVault
    ) -> dict[str, BackupPolicy]:
        """
        Retrieve all backup policies for a given vault.
        """
        logger.info("Recovery - Getting backup policies...")
        backup_policies_dict: dict[str, BackupPolicy] = {}
        unique_backup_policies: set[str] = set()
        try:
            for item in vault.backup_protected_items.values():
                if item.backup_policy_id:
                    unique_backup_policies.add(item.backup_policy_id)
            for policy_id in unique_backup_policies:
                policy = self.clients[subscription_name].protection_policies.get(
                    vault_name=vault.name,
                    resource_group_name=vault.id.split("/")[4],
                    policy_name=policy_id.split("/")[-1],
                )
                backup_policies_dict[policy_id] = BackupPolicy(
                    id=policy.id,
                    name=policy.name,
                    retention_days=getattr(
                        getattr(
                            getattr(
                                getattr(
                                    getattr(policy, "properties", None),
                                    "retention_policy",
                                    None,
                                ),
                                "daily_schedule",
                                None,
                            ),
                            "retention_duration",
                            None,
                        ),
                        "count",
                        None,
                    ),
                )
        except Exception as error:
            logger.error(
                f"Subscription name: {subscription_name} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return backup_policies_dict
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_client.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_client.py

```python
from prowler.providers.azure.services.sqlserver.sqlserver_service import SQLServer
from prowler.providers.common.provider import Provider

sqlserver_client = SQLServer(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_service.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_service.py

```python
from dataclasses import dataclass
from typing import List, Optional

from azure.mgmt.sql import SqlManagementClient

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.lib.service.service import AzureService


class SQLServer(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(SqlManagementClient, provider)
        self.sql_servers = self._get_sql_servers()

    def _get_sql_servers(self):
        logger.info("SQL Server - Getting SQL servers...")
        sql_servers = {}
        for subscription, client in self.clients.items():
            try:
                sql_servers.update({subscription: []})
                sql_servers_list = client.servers.list()
                for sql_server in sql_servers_list:
                    resource_group = self._get_resource_group(sql_server.id)
                    auditing_policies = self._get_server_blob_auditing_policies(
                        subscription, resource_group, sql_server.name
                    )
                    firewall_rules = self._get_firewall_rules(
                        subscription, resource_group, sql_server.name
                    )
                    encryption_protector = self._get_enctyption_protectors(
                        subscription, resource_group, sql_server.name
                    )
                    vulnerability_assessment = self._get_vulnerability_assesments(
                        subscription, resource_group, sql_server.name
                    )
                    security_alert_policies = self._get_server_security_alert_policies(
                        subscription, resource_group, sql_server.name
                    )
                    location = self._get_location(
                        subscription, resource_group, sql_server.name
                    )

                    sql_servers[subscription].append(
                        Server(
                            id=sql_server.id,
                            name=sql_server.name,
                            public_network_access=sql_server.public_network_access,
                            minimal_tls_version=sql_server.minimal_tls_version,
                            administrators=ServerExternalAdministrator(
                                sid=getattr(
                                    getattr(sql_server, "administrators", None),
                                    "sid",
                                    "",
                                ),
                                administrator_type=getattr(
                                    getattr(sql_server, "administrators", None),
                                    "administrator_type",
                                    "",
                                ),
                            ),
                            auditing_policies=auditing_policies,
                            firewall_rules=firewall_rules,
                            encryption_protector=encryption_protector,
                            databases=self._get_databases(
                                subscription, resource_group, sql_server.name
                            ),
                            vulnerability_assessment=vulnerability_assessment,
                            security_alert_policies=security_alert_policies,
                            location=location,
                        )
                    )
            except Exception as error:
                logger.error(
                    f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        return sql_servers

    def _get_resource_group(self, id):
        resource_group = id.split("/")[4]
        return resource_group

    def _get_transparent_data_encryption(
        self, subscription, resource_group, server_name, database_name
    ):
        client = self.clients[subscription]
        tde_encrypted = client.transparent_data_encryptions.get(
            resource_group_name=resource_group,
            server_name=server_name,
            database_name=database_name,
            transparent_data_encryption_name="current",
        )
        return tde_encrypted

    def _get_enctyption_protectors(self, subscription, resource_group, server_name):
        client = self.clients[subscription]
        encryption_protectors = client.encryption_protectors.get(
            resource_group_name=resource_group,
            server_name=server_name,
            encryption_protector_name="current",
        )

        current_encryption_protector = EncryptionProtector(
            id=encryption_protectors.id,
            name=encryption_protectors.name,
            type=encryption_protectors.type,
            server_key_name=encryption_protectors.server_key_name,
            server_key_type=encryption_protectors.server_key_type,
        )

        return current_encryption_protector

    def _get_databases(self, subscription, resource_group, server_name):
        logger.info("SQL Server - Getting server databases...")
        databases = []
        try:
            client = self.clients[subscription]
            databases_server = client.databases.list_by_server(
                resource_group_name=resource_group,
                server_name=server_name,
            )
            for database in databases_server:
                tde_encrypted = self._get_transparent_data_encryption(
                    subscription, resource_group, server_name, database.name
                )
                databases.append(
                    Database(
                        id=database.id,
                        name=database.name,
                        type=database.type,
                        location=database.location,
                        managed_by=database.managed_by,
                        tde_encryption=TransparentDataEncryption(
                            id=tde_encrypted.id,
                            name=tde_encrypted.name,
                            type=tde_encrypted.type,
                            location=tde_encrypted.location,
                            status=tde_encrypted.status,
                        ),
                    )
                )
        except Exception as error:
            logger.error(
                f"Subscription name: {subscription} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return databases

    def _get_vulnerability_assesments(self, subscription, resource_group, server_name):
        client = self.clients[subscription]
        vulnerability_assessment = client.server_vulnerability_assessments.get(
            resource_group_name=resource_group,
            server_name=server_name,
            vulnerability_assessment_name="default",
        )
        return ServerVulnerabilityAssessment(
            id=vulnerability_assessment.id,
            name=vulnerability_assessment.name,
            type=vulnerability_assessment.type,
            storage_container_path=vulnerability_assessment.storage_container_path,
            recurring_scans=VulnerabilityAssessmentRecurringScans(
                is_enabled=vulnerability_assessment.recurring_scans.is_enabled,
                emails=vulnerability_assessment.recurring_scans.emails,
                email_subscription_admins=vulnerability_assessment.recurring_scans.email_subscription_admins,
            ),
        )

    def _get_server_blob_auditing_policies(
        self, subscription, resource_group, server_name
    ):
        client = self.clients[subscription]
        auditing_policies = client.server_blob_auditing_policies.list_by_server(
            resource_group_name=resource_group,
            server_name=server_name,
        )
        auditing_policies_objects = []
        for policy in auditing_policies:
            auditing_policies_objects.append(
                ServerBlobAuditingPolicy(
                    id=policy.id,
                    name=policy.name,
                    type=policy.type,
                    state=policy.state,
                    retention_days=policy.retention_days,
                )
            )
        return auditing_policies_objects

    def _get_firewall_rules(self, subscription, resource_group, server_name):
        client = self.clients[subscription]
        firewall_rules = client.firewall_rules.list_by_server(
            resource_group_name=resource_group, server_name=server_name
        )
        firewall_rules_objects = []
        for rule in firewall_rules:
            firewall_rules_objects.append(
                FirewallRule(
                    name=rule.name,
                    start_ip_address=rule.start_ip_address,
                    end_ip_address=rule.end_ip_address,
                )
            )
        return firewall_rules_objects

    def _get_server_security_alert_policies(
        self, subscription, resource_group, server_name
    ):
        client = self.clients[subscription]
        security_alert_policies = client.server_security_alert_policies.get(
            resource_group_name=resource_group,
            server_name=server_name,
            security_alert_policy_name="default",
        )
        return ServerSecurityAlertPolicy(
            id=security_alert_policies.id,
            name=security_alert_policies.name,
            type=security_alert_policies.type,
            state=security_alert_policies.state,
        )

    def _get_location(self, subscription, resouce_group_name, server_name):
        client = self.clients[subscription]
        location = client.servers.get(resouce_group_name, server_name).location

        return location


@dataclass
class TransparentDataEncryption:
    id: str
    name: str
    type: str
    location: str
    status: str


@dataclass
class Database:
    id: str
    name: str
    type: str
    location: str
    managed_by: str
    tde_encryption: TransparentDataEncryption


@dataclass
class ServerExternalAdministrator:
    sid: str
    administrator_type: str


@dataclass
class ServerBlobAuditingPolicy:
    id: str
    name: str
    type: str
    state: str
    retention_days: int


@dataclass
class FirewallRule:
    name: str
    start_ip_address: str
    end_ip_address: str


@dataclass
class EncryptionProtector:
    id: str
    name: str
    type: str
    server_key_name: str
    server_key_type: str


@dataclass
class VulnerabilityAssessmentRecurringScans:
    is_enabled: bool
    emails: List[str]
    email_subscription_admins: bool


@dataclass
class ServerVulnerabilityAssessment:
    id: str
    name: str
    type: str
    storage_container_path: str
    recurring_scans: VulnerabilityAssessmentRecurringScans


@dataclass
class ServerSecurityAlertPolicy:
    id: str
    name: str
    type: str
    state: str


@dataclass
class Server:
    id: str
    name: str
    public_network_access: str
    minimal_tls_version: str
    administrators: ServerExternalAdministrator
    auditing_policies: List[ServerBlobAuditingPolicy]
    firewall_rules: List[FirewallRule]
    location: str
    encryption_protector: Optional[EncryptionProtector] = None
    vulnerability_assessment: Optional[ServerVulnerabilityAssessment] = None
    security_alert_policies: Optional[ServerSecurityAlertPolicy] = None
    databases: list[Database] = None
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_auditing_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_auditing_enabled/sqlserver_auditing_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_auditing_enabled",
  "CheckTitle": "Ensure that SQL Servers have an audit policy configured",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Ensure that there is an audit policy configured",
  "Risk": "Audit policies are used to store logs associated to the SQL server (for instance, successful/unsuccesful log in attempts). These logs may be useful to detect anomalies or to perform an investigation in case a security incident is detected",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/sql-database/sql-database-auditing",
  "Remediation": {
    "Code": {
      "CLI": "Set-AzureRmSqlServerAuditingPolicy -ResourceGroupName <RESOURCE_GROUP_NAME> -ServerName <SERVER_NAME> -AuditType <AUDIT_TYPE> -StorageAccountName <STORAGE_ACCOUNT_NAME>",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/azure/azure-logging-policies/bc_azr_logging_2",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-logging-policies/bc_azr_logging_2#terraform"
    },
    "Recommendation": {
      "Text": "Create an audit policy for the SQL server",
      "Url": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Sql/auditing.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_auditing_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_auditing_enabled/sqlserver_auditing_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_auditing_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has an auditing policy configured."
                for auditing_policy in sql_server.auditing_policies:
                    if auditing_policy.state == "Disabled":
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} does not have any auditing policy configured."
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_auditing_retention_90_days.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_auditing_retention_90_days/sqlserver_auditing_retention_90_days.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_auditing_retention_90_days",
  "CheckTitle": "Ensure that 'Auditing' Retention is 'greater than 90 days'",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "SQL Server Audit Retention should be configured to be greater than 90 days.",
  "Risk": "Audit Logs can be used to check for anomalies and give insight into suspected breaches or misuse of information and access.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/sql-database/sql-database-auditing",
  "Remediation": {
    "Code": {
      "CLI": "Set-AzSqlServerAudit -ResourceGroupName resource_group_name -ServerName SQL_Server_name -RetentionInDays 100 -LogAnalyticsTargetState Enabled -WorkspaceResourceId '/subscriptions/subscription_ID/resourceGroups/insights-integration/providers/Microsoft.OperationalInsights/workspaces/workspace_name'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/Sql/auditing-retention.html#",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-logging-policies/bc_azr_logging_3"
    },
    "Recommendation": {
      "Text": "1. Go to SQL servers 2. For each server instance 3. Click on Auditing 4. If storage is selected, expand Advanced properties 5. Set the Retention (days) setting greater than 90 days or 0 for unlimited retention. 6. Select Save",
      "Url": "https://learn.microsoft.com/en-us/purview/audit-log-retention-policies"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_auditing_retention_90_days.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_auditing_retention_90_days/sqlserver_auditing_retention_90_days.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_auditing_retention_90_days(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                has_failed = False
                has_policy = False
                for policy in sql_server.auditing_policies:
                    has_policy = True
                    if has_failed:
                        break
                    if policy.state == "Enabled":
                        if policy.retention_days <= 90:
                            report.status = "FAIL"
                            report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has auditing retention less than 91 days."
                            has_failed = True
                        else:
                            report.status = "PASS"
                            report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has auditing retention greater than 90 days."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has auditing disabled."
                        has_failed = True
                if has_policy:
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_azuread_administrator_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_azuread_administrator_enabled/sqlserver_azuread_administrator_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_azuread_administrator_enabled",
  "CheckTitle": "Ensure that SQL Servers have an Azure Active Directory administrator",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Ensure that there is an Azure Active Directory administrator configured",
  "Risk": "Azure Active Directory provides a centralized way of managing identities. Using local SQL administrator identites makes it more difficult to manage user accounts. In addition, from Azure Active Directory, security policies can be enforced to users in centralized way.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/sql-database/sql-database-aad-authentication",
  "Remediation": {
    "Code": {
      "CLI": "az sql server ad-admin create --resource-group resource_group_name --server server_name --display-name display_name --object-id user_object_id",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/Sql/active-directory-admin.html",
      "Terraform": "https://docs.prowler.com/checks/azure/azure-general-policies/ensure-that-azure-active-directory-admin-is-configured#terraform"
    },
    "Recommendation": {
      "Text": "Enable an Azure Active Directory administrator",
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

---[FILE: sqlserver_azuread_administrator_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_azuread_administrator_enabled/sqlserver_azuread_administrator_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_azuread_administrator_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                report = Check_Report_Azure(
                    metadata=self.metadata(), resource=sql_server
                )
                report.subscription = subscription
                report.status = "PASS"
                report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has an Active Directory administrator."

                if (
                    sql_server.administrators is None
                    or sql_server.administrators.administrator_type != "ActiveDirectory"
                ):
                    report.status = "FAIL"
                    report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} does not have an Active Directory administrator."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_microsoft_defender_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_microsoft_defender_enabled/sqlserver_microsoft_defender_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_microsoft_defender_enabled",
  "CheckTitle": "Ensure that Microsoft Defender for SQL is set to 'On' for critical SQL Servers",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Ensure that Microsoft Defender for SQL is set to 'On' for critical SQL Servers",
  "Risk": "Microsoft Defender for SQL is a unified package for advanced SQL security capabilities. Microsoft Defender is available for Azure SQL Database, Azure SQL Managed  classifying sensitive data, surfacing and mitigating potential database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database. It provides a single go-to location for enabling and managing these capabilities.",
  "RelatedUrl": "https://docs.microsoft.com/en-us/azure/azure-sql/database/azure-defender-for-sql?view=azuresql",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/azure/SecurityCenter/defender-azure-sql.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Go to SQL servers For each production SQL server instance: 2. Click Microsoft Defender for Cloud 3. Click Enable Microsoft Defender for SQL",
      "Url": "https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-sql-usage"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Microsoft Defender for SQL is a paid feature and will incur additional cost for each SQL server."
}
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_microsoft_defender_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_microsoft_defender_enabled/sqlserver_microsoft_defender_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.sqlserver.sqlserver_client import sqlserver_client


class sqlserver_microsoft_defender_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []
        for subscription, sql_servers in sqlserver_client.sql_servers.items():
            for sql_server in sql_servers:
                if sql_server.security_alert_policies:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=sql_server
                    )
                    report.subscription = subscription
                    report.status = "FAIL"
                    report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has microsoft defender disabled."
                    if sql_server.security_alert_policies.state == "Enabled":
                        report.status = "PASS"
                        report.status_extended = f"SQL Server {sql_server.name} from subscription {subscription} has microsoft defender enabled."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqlserver_recommended_minimal_tls_version.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/sqlserver/sqlserver_recommended_minimal_tls_version/sqlserver_recommended_minimal_tls_version.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "sqlserver_recommended_minimal_tls_version",
  "CheckTitle": "Ensure SQL server has a recommended minimal TLS version required.",
  "CheckType": [],
  "ServiceName": "sqlserver",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "SQLServer",
  "Description": "Ensure that SQL Server instances are configured with the recommended minimal TLS version to maintain secure connections.",
  "Risk": "Using outdated or weak TLS versions can expose SQL Server instances to vulnerabilities, increasing the risk of data breaches and unauthorized access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/azure-sql/database/connectivity-settings?view=azuresql&tabs=azure-portal#configure-minimum-tls-version",
  "Remediation": {
    "Code": {
      "CLI": "az sql server update -n sql-server-name -g sql-server-group --set minimalTlsVersion=<version>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Go to Azure SQL Server 2. Navigate to 'Security' -> 'Networking' 3. Select 'Connectivity' 4. Update the TLS version in the field 'Minimum TLS version' to a recommended minimal version (e.g., TLS 1.2).",
      "Url": "https://learn.microsoft.com/en-us/azure/azure-sql/database/connectivity-settings?view=azuresql&tabs=azure-portal#configure-minimum-tls-version"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Verify support for the TLS version from the application side before changing the minimal version."
}
```

--------------------------------------------------------------------------------

````
