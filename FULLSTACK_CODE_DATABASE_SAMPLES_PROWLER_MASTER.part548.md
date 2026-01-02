---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 548
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 548 of 867)

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

---[FILE: elasticache_cluster_uses_public_subnet_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticache/elasticache_cluster_uses_public_subnet/elasticache_cluster_uses_public_subnet_test.py

```python
from unittest import mock

from mock import MagicMock, patch
from moto import mock_aws

from prowler.providers.aws.services.elasticache.elasticache_service import Cluster
from prowler.providers.aws.services.vpc.vpc_service import VpcSubnet
from tests.providers.aws.services.elasticache.elasticache_service_test import (
    ELASTICACHE_CLUSTER_ARN,
    ELASTICACHE_CLUSTER_NAME,
    ELASTICACHE_CLUSTER_TAGS,
    ELASTICACHE_ENGINE,
    ELASTICACHE_ENGINE_MEMCACHED,
    SUBNET_1,
    SUBNET_2,
    SUBNET_GROUP_NAME,
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
class Test_elasticache_cluster_uses_public_subnet:
    @mock_aws
    def test_elasticache_no_clusters(self):
        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.clusters = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_cluster_uses_public_subnet.elasticache_cluster_uses_public_subnet import (
                elasticache_cluster_uses_public_subnet,
            )

            check = elasticache_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 0

    def test_elasticache_no_subnets(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.clusters = {}

        elasticache_service.clusters[ELASTICACHE_CLUSTER_ARN] = Cluster(
            arn=ELASTICACHE_CLUSTER_ARN,
            name=ELASTICACHE_CLUSTER_NAME,
            id=ELASTICACHE_CLUSTER_NAME,
            engine=ELASTICACHE_ENGINE,
            region=AWS_REGION_US_EAST_1,
            cache_subnet_group_id=SUBNET_GROUP_NAME,
            tags=ELASTICACHE_CLUSTER_TAGS,
        )

        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_cluster_uses_public_subnet.elasticache_cluster_uses_public_subnet import (
                elasticache_cluster_uses_public_subnet,
            )

            check = elasticache_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Elasticache Redis Node {ELASTICACHE_CLUSTER_NAME} is not using public subnets."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == ELASTICACHE_CLUSTER_NAME
            assert result[0].resource_arn == ELASTICACHE_CLUSTER_ARN
            assert result[0].resource_tags == ELASTICACHE_CLUSTER_TAGS

    def test_elasticache_clusters_using_private_subnets(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.clusters = {}

        elasticache_service.clusters[ELASTICACHE_CLUSTER_ARN] = Cluster(
            arn=ELASTICACHE_CLUSTER_ARN,
            name=ELASTICACHE_CLUSTER_NAME,
            id=ELASTICACHE_CLUSTER_NAME,
            engine=ELASTICACHE_ENGINE,
            region=AWS_REGION_US_EAST_1,
            cache_subnet_group_id=SUBNET_GROUP_NAME,
            subnets=[SUBNET_1, SUBNET_2],
            tags=ELASTICACHE_CLUSTER_TAGS,
        )

        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}
        vpc_client.vpc_subnets[SUBNET_1] = VpcSubnet(
            id=SUBNET_1,
            name=SUBNET_1,
            arn="arn_test",
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
            name=SUBNET_2,
            arn="arn_test",
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

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_cluster_uses_public_subnet.elasticache_cluster_uses_public_subnet import (
                elasticache_cluster_uses_public_subnet,
            )

            check = elasticache_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Elasticache Redis Node {ELASTICACHE_CLUSTER_NAME} is not using public subnets."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == ELASTICACHE_CLUSTER_NAME
            assert result[0].resource_arn == ELASTICACHE_CLUSTER_ARN
            assert result[0].resource_tags == ELASTICACHE_CLUSTER_TAGS

    def test_elasticache_clusters_using_public_subnets(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.clusters = {}

        elasticache_service.clusters[ELASTICACHE_CLUSTER_ARN] = Cluster(
            arn=ELASTICACHE_CLUSTER_ARN,
            name=ELASTICACHE_CLUSTER_NAME,
            id=ELASTICACHE_CLUSTER_NAME,
            engine=ELASTICACHE_ENGINE,
            region=AWS_REGION_US_EAST_1,
            cache_subnet_group_id=SUBNET_GROUP_NAME,
            subnets=[SUBNET_1, SUBNET_2],
            tags=ELASTICACHE_CLUSTER_TAGS,
        )

        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}
        vpc_client.vpc_subnets[SUBNET_1] = VpcSubnet(
            id=SUBNET_1,
            name=SUBNET_1,
            arn="arn_test",
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
            name=SUBNET_2,
            arn="arn_test",
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

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_cluster_uses_public_subnet.elasticache_cluster_uses_public_subnet import (
                elasticache_cluster_uses_public_subnet,
            )

            check = elasticache_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Elasticache Redis Node {ELASTICACHE_CLUSTER_NAME} is using subnet-1, subnet-2 public subnets."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == ELASTICACHE_CLUSTER_NAME
            assert result[0].resource_arn == ELASTICACHE_CLUSTER_ARN
            assert result[0].resource_tags == ELASTICACHE_CLUSTER_TAGS

    def test_elasticache_clusters_using_public_subnets_memcached(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.clusters = {}

        elasticache_service.clusters[ELASTICACHE_CLUSTER_ARN] = Cluster(
            arn=ELASTICACHE_CLUSTER_ARN,
            name=ELASTICACHE_CLUSTER_NAME,
            id=ELASTICACHE_CLUSTER_NAME,
            engine=ELASTICACHE_ENGINE_MEMCACHED,
            region=AWS_REGION_US_EAST_1,
            cache_subnet_group_id=SUBNET_GROUP_NAME,
            subnets=[SUBNET_1, SUBNET_2],
            tags=ELASTICACHE_CLUSTER_TAGS,
        )

        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}
        vpc_client.vpc_subnets[SUBNET_1] = VpcSubnet(
            id=SUBNET_1,
            name=SUBNET_1,
            arn="arn_test",
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
            name=SUBNET_2,
            arn="arn_test",
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

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_cluster_uses_public_subnet.elasticache_cluster_uses_public_subnet import (
                elasticache_cluster_uses_public_subnet,
            )

            check = elasticache_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Elasticache Memcached Cluster {ELASTICACHE_CLUSTER_NAME} is using subnet-1, subnet-2 public subnets."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == ELASTICACHE_CLUSTER_NAME
            assert result[0].resource_arn == ELASTICACHE_CLUSTER_ARN
            assert result[0].resource_tags == ELASTICACHE_CLUSTER_TAGS

    def test_elasticache_clusters_using_private_subnets_memchached(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.clusters = {}

        elasticache_service.clusters[ELASTICACHE_CLUSTER_ARN] = Cluster(
            arn=ELASTICACHE_CLUSTER_ARN,
            name=ELASTICACHE_CLUSTER_NAME,
            id=ELASTICACHE_CLUSTER_NAME,
            engine=ELASTICACHE_ENGINE_MEMCACHED,
            region=AWS_REGION_US_EAST_1,
            cache_subnet_group_id=SUBNET_GROUP_NAME,
            subnets=[SUBNET_1, SUBNET_2],
            tags=ELASTICACHE_CLUSTER_TAGS,
        )

        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}
        vpc_client.vpc_subnets[SUBNET_1] = VpcSubnet(
            id=SUBNET_1,
            name=SUBNET_1,
            arn="arn_test",
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
            name=SUBNET_2,
            arn="arn_test",
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

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_cluster_uses_public_subnet.elasticache_cluster_uses_public_subnet import (
                elasticache_cluster_uses_public_subnet,
            )

            check = elasticache_cluster_uses_public_subnet()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Elasticache Memcached Cluster {ELASTICACHE_CLUSTER_NAME} is not using public subnets."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == ELASTICACHE_CLUSTER_NAME
            assert result[0].resource_arn == ELASTICACHE_CLUSTER_ARN
            assert result[0].resource_tags == ELASTICACHE_CLUSTER_TAGS
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_automatic_failover_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticache/elasticache_redis_cluster_automatic_failover_enabled/elasticache_redis_cluster_automatic_failover_enabled_test.py

```python
from unittest import mock

from mock import MagicMock

from prowler.providers.aws.services.elasticache.elasticache_service import (
    ReplicationGroup,
)
from tests.providers.aws.services.elasticache.elasticache_service_test import (
    AUTO_MINOR_VERSION_UPGRADE,
    AUTOMATIC_FAILOVER,
    REPLICATION_GROUP_ARN,
    REPLICATION_GROUP_ENCRYPTION,
    REPLICATION_GROUP_ID,
    REPLICATION_GROUP_MULTI_AZ,
    REPLICATION_GROUP_SNAPSHOT_RETENTION,
    REPLICATION_GROUP_STATUS,
    REPLICATION_GROUP_TAGS,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

VPC_ID = "vpc-12345678901234567"


class Test_elasticache_redis_cluster_automatic_failover_enabled:
    def test_elasticache_no_clusters(self):
        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.replication_groups = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_cluster_automatic_failover_enabled.elasticache_redis_cluster_automatic_failover_enabled import (
                elasticache_redis_cluster_automatic_failover_enabled,
            )

            check = elasticache_redis_cluster_automatic_failover_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_elasticache_clusters_automatic_failover_disabled(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.replication_groups = {}

        elasticache_service.replication_groups[REPLICATION_GROUP_ARN] = (
            ReplicationGroup(
                arn=REPLICATION_GROUP_ARN,
                id=REPLICATION_GROUP_ID,
                region=AWS_REGION_US_EAST_1,
                status=REPLICATION_GROUP_STATUS,
                snapshot_retention=REPLICATION_GROUP_SNAPSHOT_RETENTION,
                encrypted=REPLICATION_GROUP_ENCRYPTION,
                transit_encryption=False,
                multi_az=REPLICATION_GROUP_MULTI_AZ,
                tags=REPLICATION_GROUP_TAGS,
                auto_minor_version_upgrade=not AUTO_MINOR_VERSION_UPGRADE,
                automatic_failover="disabled",
                engine_version="6.0",
                auth_token_enabled=False,
            )
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_cluster_automatic_failover_enabled.elasticache_redis_cluster_automatic_failover_enabled import (
                elasticache_redis_cluster_automatic_failover_enabled,
            )

            check = elasticache_redis_cluster_automatic_failover_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Elasticache Redis cache cluster {REPLICATION_GROUP_ID} does not have automatic failover enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == REPLICATION_GROUP_ID
            assert result[0].resource_arn == REPLICATION_GROUP_ARN
            assert result[0].resource_tags == REPLICATION_GROUP_TAGS

    def test_elasticache_clusters_automatic_failover_enabled(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.replication_groups = {}

        elasticache_service.replication_groups[REPLICATION_GROUP_ARN] = (
            ReplicationGroup(
                arn=REPLICATION_GROUP_ARN,
                id=REPLICATION_GROUP_ID,
                region=AWS_REGION_US_EAST_1,
                status=REPLICATION_GROUP_STATUS,
                snapshot_retention=REPLICATION_GROUP_SNAPSHOT_RETENTION,
                encrypted=REPLICATION_GROUP_ENCRYPTION,
                transit_encryption=False,
                multi_az=REPLICATION_GROUP_MULTI_AZ,
                tags=REPLICATION_GROUP_TAGS,
                auto_minor_version_upgrade=AUTO_MINOR_VERSION_UPGRADE,
                automatic_failover=AUTOMATIC_FAILOVER,
                engine_version="6.0",
                auth_token_enabled=False,
            )
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_cluster_automatic_failover_enabled.elasticache_redis_cluster_automatic_failover_enabled import (
                elasticache_redis_cluster_automatic_failover_enabled,
            )

            check = elasticache_redis_cluster_automatic_failover_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Elasticache Redis cache cluster {REPLICATION_GROUP_ID} does have automatic failover enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == REPLICATION_GROUP_ID
            assert result[0].resource_arn == REPLICATION_GROUP_ARN
            assert result[0].resource_tags == REPLICATION_GROUP_TAGS
```

--------------------------------------------------------------------------------

---[FILE: elasticache_redis_cluster_auto_minor_version_upgrades_test.py]---
Location: prowler-master/tests/providers/aws/services/elasticache/elasticache_redis_cluster_auto_minor_version_upgrades/elasticache_redis_cluster_auto_minor_version_upgrades_test.py

```python
from unittest import mock

from mock import MagicMock

from prowler.providers.aws.services.elasticache.elasticache_service import (
    ReplicationGroup,
)
from tests.providers.aws.services.elasticache.elasticache_service_test import (
    AUTO_MINOR_VERSION_UPGRADE,
    AUTOMATIC_FAILOVER,
    REPLICATION_GROUP_ARN,
    REPLICATION_GROUP_ENCRYPTION,
    REPLICATION_GROUP_ID,
    REPLICATION_GROUP_MULTI_AZ,
    REPLICATION_GROUP_SNAPSHOT_RETENTION,
    REPLICATION_GROUP_STATUS,
    REPLICATION_GROUP_TAGS,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

VPC_ID = "vpc-12345678901234567"


class Test_elasticache_redis_cluster_auto_minor_version_upgrades:
    def test_elasticache_no_clusters(self):
        # Mock VPC Service
        vpc_client = MagicMock
        vpc_client.vpc_subnets = {}

        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.replication_groups = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_service.VPC",
                new=vpc_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.vpc.vpc_client.vpc_client",
                new=vpc_client,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_cluster_auto_minor_version_upgrades.elasticache_redis_cluster_auto_minor_version_upgrades import (
                elasticache_redis_cluster_auto_minor_version_upgrades,
            )

            check = elasticache_redis_cluster_auto_minor_version_upgrades()
            result = check.execute()
            assert len(result) == 0

    def test_elasticache_clusters_auto_minor_version_upgrades_disabled(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.replication_groups = {}

        elasticache_service.replication_groups[REPLICATION_GROUP_ARN] = (
            ReplicationGroup(
                arn=REPLICATION_GROUP_ARN,
                id=REPLICATION_GROUP_ID,
                region=AWS_REGION_US_EAST_1,
                status=REPLICATION_GROUP_STATUS,
                snapshot_retention=REPLICATION_GROUP_SNAPSHOT_RETENTION,
                encrypted=REPLICATION_GROUP_ENCRYPTION,
                transit_encryption=False,
                multi_az=REPLICATION_GROUP_MULTI_AZ,
                tags=REPLICATION_GROUP_TAGS,
                auto_minor_version_upgrade=not AUTO_MINOR_VERSION_UPGRADE,
                automatic_failover=AUTOMATIC_FAILOVER,
                engine_version="6.0",
                auth_token_enabled=False,
            )
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_cluster_auto_minor_version_upgrades.elasticache_redis_cluster_auto_minor_version_upgrades import (
                elasticache_redis_cluster_auto_minor_version_upgrades,
            )

            check = elasticache_redis_cluster_auto_minor_version_upgrades()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Elasticache Redis cache cluster {REPLICATION_GROUP_ID} does not have automated minor version upgrades enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == REPLICATION_GROUP_ID
            assert result[0].resource_arn == REPLICATION_GROUP_ARN
            assert result[0].resource_tags == REPLICATION_GROUP_TAGS

    def test_elasticache_clusters_auto_minor_version_upgrades_enabled(self):
        # Mock ElastiCache Service
        elasticache_service = MagicMock
        elasticache_service.replication_groups = {}

        elasticache_service.replication_groups[REPLICATION_GROUP_ARN] = (
            ReplicationGroup(
                arn=REPLICATION_GROUP_ARN,
                id=REPLICATION_GROUP_ID,
                region=AWS_REGION_US_EAST_1,
                status=REPLICATION_GROUP_STATUS,
                snapshot_retention=REPLICATION_GROUP_SNAPSHOT_RETENTION,
                encrypted=REPLICATION_GROUP_ENCRYPTION,
                transit_encryption=False,
                multi_az=REPLICATION_GROUP_MULTI_AZ,
                tags=REPLICATION_GROUP_TAGS,
                auto_minor_version_upgrade=AUTO_MINOR_VERSION_UPGRADE,
                automatic_failover=AUTOMATIC_FAILOVER,
                engine_version="6.0",
                auth_token_enabled=False,
            )
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            mock.patch(
                "prowler.providers.aws.services.elasticache.elasticache_service.ElastiCache",
                new=elasticache_service,
            ),
        ):
            from prowler.providers.aws.services.elasticache.elasticache_redis_cluster_auto_minor_version_upgrades.elasticache_redis_cluster_auto_minor_version_upgrades import (
                elasticache_redis_cluster_auto_minor_version_upgrades,
            )

            check = elasticache_redis_cluster_auto_minor_version_upgrades()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Elasticache Redis cache cluster {REPLICATION_GROUP_ID} does have automated minor version upgrades enabled."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == REPLICATION_GROUP_ID
            assert result[0].resource_arn == REPLICATION_GROUP_ARN
            assert result[0].resource_tags == REPLICATION_GROUP_TAGS
```

--------------------------------------------------------------------------------

````
