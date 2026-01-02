---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 610
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 610 of 867)

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

---[FILE: rds_instance_no_public_access_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_no_public_access/rds_instance_no_public_access_test.py

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


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeDBEngineVersions":
        return {
            "DBEngineVersions": [
                {
                    "Engine": "postgresres",
                    "EngineVersion": "8.0.32",
                    "DBEngineDescription": "description",
                    "DBEngineVersionDescription": "description",
                },
            ]
        }
    return make_api_call(self, operation_name, kwarg)


@mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_rds_instance_no_public_access:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access import (
                    rds_instance_no_public_access,
                )

                check = rds_instance_no_public_access()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_instance_private(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access import (
                    rds_instance_no_public_access,
                )

                check = rds_instance_no_public_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is not publicly accessible."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_public(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            PubliclyAccessible=True,
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.rds_client",
                new=RDS(aws_provider),
            ) as rds_client:
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access import (
                    rds_instance_no_public_access,
                )

                # Moto create db instance with a default VPC security group
                rds_client.db_instances[
                    next(iter(rds_client.db_instances))
                ].security_groups = []
                check = rds_instance_no_public_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is set as publicly accessible, but is not publicly exposed."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_public_with_public_sg_in_private_subnet(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            PubliclyAccessible=True,
            VpcSecurityGroupIds=[default_sg_id],
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.audit_metadata.expected_checks = [
            "ec2_securitygroup_allow_ingress_from_internet_to_any_port"
        ]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.rds_client",
                    new=RDS(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.ec2_client",
                    new=EC2(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access import (
                    rds_instance_no_public_access,
                )

                check = rds_instance_no_public_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"RDS Instance db-master-1 is set as publicly accessible and security group default ({default_sg_id}) has postgres port 5432 open to the Internet at endpoint db-master-1.aaaaaaaaaa.us-east-1.rds.amazonaws.com but is not in a public subnet."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_public_with_filtered_sg(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "123.123.123.123/32"}],
                }
            ],
        )
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            PubliclyAccessible=True,
            VpcSecurityGroupIds=[default_sg_id],
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access import (
                    rds_instance_no_public_access,
                )

                check = rds_instance_no_public_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is set as publicly accessible but filtered with security groups."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_public_with_public_subnet(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        # Get default security group from VPC
        default_sg_id = (
            ec2_client.describe_security_groups(
                Filters=[
                    {
                        "Name": "vpc-id",
                        "Values": [vpc_id],
                    }
                ]
            )
        )["SecurityGroups"][0]["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        subnet_id = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.0.0/16",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )["Subnet"]["SubnetId"]
        # add default route of subnet to an internet gateway to make it public
        igw_id = ec2_client.create_internet_gateway()["InternetGateway"][
            "InternetGatewayId"
        ]
        # attach internet gateway to subnet
        ec2_client.attach_internet_gateway(InternetGatewayId=igw_id, VpcId=vpc_id)
        # create route table
        route_table_id = ec2_client.create_route_table(VpcId=vpc_id)["RouteTable"][
            "RouteTableId"
        ]
        # associate route table with subnet
        ec2_client.associate_route_table(
            RouteTableId=route_table_id, SubnetId=subnet_id
        )
        # add route to route table
        ec2_client.create_route(
            RouteTableId=route_table_id,
            DestinationCidrBlock="0.0.0.0/0",
            GatewayId=igw_id,
        )

        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_subnet_group(
            DBSubnetGroupName="subnet-group",
            DBSubnetGroupDescription="subnet-group",
            SubnetIds=[subnet_id],
        )
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            PubliclyAccessible=True,
            DBSubnetGroupName="subnet-group",
            VpcSecurityGroupIds=[default_sg_id],
        )
        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.rds.rds_service import RDS
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.rds_client",
                    new=RDS(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.ec2_client",
                    new=EC2(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access.vpc_client",
                    new=VPC(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_no_public_access.rds_instance_no_public_access import (
                    rds_instance_no_public_access,
                )

                check = rds_instance_no_public_access()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"RDS Instance db-master-1 is set as publicly accessible and security group default ({default_sg_id}) has postgres port 5432 open to the Internet at endpoint db-master-1.aaaaaaaaaa.us-east-1.rds.amazonaws.com in a public subnet {subnet_id}."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_protected_by_backup_plan_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_protected_by_backup_plan/rds_instance_protected_by_backup_plan_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_rds_instance_protected_by_backup_plan:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.backup.backup_service import Backup
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.rds_client",
                    new=RDS(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan import (
                    rds_instance_protected_by_backup_plan,
                )

                check = rds_instance_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_instance_no_existing_backup_plans(self):
        instance = client("rds", region_name=AWS_REGION_US_EAST_1)
        instance.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            PubliclyAccessible=False,
        )

        from prowler.providers.aws.services.backup.backup_service import Backup
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.rds_client",
                    new=RDS(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.backup_client",
                    new=Backup(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan import (
                    rds_instance_protected_by_backup_plan,
                )

                check = rds_instance_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is not protected by a backup plan."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    def test_rds_instance_without_backup_plan(self):
        instance = mock.MagicMock()
        backup = mock.MagicMock()

        from prowler.providers.aws.services.rds.rds_service import DBInstance

        arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
        instance.db_instances = {
            arn: DBInstance(
                id="db-master-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1",
                endpoint={
                    "Address": "db-master-1.c9akciq32.rds.amazonaws.com",
                    "Port": 5432,
                },
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-master-1",
                region="us-east-1",
                instance_class="db.m1.small",
                engine="postgres",
                db_name="staging-postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        backup.protected_resources = [
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-2"
        ]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.rds_client",
                    new=instance,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=instance,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan import (
                    rds_instance_protected_by_backup_plan,
                )

                check = rds_instance_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is not protected by a backup plan."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    def test_rds_instance_with_backup_plan(self):
        instance = mock.MagicMock()

        from prowler.providers.aws.services.rds.rds_service import DBInstance

        arn = f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
        instance.db_instances = {
            arn: DBInstance(
                id="db-master-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1",
                endpoint={
                    "Address": "db-master-1.c9akciq32.rds.amazonaws.com",
                    "Port": 5432,
                },
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-master-1",
                region="us-east-1",
                instance_class="db.m1.small",
                engine="postgres",
                db_name="staging-postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = [arn]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.rds_client",
                    new=instance,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=instance,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan import (
                    rds_instance_protected_by_backup_plan,
                )

                check = rds_instance_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is protected by a backup plan."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    def test_rds_instance_with_backup_plan_via_instance_wildcard(self):
        instance = mock.MagicMock()
        instance.audited_partition = "aws"

        from prowler.providers.aws.services.rds.rds_service import DBInstance

        arn = "arn:aws:rds:*:*:instance:*"
        instance.db_instances = {
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1": DBInstance(
                id="db-master-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1",
                endpoint={
                    "Address": "db-master-1.c9akciq32.rds.amazonaws.com",
                    "Port": 5432,
                },
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-master-1",
                region="us-east-1",
                instance_class="db.m1.small",
                engine="postgres",
                db_name="staging-postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = [arn]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.rds_client",
                    new=instance,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=instance,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan import (
                    rds_instance_protected_by_backup_plan,
                )

                check = rds_instance_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is protected by a backup plan."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    def test_rds_instance_with_backup_plan_via_all_wildcard(self):
        instance = mock.MagicMock()

        from prowler.providers.aws.services.rds.rds_service import DBInstance

        arn = "*"
        instance.db_instances = {
            f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1": DBInstance(
                id="db-master-1",
                arn=f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1",
                endpoint={
                    "Address": "db-master-1.c9akciq32.rds.amazonaws.com",
                    "Port": 5432,
                },
                engine_version="13.3",
                status="available",
                public=False,
                encrypted=True,
                deletion_protection=False,
                auto_minor_version_upgrade=True,
                multi_az=False,
                username="admin",
                iam_auth=False,
                name="db-master-1",
                region="us-east-1",
                instance_class="db.m1.small",
                engine="postgres",
                db_name="staging-postgres",
                allocated_storage=10,
                tags=[],
            )
        }

        backup = mock.MagicMock()
        backup.protected_resources = [arn]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.rds_client",
                    new=instance,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_client.rds_client",
                    new=instance,
                ),
                mock.patch(
                    "prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan.backup_client",
                    new=backup,
                ),
                mock.patch(
                    "prowler.providers.aws.services.backup.backup_client.backup_client",
                    new=backup,
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_protected_by_backup_plan.rds_instance_protected_by_backup_plan import (
                    rds_instance_protected_by_backup_plan,
                )

                check = rds_instance_protected_by_backup_plan()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is protected by a backup plan."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_storage_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_instance_storage_encrypted/rds_instance_storage_encrypted_test.py

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


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeDBEngineVersions":
        return {
            "DBEngineVersions": [
                {
                    "Engine": "postgres",
                    "EngineVersion": "8.0.32",
                    "DBEngineDescription": "description",
                    "DBEngineVersionDescription": "description",
                },
            ]
        }
    return make_api_call(self, operation_name, kwarg)


@mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_rds_instance_storage_encrypted:
    @mock_aws
    def test_rds_no_instances(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_storage_encrypted.rds_instance_storage_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_storage_encrypted.rds_instance_storage_encrypted import (
                    rds_instance_storage_encrypted,
                )

                check = rds_instance_storage_encrypted()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_rds_instance_no_encryption(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_storage_encrypted.rds_instance_storage_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_storage_encrypted.rds_instance_storage_encrypted import (
                    rds_instance_storage_encrypted,
                )

                check = rds_instance_storage_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is not encrypted."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []

    @mock_aws
    def test_rds_instance_with_encryption(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-master-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
            StorageEncrypted=True,
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_instance_storage_encrypted.rds_instance_storage_encrypted.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_instance_storage_encrypted.rds_instance_storage_encrypted import (
                    rds_instance_storage_encrypted,
                )

                check = rds_instance_storage_encrypted()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "RDS Instance db-master-1 is encrypted."
                )
                assert result[0].resource_id == "db-master-1"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:db:db-master-1"
                )
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
