---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 288
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 288 of 867)

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

---[FILE: glue_data_catalogs_connection_passwords_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_data_catalogs_connection_passwords_encryption_enabled/glue_data_catalogs_connection_passwords_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_data_catalogs_connection_passwords_encryption_enabled",
  "CheckTitle": "Glue data catalog connection password is encrypted with a KMS key",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**AWS Glue Data Catalog** settings for **connection password encryption** are evaluated to confirm an AWS KMS key is configured to encrypt passwords stored in connection properties.",
  "Risk": "Unencrypted connection passwords can be read from the catalog or responses, letting attackers or over-privileged users obtain database credentials. This jeopardizes confidentiality of linked data stores, enables unauthorized modifications, and can facilitate lateral movement across environments.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-security.html",
    "https://docs.aws.amazon.com/glue/latest/dg/encrypt-connection-passwords.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws glue put-data-catalog-encryption-settings --data-catalog-encryption-settings '{\"ConnectionPasswordEncryption\":{\"ReturnConnectionPasswordEncrypted\":true,\"AwsKmsKeyId\":\"<kms_key_arn>\"}}'",
      "NativeIaC": "```yaml\n# CloudFormation: enable Glue Data Catalog connection password encryption\nResources:\n  <example_resource_name>:\n    Type: AWS::Glue::DataCatalogEncryptionSettings\n    Properties:\n      DataCatalogEncryptionSettings:\n        ConnectionPasswordEncryption:\n          ReturnConnectionPasswordEncrypted: true  # Critical: encrypts connection passwords\n          KmsKeyId: <kms_key_arn>  # Critical: KMS key used for encryption\n```",
      "Other": "1. In the AWS Console, go to AWS Glue\n2. Click Settings (left menu)\n3. Under Data catalog settings, check Encrypt connection passwords\n4. Select your KMS key (symmetric CMK)\n5. Click Save",
      "Terraform": "```hcl\n# Enable Glue Data Catalog connection password encryption\nresource \"aws_glue_data_catalog_encryption_settings\" \"<example_resource_name>\" {\n  data_catalog_encryption_settings {\n    # Critical: enables password encryption with a KMS key\n    connection_password_encryption {\n      return_connection_password_encrypted = true\n      aws_kms_key_id                       = \"<kms_key_arn>\"\n    }\n\n    # Required block for this resource; keep minimal\n    encryption_at_rest {\n      catalog_encryption_mode = \"DISABLED\"\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **connection password encryption** in the Data Catalog with a customer-managed KMS key.\n- Apply **least privilege** to the KMS key and Glue roles\n- Prefer keeping responses encrypted (`ReturnConnectionPasswordEncrypted`)\n- Rotate keys and monitor access for **defense in depth**",
      "Url": "https://hub.prowler.com/check/glue_data_catalogs_connection_passwords_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_data_catalogs_connection_passwords_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_data_catalogs_connection_passwords_encryption_enabled/glue_data_catalogs_connection_passwords_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_data_catalogs_connection_passwords_encryption_enabled(Check):
    def execute(self):
        findings = []
        for data_catalog in glue_client.data_catalogs.values():
            # Check only if there are Glue Tables
            if data_catalog.tables or glue_client.provider.scan_unused_services:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=data_catalog
                )
                report.resource_id = glue_client.audited_account
                report.resource_arn = glue_client._get_data_catalog_arn_template(
                    data_catalog.region
                )
                report.status = "FAIL"
                report.status = "FAIL"
                report.status_extended = (
                    "Glue data catalog connection password is not encrypted."
                )
                if (
                    data_catalog.encryption_settings
                    and data_catalog.encryption_settings.password_encryption
                ):
                    report.status = "PASS"
                    report.status_extended = f"Glue data catalog connection password is encrypted with KMS key {data_catalog.encryption_settings.password_kms_id}."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_data_catalogs_metadata_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_data_catalogs_metadata_encryption_enabled/glue_data_catalogs_metadata_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_data_catalogs_metadata_encryption_enabled",
  "CheckTitle": "Glue Data Catalog metadata is encrypted with KMS",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Glue Data Catalog** metadata is encrypted at rest when catalog settings use **SSE-KMS** with a KMS key.\n\nCatalogs that do not configure `SSE-KMS` for metadata are considered unencrypted.",
  "Risk": "Unencrypted catalog metadata exposes schemas, partitions, and data locations, reducing **confidentiality**.\n\nAdversaries or over-privileged users can conduct **reconnaissance** and plan lateral movement; tampering with definitions can corrupt queries and results, impacting **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/encrypt-glue-data-catalog.html",
    "https://docs.amazonaws.cn/en_us/athena/latest/ug/encryption.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Glue/data-catalog-encryption-at-rest-with-cmk.html",
    "https://support.icompaas.com/support/solutions/articles/62000233381-ensure-glue-data-catalogs-are-not-publicly-accessible-"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws glue put-data-catalog-encryption-settings --data-catalog-encryption-settings '{\"EncryptionAtRest\":{\"CatalogEncryptionMode\":\"SSE-KMS\"}}'",
      "NativeIaC": "```yaml\n# Enable Glue Data Catalog metadata encryption with KMS\nResources:\n  <example_resource_name>:\n    Type: AWS::Glue::DataCatalogEncryptionSettings\n    Properties:\n      DataCatalogEncryptionSettings:\n        EncryptionAtRest:\n          CatalogEncryptionMode: SSE-KMS  # Critical: enables KMS encryption for catalog metadata\n```",
      "Other": "1. In the AWS Console, go to AWS Glue\n2. Open Data Catalog > Settings\n3. Under Security configuration and encryption, check Metadata encryption\n4. Leave the default AWS managed key selected (or choose a KMS key)\n5. Click Save",
      "Terraform": "```hcl\n# Enable Glue Data Catalog metadata encryption with KMS\nresource \"aws_glue_data_catalog_encryption_settings\" \"<example_resource_name>\" {\n  data_catalog_encryption_settings {\n    encryption_at_rest {\n      catalog_encryption_mode = \"SSE-KMS\" # Critical: turns on KMS encryption for catalog metadata\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable metadata encryption with **`SSE-KMS`**, preferably using a **customer-managed KMS key** for control and rotation.\n\nApply **least privilege** to KMS and catalog access, restrict who can change settings, and monitor key usage. Use **defense in depth** by encrypting related analytics assets consistently.",
      "Url": "https://hub.prowler.com/check/glue_data_catalogs_metadata_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_data_catalogs_metadata_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_data_catalogs_metadata_encryption_enabled/glue_data_catalogs_metadata_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_data_catalogs_metadata_encryption_enabled(Check):
    def execute(self):
        findings = []
        for data_catalog in glue_client.data_catalogs.values():
            # Check only if there are Glue Tables
            if data_catalog.tables or glue_client.provider.scan_unused_services:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=data_catalog
                )
                report.resource_id = glue_client.audited_account
                report.resource_arn = glue_client._get_data_catalog_arn_template(
                    data_catalog.region
                )
                report.status = "FAIL"
                report.status_extended = (
                    "Glue data catalog settings have metadata encryption disabled."
                )
                if (
                    data_catalog.encryption_settings
                    and data_catalog.encryption_settings.mode == "SSE-KMS"
                ):
                    report.status = "PASS"
                    report.status_extended = f"Glue data catalog settings have metadata encryption enabled with KMS key {data_catalog.encryption_settings.kms_id}."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_data_catalogs_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_data_catalogs_not_publicly_accessible/glue_data_catalogs_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_data_catalogs_not_publicly_accessible",
  "CheckTitle": "Glue Data Catalog is not publicly accessible via its resource policy",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**AWS Glue Data Catalog** resource policies are assessed for configurations that expose the catalog to anyone, such as `Principal: *`, broad resource scopes, or permissive conditions.\n\nThe finding highlights catalogs made public through overly permissive resource-based access.",
  "Risk": "Public catalog access lets unauthorized actors enumerate schemas, S3 locations, and connection metadata, weakening **confidentiality**. If writes are exposed, attackers can alter databases/tables, corrupt lineage, and disrupt jobs and queries, harming **integrity** and **availability**, and enabling lateral movement to data stores.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/security_iam_service-with-iam.html?icmpid=docs_console_unmapped#security_iam_service-with-iam-resource-based-policies",
    "https://docs.aws.amazon.com/glue/latest/dg/cross-account-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws glue delete-resource-policy",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Console and open the Glue service\n2. In the left menu, click Settings\n3. Under Data catalog settings > Permissions, click Edit resource policy\n4. Remove any statement that has Principal set to * (public) or AWS: \"*\"; or delete the entire policy\n5. Click Save",
      "Terraform": "```hcl\nresource \"aws_glue_resource_policy\" \"<example_resource_name>\" {\n  policy = jsonencode({\n    Version   = \"2012-10-17\",\n    Statement = [\n      {\n        Effect    = \"Allow\",\n        Principal = { AWS = \"arn:aws:iam::<ACCOUNT_ID>:root\" } # Critical: restricts to your account, removing any public (*) access\n        Action    = \"glue:*\",\n        Resource  = \"arn:aws:glue:<REGION>:<ACCOUNT_ID>:catalog\"\n      }\n    ]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **least privilege** on catalog resource policies:\n- Avoid `Principal: *` and wildcards\n- Grant only required actions to explicit principals\n- Prefer identity-based access or Lake Formation for sharing\n- Limit scope with precise ARNs/conditions and monitor changes for **defense in depth**",
      "Url": "https://hub.prowler.com/check/glue_data_catalogs_not_publicly_accessible"
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

---[FILE: glue_data_catalogs_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_data_catalogs_not_publicly_accessible/glue_data_catalogs_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class glue_data_catalogs_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for data_catalog in glue_client.data_catalogs.values():
            if data_catalog.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=data_catalog)
            report.resource_id = glue_client.audited_account
            report.resource_arn = glue_client._get_data_catalog_arn_template(
                data_catalog.region
            )
            report.status = "PASS"
            report.status_extended = "Glue Data Catalog is not publicly accessible."
            if is_policy_public(
                data_catalog.policy,
                glue_client.audited_account,
            ):
                report.status = "FAIL"
                report.status_extended = "Glue Data Catalog is publicly accessible due to its resource policy."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_development_endpoints_cloudwatch_logs_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_development_endpoints_cloudwatch_logs_encryption_enabled/glue_development_endpoints_cloudwatch_logs_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_development_endpoints_cloudwatch_logs_encryption_enabled",
  "CheckTitle": "Glue development endpoint has CloudWatch Logs encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Glue development endpoints** are assessed for an associated **security configuration** that enables **CloudWatch Logs encryption**. It confirms the endpoint references a configuration and that log encryption is not `DISABLED`.",
  "Risk": "Unencrypted Glue logs erode **confidentiality**: credentials, connection strings, and data samples may be readable to unintended principals, enabling **lateral movement**.\nLack of KMS-backed encryption weakens **auditability** and **separation of duties**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/console-security-configurations.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Glue/cloud-watch-logs-encryption-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Glue Security Configuration with CloudWatch Logs encryption enabled\nResources:\n  <example_resource_name>:\n    Type: AWS::Glue::SecurityConfiguration\n    Properties:\n      Name: <example_resource_name>\n      EncryptionConfiguration:\n        CloudWatchEncryption:\n          CloudWatchEncryptionMode: SSE-KMS  # Critical: enables CloudWatch Logs encryption\n          KmsKeyArn: <kms_key_arn>           # Critical: KMS key used for encrypting Glue logs\n```",
      "Other": "1. In the AWS Console, go to Glue > Security configurations > Add security configuration\n2. Enter a name and enable CloudWatch Logs encryption\n3. Select a KMS key (or enter its ARN) and click Create\n4. Go to Glue > Dev endpoints\n5. Create a new Dev endpoint (or delete and recreate the existing one) and select the new Security configuration\n6. Create the endpoint to apply the encryption",
      "Terraform": "```hcl\n# Glue Security Configuration with CloudWatch Logs encryption enabled\nresource \"aws_glue_security_configuration\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  encryption_configuration {\n    cloudwatch_encryption {\n      cloudwatch_encryption_mode = \"SSE-KMS\"  # Critical: enables CloudWatch Logs encryption\n      kms_key_arn                = \"<kms_key_arn>\"  # Critical: KMS key used for encrypting Glue logs\n    }\n\n    # Required blocks for valid config (kept minimal)\n    job_bookmarks_encryption { job_bookmarks_encryption_mode = \"DISABLED\" }\n    s3_encryption             { s3_encryption_mode             = \"DISABLED\" }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Attach a **security configuration** to all development endpoints with **CloudWatch Logs encryption** enabled using a tightly scoped **KMS key**.\nApply **least privilege** to key and log access, rotate keys, and standardize configs via IaC to enforce **defense in depth**.",
      "Url": "https://hub.prowler.com/check/glue_development_endpoints_cloudwatch_logs_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_development_endpoints_cloudwatch_logs_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_development_endpoints_cloudwatch_logs_encryption_enabled/glue_development_endpoints_cloudwatch_logs_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_development_endpoints_cloudwatch_logs_encryption_enabled(Check):
    def execute(self):
        findings = []
        for endpoint in glue_client.dev_endpoints:
            no_sec_configs = True
            report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)
            for sec_config in glue_client.security_configs:
                if sec_config.name == endpoint.security:
                    no_sec_configs = False
                    report.status = "FAIL"
                    report.status_extended = f"Glue development endpoint {endpoint.name} does not have CloudWatch logs encryption enabled."
                    if sec_config.cw_encryption != "DISABLED":
                        report.status = "PASS"
                        report.status_extended = f"Glue development endpoint {endpoint.name} has CloudWatch logs encryption enabled with key {sec_config.cw_key_arn}."
            if no_sec_configs:
                report.status = "FAIL"
                report.status_extended = f"Glue development endpoint {endpoint.name} does not have security configuration."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_development_endpoints_job_bookmark_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_development_endpoints_job_bookmark_encryption_enabled/glue_development_endpoints_job_bookmark_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_development_endpoints_job_bookmark_encryption_enabled",
  "CheckTitle": "Glue development endpoint has Job Bookmark encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Glue development endpoints** are assessed for an attached **security configuration** where **job bookmark encryption** is enabled. Endpoints lacking a security configuration are also identified.",
  "Risk": "Unencrypted job bookmarks stored in S3 can be read or altered, exposing dataset paths, partitions, and processing state. This enables data discovery, state tampering, and replay/skip of workloads, impacting **confidentiality**, **integrity**, and **availability** of ETL pipelines.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/console-security-configurations.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Glue/job-bookmark-encryption-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Job Bookmark encryption and attach to the Dev Endpoint\nResources:\n  GlueSecurityConfiguration:\n    Type: AWS::Glue::SecurityConfiguration\n    Properties:\n      Name: <example_resource_name>\n      EncryptionConfiguration:\n        JobBookmarksEncryption:\n          JobBookmarksEncryptionMode: CSE-KMS  # Critical: enables Job Bookmark encryption\n          KmsKeyArn: <example_kms_key_arn>     # Critical: KMS key used for Job Bookmark encryption\n\n  GlueDevEndpoint:\n    Type: AWS::Glue::DevEndpoint\n    Properties:\n      RoleArn: <example_role_arn>\n      SecurityConfiguration: !Ref GlueSecurityConfiguration  # Critical: attach the security configuration to the Dev Endpoint\n```",
      "Other": "1. In the AWS Console, go to Glue > Security configurations > Add security configuration\n2. Enter a name, then under Advanced settings enable Job bookmark encryption and select a KMS key (or enter its ARN); Save\n3. Go to Glue > Dev endpoints\n4. Create a new Dev endpoint (or recreate the existing one) and set Security configuration to the configuration created in step 2\n5. Create the endpoint to apply the setting",
      "Terraform": "```hcl\n# Terraform: Enable Job Bookmark encryption and attach to the Dev Endpoint\nresource \"aws_glue_security_configuration\" \"<example_resource_name>\" {\n  name = \"<example_resource_name>\"\n\n  encryption_configuration {\n    job_bookmarks_encryption {\n      job_bookmarks_encryption_mode = \"CSE-KMS\"   # Critical: enables Job Bookmark encryption\n      kms_key_arn                   = \"<example_kms_key_arn>\"  # Critical: KMS key used for Job Bookmark encryption\n    }\n  }\n}\n\nresource \"aws_glue_dev_endpoint\" \"<example_resource_name>\" {\n  name                   = \"<example_resource_name>\"\n  role_arn               = \"<example_role_arn>\"\n  security_configuration = aws_glue_security_configuration.<example_resource_name>.name  # Critical: attach the security configuration\n}\n```"
    },
    "Recommendation": {
      "Text": "Attach a **security configuration** to each development endpoint and enable **job bookmark encryption** with a managed KMS key. Apply **least privilege** to S3 and KMS, rotate keys, and align logs and data stores with consistent encryption for **defense in depth**. Regularly audit endpoints for missing or outdated configurations.",
      "Url": "https://hub.prowler.com/check/glue_development_endpoints_job_bookmark_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_development_endpoints_job_bookmark_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_development_endpoints_job_bookmark_encryption_enabled/glue_development_endpoints_job_bookmark_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_development_endpoints_job_bookmark_encryption_enabled(Check):
    def execute(self):
        findings = []
        for endpoint in glue_client.dev_endpoints:
            no_sec_configs = True
            report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)
            for sec_config in glue_client.security_configs:
                if sec_config.name == endpoint.security:
                    no_sec_configs = False
                    report.status = "FAIL"
                    report.status_extended = f"Glue development endpoint {endpoint.name} does not have Job Bookmark encryption enabled."
                    if sec_config.jb_encryption != "DISABLED":
                        report.status = "PASS"
                        report.status_extended = f"Glue development endpoint {endpoint.name} has Job Bookmark encryption enabled with key {sec_config.jb_key_arn}."
            if no_sec_configs:
                report.status = "FAIL"
                report.status_extended = f"Glue development endpoint {endpoint.name} does not have security configuration."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_development_endpoints_s3_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_development_endpoints_s3_encryption_enabled/glue_development_endpoints_s3_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_development_endpoints_s3_encryption_enabled",
  "CheckTitle": "Glue development endpoint has S3 encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Glue development endpoints** are evaluated for an attached **security configuration** with **S3 encryption**. Endpoints lacking a security configuration, or with `s3_encryption` set to `DISABLED`, are flagged by this check.",
  "Risk": "Unencrypted S3 writes from dev endpoints leave ETL outputs, temp data, and scripts readable at rest. A misconfigured bucket or stolen creds can expose sensitive content, harming **confidentiality** and triggering compliance issues.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Glue/s3-encryption-enabled.html",
    "https://docs.aws.amazon.com/glue/latest/dg/encryption-security-configuration.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Glue Dev Endpoint with S3 encryption via Security Configuration\nResources:\n  SecurityConfig:\n    Type: AWS::Glue::SecurityConfiguration\n    Properties:\n      Name: <example_resource_name>\n      EncryptionConfiguration:\n        S3Encryptions:\n          - S3EncryptionMode: SSE-S3  # CRITICAL: enables S3 encryption for the security configuration\n\n  DevEndpoint:\n    Type: AWS::Glue::DevEndpoint\n    Properties:\n      EndpointName: <example_resource_name>\n      RoleArn: <example_role_arn>\n      SecurityConfiguration: !Ref SecurityConfig  # CRITICAL: attaches the encrypted security configuration to the dev endpoint\n```",
      "Other": "1. In the AWS Console, go to AWS Glue > Security configurations > Create security configuration\n2. Under S3 encryption, select Server-side encryption (SSE-S3) and save\n3. Go to AWS Glue > Development endpoints > Create development endpoint\n4. Fill required fields and set Security configuration to the one created in step 2\n5. Create the endpoint and delete the old endpoint (without encryption) if it exists",
      "Terraform": "```hcl\n# Terraform: Glue Dev Endpoint with S3 encryption\nresource \"aws_glue_security_configuration\" \"secure\" {\n  name = \"<example_resource_name>\"\n  encryption_configuration {\n    s3_encryption {\n      s3_encryption_mode = \"SSE-S3\"  # CRITICAL: enables S3 encryption\n    }\n  }\n}\n\nresource \"aws_glue_dev_endpoint\" \"dev\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_role_arn>\"\n\n  security_configuration = aws_glue_security_configuration.secure.name  # CRITICAL: attaches encrypted security configuration\n}\n```"
    },
    "Recommendation": {
      "Text": "Attach a **Glue security configuration** to each dev endpoint with **S3 encryption** enabled; prefer `SSE-KMS` with customer-managed keys. Enforce **least privilege** on IAM and KMS key policies, and extend encryption to logs and bookmarks for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/glue_development_endpoints_s3_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_development_endpoints_s3_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_development_endpoints_s3_encryption_enabled/glue_development_endpoints_s3_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_development_endpoints_s3_encryption_enabled(Check):
    def execute(self):
        findings = []
        for endpoint in glue_client.dev_endpoints:
            no_sec_configs = True
            report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)
            for sec_config in glue_client.security_configs:
                if sec_config.name == endpoint.security:
                    no_sec_configs = False
                    report.status = "FAIL"
                    report.status_extended = f"Glue development endpoint {endpoint.name} does not have S3 encryption enabled."
                    if sec_config.s3_encryption != "DISABLED":
                        report.status = "PASS"
                        report.status_extended = f"Glue development endpoint {endpoint.name} has S3 encryption enabled with key {sec_config.s3_key_arn}."
            if no_sec_configs:
                report.status = "FAIL"
                report.status_extended = f"Glue development endpoint {endpoint.name} does not have security configuration."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_amazon_s3_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_etl_jobs_amazon_s3_encryption_enabled/glue_etl_jobs_amazon_s3_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "glue_etl_jobs_amazon_s3_encryption_enabled",
  "CheckTitle": "Glue job has S3 encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark",
    "Effects/Data Exposure"
  ],
  "ServiceName": "glue",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**AWS Glue ETL jobs** are validated to use **Amazon S3 at-rest encryption** (`SSE-S3` or `SSE-KMS`) when writing outputs, either through an attached security configuration or via job arguments. Jobs missing a security configuration or with S3 encryption disabled are identified.",
  "Risk": "Storing job outputs in S3 without **at-rest encryption** weakens **confidentiality**. Plaintext objects can be exposed via misconfigured bucket policies, compromised credentials, or media reuse, and lack **KMS key controls**, rotation, and audit trails-hindering incident response and compliance.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/glue/latest/dg/console-security-configurations.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Glue/s3-encryption-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Attach a Security Configuration with S3 encryption to a Glue job\nResources:\n  GlueSecurityConfiguration:\n    Type: AWS::Glue::SecurityConfiguration\n    Properties:\n      Name: <example_resource_name>\n      EncryptionConfiguration:\n        S3Encryptions:\n          - S3EncryptionMode: SSE-S3  # CRITICAL: Enables S3 encryption for Glue outputs\n\n  GlueJob:\n    Type: AWS::Glue::Job\n    Properties:\n      Name: <example_resource_name>\n      Role: <example_role_arn>\n      Command:\n        Name: glueetl\n        ScriptLocation: s3://<example_resource_name>/script.py\n      SecurityConfiguration: !Ref GlueSecurityConfiguration  # CRITICAL: Applies encrypted security configuration to the job\n```",
      "Other": "1. In the AWS Console, go to AWS Glue > Security configurations > Create security configuration\n2. Enable S3 encryption and choose SSE-S3 (or SSE-KMS with your key)\n3. Save the configuration\n4. Go to AWS Glue > Jobs > select your job > Edit\n5. Under Job details, set Security configuration to the encrypted configuration you created\n6. Save the job",
      "Terraform": "```hcl\n# Terraform: Attach a Security Configuration with S3 encryption to a Glue job\nresource \"aws_glue_security_configuration\" \"sec\" {\n  name = \"<example_resource_name>\"\n\n  s3_encryption {\n    s3_encryption_mode = \"SSE-S3\"  # CRITICAL: Enables S3 encryption for Glue outputs\n  }\n}\n\nresource \"aws_glue_job\" \"job\" {\n  name     = \"<example_resource_name>\"\n  role_arn = \"<example_role_arn>\"\n\n  command {\n    script_location = \"s3://<example_resource_name>/script.py\"\n  }\n\n  security_configuration = aws_glue_security_configuration.sec.name  # CRITICAL: Applies encrypted security configuration to the job\n}\n```"
    },
    "Recommendation": {
      "Text": "Require **S3 encryption** for all Glue jobs via security configurations, preferring **SSE-KMS**. Apply **least privilege** to KMS keys, restrict key usage and rotate regularly. Enforce defense-in-depth with bucket policies that require encrypted writes, and monitor with key and S3 access logs.",
      "Url": "https://hub.prowler.com/check/glue_etl_jobs_amazon_s3_encryption_enabled"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: glue_etl_jobs_amazon_s3_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/glue/glue_etl_jobs_amazon_s3_encryption_enabled/glue_etl_jobs_amazon_s3_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.glue.glue_client import glue_client


class glue_etl_jobs_amazon_s3_encryption_enabled(Check):
    def execute(self):
        findings = []
        for job in glue_client.jobs:
            no_sec_configs = True
            report = Check_Report_AWS(metadata=self.metadata(), resource=job)
            for sec_config in glue_client.security_configs:
                if sec_config.name == job.security:
                    no_sec_configs = False
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Glue job {job.name} does not have S3 encryption enabled."
                    )
                    if sec_config.s3_encryption != "DISABLED":
                        report.status = "PASS"
                        report.status_extended = f"Glue job {job.name} has S3 encryption enabled with key {sec_config.s3_key_arn}."
            if no_sec_configs:
                if job.arguments and job.arguments.get("--encryption-type") == "sse-s3":
                    report.status = "PASS"
                    report.status_extended = (
                        f"Glue job {job.name} has S3 encryption enabled."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Glue job {job.name} does not have security configuration."
                    )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

````
