---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 600
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 600 of 867)

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

---[FILE: organizations_opt_out_ai_services_policy_test.py]---
Location: prowler-master/tests/providers/aws/services/organizations/organizations_opt_out_ai_services_policy/organizations_opt_out_ai_services_policy_test.py

```python
from unittest import mock

from prowler.providers.aws.services.organizations.organizations_service import (
    Organization,
    Policy,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_organizations_tags_policies_enabled_and_attached:
    def test_organization_no_organization(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.audited_partition = "aws"
        organizations_client.audited_account = "0123456789012"
        organizations_client.organization = Organization(
            arn="arn:aws:organizations:eu-west-1:0123456789012:unknown",
            id="AWS Organization",
            status="NOT_AVAILABLE",
            master_id="",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy.organizations_client",
                new=organizations_client,
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy import (
                    organizations_opt_out_ai_services_policy,
                )

                check = organizations_opt_out_ai_services_policy()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organizations is not in-use for this AWS Account."
                )
                assert result[0].resource_id == "AWS Organization"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations:eu-west-1:0123456789012:unknown"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_organization_with_AI_optout_no_policies(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.audited_partition = "aws"
        organizations_client.audited_account = "0123456789012"
        organizations_client.organization = Organization(
            id="o-1234567890",
            arn="arn:aws:organizations::1234567890:organization/o-1234567890",
            status="ACTIVE",
            master_id="1234567890",
            policies={"AISERVICES_OPT_OUT_POLICY": []},
            delegated_administrators=None,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy.organizations_client",
                new=organizations_client,
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy import (
                    organizations_opt_out_ai_services_policy,
                )

                check = organizations_opt_out_ai_services_policy()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organization o-1234567890 has no opt-out policy for AI services."
                )
                assert result[0].resource_id == "o-1234567890"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::1234567890:organization/o-1234567890"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_organization_with_AI_optout_policy_complete(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.audited_partition = "aws"
        organizations_client.audited_account = "0123456789012"
        organizations_client.get_unknown_arn = (
            lambda x: f"arn:aws:organizations:{x}:0123456789012:unknown"
        )
        organizations_client.organization = Organization(
            id="o-1234567890",
            arn="arn:aws:organizations::1234567890:organization/o-1234567890",
            status="ACTIVE",
            master_id="1234567890",
            policies={
                "AISERVICES_OPT_OUT_POLICY": [
                    Policy(
                        id="p-1234567890",
                        arn="arn:aws:organizations::1234567890:policy/o-1234567890/p-1234567890",
                        type="AISERVICES_OPT_OUT_POLICY",
                        aws_managed=False,
                        content={
                            "services": {
                                "default": {
                                    "opt_out_policy": {
                                        "@@operators_allowed_for_child_policies": [
                                            "@@none"
                                        ],
                                        "@@assign": "optOut",
                                    }
                                }
                            }
                        },
                        targets=[],
                    )
                ]
            },
            delegated_administrators=None,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy.organizations_client",
                    new=organizations_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy.organizations_client.get_unknown_arn",
                    return_value="arn:aws:organizations:eu-west-1:0123456789012:unknown",
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy import (
                    organizations_opt_out_ai_services_policy,
                )

                check = organizations_opt_out_ai_services_policy()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "AWS Organization o-1234567890 has opted out of all AI services and also disallows child-accounts to overwrite this policy."
                )
                assert result[0].resource_id == "o-1234567890"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::1234567890:organization/o-1234567890"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_organization_with_AI_optout_policy_no_content(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.audited_partition = "aws"
        organizations_client.audited_account = "0123456789012"
        organizations_client.organization = Organization(
            id="o-1234567890",
            arn="arn:aws:organizations::1234567890:organization/o-1234567890",
            status="ACTIVE",
            master_id="1234567890",
            policies={
                "AISERVICES_OPT_OUT_POLICY": [
                    Policy(
                        id="p-1234567890",
                        arn="arn:aws:organizations::1234567890:policy/o-1234567890/p-1234567890",
                        type="AISERVICES_OPT_OUT_POLICY",
                        aws_managed=False,
                        content={},
                        targets=[],
                    )
                ]
            },
            delegated_administrators=None,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy.organizations_client",
                new=organizations_client,
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy import (
                    organizations_opt_out_ai_services_policy,
                )

                check = organizations_opt_out_ai_services_policy()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organization o-1234567890 has not opted out of all AI services and it does not disallow child-accounts to overwrite the policy."
                )
                assert result[0].resource_id == "o-1234567890"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::1234567890:organization/o-1234567890"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_organization_with_AI_optout_policy_no_disallow(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.audited_partition = "aws"
        organizations_client.audited_account = "0123456789012"
        organizations_client.organization = Organization(
            id="o-1234567890",
            arn="arn:aws:organizations::1234567890:organization/o-1234567890",
            status="ACTIVE",
            master_id="1234567890",
            policies={
                "AISERVICES_OPT_OUT_POLICY": [
                    Policy(
                        id="p-1234567890",
                        arn="arn:aws:organizations::1234567890:policy/o-1234567890/p-1234567890",
                        type="AISERVICES_OPT_OUT_POLICY",
                        aws_managed=False,
                        content={
                            "services": {
                                "default": {"opt_out_policy": {"@@assign": "optOut"}}
                            }
                        },
                        targets=[],
                    )
                ]
            },
            delegated_administrators=None,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy.organizations_client",
                new=organizations_client,
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy import (
                    organizations_opt_out_ai_services_policy,
                )

                check = organizations_opt_out_ai_services_policy()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organization o-1234567890 has opted out of all AI services but it does not disallow child-accounts to overwrite the policy."
                )
                assert result[0].resource_id == "o-1234567890"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::1234567890:organization/o-1234567890"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_organization_with_AI_optout_policy_no_opt_out(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.audited_partition = "aws"
        organizations_client.audited_account = "0123456789012"
        organizations_client.organization = Organization(
            id="o-1234567890",
            arn="arn:aws:organizations::1234567890:organization/o-1234567890",
            status="ACTIVE",
            master_id="1234567890",
            policies={
                "AISERVICES_OPT_OUT_POLICY": [
                    Policy(
                        id="p-1234567890",
                        arn="arn:aws:organizations::1234567890:policy/o-1234567890/p-1234567890",
                        type="AISERVICES_OPT_OUT_POLICY",
                        aws_managed=False,
                        content={
                            "services": {
                                "default": {
                                    "opt_out_policy": {
                                        "@@operators_allowed_for_child_policies": [
                                            "@@none"
                                        ]
                                    }
                                }
                            }
                        },
                        targets=[],
                    )
                ]
            },
            delegated_administrators=None,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy.organizations_client",
                new=organizations_client,
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_opt_out_ai_services_policy.organizations_opt_out_ai_services_policy import (
                    organizations_opt_out_ai_services_policy,
                )

                check = organizations_opt_out_ai_services_policy()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organization o-1234567890 has not opted out of all AI services."
                )
                assert result[0].resource_id == "o-1234567890"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::1234567890:organization/o-1234567890"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: organizations_scp_check_deny_regions_test.py]---
Location: prowler-master/tests/providers/aws/services/organizations/organizations_scp_check_deny_regions/organizations_scp_check_deny_regions_test.py

```python
from unittest import mock

from boto3 import client
from moto import mock_aws

from prowler.providers.aws.services.organizations.organizations_service import (
    Organizations,
)
from tests.providers.aws.utils import (
    AWS_REGION_EU_CENTRAL_1,
    AWS_REGION_EU_WEST_1,
    set_mocked_aws_provider,
)


def scp_restrict_regions_with_deny():
    return '{"Version":"2012-10-17","Statement":{"Effect":"Deny","NotAction":"s3:*","Resource":"*","Condition":{"StringNotEquals":{"aws:RequestedRegion":["eu-central-1","eu-west-1"]}}}}'


def scp_restrict_regions_without_statement():
    return '{"Version":"2012-10-17"}'


class Test_organizations_scp_check_deny_regions:
    @mock_aws
    def test_no_organization(self):
        aws_provider = set_mocked_aws_provider(
            [AWS_REGION_EU_WEST_1], create_default_organization=False
        )
        aws_provider._audit_config = {
            "organizations_enabled_regions": [AWS_REGION_EU_WEST_1]
        }
        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions import (
                    organizations_scp_check_deny_regions,
                )

                check = organizations_scp_check_deny_regions()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organizations is not in-use for this AWS Account."
                )
                assert result[0].resource_id == "unknown"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::123456789012:unknown"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_organization_without_scp_deny_regions(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._audit_config = {
            "organizations_enabled_regions": [AWS_REGION_EU_WEST_1]
        }

        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        org_id = response["Organization"]["Id"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions import (
                    organizations_scp_check_deny_regions,
                )

                check = organizations_scp_check_deny_regions()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].resource_id == response["Organization"]["Id"]
                # Using this because there is no way to get the ARN of the organization
                assert (
                    "arn:aws:organizations::123456789012:organization/o-"
                    in result[0].resource_arn
                )
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} has SCP policies but don't restrict AWS Regions."
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_organization_with_scp_deny_regions_valid(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        # Create Policy
        response_policy = conn.create_policy(
            Content=scp_restrict_regions_with_deny(),
            Description="Test",
            Name="Test",
            Type="SERVICE_CONTROL_POLICY",
        )
        org_id = response["Organization"]["Id"]
        policy_id = response_policy["Policy"]["PolicySummary"]["Id"]

        # Set config variable
        aws_provider._audit_config = {"organizations_enabled_regions": ["eu-central-1"]}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions import (
                    organizations_scp_check_deny_regions,
                )

                check = organizations_scp_check_deny_regions()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == response["Organization"]["Id"]
                assert result[0].resource_arn == response["Organization"]["Arn"]
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} has SCP policy {policy_id} restricting all configured regions found."
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_organization_with_scp_deny_regions_not_valid(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        # Create Policy
        response_policy = conn.create_policy(
            Content=scp_restrict_regions_with_deny(),
            Description="Test",
            Name="Test",
            Type="SERVICE_CONTROL_POLICY",
        )
        org_id = response["Organization"]["Id"]
        policy_id = response_policy["Policy"]["PolicySummary"]["Id"]

        # Set config variable
        aws_provider._audit_config = {"organizations_enabled_regions": ["us-east-1"]}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions import (
                    organizations_scp_check_deny_regions,
                )

                check = organizations_scp_check_deny_regions()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].resource_id == response["Organization"]["Id"]
                assert (
                    "arn:aws:organizations::123456789012:organization/o-"
                    in result[0].resource_arn
                )
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} has SCP policies {policy_id} restricting some AWS Regions, but not all the configured ones, please check config."
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_organization_with_scp_deny_all_regions_valid(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._audit_config = {
            "organizations_enabled_regions": [
                AWS_REGION_EU_WEST_1,
                AWS_REGION_EU_CENTRAL_1,
            ]
        }
        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        # Create Policy
        response_policy = conn.create_policy(
            Content=scp_restrict_regions_with_deny(),
            Description="Test",
            Name="Test",
            Type="SERVICE_CONTROL_POLICY",
        )
        org_id = response["Organization"]["Id"]
        policy_id = response_policy["Policy"]["PolicySummary"]["Id"]

        # Set config variable
        aws_provider._audit_config = {"organizations_enabled_regions": ["eu-central-1"]}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions import (
                    organizations_scp_check_deny_regions,
                )

                check = organizations_scp_check_deny_regions()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert result[0].resource_id == response["Organization"]["Id"]
                assert result[0].resource_arn == response["Organization"]["Arn"]
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} has SCP policy {policy_id} restricting all configured regions found."
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    @mock_aws
    def test_access_denied(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])
        aws_provider._audit_config = {
            "organizations_enabled_regions": [
                AWS_REGION_EU_WEST_1,
                AWS_REGION_EU_CENTRAL_1,
            ]
        }

        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        response["Organization"]["Arn"]

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions.organizations_client",
                new=Organizations(aws_provider),
            ) as organizations_client:
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions import (
                    organizations_scp_check_deny_regions,
                )

                organizations_client.organization.policies = None

                check = organizations_scp_check_deny_regions()
                result = check.execute()

                assert len(result) == 0

    @mock_aws
    def test_organizations_scp_check_deny_regions_without_statement(self):
        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        # Create Organization
        conn = client("organizations", region_name=AWS_REGION_EU_WEST_1)
        response = conn.describe_organization()
        # Delete the default FullAWSAccess policy created by Moto
        policies = conn.list_policies(Filter="SERVICE_CONTROL_POLICY")["Policies"]
        for policy in policies:
            if policy["Name"] == "FullAWSAccess":
                policy_id = policy["Id"]
                # Detach from all roots
                roots = conn.list_roots()["Roots"]
                for root in roots:
                    conn.detach_policy(PolicyId=policy_id, TargetId=root["Id"])
                # Detach from all OUs
                ous = conn.list_organizational_units_for_parent(
                    ParentId=roots[0]["Id"]
                )["OrganizationalUnits"]
                for ou in ous:
                    conn.detach_policy(PolicyId=policy_id, TargetId=ou["Id"])
                # Detach from all accounts
                accounts = conn.list_accounts()["Accounts"]
                for account in accounts:
                    conn.detach_policy(PolicyId=policy_id, TargetId=account["Id"])
                # Now delete
                conn.delete_policy(PolicyId=policy_id)
                break
        # Create Policy
        response_policy = conn.create_policy(
            Content=scp_restrict_regions_without_statement(),
            Description="Test",
            Name="Test",
            Type="SERVICE_CONTROL_POLICY",
        )
        org_id = response["Organization"]["Id"]
        policy_id = response_policy["Policy"]["PolicySummary"]["Id"]

        # Set config variable
        aws_provider._audit_config = {"organizations_enabled_regions": ["us-east-1"]}

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions.organizations_client",
                new=Organizations(aws_provider),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_scp_check_deny_regions.organizations_scp_check_deny_regions import (
                    organizations_scp_check_deny_regions,
                )

                check = organizations_scp_check_deny_regions()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert result[0].resource_id == response["Organization"]["Id"]
                assert (
                    "arn:aws:organizations::123456789012:organization/o-"
                    in result[0].resource_arn
                )
                assert (
                    result[0].status_extended
                    == f"AWS Organization {org_id} has SCP policies but don't restrict AWS Regions."
                )
                assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

---[FILE: organizations_tags_policies_enabled_and_attached_test.py]---
Location: prowler-master/tests/providers/aws/services/organizations/organizations_tags_policies_enabled_and_attached/organizations_tags_policies_enabled_and_attached_test.py

```python
from unittest import mock

from prowler.providers.aws.services.organizations.organizations_service import (
    Organization,
    Policy,
)
from tests.providers.aws.utils import AWS_REGION_EU_WEST_1, set_mocked_aws_provider


class Test_organizations_tags_policies_enabled_and_attached:
    def test_organization_no_organization(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.audited_partition = "aws"
        organizations_client.audited_account = "0123456789012"
        organizations_client.organization = Organization(
            arn="arn:aws:organizations::1234567890:organization/o-1234567890",
            id="AWS Organization",
            status="NOT_AVAILABLE",
            master_id="",
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_tags_policies_enabled_and_attached.organizations_tags_policies_enabled_and_attached.organizations_client",
                new=organizations_client,
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_tags_policies_enabled_and_attached.organizations_tags_policies_enabled_and_attached import (
                    organizations_tags_policies_enabled_and_attached,
                )

                check = organizations_tags_policies_enabled_and_attached()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organizations is not in-use for this AWS Account."
                )
                assert result[0].resource_id == "AWS Organization"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::1234567890:organization/o-1234567890"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_organization_with_tag_policies_not_attached(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.audited_partition = "aws"
        organizations_client.audited_account = "0123456789012"
        organizations_client.organization = Organization(
            id="o-1234567890",
            arn="arn:aws:organizations::1234567890:organization/o-1234567890",
            status="ACTIVE",
            master_id="1234567890",
            policies={
                "TAG_POLICY": [
                    Policy(
                        id="p-1234567890",
                        arn="arn:aws:organizations::1234567890:policy/o-1234567890/p-1234567890",
                        type="TAG_POLICY",
                        aws_managed=False,
                        content={"tags": {"Owner": {}}},
                        targets=[],
                    )
                ]
            },
            delegated_administrators=None,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with mock.patch(
                "prowler.providers.aws.services.organizations.organizations_tags_policies_enabled_and_attached.organizations_tags_policies_enabled_and_attached.organizations_client",
                new=organizations_client,
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_tags_policies_enabled_and_attached.organizations_tags_policies_enabled_and_attached import (
                    organizations_tags_policies_enabled_and_attached,
                )

                check = organizations_tags_policies_enabled_and_attached()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "FAIL"
                assert (
                    result[0].status_extended
                    == "AWS Organization o-1234567890 has tag policies enabled but not attached."
                )
                assert result[0].resource_id == "o-1234567890"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::1234567890:organization/o-1234567890"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1

    def test_organization_with_tag_policies_attached(self):
        organizations_client = mock.MagicMock
        organizations_client.region = AWS_REGION_EU_WEST_1
        organizations_client.get_unknown_arn = (
            lambda x: f"arn:aws:organizations:{x}:0123456789012:unknown"
        )
        organizations_client.organization = Organization(
            id="o-1234567890",
            arn="arn:aws:organizations::1234567890:organization/o-1234567890",
            status="ACTIVE",
            master_id="1234567890",
            policies={
                "TAG_POLICY": [
                    Policy(
                        id="p-1234567890",
                        arn="arn:aws:organizations::1234567890:policy/o-1234567890/p-1234567890",
                        type="TAG_POLICY",
                        aws_managed=False,
                        content={"tags": {"Owner": {}}},
                        targets=["1234567890"],
                    )
                ]
            },
            delegated_administrators=None,
        )

        aws_provider = set_mocked_aws_provider([AWS_REGION_EU_WEST_1])

        with mock.patch(
            "prowler.providers.common.provider.Provider.get_global_provider",
            return_value=aws_provider,
        ):
            with (
                mock.patch(
                    "prowler.providers.aws.services.organizations.organizations_tags_policies_enabled_and_attached.organizations_tags_policies_enabled_and_attached.organizations_client",
                    new=organizations_client,
                ),
                mock.patch(
                    "prowler.providers.aws.services.organizations.organizations_tags_policies_enabled_and_attached.organizations_tags_policies_enabled_and_attached.organizations_client.get_unknown_arn",
                    return_value="arn:aws:organizations:eu-west-1:0123456789012:unknown",
                ),
            ):
                # Test Check
                from prowler.providers.aws.services.organizations.organizations_tags_policies_enabled_and_attached.organizations_tags_policies_enabled_and_attached import (
                    organizations_tags_policies_enabled_and_attached,
                )

                check = organizations_tags_policies_enabled_and_attached()
                result = check.execute()

                assert len(result) == 1
                assert result[0].status == "PASS"
                assert (
                    result[0].status_extended
                    == "AWS Organization o-1234567890 has tag policies enabled and attached to an AWS account."
                )
                assert result[0].resource_id == "o-1234567890"
                assert (
                    result[0].resource_arn
                    == "arn:aws:organizations::1234567890:organization/o-1234567890"
                )
                assert result[0].region == AWS_REGION_EU_WEST_1
```

--------------------------------------------------------------------------------

````
