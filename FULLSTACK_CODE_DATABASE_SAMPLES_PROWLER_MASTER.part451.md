---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 451
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 451 of 867)

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

---[FILE: autoscaling_group_launch_configuration_requires_imdsv2_test.py]---
Location: prowler-master/tests/providers/aws/services/autoscaling/autoscaling_group_launch_configuration_requires_imdsv2/autoscaling_group_launch_configuration_requires_imdsv2_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_autoscaling_group_launch_configuration_requires_imdsv2:
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_group_launch_configuration_requires_imdsv2 import (
                autoscaling_group_launch_configuration_requires_imdsv2,
            )

            check = autoscaling_group_launch_configuration_requires_imdsv2()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_with_imdsv2_enabled_and_required(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
            MetadataOptions={
                "HttpTokens": "required",
                "HttpPutResponseHopLimit": 123,
                "HttpEndpoint": "enabled",
            },
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_group_launch_configuration_requires_imdsv2 import (
                autoscaling_group_launch_configuration_requires_imdsv2,
            )

            check = autoscaling_group_launch_configuration_requires_imdsv2()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} has IMDSv2 enabled and required."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_arn == autoscaling_group_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_group_launch_configuration_requires_imdsv2 import (
                autoscaling_group_launch_configuration_requires_imdsv2,
            )

            check = autoscaling_group_launch_configuration_requires_imdsv2()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_with_imdsv2_disabled(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
            MetadataOptions={
                "HttpTokens": "required",
                "HttpPutResponseHopLimit": 123,
                "HttpEndpoint": "disabled",
            },
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_launch_configuration_requires_imdsv2.autoscaling_group_launch_configuration_requires_imdsv2 import (
                autoscaling_group_launch_configuration_requires_imdsv2,
            )

            check = autoscaling_group_launch_configuration_requires_imdsv2()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} has metadata service disabled."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_multiple_az_test.py]---
Location: prowler-master/tests/providers/aws/services/autoscaling/autoscaling_group_multiple_az/autoscaling_group_multiple_az_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_autoscaling_group_multiple_az:
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_az.autoscaling_group_multiple_az.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_az.autoscaling_group_multiple_az import (
                autoscaling_group_multiple_az,
            )

            check = autoscaling_group_multiple_az()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_with_multi_az(self):
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_az.autoscaling_group_multiple_az.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_az.autoscaling_group_multiple_az import (
                autoscaling_group_multiple_az,
            )

            check = autoscaling_group_multiple_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} has multiple availability zones."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_arn == autoscaling_group_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_groups_with_single_az(self):
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_az.autoscaling_group_multiple_az.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_az.autoscaling_group_multiple_az import (
                autoscaling_group_multiple_az,
            )

            check = autoscaling_group_multiple_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} has only one availability zones."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn

    @mock_aws
    def test_groups_witd_and_without(self):
        autoscaling_client = client("autoscaling", region_name=AWS_REGION_US_EAST_1)
        autoscaling_client.create_launch_configuration(
            LaunchConfigurationName="test",
            ImageId="ami-12c6146b",
            InstanceType="t1.micro",
            KeyName="the_keys",
            SecurityGroups=["default", "default2"],
        )
        autoscaling_group_name_1 = "asg-multiple"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName="asg-multiple",
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a", "us-east-1b"],
        )
        autoscaling_group_arn_1 = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name_1]
        )["AutoScalingGroups"][0]["AutoScalingGroupARN"]

        autoscaling_group_name_2 = "asg-single"
        autoscaling_client.create_auto_scaling_group(
            AutoScalingGroupName="asg-single",
            LaunchConfigurationName="test",
            MinSize=0,
            MaxSize=0,
            DesiredCapacity=0,
            AvailabilityZones=["us-east-1a"],
        )
        autoscaling_group_arn_2 = autoscaling_client.describe_auto_scaling_groups(
            AutoScalingGroupNames=[autoscaling_group_name_2]
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_az.autoscaling_group_multiple_az.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_az.autoscaling_group_multiple_az import (
                autoscaling_group_multiple_az,
            )

            check = autoscaling_group_multiple_az()
            result = check.execute()

            assert len(result) == 2
            for check in result:
                if check.resource_id == autoscaling_group_name_1:
                    assert check.status == "PASS"
                    assert (
                        check.status_extended
                        == f"Autoscaling group {autoscaling_group_name_1} has multiple availability zones."
                    )
                    assert check.resource_arn == autoscaling_group_arn_1
                    assert check.resource_tags == []
                    assert check.region == AWS_REGION_US_EAST_1
                if check.resource_id == autoscaling_group_name_2:
                    assert check.status == "FAIL"
                    assert (
                        check.status_extended
                        == f"Autoscaling group {autoscaling_group_name_2} has only one availability zones."
                    )
                    assert check.resource_tags == []
                    assert check.resource_arn == autoscaling_group_arn_2
                    assert check.region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: autoscaling_group_multiple_instance_types_test.py]---
Location: prowler-master/tests/providers/aws/services/autoscaling/autoscaling_group_multiple_instance_types/autoscaling_group_multiple_instance_types_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_multi_az(self, operation_name, kwarg):
    if operation_name == "DescribeAutoScalingGroups":
        return {
            "AutoScalingGroups": [
                {
                    "AutoScalingGroupName": "my-autoscaling-group",
                    "AutoScalingGroupARN": "arn:aws:autoscaling:us-east-1:123456789012:autoScalingGroup:uuid:autoScalingGroupName/my-autoscaling-group",
                    "AvailabilityZones": ["us-east-1a", "us-east-1b"],
                    "Tags": [],
                    "Instances": [
                        {
                            "InstanceId": "i-0b9f1f3a0e1e3e0f4",
                            "InstanceType": "t2.micro",
                            "AvailabilityZone": "us-east-1a",
                        },
                        {
                            "InstanceId": "i-0b9f1f3a0e1e3e0f5",
                            "InstanceType": "t3.large",
                            "AvailabilityZone": "us-east-1b",
                        },
                    ],
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_single_az(self, operation_name, kwarg):
    if operation_name == "DescribeAutoScalingGroups":
        return {
            "AutoScalingGroups": [
                {
                    "AutoScalingGroupName": "my-autoscaling-group",
                    "AutoScalingGroupARN": "arn:aws:autoscaling:us-east-1:123456789012:autoScalingGroup:uuid:autoScalingGroupName/my-autoscaling-group",
                    "AvailabilityZones": ["us-east-1a"],
                    "Tags": [],
                    "Instances": [
                        {
                            "InstanceId": "i-0b9f1f3a0e1e3e0f4",
                            "InstanceType": "t2.micro",
                            "AvailabilityZone": "us-east-1a",
                        },
                        {
                            "InstanceId": "i-0b9f1f3a0e1e3e0f5",
                            "InstanceType": "t3.large",
                            "AvailabilityZone": "us-east-1a",
                        },
                    ],
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeAutoScalingGroups":
        return {
            "AutoScalingGroups": [
                {
                    "AutoScalingGroupName": "my-autoscaling-group",
                    "AutoScalingGroupARN": "arn:aws:autoscaling:us-east-1:123456789012:autoScalingGroup:uuid:autoScalingGroupName/my-autoscaling-group",
                    "AvailabilityZones": ["us-east-1a", "us-east-1b"],
                    "Tags": [],
                    "Instances": [
                        {
                            "InstanceId": "i-0b9f1f3a0e1e3e0f4",
                            "InstanceType": "t2.micro",
                            "AvailabilityZone": "us-east-1a",
                        },
                        {
                            "InstanceId": "i-0b9f1f3a0e1e3e0f5",
                            "InstanceType": "t3.large",
                            "AvailabilityZone": "us-east-1a",
                        },
                        {
                            "InstanceId": "i-0b9f1f3a0e1e3e0f6",
                            "InstanceType": "t2.micro",
                            "AvailabilityZone": "us-east-1b",
                        },
                        {
                            "InstanceId": "i-0b9f1f3a0e1e3e0f7",
                            "InstanceType": "t3.large",
                            "AvailabilityZone": "us-east-1b",
                        },
                    ],
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


class Test_autoscaling_group_multiple_instance_types:
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types import (
                autoscaling_group_multiple_instance_types,
            )

            check = autoscaling_group_multiple_instance_types()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_groups_with_multi_az_one_or_less_instances(self):
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types import (
                autoscaling_group_multiple_instance_types,
            )

            check = autoscaling_group_multiple_instance_types()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} does not have multiple instance types in multiple Availability Zones."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_arn == autoscaling_group_arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_groups_with_single_az_one_or_less_instances(self):
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
                "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types.autoscaling_client",
                new=AutoScaling(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types import (
                autoscaling_group_multiple_instance_types,
            )

            check = autoscaling_group_multiple_instance_types()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Autoscaling group {autoscaling_group_name} does not have multiple instance types in multiple Availability Zones."
            )
            assert result[0].resource_id == autoscaling_group_name
            assert result[0].resource_tags == []
            assert result[0].resource_arn == autoscaling_group_arn

    @mock_aws
    def test_groups_with_multi_az_multi_instances_but_not_in_each_az(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_multi_az
        ):
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
                    "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types.autoscaling_client",
                    new=AutoScaling(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types import (
                    autoscaling_group_multiple_instance_types,
                )

                check = autoscaling_group_multiple_instance_types()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Autoscaling group {autoscaling_group_name} has only one or no instance types in Availability Zone(s): us-east-1a, us-east-1b."
                )
                assert result[0].resource_id == autoscaling_group_name
                assert result[0].resource_arn == autoscaling_group_arn
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []

    @mock_aws
    def test_groups_with_single_az_multi_instances(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_single_az,
        ):
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
                    "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types.autoscaling_client",
                    new=AutoScaling(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types import (
                    autoscaling_group_multiple_instance_types,
                )

                check = autoscaling_group_multiple_instance_types()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Autoscaling group {autoscaling_group_name} does not have multiple instance types in multiple Availability Zones."
                )
                assert result[0].resource_id == autoscaling_group_name
                assert result[0].resource_tags == []
                assert result[0].resource_arn == autoscaling_group_arn

    @mock_aws
    def test_groups_with_multi_az_multi_instances_in_each_one(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call", new=mock_make_api_call
        ):
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
                    "prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types.autoscaling_client",
                    new=AutoScaling(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.autoscaling.autoscaling_group_multiple_instance_types.autoscaling_group_multiple_instance_types import (
                    autoscaling_group_multiple_instance_types,
                )

                check = autoscaling_group_multiple_instance_types()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Autoscaling group {autoscaling_group_name} has multiple instance types in each of its Availability Zones."
                )
                assert result[0].resource_id == autoscaling_group_name
                assert result[0].resource_arn == autoscaling_group_arn
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
