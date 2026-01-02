---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 559
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 559 of 867)

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

---[FILE: firehose_stream_encrypted_at_rest_test.py]---
Location: prowler-master/tests/providers/aws/services/firehose/firehose_stream_encrypted_at_rest/firehose_stream_encrypted_at_rest_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_firehose_stream_encrypted_at_rest:
    @mock_aws
    def test_no_streams(self):
        from prowler.providers.aws.services.firehose.firehose_service import Firehose

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                firehose_stream_encrypted_at_rest,
            )

            check = firehose_stream_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_stream_kms_encryption_enabled(self):
        # Generate S3 client
        s3_client = client("s3", region_name=AWS_REGION_EU_WEST_1)
        s3_client.create_bucket(
            Bucket="test-bucket",
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )

        # Generate Firehose client
        firehose_client = client("firehose", region_name=AWS_REGION_EU_WEST_1)
        delivery_stream = firehose_client.create_delivery_stream(
            DeliveryStreamName="test-delivery-stream",
            DeliveryStreamType="DirectPut",
            S3DestinationConfiguration={
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
                "BucketARN": "arn:aws:s3:::test-bucket",
                "Prefix": "",
                "BufferingHints": {"IntervalInSeconds": 300, "SizeInMBs": 5},
                "CompressionFormat": "UNCOMPRESSED",
            },
            Tags=[{"Key": "key", "Value": "value"}],
        )
        arn = delivery_stream["DeliveryStreamARN"]
        stream_name = arn.split("/")[-1]

        firehose_client.start_delivery_stream_encryption(
            DeliveryStreamName=stream_name,
            DeliveryStreamEncryptionConfigurationInput={
                "KeyARN": f"arn:aws:kms:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:key/test-kms-key-id",
                "KeyType": "CUSTOMER_MANAGED_CMK",
            },
        )

        from prowler.providers.aws.services.firehose.firehose_service import Firehose

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                    firehose_stream_encrypted_at_rest,
                )

                check = firehose_stream_encrypted_at_rest()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Firehose Stream {stream_name} does have at rest encryption enabled."
                )

    @mock_aws
    def test_stream_kms_encryption_enabled_aws_managed_key(self):
        # Generate S3 client
        s3_client = client("s3", region_name=AWS_REGION_EU_WEST_1)
        s3_client.create_bucket(
            Bucket="test-bucket",
            CreateBucketConfiguration={"LocationConstraint": AWS_REGION_EU_WEST_1},
        )

        # Generate Firehose client
        firehose_client = client("firehose", region_name=AWS_REGION_EU_WEST_1)
        delivery_stream = firehose_client.create_delivery_stream(
            DeliveryStreamName="test-delivery-stream",
            DeliveryStreamType="DirectPut",
            S3DestinationConfiguration={
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
                "BucketARN": "arn:aws:s3:::test-bucket",
                "Prefix": "",
                "BufferingHints": {"IntervalInSeconds": 300, "SizeInMBs": 5},
                "CompressionFormat": "UNCOMPRESSED",
            },
            Tags=[{"Key": "key", "Value": "value"}],
        )
        arn = delivery_stream["DeliveryStreamARN"]
        stream_name = arn.split("/")[-1]

        firehose_client.start_delivery_stream_encryption(
            DeliveryStreamName=stream_name,
            DeliveryStreamEncryptionConfigurationInput={
                "KeyType": "AWS_OWNED_CMK",
            },
        )

        from prowler.providers.aws.services.firehose.firehose_service import Firehose

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                    firehose_stream_encrypted_at_rest,
                )

                check = firehose_stream_encrypted_at_rest()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Firehose Stream {stream_name} does have at rest encryption enabled."
                )

    @mock_aws
    def test_stream_kms_encryption_not_enabled(self):
        # Generate Firehose client
        firehose_client = client("firehose", region_name=AWS_REGION_EU_WEST_1)
        delivery_stream = firehose_client.create_delivery_stream(
            DeliveryStreamName="test-delivery-stream",
            DeliveryStreamType="DirectPut",
            S3DestinationConfiguration={
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
                "BucketARN": "arn:aws:s3:::test-bucket",
                "Prefix": "",
                "BufferingHints": {"IntervalInSeconds": 300, "SizeInMBs": 5},
                "CompressionFormat": "UNCOMPRESSED",
            },
            Tags=[{"Key": "key", "Value": "value"}],
        )
        arn = delivery_stream["DeliveryStreamARN"]
        stream_name = arn.split("/")[-1]

        from prowler.providers.aws.services.firehose.firehose_service import Firehose

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                    firehose_stream_encrypted_at_rest,
                )

                check = firehose_stream_encrypted_at_rest()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Firehose Stream {stream_name} does not have at rest encryption enabled."
                )

    @mock_aws
    def test_stream_kms_encryption_disabled(self):
        # Generate Firehose client
        firehose_client = client("firehose", region_name=AWS_REGION_EU_WEST_1)
        delivery_stream = firehose_client.create_delivery_stream(
            DeliveryStreamName="test-delivery-stream",
            DeliveryStreamType="DirectPut",
            S3DestinationConfiguration={
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
                "BucketARN": "arn:aws:s3:::test-bucket",
                "Prefix": "",
                "BufferingHints": {"IntervalInSeconds": 300, "SizeInMBs": 5},
                "CompressionFormat": "UNCOMPRESSED",
            },
            Tags=[{"Key": "key", "Value": "value"}],
        )
        arn = delivery_stream["DeliveryStreamARN"]
        stream_name = arn.split("/")[-1]

        firehose_client.start_delivery_stream_encryption(
            DeliveryStreamName=stream_name,
            DeliveryStreamEncryptionConfigurationInput={
                "KeyARN": f"arn:aws:kms:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:key/test-kms-key-id",
                "KeyType": "CUSTOMER_MANAGED_CMK",
            },
        )

        firehose_client.stop_delivery_stream_encryption(DeliveryStreamName=stream_name)

        from prowler.providers.aws.services.firehose.firehose_service import Firehose

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                    firehose_stream_encrypted_at_rest,
                )

                check = firehose_stream_encrypted_at_rest()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Firehose Stream {stream_name} does not have at rest encryption enabled."
                )

    @mock_aws
    def test_stream_kinesis_source_encrypted(self):
        # Generate Kinesis client
        kinesis_client = client("kinesis", region_name=AWS_REGION_EU_WEST_1)
        kinesis_client.create_stream(
            StreamName="test-kinesis-stream",
            ShardCount=1,
        )
        kinesis_stream_arn = f"arn:aws:kinesis:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:stream/test-kinesis-stream"

        # Enable encryption on the Kinesis stream
        kinesis_client.start_stream_encryption(
            StreamName="test-kinesis-stream",
            EncryptionType="KMS",
            KeyId=f"arn:aws:kms:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:key/test-kms-key-id",
        )

        # Generate Firehose client
        firehose_client = client("firehose", region_name=AWS_REGION_EU_WEST_1)
        delivery_stream = firehose_client.create_delivery_stream(
            DeliveryStreamName="test-delivery-stream",
            DeliveryStreamType="KinesisStreamAsSource",
            KinesisStreamSourceConfiguration={
                "KinesisStreamARN": kinesis_stream_arn,
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
            },
            S3DestinationConfiguration={
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
                "BucketARN": "arn:aws:s3:::test-bucket",
                "Prefix": "",
                "BufferingHints": {"IntervalInSeconds": 300, "SizeInMBs": 5},
                "CompressionFormat": "UNCOMPRESSED",
            },
            Tags=[{"Key": "key", "Value": "value"}],
        )
        arn = delivery_stream["DeliveryStreamARN"]
        stream_name = arn.split("/")[-1]

        from prowler.providers.aws.services.firehose.firehose_service import Firehose
        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.kinesis_client",
                    new=Kinesis(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                        firehose_stream_encrypted_at_rest,
                    )

                    check = firehose_stream_encrypted_at_rest()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == f"Firehose Stream {stream_name} does not have at rest encryption enabled even though source stream test-kinesis-stream has at rest encryption enabled."
                    )

    @mock_aws
    def test_stream_kinesis_source_encrypted_firehose_encryption_enabled(self):
        # Generate Kinesis client
        kinesis_client = client("kinesis", region_name=AWS_REGION_EU_WEST_1)
        kinesis_client.create_stream(
            StreamName="test-kinesis-stream",
            ShardCount=1,
        )

        kinesis_stream_arn = f"arn:aws:kinesis:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:stream/test-kinesis-stream"

        # Enable encryption on the Kinesis stream
        kinesis_client.start_stream_encryption(
            StreamName="test-kinesis-stream",
            EncryptionType="KMS",
            KeyId=f"arn:aws:kms:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:key/test-kms-key-id",
        )

        # Generate Firehose client
        firehose = client("firehose", region_name=AWS_REGION_EU_WEST_1)
        delivery_stream = firehose.create_delivery_stream(
            DeliveryStreamName="test-delivery-stream",
            DeliveryStreamType="KinesisStreamAsSource",
            KinesisStreamSourceConfiguration={
                "KinesisStreamARN": kinesis_stream_arn,
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
            },
            S3DestinationConfiguration={
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
                "BucketARN": "arn:aws:s3:::test-bucket",
                "Prefix": "",
                "BufferingHints": {"IntervalInSeconds": 300, "SizeInMBs": 5},
                "CompressionFormat": "UNCOMPRESSED",
            },
        )
        stream_name = delivery_stream["DeliveryStreamARN"].split("/")[-1]

        firehose.start_delivery_stream_encryption(
            DeliveryStreamName=stream_name,
            DeliveryStreamEncryptionConfigurationInput={
                "KeyType": "AWS_OWNED_CMK",
            },
        )

        from prowler.providers.aws.services.firehose.firehose_service import Firehose
        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.kinesis_client",
                new=Kinesis(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                firehose_stream_encrypted_at_rest,
            )

            check = firehose_stream_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Firehose Stream {stream_name} does have at rest encryption enabled."
            )

    @mock_aws
    def test_stream_kinesis_source_not_encrypted(self):
        # Generate Kinesis client
        kinesis_client = client("kinesis", region_name=AWS_REGION_EU_WEST_1)
        kinesis_client.create_stream(
            StreamName="test-kinesis-stream",
            ShardCount=1,
        )
        kinesis_stream_arn = f"arn:aws:kinesis:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:stream/test-kinesis-stream"

        # Generate Firehose client
        firehose_client = client("firehose", region_name=AWS_REGION_EU_WEST_1)
        delivery_stream = firehose_client.create_delivery_stream(
            DeliveryStreamName="test-delivery-stream",
            DeliveryStreamType="KinesisStreamAsSource",
            KinesisStreamSourceConfiguration={
                "KinesisStreamARN": kinesis_stream_arn,
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
            },
            S3DestinationConfiguration={
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
                "BucketARN": "arn:aws:s3:::test-bucket",
                "Prefix": "",
                "BufferingHints": {"IntervalInSeconds": 300, "SizeInMBs": 5},
                "CompressionFormat": "UNCOMPRESSED",
            },
        )
        stream_name = delivery_stream["DeliveryStreamARN"].split("/")[-1]

        from prowler.providers.aws.services.firehose.firehose_service import Firehose
        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.kinesis_client",
                new=Kinesis(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                firehose_stream_encrypted_at_rest,
            )

            check = firehose_stream_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Firehose Stream {stream_name} does not have at rest encryption enabled and the source stream test-kinesis-stream is not encrypted at rest."
            )

    @mock_aws
    def test_stream_kinesis_source_not_found(self):
        """Test case when Kinesis source stream is not found - should handle None gracefully"""
        # Generate Firehose client
        firehose_client = client("firehose", region_name=AWS_REGION_EU_WEST_1)
        delivery_stream = firehose_client.create_delivery_stream(
            DeliveryStreamName="test-delivery-stream",
            DeliveryStreamType="KinesisStreamAsSource",
            KinesisStreamSourceConfiguration={
                "KinesisStreamARN": f"arn:aws:kinesis:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:stream/non-existent-stream",
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
            },
            S3DestinationConfiguration={
                "RoleARN": "arn:aws:iam::012345678901:role/firehose-role",
                "BucketARN": "arn:aws:s3:::test-bucket",
                "Prefix": "",
                "BufferingHints": {"IntervalInSeconds": 300, "SizeInMBs": 5},
                "CompressionFormat": "UNCOMPRESSED",
            },
            Tags=[{"Key": "key", "Value": "value"}],
        )
        arn = delivery_stream["DeliveryStreamARN"]
        stream_name = arn.split("/")[-1]

        from prowler.providers.aws.services.firehose.firehose_service import Firehose
        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.firehose_client",
                new=Firehose(aws_provider),
            ):
                with mock.patch(
                    "prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest.kinesis_client",
                    new=Kinesis(aws_provider),
                ):
                    # Test Check
                    from prowler.providers.aws.services.firehose.firehose_stream_encrypted_at_rest.firehose_stream_encrypted_at_rest import (
                        firehose_stream_encrypted_at_rest,
                    )

                    check = firehose_stream_encrypted_at_rest()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == f"Firehose Stream {stream_name} does not have at rest encryption enabled and the referenced source stream could not be found."
                    )
```

--------------------------------------------------------------------------------

---[FILE: fms_service_test.py]---
Location: prowler-master/tests/providers/aws/services/fms/fms_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.fms.fms_service import FMS
from tests.providers.aws.utils import set_mocked_aws_provider

POLICY_ARN = "arn:aws:fms:us-east-1:123456789012:policy/MyFMSManagedPolicy"
POLICY_ID = "12345678-1234-1234-1234-123456789012"
POLICY_NAME = "MyFMSManagedPolicy"
RESOURCE_TYPE = "AWS::EC2::Instance"
SERVICE_TYPE = "WAF"
REMEDIATION_ENABLED = True
DELETE_UNUSED_MANAGED_RESOURCES = True

# Mocking Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListPolicies":
        return {
            "PolicyList": [
                {
                    "DeleteUnusedFMManagedResources": DELETE_UNUSED_MANAGED_RESOURCES,
                    "PolicyArn": POLICY_ARN,
                    "PolicyId": POLICY_ID,
                    "PolicyName": POLICY_NAME,
                    "RemediationEnabled": REMEDIATION_ENABLED,
                    "ResourceType": RESOURCE_TYPE,
                    "SecurityServiceType": SERVICE_TYPE,
                }
            ]
        }
    if operation_name == "ListComplianceStatus":
        return {
            "PolicyComplianceStatusList": [
                {
                    "EvaluationResults": [
                        {
                            "ComplianceStatus": "COMPLIANT",
                            "EvaluationLimitExceeded": False,
                            "ViolatorCount": 10,
                        }
                    ],
                    "IssueInfoMap": {"string": "test"},
                    "LastUpdated": datetime(2024, 1, 1),
                    "MemberAccount": "123456789012",
                    "PolicyId": POLICY_ID,
                    "PolicyName": POLICY_NAME,
                    "PolicyOwner": "123456789011",
                }
            ]
        }

    return make_api_call(self, operation_name, kwargs)


# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_FMS_Service:
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider()
        fms = FMS(aws_provider)
        assert fms.client.__class__.__name__ == "FMS"

    def test__get_service__(self):
        aws_provider = set_mocked_aws_provider()
        fms = FMS(aws_provider)
        assert fms.service == "fms"

    def test_list_policies(self):
        aws_provider = set_mocked_aws_provider()
        fms = FMS(aws_provider)
        assert len(fms.fms_policies) == 1
        assert fms.fms_admin_account is True
        assert fms.fms_policies[0].arn == POLICY_ARN
        assert fms.fms_policies[0].id == POLICY_ID
        assert fms.fms_policies[0].name == POLICY_NAME
        assert fms.fms_policies[0].resource_type == RESOURCE_TYPE
        assert fms.fms_policies[0].service_type == SERVICE_TYPE
        assert fms.fms_policies[0].remediation_enabled == REMEDIATION_ENABLED
        assert (
            fms.fms_policies[0].delete_unused_managed_resources
            == DELETE_UNUSED_MANAGED_RESOURCES
        )

    def test_list_compliance_status(self):
        aws_provider = set_mocked_aws_provider()
        fms = FMS(aws_provider)
        assert len(fms.fms_policies) == 1
        assert fms.fms_policies[0].compliance_status[0].status == "COMPLIANT"
        assert fms.fms_policies[0].compliance_status[0].account_id == "123456789012"
        assert fms.fms_policies[0].compliance_status[0].policy_id == POLICY_ID
```

--------------------------------------------------------------------------------

---[FILE: fms_policy_compliant_test.py]---
Location: prowler-master/tests/providers/aws/services/fms/fms_policy_compliant/fms_policy_compliant_test.py

```python
from unittest import mock

from prowler.providers.aws.services.fms.fms_service import (
    Policy,
    PolicyAccountComplianceStatus,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_fms_policy_compliant:
    def test_fms_not_admin(self):
        fms_client = mock.MagicMock
        fms_client.region = AWS_REGION_US_EAST_1
        fms_client.fms_admin_account = False
        with mock.patch(
            "prowler.providers.aws.services.fms.fms_service.FMS",
            new=fms_client,
        ):
            # Test Check
            from prowler.providers.aws.services.fms.fms_policy_compliant.fms_policy_compliant import (
                fms_policy_compliant,
            )

            check = fms_policy_compliant()
            result = check.execute()

            assert len(result) == 0

    def test_access_denied(self):
        fms_client = mock.MagicMock
        fms_client.region = AWS_REGION_US_EAST_1
        fms_client.fms_admin_account = None
        with mock.patch(
            "prowler.providers.aws.services.fms.fms_service.FMS",
            new=fms_client,
        ):
            # Test Check
            from prowler.providers.aws.services.fms.fms_policy_compliant.fms_policy_compliant import (
                fms_policy_compliant,
            )

            check = fms_policy_compliant()
            result = check.execute()

            assert len(result) == 0

    def test_fms_admin_with_non_compliant_policies(self):
        fms_client = mock.MagicMock
        fms_client.audited_account = AWS_ACCOUNT_NUMBER
        fms_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        fms_client.region = AWS_REGION_US_EAST_1
        fms_client.audited_partition = "aws"
        fms_client.fms_admin_account = True
        fms_client.fms_policies = [
            Policy(
                arn=f"arn:aws:fms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:policy",
                id=AWS_ACCOUNT_NUMBER,
                name="test",
                resource_type="AWS::EC2::Instance",
                service_type="WAF",
                remediation_enabled=True,
                delete_unused_managed_resources=True,
                compliance_status=[
                    PolicyAccountComplianceStatus(
                        account_id=AWS_ACCOUNT_NUMBER,
                        policy_id=AWS_ACCOUNT_NUMBER,
                        status="NON_COMPLIANT",
                    )
                ],
            )
        ]
        fms_client.policy_arn_template = f"arn:{fms_client.audited_partition}:fms:{fms_client.region}:{fms_client.audited_account}:policy"
        fms_client.__get_policy_arn_template__ = mock.MagicMock(
            return_value=fms_client.policy_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.fms.fms_service.FMS",
            new=fms_client,
        ):
            # Test Check
            from prowler.providers.aws.services.fms.fms_policy_compliant.fms_policy_compliant import (
                fms_policy_compliant,
            )

            check = fms_policy_compliant()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FMS with non-compliant policy {fms_client.fms_policies[0].name} for account {fms_client.fms_policies[0].compliance_status[0].account_id}."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:fms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource == fms_client.fms_policies[0]

    def test_fms_admin_with_compliant_policies(self):
        fms_client = mock.MagicMock
        fms_client.audited_account = AWS_ACCOUNT_NUMBER
        fms_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        fms_client.region = AWS_REGION_US_EAST_1
        fms_client.audited_partition = "aws"
        fms_client.fms_admin_account = True
        fms_client.fms_policies = [
            Policy(
                arn="arn:aws:fms:us-east-1:12345678901",
                id="12345678901",
                name="test",
                resource_type="AWS::EC2::Instance",
                service_type="WAF",
                remediation_enabled=True,
                delete_unused_managed_resources=True,
                compliance_status=[
                    PolicyAccountComplianceStatus(
                        account_id="12345678901",
                        policy_id="12345678901",
                        status="COMPLIANT",
                    )
                ],
            )
        ]
        fms_client.policy_arn_template = f"arn:{fms_client.audited_partition}:fms:{fms_client.region}:{fms_client.audited_account}:policy"
        fms_client.__get_policy_arn_template__ = mock.MagicMock(
            return_value=fms_client.policy_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.fms.fms_service.FMS",
            new=fms_client,
        ):
            # Test Check
            from prowler.providers.aws.services.fms.fms_policy_compliant.fms_policy_compliant import (
                fms_policy_compliant,
            )

            check = fms_policy_compliant()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "FMS enabled with all compliant accounts."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:fms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource == {}

    def test_fms_admin_with_non_and_compliant_policies(self):
        fms_client = mock.MagicMock
        fms_client.audited_account = AWS_ACCOUNT_NUMBER
        fms_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        fms_client.audited_partition = "aws"
        fms_client.region = AWS_REGION_US_EAST_1
        fms_client.fms_admin_account = True
        fms_client.fms_policies = [
            Policy(
                arn=f"arn:aws:fms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:policy",
                id="12345678901",
                name="test",
                resource_type="AWS::EC2::Instance",
                service_type="WAF",
                remediation_enabled=True,
                delete_unused_managed_resources=True,
                compliance_status=[
                    PolicyAccountComplianceStatus(
                        account_id="12345678901",
                        policy_id="12345678901",
                        status="COMPLIANT",
                    ),
                    PolicyAccountComplianceStatus(
                        account_id="12345678901",
                        policy_id="12345678901",
                        status="NON_COMPLIANT",
                    ),
                ],
            )
        ]
        fms_client.policy_arn_template = f"arn:{fms_client.audited_partition}:fms:{fms_client.region}:{fms_client.audited_account}:policy"
        fms_client.__get_policy_arn_template__ = mock.MagicMock(
            return_value=fms_client.policy_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.fms.fms_service.FMS",
            new=fms_client,
        ):
            # Test Check
            from prowler.providers.aws.services.fms.fms_policy_compliant.fms_policy_compliant import (
                fms_policy_compliant,
            )

            check = fms_policy_compliant()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FMS with non-compliant policy {fms_client.fms_policies[0].name} for account {fms_client.fms_policies[0].compliance_status[0].account_id}."
            )
            assert result[0].resource_id == "12345678901"
            assert (
                result[0].resource_arn
                == f"arn:aws:fms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource == fms_client.fms_policies[0]

    def test_fms_admin_without_policies(self):
        fms_client = mock.MagicMock
        fms_client.audited_account = AWS_ACCOUNT_NUMBER
        fms_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        fms_client.region = AWS_REGION_US_EAST_1
        fms_client.audited_partition = "aws"
        fms_client.fms_admin_account = True
        fms_client.fms_policies = []
        fms_client.policy_arn_template = f"arn:{fms_client.audited_partition}:fms:{fms_client.region}:{fms_client.audited_account}:policy"
        fms_client.__get_policy_arn_template__ = mock.MagicMock(
            return_value=fms_client.policy_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.fms.fms_service.FMS",
            new=fms_client,
        ):
            # Test Check
            from prowler.providers.aws.services.fms.fms_policy_compliant.fms_policy_compliant import (
                fms_policy_compliant,
            )

            check = fms_policy_compliant()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FMS without any compliant policy for account {AWS_ACCOUNT_NUMBER}."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:fms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource == {}

    def test_fms_admin_with_policy_with_null_status(self):
        fms_client = mock.MagicMock
        fms_client.audited_account = AWS_ACCOUNT_NUMBER
        fms_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        fms_client.audited_partition = "aws"
        fms_client.region = AWS_REGION_US_EAST_1
        fms_client.fms_admin_account = True
        fms_client.fms_policies = [
            Policy(
                arn="arn:aws:fms:us-east-1:12345678901",
                id="12345678901",
                name="test",
                resource_type="AWS::EC2::Instance",
                service_type="WAF",
                remediation_enabled=True,
                delete_unused_managed_resources=True,
                compliance_status=[
                    PolicyAccountComplianceStatus(
                        account_id="12345678901",
                        policy_id="12345678901",
                        status="",
                    ),
                ],
            )
        ]
        fms_client.policy_arn_template = f"arn:{fms_client.audited_partition}:fms:{fms_client.region}:{fms_client.audited_account}:policy"
        fms_client.__get_policy_arn_template__ = mock.MagicMock(
            return_value=fms_client.policy_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.fms.fms_service.FMS",
            new=fms_client,
        ):
            # Test Check
            from prowler.providers.aws.services.fms.fms_policy_compliant.fms_policy_compliant import (
                fms_policy_compliant,
            )

            check = fms_policy_compliant()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"FMS with non-compliant policy {fms_client.fms_policies[0].name} for account {fms_client.fms_policies[0].compliance_status[0].account_id}."
            )
            assert result[0].resource_id == "12345678901"
            assert result[0].resource_arn == "arn:aws:fms:us-east-1:12345678901"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource == fms_client.fms_policies[0]
```

--------------------------------------------------------------------------------

````
