---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 545
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 545 of 867)

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

---[FILE: ecs_task_sets_no_assign_public_ip_test.py]---
Location: prowler-master/tests/providers/aws/services/ecs/ecs_task_sets_no_assign_public_ip/ecs_task_sets_no_assign_public_ip_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeServices":
        if kwarg["services"] == [
            f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-task-set-no-public-ip"
        ]:
            return {
                "services": [
                    {
                        "serviceName": "test-latest-linux-service",
                        "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/sample-cluster",
                        "taskDefinition": "test-task",
                        "loadBalancers": [],
                        "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-task-set-no-public-ip",
                        "desiredCount": 1,
                        "launchType": "FARGATE",
                        "platformVersion": "1.4.0",
                        "platformFamily": "Linux",
                        "networkConfiguration": {
                            "awsvpcConfiguration": {
                                "subnets": ["subnet-12345678"],
                                "securityGroups": ["sg-12345678"],
                                "assignPublicIp": "DISABLED",
                            },
                        },
                        "taskSets": [
                            {
                                "id": "ecs-svc/task-set-no-public-ip",
                                "taskSetArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task-set/sample-cluster/service-task-set-no-public-ip/ecs-svc/task-set-no-public-ip",
                                "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/sample-cluster",
                                "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-task-set-no-public-ip",
                                "networkConfiguration": {
                                    "awsvpcConfiguration": {
                                        "subnets": ["subnet-12345678"],
                                        "securityGroups": ["sg-12345678"],
                                        "assignPublicIp": "DISABLED",
                                    },
                                },
                                "tags": [],
                            }
                        ],
                        "tags": [],
                    },
                ],
            }
        elif kwarg["services"] == [
            f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-task-set-public-ip"
        ]:
            return {
                "services": [
                    {
                        "serviceName": "test-latest-linux-service",
                        "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/sample-cluster",
                        "taskDefinition": "test-task",
                        "loadBalancers": [],
                        "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-with-public-ip",
                        "desiredCount": 1,
                        "launchType": "FARGATE",
                        "platformVersion": "1.4.0",
                        "platformFamily": "Linux",
                        "networkConfiguration": {
                            "awsvpcConfiguration": {
                                "subnets": ["subnet-12345678"],
                                "securityGroups": ["sg-12345678"],
                                "assignPublicIp": "ENABLED",
                            },
                        },
                        "taskSets": [
                            {
                                "id": "ecs-svc/task-set-public-ip",
                                "taskSetArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task-set/sample-cluster/service-task-set-public-ip/ecs-svc/task-set-public-ip",
                                "clusterArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster/sample-cluster",
                                "serviceArn": f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:service/sample-cluster/service-task-set-public-ip",
                                "networkConfiguration": {
                                    "awsvpcConfiguration": {
                                        "subnets": ["subnet-12345678"],
                                        "securityGroups": ["sg-12345678"],
                                        "assignPublicIp": "ENABLED",
                                    },
                                },
                                "tags": [],
                            }
                        ],
                        "tags": [],
                    },
                ],
            }
    return orig(self, operation_name, kwarg)


class Test_ecs_task_sets_no_assign_public_ip:
    @mock_aws
    def test_no_services(self):
        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_set_no_assign_public_ip.ecs_task_set_no_assign_public_ip.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_set_no_assign_public_ip.ecs_task_set_no_assign_public_ip import (
                ecs_task_set_no_assign_public_ip,
            )

            check = ecs_task_set_no_assign_public_ip()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_task_set_with_no_public_ip(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        vpc_id = vpc["Vpc"]["VpcId"]
        subnet = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )["Subnet"]["SubnetId"]
        sg = ec2_client.create_security_group(
            GroupName="alb-sg",
            Description="Security group for ALB",
            VpcId=vpc_id,
        )
        sg_id = sg["GroupId"]
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="sample-cluster")

        ecs_client.create_service(
            cluster="sample-cluster",
            serviceName="service-task-set-no-public-ip",
            desiredCount=1,
            launchType="FARGATE",
            networkConfiguration={
                "awsvpcConfiguration": {
                    "subnets": [subnet],
                    "securityGroups": [sg_id],
                    "assignPublicIp": "DISABLED",
                }
            },
        )["service"]["serviceArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_set_no_assign_public_ip.ecs_task_set_no_assign_public_ip.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_set_no_assign_public_ip.ecs_task_set_no_assign_public_ip import (
                ecs_task_set_no_assign_public_ip,
            )

            check = ecs_task_set_no_assign_public_ip()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ECS Task Set ecs-svc/task-set-no-public-ip does not have automatic public IP assignment."
            )
            assert result[0].resource_id == "ecs-svc/task-set-no-public-ip"
            assert (
                result[0].resource_arn
                == f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task-set/sample-cluster/service-task-set-no-public-ip/ecs-svc/task-set-no-public-ip"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_task_set_public_ip(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        vpc_id = vpc["Vpc"]["VpcId"]
        subnet = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )["Subnet"]["SubnetId"]
        sg = ec2_client.create_security_group(
            GroupName="alb-sg",
            Description="Security group for ALB",
            VpcId=vpc_id,
        )
        sg_id = sg["GroupId"]
        ecs_client = client("ecs", region_name=AWS_REGION_US_EAST_1)

        ecs_client.create_cluster(clusterName="sample-cluster")

        ecs_client.create_service(
            cluster="sample-cluster",
            serviceName="service-task-set-public-ip",
            desiredCount=1,
            launchType="FARGATE",
            networkConfiguration={
                "awsvpcConfiguration": {
                    "subnets": [subnet],
                    "securityGroups": [sg_id],
                    "assignPublicIp": "DISABLED",
                }
            },
        )["service"]["serviceArn"]

        from prowler.providers.aws.services.ecs.ecs_service import ECS

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.ecs.ecs_task_set_no_assign_public_ip.ecs_task_set_no_assign_public_ip.ecs_client",
                new=ECS(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ecs.ecs_task_set_no_assign_public_ip.ecs_task_set_no_assign_public_ip import (
                ecs_task_set_no_assign_public_ip,
            )

            check = ecs_task_set_no_assign_public_ip()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ECS Task Set ecs-svc/task-set-public-ip has automatic public IP assignment."
            )
            assert result[0].resource_id == "ecs-svc/task-set-public-ip"
            assert (
                result[0].resource_arn
                == f"arn:aws:ecs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:task-set/sample-cluster/service-task-set-public-ip/ecs-svc/task-set-public-ip"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: efs_service_test.py]---
Location: prowler-master/tests/providers/aws/services/efs/efs_service_test.py

```python
import json
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.efs.efs_service import EFS
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call

FILE_SYSTEM_ID = "fs-c7a0456e"

CREATION_TOKEN = "console-d215fa78-1f83-4651-b026-facafd8a7da7"

FILESYSTEM_POLICY = {
    "Id": "1",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["elasticfilesystem:ClientMount"],
            "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"},
        }
    ],
}


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeFileSystems":
        return {
            "FileSystems": [
                {
                    "FileSystemId": FILE_SYSTEM_ID,
                    "Encrypted": True,
                    "Tags": [{"Key": "test", "Value": "test"}],
                    "AvailabilityZoneId": "az-12345",
                    "NumberOfMountTargets": 123,
                    "BackupPolicy": {"Status": "ENABLED"},
                    "Policy": json.dumps(FILESYSTEM_POLICY),
                }
            ]
        }
    if operation_name == "DescribeMountTargets":
        return {
            "MountTargets": [
                {
                    "MountTargetId": "fsmt-123",
                    "FileSystemId": FILE_SYSTEM_ID,
                    "SubnetId": "subnet-123",
                    "LifeCycleState": "available",
                    "OwnerId": AWS_ACCOUNT_NUMBER,
                    "VpcId": "vpc-123",
                }
            ]
        }
    if operation_name == "DescribeAccessPoints":
        return {
            "AccessPoints": [
                {
                    "AccessPointId": "fsap-123",
                    "AccessPointArn": f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:access-point/{FILE_SYSTEM_ID}/fsap-123",
                    "FileSystemId": FILE_SYSTEM_ID,
                    "RootDirectory": {"Path": "/"},
                    "PosixUser": {"Uid": 1000, "Gid": 1000},
                }
            ]
        }
    if operation_name == "DescribeFileSystemPolicy":
        return {"FileSystemId": FILE_SYSTEM_ID, "Policy": json.dumps(FILESYSTEM_POLICY)}
    if operation_name == "DescribeBackupPolicy":
        return {"BackupPolicy": {"Status": "ENABLED"}}
    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_EFS:
    # Test EFS Session
    def test__get_session__(self):
        access_analyzer = EFS(set_mocked_aws_provider())
        assert access_analyzer.session.__class__.__name__ == "Session"

    # Test EFS Service
    def test__get_service__(self):
        access_analyzer = EFS(set_mocked_aws_provider())
        assert access_analyzer.service == "efs"

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    # Test EFS describe file systems
    def test_describe_file_systems(self):
        aws_provider = set_mocked_aws_provider()
        efs = EFS(aws_provider)
        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{FILE_SYSTEM_ID}"
        assert len(efs.filesystems) == 1
        assert efs.filesystems[efs_arn].id == FILE_SYSTEM_ID
        assert efs.filesystems[efs_arn].encrypted
        assert efs.filesystems[efs_arn].availability_zone_id == "az-12345"
        assert efs.filesystems[efs_arn].number_of_mount_targets == 123
        assert efs.filesystems[efs_arn].tags == [
            {"Key": "test", "Value": "test"},
        ]

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    # Test EFS describe file systems policies
    def test_describe_file_system_policies(self):
        aws_provider = set_mocked_aws_provider()
        efs = EFS(aws_provider)
        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{FILE_SYSTEM_ID}"
        assert len(efs.filesystems) == 1
        assert efs.filesystems[efs_arn].id == FILE_SYSTEM_ID
        assert efs.filesystems[efs_arn].encrypted
        assert efs.filesystems[efs_arn].backup_policy == "ENABLED"
        assert efs.filesystems[efs_arn].policy == FILESYSTEM_POLICY

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    # Test EFS describe mount targets
    def test_describe_mount_targets(self):
        aws_provider = set_mocked_aws_provider()
        efs = EFS(aws_provider)
        assert len(efs.filesystems) == 1
        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{FILE_SYSTEM_ID}"
        assert (
            efs.filesystems[efs_arn].mount_targets[0].file_system_id == FILE_SYSTEM_ID
        )
        assert efs.filesystems[efs_arn].mount_targets[0].id == "fsmt-123"
        assert efs.filesystems[efs_arn].mount_targets[0].subnet_id == "subnet-123"

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    # Test EFS describe access points
    def test_describe_access_points(self):
        aws_provider = set_mocked_aws_provider()
        efs = EFS(aws_provider)
        assert len(efs.filesystems) == 1
        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{FILE_SYSTEM_ID}"
        assert (
            efs.filesystems[efs_arn].access_points[0].file_system_id == FILE_SYSTEM_ID
        )
        assert efs.filesystems[efs_arn].access_points[0].id == "fsap-123"
        assert efs.filesystems[efs_arn].access_points[0].root_directory_path == "/"
        assert efs.filesystems[efs_arn].access_points[0].posix_user == {
            "Uid": 1000,
            "Gid": 1000,
        }
```

--------------------------------------------------------------------------------

---[FILE: efs_access_point_enforce_root_directory_test.py]---
Location: prowler-master/tests/providers/aws/services/efs/efs_access_point_enforce_root_directory/efs_access_point_enforce_root_directory_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

CREATION_TOKEN = "fs-123"


class Test_efs_access_point_enforce_root_directory:
    @mock_aws
    def test_efs_no_file_system(self):
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_access_point_enforce_root_directory.efs_access_point_enforce_root_directory.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_access_point_enforce_root_directory.efs_access_point_enforce_root_directory import (
                efs_access_point_enforce_root_directory,
            )

            check = efs_access_point_enforce_root_directory()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_efs_no_access_point(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        efs_client.create_file_system(CreationToken=CREATION_TOKEN)
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_access_point_enforce_root_directory.efs_access_point_enforce_root_directory.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_access_point_enforce_root_directory.efs_access_point_enforce_root_directory import (
                efs_access_point_enforce_root_directory,
            )

            check = efs_access_point_enforce_root_directory()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_efs_access_point_default_root_directory(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        access_point = efs_client.create_access_point(
            FileSystemId=file_system["FileSystemId"],
            PosixUser={"Uid": 1000, "Gid": 1000},
            RootDirectory={"Path": "/"},
        )

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_access_point_enforce_root_directory.efs_access_point_enforce_root_directory.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_access_point_enforce_root_directory.efs_access_point_enforce_root_directory import (
                efs_access_point_enforce_root_directory,
            )

            check = efs_access_point_enforce_root_directory()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has access points which allow access to the root directory: {access_point['AccessPointId']}."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )

    @mock_aws
    def test_efs_access_point_enforced_root_directory(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        efs_client.create_access_point(
            FileSystemId=file_system["FileSystemId"],
            PosixUser={"Uid": 1000, "Gid": 1000},
            RootDirectory={"Path": "/notdefault"},
        )

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_access_point_enforce_root_directory.efs_access_point_enforce_root_directory.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_access_point_enforce_root_directory.efs_access_point_enforce_root_directory import (
                efs_access_point_enforce_root_directory,
            )

            check = efs_access_point_enforce_root_directory()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} does not have any access point allowing access to the root directory."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: efs_access_point_enforce_user_identity_test.py]---
Location: prowler-master/tests/providers/aws/services/efs/efs_access_point_enforce_user_identity/efs_access_point_enforce_user_identity_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

CREATION_TOKEN = "fs-123"


class Test_efs_access_point_enforce_user_identity:
    @mock_aws
    def test_efs_no_file_system(self):
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_access_point_enforce_user_identity.efs_access_point_enforce_user_identity.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_access_point_enforce_user_identity.efs_access_point_enforce_user_identity import (
                efs_access_point_enforce_user_identity,
            )

            check = efs_access_point_enforce_user_identity()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_efs_no_access_point(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        efs_client.create_file_system(CreationToken=CREATION_TOKEN)
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_access_point_enforce_user_identity.efs_access_point_enforce_user_identity.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_access_point_enforce_user_identity.efs_access_point_enforce_user_identity import (
                efs_access_point_enforce_user_identity,
            )

            check = efs_access_point_enforce_user_identity()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_efs_access_point_no_posix_user(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        access_point = efs_client.create_access_point(
            FileSystemId=file_system["FileSystemId"],
            RootDirectory={"Path": "/"},
        )

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_access_point_enforce_user_identity.efs_access_point_enforce_user_identity.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_access_point_enforce_user_identity.efs_access_point_enforce_user_identity import (
                efs_access_point_enforce_user_identity,
            )

            check = efs_access_point_enforce_user_identity()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has access points with no POSIX user: {access_point['AccessPointId']}."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )

    @mock_aws
    def test_efs_access_point_defined_posix_user(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        efs_client.create_access_point(
            FileSystemId=file_system["FileSystemId"],
            PosixUser={"Uid": 1000, "Gid": 1000},
            RootDirectory={"Path": "/notdefault"},
        )

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_access_point_enforce_user_identity.efs_access_point_enforce_user_identity.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_access_point_enforce_user_identity.efs_access_point_enforce_user_identity import (
                efs_access_point_enforce_user_identity,
            )

            check = efs_access_point_enforce_user_identity()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has all access points with defined POSIX user."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: efs_encryption_at_rest_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/efs/efs_encryption_at_rest_enabled/efs_encryption_at_rest_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

CREATION_TOKEN = "fs-123"


class Test_efs_encryption_at_rest_enabled:
    @mock_aws
    def test_efs_encryption_enabled(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        filesystem = efs_client.create_file_system(
            CreationToken=CREATION_TOKEN, Encrypted=True
        )

        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{filesystem['FileSystemId']}"

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_encryption_at_rest_enabled.efs_encryption_at_rest_enabled.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_encryption_at_rest_enabled.efs_encryption_at_rest_enabled import (
                efs_encryption_at_rest_enabled,
            )

            check = efs_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == f"EFS {filesystem['FileSystemId']} has encryption at rest enabled."
            )
            assert result[0].resource_id == filesystem["FileSystemId"]
            assert result[0].resource_arn == efs_arn

    @mock_aws
    def test_efs_encryption_disabled(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        filesystem = efs_client.create_file_system(
            CreationToken=CREATION_TOKEN, Encrypted=False
        )

        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{filesystem['FileSystemId']}"

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_encryption_at_rest_enabled.efs_encryption_at_rest_enabled.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_encryption_at_rest_enabled.efs_encryption_at_rest_enabled import (
                efs_encryption_at_rest_enabled,
            )

            check = efs_encryption_at_rest_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == f"EFS {filesystem['FileSystemId']} does not have encryption at rest enabled."
            )
            assert result[0].resource_id == filesystem["FileSystemId"]
            assert result[0].resource_arn == efs_arn
```

--------------------------------------------------------------------------------

---[FILE: efs_have_backup_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/efs/efs_have_backup_enabled/efs_have_backup_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

CREATION_TOKEN = "fs-123"


class Test_efs_have_backup_enabled:
    @mock_aws
    def test_efs_valid_backup_policy(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(
            CreationToken=CREATION_TOKEN, Backup=True
        )

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_have_backup_enabled.efs_have_backup_enabled.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_have_backup_enabled.efs_have_backup_enabled import (
                efs_have_backup_enabled,
            )

            check = efs_have_backup_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has backup enabled."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )

    @mock_aws
    def test_efs_invalid_policy_backup_1(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(
            CreationToken=CREATION_TOKEN, Backup=False
        )

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_have_backup_enabled.efs_have_backup_enabled.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_have_backup_enabled.efs_have_backup_enabled import (
                efs_have_backup_enabled,
            )

            check = efs_have_backup_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} does not have backup enabled."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )

    @mock_aws
    def test_efs_invalid_policy_backup_2(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(
            CreationToken=CREATION_TOKEN, Backup=False
        )

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_have_backup_enabled.efs_have_backup_enabled.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_have_backup_enabled.efs_have_backup_enabled import (
                efs_have_backup_enabled,
            )

            check = efs_have_backup_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} does not have backup enabled."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
```

--------------------------------------------------------------------------------

````
