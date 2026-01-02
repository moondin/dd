---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 577
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 577 of 867)

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

---[FILE: iam_policy_no_full_access_to_kms_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_policy_no_full_access_to_kms/iam_policy_no_full_access_to_kms_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import IAM
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider


class Test_iam_policy_no_full_access_to_kms:
    @mock_aws
    def test_policy_full_access_to_kms(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "kms:*", "Resource": "*"},
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} allows 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_kms_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"


class Test_iam_policy_no_full_access_to_kms_with_double_start:
    @mock_aws
    def test_policy_full_access_to_kms(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "kms:**", "Resource": "*"},
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} allows 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_kms_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"


class Test_iam_policy_no_full_access_to_kms_with_unicode:
    @mock_aws
    def test_policy_full_access_to_kms(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "\u0041llow", "Action": "km\u0073:*", "Resource": "*"},
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} allows 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_kms_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_no_full_access_to_kms(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_no_kms_full"
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} does not allow 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_no_kms_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_mixed(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_mixed"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": ["ec2:*", "kms:*"], "Resource": "*"},
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} allows 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_mixed"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_full_access_to_kms_through_no_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_kms_full"
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} allows 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_kms_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_full_access_to_limited_kms_key(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_dev_kms"
        policy_document_no_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": ["kms:*"],
                    "Resource": f"arn:aws:kms:{AWS_REGION_US_EAST_1}:123456789012:alias/dev-key",
                },
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} does not allow 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_dev_kms"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_no_full_access_to_kms_through_no_actions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_no_kms_full"
        policy_document_no_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "NotAction": ["kms:*"], "Resource": "*"},
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} does not allow 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_no_kms_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"

    @mock_aws
    def test_policy_full_access_and_full_deny_to_kms(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        iam_client = client("iam")
        policy_name = "policy_no_kms_full"
        policy_document_full_access = {
            "Version": "2012-10-17",
            "Statement": [
                {"Effect": "Allow", "Action": "kms:*", "Resource": "*"},
                {"Effect": "Deny", "Action": "kms:*", "Resource": "*"},
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
                "prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms.iam_client",
                new=IAM(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.iam.iam_policy_no_full_access_to_kms.iam_policy_no_full_access_to_kms import (
                    iam_policy_no_full_access_to_kms,
                )

                check = iam_policy_no_full_access_to_kms()
                result = check.execute()
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == f"Custom Policy {policy_name} does not allow 'kms:*' privileges."
                )
                assert result[0].resource_id == "policy_no_kms_full"
                assert result[0].resource_arn == arn
                assert result[0].region == "us-east-1"
```

--------------------------------------------------------------------------------

---[FILE: iam_role_administratoraccess_policy_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_role_administratoraccess_policy/iam_role_administratoraccess_policy_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import Role
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_REGION = "us-east-1"
AWS_ACCOUNT_ID = "123456789012"


class Test_iam_role_administratoraccess_policy:
    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_no_roles(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy import (
                iam_role_administratoraccess_policy,
            )

            check = iam_role_administratoraccess_policy()
            result = check.execute()
            assert len(result) == 0

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_role_without_administratoraccess_policy(self):
        iam = client("iam")
        role_name = "test"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_ID}:root"},
                "Action": "sts:AssumeRole",
            },
        }
        response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy import (
                iam_role_administratoraccess_policy,
            )

            check = iam_role_administratoraccess_policy()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Role test does not have AdministratorAccess policy."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
            assert result[0].resource_tags == []

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_role_with_securityaudit_policy(self):
        iam = client("iam")
        role_name = "test"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_ID}:root"},
                "Action": "sts:AssumeRole",
            },
        }
        response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/SecurityAudit",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy import (
                iam_role_administratoraccess_policy,
            )

            check = iam_role_administratoraccess_policy()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Role test does not have AdministratorAccess policy."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
            assert result[0].resource_tags == []

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_role_with_administratoraccess_policy(self):
        iam = client("iam")
        role_name = "test"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": "arn:aws:iam::012345678910:root"},
                "Action": "sts:AssumeRole",
            },
        }
        response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy import (
                iam_role_administratoraccess_policy,
            )

            check = iam_role_administratoraccess_policy()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM Role test has AdministratorAccess policy attached."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
            assert result[0].resource_tags == []

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_asterisk_principal_role_with_administratoraccess_policy(self):
        iam = client("iam")
        role_name = "test"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": "sts:AssumeRole",
            },
        }
        response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy import (
                iam_role_administratoraccess_policy,
            )

            check = iam_role_administratoraccess_policy()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM Role test has AdministratorAccess policy attached."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
            assert result[0].resource_tags == []

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_only_aws_service_linked_roles(self):
        iam_client = mock.MagicMock
        iam_client.roles = []
        iam_client.roles.append(
            Role(
                name="AWSServiceRoleForAmazonGuardDuty",
                arn="arn:aws:iam::106908755756:role/aws-service-role/guardduty.amazonaws.com/AWSServiceRoleForAmazonGuardDuty",
                assume_role_policy={
                    "Version": "2008-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"Service": "ec2.amazonaws.com"},
                            "Action": "sts:AssumeRole",
                        }
                    ],
                },
                is_service_role=True,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy.iam_client",
                new=iam_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy import (
                iam_role_administratoraccess_policy,
            )

            check = iam_role_administratoraccess_policy()
            result = check.execute()
            assert len(result) == 0

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_access_denied(self):
        iam_client = mock.MagicMock
        iam_client.roles = None

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy.iam_client",
                new=iam_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_administratoraccess_policy.iam_role_administratoraccess_policy import (
                iam_role_administratoraccess_policy,
            )

            check = iam_role_administratoraccess_policy()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: iam_role_cross_account_readonlyaccess_policy_test.py]---
Location: prowler-master/tests/providers/aws/services/iam/iam_role_cross_account_readonlyaccess_policy/iam_role_cross_account_readonlyaccess_policy_test.py

```python
from json import dumps
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.iam.iam_service import Role
from tests.providers.aws.utils import AWS_REGION_US_EAST_1, set_mocked_aws_provider

AWS_REGION = "us-east-1"
AWS_ACCOUNT_ID = "123456789012"


class Test_iam_role_cross_account_readonlyaccess_policy:
    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_no_roles(self):
        from prowler.providers.aws.services.iam.iam_service import IAM

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy import (
                iam_role_cross_account_readonlyaccess_policy,
            )

            check = iam_role_cross_account_readonlyaccess_policy()
            result = check.execute()
            assert len(result) == 0

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_role_without_readonlyaccess_policy(self):
        iam = client("iam")
        role_name = "test"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_ID}:root"},
                "Action": "sts:AssumeRole",
            },
        }
        response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy import (
                iam_role_cross_account_readonlyaccess_policy,
            )

            check = iam_role_cross_account_readonlyaccess_policy()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Role test does not have ReadOnlyAccess policy."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
            assert result[0].resource_tags == []

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_internal_role_with_readonlyaccess_policy(self):
        iam = client("iam")
        role_name = "test"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": f"arn:aws:iam::{AWS_ACCOUNT_ID}:root"},
                "Action": "sts:AssumeRole",
            },
        }
        response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/ReadOnlyAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy import (
                iam_role_cross_account_readonlyaccess_policy,
            )

            check = iam_role_cross_account_readonlyaccess_policy()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "IAM Role test has read-only access but is not cross account."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
            assert result[0].resource_tags == []

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_cross_account_role_with_readonlyaccess_policy(self):
        iam = client("iam")
        role_name = "test"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": "arn:aws:iam::012345678910:root"},
                "Action": "sts:AssumeRole",
            },
        }
        response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/ReadOnlyAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy import (
                iam_role_cross_account_readonlyaccess_policy,
            )

            check = iam_role_cross_account_readonlyaccess_policy()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM Role test gives cross account read-only access."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
            assert result[0].resource_tags == []

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_asterisk_cross_account_role_with_readonlyaccess_policy(self):
        iam = client("iam")
        role_name = "test"
        assume_role_policy_document = {
            "Version": "2012-10-17",
            "Statement": {
                "Sid": "test",
                "Effect": "Allow",
                "Principal": {"AWS": "*"},
                "Action": "sts:AssumeRole",
            },
        }
        response = iam.create_role(
            RoleName=role_name,
            AssumeRolePolicyDocument=dumps(assume_role_policy_document),
        )
        iam.attach_role_policy(
            RoleName=role_name,
            PolicyArn="arn:aws:iam::aws:policy/ReadOnlyAccess",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])
        from prowler.providers.aws.services.iam.iam_service import IAM

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy.iam_client",
                new=IAM(aws_provider),
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy import (
                iam_role_cross_account_readonlyaccess_policy,
            )

            check = iam_role_cross_account_readonlyaccess_policy()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "IAM Role test gives cross account read-only access."
            )
            assert result[0].resource_id == "test"
            assert result[0].resource_arn == response["Role"]["Arn"]
            assert result[0].resource_tags == []

    @mock_aws(config={"iam": {"load_aws_managed_policies": True}})
    def test_only_aws_service_linked_roles(self):
        iam_client = mock.MagicMock
        iam_client.roles = []
        iam_client.roles.append(
            Role(
                name="AWSServiceRoleForAmazonGuardDuty",
                arn="arn:aws:iam::106908755756:role/aws-service-role/guardduty.amazonaws.com/AWSServiceRoleForAmazonGuardDuty",
                assume_role_policy={
                    "Version": "2008-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Principal": {"Service": "ec2.amazonaws.com"},
                            "Action": "sts:AssumeRole",
                        }
                    ],
                },
                is_service_role=True,
            )
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_US_EAST_1])

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=aws_provider,
            ),
            mock.patch(
                "prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy.iam_client",
                new=iam_client,
            ),
        ):
            # Test Check
            from prowler.providers.aws.services.iam.iam_role_cross_account_readonlyaccess_policy.iam_role_cross_account_readonlyaccess_policy import (
                iam_role_cross_account_readonlyaccess_policy,
            )

            check = iam_role_cross_account_readonlyaccess_policy()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
