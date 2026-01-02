---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 307
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 307 of 867)

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

---[FILE: organizations_delegated_administrators.py]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_delegated_administrators/organizations_delegated_administrators.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_delegated_administrators(Check):
    def execute(self):
        findings = []

        organizations_trusted_delegated_administrators = (
            organizations_client.audit_config.get(
                "organizations_trusted_delegated_administrators", []
            )
        )

        if (
            organizations_client.organization
            and organizations_client.organization.status == "ACTIVE"
        ):
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=organizations_client.organization,
            )
            report.region = organizations_client.region
            if (
                organizations_client.organization.delegated_administrators is not None
            ):  # Check if Access Denied to list_delegated_administrators
                if organizations_client.organization.delegated_administrators:
                    for (
                        delegated_administrator
                    ) in organizations_client.organization.delegated_administrators:
                        if (
                            delegated_administrator.id
                            not in organizations_trusted_delegated_administrators
                        ):
                            report.status = "FAIL"
                            report.status_extended = f"AWS Organization {organizations_client.organization.id} has an untrusted Delegated Administrator: {delegated_administrator.id}."
                        else:
                            report.status = "PASS"
                            report.status_extended = f"AWS Organization {organizations_client.organization.id} has a trusted Delegated Administrator: {delegated_administrator.id}."
                else:
                    report.status = "PASS"
                    report.status_extended = f"AWS Organization {organizations_client.organization.id} has no Delegated Administrators."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_opt_out_ai_services_policy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_opt_out_ai_services_policy/organizations_opt_out_ai_services_policy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "organizations_opt_out_ai_services_policy",
  "CheckTitle": "Ensure that AWS Organizations opt-out of AI services policy is enabled and disallow child-accounts to overwrite this policy.",
  "CheckType": [],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service::account-id:organization/organization-id",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "This control checks whether the AWS Organizations opt-out of AI services policy is enabled and whether child-accounts are disallowed to overwrite this policy. The control fails if the policy is not enabled or if child-accounts are not disallowed to overwrite this policy.",
  "Risk": "By default, AWS may be using your data to train its AI models. This may include data from your AWS CloudTrail logs, AWS Config rules, and AWS GuardDuty findings. If you opt out of AI services, AWS will not use your data to train its AI models.",
  "RelatedUrl": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_ai-opt-out_all.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Artificial Intelligence (AI) services opt-out policies enable you to control whether AWS AI services can store and use your content. Enable the AWS Organizations opt-out of AI services policy and disallow child-accounts to overwrite this policy.",
      "Url": "https://docs.aws.amazon.com/organizations/latest/userguide/disable-policy-type.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organizations_opt_out_ai_services_policy.py]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_opt_out_ai_services_policy/organizations_opt_out_ai_services_policy.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_opt_out_ai_services_policy(Check):
    def execute(self):
        findings = []

        if organizations_client.organization:
            if (
                organizations_client.organization.policies is not None
            ):  # Access Denied to list_policies
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=organizations_client.organization,
                )
                report.region = organizations_client.region
                report.status = "FAIL"
                report.status_extended = (
                    "AWS Organizations is not in-use for this AWS Account."
                )

                if organizations_client.organization.status == "ACTIVE":
                    all_conditions_passed = False
                    opt_out_policies = organizations_client.organization.policies.get(
                        "AISERVICES_OPT_OUT_POLICY", []
                    )

                    if not opt_out_policies:
                        report.status_extended = f"AWS Organization {organizations_client.organization.id} has no opt-out policy for AI services."
                    else:
                        for policy in opt_out_policies:
                            opt_out_policy = (
                                policy.content.get("services", {})
                                .get("default", {})
                                .get("opt_out_policy", {})
                            )

                            condition_1 = opt_out_policy.get("@@assign") == "optOut"
                            condition_2 = opt_out_policy.get(
                                "@@operators_allowed_for_child_policies"
                            ) == ["@@none"]

                            if condition_1 and condition_2:
                                all_conditions_passed = True
                                break

                            if not condition_1 and not condition_2:
                                report.status_extended = f"AWS Organization {organizations_client.organization.id} has not opted out of all AI services and it does not disallow child-accounts to overwrite the policy."
                            elif not condition_1:
                                report.status_extended = f"AWS Organization {organizations_client.organization.id} has not opted out of all AI services."
                            elif not condition_2:
                                report.status_extended = f"AWS Organization {organizations_client.organization.id} has opted out of all AI services but it does not disallow child-accounts to overwrite the policy."

                        if all_conditions_passed:
                            report.status = "PASS"
                            report.status_extended = f"AWS Organization {organizations_client.organization.id} has opted out of all AI services and also disallows child-accounts to overwrite this policy."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_scp_check_deny_regions.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_scp_check_deny_regions/organizations_scp_check_deny_regions.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "organizations_scp_check_deny_regions",
  "CheckTitle": "Check if AWS Regions are restricted with SCP policies",
  "CheckType": [
    "Logging and Monitoring"
  ],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service::account-id:organization/organization-id",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "As best practice, AWS Regions should be restricted and only allow the ones that are needed.",
  "Risk": "The risk associated with not restricting AWS Regions with Service Control Policies (SCPs) is that it can lead to unauthorized access or use of resources in regions that are not intended for use. This can result in increased costs due to inefficiencies in resource usage and can also expose sensitive data to unauthorized access or breaches. By restricting access to AWS Regions with SCP policies, organizations can help ensure that only authorized personnel have access to the resources they need, while minimizing the risk of security breaches and compliance violations.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict AWS Regions using SCP policies.",
      "Url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples_general.html#example-scp-deny-region"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organizations_scp_check_deny_regions.py]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_scp_check_deny_regions/organizations_scp_check_deny_regions.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_scp_check_deny_regions(Check):
    def execute(self):
        findings = []
        organizations_enabled_regions = organizations_client.audit_config.get(
            "organizations_enabled_regions", []
        )

        if organizations_client.organization:
            if (
                organizations_client.organization.policies is not None
            ):  # Access denied to list policies
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=organizations_client.organization,
                )
                report.region = organizations_client.region
                report.status = "FAIL"
                report.status_extended = (
                    "AWS Organizations is not in-use for this AWS Account."
                )

                if organizations_client.organization.status == "ACTIVE":
                    report.status_extended = f"AWS Organizations {organizations_client.organization.id} does not have SCP policies."
                    # We use this flag if we find a statement that is restricting regions but not all the configured ones:
                    is_region_restricted_statement = False

                    for policy in organizations_client.organization.policies.get(
                        "SERVICE_CONTROL_POLICY", []
                    ):
                        # Statements are not always list
                        statements = policy.content.get("Statement", [])
                        if type(statements) is not list:
                            statements = [statements]

                        for statement in statements:
                            # Deny if Condition = {"StringNotEquals": {"aws:RequestedRegion": [region1, region2]}}
                            if (
                                statement.get("Effect") == "Deny"
                                and "Condition" in statement
                                and "StringNotEquals" in statement["Condition"]
                                and "aws:RequestedRegion"
                                in statement["Condition"]["StringNotEquals"]
                            ):
                                if all(
                                    region
                                    in statement["Condition"]["StringNotEquals"][
                                        "aws:RequestedRegion"
                                    ]
                                    for region in organizations_enabled_regions
                                ):
                                    # All defined regions are restricted, we exit here, no need to continue.
                                    report.status = "PASS"
                                    report.status_extended = f"AWS Organization {organizations_client.organization.id} has SCP policy {policy.id} restricting all configured regions found."
                                    findings.append(report)
                                    return findings
                                else:
                                    # Regions are restricted, but not the ones defined, we keep this finding, but we continue analyzing:
                                    is_region_restricted_statement = True
                                    report.status = "FAIL"
                                    report.status_extended = f"AWS Organization {organizations_client.organization.id} has SCP policies {policy.id} restricting some AWS Regions, but not all the configured ones, please check config."

                            # Allow if Condition = {"StringEquals": {"aws:RequestedRegion": [region1, region2]}}
                            if (
                                policy.content.get("Statement") == "Allow"
                                and "Condition" in statement
                                and "StringEquals" in statement["Condition"]
                                and "aws:RequestedRegion"
                                in statement["Condition"]["StringEquals"]
                            ):
                                if all(
                                    region
                                    in statement["Condition"]["StringEquals"][
                                        "aws:RequestedRegion"
                                    ]
                                    for region in organizations_enabled_regions
                                ):
                                    # All defined regions are restricted, we exit here, no need to continue.
                                    report.status = "PASS"
                                    report.status_extended = f"AWS Organization {organizations_client.organization.id} has SCP policy {policy.id} restricting all configured regions found."
                                    findings.append(report)
                                    return findings
                                else:
                                    # Regions are restricted, but not the ones defined, we keep this finding, but we continue analyzing:
                                    is_region_restricted_statement = True
                                    report.status = "FAIL"
                                    report.status_extended = f"AWS Organization {organizations_client.organization.id} has SCP policies {policy.id} restricting some AWS Regions, but not all the configured ones, please check config."

                    if not is_region_restricted_statement:
                        report.status = "FAIL"
                        report.status_extended = f"AWS Organization {organizations_client.organization.id} has SCP policies but don't restrict AWS Regions."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_tags_policies_enabled_and_attached.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_tags_policies_enabled_and_attached/organizations_tags_policies_enabled_and_attached.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "organizations_tags_policies_enabled_and_attached",
  "CheckTitle": "Check if an AWS Organization has tags policies enabled and attached.",
  "CheckType": [],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service::account-id:organization/organization-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if an AWS Organization has tags policies enabled and attached.",
  "Risk": "If an AWS Organization tags policies are not enabled and attached, it is not possible to enforce tags on AWS resources.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable and attach AWS Organizations tags policies.",
      "Url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_tag-policies.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organizations_tags_policies_enabled_and_attached.py]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_tags_policies_enabled_and_attached/organizations_tags_policies_enabled_and_attached.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_tags_policies_enabled_and_attached(Check):
    def execute(self):
        findings = []

        if organizations_client.organization:
            if (
                organizations_client.organization.policies is not None
            ):  # Access Denied to list_policies
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=organizations_client.organization,
                )
                report.region = organizations_client.region
                report.status = "FAIL"
                report.status_extended = (
                    "AWS Organizations is not in-use for this AWS Account."
                )

                if organizations_client.organization.status == "ACTIVE":
                    report.status_extended = f"AWS Organizations {organizations_client.organization.id} does not have tag policies."
                    for policy in organizations_client.organization.policies.get(
                        "TAG_POLICY", []
                    ):
                        report.status_extended = f"AWS Organization {organizations_client.organization.id} has tag policies enabled but not attached."
                        if policy.targets:
                            report.status = "PASS"
                            report.status_extended = f"AWS Organization {organizations_client.organization.id} has tag policies enabled and attached to an AWS account."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_client.py]---
Location: prowler-master/prowler/providers/aws/services/rds/rds_client.py

```python
from prowler.providers.aws.services.rds.rds_service import RDS
from prowler.providers.common.provider import Provider

rds_client = RDS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
