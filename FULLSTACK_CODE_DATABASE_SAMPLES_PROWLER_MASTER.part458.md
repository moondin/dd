---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 458
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 458 of 867)

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

---[FILE: bedrock_api_key_no_long_term_credentials_test.py]---
Location: prowler-master/tests/providers/aws/services/bedrock/bedrock_api_key_no_long_term_credentials/bedrock_api_key_no_long_term_credentials_test.py

```python
from datetime import datetime, timedelta, timezone
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_bedrock_api_key_no_long_term_credentials:
    @mock_aws
    def test_no_bedrock_api_keys(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials import (
                bedrock_api_key_no_long_term_credentials,
            )

            check = bedrock_api_key_no_long_term_credentials()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_bedrock_api_key_with_future_expiration_date(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam = IAM(aws_provider)

        # Mock service-specific credentials
        from prowler.providers.aws.services.iam.iam_service import (
            ServiceSpecificCredential,
            User,
        )

        # Create a mock user
        mock_user = User(
            name="test_user",
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user",
            attached_policies=[],
            inline_policies=[],
        )

        # Create a mock service-specific credential with future expiration date
        expiration_date = datetime.now(timezone.utc) + timedelta(days=30)
        mock_credential = ServiceSpecificCredential(
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user/credential/test-credential-id",
            user=mock_user,
            status="Active",
            create_date=datetime.now(timezone.utc),
            service_user_name=None,
            service_credential_alias=None,
            expiration_date=expiration_date,
            id="test-credential-id",
            service_name="bedrock.amazonaws.com",
            region=AWS_REGION_US_EAST_1,
        )

        iam.service_specific_credentials = [mock_credential]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials.iam_client",
                new=iam,
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials import (
                bedrock_api_key_no_long_term_credentials,
            )

            check = bedrock_api_key_no_long_term_credentials()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "will expire in" in result[0].status_extended
            assert "test-credential-id" in result[0].status_extended
            assert "test_user" in result[0].status_extended
            assert result[0].resource_id == "test-credential-id"
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bedrock_api_key_with_critical_expiration_date(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam = IAM(aws_provider)

        # Mock service-specific credentials
        from prowler.providers.aws.services.iam.iam_service import (
            ServiceSpecificCredential,
            User,
        )

        # Create a mock user
        mock_user = User(
            name="test_user",
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user",
            attached_policies=[],
            inline_policies=[],
        )

        # Create a mock service-specific credential with very far future expiration date (>10000 days)
        expiration_date = datetime.now(timezone.utc) + timedelta(days=15000)
        mock_credential = ServiceSpecificCredential(
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user/credential/test-credential-id",
            user=mock_user,
            status="Active",
            create_date=datetime.now(timezone.utc),
            service_user_name=None,
            service_credential_alias=None,
            expiration_date=expiration_date,
            id="test-credential-id",
            service_name="bedrock.amazonaws.com",
            region=AWS_REGION_US_EAST_1,
        )

        iam.service_specific_credentials = [mock_credential]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials.iam_client",
                new=iam,
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials import (
                bedrock_api_key_no_long_term_credentials,
            )

            check = bedrock_api_key_no_long_term_credentials()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert "never expires" in result[0].status_extended
            assert "test-credential-id" in result[0].status_extended
            assert "test_user" in result[0].status_extended
            assert result[0].resource_id == "test-credential-id"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert check.Severity == "critical"

    @mock_aws
    def test_bedrock_api_key_with_expired_date(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam = IAM(aws_provider)

        # Mock service-specific credentials
        from prowler.providers.aws.services.iam.iam_service import (
            ServiceSpecificCredential,
            User,
        )

        # Create a mock user
        mock_user = User(
            name="test_user",
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user",
            attached_policies=[],
            inline_policies=[],
        )

        # Create a mock service-specific credential with past expiration date
        expiration_date = datetime.now(timezone.utc) - timedelta(days=30)
        mock_credential = ServiceSpecificCredential(
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user/credential/test-credential-id",
            user=mock_user,
            status="Active",
            create_date=datetime.now(timezone.utc),
            service_user_name=None,
            service_credential_alias=None,
            expiration_date=expiration_date,
            id="test-credential-id",
            service_name="bedrock.amazonaws.com",
            region=AWS_REGION_US_EAST_1,
        )

        iam.service_specific_credentials = [mock_credential]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials.iam_client",
                new=iam,
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials import (
                bedrock_api_key_no_long_term_credentials,
            )

            check = bedrock_api_key_no_long_term_credentials()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert "has expired" in result[0].status_extended
            assert "test-credential-id" in result[0].status_extended
            assert "test_user" in result[0].status_extended
            assert result[0].resource_id == "test-credential-id"
            assert result[0].region == AWS_REGION_US_EAST_1

    @mock_aws
    def test_bedrock_api_key_without_expiration_date_ignored(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam = IAM(aws_provider)

        # Mock service-specific credentials
        from prowler.providers.aws.services.iam.iam_service import (
            ServiceSpecificCredential,
            User,
        )

        # Create a mock user
        mock_user = User(
            name="test_user",
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user",
            attached_policies=[],
            inline_policies=[],
        )

        # Create a mock service-specific credential without expiration date (should be ignored)
        mock_credential = ServiceSpecificCredential(
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user/credential/test-credential-id",
            user=mock_user,
            status="Active",
            create_date=datetime.now(timezone.utc),
            service_user_name=None,
            service_credential_alias=None,
            expiration_date=None,  # No expiration date - should be ignored
            id="test-credential-id",
            service_name="bedrock.amazonaws.com",
            region=AWS_REGION_US_EAST_1,
        )

        iam.service_specific_credentials = [mock_credential]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials.iam_client",
                new=iam,
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials import (
                bedrock_api_key_no_long_term_credentials,
            )

            check = bedrock_api_key_no_long_term_credentials()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_non_bedrock_api_key_ignored(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam = IAM(aws_provider)

        # Mock service-specific credentials
        from prowler.providers.aws.services.iam.iam_service import (
            ServiceSpecificCredential,
            User,
        )

        # Create a mock user
        mock_user = User(
            name="test_user",
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user",
            attached_policies=[],
            inline_policies=[],
        )

        # Create a mock service-specific credential for a different service
        expiration_date = datetime.now(timezone.utc) + timedelta(days=30)
        mock_credential = ServiceSpecificCredential(
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user/credential/test-credential-id",
            user=mock_user,
            status="Active",
            create_date=datetime.now(timezone.utc),
            service_user_name=None,
            service_credential_alias=None,
            expiration_date=expiration_date,
            id="test-credential-id",
            service_name="codecommit.amazonaws.com",  # Different service
            region=AWS_REGION_US_EAST_1,
        )

        iam.service_specific_credentials = [mock_credential]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials.iam_client",
                new=iam,
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials import (
                bedrock_api_key_no_long_term_credentials,
            )

            check = bedrock_api_key_no_long_term_credentials()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_multiple_bedrock_api_keys_mixed_scenarios(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam = IAM(aws_provider)

        # Mock service-specific credentials
        from prowler.providers.aws.services.iam.iam_service import (
            ServiceSpecificCredential,
            User,
        )

        # Create mock users
        mock_user1 = User(
            name="test_user1",
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user1",
            attached_policies=[],
            inline_policies=[],
        )

        mock_user2 = User(
            name="test_user2",
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user2",
            attached_policies=[],
            inline_policies=[],
        )

        mock_user3 = User(
            name="test_user3",
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user3",
            attached_policies=[],
            inline_policies=[],
        )

        # Create a mock service-specific credential with future expiration date
        expiration_date1 = datetime.now(timezone.utc) + timedelta(days=30)
        mock_credential1 = ServiceSpecificCredential(
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user1/credential/test-credential-id-1",
            user=mock_user1,
            status="Active",
            create_date=datetime.now(timezone.utc),
            service_user_name=None,
            service_credential_alias=None,
            expiration_date=expiration_date1,
            id="test-credential-id-1",
            service_name="bedrock.amazonaws.com",
            region=AWS_REGION_US_EAST_1,
        )

        # Create a mock service-specific credential with critical expiration date
        expiration_date2 = datetime.now(timezone.utc) + timedelta(days=15000)
        mock_credential2 = ServiceSpecificCredential(
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user2/credential/test-credential-id-2",
            user=mock_user2,
            status="Active",
            create_date=datetime.now(timezone.utc),
            service_user_name=None,
            service_credential_alias=None,
            expiration_date=expiration_date2,
            id="test-credential-id-2",
            service_name="bedrock.amazonaws.com",
            region=AWS_REGION_US_EAST_1,
        )

        # Create a mock service-specific credential with expired date
        expiration_date3 = datetime.now(timezone.utc) - timedelta(days=30)
        mock_credential3 = ServiceSpecificCredential(
            arn=f"arn:aws:iam:{AWS_REGION_US_EAST_1}:123456789012:user/test_user3/credential/test-credential-id-3",
            user=mock_user3,
            status="Active",
            create_date=datetime.now(timezone.utc),
            service_user_name=None,
            service_credential_alias=None,
            expiration_date=expiration_date3,
            id="test-credential-id-3",
            service_name="bedrock.amazonaws.com",
            region=AWS_REGION_US_EAST_1,
        )

        iam.service_specific_credentials = [
            mock_credential1,
            mock_credential2,
            mock_credential3,
        ]

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials.iam_client",
                new=iam,
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_api_key_no_long_term_credentials.bedrock_api_key_no_long_term_credentials import (
                bedrock_api_key_no_long_term_credentials,
            )

            check = bedrock_api_key_no_long_term_credentials()
            result = check.execute()

            assert len(result) == 3

            # Check the credential with future expiration date (FAIL)
            fail_result1 = next(
                r for r in result if r.resource_id == "test-credential-id-1"
            )
            assert fail_result1.status == "FAIL"
            assert "will expire in" in fail_result1.status_extended
            assert "test-credential-id-1" in fail_result1.status_extended
            assert "test_user1" in fail_result1.status_extended

            # Check the credential with critical expiration date (FAIL)
            fail_result2 = next(
                r for r in result if r.resource_id == "test-credential-id-2"
            )
            assert fail_result2.status == "FAIL"
            assert "never expires" in fail_result2.status_extended
            assert "test-credential-id-2" in fail_result2.status_extended
            assert "test_user2" in fail_result2.status_extended

            # Check the credential with expired date (PASS)
            pass_result = next(
                r for r in result if r.resource_id == "test-credential-id-3"
            )
            assert pass_result.status == "PASS"
            assert "has expired" in pass_result.status_extended
            assert "test-credential-id-3" in pass_result.status_extended
            assert "test_user3" in pass_result.status_extended
```

--------------------------------------------------------------------------------

---[FILE: bedrock_guardrail_prompt_attack_filter_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/bedrock/bedrock_guardrail_prompt_attack_filter_enabled/bedrock_guardrail_prompt_attack_filter_enabled_test.py

```python
from unittest import mock

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call

GUARDRAIL_ARN = (
    f"arn:aws:bedrock:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:guardrail/test-id"
)


def mock_make_api_call_high_filter(self, operation_name, kwarg):
    if operation_name == "ListGuardrails":
        return {
            "guardrails": [
                {
                    "id": "test-id",
                    "arn": GUARDRAIL_ARN,
                    "status": "READY",
                    "name": "test",
                }
            ]
        }
    elif operation_name == "GetGuardrail":
        return {
            "name": "test",
            "guardrailId": "test-id",
            "guardrailArn": GUARDRAIL_ARN,
            "status": "READY",
            "contentPolicy": {
                "filters": [
                    {
                        "type": "PROMPT_ATTACK",
                        "inputStrength": "HIGH",
                        "outputStrength": "NONE",
                    },
                ]
            },
            "blockedInputMessaging": "Sorry, the model cannot answer this question.",
            "blockedOutputsMessaging": "Sorry, the model cannot answer this question.",
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_no_filter(self, operation_name, kwarg):
    if operation_name == "ListGuardrails":
        return {
            "guardrails": [
                {
                    "id": "test-id",
                    "arn": GUARDRAIL_ARN,
                    "status": "READY",
                    "name": "test",
                }
            ]
        }
    elif operation_name == "GetGuardrail":
        return {
            "name": "test",
            "guardrailId": "test-id",
            "guardrailArn": GUARDRAIL_ARN,
            "status": "READY",
            "contentPolicy": {"filters": []},
            "blockedInputMessaging": "Sorry, the model cannot answer this question.",
            "blockedOutputsMessaging": "Sorry, the model cannot answer this question.",
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_low_filter(self, operation_name, kwarg):
    if operation_name == "ListGuardrails":
        return {
            "guardrails": [
                {
                    "id": "test-id",
                    "arn": GUARDRAIL_ARN,
                    "status": "READY",
                    "name": "test",
                }
            ]
        }
    elif operation_name == "GetGuardrail":
        return {
            "name": "test",
            "guardrailId": "test-id",
            "guardrailArn": GUARDRAIL_ARN,
            "status": "READY",
            "contentPolicy": {
                "filters": [
                    {
                        "type": "PROMPT_ATTACK",
                        "inputStrength": "LOW",
                        "outputStrength": "NONE",
                    },
                ]
            },
            "blockedInputMessaging": "Sorry, the model cannot answer this question.",
            "blockedOutputsMessaging": "Sorry, the model cannot answer this question.",
        }
    return make_api_call(self, operation_name, kwarg)


class Test_bedrock_guardrail_prompt_attack_filter_enabled:
    @mock_aws
    def test_no_guardrails(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_guardrail_prompt_attack_filter_enabled import (
                bedrock_guardrail_prompt_attack_filter_enabled,
            )

            check = bedrock_guardrail_prompt_attack_filter_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_high_filter
    )
    @mock_aws
    def test_guardrail_high_filter(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_guardrail_prompt_attack_filter_enabled import (
                bedrock_guardrail_prompt_attack_filter_enabled,
            )

            check = bedrock_guardrail_prompt_attack_filter_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Guardrail test is configured to detect and block prompt attacks with a HIGH strength."
            )
            assert result[0].resource_id == "test-id"
            assert result[0].resource_arn == GUARDRAIL_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_no_filter
    )
    @mock_aws
    def test_guardrail_no_filter(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_guardrail_prompt_attack_filter_enabled import (
                bedrock_guardrail_prompt_attack_filter_enabled,
            )

            check = bedrock_guardrail_prompt_attack_filter_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bedrock Guardrail test is not configured to block prompt attacks."
            )
            assert result[0].resource_id == "test-id"
            assert result[0].resource_arn == GUARDRAIL_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_low_filter
    )
    @mock_aws
    def test_guardrail_low_filter(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_guardrail_prompt_attack_filter_enabled.bedrock_guardrail_prompt_attack_filter_enabled import (
                bedrock_guardrail_prompt_attack_filter_enabled,
            )

            check = bedrock_guardrail_prompt_attack_filter_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bedrock Guardrail test is configured to block prompt attacks but with a filter strength of LOW, not HIGH."
            )
            assert result[0].resource_id == "test-id"
            assert result[0].resource_arn == GUARDRAIL_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

---[FILE: bedrock_guardrail_sensitive_information_filter_enabled_test.py]---
Location: prowler-master/tests/providers/aws/services/bedrock/bedrock_guardrail_sensitive_information_filter_enabled/bedrock_guardrail_sensitive_information_filter_enabled_test.py

```python
from unittest import mock

import botocore
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)

make_api_call = botocore.client.BaseClient._make_api_call

GUARDRAIL_ARN = (
    f"arn:aws:bedrock:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:guardrail/test-id"
)


def mock_make_api_call_no_filter(self, operation_name, kwarg):
    if operation_name == "ListGuardrails":
        return {
            "guardrails": [
                {
                    "id": "test-id",
                    "arn": GUARDRAIL_ARN,
                    "status": "READY",
                    "name": "test",
                }
            ]
        }
    elif operation_name == "GetGuardrail":
        return {
            "name": "test",
            "guardrailId": "test-id",
            "guardrailArn": GUARDRAIL_ARN,
            "status": "READY",
            "blockedInputMessaging": "Sorry, the model cannot answer this question.",
            "blockedOutputsMessaging": "Sorry, the model cannot answer this question.",
        }
    return make_api_call(self, operation_name, kwarg)


def mock_make_api_call_with_filter(self, operation_name, kwarg):
    if operation_name == "ListGuardrails":
        return {
            "guardrails": [
                {
                    "id": "test-id",
                    "arn": GUARDRAIL_ARN,
                    "status": "READY",
                    "name": "test",
                }
            ]
        }
    elif operation_name == "GetGuardrail":
        return {
            "name": "test",
            "guardrailId": "test-id",
            "guardrailArn": GUARDRAIL_ARN,
            "status": "READY",
            "sensitiveInformationPolicy": True,
            "contentPolicy": {"filters": []},
            "blockedInputMessaging": "Sorry, the model cannot answer this question.",
            "blockedOutputsMessaging": "Sorry, the model cannot answer this question.",
        }
    return make_api_call(self, operation_name, kwarg)


class Test_bedrock_guardrail_sensitive_information_filter_enabled:
    @mock_aws
    def test_no_guardrails(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1, AWS_REGION_US_EAST_1]
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_guardrail_sensitive_information_filter_enabled import (
                bedrock_guardrail_sensitive_information_filter_enabled,
            )

            check = bedrock_guardrail_sensitive_information_filter_enabled()
            result = check.execute()

            assert len(result) == 0

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_no_filter
    )
    @mock_aws
    def test_guardrail_no_filter(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_guardrail_sensitive_information_filter_enabled import (
                bedrock_guardrail_sensitive_information_filter_enabled,
            )

            check = bedrock_guardrail_sensitive_information_filter_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Bedrock Guardrail test is not configured to block or mask sensitive information."
            )
            assert result[0].resource_id == "test-id"
            assert result[0].resource_arn == GUARDRAIL_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []

    @mock.patch(
        "botocore.client.BaseClient._make_api_call", new=mock_make_api_call_with_filter
    )
    @mock_aws
    def test_guardrail_with_filter(self):
        from prowler.providers.aws.services.bedrock.bedrock_service import Bedrock

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.bedrock.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_client",
                new=Bedrock(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.bedrock.bedrock_guardrail_sensitive_information_filter_enabled.bedrock_guardrail_sensitive_information_filter_enabled import (
                bedrock_guardrail_sensitive_information_filter_enabled,
            )

            check = bedrock_guardrail_sensitive_information_filter_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Bedrock Guardrail test is blocking or masking sensitive information."
            )
            assert result[0].resource_id == "test-id"
            assert result[0].resource_arn == GUARDRAIL_ARN
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_tags == []
```

--------------------------------------------------------------------------------

````
