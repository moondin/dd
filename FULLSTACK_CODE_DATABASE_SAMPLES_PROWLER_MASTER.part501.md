---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 501
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 501 of 867)

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

---[FILE: drs_job_exist_test.py]---
Location: prowler-master/tests/providers/aws/services/drs/drs_job_exist/drs_job_exist_test.py

```python
from unittest import mock

from prowler.providers.aws.services.drs.drs_service import DRSservice, Job

AWS_REGION = "eu-west-1"
JOB_ARN = "arn:aws:drs:eu-west-1:123456789012:job/12345678901234567890123456789012"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_drs_job_exist:
    def test_drs_job_exist(self):
        drs_client = mock.MagicMock
        drs_client.audited_account = AWS_ACCOUNT_NUMBER
        drs_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        drs_client.region = AWS_REGION
        drs_client.audited_partition = "aws"
        drs_client.drs_services = [
            DRSservice(
                id="DRS",
                status="ENABLED",
                region=AWS_REGION,
                jobs=[
                    Job(
                        arn=JOB_ARN,
                        id="12345678901234567890123456789012",
                        status="COMPLETED",
                        region=AWS_REGION,
                        tags=[{"Key": "Name", "Value": "test"}],
                    )
                ],
            )
        ]
        drs_client.recovery_job_arn_template = f"arn:{drs_client.audited_partition}:drs:{drs_client.region}:{drs_client.audited_account}:recovery-job"
        drs_client._get_recovery_job_arn_template = mock.MagicMock(
            return_value=drs_client.recovery_job_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.drs.drs_service.DRS",
            new=drs_client,
        ):
            # Test Check
            from prowler.providers.aws.services.drs.drs_job_exist.drs_job_exist import (
                drs_job_exist,
            )

            check = drs_job_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "DRS is enabled for this region with jobs."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:drs:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:recovery-job"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_drs_no_jobs(self):
        drs_client = mock.MagicMock
        drs_client.audited_account = AWS_ACCOUNT_NUMBER
        drs_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        drs_client.region = AWS_REGION
        drs_client.audited_partition = "aws"
        drs_client.drs_services = [
            DRSservice(
                id="DRS",
                status="ENABLED",
                region=AWS_REGION,
                jobs=[],
            )
        ]
        drs_client.recovery_job_arn_template = f"arn:{drs_client.audited_partition}:drs:{drs_client.region}:{drs_client.audited_account}:recovery-job"
        drs_client._get_recovery_job_arn_template = mock.MagicMock(
            return_value=drs_client.recovery_job_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.drs.drs_service.DRS",
            new=drs_client,
        ):
            # Test Check
            from prowler.providers.aws.services.drs.drs_job_exist.drs_job_exist import (
                drs_job_exist,
            )

            check = drs_job_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DRS is enabled for this region without jobs."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:drs:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:recovery-job"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_drs_disabled(self):
        drs_client = mock.MagicMock
        drs_client.audited_account = AWS_ACCOUNT_NUMBER
        drs_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        drs_client.region = AWS_REGION
        drs_client.audited_partition = "aws"
        drs_client.drs_services = [
            DRSservice(
                id="DRS",
                status="DISABLED",
                region=AWS_REGION,
                jobs=[],
            )
        ]
        drs_client.recovery_job_arn_template = f"arn:{drs_client.audited_partition}:drs:{drs_client.region}:{drs_client.audited_account}:recovery-job"
        drs_client._get_recovery_job_arn_template = mock.MagicMock(
            return_value=drs_client.recovery_job_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.drs.drs_service.DRS",
            new=drs_client,
        ):
            # Test Check
            from prowler.providers.aws.services.drs.drs_job_exist.drs_job_exist import (
                drs_job_exist,
            )

            check = drs_job_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "DRS is not enabled for this region."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:drs:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:recovery-job"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []

    def test_drs_disabled_muted(self):
        drs_client = mock.MagicMock
        drs_client.audit_config = {"mute_non_default_regions": True}
        drs_client.audited_account = AWS_ACCOUNT_NUMBER
        drs_client.audited_account_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        drs_client.audited_partition = "aws"
        drs_client.region = "eu-west-2"
        drs_client.drs_services = [
            DRSservice(
                id="DRS",
                status="DISABLED",
                region=AWS_REGION,
                jobs=[],
            )
        ]
        drs_client.recovery_job_arn_template = f"arn:{drs_client.audited_partition}:drs:{drs_client.region}:{drs_client.audited_account}:recovery-job"
        drs_client._get_recovery_job_arn_template = mock.MagicMock(
            return_value=drs_client.recovery_job_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.drs.drs_service.DRS",
            new=drs_client,
        ):
            # Test Check
            from prowler.providers.aws.services.drs.drs_job_exist.drs_job_exist import (
                drs_job_exist,
            )

            check = drs_job_exist()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].muted
            assert result[0].status_extended == "DRS is not enabled for this region."
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:drs:eu-west-2:{AWS_ACCOUNT_NUMBER}:recovery-job"
            )
            assert result[0].region == AWS_REGION
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_service_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_service_test.py

```python
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX, DynamoDB
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_DynamoDB_Service:
    # Test Dynamo Service
    @mock_aws
    def test_service(self):
        # Dynamo client for this test class
        aws_provider = set_mocked_aws_provider()
        dynamodb = DynamoDB(aws_provider)
        assert dynamodb.service == "dynamodb"

    # Test Dynamo Client
    @mock_aws
    def test_client(self):
        # Dynamo client for this test class
        aws_provider = set_mocked_aws_provider()
        dynamodb = DynamoDB(aws_provider)
        for regional_client in dynamodb.regional_clients.values():
            assert regional_client.__class__.__name__ == "DynamoDB"

    # Test Dynamo Session
    @mock_aws
    def test__get_session__(self):
        # Dynamo client for this test class
        aws_provider = set_mocked_aws_provider()
        dynamodb = DynamoDB(aws_provider)
        assert dynamodb.session.__class__.__name__ == "Session"

    # Test Dynamo Session
    @mock_aws
    def test_audited_account(self):
        # Dynamo client for this test class
        aws_provider = set_mocked_aws_provider()
        dynamodb = DynamoDB(aws_provider)
        assert dynamodb.audited_account == AWS_ACCOUNT_NUMBER

    # Test DynamoDB List Tables
    @mock_aws
    def test_list_tables(self):
        # Generate DynamoDB Client
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        # Create DynamoDB Tables
        table1_arn = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PAY_PER_REQUEST",
        )["TableDescription"]["TableArn"]
        table2_arn = dynamodb_client.create_table(
            TableName="test2",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PROVISIONED",
            ProvisionedThroughput={"ReadCapacityUnits": 5, "WriteCapacityUnits": 5},
        )["TableDescription"]["TableArn"]
        # DynamoDB client for this test class
        aws_provider = set_mocked_aws_provider()
        dynamo = DynamoDB(aws_provider)
        assert len(dynamo.tables) == 2
        table_names = [table.name for table in dynamo.tables.values()]
        assert "test1" in table_names
        assert "test2" in table_names
        assert table1_arn == list(dynamo.tables.keys())[0]
        assert table2_arn == list(dynamo.tables.keys())[1]
        for table in dynamo.tables.values():
            assert table.region == AWS_REGION_US_EAST_1
        table_billing = [table.billing_mode for table in dynamo.tables.values()]
        assert "PAY_PER_REQUEST" in table_billing
        assert "PROVISIONED" in table_billing

    # Test DynamoDB Describe Table
    @mock_aws
    def test_describe_table(self):
        # Generate DynamoDB Client
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        # Create DynamoDB Table
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PAY_PER_REQUEST",
            DeletionProtectionEnabled=True,
        )["TableDescription"]
        # DynamoDB client for this test class
        aws_provider = set_mocked_aws_provider()
        dynamo = DynamoDB(aws_provider)
        assert len(dynamo.tables) == 1
        tables_arn, tables = next(iter(dynamo.tables.items()))
        assert tables_arn == table["TableArn"]
        assert tables.name == "test1"
        assert tables.region == AWS_REGION_US_EAST_1
        assert tables.billing_mode == "PAY_PER_REQUEST"
        assert tables.deletion_protection

    # Test DynamoDB Describe Continuous Backups
    @mock_aws
    def test_describe_continuous_backups(self):
        # Generate DynamoDB Client
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        # Create DynamoDB Table
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PAY_PER_REQUEST",
        )["TableDescription"]
        dynamodb_client.update_continuous_backups(
            TableName="test1",
            PointInTimeRecoverySpecification={"PointInTimeRecoveryEnabled": True},
        )
        # DynamoDB client for this test class
        aws_provider = set_mocked_aws_provider()
        dynamo = DynamoDB(aws_provider)
        assert len(dynamo.tables) == 1
        tables_arn, tables = next(iter(dynamo.tables.items()))
        assert tables_arn == table["TableArn"]
        assert tables.name == "test1"
        assert tables.pitr
        assert tables.region == AWS_REGION_US_EAST_1

    # Test DAX Describe Clusters
    @mock_aws
    def test_describe_clusters(self):
        # Generate DAX Client
        dax_client = client("dax", region_name=AWS_REGION_US_EAST_1)
        # Create DAX Clusters
        iam_role_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/aws-service-role/dax.amazonaws.com/AWSServiceRoleForDAX"
        dax_client.create_cluster(
            ClusterName="daxcluster1",
            NodeType="dax.t3.small",
            ReplicationFactor=3,
            IamRoleArn=iam_role_arn,
            SSESpecification={"Enabled": True},
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
            ClusterEndpointEncryptionType="TLS",
        )
        dax_client.create_cluster(
            ClusterName="daxcluster2",
            NodeType="dax.t3.small",
            ReplicationFactor=3,
            IamRoleArn=iam_role_arn,
            SSESpecification={"Enabled": True},
            Tags=[
                {"Key": "test", "Value": "test"},
            ],
        )
        # DAX client for this test class
        aws_provider = set_mocked_aws_provider()
        dax = DAX(aws_provider)
        assert len(dax.clusters) == 2

        assert dax.clusters[0].name == "daxcluster1"
        assert dax.clusters[0].region == AWS_REGION_US_EAST_1
        assert dax.clusters[0].encryption
        assert dax.clusters[0].tags == [
            {"Key": "test", "Value": "test"},
        ]
        assert dax.clusters[0].tls_encryption
        assert dax.clusters[1].name == "daxcluster2"
        assert dax.clusters[1].region == AWS_REGION_US_EAST_1
        assert dax.clusters[1].encryption
        assert dax.clusters[1].tags == [
            {"Key": "test", "Value": "test"},
        ]
        assert not dax.clusters[1].tls_encryption
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_accelerator_cluster_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_encryption_enabled/dynamodb_accelerator_cluster_encryption_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_dynamodb_accelerator_cluster_encryption_enabled:
    @mock_aws
    def test_dax_no_clusters(self):
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_encryption_enabled.dynamodb_accelerator_cluster_encryption_enabled.dax_client",
                new=DAX(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_encryption_enabled.dynamodb_accelerator_cluster_encryption_enabled import (
                dynamodb_accelerator_cluster_encryption_enabled,
            )

            check = dynamodb_accelerator_cluster_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dax_cluster_no_encryption(self):
        dax_client = client("dax", region_name=AWS_REGION_US_EAST_1)
        iam_role_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/aws-service-role/dax.amazonaws.com/AWSServiceRoleForDAX"
        cluster = dax_client.create_cluster(
            ClusterName="daxcluster",
            NodeType="dax.t3.small",
            ReplicationFactor=3,
            IamRoleArn=iam_role_arn,
            ClusterEndpointEncryptionType="TLS",
        )["Cluster"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_encryption_enabled.dynamodb_accelerator_cluster_encryption_enabled.dax_client",
                new=DAX(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_encryption_enabled.dynamodb_accelerator_cluster_encryption_enabled import (
                dynamodb_accelerator_cluster_encryption_enabled,
            )

            check = dynamodb_accelerator_cluster_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DAX cluster daxcluster does not have encryption at rest enabled."
            )
            assert result[0].resource_id == cluster["ClusterName"]
            assert result[0].resource_arn == cluster["ClusterArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dax_cluster_with_encryption(self):
        dax_client = client("dax", region_name=AWS_REGION_US_EAST_1)
        iam_role_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/aws-service-role/dax.amazonaws.com/AWSServiceRoleForDAX"
        cluster = dax_client.create_cluster(
            ClusterName="daxcluster",
            NodeType="dax.t3.small",
            ReplicationFactor=3,
            IamRoleArn=iam_role_arn,
            ClusterEndpointEncryptionType="TLS",
            SSESpecification={"Enabled": True},
        )["Cluster"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_encryption_enabled.dynamodb_accelerator_cluster_encryption_enabled.dax_client",
                new=DAX(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_encryption_enabled.dynamodb_accelerator_cluster_encryption_enabled import (
                dynamodb_accelerator_cluster_encryption_enabled,
            )

            check = dynamodb_accelerator_cluster_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "DAX cluster daxcluster has encryption at rest enabled."
            )
            assert result[0].resource_id == cluster["ClusterName"]
            assert result[0].resource_arn == cluster["ClusterArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_accelerator_cluster_in_transit_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_in_transit_encryption_enabled/dynamodb_accelerator_cluster_in_transit_encryption_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_dynamodb_accelerator_cluster_in_transit_encryption_enabled:
    @mock_aws
    def test_dax_no_clusters(self):
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dax_client",
                new=DAX(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dynamodb_accelerator_cluster_in_transit_encryption_enabled import (
                dynamodb_accelerator_cluster_in_transit_encryption_enabled,
            )

            check = dynamodb_accelerator_cluster_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dax_cluster_no_encryption(self):
        dax_client = client("dax", region_name=AWS_REGION_US_EAST_1)
        iam_role_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/aws-service-role/dax.amazonaws.com/AWSServiceRoleForDAX"
        cluster = dax_client.create_cluster(
            ClusterName="daxcluster",
            NodeType="dax.t3.small",
            ReplicationFactor=3,
            IamRoleArn=iam_role_arn,
        )["Cluster"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dax_client",
                new=DAX(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dynamodb_accelerator_cluster_in_transit_encryption_enabled import (
                dynamodb_accelerator_cluster_in_transit_encryption_enabled,
            )

            check = dynamodb_accelerator_cluster_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DAX cluster daxcluster does not have encryption in transit enabled."
            )
            assert result[0].resource_id == cluster["ClusterName"]
            assert result[0].resource_arn == cluster["ClusterArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dax_cluster_with_encryption(self):
        dax_client = client("dax", region_name=AWS_REGION_US_EAST_1)
        iam_role_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/aws-service-role/dax.amazonaws.com/AWSServiceRoleForDAX"
        cluster = dax_client.create_cluster(
            ClusterName="daxcluster",
            NodeType="dax.t3.small",
            ReplicationFactor=3,
            IamRoleArn=iam_role_arn,
            ClusterEndpointEncryptionType="TLS",
        )["Cluster"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dax_client",
                new=DAX(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_in_transit_encryption_enabled.dynamodb_accelerator_cluster_in_transit_encryption_enabled import (
                dynamodb_accelerator_cluster_in_transit_encryption_enabled,
            )

            check = dynamodb_accelerator_cluster_in_transit_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "DAX cluster daxcluster has encryption in transit enabled."
            )
            assert result[0].resource_id == cluster["ClusterName"]
            assert result[0].resource_arn == cluster["ClusterArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_accelerator_cluster_multi_az_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_accelerator_cluster_multi_az/dynamodb_accelerator_cluster_multi_az_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_dynamodb_accelerator_cluster_multi_az:
    @mock_aws
    def test_dax_no_clusters(self):
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_multi_az.dynamodb_accelerator_cluster_multi_az.dax_client",
                new=DAX(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_multi_az.dynamodb_accelerator_cluster_multi_az import (
                dynamodb_accelerator_cluster_multi_az,
            )

            check = dynamodb_accelerator_cluster_multi_az()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dax_cluster_no_multi_az(self):
        dax_client = client("dax", region_name=AWS_REGION_US_EAST_1)
        iam_role_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/aws-service-role/dax.amazonaws.com/AWSServiceRoleForDAX"
        cluster = dax_client.create_cluster(
            ClusterName="daxcluster",
            NodeType="dax.t3.small",
            ReplicationFactor=3,
            IamRoleArn=iam_role_arn,
        )["Cluster"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_multi_az.dynamodb_accelerator_cluster_multi_az.dax_client",
                new=DAX(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_multi_az.dynamodb_accelerator_cluster_multi_az import (
                dynamodb_accelerator_cluster_multi_az,
            )

            check = dynamodb_accelerator_cluster_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DAX cluster daxcluster does not have nodes in multiple availability zones."
            )
            assert result[0].resource_id == cluster["ClusterName"]
            assert result[0].resource_arn == cluster["ClusterArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dax_cluster_with_multi_az(self):
        dax_client = client("dax", region_name=AWS_REGION_US_EAST_1)
        iam_role_arn = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/aws-service-role/dax.amazonaws.com/AWSServiceRoleForDAX"
        cluster = dax_client.create_cluster(
            ClusterName="daxcluster",
            NodeType="dax.t3.small",
            ReplicationFactor=3,
            IamRoleArn=iam_role_arn,
            ClusterEndpointEncryptionType="TLS",
        )["Cluster"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DAX

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_multi_az.dynamodb_accelerator_cluster_multi_az.dax_client",
                new=DAX(aws_provider),
            ) as service_client,
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_accelerator_cluster_multi_az.dynamodb_accelerator_cluster_multi_az import (
                dynamodb_accelerator_cluster_multi_az,
            )

            # Setting node_azs manually as Moto does not support that yet.
            service_client.clusters[0].node_azs = ["us-east-1a", "us-east-1b"]
            check = dynamodb_accelerator_cluster_multi_az()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "DAX cluster daxcluster has nodes in multiple availability zones."
            )
            assert result[0].resource_id == cluster["ClusterName"]
            assert result[0].resource_arn == cluster["ClusterArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: dynamodb_tables_kms_cmk_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/dynamodb/dynamodb_tables_kms_cmk_encryption_enabled/dynamodb_tables_kms_cmk_encryption_enabled_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_dynamodb_tables_kms_cmk_encryption_enabled:
    @mock_aws
    def test_dynamodb_no_tables(self):
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_tables_kms_cmk_encryption_enabled import (
                dynamodb_tables_kms_cmk_encryption_enabled,
            )

            check = dynamodb_tables_kms_cmk_encryption_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_dynamodb_table_kms_encryption(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PAY_PER_REQUEST",
            SSESpecification={"Enabled": True, "KMSMasterKeyId": "/custom-kms-key"},
        )["TableDescription"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_tables_kms_cmk_encryption_enabled import (
                dynamodb_tables_kms_cmk_encryption_enabled,
            )

            check = dynamodb_tables_kms_cmk_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "DynamoDB table test1 has KMS encryption enabled with key custom-kms-key."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock_aws
    def test_dynamodb_table_default_encryption(self):
        dynamodb_client = client("dynamodb", region_name=AWS_REGION_US_EAST_1)
        table = dynamodb_client.create_table(
            TableName="test1",
            AttributeDefinitions=[
                {"AttributeName": "client", "AttributeType": "S"},
                {"AttributeName": "app", "AttributeType": "S"},
            ],
            KeySchema=[
                {"AttributeName": "client", "KeyType": "HASH"},
                {"AttributeName": "app", "KeyType": "RANGE"},
            ],
            BillingMode="PAY_PER_REQUEST",
        )["TableDescription"]
        from prowler.providers.aws.services.dynamodb.dynamodb_service import DynamoDB

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dynamodb.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_client",
                new=DynamoDB(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.dynamodb.dynamodb_tables_kms_cmk_encryption_enabled.dynamodb_tables_kms_cmk_encryption_enabled import (
                dynamodb_tables_kms_cmk_encryption_enabled,
            )

            check = dynamodb_tables_kms_cmk_encryption_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "DynamoDB table test1 is using DEFAULT encryption."
            )
            assert result[0].resource_id == table["TableName"]
            assert result[0].resource_arn == table["TableArn"]
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
