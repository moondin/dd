---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 590
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 590 of 867)

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

---[FILE: macie_is_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/macie/macie_is_enabled/macie_is_enabled_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.macie.macie_service import Session
from prowler.providers.aws.services.s3.s3_service import Bucket
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_macie_is_enabled:
    @mock_aws
    def test_macie_disabled(self):
        s3_client = mock.MagicMock
        s3_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        s3_client.buckets = {}
        s3_client.regions_with_buckets = []

        macie_client = mock.MagicMock
        macie_client.provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        macie_client.audited_account = AWS_ACCOUNT_NUMBER
        macie_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        macie_client.audited_partition = "aws"
        macie_client.region = AWS_REGION_EU_WEST_1
        macie_client.sessions = [
            Session(
                status="DISABLED",
                region="eu-west-1",
            )
        ]
        macie_client.session_arn_template = f"arn:{macie_client.audited_partition}:macie:{macie_client.region}:{macie_client.audited_account}:session"
        macie_client._get_session_arn_template = mock.MagicMock(
            return_value=macie_client.session_arn_template
        )
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.macie_client",
                new=macie_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.s3_client",
                new=s3_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled import (
                macie_is_enabled,
            )

            check = macie_is_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Macie is not enabled."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:macie:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:session"
            )

    @mock_aws
    def test_macie_enabled(self):
        s3_client = mock.MagicMock
        s3_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        s3_client.buckets = {}
        s3_client.regions_with_buckets = []

        macie_client = mock.MagicMock
        macie_client.provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        macie_client.audited_account = AWS_ACCOUNT_NUMBER
        macie_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        macie_client.audited_partition = "aws"
        macie_client.region = AWS_REGION_EU_WEST_1
        macie_client.sessions = [
            Session(
                status="ENABLED",
                region="eu-west-1",
            )
        ]
        macie_client.session_arn_template = f"arn:{macie_client.audited_partition}:macie:{macie_client.region}:{macie_client.audited_account}:session"
        macie_client._get_session_arn_template = mock.MagicMock(
            return_value=macie_client.session_arn_template
        )
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.macie_client",
                new=macie_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.s3_client",
                new=s3_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled import (
                macie_is_enabled,
            )

            check = macie_is_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Macie is enabled."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:macie:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:session"
            )

    @mock_aws
    def test_macie_suspended_ignored(self):
        s3_client = mock.MagicMock
        s3_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        s3_client.buckets = {}
        s3_client.regions_with_buckets = []

        macie_client = mock.MagicMock
        macie_client.provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        macie_client.audited_account = AWS_ACCOUNT_NUMBER
        macie_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        macie_client.audited_partition = "aws"
        macie_client.region = AWS_REGION_EU_WEST_1
        macie_client.session_arn_template = f"arn:{macie_client.audited_partition}:macie:{macie_client.region}:{macie_client.audited_account}:session"
        macie_client._get_session_arn_template = mock.MagicMock(
            return_value=macie_client.session_arn_template
        )
        macie_client.sessions = [
            Session(
                status="PAUSED",
                region="eu-west-1",
            )
        ]

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        macie_client.provider._scan_unused_services = False

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.macie_client",
                new=macie_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.s3_client",
                new=s3_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled import (
                macie_is_enabled,
            )

            check = macie_is_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_macie_suspended_ignored_with_buckets(self):
        s3_client = mock.MagicMock
        s3_client.regions_with_buckets = [AWS_REGION_EU_WEST_1]
        s3_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        s3_client.buckets = [
            Bucket(
                name="test",
                arn="test-arn",
                region=AWS_REGION_EU_WEST_1,
            )
        ]

        macie_client = mock.MagicMock
        macie_client.provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        macie_client.audited_account = AWS_ACCOUNT_NUMBER
        macie_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        macie_client.audited_partition = "aws"
        macie_client.region = AWS_REGION_EU_WEST_1
        macie_client.sessions = [
            Session(
                status="PAUSED",
                region=AWS_REGION_EU_WEST_1,
            )
        ]
        macie_client.session_arn_template = f"arn:{macie_client.audited_partition}:macie:{macie_client.region}:{macie_client.audited_account}:session"
        macie_client._get_session_arn_template = mock.MagicMock(
            return_value=macie_client.session_arn_template
        )
        macie_client.provider._scan_unused_services = False
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.macie_client",
                new=macie_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.s3_client",
                new=s3_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled import (
                macie_is_enabled,
            )

            check = macie_is_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == "Macie is currently in a SUSPENDED state."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:macie:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:session"
            )

    @mock_aws
    def test_macie_suspended(self):
        s3_client = mock.MagicMock
        s3_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        macie_client = mock.MagicMock
        macie_client.provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        macie_client.audited_account = AWS_ACCOUNT_NUMBER
        macie_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        macie_client.audited_partition = "aws"
        macie_client.region = AWS_REGION_EU_WEST_1
        macie_client.sessions = [
            Session(
                status="PAUSED",
                region="eu-west-1",
            )
        ]
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        macie_client.session_arn_template = f"arn:{macie_client.audited_partition}:macie:{macie_client.region}:{macie_client.audited_account}:session"
        macie_client._get_session_arn_template = mock.MagicMock(
            return_value=macie_client.session_arn_template
        )
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.macie_client",
                new=macie_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled.s3_client",
                new=s3_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.macie.macie_is_enabled.macie_is_enabled import (
                macie_is_enabled,
            )

            check = macie_is_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == "Macie is currently in a SUSPENDED state."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:macie:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:session"
            )
```

--------------------------------------------------------------------------------

---[FILE: memorydb_service_test.py]---
Location: prowler-master/tests/providers/aws/services/memorydb/memorydb_service_test.py

```python
import botocore
from mock import patch

from prowler.providers.aws.services.memorydb.memorydb_service import Cluster, MemoryDB
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

MEM_DB_CLUSTER_NAME = "test-cluster"
MEM_DB_CLUSTER_ARN = f"arn:aws:memorydb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{MEM_DB_CLUSTER_NAME}"
MEM_DB_ENGINE_VERSION = "5.0.0"

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "DescribeClusters":
        return {
            "Clusters": [
                {
                    "Name": MEM_DB_CLUSTER_NAME,
                    "Description": "Test",
                    "Status": "test",
                    "NumberOfShards": 123,
                    "AvailabilityMode": "singleaz",
                    "Engine": "valkey",
                    "EngineVersion": MEM_DB_ENGINE_VERSION,
                    "EnginePatchVersion": "5.0.6",
                    "SecurityGroups": [
                        {"SecurityGroupId": "sg-0a1434xxxxxc9fae", "Status": "active"},
                    ],
                    "TLSEnabled": True,
                    "ARN": MEM_DB_CLUSTER_ARN,
                    "SnapshotRetentionLimit": 5,
                    "AutoMinorVersionUpgrade": True,
                },
            ]
        }
    return make_api_call(self, operation_name, kwargs)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_US_EAST_1
    )
    regional_client.region = AWS_REGION_US_EAST_1
    return {AWS_REGION_US_EAST_1: regional_client}


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
# Patch every AWS call using Boto3
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_MemoryDB_Service:
    # Test MemoryDB Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        memorydb = MemoryDB(aws_provider)
        assert memorydb.service == "memorydb"

    # Test MemoryDB Client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        memorydb = MemoryDB(aws_provider)
        assert memorydb.client.__class__.__name__ == "MemoryDB"

    # Test MemoryDB Session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        memorydb = MemoryDB(aws_provider)
        assert memorydb.session.__class__.__name__ == "Session"

    # Test MemoryDB Session
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider()
        memorydb = MemoryDB(aws_provider)
        assert memorydb.audited_account == AWS_ACCOUNT_NUMBER

    # Test MemoryDB Describe Clusters
    def test_describe_clusters(self):
        aws_provider = set_mocked_aws_provider()
        memorydb = MemoryDB(aws_provider)
        assert memorydb.clusters == {
            MEM_DB_CLUSTER_ARN: Cluster(
                name=MEM_DB_CLUSTER_NAME,
                arn=MEM_DB_CLUSTER_ARN,
                number_of_shards=123,
                engine="valkey",
                engine_version=MEM_DB_ENGINE_VERSION,
                engine_patch_version="5.0.6",
                multi_az="singleaz",
                region=AWS_REGION_US_EAST_1,
                security_groups=["sg-0a1434xxxxxc9fae"],
                tls_enabled=True,
                auto_minor_version_upgrade=True,
                snapshot_limit=5,
            )
        }


def mock_make_api_call_no_security_groups(self, operation_name, kwargs):
    """Mock that simulates a cluster response WITHOUT the SecurityGroups field"""
    if operation_name == "DescribeClusters":
        return {
            "Clusters": [
                {
                    "Name": MEM_DB_CLUSTER_NAME,
                    "Description": "Test cluster without SecurityGroups",
                    "Status": "available",
                    "NumberOfShards": 1,
                    "AvailabilityMode": "singleaz",
                    "Engine": "valkey",
                    "EngineVersion": MEM_DB_ENGINE_VERSION,
                    "EnginePatchVersion": "5.0.6",
                    # SecurityGroups field is MISSING
                    "TLSEnabled": True,
                    "ARN": MEM_DB_CLUSTER_ARN,
                    "SnapshotRetentionLimit": 5,
                    "AutoMinorVersionUpgrade": True,
                },
            ]
        }
    return make_api_call(self, operation_name, kwargs)


@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
@patch(
    "botocore.client.BaseClient._make_api_call",
    new=mock_make_api_call_no_security_groups,
)
class Test_MemoryDB_Service_No_Security_Groups:
    """Test class for clusters without SecurityGroups field"""

    def test_describe_clusters_no_security_groups(self):
        """Test that clusters without SecurityGroups field are handled correctly"""
        aws_provider = set_mocked_aws_provider()
        memorydb = MemoryDB(aws_provider)
        assert memorydb.clusters == {
            MEM_DB_CLUSTER_ARN: Cluster(
                name=MEM_DB_CLUSTER_NAME,
                arn=MEM_DB_CLUSTER_ARN,
                number_of_shards=1,
                engine="valkey",
                engine_version=MEM_DB_ENGINE_VERSION,
                engine_patch_version="5.0.6",
                multi_az="singleaz",
                region=AWS_REGION_US_EAST_1,
                security_groups=[],
                tls_enabled=True,
                auto_minor_version_upgrade=True,
                snapshot_limit=5,
            )
        }
```

--------------------------------------------------------------------------------

---[FILE: memorydb_cluster_auto_minor_version_upgrades_test.py]---
Location: prowler-master/tests/providers/aws/services/memorydb/memorydb_cluster_auto_minor_version_upgrades/memorydb_cluster_auto_minor_version_upgrades_test.py

```python
from unittest import mock

from prowler.providers.aws.services.memorydb.memorydb_service import Cluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1

memorydb_arn = (
    f"arn:aws:memorydb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
)


class Test_memorydb_cluster_auto_minor_version_upgrades:
    def test_no_memorydb(self):
        memorydb_client = mock.MagicMock
        memorydb_client.clusters = {}

        with (
            mock.patch(
                "prowler.providers.aws.services.memorydb.memorydb_service.MemoryDB",
                new=memorydb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.memorydb.memorydb_cluster_auto_minor_version_upgrades.memorydb_cluster_auto_minor_version_upgrades.memorydb_client",
                new=memorydb_client,
            ),
        ):
            from prowler.providers.aws.services.memorydb.memorydb_cluster_auto_minor_version_upgrades.memorydb_cluster_auto_minor_version_upgrades import (
                memorydb_cluster_auto_minor_version_upgrades,
            )

            check = memorydb_cluster_auto_minor_version_upgrades()
            result = check.execute()

            assert len(result) == 0

    def test_memorydb_no_minor(self):
        memorydb_client = mock.MagicMock
        memorydb_client.clusters = {}
        memorydb_client.clusters = {
            "db-cluster-1": Cluster(
                name="db-cluster-1",
                arn=memorydb_arn,
                status="available",
                number_of_shards=2,
                engine="valkey",
                engine_version="6.2",
                region=AWS_REGION_US_EAST_1,
                engine_patch_version="6.2.6",
                multi_az=True,
                SecurityGroups=[
                    {"SecurityGroupId": "sg-0a1434xxxxxc9fae", "Status": "active"}
                ],
                tls_enabled=False,
                snapshot_limit=0,
                auto_minor_version_upgrade=False,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.memorydb.memorydb_service.MemoryDB",
                new=memorydb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.memorydb.memorydb_cluster_auto_minor_version_upgrades.memorydb_cluster_auto_minor_version_upgrades.memorydb_client",
                new=memorydb_client,
            ),
        ):
            from prowler.providers.aws.services.memorydb.memorydb_cluster_auto_minor_version_upgrades.memorydb_cluster_auto_minor_version_upgrades import (
                memorydb_cluster_auto_minor_version_upgrades,
            )

            check = memorydb_cluster_auto_minor_version_upgrades()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Memory DB Cluster db-cluster-1 does not have minor version upgrade enabled."
            )
            assert result[0].resource_id == "db-cluster-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:memorydb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
            )
            assert result[0].resource_tags == []

    def test_memorydb_minor_enabled(self):
        memorydb_client = mock.MagicMock
        memorydb_client.clusters = {}
        memorydb_client.clusters = {
            "db-cluster-1": Cluster(
                name="db-cluster-1",
                arn=memorydb_arn,
                status="available",
                number_of_shards=2,
                engine="valkey",
                engine_version="6.2",
                region=AWS_REGION_US_EAST_1,
                engine_patch_version="6.2.6",
                multi_az=True,
                SecurityGroups=[
                    {"SecurityGroupId": "sg-0a1434xxxxxc9fae", "Status": "active"}
                ],
                tls_enabled=False,
                snapshot_limit=0,
                auto_minor_version_upgrade=True,
            )
        }

        with (
            mock.patch(
                "prowler.providers.aws.services.memorydb.memorydb_service.MemoryDB",
                new=memorydb_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.memorydb.memorydb_cluster_auto_minor_version_upgrades.memorydb_cluster_auto_minor_version_upgrades.memorydb_client",
                new=memorydb_client,
            ),
        ):
            from prowler.providers.aws.services.memorydb.memorydb_cluster_auto_minor_version_upgrades.memorydb_cluster_auto_minor_version_upgrades import (
                memorydb_cluster_auto_minor_version_upgrades,
            )

            check = memorydb_cluster_auto_minor_version_upgrades()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Memory DB Cluster db-cluster-1 has minor version upgrade enabled."
            )
            assert result[0].resource_id == "db-cluster-1"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:memorydb:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster:db-cluster-1"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: mq_service_test.py]---
Location: prowler-master/tests/providers/aws/services/mq/mq_service_test.py

```python
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.mq.mq_service import MQ, DeploymentMode, EngineType
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_MQ_Service:
    # Test MQ Service
    @mock_aws
    def test_service(self):
        # MQ client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        mq = MQ(aws_provider)
        assert mq.service == "mq"

    # Test MQ Client
    @mock_aws
    def test_client(self):
        # MQ client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        mq = MQ(aws_provider)
        for regional_client in mq.regional_clients.values():
            assert regional_client.__class__.__name__ == "MQ"

    # Test MQ Session
    @mock_aws
    def test__get_session__(self):
        # MQ client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        mq = MQ(aws_provider)
        assert mq.session.__class__.__name__ == "Session"

    # Test MQ List Brokers
    @mock_aws
    def test_list_brokers(self):
        # Generate MQ client
        mq_client = client("mq", region_name=AWS_REGION_EU_WEST_1)
        broker = mq_client.create_broker(
            AutoMinorVersionUpgrade=True,
            BrokerName="my-broker",
            DeploymentMode="SINGLE_INSTANCE",
            EngineType="ActiveMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            PubliclyAccessible=True,
            Users=[
                {
                    "ConsoleAccess": False,
                    "Groups": [],
                    "Password": "password",
                    "Username": "user",
                }
            ],
        )
        broker_arn = broker["BrokerArn"]

        # MQ Client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        mq = MQ(aws_provider)

        assert len(mq.brokers) == 1
        assert mq.brokers[broker_arn].arn == broker_arn
        assert mq.brokers[broker_arn].name == "my-broker"
        assert mq.brokers[broker_arn].region == AWS_REGION_EU_WEST_1
        assert mq.brokers[broker_arn].id == broker["BrokerId"]

    # Test MQ Describe Broker
    @mock_aws
    def test_describe_broker(self):
        # Generate MQ client
        mq_client = client("mq", region_name=AWS_REGION_EU_WEST_1)
        broker = mq_client.create_broker(
            AutoMinorVersionUpgrade=True,
            BrokerName="my-broker",
            DeploymentMode="SINGLE_INSTANCE",
            EngineType="ACTIVEMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            PubliclyAccessible=True,
            Users=[
                {
                    "ConsoleAccess": False,
                    "Groups": [],
                    "Password": "password",
                    "Username": "user",
                }
            ],
        )
        broker_arn = broker["BrokerArn"]
        broker["BrokerId"]

        mq_client.create_tags(
            ResourceArn=broker_arn,
            Tags={
                "key": "value",
            },
        )

        # MQ Client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        mq = MQ(aws_provider)

        assert len(mq.brokers) == 1
        assert mq.brokers[broker_arn].arn == broker_arn
        assert mq.brokers[broker_arn].name == "my-broker"
        assert mq.brokers[broker_arn].region == AWS_REGION_EU_WEST_1
        assert mq.brokers[broker_arn].id == broker["BrokerId"]
        assert mq.brokers[broker_arn].engine_type == EngineType.ACTIVEMQ
        assert mq.brokers[broker_arn].deployment_mode == DeploymentMode.SINGLE_INSTANCE
        assert mq.brokers[broker_arn].auto_minor_version_upgrade
        assert mq.brokers[broker_arn].publicly_accessible
        assert mq.brokers[broker_arn].tags == [{"key": "value"}]
```

--------------------------------------------------------------------------------

---[FILE: mq_broker_active_deployment_mode_test.py]---
Location: prowler-master/tests/providers/aws/services/mq/mq_broker_active_deployment_mode/mq_broker_active_deployment_mode_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_mq_activemq_broker_active_standby_mode:
    @mock_aws
    def test_no_brokers(self):
        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_active_deployment_mode.mq_broker_active_deployment_mode.mq_client",
                new=MQ(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.mq.mq_broker_active_deployment_mode.mq_broker_active_deployment_mode import (
                    mq_broker_active_deployment_mode,
                )

                check = mq_broker_active_deployment_mode()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_no_activemq_brokers(self):
        from prowler.providers.aws.services.mq.mq_service import MQ

        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        mq_client.create_broker(
            BrokerName="test-broker",
            EngineType="RABBITMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="ACTIVE_STANDBY_MULTI_AZ",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
        )["BrokerId"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_active_deployment_mode.mq_broker_active_deployment_mode.mq_client",
                new=MQ(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.mq.mq_broker_active_deployment_mode.mq_broker_active_deployment_mode import (
                    mq_broker_active_deployment_mode,
                )

                check = mq_broker_active_deployment_mode()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_activemq_broker_active_standby_mode_enabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        broker_id = mq_client.create_broker(
            BrokerName="test-broker",
            EngineType="ACTIVEMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="ACTIVE_STANDBY_MULTI_AZ",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=True,
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_active_deployment_mode.mq_broker_active_deployment_mode.mq_client",
                new=MQ(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.mq.mq_broker_active_deployment_mode.mq_broker_active_deployment_mode import (
                    mq_broker_active_deployment_mode,
                )

                check = mq_broker_active_deployment_mode()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"MQ Apache ActiveMQ Broker {broker_name} does have an active/standby deployment mode."
                )
                assert result[0].resource_id == broker_id
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_activemq_broker_active_standby_mode_disabled(self):
        mq_client = client("mq", region_name=AWS_REGION_US_EAST_1)
        broker_name = "test-broker"
        broker_id = mq_client.create_broker(
            BrokerName=broker_name,
            EngineType="ACTIVEMQ",
            EngineVersion="5.15.0",
            HostInstanceType="mq.t2.micro",
            Users=[
                {
                    "Username": "admin",
                    "Password": "admin",
                },
            ],
            DeploymentMode="SINGLE_INSTANCE",
            PubliclyAccessible=False,
            AutoMinorVersionUpgrade=False,
        )["BrokerId"]

        from prowler.providers.aws.services.mq.mq_service import MQ

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.mq.mq_broker_active_deployment_mode.mq_broker_active_deployment_mode.mq_client",
                new=MQ(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.mq.mq_broker_active_deployment_mode.mq_broker_active_deployment_mode import (
                    mq_broker_active_deployment_mode,
                )

                check = mq_broker_active_deployment_mode()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"MQ Apache ActiveMQ Broker {broker_name} does not have an active/standby deployment mode."
                )
                assert result[0].resource_id == broker_id
                assert (
                    result[0].resource_arn
                    == f"arn:{aws_provider.identity.partition}:mq:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:broker:{broker_id}"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

````
