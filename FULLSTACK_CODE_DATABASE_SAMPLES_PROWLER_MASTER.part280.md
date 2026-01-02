---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 280
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 280 of 867)

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

---[FILE: elasticache_redis_cluster_automatic_failover_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_automatic_failover_enabled/elasticache_redis_cluster_automatic_failover_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticache_redis_cluster_automatic_failover_enabled",
  "CheckTitle": "ElastiCache Redis cluster has automatic failover enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "elasticache",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon ElastiCache (Redis OSS) replication groups** have **automatic failover** set to `enabled`, allowing a replica to be promoted when the primary becomes unavailable",
  "Risk": "**Missing automatic failover** reduces **availability**: a primary or AZ outage can stop writes and require manual recovery, prolonging downtime.\n\nAs Redis replication is asynchronous, delayed promotion increases chances of **lost or stale writes**, affecting **data integrity** and causing client timeouts.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/database/testing-automatic-failover-to-a-read-replica-on-amazon-elasticache-for-redis/",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/AutoFailover.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticache modify-replication-group --replication-group-id <example_resource_id> --automatic-failover-enabled --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: enable automatic failover for a Redis replication group\nResources:\n  <example_resource_name>:\n    Type: AWS::ElastiCache::ReplicationGroup\n    Properties:\n      ReplicationGroupId: <example_resource_id>\n      ReplicationGroupDescription: \"<description>\"\n      NumCacheClusters: 2\n      AutomaticFailoverEnabled: true  # Critical: turns on automatic failover so the check passes\n      Engine: redis\n```",
      "Other": "1. Open the AWS Console and go to ElastiCache\n2. Select your Redis replication group (<example_resource_id>)\n3. Click Modify\n4. Set Auto failover to Enabled\n5. Check Apply immediately\n6. Click Save changes",
      "Terraform": "```hcl\n# Terraform: enable automatic failover for a Redis replication group\nresource \"aws_elasticache_replication_group\" \"<example_resource_name>\" {\n  replication_group_id          = \"<example_resource_id>\"\n  replication_group_description = \"<description>\"\n  node_type                     = \"cache.t3.small\"\n  number_cache_clusters         = 2\n  automatic_failover_enabled    = true  # Critical: turns on automatic failover so the check passes\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **automatic failover** with **Multi-AZ**, keeping at least one replica per shard in a different AZ. Regularly *test failover* and monitor replication lag.\n\nArchitect clients for resilience with retries and backoff to tolerate brief role changes, aligning with **fault tolerance** and **defense in depth**.",
      "Url": "https://hub.prowler.com/check/elasticache_redis_cluster_automatic_failover_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_automatic_failover_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_automatic_failover_enabled/elasticache_redis_cluster_automatic_failover_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticache.elasticache_client import (
    elasticache_client,
)


class elasticache_redis_cluster_automatic_failover_enabled(Check):
    def execute(self):
        findings = []
        for repl_group in elasticache_client.replication_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=repl_group)
            report.status = "FAIL"
            report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} does not have automatic failover enabled."

            if repl_group.automatic_failover == "enabled":
                report.status = "PASS"
                report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} does have automatic failover enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_auto_minor_version_upgrades.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_auto_minor_version_upgrades/elasticache_redis_cluster_auto_minor_version_upgrades.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticache_redis_cluster_auto_minor_version_upgrades",
  "CheckTitle": "ElastiCache Redis cache cluster has automatic minor version upgrades enabled",
  "CheckType": [
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "elasticache",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**ElastiCache for Redis** replication groups are configured to apply **automatic minor engine upgrades** using `AutoMinorVersionUpgrade`",
  "Risk": "Without **automatic minor upgrades**, Redis nodes may run versions with known CVEs and stability bugs, enabling unauthorized access, replication inconsistencies, or crashes. Delayed patching widens the attack window and lengthens maintenance, degrading confidentiality, integrity, and availability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/VersionManagementConsiderations.html",
    "https://support.icompaas.com/support/solutions/articles/62000233595-ensure-elasticache-redis-cache-clusters-have-automatic-minor-upgrades-enabled",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/VersionManagement.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticache modify-replication-group --replication-group-id <replication_group_id> --auto-minor-version-upgrade --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: enable auto minor version upgrades on a Replication Group\nResources:\n  <example_resource_name>:\n    Type: AWS::ElastiCache::ReplicationGroup\n    Properties:\n      ReplicationGroupDescription: \"<example_description>\"\n      CacheNodeType: \"<example_node_type>\"\n      NumCacheClusters: 1\n      AutoMinorVersionUpgrade: true  # CRITICAL: turns on automatic minor version upgrades\n      # This ensures new minor engine versions are applied automatically\n```",
      "Other": "1. Open the AWS console and go to ElastiCache\n2. Select Replication groups, choose the target group\n3. Click Modify\n4. Enable Automatic minor version upgrade\n5. Check Apply immediately and click Modify to save",
      "Terraform": "```hcl\n# Enable auto minor version upgrades on an ElastiCache replication group\nresource \"aws_elasticache_replication_group\" \"<example_resource_name>\" {\n  replication_group_id       = \"<example_resource_id>\"\n  description                = \"<example_description>\"\n  node_type                  = \"<example_node_type>\"\n  num_cache_clusters         = 1\n  auto_minor_version_upgrade = true  # CRITICAL: automatically applies minor engine upgrades\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable `AutoMinorVersionUpgrade` for Redis replication groups and govern updates with a maintenance window. Apply **patch management** and **defense in depth**: validate in staging, keep recent backups, use Multi-AZ for resilience, and monitor release notes to ensure timely, low-impact updates.",
      "Url": "https://hub.prowler.com/check/elasticache_redis_cluster_auto_minor_version_upgrades"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_auto_minor_version_upgrades.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_auto_minor_version_upgrades/elasticache_redis_cluster_auto_minor_version_upgrades.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticache.elasticache_client import (
    elasticache_client,
)


class elasticache_redis_cluster_auto_minor_version_upgrades(Check):
    def execute(self):
        findings = []
        for repl_group in elasticache_client.replication_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=repl_group)
            report.status = "PASS"
            report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} does have automated minor version upgrades enabled."

            if not repl_group.auto_minor_version_upgrade:
                report.status = "FAIL"
                report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} does not have automated minor version upgrades enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_backup_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_backup_enabled/elasticache_redis_cluster_backup_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticache_redis_cluster_backup_enabled",
  "CheckTitle": "ElastiCache Redis cache cluster has automated snapshot backups enabled with retention of at least 7 days",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "elasticache",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "Amazon ElastiCache Redis replication groups have **automated snapshot backups** enabled with a **retention period** of at least `7` days.\n\nThe evaluation focuses on whether backups are enabled and the configured retention meets the minimum threshold.",
  "Risk": "Absent or short-retained backups degrade **availability** and heighten **data loss** risk. Hardware failures, corruption, or accidental deletes may not be recoverable to needed points, undermining **RPO/RTO**, prolonging outages, and limiting **forensics** on cache data.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ElastiCache/enable-automatic-backups.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elasticache-controls.html#elasticache-1"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticache modify-replication-group --replication-group-id <REPLICATION_GROUP_ID> --snapshot-retention-limit 7 --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: set automated snapshot retention for a Redis replication group\nResources:\n  <example_resource_name>:\n    Type: AWS::ElastiCache::ReplicationGroup\n    Properties:\n      ReplicationGroupDescription: example\n      SnapshotRetentionLimit: 7  # Critical: enables automatic snapshots and retains them for >=7 days\n```",
      "Other": "1. In the AWS Console, open ElastiCache\n2. Go to Redis > Replication groups\n3. Select <example_resource_id> and click Modify\n4. Set Snapshot retention (days) to 7 or higher\n5. Check Apply immediately\n6. Click Modify to save",
      "Terraform": "```hcl\nresource \"aws_elasticache_replication_group\" \"<example_resource_name>\" {\n  replication_group_id       = \"<example_resource_id>\"\n  replication_group_description = \"<example_description>\"\n  snapshot_retention_limit   = 7  # Critical: enable automated backups and keep them for >=7 days\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **automated backups** and set **retention** to meet RPO/RTO (typically  `7` days).\n- Define a consistent `snapshot window`\n- Test restores regularly\n- Protect backup storage with **least privilege** and immutability\n- Monitor backup status for failures\n- Apply **defense in depth** with replicas/Multi-AZ",
      "Url": "https://hub.prowler.com/check/elasticache_redis_cluster_backup_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_backup_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_backup_enabled/elasticache_redis_cluster_backup_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS, Severity
from prowler.providers.aws.services.elasticache.elasticache_client import (
    elasticache_client,
)


class elasticache_redis_cluster_backup_enabled(Check):
    def execute(self):
        findings = []
        for repl_group in elasticache_client.replication_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=repl_group)
            report.status = "FAIL"
            report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} does not have automated snapshot backups enabled."
            if repl_group.snapshot_retention >= elasticache_client.audit_config.get(
                "minimum_snapshot_retention_period", 7
            ):
                report.status = "PASS"
                report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} has automated snapshot backups enabled with retention period {repl_group.snapshot_retention} days."
            else:
                if repl_group.snapshot_retention > 0:
                    report.status = "FAIL"
                    report.check_metadata.Severity = Severity.low
                    report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} has automated snapshot backups enabled with retention period {repl_group.snapshot_retention} days. Recommended to increase the snapshot retention period to a minimum of 7 days."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_in_transit_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_in_transit_encryption_enabled/elasticache_redis_cluster_in_transit_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticache_redis_cluster_in_transit_encryption_enabled",
  "CheckTitle": "ElastiCache Redis cache cluster has in-transit encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Security",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "elasticache",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**ElastiCache for Redis** replication groups have **in-transit encryption (TLS)** enabled for client and inter-node traffic (`TransitEncryptionEnabled=true`).",
  "Risk": "Absent **in-transit encryption**, traffic between apps and Redis or between nodes can be **eavesdropped** or **tampered**.\n\nThis exposes keys, tokens, and cached sensitive data, enables **MITM** and session hijacking, and can corrupt replication, harming **confidentiality** and **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ElastiCache/in-transit-and-at-rest-encryption.html",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/in-transit-encryption-enable.html",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/in-transit-encryption.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticache modify-replication-group --replication-group-id <example_resource_id> --transit-encryption-enabled --transit-encryption-mode preferred --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: enable in-transit encryption for a Redis replication group\nResources:\n  <example_resource_name>:\n    Type: AWS::ElastiCache::ReplicationGroup\n    Properties:\n      ReplicationGroupId: \"<example_resource_id>\"\n      ReplicationGroupDescription: \"<example_description>\"\n      NumCacheClusters: 1\n      CacheSubnetGroupName: \"<example_resource_name>\"\n      TransitEncryptionEnabled: true  # CRITICAL: enables TLS in-transit to pass the check\n```",
      "Other": "1. In the AWS Console, go to ElastiCache > Redis OSS (or Valkey) replication groups\n2. Select the replication group and click Actions > Modify\n3. Under Security, enable Encryption in transit and set Transit encryption mode to Preferred\n4. Check Apply immediately and Save changes",
      "Terraform": "```hcl\n# Enable in-transit encryption for a Redis replication group\nresource \"aws_elasticache_replication_group\" \"<example_resource_name>\" {\n  replication_group_id       = \"<example_resource_id>\"\n  description                = \"<example_description>\"\n  node_type                  = \"cache.t3.micro\"\n  num_cache_clusters         = 1\n  subnet_group_name          = \"<example_resource_name>\"\n  transit_encryption_enabled = true  # CRITICAL: enables TLS in-transit to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **TLS** by setting `TransitEncryptionEnabled=true` and enforce a strict mode (require TLS 1.2+).\n\nEnsure clients validate certificates, restrict network paths, and pair with **least privilege** plus Redis AUTH/RBAC for defense in depth.",
      "Url": "https://hub.prowler.com/check/elasticache_redis_cluster_in_transit_encryption_enabled"
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

---[FILE: elasticache_redis_cluster_in_transit_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_in_transit_encryption_enabled/elasticache_redis_cluster_in_transit_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticache.elasticache_client import (
    elasticache_client,
)


class elasticache_redis_cluster_in_transit_encryption_enabled(Check):
    def execute(self):
        findings = []
        for repl_group in elasticache_client.replication_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=repl_group)
            report.status = "FAIL"
            report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} does not have in transit encryption enabled."
            if repl_group.transit_encryption:
                report.status = "PASS"
                report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} has in transit encryption enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_multi_az_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_multi_az_enabled/elasticache_redis_cluster_multi_az_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticache_redis_cluster_multi_az_enabled",
  "CheckTitle": "ElastiCache Redis replication group has Multi-AZ enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "elasticache",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**ElastiCache for Redis replication groups** have **Multi-AZ automatic failover** enabled, distributing primary and replicas across distinct Availability Zones",
  "Risk": "Without **Multi-AZ failover**, a node or AZ outage can make Redis endpoints unreachable, reducing **availability**. Cold-cache rebuilds shift load to databases, risking saturation and cascading timeouts. Recent writes may be lost during failures, impacting **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/AutoFailover.html",
    "https://repost.aws/knowledge-center/multi-az-replication-redis",
    "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/ElastiCache/elasticache-multi-az.html#"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticache modify-replication-group --replication-group-id <example_resource_id> --multi-az-enabled --automatic-failover-enabled --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Multi-AZ on an ElastiCache Redis replication group\nResources:\n  <example_resource_name>:\n    Type: AWS::ElastiCache::ReplicationGroup\n    Properties:\n      ReplicationGroupDescription: \"<description>\"\n      Engine: redis\n      CacheNodeType: cache.t4g.small\n      NumCacheClusters: 2\n      MultiAZEnabled: true  # CRITICAL: Enables Multi-AZ for the replication group\n```",
      "Other": "1. In the AWS Console, go to ElastiCache > Redis\n2. Select the target replication group\n3. Click Modify\n4. Enable Multi-AZ (and Automatic failover if prompted)\n5. Check Apply immediately and click Modify",
      "Terraform": "```hcl\n# Enable Multi-AZ on an ElastiCache Redis replication group\nresource \"aws_elasticache_replication_group\" \"<example_resource_name>\" {\n  replication_group_id  = \"<example_resource_id>\"\n  description           = \"<description>\"\n  engine                = \"redis\"\n  node_type             = \"cache.t4g.small\"\n  number_cache_clusters = 2\n\n  multi_az_enabled           = true  # CRITICAL: Enables Multi-AZ\n  automatic_failover_enabled = true  # Required for Multi-AZ failover\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Multi-AZ with automatic failover** (`MultiAZ: enabled`) on Redis replication groups and place replicas in separate AZs. Use clients that follow primary/reader endpoints, monitor replication lag, and regularly test failover. Pair with snapshots for recovery; this enforces high **availability** and **resilience**.",
      "Url": "https://hub.prowler.com/check/elasticache_redis_cluster_multi_az_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_multi_az_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_multi_az_enabled/elasticache_redis_cluster_multi_az_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticache.elasticache_client import (
    elasticache_client,
)


class elasticache_redis_cluster_multi_az_enabled(Check):
    def execute(self):
        findings = []
        for repl_group in elasticache_client.replication_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=repl_group)
            report.status = "FAIL"
            report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} does not have Multi-AZ enabled."
            if repl_group.multi_az == "enabled":
                report.status = "PASS"
                report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} has Multi-AZ enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_rest_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_rest_encryption_enabled/elasticache_redis_cluster_rest_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticache_redis_cluster_rest_encryption_enabled",
  "CheckTitle": "ElastiCache Redis cache cluster has at rest encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "elasticache",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**ElastiCache for Redis replication groups** are evaluated for **encryption at rest** of on-disk cache data and backups. The finding pinpoints groups where this protection is not enabled.",
  "Risk": "Without at-rest encryption, cache files and snapshots can be read if storage or backups are accessed via compromise or misconfiguration. Secrets, tokens, and PII may be exposed, breaking **confidentiality** and aiding **lateral movement** through offline analysis of cached data.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ElastiCache/in-transit-and-at-rest-encryption.html",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/at-rest-encryption.html#at-rest-encryption-enable",
    "https://aws.amazon.com/blogs/security/amazon-elasticache-now-supports-encryption-for-elasticache-for-redis/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: enable at-rest encryption for an ElastiCache Redis replication group\nResources:\n  <example_resource_name>:\n    Type: AWS::ElastiCache::ReplicationGroup\n    Properties:\n      ReplicationGroupId: <example_resource_id>\n      ReplicationGroupDescription: Enable at-rest encryption\n      Engine: redis\n      CacheNodeType: cache.t3.micro\n      NumCacheClusters: 1\n      AtRestEncryptionEnabled: true  # CRITICAL: turns on encryption at rest for the replication group\n```",
      "Other": "1. In the AWS Console, go to ElastiCache > Redis\n2. Select the non-encrypted replication group, click Actions > Backup and create a manual backup\n3. After the backup completes, click Backups, select it, then Restore\n4. In restore settings, check/enable Encryption at rest (use default KMS key) and create the new replication group\n5. Update your application to use the new replication group endpoint\n6. Verify connectivity and data, then delete the old (non-encrypted) replication group",
      "Terraform": "```hcl\n# Terraform: enable at-rest encryption for an ElastiCache Redis replication group\nresource \"aws_elasticache_replication_group\" \"<example_resource_name>\" {\n  replication_group_id  = \"<example_resource_id>\"\n  description           = \"Enable at-rest encryption\"\n  node_type             = \"cache.t3.micro\"\n  number_cache_clusters = 1\n  at_rest_encryption_enabled = true  # CRITICAL: turns on encryption at rest for the replication group\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **encryption at rest** on all Redis replication groups. Use **customer-managed KMS keys**, apply least-privilege access to keys, and audit key usage. Plan a controlled migration since at-rest encryption is enabled at creation (backup, restore, replace). Pair with **in-transit encryption** and authentication for defense in depth.",
      "Url": "https://hub.prowler.com/check/elasticache_redis_cluster_rest_encryption_enabled"
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

---[FILE: elasticache_redis_cluster_rest_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_cluster_rest_encryption_enabled/elasticache_redis_cluster_rest_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticache.elasticache_client import (
    elasticache_client,
)


class elasticache_redis_cluster_rest_encryption_enabled(Check):
    def execute(self):
        findings = []
        for repl_group in elasticache_client.replication_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=repl_group)
            report.status = "FAIL"
            report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} does not have at rest encryption enabled."
            if repl_group.encrypted:
                report.status = "PASS"
                report.status_extended = f"Elasticache Redis cache cluster {repl_group.id} has at rest encryption enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_replication_group_auth_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_replication_group_auth_enabled/elasticache_redis_replication_group_auth_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "elasticache_redis_replication_group_auth_enabled",
  "CheckTitle": "ElastiCache Redis replication group with engine version < 6.0 has Redis OSS AUTH enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "elasticache",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Amazon ElastiCache Redis replication groups running versions prior to `6.0` are evaluated for the use of **AUTH tokens**. For `6.0+`, the finding indicates **ACL/RBAC** configuration should be reviewed instead of token-based AUTH.",
  "Risk": "Without **AUTH** on pre-`6.0` clusters, clients can run unauthenticated commands, enabling data reads/writes, key deletion, and cache poisoning. This threatens **confidentiality** and **integrity**, and can facilitate lateral movement via stolen or injected session data.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/elasticache-controls.html#elasticache-6",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/auth.html#auth-modifyng-token",
    "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws elasticache modify-replication-group --replication-group-id <example_resource_id> --auth-token <AUTH_TOKEN> --auth-token-update-strategy SET --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: enable Redis AUTH on an existing replication group\nResources:\n  <example_resource_name>:\n    Type: AWS::ElastiCache::ReplicationGroup\n    Properties:\n      ReplicationGroupId: <example_resource_id>\n      ReplicationGroupDescription: enable-auth\n      TransitEncryptionEnabled: true   # CRITICAL: required to use AUTH\n      AuthToken: <AUTH_TOKEN>          # CRITICAL: enables Redis AUTH\n      AuthTokenUpdateStrategy: SET  # CRITICAL: adds token; enables AUTH\n```",
      "Other": "1. In the AWS Console, go to ElastiCache > Redis replication groups\n2. Select the replication group <example_resource_id> and click Modify\n3. Under Access control, choose Redis OSS AUTH and enter <AUTH_TOKEN>\n4. Check Apply immediately and click Modify\n5. Wait for status to return to Available; AUTH is now enabled",
      "Terraform": "```hcl\n# Terraform: enable Redis AUTH on an existing replication group\nresource \"aws_elasticache_replication_group\" \"<example_resource_name>\" {\n  replication_group_id       = \"<example_resource_id>\"\n  description                = \"enable-auth\"\n  transit_encryption_enabled = true            # CRITICAL: required to use AUTH\n  auth_token                 = \"<AUTH_TOKEN>\" # CRITICAL: enables Redis AUTH\n  auth_token_update_strategy = \"SET\"       # CRITICAL: adds token; enables AUTH\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply defense in depth:\n- For versions < `6.0`, enable **AUTH** with strong, rotated tokens and require in-transit encryption.\n- For `6.0+`, prefer **RBAC/ACLs** with least-privilege, deny-by-default roles.\n- Restrict network access to trusted sources and audit access regularly.",
      "Url": "https://hub.prowler.com/check/elasticache_redis_replication_group_auth_enabled"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_replication_group_auth_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/elasticache/elasticache_redis_replication_group_auth_enabled/elasticache_redis_replication_group_auth_enabled.py

```python
from packaging import version

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elasticache.elasticache_client import (
    elasticache_client,
)


class elasticache_redis_replication_group_auth_enabled(Check):
    def execute(self):
        findings = []
        for repl_group in elasticache_client.replication_groups.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=repl_group)

            if version.parse(repl_group.engine_version) < version.parse("6.0"):
                if not repl_group.auth_token_enabled:
                    report.status = "FAIL"
                    report.status_extended = f"Elasticache Redis replication group {repl_group.id}(v{repl_group.engine_version}) does not have AUTH enabled."

                else:
                    report.status = "PASS"
                    report.status_extended = f"Elasticache Redis replication group {repl_group.id}(v{repl_group.engine_version}) does have AUTH enabled."
            else:
                report.status = "MANUAL"
                report.status_extended = f"Elasticache Redis replication group {repl_group.id} has version {repl_group.engine_version} which supports Redis ACLs. Please review the ACL configuration."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: elasticbeanstalk_client.py]---
Location: prowler-master/prowler/providers/aws/services/elasticbeanstalk/elasticbeanstalk_client.py

```python
from prowler.providers.aws.services.elasticbeanstalk.elasticbeanstalk_service import (
    ElasticBeanstalk,
)
from prowler.providers.common.provider import Provider

elasticbeanstalk_client = ElasticBeanstalk(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
