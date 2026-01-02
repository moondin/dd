---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 586
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 586 of 867)

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

---[FILE: kafka_cluster_is_public_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_cluster_is_public/kafka_cluster_is_public_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.kafka.kafka_service import (
    Cluster,
    EncryptionInTransit,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_kafka_cluster_is_public:
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
            from prowler.providers.aws.services.kafka.kafka_cluster_is_public.kafka_cluster_is_public import (
                kafka_cluster_is_public,
            )

            check = kafka_cluster_is_public()
            result = check.execute()

            assert len(result) == 0

    def test_kafka_cluster_not_public(self):
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
            from prowler.providers.aws.services.kafka.kafka_cluster_is_public.kafka_cluster_is_public import (
                kafka_cluster_is_public,
            )

            check = kafka_cluster_is_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster demo-cluster-1 is not publicly accessible."
            )
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_kafka_cluster_public(self):
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
            from prowler.providers.aws.services.kafka.kafka_cluster_is_public.kafka_cluster_is_public import (
                kafka_cluster_is_public,
            )

            check = kafka_cluster_is_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka cluster demo-cluster-1 is publicly accessible."
            )
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_kafka_cluster_serverless_public(self):
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
            from prowler.providers.aws.services.kafka.kafka_cluster_is_public.kafka_cluster_is_public import (
                kafka_cluster_is_public,
            )

            check = kafka_cluster_is_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster serverless-cluster-1 is serverless and always private by default."
            )
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/serverless-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-6"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: kafka_cluster_mutual_tls_authentication_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_cluster_mutual_tls_authentication_enabled/kafka_cluster_mutual_tls_authentication_enabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.kafka.kafka_service import (
    Cluster,
    EncryptionInTransit,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_kafka_cluster_mutual_tls_authentication_enabled:
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
            from prowler.providers.aws.services.kafka.kafka_cluster_mutual_tls_authentication_enabled.kafka_cluster_mutual_tls_authentication_enabled import (
                kafka_cluster_mutual_tls_authentication_enabled,
            )

            check = kafka_cluster_mutual_tls_authentication_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_kafka_cluster_not_using_mutual_tls_authentication(self):
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
                tls_authentication=False,
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
            from prowler.providers.aws.services.kafka.kafka_cluster_mutual_tls_authentication_enabled.kafka_cluster_mutual_tls_authentication_enabled import (
                kafka_cluster_mutual_tls_authentication_enabled,
            )

            check = kafka_cluster_mutual_tls_authentication_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' does not have mutual TLS authentication enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_kafka_cluster_using_mutual_tls_authentication(self):
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
            from prowler.providers.aws.services.kafka.kafka_cluster_mutual_tls_authentication_enabled.kafka_cluster_mutual_tls_authentication_enabled import (
                kafka_cluster_mutual_tls_authentication_enabled,
            )

            check = kafka_cluster_mutual_tls_authentication_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' has mutual TLS authentication enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_kafka_cluster_serverless_mutual_tls_authentication(self):
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
            from prowler.providers.aws.services.kafka.kafka_cluster_mutual_tls_authentication_enabled.kafka_cluster_mutual_tls_authentication_enabled import (
                kafka_cluster_mutual_tls_authentication_enabled,
            )

            check = kafka_cluster_mutual_tls_authentication_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'serverless-cluster-1' is serverless and always has TLS authentication enabled by default."
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

---[FILE: kafka_cluster_unrestricted_access_disabled_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_cluster_unrestricted_access_disabled/kafka_cluster_unrestricted_access_disabled_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.kafka.kafka_service import (
    Cluster,
    EncryptionInTransit,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_kafka_cluster_unrestricted_access_disabled:
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
            from prowler.providers.aws.services.kafka.kafka_cluster_unrestricted_access_disabled.kafka_cluster_unrestricted_access_disabled import (
                kafka_cluster_unrestricted_access_disabled,
            )

            check = kafka_cluster_unrestricted_access_disabled()
            result = check.execute()

            assert len(result) == 0

    def test_kafka_cluster_unrestricted_access_enabled(self):
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
                unauthentication_access=True,
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
            from prowler.providers.aws.services.kafka.kafka_cluster_unrestricted_access_disabled.kafka_cluster_unrestricted_access_disabled import (
                kafka_cluster_unrestricted_access_disabled,
            )

            check = kafka_cluster_unrestricted_access_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' has unrestricted access enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_kafka_cluster_unrestricted_access_disabled(self):
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
            from prowler.providers.aws.services.kafka.kafka_cluster_unrestricted_access_disabled.kafka_cluster_unrestricted_access_disabled import (
                kafka_cluster_unrestricted_access_disabled,
            )

            check = kafka_cluster_unrestricted_access_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' does not have unrestricted access enabled."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    def test_kafka_cluster_serverless_unrestricted_access_disabled(self):
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
            from prowler.providers.aws.services.kafka.kafka_cluster_unrestricted_access_disabled.kafka_cluster_unrestricted_access_disabled import (
                kafka_cluster_unrestricted_access_disabled,
            )

            check = kafka_cluster_unrestricted_access_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'serverless-cluster-1' is serverless and always requires authentication by default."
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

---[FILE: kafka_cluster_uses_latest_version_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_cluster_uses_latest_version/kafka_cluster_uses_latest_version_test.py

```python
from unittest.mock import MagicMock, patch

from prowler.providers.aws.services.kafka.kafka_service import (
    Cluster,
    EncryptionInTransit,
    KafkaVersion,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1


class Test_kafka_cluster_latest_version:
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
            from prowler.providers.aws.services.kafka.kafka_cluster_uses_latest_version.kafka_cluster_uses_latest_version import (
                kafka_cluster_uses_latest_version,
            )

            check = kafka_cluster_uses_latest_version()
            result = check.execute()

            assert len(result) == 0

    def test_kafka_cluster_not_using_latest_version(self):
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

        kafka_client.kafka_versions = [
            KafkaVersion(version="1.0.0", status="DEPRECATED"),
            KafkaVersion(version="2.8.0", status="ACTIVE"),
        ]

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
            from prowler.providers.aws.services.kafka.kafka_cluster_uses_latest_version.kafka_cluster_uses_latest_version import (
                kafka_cluster_uses_latest_version,
            )

            check = kafka_cluster_uses_latest_version()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' is not using the latest version."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_kafka_cluster_using_latest_version_pass(self):
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
                enhanced_monitoring="DEFAULT",
            )
        }

        kafka_client.kafka_versions = [
            KafkaVersion(version="1.0.0", status="DEPRECATED"),
            KafkaVersion(version="2.8.0", status="ACTIVE"),
        ]

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
            from prowler.providers.aws.services.kafka.kafka_cluster_uses_latest_version.kafka_cluster_uses_latest_version import (
                kafka_cluster_uses_latest_version,
            )

            check = kafka_cluster_uses_latest_version()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'demo-cluster-1' is using the latest version."
            )
            assert result[0].resource_id == "6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            assert (
                result[0].resource_arn
                == "arn:aws:kafka:us-east-1:123456789012:cluster/demo-cluster-1/6357e0b2-0e6a-4b86-a0b4-70df934c2e31-5"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_kafka_cluster_serverless_uses_latest_version(self):
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

        kafka_client.kafka_versions = [
            KafkaVersion(version="1.0.0", status="DEPRECATED"),
            KafkaVersion(version="2.8.0", status="ACTIVE"),
        ]

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
            from prowler.providers.aws.services.kafka.kafka_cluster_uses_latest_version.kafka_cluster_uses_latest_version import (
                kafka_cluster_uses_latest_version,
            )

            check = kafka_cluster_uses_latest_version()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka cluster 'serverless-cluster-1' is serverless and AWS automatically manages the Kafka version."
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

---[FILE: kafka_connector_in_transit_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/kafka/kafka_connector_in_transit_encryption_enabled/kafka_connector_in_transit_encryption_enabled_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client

from prowler.providers.aws.services.kafka.kafka_service import KafkaConnect
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListConnectors":
        return {
            "connectors": [
                {
                    "connectorName": "connector-plaintext",
                    "connectorArn": f"arn:aws:kafkaconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:connector/connector-plaintext/058406e6-a8f7-4135-8860-d4786220a395-3",
                    "kafkaClusterEncryptionInTransit": {"encryptionType": "PLAINTEXT"},
                },
            ],
        }
    return orig(self, operation_name, kwarg)


def mock_make_api_call_v2(self, operation_name, kwarg):
    if operation_name == "ListConnectors":
        return {
            "connectors": [
                {
                    "connectorName": "connector-tls",
                    "connectorArn": f"arn:aws:kafkaconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:connector/connector-tls/058406e6-a8f7-4135-8860-d4786220a395-3",
                    "kafkaClusterEncryptionInTransit": {"encryptionType": "TLS"},
                },
            ],
        }
    return orig(self, operation_name, kwarg)


class Test_kafka_connector_in_transit_encryption_enabled:
    def test_kafka_no_connector(self):

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_connector_in_transit_encryption_enabled.kafka_connector_in_transit_encryption_enabled.kafkaconnect_client",
                new=KafkaConnect(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_connector_in_transit_encryption_enabled.kafka_connector_in_transit_encryption_enabled import (
                kafka_connector_in_transit_encryption_enabled,
            )

            check = kafka_connector_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_kafka_cluster_not_using_in_transit_encryption(self):
        client("kafkaconnect", region_name=AWS_REGION_US_EAST_1)

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_connector_in_transit_encryption_enabled.kafka_connector_in_transit_encryption_enabled.kafkaconnect_client",
                new=KafkaConnect(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_connector_in_transit_encryption_enabled.kafka_connector_in_transit_encryption_enabled import (
                kafka_connector_in_transit_encryption_enabled,
            )

            check = kafka_connector_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Kafka connector connector-plaintext does not have encryption in transit enabled."
            )
            assert result[0].resource_id == "connector-plaintext"
            assert (
                result[0].resource_arn
                == f"arn:aws:kafkaconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:connector/connector-plaintext/058406e6-a8f7-4135-8860-d4786220a395-3"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call_v2)
    def test_kafka_cluster_using_in_transit_encryption(self):

        mocked_aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=mocked_aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.kafka.kafka_connector_in_transit_encryption_enabled.kafka_connector_in_transit_encryption_enabled.kafkaconnect_client",
                new=KafkaConnect(mocked_aws_provider),
            ),
        ):
            from prowler.providers.aws.services.kafka.kafka_connector_in_transit_encryption_enabled.kafka_connector_in_transit_encryption_enabled import (
                kafka_connector_in_transit_encryption_enabled,
            )

            check = kafka_connector_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Kafka connector connector-tls has encryption in transit enabled."
            )
            assert result[0].resource_id == "connector-tls"
            assert (
                result[0].resource_arn
                == f"arn:aws:kafkaconnect:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:connector/connector-tls/058406e6-a8f7-4135-8860-d4786220a395-3"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
