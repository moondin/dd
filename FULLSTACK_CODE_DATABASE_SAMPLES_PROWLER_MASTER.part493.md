---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 493
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 493 of 867)

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

---[FILE: config_recorder_using_aws_service_role_test.py]---
Location: prowler-master/tests/providers/aws/services/config/config_recorder_using_aws_service_role/config_recorder_using_aws_service_role_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_config_recorder_using_aws_service_role:
    @mock_aws
    def test_config_no_recorders(self):
        from prowler.providers.aws.services.config.config_service import Config

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.config.config_recorder_using_aws_service_role.config_recorder_using_aws_service_role.config_client",
                new=Config(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.config.config_recorder_using_aws_service_role.config_recorder_using_aws_service_role import (
                config_recorder_using_aws_service_role,
            )

            check = config_recorder_using_aws_service_role()
            results = check.execute()

            assert len(results) == 0

    @mock_aws
    def test_config_one_recoder_disabled(self):
        # Create Config Mocked Resources
        config_client = client("config", region_name=AWS_REGION_US_EAST_1)
        # Create Config Recorder
        config_client.put_configuration_recorder(
            ConfigurationRecorder={"name": "default", "roleARN": "somearn"}
        )
        from prowler.providers.aws.services.config.config_service import Config

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.config.config_recorder_using_aws_service_role.config_recorder_using_aws_service_role.config_client",
                new=Config(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.config.config_recorder_using_aws_service_role.config_recorder_using_aws_service_role import (
                config_recorder_using_aws_service_role,
            )

            check = config_recorder_using_aws_service_role()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_config_recorder_using_aws_service_role(self):
        # Create Config Mocked Resources
        config_client = client("config", region_name=AWS_REGION_US_EAST_1)
        # Create Config Recorder
        config_client.put_configuration_recorder(
            ConfigurationRecorder={
                "name": "default",
                "roleARN": "arn:aws:iam::123456789012:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig",
            }
        )
        # Make the delivery channel
        config_client.put_delivery_channel(
            DeliveryChannel={"name": "testchannel", "s3BucketName": "somebucket"}
        )
        config_client.start_configuration_recorder(ConfigurationRecorderName="default")
        from prowler.providers.aws.services.config.config_service import Config

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.config.config_recorder_using_aws_service_role.config_recorder_using_aws_service_role.config_client",
                new=Config(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.config.config_recorder_using_aws_service_role.config_recorder_using_aws_service_role import (
                config_recorder_using_aws_service_role,
            )

            check = config_recorder_using_aws_service_role()
            result = check.execute()
            assert len(result) == 1
            # Search for the recorder just created
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "AWS Config recorder default is using AWSServiceRoleForConfig."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:config:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:recorder"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_config_recorder_not_using_aws_service_role(self):
        # Create Config Mocked Resources
        config_client = client("config", region_name=AWS_REGION_US_EAST_1)
        # Create Config Recorder
        config_client.put_configuration_recorder(
            ConfigurationRecorder={
                "name": "default",
                "roleARN": "arn:aws:iam::123456789012:role/MyCustomRole",
            }
        )
        # Make the delivery channel
        config_client.put_delivery_channel(
            DeliveryChannel={"name": "testchannel", "s3BucketName": "somebucket"}
        )
        config_client.start_configuration_recorder(ConfigurationRecorderName="default")
        from prowler.providers.aws.services.config.config_service import Config

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.config.config_recorder_using_aws_service_role.config_recorder_using_aws_service_role.config_client",
                new=Config(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.config.config_recorder_using_aws_service_role.config_recorder_using_aws_service_role import (
                config_recorder_using_aws_service_role,
            )

            check = config_recorder_using_aws_service_role()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "AWS Config recorder default is not using AWSServiceRoleForConfig."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:config:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:recorder"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: datasync_service_test.py]---
Location: prowler-master/tests/providers/aws/services/datasync/datasync_service_test.py

```python
from unittest.mock import MagicMock, patch

import botocore
from botocore.exceptions import ClientError

from prowler.providers.aws.services.datasync.datasync_service import DataSync
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    # Simulate ResourceNotFoundException for specific ARNs
    if operation_name in ["DescribeTask", "ListTagsForResource"]:
        if "not-found" in kwarg.get("TaskArn", "") or "not-found" in kwarg.get(
            "ResourceArn", ""
        ):
            raise ClientError(
                {
                    "Error": {
                        "Code": "ResourceNotFoundException",
                        "Message": "Resource not found",
                    }
                },
                operation_name,
            )
        # Simulate other ClientError
        if "client-error" in kwarg.get("TaskArn", "") or "client-error" in kwarg.get(
            "ResourceArn", ""
        ):
            raise ClientError(
                {
                    "Error": {
                        "Code": "InternalServerError",
                        "Message": "Internal server error",
                    }
                },
                operation_name,
            )
        # Simulate generic exception
        if "generic-error" in kwarg.get("TaskArn", "") or "generic-error" in kwarg.get(
            "ResourceArn", ""
        ):
            raise Exception("Generic error")

    if operation_name == "ListTasks":
        if kwarg.get("generic_error", False):
            raise Exception("Generic error in ListTasks")
        return {
            "Tasks": [
                {
                    "TaskArn": "arn:aws:datasync:eu-west-1:123456789012:task/task-12345678901234567",
                    "Name": "test_task",
                },
                {
                    "TaskArn": "arn:aws:datasync:eu-west-1:123456789012:task/not-found",
                    "Name": "not_found_task",
                },
                {
                    "TaskArn": "arn:aws:datasync:eu-west-1:123456789012:task/client-error",
                    "Name": "client_error_task",
                },
                {
                    "TaskArn": "arn:aws:datasync:eu-west-1:123456789012:task/generic-error",
                    "Name": "generic_error_task",
                },
            ]
        }
    if operation_name == "DescribeTask":
        return {
            "TaskArn": kwarg["TaskArn"],
            "Status": "AVAILABLE",
            "Name": "test_task",
            "CurrentTaskExecutionArn": "arn:aws:datasync:eu-west-1:123456789012:task/task-12345678901234567/execution/exec-12345678901234567",
            "Options": {},
            "SourceLocationArn": "arn:aws:datasync:eu-west-1:123456789012:location/loc-12345678901234567",
            "DestinationLocationArn": "arn:aws:datasync:eu-west-1:123456789012:location/loc-76543210987654321",
            "CloudWatchLogGroupArn": "arn:aws:logs:eu-west-1:123456789012:log-group:/aws/datasync/log-group",
            "Tags": [
                {"Key": "Name", "Value": "test_task"},
            ],
        }

    if operation_name == "ListTagsForResource":
        return {
            "Tags": [
                {"Key": "Name", "Value": "test_task"},
            ],
        }

    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_DataSync_Service:
    # Test DataSync Service initialization
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        datasync = DataSync(aws_provider)
        assert datasync.service == "datasync"

    # Test DataSync clients creation
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        datasync = DataSync(aws_provider)
        for reg_client in datasync.regional_clients.values():
            assert reg_client.__class__.__name__ == "DataSync"

    # Test DataSync session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        datasync = DataSync(aws_provider)
        assert datasync.session.__class__.__name__ == "Session"

    # Test listing DataSync tasks
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_list_tasks(self):
        aws_provider = set_mocked_aws_provider()
        datasync = DataSync(aws_provider)

        task_arn = "arn:aws:datasync:eu-west-1:123456789012:task/task-12345678901234567"
        found_task = None
        for task in datasync.tasks.values():
            if task.arn == task_arn:
                found_task = task
                break

        assert found_task
        assert found_task.name == "test_task"
        assert found_task.region == AWS_REGION_EU_WEST_1

    # Test generic exception in list_tasks
    def test_list_tasks_generic_exception(self):
        aws_provider = set_mocked_aws_provider()

        # Mock the regional client's list_tasks method specifically
        mock_client = MagicMock()
        mock_client.region = AWS_REGION_EU_WEST_1
        mock_client.get_paginator.side_effect = Exception("Generic error in ListTasks")

        datasync = DataSync(aws_provider)
        assert len(datasync.tasks.values()) == 0

    # Test describing DataSync tasks with various exceptions
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_describe_tasks_with_exceptions(self):
        aws_provider = set_mocked_aws_provider()
        datasync = DataSync(aws_provider)

        # Check all tasks were processed despite exceptions
        assert len(datasync.tasks.values()) == 4

        # Verify each task type
        tasks_by_name = {task.name: task for task in datasync.tasks.values()}

        # Normal task
        assert "test_task" in tasks_by_name
        assert tasks_by_name["test_task"].status == "AVAILABLE"

        # ResourceNotFoundException task
        assert "not_found_task" in tasks_by_name
        assert not tasks_by_name["not_found_task"].status

        # ClientError task
        assert "client_error_task" in tasks_by_name
        assert not tasks_by_name["client_error_task"].status

        # Generic error task
        assert "generic_error_task" in tasks_by_name
        assert not tasks_by_name["generic_error_task"].status

    # Test listing task tags with various exceptions
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_list_task_tags_with_exceptions(self):
        aws_provider = set_mocked_aws_provider()
        datasync = DataSync(aws_provider)

        tasks_by_name = {task.name: task for task in datasync.tasks.values()}
        assert tasks_by_name["test_task"].tags == [
            {"Key": "Name", "Value": "test_task"}
        ]

        # Tasks with exceptions should have empty tag lists
        assert tasks_by_name["not_found_task"].tags == []
        assert tasks_by_name["client_error_task"].tags == []
        assert tasks_by_name["generic_error_task"].tags == []
```

--------------------------------------------------------------------------------

---[FILE: datasync_task_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/datasync/datasync_task_logging_enabled/datasync_task_logging_enabled_test.py

```python
from unittest.mock import patch

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

TASK_ID = "task-12345"
TASK_ARN = f"arn:aws:datasync:{AWS_REGION_US_EAST_1}:123456789012:task/{TASK_ID}"


class Test_datasync_task_logging_enabled:
    def test_no_tasks(self):
        from prowler.providers.aws.services.datasync.datasync_service import DataSync

        # Set up a mocked AWS provider
        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        # Create a DataSync client with no tasks
        datasync_client = DataSync(mocked_aws_provider)
        datasync_client.tasks = {}

        with (
            patch(
                "prowler.providers.aws.services.datasync.datasync_task_logging_enabled.datasync_task_logging_enabled.datasync_client",
                new=datasync_client,
            ),
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
        ):
            from prowler.providers.aws.services.datasync.datasync_task_logging_enabled.datasync_task_logging_enabled import (
                datasync_task_logging_enabled,
            )

            check = datasync_task_logging_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_task_without_logging(self):
        from prowler.providers.aws.services.datasync.datasync_service import (
            DataSync,
            DataSyncTask,
        )

        # Set up a mocked AWS provider
        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        # Create a DataSync task without logging enabled
        task = DataSyncTask(
            id=TASK_ID,
            arn=TASK_ARN,
            name="TestTask",
            region=AWS_REGION_US_EAST_1,
            cloudwatch_log_group_arn=None,  # Logging not enabled
            tags=[],
        )

        # Create a DataSync client with the task
        datasync_client = DataSync(mocked_aws_provider)
        datasync_client.tasks[TASK_ARN] = task

        with (
            patch(
                "prowler.providers.aws.services.datasync.datasync_task_logging_enabled.datasync_task_logging_enabled.datasync_client",
                new=datasync_client,
            ),
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
        ):
            from prowler.providers.aws.services.datasync.datasync_task_logging_enabled.datasync_task_logging_enabled import (
                datasync_task_logging_enabled,
            )

            check = datasync_task_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"DataSync task {task.name} does not have logging enabled."
            )
            assert result[0].resource_id == TASK_ID
            assert result[0].resource_arn == TASK_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_task_with_logging(self):
        from prowler.providers.aws.services.datasync.datasync_service import (
            DataSync,
            DataSyncTask,
        )

        # Set up a mocked AWS provider
        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        # Create a DataSync task with logging enabled
        task = DataSyncTask(
            id=TASK_ID,
            arn=TASK_ARN,
            name="TestTask",
            region=AWS_REGION_US_EAST_1,
            cloudwatch_log_group_arn=f"arn:aws:logs:{AWS_REGION_US_EAST_1}:123456789012:log-group:datasync-log-group",
            tags=[],
        )

        # Create a DataSync client with the task
        datasync_client = DataSync(mocked_aws_provider)
        datasync_client.tasks[TASK_ARN] = task

        with (
            patch(
                "prowler.providers.aws.services.datasync.datasync_task_logging_enabled.datasync_task_logging_enabled.datasync_client",
                new=datasync_client,
            ),
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
        ):
            from prowler.providers.aws.services.datasync.datasync_task_logging_enabled.datasync_task_logging_enabled import (
                datasync_task_logging_enabled,
            )

            check = datasync_task_logging_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"DataSync task {task.name} has logging enabled."
            )
            assert result[0].resource_id == TASK_ID
            assert result[0].resource_arn == TASK_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: directconnect_service_test.py]---
Location: prowler-master/tests/providers/aws/services/directconnect/directconnect_service_test.py

```python
import botocore
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.directconnect.directconnect_service import (
    DirectConnect,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking DX Calls - Moto does not allow describe connection across all DXs
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "DescribeConnections":
        return {
            "connections": [
                {
                    "ownerAccount": AWS_ACCOUNT_NUMBER,
                    "connectionId": "dx-moto-test-conn-20241022005109",
                    "connectionName": "test-conn",
                    "connectionState": "available",
                    "region": AWS_REGION_US_EAST_1,
                    "location": "Ashburn",
                    "bandwidth": "5000",
                    "vlan": 123,
                    "tags": [
                        {"key": "string", "value": "string"},
                    ],
                },
            ]
        }

    if operation_name == "DescribeVirtualInterfaces":
        return {
            "virtualInterfaces": [
                {
                    "ownerAccount": AWS_ACCOUNT_NUMBER,
                    "virtualInterfaceId": "vif-moto-test-conn",
                    "location": "Ashburn",
                    "connectionId": "dx-moto-test-conn-20241022005109",
                    "virtualInterfaceType": "public",
                    "virtualInterfaceName": "test-viff",
                    "vlan": 123,
                    "asn": 123,
                    "amazonSideAsn": 123,
                    "addressFamily": "ipv4",
                    "virtualInterfaceState": "available",
                    "customerRouterConfig": "test",
                    "mtu": 123,
                    "jumboFrameCapable": True,
                    "virtualGatewayId": "vgw-moto-test-conn",
                    "directConnectGatewayId": "dxgw-moto-test-conn",
                    "region": AWS_REGION_US_EAST_1,
                    "tags": [
                        {"key": "string", "value": "string"},
                    ],
                    "siteLinkEnabled": True,
                },
                {
                    "ownerAccount": AWS_ACCOUNT_NUMBER,
                    "virtualInterfaceId": "vif-moto-test-conn-2",
                    "location": "Ashburn",
                    "connectionId": "dx-moto-test-conn-202410220051092",
                    "virtualInterfaceType": "public",
                    "virtualInterfaceName": "test-viff-2",
                    "vlan": 123,
                    "asn": 123,
                    "amazonSideAsn": 123,
                    "addressFamily": "ipv4",
                    "virtualInterfaceState": "available",
                    "customerRouterConfig": "test",
                    "mtu": 123,
                    "jumboFrameCapable": True,
                    "virtualGatewayId": "vgw-moto-test-conn",
                    "directConnectGatewayId": "dxgw-moto-test-conn",
                    "region": AWS_REGION_US_EAST_1,
                    "tags": [
                        {"key": "string", "value": "string"},
                    ],
                    "siteLinkEnabled": True,
                },
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
class Test_DirectConnect_Service:
    # Test DirectConnect Service
    @mock_aws
    def test_service(self):
        aws_provider = set_mocked_aws_provider(AWS_REGION_US_EAST_1)
        directconnect = DirectConnect(aws_provider)
        assert directconnect.service == "directconnect"

    # Test DirectConnect client
    @mock_aws
    def test_client(self):
        aws_provider = set_mocked_aws_provider(AWS_REGION_US_EAST_1)
        directconnect = DirectConnect(aws_provider)
        for regional_client in directconnect.regional_clients.values():
            assert regional_client.__class__.__name__ == "DirectConnect"

    # Test DirectConnect session
    @mock_aws
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider(AWS_REGION_US_EAST_1)
        directconnect = DirectConnect(aws_provider)
        assert directconnect.session.__class__.__name__ == "Session"

    # Test DirectConnect Session
    @mock_aws
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider(AWS_REGION_US_EAST_1)
        directconnect = DirectConnect(aws_provider)
        assert directconnect.audited_account == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_describe_connect(self):
        arn = f"arn:aws:directconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:dxcon/dx-moto-test-conn-20241022005109"

        aws_provider = set_mocked_aws_provider(AWS_REGION_US_EAST_1)
        directconnect = DirectConnect(aws_provider)
        assert len(directconnect.connections) == 1
        assert directconnect.connections[arn].region == AWS_REGION_US_EAST_1
        assert directconnect.connections[arn].location == "Ashburn"
        assert directconnect.connections[arn].name == "test-conn"
        assert directconnect.connections[arn].id == "dx-moto-test-conn-20241022005109"

    @mock_aws
    def test_describe_vif(self):
        aws_provider = set_mocked_aws_provider(AWS_REGION_US_EAST_1)
        directconnect = DirectConnect(aws_provider)
        vif_arn = f"arn:aws:directconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:dxvif/vif-moto-test-conn"
        assert len(directconnect.vifs) == 2
        assert directconnect.vifs[vif_arn].arn == vif_arn
        assert directconnect.vifs[vif_arn].region == AWS_REGION_US_EAST_1
        assert directconnect.vifs[vif_arn].location == "Ashburn"
        assert (
            directconnect.vifs[vif_arn].connection_id
            == "dx-moto-test-conn-20241022005109"
        )
        assert directconnect.vifs[vif_arn].vgw_gateway_id == "vgw-moto-test-conn"
        assert directconnect.vifs[vif_arn].dx_gateway_id == "dxgw-moto-test-conn"
        assert directconnect.vifs[vif_arn].name == "test-viff"

    @mock_aws
    def test_describe_vgws(self):
        aws_provider = set_mocked_aws_provider(AWS_REGION_US_EAST_1)
        directconnect = DirectConnect(aws_provider)
        vgw_arn = f"arn:aws:directconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:virtual-gateway/vgw-moto-test-conn"
        dxgw_arn = f"arn:aws:directconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:dx-gateway/dxgw-moto-test-conn"
        assert len(directconnect.vifs) == 2
        assert len(directconnect.vgws) == 1
        assert len(directconnect.dxgws) == 1
        assert directconnect.vgws[vgw_arn].region == AWS_REGION_US_EAST_1
        assert directconnect.vgws[vgw_arn].id == "vgw-moto-test-conn"
        assert directconnect.vgws[vgw_arn].connections == [
            "dx-moto-test-conn-20241022005109",
            "dx-moto-test-conn-202410220051092",
        ]
        assert directconnect.vgws[vgw_arn].vifs == [
            "vif-moto-test-conn",
            "vif-moto-test-conn-2",
        ]
        assert directconnect.dxgws[dxgw_arn].region == AWS_REGION_US_EAST_1
        assert directconnect.dxgws[dxgw_arn].id == "dxgw-moto-test-conn"
        assert directconnect.dxgws[dxgw_arn].connections == [
            "dx-moto-test-conn-20241022005109",
            "dx-moto-test-conn-202410220051092",
        ]
        assert directconnect.dxgws[dxgw_arn].vifs == [
            "vif-moto-test-conn",
            "vif-moto-test-conn-2",
        ]
```

--------------------------------------------------------------------------------

---[FILE: directconnect_connection_redundancy_test.py]---
Location: prowler-master/tests/providers/aws/services/directconnect/directconnect_connection_redundancy/directconnect_connection_redundancy_test.py

```python
from unittest import mock

from prowler.providers.aws.services.directconnect.directconnect_service import (
    Connection,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class Test_directconnect_connection_redundancy:
    def test_no_conn(self):
        dx_client = mock.MagicMock
        dx_client.connections = {}
        with mock.patch(
            "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
            new=dx_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_connection_redundancy.directconnect_connection_redundancy import (
                directconnect_connection_redundancy,
            )

            check = directconnect_connection_redundancy()
            result = check.execute()

            assert len(result) == 0

    def test_single_connection(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.audited_account_arn = (
            f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}"
        )
        dx_client._get_connection_arn_template = (
            lambda x: f"arn:aws:directconnect:{x}:{AWS_ACCOUNT_NUMBER}:connection"
        )
        dx_client.region = AWS_REGION_EU_WEST_1
        dx_client.connections = {}
        dx_client.connections = {
            "conn-test": Connection(
                id="conn-test",
                name="vif-id",
                location="Ashburn",
                region="eu-west-1",
            )
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
                new=dx_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect._get_connection_arn_template",
                return_value=f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:connection",
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_connection_redundancy.directconnect_connection_redundancy import (
                directconnect_connection_redundancy,
            )

            check = directconnect_connection_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "There is only one Direct Connect connection."
            )
            assert result[0].resource_id == "unknown"
            assert (
                result[0].resource_arn
                == f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:connection"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_multiple_connections_single_location(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.audited_account_arn = (
            f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}"
        )
        dx_client._get_connection_arn_template = (
            lambda x: f"arn:aws:directconnect:{x}:{AWS_ACCOUNT_NUMBER}:connection"
        )
        dx_client.region = AWS_REGION_EU_WEST_1
        dx_client.connections = {}
        dx_client.connections = {
            "conn-test": Connection(
                id="conn-test",
                name="vif-id",
                location="Ashburn",
                region="eu-west-1",
            ),
            "conn-2": Connection(
                id="conn-2",
                name="vif-ids",
                location="Ashburn",
                region="eu-west-1",
            ),
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
                new=dx_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect._get_connection_arn_template",
                return_value=f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:connection",
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_connection_redundancy.directconnect_connection_redundancy import (
                directconnect_connection_redundancy,
            )

            check = directconnect_connection_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "There is only one location Ashburn used by all the Direct Connect connections."
            )
            assert result[0].resource_id == "unknown"
            assert (
                result[0].resource_arn
                == f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:connection"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_multiple_connections_multiple_locations(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.audited_account_arn = (
            f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}"
        )
        dx_client._get_connection_arn_template = (
            lambda x: f"arn:aws:directconnect:{x}:{AWS_ACCOUNT_NUMBER}:connection"
        )
        dx_client.region = AWS_REGION_EU_WEST_1
        dx_client.connections = {}
        dx_client.connections = {
            "conn-test": Connection(
                id="conn-test",
                name="vif-id",
                location="Ashburn",
                region="eu-west-1",
            ),
            "conn-2": Connection(
                id="conn-2",
                name="vif-ids",
                location="Loudon",
                region="eu-west-1",
            ),
        }
        with (
            mock.patch(
                "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
                new=dx_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect._get_connection_arn_template",
                return_value=f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:connection",
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_connection_redundancy.directconnect_connection_redundancy import (
                directconnect_connection_redundancy,
            )

            check = directconnect_connection_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "There are 2 Direct Connect connections across 2 locations."
            )
            assert result[0].resource_id == "unknown"
            assert (
                result[0].resource_arn
                == f"arn:aws:directconnect:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:connection"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
