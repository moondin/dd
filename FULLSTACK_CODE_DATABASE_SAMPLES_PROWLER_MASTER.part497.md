---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 497
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 497 of 867)

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

---[FILE: dms_endpoint_redis_in_transit_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_endpoint_redis_in_transit_encryption_enabled/dms_endpoint_redis_in_transit_encryption_enabled_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call

DMS_ENDPOINT_NAME = "dms-endpoint"
DMS_ENDPOINT_ARN = f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:{DMS_ENDPOINT_NAME}"
DMS_INSTANCE_NAME = "rep-instance"
DMS_INSTANCE_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rep:{DMS_INSTANCE_NAME}"
)


def mock_make_api_call_enabled_not_redis(self, operation_name, kwarg):
    if operation_name == "DescribeEndpoints":
        return {
            "Endpoints": [
                {
                    "EndpointIdentifier": DMS_ENDPOINT_NAME,
                    "EndpointArn": DMS_ENDPOINT_ARN,
                    "SslMode": "require",
                    "RedisSettings": {
                        "SslSecurityProtocol": "ssl-encryption",
                    },
                    "EngineName": "oracle",
                }
            ]
        }
    elif operation_name == "ListTagsForResource":
        if kwarg["ResourceArn"] == DMS_INSTANCE_ARN:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "rep-instance"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }
        elif kwarg["ResourceArn"] == DMS_ENDPOINT_ARN:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "dms-endpoint"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_enabled(self, operation_name, kwarg):
    if operation_name == "DescribeEndpoints":
        return {
            "Endpoints": [
                {
                    "EndpointIdentifier": DMS_ENDPOINT_NAME,
                    "EndpointArn": DMS_ENDPOINT_ARN,
                    "SslMode": "require",
                    "RedisSettings": {
                        "SslSecurityProtocol": "ssl-encryption",
                    },
                    "EngineName": "redis",
                }
            ]
        }
    elif operation_name == "ListTagsForResource":
        if kwarg["ResourceArn"] == DMS_INSTANCE_ARN:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "rep-instance"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }
        elif kwarg["ResourceArn"] == DMS_ENDPOINT_ARN:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "dms-endpoint"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_not_enabled(self, operation_name, kwarg):
    if operation_name == "DescribeEndpoints":
        return {
            "Endpoints": [
                {
                    "EndpointIdentifier": DMS_ENDPOINT_NAME,
                    "EndpointArn": DMS_ENDPOINT_ARN,
                    "SslMode": "require",
                    "RedisSettings": {
                        "SslSecurityProtocol": "plaintext",
                    },
                    "EngineName": "redis",
                }
            ]
        }
    elif operation_name == "ListTagsForResource":
        if kwarg["ResourceArn"] == DMS_INSTANCE_ARN:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "rep-instance"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }
        elif kwarg["ResourceArn"] == DMS_ENDPOINT_ARN:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "dms-endpoint"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }
    return make_api_call(self, operation_name, kwarg)


class Test_dms_endpoint_redis_in_transit_encryption_enabled:
    @mock_aws
    def test_no_dms_endpoints(self):
        dms_client = client("dms", region_name=AWS_REGION_US_EAST_1)
        dms_client.endpoints = {}

        from prowler.providers.aws.services.dms.dms_service import DMS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_endpoint_redis_in_transit_encryption_enabled.dms_endpoint_redis_in_transit_encryption_enabled.dms_client",
                new=DMS(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_endpoint_redis_in_transit_encryption_enabled.dms_endpoint_redis_in_transit_encryption_enabled import (
                dms_endpoint_redis_in_transit_encryption_enabled,
            )

            check = dms_endpoint_redis_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dms_not_mongodb_auth_mecanism_enabled(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_enabled_not_redis,
        ):

            from prowler.providers.aws.services.dms.dms_service import DMS

            aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_endpoint_redis_in_transit_encryption_enabled.dms_endpoint_redis_in_transit_encryption_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_redis_in_transit_encryption_enabled.dms_endpoint_redis_in_transit_encryption_enabled import (
                    dms_endpoint_redis_in_transit_encryption_enabled,
                )

                check = dms_endpoint_redis_in_transit_encryption_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_dms_mongodb_auth_mecanism_not_enabled(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_not_enabled,
        ):

            from prowler.providers.aws.services.dms.dms_service import DMS

            aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_endpoint_redis_in_transit_encryption_enabled.dms_endpoint_redis_in_transit_encryption_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_redis_in_transit_encryption_enabled.dms_endpoint_redis_in_transit_encryption_enabled import (
                    dms_endpoint_redis_in_transit_encryption_enabled,
                )

                check = dms_endpoint_redis_in_transit_encryption_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    "DMS Endpoint dms-endpoint for Redis OSS is not encrypted in transit."
                )
                assert result[0].resource_id == "dms-endpoint"
                assert (
                    result[0].resource_arn
                    == "arn:aws:dms:us-east-1:123456789012:endpoint:dms-endpoint"
                )
                assert result[0].resource_tags == [
                    {
                        "Key": "Name",
                        "Value": "dms-endpoint",
                    },
                    {
                        "Key": "Owner",
                        "Value": "admin",
                    },
                ]
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_dms_mongodb_auth_mecanism_enabled(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_enabled,
        ):

            from prowler.providers.aws.services.dms.dms_service import DMS

            aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_endpoint_redis_in_transit_encryption_enabled.dms_endpoint_redis_in_transit_encryption_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_redis_in_transit_encryption_enabled.dms_endpoint_redis_in_transit_encryption_enabled import (
                    dms_endpoint_redis_in_transit_encryption_enabled,
                )

                check = dms_endpoint_redis_in_transit_encryption_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == (
                    "DMS Endpoint dms-endpoint for Redis OSS is encrypted in transit."
                )
                assert result[0].resource_id == "dms-endpoint"
                assert (
                    result[0].resource_arn
                    == "arn:aws:dms:us-east-1:123456789012:endpoint:dms-endpoint"
                )
                assert result[0].resource_tags == [
                    {
                        "Key": "Name",
                        "Value": "dms-endpoint",
                    },
                    {
                        "Key": "Owner",
                        "Value": "admin",
                    },
                ]
                assert result[0].region == "us-east-1"
```

--------------------------------------------------------------------------------

---[FILE: dms_endpoint_ssl_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_endpoint_ssl_enabled_test/dms_endpoint_ssl_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.dms.dms_service import Endpoint
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1


class Test_dms_endpoint_ssl_enabled:
    def test_dms_no_endpoints(self):
        dms_client = mock.MagicMock
        dms_client.endpoints = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_endpoint_ssl_enabled.dms_endpoint_ssl_enabled import (
                dms_endpoint_ssl_enabled,
            )

            check = dms_endpoint_ssl_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_dms_endpoint_ssl_none(self):
        dms_client = mock.MagicMock
        endpoint_arn = f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:test-endpoint-no-ssl"
        dms_client.endpoints = {
            endpoint_arn: Endpoint(
                arn=endpoint_arn,
                id="test-endpoint-no-ssl",
                mongodb_auth_type="no",
                engine_name="test-engine",
                redis_ssl_protocol="plaintext",
                region=AWS_REGION_US_EAST_1,
                ssl_mode="none",
                tags=[{"Key": "Name", "Value": "test-endpoint-no-ssl"}],
            )
        }
        dms_client.audited_account = AWS_ACCOUNT_NUMBER
        dms_client.audited_partition = "aws"
        dms_client.audited_region = AWS_REGION_US_EAST_1

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_endpoint_ssl_enabled.dms_endpoint_ssl_enabled import (
                dms_endpoint_ssl_enabled,
            )

            check = dms_endpoint_ssl_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == "test-endpoint-no-ssl"
            assert (
                result[0].resource_arn
                == f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:test-endpoint-no-ssl"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == "DMS Endpoint test-endpoint-no-ssl is not using SSL."
            )
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "test-endpoint-no-ssl"}
            ]

    def test_dms_endpoint_ssl_require(self):
        dms_client = mock.MagicMock
        endpoint_arn = f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:test-endpoint-ssl-require"
        dms_client.endpoints = {
            endpoint_arn: Endpoint(
                arn=endpoint_arn,
                id="test-endpoint-ssl-require",
                mongodb_auth_type="no",
                engine_name="test-engine",
                redis_ssl_protocol="plaintext",
                region=AWS_REGION_US_EAST_1,
                ssl_mode="require",
                tags=[{"Key": "Name", "Value": "test-endpoint-ssl-require"}],
            )
        }
        dms_client.audited_account = AWS_ACCOUNT_NUMBER
        dms_client.audited_partition = "aws"
        dms_client.audited_region = AWS_REGION_US_EAST_1

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_endpoint_ssl_enabled.dms_endpoint_ssl_enabled import (
                dms_endpoint_ssl_enabled,
            )

            check = dms_endpoint_ssl_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == "test-endpoint-ssl-require"
            assert result[0].resource_arn == endpoint_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == "DMS Endpoint test-endpoint-ssl-require is using SSL with mode: require."
            )
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "test-endpoint-ssl-require"}
            ]

    def test_dms_endpoint_ssl_verify_ca(self):
        dms_client = mock.MagicMock
        endpoint_arn = f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:test-endpoint-ssl-verify-ca"
        dms_client.endpoints = {
            endpoint_arn: Endpoint(
                arn=endpoint_arn,
                id="test-endpoint-ssl-verify-ca",
                engine_name="test-engine",
                mongodb_auth_type="no",
                redis_ssl_protocol="plaintext",
                region=AWS_REGION_US_EAST_1,
                ssl_mode="verify-ca",
                tags=[{"Key": "Name", "Value": "test-endpoint-ssl-verify-ca"}],
            )
        }
        dms_client.audited_account = AWS_ACCOUNT_NUMBER
        dms_client.audited_partition = "aws"
        dms_client.audited_region = AWS_REGION_US_EAST_1

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_endpoint_ssl_enabled.dms_endpoint_ssl_enabled import (
                dms_endpoint_ssl_enabled,
            )

            check = dms_endpoint_ssl_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == "test-endpoint-ssl-verify-ca"
            assert result[0].resource_arn == endpoint_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == "DMS Endpoint test-endpoint-ssl-verify-ca is using SSL with mode: verify-ca."
            )
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "test-endpoint-ssl-verify-ca"}
            ]

    def test_dms_endpoint_ssl_verify_full(self):
        dms_client = mock.MagicMock
        endpoint_arn = f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:test-endpoint-ssl-verify-full"
        dms_client.endpoints = {
            endpoint_arn: Endpoint(
                arn=endpoint_arn,
                id="test-endpoint-ssl-verify-full",
                mongodb_auth_type="no",
                engine_name="test-engine",
                redis_ssl_protocol="plaintext",
                region=AWS_REGION_US_EAST_1,
                ssl_mode="verify-full",
                tags=[{"Key": "Name", "Value": "test-endpoint-ssl-verify-full"}],
            )
        }
        dms_client.audited_account = AWS_ACCOUNT_NUMBER
        dms_client.audited_partition = "aws"
        dms_client.audited_region = AWS_REGION_US_EAST_1

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_endpoint_ssl_enabled.dms_endpoint_ssl_enabled import (
                dms_endpoint_ssl_enabled,
            )

            check = dms_endpoint_ssl_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == "test-endpoint-ssl-verify-full"
            assert result[0].resource_arn == endpoint_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == "DMS Endpoint test-endpoint-ssl-verify-full is using SSL with mode: verify-full."
            )
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "test-endpoint-ssl-verify-full"}
            ]
```

--------------------------------------------------------------------------------

---[FILE: dms_instance_minor_version_upgrade_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_instance_minor_version_upgrade_enabled/dms_instance_minor_version_upgrade_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.dms.dms_service import RepInstance
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1

DMS_INSTANCE_NAME = "rep-instance"
DMS_INSTANCE_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rep:{DMS_INSTANCE_NAME}"
)
KMS_KEY_ID = f"arn:aws:kms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:key/abcdabcd-1234-abcd-1234-abcdabcdabcd"


class Test_dms_instance_minor_version_upgrade_enabled:
    def test_dms_no_instances(self):
        dms_client = mock.MagicMock
        dms_client.instances = []

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_instance_minor_version_upgrade_enabled.dms_instance_minor_version_upgrade_enabled import (
                dms_instance_minor_version_upgrade_enabled,
            )

            check = dms_instance_minor_version_upgrade_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_dms_minor_version_upgrade_not_enabled(self):
        dms_client = mock.MagicMock
        dms_client.instances = []
        dms_client.instances.append(
            RepInstance(
                id=DMS_INSTANCE_NAME,
                arn=DMS_INSTANCE_ARN,
                status="available",
                public=True,
                kms_key=KMS_KEY_ID,
                auto_minor_version_upgrade=False,
                multi_az=True,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "Name", "Value": DMS_INSTANCE_NAME}],
            )
        )

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_instance_minor_version_upgrade_enabled.dms_instance_minor_version_upgrade_enabled import (
                dms_instance_minor_version_upgrade_enabled,
            )

            check = dms_instance_minor_version_upgrade_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DMS Replication Instance {DMS_INSTANCE_NAME} does not have auto minor version upgrade enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == DMS_INSTANCE_NAME
            assert result[0].resource_arn == DMS_INSTANCE_ARN
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": DMS_INSTANCE_NAME}
            ]

    def test_dms_instance_minor_version_upgrade_enabled(self):
        dms_client = mock.MagicMock
        dms_client.instances = []
        dms_client.instances.append(
            RepInstance(
                id=DMS_INSTANCE_NAME,
                arn=DMS_INSTANCE_ARN,
                status="available",
                public=True,
                kms_key=KMS_KEY_ID,
                auto_minor_version_upgrade=True,
                multi_az=True,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "Name", "Value": DMS_INSTANCE_NAME}],
            )
        )

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_instance_minor_version_upgrade_enabled.dms_instance_minor_version_upgrade_enabled import (
                dms_instance_minor_version_upgrade_enabled,
            )

            check = dms_instance_minor_version_upgrade_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DMS Replication Instance {DMS_INSTANCE_NAME} has auto minor version upgrade enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == DMS_INSTANCE_NAME
            assert result[0].resource_arn == DMS_INSTANCE_ARN
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": DMS_INSTANCE_NAME}
            ]
```

--------------------------------------------------------------------------------

---[FILE: dms_instance_multi_az_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_instance_multi_az/dms_instance_multi_az_test.py

```python
from unittest import mock

from prowler.providers.aws.services.dms.dms_service import RepInstance
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1

DMS_INSTANCE_NAME = "rep-instance"
DMS_INSTANCE_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rep:{DMS_INSTANCE_NAME}"
)
KMS_KEY_ID = f"arn:aws:kms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:key/abcdabcd-1234-abcd-1234-abcdabcdabcd"


class Test_dms_instance_multi_az:
    def test_dms_no_instances(self):
        dms_client = mock.MagicMock
        dms_client.instances = []

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_instance_multi_az_enabled.dms_instance_multi_az_enabled import (
                dms_instance_multi_az_enabled,
            )

            check = dms_instance_multi_az_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_dms_instance_multi_az_not_enabled(self):
        dms_client = mock.MagicMock
        dms_client.instances = []
        dms_client.instances.append(
            RepInstance(
                id=DMS_INSTANCE_NAME,
                arn=DMS_INSTANCE_ARN,
                status="available",
                public=True,
                kms_key=KMS_KEY_ID,
                auto_minor_version_upgrade=False,
                multi_az=False,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "Name", "Value": DMS_INSTANCE_NAME}],
            )
        )

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_instance_multi_az_enabled.dms_instance_multi_az_enabled import (
                dms_instance_multi_az_enabled,
            )

            check = dms_instance_multi_az_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DMS Replication Instance {DMS_INSTANCE_NAME} does not have multi az enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == DMS_INSTANCE_NAME
            assert result[0].resource_arn == DMS_INSTANCE_ARN
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": DMS_INSTANCE_NAME}
            ]

    def test_dms_instance_multi_az_enabled(self):
        dms_client = mock.MagicMock
        dms_client.instances = []
        dms_client.instances.append(
            RepInstance(
                id=DMS_INSTANCE_NAME,
                arn=DMS_INSTANCE_ARN,
                status="available",
                public=True,
                kms_key=KMS_KEY_ID,
                auto_minor_version_upgrade=True,
                multi_az=True,
                region=AWS_REGION_US_EAST_1,
                tags=[{"Key": "Name", "Value": DMS_INSTANCE_NAME}],
            )
        )

        with (
            mock.patch(
                "prowler.providers.aws.services.dms.dms_service.DMS",
                new=dms_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.dms.dms_client.dms_client",
                new=dms_client,
            ),
        ):
            from prowler.providers.aws.services.dms.dms_instance_multi_az_enabled.dms_instance_multi_az_enabled import (
                dms_instance_multi_az_enabled,
            )

            check = dms_instance_multi_az_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DMS Replication Instance {DMS_INSTANCE_NAME} has multi az enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == DMS_INSTANCE_NAME
            assert result[0].resource_arn == DMS_INSTANCE_ARN
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": DMS_INSTANCE_NAME}
            ]
```

--------------------------------------------------------------------------------

````
