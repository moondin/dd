---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 247
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 247 of 867)

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

---[FILE: cloudfront_distributions_origin_traffic_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_origin_traffic_encrypted/cloudfront_distributions_origin_traffic_encrypted.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_origin_traffic_encrypted",
  "CheckTitle": "CloudFront distribution encrypts traffic to custom origins",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Security",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "**CloudFront distributions** are evaluated for **TLS to origins**. The check ensures custom origins use `origin_protocol_policy`=`https-only`, or `match-viewer` only when the viewer protocol policy disallows HTTP. For S3 origins, it inspects the viewer protocol policy and flags `allow-all` as permitting non-encrypted paths.",
  "Risk": "Unencrypted origin links enable on-path interception and manipulation. Secrets, cookies, and PII can be exposed, and responses altered, undermining **confidentiality** and **integrity**. This increases chances of session hijacking, cache poisoning, and malicious content injection.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/cloudfront-traffic-to-origin-unencrypted.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudfront-controls.html#cloudfront-9",
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-cloudfront-to-custom-origin.html",
    "https://docs.aws.amazon.com/whitepapers/latest/secure-content-delivery-amazon-cloudfront/custom-origin-with-cloudfront.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to change Origins[].CustomOriginConfig.OriginProtocolPolicy to https-only', then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\n# CloudFormation: set CloudFront origin to use HTTPS only\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - Id: <example_origin_id>\n            DomainName: <example_origin_domain>\n            CustomOriginConfig:\n              OriginProtocolPolicy: https-only  # FIX: Force CloudFront-to-origin over HTTPS only\n        DefaultCacheBehavior:\n          TargetOriginId: <example_origin_id>\n          ViewerProtocolPolicy: allow-all\n          ForwardedValues:\n            QueryString: false\n```",
      "Other": "1. In the AWS Console, open CloudFront and select your distribution\n2. Go to the Origins tab, select the custom origin, and click Edit\n3. Set Protocol to HTTPS only (Origin protocol policy = HTTPS Only)\n4. Click Save changes and wait for the distribution to deploy",
      "Terraform": "```hcl\n# Terraform: set CloudFront origin to use HTTPS only\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  enabled = true\n\n  origin {\n    domain_name = \"<example_origin_domain>\"\n    origin_id   = \"<example_origin_id>\"\n\n    custom_origin_config {\n      http_port              = 80\n      https_port             = 443\n      origin_protocol_policy = \"https-only\"   # FIX: Force CloudFront-to-origin over HTTPS only\n      origin_ssl_protocols   = [\"TLSv1.2\"]\n    }\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"<example_origin_id>\"\n    viewer_protocol_policy = \"allow-all\"\n    forwarded_values {\n      query_string = false\n      cookies { forward = \"none\" }\n    }\n  }\n\n  restrictions { geo_restriction { restriction_type = \"none\" } }\n  viewer_certificate { cloudfront_default_certificate = true }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce end-to-end HTTPS. Set `origin_protocol_policy` to `https-only` and viewer policy to `https-only` or `redirect-to-https`. Use trusted certificates and modern TLS (`TLSv1.2+`), disabling weak protocols. Apply **least privilege** and **defense in depth** by restricting direct origin access and preferring private connectivity.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_origin_traffic_encrypted"
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

---[FILE: cloudfront_distributions_origin_traffic_encrypted.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_origin_traffic_encrypted/cloudfront_distributions_origin_traffic_encrypted.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)


class cloudfront_distributions_origin_traffic_encrypted(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)
            report.status = "PASS"
            report.status_extended = f"CloudFront Distribution {distribution.id} does encrypt traffic to custom origins."
            unencrypted_origins = []

            for origin in distribution.origins:
                if origin.s3_origin_config:
                    # For S3, only check the viewer protocol policy
                    if distribution.viewer_protocol_policy == "allow-all":
                        unencrypted_origins.append(origin.id)
                else:
                    # Regular check for custom origins (ALB, EC2, API Gateway, etc.)
                    if (
                        origin.origin_protocol_policy == ""
                        or origin.origin_protocol_policy == "http-only"
                    ) or (
                        origin.origin_protocol_policy == "match-viewer"
                        and distribution.viewer_protocol_policy == "allow-all"
                    ):
                        unencrypted_origins.append(origin.id)

            if unencrypted_origins:
                report.status = "FAIL"
                report.status_extended = f"CloudFront Distribution {distribution.id} does not encrypt traffic to custom origins {', '.join(unencrypted_origins)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_s3_origin_access_control.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_s3_origin_access_control/cloudfront_distributions_s3_origin_access_control.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_s3_origin_access_control",
  "CheckTitle": "CloudFront distribution uses Origin Access Control (OAC) for all S3 origins",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "**CloudFront distributions** with **Amazon S3 origins** are expected to use **Origin Access Control** (`OAC`) on each S3 origin.\n\nThe evaluation inspects distributions that include `s3_origin_config` and identifies S3 origins that lack an associated OAC.",
  "Risk": "Without **OAC**, S3 objects can be reached outside CloudFront, bypassing edge controls and weakening **confidentiality** and **integrity**.\n- Direct access enables data exfiltration\n- Loss of WAF, rate-limiting, and detailed logging; cost abuse\n- Limited support for signed writes and **SSE-KMS**, increasing tampering risk",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/s3-origin.html",
    "https://repost.aws/knowledge-center/cloudfront-access-to-amazon-s3",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudfront-controls.html#cloudfront-13",
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront create-origin-access-control --origin-access-control-config '{Name\":\"<example_resource_name>\",\"SigningProtocol\":\"sigv4\",\"SigningBehavior\":\"always\",\"OriginAccessControlOriginType\":\"s3\"}' && aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to add OriginAccessControlId to S3 origins, then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\n# CloudFormation: attach OAC to S3 origin in a CloudFront distribution\nResources:\n  ExampleOAC:\n    Type: AWS::CloudFront::OriginAccessControl\n    Properties:\n      OriginAccessControlConfig:\n        Name: <example_resource_name>\n        OriginAccessControlOriginType: s3\n        SigningBehavior: always\n        SigningProtocol: sigv4\n\n  ExampleDistribution:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - Id: s3-<example_resource_id>\n            DomainName: <example_bucket>.s3.amazonaws.com\n            OriginAccessControlId: !Ref ExampleOAC  # CRITICAL: attaches OAC to the S3 origin to satisfy the check\n            S3OriginConfig:\n              OriginAccessIdentity: \"\"             # CRITICAL: disable OAI when using OAC\n        DefaultCacheBehavior:\n          TargetOriginId: s3-<example_resource_id>\n          ViewerProtocolPolicy: redirect-to-https\n          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6\n```",
      "Other": "1. In the AWS Console, open CloudFront and go to Security > Origin access > Origin access control (OAC). Click Create control setting, choose Origin type S3, keep Sign requests, and create the OAC.\n2. Open your CloudFront distribution, go to the Origins tab.\n3. For each S3 origin: click Edit, select Origin access control settings (recommended), choose the OAC created in step 1, and Save changes.\n4. Repeat step 3 for all S3 origins in the distribution.",
      "Terraform": "```hcl\n# Terraform: attach OAC to S3 origin in a CloudFront distribution\nresource \"aws_cloudfront_origin_access_control\" \"oac\" {\n  name                              = \"<example_resource_name>\"\n  origin_access_control_origin_type = \"s3\"\n  signing_behavior                  = \"always\"\n  signing_protocol                  = \"sigv4\"\n}\n\nresource \"aws_cloudfront_distribution\" \"dist\" {\n  enabled = true\n\n  origin {\n    domain_name = \"<example_bucket>.s3.amazonaws.com\"\n    origin_id   = \"s3-<example_resource_id>\"\n\n    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id  # CRITICAL: attaches OAC to the S3 origin to satisfy the check\n\n    s3_origin_config {\n      origin_access_identity = \"\"  # CRITICAL: disable OAI when using OAC\n    }\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"s3-<example_resource_id>\"\n    viewer_protocol_policy = \"redirect-to-https\"\n    cache_policy_id        = \"658327ea-f89d-4fab-a63d-7e88639e58f6\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **Origin Access Control** for all S3 origins and keep buckets non-public.\n\nApply **least privilege**: scope bucket and key permissions to CloudFront and the intended distribution. Ensure origin requests are signed, migrate from legacy OAI, and use **defense in depth** with WAF and monitoring to protect and observe access.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_s3_origin_access_control"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_s3_origin_access_control.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_s3_origin_access_control/cloudfront_distributions_s3_origin_access_control.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)


class cloudfront_distributions_s3_origin_access_control(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)

            if any(origin.s3_origin_config for origin in distribution.origins):
                s3_buckets_with_no_oac = []
                report.status = "PASS"
                report.status_extended = f"CloudFront Distribution {distribution.id} is using origin access control (OAC) for S3 origins."

                for origin in distribution.origins:
                    if (
                        origin.s3_origin_config != {}
                        and origin.origin_access_control == ""
                    ):
                        s3_buckets_with_no_oac.append(origin.id)

                if s3_buckets_with_no_oac:
                    report.status = "FAIL"
                    report.status_extended = f"CloudFront Distribution {distribution.id} is not using origin access control (OAC) in S3 origins {', '.join(s3_buckets_with_no_oac)}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_s3_origin_non_existent_bucket.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_s3_origin_non_existent_bucket/cloudfront_distributions_s3_origin_non_existent_bucket.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_s3_origin_non_existent_bucket",
  "CheckTitle": "CloudFront distribution S3 origins reference existing buckets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "**CloudFront distributions** with `S3OriginConfig` should reference existing **S3 bucket origins** (excluding static website hosting).\n\nIdentifies origins where the configured bucket name does not exist.",
  "Risk": "**Dangling S3 origins** allow potential **bucket takeover**: an attacker could create the missing bucket and have CloudFront retrieve attacker-controlled objects *if access isn't restricted*.\n\nThis threatens **integrity** (content spoofing, cache poisoning) and **availability** (errors/timeouts), undermining user trust.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/whitepapers/latest/secure-content-delivery-amazon-cloudfront/s3-origin-with-cloudfront.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudfront-controls.html#cloudfront-12",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/cloudfront-existing-s3-bucket.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: ensure the S3 bucket referenced by the CloudFront S3 origin exists\nResources:\n  <example_resource_name>:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: <example_resource_name>  # Critical: must exactly match the bucket name used in the CloudFront origin's domain (before \".s3\") to make it exist\n```",
      "Other": "1. In the AWS console, open CloudFront and select the distribution\n2. Go to Origins, select the S3 origin, and note the Domain Name (the bucket name is the text before \".s3\")\n3. Open the S3 console, click Create bucket, enter the exact bucket name from step 2, and create the bucket\n4. Re-run the check",
      "Terraform": "```hcl\n# Ensure the S3 bucket referenced by the CloudFront S3 origin exists\nresource \"aws_s3_bucket\" \"<example_resource_name>\" {\n  bucket = \"<example_resource_name>\"  # Critical: must exactly match the bucket name used in the CloudFront origin's domain (before \".s3\")\n}\n```"
    },
    "Recommendation": {
      "Text": "Ensure origins reference valid, owned buckets; delete or update stale references. Enforce **origin access control** (or OAI) and tight bucket policies so only the distribution can access objects. Apply **least privilege**, manage bucket names, and monitor origin health to prevent misrouting.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_s3_origin_non_existent_bucket"
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

---[FILE: cloudfront_distributions_s3_origin_non_existent_bucket.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_s3_origin_non_existent_bucket/cloudfront_distributions_s3_origin_non_existent_bucket.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)
from prowler.providers.aws.services.s3.s3_client import s3_client


class cloudfront_distributions_s3_origin_non_existent_bucket(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)
            report.status = "PASS"
            report.status_extended = f"CloudFront Distribution {distribution.id} does not have non-existent S3 buckets as origins."
            non_existent_buckets = []

            for origin in distribution.origins:
                if origin.s3_origin_config:
                    bucket_name = origin.domain_name.split(".s3")[0]
                    if not s3_client._head_bucket(bucket_name):
                        non_existent_buckets.append(bucket_name)

            if non_existent_buckets:
                report.status = "FAIL"
                report.status_extended = f"CloudFront Distribution {distribution.id} has non-existent S3 buckets as origins: {','.join(non_existent_buckets)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_using_deprecated_ssl_protocols.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_using_deprecated_ssl_protocols/cloudfront_distributions_using_deprecated_ssl_protocols.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_using_deprecated_ssl_protocols",
  "CheckTitle": "CloudFront distribution does not use SSLv3, TLSv1, or TLSv1.1 for origin connections",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "CloudFront distributions have origins whose `OriginSslProtocols` allow **deprecated SSL/TLS versions** (`SSLv3`, `TLSv1`, `TLSv1.1`) for CloudFront-to-origin HTTPS connections.",
  "Risk": "Weak protocols between CloudFront and the origin allow downgrades and known exploits (e.g., POODLE/BEAST), enabling eavesdropping or content tampering. This compromises the **confidentiality** and **integrity** of data in transit, exposing cookies, credentials, and responses served to viewers.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html",
    "https://trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/cloudfront-insecure-origin-ssl-protocols.html",
    "https://support.icompaas.com/support/solutions/articles/62000223404-ensure-cloudfront-distributions-are-not-using-deprecated-ssl-protocols"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to change Origins[].CustomOriginConfig.OriginSslProtocols to [TLSv1.2], then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\n# CloudFormation: set origin to allow only TLSv1.2 when connecting to the origin\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - Id: <example_origin_id>\n            DomainName: <origin.example.com>\n            CustomOriginConfig:\n              OriginProtocolPolicy: https-only\n              OriginSslProtocols:\n                - TLSv1.2  # CRITICAL: restrict origin SSL protocols to TLSv1.2 to remove SSLv3/TLSv1/TLSv1.1\n        DefaultCacheBehavior:\n          TargetOriginId: <example_origin_id>\n          ViewerProtocolPolicy: redirect-to-https\n```",
      "Other": "1. Open the AWS Console and go to CloudFront\n2. Select the distribution and open the Origins tab\n3. Select the custom origin and click Edit\n4. Under Origin SSL protocols, select only TLSv1.2\n5. Save changes\n6. Repeat for any other custom origins in the distribution",
      "Terraform": "```hcl\n# Terraform: set origin to allow only TLSv1.2 when connecting to the origin\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  enabled = true\n\n  origin {\n    domain_name = \"<origin.example.com>\"\n    origin_id   = \"<example_origin_id>\"\n\n    custom_origin_config {\n      http_port              = 80\n      https_port             = 443\n      origin_protocol_policy = \"https-only\"\n      origin_ssl_protocols   = [\"TLSv1.2\"]  # CRITICAL: restrict origin SSL protocols to TLSv1.2\n    }\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"<example_origin_id>\"\n    viewer_protocol_policy = \"redirect-to-https\"\n    allowed_methods        = [\"GET\", \"HEAD\"]\n    cached_methods         = [\"GET\", \"HEAD\"]\n    forwarded_values { query_string = false }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enforce **TLS 1.2+** for CloudFront-to-origin traffic. Remove `SSLv3`, `TLSv1`, `TLSv1.1` from allowed protocols and prefer modern cipher suites. Verify origin compatibility, update certificates and libraries, and periodically review policies as part of **defense in depth** and **least privilege**.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_using_deprecated_ssl_protocols"
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

---[FILE: cloudfront_distributions_using_deprecated_ssl_protocols.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_using_deprecated_ssl_protocols/cloudfront_distributions_using_deprecated_ssl_protocols.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)
from prowler.providers.aws.services.cloudfront.cloudfront_service import (
    OriginsSSLProtocols,
)


class cloudfront_distributions_using_deprecated_ssl_protocols(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)
            report.status = "PASS"
            report.status_extended = f"CloudFront Distribution {distribution.id} is not using a deprecated SSL protocol."

            bad_ssl_protocol = False
            for origin in distribution.origins:
                if origin.origin_ssl_protocols:
                    for ssl_protocol in origin.origin_ssl_protocols:
                        if ssl_protocol in (
                            OriginsSSLProtocols.SSLv3.value,
                            OriginsSSLProtocols.TLSv1.value,
                            OriginsSSLProtocols.TLSv1_1.value,
                        ):
                            bad_ssl_protocol = True
                            break

                if bad_ssl_protocol:
                    report.status = "FAIL"
                    report.status_extended = f"CloudFront Distribution {distribution.id} is using a deprecated SSL protocol."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_using_waf.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_using_waf/cloudfront_distributions_using_waf.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_using_waf",
  "CheckTitle": "CloudFront distribution uses an AWS WAF web ACL",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "**CloudFront distributions** are assessed for an associated **AWS WAF** web ACL that inspects and filters HTTP/S requests at the edge.\n\nThe finding highlights distributions without this web ACL association.",
  "Risk": "Absent **WAF** on Internet-facing distributions exposes apps to layer-7 threats: SQLi/XSS and bot abuse can cause data exfiltration (**confidentiality**), unauthorized actions (**integrity**), and request floods that overload origins (**availability**). It may also raise egress and compute costs.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://repost.aws/questions/QUTY5hPVxgS6Caa3eZHX7-nQ/waf-on-alb-or-cloudfront",
    "https://docs.aws.amazon.com/waf/latest/developerguide/cloudfront-features.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/cloudfront-integrated-with-waf.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: associate an AWS WAFv2 Web ACL with a CloudFront distribution\nResources:\n  <example_distribution>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - Id: origin1\n            DomainName: <example_origin_domain>\n            S3OriginConfig: {}\n        DefaultCacheBehavior:\n          TargetOriginId: origin1\n          ViewerProtocolPolicy: redirect-to-https\n          ForwardedValues:\n            QueryString: false\n        WebACLId: <example_web_acl_arn>  # CRITICAL: Associates the WAFv2 Web ACL (ARN) to this distribution\n        # This makes the distribution PASS by enabling WAF protection\n```",
      "Other": "1. In the AWS Console, go to CloudFront > Distributions and select your distribution\n2. Click Edit (General/Settings)\n3. Set AWS WAF Web ACL to your Web ACL (scope: Global/CloudFront)\n4. Click Save/Yes, Edit and wait for Deployment to complete\n5. If no Web ACL exists: go to WAF & Shield > Web ACLs (scope: CloudFront), Create web ACL, then repeat steps 1-4 to associate it",
      "Terraform": "```hcl\n# Add this to the existing CloudFront distribution resource\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  web_acl_id = \"<example_web_acl_arn>\"  # CRITICAL: Associates the WAFv2 Web ACL (ARN) to the distribution to PASS the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Associate each distribution with an **AWS WAF web ACL** and apply defense-in-depth:\n- Use managed rule groups and rate limits\n- Add IP/geo and bot controls as needed\n- Enable logging, test new rules in `count` mode, and tune\n- Monitor metrics and update rules\n\nAlign controls with **least privilege** for requests.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_using_waf"
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

---[FILE: cloudfront_distributions_using_waf.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_using_waf/cloudfront_distributions_using_waf.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)


class cloudfront_distributions_using_waf(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)
            if distribution.web_acl_id:
                report.status = "PASS"
                report.status_extended = f"CloudFront Distribution {distribution.id} is using AWS WAF web ACL {distribution.web_acl_id}."
            else:
                report.status = "FAIL"
                report.status_extended = f"CloudFront Distribution {distribution.id} is not using AWS WAF web ACL."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_client.py]---
Location: prowler-master/prowler/providers/aws/services/cloudtrail/cloudtrail_client.py

```python
from prowler.providers.aws.services.cloudtrail.cloudtrail_service import Cloudtrail
from prowler.providers.common.provider import Provider

cloudtrail_client = Cloudtrail(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
