---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 558
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 558 of 867)

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

---[FILE: eventbridge_global_endpoint_event_replication_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/eventbridge/eventbridge_global_endpoint_event_replication_enabled/eventbridge_global_endpoint_event_replication_enabled_test.py

```python
from unittest import mock

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListEndpoints":
        return {
            "Endpoints": [
                {
                    "Name": "test-endpoint-disabled",
                    "Arn": f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:endpoint/test-endpoint-disabled",
                    "ReplicationConfig": {"State": "DISABLED"},
                }
            ]
        }

    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "ListEndpoints":
        return {
            "Endpoints": [
                {
                    "Name": "test-endpoint-enabled",
                    "Arn": f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:endpoint/test-endpoint-enabled",
                    "ReplicationConfig": {"State": "ENABLED"},
                }
            ]
        }

    return make_api_call(self, operation_name, kwarg)


class Test_eventbridge_global_endpoint_event_replication_enabled:
    @mock_aws
    def test_no_endpoints(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_global_endpoint_event_replication_enabled.eventbridge_global_endpoint_event_replication_enabled.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_global_endpoint_event_replication_enabled.eventbridge_global_endpoint_event_replication_enabled import (
                eventbridge_global_endpoint_event_replication_enabled,
            )

            check = eventbridge_global_endpoint_event_replication_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_replication_disabled(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_global_endpoint_event_replication_enabled.eventbridge_global_endpoint_event_replication_enabled.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_global_endpoint_event_replication_enabled.eventbridge_global_endpoint_event_replication_enabled import (
                eventbridge_global_endpoint_event_replication_enabled,
            )

            check = eventbridge_global_endpoint_event_replication_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "EventBridge global endpoint test-endpoint-disabled does not have event replication enabled."
            )
            assert result[0].resource_id == "test-endpoint-disabled"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:endpoint/test-endpoint-disabled"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_replication_enabled(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_global_endpoint_event_replication_enabled.eventbridge_global_endpoint_event_replication_enabled.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_global_endpoint_event_replication_enabled.eventbridge_global_endpoint_event_replication_enabled import (
                eventbridge_global_endpoint_event_replication_enabled,
            )

            check = eventbridge_global_endpoint_event_replication_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "EventBridge global endpoint test-endpoint-enabled has event replication enabled."
            )
            assert result[0].resource_id == "test-endpoint-enabled"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:endpoint/test-endpoint-enabled"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_schema_registry_cross_account_access_test.py]---
Location: prowler-master/tests/providers/aws/services/eventbridge/eventbridge_schema_registry_cross_account_access/eventbridge_schema_registry_cross_account_access_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

test_schema_name = str(uuid4())
test_schema_arn = f"arn:aws:schemas:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{test_schema_name}"
self_account_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowReadWrite",
            "Effect": "Allow",
            "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"},
            "Action": "schemas:*",
            "Resource": f"arn:aws:schemas:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{test_schema_name}",
        }
    ],
}

self_other_account_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowReadWrite",
            "Effect": "Allow",
            "Principal": {"AWS": "arn:aws:iam::111111111111:root"},
            "Action": "schemas:*",
            "Resource": f"arn:aws:schemas:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{test_schema_name}",
        }
    ],
}

self_asterisk_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowReadWrite",
            "Effect": "Allow",
            "Principal": {"AWS": "*"},
            "Action": "schemas:*",
            "Resource": f"arn:aws:schemas:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:registry/{test_schema_name}",
        }
    ],
}


class Test_eventbridge_schema_registry_cross_account_access:

    def test_no_schemas(self):
        schema_client = mock.MagicMock
        schema_client.registries = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_service.Schema",
                new=schema_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.schema_client.schema_client",
                new=schema_client,
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_schema_registry_cross_account_access.eventbridge_schema_registry_cross_account_access import (
                eventbridge_schema_registry_cross_account_access,
            )

            check = eventbridge_schema_registry_cross_account_access()
            result = check.execute()
            assert len(result) == 0

    def test_schemas_self_account(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            Registry,
        )

        schema_client = mock.MagicMock
        schema_client.audited_account = AWS_ACCOUNT_NUMBER
        schema_client.registries = {
            test_schema_arn: Registry(
                name=test_schema_name,
                arn=test_schema_arn,
                region=AWS_REGION_EU_WEST_1,
                tags=[],
                policy=self_account_policy,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_service.Schema",
                new=schema_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.schema_client.schema_client",
                new=schema_client,
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_schema_registry_cross_account_access.eventbridge_schema_registry_cross_account_access import (
                eventbridge_schema_registry_cross_account_access,
            )

            check = eventbridge_schema_registry_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"EventBridge schema registry {test_schema_name} does not allow cross-account access."
            )
            assert result[0].resource_id == test_schema_name
            assert result[0].resource_arn == test_schema_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_schemas_other_account(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            Registry,
        )

        schema_client = mock.MagicMock
        schema_client.audited_account = AWS_ACCOUNT_NUMBER
        schema_client.registries = {
            test_schema_arn: Registry(
                name=test_schema_name,
                arn=test_schema_arn,
                region=AWS_REGION_EU_WEST_1,
                tags=[],
                policy=self_other_account_policy,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_service.Schema",
                new=schema_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.schema_client.schema_client",
                new=schema_client,
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_schema_registry_cross_account_access.eventbridge_schema_registry_cross_account_access import (
                eventbridge_schema_registry_cross_account_access,
            )

            check = eventbridge_schema_registry_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"EventBridge schema registry {test_schema_name} allows cross-account access."
            )
            assert result[0].resource_id == test_schema_name
            assert result[0].resource_arn == test_schema_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_schemas_asterisk_principal(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            Registry,
        )

        schema_client = mock.MagicMock
        schema_client.audited_account = AWS_ACCOUNT_NUMBER
        schema_client.registries = {
            test_schema_arn: Registry(
                name=test_schema_name,
                arn=test_schema_arn,
                region=AWS_REGION_EU_WEST_1,
                tags=[],
                policy=self_asterisk_policy,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_service.Schema",
                new=schema_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.schema_client.schema_client",
                new=schema_client,
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_schema_registry_cross_account_access.eventbridge_schema_registry_cross_account_access import (
                eventbridge_schema_registry_cross_account_access,
            )

            check = eventbridge_schema_registry_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"EventBridge schema registry {test_schema_name} allows cross-account access."
            )
            assert result[0].resource_id == test_schema_name
            assert result[0].resource_arn == test_schema_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: firehose_service_test.py]---
Location: prowler-master/tests/providers/aws/services/firehose/firehose_service_test.py

```python
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.firehose.firehose_service import (
    DatabaseSourceDescription,
    DirectPutSourceDescription,
    EncryptionStatus,
    Firehose,
    KinesisStreamSourceDescription,
    MSKSourceDescription,
    Source,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_Firehose_Service:
    # Test Firehose Service
    @mock_aws
    def test_service(self):
        # Firehose client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        firehose = Firehose(aws_provider)
        assert firehose.service == "firehose"

    # Test Firehose Client
    @mock_aws
    def test_client(self):
        # Firehose client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        firehose = Firehose(aws_provider)
        for regional_client in firehose.regional_clients.values():
            assert regional_client.__class__.__name__ == "Firehose"

    # Test Firehose Session
    @mock_aws
    def test__get_session__(self):
        # Firehose client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        firehose = Firehose(aws_provider)
        assert firehose.session.__class__.__name__ == "Session"

    # Test Firehose List Delivery Streams
    @mock_aws
    def test_list_delivery_streams(self):
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
        delivery_stream_name = arn.split("/")[-1]

        # Firehose Client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        firehose = Firehose(aws_provider)

        assert len(firehose.delivery_streams) == 1
        assert firehose.delivery_streams[arn].arn == arn
        assert firehose.delivery_streams[arn].name == delivery_stream_name
        assert firehose.delivery_streams[arn].region == AWS_REGION_EU_WEST_1
        assert firehose.delivery_streams[arn].tags == [{"Key": "key", "Value": "value"}]

    @mock_aws
    def test_list_tags_for_delivery_stream(self):
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
        delivery_stream_name = arn.split("/")[-1]

        # Firehose Client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        firehose = Firehose(aws_provider)

        assert len(firehose.delivery_streams) == 1
        assert firehose.delivery_streams[arn].arn == arn
        assert firehose.delivery_streams[arn].name == delivery_stream_name
        assert firehose.delivery_streams[arn].region == AWS_REGION_EU_WEST_1
        assert firehose.delivery_streams[arn].tags == [{"Key": "key", "Value": "value"}]

    @mock_aws
    def test_describe_delivery_stream(self):
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
        delivery_stream_name = arn.split("/")[-1]

        firehose_client.start_delivery_stream_encryption(
            DeliveryStreamName=delivery_stream_name,
            DeliveryStreamEncryptionConfigurationInput={
                "KeyARN": f"arn:aws:kms:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:key/test-kms-key-id",
                "KeyType": "CUSTOMER_MANAGED_CMK",
            },
        )

        # Firehose Client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        firehose = Firehose(aws_provider)

        assert len(firehose.delivery_streams) == 1
        assert firehose.delivery_streams[arn].arn == arn
        assert firehose.delivery_streams[arn].name == delivery_stream_name
        assert firehose.delivery_streams[arn].region == AWS_REGION_EU_WEST_1
        assert firehose.delivery_streams[arn].tags == [{"Key": "key", "Value": "value"}]
        assert firehose.delivery_streams[arn].kms_encryption == EncryptionStatus.ENABLED
        assert (
            firehose.delivery_streams[arn].kms_key_arn
            == f"arn:aws:kms:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:key/test-kms-key-id"
        )

    @mock_aws
    def test_describe_delivery_stream_source_direct_put(self):
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

        # Firehose Client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        firehose = Firehose(aws_provider)

        assert len(firehose.delivery_streams) == 1
        assert firehose.delivery_streams[arn].delivery_stream_type == "DirectPut"

        # Test Source structure
        assert isinstance(firehose.delivery_streams[arn].source, Source)
        assert isinstance(
            firehose.delivery_streams[arn].source.direct_put, DirectPutSourceDescription
        )
        assert isinstance(
            firehose.delivery_streams[arn].source.kinesis_stream,
            KinesisStreamSourceDescription,
        )
        assert isinstance(
            firehose.delivery_streams[arn].source.msk, MSKSourceDescription
        )
        assert isinstance(
            firehose.delivery_streams[arn].source.database, DatabaseSourceDescription
        )

    @mock_aws
    def test_describe_delivery_stream_source_kinesis_stream(self):
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
            Tags=[{"Key": "key", "Value": "value"}],
        )
        arn = delivery_stream["DeliveryStreamARN"]

        # Firehose Client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        firehose = Firehose(aws_provider)

        assert len(firehose.delivery_streams) == 1
        assert (
            firehose.delivery_streams[arn].delivery_stream_type
            == "KinesisStreamAsSource"
        )

        # Test Source structure
        assert isinstance(firehose.delivery_streams[arn].source, Source)
        assert isinstance(
            firehose.delivery_streams[arn].source.kinesis_stream,
            KinesisStreamSourceDescription,
        )
        assert (
            firehose.delivery_streams[arn].source.kinesis_stream.kinesis_stream_arn
            == kinesis_stream_arn
        )
```

--------------------------------------------------------------------------------

````
