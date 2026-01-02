---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 454
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 454 of 867)

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

---[FILE: awslambda_function_no_secrets_in_variables_test.py]---
Location: prowler-master/tests/providers/aws/services/awslambda/awslambda_function_no_secrets_in_variables/awslambda_function_no_secrets_in_variables_test.py

```python
from unittest import mock

from prowler.providers.aws.services.awslambda.awslambda_service import Function
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_awslambda_function_no_secrets_in_variables:
    def test_no_functions(self):
        lambda_client = mock.MagicMock
        lambda_client.functions = {}
        lambda_client.audit_config = {"secrets_ignore_patterns": []}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables import (
                awslambda_function_no_secrets_in_variables,
            )

            check = awslambda_function_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 0

    def test_function_no_variables(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "nodejs4.3"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.audit_config = {"secrets_ignore_patterns": []}

        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
            )
        }

        lambda_client.audit_config = {"secrets_ignore_patterns": []}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables import (
                awslambda_function_no_secrets_in_variables,
            )

            check = awslambda_function_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in Lambda function {function_name} variables."
            )
            assert result[0].resource_tags == []

    def test_function_secrets_in_keyword(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "nodejs4.3"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"

        lambda_client.audit_config = {"secrets_ignore_patterns": []}

        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                environment={"db_password": "test-password"},
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables import (
                awslambda_function_no_secrets_in_variables,
            )

            check = awslambda_function_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in Lambda function {function_name} variables -> Secret Keyword in variable db_password."
            )
            assert result[0].resource_tags == []

    def test_function_secrets_in_keyword_and_variable(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "nodejs4.3"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"

        lambda_client.audit_config = {"secrets_ignore_patterns": []}

        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                environment={"db_password": "srv://admin:pass@db"},
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables import (
                awslambda_function_no_secrets_in_variables,
            )

            check = awslambda_function_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Potential secret found in Lambda function {function_name} variables -> Secret Keyword in variable db_password, Basic Auth Credentials in variable db_password."
            )
            assert result[0].resource_tags == []

    def test_function_secrets_in_variables_telegram_token(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "nodejs4.3"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.audit_config = {"secrets_ignore_patterns": []}
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                environment={"TELEGRAM_BOT_TOKEN": "telegram-token"},
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables import (
                awslambda_function_no_secrets_in_variables,
            )

            check = awslambda_function_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in Lambda function {function_name} variables."
            )
            assert result[0].resource_tags == []

    def test_function_no_secrets_in_variables(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "nodejs4.3"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.audit_config = {"secrets_ignore_patterns": []}

        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                environment={"db_username": "test-user"},
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_no_secrets_in_variables.awslambda_function_no_secrets_in_variables import (
                awslambda_function_no_secrets_in_variables,
            )

            check = awslambda_function_no_secrets_in_variables()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"No secrets found in Lambda function {function_name} variables."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_url_cors_policy_test.py]---
Location: prowler-master/tests/providers/aws/services/awslambda/awslambda_function_url_cors_policy/awslambda_function_url_cors_policy_test.py

```python
from unittest import mock

from moto import mock_aws

from prowler.providers.aws.services.awslambda.awslambda_service import (
    AuthType,
    Function,
    URLConfig,
    URLConfigCORS,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


@mock_aws
class Test_awslambda_function_url_cors_policy:
    def test_no_functions(self):
        lambda_client = mock.MagicMock
        lambda_client.functions = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_url_cors_policy.awslambda_function_url_cors_policy.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_url_cors_policy.awslambda_function_url_cors_policy import (
                awslambda_function_url_cors_policy,
            )

            check = awslambda_function_url_cors_policy()
            result = check.execute()

            assert len(result) == 0

    def test_function_cors_asterisk(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "nodejs4.3"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                url_config=URLConfig(
                    auth_type=AuthType.NONE,
                    url="",
                    cors_config=URLConfigCORS(allow_origins=["*"]),
                ),
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_url_cors_policy.awslambda_function_url_cors_policy.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_url_cors_policy.awslambda_function_url_cors_policy import (
                awslambda_function_url_cors_policy,
            )

            check = awslambda_function_url_cors_policy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} URL has a wide CORS configuration."
            )
            assert result[0].resource_tags == []

    def test_function_cors_not_wide(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "python3.9"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                url_config=URLConfig(
                    auth_type=AuthType.AWS_IAM,
                    url="",
                    cors_config=URLConfigCORS(allow_origins=["https://example.com"]),
                ),
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_url_cors_policy.awslambda_function_url_cors_policy.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_url_cors_policy.awslambda_function_url_cors_policy import (
                awslambda_function_url_cors_policy,
            )

            check = awslambda_function_url_cors_policy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} does not have a wide CORS configuration."
            )
            assert result[0].resource_tags == []

    def test_function_cors_wide_with_two_origins(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "python3.9"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                url_config=URLConfig(
                    auth_type=AuthType.AWS_IAM,
                    url="",
                    cors_config=URLConfigCORS(
                        allow_origins=["https://example.com", "*"]
                    ),
                ),
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_url_cors_policy.awslambda_function_url_cors_policy.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_url_cors_policy.awslambda_function_url_cors_policy import (
                awslambda_function_url_cors_policy,
            )

            check = awslambda_function_url_cors_policy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} URL has a wide CORS configuration."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_url_public_test.py]---
Location: prowler-master/tests/providers/aws/services/awslambda/awslambda_function_url_public/awslambda_function_url_public_test.py

```python
from unittest import mock

from prowler.providers.aws.services.awslambda.awslambda_service import (
    AuthType,
    Function,
    URLConfig,
    URLConfigCORS,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_awslambda_function_url_public:
    def test_no_functions(self):
        lambda_client = mock.MagicMock
        lambda_client.functions = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_url_public.awslambda_function_url_public.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_url_public.awslambda_function_url_public import (
                awslambda_function_url_public,
            )

            check = awslambda_function_url_public()
            result = check.execute()

            assert len(result) == 0

    def test_function_public_url(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "nodejs4.3"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                url_config=URLConfig(
                    auth_type=AuthType.NONE,
                    url="",
                    cors_config=URLConfigCORS(allow_origins=[]),
                ),
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_url_public.awslambda_function_url_public.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_url_public.awslambda_function_url_public import (
                awslambda_function_url_public,
            )

            check = awslambda_function_url_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} has a publicly accessible function URL."
            )
            assert result[0].resource_tags == []

    def test_function_private_url(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "python3.9"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
                url_config=URLConfig(
                    auth_type=AuthType.AWS_IAM,
                    url="",
                    cors_config=URLConfigCORS(allow_origins=[]),
                ),
            )
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_url_public.awslambda_function_url_public.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_url_public.awslambda_function_url_public import (
                awslambda_function_url_public,
            )

            check = awslambda_function_url_public()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} does not have a publicly accessible function URL."
            )
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: awslambda_function_using_supported_runtimes_test.py]---
Location: prowler-master/tests/providers/aws/services/awslambda/awslambda_function_using_supported_runtimes/awslambda_function_using_supported_runtimes_test.py

```python
from unittest import mock

from prowler.providers.aws.services.awslambda.awslambda_service import Function
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_awslambda_function_using_supported_runtimes:
    def test_no_functions(self):
        lambda_client = mock.MagicMock
        lambda_client.functions = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_using_supported_runtimes.awslambda_function_using_supported_runtimes.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_using_supported_runtimes.awslambda_function_using_supported_runtimes import (
                awslambda_function_using_supported_runtimes,
            )

            check = awslambda_function_using_supported_runtimes()
            result = check.execute()

            assert len(result) == 0

    def test_function_obsolete_runtime(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "nodejs4.3"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
            )
        }

        # Mock config
        lambda_client.audit_config = {
            "obsolete_lambda_runtimes": [
                "java8",
                "go1.x",
                "provided",
                "python3.6",
                "python2.7",
                "python3.7",
                "nodejs4.3",
                "nodejs4.3-edge",
                "nodejs6.10",
                "nodejs",
                "nodejs8.10",
                "nodejs10.x",
                "nodejs12.x",
                "nodejs14.x",
                "dotnet5.0",
                "dotnetcore1.0",
                "dotnetcore2.0",
                "dotnetcore2.1",
                "dotnetcore3.1",
                "ruby2.5",
                "ruby2.7",
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_using_supported_runtimes.awslambda_function_using_supported_runtimes.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_using_supported_runtimes.awslambda_function_using_supported_runtimes import (
                awslambda_function_using_supported_runtimes,
            )

            check = awslambda_function_using_supported_runtimes()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} is using {function_runtime} which is obsolete."
            )
            assert result[0].resource_tags == []

    def test_function_supported_runtime(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_runtime = "python3.9"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
                runtime=function_runtime,
            )
        }

        # Mock config
        lambda_client.audit_config = {
            "obsolete_lambda_runtimes": [
                "java8",
                "go1.x",
                "provided",
                "python3.6",
                "python2.7",
                "python3.7",
                "nodejs4.3",
                "nodejs4.3-edge",
                "nodejs6.10",
                "nodejs",
                "nodejs8.10",
                "nodejs10.x",
                "nodejs12.x",
                "nodejs14.x",
                "dotnet5.0",
                "dotnetcore1.0",
                "dotnetcore2.0",
                "dotnetcore2.1",
                "dotnetcore3.1",
                "ruby2.5",
                "ruby2.7",
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_using_supported_runtimes.awslambda_function_using_supported_runtimes.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_using_supported_runtimes.awslambda_function_using_supported_runtimes import (
                awslambda_function_using_supported_runtimes,
            )

            check = awslambda_function_using_supported_runtimes()
            result = check.execute()

            assert len(result) == 1
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == function_name
            assert result[0].resource_arn == function_arn
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Lambda function {function_name} is using {function_runtime} which is supported."
            )
            assert result[0].resource_tags == []

    def test_function_no_runtime(self):
        lambda_client = mock.MagicMock
        function_name = "test-lambda"
        function_arn = f"arn:aws:lambda:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:function/{function_name}"
        lambda_client.functions = {
            "function_name": Function(
                name=function_name,
                security_groups=[],
                arn=function_arn,
                region=AWS_REGION_US_EAST_1,
            )
        }

        # Mock config
        lambda_client.audit_config = {
            "obsolete_lambda_runtimes": [
                "java8",
                "go1.x",
                "provided",
                "python3.6",
                "python2.7",
                "python3.7",
                "nodejs4.3",
                "nodejs4.3-edge",
                "nodejs6.10",
                "nodejs",
                "nodejs8.10",
                "nodejs10.x",
                "nodejs12.x",
                "nodejs14.x",
                "dotnet5.0",
                "dotnetcore1.0",
                "dotnetcore2.0",
                "dotnetcore2.1",
                "dotnetcore3.1",
                "ruby2.5",
                "ruby2.7",
            ]
        }

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.awslambda.awslambda_function_using_supported_runtimes.awslambda_function_using_supported_runtimes.awslambda_client",
                new=lambda_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.awslambda.awslambda_function_using_supported_runtimes.awslambda_function_using_supported_runtimes import (
                awslambda_function_using_supported_runtimes,
            )

            check = awslambda_function_using_supported_runtimes()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
