---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 571
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 571 of 867)

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

---[FILE: iam_inline_policy_no_administrative_privileges_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_inline_policy_no_administrative_privileges/iam_inline_policy_no_administrative_privileges_test.py

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

INLINE_POLICY_ADMIN = {
    "Version": "2012-10-17",
    "Statement": [{"Effect": "Allow", "Action": ["*"], "Resource": "*"}],
}

INLINE_POLICY_NOT_ADMIN = {
    "Version": "2012-10-17",
    "Statement": [{"Effect": "Allow", "Action": ["s3:GetObject"], "Resource": "*"}],
}

ASSUME_ROLE_POLICY_DOCUMENT = {
    "Version": "2012-10-17",
    "Statement": {
        "Sid": "test",
        "Effect": "Allow",
        "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_NUMBER}:root"},
        "Action": "sts:AssumeRole",
    },
}


class Test_iam_inline_policy_no_administrative_privileges:

    # Groups
    @mock_aws
    def test_groups_no_inline_policies(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM Group
        group_name = "test_group"
        _ = iam_client.create_group(GroupName=group_name)

        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 0

    @mock_aws
    def test_groups_admin_inline_policy(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM Group
        group_name = "test_group"
        group_arn = iam_client.create_group(GroupName=group_name)["Group"]["Arn"]

        # Put Group Policy
        policy_name = "test_admin_inline_policy"
        _ = iam_client.put_group_policy(
            GroupName=group_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(INLINE_POLICY_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1
            assert results[0].region == AWS_REGION_US_EAST_1
            assert results[0].resource_arn == group_arn
            assert results[0].resource_id == f"{group_name}/{policy_name}"
            assert results[0].resource_tags == []
            assert results[0].status == "FAIL"
            assert (
                results[0].status_extended
                == f"Inline policy {policy_name} attached to group {group_name} allows '*:*' administrative privileges."
            )

    @mock_aws
    def test_groups_no_admin_inline_policy(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM Group
        group_name = "test_group"
        group_arn = iam_client.create_group(GroupName=group_name)["Group"]["Arn"]

        # Put Group Policy
        policy_name = "test_not_admin_inline_policy"
        _ = iam_client.put_group_policy(
            GroupName=group_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(INLINE_POLICY_NOT_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1
            assert results[0].region == AWS_REGION_US_EAST_1
            assert results[0].resource_arn == group_arn
            assert results[0].resource_id == f"{group_name}/{policy_name}"
            assert results[0].resource_tags == []
            assert results[0].status == "PASS"
            assert (
                results[0].status_extended
                == f"Inline policy {policy_name} attached to group {group_name} does not allow '*:*' administrative privileges."
            )

    @mock_aws
    def test_groups_admin_and_not_admin_inline_policies(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM Group
        group_name = "test_group"
        group_arn = iam_client.create_group(GroupName=group_name)["Group"]["Arn"]

        # Put Group Policy NOT ADMIN
        policy_name_not_admin = "test_not_admin_inline_policy"
        _ = iam_client.put_group_policy(
            GroupName=group_name,
            PolicyName=policy_name_not_admin,
            PolicyDocument=dumps(INLINE_POLICY_NOT_ADMIN),
        )

        # Put Group Policy ADMIN
        policy_name_admin = "test_admin_inline_policy"
        _ = iam_client.put_group_policy(
            GroupName=group_name,
            PolicyName=policy_name_admin,
            PolicyDocument=dumps(INLINE_POLICY_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 2
            for result in results:
                if result.resource_id == policy_name_admin:
                    assert result.region == AWS_REGION_US_EAST_1
                    assert result.resource_arn == group_arn
                    assert result.resource_id == policy_name_admin
                    assert result.resource_tags == []
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"Inline policy {policy_name_admin} attached to group {group_name} allows '*:*' administrative privileges."
                    )

                elif result.resource_id == policy_name_not_admin:
                    assert result.region == AWS_REGION_US_EAST_1
                    assert result.resource_arn == group_arn
                    assert result.resource_id == policy_name_not_admin
                    assert result.resource_tags == []
                    assert result.status == "PASS"
                    assert (
                        result.status_extended
                        == f"Inline policy {policy_name_not_admin} attached to group {group_name} does not allow '*:*' administrative privileges."
                    )

    # Roles
    @mock_aws
    def test_roles_no_inline_policies(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM Role
        role_name = "test_role"
        _ = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ASSUME_ROLE_POLICY_DOCUMENT),
        )

        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 0

    @mock_aws
    def test_roles_admin_inline_policy(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ASSUME_ROLE_POLICY_DOCUMENT),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "test_admin_inline_policy"
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(INLINE_POLICY_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1
            assert results[0].region == AWS_REGION_US_EAST_1
            assert results[0].resource_arn == role_arn
            assert results[0].resource_id == f"{role_name}/{policy_name}"
            assert results[0].resource_tags == []
            assert results[0].status == "FAIL"
            assert (
                results[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} allows '*:*' administrative privileges."
            )

    @mock_aws
    def test_roles_no_admin_inline_policy(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ASSUME_ROLE_POLICY_DOCUMENT),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "test_not_admin_inline_policy"
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(INLINE_POLICY_NOT_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1
            assert results[0].region == AWS_REGION_US_EAST_1
            assert results[0].resource_arn == role_arn
            assert results[0].resource_id == f"{role_name}/{policy_name}"
            assert results[0].resource_tags == []
            assert results[0].status == "PASS"
            assert (
                results[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} does not allow '*:*' administrative privileges."
            )

    @mock_aws
    def test_roles_admin_and_not_admin_inline_policies(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ASSUME_ROLE_POLICY_DOCUMENT),
        )["Role"]["Arn"]

        # Put Role Policy - NOT ADMIN
        policy_name_not_admin = "test_not_admin_inline_policy"
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name_not_admin,
            PolicyDocument=dumps(INLINE_POLICY_NOT_ADMIN),
        )
        # Put Role Policy - ADMIN
        policy_name_admin = "test_admin_inline_policy"
        _ = iam_client.put_role_policy(
            RoleName=role_name,
            PolicyName=policy_name_admin,
            PolicyDocument=dumps(INLINE_POLICY_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 2
            for result in results:
                if result.resource_id == policy_name_admin:
                    assert result.region == AWS_REGION_US_EAST_1
                    assert result.resource_arn == role_arn
                    assert result.resource_id == policy_name_admin
                    assert result.resource_tags == []
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"Inline policy {policy_name_admin} attached to group {role_name} allows '*:*' administrative privileges."
                    )

                elif result.resource_id == policy_name_not_admin:
                    assert result.region == AWS_REGION_US_EAST_1
                    assert result.resource_arn == role_arn
                    assert result.resource_id == policy_name_not_admin
                    assert result.resource_tags == []
                    assert result.status == "PASS"
                    assert (
                        result.status_extended
                        == f"Inline policy {policy_name_not_admin} attached to group {role_name} does not allow '*:*' administrative privileges."
                    )

    # Users
    @mock_aws
    def test_users_no_inline_policies(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM User
        user_name = "test_user"
        _ = iam_client.create_user(
            UserName=user_name,
        )

        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 0

    @mock_aws
    def test_users_admin_inline_policy(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM User
        user_name = "test_user"
        user_arn = iam_client.create_user(
            UserName=user_name,
        )[
            "User"
        ]["Arn"]

        # Put User Policy
        policy_name = "test_admin_inline_policy"
        _ = iam_client.put_user_policy(
            UserName=user_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(INLINE_POLICY_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1
            assert results[0].region == AWS_REGION_US_EAST_1
            assert results[0].resource_arn == user_arn
            assert results[0].resource_id == f"{user_name}/{policy_name}"
            assert results[0].resource_tags == []
            assert results[0].status == "FAIL"
            assert (
                results[0].status_extended
                == f"Inline policy {policy_name} attached to user {user_name} allows '*:*' administrative privileges."
            )

    @mock_aws
    def test_users_no_admin_inline_policy(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM User
        user_name = "test_user"
        user_arn = iam_client.create_user(
            UserName=user_name,
        )[
            "User"
        ]["Arn"]

        # Put User Policy
        policy_name = "test_not_admin_inline_policy"
        _ = iam_client.put_user_policy(
            UserName=user_name,
            PolicyName=policy_name,
            PolicyDocument=dumps(INLINE_POLICY_NOT_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1
            assert results[0].region == AWS_REGION_US_EAST_1
            assert results[0].resource_arn == user_arn
            assert results[0].resource_id == f"{user_name}/{policy_name}"
            assert results[0].resource_tags == []
            assert results[0].status == "PASS"
            assert (
                results[0].status_extended
                == f"Inline policy {policy_name} attached to user {user_name} does not allow '*:*' administrative privileges."
            )

    @mock_aws
    def test_users_admin_and_not_admin_inline_policies(self):
        # IAM Client
        iam_client = client("iam")
        # Create IAM User
        user_name = "test_user"
        user_arn = iam_client.create_user(
            UserName=user_name,
        )[
            "User"
        ]["Arn"]

        # Put Group Policy - NOT ADMIN
        policy_name_not_admin = "test_not_admin_inline_policy"
        _ = iam_client.put_user_policy(
            UserName=user_name,
            PolicyName=policy_name_not_admin,
            PolicyDocument=dumps(INLINE_POLICY_NOT_ADMIN),
        )
        # Put Group Policy - ADMIN
        policy_name_admin = "test_admin_inline_policy"
        _ = iam_client.put_user_policy(
            UserName=user_name,
            PolicyName=policy_name_admin,
            PolicyDocument=dumps(INLINE_POLICY_ADMIN),
        )
        # Audit Info
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_administrative_privileges.iam_inline_policy_no_administrative_privileges import (
                iam_inline_policy_no_administrative_privileges,
            )

            check = iam_inline_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 2
            for result in results:
                if result.resource_id == policy_name_admin:
                    assert result.region == AWS_REGION_US_EAST_1
                    assert result.resource_arn == user_arn
                    assert result.resource_id == policy_name_admin
                    assert result.resource_tags == []
                    assert result.status == "FAIL"
                    assert (
                        result.status_extended
                        == f"Inline policy {policy_name_admin} attached to user {user_name} allows '*:*' administrative privileges."
                    )

                elif result.resource_id == policy_name_not_admin:
                    assert result.region == AWS_REGION_US_EAST_1
                    assert result.resource_arn == user_arn
                    assert result.resource_id == policy_name_not_admin
                    assert result.resource_tags == []
                    assert result.status == "PASS"
                    assert (
                        result.status_extended
                        == f"Inline policy {policy_name_not_admin} attached to user {user_name} does not allow '*:*' administrative privileges."
                    )
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_no_full_access_to_cloudtrail_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_inline_policy_no_full_access_to_cloudtrail/iam_inline_policy_no_full_access_to_cloudtrail_test.py

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


class Test_iam_inline_policy_no_full_access_to_cloudtrail:
    @mock_aws
    def test_policy_full_access_to_cloudtrail_with_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_cloudtrail_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "cloudtrail:*", "Resource": "*"},
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
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail import (
                iam_inline_policy_no_full_access_to_cloudtrail,
            )

            check = iam_inline_policy_no_full_access_to_cloudtrail()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} allows 'cloudtrail:*' privileges to all resources."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"

    @mock_aws
    def test_policy_no_full_access_to_cloudtrail_with_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_no_cloudtrail_full"
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
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail import (
                iam_inline_policy_no_full_access_to_cloudtrail,
            )

            check = iam_inline_policy_no_full_access_to_cloudtrail()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} does not allow 'cloudtrail:*' privileges."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"

    @mock_aws
    def test_policy_full_access_to_cloudtrail_with_no_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_cloudtrail_full"
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
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail import (
                iam_inline_policy_no_full_access_to_cloudtrail,
            )

            check = iam_inline_policy_no_full_access_to_cloudtrail()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} allows 'cloudtrail:*' privileges to all resources."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"

    @mock_aws
    def test_policy_no_full_access_to_cloudtrail_with_no_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_no_cloudtrail_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "NotAction": ["ec2:*", "s3:*", "cloudtrail:*"],
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
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail import (
                iam_inline_policy_no_full_access_to_cloudtrail,
            )

            check = iam_inline_policy_no_full_access_to_cloudtrail()
            result = check.execute()
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} does not allow 'cloudtrail:*' privileges."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"

    @mock_aws
    def test_policy_full_access_to_cloudtrail_with_multiple_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)
        # Create IAM Role
        role_name = "test_role"
        role_arn = iam_client.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(ADMINISTRATOR_ROLE_ASSUME_ROLE_POLICY),
        )["Role"]["Arn"]

        # Put Role Policy
        policy_name = "policy_cloudtrail_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": ["cloudtrail:*", "s3:*", "ec2:*"],
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
                "prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_inline_policy_no_full_access_to_cloudtrail.iam_inline_policy_no_full_access_to_cloudtrail import (
                iam_inline_policy_no_full_access_to_cloudtrail,
            )

            check = iam_inline_policy_no_full_access_to_cloudtrail()
            result = check.execute()
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Inline policy {policy_name} attached to role {role_name} allows 'cloudtrail:*' privileges to all resources."
            )
            assert result[0].resource_id == f"test_role/{policy_name}"
            assert result[0].resource_arn == role_arn
            assert result[0].region == "eu-west-1"
```

--------------------------------------------------------------------------------

````
