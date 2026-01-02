---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 301
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 301 of 867)

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

---[FILE: kms_key_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_key_not_publicly_accessible/kms_key_not_publicly_accessible.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "kms_key_not_publicly_accessible",
  "CheckTitle": "Cloud KMS key does not grant access to allUsers or allAuthenticatedUsers",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "kms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "AwsKmsKey",
  "Description": "**KMS keys** are assessed for **excessive access** in key policies or grants, including `*` principals and broadly scoped permissions to multiple identities.",
  "Risk": "Broad access to a **KMS key** enables unauthorized `kms:Decrypt` and data-key generation, breaking **confidentiality**. With admin rights, attackers can change policies or schedule deletion, undermining control **integrity** and threatening **availability** of data dependent on the key.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudKMS/publicly-accessible-kms-cryptokeys.html",
    "https://support.icompaas.com/support/solutions/articles/62000232904-1-9-ensure-cloud-kms-cryptokeys-are-not-accessible-to-anonymous-or-public-users-automated-",
    "https://docs.aws.amazon.com/kms/latest/developerguide/determining-access.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws kms put-key-policy --key-id <example_resource_id> --policy-name default --policy '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":\"arn:aws:iam::<account_id>:root\"},\"Action\":\"kms:*\",\"Resource\":\"*\"}]}'",
      "NativeIaC": "```yaml\n# CloudFormation: restrict KMS key policy to account root (removes any public access)\nResources:\n  <example_resource_name>:\n    Type: AWS::KMS::Key\n    Properties:\n      KeyPolicy:\n        Version: '2012-10-17'\n        Statement:\n          - Effect: Allow\n            Principal:\n              AWS: arn:aws:iam::<account_id>:root  # Critical: only account root can access; prevents public \"*\" principals\n            Action: kms:*\n            Resource: '*'\n```",
      "Other": "1. Open AWS Console > Key Management Service (KMS)\n2. Select the affected key and go to the Key policy tab\n3. Click Edit and remove any statement with Principal set to \"*\" (or AWS: \"*\")\n4. Ensure a statement exists that allows only arn:aws:iam::<account_id>:root\n5. Save changes",
      "Terraform": "```hcl\n# Restrict KMS key policy to the account root to avoid any public (\"*\") principals\ndata \"aws_caller_identity\" \"current\" {}\n\nresource \"aws_kms_key\" \"<example_resource_name>\" {\n  policy = jsonencode({\n    Version   = \"2012-10-17\"\n    Statement = [\n      {\n        Effect    = \"Allow\"\n        Principal = { AWS = \"arn:aws:iam::${data.aws_caller_identity.current.account_id}:root\" } # Critical: limit to account root to remove public access\n        Action    = \"kms:*\"\n        Resource  = \"*\"\n      }\n    ]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** to KMS keys:\n- Restrict principals to specific roles and accounts\n- Prefer narrow, time-bound grants\n- Separate key administration from usage\n- Use conditions to limit context\n- Review regularly and remove wildcard or cross-account exposure",
      "Url": "https://hub.prowler.com/check/kms_key_not_publicly_accessible"
    }
  },
  "Categories": [
    "internet-exposed",
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: kms_key_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/aws/services/kms/kms_key_not_publicly_accessible/kms_key_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.iam.lib.policy import is_policy_public
from prowler.providers.aws.services.kms.kms_client import kms_client


class kms_key_not_publicly_accessible(Check):
    def execute(self):
        findings = []
        for key in kms_client.keys:
            if (
                key.manager == "CUSTOMER"
                and key.state == "Enabled"
                and key.policy is not None
            ):  # only customer KMS have policies
                report = Check_Report_AWS(metadata=self.metadata(), resource=key)
                report.status = "PASS"
                report.status_extended = f"KMS key {key.id} is not exposed to Public."
                # If the "Principal" element value is set to { "AWS": "*" } and the policy statement is not using any Condition clauses to filter the access, the selected AWS KMS master key is publicly accessible.
                if is_policy_public(
                    key.policy,
                    kms_client.audited_account,
                    not_allowed_actions=["kms:*"],
                ):
                    report.status = "FAIL"
                    report.status_extended = (
                        f"KMS key {key.id} may be publicly accessible."
                    )
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: lightsail_client.py]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_client.py

```python
from prowler.providers.aws.services.lightsail.lightsail_service import Lightsail
from prowler.providers.common.provider import Provider

lightsail_client = Lightsail(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: lightsail_service.py]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_service.py
Signals: Pydantic

```python
from typing import Dict, List

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class Lightsail(AWSService):
    def __init__(self, provider):
        super().__init__(__class__.__name__, provider)
        self.instances = {}
        self.__threading_call__(self._get_instances)
        self.databases = {}
        self.__threading_call__(self._get_databases)
        self.static_ips = {}
        self.__threading_call__(self._get_static_ips)

    def _get_instances(self, regional_client):
        logger.info("Lightsail - Getting instances...")
        try:
            instance_paginator = regional_client.get_paginator("get_instances")
            for page in instance_paginator.paginate():
                for instance in page["instances"]:
                    arn = instance.get(
                        "arn",
                        f"arn:{self.audited_partition}:lightsail:{regional_client.region}:{self.audited_account}:Instance",
                    )

                    if not self.audit_resources or (
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        ports = []

                        for port_range in instance.get("networking", {}).get(
                            "ports", []
                        ):
                            ports.append(
                                PortRange(
                                    range=(
                                        (
                                            port_range.get("fromPort", "")
                                            if port_range.get("fromPort", "")
                                            == port_range.get("toPort", "")
                                            else f"{port_range.get('fromPort', '')}-{port_range.get('toPort', '')}"
                                        )
                                        if port_range.get("fromPort", "")
                                        else ""
                                    ),
                                    protocol=port_range.get("protocol", ""),
                                    access_from=port_range.get("accessFrom", ""),
                                    access_type=port_range.get("accessType", ""),
                                )
                            )

                        auto_snapshot_enabled = False
                        for add_on in instance.get("addOns", []):
                            if (
                                add_on.get("name") == "AutoSnapshot"
                                and add_on.get("status") == "Enabled"
                            ):
                                auto_snapshot_enabled = True
                                break

                        self.instances[arn] = Instance(
                            name=instance.get("name", ""),
                            id=instance.get("supportCode", ""),
                            arn=arn,
                            tags=instance.get("tags", []),
                            region=instance.get(
                                "location", {"regionName": regional_client.region}
                            ).get("regionName", ""),
                            availability_zone=instance.get("location", {}).get(
                                "availabilityZone", ""
                            ),
                            static_ip=instance.get("isStaticIp", True),
                            public_ip=instance.get("publicIpAddress", ""),
                            private_ip=instance.get("privateIpAddress", ""),
                            ipv6_addresses=instance.get("ipv6Addresses", []),
                            ip_address_type=instance.get("ipAddressType", "ipv4"),
                            ports=ports,
                            auto_snapshot=auto_snapshot_enabled,
                        )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_databases(self, regional_client):
        logger.info("Lightsail - Getting databases...")
        try:
            databases_paginator = regional_client.get_paginator(
                "get_relational_databases"
            )
            for page in databases_paginator.paginate():
                for database in page["relationalDatabases"]:
                    arn = database.get(
                        "arn",
                        f"arn:{self.audited_partition}:lightsail:{regional_client.region}:{self.audited_account}:RelationalDatabase",
                    )

                    if not self.audit_resources or is_resource_filtered(
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.databases[arn] = Database(
                            name=database.get("name", ""),
                            id=database.get("supportCode", ""),
                            arn=arn,
                            tags=database.get("tags", []),
                            region=database.get(
                                "location", {"regionName": regional_client.region}
                            ).get("regionName", ""),
                            availability_zone=database.get("location", {}).get(
                                "availabilityZone", ""
                            ),
                            engine=database.get("engine", ""),
                            engine_version=database.get("engineVersion", ""),
                            status=database.get("state", "unknown"),
                            master_username=database.get("masterUsername", "admin"),
                            public_access=database.get("publiclyAccessible", True),
                        )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_static_ips(self, regional_client):
        logger.info("Lightsail - Getting static IPs...")
        try:
            static_ips_paginator = regional_client.get_paginator("get_static_ips")
            for page in static_ips_paginator.paginate():
                for static_ip in page["staticIps"]:
                    arn = static_ip.get(
                        "arn",
                        f"arn:{self.audited_partition}:lightsail:{regional_client.region}:{self.audited_account}:StaticIp",
                    )

                    if not self.audit_resources or is_resource_filtered(
                        is_resource_filtered(arn, self.audit_resources)
                    ):
                        self.static_ips[arn] = StaticIP(
                            name=static_ip.get("name", ""),
                            id=static_ip.get("supportCode", ""),
                            arn=arn,
                            region=static_ip.get(
                                "location", {"regionName": regional_client.region}
                            ).get("regionName", ""),
                            availability_zone=static_ip.get("location", {}).get(
                                "availabilityZone", ""
                            ),
                            ip_address=static_ip.get("ipAddress", ""),
                            is_attached=static_ip.get("isAttached", True),
                            attached_to=static_ip.get("attachedTo", ""),
                        )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class PortRange(BaseModel):
    range: str
    protocol: str
    access_from: str
    access_type: str


class Instance(BaseModel):
    name: str
    id: str
    arn: str
    tags: List[Dict[str, str]]
    region: str
    availability_zone: str
    static_ip: bool
    public_ip: str
    private_ip: str
    ipv6_addresses: List[str]
    ip_address_type: str
    ports: List[PortRange]
    auto_snapshot: bool


class Database(BaseModel):
    name: str
    id: str
    arn: str
    tags: List[Dict[str, str]]
    region: str
    availability_zone: str
    engine: str
    engine_version: str
    status: str
    master_username: str
    public_access: bool


class StaticIP(BaseModel):
    name: str
    id: str
    arn: str
    region: str
    availability_zone: str
    ip_address: str
    is_attached: bool
    attached_to: str
```

--------------------------------------------------------------------------------

---[FILE: lightsail_database_public.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_database_public/lightsail_database_public.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "lightsail_database_public",
  "CheckTitle": "Lightsail database public access disabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Effects/Data Exposure",
    "TTPs/Initial Access"
  ],
  "ServiceName": "lightsail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**Lightsail managed database** is evaluated for **public accessibility**. When `public mode` is enabled, the database accepts connections from the Internet using its endpoint and port; otherwise, access is limited to authorized Lightsail resources.",
  "Risk": "**Publicly reachable databases** expose confidential data and credentials to the Internet, enabling:\n- **Brute-force** and credential stuffing\n- **Data exfiltration** via unauthorized queries\n- **Service disruption** from scanning or DoS\n\nCompromise enables **lateral movement** and tampering, impacting confidentiality, integrity, and availability.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-databases.html",
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-configuring-database-public-mode.html",
    "https://spinupwp.com/doc/external-database-amazon-lightsail/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lightsail update-relational-database --relational-database-name <example_resource_name> --no-publicly-accessible",
      "NativeIaC": "```yaml\n# CloudFormation: disable public access on an existing Lightsail database\nResources:\n  <example_resource_name>:\n    Type: AWS::Lightsail::Database\n    Properties:\n      RelationalDatabaseName: <example_resource_name>\n      PubliclyAccessible: false  # Critical: turns off public mode so the database is not publicly accessible\n```",
      "Other": "1. In the AWS Console, go to Lightsail > Databases\n2. Select <example_resource_name>\n3. Open the Networking tab\n4. In Public mode, toggle Off\n5. Wait until status returns to Available",
      "Terraform": "```hcl\n# Disable public access for a Lightsail database\nresource \"aws_lightsail_database\" \"<example_resource_name>\" {\n  name                 = \"<example_resource_name>\"\n  availability_zone    = \"<availability_zone>\"\n  blueprint_id         = \"<blueprint_id>\"\n  bundle_id            = \"<bundle_id>\"\n  master_database_name = \"<master_database_name>\"\n  master_username      = \"<master_username>\"\n  master_password      = \"<master_password>\"\n\n  publicly_accessible = false  # Critical: ensures the database is not publicly accessible\n}\n```"
    },
    "Recommendation": {
      "Text": "Disable **public mode** and keep the database reachable only from trusted, private networks.\n\n- Enforce **least privilege** and network segmentation\n- Use bastion hosts, tunnels, or private endpoints for admin access\n- If exposure is unavoidable, restrict by IP, rotate credentials, and monitor connections for **defense in depth**",
      "Url": "https://hub.prowler.com/check/lightsail_database_public"
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

---[FILE: lightsail_database_public.py]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_database_public/lightsail_database_public.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.lightsail.lightsail_client import lightsail_client


class lightsail_database_public(Check):
    def execute(self):
        findings = []

        for database in lightsail_client.databases.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=database)
            report.status = "FAIL"
            report.status_extended = f"Database '{database.name}' is public."

            if not database.public_access:
                report.status = "PASS"
                report.status_extended = f"Database '{database.name}' is not public."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: lightsail_instance_automated_snapshots.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_instance_automated_snapshots/lightsail_instance_automated_snapshots.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "lightsail_instance_automated_snapshots",
  "CheckTitle": "Lightsail instance has automated snapshots enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/NIST 800-53 Controls (USA)",
    "Software and Configuration Checks/Industry and Regulatory Standards/ISO 27001 Controls",
    "Software and Configuration Checks/Industry and Regulatory Standards/PCI-DSS",
    "Effects/Data Destruction"
  ],
  "ServiceName": "lightsail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Amazon Lightsail instances** with **automatic daily snapshots** enabled are identified. The evaluation checks if an instance is configured to take recurring snapshots at a scheduled time.",
  "Risk": "Absent automation, data lacks **point-in-time recovery**, increasing **availability** risk from accidental deletion, corruption, or ransomware. Failed updates or compromise hinder quick rollback, degrading **integrity** and extending RPO/RTO, causing prolonged outages.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-changing-automatic-snapshot-time.html",
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-configuring-automatic-snapshots.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lightsail enable-add-on --region <REGION> --resource-name <example_resource_name> --add-on-request addOnType=AutoSnapshot",
      "NativeIaC": "```yaml\n# CloudFormation: Enable automatic snapshots for a Lightsail instance\nResources:\n  <example_resource_name>:\n    Type: AWS::Lightsail::Instance\n    Properties:\n      InstanceName: <example_resource_name>\n      AvailabilityZone: <example_az>\n      BlueprintId: <example_blueprint_id>\n      BundleId: <example_bundle_id>\n      AddOns:\n        - AddOnType: AutoSnapshot  # Critical: enables automatic snapshots for the instance\n```",
      "Other": "1. Open the AWS Management Console and go to Lightsail\n2. Click Instances and select <example_resource_name>\n3. Open the Snapshots tab\n4. In Automatic snapshots, toggle On and confirm\n5. (Optional) Set a snapshot time if needed; otherwise the default time is used",
      "Terraform": "```hcl\n# Enable automatic snapshots for a Lightsail instance\nresource \"aws_lightsail_instance\" \"<example_resource_name>\" {\n  name              = \"<example_resource_name>\"\n  availability_zone = \"<example_az>\"\n  blueprint_id      = \"<example_blueprint_id>\"\n  bundle_id         = \"<example_bundle_id>\"\n\n  add_on {\n    type   = \"AutoSnapshot\"  # Critical: enables automatic snapshots\n    status = \"Enabled\"       # Critical: turns the add-on on\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable **automatic snapshots** on Lightsail instances and align the schedule with low-traffic windows. Apply **least privilege** to snapshot create/delete, and regularly test restores. Use **defense in depth**: retain multiple versions and replicate backups *for critical workloads* across regions or accounts.",
      "Url": "https://hub.prowler.com/check/lightsail_instance_automated_snapshots"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: lightsail_instance_automated_snapshots.py]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_instance_automated_snapshots/lightsail_instance_automated_snapshots.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.lightsail.lightsail_client import lightsail_client


class lightsail_instance_automated_snapshots(Check):
    def execute(self):
        findings = []
        for instance in lightsail_client.instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "FAIL"
            report.status_extended = (
                f"Instance '{instance.name}' does not have automated snapshots enabled."
            )

            if instance.auto_snapshot:
                report.status = "PASS"
                report.status_extended = (
                    f"Instance '{instance.name}' has automated snapshots enabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: lightsail_instance_public.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_instance_public/lightsail_instance_public.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "lightsail_instance_public",
  "CheckTitle": "Lightsail instance has no publicly accessible ports",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access"
  ],
  "ServiceName": "lightsail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**Lightsail instances** that have a **public IP** and at least one firewall rule allowing **public ports** are treated as publicly exposed. The evaluation inspects instance addressing and port rules to detect any port or range marked `public`.",
  "Risk": "Public IP plus open ports enables Internet scanning, brute force, and exploits.\n- Confidentiality: data exfiltration\n- Integrity: RCE/admin takeover via exposed services\n- Availability: DoS or abuse (botnets, cryptomining), service disruption",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-editing-firewall-rules.html",
    "https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-public-ip-and-private-ip-addresses-in-amazon-lightsail.html#ipv4-addresses"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lightsail put-instance-public-ports --instance-name <example_resource_name> --port-infos '[]'",
      "NativeIaC": "```yaml\n# CloudFormation: remove all public ports from a Lightsail instance\nResources:\n  ClosePublicPorts:\n    Type: AWS::Lightsail::InstancePublicPorts\n    Properties:\n      InstanceName: <example_resource_name>\n      PortInfos: []  # Critical: empty list clears all public ports so the instance is not publicly exposed\n```",
      "Other": "1. Sign in to the AWS Lightsail console\n2. Go to Instances and select <example_resource_name>\n3. Open the Networking tab\n4. In IPv4 Firewall, delete all existing rules, then Save\n5. If IPv6 is enabled, in IPv6 Firewall, delete all existing rules, then Save",
      "Terraform": "```hcl\n# Terraform: ensure no public ports are open on the Lightsail instance\nresource \"aws_lightsail_instance_public_ports\" \"<example_resource_name>\" {\n  instance_name = \"<example_resource_name>\"\n\n  # Critical: no port_info blocks -> no public ports are configured (closes all)\n  dynamic \"port_info\" {\n    for_each = []\n    content {\n      from_port = 0\n      to_port   = 0\n      protocol  = \"tcp\"\n    }\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** network access: close unused ports, restrict sources (avoid `0.0.0.0/0`), and review IPv4/IPv6 rules. Use a **VPN** or **bastion host** for administration. Place services behind private networking or load balancers, and harden/monitor any required public endpoints.",
      "Url": "https://hub.prowler.com/check/lightsail_instance_public"
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

---[FILE: lightsail_instance_public.py]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_instance_public/lightsail_instance_public.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.lightsail.lightsail_client import lightsail_client


class lightsail_instance_public(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for instance in lightsail_client.instances.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"Instance '{instance.name}' is not publicly exposed."
            )

            open_public_ports = [
                port for port in instance.ports if port.access_type == "public"
            ]

            if instance.public_ip != "" and len(open_public_ports) > 0:
                report.status = "FAIL"
                report.status_extended = f"Instance '{instance.name}' is publicly exposed. The open ports are: {', '.join(open_port.range for open_port in open_public_ports)}"

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: lightsail_static_ip_unused.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_static_ip_unused/lightsail_static_ip_unused.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "lightsail_static_ip_unused",
  "CheckTitle": "Lightsail static IP is associated with an instance",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Resource Consumption"
  ],
  "ServiceName": "lightsail",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "**Amazon Lightsail static IPs** detected as **not associated** with any instance, indicating reserved but unused addresses.\n\nThe evaluation focuses on the association state of each static IP to highlight potential leftovers.",
  "Risk": "**Unattached static IPs** incur ongoing charges and indicate asset drift. If DNS or apps still reference the address, requests are blackholed, impacting **availability**. Later attaching the same IP to an unintended host can expose services and data, affecting **confidentiality** and **integrity**.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-public-ip-and-private-ip-addresses-in-amazon-lightsail.html",
    "https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws lightsail attach-static-ip --static-ip-name <example_resource_name> --instance-name <example_resource_name>",
      "NativeIaC": "```yaml\nResources:\n  AttachStaticIp:\n    Type: AWS::Lightsail::StaticIpAttachment\n    Properties:\n      InstanceName: <example_resource_name>  # Critical: instance to attach to; marks IP as attached\n      StaticIpName: <example_resource_name>  # Critical: static IP to attach; fixes FAIL by associating it\n```",
      "Other": "1. In the AWS Console, go to Lightsail > Networking > Static IPs\n2. Select the unused static IP and click \"Attach to instance\"\n3. Choose the target instance and confirm\n4. Verify the static IP now shows as attached",
      "Terraform": "```hcl\nresource \"aws_lightsail_static_ip_attachment\" \"attach\" {\n  static_ip_name = \"<example_resource_name>\"  # Critical: specify the static IP to attach\n  instance_name  = \"<example_resource_name>\"  # Critical: target instance; association makes check PASS\n}\n```"
    },
    "Recommendation": {
      "Text": "Release unused static IPs or attach them to the intended instance.\n\nApply **least privilege** for IP allocation, enforce tagging and ownership, and run periodic audits with alerts for unattached addresses. *If reservation is required*, document purpose and set a time limit to prevent drift and cost.",
      "Url": "https://hub.prowler.com/check/lightsail_static_ip_unused"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: lightsail_static_ip_unused.py]---
Location: prowler-master/prowler/providers/aws/services/lightsail/lightsail_static_ip_unused/lightsail_static_ip_unused.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.lightsail.lightsail_client import lightsail_client


class lightsail_static_ip_unused(Check):
    def execute(self) -> Check_Report_AWS:
        findings = []

        for static_ip in lightsail_client.static_ips.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=static_ip)
            report.status = "FAIL"
            report.status_extended = (
                f"Static IP '{static_ip.name}' is not associated with any instance."
            )

            if static_ip.is_attached:
                report.status = "PASS"
                report.status_extended = f"Static IP '{static_ip.name}' is associated with the instance '{static_ip.attached_to}'."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: macie_client.py]---
Location: prowler-master/prowler/providers/aws/services/macie/macie_client.py

```python
from prowler.providers.aws.services.macie.macie_service import Macie
from prowler.providers.common.provider import Provider

macie_client = Macie(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: macie_service.py]---
Location: prowler-master/prowler/providers/aws/services/macie/macie_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.aws.lib.service.service import AWSService


class Macie(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("macie2", provider)
        self.sessions = []
        self.__threading_call__(self._get_macie_session)
        self.__threading_call__(
            self._get_automated_discovery_configuration, self.sessions
        )

    def _get_session_arn_template(self, region):
        return f"arn:{self.audited_partition}:macie:{region}:{self.audited_account}:session"

    def _get_macie_session(self, regional_client):
        logger.info("Macie - Get Macie Session...")
        try:
            self.sessions.append(
                Session(
                    status=regional_client.get_macie_session()["status"],
                    region=regional_client.region,
                )
            )

        except Exception as error:
            if "Macie is not enabled" in str(error):
                self.sessions.append(
                    Session(
                        status="DISABLED",
                        region=regional_client.region,
                    )
                )
            else:
                logger.error(
                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_automated_discovery_configuration(self, session):
        logger.info("Macie - Get Automated Discovery Configuration...")
        try:
            if session.status == "ENABLED":
                regional_client = self.regional_clients[session.region]
                session.automated_discovery_status = (
                    regional_client.get_automated_discovery_configuration().get(
                        "status", "DISABLED"
                    )
                )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Session(BaseModel):
    status: str
    automated_discovery_status: str = "DISABLED"
    region: str
```

--------------------------------------------------------------------------------

---[FILE: macie_automated_sensitive_data_discovery_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/macie/macie_automated_sensitive_data_discovery_enabled/macie_automated_sensitive_data_discovery_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "macie_automated_sensitive_data_discovery_enabled",
  "CheckTitle": "Macie automated sensitive data discovery is enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "macie",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Other",
  "Description": "**Amazon Macie** administrator account has **automated sensitive data discovery** enabled for S3 data. The evaluation confirms the feature's status for the account in each Region.",
  "Risk": "Without continuous discovery, sensitive S3 objects remain unclassified and unnoticed, weakening **confidentiality**. Over-permissive or public access can persist undetected, enabling **data exfiltration** and delaying containment and **forensic** response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/config/latest/developerguide/macie-auto-sensitive-data-discovery-check.html",
    "https://docs.aws.amazon.com/securityhub/latest/userguide/macie-controls.html#macie-2",
    "https://docs.aws.amazon.com/macie/latest/user/discovery-asdd-account-enable.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws macie2 update-automated-discovery-configuration --status ENABLED --region <REGION>",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, open Amazon Macie\n2. Select the correct Region from the Region selector\n3. Go to Settings > Automated sensitive data discovery\n4. Click Enable under Status (choose My account if prompted)\n5. Repeat in other Regions where Macie is enabled if needed",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable and maintain `automated sensitive data discovery` for the Macie administrator across required Regions. Include relevant buckets, tune identifiers and allow lists to reduce noise, and route findings to monitoring. Complement with **least privilege** on S3 and **defense in depth** for data protection.",
      "Url": "https://hub.prowler.com/check/macie_automated_sensitive_data_discovery_enabled"
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

---[FILE: macie_automated_sensitive_data_discovery_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/macie/macie_automated_sensitive_data_discovery_enabled/macie_automated_sensitive_data_discovery_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.macie.macie_client import macie_client


class macie_automated_sensitive_data_discovery_enabled(Check):
    def execute(self):
        findings = []
        for session in macie_client.sessions:
            if session.status == "ENABLED":
                report = Check_Report_AWS(metadata=self.metadata(), resource=session)
                report.resource_arn = macie_client._get_session_arn_template(
                    session.region
                )
                report.resource_id = macie_client.audited_account
                report.status = "FAIL"
                report.status_extended = "Macie is enabled but it does not have automated sensitive data discovery."

                if session.automated_discovery_status == "ENABLED":
                    report.status = "PASS"
                    report.status_extended = (
                        "Macie has automated sensitive data discovery enabled."
                    )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
