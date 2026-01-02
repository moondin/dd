---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 309
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 309 of 867)

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

---[FILE: rds_cluster_critical_event_subscription.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_critical_event_subscription/rds_cluster_critical_event_subscription.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_critical_event_subscription(Check):
    def execute(self):
        findings = []
        if rds_client.provider.scan_unused_services or rds_client.db_clusters:
            for db_event in rds_client.db_event_subscriptions:
                report = Check_Report_AWS(metadata=self.metadata(), resource=db_event)
                report.status = "FAIL"
                report.status_extended = "RDS cluster event categories of maintenance and failure are not subscribed."
                report.resource_id = rds_client.audited_account
                report.resource_arn = rds_client._get_rds_arn_template(db_event.region)
                if db_event.source_type == "db-cluster" and db_event.enabled:
                    if db_event.event_list == [] or set(db_event.event_list) == {
                        "maintenance",
                        "failure",
                    }:
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=db_event
                        )
                        report.status = "PASS"
                        report.status_extended = "RDS cluster events are subscribed."

                    elif db_event.event_list == ["maintenance"]:
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=db_event
                        )
                        report.status = "FAIL"
                        report.status_extended = (
                            "RDS cluster event category of failure is not subscribed."
                        )

                    elif db_event.event_list == ["failure"]:
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=db_event
                        )
                        report.status = "FAIL"
                        report.status_extended = "RDS cluster event category of maintenance is not subscribed."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_default_admin.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_default_admin/rds_cluster_default_admin.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_default_admin",
  "CheckTitle": "Ensure that your Amazon RDS clusters are not using the default master username.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Ensure that your Amazon RDS clusters are not using the default master username.",
  "Risk": "Since admin is the Amazon's example for the RDS database master username and postgres is the default PostgreSQL master username. Many AWS customers will use this username for their RDS database instances in production. Malicious users can use this information to their advantage and frequently try to use default master username during brute-force attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-24",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-master-username.html#",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-master-username.html#",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-master-username.html#"
    },
    "Recommendation": {
      "Text": "To change the master username configured for your Amazon RDS database clusters you must re-create them and migrate the existing data.",
      "Url": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-24"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_default_admin.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_default_admin/rds_cluster_default_admin.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_default_admin(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=rds_client.db_clusters[db_cluster],
            )
            report.status = "FAIL"
            report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} is using the default master username."
            if rds_client.db_clusters[db_cluster].username not in [
                "admin",
                "postgres",
            ]:
                report.status = "PASS"
                report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} is not using the default master username."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_deletion_protection.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_deletion_protection/rds_cluster_deletion_protection.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_deletion_protection",
  "CheckTitle": "Check if RDS clusters have deletion protection enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "low",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Check if RDS clusters have deletion protection enabled.",
  "Risk": "You can only delete clusters that do not have deletion protection enabled.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_DeleteInstance.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-cluster --db-cluster-identifier <db_cluster_id> --deletion-protection --apply-immediately",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-7",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-rds-clusters-and-instances-have-deletion-protection-enabled#terraform"
    },
    "Recommendation": {
      "Text": "Enable deletion protection using the AWS Management Console for production DB clusters.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_DeleteInstance.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_deletion_protection.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_deletion_protection/rds_cluster_deletion_protection.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_deletion_protection(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=rds_client.db_clusters[db_cluster],
            )
            report.status = "FAIL"
            report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} does not have deletion protection enabled."
            if rds_client.db_clusters[db_cluster].deletion_protection:
                report.status = "PASS"
                report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} has deletion protection enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_iam_authentication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_iam_authentication_enabled/rds_cluster_iam_authentication_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_iam_authentication_enabled",
  "CheckTitle": "Check if RDS clusters have IAM authentication enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Check if RDS clusters have IAM authentication enabled.",
  "Risk": "Ensure that the IAM Database Authentication feature is enabled for your RDS database clusters in order to use the Identity and Access Management (IAM) service to manage database access to your MySQL and PostgreSQL database clusters. With this feature enabled, you don't have to use a password when you connect to your MySQL/PostgreSQL database, instead you can use an authentication token. An authentication token is a unique string of characters with a lifetime of 15 minutes that Amazon RDS generates on your request. IAM Database Authentication removes the need of storing user credentials within the database configuration, because authentication is managed externally using Amazon IAM.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Enabling.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --region <REGION> --db-instance-identifier <DB_CLUSTER_ID> --enable-iam-database-authentication --apply-immediately",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/iam-database-authentication.html#",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-12",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/iam-database-authentication.html#"
    },
    "Recommendation": {
      "Text": "Enable IAM authentication for supported RDS clusters.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Enabling.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_iam_authentication_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_iam_authentication_enabled/rds_cluster_iam_authentication_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_iam_authentication_enabled(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters:
            supported_engines = [
                "postgres",
                "aurora-postgresql",
                "mysql",
                "mariadb",
                "aurora-mysql",
                "aurora",
            ]
            if (
                engine in rds_client.db_clusters[db_cluster].engine
                for engine in supported_engines
            ):
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=rds_client.db_clusters[db_cluster],
                )

                if rds_client.db_clusters[db_cluster].iam_auth:
                    report.status = "PASS"
                    report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} has IAM authentication enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} does not have IAM authentication enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_integration_cloudwatch_logs.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_integration_cloudwatch_logs/rds_cluster_integration_cloudwatch_logs.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_integration_cloudwatch_logs",
  "CheckTitle": "Check if RDS cluster is integrated with CloudWatch Logs.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Check if RDS cluster is integrated with CloudWatch Logs. The types valid are Aurora MySQL, Aurora PostgreSQL, MySQL, PostgreSQL.",
  "Risk": "If logs are not enabled, monitoring of service use and threat analysis is not possible.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_LogAccess.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-cluster --db-cluster-identifier <db_cluster_id> --cloudwatch-logs-export-configuration {'EnableLogTypes':['audit',error','general','slowquery']} --apply-immediately",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-34",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use CloudWatch Logs to perform real-time analysis of the log data. Create alarms and view metrics.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/publishing_cloudwatchlogs.html"
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

---[FILE: rds_cluster_integration_cloudwatch_logs.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_integration_cloudwatch_logs/rds_cluster_integration_cloudwatch_logs.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_integration_cloudwatch_logs(Check):
    def execute(self):
        findings = []
        valid_engines = ["aurora-mysql", "aurora-postgresql", "mysql", "postgres"]
        for db_cluster in rds_client.db_clusters.values():
            if db_cluster.engine in valid_engines:
                report = Check_Report_AWS(metadata=self.metadata(), resource=db_cluster)
                if db_cluster.cloudwatch_logs:
                    report.status = "PASS"
                    report.status_extended = f"RDS Cluster {db_cluster.id} is shipping {', '.join(db_cluster.cloudwatch_logs)} logs to CloudWatch Logs."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Cluster {db_cluster.id} does not have CloudWatch Logs enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_minor_version_upgrade_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_minor_version_upgrade_enabled/rds_cluster_minor_version_upgrade_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_minor_version_upgrade_enabled",
  "CheckTitle": "Ensure RDS clusters have minor version upgrade enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Ensure RDS clusters have minor version upgrade enabled.",
  "Risk": "Auto Minor Version Upgrade is a feature that you can enable to have your database automatically upgraded when a new minor database engine version is available. Minor version upgrades often patch security vulnerabilities and fix bugs and therefore should be applied.",
  "RelatedUrl": "https://aws.amazon.com/blogs/database/best-practices-for-upgrading-amazon-rds-to-major-and-minor-versions-of-postgresql/",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-cluster --db-cluster-identifier <db_cluster_id> --auto-minor-version-upgrade --apply-immediately",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/ensure-aws-db-instance-gets-all-minor-upgrades-automatically#cloudformation",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-35",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-aws-db-instance-gets-all-minor-upgrades-automatically#terraform"
    },
    "Recommendation": {
      "Text": "Enable auto minor version upgrade for all databases and environments.",
      "Url": "https://aws.amazon.com/blogs/database/best-practices-for-upgrading-amazon-rds-to-major-and-minor-versions-of-postgresql/"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_minor_version_upgrade_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_minor_version_upgrade_enabled/rds_cluster_minor_version_upgrade_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_minor_version_upgrade_enabled(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters:
            # Auto minor version upgrade is only available for non-Aurora Multi-AZ DB clusters
            if rds_client.db_clusters[db_cluster].multi_az:
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=rds_client.db_clusters[db_cluster],
                )
                if rds_client.db_clusters[db_cluster].auto_minor_version_upgrade:
                    report.status = "PASS"
                    report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} has minor version upgrade enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} does not have minor version upgrade enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_multi_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_multi_az/rds_cluster_multi_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_multi_az",
  "CheckTitle": "Check if RDS clusters have multi-AZ enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Check if RDS clusters have multi-AZ enabled.",
  "Risk": "In case of failure, with a single-AZ deployment configuration, should an availability zone specific database failure occur, Amazon RDS can not automatically fail over to the standby availability zone.",
  "RelatedUrl": "https://aws.amazon.com/rds/features/multi-az/",
  "Remediation": {
    "Code": {
      "CLI": "aws rds create-db-cluster --db-cluster-identifier <db_cluster_id> --multi-az true",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/general_73#cloudformation",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-15",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/general_73#terraform"
    },
    "Recommendation": {
      "Text": "Enable multi-AZ deployment for production databases.",
      "Url": "https://aws.amazon.com/rds/features/multi-az/"
    }
  },
  "Categories": [
    "redundancy"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_multi_az.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_multi_az/rds_cluster_multi_az.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_multi_az(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"RDS Cluster {db_cluster.id} does not have multi-AZ enabled."
            )
            if db_cluster.multi_az:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Cluster {db_cluster.id} has multi-AZ enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_non_default_port.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_non_default_port/rds_cluster_non_default_port.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_non_default_port",
  "CheckTitle": "Check if RDS clusters are using non-default ports.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:cluster:db-cluster",
  "Severity": "low",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Checks if an cluster uses a port other than the default port of the database engine. The control fails if the RDS cluster uses the default port.",
  "Risk": "Using a default database port exposes the cluster to potential security vulnerabilities, as attackers are more likely to target known, commonly-used ports. This may result in unauthorized access to the database or increased susceptibility to automated attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.Modifying.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-cluster --db-cluster-identifier <db-cluster-id> --port <non-default-port>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-23",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the RDS cluster to use a non-default port, and ensure that the security group permits access to the new port.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.Modifying.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_non_default_port.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_non_default_port/rds_cluster_non_default_port.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_non_default_port(Check):
    def execute(self):
        findings = []
        default_ports = {
            3306: ["mysql", "mariadb", "aurora-mysql"],
            5432: ["postgres", "aurora-postgresql"],
            1521: ["oracle"],
            1433: ["sqlserver"],
            50000: ["db2"],
        }
        for db_cluster in rds_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_cluster)
            report.status = "PASS"
            report.status_extended = (
                f"RDS Cluster {db_cluster.id} is not using the default port "
                f"{db_cluster.port} for {db_cluster.engine}."
            )
            if db_cluster.port in default_ports:
                default_engines = default_ports[db_cluster.port]
                for default_engine in default_engines:
                    if default_engine in db_cluster.engine.lower():
                        report.status = "FAIL"
                        report.status_extended = (
                            f"RDS Cluster {db_cluster.id} is using the default port "
                            f"{db_cluster.port} for {db_cluster.engine}."
                        )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_protected_by_backup_plan.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_protected_by_backup_plan/rds_cluster_protected_by_backup_plan.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_protected_by_backup_plan",
  "CheckTitle": "Check if RDS clusters are protected by a backup plan.",
  "CheckType": [
    "Software and Configuration Checks, AWS Security Best Practices"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS clusters are protected by a backup plan.",
  "Risk": "Without a backup plan, RDS clusters are vulnerable to data loss, accidental deletion, or corruption. This could lead to significant operational disruptions or loss of critical data.",
  "RelatedUrl": "https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html",
  "Remediation": {
    "Code": {
      "CLI": "aws backup create-backup-plan --backup-plan , aws backup tag-resource --resource-arn <rds-cluster-arn> --tags Key=backup,Value=true",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-26",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create a backup plan for the RDS cluster to protect it from data loss, accidental deletion, or corruption.",
      "Url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_protected_by_backup_plan.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_protected_by_backup_plan/rds_cluster_protected_by_backup_plan.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_protected_by_backup_plan(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"RDS Cluster {db_cluster.id} is not protected by a backup plan."
            )

            if (
                db_cluster.arn in backup_client.protected_resources
                or f"arn:{rds_client.audited_partition}:rds:*:*:cluster:*"
                in backup_client.protected_resources
                or "*" in backup_client.protected_resources
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Cluster {db_cluster.id} is protected by a backup plan."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_storage_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_storage_encrypted/rds_cluster_storage_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_cluster_storage_encrypted",
  "CheckTitle": "Check if RDS clusters storage is encrypted.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-cluster",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbCluster",
  "Description": "Check if RDS clusters storage is encrypted.",
  "Risk": "If not enabled sensitive information at rest is not protected.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds create-db-cluster --db-cluster-identifier <db_cluster_id> --db-cluster-class <cluster_class> --engine <engine> --storage-encrypted true",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-27",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Encryption. Use a CMK where possible. It will provide additional management and privacy benefits.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Overview.Encryption.html#Overview.Encryption.Enabling"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_cluster_storage_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_cluster_storage_encrypted/rds_cluster_storage_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_cluster_storage_encrypted(Check):
    def execute(self):
        findings = []
        for db_cluster in rds_client.db_clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_cluster)
            if db_cluster.encrypted:
                report.status = "PASS"
                report.status_extended = f"RDS cluster {db_cluster.id} is encrypted."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS cluster {db_cluster.id} is not encrypted."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_backup_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_backup_enabled/rds_instance_backup_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_backup_enabled",
  "CheckTitle": "Check if RDS instances have backup enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances have backup enabled.",
  "Risk": "If backup is not enabled, data is vulnerable. Human error or bad actors could erase or modify data.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --db-instance-identifier <db_instance_id> --backup-retention-period 7 --apply-immediately",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-automated-backups-enabled.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-rds-instances-have-backup-policy#terraform"
    },
    "Recommendation": {
      "Text": "Enable automated backup for production data. Define a retention period and periodically test backup restoration. A Disaster Recovery process should be in place to govern Data Protection approach.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_backup_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_backup_enabled/rds_instance_backup_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_backup_enabled(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            if db_instance.backup_retention_period > 0:
                report.status = "PASS"
                report.status_extended = f"RDS Instance {db_instance.id} has backup enabled with retention period {db_instance.backup_retention_period} days."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance {db_instance.id} does not have backup enabled."
                )

            if db_instance.replica_source and not rds_client.audit_config.get(
                "check_rds_instance_replicas", False
            ):
                continue
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_certificate_expiration.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_certificate_expiration/rds_instance_certificate_expiration.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_certificate_expiration",
  "CheckTitle": "Ensure that the SSL/TLS certificates configured for your Amazon RDS are not expired.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "high",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "To maintain Amazon RDS database security and avoid interruption of the applications that are using RDS and/or Aurora databases, rotate the required SSL/TLS certificates and update the deprecated Certificate Authority (CA) certificates at the Amazon RDS instance level.",
  "Risk": "Interruption of application if the certificate expires.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL-certificate-rotation.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --region us-east-1 --db-instance-identifier cc-project5-mysql-database --ca-certificate-identifier \"rds-ca-2019\" --apply-immediately",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rotate-rds-certificates.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To maintain Amazon RDS database security and avoid interruption of the applications that are using RDS and/or Aurora databases, rotate the required SSL/TLS certificates and update the deprecated Certificate Authority (CA) certificates at the Amazon RDS instance level.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL-certificate-rotation.html"
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

````
