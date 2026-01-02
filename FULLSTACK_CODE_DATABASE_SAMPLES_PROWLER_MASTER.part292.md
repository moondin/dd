---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 292
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 292 of 867)

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

---[FILE: iam_administrator_access_with_mfa.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_administrator_access_with_mfa/iam_administrator_access_with_mfa.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_administrator_access_with_mfa",
  "CheckTitle": "Ensure users of groups with AdministratorAccess policy have MFA tokens enabled",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamUser",
  "Description": "Ensure users of groups with AdministratorAccess policy have MFA tokens enabled",
  "Risk": "Policy may allow Anonymous users to perform actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure this repository and its contents should be publicly accessible.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_administrator_access_with_mfa.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_administrator_access_with_mfa/iam_administrator_access_with_mfa.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_administrator_access_with_mfa(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        response = iam_client.groups

        for group in response:
            report = Check_Report_AWS(metadata=self.metadata(), resource=group)
            report.region = iam_client.region
            report.status = "PASS"
            report.status_extended = f"Group {group.name} has no policies."

            if group.attached_policies:
                report.status_extended = (
                    f"Group {group.name} provides non-administrative access."
                )
                for group_policy in group.attached_policies:
                    if (
                        group_policy["PolicyArn"]
                        == f"arn:{iam_client.audited_partition}:iam::aws:policy/AdministratorAccess"
                    ):
                        # users in group are Administrators
                        if group.users:
                            for group_user in group.users:
                                for user in iam_client.credential_report:
                                    if (
                                        user["user"] == group_user.name
                                        and user["mfa_active"] == "false"
                                    ):
                                        report.status = "FAIL"
                                        report.status_extended = f"Group {group.name} provides administrator access to User {group_user.name} with MFA disabled."
                        else:
                            report.status_extended = f"Group {group.name} provides administrative access but does not have users."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_avoid_root_usage.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_avoid_root_usage/iam_avoid_root_usage.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_avoid_root_usage",
  "CheckTitle": "Avoid the use of the root accounts",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamUser",
  "Description": "Avoid the use of the root account",
  "Risk": "The root account has unrestricted access to all resources in the AWS account. It is highly recommended that the use of this account be avoided.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Follow the remediation instructions of the Ensure IAM policies are attached only to groups or roles recommendation.",
      "Url": "http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_avoid_root_usage.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_avoid_root_usage/iam_avoid_root_usage.py

```python
import datetime

import pytz
from dateutil import parser

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client

maximum_access_days = 1


class iam_avoid_root_usage(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        response = iam_client.credential_report

        for user in response:
            if user["user"] == "<root_account>":
                report = Check_Report_AWS(metadata=self.metadata(), resource=user)
                report.region = iam_client.region
                report.resource_id = user["user"]
                report.resource_arn = user["arn"]
                if (
                    user["password_last_used"] != "no_information"
                    or user["access_key_1_last_used_date"] != "N/A"
                    or user["access_key_2_last_used_date"] != "N/A"
                ):
                    if user["password_last_used"] != "no_information":
                        days_since_accessed = (
                            datetime.datetime.now(pytz.utc)
                            - parser.parse(user["password_last_used"])
                        ).days
                    elif user["access_key_1_last_used_date"] != "N/A":
                        days_since_accessed = (
                            datetime.datetime.now(pytz.utc)
                            - parser.parse(user["access_key_1_last_used_date"])
                        ).days
                    elif user["access_key_2_last_used_date"] != "N/A":
                        days_since_accessed = (
                            datetime.datetime.now(pytz.utc)
                            - parser.parse(user["access_key_2_last_used_date"])
                        ).days
                    if maximum_access_days >= days_since_accessed:
                        report.status = "FAIL"
                        report.status_extended = f"Root user in the account was last accessed {days_since_accessed} days ago."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"Root user in the account wasn't accessed in the last {maximum_access_days} days."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Root user in the account wasn't accessed in the last {maximum_access_days} days."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_aws_attached_policy_no_administrative_privileges.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_aws_attached_policy_no_administrative_privileges/iam_aws_attached_policy_no_administrative_privileges.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_aws_attached_policy_no_administrative_privileges",
  "CheckTitle": "Ensure IAM AWS-Managed policies that allow full \"*:*\" administrative privileges are not attached",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure IAM AWS-Managed policies that allow full \"*:*\" administrative privileges are not attached",
  "Risk": "IAM policies are the means by which privileges are granted to users, groups, or roles. It is recommended and considered a standard security advice to grant least privilege—that is, granting only the permissions required to perform a task. Determine what users need to do and then craft policies for them that let the users perform only those tasks instead of allowing full administrative privileges. Providing full administrative privileges instead of restricting to the minimum set of permissions that the user is required to do exposes the resources to potentially unwanted actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/iam-policies/iam_47",
      "Terraform": "https://docs.prowler.com/checks/aws/iam-policies/iam_47#terraform"
    },
    "Recommendation": {
      "Text": "It is more secure to start with a minimum set of permissions and grant additional permissions as necessary, rather than starting with permissions that are too lenient and then trying to tighten them later. List policies an analyze if permissions are the least possible to conduct business activities.",
      "Url": "http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_aws_attached_policy_no_administrative_privileges.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_aws_attached_policy_no_administrative_privileges/iam_aws_attached_policy_no_administrative_privileges.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import check_admin_access


class iam_aws_attached_policy_no_administrative_privileges(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        for policy in iam_client.policies.values():
            # Check only for attached AWS policies
            if policy.attached and policy.type == "AWS":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.status = "PASS"
                report.status_extended = f"{policy.type} policy {policy.name} is attached but does not allow '*:*' administrative privileges."
                if policy.document:
                    if check_admin_access(policy.document):
                        report.status = "FAIL"
                        report.status_extended = f"{policy.type} policy {policy.name} is attached and allows '*:*' administrative privileges."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_check_saml_providers_sts.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_check_saml_providers_sts/iam_check_saml_providers_sts.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_check_saml_providers_sts",
  "CheckTitle": "Check if there are SAML Providers then STS can be used",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "Check if there are SAML Providers then STS can be used",
  "Risk": "Without SAML provider users with AWS CLI or AWS API access can use IAM static credentials. SAML helps users to assume role by default each time they authenticate.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable SAML provider and use temporary credentials. You can use temporary security credentials to make programmatic requests for AWS resources using the AWS CLI or AWS API (using the AWS SDKs ). The temporary credentials provide the same permissions that you have with use long-term security credentials such as IAM user credentials. In case of not having SAML provider capabilities prevent usage of long-lived credentials.",
      "Url": "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRoleWithSAML.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_check_saml_providers_sts.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_check_saml_providers_sts/iam_check_saml_providers_sts.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_check_saml_providers_sts(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.saml_providers is not None:
            if not iam_client.saml_providers:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=iam_client.saml_providers
                )
                report.resource_id = iam_client.audited_account
                report.resource_arn = iam_client.audited_account_arn
                report.region = iam_client.region
                report.status = "FAIL"
                report.status_extended = "No SAML Providers found."
                findings.append(report)

            else:
                for provider in iam_client.saml_providers.values():
                    report = Check_Report_AWS(
                        metadata=self.metadata(), resource=provider
                    )
                    report.region = iam_client.region
                    report.status = "PASS"
                    report.status_extended = (
                        f"SAML Provider {provider.name} has been found."
                    )
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_customer_attached_policy_no_administrative_privileges.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_customer_attached_policy_no_administrative_privileges/iam_customer_attached_policy_no_administrative_privileges.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_customer_attached_policy_no_administrative_privileges",
  "CheckTitle": "Ensure IAM Customer-Managed policies that allow full \"*:*\" administrative privileges are not attached",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure IAM Customer-Managed policies that allow full \"*:*\" administrative privileges are not attached",
  "Risk": "IAM policies are the means by which privileges are granted to users, groups, or roles. It is recommended and considered a standard security advice to grant least privilege—that is, granting only the permissions required to perform a task. Determine what users need to do and then craft policies for them that let the users perform only those tasks instead of allowing full administrative privileges. Providing full administrative privileges instead of restricting to the minimum set of permissions that the user is required to do exposes the resources to potentially unwanted actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/iam-policies/iam_47",
      "Terraform": "https://docs.prowler.com/checks/aws/iam-policies/iam_47#terraform"
    },
    "Recommendation": {
      "Text": "It is more secure to start with a minimum set of permissions and grant additional permissions as necessary, rather than starting with permissions that are too lenient and then trying to tighten them later. List policies an analyze if permissions are the least possible to conduct business activities.",
      "Url": "http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_customer_attached_policy_no_administrative_privileges.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_customer_attached_policy_no_administrative_privileges/iam_customer_attached_policy_no_administrative_privileges.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import check_admin_access


class iam_customer_attached_policy_no_administrative_privileges(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        for policy in iam_client.policies.values():
            # Check only for attached custom policies
            if policy.attached and policy.type == "Custom":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.status = "PASS"
                report.status_extended = f"{policy.type} policy {policy.name} is attached but does not allow '*:*' administrative privileges."
                if policy.document:
                    if check_admin_access(policy.document):
                        report.status = "FAIL"
                        report.status_extended = f"{policy.type} policy {policy.name} is attached and allows '*:*' administrative privileges."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_customer_unattached_policy_no_administrative_privileges.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_customer_unattached_policy_no_administrative_privileges/iam_customer_unattached_policy_no_administrative_privileges.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_customer_unattached_policy_no_administrative_privileges",
  "CheckTitle": "Ensure IAM policies that allow full \"*:*\" administrative privileges are not created",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure IAM policies that allow full \"*:*\" administrative privileges are not created, may be eventual consistent if an ephemeral resource is using it",
  "Risk": "IAM policies are the means by which privileges are granted to users, groups, or roles. It is recommended and considered a standard security advice to grant least privilege—that is, granting only the permissions required to perform a task. Determine what users need to do and then craft policies for them that let the users perform only those tasks instead of allowing full administrative privileges. Providing full administrative privileges instead of restricting to the minimum set of permissions that the user is required to do exposes the resources to potentially unwanted actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/iam-policies/iam_47",
      "Terraform": "https://docs.prowler.com/checks/aws/iam-policies/iam_47#terraform"
    },
    "Recommendation": {
      "Text": "It is more secure to start with a minimum set of permissions and grant additional permissions as necessary, rather than starting with permissions that are too lenient and then trying to tighten them later. List policies an analyze if permissions are the least possible to conduct business activities.",
      "Url": "http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_customer_unattached_policy_no_administrative_privileges.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_customer_unattached_policy_no_administrative_privileges/iam_customer_unattached_policy_no_administrative_privileges.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import check_admin_access


class iam_customer_unattached_policy_no_administrative_privileges(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        for policy in iam_client.policies.values():
            # Check only for cutomer unattached policies
            if not policy.attached and policy.type == "Custom":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.status = "PASS"
                report.status_extended = f"{policy.type} policy {policy.name} is unattached and does not allow '*:*' administrative privileges."
                if policy.document:
                    if check_admin_access(policy.document):
                        report.status = "FAIL"
                        report.status_extended = f"{policy.type} policy {policy.name} is unattached and allows '*:*' administrative privileges."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_group_administrator_access_policy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_group_administrator_access_policy/iam_group_administrator_access_policy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_group_administrator_access_policy",
  "CheckTitle": "Ensure No IAM Groups Have Administrator Access Policy",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamGroup",
  "Description": "This check ensures that no IAM groups in your AWS account have the 'AdministratorAccess' policy attached. IAM users with this policy have unrestricted access to all AWS services and resources, which poses a significant security risk if misused.",
  "Risk": "IAM groups with administrator-level permissions can perform any action on any resource in your AWS environment. If these permissions are granted to users unnecessarily or to individuals without sufficient knowledge, it can lead to security vulnerabilities, data leaks, data loss, or unexpected charges.",
  "RelatedUrl": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups_manage.html",
  "Remediation": {
    "Code": {
      "CLI": "aws iam detach-group-policy --group-name <groupname> --policy-arn arn:aws:iam::aws:policy/AdministratorAccess",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/IAM/group-with-privileged-access.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Replace the 'AdministratorAccess' policy with more specific permissions that follow the Principle of Least Privilege. Consider implementing IAM roles such as 'IAM Master' and 'IAM Manager' to manage permissions more securely.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_group_administrator_access_policy.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_group_administrator_access_policy/iam_group_administrator_access_policy.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_group_administrator_access_policy(Check):
    def execute(self) -> List[Check_Report_AWS]:
        findings = []
        for group in iam_client.groups:
            report = Check_Report_AWS(metadata=self.metadata(), resource=group)
            report.region = iam_client.region
            report.status = "PASS"
            report.status_extended = (
                f"IAM Group {group.name} does not have AdministratorAccess policy."
            )
            for policy in group.attached_policies:
                if policy["PolicyName"] == "AdministratorAccess":
                    report.status = "FAIL"
                    report.status_extended = f"IAM Group {group.name} has AdministratorAccess policy attached."
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_allows_privilege_escalation.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_inline_policy_allows_privilege_escalation/iam_inline_policy_allows_privilege_escalation.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_inline_policy_allows_privilege_escalation",
  "CheckTitle": "Ensure no IAM Inline policies allow actions that may lead into Privilege Escalation",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards"
  ],
  "ServiceName": "iam",
  "SubServiceName": "inline_policy",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure no Inline IAM policies allow actions that may lead into Privilege Escalation",
  "Risk": "Users with some IAM permissions are allowed to elevate their privileges up to administrator rights.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Grant usage permission on a per-resource basis and applying least privilege principle.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege"
    }
  },
  "Categories": [
    "privilege-escalation"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_allows_privilege_escalation.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_inline_policy_allows_privilege_escalation/iam_inline_policy_allows_privilege_escalation.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.privilege_escalation import (
    check_privilege_escalation,
)


class iam_inline_policy_allows_privilege_escalation(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for policy in iam_client.policies.values():
            if policy.type == "Inline":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.resource_id = f"{policy.entity}/{policy.name}"
                report.region = iam_client.region
                report.status = "PASS"

                resource_type_str = report.resource_arn.split(":")[-1].split("/")[0]
                resource_attached = report.resource_arn.split("/")[-1]

                report.status_extended = f"{policy.type} policy {policy.name}{' attached to ' + resource_type_str + ' ' + resource_attached if policy.attached else ''} does not allow privilege escalation."

                policies_affected = check_privilege_escalation(
                    getattr(policy, "document", {})
                )

                if policies_affected:
                    report.status = "FAIL"

                    report.status_extended = (
                        f"{policy.type} policy {policy.name}{' attached to ' + resource_type_str + ' ' + resource_attached if policy.attached else ''} allows privilege escalation using the following actions: {policies_affected}".rstrip()
                        + "."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_no_administrative_privileges.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_inline_policy_no_administrative_privileges/iam_inline_policy_no_administrative_privileges.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_inline_policy_no_administrative_privileges",
  "CheckTitle": "Ensure IAM inline policies that allow full \"*:*\" administrative privileges are not associated to IAM identities",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure inline policies that allow full \"*:*\" administrative privileges are not associated to IAM identities",
  "Risk": "IAM policies are the means by which privileges are granted to users, groups or roles. It is recommended and considered a standard security advice to grant least privilege—that is, granting only the permissions required to perform a task. Determine what users need to do and then craft policies for them that let the users perform only those tasks instead of allowing full administrative privileges. Providing full administrative privileges instead of restricting to the minimum set of permissions that the user is required to do exposes the resources to potentially unwanted actions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/aws/iam-policies/iam_47",
      "Terraform": "https://docs.prowler.com/checks/aws/iam-policies/iam_47#terraform"
    },
    "Recommendation": {
      "Text": "It is more secure to start with a minimum set of permissions and grant additional permissions as necessary, rather than starting with permissions that are too lenient and then trying to tighten them later. List policies an analyze if permissions are the least possible to conduct business activities.",
      "Url": "http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_no_administrative_privileges.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_inline_policy_no_administrative_privileges/iam_inline_policy_no_administrative_privileges.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import check_admin_access


class iam_inline_policy_no_administrative_privileges(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        for policy in iam_client.policies.values():
            if policy.type == "Inline":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.resource_id = f"{policy.entity}/{policy.name}"
                report.status = "PASS"

                resource_type_str = report.resource_arn.split(":")[-1].split("/")[0]
                resource_attached = report.resource_arn.split("/")[-1]

                report.status_extended = f"{policy.type} policy {policy.name} attached to {resource_type_str} {resource_attached} does not allow '*:*' administrative privileges."
                if policy.document and check_admin_access(policy.document):
                    report.status = "FAIL"
                    report.status_extended = f"{policy.type} policy {policy.name} attached to {resource_type_str} {resource_attached} allows '*:*' administrative privileges."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_no_full_access_to_cloudtrail.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_inline_policy_no_full_access_to_cloudtrail/iam_inline_policy_no_full_access_to_cloudtrail.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_inline_policy_no_full_access_to_cloudtrail",
  "CheckTitle": "Ensure IAM inline policies that allow full \"cloudtrail:*\" privileges are not created",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "inline_policies",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure IAM inline policies that allow full \"cloudtrail:*\" privileges are not created",
  "Risk": "CloudTrail is a critical service and IAM policies should follow least privilege model for this service in particular",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is more secure to start with a minimum set of permissions and grant additional permissions as necessary, rather than starting with permissions that are too lenient and then trying to tighten them later. List policies an analyze if permissions are the least possible to conduct business activities.",
      "Url": "http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_no_full_access_to_cloudtrail.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_inline_policy_no_full_access_to_cloudtrail/iam_inline_policy_no_full_access_to_cloudtrail.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import check_full_service_access

critical_service = "cloudtrail"


class iam_inline_policy_no_full_access_to_cloudtrail(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for policy in iam_client.policies.values():
            # Check only inline policies
            if policy.type == "Inline":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.resource_id = f"{policy.entity}/{policy.name}"
                report.status = "PASS"

                resource_type_str = report.resource_arn.split(":")[-1].split("/")[0]
                resource_attached = report.resource_arn.split("/")[-1]

                report.status_extended = f"{policy.type} policy {policy.name}{' attached to ' + resource_type_str + ' ' + resource_attached if policy.attached else ''} does not allow '{critical_service}:*' privileges."

                if policy.document and check_full_service_access(
                    critical_service, policy.document
                ):
                    report.status = "FAIL"
                    report.status_extended = f"{policy.type} policy {policy.name}{' attached to ' + resource_type_str + ' ' + resource_attached if policy.attached else ''} allows '{critical_service}:*' privileges to all resources."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_no_full_access_to_kms.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_inline_policy_no_full_access_to_kms/iam_inline_policy_no_full_access_to_kms.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_inline_policy_no_full_access_to_kms",
  "CheckTitle": "Ensure IAM inline policies that allow full \"kms:*\" privileges are not created",
  "CheckType": [
    "Software and Configuration Checks"
  ],
  "ServiceName": "iam",
  "SubServiceName": "inline_policy",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure IAM inline policies that allow full \"kms:*\" privileges are not created",
  "Risk": "KMS is a critical service and IAM policies should follow least privilege model for this service in particular",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is more secure to start with a minimum set of permissions and grant additional permissions as necessary, rather than starting with permissions that are too lenient and then trying to tighten them later. List policies an analyze if permissions are the least possible to conduct business activities.",
      "Url": "http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_inline_policy_no_full_access_to_kms.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_inline_policy_no_full_access_to_kms/iam_inline_policy_no_full_access_to_kms.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import check_full_service_access

critical_service = "kms"


class iam_inline_policy_no_full_access_to_kms(Check):
    def execute(self):
        findings = []

        for policy in iam_client.policies.values():
            if policy.type == "Inline":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.resource_id = f"{policy.entity}/{policy.name}"
                report.status = "PASS"

                resource_type_str = report.resource_arn.split(":")[-1].split("/")[0]
                resource_attached = report.resource_arn.split("/")[-1]

                report.status_extended = f"{policy.type} policy {policy.name}{' attached to ' + resource_type_str + ' ' + resource_attached if policy.attached else ''} does not allow '{critical_service}:*' privileges."

                if policy.document and check_full_service_access(
                    critical_service, policy.document
                ):
                    report.status = "FAIL"
                    report.status_extended = f"{policy.type} policy {policy.name}{' attached to ' + resource_type_str + ' ' + resource_attached if policy.attached else ''} allows '{critical_service}:*' privileges."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
