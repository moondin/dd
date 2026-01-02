---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 357
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 357 of 867)

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

---[FILE: cloudsql_instance_sqlserver_user_connections_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_user_connections_flag/cloudsql_instance_sqlserver_user_connections_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_sqlserver_user_connections_flag",
  "CheckTitle": "Ensure 'user Connections' Database Flag for Cloud Sql Sql Server Instance Is Set to a Non-limiting Value",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure 'user Connections' Database Flag for Cloud Sql Sql Server Instance Is Set to a Non-limiting Value",
  "Risk": "The user connections option specifies the maximum number of simultaneous user connections that are allowed on an instance of SQL Server. The actual number of user connections allowed also depends on the version of SQL Server that you are using, and also the limits of your application or applications and hardware. SQL Server allows a maximum of 32,767 user connections. Because user connections is by default a self- configuring value, with SQL Server adjusting the maximum number of user connections automatically as needed, up to the maximum value allowable. For example, if only 10 users are logged in, 10 user connection objects are allocated. In most cases, you do not have to change the value for this option. The default is 0, which means that the maximum (32,767) user connections are allowed. However if there is a number defined here that limits connections, SQL Server will not allow anymore above this limit. If the connections are at the limit, any new requests will be dropped, potentially causing lost data or outages for those using the database.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch INSTANCE_NAME --database-flags user connections=0",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/configure-user-connection-flag.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to check the user connections for a Cloud SQL SQL Server instance to ensure that it is not artificially limiting connections.",
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

---[FILE: cloudsql_instance_sqlserver_user_connections_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_user_connections_flag/cloudsql_instance_sqlserver_user_connections_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_sqlserver_user_connections_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "SQLSERVER" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"SQL Server Instance {instance.name} has 'user connections' flag set to '0'."

                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "user connections"
                        and flag.get("value", "0") != "0"
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server Instance {instance.name} does not have 'user connections' flag set to '0'."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_sqlserver_user_options_flag.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_user_options_flag/cloudsql_instance_sqlserver_user_options_flag.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_sqlserver_user_options_flag",
  "CheckTitle": "Ensure 'user options' database flag for Cloud SQL SQL Server instance is not configured",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure 'user options' database flag for Cloud SQL SQL Server instance is not configured",
  "Risk": "The user options option specifies global defaults for all users. A list of default query processing options is established for the duration of a user's work session. The user options option allows you to change the default values of the SET options (if the server's default settings are not appropriate). A user can override these defaults by using the SET statement. You can configure user options dynamically for new logins. After you change the setting of user options, new login sessions use the new setting, current login sessions are not affected.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/user-options-flag-not-configured.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended that, user options database flag for Cloud SQL SQL Server instance should not be configured.",
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

---[FILE: cloudsql_instance_sqlserver_user_options_flag.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_sqlserver_user_options_flag/cloudsql_instance_sqlserver_user_options_flag.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_sqlserver_user_options_flag(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            if "SQLSERVER" in instance.version:
                report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
                report.status = "PASS"
                report.status_extended = f"SQL Server Instance {instance.name} does not have 'user options' flag set."
                for flag in instance.flags:
                    if (
                        flag.get("name", "") == "user options"
                        and flag.get("value", "") != ""
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"SQL Server Instance {instance.name} has 'user options' flag set."
                        break
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudsql_instance_ssl_connections.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_ssl_connections/cloudsql_instance_ssl_connections.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudsql_instance_ssl_connections",
  "CheckTitle": "Ensure That the Cloud SQL Database Instance Requires All Incoming Connections To Use SSL",
  "CheckType": [],
  "ServiceName": "cloudsql",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DatabaseInstance",
  "Description": "Ensure That the Cloud SQL Database Instance Requires All Incoming Connections To Use SSL",
  "Risk": "SQL database connections if successfully trapped (MITM), can reveal sensitive data like credentials, database queries, query outputs etc. For security, it is recommended to always use SSL encryption when connecting to your instance. This recommendation is applicable for Postgresql, MySql generation 1, MySql generation 2 and SQL Server 2017 instances.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud sql instances patch <INSTANCE_NAME> --require-ssl",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudSQL/enable-ssl-for-incoming-connections.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to enforce all incoming connections to SQL database instance to use SSL.",
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

---[FILE: cloudsql_instance_ssl_connections.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudsql/cloudsql_instance_ssl_connections/cloudsql_instance_ssl_connections.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudsql.cloudsql_client import cloudsql_client


class cloudsql_instance_ssl_connections(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in cloudsql_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"Database Instance {instance.name} requires SSL connections."
            )

            if (instance.ssl_mode == "ALLOW_UNENCRYPTED_AND_ENCRYPTED") or (
                instance.ssl_mode == "SSL_MODE_UNSPECIFIED" and not instance.require_ssl
            ):
                report.status = "FAIL"
                report.status_extended = f"Database Instance {instance.name} does not require SSL connections."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_client.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.cloudstorage.cloudstorage_service import (
    CloudStorage,
)

cloudstorage_client = CloudStorage(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_service.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_service.py
Signals: Pydantic

```python
from typing import Optional

from googleapiclient.errors import HttpError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class CloudStorage(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__("storage", provider)
        self.buckets = []
        self.vpc_service_controls_protected_projects = set()
        self._get_buckets()

    def _get_buckets(self):
        for project_id in self.project_ids:
            try:
                request = self.client.buckets().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                    for bucket in response.get("items", []):
                        bucket_iam = (
                            self.client.buckets()
                            .getIamPolicy(bucket=bucket["id"])
                            .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)["bindings"]
                        )
                        public = False
                        if "allAuthenticatedUsers" in str(
                            bucket_iam
                        ) or "allUsers" in str(bucket_iam):
                            public = True

                        lifecycle_rules = None
                        lifecycle = bucket.get("lifecycle")
                        if isinstance(lifecycle, dict):
                            rules = lifecycle.get("rule")
                            if isinstance(rules, list):
                                lifecycle_rules = rules

                        versioning_enabled = bucket.get("versioning", {}).get(
                            "enabled", False
                        )

                        soft_delete_enabled = False
                        soft_delete_policy = bucket.get("softDeletePolicy")
                        if isinstance(soft_delete_policy, dict):
                            retention = soft_delete_policy.get(
                                "retentionDurationSeconds"
                            )
                            if retention and int(retention) > 0:
                                soft_delete_enabled = True

                        logging_info = bucket.get("logging", {})
                        logging_bucket = logging_info.get("logBucket")
                        logging_prefix = logging_info.get("logObjectPrefix")

                        retention_policy_raw = bucket.get("retentionPolicy")
                        retention_policy = None
                        if isinstance(retention_policy_raw, dict):
                            rp_seconds = retention_policy_raw.get("retentionPeriod")
                            if rp_seconds:
                                retention_policy = RetentionPolicy(
                                    retention_period=int(rp_seconds),
                                    is_locked=bool(
                                        retention_policy_raw.get("isLocked", False)
                                    ),
                                    effective_time=retention_policy_raw.get(
                                        "effectiveTime"
                                    ),
                                )

                        self.buckets.append(
                            Bucket(
                                name=bucket["name"],
                                id=bucket["id"],
                                region=bucket["location"].lower(),
                                uniform_bucket_level_access=bucket["iamConfiguration"][
                                    "uniformBucketLevelAccess"
                                ]["enabled"],
                                public=public,
                                retention_policy=retention_policy,
                                project_id=project_id,
                                lifecycle_rules=lifecycle_rules,
                                versioning_enabled=versioning_enabled,
                                soft_delete_enabled=soft_delete_enabled,
                                logging_bucket=logging_bucket,
                                logging_prefix=logging_prefix,
                            )
                        )

                    request = self.client.buckets().list_next(
                        previous_request=request, previous_response=response
                    )
            except HttpError as http_error:
                # Check if the error is due to VPC Service Controls blocking the API
                if "vpcServiceControlsUniqueIdentifier" in str(http_error):
                    self.vpc_service_controls_protected_projects.add(project_id)
                    logger.warning(
                        f"Project {project_id} is protected by VPC Service Controls for Cloud Storage API."
                    )
                else:
                    logger.error(
                        f"{http_error.__class__.__name__}[{http_error.__traceback__.tb_lineno}]: {http_error}"
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class RetentionPolicy(BaseModel):
    retention_period: int
    is_locked: bool
    effective_time: Optional[str] = None


class Bucket(BaseModel):
    name: str
    id: str
    region: str
    uniform_bucket_level_access: bool
    public: bool
    project_id: str
    retention_policy: Optional[RetentionPolicy] = None
    lifecycle_rules: Optional[list[dict]] = None
    versioning_enabled: Optional[bool] = False
    soft_delete_enabled: Optional[bool] = False
    logging_bucket: Optional[str] = None
    logging_prefix: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_audit_logs_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_audit_logs_enabled/cloudstorage_audit_logs_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_audit_logs_enabled",
  "CheckTitle": "Data Access audit logs are enabled for Cloud Storage",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "cloudresourcemanager.googleapis.com/Project",
  "Description": "Data Access audit logs (DATA_READ and DATA_WRITE) are enabled for Cloud Storage at the project level. Unlike Admin Activity logs (enabled by default), Data Access logs must be explicitly configured to track read and write operations on Cloud Storage objects.",
  "Risk": "Without Data Access audit logs, you cannot track who accessed or modified objects in your Cloud Storage buckets, making it difficult to detect unauthorized access, data exfiltration, or compliance violations.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/enable-data-access-audit-logs.html",
    "https://cloud.google.com/storage/docs/audit-logging"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1) Console → IAM & Admin → Audit Logs\n2) Find 'Google Cloud Storage' in the list of services\n3) Check the boxes for 'Data Read' and 'Data Write'\n4) Click 'Save' to apply the configuration\n\nNote: This is a project-level setting that applies to all Cloud Storage buckets in the project.",
      "Terraform": "```hcl\nresource \"google_project_iam_audit_config\" \"storage_audit\" {\n  project = var.project_id\n  service = \"storage.googleapis.com\"\n\n  audit_log_config {\n    log_type = \"DATA_READ\"\n  }\n\n  audit_log_config {\n    log_type = \"DATA_WRITE\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable Data Access audit logs (DATA_READ and DATA_WRITE) for Cloud Storage at the project level to track all read and write operations on storage objects for security monitoring and compliance.",
      "Url": "https://hub.prowler.com/check/cloudstorage_audit_logs_enabled"
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

---[FILE: cloudstorage_audit_logs_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_audit_logs_enabled/cloudstorage_audit_logs_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)


class cloudstorage_audit_logs_enabled(Check):
    """
    Ensure GCP Cloud Storage data access audit logs are enabled.

    - PASS: Project has audit config for storage.googleapis.com or allServices with
      DATA_READ and DATA_WRITE log types enabled.
    - FAIL: Project is missing audit config for Cloud Storage,
      or missing DATA_READ or DATA_WRITE log types.
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []

        for project in cloudresourcemanager_client.cloud_resource_manager_projects:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=cloudresourcemanager_client.projects[project.id],
                project_id=project.id,
                location=cloudresourcemanager_client.region,
                resource_name=(
                    cloudresourcemanager_client.projects[project.id].name
                    if cloudresourcemanager_client.projects[project.id].name
                    else "GCP Project"
                ),
            )

            log_types_set = set()
            for config in project.audit_configs:
                if config.service in ["storage.googleapis.com", "allServices"]:
                    log_types_set.update(config.log_types)

            required_logs = {"DATA_READ", "DATA_WRITE"}

            if project.audit_logging:
                if required_logs.issubset(log_types_set):
                    report.status = "PASS"
                    report.status_extended = f"Project {project.id} has Data Access audit logs (DATA_READ and DATA_WRITE) enabled for Cloud Storage."
                else:
                    report.status = "FAIL"
                    if not log_types_set:
                        report.status_extended = f"Project {project.id} has Audit Logs enabled for other services but not for Cloud Storage."
                    else:
                        report.status_extended = (
                            f"Project {project.id} has Audit Logs enabled for Cloud Storage but is missing some required log types"
                            f"(missing: {', '.join(sorted(required_logs - log_types_set))})."
                        )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Project {project.id} does not have Audit Logs enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_lifecycle_management_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_lifecycle_management_enabled/cloudstorage_bucket_lifecycle_management_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_bucket_lifecycle_management_enabled",
  "CheckTitle": "Cloud Storage buckets have lifecycle management enabled",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "storage.googleapis.com/Bucket",
  "Description": "**Google Cloud Storage buckets** are evaluated for the presence of **lifecycle management** with at least one valid rule (supported action and non-empty condition) to automatically transition or delete objects and optimize storage costs.",
  "Risk": "Buckets without lifecycle rules can accumulate stale data, increase storage costs, and fail to meet data retention and internal compliance requirements.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/enable-lifecycle-management.html",
    "https://cloud.google.com/storage/docs/lifecycle"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gcloud storage buckets update gs://<BUCKET_NAME> --lifecycle-file=<PATH_TO_JSON>",
      "NativeIaC": "",
      "Other": "1) Open Google Cloud Console → Storage → Buckets → <BUCKET_NAME>\n2) Tab 'Lifecycle'\n3) Add rule(s) to delete or transition objects (e.g., delete after 365 days; transition STANDARD→NEARLINE after 90 days)\n4) Save",
      "Terraform": "```hcl\n# Example: enable lifecycle to transition and delete objects\nresource \"google_storage_bucket\" \"example\" {\n  name     = var.bucket_name\n  location = var.location\n\n  # Transition STANDARD → NEARLINE after 90 days\n  lifecycle_rule {\n    action {\n      type          = \"SetStorageClass\"\n      storage_class = \"NEARLINE\"\n    }\n    condition {\n      age                   = 90\n      matches_storage_class = [\"STANDARD\"]\n    }\n  }\n\n  # Delete objects after 365 days\n  lifecycle_rule {\n    action {\n      type = \"Delete\"\n    }\n    condition {\n      age = 365\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Configure lifecycle rules to automatically delete stale objects or transition them to colder storage classes according to your organization's retention and cost-optimization policy.",
      "Url": "https://hub.prowler.com/check/cloudstorage_bucket_lifecycle_management_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_lifecycle_management_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_lifecycle_management_enabled/cloudstorage_bucket_lifecycle_management_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)


class cloudstorage_bucket_lifecycle_management_enabled(Check):
    """Ensure Cloud Storage buckets have lifecycle management enabled with at least one valid rule.

    Reports PASS if a bucket has at least one valid lifecycle rule
    (with a supported action and condition), otherwise FAIL.

    """

    def execute(self) -> list[Check_Report_GCP]:
        """Run the lifecycle management check for each Cloud Storage bucket.

        Returns:
            list[Check_Report_GCP]: Results for all evaluated buckets.
        """

        findings = []
        for bucket in cloudstorage_client.buckets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=bucket)
            report.status = "FAIL"
            report.status_extended = (
                f"Bucket {bucket.name} does not have lifecycle management enabled."
            )

            rules = bucket.lifecycle_rules

            if rules:
                valid_rules = []
                for rule in rules:
                    action_type = rule.get("action", {}).get("type")
                    condition = rule.get("condition")
                    if action_type and condition:
                        valid_rules.append(rule)

                if valid_rules:
                    report.status = "PASS"
                    report.status_extended = f"Bucket {bucket.name} has lifecycle management enabled with {len(valid_rules)} valid rule(s)."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Bucket {bucket.name} has lifecycle rules configured but none are valid."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_logging_enabled/cloudstorage_bucket_logging_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_bucket_logging_enabled",
  "CheckTitle": "Cloud Storage buckets have Usage and Storage Logs enabled",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "storage.googleapis.com/Bucket",
  "Description": "**Google Cloud Storage buckets** are evaluated to ensure that **Usage and Storage Logs** are enabled. Enabling these logs provides detailed visibility into access requests, usage patterns, and storage activity within each bucket.",
  "Risk": "Buckets without Usage and Storage Logs enabled lack visibility into access and storage activity, which increases the risk of undetected data exfiltration, misuse, or configuration errors.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/enable-usage-and-storage-logs.html",
    "https://cloud.google.com/storage/docs/access-logs"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gsutil logging set on -b gs://<LOGGING_BUCKET> -o <LOG_OBJECT_PREFIX> gs://<BUCKET_NAME>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "```hcl\n# Example: enable Usage and Storage Logs on a Cloud Storage bucket\nresource \"google_storage_bucket\" \"example\" {\n  name     = var.bucket_name\n  location = var.location\n\n  logging {\n    log_bucket        = var.log_bucket_name\n    log_object_prefix = \"${var.bucket_name}/\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable Usage and Storage Logs for all Cloud Storage buckets to track access, detect anomalies, and maintain audit visibility of data operations.",
      "Url": "https://hub.prowler.com/check/cloudstorage_bucket_logging_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Buckets missing the 'logging.logBucket' configuration are treated as having Usage and Storage Logs disabled. The 'logObjectPrefix' field is optional and defaults to the bucket name."
}
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_logging_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_logging_enabled/cloudstorage_bucket_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)


class cloudstorage_bucket_logging_enabled(Check):
    """
    Ensure Cloud Storage buckets have Usage and Storage Logs enabled.

    Reports PASS if a bucket has logging configured (logBucket defined),
    otherwise FAIL.
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []

        for bucket in cloudstorage_client.buckets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=bucket)
            report.status = "FAIL"
            report.status_extended = (
                f"Bucket {bucket.name} does not have Usage and Storage Logs enabled."
            )

            if bucket.logging_bucket:
                report.status = "PASS"
                if bucket.logging_prefix:
                    report.status_extended = (
                        f"Bucket {bucket.name} has Usage and Storage Logs enabled. "
                        f"Logs are stored in bucket '{bucket.logging_bucket}' with prefix '{bucket.logging_prefix}'."
                    )
                else:
                    report.status_extended = (
                        f"Bucket {bucket.name} has Usage and Storage Logs enabled. "
                        f"Logs are stored in bucket '{bucket.logging_bucket}' with default prefix."
                    )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_log_retention_policy_lock.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_log_retention_policy_lock/cloudstorage_bucket_log_retention_policy_lock.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_bucket_log_retention_policy_lock",
  "CheckTitle": "Cloud Storage log bucket has a Retention Policy with Bucket Lock enabled",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "storage.googleapis.com/Bucket",
  "Description": "**Google Cloud Storage buckets** used as **log sinks** are evaluated to ensure that a **Retention Policy** is configured and **Bucket Lock** is enabled. Enabling Bucket Lock permanently prevents the retention policy from being reduced or removed, protecting logs from modification or deletion.",
  "Risk": "Log sink buckets without a locked retention policy are at risk of log tampering or accidental deletion. Without Bucket Lock, an attacker or user could remove or shorten the retention policy, compromising the integrity of audit logs required for forensics and compliance investigations.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/retention-policies-with-bucket-lock.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gcloud storage buckets lock-retention-policy gs://<LOG_BUCKET_NAME>",
      "NativeIaC": "",
      "Other": "1) Open Google Cloud Console → Storage → Buckets → <LOG_BUCKET_NAME>\n2) Go to the **Configuration** tab\n3) Under **Retention policy**, ensure a retention duration is set\n4) Click **Lock** to enable Bucket Lock and confirm the operation",
      "Terraform": "```hcl\nresource \"google_storage_bucket\" \"log_bucket\" {\n  name     = var.log_bucket_name\n  location = var.location\n\n  retention_policy {\n    retention_period = 31536000 # 365 days in seconds\n    is_locked        = true\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Configure a retention policy and enable Bucket Lock on all Cloud Storage buckets used as log sinks to ensure log integrity and immutability.",
      "Url": "https://hub.prowler.com/check/cloudstorage_bucket_log_retention_policy_lock"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_log_retention_policy_lock.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_log_retention_policy_lock/cloudstorage_bucket_log_retention_policy_lock.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)
from prowler.providers.gcp.services.logging.logging_client import logging_client


class cloudstorage_bucket_log_retention_policy_lock(Check):
    """
    Ensure Log Sink buckets have a Retention Policy with Bucket Lock enabled.

    - PASS: Log sink bucket has a retention policy and is locked.
    - FAIL: Log sink bucket has no retention policy, or it has one but is not locked.
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []
        # Get Log Sink Buckets
        log_buckets = []
        for sink in logging_client.sinks:
            if "storage.googleapis.com" in sink.destination:
                log_buckets.append(sink.destination.split("/")[-1])
        for bucket in cloudstorage_client.buckets:
            if bucket.name in log_buckets:
                report = Check_Report_GCP(metadata=self.metadata(), resource=bucket)
                report.status = "FAIL"
                report.status_extended = (
                    f"Log Sink Bucket {bucket.name} has no Retention Policy."
                )
                if bucket.retention_policy:
                    report.status = "FAIL"
                    report.status_extended = f"Log Sink Bucket {bucket.name} has a Retention Policy but without Bucket Lock."
                    if bucket.retention_policy.is_locked:
                        report.status = "PASS"
                        report.status_extended = f"Log Sink Bucket {bucket.name} has a Retention Policy with Bucket Lock."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_public_access.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_public_access/cloudstorage_bucket_public_access.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_bucket_public_access",
  "CheckTitle": "Ensure That Cloud Storage Bucket Is Not Anonymously or Publicly Accessible",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Bucket",
  "Description": "Ensure That Cloud Storage Bucket Is Not Anonymously or Publicly Accessible",
  "Risk": "Allowing anonymous or public access grants permissions to anyone to access bucket content. Such access might not be desired if you are storing any sensitive data. Hence, ensure that anonymous or public access to a bucket is not allowed.",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/publicly-accessible-storage-buckets.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/google-cloud-public-policies/bc_gcp_public_1",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-public-policies/bc_gcp_public_1#terraform"
    },
    "Recommendation": {
      "Text": "It is recommended that IAM policy on Cloud Storage bucket does not allows anonymous or public access.",
      "Url": "https://cloud.google.com/storage/docs/access-control/iam-reference"
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

---[FILE: cloudstorage_bucket_public_access.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_public_access/cloudstorage_bucket_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)


class cloudstorage_bucket_public_access(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for bucket in cloudstorage_client.buckets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=bucket)
            report.status = "PASS"
            report.status_extended = f"Bucket {bucket.name} is not publicly accessible."
            if bucket.public:
                report.status = "FAIL"
                report.status_extended = f"Bucket {bucket.name} is publicly accessible."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
