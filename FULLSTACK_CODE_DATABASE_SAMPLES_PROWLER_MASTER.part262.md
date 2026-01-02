---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 262
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 262 of 867)

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

---[FILE: dms_endpoint_redis_in_transit_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_endpoint_redis_in_transit_encryption_enabled/dms_endpoint_redis_in_transit_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_endpoint_redis_in_transit_encryption_enabled",
  "CheckTitle": "DMS endpoint for Redis OSS is encrypted in transit",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Encryption in Transit",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/ISO 27001 Controls"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDmsEndpoint",
  "Description": "**DMS Redis OSS endpoints** are assessed for the presence of **TLS** in their endpoint settings, such as `ssl-encryption`, indicating encrypted connections between the DMS replication instance and Redis.",
  "Risk": "Without **TLS**, traffic between DMS and Redis can be intercepted or altered, compromising **confidentiality** and **integrity**.\n\nAttackers can perform **man-in-the-middle** interception, steal auth tokens, and inject or corrupt migrated data.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dms-controls.html#dms-12",
    "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.Redis.html#CHAP_Target.Redis.EndpointSettings",
    "https://support.icompaas.com/support/solutions/articles/62000233450-ensure-encryption-in-transit-for-dms-endpoints-for-redis-oss"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Enable TLS for Redis OSS DMS endpoint\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::Endpoint\n    Properties:\n      EndpointIdentifier: <example_resource_name>\n      EndpointType: target\n      EngineName: redis\n      RedisSettings:\n        ServerName: <example_resource_name>\n        Port: 6379\n        AuthType: none\n        SslSecurityProtocol: ssl-encryption  # Critical: enables TLS for in-transit encryption\n```",
      "Other": "1. In the AWS Console, go to Database Migration Service > Endpoints\n2. Select the Redis OSS endpoint and click Modify\n3. Set SSL security protocol (Encryption in transit) to \"SSL encryption\"\n4. Save changes",
      "Terraform": "```hcl\n# Enable TLS for Redis OSS DMS endpoint\nresource \"aws_dms_endpoint\" \"<example_resource_name>\" {\n  endpoint_id   = \"<example_resource_id>\"\n  endpoint_type = \"target\"\n  engine_name   = \"redis\"\n\n  redis_settings {\n    server_name           = \"<example_resource_name>\"\n    port                  = 6379\n    auth_type             = \"none\"\n    ssl_security_protocol = \"ssl-encryption\" # Critical: enables TLS for in-transit encryption\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **TLS** on Redis OSS endpoints (e.g., `ssl-encryption`) and require server certificate validation. Prohibit plaintext connections, prefer private networking, and enforce **least privilege** for DMS roles to strengthen **defense in depth**.",
      "Url": "https://hub.prowler.com/check/dms_endpoint_redis_in_transit_encryption_enabled"
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

---[FILE: dms_endpoint_redis_in_transit_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_endpoint_redis_in_transit_encryption_enabled/dms_endpoint_redis_in_transit_encryption_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client


class dms_endpoint_redis_in_transit_encryption_enabled(Check):
    """
    Check if AWS DMS Endpoints for Redis OSS have TLS enabled.

    This class verifies whether each AWS DMS Endpoint configured for Redis OSS is encrypted in transit
    by checking the `TlsEnabled` property in the endpoint's configuration. The check ensures that
    TLS is enabled to secure data in transit, preventing unauthorized access and ensuring data integrity.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """
        Execute the DMS Redis TLS enabled check.

        Iterates over all DMS Endpoints and generates a report indicating whether
        each Redis OSS endpoint is encrypted in transit.

        Returns:
            List[Check_Report_AWS]: A list of report objects with the results of the check.
        """
        findings = []
        for endpoint in dms_client.endpoints.values():
            if endpoint.engine_name == "redis":
                report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)
                report.status = "FAIL"
                report.status_extended = f"DMS Endpoint {endpoint.id} for Redis OSS is not encrypted in transit."
                if endpoint.redis_ssl_protocol == "ssl-encryption":
                    report.status = "PASS"
                    report.status_extended = f"DMS Endpoint {endpoint.id} for Redis OSS is encrypted in transit."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dms_endpoint_ssl_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_endpoint_ssl_enabled/dms_endpoint_ssl_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_endpoint_ssl_enabled",
  "CheckTitle": "DMS endpoint has SSL enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsDmsEndpoint",
  "Description": "**AWS DMS endpoints** have their SSL/TLS mode inspected; any value other than `none` denotes encrypted connections between the replication instance and databases.\n\nSupported modes include `require`, `verify-ca`, and `verify-full`.",
  "Risk": "Without TLS, data in transit can be read or altered, affecting:\n- **Confidentiality** via packet sniffing and credential leakage\n- **Integrity** through **MITM** tampering of migration streams\n- **Availability** from session hijack or task disruption",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/database/configuring-ssl-encryption-on-oracle-and-postgresql-endpoints-in-aws-dms/",
    "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.SSL.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dms-controls.html#dms-9"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dms modify-endpoint --endpoint-arn <endpoint-arn> --ssl-mode require",
      "NativeIaC": "```yaml\n# CloudFormation: Set SSL on a DMS endpoint\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::Endpoint\n    Properties:\n      EndpointIdentifier: <example_resource_name>\n      EndpointType: source\n      EngineName: sqlserver\n      ServerName: <server_name>\n      Port: 1433\n      Username: <username>\n      Password: <password>\n      SslMode: require  # CRITICAL: enables SSL (not \"none\"), fixing the finding\n```",
      "Other": "1. In the AWS DMS console, go to Endpoints\n2. Select the non-compliant endpoint and choose Modify\n3. Set SSL mode to Require (or Verify-ca/Verify-full if required by your engine and certificate is available)\n4. If Verify-ca/Verify-full is selected, choose the appropriate CA certificate\n5. Save changes, then Test connection to confirm",
      "Terraform": "```hcl\n# Terraform: Set SSL on a DMS endpoint\nresource \"aws_dms_endpoint\" \"<example_resource_name>\" {\n  endpoint_id   = \"<example_resource_name>\"\n  endpoint_type = \"source\"\n  engine_name   = \"sqlserver\"\n  server_name   = \"<server_name>\"\n  port          = 1433\n  username      = \"<username>\"\n  password      = \"<password>\"\n\n  ssl_mode = \"require\" # CRITICAL: enables SSL (not \"none\"), fixing the finding\n}\n```"
    },
    "Recommendation": {
      "Text": "Configure endpoints to use SSL/TLS at least `require`; prefer `verify-ca` or `verify-full` where supported. Manage trusted CA material and rotate regularly. Apply **defense in depth** with private connectivity and strict IAM, and enforce this posture via policy-as-code and continuous validation.",
      "Url": "https://hub.prowler.com/check/dms_endpoint_ssl_enabled"
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

---[FILE: dms_endpoint_ssl_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_endpoint_ssl_enabled/dms_endpoint_ssl_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client


class dms_endpoint_ssl_enabled(Check):
    def execute(self):
        findings = []
        for endpoint in dms_client.endpoints.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)

            if endpoint.ssl_mode == "none":
                report.status = "FAIL"
                report.status_extended = f"DMS Endpoint {endpoint.id} is not using SSL."
            else:
                report.status = "PASS"
                report.status_extended = f"DMS Endpoint {endpoint.id} is using SSL with mode: {endpoint.ssl_mode}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dms_instance_minor_version_upgrade_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_instance_minor_version_upgrade_enabled/dms_instance_minor_version_upgrade_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_instance_minor_version_upgrade_enabled",
  "CheckTitle": "DMS replication instance has auto minor version upgrade enabled",
  "CheckType": [
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDmsReplicationInstance",
  "Description": "**AWS DMS replication instances** are evaluated for the `auto_minor_version_upgrade` setting to confirm **automatic minor engine updates** are enabled during the maintenance window.",
  "Risk": "Without **automatic minor upgrades**, DMS engines can miss security patches and fixes, enabling exploitation of known flaws and instability.\n- Confidentiality: exposure via unpatched components\n- Integrity: replication errors or data drift\n- Availability: outages during migration or CDC",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dms-controls.html#dms-6",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/DMS/auto-minor-version-upgrade.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dms modify-replication-instance --region <REGION> --replication-instance-arn arn:aws:dms:<REGION>:<ACCOUNT_ID>:rep:<REPLICATION_ID> --auto-minor-version-upgrade --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: Enable auto minor version upgrade on a DMS replication instance\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::ReplicationInstance\n    Properties:\n      ReplicationInstanceIdentifier: <example_resource_id>\n      ReplicationInstanceClass: dms.t3.micro\n      AutoMinorVersionUpgrade: true  # CRITICAL: turns on automatic minor version upgrades\n```",
      "Other": "1. Open the AWS Console and go to Database Migration Service (DMS)\n2. Click Replication instances and select your instance\n3. Choose Actions > Modify\n4. Check Auto minor version upgrade\n5. Select Apply immediately\n6. Click Modify to save",
      "Terraform": "```hcl\n# Terraform: Enable auto minor version upgrade on a DMS replication instance\nresource \"aws_dms_replication_instance\" \"<example_resource_name>\" {\n  replication_instance_id    = \"<example_resource_id>\"\n  replication_instance_class = \"dms.t3.micro\"\n  auto_minor_version_upgrade = true  # CRITICAL: turns on automatic minor version upgrades\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable `auto_minor_version_upgrade` on all replication instances to maintain **continuous patching**.\n- Set a maintenance window and validate in non-prod\n- Monitor release notes and health metrics\n- Enforce **least privilege** for change control\n- Keep **backups** for rollback",
      "Url": "https://hub.prowler.com/check/dms_instance_minor_version_upgrade_enabled"
    }
  },
  "Categories": [
    "vulnerabilities"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: dms_instance_minor_version_upgrade_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_instance_minor_version_upgrade_enabled/dms_instance_minor_version_upgrade_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client


class dms_instance_minor_version_upgrade_enabled(Check):
    def execute(self):
        findings = []
        for instance in dms_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "FAIL"
            report.status_extended = f"DMS Replication Instance {instance.id} does not have auto minor version upgrade enabled."
            if instance.auto_minor_version_upgrade:
                report.status = "PASS"
                report.status_extended = f"DMS Replication Instance {instance.id} has auto minor version upgrade enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dms_instance_multi_az_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_instance_multi_az_enabled/dms_instance_multi_az_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_instance_multi_az_enabled",
  "CheckTitle": "DMS replication instance has Multi-AZ enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDmsReplicationInstance",
  "Description": "**AWS DMS replication instances** are evaluated for **Multi-AZ** configuration. Instances with `multi_az` enabled are treated as having a cross-AZ standby; those without it are identified as single-AZ.",
  "Risk": "Without **Multi-AZ**, a single-AZ failure or maintenance event can halt migrations, causing extended downtime (**availability**) and replication gaps or rollbacks (**integrity**). Tasks may stall, increase cutover risk, and require manual recovery when the replication instance is unavailable.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/DMS/multi-az.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dms modify-replication-instance --replication-instance-arn arn:aws:dms:<REGION>:<ACCOUNT_ID>:rep:<REPLICATION_ID> --multi-az --apply-immediately",
      "NativeIaC": "```yaml\n# CloudFormation: enable Multi-AZ on a DMS replication instance\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::ReplicationInstance\n    Properties:\n      ReplicationInstanceClass: dms.t3.micro\n      MultiAZ: true  # Critical: enables Multi-AZ to pass the check\n```",
      "Other": "1. Open the AWS DMS console\n2. Go to Replication instances and select your instance\n3. Click Modify\n4. Check Multi-AZ\n5. Check Apply immediately\n6. Click Modify to save",
      "Terraform": "```hcl\n# Enable Multi-AZ on a DMS replication instance\nresource \"aws_dms_replication_instance\" \"<example_resource_name>\" {\n  replication_instance_id   = \"<example_resource_name>\"\n  replication_instance_class = \"dms.t3.micro\"\n  multi_az                  = true  # Critical: enables Multi-AZ to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Multi-AZ** (set `multi_az` to `true`) on DMS replication instances that handle production or time-sensitive migrations to ensure redundancy and automatic failover.\n\nApply HA principles: distribute across AZs, test failover, monitor health, and plan maintenance to minimize impact.",
      "Url": "https://hub.prowler.com/check/dms_instance_multi_az_enabled"
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

---[FILE: dms_instance_multi_az_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_instance_multi_az_enabled/dms_instance_multi_az_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client


class dms_instance_multi_az_enabled(Check):
    def execute(self):
        findings = []
        for instance in dms_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "FAIL"
            report.status_extended = f"DMS Replication Instance {instance.id} does not have multi az enabled."
            if instance.multi_az:
                report.status = "PASS"
                report.status_extended = (
                    f"DMS Replication Instance {instance.id} has multi az enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dms_instance_no_public_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_instance_no_public_access/dms_instance_no_public_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_instance_no_public_access",
  "CheckTitle": "DMS replication instance is not publicly exposed to the Internet",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "TTPs/Initial Access"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsDmsReplicationInstance",
  "Description": "**AWS DMS replication instances** are evaluated for **public exposure**. Exposure is identified when `PubliclyAccessible` is enabled and an attached security group allows inbound traffic from any address. Private or allowlisted instances are not considered exposed.",
  "Risk": "Publicly reachable replication instances threaten:\n- Confidentiality: migration data and credentials can be intercepted or exfiltrated.\n- Integrity: attackers may alter tasks or inject records.\n- Availability: abuse or DDoS can stall replication and delay cutovers.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dms-controls.html#dms-1",
    "https://docs.aws.amazon.com/amazonq/detector-library/terraform/restrict-public-access-dms-terraform/",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/DMS/publicly-accessible.html",
    "https://support.icompaas.com/support/solutions/articles/62000233448-ensure-dms-instances-are-not-publicly-accessible"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: DMS instance not publicly accessible\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::ReplicationInstance\n    Properties:\n      ReplicationInstanceClass: dms.t3.micro\n      PubliclyAccessible: false  # Critical: disables public access to prevent Internet exposure\n```",
      "Other": "1. In the AWS Console, open Database Migration Service > Replication instances and select the instance\n2. In Details > Networking, click each attached Security Group ID to open it in the EC2 console\n3. In Inbound rules, delete any rule with Source 0.0.0.0/0 or ::/0\n4. Save rules for each security group",
      "Terraform": "```hcl\n# DMS instance not publicly accessible\nresource \"aws_dms_replication_instance\" \"<example_resource_name>\" {\n  replication_instance_id    = \"<example_resource_id>\"\n  replication_instance_class = \"dms.t3.micro\"\n  publicly_accessible        = false  # Critical: disables public access to prevent Internet exposure\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt a **private-only** design:\n- Disable `PubliclyAccessible`; place instances in private subnets.\n- Enforce **least privilege** security groups (no `0.0.0.0/0`); allow only required sources/ports.\n- Provide access via **VPN**, peering, or Direct Connect.\n- Layer controls (ACLs, monitoring) and restrict IAM to necessary actions.",
      "Url": "https://hub.prowler.com/check/dms_instance_no_public_access"
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

---[FILE: dms_instance_no_public_access.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_instance_no_public_access/dms_instance_no_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group


class dms_instance_no_public_access(Check):
    def execute(self):
        findings = []
        for instance in dms_client.instances:
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"DMS Replication Instance {instance.id} is not publicly accessible."
            )
            if instance.public:
                report.status_extended = f"DMS Replication Instance {instance.id} is set as publicly accessible, but is not publicly exposed."
                # Check if any DB Instance Security Group is publicly open
                if instance.security_groups:
                    report.status = "PASS"
                    report.status_extended = f"DMS Replication Instance {instance.id} is set as publicly accessible but filtered with security groups."
                    for security_group in ec2_client.security_groups.values():
                        if security_group.id in instance.security_groups:
                            for ingress_rule in security_group.ingress_rules:
                                if check_security_group(
                                    ingress_rule,
                                    "-1",
                                    ports=None,
                                    any_address=True,
                                ):
                                    report.status = "FAIL"
                                    report.status_extended = f"DMS Replication Instance {instance.id} is set as publicly accessible and security group {security_group.name} ({security_group.id}) is open to the Internet."
                                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dms_replication_task_source_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_replication_task_source_logging_enabled/dms_replication_task_source_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_replication_task_source_logging_enabled",
  "CheckTitle": "DMS replication task has logging enabled and SOURCE_CAPTURE and SOURCE_UNLOAD components set to at least Default severity",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Defense Evasion"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDmsReplicationTask",
  "Description": "**AWS DMS replication tasks** have **logging enabled** and configure `SOURCE_CAPTURE` and `SOURCE_UNLOAD` with severity at least `LOGGER_SEVERITY_DEFAULT` (or higher: `LOGGER_SEVERITY_DEBUG`, `LOGGER_SEVERITY_DETAILED_DEBUG`).",
  "Risk": "Missing or low-severity source logs hinder visibility into **CDC** and full-load activity, risking undetected errors, stalls, or tampering. This can cause silent **data drift**, broken lineage, and failed recoveries, undermining **integrity** and **availability** and weakening auditability during investigations.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Monitoring.html",
    "https://repost.aws/knowledge-center/dms-debug-logging",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dms-controls.html#dms-8"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dms modify-replication-task --replication-task-arn <example_resource_arn> --replication-task-settings '{\"Logging\":{\"EnableLogging\":true,\"LogComponents\":[{\"Id\":\"SOURCE_CAPTURE\",\"Severity\":\"LOGGER_SEVERITY_DEFAULT\"},{\"Id\":\"SOURCE_UNLOAD\",\"Severity\":\"LOGGER_SEVERITY_DEFAULT\"}]}}'",
      "NativeIaC": "```yaml\n# CloudFormation: enable DMS source logging at minimum DEFAULT severity\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::ReplicationTask\n    Properties:\n      ReplicationInstanceArn: <example_resource_arn>\n      SourceEndpointArn: <example_resource_arn>\n      TargetEndpointArn: <example_resource_arn>\n      MigrationType: full-load\n      TableMappings: '{\"rules\":[]}'\n      # Critical: Enables logging and sets SOURCE components to at least DEFAULT\n      ReplicationTaskSettings: |\n        {\n          \"Logging\": {\n            \"EnableLogging\": true,\n            \"LogComponents\": [\n              {\"Id\": \"SOURCE_CAPTURE\", \"Severity\": \"LOGGER_SEVERITY_DEFAULT\"},\n              {\"Id\": \"SOURCE_UNLOAD\", \"Severity\": \"LOGGER_SEVERITY_DEFAULT\"}\n            ]\n          }\n        }\n```",
      "Other": "1. In the AWS console, go to Database Migration Service > Database migration tasks\n2. Select the task and choose Modify\n3. Click Modify task logging\n4. Turn on Enable logging\n5. For SOURCE_CAPTURE and SOURCE_UNLOAD, set Severity to Default (or higher)\n6. Save/Modify to apply",
      "Terraform": "```hcl\n# Enable DMS source logging at minimum DEFAULT severity\nresource \"aws_dms_replication_task\" \"<example_resource_name>\" {\n  replication_instance_arn = \"<example_resource_arn>\"\n  source_endpoint_arn      = \"<example_resource_arn>\"\n  target_endpoint_arn      = \"<example_resource_arn>\"\n  migration_type           = \"full-load\"\n  table_mappings           = \"{\\\"rules\\\":[]}\"\n\n  # Critical: Enables logging and sets SOURCE components to at least DEFAULT\n  replication_task_settings = <<JSON\n{\n  \"Logging\": {\n    \"EnableLogging\": true,\n    \"LogComponents\": [\n      {\"Id\": \"SOURCE_CAPTURE\", \"Severity\": \"LOGGER_SEVERITY_DEFAULT\"},\n      {\"Id\": \"SOURCE_UNLOAD\", \"Severity\": \"LOGGER_SEVERITY_DEFAULT\"}\n    ]\n  }\n}\nJSON\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and standardize **task logging** for `SOURCE_CAPTURE` and `SOURCE_UNLOAD` at `LOGGER_SEVERITY_DEFAULT` or higher.\n- Centralize logs and alert on anomalies\n- Enforce **least privilege** for log access\n- Set retention to support audits\n- Avoid prolonged `DEBUG` levels, *except during troubleshooting*, to balance visibility and cost",
      "Url": "https://hub.prowler.com/check/dms_replication_task_source_logging_enabled"
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

---[FILE: dms_replication_task_source_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_replication_task_source_logging_enabled/dms_replication_task_source_logging_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.dms.dms_client import dms_client


class dms_replication_task_source_logging_enabled(Check):
    """
    Check if AWS DMS replication tasks have logging enabled with the required
    logging components and severity levels.

    This class verifies that each DMS replication task has logging enabled
    and that the components SOURCE_CAPTURE and SOURCE_UNLOAD are configured with
    at least LOGGER_SEVERITY_DEFAULT severity level. If either component is missing
    or does not meet the minimum severity requirement, the check will fail.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """
        Execute the DMS replication task logging requirements check.

        Iterates over all DMS replication tasks and generates a report indicating
        whether each task has logging enabled and meets the logging requirements
        for SOURCE_CAPTURE and SOURCE_UNLOAD components.

        Returns:
            List[Check_Report_AWS]: A list of report objects with the results of the check.
        """
        MINIMUM_SEVERITY_LEVELS = [
            "LOGGER_SEVERITY_DEFAULT",
            "LOGGER_SEVERITY_DEBUG",
            "LOGGER_SEVERITY_DETAILED_DEBUG",
        ]
        findings = []
        for (
            replication_task_arn,
            replication_task,
        ) in dms_client.replication_tasks.items():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=replication_task
            )
            report.resource_arn = replication_task_arn

            if not replication_task.logging_enabled:
                report.status = "FAIL"
                report.status_extended = f"DMS Replication Task {replication_task.id} does not have logging enabled for source events."
            else:
                missing_components = []
                source_capture_compliant = False
                source_unload_compliant = False

                for component in replication_task.log_components:
                    if (
                        component["Id"] == "SOURCE_CAPTURE"
                        and component["Severity"] in MINIMUM_SEVERITY_LEVELS
                    ):
                        source_capture_compliant = True
                    elif (
                        component["Id"] == "SOURCE_UNLOAD"
                        and component["Severity"] in MINIMUM_SEVERITY_LEVELS
                    ):
                        source_unload_compliant = True

                if not source_capture_compliant:
                    missing_components.append("Source Capture")
                if not source_unload_compliant:
                    missing_components.append("Source Unload")

                if source_capture_compliant and source_unload_compliant:
                    report.status = "PASS"
                    report.status_extended = f"DMS Replication Task {replication_task.id} has logging enabled with the minimum severity level in source events."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"DMS Replication Task {replication_task.id} does not meet the minimum severity level of logging in {' and '.join(missing_components)} events."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dms_replication_task_target_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/dms/dms_replication_task_target_logging_enabled/dms_replication_task_target_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "dms_replication_task_target_logging_enabled",
  "CheckTitle": "DMS replication task has TARGET_APPLY and TARGET_LOAD logging enabled with at least default severity",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Defense Evasion"
  ],
  "ServiceName": "dms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsDmsReplicationTask",
  "Description": "**AWS DMS replication tasks** have target logging enabled, including `TARGET_APPLY` and `TARGET_LOAD`, each set to at least `LOGGER_SEVERITY_DEFAULT`.",
  "Risk": "Insufficient target logging limits visibility into load/apply activity, masking failures and anomalies. This risks **data integrity** (silent drift, partial loads) and **availability** (longer incident resolution), and reduces **auditability** of migration events.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://repost.aws/knowledge-center/dms-debug-logging",
    "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TaskSettings.Logging.html",
    "https://stackoverflow.com/questions/46913913/aws-dms-with-cloudformation-enabling-logging-needs-a-log-group",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/dms-controls.html#dms-7"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws dms modify-replication-task --replication-task-arn <task-arn> --replication-task-settings '{\"Logging\":{\"EnableLogging\":true,\"LogComponents\":[{\"Id\":\"TARGET_APPLY\",\"Severity\":\"LOGGER_SEVERITY_DEFAULT\"},{\"Id\":\"TARGET_LOAD\",\"Severity\":\"LOGGER_SEVERITY_DEFAULT\"}]}}'",
      "NativeIaC": "```yaml\n# CloudFormation: enable DMS task logging for target components\nResources:\n  <example_resource_name>:\n    Type: AWS::DMS::ReplicationTask\n    Properties:\n      ReplicationInstanceArn: <example_resource_arn>\n      SourceEndpointArn: <example_resource_arn>\n      TargetEndpointArn: <example_resource_arn>\n      MigrationType: full-load\n      TableMappings: |\n        {\"rules\":[{\"rule-type\":\"selection\",\"rule-id\":\"1\",\"rule-name\":\"1\",\"object-locator\":{\"schema-name\":\"%\",\"table-name\":\"%\"},\"rule-action\":\"include\"}]}\n      ReplicationTaskSettings: |\n        {\"Logging\":{\"EnableLogging\":true, \"LogComponents\":[\n          {\"Id\":\"TARGET_APPLY\",\"Severity\":\"LOGGER_SEVERITY_DEFAULT\"},  # Critical: ensure TARGET_APPLY logging at default\n          {\"Id\":\"TARGET_LOAD\",\"Severity\":\"LOGGER_SEVERITY_DEFAULT\"}    # Critical: ensure TARGET_LOAD logging at default\n        ]}}\n```",
      "Other": "1. Open the AWS DMS console and go to Database migration tasks\n2. Select the replication task and choose Modify\n3. Expand Task settings (JSON) or Logging\n4. Enable CloudWatch logs (EnableLogging = true)\n5. Set log components:\n   - TARGET_APPLY severity: DEFAULT\n   - TARGET_LOAD severity: DEFAULT\n6. Save changes (Modify task), then rerun the task if required",
      "Terraform": "```hcl\n# Enable DMS task logging for target components\nresource \"aws_dms_replication_task\" \"<example_resource_name>\" {\n  replication_task_id      = \"<example_resource_id>\"\n  replication_instance_arn = \"<example_resource_arn>\"\n  source_endpoint_arn      = \"<example_resource_arn>\"\n  target_endpoint_arn      = \"<example_resource_arn>\"\n  migration_type           = \"full-load\"\n  table_mappings           = jsonencode({ rules = [{\n    \"rule-type\" : \"selection\", \"rule-id\" : \"1\", \"rule-name\" : \"1\",\n    \"object-locator\" : { \"schema-name\" : \"%\", \"table-name\" : \"%\" },\n    \"rule-action\" : \"include\"\n  }]} )\n\n  # Critical: enables logging and sets TARGET_APPLY and TARGET_LOAD to minimum required severity\n  replication_task_settings = jsonencode({\n    Logging = {\n      EnableLogging = true\n      LogComponents = [\n        { Id = \"TARGET_APPLY\", Severity = \"LOGGER_SEVERITY_DEFAULT\" },\n        { Id = \"TARGET_LOAD\",  Severity = \"LOGGER_SEVERITY_DEFAULT\" }\n      ]\n    }\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and maintain **CloudWatch logging** at `LOGGER_SEVERITY_DEFAULT` or higher for target components:\n- Configure `TARGET_APPLY` and `TARGET_LOAD`\n- Enforce least-privilege log access\n- Monitor logs/alerts for anomalies\n- Standardize task settings and validate data for **defense in depth**",
      "Url": "https://hub.prowler.com/check/dms_replication_task_target_logging_enabled"
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

````
