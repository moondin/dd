---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 221
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 221 of 867)

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

---[FILE: ecs_securitygroup_restrict_ssh_internet.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_securitygroup_restrict_ssh_internet/ecs_securitygroup_restrict_ssh_internet.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ecs_securitygroup_restrict_ssh_internet",
  "CheckTitle": "SSH access is restricted from the internet",
  "CheckType": [
    "Unusual logon",
    "Suspicious network connection"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ecs:region:account-id:security-group/{security-group-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudECSSecurityGroup",
  "Description": "**Security groups** provide stateful filtering of ingress/egress network traffic to Alibaba Cloud resources.\n\nIt is recommended that no security group allows unrestricted ingress access to port **22 (SSH)**.",
  "Risk": "Removing unfettered connectivity to remote console services, such as **SSH**, reduces a server's exposure to risk.\n\nUnrestricted SSH access from the internet (`0.0.0.0/0`) exposes systems to **brute force attacks**, **credential stuffing**, and **exploitation of SSH vulnerabilities**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/25387.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ECS/unrestricted-ssh-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ecs RevokeSecurityGroup --SecurityGroupId <security_group_id> --IpProtocol tcp --PortRange 22/22 --SourceCidrIp 0.0.0.0/0",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_security_group_rule\" \"deny_ssh_internet\" {\n  type              = \"ingress\"\n  ip_protocol       = \"tcp\"\n  port_range        = \"22/22\"\n  security_group_id = alicloud_security_group.example.id\n  cidr_ip           = \"10.0.0.0/8\"  # Restrict to internal network\n  policy            = \"accept\"\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **ECS Console**\n2. In the left-side navigation pane, choose **Network & Security** > **Security Groups**\n3. Find the Security Group you want to modify\n4. Modify Source IP range to specific IP instead of `0.0.0.0/0`\n5. Click **Save**",
      "Url": "https://hub.prowler.com/check/ecs_securitygroup_restrict_ssh_internet"
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

---[FILE: ecs_securitygroup_restrict_ssh_internet.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_securitygroup_restrict_ssh_internet/ecs_securitygroup_restrict_ssh_internet.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ecs.ecs_client import ecs_client
from prowler.providers.alibabacloud.services.ecs.lib.security_groups import (
    is_public_cidr,
    port_in_range,
)


class ecs_securitygroup_restrict_ssh_internet(Check):
    """Check if security groups restrict SSH (port 22) access from the internet."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []
        check_port = 22  # SSH port

        for sg_arn, security_group in ecs_client.security_groups.items():
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=security_group
            )
            report.region = security_group.region
            report.resource_id = security_group.id
            report.resource_arn = security_group.arn

            # Check ingress rules for unrestricted access to SSH port
            has_unrestricted_access = False

            for ingress_rule in security_group.ingress_rules:
                # Check if rule allows traffic (policy == "accept")
                if ingress_rule.get("policy", "accept") != "accept":
                    continue

                # Check protocol (tcp for SSH)
                protocol = ingress_rule.get("ip_protocol", "").lower()
                if protocol not in ["tcp", "all"]:
                    continue

                # Check if source is public (0.0.0.0/0)
                source_cidr = ingress_rule.get("source_cidr_ip", "")
                if not is_public_cidr(source_cidr):
                    continue

                # Check if port range includes SSH port
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
                    f"has SSH port 22 open to the internet (0.0.0.0/0)."
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"Security group {security_group.name} ({security_group.id}) "
                    f"does not have SSH port 22 open to the internet."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: ecs_unattached_disk_encrypted.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_unattached_disk_encrypted/ecs_unattached_disk_encrypted.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "ecs_unattached_disk_encrypted",
  "CheckTitle": "Unattached disks are encrypted",
  "CheckType": [
    "Sensitive file tampering"
  ],
  "ServiceName": "ecs",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:ecs:region:account-id:disk/{disk-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudECSDisk",
  "Description": "**Cloud disk encryption** protects your data at rest. The cloud disk data encryption feature automatically encrypts data when data is transferred from ECS instances to disks, and decrypts data when read from disks.",
  "Risk": "**Unencrypted unattached disks** pose a security risk as they may contain sensitive data that could be accessed if the disk is compromised or accessed by unauthorized parties.\n\nUnattached disks are especially vulnerable as they may be forgotten or not monitored, increasing the risk of **unauthorized access**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/59643.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-ECS/encrypt-unattached-disks.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun ecs CreateDisk --DiskName <disk_name> --Size <size> --Encrypted true --KmsKeyId <kms_key_id>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_ecs_disk\" \"encrypted\" {\n  zone_id   = \"cn-hangzhou-a\"\n  disk_name = \"encrypted-disk\"\n  category  = \"cloud_efficiency\"\n  size      = 20\n  encrypted = true\n  kms_key_id = alicloud_kms_key.example.id\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **ECS Console**\n2. In the left-side navigation pane, choose **Storage & Snapshots** > **Disk**\n3. In the upper-right corner of the Disks page, click **Create Disk**\n4. In the Disk section, check the **Disk Encryption** box and select a key from the drop-down list\n\n**Note:** After a data disk is created, you can only encrypt the data disk by manually copying data from the unencrypted disk to a new encrypted disk.",
      "Url": "https://hub.prowler.com/check/ecs_unattached_disk_encrypted"
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

---[FILE: ecs_unattached_disk_encrypted.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/ecs_unattached_disk_encrypted/ecs_unattached_disk_encrypted.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.ecs.ecs_client import ecs_client


class ecs_unattached_disk_encrypted(Check):
    """Check if unattached disks are encrypted."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for disk in ecs_client.disks:
            # Only check unattached disks
            if not disk.is_attached:
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
                        f"Unattached disk {disk.name if disk.name else disk.id} "
                        f"is encrypted."
                    )
                else:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Unattached disk {disk.name if disk.name else disk.id} "
                        f"is not encrypted."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: security_groups.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/ecs/lib/security_groups.py

```python
def is_public_cidr(cidr: str) -> bool:
    """Return True when the CIDR represents public/unrestricted access."""
    return cidr in ("0.0.0.0/0", "::/0")


def port_in_range(port_range: str, target_port: int) -> bool:
    """
    Check if target_port is within the provided port range.

    Port range examples:
    - "3389/3389" -> single port range
    - "22" -> single port
    """
    if not port_range:
        return False

    try:
        if "/" in port_range:
            from_port, to_port = map(int, port_range.split("/"))
            return from_port <= target_port <= to_port
        return int(port_range) == target_port
    except (ValueError, AttributeError):
        return False
```

--------------------------------------------------------------------------------

---[FILE: oss_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/oss/oss_client.py

```python
from prowler.providers.alibabacloud.services.oss.oss_service import OSS
from prowler.providers.common.provider import Provider

oss_client = OSS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: oss_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/oss/oss_service.py
Signals: Pydantic

```python
import base64
import hashlib
import hmac
import json
from datetime import datetime
from email.utils import formatdate
from threading import Lock
from typing import Optional
from xml.etree import ElementTree

import requests
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class OSS(AlibabaCloudService):
    """
    OSS (Object Storage Service) service class for Alibaba Cloud.

    This class provides methods to interact with Alibaba Cloud OSS service
    to retrieve buckets, ACLs, and policies.
    """

    def __init__(self, provider):
        # Call AlibabaCloudService's __init__
        # Treat as regional for client generation consistency with other services
        super().__init__(__class__.__name__, provider, global_service=False)
        self._buckets_lock = Lock()

        # Fetch OSS resources
        self.buckets = {}
        self.__threading_call__(self._list_buckets)
        self.__threading_call__(self._get_bucket_acl, self.buckets.values())
        self.__threading_call__(self._get_bucket_policy, self.buckets.values())
        self.__threading_call__(self._get_bucket_logging, self.buckets.values())

    def _list_buckets(self, regional_client=None):
        region = "unknown"
        try:
            regional_client = regional_client or self.client
            region = getattr(regional_client, "region", self.region)
            endpoint = f"oss-{region}.aliyuncs.com"
            endpoint_label = f"region {region}"

            credentials = self.session.get_credentials()

            date_str = formatdate(usegmt=True)
            headers = {
                "Date": date_str,
                "Host": endpoint,
            }
            canonical_headers = []
            if credentials.security_token:
                headers["x-oss-security-token"] = credentials.security_token
                canonical_headers.append(
                    f"x-oss-security-token:{credentials.security_token}"
                )

            canonical_headers_str = ""
            if canonical_headers:
                canonical_headers.sort()
                canonical_headers_str = "\n".join(canonical_headers) + "\n"

            string_to_sign = f"GET\n\n\n{date_str}\n{canonical_headers_str}/"
            signature = base64.b64encode(
                hmac.new(
                    credentials.access_key_secret.encode("utf-8"),
                    string_to_sign.encode("utf-8"),
                    hashlib.sha1,
                ).digest()
            ).decode()
            headers["Authorization"] = f"OSS {credentials.access_key_id}:{signature}"

            url = f"https://{endpoint}/"
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code != 200:
                logger.error(
                    f"OSS - HTTP listing {endpoint_label} returned {response.status_code}: {response.text}"
                )
                return

            try:
                xml_root = ElementTree.fromstring(response.text)
            except ElementTree.ParseError as error:
                logger.error(
                    f"OSS - HTTP listing {endpoint_label} XML parse error: {error}"
                )
                return

            for bucket_elem in xml_root.findall(".//Bucket"):
                bucket_name = bucket_elem.findtext("Name", default="")
                if not bucket_name:
                    continue
                location = bucket_elem.findtext("Location", default=self.region)
                arn = f"acs:oss::{self.audited_account}:{bucket_name}"
                if self.audit_resources and not is_resource_filtered(
                    arn, self.audit_resources
                ):
                    continue

                creation_str = bucket_elem.findtext("CreationDate")
                with self._buckets_lock:
                    self.buckets[arn] = Bucket(
                        arn=arn,
                        name=bucket_name,
                        region=self._normalize_bucket_region(location),
                        creation_date=self._parse_creation_date(creation_str),
                    )
        except Exception as error:
            logger.error(
                f"{region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return

    def _get_bucket_acl(self, bucket):
        """Get bucket ACL."""
        logger.info(f"OSS - Getting ACL for bucket {bucket.name}...")
        try:
            # Get OSS client for the bucket's region
            # OSS bucket operations use regional endpoint: oss-{region}.aliyuncs.com
            oss_client = self.session.client("oss", bucket.region)

            # Get bucket ACL
            response = oss_client.get_bucket_acl(bucket.name)

            if response and response.body:
                # ACL can be retrieved from the response
                # The ACL value is typically in the response body
                acl_value = getattr(response.body, "acl", None)
                if acl_value:
                    # ACL values: private, public-read, public-read-write
                    bucket.acl = acl_value
                else:
                    # Try to get from access_control_list if available
                    acl_list = getattr(response.body, "access_control_list", None)
                    if acl_list:
                        grant = getattr(acl_list, "grant", None)
                        if grant:
                            # Check grants to determine ACL type
                            if isinstance(grant, list):
                                # Check if any grant has public access
                                for g in grant:
                                    permission = getattr(g, "permission", "")
                                    if permission in ["READ", "FULL_CONTROL"]:
                                        if permission == "READ":
                                            bucket.acl = "public-read"
                                        else:
                                            bucket.acl = "public-read-write"
                                        break
                                else:
                                    bucket.acl = "private"
                            else:
                                permission = getattr(grant, "permission", "")
                                if permission == "READ":
                                    bucket.acl = "public-read"
                                elif permission == "FULL_CONTROL":
                                    bucket.acl = "public-read-write"
                                else:
                                    bucket.acl = "private"
                        else:
                            bucket.acl = "private"
                    else:
                        bucket.acl = "private"
            else:
                bucket.acl = "private"

        except Exception as error:
            logger.error(
                f"{bucket.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_bucket_policy(self, bucket):
        """Get bucket policy."""
        logger.info(f"OSS - Getting policy for bucket {bucket.name}...")
        try:
            oss_client = self.session.client("oss", bucket.region)

            response = oss_client.get_bucket_policy(bucket.name)

            if response and response.body:
                if response.body:
                    try:
                        bucket.policy = json.loads(response.body)
                    except json.JSONDecodeError:
                        bucket.policy = {}
                else:
                    bucket.policy = {}
            else:
                bucket.policy = {}

        except Exception as error:
            # If bucket policy doesn't exist, that's OK - it means no public access via policy
            error_code = getattr(error, "code", "")
            if error_code in ["NoSuchBucketPolicy", "NoSuchBucket"]:
                bucket.policy = {}
            else:
                logger.error(
                    f"{bucket.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
                bucket.policy = {}

    def _get_bucket_logging(self, bucket):
        """Get bucket logging configuration using OSS SDK."""
        logger.info(f"OSS - Getting logging configuration for bucket {bucket.name}...")
        try:
            oss_client = self.session.client("oss", bucket.region)

            response = oss_client.get_bucket_logging(bucket.name)

            if response and response.body:
                logging_enabled = None
                if hasattr(response.body, "logging_enabled"):
                    logging_enabled = response.body.logging_enabled
                elif hasattr(response.body, "loggingenabled"):
                    logging_enabled = response.body.loggingenabled
                elif hasattr(response.body, "bucket_logging"):
                    logging_enabled = response.body.bucket_logging

                if logging_enabled:
                    target_bucket = None
                    target_prefix = None

                    for attr_name in [
                        "target_bucket",
                        "targetBucket",
                        "target_bucket_name",
                        "targetBucketName",
                    ]:
                        if hasattr(logging_enabled, attr_name):
                            target_bucket = getattr(logging_enabled, attr_name)
                            break

                    for attr_name in [
                        "target_prefix",
                        "targetPrefix",
                        "target_prefix_name",
                        "targetPrefixName",
                    ]:
                        if hasattr(logging_enabled, attr_name):
                            target_prefix = getattr(logging_enabled, attr_name)
                            break

                    if target_bucket:
                        bucket.logging_enabled = True
                        bucket.logging_target_bucket = (
                            str(target_bucket) if target_bucket else ""
                        )
                        bucket.logging_target_prefix = (
                            str(target_prefix) if target_prefix else ""
                        )
                    else:
                        bucket.logging_enabled = False
                        bucket.logging_target_bucket = ""
                        bucket.logging_target_prefix = ""
                else:
                    bucket.logging_enabled = False
                    bucket.logging_target_bucket = ""
                    bucket.logging_target_prefix = ""
            else:
                bucket.logging_enabled = False
                bucket.logging_target_bucket = ""
                bucket.logging_target_prefix = ""

        except Exception as error:
            logger.error(
                f"{bucket.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    @staticmethod
    def _normalize_bucket_region(bucket_location: str) -> str:
        """Normalize OSS bucket location values to region IDs."""
        if not bucket_location:
            return ""

        normalized_location = bucket_location.lower()

        # Remove protocol/hostname suffix if an endpoint was returned
        if ".aliyuncs.com" in normalized_location:
            normalized_location = normalized_location.split(".aliyuncs.com")[0]

        # Strip leading OSS prefix (e.g., oss-ap-southeast-1 -> ap-southeast-1)
        if normalized_location.startswith("oss-"):
            normalized_location = normalized_location.replace("oss-", "", 1)

        return normalized_location

    @staticmethod
    def _parse_creation_date(creation_date_str: Optional[str]) -> Optional[datetime]:
        """Parse OSS bucket creation date strings into datetime objects."""
        if not creation_date_str:
            return None

        for date_format in ("%Y-%m-%dT%H:%M:%S.%f%z", "%Y-%m-%dT%H:%M:%S%z"):
            try:
                return datetime.strptime(
                    creation_date_str.replace("Z", "+00:00"), date_format
                )
            except (ValueError, AttributeError):
                continue
        return None


class Bucket(BaseModel):
    """OSS Bucket model."""

    arn: str
    name: str
    region: str
    acl: Optional[str] = None  # private, public-read, public-read-write
    policy: dict = {}
    logging_enabled: bool = False
    logging_target_bucket: str = ""
    logging_target_prefix: str = ""
    creation_date: Optional[datetime] = None
```

--------------------------------------------------------------------------------

---[FILE: oss_bucket_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/oss/oss_bucket_logging_enabled/oss_bucket_logging_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "oss_bucket_logging_enabled",
  "CheckTitle": "Logging is enabled for OSS buckets",
  "CheckType": [
    "Sensitive file tampering",
    "Cloud threat detection"
  ],
  "ServiceName": "oss",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:oss::account-id:bucket-name",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudOSSBucket",
  "Description": "**OSS Bucket Access Logging** generates a log that contains access records for each request made to your OSS bucket.\n\nAn access log record contains details about the request, such as the request type, the resources specified in the request, and the time and date the request was processed. It is recommended that bucket access logging be enabled on OSS buckets.",
  "Risk": "By enabling **OSS bucket logging** on target OSS buckets, it is possible to capture all events which may affect objects within target buckets.\n\nConfiguring logs to be placed in a separate bucket allows access to log information useful in **security** and **incident response** workflows.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/31900.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-OSS/enable-bucket-access-logging.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "ossutil logging --method put oss://<bucket-name> --target-bucket <target-bucket> --target-prefix <prefix>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_oss_bucket_logging\" \"example\" {\n  bucket        = alicloud_oss_bucket.example.bucket\n  target_bucket = alicloud_oss_bucket.log_bucket.bucket\n  target_prefix = \"log/\"\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **OSS Console**\n2. In the bucket-list pane, click on a target OSS bucket\n3. Under **Log**, click **Configure**\n4. Click the **Enabled** checkbox\n5. Select `Target Bucket` from the list\n6. Enter a `Target Prefix`\n7. Click **Save**",
      "Url": "https://hub.prowler.com/check/oss_bucket_logging_enabled"
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

---[FILE: oss_bucket_logging_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/oss/oss_bucket_logging_enabled/oss_bucket_logging_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.oss.oss_client import oss_client


class oss_bucket_logging_enabled(Check):
    """Check if logging is enabled for OSS buckets."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for bucket in oss_client.buckets.values():
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=bucket)
            report.region = bucket.region
            report.resource_id = bucket.name
            report.resource_arn = bucket.arn

            if bucket.logging_enabled:
                report.status = "PASS"
                if bucket.logging_target_bucket:
                    report.status_extended = (
                        f"OSS bucket {bucket.name} has logging enabled. "
                        f"Logs are stored in bucket '{bucket.logging_target_bucket}' "
                        f"with prefix {bucket.logging_target_prefix}."
                    )
                else:
                    report.status_extended = (
                        f"OSS bucket {bucket.name} has logging enabled."
                    )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"OSS bucket {bucket.name} does not have logging enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: oss_bucket_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/oss/oss_bucket_not_publicly_accessible/oss_bucket_not_publicly_accessible.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "oss_bucket_not_publicly_accessible",
  "CheckTitle": "OSS bucket is not anonymously or publicly accessible",
  "CheckType": [
    "Sensitive file tampering",
    "Cloud threat detection"
  ],
  "ServiceName": "oss",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:oss::account-id:bucket-name",
  "Severity": "critical",
  "ResourceType": "AlibabaCloudOSSBucket",
  "Description": "A bucket is a container used to store objects in **Object Storage Service (OSS)**. All objects in OSS are stored in buckets.\n\nIt is recommended that the access policy on OSS buckets does not allow **anonymous** and/or **public access**.",
  "Risk": "Allowing **anonymous** and/or **public access** grants permissions to anyone to access bucket content. Such access might not be desired if you are storing any sensitive data.\n\nPublic buckets can lead to **data breaches**, **unauthorized data access**, and **compliance violations**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/31896.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-OSS/publicly-accessible-oss-bucket.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun oss PutBucketAcl --bucket <bucket-name> --acl private",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_oss_bucket_public_access_block\" \"example\" {\n  bucket              = alicloud_oss_bucket.example.bucket\n  block_public_access = true\n}"
    },
    "Recommendation": {
      "Text": "**Set Bucket ACL to Private:**\n1. Log on to the **OSS Console**\n2. In the bucket-list pane, click on a target OSS bucket\n3. Click on **Basic Setting** in the top middle of the console\n4. Under ACL section, click on **Configure**\n5. Click **Private** and click **Save**\n\n**For Bucket Policy:**\n1. Click **Bucket**, and then click the name of the target bucket\n2. Click the **Files** tab and click **Authorize**\n3. In the Authorize dialog, choose `Anonymous Accounts (*)` for Accounts and choose `None` for Authorized Operation\n4. Click **OK**",
      "Url": "https://hub.prowler.com/check/oss_bucket_not_publicly_accessible"
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

---[FILE: oss_bucket_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/oss/oss_bucket_not_publicly_accessible/oss_bucket_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.oss.oss_client import oss_client


def _is_policy_public(policy_document: dict) -> bool:
    """
    Check if a bucket policy allows public access.

    A policy is considered public if it has a statement with:
    - Effect: "Allow"
    - Principal: ["*"] (or contains "*")
    - No Condition elements

    Args:
        policy_document: The parsed policy document as a dictionary.

    Returns:
        bool: True if policy allows public access, False otherwise.
    """
    if not policy_document:
        return False

    statements = policy_document.get("Statement", [])
    if not isinstance(statements, list):
        statements = [statements]

    for statement in statements:
        effect = statement.get("Effect", "")
        principal = statement.get("Principal", [])
        condition = statement.get("Condition")

        # If there's a condition, it's not truly public
        if condition:
            continue

        if effect == "Allow":
            # Check if Principal is "*" or contains "*"
            if isinstance(principal, list):
                if "*" in principal:
                    return True
            elif principal == "*":
                return True

    return False


class oss_bucket_not_publicly_accessible(Check):
    """Check if OSS bucket is not anonymously or publicly accessible."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for bucket in oss_client.buckets.values():
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=bucket)
            report.region = bucket.region
            report.resource_id = bucket.name
            report.resource_arn = bucket.arn

            # Check bucket ACL
            acl_public = False
            if bucket.acl and bucket.acl != "private":
                if bucket.acl in ["public-read", "public-read-write"]:
                    acl_public = True

            # Check bucket policy
            policy_public = _is_policy_public(bucket.policy)

            # Determine status
            if acl_public or policy_public:
                report.status = "FAIL"
                issues = []
                if acl_public:
                    issues.append(f"Bucket ACL is set to {bucket.acl}")
                if policy_public:
                    issues.append("Bucket policy allows public access (Principal: '*')")
                report.status_extended = (
                    f"OSS bucket {bucket.name} is publicly accessible. "
                    + "; ".join(issues)
                )
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"OSS bucket {bucket.name} is not publicly accessible. "
                    f"ACL is {bucket.acl} and bucket policy does not allow public access."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: oss_bucket_secure_transport_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/oss/oss_bucket_secure_transport_enabled/oss_bucket_secure_transport_enabled.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "oss_bucket_secure_transport_enabled",
  "CheckTitle": "Secure transfer required is set to Enabled",
  "CheckType": [
    "Sensitive file tampering"
  ],
  "ServiceName": "oss",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:oss::account-id:bucket-name",
  "Severity": "high",
  "ResourceType": "AlibabaCloudOSSBucket",
  "Description": "Enable **data encryption in transit**. The secure transfer enhances the security of OSS buckets by only allowing requests to the storage account via a secure connection.\n\nFor example, when calling REST APIs to access storage accounts, the connection must use **HTTPS**. Any requests using HTTP will be rejected.",
  "Risk": "Without **secure transfer enforcement**, OSS buckets may accept HTTP requests, which are not encrypted in transit.\n\nThis exposes data to potential **interception** and **man-in-the-middle attacks**, compromising data confidentiality and integrity.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/85111.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-OSS/enable-secure-transfer.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_oss_bucket\" \"example\" {\n  bucket = \"example-bucket\"\n  \n  policy = jsonencode({\n    \"Version\": \"1\",\n    \"Statement\": [{\n      \"Effect\": \"Deny\",\n      \"Principal\": [\"*\"],\n      \"Action\": [\"oss:*\"],\n      \"Resource\": [\"acs:oss:*:*:example-bucket\", \"acs:oss:*:*:example-bucket/*\"],\n      \"Condition\": {\n        \"Bool\": {\n          \"acs:SecureTransport\": \"false\"\n        }\n      }\n    }]\n  })\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **OSS Console**\n2. In the bucket-list pane, click on a target OSS bucket\n3. Click on **Files** in the top middle of the console\n4. Click on **Authorize**\n5. Configure: `Whole Bucket`, `*`, `None` (Authorized Operation) and `http` (Conditions: Access Method) to deny HTTP access\n6. Click **Save**",
      "Url": "https://hub.prowler.com/check/oss_bucket_secure_transport_enabled"
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

---[FILE: oss_bucket_secure_transport_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/oss/oss_bucket_secure_transport_enabled/oss_bucket_secure_transport_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.oss.oss_client import oss_client


def _is_secure_transport_enforced(policy_document: dict) -> bool:
    """
    Check if a bucket policy enforces secure transport (HTTPS only).

    A policy enforces secure transport if it has:
    - "Condition": {"Bool": {"acs:SecureTransport": ["true"]}} with "Effect": "Allow"
    OR
    - "Condition": {"Bool": {"acs:SecureTransport": ["false"]}} with "Effect": "Deny"

    Args:
        policy_document: The parsed policy document as a dictionary.

    Returns:
        bool: True if secure transport is enforced, False otherwise.
    """
    if not policy_document:
        return False

    statements = policy_document.get("Statement", [])
    if not isinstance(statements, list):
        statements = [statements]

    for statement in statements:
        effect = statement.get("Effect", "")
        condition = statement.get("Condition", {})

        if not condition:
            continue

        # Check for SecureTransport condition
        bool_condition = condition.get("Bool", {})
        secure_transport = bool_condition.get("acs:SecureTransport", [])

        if secure_transport:
            # Check if it's a list or single value
            if isinstance(secure_transport, list):
                secure_transport_value = (
                    secure_transport[0] if secure_transport else None
                )
            else:
                secure_transport_value = secure_transport

            # Secure transport is enforced if:
            # 1. Effect: Allow with SecureTransport: true (only HTTPS allowed)
            # 2. Effect: Deny with SecureTransport: false (HTTP denied)
            if effect == "Allow" and secure_transport_value == "true":
                return True
            elif effect == "Deny" and secure_transport_value == "false":
                return True

    return False


class oss_bucket_secure_transport_enabled(Check):
    """Check if 'Secure transfer required' is set to 'Enabled' for OSS buckets."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for bucket in oss_client.buckets.values():
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource=bucket)
            report.region = bucket.region
            report.resource_id = bucket.name
            report.resource_arn = bucket.arn

            # Check if secure transport is enforced via bucket policy
            secure_transport_enforced = _is_secure_transport_enforced(bucket.policy)

            if secure_transport_enforced:
                report.status = "PASS"
                report.status_extended = (
                    f"OSS bucket {bucket.name} has secure transfer required enabled."
                )
            else:
                report.status = "FAIL"
                if bucket.policy:
                    report.status_extended = f"OSS bucket {bucket.name} does not have secure transfer required enabled."
                else:
                    report.status_extended = f"OSS bucket {bucket.name} does not have secure transfer required enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
