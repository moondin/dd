---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 552
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 552 of 867)

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

---[FILE: elb_internet_facing_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_internet_facing/elb_internet_facing_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"
elb_arn = (
    f"arn:aws:elasticloadbalancing:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
)


class Test_elb_request_smugling:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_internet_facing.elb_internet_facing.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elb.elb_internet_facing.elb_internet_facing import (
                elb_internet_facing,
            )

            check = elb_internet_facing()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elb_private(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_internet_facing.elb_internet_facing.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_internet_facing.elb_internet_facing import (
                elb_internet_facing,
            )

            check = elb_internet_facing()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "ELB my-lb is not internet facing."
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_elb_with_deletion_protection(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internet-facing",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_internet_facing.elb_internet_facing.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_internet_facing.elb_internet_facing import (
                elb_internet_facing,
            )

            check = elb_internet_facing()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb is internet facing in my-lb.us-east-1.elb.amazonaws.com."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: elb_is_in_multiple_az_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_is_in_multiple_az/elb_is_in_multiple_az_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_EU_WEST_1_AZB,
    set_mocked_aws_provider,
)


class Test_elb_is_in_multiple_az:
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_is_in_multiple_az.elb_is_in_multiple_az.elb_client",
                new=ELB(set_mocked_aws_provider([AWS_REGION_EU_WEST_1])),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elb.elb_is_in_multiple_az.elb_is_in_multiple_az import (
                elb_is_in_multiple_az,
            )

            check = elb_is_in_multiple_az()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elbv2_in_one_avaibility_zone(self):
        elb_client = client("elb", region_name=AWS_REGION_EU_WEST_1)
        # Create a compliant resource

        elb_client.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internet-facing",
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_is_in_multiple_az.elb_is_in_multiple_az.elb_client",
                new=ELB(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_is_in_multiple_az.elb_is_in_multiple_az import (
                elb_is_in_multiple_az,
            )

            check = elb_is_in_multiple_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Classic Load Balancer my-lb is not in at least 2 availability zones, it is only in {AWS_REGION_EU_WEST_1_AZA}."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "my-lb"
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_elbv2_in_multiple_avaibility_zones(self):
        elb_client = client("elb", region_name=AWS_REGION_EU_WEST_1)
        # Create a compliant resource

        elb_client.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA, AWS_REGION_EU_WEST_1_AZB],
            Scheme="internet-facing",
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_is_in_multiple_az.elb_is_in_multiple_az.elb_client",
                new=ELB(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_is_in_multiple_az.elb_is_in_multiple_az import (
                elb_is_in_multiple_az,
            )

            check = elb_is_in_multiple_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Classic Load Balancer my-lb is in 2 availability zones: {AWS_REGION_EU_WEST_1_AZA}, {AWS_REGION_EU_WEST_1_AZB}."
            ) or (
                result[0].status_extended
                == f"Classic Load Balancer my-lb is in 2 availability zones: {AWS_REGION_EU_WEST_1_AZB}, {AWS_REGION_EU_WEST_1_AZA}."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "my-lb"
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: elb_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_logging_enabled/elb_logging_enabled_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"
elb_arn = (
    f"arn:aws:elasticloadbalancing:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
)


class Test_elb_logging_enabled:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_logging_enabled.elb_logging_enabled.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elb.elb_logging_enabled.elb_logging_enabled import (
                elb_logging_enabled,
            )

            check = elb_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elb_without_access_log(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_logging_enabled.elb_logging_enabled.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_logging_enabled.elb_logging_enabled import (
                elb_logging_enabled,
            )

            check = elb_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb does not have access logs configured."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    @mock_aws
    def test_elb_with_deletion_protection(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        elb.modify_load_balancer_attributes(
            LoadBalancerName="my-lb",
            LoadBalancerAttributes={
                "AccessLog": {
                    "Enabled": True,
                    "S3BucketName": "mb",
                    "EmitInterval": 42,
                    "S3BucketPrefix": "s3bf",
                }
            },
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_logging_enabled.elb_logging_enabled.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_logging_enabled.elb_logging_enabled import (
                elb_logging_enabled,
            )

            check = elb_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELB my-lb has access logs to S3 configured."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: elb_ssl_listeners_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_ssl_listeners/elb_ssl_listeners_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"
elb_arn = (
    f"arn:aws:elasticloadbalancing:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
)


class Test_elb_ssl_listeners:
    @mock_aws
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners.elb_ssl_listeners.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elb.elb_ssl_listeners.elb_ssl_listeners import (
                elb_ssl_listeners,
            )

            check = elb_ssl_listeners()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elb_with_HTTP_listener(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners.elb_ssl_listeners.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_ssl_listeners.elb_ssl_listeners import (
                elb_ssl_listeners,
            )

            check = elb_ssl_listeners()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "ELB my-lb has non-encrypted listeners."
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION

    @mock_aws
    def test_elb_with_HTTPS_listener(self):
        elb = client("elb", region_name=AWS_REGION)
        ec2 = resource("ec2", region_name=AWS_REGION)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "https", "LoadBalancerPort": 443, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )
        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners.elb_ssl_listeners.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_ssl_listeners.elb_ssl_listeners import (
                elb_ssl_listeners,
            )

            check = elb_ssl_listeners()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "ELB my-lb has HTTPS listeners only."
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

````
