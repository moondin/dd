---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 572
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 572 of 867)

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

---[FILE: iam_inline_policy_no_full_access_to_kms_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_inline_policy_no_full_access_to_kms/iam_inline_policy_no_full_access_to_kms_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import IAM
from tests.providers.aws.utils import (
    ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_iam_inline_policy_no_full_access_to_kms:
    @mock_aws
    def test_policy_full_access_to_kms_with_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "kms:*", "Resource": "*"},
            ],
        }
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(policy_document_full_access),
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms import (
                iam_inline_policy_no_full_access_to_kms,
            )

            check = iam_inline_policy_no_full_access_to_kms()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} allows 'kms:*' privileges."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"

    @mock_aws
    def test_policy_no_full_access_to_kms_with_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_no_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "ec2:*", "Resource": "*"},
            ],
        }
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(policy_document_full_access),
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms import (
                iam_inline_policy_no_full_access_to_kms,
            )

            check = iam_inline_policy_no_full_access_to_kms()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} does not allow 'kms:*' privileges."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"

    @mock_aws
    def test_policy_full_access_to_kms_with_no_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "NotAction": ["ec2:*", "s3:*"], "Resource": "*"},
            ],
        }
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(policy_document_full_access),
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms import (
                iam_inline_policy_no_full_access_to_kms,
            )

            check = iam_inline_policy_no_full_access_to_kms()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} allows 'kms:*' privileges."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"

    @mock_aws
    def test_policy_no_full_access_to_kms_with_no_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_no_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "NotAction": ["ec2:*", "s3:*", "kms:*"],
                    "Resource": "*",
                },
            ],
        }
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(policy_document_full_access),
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms import (
                iam_inline_policy_no_full_access_to_kms,
            )

            check = iam_inline_policy_no_full_access_to_kms()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} does not allow 'kms:*' privileges."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"

    @mock_aws
    def test_policy_full_access_to_kms_with_multiple_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": ["kms:*", "s3:*", "ec2:*"],
                    "Resource": "*",
                },
            ],
        }
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(policy_document_full_access),
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_kms.iam_inline_policy_no_full_access_to_kms import (
                iam_inline_policy_no_full_access_to_kms,
            )

            check = iam_inline_policy_no_full_access_to_kms()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} allows 'kms:*' privileges."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"
```

--------------------------------------------------------------------------------

---[FILE: iam_no_custom_policy_permissive_role_assumption_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_no_custom_policy_permissive_role_assumption/iam_no_custom_policy_permissive_role_assumption_test.py

```python
from json import dumps
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_no_custom_policy_permissive_role_assumption:
    @mock_aws
    def test_policy_allows_permissive_role_assumption_wildcard(self):
        iam_client = client("iam")
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "sts:*", "Resource": "*"},
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert search(
                    f"Custom Policy {policy_name} allows permissive STS Role assumption",
                    result[0].status_extended,
                )
                assert result[0].resource_arn == arn
                assert result[0].resource_id == policy_name

    @mock_aws
    def test_policy_allows_permissive_role_assumption_no_wilcard(self):
        iam_client = client("iam")
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "sts:AssumeRole", "Resource": "*"},
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert search(
                    f"Custom Policy {policy_name} allows permissive STS Role assumption",
                    result[0].status_extended,
                )
                assert result[0].resource_arn == arn
                assert result[0].resource_id == policy_name

    @mock_aws
    def test_policy_assume_role_not_allow_permissive_role_assumption(self):
        iam_client = client("iam")
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "sts:AssumeRole",
                    "Resource": "arn:aws:iam::123456789012:user/JohnDoe",
                },
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert result[0].status == "PASS"
                assert search(
                    f"Custom Policy {policy_name} does not allow permissive STS Role assumption",
                    result[0].status_extended,
                )
                assert result[0].resource_arn == arn
                assert result[0].resource_id == policy_name

    @mock_aws
    def test_policy_not_allow_permissive_role_assumption(self):
        iam_client = client("iam")
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:CreateLogGroup", "Resource": "*"},
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert result[0].status == "PASS"
                assert search(
                    f"Custom Policy {policy_name} does not allow permissive STS Role assumption",
                    result[0].status_extended,
                )
                assert result[0].resource_arn == arn
                assert result[0].resource_id == policy_name

    @mock_aws
    def test_policy_permissive_and_not_permissive(self):
        iam_client = client("iam")
        policy_name_non_permissive = "policy1"
        policy_document_non_permissive = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:*", "Resource": "*"},
            ],
        }
        policy_name_permissive = "policy2"
        policy_document_permissive = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "sts:AssumeRole", "Resource": "*"},
            ],
        }
        arn_non_permissive = iam_client.create_policy(
            PolicyName=policy_name_non_permissive,
            PolicyDocument=dumps(policy_document_non_permissive),
        )["Policy"]["Arn"]
        arn_permissive = iam_client.create_policy(
            PolicyName=policy_name_permissive,
            PolicyDocument=dumps(policy_document_permissive),
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert len(result) == 2
                assert result[0].status == "PASS"
                assert result[0].resource_arn == arn_non_permissive
                assert search(
                    f"Policy {policy_name_non_permissive} does not allow permissive STS Role assumption",
                    result[0].status_extended,
                )
                assert result[0].resource_id == policy_name_non_permissive
                assert result[1].status == "FAIL"
                assert result[1].resource_arn == arn_permissive
                assert search(
                    f"Policy {policy_name_permissive} allows permissive STS Role assumption",
                    result[1].status_extended,
                )
                assert result[1].resource_id == policy_name_permissive

    @mock_aws
    def test_policy_resource_with_embedded_wildcard_in_arn(self):
        iam_client = client("iam")
        policy_name = "policy_with_wildcard_in_arn"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "sts:AssumeRole",
                    "Resource": "arn:aws:iam::*:role/eks-terraform-*",
                }
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert result[0].resource_arn == arn
                assert search(
                    "allows permissive STS Role assumption", result[0].status_extended
                )
                assert result[0].resource_id == policy_name

    @mock_aws
    def test_policy_resource_list_containing_wildcard(self):
        iam_client = client("iam")
        policy_name = "policy_with_resource_list"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "sts:AssumeRole",
                    "Resource": ["arn:aws:iam::123456789012:role/SomeRole", "*"],
                }
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert result[0].resource_arn == arn
                assert search(
                    "allows permissive STS Role assumption", result[0].status_extended
                )
                assert result[0].resource_id == policy_name

    @mock_aws
    def test_policy_resource_list_with_arn_wildcards_should_fail(self):
        iam_client = client("iam")
        policy_name = "policy_list_wildcard_arn"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "sts:AssumeRole",
                    "Resource": [
                        "arn:aws:iam::123456789012:role/eks-admin",
                        "arn:aws:iam::*:role/eks-*",
                    ],
                }
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert result[0].resource_arn == arn
                assert search(
                    "allows permissive STS Role assumption", result[0].status_extended
                )

    @mock_aws
    def test_policy_resource_list_with_only_wildcarded_arns_should_fail(self):
        iam_client = client("iam")
        policy_name = "policy_list_scoped_wildcards_only"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "sts:AssumeRole",
                    "Resource": [
                        "arn:aws:iam::*:role/team-*",
                        "arn:aws:iam::*:role/dev-*",
                    ],
                }
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_custom_policy_permissive_role_assumption.iam_no_custom_policy_permissive_role_assumption import (
                    iam_no_custom_policy_permissive_role_assumption,
                )

                check = iam_no_custom_policy_permissive_role_assumption()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert result[0].resource_arn == arn
                assert search(
                    "allows permissive STS Role assumption", result[0].status_extended
                )
```

--------------------------------------------------------------------------------

---[FILE: iam_no_expired_server_certificates_stored_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_no_expired_server_certificates_stored/iam_no_expired_server_certificates_stored_test.py

```python
from re import search
from unittest import mock

import botocore
from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

# Original botocore _make_api_call function
orig = botocore.client.BaseClient._make_api_call


# Mocked botocore _make_api_call function
def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "ListServerCertificateTags":
        return {"Tags": [{"Key": "Name", "Value": "certname"}]}
    # If we don't want to patch the API call
    return orig(self, operation_name, kwarg)


class Test_iam_no_expired_server_certificates_stored_test:
    @mock_aws
    def test_no_certificates(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_expired_server_certificates_stored.iam_no_expired_server_certificates_stored.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_expired_server_certificates_stored.iam_no_expired_server_certificates_stored import (
                    iam_no_expired_server_certificates_stored,
                )

                check = iam_no_expired_server_certificates_stored()
                result = check.execute()

                assert len(result) == 0

    @mock.patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call)
    @mock_aws
    def test_expired_certificate(self):
        iam_client = client("iam")
        # moto creates an expired certificate by default
        cert = iam_client.upload_server_certificate(
            ServerCertificateName="certname",
            CertificateBody="certbody",
            PrivateKey="privatekey",
            Tags=[{"Key": "Name", "Value": "certname"}],
        )["ServerCertificateMetadata"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_no_expired_server_certificates_stored.iam_no_expired_server_certificates_stored.iam_client",
                new=IAM(aws_provider),
            ):
                from prowler.providers.aws.services.iam.iam_no_expired_server_certificates_stored.iam_no_expired_server_certificates_stored import (
                    iam_no_expired_server_certificates_stored,
                )

                check = iam_no_expired_server_certificates_stored()
                result = check.execute()

                assert len(result) == 1

                assert result[0].status == "FAIL"
                assert search(
                    "IAM Certificate certname has expired", result[0].status_extended
                )
                assert result[0].resource_id == cert["ServerCertificateId"]
                assert result[0].resource_arn == cert["Arn"]
                assert result[0].resource_tags == [{"Key": "Name", "Value": "certname"}]
                assert result[0].region == AWS_REGION_US_EAST_1
```

--------------------------------------------------------------------------------

````
