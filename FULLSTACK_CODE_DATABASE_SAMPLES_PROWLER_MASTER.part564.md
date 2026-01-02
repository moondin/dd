---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 564
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 564 of 867)

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

---[FILE: glue_ml_transform_encrypted_at_rest_test.py]---
Location: prowler-master/tests/providers/aws/services/glue/glue_ml_transform_encrypted_at_rest/glue_ml_transform_encrypted_at_rest_test.py

```python
from unittest.mock import MagicMock, patch

from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_EU_WEST_1


class Test_glue_ml_transform_encrypted_at_rest:
    def test_no_ml_transfroms(self):
        glue_client = MagicMock
        glue_client.ml_transforms = {}

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            from prowler.providers.aws.services.glue.glue_ml_transform_encrypted_at_rest.glue_ml_transform_encrypted_at_rest import (
                glue_ml_transform_encrypted_at_rest,
            )

            check = glue_ml_transform_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 0

    def test_ml_transform_encryption_disabled(self):
        glue_client = MagicMock
        ml_transform_id = "transform1"
        ml_transform_arn = f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:mlTransform/{ml_transform_id}"

        from prowler.providers.aws.services.glue.glue_service import MLTransform

        glue_client.ml_transforms = {
            ml_transform_arn: MLTransform(
                arn=ml_transform_arn,
                id=ml_transform_id,
                name="ml-transform1",
                user_data_encryption="DISABLED",
                region=AWS_REGION_EU_WEST_1,
                tags=[{"test_key": "test_value"}],
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            from prowler.providers.aws.services.glue.glue_ml_transform_encrypted_at_rest.glue_ml_transform_encrypted_at_rest import (
                glue_ml_transform_encrypted_at_rest,
            )

            check = glue_ml_transform_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == ml_transform_id
            assert result[0].resource_arn == ml_transform_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].status_extended
                == "Glue ML Transform ml-transform1 is not encrypted at rest."
            )

    def test_ml_transform_encryption_enabled(self):
        glue_client = MagicMock
        ml_transform_id = "transform2"
        ml_transform_arn = f"arn:aws:glue:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:mlTransform/{ml_transform_id}"

        from prowler.providers.aws.services.glue.glue_service import MLTransform

        glue_client.ml_transforms = {
            ml_transform_arn: MLTransform(
                arn=ml_transform_arn,
                id=ml_transform_id,
                name="ml-transform2",
                user_data_encryption="SSE-KMS",
                region=AWS_REGION_EU_WEST_1,
                tags=[{"test_key": "test_value"}],
            )
        }

        with (
            patch(
                "prowler.providers.aws.services.glue.glue_service.Glue",
                new=glue_client,
            ),
            patch(
                "prowler.providers.aws.services.glue.glue_client.glue_client",
                new=glue_client,
            ),
        ):
            from prowler.providers.aws.services.glue.glue_ml_transform_encrypted_at_rest.glue_ml_transform_encrypted_at_rest import (
                glue_ml_transform_encrypted_at_rest,
            )

            check = glue_ml_transform_encrypted_at_rest()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == ml_transform_id
            assert result[0].resource_arn == ml_transform_arn
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].status_extended
                == "Glue ML Transform ml-transform2 is encrypted at rest."
            )
```

--------------------------------------------------------------------------------

---[FILE: guardduty_service_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

AWS_ACCOUNT_NUMBER_ADMIN = "123456789013"


make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListFindings":
        return {"FindingIds": ["86c1d16c9ec63f634ccd087ae0d427ba1"]}
    if operation_name == "ListTagsForResource":
        return {"Tags": {"test": "test"}}
    if operation_name == "ListMembers":
        return {
            "Members": [
                {
                    "AccountId": AWS_ACCOUNT_NUMBER,
                    "DetectorId": "11b4a9318fd146914420a637a4a9248b",
                    "MasterId": AWS_ACCOUNT_NUMBER_ADMIN,
                    "Email": "security@prowler.com",
                    "RelationshipStatus": "Enabled",
                    "InvitedAt": datetime(2020, 1, 1),
                    "UpdatedAt": datetime(2021, 1, 1),
                    "AdministratorId": AWS_ACCOUNT_NUMBER_ADMIN,
                },
            ],
        }
    if operation_name == "GetAdministratorAccount":
        return {
            "Administrator": {
                "AccountId": AWS_ACCOUNT_NUMBER_ADMIN,
                "InvitationId": "12b1a931a981d1e1f1f452cf2fb3d515",
                "RelationshipStatus": "Enabled",
                "InvitedAt": datetime(2020, 1, 1),
            }
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
class Test_GuardDuty_Service:
    # Test GuardDuty Service
    def test_service(self):
        aws_provider = set_mocked_aws_provider()
        guardduty = GuardDuty(aws_provider)
        assert guardduty.service == "guardduty"

    # Test GuardDuty client
    def test_client(self):
        aws_provider = set_mocked_aws_provider()
        guardduty = GuardDuty(aws_provider)
        for reg_client in guardduty.regional_clients.values():
            assert reg_client.__class__.__name__ == "GuardDuty"

    # Test GuardDuty session
    def test__get_session__(self):
        aws_provider = set_mocked_aws_provider()
        guardduty = GuardDuty(aws_provider)
        assert guardduty.session.__class__.__name__ == "Session"

    @mock_aws
    # Test GuardDuty session
    def test_list_detectors(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)
        response = guardduty_client.create_detector(Enable=True, Tags={"test": "test"})

        aws_provider = set_mocked_aws_provider()
        guardduty = GuardDuty(aws_provider)

        assert len(guardduty.detectors) == 1
        assert guardduty.detectors[0].id == response["DetectorId"]
        assert (
            guardduty.detectors[0].arn
            == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{response['DetectorId']}"
        )
        assert guardduty.detectors[0].enabled_in_account
        assert len(guardduty.detectors[0].findings) == 1
        assert guardduty.detectors[0].member_accounts == ["123456789012"]
        assert guardduty.detectors[0].administrator_account == "123456789013"
        assert guardduty.detectors[0].region == AWS_REGION_EU_WEST_1
        assert guardduty.detectors[0].tags == [{"test": "test"}]

    @mock_aws
    # Test GuardDuty session
    def test_get_detector(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)
        response = guardduty_client.create_detector(
            Enable=True,
            DataSources={
                "S3Logs": {"Enable": True},
                "Kubernetes": {"AuditLogs": {"Enable": True}},
            },
            Features=[
                {"Name": "LAMBDA_NETWORK_LOGS", "Status": "ENABLED"},
                {"Name": "EKS_RUNTIME_MONITORING", "Status": "ENABLED"},
            ],
        )

        aws_provider = set_mocked_aws_provider()
        guardduty = GuardDuty(aws_provider)

        assert len(guardduty.detectors) == 1
        assert guardduty.detectors[0].id == response["DetectorId"]
        assert (
            guardduty.detectors[0].arn
            == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{response['DetectorId']}"
        )
        assert guardduty.detectors[0].enabled_in_account
        assert len(guardduty.detectors[0].findings) == 1
        assert guardduty.detectors[0].member_accounts == ["123456789012"]
        assert guardduty.detectors[0].administrator_account == "123456789013"
        assert guardduty.detectors[0].s3_protection
        assert not guardduty.detectors[0].rds_protection
        assert guardduty.detectors[0].eks_audit_log_protection
        assert guardduty.detectors[0].eks_runtime_monitoring
        assert guardduty.detectors[0].lambda_protection
        assert not guardduty.detectors[0].ec2_malware_protection
        assert guardduty.detectors[0].region == AWS_REGION_EU_WEST_1
        assert guardduty.detectors[0].tags == [{"test": "test"}]

    @mock_aws
    # Test GuardDuty session
    def test_list_findings(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)
        response = guardduty_client.create_detector(Enable=True)

        aws_provider = set_mocked_aws_provider()
        guardduty = GuardDuty(aws_provider)

        assert len(guardduty.detectors) == 1
        assert guardduty.detectors[0].id == response["DetectorId"]
        assert (
            guardduty.detectors[0].arn
            == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{response['DetectorId']}"
        )
        assert guardduty.detectors[0].enabled_in_account
        assert len(guardduty.detectors[0].findings) == 1
        assert guardduty.detectors[0].member_accounts == ["123456789012"]
        assert guardduty.detectors[0].administrator_account == "123456789013"
        assert guardduty.detectors[0].region == AWS_REGION_EU_WEST_1
        assert guardduty.detectors[0].tags == [{"test": "test"}]

    @mock_aws
    def test_list_members(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)
        response = guardduty_client.create_detector(Enable=True)

        aws_provider = set_mocked_aws_provider()
        guardduty = GuardDuty(aws_provider)

        assert len(guardduty.detectors) == 1
        assert guardduty.detectors[0].id == response["DetectorId"]
        assert (
            guardduty.detectors[0].arn
            == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{response['DetectorId']}"
        )
        assert guardduty.detectors[0].enabled_in_account
        assert len(guardduty.detectors[0].findings) == 1
        assert guardduty.detectors[0].member_accounts == ["123456789012"]
        assert guardduty.detectors[0].administrator_account == "123456789013"
        assert guardduty.detectors[0].region == AWS_REGION_EU_WEST_1
        assert guardduty.detectors[0].tags == [{"test": "test"}]

    @mock_aws
    # Test GuardDuty session
    def test_get_administrator_account(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)
        response = guardduty_client.create_detector(Enable=True)

        aws_provider = set_mocked_aws_provider()
        guardduty = GuardDuty(aws_provider)

        assert len(guardduty.detectors) == 1
        assert guardduty.detectors[0].id == response["DetectorId"]
        assert (
            guardduty.detectors[0].arn
            == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{response['DetectorId']}"
        )
        assert guardduty.detectors[0].enabled_in_account
        assert len(guardduty.detectors[0].findings) == 1
        assert guardduty.detectors[0].member_accounts == ["123456789012"]
        assert guardduty.detectors[0].administrator_account == "123456789013"
        assert guardduty.detectors[0].region == AWS_REGION_EU_WEST_1
        assert guardduty.detectors[0].tags == [{"test": "test"}]
```

--------------------------------------------------------------------------------

---[FILE: guardduty_centrally_managed_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_centrally_managed/guardduty_centrally_managed_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call_admin_enabled(self, operation_name, api_params):
    if operation_name == "GetAdministratorAccount":
        return {
            "Administrator": {
                "AccountId": "210987654321",
            }
        }
    return orig(self, operation_name, api_params)


def mock_make_api_call_members_managers(self, operation_name, api_params):
    if operation_name == "ListMembers":
        return {
            "Members": [
                {
                    "AccountId": "210987654321",
                    "RelationshipStatus": "Enabled",
                }
            ]
        }
    return orig(self, operation_name, api_params)


class Test_guardduty_centrally_managed:
    @mock_aws
    def test_no_detectors(self):
        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_centrally_managed.guardduty_centrally_managed.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.guardduty.guardduty_centrally_managed.guardduty_centrally_managed import (
                guardduty_centrally_managed,
            )

            check = guardduty_centrally_managed()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_detector_no_centralized_managed(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=True)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_centrally_managed.guardduty_centrally_managed.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_centrally_managed.guardduty_centrally_managed import (
                guardduty_centrally_managed,
            )

            check = guardduty_centrally_managed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} is not centrally managed."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_admin_enabled,
    )
    @mock_aws
    def test_detector_centralized_managed(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=True)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_centrally_managed.guardduty_centrally_managed.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_centrally_managed.guardduty_centrally_managed import (
                guardduty_centrally_managed,
            )

            check = guardduty_centrally_managed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} is centrally managed by account 210987654321."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )

    @patch(
        "botocore.client.BaseClient._make_api_call",
        new=mock_make_api_call_members_managers,
    )
    @mock_aws
    def test_detector_members_accounts(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(Enable=True)["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_centrally_managed.guardduty_centrally_managed.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_centrally_managed.guardduty_centrally_managed import (
                guardduty_centrally_managed,
            )

            check = guardduty_centrally_managed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} is administrator account with 1 member accounts."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
```

--------------------------------------------------------------------------------

---[FILE: guardduty_ec2_malware_protection_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_ec2_malware_protection_enabled/guardduty_ec2_malware_protection_enabled_test.py

```python
from unittest.mock import patch

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "GetDetector":
        return {
            "CreatedAt": "2021-01-01T00:00:00Z",
            "FindingPublishingFrequency": "FIFTEEN_MINUTES",
            "ServiceRole": "AWSServiceRoleForAmazonGuardDuty",
            "Status": "ENABLED",
            "UpdatedAt": "2021-01-01T00:00:00Z",
            "DataSources": {
                "S3Logs": {
                    "Enable": False,
                },
                "CloudTrail": {
                    "Enable": False,
                },
                "DNSLogs": {
                    "Enable": False,
                },
                "MalwareProtection": {
                    "ScanEc2InstanceWithFindings": {
                        "EbsVolumes": {"Status": "ENABLED"},
                    },
                },
            },
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


class Test_guardduty_ec2_malware_protection_enabled:
    def test_no_detectors(self):
        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_ec2_malware_protection_enabled.guardduty_ec2_malware_protection_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_ec2_malware_protection_enabled.guardduty_ec2_malware_protection_enabled import (
                guardduty_ec2_malware_protection_enabled,
            )

            check = guardduty_ec2_malware_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_detector_disabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        guardduty_client.create_detector(Enable=False)

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_ec2_malware_protection_enabled.guardduty_ec2_malware_protection_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_ec2_malware_protection_enabled.guardduty_ec2_malware_protection_enabled import (
                guardduty_ec2_malware_protection_enabled,
            )

            check = guardduty_ec2_malware_protection_enabled()
            result = check.execute()

            assert len(result) == 0

    @patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_detector_malware_protection_enabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(
            Enable=True,
            DataSources={
                "MalwareProtection": {
                    "ScanEc2InstanceWithFindings": {"EbsVolumes": True}
                }
            },
        )["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_ec2_malware_protection_enabled.guardduty_ec2_malware_protection_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_ec2_malware_protection_enabled.guardduty_ec2_malware_protection_enabled import (
                guardduty_ec2_malware_protection_enabled,
            )

            check = guardduty_ec2_malware_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} has Malware Protection for EC2 enabled."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_detector_malware_protection_disabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(
            Enable=True,
            DataSources={
                "MalwareProtection": {
                    "ScanEc2InstanceWithFindings": {"EbsVolumes": False}
                }
            },
        )["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_ec2_malware_protection_enabled.guardduty_ec2_malware_protection_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_ec2_malware_protection_enabled.guardduty_ec2_malware_protection_enabled import (
                guardduty_ec2_malware_protection_enabled,
            )

            check = guardduty_ec2_malware_protection_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} does not have Malware Protection for EC2 enabled."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: guardduty_eks_audit_log_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/guardduty/guardduty_eks_audit_log_enabled/guardduty_eks_audit_log_enabled_test.py

```python
from unittest.mock import patch

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_guardduty_eks_audit_log_enabled:
    def test_no_detectors(self):
        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_eks_audit_log_enabled.guardduty_eks_audit_log_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_eks_audit_log_enabled.guardduty_eks_audit_log_enabled import (
                guardduty_eks_audit_log_enabled,
            )

            check = guardduty_eks_audit_log_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_detector_disabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        guardduty_client.create_detector(Enable=False)

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_eks_audit_log_enabled.guardduty_eks_audit_log_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_eks_audit_log_enabled.guardduty_eks_audit_log_enabled import (
                guardduty_eks_audit_log_enabled,
            )

            check = guardduty_eks_audit_log_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_detector_eks_audit_log_enabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(
            Enable=True, DataSources={"Kubernetes": {"AuditLogs": {"Enable": True}}}
        )["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_eks_audit_log_enabled.guardduty_eks_audit_log_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_eks_audit_log_enabled.guardduty_eks_audit_log_enabled import (
                guardduty_eks_audit_log_enabled,
            )

            check = guardduty_eks_audit_log_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} has EKS Audit Log Monitoring enabled."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []

    @mock_aws
    def test_detector_eks_audit_log_disabled(self):
        guardduty_client = client("guardduty", region_name=AWS_REGION_EU_WEST_1)

        detector_id = guardduty_client.create_detector(
            Enable=True, DataSources={"Kubernetes": {"AuditLogs": {"Enable": False}}}
        )["DetectorId"]

        aws_provider = set_mocked_aws_provider()

        from prowler.providers.aws.services.guardduty.guardduty_service import GuardDuty

        with (
            patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            patch(
                "prowler.providers.aws.services.guardduty.guardduty_eks_audit_log_enabled.guardduty_eks_audit_log_enabled.guardduty_client",
                new=GuardDuty(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.guardduty.guardduty_eks_audit_log_enabled.guardduty_eks_audit_log_enabled import (
                guardduty_eks_audit_log_enabled,
            )

            check = guardduty_eks_audit_log_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"GuardDuty detector {detector_id} does not have EKS Audit Log Monitoring enabled."
            )
            assert result[0].resource_id == detector_id
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:guardduty:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:detector/{detector_id}"
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
