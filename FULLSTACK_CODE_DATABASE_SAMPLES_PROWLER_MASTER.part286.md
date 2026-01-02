---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 286
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 286 of 867)

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

---[FILE: firehose_service.py]---
Location: prowler-master/prowler/providers/aws/services/firehose/firehose_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Dict, List, Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Firehose(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.delivery_streams = {}
        self.__threading_call__(self._list_delivery_streams)
        self.__threading_call__(
            self._list_tags_for_delivery_stream, self.delivery_streams.values()
        )
        self.__threading_call__(
            self._describe_delivery_stream, self.delivery_streams.values()
        )

    def _list_delivery_streams(self, regional_client):
        logger.info("Firehose - Listing delivery streams...")
        try:
            # Manual pagination using ExclusiveStartDeliveryStreamName
            # This ensures we get all streams alphabetically without duplicates
            exclusive_start_delivery_stream_name = None
            processed_streams = set()

            while True:
                kwargs = {}
                if exclusive_start_delivery_stream_name:
                    kwargs["ExclusiveStartDeliveryStreamName"] = (
                        exclusive_start_delivery_stream_name
                    )

                response = regional_client.list_delivery_streams(**kwargs)
                stream_names = response.get("DeliveryStreamNames", [])

                for stream_name in stream_names:
                    if stream_name in processed_streams:
                        continue

                    processed_streams.add(stream_name)
                    stream_arn = f"arn:{self.audited_partition}:firehose:{regional_client.region}:{self.audited_account}:deliverystream/{stream_name}"

                    if not self.audit_resources or (
                        is_resource_filtered(stream_arn, self.audit_resources)
                    ):
                        self.delivery_streams[stream_arn] = DeliveryStream(
                            arn=stream_arn,
                            name=stream_name,
                            region=regional_client.region,
                        )

                if not response.get("HasMoreDeliveryStreams", False):
                    break

                # Set the starting point for the next page (last stream name from current batch)
                # ExclusiveStartDeliveryStreamName will start after this stream alphabetically
                if stream_names:
                    exclusive_start_delivery_stream_name = stream_names[-1]
                else:
                    break

        except ClientError as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_delivery_stream(self, stream):
        logger.info(f"Firehose - Listing tags for stream {stream.name}...")
        try:
            stream.tags = (
                self.regional_clients[stream.region]
                .list_tags_for_delivery_stream(DeliveryStreamName=stream.name)
                .get("Tags", [])
            )
        except ClientError as error:
            logger.error(
                f"{stream.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_delivery_stream(self, stream):
        logger.info(f"Firehose - Describing stream {stream.name}...")
        try:
            describe_stream = self.regional_clients[
                stream.region
            ].describe_delivery_stream(DeliveryStreamName=stream.name)

            encryption_config = describe_stream.get(
                "DeliveryStreamDescription", {}
            ).get("DeliveryStreamEncryptionConfiguration", {})

            stream.kms_encryption = EncryptionStatus(
                encryption_config.get("Status", "DISABLED")
            )
            stream.kms_key_arn = encryption_config.get("KeyARN", "")

            stream.delivery_stream_type = describe_stream.get(
                "DeliveryStreamDescription", {}
            ).get("DeliveryStreamType", "")

            source_config = describe_stream.get("DeliveryStreamDescription", {}).get(
                "Source", {}
            )
            stream.source = Source(
                direct_put=DirectPutSourceDescription(
                    troughput_hint_in_mb_per_sec=source_config.get(
                        "DirectPutSourceDescription", {}
                    ).get("TroughputHintInMBPerSec", 0)
                ),
                kinesis_stream=KinesisStreamSourceDescription(
                    kinesis_stream_arn=source_config.get(
                        "KinesisStreamSourceDescription", {}
                    ).get("KinesisStreamARN", "")
                ),
                msk=MSKSourceDescription(
                    msk_cluster_arn=source_config.get("MSKSourceDescription", {}).get(
                        "MSKClusterARN", ""
                    )
                ),
                database=DatabaseSourceDescription(
                    endpoint=source_config.get("DatabaseSourceDescription", {}).get(
                        "Endpoint", ""
                    )
                ),
            )
        except ClientError as error:
            logger.error(
                f"{stream.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class EncryptionStatus(Enum):
    """Possible values for the status of the encryption of a Firehose stream"""

    ENABLED = "ENABLED"
    DISABLED = "DISABLED"
    ENABLING = "ENABLING"
    DISABLING = "DISABLING"
    ENABLING_FAILED = "ENABLING_FAILED"
    DISABLING_FAILED = "DISABLING_FAILED"


class DirectPutSourceDescription(BaseModel):
    """Model for the DirectPut source of a Firehose stream"""

    troughput_hint_in_mb_per_sec: int = Field(default_factory=int)


class KinesisStreamSourceDescription(BaseModel):
    """Model for the KinesisStream source of a Firehose stream"""

    kinesis_stream_arn: str = Field(default_factory=str)


class MSKSourceDescription(BaseModel):
    """Model for the MSK source of a Firehose stream"""

    msk_cluster_arn: str = Field(default_factory=str)


class DatabaseSourceDescription(BaseModel):
    """Model for the Database source of a Firehose stream"""

    endpoint: str = Field(default_factory=str)


class Source(BaseModel):
    """Model for the source of a Firehose stream"""

    direct_put: Optional[DirectPutSourceDescription]
    kinesis_stream: Optional[KinesisStreamSourceDescription]
    msk: Optional[MSKSourceDescription]
    database: Optional[DatabaseSourceDescription]


class DeliveryStream(BaseModel):
    """Model for a Firehose Delivery Stream"""

    arn: str
    name: str
    region: str
    kms_key_arn: Optional[str] = Field(default_factory=str)
    kms_encryption: Optional[str] = Field(default_factory=str)
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)
    delivery_stream_type: Optional[str] = Field(default_factory=str)
    source: Source = Field(default_factory=Source)
```

--------------------------------------------------------------------------------

---[FILE: firehose_stream_encrypted_at_rest.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/firehose/firehose_stream_encrypted_at_rest/firehose_stream_encrypted_at_rest.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "firehose_stream_encrypted_at_rest",
  "CheckTitle": "Kinesis Data Firehose delivery stream is encrypted at rest",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST CSF Controls (USA)"
  ],
  "ServiceName": "firehose",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsKinesisStream",
  "Description": "**Amazon Data Firehose** delivery streams must enable **server-side encryption at rest** with AWS KMS regardless of the source type. Encryption of upstream sources such as **Kinesis Data Streams** or **MSK** does not replace the need to protect the delivery stream itself.",
  "Risk": "Unencrypted Firehose data at rest can be read if storage or backups are accessed, harming **confidentiality** and **integrity**. Disk-level access, snapshots, or misconfigured destinations enable data exfiltration or tampering. Lacking KMS-backed controls also reduces key rotation, segregation of duties, and auditability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Firehose/delivery-stream-encrypted-with-kms-customer-master-keys.html",
    "https://docs.aws.amazon.com/firehose/latest/dev/encryption.html",
    "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/datafirehose-controls.html#datafirehose-1"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws firehose start-delivery-stream-encryption --delivery-stream-name <delivery-stream-name> --delivery-stream-encryption-configuration-input KeyType=AWS_OWNED_CMK",
      "NativeIaC": "```yaml\n# CloudFormation: Enable at-rest encryption for a Firehose delivery stream\nResources:\n  <example_resource_name>:\n    Type: AWS::KinesisFirehose::DeliveryStream\n    Properties:\n      DeliveryStreamEncryptionConfigurationInput:\n        KeyType: AWS_OWNED_CMK  # critical: enables SSE at rest using AWS owned KMS key\n      ExtendedS3DestinationConfiguration:\n        BucketARN: arn:aws:s3:::<example_resource_name>\n        RoleARN: arn:aws:iam::<example_account_id>:role/<example_resource_name>\n```",
      "Other": "1. In the AWS Console, go to Amazon Data Firehose\n2. Select the affected delivery stream and click Edit\n3. Under Server-side encryption, set to Enabled (choose AWS owned key)\n4. Click Save changes",
      "Terraform": "```hcl\n# Terraform: Enable at-rest encryption for a Firehose delivery stream\nresource \"aws_kinesis_firehose_delivery_stream\" \"<example_resource_name>\" {\n  name        = \"<example_resource_name>\"\n  destination = \"extended_s3\"\n\n  server_side_encryption {\n    enabled = true  # critical: turns on SSE at rest (uses AWS owned KMS key by default)\n  }\n\n  extended_s3_configuration {\n    role_arn   = \"arn:aws:iam::<example_account_id>:role/<example_resource_name>\"\n    bucket_arn = \"arn:aws:s3:::<example_resource_name>\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **server-side encryption** for Firehose with AWS KMS. Prefer **customer managed keys** (`CMEK`) to enforce **least privilege**, rotation, and auditing. Ensure upstream **Kinesis** sources are encrypted and confirm MSK defaults meet policy. Monitor KMS health signals and deny writes without encryption. Apply **defense in depth** at destinations.",
      "Url": "https://hub.prowler.com/check/firehose_stream_encrypted_at_rest"
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

---[FILE: firehose_stream_encrypted_at_rest.py]---
Location: prowler-master/prowler/providers/aws/services/firehose/firehose_stream_encrypted_at_rest/firehose_stream_encrypted_at_rest.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.firehose.firehose_client import firehose_client
from prowler.providers.aws.services.firehose.firehose_service import EncryptionStatus
from prowler.providers.aws.services.kafka.kafka_client import kafka_client
from prowler.providers.aws.services.kinesis.kinesis_client import kinesis_client
from prowler.providers.aws.services.kinesis.kinesis_service import EncryptionType


class firehose_stream_encrypted_at_rest(Check):
    """Check if Firehose Streams are encrypted at rest.

    This class verifies that all Firehose Streams have at rest encryption enabled by checking if KMS encryption is active and a KMS Key is configured.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """Execute the Firehose Stream Encrypted at Rest check.

        Iterates over all Firehose Streams and checks if KMS encryption is enabled and a KMS Key is configured.

        Returns:
            List[Check_Report_AWS]: A list of reports for each Firehose Stream.
        """
        findings = []
        for stream in firehose_client.delivery_streams.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=stream)
            report.status = "FAIL"
            report.status_extended = f"Firehose Stream {stream.name} does not have at rest encryption enabled."

            if stream.kms_encryption == EncryptionStatus.ENABLED:
                report.status = "PASS"
                report.status_extended = f"Firehose Stream {stream.name} does have at rest encryption enabled."

            elif stream.delivery_stream_type == "KinesisStreamAsSource":
                source_stream_arn = stream.source.kinesis_stream.kinesis_stream_arn
                source_stream = kinesis_client.streams.get(source_stream_arn, None)
                if source_stream:
                    if source_stream.encrypted_at_rest == EncryptionType.KMS:
                        report.status_extended = f"Firehose Stream {stream.name} does not have at rest encryption enabled even though source stream {source_stream.name} has at rest encryption enabled."
                    else:
                        report.status_extended = f"Firehose Stream {stream.name} does not have at rest encryption enabled and the source stream {source_stream.name} is not encrypted at rest."
                else:
                    report.status_extended = f"Firehose Stream {stream.name} does not have at rest encryption enabled and the referenced source stream could not be found."

            elif stream.delivery_stream_type == "MSKAsSource":
                msk_cluster_arn = stream.source.msk.msk_cluster_arn
                msk_cluster = None
                if msk_cluster_arn:
                    for cluster in kafka_client.clusters.values():
                        if cluster.arn == msk_cluster_arn:
                            msk_cluster = cluster
                            break

                    if msk_cluster:
                        # All MSK clusters (both provisioned and serverless) always have encryption at rest enabled by AWS
                        # AWS MSK always encrypts data at rest - either with AWS managed keys or CMK
                        report.status = "PASS"
                        if msk_cluster.kafka_version == "SERVERLESS":
                            report.status_extended = f"Firehose Stream {stream.name} uses MSK serverless source which always has encryption at rest enabled by default."
                        else:
                            report.status_extended = f"Firehose Stream {stream.name} uses MSK provisioned source which always has encryption at rest enabled by AWS (either with AWS managed keys or CMK)."
                    else:
                        report.status_extended = f"Firehose Stream {stream.name} uses MSK source which always has encryption at rest enabled by AWS."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: fms_client.py]---
Location: prowler-master/prowler/providers/aws/services/fms/fms_client.py

```python
from prowler.providers.aws.services.fms.fms_service import FMS
from prowler.providers.common.provider import Provider

fms_client = FMS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: fms_service.py]---
Location: prowler-master/prowler/providers/aws/services/fms/fms_service.py
Signals: Pydantic

```python
from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class FMS(AWSService):
    def __init__(self, provider):
        # # Call AWSService's __init__
        super().__init__(__class__.__name__, provider, global_service=True)
        self.policy_arn_template = f"arn:{self.audited_partition}:fms:{self.region}:{self.audited_account}:policy"
        self.fms_admin_account = True
        self.fms_policies = []
        self._list_policies()
        self._list_compliance_status()

    def _list_policies(self):
        logger.info("FMS - Listing Policies...")
        try:
            list_policies_paginator = self.client.get_paginator("list_policies")
            try:
                for page in list_policies_paginator.paginate():
                    for fms_policy in page["PolicyList"]:
                        if not self.audit_resources or (
                            is_resource_filtered(
                                fms_policy["PolicyArn"], self.audit_resources
                            )
                        ):
                            self.fms_policies.append(
                                Policy(
                                    arn=fms_policy.get("PolicyArn"),
                                    id=fms_policy.get("PolicyId"),
                                    name=fms_policy.get("PolicyName"),
                                    resource_type=fms_policy.get("ResourceType"),
                                    service_type=fms_policy.get("SecurityServiceType"),
                                    remediation_enabled=fms_policy.get(
                                        "RemediationEnabled"
                                    ),
                                    delete_unused_managed_resources=fms_policy.get(
                                        "DeleteUnusedFMManagedResources"
                                    ),
                                )
                            )
            except ClientError as error:
                if error.response["Error"]["Code"] == "AccessDeniedException":
                    if (
                        "No default admin could be found for account"
                        in error.response["Error"]["Message"]
                        or "Operation ListPolicies is only available to AWS Firewall Manager Administrators"
                        in error.response["Error"]["Message"]
                    ):
                        # FMS is not enabled in this account
                        self.fms_admin_account = False
                    else:
                        logger.error(
                            f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
                        )
                        self.fms_admin_account = None
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )

    def _list_compliance_status(self):
        logger.info("FMS - Listing Policies...")
        try:
            for fms_policy in self.fms_policies:
                list_compliance_status_paginator = self.client.get_paginator(
                    "list_compliance_status"
                )
                for page in list_compliance_status_paginator.paginate(
                    PolicyId=fms_policy.id
                ):
                    for fms_compliance_status in page.get(
                        "PolicyComplianceStatusList", []
                    ):
                        compliance_status = ""
                        if fms_compliance_status.get("EvaluationResults"):
                            compliance_status = fms_compliance_status.get(
                                "EvaluationResults"
                            )[0].get("ComplianceStatus", "")
                        fms_policy.compliance_status.append(
                            PolicyAccountComplianceStatus(
                                account_id=fms_compliance_status.get("MemberAccount"),
                                policy_id=fms_compliance_status.get("PolicyId"),
                                status=compliance_status,
                            )
                        )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}:{error.__traceback__.tb_lineno} -- {error}"
            )


class PolicyAccountComplianceStatus(BaseModel):
    account_id: str
    policy_id: str
    status: str


class Policy(BaseModel):
    arn: str
    id: str
    name: str
    resource_type: str
    service_type: str
    remediation_enabled: bool
    delete_unused_managed_resources: bool
    compliance_status: list[PolicyAccountComplianceStatus] = []
```

--------------------------------------------------------------------------------

---[FILE: fms_policy_compliant.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/fms/fms_policy_compliant/fms_policy_compliant.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "fms_policy_compliant",
  "CheckTitle": "All AWS FMS policies in the admin account are compliant for all accounts",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "fms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Firewall Manager** policies in the administrator account are evaluated for organization-wide compliance. The assessment reviews each policy's account-level status and flags entries marked `NON_COMPLIANT` or unset. It also identifies when no effective policies exist within the administrator scope.",
  "Risk": "Policy drift or absence leaves in-scope resources without enforced controls, degrading **confidentiality**, **integrity**, and **availability**. Missing WAF, Shield, security group, or network firewall baselines can enable DDoS exposure, unsafe routes, and open access, leading to unauthorized entry and data exfiltration.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/firewall-manager/faqs/",
    "https://docs.aws.amazon.com/waf/latest/developerguide/getting-started-fms-intro.html",
    "https://www.amazonaws.cn/en/firewall-manager/faqs/",
    "https://docs.aws.amazon.com/waf/latest/developerguide/fms-compliance.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS console with the Firewall Manager administrator account\n2. Open Firewall Manager > Security policies\n3. If no policies exist: Click Create policy, choose the policy type you use, set scope to All accounts, enable Automatic remediation, and create the policy\n4. If policies exist with Noncompliant accounts: Open the policy > Edit > enable Automatic remediation and ensure scope includes All accounts > Save\n5. In AWS Config (organization management account): Settings > Organization settings > Enable recording for all accounts and all regions > Save\n6. Return to each Firewall Manager policy and verify Accounts within policy scope show Compliant",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Maintain centralized enforcement with **Firewall Manager**: define mandatory policies for all relevant accounts/resources, enable automatic remediation where appropriate, and continuously monitor compliance. Apply **least privilege** and **defense in depth** by standardizing web, network, and DNS protections and alerting on drift.",
      "Url": "https://hub.prowler.com/check/fms_policy_compliant"
    }
  },
  "Categories": [
    "internet-exposed",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: fms_policy_compliant.py]---
Location: prowler-master/prowler/providers/aws/services/fms/fms_policy_compliant/fms_policy_compliant.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.fms.fms_client import fms_client


class fms_policy_compliant(Check):
    def execute(self):
        findings = []
        if fms_client.fms_admin_account:
            report = Check_Report_AWS(metadata=self.metadata(), resource={})
            report.region = fms_client.region
            report.resource_arn = fms_client.policy_arn_template
            report.resource_id = fms_client.audited_account
            report.status = "PASS"
            report.status_extended = "FMS enabled with all compliant accounts."
            non_compliant_policy = False
            if fms_client.fms_policies:
                for policy in fms_client.fms_policies:
                    for policy_to_account in policy.compliance_status:
                        if (
                            policy_to_account.status == "NON_COMPLIANT"
                            or not policy_to_account.status
                        ):
                            report = Check_Report_AWS(
                                metadata=self.metadata(), resource=policy
                            )
                            report.status = "FAIL"
                            report.status_extended = f"FMS with non-compliant policy {policy.name} for account {policy_to_account.account_id}."
                            report.region = fms_client.region
                            non_compliant_policy = True
                            break
                    if non_compliant_policy:
                        break
            else:
                report.status = "FAIL"
                report.status_extended = f"FMS without any compliant policy for account {fms_client.audited_account}."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: fsx_client.py]---
Location: prowler-master/prowler/providers/aws/services/fsx/fsx_client.py

```python
from prowler.providers.aws.services.fsx.fsx_service import FSx
from prowler.providers.common.provider import Provider

fsx_client = FSx(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: fsx_service.py]---
Location: prowler-master/prowler/providers/aws/services/fsx/fsx_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class FSx(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.file_systems = {}
        self.__threading_call__(self._describe_file_systems)

    def _describe_file_systems(self, regional_client):
        logger.info("FSx - Describing file systems...")
        try:
            describe_file_system_paginator = regional_client.get_paginator(
                "describe_file_systems"
            )
            for page in describe_file_system_paginator.paginate():
                for file_system in page["FileSystems"]:
                    file_system_arn = f"arn:{self.audited_partition}:fsx:{regional_client.region}:{self.audited_account}:file-system/{file_system['FileSystemId']}"
                    if not self.audit_resources or (
                        is_resource_filtered(file_system_arn, self.audit_resources)
                    ):
                        type = file_system["FileSystemType"]
                        copy_tags_to_backups_aux = None
                        copy_tags_to_volumes_aux = None
                        if type == "LUSTRE":
                            copy_tags_to_backups_aux = file_system.get(
                                "LustreConfiguration", {}
                            ).get("CopyTagsToBackups", False)
                        elif type == "WINDOWS":
                            copy_tags_to_backups_aux = file_system.get(
                                "WindowsConfiguration", {}
                            ).get("CopyTagsToBackups", False)
                        elif type == "OPENZFS":
                            copy_tags_to_backups_aux = file_system.get(
                                "OpenZFSConfiguration", {}
                            ).get("CopyTagsToBackups", False)
                            copy_tags_to_volumes_aux = file_system.get(
                                "OpenZFSConfiguration", {}
                            ).get("CopyTagsToVolumes", False)

                        self.file_systems[file_system_arn] = FileSystem(
                            id=file_system["FileSystemId"],
                            arn=file_system_arn,
                            type=file_system["FileSystemType"],
                            copy_tags_to_backups=copy_tags_to_backups_aux,
                            copy_tags_to_volumes=copy_tags_to_volumes_aux,
                            subnet_ids=file_system.get("SubnetIds", []),
                            region=regional_client.region,
                            tags=file_system.get("Tags", []),
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class FileSystem(BaseModel):
    id: str
    arn: str
    region: str
    type: str
    copy_tags_to_backups: Optional[bool]
    copy_tags_to_volumes: Optional[bool]
    subnet_ids: Optional[list] = []
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: fsx_file_system_copy_tags_to_backups_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/fsx/fsx_file_system_copy_tags_to_backups_enabled/fsx_file_system_copy_tags_to_backups_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "fsx_file_system_copy_tags_to_backups_enabled",
  "CheckTitle": "FSx file system has copy tags to backups enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "fsx",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsFSxFileSystem",
  "Description": "**Amazon FSx file systems** are evaluated for whether they copy **resource tags** to their **backups** via the `copy_tags_to_backups` setting.",
  "Risk": "Missing tag inheritance leaves backups unclassified and outside tag-based controls, weakening confidentiality and availability. Tag-aware IAM and retention policies may not apply, enabling unauthorized access, accidental deletion, or orphaned backups that complicate recovery and inflate costs.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/fsx-controls.html#fsx-2",
    "https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/updating-file-system.html",
    "https://docs.aws.amazon.com/config/latest/developerguide/fsx-lustre-copy-tags-to-backups.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws fsx update-file-system --file-system-id <file-system-id> --open-zfs-configuration CopyTagsToBackups=true",
      "NativeIaC": "```yaml\n# CloudFormation: Enable copying tags to backups for FSx OpenZFS\nResources:\n  <example_resource_name>:\n    Type: AWS::FSx::FileSystem\n    Properties:\n      FileSystemType: OPENZFS\n      OpenZFSConfiguration:\n        CopyTagsToBackups: true  # Critical: ensures tags are copied to backups (passes the check)\n```",
      "Other": "1. Open the AWS Console and go to Amazon FSx\n2. Select your FSx file system and choose Actions > Update file system\n3. Enable Copy tags to backups\n4. Click Update to save",
      "Terraform": "```hcl\n# Terraform: Enable copying tags to backups for FSx OpenZFS\nresource \"aws_fsx_openzfs_file_system\" \"<example_resource_name>\" {\n  subnet_ids          = [\"<subnet_id>\"]\n  deployment_type     = \"SINGLE_AZ_1\"\n  throughput_capacity = 64\n  storage_capacity    = 128\n\n  copy_tags_to_backups = true # Critical: ensures tags are copied to backups (passes the check)\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable tag copying for FSx backups and standardize mandatory tags (owner, data classification, environment).\nMap **least privilege** and lifecycle policies to these tags, enforce with automation and guardrails, and regularly audit to prevent untagged or misclassified backups.",
      "Url": "https://hub.prowler.com/check/fsx_file_system_copy_tags_to_backups_enabled"
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

---[FILE: fsx_file_system_copy_tags_to_backups_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/fsx/fsx_file_system_copy_tags_to_backups_enabled/fsx_file_system_copy_tags_to_backups_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.fsx.fsx_client import fsx_client


class fsx_file_system_copy_tags_to_backups_enabled(Check):
    def execute(self):
        findings = []
        for file_system in fsx_client.file_systems.values():
            if file_system.copy_tags_to_backups is not None:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=file_system
                )
                report.status = "PASS"
                report.status_extended = f"FSx file system {file_system.id} has copy tags to backups enabled."

                if not file_system.copy_tags_to_backups:
                    report.status = "FAIL"
                    report.status_extended = f"FSx file system {file_system.id} does not have copy tags to backups enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: fsx_file_system_copy_tags_to_volumes_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/fsx/fsx_file_system_copy_tags_to_volumes_enabled/fsx_file_system_copy_tags_to_volumes_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "fsx_file_system_copy_tags_to_volumes_enabled",
  "CheckTitle": "FSx file system has copy tags to volumes enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "fsx",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "**Amazon FSx file systems** are configured to **copy tags to volumes** via `copy_tags_to_volumes`.\n\nIdentifies file systems where volume resources will not inherit the file system's tags.",
  "Risk": "Without tag propagation, volumes lack consistent labels used for **ABAC**, classification, and automation. This can erode confidentiality through mis-scoped access controls and impact availability if backups or safeguards aren't applied to untagged volumes.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/fsx-controls.html#fsx-1",
    "https://docs.aws.amazon.com/config/latest/developerguide/fsx-openzfs-copy-tags-enabled.html",
    "https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/updating-file-system.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws fsx update-file-system --file-system-id <file-system-id> --open-zfs-configuration CopyTagsToVolumes=true",
      "NativeIaC": "```yaml\n# CloudFormation: Enable copying tags to volumes for FSx for OpenZFS\nResources:\n  <example_resource_name>:\n    Type: AWS::FSx::FileSystem\n    Properties:\n      FileSystemType: OPENZFS\n      SubnetIds:\n        - <example_resource_id>\n      OpenZFSConfiguration:\n        DeploymentType: SINGLE_AZ_1\n        ThroughputCapacity: 64\n        CopyTagsToVolumes: true  # Critical: ensures volumes inherit file system tags\n```",
      "Other": "1. Open the AWS Console and go to Amazon FSx\n2. Select your FSx for OpenZFS file system\n3. Click Actions > Update file system\n4. Set Copy tags to volumes to On\n5. Click Update to save",
      "Terraform": "```hcl\n# FSx for OpenZFS with copy tags to volumes enabled\nresource \"aws_fsx_openzfs_file_system\" \"<example_resource_name>\" {\n  deployment_type      = \"SINGLE_AZ_1\"\n  subnet_ids           = [\"<example_resource_id>\"]\n  throughput_capacity  = 64\n  copy_tags_to_volumes = true  # Critical: ensures volumes inherit file system tags\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable `copy_tags_to_volumes` and adopt a **mandatory tagging policy** (owner, environment, data class). Apply **least privilege/ABAC** using tags and integrate tags into backup, retention, and monitoring workflows to enforce **defense in depth**.",
      "Url": "https://hub.prowler.com/check/fsx_file_system_copy_tags_to_volumes_enabled"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: fsx_file_system_copy_tags_to_volumes_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/fsx/fsx_file_system_copy_tags_to_volumes_enabled/fsx_file_system_copy_tags_to_volumes_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.fsx.fsx_client import fsx_client


class fsx_file_system_copy_tags_to_volumes_enabled(Check):
    def execute(self):
        findings = []
        for file_system in fsx_client.file_systems.values():
            if file_system.copy_tags_to_volumes is not None:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=file_system
                )
                report.status = "PASS"
                report.status_extended = f"FSx file system {file_system.id} has copy tags to volumes enabled."

                if not file_system.copy_tags_to_volumes:
                    report.status = "FAIL"
                    report.status_extended = f"FSx file system {file_system.id} does not have copy tags to volumes enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
