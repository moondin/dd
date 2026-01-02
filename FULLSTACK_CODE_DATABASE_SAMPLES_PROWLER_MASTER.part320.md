---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 320
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 320 of 867)

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

---[FILE: sns_topics_kms_encryption_at_rest_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sns/sns_topics_kms_encryption_at_rest_enabled/sns_topics_kms_encryption_at_rest_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sns_topics_kms_encryption_at_rest_enabled",
  "CheckTitle": "SNS topic is encrypted at rest with KMS",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST CSF Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/ISO 27001 Controls"
  ],
  "ServiceName": "sns",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsSnsTopic",
  "Description": "**Amazon SNS topics** are assessed for **server-side encryption** with **AWS KMS**. Topics lacking a configured KMS key (e.g., missing `kms_master_key_id`) are identified as unencrypted at rest.",
  "Risk": "Without KMS-backed SSE, SNS stores message bodies unencrypted at rest, undermining **confidentiality**.\n\nPrivileged insiders or compromised service components could access plaintext during persistence windows, causing data exposure. You also lose KMS controls such as key policies, rotation, and detailed audit trails.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/SNS/topic-encrypted-with-kms-customer-master-keys.html",
    "https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws sns set-topic-attributes --topic-arn <TOPIC_ARN> --attribute-name KmsMasterKeyId --attribute-value alias/aws/sns",
      "NativeIaC": "```yaml\n# CloudFormation: Enable SSE for an SNS topic\nResources:\n  <example_resource_name>:\n    Type: AWS::SNS::Topic\n    Properties:\n      KmsMasterKeyId: alias/aws/sns  # Critical: Enables encryption at rest with AWS managed KMS key\n```",
      "Other": "1. Open the AWS Console and go to Amazon SNS > Topics\n2. Select the topic and click Edit\n3. Under Encryption, enable encryption and choose the AWS managed key for SNS (alias/aws/sns)\n4. Click Save changes",
      "Terraform": "```hcl\n# Enable SSE for an SNS topic\nresource \"aws_sns_topic\" \"<example_resource_name>\" {\n  name               = \"<example_resource_name>\"\n  kms_master_key_id  = \"alias/aws/sns\" # Critical: Enables encryption at rest\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **server-side encryption** on all SNS topics with **AWS KMS**; prefer **customer-managed keys** for control.\n\nApply **least privilege** on key use, enforce rotation, and monitor key/access logs. Minimize sensitive data in messages and use end-to-end encryption *where feasible* to add defense in depth.",
      "Url": "https://hub.prowler.com/check/sns_topics_kms_encryption_at_rest_enabled"
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

---[FILE: sns_topics_kms_encryption_at_rest_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/sns/sns_topics_kms_encryption_at_rest_enabled/sns_topics_kms_encryption_at_rest_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sns.sns_client import sns_client


class sns_topics_kms_encryption_at_rest_enabled(Check):
    def execute(self):
        findings = []
        for topic in sns_client.topics:
            report = Check_Report_AWS(metadata=self.metadata(), resource=topic)
            report.status = "PASS"
            report.status_extended = f"SNS topic {topic.name} is encrypted."
            if not topic.kms_master_key_id:
                report.status = "FAIL"
                report.status_extended = f"SNS topic {topic.name} is not encrypted."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sns_topics_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sns/sns_topics_not_publicly_accessible/sns_topics_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sns_topics_not_publicly_accessible",
  "CheckTitle": "SNS topic is not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure",
    "TTPs/Initial Access"
  ],
  "ServiceName": "sns",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsSnsTopic",
  "Description": "**SNS topic policies** are analyzed for **public principals** (e.g., `*`). Topics that grant access without restrictive conditions such as `aws:SourceArn`, `aws:SourceAccount`, `aws:PrincipalOrgID`, or `sns:Endpoint` scoping are treated as publicly accessible.",
  "Risk": "**Public SNS topics** allow anyone or unknown accounts to:\n- **Subscribe** and siphon messages (confidentiality)\n- **Publish** spoofed payloads that alter workflows (integrity)\n- **Flood** messages causing outages and costs (availability)\nThey also enable cross-account abuse and bypass expected trust boundaries.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/SNS/topics-everyone-publish.html",
    "https://docs.aws.amazon.com/config/latest/developerguide/sns-topic-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws sns set-topic-attributes --topic-arn <TOPIC_ARN> --attribute-name Policy --attribute-value '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":\"arn:aws:iam::<ACCOUNT_ID>:root\"},\"Action\":\"sns:Publish\",\"Resource\":\"<TOPIC_ARN>\"}]}'",
      "NativeIaC": "```yaml\n# CloudFormation: restrict SNS topic policy to the account (not public)\nResources:\n  <example_resource_name>:\n    Type: AWS::SNS::TopicPolicy\n    Properties:\n      Topics:\n        - arn:aws:sns:<region>:<account_id>:<example_resource_name>\n      PolicyDocument:\n        Version: '2012-10-17'\n        Statement:\n          - Effect: Allow\n            Action: sns:Publish\n            Resource: arn:aws:sns:<region>:<account_id>:<example_resource_name>\n            Principal:\n              AWS: arn:aws:iam::<account_id>:root  # Critical: restrict to account root to remove public access\n```",
      "Other": "1. Open the Amazon SNS console and select Topics\n2. Choose the topic and go to the Access policy tab\n3. Edit the policy and remove any Principal set to \"*\" (Everyone/Public)\n4. Add a statement allowing only your account root: Principal = arn:aws:iam::<ACCOUNT_ID>:root with Action sns:Publish and Resource set to the topic ARN\n5. Save changes",
      "Terraform": "```hcl\n# Restrict SNS topic policy to the account (not public)\nresource \"aws_sns_topic_policy\" \"<example_resource_name>\" {\n  arn    = \"<TOPIC_ARN>\"\n  policy = jsonencode({\n    Version   = \"2012-10-17\"\n    Statement = [{\n      Effect    = \"Allow\"\n      Action    = \"sns:Publish\"\n      Resource  = \"<TOPIC_ARN>\"\n      Principal = { AWS = \"arn:aws:iam::<ACCOUNT_ID>:root\" } # Critical: restrict principal to the account to remove public access\n    }]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Restrict the **topic policy** to specific principals and minimal actions:\n- Avoid `Principal:*`\n- Allow only needed actions (e.g., `sns:Publish`)\n- Add conditions like `aws:SourceArn`, `aws:SourceAccount`, `aws:PrincipalOrgID`, or `sns:Endpoint`\nApply **least privilege**, separate duties, and review policies regularly.",
      "Url": "https://hub.prowler.com/check/sns_topics_not_publicly_accessible"
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

---[FILE: sns_topics_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/sns/sns_topics_not_publicly_accessible/sns_topics_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import (
    has_public_principal,
    has_restrictive_source_arn_condition,
    is_condition_block_restrictive,
    is_condition_block_restrictive_organization,
    is_condition_block_restrictive_sns_endpoint,
)
from prowler.providers.aws.services.sns.sns_client import sns_client


class sns_topics_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for topic in sns_client.topics:
            report = Check_Report_AWS(metadata=self.metadata(), resource=topic)
            report.status = "PASS"
            report.status_extended = (
                f"SNS topic {topic.name} is not publicly accessible."
            )

            if topic.policy:
                for statement in topic.policy["Statement"]:
                    if statement["Effect"] == "Allow" and has_public_principal(
                        statement
                    ):
                        if has_restrictive_source_arn_condition(statement):
                            break
                        elif "Condition" in statement:
                            condition_account = is_condition_block_restrictive(
                                statement["Condition"], sns_client.audited_account
                            )
                            condition_org = is_condition_block_restrictive_organization(
                                statement["Condition"]
                            )
                            condition_endpoint = (
                                is_condition_block_restrictive_sns_endpoint(
                                    statement["Condition"]
                                )
                            )

                            if condition_account and condition_org:
                                report.status_extended = f"SNS topic {topic.name} is not public because its policy only allows access from the account {sns_client.audited_account} and an organization."
                            elif condition_account:
                                report.status_extended = f"SNS topic {topic.name} is not public because its policy only allows access from the account {sns_client.audited_account}."
                            elif condition_org:
                                report.status_extended = f"SNS topic {topic.name} is not public because its policy only allows access from an organization."
                            elif condition_endpoint:
                                report.status_extended = f"SNS topic {topic.name} is not public because its policy only allows access from an endpoint."
                            else:
                                report.status = "FAIL"
                                report.status_extended = f"SNS topic {topic.name} is public because its policy allows public access."
                                break
                        else:
                            # Public principal with no conditions = public
                            report.status = "FAIL"
                            report.status_extended = f"SNS topic {topic.name} is public because its policy allows public access."
                            break

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqs_client.py]---
Location: prowler-master/prowler/providers/aws/services/sqs/sqs_client.py

```python
from prowler.providers.aws.services.sqs.sqs_service import SQS
from prowler.providers.common.provider import Provider

sqs_client = SQS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: sqs_service.py]---
Location: prowler-master/prowler/providers/aws/services/sqs/sqs_service.py
Signals: Pydantic

```python
from json import loads
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class SQS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.queues = []
        self.__threading_call__(self._list_queues)
        self._get_queue_attributes()
        self._list_queue_tags()

    def _list_queues(self, regional_client):
        logger.info("SQS - describing queues...")
        try:
            list_queues_paginator = regional_client.get_paginator("list_queues")
            # The SQS API uses nonstandard pagination
            # you must specify a PageSize if there are more than 1000 queues
            for page in list_queues_paginator.paginate(
                PaginationConfig={"PageSize": 1000}
            ):
                if "QueueUrls" in page:
                    for queue in page["QueueUrls"]:
                        # the queue name is the last path segment of the url
                        queue_name = queue.split("/")[-1]
                        arn = f"arn:{self.audited_partition}:sqs:{regional_client.region}:{self.audited_account}:{queue_name}"
                        if not self.audit_resources or (
                            is_resource_filtered(arn, self.audit_resources)
                        ):
                            self.queues.append(
                                Queue(
                                    arn=arn,
                                    name=queue_name,
                                    id=queue,
                                    region=regional_client.region,
                                )
                            )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_queue_attributes(self):
        try:
            logger.info("SQS - describing queue attributes...")
            non_existing_queues = []
            for queue in self.queues:
                try:
                    regional_client = self.regional_clients[queue.region]
                    queue_attributes = regional_client.get_queue_attributes(
                        QueueUrl=queue.id, AttributeNames=["All"]
                    )
                    if "Attributes" in queue_attributes:
                        if "Policy" in queue_attributes["Attributes"]:
                            queue.policy = loads(
                                queue_attributes["Attributes"]["Policy"]
                            )
                        if "KmsMasterKeyId" in queue_attributes["Attributes"]:
                            queue.kms_key_id = queue_attributes["Attributes"][
                                "KmsMasterKeyId"
                            ]
                        if "SqsManagedSseEnabled" in queue_attributes["Attributes"]:
                            if (
                                queue_attributes["Attributes"]["SqsManagedSseEnabled"]
                                == "true"
                            ):
                                queue.kms_key_id = "SqsManagedSseEnabled"
                except ClientError as error:
                    if (
                        error.response["Error"]["Code"]
                        == "AWS.SimpleQueueService.NonExistentQueue"
                    ):
                        logger.warning(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                        non_existing_queues.append(queue)
                    else:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
            self.queues = [q for q in self.queues if q not in non_existing_queues]
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_queue_tags(self):
        logger.info("SQS - List Tags...")
        try:
            for queue in self.queues:
                try:
                    regional_client = self.regional_clients[queue.region]
                    response = regional_client.list_queue_tags(QueueUrl=queue.id).get(
                        "Tags"
                    )
                    queue.tags = [response]
                except ClientError as error:
                    if (
                        error.response["Error"]["Code"]
                        == "AWS.SimpleQueueService.NonExistentQueue"
                    ):
                        logger.warning(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                    else:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Queue(BaseModel):
    id: str
    name: str
    arn: str
    region: str
    policy: dict = None
    kms_key_id: str = None
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: sqs_queues_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sqs/sqs_queues_not_publicly_accessible/sqs_queues_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sqs_queues_not_publicly_accessible",
  "CheckTitle": "Check if SQS queues have policy set as Public",
  "CheckType": [],
  "ServiceName": "sqs",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sqs:region:account-id:queue",
  "Severity": "critical",
  "ResourceType": "AwsSqsQueue",
  "Description": "Check if SQS queues have policy set as Public",
  "Risk": "Sensitive information could be disclosed",
  "RelatedUrl": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-examples-of-sqs-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/SQS/sqs-queue-exposed.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/ensure-sqs-queue-policy-is-not-public-by-only-allowing-specific-services-or-principals-to-access-it#terraform"
    },
    "Recommendation": {
      "Text": "Review service with overly permissive policies. Adhere to Principle of Least Privilege.",
      "Url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-examples-of-sqs-policies.html"
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

---[FILE: sqs_queues_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/sqs/sqs_queues_not_publicly_accessible/sqs_queues_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_condition_block_restrictive
from prowler.providers.aws.services.sqs.sqs_client import sqs_client


class sqs_queues_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for queue in sqs_client.queues:
            report = Check_Report_AWS(metadata=self.metadata(), resource=queue)
            report.status = "PASS"
            report.status_extended = f"SQS queue {queue.id} is not public."
            if queue.policy:
                for statement in queue.policy["Statement"]:
                    # Only check allow statements
                    if statement["Effect"] == "Allow":
                        if "Principal" in statement and (
                            "*" in statement["Principal"]
                            or (
                                "AWS" in statement["Principal"]
                                and "*" in statement["Principal"]["AWS"]
                            )
                            or (
                                "CanonicalUser" in statement["Principal"]
                                and "*" in statement["Principal"]["CanonicalUser"]
                            )
                        ):
                            if "Condition" in statement:
                                if is_condition_block_restrictive(
                                    statement["Condition"],
                                    sqs_client.audited_account,
                                    True,
                                ):
                                    report.status_extended = f"SQS queue {queue.id} is not public because its policy only allows access from the same account."
                                else:
                                    report.status = "FAIL"
                                    report.status_extended = f"SQS queue {queue.id} is public because its policy allows public access, and the condition does not limit access to resources within the same account."
                                    break
                            else:
                                report.status = "FAIL"
                                report.status_extended = f"SQS queue {queue.id} is public because its policy allows public access."
                                break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sqs_queues_not_publicly_accessible_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/sqs/sqs_queues_not_publicly_accessible/sqs_queues_not_publicly_accessible_fixer.py

```python
import json

from prowler.lib.logger import logger
from prowler.providers.aws.services.sqs.sqs_client import sqs_client


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the SQS queue's resource-based policy to remove public access and replace with trusted account access.
    Specifically, this fixer checks if any statement has a public Principal (e.g., "*" or "CanonicalUser")
    and replaces it with the ARN of the trusted AWS account.
    Requires the sqs:SetQueueAttributes permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "sqs:SetQueueAttributes",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The SQS queue name or ARN.
        region (str): AWS region where the SQS queue exists.
    Returns:
        bool: True if the operation is successful (policy updated), False otherwise.
    """
    try:
        account_id = sqs_client.audited_account
        audited_partition = sqs_client.audited_partition

        regional_client = sqs_client.regional_clients[region]

        queue_name = resource_id.split("/")[-1]

        trusted_policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "ProwlerFixerStatement",
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": account_id,
                    },
                    "Action": "sqs:*",
                    "Resource": f"arn:{audited_partition}:sqs:{region}:{account_id}:{queue_name}",
                }
            ],
        }

        regional_client.set_queue_attributes(
            QueueUrl=resource_id,
            Attributes={"Policy": json.dumps(trusted_policy)},
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

---[FILE: sqs_queues_server_side_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sqs/sqs_queues_server_side_encryption_enabled/sqs_queues_server_side_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sqs_queues_server_side_encryption_enabled",
  "CheckTitle": "Check if SQS queues have Server Side Encryption enabled",
  "CheckType": [],
  "ServiceName": "sqs",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sqs:region:account-id:queue",
  "Severity": "medium",
  "ResourceType": "AwsSqsQueue",
  "Description": "Check if SQS queues have Server Side Encryption enabled",
  "Risk": "If not enabled sensitive information in transit is not protected.",
  "RelatedUrl": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-sse-existing-queue.html",
  "Remediation": {
    "Code": {
      "CLI": "aws sqs set-queue-attributes --queue-url <QUEUE_URL> --attributes KmsMasterKeyId=<KEY>",
      "NativeIaC": "https://docs.prowler.com/checks/aws/general-policies/general_16-encrypt-sqs-queue#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/SQS/queue-encrypted-with-kms-customer-master-keys.html",
      "Terraform": "https://docs.prowler.com/checks/aws/general-policies/general_16-encrypt-sqs-queue#terraform"
    },
    "Recommendation": {
      "Text": "Enable Encryption. Use a CMK where possible. It will provide additional management and privacy benefits",
      "Url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-sse-existing-queue.html"
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

---[FILE: sqs_queues_server_side_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/sqs/sqs_queues_server_side_encryption_enabled/sqs_queues_server_side_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sqs.sqs_client import sqs_client


class sqs_queues_server_side_encryption_enabled(Check):
    def execute(self):
        findings = []
        for queue in sqs_client.queues:
            report = Check_Report_AWS(metadata=self.metadata(), resource=queue)
            report.status = "PASS"
            report.status_extended = (
                f"SQS queue {queue.id} is using Server Side Encryption."
            )
            if not queue.kms_key_id:
                report.status = "FAIL"
                report.status_extended = (
                    f"SQS queue {queue.id} is not using Server Side Encryption."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ssm_client.py]---
Location: prowler-master/prowler/providers/aws/services/ssm/ssm_client.py

```python
from prowler.providers.aws.services.ssm.ssm_service import SSM
from prowler.providers.common.provider import Provider

ssm_client = SSM(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: ssm_service.py]---
Location: prowler-master/prowler/providers/aws/services/ssm/ssm_service.py
Signals: Pydantic

```python
import json
import time
from enum import Enum
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class SSM(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.documents = {}
        self.compliance_resources = {}
        self.managed_instances = {}
        self.__threading_call__(self._list_documents)
        self.__threading_call__(self._get_document)
        self.__threading_call__(self._describe_document_permission)
        self.__threading_call__(self._list_resource_compliance_summaries)
        self.__threading_call__(self._describe_instance_information)

    def _list_documents(self, regional_client):
        logger.info("SSM - Listing Documents...")
        try:
            # To retrieve only the documents owned by the account
            list_documents_parameters = {
                "Filters": [
                    {
                        "Key": "Owner",
                        "Values": [
                            "Self",
                        ],
                    },
                ],
            }
            list_documents_paginator = regional_client.get_paginator("list_documents")
            for page in list_documents_paginator.paginate(**list_documents_parameters):
                for document in page["DocumentIdentifiers"]:
                    document_name = document["Name"]
                    document_arn = f"arn:{self.audited_partition}:ssm:{regional_client.region}:{self.audited_account}:document/{document_name}"
                    if not self.audit_resources or (
                        is_resource_filtered(document_arn, self.audit_resources)
                    ):
                        # We must use the Document ARN as the dict key to have unique keys
                        self.documents[document_arn] = Document(
                            arn=document_arn,
                            name=document_name,
                            region=regional_client.region,
                            tags=document.get("Tags"),
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _get_document(self, regional_client):
        logger.info("SSM - Getting Document...")
        for document in self.documents.values():
            try:
                if document.region == regional_client.region:
                    document_info = regional_client.get_document(Name=document.name)
                    self.documents[document.arn].content = json.loads(
                        document_info["Content"]
                    )

            except ClientError as error:
                if error.response["Error"]["Code"] == "ValidationException":
                    logger.warning(
                        f"{regional_client.region} --"
                        f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                        f" {error}"
                    )
                    continue

            except Exception as error:
                logger.error(
                    f"{regional_client.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )

    def _describe_document_permission(self, regional_client):
        logger.info("SSM - Describing Document Permission...")
        try:
            for document in self.documents.values():
                if document.region == regional_client.region:
                    document_permissions = regional_client.describe_document_permission(
                        Name=document.name, PermissionType="Share"
                    )
                    self.documents[document.arn].account_owners = document_permissions[
                        "AccountIds"
                    ]

        except ClientError as error:
            if error.response["Error"]["Code"] in [
                "InvalidDocumentOperation",
            ]:
                logger.warning(
                    f"{regional_client.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )
            else:
                logger.error(
                    f"{regional_client.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _list_resource_compliance_summaries(self, regional_client):
        logger.info("SSM - List Resources Compliance Summaries...")
        try:
            list_resource_compliance_summaries_paginator = (
                regional_client.get_paginator("list_resource_compliance_summaries")
            )
            for page in list_resource_compliance_summaries_paginator.paginate():
                for item in page["ResourceComplianceSummaryItems"]:
                    resource_id = item["ResourceId"]
                    resource_arn = f"arn:{self.audited_partition}:ec2:{regional_client.region}:{self.audited_account}:instance/{resource_id}"
                    if not self.audit_resources or (
                        is_resource_filtered(resource_arn, self.audit_resources)
                    ):
                        resource_status = item["Status"]

                        self.compliance_resources[resource_id] = ComplianceResource(
                            id=resource_id,
                            arn=resource_arn,
                            status=resource_status,
                            region=regional_client.region,
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _describe_instance_information(self, regional_client):
        logger.info("SSM - Describing Instance Information...")
        try:
            describe_instance_information_paginator = regional_client.get_paginator(
                "describe_instance_information"
            )
            for page in describe_instance_information_paginator.paginate():
                for item in page["InstanceInformationList"]:
                    resource_id = item["InstanceId"]
                    resource_arn = f"arn:{self.audited_partition}:ec2:{regional_client.region}:{self.audited_account}:instance/{resource_id}"
                    self.managed_instances[resource_id] = ManagedInstance(
                        arn=resource_arn,
                        id=resource_id,
                        region=regional_client.region,
                    )
                # boto3 does not properly handle throttling exceptions for
                # ssm:DescribeInstanceInformation when there are large numbers of instances
                # AWS support recommends manually reducing frequency of requests
                time.sleep(0.1)

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )


class ResourceStatus(Enum):
    COMPLIANT = "COMPLIANT"
    NON_COMPLIANT = "NON_COMPLIANT"


class ComplianceResource(BaseModel):
    id: str
    arn: str
    region: str
    status: ResourceStatus


class Document(BaseModel):
    arn: str
    name: str
    region: str
    content: dict = None
    account_owners: list[str] = None
    tags: Optional[list] = []


class ManagedInstance(BaseModel):
    arn: str
    id: str
    region: str
```

--------------------------------------------------------------------------------

---[FILE: ssm_documents_set_as_public.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ssm/ssm_documents_set_as_public/ssm_documents_set_as_public.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ssm_documents_set_as_public",
  "CheckTitle": "Check if there are SSM Documents set as public.",
  "CheckType": [],
  "ServiceName": "ssm",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:ssm:region:account-id:document/document-name",
  "Severity": "high",
  "ResourceType": "AwsSsmDocument",
  "Description": "Check if there are SSM Documents set as public.",
  "Risk": "SSM Documents may contain private information or even secrets and tokens.",
  "RelatedUrl": "https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-before-you-share.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://github.com/cloudmatos/matos/tree/master/remediations/aws/ssm/ssm-doc-block",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Carefully review the contents of the document before is shared. Enable SSM Block public sharing for documents.",
      "Url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-before-you-share.html"
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

---[FILE: ssm_documents_set_as_public.py]---
Location: prowler-master/prowler/providers/aws/services/ssm/ssm_documents_set_as_public/ssm_documents_set_as_public.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ssm.ssm_client import ssm_client


class ssm_documents_set_as_public(Check):
    def execute(self):
        findings = []
        for document in ssm_client.documents.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=document)
            trusted_account_ids = ssm_client.audit_config.get("trusted_account_ids", [])
            if ssm_client.audited_account not in trusted_account_ids:
                trusted_account_ids.append(ssm_client.audited_account)
            if not document.account_owners or document.account_owners == [
                ssm_client.audited_account
            ]:
                report.status = "PASS"
                report.status_extended = f"SSM Document {document.name} is not public."
            elif document.account_owners == ["all"]:
                report.status = "FAIL"
                report.status_extended = f"SSM Document {document.name} is public."
            elif all(owner in trusted_account_ids for owner in document.account_owners):
                report.status = "PASS"
                report.status_extended = f"SSM Document {document.name} is shared to trusted AWS accounts: {', '.join(document.account_owners)}."
            elif not all(
                owner in trusted_account_ids for owner in document.account_owners
            ):
                report.status = "FAIL"
                report.status_extended = f"SSM Document {document.name} is shared to non-trusted AWS accounts: {', '.join(document.account_owners)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
