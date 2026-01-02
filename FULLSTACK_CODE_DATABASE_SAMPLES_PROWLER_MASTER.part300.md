---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 300
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 300 of 867)

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

---[FILE: kinesis_service.py]---
Location: prowler-master/prowler/providers/aws/services/kinesis/kinesis_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Dict, List, Optional

from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Kinesis(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.streams = {}
        self.__threading_call__(self._list_streams)
        self.__threading_call__(self._describe_stream, self.streams.values())
        self.__threading_call__(self._list_tags_for_stream, self.streams.values())

    def _list_streams(self, regional_client):
        logger.info("Kinesis - Listing Kinesis Streams...")
        try:
            list_streams_paginator = regional_client.get_paginator("list_streams")
            for page in list_streams_paginator.paginate():
                for stream in page["StreamSummaries"]:
                    arn = stream["StreamARN"]
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.streams[arn] = Stream(
                            arn=arn,
                            name=stream["StreamName"],
                            region=regional_client.region,
                            status=StreamStatus(stream.get("StreamStatus", "ACTIVE")),
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_stream(self, stream):
        logger.info(f"Kinesis - Describing Stream {stream.name}...")
        try:
            stream_description = (
                self.regional_clients[stream.region]
                .describe_stream(StreamName=stream.name)
                .get("StreamDescription", {})
            )
            stream.encrypted_at_rest = EncryptionType(
                stream_description.get("EncryptionType", "NONE")
            )
            stream.retention_period = stream_description.get("RetentionPeriodHours", 24)
        except Exception as error:
            logger.error(
                f"{stream.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_stream(self, stream):
        logger.info(f"Kinesis - Listing tags for Stream {stream.name}...")
        try:
            stream.tags = (
                self.regional_clients[stream.region]
                .list_tags_for_stream(StreamName=stream.name)
                .get("Tags", [])
            )
        except Exception as error:
            logger.error(
                f"{stream.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class EncryptionType(Enum):
    """Enum for Kinesis Stream Encryption Type"""

    NONE = "NONE"
    KMS = "KMS"


class StreamStatus(Enum):
    """Enum for Kinesis Stream Status"""

    ACTIVE = "ACTIVE"
    CREATING = "CREATING"
    DELETING = "DELETING"
    UPDATING = "UPDATING"


class Stream(BaseModel):
    """Model for Kinesis Stream"""

    arn: str
    region: str
    name: str
    status: StreamStatus
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)
    encrypted_at_rest: EncryptionType = EncryptionType.NONE
    retention_period: int = 24  # 1 day
```

--------------------------------------------------------------------------------

---[FILE: kinesis_stream_data_retention_period.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kinesis/kinesis_stream_data_retention_period/kinesis_stream_data_retention_period.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kinesis_stream_data_retention_period",
  "CheckTitle": "Kinesis stream retains data for at least the required minimum hours",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "kinesis",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsKinesisStream",
  "Description": "**Kinesis Data Streams** retention window is evaluated to confirm records are kept for at least the configured minimum duration (default `168` hours).",
  "Risk": "Insufficient retention causes records to expire before consumers read or reprocess them, undermining **availability** and analytics **integrity**. Backlogs or outages can create irreversible data gaps, hinder investigations and recovery, and enable denial-of-service-by-lag against event pipelines.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/kinesis-controls.html#kinesis-3"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kinesis increase-stream-retention-period --stream-name <example_resource_name> --retention-period-hours 168",
      "NativeIaC": "```yaml\n# CloudFormation: set Kinesis stream retention to minimum required hours\nResources:\n  <example_resource_name>:\n    Type: AWS::Kinesis::Stream\n    Properties:\n      ShardCount: 1\n      RetentionPeriodHours: 168  # critical: sets retention to >= 168 hours to pass the check\n```",
      "Other": "1. Sign in to the AWS Console and open Amazon Kinesis\n2. Go to Data streams and select <example_resource_name>\n3. Click Edit\n4. Set Retention period to 168 hours (or higher, per your policy)\n5. Click Save changes",
      "Terraform": "```hcl\n# Kinesis stream with adequate retention period\nresource \"aws_kinesis_stream\" \"<example_resource_name>\" {\n  name             = \"<example_resource_name>\"\n  shard_count      = 1\n  retention_period = 168  # critical: sets retention to >= 168 hours to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Set the **retention period** to exceed worst-case consumer lag, replay needs, and compliance windows; use at least `168` hours by default (or customize as necessary) and raise as required. Enforce **change control** and least privilege on retention changes, monitor consumer lag, and maintain **secondary durability** (e.g., archival) for critical streams.",
      "Url": "https://hub.prowler.com/check/kinesis_stream_data_retention_period"
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

---[FILE: kinesis_stream_data_retention_period.py]---
Location: prowler-master/prowler/providers/aws/services/kinesis/kinesis_stream_data_retention_period/kinesis_stream_data_retention_period.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kinesis.kinesis_client import kinesis_client


class kinesis_stream_data_retention_period(Check):
    """Ensure Kinesis Stream has an adequate data retention period

    The retention period for Kinesis Streams should be set to a value that meets the organization's data retention policy.
    """

    def execute(self):
        """Execute Check Kinesis Stream data retention period

        Iterate over all Kinesis Streams and check if the retention period is adequate.

        Returns:
            findings (list): List of findings
        """
        findings = []
        for stream in kinesis_client.streams.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=stream)
            report.status = "FAIL"
            report.status_extended = f"Kinesis Stream {stream.name} does not have an adequate data retention period ({stream.retention_period}hrs)."

            if stream.retention_period >= kinesis_client.audit_config.get(
                "min_kinesis_stream_retention_hours", 168
            ):
                report.status = "PASS"
                report.status_extended = f"Kinesis Stream {stream.name} does have an adequate data retention period ({stream.retention_period}hrs)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kinesis_stream_encrypted_at_rest.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kinesis/kinesis_stream_encrypted_at_rest/kinesis_stream_encrypted_at_rest.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kinesis_stream_encrypted_at_rest",
  "CheckTitle": "Kinesis stream is encrypted at rest with KMS",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls"
  ],
  "ServiceName": "kinesis",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsKinesisStream",
  "Description": "**Amazon Kinesis Data Streams** with **server-side encryption** use **AWS KMS** to protect records at rest. The evaluation determines whether a stream has `SSE-KMS` configured with a KMS key; streams lacking KMS-based at rest encryption are identified.",
  "Risk": "Without **SSE-KMS**, records in shards may be exposed in plaintext if storage, backups, or analytics exports are accessed, undermining **confidentiality**. Absence of KMS controls also reduces **integrity** and oversight by removing key policies, rotation, and audit trails-enabling covert data exfiltration or insider misuse.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/kinesis-controls.html#kinesis-1",
    "https://docs.aws.amazon.com/streams/latest/dev/getting-started-with-sse.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Kinesis/server-side-encryption.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kinesis start-stream-encryption --stream-name <KINESIS_STREAM_NAME> --encryption-type KMS --key-id alias/aws/kinesis",
      "NativeIaC": "```yaml\n# CloudFormation: enable KMS encryption on a Kinesis stream\nResources:\n  <example_resource_name>:\n    Type: AWS::Kinesis::Stream\n    Properties:\n      ShardCount: 1\n      StreamEncryption:\n        EncryptionType: KMS  # Critical: enables KMS encryption at rest\n        KeyId: alias/aws/kinesis  # Critical: uses AWS managed Kinesis KMS key\n```",
      "Other": "1. Open the AWS Console and go to Amazon Kinesis > Data streams\n2. Select the stream\n3. On the Details tab, click Edit in Server-side encryption\n4. Select Enabled\n5. Choose the (Default) aws/kinesis KMS key\n6. Click Save",
      "Terraform": "```hcl\n# Enable KMS encryption on a Kinesis stream\nresource \"aws_kinesis_stream\" \"<example_resource_name>\" {\n  name            = \"<example_resource_name>\"\n  shard_count     = 1\n  encryption_type = \"KMS\"            # Critical: enables KMS encryption at rest\n  kms_key_id      = \"alias/aws/kinesis\" # Critical: uses AWS managed Kinesis KMS key\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **SSE-KMS** on all streams.\n- Use **customer-managed keys** for rotation and ownership\n- Enforce **least privilege** on KMS grants; limit cross-account use\n- Monitor key usage and require encryption in CI/CD",
      "Url": "https://hub.prowler.com/check/kinesis_stream_encrypted_at_rest"
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

---[FILE: kinesis_stream_encrypted_at_rest.py]---
Location: prowler-master/prowler/providers/aws/services/kinesis/kinesis_stream_encrypted_at_rest/kinesis_stream_encrypted_at_rest.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kinesis.kinesis_client import kinesis_client
from prowler.providers.aws.services.kinesis.kinesis_service import EncryptionType


class kinesis_stream_encrypted_at_rest(Check):
    def execute(self):
        findings = []
        for stream in kinesis_client.streams.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=stream)
            report.status = "FAIL"
            report.status_extended = (
                f"Kinesis Stream {stream.name} is not encrypted at rest."
            )

            if stream.encrypted_at_rest == EncryptionType.KMS:
                report.status = "PASS"
                report.status_extended = (
                    f"Kinesis Stream {stream.name} is encrypted at rest."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kms_client.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_client.py

```python
from prowler.providers.aws.services.kms.kms_service import KMS
from prowler.providers.common.provider import Provider

kms_client = KMS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: kms_service.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_service.py
Signals: Pydantic

```python
import json
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class KMS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.keys = []
        self.__threading_call__(self._list_keys)
        if self.keys:
            self._describe_key()
            self._get_key_rotation_status()
            self._get_key_policy()
            self._list_resource_tags()

    def _list_keys(self, regional_client):
        logger.info("KMS - Listing Keys...")
        try:
            list_keys_paginator = regional_client.get_paginator("list_keys")
            for page in list_keys_paginator.paginate():
                for key in page["Keys"]:
                    try:
                        if not self.audit_resources or (
                            is_resource_filtered(key["KeyArn"], self.audit_resources)
                        ):
                            self.keys.append(
                                Key(
                                    id=key["KeyId"],
                                    arn=key["KeyArn"],
                                    region=regional_client.region,
                                )
                            )
                    except Exception as error:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _describe_key(self):
        logger.info("KMS - Describing Key...")
        try:
            for key in self.keys:
                regional_client = self.regional_clients[key.region]
                try:
                    response = regional_client.describe_key(KeyId=key.id)
                    key.state = response["KeyMetadata"]["KeyState"]
                    key.origin = response["KeyMetadata"]["Origin"]
                    key.manager = response["KeyMetadata"]["KeyManager"]
                    key.spec = response["KeyMetadata"]["CustomerMasterKeySpec"]
                    key.multi_region = response["KeyMetadata"]["MultiRegion"]
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _get_key_rotation_status(self):
        logger.info("KMS - Get Key Rotation Status...")
        try:
            for key in self.keys:
                if (
                    key.origin
                    and key.manager
                    and "EXTERNAL" not in key.origin
                    and "AWS" not in key.manager
                ):
                    regional_client = self.regional_clients[key.region]
                    try:
                        key.rotation_enabled = regional_client.get_key_rotation_status(
                            KeyId=key.id
                        )["KeyRotationEnabled"]
                    except Exception as error:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _get_key_policy(self):
        logger.info("KMS - Get Key Policy...")
        try:
            for key in self.keys:
                if (
                    key.manager and key.manager == "CUSTOMER"
                ):  # only customer KMS have policies
                    regional_client = self.regional_clients[key.region]
                    try:
                        key.policy = json.loads(
                            regional_client.get_key_policy(
                                KeyId=key.id, PolicyName="default"
                            )["Policy"]
                        )
                    except Exception as error:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _list_resource_tags(self):
        logger.info("KMS - List Tags...")
        try:
            for key in self.keys:
                if (
                    key.manager and key.manager == "CUSTOMER"
                ):  # only check customer KMS keys
                    try:
                        regional_client = self.regional_clients[key.region]
                        response = regional_client.list_resource_tags(
                            KeyId=key.id,
                        )["Tags"]
                        key.tags = response
                    except Exception as error:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )


class Key(BaseModel):
    id: str
    arn: str
    state: Optional[str]
    origin: Optional[str]
    manager: Optional[str]
    rotation_enabled: Optional[bool]
    policy: Optional[dict]
    spec: Optional[str]
    region: str
    multi_region: Optional[bool]
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_are_used.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_are_used/kms_cmk_are_used.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kms_cmk_are_used",
  "CheckTitle": "KMS customer managed key is enabled or scheduled for deletion",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "kms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsKmsKey",
  "Description": "**Customer-managed KMS keys** are assessed by key state. Keys in `Enabled` are considered in use. Keys not `Enabled` and not `PendingDeletion` are identified as unused, while those in `PendingDeletion` are recognized as scheduled for removal.",
  "Risk": "Keeping **unused CMKs** increases **attack surface** and **cost**.\n\nIf such keys are re-enabled or misconfigured, they can grant unintended decryption, impacting **confidentiality**. Deleting a key mistakenly thought unused can cause **irrecoverable data loss**, harming **availability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys-determining-usage.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kms enable-key --key-id <key_id>",
      "NativeIaC": "```yaml\n# CloudFormation: ensure the KMS CMK is enabled\nResources:\n  <example_resource_name>:\n    Type: AWS::KMS::Key\n    Properties:\n      Enabled: true  # Critical: enables the key so its state is \"Enabled\" (PASS)\n      KeyPolicy:\n        Version: '2012-10-17'\n        Statement:\n          - Sid: Enable IAM User Permissions\n            Effect: Allow\n            Principal:\n              AWS: !Sub arn:aws:iam::${AWS::AccountId}:root\n            Action: 'kms:*'\n            Resource: '*'\n```",
      "Other": "1. Sign in to the AWS Console and open Key Management Service (KMS)\n2. Go to Customer managed keys and select the affected key\n3. Choose Key actions > Enable\n4. Confirm to enable the key",
      "Terraform": "```hcl\n# Terraform: ensure the KMS CMK is enabled\nresource \"aws_kms_key\" \"<example_resource_name>\" {\n  is_enabled = true  # Critical: sets key state to Enabled (PASS)\n}\n```"
    },
    "Recommendation": {
      "Text": "Adopt a **key lifecycle**: confirm actual usage with logs, owners, and tags; keep keys `Enabled` only when required; otherwise **schedule deletion** with a waiting period.\n\nEnforce **least privilege** to enable/disable or delete keys, require approvals, and monitor KMS activity with **separation of duties**.",
      "Url": "https://hub.prowler.com/check/kms_cmk_are_used"
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

---[FILE: kms_cmk_are_used.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_are_used/kms_cmk_are_used.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kms.kms_client import kms_client


class kms_cmk_are_used(Check):
    def execute(self):
        findings = []
        for key in kms_client.keys:
            # Only check CMKs keys
            if key.manager == "CUSTOMER":
                report = Check_Report_AWS(metadata=self.metadata(), resource=key)
                if key.state != "Enabled":
                    if key.state == "PendingDeletion":
                        report.status = "PASS"
                        report.status_extended = f"KMS CMK {key.id} is not being used but it has scheduled deletion."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"KMS CMK {key.id} is not being used."
                else:
                    report.status = "PASS"
                    report.status_extended = f"KMS CMK {key.id} is being used."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_not_deleted_unintentionally.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_not_deleted_unintentionally/kms_cmk_not_deleted_unintentionally.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kms_cmk_not_deleted_unintentionally",
  "CheckTitle": "AWS KMS customer managed key is not scheduled for deletion",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "kms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsKmsKey",
  "Description": "**Customer-managed KMS keys** are evaluated for the `PendingDeletion` state, indicating a scheduled deletion during the mandatory waiting period.",
  "Risk": "A key scheduled for deletion can lead to **permanent loss of decryption capability**, degrading **availability** and **integrity** of data and workloads. Accidental or malicious scheduling enables **cryptographic erasure**, causing outages, failed restores, and broken integrations during and after the wait window.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys-scheduling-key-deletion.html",
    "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys-scheduling-key-deletion.html#deleting-keys-scheduling-key-deletion-console"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kms cancel-key-deletion --key-id <KEY_ID>",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Management Console and open AWS KMS\n2. Go to Customer managed keys and select the key with status \"Pending deletion\"\n3. Click Key actions > Cancel key deletion\n4. Confirm to cancel; the key status will change from Pending deletion",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Prevent unintended deletion:\n- Enforce **least privilege** and **separation of duties** for key admins\n- Require change approvals and alerts on deletion events\n- Prefer **disabling** unused keys over deleting\n- Set sufficient waiting periods and review keys in `PendingDeletion` to verify authorization",
      "Url": "https://hub.prowler.com/check/kms_cmk_not_deleted_unintentionally"
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

---[FILE: kms_cmk_not_deleted_unintentionally.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_not_deleted_unintentionally/kms_cmk_not_deleted_unintentionally.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kms.kms_client import kms_client


class kms_cmk_not_deleted_unintentionally(Check):
    def execute(self):
        findings = []
        for key in kms_client.keys:
            if key.manager == "CUSTOMER":
                if key.state != "Disabled" or kms_client.provider.scan_unused_services:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=key)
                    report.status = "PASS"
                    report.status_extended = (
                        f"KMS CMK {key.id} is not scheduled for deletion."
                    )
                    if key.state == "PendingDeletion":
                        report.status = "FAIL"
                        report.status_extended = f"KMS CMK {key.id} is scheduled for deletion, revert it if it was unintentionally."
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_not_deleted_unintentionally_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_not_deleted_unintentionally/kms_cmk_not_deleted_unintentionally_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.kms.kms_client import kms_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Cancel the scheduled deletion of a KMS key.
    Specifically, this fixer calls the 'cancel_key_deletion' method to restore the KMS key's availability if it is marked for deletion.
    Requires the kms:CancelKeyDeletion permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "kms:CancelKeyDeletion",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The ID of the KMS key to cancel the deletion for.
        region (str): AWS region where the KMS key exists.
    Returns:
        bool: True if the operation is successful (deletion cancellation is completed), False otherwise.
    """
    try:
        regional_client = kms_client.regional_clients[region]
        regional_client.cancel_key_deletion(KeyId=resource_id)
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_not_multi_region.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_not_multi_region/kms_cmk_not_multi_region.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kms_cmk_not_multi_region",
  "CheckTitle": "AWS KMS customer managed key is single-Region",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "kms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsKmsKey",
  "Description": "**AWS KMS customer-managed keys** in an `Enabled` state are assessed for the `multi-Region` setting. The finding highlights keys with the `multi-Region` property enabled.",
  "Risk": "Shared key material across Regions lets access in one Region decrypt data from another, eroding **confidentiality** and **data residency**. A misconfigured policy or weaker controls in a replica expand the blast radius. For signing/HMAC keys, compromise enables cross-Region signature forgery, impacting **integrity** and **auditability**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html#multi-region-concepts",
    "https://docs.aws.amazon.com/kms/latest/developerguide/mrk-when-to-use.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: create a single-Region KMS key\nResources:\n  ExampleKmsKey:\n    Type: AWS::KMS::Key\n    Properties:\n      MultiRegion: false  # Critical: ensures the key is single-Region to pass the check\n      KeyPolicy:          # Minimal policy required for key creation\n        Version: '2012-10-17'\n        Statement:\n          - Effect: Allow\n            Principal:\n              AWS: !Sub arn:aws:iam::${AWS::AccountId}:root\n            Action: 'kms:*'\n            Resource: '*'\n```",
      "Other": "1. In the AWS Console, go to Key Management Service (KMS) > Customer managed keys\n2. Identify keys showing Multi-Region: Yes (these FAIL the check)\n3. Click Create key and ensure Multi-Region is not selected (single-Region)\n4. Update your services/aliases to use the new single-Region key\n5. Re-encrypt or rotate data to the new key where required\n6. After migration, disable the old multi-Region key and schedule its deletion",
      "Terraform": "```hcl\n# Terraform: create a single-Region KMS key\nresource \"aws_kms_key\" \"example\" {\n  multi_region = false  # Critical: creates a single-Region key to pass the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer **single-Region keys** by default; use **multi-Region** only with a documented need. Apply **least privilege** and **separation of duties**; limit who can create or replicate such keys. Isolate per Region/tenant/workload, standardize policy and logging across Regions, and retire multi-Region keys where unnecessary.",
      "Url": "https://hub.prowler.com/check/kms_cmk_not_multi_region"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Multi-region keys should be used only when absolutely necessary, such as for cross-region disaster recovery, and should be carefully managed with strict access controls."
}
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_not_multi_region.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_not_multi_region/kms_cmk_not_multi_region.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kms.kms_client import kms_client


class kms_cmk_not_multi_region(Check):
    """kms_cmk_not_multi_region verifies if a KMS key is multi-regional"""

    def execute(self) -> List[Check_Report_AWS]:
        findings = []

        for key in kms_client.keys:
            if key.manager == "CUSTOMER" and key.state == "Enabled":
                report = Check_Report_AWS(metadata=self.metadata(), resource=key)
                report.status = "PASS"
                report.status_extended = f"KMS CMK {key.id} is a single-region key."

                if key.multi_region:
                    report.status = "FAIL"
                    report.status_extended = f"KMS CMK {key.id} is a multi-region key."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_rotation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_rotation_enabled/kms_cmk_rotation_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kms_cmk_rotation_enabled",
  "CheckTitle": "KMS customer-managed symmetric CMK has automatic rotation enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "kms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsKmsKey",
  "Description": "**Customer-managed KMS symmetric keys** in the `Enabled` state are evaluated to confirm `automatic rotation` of key material is configured",
  "Risk": "Without **automatic rotation**, long-lived key material increases confidentiality and integrity risk. If a KMS key is exposed, attackers can unwrap data keys and decrypt stored data until the key changes. It also reduces crypto agility and may conflict with mandated rotation policies.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
    "https://aws.amazon.com/blogs/security/how-to-get-ready-for-certificate-transparency/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kms enable-key-rotation --key-id <KEY_ID>",
      "NativeIaC": "```yaml\n# CloudFormation: KMS key with automatic rotation enabled\nResources:\n  <example_resource_name>:\n    Type: AWS::KMS::Key\n    Properties:\n      EnableKeyRotation: true  # Critical: enables automatic rotation so the key passes the check\n      KeyPolicy:\n        Version: \"2012-10-17\"\n        Statement:\n          - Effect: Allow\n            Principal:\n              AWS: !Sub arn:aws:iam::${AWS::AccountId}:root\n            Action: \"kms:*\"\n            Resource: \"*\"\n```",
      "Other": "1. In the AWS Console, go to Key Management Service (KMS)\n2. Open Customer managed keys and select the enabled symmetric key\n3. Go to the Key rotation section\n4. Check Enable automatic key rotation\n5. Save changes",
      "Terraform": "```hcl\n# KMS key with automatic rotation enabled\nresource \"aws_kms_key\" \"<example_resource_name>\" {\n  enable_key_rotation = true  # Critical: enables automatic rotation so the key passes the check\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **automatic rotation** on customer-managed symmetric KMS keys and choose a rotation period that meets policy. Enforce **least privilege** and **separation of duties** for key administration versus usage. Monitor key lifecycle events and use on-demand rotation when compromise is suspected.",
      "Url": "https://hub.prowler.com/check/kms_cmk_rotation_enabled"
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

---[FILE: kms_cmk_rotation_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_rotation_enabled/kms_cmk_rotation_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.kms.kms_client import kms_client


class kms_cmk_rotation_enabled(Check):
    def execute(self):
        findings = []
        for key in kms_client.keys:
            report = Check_Report_AWS(metadata=self.metadata(), resource=key)
            # Only check enabled CMKs keys
            if (
                key.manager == "CUSTOMER"
                and key.state == "Enabled"
                and "SYMMETRIC" in key.spec
            ):
                if key.rotation_enabled:
                    report.status = "PASS"
                    report.status_extended = (
                        f"KMS CMK {key.id} has automatic rotation enabled."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"KMS CMK {key.id} has automatic rotation disabled."
                    )
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_rotation_enabled_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_cmk_rotation_enabled/kms_cmk_rotation_enabled_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.kms.kms_client import kms_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Enable CMK rotation. Requires the kms:EnableKeyRotation permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "kms:EnableKeyRotation",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): KMS CMK ID
        region (str): AWS region
    Returns:
        bool: True if CMK rotation is enabled, False otherwise
    """
    try:
        regional_client = kms_client.regional_clients[region]
        regional_client.enable_key_rotation(KeyId=resource_id)
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
