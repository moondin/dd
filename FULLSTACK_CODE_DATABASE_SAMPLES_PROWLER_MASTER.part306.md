---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 306
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 306 of 867)

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

---[FILE: opensearch_service_domains_encryption_at_rest_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_encryption_at_rest_enabled/opensearch_service_domains_encryption_at_rest_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_encryption_at_rest_enabled",
  "CheckTitle": "Check if Amazon Elasticsearch/Opensearch Service domains have encryption at-rest enabled",
  "CheckType": [
    "Protect",
    "Data protection",
    "Encryption of data at rest"
  ],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "Check if Amazon Elasticsearch/Opensearch Service domains have encryption at-rest enabled",
  "Risk": "If not enable unauthorized access to your data could risk increases.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws es update-elasticsearch-domain-config --domain-name <DOMAIN_NAME> --encryption-at-rest-options Enabled=true,KmsKeyId=<KMS_KEY_ID>",
      "NativeIaC": "https://docs.prowler.com/checks/aws/elasticsearch-policies/elasticsearch_3-enable-encryptionatrest#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Elasticsearch/encryption-at-rest.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable encryption at rest using AWS KMS to store and manage your encryption keys and the Advanced Encryption Standard algorithm with 256-bit keys (AES-256) to perform the encryption.",
      "Url": "https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/encryption-at-rest.html"
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

---[FILE: opensearch_service_domains_encryption_at_rest_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_encryption_at_rest_enabled/opensearch_service_domains_encryption_at_rest_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_encryption_at_rest_enabled(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "PASS"
            report.status_extended = (
                f"Opensearch domain {domain.name} has encryption at-rest enabled."
            )
            if not domain.encryption_at_rest:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} does not have encryption at-rest enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_fault_tolerant_data_nodes.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_fault_tolerant_data_nodes/opensearch_service_domains_fault_tolerant_data_nodes.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_fault_tolerant_data_nodes",
  "CheckTitle": "Ensure Elasticsearch/Opensearch domains have fault-tolerant data nodes.",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:es:{region}:{account-id}:domain/{domain-name}",
  "Severity": "medium",
  "ResourceType": "AwsElasticsearchDomain",
  "Description": "This control checks whether Elasticsearch/Opensearch domains are fault-tolerant with at least three data nodes and cross-zone replication (Zone Awareness) enabled.",
  "Risk": "Without at least three data nodes and without cross-zone replication (Zone Awareness), the Elasticsearch/Opensearch domain may not be fault-tolerant, leading to a higher risk of data loss or unavailability in case of node failure.",
  "RelatedUrl": "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html",
  "Remediation": {
    "Code": {
      "CLI": "aws opensearch update-domain-config --domain-name <domain-name> --cluster-config InstanceCount=3,ZoneAwarenessEnabled=true",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/es-controls.html#es-6",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the Elasticsearch/Opensearch domain to ensure at least three data nodes and enable cross-zone replication (Zone Awareness) for high availability and fault tolerance.",
      "Url": "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html"
    }
  },
  "Categories": [
    "redundancy"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_fault_tolerant_data_nodes.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_fault_tolerant_data_nodes/opensearch_service_domains_fault_tolerant_data_nodes.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_fault_tolerant_data_nodes(Check):
    def execute(self):
        findings = []

        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)

            report.status = "FAIL"
            report.status_extended = f"Opensearch domain {domain.name} is not fault tolerant as it has less than 3 data nodes and cross-zone replication (Zone Awareness) is not enabled."

            if domain.instance_count >= 3 and domain.zone_awareness_enabled:
                report.status = "PASS"
                report.status_extended = f"Opensearch domain {domain.name} is fault tolerant with {domain.instance_count} data nodes and cross-zone replication (Zone Awareness) enabled."
            elif domain.instance_count >= 3 and not domain.zone_awareness_enabled:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} is not fault tolerant as it has {domain.instance_count} data nodes, but cross-zone replication (Zone Awareness) is not enabled."
            elif domain.instance_count < 3 and domain.zone_awareness_enabled:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} is not fault tolerant as it has cross-zone replication (Zone Awareness) enabled, but only {domain.instance_count} data nodes."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_fault_tolerant_master_nodes.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_fault_tolerant_master_nodes/opensearch_service_domains_fault_tolerant_master_nodes.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_fault_tolerant_master_nodes",
  "CheckTitle": "OpenSearch Service Domain should have at least three dedicated master nodes",
  "CheckType": [],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:es:region:account-id:domain/resource-id",
  "Severity": "medium",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "OpenSearch Service uses dedicated master nodes to increase cluster stability. A minimum of three dedicated master nodes is recommended to ensure high availability.",
  "Risk": "If a master node fails, the cluster may become unavailable.",
  "RelatedUrl": "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-dedicatedmasternodes.html#dedicatedmasternodes-number",
  "Remediation": {
    "Code": {
      "CLI": "aws es update-elasticsearch-domain-config --region <region> --domain-name <name> --elasticsearch-cluster-config DedicatedMasterEnabled=true,DedicatedMasterType='<instance_type>',DedicatedMasterCount=3",
      "NativeIaC": "",
      "Other": "https://docs.aws.amazon.com/securityhub/latest/userguide/opensearch-controls.html#opensearch-11",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that your OpenSearch Service domain has at least three dedicated master nodes",
      "Url": "https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-dedicatedmasternodes.html#dedicatedmasternodes-number"
    }
  },
  "Categories": [
    "redundancy"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_fault_tolerant_master_nodes.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_fault_tolerant_master_nodes/opensearch_service_domains_fault_tolerant_master_nodes.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_fault_tolerant_master_nodes(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "PASS"
            report.status_extended = f"Opensearch domain {domain.name} has {domain.dedicated_master_count} dedicated master nodes, which guarantees fault tolerance on the master nodes."

            if not getattr(domain, "dedicated_master_enabled", False):
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} has dedicated master nodes disabled."
            elif domain.dedicated_master_count < 3:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} does not have at least 3 dedicated master nodes."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_https_communications_enforced.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_https_communications_enforced/opensearch_service_domains_https_communications_enforced.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_https_communications_enforced",
  "CheckTitle": "Check if Amazon Elasticsearch/Opensearch Service domains have enforce HTTPS enabled",
  "CheckType": [
    "Protect",
    "Data protection",
    "Encryption of data in transit"
  ],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "Check if Amazon Elasticsearch/Opensearch Service domains have enforce HTTPS enabled",
  "Risk": "If not enable unauthorized access to your data could risk increases.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "https://docs.prowler.com/checks/aws/elasticsearch-policies/elasticsearch_6#fix---builtime",
      "Other": "https://docs.prowler.com/checks/aws/elasticsearch-policies/elasticsearch_6#aws-console",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "When creating ES Domains, enable 'Require HTTPS fo all traffic to the domain'",
      "Url": "https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-createupdatedomains.html"
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

---[FILE: opensearch_service_domains_https_communications_enforced.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_https_communications_enforced/opensearch_service_domains_https_communications_enforced.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_https_communications_enforced(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "PASS"
            report.status_extended = (
                f"Opensearch domain {domain.name} has enforce HTTPS enabled."
            )
            if not domain.enforce_https:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} does not have enforce HTTPS enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_internal_user_database_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_internal_user_database_enabled/opensearch_service_domains_internal_user_database_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_internal_user_database_enabled",
  "CheckTitle": "Check if Amazon Elasticsearch/Opensearch Service domains have internal user database enabled",
  "CheckType": [
    "Protect",
    "Data protection"
  ],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "Check if Amazon Elasticsearch/Opensearch Service domains have internal user database enabled",
  "Risk": "Internal User Database is convenient for demos, for production environment use Federated authentication.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Remove users from internal user database and uso Cognito instead.",
      "Url": "https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/fgac.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_internal_user_database_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_internal_user_database_enabled/opensearch_service_domains_internal_user_database_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_internal_user_database_enabled(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "PASS"
            report.status_extended = f"Opensearch domain {domain.name} does not have internal user database enabled."
            if domain.internal_user_database:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} has internal user database enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_node_to_node_encryption_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_node_to_node_encryption_enabled/opensearch_service_domains_node_to_node_encryption_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_node_to_node_encryption_enabled",
  "CheckTitle": "Check if Amazon Elasticsearch/Opensearch Service domains have node-to-node encryption enabled",
  "CheckType": [
    "Protect",
    "Data protection",
    "Encryption of data in transit"
  ],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "medium",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "Check if Amazon Elasticsearch/Opensearch Service domains have node-to-node encryption enabled",
  "Risk": "Node-to-node encryption provides an additional layer of security on top of the default features of Amazon ES. This architecture prevents potential attackers from intercepting traffic between Elasticsearch nodes and keeps the cluster secure.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws es update-elasticsearch-domain-config --domain-name <DOMAIN_NAME> --node-to-node-encryption-options Enabled=true",
      "NativeIaC": "https://docs.prowler.com/checks/aws/elasticsearch-policies/elasticsearch_5#cloudformation",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Elasticsearch/node-to-node-encryption.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Node-to-node encryption on new domains requires Elasticsearch 6.0 or later. Enabling the feature on existing domains requires Elasticsearch 6.7 or later. Choose the existing domain in the AWS console, Actions, and Modify encryption.",
      "Url": "https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/ntn.html"
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

---[FILE: opensearch_service_domains_node_to_node_encryption_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_node_to_node_encryption_enabled/opensearch_service_domains_node_to_node_encryption_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_node_to_node_encryption_enabled(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "PASS"
            report.status_extended = (
                f"Opensearch domain {domain.name} has node-to-node encryption enabled."
            )
            if not domain.node_to_node_encryption:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} does not have node-to-node encryption enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_not_publicly_accessible/opensearch_service_domains_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "opensearch_service_domains_not_publicly_accessible",
  "CheckTitle": "Check if Amazon Opensearch/Elasticsearch domains are publicly accessible",
  "CheckType": [
    "Effects/Data Exposure"
  ],
  "ServiceName": "opensearch",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service:region:account-id:resource-id",
  "Severity": "critical",
  "ResourceType": "AwsOpenSearchServiceDomain",
  "Description": "Check if Amazon Opensearch/Elasticsearch domains are publicly accessible via their access policies.",
  "Risk": "Publicly accessible services could expose sensitive data to bad actors.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Elasticsearch/domain-exposed.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Modify the access policy attached to your Amazon OpenSearch domain and replace the 'Principal' element value (i.e. '*') with the ARN of the trusted AWS account. You can also add a Condition clause to the policy statement to limit the domain access to a specific (trusted) IP address/IP range only.",
      "Url": "https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-vpc.html"
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

---[FILE: opensearch_service_domains_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_not_publicly_accessible/opensearch_service_domains_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_policy_public
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "PASS"
            report.status_extended = (
                f"Opensearch domain {domain.name} is not publicly accessible."
            )

            if domain.vpc_id:
                report.status_extended = f"Opensearch domain {domain.name} is in a VPC, then it is not publicly accessible."
            elif domain.access_policy is not None and is_policy_public(
                domain.access_policy, opensearch_client.audited_account
            ):
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} is publicly accessible via access policy."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: opensearch_service_domains_not_publicly_accessible_fixer.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_not_publicly_accessible/opensearch_service_domains_not_publicly_accessible_fixer.py

```python
from prowler.lib.logger import logger
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


def fixer(resource_id: str, region: str) -> bool:
    """
    Modify the OpenSearch domain's resource-based policy to remove public access.
    Specifically, this fixer update the domain config and add an empty policy to remove the old one.
    Requires the es:UpdateDomainConfig permission.
    Permissions:
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "es:UpdateDomainConfig",
                "Resource": "*"
            }
        ]
    }
    Args:
        resource_id (str): The OpenSearch domain name.
        region (str): AWS region where the OpenSearch domain exists.
    Returns:
        bool: True if the operation is successful (policy updated), False otherwise.
    """
    try:
        regional_client = opensearch_client.regional_clients[region]

        regional_client.update_domain_config(
            DomainName=resource_id,
            AccessPolicies="",
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

---[FILE: opensearch_service_domains_use_cognito_authentication_for_kibana.py]---
Location: prowler-master/prowler/providers/aws/services/opensearch/opensearch_service_domains_use_cognito_authentication_for_kibana/opensearch_service_domains_use_cognito_authentication_for_kibana.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.opensearch.opensearch_client import (
    opensearch_client,
)


class opensearch_service_domains_use_cognito_authentication_for_kibana(Check):
    def execute(self):
        findings = []
        for domain in opensearch_client.opensearch_domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            report.status = "PASS"
            report.status_extended = f"Opensearch domain {domain.name} has either Amazon Cognito or SAML authentication for Kibana enabled."
            if not domain.cognito_options and not domain.saml_enabled:
                report.status = "FAIL"
                report.status_extended = f"Opensearch domain {domain.name} has neither Amazon Cognito nor SAML authentication for Kibana enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_client.py]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_client.py

```python
from prowler.providers.aws.services.organizations.organizations_service import (
    Organizations,
)
from prowler.providers.common.provider import Provider

organizations_client = Organizations(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: organizations_service.py]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_service.py
Signals: Pydantic

```python
import json
from typing import Optional

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService

AVAILABLE_ORGANIZATIONS_POLICIES = [
    "SERVICE_CONTROL_POLICY",
    "TAG_POLICY",
    "BACKUP_POLICY",
    "AISERVICES_OPT_OUT_POLICY",
]


class Organizations(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.organization = None
        self.policies = {}
        self.delegated_administrators = []
        self._describe_organization()

    def _describe_organization(self):
        logger.info("Organizations - Describe Organization...")

        try:
            try:
                organization_desc = self.client.describe_organization()["Organization"]
                organization_arn = organization_desc.get("Arn")
                organization_id = organization_desc.get("Id")
                organization_master_id = organization_desc.get("MasterAccountId")
                organization_policies = self._list_policies()
                organization_delegated_administrator = (
                    self._list_delegated_administrators()
                )
            except ClientError as error:
                if (
                    error.response["Error"]["Code"]
                    == "AWSOrganizationsNotInUseException"
                ):
                    self.organization = Organization(
                        arn=self.get_unknown_arn(),
                        id="unknown",
                        status="NOT_AVAILABLE",
                        master_id="",
                    )
                else:
                    logger.error(
                        f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
            else:
                if not self.audit_resources or (
                    is_resource_filtered(organization_arn, self.audit_resources)
                ):
                    self.organization = Organization(
                        arn=organization_arn,
                        id=organization_id,
                        status="ACTIVE",
                        master_id=organization_master_id,
                        policies=organization_policies,
                        delegated_administrators=organization_delegated_administrator,
                    )
                else:
                    self.organization = Organization(
                        arn=self.get_unknown_arn(),
                        id="unknown",
                        status="NOT_AVAILABLE",
                        master_id="",
                    )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_policies(self):
        logger.info("Organizations - List policies...")

        try:
            list_policies_paginator = self.client.get_paginator("list_policies")
            policies = {}
            for policy_type in AVAILABLE_ORGANIZATIONS_POLICIES:
                logger.info(
                    "Organizations - List policies... - Type: %s",
                    policy_type,
                )
                policies[policy_type] = []
                for page in list_policies_paginator.paginate(Filter=policy_type):
                    for policy in page["Policies"]:
                        policy_id = policy.get("Id")
                        policy_content = self._describe_policy(policy_id)
                        policy_targets = self._list_targets_for_policy(policy_id)
                        policies[policy_type].append(
                            Policy(
                                arn=policy.get("Arn"),
                                id=policy_id,
                                type=policy.get("Type"),
                                aws_managed=policy.get("AwsManaged"),
                                content=policy_content,
                                targets=policy_targets,
                            )
                        )

        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDeniedException":
                policies = None
                logger.warning(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            else:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        finally:
            return policies

    def _describe_policy(self, policy_id) -> dict:
        logger.info("Organizations - Describe policy: %s ...", policy_id)
        try:
            policy_content = {}
            if policy_id:
                policy_content = (
                    self.client.describe_policy(PolicyId=policy_id)
                    .get("Policy", {})
                    .get("Content", "")
                )
                if isinstance(policy_content, str):
                    policy_content = json.loads(policy_content)

            return policy_content
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return {}

    def _list_targets_for_policy(self, policy_id) -> list:
        logger.info("Organizations - List Targets for policy: %s ...", policy_id)

        try:
            targets_for_policy = []
            if policy_id:
                targets_for_policy = self.client.list_targets_for_policy(
                    PolicyId=policy_id
                )["Targets"]

            return targets_for_policy

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return []

    def _list_delegated_administrators(self):
        logger.info("Organizations - List Delegated Administrators...")

        try:
            list_delegated_administrators_paginator = self.client.get_paginator(
                "list_delegated_administrators"
            )
            for page in list_delegated_administrators_paginator.paginate():
                for delegated_administrator in page["DelegatedAdministrators"]:
                    self.delegated_administrators.append(
                        DelegatedAdministrator(
                            arn=delegated_administrator.get("Arn"),
                            id=delegated_administrator.get("Id"),
                            name=delegated_administrator.get("Name"),
                            email=delegated_administrator.get("Email"),
                            status=delegated_administrator.get("Status"),
                            joinedmethod=delegated_administrator.get("JoinedMethod"),
                        )
                    )

        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDeniedException":
                self.delegated_administrators = None

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        finally:
            return self.delegated_administrators


class Policy(BaseModel):
    arn: str
    id: str
    type: str
    aws_managed: bool
    content: dict = {}
    targets: Optional[list] = []


class DelegatedAdministrator(BaseModel):
    arn: str
    id: str
    name: str
    email: str
    status: str
    joinedmethod: str


class Organization(BaseModel):
    arn: str
    id: str
    status: str
    master_id: str
    policies: Optional[dict[str, list[Policy]]] = {}
    delegated_administrators: list[DelegatedAdministrator] = None
```

--------------------------------------------------------------------------------

---[FILE: organizations_account_part_of_organizations.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_account_part_of_organizations/organizations_account_part_of_organizations.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "organizations_account_part_of_organizations",
  "CheckTitle": "Check if account is part of an AWS Organizations",
  "CheckType": [
    "Logging and Monitoring"
  ],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service::account-id:organization/organization-id",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Ensure that AWS Organizations service is currently in use.",
  "Risk": "The risk associated with not being part of an AWS Organizations is that it can lead to a lack of centralized management and control over the AWS accounts in an organization. This can make it difficult to enforce security policies consistently across all accounts, and can also result in increased costs due to inefficiencies in resource usage. Additionally, not being part of an AWS Organizations can make it harder to track and manage account usage and access.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create or Join an AWS Organization",
      "Url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_org_create.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: organizations_account_part_of_organizations.py]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_account_part_of_organizations/organizations_account_part_of_organizations.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.organizations.organizations_client import (
    organizations_client,
)


class organizations_account_part_of_organizations(Check):
    def execute(self):
        findings = []
        if organizations_client.organization:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource=organizations_client.organization,
            )
            if organizations_client.organization.status == "ACTIVE":
                report.status = "PASS"
                report.status_extended = f"AWS Organization {organizations_client.organization.id} contains this AWS account."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    "AWS Organizations is not in-use for this AWS Account."
                )
            report.region = organizations_client.region
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: organizations_delegated_administrators.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/organizations/organizations_delegated_administrators/organizations_delegated_administrators.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "organizations_delegated_administrators",
  "CheckTitle": "Check if AWS Organizations delegated administrators are trusted",
  "CheckType": [
    "Logging and Monitoring"
  ],
  "ServiceName": "organizations",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:partition:service::account-id:organization/organization-id",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "This check verify if there are AWS Organizations delegated administrators and if they are trusted (you can define your trusted delegated administrator in Prowler configuration)",
  "Risk": "The risk associated with having untrusted delegated administrators within an AWS Organizations is that they may have the ability to access and make changes to sensitive data and resources within an organization's AWS accounts. This can result in unauthorized access or data breaches, which can lead to financial losses, damage to reputation, and legal liabilities. It's important to carefully vet and monitor AWS Organizations delegated administrators to ensure that they are trustworthy and have a legitimate need for access to the organization's resources.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review delegated administrators",
      "Url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_delegate_policies.html"
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
