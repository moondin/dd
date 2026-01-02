---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 579
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 579 of 867)

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

---[FILE: iam_root_mfa_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_root_mfa_enabled/iam_root_mfa_enabled_test.py

```python
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_ACCOUNT_NUMBER = "123456789012"


class Test_iam_root_mfa_enabled_test:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_root_mfa_not_enabled(self):
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
                "prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled import (
                iam_root_mfa_enabled,
            )

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["mfa_active"] = "false"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = "arn:aws:iam::123456789012:<root_account>:root"

            check = iam_root_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "MFA is not enabled for root account.", result[0].status_extended
            )
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == service_client.credential_report[0]["arn"]

    @mock_aws
    def test_root_mfa_enabled(self):
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
                "prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled import (
                iam_root_mfa_enabled,
            )

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["mfa_active"] = "true"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = "arn:aws:iam::123456789012:<root_account>:root"

            check = iam_root_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search("MFA is enabled for root account.", result[0].status_extended)
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == service_client.credential_report[0]["arn"]

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
                "prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled import (
                iam_root_mfa_enabled,
            )

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["mfa_active"] = "false"
            service_client.credential_report[0]["password_enabled"] = "false"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = "arn:aws:iam::123456789012:<root_account>:root"

            check = iam_root_mfa_enabled()
            result = check.execute()
            # Should return no findings since root has no credentials
            assert len(result) == 0

    @mock_aws
    def test_root_mfa_with_organizational_management_enabled(self):
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
                "prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled import (
                iam_root_mfa_enabled,
            )

            # Set up organizational root management
            service_client.organization_features = ["RootCredentialsManagement"]

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["mfa_active"] = "true"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "true"
            service_client.credential_report[0]["access_key_2_active"] = "false"
            service_client.credential_report[0][
                "arn"
            ] = "arn:aws:iam::123456789012:<root_account>:root"

            check = iam_root_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "Root account has credentials with MFA enabled. "
                "Consider removing individual root credentials since organizational "
                "root management is active.",
                result[0].status_extended,
            )
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == service_client.credential_report[0]["arn"]

    @mock_aws
    def test_root_mfa_disabled_with_organizational_management_enabled(self):
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
                "prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_root_mfa_enabled.iam_root_mfa_enabled import (
                iam_root_mfa_enabled,
            )

            # Set up organizational root management
            service_client.organization_features = ["RootCredentialsManagement"]

            service_client.credential_report[0]["user"] = "<root_account>"
            service_client.credential_report[0]["mfa_active"] = "false"
            service_client.credential_report[0]["password_enabled"] = "true"
            service_client.credential_report[0]["access_key_1_active"] = "false"
            service_client.credential_report[0]["access_key_2_active"] = "true"
            service_client.credential_report[0][
                "arn"
            ] = "arn:aws:iam::123456789012:<root_account>:root"

            check = iam_root_mfa_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "Root account has credentials without MFA "
                "despite organizational root management being enabled.",
                result[0].status_extended,
            )
            assert result[0].resource_id == "<root_account>"
            assert result[0].resource_arn == service_client.credential_report[0]["arn"]
```

--------------------------------------------------------------------------------

---[FILE: iam_rotate_access_key_90_days_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_rotate_access_key_90_days/iam_rotate_access_key_90_days_test.py

```python
import datetime
from unittest import mock

import pytz
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_rotate_access_key_90_days_test:
    @mock_aws
    def test_user_no_access_keys(self):
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "test-tag", "Value": "test"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days import (
                iam_rotate_access_key_90_days,
            )

            service_client.credential_report[0]["access_key_1_last_rotated"] == "N/A"
            service_client.credential_report[0]["access_key_2_last_rotated"] == "N/A"

            check = iam_rotate_access_key_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == f"User {user} does not have access keys."
            )
            assert result[0].resource_id == user
            assert result[0].resource_arn == arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "test-tag", "Value": "test"}]

    @mock_aws
    def test_user_access_key_1_not_rotated(self):
        credentials_last_rotated = (
            datetime.datetime.now(pytz.utc) - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%S+00:00")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "test-tag", "Value": "test"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days import (
                iam_rotate_access_key_90_days,
            )

            service_client.credential_report[0]["access_key_1_active"] = "true"
            service_client.credential_report[0][
                "access_key_1_last_rotated"
            ] = credentials_last_rotated

            check = iam_rotate_access_key_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {user} has not rotated access key 1 in over 90 days (100 days)."
            )
            assert result[0].resource_id == f"{user}-access-key-1"
            assert result[0].resource_arn == arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "test-tag", "Value": "test"}]

    @mock_aws
    def test_user_access_key_2_not_rotated(self):
        credentials_last_rotated = (
            datetime.datetime.now(pytz.utc) - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%S+00:00")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "test-tag", "Value": "test"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days import (
                iam_rotate_access_key_90_days,
            )

            service_client.credential_report[0]["access_key_2_active"] = "true"
            service_client.credential_report[0][
                "access_key_2_last_rotated"
            ] = credentials_last_rotated

            check = iam_rotate_access_key_90_days()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {user} has not rotated access key 2 in over 90 days (100 days)."
            )
            assert result[0].resource_id == f"{user}-access-key-2"
            assert result[0].resource_arn == arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "test-tag", "Value": "test"}]

    @mock_aws
    def test_user_both_access_keys_not_rotated(self):
        credentials_last_rotated = (
            datetime.datetime.now(pytz.utc) - datetime.timedelta(days=100)
        ).strftime("%Y-%m-%dT%H:%M:%S+00:00")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "test-tag", "Value": "test"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days import (
                iam_rotate_access_key_90_days,
            )

            service_client.credential_report[0]["access_key_1_active"] = "true"
            service_client.credential_report[0][
                "access_key_1_last_rotated"
            ] = credentials_last_rotated

            service_client.credential_report[0]["access_key_2_active"] = "true"
            service_client.credential_report[0][
                "access_key_2_last_rotated"
            ] = credentials_last_rotated

            check = iam_rotate_access_key_90_days()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {user} has not rotated access key 1 in over 90 days (100 days)."
            )
            assert result[0].resource_id == f"{user}-access-key-1"
            assert result[0].resource_arn == arn
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == [{"Key": "test-tag", "Value": "test"}]
            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == f"User {user} has not rotated access key 2 in over 90 days (100 days)."
            )
            assert result[1].resource_id == f"{user}-access-key-2"
            assert result[1].resource_arn == arn
            assert result[1].region == AWS_REGION_US_EAST_1
            assert result[1].resource_tags == [{"Key": "test-tag", "Value": "test"}]

    @mock_aws
    def test_user_both_access_keys_rotated(self):
        credentials_last_rotated = (
            datetime.datetime.now(pytz.utc) - datetime.timedelta(days=10)
        ).strftime("%Y-%m-%dT%H:%M:%S+00:00")
        iam_client = client("iam")
        user = "test-user"
        arn = iam_client.create_user(UserName=user)["User"]["Arn"]

        iam_client.tag_user(UserName=user, Tags=[{"Key": "test-tag", "Value": "test"}])

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_rotate_access_key_90_days.iam_rotate_access_key_90_days import (
                    iam_rotate_access_key_90_days,
                )

                service_client.credential_report[0]["access_key_1_active"] = "true"
                service_client.credential_report[0][
                    "access_key_1_last_rotated"
                ] = credentials_last_rotated

                service_client.credential_report[0]["access_key_2_active"] = "true"
                service_client.credential_report[0][
                    "access_key_2_last_rotated"
                ] = credentials_last_rotated

                check = iam_rotate_access_key_90_days()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"User {user} does not have access keys older than 90 days."
                )
                assert result[0].resource_id == user
                assert result[0].resource_arn == arn
                assert result[0].region == AWS_REGION_US_EAST_1
                assert result[0].resource_tags == [{"Key": "test-tag", "Value": "test"}]
```

--------------------------------------------------------------------------------

---[FILE: iam_securityaudit_role_created_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_securityaudit_role_created/iam_securityaudit_role_created_test.py

```python
from json import dumps
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import IAM
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_securityaudit_role_created:
    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_securityaudit_role_created(self):
        iam = client("iam")
        role_name = "test_securityaudit_role_created"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": "sts:AssumeRole",
            },
        }
        iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/SecurityAudit",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_securityaudit_role_created.iam_securityaudit_role_created.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_securityaudit_role_created.iam_securityaudit_role_created import (
                    iam_securityaudit_role_created,
                )

                check = iam_securityaudit_role_created()
                result = check.execute()
                assert result[0].status == "PASS"
                assert search(
                    f"SecurityAudit policy attached to role {role_name}.",
                    result[0].status_extended,
                )
                assert result[0].resource_id == "SecurityAudit"
                assert result[0].resource_arn == "arn:aws:iam::aws:policy/SecurityAudit"
                assert result[0].region == "us-east-1"

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_no_securityaudit_role_created(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_securityaudit_role_created.iam_securityaudit_role_created.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_securityaudit_role_created.iam_securityaudit_role_created import (
                    iam_securityaudit_role_created,
                )

                check = iam_securityaudit_role_created()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "SecurityAudit policy is not attached to any role."
                )
                assert result[0].resource_id == "SecurityAudit"
                assert result[0].resource_arn == "arn:aws:iam::aws:policy/SecurityAudit"
                assert result[0].region == "us-east-1"

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_securityaudit_role_created.iam_securityaudit_role_created.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_securityaudit_role_created.iam_securityaudit_role_created import (
                iam_securityaudit_role_created,
            )

            service_client.entities_role_attached_to_securityaudit_policy = None

            check = iam_securityaudit_role_created()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_support_role_created_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_support_role_created/iam_support_role_created_test.py

```python
from json import dumps
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_ACCOUNT_NUMBER = "123456789012"


class Test_iam_support_role_created:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_support_role_created(self):
        iam = client("iam")
        role_name = "test_support"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": "sts:AssumeRole",
            },
        }
        iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/AWSSupportAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_support_role_created.iam_support_role_created.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_support_role_created.iam_support_role_created import (
                iam_support_role_created,
            )

            check = iam_support_role_created()
            result = check.execute()
            assert result[0].status == "PASS"
            assert search(
                f"AWS Support Access policy attached to role {role_name}.",
                result[0].status_extended,
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].resource_arn == "arn:aws:iam::aws:policy/AWSSupportAccess"

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_no_support_role_created(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_support_role_created.iam_support_role_created.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_support_role_created.iam_support_role_created import (
                iam_support_role_created,
            )

            check = iam_support_role_created()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "AWS Support Access policy is not attached to any role."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].resource_arn == "arn:aws:iam::aws:policy/AWSSupportAccess"

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_support_role_created.iam_support_role_created.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_support_role_created.iam_support_role_created import (
                iam_support_role_created,
            )

            service_client.entities_role_attached_to_support_policy = None

            check = iam_support_role_created()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
