---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 596
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 596 of 867)

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

---[FILE: networkfirewall_policy_default_action_fragmented_packets_test.py]---
Location: prowler-master/tests/providers/aws/services/networkfirewall/networkfirewall_policy_default_action_fragmented_packets/networkfirewall_policy_default_action_fragmented_packets_test.py

```python
from unittest import mock

from prowler.providers.aws.services.networkfirewall.networkfirewall_service import (
    Firewall,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

FIREWALL_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall/my-firewall"
FIREWALL_NAME = "my-firewall"
VPC_ID_PROTECTED = "vpc-12345678901234567"
VPC_ID_UNPROTECTED = "vpc-12345678901234568"
POLICY_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/my-policy"


class Test_networkfirewall_policy_default_action_fragmented_packets:
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
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_policy_default_action_fragmented_packets import (
                    networkfirewall_policy_default_action_fragmented_packets,
                )

                check = networkfirewall_policy_default_action_fragmented_packets()
                result = check.execute()

                assert len(result) == 0

    def test_networkfirewall_default_stateless_action_drop(self):
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
                default_stateless_frag_actions=["aws:drop"],
            )
        }
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_policy_default_action_fragmented_packets import (
                    networkfirewall_policy_default_action_fragmented_packets,
                )

                check = networkfirewall_policy_default_action_fragmented_packets()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy does drop or forward fragmented packets by default."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_default_stateless_action_forward(self):
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
                default_stateless_frag_actions=["aws:forward_to_sfe"],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_policy_default_action_fragmented_packets import (
                    networkfirewall_policy_default_action_fragmented_packets,
                )

                check = networkfirewall_policy_default_action_fragmented_packets()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy does drop or forward fragmented packets by default."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_default_stateless_action_pass(self):
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
                default_stateless_frag_actions=["aws:pass"],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_fragmented_packets.networkfirewall_policy_default_action_fragmented_packets import (
                    networkfirewall_policy_default_action_fragmented_packets,
                )

                check = networkfirewall_policy_default_action_fragmented_packets()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy does not drop or forward fragmented packets by default."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_policy_default_action_full_packets_test.py]---
Location: prowler-master/tests/providers/aws/services/networkfirewall/networkfirewall_policy_default_action_full_packets/networkfirewall_policy_default_action_full_packets_test.py

```python
from unittest import mock

from prowler.providers.aws.services.networkfirewall.networkfirewall_service import (
    Firewall,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

FIREWALL_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall/my-firewall"
FIREWALL_NAME = "my-firewall"
VPC_ID_PROTECTED = "vpc-12345678901234567"
VPC_ID_UNPROTECTED = "vpc-12345678901234568"
POLICY_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/my-policy"


class Test_networkfirewall_policy_default_action_full_packets:
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
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_full_packets.networkfirewall_policy_default_action_full_packets.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_full_packets.networkfirewall_policy_default_action_full_packets import (
                    networkfirewall_policy_default_action_full_packets,
                )

                check = networkfirewall_policy_default_action_full_packets()
                result = check.execute()

                assert len(result) == 0

    def test_networkfirewall_policy_default_action_drop(self):
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
                default_stateless_actions=["aws:drop"],
            )
        }
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_full_packets.networkfirewall_policy_default_action_full_packets.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_full_packets.networkfirewall_policy_default_action_full_packets import (
                    networkfirewall_policy_default_action_full_packets,
                )

                check = networkfirewall_policy_default_action_full_packets()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy does drop or forward full packets by default."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_policy_default_action_forward(self):
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
                default_stateless_actions=["aws:forward_to_sfe"],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_full_packets.networkfirewall_policy_default_action_full_packets.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_full_packets.networkfirewall_policy_default_action_full_packets import (
                    networkfirewall_policy_default_action_full_packets,
                )

                check = networkfirewall_policy_default_action_full_packets()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy does drop or forward full packets by default."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_policy_default_action_pass(self):
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
                default_stateless_actions=["aws:pass"],
            )
        }
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_full_packets.networkfirewall_policy_default_action_full_packets.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_default_action_full_packets.networkfirewall_policy_default_action_full_packets import (
                    networkfirewall_policy_default_action_full_packets,
                )

                check = networkfirewall_policy_default_action_full_packets()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy does not drop or forward full packets by default."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_policy_rule_group_associated_test.py]---
Location: prowler-master/tests/providers/aws/services/networkfirewall/networkfirewall_policy_rule_group_associated/networkfirewall_policy_rule_group_associated_test.py

```python
from unittest import mock

from prowler.providers.aws.services.networkfirewall.networkfirewall_service import (
    Firewall,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

FIREWALL_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall/my-firewall"
FIREWALL_NAME = "my-firewall"
VPC_ID_PROTECTED = "vpc-12345678901234567"
VPC_ID_UNPROTECTED = "vpc-12345678901234568"
POLICY_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/my-policy"


class Test_networkfirewall_policy_rule_group_associated:
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
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated import (
                    networkfirewall_policy_rule_group_associated,
                )

                check = networkfirewall_policy_rule_group_associated()
                result = check.execute()

                assert len(result) == 0

    def test_networkfirewall_policy_stateless_rule_group_associated(self):
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
                stateless_rule_groups=[
                    "arn:aws:network-firewall:us-east-1:123456789012:stateful-rule-group/my-stateless-rule-group"
                ],
            )
        }
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated import (
                    networkfirewall_policy_rule_group_associated,
                )

                check = networkfirewall_policy_rule_group_associated()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy has at least one rule group associated."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_policy_stateful_rule_group_associated(self):
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
                stateful_rule_groups=[
                    "arn:aws:network-firewall:us-east-1:123456789012:stateful-rule-group/my-stateful-rule-group"
                ],
            )
        }
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated import (
                    networkfirewall_policy_rule_group_associated,
                )

                check = networkfirewall_policy_rule_group_associated()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy has at least one rule group associated."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_policy_both_rule_groups_associated(self):
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
                stateless_rule_groups=[
                    "arn:aws:network-firewall:us-east-1:123456789012:stateful-rule-group/my-stateless-rule-group"
                ],
                stateful_rule_groups=[
                    "arn:aws:network-firewall:us-east-1:123456789012:stateful-rule-group/my-stateful-rule-group"
                ],
            )
        }

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated import (
                    networkfirewall_policy_rule_group_associated,
                )

                check = networkfirewall_policy_rule_group_associated()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy has at least one rule group associated."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_policy_no_rule_groups_associated(self):
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

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_policy_rule_group_associated.networkfirewall_policy_rule_group_associated import (
                    networkfirewall_policy_rule_group_associated,
                )

                check = networkfirewall_policy_rule_group_associated()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} policy does not have rule groups associated."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_test.py]---
Location: prowler-master/tests/providers/aws/services/opensearch/opensearch_service_test.py

```python
from json import dumps
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.opensearch.opensearch_service import (
    OpenSearchService,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_domain_name = "test"
domain_arn = f"arn:aws:es:eu-west-1:{AWS_ACCOUNT_NUMBER}:domain/{test_domain_name}"

policy_data = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": ["*"]},
            "Action": ["es:*"],
            "Resource": f"arn:aws:es:us-west-2:{AWS_ACCOUNT_NUMBER}:domain/{test_domain_name}/*",
        }
    ],
}

policy_json = dumps(policy_data)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListDomainNames":
        return {
            "DomainNames": [
                {
                    "DomainName": test_domain_name,
                },
            ]
        }
    if operation_name == "DescribeDomain":
        return {
            "DomainStatus": {
                "ARN": domain_arn,
                "Endpoints": {
                    "vpc": "vpc-endpoint-h2dsd34efgyghrtguk5gt6j2foh4.eu-west-1.es.amazonaws.com"
                },
                "EngineVersion": "opensearch-version1",
                "VPCOptions": {
                    "VPCId": "test-vpc-id",
                },
                "ClusterConfig": {
                    "DedicatedMasterEnabled": True,
                    "DedicatedMasterCount": 1,
                    "DedicatedMasterType": "m3.medium.search",
                    "InstanceCount": 1,
                    "ZoneAwarenessEnabled": True,
                },
                "CognitoOptions": {"Enabled": True},
                "EncryptionAtRestOptions": {"Enabled": True},
                "NodeToNodeEncryptionOptions": {"Enabled": True},
                "AdvancedOptions": {"string": "string"},
                "ServiceSoftwareOptions": {"UpdateAvailable": True},
                "DomainEndpointOptions": {"EnforceHTTPS": True},
                "AdvancedSecurityOptions": {
                    "Enabled": True,
                    "InternalUserDatabaseEnabled": True,
                    "SAMLOptions": {"Enabled": True},
                },
                "AccessPolicies": policy_json,
                "LogPublishingOptions": {
                    "SEARCH_SLOW_LOGS": {"Enabled": True},
                    "INDEX_SLOW_LOGS": {"Enabled": True},
                    "AUDIT_LOGS": {"Enabled": True},
                },
            }
        }
    if operation_name == "ListTags":
        return {
            "TagList": [
                {"Key": "test", "Value": "test"},
            ]
        }
    return make_api_call(self, operation_name, kwarg)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class TestOpenSearchServiceService:
    # Test OpenSearchService Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([])
        opensearch = OpenSearchService(aws_provider)
        assert opensearch.service == "opensearch"

    # Test OpenSearchService_ client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([])
        opensearch = OpenSearchService(aws_provider)
        for reg_client in opensearch.regional_clients.values():
            assert reg_client.__class__.__name__ == "OpenSearchService"

    # Test OpenSearchService session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([])
        opensearch = OpenSearchService(aws_provider)
        assert opensearch.session.__class__.__name__ == "Session"

    # Test OpenSearchService list domains names
    def test_list_domain_names(self):
        aws_provider = set_mocked_aws_provider([])
        opensearch = OpenSearchService(aws_provider)
        assert len(opensearch.opensearch_domains) == 1
        assert opensearch.opensearch_domains[domain_arn].name == test_domain_name
        assert opensearch.opensearch_domains[domain_arn].region == AWS_REGION_EU_WEST_1

    # Test OpenSearchService describe domain
    @mock_aws
    def test_describe_domain(self):
        aws_provider = set_mocked_aws_provider([])
        opensearch = OpenSearchService(aws_provider)
        assert len(opensearch.opensearch_domains) == 1
        assert opensearch.opensearch_domains[domain_arn].name == test_domain_name
        assert opensearch.opensearch_domains[domain_arn].region == AWS_REGION_EU_WEST_1
        assert opensearch.opensearch_domains[domain_arn].arn == domain_arn
        assert opensearch.opensearch_domains[domain_arn].access_policy
        assert opensearch.opensearch_domains[domain_arn].vpc_endpoints == [
            "vpc-endpoint-h2dsd34efgyghrtguk5gt6j2foh4.eu-west-1.es.amazonaws.com"
        ]
        assert opensearch.opensearch_domains[domain_arn].vpc_id == "test-vpc-id"
        assert opensearch.opensearch_domains[domain_arn].cognito_options
        assert opensearch.opensearch_domains[domain_arn].encryption_at_rest
        assert opensearch.opensearch_domains[domain_arn].node_to_node_encryption
        assert opensearch.opensearch_domains[domain_arn].enforce_https
        assert opensearch.opensearch_domains[domain_arn].internal_user_database
        assert opensearch.opensearch_domains[domain_arn].saml_enabled
        assert opensearch.opensearch_domains[domain_arn].update_available
        assert (
            opensearch.opensearch_domains[domain_arn].version == "opensearch-version1"
        )
        assert opensearch.opensearch_domains[domain_arn].instance_count == 1
        assert opensearch.opensearch_domains[domain_arn].zone_awareness_enabled
        assert opensearch.opensearch_domains[domain_arn].dedicated_master_enabled
        assert opensearch.opensearch_domains[domain_arn].dedicated_master_count == 1
        assert opensearch.opensearch_domains[domain_arn].access_policy
        assert (
            opensearch.opensearch_domains[domain_arn].logging[0].name
            == "SEARCH_SLOW_LOGS"
        )
        assert opensearch.opensearch_domains[domain_arn].logging[0].enabled
        assert (
            opensearch.opensearch_domains[domain_arn].logging[1].name
            == "INDEX_SLOW_LOGS"
        )
        assert opensearch.opensearch_domains[domain_arn].logging[1].enabled
        assert opensearch.opensearch_domains[domain_arn].logging[2].name == "AUDIT_LOGS"
        assert opensearch.opensearch_domains[domain_arn].logging[2].enabled
        assert opensearch.opensearch_domains[domain_arn].tags == [
            {"Key": "test", "Value": "test"},
        ]

    # Test OpenSearchService with missing optional fields
    @mock_aws
    def test_describe_domain_with_missing_fields(self):
        """Test case when some optional fields are missing - should handle gracefully"""

        def mock_make_api_call_missing_fields(self, operation_name, kwarg):
            if operation_name == "ListDomainNames":
                return {
                    "DomainNames": [
                        {
                            "DomainName": test_domain_name,
                        },
                    ]
                }
            if operation_name == "DescribeDomain":
                return {
                    "DomainStatus": {
                        "ARN": domain_arn,
                        "Endpoints": {
                            "vpc": "vpc-endpoint-h2dsd34efgyghrtguk5gt6j2foh4.eu-west-1.es.amazonaws.com"
                        },
                        "EngineVersion": "opensearch-version1",
                        "VPCOptions": {
                            "VPCId": "test-vpc-id",
                        },
                        "ClusterConfig": {
                            "DedicatedMasterEnabled": True,
                            "DedicatedMasterCount": 1,
                            "DedicatedMasterType": "m3.medium.search",
                            "InstanceCount": 1,
                            "ZoneAwarenessEnabled": True,
                        },
                        "CognitoOptions": {"Enabled": True},
                        "EncryptionAtRestOptions": {"Enabled": True},
                        "NodeToNodeEncryptionOptions": {"Enabled": True},
                        "AdvancedOptions": {"string": "string"},
                        "ServiceSoftwareOptions": {"UpdateAvailable": True},
                        "DomainEndpointOptions": {"EnforceHTTPS": True},
                        "AdvancedSecurityOptions": {
                            "Enabled": True,
                            "InternalUserDatabaseEnabled": True,
                            "SAMLOptions": {"Enabled": True},
                        },
                        "AccessPolicies": policy_json,
                        "LogPublishingOptions": {
                            "SEARCH_SLOW_LOGS": {"Enabled": True},
                            "INDEX_SLOW_LOGS": {"Enabled": True},
                            "AUDIT_LOGS": {"Enabled": True},
                        },
                    }
                }
            if operation_name == "ListTags":
                return {
                    "TagList": [
                        {"Key": "test", "Value": "test"},
                    ]
                }
            return make_api_call(self, operation_name, kwarg)

        with patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_missing_fields,
        ):
            aws_provider = set_mocked_aws_provider([])
            opensearch = OpenSearchService(aws_provider)

            # Should not crash even with missing optional fields
            assert len(opensearch.opensearch_domains) == 1
            assert opensearch.opensearch_domains[domain_arn].name == test_domain_name
            assert (
                opensearch.opensearch_domains[domain_arn].region == AWS_REGION_EU_WEST_1
            )
            assert opensearch.opensearch_domains[domain_arn].arn == domain_arn
```

--------------------------------------------------------------------------------

````
