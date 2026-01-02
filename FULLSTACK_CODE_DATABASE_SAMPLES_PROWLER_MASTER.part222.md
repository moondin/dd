---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 222
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 222 of 867)

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

---[FILE: ram_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_client.py

```python
from prowler.providers.alibabacloud.services.ram.ram_service import RAM
from prowler.providers.common.provider import Provider

ram_client = RAM(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: ram_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_service.py
Signals: Pydantic

```python
import json
from datetime import datetime
from typing import Optional

from alibabacloud_ram20150501 import models as ram_models
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class RAM(AlibabaCloudService):
    """
    RAM (Resource Access Management) service class for Alibaba Cloud.

    This class provides methods to interact with Alibaba Cloud RAM service
    to retrieve users, access keys, MFA devices, password policies, etc.
    """

    def __init__(self, provider):
        # Call AlibabaCloudService's __init__
        super().__init__(__class__.__name__, provider, global_service=True)

        # Fetch RAM resources
        self.users = self._list_users()
        self.password_policy = self._get_password_policy()
        self.mfa_devices = self._list_virtual_mfa_devices()
        self.groups = self._list_groups()
        self.policies = self._list_policies()

        # Enrich users with additional information
        self._get_user_mfa_devices()
        self._get_user_access_keys()
        self._get_user_login_profile()
        self._list_policies_for_user()
        self._list_groups_for_user()

        # Get root account access keys
        self.root_access_keys = self._get_root_access_keys()

        # Get policy documents
        self._get_policy_documents()

    def _list_users(self):
        """List all RAM users."""
        logger.info("RAM - Listing Users...")
        users = []

        try:
            request = ram_models.ListUsersRequest()
            response = self.client.list_users(request)

            if response and response.body and response.body.users:
                for user_data in response.body.users.user:
                    if not self.audit_resources or is_resource_filtered(
                        user_data.user_name, self.audit_resources
                    ):
                        users.append(
                            User(
                                name=user_data.user_name,
                                user_id=user_data.user_id,
                                display_name=getattr(user_data, "display_name", ""),
                                create_date=getattr(user_data, "create_date", None),
                                update_date=getattr(user_data, "update_date", None),
                            )
                        )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return users

    def _get_password_policy(self):
        """Get password policy settings."""
        logger.info("RAM - Getting Password Policy...")

        try:
            response = self.client.get_password_policy()

            if response and response.body and response.body.password_policy:
                policy = response.body.password_policy
                return PasswordPolicy(
                    minimum_password_length=getattr(
                        policy, "minimum_password_length", 8
                    ),
                    require_lowercase_characters=getattr(
                        policy, "require_lowercase_characters", False
                    ),
                    require_uppercase_characters=getattr(
                        policy, "require_uppercase_characters", False
                    ),
                    require_numbers=getattr(policy, "require_numbers", False),
                    require_symbols=getattr(policy, "require_symbols", False),
                    hard_expiry=getattr(policy, "hard_expiry", False),
                    max_password_age=getattr(policy, "max_password_age", 0),
                    password_reuse_prevention=getattr(
                        policy, "password_reuse_prevention", 0
                    ),
                    max_login_attempts=getattr(policy, "max_login_attemps", 0),
                )
            return None

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None

    def _list_virtual_mfa_devices(self):
        """List all virtual MFA devices."""
        logger.info("RAM - Listing Virtual MFA Devices...")
        mfa_devices = []

        try:
            response = self.client.list_virtual_mfadevices()

            if response and response.body and response.body.virtual_mfadevices:
                for device in response.body.virtual_mfadevices.virtual_mfadevice:
                    mfa_devices.append(
                        MFADevice(
                            serial_number=device.serial_number,
                            user_name=(
                                getattr(device, "user", {}).get("user_name", "")
                                if hasattr(device, "user")
                                else ""
                            ),
                            enable_date=getattr(device, "activate_date", None),
                        )
                    )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return mfa_devices

    def _list_groups(self):
        """List all RAM groups."""
        logger.info("RAM - Listing Groups...")
        groups = []

        try:
            request = ram_models.ListGroupsRequest()
            response = self.client.list_groups(request)

            if response and response.body and response.body.groups:
                for group_data in response.body.groups.group:
                    groups.append(
                        Group(
                            name=group_data.group_name,
                            group_id=getattr(group_data, "group_id", ""),
                            create_date=getattr(group_data, "create_date", None),
                        )
                    )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return groups

    def _list_policies(self):
        """List all RAM policies."""
        logger.info("RAM - Listing Policies...")
        policies = {}

        try:
            # List custom policies
            request = ram_models.ListPoliciesRequest(policy_type="Custom")
            response = self.client.list_policies(request)

            if response and response.body and response.body.policies:
                for policy_data in response.body.policies.policy:
                    policy_name = policy_data.policy_name
                    policies[policy_name] = Policy(
                        name=policy_name,
                        policy_type="Custom",
                        description=getattr(policy_data, "description", ""),
                        create_date=getattr(policy_data, "create_date", None),
                        update_date=getattr(policy_data, "update_date", None),
                        attachment_count=getattr(policy_data, "attachment_count", 0),
                    )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return policies

    def _get_policy_documents(self):
        """Get policy documents for all custom policies."""
        logger.info("RAM - Getting Policy Documents...")

        for policy_name, policy in self.policies.items():
            if policy.policy_type == "Custom":
                try:
                    request = ram_models.GetPolicyRequest(
                        policy_name=policy_name, policy_type="Custom"
                    )
                    response = self.client.get_policy(request)

                    if response and response.body and response.body.policy:
                        policy_data = response.body.policy
                        # Get the default policy version
                        default_version = getattr(policy_data, "default_version", None)
                        if default_version:
                            # Get the policy version document
                            version_request = ram_models.GetPolicyVersionRequest(
                                policy_name=policy_name,
                                policy_type="Custom",
                                version_id=default_version,
                            )
                            version_response = self.client.get_policy_version(
                                version_request
                            )
                            if (
                                version_response
                                and version_response.body
                                and version_response.body.policy_version
                            ):
                                policy_doc_str = getattr(
                                    version_response.body.policy_version,
                                    "policy_document",
                                    None,
                                )
                                if policy_doc_str:
                                    try:
                                        policy.document = json.loads(policy_doc_str)
                                    except json.JSONDecodeError:
                                        logger.warning(
                                            f"Could not parse policy document for {policy_name}"
                                        )
                                        policy.document = None
                except Exception as error:
                    logger.error(
                        f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    policy.document = None

    def _get_user_mfa_devices(self):
        """Get MFA devices for each user."""
        logger.info("RAM - Getting User MFA Devices...")

        for user in self.users:
            user.mfa_devices = []
            for device in self.mfa_devices:
                if device.user_name == user.name:
                    user.mfa_devices.append(device)

    def _get_user_access_keys(self):
        """Get access keys for each user."""
        logger.info("RAM - Getting User Access Keys...")

        for user in self.users:
            try:
                request = ram_models.ListAccessKeysRequest(user_name=user.name)
                response = self.client.list_access_keys(request)

                user.access_keys = []
                if response and response.body and response.body.access_keys:
                    for key_data in response.body.access_keys.access_key:
                        user.access_keys.append(
                            AccessKey(
                                access_key_id=key_data.access_key_id,
                                status=key_data.status,
                                create_date=getattr(key_data, "create_date", None),
                            )
                        )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                user.access_keys = []

    def _get_user_login_profile(self):
        """Get login profile for each user to check console access."""
        logger.info("RAM - Getting User Login Profiles...")

        for user in self.users:
            try:
                request = ram_models.GetLoginProfileRequest(user_name=user.name)
                response = self.client.get_login_profile(request)

                if response and response.body and response.body.login_profile:
                    profile = response.body.login_profile
                    user.has_console_access = True
                    user.password_last_used = getattr(
                        profile, "password_last_used", None
                    )
                    user.mfa_bind_required = getattr(profile, "mfabind_required", False)

            except Exception:
                # User doesn't have console access
                user.has_console_access = False
                user.password_last_used = None
                user.mfa_bind_required = False

    def _list_policies_for_user(self):
        """List policies attached to each user."""
        logger.info("RAM - Listing Policies for Users...")

        for user in self.users:
            try:
                request = ram_models.ListPoliciesForUserRequest(user_name=user.name)
                response = self.client.list_policies_for_user(request)

                user.attached_policies = []
                if response and response.body and response.body.policies:
                    for policy_data in response.body.policies.policy:
                        user.attached_policies.append(
                            AttachedPolicy(
                                policy_name=policy_data.policy_name,
                                policy_type=policy_data.policy_type,
                                attach_date=getattr(policy_data, "attach_date", None),
                            )
                        )

            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                user.attached_policies = []

    def _list_groups_for_user(self):
        """List groups for each user."""
        logger.info("RAM - Listing Groups for Users...")

        for user in self.users:
            try:
                request = ram_models.ListGroupsForUserRequest(user_name=user.name)
                response = self.client.list_groups_for_user(request)

                user.groups = []
                if response and response.body and response.body.groups:
                    for group_data in response.body.groups.group:
                        user.groups.append(group_data.group_name)

            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                user.groups = []

    def _get_root_access_keys(self):
        """Get root account access keys.

        Note: This only works when authenticated as the root account.
        If authenticated as a RAM user, this will return empty list as
        RAM users cannot query root account access keys.
        """
        logger.info("RAM - Getting Root Account Access Keys...")
        root_access_keys = []

        # Check if we're authenticated as root account
        # Use the is_root flag from identity (set via STS GetCallerIdentity)
        is_root = self.provider.identity.is_root

        if not is_root:
            # If we're authenticated as a RAM user, we can't query root account access keys
            logger.warning(
                "RAM - Cannot query root account access keys: authenticated as RAM user, not root account"
            )
            return root_access_keys

        try:
            # Call ListAccessKeys without user_name to get root account access keys
            # This only works when called with root account credentials
            request = ram_models.ListAccessKeysRequest()
            response = self.client.list_access_keys(request)

            if response and response.body and response.body.access_keys:
                for key_data in response.body.access_keys.access_key:
                    root_access_keys.append(
                        AccessKey(
                            access_key_id=key_data.access_key_id,
                            status=key_data.status,
                            create_date=getattr(key_data, "create_date", None),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return root_access_keys


# Models for RAM service
class User(BaseModel):
    """RAM User model."""

    name: str
    user_id: str
    display_name: str = ""
    create_date: Optional[datetime] = None
    update_date: Optional[datetime] = None
    has_console_access: bool = False
    password_last_used: Optional[datetime] = None
    mfa_bind_required: bool = False
    mfa_devices: list = []
    access_keys: list = []
    attached_policies: list = []
    groups: list = []


class AccessKey(BaseModel):
    """Access Key model."""

    access_key_id: str
    status: str
    create_date: Optional[datetime] = None


class MFADevice(BaseModel):
    """MFA Device model."""

    serial_number: str
    user_name: str
    enable_date: Optional[datetime] = None


class PasswordPolicy(BaseModel):
    """Password Policy model."""

    minimum_password_length: int = 8
    require_lowercase_characters: bool = False
    require_uppercase_characters: bool = False
    require_numbers: bool = False
    require_symbols: bool = False
    hard_expiry: bool = False
    max_password_age: int = 0
    password_reuse_prevention: int = 0
    max_login_attempts: int = 0


class AccountSummary(BaseModel):
    """Account Summary model."""

    users: int = 0
    groups: int = 0
    roles: int = 0
    policies: int = 0
    mfa_devices: int = 0
    mfa_devices_in_use: int = 0


class Group(BaseModel):
    """RAM Group model."""

    name: str
    group_id: str
    create_date: Optional[datetime] = None


class Policy(BaseModel):
    """RAM Policy model."""

    name: str
    policy_type: str
    description: str = ""
    create_date: Optional[datetime] = None
    update_date: Optional[datetime] = None
    attachment_count: int = 0
    document: Optional[dict] = None


class AttachedPolicy(BaseModel):
    """Attached Policy model."""

    policy_name: str
    policy_type: str
    attach_date: Optional[datetime] = None
```

--------------------------------------------------------------------------------

---[FILE: ram_no_root_access_key.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_no_root_access_key/ram_no_root_access_key.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_no_root_access_key",
  "CheckTitle": "No root account access key exists",
  "CheckType": [
    "Unusual logon",
    "Cloud threat detection"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:root",
  "Severity": "critical",
  "ResourceType": "AlibabaCloudRAMAccessKey",
  "Description": "Ensure no **root account access key** exists. Access keys provide programmatic access to a given Alibaba Cloud account.\n\nIt is recommended that all access keys associated with the root account be removed.",
  "Risk": "The **root account** is the most privileged user in an Alibaba Cloud account. Access Keys provide programmatic access to a given Alibaba Cloud account.\n\nRemoving access keys associated with the root account limits vectors by which the account can be compromised and encourages the creation and use of **role-based accounts** that are least privileged.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/102600.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/remove-root-access-keys.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram DeleteAccessKey --UserAccessKeyId <access_key_ID>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console** by using your Alibaba Cloud account (root account)\n2. Move the pointer over the account icon in the upper-right corner and click **AccessKey**\n3. Click **Continue to manage AccessKey**\n4. On the Security Management page, find the target access keys and click **Delete** to delete the target access keys permanently",
      "Url": "https://hub.prowler.com/check/ram_no_root_access_key"
    }
  },
  "Categories": [
    "internet-exposed"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ram_no_root_access_key.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_no_root_access_key/ram_no_root_access_key.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_no_root_access_key(Check):
    """Check if root account has no access keys."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        report = CheckReportAlibabaCloud(metadata=self.metadata(), resource={})
        report.region = ram_client.region
        report.resource_id = "<root_account>"
        report.resource_arn = f"acs:ram::{ram_client.audited_account}:root"

        # Check if we're authenticated as root account
        # Use the is_root flag from identity (set via STS GetCallerIdentity)
        is_root = ram_client.provider.identity.is_root

        if not is_root:
            # If authenticated as RAM user, we can't verify root account access keys
            report.status = "MANUAL"
            report.status_extended = "Cannot verify root account access keys: authenticated as RAM user. This check requires root account credentials."
        elif ram_client.root_access_keys:
            report.status = "FAIL"
            report.status_extended = "Root account has access keys."
        else:
            report.status = "PASS"
            report.status_extended = "Root account does not have access keys."

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_lowercase.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_lowercase/ram_password_policy_lowercase.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_password_policy_lowercase",
  "CheckTitle": "RAM password policy requires at least one lowercase letter",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:password-policy",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMPasswordPolicy",
  "Description": "**RAM password policies** can be used to ensure password complexity.\n\nIt is recommended that the password policy require at least one **lowercase letter**.",
  "Risk": "Enhancing complexity of a password policy increases account resiliency against **brute force logon attempts**.\n\nWeak passwords without character variety are more susceptible to dictionary attacks and automated password cracking tools.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116413.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/lowercase-letter-password-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram SetPasswordPolicy --RequireLowercaseCharacters true",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ram_password_policy\" \"example\" {\n  require_lowercase_characters = true\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Settings**\n3. In the Password section, click **Modify**\n4. In the Charset section, select **Lower case**\n5. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_password_policy_lowercase"
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

---[FILE: ram_password_policy_lowercase.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_lowercase/ram_password_policy_lowercase.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_password_policy_lowercase(Check):
    """Check if RAM password policy requires at least one lowercase letter."""

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

            if ram_client.password_policy.require_lowercase_characters:
                report.status = "PASS"
                report.status_extended = (
                    "RAM password policy requires at least one lowercase letter."
                )
            else:
                report.status = "FAIL"
                report.status_extended = "RAM password policy does not require at least one lowercase letter."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_max_login_attempts.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_max_login_attempts/ram_password_policy_max_login_attempts.metadata.json
Signals: Next.js

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_password_policy_max_login_attempts",
  "CheckTitle": "RAM password policy temporarily blocks logon after 5 incorrect logon attempts within an hour",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:password-policy",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMPasswordPolicy",
  "Description": "**RAM password policies** can temporarily block logon after several incorrect logon attempts within an hour.\n\nIt is recommended that the password policy is set to temporarily block logon after **5 incorrect logon attempts** within an hour.",
  "Risk": "Temporarily blocking logon for incorrect password input increases account resiliency against **brute force logon attempts**.\n\nThis control helps prevent automated password guessing attacks from succeeding.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116413.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/max-login-attempts-password-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram SetPasswordPolicy --MaxLoginAttemps 5",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ram_password_policy\" \"example\" {\n  max_login_attemps = 5\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Settings**\n3. In the Password section, click **Modify**\n4. In the `Max Attempts` field, check the box next to **Enable** and enter `5`\n5. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_password_policy_max_login_attempts"
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

---[FILE: ram_password_policy_max_login_attempts.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_max_login_attempts/ram_password_policy_max_login_attempts.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_password_policy_max_login_attempts(Check):
    """Check if RAM password policy temporarily blocks logon after 5 incorrect logon attempts within an hour."""

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
            if ram_client.password_policy.max_login_attempts >= 5:
                report.status = "PASS"
                report.status_extended = "RAM password policy temporarily blocks logon after 5 incorrect logon attempts within an hour."
            elif ram_client.password_policy.max_login_attempts == 0:
                report.status = "FAIL"
                report.status_extended = "RAM password policy does not temporarily block logon after incorrect attempts (max login attempts is disabled)."
            else:
                report.status = "FAIL"
                report.status_extended = f"RAM password policy temporarily blocks logon after {ram_client.password_policy.max_login_attempts} incorrect logon attempts, which is not the recommended value of 5."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_max_password_age.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_max_password_age/ram_password_policy_max_password_age.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_password_policy_max_password_age",
  "CheckTitle": "RAM password policy expires passwords in 365 days or greater",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:password-policy",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMPasswordPolicy",
  "Description": "**RAM password policies** can require passwords to be expired after a given number of days.\n\nIt is recommended that the password policy expire passwords after **365 days** or greater.",
  "Risk": "Too frequent password changes are more harmful than beneficial. They offer no containment benefits and enforce bad habits, since they encourage users to choose variants of older passwords.\n\nThe CIS now recommends an **annual password reset** as a balanced approach.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116413.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/require-password-expiration-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram SetPasswordPolicy --MaxPasswordAge 365",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ram_password_policy\" \"example\" {\n  max_password_age = 90\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Settings**\n3. In the Password section, click **Modify**\n4. Check the box under `Max Age`, enter `365` or a greater number up to `1095`\n5. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_password_policy_max_password_age"
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

---[FILE: ram_password_policy_max_password_age.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_max_password_age/ram_password_policy_max_password_age.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_password_policy_max_password_age(Check):
    """Check if RAM password policy expires passwords in 365 days or greater."""

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

            # If max_password_age is 0, it means password expiration is disabled (which is acceptable)
            # If it's set, it should be 365 or greater
            if ram_client.password_policy.max_password_age == 0:
                report.status = "PASS"
                report.status_extended = "RAM password policy does not expire passwords (password expiration is disabled)."
            elif ram_client.password_policy.max_password_age >= 365:
                report.status = "PASS"
                report.status_extended = f"RAM password policy expires passwords after {ram_client.password_policy.max_password_age} days."
            else:
                report.status = "FAIL"
                report.status_extended = f"RAM password policy expires passwords after {ram_client.password_policy.max_password_age} days, which is less than the recommended 365 days."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_minimum_length.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_minimum_length/ram_password_policy_minimum_length.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_password_policy_minimum_length",
  "CheckTitle": "RAM password policy requires minimum length of 14 or greater",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:password-policy",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMPasswordPolicy",
  "Description": "**RAM password policies** can be used to ensure password complexity.\n\nIt is recommended that the password policy require a minimum of **14 or greater characters** for any password.",
  "Risk": "Enhancing complexity of a password policy increases account resiliency against **brute force logon attempts**.\n\nLonger passwords provide exponentially more security against automated password cracking.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116413.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/require-14-characters-password-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram SetPasswordPolicy --MinimumPasswordLength 14",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ram_password_policy\" \"example\" {\n  minimum_password_length = 14\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Settings**\n3. In the Password section, click **Modify**\n4. In the Length section, enter `14` or a greater number\n5. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_password_policy_minimum_length"
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

---[FILE: ram_password_policy_minimum_length.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_minimum_length/ram_password_policy_minimum_length.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ram.ram_client import ram_client


class ram_password_policy_minimum_length(Check):
    """Check if RAM password policy requires minimum length of 14 or greater."""

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

            if ram_client.password_policy.minimum_password_length >= 14:
                report.status = "PASS"
                report.status_extended = f"RAM password policy requires minimum length of {ram_client.password_policy.minimum_password_length} characters."
            else:
                report.status = "FAIL"
                report.status_extended = f"RAM password policy requires minimum length of {ram_client.password_policy.minimum_password_length} characters, which is less than the recommended 14 characters."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ram_password_policy_number.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ram/ram_password_policy_number/ram_password_policy_number.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ram_password_policy_number",
  "CheckTitle": "RAM password policy require at least one number",
  "CheckType": [
    "Unusual logon",
    "Abnormal account"
  ],
  "ServiceName": "ram",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ram::account-id:password-policy",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRAMPasswordPolicy",
  "Description": "**RAM password policies** can be used to ensure password complexity.\n\nIt is recommended that the password policy require at least one **number**.",
  "Risk": "Enhancing complexity of a password policy increases account resiliency against **brute force logon attempts**.\n\nWeak passwords without numeric characters are more susceptible to dictionary attacks.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/116413.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RAM/require-number-password-policy.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ram SetPasswordPolicy --RequireNumbers true",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ram_password_policy\" \"example\" {\n  require_numbers = true\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RAM Console**\n2. Choose **Settings**\n3. In the Password section, click **Modify**\n4. In the Charset section, select **Number**\n5. Click **OK**",
      "Url": "https://hub.prowler.com/check/ram_password_policy_number"
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

````
