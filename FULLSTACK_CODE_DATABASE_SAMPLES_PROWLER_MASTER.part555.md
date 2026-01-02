---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 555
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 555 of 867)

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

---[FILE: elbv2_internet_facing_test.py]---
Location: prowler-master/tests/providers/aws/services/elbv2/elbv2_internet_facing/elbv2_internet_facing_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_elbv2_internet_facing:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing import (
                elbv2_internet_facing,
            )

            check = elbv2_internet_facing()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elbv2_private(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="application",
        )["LoadBalancers"][0]

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing import (
                elbv2_internet_facing,
            )

            check = elbv2_internet_facing()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "ELBv2 ALB my-lb is not internet facing."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]

    @mock_aws
    def test_elbv2_internet_facing(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internet-facing",
        )["LoadBalancers"][0]

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing import (
                elbv2_internet_facing,
            )

            check = elbv2_internet_facing()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                f"ELBv2 ALB my-lb has an internet facing scheme with domain {lb['DNSName']} but is not public."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]

    @mock_aws
    def test_elbv2_public_sg(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)

        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]

        default_sg_id = default_sg["GroupId"]

        # Authorize ingress rule
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                }
            ],
        )
        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[default_sg_id],
            Scheme="internet-facing",
        )["LoadBalancers"][0]

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing.elbv2_client",
                new=ELBv2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_internet_facing.elbv2_internet_facing import (
                elbv2_internet_facing,
            )

            check = elbv2_internet_facing()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                f"ELBv2 ALB my-lb is internet facing with domain {lb['DNSName']} due to their security group {default_sg_id} is public."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]
```

--------------------------------------------------------------------------------

---[FILE: elbv2_is_in_multiple_az_test.py]---
Location: prowler-master/tests/providers/aws/services/elbv2/elbv2_is_in_multiple_az/elbv2_is_in_multiple_az_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    set_mocked_aws_provider,
)


class Test_elbv2_is_in_multiple_az:
    @mock_aws
    def test_no_elbs(self):
        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_is_in_multiple_az.elbv2_is_in_multiple_az.elbv2_client",
                new=ELBv2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elbv2.elbv2_is_in_multiple_az.elbv2_is_in_multiple_az import (
                elbv2_is_in_multiple_az,
            )

            check = elbv2_is_in_multiple_az()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elbv2_in_one_avaibility_zone(self):
        # Create VPC, Subnets and Security Group
        elbv2_client = client("elbv2", region_name=AWS_REGION_EU_WEST_1)

        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )

        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")

        subnet1 = ec2.create_subnet(
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
            CidrBlock="10.0.1.0/24",
            VpcId=vpc.id,
        )

        lb_arn = elbv2_client.create_load_balancer(
            Name="test_elbv2",
            Subnets=[subnet1.id],
            SecurityGroups=[security_group.id],
        )["LoadBalancers"][0]["LoadBalancerArn"]

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_is_in_multiple_az.elbv2_is_in_multiple_az.elbv2_client",
                new=ELBv2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_is_in_multiple_az.elbv2_is_in_multiple_az import (
                elbv2_is_in_multiple_az,
            )

            check = elbv2_is_in_multiple_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ELBv2 test_elbv2 is not in at least 2 AZs. Is only in {AWS_REGION_EU_WEST_1_AZA}."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "test_elbv2"
            assert result[0].resource_arn == lb_arn
            assert result[0].resource_tags == []

    @mock_aws
    def test_elbv2_in_two_avaibility_zones(self):
        # Create VPC, Subnets and Security Group
        elbv2_client = client("elbv2", region_name=AWS_REGION_EU_WEST_1)

        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )

        vpc = ec2.create_vpc(CidrBlock="10.0.0.0/16")

        subnet1 = ec2.create_subnet(
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
            CidrBlock="10.0.1.0/24",
            VpcId=vpc.id,
        )

        subnet2 = ec2.create_subnet(
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
            CidrBlock="10.0.2.0/24",
            VpcId=vpc.id,
        )

        lb_arn = elbv2_client.create_load_balancer(
            Name="test_elbv2",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
        )["LoadBalancers"][0]["LoadBalancerArn"]

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_is_in_multiple_az.elbv2_is_in_multiple_az.elbv2_client",
                new=ELBv2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_is_in_multiple_az.elbv2_is_in_multiple_az import (
                elbv2_is_in_multiple_az,
            )

            check = elbv2_is_in_multiple_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ELBv2 test_elbv2 is at least in 2 AZs: {AWS_REGION_EU_WEST_1_AZA}, {AWS_REGION_EU_WEST_1_AZB}."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "test_elbv2"
            assert result[0].resource_arn == lb_arn
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: elbv2_listeners_underneath_test.py]---
Location: prowler-master/tests/providers/aws/services/elbv2/elbv2_listeners_underneath/elbv2_listeners_underneath_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_elbv2_listeners_underneath:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_listeners_underneath.elbv2_listeners_underneath.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elbv2.elbv2_listeners_underneath.elbv2_listeners_underneath import (
                elbv2_listeners_underneath,
            )

            check = elbv2_listeners_underneath()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elbv2_without_listeners(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="application",
        )["LoadBalancers"][0]

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_listeners_underneath.elbv2_listeners_underneath.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_listeners_underneath.elbv2_listeners_underneath import (
                elbv2_listeners_underneath,
            )

            check = elbv2_listeners_underneath()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == "ELBv2 my-lb has no listeners underneath."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]

    @mock_aws
    def test_elbv2_with_listeners(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]

        response = conn.create_target_group(
            Name="a-target",
            Protocol="HTTP",
            Port=8080,
            VpcId=vpc.id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="8080",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=5,
            HealthCheckTimeoutSeconds=3,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )
        target_group = response.get("TargetGroups")[0]
        target_group_arn = target_group["TargetGroupArn"]
        response = conn.create_listener(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Protocol="HTTP",
            Port=80,
            DefaultActions=[{"Type": "forward", "TargetGroupArn": target_group_arn}],
        )

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_listeners_underneath.elbv2_listeners_underneath.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_listeners_underneath.elbv2_listeners_underneath import (
                elbv2_listeners_underneath,
            )

            check = elbv2_listeners_underneath()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "ELBv2 my-lb has listeners underneath."
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]
```

--------------------------------------------------------------------------------

---[FILE: elbv2_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elbv2/elbv2_logging_enabled/elbv2_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_elbv2_logging_enabled:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_logging_enabled.elbv2_logging_enabled.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elbv2.elbv2_logging_enabled.elbv2_logging_enabled import (
                elbv2_logging_enabled,
            )

            check = elbv2_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elbv2_without_logging_enabled(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="application",
        )["LoadBalancers"][0]

        conn.modify_load_balancer_attributes(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Attributes=[
                {
                    "Key": "access_logs.s3.enabled",
                    "Value": "false",
                },
            ],
        )

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_logging_enabled.elbv2_logging_enabled.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_logging_enabled.elbv2_logging_enabled import (
                elbv2_logging_enabled,
            )

            check = elbv2_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELBv2 ALB my-lb does not have access logs configured."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]

    @mock_aws
    def test_elbv2_with_logging_enabled(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
        )["LoadBalancers"][0]

        conn.modify_load_balancer_attributes(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Attributes=[
                {
                    "Key": "access_logs.s3.enabled",
                    "Value": "true",
                },
            ],
        )

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_logging_enabled.elbv2_logging_enabled.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_logging_enabled.elbv2_logging_enabled import (
                elbv2_logging_enabled,
            )

            check = elbv2_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELBv2 ALB my-lb has access logs to S3 configured."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]
```

--------------------------------------------------------------------------------

---[FILE: elbv2_nlb_tls_termination_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elbv2/elbv2_nlb_tls_termination_enabled/elbv2_nlb_tls_termination_enabled_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_elbv2_nlb_listener_security:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_nlb_tls_termination_enabled.elbv2_nlb_tls_termination_enabled.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elbv2.elbv2_nlb_tls_termination_enabled.elbv2_nlb_tls_termination_enabled import (
                elbv2_nlb_tls_termination_enabled,
            )

            check = elbv2_nlb_tls_termination_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elbv2_without_tls_listener(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="network",
        )["LoadBalancers"][0]

        response = conn.create_target_group(
            Name="a-target",
            Protocol="HTTP",
            Port=8080,
            VpcId=vpc.id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="8080",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=5,
            HealthCheckTimeoutSeconds=3,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )
        target_group = response.get("TargetGroups")[0]
        target_group_arn = target_group["TargetGroupArn"]
        response = conn.create_listener(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Protocol="TCP",
            Port=443,
            DefaultActions=[{"Type": "forward", "TargetGroupArn": target_group_arn}],
        )

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_nlb_tls_termination_enabled.elbv2_nlb_tls_termination_enabled.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_nlb_tls_termination_enabled.elbv2_nlb_tls_termination_enabled import (
                elbv2_nlb_tls_termination_enabled,
            )

            check = elbv2_nlb_tls_termination_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELBv2 NLB my-lb is not configured to terminate TLS connections."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]

    @mock_aws
    def test_elbv2_with_tls_listener(self):
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZA,
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=AWS_REGION_EU_WEST_1_AZB,
        )

        lb = conn.create_load_balancer(
            Name="my-lb",
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="network",
        )["LoadBalancers"][0]

        response = conn.create_target_group(
            Name="a-target",
            Protocol="HTTP",
            Port=8080,
            VpcId=vpc.id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="8080",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=5,
            HealthCheckTimeoutSeconds=3,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )
        target_group = response.get("TargetGroups")[0]
        target_group_arn = target_group["TargetGroupArn"]
        response = conn.create_listener(
            LoadBalancerArn=lb["LoadBalancerArn"],
            Protocol="TLS",
            Port=443,
            DefaultActions=[{"Type": "forward", "TargetGroupArn": target_group_arn}],
        )

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elbv2.elbv2_nlb_tls_termination_enabled.elbv2_nlb_tls_termination_enabled.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elbv2.elbv2_nlb_tls_termination_enabled.elbv2_nlb_tls_termination_enabled import (
                elbv2_nlb_tls_termination_enabled,
            )

            check = elbv2_nlb_tls_termination_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELBv2 NLB my-lb is configured to terminate TLS connections."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == lb["LoadBalancerArn"]
```

--------------------------------------------------------------------------------

````
