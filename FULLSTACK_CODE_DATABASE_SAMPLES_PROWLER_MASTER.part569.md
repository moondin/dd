---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 569
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 569 of 867)

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

---[FILE: iam_customer_attached_policy_no_administrative_privileges_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_customer_attached_policy_no_administrative_privileges/iam_customer_attached_policy_no_administrative_privileges_test.py

```python
from json import dumps
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_customer_attached_policy_no_administrative_privileges_test:
    @mock_aws
    def test_policy_administrative(self):
        iam_client = client("iam")
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "*", "Resource": "*"},
            ],
        }
        iam_client.create_role(
            RoleName="my-role", AssumeRolePolicyDocument="{}", Path="/my-path/"
        )
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]
        iam_client.attach_role_policy(PolicyArn=arn, RoleName="my-role")
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_customer_attached_policy_no_administrative_privileges.iam_customer_attached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_customer_attached_policy_no_administrative_privileges.iam_customer_attached_policy_no_administrative_privileges import (
                iam_customer_attached_policy_no_administrative_privileges,
            )

            check = iam_customer_attached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1, f"Expected 1 result, but got {len(results)}"
            for result in results:
                if result.resource_id == "policy1":
                    assert result.status == "FAIL"
                    assert result.resource_arn == arn
                    assert search(
                        f"Custom policy {policy_name} is attached and allows ",
                        result.status_extended,
                    )

    @mock_aws
    def test_policy_non_administrative(self):
        iam_client = client("iam")
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:CreateLogGroup", "Resource": "*"},
            ],
        }
        iam_client.create_role(
            RoleName="my-role", AssumeRolePolicyDocument="{}", Path="/my-path/"
        )
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]
        iam_client.attach_role_policy(PolicyArn=arn, RoleName="my-role")
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_customer_attached_policy_no_administrative_privileges.iam_customer_attached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_customer_attached_policy_no_administrative_privileges.iam_customer_attached_policy_no_administrative_privileges import (
                iam_customer_attached_policy_no_administrative_privileges,
            )

            check = iam_customer_attached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1, f"Expected 1 result, but got {len(results)}"
            for result in results:
                if result.resource_id == "policy1":
                    assert result.status == "PASS"
                    assert result.resource_arn == arn
                    assert search(
                        f"Custom policy {policy_name} is attached but does not allow",
                        result.status_extended,
                    )

    @mock_aws
    def test_policy_administrative_and_non_administrative(self):
        iam_client = client("iam")
        policy_name_non_administrative = "policy1"
        policy_document_non_administrative = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:*", "Resource": "*"},
            ],
        }
        policy_name_administrative = "policy2"
        policy_document_administrative = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "*", "Resource": "*"},
            ],
        }
        arn_non_administrative = iam_client.create_policy(
            PolicyName=policy_name_non_administrative,
            PolicyDocument=dumps(policy_document_non_administrative),
        )["Policy"]["Arn"]
        arn_administrative = iam_client.create_policy(
            PolicyName=policy_name_administrative,
            PolicyDocument=dumps(policy_document_administrative),
        )["Policy"]["Arn"]
        iam_client.create_role(
            RoleName="my-role", AssumeRolePolicyDocument="{}", Path="/my-path/"
        )
        iam_client.attach_role_policy(
            PolicyArn=arn_non_administrative, RoleName="my-role"
        )
        iam_client.attach_role_policy(PolicyArn=arn_administrative, RoleName="my-role")
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_customer_attached_policy_no_administrative_privileges.iam_customer_attached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_customer_attached_policy_no_administrative_privileges.iam_customer_attached_policy_no_administrative_privileges import (
                iam_customer_attached_policy_no_administrative_privileges,
            )

            check = iam_customer_attached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 2, f"Expected 2 results, but got {len(results)}"
            for result in results:
                if result.resource_id == "policy1":
                    assert result.status == "PASS"
                    assert result.resource_arn == arn_non_administrative
                    assert search(
                        f"Custom policy {policy_name_non_administrative} is attached but does not allow ",
                        result.status_extended,
                    )
                    assert result.resource_id == policy_name_non_administrative
                if result.resource_id == "policy2":
                    assert result.status == "FAIL"
                    assert result.resource_arn == arn_administrative
                    assert search(
                        f"Custom policy {policy_name_administrative} is attached and allows ",
                        result.status_extended,
                    )
                    assert result.resource_id == policy_name_administrative
```

--------------------------------------------------------------------------------

---[FILE: iam_customer_unattached_policy_no_administrative_privileges_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_customer_unattached_policy_no_administrative_privileges/iam_customer_unattached_policy_no_administrative_privileges_test.py

```python
from json import dumps
from re import search
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_customer_unattached_policy_no_administrative_privileges_test:
    @mock_aws
    def test_policy_administrative(self):
        iam_client = client("iam")
        policy_name = "policy1"
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "*", "Resource": "*"},
            ],
        }
        arn = iam_client.create_policy(
            PolicyName=policy_name, PolicyDocument=dumps(policy_document)
        )["Policy"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_customer_unattached_policy_no_administrative_privileges.iam_customer_unattached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_customer_unattached_policy_no_administrative_privileges.iam_customer_unattached_policy_no_administrative_privileges import (
                iam_customer_unattached_policy_no_administrative_privileges,
            )

            check = iam_customer_unattached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1, f"Expected 1 result, but got {len(results)}"
            for result in results:
                if result.resource_id == "policy1":
                    assert result.status == "FAIL"
                    assert result.resource_arn == arn
                    assert search(
                        f"Custom policy {policy_name} is unattached and allows ",
                        result.status_extended,
                    )

    @mock_aws
    def test_policy_non_administrative(self):
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

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_customer_unattached_policy_no_administrative_privileges.iam_customer_unattached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_customer_unattached_policy_no_administrative_privileges.iam_customer_unattached_policy_no_administrative_privileges import (
                iam_customer_unattached_policy_no_administrative_privileges,
            )

            check = iam_customer_unattached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 1, f"Expected 1 result, but got {len(results)}"
            for result in results:
                if result.resource_id == "policy1":
                    assert result.status == "PASS"
                    assert result.resource_arn == arn
                    assert search(
                        f"Custom policy {policy_name} is unattached and does not allow",
                        result.status_extended,
                    )

    @mock_aws
    def test_policy_administrative_and_non_administrative(self):
        iam_client = client("iam")
        policy_name_non_administrative = "policy1"
        policy_document_non_administrative = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "logs:*", "Resource": "*"},
            ],
        }
        policy_name_administrative = "policy2"
        policy_document_administrative = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "*", "Resource": "*"},
            ],
        }
        arn_non_administrative = iam_client.create_policy(
            PolicyName=policy_name_non_administrative,
            PolicyDocument=dumps(policy_document_non_administrative),
        )["Policy"]["Arn"]
        arn_administrative = iam_client.create_policy(
            PolicyName=policy_name_administrative,
            PolicyDocument=dumps(policy_document_administrative),
        )["Policy"]["Arn"]

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_customer_unattached_policy_no_administrative_privileges.iam_customer_unattached_policy_no_administrative_privileges.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            from prowler.providers.aws.services.iam.iam_customer_unattached_policy_no_administrative_privileges.iam_customer_unattached_policy_no_administrative_privileges import (
                iam_customer_unattached_policy_no_administrative_privileges,
            )

            check = iam_customer_unattached_policy_no_administrative_privileges()
            results = check.execute()
            assert len(results) == 2, f"Expected 2 results, but got {len(results)}"
            for result in results:
                if result.resource_id == "policy1":
                    assert result.status == "PASS"
                    assert result.resource_arn == arn_non_administrative
                    assert search(
                        f"Custom policy {policy_name_non_administrative} is unattached and does not allow ",
                        result.status_extended,
                    )
                    assert result.resource_id == policy_name_non_administrative
                if result.resource_id == "policy2":
                    assert result.status == "FAIL"
                    assert result.resource_arn == arn_administrative
                    assert search(
                        f"Custom policy {policy_name_administrative} is unattached and allows ",
                        result.status_extended,
                    )
                    assert result.resource_id == policy_name_administrative
```

--------------------------------------------------------------------------------

---[FILE: iam_group_administrator_access_policy_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_group_administrator_access_policy/iam_group_administrator_access_policy_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_iam_group_administrator_access_policy:
    def test_no_users(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_group_administrator_access_policy.iam_group_administrator_access_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_group_administrator_access_policy.iam_group_administrator_access_policy import (
                iam_group_administrator_access_policy,
            )

            check = iam_group_administrator_access_policy()
            result = check.execute()

            assert len(result) == 0

    @mock_aws
    def test_no_admin_groups(self):
        iam = client("iam", region_name=AWS_REGION_EU_WEST_1)
        group_arn = iam.create_group(GroupName="test_group")["Group"]["Arn"]

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_group_administrator_access_policy.iam_group_administrator_access_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_group_administrator_access_policy.iam_group_administrator_access_policy import (
                iam_group_administrator_access_policy,
            )

            check = iam_group_administrator_access_policy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Group test_group does not have AdministratorAccess policy."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "test_group"
            assert result[0].resource_arn == group_arn

    @mock_aws
    def test_admin_groups(self):
        iam_client = client("iam", region_name=AWS_REGION_EU_WEST_1)

        # Create the AdministratorAccess policy
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [{"Effect": "Allow", "Action": "*", "Resource": "*"}],
        }

        policy_arn = iam_client.create_policy(
            PolicyName="AdministratorAccess",
            PolicyDocument=dumps(policy_document),
            Path="/",
        )["Policy"]["Arn"]

        # Create the test group
        group_arn = iam_client.create_group(GroupName="test_group")["Group"]["Arn"]

        # Attach the AdministratorAccess policy to the test group
        iam_client.attach_group_policy(GroupName="test_group", PolicyArn=policy_arn)

        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_group_administrator_access_policy.iam_group_administrator_access_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_group_administrator_access_policy.iam_group_administrator_access_policy import (
                iam_group_administrator_access_policy,
            )

            check = iam_group_administrator_access_policy()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM Group test_group has AdministratorAccess policy attached."
            )
            assert result[0].region == AWS_REGION_EU_WEST_1
            assert result[0].resource_id == "test_group"
            assert result[0].resource_arn == group_arn
```

--------------------------------------------------------------------------------

````
