---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 529
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 529 of 867)

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

---[FILE: ec2_networkacl_allow_ingress_tcp_port_22_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_networkacl_allow_ingress_tcp_port_22/ec2_networkacl_allow_ingress_tcp_port_22_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_networkacl_allow_ingress_tcp_port_22:
    @mock_aws
    def test_ec2_default_nacls(self):
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22 import (
                ec2_networkacl_allow_ingress_tcp_port_22,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_22()
            result = check.execute()

            # One default nacl per region
            assert len(result) == 2

    @mock_aws
    def test_ec2_non_default_compliant_nacl(self):
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22 import (
                ec2_networkacl_allow_ingress_tcp_port_22,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_22()
            result = check.execute()

            # One default sg per region
            assert len(result) == 2

            # by default nacls are public
            assert result[0].status == "FAIL"
            assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
            assert result[0].resource_tags == []
            assert (
                result[0].status_extended
                == f"Network ACL {result[0].resource_id} has SSH port 22 open to the Internet."
            )

    @mock_aws
    def test_ec2_non_compliant_nacl(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="6",
            PortRange={"From": 22, "To": 22},
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22 import (
                ec2_networkacl_allow_ingress_tcp_port_22,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_22()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 4
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "FAIL"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} has SSH port 22 open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )

    @mock_aws
    def test_ec2_compliant_nacl(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="6",
            PortRange={"From": 22, "To": 22},
            RuleAction="allow",
            Egress=False,
            CidrBlock="10.0.0.2/32",
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22 import (
                ec2_networkacl_allow_ingress_tcp_port_22,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_22()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 4
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "PASS"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} does not have SSH port 22 open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )

    @mock_aws
    def test_ec2_non_compliant_nacl_ignoring(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="-1",
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            scan_unused_services=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22 import (
                ec2_networkacl_allow_ingress_tcp_port_22,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_22()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_non_compliant_nacl_ignoring_with_sgs(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="-1",
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
        )
        ec2_client.create_security_group(GroupName="sg", Description="test")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            scan_unused_services=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_22.ec2_networkacl_allow_ingress_tcp_port_22 import (
                ec2_networkacl_allow_ingress_tcp_port_22,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_22()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 3
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "FAIL"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} has SSH port 22 open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_allow_ingress_tcp_port_3389_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_networkacl_allow_ingress_tcp_port_3389/ec2_networkacl_allow_ingress_tcp_port_3389_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_networkacl_allow_ingress_tcp_port_3389:
    @mock_aws
    def test_ec2_default_nacls(self):
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389 import (
                ec2_networkacl_allow_ingress_tcp_port_3389,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_3389()
            result = check.execute()

            # One default nacl per region
            assert len(result) == 2

    @mock_aws
    def test_ec2_non_default_compliant_nacl(self):
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389 import (
                ec2_networkacl_allow_ingress_tcp_port_3389,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_3389()
            result = check.execute()

            # One default sg per region
            assert len(result) == 2

            # by default nacls are public
            assert result[0].status == "FAIL"
            assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
            assert result[0].resource_tags == []
            assert (
                result[0].status_extended
                == f"Network ACL {result[0].resource_id} has Microsoft RDP port 3389 open to the Internet."
            )

    @mock_aws
    def test_ec2_non_compliant_nacl(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="6",
            PortRange={"From": 3389, "To": 3389},
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389 import (
                ec2_networkacl_allow_ingress_tcp_port_3389,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_3389()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 4
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "FAIL"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} has Microsoft RDP port 3389 open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )

    @mock_aws
    def test_ec2_compliant_nacl(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="6",
            PortRange={"From": 3389, "To": 3389},
            RuleAction="allow",
            Egress=False,
            CidrBlock="10.0.0.2/32",
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389 import (
                ec2_networkacl_allow_ingress_tcp_port_3389,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_3389()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 4
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "PASS"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} does not have Microsoft RDP port 3389 open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )

    @mock_aws
    def test_ec2_non_compliant_nacl_ignoring(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="-1",
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            scan_unused_services=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389 import (
                ec2_networkacl_allow_ingress_tcp_port_3389,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_3389()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_non_compliant_nacl_ignoring_with_sgs(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        ec2_client.create_network_acl_entry(
            NetworkAclId=nacl_id,
            RuleNumber=100,
            Protocol="-1",
            RuleAction="allow",
            Egress=False,
            CidrBlock="0.0.0.0/0",
        )
        ec2_client.create_security_group(GroupName="sg", Description="test")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            scan_unused_services=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_allow_ingress_tcp_port_3389.ec2_networkacl_allow_ingress_tcp_port_3389 import (
                ec2_networkacl_allow_ingress_tcp_port_3389,
            )

            check = ec2_networkacl_allow_ingress_tcp_port_3389()
            result = check.execute()

            # One default sg per region + default of new VPC + new NACL
            assert len(result) == 3
            # Search changed sg
            for nacl in result:
                if nacl.resource_id == nacl_id:
                    assert nacl.status == "FAIL"
                    assert result[0].region in (AWS_REGION_US_EAST_1, "eu-west-1")
                    assert result[0].resource_tags == []
                    assert (
                        nacl.status_extended
                        == f"Network ACL {nacl_id} has Microsoft RDP port 3389 open to the Internet."
                    )
                    assert (
                        nacl.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:network-acl/{nacl_id}"
                    )
```

--------------------------------------------------------------------------------

---[FILE: ec2_networkacl_unused_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_networkacl_unused/ec2_networkacl_unused_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_networkacl_unused:
    @mock_aws
    def test_ec2_default_nacls(self):
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
                "prowler.providers.aws.services.ec2.ec2_networkacl_unused.ec2_networkacl_unused.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_unused.ec2_networkacl_unused import (
                ec2_networkacl_unused,
            )

            check = ec2_networkacl_unused()
            result = check.execute()

            # One default nacl per region
            assert len(result) == 0

    @mock_aws
    def test_ec2_unused_non_default_nacl(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        arn = f"arn:aws:ec2:eu-west-1:123456789012:network-acl/{nacl_id}"

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_unused.ec2_networkacl_unused.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_unused.ec2_networkacl_unused import (
                ec2_networkacl_unused,
            )

            check = ec2_networkacl_unused()
            result = check.execute()

            assert len(result) == 1

            assert result[0].status == "FAIL"
            assert result[0].region == "eu-west-1"
            assert result[0].resource_id == nacl_id
            assert result[0].resource_arn == arn
            assert (
                result[0].status_extended
                == f"Network ACL {nacl_id} is not associated with any subnet and is not the default network ACL."
            )

    @mock_aws
    def test_ec2_used_non_default_nacl(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
        nacl_id = ec2_client.create_network_acl(VpcId=vpc_id)["NetworkAcl"][
            "NetworkAclId"
        ]
        arn = f"arn:aws:ec2:eu-west-1:123456789012:network-acl/{nacl_id}"

        default_nacl_association_id = ec2_client.describe_network_acls()["NetworkAcls"][
            0
        ]["Associations"][0]["NetworkAclAssociationId"]
        # Replace the default association with the new Network ACL
        ec2_client.replace_network_acl_association(
            AssociationId=default_nacl_association_id, NetworkAclId=nacl_id
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_networkacl_unused.ec2_networkacl_unused.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_networkacl_unused.ec2_networkacl_unused import (
                ec2_networkacl_unused,
            )

            check = ec2_networkacl_unused()
            result = check.execute()

            assert len(result) == 1
            # Search changed sg
            assert result[0].status == "PASS"
            assert result[0].region == "eu-west-1"
            assert result[0].resource_id == nacl_id
            assert result[0].resource_arn == arn
            assert (
                result[0].status_extended
                == f"Network ACL {nacl_id} is associated with a subnet."
            )
```

--------------------------------------------------------------------------------

````
