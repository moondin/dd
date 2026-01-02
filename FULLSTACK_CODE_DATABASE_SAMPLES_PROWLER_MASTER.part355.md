---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 355
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 355 of 867)

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

---[FILE: bigquery_dataset_cmk_encryption.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/bigquery/bigquery_dataset_cmk_encryption/bigquery_dataset_cmk_encryption.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "bigquery_dataset_cmk_encryption",
  "CheckTitle": "Ensure BigQuery datasets are encrypted with Customer-Managed Keys (CMKs).",
  "CheckType": [],
  "ServiceName": "bigquery",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Dataset",
  "Description": "Ensure BigQuery datasets are encrypted with Customer-Managed Keys (CMKs) in order to have a more granular control over data encryption/decryption process.",
  "Risk": "If you want to have greater control, Customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery Data Sets.",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/BigQuery/enable-table-encryption-with-cmks.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/cloud-sql-policies/bc_gcp_sql_11",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-general-policies/ensure-gcp-big-query-tables-are-encrypted-with-customer-supplied-encryption-keys-csek-1#terraform"
    },
    "Recommendation": {
      "Text": "Encrypting datasets with Cloud KMS Customer-Managed Keys (CMKs) will allow for a more granular control over data encryption/decryption process.",
      "Url": "https://cloud.google.com/bigquery/docs/customer-managed-encryption"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: bigquery_dataset_cmk_encryption.py]---
Location: prowler-master/prowler/providers/gcp/services/bigquery/bigquery_dataset_cmk_encryption/bigquery_dataset_cmk_encryption.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.bigquery.bigquery_client import bigquery_client


class bigquery_dataset_cmk_encryption(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for dataset in bigquery_client.datasets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=dataset)
            report.status = "PASS"
            report.status_extended = f"Dataset {dataset.name} is encrypted with Customer-Managed Keys (CMKs)."
            if not dataset.cmk_encryption:
                report.status = "FAIL"
                report.status_extended = f"Dataset {dataset.name} is not encrypted with Customer-Managed Keys (CMKs)."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bigquery_dataset_public_access.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/bigquery/bigquery_dataset_public_access/bigquery_dataset_public_access.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "bigquery_dataset_public_access",
  "CheckTitle": "Ensure That BigQuery Datasets Are Not Anonymously or Publicly Accessible.",
  "CheckType": [],
  "ServiceName": "bigquery",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Dataset",
  "Description": "Ensure That BigQuery Datasets Are Not Anonymously or Publicly Accessible.",
  "Risk": "Granting permissions to allUsers or allAuthenticatedUsers allows anyone to access the dataset. Such access might not be desirable if sensitive data is being stored in the dataset. Therefore, ensure that anonymous and/or public access to a dataset is not allowed.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/BigQuery/publicly-accessible-big-query-datasets.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-general-policies/bc_gcp_general_3#terraform"
    },
    "Recommendation": {
      "Text": "It is recommended that the IAM policy on BigQuery datasets does not allow anonymous and/or public access.",
      "Url": "https://cloud.google.com/bigquery/docs/customer-managed-encryption"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: bigquery_dataset_public_access.py]---
Location: prowler-master/prowler/providers/gcp/services/bigquery/bigquery_dataset_public_access/bigquery_dataset_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.bigquery.bigquery_client import bigquery_client


class bigquery_dataset_public_access(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for dataset in bigquery_client.datasets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=dataset)
            report.status = "PASS"
            report.status_extended = (
                f"Dataset {dataset.name} is not publicly accessible."
            )
            if dataset.public:
                report.status = "FAIL"
                report.status_extended = (
                    f"Dataset {dataset.name} is publicly accessible."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bigquery_table_cmk_encryption.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/bigquery/bigquery_table_cmk_encryption/bigquery_table_cmk_encryption.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "bigquery_table_cmk_encryption",
  "CheckTitle": "Ensure BigQuery tables are encrypted with Customer-Managed Keys (CMKs).",
  "CheckType": [],
  "ServiceName": "bigquery",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Table",
  "Description": "Ensure BigQuery tables are encrypted with Customer-Managed Keys (CMKs) in order to have a more granular control over data encryption/decryption process.",
  "Risk": "If you want to have greater control, Customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery Tables.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/BigQuery/enable-table-encryption-with-cmks.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-general-policies/ensure-gcp-big-query-tables-are-encrypted-with-customer-supplied-encryption-keys-csek#terraform"
    },
    "Recommendation": {
      "Text": "Encrypting tables with Cloud KMS Customer-Managed Keys (CMKs) will allow for a more granular control over data encryption/decryption process.",
      "Url": "https://cloud.google.com/bigquery/docs/customer-managed-encryption"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: bigquery_table_cmk_encryption.py]---
Location: prowler-master/prowler/providers/gcp/services/bigquery/bigquery_table_cmk_encryption/bigquery_table_cmk_encryption.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.bigquery.bigquery_client import bigquery_client


class bigquery_table_cmk_encryption(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for table in bigquery_client.tables:
            report = Check_Report_GCP(metadata=self.metadata(), resource=table)
            report.status = "PASS"
            report.status_extended = (
                f"Table {table.name} is encrypted with Customer-Managed Keys (CMKs)."
            )
            if not table.cmk_encryption:
                report.status = "FAIL"
                report.status_extended = f"Table {table.name} is not encrypted with Customer-Managed Keys (CMKs)."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudresourcemanager_client.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudresourcemanager/cloudresourcemanager_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_service import (
    CloudResourceManager,
)

cloudresourcemanager_client = CloudResourceManager(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cloudresourcemanager_service.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudresourcemanager/cloudresourcemanager_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class CloudResourceManager(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider)

        self.bindings = []
        self.cloud_resource_manager_projects = []
        self.organizations = []
        self._get_iam_policy()
        self._get_organizations()

    def _get_iam_policy(self):
        for project_id in self.project_ids:
            try:
                # Get project details to obtain project number
                project_details = (
                    self.client.projects()
                    .get(projectId=project_id)
                    .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                )
                project_number = project_details.get("projectNumber", "")

                policy = (
                    self.client.projects()
                    .getIamPolicy(resource=project_id)
                    .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                )
                audit_logging = False
                audit_configs = []
                if policy.get("auditConfigs"):
                    audit_logging = True
                    for config in policy.get("auditConfigs", []):
                        log_types = []
                        for log_config in config.get("auditLogConfigs", []):
                            log_types.append(log_config.get("logType", ""))
                        audit_configs.append(
                            AuditConfig(
                                service=config.get("service", ""),
                                log_types=log_types,
                            )
                        )
                self.cloud_resource_manager_projects.append(
                    Project(
                        id=project_id,
                        number=project_number,
                        audit_logging=audit_logging,
                        audit_configs=audit_configs,
                    )
                )
                for binding in policy["bindings"]:
                    self.bindings.append(
                        Binding(
                            role=binding["role"],
                            members=binding["members"],
                            project_id=project_id,
                        )
                    )
            except Exception as error:
                logger.error(
                    f"{self.region} -- "
                    f"{error.__class__.__name__}"
                    f"[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_organizations(self):
        try:
            if self.project_ids:
                response = (
                    self.client.organizations()
                    .search()
                    .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                )
                for org in response.get("organizations", []):
                    self.organizations.append(
                        Organization(
                            id=org["name"].split("/")[-1],
                            name=org["displayName"],
                        )
                    )
        except Exception as error:
            logger.error(
                f"{self.region} -- "
                f"{error.__class__.__name__}"
                f"[{error.__traceback__.tb_lineno}]: {error}"
            )


class AuditConfig(BaseModel):
    service: str
    log_types: list[str]


class Binding(BaseModel):
    role: str
    members: list
    project_id: str


class Project(BaseModel):
    id: str
    number: str = ""
    audit_logging: bool
    audit_configs: list[AuditConfig] = []


class Organization(BaseModel):
    id: str
    name: str
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_client.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.cloudsql.cloudsql_service import CloudSQL

cloudsql_client = CloudSQL(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_service.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class CloudSQL(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__("sqladmin", provider)
        self.instances = []
        self._get_instances()

    def _get_instances(self):
        for project_id in self.project_ids:
            try:
                request = self.client.instances().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for instance in response.get("items", []):
                        public_ip = False
                        for address in instance.get("ipAddresses", []):
                            if address["type"] == "PRIMARY":
                                public_ip = True
                        self.instances.append(
                            Instance(
                                name=instance["name"],
                                version=instance["databaseVersion"],
                                region=instance["region"],
                                ip_addresses=instance.get("ipAddresses", []),
                                public_ip=public_ip,
                                require_ssl=instance["settings"]
                                .get("ipConfiguration", {})
                                .get("requireSsl", False),
                                ssl_mode=instance["settings"]
                                .get("ipConfiguration", {})
                                .get("sslMode", "ALLOW_UNENCRYPTED_AND_ENCRYPTED"),
                                automated_backups=instance["settings"]
                                .get("backupConfiguration", {})
                                .get("enabled", False),
                                authorized_networks=instance["settings"]
                                .get("ipConfiguration", {})
                                .get("authorizedNetworks", []),
                                flags=instance["settings"].get("databaseFlags", []),
                                project_id=project_id,
                            )
                        )

                    request = self.client.instances().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Instance(BaseModel):
    name: str
    version: str
    ip_addresses: list
    region: str
    public_ip: bool
    authorized_networks: list
    require_ssl: bool
    ssl_mode: str
    automated_backups: bool
    flags: list
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_automated_backups.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_automated_backups/cloudsql_instance_automated_backups.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_automated_backups",
  "CheckTitle": "Ensure That Cloud SQL Database Instances Are Configured With Automated Backups",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure That Cloud SQL Database Instances Are Configured With Automated Backups",
  "Risk": "Backups provide a way to restore a Cloud SQL instance to recover lost data or recover from a problem with that instance. Automated backups need to be set for any instance that contains data that should be protected from loss or damage. This recommendation is applicable for SQL Server, PostgreSql, MySql generation 1 and MySql generation 2 instances.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch <INSTANCE_NAME> --backup-start-time <[HH:MM]>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/enable-automated-backups.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to have all SQL database instances set to enable automated backups.",
      "Url": "https://cloud.google.com/sql/docs/postgres/configure-ssl-instance/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_automated_backups.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_automated_backups/cloudsql_instance_automated_backups.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_automated_backups(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"Database Instance {instance.name} has automated backups configured."
            )
            if not instance.automated_backups:
                report.status = "FAIL"
                report.status_extended = f"Database Instance {instance.name} does not have automated backups configured."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_mysql_local_infile_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_mysql_local_infile_flag/cloudsql_instance_mysql_local_infile_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_mysql_local_infile_flag",
  "CheckTitle": "Ensure That the Local_infile Database Flag for a Cloud SQL MySQL Instance Is Set to Off",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure That the Local_infile Database Flag for a Cloud SQL MySQL Instance Is Set to Off",
  "Risk": "The local_infile flag controls the server-side LOCAL capability for LOAD DATA statements. Depending on the local_infile setting, the server refuses or permits local data loading by clients that have LOCAL enabled on the client side.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags local_infile=off",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/disable-local-infile-flag.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/cloud-sql-policies/bc_gcp_sql_1#terraform"
    },
    "Recommendation": {
      "Text": "It is recommended to set the local_infile database flag for a Cloud SQL MySQL instance to off.",
      "Url": "https://cloud.google.com/sql/docs/mysql/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_mysql_local_infile_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_mysql_local_infile_flag/cloudsql_instance_mysql_local_infile_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_mysql_local_infile_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "MYSQL" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"MySQL Instance {instance.name} does not have 'local_infile' flag set to 'off'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "local_infile"
                        and flag.get("value", "on") == "off"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"MySQL Instance {instance.name} has 'local_infile' flag set to 'off'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_mysql_skip_show_database_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_mysql_skip_show_database_flag/cloudsql_instance_mysql_skip_show_database_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_mysql_skip_show_database_flag",
  "CheckTitle": "Ensure Skip_show_database Database Flag for Cloud SQL MySQL Instance Is Set to On",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure Skip_show_database Database Flag for Cloud SQL MySQL Instance Is Set to On",
  "Risk": "'skip_show_database' database flag prevents people from using the SHOW DATABASES statement if they do not have the SHOW DATABASES privilege.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags skip_show_database=on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/enable-skip-show-database-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to set skip_show_database database flag for Cloud SQL Mysql instance to on.",
      "Url": "https://cloud.google.com/sql/docs/mysql/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_mysql_skip_show_database_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_mysql_skip_show_database_flag/cloudsql_instance_mysql_skip_show_database_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_mysql_skip_show_database_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "MYSQL" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"MySQL Instance {instance.name} does not have 'skip_show_database' flag set to 'on'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "skip_show_database"
                        and flag.get("value", "off") == "on"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"MySQL Instance {instance.name} has 'skip_show_database' flag set to 'on'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_enable_pgaudit_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_enable_pgaudit_flag/cloudsql_instance_postgres_enable_pgaudit_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_postgres_enable_pgaudit_flag",
  "CheckTitle": "Ensure That 'cloudsql.enable_pgaudit' Database Flag for each Cloud Sql Postgresql Instance Is Set to 'on' For Centralized Logging",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure That 'cloudsql.enable_pgaudit' Database Flag for each Cloud Sql Postgresql Instance Is Set to 'on' For Centralized Logging",
  "Risk": "Ensure cloudsql.enable_pgaudit database flag for Cloud SQL PostgreSQL instance is set to on to allow for centralized logging.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags cloudsql.enable_pgaudit=On",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/postgre-sql-audit-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "As numerous other recommendations in this section consist of turning on flags for logging purposes, your organization will need a way to manage these logs. You may have a solution already in place. If you do not, consider installing and enabling the open source pgaudit extension within PostgreSQL and enabling its corresponding flag of cloudsql.enable_pgaudit. This flag and installing the extension enables database auditing in PostgreSQL through the open-source pgAudit extension. This extension provides detailed session and object logging to comply with government, financial, & ISO standards and provides auditing capabilities to mitigate threats by monitoring security events on the instance. Enabling the flag and settings later in this recommendation will send these logs to Google Logs Explorer so that you can access them in a central location.",
      "Url": "https://cloud.google.com/sql/docs/postgres/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_enable_pgaudit_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_enable_pgaudit_flag/cloudsql_instance_postgres_enable_pgaudit_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_postgres_enable_pgaudit_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "POSTGRES" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"PostgreSQL Instance {instance.name} does not have 'cloudsql.enable_pgaudit' flag set to 'on'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "cloudsql.enable_pgaudit"
                        and flag.get("value", "off") == "on"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"PostgreSQL Instance {instance.name} has 'cloudsql.enable_pgaudit' flag set to 'on'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_connections_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_connections_flag/cloudsql_instance_postgres_log_connections_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_postgres_log_connections_flag",
  "CheckTitle": "Ensure That the Log_connections Database Flag for Cloud SQL PostgreSQL Instance Is Set to On",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure That the Log_connections Database Flag for Cloud SQL PostgreSQL Instance Is Set to On",
  "Risk": "Enabling the log_connections setting causes each attempted connection to the server to be logged, along with successful completion of client authentication. This parameter cannot be changed after the session starts.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags log_connections=on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/enable-log-connections-flag.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/cloud-sql-policies/bc_gcp_sql_3#terraform"
    },
    "Recommendation": {
      "Text": "PostgreSQL does not log attempted connections by default. Enabling the log_connections setting will create log entries for each attempted connection as well as successful completion of client authentication which can be useful in troubleshooting issues and to determine any unusual connection attempts to the server.",
      "Url": "https://cloud.google.com/sql/docs/postgres/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_connections_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_connections_flag/cloudsql_instance_postgres_log_connections_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_postgres_log_connections_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "POSTGRES" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"PostgreSQL Instance {instance.name} does not have 'log_connections' flag set to 'on'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "log_connections"
                        and flag.get("value", "off") == "on"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"PostgreSQL Instance {instance.name} has 'log_connections' flag set to 'on'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_disconnections_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_disconnections_flag/cloudsql_instance_postgres_log_disconnections_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_postgres_log_disconnections_flag",
  "CheckTitle": "Ensure That the log_disconnections Database Flag for Cloud SQL PostgreSQL Instance Is Set to On",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure That the log_disconnections Database Flag for Cloud SQL PostgreSQL Instance Is Set to On",
  "Risk": "PostgreSQL does not log session details such as duration and session end by default. Enabling the log_disconnections setting will create log entries at the end of each session which can be useful in troubleshooting issues and determine any unusual activity across a time period.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags log_disconnections=on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/enable-log-connections-flag.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/cloud-sql-policies/bc_gcp_sql_4#terraform"
    },
    "Recommendation": {
      "Text": "Enabling the log_disconnections setting logs the end of each session, including the session duration.",
      "Url": "https://cloud.google.com/sql/docs/postgres/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_disconnections_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_disconnections_flag/cloudsql_instance_postgres_log_disconnections_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_postgres_log_disconnections_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "POSTGRES" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"PostgreSQL Instance {instance.name} does not have 'log_disconnections' flag set to 'on'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "log_disconnections"
                        and flag.get("value", "off") == "on"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"PostgreSQL Instance {instance.name} has 'log_disconnections' flag set to 'on'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_error_verbosity_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_error_verbosity_flag/cloudsql_instance_postgres_log_error_verbosity_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_postgres_log_error_verbosity_flag",
  "CheckTitle": "Ensure Log_error_verbosity Database Flag for Cloud SQL PostgreSQL Instance Is Set to DEFAULT or Stricter",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure Log_error_verbosity Database Flag for Cloud SQL PostgreSQL Instance Is Set to DEFAULT or Stricter",
  "Risk": "The log_error_verbosity flag controls the verbosity/details of messages logged.TERSE excludes the logging of DETAIL, HINT, QUERY, and CONTEXT error information. VERBOSE output includes the SQLSTATE error code, source code file name, function name, and line number that generated the error. Ensure an appropriate value is set to 'DEFAULT' or stricter.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags log_error_verbosity=default",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Auditing helps in troubleshooting operational problems and also permits forensic analysis. If log_error_verbosity is not set to the correct value, too many details or too few details may be logged. This flag should be configured with a value of 'DEFAULT' or stricter. This recommendation is applicable to PostgreSQL database instances.",
      "Url": "https://cloud.google.com/sql/docs/postgres/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_error_verbosity_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_error_verbosity_flag/cloudsql_instance_postgres_log_error_verbosity_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_postgres_log_error_verbosity_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "POSTGRES" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"PostgreSQL Instance {instance.name} has 'log_error_verbosity' flag set to 'default'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "log_error_verbosity"
                        and flag.get("value", "default") != "default"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"PostgreSQL Instance {instance.name} does not have 'log_error_verbosity' flag set to 'default'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
