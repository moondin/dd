---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 631
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 631 of 867)

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

---[FILE: shield_advanced_protection_in_classic_load_balancers_test.py]---
Location: prowler-master/tests/providers/aws/services/shield/shield_advanced_protection_in_classic_load_balancers/shield_advanced_protection_in_classic_load_balancers_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from prowler.providers.aws.services.shield.shield_service import Protection
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_shield_advanced_protection_in_classic_load_balancers:
    @mock_aws
    def test_no_shield_not_active(self):
        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_classic_load_balancers.shield_advanced_protection_in_classic_load_balancers.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_classic_load_balancers.shield_advanced_protection_in_classic_load_balancers import (
                shield_advanced_protection_in_classic_load_balancers,
            )

            check = shield_advanced_protection_in_classic_load_balancers()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_shield_enabled_elb_protected(self):
        # ELB Client
        elb = client("elb", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )
        elb_name = "my-lb"
        elb.create_load_balancer(
            LoadBalancerName=elb_name,
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[f"{AWS_REGION_EU_WEST_1}a"],
            Scheme="internet-facing",
            SecurityGroups=[security_group.id],
        )
        elb_arn = f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/{elb_name}"

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        protection_id = "test-protection"
        shield_client.protections = {
            protection_id: Protection(
                id=protection_id,
                name="",
                resource_arn=elb_arn,
                protection_arn="",
                region=AWS_REGION_EU_WEST_1,
            )
        }

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_classic_load_balancers.shield_advanced_protection_in_classic_load_balancers.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_classic_load_balancers.shield_advanced_protection_in_classic_load_balancers import (
                shield_advanced_protection_in_classic_load_balancers,
            )

            check = shield_advanced_protection_in_classic_load_balancers()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == elb_name
            assert result[0].resource_arn == elb_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ELB {elb_name} is protected by AWS Shield Advanced."
            )

    @mock_aws
    def test_shield_enabled_elb_not_protected(self):
        # ELB Client
        elb = client("elb", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )
        elb_name = "my-lb"
        elb.create_load_balancer(
            LoadBalancerName=elb_name,
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[f"{AWS_REGION_EU_WEST_1}a"],
            Scheme="internet-facing",
            SecurityGroups=[security_group.id],
        )
        elb_arn = f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/{elb_name}"

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_classic_load_balancers.shield_advanced_protection_in_classic_load_balancers.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_classic_load_balancers.shield_advanced_protection_in_classic_load_balancers import (
                shield_advanced_protection_in_classic_load_balancers,
            )

            check = shield_advanced_protection_in_classic_load_balancers()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == elb_name
            assert result[0].resource_arn == elb_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ELB {elb_name} is not protected by AWS Shield Advanced."
            )

    @mock_aws
    def test_shield_disabled_elb_not_protected(self):
        # ELB Client
        elb = client("elb", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )
        elb_name = "my-lb"
        elb.create_load_balancer(
            LoadBalancerName=elb_name,
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[f"{AWS_REGION_EU_WEST_1}a"],
            Scheme="internet-facing",
            SecurityGroups=[security_group.id],
        )
        _ = f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/{elb_name}"

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_classic_load_balancers.shield_advanced_protection_in_classic_load_balancers.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_classic_load_balancers.shield_advanced_protection_in_classic_load_balancers import (
                shield_advanced_protection_in_classic_load_balancers,
            )

            check = shield_advanced_protection_in_classic_load_balancers()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_cloudfront_distributions_test.py]---
Location: prowler-master/tests/providers/aws/services/shield/shield_advanced_protection_in_cloudfront_distributions/shield_advanced_protection_in_cloudfront_distributions_test.py

```python
from unittest import mock

from prowler.providers.aws.services.cloudfront.cloudfront_service import Distribution
from prowler.providers.aws.services.shield.shield_service import Protection
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class Test_shield_advanced_protection_in_cloudfront_distributions:
    def test_no_shield_not_active(self):
        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        # CloudFront Client
        cloudfront_client = mock.MagicMock
        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
                new=cloudfront_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_cloudfront_distributions.shield_advanced_protection_in_cloudfront_distributions import (
                shield_advanced_protection_in_cloudfront_distributions,
            )

            check = shield_advanced_protection_in_cloudfront_distributions()
            result = check.execute()

            assert len(result) == 0

    def test_shield_enabled_cloudfront_protected(self):
        # CloudFront Client
        cloudfront_client = mock.MagicMock
        distribution_id = "EDFDVBD632BHDS5"
        distribution_arn = (
            f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{distribution_id}"
        )
        cloudfront_client.distributions = {
            distribution_id: Distribution(
                arn=distribution_arn,
                id=distribution_id,
                region=AWS_REGION_EU_WEST_1,
                origins=[],
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        protection_id = "test-protection"
        shield_client.protections = {
            protection_id: Protection(
                id=protection_id,
                name="",
                resource_arn=distribution_arn,
                protection_arn="",
                region=AWS_REGION_EU_WEST_1,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
                new=cloudfront_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_cloudfront_distributions.shield_advanced_protection_in_cloudfront_distributions import (
                shield_advanced_protection_in_cloudfront_distributions,
            )

            check = shield_advanced_protection_in_cloudfront_distributions()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == distribution_id
            assert result[0].resource_arn == distribution_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"CloudFront distribution {distribution_id} is protected by AWS Shield Advanced."
            )

    def test_shield_enabled_cloudfront_not_protected(self):
        # CloudFront Client
        cloudfront_client = mock.MagicMock
        distribution_id = "EDFDVBD632BHDS5"
        distribution_arn = (
            f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{distribution_id}"
        )
        cloudfront_client.distributions = {
            distribution_id: Distribution(
                arn=distribution_arn,
                id=distribution_id,
                region=AWS_REGION_EU_WEST_1,
                origins=[],
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
                new=cloudfront_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_cloudfront_distributions.shield_advanced_protection_in_cloudfront_distributions import (
                shield_advanced_protection_in_cloudfront_distributions,
            )

            check = shield_advanced_protection_in_cloudfront_distributions()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == distribution_id
            assert result[0].resource_arn == distribution_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"CloudFront distribution {distribution_id} is not protected by AWS Shield Advanced."
            )

    def test_shield_disabled_cloudfront_not_protected(self):
        # CloudFront Client
        cloudfront_client = mock.MagicMock
        distribution_id = "EDFDVBD632BHDS5"
        distribution_arn = (
            f"arn:aws:cloudfront::{AWS_ACCOUNT_NUMBER}:distribution/{distribution_id}"
        )
        cloudfront_client.distributions = {
            distribution_id: Distribution(
                arn=distribution_arn,
                id=distribution_id,
                region=AWS_REGION_EU_WEST_1,
                origins=[],
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudfront.cloudfront_service.CloudFront",
                new=cloudfront_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_cloudfront_distributions.shield_advanced_protection_in_cloudfront_distributions import (
                shield_advanced_protection_in_cloudfront_distributions,
            )

            check = shield_advanced_protection_in_cloudfront_distributions()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_global_accelerators_test.py]---
Location: prowler-master/tests/providers/aws/services/shield/shield_advanced_protection_in_global_accelerators/shield_advanced_protection_in_global_accelerators_test.py

```python
from unittest import mock

from prowler.providers.aws.services.globalaccelerator.globalaccelerator_service import (
    Accelerator,
)
from prowler.providers.aws.services.shield.shield_service import Protection
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class Test_shield_advanced_protection_in_global_accelerators:
    def test_no_shield_not_active(self):
        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        # GlobalAccelerator Client
        globalaccelerator_client = mock.MagicMock
        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.globalaccelerator.globalaccelerator_service.GlobalAccelerator",
                new=globalaccelerator_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_global_accelerators.shield_advanced_protection_in_global_accelerators import (
                shield_advanced_protection_in_global_accelerators,
            )

            check = shield_advanced_protection_in_global_accelerators()
            result = check.execute()

            assert len(result) == 0

    def test_shield_enabled_globalaccelerator_protected(self):
        # GlobalAccelerator Client
        globalaccelerator_client = mock.MagicMock
        accelerator_name = "1234abcd-abcd-1234-abcd-1234abcdefgh"
        accelerator_id = "1234abcd-abcd-1234-abcd-1234abcdefgh"
        accelerator_arn = f"arn:aws:globalaccelerator::{AWS_ACCOUNT_NUMBER}:accelerator/{accelerator_id}"
        globalaccelerator_client.accelerators = {
            accelerator_name: Accelerator(
                arn=accelerator_arn,
                name=accelerator_name,
                region=AWS_REGION_EU_WEST_1,
                enabled=True,
                tags=[{"Key": "Name", "Value": "TestAccelerator"}],
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        protection_id = "test-protection"
        shield_client.protections = {
            protection_id: Protection(
                id=protection_id,
                name="",
                resource_arn=accelerator_arn,
                protection_arn="",
                region=AWS_REGION_EU_WEST_1,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.globalaccelerator.globalaccelerator_service.GlobalAccelerator",
                new=globalaccelerator_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_global_accelerators.shield_advanced_protection_in_global_accelerators import (
                shield_advanced_protection_in_global_accelerators,
            )

            check = shield_advanced_protection_in_global_accelerators()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == accelerator_id
            assert result[0].resource_arn == accelerator_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Global Accelerator {accelerator_id} is protected by AWS Shield Advanced."
            )
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "TestAccelerator"}
            ]

    def test_shield_enabled_globalaccelerator_not_protected(self):
        # GlobalAccelerator Client
        globalaccelerator_client = mock.MagicMock
        accelerator_name = "1234abcd-abcd-1234-abcd-1234abcdefgh"
        accelerator_id = "1234abcd-abcd-1234-abcd-1234abcdefgh"
        accelerator_arn = f"arn:aws:globalaccelerator::{AWS_ACCOUNT_NUMBER}:accelerator/{accelerator_id}"
        globalaccelerator_client.accelerators = {
            accelerator_name: Accelerator(
                arn=accelerator_arn,
                name=accelerator_name,
                region=AWS_REGION_EU_WEST_1,
                enabled=True,
                tags=[{"Key": "Name", "Value": "TestAccelerator"}],
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.globalaccelerator.globalaccelerator_service.GlobalAccelerator",
                new=globalaccelerator_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_global_accelerators.shield_advanced_protection_in_global_accelerators import (
                shield_advanced_protection_in_global_accelerators,
            )

            check = shield_advanced_protection_in_global_accelerators()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == accelerator_id
            assert result[0].resource_arn == accelerator_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Global Accelerator {accelerator_id} is not protected by AWS Shield Advanced."
            )
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "TestAccelerator"}
            ]

    def test_shield_disabled_globalaccelerator_not_protected(self):
        # GlobalAccelerator Client
        globalaccelerator_client = mock.MagicMock
        accelerator_name = "1234abcd-abcd-1234-abcd-1234abcdefgh"
        accelerator_id = "1234abcd-abcd-1234-abcd-1234abcdefgh"
        accelerator_arn = f"arn:aws:globalaccelerator::{AWS_ACCOUNT_NUMBER}:accelerator/{accelerator_id}"
        globalaccelerator_client.accelerators = {
            accelerator_name: Accelerator(
                arn=accelerator_arn,
                name=accelerator_name,
                region=AWS_REGION_EU_WEST_1,
                enabled=True,
            )
        }

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.globalaccelerator.globalaccelerator_service.GlobalAccelerator",
                new=globalaccelerator_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_global_accelerators.shield_advanced_protection_in_global_accelerators import (
                shield_advanced_protection_in_global_accelerators,
            )

            check = shield_advanced_protection_in_global_accelerators()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_internet_facing_load_balancers_test.py]---
Location: prowler-master/tests/providers/aws/services/shield/shield_advanced_protection_in_internet_facing_load_balancers/shield_advanced_protection_in_internet_facing_load_balancers_test.py

```python
from unittest import mock

from boto3 import client, resource
from mock import patch
from moto import mock_aws

from prowler.providers.aws.services.shield.shield_service import Protection
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_shield_advanced_protection_in_internet_facing_load_balancers:
    @mock_aws
    def test_no_shield_not_active(self):
        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers import (
                shield_advanced_protection_in_internet_facing_load_balancers,
            )

            check = shield_advanced_protection_in_internet_facing_load_balancers()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_shield_enabled_elbv2_internet_facing_protected(self):
        # ELBv2 Client
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}a",
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}b",
        )
        lb_name = "my-lb"
        lb = conn.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internet-facing",
            Type="application",
        )["LoadBalancers"][0]
        lb_arn = lb["LoadBalancerArn"]

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        protection_id = "test-protection"
        shield_client.protections = {
            protection_id: Protection(
                id=protection_id,
                name="",
                resource_arn=lb_arn,
                protection_arn="",
                region=AWS_REGION_EU_WEST_1,
            )
        }

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers import (
                shield_advanced_protection_in_internet_facing_load_balancers,
            )

            check = shield_advanced_protection_in_internet_facing_load_balancers()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == lb_name
            assert result[0].resource_arn == lb["LoadBalancerArn"]
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"ELBv2 ALB {lb_name} is protected by AWS Shield Advanced."
            )

    @mock_aws
    def test_shield_enabled_elbv2_internal_protected(self):
        # ELBv2 Client
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}a",
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}b",
        )
        lb_name = "my-lb"
        lb = conn.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="application",
        )["LoadBalancers"][0]
        lb_arn = lb["LoadBalancerArn"]

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        protection_id = "test-protection"
        shield_client.protections = {
            protection_id: Protection(
                id=protection_id,
                name="",
                resource_arn=lb_arn,
                protection_arn="",
                region=AWS_REGION_EU_WEST_1,
            )
        }

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers import (
                shield_advanced_protection_in_internet_facing_load_balancers,
            )

            check = shield_advanced_protection_in_internet_facing_load_balancers()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_shield_enabled_elbv2_internet_facing_not_protected(self):
        # ELBv2 Client
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}a",
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}b",
        )
        lb_name = "my-lb"
        lb = conn.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internet-facing",
            Type="application",
        )["LoadBalancers"][0]
        lb_arn = lb["LoadBalancerArn"]

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = True
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers import (
                shield_advanced_protection_in_internet_facing_load_balancers,
            )

            check = shield_advanced_protection_in_internet_facing_load_balancers()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == lb_name
            assert result[0].resource_arn == lb_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"ELBv2 ALB {lb_name} is not protected by AWS Shield Advanced."
            )

    @mock_aws
    def test_shield_disabled_elbv2_internet_facing_not_protected(self):
        # ELBv2 Client
        conn = client("elbv2", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="a-security-group", Description="First One"
        )
        vpc = ec2.create_vpc(CidrBlock="172.28.7.0/24", InstanceTenancy="default")
        subnet1 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.192/26",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}a",
        )
        subnet2 = ec2.create_subnet(
            VpcId=vpc.id,
            CidrBlock="172.28.7.0/26",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}b",
        )
        lb_name = "my-lb"
        lb = conn.create_load_balancer(
            Name=lb_name,
            Subnets=[subnet1.id, subnet2.id],
            SecurityGroups=[security_group.id],
            Scheme="internal",
            Type="application",
        )["LoadBalancers"][0]
        _ = lb["LoadBalancerArn"]

        # Shield Client
        shield_client = mock.MagicMock
        shield_client.enabled = False
        shield_client.region = AWS_REGION_EU_WEST_1
        shield_client.protections = {}

        from prowler.providers.aws.services.elbv2.elbv2_service import ELBv2

        with (
            mock.patch(
                "prowler.providers.aws.services.shield.shield_service.Shield",
                new=shield_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers.elbv2_client",
                new=ELBv2(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1], create_default_organization=False
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.shield.shield_advanced_protection_in_internet_facing_load_balancers.shield_advanced_protection_in_internet_facing_load_balancers import (
                shield_advanced_protection_in_internet_facing_load_balancers,
            )

            check = shield_advanced_protection_in_internet_facing_load_balancers()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
