---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 496
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 496 of 867)

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

---[FILE: dms_service_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_service_test.py

```python
import botocore
from mock import patch

from prowler.providers.aws.services.dms.dms_service import DMS
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

DMS_INSTANCE_NAME = "rep-instance"
DMS_INSTANCE_ARN = (
    f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:rep:{DMS_INSTANCE_NAME}"
)
KMS_KEY_ID = f"arn:aws:kms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:key/abcdabcd-1234-abcd-1234-abcdabcdabcd"

DMS_ENDPOINT_NAME = "dms-endpoint"
DMS_ENDPOINT_ARN = f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint:{DMS_ENDPOINT_NAME}"

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    if operation_name == "DescribeReplicationInstances":
        return {
            "ReplicationInstances": [
                {
                    "ReplicationInstanceIdentifier": DMS_INSTANCE_NAME,
                    "ReplicationInstanceStatus": "available",
                    "AutoMinorVersionUpgrade": True,
                    "PubliclyAccessible": True,
                    "ReplicationInstanceArn": DMS_INSTANCE_ARN,
                    "MultiAZ": True,
                    "VpcSecurityGroups": [],
                    "KmsKeyId": KMS_KEY_ID,
                },
            ]
        }
    elif operation_name == "DescribeEndpoints":
        return {
            "Endpoints": [
                {
                    "EndpointIdentifier": DMS_ENDPOINT_NAME,
                    "EndpointArn": DMS_ENDPOINT_ARN,
                    "SslMode": "require",
                    "RedisSettings": {
                        "SslSecurityProtocol": "ssl-encryption",
                    },
                    "MongoDbSettings": {
                        "AuthType": "password",
                    },
                    "NeptuneSettings": {
                        "IamAuthEnabled": True,
                    },
                    "EngineName": "neptune",
                }
            ]
        }
    elif operation_name == "DescribeReplicationTasks":
        return {
            "ReplicationTasks": [
                {
                    "ReplicationTaskIdentifier": "rep-task",
                    "ReplicationTaskArn": f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task:rep-task",
                    "Status": "ready",
                    "MigrationType": "full-load",
                    "SourceEndpointArn": DMS_ENDPOINT_ARN,
                    "TargetEndpointArn": DMS_ENDPOINT_ARN,
                    "ReplicationInstanceArn": DMS_INSTANCE_ARN,
                    "ReplicationTaskSettings": '{"Logging":{"EnableLogging":true,"LogComponents":[{"Id":"SOURCE_CAPTURE","Severity":"LOGGER_SEVERITY_DEFAULT"},{"Id":"SOURCE_UNLOAD","Severity":"LOGGER_SEVERITY_DEFAULT"}]}}',
                }
            ]
        }
    elif operation_name == "ListTagsForResource":
        if kwargs["ResourceArn"] == DMS_INSTANCE_ARN:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "rep-instance"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }
        elif kwargs["ResourceArn"] == DMS_ENDPOINT_ARN:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "dms-endpoint"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }
        elif "task:rep-task" in kwargs["ResourceArn"]:
            return {
                "TagList": [
                    {"Key": "Name", "Value": "rep-task"},
                    {"Key": "Owner", "Value": "admin"},
                ]
            }

    return make_api_call(self, operation_name, kwargs)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_DMS_Service:
    # Test DMS Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        DMS(aws_provider)

    # Test DMS Client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        dms = DMS(aws_provider)
        assert dms.client.__class__.__name__ == "DatabaseMigrationService"

    # Test DMS Account
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider()
        dms = DMS(aws_provider)
        assert dms.audited_account == AWS_ACCOUNT_NUMBER

    # Test DMS Replication Instances
    def test_describe_rep_instances(self):
        aws_provider = set_mocked_aws_provider()
        dms = DMS(aws_provider)

        assert len(dms.instances) == 1
        assert dms.instances[0].id == DMS_INSTANCE_NAME
        assert dms.instances[0].region == AWS_REGION_US_EAST_1
        assert dms.instances[0].status == "available"
        assert dms.instances[0].public
        assert dms.instances[0].kms_key == KMS_KEY_ID
        assert dms.instances[0].auto_minor_version_upgrade
        assert dms.instances[0].multi_az
        assert dms.instances[0].security_groups == []

    # Test DMS Endpoints
    def test_describe_endpoints(self):
        aws_provider = set_mocked_aws_provider()
        dms = DMS(aws_provider)

        assert len(dms.endpoints) == 1
        assert dms.endpoints[DMS_ENDPOINT_ARN].id == DMS_ENDPOINT_NAME
        assert dms.endpoints[DMS_ENDPOINT_ARN].ssl_mode == "require"
        assert dms.endpoints[DMS_ENDPOINT_ARN].redis_ssl_protocol == "ssl-encryption"
        assert dms.endpoints[DMS_ENDPOINT_ARN].mongodb_auth_type == "password"
        assert dms.endpoints[DMS_ENDPOINT_ARN].neptune_iam_auth_enabled
        assert dms.endpoints[DMS_ENDPOINT_ARN].engine_name == "neptune"

    def test_list_tags(self):
        aws_provider = set_mocked_aws_provider()
        dms = DMS(aws_provider)

        assert dms.instances[0].tags == [
            {"Key": "Name", "Value": "rep-instance"},
            {"Key": "Owner", "Value": "admin"},
        ]
        assert dms.endpoints[DMS_ENDPOINT_ARN].tags == [
            {"Key": "Name", "Value": "dms-endpoint"},
            {"Key": "Owner", "Value": "admin"},
        ]

    def test_describe_replication_tags(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        dms = DMS(aws_provider)

        dms_replication_task_arn = (
            f"arn:aws:dms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task:rep-task"
        )

        assert dms.replication_tasks[dms_replication_task_arn].id == "rep-task"
        assert (
            dms.replication_tasks[dms_replication_task_arn].region
            == AWS_REGION_US_EAST_1
        )
        assert dms.replication_tasks[dms_replication_task_arn].logging_enabled
        assert dms.replication_tasks[dms_replication_task_arn].log_components == [
            {"Id": "SOURCE_CAPTURE", "Severity": "LOGGER_SEVERITY_DEFAULT"},
            {"Id": "SOURCE_UNLOAD", "Severity": "LOGGER_SEVERITY_DEFAULT"},
        ]
        assert (
            dms.replication_tasks[dms_replication_task_arn].source_endpoint_arn
            == DMS_ENDPOINT_ARN
        )
        assert (
            dms.replication_tasks[dms_replication_task_arn].target_endpoint_arn
            == DMS_ENDPOINT_ARN
        )
        assert dms.replication_tasks[dms_replication_task_arn].tags == [
            {"Key": "Name", "Value": "rep-task"},
            {"Key": "Owner", "Value": "admin"},
        ]
```

--------------------------------------------------------------------------------

---[FILE: dms_endpoint_mongodb_authentication_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_endpoint_mongodb_authentication_enabled/dms_endpoint_mongodb_authentication_enabled_test.py

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


def mock_make_api_call_enabled_not_mongodb(self, operation_name, kwarg):
    if operation_name == "DescribeEndpoints":
        return {
            "Endpoints": [
                {
                    "EndpointIdentifier": DMS_ENDPOINT_NAME,
                    "EndpointArn": DMS_ENDPOINT_ARN,
                    "SslMode": "require",
                    "MongoDbSettings": {
                        "AuthType": "password",
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
                    "MongoDbSettings": {
                        "AuthType": "password",
                    },
                    "EngineName": "mongodb",
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
                    "MongoDbSettings": {
                        "AuthType": "no",
                    },
                    "EngineName": "mongodb",
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


class Test_dms_endpoint_mongodb_authentication_enabled:
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
                "prowler.providers.aws.services.dms.dms_endpoint_mongodb_authentication_enabled.dms_endpoint_mongodb_authentication_enabled.dms_client",
                new=DMS(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_endpoint_mongodb_authentication_enabled.dms_endpoint_mongodb_authentication_enabled import (
                dms_endpoint_mongodb_authentication_enabled,
            )

            check = dms_endpoint_mongodb_authentication_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dms_not_mongodb_auth_mecanism_enabled(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_enabled_not_mongodb,
        ):

            from prowler.providers.aws.services.dms.dms_service import DMS

            aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_endpoint_mongodb_authentication_enabled.dms_endpoint_mongodb_authentication_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_mongodb_authentication_enabled.dms_endpoint_mongodb_authentication_enabled import (
                    dms_endpoint_mongodb_authentication_enabled,
                )

                check = dms_endpoint_mongodb_authentication_enabled()
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
                    "prowler.providers.aws.services.dms.dms_endpoint_mongodb_authentication_enabled.dms_endpoint_mongodb_authentication_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_mongodb_authentication_enabled.dms_endpoint_mongodb_authentication_enabled import (
                    dms_endpoint_mongodb_authentication_enabled,
                )

                check = dms_endpoint_mongodb_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    "DMS Endpoint 'dms-endpoint' for MongoDB does not have an authentication mechanism enabled."
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
                    "prowler.providers.aws.services.dms.dms_endpoint_mongodb_authentication_enabled.dms_endpoint_mongodb_authentication_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_mongodb_authentication_enabled.dms_endpoint_mongodb_authentication_enabled import (
                    dms_endpoint_mongodb_authentication_enabled,
                )

                check = dms_endpoint_mongodb_authentication_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == (
                    "DMS Endpoint 'dms-endpoint' for MongoDB has password as the authentication mechanism."
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

---[FILE: dms_endpoint_neptune_iam_authorization_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dms/dms_endpoint_neptune_iam_authorization_enabled/dms_endpoint_neptune_iam_authorization_enabled_test.py

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


def mock_make_api_call_enabled_not_neptune(self, operation_name, kwarg):
    if operation_name == "DescribeEndpoints":
        return {
            "Endpoints": [
                {
                    "EndpointIdentifier": DMS_ENDPOINT_NAME,
                    "EndpointArn": DMS_ENDPOINT_ARN,
                    "SslMode": "require",
                    "NeptuneSettings": {
                        "IamAuthEnabled": True,
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
                    "NeptuneSettings": {
                        "IamAuthEnabled": True,
                    },
                    "EngineName": "neptune",
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
                    "NeptuneSettings": {
                        "IamAuthEnabled": False,
                    },
                    "EngineName": "neptune",
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


class Test_dms_endpoint_neptune_iam_authorization_enabled:
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
                "prowler.providers.aws.services.dms.dms_endpoint_neptune_iam_authorization_enabled.dms_endpoint_neptune_iam_authorization_enabled.dms_client",
                new=DMS(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dms.dms_endpoint_neptune_iam_authorization_enabled.dms_endpoint_neptune_iam_authorization_enabled import (
                dms_endpoint_neptune_iam_authorization_enabled,
            )

            check = dms_endpoint_neptune_iam_authorization_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dms_not_neptune_iam_auth_enabled(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_enabled_not_neptune,
        ):

            from prowler.providers.aws.services.dms.dms_service import DMS

            aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.dms.dms_endpoint_neptune_iam_authorization_enabled.dms_endpoint_neptune_iam_authorization_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_neptune_iam_authorization_enabled.dms_endpoint_neptune_iam_authorization_enabled import (
                    dms_endpoint_neptune_iam_authorization_enabled,
                )

                check = dms_endpoint_neptune_iam_authorization_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_dms_neptune_iam_auth_not_enabled(self):
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
                    "prowler.providers.aws.services.dms.dms_endpoint_neptune_iam_authorization_enabled.dms_endpoint_neptune_iam_authorization_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_neptune_iam_authorization_enabled.dms_endpoint_neptune_iam_authorization_enabled import (
                    dms_endpoint_neptune_iam_authorization_enabled,
                )

                check = dms_endpoint_neptune_iam_authorization_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].status_extended == (
                    "DMS Endpoint dms-endpoint for Neptune databases does not have IAM authorization enabled."
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
    def test_dms_neptune_iam_auth_enabled(self):
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
                    "prowler.providers.aws.services.dms.dms_endpoint_neptune_iam_authorization_enabled.dms_endpoint_neptune_iam_authorization_enabled.dms_client",
                    new=DMS(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.dms.dms_endpoint_neptune_iam_authorization_enabled.dms_endpoint_neptune_iam_authorization_enabled import (
                    dms_endpoint_neptune_iam_authorization_enabled,
                )

                check = dms_endpoint_neptune_iam_authorization_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].status_extended == (
                    "DMS Endpoint dms-endpoint for Neptune databases has IAM authorization enabled."
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

````
