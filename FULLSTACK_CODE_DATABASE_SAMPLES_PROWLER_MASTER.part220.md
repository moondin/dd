---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 220
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 220 of 867)

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

---[FILE: ecs_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_service.py
Signals: Pydantic

```python
from datetime import datetime
from typing import Optional

from alibabacloud_ecs20140526 import models as ecs_models
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class ECS(AlibabaCloudService):
    """
    ECS (Elastic Compute Service) service class for Alibaba Cloud.

    This class provides methods to interact with Alibaba Cloud ECS service
    to retrieve instances, security groups, etc.
    """

    def __init__(self, provider):
        # Call AlibabaCloudService's __init__
        super().__init__(__class__.__name__, provider, global_service=False)

        # Fetch ECS resources
        self.instances = []
        self.__threading_call__(self._describe_instances)
        self.security_groups = {}
        self.__threading_call__(self._describe_security_groups)
        self.disks = []
        self.__threading_call__(self._describe_disks)

    def _describe_instances(self, regional_client):
        """List all ECS instances in the region."""
        region = getattr(regional_client, "region", "unknown")
        logger.info(f"ECS - Describing Instances in {region}...")

        try:
            request = ecs_models.DescribeInstancesRequest()
            request.region_id = region
            # Get all instances (paginated)
            page_number = 1
            page_size = 50

            while True:
                request.page_number = page_number
                request.page_size = page_size
                response = regional_client.describe_instances(request)

                if response and response.body and response.body.instances:
                    instances_data = response.body.instances.instance
                    if not instances_data:
                        break

                    for instance_data in instances_data:
                        instance_id = instance_data.instance_id
                        if not self.audit_resources or is_resource_filtered(
                            instance_id, self.audit_resources
                        ):
                            # Check network type
                            # InstanceNetworkType can be "classic" or "vpc"
                            # If VpcAttributes exists, it's VPC; if not, it might be classic
                            network_type = "vpc"  # Default to VPC
                            vpc_attributes = getattr(
                                instance_data, "vpc_attributes", None
                            )
                            instance_network_type = getattr(
                                instance_data, "instance_network_type", None
                            )

                            # Determine network type
                            if instance_network_type:
                                network_type = instance_network_type
                            elif not vpc_attributes:
                                # If no VPC attributes, it's likely classic network
                                network_type = "classic"

                            vpc_id = ""
                            if vpc_attributes:
                                vpc_id = getattr(vpc_attributes, "vpc_id", "")

                            self.instances.append(
                                Instance(
                                    id=instance_id,
                                    name=getattr(
                                        instance_data, "instance_name", instance_id
                                    ),
                                    region=region,
                                    status=getattr(instance_data, "status", ""),
                                    instance_type=getattr(
                                        instance_data, "instance_type", ""
                                    ),
                                    network_type=network_type,
                                    vpc_id=vpc_id,
                                    create_time=getattr(
                                        instance_data, "creation_time", None
                                    ),
                                )
                            )

                    # Check if there are more pages
                    total_count = getattr(response.body, "total_count", 0)
                    if page_number * page_size >= total_count:
                        break
                    page_number += 1
                else:
                    break

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_security_groups(self, regional_client):
        """List all security groups and their rules in the region."""
        region = getattr(regional_client, "region", "unknown")
        logger.info(f"ECS - Describing Security Groups in {region}...")

        try:
            request = ecs_models.DescribeSecurityGroupsRequest()
            request.region_id = region
            # Get all security groups (paginated)
            page_number = 1
            page_size = 50

            while True:
                request.page_number = page_number
                request.page_size = page_size
                response = regional_client.describe_security_groups(request)

                if response and response.body and response.body.security_groups:
                    security_groups_data = response.body.security_groups.security_group
                    if not security_groups_data:
                        break

                    for sg_data in security_groups_data:
                        sg_id = sg_data.security_group_id
                        if not self.audit_resources or is_resource_filtered(
                            sg_id, self.audit_resources
                        ):
                            # Get security group rules
                            ingress_rules = []
                            egress_rules = []

                            # Get ingress rules
                            try:
                                rules_request = (
                                    ecs_models.DescribeSecurityGroupAttributeRequest()
                                )
                                rules_request.security_group_id = sg_id
                                rules_request.region_id = region
                                rules_request.direction = "ingress"
                                rules_response = (
                                    regional_client.describe_security_group_attribute(
                                        rules_request
                                    )
                                )

                                if (
                                    rules_response
                                    and rules_response.body
                                    and rules_response.body.permissions
                                ):
                                    permissions = (
                                        rules_response.body.permissions.permission
                                    )
                                    if permissions:
                                        for rule in permissions:
                                            ingress_rules.append(
                                                {
                                                    "port_range": getattr(
                                                        rule, "port_range", ""
                                                    ),
                                                    "source_cidr_ip": getattr(
                                                        rule, "source_cidr_ip", ""
                                                    ),
                                                    "ip_protocol": getattr(
                                                        rule, "ip_protocol", ""
                                                    ),
                                                    "policy": getattr(
                                                        rule, "policy", "accept"
                                                    ),
                                                }
                                            )
                            except Exception as error:
                                logger.warning(
                                    f"Could not get ingress rules for security group {sg_id}: {error}"
                                )

                            # Get egress rules
                            try:
                                rules_request = (
                                    ecs_models.DescribeSecurityGroupAttributeRequest()
                                )
                                rules_request.security_group_id = sg_id
                                rules_request.region_id = region
                                rules_request.direction = "egress"
                                rules_response = (
                                    regional_client.describe_security_group_attribute(
                                        rules_request
                                    )
                                )

                                if (
                                    rules_response
                                    and rules_response.body
                                    and rules_response.body.permissions
                                ):
                                    permissions = (
                                        rules_response.body.permissions.permission
                                    )
                                    if permissions:
                                        for rule in permissions:
                                            egress_rules.append(
                                                {
                                                    "port_range": getattr(
                                                        rule, "port_range", ""
                                                    ),
                                                    "dest_cidr_ip": getattr(
                                                        rule, "dest_cidr_ip", ""
                                                    ),
                                                    "ip_protocol": getattr(
                                                        rule, "ip_protocol", ""
                                                    ),
                                                    "policy": getattr(
                                                        rule, "policy", "accept"
                                                    ),
                                                }
                                            )
                            except Exception as error:
                                logger.warning(
                                    f"Could not get egress rules for security group {sg_id}: {error}"
                                )

                            sg_arn = f"acs:ecs:{region}:{self.audited_account}:security-group/{sg_id}"
                            self.security_groups[sg_arn] = SecurityGroup(
                                id=sg_id,
                                name=getattr(sg_data, "security_group_name", sg_id),
                                region=region,
                                arn=sg_arn,
                                vpc_id=getattr(sg_data, "vpc_id", ""),
                                description=getattr(sg_data, "description", ""),
                                ingress_rules=ingress_rules,
                                egress_rules=egress_rules,
                            )

                    # Check if there are more pages
                    total_count = getattr(response.body, "total_count", 0)
                    if page_number * page_size >= total_count:
                        break
                    page_number += 1
                else:
                    break

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_disks(self, regional_client):
        """List all disks in the region."""
        region = getattr(regional_client, "region", "unknown")
        logger.info(f"ECS - Describing Disks in {region}...")

        try:
            request = ecs_models.DescribeDisksRequest()
            request.region_id = region
            # Get all disks (paginated)
            page_number = 1
            page_size = 50

            while True:
                request.page_number = page_number
                request.page_size = page_size
                response = regional_client.describe_disks(request)

                if response and response.body and response.body.disks:
                    disks_data = response.body.disks.disk
                    if not disks_data:
                        break

                    for disk_data in disks_data:
                        disk_id = disk_data.disk_id
                        if not self.audit_resources or is_resource_filtered(
                            disk_id, self.audit_resources
                        ):
                            # Check if disk is attached
                            attached_instance_id = getattr(disk_data, "instance_id", "")
                            is_attached = bool(attached_instance_id)

                            # Check encryption status
                            # In Alibaba Cloud, encryption can be indicated by:
                            # 1. encrypted field (boolean)
                            # 2. encryption_algorithm field (non-empty string)
                            # 3. kms_key_id field (non-empty string)
                            encrypted = getattr(disk_data, "encrypted", False)
                            encryption_algorithm = getattr(
                                disk_data, "encryption_algorithm", ""
                            )
                            kms_key_id = getattr(disk_data, "kms_key_id", "")

                            # Disk is encrypted if any of these conditions are true
                            is_encrypted = (
                                encrypted
                                or bool(encryption_algorithm)
                                or bool(kms_key_id)
                            )

                            self.disks.append(
                                Disk(
                                    id=disk_id,
                                    name=getattr(disk_data, "disk_name", disk_id),
                                    region=region,
                                    status=getattr(disk_data, "status", ""),
                                    disk_category=getattr(disk_data, "category", ""),
                                    size=getattr(disk_data, "size", 0),
                                    is_attached=is_attached,
                                    attached_instance_id=attached_instance_id,
                                    is_encrypted=is_encrypted,
                                    encryption_algorithm=encryption_algorithm or "",
                                    create_time=getattr(
                                        disk_data, "creation_time", None
                                    ),
                                )
                            )

                    # Check if there are more pages
                    total_count = getattr(response.body, "total_count", 0)
                    if page_number * page_size >= total_count:
                        break
                    page_number += 1
                else:
                    break

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Models for ECS service
class Instance(BaseModel):
    """ECS Instance model."""

    id: str
    name: str
    region: str
    status: str
    instance_type: str
    network_type: str  # "classic" or "vpc"
    vpc_id: str = ""
    create_time: Optional[datetime] = None


class SecurityGroup(BaseModel):
    """ECS Security Group model."""

    id: str
    name: str
    region: str
    arn: str
    vpc_id: str = ""
    description: str = ""
    ingress_rules: list[dict] = []
    egress_rules: list[dict] = []


class Disk(BaseModel):
    """ECS Disk model."""

    id: str
    name: str
    region: str
    status: str
    disk_category: str
    size: int
    is_attached: bool
    attached_instance_id: str = ""
    is_encrypted: bool
    encryption_algorithm: str = ""
    create_time: Optional[datetime] = None
```

--------------------------------------------------------------------------------

---[FILE: ecs_attached_disk_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_attached_disk_encrypted/ecs_attached_disk_encrypted.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ecs_attached_disk_encrypted",
  "CheckTitle": "Virtual Machines disk are encrypted",
  "CheckType": [
    "Sensitive file tampering"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ecs:region:account-id:disk/{disk-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudECSDisk",
  "Description": "**ECS cloud disk encryption** protects your data at rest. The cloud disk data encryption feature automatically encrypts data when data is transferred from ECS instances to disks, and decrypts data when read from disks.\n\nEnsure that disks are encrypted when they are created with the creation of VM instances.",
  "Risk": "**Unencrypted disks** attached to ECS instances pose a security risk as they may contain sensitive data that could be accessed if the disk is compromised or accessed by unauthorized parties.\n\nData at rest without encryption is vulnerable to **unauthorized access** if storage media is lost, stolen, or improperly decommissioned.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/59643.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ECS/encrypt-vm-instance-disks.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ecs CreateDisk --DiskName <disk_name> --Size <size> --Encrypted true --KmsKeyId <kms_key_id>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ecs_disk\" \"encrypted\" {\n  zone_id   = \"cn-hangzhou-a\"\n  disk_name = \"encrypted-disk\"\n  category  = \"cloud_efficiency\"\n  size      = 20\n  encrypted = true\n  kms_key_id = alicloud_kms_key.example.id\n}"
    },
    "Recommendation": {
      "Text": "**Encrypt a system disk when copying an image:**\n1. Log on to the **ECS Console** > **Instances & Images** > **Images**\n2. Select the **Custom Image** tab and select target image\n3. Click **Copy Image** and check the **Encrypt** box\n4. Select a key and click **OK**\n\n**Encrypt a data disk when creating an instance:**\n1. Log on to the **ECS Console** > **Instances & Images** > **Instances** > **Create Instance**\n2. In the Storage section, click **Add Disk**\n3. Select **Disk Encryption** and choose a key\n\n**Note:** You cannot directly convert unencrypted disks to encrypted disks.",
      "Url": "https://hub.prowler.com/check/ecs_attached_disk_encrypted"
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

---[FILE: ecs_attached_disk_encrypted.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_attached_disk_encrypted/ecs_attached_disk_encrypted.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ecs.ecs_client import ecs_client


class ecs_attached_disk_encrypted(Check):
    """Check if attached disks are encrypted."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for disk in ecs_client.disks:
            # Only check attached disks
            if disk.is_attached:
                report = CheckReportAlibabaCloud(
                    metadata=self.metadata(), resource=disk
                )
                report.region = disk.region
                report.resource_id = disk.id
                report.resource_arn = (
                    f"acs:ecs:{disk.region}:{ecs_client.audited_account}:disk/{disk.id}"
                )

                if disk.is_encrypted:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Disk {disk.name if disk.name else disk.id} attached to instance "
                        f"{disk.attached_instance_id} is encrypted."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Disk {disk.name if disk.name else disk.id} attached to instance "
                        f"{disk.attached_instance_id} is not encrypted."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_instance_endpoint_protection_installed.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_instance_endpoint_protection_installed/ecs_instance_endpoint_protection_installed.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ecs_instance_endpoint_protection_installed",
  "CheckTitle": "The endpoint protection for all Virtual Machines is installed",
  "CheckType": [
    "Suspicious process",
    "Webshell",
    "Unusual logon",
    "Sensitive file tampering",
    "Malicious software"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ecs:region:account-id:instance/{instance-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudECSInstance",
  "Description": "Installing **endpoint protection systems** (like **Security Center** for Alibaba Cloud) provides real-time protection capability that helps identify and remove viruses, spyware, and other malicious software.\n\nConfigurable alerts notify when known malicious software attempts to install itself or run on ECS instances.",
  "Risk": "ECS instances without **endpoint protection** are vulnerable to **malware**, **viruses**, and other security threats.\n\nEndpoint protection provides real-time monitoring and protection capabilities essential for detecting and preventing security incidents.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ECS/enable-endpoint-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "Logon to Security Center Console > Select Settings > Click Agent > Select virtual machines without Security Center agent > Click Install",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **Security Center Console**\n2. Select **Settings**\n3. Click **Agent**\n4. On the Agent tab, select the virtual machines without Security Center agent installed\n5. Click **Install**",
      "Url": "https://hub.prowler.com/check/ecs_instance_endpoint_protection_installed"
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

---[FILE: ecs_instance_endpoint_protection_installed.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_instance_endpoint_protection_installed/ecs_instance_endpoint_protection_installed.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ecs.ecs_client import ecs_client
from prowler.providers.alibabacloud.services.securitycenter.securitycenter_client import (
    securitycenter_client,
)


class ecs_instance_endpoint_protection_installed(Check):
    """Check if endpoint protection for all Virtual Machines is installed."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # Check each ECS instance for Security Center agent
        for instance in ecs_client.instances:
            # Only check running instances
            if instance.status.lower() not in ["running", "starting"]:
                continue

            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:ecs:{instance.region}:{ecs_client.audited_account}:instance/{instance.id}"

            # Check if Security Center agent is installed
            instance_key = f"{instance.region}:{instance.id}"
            agent = securitycenter_client.instance_agents.get(instance_key)

            if agent:
                if agent.agent_installed and agent.agent_status == "online":
                    report.status = "PASS"
                    report.status_extended = (
                        f"ECS instance {instance.name if instance.name else instance.id} "
                        "has Security Center agent installed and online."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"ECS instance {instance.name if instance.name else instance.id} "
                        f"does not have Security Center agent installed or agent is {agent.agent_status}."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_instance_latest_os_patches_applied.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_instance_latest_os_patches_applied/ecs_instance_latest_os_patches_applied.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ecs_instance_latest_os_patches_applied",
  "CheckTitle": "The latest OS Patches for all Virtual Machines are applied",
  "CheckType": [
    "Malicious software",
    "Web application threat detection"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ecs:region:account-id:instance/{instance-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudECSInstance",
  "Description": "Windows and Linux virtual machines should be kept updated to address specific bugs or flaws, improve OS or application's general stability, and fix **security vulnerabilities**.\n\nThe Alibaba Cloud **Security Center** checks for the latest updates in Linux and Windows systems.",
  "Risk": "**Unpatched systems** are vulnerable to known security exploits and may be compromised by attackers.\n\nKeeping systems updated with the latest patches is critical for maintaining security and preventing **exploitation of known vulnerabilities**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ECS/apply-latest-os-patches.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "Logon to Security Center Console > Select Vulnerabilities > Apply all patches for vulnerabilities",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **Security Center Console**\n2. Select **Vulnerabilities**\n3. Ensure all vulnerabilities are fixed\n4. Apply all patches for vulnerabilities",
      "Url": "https://hub.prowler.com/check/ecs_instance_latest_os_patches_applied"
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

---[FILE: ecs_instance_latest_os_patches_applied.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_instance_latest_os_patches_applied/ecs_instance_latest_os_patches_applied.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ecs.ecs_client import ecs_client
from prowler.providers.alibabacloud.services.securitycenter.securitycenter_client import (
    securitycenter_client,
)


class ecs_instance_latest_os_patches_applied(Check):
    """Check if the latest OS patches for all Virtual Machines are applied."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # Check each ECS instance for vulnerabilities
        for instance in ecs_client.instances:
            # Only check running instances
            if instance.status.lower() not in ["running", "starting"]:
                continue

            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:ecs:{instance.region}:{ecs_client.audited_account}:instance/{instance.id}"

            # Check if instance has vulnerabilities
            instance_key = f"{instance.region}:{instance.id}"
            vulnerability = securitycenter_client.instance_vulnerabilities.get(
                instance_key
            )

            if vulnerability:
                if vulnerability.has_vulnerabilities:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"ECS instance {instance.name if instance.name else instance.id} "
                        f"has {vulnerability.vulnerability_count} unpatched vulnerabilities. "
                        "Latest OS patches are not applied."
                    )
                else:
                    report.status = "PASS"
                    report.status_extended = (
                        f"ECS instance {instance.name if instance.name else instance.id} "
                        "has all latest OS patches applied."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_instance_no_legacy_network.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_instance_no_legacy_network/ecs_instance_no_legacy_network.metadata.json
Signals: Next.js

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ecs_instance_no_legacy_network",
  "CheckTitle": "Legacy networks does not exist",
  "CheckType": [
    "Suspicious network connection"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ecs:region:account-id:instance/{instance-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudECSInstance",
  "Description": "In order to prevent use of **legacy networks**, ECS instances should not have a legacy network configured.\n\nLegacy networks have a single network IPv4 prefix range and a single gateway IP address for the whole network. With legacy networks, you cannot create subnetworks or switch from legacy to auto or custom subnet networks.",
  "Risk": "**Legacy networks** can have an impact on high network traffic ECS instances and are subject to a **single point of failure**.\n\nThey also lack the security isolation and network segmentation capabilities provided by **VPCs**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/87190.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-VPC/legacy-network-usage.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ecs CreateInstance --InstanceName <instance_name> --ImageId <image_id> --InstanceType <instance_type> --VSwitchId <vswitch_id>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **ECS Console**\n2. In the left-side navigation pane, choose **Instance & Image** > **Instances**\n3. Click **Create Instance**\n4. Specify the basic instance information required and click **Next: Networking**\n5. Select the Network Type of **VPC**",
      "Url": "https://hub.prowler.com/check/ecs_instance_no_legacy_network"
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

---[FILE: ecs_instance_no_legacy_network.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_instance_no_legacy_network/ecs_instance_no_legacy_network.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ecs.ecs_client import ecs_client


class ecs_instance_no_legacy_network(Check):
    """Check if ECS instances are not using legacy (classic) network."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in ecs_client.instances:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:ecs:{instance.region}:{ecs_client.audited_account}:instance/{instance.id}"

            if instance.network_type == "classic":
                report.status = "FAIL"
                report.status_extended = (
                    f"ECS instance {instance.name if instance.name else instance.id} "
                    f"is using legacy (classic) network type."
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"ECS instance {instance.name if instance.name else instance.id} "
                    f"is using VPC network type."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_securitygroup_restrict_rdp_internet.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_securitygroup_restrict_rdp_internet/ecs_securitygroup_restrict_rdp_internet.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ecs_securitygroup_restrict_rdp_internet",
  "CheckTitle": "RDP access is restricted from the internet",
  "CheckType": [
    "Unusual logon",
    "Suspicious network connection"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ecs:region:account-id:security-group/{security-group-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudECSSecurityGroup",
  "Description": "**Security groups** provide stateful filtering of ingress/egress network traffic to Alibaba Cloud resources.\n\nIt is recommended that no security group allows unrestricted ingress access to port **3389 (RDP)**.",
  "Risk": "Removing unfettered connectivity to remote console services, such as **RDP**, reduces a server's exposure to risk.\n\nUnrestricted RDP access from the internet (`0.0.0.0/0`) exposes systems to **brute force attacks**, **credential stuffing**, and **exploitation of RDP vulnerabilities**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/25387.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ECS/unrestricted-rdp-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ecs RevokeSecurityGroup --SecurityGroupId <security_group_id> --IpProtocol tcp --PortRange 3389/3389 --SourceCidrIp 0.0.0.0/0",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_security_group_rule\" \"deny_rdp_internet\" {\n  type              = \"ingress\"\n  ip_protocol       = \"tcp\"\n  port_range        = \"3389/3389\"\n  security_group_id = alicloud_security_group.example.id\n  cidr_ip           = \"10.0.0.0/8\"  # Restrict to internal network\n  policy            = \"accept\"\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **ECS Console**\n2. In the left-side navigation pane, choose **Network & Security** > **Security Groups**\n3. Find the Security Group you want to modify\n4. Modify Source IP range to specific IP instead of `0.0.0.0/0`\n5. Click **Save**",
      "Url": "https://hub.prowler.com/check/ecs_securitygroup_restrict_rdp_internet"
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

---[FILE: ecs_securitygroup_restrict_rdp_internet.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_securitygroup_restrict_rdp_internet/ecs_securitygroup_restrict_rdp_internet.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ecs.ecs_client import ecs_client
from prowler.providers.alibabacloud.services.ecs.lib.security_groups import (
    is_public_cidr,
    port_in_range,
)


class ecs_securitygroup_restrict_rdp_internet(Check):
    """Check if security groups restrict RDP (port 3389) access from the internet."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        check_port = 3389  # RDP port

        for sg_arn, security_group in ecs_client.security_groups.items():
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=security_group
            )
            report.region = security_group.region
            report.resource_id = security_group.id
            report.resource_arn = security_group.arn

            # Check ingress rules for unrestricted access to RDP port
            has_unrestricted_access = False

            for ingress_rule in security_group.ingress_rules:
                # Check if rule allows traffic (policy == "accept")
                if ingress_rule.get("policy", "accept") != "accept":
                    continue

                # Check protocol (tcp for RDP)
                protocol = ingress_rule.get("ip_protocol", "").lower()
                if protocol not in ["tcp", "all"]:
                    continue

                # Check if source is public (0.0.0.0/0)
                source_cidr = ingress_rule.get("source_cidr_ip", "")
                if not is_public_cidr(source_cidr):
                    continue

                # Check if port range includes RDP port
                port_range = ingress_rule.get("port_range", "")

                if protocol == "all":
                    # If protocol is "all", all ports are open
                    has_unrestricted_access = True
                    break
                elif port_in_range(port_range, check_port):
                    has_unrestricted_access = True
                    break

            if has_unrestricted_access:
                report.status = "FAIL"
                report.status_extended = (
                    f"Security group {security_group.name} ({security_group.id}) "
                    f"has Microsoft RDP port 3389 open to the internet (0.0.0.0/0)."
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"Security group {security_group.name} ({security_group.id}) "
                    f"does not have Microsoft RDP port 3389 open to the internet."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
