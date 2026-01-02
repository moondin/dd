---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 546
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 546 of 867)

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

---[FILE: efs_mount_target_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/efs/efs_mount_target_not_publicly_accessible/efs_mount_target_not_publicly_accessible_test.py

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


class Test_efs_mount_target_not_publicly_accessible:
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
                "prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible import (
                efs_mount_target_not_publicly_accessible,
            )

            check = efs_mount_target_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_efs_no_mount_target(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible import (
                efs_mount_target_not_publicly_accessible,
            )

            check = efs_mount_target_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} does not have any public mount targets."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )

    @mock_aws
    def test_efs_mount_target_public_subnet(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        igw = ec2_client.create_internet_gateway()
        ec2_client.attach_internet_gateway(
            InternetGatewayId=igw["InternetGateway"]["InternetGatewayId"],
            VpcId=vpc["Vpc"]["VpcId"],
        )
        subnet_public = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        route_table = ec2_client.create_route_table(VpcId=vpc["Vpc"]["VpcId"])
        ec2_client.create_route(
            RouteTableId=route_table["RouteTable"]["RouteTableId"],
            DestinationCidrBlock="0.0.0.0/0",
            GatewayId=igw["InternetGateway"]["InternetGatewayId"],
        )
        ec2_client.associate_route_table(
            RouteTableId=route_table["RouteTable"]["RouteTableId"],
            SubnetId=subnet_public["Subnet"]["SubnetId"],
        )
        mount_target = efs_client.create_mount_target(
            FileSystemId=file_system["FileSystemId"],
            SubnetId=subnet_public["Subnet"]["SubnetId"],
        )

        from prowler.providers.aws.services.efs.efs_service import EFS
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible import (
                efs_mount_target_not_publicly_accessible,
            )

            check = efs_mount_target_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has public mount targets: {mount_target['MountTargetId']}"
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )

    @mock_aws
    def test_efs_mount_target_private_subnet(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet_private = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        efs_client.create_mount_target(
            FileSystemId=file_system["FileSystemId"],
            SubnetId=subnet_private["Subnet"]["SubnetId"],
        )

        from prowler.providers.aws.services.efs.efs_service import EFS
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_mount_target_not_publicly_accessible.efs_mount_target_not_publicly_accessible import (
                efs_mount_target_not_publicly_accessible,
            )

            check = efs_mount_target_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} does not have any public mount targets."
            )
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
```

--------------------------------------------------------------------------------

---[FILE: efs_multi_az_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/efs/efs_multi_az_enabled/efs_multi_az_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

CREATION_TOKEN = "fs-123"


class Test_efs_multi_az_enabled:
    @mock_aws
    def test_no_efs_filesystems(self):
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.efs.efs_multi_az_enabled.efs_multi_az_enabled.efs_client",
                new=EFS(aws_provider),
            ):
                from prowler.providers.aws.services.efs.efs_multi_az_enabled.efs_multi_az_enabled import (
                    efs_multi_az_enabled,
                )

                check = efs_multi_az_enabled()
                result = check.execute()
                assert len(result) == 0

    @mock_aws
    def test_efs_multi_az_availability_zone_id_present(self):
        efs_client = client("efs", region_name=AWS_REGION_EU_WEST_1)
        file_system = efs_client.create_file_system(
            CreationToken=CREATION_TOKEN, Backup=False
        )
        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.efs.efs_multi_az_enabled.efs_multi_az_enabled.efs_client",
                new=EFS(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.efs.efs_multi_az_enabled.efs_multi_az_enabled import (
                    efs_multi_az_enabled,
                )

                service_client.filesystems[efs_arn].availability_zone_id = "az-123"
                check = efs_multi_az_enabled()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"EFS {file_system['FileSystemId']} is a Single-AZ file system."
                )
                assert result[0].resource_id == file_system["FileSystemId"]
                assert (
                    result[0].resource_arn
                    == f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
                )

    @mock_aws
    def test_efs_multi_az_single_mount_target(self):
        efs_client = client("efs", region_name=AWS_REGION_EU_WEST_1)
        file_system = efs_client.create_file_system(
            CreationToken=CREATION_TOKEN, Backup=False
        )
        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.efs.efs_multi_az_enabled.efs_multi_az_enabled.efs_client",
                new=EFS(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.efs.efs_multi_az_enabled.efs_multi_az_enabled import (
                    efs_multi_az_enabled,
                )

                service_client.filesystems[efs_arn].number_of_mount_targets = 1
                check = efs_multi_az_enabled()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"EFS {file_system['FileSystemId']} is a Multi-AZ file system but with only one mount target."
                )
                assert result[0].resource_id == file_system["FileSystemId"]
                assert (
                    result[0].resource_arn
                    == f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
                )

    @mock_aws
    def test_efs_multi_az_enabled(self):
        efs_client = client("efs", region_name=AWS_REGION_EU_WEST_1)
        file_system = efs_client.create_file_system(
            CreationToken=CREATION_TOKEN, Backup=False
        )
        efs_arn = f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.efs.efs_multi_az_enabled.efs_multi_az_enabled.efs_client",
                new=EFS(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.efs.efs_multi_az_enabled.efs_multi_az_enabled import (
                    efs_multi_az_enabled,
                )

                service_client.filesystems[efs_arn].number_of_mount_targets = 12
                check = efs_multi_az_enabled()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"EFS {file_system['FileSystemId']} is a Multi-AZ file system with more than one mount target."
                )
                assert result[0].resource_id == file_system["FileSystemId"]
                assert (
                    result[0].resource_arn
                    == f"arn:aws:elasticfilesystem:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
                )
```

--------------------------------------------------------------------------------

---[FILE: efs_not_publicly_accessible_test.py]---
Location: prowler-master/tests/providers/aws/services/efs/efs_not_publicly_accessible/efs_not_publicly_accessible_test.py

```python
import json
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

CREATION_TOKEN = "fs-123"


FILE_SYSTEM_POLICY = json.dumps(
    {
        "Id": "1",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["elasticfilesystem:ClientMount"],
                "Principal": {"AWS": "arn:aws:iam::123456789012:root"},
            }
        ],
    }
)

FILE_SYSTEM_INVALID_POLICY = json.dumps(
    {
        "Id": "1",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["elasticfilesystem:ClientMount"],
                "Principal": {"AWS": "*"},
            }
        ],
    }
)

# https://docs.aws.amazon.com/efs/latest/ug/access-control-block-public-access.html#what-is-a-public-policy
FILE_SYSTEM_POLICY_WITH_SOURCE_ARN_CONDITION = json.dumps(
    {
        "Version": "2012-10-17",
        "Id": "efs-policy-wizard-15ad9567-2546-4bbb-8168-5541b6fc0e55",
        "Statement": [
            {
                "Sid": "efs-statement-14a7191c-9401-40e7-a388-6af6cfb7dd9c",
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": [
                    "elasticfilesystem:ClientMount",
                    "elasticfilesystem:ClientWrite",
                    "elasticfilesystem:ClientRootAccess",
                ],
                "Condition": {
                    "ArnEquals": {
                        "aws:SourceArn": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
                    }
                },
            }
        ],
    }
)

# https://docs.aws.amazon.com/efs/latest/ug/access-control-block-public-access.html#what-is-a-public-policy
FILE_SYSTEM_POLICY_WITH_MOUNT_TARGET_CONDITION = json.dumps(
    {
        "Version": "2012-10-17",
        "Id": "efs-policy-wizard-15ad9567-2546-4bbb-8168-5541b6fc0e55",
        "Statement": [
            {
                "Sid": "efs-statement-14a7191c-9401-40e7-a388-6af6cfb7dd9c",
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": [
                    "elasticfilesystem:ClientMount",
                    "elasticfilesystem:ClientWrite",
                    "elasticfilesystem:ClientRootAccess",
                ],
                "Condition": {
                    "Bool": {"elasticfilesystem:AccessedViaMountTarget": "true"}
                },
            }
        ],
    }
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeFileSystemPolicy":
        return {"Policy": FILE_SYSTEM_POLICY}

    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "DescribeFileSystemPolicy":
        return {"Policy": FILE_SYSTEM_POLICY_WITH_MOUNT_TARGET_CONDITION}
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v3(self, operation_name, kwarg):
    if operation_name == "DescribeFileSystemPolicy":
        return {"Policy": FILE_SYSTEM_POLICY_WITH_SOURCE_ARN_CONDITION}
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_v4(self, operation_name, kwarg):
    if operation_name == "DescribeFileSystemPolicy":
        return {"Policy": FILE_SYSTEM_INVALID_POLICY}
    return make_api_call(self, operation_name, kwarg)


class Test_efs_not_publicly_accessible:
    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_efs_valid_policy(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)
        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible import (
                efs_not_publicly_accessible,
            )

            check = efs_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has a policy which does not allow access to any client within the VPC."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_efs_valid_policy_with_mount_target_condition(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible import (
                efs_not_publicly_accessible,
            )

            check = efs_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has a policy which does not allow access to any client within the VPC."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v3)
    def test_efs_valid_policy_with_source_arn_condition(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible import (
                efs_not_publicly_accessible,
            )

            check = efs_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has a policy which does not allow access to any client within the VPC."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v4)
    def test_efs_invalid_policy(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible import (
                efs_not_publicly_accessible,
            )

            check = efs_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} has a policy which allows access to any client within the VPC."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_efs_no_policy(self):
        efs_client = client("efs", region_name=AWS_REGION_US_EAST_1)
        file_system = efs_client.create_file_system(CreationToken=CREATION_TOKEN)

        from prowler.providers.aws.services.efs.efs_service import EFS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible.efs_client",
                new=EFS(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.efs.efs_not_publicly_accessible.efs_not_publicly_accessible import (
                efs_not_publicly_accessible,
            )

            check = efs_not_publicly_accessible()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EFS {file_system['FileSystemId']} doesn't have any policy which means it grants full access to any client within the VPC."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == file_system["FileSystemId"]
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticfilesystem:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:file-system/{file_system['FileSystemId']}"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: eks_service_test.py]---
Location: prowler-master/tests/providers/aws/services/eks/eks_service_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.eks.eks_service import EKS
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

cluster_name = "test"
cidr_block_vpc = "10.0.0.0/16"
cidr_block_subnet_1 = "10.0.0.0/22"
cidr_block_subnet_2 = "10.0.4.0/22"


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
class Test_EKS_Service:
    # Test EKS Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        eks = EKS(aws_provider)
        assert eks.service == "eks"

    # Test EKS client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        eks = EKS(aws_provider)
        for reg_client in eks.regional_clients.values():
            assert reg_client.__class__.__name__ == "EKS"

    # Test EKS session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        eks = EKS(aws_provider)
        assert eks.session.__class__.__name__ == "Session"

    # Test EKS list clusters
    @mock_aws
    def test__list_clusters(self):
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        eks_client = client("eks", region_name=AWS_REGION_EU_WEST_1)
        vpc = ec2_client.create_vpc(CidrBlock=cidr_block_vpc)
        subnet1 = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"], CidrBlock=cidr_block_subnet_1
        )
        subnet2 = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"], CidrBlock=cidr_block_subnet_2
        )
        eks_client.create_cluster(
            version="1.10",
            name=cluster_name,
            clientRequestToken="1d2129a1-3d38-460a-9756-e5b91fddb951",
            resourcesVpcConfig={
                "subnetIds": [
                    subnet1["Subnet"]["SubnetId"],
                    subnet2["Subnet"]["SubnetId"],
                ],
            },
            roleArn=f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/eks-service-role-AWSServiceRoleForAmazonEKS-J7ONKE3BQ4PI",
            tags={"test": "test"},
        )
        aws_provider = set_mocked_aws_provider()
        eks = EKS(aws_provider)
        assert len(eks.clusters) == 1
        assert eks.clusters[0].name == cluster_name
        assert eks.clusters[0].region == AWS_REGION_EU_WEST_1
        assert eks.clusters[0].tags == [{"test": "test"}]

    # Test EKS describe clusters
    @mock_aws
    def test__describe_clusters(self):
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        eks_client = client("eks", region_name=AWS_REGION_EU_WEST_1)
        vpc = ec2_client.create_vpc(CidrBlock=cidr_block_vpc)
        subnet1 = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"], CidrBlock=cidr_block_subnet_1
        )
        subnet2 = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"], CidrBlock=cidr_block_subnet_2
        )
        cluster = eks_client.create_cluster(
            version="1.10",
            name=cluster_name,
            clientRequestToken="1d2129a1-3d38-460a-9756-e5b91fddb951",
            resourcesVpcConfig={
                "subnetIds": [
                    subnet1["Subnet"]["SubnetId"],
                    subnet2["Subnet"]["SubnetId"],
                ],
                "endpointPublicAccess": True,
                "endpointPrivateAccess": True,
                "publicAccessCidrs": [
                    "0.0.0.0/0",
                ],
            },
            logging={
                "clusterLogging": [
                    {
                        "types": [
                            "api",
                        ],
                        "enabled": True,
                    },
                ]
            },
            roleArn=f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/eks-service-role-AWSServiceRoleForAmazonEKS-J7ONKE3BQ4PI",
            encryptionConfig=[
                {
                    "resources": [
                        "secrets",
                    ],
                },
            ],
        )
        aws_provider = set_mocked_aws_provider()
        eks = EKS(aws_provider)
        assert len(eks.clusters) == 1
        assert eks.clusters[0].name == cluster_name
        assert eks.clusters[0].region == AWS_REGION_EU_WEST_1
        assert eks.clusters[0].arn == cluster["cluster"]["arn"]
        assert eks.clusters[0].logging.types == ["api"]
        assert eks.clusters[0].logging.enabled
        assert eks.clusters[0].endpoint_public_access
        assert eks.clusters[0].endpoint_private_access
        assert eks.clusters[0].public_access_cidrs == ["0.0.0.0/0"]
        assert eks.clusters[0].encryptionConfig
        assert eks.clusters[0].version == "1.10"
```

--------------------------------------------------------------------------------

---[FILE: eks_cluster_deletion_protection_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/eks/eks_cluster_deletion_protection_enabled/eks_cluster_deletion_protection_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.eks.eks_service import EKSCluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

cluster_name = "cluster_test"
cluster_arn = (
    f"arn:aws:eks:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
)


class Test_eks_cluster_deletion_protection_enabled:
    def test_no_clusters(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_deletion_protection_enabled.eks_cluster_deletion_protection_enabled import (
                eks_cluster_deletion_protection_enabled,
            )

            check = eks_cluster_deletion_protection_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_cluster_deletion_protection_disabled(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                deletion_protection=False,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_deletion_protection_enabled.eks_cluster_deletion_protection_enabled import (
                eks_cluster_deletion_protection_enabled,
            )

            check = eks_cluster_deletion_protection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"EKS cluster {cluster_name} has deletion protection disabled."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_cluster_deletion_protection_enabled(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                deletion_protection=True,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_deletion_protection_enabled.eks_cluster_deletion_protection_enabled import (
                eks_cluster_deletion_protection_enabled,
            )

            check = eks_cluster_deletion_protection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"EKS cluster {cluster_name} has deletion protection enabled."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    def test_cluster_deletion_protection_none(self):
        eks_client = mock.MagicMock
        eks_client.clusters = []
        eks_client.clusters.append(
            EKSCluster(
                name=cluster_name,
                arn=cluster_arn,
                region=AWS_REGION_EU_WEST_1,
                deletion_protection=None,
            )
        )

        with mock.patch(
            "prowler.providers.aws.services.eks.eks_service.EKS",
            eks_client,
        ):
            from prowler.providers.aws.services.eks.eks_cluster_deletion_protection_enabled.eks_cluster_deletion_protection_enabled import (
                eks_cluster_deletion_protection_enabled,
            )

            check = eks_cluster_deletion_protection_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"EKS cluster {cluster_name} has deletion protection enabled."
            )
            assert result[0].resource_id == cluster_name
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
