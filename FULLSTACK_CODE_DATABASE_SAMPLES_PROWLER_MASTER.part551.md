---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 551
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 551 of 867)

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

---[FILE: elb_service_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_service_test.py

```python
from boto3 import client, resource
from moto import mock_aws

from prowler.providers.aws.services.elb.elb_service import ELB
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    set_mocked_aws_provider,
)


class Test_ELB_Service:
    # Test ELB Service
    @mock_aws
    def test_service(self):
        # ELB client for this test class
        aws_provider = set_mocked_aws_provider()
        elb = ELB(aws_provider)
        assert elb.service == "elb"

    # Test ELB Client
    @mock_aws
    def test_client(self):
        # ELB client for this test class
        aws_provider = set_mocked_aws_provider()
        elb = ELB(aws_provider)
        for regional_client in elb.regional_clients.values():
            assert regional_client.__class__.__name__ == "ElasticLoadBalancing"

    # Test ELB Session
    @mock_aws
    def test__get_session__(self):
        # ELB client for this test class
        aws_provider = set_mocked_aws_provider()
        elb = ELB(aws_provider)
        assert elb.session.__class__.__name__ == "Session"

    # Test ELB Describe Load Balancers
    @mock_aws
    def test_describe_load_balancers(self):
        elb = client("elb", region_name=AWS_REGION_US_EAST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        acm = client("acm", region_name=AWS_REGION_US_EAST_1)
        certificate = acm.request_certificate(DomainName="www.example.com")
        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        dns_name = elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {
                    "Protocol": "tcp",
                    "LoadBalancerPort": 80,
                    "InstancePort": 8080,
                    "SSLCertificateId": certificate["CertificateArn"],
                },
                {
                    "Protocol": "http",
                    "LoadBalancerPort": 81,
                    "InstancePort": 9000,
                    "SSLCertificateId": certificate["CertificateArn"],
                },
            ],
            AvailabilityZones=[AWS_REGION_US_EAST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )["DNSName"]
        elb_arn = f"arn:aws:elasticloadbalancing:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
        # ELB client for this test class
        aws_provider = set_mocked_aws_provider()
        elb = ELB(aws_provider)
        assert len(elb.loadbalancers) == 1
        assert elb.loadbalancers[elb_arn].arn == elb_arn
        assert elb.loadbalancers[elb_arn].name == "my-lb"
        assert elb.loadbalancers[elb_arn].region == AWS_REGION_US_EAST_1
        assert elb.loadbalancers[elb_arn].scheme == "internal"
        assert elb.loadbalancers[elb_arn].dns == dns_name
        assert len(elb.loadbalancers[elb_arn].listeners) == 2
        assert elb.loadbalancers[elb_arn].listeners[0].protocol == "TCP"
        assert elb.loadbalancers[elb_arn].listeners[0].policies == []
        assert (
            elb.loadbalancers[elb_arn].listeners[0].certificate_arn
            == certificate["CertificateArn"]
        )
        assert elb.loadbalancers[elb_arn].listeners[1].protocol == "HTTP"
        assert elb.loadbalancers[elb_arn].listeners[1].policies == []
        assert (
            elb.loadbalancers[elb_arn].listeners[0].certificate_arn
            == certificate["CertificateArn"]
        )
        assert len(elb.loadbalancers[elb_arn].availability_zones) == 1
        assert AWS_REGION_US_EAST_1_AZA in elb.loadbalancers[elb_arn].availability_zones

    # Test ELB Describe Load Balancers Attributes
    @mock_aws
    def test_describe_load_balancer_attributes(self):
        elb = client("elb", region_name=AWS_REGION_US_EAST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[f"{AWS_REGION_US_EAST_1}a"],
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
                },
                "CrossZoneLoadBalancing": {"Enabled": True},
                "ConnectionDraining": {"Enabled": True, "Timeout": 60},
            },
        )
        elb_arn = f"arn:aws:elasticloadbalancing:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
        # ELB client for this test class
        aws_provider = set_mocked_aws_provider()
        elb = ELB(aws_provider)
        assert elb.loadbalancers[elb_arn].arn == elb_arn
        assert elb.loadbalancers[elb_arn].name == "my-lb"
        assert elb.loadbalancers[elb_arn].region == AWS_REGION_US_EAST_1
        assert elb.loadbalancers[elb_arn].scheme == "internal"
        assert elb.loadbalancers[elb_arn].access_logs
        assert elb.loadbalancers[elb_arn].cross_zone_load_balancing
        assert elb.loadbalancers[elb_arn].connection_draining
        assert elb.loadbalancers[elb_arn].desync_mitigation_mode == "defensive"

    # Test ELB Describe Tags
    @mock_aws
    def test_describe_tags(self):
        elb = client("elb", region_name=AWS_REGION_US_EAST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            AvailabilityZones=[f"{AWS_REGION_US_EAST_1}a"],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        elb.add_tags(
            LoadBalancerNames=["my-lb"],
            Tags=[
                {"Key": "key1", "Value": "value1"},
                {"Key": "key2", "Value": "value2"},
            ],
        )
        elb_arn = f"arn:aws:elasticloadbalancing:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
        # ELB client for this test class
        aws_provider = set_mocked_aws_provider()
        elb = ELB(aws_provider)
        assert elb.loadbalancers[elb_arn].arn == elb_arn
        assert elb.loadbalancers[elb_arn].name == "my-lb"
        assert elb.loadbalancers[elb_arn].region == AWS_REGION_US_EAST_1
        assert elb.loadbalancers[elb_arn].scheme == "internal"
        assert len(elb.loadbalancers[elb_arn].tags) == 2
        assert elb.loadbalancers[elb_arn].tags[0]["Key"] == "key1"
        assert elb.loadbalancers[elb_arn].tags[0]["Value"] == "value1"
        assert elb.loadbalancers[elb_arn].tags[1]["Key"] == "key2"
        assert elb.loadbalancers[elb_arn].tags[1]["Value"] == "value2"
```

--------------------------------------------------------------------------------

---[FILE: elb_connection_draining_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_connection_draining_enabled/elb_connection_draining_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_elb_connection_draining_enabled:

    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_connection_draining_enabled.elb_connection_draining_enabled.elb_client",
                new=ELB(set_mocked_aws_provider([AWS_REGION_EU_WEST_1])),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elb.elb_connection_draining_enabled.elb_connection_draining_enabled import (
                elb_connection_draining_enabled,
            )

            check = elb_connection_draining_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elb_draining_connection_enabled(self):
        elb_client = client("elb", region_name=AWS_REGION_EU_WEST_1)
        # Create a compliant resource

        elb_client.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            Scheme="internet-facing",
        )

        elb_client.modify_load_balancer_attributes(
            LoadBalancerName="my-lb",
            LoadBalancerAttributes={
                "ConnectionDraining": {
                    "Enabled": True,
                    "Timeout": 60,
                }
            },
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_connection_draining_enabled.elb_connection_draining_enabled.elb_client",
                new=ELB(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_connection_draining_enabled.elb_connection_draining_enabled import (
                elb_connection_draining_enabled,
            )

            check = elb_connection_draining_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELB my-lb has connection draining enabled."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "my-lb"
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_elb_draining_connection_disabled(self):
        elb_client = client("elb", region_name=AWS_REGION_EU_WEST_1)
        # Create a compliant resource

        elb_client.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            Scheme="internet-facing",
        )

        elb_client.modify_load_balancer_attributes(
            LoadBalancerName="my-lb",
            LoadBalancerAttributes={
                "ConnectionDraining": {
                    "Enabled": False,
                    "Timeout": 60,
                }
            },
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_connection_draining_enabled.elb_connection_draining_enabled.elb_client",
                new=ELB(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_connection_draining_enabled.elb_connection_draining_enabled import (
                elb_connection_draining_enabled,
            )

            check = elb_connection_draining_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb does not have connection draining enabled."
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

---[FILE: elb_cross_zone_load_balancing_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_cross_zone_load_balancing_enabled/elb_cross_zone_load_balancing_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_elb_cross_zone_load_balancing_enabled:
    def test_elb_no_balancers(self):
        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_EU_WEST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_ssl_listeners.elb_ssl_listeners.elb_client",
                new=ELB(set_mocked_aws_provider([AWS_REGION_EU_WEST_1])),
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
    def test_default_elb(self):
        elb_client = client("elb", region_name=AWS_REGION_EU_WEST_1)
        # Create a compliant resource
        elb_client.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
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
                "prowler.providers.aws.services.elb.elb_cross_zone_load_balancing_enabled.elb_cross_zone_load_balancing_enabled.elb_client",
                new=ELB(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_cross_zone_load_balancing_enabled.elb_cross_zone_load_balancing_enabled import (
                elb_cross_zone_load_balancing_enabled,
            )

            check = elb_cross_zone_load_balancing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert (
                result[0].status == "FAIL"
            )  # This should be a PASS, because AWS by default enables cross-zone load balancing but moto doesn't
            assert (
                result[0].status_extended
                == "ELB my-lb does not have cross-zone load balancing enabled."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "my-lb"
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_elb_with_cross_zone_lb_enabled(self):
        elb_client = client("elb", region_name=AWS_REGION_EU_WEST_1)
        # Create a compliant resource
        elb_client.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            Scheme="internet-facing",
        )

        elb_client.modify_load_balancer_attributes(
            LoadBalancerName="my-lb",
            LoadBalancerAttributes={
                "CrossZoneLoadBalancing": {"Enabled": True},
            },
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_cross_zone_load_balancing_enabled.elb_cross_zone_load_balancing_enabled.elb_client",
                new=ELB(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_cross_zone_load_balancing_enabled.elb_cross_zone_load_balancing_enabled import (
                elb_cross_zone_load_balancing_enabled,
            )

            check = elb_cross_zone_load_balancing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELB my-lb has cross-zone load balancing enabled."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "my-lb"
            assert (
                result[0].resource_arn
                == f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_elb_with_cross_zone_lb_disabled(self):
        elb_client = client("elb", region_name=AWS_REGION_EU_WEST_1)
        # Create a non-compliant resource
        elb_client.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "http", "LoadBalancerPort": 81, "InstancePort": 9000},
            ],
            Scheme="internet-facing",
        )

        elb_client.modify_load_balancer_attributes(
            LoadBalancerName="my-lb",
            LoadBalancerAttributes={
                "CrossZoneLoadBalancing": {"Enabled": False},
            },
        )

        from prowler.providers.aws.services.elb.elb_service import ELB

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_cross_zone_load_balancing_enabled.elb_cross_zone_load_balancing_enabled.elb_client",
                new=ELB(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_cross_zone_load_balancing_enabled.elb_cross_zone_load_balancing_enabled import (
                elb_cross_zone_load_balancing_enabled,
            )

            check = elb_cross_zone_load_balancing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb does not have cross-zone load balancing enabled."
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

---[FILE: elb_desync_mitigation_mode_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_desync_mitigation_mode/elb_desync_mitigation_mode_test.py

```python
from unittest import mock

import botocore
from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_EU_WEST_1_AZA,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeLoadBalancerAttributes":
        if kwarg["LoadBalancerName"] == "my-lb-strictest":
            return {
                "LoadBalancerAttributes": {
                    "CrossZoneLoadBalancing": {"Enabled": True},
                    "AccessLog": {
                        "Enabled": False,
                        "EmitInterval": 60,
                    },
                    "ConnectionDraining": {"Enabled": False, "Timeout": 300},
                    "ConnectionSettings": {
                        "IdleTimeout": 60,
                    },
                    "AdditionalAttributes": [
                        {
                            "Key": "elb.http.desyncmitigationmode",
                            "Value": "strictest",
                        }
                    ],
                }
            }
        if kwarg["LoadBalancerName"] == "my-lb-defensive":
            return {
                "LoadBalancerAttributes": {
                    "CrossZoneLoadBalancing": {"Enabled": True},
                    "AccessLog": {
                        "Enabled": False,
                        "EmitInterval": 60,
                    },
                    "ConnectionDraining": {"Enabled": False, "Timeout": 300},
                    "ConnectionSettings": {
                        "IdleTimeout": 60,
                    },
                    "AdditionalAttributes": [
                        {
                            "Key": "elb.http.desyncmitigationmode",
                            "Value": "defensive",
                        }
                    ],
                }
            }
        if kwarg["LoadBalancerName"] == "my-lb-monitor":
            return {
                "LoadBalancerAttributes": {
                    "CrossZoneLoadBalancing": {"Enabled": True},
                    "AccessLog": {
                        "Enabled": False,
                        "EmitInterval": 60,
                    },
                    "ConnectionDraining": {"Enabled": False, "Timeout": 300},
                    "ConnectionSettings": {
                        "IdleTimeout": 60,
                    },
                    "AdditionalAttributes": [
                        {
                            "Key": "elb.http.desyncmitigationmode",
                            "Value": "monitor",
                        }
                    ],
                }
            }

    return make_api_call(self, operation_name, kwarg)


class Test_elb_desync_mitigation_mode:
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
                "prowler.providers.aws.services.elb.elb_desync_mitigation_mode.elb_desync_mitigation_mode.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elb.elb_desync_mitigation_mode.elb_desync_mitigation_mode import (
                elb_desync_mitigation_mode,
            )

            check = elb_desync_mitigation_mode()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_elb_with_monitor_desync_mode(self):
        elb = client("elb", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb-monitor",
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
                "prowler.providers.aws.services.elb.elb_desync_mitigation_mode.elb_desync_mitigation_mode.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_desync_mitigation_mode.elb_desync_mitigation_mode import (
                elb_desync_mitigation_mode,
            )

            check = elb_desync_mitigation_mode()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb-monitor has desync mitigation mode set to monitor, not to strictest or defensive."
            )
            assert result[0].resource_id == "my-lb-monitor"
            assert (
                result[0].resource_arn
                == "arn:aws:elasticloadbalancing:eu-west-1:123456789012:loadbalancer/my-lb-monitor"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_elb_with_defensive_desync_mode(self):
        elb = client("elb", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb-defensive",
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
                "prowler.providers.aws.services.elb.elb_desync_mitigation_mode.elb_desync_mitigation_mode.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_desync_mitigation_mode.elb_desync_mitigation_mode import (
                elb_desync_mitigation_mode,
            )

            check = elb_desync_mitigation_mode()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELB my-lb-defensive has desync mitigation mode set to defensive."
            )
            assert result[0].resource_id == "my-lb-defensive"
            assert (
                result[0].resource_arn
                == "arn:aws:elasticloadbalancing:eu-west-1:123456789012:loadbalancer/my-lb-defensive"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_elb_with_strictest_desync_mode(self):
        elb = client("elb", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb-strictest",
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
                "prowler.providers.aws.services.elb.elb_desync_mitigation_mode.elb_desync_mitigation_mode.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_desync_mitigation_mode.elb_desync_mitigation_mode import (
                elb_desync_mitigation_mode,
            )

            check = elb_desync_mitigation_mode()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELB my-lb-strictest has desync mitigation mode set to strictest."
            )
            assert result[0].resource_id == "my-lb-strictest"
            assert (
                result[0].resource_arn
                == "arn:aws:elasticloadbalancing:eu-west-1:123456789012:loadbalancer/my-lb-strictest"
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: elb_insecure_ssl_ciphers_test.py]---
Location: prowler-master/tests/providers/aws/services/elb/elb_insecure_ssl_ciphers/elb_insecure_ssl_ciphers_test.py

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

AWS_ACCOUNT_NUMBER = "123456789012"
elb_arn = f"arn:aws:elasticloadbalancing:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:loadbalancer/my-lb"


class Test_elb_insecure_ssl_ciphers:
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
                "prowler.providers.aws.services.elb.elb_insecure_ssl_ciphers.elb_insecure_ssl_ciphers.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.elb.elb_insecure_ssl_ciphers.elb_insecure_ssl_ciphers import (
                elb_insecure_ssl_ciphers,
            )

            check = elb_insecure_ssl_ciphers()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_elb_listener_with_secure_policy(self):
        elb = client("elb", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
                {"Protocol": "https", "LoadBalancerPort": 443, "InstancePort": 9000},
            ],
            AvailabilityZones=[AWS_REGION_EU_WEST_1_AZA],
            Scheme="internal",
            SecurityGroups=[security_group.id],
        )

        elb.set_load_balancer_policies_of_listener(
            LoadBalancerName="my-lb",
            LoadBalancerPort=443,
            PolicyNames=["ELBSecurityPolicy-TLS-1-2-2017-01"],
        )
        elb.describe_load_balancer_policies(LoadBalancerName="my-lb")

        from prowler.providers.aws.services.elb.elb_service import ELB

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(
                    [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
                ),
            ),
            mock.patch(
                "prowler.providers.aws.services.elb.elb_insecure_ssl_ciphers.elb_insecure_ssl_ciphers.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_insecure_ssl_ciphers.elb_insecure_ssl_ciphers import (
                elb_insecure_ssl_ciphers,
            )

            check = elb_insecure_ssl_ciphers()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "ELB my-lb does not have insecure SSL protocols or ciphers."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_elb_with_HTTPS_listener(self):
        elb = client("elb", region_name=AWS_REGION_EU_WEST_1)
        ec2 = resource("ec2", region_name=AWS_REGION_EU_WEST_1)

        security_group = ec2.create_security_group(
            GroupName="sg01", Description="Test security group sg01"
        )

        elb.create_load_balancer(
            LoadBalancerName="my-lb",
            Listeners=[
                {"Protocol": "tcp", "LoadBalancerPort": 80, "InstancePort": 8080},
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
                "prowler.providers.aws.services.elb.elb_insecure_ssl_ciphers.elb_insecure_ssl_ciphers.elb_client",
                new=ELB(
                    set_mocked_aws_provider(
                        [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
                        create_default_organization=False,
                    )
                ),
            ),
        ):
            from prowler.providers.aws.services.elb.elb_insecure_ssl_ciphers.elb_insecure_ssl_ciphers import (
                elb_insecure_ssl_ciphers,
            )

            check = elb_insecure_ssl_ciphers()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "ELB my-lb has listeners with insecure SSL protocols or ciphers."
            )
            assert result[0].resource_id == "my-lb"
            assert result[0].resource_arn == elb_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
