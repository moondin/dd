---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 581
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 581 of 867)

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

---[FILE: iam_user_no_setup_initial_access_key_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_user_no_setup_initial_access_key/iam_user_no_setup_initial_access_key_test.py

```python
from csv import DictReader
from re import search
from unittest import mock

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_user_no_setup_initial_access_key_test:
    def test_setup_access_key_1_fail(self):
        raw_credential_report = r"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
test_false_access_key_1,arn:aws:iam::123456789012:test_false_access_key_1,2022-04-17T14:59:38+00:00,true,no_information,not_supported,not_supported,false,true,N/A,N/A,N/A,N/A,false,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_no_setup_initial_access_key.iam_user_no_setup_initial_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_no_setup_initial_access_key.iam_user_no_setup_initial_access_key import (
                iam_user_no_setup_initial_access_key,
            )

            service_client.credential_report = credential_list
            service_client.users = [
                mock.MagicMock(
                    name="test_false_access_key_1",
                    arn="arn:aws:iam::123456789012:test_false_access_key_1",
                    tags=[{"Key": "Name", "Value": "test_false_access_key_1"}],
                )
            ]

            check = iam_user_no_setup_initial_access_key()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert search("has never used access key 1", result[0].status_extended)
            assert result[0].resource_id == "test_false_access_key_1"
            assert (
                result[0].resource_arn
                == "arn:aws:iam::123456789012:test_false_access_key_1"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "test_false_access_key_1"}
            ]

    def test_setup_access_key_2_fail(self):
        raw_credential_report = r"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
test_false_access_key_2,arn:aws:iam::123456789012:test_false_access_key_2,2022-04-17T14:59:38+00:00,true,no_information,not_supported,not_supported,false,false,N/A,N/A,N/A,N/A,true,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_no_setup_initial_access_key.iam_user_no_setup_initial_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_no_setup_initial_access_key.iam_user_no_setup_initial_access_key import (
                iam_user_no_setup_initial_access_key,
            )

            service_client.credential_report = credential_list
            service_client.users = [
                mock.MagicMock(
                    name="test_false_access_key_2",
                    arn="arn:aws:iam::123456789012:test_false_access_key_2",
                    tags=[{"Key": "Name", "Value": "test_false_access_key_2"}],
                )
            ]

            check = iam_user_no_setup_initial_access_key()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert search("has never used access key 2", result[0].status_extended)
            assert result[0].resource_id == "test_false_access_key_2"
            assert (
                result[0].resource_arn
                == "arn:aws:iam::123456789012:test_false_access_key_2"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "test_false_access_key_2"}
            ]

    def test_setup_both_access_keys_fail(self):
        raw_credential_report = r"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
test_false_both_access_keys,arn:aws:iam::123456789012:test_false_both_access_keys,2022-04-17T14:59:38+00:00,true,no_information,not_supported,not_supported,false,true,N/A,N/A,N/A,N/A,true,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_no_setup_initial_access_key.iam_user_no_setup_initial_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_no_setup_initial_access_key.iam_user_no_setup_initial_access_key import (
                iam_user_no_setup_initial_access_key,
            )

            service_client.credential_report = credential_list
            service_client.users = [
                mock.MagicMock(
                    name="test_false_both_access_keys",
                    arn="arn:aws:iam::123456789012:test_false_both_access_keys",
                    tags=[{"Key": "Name", "Value": "test_false_both_access_keys"}],
                )
            ]

            check = iam_user_no_setup_initial_access_key()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert search("has never used access key 1", result[0].status_extended)
            assert result[0].resource_id == "test_false_both_access_keys"
            assert (
                result[0].resource_arn
                == "arn:aws:iam::123456789012:test_false_both_access_keys"
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [
                {"Key": "Name", "Value": "test_false_both_access_keys"}
            ]
            assert result[1].status == "FAIL"
            assert search("has never used access key 2", result[1].status_extended)
            assert result[1].resource_id == "test_false_both_access_keys"
            assert (
                result[1].resource_arn
                == "arn:aws:iam::123456789012:test_false_both_access_keys"
            )
            assert result[1].region == AWS_REGION_US_EAST_1
            assert result[1].resource_tags == [
                {"Key": "Name", "Value": "test_false_both_access_keys"}
            ]

    def test_setup_access_key_pass(self):
        raw_credential_report = r"""user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated
test_pass,arn:aws:iam::123456789012:test_pass,2022-02-17T14:59:38+00:00,not_supported,no_information,not_supported,not_supported,false,false,N/A,N/A,N/A,N/A,false,N/A,N/A,N/A,N/A,false,N/A,false,N/A"""
        credential_lines = raw_credential_report.split("\n")
        csv_reader = DictReader(credential_lines, delimiter=",")
        credential_list = list(csv_reader)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_no_setup_initial_access_key.iam_user_no_setup_initial_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_no_setup_initial_access_key.iam_user_no_setup_initial_access_key import (
                iam_user_no_setup_initial_access_key,
            )

            service_client.credential_report = credential_list
            service_client.users = [
                mock.MagicMock(
                    name="test_pass",
                    arn="arn:aws:iam::123456789012:test_pass",
                    tags=[{"Key": "Name", "Value": "test_pass"}],
                )
            ]

            check = iam_user_no_setup_initial_access_key()
            result = check.execute()
            assert result[0].status == "PASS"
            assert search(
                "does not have access keys or uses the access keys configured",
                result[0].status_extended,
            )
            assert result[0].resource_id == "test_pass"
            assert result[0].resource_arn == "arn:aws:iam::123456789012:test_pass"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test_pass"}]
```

--------------------------------------------------------------------------------

---[FILE: iam_user_two_active_access_key_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_user_two_active_access_key/iam_user_two_active_access_key_test.py

```python
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_ACCOUNT_NUMBER = "123456789012"


class Test_iam_user_two_active_access_key:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_iam_user_two_active_access_key(self):
        # Create IAM Mocked Resources
        iam_client = client("iam")
        user = "test1"
        user_arn = iam_client.create_user(UserName=user)["User"]["Arn"]
        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": user}])
        # Create Access Key 1
        iam_client.create_access_key(UserName=user)
        # Create Access Key 2
        iam_client.create_access_key(UserName=user)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_two_active_access_key.iam_user_two_active_access_key.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_user_two_active_access_key.iam_user_two_active_access_key import (
                iam_user_two_active_access_key,
            )

            check = iam_user_two_active_access_key()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == user
            assert result[0].resource_arn == user_arn
            assert search(
                f"User {user} has 2 active access keys.", result[0].status_extended
            )
            assert result[0].resource_tags == [{"Key": "Name", "Value": user}]

    @mock_aws
    def test_iam_user_one_active_access_key(self):
        # Create IAM User
        iam_client = client("iam")
        user = "test1"
        user_arn = iam_client.create_user(UserName=user)["User"]["Arn"]
        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": user}])
        # Create Access Key 1
        iam_client.create_access_key(UserName=user)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_two_active_access_key.iam_user_two_active_access_key.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_user_two_active_access_key.iam_user_two_active_access_key import (
                iam_user_two_active_access_key,
            )

            check = iam_user_two_active_access_key()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == user
            assert result[0].resource_arn == user_arn
            assert search(
                f"User {user} does not have 2 active access keys.",
                result[0].status_extended,
            )
            assert result[0].resource_tags == [{"Key": "Name", "Value": user}]

    @mock_aws
    def test_iam_user_without_active_access_key(self):
        # Create IAM User
        iam_client = client("iam")
        user = "test1"
        user_arn = iam_client.create_user(UserName=user)["User"]["Arn"]
        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": user}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_two_active_access_key.iam_user_two_active_access_key.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_user_two_active_access_key.iam_user_two_active_access_key import (
                iam_user_two_active_access_key,
            )

            check = iam_user_two_active_access_key()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == user
            assert result[0].resource_arn == user_arn
            assert search(
                f"User {user} does not have 2 active access keys.",
                result[0].status_extended,
            )
            assert result[0].resource_tags == [{"Key": "Name", "Value": user}]

    @mock_aws
    def test_iam_no_users(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_two_active_access_key.iam_user_two_active_access_key.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_user_two_active_access_key.iam_user_two_active_access_key import (
                iam_user_two_active_access_key,
            )

            check = iam_user_two_active_access_key()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_user_with_temporary_credentials_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_user_with_temporary_credentials/iam_user_with_temporary_credentials_test.py

```python
from unittest import mock

from prowler.providers.aws.services.iam.iam_service import IAM
from tests.providers.aws.utils import AWS_ACCOUNT_NUMBER, AWS_REGION_US_EAST_1

IAM_USER_NAME = "test-user"
IAM_USER_ARN = f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/{IAM_USER_NAME}"
USER_DATA = (IAM_USER_NAME, IAM_USER_ARN)


class Test_iam_user_with_temporary_credentials:
    def test_no_users(self):
        iam_client = mock.MagicMock
        iam_client.region = AWS_REGION_US_EAST_1

        iam_client.access_keys_metadata = {}
        iam_client.last_accessed_services = {}

        iam_client.users = [
            mock.MagicMock(
                arn=IAM_USER_ARN,
                tags=[{"Key": "Name", "Value": IAM_USER_NAME}],
            )
        ]

        # Generate temporary credentials usage
        iam_client.user_temporary_credentials_usage = {}
        iam_client._get_user_temporary_credentials_usage = (
            IAM._get_user_temporary_credentials_usage
        )
        iam_client._get_user_temporary_credentials_usage(iam_client)

        with (
            mock.patch(
                "prowler.providers.aws.services.iam.iam_service.IAM",
                new=iam_client,
            ) as iam_service,
            mock.patch(
                "prowler.providers.aws.services.iam.iam_client.iam_client",
                new=iam_service,
            ),
        ):
            from prowler.providers.aws.services.iam.iam_user_with_temporary_credentials.iam_user_with_temporary_credentials import (
                iam_user_with_temporary_credentials,
            )

            check = iam_user_with_temporary_credentials()
            result = check.execute()
            assert len(result) == 0

    def test_user_no_access_keys_no_accesed_services(self):
        iam_client = mock.MagicMock
        iam_client.region = AWS_REGION_US_EAST_1

        iam_client.access_keys_metadata = {USER_DATA: []}
        iam_client.last_accessed_services = {USER_DATA: []}

        iam_client.users = [
            mock.MagicMock(
                arn=IAM_USER_ARN,
                tags=[{"Key": "Name", "Value": IAM_USER_NAME}],
            )
        ]

        # Generate temporary credentials usage
        iam_client.user_temporary_credentials_usage = {}
        iam_client._get_user_temporary_credentials_usage = (
            IAM._get_user_temporary_credentials_usage
        )
        iam_client._get_user_temporary_credentials_usage(iam_client)

        with (
            mock.patch(
                "prowler.providers.aws.services.iam.iam_service.IAM",
                new=iam_client,
            ) as iam_service,
            mock.patch(
                "prowler.providers.aws.services.iam.iam_client.iam_client",
                new=iam_service,
            ),
        ):
            from prowler.providers.aws.services.iam.iam_user_with_temporary_credentials.iam_user_with_temporary_credentials import (
                iam_user_with_temporary_credentials,
            )

            check = iam_user_with_temporary_credentials()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User {IAM_USER_NAME} doesn't have long lived credentials with access to other services than IAM or STS."
            )
            assert result[0].resource_id == IAM_USER_NAME
            assert result[0].resource_arn == IAM_USER_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": IAM_USER_NAME}]

    def test_user_access_keys_no_accesed_services(self):
        iam_client = mock.MagicMock
        iam_client.region = AWS_REGION_US_EAST_1

        iam_client.access_keys_metadata = {USER_DATA: [{"AccessKeyId": 1}]}
        iam_client.last_accessed_services = {USER_DATA: []}

        iam_client.users = [
            mock.MagicMock(
                arn=IAM_USER_ARN,
                tags=[{"Key": "Name", "Value": IAM_USER_NAME}],
            )
        ]

        # Generate temporary credentials usage
        iam_client.user_temporary_credentials_usage = {}
        iam_client._get_user_temporary_credentials_usage = (
            IAM._get_user_temporary_credentials_usage
        )
        iam_client._get_user_temporary_credentials_usage(iam_client)

        with (
            mock.patch(
                "prowler.providers.aws.services.iam.iam_service.IAM",
                new=iam_client,
            ) as iam_service,
            mock.patch(
                "prowler.providers.aws.services.iam.iam_client.iam_client",
                new=iam_service,
            ),
        ):
            from prowler.providers.aws.services.iam.iam_user_with_temporary_credentials.iam_user_with_temporary_credentials import (
                iam_user_with_temporary_credentials,
            )

            check = iam_user_with_temporary_credentials()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User {IAM_USER_NAME} doesn't have long lived credentials with access to other services than IAM or STS."
            )
            assert result[0].resource_id == IAM_USER_NAME
            assert result[0].resource_arn == IAM_USER_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": IAM_USER_NAME}]

    def test_user_access_keys_accesed_services_sts(self):
        iam_client = mock.MagicMock
        iam_client.region = AWS_REGION_US_EAST_1

        iam_client.access_keys_metadata = {USER_DATA: [{"AccessKeyId": 1}]}
        iam_client.last_accessed_services = {USER_DATA: [{"ServiceNamespace": "sts"}]}

        iam_client.users = [
            mock.MagicMock(
                arn=IAM_USER_ARN,
                tags=[{"Key": "Name", "Value": IAM_USER_NAME}],
            )
        ]

        # Generate temporary credentials usage
        iam_client.user_temporary_credentials_usage = {}
        iam_client._get_user_temporary_credentials_usage = (
            IAM._get_user_temporary_credentials_usage
        )
        iam_client._get_user_temporary_credentials_usage(iam_client)

        with (
            mock.patch(
                "prowler.providers.aws.services.iam.iam_service.IAM",
                new=iam_client,
            ) as iam_service,
            mock.patch(
                "prowler.providers.aws.services.iam.iam_client.iam_client",
                new=iam_service,
            ),
        ):
            from prowler.providers.aws.services.iam.iam_user_with_temporary_credentials.iam_user_with_temporary_credentials import (
                iam_user_with_temporary_credentials,
            )

            check = iam_user_with_temporary_credentials()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User {IAM_USER_NAME} doesn't have long lived credentials with access to other services than IAM or STS."
            )
            assert result[0].resource_id == IAM_USER_NAME
            assert result[0].resource_arn == IAM_USER_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": IAM_USER_NAME}]

    def test_access_keys_with_iam_and_sts(self):
        iam_client = mock.MagicMock
        iam_client.region = AWS_REGION_US_EAST_1

        iam_client.access_keys_metadata = {USER_DATA: [{"AccessKeyId": 1}]}
        iam_client.last_accessed_services = {
            USER_DATA: [{"ServiceNamespace": "sts"}, {"ServiceNamespace": "iam"}]
        }

        iam_client.users = [
            mock.MagicMock(
                arn=IAM_USER_ARN,
                tags=[{"Key": "Name", "Value": IAM_USER_NAME}],
            )
        ]

        # Generate temporary credentials usage
        iam_client.user_temporary_credentials_usage = {}
        iam_client._get_user_temporary_credentials_usage = (
            IAM._get_user_temporary_credentials_usage
        )
        iam_client._get_user_temporary_credentials_usage(iam_client)

        with (
            mock.patch(
                "prowler.providers.aws.services.iam.iam_service.IAM",
                new=iam_client,
            ) as iam_service,
            mock.patch(
                "prowler.providers.aws.services.iam.iam_client.iam_client",
                new=iam_service,
            ),
        ):
            from prowler.providers.aws.services.iam.iam_user_with_temporary_credentials.iam_user_with_temporary_credentials import (
                iam_user_with_temporary_credentials,
            )

            check = iam_user_with_temporary_credentials()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User {IAM_USER_NAME} doesn't have long lived credentials with access to other services than IAM or STS."
            )
            assert result[0].resource_id == IAM_USER_NAME
            assert result[0].resource_arn == IAM_USER_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": IAM_USER_NAME}]

    def test_access_keys_with_iam_and_ec2(self):
        iam_client = mock.MagicMock
        iam_client.region = AWS_REGION_US_EAST_1

        iam_client.access_keys_metadata = {USER_DATA: [{"AccessKeyId": 1}]}
        iam_client.last_accessed_services = {
            USER_DATA: [{"ServiceNamespace": "iam"}, {"ServiceNamespace": "ec2"}]
        }

        iam_client.users = [
            mock.MagicMock(
                arn=IAM_USER_ARN,
                tags=[{"Key": "Name", "Value": IAM_USER_NAME}],
            )
        ]

        # Generate temporary credentials usage
        iam_client.user_temporary_credentials_usage = {}
        iam_client._get_user_temporary_credentials_usage = (
            IAM._get_user_temporary_credentials_usage
        )
        iam_client._get_user_temporary_credentials_usage(iam_client)

        with (
            mock.patch(
                "prowler.providers.aws.services.iam.iam_service.IAM",
                new=iam_client,
            ) as iam_service,
            mock.patch(
                "prowler.providers.aws.services.iam.iam_client.iam_client",
                new=iam_service,
            ),
        ):
            from prowler.providers.aws.services.iam.iam_user_with_temporary_credentials.iam_user_with_temporary_credentials import (
                iam_user_with_temporary_credentials,
            )

            check = iam_user_with_temporary_credentials()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {IAM_USER_NAME} has long lived credentials with access to other services than IAM or STS."
            )
            assert result[0].resource_id == IAM_USER_NAME
            assert result[0].resource_arn == IAM_USER_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "Name", "Value": IAM_USER_NAME}]
```

--------------------------------------------------------------------------------

````
