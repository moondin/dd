---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 274
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 274 of 867)

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

---[FILE: network_acls.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/lib/network_acls.py

```python
from typing import Any


# Network ACLs
def check_network_acl(rules: Any, protocol: str, port: int) -> bool:
    """check_network_acl returns True if the network acls rules has ingress public access to the check_ports using the protocol, otherwise return False
    - True --> NACL open to the internet
    - False --> NACL closed to the internet
    """

    # Spliting IPv6 from IPv4 rules
    rules_IPv6 = list(
        filter(lambda rule: rule.get("CidrBlock") is None and not rule["Egress"], rules)
    )

    # For IPv6
    # Rules must order by RuleNumber
    for rule in sorted(rules_IPv6, key=lambda rule: rule["RuleNumber"]):
        if (
            rule["Ipv6CidrBlock"] == "::/0"
            and rule["RuleAction"] == "deny"
            and (
                rule["Protocol"] == "-1"
                or (
                    rule["Protocol"] == protocol
                    and rule["PortRange"]["From"] <= port <= rule["PortRange"]["To"]
                )
            )
        ):
            # Exist IPv6 deny for this port
            break

        if (
            rule["Ipv6CidrBlock"] == "::/0"
            and rule["RuleAction"] == "allow"
            and (
                rule["Protocol"] == "-1"
                or (
                    rule["Protocol"] == protocol
                    and rule["PortRange"]["From"] <= port <= rule["PortRange"]["To"]
                )
            )
        ):
            # Exist IPv6 allow for this port
            return True

    # There are not IPv6 Public access here

    # Spliting IPv4 from IPv6 rules
    rules_IPv4 = list(
        filter(
            lambda rule: rule.get("Ipv6CidrBlock") is None and not rule["Egress"], rules
        )
    )

    # For IPv4
    # Rules must order by RuleNumber
    for rule in sorted(rules_IPv4, key=lambda rule: rule["RuleNumber"]):
        if (
            rule["CidrBlock"] == "0.0.0.0/0"
            and rule["RuleAction"] == "deny"
            and (
                rule["Protocol"] == "-1"
                or (
                    rule["Protocol"] == protocol
                    and rule["PortRange"]["From"] <= port <= rule["PortRange"]["To"]
                )
            )
        ):
            # Exist IPv4 deny for this port and if exist IPv6 there are not IPv6 Public access here
            return False

        if (
            rule["CidrBlock"] == "0.0.0.0/0"
            and rule["RuleAction"] == "allow"
            and (
                rule["Protocol"] == "-1"
                or (
                    rule["Protocol"] == protocol
                    and rule["PortRange"]["From"] <= port <= rule["PortRange"]["To"]
                )
            )
        ):
            return True

    return False
```

--------------------------------------------------------------------------------

---[FILE: security_groups.py]---
Location: prowler-master/prowler/providers/aws/services/ec2/lib/security_groups.py

```python
import ipaddress
from typing import Any


def check_security_group(
    ingress_rule: Any, protocol: str, ports: list = [], any_address: bool = False
) -> bool:
    """
    Check if the security group ingress rule has public access to the check_ports using the protocol

    @param ingress_rule: AWS Security Group IpPermissions Ingress Rule
    {
        'FromPort': 123,
        'IpProtocol': 'string',
        'IpRanges': [
            {
                'CidrIp': 'string',
                'Description': 'string'
            },
        ],
        'Ipv6Ranges': [
            {
                'CidrIpv6': 'string',
                'Description': 'string'
            },
        ],
        'ToPort': 123,
    }

    @param protocol: Protocol to check. If -1, all protocols will be checked.


    @param ports: List of ports to check. If empty, any port will be checked. If None, any port will be checked. (Default: [])

    @param any_address: If True, only 0.0.0.0/0 or "::/0" will be public and do not search for public addresses. (Default: False)

    @return: True if the security group has public access to the check_ports using the protocol
    """
    # Check for all traffic ingress rules regardless of the protocol
    if ingress_rule["IpProtocol"] == "-1":
        for ip_ingress_rule in ingress_rule["IpRanges"]:
            if _is_cidr_public(ip_ingress_rule["CidrIp"], any_address):
                return True
        for ip_ingress_rule in ingress_rule["Ipv6Ranges"]:
            if _is_cidr_public(ip_ingress_rule["CidrIpv6"], any_address):
                return True

    if (
        ingress_rule["IpProtocol"] != "-1"
        and protocol != "-1"
        and ingress_rule["IpProtocol"] != protocol
    ):
        return False

    # Check for specific ports in ingress rules
    if "FromPort" in ingress_rule:
        # If there is a port range
        if ingress_rule["FromPort"] != ingress_rule["ToPort"]:
            # Calculate port range, adding 1
            diff = (ingress_rule["ToPort"] - ingress_rule["FromPort"]) + 1
            ingress_port_range = []
            for x in range(diff):
                ingress_port_range.append(int(ingress_rule["FromPort"]) + x)
        # If FromPort and ToPort are the same
        else:
            ingress_port_range = []
            ingress_port_range.append(int(ingress_rule["FromPort"]))

        # Test Security Group
        # IPv4
        for ip_ingress_rule in ingress_rule["IpRanges"]:
            if _is_cidr_public(ip_ingress_rule["CidrIp"], any_address):
                # If there are input ports to check
                if ports:
                    for port in ports:
                        if (
                            port in ingress_port_range
                            and ingress_rule["IpProtocol"] == protocol
                        ):
                            return True
                # If empty input ports check if all ports are open
                if len(set(ingress_port_range)) == 65536:
                    return True
                # If None input ports check if any port is open
                if ports is None:
                    return True

        # IPv6
        for ip_ingress_rule in ingress_rule["Ipv6Ranges"]:
            if _is_cidr_public(ip_ingress_rule["CidrIpv6"], any_address):
                # If there are input ports to check
                if ports:
                    for port in ports:
                        if (
                            port in ingress_port_range
                            and ingress_rule["IpProtocol"] == protocol
                        ):
                            return True
                # If empty input ports check if all ports are open
                if len(set(ingress_port_range)) == 65536:
                    return True
                # If None input ports check if any port is open
                if ports is None:
                    return True

    return False


def _is_cidr_public(cidr: str, any_address: bool = False) -> bool:
    """
    Check if an input CIDR is public

    @param cidr: CIDR 10.22.33.44/8

    @param any_address: If True, only 0.0.0.0/0 or "::/0" will be public and do not search for public addresses. (Default: False)
    """
    public_IPv4 = "0.0.0.0/0"
    public_IPv6 = "::/0"
    if cidr in (public_IPv4, public_IPv6):
        return True
    if not any_address:
        return ipaddress.ip_network(cidr).is_global
```

--------------------------------------------------------------------------------

---[FILE: ecr_client.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_client.py

```python
from prowler.providers.aws.services.ecr.ecr_service import ECR
from prowler.providers.common.provider import Provider

ecr_client = ECR(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: ecr_service.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_service.py
Signals: Pydantic

```python
from datetime import datetime
from json import loads
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class ECR(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__(__class__.__name__, provider)
        self.registry_id = self.audited_account
        self.registries = {}
        self.__threading_call__(self._describe_registries_and_repositories)
        self.__threading_call__(self._describe_repository_policies)
        self.__threading_call__(self._get_image_details)
        self.__threading_call__(self._get_repository_lifecycle_policy)
        self.__threading_call__(self._get_registry_scanning_configuration)
        self.__threading_call__(self._list_tags_for_resource)

    def _describe_registries_and_repositories(self, regional_client):
        logger.info("ECR - Describing registries and repositories...")
        regional_registry_repositories = []
        try:
            describe_ecr_paginator = regional_client.get_paginator(
                "describe_repositories"
            )
            for page in describe_ecr_paginator.paginate():
                for repository in page["repositories"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            repository["repositoryArn"], self.audit_resources
                        )
                    ):
                        regional_registry_repositories.append(
                            Repository(
                                name=repository["repositoryName"],
                                arn=repository["repositoryArn"],
                                registry_id=repository["registryId"],
                                region=regional_client.region,
                                scan_on_push=repository["imageScanningConfiguration"][
                                    "scanOnPush"
                                ],
                                immutability=repository.get(
                                    "imageTagMutability", "MUTABLE"
                                ),
                                policy=None,
                                images_details=[],
                                lifecycle_policy=None,
                            )
                        )
            # The default ECR registry is assumed
            self.registries[regional_client.region] = Registry(
                id=self.registry_id,
                arn=f"arn:{self.audited_partition}:ecr:{regional_client.region}:{self.audited_account}:registry/{self.registry_id}",
                region=regional_client.region,
                repositories=regional_registry_repositories,
            )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_repository_policies(self, regional_client):
        logger.info("ECR - Describing repository policies...")
        try:
            if regional_client.region in self.registries:
                for repository in self.registries[regional_client.region].repositories:
                    client = self.regional_clients[repository.region]
                    try:
                        policy = client.get_repository_policy(
                            repositoryName=repository.name
                        )
                        if "policyText" in policy:
                            repository.policy = loads(policy["policyText"])
                    except ClientError as error:
                        if (
                            error.response["Error"]["Code"]
                            == "RepositoryPolicyNotFoundException"
                        ):
                            logger.warning(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                            repository.policy = {}

        except Exception as error:
            if "RepositoryPolicyNotFoundException" not in str(error):
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_repository_lifecycle_policy(self, regional_client):
        logger.info("ECR - Getting repository lifecycle policy...")
        try:
            if regional_client.region in self.registries:
                for repository in self.registries[regional_client.region].repositories:
                    client = self.regional_clients[repository.region]
                    try:
                        policy = client.get_lifecycle_policy(
                            repositoryName=repository.name
                        )
                        if "lifecyclePolicyText" in policy:
                            repository.lifecycle_policy = policy["lifecyclePolicyText"]
                    except ClientError as error:
                        if (
                            error.response["Error"]["Code"]
                            == "LifecyclePolicyNotFoundException"
                        ):
                            logger.warning(
                                f"{regional_client.region} --"
                                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                                f" {error}"
                            )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_image_details(self, regional_client):
        logger.info("ECR - Getting images details...")
        try:
            if regional_client.region in self.registries:
                for repository in self.registries[regional_client.region].repositories:
                    # There is nothing to do if the repository is not scanning pushed images
                    if repository.scan_on_push:
                        client = self.regional_clients[repository.region]
                        describe_images_paginator = client.get_paginator(
                            "describe_images"
                        )
                        for page in describe_images_paginator.paginate(
                            registryId=self.registries[regional_client.region].id,
                            repositoryName=repository.name,
                            PaginationConfig={"PageSize": 1000},
                        ):
                            for image in page["imageDetails"]:
                                # The following condition is required since sometimes
                                # the AWS ECR API returns None using the iterator
                                if image is not None:
                                    artifact_media_type = image.get(
                                        "artifactMediaType", None
                                    )
                                    tags = image.get("imageTags", [])
                                    if ECR._is_artifact_scannable(
                                        artifact_media_type, tags
                                    ):
                                        severity_counts = None
                                        last_scan_status = None
                                        image_digest = image.get("imageDigest")
                                        latest_tag = image.get("imageTags", ["None"])[0]
                                        image_pushed_at = image.get("imagePushedAt")
                                        image_scan_findings_field_name = (
                                            "imageScanFindingsSummary"
                                        )
                                        if "docker" in artifact_media_type:
                                            type = "Docker"
                                        elif "oci" in artifact_media_type:
                                            type = "OCI"
                                        else:
                                            type = ""

                                        # If imageScanStatus is not present or imageScanFindingsSummary is missing,
                                        # we need to call DescribeImageScanFindings because AWS' new version of
                                        # basic scanning does not support imageScanFindingsSummary and imageScanStatus
                                        # in the DescribeImages API.
                                        if "imageScanStatus" not in image:
                                            try:
                                                # use "image" for scan findings to get data the same way as for an image
                                                image = (
                                                    client.describe_image_scan_findings(
                                                        registryId=self.registries[
                                                            regional_client.region
                                                        ].id,
                                                        repositoryName=repository.name,
                                                        imageId={
                                                            "imageDigest": image_digest
                                                        },
                                                    )
                                                )
                                                image_scan_findings_field_name = (
                                                    "imageScanFindings"
                                                )
                                            except (
                                                client.exceptions.ImageNotFoundException
                                            ) as error:
                                                logger.warning(
                                                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                                )
                                                continue
                                            except (
                                                client.exceptions.ScanNotFoundException
                                            ) as error:
                                                logger.warning(
                                                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                                )
                                                continue
                                            except Exception as error:
                                                logger.error(
                                                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                                )
                                                continue

                                        if "imageScanStatus" in image:
                                            last_scan_status = image["imageScanStatus"][
                                                "status"
                                            ]

                                        if image_scan_findings_field_name in image:
                                            severity_counts = FindingSeverityCounts(
                                                critical=0, high=0, medium=0
                                            )
                                            finding_severity_counts = image[
                                                image_scan_findings_field_name
                                            ].get("findingSeverityCounts", {})
                                            severity_counts.critical = (
                                                finding_severity_counts.get(
                                                    "CRITICAL", 0
                                                )
                                            )
                                            severity_counts.high = (
                                                finding_severity_counts.get("HIGH", 0)
                                            )
                                            severity_counts.medium = (
                                                finding_severity_counts.get("MEDIUM", 0)
                                            )

                                        repository.images_details.append(
                                            ImageDetails(
                                                latest_tag=latest_tag,
                                                image_pushed_at=image_pushed_at,
                                                latest_digest=image_digest,
                                                scan_findings_status=last_scan_status,
                                                scan_findings_severity_count=severity_counts,
                                                artifact_media_type=artifact_media_type,
                                                type=type,
                                            )
                                        )
                        # Sort the repository images by date pushed
                        repository.images_details.sort(
                            key=lambda image: image.image_pushed_at
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self, regional_client):
        logger.info("ECR - List Tags...")
        try:
            if regional_client.region in self.registries:
                for repository in self.registries[regional_client.region].repositories:
                    try:
                        regional_client = self.regional_clients[repository.region]
                        response = regional_client.list_tags_for_resource(
                            resourceArn=repository.arn
                        )["tags"]
                        repository.tags = response

                    except ClientError as error:
                        if (
                            error.response["Error"]["Code"]
                            == "RepositoryNotFoundException"
                        ):
                            logger.warning(
                                f"{regional_client.region} --"
                                f" {error.__class__.__name__}[{error.__traceback__.tb_lineno}]:"
                                f" {error}"
                            )
                            continue
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_registry_scanning_configuration(self, regional_client):
        logger.info("ECR - Getting Registry Scanning Configuration...")
        try:
            if regional_client.region in self.registries:
                response = regional_client.get_registry_scanning_configuration()
                rules = []
                for rule in response.get("scanningConfiguration").get("rules", []):
                    rules.append(
                        ScanningRule(
                            scan_frequency=rule.get("scanFrequency"),
                            scan_filters=rule.get("repositoryFilters", []),
                        )
                    )

                self.registries[regional_client.region].scan_type = response.get(
                    "scanningConfiguration"
                ).get("scanType", "BASIC")
                self.registries[regional_client.region].rules = rules
        except ClientError as error:
            if error.response["Error"][
                "Code"
            ] == "ValidationException" and "GetRegistryScanningConfiguration operation: This feature is disabled" in str(
                error
            ):
                self.registries[regional_client.region].scan_type = "BASIC"
                self.registries[regional_client.region].rules = []
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    @staticmethod
    def _is_artifact_scannable(artifact_media_type: str, tags: list[str] = []) -> bool:
        """
        Check if an artifact is scannable based on its media type and tags.

        Args:
            artifact_media_type (str): The media type of the artifact.
            tags (list): The list of tags associated with the artifact.

        Returns:
            bool: True if the artifact is scannable, False otherwise.
        """
        try:
            if artifact_media_type is None:
                return False

            # Tools like GoogleContainerTools/jib uses `application/vnd.oci.image.config.v1+json`` also for signatures, which are not scannable.
            # Luckily, these are tagged with sha-<HASH-CODE>.sig, so that they can still be easily recognized.
            for tag in tags:
                if tag.startswith("sha256-") and tag.endswith(".sig"):
                    return False

            scannable_artifact_media_types = [
                "application/vnd.docker.container.image.v1+json",  # Docker image configuration
                "application/vnd.docker.image.rootfs.diff.tar",  # Docker image layer as a tar archive
                "application/vnd.docker.image.rootfs.diff.tar.gzip",  # Docker image layer that is compressed using gzip
                "application/vnd.oci.image.config.v1+json",  # OCI image configuration, but also used by GoogleContainerTools/jib for signatures
                "application/vnd.oci.image.layer.v1.tar",  # Uncompressed OCI image layer
                "application/vnd.oci.image.layer.v1.tar+gzip",  # Compressed OCI image layer
            ]

            return artifact_media_type in scannable_artifact_media_types
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return False


class FindingSeverityCounts(BaseModel):
    critical: int
    high: int
    medium: int


class ImageDetails(BaseModel):
    latest_tag: str
    latest_digest: str
    image_pushed_at: datetime
    scan_findings_status: Optional[str]
    scan_findings_severity_count: Optional[FindingSeverityCounts]
    artifact_media_type: Optional[str]
    type: str


class Repository(BaseModel):
    name: str
    arn: str
    region: str
    registry_id = str
    scan_on_push: bool
    immutability: Optional[str]
    policy: Optional[dict]
    images_details: Optional[list[ImageDetails]]
    lifecycle_policy: Optional[str]
    tags: Optional[list] = []


class ScanningRule(BaseModel):
    scan_frequency: str
    scan_filters: list[dict]


class Registry(BaseModel):
    id: str
    arn: str
    region: str
    repositories: list[Repository]
    scan_type: Optional[str]
    rules: Optional[list[ScanningRule]]
```

--------------------------------------------------------------------------------

---[FILE: ecr_registry_scan_images_on_push_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_registry_scan_images_on_push_enabled/ecr_registry_scan_images_on_push_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecr_registry_scan_images_on_push_enabled",
  "CheckTitle": "ECR registry has image scanning on push enabled for all repositories",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "ecr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "Amazon ECR registries with repositories are evaluated for image scanning configured as `scan on push` at the registry level, with scan rules that cover all repositories (no restrictive filters), for either **basic** or **enhanced** scanning.",
  "Risk": "Absent or filtered `scan on push` lets **vulnerable images** be pushed and deployed without timely detection, enabling exploitation of known CVEs (RCE, privilege escalation), supply chain compromise, and lateral movement - threatening workload integrity and data confidentiality.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecr put-registry-scanning-configuration --rules 'scanFrequency=SCAN_ON_PUSH,repositoryFilters=[{filter=string,filterType=WILDCARD}]'",
      "NativeIaC": "",
      "Other": "1. Open the AWS Management Console and go to Amazon ECR\n2. In the left menu, click Account settings (or Settings), then find Registry scanning\n3. Click Edit\n4. Set Scanning type to Enhanced scanning\n5. Enable Scan on push\n6. Under Repository filters, set Filter type to WILDCARD and Filter to *\n7. Click Save",
      "Terraform": "```hcl\nresource \"aws_ecr_registry_scanning_configuration\" \"<example_resource_name>\" {\n  scan_type = \"ENHANCED\"\n\n  rule {\n    scan_frequency = \"SCAN_ON_PUSH\"  # Ensures scan on push\n    repository_filter {\n      filter      = \"*\"               # Applies to all repositories\n      filter_type = \"WILDCARD\"\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable registry-wide `scan on push` and ensure rules apply to all repositories (no filters). Prefer **enhanced scanning** for broader coverage, and pair with continuous scans when available. Integrate findings into CI/CD gates and alerts to enforce **defense in depth** and block promotion of risky images.",
      "Url": "https://hub.prowler.com/check/ecr_registry_scan_images_on_push_enabled"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecr_registry_scan_images_on_push_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_registry_scan_images_on_push_enabled/ecr_registry_scan_images_on_push_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecr.ecr_client import ecr_client


class ecr_registry_scan_images_on_push_enabled(Check):
    def execute(self):
        findings = []
        for registry in ecr_client.registries.values():
            # We want to check the registry if it is in use, hence there are repositories
            if len(registry.repositories) != 0:
                report = Check_Report_AWS(metadata=self.metadata(), resource=registry)
                report.status = "FAIL"
                report.status_extended = f"ECR registry {registry.id} has {registry.scan_type} scanning without scan on push enabled."
                if registry.rules:
                    report.status = "PASS"
                    report.status_extended = f"ECR registry {registry.id} has {registry.scan_type} scan with scan on push enabled."
                    filters = True
                    for rule in registry.rules:
                        if not rule.scan_filters or "'*'" in str(rule.scan_filters):
                            filters = False
                    if filters:
                        report.status = "FAIL"
                        report.status_extended = f"ECR registry {registry.id} has {registry.scan_type} scanning with scan on push but with repository filters."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_lifecycle_policy_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_lifecycle_policy_enabled/ecr_repositories_lifecycle_policy_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "ecr_repositories_lifecycle_policy_enabled",
  "CheckTitle": "ECR repository has a lifecycle policy configured",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Resource Consumption"
  ],
  "ServiceName": "ecr",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "AwsEcrRepository",
  "Description": "Amazon ECR repositories have a **lifecycle policy** configured to automatically expire container images based on age, count, or tags.",
  "Risk": "Without **lifecycle policies**, images accumulate indefinitely, leading to:\n- **Availability** issues when quotas block pushes and CI/CD\n- **Integrity** risk from redeploying outdated, vulnerable images\n- **Cost** growth from unnecessary storage",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html",
    "https://docs.aws.amazon.com/AmazonECR/latest/userguide/lp_creation.html",
    "https://aws.plainenglish.io/automation-deletion-untagged-container-image-in-amazon-ecr-using-ecr-lifecycle-policy-995eae2f5b8d",
    "https://blog.stackademic.com/title-implementing-lifecycle-policies-in-aws-ecr-a-practical-guide-3860b612b477",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/ECR/lifecycle-policy-in-use.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ecr put-lifecycle-policy --repository-name <REPOSITORY_NAME> --lifecycle-policy-text '{\"rules\":[{\"rulePriority\":1,\"selection\":{\"tagStatus\":\"untagged\",\"countType\":\"imageCountMoreThan\",\"countNumber\":1},\"action\":{\"type\":\"expire\"}}]}'",
      "NativeIaC": "```yaml\nResources:\n  <example_resource_name>:\n    Type: AWS::ECR::Repository\n    Properties:\n      # Critical: Adding a lifecycle policy makes the repo PASS this check\n      LifecyclePolicy:\n        # Critical: The policy content; any valid rule satisfies the requirement\n        LifecyclePolicyText: >-\n          {\"rules\":[{\"rulePriority\":1,\"selection\":{\"tagStatus\":\"untagged\",\"countType\":\"imageCountMoreThan\",\"countNumber\":1},\"action\":{\"type\":\"expire\"}}]}\n```",
      "Other": "1. Open the AWS Console and go to Amazon ECR > Repositories\n2. Select the target repository\n3. From Actions, choose \"Lifecycle policies\"\n4. Click \"Create rule\"\n5. Set Image status: Untagged, Match criteria: Image count more than = 1, Action: Expire\n6. Click \"Save\" to apply the lifecycle policy",
      "Terraform": "```hcl\nresource \"aws_ecr_lifecycle_policy\" \"<example_resource_name>\" {\n  repository = \"<example_resource_name>\"\n  # Critical: The policy ensures a lifecycle policy is configured for the repo\n  policy = <<POLICY\n{\"rules\":[{\"rulePriority\":1,\"selection\":{\"tagStatus\":\"untagged\",\"countType\":\"imageCountMoreThan\",\"countNumber\":1},\"action\":{\"type\":\"expire\"}}]}\nPOLICY\n}\n```"
    },
    "Recommendation": {
      "Text": "Implement **lifecycle policies** per repository to expire untagged, old, or excess images and retain a small set of trusted releases. Validate outcomes before applying, review rules regularly, and apply consistently across Regions when replicating. This supports **defense in depth** by reducing image attack surface and operational risk.",
      "Url": "https://hub.prowler.com/check/ecr_repositories_lifecycle_policy_enabled"
    }
  },
  "Categories": [
    "container-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: ecr_repositories_lifecycle_policy_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/ecr/ecr_repositories_lifecycle_policy_enabled/ecr_repositories_lifecycle_policy_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ecr.ecr_client import ecr_client


class ecr_repositories_lifecycle_policy_enabled(Check):
    def execute(self):
        findings = []
        for registry in ecr_client.registries.values():
            for repository in registry.repositories:
                report = Check_Report_AWS(metadata=self.metadata(), resource=repository)
                report.status = "FAIL"
                report.status_extended = f"Repository {repository.name} does not have a lifecycle policy configured."
                if repository.lifecycle_policy:
                    report.status = "PASS"
                    report.status_extended = f"Repository {repository.name} has a lifecycle policy configured."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
