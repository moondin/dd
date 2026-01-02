---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 260
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 260 of 867)

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

---[FILE: directconnect_connection_redundancy.py]---
Location: prowler-master/prowler/providers/aws/services/directconnect/directconnect_connection_redundancy/directconnect_connection_redundancy.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.directconnect.directconnect_client import (
    directconnect_client,
)


class directconnect_connection_redundancy(Check):
    def execute(self):
        findings = []
        if len(directconnect_client.connections):
            regions = {}
            for conn in directconnect_client.connections.values():
                if conn.region not in regions:
                    regions[conn.region] = {}
                    regions[conn.region]["Connections"] = 0
                    regions[conn.region]["Locations"] = set()
                regions[conn.region]["Connections"] += 1
                regions[conn.region]["Locations"].add(conn.location)

            for region, connections in regions.items():
                report = Check_Report_AWS(
                    metadata=self.metadata(), resource=connections
                )
                report.region = region
                report.resource_arn = directconnect_client._get_connection_arn_template(
                    region
                )
                report.resource_id = "unknown"
                if connections["Connections"] == 1:
                    report.status = "FAIL"
                    report.status_extended = (
                        "There is only one Direct Connect connection."
                    )
                else:  # Connection Redundancy is met.
                    if (
                        len(connections["Locations"]) == 1
                    ):  # All connections use the same location
                        report.status = "FAIL"
                        report.status_extended = f"There is only one location {next(iter(connections['Locations']))} used by all the Direct Connect connections."
                    else:  # Connection Redundancy and Location Redundancy is also met
                        report.status = "PASS"
                        report.status_extended = f"There are {connections['Connections']} Direct Connect connections across {len(connections['Locations'])} locations."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: directconnect_virtual_interface_redundancy.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/directconnect/directconnect_virtual_interface_redundancy/directconnect_virtual_interface_redundancy.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "directconnect_virtual_interface_redundancy",
  "CheckTitle": "Direct Connect gateway or virtual private gateway has at least two virtual interfaces on different Direct Connect connections",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Denial of Service"
  ],
  "ServiceName": "directconnect",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**Direct Connect gateways** and **virtual private gateways** are assessed for **interface redundancy**: multiple virtual interfaces (`VIFs`) distributed across more than one **Direct Connect connection**.\n\n*Gateways with only one VIF or with all VIFs on a single connection are identified.*",
  "Risk": "Missing connection diversity undermines **availability**. A single device, fiber, or location failure can cut on-prem to VPC connectivity, causing **outages**, **packet loss**, or routing blackholes. Fallback to internet VPN can add latency and throttle throughput, delaying recovery and impacting operations.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/awssupport/latest/user/fault-tolerance-checks.html#amazon-direct-connect-location-resiliency",
    "https://repost.aws/knowledge-center/direct-connect-physical-redundancy",
    "https://aws.amazon.com/directconnect/resiliency-recommendation/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws directconnect create-private-virtual-interface --connection-id <CONNECTION_ID_DIFFERENT_FROM_EXISTING_VIF> --new-private-virtual-interface '{\"virtualInterfaceName\":\"<NAME>\",\"vlan\":<VLAN>,\"asn\":<BGP_ASN>,\"addressFamily\":\"ipv4\",\"amazonAddress\":\"<AMAZON_IP/30>\",\"customerAddress\":\"<CUSTOMER_IP/30>\",\"directConnectGatewayId\":\"<DIRECT_CONNECT_GATEWAY_ID>\"}'",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, open Direct Connect\n2. Go to Connections and select a different connection than the one used by your existing VIF\n3. Click Create virtual interface and choose Private\n4. For Gateway, select your Direct Connect gateway (or Virtual private gateway for VGW)\n5. Enter VLAN, BGP ASN, and IPv4 peer IPs (Amazon/Customer), then Create\n6. Verify the gateway now has at least two VIFs on different Direct Connect connections",
      "Terraform": "```hcl\n# Create a second Private VIF on a different DX connection and attach to the gateway\nresource \"aws_dx_private_virtual_interface\" \"example\" {\n  connection_id   = \"<example_resource_id>\"      # CRITICAL: use a DIFFERENT Direct Connect connection than existing VIFs\n  dx_gateway_id   = \"<example_resource_id>\"      # CRITICAL: attaches the VIF to the Direct Connect gateway (use virtual_gateway_id for VGW)\n  name            = \"<NAME>\"\n  vlan            = 100\n  bgp_asn         = 65000\n  address_family  = \"ipv4\"\n  amazon_address  = \"169.254.100.1/30\"\n  customer_address = \"169.254.100.2/30\"\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply connectivity **defense in depth**:\n- Attach at least two `VIFs` per gateway on separate **Direct Connect connections** in distinct locations\n- Prefer active/active dynamic routing and size capacity to survive a link loss\n- *Optionally* add a **VPN/Transit Gateway** path to sustain operations during provider outages",
      "Url": "https://hub.prowler.com/check/directconnect_virtual_interface_redundancy"
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

---[FILE: directconnect_virtual_interface_redundancy.py]---
Location: prowler-master/prowler/providers/aws/services/directconnect/directconnect_virtual_interface_redundancy/directconnect_virtual_interface_redundancy.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.directconnect.directconnect_client import (
    directconnect_client,
)


class directconnect_virtual_interface_redundancy(Check):
    def execute(self):
        findings = []
        for vgw in directconnect_client.vgws.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=vgw)
            if len(vgw.vifs) < 2:
                report.status = "FAIL"
                report.status_extended = (
                    f"Virtual private gateway {vgw.id} only has one VIF."
                )
            elif len(vgw.connections) < 2:
                report.status = "FAIL"
                report.status_extended = f"Virtual private gateway {vgw.id} has more than 1 VIFs, but all the VIFs are on the same DX Connection."
            else:
                report.status = "PASS"
                report.status_extended = f"Virtual private gateway {vgw.id} has more than 1 VIFs and the VIFs are on more than one DX connection."

            findings.append(report)

        for dxgw in directconnect_client.dxgws.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=dxgw)
            if len(dxgw.vifs) < 2:
                report.status = "FAIL"
                report.status_extended = (
                    f"Direct Connect gateway {dxgw.id} only has one VIF."
                )
            elif len(dxgw.connections) < 2:
                report.status = "FAIL"
                report.status_extended = f"Direct Connect gateway {dxgw.id} has more than 1 VIFs, but all the VIFs are on the same DX Connection."
            else:
                report.status = "PASS"
                report.status_extended = f"Direct Connect gateway {dxgw.id} has more than 1 VIFs and the VIFs are on more than one DX connection."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_client.py]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_client.py

```python
from prowler.providers.aws.services.directoryservice.directoryservice_service import (
    DirectoryService,
)
from prowler.providers.common.provider import Provider

directoryservice_client = DirectoryService(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_service.py]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_service.py
Signals: Pydantic

```python
from datetime import datetime
from enum import Enum
from typing import Optional, Union

from botocore.client import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class DirectoryService(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("ds", provider)
        self.directories = {}
        self.__threading_call__(self._describe_directories)
        self.__threading_call__(self._list_log_subscriptions)
        self.__threading_call__(self._describe_event_topics)
        self.__threading_call__(self._list_certificates)
        self.__threading_call__(self._get_snapshot_limits)
        self._list_tags_for_resource()

    def _describe_directories(self, regional_client):
        logger.info("DirectoryService - Describing Directories...")
        try:
            describe_fleets_paginator = regional_client.get_paginator(
                "describe_directories"
            )
            for page in describe_fleets_paginator.paginate():
                for directory in page["DirectoryDescriptions"]:
                    if not self.audit_resources or (
                        is_resource_filtered(
                            directory["DirectoryId"], self.audit_resources
                        )
                    ):
                        directory_id = directory["DirectoryId"]
                        directory_arn = f"arn:{self.audited_partition}:ds:{regional_client.region}:{self.audited_account}:directory/{directory_id}"
                        directory_name = directory["Name"]
                        directory_type = directory["Type"]
                        # Radius Configuration
                        radius_authentication_protocol = (
                            AuthenticationProtocol(
                                directory["RadiusSettings"]["AuthenticationProtocol"]
                            )
                            if "RadiusSettings" in directory
                            else None
                        )
                        radius_status = (
                            RadiusStatus(directory["RadiusStatus"])
                            if "RadiusStatus" in directory
                            else None
                        )

                        self.directories[directory_id] = Directory(
                            name=directory_name,
                            id=directory_id,
                            arn=directory_arn,
                            type=directory_type,
                            region=regional_client.region,
                            radius_settings=RadiusSettings(
                                authentication_protocol=radius_authentication_protocol,
                                status=radius_status,
                            ),
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_log_subscriptions(self, regional_client):
        logger.info("DirectoryService - Listing Log Subscriptions...")
        try:
            for directory in self.directories.values():
                if directory.region == regional_client.region:
                    list_log_subscriptions_paginator = regional_client.get_paginator(
                        "list_log_subscriptions"
                    )
                    list_log_subscriptions_parameters = {"DirectoryId": directory.id}
                    log_subscriptions = []
                    for page in list_log_subscriptions_paginator.paginate(
                        **list_log_subscriptions_parameters
                    ):
                        for log_subscription_info in page["LogSubscriptions"]:
                            log_subscriptions.append(
                                LogSubscriptions(
                                    log_group_name=log_subscription_info[
                                        "LogGroupName"
                                    ],
                                    created_date_time=log_subscription_info[
                                        "SubscriptionCreatedDateTime"
                                    ],
                                )
                            )
                    self.directories[directory.id].log_subscriptions = log_subscriptions
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_event_topics(self, regional_client):
        logger.info("DirectoryService - Describing Event Topics...")
        try:
            for directory in self.directories.values():
                if directory.region == regional_client.region:
                    # Operation is not supported for Shared MicrosoftAD directories.
                    if directory.type != DirectoryType.SharedMicrosoftAD:
                        try:
                            describe_event_topics_parameters = {
                                "DirectoryId": directory.id
                            }
                            event_topics = []
                            describe_event_topics = (
                                regional_client.describe_event_topics(
                                    **describe_event_topics_parameters
                                )
                            )
                            for event_topic in describe_event_topics["EventTopics"]:
                                event_topics.append(
                                    EventTopics(
                                        topic_arn=event_topic["TopicArn"],
                                        topic_name=event_topic["TopicName"],
                                        status=event_topic["Status"],
                                        created_date_time=event_topic[
                                            "CreatedDateTime"
                                        ],
                                    )
                                )
                            self.directories[directory.id].event_topics = event_topics
                        except ClientError as error:
                            if (
                                "is in Deleting state"
                                in error.response["Error"]["Message"]
                            ):
                                logger.warning(
                                    f"{directory.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                )
                            else:
                                logger.error(
                                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                )
                        except Exception as error:
                            logger.error(
                                f"{regional_client.region} -- {error.__class__.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_certificates(self, regional_client):
        logger.info("DirectoryService - Listing Certificates...")
        try:
            for directory in self.directories.values():
                #  LDAPS operations are not supported for this Directory Type
                if (
                    directory.region == regional_client.region
                    and directory.type != DirectoryType.SimpleAD
                ):
                    try:
                        list_certificates_paginator = regional_client.get_paginator(
                            "list_certificates"
                        )
                        list_certificates_parameters = {"DirectoryId": directory.id}
                        certificates = []
                        for page in list_certificates_paginator.paginate(
                            **list_certificates_parameters
                        ):
                            for certificate_info in page["CertificatesInfo"]:
                                certificates.append(
                                    Certificate(
                                        id=certificate_info["CertificateId"],
                                        common_name=certificate_info["CommonName"],
                                        state=certificate_info["State"],
                                        expiry_date_time=certificate_info[
                                            "ExpiryDateTime"
                                        ],
                                        type=certificate_info["Type"],
                                    )
                                )
                        self.directories[directory.id].certificates = certificates
                    except ClientError as error:
                        if (
                            error.response["Error"]["Code"]
                            == "UnsupportedOperationException"
                        ):
                            logger.warning(
                                f"{directory.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                        else:
                            logger.error(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                        continue

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_snapshot_limits(self, regional_client):
        logger.info("DirectoryService - Getting Snapshot Limits...")
        try:
            for directory in self.directories.values():
                # Snapshot limits can be fetched only for VPC or Microsoft AD directories.
                if (
                    directory.region == regional_client.region
                    and directory.type == DirectoryType.MicrosoftAD
                ):
                    try:
                        get_snapshot_limits_parameters = {"DirectoryId": directory.id}
                        snapshot_limit = regional_client.get_snapshot_limits(
                            **get_snapshot_limits_parameters
                        )
                        self.directories[directory.id].snapshots_limits = SnapshotLimit(
                            manual_snapshots_current_count=snapshot_limit[
                                "SnapshotLimits"
                            ]["ManualSnapshotsCurrentCount"],
                            manual_snapshots_limit=snapshot_limit["SnapshotLimits"][
                                "ManualSnapshotsLimit"
                            ],
                            manual_snapshots_limit_reached=snapshot_limit[
                                "SnapshotLimits"
                            ]["ManualSnapshotsLimitReached"],
                        )
                    except ClientError as error:
                        if "is in Deleting state" in error.response["Error"]["Message"]:
                            logger.warning(
                                f"{directory.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                        else:
                            logger.error(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                    except Exception as error:
                        logger.error(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )

        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("Directory Service - List Tags...")
        try:
            for directory in self.directories.values():
                regional_client = self.regional_clients[directory.region]
                response = regional_client.list_tags_for_resource(
                    ResourceId=directory.id
                )["Tags"]
                directory.tags = response
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class SnapshotLimit(BaseModel):
    manual_snapshots_limit: int
    manual_snapshots_current_count: int
    manual_snapshots_limit_reached: bool


class LogSubscriptions(BaseModel):
    log_group_name: str
    created_date_time: datetime


class EventTopicStatus(Enum):
    Registered = "Registered"
    NotFound = "Topic not found"
    Failed = "Failed"
    Delete = "Deleted"


class EventTopics(BaseModel):
    topic_name: str
    topic_arn: str
    status: EventTopicStatus
    created_date_time: datetime


class CertificateType(Enum):
    ClientCertAuth = "ClientCertAuth"
    ClientLDAPS = "ClientLDAPS"


class CertificateState(Enum):
    Registering = "Registering"
    Registered = "Registered"
    RegisterFailed = "RegisterFailed"
    Deregistering = "Deregistering"
    Deregistered = "Deregistered"
    DeregisterFailed = "DeregisterFailed"


class Certificate(BaseModel):
    id: str
    common_name: str
    state: CertificateState
    expiry_date_time: datetime
    type: CertificateType


class AuthenticationProtocol(Enum):
    PAP = "PAP"
    CHAP = "CHAP"
    MS_CHAPv1 = "MS-CHAPv1"
    MS_CHAPv2 = "MS-CHAPv2"


class RadiusStatus(Enum):
    """Status of the RADIUS MFA server connection"""

    Creating = "Creating"
    Completed = "Completed"
    Failed = "Failed"


class RadiusSettings(BaseModel):
    authentication_protocol: Union[AuthenticationProtocol, None]
    status: Union[RadiusStatus, None]


class DirectoryType(Enum):
    SimpleAD = "SimpleAD"
    ADConnector = "ADConnector"
    MicrosoftAD = "MicrosoftAD"
    SharedMicrosoftAD = "SharedMicrosoftAD"


class Directory(BaseModel):
    name: str
    id: str
    arn: str
    type: DirectoryType
    log_subscriptions: list[LogSubscriptions] = []
    event_topics: list[EventTopics] = []
    certificates: list[Certificate] = []
    snapshots_limits: SnapshotLimit = None
    radius_settings: RadiusSettings = None
    region: str
    tags: Optional[list] = []
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_directory_log_forwarding_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_directory_log_forwarding_enabled/directoryservice_directory_log_forwarding_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "directoryservice_directory_log_forwarding_enabled",
  "CheckTitle": "Directory Service directory has log forwarding to CloudWatch Logs enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "directoryservice",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Directory Service directories** are configured to forward domain controller security event logs to **CloudWatch Logs** using log subscriptions.\n\nEvaluation identifies directories with or without this forwarding in place.",
  "Risk": "Without forwarding, visibility into AD security events is lost, delaying detection of suspicious authentications, policy changes, or privilege grants. Attackers can escalate and persist unnoticed, risking unauthorized access (confidentiality) and identity/policy manipulation (integrity), while hampering forensics and response.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.amazonaws.cn/en_us/directoryservice/latest/admin-guide/ms_ad_enable_log_forwarding.html",
    "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/incident-response.html",
    "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/ms_ad_enable_log_forwarding.html",
    "https://support.icompaas.com/support/solutions/articles/62000233528--ensure-directory-service-monitoring-with-cloudwatch-logs"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "```yaml\n# CloudFormation: enable Directory Service log forwarding to CloudWatch Logs\nResources:\n  LogGroup:\n    Type: AWS::Logs::LogGroup\n    Properties:\n      LogGroupName: /aws/directoryservice/<example_resource_id>\n\n  LogsResourcePolicy:\n    Type: AWS::Logs::ResourcePolicy\n    Properties:\n      PolicyName: DSLogSubscription\n      PolicyDocument: |\n        {\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"ds.amazonaws.com\"},\"Action\":[\"logs:CreateLogStream\",\"logs:PutLogEvents\",\"logs:DescribeLogStreams\"],\"Resource\":\"arn:aws:logs:*:*:log-group:/aws/directoryservice/*\"}]}\n\n  DirectoryLogSubscription:\n    Type: AWS::DirectoryService::LogSubscription\n    Properties:\n      DirectoryId: <example_resource_id>          # CRITICAL: target Directory Service ID to enable log forwarding\n      LogGroupName: /aws/directoryservice/<example_resource_id>  # CRITICAL: CloudWatch Logs destination\n```",
      "Other": "1. In the AWS Console, go to Directory Service > Directories and open your directory\n2. On the Directory details page, select the Networking & security tab\n3. In Log forwarding, click Enable\n4. Choose Create a new CloudWatch log group (or select an existing one)\n5. Click Enable to start forwarding logs",
      "Terraform": "```hcl\n# Enable Directory Service log forwarding to CloudWatch Logs\nresource \"aws_cloudwatch_log_group\" \"ds\" {\n  name = \"/aws/directoryservice/<example_resource_id>\"\n}\n\nresource \"aws_cloudwatch_log_resource_policy\" \"ds\" {\n  policy_name     = \"DSLogSubscription\"\n  policy_document = jsonencode({\n    Version   = \"2012-10-17\",\n    Statement = [{\n      Effect    = \"Allow\",\n      Principal = { Service = \"ds.amazonaws.com\" },\n      Action    = [\"logs:CreateLogStream\", \"logs:PutLogEvents\", \"logs:DescribeLogStreams\"],\n      Resource  = \"arn:aws:logs:*:*:log-group:/aws/directoryservice/*\"\n    }]\n  })\n}\n\nresource \"aws_directory_service_log_subscription\" \"enable\" {\n  directory_id  = \"<example_resource_id>\"                 # CRITICAL: enables log forwarding for this directory\n  log_group_name = aws_cloudwatch_log_group.ds.name        # CRITICAL: CloudWatch Logs destination\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable and maintain **log forwarding** to CloudWatch Logs.\n\n- Centralize logs in a protected group with strict access and retention\n- Apply least privilege for delivery roles and readers; prevent tampering (immutability)\n- Alert on high-risk events and aggregate across Regions/accounts for defense in depth",
      "Url": "https://hub.prowler.com/check/directoryservice_directory_log_forwarding_enabled"
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

---[FILE: directoryservice_directory_log_forwarding_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_directory_log_forwarding_enabled/directoryservice_directory_log_forwarding_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.directoryservice.directoryservice_client import (
    directoryservice_client,
)


class directoryservice_directory_log_forwarding_enabled(Check):
    def execute(self):
        findings = []
        for directory in directoryservice_client.directories.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=directory)
            if directory.log_subscriptions:
                report.status = "PASS"
                report.status_extended = f"Directory Service {directory.id} have log forwarding to CloudWatch enabled."
            else:
                report.status = "FAIL"
                report.status_extended = f"Directory Service {directory.id} have log forwarding to CloudWatch disabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_directory_monitor_notifications.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_directory_monitor_notifications/directoryservice_directory_monitor_notifications.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "directoryservice_directory_monitor_notifications",
  "CheckTitle": "Directory Service directory has SNS notifications enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices"
  ],
  "ServiceName": "directoryservice",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Other",
  "Description": "**AWS Directory Service** directories are associated with **Amazon SNS topics** to send status change notifications (e.g., `Active`  `Impaired`).\n\nThe evaluation looks for directories that have SNS event topics configured for monitoring alerts.",
  "Risk": "Missing directory notifications reduces visibility into health changes, causing delayed response to `Impaired` states. This threatens availability of authentication, Kerberos/LDAP lookups, and domain joins; increases MTTR; and can enable silent replication or trust failures that impact integrity across dependent workloads.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/ms_ad_enable_notifications.html",
    "https://support.icompaas.com/support/solutions/articles/62000233533-ensure-directory-service-has-sns-notifications-enabled"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws ds register-event-topic --directory-id <DIRECTORY_ID> --topic-name <SNS_TOPIC_NAME>",
      "NativeIaC": "",
      "Other": "1. Open AWS Console > Directory Service > Directories and select your directory\n2. Go to the Maintenance or Monitoring/Notifications section\n3. Click Actions > Create notification (or Set up notifications)\n4. Select an existing SNS topic (or create one) and Save",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure **AWS Directory Service** to publish directory status changes to an **SNS topic**, and subscribe your operations channels for timely alerts.\n\nApply **least privilege** on topic permissions, integrate alerts with incident response, and use **defense in depth** by pairing notifications with logs and dashboards.",
      "Url": "https://hub.prowler.com/check/directoryservice_directory_monitor_notifications"
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

---[FILE: directoryservice_directory_monitor_notifications.py]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_directory_monitor_notifications/directoryservice_directory_monitor_notifications.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.directoryservice.directoryservice_client import (
    directoryservice_client,
)


class directoryservice_directory_monitor_notifications(Check):
    def execute(self):
        findings = []
        for directory in directoryservice_client.directories.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=directory)
            if directory.event_topics:
                report.status = "PASS"
                report.status_extended = (
                    f"Directory Service {directory.id} have SNS messaging enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Directory Service {directory.id} have SNS messaging disabled."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: directoryservice_directory_snapshots_limit.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_directory_snapshots_limit/directoryservice_directory_snapshots_limit.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "directoryservice_directory_snapshots_limit",
  "CheckTitle": "Directory Service directory has adequate remaining manual snapshot quota",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Effects/Resource Consumption"
  ],
  "ServiceName": "directoryservice",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Other",
  "Description": "**AWS Directory Service** directories with **manual snapshot capacity** fully consumed or nearly exhausted, based on current snapshot count relative to the directory's maximum allowed.",
  "Risk": "With no remaining snapshot capacity, you cannot create new recovery points:\n- Reduced availability during outages or ransomware\n- Higher RPO from failed scheduled backups\n- Greater change risk (schema/OS updates) without a safe rollback",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://support.icompaas.com/support/solutions/articles/62000233531--ensure-directory-service-manual-snapshots-limit-reached",
    "https://docs.aws.amazon.com/directoryservice/latest/admin-guide/ms_ad_limits.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. In the AWS Console, go to Directory Service > Directories and open <example_resource_id>\n2. Click Snapshots\n3. Select older snapshots with Type = Manual and click Delete snapshot, confirm\n4. Repeat until the number of manual snapshots is less than (manual limit - 2). For the default limit of 5, keep at most 2 manual snapshots\n5. Verify Remaining manual snapshots > 2 on the Snapshots page",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Adopt a **snapshot lifecycle policy**: rotate/expire old manual snapshots after verifying restores, and alert on low headroom. Prefer **automated backups** for cadence and retention. Enforce **least privilege** for snapshot creation. Design operations within the *hard per-directory cap* to prevent capacity exhaustion.",
      "Url": "https://hub.prowler.com/check/directoryservice_directory_snapshots_limit"
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

---[FILE: directoryservice_directory_snapshots_limit.py]---
Location: prowler-master/prowler/providers/aws/services/directoryservice/directoryservice_directory_snapshots_limit/directoryservice_directory_snapshots_limit.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.directoryservice.directoryservice_client import (
    directoryservice_client,
)

SNAPSHOT_LIMIT_THRESHOLD = 2
"""Number of remaining snapshots to reach the limit"""


class directoryservice_directory_snapshots_limit(Check):
    def execute(self):
        findings = []
        for directory in directoryservice_client.directories.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=directory)
            if directory.snapshots_limits:
                if directory.snapshots_limits.manual_snapshots_limit_reached:
                    report.status = "FAIL"
                    report.status_extended = f"Directory Service {directory.id} reached {directory.snapshots_limits.manual_snapshots_limit} Snapshots limit."
                else:
                    limit_remaining = (
                        directory.snapshots_limits.manual_snapshots_limit
                        - directory.snapshots_limits.manual_snapshots_current_count
                    )
                    if limit_remaining <= SNAPSHOT_LIMIT_THRESHOLD:
                        report.status = "FAIL"
                        report.status_extended = f"Directory Service {directory.id} is about to reach {directory.snapshots_limits.manual_snapshots_limit} Snapshots which is the limit."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"Directory Service {directory.id} is using {directory.snapshots_limits.manual_snapshots_current_count} out of {directory.snapshots_limits.manual_snapshots_limit} from the Snapshots Limit."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
