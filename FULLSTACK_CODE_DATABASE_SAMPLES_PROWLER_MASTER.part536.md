---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 536
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 536 of 867)

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

---[FILE: ec2_securitygroup_allow_wide_open_public_ipv4_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_securitygroup_allow_wide_open_public_ipv4/ec2_securitygroup_allow_wide_open_public_ipv4_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_securitygroup_allow_wide_open_public_ipv4:
    @mock_aws
    def test_ec2_default_sgs(self):
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
                "prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4 import (
                ec2_securitygroup_allow_wide_open_public_ipv4,
            )

            check = ec2_securitygroup_allow_wide_open_public_ipv4()
            result = check.execute()

            # One default sg per region
            assert len(result) == 3
            # All are compliant by default
            assert result[0].status == "PASS"
            assert result[1].status == "PASS"
            assert result[2].status == "PASS"

    @mock_aws
    def test_ec2_default_sg_with_RFC1918_address(self):
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
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "192.0.2.15/32"}],
                }
            ],
        )

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
                "prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4 import (
                ec2_securitygroup_allow_wide_open_public_ipv4,
            )

            check = ec2_securitygroup_allow_wide_open_public_ipv4()
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
                        == f"Security group {default_sg_name} ({default_sg_id}) has no potential wide-open non-RFC1918 address."
                    )
                    assert (
                        sg.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{default_sg_id}"
                    )
                    assert sg.resource_details == default_sg_name
                    assert sg.resource_tags == []

    @mock_aws
    def test_ec2_default_sg_with_non_RFC1918_address(self):
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
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "82.122.0.0/16"}],
                }
            ],
        )

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
                "prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_allow_wide_open_public_ipv4.ec2_securitygroup_allow_wide_open_public_ipv4 import (
                ec2_securitygroup_allow_wide_open_public_ipv4,
            )

            check = ec2_securitygroup_allow_wide_open_public_ipv4()
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
                        == f"Security group {default_sg_name} ({default_sg_id}) has potential wide-open non-RFC1918 address 82.122.0.0/16 in ingress rule."
                    )
                    assert (
                        sg.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{default_sg_id}"
                    )
                    assert sg.resource_details == default_sg_name
                    assert sg.resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_default_restrict_traffic_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_securitygroup_default_restrict_traffic/ec2_securitygroup_default_restrict_traffic_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_ec2_securitygroup_default_restrict_traffic:
    @mock_aws
    def test_ec2_compliant_sg(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        default_sg_name = default_sg["GroupName"]
        ec2_client.revoke_security_group_egress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                    "Ipv6Ranges": [],
                    "PrefixListIds": [],
                    "UserIdGroupPairs": [],
                }
            ],
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic import (
                ec2_securitygroup_default_restrict_traffic,
            )

            check = ec2_securitygroup_default_restrict_traffic()
            result = check.execute()

            # One default sg per region
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Default Security Group ({default_sg_id}) rules do not allow traffic."
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{default_sg_id}"
            )
            assert result[0].resource_details == default_sg_name
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == default_sg_id

    @mock_aws
    def test_ec2_non_compliant_sg_ingress_rule(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        default_sg_name = default_sg["GroupName"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {"IpProtocol": "-1", "IpRanges": [{"CidrIp": "10.0.0.16/0"}]}
            ],
        )
        ec2_client.revoke_security_group_egress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                    "Ipv6Ranges": [],
                    "PrefixListIds": [],
                    "UserIdGroupPairs": [],
                }
            ],
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic import (
                ec2_securitygroup_default_restrict_traffic,
            )

            check = ec2_securitygroup_default_restrict_traffic()
            result = check.execute()

            # One default sg per region
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Default Security Group ({default_sg_id}) rules allow traffic."
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{default_sg_id}"
            )
            assert result[0].resource_details == default_sg_name
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == default_sg_id

    @mock_aws
    def test_ec2_non_compliant_sg_ingress_rule_but_unused(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        default_sg["GroupName"]
        ec2_client.authorize_security_group_ingress(
            GroupId=default_sg_id,
            IpPermissions=[
                {"IpProtocol": "-1", "IpRanges": [{"CidrIp": "10.0.0.16/0"}]}
            ],
        )
        ec2_client.revoke_security_group_egress(
            GroupId=default_sg_id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
                    "Ipv6Ranges": [],
                    "PrefixListIds": [],
                    "UserIdGroupPairs": [],
                }
            ],
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider(
            audited_regions=[AWS_REGION_US_EAST_1], scan_unused_services=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic import (
                ec2_securitygroup_default_restrict_traffic,
            )

            check = ec2_securitygroup_default_restrict_traffic()
            result = check.execute()

            # One default sg per region
            assert len(result) == 0

    @mock_aws
    def test_ec2_non_compliant_sg_egress_rule(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        default_sg = ec2_client.describe_security_groups(GroupNames=["default"])[
            "SecurityGroups"
        ][0]
        default_sg_id = default_sg["GroupId"]
        default_sg_name = default_sg["GroupName"]

        from prowler.providers.aws.services.ec2.ec2_service import EC2
        from prowler.providers.aws.services.vpc.vpc_service import VPC

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic.vpc_client",
                new=VPC(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_default_restrict_traffic.ec2_securitygroup_default_restrict_traffic import (
                ec2_securitygroup_default_restrict_traffic,
            )

            check = ec2_securitygroup_default_restrict_traffic()
            result = check.execute()

            # One default sg per region
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Default Security Group ({default_sg_id}) rules allow traffic."
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{default_sg_id}"
            )
            assert result[0].resource_details == default_sg_name
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == default_sg_id
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_from_launch_wizard_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_securitygroup_from_launch_wizard/ec2_securitygroup_from_launch_wizard_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_securitygroup_from_launch_wizard:
    @mock_aws
    def test_ec2_default_sgs(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")

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
                "prowler.providers.aws.services.ec2.ec2_securitygroup_from_launch_wizard.ec2_securitygroup_from_launch_wizard.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_from_launch_wizard.ec2_securitygroup_from_launch_wizard import (
                ec2_securitygroup_from_launch_wizard,
            )

            check = ec2_securitygroup_from_launch_wizard()
            result = check.execute()

            # One default sg per region
            assert len(result) == 3
            # All are compliant by default
            assert result[0].status == "PASS"
            assert result[1].status == "PASS"
            assert result[2].status == "PASS"

    @mock_aws
    def test_ec2_launch_wizard_sg(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")
        sg_name = "launch-wizard-1"
        sg = ec2_client.create_security_group(
            GroupName=sg_name, Description="launch wizard sg"
        )
        sg_id = sg["GroupId"]

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
                "prowler.providers.aws.services.ec2.ec2_securitygroup_from_launch_wizard.ec2_securitygroup_from_launch_wizard.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_from_launch_wizard.ec2_securitygroup_from_launch_wizard import (
                ec2_securitygroup_from_launch_wizard,
            )

            check = ec2_securitygroup_from_launch_wizard()
            result = check.execute()

            # One default sg per region + created one
            assert len(result) == 4
            # Search changed sg
            for sg in result:
                if sg.resource_id == sg_id:
                    assert sg.status == "FAIL"
                    assert sg.region == AWS_REGION_US_EAST_1
                    assert (
                        sg.status_extended
                        == f"Security group {sg_name} ({sg_id}) was created using the EC2 Launch Wizard."
                    )
                    assert (
                        sg.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{sg_id}"
                    )
                    assert sg.resource_details == sg_name

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

        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2.create_instances(
            ImageId=EXAMPLE_AMI_ID,
            MinCount=1,
            MaxCount=1,
            SecurityGroupIds=[
                default_sg_id,
            ],
        )

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
                "prowler.providers.aws.services.ec2.ec2_securitygroup_from_launch_wizard.ec2_securitygroup_from_launch_wizard.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_from_launch_wizard.ec2_securitygroup_from_launch_wizard import (
                ec2_securitygroup_from_launch_wizard,
            )

            check = ec2_securitygroup_from_launch_wizard()
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
                        == f"Security group {default_sg_name} ({default_sg_id}) was not created using the EC2 Launch Wizard."
                    )
                    assert (
                        sg.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{default_sg_id}"
                    )
                    assert sg.resource_details == default_sg_name
                    assert sg.resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: ec2_securitygroup_not_used_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_securitygroup_not_used/ec2_securitygroup_not_used_test.py

```python
from re import search
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_securitygroup_not_used:
    @mock_aws
    def test_ec2_default_sgs(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.create_vpc(CidrBlock="10.0.0.0/16")

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            audited_regions=["us-east-1", "eu-west-1"]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used import (
                ec2_securitygroup_not_used,
            )

            check = ec2_securitygroup_not_used()
            result = check.execute()

            # Default sg per region are excluded
            assert len(result) == 0

    @mock_aws
    def test_ec2_unused_sg(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", AWS_REGION_US_EAST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        sg_name = "test-sg"
        sg = ec2.create_security_group(
            GroupName=sg_name, Description="test", VpcId=vpc_id
        )

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            audited_regions=["us-east-1", "eu-west-1"]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used import (
                ec2_securitygroup_not_used,
            )

            check = ec2_securitygroup_not_used()
            result = check.execute()

            # One custom sg
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == f"Security group {sg_name} ({sg.id}) it is not being used."
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{sg.id}"
            )
            assert result[0].resource_id == sg.id
            assert result[0].resource_details == sg_name
            assert result[0].resource_tags == []

    @mock_aws
    def test_ec2_used_default_sg(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", AWS_REGION_US_EAST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        sg_name = "test-sg"
        sg = ec2.create_security_group(
            GroupName=sg_name, Description="test", VpcId=vpc_id
        )
        subnet = ec2.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/18")
        subnet.create_network_interface(Groups=[sg.id])

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            audited_regions=["us-east-1", "eu-west-1"]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used import (
                ec2_securitygroup_not_used,
            )

            check = ec2_securitygroup_not_used()
            result = check.execute()

            # One custom sg
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == f"Security group {sg_name} ({sg.id}) it is being used."
            )
            assert search(
                "it is being used",
                result[0].status_extended,
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{sg.id}"
            )
            assert result[0].resource_id == sg.id
            assert result[0].resource_details == sg_name
            assert result[0].resource_tags == []

    @mock_aws
    def test_ec2_used_default_sg_by_lambda(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", AWS_REGION_US_EAST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        sg_name = "test-sg"
        sg = ec2.create_security_group(
            GroupName=sg_name, Description="test", VpcId=vpc_id
        )
        subnet = ec2.create_subnet(VpcId=vpc_id, CidrBlock="10.0.0.0/18")
        subnet.create_network_interface(Groups=[sg.id])
        iam_client = client("iam", region_name=AWS_REGION_US_EAST_1)
        iam_role = iam_client.create_role(
            RoleName="my-role",
            AssumeRolePolicyDocument="some policy",
            Path="/my-path/",
        )["Role"]["Arn"]
        lambda_client = client("lambda", AWS_REGION_US_EAST_1)
        lambda_client.create_function(
            FunctionName="test-function",
            Runtime="python3.11",
            Role=iam_role,
            Handler="lambda_function.lambda_handler",
            Code={
                "ImageUri": f"{AWS_ACCOUNT_NUMBER}.dkr.ecr.us-east-1.amazonaws.com/testlambdaecr:prod"
            },
            Description="test lambda function",
            Timeout=3,
            MemorySize=128,
            Publish=True,
            VpcConfig={
                "SecurityGroupIds": [sg.id],
                "SubnetIds": [subnet.id],
            },
        )

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            audited_regions=["us-east-1", "eu-west-1"]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used import (
                ec2_securitygroup_not_used,
            )

            check = ec2_securitygroup_not_used()
            result = check.execute()

            # One custom sg
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == f"Security group {sg_name} ({sg.id}) it is being used."
            )
            assert search(
                "it is being used",
                result[0].status_extended,
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{sg.id}"
            )
            assert result[0].resource_id == sg.id
            assert result[0].resource_details == sg_name
            assert result[0].resource_tags == []

    @mock_aws
    def test_ec2_associated_sg(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", AWS_REGION_US_EAST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        sg_name = "test-sg"
        sg_name1 = "test-sg1"
        sg = ec2.create_security_group(
            GroupName=sg_name, Description="test", VpcId=vpc_id
        )
        sg1 = ec2.create_security_group(
            GroupName=sg_name1, Description="test1", VpcId=vpc_id
        )

        ec2_client.authorize_security_group_ingress(
            GroupId=sg.id,
            IpPermissions=[
                {
                    "IpProtocol": "-1",
                    "UserIdGroupPairs": [
                        {
                            "GroupId": sg1.id,
                            "Description": "Allow traffic from source SG",
                        }
                    ],
                }
            ],
        )

        from prowler.providers.aws.services.awslambda.awslambda_service import Lambda
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            audited_regions=["us-east-1", "eu-west-1"]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used.awslambda_client",
                new=Lambda(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_securitygroup_not_used.ec2_securitygroup_not_used import (
                ec2_securitygroup_not_used,
            )

            check = ec2_securitygroup_not_used()
            result = check.execute()

            # One custom sg
            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].status_extended
                == f"Security group {sg_name} ({sg.id}) it is not being used."
            )
            assert (
                result[0].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{sg.id}"
            )
            assert result[0].resource_id == sg.id
            assert result[0].resource_details == sg_name
            assert result[0].resource_tags == []
            assert result[1].status == "PASS"
            assert result[1].region == AWS_REGION_US_EAST_1
            assert (
                result[1].status_extended
                == f"Security group {sg_name1} ({sg1.id}) it is being used."
            )
            assert (
                result[1].resource_arn
                == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:security-group/{sg1.id}"
            )
            assert result[1].resource_id == sg1.id
            assert result[1].resource_details == sg_name1
            assert result[1].resource_tags == []
```

--------------------------------------------------------------------------------

````
