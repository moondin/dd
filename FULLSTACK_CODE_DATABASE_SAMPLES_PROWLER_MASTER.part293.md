---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 293
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 293 of 867)

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

---[FILE: iam_no_custom_policy_permissive_role_assumption.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_no_custom_policy_permissive_role_assumption/iam_no_custom_policy_permissive_role_assumption.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_no_custom_policy_permissive_role_assumption",
  "CheckTitle": "Ensure that no custom IAM policies exist which allow permissive role assumption (e.g. sts:AssumeRole on *)",
  "CheckType": [
    "Software and Configuration Checks"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamPolicy",
  "Description": "Ensure that no custom IAM policies exist which allow permissive role assumption (e.g. sts:AssumeRole on *)",
  "Risk": "If not restricted unintended access could happen.",
  "RelatedUrl": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_permissions-to-switch.html#roles-usingrole-createpolicy",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use the least privilege principle when granting permissions.",
      "Url": "https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_no_custom_policy_permissive_role_assumption.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_no_custom_policy_permissive_role_assumption/iam_no_custom_policy_permissive_role_assumption.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_no_custom_policy_permissive_role_assumption(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        def resource_has_wildcard(resource):
            if isinstance(resource, str):
                return "*" in resource
            if isinstance(resource, list):
                return any("*" in r for r in resource)
            return False

        for policy in iam_client.policies.values():
            # Check only custom policies
            if policy.type == "Custom":
                report = Check_Report_AWS(metadata=self.metadata(), resource=policy)
                report.region = iam_client.region
                report.status = "PASS"
                report.status_extended = f"Custom Policy {policy.name} does not allow permissive STS Role assumption."

                if policy.document:
                    if not isinstance(policy.document["Statement"], list):
                        policy_statements = [policy.document["Statement"]]
                    else:
                        policy_statements = policy.document["Statement"]
                    for statement in policy_statements:
                        if (
                            statement.get("Effect") == "Allow"
                            and "Action" in statement
                            and "Resource" in statement
                            and resource_has_wildcard(statement["Resource"])
                        ):
                            actions = (
                                statement["Action"]
                                if isinstance(statement["Action"], list)
                                else [statement["Action"]]
                            )
                            for action in actions:
                                if action in ["sts:AssumeRole", "sts:*", "*"]:
                                    report.status = "FAIL"
                                    report.status_extended = f"Custom Policy {policy.name} allows permissive STS Role assumption."
                                    break
                            if report.status == "FAIL":
                                break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_no_expired_server_certificates_stored.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_no_expired_server_certificates_stored/iam_no_expired_server_certificates_stored.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_no_expired_server_certificates_stored",
  "CheckTitle": "Ensure that all the expired SSL/TLS certificates stored in AWS IAM are removed.",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "Other",
  "Description": "Ensure that all the expired SSL/TLS certificates stored in AWS IAM are removed.",
  "Risk": "Removing expired SSL/TLS certificates eliminates the risk that an invalid certificate will be deployed accidentally to a resource such as AWS Elastic Load Balancer (ELB), which can damage the credibility of the application/website behind the ELB.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws iam delete-server-certificate --server-certificate-name <CERTIFICATE_NAME",
      "NativeIaC": "",
      "Other": "Removing expired certificates via AWS Management Console is not currently supported.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Deleting the certificate could have implications for your application if you are using an expired server certificate with Elastic Load Balancing, CloudFront, etc. One has to make configurations at respective services to ensure there is no interruption in application functionality.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_server-certs.html"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Data Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_no_expired_server_certificates_stored.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_no_expired_server_certificates_stored/iam_no_expired_server_certificates_stored.py

```python
from datetime import datetime, timezone

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_no_expired_server_certificates_stored(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for certificate in iam_client.server_certificates:
            report = Check_Report_AWS(metadata=self.metadata(), resource=certificate)
            report.region = iam_client.region
            expiration_days = (datetime.now(timezone.utc) - certificate.expiration).days
            if expiration_days >= 0:
                report.status = "FAIL"
                report.status_extended = f"IAM Certificate {certificate.name} has expired {expiration_days} days ago."
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"IAM Certificate {certificate.name} is not expired."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_no_root_access_key.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_no_root_access_key/iam_no_root_access_key.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_no_root_access_key",
  "CheckTitle": "Ensure no root account access key exists",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsIamAccessKey",
  "Description": "Ensure no root account access key exists",
  "Risk": "The root account is the most privileged user in an AWS account. AWS Access Keys provide programmatic access to a given AWS account. It is recommended that all access keys associated with the root account be removed. Removing access keys associated with the root account limits vectors by which the account can be compromised. Removing the root access keys encourages the creation and use of role based accounts that are least privileged.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use the credential report to check the user and ensure the access_key_1_active and access_key_2_active fields are set to FALSE. If using AWS Organizations, consider enabling Centralized Root Management and removing individual root credentials.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_no_root_access_key.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_no_root_access_key/iam_no_root_access_key.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_no_root_access_key(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        if iam_client.credential_report:
            for user in iam_client.credential_report:
                if user["user"] == "<root_account>":
                    password_enabled = user["password_enabled"] == "true"
                    access_key_1_active = user["access_key_1_active"] == "true"
                    access_key_2_active = user["access_key_2_active"] == "true"

                    # Only report if root actually has credentials
                    if password_enabled or access_key_1_active or access_key_2_active:
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=user
                        )
                        report.region = iam_client.region
                        report.resource_id = user["user"]
                        report.resource_arn = user["arn"]

                        # Check if organization manages root credentials
                        org_managed = (
                            iam_client.organization_features is not None
                            and "RootCredentialsManagement"
                            in iam_client.organization_features
                        )

                        if not access_key_1_active and not access_key_2_active:
                            report.status = "PASS"
                            if org_managed:
                                report.status_extended = (
                                    "Root account has password configured but no access keys. "
                                    "Consider removing individual root credentials since organizational "
                                    "root management is active."
                                )
                            else:
                                report.status_extended = (
                                    "Root account does not have access keys."
                                )
                        elif access_key_1_active and access_key_2_active:
                            report.status = "FAIL"
                            if org_managed:
                                report.status_extended = (
                                    "Root account has two active access keys "
                                    "despite organizational root management being enabled."
                                )
                            else:
                                report.status_extended = (
                                    "Root account has two active access keys."
                                )
                        else:
                            report.status = "FAIL"
                            if org_managed:
                                report.status_extended = (
                                    "Root account has one active access key "
                                    "despite organizational root management being enabled."
                                )
                            else:
                                report.status_extended = (
                                    "Root account has one active access key."
                                )
                        findings.append(report)
                    break

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_expires_passwords_within_90_days_or_less.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_expires_passwords_within_90_days_or_less/iam_password_policy_expires_passwords_within_90_days_or_less.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_password_policy_expires_passwords_within_90_days_or_less",
  "CheckTitle": "Ensure IAM password policy expires passwords within 90 days or less",
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
  "Description": "Ensure IAM password policy expires passwords within 90 days or less",
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
      "Text": "Ensure Password expiration period (in days): is set to 90 or less.",
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

---[FILE: iam_password_policy_expires_passwords_within_90_days_or_less.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_expires_passwords_within_90_days_or_less/iam_password_policy_expires_passwords_within_90_days_or_less.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_password_policy_expires_passwords_within_90_days_or_less(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.password_policy:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=iam_client.password_policy
            )
            report.region = iam_client.region
            report.resource_arn = iam_client.password_policy_arn_template
            report.resource_id = iam_client.audited_account
            # Check if password policy expiration exists
            if iam_client.password_policy.max_age:
                if iam_client.password_policy.max_age <= 90:
                    report.status = "PASS"
                    report.status_extended = f"Password expiration is set lower than 90 days ({iam_client.password_policy.max_age} days)."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"Password expiration is set greater than 90 days ({iam_client.password_policy.max_age} days)."
            else:
                report.status = "FAIL"
                report.status_extended = "Password expiration is not set."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_expires_passwords_within_90_days_or_less_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_expires_passwords_within_90_days_or_less/iam_password_policy_expires_passwords_within_90_days_or_less_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_id: str) -> bool:
    """
    Enable IAM password policy to expire passwords within 90 days or less or the configurable value in prowler/config/fixer_config.yaml.
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
            RequireUppercaseCharacters=iam_client.password_policy.uppercase,
            RequireLowercaseCharacters=iam_client.password_policy.lowercase,
            AllowUsersToChangePassword=iam_client.password_policy.allow_change,
            MaxPasswordAge=iam_client.fixer_config.get("iam_password_policy", {}).get(
                "MaxPasswordAge", 90
            ),
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

---[FILE: iam_password_policy_lowercase.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_lowercase/iam_password_policy_lowercase.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_password_policy_lowercase",
  "CheckTitle": "Ensure IAM password policy require at least one lowercase letter",
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
  "Risk": "Password policies are used to enforce password complexity requirements. IAM password policies can be used to ensure password are comprised of different character sets. It is recommended that the password policy require at least one lowercase letter.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure \"Requires at least one lowercase letter\" is checked under \"Password Policy\".",
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

---[FILE: iam_password_policy_lowercase.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_lowercase/iam_password_policy_lowercase.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_password_policy_lowercase(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.password_policy:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=iam_client.password_policy
            )
            report.region = iam_client.region
            report.resource_arn = iam_client.password_policy_arn_template
            report.resource_id = iam_client.audited_account
            # Check if lowercase flag is set
            if iam_client.password_policy.lowercase:
                report.status = "PASS"
                report.status_extended = (
                    "IAM password policy requires at least one lowercase letter."
                )
            else:
                report.status = "FAIL"
                report.status_extended = "IAM password policy does not require at least one lowercase letter."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_lowercase_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_lowercase/iam_password_policy_lowercase_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_id: str) -> bool:
    """
    Enable IAM password policy to require lowercase characters or the configurable value in prowler/config/fixer_config.yaml.
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
            RequireUppercaseCharacters=iam_client.password_policy.uppercase,
            RequireLowercaseCharacters=iam_client.fixer_config.get(
                "iam_password_policy", {}
            ).get("RequireLowercaseCharacters", True),
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

---[FILE: iam_password_policy_minimum_length_14.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_minimum_length_14/iam_password_policy_minimum_length_14.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_password_policy_minimum_length_14",
  "CheckTitle": "Ensure IAM password policy requires minimum length of 14 or greater",
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
  "Description": "Ensure IAM password policy requires minimum length of 14 or greater",
  "Risk": "Password policies are used to enforce password complexity requirements. IAM password policies can be used to ensure password are comprised of different character sets. It is recommended that the password policy require minimum length of 14 or greater.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure \"Minimum password length\" is checked under \"Password Policy\".",
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

---[FILE: iam_password_policy_minimum_length_14.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_minimum_length_14/iam_password_policy_minimum_length_14.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_password_policy_minimum_length_14(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.password_policy:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=iam_client.password_policy
            )
            report.region = iam_client.region
            report.resource_arn = iam_client.password_policy_arn_template
            report.resource_id = iam_client.audited_account
            # Check password policy length
            if (
                iam_client.password_policy.length
                and iam_client.password_policy.length >= 14
            ):
                report.status = "PASS"
                report.status_extended = (
                    "IAM password policy requires minimum length of 14 characters."
                )
            else:
                report.status = "FAIL"
                report.status_extended = "IAM password policy does not require minimum length of 14 characters."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_minimum_length_14_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_minimum_length_14/iam_password_policy_minimum_length_14_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_id: str) -> bool:
    """
    Enable IAM password policy to require a minimum password length of 14 characters or the configurable value in prowler/config/fixer_config.yaml.
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
            MinimumPasswordLength=iam_client.fixer_config.get(
                "iam_password_policy", {}
            ).get("MinimumPasswordLength", 14),
            RequireSymbols=iam_client.password_policy.symbols,
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

---[FILE: iam_password_policy_number.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_number/iam_password_policy_number.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_password_policy_number",
  "CheckTitle": "Ensure IAM password policy require at least one number",
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
  "Description": "Ensure IAM password policy require at least one number",
  "Risk": "Password policies are used to enforce password complexity requirements. IAM password policies can be used to ensure password are comprised of different character sets. It is recommended that the password policy require at least one number.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure \"Require at least one number\" is checked under \"Password Policy\".",
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

---[FILE: iam_password_policy_number.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_number/iam_password_policy_number.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_password_policy_number(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.password_policy:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=iam_client.password_policy
            )
            report.region = iam_client.region
            report.resource_arn = iam_client.password_policy_arn_template
            report.resource_id = iam_client.audited_account
            # Check if number flag is set
            if iam_client.password_policy.numbers:
                report.status = "PASS"
                report.status_extended = (
                    "IAM password policy requires at least one number."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    "IAM password policy does not require at least one number."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_number_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_number/iam_password_policy_number_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_id: str) -> bool:
    """
    Enable IAM password policy to require numbers or the configurable value in prowler/config/fixer_config.yaml.
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
            RequireNumbers=iam_client.fixer_config.get("iam_password_policy", {}).get(
                "RequireNumbers", True
            ),
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

---[FILE: iam_password_policy_reuse_24.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_reuse_24/iam_password_policy_reuse_24.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_password_policy_reuse_24",
  "CheckTitle": "Ensure IAM password policy prevents password reuse: 24 or greater",
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
  "Description": "Ensure IAM password policy prevents password reuse: 24 or greater",
  "Risk": "Password policies are used to enforce password complexity requirements. IAM password policies can be used to ensure password are comprised of different character sets. It is recommended that the password policy prevents at least password reuse of 24 or greater.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure \"Number of passwords to remember\" is set to 24.",
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

---[FILE: iam_password_policy_reuse_24.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_reuse_24/iam_password_policy_reuse_24.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_password_policy_reuse_24(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.password_policy:
            report = Check_Report_AWS(
                metadata=self.metadata(), resource=iam_client.password_policy
            )
            report.region = iam_client.region
            report.resource_arn = iam_client.password_policy_arn_template
            report.resource_id = iam_client.audited_account
            # Check if reuse prevention flag is set
            if (
                iam_client.password_policy.reuse_prevention
                and iam_client.password_policy.reuse_prevention == 24
            ):
                report.status = "PASS"
                report.status_extended = (
                    "IAM password policy reuse prevention is equal to 24."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    "IAM password policy reuse prevention is less than 24 or not set."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_password_policy_reuse_24_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_reuse_24/iam_password_policy_reuse_24_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


def fixer(resource_id: str) -> bool:
    """
    Enable IAM password policy to prevent reusing the 24 previous passwords or the configurable value in prowler/config/fixer_config.yaml.
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
            RequireUppercaseCharacters=iam_client.password_policy.uppercase,
            RequireLowercaseCharacters=iam_client.password_policy.lowercase,
            AllowUsersToChangePassword=iam_client.password_policy.allow_change,
            MaxPasswordAge=iam_client.password_policy.max_age,
            PasswordReusePrevention=iam_client.fixer_config.get(
                "iam_password_policy", {}
            ).get("PasswordReusePrevention", 24),
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

---[FILE: iam_password_policy_symbol.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_password_policy_symbol/iam_password_policy_symbol.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_password_policy_symbol",
  "CheckTitle": "Ensure IAM password policy require at least one symbol",
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
  "Description": "Ensure IAM password policy require at least one symbol",
  "Risk": "Password policies are used to enforce password complexity requirements. IAM password policies can be used to ensure password are comprised of different character sets. It is recommended that the password policy require at least one non-alphanumeric character.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure \"Require at least one non-alphanumeric character\" is checked under \"Password Policy\".",
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

````
