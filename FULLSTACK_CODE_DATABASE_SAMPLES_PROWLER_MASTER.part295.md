---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 295
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 295 of 867)

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

---[FILE: iam_root_credentials_management_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_root_credentials_management_enabled/iam_root_credentials_management_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_root_credentials_management_enabled",
  "CheckTitle": "Ensure centralized root credentials management is enabled",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "Checks if centralized management of root credentials for member accounts in AWS Organizations is enabled. This ensures that root credentials are managed centrally, reducing the risk of unauthorized access or mismanagement.",
  "Risk": "Without centralized root credentials management, member accounts retain full control over their root user credentials, increasing the risk of credential misuse, mismanagement, or compromise.",
  "RelatedUrl": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#id_root-user-access-management",
  "Remediation": {
    "Code": {
      "CLI": "aws iam enable-organizations-root-credentials-management",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable centralized management of root access for member accounts using the CLI or IAM console.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-enable-root-access.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [
    "iam_root_hardware_mfa_enabled",
    "iam_root_mfa_enabled",
    "iam_no_root_access_key"
  ],
  "Notes": "This check skips findings for member accounts as they cannot execute the ListOrganizationsFeatures API call, which is restricted to the management account or delegated administrators."
}
```

--------------------------------------------------------------------------------

---[FILE: iam_root_credentials_management_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_root_credentials_management_enabled/iam_root_credentials_management_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.organizations.organizations_client import (
    organizations_client,
)


class iam_root_credentials_management_enabled(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if (
            organizations_client.organization
            and organizations_client.organization.status == "ACTIVE"
            and iam_client.organization_features is not None
        ):
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource={},
            )
            report.region = iam_client.region
            report.resource_arn = iam_client.audited_account_arn
            report.resource_id = iam_client.audited_account
            if "RootCredentialsManagement" in iam_client.organization_features:
                report.status = "PASS"
                report.status_extended = "Root credentials management is enabled."
            else:
                report.status = "FAIL"
                report.status_extended = "Root credentials management is not enabled."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_root_hardware_mfa_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_root_hardware_mfa_enabled/iam_root_hardware_mfa_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_root_hardware_mfa_enabled",
  "CheckTitle": "Ensure only hardware MFA is enabled for the root account",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsIamUser",
  "Description": "Ensure only hardware MFA is enabled for the root account",
  "Risk": "The root account is the most privileged user in an AWS account. MFA adds an extra layer of protection on top of a user name and password. With MFA enabled when a user signs in to an AWS website they will be prompted for their user name and password as well as for an authentication code from their AWS MFA device. For Level 2 it is recommended that the root account be protected with only a hardware MFA.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Using IAM console navigate to Dashboard and expand Activate MFA on your root account. If using AWS Organizations, consider enabling Centralized Root Management and removing individual root credentials.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#id_root-user_manage_mfa"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_root_hardware_mfa_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_root_hardware_mfa_enabled/iam_root_hardware_mfa_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_root_hardware_mfa_enabled(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        # This check is only available in Commercial Partition
        if iam_client.audited_partition == "aws":
            if iam_client.credential_report:
                for user in iam_client.credential_report:
                    if user["user"] == "<root_account>":
                        password_enabled = user["password_enabled"] == "true"
                        access_key_1_active = user["access_key_1_active"] == "true"
                        access_key_2_active = user["access_key_2_active"] == "true"

                        # Only report if root actually has credentials
                        if (
                            password_enabled
                            or access_key_1_active
                            or access_key_2_active
                        ) and iam_client.account_summary:
                            virtual_mfa = False
                            report = Check_Report_AWS(
                                metadata=self.metadata(),
                                resource=user,
                            )
                            report.region = iam_client.region
                            report.resource_id = user["user"]
                            report.resource_arn = iam_client.mfa_arn_template

                            # Check if organization manages root credentials
                            org_managed = (
                                iam_client.organization_features is not None
                                and "RootCredentialsManagement"
                                in iam_client.organization_features
                            )

                            if (
                                iam_client.account_summary["SummaryMap"][
                                    "AccountMFAEnabled"
                                ]
                                > 0
                            ):
                                for mfa in iam_client.virtual_mfa_devices:
                                    # If the ARN of the associated IAM user of the Virtual MFA device is "arn:aws:iam::[aws-account-id]:root", your AWS root account is not using a hardware-based MFA device for MFA protection.
                                    if "root" in mfa.get("User", {}).get("Arn", ""):
                                        virtual_mfa = True
                                        report.status = "FAIL"
                                        if org_managed:
                                            report.status_extended = (
                                                "Root account has credentials with virtual MFA "
                                                "instead of hardware MFA despite organizational root management being enabled."
                                            )
                                        else:
                                            report.status_extended = "Root account has a virtual MFA instead of a hardware MFA device enabled."
                                        break

                                if not virtual_mfa:
                                    report.status = "PASS"
                                    if org_managed:
                                        report.status_extended = (
                                            "Root account has credentials with hardware MFA enabled. "
                                            "Consider removing individual root credentials since organizational "
                                            "root management is active."
                                        )
                                    else:
                                        report.status_extended = "Root account has a hardware MFA device enabled."
                            else:
                                report.status = "FAIL"
                                if org_managed:
                                    report.status_extended = (
                                        "Root account has credentials without MFA "
                                        "despite organizational root management being enabled."
                                    )
                                else:
                                    report.status_extended = (
                                        "MFA is not enabled for root account."
                                    )

                            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_root_mfa_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_root_mfa_enabled/iam_root_mfa_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_root_mfa_enabled",
  "CheckTitle": "Ensure MFA is enabled for the root account",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsIamUser",
  "Description": "Ensure MFA is enabled for the root account",
  "Risk": "The root account is the most privileged user in an AWS account. MFA adds an extra layer of protection on top of a user name and password. With MFA enabled when a user signs in to an AWS website they will be prompted for their user name and password as well as for an authentication code from their AWS MFA device. When virtual MFA is used for root accounts it is recommended that the device used is NOT a personal device but rather a dedicated mobile device (tablet or phone) that is managed to be kept charged and secured independent of any individual personal devices. (non-personal virtual MFA) This lessens the risks of losing access to the MFA due to device loss / trade-in or if the individual owning the device is no longer employed at the company.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Using IAM console navigate to Dashboard and expand Activate MFA on your root account. If using AWS Organizations, consider enabling Centralized Root Management and removing individual root credentials.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#id_root-user_manage_mfa"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_root_mfa_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_root_mfa_enabled/iam_root_mfa_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_root_mfa_enabled(Check):
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

                        if user["mfa_active"] == "false":
                            report.status = "FAIL"
                            if org_managed:
                                report.status_extended = (
                                    "Root account has credentials without MFA "
                                    "despite organizational root management being enabled."
                                )
                            else:
                                report.status_extended = (
                                    "MFA is not enabled for root account."
                                )
                        else:
                            report.status = "PASS"
                            if org_managed:
                                report.status_extended = (
                                    "Root account has credentials with MFA enabled. "
                                    "Consider removing individual root credentials since organizational "
                                    "root management is active."
                                )
                            else:
                                report.status_extended = (
                                    "MFA is enabled for root account."
                                )
                        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_rotate_access_key_90_days.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_rotate_access_key_90_days/iam_rotate_access_key_90_days.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_rotate_access_key_90_days",
  "CheckTitle": "Ensure access keys are rotated every 90 days or less",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamAccessKey",
  "Description": "Ensure access keys are rotated every 90 days or less",
  "Risk": "Access keys consist of an access key ID and secret access key which are used to sign programmatic requests that you make to AWS. AWS users need their own access keys to make programmatic calls to AWS from the AWS Command Line Interface (AWS CLI)- Tools for Windows PowerShell- the AWS SDKs- or direct HTTP calls using the APIs for individual AWS services. It is recommended that all access keys be regularly rotated.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Use the credential report to  ensure  access_key_X_last_rotated  is less than 90 days ago.",
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

---[FILE: iam_rotate_access_key_90_days.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_rotate_access_key_90_days/iam_rotate_access_key_90_days.py

```python
import datetime

import pytz
from dateutil import parser

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client

maximum_expiration_days = 90


class iam_rotate_access_key_90_days(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for user in iam_client.credential_report:
            # Search user in iam_client.users to get tags
            user_tags = []
            for iam_user in iam_client.users:
                if iam_user.arn == user["arn"]:
                    user_tags = iam_user.tags
                    break

            if (
                user["access_key_1_last_rotated"] == "N/A"
                and user["access_key_2_last_rotated"] == "N/A"
            ):
                report = Check_Report_AWS(metadata=self.metadata(), resource=user)
                report.region = iam_client.region
                report.resource_id = user["user"]
                report.resource_arn = user["arn"]
                report.resource_tags = user_tags
                report.status = "PASS"
                report.status_extended = (
                    f"User {user['user']} does not have access keys."
                )
                findings.append(report)

            else:
                old_access_keys = False
                if (
                    user["access_key_1_last_rotated"] != "N/A"
                    and user["access_key_1_active"] == "true"
                ):
                    access_key_1_last_rotated = datetime.datetime.now(
                        pytz.utc
                    ) - parser.parse(user["access_key_1_last_rotated"])
                    if access_key_1_last_rotated.days > maximum_expiration_days:
                        old_access_keys = True
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=user
                        )
                        report.region = iam_client.region
                        report.resource_id = f"{user['user']}-access-key-1"
                        report.resource_arn = user["arn"]
                        report.resource_tags = user_tags
                        report.status = "FAIL"
                        report.status_extended = f"User {user['user']} has not rotated access key 1 in over 90 days ({access_key_1_last_rotated.days} days)."
                        findings.append(report)
                if (
                    user["access_key_2_last_rotated"] != "N/A"
                    and user["access_key_2_active"] == "true"
                ):
                    access_key_2_last_rotated = datetime.datetime.now(
                        pytz.utc
                    ) - parser.parse(user["access_key_2_last_rotated"])
                    if access_key_2_last_rotated.days > maximum_expiration_days:
                        old_access_keys = True
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=user
                        )
                        report.region = iam_client.region
                        report.resource_id = f"{user['user']}-access-key-2"
                        report.resource_arn = user["arn"]
                        report.resource_tags = user_tags
                        report.status = "FAIL"
                        report.status_extended = f"User {user['user']} has not rotated access key 2 in over 90 days ({access_key_2_last_rotated.days} days)."
                        findings.append(report)

                if not old_access_keys:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=user)
                    report.region = iam_client.region
                    report.resource_id = user["user"]
                    report.resource_arn = user["arn"]
                    report.resource_tags = user_tags
                    report.status = "PASS"
                    report.status_extended = f"User {user['user']} does not have access keys older than 90 days."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_securityaudit_role_created.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_securityaudit_role_created/iam_securityaudit_role_created.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_securityaudit_role_created",
  "CheckTitle": "Ensure a Security Audit role has been created to conduct security audits",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "low",
  "ResourceType": "AwsIamRole",
  "Description": "Ensure a Security Audit role has been created to conduct security audits",
  "Risk": "Creating an IAM role with a security audit policy provides a clear separation of duties between the security team and other teams within the organization. This helps to ensure that security-related activities are performed by authorized individuals with the appropriate expertise and access permissions.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create an IAM role for conduct security audits with AWS.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html#jf_security-auditor"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_securityaudit_role_created.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_securityaudit_role_created/iam_securityaudit_role_created.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_securityaudit_role_created(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.entities_role_attached_to_securityaudit_policy is not None:
            if iam_client.entities_role_attached_to_securityaudit_policy:
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=iam_client.entities_role_attached_to_securityaudit_policy[
                        0
                    ],
                )
                report.region = iam_client.region
                report.resource_id = "SecurityAudit"
                report.resource_arn = (
                    f"arn:{iam_client.audited_partition}:iam::aws:policy/SecurityAudit"
                )
                report.status = "PASS"
                report.status_extended = f"SecurityAudit policy attached to role {iam_client.entities_role_attached_to_securityaudit_policy[0]['RoleName']}."
            else:
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource={},
                )
                report.region = iam_client.region
                report.resource_id = "SecurityAudit"
                report.resource_arn = (
                    f"arn:{iam_client.audited_partition}:iam::aws:policy/SecurityAudit"
                )
                report.status = "FAIL"
                report.status_extended = (
                    "SecurityAudit policy is not attached to any role."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_support_role_created.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_support_role_created/iam_support_role_created.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_support_role_created",
  "CheckTitle": "Ensure a support role has been created to manage incidents with AWS Support",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamRole",
  "Description": "Ensure a support role has been created to manage incidents with AWS Support",
  "Risk": "AWS provides a support center that can be used for incident notification and response, as well as technical support and customer services. Create an IAM Role to allow authorized users to manage incidents with AWS Support.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create an IAM role for managing incidents with AWS.",
      "Url": "https://docs.aws.amazon.com/awssupport/latest/user/using-service-linked-roles-sup.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_support_role_created.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_support_role_created/iam_support_role_created.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_support_role_created(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        if iam_client.entities_role_attached_to_support_policy is not None:
            if iam_client.entities_role_attached_to_support_policy:
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource=iam_client.entities_role_attached_to_support_policy[0],
                )
                report.region = iam_client.region
                report.resource_id = iam_client.audited_account
                report.resource_arn = f"arn:{iam_client.audited_partition}:iam::aws:policy/AWSSupportAccess"
                report.status = "PASS"
                report.status_extended = f"AWS Support Access policy attached to role {iam_client.entities_role_attached_to_support_policy[0]['RoleName']}."
            else:
                report = Check_Report_AWS(
                    metadata=self.metadata(),
                    resource={},
                )
                report.region = iam_client.region
                report.resource_id = iam_client.audited_account
                report.resource_arn = f"arn:{iam_client.audited_partition}:iam::aws:policy/AWSSupportAccess"
                report.status = "FAIL"
                report.status_extended = (
                    "AWS Support Access policy is not attached to any role."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_user_accesskey_unused.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_accesskey_unused/iam_user_accesskey_unused.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_user_accesskey_unused",
  "CheckTitle": "Ensure unused User Access Keys are disabled",
  "CheckType": [
    "Software and Configuration Checks"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamUser",
  "Description": "Ensure unused User Access Keys are disabled",
  "Risk": "To increase the security of your AWS account, remove IAM user credentials (that is, passwords and access keys) that are not needed. For example, when users leave your organization or no longer need AWS access.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Find the credentials that they were using and ensure that they are no longer operational. Ideally, you delete credentials if they are no longer needed. You can always recreate them at a later date if the need arises. At the very least, you should change the password or deactivate the access keys so that the former users no longer have access.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_finding-unused.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_user_accesskey_unused.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_accesskey_unused/iam_user_accesskey_unused.py

```python
import datetime

import pytz
from dateutil import parser

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_user_accesskey_unused(Check):
    def execute(self) -> Check_Report_AWS:
        maximum_expiration_days = iam_client.audit_config.get(
            "max_unused_access_keys_days", 45
        )
        findings = []
        for user in iam_client.credential_report:
            # Search user in iam_client.users to get tags
            user_tags = []
            for iam_user in iam_client.users:
                if iam_user.arn == user["arn"]:
                    user_tags = iam_user.tags
                    break

            if (
                user["access_key_1_active"] != "true"
                and user["access_key_2_active"] != "true"
            ):
                report = Check_Report_AWS(metadata=self.metadata(), resource=user)
                report.region = iam_client.region
                report.resource_id = user["user"]
                report.resource_arn = user["arn"]
                report.resource_tags = user_tags
                report.status = "PASS"
                report.status_extended = (
                    f"User {user['user']} does not have access keys."
                )
                findings.append(report)

            else:
                old_access_keys = False
                if user["access_key_1_active"] == "true":
                    if user["access_key_1_last_used_date"] != "N/A":
                        access_key_1_last_used_date = datetime.datetime.now(
                            pytz.utc
                        ) - parser.parse(user["access_key_1_last_used_date"])
                        if access_key_1_last_used_date.days > maximum_expiration_days:
                            old_access_keys = True
                            report = Check_Report_AWS(
                                metadata=self.metadata(), resource=user
                            )
                            report.region = iam_client.region
                            report.resource_id = user["user"] + "/AccessKey1"
                            report.resource_arn = user["arn"]
                            report.resource_tags = user_tags
                            report.status = "FAIL"
                            report.status_extended = f"User {user['user']} has not used access key 1 in the last {maximum_expiration_days} days ({access_key_1_last_used_date.days} days)."
                            findings.append(report)

                if user["access_key_2_active"] == "true":
                    if user["access_key_2_last_used_date"] != "N/A":
                        access_key_2_last_used_date = datetime.datetime.now(
                            pytz.utc
                        ) - parser.parse(user["access_key_2_last_used_date"])
                        if access_key_2_last_used_date.days > maximum_expiration_days:
                            old_access_keys = True
                            report = Check_Report_AWS(
                                metadata=self.metadata(), resource=user
                            )
                            report.region = iam_client.region
                            report.resource_id = user["user"] + "/AccessKey2"
                            report.resource_arn = user["arn"]
                            report.resource_tags = user_tags
                            report.status = "FAIL"
                            report.status_extended = f"User {user['user']} has not used access key 2 in the last {maximum_expiration_days} days ({access_key_2_last_used_date.days} days)."
                            findings.append(report)

                if not old_access_keys:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=user)
                    report.region = iam_client.region
                    report.resource_id = user["user"]
                    report.resource_arn = user["arn"]
                    report.resource_tags = user_tags
                    report.status = "PASS"
                    report.status_extended = f"User {user['user']} does not have unused access keys for {maximum_expiration_days} days."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_user_administrator_access_policy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_administrator_access_policy/iam_user_administrator_access_policy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_user_administrator_access_policy",
  "CheckTitle": "Ensure No IAM Users Have Administrator Access Policy",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "high",
  "ResourceType": "AwsIamUser",
  "Description": "This check ensures that no IAM users in your AWS account have the 'AdministratorAccess' policy attached. IAM users with this policy have unrestricted access to all AWS services and resources, which poses a significant security risk if misused.",
  "Risk": "IAM users with administrator-level permissions can perform any action on any resource in your AWS environment. If these permissions are granted to users unnecessarily or to individuals without sufficient knowledge, it can lead to security vulnerabilities, data leaks, data loss, or unexpected charges.",
  "RelatedUrl": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html",
  "Remediation": {
    "Code": {
      "CLI": "aws iam detach-user-policy --user-name <username> --policy-arn arn:aws:iam::aws:policy/AdministratorAccess",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/IAM/admin-permissions.html",
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

---[FILE: iam_user_administrator_access_policy.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_administrator_access_policy/iam_user_administrator_access_policy.py

```python
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_user_administrator_access_policy(Check):
    def execute(self) -> List[Check_Report_AWS]:
        findings = []
        for user in iam_client.users:
            report = Check_Report_AWS(metadata=self.metadata(), resource=user)
            report.region = iam_client.region
            report.status = "PASS"
            report.status_extended = (
                f"IAM User {user.name} does not have AdministratorAccess policy."
            )
            for policy in user.attached_policies:
                if policy["PolicyName"] == "AdministratorAccess":
                    report.status = "FAIL"
                    report.status_extended = (
                        f"IAM User {user.name} has AdministratorAccess policy attached."
                    )
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_user_console_access_unused.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_console_access_unused/iam_user_console_access_unused.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_user_console_access_unused",
  "CheckTitle": "Ensure unused user console access are disabled",
  "CheckType": [
    "Software and Configuration Checks"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamUser",
  "Description": "Ensure unused user console access are disabled",
  "Risk": "To increase the security of your AWS account, remove IAM user credentials (that is, passwords and access keys) that are not needed. For example, when users leave your organization or no longer need AWS access.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Find the credentials that they were using and ensure that they are no longer operational. Ideally, you delete credentials if they are no longer needed. You can always recreate them at a later date if the need arises. At the very least, you should change the password or deactivate the access keys so that the former users no longer have access.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_finding-unused.html"
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
