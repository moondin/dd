---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 639
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 639 of 867)

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

---[FILE: vpc_endpoint_multi_az_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_endpoint_multi_az_enabled/vpc_endpoint_multi_az_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_vpc_endpoint_for_multi_az:
    @mock_aws
    def test_vpc_no_endpoints(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_multi_az_enabled.vpc_endpoint_multi_az_enabled.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_multi_az_enabled.vpc_endpoint_multi_az_enabled import (
                    vpc_endpoint_multi_az_enabled,
                )

                check = vpc_endpoint_multi_az_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_vpc_no_multi_az_endpoint(self):
        # Create VPC Mocked Resources
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
        )["Vpc"]
        # VPC AZ 1
        subnet_one = ec2_client.create_subnet(
            VpcId=vpc["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )["Subnet"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.vpce.us-east-1.ssmmessages",
            RouteTableIds=[route_table["RouteTableId"]],
            SubnetIds=[subnet_one["SubnetId"]],
            VpcEndpointType="Interface",
        )["VpcEndpoint"]
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_multi_az_enabled.vpc_endpoint_multi_az_enabled.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_multi_az_enabled.vpc_endpoint_multi_az_enabled import (
                    vpc_endpoint_multi_az_enabled,
                )

                check = vpc_endpoint_multi_az_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpointId']} in VPC {vpc['VpcId']} does not have subnets in different AZs."
                )
                assert (
                    result[0].resource_arn
                    == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:123456789012:vpc-endpoint/{vpc_endpoint['VpcEndpointId']}"
                )

    @mock_aws
    def test_vpc_endpoint_multi_az_enabled(self):
        # Create VPC Mocked Resources
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
        )["Vpc"]
        # VPC AZ 1
        subnet_one = ec2_client.create_subnet(
            VpcId=vpc["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )["Subnet"]

        # VPC AZ 2
        subnet_two = ec2_client.create_subnet(
            VpcId=vpc["VpcId"],
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}b",
        )["Subnet"]

        route_table = ec2_client.create_route_table(VpcId=vpc["VpcId"])["RouteTable"]
        vpc_endpoint = ec2_client.create_vpc_endpoint(
            VpcId=vpc["VpcId"],
            ServiceName="com.amazonaws.vpce.us-east-1.ssmmessages",
            RouteTableIds=[route_table["RouteTableId"]],
            SubnetIds=[subnet_one["SubnetId"], subnet_two["SubnetId"]],
            VpcEndpointType="Interface",
        )["VpcEndpoint"]

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_multi_az_enabled.vpc_endpoint_multi_az_enabled.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_multi_az_enabled.vpc_endpoint_multi_az_enabled import (
                    vpc_endpoint_multi_az_enabled,
                )

                check = vpc_endpoint_multi_az_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint {vpc_endpoint['VpcEndpointId']} in VPC {vpc['VpcId']} has subnets in different AZs."
                )
                assert (
                    result[0].resource_arn
                    == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:123456789012:vpc-endpoint/{vpc_endpoint['VpcEndpointId']}"
                )
```

--------------------------------------------------------------------------------

---[FILE: vpc_endpoint_services_allowed_principals_trust_boundaries_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_endpoint_services_allowed_principals_trust_boundaries/vpc_endpoint_services_allowed_principals_trust_boundaries_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

AWS_ACCOUNT_ARN = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
AWS_ACCOUNT_NUMBER_2 = "111122223333"
AWS_ACCOUNT_ARN_2 = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER_2}:root"


class Test_vpc_endpoint_services_allowed_principals_trust_boundaries:
    @mock_aws
    def test_no_vpc_endpoint_services(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries import (
                    vpc_endpoint_services_allowed_principals_trust_boundaries,
                )

                check = vpc_endpoint_services_allowed_principals_trust_boundaries()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_vpc_endpoint_service_without_allowed_principals(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        elbv2_client = client("elbv2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        lb_name = "lb_vpce-test"
        lb_arn = elbv2_client.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet["Subnet"]["SubnetId"]],
            Scheme="internal",
            Type="network",
        )["LoadBalancers"][0]["LoadBalancerArn"]

        endpoint_id = ec2_client.create_vpc_endpoint_service_configuration(
            NetworkLoadBalancerArns=[lb_arn]
        )["ServiceConfiguration"]["ServiceId"]

        endpoint_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:vpc-endpoint-service/{endpoint_id}"

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries import (
                    vpc_endpoint_services_allowed_principals_trust_boundaries,
                )

                check = vpc_endpoint_services_allowed_principals_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"VPC Endpoint Service {endpoint_id} has no allowed principals."
                )
                assert result[0].resource_id == endpoint_id
                assert result[0].resource_arn == endpoint_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_service_with_allowed_principal_account_arn(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        elbv2_client = client("elbv2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        lb_name = "lb_vpce-test"
        lb_arn = elbv2_client.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet["Subnet"]["SubnetId"]],
            Scheme="internal",
            Type="network",
        )["LoadBalancers"][0]["LoadBalancerArn"]

        endpoint_id = ec2_client.create_vpc_endpoint_service_configuration(
            NetworkLoadBalancerArns=[lb_arn]
        )["ServiceConfiguration"]["ServiceId"]

        # Add allowed principals
        ec2_client.modify_vpc_endpoint_service_permissions(
            ServiceId=endpoint_id, AddAllowedPrincipals=[AWS_ACCOUNT_ARN]
        )

        endpoint_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:vpc-endpoint-service/{endpoint_id}"

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries import (
                    vpc_endpoint_services_allowed_principals_trust_boundaries,
                )

                check = vpc_endpoint_services_allowed_principals_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Found trusted account {AWS_ACCOUNT_NUMBER} in VPC Endpoint Service {endpoint_id}."
                )
                assert result[0].resource_id == endpoint_id
                assert result[0].resource_arn == endpoint_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_service_with_allowed_principal_account_number(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        elbv2_client = client("elbv2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        lb_name = "lb_vpce-test"
        lb_arn = elbv2_client.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet["Subnet"]["SubnetId"]],
            Scheme="internal",
            Type="network",
        )["LoadBalancers"][0]["LoadBalancerArn"]

        endpoint_id = ec2_client.create_vpc_endpoint_service_configuration(
            NetworkLoadBalancerArns=[lb_arn]
        )["ServiceConfiguration"]["ServiceId"]

        # Add allowed principals
        ec2_client.modify_vpc_endpoint_service_permissions(
            ServiceId=endpoint_id, AddAllowedPrincipals=[AWS_ACCOUNT_NUMBER]
        )

        endpoint_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:vpc-endpoint-service/{endpoint_id}"

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries import (
                    vpc_endpoint_services_allowed_principals_trust_boundaries,
                )

                check = vpc_endpoint_services_allowed_principals_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Found trusted account {AWS_ACCOUNT_NUMBER} in VPC Endpoint Service {endpoint_id}."
                )
                assert result[0].resource_id == endpoint_id
                assert result[0].resource_arn == endpoint_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_service_with_principal_not_allowed(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        elbv2_client = client("elbv2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        lb_name = "lb_vpce-test"
        lb_arn = elbv2_client.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet["Subnet"]["SubnetId"]],
            Scheme="internal",
            Type="network",
        )["LoadBalancers"][0]["LoadBalancerArn"]

        endpoint_id = ec2_client.create_vpc_endpoint_service_configuration(
            NetworkLoadBalancerArns=[lb_arn]
        )["ServiceConfiguration"]["ServiceId"]

        # Add allowed principals
        ec2_client.modify_vpc_endpoint_service_permissions(
            ServiceId=endpoint_id, AddAllowedPrincipals=[AWS_ACCOUNT_NUMBER_2]
        )

        endpoint_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:vpc-endpoint-service/{endpoint_id}"

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": []}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries import (
                    vpc_endpoint_services_allowed_principals_trust_boundaries,
                )

                check = vpc_endpoint_services_allowed_principals_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Found untrusted account {AWS_ACCOUNT_NUMBER_2} in VPC Endpoint Service {endpoint_id}."
                )
                assert result[0].resource_id == endpoint_id
                assert result[0].resource_arn == endpoint_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_service_with_principal_different_than_account_but_allowed_in_config(
        self,
    ):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        elbv2_client = client("elbv2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        lb_name = "lb_vpce-test"
        lb_arn = elbv2_client.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet["Subnet"]["SubnetId"]],
            Scheme="internal",
            Type="network",
        )["LoadBalancers"][0]["LoadBalancerArn"]

        endpoint_id = ec2_client.create_vpc_endpoint_service_configuration(
            NetworkLoadBalancerArns=[lb_arn]
        )["ServiceConfiguration"]["ServiceId"]

        # Add allowed principals
        ec2_client.modify_vpc_endpoint_service_permissions(
            ServiceId=endpoint_id, AddAllowedPrincipals=[AWS_ACCOUNT_NUMBER_2]
        )

        endpoint_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:vpc-endpoint-service/{endpoint_id}"

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])
        # Set config variable
        aws_provider._audit_config = {"trusted_account_ids": [AWS_ACCOUNT_NUMBER_2]}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries import (
                    vpc_endpoint_services_allowed_principals_trust_boundaries,
                )

                check = vpc_endpoint_services_allowed_principals_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Found trusted account {AWS_ACCOUNT_NUMBER_2} in VPC Endpoint Service {endpoint_id}."
                )
                assert result[0].resource_id == endpoint_id
                assert result[0].resource_arn == endpoint_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_vpc_endpoint_service_with_principal_wildcard(self):
        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        elbv2_client = client("elbv2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(
            CidrBlock="172.28.7.0/24", InstanceTenancy="default"
        )
        subnet = ec2_client.create_subnet(
            VpcId=vpc["Vpc"]["VpcId"],
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_US_EAST_1}a",
        )
        lb_name = "lb_vpce-test"
        lb_arn = elbv2_client.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet["Subnet"]["SubnetId"]],
            Scheme="internal",
            Type="network",
        )["LoadBalancers"][0]["LoadBalancerArn"]

        endpoint_id = ec2_client.create_vpc_endpoint_service_configuration(
            NetworkLoadBalancerArns=[lb_arn]
        )["ServiceConfiguration"]["ServiceId"]

        # Add allowed principals
        ec2_client.modify_vpc_endpoint_service_permissions(
            ServiceId=endpoint_id, AddAllowedPrincipals=["*"]
        )

        endpoint_arn = f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:vpc-endpoint-service/{endpoint_id}"

        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(audited_regions=[AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_client",
                new=VPC(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.vpc.vpc_endpoint_services_allowed_principals_trust_boundaries.vpc_endpoint_services_allowed_principals_trust_boundaries import (
                    vpc_endpoint_services_allowed_principals_trust_boundaries,
                )

                check = vpc_endpoint_services_allowed_principals_trust_boundaries()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Wildcard principal found in VPC Endpoint Service {endpoint_id}."
                )
                assert result[0].resource_id == endpoint_id
                assert result[0].resource_arn == endpoint_arn
                assert result[0].resource_tags == []
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: vpc_flow_logs_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/vpc/vpc_flow_logs_enabled/vpc_flow_logs_enabled_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_vpc_flow_logs_enabled:
    @mock_aws
    def test_vpc_only_default_vpcs(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled import (
                vpc_flow_logs_enabled,
            )

            check = vpc_flow_logs_enabled()
            result = check.execute()

            assert len(result) == 2  # Number of AWS regions, one default VPC per region

    @mock_aws
    def test_vpc_with_flow_logs(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(
            CidrBlock="10.0.0.0/16",
            TagSpecifications=[
                {
                    "ResourceType": "vpc",
                    "Tags": [
                        {"Key": "Name", "Value": "vpc_name"},
                    ],
                },
            ],
        )["Vpc"]

        ec2_client.create_flow_logs(
            ResourceType="VPC",
            ResourceIds=[vpc["VpcId"]],
            TrafficType="ALL",
            LogDestinationType="cloud-watch-logs",
            LogGroupName="test_logs",
            DeliverLogsPermissionArn="arn:aws:iam::"
            + AWS_ACCOUNT_NUMBER
            + ":role/test-role",
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled import (
                vpc_flow_logs_enabled,
            )

            check = vpc_flow_logs_enabled()
            result = check.execute()

            # Search created VPC among default ones
            for result in result:
                if result.resource_id == vpc["VpcId"]:
                    assert result.status == "PASS"
                    assert (
                        result.status_extended == "VPC vpc_name Flow logs are enabled."
                    )
                    assert result.resource_id == vpc["VpcId"]

    @mock_aws
    def test_vpc_without_flow_logs(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled import (
                vpc_flow_logs_enabled,
            )

            check = vpc_flow_logs_enabled()
            result = check.execute()

            # Search created VPC among default ones
            for result in result:
                if result.resource_id == vpc["VpcId"]:
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"VPC {vpc['VpcId']} Flow logs are disabled."
                    )
                    assert result.resource_id == vpc["VpcId"]

    @mock_aws
    def test_vpc_without_flow_logs_ignoring(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        # Create VPC Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        aws_provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled import (
                vpc_flow_logs_enabled,
            )

            check = vpc_flow_logs_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_vpc_without_flow_logs_ignoring_in_use(self):
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        # Create VPC Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)

        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")
        subnet = ec2.create_subnet(VpcId=vpc.id, CidrBlock="10.0.0.0/18")
        ec2.create_network_interface(SubnetId=subnet.id)
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1, AWS_REGION_EU_WEST_1]
        )
        aws_provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.vpc.vpc_flow_logs_enabled.vpc_flow_logs_enabled import (
                vpc_flow_logs_enabled,
            )

            check = vpc_flow_logs_enabled()
            result = check.execute()

            # Search created VPC among default ones
            for result in result:
                if result.resource_id == vpc.id:
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"VPC {vpc.id} Flow logs are disabled."
                    )
                    assert result.resource_id == vpc.id
```

--------------------------------------------------------------------------------

````
