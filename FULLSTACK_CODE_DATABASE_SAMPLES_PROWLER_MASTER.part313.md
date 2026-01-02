---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 313
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 313 of 867)

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

---[FILE: redshift_cluster_public_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_public_access/redshift_cluster_public_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "redshift_cluster_public_access",
  "CheckTitle": "Check for Publicly Accessible Redshift Clusters",
  "CheckType": [],
  "ServiceName": "redshift",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:redshift:region:account-id:cluster:cluster-name",
  "Severity": "high",
  "ResourceType": "AwsRedshiftCluster",
  "Description": "Check for Publicly Accessible Redshift Clusters",
  "Risk": "Publicly accessible services could expose sensitive data to bad actors.",
  "RelatedUrl": "https://docs.aws.amazon.com/redshift/latest/mgmt/managing-clusters-vpc.html",
  "Remediation": {
    "Code": {
      "CLI": "aws redshift modify-cluster --cluster-identifier <CLUSTER_ID> --no-publicly-accessible",
      "NativeIaC": "https://docs.prowler.com/checks/aws/public-policies/public_9#cloudformation",
      "Other": "https://docs.prowler.com/checks/aws/public-policies/public_9",
      "Terraform": "https://docs.prowler.com/checks/aws/public-policies/public_9#terraform"
    },
    "Recommendation": {
      "Text": "List all shared Redshift clusters and make sure there is a business reason for them.",
      "Url": "https://docs.aws.amazon.com/redshift/latest/mgmt/managing-clusters-vpc.html"
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

---[FILE: redshift_cluster_public_access.py]---
Location: prowler-master/prowler/providers/aws/services/redshift/redshift_cluster_public_access/redshift_cluster_public_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.redshift.redshift_client import redshift_client
from prowler.providers.aws.services.vpc.vpc_client import vpc_client


class redshift_cluster_public_access(Check):
    def execute(self):
        findings = []
        for cluster in redshift_client.clusters:
            report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = (
                f"Redshift Cluster {cluster.id} is not publicly accessible."
            )
            # 1. Check if Redshift Cluster is publicly accessible
            if cluster.endpoint_address and cluster.public_access:
                report.status_extended = f"Redshift Cluster {cluster.id} has the endpoint {cluster.endpoint_address} set as publicly accessible but is not publicly exposed."
                # 2. Check if Redshift Cluster is in a public subnet
                if any(
                    subnet in vpc_client.vpc_subnets
                    and vpc_client.vpc_subnets[subnet].public
                    for subnet in cluster.subnets
                ):
                    report.status_extended = f"Redshift Cluster {cluster.id} has the endpoint {cluster.endpoint_address} set as publicly accessible in a public subnet but is not publicly exposed."
                    # 3. Check if any Redshift Cluster Security Group is publicly open
                    for sg_id in getattr(cluster, "vpc_security_groups", []):
                        sg_arn = f"arn:{redshift_client.audited_partition}:ec2:{cluster.region}:{redshift_client.audited_account}:security-group/{sg_id}"
                        if sg_arn in ec2_client.security_groups:
                            for ingress_rule in ec2_client.security_groups[
                                sg_arn
                            ].ingress_rules:
                                if check_security_group(
                                    ingress_rule, "tcp", any_address=True
                                ):
                                    report.status = "FAIL"
                                    report.status_extended = f"Redshift Cluster {cluster.id} has the endpoint {cluster.endpoint_address} set as publicly accessible and it is exposed to the Internet by security group ({sg_id}) in a public subnet."
                                    break
                        if report.status == "FAIL":
                            break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: resourceexplorer2_client.py]---
Location: prowler-master/prowler/providers/aws/services/resourceexplorer2/resourceexplorer2_client.py

```python
from prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_service import (
    ResourceExplorer2,
)
from prowler.providers.common.provider import Provider

resource_explorer_2_client = ResourceExplorer2(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: resourceexplorer2_service.py]---
Location: prowler-master/prowler/providers/aws/services/resourceexplorer2/resourceexplorer2_service.py
Signals: Pydantic

```python
from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ResourceExplorer2(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("resource-explorer-2", provider)
        self.index_arn_template = f"arn:{self.audited_partition}:resource-explorer:{self.region}:{self.audited_account}:index"
        self.indexes = []
        self.__threading_call__(self._list_indexes)

    def _list_indexes(self, regional_client):
        logger.info("ResourceExplorer - list indexes...")
        try:
            list_indexes_paginator = regional_client.get_paginator("list_indexes")
            for page in list_indexes_paginator.paginate():
                for index in page.get("Indexes"):
                    if not self.audit_resources or (
                        is_resource_filtered(index["Arn"], self.audit_resources)
                    ):
                        if self.indexes is None:
                            self.indexes = []
                        self.indexes.append(
                            Indexes(
                                arn=index["Arn"],
                                region=index["Region"],
                                type=index["Type"],
                            )
                        )
        except ClientError as error:
            if error.response["Error"]["Code"] == "AccessDeniedException":
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                if not self.indexes:
                    self.indexes = None
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Indexes(BaseModel):
    arn: str
    region: str
    type: str
```

--------------------------------------------------------------------------------

---[FILE: resourceexplorer2_indexes_found.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/resourceexplorer2/resourceexplorer2_indexes_found/resourceexplorer2_indexes_found.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "resourceexplorer2_indexes_found",
  "CheckTitle": "Resource Explorer Indexes Found",
  "CheckType": [],
  "ServiceName": "resourceexplorer2",
  "SubServiceName": "",
  "ResourceIdTemplate": "arn:aws:resource-explorer-2:region:account-id:index/index-id",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "Resource Explorer Indexes Found",
  "Risk": "Not having Resource Explorer indexes can result in increased complexity and overhead in managing your resources, as well as increased risk of security and compliance issues.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create indexes",
      "Url": "https://docs.aws.amazon.com/resource-explorer/latest/userguide/manage-service-turn-on-region.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: resourceexplorer2_indexes_found.py]---
Location: prowler-master/prowler/providers/aws/services/resourceexplorer2/resourceexplorer2_indexes_found/resourceexplorer2_indexes_found.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.resourceexplorer2.resourceexplorer2_client import (
    resource_explorer_2_client,
)


class resourceexplorer2_indexes_found(Check):
    def execute(self):
        findings = []
        if resource_explorer_2_client.indexes is not None:
            report = Check_Report_AWS(
                metadata=self.metadata(),
                resource={},
            )
            report.status = "FAIL"
            report.status_extended = "No Resource Explorer Indexes found."
            report.region = resource_explorer_2_client.region
            report.resource_arn = "NoResourceExplorer"
            report.resource_id = resource_explorer_2_client.audited_account
            report.resource_arn = resource_explorer_2_client.index_arn_template
            if resource_explorer_2_client.indexes:
                report.region = resource_explorer_2_client.indexes[0].region
                report.resource_arn = resource_explorer_2_client.indexes[0].arn
                report.status = "PASS"
                report.status_extended = f"Resource Explorer Indexes found: {len(resource_explorer_2_client.indexes)}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: route53domains_client.py]---
Location: prowler-master/prowler/providers/aws/services/route53/route53domains_client.py

```python
from prowler.providers.aws.services.route53.route53_service import Route53Domains
from prowler.providers.common.provider import Provider

route53domains_client = Route53Domains(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: route53_client.py]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_client.py

```python
from prowler.providers.aws.services.route53.route53_service import Route53
from prowler.providers.common.provider import Provider

route53_client = Route53(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: route53_service.py]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Route53(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider, global_service=True)
        self.hosted_zones = {}
        self.record_sets = []
        self._list_hosted_zones()
        self._list_query_logging_configs()
        self._list_tags_for_resource()
        self._list_resource_record_sets()

    def _list_hosted_zones(self):
        logger.info("Route53 - Listing Hosting Zones...")
        try:
            list_hosted_zones_paginator = self.client.get_paginator("list_hosted_zones")
            for page in list_hosted_zones_paginator.paginate():
                for hosted_zone in page["HostedZones"]:
                    hosted_zone_id = hosted_zone["Id"].replace("/hostedzone/", "")
                    arn = f"arn:{self.audited_partition}:route53:::hostedzone/{hosted_zone_id}"
                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        hosted_zone_name = hosted_zone["Name"]
                        private_zone = hosted_zone["Config"]["PrivateZone"]

                        self.hosted_zones[hosted_zone_id] = HostedZone(
                            id=hosted_zone_id,
                            name=hosted_zone_name,
                            private_zone=private_zone,
                            arn=arn,
                            region=self.region,
                        )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_resource_record_sets(self):
        logger.info("Route53 - Listing Hosting Zones...")
        try:
            list_resource_record_sets_paginator = self.client.get_paginator(
                "list_resource_record_sets"
            )
            for zone_id in self.hosted_zones.keys():
                for page in list_resource_record_sets_paginator.paginate(
                    HostedZoneId=zone_id
                ):
                    for record in page["ResourceRecordSets"]:
                        self.record_sets.append(
                            RecordSet(
                                name=record["Name"],
                                type=record["Type"],
                                records=[
                                    resource_record["Value"]
                                    for resource_record in record.get(
                                        "ResourceRecords", []
                                    )
                                ],
                                is_alias=True if "AliasTarget" in record else False,
                                hosted_zone_id=zone_id,
                                region=self.region,
                            )
                        )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_query_logging_configs(self):
        logger.info("Route53 - Listing Query Logging Configs...")
        try:
            for hosted_zone in self.hosted_zones.values():
                list_query_logging_configs_paginator = self.client.get_paginator(
                    "list_query_logging_configs"
                )
                for page in list_query_logging_configs_paginator.paginate():
                    for logging_config in page["QueryLoggingConfigs"]:
                        if logging_config["HostedZoneId"] == hosted_zone.id:
                            self.hosted_zones[hosted_zone.id].logging_config = (
                                LoggingConfig(
                                    cloudwatch_log_group_arn=logging_config[
                                        "CloudWatchLogsLogGroupArn"
                                    ]
                                )
                            )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("Route53Domains - List Tags...")
        for hosted_zone in self.hosted_zones.values():
            try:
                response = self.client.list_tags_for_resource(
                    ResourceType="hostedzone", ResourceId=hosted_zone.id
                )["ResourceTagSet"]
                hosted_zone.tags = response.get("Tags")
            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class LoggingConfig(BaseModel):
    cloudwatch_log_group_arn: str


class HostedZone(BaseModel):
    id: str
    arn: str
    name: str
    private_zone: bool
    logging_config: LoggingConfig = None
    region: str
    tags: Optional[list] = []


class RecordSet(BaseModel):
    name: str
    type: str
    is_alias: bool
    records: list = []
    hosted_zone_id: str
    region: str


class Route53Domains(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.domains = {}
        if self.audited_partition == "aws":
            # Route53Domains is a global service that supports endpoints in multiple AWS Regions
            # but you must specify the US East (N. Virginia) Region to create, update, or otherwise work with domains.
            self.region = "us-east-1"
            self.client = self.session.client(self.service, self.region)
            self._list_domains()
            self._get_domain_detail()
            self._list_tags_for_domain()

    def _list_domains(self):
        logger.info("Route53Domains - Listing Domains...")
        try:
            list_domains_zones_paginator = self.client.get_paginator("list_domains")
            for page in list_domains_zones_paginator.paginate():
                for domain in page["Domains"]:
                    domain_name = domain["DomainName"]

                    self.domains[domain_name] = Domain(
                        name=domain_name,
                        arn=f"arn:{self.audited_partition}:route53:::domain/{domain_name}",
                        region=self.region,
                    )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_domain_detail(self):
        logger.info("Route53Domains - Getting Domain Detail...")
        try:
            for domain in self.domains.values():
                domain_detail = self.client.get_domain_detail(DomainName=domain.name)
                self.domains[domain.name].admin_privacy = domain_detail["AdminPrivacy"]
                self.domains[domain.name].status_list = domain_detail.get("StatusList")

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_domain(self):
        logger.info("Route53Domains - List Tags...")
        for domain in self.domains.values():
            try:
                response = self.client.list_tags_for_domain(
                    DomainName=domain.name,
                )["TagList"]
                domain.tags = response
            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Domain(BaseModel):
    name: str
    arn: str
    region: str
    admin_privacy: bool = False
    status_list: list[str] = None
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: route53_dangling_ip_subdomain_takeover.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_dangling_ip_subdomain_takeover/route53_dangling_ip_subdomain_takeover.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "route53_dangling_ip_subdomain_takeover",
  "CheckTitle": "Check if Route53 Records contains dangling IPs.",
  "CheckType": [],
  "ServiceName": "route53",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "Check if Route53 Records contains dangling IPs.",
  "Risk": "When an ephemeral AWS resource such as an Elastic IP (EIP) is released into the Amazon's Elastic IP pool, an attacker may acquire the EIP resource and effectively control the domain/subdomain associated with that EIP in your Route 53 DNS records.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "aws route53 change-resource-record-sets --hosted-zone-id <resource_id>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Route53/dangling-dns-records.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that any dangling DNS records are deleted from your Amazon Route 53 public hosted zones in order to maintain the integrity and authenticity of your domains/subdomains and to protect against domain hijacking attacks.",
      "Url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-deleting.html"
    }
  },
  "Categories": [
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: route53_dangling_ip_subdomain_takeover.py]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_dangling_ip_subdomain_takeover/route53_dangling_ip_subdomain_takeover.py

```python
from ipaddress import ip_address

import awsipranges

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.lib.utils.utils import validate_ip_address
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.route53.route53_client import route53_client


class route53_dangling_ip_subdomain_takeover(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for record_set in route53_client.record_sets:
            # Check only A records and avoid aliases (only need to check IPs not AWS Resources)
            if record_set.type == "A" and not record_set.is_alias:
                # Gather Elastic IPs and Network Interfaces Public IPs inside the AWS Account
                public_ips = []
                public_ips.extend([eip.public_ip for eip in ec2_client.elastic_ips])
                # Add public IPs from Network Interfaces
                for network_interface in ec2_client.network_interfaces.values():
                    if (
                        network_interface.association
                        and network_interface.association.get("PublicIp")
                    ):
                        public_ips.append(network_interface.association.get("PublicIp"))
                for record in record_set.records:
                    # Check if record is an IP Address
                    if validate_ip_address(record):
                        report = Check_Report_AWS(
                            metadata=self.metadata(), resource=record_set
                        )
                        report.resource_id = (
                            f"{record_set.hosted_zone_id}/{record_set.name}/{record}"
                        )
                        report.resource_arn = route53_client.hosted_zones[
                            record_set.hosted_zone_id
                        ].arn
                        report.resource_tags = route53_client.hosted_zones[
                            record_set.hosted_zone_id
                        ].tags
                        report.status = "PASS"
                        report.status_extended = f"Route53 record {record} (name: {record_set.name}) in Hosted Zone {route53_client.hosted_zones[record_set.hosted_zone_id].name} is not a dangling IP."
                        # If Public IP check if it is in the AWS Account
                        if (
                            not ip_address(record).is_private
                            and record not in public_ips
                        ):
                            report.status_extended = f"Route53 record {record} (name: {record_set.name}) in Hosted Zone {route53_client.hosted_zones[record_set.hosted_zone_id].name} does not belong to AWS and it is not a dangling IP."
                            # Check if potential dangling IP is within AWS Ranges
                            aws_ip_ranges = awsipranges.get_ranges()
                            if aws_ip_ranges.get(record):
                                report.status = "FAIL"
                                report.status_extended = f"Route53 record {record} (name: {record_set.name}) in Hosted Zone {route53_client.hosted_zones[record_set.hosted_zone_id].name} is a dangling IP which can lead to a subdomain takeover attack."
                        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: route53_domains_privacy_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_domains_privacy_protection_enabled/route53_domains_privacy_protection_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "route53_domains_privacy_protection_enabled",
  "CheckTitle": "Enable Privacy Protection for for a Route53 Domain.",
  "CheckType": [],
  "ServiceName": "route53",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Enable Privacy Protection for for a Route53 Domain.",
  "Risk": "Without privacy protection enabled, ones personal information is published to the public WHOIS database.",
  "RelatedUrl": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-privacy-protection.html",
  "Remediation": {
    "Code": {
      "CLI": "aws route53domains update-domain-contact-privacy --domain-name domain.com --registrant-privacy",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Route53/privacy-protection.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure default Privacy is enabled.",
      "Url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-privacy-protection.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: route53_domains_privacy_protection_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_domains_privacy_protection_enabled/route53_domains_privacy_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.route53.route53domains_client import (
    route53domains_client,
)


class route53_domains_privacy_protection_enabled(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for domain in route53domains_client.domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            if domain.admin_privacy:
                report.status = "PASS"
                report.status_extended = (
                    f"Contact information is private for the {domain.name} domain."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Contact information is public for the {domain.name} domain."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: route53_domains_transferlock_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_domains_transferlock_enabled/route53_domains_transferlock_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "route53_domains_transferlock_enabled",
  "CheckTitle": "Enable Transfer Lock for a Route53 Domain.",
  "CheckType": [],
  "ServiceName": "route53",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Enable Transfer Lock for a Route53 Domain.",
  "Risk": "Without transfer lock enabled, a domain name could be incorrectly moved to a new registrar.",
  "RelatedUrl": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-lock.html",
  "Remediation": {
    "Code": {
      "CLI": "aws route53domains enable-domain-transfer-lock --domain-name DOMAIN",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure transfer lock is enabled.",
      "Url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-lock.html"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: route53_domains_transferlock_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_domains_transferlock_enabled/route53_domains_transferlock_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.route53.route53domains_client import (
    route53domains_client,
)


class route53_domains_transferlock_enabled(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for domain in route53domains_client.domains.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=domain)
            if domain.status_list and "clientTransferProhibited" in domain.status_list:
                report.status = "PASS"
                report.status_extended = (
                    f"Transfer Lock is enabled for the {domain.name} domain."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Transfer Lock is disabled for the {domain.name} domain."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: route53_public_hosted_zones_cloudwatch_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_public_hosted_zones_cloudwatch_logging_enabled/route53_public_hosted_zones_cloudwatch_logging_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "route53_public_hosted_zones_cloudwatch_logging_enabled",
  "CheckTitle": "Check if Route53 public hosted zones are logging queries to CloudWatch Logs.",
  "CheckType": [],
  "ServiceName": "route53",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsRoute53HostedZone",
  "Description": "Check if Route53 public hosted zones are logging queries to CloudWatch Logs.",
  "Risk": "If logs are not enabled, monitoring of service use and threat analysis is not possible.",
  "RelatedUrl": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/monitoring-hosted-zones-with-cloudwatch.html",
  "Remediation": {
    "Code": {
      "CLI": "aws route53 create-query-logging-config  --hosted-zone-id <zone_id>  --cloud-watch-logs-log-group-arn <log_group_arn>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/Route53/enable-query-logging.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable CloudWatch logs and define metrics and uses cases for the events recorded.",
      "Url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/monitoring-hosted-zones-with-cloudwatch.html"
    }
  },
  "Categories": [
    "forensics-ready"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: route53_public_hosted_zones_cloudwatch_logging_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/route53/route53_public_hosted_zones_cloudwatch_logging_enabled/route53_public_hosted_zones_cloudwatch_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.route53.route53_client import route53_client


class route53_public_hosted_zones_cloudwatch_logging_enabled(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for hosted_zone in route53_client.hosted_zones.values():
            if not hosted_zone.private_zone:
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=hosted_zone
                )
                if (
                    hosted_zone.logging_config
                    and hosted_zone.logging_config.cloudwatch_log_group_arn
                ):
                    report.status = "PASS"
                    report.status_extended = f"Route53 Public Hosted Zone {hosted_zone.id} has query logging enabled in Log Group {hosted_zone.logging_config.cloudwatch_log_group_arn}."

                else:
                    report.status = "FAIL"
                    report.status_extended = f"Route53 Public Hosted Zone {hosted_zone.id} has query logging disabled."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: s3control_client.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3control_client.py

```python
from prowler.providers.aws.services.s3.s3_service import S3Control
from prowler.providers.common.provider import Provider

s3control_client = S3Control(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: s3_client.py]---
Location: prowler-master/prowler/providers/aws/services/s3/s3_client.py

```python
from prowler.providers.aws.services.s3.s3_service import S3
from prowler.providers.common.provider import Provider

s3_client = S3(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
