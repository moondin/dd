---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 568
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 568 of 867)

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

---[FILE: iam_administrator_access_with_mfa_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_administrator_access_with_mfa/iam_administrator_access_with_mfa_test.py

```python
from json import dumps
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_administrator_access_with_mfa_test:
    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_group_with_no_policies(self):
        iam = client("iam")
        group_name = "test-group"

        arn = iam.create_group(GroupName=group_name)["Group"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa import (
                    iam_administrator_access_with_mfa,
                )

                check = iam_administrator_access_with_mfa()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == group_name
                assert result[0].resource_arn == arn
                assert search(
                    f"Group {group_name} has no policies.", result[0].status_extended
                )

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_group_non_administrative_policy(self):
        iam = client("iam")
        group_name = "test-group"
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:CreateLogGroup", "Resource": "*"},
            ],
        }
        policy_arn = iam.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]
        arn = iam.create_group(GroupName=group_name)["Group"]["Arn"]
        iam.attach_group_policy(GroupName=group_name, PolicyArn=policy_arn)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa import (
                    iam_administrator_access_with_mfa,
                )

                check = iam_administrator_access_with_mfa()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == group_name
                assert result[0].resource_arn == arn
                assert search(
                    f"Group {group_name} provides non-administrative access.",
                    result[0].status_extended,
                )

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_admin_policy_no_users(self):
        iam = client("iam")
        group_name = "test-group"

        arn = iam.create_group(GroupName=group_name)["Group"]["Arn"]
        iam.attach_group_policy(
            GroupName=group_name,
            PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess",
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa import (
                    iam_administrator_access_with_mfa,
                )

                check = iam_administrator_access_with_mfa()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == group_name
                assert result[0].resource_arn == arn
                assert search(
                    f"Group {group_name} provides administrative access but does not have users.",
                    result[0].status_extended,
                )

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_admin_policy_with_user_without_mfa(self):
        iam = client("iam")
        group_name = "test-group"
        user_name = "user-test"
        iam.create_user(UserName=user_name)
        arn = iam.create_group(GroupName=group_name)["Group"]["Arn"]
        iam.attach_group_policy(
            GroupName=group_name,
            PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess",
        )
        iam.add_user_to_group(GroupName=group_name, UserName=user_name)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa import (
                    iam_administrator_access_with_mfa,
                )

                check = iam_administrator_access_with_mfa()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].resource_id == group_name
                assert result[0].resource_arn == arn
                assert search(
                    f"Group {group_name} provides administrator access to User {user_name} with MFA disabled.",
                    result[0].status_extended,
                )

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_various_policies_with_users_with_and_without_mfa(self):
        iam = client("iam")
        group_name = "test-group"
        user_name_no_mfa = "user-no-mfa"
        user_name_mfa = "user-mfa"
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:CreateLogGroup", "Resource": "*"},
            ],
        }
        mfa_device_name = "mfa-test"
        mfa_serial_number = iam.create_virtual_mfa_device(
            VirtualMFADeviceName=mfa_device_name
        )["VirtualMFADevice"]["SerialNumber"]
        iam.create_user(UserName=user_name_no_mfa)
        iam.create_user(UserName=user_name_mfa)
        iam.enable_mfa_device(
            UserName=user_name_mfa,
            SerialNumber=mfa_serial_number,
            AuthenticationCode1="123456",
            AuthenticationCode2="123466",
        )
        policy_arn = iam.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]
        arn_group = iam.create_group(GroupName=group_name)["Group"]["Arn"]
        iam.attach_group_policy(GroupName=group_name, PolicyArn=policy_arn)
        iam.attach_group_policy(
            GroupName=group_name,
            PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess",
        )
        iam.add_user_to_group(GroupName=group_name, UserName=user_name_no_mfa)
        iam.add_user_to_group(GroupName=group_name, UserName=user_name_mfa)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_administrator_access_with_mfa.iam_administrator_access_with_mfa import (
                    iam_administrator_access_with_mfa,
                )

                check = iam_administrator_access_with_mfa()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].resource_id == group_name
                assert result[0].resource_arn == arn_group
                assert search(
                    f"Group {group_name} provides administrator access to User {user_name_no_mfa} with MFA disabled.",
                    result[0].status_extended,
                )
```

--------------------------------------------------------------------------------

---[FILE: iam_avoid_root_usage_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_avoid_root_usage/iam_avoid_root_usage_test.py

```python
import datetime
from csv import DictReader
from re import search
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_avoid_root_usage:
    @mock_aws
    def test_root_not_used(self):
        raw_credential_report = r"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
<root_account>,arn:aws:iam::123456789012:<root_account>,2022-04-17T14:59:38Z,true,no_information,not_supported,not_supported,false,true,N/A,N/A,N/A,N/A,false,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage import (
                    iam_avoid_root_usage,
                )

                service_client.credential_report = credential_list
                check = iam_avoid_root_usage()
                result = check.execute()
                assert result[0].status == "PASS"
                assert search(
                    "Root user in the account wasn't accessed in the last",
                    result[0].status_extended,
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn == "arn:aws:iam::123456789012:<root_account>"
                )

    @mock_aws
    def test_root_password_recently_used(self):
        password_last_used = (datetime.datetime.now()).strftime("%Y-%m-%dT%H:%M:%SZ")
        raw_credential_report = rf"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
<root_account>,arn:aws:iam::123456789012:<root_account>,2022-04-17T14:59:38Z,true,{password_last_used},not_supported,not_supported,false,true,N/A,N/A,N/A,N/A,false,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage import (
                    iam_avoid_root_usage,
                )

                service_client.credential_report = credential_list
                check = iam_avoid_root_usage()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert search(
                    "Root user in the account was last accessed",
                    result[0].status_extended,
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn == "arn:aws:iam::123456789012:<root_account>"
                )

    @mock_aws
    def test_root_access_key_1_recently_used(self):
        access_key_1_last_used = (datetime.datetime.now()).strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        raw_credential_report = rf"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
<root_account>,arn:aws:iam::123456789012:<root_account>,2022-04-17T14:59:38Z,true,no_information,not_supported,not_supported,false,true,N/A,{access_key_1_last_used},N/A,N/A,false,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage import (
                    iam_avoid_root_usage,
                )

                service_client.credential_report = credential_list
                check = iam_avoid_root_usage()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert search(
                    "Root user in the account was last accessed",
                    result[0].status_extended,
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn == "arn:aws:iam::123456789012:<root_account>"
                )

    @mock_aws
    def test_root_access_key_2_recently_used(self):
        access_key_2_last_used = (datetime.datetime.now()).strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        raw_credential_report = rf"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
<root_account>,arn:aws:iam::123456789012:<root_account>,2022-04-17T14:59:38Z,true,no_information,not_supported,not_supported,false,true,N/A,N/A,N/A,N/A,false,N/A,{access_key_2_last_used},N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage import (
                    iam_avoid_root_usage,
                )

                service_client.credential_report = credential_list
                check = iam_avoid_root_usage()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert search(
                    "Root user in the account was last accessed",
                    result[0].status_extended,
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn == "arn:aws:iam::123456789012:<root_account>"
                )

    @mock_aws
    def test_root_password_used(self):
        password_last_used = (
            datetime.datetime.now() - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%SZ")
        raw_credential_report = rf"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
<root_account>,arn:aws:iam::123456789012:<root_account>,2022-04-17T14:59:38Z,true,{password_last_used},not_supported,not_supported,false,true,N/A,N/A,N/A,N/A,false,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage import (
                    iam_avoid_root_usage,
                )

                service_client.credential_report = credential_list
                check = iam_avoid_root_usage()
                result = check.execute()
                assert result[0].status == "PASS"
                assert search(
                    "Root user in the account wasn't accessed in the last 1 days",
                    result[0].status_extended,
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn == "arn:aws:iam::123456789012:<root_account>"
                )

    @mock_aws
    def test_root_access_key_1_used(self):
        access_key_1_last_used = (
            datetime.datetime.now() - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%SZ")
        raw_credential_report = rf"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
<root_account>,arn:aws:iam::123456789012:<root_account>,2022-04-17T14:59:38Z,true,no_information,not_supported,not_supported,false,true,N/A,{access_key_1_last_used},N/A,N/A,false,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage import (
                    iam_avoid_root_usage,
                )

                service_client.credential_report = credential_list
                check = iam_avoid_root_usage()
                result = check.execute()
                assert result[0].status == "PASS"
                assert search(
                    "Root user in the account wasn't accessed in the last 1 days",
                    result[0].status_extended,
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn == "arn:aws:iam::123456789012:<root_account>"
                )

    @mock_aws
    def test_root_access_key_2_used(self):
        access_key_2_last_used = (
            datetime.datetime.now() - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%SZ")
        raw_credential_report = rf"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
<root_account>,arn:aws:iam::123456789012:<root_account>,2022-04-17T14:59:38Z,true,no_information,not_supported,not_supported,false,true,N/A,N/A,N/A,N/A,false,N/A,{access_key_2_last_used},N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_avoid_root_usage.iam_avoid_root_usage import (
                    iam_avoid_root_usage,
                )

                service_client.credential_report = credential_list
                check = iam_avoid_root_usage()
                result = check.execute()
                assert result[0].status == "PASS"
                assert search(
                    "Root user in the account wasn't accessed in the last 1 days",
                    result[0].status_extended,
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn == "arn:aws:iam::123456789012:<root_account>"
                )
```

--------------------------------------------------------------------------------

---[FILE: iam_aws_attached_policy_no_administrative_privileges_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_aws_attached_policy_no_administrative_privileges/iam_aws_attached_policy_no_administrative_privileges_test.py

```python
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_aws_attached_policy_no_administrative_privileges_test:
    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_policy_with_administrative_privileges(self):
        iam_client = client("iam")

        iam_client.create_role(
            RoleName="my-role", AssumeRolePolicyDocument="{}", Path="/my-path/"
        )
        iam_client.attach_role_policy(
            PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess", RoleName="my-role"
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_aws_attached_policy_no_administrative_privileges.iam_aws_attached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_aws_attached_policy_no_administrative_privileges.iam_aws_attached_policy_no_administrative_privileges import (
                iam_aws_attached_policy_no_administrative_privileges,
            )

            check = iam_aws_attached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1, f"Expected 1 result, but got {len(results)}"
            for result in results:
                if result.resource_id == "AdministratorAccess":
                    assert result.status == "FAIL"
                    assert (
                        result.resource_arn
                        == "arn:aws:iam::aws:policy/AdministratorAccess"
                    )
                    assert search(
                        "AWS policy AdministratorAccess is attached and allows ",
                        result.status_extended,
                    )

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_policy_non_administrative(self):
        iam_client = client("iam")

        iam_client.create_role(
            RoleName="my-role", AssumeRolePolicyDocument="{}", Path="/my-path/"
        )
        iam_client.attach_role_policy(
            PolicyArn="arn:aws:iam::aws:policy/IAMUserChangePassword",
            RoleName="my-role",
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_aws_attached_policy_no_administrative_privileges.iam_aws_attached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_aws_attached_policy_no_administrative_privileges.iam_aws_attached_policy_no_administrative_privileges import (
                iam_aws_attached_policy_no_administrative_privileges,
            )

            check = iam_aws_attached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1, f"Expected 1 result, but got {len(results)}"
            for result in results:
                if result.resource_id == "IAMUserChangePassword":
                    assert result.status == "PASS"
                    assert (
                        result.resource_arn
                        == "arn:aws:iam::aws:policy/IAMUserChangePassword"
                    )
                    assert search(
                        "AWS policy IAMUserChangePassword is attached but does not allow",
                        result.status_extended,
                    )

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_policy_administrative_and_non_administrative(self):
        iam_client = client("iam")

        iam_client.create_role(
            RoleName="my-role", AssumeRolePolicyDocument="{}", Path="/my-path/"
        )
        iam_client.attach_role_policy(
            PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess", RoleName="my-role"
        )
        iam_client.attach_role_policy(
            PolicyArn="arn:aws:iam::aws:policy/IAMUserChangePassword",
            RoleName="my-role",
        )
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_aws_attached_policy_no_administrative_privileges.iam_aws_attached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_aws_attached_policy_no_administrative_privileges.iam_aws_attached_policy_no_administrative_privileges import (
                iam_aws_attached_policy_no_administrative_privileges,
            )

            check = iam_aws_attached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 2, f"Expected 2 results, but got {len(results)}"
            for result in results:
                if result.resource_id == "IAMUserChangePassword":
                    assert result.status == "PASS"
                    assert (
                        result.resource_arn
                        == "arn:aws:iam::aws:policy/IAMUserChangePassword"
                    )
                    assert search(
                        "AWS policy IAMUserChangePassword is attached but does not allow ",
                        result.status_extended,
                    )
                    assert result.resource_id == "IAMUserChangePassword"
                if result.resource_id == "AdministratorAccess":
                    assert result.status == "FAIL"
                    assert (
                        result.resource_arn
                        == "arn:aws:iam::aws:policy/AdministratorAccess"
                    )
                    assert search(
                        "AWS policy AdministratorAccess is attached and allows ",
                        result.status_extended,
                    )
                    assert result.resource_id == "AdministratorAccess"
```

--------------------------------------------------------------------------------

---[FILE: iam_check_saml_providers_sts_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_check_saml_providers_sts/iam_check_saml_providers_sts_test.py

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

orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListSAMLProviderTags":
        return {
            "Tags": [
                {"Key": "Name", "Value": "test"},
                {"Key": "Owner", "Value": "test"},
            ]
        }
    return orig(self, operation_name, kwarg)


class Test_iam_check_saml_providers_sts:
    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_iam_check_saml_providers_sts(self):
        iam_client = client("iam")
        xml_template = r"""<EntityDescriptor
    xmlns="urn:oasis:names:tc:SAML:2.0:metadata"
    entityID="loadbalancer-9.siroe.com">
    <SPSSODescriptor
        AuthnRequestsSigned="false"
        WantAssertionsSigned="false"
        protocolSupportEnumeration=
            "urn:oasis:names:tc:SAML:2.0:protocol">
        <KeyDescriptor use="signing">
            <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
                <X509Data>
                    <X509Certificate>
MIICYDCCAgqgAwIBAgICBoowDQYJKoZIhvcNAQEEBQAwgZIxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
EwpDYWxpZm9ybmlhMRQwEgYDVQQHEwtTYW50YSBDbGFyYTEeMBwGA1UEChMVU3VuIE1pY3Jvc3lz
dGVtcyBJbmMuMRowGAYDVQQLExFJZGVudGl0eSBTZXJ2aWNlczEcMBoGA1UEAxMTQ2VydGlmaWNh
dGUgTWFuYWdlcjAeFw0wNjExMDIxOTExMzRaFw0xMDA3MjkxOTExMzRaMDcxEjAQBgNVBAoTCXNp
cm9lLmNvbTEhMB8GA1UEAxMYbG9hZGJhbGFuY2VyLTkuc2lyb2UuY29tMIGfMA0GCSqGSIb3DQEB
AQUAA4GNADCBiQKBgQCjOwa5qoaUuVnknqf5pdgAJSEoWlvx/jnUYbkSDpXLzraEiy2UhvwpoBgB
EeTSUaPPBvboCItchakPI6Z/aFdH3Wmjuij9XD8r1C+q//7sUO0IGn0ORycddHhoo0aSdnnxGf9V
tREaqKm9dJ7Yn7kQHjo2eryMgYxtr/Z5Il5F+wIDAQABo2AwXjARBglghkgBhvhCAQEEBAMCBkAw
DgYDVR0PAQH/BAQDAgTwMB8GA1UdIwQYMBaAFDugITflTCfsWyNLTXDl7cMDUKuuMBgGA1UdEQQR
MA+BDW1hbGxhQHN1bi5jb20wDQYJKoZIhvcNAQEEBQADQQB/6DOB6sRqCZu2OenM9eQR0gube85e
nTTxU4a7x1naFxzYXK1iQ1vMARKMjDb19QEJIEJKZlDK4uS7yMlf1nFS
                    </X509Certificate>
                </X509Data>
            </KeyInfo>
        </KeyDescriptor>
</EntityDescriptor>"""
        saml_provider_name = "test"
        iam_client.create_saml_provider(
            SAMLMetadataDocument=xml_template, Name=saml_provider_name
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_check_saml_providers_sts.iam_check_saml_providers_sts.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_check_saml_providers_sts.iam_check_saml_providers_sts import (
                    iam_check_saml_providers_sts,
                )

                check = iam_check_saml_providers_sts()
                result = check.execute()
                assert result[0].status == "PASS"
                assert result[0].resource_id == saml_provider_name
                assert (
                    result[0].resource_arn
                    == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:saml-provider/{saml_provider_name}"
                )
                assert result[0].resource_tags == [
                    {"Key": "Name", "Value": "test"},
                    {"Key": "Owner", "Value": "test"},
                ]
                assert result[0].region == AWS_REGION_US_EAST_1
                assert (
                    result[0].status_extended
                    == f"SAML Provider {saml_provider_name} has been found."
                )

    @mock_aws
    def test_iam_check_saml_providers_sts_no_saml_providers(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_check_saml_providers_sts.iam_check_saml_providers_sts.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_check_saml_providers_sts.iam_check_saml_providers_sts import (
                    iam_check_saml_providers_sts,
                )

                check = iam_check_saml_providers_sts()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert result[0].resource_id == "123456789012"
                assert result[0].resource_arn == "arn:aws:iam::123456789012:root"
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].status_extended == "No SAML Providers found."

    @mock_aws
    def test_iam_check_saml_providers_sts_none_saml_providers(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_check_saml_providers_sts.iam_check_saml_providers_sts.iam_client",
                new=IAM(aws_provider),
            ) as iam_client:
                # Test Check
                from prowler.providers.aws.services.iam.iam_check_saml_providers_sts.iam_check_saml_providers_sts import (
                    iam_check_saml_providers_sts,
                )

                iam_client.saml_providers = None

                check = iam_check_saml_providers_sts()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

````
