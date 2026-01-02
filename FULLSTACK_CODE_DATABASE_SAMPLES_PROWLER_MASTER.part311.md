---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 311
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 311 of 867)

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

---[FILE: rds_instance_iam_authentication_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_iam_authentication_enabled/rds_instance_iam_authentication_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_iam_authentication_enabled(Check):
    def execute(self):
        supported_engines = [
            "postgres",
            "aurora-postgresql",
            "mysql",
            "mariadb",
            "aurora-mysql",
            "aurora",
        ]
        findings = []
        for db_instance in rds_client.db_instances.values():
            if any(engine in db_instance.engine for engine in supported_engines):
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=db_instance
                )
                # Check if is member of a cluster
                if db_instance.cluster_id:
                    if db_instance.iam_auth:
                        report.status = "PASS"
                        report.status_extended = f"RDS Instance {db_instance.id} has IAM authentication enabled at cluster {db_instance.cluster_id} level."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"RDS Instance {db_instance.id} does not have IAM authentication enabled at cluster {db_instance.cluster_id} level."
                else:
                    if db_instance.iam_auth:
                        report.status = "PASS"
                        report.status_extended = f"RDS Instance {db_instance.id} has IAM authentication enabled."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"RDS Instance {db_instance.id} does not have IAM authentication enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_inside_vpc.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_inside_vpc/rds_instance_inside_vpc.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_inside_vpc",
  "CheckTitle": "Check if RDS instances are deployed within a VPC.",
  "CheckType": [
    "Software and Configuration Checks, AWS Security Best Practices"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "high",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances are deployed within a VPC.",
  "Risk": "If your RDS instances are not deployed within a VPC, they are not isolated from the public internet and are exposed to potential security threats. Deploying RDS instances within a VPC allows you to control inbound and outbound traffic to and from the instances, and provides an additional layer of security to your database instances.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html#USER_VPC.Subnets",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --db-instance-identifier <instance-identifier> --vpc-security-group-ids <vpc-security-group-ids>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-18",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that your RDS instances are deployed within a VPC to provide an additional layer of security to your database instances.",
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

---[FILE: rds_instance_inside_vpc.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_inside_vpc/rds_instance_inside_vpc.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_inside_vpc(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            if db_instance.vpc_id:
                report.status = "PASS"
                report.status_extended = f"RDS Instance {db_instance.id} is deployed in a VPC {db_instance.vpc_id}."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance {db_instance.id} is not deployed in a VPC."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_integration_cloudwatch_logs.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_integration_cloudwatch_logs/rds_instance_integration_cloudwatch_logs.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_integration_cloudwatch_logs",
  "CheckTitle": "Check if RDS instances is integrated with CloudWatch Logs.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances is integrated with CloudWatch Logs.",
  "Risk": "If logs are not enabled, monitoring of service use and threat analysis is not possible.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/publishing_cloudwatchlogs.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --db-instance-identifier <db_instance_id> --cloudwatch-logs-export-configuration {'EnableLogTypes':['audit',error','general','slowquery']} --apply-immediately",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/log-exports.html",
      "Terraform": "https://docs.prowler.com/checks/aws/iam-policies/ensure-that-respective-logs-of-amazon-relational-database-service-amazon-rds-are-enabled#terraform"
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

---[FILE: rds_instance_integration_cloudwatch_logs.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_integration_cloudwatch_logs/rds_instance_integration_cloudwatch_logs.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_integration_cloudwatch_logs(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            if db_instance.cloudwatch_logs:
                report.status = "PASS"
                report.status_extended = f"RDS Instance {db_instance.id} is shipping {', '.join(db_instance.cloudwatch_logs)} logs to CloudWatch Logs."
            else:
                report.status = "FAIL"
                report.status_extended = f"RDS Instance {db_instance.id} does not have CloudWatch Logs enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_minor_version_upgrade_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_minor_version_upgrade_enabled/rds_instance_minor_version_upgrade_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_minor_version_upgrade_enabled",
  "CheckTitle": "Ensure RDS instances have minor version upgrade enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "low",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Ensure RDS instances have minor version upgrade enabled.",
  "Risk": "Auto Minor Version Upgrade is a feature that you can enable to have your database automatically upgraded when a new minor database engine version is available. Minor version upgrades often patch security vulnerabilities and fix bugs and therefore should be applied.",
  "RelatedUrl": "https://aws.amazon.com/blogs/database/best-practices-for-upgrading-amazon-rds-to-major-and-minor-versions-of-postgresql/",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --db-instance-identifier <db_instance_id> --auto-minor-version-upgrade --apply-immediately",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/ensure-aws-db-instance-gets-all-minor-upgrades-automatically#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-auto-minor-version-upgrade.html",
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

---[FILE: rds_instance_minor_version_upgrade_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_minor_version_upgrade_enabled/rds_instance_minor_version_upgrade_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_minor_version_upgrade_enabled(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            if db_instance.auto_minor_version_upgrade:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Instance {db_instance.id} has minor version upgrade enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"RDS Instance {db_instance.id} does not have minor version upgrade enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_multi_az.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_multi_az/rds_instance_multi_az.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_multi_az",
  "CheckTitle": "Check if RDS instances have multi-AZ enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances have multi-AZ enabled.",
  "Risk": "In case of failure, with a single-AZ deployment configuration, should an availability zone specific database failure occur, Amazon RDS can not automatically fail over to the standby availability zone.",
  "RelatedUrl": "https://aws.amazon.com/rds/features/multi-az/",
  "Remediation": {
    "Code": {
      "CLI": "aws rds create-db-instance --db-instance-identifier <db_instance_id> --multi-az true",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/general_73#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-multi-az.html",
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

---[FILE: rds_instance_multi_az.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_multi_az/rds_instance_multi_az.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_multi_az(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            # Check if is member of a cluster
            if db_instance.cluster_id:
                if (
                    db_instance.cluster_arn in rds_client.db_clusters
                    and rds_client.db_clusters[db_instance.cluster_arn].multi_az
                ):
                    report.status = "PASS"
                    report.status_extended = f"RDS Instance {db_instance.id} has multi-AZ enabled at cluster {db_instance.cluster_id} level."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Instance {db_instance.id} does not have multi-AZ enabled at cluster {db_instance.cluster_id} level."
            else:
                if db_instance.multi_az:
                    report.status = "PASS"
                    report.status_extended = (
                        f"RDS Instance {db_instance.id} has multi-AZ enabled."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"RDS Instance {db_instance.id} does not have multi-AZ enabled."
                    )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_non_default_port.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_non_default_port/rds_instance_non_default_port.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_non_default_port",
  "CheckTitle": "Check if RDS instances are using non-default ports.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "low",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Checks if an instance uses a port other than the default port of the database engine. The control fails if the RDS instance uses the default port.",
  "Risk": "Using a default database port exposes the instance to potential security vulnerabilities, as attackers are more likely to target known, commonly-used ports. This may result in unauthorized access to the database or increased susceptibility to automated attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.Modifying.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --db-instance-identifier <db-instance-id> --port <non-default-port>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-23",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the RDS instance to use a non-default port, and ensure that the security group permits access to the new port.",
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

---[FILE: rds_instance_non_default_port.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_non_default_port/rds_instance_non_default_port.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_non_default_port(Check):
    def execute(self):
        findings = []
        default_ports = {
            3306: ["mysql", "mariadb", "aurora-mysql"],
            5432: ["postgres", "aurora-postgresql"],
            1521: ["oracle"],
            1433: ["sqlserver"],
            50000: ["db2"],
        }
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            report.status = "PASS"
            report.status_extended = (
                f"RDS Instance {db_instance.id} is not using the default port "
                f"{db_instance.port} for {db_instance.engine}."
            )
            if db_instance.port in default_ports:
                default_engines = default_ports[db_instance.port]
                for default_engine in default_engines:
                    if default_engine in db_instance.engine.lower():
                        report.status = "FAIL"
                        report.status_extended = (
                            f"RDS Instance {db_instance.id} is using the default port "
                            f"{db_instance.port} for {db_instance.engine}."
                        )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_no_public_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_no_public_access/rds_instance_no_public_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_no_public_access",
  "CheckTitle": "Ensure there are no Public Accessible RDS instances.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "critical",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Ensure there are no Public Accessible RDS instances.",
  "Risk": "Publicly accessible databases could expose sensitive data to bad actors.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/rds-instance-public-access-check.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --db-instance-identifier <db_instance_id> --no-publicly-accessible --apply-immediately",
      "NativeIaC": "https://docs.prowler.com/checks/aws/public-policies/public_2#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-publicly-accessible.html",
      "Terraform": "https://docs.prowler.com/checks/aws/public-policies/public_2#terraform"
    },
    "Recommendation": {
      "Text": "Using an AWS Config rule check for RDS public instances periodically and check there is a business reason for it.",
      "Url": "https://docs.aws.amazon.com/config/latest/developerguide/rds-instance-public-access-check.html"
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

---[FILE: rds_instance_no_public_access.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_no_public_access/rds_instance_no_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.rds.rds_client import rds_client
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class rds_instance_no_public_access(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            report.status = "PASS"
            report.status_extended = (
                f"RDS Instance {db_instance.id} is not publicly accessible."
            )
            if db_instance.public:
                report.status_extended = f"RDS Instance {db_instance.id} is set as publicly accessible, but is not publicly exposed."
                # Check if any DB Instance Security Group is publicly open
                if db_instance.security_groups:
                    public_sg = False
                    report.status_extended = f"RDS Instance {db_instance.id} is set as publicly accessible but filtered with security groups."
                    db_instance_port = db_instance.endpoint.get("Port")
                    if db_instance_port:
                        for security_group in ec2_client.security_groups.values():
                            if security_group.id in db_instance.security_groups:
                                for ingress_rule in security_group.ingress_rules:
                                    if check_security_group(
                                        ingress_rule,
                                        "tcp",
                                        [db_instance_port],
                                        any_address=True,
                                    ):
                                        report.status_extended = f"RDS Instance {db_instance.id} is set as publicly accessible and security group {security_group.name} ({security_group.id}) has {db_instance.engine} port {db_instance_port} open to the Internet at endpoint {db_instance.endpoint.get('Address')} but is not in a public subnet."
                                        public_sg = True
                                        if db_instance.subnet_ids:
                                            for subnet_id in db_instance.subnet_ids:
                                                if (
                                                    subnet_id in vpc_client.vpc_subnets
                                                    and vpc_client.vpc_subnets[
                                                        subnet_id
                                                    ].public
                                                ):
                                                    report.status = "FAIL"
                                                    report.status_extended = f"RDS Instance {db_instance.id} is set as publicly accessible and security group {security_group.name} ({security_group.id}) has {db_instance.engine} port {db_instance_port} open to the Internet at endpoint {db_instance.endpoint.get('Address')} in a public subnet {subnet_id}."
                                                    break
                                    if public_sg:
                                        break
                            if public_sg:
                                break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_no_public_access_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_no_public_access/rds_instance_no_public_access_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.rds.rds_client import rds_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the attributes of an RDS instance to disable public accessibility.
    Specifically, this fixer sets the 'PubliclyAccessible' attribute to False
    to prevent the RDS instance from being publicly accessible. Requires the rds:ModifyDBInstance permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "rds:ModifyDBInstance",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The DB instance identifier.
        region (str): AWS region where the DB instance exists.
    Returns:
        bool: True if the operation is successful (public access is disabled), False otherwise.
    """
    try:
        regional_client = rds_client.regional_clients[region]
        regional_client.modify_db_instance(
            DBInstanceIdentifier=resource_id,
            PubliclyAccessible=False,
            ApplyImmediately=True,
        )
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_protected_by_backup_plan.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_protected_by_backup_plan/rds_instance_protected_by_backup_plan.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_protected_by_backup_plan",
  "CheckTitle": "Check if RDS instances are protected by a backup plan.",
  "CheckType": [
    "Software and Configuration Checks, AWS Security Best Practices"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances are protected by a backup plan.",
  "Risk": "Without a backup plan, RDS instances are vulnerable to data loss, accidental deletion, or corruption. This could lead to significant operational disruptions or loss of critical data.",
  "RelatedUrl": "https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html",
  "Remediation": {
    "Code": {
      "CLI": "aws backup create-backup-plan --backup-plan , aws backup tag-resource --resource-arn <rds-instance-arn> --tags Key=backup,Value=true",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-26",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create a backup plan for the RDS instance to protect it from data loss, accidental deletion, or corruption.",
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

---[FILE: rds_instance_protected_by_backup_plan.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_protected_by_backup_plan/rds_instance_protected_by_backup_plan.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.backup.backup_client import backup_client
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_protected_by_backup_plan(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            # Makes sure the instance is not running with an Aurora engine
            # Aurora backup plans require enabling it separately from RDS
            if db_instance.engine not in [
                "aurora-mysql",
                "aurora",
                "aurora-postgresql",
            ]:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance {db_instance.id} is not protected by a backup plan."
                )

                if (
                    db_instance.arn in backup_client.protected_resources
                    or f"arn:{rds_client.audited_partition}:rds:*:*:instance:*"
                    in backup_client.protected_resources
                    or "*" in backup_client.protected_resources
                ):
                    report.status = "PASS"
                    report.status_extended = (
                        f"RDS Instance {db_instance.id} is protected by a backup plan."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_storage_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_storage_encrypted/rds_instance_storage_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_storage_encrypted",
  "CheckTitle": "Check if RDS instances storage is encrypted.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances storage is encrypted.",
  "Risk": "If not enabled sensitive information at rest is not protected.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds create-db-instance --db-instance-identifier <db_instance_id> --db-instance-class <instance_class> --engine <engine> --storage-encrypted true",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/general_4#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-encryption-enabled.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/general_4#terraform"
    },
    "Recommendation": {
      "Text": "Enable Encryption. Use a CMK where possible. It will provide additional management and privacy benefits.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_storage_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_storage_encrypted/rds_instance_storage_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_storage_encrypted(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            if db_instance.encrypted:
                report.status = "PASS"
                report.status_extended = f"RDS Instance {db_instance.id} is encrypted."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance {db_instance.id} is not encrypted."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_transport_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_transport_encrypted/rds_instance_transport_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_transport_encrypted",
  "CheckTitle": "Check if RDS instances enforce SSL/TLS encryption for client connections (Microsoft SQL Server, PostgreSQL, MySQL, MariaDB, Aurora PostgreSQL, and Aurora MySQL).",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "high",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "For SQL Server, PostgreSQL, and Aurora PostgreSQL databases, if the `rds.force_ssl` parameter value is set to 0, SSL/TLS connections are not enforced. For MySQL, Aurora MySQL, and MariaDB databases, if the `require_secure_transport` parameter value is set to OFF, SSL/TLS connections are not enforced. Enforcing SSL/TLS ensures that all client connections to RDS instances are encrypted, protecting sensitive information in transit.",
  "Risk": "If not enabled, sensitive information in transit is not protected.",
  "RelatedUrl": "https://aws.amazon.com/premiumsupport/knowledge-center/rds-connect-ssl-connection/",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-parameter-group --region <REGION_NAME> --db-parameter-group-name <PARAMETER_GROUP_NAME> --parameters ParameterName='rds.force_ssl',ParameterValue='1',ApplyMethod='pending-reboot'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/transport-encryption.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that instances provisioned with Amazon RDS enforce SSL/TLS for client connections to meet security and compliance requirements.",
      "Url": "https://aws.amazon.com/premiumsupport/knowledge-center/rds-connect-ssl-connection/"
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

---[FILE: rds_instance_transport_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_transport_encrypted/rds_instance_transport_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_transport_encrypted(Check):
    def execute(self):
        findings = []
        supported_engines = [
            "sqlserver-se",
            "sqlserver-ee",
            "sqlserver-ex",
            "sqlserver-web",
            "postgres",
            "aurora-postgresql",
            "mysql",
            "mariadb",
            "aurora-mysql",
        ]
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            report.status = "FAIL"
            report.status_extended = (
                f"RDS Instance {db_instance.id} connections are not encrypted."
            )

            # Check only RDS DB instances that support parameter group encryption
            if not db_instance.cluster_id and any(
                engine in db_instance.engine for engine in supported_engines
            ):
                if db_instance.engine in [
                    "sqlserver-se",
                    "sqlserver-ee",
                    "sqlserver-ex",
                    "sqlserver-web",
                    "postgres",
                    "aurora-postgresql",
                ]:
                    for parameter in db_instance.parameters:
                        if (
                            parameter["ParameterName"] == "rds.force_ssl"
                            and parameter.get("ParameterValue", "0") == "1"
                        ):
                            report.status = "PASS"
                            report.status_extended = f"RDS Instance {db_instance.id} connections use SSL encryption."
                else:
                    for parameter in db_instance.parameters:
                        if (
                            parameter["ParameterName"] == "require_secure_transport"
                            and parameter.get("ParameterValue", "0") == "1"
                        ):
                            report.status = "PASS"
                            report.status_extended = f"RDS Instance {db_instance.id} connections use SSL encryption."

                findings.append(report)

        for db_cluster in rds_client.db_clusters:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=rds_client.db_clusters[db_cluster],
            )
            report.status = "FAIL"
            report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} connections are not encrypted."
            # Check RDS Clusters that support TLS encryption
            if rds_client.db_clusters[db_cluster].force_ssl == "1":
                report.status = "PASS"
                report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} connections use SSL encryption."
            if rds_client.db_clusters[db_cluster].require_secure_transport == "ON":
                report.status = "PASS"
                report.status_extended = f"RDS Cluster {rds_client.db_clusters[db_cluster].id} connections use SSL encryption."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_snapshots_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_snapshots_encrypted/rds_snapshots_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_snapshots_encrypted",
  "CheckTitle": "Check if RDS Snapshots and Cluster Snapshots are encrypted.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:snapshot",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbSnapshot",
  "Description": "Check if RDS Snapshots and Cluster Snapshots are encrypted.",
  "Risk": "Ensure that your manual Amazon RDS database snapshots are encrypted in order to achieve compliance for data-at-rest encryption within your organization.",
  "RelatedUrl": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-4",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/snapshot-encrypted.html#",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/snapshot-encrypted.html#",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/snapshot-encrypted.html#"
    },
    "Recommendation": {
      "Text": "When working with production databases that hold sensitive and critical data, it is strongly recommended to implement encryption at rest and protect your data from attackers or unauthorized personnel. ",
      "Url": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-4"
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

---[FILE: rds_snapshots_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_snapshots_encrypted/rds_snapshots_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_snapshots_encrypted(Check):
    def execute(self):
        findings = []
        for db_snap in rds_client.db_snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_snap)
            if db_snap.encrypted:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Instance Snapshot {db_snap.id} is encrypted."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance Snapshot {db_snap.id} is not encrypted."
                )

            findings.append(report)

        for db_snap in rds_client.db_cluster_snapshots:
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_snap)
            if db_snap.encrypted:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Cluster Snapshot {db_snap.id} is encrypted."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Cluster Snapshot {db_snap.id} is not encrypted."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
