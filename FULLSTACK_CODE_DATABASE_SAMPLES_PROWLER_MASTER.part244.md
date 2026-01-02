---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 244
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 244 of 867)

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

---[FILE: bedrock_service.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Bedrock(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.logging_configurations = {}
        self.guardrails = {}
        self.__threading_call__(self._get_model_invocation_logging_configuration)
        self.__threading_call__(self._list_guardrails)
        self.__threading_call__(self._get_guardrail, self.guardrails.values())
        self.__threading_call__(self._list_tags_for_resource, self.guardrails.values())

    def _get_model_invocation_logging_arn_template(self, region):
        return (
            f"arn:{self.audited_partition}:bedrock:{region}:{self.audited_account}:model-invocation-logging"
            if region
            else f"arn:{self.audited_partition}:bedrock:{self.region}:{self.audited_account}:model-invocation-logging"
        )

    def _get_model_invocation_logging_configuration(self, regional_client):
        logger.info("Bedrock - Getting Model Invocation Logging Configuration...")
        try:
            logging_config = (
                regional_client.get_model_invocation_logging_configuration().get(
                    "loggingConfig", {}
                )
            )
            if logging_config:
                self.logging_configurations[regional_client.region] = (
                    LoggingConfiguration(
                        cloudwatch_log_group=logging_config.get(
                            "cloudWatchConfig", {}
                        ).get("logGroupName"),
                        s3_bucket=logging_config.get("s3Config", {}).get("bucketName"),
                        enabled=True,
                    )
                )
            else:
                self.logging_configurations[regional_client.region] = (
                    LoggingConfiguration(enabled=False)
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_guardrails(self, regional_client):
        logger.info("Bedrock - Listing Guardrails...")
        try:
            for guardrail in regional_client.list_guardrails().get("guardrails", []):
                if not self.audit_resources or (
                    is_resource_filtered(guardrail["arn"], self.audit_resources)
                ):
                    self.guardrails[guardrail["arn"]] = Guardrail(
                        id=guardrail["id"],
                        name=guardrail["name"],
                        arn=guardrail["arn"],
                        region=regional_client.region,
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_guardrail(self, guardrail):
        logger.info("Bedrock - Getting Guardrail...")
        try:
            guardrail_info = self.regional_clients[guardrail.region].get_guardrail(
                guardrailIdentifier=guardrail.id
            )
            guardrail.sensitive_information_filter = (
                "sensitiveInformationPolicy" in guardrail_info
            )
            for filter in guardrail_info.get("contentPolicy", {}).get("filters", []):
                if filter.get("type") == "PROMPT_ATTACK":
                    guardrail.prompt_attack_filter_strength = filter.get(
                        "inputStrength", "NONE"
                    )
        except Exception as error:
            logger.error(
                f"{guardrail.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self, guardrail):
        logger.info("Bedrock - Listing Tags for Resource...")
        try:
            guardrail.tags = (
                self.regional_clients[guardrail.region]
                .list_tags_for_resource(resourceARN=guardrail.arn)
                .get("tags", [])
            )
        except Exception as error:
            logger.error(
                f"{guardrail.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class LoggingConfiguration(BaseModel):
    enabled: bool = False
    cloudwatch_log_group: Optional[str] = None
    s3_bucket: Optional[str] = None


class Guardrail(BaseModel):
    id: str
    name: str
    arn: str
    region: str
    tags: Optional[list] = []
    sensitive_information_filter: bool = False
    prompt_attack_filter_strength: Optional[str] = None


class BedrockAgent(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("bedrock-agent", provider)
        self.agents = {}
        self.__threading_call__(self._list_agents)
        self.__threading_call__(self._list_tags_for_resource, self.agents.values())

    def _list_agents(self, regional_client):
        logger.info("Bedrock Agent - Listing Agents...")
        try:
            for agent in regional_client.list_agents().get("agentSummaries", []):
                agent_arn = f"arn:aws:bedrock:{regional_client.region}:{self.audited_account}:agent/{agent['agentId']}"
                if not self.audit_resources or (
                    is_resource_filtered(agent_arn, self.audit_resources)
                ):
                    self.agents[agent_arn] = Agent(
                        id=agent["agentId"],
                        name=agent["agentName"],
                        arn=agent_arn,
                        guardrail_id=agent.get("guardrailConfiguration", {}).get(
                            "guardrailIdentifier"
                        ),
                        region=regional_client.region,
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self, resource):
        logger.info("Bedrock Agent - Listing Tags for Resource...")
        try:
            agent_tags = (
                self.regional_clients[resource.region]
                .list_tags_for_resource(resourceArn=resource.arn)
                .get("tags", {})
            )
            if agent_tags:
                resource.tags = [agent_tags]
        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Agent(BaseModel):
    id: str
    name: str
    arn: str
    guardrail_id: Optional[str] = None
    region: str
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: bedrock_agent_guardrail_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_agent_guardrail_enabled/bedrock_agent_guardrail_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "bedrock_agent_guardrail_enabled",
  "CheckTitle": "Ensure that Guardrails are enabled for Amazon Bedrock agent sessions.",
  "CheckType": [],
  "ServiceName": "bedrock",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:bedrock:region:account-id:agent/resource-id",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "This check ensures that Guardrails are enabled to protect Amazon Bedrock agent sessions. Guardrails help mitigate security risks by filtering and blocking harmful or sensitive content during interactions with AI models.",
  "Risk": "Without guardrails enabled, Amazon Bedrock agent sessions are vulnerable to harmful prompts or inputs that could expose sensitive information or generate inappropriate content. This could lead to privacy violations, data leaks, or other security risks.",
  "RelatedUrl": "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Bedrock/protect-agent-sessions-with-guardrails.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Guardrails for Amazon Bedrock agent sessions to protect against harmful inputs and outputs during interactions.",
      "Url": "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-create.html"
    }
  },
  "Categories": ["gen-ai"],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: bedrock_agent_guardrail_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_agent_guardrail_enabled/bedrock_agent_guardrail_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.bedrock.bedrock_agent_client import (
    bedrock_agent_client,
)


class bedrock_agent_guardrail_enabled(Check):
    def execute(self):
        findings = []
        for agent in bedrock_agent_client.agents.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=agent)
            report.status = "FAIL"
            report.status_extended = f"Bedrock Agent {agent.name} is not using any guardrail to protect agent sessions."
            if agent.guardrail_id:
                report.status = "PASS"
                report.status_extended = f"Bedrock Agent {agent.name} is using guardrail {agent.guardrail_id} to protect agent sessions."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bedrock_api_key_no_administrative_privileges.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_api_key_no_administrative_privileges/bedrock_api_key_no_administrative_privileges.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "bedrock_api_key_no_administrative_privileges",
  "CheckTitle": "Ensure Amazon Bedrock API keys do not have administrative privileges or privilege escalation",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards"
  ],
  "ServiceName": "bedrock",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:iam:region:account-id:user/{user-name}/credential/{api-key-id}",
  "Severity": "high",
  "ResourceType": "AwsIamServiceSpecificCredential",
  "Description": "Ensure that Amazon Bedrock API keys do not have administrative privileges or privilege escalation capabilities. API keys with administrative privileges can perform any action on any resource in your AWS environment, while privilege escalation allows users to grant themselves additional permissions, both posing significant security risks.",
  "Risk": "Amazon Bedrock API keys with administrative privileges can perform any action on any resource in your AWS environment. Privilege escalation capabilities allow users to grant themselves additional permissions beyond their intended scope. Both violations of the principle of least privilege can lead to security vulnerabilities, data leaks, data loss, or unexpected charges if the API key is compromised or misused.",
  "RelatedUrl": "https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html",
  "Remediation": {
    "Code": {
      "CLI": "aws iam delete-service-specific-credential --user-name <username> --service-specific-credential-id <credential-id>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Apply the principle of least privilege to Amazon Bedrock API keys. Instead of granting administrative privileges or privilege escalation capabilities, assign only the permissions necessary for specific tasks. Create custom IAM policies with minimal permissions based on the principle of least privilege. Regularly review and audit API key permissions to ensure they cannot be used for privilege escalation.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege"
    }
  },
  "Categories": [
    "gen-ai",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check verifies that Amazon Bedrock API keys do not have administrative privileges or privilege escalation capabilities through attached IAM policies or inline policies. It follows the principle of least privilege to ensure API keys only have the minimum necessary permissions and cannot be used to escalate privileges."
}
```

--------------------------------------------------------------------------------

---[FILE: bedrock_api_key_no_administrative_privileges.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_api_key_no_administrative_privileges/bedrock_api_key_no_administrative_privileges.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client
from prowler.providers.aws.services.iam.lib.policy import (
    check_admin_access,
    check_full_service_access,
)
from prowler.providers.aws.services.iam.lib.privilege_escalation import (
    check_privilege_escalation,
)


class bedrock_api_key_no_administrative_privileges(Check):
    def execute(self):
        findings = []
        for api_key in iam_client.service_specific_credentials:
            if api_key.service_name != "bedrock.amazonaws.com":
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=api_key)
            report.status = "PASS"
            report.status_extended = f"API key {api_key.id} in user {api_key.user.name} has no administrative privileges."
            for policy in api_key.user.attached_policies:
                policy_arn = policy["PolicyArn"]
                if policy_arn in iam_client.policies:
                    policy_document = iam_client.policies[policy_arn].document
                    if policy_document:
                        if check_admin_access(policy_document):
                            report.status = "FAIL"
                            report.status_extended = f"API key {api_key.id} in user {api_key.user.name} has administrative privileges through attached policy {policy['PolicyName']}."
                            break
                        elif check_privilege_escalation(policy_document):
                            report.status = "FAIL"
                            report.status_extended = f"API key {api_key.id} in user {api_key.user.name} has privilege escalation through attached policy {policy['PolicyName']}."
                            break
                        elif check_full_service_access("bedrock", policy_document):
                            report.status = "FAIL"
                            report.status_extended = f"API key {api_key.id} in user {api_key.user.name} has full service access through attached policy {policy['PolicyName']}."
                            break
            for inline_policy_name in api_key.user.inline_policies:
                inline_policy_arn = f"{api_key.user.arn}:policy/{inline_policy_name}"
                if inline_policy_arn in iam_client.policies:
                    policy_document = iam_client.policies[inline_policy_arn].document
                    if policy_document:
                        if check_admin_access(policy_document):
                            report.status = "FAIL"
                            report.status_extended = f"API key {api_key.id} in user {api_key.user.name} has administrative privileges through inline policy {inline_policy_name}."
                            break
                        elif check_privilege_escalation(policy_document):
                            report.status = "FAIL"
                            report.status_extended = f"API key {api_key.id} in user {api_key.user.name} has privilege escalation through inline policy {inline_policy_name}."
                            break
                        elif check_full_service_access("bedrock", policy_document):
                            report.status = "FAIL"
                            report.status_extended = f"API key {api_key.id} in user {api_key.user.name} has full service access through inline policy {inline_policy_name}."
                            break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bedrock_api_key_no_long_term_credentials.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_api_key_no_long_term_credentials/bedrock_api_key_no_long_term_credentials.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "bedrock_api_key_no_long_term_credentials",
  "CheckTitle": "Ensure Amazon Bedrock API keys are not long-term credentials",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards"
  ],
  "ServiceName": "bedrock",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:iam:region:account-id:user/{user-name}/credential/{api-key-id}",
  "Severity": "high",
  "ResourceType": "AwsIamServiceSpecificCredential",
  "Description": "Ensure that Amazon Bedrock API keys have expiration dates set to prevent long-term credential exposure. Long-term credentials pose a significant security risk as they remain valid indefinitely and can be used for unauthorized access if compromised.",
  "Risk": "Amazon Bedrock API keys without expiration dates are long-term credentials that remain valid indefinitely. This increases the risk of unauthorized access if the credentials are compromised, as they cannot be automatically invalidated. Long-term credentials violate the principle of credential rotation and can lead to security vulnerabilities, data breaches, or unauthorized usage of Bedrock services.",
  "RelatedUrl": "https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html",
  "Remediation": {
    "Code": {
      "CLI": "aws iam delete-service-specific-credential --user-name <username> --service-specific-credential-id <credential-id>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Delete the long-term API keys for Amazon Bedrock. Instead, use temporary credentials, IAM roles, or create new API keys with appropriate expiration dates. Implement a credential rotation policy to ensure all API keys have reasonable expiration periods. Consider using AWS STS for temporary credentials when possible.",
      "Url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#rotate-credentials"
    }
  },
  "Categories": [
    "gen-ai",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This check verifies that Amazon Bedrock API keys have expiration dates set. API keys without expiration dates are considered long-term credentials and pose a security risk. The check follows security best practices for credential management and the principle of least privilege."
}
```

--------------------------------------------------------------------------------

---[FILE: bedrock_api_key_no_long_term_credentials.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_api_key_no_long_term_credentials/bedrock_api_key_no_long_term_credentials.py

```python
from datetime import datetime, timezone

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.iam_client import iam_client


class bedrock_api_key_no_long_term_credentials(Check):
    """
    Bedrock API keys should be short-lived to reduce the risk of unauthorized access.
    This check verifies if there are any long-term Bedrock API keys.
    If there are, it checks if they are expired or will be expired.
    If they are expired, it will be marked as PASS.
    If they are not expired, it will be marked as FAIL and the severity will be critical if the key will never expire.
    """

    def execute(self):
        """
        Execute the Bedrock API key no long-term credentials check.

        Iterate over all the Bedrock API keys and check if they are expired or will be expired.

        Returns:
            List[Check_Report_AWS]: A list of report objects with the results of the check.
        """

        findings = []
        for api_key in iam_client.service_specific_credentials:
            if api_key.service_name != "bedrock.amazonaws.com":
                continue
            if api_key.expiration_date:
                report = Check_Report_AWS(metadata=self.metadata(), resource=api_key)
                # Check if the expiration date is in the future
                if api_key.expiration_date > datetime.now(timezone.utc):
                    report.status = "FAIL"
                    # Get the days until the expiration date
                    days_until_expiration = (
                        api_key.expiration_date - datetime.now(timezone.utc)
                    ).days
                    if days_until_expiration > 10000:
                        self.Severity = "critical"
                        report.status_extended = f"Long-term Bedrock API key {api_key.id} in user {api_key.user.name} exists and never expires."
                    else:
                        report.status_extended = f"Long-term Bedrock API key {api_key.id} in user {api_key.user.name} exists and will expire in {days_until_expiration} days."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Long-term Bedrock API key {api_key.id} in user {api_key.user.name} exists but has expired."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bedrock_guardrail_prompt_attack_filter_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_guardrail_prompt_attack_filter_enabled/bedrock_guardrail_prompt_attack_filter_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "bedrock_guardrail_prompt_attack_filter_enabled",
  "CheckTitle": "Configure Prompt Attack Filter with the highest strength for Amazon Bedrock Guardrails.",
  "CheckType": [],
  "ServiceName": "bedrock",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:bedrock:region:account-id:guardrails/resource-id",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "Ensure that prompt attack filter strength is set to HIGH for Amazon Bedrock guardrails to mitigate prompt injection and bypass techniques.",
  "Risk": "If prompt attack filter strength is not set to HIGH, Bedrock models may be more vulnerable to prompt injection attacks or jailbreak attempts, which could allow harmful or sensitive content to bypass filters and reach end users.",
  "RelatedUrl": "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html",
  "Remediation": {
    "Code": {
      "CLI": "aws bedrock put-guardrails-configuration --guardrails-config 'promptAttackStrength=HIGH'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Bedrock/prompt-attack-strength.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set the prompt attack filter strength to HIGH for Amazon Bedrock guardrails to prevent prompt injection attacks and ensure robust protection against content manipulation.",
      "Url": "https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-injection.html"
    }
  },
  "Categories": ["gen-ai"],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure that prompt attack protection is set to the highest strength to minimize the risk of prompt injection attacks."
}
```

--------------------------------------------------------------------------------

---[FILE: bedrock_guardrail_prompt_attack_filter_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_guardrail_prompt_attack_filter_enabled/bedrock_guardrail_prompt_attack_filter_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.bedrock.bedrock_client import bedrock_client


class bedrock_guardrail_prompt_attack_filter_enabled(Check):
    def execute(self):
        findings = []
        for guardrail in bedrock_client.guardrails.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=guardrail)
            report.status = "PASS"
            report.status_extended = f"Bedrock Guardrail {guardrail.name} is configured to detect and block prompt attacks with a HIGH strength."
            if not guardrail.prompt_attack_filter_strength:
                report.status = "FAIL"
                report.status_extended = f"Bedrock Guardrail {guardrail.name} is not configured to block prompt attacks."
            elif guardrail.prompt_attack_filter_strength != "HIGH":
                report.status = "FAIL"
                report.status_extended = f"Bedrock Guardrail {guardrail.name} is configured to block prompt attacks but with a filter strength of {guardrail.prompt_attack_filter_strength}, not HIGH."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bedrock_guardrail_sensitive_information_filter_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_guardrail_sensitive_information_filter_enabled/bedrock_guardrail_sensitive_information_filter_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "bedrock_guardrail_sensitive_information_filter_enabled",
  "CheckTitle": "Configure Sensitive Information Filters for Amazon Bedrock Guardrails.",
  "CheckType": [],
  "ServiceName": "bedrock",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:bedrock:region:account-id:guardrails/resource-id",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "Ensure that sensitive information filters are enabled for Amazon Bedrock guardrails to prevent the leakage of sensitive data such as personally identifiable information (PII), financial data, or confidential corporate information.",
  "Risk": "If sensitive information filters are not enabled, Bedrock models may inadvertently generate or expose confidential or sensitive information in responses, leading to data breaches, regulatory violations, or reputational damage.",
  "RelatedUrl": "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html",
  "Remediation": {
    "Code": {
      "CLI": "aws bedrock put-guardrails-configuration --guardrails-config 'sensitiveInformationFilter=true'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Bedrock/guardrails-with-pii-mask-block.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable sensitive information filters for Amazon Bedrock guardrails to prevent the exposure of sensitive or confidential information.",
      "Url": "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-sensitive-filters.html"
    }
  },
  "Categories": ["gen-ai"],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: bedrock_guardrail_sensitive_information_filter_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_guardrail_sensitive_information_filter_enabled/bedrock_guardrail_sensitive_information_filter_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.bedrock.bedrock_client import bedrock_client


class bedrock_guardrail_sensitive_information_filter_enabled(Check):
    def execute(self):
        findings = []
        for guardrail in bedrock_client.guardrails.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=guardrail)
            report.status = "PASS"
            report.status_extended = f"Bedrock Guardrail {guardrail.name} is blocking or masking sensitive information."
            if not guardrail.sensitive_information_filter:
                report.status = "FAIL"
                report.status_extended = f"Bedrock Guardrail {guardrail.name} is not configured to block or mask sensitive information."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bedrock_model_invocation_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_model_invocation_logging_enabled/bedrock_model_invocation_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "bedrock_model_invocation_logging_enabled",
  "CheckTitle": "Ensure that model invocation logging is enabled for Amazon Bedrock.",
  "CheckType": [],
  "ServiceName": "bedrock",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:bedrock:region:account-id:model/resource-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Ensure that model invocation logging is enabled for Amazon Bedrock service in order to collect metadata, requests, and responses for all model invocations in your AWS cloud account.",
  "Risk": "In Amazon Bedrock, model invocation logging enables you to collect the invocation request and response data, along with metadata, for all 'Converse', 'ConverseStream', 'InvokeModel', and 'InvokeModelWithResponseStream' API calls in your AWS account. Each log entry includes important details such as the timestamp, request ID, model ID, and token usage. Invocation logs can be utilized for troubleshooting, performance enhancements, abuse detection, and security auditing. By default, model invocation logging is disabled.",
  "RelatedUrl": "https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html",
  "Remediation": {
    "Code": {
      "CLI": "aws bedrock put-model-invocation-logging-configuration --logging-config 's3Config={bucketName='tm-bedrock-logging-data',keyPrefix='invocation-logs'},textDataDeliveryEnabled=true,imageDataDeliveryEnabled=true,embeddingDataDeliveryEnabled=true'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Bedrock/enable-model-invocation-logging.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable model invocation logging for Amazon Bedrock service in order to collect metadata, requests, and responses for all model invocations in your AWS cloud account.",
      "Url": "https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html#model-invocation-logging-console"
    }
  },
  "Categories": [
    "logging",
    "forensics-ready",
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: bedrock_model_invocation_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_model_invocation_logging_enabled/bedrock_model_invocation_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.bedrock.bedrock_client import bedrock_client


class bedrock_model_invocation_logging_enabled(Check):
    def execute(self):
        findings = []
        for region, logging in bedrock_client.logging_configurations.items():
            report = Check_Report_AWS(metadata=self.metadata(), resource=logging)
            report.region = region
            report.resource_id = "model-invocation-logging"
            report.resource_arn = (
                bedrock_client._get_model_invocation_logging_arn_template(region)
            )
            report.status = "FAIL"
            report.status_extended = "Bedrock Model Invocation Logging is disabled."
            if logging.enabled:
                report.status = "PASS"
                report.status_extended = "Bedrock Model Invocation Logging is enabled"
                if logging.cloudwatch_log_group and logging.s3_bucket:
                    report.status_extended += f" in CloudWatch Log Group: {logging.cloudwatch_log_group} and S3 Bucket: {logging.s3_bucket}."
                elif logging.cloudwatch_log_group:
                    report.status_extended += (
                        f" in CloudWatch Log Group: {logging.cloudwatch_log_group}."
                    )
                elif logging.s3_bucket:
                    report.status_extended += f" in S3 Bucket: {logging.s3_bucket}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: bedrock_model_invocation_logs_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_model_invocation_logs_encryption_enabled/bedrock_model_invocation_logs_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "bedrock_model_invocation_logs_encryption_enabled",
  "CheckTitle": "Ensure that Amazon Bedrock model invocation logs are encrypted with KMS.",
  "CheckType": [],
  "ServiceName": "bedrock",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:bedrock:region:account-id:model/resource-id",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "Ensure that Amazon Bedrock model invocation logs are encrypted using AWS KMS to protect sensitive data in the request and response logs for all model invocations.",
  "Risk": "If Amazon Bedrock model invocation logs are not encrypted, sensitive data such as prompts, responses, and token usage could be exposed to unauthorized parties. This may lead to data breaches, security vulnerabilities, or unintended use of sensitive information.",
  "RelatedUrl": "https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that model invocation logs for Amazon Bedrock are encrypted using AWS KMS to prevent unauthorized access to sensitive log data.",
      "Url": "hhttps://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html"
    }
  },
  "Categories": [
    "encryption",
    "logging",
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: bedrock_model_invocation_logs_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/bedrock/bedrock_model_invocation_logs_encryption_enabled/bedrock_model_invocation_logs_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.bedrock.bedrock_client import bedrock_client
from prowler.providers.aws.services.cloudwatch.logs_client import logs_client
from prowler.providers.aws.services.s3.s3_client import s3_client


class bedrock_model_invocation_logs_encryption_enabled(Check):
    def execute(self):
        findings = []
        for region, logging in bedrock_client.logging_configurations.items():
            if logging.enabled:
                s3_encryption = True
                cloudwatch_encryption = True
                report = Check_Report_AWS(metadata=self.metadata(), resource=logging)
                report.region = region
                report.resource_id = "model-invocation-logging"
                report.resource_arn = (
                    bedrock_client._get_model_invocation_logging_arn_template(region)
                )
                report.status = "PASS"
                report.status_extended = "Bedrock Model Invocation logs are encrypted."
                if logging.s3_bucket:
                    bucket_arn = (
                        f"arn:{s3_client.audited_partition}:s3:::{logging.s3_bucket}"
                    )
                    if (
                        bucket_arn in s3_client.buckets
                        and not s3_client.buckets[bucket_arn].encryption
                    ):
                        s3_encryption = False
                if logging.cloudwatch_log_group:
                    log_group_arn = f"arn:{logs_client.audited_partition}:logs:{region}:{logs_client.audited_account}:log-group:{logging.cloudwatch_log_group}"
                    if (
                        log_group_arn in logs_client.log_groups
                        and not logs_client.log_groups[log_group_arn].kms_id
                    ) or (
                        log_group_arn + ":*" in logs_client.log_groups
                        and not logs_client.log_groups[log_group_arn + ":*"].kms_id
                    ):
                        cloudwatch_encryption = False
                if not s3_encryption and not cloudwatch_encryption:
                    report.status = "FAIL"
                    report.status_extended = f"Bedrock Model Invocation logs are not encrypted in S3 bucket: {logging.s3_bucket} and CloudWatch Log Group: {logging.cloudwatch_log_group}."
                elif not s3_encryption:
                    report.status = "FAIL"
                    report.status_extended = f"Bedrock Model Invocation logs are not encrypted in S3 bucket: {logging.s3_bucket}."
                elif not cloudwatch_encryption:
                    report.status = "FAIL"
                    report.status_extended = f"Bedrock Model Invocation logs are not encrypted in CloudWatch Log Group: {logging.cloudwatch_log_group}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_client.py]---
Location: prowler-master/prowler/providers/aws/services/cloudformation/cloudformation_client.py

```python
from prowler.providers.aws.services.cloudformation.cloudformation_service import (
    CloudFormation,
)
from prowler.providers.common.provider import Provider

cloudformation_client = CloudFormation(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
