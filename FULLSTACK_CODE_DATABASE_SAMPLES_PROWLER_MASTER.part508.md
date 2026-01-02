---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 508
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 508 of 867)

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

---[FILE: ec2_instance_older_than_specific_days_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_older_than_specific_days/ec2_instance_older_than_specific_days_test.py

```python
import datetime
from re import search
from unittest import mock

from boto3 import resource
from dateutil.tz import tzutc
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_instance_older_than_specific_days:
    @mock_aws
    def test_ec2_no_instances(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"max_ec2_instance_age_in_days": 180}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_older_than_specific_days.ec2_instance_older_than_specific_days.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_older_than_specific_days.ec2_instance_older_than_specific_days import (
                ec2_instance_older_than_specific_days,
            )

            check = ec2_instance_older_than_specific_days()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_one_compliant_ec2(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="This is some user_data",
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"max_ec2_instance_age_in_days": 180}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_older_than_specific_days.ec2_instance_older_than_specific_days.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_older_than_specific_days.ec2_instance_older_than_specific_days import (
                ec2_instance_older_than_specific_days,
            )

            check = ec2_instance_older_than_specific_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert search(
                f"EC2 Instance {instance.id} is not older", result[0].status_extended
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )

    @mock_aws
    def test_one_old_ec2(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            UserData="This is some user_data",
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"max_ec2_instance_age_in_days": 180}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_older_than_specific_days.ec2_instance_older_than_specific_days.ec2_client",
                new=EC2(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_older_than_specific_days.ec2_instance_older_than_specific_days import (
                ec2_instance_older_than_specific_days,
            )

            service_client.instances[0].launch_time = datetime.datetime(
                2021, 11, 1, 17, 18, tzinfo=tzutc()
            )

            check = ec2_instance_older_than_specific_days()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert search(
                f"EC2 Instance {instance.id} is older", result[0].status_extended
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_paravirtual_type_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_paravirtual_type/ec2_instance_paravirtual_type_test.py

```python
from unittest import mock

from boto3 import resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"
PARAVIRTUAL_AMI_ID = "ami-0efade68705c4bea5"


class Test_ec2_instance_paravirtual_type:
    @mock_aws
    def test_ec2_no_instances(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_paravirtual_type.ec2_instance_paravirtual_type.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_instance_paravirtual_type.ec2_instance_paravirtual_type import (
                ec2_instance_paravirtual_type,
            )

            check = ec2_instance_paravirtual_type()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_one_compliant_ec2(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.0.0/18")
        instance = ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            NetworkInterfaces=[
                {
                    "DeviceIndex": 0,
                    "SubnetId": subnet.id,
                    "AssociatePublicIpAddress": False,
                }
            ],
        )[0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_paravirtual_type.ec2_instance_paravirtual_type.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_paravirtual_type.ec2_instance_paravirtual_type import (
                ec2_instance_paravirtual_type,
            )

            check = ec2_instance_paravirtual_type()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} virtualization type is set to HVM."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )

    @mock_aws
    def test_one_ec2_with_paravirtual_type(self):
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.0.0/18")
        instance = ec2.create_instances(
            ImageId=PARAVIRTUAL_AMI_ID,
            MinCount=1,
            MaxCount=1,
            NetworkInterfaces=[
                {
                    "DeviceIndex": 0,
                    "SubnetId": subnet.id,
                    "AssociatePublicIpAddress": False,
                }
            ],
        )[0]
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_instance_paravirtual_type.ec2_instance_paravirtual_type.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_instance_paravirtual_type.ec2_instance_paravirtual_type import (
                ec2_instance_paravirtual_type,
            )

            check = ec2_instance_paravirtual_type()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == f"EC2 Instance {instance.id} virtualization type is set to paravirtual."
            )
            assert result[0].resource_id == instance.id
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:instance/{instance.id}"
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_instance_port_cassandra_exposed_to_internet_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_instance_port_cassandra_exposed_to_internet/ec2_instance_port_cassandra_exposed_to_internet_fixer_test.py

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


class Test_ec2_instance_port_cassandra_exposed_to_internet_fixer:
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
                    "ToPort": 10000,
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}, {"CidrIp": "10.0.0.0/24"}],
                    "Ipv6Ranges": [{"CidrIpv6": "::/0"}, {"CidrIpv6": "2001:db8::/32"}],
                },
                {
                    "IpProtocol": "tcp",
                    "FromPort": 7000,
                    "ToPort": 9160,
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
                "prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer import (
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
                        "ToPort": 10000,
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
                        "FromPort": 7000,
                        "ToPort": 9160,
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
                    "prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer.ec2_client",
                    new=EC2(aws_provider),
                ),
            ):
                # Test Fixer
                from prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer import (
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
                    "FromPort": 7000,
                    "ToPort": 9160,
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
                "prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer import (
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
                    "FromPort": 7000,
                    "ToPort": 9160,
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
                "prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer import (
                fixer,
            )

            assert fixer(instance_id, AWS_REGION_EU_WEST_1)

    @mock_aws
    def test_ec2_instance_exposed_port_in_public_subnet_all_ports(self):
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
                    "FromPort": 7000,
                    "ToPort": 9160,
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
                "prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Fixer
            from prowler.providers.aws.services.ec2.ec2_instance_port_cassandra_exposed_to_internet.ec2_instance_port_cassandra_exposed_to_internet_fixer import (
                fixer,
            )

            assert fixer(instance.id, AWS_REGION_EU_WEST_1)
```

--------------------------------------------------------------------------------

````
