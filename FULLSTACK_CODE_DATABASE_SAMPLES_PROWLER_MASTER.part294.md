---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 294
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 294 of 867)

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

---[FILE: iam_password_policy_symbol.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_symbol/iam_password_policy_symbol.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_password_policy_symbol(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.password_policy:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=iam_client.password_policy
            )
            report.region = iam_client.region
            report.resource_arn = iam_client.password_policy_arn_template
            report.resource_id = iam_client.audited_account
            # Check if symbol flag is set
            if iam_client.password_policy.symbols:
                report.status = "PASS"
                report.status_extended = (
                    "IAM password policy requires at least one symbol."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    "IAM password policy does not require at least one symbol."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_symbol_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_symbol/iam_password_policy_symbol_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_id: str) -> bool:
    """
    Enable IAM password policy to require symbols or the configurable value in prowler/config/fixer_config.yaml.
    Requires the iam:UpdateAccountPasswordPolicy permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "iam:UpdateAccountPasswordPolicy",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): AWS account ID
    Returns:
        bool: True if IAM password policy is updated, False otherwise
    """
    try:
        iam_client.client.update_account_password_policy(
            MinimumPasswordLength=iam_client.password_policy.length,
            RequireSymbols=iam_client.fixer_config.get("iam_password_policy", {}).get(
                "RequireSymbols", True
            ),
            RequireNumbers=iam_client.password_policy.numbers,
            RequireUppercaseCharacters=iam_client.password_policy.uppercase,
            RequireLowercaseCharacters=iam_client.password_policy.lowercase,
            AllowUsersToChangePassword=iam_client.password_policy.allow_change,
            MaxPasswordAge=iam_client.password_policy.max_age,
            PasswordReusePrevention=iam_client.password_policy.reuse_prevention,
            HardExpiry=iam_client.password_policy.hard_expiry,
        )
    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_uppercase.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_uppercase/iam_password_policy_uppercase.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_password_policy_uppercase",
  "CheckTitle": "Ensure IAM password policy requires at least one uppercase letter",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Ensure IAM password policy requires at least one uppercase letter",
  "Risk": "Password policies are used to enforce password complexity requirements. IAM password policies can be used to ensure password are comprised of different character sets. It is recommended that the password policy require at least one uppercase letter.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure \"Requires at least one uppercase letter\" is checked under \"Password Policy\".",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_uppercase.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_uppercase/iam_password_policy_uppercase.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_password_policy_uppercase(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.password_policy:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=iam_client.password_policy
            )
            report.region = iam_client.region
            report.resource_arn = iam_client.password_policy_arn_template
            report.resource_id = iam_client.audited_account
            # Check if uppercase flag is set
            if iam_client.password_policy.uppercase:
                report.status = "PASS"
                report.status_extended = (
                    "IAM password policy requires at least one uppercase letter."
                )
            else:
                report.status = "FAIL"
                report.status_extended = "IAM password policy does not require at least one uppercase letter."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_uppercase_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_uppercase/iam_password_policy_uppercase_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_id: str) -> bool:
    """
    Enable IAM password policy to require uppercase characters or the configurable value in prowler/config/fixer_config.yaml.
    Requires the iam:UpdateAccountPasswordPolicy permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "iam:UpdateAccountPasswordPolicy",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): AWS account ID
    Returns:
        bool: True if IAM password policy is updated, False otherwise
    """
    try:
        iam_client.client.update_account_password_policy(
            MinimumPasswordLength=iam_client.password_policy.length,
            RequireSymbols=iam_client.password_policy.symbols,
            RequireNumbers=iam_client.password_policy.numbers,
            RequireUppercaseCharacters=iam_client.fixer_config.get(
                "iam_password_policy", {}
            ).get("RequireUppercaseCharacters", True),
            RequireLowercaseCharacters=iam_client.password_policy.lowercase,
            AllowUsersToChangePassword=iam_client.password_policy.allow_change,
            MaxPasswordAge=iam_client.password_policy.max_age,
            PasswordReusePrevention=iam_client.password_policy.reuse_prevention,
            HardExpiry=iam_client.password_policy.hard_expiry,
        )
    except Exception as error:
        logger.error(
            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_allows_privilege_escalation.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_allows_privilege_escalation/iam_policy_allows_privilege_escalation.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_policy_allows_privilege_escalation",
  "CheckTitle": "Ensure no Customer Managed IAM policies allow actions that may lead into Privilege Escalation",
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
  "Description": "Ensure no Customer Managed IAM policies allow actions that may lead into Privilege Escalation",
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
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_allows_privilege_escalation.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_allows_privilege_escalation/iam_policy_allows_privilege_escalation.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.privilege_escalation import (
    check_privilege_escalation,
)


class iam_policy_allows_privilege_escalation(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for policy in iam_client.policies.values():
            if policy.type == "Custom":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.status = "PASS"
                report.status_extended = f"Custom Policy {report.resource_arn} does not allow privilege escalation."

                policies_affected = check_privilege_escalation(
                    getattr(policy, "document", {})
                )

                if policies_affected:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Custom Policy {report.resource_arn} allows privilege escalation using the following actions: {policies_affected}".rstrip()
                        + "."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_attached_only_to_group_or_roles.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_attached_only_to_group_or_roles/iam_policy_attached_only_to_group_or_roles.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_policy_attached_only_to_group_or_roles",
  "CheckTitle": "Ensure IAM policies are attached only to groups or roles",
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
  "Description": "Ensure IAM policies are attached only to groups or roles",
  "Risk": "By default IAM users, groups, and roles have no access to AWS resources. IAM policies are the means by which privileges are granted to users, groups, or roles. It is recommended that IAM policies be applied directly to groups and roles but not users. Assigning privileges at the group or role level reduces the complexity of access management as the number of users grow. Reducing access management complexity may in-turn reduce opportunity for a principal to inadvertently receive or retain excessive privileges.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Remove any policy attached directly to the user. Use groups or roles instead.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_attached_only_to_group_or_roles.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_attached_only_to_group_or_roles/iam_policy_attached_only_to_group_or_roles.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_policy_attached_only_to_group_or_roles(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.users:
            for user in iam_client.users:
                if user.attached_policies or user.inline_policies:
                    if user.attached_policies:
                        for policy in user.attached_policies:
                            report = Check_Report_AWS(
                                metadata=self.metadata(), resource=user
                            )
                            report.region = iam_client.region
                            report.status = "FAIL"
                            report.status_extended = f"User {user.name} has the policy {policy['PolicyName']} attached."
                            report.resource_id = f"{user.name}/{policy['PolicyName']}"
                            findings.append(report)
                    if user.inline_policies:
                        for policy in user.inline_policies:
                            report = Check_Report_AWS(
                                metadata=self.metadata(), resource=user
                            )
                            report.region = iam_client.region
                            report.status = "FAIL"
                            report.status_extended = f"User {user.name} has the inline policy {policy} attached."
                            report.resource_id = f"{user.name}/{policy}"
                            findings.append(report)

                else:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=user)
                    report.region = iam_client.region
                    report.status = "PASS"
                    report.status_extended = (
                        f"User {user.name} has no inline or attached policies."
                    )
                    findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_cloudshell_admin_not_attached.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_cloudshell_admin_not_attached/iam_policy_cloudshell_admin_not_attached.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_policy_cloudshell_admin_not_attached",
  "CheckTitle": "Check if IAM identities (users,groups,roles) have the AWSCloudShellFullAccess policy attached.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:iam::{account-id}:{resource-type}/{resource-id}",
  "Severity": "medium",
  "ResourceType": "AwsIamPolicy",
  "Description": "This control checks whether an IAM identity (user, role, or group) has the AWS managed policy AWSCloudShellFullAccess attached. The control fails if an IAM identity has the AWSCloudShellFullAccess policy attached.",
  "Risk": "Attaching the AWSCloudShellFullAccess policy to IAM identities grants broad permissions, including internet access and file transfer capabilities, which can lead to security risks such as data exfiltration. The principle of least privilege should be followed to avoid excessive permissions.",
  "RelatedUrl": "https://docs.aws.amazon.com/config/latest/developerguide/iam-policy-blacklisted-check.html",
  "Remediation": {
    "Code": {
      "CLI": "aws iam detach-user/role/group-policy --user/role/group-name <user/role/group-name> --policy-arn arn:aws:iam::aws:policy/AWSCloudShellFullAccess",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/iam-controls.html#iam-27",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Detach the AWSCloudShellFullAccess policy from the IAM identity to restrict excessive permissions and adhere to the principle of least privilege.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_cloudshell_admin_not_attached.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_cloudshell_admin_not_attached/iam_policy_cloudshell_admin_not_attached.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_policy_cloudshell_admin_not_attached(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.entities_attached_to_cloudshell_policy:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=iam_client.entities_attached_to_cloudshell_policy,
            )
            report.region = iam_client.region
            report.resource_id = iam_client.audited_account
            report.resource_arn = f"arn:{iam_client.audited_partition}:iam::aws:policy/AWSCloudShellFullAccess"
            entities = iam_client.entities_attached_to_cloudshell_policy

            if entities["Users"] or entities["Groups"] or entities["Roles"]:
                report.status = "FAIL"
                attached_entities = [
                    (key, ", ".join(entities[key]))
                    for key in ["Users", "Groups", "Roles"]
                    if entities[key]
                ]
                entity_strings = [
                    f"{entity[0]}: {entity[1]}" for entity in attached_entities
                ]
                report.status_extended = f"AWS CloudShellFullAccess policy attached to IAM {', '.join(entity_strings)}."
            else:
                report.status = "PASS"
                report.status_extended = (
                    "AWS CloudShellFullAccess policy is not attached to any IAM entity."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_no_full_access_to_cloudtrail.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_no_full_access_to_cloudtrail/iam_policy_no_full_access_to_cloudtrail.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_policy_no_full_access_to_cloudtrail",
  "CheckTitle": "Ensure IAM policies that allow full \"cloudtrail:*\" privileges are not created",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure IAM policies that allow full \"cloudtrail:*\" privileges are not created",
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

---[FILE: iam_policy_no_full_access_to_cloudtrail.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_no_full_access_to_cloudtrail/iam_policy_no_full_access_to_cloudtrail.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import check_full_service_access

critical_service = "cloudtrail"


class iam_policy_no_full_access_to_cloudtrail(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        for policy in iam_client.policies.values():
            # Check only custom policies
            if policy.type == "Custom":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.status = "PASS"
                report.status_extended = f"Custom Policy {policy.name} does not allow '{critical_service}:*' privileges."

                if policy.document and check_full_service_access(
                    critical_service, policy.document
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Custom Policy {policy.name} allows '{critical_service}:*' privileges."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_policy_no_full_access_to_kms.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_no_full_access_to_kms/iam_policy_no_full_access_to_kms.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_policy_no_full_access_to_kms",
  "CheckTitle": "Ensure IAM policies that allow full \"kms:*\" privileges are not created",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure IAM policies that allow full \"kms:*\" privileges are not created",
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

---[FILE: iam_policy_no_full_access_to_kms.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_policy_no_full_access_to_kms/iam_policy_no_full_access_to_kms.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import check_full_service_access

critical_service = "kms"


class iam_policy_no_full_access_to_kms(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        for policy in iam_client.policies.values():
            # Check only custom policies
            if policy.type == "Custom":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.status = "PASS"
                report.status_extended = f"Custom Policy {policy.name} does not allow '{critical_service}:*' privileges."
                if policy.document and check_full_service_access(
                    critical_service, policy.document
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Custom Policy {policy.name} allows '{critical_service}:*' privileges."

                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_role_administratoraccess_policy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_role_administratoraccess_policy/iam_role_administratoraccess_policy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_role_administratoraccess_policy",
  "CheckTitle": "Ensure IAM Roles do not have AdministratorAccess policy attached",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamRole",
  "Description": "Ensure IAM Roles do not have AdministratorAccess policy attached",
  "Risk": "The AWS-managed AdministratorAccess policy grants all actions for all AWS services and for all resources in the account and as such exposes the customer to a significant data leakage threat. It should be granted very conservatively. For granting access to 3rd party vendors, consider using alternative managed policies, such as ViewOnlyAccess or SecurityAudit.",
  "RelatedUrl": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html#jf_administrator",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Apply the principle of least privilege. Instead of AdministratorAccess, assign only the permissions necessary for specific roles and tasks. Create custom IAM policies with minimal permissions based on the principle of least privilege.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_role_administratoraccess_policy.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_role_administratoraccess_policy/iam_role_administratoraccess_policy.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_role_administratoraccess_policy(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.roles:
            for role in iam_client.roles:
                if (
                    not role.is_service_role
                ):  # Avoid service roles since they cannot be modified by the user
                    report = Check_Report_AWS(metadata=self.metadata(), resource=role)
                    report.region = iam_client.region
                    report.status = "PASS"
                    report.status_extended = f"IAM Role {role.name} does not have AdministratorAccess policy."
                    for policy in role.attached_policies:
                        if policy["PolicyName"] == "AdministratorAccess":
                            report.status_extended = f"IAM Role {role.name} has AdministratorAccess policy attached."
                            report.status = "FAIL"

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_role_cross_account_readonlyaccess_policy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_role_cross_account_readonlyaccess_policy/iam_role_cross_account_readonlyaccess_policy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_role_cross_account_readonlyaccess_policy",
  "CheckTitle": "Ensure IAM Roles do not have ReadOnlyAccess access for external AWS accounts",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamRole",
  "Description": "Ensure IAM Roles do not have ReadOnlyAccess access for external AWS accounts",
  "Risk": "The AWS-managed ReadOnlyAccess policy is highly potent and exposes the customer to a significant data leakage threat. It should be granted very conservatively. For granting access to 3rd party vendors, consider using alternative managed policies, such as ViewOnlyAccess or SecurityAudit.",
  "RelatedUrl": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html#awsmp_readonlyaccess",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Remove the AWS-managed ReadOnlyAccess policy from all roles that have a trust policy, including third-party cloud accounts, or remove third-party cloud accounts from the trust policy of all roles that need the ReadOnlyAccess policy.",
      "Url": "https://docs.securestate.vmware.com/rule-docs/aws-iam-role-cross-account-readonlyaccess-policy"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_role_cross_account_readonlyaccess_policy.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_role_cross_account_readonlyaccess_policy/iam_role_cross_account_readonlyaccess_policy.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_role_cross_account_readonlyaccess_policy(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.roles:
            for role in iam_client.roles:
                if (
                    not role.is_service_role
                ):  # Avoid service roles since they cannot be modified by the user
                    report = Check_Report_AWS(metadata=self.metadata(), resource=role)
                    report.region = iam_client.region
                    report.status = "PASS"
                    report.status_extended = (
                        f"IAM Role {role.name} does not have ReadOnlyAccess policy."
                    )
                    for policy in role.attached_policies:
                        if policy["PolicyName"] == "ReadOnlyAccess":
                            report.status_extended = f"IAM Role {role.name} has read-only access but is not cross account."
                            cross_account_access = False
                            if isinstance(role.assume_role_policy["Statement"], list):
                                for statement in role.assume_role_policy["Statement"]:
                                    if not cross_account_access:
                                        if (
                                            statement["Effect"] == "Allow"
                                            and "AWS" in statement["Principal"]
                                        ):
                                            if isinstance(
                                                statement["Principal"]["AWS"], list
                                            ):
                                                for aws_account in statement[
                                                    "Principal"
                                                ]["AWS"]:
                                                    if (
                                                        iam_client.audited_account
                                                        not in aws_account
                                                        or "*" == aws_account
                                                    ):
                                                        cross_account_access = True
                                                        break
                                            else:
                                                if (
                                                    iam_client.audited_account
                                                    not in statement["Principal"]["AWS"]
                                                    or "*"
                                                    == statement["Principal"]["AWS"]
                                                ):
                                                    cross_account_access = True
                                    else:
                                        break
                            else:
                                statement = role.assume_role_policy["Statement"]
                                if (
                                    statement["Effect"] == "Allow"
                                    and "AWS" in statement["Principal"]
                                ):
                                    if isinstance(statement["Principal"]["AWS"], list):
                                        for aws_account in statement["Principal"][
                                            "AWS"
                                        ]:
                                            if (
                                                iam_client.audited_account
                                                not in aws_account
                                                or "*" == aws_account
                                            ):
                                                cross_account_access = True
                                                break
                                    else:
                                        if (
                                            iam_client.audited_account
                                            not in statement["Principal"]["AWS"]
                                            or "*" == statement["Principal"]["AWS"]
                                        ):
                                            cross_account_access = True
                            if cross_account_access:
                                report.status = "FAIL"
                                report.status_extended = f"IAM Role {role.name} gives cross account read-only access."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_role_cross_service_confused_deputy_prevention.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_role_cross_service_confused_deputy_prevention/iam_role_cross_service_confused_deputy_prevention.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_role_cross_service_confused_deputy_prevention",
  "CheckTitle": "Ensure IAM Service Roles prevents against a cross-service confused deputy attack",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamRole",
  "Description": "Ensure IAM Service Roles prevents against a cross-service confused deputy attack",
  "Risk": "Allow attackers to gain unauthorized access to resources",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To mitigate cross-service confused deputy attacks, it's recommended to use the aws:SourceArn and aws:SourceAccount global condition context keys in your IAM role trust policies. If the role doesn't support these fields, consider implementing alternative security measures, such as defining more restrictive resource-based policies or using service-specific trust policies, to limit the role's permissions and exposure. For detailed guidance, refer to AWS's documentation on preventing cross-service confused deputy issues.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html#cross-service-confused-deputy-prevention"
    }
  },
  "Categories": [
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_role_cross_service_confused_deputy_prevention.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_role_cross_service_confused_deputy_prevention/iam_role_cross_service_confused_deputy_prevention.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class iam_role_cross_service_confused_deputy_prevention(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.roles:
            for role in iam_client.roles:
                # This check should only be performed against service roles (avoid Service Linked Roles since the trust relationship cannot be changed)
                if role.is_service_role and "aws-service-role" not in role.arn:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=role)
                    report.region = iam_client.region
                    report.status = "FAIL"
                    report.status_extended = f"IAM Service Role {role.name} does not prevent against a cross-service confused deputy attack."
                    if not is_policy_public(
                        role.assume_role_policy,
                        iam_client.audited_account,
                        check_cross_service_confused_deputy=True,
                        not_allowed_actions=["sts:AssumeRole", "sts:*"],
                    ):
                        report.status = "PASS"
                        report.status_extended = f"IAM Service Role {role.name} prevents against a cross-service confused deputy attack."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
