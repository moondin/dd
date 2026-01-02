---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 406
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 406 of 867)

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

---[FILE: identity_tenancy_admin_permissions_limited.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_tenancy_admin_permissions_limited/identity_tenancy_admin_permissions_limited.py

```python
"""Check Ensure permissions on all resources are given only to the tenancy administrator group."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_tenancy_admin_permissions_limited(Check):
    """Check Ensure permissions on all resources are given only to the tenancy administrator group."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_tenancy_admin_permissions_limited check.

        Ensure permissions on all resources are given only to the tenancy administrator group.
        This check verifies that only the 'Tenant Admin Policy' grants 'manage all-resources in tenancy' permissions.
        Other policies should not have such broad permissions.
        """
        findings = []

        # Check for policies that grant "manage all-resources in tenancy"
        for policy in identity_client.policies:
            # Skip non-active policies
            if policy.lifecycle_state != "ACTIVE":
                continue

            region = policy.region if hasattr(policy, "region") else "global"

            has_violation = False
            for statement in policy.statements:
                statement_upper = statement.upper()

                # Check for "allow group ... to manage all-resources in tenancy"
                # This should only be in "Tenant Admin Policy"
                if (
                    "ALLOW GROUP" in statement_upper
                    and "TO MANAGE ALL-RESOURCES IN TENANCY" in statement_upper
                ):
                    # If this is not the Tenant Admin Policy, it's a violation
                    if policy.name.upper() != "TENANT ADMIN POLICY":
                        has_violation = True
                    break

            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=policy,
                region=region,
                resource_name=policy.name,
                resource_id=policy.id,
                compartment_id=policy.compartment_id,
            )

            if has_violation:
                report.status = "FAIL"
                report.status_extended = f"Policy '{policy.name}' grants 'manage all-resources in tenancy' permissions to groups other than the Administrators group. Only the tenancy administrator group should have such broad permissions."
            else:
                report.status = "PASS"
                report.status_extended = f"Policy '{policy.name}' does not grant overly broad tenancy-wide permissions to non-administrator groups."

            findings.append(report)

        # If no policies found, that's a PASS (no violations)
        if not findings:
            region = (
                identity_client.audited_regions[0].key
                if identity_client.audited_regions
                else "global"
            )
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region=region,
                resource_name="Tenancy",
                resource_id=identity_client.audited_tenancy,
                compartment_id=identity_client.audited_tenancy,
            )
            report.status = "PASS"
            report.status_extended = "No active policies found granting overly broad tenancy-wide permissions to non-administrator groups."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_tenancy_admin_users_no_api_keys.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_tenancy_admin_users_no_api_keys/identity_tenancy_admin_users_no_api_keys.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_tenancy_admin_users_no_api_keys",
  "CheckTitle": "Ensure API keys are not created for tenancy administrator users",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "high",
  "ResourceType": "OciIamUser",
  "Description": "Tenancy administrator users should not have API keys.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure API keys are not created for tenancy administrator users",
      "Url": "https://hub.prowler.com/check/oci/identity_tenancy_admin_users_no_api_keys"
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

---[FILE: identity_tenancy_admin_users_no_api_keys.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_tenancy_admin_users_no_api_keys/identity_tenancy_admin_users_no_api_keys.py

```python
"""Check Ensure API keys are not created for tenancy administrator users."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_tenancy_admin_users_no_api_keys(Check):
    """Check Ensure API keys are not created for tenancy administrator users."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_tenancy_admin_users_no_api_keys check."""
        findings = []

        # Check tenancy admin users for API keys
        for user in identity_client.users:
            # Check if user is in Administrators group
            is_admin = False
            for group_id in user.groups:
                for group in identity_client.groups:
                    if group.id == group_id and "Administrators" in group.name:
                        is_admin = True
                        break

            if is_admin:
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource=user,
                    region=user.region,
                    resource_name=user.name,
                    resource_id=user.id,
                    compartment_id=user.compartment_id,
                )

                if user.api_keys:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Tenancy administrator user {user.name} has API keys."
                    )
                else:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Tenancy administrator user {user.name} has no API keys."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_user_api_keys_rotated_90_days.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_api_keys_rotated_90_days/identity_user_api_keys_rotated_90_days.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_user_api_keys_rotated_90_days",
  "CheckTitle": "Ensure user API keys rotate within 90 days or less",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "medium",
  "ResourceType": "OciIamApiKey",
  "Description": "Ensure user API keys rotate within 90 days or less. API keys are used to authenticate API calls. For security purposes, it is recommended that API keys be rotated regularly.",
  "Risk": "Having API keys that have not been rotated in over 90 days increases the risk of unauthorized access if the key is compromised.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcredentials.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci iam api-key upload --user-id <user-ocid> --key-file <path-to-new-public-key> && oci iam api-key delete --user-id <user-ocid> --fingerprint <old-key-fingerprint>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-IAM/rotate-user-api-keys.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Rotate API keys that are older than 90 days by creating a new key and deleting the old one.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcredentials.htm"
    }
  },
  "Categories": [
    "identity-access",
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: identity_user_api_keys_rotated_90_days.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_api_keys_rotated_90_days/identity_user_api_keys_rotated_90_days.py

```python
"""Check if user API keys rotate within 90 days or less."""

from datetime import datetime, timezone

import pytz

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)

maximum_expiration_days = 90


class identity_user_api_keys_rotated_90_days(Check):
    """Check if user API keys rotate within 90 days or less."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_user_api_keys_rotated_90_days check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for user in identity_client.users:
            # Check if user has API keys
            if user.api_keys:
                for api_key in user.api_keys:
                    # Only check active API keys
                    if api_key.lifecycle_state == "ACTIVE":
                        report = Check_Report_OCI(
                            metadata=self.metadata(),
                            resource=user,
                            region=user.region,
                            resource_name=user.name,
                            resource_id=user.id,
                            compartment_id=user.compartment_id,
                        )

                        # Calculate age of the API key
                        now = datetime.now(timezone.utc)
                        # Ensure api_key.time_created is timezone aware
                        if api_key.time_created.tzinfo is None:
                            key_created = api_key.time_created.replace(tzinfo=pytz.utc)
                        else:
                            key_created = api_key.time_created

                        age_days = (now - key_created).days

                        if age_days > maximum_expiration_days:
                            report.status = "FAIL"
                            report.status_extended = f"User {user.name} has API key (fingerprint: {api_key.fingerprint[:16]}...) that has not been rotated in {age_days} days (over 90 days)."
                        else:
                            report.status = "PASS"
                            report.status_extended = f"User {user.name} has API key (fingerprint: {api_key.fingerprint[:16]}...) that was created {age_days} days ago (within 90 days)."

                        findings.append(report)
            else:
                # User has no API keys
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource=user,
                    region=user.region,
                    resource_name=user.name,
                    resource_id=user.id,
                    compartment_id=user.compartment_id,
                )
                report.status = "PASS"
                report.status_extended = f"User {user.name} does not have any API keys."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_user_auth_tokens_rotated_90_days.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_auth_tokens_rotated_90_days/identity_user_auth_tokens_rotated_90_days.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_user_auth_tokens_rotated_90_days",
  "CheckTitle": "Ensure user auth tokens rotate within 90 days or less",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "medium",
  "ResourceType": "OciIamUser",
  "Description": "Auth tokens should be rotated within 90 days.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-IAM/rotate-user-auth-tokens.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure user auth tokens rotate within 90 days or less",
      "Url": "https://hub.prowler.com/check/oci/identity_user_auth_tokens_rotated_90_days"
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

---[FILE: identity_user_auth_tokens_rotated_90_days.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_auth_tokens_rotated_90_days/identity_user_auth_tokens_rotated_90_days.py

```python
"""Check Ensure user auth tokens rotate within 90 days or less."""

from datetime import datetime, timedelta, timezone

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_user_auth_tokens_rotated_90_days(Check):
    """Check Ensure user auth tokens rotate within 90 days or less."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_user_auth_tokens_rotated_90_days check.

        Ensure user auth tokens rotate within 90 days or less.
        """
        findings = []

        # Calculate 90 days ago from now
        current_time = datetime.now(timezone.utc)
        max_age = current_time - timedelta(days=90)

        # Check each user's auth tokens
        for user in identity_client.users:
            if not user.auth_tokens:
                continue

            for token in user.auth_tokens:
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource=token,
                    region=user.region,
                    resource_name=f"{user.name} - Auth Token",
                    resource_id=token.id,
                    compartment_id=user.compartment_id,
                )

                # Check if token is older than 90 days
                token_age_days = (current_time - token.time_created).days

                if token.time_created < max_age:
                    report.status = "FAIL"
                    report.status_extended = f"User '{user.name}' has an auth token created {token_age_days} days ago (on {token.time_created.strftime('%Y-%m-%d')}), which exceeds the 90-day rotation period."
                else:
                    report.status = "PASS"
                    report.status_extended = f"User '{user.name}' has an auth token created {token_age_days} days ago, which is within the 90-day rotation period."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_user_customer_secret_keys_rotated_90_days.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_customer_secret_keys_rotated_90_days/identity_user_customer_secret_keys_rotated_90_days.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_user_customer_secret_keys_rotated_90_days",
  "CheckTitle": "Ensure user customer secret keys rotate within 90 days or less",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "medium",
  "ResourceType": "OciIamUser",
  "Description": "Customer secret keys should be rotated within 90 days.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-IAM/rotate-customer-secret-keys.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure user customer secret keys rotate within 90 days or less",
      "Url": "https://hub.prowler.com/check/oci/identity_user_customer_secret_keys_rotated_90_days"
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

---[FILE: identity_user_customer_secret_keys_rotated_90_days.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_customer_secret_keys_rotated_90_days/identity_user_customer_secret_keys_rotated_90_days.py

```python
"""Check Ensure user customer secret keys rotate within 90 days or less."""

from datetime import datetime, timedelta, timezone

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_user_customer_secret_keys_rotated_90_days(Check):
    """Check Ensure user customer secret keys rotate within 90 days or less."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_user_customer_secret_keys_rotated_90_days check."""
        findings = []

        # Calculate 90 days ago from now
        current_time = datetime.now(timezone.utc)
        max_age = current_time - timedelta(days=90)

        # Check each user's customer secret keys
        for user in identity_client.users:
            if not user.customer_secret_keys:
                continue

            for key in user.customer_secret_keys:
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource=key,
                    region=user.region,
                    resource_name=f"{user.name} - Customer Secret Key",
                    resource_id=key.id,
                    compartment_id=user.compartment_id,
                )

                # Check if key is older than 90 days
                key_age_days = (current_time - key.time_created).days

                if key.time_created < max_age:
                    report.status = "FAIL"
                    report.status_extended = f"User '{user.name}' has a customer secret key created {key_age_days} days ago (on {key.time_created.strftime('%Y-%m-%d')}), which exceeds the 90-day rotation period."
                else:
                    report.status = "PASS"
                    report.status_extended = f"User '{user.name}' has a customer secret key created {key_age_days} days ago, which is within the 90-day rotation period."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_user_db_passwords_rotated_90_days.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_db_passwords_rotated_90_days/identity_user_db_passwords_rotated_90_days.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_user_db_passwords_rotated_90_days",
  "CheckTitle": "Ensure user IAM Database Passwords rotate within 90 days",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "medium",
  "ResourceType": "OciIamUser",
  "Description": "Database passwords should be rotated within 90 days.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure user IAM Database Passwords rotate within 90 days",
      "Url": "https://hub.prowler.com/check/oci/identity_user_db_passwords_rotated_90_days"
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

---[FILE: identity_user_db_passwords_rotated_90_days.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_db_passwords_rotated_90_days/identity_user_db_passwords_rotated_90_days.py

```python
"""Check Ensure user IAM Database Passwords rotate within 90 days."""

from datetime import datetime, timedelta, timezone

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_user_db_passwords_rotated_90_days(Check):
    """Check Ensure user IAM Database Passwords rotate within 90 days."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_user_db_passwords_rotated_90_days check."""
        findings = []

        # Calculate 90 days ago from now
        current_time = datetime.now(timezone.utc)
        max_age = current_time - timedelta(days=90)

        # Check each user's database passwords
        for user in identity_client.users:
            if not user.db_passwords:
                continue

            for password in user.db_passwords:
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource=password,
                    region=user.region,
                    resource_name=f"{user.name} - DB Password",
                    resource_id=password.id,
                    compartment_id=user.compartment_id,
                )

                # Check if password is older than 90 days
                password_age_days = (current_time - password.time_created).days

                if password.time_created < max_age:
                    report.status = "FAIL"
                    report.status_extended = f"User '{user.name}' has a database password created {password_age_days} days ago (on {password.time_created.strftime('%Y-%m-%d')}), which exceeds the 90-day rotation period."
                else:
                    report.status = "PASS"
                    report.status_extended = f"User '{user.name}' has a database password created {password_age_days} days ago, which is within the 90-day rotation period."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_user_mfa_enabled_console_access.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_mfa_enabled_console_access/identity_user_mfa_enabled_console_access.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_user_mfa_enabled_console_access",
  "CheckTitle": "Ensure MFA is enabled for all users with a console password",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "high",
  "ResourceType": "OciIamUser",
  "Description": "Ensure MFA is enabled for all users with a console password. Multi-factor authentication is a method of authentication that requires the use of more than one factor to verify a user's identity.",
  "Risk": "Enabling MFA provides increased security by requiring two methods of verification at sign-in. With MFA enabled, a user must possess a device that emits a time-sensitive key and have knowledge of a username and password.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/usingmfa.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-IAM/enable-mfa-for-user-accounts.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable MFA for all users with console password access.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/usingmfa.htm"
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

---[FILE: identity_user_mfa_enabled_console_access.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_mfa_enabled_console_access/identity_user_mfa_enabled_console_access.py

```python
"""Check if MFA is enabled for all users with console password."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_user_mfa_enabled_console_access(Check):
    """Check if MFA is enabled for all users with console password."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_user_mfa_enabled_console_access check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for user in identity_client.users:
            # Only check users with console access
            if user.can_use_console_password:
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource=user,
                    region=user.region,
                    resource_name=user.name,
                    resource_id=user.id,
                    compartment_id=user.compartment_id,
                )

                if user.is_mfa_activated:
                    report.status = "PASS"
                    report.status_extended = (
                        f"User {user.name} has MFA enabled for console access."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User {user.name} has console password enabled but MFA is not activated."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_user_valid_email_address.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_valid_email_address/identity_user_valid_email_address.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_user_valid_email_address",
  "CheckTitle": "Ensure all OCI IAM user accounts have a valid and current email address",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "low",
  "ResourceType": "OciIamUser",
  "Description": "All user accounts should have valid email addresses.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure all OCI IAM user accounts have a valid and current email address",
      "Url": "https://hub.prowler.com/check/oci/identity_user_valid_email_address"
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

---[FILE: identity_user_valid_email_address.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_user_valid_email_address/identity_user_valid_email_address.py

```python
"""Check Ensure all OCI IAM user accounts have a valid and current email address."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_user_valid_email_address(Check):
    """Check Ensure all OCI IAM user accounts have a valid and current email address."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_user_valid_email_address check."""
        findings = []

        # Check users have valid email
        for user in identity_client.users:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=user,
                region=user.region,
                resource_name=user.name,
                resource_id=user.id,
                compartment_id=user.compartment_id,
            )

            if user.email and "@" in user.email:
                report.status = "PASS"
                report.status_extended = f"User {user.name} has a valid email address."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User {user.name} does not have a valid email address."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: integration_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/integration/integration_client.py

```python
"""OCI Integration client."""

from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.integration.integration_service import (
    Integration,
)

integration_client = Integration(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: integration_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/integration/integration_service.py
Signals: Pydantic

```python
"""OCI Integration service."""

from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Integration(OCIService):
    """OCI Integration service class."""

    def __init__(self, provider):
        """Initialize Integration service."""
        super().__init__("integration", provider)
        self.integration_instances = []
        self.__threading_call_by_region_and_compartment__(
            self.__list_integration_instances__
        )

    def __get_client__(self, region: str) -> oci.integration.IntegrationInstanceClient:
        """Get OCI Integration client for a region."""
        return self._create_oci_client(
            oci.integration.IntegrationInstanceClient,
            config_overrides={"region": region},
        )

    def __list_integration_instances__(self, region, compartment):
        """List all integration instances in a compartment."""
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            integration_client = self.__get_client__(region_key)

            instances = oci.pagination.list_call_get_all_results(
                integration_client.list_integration_instances,
                compartment_id=compartment.id,
            ).data

            for instance in instances:
                # Only include ACTIVE or INACTIVE or UPDATING instances
                if instance.lifecycle_state in ["ACTIVE", "INACTIVE", "UPDATING"]:
                    # Extract network endpoint details and convert to dict
                    network_endpoint_details = None
                    if (
                        hasattr(instance, "network_endpoint_details")
                        and instance.network_endpoint_details
                    ):
                        network_endpoint_details = oci.util.to_dict(
                            instance.network_endpoint_details
                        )

                    self.integration_instances.append(
                        IntegrationInstance(
                            id=instance.id,
                            display_name=instance.display_name,
                            compartment_id=instance.compartment_id,
                            region=region_key,
                            lifecycle_state=instance.lifecycle_state,
                            network_endpoint_details=network_endpoint_details,
                            instance_url=getattr(instance, "instance_url", None),
                            integration_instance_type=getattr(
                                instance, "integration_instance_type", None
                            ),
                            is_byol=getattr(instance, "is_byol", None),
                            message_packs=getattr(instance, "message_packs", None),
                        )
                    )

        except Exception as error:
            logger.error(
                f"{region_key if 'region_key' in locals() else region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class IntegrationInstance(BaseModel):
    """OCI Integration Instance model."""

    id: str
    display_name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    network_endpoint_details: Optional[dict]
    instance_url: Optional[str] = None
    integration_instance_type: Optional[str] = None
    is_byol: Optional[bool] = None
    message_packs: Optional[int] = None

    class Config:
        arbitrary_types_allowed = True
```

--------------------------------------------------------------------------------

---[FILE: integration_instance_access_restricted.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/integration/integration_instance_access_restricted/integration_instance_access_restricted.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "integration_instance_access_restricted",
  "CheckTitle": "Ensure Oracle Integration Cloud (OIC) access is restricted to allowed sources",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "integration",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:integration:instance",
  "Severity": "high",
  "ResourceType": "IntegrationInstance",
  "Description": "Oracle Integration Cloud access should be restricted to allowed sources.",
  "Risk": "Not meeting this network security requirement increases risk of unauthorized access.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Network/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure Oracle Integration Cloud (OIC) access is restricted to allowed sources",
      "Url": "https://hub.prowler.com/check/oci/integration_instance_access_restricted"
    }
  },
  "Categories": [
    "network-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: integration_instance_access_restricted.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/integration/integration_instance_access_restricted/integration_instance_access_restricted.py

```python
"""Check Ensure Oracle Integration Cloud (OIC) access is restricted to allowed sources."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.integration.integration_client import (
    integration_client,
)


class integration_instance_access_restricted(Check):
    """Check Ensure Oracle Integration Cloud (OIC) access is restricted to allowed sources."""

    def execute(self) -> Check_Report_OCI:
        """Execute the integration_instance_access_restricted check."""
        findings = []

        for instance in integration_client.integration_instances:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=instance,
                region=instance.region,
                resource_name=instance.display_name,
                resource_id=instance.id,
                compartment_id=instance.compartment_id,
            )
            # Check if instance has no network endpoint details (unrestricted access)
            if not instance.network_endpoint_details:
                report.status = "FAIL"
                report.status_extended = f"Integration instance {instance.display_name} has no network endpoint details configured (unrestricted access)."
            # Check if 0.0.0.0/0 is in network endpoint details
            elif "0.0.0.0/0" in str(instance.network_endpoint_details):
                report.status = "FAIL"
                report.status_extended = f"Integration instance {instance.display_name} has unrestricted access with 0.0.0.0/0 in network endpoint details."
            # Check if PUBLIC endpoint with no allowlists
            elif (
                instance.network_endpoint_details.get("network_endpoint_type")
                == "PUBLIC"
                and not instance.network_endpoint_details.get("allowlisted_http_ips")
                and not instance.network_endpoint_details.get("allowlisted_http_vcns")
            ):
                report.status = "FAIL"
                report.status_extended = f"Integration instance {instance.display_name} has public access with no IP or VCN allowlists configured."
            else:
                report.status = "PASS"
                report.status_extended = f"Integration instance {instance.display_name} has restricted network access configured."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kms_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/kms/kms_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.kms.kms_service import Kms

kms_client = Kms(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
