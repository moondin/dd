---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 636
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 636 of 867)

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

---[FILE: storagegateway_service_test.py]---
Location: prowler-master/tests/providers/aws/services/storagegateway/storagegateway_service_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.storagegateway.storagegateway_service import (
    StorageGateway,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

test_gateway = "sgw-12A3456B"
test_gateway_arn = f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:gateway/{test_gateway}"
test_iam_role = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:role/my-role"
test_kms_key = f"arn:aws:kms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:key/b72aaa2a-2222-99tt-12345690qwe"
test_share_nfs = "share-nfs2wwe"
test_share_arn_nfs = f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:share/{test_share_nfs}"
test_share_smb = "share-smb2wwe"
test_share_arn_smb = f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:share/{test_share_smb}"

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "CreateNFSFileShare":
        return {"FileShareARN": f"{test_share_arn_nfs}"}
    if operation_name == "CreateSMBFileShare":
        return {"FileShareARN": f"{test_share_arn_smb}"}
    if operation_name == "ListFileShares":
        return {
            "FileShareInfoList": [
                {
                    "FileShareType": "NFS",
                    "FileShareARN": f"{test_share_arn_nfs}",
                    "FileShareId": f"{test_share_nfs}",
                    "FileShareStatus": "AVAILABLE",
                    "GatewayARN": f"{test_gateway_arn}",
                },
                {
                    "FileShareType": "SMB",
                    "FileShareARN": f"{test_share_arn_smb}",
                    "FileShareId": f"{test_share_smb}",
                    "FileShareStatus": "AVAILABLE",
                    "GatewayARN": f"{test_gateway_arn}",
                },
            ]
        }
    if operation_name == "DescribeNFSFileShares":
        return {
            "NFSFileShareInfoList": [
                {
                    "FileShareType": "NFS",
                    "FileShareARN": f"{test_share_arn_nfs}",
                    "FileShareId": f"{test_share_nfs}",
                    "FileShareStatus": "AVAILABLE",
                    "GatewayARN": f"{test_gateway_arn}",
                    "Tags": [
                        {"Key": "test", "Value": "test"},
                    ],
                    "KMSEncrypted": True,
                    "KMSKey": f"{test_kms_key}",
                },
            ]
        }
    if operation_name == "DescribeSMBFileShares":
        return {
            "SMBFileShareInfoList": [
                {
                    "FileShareType": "SMB",
                    "FileShareARN": f"{test_share_arn_smb}",
                    "FileShareId": f"{test_share_smb}",
                    "FileShareStatus": "AVAILABLE",
                    "GatewayARN": f"{test_gateway_arn}",
                    "KMSEncrypted": False,
                    "KMSKey": "",
                },
            ]
        }
    if operation_name == "ListGateways":
        return {
            "Gateways": [
                {
                    "GatewayId": f"{test_gateway}",
                    "GatewayARN": f"{test_gateway_arn}",
                    "GatewayType": "fsx",
                    "GatewayName": "test",
                    "HostEnvironment": "EC2",
                },
            ]
        }
    return make_api_call(self, operation_name, kwarg)


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_StorageGateway_Service:

    # Test SGW Service
    @mock_aws
    def test_service(self):
        # SGW client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        storagegateway = StorageGateway(aws_provider)
        assert storagegateway.service == "storagegateway"

    # Test SGW Describe FileShares
    @mock_aws
    def test__describe_file_shares__(self):
        # StorageGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        sgw = StorageGateway(aws_provider)
        assert len(sgw.fileshares) == 2
        assert sgw.fileshares[0].id == "share-nfs2wwe"
        assert sgw.fileshares[0].fs_type == "NFS"
        assert sgw.fileshares[0].status == "AVAILABLE"
        assert (
            sgw.fileshares[0].gateway_arn
            == "arn:aws:storagegateway:us-east-1:123456789012:gateway/sgw-12A3456B"
        )
        assert sgw.fileshares[0].kms
        assert (
            sgw.fileshares[0].kms_key
            == "arn:aws:kms:us-east-1:123456789012:key/b72aaa2a-2222-99tt-12345690qwe"
        )
        assert sgw.fileshares[0].tags == [
            {"Key": "test", "Value": "test"},
        ]
        assert sgw.fileshares[1].id == "share-smb2wwe"
        assert sgw.fileshares[1].fs_type == "SMB"
        assert sgw.fileshares[1].status == "AVAILABLE"
        assert (
            sgw.fileshares[1].gateway_arn
            == "arn:aws:storagegateway:us-east-1:123456789012:gateway/sgw-12A3456B"
        )
        assert not sgw.fileshares[1].kms
        assert sgw.fileshares[1].kms_key == ""
        assert sgw.fileshares[1].tags == []

    @mock_aws
    def test__describe_gateways__(self):
        # StorageGateway client for this test class
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        sgw = StorageGateway(aws_provider)
        assert len(sgw.gateways) == 1
        assert sgw.gateways[0].id == f"{test_gateway}"
        assert sgw.gateways[0].type == "fsx"
        assert sgw.gateways[0].name == "test"
        assert (
            sgw.gateways[0].arn
            == "arn:aws:storagegateway:us-east-1:123456789012:gateway/sgw-12A3456B"
        )
        assert sgw.gateways[0].environment == "EC2"
```

--------------------------------------------------------------------------------

---[FILE: storagegateway_fileshare_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/storagegateway/storagegateway_fileshare_encryption_enabled/storagegateway_fileshare_encryption_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.storagegateway.storagegateway_service import (
    FileShare,
)
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1

test_gateway = "sgw-12A3456B"
test_gateway_arn = f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:gateway/{test_gateway}"
test_kms_key = f"arn:aws:kms:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:key/b72aaa2a-2222-99tt-12345690qwe"
test_share_nfs = "share-nfs2wwe"
test_share_arn_nfs = f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:share/{test_share_nfs}"
test_share_smb = "share-smb2wwe"
test_share_arn_smb = f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:share/{test_share_smb}"


class Test_storagegateway_fileshare_encryption_enabled:
    def test_no_storagegateway_fileshare(self):
        storagegateway_client = mock.MagicMock
        storagegateway_client.fileshares = []
        with mock.patch(
            "prowler.providers.aws.services.storagegateway.storagegateway_service.StorageGateway",
            storagegateway_client,
        ):
            from prowler.providers.aws.services.storagegateway.storagegateway_fileshare_encryption_enabled.storagegateway_fileshare_encryption_enabled import (
                storagegateway_fileshare_encryption_enabled,
            )

            check = storagegateway_fileshare_encryption_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_nfs_fileshare_kms_encryption(self):
        storagegateway_client = mock.MagicMock
        storagegateway_client.fileshares = []
        storagegateway_client.fileshares.append(
            FileShare(
                id=test_share_nfs,
                arn=test_share_arn_nfs,
                gateway_arn=test_gateway_arn,
                region=AWS_REGION_US_EAST_1,
                fs_type="NFS",
                status="AVAILABLE",
                kms=True,
                kms_key=test_kms_key,
                tags=[
                    {"Key": "test", "Value": "test"},
                ],
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.storagegateway.storagegateway_service.StorageGateway",
            storagegateway_client,
        ):
            from prowler.providers.aws.services.storagegateway.storagegateway_fileshare_encryption_enabled.storagegateway_fileshare_encryption_enabled import (
                storagegateway_fileshare_encryption_enabled,
            )

            check = storagegateway_fileshare_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"StorageGateway File Share {test_share_nfs} is using KMS CMK."
            )
            assert result[0].resource_id == f"{test_share_nfs}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:share/{test_share_nfs}"
            )
            assert result[0].resource_tags == [
                {"Key": "test", "Value": "test"},
            ]

    def test_nfs_fileshare_no_kms_encryption(self):
        storagegateway_client = mock.MagicMock
        storagegateway_client.fileshares = []
        storagegateway_client.fileshares.append(
            FileShare(
                id=test_share_nfs,
                arn=test_share_arn_nfs,
                gateway_arn=test_gateway_arn,
                region=AWS_REGION_US_EAST_1,
                fs_type="NFS",
                status="AVAILABLE",
                kms=False,
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.storagegateway.storagegateway_service.StorageGateway",
            storagegateway_client,
        ):
            from prowler.providers.aws.services.storagegateway.storagegateway_fileshare_encryption_enabled.storagegateway_fileshare_encryption_enabled import (
                storagegateway_fileshare_encryption_enabled,
            )

            check = storagegateway_fileshare_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"StorageGateway File Share {test_share_nfs} is not using KMS CMK."
            )
            assert result[0].resource_id == f"{test_share_nfs}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:share/{test_share_nfs}"
            )
            assert result[0].resource_tags == []

    def test_smb_fileshare_kms_encryption(self):
        storagegateway_client = mock.MagicMock
        storagegateway_client.fileshares = []
        storagegateway_client.fileshares.append(
            FileShare(
                id=test_share_smb,
                arn=test_share_arn_smb,
                gateway_arn=test_gateway_arn,
                region=AWS_REGION_US_EAST_1,
                fs_type="SMB",
                status="AVAILABLE",
                kms=True,
                kms_key=test_kms_key,
                tags=[
                    {"Key": "test", "Value": "test"},
                ],
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.storagegateway.storagegateway_service.StorageGateway",
            storagegateway_client,
        ):
            from prowler.providers.aws.services.storagegateway.storagegateway_fileshare_encryption_enabled.storagegateway_fileshare_encryption_enabled import (
                storagegateway_fileshare_encryption_enabled,
            )

            check = storagegateway_fileshare_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"StorageGateway File Share {test_share_smb} is using KMS CMK."
            )
            assert result[0].resource_id == f"{test_share_smb}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:share/{test_share_smb}"
            )
            assert result[0].resource_tags == [
                {"Key": "test", "Value": "test"},
            ]

    def test_smb_fileshare_no_kms_encryption(self):
        storagegateway_client = mock.MagicMock
        storagegateway_client.fileshares = []
        storagegateway_client.fileshares.append(
            FileShare(
                id=test_share_smb,
                arn=test_share_arn_smb,
                gateway_arn=test_gateway_arn,
                region=AWS_REGION_US_EAST_1,
                fs_type="SMB",
                status="AVAILABLE",
                kms=False,
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.storagegateway.storagegateway_service.StorageGateway",
            storagegateway_client,
        ):
            from prowler.providers.aws.services.storagegateway.storagegateway_fileshare_encryption_enabled.storagegateway_fileshare_encryption_enabled import (
                storagegateway_fileshare_encryption_enabled,
            )

            check = storagegateway_fileshare_encryption_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"StorageGateway File Share {test_share_smb} is not using KMS CMK."
            )
            assert result[0].resource_id == f"{test_share_smb}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:share/{test_share_smb}"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: storagegateway_gateway_fault_tolerant_test.py]---
Location: prowler-master/tests/providers/aws/services/storagegateway/storagegateway_gateway_fault_tolerant/storagegateway_gateway_fault_tolerant_test.py

```python
from unittest import mock

from prowler.providers.aws.services.storagegateway.storagegateway_service import Gateway
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1

test_gateway = "sgw-12A3456B"
test_gateway_arn = f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:gateway/{test_gateway}"


class Test_storagegateway_gateway_fault_tolerant:
    def test_no_storagegateway_gateway(self):
        storagegateway_client = mock.MagicMock
        storagegateway_client.gateways = []
        with mock.patch(
            "prowler.providers.aws.services.storagegateway.storagegateway_service.StorageGateway",
            storagegateway_client,
        ):
            from prowler.providers.aws.services.storagegateway.storagegateway_gateway_fault_tolerant.storagegateway_gateway_fault_tolerant import (
                storagegateway_gateway_fault_tolerant,
            )

            check = storagegateway_gateway_fault_tolerant()
            result = check.execute()
            assert len(result) == 0

    def test_gateway_on_ec2(self):
        storagegateway_client = mock.MagicMock
        storagegateway_client.gateways = []
        storagegateway_client.gateways.append(
            Gateway(
                id=test_gateway,
                arn=test_gateway_arn,
                name="test",
                type="fsx",
                region=AWS_REGION_US_EAST_1,
                environment="EC2",
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.storagegateway.storagegateway_service.StorageGateway",
            storagegateway_client,
        ):
            from prowler.providers.aws.services.storagegateway.storagegateway_gateway_fault_tolerant.storagegateway_gateway_fault_tolerant import (
                storagegateway_gateway_fault_tolerant,
            )

            check = storagegateway_gateway_fault_tolerant()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "StorageGateway Gateway test may not be fault tolerant as it is hosted on EC2."
            )
            assert result[0].resource_id == f"{test_gateway}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:gateway/{test_gateway}"
            )

    def test_gateway_not_on_ec2(self):
        storagegateway_client = mock.MagicMock
        storagegateway_client.gateways = []
        storagegateway_client.gateways.append(
            Gateway(
                id=test_gateway,
                arn=test_gateway_arn,
                name="test",
                type="fsx",
                region=AWS_REGION_US_EAST_1,
                environment="VMWARE",
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.storagegateway.storagegateway_service.StorageGateway",
            storagegateway_client,
        ):
            from prowler.providers.aws.services.storagegateway.storagegateway_gateway_fault_tolerant.storagegateway_gateway_fault_tolerant import (
                storagegateway_gateway_fault_tolerant,
            )

            check = storagegateway_gateway_fault_tolerant()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "StorageGateway Gateway test may be fault tolerant as it is hosted on VMWARE."
            )
            assert result[0].resource_id == f"{test_gateway}"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:storagegateway:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:gateway/{test_gateway}"
            )
```

--------------------------------------------------------------------------------

---[FILE: transfer_service_test.py]---
Location: prowler-master/tests/providers/aws/services/transfer/transfer_service_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.transfer.transfer_service import Protocol, Transfer
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call

SERVER_ID = "SERVICE_MANAGED::s-01234567890abcdef"
SERVER_ARN = f"arn:aws:transfer:us-east-1:{AWS_ACCOUNT_NUMBER}:server/{SERVER_ID}"


make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListServers":
        return {
            "Servers": [
                {
                    "Arn": f"arn:aws:transfer:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:server/{SERVER_ID}",
                    "ServerId": SERVER_ID,
                }
            ]
        }
    if operation_name == "DescribeServer":
        return {
            "Server": {
                "Arn": SERVER_ARN,
                "ServerId": SERVER_ID,
                "Protocols": ["SFTP"],
                "Tags": [{"Key": "key", "Value": "value"}],
            }
        }
    return make_api_call(self, operation_name, kwarg)


class Test_transfer_service:
    @mock_aws
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        transfer = Transfer(aws_provider)
        assert (
            transfer.regional_clients[AWS_REGION_US_EAST_1].__class__.__name__
            == "Transfer"
        )

    @mock_aws
    def test_get_session(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        transfer = Transfer(aws_provider)
        assert transfer.session.__class__.__name__ == "Session"

    @mock_aws
    def test_get_service(self):
        transfer = Transfer(set_mocked_aws_provider())
        assert transfer.service == "transfer"

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_list_servers(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        transfer = Transfer(aws_provider)
        assert len(transfer.servers) == 1
        assert transfer.servers[SERVER_ARN].arn == SERVER_ARN
        assert transfer.servers[SERVER_ARN].id == SERVER_ID
        assert transfer.servers[SERVER_ARN].region == "us-east-1"

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_describe_server(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        transfer = Transfer(aws_provider)
        assert transfer.servers[SERVER_ARN].arn == SERVER_ARN
        assert transfer.servers[SERVER_ARN].id == SERVER_ID
        assert len(transfer.servers[SERVER_ARN].protocols) == 1
        assert transfer.servers[SERVER_ARN].region == "us-east-1"
        assert transfer.servers[SERVER_ARN].tags == [{"Key": "key", "Value": "value"}]
        assert transfer.servers[SERVER_ARN].protocols[0] == Protocol.SFTP
```

--------------------------------------------------------------------------------

---[FILE: transfer_server_in_transit_encryption_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/transfer/transfer_server_in_transit_encryption_enabled/transfer_server_in_transit_encryption_enabled_test.py

```python
from unittest import mock
from unittest.mock import patch

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

SERVER_ID = "s-01234567890abcdef"
SERVER_ARN = (
    f"arn:aws:transfer:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:server/{SERVER_ID}"
)

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_encrypted(self, operation_name, kwarg):
    if operation_name == "ListServers":
        return {
            "Servers": [
                {
                    "Arn": f"arn:aws:transfer:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:server/{SERVER_ID}",
                    "ServerId": SERVER_ID,
                }
            ]
        }
    if operation_name == "DescribeServer":
        return {
            "Server": {
                "Arn": SERVER_ARN,
                "ServerId": SERVER_ID,
                "Protocols": ["SFTP"],
            }
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_unencrypted(self, operation_name, kwarg):
    if operation_name == "ListServers":
        return {
            "Servers": [
                {
                    "Arn": f"arn:aws:transfer:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:server/{SERVER_ID}",
                    "ServerId": SERVER_ID,
                }
            ]
        }
    if operation_name == "DescribeServer":
        return {
            "Server": {
                "Arn": SERVER_ARN,
                "ServerId": SERVER_ID,
                "Protocols": ["FTP", "FTPS", "SFTP", "AS2"],
            }
        }
    return make_api_call(self, operation_name, kwarg)


class Test_transfer_server_encryption_in_transit:
    @mock_aws
    def test_no_servers(self):
        from prowler.providers.aws.services.transfer.transfer_service import Transfer

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.transfer.transfer_server_in_transit_encryption_enabled.transfer_server_in_transit_encryption_enabled.transfer_client",
                new=Transfer(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.transfer.transfer_server_in_transit_encryption_enabled.transfer_server_in_transit_encryption_enabled import (
                    transfer_server_in_transit_encryption_enabled,
                )

                check = transfer_server_in_transit_encryption_enabled()
                result = check.execute()

                assert len(result) == 0

    @patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_encrypted
    )
    @mock_aws
    def test_transfer_server_encryption_enabled(self):
        from prowler.providers.aws.services.transfer.transfer_service import Transfer

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.transfer.transfer_server_in_transit_encryption_enabled.transfer_server_in_transit_encryption_enabled.transfer_client",
                new=Transfer(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.transfer.transfer_server_in_transit_encryption_enabled.transfer_server_in_transit_encryption_enabled import (
                    transfer_server_in_transit_encryption_enabled,
                )

                check = transfer_server_in_transit_encryption_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Transfer Server {SERVER_ID} does have encryption in transit enabled."
                )
                assert result[0].resource_id == SERVER_ID
                assert result[0].resource_arn == SERVER_ARN
                assert result[0].region == AWS_REGION_US_EAST_1

    @patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_unencrypted
    )
    @mock_aws
    def test_transfer_server_encryption_disabled(self):
        from prowler.providers.aws.services.transfer.transfer_service import Transfer

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.transfer.transfer_server_in_transit_encryption_enabled.transfer_server_in_transit_encryption_enabled.transfer_client",
                new=Transfer(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.transfer.transfer_server_in_transit_encryption_enabled.transfer_server_in_transit_encryption_enabled import (
                    transfer_server_in_transit_encryption_enabled,
                )

                check = transfer_server_in_transit_encryption_enabled()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Transfer Server {SERVER_ID} does not have encryption in transit enabled."
                )
                assert result[0].resource_id == SERVER_ID
                assert result[0].resource_arn == SERVER_ARN
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: trustedadvisor_service_test.py]---
Location: prowler-master/tests/providers/aws/services/trustedadvisor/trustedadvisor_service_test.py

```python
from unittest.mock import patch

import botocore
from moto import mock_aws

from prowler.providers.aws.services.trustedadvisor.trustedadvisor_service import (
    TrustedAdvisor,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "DescribeTrustedAdvisorCheckResult":
        return {}
    if operation_name == "DescribeServices":
        return {
            "services": [
                {
                    "code": "amazon-marketplace",
                    "name": "Marketplace",
                    "categories": [
                        {
                            "code": "general-marketplace-seller-inquiry",
                            "name": "General Marketplace Seller Inquiry",
                        },
                    ],
                }
            ]
        }
    return make_api_call(self, operation_name, kwarg)


@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
class Test_TrustedAdvisor_Service:

    # Test TrustedAdvisor Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        trustedadvisor = TrustedAdvisor(aws_provider)
        assert trustedadvisor.service == "support"

    # Test TrustedAdvisor client
    def test_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        trustedadvisor = TrustedAdvisor(aws_provider)
        assert trustedadvisor.client.__class__.__name__ == "Support"

    # Test TrustedAdvisor session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        trustedadvisor = TrustedAdvisor(aws_provider)
        assert trustedadvisor.session.__class__.__name__ == "Session"

    @mock_aws
    # Test TrustedAdvisor session
    def test_describe_trusted_advisor_checks(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        trustedadvisor = TrustedAdvisor(aws_provider)
        assert trustedadvisor.premium_support.enabled
        assert len(trustedadvisor.checks) == 104  # Default checks
        assert trustedadvisor.checks[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: trustedadvisor_errors_and_warnings_test.py]---
Location: prowler-master/tests/providers/aws/services/trustedadvisor/trustedadvisor_errors_and_warnings/trustedadvisor_errors_and_warnings_test.py

```python
from unittest import mock

from prowler.providers.aws.services.trustedadvisor.trustedadvisor_service import (
    Check,
    PremiumSupport,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_ARN,
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
)

CHECK_NAME = "test-check"
CHECK_ARN = "arn:aws:trusted-advisor:::check/test-check"


class Test_trustedadvisor_errors_and_warnings:
    def test_no_detectors_premium_support_disabled(self):
        trustedadvisor_client = mock.MagicMock
        trustedadvisor_client.checks = []
        trustedadvisor_client.premium_support = PremiumSupport(enabled=False)
        trustedadvisor_client.audited_account = AWS_ACCOUNT_NUMBER
        trustedadvisor_client.audited_account_arn = AWS_ACCOUNT_ARN
        trustedadvisor_client.audited_partition = "aws"
        trustedadvisor_client.region = AWS_REGION_US_EAST_1
        trustedadvisor_client.account_arn_template = f"arn:{trustedadvisor_client.audited_partition}:trusted-advisor:{trustedadvisor_client.region}:{trustedadvisor_client.audited_account}:account"
        trustedadvisor_client.__get_account_arn_template__ = mock.MagicMock(
            return_value=trustedadvisor_client.account_arn_template
        )
        with mock.patch(
            "prowler.providers.aws.services.trustedadvisor.trustedadvisor_service.TrustedAdvisor",
            trustedadvisor_client,
        ):
            from prowler.providers.aws.services.trustedadvisor.trustedadvisor_errors_and_warnings.trustedadvisor_errors_and_warnings import (
                trustedadvisor_errors_and_warnings,
            )

            check = trustedadvisor_errors_and_warnings()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "MANUAL"
            assert (
                result[0].status_extended
                == "Amazon Web Services Premium Support Subscription is required to use this service."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:trusted-advisor:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
            )

    def test_trustedadvisor_all_passed_checks(self):
        trustedadvisor_client = mock.MagicMock
        trustedadvisor_client.checks = []
        trustedadvisor_client.premium_support = PremiumSupport(enabled=True)
        trustedadvisor_client.audited_account = AWS_ACCOUNT_NUMBER
        trustedadvisor_client.audited_account_arn = AWS_ACCOUNT_ARN
        trustedadvisor_client.checks.append(
            Check(
                id=CHECK_NAME,
                name=CHECK_NAME,
                arn=CHECK_ARN,
                region=AWS_REGION_US_EAST_1,
                status="ok",
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.trustedadvisor.trustedadvisor_service.TrustedAdvisor",
            trustedadvisor_client,
        ):
            from prowler.providers.aws.services.trustedadvisor.trustedadvisor_errors_and_warnings.trustedadvisor_errors_and_warnings import (
                trustedadvisor_errors_and_warnings,
            )

            check = trustedadvisor_errors_and_warnings()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Trusted Advisor check {CHECK_NAME} is in state ok."
            )
            assert result[0].resource_id == CHECK_NAME
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_trustedadvisor_error_check(self):
        trustedadvisor_client = mock.MagicMock
        trustedadvisor_client.checks = []
        trustedadvisor_client.premium_support = PremiumSupport(enabled=True)
        trustedadvisor_client.audited_account = AWS_ACCOUNT_NUMBER
        trustedadvisor_client.audited_account_arn = AWS_ACCOUNT_ARN
        trustedadvisor_client.checks.append(
            Check(
                id=CHECK_NAME,
                name=CHECK_NAME,
                arn=CHECK_ARN,
                region=AWS_REGION_US_EAST_1,
                status="error",
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.trustedadvisor.trustedadvisor_service.TrustedAdvisor",
            trustedadvisor_client,
        ):
            from prowler.providers.aws.services.trustedadvisor.trustedadvisor_errors_and_warnings.trustedadvisor_errors_and_warnings import (
                trustedadvisor_errors_and_warnings,
            )

            check = trustedadvisor_errors_and_warnings()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Trusted Advisor check {CHECK_NAME} is in state error."
            )
            assert result[0].resource_id == CHECK_NAME
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_trustedadvisor_not_available_check(self):
        trustedadvisor_client = mock.MagicMock
        trustedadvisor_client.checks = []
        trustedadvisor_client.premium_support = PremiumSupport(enabled=True)
        trustedadvisor_client.audited_account = AWS_ACCOUNT_NUMBER
        trustedadvisor_client.audited_account_arn = AWS_ACCOUNT_ARN
        trustedadvisor_client.checks.append(
            Check(
                id=CHECK_NAME,
                name=CHECK_NAME,
                arn=CHECK_ARN,
                region=AWS_REGION_US_EAST_1,
                status="not_available",
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.trustedadvisor.trustedadvisor_service.TrustedAdvisor",
            trustedadvisor_client,
        ):
            from prowler.providers.aws.services.trustedadvisor.trustedadvisor_errors_and_warnings.trustedadvisor_errors_and_warnings import (
                trustedadvisor_errors_and_warnings,
            )

            check = trustedadvisor_errors_and_warnings()
            result = check.execute()
            assert len(result) == 0

    def test_access_denied(self):
        trustedadvisor_client = mock.MagicMock
        trustedadvisor_client.checks = []
        trustedadvisor_client.premium_support = None
        trustedadvisor_client.audited_account = AWS_ACCOUNT_NUMBER
        trustedadvisor_client.audited_account_arn = AWS_ACCOUNT_ARN
        trustedadvisor_client.checks.append(
            Check(
                id=CHECK_NAME,
                name=CHECK_NAME,
                arn=CHECK_ARN,
                region=AWS_REGION_US_EAST_1,
                status="not_available",
            )
        )
        with mock.patch(
            "prowler.providers.aws.services.trustedadvisor.trustedadvisor_service.TrustedAdvisor",
            trustedadvisor_client,
        ):
            from prowler.providers.aws.services.trustedadvisor.trustedadvisor_errors_and_warnings.trustedadvisor_errors_and_warnings import (
                trustedadvisor_errors_and_warnings,
            )

            check = trustedadvisor_errors_and_warnings()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
