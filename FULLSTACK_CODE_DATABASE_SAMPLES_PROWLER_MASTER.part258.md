---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 258
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 258 of 867)

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

---[FILE: cognito_user_pool_advanced_security_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_advanced_security_enabled/cognito_user_pool_advanced_security_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_advanced_security_enabled(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.advanced_security_mode == "ENFORCED":
                report.status = "PASS"
                report.status_extended = f"User pool {pool.name} has advanced security enforced with full-function mode."
            elif pool.advanced_security_mode == "AUDIT":
                report.status = "FAIL"
                report.status_extended = f"User pool {pool.name} has advanced security enabled but with audit-only mode."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {pool.name} has advanced security disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_blocks_compromised_credentials_sign_in_attempts.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_blocks_compromised_credentials_sign_in_attempts/cognito_user_pool_blocks_compromised_credentials_sign_in_attempts.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_blocks_compromised_credentials_sign_in_attempts(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if (
                pool.advanced_security_mode == "ENFORCED"
                and pool.risk_configuration
                and "SIGN_IN"
                in pool.risk_configuration.compromised_credentials_risk_configuration.event_filter
                and pool.risk_configuration.compromised_credentials_risk_configuration.actions
                == "BLOCK"
            ):
                report.status = "PASS"
                report.status_extended = f"User pool {pool.name} blocks sign-in attempts with suspected compromised credentials."
            else:
                report.status = "FAIL"
                report.status_extended = f"User pool {pool.name} does not block sign-in attempts with suspected compromised credentials."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_blocks_potential_malicious_sign_in_attempts.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_blocks_potential_malicious_sign_in_attempts/cognito_user_pool_blocks_potential_malicious_sign_in_attempts.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_blocks_potential_malicious_sign_in_attempts",
  "CheckTitle": "Ensure that your Amazon Cognito user pool blocks potential malicious sign-in attempts",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Amazon Cognito provides adaptive authentication, which helps protect your applications from malicious actors and compromised credentials by evaluating the risk associated with each user login and providing the appropriate level of security to mitigate that risk. Adaptive authentication is a feature of advanced security that you can enable for your user pool. When adaptive authentication is enabled, Amazon Cognito evaluates the risk associated with each user login and provides the appropriate level of security to mitigate that risk. You can configure adaptive authentication to block sign-in attempts that are likely to be malicious.",
  "Risk": "If adaptive authentication with automatic risk response as block sign-in is not enabled, your user pool may not be able to block sign-in attempts that are likely to be malicious.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To enable adaptive authentication with automatic risk response as block sign-in, perform the following actions:",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-advanced-security.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_blocks_potential_malicious_sign_in_attempts.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_blocks_potential_malicious_sign_in_attempts/cognito_user_pool_blocks_potential_malicious_sign_in_attempts.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_blocks_potential_malicious_sign_in_attempts(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if (
                pool.advanced_security_mode == "ENFORCED"
                and pool.risk_configuration
                and all(
                    [
                        pool.risk_configuration.account_takeover_risk_configuration.low_action
                        and pool.risk_configuration.account_takeover_risk_configuration.low_action
                        == "BLOCK",
                        pool.risk_configuration.account_takeover_risk_configuration.medium_action
                        and pool.risk_configuration.account_takeover_risk_configuration.medium_action
                        == "BLOCK",
                        pool.risk_configuration.account_takeover_risk_configuration.high_action
                        and pool.risk_configuration.account_takeover_risk_configuration.high_action
                        == "BLOCK",
                    ]
                )
            ):
                report.status = "PASS"
                report.status_extended = f"User pool {pool.name} blocks all potential malicious sign-in attempts."
            else:
                report.status = "FAIL"
                report.status_extended = f"User pool {pool.name} does not block all potential malicious sign-in attempts."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_client_prevent_user_existence_errors.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_client_prevent_user_existence_errors/cognito_user_pool_client_prevent_user_existence_errors.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_client_prevent_user_existence_errors",
  "CheckTitle": "Amazon Cognito User Pool should prevent user existence errors",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPoolClient",
  "Description": "Amazon Cognito User Pool should be configured to prevent user existence errors. This setting prevents user existence errors by requiring the user to enter a username and password to sign in. If the user does not exist, the user will receive an error message.",
  "Risk": "Revealing user existence errors can be a security risk as it can allow an attacker to determine if a user exists in the system. This can be used to perform user enumeration attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-managing-errors.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To prevent user existence errors, you should configure the Amazon Cognito User Pool to require a username and password to sign in. If the user does not exist, the user will receive an error message.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-managing-errors.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_client_prevent_user_existence_errors.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_client_prevent_user_existence_errors/cognito_user_pool_client_prevent_user_existence_errors.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_client_prevent_user_existence_errors(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            for user_pool_client in pool.user_pool_clients.values():
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=user_pool_client
                )
                report.resource_tags = pool.tags
                if user_pool_client.prevent_user_existence_errors == "ENABLED":
                    report.status = "PASS"
                    report.status_extended = f"User pool client {user_pool_client.name} prevents revealing users in existence errors."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User pool client {user_pool_client.name} does not prevent revealing users in existence errors."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_client_token_revocation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_client_token_revocation_enabled/cognito_user_pool_client_token_revocation_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_client_token_revocation_enabled",
  "CheckTitle": "Ensure that token revocation is enabled for Amazon Cognito User Pools",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPoolClient",
  "Description": "Token revocation is a security feature that allows you to revoke tokens and end sessions for users. When you enable token revocation, Amazon Cognito automatically revokes tokens for users who sign out or are deleted. This helps protect your users' data and prevent unauthorized access to your resources.",
  "Risk": "If token revocation is not enabled, users' tokens will not be revoked when they sign out or are deleted. This can lead to unauthorized access to your resources.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To enable token revocation for an Amazon Cognito User Pool, use the Amazon Cognito console or the AWS CLI. For more information, see the Amazon Cognito documentation.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_client_token_revocation_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_client_token_revocation_enabled/cognito_user_pool_client_token_revocation_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_client_token_revocation_enabled(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            for pool_client in pool.user_pool_clients.values():
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=pool_client
                )
                report.resource_tags = pool.tags
                if pool_client.enable_token_revocation:
                    report.status = "PASS"
                    report.status_extended = f"User pool client {pool_client.name} has token revocation enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User pool client {pool_client.name} has token revocation disabled."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_deletion_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_deletion_protection_enabled/cognito_user_pool_deletion_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_deletion_protection_enabled",
  "CheckTitle": "Ensure cognito user pools deletion protection enabled to prevent accidental deletion",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Deletion protection is a feature that allows you to lock a user pool to prevent it from being deleted. When deletion protection is enabled, you cannot delete the user pool. By default, deletion protection is disabled",
  "Risk": "If deletion protection is not enabled, the user pool can be deleted by any user with the necessary permissions. This can lead to loss of data and service disruption",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-deletion-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Deletion protection should be enabled for the user pool to prevent accidental deletion",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-deletion-protection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_deletion_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_deletion_protection_enabled/cognito_user_pool_deletion_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_deletion_protection_enabled(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.deletion_protection == "ACTIVE":
                report.status = "PASS"
                report.status_extended = (
                    f"User pool {pool.name} has deletion protection enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {pool.name} has deletion protection disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_mfa_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_mfa_enabled/cognito_user_pool_mfa_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_mfa_enabled",
  "CheckTitle": "Ensure Multi-Factor Authentication (MFA) is enabled for Amazon Cognito User Pools",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Checks whether Multi-Factor Authentication (MFA) is enabled for Amazon Cognito User Pools.",
  "Risk": "If MFA is not enabled, unauthorized users could gain access to the user pool and potentially compromise the security of the application.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To enable MFA for an Amazon Cognito User Pool, follow the instructions in the Amazon Cognito documentation.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_mfa_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_mfa_enabled/cognito_user_pool_mfa_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_mfa_enabled(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.mfa_config and pool.mfa_config.status == "ON":
                report.status = "PASS"
                report.status_extended = f"User pool {pool.name} has MFA enabled."
            else:
                report.status = "FAIL"
                report.status_extended = f"User pool {pool.name} has MFA disabled."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_lowercase.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_lowercase/cognito_user_pool_password_policy_lowercase.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_password_policy_lowercase",
  "CheckTitle": "Ensure Cognito User Pool has password policy to require at least one lowercase letter",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "User pool password policy should require at least one lowercase letter.",
  "Risk": "If the password policy does not require at least one lowercase letter, it may be easier for an attacker to crack the password.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To require at least one lowercase letter in the password, update the password policy for the user pool.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_lowercase.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_lowercase/cognito_user_pool_password_policy_lowercase.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_password_policy_lowercase(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.password_policy:
                if pool.password_policy.require_lowercase:
                    report.status = "PASS"
                    report.status_extended = f"User pool {pool.name} has a password policy with a lowercase requirement."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User pool {pool.name} does not have a password policy with a lowercase requirement."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {pool.name} has not a password policy set."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_minimum_length_14.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_minimum_length_14/cognito_user_pool_password_policy_minimum_length_14.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_password_policy_minimum_length_14",
  "CheckTitle": "Ensure that the password policy for your user pools require a minimum length of 14 or greater",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "User pools allow you to configure a password policy for your user pool to specify complexity requirements for user passwords. The password policy for your user pools should require a minimum length of 14 or greater.",
  "Risk": "If the password policy for your user pools does not require a minimum length of 14 or greater, it may be easier for attackers to guess or brute force user passwords.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To require a minimum length of 14 or greater for user passwords in your user pools, you can update the password policy for your user pool using the AWS Management Console, AWS CLI, or SDK.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_minimum_length_14.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_minimum_length_14/cognito_user_pool_password_policy_minimum_length_14.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_password_policy_minimum_length_14(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.password_policy:
                if pool.password_policy.minimum_length >= 14:
                    report.status = "PASS"
                    report.status_extended = f"User pool {pool.name} has a password policy with a minimum length of 14 characters."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User pool {pool.name} does not have a password policy with a minimum length of 14 characters."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {pool.name} has not a password policy set."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_number.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_number/cognito_user_pool_password_policy_number.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_password_policy_number",
  "CheckTitle": "Ensure that the password policy for your user pool requires a number",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Checks whether the password policy for your user pool requires a number.",
  "Risk": "If the password policy for your user pool does not require a number, the user pool is less secure and more vulnerable to attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To require a number in the password policy for your user pool, perform the following actions:",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_number.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_number/cognito_user_pool_password_policy_number.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_password_policy_number(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.password_policy:
                if pool.password_policy.require_numbers:
                    report.status = "PASS"
                    report.status_extended = f"User pool {pool.name} has a password policy with a number requirement."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User pool {pool.name} does not have a password policy with a number requirement."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {pool.name} has not a password policy set."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_symbol.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_symbol/cognito_user_pool_password_policy_symbol.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_password_policy_symbol",
  "CheckTitle": "Ensure that the password policy for your Amazon Cognito user pool requires at least one symbol.",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Check whether the password policy for your Amazon Cognito user pool requires at least one symbol.",
  "Risk": "If the password policy for your Amazon Cognito user pool does not require at least one symbol, it can be easier for attackers to crack passwords.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To require at least one symbol in the password policy for your Amazon Cognito user pool, you can use the AWS Management Console or the AWS CLI.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_symbol.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_symbol/cognito_user_pool_password_policy_symbol.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_password_policy_symbol(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.password_policy:
                if pool.password_policy.require_symbols:
                    report.status = "PASS"
                    report.status_extended = f"User pool {pool.name} has a password policy with a symbol requirement."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User pool {pool.name} does not have a password policy with a symbol requirement."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {pool.name} has not a password policy set."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_uppercase.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_uppercase/cognito_user_pool_password_policy_uppercase.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_password_policy_uppercase",
  "CheckTitle": "Ensure that the password policy for your user pool requires at least one uppercase letter",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "User pools allow you to configure a password policy for your user pool to specify requirements for user passwords. You can require that passwords have a minimum length, contain at least one uppercase letter, and contain at least one number. You can also require that passwords have at least one special character. You can also set the password policy to require that passwords be case-sensitive.",
  "Risk": "If the password policy for your user pool does not require at least one uppercase letter, it may be easier for an attacker to guess or crack user passwords.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To require that the password policy for your user pool requires at least one uppercase letter, you can use the AWS Management Console or the AWS CLI. For more information, see the documentation on user pool settings and policies.",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_password_policy_uppercase.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_password_policy_uppercase/cognito_user_pool_password_policy_uppercase.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_password_policy_uppercase(Check):
    def execute(self):
        findings = []
        for pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=pool)
            if pool.password_policy:
                if pool.password_policy.require_uppercase:
                    report.status = "PASS"
                    report.status_extended = f"User pool {pool.name} has a password policy with an uppercase requirement."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"User pool {pool.name} does not have a password policy with an uppercase requirement."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {pool.name} has not a password policy set."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_self_registration_disabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_self_registration_disabled/cognito_user_pool_self_registration_disabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cognito_user_pool_self_registration_disabled",
  "CheckTitle": "Ensure self registration is disabled for Amazon Cognito User Pools",
  "CheckType": [],
  "ServiceName": "cognito",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:cognito-idp:region:account:userpool/userpool-id",
  "Severity": "medium",
  "ResourceType": "AwsCognitoUserPool",
  "Description": "Checks whether self registration is disabled for the Amazon Cognito User Pool. Self registration allows users to sign up for an account in the user pool. If self registration is enabled, users can sign up for an account in the user pool without any intervention from the administrator. This can lead to unauthorized access to the application.",
  "Risk": "If self registration is enabled, users can sign up for an account in the user pool without any intervention from the administrator. This can lead to unauthorized access to the application.",
  "RelatedUrl": "https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "To disable self registration for the Amazon Cognito User Pool, perform the following actions:",
      "Url": "https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cognito_user_pool_self_registration_disabled.py]---
Location: prowler-master/prowler/providers/aws/services/cognito/cognito_user_pool_self_registration_disabled/cognito_user_pool_self_registration_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cognito.cognito_identity_client import (
    cognito_identity_client,
)
from prowler.providers.aws.services.cognito.cognito_idp_client import cognito_idp_client


class cognito_user_pool_self_registration_disabled(Check):
    def execute(self):
        findings = []
        for user_pool in cognito_idp_client.user_pools.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=user_pool)
            report.status = "PASS"
            report.status_extended = (
                f"User pool {user_pool.id} has self registration disabled."
            )
            if (
                user_pool.admin_create_user_config
                and not user_pool.admin_create_user_config.allow_admin_create_user_only
            ):
                report.status = "FAIL"
                report.status_extended = (
                    f"User pool {user_pool.id} has self registration enabled."
                )
                associated_identity_pool_authenticated_roles = []
                for identity_pool in cognito_identity_client.identity_pools.values():
                    for associated_pool in identity_pool.associated_pools:
                        if (
                            f"cognito-idp.{user_pool.region}.amazonaws.com/{user_pool.id}"
                            == associated_pool.get("ProviderName", "")
                        ):
                            if identity_pool.roles.authenticated:
                                associated_identity_pool_authenticated_roles.append(
                                    f"{identity_pool.name}({identity_pool.roles.authenticated})"
                                )
                            else:
                                associated_identity_pool_authenticated_roles.append(
                                    identity_pool.name
                                )
                if associated_identity_pool_authenticated_roles:
                    report.status_extended = f"User pool {user_pool.name} has self registration enabled assuming the role(s): {(', ').join(associated_identity_pool_authenticated_roles)}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
