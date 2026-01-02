---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 576
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 576 of 867)

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

---[FILE: iam_policy_attached_only_to_group_or_roles_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_policy_attached_only_to_group_or_roles/iam_policy_attached_only_to_group_or_roles_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_US_EAST_1,
    set_mocked_aws_provider,
)


class Test_iam_policy_attached_only_to_group_or_roles:
    @mock_aws
    def test_iam_user_attached_policy(self):
        result = []
        iam_client = client("iam")
        user = "test_attached_policy"
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:CreateLogGroup", "Resource": "*"},
            ],
        }
        iam_client.create_user(UserName=user)
        policyArn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]
        iam_client.attach_user_policy(UserName=user, PolicyArn=policyArn)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_attached_only_to_group_or_roles.iam_policy_attached_only_to_group_or_roles.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_policy_attached_only_to_group_or_roles.iam_policy_attached_only_to_group_or_roles import (
                iam_policy_attached_only_to_group_or_roles,
            )

            check = iam_policy_attached_only_to_group_or_roles()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {user} has the policy {policy_name} attached."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == f"{user}/{policy_name}"
            assert (
                result[0].resource_arn
                == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/{user}"
            )

    @mock_aws
    def test_iam_user_attached_and_inline_policy(self):
        result = []
        iam_client = client("iam")
        user = "test_inline_policy"
        policyName = "policy1"
        policyDocument = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:CreateLogGroup", "Resource": "*"},
            ],
        }
        iam_client.create_user(UserName=user)
        iam_client.put_user_policy(
            UserName=user, PolicyName=policyName, PolicyDocument=dumps(policyDocument)
        )
        policyArn = iam_client.create_policy(
            PolicyName=policyName, PolicyDocument=dumps(policyDocument)
        )["Policy"]["Arn"]
        iam_client.attach_user_policy(UserName=user, PolicyArn=policyArn)

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_attached_only_to_group_or_roles.iam_policy_attached_only_to_group_or_roles.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_policy_attached_only_to_group_or_roles.iam_policy_attached_only_to_group_or_roles import (
                iam_policy_attached_only_to_group_or_roles,
            )

            check = iam_policy_attached_only_to_group_or_roles()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {user} has the policy {policyName} attached."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == f"{user}/{policyName}"

            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {user} has the policy {policyName} attached."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == f"{user}/{policyName}"
            assert (
                result[0].resource_arn
                == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/{user}"
            )

    @mock_aws
    def test_iam_user_inline_policy(self):
        result = []
        iam_client = client("iam")
        user = "test_attached_inline_policy"
        policyName = "policy1"
        policyDocument = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:CreateLogGroup", "Resource": "*"},
            ],
        }
        iam_client.create_user(UserName=user)
        iam_client.put_user_policy(
            UserName=user, PolicyName=policyName, PolicyDocument=dumps(policyDocument)
        )

        # Tag the user
        iam_client.tag_user(UserName=user, Tags=[{"Key": "tag1", "Value": "value1"}])

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_attached_only_to_group_or_roles.iam_policy_attached_only_to_group_or_roles.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_policy_attached_only_to_group_or_roles.iam_policy_attached_only_to_group_or_roles import (
                iam_policy_attached_only_to_group_or_roles,
            )

            check = iam_policy_attached_only_to_group_or_roles()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"User {user} has the inline policy {policyName} attached."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == f"{user}/{policyName}"
            assert (
                result[0].resource_arn
                == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/{user}"
            )
            assert result[0].resource_tags == [{"Key": "tag1", "Value": "value1"}]

    @mock_aws
    def test_iam_user_no_policies(self):
        result = []
        iam_client = client("iam")
        user = "test_no_policies"
        iam_client.create_user(UserName=user)

        # Tag the user
        iam_client.tag_user(UserName=user, Tags=[{"Key": "tag1", "Value": "value1"}])

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_attached_only_to_group_or_roles.iam_policy_attached_only_to_group_or_roles.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_policy_attached_only_to_group_or_roles.iam_policy_attached_only_to_group_or_roles import (
                iam_policy_attached_only_to_group_or_roles,
            )

            check = iam_policy_attached_only_to_group_or_roles()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"User {user} has no inline or attached policies."
            )
            assert result[0].region == AWS_REGION_US_EAST_1
            assert result[0].resource_id == user
            assert (
                result[0].resource_arn
                == f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:user/{user}"
            )
            assert result[0].resource_tags == [{"Key": "tag1", "Value": "value1"}]
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_cloudshell_admin_not_attached_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_policy_cloudshell_admin_not_attached/iam_policy_cloudshell_admin_not_attached_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import IAM
from tests.providers.aws.utils import (
    AWS_ACCOUNT_NUMBER,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


class Test_iam_policy_cloudshell_admin_not_attached:
    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached.iam_client",
                new=IAM(aws_provider),
            ) as service_client,
        ):
            from prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached import (
                iam_policy_cloudshell_admin_not_attached,
            )

            service_client.entities_attached_to_cloudshell_policy = None

            check = iam_policy_cloudshell_admin_not_attached()
            result = check.execute()
            assert len(result) == 0

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_nocloudshell_policy(self):
        iam = client("iam")
        role_name = "test_nocloudshell_policy"
        role_policy = {
            "Version": "2012-10-17",
        }
        iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(role_policy),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/SecurityAudit",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached import (
                    iam_policy_cloudshell_admin_not_attached,
                )

                check = iam_policy_cloudshell_admin_not_attached()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "AWS CloudShellFullAccess policy is not attached to any IAM entity."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::aws:policy/AWSCloudShellFullAccess"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_role_cloudshell_policy(self):
        iam = client("iam")
        role_name = "test_cloudshell_policy_role"
        role_policy = {
            "Version": "2012-10-17",
        }
        iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(role_policy),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/AWSCloudShellFullAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached import (
                    iam_policy_cloudshell_admin_not_attached,
                )

                check = iam_policy_cloudshell_admin_not_attached()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"AWS CloudShellFullAccess policy attached to IAM Roles: {role_name}."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::aws:policy/AWSCloudShellFullAccess"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_user_cloudshell_policy(self):
        iam = client("iam")
        user_name = "test_cloudshell_policy_user"
        iam.create_user(
            UserName=user_name,
        )
        iam.attach_user_policy(
            UserName=user_name,
            PolicyArn="arn:aws:iam::aws:policy/AWSCloudShellFullAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached import (
                    iam_policy_cloudshell_admin_not_attached,
                )

                check = iam_policy_cloudshell_admin_not_attached()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"AWS CloudShellFullAccess policy attached to IAM Users: {user_name}."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::aws:policy/AWSCloudShellFullAccess"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_group_cloudshell_policy(self):
        iam = client("iam")
        group_name = "test_cloudshell_policy_group"
        iam.create_group(
            GroupName=group_name,
        )
        iam.attach_group_policy(
            GroupName=group_name,
            PolicyArn="arn:aws:iam::aws:policy/AWSCloudShellFullAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached import (
                    iam_policy_cloudshell_admin_not_attached,
                )

                check = iam_policy_cloudshell_admin_not_attached()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"AWS CloudShellFullAccess policy attached to IAM Groups: {group_name}."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::aws:policy/AWSCloudShellFullAccess"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_user_role_group_cloudshell_policy(self):
        iam = client("iam")
        user_name = "test_cloudshell_policy_user"
        iam.create_user(
            UserName=user_name,
        )
        iam.attach_user_policy(
            UserName=user_name,
            PolicyArn="arn:aws:iam::aws:policy/AWSCloudShellFullAccess",
        )
        group_name = "test_cloudshell_policy_group"
        iam.create_group(
            GroupName=group_name,
        )
        iam.attach_group_policy(
            GroupName=group_name,
            PolicyArn="arn:aws:iam::aws:policy/AWSCloudShellFullAccess",
        )
        role_name = "test_cloudshell_policy_role"
        role_policy = {
            "Version": "2012-10-17",
        }
        iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(role_policy),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/AWSCloudShellFullAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_cloudshell_admin_not_attached.iam_policy_cloudshell_admin_not_attached import (
                    iam_policy_cloudshell_admin_not_attached,
                )

                check = iam_policy_cloudshell_admin_not_attached()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"AWS CloudShellFullAccess policy attached to IAM Users: {user_name}, Groups: {group_name}, Roles: {role_name}."
                )
                assert result[0].resource_id == AWS_ACCOUNT_NUMBER
                assert (
                    result[0].resource_arn
                    == "arn:aws:iam::aws:policy/AWSCloudShellFullAccess"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_no_full_access_to_cloudtrail_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_policy_no_full_access_to_cloudtrail/iam_policy_no_full_access_to_cloudtrail_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import IAM
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_policy_no_full_access_to_cloudtrail:
    @mock_aws
    def test_policy_full_access_to_cloudtrail(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam", region_name=AWS_REGION_US_EAST_1)
        policy_name = "policy_cloudtrail_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "cloudtrail:*", "Resource": "*"},
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document_full_access)
        )["Policy"]["Arn"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail import (
                    iam_policy_no_full_access_to_cloudtrail,
                )

                check = iam_policy_no_full_access_to_cloudtrail()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} allows 'cloudtrail:*' privileges."
                )
                assert result[0].resource_id == "policy_cloudtrail_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_no_full_access_to_cloudtrail(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam", region_name=AWS_REGION_US_EAST_1)
        policy_name = "policy_no_cloudtrail_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "ec2:*", "Resource": "*"},
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document_full_access)
        )["Policy"]["Arn"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail import (
                    iam_policy_no_full_access_to_cloudtrail,
                )

                check = iam_policy_no_full_access_to_cloudtrail()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} does not allow 'cloudtrail:*' privileges."
                )
                assert result[0].resource_id == "policy_no_cloudtrail_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_mixed(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam", region_name=AWS_REGION_US_EAST_1)
        policy_name = "policy_mixed"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": ["ec2:*", "cloudtrail:*"],
                    "Resource": "*",
                },
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document_full_access)
        )["Policy"]["Arn"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail import (
                    iam_policy_no_full_access_to_cloudtrail,
                )

                check = iam_policy_no_full_access_to_cloudtrail()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} allows 'cloudtrail:*' privileges."
                )
                assert result[0].resource_id == "policy_mixed"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_full_access_to_cloudtrail_through_no_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam", region_name=AWS_REGION_US_EAST_1)
        policy_name = "policy_cloudtrail_full_no_actions"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "NotAction": ["ec2:*", "s3:*"], "Resource": "*"},
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document_full_access)
        )["Policy"]["Arn"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail import (
                    iam_policy_no_full_access_to_cloudtrail,
                )

                check = iam_policy_no_full_access_to_cloudtrail()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} allows 'cloudtrail:*' privileges."
                )
                assert result[0].resource_id == "policy_cloudtrail_full_no_actions"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_no_full_access_to_cloudtrail_through_no_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam", region_name=AWS_REGION_US_EAST_1)
        policy_name = "policy_no_cloudtrail_full_no_actions"
        policy_document_no_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "NotAction": ["cloudtrail:*"], "Resource": "*"},
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document_no_full_access)
        )["Policy"]["Arn"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_cloudtrail.iam_policy_no_full_access_to_cloudtrail import (
                    iam_policy_no_full_access_to_cloudtrail,
                )

                check = iam_policy_no_full_access_to_cloudtrail()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} does not allow 'cloudtrail:*' privileges."
                )
                assert result[0].resource_id == "policy_no_cloudtrail_full_no_actions"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"
```

--------------------------------------------------------------------------------

````
