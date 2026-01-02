---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 285
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 285 of 867)

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

---[FILE: emr_cluster_publicly_accesible.py]---
Location: prowler-master/prowler/providers/aws/services/emr/emr_cluster_publicly_accesible/emr_cluster_publicly_accesible.py

```python
from copy import deepcopy

from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.ec2.ec2_client import ec2_client
from prowler.providers.aws.services.ec2.lib.security_groups import check_security_group
from prowler.providers.aws.services.emr.emr_client import emr_client
from prowler.providers.aws.services.emr.emr_service import ClusterStatus


class emr_cluster_publicly_accesible(Check):
    def execute(self):
        findings = []
        for cluster in emr_client.clusters.values():
            if cluster.status not in (
                ClusterStatus.TERMINATED,
                ClusterStatus.TERMINATED_WITH_ERRORS,
            ):
                report = Check_Report_AWS(metadata=self.metadata(), resource=cluster)
                report.status = "PASS"
                report.status_extended = (
                    f"EMR Cluster {cluster.id} is not publicly accessible."
                )
                # If EMR cluster is Public, it is required to check
                # their Security Groups for the Master,
                # the Slaves and the additional ones
                if cluster.public:
                    # Check Public Master Security Groups
                    master_node_sg_groups = deepcopy(
                        cluster.master.additional_security_groups_id
                    )
                    if master_node_sg_groups:
                        master_node_sg_groups.append(cluster.master.security_group_id)
                    else:
                        master_node_sg_groups = [cluster.master.security_group_id]

                    master_public_security_groups = []
                    for master_sg in master_node_sg_groups:
                        master_sg_public = False
                        for sg in ec2_client.security_groups.values():
                            if sg.id == master_sg:
                                for ingress_rule in sg.ingress_rules:
                                    if check_security_group(ingress_rule, "-1"):
                                        master_sg_public = True
                                        break
                            if master_sg_public:
                                master_public_security_groups.append(sg.id)
                                break

                    # Check Public Slave Security Groups
                    slave_node_sg_groups = deepcopy(
                        cluster.slave.additional_security_groups_id
                    )
                    if slave_node_sg_groups:
                        slave_node_sg_groups.append(cluster.slave.security_group_id)
                    else:
                        slave_node_sg_groups = [cluster.slave.security_group_id]

                    slave_public_security_groups = []
                    for slave_sg in slave_node_sg_groups:
                        slave_sg_public = False
                        for sg in ec2_client.security_groups.values():
                            if sg.id == slave_sg:
                                for ingress_rule in sg.ingress_rules:
                                    if check_security_group(ingress_rule, "-1"):
                                        slave_sg_public = True
                                        break
                            if slave_sg_public:
                                slave_public_security_groups.append(sg.id)
                                break

                    if master_public_security_groups or slave_public_security_groups:
                        report.status = "FAIL"
                        report.status_extended = f"EMR Cluster {cluster.id} is publicly accessible through the following Security Groups:"
                        report.status_extended += (
                            f" Master Node {master_public_security_groups}"
                            if master_public_security_groups
                            else ""
                        )
                        report.status_extended += (
                            f" Slaves Nodes {slave_public_security_groups}"
                            if slave_public_security_groups
                            else ""
                        )

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_client.py]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_client.py

```python
from prowler.providers.aws.services.eventbridge.eventbridge_service import EventBridge
from prowler.providers.common.provider import Provider

eventbridge_client = EventBridge(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_service.py]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_service.py
Signals: Pydantic

```python
import json
from typing import Optional

from botocore.exceptions import ClientError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.lib.scan_filters.scan_filters import is_resource_filtered
from prowler.providers.aws.lib.service.service import AWSService


class EventBridge(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("events", provider)
        self.buses = {}
        self.endpoints = {}
        self.__threading_call__(self._list_event_buses)
        self.__threading_call__(self._describe_event_bus)
        self.__threading_call__(self._list_endpoints)
        self._list_tags_for_resource()

    def _list_event_buses(self, regional_client):
        logger.info("EventBridge - Listing Event Buses...")
        try:
            for bus in regional_client.list_event_buses()["EventBuses"]:
                bus_arn = bus["Arn"]
                if not self.audit_resources or (
                    is_resource_filtered(bus_arn, self.audit_resources)
                ):
                    self.buses[bus_arn] = Bus(
                        name=bus.get("Name", ""),
                        arn=bus_arn,
                        region=regional_client.region,
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _describe_event_bus(self, regional_client):
        logger.info("EventBridge - Describing Event Buses...")
        try:
            for bus in self.buses.values():
                if bus.region == regional_client.region:
                    try:
                        response = regional_client.describe_event_bus(Name=bus.name)
                        bus.kms_key_id = response.get("KmsKeyIdentifier")
                        bus.policy = json.loads(response.get("Policy", "{}"))
                    except Exception as error:
                        logger.error(
                            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_endpoints(self, regional_client):
        logger.info("EventBridge - Listing Endpoints...")
        try:
            for endpoint in regional_client.list_endpoints()["Endpoints"]:
                endpoint_arn = endpoint["Arn"]
                if not self.audit_resources or (
                    is_resource_filtered(endpoint_arn, self.audit_resources)
                ):
                    self.endpoints[endpoint_arn] = Endpoint(
                        name=endpoint.get("Name", ""),
                        arn=endpoint_arn,
                        region=regional_client.region,
                        replication_state=endpoint.get("ReplicationConfig", {}).get(
                            "State", "DISABLED"
                        ),
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _list_tags_for_resource(self):
        logger.info("EventBridge - Listing Tags...")
        try:
            for bus in self.buses.values():
                try:
                    regional_client = self.regional_clients[bus.region]
                    bus.tags = regional_client.list_tags_for_resource(
                        ResourceARN=bus.arn
                    )["Tags"]
                except ClientError as error:
                    if error.response["Error"]["Code"] == "ResourceNotFoundException":
                        logger.warning(
                            f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
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


class Bus(BaseModel):
    name: str
    arn: str
    region: str
    kms_key_id: Optional[str]
    policy: Optional[str]
    tags: Optional[list]


class Endpoint(BaseModel):
    name: str
    arn: str
    region: str
    replication_state: str
    tags: Optional[list] = []


class Schema(AWSService):
    def __init__(self, provider):
        # Call AWSService's __init__
        super().__init__("schemas", provider)
        self.registries = {}
        self.__threading_call__(self._list_registries)
        self.__threading_call__(self._get_resource_policy)

    def _list_registries(self, regional_client):
        logger.info("EventBridge - Listing Schema Registries...")
        try:
            for registry in regional_client.list_registries()["Registries"]:
                registry_arn = registry.get(
                    "RegistryArn",
                    f"arn:{self.audited_partition}:schemas:{regional_client.region}:{self.audited_account}:registry/{registry.get('RegistryName', '')}",
                )
                if not self.audit_resources or (
                    is_resource_filtered(registry_arn, self.audit_resources)
                ):
                    self.registries[registry_arn] = Registry(
                        name=registry.get("RegistryName", ""),
                        arn=registry_arn,
                        region=regional_client.region,
                        tags=[registry["Tags"]],
                    )
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_resource_policy(self, regional_client):
        logger.info("EventBridge - Getting Registry Resource Policy...")
        try:
            for registry in self.registries.values():
                # Only get the policy for the registry in the same region and not AWS owned
                if (
                    registry.region == regional_client.region
                    and not registry.name.startswith("aws.")
                ):
                    try:
                        response = regional_client.get_resource_policy(
                            RegistryName=registry.name
                        )
                        registry.policy = json.loads(response.get("Policy", "{}"))
                    except ClientError as error:
                        if error.response["Error"]["Code"] == "NotFoundException":
                            logger.warning(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                        else:
                            logger.error(
                                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                            )
                    except Exception as error:
                        logger.error(
                            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Registry(BaseModel):
    name: str
    arn: str
    region: str
    policy: Optional[dict]
    tags: Optional[list]
```

--------------------------------------------------------------------------------

---[FILE: schema_client.py]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/schema_client.py

```python
from prowler.providers.aws.services.eventbridge.eventbridge_service import Schema
from prowler.providers.common.provider import Provider

schema_client = Schema(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_bus_cross_account_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_bus_cross_account_access/eventbridge_bus_cross_account_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eventbridge_bus_cross_account_access",
  "CheckTitle": "AWS EventBridge event bus does not allow cross-account access",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "eventbridge",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEventsEventbus",
  "Description": "**EventBridge event bus** has a **resource policy** that grants **cross-account event delivery** to principals outside the account, including broad or public access.\n\nFocus is on buses whose policies permit external accounts to send events.",
  "Risk": "**Cross-account event injection** can erode **integrity** and **availability**. Spoofed events may trigger rules and invoke downstream targets, causing unintended actions, data exposure via targets, lateral movement through over-privileged roles, and cost or service disruption from event floods.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchEvents/event-bus-cross-account-access.html",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CWE_GettingStarted.html",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEvents-CrossAccountEventDelivery.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws events remove-permission --event-bus-name <event_bus_name> --statement-id <statement_id>",
      "NativeIaC": "```yaml\n# CloudFormation: restrict EventBridge event bus to same account only\nResources:\n  <example_resource_name>:\n    Type: AWS::Events::EventBusPolicy\n    Properties:\n      StatementId: <example_resource_id>\n      Action: events:PutEvents\n      Principal: !Ref AWS::AccountId  # Critical: allows only this AWS account, blocking cross-account access\n      EventBusName: <example_resource_name>\n```",
      "Other": "1. In the AWS Console, go to Amazon EventBridge > Event buses\n2. Select the event bus (<event_bus_name>)\n3. Open the Permissions tab and click Edit\n4. Remove any statements that grant access to other accounts, an organization, or \"*\"\n5. Save changes",
      "Terraform": "```hcl\n# Terraform: restrict EventBridge event bus to same account only\nresource \"aws_cloudwatch_event_permission\" \"<example_resource_name>\" {\n  statement_id   = \"<example_resource_id>\"\n  action         = \"events:PutEvents\"\n  principal      = \"<example_resource_id>\" # Critical: set to your own AWS account ID to block cross-account access\n  event_bus_name = \"<example_resource_name>\"\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** on the event bus resource policy: allow only specific account IDs or org scope (e.g., `aws:PrincipalOrgID`) and avoid wildcard `Principal` or `*`.\n\nConstrain rules to trusted senders using the `account` field and vetted sources, and add monitoring/throttling for **defense in depth**.",
      "Url": "https://hub.prowler.com/check/eventbridge_bus_cross_account_access"
    }
  },
  "Categories": [
    "identity-access",
    "trust-boundaries"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_bus_cross_account_access.py]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_bus_cross_account_access/eventbridge_bus_cross_account_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eventbridge.eventbridge_client import (
    eventbridge_client,
)
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class eventbridge_bus_cross_account_access(Check):
    def execute(self):
        findings = []
        for bus in eventbridge_client.buses.values():
            if bus.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=bus)
            report.status = "PASS"
            report.status_extended = (
                f"EventBridge event bus {bus.name} does not allow cross-account access."
            )
            if is_policy_public(
                bus.policy,
                eventbridge_client.audited_account,
                is_cross_account_allowed=False,
            ):
                report.status = "FAIL"
                report.status_extended = (
                    f"EventBridge event bus {bus.name} allows cross-account access."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_bus_exposed.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_bus_exposed/eventbridge_bus_exposed.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eventbridge_bus_exposed",
  "CheckTitle": "AWS EventBridge event bus policy does not allow public access",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices/Network Reachability",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access"
  ],
  "ServiceName": "eventbridge",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEventsEventbus",
  "Description": "EventBridge event bus resource policy is evaluated for **public access**, such as a `Principal: \"*\"` or overly broad conditions that allow any AWS account to publish events or manage rules on the bus.",
  "Risk": "Publicly accessible event buses enable **event injection** and unauthorized rule changes, undermining **integrity** and enabling **lateral movement**. Attackers can trigger downstream targets, causing **data exposure**, service disruption, and unexpected **costs** through high-volume events.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEvents-CrossAccountEventDelivery.html",
    "https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CWE_GettingStarted.html",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/aws/CloudWatchEvents/event-bus-exposed.html",
    "https://aws.amazon.com/blogs/compute/simplifying-cross-account-access-with-amazon-eventbridge-resource-policies/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws events remove-permission --event-bus-name <event_bus_name> --statement-id <statement_id>",
      "NativeIaC": "```yaml\n# CloudFormation: restrict EventBridge event bus access to a specific account (not public)\nResources:\n  <example_resource_name>:\n    Type: AWS::Events::EventBusPolicy\n    Properties:\n      StatementId: AllowSpecificAccount\n      Action: events:PutEvents\n      Principal: arn:aws:iam::<example_account_id>:root  # CRITICAL: limit access to a specific AWS account to prevent public access\n      # Omitting EventBusName applies this to the default event bus\n```",
      "Other": "1. Open the AWS Console and go to EventBridge > Event buses\n2. Select the target event bus and open the Permissions tab\n3. Click Edit policy\n4. Remove any statement where Principal is \"*\" or AWS is \"*\"\n5. If needed, add a statement allowing only your trusted account ID as Principal (arn:aws:iam::<ACCOUNT_ID>:root)\n6. Save changes",
      "Terraform": "```hcl\nresource \"aws_cloudwatch_event_bus_policy\" \"<example_resource_name>\" {\n  # CRITICAL: Principal is a specific AWS account, not \"*\", preventing public access\n  policy = <<POLICY\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [{\n    \"Sid\": \"AllowSpecificAccount\",\n    \"Effect\": \"Allow\",\n    \"Principal\": {\"AWS\": \"arn:aws:iam::<example_account_id>:root\"},\n    \"Action\": \"events:PutEvents\",\n    \"Resource\": \"arn:aws:events:<example_region>:<example_account_id>:event-bus/default\"\n  }]\n}\nPOLICY\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** resource policies: limit principals to specific accounts or your organization, and constrain actions and event attributes (e.g., `source`, `detail-type`). Avoid `Principal: \"*\"`.\n\nUse **defense in depth** with rule patterns that include the expected `account`. Monitor policy changes and bus activity.",
      "Url": "https://hub.prowler.com/check/eventbridge_bus_exposed"
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

---[FILE: eventbridge_bus_exposed.py]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_bus_exposed/eventbridge_bus_exposed.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eventbridge.eventbridge_client import (
    eventbridge_client,
)
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class eventbridge_bus_exposed(Check):
    def execute(self):
        findings = []
        for bus in eventbridge_client.buses.values():
            if bus.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=bus)
            report.status = "PASS"
            report.status_extended = (
                f"EventBridge event bus {bus.name} is not exposed to everyone."
            )
            if is_policy_public(bus.policy, eventbridge_client.audited_account):
                report.status = "FAIL"
                report.status_extended = (
                    f"EventBridge event bus {bus.name} is exposed to everyone."
                )
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_global_endpoint_event_replication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_global_endpoint_event_replication_enabled/eventbridge_global_endpoint_event_replication_enabled.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eventbridge_global_endpoint_event_replication_enabled",
  "CheckTitle": "EventBridge global endpoint has event replication enabled",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices"
  ],
  "ServiceName": "eventbridge",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "AwsEventsEndpoint",
  "Description": "**EventBridge global endpoints** are configured with **event replication** `ENABLED` (not `DISABLED`) so custom events are replicated to both the primary and secondary Regions.",
  "Risk": "**No event replication** degrades **availability** and increases **RPO** during Regional outages.\n- Events can be lost or delayed if the primary Region fails\n- Automatic recovery to the primary may not occur, prolonging failover\n- Cross-Region inconsistency can affect data integrity",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://docs.aws.amazon.com/securityhub/latest/userguide/eventbridge-controls.html#eventbridge-4",
    "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-global-endpoints.html",
    "https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_Endpoint.html",
    "https://docs.aws.amazon.com/config/latest/developerguide/global-endpoint-event-replication-enabled.html",
    "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-ge-create-endpoint.html",
    "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-ge-best-practices.html",
    "https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_CreateEndpoint.html",
    "https://aws.amazon.com/blogs/compute/introducing-global-endpoints-for-amazon-eventbridge/"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws events update-endpoint --name <endpoint-name> --replication-config State=ENABLED --role-arn <role-arn>",
      "NativeIaC": "```yaml\n# CloudFormation: Enable event replication on an EventBridge global endpoint\nResources:\n  Endpoint:\n    Type: AWS::Events::Endpoint\n    Properties:\n      Name: <example_resource_name>\n      EventBuses:\n        - EventBusArn: arn:aws:events:us-east-1:<example_resource_id>:event-bus/<example_resource_name>\n        - EventBusArn: arn:aws:events:us-west-2:<example_resource_id>:event-bus/<example_resource_name>\n      RoutingConfig:\n        FailoverConfig:\n          Primary:\n            HealthCheck: arn:aws:route53:::healthcheck/<example_resource_id>\n          Secondary:\n            Route: us-west-2\n      ReplicationConfig:\n        State: ENABLED  # Critical: enables event replication\n      RoleArn: arn:aws:iam::<example_resource_id>:role/<example_resource_name>  # Critical: role used by replication\n```",
      "Other": "1. In the AWS Console, open Amazon EventBridge and go to Global endpoints\n2. Select the endpoint and choose Edit\n3. Under Event replication, check Event replication enabled\n4. For Execution role, select an existing role or create a new one\n5. Save changes",
      "Terraform": "```hcl\n# Terraform (awscc): Enable event replication on an EventBridge global endpoint\nresource \"awscc_events_endpoint\" \"example\" {\n  name = \"<example_resource_name>\"\n\n  event_buses = [\n    { event_bus_arn = \"arn:aws:events:us-east-1:<example_resource_id>:event-bus/<example_resource_name>\" },\n    { event_bus_arn = \"arn:aws:events:us-west-2:<example_resource_id>:event-bus/<example_resource_name>\" }\n  ]\n\n  routing_config = {\n    failover_config = {\n      primary   = { health_check = \"arn:aws:route53:::healthcheck/<example_resource_id>\" }\n      secondary = { route        = \"us-west-2\" }\n    }\n  }\n\n  replication_config = { state = \"ENABLED\" }  # Critical: enables event replication\n  role_arn           = \"arn:aws:iam::<example_resource_id>:role/<example_resource_name>\"  # Critical: role used by replication\n}\n```"
    },
    "Recommendation": {
      "Text": "Turn on **event replication** for global endpoints to ensure Regional resilience. Keep event buses, rules, and targets aligned across Regions. Use a dedicated IAM role with **least privilege** for replication. Design consumers for **idempotency** with unique IDs. Regularly test failover and monitor health as part of **defense in depth**.",
      "Url": "https://hub.prowler.com/check/eventbridge_global_endpoint_event_replication_enabled"
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

---[FILE: eventbridge_global_endpoint_event_replication_enabled.py]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_global_endpoint_event_replication_enabled/eventbridge_global_endpoint_event_replication_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eventbridge.eventbridge_client import (
    eventbridge_client,
)


class eventbridge_global_endpoint_event_replication_enabled(Check):
    def execute(self):
        findings = []
        for endpoint in eventbridge_client.endpoints.values():
            report = Check_Report_AWS(metadata=self.metadata(), resource=endpoint)
            report.status = "PASS"
            report.status_extended = f"EventBridge global endpoint {endpoint.name} has event replication enabled."
            if endpoint.replication_state == "DISABLED":
                report.status = "FAIL"
                report.status_extended = f"EventBridge global endpoint {endpoint.name} does not have event replication enabled."
            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_schema_registry_cross_account_access.metadata.json]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_schema_registry_cross_account_access/eventbridge_schema_registry_cross_account_access.metadata.json

```json
{
  "Provider": "aws",
  "CheckID": "eventbridge_schema_registry_cross_account_access",
  "CheckTitle": "AWS EventBridge schema registry does not allow cross-account access",
  "CheckType": [
    "Software and Configuration Checks/AWS Security Best Practices",
    "Software and Configuration Checks/Industry and Regulatory Standards/AWS Foundational Security Best Practices",
    "TTPs/Initial Access/Unauthorized Access",
    "Effects/Data Exposure"
  ],
  "ServiceName": "eventbridge",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "AwsEventSchemasRegistry",
  "Description": "**EventBridge schema registry** resource policies are assessed for **cross-account access**. It identifies statements that grant external or public principals (e.g., `Principal: *` or other accounts) permissions to interact with the registry and its schemas.",
  "Risk": "Unknown cross-account access exposes schema definitions, enabling reconnaissance and leaking data models (**confidentiality**). Excessive permissions may let outsiders alter or delete schemas, corrupt code bindings, and disrupt integrations (**integrity** and **availability**).",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://aws.amazon.com/about-aws/whats-new/2021/09/cross-account-discovery-amazon-eventbridge-schema/",
    "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-schema.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "aws schemas put-resource-policy --registry-name <example_resource_name> --policy '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":\"arn:aws:iam::<example_account_id>:root\"},\"Action\":\"schemas:*\",\"Resource\":\"*\"}]}'",
      "NativeIaC": "```yaml\n# CloudFormation: Restrict EventBridge Schema Registry policy to same account only\nResources:\n  <example_resource_name>RegistryPolicy:\n    Type: AWS::EventSchemas::RegistryPolicy\n    Properties:\n      RegistryName: <example_resource_name>\n      # Critical: Principal limited to this AWS account to prevent cross-account access\n      Policy: !Sub |\n        {\n          \"Version\": \"2012-10-17\",\n          \"Statement\": [\n            {\n              \"Effect\": \"Allow\",\n              \"Principal\": { \"AWS\": \"arn:${AWS::Partition}:iam::${AWS::AccountId}:root\" },\n              \"Action\": \"schemas:*\",\n              \"Resource\": \"*\"\n            }\n          ]\n        }\n```",
      "Other": "1. Open the Amazon EventBridge console\n2. Go to Schemas > Registries and select <example_resource_name>\n3. Open the Permissions tab and click Edit\n4. Remove any statement with Principal set to \"*\" or an AWS account different from yours\n5. Add a single Allow statement with Principal = arn:aws:iam::<your_account_id>:root\n6. Save changes",
      "Terraform": "```hcl\n# Restrict EventBridge Schema Registry policy to same account only\nresource \"aws_schemas_registry_policy\" \"<example_resource_name>\" {\n  registry_name = \"<example_resource_name>\"\n\n  # Critical: Principal limited to same account to remove cross-account access\n  policy = jsonencode({\n    Version = \"2012-10-17\"\n    Statement = [{\n      Effect    = \"Allow\"\n      Principal = { AWS = \"arn:aws:iam::<example_account_id>:root\" }\n      Action    = \"schemas:*\"\n      Resource  = \"*\"\n    }]\n  })\n}\n```"
    },
    "Recommendation": {
      "Text": "Apply **least privilege** to registry resource policies:\n- Avoid public principals like `Principal: *`\n- Allow only trusted account ARNs or org IDs\n- Grant minimal actions, prefer read-only\n- Use **separation of duties** and log changes\n\n*If cross-account is needed*, scope tightly and review often.",
      "Url": "https://hub.prowler.com/check/eventbridge_schema_registry_cross_account_access"
    }
  },
  "Categories": [
    "trust-boundaries",
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: eventbridge_schema_registry_cross_account_access.py]---
Location: prowler-master/prowler/providers/aws/services/eventbridge/eventbridge_schema_registry_cross_account_access/eventbridge_schema_registry_cross_account_access.py

```python
from prowler.lib.check.models import Check, Check_Report_AWS
from prowler.providers.aws.services.eventbridge.schema_client import schema_client
from prowler.providers.aws.services.iam.lib.policy import is_policy_public


class eventbridge_schema_registry_cross_account_access(Check):
    def execute(self):
        findings = []
        for registry in schema_client.registries.values():
            if registry.policy is None:
                continue
            report = Check_Report_AWS(metadata=self.metadata(), resource=registry)
            report.status = "PASS"
            report.status_extended = f"EventBridge schema registry {registry.name} does not allow cross-account access."
            if is_policy_public(
                registry.policy,
                schema_client.audited_account,
                is_cross_account_allowed=False,
            ):
                report.status = "FAIL"
                report.status_extended = f"EventBridge schema registry {registry.name} allows cross-account access."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: firehose_client.py]---
Location: prowler-master/prowler/providers/aws/services/firehose/firehose_client.py

```python
from prowler.providers.aws.services.firehose.firehose_service import Firehose
from prowler.providers.common.provider import Provider

firehose_client = Firehose(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
