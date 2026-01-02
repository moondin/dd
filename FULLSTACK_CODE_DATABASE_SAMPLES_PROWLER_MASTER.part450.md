---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 450
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 450 of 867)

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

---[FILE: autoscaling_group_capacity_rebalance_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/autoscaling/autoscaling_group_capacity_rebalance_enabled/autoscaling_group_capacity_rebalance_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_autoscaling_group_capacity_rebalance_enabled:
    @mock_aws
    def test_no_autoscaling(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.groups = []

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_capacity_rebalance_enabled.autoscaling_group_capacity_rebalance_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_capacity_rebalance_enabled.autoscaling_group_capacity_rebalance_enabled import (
                autoscaling_group_capacity_rebalance_enabled,
            )

            check = autoscaling_group_capacity_rebalance_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_capacity_rebalance_enabled(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        elastic_load_balancer = client("elbv2", region_name=AWS_REGION_US_EAST_1)
        target_group = elastic_load_balancer.create_target_group(
            Name="my-target-group",
            Protocol="HTTP",
            Port=80,
            VpcId=vpc_id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="80",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=30,
            HealthCheckTimeoutSeconds=5,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )

        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a", "us-east-1b"],
            HealthCheckType="ELB",
            CapacityRebalance=True,
            LoadBalancerNames=["my-load-balancer"],
            TargetGroupARNs=[target_group["TargetGroups"][0]["TargetGroupArn"]],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_capacity_rebalance_enabled.autoscaling_group_capacity_rebalance_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_capacity_rebalance_enabled.autoscaling_group_capacity_rebalance_enabled import (
                autoscaling_group_capacity_rebalance_enabled,
            )

            check = autoscaling_group_capacity_rebalance_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} has capacity rebalance enabled."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_arn == autoscaling_group_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_groups_with_capacity_rebalance_disabled(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        elastic_load_balancer = client("elbv2", region_name=AWS_REGION_US_EAST_1)
        target_group = elastic_load_balancer.create_target_group(
            Name="my-target-group",
            Protocol="HTTP",
            Port=80,
            VpcId=vpc_id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="80",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=30,
            HealthCheckTimeoutSeconds=5,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )

        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a"],
            HealthCheckType="EC2",
            LoadBalancerNames=["my-load-balancer"],
            TargetGroupARNs=[target_group["TargetGroups"][0]["TargetGroupArn"]],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_capacity_rebalance_enabled.autoscaling_group_capacity_rebalance_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_capacity_rebalance_enabled.autoscaling_group_capacity_rebalance_enabled import (
                autoscaling_group_capacity_rebalance_enabled,
            )

            check = autoscaling_group_capacity_rebalance_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} does not have capacity rebalance enabled."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_elb_health_check_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/autoscaling/autoscaling_group_elb_health_check_enabled/autoscaling_group_elb_health_check_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_autoscaling_group_elb_health_check_enabled:
    @mock_aws
    def test_no_autoscaling(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.groups = []

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled import (
                autoscaling_group_elb_health_check_enabled,
            )

            check = autoscaling_group_elb_health_check_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_with_elb_enabled(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        elastic_load_balancer = client("elbv2", region_name=AWS_REGION_US_EAST_1)
        target_group = elastic_load_balancer.create_target_group(
            Name="my-target-group",
            Protocol="HTTP",
            Port=80,
            VpcId=vpc_id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="80",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=30,
            HealthCheckTimeoutSeconds=5,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )

        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a", "us-east-1b"],
            HealthCheckType="ELB",
            LoadBalancerNames=["my-load-balancer"],
            TargetGroupARNs=[target_group["TargetGroups"][0]["TargetGroupArn"]],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled import (
                autoscaling_group_elb_health_check_enabled,
            )

            check = autoscaling_group_elb_health_check_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} has ELB health checks enabled."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_arn == autoscaling_group_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_groups_with_ec2_enabled(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        elastic_load_balancer = client("elbv2", region_name=AWS_REGION_US_EAST_1)
        target_group = elastic_load_balancer.create_target_group(
            Name="my-target-group",
            Protocol="HTTP",
            Port=80,
            VpcId=vpc_id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="80",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=30,
            HealthCheckTimeoutSeconds=5,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )

        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a"],
            HealthCheckType="EC2",
            LoadBalancerNames=["my-load-balancer"],
            TargetGroupARNs=[target_group["TargetGroups"][0]["TargetGroupArn"]],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled import (
                autoscaling_group_elb_health_check_enabled,
            )

            check = autoscaling_group_elb_health_check_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} is associated with a load balancer but does not have ELB health checks enabled, instead it has EC2 health checks."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn

    @mock_aws
    def test_groups_with_elb_and_ec2_enabled(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        elastic_load_balancer = client("elbv2", region_name=AWS_REGION_US_EAST_1)
        target_group = elastic_load_balancer.create_target_group(
            Name="my-target-group",
            Protocol="HTTP",
            Port=80,
            VpcId=vpc_id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="80",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=30,
            HealthCheckTimeoutSeconds=5,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )

        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a"],
            HealthCheckType="EC2,ELB",
            LoadBalancerNames=["my-load-balancer"],
            TargetGroupARNs=[target_group["TargetGroups"][0]["TargetGroupArn"]],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled import (
                autoscaling_group_elb_health_check_enabled,
            )

            check = autoscaling_group_elb_health_check_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} has ELB health checks enabled."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn

    @mock_aws
    def test_groups_without_load_balancer_names(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )

        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        elastic_load_balancer = client("elbv2", region_name=AWS_REGION_US_EAST_1)
        target_group = elastic_load_balancer.create_target_group(
            Name="my-target-group",
            Protocol="HTTP",
            Port=80,
            VpcId=vpc_id,
            HealthCheckProtocol="HTTP",
            HealthCheckPort="80",
            HealthCheckPath="/",
            HealthCheckIntervalSeconds=30,
            HealthCheckTimeoutSeconds=5,
            HealthyThresholdCount=5,
            UnhealthyThresholdCount=2,
            Matcher={"HttpCode": "200"},
        )

        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a"],
            HealthCheckType="EC2,ELB",
            TargetGroupARNs=[target_group["TargetGroups"][0]["TargetGroupArn"]],
        )

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled import (
                autoscaling_group_elb_health_check_enabled,
            )

            check = autoscaling_group_elb_health_check_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_without_target_groups(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )

        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a"],
            HealthCheckType="EC2,ELB",
            LoadBalancerNames=["my-load-balancer"],
        )

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled import (
                autoscaling_group_elb_health_check_enabled,
            )

            check = autoscaling_group_elb_health_check_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_without_target_groups_and_load_balancer_names(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )

        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a"],
            HealthCheckType="EC2,ELB",
        )

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_elb_health_check_enabled.autoscaling_group_elb_health_check_enabled import (
                autoscaling_group_elb_health_check_enabled,
            )

            check = autoscaling_group_elb_health_check_enabled()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_launch_configuration_no_public_ip_test.py]---
Location: prowler-master/tests/providers/aws/services/autoscaling/autoscaling_group_launch_configuration_no_public_ip/autoscaling_group_launch_configuration_no_public_ip_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_autoscaling_group_launch_configuration_no_public_ip:
    @mock_aws
    def test_no_autoscaling(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.groups = []

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_no_public_ip.autoscaling_group_launch_configuration_no_public_ip.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_no_public_ip.autoscaling_group_launch_configuration_no_public_ip import (
                autoscaling_group_launch_configuration_no_public_ip,
            )

            check = autoscaling_group_launch_configuration_no_public_ip()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_with_launch_configuration_public_ip(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
            AssociatePublicIpAddress=True,
        )
        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a", "us-east-1b"],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_no_public_ip.autoscaling_group_launch_configuration_no_public_ip.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_no_public_ip.autoscaling_group_launch_configuration_no_public_ip import (
                autoscaling_group_launch_configuration_no_public_ip,
            )

            check = autoscaling_group_launch_configuration_no_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} has an associated launch configuration assigning a public IP address."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_arn == autoscaling_group_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_groups_with_launch_configuration_not_public_ip(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
            AssociatePublicIpAddress=False,
        )
        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a"],
        )

        autoscaling_group_arn = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_no_public_ip.autoscaling_group_launch_configuration_no_public_ip.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_no_public_ip.autoscaling_group_launch_configuration_no_public_ip import (
                autoscaling_group_launch_configuration_no_public_ip,
            )

            check = autoscaling_group_launch_configuration_no_public_ip()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} does not have an associated launch configuration assigning a public IP address."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn

    @mock_aws
    def test_groups_without_launch_configuration(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_launch_template(
            LaunchTemplateName="test",
            LaunchTemplateData={
                "ImageId": "ami-12c6146b",
                "InstanceType": "t1.micro",
                "KeyName": "the_keys",
                "SecurityGroups": ["default", "default2"],
            },
        )
        autoscaling_group_name = "my-autoscaling-group"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName=autoscaling_group_name,
            LaunchTemplate={"LaunchTemplateName": "test", "Version": "$Latest"},
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a", "us-east-1b"],
        )

        from prowler.providers.aws.services.autoscaling.autoscaling_service import (
            AutoScaling,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_no_public_ip.autoscaling_group_launch_configuration_no_public_ip.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_no_public_ip.autoscaling_group_launch_configuration_no_public_ip import (
                autoscaling_group_launch_configuration_no_public_ip,
            )

            check = autoscaling_group_launch_configuration_no_public_ip()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
