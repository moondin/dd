---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 537
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 537 of 867)

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

---[FILE: ec2_securitygroup_with_many_ingress_egress_rules_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_securitygroup_with_many_ingress_egress_rules/ec2_securitygroup_with_many_ingress_egress_rules_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_securitygroup_with_many_ingress_egress_rules:
    @mock_aws
    def test_ec2_default_sgs(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"max_security_group_rules": 50}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_with_many_ingress_egress_rules.ec2_securitygroup_with_many_ingress_egress_rules.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_with_many_ingress_egress_rules.ec2_securitygroup_with_many_ingress_egress_rules import (
                ec2_securitygroup_with_many_ingress_egress_rules,
            )

            check = ec2_securitygroup_with_many_ingress_egress_rules()
            result = check.execute()

            # One default sg per region
            assert len(result) == 3
            # All are compliant by default
            assert result[0].status == "PASS"
            assert result[1].status == "PASS"
            assert result[2].status == "PASS"

    @mock_aws
    def test_ec2_non_compliant_default_sg(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        default_sg_name = default_sg["GroupName"]
        for i in range(60):
            ec2_client.authorize_security_group_ingress(
                GroupId=default_sg_id,
                IpPermissions=[
                    {
                        "IpProtocol": "tcp",
                        "FromPort": i,
                        "ToPort": i,
                        "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                    }
                ],
            )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"max_security_group_rules": 50}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_with_many_ingress_egress_rules.ec2_securitygroup_with_many_ingress_egress_rules.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_with_many_ingress_egress_rules.ec2_securitygroup_with_many_ingress_egress_rules import (
                ec2_securitygroup_with_many_ingress_egress_rules,
            )

            check = ec2_securitygroup_with_many_ingress_egress_rules()
            result = check.execute()

            # One default sg per region
            assert len(result) == 3
            # Search changed sg
            for sg in result:
                if sg.resource_id == default_sg_id:
                    assert sg.status == "FAIL"
                    assert sg.region == AWS_REGION_US_EAST_1
                    assert (
                        sg.status_extended
                        == f"Security group {default_sg_name} ({default_sg_id}) has 60 inbound rules and 1 outbound rules."
                    )
                    assert (
                        sg.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{default_sg_id}"
                    )
                    assert sg.resource_details == default_sg_name
                    assert sg.resource_tags == []

    @mock_aws
    def test_ec2_compliant_default_sg(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        default_sg_name = default_sg["GroupName"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "tcp",
                    "FromPort": 23,
                    "ToPort": 23,
                    "IpRanges": [{"CidrIp": "123.123.123.123/32"}],
                }
            ],
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )
        aws_provider._audit_config = {"max_security_group_rules": 50}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_with_many_ingress_egress_rules.ec2_securitygroup_with_many_ingress_egress_rules.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_with_many_ingress_egress_rules.ec2_securitygroup_with_many_ingress_egress_rules import (
                ec2_securitygroup_with_many_ingress_egress_rules,
            )

            check = ec2_securitygroup_with_many_ingress_egress_rules()
            result = check.execute()

            # One default sg per region
            assert len(result) == 3
            # Search changed sg
            for sg in result:
                if sg.resource_id == default_sg_id:
                    assert sg.status == "PASS"
                    assert sg.region == AWS_REGION_US_EAST_1
                    assert (
                        sg.status_extended
                        == f"Security group {default_sg_name} ({default_sg_id}) has 1 inbound rules and 1 outbound rules."
                    )
                    assert (
                        sg.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{default_sg_id}"
                    )
                    assert sg.resource_details == default_sg_name
                    assert sg.resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ec2_transitgateway_auto_accept_vpc_attachments_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_transitgateway_auto_accept_vpc_attachments/ec2_transitgateway_auto_accept_vpc_attachments_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_ec2_transitgateway_auto_accept_vpc_attachments:
    @mock_aws
    def test_no_transit_gateways(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.transit_gateways = []

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments import (
                ec2_transitgateway_auto_accept_vpc_attachments,
            )

            check = ec2_transitgateway_auto_accept_vpc_attachments()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_transit_gateway_default_options(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        tgw = ec2_client.create_transit_gateway(
            Description="Test TGW with auto-accept enabled",
        )
        tgw_id = tgw["TransitGateway"]["TransitGatewayId"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments import (
                ec2_transitgateway_auto_accept_vpc_attachments,
            )

            check = ec2_transitgateway_auto_accept_vpc_attachments()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Transit Gateway {tgw_id} in region {AWS_REGION_US_EAST_1} does not automatically accept shared VPC attachments."
            )
            assert result[0].resource_id == tgw_id
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_transit_gateway_autoaccept_enabled(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        tgw = ec2_client.create_transit_gateway(
            Description="Test TGW with auto-accept enabled",
            Options={
                "AutoAcceptSharedAttachments": "enable",
            },
        )
        tgw_id = tgw["TransitGateway"]["TransitGatewayId"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments import (
                ec2_transitgateway_auto_accept_vpc_attachments,
            )

            check = ec2_transitgateway_auto_accept_vpc_attachments()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Transit Gateway {tgw_id} in region {AWS_REGION_US_EAST_1} is configured to automatically accept shared VPC attachments."
            )
            assert result[0].resource_id == tgw_id
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_transit_gateway_autoaccept_disabled(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        tgw = ec2_client.create_transit_gateway(
            Description="Test TGW with auto-accept disabled",
            Options={
                "AutoAcceptSharedAttachments": "disable",
            },
        )
        tgw_id = tgw["TransitGateway"]["TransitGatewayId"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments import (
                ec2_transitgateway_auto_accept_vpc_attachments,
            )

            check = ec2_transitgateway_auto_accept_vpc_attachments()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Transit Gateway {tgw_id} in region {AWS_REGION_US_EAST_1} does not automatically accept shared VPC attachments."
            )
            assert result[0].resource_id == tgw_id
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_multiple_transit_gateways(self):
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)

        # Create TGW with auto-accept enabled
        tgw_with_auto_accept = ec2_client.create_transit_gateway(
            Description="TGW with auto-accept enabled",
            Options={
                "AutoAcceptSharedAttachments": "enable",
            },
        )
        tgw_with_auto_accept_id = tgw_with_auto_accept["TransitGateway"][
            "TransitGatewayId"
        ]

        # Create TGW with auto-accept disabled
        tgw_without_auto_accept = ec2_client.create_transit_gateway(
            Description="TGW with auto-accept disabled",
            Options={
                "AutoAcceptSharedAttachments": "disable",
            },
        )
        tgw_without_auto_accept_id = tgw_without_auto_accept["TransitGateway"][
            "TransitGatewayId"
        ]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_transitgateway_auto_accept_vpc_attachments.ec2_transitgateway_auto_accept_vpc_attachments import (
                ec2_transitgateway_auto_accept_vpc_attachments,
            )

            check = ec2_transitgateway_auto_accept_vpc_attachments()
            result = check.execute()

            assert len(result) == 2

            # Check the TGW with auto-accept enabled
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Transit Gateway {tgw_with_auto_accept_id} in region {AWS_REGION_US_EAST_1} is configured to automatically accept shared VPC attachments."
            )
            assert result[0].resource_id == tgw_with_auto_accept_id
            assert result[0].region == AWS_REGION_US_EAST_1

            # Check the TGW with auto-accept disabled
            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == f"Transit Gateway {tgw_without_auto_accept_id} in region {AWS_REGION_US_EAST_1} does not automatically accept shared VPC attachments."
            )
            assert result[1].resource_id == tgw_without_auto_accept_id
            assert result[1].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: instance_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/lib/instance_test.py

```python
from unittest.mock import Mock

from prowler.providers.aws.services.ec2.lib.instance import get_instance_public_status


class TestGetInstancePublicStatus:

    def test_instance_no_public_ip(self):
        vpc_subnets = {"subnet-1": Mock(public=False)}
        instance = Mock(id="i-1234567890abcdef0", public_ip=None, subnet_id="subnet-1")
        service = "SSH"

        expected_status = "Instance i-1234567890abcdef0 has SSH exposed to 0.0.0.0/0 but with no public IP address."
        expected_severity = "medium"

        status, severity = get_instance_public_status(vpc_subnets, instance, service)

        assert status == expected_status
        assert severity == expected_severity

    def test_instance_with_public_ip_private_subnet(self):
        vpc_subnets = {"subnet-1": Mock(public=False)}
        instance = Mock(
            id="i-1234567890abcdef0", public_ip="203.0.113.42", subnet_id="subnet-1"
        )
        service = "SSH"

        expected_status = "Instance i-1234567890abcdef0 has SSH exposed to 0.0.0.0/0 on public IP address 203.0.113.42 but it is placed in a private subnet subnet-1."
        expected_severity = "high"

        status, severity = get_instance_public_status(vpc_subnets, instance, service)

        assert status == expected_status
        assert severity == expected_severity

    def test_instance_with_public_ip_public_subnet(self):
        vpc_subnets = {"subnet-1": Mock(public=True)}
        instance = Mock(
            id="i-1234567890abcdef0", public_ip="203.0.113.42", subnet_id="subnet-1"
        )
        service = "SSH"

        expected_status = "Instance i-1234567890abcdef0 has SSH exposed to 0.0.0.0/0 on public IP address 203.0.113.42 in public subnet subnet-1."
        expected_severity = "critical"

        status, severity = get_instance_public_status(vpc_subnets, instance, service)

        assert status == expected_status
        assert severity == expected_severity
```

--------------------------------------------------------------------------------

````
