---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 583
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 583 of 867)

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

---[FILE: privilege_escalation_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/lib/privilege_escalation_test.py

```python
from prowler.providers.aws.services.iam.lib.privilege_escalation import (
    check_privilege_escalation,
    privilege_escalation_policies_combination,
)


# Helper function to parse the output string into a set for easier comparison
def parse_result_string(result_str: str) -> set:
    """Helper to parse the output string back into a set."""
    if not result_str:
        return set()
    # Removes the single quotes around each action and splits by comma+space
    return set(part.strip("'") for part in result_str.split(", "))


class Test_PrivilegeEscalation:
    def test_check_privilege_escalation_no_priv_escalation(self):
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": ["s3:GetObject"],
                    "Resource": ["arn:aws:s3:::example_bucket/*"],
                }
            ],
        }
        expected_result = ""
        assert check_privilege_escalation(policy) == expected_result

    def test_check_privilege_escalation_priv_escalation_iam_all_and_ec2_RunInstances(
        self,
    ):
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": ["iam:*"],
                    "Resource": ["*"],
                },
                {
                    "Effect": "Deny",
                    "Action": ["ec2:RunInstances"],  # This denies one part of a combo
                    "Resource": ["*"],
                },
            ],
        }
        # Should match all IAM combos, but NOT PassRole+EC2
        result = check_privilege_escalation(policy)
        assert "ec2:RunInstances" not in result
        assert "iam:Put*" in result
        assert "iam:AddUserToGroup" in result
        assert "iam:AttachRolePolicy" in result
        assert "iam:CreateLoginProfile" in result
        assert "iam:CreateAccessKey" in result
        assert "iam:AttachGroupPolicy" in result
        assert "iam:SetDefaultPolicyVersion" in result
        assert "iam:PutRolePolicy" in result
        assert "iam:UpdateAssumeRolePolicy" in result
        assert "iam:*" in result
        assert "iam:PutGroupPolicy" in result
        assert "iam:PutUserPolicy" in result
        assert "iam:CreatePolicyVersion" in result
        assert "iam:AttachUserPolicy" in result
        assert "iam:UpdateLoginProfile" in result

    def test_check_privilege_escalation_priv_escalation_iam_PassRole(self):
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": ["iam:PassRole"],
                    "Resource": ["*"],
                }
            ],
        }
        result = check_privilege_escalation(policy)
        assert result == ""

    def test_check_privilege_escalation_priv_escalation_iam_wildcard(
        self,
    ):
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "iam:*"
                    ],  # Should expand to include multiple IAM actions
                    "Resource": ["*"],
                }
            ],
        }
        result = check_privilege_escalation(policy)
        # iam:* should expand to include PutUserPolicy and other privilege escalation actions
        assert "iam:PutUserPolicy" in result

    def test_check_privilege_escalation_priv_escalation_not_action(
        self,
    ):
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "Statement1",
                    "Effect": "Allow",
                    "NotAction": "iam:Put*",  # Allows everything EXCEPT iam:Put* actions
                    "Resource": "*",
                }
            ],
        }
        # Should match all combos EXCEPT those requiring iam:Put*
        result = check_privilege_escalation(policy)
        assert "iam:*" not in result
        assert "iam:Put*" not in result
        assert "'iam:PutGroupPolicy'" not in result
        assert "iam:AddUserToGroup" in result
        assert "iam:AttachRolePolicy" in result
        assert "iam:CreateLoginProfile" in result
        assert "iam:CreateAccessKey" in result
        assert "iam:AttachGroupPolicy" in result
        assert "iam:SetDefaultPolicyVersion" in result
        assert "iam:UpdateAssumeRolePolicy" in result
        assert "iam:CreatePolicyVersion" in result
        assert "iam:AttachUserPolicy" in result
        assert "iam:UpdateLoginProfile" in result

    def test_check_privilege_escalation_priv_escalation_with_invalid_not_action(
        self,
    ):
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "Statement1",
                    "Effect": "Allow",
                    "NotAction": "prowler:action",  # Invalid action -> Allows ALL
                    "Resource": "*",
                }
            ],
        }
        # Since it allows ALL, expect all original patterns from ALL combos
        result = check_privilege_escalation(policy)
        for combo_patterns in privilege_escalation_policies_combination.values():
            for pattern in combo_patterns:
                assert (
                    f"'{pattern}'" in result
                ), f"Expected pattern '{pattern}' not found in result: {result}"

    def test_check_privilege_escalation_administrator_policy(self):
        policy_document_admin = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "Statement01",
                    "Effect": "Allow",
                    "Action": ["*"],  # Admin policy
                    "Resource": "*",
                }
            ],
        }
        # Admin policy should match ALL combos, so expect all original patterns
        result = check_privilege_escalation(policy_document_admin)
        for combo_patterns in privilege_escalation_policies_combination.values():
            for pattern in combo_patterns:
                assert (
                    f"'{pattern}'" in result
                ), f"Expected pattern '{pattern}' not found in result: {result}"
```

--------------------------------------------------------------------------------

---[FILE: inspector2_service_test.py]---
Location: prowler-master/tests/providers/aws/services/inspector2/inspector2_service_test.py

```python
from datetime import datetime
from unittest.mock import patch

import botocore

from prowler.providers.aws.services.inspector2.inspector2_service import Inspector2
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

FINDING_ARN = (
    "arn:aws:inspector2:us-east-1:123456789012:finding/0e436649379db5f327e3cf5bb4421d76"
)

# Mocking Calls
make_api_call = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwargs):
    """We have to mock every AWS API call using Boto3"""
    if operation_name == "BatchGetAccountStatus":
        return {
            "accounts": [
                {
                    "accountId": AWS_ACCOUNT_NUMBER,
                    "resourceState": {
                        "ec2": {
                            "errorCode": "ALREADY_ENABLED",
                            "errorMessage": "string",
                            "status": "ENABLED",
                        },
                        "ecr": {
                            "errorCode": "ALREADY_ENABLED",
                            "errorMessage": "string",
                            "status": "ENABLED",
                        },
                        "lambda": {
                            "errorCode": "ALREADY_ENABLED",
                            "errorMessage": "string",
                            "status": "ENABLED",
                        },
                        "lambdaCode": {
                            "errorCode": "ALREADY_ENABLED",
                            "errorMessage": "string",
                            "status": "ENABLED",
                        },
                    },
                    "state": {
                        "errorCode": "ALREADY_ENABLED",
                        "errorMessage": "string",
                        "status": "ENABLED",
                    },
                }
            ]
        }
    if operation_name == "ListFindings":
        return {
            "findings": [
                {
                    "awsAccountId": AWS_ACCOUNT_NUMBER,
                    "findingArn": FINDING_ARN,
                    "description": "Finding Description",
                    "severity": "MEDIUM",
                    "status": "ACTIVE",
                    "title": "CVE-2022-40897 - setuptools",
                    "type": "PACKAGE_VULNERABILITY",
                    "updatedAt": datetime(2024, 1, 1),
                }
            ]
        }

    return make_api_call(self, operation_name, kwargs)


def mock_generate_regional_clients(provider, service):
    regional_client = provider._session.current_session.client(
        service, region_name=AWS_REGION_EU_WEST_1
    )
    regional_client.region = AWS_REGION_EU_WEST_1
    return {AWS_REGION_EU_WEST_1: regional_client}


# Patch every AWS call using Boto3 and generate_regional_clients to have 1 client
@patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
@patch(
    "prowler.providers.aws.aws_provider.AwsProvider.generate_regional_clients",
    new=mock_generate_regional_clients,
)
class Test_Inspector2_Service:
    def test_get_client(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2 = Inspector2(aws_provider)
        assert (
            inspector2.regional_clients[AWS_REGION_EU_WEST_1].__class__.__name__
            == "Inspector2"
        )

    def test__get_service__(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2 = Inspector2(aws_provider)
        assert inspector2.service == "inspector2"

    def test_batch_get_account_status(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2 = Inspector2(aws_provider)
        assert len(inspector2.inspectors) == 1
        assert inspector2.inspectors[0].id == "Inspector2"
        assert inspector2.inspectors[0].region == AWS_REGION_EU_WEST_1
        assert inspector2.inspectors[0].status == "ENABLED"
        assert inspector2.inspectors[0].ec2_status == "ENABLED"
        assert inspector2.inspectors[0].ecr_status == "ENABLED"
        assert inspector2.inspectors[0].lambda_status == "ENABLED"
        assert inspector2.inspectors[0].lambda_code_status == "ENABLED"

    def test_list_active_findings(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2 = Inspector2(aws_provider)
        assert inspector2.inspectors[0].active_findings
```

--------------------------------------------------------------------------------

---[FILE: inspector2_active_findings_exist_test.py]---
Location: prowler-master/tests/providers/aws/services/inspector2/inspector2_active_findings_exist/inspector2_active_findings_exist_test.py

```python
from unittest import mock

from prowler.providers.aws.services.inspector2.inspector2_service import Inspector
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)

FINDING_ARN = (
    "arn:aws:inspector2:us-east-1:123456789012:finding/0e436649379db5f327e3cf5bb4421d76"
)


class Test_inspector2_active_findings_exist:
    def test_enabled_no_finding(self):
        # Mock the inspector2 client
        inspector2_client = mock.MagicMock

        inspector2_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2_client.audited_account = AWS_ACCOUNT_NUMBER
        inspector2_client.audited_account_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        inspector2_client.region = AWS_REGION_EU_WEST_1
        inspector2_client.inspectors = [
            Inspector(
                id=AWS_ACCOUNT_NUMBER,
                arn=f"arn:aws:inspector2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:inspector2",
                status="ENABLED",
                ec2_status="ENABLED",
                ecr_status="DISABLED",
                lambda_status="DISABLED",
                lambda_code_status="ENABLED",
                region=AWS_REGION_EU_WEST_1,
                active_findings=False,
            )
        ]
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist.inspector2_client",
                new=inspector2_client,
            ):
                # Test Check
                from prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist import (
                    inspector2_active_findings_exist,
                )

                check = inspector2_active_findings_exist()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Inspector2 is enabled with no active findings."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == f"arn:aws:inspector2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:inspector2"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_enabled_with_no_active_finding(self):
        # Mock the inspector2 client
        inspector2_client = mock.MagicMock

        inspector2_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2_client.audited_account = AWS_ACCOUNT_NUMBER
        inspector2_client.audited_account_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        inspector2_client.region = AWS_REGION_EU_WEST_1
        inspector2_client.inspectors = [
            Inspector(
                id=AWS_ACCOUNT_NUMBER,
                arn=f"arn:aws:inspector2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:inspector2",
                region=AWS_REGION_EU_WEST_1,
                status="ENABLED",
                ec2_status="ENABLED",
                ecr_status="DISABLED",
                lambda_status="DISABLED",
                lambda_code_status="ENABLED",
                active_findings=False,
            )
        ]
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist.inspector2_client",
                new=inspector2_client,
            ):
                # Test Check
                from prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist import (
                    inspector2_active_findings_exist,
                )

                check = inspector2_active_findings_exist()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "Inspector2 is enabled with no active findings."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == f"arn:aws:inspector2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:inspector2"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_enabled_with_active_finding(self):
        # Mock the inspector2 client
        inspector2_client = mock.MagicMock

        inspector2_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2_client.audited_account = AWS_ACCOUNT_NUMBER
        inspector2_client.audited_account_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        inspector2_client.region = AWS_REGION_EU_WEST_1
        inspector2_client.inspectors = [
            Inspector(
                id=AWS_ACCOUNT_NUMBER,
                arn=f"arn:aws:inspector2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:inspector2",
                region=AWS_REGION_EU_WEST_1,
                status="ENABLED",
                ec2_status="ENABLED",
                ecr_status="DISABLED",
                lambda_status="DISABLED",
                lambda_code_status="ENABLED",
                active_findings=True,
            )
        ]
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist.inspector2_client",
                new=inspector2_client,
            ):
                # Test Check
                from prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist import (
                    inspector2_active_findings_exist,
                )

                check = inspector2_active_findings_exist()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended == "There are active Inspector2 findings."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == f"arn:aws:inspector2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:inspector2"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_enabled_with_none_finding(self):
        # Mock the inspector2 client
        inspector2_client = mock.MagicMock

        inspector2_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2_client.audited_account = AWS_ACCOUNT_NUMBER
        inspector2_client.audited_account_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        inspector2_client.region = AWS_REGION_EU_WEST_1
        inspector2_client.inspectors = [
            Inspector(
                id=AWS_ACCOUNT_NUMBER,
                arn=f"arn:aws:inspector2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:inspector2",
                region=AWS_REGION_EU_WEST_1,
                status="ENABLED",
                ec2_status="ENABLED",
                ecr_status="DISABLED",
                lambda_status="DISABLED",
                lambda_code_status="ENABLED",
                active_findings=None,
            )
        ]
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist.inspector2_client",
                new=inspector2_client,
            ):
                # Test Check
                from prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist import (
                    inspector2_active_findings_exist,
                )

                check = inspector2_active_findings_exist()
                result = check.execute()

                assert len(result) == 0

    def test_inspector2_disabled_ignoring(self):
        # Mock the inspector2 client
        inspector2_client = mock.MagicMock
        awslambda_client = mock.MagicMock
        awslambda_client.functions = {}
        ecr_client = mock.MagicMock
        ecr_client.registries = {}
        ecr_client.registries[AWS_REGION_EU_WEST_1] = mock.MagicMock
        ecr_client.registries[AWS_REGION_EU_WEST_1].repositories = []
        ec2_client = mock.MagicMock
        ec2_client.instances = []
        ec2_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        ecr_client.provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        awslambda_client.aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2_client.aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        inspector2_client.provider._scan_unused_services = False
        inspector2_client.audited_account = AWS_ACCOUNT_NUMBER
        inspector2_client.audited_account_arn = (
            f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"
        )
        inspector2_client.region = AWS_REGION_EU_WEST_1
        inspector2_client.inspectors = [
            Inspector(
                id=AWS_ACCOUNT_NUMBER,
                arn=f"arn:aws:inspector2:{AWS_REGION_EU_WEST_1}:{AWS_ACCOUNT_NUMBER}:inspector2",
                status="DISABLED",
                ec2_status="ENABLED",
                ecr_status="DISABLED",
                lambda_status="DISABLED",
                lambda_code_status="ENABLED",
                region=AWS_REGION_EU_WEST_1,
                active_findings=False,
            )
        ]
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist.inspector2_client",
                new=inspector2_client,
            ):
                # Test Check
                from prowler.providers.aws.services.inspector2.inspector2_active_findings_exist.inspector2_active_findings_exist import (
                    inspector2_active_findings_exist,
                )

                check = inspector2_active_findings_exist()
                result = check.execute()

                assert len(result) == 0
```

--------------------------------------------------------------------------------

````
