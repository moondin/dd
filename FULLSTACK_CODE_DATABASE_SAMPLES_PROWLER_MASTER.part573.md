---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 573
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 573 of 867)

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

---[FILE: iam_no_root_access_key_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_no_root_access_key/iam_no_root_access_key_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_no_root_access_key_test:
    @mock_aws
    def test_iam_root_no_access_keys(self):
        iam_client = client("iam")
        user = "test"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key import (
                    iam_no_root_access_key,
                )

                service_client.credential_report[0]["user"] = "<root_account>"
                service_client.credential_report[0][
                    "arn"
                ] = "arn:aws:iam::123456789012:user/<root_account>"
                service_client.credential_report[0]["password_enabled"] = "true"
                service_client.credential_report[0]["access_key_1_active"] = "false"
                service_client.credential_report[0]["access_key_2_active"] = "false"
                check = iam_no_root_access_key()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Root account does not have access keys."
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::123456789012:user/<root_account>"
                )

    @mock_aws
    def test_iam_root_access_key_1(self):
        iam_client = client("iam")
        user = "test"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key import (
                    iam_no_root_access_key,
                )

                service_client.credential_report[0]["user"] = "<root_account>"
                service_client.credential_report[0][
                    "arn"
                ] = "arn:aws:iam::123456789012:user/<root_account>"
                service_client.credential_report[0]["password_enabled"] = "true"
                service_client.credential_report[0]["access_key_1_active"] = "true"
                service_client.credential_report[0]["access_key_2_active"] = "false"
                check = iam_no_root_access_key()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Root account has one active access key."
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::123456789012:user/<root_account>"
                )

    @mock_aws
    def test_iam_root_access_key_2(self):
        iam_client = client("iam")
        user = "test"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key import (
                    iam_no_root_access_key,
                )

                service_client.credential_report[0]["user"] = "<root_account>"
                service_client.credential_report[0][
                    "arn"
                ] = "arn:aws:iam::123456789012:user/<root_account>"
                service_client.credential_report[0]["password_enabled"] = "false"
                service_client.credential_report[0]["access_key_1_active"] = "false"
                service_client.credential_report[0]["access_key_2_active"] = "true"
                check = iam_no_root_access_key()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Root account has one active access key."
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::123456789012:user/<root_account>"
                )

    @mock_aws
    def test_iam_root_both_access_keys(self):
        iam_client = client("iam")
        user = "test"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key import (
                    iam_no_root_access_key,
                )

                service_client.credential_report[0]["user"] = "<root_account>"
                service_client.credential_report[0][
                    "arn"
                ] = "arn:aws:iam::123456789012:user/<root_account>"
                service_client.credential_report[0]["password_enabled"] = "false"
                service_client.credential_report[0]["access_key_1_active"] = "true"
                service_client.credential_report[0]["access_key_2_active"] = "true"
                check = iam_no_root_access_key()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Root account has two active access keys."
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::123456789012:user/<root_account>"
                )

    @mock_aws
    def test_root_no_credentials(self):
        iam_client = client("iam")
        user = "test"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key import (
                    iam_no_root_access_key,
                )

                service_client.credential_report[0]["user"] = "<root_account>"
                service_client.credential_report[0][
                    "arn"
                ] = "arn:aws:iam::123456789012:user/<root_account>"
                service_client.credential_report[0]["password_enabled"] = "false"
                service_client.credential_report[0]["access_key_1_active"] = "false"
                service_client.credential_report[0]["access_key_2_active"] = "false"
                check = iam_no_root_access_key()
                result = check.execute()

                # Should return no findings since root has no credentials
                assert len(result) == 0

    @mock_aws
    def test_root_no_access_keys_with_organizational_management_enabled(self):
        iam_client = client("iam")
        user = "test"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key import (
                    iam_no_root_access_key,
                )

                # Set up organizational root management
                service_client.organization_features = ["RootCredentialsManagement"]

                service_client.credential_report[0]["user"] = "<root_account>"
                service_client.credential_report[0][
                    "arn"
                ] = "arn:aws:iam::123456789012:user/<root_account>"
                service_client.credential_report[0]["password_enabled"] = "true"
                service_client.credential_report[0]["access_key_1_active"] = "false"
                service_client.credential_report[0]["access_key_2_active"] = "false"
                check = iam_no_root_access_key()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Root account has password configured but no access keys. Consider removing individual root credentials since organizational root management is active."
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::123456789012:user/<root_account>"
                )

    @mock_aws
    def test_root_access_keys_with_organizational_management_enabled(self):
        iam_client = client("iam")
        user = "test"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key import (
                    iam_no_root_access_key,
                )

                # Set up organizational root management
                service_client.organization_features = ["RootCredentialsManagement"]

                service_client.credential_report[0]["user"] = "<root_account>"
                service_client.credential_report[0][
                    "arn"
                ] = "arn:aws:iam::123456789012:user/<root_account>"
                service_client.credential_report[0]["password_enabled"] = "true"
                service_client.credential_report[0]["access_key_1_active"] = "true"
                service_client.credential_report[0]["access_key_2_active"] = "false"
                check = iam_no_root_access_key()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Root account has one active access key despite organizational root management being enabled."
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::123456789012:user/<root_account>"
                )

    @mock_aws
    def test_root_both_access_keys_with_organizational_management_enabled(self):
        iam_client = client("iam")
        user = "test"
        iam_client.create_user(UserName=user)["User"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_no_root_access_key.iam_no_root_access_key import (
                    iam_no_root_access_key,
                )

                # Set up organizational root management
                service_client.organization_features = ["RootCredentialsManagement"]

                service_client.credential_report[0]["user"] = "<root_account>"
                service_client.credential_report[0][
                    "arn"
                ] = "arn:aws:iam::123456789012:user/<root_account>"
                service_client.credential_report[0]["password_enabled"] = "false"
                service_client.credential_report[0]["access_key_1_active"] = "true"
                service_client.credential_report[0]["access_key_2_active"] = "true"
                check = iam_no_root_access_key()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "Root account has two active access keys despite organizational root management being enabled."
                )
                assert result[0].resource_id == "<root_account>"
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::123456789012:user/<root_account>"
                )
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_expires_passwords_within_90_days_or_less_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_expires_passwords_within_90_days_or_less/iam_password_policy_expires_passwords_within_90_days_or_less_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import PasswordPolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_expires_passwords_within_90_days_or_less_fixer:
    @mock_aws
    def test_iam_password_policy_expires_passwords_within_90_days_or_less_fixer(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less_fixer.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            service_client.password_policy = PasswordPolicy(
                length=10,
                symbols=True,
                numbers=True,
                uppercase=True,
                lowercase=True,
                allow_change=True,
                expiration=True,
                max_age=40,
                reuse_prevention=2,
                hard_expiry=True,
            )
            from prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less_fixer import (
                fixer,
            )

            assert fixer(resource_id=AWS_ACCOUNT_NUMBER)
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_expires_passwords_within_90_days_or_less_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_expires_passwords_within_90_days_or_less/iam_password_policy_expires_passwords_within_90_days_or_less_test.py

```python
from re import search
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_expires_passwords_within_90_days_or_less:
    @mock_aws
    def test_password_expiration_lower_90(self):
        from prowler.providers.aws.services.iam.iam_service import IAM, PasswordPolicy

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less import (
                    iam_password_policy_expires_passwords_within_90_days_or_less,
                )

                service_client.password_policy = PasswordPolicy(
                    length=10,
                    symbols=True,
                    numbers=True,
                    uppercase=True,
                    lowercase=True,
                    allow_change=True,
                    expiration=True,
                    max_age=40,
                    reuse_prevention=2,
                    hard_expiry=True,
                )
                check = iam_password_policy_expires_passwords_within_90_days_or_less()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert search(
                    "Password expiration is set lower than 90 days",
                    result[0].status_extended,
                )

    @mock_aws
    def test_password_expiration_greater_90(self):
        from prowler.providers.aws.services.iam.iam_service import IAM, PasswordPolicy

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less import (
                    iam_password_policy_expires_passwords_within_90_days_or_less,
                )

                service_client.password_policy = PasswordPolicy(
                    length=10,
                    symbols=True,
                    numbers=True,
                    uppercase=True,
                    lowercase=True,
                    allow_change=True,
                    expiration=True,
                    max_age=100,
                    reuse_prevention=2,
                    hard_expiry=True,
                )
                check = iam_password_policy_expires_passwords_within_90_days_or_less()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert search(
                    "Password expiration is set greater than 90 days",
                    result[0].status_extended,
                )

    @mock_aws
    def test_password_expiration_just_90(self):
        from prowler.providers.aws.services.iam.iam_service import IAM, PasswordPolicy

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less import (
                    iam_password_policy_expires_passwords_within_90_days_or_less,
                )

                service_client.password_policy = PasswordPolicy(
                    length=10,
                    symbols=True,
                    numbers=True,
                    uppercase=True,
                    lowercase=True,
                    allow_change=True,
                    expiration=True,
                    max_age=90,
                    reuse_prevention=2,
                    hard_expiry=True,
                )
                check = iam_password_policy_expires_passwords_within_90_days_or_less()
                result = check.execute()
                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
                )
                assert result[0].region == AWS_REGION_US_EAST_1
                assert search(
                    "Password expiration is set lower than 90 days",
                    result[0].status_extended,
                )

    def test_access_denied(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_expires_passwords_within_90_days_or_less.iam_password_policy_expires_passwords_within_90_days_or_less import (
                    iam_password_policy_expires_passwords_within_90_days_or_less,
                )

                service_client.password_policy = None
                check = iam_password_policy_expires_passwords_within_90_days_or_less()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_lowercase_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_lowercase/iam_password_policy_lowercase_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import PasswordPolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_lowercase_fixer:
    @mock_aws
    def test_iam_password_policy_lowercase_fixer(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_lowercase.iam_password_policy_lowercase_fixer.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            service_client.password_policy = PasswordPolicy(
                length=10,
                symbols=True,
                numbers=True,
                uppercase=True,
                lowercase=True,
                allow_change=True,
                expiration=True,
                max_age=40,
                reuse_prevention=2,
                hard_expiry=True,
            )
            from prowler.providers.aws.services.iam.iam_password_policy_lowercase.iam_password_policy_lowercase_fixer import (
                fixer,
            )

            assert fixer(resource_id=AWS_ACCOUNT_NUMBER)
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_lowercase_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_lowercase/iam_password_policy_lowercase_test.py

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


class Test_iam_password_policy_lowercase:
    @mock_aws
    def test_iam_password_policy_no_lowercase_flag(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(RequireLowercaseCharacters=False)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_lowercase.iam_password_policy_lowercase.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_lowercase.iam_password_policy_lowercase import (
                iam_password_policy_lowercase,
            )

            check = iam_password_policy_lowercase()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "IAM password policy does not require at least one lowercase letter.",
                result[0].status_extended,
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_password_policy_lowercase_flag(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(RequireLowercaseCharacters=True)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_lowercase.iam_password_policy_lowercase.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_lowercase.iam_password_policy_lowercase import (
                iam_password_policy_lowercase,
            )

            check = iam_password_policy_lowercase()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "IAM password policy requires at least one lowercase letter.",
                result[0].status_extended,
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    def test_access_denied(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_lowercase.iam_password_policy_lowercase.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_lowercase.iam_password_policy_lowercase import (
                    iam_password_policy_lowercase,
                )

                service_client.password_policy = None
                check = iam_password_policy_lowercase()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_minimum_length_14_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_minimum_length_14/iam_password_policy_minimum_length_14_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import PasswordPolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_minimum_length_14_fixer:
    @mock_aws
    def test_iam_password_policy_minimum_length_14_fixer(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14_fixer.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            service_client.password_policy = PasswordPolicy(
                length=10,
                symbols=True,
                numbers=True,
                uppercase=True,
                lowercase=True,
                allow_change=True,
                expiration=True,
                max_age=40,
                reuse_prevention=2,
                hard_expiry=True,
            )
            from prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14_fixer import (
                fixer,
            )

            assert fixer(resource_id=AWS_ACCOUNT_NUMBER)
```

--------------------------------------------------------------------------------

````
