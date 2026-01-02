---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 470
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 470 of 867)

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

---[FILE: cloudtrail_threat_detection_llm_jacking_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_threat_detection_llm_jacking/cloudtrail_threat_detection_llm_jacking_test.py

```python
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


def mock_get_trail_arn_template(region=None, *_) -> str:
    if region:
        return f"arn:aws:cloudtrail:{region}:{AWS_ACCOUNT_NUMBER}:trail"
    else:
        return f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"


def mock__get_lookup_events__(trail=None, event_name=None, minutes=None, *_) -> list:
    return [
        {
            "CloudTrailEvent": '{"eventName": "InvokeModel", "userIdentity": {"type": "IAMUser", "principalId": "EXAMPLE6E4XEGITWATV6R", "arn": "arn:aws:iam::123456789012:user/Attacker", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "userName": "Attacker", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
        {
            "CloudTrailEvent": '{"eventName": "InvokeModelWithResponseStream", "userIdentity": {"type": "IAMUser", "principalId": "EXAMPLE6E4XEGITWATV6R", "arn": "arn:aws:iam::123456789012:user/Attacker", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "userName": "Attacker", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
    ]


def mock__get_lookup_events_aws_service__(
    trail=None, event_name=None, minutes=None, *_
) -> list:
    return [
        {
            "CloudTrailEvent": '{"eventName": "InvokeModel", "userIdentity": {"type": "AWSService", "principalId": "EXAMPLE6E4XEGITWATV6R", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
        {
            "CloudTrailEvent": '{"eventName": "InvokeModelWithResponseStream", "userIdentity": {"type": "AWSService", "principalId": "EXAMPLE6E4XEGITWATV6R", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
    ]


class Test_cloudtrail_threat_detection_llm_jacking:
    @mock_aws
    def test_no_trails(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {}
        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking import (
                cloudtrail_threat_detection_llm_jacking,
            )

            check = cloudtrail_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "No potential LLM Jacking attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_no_potential_llm_jacking(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_llm_jacking_actions": [],
            "threat_detection_llm_jacking_threshold": 0.1,
            "threat_detection_llm_jacking_minutes": 1440,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking import (
                cloudtrail_threat_detection_llm_jacking,
            )

            check = cloudtrail_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "No potential LLM Jacking attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_potential_priviledge_escalation(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_llm_jacking_actions": [
                "InvokeModel",
                "InvokeModelWithResponseStream",
            ],
            "threat_detection_llm_jacking_threshold": 0.1,
            "threat_detection_llm_jacking_minutes": 1440,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking import (
                cloudtrail_threat_detection_llm_jacking,
            )

            check = cloudtrail_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Potential LLM Jacking attack detected from AWS IAMUser Attacker with a threshold of 1.0."
            )
            assert result[0].resource_id == "Attacker"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/Attacker"
            )

    @mock_aws
    def test_bigger_threshold(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_llm_jacking_actions": [
                "InvokeModel",
                "InvokeModelWithResponseStream",
            ],
            "threat_detection_llm_jacking_threshold": 2.0,
            "threat_detection_llm_jacking_minutes": 1440,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking import (
                cloudtrail_threat_detection_llm_jacking,
            )

            check = cloudtrail_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "No potential LLM Jacking attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_potential_enumeration_from_aws_service(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_llm_jacking_actions": [
                "InvokeModel",
                "InvokeModelWithResponseStream",
            ],
            "threat_detection_llm_jacking_threshold": 2.0,
            "threat_detection_llm_jacking_minutes": 1440,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events_aws_service__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_llm_jacking.cloudtrail_threat_detection_llm_jacking import (
                cloudtrail_threat_detection_llm_jacking,
            )

            check = cloudtrail_threat_detection_llm_jacking()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "No potential LLM Jacking attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )
```

--------------------------------------------------------------------------------

---[FILE: cloudtrail_threat_detection_privilege_escalation_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudtrail/cloudtrail_threat_detection_privilege_escalation/cloudtrail_threat_detection_privilege_escalation_test.py

```python
from unittest import mock

from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


def mock_get_trail_arn_template(region=None, *_) -> str:
    if region:
        return f"arn:aws:cloudtrail:{region}:{AWS_ACCOUNT_NUMBER}:trail"
    else:
        return f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"


def mock__get_lookup_events__(trail=None, event_name=None, minutes=None, *_) -> list:
    return [
        {
            "CloudTrailEvent": '{"eventName": "CreateLoginProfile", "userIdentity": {"type": "IAMUser", "principalId": "EXAMPLE6E4XEGITWATV6R", "arn": "arn:aws:iam::123456789012:user/Attacker", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "userName": "Attacker", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
        {
            "CloudTrailEvent": '{"eventName": "UpdateLoginProfile", "userIdentity": {"type": "IAMUser", "principalId": "EXAMPLE6E4XEGITWATV6R", "arn": "arn:aws:iam::123456789012:user/Attacker", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "userName": "Attacker", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
    ]


def mock__get_lookup_events_aws_service__(
    trail=None, event_name=None, minutes=None, *_
) -> list:
    return [
        {
            "CloudTrailEvent": '{"eventName": "CreateLoginProfile", "userIdentity": {"type": "AWSService", "principalId": "EXAMPLE6E4XEGITWATV6R", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
        {
            "CloudTrailEvent": '{"eventName": "UpdateLoginProfile", "userIdentity": {"type": "AWSService", "principalId": "EXAMPLE6E4XEGITWATV6R", "accountId": "123456789012", "accessKeyId": "AKIAIOSFODNN7EXAMPLE", "sessionContext": {"sessionIssuer": {}, "webIdFederationData": {}, "attributes": {"creationDate": "2023-07-19T21:11:57Z", "mfaAuthenticated": "false"}}}}'
        },
    ]


class Test_cloudtrail_threat_detection_privilege_escalation:
    @mock_aws
    def test_no_trails(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {}
        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation import (
                cloudtrail_threat_detection_privilege_escalation,
            )

            check = cloudtrail_threat_detection_privilege_escalation()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "No potential privilege escalation attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_no_potential_priviledge_escalation(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_privilege_escalation_actions": [],
            "threat_detection_privilege_escalation_threshold": 0.1,
            "threat_detection_privilege_escalation_minutes": 1440,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation import (
                cloudtrail_threat_detection_privilege_escalation,
            )

            check = cloudtrail_threat_detection_privilege_escalation()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "No potential privilege escalation attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_potential_priviledge_escalation(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_privilege_escalation_actions": [
                "CreateLoginProfile",
                "UpdateLoginProfile",
            ],
            "threat_detection_privilege_escalation_threshold": 0.1,
            "threat_detection_privilege_escalation_minutes": 1440,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation import (
                cloudtrail_threat_detection_privilege_escalation,
            )

            check = cloudtrail_threat_detection_privilege_escalation()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Potential privilege escalation attack detected from AWS IAMUser Attacker with a threshold of 1.0."
            )
            assert result[0].resource_id == "Attacker"
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/Attacker"
            )

    @mock_aws
    def test_bigger_threshold(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_privilege_escalation_actions": [
                "CreateLoginProfile",
                "UpdateLoginProfile",
            ],
            "threat_detection_privilege_escalation_threshold": 2.0,
            "threat_detection_privilege_escalation_minutes": 1440,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation import (
                cloudtrail_threat_detection_privilege_escalation,
            )

            check = cloudtrail_threat_detection_privilege_escalation()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "No potential privilege escalation attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )

    @mock_aws
    def test_potential_enumeration_from_aws_service(self):
        cloudtrail_client = mock.MagicMock()
        cloudtrail_client.trails = {"us-east-1": mock.MagicMock()}
        cloudtrail_client.trails["us-east-1"].is_multiregion = False
        cloudtrail_client.trails["us-east-1"].name = "trail_test_us"
        cloudtrail_client.trails["us-east-1"].s3_bucket_name = "bucket_test_us"
        cloudtrail_client.trails["us-east-1"].region = "us-east-1"
        cloudtrail_client.audited_account = AWS_ACCOUNT_NUMBER
        cloudtrail_client.region = AWS_REGION_US_EAST_1
        cloudtrail_client.audit_config = {
            "threat_detection_privilege_escalation_actions": [
                "CreateLoginProfile",
                "UpdateLoginProfile",
            ],
            "threat_detection_privilege_escalation_threshold": 2.0,
            "threat_detection_privilege_escalation_minutes": 1440,
        }

        cloudtrail_client._lookup_events = mock__get_lookup_events_aws_service__
        cloudtrail_client._get_trail_arn_template = mock_get_trail_arn_template

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_aws_provider(),
            ),
            mock.patch(
                "prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation.cloudtrail_client",
                new=cloudtrail_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.cloudtrail.cloudtrail_threat_detection_privilege_escalation.cloudtrail_threat_detection_privilege_escalation import (
                cloudtrail_threat_detection_privilege_escalation,
            )

            check = cloudtrail_threat_detection_privilege_escalation()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "No potential privilege escalation attack detected."
            )
            assert result[0].resource_id == AWS_ACCOUNT_NUMBER
            assert result[0].region == AWS_REGION_US_EAST_1
            assert (
                result[0].resource_arn
                == f"arn:aws:cloudtrail:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:trail"
            )
```

--------------------------------------------------------------------------------

---[FILE: cloudwatch_service_test.py]---
Location: prowler-master/tests/providers/aws/services/cloudwatch/cloudwatch_service_test.py

```python
from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.cloudwatch.cloudwatch_service import (
    CloudWatch,
    Logs,
)
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_CloudWatch_Service:
    # Test CloudWatch Service
    @mock_aws
    def test_service(self):
        # CloudWatch client for this test class
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        cloudwatch = CloudWatch(aws_provider)
        assert cloudwatch.service == "cloudwatch"

    # Test CloudWatch Client
    @mock_aws
    def test_client(self):
        # CloudWatch client for this test class
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        cloudwatch = CloudWatch(aws_provider)
        for client_ in cloudwatch.regional_clients.values():
            assert client_.__class__.__name__ == "CloudWatch"

    # Test CloudWatch Session
    @mock_aws
    def test__get_session__(self):
        # CloudWatch client for this test class
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        cloudwatch = CloudWatch(aws_provider)
        assert cloudwatch.session.__class__.__name__ == "Session"

    # Test CloudWatch Session
    @mock_aws
    def test_audited_account(self):
        # CloudWatch client for this test class
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        cloudwatch = CloudWatch(aws_provider)
        assert cloudwatch.audited_account == AWS_ACCOUNT_NUMBER

    # Test Logs Service
    @mock_aws
    def test_logs_service(self):
        # Logs client for this test class
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        logs = Logs(aws_provider)
        assert logs.service == "logs"

    # Test Logs Client
    @mock_aws
    def test_logs_client(self):
        # Logs client for this test class
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        logs = Logs(aws_provider)
        for client_ in logs.regional_clients.values():
            assert client_.__class__.__name__ == "CloudWatchLogs"

    # Test Logs Session
    @mock_aws
    def test__logs_get_session__(self):
        # Logs client for this test class
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        logs = Logs(aws_provider)
        assert logs.session.__class__.__name__ == "Session"

    # Test Logs Session
    @mock_aws
    def test_logs_audited_account(self):
        # Logs client for this test class
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        logs = Logs(aws_provider)
        assert logs.audited_account == AWS_ACCOUNT_NUMBER

    # Test CloudWatch Alarms
    @mock_aws
    def test_describe_alarms(self):
        # CloudWatch client for this test class
        cw_client = client("cloudwatch", region_name=AWS_REGION_US_EAST_1)
        cw_client.put_metric_alarm(
            AlarmActions=["arn:alarm"],
            AlarmDescription="A test",
            AlarmName="test",
            ComparisonOperator="GreaterThanOrEqualToThreshold",
            Dimensions=[{"Name": "InstanceId", "Value": "i-0123457"}],
            EvaluationPeriods=5,
            InsufficientDataActions=["arn:insufficient"],
            Namespace="test_namespace",
            MetricName="test_metric",
            OKActions=["arn:ok"],
            Period=60,
            Statistic="Average",
            Threshold=2,
            Unit="Seconds",
            Tags=[{"Key": "key-1", "Value": "value-1"}],
            ActionsEnabled=True,
        )
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        cloudwatch = CloudWatch(aws_provider)
        assert len(cloudwatch.metric_alarms) == 1
        assert (
            cloudwatch.metric_alarms[0].arn
            == f"arn:aws:cloudwatch:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:alarm:test"
        )
        assert cloudwatch.metric_alarms[0].name == "test"
        assert cloudwatch.metric_alarms[0].metric == "test_metric"
        assert cloudwatch.metric_alarms[0].name_space == "test_namespace"
        assert cloudwatch.metric_alarms[0].region == AWS_REGION_US_EAST_1
        assert cloudwatch.metric_alarms[0].tags == [
            {"Key": "key-1", "Value": "value-1"}
        ]
        assert cloudwatch.metric_alarms[0].alarm_actions == ["arn:alarm"]
        assert cloudwatch.metric_alarms[0].actions_enabled

    # Test Logs Filters
    @mock_aws
    def test_describe_metric_filters(self):
        # Logs client for this test class
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        logs_client.put_metric_filter(
            logGroupName="/log-group/test",
            filterName="test-filter",
            filterPattern="test-pattern",
            metricTransformations=[
                {
                    "metricName": "my-metric",
                    "metricNamespace": "my-namespace",
                    "metricValue": "$.value",
                }
            ],
        )
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        logs = Logs(aws_provider)
        assert len(logs.metric_filters) == 1
        assert logs.metric_filters[0].log_group is None
        assert logs.metric_filters[0].name == "test-filter"
        assert logs.metric_filters[0].metric == "my-metric"
        assert logs.metric_filters[0].pattern == "test-pattern"
        assert logs.metric_filters[0].region == AWS_REGION_US_EAST_1

    # Test Logs Filters
    @mock_aws
    def test_describe_log_groups(self):
        # Logs client for this test class
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        logs_client.create_log_group(
            logGroupName="/log-group/test",
            kmsKeyId="test_kms_id",
            tags={"tag_key_1": "tag_value_1", "tag_key_2": "tag_value_2"},
        )
        logs_client.put_retention_policy(
            logGroupName="/log-group/test", retentionInDays=400
        )
        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        arn = f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*"
        logs = Logs(aws_provider)
        assert len(logs.log_groups) == 1
        assert arn in logs.log_groups
        assert logs.log_groups[arn].name == "/log-group/test"
        assert logs.log_groups[arn].retention_days == 400
        assert logs.log_groups[arn].kms_id == "test_kms_id"
        assert not logs.log_groups[arn].never_expire
        assert logs.log_groups[arn].region == AWS_REGION_US_EAST_1
        assert logs.log_groups[arn].tags == [{}]

    @mock_aws
    def test_describe_log_groupsnever_expire(self):
        # Logs client for this test class
        logs_client = client("logs", region_name=AWS_REGION_US_EAST_1)
        logs_client.create_log_group(
            logGroupName="/log-group/test",
            kmsKeyId="test_kms_id",
            tags={"tag_key_1": "tag_value_1", "tag_key_2": "tag_value_2"},
        )

        aws_provider = set_mocked_aws_provider(
            expected_checks=["cloudwatch_log_group_no_secrets_in_logs"]
        )
        arn = f"arn:aws:logs:{AWS_REGION_US_EAST_1}:{AWS_ACCOUNT_NUMBER}:log-group:/log-group/test:*"
        logs = Logs(aws_provider)
        assert len(logs.log_groups) == 1
        assert arn in logs.log_groups
        assert logs.log_groups[arn].name == "/log-group/test"
        assert logs.log_groups[arn].never_expire
        # Since it never expires we don't use the retention_days
        assert logs.log_groups[arn].retention_days == 9999
        assert logs.log_groups[arn].kms_id == "test_kms_id"
        assert logs.log_groups[arn].region == AWS_REGION_US_EAST_1
        assert logs.log_groups[arn].tags == [{}]
```

--------------------------------------------------------------------------------

````
