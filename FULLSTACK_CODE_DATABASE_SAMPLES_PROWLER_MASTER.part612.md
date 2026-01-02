---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 612
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 612 of 867)

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

---[FILE: rds_snapshots_public_access_test.py]---
Location: prowler-master/tests/providers/aws/services/rds/rds_snapshots_public_access/rds_snapshots_public_access_test.py

```python
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeDBEngineVersions":
        return {
            "DBEngineVersions": [
                {
                    "Engine": "postgres",
                    "EngineVersion": "8.0.32",
                    "DBEngineDescription": "description",
                    "DBEngineVersionDescription": "description",
                },
            ]
        }
    # if operation_name == "DescribeDBClusterSnapshotAttributes":
    #     return {
    #         "DBClusterSnapshotAttributesResult": {
    #             "DBClusterSnapshotIdentifier": "test-snapshot",
    #             "DBClusterSnapshotAttributes": [
    #                 {"AttributeName": "restore", "AttributeValues": ["all"]}
    #             ],
    #         }
    #     }
    return make_api_call(self, operation_name, kwarg)


class Test_rds_snapshots_public_access:
    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_no_snapshots(self):
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access import (
                    rds_snapshots_public_access,
                )

                check = rds_snapshots_public_access()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_private_snapshot(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )

        conn.create_db_snapshot(
            DBInstanceIdentifier="db-primary-1", DBSnapshotIdentifier="snapshot-1"
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access import (
                    rds_snapshots_public_access,
                )

                check = rds_snapshots_public_access()
                result = check.execute()

                # Moto creates additional automatic snapshots
                assert len(result) == 2
                # Find the manual snapshot result
                manual_snapshot_result = next(
                    (r for r in result if r.resource_id == "snapshot-1"), None
                )
                assert manual_snapshot_result is not None
                assert manual_snapshot_result.status == "PASS"
                assert (
                    manual_snapshot_result.status_extended
                    == "RDS Instance Snapshot snapshot-1 is not shared."
                )

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_public_snapshot(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_instance(
            DBInstanceIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBName="staging-postgres",
            DBInstanceClass="db.m1.small",
        )

        conn.create_db_snapshot(
            DBInstanceIdentifier="db-primary-1", DBSnapshotIdentifier="snapshot-1"
        )

        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access.rds_client",
                new=RDS(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access import (
                    rds_snapshots_public_access,
                )

                # Find the manual snapshot and set it to public
                manual_snapshot = next(
                    (s for s in service_client.db_snapshots if s.id == "snapshot-1"),
                    None,
                )
                if manual_snapshot:
                    manual_snapshot.public = True
                check = rds_snapshots_public_access()
                result = check.execute()

                assert len(result) == 2
                # Find the manual snapshot result
                manual_snapshot_result = next(
                    (r for r in result if r.resource_id == "snapshot-1"), None
                )
                assert manual_snapshot_result is not None
                assert manual_snapshot_result.status == "FAIL"
                assert (
                    manual_snapshot_result.status_extended
                    == "RDS Instance Snapshot snapshot-1 is public."
                )
                assert manual_snapshot_result.resource_id == "snapshot-1"
                assert manual_snapshot_result.region == AWS_REGION_US_EAST_1
                assert (
                    manual_snapshot_result.resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:snapshot:snapshot-1"
                )
                assert manual_snapshot_result.resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_cluster_private_snapshot(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBClusterInstanceClass="db.m1.small",
            MasterUsername="root",
            MasterUserPassword="hunter2000",
        )

        conn.create_db_cluster_snapshot(
            DBClusterIdentifier="db-primary-1", DBClusterSnapshotIdentifier="snapshot-1"
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access.rds_client",
                new=RDS(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access import (
                    rds_snapshots_public_access,
                )

                check = rds_snapshots_public_access()
                result = check.execute()

                assert len(result) == 2
                # Find the manual snapshot result
                manual_snapshot_result = next(
                    (r for r in result if r.resource_id == "snapshot-1"), None
                )
                assert manual_snapshot_result is not None
                assert manual_snapshot_result.status == "PASS"
                assert (
                    manual_snapshot_result.status_extended
                    == "RDS Cluster Snapshot snapshot-1 is not shared."
                )
                assert manual_snapshot_result.resource_id == "snapshot-1"
                assert manual_snapshot_result.region == AWS_REGION_US_EAST_1
                assert (
                    manual_snapshot_result.resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
                )
                assert manual_snapshot_result.resource_tags == []

    @mock_aws
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    def test_rds_cluster_public_snapshot(self):
        conn = client("rds", region_name=AWS_REGION_US_EAST_1)
        conn.create_db_cluster(
            DBClusterIdentifier="db-primary-1",
            AllocatedStorage=10,
            Engine="postgres",
            DBClusterInstanceClass="db.m1.small",
            MasterUsername="root",
            MasterUserPassword="hunter2000",
        )

        conn.create_db_cluster_snapshot(
            DBClusterIdentifier="db-primary-1", DBClusterSnapshotIdentifier="snapshot-1"
        )
        from prowler.providers.aws.services.rds.rds_service import RDS

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access.rds_client",
                new=RDS(aws_provider),
            ) as service_client:
                # Test Check
                from prowler.providers.aws.services.rds.rds_snapshots_public_access.rds_snapshots_public_access import (
                    rds_snapshots_public_access,
                )

                # Find the manual cluster snapshot and set it to public
                manual_snapshot = next(
                    (
                        s
                        for s in service_client.db_cluster_snapshots
                        if s.id == "snapshot-1"
                    ),
                    None,
                )
                if manual_snapshot:
                    manual_snapshot.public = True
                check = rds_snapshots_public_access()
                result = check.execute()

                assert len(result) == 2
                # Find the manual snapshot result
                manual_snapshot_result = next(
                    (r for r in result if r.resource_id == "snapshot-1"), None
                )
                assert manual_snapshot_result is not None
                assert manual_snapshot_result.status == "FAIL"
                assert (
                    manual_snapshot_result.status_extended
                    == "RDS Cluster Snapshot snapshot-1 is public."
                )
                assert manual_snapshot_result.resource_id == "snapshot-1"
                assert manual_snapshot_result.region == AWS_REGION_US_EAST_1
                assert (
                    manual_snapshot_result.resource_arn
                    == f"arn:aws:rds:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:cluster-snapshot:snapshot-1"
                )
                assert manual_snapshot_result.resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: redshift_service_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_service_test.py

```python
from unittest.mock import patch
from uuid import uuid4

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.redshift.redshift_service import Redshift
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

topic_name = "test-topic"
test_policy = {
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {"AWS": f"{AWS_ACCOUNT_NUMBER}"},
            "Action": ["redshift:Publish"],
            "Resource": f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:{topic_name}",
        }
    ]
}
test_bucket_name = "test-bucket"
cluster_id = str(uuid4())

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeLoggingStatus":
        return {
            "LoggingEnabled": True,
            "BucketName": test_bucket_name,
        }
    if operation_name == "DescribeClusterSnapshots":
        return {
            "Snapshots": [
                {
                    "SnapshotIdentifier": uuid4(),
                },
            ]
        }
    if operation_name == "DescribeClusterParameters":
        return {
            "Parameters": [
                {
                    "ParameterName": "require_ssl",
                    "ParameterValue": "true",
                    "Description": "Require SSL for connections",
                    "Source": "user",
                    "DataType": "boolean",
                    "AllowedValues": "true, false",
                    "IsModifiable": True,
                    "MinimumEngineVersion": "1.0",
                },
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
class Test_Redshift_Service:
    # Test Redshift Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        redshift = Redshift(aws_provider)
        assert redshift.service == "redshift"

    # Test Redshift client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        redshift = Redshift(aws_provider)
        for reg_client in redshift.regional_clients.values():
            assert reg_client.__class__.__name__ == "Redshift"

    # Test Redshift session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        redshift = Redshift(aws_provider)
        assert redshift.session.__class__.__name__ == "Session"

    @mock_aws
    def test_describe_clusters(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        response = redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=cluster_id,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Encrypted=True,
            MultiAZ=False,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            EnhancedVpcRouting=True,
            ClusterParameterGroupName="default.redshift-1.0",
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        redshift = Redshift(aws_provider)

        assert len(redshift.clusters) == 1
        assert redshift.clusters[0].id == cluster_id
        assert redshift.clusters[0].region == AWS_REGION_EU_WEST_1
        assert redshift.clusters[0].public_access
        assert redshift.clusters[0].vpc_id == response["Cluster"].get("VpcId")
        assert redshift.clusters[0].vpc_security_groups == [
            sg["VpcSecurityGroupId"]
            for sg in response["Cluster"]["VpcSecurityGroups"]
            if sg["Status"] == "active"
        ]
        assert (
            redshift.clusters[0].endpoint_address
            == response["Cluster"]["Endpoint"]["Address"]
        )
        assert (
            redshift.clusters[0].allow_version_upgrade
            == response["Cluster"]["AllowVersionUpgrade"]
        )
        assert redshift.clusters[0].tags == [
            {"Key": "test", "Value": "test"},
        ]
        assert redshift.clusters[0].parameter_group_name == "default.redshift-1.0"
        assert redshift.clusters[0].encrypted
        # Moto does not pass the multi_az parameter back.
        assert redshift.clusters[0].multi_az == ""
        assert redshift.clusters[0].master_username == "user"
        assert redshift.clusters[0].enhanced_vpc_routing
        assert redshift.clusters[0].database_name == "test"

    @mock_aws
    def test_describe_logging_status(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        response = redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=cluster_id,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        redshift = Redshift(aws_provider)

        assert len(redshift.clusters) == 1
        assert redshift.clusters[0].id == cluster_id
        assert redshift.clusters[0].region == AWS_REGION_EU_WEST_1
        assert redshift.clusters[0].public_access
        assert (
            redshift.clusters[0].endpoint_address
            == response["Cluster"]["Endpoint"]["Address"]
        )
        assert (
            redshift.clusters[0].allow_version_upgrade
            == response["Cluster"]["AllowVersionUpgrade"]
        )
        assert redshift.clusters[0].logging_enabled
        assert redshift.clusters[0].bucket == test_bucket_name

    @mock_aws
    def test_describe_describe_cluster_snapshot(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        response = redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=cluster_id,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        redshift = Redshift(aws_provider)

        assert len(redshift.clusters) == 1
        assert redshift.clusters[0].id == cluster_id
        assert redshift.clusters[0].region == AWS_REGION_EU_WEST_1
        assert redshift.clusters[0].public_access
        assert (
            redshift.clusters[0].endpoint_address
            == response["Cluster"]["Endpoint"]["Address"]
        )
        assert (
            redshift.clusters[0].allow_version_upgrade
            == response["Cluster"]["AllowVersionUpgrade"]
        )
        assert redshift.clusters[0].logging_enabled
        assert redshift.clusters[0].bucket == test_bucket_name
        assert redshift.clusters[0].cluster_snapshots

    @mock_aws
    def test_describe_cluster_parameter_groups(self):
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        response = redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=cluster_id,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        redshift = Redshift(aws_provider)

        assert len(redshift.clusters) == 1
        assert redshift.clusters[0].id == cluster_id
        assert redshift.clusters[0].region == AWS_REGION_EU_WEST_1
        assert redshift.clusters[0].public_access
        assert (
            redshift.clusters[0].endpoint_address
            == response["Cluster"]["Endpoint"]["Address"]
        )
        assert (
            redshift.clusters[0].allow_version_upgrade
            == response["Cluster"]["AllowVersionUpgrade"]
        )
        assert redshift.clusters[0].tags == [
            {"Key": "test", "Value": "test"},
        ]
        assert redshift.clusters[0].parameter_group_name == "default.redshift-1.0"
        assert redshift.clusters[0].require_ssl is True

    @mock_aws
    def test_describe_cluster_subnets(self):
        ec2_client = client("ec2", region_name=AWS_REGION_EU_WEST_1)
        vpc_id = ec2_client.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]

        subnet_id = ec2_client.create_subnet(
            VpcId=vpc_id,
            CidrBlock="10.0.1.0/24",
            AvailabilityZone=f"{AWS_REGION_EU_WEST_1}a",
        )["Subnet"]["SubnetId"]
        redshift_client = client("redshift", region_name=AWS_REGION_EU_WEST_1)
        redshift_client.create_cluster_subnet_group(
            ClusterSubnetGroupName="test-subnet",
            Description="Test Subnet",
            SubnetIds=[subnet_id],
        )
        _ = redshift_client.create_cluster(
            DBName="test",
            ClusterIdentifier=cluster_id,
            ClusterType="single-node",
            NodeType="ds2.xlarge",
            MasterUsername="user",
            MasterUserPassword="password",
            PubliclyAccessible=True,
            VpcSecurityGroupIds=["sg-123456"],
            ClusterSubnetGroupName="test-subnet",
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        redshift = Redshift(aws_provider)

        assert len(redshift.clusters) == 1
        assert redshift.clusters[0].id == cluster_id
        assert redshift.clusters[0].region == AWS_REGION_EU_WEST_1
        assert redshift.clusters[0].subnet_group == "test-subnet"
        assert redshift.clusters[0].subnets[0] == subnet_id
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_audit_logging_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_audit_logging/redshift_cluster_audit_logging_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.redshift.redshift_service import Cluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)


class Test_redshift_cluster_audit_logging:
    def test_no_clusters(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_audit_logging.redshift_cluster_audit_logging import (
                redshift_cluster_audit_logging,
            )

            check = redshift_cluster_audit_logging()
            result = check.execute()
            assert len(result) == 0

    def test_cluster_is_not_audit_logging(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                logging_enabled=False,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_audit_logging.redshift_cluster_audit_logging import (
                redshift_cluster_audit_logging,
            )

            check = redshift_cluster_audit_logging()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Redshift Cluster {CLUSTER_ID} has audit logging disabled."
            )
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_arn == CLUSTER_ARN

    def test_cluster_is_audit_logging(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                logging_enabled=True,
                endpoint_address="192.192.192.192",
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_audit_logging.redshift_cluster_audit_logging import (
                redshift_cluster_audit_logging,
            )

            check = redshift_cluster_audit_logging()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Redshift Cluster {CLUSTER_ID} has audit logging enabled."
            )
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_arn == CLUSTER_ARN
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_automated_snapshot_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_automated_snapshot/redshift_cluster_automated_snapshot_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.redshift.redshift_service import Cluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)


class Test_redshift_cluster_automated_snapshot:
    def test_no_clusters(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_automated_snapshot.redshift_cluster_automated_snapshot import (
                redshift_cluster_automated_snapshot,
            )

            check = redshift_cluster_automated_snapshot()
            result = check.execute()
            assert len(result) == 0

    def test_cluster_is_not_performing_snapshots(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                cluster_snapshots=False,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_automated_snapshot.redshift_cluster_automated_snapshot import (
                redshift_cluster_automated_snapshot,
            )

            check = redshift_cluster_automated_snapshot()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Redshift Cluster {CLUSTER_ID} has automated snapshots disabled."
            )
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_arn == CLUSTER_ARN

    def test_cluster_is_audit_logging(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                cluster_snapshots=True,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_automated_snapshot.redshift_cluster_automated_snapshot import (
                redshift_cluster_automated_snapshot,
            )

            check = redshift_cluster_automated_snapshot()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Redshift Cluster {CLUSTER_ID} has automated snapshots enabled."
            )
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_arn == CLUSTER_ARN
```

--------------------------------------------------------------------------------

---[FILE: redshift_cluster_automatic_upgrades_test.py]---
Location: prowler-master/tests/providers/aws/services/redshift/redshift_cluster_automatic_upgrades/redshift_cluster_automatic_upgrades_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.aws.services.redshift.redshift_service import Cluster
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1

CLUSTER_ID = str(uuid4())
CLUSTER_ARN = (
    f"arn:aws:redshift:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster:{CLUSTER_ID}"
)


class Test_redshift_cluster_automatic_upgrades:
    def test_no_clusters(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_automatic_upgrades.redshift_cluster_automatic_upgrades import (
                redshift_cluster_automatic_upgrades,
            )

            check = redshift_cluster_automatic_upgrades()
            result = check.execute()
            assert len(result) == 0

    def test_cluster_not_automatic_upgrades(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                allow_version_upgrade=False,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_automatic_upgrades.redshift_cluster_automatic_upgrades import (
                redshift_cluster_automatic_upgrades,
            )

            check = redshift_cluster_automatic_upgrades()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Redshift Cluster {CLUSTER_ID} has AllowVersionUpgrade disabled."
            )
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_arn == CLUSTER_ARN

    def test_cluster_automatic_upgrades(self):
        redshift_client = mock.MagicMock
        redshift_client.clusters = []
        redshift_client.clusters.append(
            Cluster(
                id=CLUSTER_ID,
                arn=CLUSTER_ARN,
                region=AWS_REGION_EU_WEST_1,
                allow_version_upgrade=True,
            )
        )
        with (
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_service.Redshift",
                redshift_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.redshift.redshift_client.redshift_client",
                redshift_client,
            ),
        ):
            from prowler.providers.aws.services.redshift.redshift_cluster_automatic_upgrades.redshift_cluster_automatic_upgrades import (
                redshift_cluster_automatic_upgrades,
            )

            check = redshift_cluster_automatic_upgrades()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Redshift Cluster {CLUSTER_ID} has AllowVersionUpgrade enabled."
            )
            assert result[0].resource_id == CLUSTER_ID
            assert result[0].resource_arn == CLUSTER_ARN
```

--------------------------------------------------------------------------------

````
