---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 494
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 494 of 867)

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

---[FILE: directconnect_virtual_interface_redundancy_test.py]---
Location: prowler-master/tests/providers/aws/services/directconnect/directconnect_virtual_interface_redundancy/directconnect_virtual_interface_redundancy_test.py

```python
from unittest import mock

from prowler.providers.aws.services.directconnect.directconnect_service import (
    DXGateway,
    VirtualGateway,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_directconnect_virtual_interface_redundancy:
    def test_no_vif(self):
        dx_client = mock.MagicMock
        dx_client.vgws = {}
        dx_client.dxgws = {}
        with mock.patch(
            "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
            new=dx_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_virtual_interface_redundancy.directconnect_virtual_interface_redundancy import (
                directconnect_virtual_interface_redundancy,
            )

            check = directconnect_virtual_interface_redundancy()
            result = check.execute()

            assert len(result) == 0

    def test_single_vif_single_connection_vgw(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.region = AWS_REGION
        dx_client.vgws = {}
        dx_client.dxgws = {}
        dx_client.vgws = {
            "vgw-test": VirtualGateway(
                arn="vgw-test",
                id="vgw-test",
                vifs=["vif-id"],
                connections=["dx-conn"],
                region="eu-west-1",
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
            new=dx_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_virtual_interface_redundancy.directconnect_virtual_interface_redundancy import (
                directconnect_virtual_interface_redundancy,
            )

            check = directconnect_virtual_interface_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Virtual private gateway vgw-test only has one VIF."
            )
            assert result[0].resource_id == "vgw-test"
            assert result[0].resource_arn == "vgw-test"
            assert result[0].region == AWS_REGION

    def test_multiple_vifs_single_connection_vgw(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.region = AWS_REGION
        dx_client.vgws = {}
        dx_client.dxgws = {}
        dx_client.vgws = {
            "vgw-test": VirtualGateway(
                arn="vgw-test",
                id="vgw-test",
                vifs=["vif-id", "vif-id2"],
                connections=["dx-conn"],
                region="eu-west-1",
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
            new=dx_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_virtual_interface_redundancy.directconnect_virtual_interface_redundancy import (
                directconnect_virtual_interface_redundancy,
            )

            check = directconnect_virtual_interface_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Virtual private gateway vgw-test has more than 1 VIFs, but all the VIFs are on the same DX Connection."
            )
            assert result[0].resource_id == "vgw-test"
            assert result[0].resource_arn == "vgw-test"
            assert result[0].region == AWS_REGION

    def test_multiple_vifs_multiple_connections_vgw(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.region = AWS_REGION
        dx_client.vgws = {}
        dx_client.dxgws = {}
        dx_client.vgws = {
            "vgw-test": VirtualGateway(
                arn="vgw-test",
                id="vgw-test",
                vifs=["vif-id", "vif-id2"],
                connections=["dx-conn", "dx-conn2"],
                region="eu-west-1",
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
            new=dx_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_virtual_interface_redundancy.directconnect_virtual_interface_redundancy import (
                directconnect_virtual_interface_redundancy,
            )

            check = directconnect_virtual_interface_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Virtual private gateway vgw-test has more than 1 VIFs and the VIFs are on more than one DX connection."
            )
            assert result[0].resource_id == "vgw-test"
            assert result[0].resource_arn == "vgw-test"
            assert result[0].region == AWS_REGION

    def test_single_vif_single_connection_dxgw(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.region = AWS_REGION
        dx_client.vgws = {}
        dx_client.dxgws = {}
        dx_client.dxgws = {
            "dx-test": DXGateway(
                arn="dx-test",
                id="dx-test",
                vifs=["vif-id"],
                connections=["dx-conn"],
                region="eu-west-1",
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
            new=dx_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_virtual_interface_redundancy.directconnect_virtual_interface_redundancy import (
                directconnect_virtual_interface_redundancy,
            )

            check = directconnect_virtual_interface_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Direct Connect gateway dx-test only has one VIF."
            )
            assert result[0].resource_id == "dx-test"
            assert result[0].resource_arn == "dx-test"
            assert result[0].region == AWS_REGION

    def test_multiple_vifs_single_connection_dxgw(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.region = AWS_REGION
        dx_client.vgws = {}
        dx_client.dxgws = {}
        dx_client.dxgws = {
            "dx-test": DXGateway(
                arn="dx-test",
                id="dx-test",
                vifs=["vif-id", "vif-id2"],
                connections=["dx-conn"],
                region="eu-west-1",
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
            new=dx_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_virtual_interface_redundancy.directconnect_virtual_interface_redundancy import (
                directconnect_virtual_interface_redundancy,
            )

            check = directconnect_virtual_interface_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Direct Connect gateway dx-test has more than 1 VIFs, but all the VIFs are on the same DX Connection."
            )
            assert result[0].resource_id == "dx-test"
            assert result[0].resource_arn == "dx-test"
            assert result[0].region == AWS_REGION

    def test_multiple_vifs_multiple_connections_dxgw(self):
        dx_client = mock.MagicMock
        dx_client.audited_account = AWS_ACCOUNT_NUMBER
        dx_client.region = AWS_REGION
        dx_client.vgws = {}
        dx_client.dxgws = {}
        dx_client.dxgws = {
            "dx-test": DXGateway(
                arn="dx-test",
                id="dx-test",
                vifs=["vif-id", "vif-id2"],
                connections=["dx-conn", "dx-conn2"],
                region="eu-west-1",
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directconnect.directconnect_service.DirectConnect",
            new=dx_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directconnect.directconnect_virtual_interface_redundancy.directconnect_virtual_interface_redundancy import (
                directconnect_virtual_interface_redundancy,
            )

            check = directconnect_virtual_interface_redundancy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Direct Connect gateway dx-test has more than 1 VIFs and the VIFs are on more than one DX connection."
            )
            assert result[0].resource_id == "dx-test"
            assert result[0].resource_arn == "dx-test"
            assert result[0].region == AWS_REGION
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_service_test.py]---
Location: prowler-master/tests/providers/aws/services/directoryservice/directoryservice_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    AuthenticationProtocol,
    CertificateState,
    CertificateType,
    DirectoryService,
    DirectoryType,
    EventTopicStatus,
    RadiusStatus,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "DescribeDirectories":
        return {
            "DirectoryDescriptions": [
                {
                    "DirectoryId": "d-12345a1b2",
                    "Name": "test-directory",
                    "Type": "MicrosoftAD",
                    "ShortName": "test-directory",
                    "RadiusSettings": {
                        "RadiusServers": [
                            "test-server",
                        ],
                        "RadiusPort": 9999,
                        "RadiusTimeout": 100,
                        "RadiusRetries": 100,
                        "SharedSecret": "test-shared-secret",
                        "AuthenticationProtocol": "MS-CHAPv2",
                        "DisplayLabel": "test-directory",
                        "UseSameUsername": True | False,
                    },
                    "RadiusStatus": "Creating",
                },
            ],
        }
    if operation_name == "ListLogSubscriptions":
        return {
            "LogSubscriptions": [
                {
                    "DirectoryId": "d-12345a1b2",
                    "LogGroupName": "test-log-group",
                    "SubscriptionCreatedDateTime": datetime(2022, 1, 1),
                },
            ],
        }
    if operation_name == "DescribeEventTopics":
        return {
            "EventTopics": [
                {
                    "DirectoryId": "d-12345a1b2",
                    "TopicName": "test-topic",
                    "TopicArn": f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:test-topic",
                    "CreatedDateTime": datetime(2022, 1, 1),
                    "Status": "Registered",
                },
            ]
        }

    if operation_name == "ListCertificates":
        return {
            "CertificatesInfo": [
                {
                    "CertificateId": "test-certificate",
                    "CommonName": "test-certificate",
                    "State": "Registered",
                    "ExpiryDateTime": datetime(2023, 1, 1),
                    "Type": "ClientLDAPS",
                },
            ]
        }
    if operation_name == "GetSnapshotLimits":
        return {
            "SnapshotLimits": {
                "ManualSnapshotsLimit": 123,
                "ManualSnapshotsCurrentCount": 123,
                "ManualSnapshotsLimitReached": True,
            }
        }
    if operation_name == "ListTagsForResource":
        return {
            "Tags": [
                {"Key": "string", "Value": "string"},
            ],
        }
    return make_api_call(self, operation_name, kwarg)


# Mock generate_regional_clients()
def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_DirectoryService_Service:
    # Test DirectoryService Client
    @mock_aws
    def test_get_client(self):
        directoryservice = DirectoryService(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert (
            directoryservice.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "DirectoryService"
        )

    # Test DirectoryService Session
    @mock_aws
    def test__get_session__(self):
        directoryservice = DirectoryService(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert directoryservice.session.__class__.__name__ == "Session"

    # Test DirectoryService Service
    @mock_aws
    def test__get_service__(self):
        directoryservice = DirectoryService(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )
        assert directoryservice.service == "ds"

    @mock_aws
    def test_describe_directories(self):
        # Set partition for the service
        directoryservice = DirectoryService(
            set_mocked_aws_provider([AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1])
        )

        # _describe_directories
        assert directoryservice.directories["d-12345a1b2"].id == "d-12345a1b2"
        assert (
            directoryservice.directories["d-12345a1b2"].arn
            == f"arn:aws:ds:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        assert (
            directoryservice.directories["d-12345a1b2"].type
            == DirectoryType.MicrosoftAD
        )
        assert directoryservice.directories["d-12345a1b2"].name == "test-directory"
        assert (
            directoryservice.directories["d-12345a1b2"].region == AWS_REGION_EU_WEST_1
        )
        assert directoryservice.directories["d-12345a1b2"].tags == [
            {"Key": "string", "Value": "string"},
        ]
        assert (
            directoryservice.directories[
                "d-12345a1b2"
            ].radius_settings.authentication_protocol
            == AuthenticationProtocol.MS_CHAPv2
        )
        assert (
            directoryservice.directories["d-12345a1b2"].radius_settings.status
            == RadiusStatus.Creating
        )

        # _list_log_subscriptions
        assert len(directoryservice.directories["d-12345a1b2"].log_subscriptions) == 1
        assert (
            directoryservice.directories["d-12345a1b2"]
            .log_subscriptions[0]
            .log_group_name
            == "test-log-group"
        )
        assert directoryservice.directories["d-12345a1b2"].log_subscriptions[
            0
        ].created_date_time == datetime(2022, 1, 1)

        # _describe_event_topics
        assert len(directoryservice.directories["d-12345a1b2"].event_topics) == 1
        assert (
            directoryservice.directories["d-12345a1b2"].event_topics[0].topic_name
            == "test-topic"
        )
        assert (
            directoryservice.directories["d-12345a1b2"].event_topics[0].topic_arn
            == f"arn:aws:sns:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:test-topic"
        )
        assert (
            directoryservice.directories["d-12345a1b2"].event_topics[0].status
            == EventTopicStatus.Registered
        )
        assert directoryservice.directories["d-12345a1b2"].event_topics[
            0
        ].created_date_time == datetime(2022, 1, 1)

        # _list_certificates
        assert len(directoryservice.directories["d-12345a1b2"].certificates) == 1
        assert (
            directoryservice.directories["d-12345a1b2"].certificates[0].id
            == "test-certificate"
        )
        assert (
            directoryservice.directories["d-12345a1b2"].certificates[0].common_name
            == "test-certificate"
        )
        assert (
            directoryservice.directories["d-12345a1b2"].certificates[0].state
            == CertificateState.Registered
        )
        assert directoryservice.directories["d-12345a1b2"].certificates[
            0
        ].expiry_date_time == datetime(2023, 1, 1)
        assert (
            directoryservice.directories["d-12345a1b2"].certificates[0].type
            == CertificateType.ClientLDAPS
        )

        # _get_snapshot_limits
        assert directoryservice.directories["d-12345a1b2"].snapshots_limits
        assert (
            directoryservice.directories[
                "d-12345a1b2"
            ].snapshots_limits.manual_snapshots_limit
            == 123
        )
        assert (
            directoryservice.directories[
                "d-12345a1b2"
            ].snapshots_limits.manual_snapshots_current_count
            == 123
        )
        assert (
            directoryservice.directories[
                "d-12345a1b2"
            ].snapshots_limits.manual_snapshots_limit_reached
            is True
        )
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_directory_log_forwarding_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/directoryservice/directoryservice_directory_log_forwarding_enabled/directoryservice_directory_log_forwarding_enabled_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    Directory,
    DirectoryType,
    LogSubscriptions,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_directoryservice_directory_log_forwarding_enabled:
    def test_no_directories(self):
        directoryservice_client = mock.MagicMock
        directoryservice_client.directories = {}
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_log_forwarding_enabled.directoryservice_directory_log_forwarding_enabled import (
                directoryservice_directory_log_forwarding_enabled,
            )

            check = directoryservice_directory_log_forwarding_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_one_directory_logging_disabled(self):
        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        directory_id = "d-12345a1b2"
        directory_arn = (
            f"arn:aws:ds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        directoryservice_client.directories = {
            directory_name: Directory(
                name=directory_name,
                arn=directory_arn,
                id=directory_id,
                type=DirectoryType.MicrosoftAD,
                region=AWS_REGION,
                log_subscriptions=[],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_log_forwarding_enabled.directoryservice_directory_log_forwarding_enabled import (
                directoryservice_directory_log_forwarding_enabled,
            )

            check = directoryservice_directory_log_forwarding_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Directory Service {directory_id} have log forwarding to CloudWatch disabled."
            )

    def test_one_directory_logging_enabled(self):
        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        directory_id = "d-12345a1b2"
        directory_arn = (
            f"arn:aws:ds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        directoryservice_client.directories = {
            directory_name: Directory(
                name=directory_name,
                arn=directory_arn,
                id=directory_id,
                type=DirectoryType.MicrosoftAD,
                region=AWS_REGION,
                log_subscriptions=[
                    LogSubscriptions(
                        log_group_name="test-log-group",
                        created_date_time=datetime(2022, 1, 1),
                    )
                ],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_log_forwarding_enabled.directoryservice_directory_log_forwarding_enabled import (
                directoryservice_directory_log_forwarding_enabled,
            )

            check = directoryservice_directory_log_forwarding_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Directory Service {directory_id} have log forwarding to CloudWatch enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_directory_monitor_notifications_test.py]---
Location: prowler-master/tests/providers/aws/services/directoryservice/directoryservice_directory_monitor_notifications/directoryservice_directory_monitor_notifications_test.py

```python
from datetime import datetime
from unittest import mock

from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    Directory,
    DirectoryType,
    EventTopics,
    EventTopicStatus,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER

AWS_REGION = "eu-west-1"


class Test_directoryservice_directory_monitor_notifications:
    def test_no_directories(self):
        directoryservice_client = mock.MagicMock
        directoryservice_client.directories = {}
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_monitor_notifications.directoryservice_directory_monitor_notifications import (
                directoryservice_directory_monitor_notifications,
            )

            check = directoryservice_directory_monitor_notifications()
            result = check.execute()

            assert len(result) == 0

    def test_one_directory_logging_disabled(self):
        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        directory_id = "d-12345a1b2"
        directory_arn = (
            f"arn:aws:ds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        directoryservice_client.directories = {
            directory_name: Directory(
                id=directory_id,
                arn=directory_arn,
                type=DirectoryType.MicrosoftAD,
                name=directory_name,
                region=AWS_REGION,
                event_topics=[],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_monitor_notifications.directoryservice_directory_monitor_notifications import (
                directoryservice_directory_monitor_notifications,
            )

            check = directoryservice_directory_monitor_notifications()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Directory Service {directory_id} have SNS messaging disabled."
            )

    def test_one_directory_logging_enabled(self):
        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        directory_id = "d-12345a1b2"
        directory_arn = (
            f"arn:aws:ds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        directoryservice_client.directories = {
            directory_name: Directory(
                name=directory_name,
                id=directory_id,
                arn=directory_arn,
                type=DirectoryType.MicrosoftAD,
                region=AWS_REGION,
                event_topics=[
                    EventTopics(
                        topic_arn=f"arn:aws:sns:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:test-topic",
                        topic_name="test-topic",
                        status=EventTopicStatus.Registered,
                        created_date_time=datetime(2022, 1, 1),
                    )
                ],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_monitor_notifications.directoryservice_directory_monitor_notifications import (
                directoryservice_directory_monitor_notifications,
            )

            check = directoryservice_directory_monitor_notifications()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Directory Service {directory_id} have SNS messaging enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_directory_snapshots_limit_test.py]---
Location: prowler-master/tests/providers/aws/services/directoryservice/directoryservice_directory_snapshots_limit/directoryservice_directory_snapshots_limit_test.py

```python
from unittest import mock

from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    Directory,
    DirectoryType,
    SnapshotLimit,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_directoryservice_directory_snapshots_limit:
    def test_no_directories(self):
        directoryservice_client = mock.MagicMock
        directoryservice_client.directories = {}
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_snapshots_limit.directoryservice_directory_snapshots_limit import (
                directoryservice_directory_snapshots_limit,
            )

            check = directoryservice_directory_snapshots_limit()
            result = check.execute()

            assert len(result) == 0

    def test_one_directory_snapshots_limit_reached(self):
        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        directory_id = "d-12345a1b2"
        directory_arn = (
            f"arn:aws:ds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        manual_snapshots_current_count = 5
        manual_snapshots_limit = 5
        manual_snapshots_limit_reached = True
        directoryservice_client.directories = {
            directory_name: Directory(
                name=directory_name,
                id=directory_id,
                arn=directory_arn,
                type=DirectoryType.MicrosoftAD,
                region=AWS_REGION,
                snapshots_limits=SnapshotLimit(
                    manual_snapshots_current_count=manual_snapshots_current_count,
                    manual_snapshots_limit=manual_snapshots_limit,
                    manual_snapshots_limit_reached=manual_snapshots_limit_reached,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_snapshots_limit.directoryservice_directory_snapshots_limit import (
                directoryservice_directory_snapshots_limit,
            )

            check = directoryservice_directory_snapshots_limit()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Directory Service {directory_id} reached {manual_snapshots_limit} Snapshots limit."
            )

    def test_one_directory_snapshots_limit_over_threshold(self):
        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        directory_id = "d-12345a1b2"
        directory_arn = (
            f"arn:aws:ds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        manual_snapshots_current_count = 4
        manual_snapshots_limit = 5
        manual_snapshots_limit_reached = False
        directoryservice_client.directories = {
            directory_name: Directory(
                name=directory_name,
                id=directory_id,
                arn=directory_arn,
                type=DirectoryType.MicrosoftAD,
                region=AWS_REGION,
                snapshots_limits=SnapshotLimit(
                    manual_snapshots_current_count=manual_snapshots_current_count,
                    manual_snapshots_limit=manual_snapshots_limit,
                    manual_snapshots_limit_reached=manual_snapshots_limit_reached,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_snapshots_limit.directoryservice_directory_snapshots_limit import (
                directoryservice_directory_snapshots_limit,
            )

            check = directoryservice_directory_snapshots_limit()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Directory Service {directory_id} is about to reach {manual_snapshots_limit} Snapshots which is the limit."
            )

    def test_one_directory_snapshots_limit_equal_threshold(self):
        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        directory_id = "d-12345a1b2"
        directory_arn = (
            f"arn:aws:ds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        manual_snapshots_current_count = 3
        manual_snapshots_limit = 5
        manual_snapshots_limit_reached = False
        directoryservice_client.directories = {
            directory_name: Directory(
                name=directory_name,
                id=directory_id,
                arn=directory_arn,
                type=DirectoryType.MicrosoftAD,
                region=AWS_REGION,
                snapshots_limits=SnapshotLimit(
                    manual_snapshots_current_count=manual_snapshots_current_count,
                    manual_snapshots_limit=manual_snapshots_limit,
                    manual_snapshots_limit_reached=manual_snapshots_limit_reached,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_snapshots_limit.directoryservice_directory_snapshots_limit import (
                directoryservice_directory_snapshots_limit,
            )

            check = directoryservice_directory_snapshots_limit()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Directory Service {directory_id} is about to reach {manual_snapshots_limit} Snapshots which is the limit."
            )

    def test_one_directory_snapshots_limit_more_threshold(self):
        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        directory_id = "d-12345a1b2"
        directory_arn = (
            f"arn:aws:ds:{AWS_REGION}:{AWS_ACCOUNT_NUMBER}:directory/d-12345a1b2"
        )
        manual_snapshots_current_count = 1
        manual_snapshots_limit = 5
        manual_snapshots_limit_reached = False
        directoryservice_client.directories = {
            directory_name: Directory(
                name=directory_name,
                id=directory_id,
                arn=directory_arn,
                type=DirectoryType.MicrosoftAD,
                region=AWS_REGION,
                snapshots_limits=SnapshotLimit(
                    manual_snapshots_current_count=manual_snapshots_current_count,
                    manual_snapshots_limit=manual_snapshots_limit,
                    manual_snapshots_limit_reached=manual_snapshots_limit_reached,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_directory_snapshots_limit.directoryservice_directory_snapshots_limit import (
                directoryservice_directory_snapshots_limit,
            )

            check = directoryservice_directory_snapshots_limit()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Directory Service {directory_id} is using {manual_snapshots_current_count} out of {manual_snapshots_limit} from the Snapshots Limit."
            )
```

--------------------------------------------------------------------------------

````
