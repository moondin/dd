---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 236
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 236 of 867)

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

---[FILE: account_maintain_current_contact_details.py]---
Location: prowler-master/prowler/providers/aws/services/account/account_maintain_current_contact_details/account_maintain_current_contact_details.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.account.account_client import account_client

# This check has no findings since it is manual


class account_maintain_current_contact_details(Check):
    def execute(self):
        report = Check_Report_AWS(metadata=self.metadata(), resource={})
        report.region = account_client.region
        report.resource_id = account_client.audited_account
        report.resource_arn = account_client.audited_account_arn
        report.status = "MANUAL"
        report.status_extended = "Login to the AWS Console. Choose your account name on the top right of the window -> My Account -> Contact Information."
        return [report]
```

--------------------------------------------------------------------------------

---[FILE: account_security_contact_information_is_registered.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/account/account_security_contact_information_is_registered/account_security_contact_information_is_registered.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "account_security_contact_information_is_registered",
  "CheckTitle": "AWS account has security alternate contact registered",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "account",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Account settings contain a **Security alternate contact** in Alternate Contacts (name, `EmailAddress`, `PhoneNumber`) for targeted AWS security notifications.",
  "Risk": "Missing or outdated **security contact** can delay or prevent AWS advisories from reaching responders, increasing risk to:\n- Confidentiality: data exfiltration from undetected compromise\n- Integrity: unauthorized changes persist longer\n- Availability: resource abuse (e.g., cryptomining) and outages",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/account_alternate_contact",
    "https://docs.prowler.com/checks/aws/iam-policies/iam_19/",
    "https://support.icompaas.com/support/solutions/articles/62000234161-1-2-ensure-security-contact-information-is-registered-manual-",
    "https://www.plerion.com/cloud-knowledge-base/ensure-security-contact-information-is-registered",
    "https://repost.aws/articles/ARDFbpt-bvQ8iuErnqVVcCXQ/managing-aws-organization-alternate-contacts-via-csv"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws account put-alternate-contact --alternate-contact-type SECURITY --email-address <EMAIL_ADDRESS> --name <CONTACT_NAME> --phone-number <PHONE_NUMBER>",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Management Console as the root user or an admin with account:PutAlternateContact\n2. Click your account name (top-right) and select My Account (or Account)\n3. Scroll to Alternate Contacts and click Edit in the Security section\n4. Enter Security Email, Name, and Phone Number\n5. Click Update (or Save changes)",
      "Terraform": "```hcl\n# Set the SECURITY alternate contact for the current AWS account\nresource \"aws_account_alternate_contact\" \"<example_resource_name>\" {\n  alternate_contact_type = \"SECURITY\"  # Critical: sets Security contact type\n  email_address          = \"security@example.com\"  # Contact email\n  name                   = \"Security Team\"         # Contact name\n  phone_number           = \"+1-555-0100\"          # Contact phone\n}\n```"
    },
    "Recommendation": {
      "Text": "Define and maintain a **Security alternate contact**:\n- Use a monitored alias (e.g., `security@domain`) and team phone\n- Apply to every account (prefer Org-wide automation)\n- Review after org/personnel changes and test delivery\n- Document ownership and escalation paths\nAlign with **incident response** and **least privilege** principles.",
      "Url": "https://hub.prowler.com/check/account_security_contact_information_is_registered"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: account_security_contact_information_is_registered.py]---
Location: prowler-master/prowler/providers/aws/services/account/account_security_contact_information_is_registered/account_security_contact_information_is_registered.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.account.account_client import account_client

# This check has no findings since it is manual


class account_security_contact_information_is_registered(Check):
    def execute(self):
        report = Check_Report_AWS(metadata=self.metadata(), resource={})
        report.region = account_client.region
        report.resource_id = account_client.audited_account
        report.resource_arn = account_client.audited_account_arn
        report.status = "MANUAL"
        report.status_extended = "Login to the AWS Console. Choose your account name on the top right of the window -> My Account -> Alternate Contacts -> Security Section."
        return [report]
```

--------------------------------------------------------------------------------

---[FILE: account_security_questions_are_registered_in_the_aws_account.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/account/account_security_questions_are_registered_in_the_aws_account/account_security_questions_are_registered_in_the_aws_account.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "account_security_questions_are_registered_in_the_aws_account",
  "CheckTitle": "[DEPRECATED] AWS root user has security challenge questions configured",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "account",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "[DEPRECATED] **AWS account root** configuration may include legacy **security challenge questions** for support identity verification. This evaluates whether those questions are set on the account. *New configuration is discontinued by AWS and remaining support for this feature is time-limited.*",
  "Risk": "Absence of these questions can limit support-assisted recovery if root credentials or MFA are lost, reducing **availability** and slowing **incident response**. Reliance on KBA also weakens **confidentiality** due to **social engineering**. Treat this as a recovery gap and adopt stronger, phishing-resistant factors.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.prowler.com/checks/aws/iam-policies/iam_15",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/IAM/security-challenge-questions.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Sign in to the AWS Management Console\n2. Navigate to your AWS account settings page at https://console.aws.amazon.com/billing/home?#/account/\n3. Scroll down to Configure Security Challenge Questions section and click the Edit link\n4. Select three different questions made available by Amazon and provide appropriate answers\n5. Store the answers in a secure but accessible location\n6. Click the Update button to save the changes",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Favor stronger recovery instead of KBA:\n- Enforce **MFA for root** and minimize root use\n- Keep **alternate contacts** and root email current and protected\n- Establish a tightly controlled **break-glass role**, applying least privilege and separation of duties\n- Document and test recovery procedures; monitor root activity",
      "Url": "https://hub.prowler.com/check/account_security_questions_are_registered_in_the_aws_account"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: account_security_questions_are_registered_in_the_aws_account.py]---
Location: prowler-master/prowler/providers/aws/services/account/account_security_questions_are_registered_in_the_aws_account/account_security_questions_are_registered_in_the_aws_account.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.account.account_client import account_client

# This check has no findings since it is manual


class account_security_questions_are_registered_in_the_aws_account(Check):
    def execute(self):
        report = Check_Report_AWS(metadata=self.metadata(), resource={})
        report.region = account_client.region
        report.resource_id = account_client.audited_account
        report.resource_arn = account_client.audited_account_arn
        report.status = "MANUAL"
        report.status_extended = "Login to the AWS Console as root. Choose your account name on the top right of the window -> My Account -> Configure Security Challenge Questions."
        return [report]
```

--------------------------------------------------------------------------------

---[FILE: acm_client.py]---
Location: prowler-master/prowler/providers/aws/services/acm/acm_client.py

```python
from prowler.providers.aws.services.acm.acm_service import ACM
from prowler.providers.common.provider import Provider

acm_client = ACM(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: acm_service.py]---
Location: prowler-master/prowler/providers/aws/services/acm/acm_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ACM(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.certificates = {}
        self.__threading_call__(self._list_certificates)
        self.__threading_call__(self._describe_certificates, self.certificates.values())
        self.__threading_call__(
            self._list_tags_for_certificate, self.certificates.values()
        )

    def _list_certificates(self, regional_client):
        logger.info("ACM - Listing Certificates...")
        try:
            includes = {
                "keyTypes": [
                    "RSA_1024",
                    "RSA_2048",
                    "RSA_3072",
                    "RSA_4096",
                    "EC_prime256v1",
                    "EC_secp384r1",
                    "EC_secp521r1",
                ]
            }
            list_certificates_paginator = regional_client.get_paginator(
                "list_certificates"
            )
            for page in list_certificates_paginator.paginate(Includes=includes):
                for certificate in page["CertificateSummaryList"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            certificate["CertificateArn"], self.audit_resources
                        )
                    ):
                        if "NotAfter" in certificate:
                            # We need to get the TZ info to be able to do the math
                            certificate_expiration_time = (
                                certificate["NotAfter"]
                                - datetime.now(
                                    certificate["NotAfter"].tzinfo
                                    if hasattr(certificate["NotAfter"], "tzinfo")
                                    else None
                                )
                            ).days
                        else:
                            certificate_expiration_time = 0
                        self.certificates[certificate["CertificateArn"]] = Certificate(
                            arn=certificate["CertificateArn"],
                            name=certificate.get("DomainName", ""),
                            id=certificate["CertificateArn"].split("/")[-1],
                            type=certificate["Type"],
                            key_algorithm=certificate["KeyAlgorithm"],
                            expiration_days=certificate_expiration_time,
                            in_use=certificate.get("InUse", False),
                            transparency_logging=False,
                            region=regional_client.region,
                        )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_certificates(self, certificate):
        logger.info("ACM - Describing Certificates...")
        try:
            regional_client = self.regional_clients[certificate.region]
            response = regional_client.describe_certificate(
                CertificateArn=certificate.arn
            )["Certificate"]
            if (
                response["Options"]["CertificateTransparencyLoggingPreference"]
                == "ENABLED"
            ):
                certificate.transparency_logging = True
        except Exception as error:
            logger.error(
                f"{certificate.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_certificate(self, certificate):
        logger.info("ACM - List Tags...")
        try:
            regional_client = self.regional_clients[certificate.region]
            response = regional_client.list_tags_for_certificate(
                CertificateArn=certificate.arn
            )["Tags"]
            certificate.tags = response
        except Exception as error:
            logger.error(
                f"{certificate.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Certificate(BaseModel):
    arn: str
    name: str
    id: str
    type: str
    key_algorithm: str
    tags: Optional[list] = []
    expiration_days: int
    in_use: bool
    transparency_logging: Optional[bool] = None
    region: str
```

--------------------------------------------------------------------------------

---[FILE: acm_certificates_expiration_check.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/acm/acm_certificates_expiration_check/acm_certificates_expiration_check.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "acm_certificates_expiration_check",
  "CheckTitle": "ACM certificate expires in more than the configured threshold of days",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "acm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCertificateManagerCertificate",
  "Description": "**ACM certificates** are assessed for **time to expiration** against a configurable threshold. Certificates close to end of validity or already expired are surfaced, covering those attached to services and, *if in scope*, unused ones.",
  "Risk": "Expired or near-expiry **TLS certificates** can break handshakes, causing **service outages** and failed API calls (**availability**). Emergency fixes raise misconfiguration risk, enabling disabled verification or weak ciphers, which allows **MITM** and data exposure (**confidentiality**/**integrity**).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ACM/certificate-expires-in-45-days.html",
    "https://repost.aws/es/knowledge-center/acm-notification-certificate-renewal",
    "https://docs.aws.amazon.com/config/latest/developerguide/acm-certificate-expiration-check.html",
    "https://repost.aws/questions/QU3sMaeZPMRo2kLcsfJsfuVA/acm-notifications-for-expiring-certificates"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, open Certificate Manager (ACM)\n2. If the expiring certificate is ACM-issued: select it and complete/restore validation (Create records in Route 53 or add the shown CNAME) so renewal can proceed\n3. If the expiring certificate is imported: click Import a certificate, upload the new certificate and private key, then save\n4. Update the service to use the new/renewed certificate:\n   - ALB/NLB: EC2 > Load Balancers > Listeners > Edit > Change certificate to the new ACM certificate\n   - CloudFront: Distributions > Edit > Viewer certificate > Select the new ACM certificate\n   - API Gateway: Custom domain names > Edit > Choose the new ACM certificate\n5. Verify the old certificate is no longer in use; delete it if not needed",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Adopt **automated certificate lifecycle management**: prefer **ACM-issued certs with auto-renewal**, or integrate imports with an automated renewal/rotation pipeline. Track expirations with alerts, enforce **least privilege** for cert operations, remove unused certs, and test rollovers to avoid downtime.",
      "Url": "https://hub.prowler.com/check/acm_certificates_expiration_check"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: acm_certificates_expiration_check.py]---
Location: prowler-master/prowler/providers/aws/services/acm/acm_certificates_expiration_check/acm_certificates_expiration_check.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS, Severity
from prowler.providers.aws.services.acm.acm_client import acm_client


class acm_certificates_expiration_check(Check):
    def execute(self):
        findings = []
        for certificate in acm_client.certificates.values():
            if certificate.in_use or acm_client.provider.scan_unused_services:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=certificate
                )
                if certificate.expiration_days > acm_client.audit_config.get(
                    "days_to_expire_threshold", 7
                ):
                    report.status = "PASS"
                    report.status_extended = f"ACM Certificate {certificate.id} for {certificate.name} expires in {certificate.expiration_days} days."
                else:
                    report.status = "FAIL"
                    if certificate.expiration_days < 0:
                        report.status_extended = f"ACM Certificate {certificate.id} for {certificate.name} has expired ({abs(certificate.expiration_days)} days ago)."
                        report.check_metadata.Severity = Severity.high
                    else:
                        report.status_extended = f"ACM Certificate {certificate.id} for {certificate.name} is about to expire in {certificate.expiration_days} days."
                        report.check_metadata.Severity = Severity.medium
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: acm_certificates_transparency_logs_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/acm/acm_certificates_transparency_logs_enabled/acm_certificates_transparency_logs_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "acm_certificates_transparency_logs_enabled",
  "CheckTitle": "ACM certificate is imported or has Certificate Transparency logging enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "acm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsCertificateManagerCertificate",
  "Description": "**ACM-issued certificates** are checked for **Certificate Transparency (CT) logging** being enabled. Certificates with type `IMPORTED` are excluded from evaluation.",
  "Risk": "Disabling **CT logging** reduces visibility into **misissued or rogue certificates**, weakening confidentiality and integrity. Attackers can **impersonate sites** or run **TLS man-in-the-middle** without timely detection. Unlogged public certs may be distrusted by browsers, impacting availability and user trust.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/blogs/security/how-to-get-ready-for-certificate-transparency/",
    "https://support.icompaas.com/support/solutions/articles/62000129491-ensure-acm-certificates-have-certificate-transparency-logging-enabled"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws acm update-certificate-options --certificate-arn <CERTIFICATE_ARN> --options CertificateTransparencyLoggingPreference=ENABLED",
      "NativeIaC": "```yaml\n# CloudFormation: Enable Certificate Transparency logging on an ACM certificate\nResources:\n  <example_resource_name>:\n    Type: AWS::CertificateManager::Certificate\n    Properties:\n      DomainName: <example_domain_name>\n      CertificateTransparencyLoggingPreference: ENABLED  # Critical: turns on CT logging to pass the check\n```",
      "Other": "1. Open the AWS Certificate Manager (ACM) console\n2. Select the certificate with transparency logging disabled\n3. Click Actions > Edit transparency logging\n4. Choose Enable transparency logging\n5. Click Save",
      "Terraform": "```hcl\n# Enable Certificate Transparency logging on an ACM certificate\nresource \"aws_acm_certificate\" \"<example_resource_name>\" {\n  domain_name = \"<example_domain_name>\"\n  options {\n    certificate_transparency_logging_preference = \"ENABLED\"  # Critical: turns on CT logging to pass the check\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **CT logging** on all ACM-issued public certificates to maintain transparency and rapid revocation.\n\nMonitor CT logs for your domains and alert on unexpected issuances. For sensitive internal names, favor private PKI or non-public hostnames instead of disabling CT, and apply **defense in depth** with short certificate lifetimes.",
      "Url": "https://hub.prowler.com/check/acm_certificates_transparency_logs_enabled"
    }
  },
  "Categories": [
    "logging"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: acm_certificates_transparency_logs_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/acm/acm_certificates_transparency_logs_enabled/acm_certificates_transparency_logs_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.acm.acm_client import acm_client


class acm_certificates_transparency_logs_enabled(Check):
    def execute(self):
        findings = []
        for certificate in acm_client.certificates.values():
            if certificate.in_use or acm_client.provider.scan_unused_services:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=certificate
                )
                if certificate.type == "IMPORTED":
                    report.status = "PASS"
                    report.status_extended = f"ACM Certificate {certificate.id} for {certificate.name} is imported."
                else:
                    if not certificate.transparency_logging:
                        report.status = "FAIL"
                        report.status_extended = f"ACM Certificate {certificate.id} for {certificate.name} has Certificate Transparency logging disabled."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"ACM Certificate {certificate.id} for {certificate.name} has Certificate Transparency logging enabled."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: acm_certificates_with_secure_key_algorithms.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/acm/acm_certificates_with_secure_key_algorithms/acm_certificates_with_secure_key_algorithms.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "acm_certificates_with_secure_key_algorithms",
  "CheckTitle": "ACM certificate uses a secure key algorithm",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)"
  ],
  "ServiceName": "acm",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsCertificateManagerCertificate",
  "Description": "**ACM certificates** are evaluated for the **public key algorithm and size**, identifying those that use weak parameters such as `RSA-1024` or ECDSA `P-192`. Certificates using `RSA-2048+` or ECDSA `P-256+` meet the secure baseline.",
  "Risk": "**Weak certificate keys** reduce TLS confidentiality and authenticity.\n\nFeasible factoring or discrete log attacks can reveal private keys, enabling **man-in-the-middle**, session decryption, and **certificate spoofing**, leading to data exposure and tampering.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://noise.getoto.net/2022/11/08/how-to-evaluate-and-use-ecdsa-certificates-in-aws-certificate-manager/",
	"https://docs.aws.amazon.com/acm/latest/userguide/data-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: ACM certificate with secure key algorithm\nResources:\n  <example_resource_name>:\n    Type: AWS::CertificateManager::Certificate\n    Properties:\n      DomainName: <example_domain>\n      KeyAlgorithm: EC_prime256v1  # CRITICAL: ensures a secure key algorithm (RSA-2048+ or ECDSA P-256+)\n```",
      "Other": "1. In the AWS Console, go to Certificate Manager (ACM)\n2. Click Request a certificate and enter <example_domain>\n3. Under Key algorithm, select ECDSA P-256 (or RSA 2048)\n4. Complete validation (DNS is recommended)\n5. In the service using the certificate (e.g., ALB/CloudFront/API Gateway), replace the old certificate with the new one\n6. Delete the insecure certificate (e.g., RSA-1024 or P-192) once no longer in use.",
      "Terraform": "```hcl\n# Terraform: ACM certificate with secure key algorithm\nresource \"aws_acm_certificate\" \"<example_resource_name>\" {\n  domain_name   = \"<example_domain>\"\n  key_algorithm = \"EC_prime256v1\"  # CRITICAL: ensures a secure key algorithm (RSA-2048+ or ECDSA P-256+)\n}\n```"
    },
    "Recommendation": {
      "Text": "Use **strong algorithms**: `RSA-2048+` or ECDSA `P-256/P-384`. Replace weak or legacy certificates and prevent their use via policy.\n\nPrefer ECDSA where compatible, apply **least privilege** to private keys, enforce modern TLS policies, and automate renewal to maintain cryptographic strength.",
      "Url": "https://hub.prowler.com/check/acm_certificates_with_secure_key_algorithms"
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

---[FILE: acm_certificates_with_secure_key_algorithms.py]---
Location: prowler-master/prowler/providers/aws/services/acm/acm_certificates_with_secure_key_algorithms/acm_certificates_with_secure_key_algorithms.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.acm.acm_client import acm_client


class acm_certificates_with_secure_key_algorithms(Check):
    def execute(self):
        findings = []
        for certificate in acm_client.certificates.values():
            if certificate.in_use or acm_client.provider.scan_unused_services:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=certificate
                )

                report.status = "PASS"
                report.status_extended = f"ACM Certificate {certificate.id} for {certificate.name} uses a secure key algorithm ({certificate.key_algorithm})."
                if certificate.key_algorithm in acm_client.audit_config.get(
                    "insecure_key_algorithms", ["RSA-1024", "P-192"]
                ):
                    report.status = "FAIL"
                    report.status_extended = f"ACM Certificate {certificate.id} for {certificate.name} does not use a secure key algorithm ({certificate.key_algorithm})."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: apigateway_client.py]---
Location: prowler-master/prowler/providers/aws/services/apigateway/apigateway_client.py

```python
from prowler.providers.aws.services.apigateway.apigateway_service import APIGateway
from prowler.providers.common.provider import Provider

apigateway_client = APIGateway(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
