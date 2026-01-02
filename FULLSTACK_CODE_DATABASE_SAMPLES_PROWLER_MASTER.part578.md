---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 578
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 578 of 867)

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

---[FILE: iam_role_cross_service_confused_deputy_prevention_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_role_cross_service_confused_deputy_prevention/iam_role_cross_service_confused_deputy_prevention_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import Role
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_REGION = "us-east-1"
AWS_ACCOUNT_ID = "123456789012"


class Test_iam_role_cross_service_confused_deputy_prevention:
    @mock_aws
    def test_no_roles(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.account = AWS_ACCOUNT_ID
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention import (
                iam_role_cross_service_confused_deputy_prevention,
            )

            check = iam_role_cross_service_confused_deputy_prevention()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_only_aws_service_linked_roles(self):
        iam_client = mock.MagicMock
        iam_client.roles = []
        iam_client.roles.append(
            Role(
                name="AWSServiceRoleForAmazonGuardDuty",
                arn="arn:aws:iam::106908755756:role/aws-service-role/guardduty.amazonaws.com/AWSServiceRoleForAmazonGuardDuty",
                assume_role_policy={
                    "Version": "2008-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"Service": "ec2.amazonaws.com"},
                            "Action": "sts:AssumeRole",
                        }
                    ],
                },
                is_service_role=True,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.account = AWS_ACCOUNT_ID

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention.iam_client",
                new=iam_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention import (
                iam_role_cross_service_confused_deputy_prevention,
            )

            check = iam_role_cross_service_confused_deputy_prevention()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_iam_service_role_without_cross_service_confused_deputy_prevention(self):
        iam_client = client("iam", region_name=AWS_REGION)
        policy_document = {
            "Version": "2008-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "ec2.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                }
            ],
        }
        response = iam_client.create_role(
            RoleName="test",
            AssumeRolePolicyDocument=dumps(policy_document),
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.account = AWS_ACCOUNT_ID
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention import (
                iam_role_cross_service_confused_deputy_prevention,
            )

            check = iam_role_cross_service_confused_deputy_prevention()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM Service Role test does not prevent against a cross-service confused deputy attack."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]

    @mock_aws
    def test_iam_service_role_with_cross_service_confused_deputy_prevention(self):
        iam_client = client("iam", region_name=AWS_REGION)
        policy_document = {
            "Version": "2008-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "workspaces.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                    "Condition": {
                        "StringEquals": {"aws:SourceAccount": [AWS_ACCOUNT_ID]}
                    },
                }
            ],
        }
        response = iam_client.create_role(
            RoleName="test",
            AssumeRolePolicyDocument=dumps(policy_document),
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.account = AWS_ACCOUNT_ID
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention import (
                iam_role_cross_service_confused_deputy_prevention,
            )

            check = iam_role_cross_service_confused_deputy_prevention()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Service Role test prevents against a cross-service confused deputy attack."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]

    @mock_aws
    def test_iam_service_role_with_cross_service_confused_deputy_prevention_stringlike(
        self,
    ):
        iam_client = client("iam", region_name=AWS_REGION)
        policy_document = {
            "Version": "2008-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "workspaces.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                    "Condition": {
                        "StringLike": {"aws:SourceAccount": [AWS_ACCOUNT_ID]}
                    },
                }
            ],
        }
        response = iam_client.create_role(
            RoleName="test",
            AssumeRolePolicyDocument=dumps(policy_document),
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.account = AWS_ACCOUNT_ID
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention import (
                iam_role_cross_service_confused_deputy_prevention,
            )

            check = iam_role_cross_service_confused_deputy_prevention()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Service Role test prevents against a cross-service confused deputy attack."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]

    @mock_aws
    def test_iam_service_role_with_cross_service_confused_deputy_prevention_PrincipalAccount(
        self,
    ):
        iam_client = client("iam", region_name=AWS_REGION)
        policy_document = {
            "Version": "2008-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "workspaces.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                    "Condition": {
                        "StringLike": {"aws:PrincipalAccount": [AWS_ACCOUNT_ID]}
                    },
                }
            ],
        }
        response = iam_client.create_role(
            RoleName="test",
            AssumeRolePolicyDocument=dumps(policy_document),
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.account = AWS_ACCOUNT_ID
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention import (
                iam_role_cross_service_confused_deputy_prevention,
            )

            check = iam_role_cross_service_confused_deputy_prevention()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Service Role test prevents against a cross-service confused deputy attack."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]

    @mock_aws
    def test_iam_service_role_with_cross_service_confused_deputy_prevention_ResourceAccount(
        self,
    ):
        iam_client = client("iam", region_name=AWS_REGION)
        policy_document = {
            "Version": "2008-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"Service": "workspaces.amazonaws.com"},
                    "Action": "sts:AssumeRole",
                    "Condition": {
                        "StringLike": {"aws:ResourceAccount": [AWS_ACCOUNT_ID]}
                    },
                }
            ],
        }
        response = iam_client.create_role(
            RoleName="test",
            AssumeRolePolicyDocument=dumps(policy_document),
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.account = AWS_ACCOUNT_ID
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention import (
                iam_role_cross_service_confused_deputy_prevention,
            )

            check = iam_role_cross_service_confused_deputy_prevention()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Service Role test prevents against a cross-service confused deputy attack."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]

    @mock_aws
    def test_iam_service_role_with_cross_service_confused_deputy_prevention_service_list(
        self,
    ):
        iam_client = client("iam", region_name=AWS_REGION)
        policy_document = {
            "Version": "2008-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": ["scheduler.amazonaws.com", "events.amazonaws.com"]
                    },
                    "Action": "sts:AssumeRole",
                }
            ],
        }
        response = iam_client.create_role(
            RoleName="test",
            AssumeRolePolicyDocument=dumps(policy_document),
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        aws_provider.identity.account = AWS_ACCOUNT_ID
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_service_confused_deputy_prevention.iam_role_cross_service_confused_deputy_prevention import (
                iam_role_cross_service_confused_deputy_prevention,
            )

            check = iam_role_cross_service_confused_deputy_prevention()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM Service Role test does not prevent against a cross-service confused deputy attack."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
```

--------------------------------------------------------------------------------

---[FILE: iam_root_credentials_management_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_root_credentials_management_enabled/iam_root_credentials_management_enabled_test.py

```python
from unittest import mock

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_ARN,
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

# Original botocore _make_api_call function
orig = botocore.client.BaseClient._make_api_call


# Mocked botocore _make_api_call function
def mock_make_api_call_enabled(self, operation_name, kwarg):
    if operation_name == "ListOrganizationsFeatures":
        return {
            "OrganizationId": "o-test",
            "EnabledFeatures": ["RootSessions", "RootCredentialsManagement"],
        }
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


def mock_make_api_call_disabled(self, operation_name, kwarg):
    if operation_name == "ListOrganizationsFeatures":
        return {"OrganizationId": "o-test", "EnabledFeatures": []}
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


class Test_iam_root_credentials_management_enabled_test:
    @mock_aws
    def test_no_organization(self):
        from prowler.providers.aws.services.iam.iam_service import IAM
        from prowler.providers.aws.services.organizations.organizations_service import (
            Organizations,
        )

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], create_default_organization=False
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled.iam_client",
                    new=IAM(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled.organizations_client",
                    new=Organizations(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled import (
                    iam_root_credentials_management_enabled,
                )

                check = iam_root_credentials_management_enabled()
                result = check.execute()

                assert len(result) == 0

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_enabled
    )
    @mock_aws
    def test__root_credentials_management_enabled(self):
        from prowler.providers.aws.services.iam.iam_service import IAM
        from prowler.providers.aws.services.organizations.organizations_service import (
            Organizations,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled.iam_client",
                    new=IAM(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled.organizations_client",
                    new=Organizations(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled import (
                    iam_root_credentials_management_enabled,
                )

                check = iam_root_credentials_management_enabled()
                result = check.execute()

                assert len(result) == 1

                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Root credentials management is enabled."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert result[0].resource_arn == AWS_ACCOUNT_ARN
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource == {}

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_disabled
    )
    @mock_aws
    def test__root_credentials_management_disabled(self):
        from prowler.providers.aws.services.iam.iam_service import IAM
        from prowler.providers.aws.services.organizations.organizations_service import (
            Organizations,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled.iam_client",
                    new=IAM(aws_provider),
                ),
                mock.patch(
                    "prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled.organizations_client",
                    new=Organizations(aws_provider),
                ),
            ):
                from prowler.providers.aws.services.iam.iam_root_credentials_management_enabled.iam_root_credentials_management_enabled import (
                    iam_root_credentials_management_enabled,
                )

                check = iam_root_credentials_management_enabled()
                result = check.execute()

                assert len(result) == 1

                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Root credentials management is not enabled."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert result[0].resource_arn == AWS_ACCOUNT_ARN
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource == {}
```

--------------------------------------------------------------------------------

---[FILE: iam_root_hardware_mfa_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_root_hardware_mfa_enabled/iam_root_hardware_mfa_enabled_test.py

```python
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_root_hardware_mfa_enabled_test:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_root_virtual_mfa_enabled(self):
        iam_client = client("iam")
        user = "test-user"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled import (
                iam_root_hardware_mfa_enabled,
            )

            # Set up virtual MFA device for root
            service_client.virtual_mfa_devices = [
                {
                    "SerialNumber": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:mfa/mfa",
                    "User": {"Arn": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"},
                }
            ]
            service_client.account_summary = {
                "SummaryMap": {"AccountMFAEnabled": 1},
            }

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

            check = iam_root_hardware_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Root account has a virtual MFA instead of a hardware MFA device enabled."
            )
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:mfa"

    @mock_aws
    def test_root_hardware_mfa_enabled(self):
        iam_client = client("iam")
        user = "test-user"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled import (
                iam_root_hardware_mfa_enabled,
            )

            # No virtual MFA devices (indicating hardware MFA)
            service_client.virtual_mfa_devices = []
            service_client.account_summary = {
                "SummaryMap": {"AccountMFAEnabled": 1},
            }

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

            check = iam_root_hardware_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Root account has a hardware MFA device enabled."
            )
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:mfa"

    @mock_aws
    def test_root_hardware_mfa_enabled_none_summary(self):
        iam_client = client("iam")
        user = "test-user"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled import (
                iam_root_hardware_mfa_enabled,
            )

            # No account summary
            service_client.account_summary = None
            service_client.virtual_mfa_devices = []

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

            check = iam_root_hardware_mfa_enabled()
            result = check.execute()
            assert len(result) == 0

    @mock_aws
    def test_root_no_credentials(self):
        iam_client = client("iam")
        user = "test-user"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled import (
                iam_root_hardware_mfa_enabled,
            )

            service_client.account_summary = {
                "SummaryMap": {"AccountMFAEnabled": 1},
            }
            service_client.virtual_mfa_devices = []

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["password_enabled"] = "false"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

            check = iam_root_hardware_mfa_enabled()
            result = check.execute()
            # Should return no findings since root has no credentials
            assert len(result) == 0

    @mock_aws
    def test_root_hardware_mfa_with_organizational_management_enabled(self):
        iam_client = client("iam")
        user = "test-user"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled import (
                iam_root_hardware_mfa_enabled,
            )

            # Set up organizational root management
            service_client.organization_features = ["RootCredentialsManagement"]
            service_client.account_summary = {
                "SummaryMap": {"AccountMFAEnabled": 1},
            }
            service_client.virtual_mfa_devices = []

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "true"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

            check = iam_root_hardware_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "Root account has credentials with hardware MFA enabled. "
                "Consider removing individual root credentials since organizational "
                "root management is active.",
                result[0].status_extended,
            )
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:mfa"

    @mock_aws
    def test_root_virtual_mfa_with_organizational_management_enabled(self):
        iam_client = client("iam")
        user = "test-user"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled import (
                iam_root_hardware_mfa_enabled,
            )

            # Set up organizational root management
            service_client.organization_features = ["RootCredentialsManagement"]
            service_client.account_summary = {
                "SummaryMap": {"AccountMFAEnabled": 1},
            }
            service_client.virtual_mfa_devices = [
                {
                    "SerialNumber": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:mfa/mfa",
                    "User": {"Arn": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"},
                }
            ]

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "true"
            service_client.credential_report[0][
                "arn"
            ] = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

            check = iam_root_hardware_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "Root account has credentials with virtual MFA instead of hardware MFA "
                "despite organizational root management being enabled.",
                result[0].status_extended,
            )
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:mfa"

    @mock_aws
    def test_root_no_mfa_with_organizational_management_enabled(self):
        iam_client = client("iam")
        user = "test-user"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_hardware_mfa_enabled.iam_root_hardware_mfa_enabled import (
                iam_root_hardware_mfa_enabled,
            )

            # Set up organizational root management
            service_client.organization_features = ["RootCredentialsManagement"]
            service_client.account_summary = {
                "SummaryMap": {"AccountMFAEnabled": 0},
            }
            service_client.virtual_mfa_devices = []

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"

            check = iam_root_hardware_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "Root account has credentials without MFA "
                "despite organizational root management being enabled.",
                result[0].status_extended,
            )
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:mfa"
```

--------------------------------------------------------------------------------

````
