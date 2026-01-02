---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 495
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 495 of 867)

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

---[FILE: directoryservice_ldap_certificate_expiration_test.py]---
Location: prowler-master/tests/providers/aws/services/directoryservice/directoryservice_ldap_certificate_expiration/directoryservice_ldap_certificate_expiration_test.py

```python
from datetime import datetime
from unittest import mock

from freezegun import freeze_time

from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    Certificate,
    CertificateState,
    CertificateType,
    Directory,
    DirectoryType,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


# Always use a mocked date to test the certificates expiration
@freeze_time("2023-01-01")
class Test_directoryservice_ldap_certificate_expiration:
    def test_no_directories(self):
        directoryservice_client = mock.MagicMock
        directoryservice_client.directories = {}
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_ldap_certificate_expiration.directoryservice_ldap_certificate_expiration import (
                directoryservice_ldap_certificate_expiration,
            )

            check = directoryservice_ldap_certificate_expiration()
            result = check.execute()

            assert len(result) == 0

    def test_directory_no_certificate(self):
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
                certificates=[],
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_ldap_certificate_expiration.directoryservice_ldap_certificate_expiration import (
                directoryservice_ldap_certificate_expiration,
            )

            check = directoryservice_ldap_certificate_expiration()
            result = check.execute()

            assert len(result) == 0

    def test_directory_certificate_expires_in_365_days(self):
        remaining_days_to_expire = 365

        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        certificate_id = "test-certificate"
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
                certificates=[
                    Certificate(
                        id=certificate_id,
                        common_name=certificate_id,
                        state=CertificateState.Registered,
                        type=CertificateType.ClientLDAPS,
                        expiry_date_time=datetime(2024, 1, 1),
                    )
                ],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_ldap_certificate_expiration.directoryservice_ldap_certificate_expiration import (
                directoryservice_ldap_certificate_expiration,
            )

            check = directoryservice_ldap_certificate_expiration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == certificate_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"LDAP Certificate {certificate_id} configured at {directory_id} expires in {remaining_days_to_expire} days."
            )

    def test_directory_certificate_expires_in_90_days(self):
        remaining_days_to_expire = 90

        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        certificate_id = "test-certificate"
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
                certificates=[
                    Certificate(
                        id=certificate_id,
                        common_name=certificate_id,
                        state=CertificateState.Registered,
                        type=CertificateType.ClientLDAPS,
                        expiry_date_time=datetime(2023, 4, 1),
                    )
                ],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_ldap_certificate_expiration.directoryservice_ldap_certificate_expiration import (
                directoryservice_ldap_certificate_expiration,
            )

            check = directoryservice_ldap_certificate_expiration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == certificate_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"LDAP Certificate {certificate_id} configured at {directory_id} is about to expire in {remaining_days_to_expire} days."
            )

    def test_directory_certificate_expires_in_31_days(self):
        remaining_days_to_expire = 31

        directoryservice_client = mock.MagicMock
        directory_name = "test-directory"
        certificate_id = "test-certificate"
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
                certificates=[
                    Certificate(
                        id=certificate_id,
                        common_name=certificate_id,
                        state=CertificateState.Registered,
                        type=CertificateType.ClientLDAPS,
                        expiry_date_time=datetime(2023, 2, 1),
                    )
                ],
            )
        }

        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_ldap_certificate_expiration.directoryservice_ldap_certificate_expiration import (
                directoryservice_ldap_certificate_expiration,
            )

            check = directoryservice_ldap_certificate_expiration()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == certificate_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"LDAP Certificate {certificate_id} configured at {directory_id} is about to expire in {remaining_days_to_expire} days."
            )
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_radius_server_security_protocol_test.py]---
Location: prowler-master/tests/providers/aws/services/directoryservice/directoryservice_radius_server_security_protocol/directoryservice_radius_server_security_protocol_test.py

```python
from unittest import mock

from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    AuthenticationProtocol,
    Directory,
    DirectoryType,
    RadiusSettings,
    RadiusStatus,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_directoryservice_radius_server_security_protocol:
    def test_no_directories(self):
        directoryservice_client = mock.MagicMock
        directoryservice_client.directories = {}
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_radius_server_security_protocol.directoryservice_radius_server_security_protocol import (
                directoryservice_radius_server_security_protocol,
            )

            check = directoryservice_radius_server_security_protocol()
            result = check.execute()

            assert len(result) == 0

    def test_directory_no_radius_server(self):
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
                radius_settings=None,
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_radius_server_security_protocol.directoryservice_radius_server_security_protocol import (
                directoryservice_radius_server_security_protocol,
            )

            check = directoryservice_radius_server_security_protocol()
            result = check.execute()

            assert len(result) == 0

    def test_directory_radius_server_bad_auth_protocol(self):
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
                radius_settings=RadiusSettings(
                    authentication_protocol=AuthenticationProtocol.MS_CHAPv1,
                    status=RadiusStatus.Completed,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_radius_server_security_protocol.directoryservice_radius_server_security_protocol import (
                directoryservice_radius_server_security_protocol,
            )

            check = directoryservice_radius_server_security_protocol()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Radius server of Directory {directory_id} does not have recommended security protocol for the Radius server."
            )

    def test_directory_radius_server_secure_auth_protocol(self):
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
                radius_settings=RadiusSettings(
                    authentication_protocol=AuthenticationProtocol.MS_CHAPv2,
                    status=RadiusStatus.Completed,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_radius_server_security_protocol.directoryservice_radius_server_security_protocol import (
                directoryservice_radius_server_security_protocol,
            )

            check = directoryservice_radius_server_security_protocol()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Radius server of Directory {directory_id} have recommended security protocol for the Radius server."
            )
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_supported_mfa_radius_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/directoryservice/directoryservice_supported_mfa_radius_enabled/directoryservice_supported_mfa_radius_enabled_test.py

```python
from unittest import mock

from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    AuthenticationProtocol,
    Directory,
    DirectoryType,
    RadiusSettings,
    RadiusStatus,
)

AWS_REGION = "eu-west-1"
AWS_ACCOUNT_NUMBER = "123456789012"


class Test_directoryservice_supported_mfa_radius_enabled:
    def test_no_directories(self):
        directoryservice_client = mock.MagicMock
        directoryservice_client.directories = {}
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_supported_mfa_radius_enabled.directoryservice_supported_mfa_radius_enabled import (
                directoryservice_supported_mfa_radius_enabled,
            )

            check = directoryservice_supported_mfa_radius_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_directory_no_radius_server(self):
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
                radius_settings=None,
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_supported_mfa_radius_enabled.directoryservice_supported_mfa_radius_enabled import (
                directoryservice_supported_mfa_radius_enabled,
            )

            check = directoryservice_supported_mfa_radius_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_directory_radius_server_status_failed(self):
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
                radius_settings=RadiusSettings(
                    authentication_protocol=AuthenticationProtocol.MS_CHAPv1,
                    status=RadiusStatus.Failed,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_supported_mfa_radius_enabled.directoryservice_supported_mfa_radius_enabled import (
                directoryservice_supported_mfa_radius_enabled,
            )

            check = directoryservice_supported_mfa_radius_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Directory {directory_id} does not have Radius MFA enabled."
            )

    def test_directory_radius_server_status_creating(self):
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
                radius_settings=RadiusSettings(
                    authentication_protocol=AuthenticationProtocol.MS_CHAPv2,
                    status=RadiusStatus.Creating,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_supported_mfa_radius_enabled.directoryservice_supported_mfa_radius_enabled import (
                directoryservice_supported_mfa_radius_enabled,
            )

            check = directoryservice_supported_mfa_radius_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Directory {directory_id} does not have Radius MFA enabled."
            )

    def test_directory_radius_server_status_completed(self):
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
                radius_settings=RadiusSettings(
                    authentication_protocol=AuthenticationProtocol.MS_CHAPv2,
                    status=RadiusStatus.Completed,
                ),
            )
        }
        with mock.patch(
            "prowler.providers.aws.services.directoryservice.directoryservice_service.DirectoryService",
            new=directoryservice_client,
        ):
            # Test Check
            from prowler.providers.aws.services.directoryservice.directoryservice_supported_mfa_radius_enabled.directoryservice_supported_mfa_radius_enabled import (
                directoryservice_supported_mfa_radius_enabled,
            )

            check = directoryservice_supported_mfa_radius_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].resource_id == directory_id
            assert result[0].resource_arn == directory_arn
            assert result[0].resource_tags == []
            assert result[0].region == AWS_REGION
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Directory {directory_id} have Radius MFA enabled."
            )
```

--------------------------------------------------------------------------------

---[FILE: dlm_service_test.py]---
Location: prowler-master/tests/providers/aws/services/dlm/dlm_service_test.py

```python
import botocore
from mock import patch

from prowler.providers.aws.services.dlm.dlm_service import DLM, LifecyclePolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

LIFECYCLE_POLICY_ID = "policy-XXXXXXXXXXXX"

# Mocking Access Analyzer Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """
    As you can see the operation_name has the list_analyzers snake_case form but
    we are using the ListAnalyzers form.
    Rationale -> https://github.com/boto/botocore/blob/develop/botocore/client.py#L810:L816

    We have to mock every AWS API call using Boto3
    """
    if operation_name == "GetLifecyclePolicies":
        return {
            "Policies": [
                {
                    "PolicyId": "policy-XXXXXXXXXXXX",
                    "Description": "test",
                    "State": "ENABLED",
                    "Tags": {"environment": "dev"},
                    "PolicyType": "EBS_SNAPSHOT_MANAGEMENT",
                }
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
class Test_DLM_Service:
    # Test DLM Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        dlm = DLM(aws_provider)
        assert dlm.service == "dlm"

    # Test DLM Client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        dlm = DLM(aws_provider)
        assert dlm.client.__class__.__name__ == "DLM"

    # Test DLM Session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        dlm = DLM(aws_provider)
        assert dlm.session.__class__.__name__ == "Session"

    # Test DLM Session
    def test_audited_account(self):
        aws_provider = set_mocked_aws_provider()
        dlm = DLM(aws_provider)
        assert dlm.audited_account == AWS_ACCOUNT_NUMBER

    # Test DLM Get DLM Contacts
    def test_get_lifecycle_policies(self):
        # DLM client for this test class
        aws_provider = set_mocked_aws_provider()
        dlm = DLM(aws_provider)
        assert dlm.lifecycle_policies == {
            AWS_REGION_US_EAST_1: {
                LIFECYCLE_POLICY_ID: LifecyclePolicy(
                    id=LIFECYCLE_POLICY_ID,
                    state="ENABLED",
                    tags={"environment": "dev"},
                    type="EBS_SNAPSHOT_MANAGEMENT",
                )
            }
        }
```

--------------------------------------------------------------------------------

---[FILE: dlm_ebs_snapshot_lifecycle_policy_exists_test.py]---
Location: prowler-master/tests/providers/aws/services/dlm/dlm_ebs_snapshot_lifecycle_policy_exists/dlm_ebs_snapshot_lifecycle_policy_exists_test.py

```python
from unittest import mock

from boto3 import client, resource
from moto import mock_aws

from prowler.providers.aws.services.dlm.dlm_service import LifecyclePolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_ARN,
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

LIFECYCLE_POLICY_ID = "policy-XXXXXXXXXXXX"


class Test_dlm_ebs_snapshot_lifecycle_policy_exists:
    @mock_aws
    def test_no_ebs_snapshot_no_lifecycle_policies(self):
        # DLM Mock Client
        dlm_client = mock.MagicMock
        dlm_client.audited_account = AWS_ACCOUNT_NUMBER
        dlm_client.audited_account_arn = AWS_ACCOUNT_ARN
        dlm_client.lifecycle_policies = {}

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.aws.services.dlm.dlm_service.DLM",
                new=dlm_client,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_service.EC2",
                return_value=EC2(aws_provider),
            ) as ec2_client,
            mock.patch(
                "prowler.providers.aws.services.ec2.ec2_client.ec2_client",
                new=ec2_client,
            ),
        ):
            from prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists import (
                dlm_ebs_snapshot_lifecycle_policy_exists,
            )

            check = dlm_ebs_snapshot_lifecycle_policy_exists()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_one_ebs_snapshot_and_dlm_lifecycle_policy(self):
        # Generate EC2 Client
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        # Create EC2 Volume and Snapshot
        volume_id = ec2_resource.create_volume(
            AvailabilityZone="us-east-1a",
            Size=80,
            VolumeType="gp2",
        ).id
        _ = ec2_client.create_snapshot(
            VolumeId=volume_id,
            TagSpecifications=[
                {
                    "ResourceType": "snapshot",
                    "Tags": [
                        {"Key": "test", "Value": "test"},
                    ],
                },
            ],
        )["SnapshotId"]

        # DLM Mock Client
        dlm_client = mock.MagicMock()
        dlm_client.audited_account = AWS_ACCOUNT_NUMBER
        dlm_client.audited_account_arn = AWS_ACCOUNT_ARN
        dlm_client.region = AWS_REGION_US_EAST_1
        dlm_client.audited_partition = "aws"
        dlm_client.lifecycle_policies = {
            AWS_REGION_US_EAST_1: {
                LIFECYCLE_POLICY_ID: LifecyclePolicy(
                    id=LIFECYCLE_POLICY_ID,
                    state="ENABLED",
                    tags={},
                    type="EBS_SNAPSHOT_MANAGEMENT",
                )
            }
        }
        dlm_client.lifecycle_policy_arn_template = f"arn:{dlm_client.audited_partition}:dlm:{dlm_client.region}:{dlm_client.audited_account}:policy"
        dlm_client._get_lifecycle_policy_arn_template = mock.MagicMock(
            return_value=dlm_client.lifecycle_policy_arn_template
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_client",
                new=dlm_client,
            ),
        ):
            from prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists import (
                dlm_ebs_snapshot_lifecycle_policy_exists,
            )

            check = dlm_ebs_snapshot_lifecycle_policy_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "EBS snapshot lifecycle policies found."
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:dlm:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:policy"
            )

    @mock_aws
    def test_one_ebs_snapshot_and_no_dlm_lifecycle_policy(self):
        # Generate EC2 Client
        ec2_client = client("ec2", region_name=AWS_REGION_US_EAST_1)
        ec2_resource = resource("ec2", region_name=AWS_REGION_US_EAST_1)
        # Create EC2 Volume and Snapshot
        volume_id = ec2_resource.create_volume(
            AvailabilityZone="us-east-1a",
            Size=80,
            VolumeType="gp2",
        ).id
        _ = ec2_client.create_snapshot(
            VolumeId=volume_id,
            TagSpecifications=[
                {
                    "ResourceType": "snapshot",
                    "Tags": [
                        {"Key": "test", "Value": "test"},
                    ],
                },
            ],
        )["SnapshotId"]

        # DLM Mock Client
        dlm_client = mock.MagicMock
        dlm_client.audited_account = AWS_ACCOUNT_NUMBER
        dlm_client.audited_account_arn = AWS_ACCOUNT_ARN
        dlm_client.lifecycle_policies = {}

        # from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists.ec2_client",
                new=EC2(aws_provider),
            ),
            mock.patch(
                "prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_client",
                new=dlm_client,
            ),
        ):
            from prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists import (
                dlm_ebs_snapshot_lifecycle_policy_exists,
            )

            check = dlm_ebs_snapshot_lifecycle_policy_exists()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_no_ebs_snapshot_and_dlm_lifecycle_policy(self):
        # DLM Mock Client
        dlm_client = mock.MagicMock
        dlm_client.audited_account = AWS_ACCOUNT_NUMBER
        dlm_client.audited_account_arn = AWS_ACCOUNT_ARN
        dlm_client.lifecycle_policies = {
            AWS_REGION_US_EAST_1: {
                LIFECYCLE_POLICY_ID: LifecyclePolicy(
                    id=LIFECYCLE_POLICY_ID,
                    state="ENABLED",
                    tags={},
                    type="EBS_SNAPSHOT_MANAGEMENT",
                )
            }
        }

        # from prowler.providers.aws.services.ec2.ec2_service import EC2

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.ec2.ec2_service import EC2

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists.ec2_client",
                new=EC2(aws_provider),
            ) as ec2_client,
            mock.patch(
                "prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_client",
                new=dlm_client,
            ),
        ):
            # Remove all snapshots
            ec2_client.regions_with_snapshots = {}

            from prowler.providers.aws.services.dlm.dlm_ebs_snapshot_lifecycle_policy_exists.dlm_ebs_snapshot_lifecycle_policy_exists import (
                dlm_ebs_snapshot_lifecycle_policy_exists,
            )

            check = dlm_ebs_snapshot_lifecycle_policy_exists()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
