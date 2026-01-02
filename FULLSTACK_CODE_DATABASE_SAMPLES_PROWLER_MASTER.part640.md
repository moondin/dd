---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 640
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 640 of 867)

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

---[FILE: vpc_peering_routing_tables_with_least_privilege_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_peering_routing_tables_with_least_privilege/vpc_peering_routing_tables_with_least_privilege_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_vpc_peering_routing_tables_with_least_privilege:
    @mock_aws
    def test_vpc_no_peering_connections(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_peering_routing_tables_with_least_privilege.vpc_peering_routing_tables_with_least_privilege.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_peering_routing_tables_with_least_privilege.vpc_peering_routing_tables_with_least_privilege import (
                    vpc_peering_routing_tables_with_least_privilege,
                )

                check = vpc_peering_routing_tables_with_least_privilege()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_vpc_comply_peering_connection_(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)

        # Create VPCs peers as well as a comply route
        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        peer_vpc = ec2_client.create_vpc(CidrBlock="11.0.0.0/16")
        vpc_pcx = ec2_client.create_vpc_peering_connection(
            VpcId=vpc["Vpc"]["VpcId"], PeerVpcId=peer_vpc["Vpc"]["VpcId"]
        )
        vpc_pcx_id = vpc_pcx["VpcPeeringConnection"]["VpcPeeringConnectionId"]

        vpc_pcx = ec2_client.accept_vpc_peering_connection(
            VpcPeeringConnectionId=vpc_pcx_id
        )
        main_route_table_id = ec2_client.describe_route_tables(
            Filters=[
                {"Name": "vpc-id", "Values": [vpc["Vpc"]["VpcId"]]},
                {"Name": "association.main", "Values": ["true"]},
            ]
        )["RouteTables"][0]["RouteTableId"]
        main_route_table = ec2_resource.RouteTable(main_route_table_id)
        main_route_table.create_route(
            DestinationCidrBlock="10.0.0.4/24", VpcPeeringConnectionId=vpc_pcx_id
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC, Route

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_peering_routing_tables_with_least_privilege.vpc_peering_routing_tables_with_least_privilege.vpc_client",
                new=VPC(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_peering_routing_tables_with_least_privilege.vpc_peering_routing_tables_with_least_privilege import (
                    vpc_peering_routing_tables_with_least_privilege,
                )

                service_client.vpc_peering_connections[0].route_tables = [
                    Route(
                        id=main_route_table_id,
                        destination_cidrs=["10.12.23.44/32"],
                    )
                ]
                check = vpc_peering_routing_tables_with_least_privilege()
                result = check.execute()

                assert len(result) == len(
                    ec2_client.describe_vpc_peering_connections()[
                        "VpcPeeringConnections"
                    ]
                )
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Peering Connection {vpc_pcx_id} comply with least privilege access."
                )
                assert result[0].resource_id == vpc_pcx_id
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_comply_peering_connection_edge_case(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)

        # Create VPCs peers as well as a comply route
        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        peer_vpc = ec2_client.create_vpc(CidrBlock="11.0.0.0/16")
        vpc_pcx = ec2_client.create_vpc_peering_connection(
            VpcId=vpc["Vpc"]["VpcId"], PeerVpcId=peer_vpc["Vpc"]["VpcId"]
        )
        vpc_pcx_id = vpc_pcx["VpcPeeringConnection"]["VpcPeeringConnectionId"]

        vpc_pcx = ec2_client.accept_vpc_peering_connection(
            VpcPeeringConnectionId=vpc_pcx_id
        )
        main_route_table_id = ec2_client.describe_route_tables(
            Filters=[
                {"Name": "vpc-id", "Values": [vpc["Vpc"]["VpcId"]]},
                {"Name": "association.main", "Values": ["true"]},
            ]
        )["RouteTables"][0]["RouteTableId"]
        main_route_table = ec2_resource.RouteTable(main_route_table_id)
        main_route_table.create_route(DestinationCidrBlock="0.0.0.0/0")

        from prowler.providers.aws.services.vpc.vpc_service import VPC, Route

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_peering_routing_tables_with_least_privilege.vpc_peering_routing_tables_with_least_privilege.vpc_client",
                new=VPC(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_peering_routing_tables_with_least_privilege.vpc_peering_routing_tables_with_least_privilege import (
                    vpc_peering_routing_tables_with_least_privilege,
                )

                service_client.vpc_peering_connections[0].route_tables = [
                    Route(
                        id=main_route_table_id,
                        destination_cidrs=["10.12.23.44/32"],
                    )
                ]
                check = vpc_peering_routing_tables_with_least_privilege()
                result = check.execute()

                assert len(result) == len(
                    ec2_client.describe_vpc_peering_connections()[
                        "VpcPeeringConnections"
                    ]
                )
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Peering Connection {vpc_pcx_id} comply with least privilege access."
                )
                assert result[0].resource_id == vpc_pcx_id
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_not_comply_peering_connection_(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)

        # Create VPCs peers as well as a comply route
        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        peer_vpc = ec2_client.create_vpc(CidrBlock="11.0.0.0/16")
        vpc_pcx = ec2_client.create_vpc_peering_connection(
            VpcId=vpc["Vpc"]["VpcId"], PeerVpcId=peer_vpc["Vpc"]["VpcId"]
        )
        vpc_pcx_id = vpc_pcx["VpcPeeringConnection"]["VpcPeeringConnectionId"]

        vpc_pcx = ec2_client.accept_vpc_peering_connection(
            VpcPeeringConnectionId=vpc_pcx_id
        )
        main_route_table_id = ec2_client.describe_route_tables(
            Filters=[
                {"Name": "vpc-id", "Values": [vpc["Vpc"]["VpcId"]]},
                {"Name": "association.main", "Values": ["true"]},
            ]
        )["RouteTables"][0]["RouteTableId"]
        main_route_table = ec2_resource.RouteTable(main_route_table_id)
        main_route_table.create_route(
            DestinationCidrBlock="10.0.0.0/16", VpcPeeringConnectionId=vpc_pcx_id
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC, Route

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_peering_routing_tables_with_least_privilege.vpc_peering_routing_tables_with_least_privilege.vpc_client",
                new=VPC(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_peering_routing_tables_with_least_privilege.vpc_peering_routing_tables_with_least_privilege import (
                    vpc_peering_routing_tables_with_least_privilege,
                )

                service_client.vpc_peering_connections[0].route_tables = [
                    Route(
                        id=main_route_table_id,
                        destination_cidrs=["10.0.0.0/16"],
                    )
                ]
                check = vpc_peering_routing_tables_with_least_privilege()
                result = check.execute()

                assert len(result) == len(
                    ec2_client.describe_vpc_peering_connections()[
                        "VpcPeeringConnections"
                    ]
                )
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"VPC Peering Connection {vpc_pcx_id} does not comply with least privilege access since it accepts whole VPCs CIDR in its route tables."
                )
                assert result[0].resource_id == vpc_pcx_id
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_different_az_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_subnet_different_az/vpc_subnet_different_az_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_vpc_subnet_different_az:
    @mock_aws
    def test_vpc_subnet_different_az(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24",
            InstanceTenancy="default",
            TagSpecifications=[
                {
                    "ResourceType": "vpc",
                    "Tags": [
                        {"Key": "Name", "Value": "vpc_name"},
                    ],
                },
            ],
        )
        # VPC AZ 1
        ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )

        # VPC AZ 2
        ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}b",
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_different_az.vpc_subnet_different_az.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_different_az.vpc_subnet_different_az import (
                    vpc_subnet_different_az,
                )

                check = vpc_subnet_different_az()
                results = check.execute()

                found = False
                for result in results:
                    if result.resource_id == vpc["Vpc"]["VpcId"]:
                        found = True
                        assert result.status == "PASS"
                        assert (
                            result.status_extended
                            == "VPC vpc_name has subnets in more than one availability zone."
                        )
                        assert result.resource_id == vpc["Vpc"]["VpcId"]
                        assert result.resource_tags == [
                            {"Key": "Name", "Value": "vpc_name"}
                        ]
                        assert result.region == AWS_REGION_US_EAST_1
                if not found:
                    assert False

    @mock_aws
    def test_vpc_subnet_same_az(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        # VPC AZ 1
        ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )

        # VPC AZ 2
        ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_different_az.vpc_subnet_different_az.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_different_az.vpc_subnet_different_az import (
                    vpc_subnet_different_az,
                )

                check = vpc_subnet_different_az()
                results = check.execute()

                found = False
                for result in results:
                    if result.resource_id == vpc["Vpc"]["VpcId"]:
                        found = True
                        assert result.status == "FAIL"
                        assert (
                            result.status_extended
                            == f"VPC {vpc['Vpc']['VpcId']} has only subnets in {AWS_REGION_US_EAST_1}a."
                        )
                        assert result.resource_id == vpc["Vpc"]["VpcId"]
                        assert result.resource_tags == []
                        assert result.region == AWS_REGION_US_EAST_1
                if not found:
                    assert False

    @mock_aws
    def test_vpc_no_subnets(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_different_az.vpc_subnet_different_az.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_different_az.vpc_subnet_different_az import (
                    vpc_subnet_different_az,
                )

                check = vpc_subnet_different_az()
                results = check.execute()

                found = False
                for result in results:
                    if result.resource_id == vpc["Vpc"]["VpcId"]:
                        found = True
                        assert result.status == "FAIL"
                        assert (
                            result.status_extended
                            == f"VPC {vpc['Vpc']['VpcId']} has no subnets."
                        )
                        assert result.resource_id == vpc["Vpc"]["VpcId"]
                        assert result.resource_tags == []
                        assert result.region == AWS_REGION_US_EAST_1
                if not found:
                    assert False

    @mock_aws
    def test_vpc_no_subnets_but_unused(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_US_EAST_1], scan_unused_services=False
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_different_az.vpc_subnet_different_az.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_different_az.vpc_subnet_different_az import (
                    vpc_subnet_different_az,
                )

                check = vpc_subnet_different_az()
                results = check.execute()

                assert len(results) == 0
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_no_public_ip_by_default_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_subnet_no_public_ip_by_default/vpc_subnet_no_public_ip_by_default_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_vpc_subnet_no_public_ip_by_default:
    @mock_aws
    def test_vpc_with_map_ip_on_launch(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet_private = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
            TagSpecifications=[
                {
                    "ResourceType": "subnet",
                    "Tags": [
                        {"Key": "Name", "Value": "subnet_name"},
                    ],
                },
            ],
        )

        ec2_client.modify_subnet_attribute(
            SubnetId=subnet_private["Subnet"]["SubnetId"],
            MapPublicIpOnLaunch={"Value": True},
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_no_public_ip_by_default.vpc_subnet_no_public_ip_by_default.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_no_public_ip_by_default.vpc_subnet_no_public_ip_by_default import (
                    vpc_subnet_no_public_ip_by_default,
                )

                check = vpc_subnet_no_public_ip_by_default()
                results = check.execute()

                for result in results:
                    if result.resource_id == subnet_private["Subnet"]["SubnetId"]:
                        assert result.status == "FAIL"
                        assert (
                            result.status_extended
                            == "VPC subnet subnet_name assigns public IP by default."
                        )

    @mock_aws
    def test_vpc_without_map_ip_on_launch(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet_private = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )

        ec2_client.modify_subnet_attribute(
            SubnetId=subnet_private["Subnet"]["SubnetId"],
            MapPublicIpOnLaunch={"Value": False},
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_no_public_ip_by_default.vpc_subnet_no_public_ip_by_default.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_no_public_ip_by_default.vpc_subnet_no_public_ip_by_default import (
                    vpc_subnet_no_public_ip_by_default,
                )

                check = vpc_subnet_no_public_ip_by_default()
                results = check.execute()

                for result in results:
                    if result.resource_id == subnet_private["Subnet"]["SubnetId"]:
                        assert result.status == "PASS"
                        assert (
                            result.status_extended
                            == f"VPC subnet {subnet_private['Subnet']['SubnetId']} does NOT assign public IP by default."
                        )

    @mock_aws
    def test_vpc_with_map_ip_on_launch_but_unused(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet_private = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
            TagSpecifications=[
                {
                    "ResourceType": "subnet",
                    "Tags": [
                        {"Key": "Name", "Value": "subnet_name"},
                    ],
                },
            ],
        )

        ec2_client.modify_subnet_attribute(
            SubnetId=subnet_private["Subnet"]["SubnetId"],
            MapPublicIpOnLaunch={"Value": True},
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_US_EAST_1], scan_unused_services=False
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_no_public_ip_by_default.vpc_subnet_no_public_ip_by_default.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_no_public_ip_by_default.vpc_subnet_no_public_ip_by_default import (
                    vpc_subnet_no_public_ip_by_default,
                )

                check = vpc_subnet_no_public_ip_by_default()
                results = check.execute()

                assert len(results) == 0
```

--------------------------------------------------------------------------------

---[FILE: vpc_subnet_separate_private_public_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_subnet_separate_private_public/vpc_subnet_separate_private_public_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_vpc_subnet_separate_private_public:
    @mock_aws
    def test_vpc_subnet_only_private(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24",
            InstanceTenancy="default",
            TagSpecifications=[
                {
                    "ResourceType": "vpc",
                    "Tags": [
                        {"Key": "Name", "Value": "vpc_name"},
                    ],
                },
            ],
        )
        # VPC Private
        subnet_private = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        route_table_private = ec2_client.create_route_table(
            VpcId=vpc["Vpc"]["VpcId"],
        )
        ec2_client.create_route(
            DestinationCidrBlock="10.10.10.0",
            RouteTableId=route_table_private["RouteTable"]["RouteTableId"],
        )
        ec2_client.associate_route_table(
            RouteTableId=route_table_private["RouteTable"]["RouteTableId"],
            SubnetId=subnet_private["Subnet"]["SubnetId"],
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_separate_private_public.vpc_subnet_separate_private_public.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_separate_private_public.vpc_subnet_separate_private_public import (
                    vpc_subnet_separate_private_public,
                )

                check = vpc_subnet_separate_private_public()
                results = check.execute()

                found = False
                for result in results:
                    if result.resource_id == vpc["Vpc"]["VpcId"]:
                        found = True
                        assert result.status == "FAIL"
                        assert (
                            result.status_extended
                            == "VPC vpc_name has only private subnets."
                        )
                        assert result.resource_id == vpc["Vpc"]["VpcId"]
                        assert result.resource_tags == [
                            {"Key": "Name", "Value": "vpc_name"}
                        ]
                        assert result.region == AWS_REGION_US_EAST_1
                if not found:
                    assert False

    @mock_aws
    def test_vpc_subnet_only_public(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.0.0/18")
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        # Create IGW and attach to VPC
        igw = ec2.create_internet_gateway()
        vpc.attach_internet_gateway(InternetGatewayId=igw.id)
        # Set IGW as default route for public subnet
        route_table = ec2.create_route_table(VpcId=vpc.id)
        route_table.associate_with_subnet(SubnetId=subnet.id)
        ec2_client.create_route(
            RouteTableId=route_table.id,
            DestinationCidrBlock="0.0.0.0/0",
            GatewayId=igw.id,
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_separate_private_public.vpc_subnet_separate_private_public.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_separate_private_public.vpc_subnet_separate_private_public import (
                    vpc_subnet_separate_private_public,
                )

                check = vpc_subnet_separate_private_public()
                results = check.execute()

                found = False
                for result in results:
                    if result.resource_id == vpc.id:
                        found = True
                        assert result.status == "FAIL"
                        assert (
                            result.status_extended
                            == f"VPC {vpc.id} has only public subnets."
                        )
                        assert result.resource_id == vpc.id
                        assert result.resource_tags == []
                        assert result.region == AWS_REGION_US_EAST_1
                if not found:
                    assert False

    @mock_aws
    def test_vpc_subnet_only_public_but_unused(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.0.0/18")
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        # Create IGW and attach to VPC
        igw = ec2.create_internet_gateway()
        vpc.attach_internet_gateway(InternetGatewayId=igw.id)
        # Set IGW as default route for public subnet
        route_table = ec2.create_route_table(VpcId=vpc.id)
        route_table.associate_with_subnet(SubnetId=subnet.id)
        ec2_client.create_route(
            RouteTableId=route_table.id,
            DestinationCidrBlock="0.0.0.0/0",
            GatewayId=igw.id,
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_US_EAST_1], scan_unused_services=False
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_separate_private_public.vpc_subnet_separate_private_public.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_separate_private_public.vpc_subnet_separate_private_public import (
                    vpc_subnet_separate_private_public,
                )

                check = vpc_subnet_separate_private_public()
                results = check.execute()

                assert len(results) == 0

    @mock_aws
    def test_vpc_subnet_private_and_public(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        # VPC Private
        subnet_private = ec2_client.create_subnet(
            VpcId=vpc.id,
            CidrBlock="10.0.0.0/17",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        route_table_private = ec2_client.create_route_table(
            VpcId=vpc.id,
        )
        ec2_client.create_route(
            DestinationCidrBlock="10.10.10.0",
            RouteTableId=route_table_private["RouteTable"]["RouteTableId"],
        )
        ec2_client.associate_route_table(
            RouteTableId=route_table_private["RouteTable"]["RouteTableId"],
            SubnetId=subnet_private["Subnet"]["SubnetId"],
        )
        # VPC Public
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.128.0/17")
        # Create IGW and attach to VPC
        igw = ec2.create_internet_gateway()
        vpc.attach_internet_gateway(InternetGatewayId=igw.id)
        # Set IGW as default route for public subnet
        route_table = ec2.create_route_table(VpcId=vpc.id)
        route_table.associate_with_subnet(SubnetId=subnet.id)
        ec2_client.create_route(
            RouteTableId=route_table.id,
            DestinationCidrBlock="0.0.0.0/0",
            GatewayId=igw.id,
        )

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_subnet_separate_private_public.vpc_subnet_separate_private_public.vpc_client",
                new=VPC(aws_provider),
            ):
                from prowler.providers.aws.services.vpc.vpc_subnet_separate_private_public.vpc_subnet_separate_private_public import (
                    vpc_subnet_separate_private_public,
                )

                check = vpc_subnet_separate_private_public()
                results = check.execute()

                found = False
                for result in results:
                    if result.resource_id == vpc.id:
                        found = True
                        assert result.status == "PASS"
                        assert (
                            result.status_extended
                            == f"VPC {vpc.id} has private and public subnets."
                        )
                        assert result.resource_id == vpc.id
                        assert result.resource_tags == []
                        assert result.region == AWS_REGION_US_EAST_1
                if not found:
                    assert False
```

--------------------------------------------------------------------------------

````
