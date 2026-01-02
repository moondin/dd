---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 315
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 315 of 867)

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

---[FILE: s3_bucket_acl_prohibited.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_acl_prohibited/s3_bucket_acl_prohibited.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_acl_prohibited",
  "CheckTitle": "Check if S3 buckets have ACLs enabled",
  "CheckType": [
    "Logging and Monitoring"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have ACLs enabled",
  "Risk": "S3 ACLs are a legacy access control mechanism that predates IAM. IAM and bucket policies are currently the preferred methods.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-ownership-controls --bucket <bucket-name> --ownership-controls Rules=[{ObjectOwnership=BucketOwnerEnforced}]",
      "NativeIaC": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that S3 ACLs are disabled (BucketOwnerEnforced). Use IAM policies and bucket policies to manage access.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_acl_prohibited.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_acl_prohibited/s3_bucket_acl_prohibited.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_acl_prohibited(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            report.status = "FAIL"
            report.status_extended = f"S3 Bucket {bucket.name} has bucket ACLs enabled."
            if bucket.ownership:
                if "BucketOwnerEnforced" in bucket.ownership:
                    report.status = "PASS"
                    report.status_extended = (
                        f"S3 Bucket {bucket.name} has bucket ACLs disabled."
                    )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_cross_account_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_cross_account_access/s3_bucket_cross_account_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_cross_account_access",
  "CheckTitle": "Ensure that general-purpose bucket policies restrict access to other AWS accounts.",
  "CheckType": [
    "Effects/Data Exposure"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "high",
  "ResourceType": "AwsS3Bucket",
  "Description": "This check verifies that S3 bucket policies are configured in a way that limits access to the intended AWS accounts only, preventing unauthorized access by external or unintended accounts.",
  "Risk": "Allowing other AWS accounts to perform sensitive actions (e.g., modifying bucket policies, ACLs, or encryption settings) on your S3 buckets can lead to data exposure, unauthorized access, or misconfigurations, increasing the risk of insider threats or attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/s3-controls.html#s3-6",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review and update your S3 bucket policies to remove permissions that grant external AWS accounts access to critical actions and implement least privilege principles to ensure sensitive operations are restricted to trusted accounts only",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_cross_account_access.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_cross_account_access/s3_bucket_cross_account_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_policy_public
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_cross_account_access(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            if bucket.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            report.status = "PASS"
            report.status_extended = f"S3 Bucket {bucket.name} has a bucket policy but it does not allow cross account access."

            if not bucket.policy:
                report.status = "PASS"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} does not have a bucket policy."
                )
            elif is_policy_public(
                bucket.policy, s3_client.audited_account, is_cross_account_allowed=False
            ):
                report.status = "FAIL"
                report.status_extended = f"S3 Bucket {bucket.name} has a bucket policy allowing cross account access."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_cross_region_replication.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_cross_region_replication/s3_bucket_cross_region_replication.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_cross_region_replication",
  "CheckTitle": "Check if S3 buckets use cross region replication.",
  "CheckType": [
    "Secure access management"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "low",
  "ResourceType": "AwsS3Bucket",
  "Description": "Verifying whether S3 buckets have cross-region replication enabled, ensuring data redundancy and availability across multiple AWS regions",
  "Risk": "Without cross-region replication in S3 buckets, data is at risk of being lost or inaccessible if an entire region goes down, leading to potential service disruptions and data unavailability.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/s3-controls.html#s3-7",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-s3-bucket-has-cross-region-replication-enabled#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that S3 buckets have cross region replication.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-walkthrough1.html"
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

---[FILE: s3_bucket_cross_region_replication.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_cross_region_replication/s3_bucket_cross_region_replication.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_cross_region_replication(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            report.status = "FAIL"
            report.status_extended = f"S3 Bucket {bucket.name} does not have correct cross region replication configuration."
            if bucket.replication_rules:
                for rule in bucket.replication_rules:
                    if (
                        bucket.versioning
                        and rule.status == "Enabled"
                        and rule.destination
                    ):
                        if rule.destination not in s3_client.buckets:
                            report.status = "FAIL"
                            report.status_extended = f"S3 Bucket {bucket.name} has cross region replication rule {rule.id} in bucket {rule.destination.split(':')[-1]} which is out of Prowler's scope."
                        else:
                            destination_bucket = s3_client.buckets[rule.destination]
                            if destination_bucket.region != bucket.region:
                                report.status = "PASS"
                                report.status_extended = f"S3 Bucket {bucket.name} has cross region replication rule {rule.id} in bucket {destination_bucket.name} located in region {destination_bucket.region}."
                                break
                            else:
                                report.status = "FAIL"
                                report.status_extended = f"S3 Bucket {bucket.name} has cross region replication rule {rule.id} in bucket {destination_bucket.name} located in the same region."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_default_encryption.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_default_encryption/s3_bucket_default_encryption.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_default_encryption",
  "CheckTitle": "Check if S3 buckets have default encryption (SSE) enabled or use a bucket policy to enforce it.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have default encryption (SSE) enabled or use a bucket policy to enforce it.",
  "Risk": "Amazon S3 default encryption provides a way to set the default encryption behavior for an S3 bucket. This will ensure data-at-rest is encrypted.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-encryption --bucket <bucket_name> --server-side-encryption-configuration '{'Rules': [{'ApplyServerSideEncryptionByDefault': {'SSEAlgorithm': 'AES256'}}]}'",
      "NativeIaC": "https://docs.prowler.com/checks/aws/s3-policies/s3_14-data-encrypted-at-rest#cloudformation",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/aws/s3-policies/s3_14-data-encrypted-at-rest#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that S3 buckets have encryption at rest enabled.",
      "Url": "https://aws.amazon.com/blogs/security/how-to-prevent-uploads-of-unencrypted-objects-to-amazon-s3/"
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

---[FILE: s3_bucket_default_encryption.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_default_encryption/s3_bucket_default_encryption.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_default_encryption(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            if bucket.encryption:
                report.status = "PASS"
                report.status_extended = f"S3 Bucket {bucket.name} has Server Side Encryption with {bucket.encryption}."
            else:
                report.status = "FAIL"
                report.status_extended = f"S3 Bucket {bucket.name} does not have Server Side Encryption enabled."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_event_notifications_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_event_notifications_enabled/s3_bucket_event_notifications_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_event_notifications_enabled",
  "CheckTitle": "Check if S3 buckets have event notifications enabled.",
  "CheckType": [
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Ensure whether S3 buckets have event notifications enabled.",
  "Risk": "Without event notifications, important actions on S3 buckets may go unnoticed, leading to missed opportunities for timely response to critical changes, such as object creation, deletion, or updates that could impact data security and availability.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html#supported-notification-event-types",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/s3-controls.html#s3-11",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable event notifications for all S3 general-purpose buckets to monitor important events such as object creation, deletion, tagging, and lifecycle events, ensuring visibility and quick action on relevant changes.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_event_notifications_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_event_notifications_enabled/s3_bucket_event_notifications_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_event_notifications_enabled(Check):
    """Ensure S3 Buckets have event notifications enabled

    This check will return a FAIL if the S3 Bucket does not have event notifications enabled.
    """

    def execute(self) -> list[Check_Report_AWS]:
        """Execute the s3_bucket_event_notifications_enabled check

        Iterates over all S3 Buckets and checks if they have event notifications enabled.

        Returns:
            list[Check_Report_AWS]: List of Check_Report_AWS objects
        """
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            report.status = "FAIL"
            report.status_extended = (
                f"S3 Bucket {bucket.name} does not have event notifications enabled."
            )

            if bucket.notification_config:
                report.status = "PASS"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} does have event notifications enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_kms_encryption.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_kms_encryption/s3_bucket_kms_encryption.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_kms_encryption",
  "CheckTitle": "Check if S3 buckets have KMS encryption enabled.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have KMS encryption enabled.",
  "Risk": "Amazon S3 KMS encryption provides a way to set the encryption behavior for an S3 bucket using a managed key. This will ensure data-at-rest is encrypted.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html",
  "Remediation": {
    "Code": {
      "CLI": "aws put-bucket-encryption --bucket <BUCKET_NAME> --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"aws:kms\",\"KMSMasterKeyID\":\"arn:aws:kms:<REGION>:<ACCOUNT_ID>:key/<KEY_ID>\"}}]}'",
      "NativeIaC": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/S3/encrypted-with-kms-customer-master-keys.html",
      "Other": "https://www.trendmicro.com/cloudoneconformity-staging/knowledge-base/aws/S3/encrypted-with-kms-customer-master-keys.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-s3-buckets-are-encrypted-with-kms-by-default#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that S3 buckets have encryption at rest enabled using KMS.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"
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

---[FILE: s3_bucket_kms_encryption.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_kms_encryption/s3_bucket_kms_encryption.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_kms_encryption(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            if bucket.encryption == "aws:kms" or bucket.encryption == "aws:kms:dsse":
                report.status = "PASS"
                report.status_extended = f"S3 Bucket {bucket.name} has Server Side Encryption with {bucket.encryption}."
            else:
                report.status = "FAIL"
                report.status_extended = f"Server Side Encryption is not configured with kms for S3 Bucket {bucket.name}."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_level_public_access_block.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_level_public_access_block/s3_bucket_level_public_access_block.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_level_public_access_block",
  "CheckTitle": "Check S3 Bucket Level Public Access Block.",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check S3 Bucket Level Public Access Block.",
  "Risk": "Public access policies may be applied to sensitive data buckets.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-public-access-block --region <REGION_NAME> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --bucket <BUCKET_NAME>",
      "NativeIaC": "",
      "Other": "https://github.com/cloudmatos/matos/tree/master/remediations/aws/s3/s3/block-public-access",
      "Terraform": "https://docs.prowler.com/checks/aws/s3-policies/bc_aws_s3_20#terraform"
    },
    "Recommendation": {
      "Text": "You can enable Public Access Block at the bucket level to prevent the exposure of your data stored in S3.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html"
    }
  },
  "Categories": [],
  "Tags": {
    "Tag1Key": "value",
    "Tag2Key": "value"
  },
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_level_public_access_block.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_level_public_access_block/s3_bucket_level_public_access_block.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client
from prowler.providers.aws.services.s3.s3control_client import s3control_client


class s3_bucket_level_public_access_block(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            if bucket.public_access_block:
                report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
                report.status = "PASS"
                report.status_extended = f"Block Public Access is configured for the S3 Bucket {bucket.name}."
                if not (
                    bucket.public_access_block.ignore_public_acls
                    and bucket.public_access_block.restrict_public_buckets
                ):
                    if (
                        s3control_client.account_public_access_block
                        and s3control_client.account_public_access_block.ignore_public_acls
                        and s3control_client.account_public_access_block.restrict_public_buckets
                    ):
                        report.status_extended = f"Block Public Access is configured for the S3 Bucket {bucket.name} at account {s3_client.audited_account} level."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"Block Public Access is not configured for the S3 Bucket {bucket.name}."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_lifecycle_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_lifecycle_enabled/s3_bucket_lifecycle_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_lifecycle_enabled",
  "CheckTitle": "Check if S3 buckets have a Lifecycle configuration enabled",
  "CheckType": [
    "AWS Foundational Security Best Practices"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "low",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have Lifecycle configuration enabled.",
  "Risk": "The risks of not having lifecycle management enabled for S3 buckets include higher storage costs, unmanaged data retention, and potential non-compliance with data policies.",
  "RelatedUrl": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/s3-controls.html#s3-13",
      "Terraform": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/S3/lifecycle-configuration.html"
    },
    "Recommendation": {
      "Text": "Enable lifecycle policies on your S3 buckets to automatically manage the transition and expiration of data.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-set-lifecycle-configuration-intro.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_lifecycle_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_lifecycle_enabled/s3_bucket_lifecycle_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_lifecycle_enabled(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            report.status = "FAIL"
            report.status_extended = f"S3 Bucket {bucket.name} does not have a lifecycle configuration enabled."

            if bucket.lifecycle:
                for configuration in bucket.lifecycle:
                    if configuration.status == "Enabled":
                        report.status = "PASS"
                        report.status_extended = f"S3 Bucket {bucket.name} has a lifecycle configuration enabled."
                        break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_no_mfa_delete.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_no_mfa_delete/s3_bucket_no_mfa_delete.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_no_mfa_delete",
  "CheckTitle": "Check if S3 bucket MFA Delete is not enabled.",
  "CheckType": [
    "Logging and Monitoring"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 bucket MFA Delete is not enabled.",
  "Risk": "Your security credentials are compromised or unauthorized access is granted.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3api put-bucket-versioning --profile my-root-profile --bucket my-bucket-name --versioning-configuration Status=Enabled,MFADelete=Enabled --mfa 'arn:aws:iam::00000000:mfa/root-account-mfa-device 123456'",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/aws/s3-policies/bc_aws_s3_24#terraform"
    },
    "Recommendation": {
      "Text": "Adding MFA delete to an S3 bucket, requires additional authentication when you change the version state of your bucket or you delete and object version adding another layer of security in the event your security credentials are compromised or unauthorized access is granted.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/MultiFactorAuthenticationDelete.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_no_mfa_delete.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_no_mfa_delete/s3_bucket_no_mfa_delete.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_no_mfa_delete(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            if bucket.mfa_delete:
                report.status = "PASS"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} has MFA Delete enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} has MFA Delete disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_object_lock.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_object_lock/s3_bucket_object_lock.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_object_lock",
  "CheckTitle": "Check if S3 buckets have object lock enabled",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "low",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have object lock enabled",
  "Risk": "Store objects using a write-once-read-many (WORM) model to help you prevent objects from being deleted or overwritten for a fixed amount of time or indefinitely. That helps to prevent ransomware attacks.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws s3 put-object-lock-configuration --bucket <BUCKET_NAME> --object-lock-configuration '{\"ObjectLockEnabled\":\"Enabled\",\"Rule\":{\"DefaultRetention\":{\"Mode\":\"GOVERNANCE\",\"Days\":1}}}'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/S3/object-lock.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-that-s3-bucket-has-lock-configuration-enabled-by-default#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that your Amazon S3 buckets have Object Lock feature enabled in order to prevent the objects they store from being deleted.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_object_lock.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_object_lock/s3_bucket_object_lock.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_object_lock(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            if bucket.object_lock:
                report.status = "PASS"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} has Object Lock enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} has Object Lock disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_object_versioning.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_object_versioning/s3_bucket_object_versioning.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_object_versioning",
  "CheckTitle": "Check if S3 buckets have object versioning enabled",
  "CheckType": [
    "Data Protection"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "medium",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have object versioning enabled",
  "Risk": "With versioning, you can easily recover from both unintended user actions and application failures.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/s3-policies/s3_16-enable-versioning#aws-console",
      "Terraform": "https://docs.prowler.com/checks/aws/s3-policies/s3_16-enable-versioning#terraform"
    },
    "Recommendation": {
      "Text": "Configure versioning using the Amazon console or API for buckets with sensitive information that is changing frequently, and backup may not be enough to capture all the changes.",
      "Url": "https://docs.aws.amazon.com/AmazonS3/latest/dev-retired/Versioning.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_object_versioning.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_object_versioning/s3_bucket_object_versioning.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.s3.s3_client import s3_client


class s3_bucket_object_versioning(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            if bucket.versioning:
                report.status = "PASS"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} has versioning enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} has versioning disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_policy_public_write_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_policy_public_write_access/s3_bucket_policy_public_write_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "s3_bucket_policy_public_write_access",
  "CheckTitle": "Check if S3 buckets have policies which allow WRITE access.",
  "CheckType": [
    "IAM"
  ],
  "ServiceName": "s3",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:s3:::bucket_name",
  "Severity": "critical",
  "ResourceType": "AwsS3Bucket",
  "Description": "Check if S3 buckets have policies which allow WRITE access.",
  "Risk": "Non intended users can put objects in a given bucket.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/s3-policies/s3_18-write-permissions-public#aws-console",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure proper bucket policy is in place with the least privilege principle applied.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html"
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

---[FILE: s3_bucket_policy_public_write_access.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_policy_public_write_access/s3_bucket_policy_public_write_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_policy_public
from prowler.providers.aws.services.s3.s3_client import s3_client
from prowler.providers.aws.services.s3.s3control_client import s3control_client


class s3_bucket_policy_public_write_access(Check):
    def execute(self):
        findings = []
        for bucket in s3_client.buckets.values():
            if bucket.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=bucket)
            # Check if bucket policy allow public write access
            if not bucket.policy:
                report.status = "PASS"
                report.status_extended = (
                    f"S3 Bucket {bucket.name} does not have a bucket policy."
                )
            elif (
                s3control_client.account_public_access_block
                and s3control_client.account_public_access_block.restrict_public_buckets
            ):
                report.status = "PASS"
                report.status_extended = (
                    "All S3 public access blocked at account level."
                )
            elif (
                bucket.public_access_block
                and bucket.public_access_block.restrict_public_buckets
            ):
                report.status = "PASS"
                report.status_extended = (
                    f"S3 public access blocked at bucket level for {bucket.name}."
                )
            else:
                report.status = "PASS"
                report.status_extended = f"S3 Bucket {bucket.name} does not allow public write access in the bucket policy."
                if is_policy_public(
                    bucket.policy,
                    s3_client.audited_account,
                    not_allowed_actions=[
                        "s3:PutObject",
                        "s3:DeleteObject",
                        "s3:*",
                        "s3:Put*",
                        "s3:Delete*",
                    ],
                ):
                    report.status = "FAIL"
                    report.status_extended = f"S3 Bucket {bucket.name} allows public write access in the bucket policy."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3_bucket_policy_public_write_access_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_bucket_policy_public_write_access/s3_bucket_policy_public_write_access_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.s3.s3_client import s3_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the S3 bucket's policy to remove public access.
    Specifically, this fixer delete the policy of the public bucket.
    Requires the s3:DeleteBucketPolicy permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:DeleteBucketPolicy",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The S3 bucket name.
        region (str): AWS region where the S3 bucket exists.
    Returns:
        bool: True if the operation is successful (policy updated), False otherwise.
    """
    try:
        regional_client = s3_client.regional_clients[region]

        regional_client.delete_bucket_policy(Bucket=resource_id)

    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

````
