---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 580
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 580 of 867)

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

---[FILE: iam_user_accesskey_unused_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_user_accesskey_unused/iam_user_accesskey_unused_test.py

```python
import datetime
from unittest import mock

import pytz
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_ACCOUNT_NUMBER = "123456789012"
AWS_REGION = "us-east-1"


class Test_iam_user_accesskey_unused_test:
    @mock_aws
    def test_user_no_access_keys(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": "test-user"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], audit_config={"max_unused_access_keys_days": 45}
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused import (
                    iam_user_accesskey_unused,
                )

                service_client.credential_report[0][
                    "access_key_1_last_rotated"
                ] == "N/A"
                service_client.credential_report[0][
                    "access_key_2_last_rotated"
                ] == "N/A"

                check = iam_user_accesskey_unused()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"User {user} does not have access keys."
                )
                assert result[0].resource_id == user
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == [
                    {"Key": "Name", "Value": "test-user"}
                ]

    @mock_aws
    def test_user_access_key_1_not_used(self):
        credentials_last_rotated = (
            datetime.datetime.now(pytz.utc) - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%SZ")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": "test-user"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], audit_config={"max_unused_access_keys_days": 45}
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused import (
                    iam_user_accesskey_unused,
                )

                service_client.credential_report[0]["access_key_1_active"] = "true"
                service_client.credential_report[0][
                    "access_key_1_last_used_date"
                ] = credentials_last_rotated

                check = iam_user_accesskey_unused()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"User {user} has not used access key 1 in the last 45 days (100 days)."
                )
                assert result[0].resource_id == user + "/AccessKey1"
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == [
                    {"Key": "Name", "Value": "test-user"}
                ]

    @mock_aws
    def test_user_access_key_2_not_used(self):
        credentials_last_rotated = (
            datetime.datetime.now(pytz.utc) - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%SZ")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": "test-user"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], audit_config={"max_unused_access_keys_days": 45}
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused import (
                    iam_user_accesskey_unused,
                )

                service_client.credential_report[0]["access_key_2_active"] = "true"
                service_client.credential_report[0][
                    "access_key_2_last_used_date"
                ] = credentials_last_rotated

                check = iam_user_accesskey_unused()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"User {user} has not used access key 2 in the last 45 days (100 days)."
                )
                assert result[0].resource_id == user + "/AccessKey2"
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == [
                    {"Key": "Name", "Value": "test-user"}
                ]

    @mock_aws
    def test_user_both_access_keys_not_used(self):
        credentials_last_rotated = (
            datetime.datetime.now(pytz.utc) - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%SZ")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": "test-user"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], audit_config={"max_unused_access_keys_days": 45}
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused import (
                    iam_user_accesskey_unused,
                )

                service_client.credential_report[0]["access_key_1_active"] = "true"
                service_client.credential_report[0][
                    "access_key_1_last_used_date"
                ] = credentials_last_rotated

                service_client.credential_report[0]["access_key_2_active"] = "true"
                service_client.credential_report[0][
                    "access_key_2_last_used_date"
                ] = credentials_last_rotated

                check = iam_user_accesskey_unused()
                result = check.execute()
                assert len(result) == 2
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"User {user} has not used access key 1 in the last 45 days (100 days)."
                )
                assert result[0].resource_id == user + "/AccessKey1"
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == [
                    {"Key": "Name", "Value": "test-user"}
                ]

                assert result[1].status == "FAIL"
                assert (
                    result[1].status_extended
                    == f"User {user} has not used access key 2 in the last 45 days (100 days)."
                )
                assert result[1].resource_id == user + "/AccessKey2"
                assert result[1].resource_arn == arn
                assert result[1].region == AWS_REGION

    @mock_aws
    def test_user_both_access_keys_used(self):
        credentials_last_rotated = (
            datetime.datetime.now(pytz.utc) - datetime.timedelta(days=10)
        ).strftime("%Y-%m-%dT%H:%M:%SZ")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": "test-user"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], audit_config={"max_unused_access_keys_days": 45}
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_user_accesskey_unused.iam_user_accesskey_unused import (
                    iam_user_accesskey_unused,
                )

                service_client.credential_report[0]["access_key_1_active"] = "true"
                service_client.credential_report[0][
                    "access_key_1_last_used_date"
                ] = credentials_last_rotated

                service_client.credential_report[0]["access_key_2_active"] = "true"
                service_client.credential_report[0][
                    "access_key_2_last_used_date"
                ] = credentials_last_rotated

                check = iam_user_accesskey_unused()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"User {user} does not have unused access keys for 45 days."
                )
                assert result[0].resource_id == user
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == [
                    {"Key": "Name", "Value": "test-user"}
                ]
```

--------------------------------------------------------------------------------

---[FILE: iam_user_administrator_access_policy_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_user_administrator_access_policy/iam_user_administrator_access_policy_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_iam_user_administrator_access_policy:
    @mock_aws
    def test_no_users(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_administrator_access_policy.iam_user_administrator_access_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_user_administrator_access_policy.iam_user_administrator_access_policy import (
                iam_user_administrator_access_policy,
            )

            check = iam_user_administrator_access_policy()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_no_admin_users(self):
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create non-admin user
        user_arn = iam_client.create_user(UserName="non-admin-user")["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_administrator_access_policy.iam_user_administrator_access_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_user_administrator_access_policy.iam_user_administrator_access_policy import (
                iam_user_administrator_access_policy,
            )

            check = iam_user_administrator_access_policy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM User non-admin-user does not have AdministratorAccess policy."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "non-admin-user"
            assert result[0].resource_arn == user_arn
            assert result[0].resource_tags == []

    @mock_aws
    def test_admin_user(self):
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)

        # Create the AdministratorAccess policy
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [{"Effect": "Allow", "Action": "*", "Resource": "*"}],
        }

        policy_arn = iam_client.create_policy(
            PolicyName="AdministratorAccess",
            PolicyDocument=dumps(policy_document),
            Path="/",
        )["Policy"]["Arn"]

        # Create admin user
        user_name = "admin-user"
        user_arn = iam_client.create_user(UserName=user_name)["User"]["Arn"]

        # Attach AdministratorAccess policy
        iam_client.attach_user_policy(
            UserName=user_name,
            PolicyArn=policy_arn,
        )

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_administrator_access_policy.iam_user_administrator_access_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_user_administrator_access_policy.iam_user_administrator_access_policy import (
                iam_user_administrator_access_policy,
            )

            check = iam_user_administrator_access_policy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM User admin-user has AdministratorAccess policy attached."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == user_name
            assert result[0].resource_arn == user_arn
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: iam_user_console_access_unused_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_user_console_access_unused/iam_user_console_access_unused_test.py

```python
import datetime
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_ACCOUNT_NUMBER = "123456789012"
AWS_REGION = "us-east-1"


class Test_iam_user_console_access_unused_test:
    @mock_aws
    def test_iam_user_logged_2_days_ago(self):
        password_last_used = (
            datetime.datetime.now() - datetime.timedelta(days=2)
        ).strftime("%Y-%m-%d %H:%M:%S+00:00")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]
        # Enable console access
        iam_client.create_login_profile(UserName=user, Password="Test1234")

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], audit_config={"max_unused_access_keys_days": 45}
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_user_console_access_unused.iam_user_console_access_unused.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_user_console_access_unused.iam_user_console_access_unused import (
                    iam_user_console_access_unused,
                )

                service_client.users[0].password_last_used = password_last_used
                check = iam_user_console_access_unused()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"User {user} has logged in to the console in the past 45 days (2 days)."
                )
                assert result[0].resource_id == user
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_user_not_logged_45_days(self):
        password_last_used = (
            datetime.datetime.now() - datetime.timedelta(days=60)
        ).strftime("%Y-%m-%d %H:%M:%S+00:00")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]
        iam_client.create_login_profile(UserName=user, Password="Test1234")

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], audit_config={"max_unused_access_keys_days": 45}
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_user_console_access_unused.iam_user_console_access_unused.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_user_console_access_unused.iam_user_console_access_unused import (
                    iam_user_console_access_unused,
                )

                service_client.users[0].password_last_used = password_last_used
                check = iam_user_console_access_unused()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"User {user} has not logged in to the console in the past 45 days (60 days)."
                )
                assert result[0].resource_id == user
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_user_not_logged(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_US_EAST_1], audit_config={"max_unused_access_keys_days": 45}
        )

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_user_console_access_unused.iam_user_console_access_unused.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_user_console_access_unused.iam_user_console_access_unused import (
                    iam_user_console_access_unused,
                )

                service_client.users[0].password_last_used = ""

                check = iam_user_console_access_unused()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"User {user} does not have console access enabled or is unused."
                )
                assert result[0].resource_id == user
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

---[FILE: iam_user_hardware_mfa_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_user_hardware_mfa_enabled/iam_user_hardware_mfa_enabled_test.py

```python
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_ACCOUNT_NUMBER = "123456789012"


class Test_iam_user_hardware_mfa_enabled_test:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_user_no_mfa_devices(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_hardware_mfa_enabled.iam_user_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_hardware_mfa_enabled.iam_user_hardware_mfa_enabled import (
                iam_user_hardware_mfa_enabled,
            )

            service_client.users[0].mfa_devices = []
            check = iam_user_hardware_mfa_enabled()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert search(
                f"User {user} does not have any type of MFA enabled.",
                result[0].status_extended,
            )
            assert result[0].resource_id == user
            assert result[0].resource_arn == arn

    @mock_aws
    def test_user_virtual_mfa_devices(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM, MFADevice

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_hardware_mfa_enabled.iam_user_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_hardware_mfa_enabled.iam_user_hardware_mfa_enabled import (
                iam_user_hardware_mfa_enabled,
            )

            mfa_devices = [
                MFADevice(serial_number="123454", type="mfa"),
                MFADevice(serial_number="1234547", type="sms-mfa"),
            ]

            service_client.users[0].mfa_devices = mfa_devices
            check = iam_user_hardware_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"User {user} has a virtual MFA instead of a hardware MFA device enabled.",
                result[0].status_extended,
            )
            assert result[0].resource_id == user
            assert result[0].resource_arn == arn

    @mock_aws
    def test_user_virtual_sms_mfa_devices(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM, MFADevice

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_hardware_mfa_enabled.iam_user_hardware_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_hardware_mfa_enabled.iam_user_hardware_mfa_enabled import (
                iam_user_hardware_mfa_enabled,
            )

            mfa_devices = [
                MFADevice(serial_number="123454", type="test-mfa"),
                MFADevice(serial_number="1234547", type="sms-mfa"),
            ]

            service_client.users[0].mfa_devices = mfa_devices
            check = iam_user_hardware_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                f"User {user} has a virtual MFA instead of a hardware MFA device enabled.",
                result[0].status_extended,
            )
            assert result[0].resource_id == user
            assert result[0].resource_arn == arn
```

--------------------------------------------------------------------------------

---[FILE: iam_user_mfa_enabled_console_access_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_user_mfa_enabled_console_access/iam_user_mfa_enabled_console_access_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_ACCOUNT_NUMBER = "123456789012"


class Test_iam_user_mfa_enabled_console_access_test:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_root_user_not_password_console_enabled(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_mfa_enabled_console_access.iam_user_mfa_enabled_console_access.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_mfa_enabled_console_access.iam_user_mfa_enabled_console_access import (
                iam_user_mfa_enabled_console_access,
            )

            service_client.credential_report = [
                {
                    "user": "<root_account>",
                    "arn": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root",
                    "user_creation_time": "2022-02-17T14:59:38+00:00",
                    "password_enabled": "not_supported",
                    "password_last_used": "2023-05-22T09:52:24+00:00",
                    "password_last_changed": "not_supported",
                    "password_next_rotation": "not_supported",
                    "mfa_active": "true",
                    "access_key_1_active": "false",
                    "access_key_1_last_rotated": "N/A",
                    "access_key_1_last_used_date": "N/A",
                    "access_key_1_last_used_region": "N/A",
                    "access_key_1_last_used_service": "N/A",
                    "access_key_2_active": "false",
                    "access_key_2_last_rotated": "N/A",
                    "access_key_2_last_used_date": "N/A",
                    "access_key_2_last_used_region": "N/A",
                    "access_key_2_last_used_service": "N/A",
                    "cert_1_active": "false",
                    "cert_1_last_rotated": "N/A",
                    "cert_2_active": "false",
                    "cert_2_last_rotated": "N/A",
                }
            ]

            check = iam_user_mfa_enabled_console_access()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_user_not_password_console_enabled(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": "test-user"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_mfa_enabled_console_access.iam_user_mfa_enabled_console_access.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_mfa_enabled_console_access.iam_user_mfa_enabled_console_access import (
                iam_user_mfa_enabled_console_access,
            )

            service_client.credential_report[0]["password_enabled"] = "false"

            check = iam_user_mfa_enabled_console_access()
            result = check.execute()

            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User {user} does not have Console Password enabled."
            )
            assert result[0].resource_id == user
            assert result[0].resource_arn == arn
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test-user"}]

    @mock_aws
    def test_user_password_console_and_mfa_enabled(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": "test-user"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_mfa_enabled_console_access.iam_user_mfa_enabled_console_access.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_mfa_enabled_console_access.iam_user_mfa_enabled_console_access import (
                iam_user_mfa_enabled_console_access,
            )

            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["mfa_active"] = "true"

            check = iam_user_mfa_enabled_console_access()
            result = check.execute()

            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User {user} has Console Password enabled and MFA enabled."
            )
            assert result[0].resource_id == user
            assert result[0].resource_arn == arn
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test-user"}]

    @mock_aws
    def test_user_password_console_enabled_and_mfa_not_enabled(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "Name", "Value": "test-user"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_user_mfa_enabled_console_access.iam_user_mfa_enabled_console_access.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_user_mfa_enabled_console_access.iam_user_mfa_enabled_console_access import (
                iam_user_mfa_enabled_console_access,
            )

            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["mfa_active"] = "false"

            check = iam_user_mfa_enabled_console_access()
            result = check.execute()

            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {user} has Console Password enabled but MFA disabled."
            )
            assert result[0].resource_id == user
            assert result[0].resource_arn == arn
            assert result[0].resource_tags == [{"Key": "Name", "Value": "test-user"}]
```

--------------------------------------------------------------------------------

````
