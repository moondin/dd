---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 296
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 296 of 867)

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

---[FILE: iam_user_console_access_unused.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_console_access_unused/iam_user_console_access_unused.py

```python
import datetime

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_user_console_access_unused(Check):
    def execute(self) -> Check_Report_AWS:
        maximum_expiration_days = iam_client.audit_config.get(
            "max_console_access_days", 45
        )
        findings = []
        for user in iam_client.users:
            report = Check_Report_AWS(metadata=self.metadata(), resource=user)
            report.region = iam_client.region
            if user.console_access and user.password_last_used:
                time_since_insertion = (
                    datetime.datetime.now()
                    - datetime.datetime.strptime(
                        str(user.password_last_used), "%Y-%m-%d %H:%M:%S+00:00"
                    )
                )
                if time_since_insertion.days > maximum_expiration_days:
                    report.status = "FAIL"
                    report.status_extended = f"User {user.name} has not logged in to the console in the past {maximum_expiration_days} days ({time_since_insertion.days} days)."
                else:
                    report.status = "PASS"
                    report.status_extended = f"User {user.name} has logged in to the console in the past {maximum_expiration_days} days ({time_since_insertion.days} days)."
            else:
                report.status = "PASS"
                report.status_extended = f"User {user.name} does not have console access enabled or is unused."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_user_hardware_mfa_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_hardware_mfa_enabled/iam_user_hardware_mfa_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_user_hardware_mfa_enabled",
  "CheckTitle": "Check if IAM users have Hardware MFA enabled.",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamUser",
  "Description": "Check if IAM users have Hardware MFA enabled.",
  "Risk": "Hardware MFA is preferred over virtual MFA.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable hardware MFA device for an IAM user from the AWS Management Console, the command line, or the IAM API.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_physical.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_user_hardware_mfa_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_hardware_mfa_enabled/iam_user_hardware_mfa_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_user_hardware_mfa_enabled(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        response = iam_client.users

        for user in response:
            report = Check_Report_AWS(metadata=self.metadata(), resource=user)
            report.region = iam_client.region
            if user.mfa_devices:
                report.status = "PASS"
                report.status_extended = f"User {user.name} has hardware MFA enabled."
                for mfa_device in user.mfa_devices:
                    if mfa_device.type == "mfa" or mfa_device.type == "sms-mfa":
                        report.status = "FAIL"
                        report.status_extended = f"User {user.name} has a virtual MFA instead of a hardware MFA device enabled."
                        break

                findings.append(report)
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User {user.name} does not have any type of MFA enabled."
                )
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_user_mfa_enabled_console_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_mfa_enabled_console_access/iam_user_mfa_enabled_console_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_user_mfa_enabled_console_access",
  "CheckTitle": "Ensure multi-factor authentication (MFA) is enabled for all IAM users that have a console password.",
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
  "Description": "Ensure multi-factor authentication (MFA) is enabled for all IAM users that have a console password.",
  "Risk": "Unauthorized access to this critical account if password is not secure or it is disclosed in any way.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable MFA for the user's account. MFA is a simple best practice that adds an extra layer of protection on top of your user name and password. Recommended to use hardware keys over virtual MFA.",
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

---[FILE: iam_user_mfa_enabled_console_access.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_mfa_enabled_console_access/iam_user_mfa_enabled_console_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_user_mfa_enabled_console_access(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        response = iam_client.credential_report
        for user in response:
            # all the users but root (which by default does not support console password)
            if user["user"] != "<root_account>":
                report = Check_Report_AWS(metadata=self.metadata(), resource=user)
                report.resource_id = user["user"]
                report.resource_arn = user["arn"]
                report.region = iam_client.region
                # Search user in iam_client.users to get tags
                for iam_user in iam_client.users:
                    if iam_user.arn == user["arn"]:
                        report.resource_tags = iam_user.tags
                        break
                # check if the user has password enabled
                if user["password_enabled"] == "true":
                    if user["mfa_active"] == "false":
                        report.status = "FAIL"
                        report.status_extended = f"User {user['user']} has Console Password enabled but MFA disabled."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"User {user['user']} has Console Password enabled and MFA enabled."
                else:
                    report.status = "PASS"
                    report.status_extended = (
                        f"User {user['user']} does not have Console Password enabled."
                    )
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_user_no_setup_initial_access_key.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_no_setup_initial_access_key/iam_user_no_setup_initial_access_key.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_user_no_setup_initial_access_key",
  "CheckTitle": "Do not setup access keys during initial user setup for all IAM users that have a console password",
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
  "Description": "Do not setup access keys during initial user setup for all IAM users that have a console password",
  "Risk": "AWS console defaults the checkbox for creating access keys to enabled. This results in many access keys being generated unnecessarily. In addition to unnecessary credentials, it also generates unnecessary management work in auditing and rotating these keys. Requiring that additional steps be taken by the user after their profile has been created will give a stronger indication of intent that access keys are (a) necessary for their work and (b) once the access key is established on an account that the keys may be in use somewhere in the organization.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "From the IAM console: generate credential report and disable not required keys.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_getting-report.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "CAF Security Epic: IAM"
}
```

--------------------------------------------------------------------------------

---[FILE: iam_user_no_setup_initial_access_key.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_no_setup_initial_access_key/iam_user_no_setup_initial_access_key.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_user_no_setup_initial_access_key(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []
        for user_record in iam_client.credential_report:
            if (
                user_record["access_key_1_active"] == "true"
                and user_record["access_key_1_last_used_date"] == "N/A"
                and user_record["password_enabled"] == "true"
            ) or (
                user_record["access_key_2_active"] == "true"
                and user_record["access_key_2_last_used_date"] == "N/A"
                and user_record["password_enabled"] == "true"
            ):
                if (
                    user_record["access_key_1_active"] == "true"
                    and user_record["access_key_1_last_used_date"] == "N/A"
                    and user_record["password_enabled"] == "true"
                ):
                    self.add_finding(
                        user=user_record,
                        status="FAIL",
                        status_extended=f"User {user_record['user']} has never used access key 1.",
                        findings=findings,
                    )
                if (
                    user_record["access_key_2_active"] == "true"
                    and user_record["access_key_2_last_used_date"] == "N/A"
                    and user_record["password_enabled"] == "true"
                ):
                    self.add_finding(
                        user=user_record,
                        status="FAIL",
                        status_extended=f"User {user_record['user']} has never used access key 2.",
                        findings=findings,
                    )
            else:
                self.add_finding(
                    user=user_record,
                    status="PASS",
                    status_extended=f"User {user_record['user']} does not have access keys or uses the access keys configured.",
                    findings=findings,
                )

        return findings

    def add_finding(self, user, status, status_extended, findings):
        report = Check_Report_AWS(metadata=self.metadata(), resource=user)
        report.region = iam_client.region
        report.resource_id = user["user"]
        report.resource_arn = user["arn"]
        report.status = status
        report.status_extended = status_extended
        # Search user in iam_client.users to get tags
        for iam_user in iam_client.users:
            if iam_user.arn == user["arn"]:
                report.resource_tags = iam_user.tags
                break
        findings.append(report)
```

--------------------------------------------------------------------------------

---[FILE: iam_user_two_active_access_key.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_two_active_access_key/iam_user_two_active_access_key.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_user_two_active_access_key",
  "CheckTitle": "Check if IAM users have two active access keys",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS AWS Foundations Benchmark"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsIamUser",
  "Description": "Check if IAM users have two active access keys",
  "Risk": "Access Keys could be lost or stolen. It creates a critical risk.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Avoid using long lived access keys.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAccessKeys.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_user_two_active_access_key.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_two_active_access_key/iam_user_two_active_access_key.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.logger import logger
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_user_two_active_access_key(Check):
    def execute(self) -> Check_Report_AWS:
        try:
            findings = []
            response = iam_client.credential_report
            for user in response:
                report = Check_Report_AWS(metadata=self.metadata(), resource=user)
                report.resource_id = user["user"]
                report.resource_arn = user["arn"]
                report.region = iam_client.region
                # Search user in iam_client.users to get tags
                for iam_user in iam_client.users:
                    if iam_user.arn == user["arn"]:
                        report.resource_tags = iam_user.tags
                        break
                if (
                    user["access_key_1_active"] == "true"
                    and user["access_key_2_active"] == "true"
                ):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"User {user['user']} has 2 active access keys."
                    )
                else:
                    report.status = "PASS"
                    report.status_extended = (
                        f"User {user['user']} does not have 2 active access keys."
                    )
                findings.append(report)
        except Exception as error:
            logger.error(f"{error.__class__.__name__} -- {error}")
        finally:
            return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_user_with_temporary_credentials.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_with_temporary_credentials/iam_user_with_temporary_credentials.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "iam_user_with_temporary_credentials",
  "CheckTitle": "Ensure users make use of temporary credentials assuming IAM roles",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:iam::account-id:user/user-name",
  "Severity": "medium",
  "ResourceType": "AwsIamUser",
  "Description": "Ensure users make use of temporary credentials assuming IAM roles",
  "Risk": "As a best practice, use temporary security credentials (IAM roles) instead of creating long-term credentials like access keys, and don't create AWS account root user access keys.",
  "RelatedUrl": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "As a best practice, use temporary security credentials (IAM roles) instead of creating long-term credentials like access keys, and don't create AWS account root user access keys.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_user_with_temporary_credentials.py]---
Location: prowler-master/prowler/providers/aws/services/iam/iam_user_with_temporary_credentials/iam_user_with_temporary_credentials.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class iam_user_with_temporary_credentials(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for (
            user_data,
            last_accessed_services,
        ) in iam_client.user_temporary_credentials_usage.items():
            user_name = user_data[0]
            user_arn = user_data[1]

            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource={"name": user_name, "arn": user_arn},
            )
            report.resource_id = user_name
            report.resource_arn = user_arn
            report.region = iam_client.region
            # Search user in iam_client.users to get tags
            for iam_user in iam_client.users:
                if iam_user.arn == user_arn:
                    report.resource_tags = iam_user.tags
                    break

            report.status = "PASS"
            report.status_extended = f"User {user_name} doesn't have long lived credentials with access to other services than IAM or STS."

            if last_accessed_services:
                report.status = "FAIL"
                report.status_extended = f"User {user_name} has long lived credentials with access to other services than IAM or STS."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
