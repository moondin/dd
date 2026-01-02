---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 225
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 225 of 867)

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

---[FILE: rds_instance_tde_enabled.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_tde_enabled/rds_instance_tde_enabled.metadata.json
Signals: Next.js

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_tde_enabled",
  "CheckTitle": "TDE is set to Enabled on for applicable database instance",
  "CheckType": [
    "Sensitive file tampering",
    "Intrusion into applications"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "Enable **Transparent Data Encryption (TDE)** on every RDS instance. RDS Database TDE helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and log files at rest.\n\nNo changes to the application are required.",
  "Risk": "**Data at rest** that is not encrypted is vulnerable to unauthorized access if the underlying storage media or backups are compromised.\n\nTDE protects against physical theft and unauthorized access to storage systems.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/33510.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/enable-sql-database-tde.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifyDBInstanceTDE --DBInstanceId <instance_id> --TDEStatus Enabled",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_db_instance\" \"example\" {\n  engine           = \"MySQL\"\n  engine_version   = \"8.0\"\n  instance_type    = \"rds.mysql.s1.small\"\n  instance_storage = 20\n  tde_status       = \"Enabled\"\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. Go to **Data Security** > **TDE** tab\n3. Find TDE Status and click the switch next to **Disabled**\n4. Choose automatically generated key or custom key\n5. Click **Confirm**",
      "Url": "https://hub.prowler.com/check/rds_instance_tde_enabled"
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

---[FILE: rds_instance_tde_enabled.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_tde_enabled/rds_instance_tde_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_tde_enabled(Check):
    """Check if TDE is set to Enabled for applicable database instance."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in rds_client.instances:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

            if instance.tde_status == "Enabled":
                report.status = "PASS"
                report.status_extended = (
                    f"RDS Instance {instance.name} has TDE enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance {instance.name} does not have TDE enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: rds_instance_tde_key_custom.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_tde_key_custom/rds_instance_tde_key_custom.metadata.json
Signals: Next.js

```json
{
  "Provider": "alibabacloud",
  "CheckID": "rds_instance_tde_key_custom",
  "CheckTitle": "RDS instance TDE protector is encrypted with BYOK (Use your own key)",
  "CheckType": [
    "Sensitive file tampering",
    "Intrusion into applications"
  ],
  "ServiceName": "rds",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:rds:region:account-id:dbinstance/{dbinstance-id}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudRDSDBInstance",
  "Description": "**TDE with BYOK** support provides increased transparency and control, increased security with an HSM-backed KMS service, and promotion of separation of duties.\n\nBased on business needs or criticality of data, it is recommended that the TDE protector is encrypted by a key that is managed by the data owner (**BYOK**).",
  "Risk": "Using **service-managed keys** means the cloud provider manages the encryption keys. **BYOK (Bring Your Own Key)** gives you full control over the key lifecycle and permissions.\n\nThis ensures that even the cloud provider cannot access your data without your explicit permission.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/96121.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-RDS/enable-tde-with-cmk.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun rds ModifyDBInstanceTDE --DBInstanceId <instance_id> --TDEStatus Enabled --EncryptionKey <kms_key_id>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "resource \"alicloud_db_instance\" \"example\" {\n  engine           = \"MySQL\"\n  engine_version   = \"8.0\"\n  instance_type    = \"rds.mysql.s1.small\"\n  instance_storage = 20\n  tde_status       = \"Enabled\"\n  encryption_key   = alicloud_kms_key.example.id\n}"
    },
    "Recommendation": {
      "Text": "1. Log on to the **RDS Console**\n2. Go to **Data Security** > **TDE** tab\n3. Click the switch next to **Disabled**\n4. In the displayed dialog box, choose **custom key**\n5. Click **Confirm**",
      "Url": "https://hub.prowler.com/check/rds_instance_tde_key_custom"
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

---[FILE: rds_instance_tde_key_custom.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/rds/rds_instance_tde_key_custom/rds_instance_tde_key_custom.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.rds.rds_client import rds_client


class rds_instance_tde_key_custom(Check):
    """Check if RDS instance TDE protector is encrypted with BYOK."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        for instance in rds_client.instances:
            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=instance
            )
            report.region = instance.region
            report.resource_id = instance.id
            report.resource_arn = f"acs:rds:{instance.region}:{rds_client.audited_account}:dbinstance/{instance.id}"

            # TDE must be enabled AND key must be custom (not service managed)
            # Note: The API response for TDEKeyId usually indicates if it's a custom KMS key
            # If it's a UUID-like string, it's likely a KMS key. If it's "ServiceManaged" or similar, it's not.
            # For Alibaba Cloud, typically if you supply a KeyId it's BYOK.

            if instance.tde_status == "Enabled" and instance.tde_key_id:
                report.status = "PASS"
                report.status_extended = f"RDS Instance {instance.name} has TDE enabled with custom key {instance.tde_key_id}."
            elif instance.tde_status == "Enabled":
                report.status = "FAIL"
                report.status_extended = f"RDS Instance {instance.name} has TDE enabled but uses service-managed key."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"RDS Instance {instance.name} does not have TDE enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_client.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_client.py

```python
from prowler.providers.alibabacloud.services.securitycenter.securitycenter_service import (
    SecurityCenter,
)
from prowler.providers.common.provider import Provider

securitycenter_client = SecurityCenter(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_service.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_service.py
Signals: Pydantic

```python
from alibabacloud_sas20181203 import models as sas_models
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.alibabacloud.lib.service.service import AlibabaCloudService


class SecurityCenter(AlibabaCloudService):
    """
    Security Center service class for Alibaba Cloud.

    This class provides methods to interact with Alibaba Cloud Security Center
    to retrieve vulnerabilities, agent status, etc.
    """

    def __init__(self, provider):
        # Call AlibabaCloudService's __init__
        super().__init__("sas", provider, global_service=True)

        self.instance_vulnerabilities = {}
        self.instance_agents = {}
        self.uninstalled_machines = []
        self.notice_configs = {}
        self.vul_configs = {}
        self.concern_necessity = []
        self.edition = None
        self.version = None
        self._describe_vulnerabilities()
        self._describe_agents()
        self._list_uninstalled_machines()
        self._describe_notice_configs()
        self._describe_vul_config()
        self._describe_concern_necessity()
        self._get_edition()

    def _describe_vulnerabilities(self):
        """List vulnerabilities for ECS instances."""
        logger.info("Security Center - Describing Vulnerabilities...")

        try:
            # Get all vulnerabilities
            # Type: "cve" for CVE vulnerabilities, "app" for application vulnerabilities, "sys" for system vulnerabilities
            # We'll check all types by making separate requests
            vulnerability_types = ["cve", "app", "sys"]

            for vul_type in vulnerability_types:
                request = sas_models.DescribeVulListRequest()
                request.type = vul_type
                request.current_page = 1
                request.page_size = 100

                while True:
                    response = self.client.describe_vul_list(request)

                    if response and response.body and response.body.vul_records:
                        vul_records = response.body.vul_records
                        if not vul_records:
                            break

                        for vul_record in vul_records:
                            instance_id = getattr(vul_record, "instance_id", "")
                            if not instance_id:
                                continue

                            # Get instance name and region from the vulnerability record
                            instance_name = getattr(
                                vul_record, "instance_name", instance_id
                            )
                            region = getattr(vul_record, "region_id", "")

                            instance_key = (
                                f"{region}:{instance_id}" if region else instance_id
                            )

                            if instance_key not in self.instance_vulnerabilities:
                                self.instance_vulnerabilities[instance_key] = (
                                    InstanceVulnerability(
                                        instance_id=instance_id,
                                        instance_name=instance_name,
                                        region=region,
                                        has_vulnerabilities=True,
                                        vulnerability_count=1,
                                    )
                                )
                            else:
                                # Increment vulnerability count
                                self.instance_vulnerabilities[
                                    instance_key
                                ].vulnerability_count += 1

                        # Check if there are more pages
                        total_count = getattr(response.body, "total_count", 0)
                        if request.current_page * request.page_size >= total_count:
                            break
                        request.current_page += 1
                    else:
                        break

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_agents(self):
        """List Security Center agent status for ECS instances."""
        logger.info("Security Center - Describing Agents...")

        try:
            # Get all agents
            request = sas_models.DescribeCloudCenterInstancesRequest()
            request.current_page = 1
            request.page_size = 100

            while True:
                response = self.client.describe_cloud_center_instances(request)

                if response and response.body and response.body.instances:
                    instances = response.body.instances
                    if not instances:
                        break

                    for instance_data in instances:
                        instance_id = getattr(instance_data, "instance_id", "")
                        if not instance_id:
                            continue

                        instance_name = getattr(
                            instance_data, "instance_name", instance_id
                        )
                        region = getattr(instance_data, "region_id", "")
                        agent_status = getattr(instance_data, "client_status", "")

                        # Determine if agent is installed and online
                        agent_installed = agent_status in ["online", "offline"]
                        is_online = agent_status == "online"

                        instance_key = (
                            f"{region}:{instance_id}" if region else instance_id
                        )

                        self.instance_agents[instance_key] = InstanceAgent(
                            instance_id=instance_id,
                            instance_name=instance_name,
                            region=region,
                            agent_installed=agent_installed,
                            agent_status=(
                                agent_status
                                if agent_status
                                else ("online" if is_online else "not_installed")
                            ),
                        )

                    # Check if there are more pages
                    total_count = getattr(response.body, "total_count", 0)
                    if request.current_page * request.page_size >= total_count:
                        break
                    request.current_page += 1
                else:
                    break

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_uninstalled_machines(self):
        """List machines without Security Center agent installed."""
        logger.info("Security Center - Listing Uninstalled Machines...")

        try:
            # Get all machines without agent installed
            request = sas_models.ListUninstallAegisMachinesRequest()
            request.current_page = 1
            request.page_size = 100

            while True:
                response = self.client.list_uninstall_aegis_machines(request)

                if response and response.body and response.body.machine_list:
                    machines = response.body.machine_list
                    if not machines:
                        break

                    for machine_data in machines:
                        instance_id = getattr(machine_data, "instance_id", "")
                        if not instance_id:
                            continue

                        self.uninstalled_machines.append(
                            UninstalledMachine(
                                instance_id=instance_id,
                                instance_name=getattr(
                                    machine_data, "instance_name", instance_id
                                ),
                                region=getattr(machine_data, "region_id", "")
                                or getattr(machine_data, "machine_region", ""),
                                uuid=getattr(machine_data, "uuid", ""),
                                os=getattr(machine_data, "os", ""),
                                internet_ip=getattr(machine_data, "internet_ip", ""),
                                intranet_ip=getattr(machine_data, "intranet_ip", ""),
                            )
                        )

                    # Check if there are more pages
                    total_count = getattr(response.body, "total_count", 0)
                    if request.current_page * request.page_size >= total_count:
                        break
                    request.current_page += 1
                else:
                    break

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_notice_configs(self):
        """List notification configurations for Security Center."""
        logger.info("Security Center - Describing Notice Configs...")

        try:
            # Get notification configurations
            request = sas_models.DescribeNoticeConfigRequest()
            response = self.client.describe_notice_config(request)

            if response and response.body and response.body.notice_config_list:
                notice_configs = response.body.notice_config_list

                for config_data in notice_configs:
                    project = getattr(config_data, "project", "")
                    if not project:
                        continue

                    route = getattr(config_data, "route", 0)
                    time_limit = getattr(config_data, "time_limit", 0)

                    self.notice_configs[project] = NoticeConfig(
                        project=project,
                        route=route,
                        time_limit=time_limit,
                        notification_enabled=route != 0,
                    )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_vul_config(self):
        """List vulnerability scan configuration."""
        logger.info("Security Center - Describing Vulnerability Config...")

        try:
            # Get vulnerability scan configuration
            request = sas_models.DescribeVulConfigRequest()
            response = self.client.describe_vul_config(request)

            if response and response.body and response.body.target_configs:
                target_configs = response.body.target_configs

                for config_data in target_configs:
                    config_type = getattr(config_data, "type", "")
                    config_value = getattr(config_data, "config", "")

                    if config_type:
                        self.vul_configs[config_type] = VulConfig(
                            type=config_type,
                            config=config_value,
                            enabled=config_value != "off",
                        )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_concern_necessity(self):
        """List vulnerability scan level priorities."""
        logger.info("Security Center - Describing Concern Necessity...")

        try:
            # Get vulnerability scan level priorities
            request = sas_models.DescribeConcernNecessityRequest()
            response = self.client.describe_concern_necessity(request)

            if response and response.body:
                concern_necessity = getattr(response.body, "concern_necessity", [])
                if concern_necessity:
                    self.concern_necessity = concern_necessity
                else:
                    self.concern_necessity = []

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            self.concern_necessity = []

    def _get_edition(self):
        """Get Security Center edition."""
        logger.info("Security Center - Getting Edition...")

        # Version mapping: 1=Basic, 3=Enterprise, 5=Advanced, 6=Anti-virus, 7=Ultimate, 8=Multi-Version, 10=Value-added Plan
        version_to_edition = {
            1: "Basic",
            3: "Enterprise",
            5: "Advanced",
            6: "Anti-virus",
            7: "Ultimate",
            8: "Multi-Version",
            10: "Value-added Plan",
        }

        try:
            # Get Security Center edition
            request = sas_models.DescribeVersionConfigRequest()
            response = self.client.describe_version_config(request)

            if response and response.body:
                # Get Version field from response
                version = getattr(response.body, "version", None)

                if version is not None:
                    # Map version number to edition name
                    self.edition = version_to_edition.get(
                        version, f"Unknown (Version {version})"
                    )
                    self.version = version
                    logger.info(
                        f"Security Center Version: {version}, Edition: {self.edition}"
                    )
                else:
                    self.edition = "Unknown"
                    self.version = None
            else:
                self.edition = "Unknown"
                self.version = None

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            self.edition = "Unknown"
            self.version = None


# Models for Security Center service
class InstanceVulnerability(BaseModel):
    """Security Center Instance Vulnerability model."""

    instance_id: str
    instance_name: str
    region: str
    has_vulnerabilities: bool
    vulnerability_count: int = 0


class InstanceAgent(BaseModel):
    """Security Center Instance Agent model."""

    instance_id: str
    instance_name: str
    region: str
    agent_installed: bool
    agent_status: str = ""  # "online", "offline", "not_installed"


class UninstalledMachine(BaseModel):
    """Security Center Uninstalled Machine model."""

    instance_id: str
    instance_name: str
    region: str
    uuid: str = ""
    os: str = ""
    internet_ip: str = ""
    intranet_ip: str = ""


class NoticeConfig(BaseModel):
    """Security Center Notice Config model."""

    project: str
    route: int  # 0 = no notification, >0 = notification enabled
    time_limit: int = 0
    notification_enabled: bool


class VulConfig(BaseModel):
    """Security Center Vulnerability Config model."""

    type: str  # yum, cve, sys, cms, emg, etc.
    config: str  # "off", "on", or other values
    enabled: bool  # True if config != "off"
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_advanced_or_enterprise_edition.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_advanced_or_enterprise_edition/securitycenter_advanced_or_enterprise_edition.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "securitycenter_advanced_or_enterprise_edition",
  "CheckTitle": "Security Center is Advanced or Enterprise Edition",
  "CheckType": [
    "Suspicious process",
    "Webshell",
    "Unusual logon",
    "Sensitive file tampering",
    "Malicious software",
    "Precision defense"
  ],
  "ServiceName": "securitycenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:sas::account-id:security-center",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSecurityCenter",
  "Description": "The **Advanced or Enterprise Edition** enables threat detection for network and endpoints, providing **malware detection**, **webshell detection**, and **anomaly detection** in Security Center.",
  "Risk": "Using **Basic or Free Edition** of Security Center may not provide comprehensive protection against cloud threats.\n\n**Advanced or Enterprise Edition** allows for full protection to defend against cloud threats.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/product/28498.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SecurityCenter/security-center-plan.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "Logon to Security Center Console > Select Overview > Click Upgrade > Select Advanced or Enterprise Edition > Finish order placement",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **Security Center Console**\n2. Select **Overview**\n3. Click **Upgrade**\n4. Select **Advanced** or **Enterprise Edition**\n5. Finish order placement",
      "Url": "https://hub.prowler.com/check/securitycenter_advanced_or_enterprise_edition"
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

---[FILE: securitycenter_advanced_or_enterprise_edition.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_advanced_or_enterprise_edition/securitycenter_advanced_or_enterprise_edition.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.securitycenter.securitycenter_client import (
    securitycenter_client,
)


class securitycenter_advanced_or_enterprise_edition(Check):
    """Check if Security Center is Advanced or Enterprise Edition."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        report = CheckReportAlibabaCloud(metadata=self.metadata(), resource={})
        report.region = securitycenter_client.region
        report.resource_id = securitycenter_client.audited_account
        report.resource_arn = (
            f"acs:sas::{securitycenter_client.audited_account}:security-center"
        )

        version = securitycenter_client.version
        edition = securitycenter_client.edition

        if version is None or edition == "Unknown":
            report.status = "MANUAL"
            report.status_extended = (
                "Security Center edition could not be determined. "
                "Please check Security Center Console manually."
            )
        else:
            # Check if version is 3 (Enterprise) or 5 (Advanced)
            # Version mapping: 1=Basic, 3=Enterprise, 5=Advanced, 6=Anti-virus, 7=Ultimate, 8=Multi-Version, 10=Value-added Plan
            if version == 3 or version == 5:
                report.status = "PASS"
                report.status_extended = (
                    f"Security Center is {edition} edition (Version {version}), which provides "
                    "threat detection for network and endpoints, malware detection, "
                    "webshell detection and anomaly detection."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Security Center is {edition} edition (Version {version}). "
                    "It is recommended to use Advanced Edition (Version 5) or Enterprise Edition (Version 3) "
                    "for full protection to defend cloud threats."
                )

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_all_assets_agent_installed.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_all_assets_agent_installed/securitycenter_all_assets_agent_installed.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "securitycenter_all_assets_agent_installed",
  "CheckTitle": "All assets are installed with security agent",
  "CheckType": [
    "Suspicious process",
    "Webshell",
    "Unusual logon",
    "Sensitive file tampering",
    "Malicious software"
  ],
  "ServiceName": "securitycenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:sas:region:account-id:machine/{machine-id}",
  "Severity": "high",
  "ResourceType": "AlibabaCloudSecurityCenterMachine",
  "Description": "The endpoint protection of **Security Center** requires an agent to be installed on the endpoint to work. Such an agent-based approach allows the security center to provide comprehensive endpoint intrusion detection and protection capabilities.\n\nThis includes remote logon detection, **webshell detection** and removal, **anomaly detection** (detection of abnormal process behaviors and network connections), and detection of changes in key files and suspicious accounts.",
  "Risk": "Assets without **Security Center agent** installed are not protected by endpoint intrusion detection and protection capabilities, leaving them vulnerable to security threats.\n\nUnprotected assets become blind spots in your security monitoring.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/111650.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SecurityCenter/install-security-agent.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun sas InstallUninstallAegis --InstanceIds <instance_id_1>,<instance_id_2>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **Security Center Console**\n2. Select **Settings**\n3. Click **Agent**\n4. On the `Client to be installed` tab, select all items on the list\n5. Click **One-click installation** to install the agent on all assets",
      "Url": "https://hub.prowler.com/check/securitycenter_all_assets_agent_installed"
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

---[FILE: securitycenter_all_assets_agent_installed.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_all_assets_agent_installed/securitycenter_all_assets_agent_installed.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.securitycenter.securitycenter_client import (
    securitycenter_client,
)


class securitycenter_all_assets_agent_installed(Check):
    """Check if all assets are installed with security agent."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        uninstalled_machines = securitycenter_client.uninstalled_machines

        if not uninstalled_machines:
            # All assets have the agent installed
            report = CheckReportAlibabaCloud(metadata=self.metadata(), resource={})
            report.region = securitycenter_client.region
            report.resource_id = securitycenter_client.audited_account
            report.resource_arn = (
                f"acs:sas::{securitycenter_client.audited_account}:security-center"
            )
            report.status = "PASS"
            report.status_extended = "All assets have Security Center agent installed."
            findings.append(report)
        else:
            # Report each uninstalled machine
            for machine in uninstalled_machines:
                report = CheckReportAlibabaCloud(
                    metadata=self.metadata(), resource=machine
                )
                report.region = machine.region
                report.resource_id = machine.instance_id
                report.resource_arn = (
                    f"acs:ecs:{machine.region}:{securitycenter_client.audited_account}:instance/{machine.instance_id}"
                    if machine.instance_id.startswith("i-")
                    or "ecs" in machine.instance_id.lower()
                    else f"acs:sas:{machine.region}:{securitycenter_client.audited_account}:machine/{machine.instance_id}"
                )
                report.status = "FAIL"
                report.status_extended = (
                    f"Asset {machine.instance_name if machine.instance_name else machine.instance_id} "
                    f"({machine.instance_id}) does not have Security Center agent installed. "
                    f"Region: {machine.region}, OS: {machine.os if machine.os else 'Unknown'}."
                )
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: securitycenter_notification_enabled_high_risk.metadata.json]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_notification_enabled_high_risk/securitycenter_notification_enabled_high_risk.metadata.json

```json
{
  "Provider": "alibabacloud",
  "CheckID": "securitycenter_notification_enabled_high_risk",
  "CheckTitle": "Notification is enabled on all high risk items",
  "CheckType": [
    "Suspicious process",
    "Webshell",
    "Unusual logon",
    "Sensitive file tampering",
    "Malicious software"
  ],
  "ServiceName": "securitycenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "acs:sas::account-id:notice-config/{project}",
  "Severity": "medium",
  "ResourceType": "AlibabaCloudSecurityCenterNoticeConfig",
  "Description": "Enable all **risk item notifications** in Vulnerability, Baseline Risks, Alerts, and AccessKey Leak event detection categories.\n\nThis ensures that relevant security operators receive notifications as soon as security events occur.",
  "Risk": "Without **notifications enabled** for high-risk items, security operators may not be aware of critical security events in a timely manner, potentially leading to **delayed response** and **increased security exposure**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.alibabacloud.com/help/doc-detail/111648.htm",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/alibaba-cloud/AlibabaCloud-SecurityCenter/enable-high-risk-item-notifications.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aliyun sas ModifyNoticeConfig --Project <project_name> --Route <route_value>",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log on to the **Security Center Console**\n2. Select **Settings**\n3. Click **Notification**\n4. Enable all high-risk items on Notification setting\n\nRoute values: `1`=text message, `2`=email, `3`=internal message, `4`=text+email, `5`=text+internal, `6`=email+internal, `7`=all methods",
      "Url": "https://hub.prowler.com/check/securitycenter_notification_enabled_high_risk"
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

---[FILE: securitycenter_notification_enabled_high_risk.py]---
Location: prowler-master/prowler/providers/alibabacloud/services/securitycenter/securitycenter_notification_enabled_high_risk/securitycenter_notification_enabled_high_risk.py

```python
from prowler.lib.check.models import Check, CheckReportAlibabaCloud
from prowler.providers.alibabacloud.services.securitycenter.securitycenter_client import (
    securitycenter_client,
)


class securitycenter_notification_enabled_high_risk(Check):
    """Check if notification is enabled on all high risk items."""

    def execute(self) -> list[CheckReportAlibabaCloud]:
        findings = []

        # High-risk categories based on CIS benchmark:
        # - Vulnerability: sas_vulnerability, yundun_sas_vul_Emergency
        # - Baseline Risks: sas_healthcheck
        # - Alerts: sas_suspicious, suspicious, remotelogin, webshell, bruteforcesuccess
        # - Accesskey Leak: yundun_sas_ak_leakage
        high_risk_projects = [
            "sas_vulnerability",  # Vulnerability
            "yundun_sas_vul_Emergency",  # Emergency vulnerabilities
            "sas_healthcheck",  # Baseline Risks
            "sas_suspicious",  # Alerts - Suspicious
            "suspicious",  # Alerts - Suspicious
            "remotelogin",  # Alerts - Remote login
            "webshell",  # Alerts - Webshell
            "bruteforcesuccess",  # Alerts - Brute force success
            "yundun_sas_ak_leakage",  # Accesskey Leak
        ]

        notice_configs = securitycenter_client.notice_configs

        # Check each high-risk project
        for project in high_risk_projects:
            config = notice_configs.get(project)

            report = CheckReportAlibabaCloud(
                metadata=self.metadata(), resource=config if config else {}
            )
            report.region = securitycenter_client.region
            report.resource_id = project
            report.resource_arn = f"acs:sas::{securitycenter_client.audited_account}:notice-config/{project}"

            if not config:
                # Configuration not found - may not be available or not configured
                report.status = "MANUAL"
                report.status_extended = (
                    f"Notification configuration for high-risk item '{project}' "
                    "could not be determined. Please check Security Center Console manually."
                )
            elif config.notification_enabled:
                # Route != 0 means notification is enabled
                report.status = "PASS"
                report.status_extended = (
                    f"Notification is enabled for high-risk item '{project}'."
                )
            else:
                # Route == 0 means notification is disabled
                report.status = "FAIL"
                report.status_extended = (
                    f"Notification is not enabled for high-risk item '{project}'."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
