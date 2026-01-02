---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 585
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 585 of 867)

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

---[FILE: kafka_service_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_service_test.py

```python
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.kafka.kafka_service import Kafka, KafkaConnect
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListClustersV2":
        return {
            "ClusterInfoList": [
                {
                    "ClusterType": "PROVISIONED",
                    "ClusterArn": f"arn:aws:kafka:{AWS_REGION_US_EAST_1}:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                    "ClusterName": "demo-cluster-1",
                    "State": "ACTIVE",
                    "Tags": {},
                    "Provisioned": {
                        "BrokerNodeGroupInfo": {
                            "BrokerAZDistribution": "DEFAULT",
                            "ClientSubnets": ["subnet-cbfff283", "subnet-6746046b"],
                            "InstanceType": "kafka.m5.large",
                            "SecurityGroups": ["sg-f839b688"],
                            "StorageInfo": {"EbsStorageInfo": {"VolumeSize": 100}},
                            "ConnectivityInfo": {
                                "PublicAccess": {"Type": "SERVICE_PROVIDED_EIPS"}
                            },
                        },
                        "CurrentBrokerSoftwareInfo": {"KafkaVersion": "2.2.1"},
                        "CurrentVersion": "K3AEGXETSR30VB",
                        "EncryptionInfo": {
                            "EncryptionAtRest": {
                                "DataVolumeKMSKeyId": f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c"
                            },
                            "EncryptionInTransit": {
                                "ClientBroker": "TLS_PLAINTEXT",
                                "InCluster": True,
                            },
                        },
                        "ClientAuthentication": {
                            "Tls": {"CertificateAuthorityArnList": [], "Enabled": True},
                            "Unauthenticated": {"Enabled": False},
                        },
                        "EnhancedMonitoring": "DEFAULT",
                        "OpenMonitoring": {
                            "Prometheus": {
                                "JmxExporter": {"EnabledInBroker": False},
                                "NodeExporter": {"EnabledInBroker": False},
                            }
                        },
                        "NumberOfBrokerNodes": 2,
                        "ZookeeperConnectString": f"z-2.demo-cluster-1.xuy0sb.c5.kafka.{AWS_REGION_US_EAST_1}.amazonaws.com:2181,z-1.demo-cluster-1.xuy0sb.c5.kafka.{AWS_REGION_US_EAST_1}.amazonaws.com:2181,z-3.demo-cluster-1.xuy0sb.c5.kafka.{AWS_REGION_US_EAST_1}.amazonaws.com:2181",
                    },
                },
                {
                    "ClusterType": "SERVERLESS",
                    "ClusterArn": f"arn:aws:kafka:{AWS_REGION_US_EAST_1}:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6",
                    "ClusterName": "serverless-cluster-1",
                    "State": "ACTIVE",
                    "Tags": {},
                    "Serverless": {
                        "VpcConfigs": [
                            {
                                "SubnetIds": ["subnet-cbfff283", "subnet-6746046b"],
                                "SecurityGroups": ["sg-f839b688"],
                            }
                        ],
                    },
                },
            ]
        }
    elif operation_name == "ListKafkaVersions":
        return {
            "KafkaVersions": [
                {"Version": "1.0.0", "Status": "DEPRECATED"},
                {"Version": "2.8.0", "Status": "ACTIVE"},
            ]
        }
    elif operation_name == "ListConnectors":
        return {
            "connectors": [
                {
                    "connectorName": "demo-connector",
                    "connectorArn": f"arn:aws:kafkaconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:connector/demo-connector/058406e6-a8f7-4135-8860-d4786220a395-3",
                    "kafkaClusterEncryptionInTransit": {"encryptionType": "PLAINTEXT"},
                },
            ],
        }
    return make_api_call(self, operation_name, kwarg)


class TestKafkaService:
    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_service(self):
        kafka = Kafka(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))

        # General assertions
        assert kafka.service == "kafka"
        assert kafka.__class__.__name__ == "Kafka"
        assert kafka.session.__class__.__name__ == "Session"
        assert kafka.audited_account == AWS_ACCOUNT_NUMBER

        # Clusters assertions - should now include both provisioned and serverless
        assert len(kafka.clusters) == 2

        # Check provisioned cluster
        provisioned_cluster_arn = f"arn:aws:kafka:{AWS_REGION_US_EAST_1}:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
        assert provisioned_cluster_arn in kafka.clusters
        provisioned_cluster = kafka.clusters[provisioned_cluster_arn]
        assert provisioned_cluster.id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
        assert provisioned_cluster.arn == provisioned_cluster_arn
        assert provisioned_cluster.name == "demo-cluster-1"
        assert provisioned_cluster.region == AWS_REGION_US_EAST_1
        assert provisioned_cluster.tags == []
        assert provisioned_cluster.state == "ACTIVE"
        assert provisioned_cluster.kafka_version == "2.2.1"
        assert (
            provisioned_cluster.data_volume_kms_key_id
            == f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c"
        )
        assert (
            provisioned_cluster.encryption_in_transit.client_broker == "TLS_PLAINTEXT"
        )
        assert provisioned_cluster.encryption_in_transit.in_cluster
        assert provisioned_cluster.enhanced_monitoring == "DEFAULT"
        assert provisioned_cluster.tls_authentication
        assert provisioned_cluster.public_access
        assert not provisioned_cluster.unauthentication_access

        # Check serverless cluster
        serverless_cluster_arn = f"arn:aws:kafka:{AWS_REGION_US_EAST_1}:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
        assert serverless_cluster_arn in kafka.clusters
        serverless_cluster = kafka.clusters[serverless_cluster_arn]
        assert serverless_cluster.id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
        assert serverless_cluster.arn == serverless_cluster_arn
        assert serverless_cluster.name == "serverless-cluster-1"
        assert serverless_cluster.region == AWS_REGION_US_EAST_1
        assert serverless_cluster.tags == []
        assert serverless_cluster.state == "ACTIVE"
        assert serverless_cluster.kafka_version == "SERVERLESS"
        assert serverless_cluster.data_volume_kms_key_id == "AWS_MANAGED"
        assert serverless_cluster.encryption_in_transit.client_broker == "TLS"
        assert serverless_cluster.encryption_in_transit.in_cluster
        assert serverless_cluster.enhanced_monitoring == "DEFAULT"
        assert serverless_cluster.tls_authentication
        assert not serverless_cluster.public_access
        assert not serverless_cluster.unauthentication_access

        # Kafka versions assertions
        assert len(kafka.kafka_versions) == 2
        assert kafka.kafka_versions[0].version == "1.0.0"
        assert kafka.kafka_versions[0].status == "DEPRECATED"
        assert kafka.kafka_versions[1].version == "2.8.0"
        assert kafka.kafka_versions[1].status == "ACTIVE"

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_list_connectors(self):
        kafka = KafkaConnect(set_mocked_aws_provider([AWS_REGION_US_EAST_1]))

        assert len(kafka.connectors) == 1
        connector_arn = f"arn:aws:kafkaconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:connector/demo-connector/058406e6-a8f7-4135-8860-d4786220a395-3"
        assert connector_arn in kafka.connectors
        assert kafka.connectors[connector_arn].name == "demo-connector"
        assert kafka.connectors[connector_arn].arn == connector_arn
        assert kafka.connectors[connector_arn].region == AWS_REGION_US_EAST_1
        assert kafka.connectors[connector_arn].encryption_in_transit == "PLAINTEXT"
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_encryption_at_rest_uses_cmk_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_cluster_encryption_at_rest_uses_cmk/kafka_cluster_encryption_at_rest_uses_cmk_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.kafka.kafka_service import (
    Cluster,
    EncryptionInTransit,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_kafka_cluster_encryption_at_rest_uses_cmk:
    def test_kafka_no_clusters(self):
        kafka_client = MagicMock()
        kafka_client.clusters = {}

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk import (
                kafka_cluster_encryption_at_rest_uses_cmk,
            )

            check = kafka_cluster_encryption_at_rest_uses_cmk()
            result = check.execute()

            assert len(result) == 0

    def test_kafka_cluster_encryption_at_rest_not_uses_cmk(self):
        kafka_client = MagicMock()
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                name="demo-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="2.2.1",
                data_volume_kms_key_id=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS_PLAINTEXT",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=True,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        kms_client = MagicMock()
        kms_client.keys = [
            MagicMock(
                arn=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                manager="AWS",
            )
        ]

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk.kafka_client",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk import (
                kafka_cluster_encryption_at_rest_uses_cmk,
            )

            check = kafka_cluster_encryption_at_rest_uses_cmk()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' does not have encryption at rest enabled with a CMK."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_kafka_cluster_encryption_at_rest_uses_cmk(self):
        kafka_client = MagicMock()
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                name="demo-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="2.2.1",
                data_volume_kms_key_id=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS_PLAINTEXT",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=True,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        kms_client = MagicMock()
        kms_client.keys = [
            MagicMock(
                arn=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                manager="CUSTOMER",
            )
        ]

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk.kafka_client",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk import (
                kafka_cluster_encryption_at_rest_uses_cmk,
            )

            check = kafka_cluster_encryption_at_rest_uses_cmk()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' has encryption at rest enabled with a CMK."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_kafka_cluster_serverless_encryption_at_rest(self):
        kafka_client = MagicMock()
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6",
                name="serverless-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="SERVERLESS",
                data_volume_kms_key_id="AWS_MANAGED",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=False,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        kms_client = MagicMock()
        kms_client.keys = []

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider([AWS_REGION_US_EAST_1]),
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk.kafka_client",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk.kms_client",
                new=kms_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_encryption_at_rest_uses_cmk.kafka_cluster_encryption_at_rest_uses_cmk import (
                kafka_cluster_encryption_at_rest_uses_cmk,
            )

            check = kafka_cluster_encryption_at_rest_uses_cmk()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'serverless-cluster-1' is serverless and always has encryption at rest enabled by default."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_enhanced_monitoring_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_cluster_enhanced_monitoring_enabled/kafka_cluster_enhanced_monitoring_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.kafka.kafka_service import (
    Cluster,
    EncryptionInTransit,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_kafka_cluster_enhanced_monitoring_enabled:
    def test_kafka_no_clusters(self):
        kafka_client = MagicMock
        kafka_client.clusters = {}

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_enhanced_monitoring_enabled.kafka_cluster_enhanced_monitoring_enabled import (
                kafka_cluster_enhanced_monitoring_enabled,
            )

            check = kafka_cluster_enhanced_monitoring_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_kafka_cluster_default_monitoring(self):
        kafka_client = MagicMock
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                name="demo-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="2.2.1",
                data_volume_kms_key_id=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS_PLAINTEXT",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=True,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_enhanced_monitoring_enabled.kafka_cluster_enhanced_monitoring_enabled import (
                kafka_cluster_enhanced_monitoring_enabled,
            )

            check = kafka_cluster_enhanced_monitoring_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' does not have enhanced monitoring enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_kafka_cluster_per_broker_monitoring(self):
        kafka_client = MagicMock
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                name="demo-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="2.8.0",
                data_volume_kms_key_id=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS_PLAINTEXT",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=True,
                unauthentication_access=False,
                enhanced_monitoring="PER_BROKER",
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_enhanced_monitoring_enabled.kafka_cluster_enhanced_monitoring_enabled import (
                kafka_cluster_enhanced_monitoring_enabled,
            )

            check = kafka_cluster_enhanced_monitoring_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' has enhanced monitoring enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_kafka_cluster_serverless_enhanced_monitoring(self):
        kafka_client = MagicMock
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6",
                name="serverless-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="SERVERLESS",
                data_volume_kms_key_id="AWS_MANAGED",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=False,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_enhanced_monitoring_enabled.kafka_cluster_enhanced_monitoring_enabled import (
                kafka_cluster_enhanced_monitoring_enabled,
            )

            check = kafka_cluster_enhanced_monitoring_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'serverless-cluster-1' is serverless and always has enhanced monitoring enabled by default."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_in_transit_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_cluster_in_transit_encryption_enabled/kafka_cluster_in_transit_encryption_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.kafka.kafka_service import (
    Cluster,
    EncryptionInTransit,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_kafka_cluster_in_transit_encryption_enabled:
    def test_kafka_no_clusters(self):
        kafka_client = MagicMock
        kafka_client.clusters = {}

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_in_transit_encryption_enabled.kafka_cluster_in_transit_encryption_enabled import (
                kafka_cluster_in_transit_encryption_enabled,
            )

            check = kafka_cluster_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_kafka_cluster_not_using_in_transit_encryption(self):
        kafka_client = MagicMock
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                name="demo-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="2.2.1",
                data_volume_kms_key_id=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="PLAINTEXT",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=True,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_in_transit_encryption_enabled.kafka_cluster_in_transit_encryption_enabled import (
                kafka_cluster_in_transit_encryption_enabled,
            )

            check = kafka_cluster_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' does not have encryption in transit enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_kafka_cluster_using_in_transit_encryption(self):
        kafka_client = MagicMock
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                name="demo-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="2.2.1",
                data_volume_kms_key_id=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=True,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_in_transit_encryption_enabled.kafka_cluster_in_transit_encryption_enabled import (
                kafka_cluster_in_transit_encryption_enabled,
            )

            check = kafka_cluster_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' has encryption in transit enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_kafka_cluster_using_both_encryption(self):
        kafka_client = MagicMock
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                name="demo-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="2.2.1",
                data_volume_kms_key_id=f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:key/a7ca56d5-0768-4b64-a670-339a9fbef81c",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS_PLAINTEXT",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=True,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_in_transit_encryption_enabled.kafka_cluster_in_transit_encryption_enabled import (
                kafka_cluster_in_transit_encryption_enabled,
            )

            check = kafka_cluster_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' does not have encryption in transit enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_kafka_cluster_serverless_in_transit_encryption(self):
        kafka_client = MagicMock
        kafka_client.clusters = {
            "arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6": Cluster(
                id="6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6",
                name="serverless-cluster-1",
                arn="arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6",
                region=AWS_REGION_US_EAST_1,
                tags=[],
                state="ACTIVE",
                kafka_version="SERVERLESS",
                data_volume_kms_key_id="AWS_MANAGED",
                encryption_in_transit=EncryptionInTransit(
                    client_broker="TLS",
                    in_cluster=True,
                ),
                tls_authentication=True,
                public_access=False,
                unauthentication_access=False,
                enhanced_monitoring="DEFAULT",
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.kafka.kafka_service.Kafka",
                new=kafka_client,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_client.kafka_client",
                new=kafka_client,
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_cluster_in_transit_encryption_enabled.kafka_cluster_in_transit_encryption_enabled import (
                kafka_cluster_in_transit_encryption_enabled,
            )

            check = kafka_cluster_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'serverless-cluster-1' is serverless and always has encryption in transit enabled by default."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
