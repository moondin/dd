---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 245
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 245 of 867)

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

---[FILE: cloudformation_service.py]---
Location: prowler-master/prowler/providers/aws/services/cloudformation/cloudformation_service.py
Signals: Pydantic

```python
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class CloudFormation(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.stacks = []
        self.__threading_call__(self._describe_stacks)
        self._describe_stack()

    def _describe_stacks(self, regional_client):
        """Get ALL CloudFormation Stacks"""
        logger.info("CloudFormation - Describing Stacks...")
        try:
            describe_stacks_paginator = regional_client.get_paginator("describe_stacks")
            for page in describe_stacks_paginator.paginate():
                for stack in page["Stacks"]:
                    if not self.audit_resources or (
                        is_resource_filtered(stack["StackId"], self.audit_resources)
                    ):
                        outputs = []
                        if "Outputs" in stack:
                            for output in stack["Outputs"]:
                                outputs.append(
                                    f"{output['OutputKey']}:{output['OutputValue']}"
                                )
                        self.stacks.append(
                            Stack(
                                arn=stack["StackId"],
                                name=stack["StackName"],
                                tags=stack.get("Tags"),
                                outputs=outputs,
                                region=regional_client.region,
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_stack(self):
        """Get Details for a CloudFormation Stack"""
        logger.info("CloudFormation - Describing Stack to get specific details...")
        for stack in self.stacks:
            try:
                stack_details = self.regional_clients[stack.region].describe_stacks(
                    StackName=stack.name
                )
                # Termination Protection
                stack.enable_termination_protection = stack_details["Stacks"][0][
                    "EnableTerminationProtection"
                ]
                # Nested Stack
                if "RootId" in stack_details["Stacks"][0]:
                    stack.root_nested_stack = stack_details["Stacks"][0]["RootId"]
                stack.is_nested_stack = True if stack.root_nested_stack != "" else False

            except ClientError as error:
                if error.response["Error"]["Code"] == "ValidationError":
                    logger.warning(
                        f"{stack.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue
            except Exception as error:
                logger.error(
                    f"{stack.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Stack(BaseModel):
    """Stack holds a CloudFormation Stack"""

    arn: str
    """In the CloudFormation API the "Stacks[].StackId" is the ARN"""
    name: str
    """Stacks[].StackName"""
    outputs: list[str]
    """Stacks[].Outputs"""
    enable_termination_protection: bool = False
    """Stacks[].EnableTerminationProtection"""
    root_nested_stack: str = ""
    """Stacks[].RootId"""
    is_nested_stack: bool = False
    """True if the Stack is a Nested Stack"""
    tags: Optional[list] = []
    region: str
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_stacks_termination_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudformation/cloudformation_stacks_termination_protection_enabled/cloudformation_stacks_termination_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudformation_stacks_termination_protection_enabled",
  "CheckTitle": "CloudFormation stack has termination protection enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Data Destruction"
  ],
  "ServiceName": "cloudformation",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudFormationStack",
  "Description": "**AWS CloudFormation root stacks** are evaluated for **termination protection**. The detection identifies whether `termination protection` is enabled to block stack deletions on non-nested stacks.",
  "Risk": "Without **termination protection**, human error or automation can delete entire stacks, causing immediate **availability** loss and potential **data destruction** of managed resources.\n\nAttackers with delete rights can more easily trigger outages and hinder recovery.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-protect-stacks.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFormation/stack-termination-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudformation update-termination-protection --stack-name <STACK_NAME> --enable-termination-protection",
      "NativeIaC": "",
      "Other": "1. Open the AWS CloudFormation console\n2. Select the target stack\n3. Choose Stack actions > Edit termination protection\n4. Select Enable and Save",
      "Terraform": "```hcl\nresource \"aws_cloudformation_stack\" \"<example_resource_name>\" {\n  name                           = \"<example_resource_name>\"\n  template_url                   = \"https://s3.amazonaws.com/<bucket>/<template>.json\"\n  enable_termination_protection  = true # Critical: enables termination protection to prevent stack deletion\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **termination protection** on root stacks for critical workloads. Enforce **least privilege** on who can alter this setting or delete stacks, require **change review** via change sets, and apply **stack policies** plus `DeletionPolicy: Retain` for data stores for defense in depth.",
      "Url": "https://hub.prowler.com/check/cloudformation_stacks_termination_protection_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_stacks_termination_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/cloudformation/cloudformation_stacks_termination_protection_enabled/cloudformation_stacks_termination_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudformation.cloudformation_client import (
    cloudformation_client,
)


class cloudformation_stacks_termination_protection_enabled(Check):
    """Check if a CloudFormation Stack has the Termination Protection enabled"""

    def execute(self):
        """Execute the cloudformation_stacks_termination_protection_enabled check"""
        findings = []
        for stack in cloudformation_client.stacks:
            if not stack.is_nested_stack:
                report = Check_Report_AWS(metadata=self.metadata(), resource=stack)

                if stack.enable_termination_protection:
                    report.status = "PASS"
                    report.status_extended = f"CloudFormation Stack {stack.name} has termination protection enabled."
                else:
                    report.status = "FAIL"
                    report.status_extended = f"CloudFormation Stack {stack.name} has termination protection disabled."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_stack_cdktoolkit_bootstrap_version.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudformation/cloudformation_stack_cdktoolkit_bootstrap_version/cloudformation_stack_cdktoolkit_bootstrap_version.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudformation_stack_cdktoolkit_bootstrap_version",
  "CheckTitle": "CDKToolkit CloudFormation stack has Bootstrap version 21 or higher",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Patch Management"
  ],
  "ServiceName": "cloudformation",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCloudFormationStack",
  "Description": "**CloudFormation CDKToolkit** stack's `BootstrapVersion` is compared to a recommended minimum (default `21`). A lower value indicates the environment uses legacy bootstrap resources and IAM roles from older templates.",
  "Risk": "**Outdated bootstrap stacks** can lack recent hardening. Asset buckets or ECR repos may be easier to misuse, and deployment roles may have broader trust.\n\nAdversaries could tamper artifacts or assume privileged roles, compromising integrity/confidentiality and enabling privilege escalation.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://towardsthecloud.com/blog/aws-cdk-bootstrap",
    "https://support.icompaas.com/support/solutions/articles/62000233694-ensure-that-cdktoolkit-stacks-have-a-bootstrap-version-of-21-or-higher-to-mitigate-security-risks",
    "https://docs.aws.amazon.com/cdk/v2/guide/ref-cli-cmd-bootstrap.html",
    "https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping-customizing.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "cdk bootstrap aws://<ACCOUNT_ID>/<REGION>",
      "NativeIaC": "```yaml\n# Minimal CloudFormation to expose BootstrapVersion >= 21 for CDKToolkit\n# Deploy this template as a stack named \"CDKToolkit\"\nResources:\n  CdkBootstrapVersion:\n    Type: AWS::SSM::Parameter\n    Properties:\n      Type: String\n      Name: /cdk-bootstrap/hnb659fds/version  # critical: stores the bootstrap version used by CDK\n      Value: \"21\"                              # critical: set to 21 (or higher) to satisfy the check\nOutputs:\n  BootstrapVersion:\n    Value: !GetAtt CdkBootstrapVersion.Value   # critical: exposes the version in stack outputs so the check passes\n```",
      "Other": "1. Sign in to the AWS Console and open CloudShell\n2. Run: cdk bootstrap aws://<ACCOUNT_ID>/<REGION>\n3. In the console, go to CloudFormation > Stacks > CDKToolkit > Outputs\n4. Confirm Output \"BootstrapVersion\" is 21 or higher",
      "Terraform": "```hcl\n# Create/Update the CDKToolkit stack with BootstrapVersion >= 21\nresource \"aws_cloudformation_stack\" \"cdktoolkit\" {\n  name          = \"CDKToolkit\"\n  # critical: template sets the BootstrapVersion output to 21 (or higher) so the check passes\n  template_body = <<YAML\nResources:\n  CdkBootstrapVersion:\n    Type: AWS::SSM::Parameter\n    Properties:\n      Type: String\n      Name: /cdk-bootstrap/hnb659fds/version  # critical: stores the bootstrap version\n      Value: \"21\"                              # critical: version must be >= 21\nOutputs:\n  BootstrapVersion:\n    Value: !GetAtt CdkBootstrapVersion.Value   # critical: exposes version via stack output\nYAML\n}\n```"
    },
    "Recommendation": {
      "Text": "Standardize on the modern bootstrap at or above the recommended version (e.g., `>= 21`) in every account and Region.\n\nApply **least privilege** to bootstrap roles, limit trusted accounts, enable termination protection, and periodically review for version drift to strengthen **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudformation_stack_cdktoolkit_bootstrap_version"
    }
  },
  "Categories": [
    "vulnerabilities"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_stack_cdktoolkit_bootstrap_version.py]---
Location: prowler-master/prowler/providers/aws/services/cloudformation/cloudformation_stack_cdktoolkit_bootstrap_version/cloudformation_stack_cdktoolkit_bootstrap_version.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudformation.cloudformation_client import (
    cloudformation_client,
)


class cloudformation_stack_cdktoolkit_bootstrap_version(Check):
    """Check if a CDKToolkit CloudFormation Stack has a Bootstrap version less than recommended"""

    def execute(self):
        """Execute the cloudformation_stack_cdktoolkit_bootstrap_version check"""
        findings = []
        recommended_cdk_bootstrap_version = cloudformation_client.audit_config.get(
            "recommended_cdk_bootstrap_version", 21
        )
        for stack in cloudformation_client.stacks:
            # Only check stacks named CDKToolkit
            if stack.name == "CDKToolkit":
                bootstrap_version = None
                if stack.outputs:
                    for output in stack.outputs:
                        if output.startswith("BootstrapVersion:"):
                            bootstrap_version = int(output.split(":")[1])
                            break
                if bootstrap_version:
                    report = Check_Report_AWS(metadata=self.metadata(), resource=stack)
                    report.status = "PASS"
                    report.status_extended = f"CloudFormation Stack CDKToolkit has a Bootstrap version {bootstrap_version}, which meets the recommended version."
                    if bootstrap_version < recommended_cdk_bootstrap_version:
                        report.status = "FAIL"
                        report.status_extended = f"CloudFormation Stack CDKToolkit has a Bootstrap version {bootstrap_version}, which is less than the recommended version {recommended_cdk_bootstrap_version}."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_stack_outputs_find_secrets.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudformation/cloudformation_stack_outputs_find_secrets/cloudformation_stack_outputs_find_secrets.metadata.json
Signals: Next.js

```json
{
  "Provider": "aws",
  "CheckID": "cloudformation_stack_outputs_find_secrets",
  "CheckTitle": "CloudFormation stack outputs do not contain secrets",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Sensitive Data Identifications/Passwords",
    "Sensitive Data Identifications/Security",
    "Effects/Data Exposure"
  ],
  "ServiceName": "cloudformation",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsCloudFormationStack",
  "Description": "**CloudFormation stack Outputs** are analyzed for hardcoded secrets-passwords, API keys, tokens-using pattern-based detection across output values. A finding indicates potential secret strings present within `Outputs` of the template or stack.",
  "Risk": "**Secrets in Outputs** are readable to anyone with stack metadata access, enabling credential theft, unauthorized API calls, and lateral movement. Exposure via consoles, exports, or CI logs undermines confidentiality and can lead to privilege escalation and data exfiltration.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html",
    "https://support.icompaas.com/support/solutions/articles/62000127093-ensure-no-secrets-are-found-in-cloudformation-outputs",
    "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudformation update-stack --stack-name <STACK_NAME> --template-body file://<TEMPLATE_WITHOUT_SENSITIVE_OUTPUTS>.yaml",
      "NativeIaC": "```yaml\nAWSTemplateFormatVersion: '2010-09-09'\nOutputs:\n  # Critical: remove outputs that expose secrets (passwords/tokens/keys)\n  # Keeping only non-sensitive values in Outputs remediates the finding\n  SafeInfo:\n    Value: \"non-sensitive\"\n```",
      "Other": "1. In the AWS Console, go to CloudFormation > Stacks and select the stack\n2. Click Update > Replace current template\n3. Upload or paste the template with any secret-bearing Outputs removed (do not output passwords/tokens/keys)\n4. Click Next through the wizard and choose Submit to apply the change set\n5. Verify the stack Outputs tab no longer shows sensitive values",
      "Terraform": "```hcl\n# Critical: the embedded CloudFormation template removes secret outputs\nresource \"aws_cloudformation_stack\" \"<example_resource_name>\" {\n  name          = \"<example_resource_name>\"\n  template_body = <<-YAML\n    AWSTemplateFormatVersion: '2010-09-09'\n    # Critical: delete Outputs that expose secrets; keep only non-sensitive values\n    Outputs:\n      SafeInfo:\n        Value: \"non-sensitive\"  # Avoids exposing secrets in stack outputs\n  YAML\n}\n```"
    },
    "Recommendation": {
      "Text": "Remove secrets from `Outputs`. Store credentials in **Secrets Manager** or **Parameter Store** and reference them via dynamic references; set `NoEcho` for sensitive parameters. Apply **least privilege** to view stack metadata, avoid exporting sensitive values, and add automated IaC secret scanning for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/cloudformation_stack_outputs_find_secrets"
    }
  },
  "Categories": [
    "secrets"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Infrastructure Protection"
}
```

--------------------------------------------------------------------------------

---[FILE: cloudformation_stack_outputs_find_secrets.py]---
Location: prowler-master/prowler/providers/aws/services/cloudformation/cloudformation_stack_outputs_find_secrets/cloudformation_stack_outputs_find_secrets.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.utils.utils import detect_secrets_scan
from prowler.providers.aws.services.cloudformation.cloudformation_client import (
    cloudformation_client,
)


class cloudformation_stack_outputs_find_secrets(Check):
    """Check if a CloudFormation Stack has secrets in their Outputs"""

    def execute(self):
        """Execute the cloudformation_stack_outputs_find_secrets check"""
        findings = []
        secrets_ignore_patterns = cloudformation_client.audit_config.get(
            "secrets_ignore_patterns", []
        )
        for stack in cloudformation_client.stacks:
            report = Check_Report_AWS(metadata=self.metadata(), resource=stack)
            report.status = "PASS"
            report.status_extended = (
                f"No secrets found in CloudFormation Stack {stack.name} Outputs."
            )
            if stack.outputs:
                data = ""
                # Store the CloudFormation Stack Outputs into a file
                for output in stack.outputs:
                    data += f"{output}\n"

                detect_secrets_output = detect_secrets_scan(
                    data=data,
                    excluded_secrets=secrets_ignore_patterns,
                    detect_secrets_plugins=cloudformation_client.audit_config.get(
                        "detect_secrets_plugins",
                    ),
                )
                # If secrets are found, update the report status
                if detect_secrets_output:
                    secrets_string = ", ".join(
                        [
                            f"{secret['type']} in Output {int(secret['line_number'])}"
                            for secret in detect_secrets_output
                        ]
                    )
                    report.status = "FAIL"
                    report.status_extended = f"Potential secret found in CloudFormation Stack {stack.name} Outputs -> {secrets_string}."

            else:
                report.status = "PASS"
                report.status_extended = (
                    f"CloudFormation Stack {stack.name} has no Outputs."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_client.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_client.py

```python
from prowler.providers.aws.services.cloudfront.cloudfront_service import CloudFront
from prowler.providers.common.provider import Provider

cloudfront_client = CloudFront(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_service.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class CloudFront(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider, global_service=True)
        self.distributions = {}
        self._list_distributions(self.client, self.region)
        self._get_distribution_config(self.client, self.distributions, self.region)
        self._list_tags_for_resource(self.client, self.distributions, self.region)

    def _list_distributions(self, client, region) -> dict:
        logger.info("CloudFront - Listing Distributions...")
        try:
            list_ditributions_paginator = client.get_paginator("list_distributions")
            for page in list_ditributions_paginator.paginate():
                if "Items" in page["DistributionList"]:
                    for item in page["DistributionList"]["Items"]:
                        if not self.audit_resources or (
                            is_resource_filtered(item["ARN"], self.audit_resources)
                        ):
                            distribution_id = item["Id"]
                            distribution_arn = item["ARN"]
                            origin_groups = item.get("OriginGroups", {}).get(
                                "Items", []
                            )
                            origin_failover = all(
                                origin_group.get("Members", {}).get("Quantity", 0) >= 2
                                for origin_group in origin_groups
                            )
                            default_certificate = item["ViewerCertificate"][
                                "CloudFrontDefaultCertificate"
                            ]
                            certificate = item["ViewerCertificate"].get(
                                "Certificate", ""
                            )
                            ssl_support_method = SSLSupportMethod(
                                item["ViewerCertificate"].get(
                                    "SSLSupportMethod", "static-ip"
                                )
                            )
                            origins = []
                            for origin in item.get("Origins", {}).get("Items", []):
                                origins.append(
                                    Origin(
                                        id=origin["Id"],
                                        domain_name=origin["DomainName"],
                                        origin_protocol_policy=origin.get(
                                            "CustomOriginConfig", {}
                                        ).get("OriginProtocolPolicy", ""),
                                        origin_ssl_protocols=origin.get(
                                            "CustomOriginConfig", {}
                                        )
                                        .get("OriginSslProtocols", {})
                                        .get("Items", []),
                                        origin_access_control=origin.get(
                                            "OriginAccessControlId", ""
                                        ),
                                        s3_origin_config=origin.get(
                                            "S3OriginConfig", {}
                                        ),
                                    )
                                )
                            distribution = Distribution(
                                arn=distribution_arn,
                                id=distribution_id,
                                origins=origins,
                                region=region,
                                origin_failover=origin_failover,
                                ssl_support_method=ssl_support_method,
                                default_certificate=default_certificate,
                                certificate=certificate,
                            )
                            self.distributions[distribution_id] = distribution

        except Exception as error:
            logger.error(
                f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_distribution_config(self, client, distributions, region) -> dict:
        logger.info("CloudFront - Getting Distributions...")
        try:
            for distribution_id in distributions.keys():
                distribution_config = client.get_distribution_config(Id=distribution_id)

                # Global Config
                distributions[distribution_id].logging_enabled = distribution_config[
                    "DistributionConfig"
                ]["Logging"]["Enabled"]
                distributions[distribution_id].geo_restriction_type = (
                    GeoRestrictionType(
                        distribution_config["DistributionConfig"]["Restrictions"][
                            "GeoRestriction"
                        ]["RestrictionType"]
                    )
                )
                distributions[distribution_id].web_acl_id = distribution_config[
                    "DistributionConfig"
                ]["WebACLId"]
                distributions[distribution_id].default_root_object = (
                    distribution_config["DistributionConfig"].get(
                        "DefaultRootObject", ""
                    )
                )
                distributions[distribution_id].viewer_protocol_policy = (
                    distribution_config["DistributionConfig"][
                        "DefaultCacheBehavior"
                    ].get("ViewerProtocolPolicy", "")
                )

                # Default Cache Config
                default_cache_config = DefaultCacheConfigBehaviour(
                    realtime_log_config_arn=distribution_config["DistributionConfig"][
                        "DefaultCacheBehavior"
                    ].get("RealtimeLogConfigArn"),
                    viewer_protocol_policy=ViewerProtocolPolicy(
                        distribution_config["DistributionConfig"][
                            "DefaultCacheBehavior"
                        ].get("ViewerProtocolPolicy")
                    ),
                    field_level_encryption_id=distribution_config["DistributionConfig"][
                        "DefaultCacheBehavior"
                    ].get("FieldLevelEncryptionId"),
                )
                distributions[distribution_id].default_cache_config = (
                    default_cache_config
                )

        except Exception as error:
            logger.error(
                f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self, client, distributions, region):
        logger.info("CloudFront - List Tags...")
        try:
            for distribution in distributions.values():
                response = client.list_tags_for_resource(Resource=distribution.arn)[
                    "Tags"
                ]
                distribution.tags = response.get("Items")
        except Exception as error:
            logger.error(
                f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class OriginsSSLProtocols(Enum):
    SSLv3 = "SSLv3"
    TLSv1 = "TLSv1"
    TLSv1_1 = "TLSv1.1"
    TLSv1_2 = "TLSv1.2"


class ViewerProtocolPolicy(Enum):
    """The protocol that viewers can use to access the files in the origin specified by TargetOriginId when a request matches the path pattern in PathPattern"""

    allow_all = "allow-all"
    redirect_to_https = "redirect-to-https"
    https_only = "https-only"


class GeoRestrictionType(Enum):
    """Method types that you want to use to restrict distribution of your content by country"""

    none = "none"
    blacklist = "blacklist"
    whitelist = "whitelist"


class SSLSupportMethod(Enum):
    """Method types that viewer want to accept HTTPS requests from"""

    static_ip = "static-ip"
    sni_only = "sni-only"
    vip = "vip"


class DefaultCacheConfigBehaviour(BaseModel):
    realtime_log_config_arn: Optional[str] = None
    viewer_protocol_policy: ViewerProtocolPolicy
    field_level_encryption_id: str


class Origin(BaseModel):
    id: str
    domain_name: str
    origin_protocol_policy: str
    origin_ssl_protocols: list[str]
    origin_access_control: Optional[str] = None
    s3_origin_config: Optional[dict] = None


class Distribution(BaseModel):
    """Distribution holds a CloudFront Distribution resource"""

    arn: str
    id: str
    region: str
    logging_enabled: bool = False
    default_cache_config: Optional[DefaultCacheConfigBehaviour] = None
    geo_restriction_type: Optional[GeoRestrictionType] = None
    origins: list[Origin]
    web_acl_id: str = ""
    default_certificate: Optional[bool] = None
    default_root_object: Optional[str] = None
    viewer_protocol_policy: Optional[str] = None
    tags: Optional[list] = []
    origin_failover: Optional[bool] = None
    ssl_support_method: Optional[SSLSupportMethod] = None
    certificate: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_custom_ssl_certificate.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_custom_ssl_certificate/cloudfront_distributions_custom_ssl_certificate.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_custom_ssl_certificate",
  "CheckTitle": "CloudFront distribution uses a custom SSL/TLS certificate",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "CloudFront distributions are configured with a **custom SSL/TLS certificate** rather than the default `*.cloudfront.net` certificate for viewer connections.",
  "Risk": "Using the default certificate prevents HTTPS on your own hostnames, breaking hostname validation. Clients may face errors or avoid TLS, impacting **authentication** and **availability**. Control over TLS posture and domain-bound security headers is reduced, weakening **confidentiality** and user trust.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/cloudfront-distro-custom-tls.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudfront-controls.html#cloudfront-7",
    "https://support.icompaas.com/support/solutions/articles/62000233491-ensure-cloudfront-distributions-use-custom-ssl-tls-certificates",
    "https://reintech.io/blog/configure-https-ssl-certificates-cloudfront-distributions"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to add Aliases and ViewerCertificate fields, then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        Origins:\n          - Id: origin1\n            DomainName: <example_origin_domain>\n            S3OriginConfig: {}\n        DefaultCacheBehavior:\n          TargetOriginId: origin1\n          ViewerProtocolPolicy: redirect-to-https\n          ForwardedValues:\n            QueryString: false\n        Aliases:\n          - <example_domain>  # CRITICAL: add an alternate domain name (CNAME) covered by the certificate\n        ViewerCertificate:\n          AcmCertificateArn: <example_certificate_arn>  # CRITICAL: attach custom ACM cert (must be in us-east-1)\n          SslSupportMethod: sni-only  # CRITICAL: required when using ACM cert\n```",
      "Other": "1. Open the CloudFront console and select your distribution\n2. Go to the Settings/General tab and click Edit\n3. In Alternate domain name (CNAME), add <example_domain>\n4. In SSL certificate, choose Custom SSL certificate and select your ACM certificate (issued in us-east-1 and covering <example_domain>)\n5. Click Save/Yes, Edit and wait for the distribution to deploy",
      "Terraform": "```hcl\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  enabled = true\n\n  origin {\n    domain_name = \"<example_origin_domain>\"\n    origin_id   = \"origin1\"\n    s3_origin_config {}\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"origin1\"\n    viewer_protocol_policy = \"redirect-to-https\"\n    forwarded_values { query_string = false }\n  }\n\n  aliases = [\"<example_domain>\"]  # CRITICAL: add CNAME covered by the cert\n\n  viewer_certificate {\n    acm_certificate_arn = \"<example_certificate_arn>\"  # CRITICAL: custom ACM cert (in us-east-1)\n    ssl_support_method  = \"sni-only\"                    # CRITICAL: required with ACM cert\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "- Use a **custom SSL/TLS certificate** covering your domains and configure aliases.\n- Enforce modern TLS policy, **SNI**, and **HSTS**; disable legacy protocols.\n- Apply **least privilege** to certificate lifecycle and rotate/monitor keys.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_custom_ssl_certificate"
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

---[FILE: cloudfront_distributions_custom_ssl_certificate.py]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_custom_ssl_certificate/cloudfront_distributions_custom_ssl_certificate.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)


class cloudfront_distributions_custom_ssl_certificate(Check):
    def execute(self):
        findings = []
        for distribution in cloudfront_client.distributions.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=distribution)
            report.status = "PASS"
            report.status_extended = f"CloudFront Distribution {distribution.id} is using a custom SSL/TLS certificate."

            if distribution.default_certificate:
                report.status = "FAIL"
                report.status_extended = f"CloudFront Distribution {distribution.id} is using the default SSL/TLS certificate."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudfront_distributions_default_root_object.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/cloudfront/cloudfront_distributions_default_root_object/cloudfront_distributions_default_root_object.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "cloudfront_distributions_default_root_object",
  "CheckTitle": "CloudFront distribution has a default root object configured",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "cloudfront",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "CloudFront distributions are evaluated for a configured **default root object** that maps `/` requests to a specific file such as `index.html`, rather than forwarding root requests directly to the origin.",
  "Risk": "Without a **default root object**, root requests can reveal **origin listings** or unintended files, exposing data (**confidentiality**) and aiding reconnaissance. They may also return errors, lowering uptime (**availability**), or route unpredictably, risking wrong content delivery (**integrity**).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/cloudfront-controls.html#cloudfront-1",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudFront/cloudfront-default-object.html",
    "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --output json > current-config.json && echo 'Manually edit current-config.json to add DefaultRootObject: \"index.html\", then run:' && echo 'aws cloudfront update-distribution --id <DISTRIBUTION_ID> --distribution-config file://current-config.json --if-match $(aws cloudfront get-distribution-config --id <DISTRIBUTION_ID> --query \"ETag\" --output text)'",
      "NativeIaC": "```yaml\n# CloudFormation: Set a default root object on a CloudFront distribution\nResources:\n  CloudFrontDistribution:\n    Type: AWS::CloudFront::Distribution\n    Properties:\n      DistributionConfig:\n        Enabled: true\n        DefaultRootObject: index.html  # CRITICAL: ensures a default root object is configured\n        Origins:\n          - Id: <example_origin_id>\n            DomainName: <example_origin_domain>\n            S3OriginConfig: {}\n        DefaultCacheBehavior:\n          TargetOriginId: <example_origin_id>\n          ViewerProtocolPolicy: allow-all\n          ForwardedValues:\n            QueryString: false\n```",
      "Other": "1. Open the AWS Console and go to CloudFront\n2. Select the target distribution and choose Settings > General > Edit\n3. In Default root object, enter index.html (do not start with a /)\n4. Save changes and wait for deployment to complete",
      "Terraform": "```hcl\n# Terraform: Set a default root object on a CloudFront distribution\nresource \"aws_cloudfront_distribution\" \"<example_resource_name>\" {\n  enabled             = true\n  default_root_object = \"index.html\" # CRITICAL: ensures a default root object is configured\n\n  origin {\n    domain_name = \"<example_origin_domain>\"\n    origin_id   = \"<example_origin_id>\"\n\n    s3_origin_config {}\n  }\n\n  default_cache_behavior {\n    target_origin_id       = \"<example_origin_id>\"\n    viewer_protocol_policy = \"allow-all\"\n    forwarded_values {\n      query_string = false\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Set a **default root object** that returns a safe landing page (e.g., `index.html`). Apply **defense in depth**: restrict direct origin access, define explicit error pages, and standardize redirects. Test root and subdirectory requests for predictable responses. Align origin permissions with **least privilege**.",
      "Url": "https://hub.prowler.com/check/cloudfront_distributions_default_root_object"
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
