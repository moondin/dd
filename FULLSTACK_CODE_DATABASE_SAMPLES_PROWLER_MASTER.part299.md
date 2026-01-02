---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 299
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 299 of 867)

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

---[FILE: kafka_cluster_enhanced_monitoring_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_enhanced_monitoring_enabled/kafka_cluster_enhanced_monitoring_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kafka_cluster_enhanced_monitoring_enabled",
  "CheckTitle": "Amazon MSK cluster has enhanced monitoring enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "kafka",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsMskCluster",
  "Description": "**Amazon MSK clusters** are assessed for **enhanced monitoring** levels beyond `DEFAULT` (e.g., `PER_BROKER`, `PER_TOPIC_PER_BROKER`, `PER_TOPIC_PER_PARTITION`).\n\n*Serverless clusters* include enhanced monitoring by design; provisioned clusters are evaluated by their configured monitoring level.",
  "Risk": "Insufficient metrics limit visibility into **broker health**, **replication state**, and **consumer lag**, delaying response to incidents.\n\nThis increases risk of **availability loss** (saturation, throttling) and can mask **integrity issues** such as under-replicated partitions, raising data-loss impact during failures.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/msk/latest/developerguide/metrics-details.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MSK/enable-enhanced-monitoring-for-apache-kafka-brokers.html#",
    "https://docs.aws.amazon.com/msk/latest/developerguide/monitoring.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kafka update-monitoring --cluster-arn <CLUSTER_ARN> --current-version <CURRENT_VERSION> --enhanced-monitoring PER_BROKER",
      "NativeIaC": "```yaml\n# CloudFormation: Enable enhanced monitoring on an MSK cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::MSK::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      KafkaVersion: <example_kafka_version>\n      NumberOfBrokerNodes: 2\n      BrokerNodeGroupInfo:\n        ClientSubnets:\n          - <example_subnet_id_1>\n          - <example_subnet_id_2>\n        InstanceType: kafka.t3.small\n      EnhancedMonitoring: PER_BROKER  # Critical: sets enhanced monitoring above DEFAULT to pass the check\n```",
      "Other": "1. Open the AWS Console and go to Amazon MSK\n2. Select your provisioned cluster\n3. Click Edit\n4. Under Monitoring, set Enhanced monitoring to PER_BROKER (or higher)\n5. Save changes and wait for the update to complete",
      "Terraform": "```hcl\n# Terraform: Enable enhanced monitoring on an MSK cluster\nresource \"aws_msk_cluster\" \"<example_resource_name>\" {\n  cluster_name           = \"<example_resource_name>\"\n  kafka_version          = \"<example_kafka_version>\"\n  number_of_broker_nodes = 2\n\n  broker_node_group_info {\n    instance_type  = \"kafka.t3.small\"\n    client_subnets = [\"<example_subnet_id_1>\", \"<example_subnet_id_2>\"]\n  }\n\n  enhanced_monitoring = \"PER_BROKER\" # Critical: sets monitoring above DEFAULT to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Select an enhanced level (e.g., `PER_BROKER` or finer) and establish **observability**: prioritize telemetry for broker resources, replication health, and consumer lag. Configure alerts and dashboards aligned to SLOs to enable proactive scaling and rapid incident containment. *Balance granularity with cost*.",
      "Url": "https://hub.prowler.com/check/kafka_cluster_enhanced_monitoring_enabled"
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

---[FILE: kafka_cluster_enhanced_monitoring_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_enhanced_monitoring_enabled/kafka_cluster_enhanced_monitoring_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kafka.kafka_client import kafka_client


class kafka_cluster_enhanced_monitoring_enabled(Check):
    def execute(self):
        findings = []

        for cluster in kafka_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"Kafka cluster '{cluster.name}' has enhanced monitoring enabled."
            )

            # Serverless clusters always have enhanced monitoring enabled by default
            if cluster.kafka_version == "SERVERLESS":
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' is serverless and always has enhanced monitoring enabled by default."
            # For provisioned clusters, check the enhanced monitoring configuration
            elif cluster.enhanced_monitoring == "DEFAULT":
                report.status = "FAIL"
                report.status_extended = f"Kafka cluster '{cluster.name}' does not have enhanced monitoring enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_in_transit_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_in_transit_encryption_enabled/kafka_cluster_in_transit_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kafka_cluster_in_transit_encryption_enabled",
  "CheckTitle": "Kafka cluster has encryption in transit enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "kafka",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsMskCluster",
  "Description": "**Amazon MSK clusters** are evaluated for **encryption in transit** on both paths: **clientbroker** set to `TLS` only and **inter-broker** encryption enabled. *Serverless clusters provide this by default*.\n\nThe finding highlights clusters where client-broker traffic isn't `TLS`-only or inter-broker encryption is turned off.",
  "Risk": "Unencrypted or mixed (`TLS_PLAINTEXT`/`PLAINTEXT`) traffic enables interception of records, credentials, and metadata, supporting **MITM**, replay, and message tampering.\n\nPlaintext inter-broker links expose replication data within the VPC, enabling **lateral movement** and topic poisoning, degrading data **confidentiality** and **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/msk/latest/developerguide/msk-encryption.html",
    "https://docs.aws.amazon.com/msk/latest/developerguide/msk-working-with-encryption.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MSK/encryption-in-transit-for-msk.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: MSK cluster with encryption in transit enforced\nResources:\n  <example_resource_name>:\n    Type: AWS::MSK::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      KafkaVersion: <VERSION>\n      NumberOfBrokerNodes: 3\n      BrokerNodeGroupInfo:\n        ClientSubnets:\n          - <example_resource_id>\n          - <example_resource_id>\n        InstanceType: kafka.m5.large\n      EncryptionInfo:\n        EncryptionInTransit:\n          ClientBroker: TLS  # Critical: forces client-to-broker TLS only\n          InCluster: true    # Critical: enables inter-broker encryption\n```",
      "Other": "1. In the AWS Console, go to Amazon MSK > Clusters and select your cluster\n2. Click Edit (Security)\n3. Under Encryption in transit, set Client-broker to TLS only\n4. Save changes\n5. Verify Inter-broker (in-cluster) encryption is enabled; if it is disabled (immutable), create a new cluster with:\n   - Encryption in transit: Client-broker = TLS only, Inter-broker encryption = Enabled\n   - Migrate clients to the new cluster, then decommission the old one",
      "Terraform": "```hcl\n# Terraform: MSK cluster with encryption in transit enforced\nresource \"aws_msk_cluster\" \"<example_resource_name>\" {\n  cluster_name           = \"<example_resource_name>\"\n  kafka_version          = \"<VERSION>\"\n  number_of_broker_nodes = 3\n\n  broker_node_group_info {\n    instance_type  = \"kafka.m5.large\"\n    client_subnets = [\n      \"subnet-<example_resource_id>\",\n      \"subnet-<example_resource_id>\",\n    ]\n  }\n\n  encryption_info {\n    encryption_in_transit {\n      client_broker = \"TLS\"  # Critical: forces client-to-broker TLS only\n      in_cluster    = true    # Critical: enables inter-broker encryption\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce end-to-end transport protection:\n- Require `client_broker=TLS` for all clients\n- Enable `in_cluster=true` for broker-to-broker links\n\nApply **defense in depth**: restrict network paths, prefer private connectivity, and use strong client authentication with **least privilege** authorization to limit blast radius.",
      "Url": "https://hub.prowler.com/check/kafka_cluster_in_transit_encryption_enabled"
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

---[FILE: kafka_cluster_in_transit_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_in_transit_encryption_enabled/kafka_cluster_in_transit_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kafka.kafka_client import kafka_client


class kafka_cluster_in_transit_encryption_enabled(Check):
    def execute(self):
        findings = []

        for cluster in kafka_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"Kafka cluster '{cluster.name}' does not have encryption in transit enabled."

            # Serverless clusters always have encryption in transit enabled by default
            if cluster.kafka_version == "SERVERLESS":
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' is serverless and always has encryption in transit enabled by default."
            # For provisioned clusters, check the encryption configuration
            elif (
                cluster.encryption_in_transit.client_broker == "TLS"
                and cluster.encryption_in_transit.in_cluster
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"Kafka cluster '{cluster.name}' has encryption in transit enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_is_public.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_is_public/kafka_cluster_is_public.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kafka_cluster_is_public",
  "CheckTitle": "Kafka cluster is not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "TTPs/Initial Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "kafka",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsMskCluster",
  "Description": "**Amazon MSK clusters** with broker endpoints **exposed to the public Internet**.\n\nServerless clusters are private by default; provisioned clusters are evaluated for their `public access` configuration.",
  "Risk": "Public brokers erode **CIA**:\n- **Confidentiality**: unauthorized consumers can read topics\n- **Integrity**: rogue producers inject or alter events\n- **Availability**: floods or scans strain brokers\n\nThis enables metadata enumeration, data exfiltration, stream poisoning, and costly egress.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/msk/latest/developerguide/public-access.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MSK/public-access-msk-cluster.html",
    "https://docs.aws.amazon.com/msk/latest/developerguide/client-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kafka update-connectivity --cluster-arn <CLUSTER_ARN> --current-version <CURRENT_CLUSTER_VERSION> --connectivity-info '{\"PublicAccess\":{\"Type\":\"DISABLED\"}}'",
      "NativeIaC": "```yaml\n# CloudFormation: ensure MSK cluster is not publicly accessible\nResources:\n  <example_resource_name>:\n    Type: AWS::MSK::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      KafkaVersion: \"2.8.1\"\n      NumberOfBrokerNodes: 2\n      BrokerNodeGroupInfo:\n        ClientSubnets:\n          - <example_subnet_id_1>\n          - <example_subnet_id_2>\n        InstanceType: kafka.t3.small\n        ConnectivityInfo:\n          PublicAccess:\n            Type: DISABLED  # Critical: disables public access to brokers\n```",
      "Other": "1. Open the Amazon MSK console\n2. Select your cluster and go to the Properties tab\n3. In Network settings, click Edit public access\n4. Set Public access to Disabled (Off)\n5. Click Save changes",
      "Terraform": "```hcl\n# Terraform: ensure MSK cluster is not publicly accessible\nresource \"aws_msk_cluster\" \"<example_resource_name>\" {\n  cluster_name           = \"<example_resource_name>\"\n  kafka_version          = \"2.8.1\"\n  number_of_broker_nodes = 2\n\n  broker_node_group_info {\n    client_subnets = [\n      \"<example_subnet_id_1>\",\n      \"<example_subnet_id_2>\",\n    ]\n    instance_type = \"kafka.t3.small\"\n\n    connectivity_info {\n      public_access {\n        type = \"DISABLED\"  # Critical: disables public access to brokers\n      }\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Keep brokers private within the VPC by disabling public access and limiting exposure to trusted networks.\n\nEnforce strong auth (SASL/IAM, SASL/SCRAM, or mTLS), require TLS, and apply Kafka ACLs. Provide access via VPN, bastion, or private networking (peering/Transit Gateway). Apply **least privilege** and monitor broker connections.",
      "Url": "https://hub.prowler.com/check/kafka_cluster_is_public"
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

---[FILE: kafka_cluster_is_public.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_is_public/kafka_cluster_is_public.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kafka.kafka_client import kafka_client


class kafka_cluster_is_public(Check):
    def execute(self):
        findings = []

        for cluster in kafka_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"Kafka cluster {cluster.name} is publicly accessible."
            )

            # Serverless clusters are always private by default
            if cluster.kafka_version == "SERVERLESS":
                report.status = "PASS"
                report.status_extended = f"Kafka cluster {cluster.name} is serverless and always private by default."
            # For provisioned clusters, check the public access configuration
            elif not cluster.public_access:
                report.status = "PASS"
                report.status_extended = (
                    f"Kafka cluster {cluster.name} is not publicly accessible."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_mutual_tls_authentication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_mutual_tls_authentication_enabled/kafka_cluster_mutual_tls_authentication_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kafka_cluster_mutual_tls_authentication_enabled",
  "CheckTitle": "Kafka cluster has TLS authentication enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access"
  ],
  "ServiceName": "kafka",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsMskCluster",
  "Description": "Amazon MSK clusters enforce **client authentication** on client-to-broker connections. Serverless clusters use TLS-based authentication by default; provisioned clusters must have **mutual TLS (mTLS)** explicitly enabled.",
  "Risk": "Without **mTLS**, adversaries can impersonate clients or intercept sessions, compromising **confidentiality** and **integrity**. Unauthorized producers/consumers can read or alter topics, poison data streams, and flood brokers, degrading **availability** and impacting downstream systems.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MSK/enable-mutual-tls-authentication-for-kafka-clients.html",
    "https://docs.aws.amazon.com/msk/latest/developerguide/msk-update-security.html",
    "https://docs.aws.amazon.com/msk/latest/developerguide/msk-authentication.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kafka update-security --cluster-arn <CLUSTER_ARN> --current-version <CURRENT_VERSION> --client-authentication 'Tls={CertificateAuthorityArnList=[\"<ACM_PCA_ARN>\"]}' --encryption-info 'EncryptionInTransit={ClientBroker=TLS}'",
      "NativeIaC": "```yaml\n# CloudFormation: Enable mTLS for an MSK cluster\nResources:\n  <example_resource_name>:\n    Type: AWS::MSK::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      KafkaVersion: <example_kafka_version>\n      NumberOfBrokerNodes: 2\n      BrokerNodeGroupInfo:\n        InstanceType: kafka.m5.large\n        ClientSubnets:\n          - <subnet_id_1>\n          - <subnet_id_2>\n      ClientAuthentication:\n        Tls:\n          CertificateAuthorityArnList:\n            - <acm_pca_arn>  # CRITICAL: Enables mutual TLS using this Private CA\n      EncryptionInfo:\n        EncryptionInTransit:\n          ClientBroker: TLS  # CRITICAL: Required when enabling mTLS\n```",
      "Other": "1. In the AWS Console, go to Amazon MSK > Clusters and select the provisioned cluster (state must be ACTIVE)\n2. Choose Actions > Update security (or Security > Edit)\n3. Under Client authentication, enable TLS and add your AWS Private CA ARN(s)\n4. Under Encryption in transit, set Client-broker to TLS\n5. Save/Update and wait for the update to complete",
      "Terraform": "```hcl\n# Terraform: Enable mTLS for an MSK cluster\nresource \"aws_msk_cluster\" \"<example_resource_name>\" {\n  cluster_name           = \"<example_resource_name>\"\n  kafka_version          = \"<example_kafka_version>\"\n  number_of_broker_nodes = 2\n\n  broker_node_group_info {\n    instance_type  = \"kafka.m5.large\"\n    client_subnets = [\"<subnet_id_1>\", \"<subnet_id_2>\"]\n  }\n\n  client_authentication {\n    tls {\n      certificate_authority_arns = [\"<acm_pca_arn>\"]  # CRITICAL: Enables mutual TLS with this Private CA\n    }\n  }\n\n  encryption_info {\n    encryption_in_transit {\n      client_broker = \"TLS\"  # CRITICAL: Required when enabling mTLS\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **mutual TLS** for client-broker traffic and disable `PLAINTEXT` listeners. Issue short-lived client certificates from a managed CA with rotation. Apply **least privilege** using Kafka ACLs, restrict network access to trusted sources, and monitor authentication events as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/kafka_cluster_mutual_tls_authentication_enabled"
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

---[FILE: kafka_cluster_mutual_tls_authentication_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_mutual_tls_authentication_enabled/kafka_cluster_mutual_tls_authentication_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kafka.kafka_client import kafka_client


class kafka_cluster_mutual_tls_authentication_enabled(Check):
    def execute(self):
        findings = []

        for cluster in kafka_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = f"Kafka cluster '{cluster.name}' does not have mutual TLS authentication enabled."

            # Serverless clusters always have TLS authentication enabled by default
            if cluster.kafka_version == "SERVERLESS":
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' is serverless and always has TLS authentication enabled by default."
            # For provisioned clusters, check the TLS configuration
            elif cluster.tls_authentication:
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' has mutual TLS authentication enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_unrestricted_access_disabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_unrestricted_access_disabled/kafka_cluster_unrestricted_access_disabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kafka_cluster_unrestricted_access_disabled",
  "CheckTitle": "Kafka cluster requires authentication",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "kafka",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsMskCluster",
  "Description": "Amazon MSK clusters are evaluated for **unauthenticated client access**. Serverless clusters inherently require authentication; provisioned clusters are checked for configurations that allow **unrestricted connections** rather than authenticated clients.",
  "Risk": "Allowing **unauthenticated access** lets anyone connect and:\n- Read sensitive topics (confidentiality)\n- Publish or alter data (integrity)\n- Overload brokers and consumers (availability)\n\nThis enables message exfiltration, stream poisoning, and abuse of trusted data pipelines.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/msk/latest/developerguide/msk-configure-security.html",
    "https://docs.aws.amazon.com/msk/latest/developerguide/security.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MSK/unrestricted-access-to-brokers.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kafka update-security --cluster-arn <example_resource_arn> --current-version <example_current_version> --client-authentication 'Unauthenticated={Enabled=false}'",
      "NativeIaC": "```yaml\n# CloudFormation: Disable unauthenticated client access for MSK\nResources:\n  <example_resource_name>:\n    Type: AWS::MSK::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      KafkaVersion: <example_kafka_version>\n      NumberOfBrokerNodes: 2\n      BrokerNodeGroupInfo:\n        InstanceType: <example_instance_type>\n        ClientSubnets:\n          - <subnet_id_1>\n          - <subnet_id_2>\n        StorageInfo:\n          EbsStorageInfo:\n            VolumeSize: 1000\n      ClientAuthentication:\n        Unauthenticated:\n          Enabled: false  # CRITICAL: Disables unauthenticated client access\n```",
      "Other": "1. Open the AWS Console and go to Amazon MSK\n2. Select your cluster and open the Security tab\n3. Click Edit under Client authentication\n4. Turn off/clear Unauthenticated access\n5. Save changes to apply the update",
      "Terraform": "```hcl\n# Terraform: Disable unauthenticated client access for MSK\nresource \"aws_msk_cluster\" \"<example_resource_name>\" {\n  cluster_name           = \"<example_resource_name>\"\n  kafka_version          = \"<example_kafka_version>\"\n  number_of_broker_nodes = 2\n\n  broker_node_group_info {\n    instance_type   = \"<example_instance_type>\"\n    client_subnets  = [\"<subnet_id_1>\", \"<subnet_id_2>\"]\n    ebs_volume_size = 1000\n  }\n\n  client_authentication {\n    unauthenticated = false  # CRITICAL: Disables unauthenticated client access\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Disable **unauthenticated access** and require **strong client authentication** (mTLS or IAM/SASL).\n- Enforce **least privilege** with scoped ACLs\n- Restrict network paths via private connectivity and tight security groups\n- Encrypt in transit, monitor access, and rotate credentials regularly",
      "Url": "https://hub.prowler.com/check/kafka_cluster_unrestricted_access_disabled"
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

---[FILE: kafka_cluster_unrestricted_access_disabled.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_unrestricted_access_disabled/kafka_cluster_unrestricted_access_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kafka.kafka_client import kafka_client


class kafka_cluster_unrestricted_access_disabled(Check):
    def execute(self):
        findings = []

        for cluster in kafka_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "FAIL"
            report.status_extended = (
                f"Kafka cluster '{cluster.name}' has unrestricted access enabled."
            )

            # Serverless clusters always require authentication by default
            if cluster.kafka_version == "SERVERLESS":
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' is serverless and always requires authentication by default."
            # For provisioned clusters, check the unauthenticated access configuration
            elif not cluster.unauthentication_access:
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' does not have unrestricted access enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_uses_latest_version.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_uses_latest_version/kafka_cluster_uses_latest_version.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kafka_cluster_uses_latest_version",
  "CheckTitle": "MSK cluster uses the latest Kafka version or is serverless with AWS-managed version",
  "CheckType": [
    "Software and Configuration Checks/Patch Management",
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "kafka",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsMskCluster",
  "Description": "**Amazon MSK clusters** are evaluated for use of the latest supported **Apache Kafka version**. Provisioned clusters are compared to the most recent release, while **serverless clusters** are treated as automatically managed for versioning.",
  "Risk": "Outdated Kafka enables exploitation of known flaws and weak cryptography, risking data exposure or tampering (**confidentiality/integrity**). Missing fixes increase broker crashes and partition instability (**availability**). After end of support, silent auto-upgrades can trigger unexpected behavior and compatibility issues.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/msk/latest/developerguide/version-support.html#version-upgrades",
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-databases.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/MSK/enable-apache-kafka-latest-security-features.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kafka update-cluster-kafka-version --cluster-arn <example_resource_id> --current-version <current_version> --target-kafka-version <latest_version>",
      "NativeIaC": "```yaml\n# CloudFormation: Upgrade MSK cluster to latest Kafka version\nResources:\n  <example_resource_name>:\n    Type: AWS::MSK::Cluster\n    Properties:\n      ClusterName: <example_resource_name>\n      KafkaVersion: <latest_version>  # CRITICAL: set to the latest Kafka version to pass the check\n      NumberOfBrokerNodes: 2\n      BrokerNodeGroupInfo:\n        InstanceType: kafka.m5.large\n        ClientSubnets:\n          - <example_resource_id>\n          - <example_resource_id>\n```",
      "Other": "1. Open the AWS Management Console and go to Amazon MSK\n2. Select your cluster and choose Actions > Update cluster\n3. In Kafka version, select the latest available version\n4. Review and start the upgrade (Update/Start upgrade)\n5. Wait until the operation completes and the cluster status returns to Active",
      "Terraform": "```hcl\n# Terraform: Upgrade MSK cluster to latest Kafka version\nresource \"aws_msk_cluster\" \"<example_resource_name>\" {\n  cluster_name           = \"<example_resource_name>\"\n  kafka_version          = \"<latest_version>\"  # CRITICAL: set to the latest Kafka version to pass the check\n  number_of_broker_nodes = 2\n\n  broker_node_group_info {\n    instance_type  = \"kafka.m5.large\"\n    client_subnets = [\"<example_resource_id>\", \"<example_resource_id>\"]\n\n    storage_info {\n      ebs_storage_info { volume_size = 1000 }\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt a controlled upgrade strategy:\n- Track MSK version support and upgrade before end of support\n- Test in staging and schedule maintenance windows\n- Use blue/green or rolling upgrades to reduce downtime\n- Validate client compatibility and security settings\n- Consider serverless MSK if automatic versioning fits your risk model",
      "Url": "https://hub.prowler.com/check/kafka_cluster_uses_latest_version"
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

---[FILE: kafka_cluster_uses_latest_version.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_cluster_uses_latest_version/kafka_cluster_uses_latest_version.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kafka.kafka_client import kafka_client


class kafka_cluster_uses_latest_version(Check):
    def execute(self):
        findings = []

        for cluster in kafka_client.clusters.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"Kafka cluster '{cluster.name}' is using the latest version."
            )

            # Serverless clusters don't have specific Kafka versions - AWS manages them automatically
            if cluster.kafka_version == "SERVERLESS":
                report.status = "PASS"
                report.status_extended = f"Kafka cluster '{cluster.name}' is serverless and AWS automatically manages the Kafka version."
            # For provisioned clusters, check if they're using the latest version
            elif cluster.kafka_version != kafka_client.kafka_versions[-1].version:
                report.status = "FAIL"
                report.status_extended = (
                    f"Kafka cluster '{cluster.name}' is not using the latest version."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kafka_connector_in_transit_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_connector_in_transit_encryption_enabled/kafka_connector_in_transit_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kafka_connector_in_transit_encryption_enabled",
  "CheckTitle": "MSK Connect connector has encryption in transit enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "kafka",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**MSK Connect connectors** are evaluated for **in-transit encryption** using `TLS` on client connections to Kafka brokers and connected systems.",
  "Risk": "Without **TLS**, data streams can be **intercepted** or **modified** in transit. Attackers on the path can perform **man-in-the-middle**, replay, or message **tampering**, exposing records and secrets. This degrades **confidentiality** and **integrity** and can enable unauthorized access to downstream systems.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/msk/latest/developerguide/msk-connect.html",
    "https://docs.aws.amazon.com/msk/latest/developerguide/mkc-create-connector-intro.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: MSK Connect connector with in-transit encryption enabled\nResources:\n  <example_resource_name>:\n    Type: AWS::KafkaConnect::Connector\n    Properties:\n      ConnectorName: <example_resource_name>\n      KafkaCluster:\n        ApacheKafkaCluster:\n          BootstrapServers: <BOOTSTRAP_SERVERS>\n          Vpc:\n            SecurityGroups: [<example_resource_id>]\n            Subnets: [<example_resource_id>]\n      KafkaClusterClientAuthentication:\n        AuthenticationType: NONE\n      KafkaClusterEncryptionInTransit:\n        EncryptionType: TLS  # Critical: enables TLS encryption in transit\n      KafkaConnectVersion: <KAFKA_CONNECT_VERSION>\n      Plugins:\n        - CustomPlugin:\n            CustomPluginArn: <example_resource_id>\n            Revision: 1\n      Capacity:\n        ProvisionedCapacity:\n          McuCount: 1\n          WorkerCount: 1\n      ServiceExecutionRoleArn: <example_resource_id>\n      ConnectorConfiguration:\n        connector.class: <CONNECTOR_CLASS>\n        tasks.max: \"1\"\n```",
      "Other": "1. In the AWS console, go to Amazon MSK > MSK Connect > Connectors\n2. Select the non-TLS connector and choose Delete (encryption setting can't be changed)\n3. Choose Create connector and select your custom plugin and cluster\n4. In the Security section, set Encryption in transit to TLS (required)\n5. Complete other required fields and Create the connector",
      "Terraform": "```hcl\n# Terraform: MSK Connect connector with in-transit encryption enabled\nresource \"aws_mskconnect_connector\" \"<example_resource_name>\" {\n  name                  = \"<example_resource_name>\"\n  kafkaconnect_version  = \"<KAFKA_CONNECT_VERSION>\"\n\n  kafka_cluster {\n    apache_kafka_cluster {\n      bootstrap_servers = \"<BOOTSTRAP_SERVERS>\"\n      vpc {\n        security_groups = [\"<example_resource_id>\"]\n        subnets         = [\"<example_resource_id>\"]\n      }\n    }\n  }\n\n  kafka_cluster_client_authentication {\n    authentication_type = \"NONE\"\n  }\n\n  kafka_cluster_encryption_in_transit {\n    encryption_type = \"TLS\"  # Critical: enables TLS encryption in transit\n  }\n\n  capacity {\n    provisioned_capacity {\n      mcu_count    = 1\n      worker_count = 1\n    }\n  }\n\n  service_execution_role_arn = \"<example_resource_id>\"\n\n  connector_configuration = {\n    \"connector.class\" = \"<CONNECTOR_CLASS>\"\n    \"tasks.max\"       = \"1\"\n  }\n\n  plugin {\n    custom_plugin {\n      arn      = \"<example_resource_id>\"\n      revision = 1\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Require **TLS** for all connector communications and disallow plaintext. Prefer private connectivity, validate certificates, and use modern cipher suites. Pair with **mutual authentication** and **least privilege** roles for defense-in-depth. Regularly review connector configs to avoid non-TLS endpoints.",
      "Url": "https://hub.prowler.com/check/kafka_connector_in_transit_encryption_enabled"
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

---[FILE: kafka_connector_in_transit_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/kafka/kafka_connector_in_transit_encryption_enabled/kafka_connector_in_transit_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kafka.kafkaconnect_client import kafkaconnect_client


class kafka_connector_in_transit_encryption_enabled(Check):
    def execute(self):
        findings = []

        for connector in kafkaconnect_client.connectors.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=connector)
            report.status = "FAIL"
            report.status_extended = f"Kafka connector {connector.name} does not have encryption in transit enabled."

            if connector.encryption_in_transit == "TLS":
                report.status = "PASS"
                report.status_extended = f"Kafka connector {connector.name} has encryption in transit enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kinesis_client.py]---
Location: prowler-master/prowler/providers/aws/services/kinesis/kinesis_client.py

```python
from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis
from prowler.providers.common.provider import Provider

kinesis_client = Kinesis(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
