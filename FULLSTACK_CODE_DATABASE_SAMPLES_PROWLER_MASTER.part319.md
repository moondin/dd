---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 319
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 319 of 867)

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

---[FILE: servicecatalog_portfolio_shared_within_organization_only.py]---
Location: prowler-master/prowler/providers/aws/services/servicecatalog/servicecatalog_portfolio_shared_within_organization_only/servicecatalog_portfolio_shared_within_organization_only.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.organizations.organizations_client import (
    organizations_client,
)
from prowler.providers.aws.services.servicecatalog.servicecatalog_client import (
    servicecatalog_client,
)


class servicecatalog_portfolio_shared_within_organization_only(Check):
    def execute(self):
        findings = []
        if (
            organizations_client.organization
            and organizations_client.organization.status == "ACTIVE"
        ):
            for portfolio in servicecatalog_client.portfolios.values():
                if portfolio.shares is not None:
                    report = Check_Report_AWS(
                        metadata=self.metadata(), resource=portfolio
                    )
                    report.status = "PASS"
                    report.status_extended = f"ServiceCatalog Portfolio {portfolio.name} is shared within your AWS Organization."
                    for portfolio_share in portfolio.shares:
                        if portfolio_share.type == "ACCOUNT":
                            report.status = "FAIL"
                            report.status_extended = f"ServiceCatalog Portfolio {portfolio.name} is shared with an account."
                            break

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ses_client.py]---
Location: prowler-master/prowler/providers/aws/services/ses/ses_client.py

```python
from prowler.providers.aws.services.ses.ses_service import SES
from prowler.providers.common.provider import Provider

ses_client = SES(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: ses_service.py]---
Location: prowler-master/prowler/providers/aws/services/ses/ses_service.py
Signals: Pydantic

```python
from json import loads
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class SES(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("sesv2", provider)
        self.email_identities = {}
        self.__threading_call__(self._list_email_identities)
        self.__threading_call__(
            self._get_email_identities, self.email_identities.values()
        )

    def _list_email_identities(self, regional_client):
        logger.info("SES - describing identities...")
        try:
            response = regional_client.list_email_identities()
            for email_identity in response["EmailIdentities"]:
                identity_arn = f"arn:{self.audited_partition}:ses:{regional_client.region}:{self.audited_account}:identity/{email_identity['IdentityName']}"
                if not self.audit_resources or (
                    is_resource_filtered(identity_arn, self.audit_resources)
                ):
                    self.email_identities[identity_arn] = Identity(
                        arn=identity_arn,
                        type=email_identity["IdentityType"],
                        name=email_identity["IdentityName"],
                        region=regional_client.region,
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_email_identities(self, identity):
        try:
            logger.info("SES - describing email identities ...")
            try:
                regional_client = self.regional_clients[identity.region]
                identity_attributes = regional_client.get_email_identity(
                    EmailIdentity=identity.name
                )
                for _, content in identity_attributes["Policies"].items():
                    identity.policy = loads(content)
                identity.tags = identity_attributes["Tags"]

            except Exception as error:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Identity(BaseModel):
    name: str
    arn: str
    region: str
    type: Optional[str]
    policy: Optional[dict] = None
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: ses_identity_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ses/ses_identity_not_publicly_accessible/ses_identity_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ses_identity_not_publicly_accessible",
  "CheckTitle": "Ensure that SES identities are not publicly accessible",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "ses",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:ses:region:account-id:identity/<IDENTITY-NAME>",
  "Severity": "high",
  "ResourceType": "AwsSesIdentity",
  "Description": "This control checks whether SES identities are not publicly accessible via resource policies.",
  "Risk": "Publicly accessible SES identities can allow unauthorized email sending or receiving, leading to potential abuse or phishing attacks.",
  "RelatedUrl": "https://docs.aws.amazon.com/ses/latest/dg/identity-authorization-policies.html",
  "Remediation": {
    "Code": {
      "CLI": "aws ses delete-email-identity-policy --identity <IDENTITY-NAME> --policy-name <POLICY-NAME>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review and restrict SES identity policies to prevent public access. Ensure policies follow the Principle of Least Privilege.",
      "Url": "https://docs.aws.amazon.com/ses/latest/dg/policy-anatomy.html"
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

---[FILE: ses_identity_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/ses/ses_identity_not_publicly_accessible/ses_identity_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_policy_public
from prowler.providers.aws.services.ses.ses_client import ses_client


class ses_identity_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for identity in ses_client.email_identities.values():
            if identity.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=identity)
            report.status = "PASS"
            report.status_extended = (
                f"SES identity {identity.name} is not publicly accessible."
            )
            if is_policy_public(
                identity.policy,
                ses_client.audited_account,
            ):
                report.status = "FAIL"
                report.status_extended = f"SES identity {identity.name} is publicly accessible due to its resource policy."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: shield_client.py]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_client.py

```python
from prowler.providers.aws.services.shield.shield_service import Shield
from prowler.providers.common.provider import Provider

shield_client = Shield(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: shield_service.py]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.aws.lib.service.service import AWSService


class Shield(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider, global_service=True)
        self.protections = {}
        self.enabled = False
        self.enabled = self._get_subscription_state()
        if self.enabled:
            self._list_protections()

    def _get_subscription_state(self):
        logger.info("Shield - Getting Subscription State...")
        try:
            return (
                True
                if self.client.get_subscription_state()["SubscriptionState"] == "ACTIVE"
                else False
            )
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_protections(self):
        logger.info("Shield - Listing Protections...")
        try:
            list_protections_paginator = self.client.get_paginator("list_protections")
            for page in list_protections_paginator.paginate():
                for protection in page["Protections"]:
                    protection_arn = protection.get("ProtectionArn")
                    protection_id = protection.get("Id")
                    protection_name = protection.get("Name")
                    resource_arn = protection.get("ResourceArn")

                    self.protections[protection_id] = Protection(
                        id=protection_id,
                        name=protection_name,
                        resource_arn=resource_arn,
                        protection_arn=protection_arn,
                        region=self.region,
                    )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Protection(BaseModel):
    id: str
    name: str
    resource_arn: str
    protection_arn: str = None
    region: str
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_associated_elastic_ips.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_associated_elastic_ips/shield_advanced_protection_in_associated_elastic_ips.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "shield_advanced_protection_in_associated_elastic_ips",
  "CheckTitle": "Check if Elastic IP addresses with associations are protected by AWS Shield Advanced.",
  "CheckType": [],
  "ServiceName": "shield",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEc2Eip",
  "Description": "Check if Elastic IP addresses with associations are protected by AWS Shield Advanced.",
  "Risk": "AWS Shield Advanced provides expanded DDoS attack protection for your resources.",
  "RelatedUrl": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Add as a protected resource in AWS Shield Advanced.",
      "Url": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_associated_elastic_ips.py]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_associated_elastic_ips/shield_advanced_protection_in_associated_elastic_ips.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.shield.shield_client import shield_client


class shield_advanced_protection_in_associated_elastic_ips(Check):
    def execute(self):
        findings = []
        if shield_client.enabled:
            for elastic_ip in ec2_client.elastic_ips:
                report = Check_Report_AWS(metadata=self.metadata(), resource=elastic_ip)
                report.region = shield_client.region
                report.resource_id = elastic_ip.allocation_id
                report.status = "FAIL"
                report.status_extended = f"Elastic IP {elastic_ip.allocation_id} is not protected by AWS Shield Advanced."

                for protection in shield_client.protections.values():
                    if elastic_ip.arn == protection.resource_arn:
                        report.status = "PASS"
                        report.status_extended = f"Elastic IP {elastic_ip.allocation_id} is protected by AWS Shield Advanced."
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_classic_load_balancers.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_classic_load_balancers/shield_advanced_protection_in_classic_load_balancers.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "shield_advanced_protection_in_classic_load_balancers",
  "CheckTitle": "Check if Classic Load Balancers are protected by AWS Shield Advanced.",
  "CheckType": [],
  "ServiceName": "shield",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbLoadBalancer",
  "Description": "Check if Classic Load Balancers are protected by AWS Shield Advanced.",
  "Risk": "AWS Shield Advanced provides expanded DDoS attack protection for your resources.",
  "RelatedUrl": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Add as a protected resource in AWS Shield Advanced.",
      "Url": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_classic_load_balancers.py]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_classic_load_balancers/shield_advanced_protection_in_classic_load_balancers.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elb.elb_client import elb_client
from prowler.providers.aws.services.shield.shield_client import shield_client


class shield_advanced_protection_in_classic_load_balancers(Check):
    def execute(self):
        findings = []
        if shield_client.enabled:
            for lb in elb_client.loadbalancers.values():
                report = Check_Report_AWS(metadata=self.metadata(), resource=lb)
                report.region = shield_client.region
                report.status = "FAIL"
                report.status_extended = (
                    f"ELB {lb.name} is not protected by AWS Shield Advanced."
                )

                for protection in shield_client.protections.values():
                    if lb.arn == protection.resource_arn:
                        report.status = "PASS"
                        report.status_extended = (
                            f"ELB {lb.name} is protected by AWS Shield Advanced."
                        )
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_cloudfront_distributions.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_cloudfront_distributions/shield_advanced_protection_in_cloudfront_distributions.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "shield_advanced_protection_in_cloudfront_distributions",
  "CheckTitle": "Check if Cloudfront distributions are protected by AWS Shield Advanced.",
  "CheckType": [],
  "ServiceName": "shield",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCloudFrontDistribution",
  "Description": "Check if Cloudfront distributions are protected by AWS Shield Advanced.",
  "Risk": "AWS Shield Advanced provides expanded DDoS attack protection for your resources.",
  "RelatedUrl": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Add as a protected resource in AWS Shield Advanced.",
      "Url": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_cloudfront_distributions.py]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_cloudfront_distributions/shield_advanced_protection_in_cloudfront_distributions.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.cloudfront.cloudfront_client import (
    cloudfront_client,
)
from prowler.providers.aws.services.shield.shield_client import shield_client


class shield_advanced_protection_in_cloudfront_distributions(Check):
    def execute(self):
        findings = []
        if shield_client.enabled:
            for distribution in cloudfront_client.distributions.values():
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=distribution
                )
                report.region = shield_client.region
                report.status = "FAIL"
                report.status_extended = f"CloudFront distribution {distribution.id} is not protected by AWS Shield Advanced."

                for protection in shield_client.protections.values():
                    if distribution.arn == protection.resource_arn:
                        report.status = "PASS"
                        report.status_extended = f"CloudFront distribution {distribution.id} is protected by AWS Shield Advanced."
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_global_accelerators.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_global_accelerators/shield_advanced_protection_in_global_accelerators.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "shield_advanced_protection_in_global_accelerators",
  "CheckTitle": "Check if Global Accelerators are protected by AWS Shield Advanced.",
  "CheckType": [],
  "ServiceName": "shield",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Check if Global Accelerators are protected by AWS Shield Advanced.",
  "Risk": "AWS Shield Advanced provides expanded DDoS attack protection for your resources.",
  "RelatedUrl": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Add as a protected resource in AWS Shield Advanced.",
      "Url": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_global_accelerators.py]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_global_accelerators/shield_advanced_protection_in_global_accelerators.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.globalaccelerator.globalaccelerator_client import (
    globalaccelerator_client,
)
from prowler.providers.aws.services.shield.shield_client import shield_client


class shield_advanced_protection_in_global_accelerators(Check):
    def execute(self):
        findings = []
        if shield_client.enabled:
            for accelerator in globalaccelerator_client.accelerators.values():
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=accelerator
                )
                report.region = shield_client.region
                report.status = "FAIL"
                report.status_extended = f"Global Accelerator {accelerator.name} is not protected by AWS Shield Advanced."

                for protection in shield_client.protections.values():
                    if accelerator.arn == protection.resource_arn:
                        report.status = "PASS"
                        report.status_extended = f"Global Accelerator {accelerator.name} is protected by AWS Shield Advanced."
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_internet_facing_load_balancers.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_internet_facing_load_balancers/shield_advanced_protection_in_internet_facing_load_balancers.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "shield_advanced_protection_in_internet_facing_load_balancers",
  "CheckTitle": "Check if internet-facing Application Load Balancers are protected by AWS Shield Advanced.",
  "CheckType": [],
  "ServiceName": "shield",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsElbv2LoadBalancer",
  "Description": "Check if internet-facing Application Load Balancers are protected by AWS Shield Advanced.",
  "Risk": "AWS Shield Advanced provides expanded DDoS attack protection for your resources.",
  "RelatedUrl": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Add as a protected resource in AWS Shield Advanced.",
      "Url": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_internet_facing_load_balancers.py]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_internet_facing_load_balancers/shield_advanced_protection_in_internet_facing_load_balancers.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.elbv2.elbv2_client import elbv2_client
from prowler.providers.aws.services.shield.shield_client import shield_client


class shield_advanced_protection_in_internet_facing_load_balancers(Check):
    def execute(self):
        findings = []
        if shield_client.enabled:
            for elbv2_arn, elbv2 in elbv2_client.loadbalancersv2.items():
                if elbv2.type == "application" and elbv2.scheme == "internet-facing":
                    report = Check_Report_AWS(metadata=self.metadata(), resource=elbv2)
                    report.region = shield_client.region
                    report.status = "FAIL"
                    report.status_extended = f"ELBv2 ALB {elbv2.name} is not protected by AWS Shield Advanced."

                    for protection in shield_client.protections.values():
                        if elbv2_arn == protection.resource_arn:
                            report.status = "PASS"
                            report.status_extended = f"ELBv2 ALB {elbv2.name} is protected by AWS Shield Advanced."
                            break

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_route53_hosted_zones.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_route53_hosted_zones/shield_advanced_protection_in_route53_hosted_zones.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "shield_advanced_protection_in_route53_hosted_zones",
  "CheckTitle": "Check if Route53 hosted zones are protected by AWS Shield Advanced.",
  "CheckType": [],
  "ServiceName": "shield",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRoute53HostedZone",
  "Description": "Check if Route53 hosted zones are protected by AWS Shield Advanced.",
  "Risk": "AWS Shield Advanced provides expanded DDoS attack protection for your resources.",
  "RelatedUrl": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Add as a protected resource in AWS Shield Advanced.",
      "Url": "https://docs.aws.amazon.com/waf/latest/developerguide/configure-new-protection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: shield_advanced_protection_in_route53_hosted_zones.py]---
Location: prowler-master/prowler/providers/aws/services/shield/shield_advanced_protection_in_route53_hosted_zones/shield_advanced_protection_in_route53_hosted_zones.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.route53.route53_client import route53_client
from prowler.providers.aws.services.shield.shield_client import shield_client


class shield_advanced_protection_in_route53_hosted_zones(Check):
    def execute(self):
        findings = []
        if shield_client.enabled:
            for hosted_zone in route53_client.hosted_zones.values():
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=hosted_zone
                )
                report.region = shield_client.region
                report.status = "FAIL"
                report.status_extended = f"Route53 Hosted Zone {hosted_zone.id} is not protected by AWS Shield Advanced."

                for protection in shield_client.protections.values():
                    if hosted_zone.arn == protection.resource_arn:
                        report.status = "PASS"
                        report.status_extended = f"Route53 Hosted Zone {hosted_zone.id} is protected by AWS Shield Advanced."
                        break

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sns_client.py]---
Location: prowler-master/prowler/providers/aws/services/sns/sns_client.py

```python
from prowler.providers.aws.services.sns.sns_service import SNS
from prowler.providers.common.provider import Provider

sns_client = SNS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: sns_service.py]---
Location: prowler-master/prowler/providers/aws/services/sns/sns_service.py
Signals: Pydantic

```python
from json import loads
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class SNS(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.topics = []
        self.__threading_call__(self._list_topics)
        self._get_topic_attributes(self.regional_clients)
        self.__threading_call__(self._list_tags_for_resource, self.topics)
        self._list_subscriptions_by_topic()

    def _list_topics(self, regional_client):
        logger.info("SNS - listing topics...")
        try:
            list_topics_paginator = regional_client.get_paginator("list_topics")
            for page in list_topics_paginator.paginate():
                for topic_arn in page["Topics"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            topic_arn["TopicArn"], self.audit_resources
                        )
                    ):
                        self.topics.append(
                            Topic(
                                name=topic_arn["TopicArn"].rsplit(":", 1)[1],
                                arn=topic_arn["TopicArn"],
                                region=regional_client.region,
                            )
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_topic_attributes(self, regional_clients):
        logger.info("SNS - getting topic attributes...")
        try:
            for topic in self.topics:
                regional_client = regional_clients[topic.region]
                topic_attributes = regional_client.get_topic_attributes(
                    TopicArn=topic.arn
                )
                if "Policy" in topic_attributes["Attributes"]:
                    topic.policy = loads(topic_attributes["Attributes"]["Policy"])
                if "KmsMasterKeyId" in topic_attributes["Attributes"]:
                    topic.kms_master_key_id = topic_attributes["Attributes"][
                        "KmsMasterKeyId"
                    ]
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self, resource):
        logger.info("SNS - Listing Tags...")
        try:
            resource.tags = self.regional_clients[
                resource.region
            ].list_tags_for_resource(ResourceArn=resource.arn)["Tags"]
        except ClientError as error:
            if error.response["Error"]["Code"] == "ResourceNotFoundException":
                logger.warning(
                    f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: Resource {resource.arn} not found while listing tags"
                )
            else:
                logger.error(
                    f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{resource.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_subscriptions_by_topic(self):
        logger.info("SNS - Listing subscriptions by topic...")
        try:
            for topic in self.topics:
                try:
                    regional_client = self.regional_clients[topic.region]
                    response = regional_client.list_subscriptions_by_topic(
                        TopicArn=topic.arn
                    )
                    subscriptions: list[Subscription] = [
                        Subscription(
                            id=(parts := sub["SubscriptionArn"].split(":"))[-1],
                            arn=sub["SubscriptionArn"],
                            owner=sub["Owner"],
                            protocol=sub["Protocol"],
                            endpoint=sub["Endpoint"],
                            region=parts[3] if len(parts) > 3 else "unknown",
                        )
                        for sub in response["Subscriptions"]
                    ]
                    topic.subscriptions = subscriptions
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Subscription(BaseModel):
    id: str
    arn: str
    owner: str
    protocol: str
    endpoint: str
    region: str


class Topic(BaseModel):
    name: str
    arn: str
    region: str
    policy: dict = None
    kms_master_key_id: str = None
    tags: Optional[list] = []
    subscriptions: Optional[list[Subscription]] = []
```

--------------------------------------------------------------------------------

---[FILE: sns_subscription_not_using_http_endpoints.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/sns/sns_subscription_not_using_http_endpoints/sns_subscription_not_using_http_endpoints.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "sns_subscription_not_using_http_endpoints",
  "CheckTitle": "SNS subscription uses an HTTPS endpoint",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Effects/Data Exposure"
  ],
  "ServiceName": "sns",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsSnsTopic",
  "Description": "Amazon SNS subscriptions are evaluated for endpoint protocol. Subscriptions using `http` are identified, while **HTTPS** endpoints indicate encrypted delivery in transit.",
  "Risk": "Using **HTTP** leaves SNS deliveries unencrypted, compromising **confidentiality** via eavesdropping. MITM attackers can modify payloads or headers, damaging **integrity**, inject malicious content into downstream systems, or capture subscription data for spoofing and unauthorized actions.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-sns-subscription.html",
    "https://docs.aws.amazon.com/sns/latest/dg/sns-security-best-practices.html#enforce-encryption-data-in-transit"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: Ensure SNS subscription uses HTTPS\nResources:\n  <example_resource_name>:\n    Type: AWS::SNS::Subscription\n    Properties:\n      TopicArn: <example_resource_id>\n      Protocol: https              # Critical: use HTTPS protocol to remediate HTTP usage\n      Endpoint: https://<example_endpoint>  # Critical: HTTPS endpoint URL\n```",
      "Other": "1. Open the Amazon SNS console and go to Subscriptions\n2. Select the subscription with Protocol set to HTTP and click Delete\n3. Click Create subscription\n4. Choose the same Topic ARN, set Protocol to HTTPS, and enter your HTTPS endpoint URL\n5. Create the subscription and confirm it from your endpoint if required",
      "Terraform": "```hcl\n# Terraform: Ensure SNS subscription uses HTTPS\nresource \"aws_sns_topic_subscription\" \"<example_resource_name>\" {\n  topic_arn = \"<example_resource_id>\"\n  protocol  = \"https\"                      # Critical: enforce HTTPS protocol\n  endpoint  = \"https://<example_endpoint>\" # Critical: HTTPS endpoint URL\n}\n```"
    },
    "Recommendation": {
      "Text": "Require **HTTPS** for all SNS subscription endpoints. Prefer domain-based endpoints, verify SNS message signatures, and apply **least privilege**. Enforce TLS using IAM conditions like `aws:SecureTransport`, and use private connectivity (VPC endpoints) where possible for defense in depth.",
      "Url": "https://hub.prowler.com/check/sns_subscription_not_using_http_endpoints"
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

---[FILE: sns_subscription_not_using_http_endpoints.py]---
Location: prowler-master/prowler/providers/aws/services/sns/sns_subscription_not_using_http_endpoints/sns_subscription_not_using_http_endpoints.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.sns.sns_client import sns_client


class sns_subscription_not_using_http_endpoints(Check):
    def execute(self):
        findings = []
        for topic in sns_client.topics:
            for subscription in topic.subscriptions:
                if subscription.arn == "PendingConfirmation":
                    continue
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=subscription
                )
                report.resource_details = topic.arn
                report.status = "PASS"
                report.status_extended = (
                    f"Subscription {subscription.arn} is using an HTTPS endpoint."
                )

                if subscription.protocol == "http":
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Subscription {subscription.arn} is using an HTTP endpoint."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
