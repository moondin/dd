---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 510
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 510 of 867)

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

---[FILE: ec2_instance_port_cifs_exposed_to_internet_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_port_cifs_exposed_to_internet/ec2_instance_port_cifs_exposed_to_internet_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_instance_port_cifs_exposed_to_internet:
    @mock_aws
    def test_no_ec2_instances(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet import (
                ec2_instance_port_cifs_exposed_to_internet,
            )

            check = ec2_instance_port_cifs_exposed_to_internet()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_instance_no_port_exposed(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 139,
                    "ToPort": 139,
                    "IpRanges": [{"CidrIp": "123.123.123.123/32"}],
                }
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
        instance_id = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            SubnetId=subnet_id,
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0].id

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet import (
                ec2_instance_port_cifs_exposed_to_internet,
            )

            check = ec2_instance_port_cifs_exposed_to_internet()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Instance {instance_id} does not have CIFS ports open to the Internet."
            )
            assert result[0].resource_id == instance_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance_id}"
            )
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test"}]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].check_metadata.Severity == "critical"

    @mock_aws
    def test_ec2_instance_exposed_port_in_private_subnet(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 139,
                    "ToPort": 139,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
        instance_id = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            SubnetId=subnet_id,
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0].id

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet import (
                ec2_instance_port_cifs_exposed_to_internet,
            )

            check = ec2_instance_port_cifs_exposed_to_internet()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Instance {instance_id} has CIFS exposed to 0.0.0.0/0 but with no public IP address."
            )
            assert result[0].resource_id == instance_id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance_id}"
            )
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test"}]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].check_metadata.Severity == "medium"

    @mock_aws
    def test_ec2_instance_exposed_port_in_public_subnet(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 139,
                    "ToPort": 139,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
        instance = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            NetworkInterfaces=[
                {
                    "DeviceIndex": 0,
                    "SubnetId": subnet_id,
                    "AssociatePublicIpAddress": True,
                }
            ],
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet import (
                ec2_instance_port_cifs_exposed_to_internet,
            )

            check = ec2_instance_port_cifs_exposed_to_internet()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Instance {instance.id} has CIFS exposed to 0.0.0.0/0 on public IP address {instance.public_ip_address} but it is placed in a private subnet {subnet_id}."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test"}]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].check_metadata.Severity == "high"

    @mock_aws
    def test_ec2_instance_exposed_port_with_public_ip_in_public_subnet(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 139,
                    "ToPort": 139,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
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
        instance = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            NetworkInterfaces=[
                {
                    "DeviceIndex": 0,
                    "SubnetId": subnet_id,
                    "AssociatePublicIpAddress": True,
                }
            ],
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_port_cifs_exposed_to_internet.ec2_instance_port_cifs_exposed_to_internet import (
                ec2_instance_port_cifs_exposed_to_internet,
            )

            check = ec2_instance_port_cifs_exposed_to_internet()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Instance {instance.id} has CIFS exposed to 0.0.0.0/0 on public IP address {instance.public_ip_address} in public subnet {subnet_id}."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test"}]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].check_metadata.Severity == "critical"
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_port_elasticsearch_kibana_exposed_to_internet/ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer_test.py

```python
from unittest import mock

import botocore
import botocore.client
from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider

mock_make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_error(self, operation_name, kwarg):
    if operation_name == "RevokeSecurityGroupIngress":
        raise botocore.exceptions.ClientError(
            {
                "Error": {
                    "Code": "InvalidPermission.NotFound",
                    "Message": "The specified rule does not exist in this security group.",
                }
            },
            operation_name,
        )
    return mock_make_api_call(self, operation_name, kwarg)


class Test_ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer:
    @mock_aws
    def test_ec2_instance_exposed_port_in_private_subnet_with_ip4_and_ip6(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 1,
                    "ToPort": 9500,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}, {"CidrIp": "10.0.0.0/24"}],
                    "Ipv6Ranges": [{"CidrIpv6": "::/0"}, {"CidrIpv6": "2001:db8::/32"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 1,
                    "ToPort": 5700,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}, {"CidrIp": "10.0.0.0/24"}],
                    "Ipv6Ranges": [{"CidrIpv6": "::/0"}, {"CidrIpv6": "2001:db8::/32"}],
                },
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
        instance_id = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            SubnetId=subnet_id,
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0].id

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer import (
                fixer,
            )

            assert fixer(instance_id, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_ec2_instance_exposed_port_error(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_error
        ):
            # Create EC2 Mocked Resources
            ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
            ec2_resource = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
            vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
            default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
                "SecurityGroups"
            ][0]
            default_sg_id = default_sg["GroupId"]
            ec2_client.authorize_security_group_ingress(
                GroupId=default_sg_id,
                IpPermissions=[
                    {
                        "IpProtocol": "tcp",
                        "FromPort": 1,
                        "ToPort": 9500,
                        "IpRanges": [
                            {"CidrIp": "0.0.0.0/0"},
                            {"CidrIp": "10.0.0.0/24"},
                        ],
                        "Ipv6Ranges": [
                            {"CidrIpv6": "::/0"},
                            {"CidrIpv6": "2001:db8::/32"},
                        ],
                    },
                    {
                        "IpProtocol": "tcp",
                        "FromPort": 5601,
                        "ToPort": 5601,
                        "IpRanges": [
                            {"CidrIp": "0.0.0.0/0"},
                            {"CidrIp": "10.0.0.0/24"},
                        ],
                        "Ipv6Ranges": [
                            {"CidrIpv6": "::/0"},
                            {"CidrIpv6": "2001:db8::/32"},
                        ],
                    },
                ],
            )
            subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
                "Subnet"
            ]["SubnetId"]
            instance_id = ec2_resource.create_instances(
                ImageId="ami-12345678",
                MinCount=1,
                MaxCount=1,
                InstanceType="t2.micro",
                SecurityGroupIds=[default_sg_id],
                SubnetId=subnet_id,
                TagSpecifications=[
                    {
                        "ResourceType": "instance",
                        "Tags": [{"Key": "Name", "Value": "test"}],
                    }
                ],
            )[0].id

            from prowler.providers.aws.services.ec2.ec2_service import EC2

            aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer.ec2_client",
                    new=EC2(aws_provider),
                ),
            ):
                # Test Fixer
                from prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer import (
                    fixer,
                )

                assert not fixer(instance_id, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_ec2_instance_exposed_port_in_private_subnet_only_with_ip4(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 9200,
                    "ToPort": 9200,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}, {"CidrIp": "10.0.0.0/24"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 5601,
                    "ToPort": 5601,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}, {"CidrIp": "10.0.0.0/24"}],
                },
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
        instance_id = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            SubnetId=subnet_id,
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0].id

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer import (
                fixer,
            )

            assert fixer(instance_id, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_ec2_instance_exposed_port_in_private_subnet_only_with_ip6(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 9200,
                    "ToPort": 9200,
                    "Ipv6Ranges": [{"CidrIpv6": "::/0"}, {"CidrIpv6": "2001:db8::/32"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 5601,
                    "ToPort": 5601,
                    "Ipv6Ranges": [{"CidrIpv6": "::/0"}, {"CidrIpv6": "2001:db8::/32"}],
                },
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
        instance_id = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            SubnetId=subnet_id,
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0].id

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer import (
                fixer,
            )

            assert fixer(instance_id, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_ec2_instance_exposed_port_in_public_subnet_only_9200_9300_port(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 9200,
                    "ToPort": 9300,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
        instance = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            NetworkInterfaces=[
                {
                    "DeviceIndex": 0,
                    "SubnetId": subnet_id,
                    "AssociatePublicIpAddress": True,
                }
            ],
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer import (
                fixer,
            )

            assert fixer(instance.id, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_ec2_instance_exposed_port_with_public_ip_in_public_subnet_only_5601_port(
        self,
    ):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 5601,
                    "ToPort": 5601,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        subnet_id = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/16")[
            "Subnet"
        ]["SubnetId"]
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
        instance = ec2_resource.create_instances(
            ImageId="ami-12345678",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            SecurityGroupIds=[default_sg_id],
            NetworkInterfaces=[
                {
                    "DeviceIndex": 0,
                    "SubnetId": subnet_id,
                    "AssociatePublicIpAddress": True,
                }
            ],
            TagSpecifications=[
                {"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "test"}]}
            ],
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_elasticsearch_kibana_exposed_to_internet.ec2_instance_port_elasticsearch_kibana_exposed_to_internet_fixer import (
                fixer,
            )

            assert fixer(instance.id, AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

````
