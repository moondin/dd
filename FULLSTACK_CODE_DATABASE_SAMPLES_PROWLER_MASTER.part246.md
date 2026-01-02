---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 246
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 246 of 867)

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

---[FILE: cloudfront_distributions_default_root_object.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_default_root_object/cloudfront_distributions_default_root_object.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)


class cloudfront_distributions_default_root_object(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)

            if distribution.default_root_object:
                report.status = "PASS"
                report.status_extended = f"CloudFront Distribution {distribution.id} does have a default root object ({distribution.default_root_object}) configured."
            else:
                report.status = "FAIL"
                report.status_extended = f"CloudFront Distribution {distribution.id} does not have a default root object configured."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_field_level_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_field_level_encryption_enabled/cloudfront_distributions_field_level_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_field_level_encryption_enabled",
  "CheckTitle": "CloudFront distribution has Field Level Encryption enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "CloudFront distributions have the default cache behavior associated with **Field-Level Encryption** via `field_level_encryption_id`, targeting specified request fields for edge encryption.",
  "Risk": "Absent **field-level encryption**, sensitive inputs (PII, payment data, credentials) may surface in origin paths, logs, or middleware in plaintext. This undermines **confidentiality**, enables data exfiltration and insider misuse, and can lead to session or account compromise if tokens are captured.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/field-level-encryption-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront create-field-level-encryption-config --field-level-encryption-config file://fle-config.json && aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to add FieldLevelEncryptionId to DefaultCacheBehavior, then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Field Level Encryption on Default Cache Behavior\nResources:\n  FLEConfig:\n    Type: AWS::CloudFront::FieldLevelEncryptionConfig\n    Properties:\n      FieldLevelEncryptionConfig:\n        CallerReference: !Ref AWS::StackName\n        ContentTypeProfileConfig:\n          ForwardWhenContentTypeIsUnknown: true\n          ContentTypeProfiles:\n            Quantity: 0\n\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - DomainName: \"<example_resource_name>.s3.amazonaws.com\"\n            Id: \"<example_resource_id>\"\n            S3OriginConfig: {}\n        DefaultCacheBehavior:\n          TargetOriginId: \"<example_resource_id>\"\n          ViewerProtocolPolicy: redirect-to-https\n          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6\n          FieldLevelEncryptionId: !Ref FLEConfig  # Critical: enables FLE on the default cache behavior\n```",
      "Other": "1. In the AWS Console, go to CloudFront\n2. If you don't have a Field-level encryption configuration:\n   - In the left menu, click Public keys > Add public key (paste your RSA public key)\n   - Click Field-level encryption > Create profile (choose the public key and add fields to encrypt)\n   - Click Field-level encryption > Create configuration (set the profile as Default profile)\n3. Attach it to your distribution:\n   - Go to Distributions > select <example_resource_id>\n   - Choose Behaviors > select Default (*) > Edit\n   - Set Field-level encryption configuration to your created configuration\n   - Click Save changes and wait for deployment",
      "Terraform": "```hcl\n# Enable Field Level Encryption on Default Cache Behavior\nresource \"aws_cloudfront_field_level_encryption_config\" \"fle\" {\n  content_type_profile_config {\n    forward_when_content_type_is_unknown = true\n  }\n}\n\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  enabled = true\n\n  origin {\n    domain_name = \"<example_resource_name>.s3.amazonaws.com\"\n    origin_id   = \"<example_resource_id>\"\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"<example_resource_id>\"\n    viewer_protocol_policy = \"redirect-to-https\"\n    cache_policy_id        = \"658327ea-f89d-4fab-a63d-7e88639e58f6\"\n    field_level_encryption_id = aws_cloudfront_field_level_encryption_config.fle.id # Critical: enables FLE\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Field-Level Encryption** for sensitive request fields and bind it to relevant cache behaviors. Apply **least privilege** to decryption keys, rotate and monitor keys, and separate duties. As **defense in depth**, minimize data collection, avoid logging secrets, require HTTPS end-to-end, and validate inputs.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_field_level_encryption_enabled"
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

---[FILE: cloudfront_distributions_field_level_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_field_level_encryption_enabled/cloudfront_distributions_field_level_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)


class cloudfront_distributions_field_level_encryption_enabled(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)
            if (
                distribution.default_cache_config
                and distribution.default_cache_config.field_level_encryption_id
            ):
                report.status = "PASS"
                report.status_extended = f"CloudFront Distribution {distribution.id} has Field Level Encryption enabled."
            else:
                report.status = "FAIL"
                report.status_extended = f"CloudFront Distribution {distribution.id} has Field Level Encryption disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_geo_restrictions_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_geo_restrictions_enabled/cloudfront_distributions_geo_restrictions_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_geo_restrictions_enabled",
  "CheckTitle": "CloudFront distribution has Geo restrictions enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "**CloudFront distributions** have **geographic restrictions** configured to limit access by country using an allowlist or blocklist (`RestrictionType` not `none`).",
  "Risk": "Absent geo restrictions, content is globally reachable, enabling:\n- Access from sanctioned or unlicensed regions (confidentiality/compliance)\n- Broader bot abuse, scraping, and DDoS staging (availability)\n- More credential-stuffing and fraud attempts against apps",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://repost.aws/knowledge-center/cloudfront-geo-restriction",
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/georestrictions.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/geo-restriction.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to add Restrictions.GeoRestriction with RestrictionType: \"whitelist\" and Locations: [\"US\"], then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - DomainName: \"<example_origin_domain>\"\n            Id: \"<example_origin_id>\"\n        DefaultCacheBehavior:\n          TargetOriginId: \"<example_origin_id>\"\n          ViewerProtocolPolicy: allow-all\n          CachePolicyId: \"<example_cache_policy_id>\"\n        Restrictions:\n          GeoRestriction:\n            RestrictionType: whitelist  # CRITICAL: enables geo restrictions\n            Locations:                  # CRITICAL: at least one allowed country\n              - US\n```",
      "Other": "1. In the AWS Console, go to CloudFront > Distributions\n2. Select the target distribution\n3. Open the Security tab > Geographic restrictions > Edit\n4. Choose Allow list (or Block list)\n5. Add at least one country to the list\n6. Save changes",
      "Terraform": "```hcl\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  enabled = true\n\n  origins {\n    domain_name = \"<example_origin_domain>\"\n    origin_id   = \"<example_origin_id>\"\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"<example_origin_id>\"\n    viewer_protocol_policy = \"allow-all\"\n    cache_policy_id        = \"<example_cache_policy_id>\"\n  }\n\n  restrictions {\n    geo_restriction {\n      restriction_type = \"whitelist\" # CRITICAL: enables geo restrictions\n      locations        = [\"US\"]      # CRITICAL: at least one allowed country\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** to distribution scope: enable geo restrictions with a country **allowlist** where feasible, or maintain a precise blocklist aligned to legal, licensing, and threat models.\n\nLayer **defense in depth**: use WAF/bot controls, signed URLs or cookies, and monitoring to detect abuse and configuration drift.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_geo_restrictions_enabled"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Security"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_geo_restrictions_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_geo_restrictions_enabled/cloudfront_distributions_geo_restrictions_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)
from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    GeoRestrictionType,
)


class cloudfront_distributions_geo_restrictions_enabled(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)

            if distribution.geo_restriction_type == GeoRestrictionType.none:
                report.status = "FAIL"
                report.status_extended = f"CloudFront Distribution {distribution.id} has Geo restrictions disabled."
            else:
                report.status = "PASS"
                report.status_extended = f"CloudFront Distribution {distribution.id} has Geo restrictions enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_https_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_https_enabled/cloudfront_distributions_https_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_https_enabled",
  "CheckTitle": "CloudFront distribution has viewer protocol policy set to HTTPS only or redirect to HTTPS",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "CloudFront distributions require viewer connections over **HTTPS** when the default cache behavior `viewer_protocol_policy` is `https-only` or `redirect-to-https`. Configurations that use `allow-all` permit HTTP.",
  "Risk": "Allowing HTTP exposes traffic to **man-in-the-middle** interception and **session hijacking**, enabling theft of cookies, tokens, or PII. Attackers can **tamper** with responses, inject malware, or perform **downgrade/strip** attacks, undermining confidentiality and integrity.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/security-policy.html",
    "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html",
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to change DefaultCacheBehavior.ViewerProtocolPolicy to \"redirect-to-https\" or \"https-only\", then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\n# CloudFormation: set ViewerProtocolPolicy to require HTTPS\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        DefaultCacheBehavior:\n          ViewerProtocolPolicy: https-only  # Critical: requires HTTPS for viewers\n```",
      "Other": "1. In the AWS Console, go to CloudFront > Distributions\n2. Select the target distribution and open the Behaviors tab\n3. Select the Default (*) behavior and click Edit\n4. Set Viewer protocol policy to Redirect HTTP to HTTPS (or HTTPS Only)\n5. Save changes and deploy",
      "Terraform": "```hcl\n# Terraform: set viewer_protocol_policy to force HTTPS\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  default_cache_behavior {\n    target_origin_id       = \"<example_origin_id>\"\n    viewer_protocol_policy = \"redirect-to-https\" # Critical: forces HTTP to HTTPS\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **HTTPS-only** access for viewers by setting `viewer_protocol_policy` to `https-only` or `redirect-to-https`; avoid `allow-all`. Extend encryption end-to-end to origins, enable **HSTS**, prefer modern TLS and ciphers, and mark cookies `Secure`. This supports **defense in depth** and prevents downgrade.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_https_enabled"
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

---[FILE: cloudfront_distributions_https_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_https_enabled/cloudfront_distributions_https_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)
from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    ViewerProtocolPolicy,
)


class cloudfront_distributions_https_enabled(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)

            if (
                distribution.default_cache_config
                and distribution.default_cache_config.viewer_protocol_policy
                == ViewerProtocolPolicy.redirect_to_https
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"CloudFront Distribution {distribution.id} has redirect to HTTPS."
                )
            elif (
                distribution.default_cache_config
                and distribution.default_cache_config.viewer_protocol_policy
                == ViewerProtocolPolicy.https_only
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"CloudFront Distribution {distribution.id} has HTTPS only."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"CloudFront Distribution {distribution.id} viewers can use HTTP or HTTPS."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_https_sni_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_https_sni_enabled/cloudfront_distributions_https_sni_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_https_sni_enabled",
  "CheckTitle": "CloudFront distribution serves HTTPS requests using SNI",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "**CloudFront distributions** that use **custom SSL/TLS certificates** are configured to serve **HTTPS** using **Server Name Indication** (`ssl_support_method: sni-only`). It evaluates SNI use rather than dedicated IP during the TLS handshake.",
  "Risk": "Without **SNI**, distributions use dedicated IP SSL, driving higher costs and inefficient IP usage. Dedicated IPs can strain quotas and hinder scaling, reducing **availability**. Managing IP-bound certificates adds **operational risk** during rotations and expansions.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/cloudfront-sni.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudfront-controls.html#cloudfront-8",
    "https://support.icompaas.com/support/solutions/articles/62000223557-ensure-cloudfront-sni-enabled",
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-https-dedicated-ip-or-sni.html#cnames-https-sni"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to change ViewerCertificate.SslSupportMethod to sni-only', then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - Id: <example_origin_id>\n            DomainName: <example_origin_domain>\n            S3OriginConfig:\n              OriginAccessIdentity: ''\n        DefaultCacheBehavior:\n          TargetOriginId: <example_origin_id>\n          ViewerProtocolPolicy: allow-all\n          ForwardedValues:\n            QueryString: false\n            Cookies:\n              Forward: none\n          MinTTL: 0\n        ViewerCertificate:\n          AcmCertificateArn: <example_certificate_arn>\n          SslSupportMethod: sni-only  # Critical: enable SNI for HTTPS\n          MinimumProtocolVersion: TLSv1  # Required when using SNI with a custom cert\n```",
      "Other": "1. In the AWS Console, go to CloudFront and open your distribution\n2. Select the Settings/General tab and click Edit\n3. Under SSL certificate, ensure your custom certificate is selected\n4. Set Client support to SNI only\n5. Click Save changes",
      "Terraform": "```hcl\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  enabled = true\n\n  origin {\n    domain_name = \"<example_origin_domain>\"\n    origin_id   = \"<example_origin_id>\"\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"<example_origin_id>\"\n    viewer_protocol_policy = \"allow-all\"\n    forwarded_values {\n      query_string = false\n      cookies { forward = \"none\" }\n    }\n    min_ttl = 0\n  }\n\n  viewer_certificate {\n    acm_certificate_arn      = \"<example_certificate_arn>\"\n    ssl_support_method       = \"sni-only\"  # Critical: enable SNI for HTTPS\n    minimum_protocol_version = \"TLSv1\"     # Required with SNI\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Use **SNI** (`sni-only`) for **HTTPS** with custom certificates; avoid dedicated IP unless a critical, non-SNI client requires it. Document and periodically review exceptions, plan client upgrades, and adopt the latest **TLS security policy** to standardize secure, modern configurations.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_https_sni_enabled"
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

---[FILE: cloudfront_distributions_https_sni_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_https_sni_enabled/cloudfront_distributions_https_sni_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)
from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    SSLSupportMethod,
)


class cloudfront_distributions_https_sni_enabled(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            if distribution.certificate:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=distribution
                )

                if distribution.ssl_support_method == SSLSupportMethod.sni_only:
                    report.status = "PASS"
                    report.status_extended = f"CloudFront Distribution {distribution.id} is serving HTTPS requests using SNI."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"CloudFront Distribution {distribution.id} is not serving HTTPS requests using SNI."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_logging_enabled/cloudfront_distributions_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_logging_enabled",
  "CheckTitle": "CloudFront distribution has logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "**CloudFront distributions** record viewer requests using either **standard access logs** or an attached **real-time log configuration**.\n\nThe finding evaluates whether logging is configured so request metadata is captured for each distribution.",
  "Risk": "Missing **CloudFront logs** blinds monitoring of edge requests, impeding detection of bot abuse, credential stuffing, origin probing, and cache-bypass attempts.\n\nThis delays incident response and weakens evidence for forensics, impacting **confidentiality**, **integrity**, and **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html",
    "https://repost.aws/knowledge-center/cloudfront-logging-requests",
    "https://aws.amazon.com/awstv/watch/e895e7811ac/",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/enable-real-time-logging.html",
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to add Logging.Bucket: <example_bucket>.s3.amazonaws.com', then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\n# CloudFormation: enable CloudFront standard access logging\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - Id: origin1\n            DomainName: <example_origin_domain>\n            S3OriginConfig: {}\n        DefaultCacheBehavior:\n          TargetOriginId: origin1\n          ViewerProtocolPolicy: allow-all\n        Logging:\n          Bucket: <example_bucket>.s3.amazonaws.com  # CRITICAL: enables standard access logs to S3 for this distribution\n          # The presence of Logging with Bucket turns on access logging\n```",
      "Other": "1. In the AWS Console, go to CloudFront and select your distribution\n2. Open the General tab and click Edit\n3. In Standard logging, set to On\n4. Select the S3 bucket to receive logs\n5. Ensure the S3 bucket has Object Ownership set to ACLs enabled (Bucket owner preferred/ObjectWriter)\n6. Save changes",
      "Terraform": "```hcl\n# Add this block to your existing CloudFront distribution to enable access logging\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  # ... existing required config ...\n  logging_config {\n    bucket = \"<example_bucket>.s3.amazonaws.com\"  # CRITICAL: enables standard access logs to S3\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **standard access logs** or **real-time logs** for all distributions.\n\nApply **least privilege** to log storage, enforce retention and immutability, and centralize ingestion with alerts.\n\nUse **defense-in-depth**: correlate with WAF metrics, sample real-time when needed, and audit new distributions for logging.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_logging_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Logging and Monitoring"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_logging_enabled/cloudfront_distributions_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)


class cloudfront_distributions_logging_enabled(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)
            if distribution.logging_enabled or (
                distribution.default_cache_config
                and distribution.default_cache_config.realtime_log_config_arn
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"CloudFront Distribution {distribution.id} has logging enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"CloudFront Distribution {distribution.id} has logging disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_multiple_origin_failover_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_multiple_origin_failover_configured/cloudfront_distributions_multiple_origin_failover_configured.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_multiple_origin_failover_configured",
  "CheckTitle": "CloudFront distribution has origin failover configured with at least two origins",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls",
    "Effects/Denial of Service"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "**CloudFront distributions** are evaluated for an **origin group** configured with at least `2` origins to support automatic origin failover.",
  "Risk": "Without **origin failover**, the origin becomes a **single point of failure**. Origin outages, regional incidents, or targeted **DoS** can cause **downtime**, elevated error rates, and latency, degrading **availability** and impacting user experience and SLAs.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html#concept_origin_groups.creating",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudfront-controls.html#cloudfront-4",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/origin-failover-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to add OriginGroups with two origins and FailoverCriteria, then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\n# CloudFormation: Add an origin group with two origins and use it in the default cache behavior\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          Quantity: 2\n          Items:\n            - Id: primary\n              DomainName: <primary_origin_domain>\n              S3OriginConfig: {}\n            - Id: secondary\n              DomainName: <secondary_origin_domain>\n              S3OriginConfig: {}\n        OriginGroups:\n          Quantity: 1\n          Items:\n            - Id: <example_origin_group_id>  # Critical: define origin group with 2 origins\n              FailoverCriteria:\n                StatusCodes:\n                  Quantity: 1\n                  Items: [500]  # Critical: fail over on 500 to enable origin failover\n              Members:\n                Quantity: 2\n                Items:\n                  - OriginId: primary\n                  - OriginId: secondary\n        DefaultCacheBehavior:\n          TargetOriginId: <example_origin_group_id>  # Critical: use the origin group for requests\n          ViewerProtocolPolicy: allow-all\n          ForwardedValues:\n            QueryString: false\n            Cookies:\n              Forward: none\n```",
      "Other": "1. In the AWS Console, go to CloudFront and open your distribution\n2. Select the Origins tab and ensure two origins exist; add a second origin if needed\n3. In the Origin groups pane, click Create origin group\n4. Select the two origins; set one as primary and the other as secondary\n5. Choose at least one failover status code (e.g., 500) and create the group\n6. Go to Behaviors, edit the relevant cache behavior (or Default behavior)\n7. Set Origin to the new origin group and save changes\n8. Deploy/confirm the distribution update",
      "Terraform": "```hcl\n# Configure an origin group with two origins and use it in the default cache behavior\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  enabled = true\n\n  origin {\n    domain_name = \"<primary_origin_domain>\"\n    origin_id   = \"primary\"\n    s3_origin_config {}\n  }\n\n  origin {\n    domain_name = \"<secondary_origin_domain>\"\n    origin_id   = \"secondary\"\n    s3_origin_config {}\n  }\n\n  origin_group {\n    origin_id = \"<example_origin_group_id>\"  # Critical: define origin group with 2 origins\n    failover_criteria {\n      status_codes = [500]  # Critical: fail over on 500 to enable origin failover\n    }\n    member { origin_id = \"primary\" }\n    member { origin_id = \"secondary\" }\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"<example_origin_group_id>\"  # Critical: use the origin group for requests\n    viewer_protocol_policy = \"allow-all\"\n    forwarded_values {\n      query_string = false\n      cookies { forward = \"none\" }\n    }\n  }\n\n  restrictions {\n    geo_restriction { restriction_type = \"none\" }\n  }\n\n  viewer_certificate { cloudfront_default_certificate = true }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **origin failover** by defining an origin group with primary and secondary origins. Distribute origins across independent zones or providers, set clear failover criteria (e.g., HTTP codes/timeouts), monitor health, and routinely test failover. Align with **resilience** and **defense-in-depth** to protect availability.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_multiple_origin_failover_configured"
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

---[FILE: cloudfront_distributions_multiple_origin_failover_configured.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_multiple_origin_failover_configured/cloudfront_distributions_multiple_origin_failover_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)


class cloudfront_distributions_multiple_origin_failover_configured(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)
            report.status = "FAIL"
            report.status_extended = f"CloudFront Distribution {distribution.id} does not have an origin group configured with at least 2 origins."

            if distribution.origin_failover:
                report.status = "PASS"
                report.status_extended = f"CloudFront Distribution {distribution.id} has an origin group with at least 2 origins configured."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
