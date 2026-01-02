---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 594
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 594 of 867)

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

---[FILE: neptune_cluster_uses_public_subnet_test.py]---
Location: prowler-master/tests/providers/aws/services/neptune/neptune_cluster_uses_public_subnet/neptune_cluster_uses_public_subnet_test.py

```python
from unittest import mock

from boto3 import client
from mock import MagicMock, patch
from moto import mock_aws

from prowler.providers.aws.services.neptune.neptune_service import Neptune
from prowler.providers.aws.services.vpc.vpc_service import VpcSubnet
from tests.providers.aws.services.neptune.neptune_service_test import (
    NEPTUNE_CLUSTER_NAME,
    NEPTUNE_CLUSTER_TAGS,
    NEPTUNE_ENGINE,
    SUBNET_1,
    SUBNET_2,
    mock_make_api_call,
)
from tests.providers.aws.utils import (
    AWS_REGION_US_EAST_1,
    AWS_REGION_US_EAST_1_AZA,
    AWS_REGION_US_EAST_1_AZB,
    set_mocked_aws_provider,
)

VPC_ID = "vpc-12345678901234567"


# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_neptune_cluster_uses_public_subnet:
    @mock_aws
    def test_neptune_no_clusters(self):
        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet.neptune_client",
                new=Neptune(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet import (
                neptune_cluster_uses_public_subnet,
            )

            check = neptune_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_neptune_clusters_using_private_subnets(self):
        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}
        vpc_client.vpc_subnets[SUBNET_1] = VpcSubnet(
            id=SUBNET_1,
            arn="arn_test",
            name=SUBNET_1,
            default=False,
            vpc_id=VPC_ID,
            cidr_block="192.168.0.0/24",
            availability_zone=AWS_REGION_US_EAST_1_AZA,
            public=False,
            nat_gateway=False,
            region=AWS_REGION_US_EAST_1,
            tags=[],
            mapPublicIpOnLaunch=False,
        )
        vpc_client.vpc_subnets[SUBNET_2] = VpcSubnet(
            id=SUBNET_2,
            arn="arn_test",
            name=SUBNET_2,
            default=False,
            vpc_id=VPC_ID,
            cidr_block="192.168.0.1/24",
            availability_zone=AWS_REGION_US_EAST_1_AZB,
            public=False,
            nat_gateway=False,
            region=AWS_REGION_US_EAST_1,
            tags=[],
            mapPublicIpOnLaunch=False,
        )

        # Neptune client
        neptune_client = client("neptune", region_name=AWS_REGION_US_EAST_1)
        # Create Neptune Cluster
        cluster = neptune_client.create_db_cluster(
            AvailabilityZones=[AWS_REGION_US_EAST_1_AZA, AWS_REGION_US_EAST_1_AZB],
            BackupRetentionPeriod=1,
            CopyTagsToSnapshot=True,
            Engine=NEPTUNE_ENGINE,
            DatabaseName=NEPTUNE_CLUSTER_NAME,
            DBClusterIdentifier=NEPTUNE_CLUSTER_NAME,
            Port=123,
            Tags=NEPTUNE_CLUSTER_TAGS,
            StorageEncrypted=False,
            DeletionProtection=True | False,
        )["DBCluster"]

        cluster_arn = cluster["DBClusterArn"]
        cluster_id = cluster["DbClusterResourceId"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet.neptune_client",
                new=Neptune(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet import (
                neptune_cluster_uses_public_subnet,
            )

            check = neptune_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_id} is not using public subnets."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == NEPTUNE_CLUSTER_TAGS

    @mock_aws
    def test_neptune_clusters_using_public_subnets(self):
        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}
        vpc_client.vpc_subnets[SUBNET_1] = VpcSubnet(
            id=SUBNET_1,
            arn="arn_test",
            name=SUBNET_1,
            default=False,
            vpc_id=VPC_ID,
            cidr_block="192.168.0.0/24",
            availability_zone=AWS_REGION_US_EAST_1_AZA,
            public=True,
            nat_gateway=False,
            region=AWS_REGION_US_EAST_1,
            tags=[],
            mapPublicIpOnLaunch=False,
        )
        vpc_client.vpc_subnets[SUBNET_2] = VpcSubnet(
            id=SUBNET_2,
            arn="arn_test",
            name=SUBNET_2,
            default=False,
            vpc_id=VPC_ID,
            cidr_block="192.168.0.1/24",
            availability_zone=AWS_REGION_US_EAST_1_AZB,
            public=True,
            nat_gateway=False,
            region=AWS_REGION_US_EAST_1,
            tags=[],
            mapPublicIpOnLaunch=False,
        )

        # Neptune client
        neptune_client = client("neptune", region_name=AWS_REGION_US_EAST_1)
        # Create Neptune Cluster
        cluster = neptune_client.create_db_cluster(
            AvailabilityZones=[AWS_REGION_US_EAST_1_AZA, AWS_REGION_US_EAST_1_AZB],
            BackupRetentionPeriod=1,
            CopyTagsToSnapshot=True,
            Engine=NEPTUNE_ENGINE,
            DatabaseName=NEPTUNE_CLUSTER_NAME,
            DBClusterIdentifier=NEPTUNE_CLUSTER_NAME,
            Port=123,
            Tags=NEPTUNE_CLUSTER_TAGS,
            StorageEncrypted=False,
            DeletionProtection=True | False,
        )["DBCluster"]

        cluster_arn = cluster["DBClusterArn"]
        cluster_id = cluster["DbClusterResourceId"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet.neptune_client",
                new=Neptune(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.neptune.neptune_cluster_uses_public_subnet.neptune_cluster_uses_public_subnet import (
                neptune_cluster_uses_public_subnet,
            )

            check = neptune_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Cluster {cluster_id} is using subnet-1, subnet-2 public subnets."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].resource_tags == NEPTUNE_CLUSTER_TAGS
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_service_test.py]---
Location: prowler-master/tests/providers/aws/services/networkfirewall/networkfirewall_service_test.py

```python
from unittest import mock
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.networkfirewall.networkfirewall_service import (
    Firewall,
    LogDestinationType,
    LoggingConfiguration,
    LogType,
    NetworkFirewall,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

FIREWALL_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall/my-firewall"
FIREWALL_NAME = "my-firewall"
VPC_ID = "vpc-12345678901234567"
POLICY_ARN = "arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/my-policy"

# Mocking Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListFirewalls":
        return {
            "Firewalls": [
                {"FirewallName": FIREWALL_NAME, "FirewallArn": FIREWALL_ARN},
            ]
        }
    if operation_name == "DescribeFirewall":
        return {
            "Firewall": {
                "DeleteProtection": True,
                "Description": "Description of the firewall",
                "EncryptionConfiguration": {
                    "KeyId": "my-key-id",
                    "Type": "CUSTOMER_KMS",
                },
                "FirewallArn": FIREWALL_ARN,
                "FirewallId": "firewall-id",
                "FirewallName": FIREWALL_NAME,
                "FirewallPolicyArn": POLICY_ARN,
                "FirewallPolicyChangeProtection": False,
                "SubnetChangeProtection": False,
                "SubnetMappings": [{"IPAddressType": "string", "SubnetId": "string"}],
                "Tags": [{"Key": "test_tag", "Value": "test_value"}],
                "VpcId": VPC_ID,
            }
        }

    return make_api_call(self, operation_name, kwargs)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_NetworkFirewall_Service:
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        networkfirewall = NetworkFirewall(aws_provider)
        assert (
            networkfirewall.regional_clients[AWS_REGION_US_EAST_1].__class__.__name__
            == "NetworkFirewall"
        )

    def test__get_service__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        networkfirewall = NetworkFirewall(aws_provider)
        assert networkfirewall.service == "network-firewall"

    def test_list_firewalls(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        networkfirewall = NetworkFirewall(aws_provider)
        assert len(networkfirewall.network_firewalls) == 1
        assert (
            networkfirewall.network_firewalls[FIREWALL_ARN].region
            == AWS_REGION_US_EAST_1
        )
        assert networkfirewall.network_firewalls[FIREWALL_ARN].name == FIREWALL_NAME

    def test_describe_logging_configuration(self):
        networkfirewall = mock.MagicMock
        networkfirewall.provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        networkfirewall.region = AWS_REGION_US_EAST_1
        networkfirewall.network_firewalls = {
            FIREWALL_ARN: Firewall(
                arn=FIREWALL_ARN,
                name=FIREWALL_NAME,
                region=AWS_REGION_US_EAST_1,
                policy_arn=POLICY_ARN,
                vpc_id=VPC_ID,
                tags=[{"Key": "test_tag", "Value": "test_value"}],
                encryption_type="CUSTOMER_KMS",
                logging_configuration=[
                    LoggingConfiguration(
                        log_type=LogType.flow,
                        log_destination_type=LogDestinationType.s3,
                        log_destination={
                            "bucket_name": "my-bucket",
                        },
                    )
                ],
            )
        }
        assert len(networkfirewall.network_firewalls) == 1
        assert (
            networkfirewall.network_firewalls[FIREWALL_ARN].region
            == AWS_REGION_US_EAST_1
        )
        assert networkfirewall.network_firewalls[FIREWALL_ARN].name == FIREWALL_NAME
        assert networkfirewall.network_firewalls[FIREWALL_ARN].policy_arn == POLICY_ARN
        assert networkfirewall.network_firewalls[FIREWALL_ARN].vpc_id == VPC_ID
        assert networkfirewall.network_firewalls[FIREWALL_ARN].tags == [
            {"Key": "test_tag", "Value": "test_value"}
        ]
        assert networkfirewall.network_firewalls[
            FIREWALL_ARN
        ].logging_configuration == [
            LoggingConfiguration(
                log_type=LogType.flow,
                log_destination_type=LogDestinationType.s3,
                log_destination={"bucket_name": "my-bucket"},
            )
        ]

    def test_describe_firewall(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        networkfirewall = NetworkFirewall(aws_provider)
        assert len(networkfirewall.network_firewalls) == 1
        assert (
            networkfirewall.network_firewalls[FIREWALL_ARN].region
            == AWS_REGION_US_EAST_1
        )
        assert networkfirewall.network_firewalls[FIREWALL_ARN].name == FIREWALL_NAME
        assert networkfirewall.network_firewalls[FIREWALL_ARN].policy_arn == POLICY_ARN
        assert networkfirewall.network_firewalls[FIREWALL_ARN].vpc_id == VPC_ID
        assert networkfirewall.network_firewalls[FIREWALL_ARN].tags == [
            {"Key": "test_tag", "Value": "test_value"}
        ]
        assert (
            networkfirewall.network_firewalls[FIREWALL_ARN].encryption_type
            == "CUSTOMER_KMS"
        )
        assert networkfirewall.network_firewalls[FIREWALL_ARN].deletion_protection
```

--------------------------------------------------------------------------------

---[FILE: networkfirewall_deletion_protection_test.py]---
Location: prowler-master/tests/providers/aws/services/networkfirewall/networkfirewall_deletion_protection/networkfirewall_deletion_protection_test.py

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


class Test_networkfirewall_deletion_protection:
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
                "prowler.providers.aws.services.networkfirewall.networkfirewall_deletion_protection.networkfirewall_deletion_protection.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_deletion_protection.networkfirewall_deletion_protection import (
                    networkfirewall_deletion_protection,
                )

                check = networkfirewall_deletion_protection()
                result = check.execute()

                assert len(result) == 0

    def test_networkfirewall_deletion_protection_disabled(self):
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
            )
        }
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.networkfirewall.networkfirewall_deletion_protection.networkfirewall_deletion_protection.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_deletion_protection.networkfirewall_deletion_protection import (
                    networkfirewall_deletion_protection,
                )

                check = networkfirewall_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} does not have deletion protection enabled."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN

    def test_networkfirewall_deletion_protection_enabled(self):
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
                "prowler.providers.aws.services.networkfirewall.networkfirewall_deletion_protection.networkfirewall_deletion_protection.networkfirewall_client",
                new=networkfirewall_client,
            ):
                # Test Check
                from prowler.providers.aws.services.networkfirewall.networkfirewall_deletion_protection.networkfirewall_deletion_protection import (
                    networkfirewall_deletion_protection,
                )

                check = networkfirewall_deletion_protection()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Network Firewall {FIREWALL_NAME} has deletion protection enabled."
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_id == FIREWALL_NAME
                assert result[0].resource_tags == []
                assert result[0].resource_arn == FIREWALL_ARN
```

--------------------------------------------------------------------------------

````
