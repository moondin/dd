---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 634
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 634 of 867)

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

---[FILE: sqs_queues_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/sqs/sqs_queues_not_publicly_accessible/sqs_queues_not_publicly_accessible_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sqs.sqs_service import Queue
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

test_queue_name = str(uuid4())
test_queue_url = f"https://sqs.{AWS_REGION_EU_WEST_1}.amazonaws.com/{AWS_ACCOUNT_NUMBER}/{test_queue_name}"
test_queue_arn = (
    f"arn:aws:sqs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{test_queue_name}"
)

test_restricted_policy = {
    "Version": "2012-10-17",
    "Id": "Queue1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Queue1_AnonymousAccess_ReceiveMessage",
            "Effect": "Allow",
            "Principal": {"AWS": {AWS_ACCOUNT_NUMBER}},
            "Action": "sqs:ReceiveMessage",
            "Resource": test_queue_arn,
        }
    ],
}

test_public_policy = {
    "Version": "2012-10-17",
    "Id": "Queue1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Queue1_AnonymousAccess_ReceiveMessage",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "sqs:ReceiveMessage",
            "Resource": test_queue_arn,
        }
    ],
}

test_public_policy_with_condition_same_account_not_valid = {
    "Version": "2012-10-17",
    "Id": "Queue1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Queue1_AnonymousAccess_ReceiveMessage",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "sqs:ReceiveMessage",
            "Resource": test_queue_arn,
            "Condition": {
                "DateGreaterThan": {"aws:CurrentTime": "2009-01-31T12:00Z"},
                "DateLessThan": {"aws:CurrentTime": "2009-01-31T15:00Z"},
            },
        }
    ],
}

test_public_policy_with_condition_same_account = {
    "Version": "2012-10-17",
    "Id": "Queue1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Queue1_AnonymousAccess_ReceiveMessage",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "sqs:ReceiveMessage",
            "Resource": test_queue_arn,
            "Condition": {
                "StringEquals": {"aws:SourceAccount": f"{AWS_ACCOUNT_NUMBER}"}
            },
        }
    ],
}

test_public_policy_with_condition_diff_account = {
    "Version": "2012-10-17",
    "Id": "Queue1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Queue1_AnonymousAccess_ReceiveMessage",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "sqs:ReceiveMessage",
            "Resource": test_queue_arn,
            "Condition": {"StringEquals": {"aws:SourceAccount": "111122223333"}},
        }
    ],
}

test_public_policy_with_invalid_condition_block = {
    "Version": "2012-10-17",
    "Id": "Queue1_Policy_UUID",
    "Statement": [
        {
            "Sid": "Queue1_AnonymousAccess_ReceiveMessage",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "sqs:ReceiveMessage",
            "Resource": test_queue_arn,
            "Condition": {"DateGreaterThan": {"aws:CurrentTime": "2009-01-31T12:00Z"}},
        }
    ],
}


class Test_sqs_queues_not_publicly_accessible:
    def test_no_queues(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible import (
                sqs_queues_not_publicly_accessible,
            )

            check = sqs_queues_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    def test_queues_not_public(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        sqs_client.queues.append(
            Queue(
                id=test_queue_url,
                name=test_queue_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_restricted_policy,
                arn=test_queue_arn,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible import (
                sqs_queues_not_publicly_accessible,
            )

            check = sqs_queues_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQS queue {test_queue_url} is not public."
            )
            assert result[0].resource_id == test_queue_url
            assert result[0].resource_arn == test_queue_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_queues_public(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        sqs_client.queues.append(
            Queue(
                id=test_queue_url,
                name=test_queue_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy,
                arn=test_queue_arn,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible import (
                sqs_queues_not_publicly_accessible,
            )

            check = sqs_queues_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQS queue {test_queue_url} is public because its policy allows public access."
            )
            assert result[0].resource_id == test_queue_url
            assert result[0].resource_arn == test_queue_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_queues_public_with_condition_not_valid(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        sqs_client.audited_account = AWS_ACCOUNT_NUMBER
        sqs_client.queues.append(
            Queue(
                id=test_queue_url,
                name=test_queue_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy_with_condition_same_account_not_valid,
                arn=test_queue_arn,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible import (
                sqs_queues_not_publicly_accessible,
            )

            check = sqs_queues_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQS queue {test_queue_url} is public because its policy allows public access, and the condition does not limit access to resources within the same account."
            )
            assert result[0].resource_id == test_queue_url
            assert result[0].resource_arn == test_queue_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_queues_public_with_condition_valid(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        sqs_client.audited_account = AWS_ACCOUNT_NUMBER
        sqs_client.queues.append(
            Queue(
                id=test_queue_url,
                name=test_queue_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy_with_condition_same_account,
                arn=test_queue_arn,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible import (
                sqs_queues_not_publicly_accessible,
            )

            check = sqs_queues_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQS queue {test_queue_url} is not public because its policy only allows access from the same account."
            )
            assert result[0].resource_id == test_queue_url
            assert result[0].resource_arn == test_queue_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_queues_public_with_condition_valid_with_other_account(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        sqs_client.audited_account = AWS_ACCOUNT_NUMBER
        sqs_client.queues.append(
            Queue(
                id=test_queue_url,
                name=test_queue_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy_with_condition_diff_account,
                arn=test_queue_arn,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible import (
                sqs_queues_not_publicly_accessible,
            )

            check = sqs_queues_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQS queue {test_queue_url} is not public because its policy only allows access from the same account."
            )
            assert result[0].resource_id == test_queue_url
            assert result[0].resource_arn == test_queue_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_queues_public_with_condition_with_invalid_block(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        sqs_client.audited_account = AWS_ACCOUNT_NUMBER
        sqs_client.queues.append(
            Queue(
                id=test_queue_url,
                name=test_queue_name,
                region=AWS_REGION_EU_WEST_1,
                policy=test_public_policy_with_invalid_condition_block,
                arn=test_queue_arn,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_not_publicly_accessible.sqs_queues_not_publicly_accessible import (
                sqs_queues_not_publicly_accessible,
            )

            check = sqs_queues_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQS queue {test_queue_url} is public because its policy allows public access, and the condition does not limit access to resources within the same account."
            )
            assert result[0].resource_id == test_queue_url
            assert result[0].resource_arn == test_queue_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: sqs_queues_server_side_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/sqs/sqs_queues_server_side_encryption_enabled/sqs_queues_server_side_encryption_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.sqs.sqs_service import Queue
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

test_kms_key_id = str(uuid4())
test_queue_name = str(uuid4())
test_queue_url = f"https://sqs.{AWS_REGION_EU_WEST_1}.amazonaws.com/{AWS_ACCOUNT_NUMBER}/{test_queue_name}"
test_queue_arn = (
    f"arn:aws:sqs:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{test_queue_name}"
)


class Test_sqs_queues_server_side_encryption_enabled:
    def test_no_queues(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_server_side_encryption_enabled.sqs_queues_server_side_encryption_enabled import (
                sqs_queues_server_side_encryption_enabled,
            )

            check = sqs_queues_server_side_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_queues_with_encryption(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        sqs_client.queues.append(
            Queue(
                id=test_queue_url,
                name=test_queue_name,
                region=AWS_REGION_EU_WEST_1,
                kms_key_id=test_kms_key_id,
                arn=test_queue_arn,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_server_side_encryption_enabled.sqs_queues_server_side_encryption_enabled import (
                sqs_queues_server_side_encryption_enabled,
            )

            check = sqs_queues_server_side_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SQS queue {test_queue_url} is using Server Side Encryption."
            )
            assert result[0].resource_id == test_queue_url
            assert result[0].resource_arn == test_queue_arn

    def test_queues_no_encryption(self):
        sqs_client = mock.MagicMock
        sqs_client.queues = []
        sqs_client.queues.append(
            Queue(
                id=test_queue_url,
                name=test_queue_name,
                region=AWS_REGION_EU_WEST_1,
                arn=test_queue_arn,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_service.SQS",
                new=sqs_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.sqs.sqs_client.sqs_client",
                new=sqs_client,
            ),
        ):
            from prowler.providers.aws.services.sqs.sqs_queues_server_side_encryption_enabled.sqs_queues_server_side_encryption_enabled import (
                sqs_queues_server_side_encryption_enabled,
            )

            check = sqs_queues_server_side_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SQS queue {test_queue_url} is not using Server Side Encryption."
            )
            assert result[0].resource_id == test_queue_url
            assert result[0].resource_arn == test_queue_arn
```

--------------------------------------------------------------------------------

---[FILE: ssm_service_test.py]---
Location: prowler-master/tests/providers/aws/services/ssm/ssm_service_test.py

```python
from unittest.mock import patch

import botocore
import yaml
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.ssm.ssm_service import SSM, ResourceStatus
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListResourceComplianceSummaries":
        return {
            "ResourceComplianceSummaryItems": [
                {
                    "ComplianceType": "Association",
                    "ResourceType": "ManagedInstance",
                    "ResourceId": "i-1234567890abcdef0",
                    "Status": "COMPLIANT",
                    "OverallSeverity": "UNSPECIFIED",
                    "ExecutionSummary": {"ExecutionTime": 1550509273.0},
                    "CompliantSummary": {
                        "CompliantCount": 2,
                        "SeveritySummary": {
                            "CriticalCount": 0,
                            "HighCount": 0,
                            "MediumCount": 0,
                            "LowCount": 0,
                            "InformationalCount": 0,
                            "UnspecifiedCount": 2,
                        },
                    },
                    "NonCompliantSummary": {
                        "NonCompliantCount": 0,
                        "SeveritySummary": {
                            "CriticalCount": 0,
                            "HighCount": 0,
                            "MediumCount": 0,
                            "LowCount": 0,
                            "InformationalCount": 0,
                            "UnspecifiedCount": 0,
                        },
                    },
                },
            ],
        }
    if operation_name == "DescribeInstanceInformation":
        return {
            "InstanceInformationList": [
                {
                    "InstanceId": "test-instance-id",
                },
            ],
        }

    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


# SSM Document YAML Template
ssm_document_yaml = """
schemaVersion: "2.2"
description: "Sample Yaml"
parameters:
  Parameter1:
    type: "Integer"
    default: 3
    description: "Command Duration."
    allowedValues: [1,2,3,4]
  Parameter2:
    type: "String"
    default: "def"
    description:
    allowedValues: ["abc", "def", "ghi"]
    allowedPattern: r"^[a-zA-Z0-9_-.]{3,128}$"
  Parameter3:
    type: "Boolean"
    default: false
    description: "A boolean"
    allowedValues: [True, False]
  Parameter4:
    type: "StringList"
    default: ["abc", "def"]
    description: "A string list"
  Parameter5:
    type: "StringMap"
    default:
      NotificationType: Command
      NotificationEvents:
      - Failed
      NotificationArn: "$dependency.topicArn"
    description:
  Parameter6:
    type: "MapList"
    default:
    - DeviceName: "/dev/sda1"
      Ebs:
        VolumeSize: '50'
    - DeviceName: "/dev/sdm"
      Ebs:
        VolumeSize: '100'
    description:
mainSteps:
  - action: "aws:runShellScript"
    name: "sampleCommand"
    inputs:
      runCommand:
        - "echo hi"
"""


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_SSM_Service:
    # Test SSM Client
    @mock_aws
    def test_get_client(self):
        ssm = SSM(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert ssm.regional_clients[AWS_REGION_US_EAST_1].__class__.__name__ == "SSM"

    # Test SSM Session
    @mock_aws
    def test__get_session__(self):
        ssm = SSM(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert ssm.session.__class__.__name__ == "Session"

    # Test SSM Service
    @mock_aws
    def test__get_service__(self):
        ssm = SSM(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        assert ssm.service == "ssm"

    @mock_aws
    def test_list_documents(self):
        # Create SSM Document
        ssm_client = client("ssm", region_name=AWS_REGION_US_EAST_1)
        ssm_document_name = "test-document"
        _ = ssm_client.create_document(
            Content=ssm_document_yaml,
            Name=ssm_document_name,
            DocumentType="Command",
            DocumentFormat="YAML",
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
        )
        # Add permissions
        ssm_client.modify_document_permission(
            Name=ssm_document_name,
            PermissionType="Share",
            AccountIdsToAdd=[AWS_ACCOUNT_NUMBER],
        )

        ssm = SSM(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))

        document_arn = f"arn:aws:ssm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:document/{ssm_document_name}"

        assert len(ssm.documents) == 1
        assert ssm.documents
        assert ssm.documents[document_arn]
        assert ssm.documents[document_arn].arn == document_arn
        assert ssm.documents[document_arn].name == ssm_document_name
        assert ssm.documents[document_arn].region == AWS_REGION_US_EAST_1
        assert ssm.documents[document_arn].tags == [
            {"Key": "test", "Value": "test"},
        ]
        assert ssm.documents[document_arn].content == yaml.safe_load(ssm_document_yaml)
        assert ssm.documents[document_arn].account_owners == [AWS_ACCOUNT_NUMBER]

    @mock_aws
    def test_list_resource_compliance_summaries(self):
        ssm = SSM(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))
        instance_id = "i-1234567890abcdef0"
        assert len(ssm.compliance_resources) == 1
        assert ssm.compliance_resources
        assert ssm.compliance_resources[instance_id]
        assert ssm.compliance_resources[instance_id].id == instance_id
        assert (
            ssm.compliance_resources[instance_id].arn
            == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:instance/{instance_id}"
        )
        assert ssm.compliance_resources[instance_id].region == AWS_REGION_US_EAST_1
        assert ssm.compliance_resources[instance_id].status == ResourceStatus.COMPLIANT
```

--------------------------------------------------------------------------------

---[FILE: ssm_documents_set_as_public_test.py]---
Location: prowler-master/tests/providers/aws/services/ssm/ssm_documents_set_as_public/ssm_documents_set_as_public_test.py

```python
from unittest import mock

from prowler.providers.aws.services.ssm.ssm_service import Document
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_ssm_documents_set_as_public:
    def test_no_documents(self):
        ssm_client = mock.MagicMock
        ssm_client.documents = {}
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_documents_set_as_public.ssm_documents_set_as_public import (
                ssm_documents_set_as_public,
            )

            check = ssm_documents_set_as_public()
            result = check.execute()

            assert len(result) == 0

    def test_document_public_account_owners(self):
        ssm_client = mock.MagicMock
        document_name = "test-document"
        document_arn = f"arn:aws:ssm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:document/{document_name}"
        ssm_client.audited_account = AWS_ACCOUNT_NUMBER
        ssm_client.documents = {
            document_name: Document(
                arn=document_arn,
                name=document_name,
                region=AWS_REGION_US_EAST_1,
                content="",
                account_owners=["111111111111", "111111222222"],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_documents_set_as_public.ssm_documents_set_as_public import (
                ssm_documents_set_as_public,
            )

            check = ssm_documents_set_as_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == document_name
            assert result[0].resource_arn == document_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"SSM Document {document_name} is shared to non-trusted AWS accounts: 111111111111, 111111222222."
            )

    def test_document_public_all_account_owners(self):
        ssm_client = mock.MagicMock
        document_name = "test-document"
        document_arn = f"arn:aws:ssm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:document/{document_name}"
        ssm_client.audited_account = AWS_ACCOUNT_NUMBER
        ssm_client.documents = {
            document_name: Document(
                arn=document_arn,
                name=document_name,
                region=AWS_REGION_US_EAST_1,
                content="",
                account_owners=["all"],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_documents_set_as_public.ssm_documents_set_as_public import (
                ssm_documents_set_as_public,
            )

            check = ssm_documents_set_as_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == document_name
            assert result[0].resource_arn == document_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == f"SSM Document {document_name} is public."
            )

    def test_document_public_to_other_trusted_AWS_accounts(self):
        ssm_client = mock.MagicMock
        document_name = "test-document"
        document_arn = f"arn:aws:ssm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:document/{document_name}"
        ssm_client.audited_account = AWS_ACCOUNT_NUMBER
        ssm_client.documents = {
            document_name: Document(
                arn=document_arn,
                name=document_name,
                region=AWS_REGION_US_EAST_1,
                content="",
                account_owners=["111111111333", "111111222444"],
            )
        }
        ssm_client.audit_config = {
            "trusted_account_ids": ["111111111333", "111111222444"]
        }
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_documents_set_as_public.ssm_documents_set_as_public import (
                ssm_documents_set_as_public,
            )

            check = ssm_documents_set_as_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == document_name
            assert result[0].resource_arn == document_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SSM Document {document_name} is shared to trusted AWS accounts: 111111111333, 111111222444."
            )

    def test_document_public_to_self_account(self):
        ssm_client = mock.MagicMock
        document_name = "test-document"
        document_arn = f"arn:aws:ssm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:document/{document_name}"
        ssm_client.audited_account = AWS_ACCOUNT_NUMBER
        ssm_client.documents = {
            document_name: Document(
                arn=document_arn,
                name=document_name,
                region=AWS_REGION_US_EAST_1,
                content="",
                account_owners=[AWS_ACCOUNT_NUMBER],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_documents_set_as_public.ssm_documents_set_as_public import (
                ssm_documents_set_as_public,
            )

            check = ssm_documents_set_as_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == document_name
            assert result[0].resource_arn == document_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SSM Document {document_name} is not public."
            )

    def test_document_not_public(self):
        ssm_client = mock.MagicMock
        document_name = "test-document"
        document_arn = f"arn:aws:ssm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:document/{document_name}"
        ssm_client.audited_account = AWS_ACCOUNT_NUMBER
        ssm_client.documents = {
            document_name: Document(
                arn=document_arn,
                name=document_name,
                region=AWS_REGION_US_EAST_1,
                content="",
                account_owners=[],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_documents_set_as_public.ssm_documents_set_as_public import (
                ssm_documents_set_as_public,
            )

            check = ssm_documents_set_as_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == document_name
            assert result[0].resource_arn == document_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"SSM Document {document_name} is not public."
            )
```

--------------------------------------------------------------------------------

---[FILE: ssm_document_secrets_test.py]---
Location: prowler-master/tests/providers/aws/services/ssm/ssm_document_secrets/ssm_document_secrets_test.py

```python
from unittest import mock

from prowler.providers.aws.services.ssm.ssm_service import Document
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_ssm_documents_secrets:
    def test_no_documents(self):
        ssm_client = mock.MagicMock
        ssm_client.documents = {}
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_document_secrets.ssm_document_secrets import (
                ssm_document_secrets,
            )

            check = ssm_document_secrets()
            result = check.execute()

            assert len(result) == 0

    def test_document_with_secrets(self):
        ssm_client = mock.MagicMock
        document_name = "test-document"
        document_arn = f"arn:aws:ssm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:document/{document_name}"
        ssm_client.audited_account = AWS_ACCOUNT_NUMBER
        ssm_client.audit_config = {"detect_secrets_plugins": None}
        ssm_client.documents = {
            document_name: Document(
                arn=document_arn,
                name=document_name,
                region=AWS_REGION_US_EAST_1,
                content={"db_password": "test-password"},
                account_owners=[],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_document_secrets.ssm_document_secrets import (
                ssm_document_secrets,
            )

            check = ssm_document_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == document_name
            assert result[0].resource_arn == document_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in SSM Document {document_name} -> Secret Keyword on line 2."
            )

    def test_document_no_secrets(self):
        ssm_client = mock.MagicMock
        document_name = "test-document"
        document_arn = f"arn:aws:ssm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:document/{document_name}"
        ssm_client.audited_account = AWS_ACCOUNT_NUMBER
        ssm_client.documents = {
            document_name: Document(
                arn=document_arn,
                name=document_name,
                region=AWS_REGION_US_EAST_1,
                content={"profile": "test"},
                account_owners=[],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.ssm.ssm_service.SSM",
            new=ssm_client,
        ):
            # Test Check
            from prowler.providers.aws.services.ssm.ssm_document_secrets.ssm_document_secrets import (
                ssm_document_secrets,
            )

            check = ssm_document_secrets()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == document_name
            assert result[0].resource_arn == document_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in SSM Document {document_name}."
            )
```

--------------------------------------------------------------------------------

````
