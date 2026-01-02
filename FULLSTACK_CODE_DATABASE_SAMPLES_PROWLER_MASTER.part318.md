---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 318
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 318 of 867)

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

---[FILE: sagemaker_training_jobs_vpc_settings_configured.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_training_jobs_vpc_settings_configured/sagemaker_training_jobs_vpc_settings_configured.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sagemaker_training_jobs_vpc_settings_configured",
  "CheckTitle": "Check if Amazon SageMaker Training job have VPC settings configured.",
  "CheckType": [],
  "ServiceName": "sagemaker",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:sagemaker:region:account-id:training-job",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if Amazon SageMaker Training job have VPC settings configured.",
  "Risk": "This could provide an avenue for unauthorized access to your data.",
  "RelatedUrl": "https://docs.aws.amazon.com/sagemaker/latest/dg/interface-vpc-endpoint.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict which traffic can access by launching Studio in a Virtual Private Cloud (VPC) of your choosing.",
      "Url": "https://docs.aws.amazon.com/sagemaker/latest/dg/interface-vpc-endpoint.html"
    }
  },
  "Categories": ["gen-ai"],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sagemaker_training_jobs_vpc_settings_configured.py]---
Location: prowler-master/prowler/providers/aws/services/sagemaker/sagemaker_training_jobs_vpc_settings_configured/sagemaker_training_jobs_vpc_settings_configured.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sagemaker.sagemaker_client import sagemaker_client


class sagemaker_training_jobs_vpc_settings_configured(Check):
    def execute(self):
        findings = []
        for training_job in sagemaker_client.sagemaker_training_jobs:
            report = Check_Report_AWS(metadata=self.metadata(), resource=training_job)
            report.status = "PASS"
            report.status_extended = f"Sagemaker training job {training_job.name} has VPC settings for the training job volume and output enabled."
            if not training_job.vpc_config_subnets:
                report.status = "FAIL"
                report.status_extended = f"Sagemaker training job {training_job.name} has VPC settings for the training job volume and output disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_client.py]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_client.py

```python
from prowler.providers.aws.services.secretsmanager.secretsmanager_service import (
    SecretsManager,
)
from prowler.providers.common.provider import Provider

secretsmanager_client = SecretsManager(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_service.py]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_service.py
Signals: Pydantic

```python
import json
from datetime import datetime, timezone
from typing import Dict, List, Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel, Field

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class SecretsManager(AWSService):
    """AWS Secrets Manager service class to list secrets."""

    def __init__(self, provider):
        """Initialize SecretsManager service.

        Args:
            provider: The AWS provider instance.
        """
        super().__init__(__class__.__name__, provider)
        self.secrets = {}
        self.__threading_call__(self._list_secrets)
        self.__threading_call__(self._get_resource_policy, self.secrets.values())

    def _list_secrets(self, regional_client):
        """List all secrets in the region.

        Args:
            regional_client: The regional AWS client to list secrets.
        """
        logger.info("SecretsManager - Listing Secrets...")
        try:
            list_secrets_paginator = regional_client.get_paginator("list_secrets")
            for page in list_secrets_paginator.paginate():
                for secret in page["SecretList"]:
                    if not self.audit_resources or (
                        is_resource_filtered(secret["ARN"], self.audit_resources)
                    ):
                        # We must use the Secret ARN as the dict key to have unique keys
                        self.secrets[secret["ARN"]] = Secret(
                            arn=secret["ARN"],
                            name=secret["Name"],
                            region=regional_client.region,
                            rotation_enabled=secret.get("RotationEnabled", False),
                            last_rotated_date=secret.get(
                                "LastRotatedDate", datetime.min
                            ).replace(tzinfo=timezone.utc),
                            last_accessed_date=secret.get(
                                "LastAccessedDate", datetime.min
                            ).replace(tzinfo=timezone.utc),
                            tags=secret.get("Tags"),
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )

    def _get_resource_policy(self, secret):
        logger.info("SecretsManager - Getting Resource Policy...")
        try:
            secret_policy = self.regional_clients[secret.region].get_resource_policy(
                SecretId=secret.arn
            )
            if secret_policy.get("ResourcePolicy"):
                secret.policy = json.loads(secret_policy["ResourcePolicy"])
        except ClientError as error:
            if error.response["Error"]["Code"] in [
                "ResourceNotFoundException",
            ]:
                logger.warning(
                    f"{self.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )
            else:
                logger.error(
                    f"{self.region} --"
                    f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                    f" {error}"
                )
        except Exception as error:
            logger.error(
                f"{self.region} --"
                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                f" {error}"
            )


class Secret(BaseModel):
    arn: str
    name: str
    region: str
    policy: Optional[dict] = None
    rotation_enabled: bool = False
    last_rotated_date: datetime
    last_accessed_date: datetime
    tags: Optional[List[Dict[str, str]]] = Field(default_factory=list)
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_automatic_rotation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_automatic_rotation_enabled/secretsmanager_automatic_rotation_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "secretsmanager_automatic_rotation_enabled",
  "CheckTitle": "Check if Secrets Manager secret rotation is enabled.",
  "CheckType": [],
  "ServiceName": "secretsmanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:secretsmanager:region:account-id:secret:secret-name",
  "Severity": "medium",
  "ResourceType": "AwsSecretsManagerSecret",
  "Description": "Check if Secrets Manager secret rotation is enabled.",
  "Risk": "Rotating secrets minimizes exposure to attacks using stolen secrets.",
  "RelatedUrl": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets_strategies.html",
  "Remediation": {
    "Code": {
      "CLI": "aws secretsmanager rotate-secret --region <REGION> --secret-id <SECRET-ID> --rotation-lambda-arn <LAMBDA-ARN> --rotation-rules AutomaticallyAfterDays=30",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Implement automated detective control to scan accounts for passwords and secrets. Use secrets manager service to store and retrieve passwords and secrets.",
      "Url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets_strategies.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_automatic_rotation_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_automatic_rotation_enabled/secretsmanager_automatic_rotation_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.secretsmanager.secretsmanager_client import (
    secretsmanager_client,
)


class secretsmanager_automatic_rotation_enabled(Check):
    def execute(self):
        findings = []
        for secret in secretsmanager_client.secrets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=secret)
            if secret.rotation_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"SecretsManager secret {secret.name} has rotation enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"SecretsManager secret {secret.name} has rotation disabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_not_publicly_accessible/secretsmanager_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "secretsmanager_not_publicly_accessible",
  "CheckTitle": "Ensure Secrets Manager secrets are not publicly accessible.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "secretsmanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:secretsmanager:region:account-id:secret:secret-name",
  "Severity": "high",
  "ResourceType": "AwsSecretsManagerSecret",
  "Description": "This control checks whether Secrets Manager secrets are not publicly accessible via resource policies.",
  "Risk": "Publicly accessible secrets can expose sensitive information and pose a security risk.",
  "RelatedUrl": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_resource-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "aws secretsmanager delete-resource-policy --secret-id <secret-id>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review and remove any public access from Secrets Manager policies to follow the Principle of Least Privilege.",
      "Url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/determine-acccess_examine-iam-policies.html"
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

---[FILE: secretsmanager_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_not_publicly_accessible/secretsmanager_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_policy_public
from prowler.providers.aws.services.secretsmanager.secretsmanager_client import (
    secretsmanager_client,
)


class secretsmanager_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for secret in secretsmanager_client.secrets.values():
            if secret.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=secret)
            report.status = "PASS"
            report.status_extended = (
                f"SecretsManager secret {secret.name} is not publicly accessible."
            )
            if is_policy_public(
                secret.policy,
                secretsmanager_client.audited_account,
            ):
                report.status = "FAIL"
                report.status_extended = f"SecretsManager secret {secret.name} is publicly accessible due to its resource policy."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_secret_rotated_periodically.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_secret_rotated_periodically/secretsmanager_secret_rotated_periodically.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "secretsmanager_secret_rotated_periodically",
  "CheckTitle": "Secrets should be rotated periodically",
  "CheckType": [],
  "ServiceName": "secretsmanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:secretsmanager:region:account-id:secret:secret-name",
  "Severity": "medium",
  "ResourceType": "AwsSecretsManagerSecret",
  "Description": "Secrets should be rotated periodically to reduce the risk of unauthorized access.",
  "Risk": "Rotating secrets in your AWS account reduces the risk of unauthorized access, especially for credentials like passwords or API keys. Automatic rotation via AWS Secrets Manager replaces long-term secrets with short-term ones, lowering the chances of compromise.",
  "RelatedUrl": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
  "Remediation": {
    "Code": {
      "CLI": "aws secretsmanager rotate-secret --secret-id <secret-name>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/secretsmanager-controls.html#secretsmanager-4",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure automatic rotation for your Secrets Manager secrets.",
      "Url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_lambda.html"
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

---[FILE: secretsmanager_secret_rotated_periodically.py]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_secret_rotated_periodically/secretsmanager_secret_rotated_periodically.py

```python
from datetime import datetime, timezone
from typing import List

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.secretsmanager.secretsmanager_client import (
    secretsmanager_client,
)


class secretsmanager_secret_rotated_periodically(Check):
    """Check if AWS Secret Manager secrets are rotated periodically.

    This class checks if each secret in AWS Secret Manager has been rotated periodically
    the maximum number of days allowed could be configured in the audit_config file as max_days_secret_unrotated.
    """

    def execute(self) -> List[Check_Report_AWS]:
        """Execute secretsmanager_secret_rotated_periodically check.

        Iterate over all secrets in AWS Secret Manager and check if each secret has been rotated in the past
        max_days_secret_unrotated days.

        Returns:
            List of reports objects for each secret in AWS Secret Manager.
        """
        findings = []
        for secret in secretsmanager_client.secrets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=secret)
            report.status = "PASS"
            report.status_extended = f"Secret {secret.name} was last rotated on {secret.last_rotated_date.strftime('%B %d, %Y')}."

            if secret.last_rotated_date == datetime.min.replace(tzinfo=timezone.utc):
                report.status = "FAIL"
                report.status_extended = f"Secret {secret.name} has never been rotated."
            else:
                days_since_last_rotation = (
                    datetime.now(timezone.utc) - secret.last_rotated_date
                ).days

                if days_since_last_rotation > secretsmanager_client.audit_config.get(
                    "max_days_secret_unrotated", 90
                ):
                    report.status = "FAIL"
                    report.status_extended = f"Secret {secret.name} has not been rotated in {days_since_last_rotation} days, which is more than the maximum allowed of {secretsmanager_client.audit_config.get('max_days_secret_unrotated', 90)} days."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: secretsmanager_secret_unused.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_secret_unused/secretsmanager_secret_unused.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "secretsmanager_secret_unused",
  "CheckTitle": "Ensure secrets manager secrets are not unused",
  "CheckType": [],
  "ServiceName": "secretsmanager",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:secretsmanager:region:account-id:secret:secret-name",
  "Severity": "medium",
  "ResourceType": "AwsSecretsManagerSecret",
  "Description": "Checks whether Secrets Manager secrets are unused.",
  "Risk": "Unused secrets can be abused by former users or leaked to unauthorized entities, increasing the risk of unauthorized access and data breaches.",
  "RelatedUrl": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/manage_delete-secret.html",
  "Remediation": {
    "Code": {
      "CLI": "aws secretsmanager delete-secret --secret-id <secret-arn>",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/secretsmanager-controls.html#secretsmanager-3",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Regularly review Secrets Manager secrets and delete those that are no longer in use.",
      "Url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/manage_delete-secret.html"
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

---[FILE: secretsmanager_secret_unused.py]---
Location: prowler-master/prowler/providers/aws/services/secretsmanager/secretsmanager_secret_unused/secretsmanager_secret_unused.py

```python
from datetime import datetime, timedelta, timezone

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.secretsmanager.secretsmanager_client import (
    secretsmanager_client,
)


class secretsmanager_secret_unused(Check):
    def execute(self):
        findings = []
        for secret in secretsmanager_client.secrets.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=secret)
            report.status = "PASS"
            report.status_extended = f"Secret {secret.name} has been accessed recently, last accessed on {secret.last_accessed_date.strftime('%B %d, %Y')}."

            if (datetime.now(timezone.utc) - secret.last_accessed_date) > timedelta(
                days=secretsmanager_client.audit_config.get(
                    "max_days_secret_unused", 90
                )
            ):
                report.status = "FAIL"
                if secret.last_accessed_date == datetime.min.replace(
                    tzinfo=timezone.utc
                ):
                    report.status_extended = (
                        f"Secret {secret.name} has never been accessed."
                    )
                else:
                    report.status_extended = f"Secret {secret.name} has not been accessed since {secret.last_accessed_date.strftime('%B %d, %Y')}, you should review if it is still needed."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: securityhub_client.py]---
Location: prowler-master/prowler/providers/aws/services/securityhub/securityhub_client.py

```python
from prowler.providers.aws.services.securityhub.securityhub_service import SecurityHub
from prowler.providers.common.provider import Provider

securityhub_client = SecurityHub(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: securityhub_service.py]---
Location: prowler-master/prowler/providers/aws/services/securityhub/securityhub_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class SecurityHub(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.securityhubs = []
        self.__threading_call__(self._describe_hub)
        self.__threading_call__(self._list_tags, self.securityhubs)

    def _describe_hub(self, regional_client):
        logger.info("SecurityHub - Describing Hub...")
        try:
            # Check if SecurityHub is active
            try:
                hub_arn = regional_client.describe_hub()["HubArn"]
            except ClientError as e:
                # Check if Account is subscribed to Security Hub
                if e.response["Error"]["Code"] == "InvalidAccessException":
                    self.securityhubs.append(
                        SecurityHubHub(
                            arn=self.get_unknown_arn(
                                region=regional_client.region, resource_type="hub"
                            ),
                            id="hub/unknown",
                            status="NOT_AVAILABLE",
                            standards="",
                            integrations="",
                            region=regional_client.region,
                        )
                    )
            else:
                if not self.audit_resources or (
                    is_resource_filtered(hub_arn, self.audit_resources)
                ):
                    hub_id = hub_arn.split("/")[1]
                    get_enabled_standards_paginator = regional_client.get_paginator(
                        "get_enabled_standards"
                    )
                    standards = ""
                    for page in get_enabled_standards_paginator.paginate():
                        for standard in page["StandardsSubscriptions"]:
                            standards += f"{standard['StandardsArn'].split('/')[1]} "
                    list_enabled_products_for_import_paginator = (
                        regional_client.get_paginator(
                            "list_enabled_products_for_import"
                        )
                    )
                    integrations = ""
                    for page in list_enabled_products_for_import_paginator.paginate():
                        for integration in page["ProductSubscriptions"]:
                            if (
                                "/aws/securityhub" not in integration
                            ):  # ignore Security Hub integration with itself
                                integrations += f"{integration.split('/')[-1]} "
                    self.securityhubs.append(
                        SecurityHubHub(
                            arn=hub_arn,
                            id=hub_id,
                            status="ACTIVE",
                            standards=standards,
                            integrations=integrations,
                            region=regional_client.region,
                        )
                    )
                else:
                    # SecurityHub is filtered
                    self.securityhubs.append(
                        SecurityHubHub(
                            arn=self.get_unknown_arn(
                                region=regional_client.region, resource_type="hub"
                            ),
                            id="hub/unknown",
                            status="NOT_AVAILABLE",
                            standards="",
                            integrations="",
                            region=regional_client.region,
                        )
                    )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags(self, resource: any):
        try:
            if resource.status != "NOT_AVAILABLE":
                resource.tags = [
                    self.regional_clients[resource.region].list_tags_for_resource(
                        ResourceArn=resource.arn
                    )["Tags"]
                ]
        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class SecurityHubHub(BaseModel):
    arn: str
    id: str
    status: str
    standards: str
    integrations: str
    region: str
    tags: Optional[list]
```

--------------------------------------------------------------------------------

---[FILE: securityhub_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/securityhub/securityhub_enabled/securityhub_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "securityhub_enabled",
  "CheckTitle": "Check if Security Hub is enabled and its standard subscriptions.",
  "CheckType": [
    "Logging and Monitoring"
  ],
  "ServiceName": "securityhub",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:securityhub:region:account-id:hub/hub-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if Security Hub is enabled and its standard subscriptions.",
  "Risk": "AWS Security Hub gives you a comprehensive view of your security alerts and security posture across your AWS accounts.",
  "RelatedUrl": "https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-enable-disable.html",
  "Remediation": {
    "Code": {
      "CLI": "aws securityhub enable-security-hub --enable-default-standards",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Security Hub is Regional. When you enable or disable a security standard, it is enabled or disabled only in the current Region or in the Region that you specify.",
      "Url": "https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-enable-disable.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: securityhub_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/securityhub/securityhub_enabled/securityhub_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.securityhub.securityhub_client import (
    securityhub_client,
)


class securityhub_enabled(Check):
    def execute(self):
        findings = []
        for securityhub in securityhub_client.securityhubs:
            report = Check_Report_AWS(metadata=self.metadata(), resource=securityhub)
            if securityhub.status == "ACTIVE":
                report.status = "PASS"
                if securityhub.standards:
                    report.status_extended = f"Security Hub is enabled with standards: {securityhub.standards}."
                elif securityhub.integrations:
                    report.status_extended = f"Security Hub is enabled without standards but with integrations: {securityhub.integrations}."
                else:
                    report.status = "FAIL"
                    report.status_extended = "Security Hub is enabled but without any standard or integration."
            else:
                report.status = "FAIL"
                report.status_extended = "Security Hub is not enabled."

            if report.status == "FAIL" and (
                securityhub_client.audit_config.get("mute_non_default_regions", False)
                and not securityhub.region == securityhub_client.region
            ):
                report.muted = True

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: securityhub_enabled_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/securityhub/securityhub_enabled/securityhub_enabled_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.securityhub.securityhub_client import (
    securityhub_client,
)


def fixer(region):
    """
    Enable Security Hub in a region. Requires the securityhub:EnableSecurityHub permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "securityhub:EnableSecurityHub",
                "Resource": "*"
            }
        ]
    }
    Args:
        region (str): AWS region
    Returns:
        bool: True if Security Hub is enabled, False otherwise
    """
    try:
        regional_client = securityhub_client.regional_clients[region]
        regional_client.enable_security_hub(
            EnableDefaultStandards=securityhub_client.fixer_config.get(
                "securityhub_enabled", {}
            ).get("EnableDefaultStandards", True)
        )
    except Exception as error:
        logger.error(
            f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
        )
        return False
    else:
        return True
```

--------------------------------------------------------------------------------

---[FILE: servicecatalog_client.py]---
Location: prowler-master/prowler/providers/aws/services/servicecatalog/servicecatalog_client.py

```python
from prowler.providers.aws.services.servicecatalog.servicecatalog_service import (
    ServiceCatalog,
)
from prowler.providers.common.provider import Provider

servicecatalog_client = ServiceCatalog(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: servicecatalog_service.py]---
Location: prowler-master/prowler/providers/aws/services/servicecatalog/servicecatalog_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService

PORTFOLIO_SHARE_TYPES = [
    "ACCOUNT",
    "ORGANIZATION",
    "ORGANIZATIONAL_UNIT",
    "ORGANIZATION_MEMBER_ACCOUNT",
]


class ServiceCatalog(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.portfolios = {}
        self.__threading_call__(self._list_portfolios)
        self.__threading_call__(
            self._describe_portfolio_shares, self.portfolios.values()
        )
        self.__threading_call__(self._describe_portfolio, self.portfolios.values())

    def _list_portfolios(self, regional_client):
        logger.info("ServiceCatalog - listing portfolios...")
        try:
            response = regional_client.list_portfolios()
            for portfolio in response["PortfolioDetails"]:
                portfolio_arn = portfolio["ARN"]
                if not self.audit_resources or (
                    is_resource_filtered(portfolio_arn, self.audit_resources)
                ):
                    self.portfolios[portfolio_arn] = Portfolio(
                        arn=portfolio_arn,
                        id=portfolio["Id"],
                        name=portfolio["DisplayName"],
                        region=regional_client.region,
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_portfolio_shares(self, portfolio):
        try:
            logger.info("ServiceCatalog - describing portfolios shares...")
            regional_client = self.regional_clients[portfolio.region]
            for portfolio_type in PORTFOLIO_SHARE_TYPES:
                try:
                    for share in regional_client.describe_portfolio_shares(
                        PortfolioId=portfolio.id,
                        Type=portfolio_type,
                    ).get("PortfolioShareDetails", []):
                        portfolio_share = PortfolioShare(
                            type=portfolio_type,
                            accepted=share["Accepted"],
                        )
                        portfolio.shares.append(portfolio_share)
                except Exception as error:
                    if error.response["Error"]["Code"] == "AccessDeniedException":
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
                        portfolio.shares = None
                    else:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_portfolio(self, portfolio):
        try:
            logger.info("ServiceCatalog - describing portfolios...")
            try:
                regional_client = self.regional_clients[portfolio.region]
                portfolio.tags = regional_client.describe_portfolio(
                    Id=portfolio.id,
                )["Tags"]
            except Exception as error:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class PortfolioShare(BaseModel):
    type: str
    accepted: bool


class Portfolio(BaseModel):
    id: str
    name: str
    arn: str
    region: str
    shares: Optional[list[PortfolioShare]] = []
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: servicecatalog_portfolio_shared_within_organization_only.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/servicecatalog/servicecatalog_portfolio_shared_within_organization_only/servicecatalog_portfolio_shared_within_organization_only.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "servicecatalog_portfolio_shared_within_organization_only",
  "CheckTitle": "Service Catalog portfolio is shared only within the AWS Organization",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access"
  ],
  "ServiceName": "servicecatalog",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**AWS Service Catalog portfolios** are assessed to confirm sharing occurs via **AWS Organizations** integration, not direct `ACCOUNT` shares. It reviews shared portfolios and identifies those targeted to individual accounts instead of organizational scopes.",
  "Risk": "Sharing with individual accounts enables recipients to import and launch products outside centralized guardrails, inheriting launch roles. This can cause unauthorized provisioning, data exposure, and configuration drift-impacting confidentiality, integrity, and availability through misused privileges and uncontrolled costs.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/servicecatalog/latest/adminguide/catalogs_portfolios_sharing.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws servicecatalog create-portfolio-share --portfolio-id <portfolio-id> --organization-ids <org-id>",
      "NativeIaC": "```yaml\n# CloudFormation: Share Service Catalog portfolio only within the AWS Organization\nResources:\n  <example_resource_name>:\n    Type: AWS::ServiceCatalog::PortfolioShare\n    Properties:\n      PortfolioId: <example_resource_id>\n      OrganizationNode:               # CRITICAL: share within AWS Organizations\n        Type: ORGANIZATION            # Shares the portfolio with the entire org\n        Value: <example_resource_id>  # e.g., o-xxxxxxxxxx\n```",
      "Other": "1. In the AWS Console, go to Service Catalog > Portfolios and open the target portfolio\n2. Open the Shares/Sharing tab\n3. Remove every share of Type \"Account\" (stop sharing with each account)\n4. Click Share, choose \"AWS Organizations\", set Type to \"Organization\", enter your Org ID (o-xxxxxxxxxx), and share\n5. Verify no remaining shares of Type \"Account\" exist",
      "Terraform": "```hcl\n# Share Service Catalog portfolio only within the AWS Organization\nresource \"aws_servicecatalog_portfolio_share\" \"<example_resource_name>\" {\n  portfolio_id = \"<example_resource_id>\"\n\n  organization_node {           # CRITICAL: share within AWS Organizations\n    type  = \"ORGANIZATION\"     # Shares the portfolio with the entire org\n    value = \"<example_resource_id>\"  # e.g., o-xxxxxxxxxx\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Prefer **organizational sharing** for portfolios and avoid `ACCOUNT` targets. Enforce **least privilege** on portfolio access and launch roles, and review shares regularly. Apply **separation of duties** and **defense in depth** so only governed accounts consume products and blast radius remains constrained.",
      "Url": "https://hub.prowler.com/check/servicecatalog_portfolio_shared_within_organization_only"
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

````
