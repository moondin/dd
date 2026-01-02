---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 356
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 356 of 867)

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

---[FILE: cloudsql_instance_postgres_log_min_duration_statement_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_min_duration_statement_flag/cloudsql_instance_postgres_log_min_duration_statement_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_postgres_log_min_duration_statement_flag",
  "CheckTitle": "Ensure that the Log_min_duration_statement Flag for a Cloud SQL PostgreSQL Instance Is Set to -1",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure that the Log_min_duration_statement Flag for a Cloud SQL PostgreSQL Instance Is Set to -1",
  "Risk": "The log_min_duration_statement flag defines the minimum amount of execution time of a statement in milliseconds where the total duration of the statement is logged. Ensure that log_min_duration_statement is disabled, i.e., a value of -1 is set.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags log_min_duration_statement=-1",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/configure-log-min-error-statement-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Logging SQL statements may include sensitive information that should not be recorded in logs. This recommendation is applicable to PostgreSQL database instances.",
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

---[FILE: cloudsql_instance_postgres_log_min_duration_statement_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_min_duration_statement_flag/cloudsql_instance_postgres_log_min_duration_statement_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_postgres_log_min_duration_statement_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "POSTGRES" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"PostgreSQL Instance {instance.name} has 'log_min_duration_statement' flag set to '-1'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "log_min_duration_statement"
                        and flag.get("value", "-1") != "-1"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"PostgreSQL Instance {instance.name} does not have 'log_min_duration_statement' flag set to '-1'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_min_error_statement_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_min_error_statement_flag/cloudsql_instance_postgres_log_min_error_statement_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_postgres_log_min_error_statement_flag",
  "CheckTitle": "Ensure that the Log_min_error_statement Flag for a Cloud SQL PostgreSQL Instance Is Set Appropriately",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure that the Log_min_error_statement Flag for a Cloud SQL PostgreSQL Instance Is Set Appropriately",
  "Risk": "The log_min_error_statement flag defines the minimum message severity level that are considered as an error statement. Messages for error statements are logged with the SQL statement. Valid values include DEBUG5, DEBUG4, DEBUG3, DEBUG2, DEBUG1, INFO, NOTICE, WARNING, ERROR, LOG, FATAL, and PANIC. Each severity level includes the subsequent levels mentioned above. Ensure a value of ERROR or stricter is set.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags log_min_error_statement=error",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/configure-log-min-error-statement-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Auditing helps in troubleshooting operational problems and also permits forensic analysis. If log_min_error_statement is not set to the correct value, messages may not be classified as error messages appropriately. Considering general log messages as error messages would make is difficult to find actual errors and considering only stricter severity levels as error messages may skip actual errors to log their SQL statements. The log_min_error_statement flag should be set to ERROR or stricter.",
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

---[FILE: cloudsql_instance_postgres_log_min_error_statement_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_min_error_statement_flag/cloudsql_instance_postgres_log_min_error_statement_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_postgres_log_min_error_statement_flag(Check):
    def execute(self) -> Check_Report_GCP:
        desired_log_min_error_statement = "error"
        findings = []
        for instance in cloudsql_client.instances:
            if "POSTGRES" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"PostgreSQL Instance {instance.name} has 'log_min_error_statement' flag set minimum to '{desired_log_min_error_statement}'."

                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "log_min_error_statement"
                        and flag.get("value", "error")
                        != desired_log_min_error_statement
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"PostgreSQL Instance {instance.name} does not have 'log_min_error_statement' flag set minimum to '{desired_log_min_error_statement}'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_min_messages_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_min_messages_flag/cloudsql_instance_postgres_log_min_messages_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_postgres_log_min_messages_flag",
  "CheckTitle": "Ensure that the Log_min_messages Flag for a Cloud SQL PostgreSQL Instance Is Set Appropriately",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure that the Log_min_messages Flag for a Cloud SQL PostgreSQL Instance Is Set Appropriately",
  "Risk": "Auditing helps in troubleshooting operational problems and also permits forensic analysis. If log_min_messages is not set to the correct value, messages may not be classified as error messages appropriately. An organization will need to decide their own threshold for logging log_min_messages flag.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags log_min_messages=warning",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/gcp/cloud-sql-policies/bc_gcp_sql_4#terraform"
    },
    "Recommendation": {
      "Text": "The log_min_messages flag defines the minimum message severity level that is considered as an error statement. Messages for error statements are logged with the SQL statement. Valid values include DEBUG5, DEBUG4, DEBUG3, DEBUG2, DEBUG1, INFO, NOTICE, WARNING, ERROR, LOG, FATAL, and PANIC. Each severity level includes the subsequent levels mentioned above. ERROR is considered the best practice setting. Changes should only be made in accordance with the organization's logging policy.",
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

---[FILE: cloudsql_instance_postgres_log_min_messages_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_min_messages_flag/cloudsql_instance_postgres_log_min_messages_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_postgres_log_min_messages_flag(Check):
    def execute(self) -> Check_Report_GCP:
        failing_log_levels = [
            "DEBUG5",
            "DEBUG4",
            "DEBUG3",
            "DEBUG2",
            "DEBUG1",
            "INFO",
            "NOTICE",
        ]

        findings = []
        for instance in cloudsql_client.instances:
            if "POSTGRES" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"PostgreSQL Instance {instance.name} does not have 'log_min_messages' flag set."

                for flag in instance.flags:
                    if flag.get("name", "") == "log_min_messages":
                        current_level = flag.get("value", "").upper()
                        if current_level in failing_log_levels:
                            report.status = "FAIL"
                            report.status_extended = f"PostgreSQL Instance {instance.name} has 'log_min_messages' flag set to '{current_level}', which is below the recommended minimum of 'ERROR'."
                        else:
                            report.status = "PASS"
                            report.status_extended = f"PostgreSQL Instance {instance.name} has 'log_min_messages' flag set to an acceptable severity level: '{current_level}'."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_postgres_log_statement_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_statement_flag/cloudsql_instance_postgres_log_statement_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_postgres_log_statement_flag",
  "CheckTitle": "Ensure That the Log_statement Database Flag for Cloud SQL PostgreSQL Instance Is Set Appropriately",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure That the Log_statement Database Flag for Cloud SQL PostgreSQL Instance Is Set Appropriately",
  "Risk": "Auditing helps in forensic analysis. If log_statement is not set to the correct value, too many statements may be logged leading to issues in finding the relevant information from the logs, or too few statements may be logged with relevant information missing from the logs.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags log_statement=ddl",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "The value ddl logs all data definition statements. A value of 'ddl' is recommended unless otherwise directed by your organization's logging policy.",
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

---[FILE: cloudsql_instance_postgres_log_statement_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_postgres_log_statement_flag/cloudsql_instance_postgres_log_statement_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_postgres_log_statement_flag(Check):
    def execute(self) -> Check_Report_GCP:
        desired_log_statement = "ddl"
        findings = []
        for instance in cloudsql_client.instances:
            if "POSTGRES" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"PostgreSQL Instance {instance.name} does not have 'log_statement' flag set to '{desired_log_statement}'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "log_statement"
                        and flag.get("value", "none") == desired_log_statement
                    ):
                        report.status = "PASS"
                        report.status_extended = f"PostgreSQL Instance {instance.name} has 'log_statement' flag set to '{desired_log_statement}'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_private_ip_assignment.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_private_ip_assignment/cloudsql_instance_private_ip_assignment.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_private_ip_assignment",
  "CheckTitle": "Ensure Instance IP assignment is set to private",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure Instance IP assignment is set to private",
  "Risk": "Instance addresses can be public IP or private IP. Public IP means that the instance is accessible through the public internet. In contrast, instances using only private IP are not accessible through the public internet, but are accessible through a Virtual Private Cloud (VPC). Limiting network access to your database will limit potential attacks.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Setting databases access only to private will reduce attack surface.",
      "Url": "https://cloud.google.com/sql/docs/mysql/configure-private-ip"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_private_ip_assignment.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_private_ip_assignment/cloudsql_instance_private_ip_assignment.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_private_ip_assignment(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Database Instance {instance.name} does not have private IP assignments."
            for address in instance.ip_addresses:
                if address["type"] != "PRIVATE":
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Database Instance {instance.name} has public IP assignments."
                    )
                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_public_access.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_public_access/cloudsql_instance_public_access.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_public_access",
  "CheckTitle": "Ensure That Cloud SQL Database Instances Do Not Implicitly Whitelist All Public IP Addresses ",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure That Cloud SQL Database Instances Do Not Implicitly Whitelist All Public IP Addresses ",
  "Risk": "To minimize attack surface on a Database server instance, only trusted/known and required IP(s) should be white-listed to connect to it. An authorized network should not have IPs/networks configured to 0.0.0.0/0 which will allow access to the instance from anywhere in the world. Note that authorized networks apply only to instances with public IPs.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch <INSTANCE_NAME> --authorized-networks=IP_ADDR1,IP_ADDR2...",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/publicly-accessible-cloud-sql-instances.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Database Server should accept connections only from trusted Network(s)/IP(s) and restrict access from public IP addresses.",
      "Url": "https://cloud.google.com/sql/docs/mysql/connection-org-policy"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_public_access.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_public_access/cloudsql_instance_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_public_access(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"Database Instance {instance.name} does not whitelist all Public IP Addresses."
            for network in instance.authorized_networks:
                if network["value"] == "0.0.0.0/0":
                    report.status = "FAIL"
                    report.status_extended = f"Database Instance {instance.name} whitelist all Public IP Addresses."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_public_ip/cloudsql_instance_public_ip.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_public_ip",
  "CheckTitle": "Check for Cloud SQL Database Instances with Public IPs",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Check for Cloud SQL Database Instances with Public IPs",
  "Risk": "To lower the organization's attack surface, Cloud SQL databases should not have public IPs. Private IPs provide improved network security and lower latency for your application.",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/sql-database-instances-with-public-ips.html",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch <MYSQL_INSTANCE> --project <PROJECT_ID> --network=<NETWORK_ID> --no-assign-ip",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/cloud-sql-policies/bc_gcp_sql_11",
      "Terraform": "https://docs.prowler.com/checks/gcp/cloud-sql-policies/bc_gcp_sql_11#terraform"
    },
    "Recommendation": {
      "Text": "To lower the organization's attack surface, Cloud SQL databases should not have public IPs. Private IPs provide improved network security and lower latency for your application.",
      "Url": "https://cloud.google.com/sql/docs/mysql/configure-private-ip"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_public_ip.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_public_ip/cloudsql_instance_public_ip.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_public_ip(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"Database Instance {instance.name} does not have a public IP."
            )
            if instance.public_ip:
                report.status = "FAIL"
                report.status_extended = (
                    f"Database Instance {instance.name} has a public IP."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_contained_database_authentication_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_contained_database_authentication_flag/cloudsql_instance_sqlserver_contained_database_authentication_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_sqlserver_contained_database_authentication_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "SQLSERVER" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"SQL Server Instance {instance.name} has 'contained database authentication' flag set to 'off'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "contained database authentication"
                        and flag.get("value", "off") == "on"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server Instance {instance.name} has 'contained database authentication' flag set to 'on'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag/cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag",
  "CheckTitle": "Ensure that the 'cross db ownership chaining' database flag for Cloud SQL SQL Server instance is set to 'off'",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure that the 'cross db ownership chaining' database flag for Cloud SQL SQL Server instance is set to 'off'",
  "Risk": "Use the cross db ownership for chaining option to configure cross-database ownership chaining for an instance of Microsoft SQL Server. This server option allows you to control cross-database ownership chaining at the database level or to allow cross- database ownership chaining for all databases. Enabling cross db ownership is not recommended unless all of the databases hosted by the instance of SQL Server must participate in cross-database ownership chaining and you are aware of the security implications of this setting.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags cross db ownership=off",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/disable-cross-db-ownership-chaining-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to set cross db ownership chaining database flag for Cloud SQL SQL Server instance to off.",
      "Url": "https://cloud.google.com/sql/docs/sqlserver/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag/cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_sqlserver_cross_db_ownership_chaining_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "SQLSERVER" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"SQL Server Instance {instance.name} has 'cross db ownership chaining' flag set to 'off'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "cross db ownership chaining"
                        and flag.get("value", "off") == "on"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server Instance {instance.name} does not have 'cross db ownership chaining' flag set to 'off'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_external_scripts_enabled_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_external_scripts_enabled_flag/cloudsql_instance_sqlserver_external_scripts_enabled_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_sqlserver_external_scripts_enabled_flag",
  "CheckTitle": "Ensure 'external scripts enabled' database flag for Cloud SQL SQL Server instance is set to 'off'",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure 'external scripts enabled' database flag for Cloud SQL SQL Server instance is set to 'off'",
  "Risk": "external scripts enabled enable the execution of scripts with certain remote language extensions. This property is OFF by default. When Advanced Analytics Services is installed, setup can optionally set this property to true. As the External Scripts Enabled feature allows scripts external to SQL such as files located in an R library to be executed, which could adversely affect the security of the system, hence this should be disabled.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags external scripts enabled=off",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/disable-external-scripts-enabled-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to set external scripts enabled database flag for Cloud SQL SQL Server instance to off",
      "Url": "https://cloud.google.com/sql/docs/sqlserver/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_external_scripts_enabled_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_external_scripts_enabled_flag/cloudsql_instance_sqlserver_external_scripts_enabled_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_sqlserver_external_scripts_enabled_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "SQLSERVER" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"SQL Server Instance {instance.name} has 'external scripts enabled' flag set to 'off'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "external scripts enabled"
                        and flag.get("value", "off") == "on"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server Instance {instance.name} does not have 'external scripts enabled' flag set to 'off'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_remote_access_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_remote_access_flag/cloudsql_instance_sqlserver_remote_access_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_sqlserver_remote_access_flag",
  "CheckTitle": "Ensure 'remote access' database flag for Cloud SQL SQL Server instance is set to 'off'",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure 'remote access' database flag for Cloud SQL SQL Server instance is set to 'off'",
  "Risk": "The remote access option controls the execution of stored procedures from local or remote servers on which instances of SQL Server are running. This default value for this option is 1. This grants permission to run local stored procedures from remote servers or remote stored procedures from the local server. To prevent local stored procedures from being run from a remote server or remote stored procedures from being run on the local server, this must be disabled. The Remote Access option controls the execution of local stored procedures on remote servers or remote stored procedures on local server. 'Remote access' functionality can be abused to launch a Denial-of- Service (DoS) attack on remote servers by off-loading query processing to a target, hence this should be disabled. This recommendation is applicable to SQL Server database instances.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/disable-remote-access-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to set remote access database flag for Cloud SQL SQL Server instance to off.",
      "Url": "https://cloud.google.com/sql/docs/sqlserver/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_remote_access_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_remote_access_flag/cloudsql_instance_sqlserver_remote_access_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_sqlserver_remote_access_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "SQLSERVER" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"SQL Server Instance {instance.name} has 'remote access' flag set to 'on'."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "remote access"
                        and flag.get("value", "on") != "on"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"SQL Server Instance {instance.name} does not have 'remote access' flag set to 'on'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_trace_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_trace_flag/cloudsql_instance_sqlserver_trace_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_sqlserver_trace_flag",
  "CheckTitle": "Ensure '3625 (trace flag)' database flag for all Cloud SQL Server instances is set to 'on' ",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure '3625 (trace flag)' database flag for all Cloud SQL Server instances is set to 'on' ",
  "Risk": "Microsoft SQL Trace Flags are frequently used to diagnose performance issues or to debug stored procedures or complex computer systems, but they may also be recommended by Microsoft Support to address behavior that is negatively impacting a specific workload. All documented trace flags and those recommended by Microsoft Support are fully supported in a production environment when used as directed. 3625(trace log) Limits the amount of information returned to users who are not members of the sysadmin fixed server role, by masking the parameters of some error messages using '******'. Setting this in a Google Cloud flag for the instance allows for security through obscurity and prevents the disclosure of sensitive information, hence this is recommended to set this flag globally to on to prevent the flag having been left off, or changed by bad actors. This recommendation is applicable to SQL Server database instances.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch <INSTANCE_NAME> --database-flags 3625=on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/disable-3625-trace-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to set 3625 (trace flag) database flag for Cloud SQL SQL Server instance to on.",
      "Url": "https://cloud.google.com/sql/docs/sqlserver/flags"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_trace_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_trace_flag/cloudsql_instance_sqlserver_trace_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_sqlserver_trace_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "SQLSERVER" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "FAIL"
                report.status_extended = f"SQL Server Instance {instance.name} has '3625 (trace flag)' flag set to 'off'."

                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "3625"
                        and flag.get("value", "off") == "on"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"SQL Server Instance {instance.name} has '3625 (trace flag)' flag set to 'on'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
