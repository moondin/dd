---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 574
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 574 of 867)

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

---[FILE: iam_password_policy_minimum_length_14_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_minimum_length_14/iam_password_policy_minimum_length_14_test.py

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


class Test_iam_password_policy_minimum_length_14:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_iam_password_policy_minimum_length_equal_14(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(MinimumPasswordLength=14)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14 import (
                iam_password_policy_minimum_length_14,
            )

            check = iam_password_policy_minimum_length_14()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "IAM password policy requires minimum length of 14 characters.",
                result[0].status_extended,
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_password_policy_minimum_length_greater_14(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(MinimumPasswordLength=20)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14 import (
                iam_password_policy_minimum_length_14,
            )

            check = iam_password_policy_minimum_length_14()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "IAM password policy requires minimum length of 14 characters.",
                result[0].status_extended,
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_password_policy_minimum_length_less_14(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(MinimumPasswordLength=10)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14 import (
                iam_password_policy_minimum_length_14,
            )

            check = iam_password_policy_minimum_length_14()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "IAM password policy does not require minimum length of 14 characters.",
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
                "prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_minimum_length_14.iam_password_policy_minimum_length_14 import (
                    iam_password_policy_minimum_length_14,
                )

                service_client.password_policy = None
                check = iam_password_policy_minimum_length_14()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_number_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_number/iam_password_policy_number_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import PasswordPolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_number_fixer:
    @mock_aws
    def test_iam_password_policy_number_fixer(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_number.iam_password_policy_number_fixer.iam_client",
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
            from prowler.providers.aws.services.iam.iam_password_policy_number.iam_password_policy_number_fixer import (
                fixer,
            )

            assert fixer(resource_id=AWS_ACCOUNT_NUMBER)
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_number_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_number/iam_password_policy_number_test.py

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


class Test_iam_password_policy_number:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_iam_password_policy_no_number_flag(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(RequireNumbers=False)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_number.iam_password_policy_number.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_number.iam_password_policy_number import (
                iam_password_policy_number,
            )

            check = iam_password_policy_number()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "IAM password policy does not require at least one number.",
                result[0].status_extended,
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_password_policy_number_flag(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(RequireNumbers=True)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_number.iam_password_policy_number.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_number.iam_password_policy_number import (
                iam_password_policy_number,
            )

            check = iam_password_policy_number()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "IAM password policy requires at least one number.",
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
                "prowler.providers.aws.services.iam.iam_password_policy_number.iam_password_policy_number.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_number.iam_password_policy_number import (
                    iam_password_policy_number,
                )

                service_client.password_policy = None
                check = iam_password_policy_number()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_reuse_24_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_reuse_24/iam_password_policy_reuse_24_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import PasswordPolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_reuse_24_fixer:
    @mock_aws
    def test_iam_password_policy_reuse_24_fixer(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_reuse_24.iam_password_policy_reuse_24_fixer.iam_client",
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
            from prowler.providers.aws.services.iam.iam_password_policy_reuse_24.iam_password_policy_reuse_24_fixer import (
                fixer,
            )

            assert fixer(resource_id=AWS_ACCOUNT_NUMBER)
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_reuse_24_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_reuse_24/iam_password_policy_reuse_24_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_reuse_24:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_iam_password_policy_reuse_prevention_equal_24(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(PasswordReusePrevention=24)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_reuse_24.iam_password_policy_reuse_24.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_reuse_24.iam_password_policy_reuse_24 import (
                iam_password_policy_reuse_24,
            )

            check = iam_password_policy_reuse_24()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM password policy reuse prevention is equal to 24."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_password_policy_reuse_prevention_less_24(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(PasswordReusePrevention=20)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_reuse_24.iam_password_policy_reuse_24.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_reuse_24.iam_password_policy_reuse_24 import (
                iam_password_policy_reuse_24,
            )

            check = iam_password_policy_reuse_24()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM password policy reuse prevention is less than 24 or not set."
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
                "prowler.providers.aws.services.iam.iam_password_policy_reuse_24.iam_password_policy_reuse_24.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_reuse_24.iam_password_policy_reuse_24 import (
                    iam_password_policy_reuse_24,
                )

                service_client.password_policy = None
                check = iam_password_policy_reuse_24()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_symbol_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_symbol/iam_password_policy_symbol_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import PasswordPolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_symbol_fixer:
    @mock_aws
    def test_iam_password_policy_symbol_fixer(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_symbol.iam_password_policy_symbol_fixer.iam_client",
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
            from prowler.providers.aws.services.iam.iam_password_policy_symbol.iam_password_policy_symbol_fixer import (
                fixer,
            )

            assert fixer(resource_id=AWS_ACCOUNT_NUMBER)
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_symbol_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_symbol/iam_password_policy_symbol_test.py

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


class Test_iam_password_policy_symbol:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_iam_password_policy_no_symbol_flag(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(RequireSymbols=False)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_symbol.iam_password_policy_symbol.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_symbol.iam_password_policy_symbol import (
                iam_password_policy_symbol,
            )

            check = iam_password_policy_symbol()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert search(
                "IAM password policy does not require at least one symbol.",
                result[0].status_extended,
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_password_policy_symbol_flag(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(RequireSymbols=True)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_symbol.iam_password_policy_symbol.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_symbol.iam_password_policy_symbol import (
                iam_password_policy_symbol,
            )

            check = iam_password_policy_symbol()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert search(
                "IAM password policy requires at least one symbol.",
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
                "prowler.providers.aws.services.iam.iam_password_policy_symbol.iam_password_policy_symbol.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_symbol.iam_password_policy_symbol import (
                    iam_password_policy_symbol,
                )

                service_client.password_policy = None
                check = iam_password_policy_symbol()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_uppercase_fixer_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_uppercase/iam_password_policy_uppercase_fixer_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import PasswordPolicy
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_uppercase_fixer:
    @mock_aws
    def test_iam_password_policy_uppercase_fixer(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_uppercase.iam_password_policy_uppercase_fixer.iam_client",
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
            from prowler.providers.aws.services.iam.iam_password_policy_uppercase.iam_password_policy_uppercase_fixer import (
                fixer,
            )

            assert fixer(resource_id=AWS_ACCOUNT_NUMBER)
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_uppercase_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_password_policy_uppercase/iam_password_policy_uppercase_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_password_policy_uppercase:
    from tests.providers.aws.utils import (
        AWS_ACCOUNT_ARN,
        AWS_ACCOUNT_NUMBER,
        AWS_REGION_US_EAST_1,
        set_mocked_aws_provider,
    )

    @mock_aws
    def test_iam_password_policy_no_uppercase_flag(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(RequireUppercaseCharacters=False)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_uppercase.iam_password_policy_uppercase.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_uppercase.iam_password_policy_uppercase import (
                iam_password_policy_uppercase,
            )

            check = iam_password_policy_uppercase()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM password policy does not require at least one uppercase letter."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert (
                result[0].resource_arn
                == f"arn:aws:iam:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:password-policy"
            )
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_iam_password_policy_uppercase_flag(self):
        iam_client = client("iam")
        # update password policy
        iam_client.update_account_password_policy(RequireUppercaseCharacters=True)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_password_policy_uppercase.iam_password_policy_uppercase.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_password_policy_uppercase.iam_password_policy_uppercase import (
                iam_password_policy_uppercase,
            )

            check = iam_password_policy_uppercase()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM password policy requires at least one uppercase letter."
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
                "prowler.providers.aws.services.iam.iam_password_policy_uppercase.iam_password_policy_uppercase.iam_client",
                new=IAM(aws_provider),
            ) as service_client:
                from prowler.providers.aws.services.iam.iam_password_policy_uppercase.iam_password_policy_uppercase import (
                    iam_password_policy_uppercase,
                )

                service_client.password_policy = None
                check = iam_password_policy_uppercase()
                result = check.execute()
                assert len(result) == 0
```

--------------------------------------------------------------------------------

````
