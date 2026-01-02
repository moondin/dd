---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 595
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 595 of 867)

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

---[FILE: networkfirewall_in_all_vpc_test.py]---
Location: prowler-master/tests/providers/aws/services/networkfirewall/networkfirewall_in_all_vpc/networkfirewall_in_all_vpc_test.py

```python
from unittest import mock

from prowler.providers.aws.services.networkfirewall.networkfirewall_service import (
    Firewall,
)
from prowler.providers.aws.services.vpc.vpc_service import VPCs, VpcSubnet
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

FIREWALL_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall/my-firewall"
FIREWALL_NAME = "my-firewall"
VPC_ID_PROTECTED = "vpc-12345678901234567"
VPC_ID_UNPROTECTED = "vpc-12345678901234568"
POLICY_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/my-policy"


class Test_networkfirewall_in_all_vpc:
    def test_no_vpcs(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {}
        vpc_client = mock.MagicMock
        vpc_client.provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.region = AWS_REGION_US_EAST_1
        vpc_client.vpcs = {}

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.vpc_client",
                new=vpc_client,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.networkfirewall_client",
                    new=networkfirewall_client,
                ):
                    # Test Check
                    from prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc import (
                        networkfirewall_in_all_vpc,
                    )

                    check = networkfirewall_in_all_vpc()
                    result = check.execute()

                    assert len(result) == 0

    def test_vpcs_with_firewall_all(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {
            FIREWALL_ARN: Firewall(
                arn=FIREWALL_ARN,
                name=FIREWALL_NAME,
                region=AWS_REGION_US_EAST_1,
                policy_arn=POLICY_ARN,
                vpc_id=VPC_ID_PROTECTED,
                tags=[],
                encryption_type="CUSTOMER_KMS",
                deletion_protection=True,
            )
        }
        vpc_client = mock.MagicMock
        vpc_client.provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.region = AWS_REGION_US_EAST_1
        vpc_client.vpcs = {
            VPC_ID_PROTECTED: VPCs(
                id=VPC_ID_PROTECTED,
                name="",
                default=False,
                cidr_block="192.168.0.0/16",
                flow_log=False,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                subnets=[
                    VpcSubnet(
                        id="subnet-123456789",
                        arn="arn_test",
                        name="",
                        default=False,
                        vpc_id=VPC_ID_PROTECTED,
                        cidr_block="192.168.0.0/24",
                        availability_zone="us-east-1a",
                        public=False,
                        nat_gateway=False,
                        region=AWS_REGION_US_EAST_1,
                        tags=[],
                        mapPublicIpOnLaunch=False,
                    )
                ],
                tags=[],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.vpc_client",
                new=vpc_client,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.networkfirewall_client",
                    new=networkfirewall_client,
                ):
                    # Test Check
                    from prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc import (
                        networkfirewall_in_all_vpc,
                    )

                    check = networkfirewall_in_all_vpc()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "PASS"
                    assert (
                        result[0].status_extended
                        == f"VPC {VPC_ID_PROTECTED} has Network Firewall enabled."
                    )
                    assert result[0].region == AWS_REGION_US_EAST_1
                    assert result[0].resource_id == VPC_ID_PROTECTED
                    assert result[0].resource_tags == []
                    assert result[0].resource_arn == "arn_test"

    def test_vpcs_without_firewall(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {}
        vpc_client = mock.MagicMock
        vpc_client.provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.region = AWS_REGION_US_EAST_1
        vpc_client.vpcs = {
            VPC_ID_UNPROTECTED: VPCs(
                id=VPC_ID_UNPROTECTED,
                name="",
                default=False,
                cidr_block="192.168.0.0/16",
                flow_log=False,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                subnets=[
                    VpcSubnet(
                        id="subnet-123456789",
                        arn="arn_test",
                        name="",
                        default=False,
                        vpc_id=VPC_ID_UNPROTECTED,
                        cidr_block="192.168.0.0/24",
                        availability_zone="us-east-1a",
                        public=False,
                        nat_gateway=False,
                        region=AWS_REGION_US_EAST_1,
                        tags=[],
                        mapPublicIpOnLaunch=False,
                    )
                ],
                tags=[],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.vpc_client",
                new=vpc_client,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.networkfirewall_client",
                    new=networkfirewall_client,
                ):
                    # Test Check
                    from prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc import (
                        networkfirewall_in_all_vpc,
                    )

                    check = networkfirewall_in_all_vpc()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == f"VPC {VPC_ID_UNPROTECTED} does not have Network Firewall enabled."
                    )
                    assert result[0].region == AWS_REGION_US_EAST_1
                    assert result[0].resource_id == VPC_ID_UNPROTECTED
                    assert result[0].resource_tags == []
                    assert result[0].resource_arn == "arn_test"

    def test_vpcs_with_name_without_firewall(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {}

        vpc_client = mock.MagicMock
        vpc_client.provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.region = AWS_REGION_US_EAST_1
        vpc_client.vpcs = {
            VPC_ID_UNPROTECTED: VPCs(
                id=VPC_ID_UNPROTECTED,
                name="vpc_name",
                default=False,
                cidr_block="192.168.0.0/16",
                flow_log=False,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                subnets=[
                    VpcSubnet(
                        id="subnet-123456789",
                        arn="arn_test",
                        name="",
                        default=False,
                        vpc_id=VPC_ID_UNPROTECTED,
                        cidr_block="192.168.0.0/24",
                        availability_zone="us-east-1a",
                        public=False,
                        nat_gateway=False,
                        region=AWS_REGION_US_EAST_1,
                        tags=[],
                        mapPublicIpOnLaunch=False,
                    )
                ],
                tags=[],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.vpc_client",
                new=vpc_client,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.networkfirewall_client",
                    new=networkfirewall_client,
                ):
                    # Test Check
                    from prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc import (
                        networkfirewall_in_all_vpc,
                    )

                    check = networkfirewall_in_all_vpc()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == "VPC vpc_name does not have Network Firewall enabled."
                    )
                    assert result[0].region == AWS_REGION_US_EAST_1
                    assert result[0].resource_id == VPC_ID_UNPROTECTED
                    assert result[0].resource_tags == []
                    assert result[0].resource_arn == "arn_test"

    def test_vpcs_with_and_without_firewall(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {
            FIREWALL_ARN: Firewall(
                arn=FIREWALL_ARN,
                name=FIREWALL_NAME,
                region=AWS_REGION_US_EAST_1,
                policy_arn=POLICY_ARN,
                vpc_id=VPC_ID_PROTECTED,
                tags=[],
                encryption_type="CUSTOMER_KMS",
                deletion_protection=True,
            )
        }
        vpc_client = mock.MagicMock
        vpc_client.provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.region = AWS_REGION_US_EAST_1
        vpc_client.vpcs = {
            VPC_ID_UNPROTECTED: VPCs(
                id=VPC_ID_UNPROTECTED,
                name="",
                default=False,
                cidr_block="192.168.0.0/16",
                flow_log=False,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                subnets=[
                    VpcSubnet(
                        id="subnet-123456789",
                        arn="arn_test",
                        name="",
                        default=False,
                        vpc_id=VPC_ID_UNPROTECTED,
                        cidr_block="192.168.0.0/24",
                        availability_zone="us-east-1a",
                        public=False,
                        nat_gateway=False,
                        region=AWS_REGION_US_EAST_1,
                        tags=[],
                        mapPublicIpOnLaunch=False,
                    )
                ],
                tags=[],
            ),
            VPC_ID_PROTECTED: VPCs(
                id=VPC_ID_PROTECTED,
                name="",
                default=False,
                cidr_block="192.168.0.0/16",
                flow_log=False,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                subnets=[
                    VpcSubnet(
                        id="subnet-123456789",
                        arn="arn_test",
                        name="",
                        default=False,
                        vpc_id=VPC_ID_PROTECTED,
                        cidr_block="192.168.0.0/24",
                        availability_zone="us-east-1a",
                        public=False,
                        nat_gateway=False,
                        region=AWS_REGION_US_EAST_1,
                        tags=[],
                        mapPublicIpOnLaunch=False,
                    )
                ],
                tags=[],
            ),
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.vpc_client",
                new=vpc_client,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.networkfirewall_client",
                    new=networkfirewall_client,
                ):
                    # Test Check
                    from prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc import (
                        networkfirewall_in_all_vpc,
                    )

                    check = networkfirewall_in_all_vpc()
                    result = check.execute()

                    assert len(result) == 2
                    for r in result:
                        if r.resource_id == VPC_ID_PROTECTED:
                            assert r.status == "PASS"
                            assert (
                                r.status_extended
                                == f"VPC {VPC_ID_PROTECTED} has Network Firewall enabled."
                            )
                            assert r.region == AWS_REGION_US_EAST_1
                            assert r.resource_id == VPC_ID_PROTECTED
                            assert r.resource_tags == []
                            assert r.resource_arn == "arn_test"
                        if r.resource_id == VPC_ID_UNPROTECTED:
                            assert r.status == "FAIL"
                            assert (
                                r.status_extended
                                == f"VPC {VPC_ID_UNPROTECTED} does not have Network Firewall enabled."
                            )
                            assert r.region == AWS_REGION_US_EAST_1
                            assert r.resource_id == VPC_ID_UNPROTECTED
                            assert r.resource_tags == []
                            assert r.resource_arn == "arn_test"

    def test_vpcs_without_firewall_ignoring(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {}
        vpc_client = mock.MagicMock
        vpc_client.provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.region = AWS_REGION_US_EAST_1
        vpc_client.vpcs = {
            VPC_ID_UNPROTECTED: VPCs(
                id=VPC_ID_UNPROTECTED,
                default=False,
                cidr_block="192.168.0.0/16",
                flow_log=False,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                name="vpc_name",
                subnets=[
                    VpcSubnet(
                        id="subnet-123456789",
                        name="",
                        arn="arn_test",
                        default=False,
                        vpc_id=VPC_ID_UNPROTECTED,
                        cidr_block="192.168.0.0/24",
                        availability_zone="us-east-1a",
                        public=False,
                        nat_gateway=False,
                        region=AWS_REGION_US_EAST_1,
                        tags=[],
                        mapPublicIpOnLaunch=False,
                    )
                ],
                tags=[],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.provider._scan_unused_services = False

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.vpc_client",
                new=vpc_client,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.networkfirewall_client",
                    new=networkfirewall_client,
                ):
                    # Test Check
                    from prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc import (
                        networkfirewall_in_all_vpc,
                    )

                    check = networkfirewall_in_all_vpc()
                    result = check.execute()

                    assert len(result) == 0

    def test_vpcs_without_firewall_ignoring_vpc_in_use(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {}
        vpc_client = mock.MagicMock
        vpc_client.provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.region = AWS_REGION_US_EAST_1
        vpc_client.vpcs = {
            VPC_ID_UNPROTECTED: VPCs(
                id=VPC_ID_UNPROTECTED,
                name="vpc_name",
                default=False,
                cidr_block="192.168.0.0/16",
                flow_log=False,
                region=AWS_REGION_US_EAST_1,
                arn="arn_test",
                in_use=True,
                subnets=[
                    VpcSubnet(
                        id="subnet-123456789",
                        arn="arn_test",
                        name="subnet_name",
                        default=False,
                        vpc_id=VPC_ID_UNPROTECTED,
                        cidr_block="192.168.0.0/24",
                        availability_zone="us-east-1a",
                        public=False,
                        nat_gateway=False,
                        region=AWS_REGION_US_EAST_1,
                        tags=[],
                        mapPublicIpOnLaunch=False,
                    )
                ],
                tags=[],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        vpc_client.provider._scan_unused_services = False

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.vpc_client",
                new=vpc_client,
            ):
                with mock.patch(
                    "prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc.networkfirewall_client",
                    new=networkfirewall_client,
                ):
                    # Test Check
                    from prowler.providers.aws.services.networkfirewall.networkfirewall_in_all_vpc.networkfirewall_in_all_vpc import (
                        networkfirewall_in_all_vpc,
                    )

                    check = networkfirewall_in_all_vpc()
                    result = check.execute()

                    assert len(result) == 1
                    assert result[0].status == "FAIL"
                    assert (
                        result[0].status_extended
                        == "VPC vpc_name does not have Network Firewall enabled."
                    )
                    assert result[0].region == AWS_REGION_US_EAST_1
                    assert result[0].resource_id == VPC_ID_UNPROTECTED
                    assert result[0].resource_tags == []
                    assert result[0].resource_arn == "arn_test"
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/networkfirewall/networkfirewall_logging_enabled/networkfirewall_logging_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.networkfirewall.networkfirewall_service import (
    Firewall,
    LogDestinationType,
    LoggingConfiguration,
    LogType,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

FIREWALL_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall/my-firewall"
FIREWALL_NAME = "my-firewall"
VPC_ID_PROTECTED = "vpc-12345678901234567"
VPC_ID_UNPROTECTED = "vpc-12345678901234568"
POLICY_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/my-policy"


class Test_networkfirewall_logging_enabled:
    def test_no_networkfirewall(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {}

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_logging_enabled.networkfirewall_logging_enabled.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_logging_enabled.networkfirewall_logging_enabled import (
                    networkfirewall_logging_enabled,
                )

                check = networkfirewall_logging_enabled()
                result = check.execute()

                assert len(result) == 0

    def test_networkfirewall_logging_disabled(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {
            FIREWALL_ARN: Firewall(
                arn=FIREWALL_ARN,
                name=FIREWALL_NAME,
                region=AWS_REGION_US_EAST_1,
                policy_arn=POLICY_ARN,
                vpc_id=VPC_ID_PROTECTED,
                tags=[],
                encryption_type="CUSTOMER_KMS",
                logging_configuration=[],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_logging_enabled.networkfirewall_logging_enabled.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_logging_enabled.networkfirewall_logging_enabled import (
                    networkfirewall_logging_enabled,
                )

                check = networkfirewall_logging_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} does not have logging enabled."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_logging_enabled(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {
            FIREWALL_ARN: Firewall(
                arn=FIREWALL_ARN,
                name=FIREWALL_NAME,
                region=AWS_REGION_US_EAST_1,
                policy_arn=POLICY_ARN,
                vpc_id=VPC_ID_PROTECTED,
                tags=[],
                encryption_type="CUSTOMER_KMS",
                logging_configuration=[
                    LoggingConfiguration(
                        log_type=LogType.flow,
                        log_destination_type=LogDestinationType.s3,
                        log_destination={"bucket_name": "my-bucket"},
                    )
                ],
            ),
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_logging_enabled.networkfirewall_logging_enabled.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_logging_enabled.networkfirewall_logging_enabled import (
                    networkfirewall_logging_enabled,
                )

                check = networkfirewall_logging_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} has logging enabled."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_multi_az_test.py]---
Location: prowler-master/tests/providers/aws/services/networkfirewall/networkfirewall_multi_az/networkfirewall_multi_az_test.py

```python
from unittest import mock

from prowler.providers.aws.services.networkfirewall.networkfirewall_service import (
    Firewall,
    IPAddressType,
    Subnet,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

FIREWALL_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall/my-firewall"
FIREWALL_NAME = "my-firewall"
VPC_ID_PROTECTED = "vpc-12345678901234567"
VPC_ID_UNPROTECTED = "vpc-12345678901234568"
POLICY_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/my-policy"


class Test_networkfirewall_multi_az:
    def test_no_networkfirewall(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {}

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_multi_az.networkfirewall_multi_az.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_multi_az.networkfirewall_multi_az import (
                    networkfirewall_multi_az,
                )

                check = networkfirewall_multi_az()
                result = check.execute()

                assert len(result) == 0

    def test_networkfirewall_multi_az_disabled(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {
            FIREWALL_ARN: Firewall(
                arn=FIREWALL_ARN,
                name=FIREWALL_NAME,
                region=AWS_REGION_US_EAST_1,
                policy_arn=POLICY_ARN,
                vpc_id=VPC_ID_PROTECTED,
                tags=[],
                encryption_type="CUSTOMER_KMS",
                deletion_protection=False,
                subnet_mappings=[
                    Subnet(
                        subnet_id="subnet-12345678901234567",
                        ip_addr_type=IPAddressType.IPV4,
                    )
                ],
            )
        }
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_multi_az.networkfirewall_multi_az.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_multi_az.networkfirewall_multi_az import (
                    networkfirewall_multi_az,
                )

                check = networkfirewall_multi_az()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} is not deployed across multiple AZ."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_multi_az_enabled(self):
        networkfirewall_client = mock.MagicMock
        networkfirewall_client.provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1]
        )
        networkfirewall_client.region = AWS_REGION_US_EAST_1
        networkfirewall_client.network_firewalls = {
            FIREWALL_ARN: Firewall(
                arn=FIREWALL_ARN,
                name=FIREWALL_NAME,
                region=AWS_REGION_US_EAST_1,
                policy_arn=POLICY_ARN,
                vpc_id=VPC_ID_PROTECTED,
                tags=[],
                encryption_type="CUSTOMER_KMS",
                deletion_protection=True,
                subnet_mappings=[
                    Subnet(
                        subnet_id="subnet-12345678901234567",
                        ip_addr_type=IPAddressType.IPV4,
                    ),
                    Subnet(
                        subnet_id="subnet-12345678901234568",
                        ip_addr_type=IPAddressType.IPV4,
                    ),
                ],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_multi_az.networkfirewall_multi_az.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_multi_az.networkfirewall_multi_az import (
                    networkfirewall_multi_az,
                )

                check = networkfirewall_multi_az()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} is deployed across multiple AZ."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN
```

--------------------------------------------------------------------------------

````
