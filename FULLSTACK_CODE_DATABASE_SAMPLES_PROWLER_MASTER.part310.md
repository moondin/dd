---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 310
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 310 of 867)

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

---[FILE: rds_instance_certificate_expiration.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_certificate_expiration/rds_instance_certificate_expiration.py

```python
from datetime import datetime

from dateutil import relativedelta
from pytz import utc

from prowler.lib.check.models import Check, Check_Report_AWS, Severity
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_certificate_expiration(Check):
    # RDS Certificates with an expiration greater than 3 months the check will PASS with a severity of informational if greater than 6 months and a severity of low if between 3 and 6 months.
    # RDS Certificates that expires in less than 3 months the check will FAIL with a severity of medium.
    # RDS Certificates that expires in less than a month the check will FAIL with a severity of high.
    # RDS Certificates that are expired the check will FAIL with a severity of critical.
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            report.status = "FAIL"
            report.check_metadata.Severity = Severity.critical
            report.status_extended = (
                f"RDS Instance {db_instance.id} certificate has expired."
            )

            # Check only RDS DB instances that support parameter group encryption
            for cert in db_instance.cert:
                if not cert.customer_override:
                    if cert.valid_till > datetime.now(
                        utc
                    ) + relativedelta.relativedelta(months=6):
                        report.status = "PASS"
                        report.check_metadata.Severity = Severity.informational
                        report.status_extended = f"RDS Instance {db_instance.id} certificate has over 6 months of validity left."
                    elif cert.valid_till < datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=6
                    ) and cert.valid_till > datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=3
                    ):
                        report.status = "PASS"
                        report.check_metadata.Severity = Severity.low
                        report.status_extended = f"RDS Instance {db_instance.id} certificate has between 3 and 6 months of validity."
                    elif cert.valid_till < datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=3
                    ) and cert.valid_till > datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=1
                    ):
                        report.status = "FAIL"
                        report.check_metadata.Severity = Severity.medium
                        report.status_extended = f"RDS Instance {db_instance.id} certificate less than 3 months of validity."
                    elif cert.valid_till < datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=1
                    ) and cert.valid_till > datetime.now(
                        utc
                    ):
                        report.status = "FAIL"
                        report.check_metadata.Severity = Severity.high
                        report.status_extended = f"RDS Instance {db_instance.id} certificate less than 1 month of validity."
                    else:
                        report.status = "FAIL"
                        report.check_metadata.Severity = Severity.critical
                        report.status_extended = (
                            f"RDS Instance {db_instance.id} certificate has expired."
                        )
                else:
                    if cert.valid_till > datetime.now(
                        utc
                    ) + relativedelta.relativedelta(months=6):
                        report.status = "PASS"
                        report.check_metadata.Severity = Severity.informational
                        report.status_extended = f"RDS Instance {db_instance.id} custom certificate has over 6 months of validity left."
                    elif cert.valid_till < datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=6
                    ) and cert.valid_till > datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=3
                    ):
                        report.status = "PASS"
                        report.check_metadata.Severity = Severity.low
                        report.status_extended = f"RDS Instance {db_instance.id} custom certificate has between 3 and 6 months of validity."
                    elif cert.valid_till < datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=3
                    ) and cert.valid_till > datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=1
                    ):
                        report.status = "FAIL"
                        report.check_metadata.Severity = Severity.medium
                        report.status_extended = f"RDS Instance {db_instance.id} custom certificate less than 3 months of validity."
                    elif cert.valid_till < datetime.now(
                        utc
                    ) + relativedelta.relativedelta(
                        months=1
                    ) and cert.valid_till > datetime.now(
                        utc
                    ):
                        report.status = "FAIL"
                        report.check_metadata.Severity = Severity.high
                        report.status_extended = f"RDS Instance {db_instance.id} custom certificate less than 1 month of validity."
                    else:
                        report.status = "FAIL"
                        report.check_metadata.Severity = Severity.critical
                        report.status_extended = f"RDS Instance {db_instance.id} custom certificate has expired."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_copy_tags_to_snapshots.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_copy_tags_to_snapshots/rds_instance_copy_tags_to_snapshots.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_copy_tags_to_snapshots",
  "CheckTitle": "Check if RDS DB instances have copy tags to snapshots enabled",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "low",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS DB instances have copy tags to snapshots enabled, Aurora instances can not have this feature enabled at this level, they will have it at cluster level",
  "Risk": "If RDS instances are not configured to copy tags to snapshots, it could lead to compliance issues as the snapshots will not inherit necessary metadata such as environment, owner, or purpose tags. This could result in inefficient tracking and management of RDS resources and their snapshots.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Tagging.html#USER_Tagging.CopyTags",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --db-instance-identifier <instance-identifier> --copy-tags-to-snapshot",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-17",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the `CopyTagsToSnapshot` setting is enabled for all RDS instances to propagate instance tags to their snapshots for improved tracking and compliance.",
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

---[FILE: rds_instance_copy_tags_to_snapshots.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_copy_tags_to_snapshots/rds_instance_copy_tags_to_snapshots.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_copy_tags_to_snapshots(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            if db_instance.engine not in [
                "aurora",
                "aurora-mysql",
                "aurora-postgresql",
            ]:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=db_instance
                )
                if db_instance.copy_tags_to_snapshot:
                    report.status = "PASS"
                    report.status_extended = f"RDS Instance {db_instance.id} has copy tags to snapshots enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Instance {db_instance.id} does not have copy tags to snapshots enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_critical_event_subscription.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_critical_event_subscription/rds_instance_critical_event_subscription.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_critical_event_subscription",
  "CheckTitle": "Check if RDS Instances events are subscribed.",
  "CheckType": [
    "Software and Configuration Checks, AWS Security Best Practices"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "low",
  "ResourceType": "AwsRdsEventSubscription",
  "Description": "Ensure that Amazon RDS event notification subscriptions are enabled for database database events, particularly maintenance, configuration change and failure.",
  "Risk": "Without event subscriptions for critical events, such as maintenance, configuration changes and failures, you may not be aware of issues affecting your RDS instances, leading to downtime or security vulnerabilities.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds create-event-subscription --source-type db-instance --event-categories 'failure' 'maintenance' 'configuration change' --sns-topic-arn <sns-topic-arn>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-20",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To subscribe to RDS instance event notifications, see Subscribing to Amazon RDS event notification in the Amazon RDS User Guide.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.Subscribing.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_critical_event_subscription.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_critical_event_subscription/rds_instance_critical_event_subscription.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_critical_event_subscription(Check):
    def execute(self):
        findings = []
        if rds_client.provider.scan_unused_services or rds_client.db_instances:
            for db_event in rds_client.db_event_subscriptions:
                report = Check_Report_AWS(metadata=self.metadata(), resource=db_event)
                report.status = "FAIL"
                report.status_extended = "RDS instance event categories of maintenance, configuration change, and failure are not subscribed."
                report.resource_id = rds_client.audited_account
                report.resource_arn = rds_client._get_rds_arn_template(db_event.region)
                report.region = db_event.region
                report.resource_tags = db_event.tags
                if db_event.source_type == "db-instance" and db_event.enabled:
                    report = Check_Report_AWS(
                        metadata=self.metadata(), resource=db_event
                    )
                    if db_event.event_list == [] or set(db_event.event_list) == {
                        "maintenance",
                        "configuration change",
                        "failure",
                    }:
                        report.status = "PASS"
                        report.status_extended = "RDS instance events are subscribed."
                    elif set(db_event.event_list) == {"maintenance"}:
                        report.status = "FAIL"
                        report.status_extended = "RDS instance event categories of configuration change and failure are not subscribed."
                    elif set(db_event.event_list) == {"configuration change"}:
                        report.status = "FAIL"
                        report.status_extended = "RDS instance event categories of maintenance and failure are not subscribed."
                    elif set(db_event.event_list) == {"failure"}:
                        report.status = "FAIL"
                        report.status_extended = "RDS instance event categories of maintenance and configuration change are not subscribed."
                    elif set(db_event.event_list) == {
                        "maintenance",
                        "configuration change",
                    }:
                        report.status = "FAIL"
                        report.status_extended = (
                            "RDS instance event category of failure is not subscribed."
                        )
                    elif set(db_event.event_list) == {
                        "maintenance",
                        "failure",
                    }:
                        report.status = "FAIL"
                        report.status_extended = "RDS instance event category of configuration change is not subscribed."
                    elif set(db_event.event_list) == {
                        "configuration change",
                        "failure",
                    }:
                        report.status = "FAIL"
                        report.status_extended = "RDS instance event category of maintenance is not subscribed."
                    else:
                        report.status = "FAIL"
                        report.status_extended = "RDS instance event categories of maintenance, configuration change, and failure are not subscribed."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_default_admin.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_default_admin/rds_instance_default_admin.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_default_admin",
  "CheckTitle": "Ensure that your Amazon RDS instances are not using the default master username.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Ensure that your Amazon RDS instances are not using the default master username.",
  "Risk": "Since admin is the Amazon's example for the RDS database master username and postgres is the default PostgreSQL master username. Many AWS customers will use this username for their RDS database instances in production. Malicious users can use this information to their advantage and frequently try to use default master username during brute-force attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-25",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-master-username.html#",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-master-username.html#",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-master-username.html#"
    },
    "Recommendation": {
      "Text": "To change the master username configured for your Amazon RDS database instances you must re-create them and migrate the existing data.",
      "Url": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-25"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_default_admin.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_default_admin/rds_instance_default_admin.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_default_admin(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            # Check if is member of a cluster
            if db_instance.cluster_id:
                if (
                    db_instance.cluster_arn in rds_client.db_clusters
                    and rds_client.db_clusters[db_instance.cluster_arn].username
                    not in ["admin", "postgres"]
                ):
                    report.status = "PASS"
                    report.status_extended = f"RDS Instance {db_instance.id} is not using the default master username at cluster {db_instance.cluster_id} level."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Instance {db_instance.id} is using the default master username at cluster {db_instance.cluster_id} level."
            else:
                if db_instance.username not in ["admin", "postgres"]:
                    report.status = "PASS"
                    report.status_extended = f"RDS Instance {db_instance.id} is not using the default master username."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Instance {db_instance.id} is using the default master username."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_deletion_protection.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_deletion_protection/rds_instance_deletion_protection.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_deletion_protection",
  "CheckTitle": "Check if RDS instances have deletion protection enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances have deletion protection enabled.",
  "Risk": "You can only delete instances that do not have deletion protection enabled.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_DeleteInstance.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --db-instance-identifier <db_instance_id> --deletion-protection --apply-immediately",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/instance-deletion-protection.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-rds-clusters-and-instances-have-deletion-protection-enabled#terraform"
    },
    "Recommendation": {
      "Text": "Enable deletion protection using the AWS Management Console for production DB instances.",
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

---[FILE: rds_instance_deletion_protection.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_deletion_protection/rds_instance_deletion_protection.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_deletion_protection(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            # Check if is member of a cluster
            if db_instance.cluster_id:
                if (
                    db_instance.cluster_arn in rds_client.db_clusters
                    and rds_client.db_clusters[
                        db_instance.cluster_arn
                    ].deletion_protection
                ):
                    report.status = "PASS"
                    report.status_extended = f"RDS Instance {db_instance.id} deletion protection is enabled at cluster {db_instance.cluster_id} level."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Instance {db_instance.id} deletion protection is not enabled at cluster {db_instance.cluster_id} level."
            else:
                if db_instance.deletion_protection:
                    report.status = "PASS"
                    report.status_extended = (
                        f"RDS Instance {db_instance.id} deletion protection is enabled."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RDS Instance {db_instance.id} deletion protection is not enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_deprecated_engine_version.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_deprecated_engine_version/rds_instance_deprecated_engine_version.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_deprecated_engine_version",
  "CheckTitle": "Check if RDS instance is using a supported engine version",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS is using a supported engine version for MariaDB, MySQL and PostgreSQL",
  "Risk": "If not enabled RDS instances may be vulnerable to security issues",
  "RelatedUrl": "https://docs.aws.amazon.com/cli/latest/reference/rds/describe-db-engine-versions.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds describe-db-engine-versions --engine <my_engine>'",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure all the RDS instances are using a supported engine version",
      "Url": "https://docs.aws.amazon.com/cli/latest/reference/rds/describe-db-engine-versions.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_deprecated_engine_version.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_deprecated_engine_version/rds_instance_deprecated_engine_version.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_deprecated_engine_version(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            report.status = "FAIL"
            report.status_extended = f"RDS instance {db_instance.id} is using a deprecated engine {db_instance.engine} with version {db_instance.engine_version}."
            if (
                hasattr(
                    rds_client.db_engines.get(db_instance.region, {}).get(
                        db_instance.engine, {}
                    ),
                    "engine_versions",
                )
                and db_instance.engine_version
                in rds_client.db_engines[db_instance.region][
                    db_instance.engine
                ].engine_versions
            ):
                report.status = "PASS"
                report.status_extended = f"RDS instance {db_instance.id} is not using a deprecated engine {db_instance.engine} with version {db_instance.engine_version}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_enhanced_monitoring_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_enhanced_monitoring_enabled/rds_instance_enhanced_monitoring_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_enhanced_monitoring_enabled",
  "CheckTitle": "Check if RDS instances has enhanced monitoring enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "low",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances has enhanced monitoring enabled.",
  "Risk": "A smaller monitoring interval results in more frequent reporting of OS metrics.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds create-db-instance --db-instance-identifier <db_instance_id> --db-instance-class <instance_class> --engine <engine> --storage-encrypted true",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/aws/logging-policies/ensure-that-enhanced-monitoring-is-enabled-for-amazon-rds-instances#terraform"
    },
    "Recommendation": {
      "Text": "To use Enhanced Monitoring, you must create an IAM role, and then enable Enhanced Monitoring.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_enhanced_monitoring_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_enhanced_monitoring_enabled/rds_instance_enhanced_monitoring_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_enhanced_monitoring_enabled(Check):
    def execute(self):
        findings = []
        for db_instance in rds_client.db_instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=db_instance)
            if db_instance.enhanced_monitoring_arn:
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Instance {db_instance.id} has enhanced monitoring enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"RDS Instance {db_instance.id} does not have enhanced monitoring enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_event_subscription_parameter_groups.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_event_subscription_parameter_groups/rds_instance_event_subscription_parameter_groups.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_event_subscription_parameter_groups",
  "CheckTitle": "Check if RDS Parameter Group events are subscribed.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:account",
  "Severity": "low",
  "ResourceType": "AwsAccount",
  "Description": "Ensure that Amazon RDS event notification subscriptions are enabled for database parameter groups events.",
  "Risk": "Amazon RDS event subscriptions for database parameter groups are designed to provide incident notification of events that may affect the security, availability, and reliability of the RDS database instances associated with these parameter groups.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds create-event-subscription --source-type db-instance --event-categories 'configuration change' --sns-topic-arn <sns-topic-arn>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-21",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To subscribe to RDS instance event notifications, see Subscribing to Amazon RDS event notification in the Amazon RDS User Guide.",
      "Url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.Subscribing.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_event_subscription_parameter_groups.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_event_subscription_parameter_groups/rds_instance_event_subscription_parameter_groups.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_event_subscription_parameter_groups(Check):
    """Ensure RDS parameter group event categories of configuration change are subscribed.

    This check is useful to ensure we receive notification of events that may affect the security, availability, and reliability of the RDS database instances associated with these parameter groups.
    """

    def execute(self):
        """Execute the RDS Parameter Group events are subscribed check.

        Iterates through the RDS DB event subscriptions and checks if the event source is DB parameter group and the event list is empty (so it's suscribe to all categories) or contains only configuration change.

        Returns:
            List[Check_Report_AWS]: A list of reports for each RDS DB event subscription.
        """
        findings = []
        if rds_client.provider.scan_unused_services or rds_client.db_instances:
            for db_event in rds_client.db_event_subscriptions:
                report = Check_Report_AWS(metadata=self.metadata(), resource={})
                report.status = "FAIL"
                report.status_extended = "RDS parameter group event categories of configuration change is not subscribed."
                report.resource_id = rds_client.audited_account
                report.resource_arn = rds_client._get_rds_arn_template(db_event.region)
                report.region = db_event.region
                if db_event.source_type == "db-parameter-group":
                    report = Check_Report_AWS(
                        metadata=self.metadata(), resource=db_event
                    )
                    if db_event.enabled and (
                        db_event.event_list == []
                        or db_event.event_list
                        == [
                            "configuration change",
                        ]
                    ):
                        report.status = "PASS"
                        report.status_extended = (
                            "RDS parameter group events are subscribed."
                        )
                    else:
                        report.status = "FAIL"
                        report.status_extended = "RDS parameter group event category of configuration change is not subscribed."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_event_subscription_security_groups.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_event_subscription_security_groups/rds_instance_event_subscription_security_groups.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_event_subscription_security_groups",
  "CheckTitle": "Check if RDS Security Group events are subscribed.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:es",
  "Severity": "medium",
  "ResourceType": "AwsRdsEventSubscription",
  "Description": "Ensure that Amazon RDS event notification subscriptions are enabled for database security groups events.",
  "Risk": "Amazon RDS event subscriptions for database security groups are designed to provide incident notification of events that may affect the security, availability, and reliability of the RDS database instances associated with these security groups.",
  "RelatedUrl": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-22",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-db-security-groups-events.html#",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-db-security-groups-events.html#",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/rds-db-security-groups-events.html#"
    },
    "Recommendation": {
      "Text": "To subscribe to RDS instance event notifications, see Subscribing to Amazon RDS event notification in the Amazon RDS User Guide.",
      "Url": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-22"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_event_subscription_security_groups.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_event_subscription_security_groups/rds_instance_event_subscription_security_groups.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.rds.rds_client import rds_client


class rds_instance_event_subscription_security_groups(Check):
    def execute(self):
        findings = []
        if rds_client.provider.scan_unused_services or rds_client.db_instances:
            for db_event in rds_client.db_event_subscriptions:
                report = Check_Report_AWS(metadata=self.metadata(), resource=db_event)
                report.status = "FAIL"
                report.status_extended = "RDS security group event categories of configuration change and failure are not subscribed."
                report.resource_id = rds_client.audited_account
                report.resource_arn = rds_client._get_rds_arn_template(db_event.region)
                report.resource_tags = []
                if db_event.source_type == "db-security-group" and db_event.enabled:
                    report = Check_Report_AWS(
                        metadata=self.metadata(), resource=db_event
                    )
                    if db_event.event_list == [] or set(db_event.event_list) == {
                        "failure",
                        "configuration change",
                    }:
                        report.status = "PASS"
                        report.status_extended = (
                            "RDS security group events are subscribed."
                        )

                    elif db_event.event_list == ["configuration change"]:
                        report.status = "FAIL"
                        report.status_extended = "RDS security group event category of failure is not subscribed."

                    elif db_event.event_list == ["failure"]:
                        report.status = "FAIL"
                        report.status_extended = "RDS security group event category of configuration change is not subscribed."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_iam_authentication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_instance_iam_authentication_enabled/rds_instance_iam_authentication_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "rds_instance_iam_authentication_enabled",
  "CheckTitle": "Check if RDS instances have IAM authentication enabled.",
  "CheckType": [],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:rds:region:account-id:db-instance",
  "Severity": "medium",
  "ResourceType": "AwsRdsDbInstance",
  "Description": "Check if RDS instances have IAM authentication enabled.",
  "Risk": "Ensure that the IAM Database Authentication feature is enabled for your RDS database instances in order to use the Identity and Access Management (IAM) service to manage database access to your MySQL and PostgreSQL database instances. With this feature enabled, you don't have to use a password when you connect to your MySQL/PostgreSQL database, instead you can use an authentication token. An authentication token is a unique string of characters with a lifetime of 15 minutes that Amazon RDS generates on your request. IAM Database Authentication removes the need of storing user credentials within the database configuration, because authentication is managed externally using Amazon IAM.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Enabling.html",
  "Remediation": {
    "Code": {
      "CLI": "aws rds modify-db-instance --region <REGION> --db-instance-identifier <DB_INSTANCE_ID> --enable-iam-database-authentication --apply-immediately",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/iam-database-authentication.html#",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/rds-controls.html#rds-10",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/RDS/iam-database-authentication.html#"
    },
    "Recommendation": {
      "Text": "Enable IAM authentication for supported RDS instances.",
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

````
