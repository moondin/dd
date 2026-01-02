---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 505
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 505 of 867)

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

---[FILE: ec2_client_vpn_endpoint_connection_logging_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_client_vpn_endpoint_connection_logging_enabled/ec2_client_vpn_endpoint_connection_logging_enabled_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.ec2.ec2_service import VpnEndpoint
from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_client_vpn_endpoint_connection_logging_enabled:
    @mock_aws
    def test_ec2_no_vpn_endpoints(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client_vpn_endpoint_connection_logging_enabled import (
                ec2_client_vpn_endpoint_connection_logging_enabled,
            )

            check = ec2_client_vpn_endpoint_connection_logging_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_ec2_vpn_endpoint_without_connection_logging(self):
        # Create EC2 Mocked Resources
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        ec2 = EC2(aws_provider)

        # Assuming that you mock the creation of a VPN endpoint without connection logging
        ec2.vpn_endpoints = {
            "arn:aws:ec2:us-east-1:123456789012:client-vpn-endpoint/cvpn-endpoint-1234567890abcdef0": VpnEndpoint(
                id="cvpn-endpoint-1234567890abcdef0",
                arn="arn:aws:ec2:us-east-1:123456789012:client-vpn-endpoint/cvpn-endpoint-1234567890abcdef0",
                connection_logging=False,
                region=AWS_REGION_US_EAST_1,
                tags=None,
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client",
                new=ec2,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client_vpn_endpoint_connection_logging_enabled import (
                ec2_client_vpn_endpoint_connection_logging_enabled,
            )

            check = ec2_client_vpn_endpoint_connection_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"Client VPN endpoint cvpn-endpoint-1234567890abcdef0 in region {AWS_REGION_US_EAST_1} does not have client connection logging enabled."
            )
            assert (
                result[0].resource_arn
                == "arn:aws:ec2:us-east-1:123456789012:client-vpn-endpoint/cvpn-endpoint-1234567890abcdef0"
            )

    @mock_aws
    def test_ec2_vpn_endpoint_with_connection_logging(self):
        # Create EC2 Mocked Resources
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        ec2 = EC2(aws_provider)

        # Assuming that you mock the creation of a VPN endpoint with connection logging
        ec2.vpn_endpoints = {
            "arn:aws:ec2:us-east-1:123456789012:client-vpn-endpoint/cvpn-endpoint-1234567890abcdef0": VpnEndpoint(
                id="cvpn-endpoint-1234567890abcdef0",
                arn="arn:aws:ec2:us-east-1:123456789012:client-vpn-endpoint/cvpn-endpoint-1234567890abcdef0",
                connection_logging=True,
                region=AWS_REGION_US_EAST_1,
                tags=None,
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client",
                new=ec2,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_client_vpn_endpoint_connection_logging_enabled.ec2_client_vpn_endpoint_connection_logging_enabled import (
                ec2_client_vpn_endpoint_connection_logging_enabled,
            )

            check = ec2_client_vpn_endpoint_connection_logging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags is None
            assert (
                result[0].status_extended
                == f"Client VPN endpoint cvpn-endpoint-1234567890abcdef0 in region {AWS_REGION_US_EAST_1} has client connection logging enabled."
            )
            assert (
                result[0].resource_arn
                == "arn:aws:ec2:us-east-1:123456789012:client-vpn-endpoint/cvpn-endpoint-1234567890abcdef0"
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_default_encryption_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_default_encryption/ec2_ebs_default_encryption_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_ec2_ebs_default_encryption_fixer:
    @mock_aws
    def test_ec2_ebs_encryption_fixer(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption_fixer.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption_fixer import (
                fixer,
            )

            # By default, the account has not public access blocked
            assert fixer(region=AWS_REGION_US_EAST_1)
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_default_encryption_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_default_encryption/ec2_ebs_default_encryption_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

EXAMPLE_AMI_ID = "ami-12c6146b"


class Test_ec2_ebs_default_encryption:
    @mock_aws
    def test_ec2_ebs_encryption_enabled(self):
        # Create EC2 Mocked Resources
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client.enable_ebs_encryption_by_default()

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption import (
                ec2_ebs_default_encryption,
            )

            check = ec2_ebs_default_encryption()
            results = check.execute()

            # One result per region
            assert len(results) == 2
            for result in results:
                if result.region == AWS_REGION_US_EAST_1:
                    assert result.status == "PASS"
                    assert (
                        result.status_extended == "EBS Default Encryption is activated."
                    )
                    assert result.resource_id == AWS_ACCOUNT_NUMBER
                    assert (
                        result.resource_arn
                        == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume"
                    )
                if result.region == AWS_REGION_EU_WEST_1:
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == "EBS Default Encryption is not activated."
                    )
                    assert result.resource_id == AWS_ACCOUNT_NUMBER
                    assert (
                        result.resource_arn
                        == f"arn:aws:ec2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:volume"
                    )

    @mock_aws
    def test_ec2_ebs_encryption_disabled(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption import (
                ec2_ebs_default_encryption,
            )

            check = ec2_ebs_default_encryption()
            results = check.execute()

            # One result per region
            assert len(results) == 2
            for result in results:
                if result.region == AWS_REGION_US_EAST_1:
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == "EBS Default Encryption is not activated."
                    )
                    assert result.resource_id == AWS_ACCOUNT_NUMBER
                    assert (
                        result.resource_arn
                        == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume"
                    )
                if result.region == AWS_REGION_EU_WEST_1:
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == "EBS Default Encryption is not activated."
                    )
                    assert result.resource_id == AWS_ACCOUNT_NUMBER
                    assert (
                        result.resource_arn
                        == f"arn:aws:ec2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:volume"
                    )

    @mock_aws
    def test_ec2_ebs_encryption_disabled_ignored(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            scan_unused_services=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption import (
                ec2_ebs_default_encryption,
            )

            check = ec2_ebs_default_encryption()
            result = check.execute()

            # One result per region
            assert len(result) == 0

    @mock_aws
    def test_ec2_ebs_encryption_disabled_ignoring_with_volumes(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2.create_volume(Size=36, AvailabilityZone=f"{AWS_REGION_US_EAST_1}a")
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1],
            scan_unused_services=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_default_encryption.ec2_ebs_default_encryption import (
                ec2_ebs_default_encryption,
            )

            check = ec2_ebs_default_encryption()
            result = check.execute()

            # One result per region
            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == "EBS Default Encryption is not activated."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:volume"
            )
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_public_snapshot_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_public_snapshot/ec2_ebs_public_snapshot_fixer_test.py

```python
from unittest import mock

import botocore
import botocore.client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

mock_make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call_public_snapshot(self, operation_name, kwarg):
    if operation_name == "ModifySnapshotAttribute":
        return {
            "SnapshotId": "testsnap",
            "Attribute": "createVolumePermission",
            "OperationType": "remove",
            "GroupNames": ["all"],
        }
    return mock_make_api_call(self, operation_name, kwarg)


def mock_make_api_call_error(self, operation_name, kwarg):
    if operation_name == "ModifySnapshotAttribute":
        raise botocore.exceptions.ClientError(
            {
                "Error": {
                    "Code": "UnauthorizedOperation",
                    "Message": "You are not authorized to perform this operation.",
                }
            },
            operation_name,
        )
    return mock_make_api_call(self, operation_name, kwarg)


class Test_ec2_ebs_public_snapshot_fixer_test:
    @mock_aws
    def test_ebs_public_snapshot(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call",
            new=mock_make_api_call_public_snapshot,
        ):

            from prowler.providers.aws.services.ec2.ec2_service import EC2

            aws_provider = set_mocked_aws_provider(
                [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
            )

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot_fixer.ec2_client",
                    new=EC2(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot_fixer import (
                    fixer,
                )

                assert fixer("testsnap", AWS_REGION_US_EAST_1)

    @mock_aws
    def test_ebs_public_snapshot_error(self):
        with mock.patch(
            "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_error
        ):

            from prowler.providers.aws.services.ec2.ec2_service import EC2

            aws_provider = set_mocked_aws_provider(
                [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
            )

            with (
                mock.patch(
                    "prowler.providers.common.provider.Provider.get_global_provider",
                    return_value=aws_provider,
                ),
                mock.patch(
                    "prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot_fixer.ec2_client",
                    new=EC2(aws_provider),
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot_fixer import (
                    fixer,
                )

                assert not fixer("testsnap", AWS_REGION_US_EAST_1)
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_public_snapshot_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_public_snapshot/ec2_ebs_public_snapshot_test.py

```python
from unittest import mock

from boto3 import client, resource
from mock import patch
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


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
class Test_ec2_ebs_public_snapshot:
    @mock_aws
    def test_ec2_default_snapshots(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot import (
                ec2_ebs_public_snapshot,
            )

            check = ec2_ebs_public_snapshot()
            result = check.execute()

            # Default snapshots (moto 5.1.11 creates additional default snapshots)
            assert len(result) == 565

    @mock_aws
    def test_ec2_public_snapshot(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        volume = ec2.create_volume(Size=80, AvailabilityZone=f"{AWS_REGION_US_EAST_1}a")
        snapshot = volume.create_snapshot(Description="testsnap")
        ec2_client.modify_snapshot_attribute(
            SnapshotId=snapshot.id,
            Attribute="createVolumePermission",
            OperationType="add",
            GroupNames=["all"],
        )

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot import (
                ec2_ebs_public_snapshot,
            )

            check = ec2_ebs_public_snapshot()
            results = check.execute()

            # Default snapshots + 1 created (moto 5.1.11 creates additional default snapshots)
            assert len(results) == 566

            for snap in results:
                if snap.resource_id == snapshot.id:
                    assert snap.region == AWS_REGION_US_EAST_1
                    assert snap.resource_tags == []
                    assert snap.status == "FAIL"
                    assert (
                        snap.status_extended
                        == f"EBS Snapshot {snapshot.id} is currently Public."
                    )
                    assert (
                        snap.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:snapshot/{snapshot.id}"
                    )

    @mock_aws
    def test_ec2_private_snapshot(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        snapshot = volume = ec2.create_volume(
            Size=80, AvailabilityZone=f"{AWS_REGION_US_EAST_1}a", Encrypted=True
        )
        snapshot = volume.create_snapshot(Description="testsnap")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_public_snapshot.ec2_ebs_public_snapshot import (
                ec2_ebs_public_snapshot,
            )

            check = ec2_ebs_public_snapshot()
            results = check.execute()

            # Default snapshots + 1 created (moto 5.1.11 creates additional default snapshots)
            assert len(results) == 566

            for snap in results:
                if snap.resource_id == snapshot.id:
                    assert snap.region == AWS_REGION_US_EAST_1
                    assert snap.resource_tags == []
                    assert snap.status == "PASS"
                    assert (
                        snap.status_extended
                        == f"EBS Snapshot {snapshot.id} is not Public."
                    )
                    assert (
                        snap.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:snapshot/{snapshot.id}"
                    )
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_snapshots_encrypted_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_snapshots_encrypted/ec2_ebs_snapshots_encrypted_test.py

```python
from unittest import mock

from boto3 import resource
from mock import patch
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


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
class Test_ec2_ebs_snapshots_encrypted:
    @mock_aws
    def test_ec2_default_snapshots(self):
        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_snapshots_encrypted.ec2_ebs_snapshots_encrypted.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_snapshots_encrypted.ec2_ebs_snapshots_encrypted import (
                ec2_ebs_snapshots_encrypted,
            )

            check = ec2_ebs_snapshots_encrypted()
            result = check.execute()

            # Default snapshots (moto 5.1.11 creates additional default snapshots)
            assert len(result) == 565

    @mock_aws
    def test_ec2_unencrypted_snapshot(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        volume = ec2.create_volume(Size=80, AvailabilityZone=f"{AWS_REGION_US_EAST_1}a")
        snapshot = volume.create_snapshot(Description="testsnap")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_snapshots_encrypted.ec2_ebs_snapshots_encrypted.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_snapshots_encrypted.ec2_ebs_snapshots_encrypted import (
                ec2_ebs_snapshots_encrypted,
            )

            check = ec2_ebs_snapshots_encrypted()
            results = check.execute()

            # Default snapshots + 1 created (moto 5.1.11 creates additional default snapshots)
            assert len(results) == 566

            for snap in results:
                if snap.resource_id == snapshot.id:
                    assert snap.region == AWS_REGION_US_EAST_1
                    assert snap.resource_tags == []
                    assert snap.status == "FAIL"
                    assert (
                        snap.status_extended
                        == f"EBS Snapshot {snapshot.id} is unencrypted."
                    )
                    assert (
                        snap.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:snapshot/{snapshot.id}"
                    )

    @mock_aws
    def test_ec2_encrypted_snapshot(self):
        # Create EC2 Mocked Resources
        ec2 = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        snapshot = volume = ec2.create_volume(
            Size=80, AvailabilityZone=f"{AWS_REGION_US_EAST_1}a", Encrypted=True
        )
        snapshot = volume.create_snapshot(Description="testsnap")

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_snapshots_encrypted.ec2_ebs_snapshots_encrypted.ec2_client",
                new=EC2(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_snapshots_encrypted.ec2_ebs_snapshots_encrypted import (
                ec2_ebs_snapshots_encrypted,
            )

            check = ec2_ebs_snapshots_encrypted()
            results = check.execute()

            # Default snapshots + 1 created (moto 5.1.11 creates additional default snapshots)
            assert len(results) == 566

            for snap in results:
                if snap.resource_id == snapshot.id:
                    assert snap.region == AWS_REGION_US_EAST_1
                    assert snap.resource_tags == []
                    assert snap.status == "PASS"
                    assert (
                        snap.status_extended
                        == f"EBS Snapshot {snapshot.id} is encrypted."
                    )
                    assert (
                        snap.resource_arn
                        == f"arn:{aws_provider.identity.partition}:ec2:{AWS_REGION_US_EAST_1}:{aws_provider.identity.account}:snapshot/{snapshot.id}"
                    )
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_snapshot_account_block_public_access_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_snapshot_account_block_public_access/ec2_ebs_snapshot_account_block_public_access_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.ec2.ec2_service import (
    EbsSnapshotBlockPublicAccess,
    InstanceMetadataDefaults,
)
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


# Since moto does not support the ec2 metadata service, we need to mock the response for some functions
def mock_get_instance_metadata_defaults(http_tokens, instances, region):
    return InstanceMetadataDefaults(
        http_tokens=http_tokens, instances=instances, region=region
    )


def mock_get_snapshot_block_public_access_state(status, snapshots, region):
    return EbsSnapshotBlockPublicAccess(
        status=status, snapshots=snapshots, region=region
    )


def mock_enable_snapshot_block_public_access(State):
    return {"State": State}


class Test_ec2_ebs_snapshot_account_block_public_access_fixer:
    @mock_aws
    def test_ec2_ebs_snapshot_account_block_public_access_fixer(self):
        ec2_service = mock.MagicMock()
        ec2_client = mock.MagicMock()
        ec2_service.regional_clients = {AWS_REGION_US_EAST_1: ec2_client}

        ec2_client.instance_metadata_defaults = [
            mock_get_instance_metadata_defaults(
                http_tokens="required", instances=True, region=AWS_REGION_US_EAST_1
            )
        ]

        ec2_client.ebs_block_public_access_snapshots_states = [
            mock_get_snapshot_block_public_access_state(
                status="block-all-sharing", snapshots=True, region=AWS_REGION_US_EAST_1
            )
        ]

        ec2_client.enable_snapshot_block_public_access = (
            mock_enable_snapshot_block_public_access
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_snapshot_account_block_public_access.ec2_ebs_snapshot_account_block_public_access_fixer.ec2_client",
                ec2_service,
            ),
        ):

            from prowler.providers.aws.services.ec2.ec2_ebs_snapshot_account_block_public_access.ec2_ebs_snapshot_account_block_public_access_fixer import (
                fixer,
            )

            # By default, the account has not public access blocked
            assert fixer(region=AWS_REGION_US_EAST_1)
```

--------------------------------------------------------------------------------

---[FILE: ec2_ebs_snapshot_account_block_public_access_test.py]---
Location: prowler-master/tests/providers/aws/services/ec2/ec2_ebs_snapshot_account_block_public_access/ec2_ebs_snapshot_account_block_public_access_test.py

```python
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_ec2_ebs_snapshot_account_block_public_access:
    @mock_aws
    def test_ec2_ebs_block_public_access_state_unblocked(self):
        from prowler.providers.aws.services.ec2.ec2_service import (
            EbsSnapshotBlockPublicAccess,
        )

        ec2_client = mock.MagicMock()
        ec2_client.ebs_block_public_access_snapshots_states = [
            EbsSnapshotBlockPublicAccess(
                status="unblocked", snapshots=True, region=AWS_REGION_US_EAST_1
            )
        ]
        ec2_client.audited_account = AWS_ACCOUNT_NUMBER
        ec2_client.region = AWS_REGION_US_EAST_1
        ec2_client.account_arn_template = (
            f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_snapshot_account_block_public_access.ec2_ebs_snapshot_account_block_public_access.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_snapshot_account_block_public_access.ec2_ebs_snapshot_account_block_public_access import (
                ec2_ebs_snapshot_account_block_public_access,
            )

            check = ec2_ebs_snapshot_account_block_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Public access is not blocked for EBS Snapshots."
            )
            assert (
                result[0].resource_arn
                == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_ec2_ebs_block_public_access_state_block_new_sharing(self):
        from prowler.providers.aws.services.ec2.ec2_service import (
            EbsSnapshotBlockPublicAccess,
        )

        ec2_client = mock.MagicMock()
        ec2_client.ebs_block_public_access_snapshots_states = [
            EbsSnapshotBlockPublicAccess(
                status="block-new-sharing", snapshots=True, region=AWS_REGION_US_EAST_1
            )
        ]
        ec2_client.audited_account = AWS_ACCOUNT_NUMBER
        ec2_client.region = AWS_REGION_US_EAST_1
        ec2_client.account_arn_template = (
            f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_snapshot_account_block_public_access.ec2_ebs_snapshot_account_block_public_access.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_snapshot_account_block_public_access.ec2_ebs_snapshot_account_block_public_access import (
                ec2_ebs_snapshot_account_block_public_access,
            )

            check = ec2_ebs_snapshot_account_block_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Public access is blocked only for new EBS Snapshots."
            )
            assert (
                result[0].resource_arn
                == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER

    @mock_aws
    def test_ec2_ebs_block_public_access_state_block_all_sharing(self):
        from prowler.providers.aws.services.ec2.ec2_service import (
            EbsSnapshotBlockPublicAccess,
        )

        ec2_client = mock.MagicMock()
        ec2_client.ebs_block_public_access_snapshots_states = [
            EbsSnapshotBlockPublicAccess(
                status="block-all-sharing", snapshots=True, region=AWS_REGION_US_EAST_1
            )
        ]
        ec2_client.audited_account = AWS_ACCOUNT_NUMBER
        ec2_client.region = AWS_REGION_US_EAST_1
        ec2_client.account_arn_template = (
            f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_ebs_snapshot_account_block_public_access.ec2_ebs_snapshot_account_block_public_access.ec2_client",
                new=ec2_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.ec2.ec2_ebs_snapshot_account_block_public_access.ec2_ebs_snapshot_account_block_public_access import (
                ec2_ebs_snapshot_account_block_public_access,
            )

            check = ec2_ebs_snapshot_account_block_public_access()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Public access is blocked for all EBS Snapshots."
            )
            assert (
                result[0].resource_arn
                == f"arn:aws:ec2:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:account"
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
```

--------------------------------------------------------------------------------

````
