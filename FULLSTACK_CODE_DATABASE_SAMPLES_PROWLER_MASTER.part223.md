---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 223
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 223 of 867)

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

---[FILE: ram_password_policy_password_reuse_prevention.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_password_reuse_prevention/ram_password_policy_password_reuse_prevention.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_password_policy_password_reuse_prevention",
  "CheckTitle": "RAM password policy prevents password reuse",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:password-policy",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMPasswordPolicy",
  "Description": "It is recommended that the **password policy** prevent the reuse of passwords.\n\nThis ensures users cannot cycle back to previously compromised passwords.",
  "Risk": "Preventing **password reuse** increases account resiliency against brute force logon attempts.\n\nIf a password is compromised and later reused, attackers with knowledge of old credentials can regain access.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116413.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/prevent-password-reuse-password-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram SetPasswordPolicy --PasswordReusePrevention 5",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ram_password_policy\" \"example\" {\n  password_reuse_prevention = 24\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Settings**\n3. In the Password section, click **Modify**\n4. In the `Do Not repeat History` section field, enter `5`\n5. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_password_policy_password_reuse_prevention"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_password_reuse_prevention.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_password_reuse_prevention/ram_password_policy_password_reuse_prevention.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_password_policy_password_reuse_prevention(Check):
    """Check if RAM password policy prevents password reuse."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        if ram_client.password_policy:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=ram_client.password_policy
            )
            report.region = ram_client.region
            report.resource_id = f"{ram_client.audited_account}-password-policy"
            report.resource_arn = (
                f"acs:ram::{ram_client.audited_account}:password-policy"
            )

            if ram_client.password_policy.password_reuse_prevention >= 5:
                report.status = "PASS"
                report.status_extended = f"RAM password policy prevents password reuse (history: {ram_client.password_policy.password_reuse_prevention} passwords)."
            else:
                report.status = "FAIL"
                if ram_client.password_policy.password_reuse_prevention == 0:
                    report.status_extended = (
                        "RAM password policy does not prevent password reuse."
                    )
                else:
                    report.status_extended = f"RAM password policy prevents reuse of only {ram_client.password_policy.password_reuse_prevention} previous passwords, which is less than the recommended 5."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_symbol.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_symbol/ram_password_policy_symbol.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_password_policy_symbol",
  "CheckTitle": "RAM password policy require at least one symbol",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:password-policy",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMPasswordPolicy",
  "Description": "**RAM password policies** can be used to ensure password complexity.\n\nIt is recommended that the password policy require at least one **symbol**.",
  "Risk": "Enhancing complexity of a password policy increases account resiliency against **brute force logon attempts**.\n\nSpecial characters significantly increase the keyspace that attackers must search.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116413.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/require-symbol-password-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram SetPasswordPolicy --RequireSymbols true",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ram_password_policy\" \"example\" {\n  require_symbols = true\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Settings**\n3. In the Password section, click **Modify**\n4. In the Charset section, select **Symbol**\n5. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_password_policy_symbol"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_symbol.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_symbol/ram_password_policy_symbol.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_password_policy_symbol(Check):
    """Check if RAM password policy requires at least one symbol."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        if ram_client.password_policy:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=ram_client.password_policy
            )
            report.region = ram_client.region
            report.resource_id = f"{ram_client.audited_account}-password-policy"
            report.resource_arn = (
                f"acs:ram::{ram_client.audited_account}:password-policy"
            )

            if ram_client.password_policy.require_symbols:
                report.status = "PASS"
                report.status_extended = (
                    "RAM password policy requires at least one symbol."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    "RAM password policy does not require at least one symbol."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_uppercase.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_uppercase/ram_password_policy_uppercase.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_password_policy_uppercase",
  "CheckTitle": "RAM password policy requires at least one uppercase letter",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:password-policy",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMPasswordPolicy",
  "Description": "**RAM password policies** can be used to ensure password complexity.\n\nIt is recommended that the password policy require at least one **uppercase letter**.",
  "Risk": "Enhancing complexity of a password policy increases account resiliency against **brute force logon attempts**.\n\nWeak passwords without case variety are more susceptible to dictionary attacks.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116413.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/uppercase-letter-password-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram SetPasswordPolicy --RequireUppercaseCharacters true",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ram_password_policy\" \"example\" {\n  require_uppercase_characters = true\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Settings**\n3. In the Password section, click **Modify**\n4. In the Charset section, select **Upper case**\n5. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_password_policy_uppercase"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_uppercase.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_uppercase/ram_password_policy_uppercase.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_password_policy_uppercase(Check):
    """Check if RAM password policy requires at least one uppercase letter."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        if ram_client.password_policy:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=ram_client.password_policy
            )
            report.region = ram_client.region
            report.resource_id = f"{ram_client.audited_account}-password-policy"
            report.resource_arn = (
                f"acs:ram::{ram_client.audited_account}:password-policy"
            )

            if ram_client.password_policy.require_uppercase_characters:
                report.status = "PASS"
                report.status_extended = (
                    "RAM password policy requires at least one uppercase letter."
                )
            else:
                report.status = "FAIL"
                report.status_extended = "RAM password policy does not require at least one uppercase letter."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_policy_attached_only_to_group_or_roles.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_policy_attached_only_to_group_or_roles/ram_policy_attached_only_to_group_or_roles.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_policy_attached_only_to_group_or_roles",
  "CheckTitle": "RAM policies are attached only to groups or roles",
  "CheckType": [
    "Abnormal account",
    "Cloud threat detection"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:user/{user-name}",
  "Severity": "low",
  "ResourceType": "AlibabaCloudRAMUser",
  "Description": "By default, **RAM users**, groups, and roles have no access to Alibaba Cloud resources. RAM policies are the means by which privileges are granted to users, groups, or roles.\n\nIt is recommended that RAM policies be applied directly to **groups and roles** but not users.",
  "Risk": "Assigning privileges at the **group or role level** reduces the complexity of access management as the number of users grows.\n\nReducing access management complexity may in turn reduce opportunity for a principal to inadvertently receive or retain **excessive privileges**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116820.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/receive-permissions-via-ram-groups-only.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram DetachPolicyFromUser --PolicyName <policy_name> --PolicyType <System|Custom> --UserName <ram_user>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Create **RAM user groups** and assign policies to those groups\n2. Add users to the appropriate groups\n3. Detach any policies directly attached to users using the RAM Console or CLI",
      "Url": "https://hub.prowler.com/check/ram_policy_attached_only_to_group_or_roles"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_policy_attached_only_to_group_or_roles.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_policy_attached_only_to_group_or_roles/ram_policy_attached_only_to_group_or_roles.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_policy_attached_only_to_group_or_roles(Check):
    """Check if RAM policies are attached only to groups or roles, not directly to users."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for user in ram_client.users:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=user)
            report.region = ram_client.region
            report.resource_id = user.name
            report.resource_arn = (
                f"acs:ram::{ram_client.audited_account}:user/{user.name}"
            )

            if user.attached_policies:
                report.status = "FAIL"
                policy_names = [policy.policy_name for policy in user.attached_policies]
                report.status_extended = (
                    f"RAM user {user.name} has {len(user.attached_policies)} "
                    f"policies directly attached: {', '.join(policy_names)}. "
                    f"Policies should be attached to groups or roles instead."
                )
                findings.append(report)
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"RAM user {user.name} has no policies directly attached."
                )
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_policy_no_administrative_privileges.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_policy_no_administrative_privileges/ram_policy_no_administrative_privileges.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_policy_no_administrative_privileges",
  "CheckTitle": "RAM policies that allow full \"*:*\" administrative privileges are not created",
  "CheckType": [
    "Abnormal account",
    "Cloud threat detection"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:policy/{policy-name}",
  "Severity": "critical",
  "ResourceType": "AlibabaCloudRAMPolicy",
  "Description": "**RAM policies** represent permissions that can be granted to users, groups, or roles. It is recommended to grant **least privilege**—that is, granting only the permissions required to perform tasks.\n\nDetermine what users need to do and then create policies with permissions that only fit those tasks, instead of allowing full administrative privileges.",
  "Risk": "It is more secure to start with a minimum set of permissions and grant additional permissions as necessary. Providing **full administrative privileges** exposes your resources to potentially unwanted actions.\n\nRAM policies with `\"Effect\": \"Allow\"`, `\"Action\": \"*\"`, and `\"Resource\": \"*\"` should be prohibited.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/93733.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/policies-with-full-administrative-privileges.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram DetachPolicyFromUser --PolicyName <policy_name> --PolicyType Custom --UserName <ram_user>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Permissions** > **Policies**\n3. From the Policy Type drop-down list, select **Custom Policy**\n4. In the Policy Name column, click the name of the target policy\n5. In the Policy Document section, edit the policy to remove the statement with full administrative privileges, or remove the policy from any RAM users, user groups, or roles that have this policy attached",
      "Url": "https://hub.prowler.com/check/ram_policy_no_administrative_privileges"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_policy_no_administrative_privileges.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_policy_no_administrative_privileges/ram_policy_no_administrative_privileges.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


def check_admin_access(policy_document: dict) -> bool:
    """
    Check if the policy document allows full administrative privileges.

    Args:
        policy_document: The policy document as a dictionary.

    Returns:
        bool: True if the policy allows admin access (Effect: Allow, Action: *, Resource: *), False otherwise.
    """
    if not policy_document:
        return False

    statements = policy_document.get("Statement", [])
    if not isinstance(statements, list):
        statements = [statements]

    for statement in statements:
        effect = statement.get("Effect")
        action = statement.get("Action")
        resource = statement.get("Resource")

        # Check if statement has Effect: Allow, Action: *, Resource: *
        if effect == "Allow":
            # Action can be a string or a list
            actions = action if isinstance(action, list) else [action] if action else []
            # Resource can be a string or a list
            resources = (
                resource
                if isinstance(resource, list)
                else [resource] if resource else []
            )

            # Check if Action contains "*" and Resource contains "*"
            if "*" in actions and "*" in resources:
                return True

    return False


class ram_policy_no_administrative_privileges(Check):
    """Check if RAM policies that allow full '*:*' administrative privileges are not created."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for policy in ram_client.policies.values():
            # Check only for custom policies that are attached
            if policy.policy_type == "Custom" and policy.attachment_count > 0:
                report = CheckReportAlibabaCloud(
                    metadata=self.metadata(), resource=policy
                )
                report.region = ram_client.region
                report.resource_id = policy.name
                report.resource_arn = (
                    f"acs:ram::{ram_client.audited_account}:policy/{policy.name}"
                )

                report.status = "PASS"
                report.status_extended = f"Custom policy {policy.name} is attached but does not allow '*:*' administrative privileges."

                if policy.document:
                    if check_admin_access(policy.document):
                        report.status = "FAIL"
                        report.status_extended = f"Custom policy {policy.name} is attached and allows '*:*' administrative privileges."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_rotate_access_key_90_days.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_rotate_access_key_90_days/ram_rotate_access_key_90_days.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_rotate_access_key_90_days",
  "CheckTitle": "Access keys are rotated every 90 days or less",
  "CheckType": [
    "Unusual logon",
    "Cloud threat detection"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:user/{user-name}/accesskey/{access-key-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMAccessKey",
  "Description": "An **access key** consists of an access key ID and a secret, which are used to sign programmatic requests that you make to Alibaba Cloud.\n\nRAM users need their own access keys to make programmatic calls from SDKs, CLIs, or direct API calls. It is recommended that all access keys be **regularly rotated**.",
  "Risk": "Access keys might be compromised by leaving them in code, configuration files, on-premise and cloud storages, and then stolen by attackers.\n\n**Rotating access keys** reduces the window of opportunity for a compromised access key to be used.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116401.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/access-keys-rotation.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram CreateAccessKey --UserName <ram_user> && aliyun ram UpdateAccessKey --UserAccessKeyId <old_access_key_ID> --Status Inactive --UserName <ram_user> && aliyun ram DeleteAccessKey --UserAccessKeyId <old_access_key_ID> --UserName <ram_user>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Create a new **AccessKey pair** for rotation\n2. Update all applications and systems to use the new AccessKey pair\n3. **Disable** the original AccessKey pair\n4. Confirm that your applications and systems are working\n5. **Delete** the original AccessKey pair",
      "Url": "https://hub.prowler.com/check/ram_rotate_access_key_90_days"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_rotate_access_key_90_days.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_rotate_access_key_90_days/ram_rotate_access_key_90_days.py

```python
from datetime import datetime, timedelta, timezone

from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_rotate_access_key_90_days(Check):
    """Check if access keys are rotated every 90 days or less."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        # Use UTC timezone-aware datetime for consistent comparison
        now = datetime.now(timezone.utc)
        ninety_days_ago = now - timedelta(days=90)

        for user in ram_client.users:
            if user.access_keys:
                for access_key in user.access_keys:
                    # Only check active access keys
                    if access_key.status == "Active":
                        report = CheckReportAlibabaCloud(
                            metadata=self.metadata(), resource=user
                        )
                        report.region = ram_client.region
                        report.resource_id = access_key.access_key_id
                        report.resource_arn = f"acs:ram::{ram_client.audited_account}:user/{user.name}/accesskey/{access_key.access_key_id}"

                        if access_key.create_date:
                            # Ensure create_date is timezone-aware for comparison
                            create_date = access_key.create_date
                            if create_date.tzinfo is None:
                                # If naive, assume UTC
                                create_date = create_date.replace(tzinfo=timezone.utc)

                            if create_date < ninety_days_ago:
                                report.status = "FAIL"
                                days_old = (now - create_date).days
                                report.status_extended = (
                                    f"Access key {access_key.access_key_id} for user {user.name} "
                                    f"has not been rotated in {days_old} days (more than 90 days)."
                                )
                            else:
                                report.status = "PASS"
                                days_old = (now - create_date).days
                                report.status_extended = (
                                    f"Access key {access_key.access_key_id} for user {user.name} "
                                    f"was created {days_old} days ago (within 90 days)."
                                )
                        else:
                            report.status = "PASS"
                            report.status_extended = (
                                f"Access key {access_key.access_key_id} for user {user.name} "
                                f"creation date is not available."
                            )

                        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_user_console_access_unused.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_user_console_access_unused/ram_user_console_access_unused.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_user_console_access_unused",
  "CheckTitle": "Users not logged on for 90 days or longer are disabled for console logon",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:user/{user-name}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMUser",
  "Description": "Alibaba Cloud **RAM users** can log on to the Alibaba Cloud console by using their username and password.\n\nIf a user has not logged on for **90 days or longer**, it is recommended to disable the console access of the user.",
  "Risk": "Disabling users from having unnecessary logon privileges will reduce the opportunity that an **abandoned user** or a user with **compromised password** to be exploited.\n\nInactive accounts are common targets for attackers attempting account takeover.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116820.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/inactive-ram-user.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram DeleteLoginProfile --UserName <ram_user>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Identities** > **Users**\n3. In the User Logon Name/Display Name column, click the username of the target RAM user\n4. In the Console Logon Management section, click **Modify Logon Settings**\n5. In the Console Password Logon section, select **Disabled**\n6. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_user_console_access_unused"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_user_console_access_unused.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_user_console_access_unused/ram_user_console_access_unused.py

```python
import datetime

from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_user_console_access_unused(Check):
    """Check if RAM users with console access have logged in within the configured days."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        maximum_unused_days = ram_client.audit_config.get("max_console_access_days", 90)
        findings = []
        for user in ram_client.users:
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=user)
            report.region = ram_client.region
            report.resource_id = user.name
            report.resource_arn = (
                f"acs:ram::{ram_client.audited_account}:user/{user.name}"
            )
            if user.has_console_access:
                if user.password_last_used:
                    time_since_insertion = (
                        datetime.datetime.now()
                        - datetime.datetime.strptime(
                            str(user.password_last_used), "%Y-%m-%d %H:%M:%S+00:00"
                        )
                    )
                    if time_since_insertion.days > maximum_unused_days:
                        report.status = "FAIL"
                        report.status_extended = (
                            f"RAM user {user.name} has not logged in to the console "
                            f"in the past {maximum_unused_days} days "
                            f"({time_since_insertion.days} days)."
                        )
                    else:
                        report.status = "PASS"
                        report.status_extended = (
                            f"RAM user {user.name} has logged in to the console "
                            f"in the past {maximum_unused_days} days "
                            f"({time_since_insertion.days} days)."
                        )
                else:
                    # User has console access but has never logged in
                    report.status = "FAIL"
                    report.status_extended = (
                        f"RAM user {user.name} has console access enabled "
                        "but has never logged in to the console."
                    )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"RAM user {user.name} does not have console access enabled."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_user_mfa_enabled_console_access.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_user_mfa_enabled_console_access/ram_user_mfa_enabled_console_access.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_user_mfa_enabled_console_access",
  "CheckTitle": "Multi-factor authentication is enabled for all RAM users that have a console password",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:user/{user-name}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudRAMUser",
  "Description": "**Multi-Factor Authentication (MFA)** adds an extra layer of protection on top of a username and password.\n\nWith MFA enabled, when a user logs on to Alibaba Cloud, they will be prompted for their username and password followed by an authentication code from their virtual MFA device. It is recommended that MFA be enabled for all users that have a console password.",
  "Risk": "**MFA** requires users to verify their identities by entering two authentication factors. When MFA is enabled, an attacker faces at least two different authentication mechanisms.\n\nThe additional security makes it significantly harder for an attacker to gain access even if passwords are compromised.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/119555.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/ram-user-multi-factor-authentication-enabled.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. For each user with console access, go to the user's details\n3. In the **Console Logon Management** section, click **Modify Logon Settings**\n4. For `Enable MFA`, select **Required**\n5. Click **OK** to save the settings",
      "Url": "https://hub.prowler.com/check/ram_user_mfa_enabled_console_access"
    }
  },
  "Categories": [
    "encryption"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_user_mfa_enabled_console_access.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_user_mfa_enabled_console_access/ram_user_mfa_enabled_console_access.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_user_mfa_enabled_console_access(Check):
    """Check if all RAM users with console access have MFA enabled."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for user in ram_client.users:
            # Only check users with console access
            if user.has_console_access:
                report = CheckReportAlibabaCloud(
                    metadata=self.metadata(), resource=user
                )
                report.region = ram_client.region
                report.resource_id = user.name
                report.resource_arn = (
                    f"acs:ram::{ram_client.audited_account}:user/{user.name}"
                )

                # Check if MFA is required for console access
                # mfa_bind_required indicates whether MFA is required in the login profile
                if user.mfa_bind_required:
                    report.status = "PASS"
                    report.status_extended = (
                        f"RAM user {user.name} has MFA enabled for console access."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = f"RAM user {user.name} has console access but does not have MFA enabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_client.py

```python
from prowler.providers.alibabacloud.services.rds.rds_service import RDS
from prowler.providers.common.provider import Provider

rds_client = RDS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
