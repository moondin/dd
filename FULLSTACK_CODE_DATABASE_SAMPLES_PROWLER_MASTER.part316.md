---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 316
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 316 of 867)

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

---[FILE: s3_bucket_public_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_access/s3_bucket_public_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_public_access",
  "CheckTitle": "Ensure there are no S3 buckets open to Everyone or Any AWS user.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "critical",
  "ResourceType": "AwsS3Bucket",
  "Description": "Ensure there are no S3 buckets open to Everyone or Any AWS user.",
  "Risk": "Even if you enable all possible bucket ACL options available in the Amazon S3 console the ACL alone does not allow everyone to download objects from your bucket. Depending on which option you select any user could perform some actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-public-access-block --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --bucket <bucket_name>",
      "NativeIaC": "",
      "Other": "https://github.com/cloudmatos/matos/tree/master/remediations/aws/s3/s3/block-public-access",
      "Terraform": "https://docs.prowler.com/checks/aws/networking-policies/s3-bucket-should-have-public-access-blocks-defaults-to-false-if-the-public-access-block-is-not-attached#terraform"
    },
    "Recommendation": {
      "Text": "You can enable block public access settings only for access points, buckets and AWS accounts. Amazon S3 does not support block public access settings on a per-object basis. When you apply block public access settings to an account, the settings apply to all AWS Regions globally. The settings might not take effect in all Regions immediately or simultaneously, but they eventually propagate to all Regions.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
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

---[FILE: s3_bucket_public_access.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_access/s3_bucket_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_policy_public
from prowler.providers.aws.services.s3.s3_client import s3_client
from prowler.providers.aws.services.s3.s3control_client import s3control_client


class s3_bucket_public_access(Check):
    def execute(self):
        findings = []
        # 1. Check if public buckets are restricted at account level
        if (
            s3control_client.account_public_access_block
            and s3control_client.account_public_access_block.ignore_public_acls
            and s3control_client.account_public_access_block.restrict_public_buckets
        ):
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=s3control_client.account_public_access_block,
            )
            report.status = "PASS"
            report.status_extended = "All S3 public access blocked at account level."
            report.region = s3control_client.region
            report.resource_id = s3_client.audited_account
            report.resource_arn = s3_client.account_arn_template
            findings.append(report)
        else:
            # 2. If public access is not blocked at account level, check it at each bucket level
            for bucket in s3_client.buckets.values():
                if bucket.public_access_block:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
                    report.status = "PASS"
                    report.status_extended = f"S3 Bucket {bucket.name} is not public."
                    if not (
                        bucket.public_access_block.ignore_public_acls
                        and bucket.public_access_block.restrict_public_buckets
                    ):
                        # 3. If bucket has no public block, check bucket ACL
                        for grantee in bucket.acl_grantees:
                            if grantee.type in "Group":
                                if (
                                    "AllUsers" in grantee.URI
                                    or "AuthenticatedUsers" in grantee.URI
                                ):
                                    report.status = "FAIL"
                                    report.status_extended = f"S3 Bucket {bucket.name} has public access due to bucket ACL."

                        # 4. Check bucket policy
                        if bucket.policy is not None and is_policy_public(
                            bucket.policy, s3_client.audited_account
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"S3 Bucket {bucket.name} has public access due to bucket policy."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_public_access_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_access/s3_bucket_public_access_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.s3.s3_client import s3_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the S3 bucket's public access settings to block all public access.
    Specifically, this fixer configures the bucket's public access block settings to
    prevent any public access (ACLs and policies). Requires the s3:PutBucketPublicAccessBlock
    permission to modify the public access settings.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:PutBucketPublicAccessBlock",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The S3 bucket name.
        region (str): AWS region where the S3 bucket exists.
    Returns:
        bool: True if the operation is successful (public access is blocked),
              False otherwise.
    """
    try:
        regional_client = s3_client.regional_clients[region]
        regional_client.put_public_access_block(
            Bucket=resource_id,
            PublicAccessBlockConfiguration={
                "BlockPublicAcls": True,
                "IgnorePublicAcls": True,
                "BlockPublicPolicy": True,
                "RestrictPublicBuckets": True,
            },
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

---[FILE: s3_bucket_public_list_acl.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_list_acl/s3_bucket_public_list_acl.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_public_list_acl",
  "CheckTitle": "Ensure there are no S3 buckets listable by Everyone or Any AWS customer.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "critical",
  "ResourceType": "AwsS3Bucket",
  "Description": "Ensure there are no S3 buckets listable by Everyone or Any AWS customer.",
  "Risk": "Even if you enable all possible bucket ACL options available in the Amazon S3 console the ACL alone does not allow everyone to download objects from your bucket. Depending on which option you select any user could perform some actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-acl --bucket <bucket_name> --acl private",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/S3/s3-bucket-public-read-access.html",
      "Other": "",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/S3/s3-bucket-public-read-access.html"
    },
    "Recommendation": {
      "Text": "You can enable block public access settings only for access points, buckets and AWS accounts. Amazon S3 does not support block public access settings on a per-object basis. When you apply block public access settings to an account, the settings apply to all AWS Regions globally. The settings might not take effect in all Regions immediately or simultaneously, but they eventually propagate to all Regions.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
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

---[FILE: s3_bucket_public_list_acl.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_list_acl/s3_bucket_public_list_acl.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client
from prowler.providers.aws.services.s3.s3control_client import s3control_client


class s3_bucket_public_list_acl(Check):
    def execute(self):
        findings = []
        # 1. Check if public buckets are restricted at account level
        if (
            s3control_client.account_public_access_block
            and s3control_client.account_public_access_block.ignore_public_acls
            and s3control_client.account_public_access_block.restrict_public_buckets
        ):
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=s3control_client.account_public_access_block,
            )
            report.status = "PASS"
            report.status_extended = "All S3 public access blocked at account level."
            report.region = s3control_client.region
            report.resource_id = s3_client.audited_account
            report.resource_arn = s3_client.account_arn_template
            findings.append(report)
        else:
            # 2. If public access is not blocked at account level, check it at each bucket level
            for bucket in s3_client.buckets.values():
                if bucket.public_access_block:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
                    report.status = "PASS"
                    report.status_extended = (
                        f"S3 Bucket {bucket.name} is not publicly listable."
                    )
                    if not (
                        bucket.public_access_block.ignore_public_acls
                        and bucket.public_access_block.restrict_public_buckets
                    ):
                        # 3. If bucket has no public block, check bucket ACL
                        for grantee in bucket.acl_grantees:
                            if grantee.type in "Group":
                                if (
                                    "AllUsers" in grantee.URI
                                    or "AuthenticatedUsers" in grantee.URI
                                ) and (
                                    grantee.permission == "FULL_CONTROL"
                                    or grantee.permission == "READ"
                                    or grantee.permission == "READ_ACP"
                                ):
                                    report.status = "FAIL"
                                    report.status_extended = f"S3 Bucket {bucket.name} is listable by anyone due to the bucket ACL: {grantee.URI.split('/')[-1]} having the {grantee.permission} permission."

                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_public_list_acl_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_list_acl/s3_bucket_public_list_acl_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.s3.s3_client import s3_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the S3 bucket ACL to restrict public read access.
    Specifically, this fixer sets the ACL of the bucket to 'private' to prevent
    any public access to the S3 bucket.
    Requires the s3:PutBucketAcl permission.

    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:PutBucketAcl",
                "Resource": "*"
            }
        ]
    }

    Args:
        resource_id (str): The S3 bucket name.
        region (str): AWS region where the S3 bucket exists.

    Returns:
        bool: True if the operation is successful (bucket access is updated), False otherwise.
    """
    try:
        regional_client = s3_client.regional_clients[region]
        regional_client.put_bucket_acl(Bucket=resource_id, ACL="private")
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_public_write_acl.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_write_acl/s3_bucket_public_write_acl.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_public_write_acl",
  "CheckTitle": "Ensure there are no S3 buckets writable by Everyone or Any AWS customer.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "critical",
  "ResourceType": "AwsS3Bucket",
  "Description": "Ensure there are no S3 buckets writable by Everyone or Any AWS customer.",
  "Risk": "Even if you enable all possible bucket ACL options available in the Amazon S3 console the ACL alone does not allow everyone to download objects from your bucket. Depending on which option you select any user could perform some actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-acl --bucket <bucket_name> --acl private",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/S3/s3-bucket-public-write-access.html",
      "Other": "",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/S3/s3-bucket-public-write-access.html"
    },
    "Recommendation": {
      "Text": "You can enable block public access settings only for access points, buckets and AWS accounts. Amazon S3 does not support block public access settings on a per-object basis. When you apply block public access settings to an account, the settings apply to all AWS Regions globally. The settings might not take effect in all Regions immediately or simultaneously, but they eventually propagate to all Regions.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
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

---[FILE: s3_bucket_public_write_acl.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_write_acl/s3_bucket_public_write_acl.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client
from prowler.providers.aws.services.s3.s3control_client import s3control_client


class s3_bucket_public_write_acl(Check):
    def execute(self):
        findings = []
        # 1. Check if public buckets are restricted at account level
        if (
            s3control_client.account_public_access_block
            and s3control_client.account_public_access_block.ignore_public_acls
            and s3control_client.account_public_access_block.restrict_public_buckets
        ):
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=s3control_client.account_public_access_block,
            )
            report.status = "PASS"
            report.status_extended = "All S3 public access blocked at account level."
            report.region = s3control_client.region
            report.resource_id = s3_client.audited_account
            report.resource_arn = s3_client.account_arn_template
            findings.append(report)
        else:
            # 2. If public access is not blocked at account level, check it at each bucket level
            for bucket in s3_client.buckets.values():
                if bucket.public_access_block:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
                    report.status = "PASS"
                    report.status_extended = (
                        f"S3 Bucket {bucket.name} is not publicly writable."
                    )
                    if not (
                        bucket.public_access_block.ignore_public_acls
                        and bucket.public_access_block.restrict_public_buckets
                    ):
                        # 3. If bucket has no public block, check bucket ACL
                        for grantee in bucket.acl_grantees:
                            if grantee.type in "Group":
                                if (
                                    "AllUsers" in grantee.URI
                                    or "AuthenticatedUsers" in grantee.URI
                                ) and (
                                    grantee.permission == "FULL_CONTROL"
                                    or grantee.permission == "WRITE"
                                    or grantee.permission == "WRITE_ACP"
                                ):
                                    report.status = "FAIL"
                                    report.status_extended = f"S3 Bucket {bucket.name} is writable by anyone due to the bucket ACL: {grantee.URI.split('/')[-1]} having the {grantee.permission} permission."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_public_write_acl_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_public_write_acl/s3_bucket_public_write_acl_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.s3.s3_client import s3_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the S3 bucket ACL to restrict public write access.
    Specifically, this fixer sets the ACL of the bucket to 'private' to prevent
    public write access to the S3 bucket. Requires the s3:PutBucketAcl permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:PutBucketAcl",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The S3 bucket id.
        region (str): AWS region where the S3 bucket exists.
    Returns:
        bool: True if the operation is successful (bucket access is updated), False otherwise.
    """
    try:
        regional_client = s3_client.regional_clients[region]
        regional_client.put_bucket_acl(Bucket=resource_id, ACL="private")
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_secure_transport_policy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_secure_transport_policy/s3_bucket_secure_transport_policy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_secure_transport_policy",
  "CheckTitle": "Check if S3 buckets have secure transport policy.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have secure transport policy.",
  "Risk": "If HTTPS is not enforced on the bucket policy, communication between clients and S3 buckets can use unencrypted HTTP. As a result, sensitive information could be transmitted in clear text over the network or internet.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/s3-policies/s3_15-secure-data-transport#aws-console",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that S3 buckets have encryption in transit enabled.",
      "Url": "https://aws.amazon.com/premiumsupport/knowledge-center/s3-bucket-policy-for-config-rule/"
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

---[FILE: s3_bucket_secure_transport_policy.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_secure_transport_policy/s3_bucket_secure_transport_policy.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_secure_transport_policy(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            # Check if bucket policy enforces SSL
            if not bucket.policy:
                report.status = "FAIL"
                report.status_extended = f"S3 Bucket {bucket.name} does not have a bucket policy, thus it allows HTTP requests."
            else:
                report.status = "FAIL"
                report.status_extended = f"S3 Bucket {bucket.name} allows requests over insecure transport in the bucket policy."
                for statement in bucket.policy["Statement"]:
                    if (
                        statement["Effect"] == "Deny"
                        and "Condition" in statement
                        and "Action" in statement
                        and (
                            "s3:PutObject" in statement["Action"]
                            or "*" in statement["Action"]
                            or "s3:*" in statement["Action"]
                        )
                    ):
                        if "Bool" in statement["Condition"]:
                            if "aws:SecureTransport" in statement["Condition"]["Bool"]:
                                if (
                                    statement["Condition"]["Bool"][
                                        "aws:SecureTransport"
                                    ]
                                    == "false"
                                ):
                                    report.status = "PASS"
                                    report.status_extended = f"S3 Bucket {bucket.name} has a bucket policy to deny requests over insecure transport."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_server_access_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_server_access_logging_enabled/s3_bucket_server_access_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_server_access_logging_enabled",
  "CheckTitle": "Check if S3 buckets have server access logging enabled",
  "CheckType": [
    "Logging and Monitoring"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have server access logging enabled",
  "Risk": "Server access logs can assist you in security and access audits, help you learn about your customer base, and understand your Amazon S3 bill.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-logging --bucket <BUCKET_NAME> --bucket-logging-status <LOGGING_FILE_JSON>",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/s3-policies/s3_13-enable-logging",
      "Terraform": "https://docs.prowler.com/checks/aws/s3-policies/s3_13-enable-logging#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that S3 buckets have Logging enabled. CloudTrail data events can be used in place of S3 bucket logging. If that is the case, this finding can be considered a false positive.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/dev/security-best-practices.html"
    }
  },
  "Categories": [
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_server_access_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_server_access_logging_enabled/s3_bucket_server_access_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_server_access_logging_enabled(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            if bucket.logging:
                report.status = "PASS"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} has server access logging enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} has server access logging disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_shadow_resource_vulnerability.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_shadow_resource_vulnerability/s3_bucket_shadow_resource_vulnerability.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_shadow_resource_vulnerability",
  "CheckTitle": "Check for S3 buckets vulnerable to Shadow Resource Hijacking (Bucket Monopoly)",
  "CheckType": [
    "Effects/Data Exposure"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "high",
  "ResourceType": "AwsS3Bucket",
  "Description": "Checks for S3 buckets with predictable names that could be hijacked by an attacker before legitimate use, leading to data leakage or other security breaches.",
  "Risk": "An attacker can pre-create S3 buckets with predictable names used by various AWS services. When a legitimate user's service attempts to use that bucket, it may inadvertently write sensitive data to the attacker-controlled bucket, leading to information disclosure, denial of service, or even remote code execution.",
  "RelatedUrl": "https://www.aquasec.com/blog/bucket-monopoly-breaching-aws-accounts-through-shadow-resources/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "Manually verify the ownership of any flagged S3 buckets. If a bucket is not owned by your account, investigate its origin and purpose. If it is not a legitimate resource, you should avoid using services that may interact with it.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that all S3 buckets associated with your AWS account are owned by your account. Be cautious of services that create buckets with predictable names. Whenever possible, pre-create these buckets in all regions to prevent hijacking.",
      "Url": "https://www.aquasec.com/blog/bucket-monopoly-breaching-aws-accounts-through-shadow-resources/"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check is based on the 'Bucket Monopoly' vulnerability disclosed by Aqua Security."
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_shadow_resource_vulnerability.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_shadow_resource_vulnerability/s3_bucket_shadow_resource_vulnerability.py

```python
import re

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.logger import logger
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_shadow_resource_vulnerability(Check):
    def execute(self):
        findings = []
        # Predictable bucket name patterns from the research article
        # These patterns are used by AWS services and can be claimed by attackers
        predictable_patterns = {
            "Glue": f"aws-glue-assets-{s3_client.provider.identity.account}-<region>",
            "SageMaker": f"sagemaker-<region>-{s3_client.provider.identity.account}",
            # "CloudFormation": "cf-templates-.*-<region>",
            "EMR": f"aws-emr-studio-{s3_client.provider.identity.account}-<region>",
            "CodeStar": f"aws-codestar-<region>-{s3_client.provider.identity.account}",
            # Add other patterns here as they are discovered
        }

        # Track buckets we've already reported to avoid duplicates
        reported_buckets = set()

        # First, check buckets in the current account
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(self.metadata(), resource=bucket)
            report.region = bucket.region
            report.resource_id = bucket.name
            report.resource_arn = bucket.arn
            report.resource_tags = bucket.tags
            report.status = "PASS"
            report.status_extended = (
                f"S3 bucket {bucket.name} is not a known shadow resource."
            )

            # Check if this bucket matches any predictable pattern
            for service, pattern_format in predictable_patterns.items():
                pattern = pattern_format.replace("<region>", bucket.region)

                if re.match(pattern, bucket.name):
                    if bucket.owner_id != s3_client.audited_canonical_id:
                        report.status = "FAIL"
                        report.status_extended = f"S3 bucket {bucket.name} for service {service} is a known shadow resource and it is owned by another account ({bucket.owner_id})."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"S3 bucket {bucket.name} for service {service} is a known shadow resource but it is correctly owned by the audited account."
                    break
            findings.append(report)
            reported_buckets.add(bucket.name)

        # Now check for shadow resources in other accounts by testing predictable patterns
        # We'll test different regions to see if shadow resources exist
        regions_to_test = (
            s3_client.provider.identity.audited_regions
            or s3_client.regional_clients.keys()
        )

        for region in regions_to_test:
            for service, pattern_format in predictable_patterns.items():
                # Generate bucket name for this region
                bucket_name = pattern_format.replace("<region>", region)

                # Skip if we've already reported this bucket
                if bucket_name in reported_buckets:
                    continue

                logger.info(
                    f"Checking if shadow resource bucket {bucket_name} exists in other accounts"
                )
                # Check if this bucket exists in another account
                if s3_client._head_bucket(bucket_name):
                    report = Check_Report_AWS(self.metadata(), resource={})
                    report.region = region
                    report.resource_id = bucket_name
                    report.resource_arn = (
                        f"arn:{s3_client.audited_partition}:s3:::{bucket_name}"
                    )
                    report.resource_tags = []
                    report.status = "FAIL"
                    report.status_extended = f"S3 bucket {bucket_name} for service {service} is a known shadow resource that exists and is owned by another account."

                    findings.append(report)
                    reported_buckets.add(bucket_name)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_multi_region_access_point_public_access_block.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_multi_region_access_point_public_access_block/s3_multi_region_access_point_public_access_block.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_multi_region_access_point_public_access_block",
  "CheckTitle": "Block Public Access Settings enabled on Multi Region Access Points.",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:s3:region:account-id:accesspoint/access-point-name",
  "Severity": "high",
  "ResourceType": "AwsS3AccessPoint",
  "Description": "Ensures that public access is blocked on S3 Access Points.",
  "Risk": "Leaving S3 multi region access points open to the public in AWS can lead to data exposure, breaches, compliance violations, unauthorized access, and data integrity issues.",
  "RelatedUrl": "https://aws.amazon.com/es/getting-started/hands-on/getting-started-with-amazon-s3-multi-region-access-points/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/s3-controls.html#s3-24",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure S3 multi region access points are private by default, applying strict access controls, and regularly auditing permissions to prevent unauthorized public access.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/multi-region-access-point-block-public-access.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_multi_region_access_point_public_access_block.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_multi_region_access_point_public_access_block/s3_multi_region_access_point_public_access_block.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3control_client import s3control_client


class s3_multi_region_access_point_public_access_block(Check):
    """Ensure that Multi Region Access Points have Public Access Block enabled.

    This check is useful to ensure that Multi Region Access Points have Public Access Block enabled.
    """

    def execute(self):
        """Execute the Multi Region Access Points have Public Access Block enabled check.

        Iterates over all Multi Region Access Points and checks if they have Public Access Block enabled.

        Returns:
            List[Check_Report_AWS]: A list of reports for each Multi Region Access Point.
        """
        findings = []
        for mr_access_point in s3control_client.multi_region_access_points.values():
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=mr_access_point
            )
            report.status = "PASS"
            report.status_extended = f"S3 Multi Region Access Point {mr_access_point.name} of buckets {', '.join(mr_access_point.buckets)} does have Public Access Block enabled."

            if not (
                mr_access_point.public_access_block.block_public_acls
                and mr_access_point.public_access_block.ignore_public_acls
                and mr_access_point.public_access_block.block_public_policy
                and mr_access_point.public_access_block.restrict_public_buckets
            ):
                report.status = "FAIL"
                report.status_extended = f"S3 Multi Region Access Point {mr_access_point.name} of buckets {', '.join(mr_access_point.buckets)} does not have Public Access Block enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_client.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_client.py

```python
from prowler.providers.aws.services.sagemaker.sagemaker_service import SageMaker
from prowler.providers.common.provider import Provider

sagemaker_client = SageMaker(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
