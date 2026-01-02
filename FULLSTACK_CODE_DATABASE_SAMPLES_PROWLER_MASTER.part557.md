---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 557
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 557 of 867)

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

---[FILE: emr_cluster_publicly_accesible_test.py]---
Location: prowler-master/tests/providers/aws/services/emr/emr_cluster_publicly_accesible/emr_cluster_publicly_accesible_test.py

```python
from unittest import mock
from uuid import uuid4

from boto3 import resource
from moto import mock_aws

from prowler.providers.aws.services.emr.emr_service import Cluster, ClusterStatus, Node
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_emr_cluster_publicly_accesible:
    def test_no_clusters(self):
        # EMR Client
        emr_client = mock.MagicMock
        emr_client.clusters = {}
        # EC2 Client
        ec2_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.aws.services.emr.emr_service.EMR",
                new=emr_client,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_service.EC2",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible import (
                emr_cluster_publicly_accesible,
            )

            check = emr_cluster_publicly_accesible()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_clusters_master_public_sg(self):
        # EC2 Client
        ec2 = resource("ec2", AWS_REGION_EU_WEST_1)
        # Create Security Group
        master_security_group = ec2.create_security_group(
            GroupName=str(uuid4()), Description="test-decurity-group"
        )
        master_security_group.authorize_ingress(
            IpProtocol="tcp",
            FromPort=0,
            ToPort=65535,
            CidrIp="0.0.0.0/0",
        )

        # EMR Client
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.RUNNING,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="test.amazonaws.com",
                public=True,
                master=Node(
                    security_group_id=master_security_group.id,
                    additional_security_groups_id=[],
                ),
            )
        }

        master_expected_public_sgs = [master_security_group.id]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.emr.emr_service.EMR",
                new=emr_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible.ec2_client",
                new=EC2(set_mocked_aws_provider(create_default_organization=False)),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible import (
                emr_cluster_publicly_accesible,
            )

            check = emr_cluster_publicly_accesible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EMR Cluster {cluster_id} is publicly accessible through the following Security Groups: Master Node {master_expected_public_sgs}"
            )

    @mock_aws
    def test_clusters_master_private_sg(self):
        # EC2 Client
        ec2 = resource("ec2", AWS_REGION_EU_WEST_1)
        # Create Security Group
        master_security_group = ec2.create_security_group(
            GroupName=str(uuid4()), Description="test-decurity-group"
        )
        master_security_group.authorize_ingress(
            IpProtocol="tcp",
            FromPort=0,
            ToPort=65535,
            CidrIp="10.0.0.0/8",
        )

        # EMR Client
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.RUNNING,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="test.amazonaws.com",
                public=True,
                master=Node(
                    security_group_id=master_security_group.id,
                    additional_security_groups_id=[],
                ),
            )
        }

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.emr.emr_service.EMR",
                new=emr_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible.ec2_client",
                new=EC2(set_mocked_aws_provider(create_default_organization=False)),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible import (
                emr_cluster_publicly_accesible,
            )

            check = emr_cluster_publicly_accesible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"EMR Cluster {cluster_id} is not publicly accessible."
            )

    @mock_aws
    def test_clusters_master_private_slave_public_sg(self):
        # EC2 Client
        ec2 = resource("ec2", AWS_REGION_EU_WEST_1)
        # Create Master Security Group
        master_security_group = ec2.create_security_group(
            GroupName=str(uuid4()), Description="test-decurity-group"
        )
        master_security_group.authorize_ingress(
            IpProtocol="tcp",
            FromPort=0,
            ToPort=65535,
            CidrIp="10.0.0.0/8",
        )

        # Create Slave Security Group
        slave_security_group = ec2.create_security_group(
            GroupName=str(uuid4()), Description="test-decurity-group"
        )
        slave_security_group.authorize_ingress(
            IpProtocol="tcp",
            FromPort=0,
            ToPort=65535,
            CidrIp="0.0.0.0/0",
        )

        # EMR Client
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.RUNNING,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="test.amazonaws.com",
                public=True,
                master=Node(
                    security_group_id=master_security_group.id,
                    additional_security_groups_id=[],
                ),
                slave=Node(
                    security_group_id=slave_security_group.id,
                    additional_security_groups_id=[],
                ),
            )
        }

        slave_expected_public_sgs = [slave_security_group.id]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.emr.emr_service.EMR",
                new=emr_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible.ec2_client",
                new=EC2(set_mocked_aws_provider(create_default_organization=False)),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible import (
                emr_cluster_publicly_accesible,
            )

            check = emr_cluster_publicly_accesible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EMR Cluster {cluster_id} is publicly accessible through the following Security Groups: Slaves Nodes {slave_expected_public_sgs}"
            )

    @mock_aws
    def test_clusters_master_public_slave_private_two_sg(self):
        # EC2 Client
        ec2 = resource("ec2", AWS_REGION_EU_WEST_1)
        # Create Master Security Group
        master_security_group = ec2.create_security_group(
            GroupName=str(uuid4()), Description="test-decurity-group"
        )
        master_security_group.authorize_ingress(
            IpProtocol="tcp",
            FromPort=0,
            ToPort=65535,
            CidrIp="0.0.0.0/0",
        )

        # Create Slave Security Group
        slave_security_group = ec2.create_security_group(
            GroupName=str(uuid4()), Description="test-decurity-group"
        )
        slave_security_group.authorize_ingress(
            IpProtocol="tcp",
            FromPort=0,
            ToPort=65535,
            CidrIp="10.0.0.0/8",
        )

        # EMR Client
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.RUNNING,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="test.amazonaws.com",
                public=True,
                master=Node(
                    security_group_id=master_security_group.id,
                    additional_security_groups_id=[master_security_group.id],
                ),
                slave=Node(
                    security_group_id=slave_security_group.id,
                    additional_security_groups_id=[slave_security_group.id],
                ),
            )
        }

        master_expected_public_sgs = [
            master_security_group.id,
            master_security_group.id,
        ]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.emr.emr_service.EMR",
                new=emr_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible.ec2_client",
                new=EC2(set_mocked_aws_provider(create_default_organization=False)),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible import (
                emr_cluster_publicly_accesible,
            )

            check = emr_cluster_publicly_accesible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EMR Cluster {cluster_id} is publicly accessible through the following Security Groups: Master Node {master_expected_public_sgs}"
            )

    @mock_aws
    def test_clusters_master_private_slave_public_sg_none_additional_sgs(self):
        # EC2 Client
        ec2 = resource("ec2", AWS_REGION_EU_WEST_1)
        # Create Master Security Group
        master_security_group = ec2.create_security_group(
            GroupName=str(uuid4()), Description="test-decurity-group"
        )
        master_security_group.authorize_ingress(
            IpProtocol="tcp",
            FromPort=0,
            ToPort=65535,
            CidrIp="10.0.0.0/8",
        )

        # Create Slave Security Group
        slave_security_group = ec2.create_security_group(
            GroupName=str(uuid4()), Description="test-decurity-group"
        )
        slave_security_group.authorize_ingress(
            IpProtocol="tcp",
            FromPort=0,
            ToPort=65535,
            CidrIp="0.0.0.0/0",
        )

        # EMR Client
        emr_client = mock.MagicMock
        cluster_name = "test-cluster"
        cluster_id = "j-XWO1UKVCC6FCV"
        cluster_arn = f"arn:aws:elasticmapreduce:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:cluster/{cluster_name}"
        emr_client.clusters = {
            "test-cluster": Cluster(
                id=cluster_id,
                arn=cluster_arn,
                name=cluster_name,
                status=ClusterStatus.RUNNING,
                region=AWS_REGION_EU_WEST_1,
                master_public_dns_name="test.amazonaws.com",
                public=True,
                master=Node(
                    security_group_id=master_security_group.id,
                    additional_security_groups_id=None,
                ),
                slave=Node(
                    security_group_id=slave_security_group.id,
                    additional_security_groups_id=None,
                ),
            )
        }

        slave_expected_public_sgs = [slave_security_group.id]

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.emr.emr_service.EMR",
                new=emr_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible.ec2_client",
                new=EC2(set_mocked_aws_provider(create_default_organization=False)),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.emr.emr_cluster_publicly_accesible.emr_cluster_publicly_accesible import (
                emr_cluster_publicly_accesible,
            )

            check = emr_cluster_publicly_accesible()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == cluster_id
            assert result[0].resource_arn == cluster_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"EMR Cluster {cluster_id} is publicly accessible through the following Security Groups: Slaves Nodes {slave_expected_public_sgs}"
            )
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_service_test.py]---
Location: prowler-master/tests/providers/aws/services/eventbridge/eventbridge_service_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.eventbridge.eventbridge_service import (
    EventBridge,
    Schema,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "ListRegistries":
        return {
            "Registries": [
                {
                    "RegistryArn": "arn:aws:schemas:us-east-1:123456789012:registry/test",
                    "RegistryName": "test",
                    "Tags": {"key1": "value1"},
                },
            ]
        }
    if operation_name == "GetResourcePolicy":
        return {
            "Policy": '{"Version":"2012-10-17","Statement":[{"Sid":"AllowReadWrite","Effect":"Allow","Principal":{"AWS":"arn:aws:iam::123456789012:root"},"Action":"schemas:*","Resource":"arn:aws:schemas:eu-west-1:123456789012:registry/test"}]}',
            "RevisionId": "1",
        }
    if operation_name == "ListEndpoints":
        return {
            "Endpoints": [
                {
                    "Name": "test-endpoint",
                    "Arn": f"arn:aws:events:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint/test-endpoint",
                    "ReplicationConfig": {"State": "DISABLED"},
                }
            ]
        }

    return make_api_call(self, operation_name, kwargs)


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_EventBridge_Service:
    # Test EventBridge Service
    @mock_aws
    def test_service(self):
        # EventBridge client for this test class
        aws_provider = set_mocked_aws_provider()
        eventbridge = EventBridge(aws_provider)
        assert eventbridge.service == "events"

    # Test EventBridge Client
    @mock_aws
    def test_client(self):
        # EventBridge client for this test class
        aws_provider = set_mocked_aws_provider()
        eventbridge = EventBridge(aws_provider)
        for client_ in eventbridge.regional_clients.values():
            assert client_.__class__.__name__ == "EventBridge"

    # Test EventBridge Session
    @mock_aws
    def test__get_session__(self):
        # EventBridge client for this test class
        aws_provider = set_mocked_aws_provider()
        eventbridge = EventBridge(aws_provider)
        assert eventbridge.session.__class__.__name__ == "Session"

    # Test EventBridge Session
    @mock_aws
    def test_audited_account(self):
        # EventBridge client for this test class
        aws_provider = set_mocked_aws_provider()
        eventbridge = EventBridge(aws_provider)
        assert eventbridge.audited_account == AWS_ACCOUNT_NUMBER

    # Test Schema Service
    @mock_aws
    def test_schema_service(self):
        # Schema client for this test class
        aws_provider = set_mocked_aws_provider()
        schema = Schema(aws_provider)
        assert schema.service == "schemas"

    # Test Schema Client
    @mock_aws
    def test_schema_client(self):
        # Schema client for this test class
        aws_provider = set_mocked_aws_provider()
        schema = Schema(aws_provider)
        for client_ in schema.regional_clients.values():
            assert client_.__class__.__name__ == "Schemas"

    # Test Schema Session
    @mock_aws
    def test__schema_get_session__(self):
        # Schema client for this test class
        aws_provider = set_mocked_aws_provider()
        schema = Schema(aws_provider)
        assert schema.session.__class__.__name__ == "Session"

    # Test Schema Session
    @mock_aws
    def test_schema_audited_account(self):
        # Schema client for this test class
        aws_provider = set_mocked_aws_provider()
        schema = Schema(aws_provider)
        assert schema.audited_account == AWS_ACCOUNT_NUMBER

    # Test EventBridge Buses
    @mock_aws
    def test_list_event_buses(self):
        # EventBridge client for this test class
        events_client = client("events", region_name=AWS_REGION_US_EAST_1)
        events_client.create_event_bus(Name="test")
        events_client.tag_resource(
            ResourceARN=f"arn:aws:events:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/test",
            Tags=[{"Key": "key-1", "Value": "value-1"}],
        )
        events_client.put_permission(
            EventBusName="test",
            Action="events:PutEvents",
            Principal="123456789012",
            StatementId="test-statement",
        )
        aws_provider = set_mocked_aws_provider()
        eventbridge = EventBridge(aws_provider)
        assert len(eventbridge.buses) == 34  # 1 per region
        for bus in eventbridge.buses.values():
            if bus.name == "test":
                assert (
                    bus.arn
                    == f"arn:aws:events:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/test"
                )
                assert bus.name == "test"
                assert bus.region == AWS_REGION_US_EAST_1
                assert bus.policy == {
                    "Statement": [
                        {
                            "Action": "events:PutEvents",
                            "Effect": "Allow",
                            "Principal": {"AWS": "arn:aws:iam::123456789012:root"},
                            "Resource": "arn:aws:events:us-east-1:123456789012:event-bus/test",
                            "Sid": "test-statement",
                        }
                    ],
                    "Version": "2012-10-17",
                }
                assert bus.tags == [{"Key": "key-1", "Value": "value-1"}]

    # Test Schema Registries
    def test_list_policies(self):
        aws_provider = set_mocked_aws_provider()
        schema = Schema(aws_provider)
        assert len(schema.registries) == 1
        schema_arn = "arn:aws:schemas:us-east-1:123456789012:registry/test"
        assert schema.registries[schema_arn].arn == schema_arn
        assert schema.registries[schema_arn].name == "test"
        assert schema.registries[schema_arn].tags == [{"key1": "value1"}]
        assert schema.registries[schema_arn].policy == {
            "Statement": [
                {
                    "Action": "schemas:*",
                    "Effect": "Allow",
                    "Principal": {"AWS": "arn:aws:iam::123456789012:root"},
                    "Resource": "arn:aws:schemas:eu-west-1:123456789012:registry/test",
                    "Sid": "AllowReadWrite",
                }
            ],
            "Version": "2012-10-17",
        }

    # Test EventBridge Endpoints
    def test_list_endpoints(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        eventbridge = EventBridge(aws_provider)
        assert len(eventbridge.endpoints) == 1
        endpoint_arn = f"arn:aws:events:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint/test-endpoint"
        assert eventbridge.endpoints[endpoint_arn].name == "test-endpoint"
        assert (
            eventbridge.endpoints[endpoint_arn].arn
            == f"arn:aws:events:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:endpoint/test-endpoint"
        )
        assert eventbridge.endpoints[endpoint_arn].replication_state == "DISABLED"
        assert eventbridge.endpoints[endpoint_arn].tags == []
        assert eventbridge.endpoints[endpoint_arn].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_bus_cross_account_access_test.py]---
Location: prowler-master/tests/providers/aws/services/eventbridge/eventbridge_bus_cross_account_access/eventbridge_bus_cross_account_access_test.py

```python
from unittest import mock
from uuid import uuid4

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_bus_name = str(uuid4())
test_bus_arn = f"arn:aws:eventbridge:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/{test_bus_name}"


class Test_eventbridge_bus_cross_account_access:
    @mock_aws
    def test_default_bus(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_bus_cross_account_access.eventbridge_bus_cross_account_access.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_bus_cross_account_access.eventbridge_bus_cross_account_access import (
                eventbridge_bus_cross_account_access,
            )

            check = eventbridge_bus_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "EventBridge event bus default does not allow cross-account access."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/default"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_buses_self_account(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        events_client = client("events", region_name=AWS_REGION_EU_WEST_1)
        events_client.put_permission(
            EventBusName="default",
            Action="events:PutEvents",
            Principal=AWS_ACCOUNT_NUMBER,
            StatementId="test-statement",
        )
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_bus_cross_account_access.eventbridge_bus_cross_account_access.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_bus_cross_account_access.eventbridge_bus_cross_account_access import (
                eventbridge_bus_cross_account_access,
            )

            check = eventbridge_bus_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "EventBridge event bus default does not allow cross-account access."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/default"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_buses_other_account(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        events_client = client("events", region_name=AWS_REGION_EU_WEST_1)
        events_client.put_permission(
            EventBusName="default",
            Action="events:PutEvents",
            Principal="111122223333",
            StatementId="test-statement",
        )
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_bus_cross_account_access.eventbridge_bus_cross_account_access.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_bus_cross_account_access.eventbridge_bus_cross_account_access import (
                eventbridge_bus_cross_account_access,
            )

            check = eventbridge_bus_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "EventBridge event bus default allows cross-account access."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/default"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_buses_asterisk_principal(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        events_client = client("events", region_name=AWS_REGION_EU_WEST_1)
        events_client.put_permission(
            EventBusName="default",
            Action="events:PutEvents",
            Principal="*",
            StatementId="test-statement",
        )
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_bus_cross_account_access.eventbridge_bus_cross_account_access.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_bus_cross_account_access.eventbridge_bus_cross_account_access import (
                eventbridge_bus_cross_account_access,
            )

            check = eventbridge_bus_cross_account_access()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "EventBridge event bus default allows cross-account access."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/default"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_bus_exposed_test.py]---
Location: prowler-master/tests/providers/aws/services/eventbridge/eventbridge_bus_exposed/eventbridge_bus_exposed_test.py

```python
from unittest import mock
from uuid import uuid4

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

test_bus_name = str(uuid4())
test_bus_arn = f"arn:aws:eventbridge:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/{test_bus_name}"


class Test_eventbridge_bus_exposed:
    @mock_aws
    def test_default_bus(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_bus_exposed.eventbridge_bus_exposed.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_bus_exposed.eventbridge_bus_exposed import (
                eventbridge_bus_exposed,
            )

            check = eventbridge_bus_exposed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "EventBridge event bus default is not exposed to everyone."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/default"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_buses_self_account(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        events_client = client("events", region_name=AWS_REGION_EU_WEST_1)
        events_client.put_permission(
            EventBusName="default",
            Action="events:PutEvents",
            Principal=AWS_ACCOUNT_NUMBER,
            StatementId="test-statement",
        )
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_bus_exposed.eventbridge_bus_exposed.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_bus_exposed.eventbridge_bus_exposed import (
                eventbridge_bus_exposed,
            )

            check = eventbridge_bus_exposed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "EventBridge event bus default is not exposed to everyone."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/default"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_buses_other_account(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        events_client = client("events", region_name=AWS_REGION_EU_WEST_1)
        events_client.put_permission(
            EventBusName="default",
            Action="events:PutEvents",
            Principal="111122223333",
            StatementId="test-statement",
        )
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_bus_exposed.eventbridge_bus_exposed.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_bus_exposed.eventbridge_bus_exposed import (
                eventbridge_bus_exposed,
            )

            check = eventbridge_bus_exposed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "EventBridge event bus default is not exposed to everyone."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/default"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_buses_asterisk_principal(self):
        from prowler.providers.aws.services.eventbridge.eventbridge_service import (
            EventBridge,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        events_client = client("events", region_name=AWS_REGION_EU_WEST_1)
        events_client.put_permission(
            EventBusName="default",
            Action="events:PutEvents",
            Principal="*",
            StatementId="test-statement",
        )
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.eventbridge.eventbridge_bus_exposed.eventbridge_bus_exposed.eventbridge_client",
                new=EventBridge(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.eventbridge.eventbridge_bus_exposed.eventbridge_bus_exposed import (
                eventbridge_bus_exposed,
            )

            check = eventbridge_bus_exposed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "EventBridge event bus default is exposed to everyone."
            )
            assert result[0].resource_id == "default"
            assert (
                result[0].resource_arn
                == f"arn:aws:events:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:event-bus/default"
            )
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
