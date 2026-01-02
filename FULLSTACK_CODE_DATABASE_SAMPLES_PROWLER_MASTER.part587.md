---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 587
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 587 of 867)

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

---[FILE: kinesis_service_test.py]---
Location: prowler-master/tests/providers/aws/services/kinesis/kinesis_service_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.kinesis.kinesis_service import (
    EncryptionType,
    Kinesis,
    StreamStatus,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListStreams":
        return {
            "StreamNames": ["test-stream"],
            "StreamSummaries": [
                {
                    "StreamName": "test-stream",
                    "StreamARN": "arn:aws:kinesis:us-east-1:123456789012:stream/test-stream",
                    "StreamStatus": "ACTIVE",
                }
            ],
        }
    if operation_name == "DescribeStream":
        return {
            "StreamDescription": {
                "StreamName": "test-stream",
                "StreamARN": "arn:aws:kinesis:us-east-1:123456789012:stream/test-stream",
                "StreamStatus": "ACTIVE",
                "Tags": [{"Key": "test_tag", "Value": "test_value"}],
                "EncryptionType": "KMS",
                "RetentionPeriodHours": 24,
            }
        }
    if operation_name == "ListTagsForStream":
        return {"Tags": [{"Key": "test_tag", "Value": "test_value"}]}
    return make_api_call(self, operation_name, kwarg)


# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_Kinesis_Service:
    # Test Kinesis Client
    @mock_aws
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kinesis = Kinesis(aws_provider)
        assert (
            kinesis.regional_clients[AWS_REGION_US_EAST_1].__class__.__name__
            == "Kinesis"
        )

    # Test Kinesis Session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kinesis = Kinesis(aws_provider)
        assert kinesis.session.__class__.__name__ == "Session"

    # Test Kinesis Service
    @mock_aws
    def test__get_service__(self):
        kinesis = Kinesis(set_mocked_aws_provider())
        assert kinesis.service == "kinesis"

    @mock_aws
    def test_list_streamscomplete(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kinesis = Kinesis(aws_provider)

        arn = "arn:aws:kinesis:us-east-1:123456789012:stream/test-stream"
        assert len(kinesis.streams) == 1
        assert kinesis.streams[arn].name == "test-stream"
        assert kinesis.streams[arn].status == StreamStatus.ACTIVE
        assert kinesis.streams[arn].tags == [{"Key": "test_tag", "Value": "test_value"}]
        assert kinesis.streams[arn].region == AWS_REGION_US_EAST_1
        assert kinesis.streams[arn].arn == arn

    @mock_aws
    def test_describe_stream(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kinesis = Kinesis(aws_provider)

        arn = "arn:aws:kinesis:us-east-1:123456789012:stream/test-stream"
        assert kinesis.streams[arn].name == "test-stream"
        assert kinesis.streams[arn].status == StreamStatus.ACTIVE
        assert kinesis.streams[arn].tags == [{"Key": "test_tag", "Value": "test_value"}]
        assert kinesis.streams[arn].region == AWS_REGION_US_EAST_1
        assert kinesis.streams[arn].arn == arn
        assert kinesis.streams[arn].encrypted_at_rest == EncryptionType.KMS
        assert kinesis.streams[arn].retention_period == 24
```

--------------------------------------------------------------------------------

---[FILE: kinesis_stream_data_retention_period_test.py]---
Location: prowler-master/tests/providers/aws/services/kinesis/kinesis_stream_data_retention_period/kinesis_stream_data_retention_period_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_kinesis_encrypted_at_rest:
    @mock_aws
    def test_no_streams(self):
        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kinesis.kinesis_stream_data_retention_period.kinesis_stream_data_retention_period.kinesis_client",
                new=Kinesis(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kinesis.kinesis_stream_data_retention_period.kinesis_stream_data_retention_period import (
                kinesis_stream_data_retention_period,
            )

            check = kinesis_stream_data_retention_period()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_adequate_retention_period(self):
        kinesis_client = client("kinesis", region_name=AWS_REGION_US_EAST_1)
        stream_name = "stream_test_us"
        kinesis_client.create_stream(
            StreamName=stream_name,
            ShardCount=1,
            StreamModeDetails={"StreamMode": "PROVISIONED"},
        )
        retention_period = 400
        kinesis_client.increase_stream_retention_period(
            StreamName=stream_name,
            RetentionPeriodHours=retention_period,
            StreamARN=f"arn:aws:kinesis:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:stream/{stream_name}",
        )

        kinesis_client.audit_config = mock.MagicMock()
        kinesis_client.audit_config = {"min_kinesis_stream_retention_hours": 350}

        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kinesis.kinesis_stream_data_retention_period.kinesis_stream_data_retention_period.kinesis_client",
                new=Kinesis(aws_provider),
            ),
        ):
            with mock.patch(
                "prowler.providers.aws.services.kinesis.kinesis_stream_data_retention_period.kinesis_stream_data_retention_period.kinesis_client.audit_config",
                new=kinesis_client.audit_config,
            ):
                # Test Check
                from prowler.providers.aws.services.kinesis.kinesis_stream_data_retention_period.kinesis_stream_data_retention_period import (
                    kinesis_stream_data_retention_period,
                )

                check = kinesis_stream_data_retention_period()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Kinesis Stream {stream_name} does have an adequate data retention period ({retention_period}hrs)."
                )
                assert result[0].resource_id == stream_name
                assert (
                    result[0].resource_arn
                    == f"arn:aws:kinesis:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:stream/{stream_name}"
                )
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_unadequate_retention_period(self):
        kinesis_client = client("kinesis", region_name=AWS_REGION_US_EAST_1)
        stream_name = "stream_test_us"
        kinesis_client.create_stream(
            StreamName=stream_name,
            ShardCount=1,
            StreamModeDetails={"StreamMode": "PROVISIONED"},
        )
        retention_period = 200
        kinesis_client.increase_stream_retention_period(
            StreamName=stream_name,
            RetentionPeriodHours=retention_period,
            StreamARN=f"arn:aws:kinesis:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:stream/{stream_name}",
        )

        kinesis_client.audit_config = mock.MagicMock()
        kinesis_client.audit_config = {"min_kinesis_stream_retention_hours": 250}

        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kinesis.kinesis_stream_data_retention_period.kinesis_stream_data_retention_period.kinesis_client",
                new=Kinesis(aws_provider),
            ),
        ):
            with mock.patch(
                "prowler.providers.aws.services.kinesis.kinesis_stream_data_retention_period.kinesis_stream_data_retention_period.kinesis_client.audit_config",
                new=kinesis_client.audit_config,
            ):
                # Test Check
                from prowler.providers.aws.services.kinesis.kinesis_stream_data_retention_period.kinesis_stream_data_retention_period import (
                    kinesis_stream_data_retention_period,
                )

                check = kinesis_stream_data_retention_period()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Kinesis Stream {stream_name} does not have an adequate data retention period ({retention_period}hrs)."
                )
                assert result[0].resource_id == stream_name
                assert (
                    result[0].resource_arn
                    == f"arn:aws:kinesis:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:stream/{stream_name}"
                )
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: kinesis_stream_encrypted_at_rest_test.py]---
Location: prowler-master/tests/providers/aws/services/kinesis/kinesis_stream_encrypted_at_rest/kinesis_stream_encrypted_at_rest_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_kinesis_encrypted_at_rest:
    @mock_aws
    def test_no_streams(self):
        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kinesis.kinesis_stream_encrypted_at_rest.kinesis_stream_encrypted_at_rest.kinesis_client",
                new=Kinesis(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kinesis.kinesis_stream_encrypted_at_rest.kinesis_stream_encrypted_at_rest import (
                kinesis_stream_encrypted_at_rest,
            )

            check = kinesis_stream_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_encrypted_stream(self):
        kinesis_client = client("kinesis", region_name=AWS_REGION_US_EAST_1)
        stream_name = "stream_test_us"
        kinesis_client.create_stream(
            StreamName=stream_name,
            ShardCount=1,
            StreamModeDetails={"StreamMode": "PROVISIONED"},
        )

        kinesis_client.start_stream_encryption(
            StreamName=stream_name,
            EncryptionType="KMS",
            KeyId="arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012",
        )

        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kinesis.kinesis_stream_encrypted_at_rest.kinesis_stream_encrypted_at_rest.kinesis_client",
                new=Kinesis(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kinesis.kinesis_stream_encrypted_at_rest.kinesis_stream_encrypted_at_rest import (
                kinesis_stream_encrypted_at_rest,
            )

            check = kinesis_stream_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Kinesis Stream {stream_name} is encrypted at rest."
            )
            assert result[0].resource_id == stream_name
            assert (
                result[0].resource_arn
                == f"arn:aws:kinesis:{AWS_REGION_US_EAST_1}:123456789012:stream/{stream_name}"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_non_encrypted_stream(self):
        kinesis_client = client("kinesis", region_name=AWS_REGION_US_EAST_1)
        stream_name = "stream_test_us"
        kinesis_client.create_stream(
            StreamName=stream_name,
            ShardCount=1,
            StreamModeDetails={"StreamMode": "PROVISIONED"},
        )

        from prowler.providers.aws.services.kinesis.kinesis_service import Kinesis

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kinesis.kinesis_stream_encrypted_at_rest.kinesis_stream_encrypted_at_rest.kinesis_client",
                new=Kinesis(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kinesis.kinesis_stream_encrypted_at_rest.kinesis_stream_encrypted_at_rest import (
                kinesis_stream_encrypted_at_rest,
            )

            check = kinesis_stream_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Kinesis Stream {stream_name} is not encrypted at rest."
            )
            assert result[0].resource_id == stream_name
            assert (
                result[0].resource_arn
                == f"arn:aws:kinesis:{AWS_REGION_US_EAST_1}:123456789012:stream/{stream_name}"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: kms_service_test.py]---
Location: prowler-master/tests/providers/aws/services/kms/kms_service_test.py

```python
import json

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.kms.kms_service import KMS
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_KMS_Service:

    # Test KMS Service
    @mock_aws
    def test_service(self):
        # KMS client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kms = KMS(aws_provider)
        assert kms.service == "kms"

    # Test KMS Client
    @mock_aws
    def test_client(self):
        # KMS client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kms = KMS(aws_provider)
        for regional_client in kms.regional_clients.values():
            assert regional_client.__class__.__name__ == "KMS"

    # Test KMS Session
    @mock_aws
    def test__get_session__(self):
        # KMS client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kms = KMS(aws_provider)
        assert kms.session.__class__.__name__ == "Session"

    # Test KMS Session
    @mock_aws
    def test_audited_account(self):
        # KMS client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kms = KMS(aws_provider)
        assert kms.audited_account == AWS_ACCOUNT_NUMBER

    # Test KMS List Keys
    @mock_aws
    def test_list_keys(self):
        # Generate KMS Client
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        # Create KMS keys
        key1 = kms_client.create_key()["KeyMetadata"]
        key2 = kms_client.create_key()["KeyMetadata"]
        # KMS client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kms = KMS(aws_provider)
        assert len(kms.keys) == 2
        assert kms.keys[0].arn == key1["Arn"]
        assert kms.keys[1].arn == key2["Arn"]

    # Test KMS Describe Keys
    @mock_aws
    def test_describe_key(self):
        # Generate KMS Client
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        # Create KMS keys
        key1 = kms_client.create_key(
            MultiRegion=False,
            Tags=[
                {"TagKey": "test", "TagValue": "test"},
            ],
        )["KeyMetadata"]
        # KMS client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kms = KMS(aws_provider)
        assert len(kms.keys) == 1
        assert kms.keys[0].arn == key1["Arn"]
        assert kms.keys[0].state == key1["KeyState"]
        assert kms.keys[0].origin == key1["Origin"]
        assert kms.keys[0].manager == key1["KeyManager"]
        assert kms.keys[0].multi_region == key1["MultiRegion"]
        assert kms.keys[0].tags == [
            {"TagKey": "test", "TagValue": "test"},
        ]

    # Test KMS Get rotation status
    @mock_aws
    def test_get_key_rotation_status(self):
        # Generate KMS Client
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        # Create KMS keys
        key1 = kms_client.create_key(MultiRegion=False)["KeyMetadata"]
        key2 = kms_client.create_key(MultiRegion=False)["KeyMetadata"]
        kms_client.enable_key_rotation(KeyId=key2["KeyId"])
        # KMS client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kms = KMS(aws_provider)
        assert len(kms.keys) == 2
        assert kms.keys[0].arn == key1["Arn"]
        assert kms.keys[0].rotation_enabled is False
        assert kms.keys[1].arn == key2["Arn"]
        assert kms.keys[1].rotation_enabled is True

    # Test KMS Key policy
    @mock_aws
    def test_get_key_policy(self):
        public_policy = json.dumps(
            {
                "Version": "2012-10-17",
                "Id": "key-default-1",
                "Statement": [
                    {
                        "Sid": "Enable IAM User Permissions",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "kms:*",
                        "Resource": "*",
                    }
                ],
            }
        )
        default_policy = json.dumps(
            {
                "Version": "2012-10-17",
                "Id": "key-default-1",
                "Statement": [
                    {
                        "Sid": "Enable IAM User Permissions",
                        "Effect": "Allow",
                        "Principal": {"AWS": "arn:aws:iam::123456789012:root"},
                        "Action": "kms:*",
                        "Resource": "*",
                    }
                ],
            }
        )
        # Generate KMS Client
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        # Create KMS keys
        key1 = kms_client.create_key(MultiRegion=False, Policy=default_policy)[
            "KeyMetadata"
        ]
        key2 = kms_client.create_key(MultiRegion=False, Policy=public_policy)[
            "KeyMetadata"
        ]
        # KMS client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        kms = KMS(aws_provider)
        assert len(kms.keys) == 2
        assert kms.keys[0].arn == key1["Arn"]
        assert kms.keys[0].policy == json.loads(default_policy)
        assert kms.keys[1].arn == key2["Arn"]
        assert kms.keys[1].policy == json.loads(public_policy)
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_are_used_test.py]---
Location: prowler-master/tests/providers/aws/services/kms/kms_cmk_are_used/kms_cmk_are_used_test.py

```python
from typing import Any, List
from unittest import mock

import pytest
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_kms_cmk_are_used:
    @mock_aws
    def test_kms_no_keys(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used import (
                kms_cmk_are_used,
            )

            check = kms_cmk_are_used()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_kms_cmk_are_used(self):
        # Generate KMS Client
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        # Create enabled KMS key
        key = kms_client.create_key()["KeyMetadata"]

        from prowler.providers.aws.services.kms.kms_service import KMS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used import (
                kms_cmk_are_used,
            )

            check = kms_cmk_are_used()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == f"KMS CMK {key['KeyId']} is being used."
            assert result[0].resource_id == key["KeyId"]
            assert result[0].resource_arn == key["Arn"]

    @pytest.mark.parametrize(
        "no_of_keys_created,expected_no_of_results",
        [
            (5, 3),
            (7, 5),
            (10, 8),
        ],
    )
    @mock_aws
    def test_kms_cmk_are_used_when_describe_key_fails_on_2_keys_out_of_x_keys(
        self, no_of_keys_created: int, expected_no_of_results: int
    ) -> None:
        # Generate KMS Client
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        kms_client.__dict__["region"] = AWS_REGION_US_EAST_1
        # Create enabled KMS key
        for i in range(no_of_keys_created):
            kms_client.create_key(
                Tags=[
                    {"TagKey": "test", "TagValue": f"test{i}"},
                ],
            )

        orig_describe_key = kms_client.describe_key

        def mock_describe_key(KeyId: str, count: List[int] = [0]) -> Any:
            if count[0] in [2, 4]:
                count[0] += 1
                raise Exception("FakeClientError")
            else:
                count[0] += 1
                return orig_describe_key(KeyId=KeyId)

        kms_client.describe_key = mock_describe_key

        from prowler.providers.aws.services.kms.kms_service import KMS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
                return_value={AWS_REGION_US_EAST_1: kms_client},
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used import (
                kms_cmk_are_used,
            )

            check = kms_cmk_are_used()
            result = check.execute()

            assert len(result) == expected_no_of_results

    @mock_aws
    def test_kms_key_with_deletion(self):
        # Generate KMS Client
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        # Creaty KMS key with deletion
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.schedule_key_deletion(KeyId=key["KeyId"])

        from prowler.providers.aws.services.kms.kms_service import KMS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used import (
                kms_cmk_are_used,
            )

            check = kms_cmk_are_used()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"KMS CMK {key['KeyId']} is not being used but it has scheduled deletion."
            )
            assert result[0].resource_id == key["KeyId"]
            assert result[0].resource_arn == key["Arn"]

    @mock_aws
    def test_kms_disabled_key(self):
        # Generate KMS Client
        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        # Creaty KMS key with deletion
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.disable_key(KeyId=key["KeyId"])

        from prowler.providers.aws.services.kms.kms_service import KMS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.kms.kms_cmk_are_used.kms_cmk_are_used import (
                kms_cmk_are_used,
            )

            check = kms_cmk_are_used()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"KMS CMK {key['KeyId']} is not being used."
            )
            assert result[0].resource_id == key["KeyId"]
            assert result[0].resource_arn == key["Arn"]
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_not_deleted_unintentionally_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/kms/kms_cmk_not_deleted_unintentionally/kms_cmk_not_deleted_unintentionally_fixer_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_kms_cmk_not_deleted_unintentionally_fixer:
    @mock_aws
    def test_kms_cmk_deleted_unintentionally(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.schedule_key_deletion(KeyId=key["KeyId"])

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally_fixer.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally_fixer import (
                fixer,
            )

            assert fixer(key["KeyId"], AWS_REGION_US_EAST_1)

    @mock_aws
    def test_kms_cmk_enabled(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.enable_key(KeyId=key["KeyId"])

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally_fixer.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally_fixer import (
                fixer,
            )

            assert fixer(key["KeyId"], AWS_REGION_US_EAST_1)

    @mock_aws
    def test_kms_cmk_deleted_unintentionally_error(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.schedule_key_deletion(KeyId=key["KeyId"])

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally_fixer.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally_fixer import (
                fixer,
            )

            assert not fixer("KeyIdNonExisting", AWS_REGION_US_EAST_1)
```

--------------------------------------------------------------------------------

---[FILE: kms_cmk_not_deleted_unintentionally_test.py]---
Location: prowler-master/tests/providers/aws/services/kms/kms_cmk_not_deleted_unintentionally/kms_cmk_not_deleted_unintentionally_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_kms_cmk_not_deleted_unintentionally:
    @mock_aws
    def test_kms_no_keys(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally import (
                kms_cmk_not_deleted_unintentionally,
            )

            check = kms_cmk_not_deleted_unintentionally()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_kms_cmk_disabled_key(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.disable_key(KeyId=key["KeyId"])

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], scan_unused_services=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally import (
                kms_cmk_not_deleted_unintentionally,
            )

            check = kms_cmk_not_deleted_unintentionally()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_kms_cmk_deleted_unintentionally(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.schedule_key_deletion(KeyId=key["KeyId"])

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally import (
                kms_cmk_not_deleted_unintentionally,
            )

            check = kms_cmk_not_deleted_unintentionally()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"KMS CMK {key['KeyId']} is scheduled for deletion, revert it if it was unintentionally."
            )
            assert result[0].resource_id == key["KeyId"]
            assert result[0].resource_arn == key["Arn"]

    @mock_aws
    def test_kms_cmk_enabled(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.enable_key(KeyId=key["KeyId"])

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally import (
                kms_cmk_not_deleted_unintentionally,
            )

            check = kms_cmk_not_deleted_unintentionally()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"KMS CMK {key['KeyId']} is not scheduled for deletion."
            )
            assert result[0].resource_id == key["KeyId"]
            assert result[0].resource_arn == key["Arn"]

    @mock_aws
    def test_kms_cmk_disabled_with_flag_unused(self):
        from prowler.providers.aws.services.kms.kms_service import KMS

        kms_client = client("kms", region_name=AWS_REGION_US_EAST_1)
        key = kms_client.create_key()["KeyMetadata"]
        kms_client.disable_key(KeyId=key["KeyId"])

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], scan_unused_services=True
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally.kms_client",
                new=KMS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kms.kms_cmk_not_deleted_unintentionally.kms_cmk_not_deleted_unintentionally import (
                kms_cmk_not_deleted_unintentionally,
            )

            check = kms_cmk_not_deleted_unintentionally()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"KMS CMK {key['KeyId']} is not scheduled for deletion."
            )
            assert result[0].resource_id == key["KeyId"]
            assert result[0].resource_arn == key["Arn"]
```

--------------------------------------------------------------------------------

````
