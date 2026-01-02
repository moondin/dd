---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 401
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 401 of 867)

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

---[FILE: compute_instance_legacy_metadata_endpoint_disabled.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/compute/compute_instance_legacy_metadata_endpoint_disabled/compute_instance_legacy_metadata_endpoint_disabled.py

```python
"""Check if Compute Instance Legacy Metadata service endpoint is disabled."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.compute.compute_client import compute_client


class compute_instance_legacy_metadata_endpoint_disabled(Check):
    """Check if Compute Instance Legacy Metadata service endpoint is disabled."""

    def execute(self) -> Check_Report_OCI:
        """Execute the compute_instance_legacy_metadata_endpoint_disabled check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for instance in compute_client.instances:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=instance,
                region=instance.region,
                resource_name=instance.name,
                resource_id=instance.id,
                compartment_id=instance.compartment_id,
            )

            if instance.are_legacy_imds_endpoints_disabled:
                report.status = "PASS"
                report.status_extended = f"Compute instance {instance.name} has legacy metadata service endpoint disabled."
            else:
                report.status = "FAIL"
                report.status_extended = f"Compute instance {instance.name} has legacy metadata service endpoint enabled or not configured."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_secure_boot_enabled.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/compute/compute_instance_secure_boot_enabled/compute_instance_secure_boot_enabled.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "compute_instance_secure_boot_enabled",
  "CheckTitle": "Ensure Secure Boot is enabled on Compute Instance",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:compute:instance",
  "Severity": "medium",
  "ResourceType": "OciComputeInstance",
  "Description": "Secure Boot helps ensure that the instance boots using only software that is trusted by the platform firmware. This prevents rootkits and bootkits from loading during the boot process.",
  "Risk": "Without Secure Boot enabled, instances are vulnerable to boot-level malware that can compromise the entire system before the operating system loads.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Compute/References/shielded-instances.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci compute instance update --instance-id <instance-ocid> --platform-config '{\"isSecureBootEnabled\": true}'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Compute/enable-secure-boot.html",
      "Terraform": "resource \"oci_core_instance\" \"example\" {\n  # ... other configuration ...\n  platform_config {\n    type = \"AMD_MILAN_BM\" # or appropriate platform\n    is_secure_boot_enabled = true\n  }\n}"
    },
    "Recommendation": {
      "Text": "Enable Secure Boot on all compute instances to protect against boot-level malware and ensure system integrity.",
      "Url": "https://hub.prowler.com/check/oci/compute_instance_secure_boot_enabled"
    }
  },
  "Categories": [
    "compute",
    "security-configuration"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_secure_boot_enabled.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/compute/compute_instance_secure_boot_enabled/compute_instance_secure_boot_enabled.py

```python
"""Check if Secure Boot is enabled on Compute Instance."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.compute.compute_client import compute_client


class compute_instance_secure_boot_enabled(Check):
    """Check if Secure Boot is enabled on Compute Instance."""

    def execute(self) -> Check_Report_OCI:
        """Execute the compute_instance_secure_boot_enabled check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        for instance in compute_client.instances:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=instance,
                region=instance.region,
                resource_name=instance.name,
                resource_id=instance.id,
                compartment_id=instance.compartment_id,
            )

            if instance.is_secure_boot_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"Compute instance {instance.name} has Secure Boot enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"Compute instance {instance.name} does not have Secure Boot enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: database_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/database/database_client.py

```python
"""OCI Database client."""

from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.database.database_service import Database

database_client = Database(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: database_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/database/database_service.py
Signals: Pydantic

```python
"""OCI Database service."""

from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Database(OCIService):
    """OCI Database service class."""

    def __init__(self, provider):
        """Initialize Database service."""
        super().__init__("database", provider)
        self.autonomous_databases = []
        self.__threading_call_by_region_and_compartment__(
            self.__list_autonomous_databases__
        )

    def __get_client__(self, region: str) -> oci.database.DatabaseClient:
        """Get OCI Database client for a region."""
        return self._create_oci_client(
            oci.database.DatabaseClient, config_overrides={"region": region}
        )

    def __list_autonomous_databases__(self, region, compartment):
        """List all autonomous databases in a compartment."""
        try:
            region_key = region.key if hasattr(region, "key") else str(region)
            database_client = self.__get_client__(region_key)

            autonomous_dbs = oci.pagination.list_call_get_all_results(
                database_client.list_autonomous_databases, compartment_id=compartment.id
            ).data

            for adb in autonomous_dbs:
                # Only include databases not in TERMINATED, TERMINATING, or UNAVAILABLE states
                if adb.lifecycle_state not in [
                    oci.database.models.AutonomousDatabaseSummary.LIFECYCLE_STATE_TERMINATED,
                    oci.database.models.AutonomousDatabaseSummary.LIFECYCLE_STATE_TERMINATING,
                    oci.database.models.AutonomousDatabaseSummary.LIFECYCLE_STATE_UNAVAILABLE,
                ]:
                    self.autonomous_databases.append(
                        AutonomousDatabase(
                            id=adb.id,
                            display_name=adb.display_name,
                            compartment_id=adb.compartment_id,
                            region=region_key,
                            lifecycle_state=adb.lifecycle_state,
                            whitelisted_ips=(
                                adb.whitelisted_ips if adb.whitelisted_ips else []
                            ),
                            subnet_id=adb.subnet_id,
                            db_name=getattr(adb, "db_name", None),
                            db_workload=getattr(adb, "db_workload", None),
                        )
                    )

        except Exception as error:
            logger.error(
                f"{region_key if 'region_key' in locals() else region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class AutonomousDatabase(BaseModel):
    """OCI Autonomous Database model."""

    id: str
    display_name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    whitelisted_ips: list[str]
    subnet_id: Optional[str]
    db_name: Optional[str] = None
    db_workload: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: database_autonomous_database_access_restricted.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/database/database_autonomous_database_access_restricted/database_autonomous_database_access_restricted.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "database_autonomous_database_access_restricted",
  "CheckTitle": "Ensure Oracle Autonomous Shared Database (ADB) access is restricted or deployed within a VCN",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "database",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:database:autonomousdatabase",
  "Severity": "high",
  "ResourceType": "AutonomousDatabase",
  "Description": "Autonomous Shared Database instances should either have IP whitelisting configured or be deployed within a VCN to restrict network access and improve security posture.",
  "Risk": "Public or unrestricted Autonomous Database access increases the attack surface and risk of unauthorized access.",
  "RelatedUrl": "https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/autonomous-private-endpoints.html",
  "Remediation": {
    "Code": {
      "CLI": "oci db autonomous-database create-private-endpoint --autonomous-database-id <adb-ocid> --subnet-id <subnet-ocid>",
      "NativeIaC": "",
      "Other": "1. Navigate to Autonomous Database\n2. Select the database instance\n3. Click 'More Actions' → 'Update'\n4. Under Network Access, select 'Private endpoint access only'\n5. Configure VCN and subnet for private endpoint\n6. Alternatively, configure Access Control List (ACL) with specific IP addresses",
      "Terraform": "resource \"oci_database_autonomous_database\" \"adb\" {\n  compartment_id = var.compartment_id\n  db_name = \"MyADB\"\n  display_name = \"My Autonomous Database\"\n  is_free_tier = false\n  db_workload = \"OLTP\"\n  whitelisted_ips = [\"10.0.0.0/24\"]\n  nsg_ids = [oci_core_network_security_group.adb_nsg.id]\n  subnet_id = oci_core_subnet.private_subnet.id\n}"
    },
    "Recommendation": {
      "Text": "Deploy Autonomous Databases within a VCN using private endpoints or configure strict IP whitelisting to restrict access.",
      "Url": "https://hub.prowler.com/check/oci/database_autonomous_database_access_restricted"
    }
  },
  "Categories": [
    "network-security"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: database_autonomous_database_access_restricted.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/database/database_autonomous_database_access_restricted/database_autonomous_database_access_restricted.py

```python
from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.database.database_client import (
    database_client,
)


class database_autonomous_database_access_restricted(Check):
    """Ensure Oracle Autonomous Shared Database (ADB) access is restricted or deployed within a VCN (CIS 2.8)"""

    def execute(self):
        findings = []

        for adb in database_client.autonomous_databases:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=adb,
                region=adb.region,
                compartment_id=adb.compartment_id,
                resource_id=adb.id,
                resource_name=adb.display_name,
            )

            # Check if database has no whitelisted IPs and no subnet (unrestricted public access)
            if not adb.whitelisted_ips and not adb.subnet_id:
                report.status = "FAIL"
                report.status_extended = f"Autonomous Database {adb.display_name} has unrestricted public access with no whitelisted IPs and is not deployed in a VCN."
            # Check if database has whitelisted IPs containing 0.0.0.0/0
            elif adb.whitelisted_ips and "0.0.0.0/0" in adb.whitelisted_ips:
                report.status = "FAIL"
                report.status_extended = f"Autonomous Database {adb.display_name} has unrestricted public access with IP range 0.0.0.0/0 in whitelisted IPs."
            else:
                report.status = "PASS"
                if adb.subnet_id:
                    report.status_extended = f"Autonomous Database {adb.display_name} is deployed within a VCN."
                else:
                    report.status_extended = f"Autonomous Database {adb.display_name} has restricted public access with whitelisted IPs."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.events.events_service import Events

events_client = Events(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: events_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_service.py
Signals: Pydantic

```python
"""OCI Events Service Module."""

from typing import List

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Events(OCIService):
    """OCI Events Service class to retrieve event rules and notification topics."""

    def __init__(self, provider):
        """Initialize the Events service."""
        super().__init__("events", provider)
        self.rules = []
        self.topics = []
        self.__threading_call__(self.__list_rules__)
        self.__threading_call__(self.__list_topics__)

    def __get_client__(self, region):
        """Get the Events client for a region."""
        return self._create_oci_client(
            oci.events.EventsClient, config_overrides={"region": region}
        )

    def __list_rules__(self, regional_client):
        """List all event rules."""
        try:
            # Create events client for this region
            events_client = self.__get_client__(regional_client.region)
            if not events_client:
                return

            logger.info(f"Events - Listing Rules in {regional_client.region}...")

            for compartment in self.audited_compartments:
                try:
                    logger.info(
                        f"Events - Checking compartment {compartment.name} ({compartment.id})..."
                    )
                    rules = oci.pagination.list_call_get_all_results(
                        events_client.list_rules, compartment_id=compartment.id
                    ).data

                    logger.info(
                        f"Events - Found {len(rules)} rules in compartment {compartment.name}"
                    )

                    for rule in rules:
                        if rule.lifecycle_state != "DELETED":
                            # Get full rule details including actions
                            try:
                                full_rule = events_client.get_rule(rule_id=rule.id).data

                                # Extract actions from the full rule details
                                actions_list = []
                                if hasattr(full_rule, "actions") and full_rule.actions:
                                    if hasattr(full_rule.actions, "actions"):
                                        # Convert action objects to dictionaries for JSON serialization
                                        for action in full_rule.actions.actions:
                                            action_dict = {
                                                "action_type": (
                                                    action.action_type
                                                    if hasattr(action, "action_type")
                                                    else None
                                                ),
                                                "is_enabled": (
                                                    action.is_enabled
                                                    if hasattr(action, "is_enabled")
                                                    else False
                                                ),
                                                "id": (
                                                    action.id
                                                    if hasattr(action, "id")
                                                    else None
                                                ),
                                            }
                                            actions_list.append(action_dict)

                                self.rules.append(
                                    Rule(
                                        id=full_rule.id,
                                        name=(
                                            full_rule.display_name
                                            if hasattr(full_rule, "display_name")
                                            else full_rule.id
                                        ),
                                        compartment_id=compartment.id,
                                        region=regional_client.region,
                                        lifecycle_state=full_rule.lifecycle_state,
                                        condition=(
                                            full_rule.condition
                                            if hasattr(full_rule, "condition")
                                            else ""
                                        ),
                                        is_enabled=(
                                            full_rule.is_enabled
                                            if hasattr(full_rule, "is_enabled")
                                            else False
                                        ),
                                        actions=actions_list,
                                    )
                                )
                            except Exception as error:
                                logger.error(
                                    f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                                )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def __list_topics__(self, regional_client):
        """List all notification topics."""
        try:
            # Control plane client for listing topics
            ons_control_client = self._create_oci_client(
                oci.ons.NotificationControlPlaneClient,
                config_overrides={"region": regional_client.region},
            )

            # Data plane client for listing subscriptions
            ons_data_client = self._create_oci_client(
                oci.ons.NotificationDataPlaneClient,
                config_overrides={"region": regional_client.region},
            )

            logger.info(f"Events - Listing Topics in {regional_client.region}...")

            # First, get all subscriptions in this compartment for later matching
            all_subscriptions = {}
            for compartment in self.audited_compartments:
                try:
                    subs = oci.pagination.list_call_get_all_results(
                        ons_data_client.list_subscriptions,
                        compartment_id=compartment.id,
                    ).data

                    # Group subscriptions by topic_id
                    for sub in subs:
                        topic_id = sub.topic_id
                        if topic_id not in all_subscriptions:
                            all_subscriptions[topic_id] = []
                        if sub.lifecycle_state == "ACTIVE":
                            all_subscriptions[topic_id].append(sub.id)
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue

            # Now list all topics and attach their subscriptions
            for compartment in self.audited_compartments:
                try:
                    topics = oci.pagination.list_call_get_all_results(
                        ons_control_client.list_topics, compartment_id=compartment.id
                    ).data

                    for topic in topics:
                        if topic.lifecycle_state != "DELETED":
                            # Get subscriptions for this topic from our pre-fetched map
                            subscriptions = all_subscriptions.get(topic.topic_id, [])

                            self.topics.append(
                                Topic(
                                    id=topic.topic_id,
                                    name=topic.name,
                                    compartment_id=compartment.id,
                                    region=regional_client.region,
                                    lifecycle_state=topic.lifecycle_state,
                                    subscriptions=subscriptions,
                                )
                            )
                except Exception as error:
                    logger.error(
                        f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
                    continue
        except Exception as error:
            logger.error(
                f"{regional_client.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


# Service Models
class Rule(BaseModel):
    """OCI Events Rule model."""

    id: str
    name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    condition: str
    is_enabled: bool
    actions: List = []


class Topic(BaseModel):
    """OCI Notification Topic model."""

    id: str
    name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    subscriptions: List[str] = []
```

--------------------------------------------------------------------------------

---[FILE: events_notification_topic_and_subscription_exists.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_notification_topic_and_subscription_exists/events_notification_topic_and_subscription_exists.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_notification_topic_and_subscription_exists",
  "CheckTitle": "Create at least one notification topic and subscription to receive monitoring alerts",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "events",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:events:rule",
  "Severity": "medium",
  "ResourceType": "OciEventsRule",
  "Description": "At least one notification topic and subscription should exist to receive monitoring alerts.",
  "Risk": "Without proper event monitoring, security-relevant changes may go unnoticed.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Events/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci events rule create --display-name <name> --condition <event-condition> --actions <notification-actions>",
      "NativeIaC": "",
      "Other": "1. Navigate to Observability & Management > Events Service\n2. Create a new rule\n3. Configure the event condition\n4. Add notification action\n5. Save the rule",
      "Terraform": "resource \"oci_events_rule\" \"example\" {\n  display_name = \"rule\"\n  is_enabled = true\n  condition = jsonencode({\n    eventType = [\"com.oraclecloud.*\"]\n  })\n  actions {\n    actions {\n      action_type = \"ONS\"\n      topic_id = var.topic_id\n    }\n  }\n}"
    },
    "Recommendation": {
      "Text": "Create at least one notification topic and subscription to receive monitoring alerts",
      "Url": "https://hub.prowler.com/check/oci/events_notification_topic_and_subscription_exists"
    }
  },
  "Categories": [
    "logging",
    "monitoring"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: events_notification_topic_and_subscription_exists.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_notification_topic_and_subscription_exists/events_notification_topic_and_subscription_exists.py

```python
"""Check Create at least one notification topic and subscription to receive monitoring alerts."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client


class events_notification_topic_and_subscription_exists(Check):
    """Check Create at least one notification topic and subscription to receive monitoring alerts."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_notification_topic_and_subscription_exists check."""
        findings = []

        # Check if at least one topic with subscriptions exists
        has_topic_with_subscription = any(
            len(topic.subscriptions) > 0 for topic in events_client.topics
        )

        # Create a single report for tenancy-level check
        # Use the first topic's region if available, otherwise use the first audited region
        region = "global"
        if events_client.topics:
            region = events_client.topics[0].region
        elif events_client.audited_regions:
            # audited_regions contains OCIRegion objects, extract the key
            first_region = events_client.audited_regions[0]
            region = (
                first_region.key if hasattr(first_region, "key") else str(first_region)
            )

        report = Check_Report_OCI(
            metadata=self.metadata(),
            resource={},
            region=region,
            resource_name="Notification Service",
            resource_id=events_client.audited_tenancy,
            compartment_id=events_client.audited_tenancy,
        )

        if has_topic_with_subscription:
            report.status = "PASS"
            report.status_extended = (
                "At least one notification topic with active subscriptions exists."
            )
        else:
            report.status = "FAIL"
            report.status_extended = (
                "No notification topics with active subscriptions found."
            )

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_cloudguard_problems.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_cloudguard_problems/events_rule_cloudguard_problems.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_cloudguard_problems",
  "CheckTitle": "Ensure a notification is configured for Oracle Cloud Guard problems detected",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "events",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:events:rule",
  "Severity": "medium",
  "ResourceType": "OciEventRule",
  "Description": "Ensure a notification is configured for Oracle Cloud Guard problems detected",
  "Risk": "Without Cloud Guard, security threats may not be detected and remediated.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/cloud-guard/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci cloud-guard configuration update --compartment-id <tenancy-ocid> --status ENABLED --reporting-region <region>",
      "NativeIaC": "",
      "Other": "1. Navigate to Security > Cloud Guard\n2. Enable Cloud Guard\n3. Select reporting region\n4. Configure detectors and responders",
      "Terraform": "resource \"oci_cloud_guard_cloud_guard_configuration\" \"example\" {\n  compartment_id = var.tenancy_ocid\n  reporting_region = var.region\n  status = \"ENABLED\"\n}"
    },
    "Recommendation": {
      "Text": "Ensure a notification is configured for Oracle Cloud Guard problems detected",
      "Url": "https://hub.prowler.com/check/oci/cloudguard_notification_configured"
    }
  },
  "Categories": [
    "monitoring"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: events_rule_cloudguard_problems.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_cloudguard_problems/events_rule_cloudguard_problems.py

```python
"""Check Ensure a notification is configured for Oracle Cloud Guard problems detected."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.cloudguard.cloudguard_client import (
    cloudguard_client,
)
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_cloudguard_problems(Check):
    """Check Ensure a notification is configured for Oracle Cloud Guard problems detected."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_cloudguard_problems check."""
        findings = []

        # Required event types for Cloud Guard notifications
        required_event_types = [
            "com.oraclecloud.cloudguard.problemdetected",
            "com.oraclecloud.cloudguard.problemdismissed",
            "com.oraclecloud.cloudguard.problemremediated",
        ]

        # Get Cloud Guard reporting region (if Cloud Guard is configured)
        reporting_region = None
        if cloudguard_client.configuration:
            reporting_region = cloudguard_client.configuration.reporting_region

        # Filter rules that monitor Cloud Guard problems
        matching_rules = filter_rules_by_event_types(
            events_client.rules, required_event_types
        )

        # If reporting region is set, filter rules to only those in that region
        if reporting_region:
            matching_rules = [
                (rule, condition)
                for rule, condition in matching_rules
                if rule.region == reporting_region
            ]

        # Create findings for each matching rule
        for rule, _ in matching_rules:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=rule,
                region=rule.region,
                resource_name=rule.name,
                resource_id=rule.id,
                compartment_id=rule.compartment_id,
            )

            # Check if the rule has notification actions
            if check_event_rule_has_notification_actions(rule):
                report.status = "PASS"
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor Cloud Guard problems with notifications."
                if reporting_region:
                    report.status_extended += (
                        f" (Cloud Guard reporting region: {reporting_region})"
                    )
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors Cloud Guard problems but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region=reporting_region if reporting_region else "global",
                resource_name="Cloud Guard Problem Notifications",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            region_note = (
                f" in Cloud Guard reporting region '{reporting_region}'"
                if reporting_region
                else ""
            )
            report.status_extended = f"No event rules configured{region_note} to monitor Cloud Guard problems (detected, dismissed, remediated)."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_iam_group_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_iam_group_changes/events_rule_iam_group_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_iam_group_changes",
  "CheckTitle": "Ensure a notification is configured for IAM group changes",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "events",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:events:rule",
  "Severity": "medium",
  "ResourceType": "OciEventsRule",
  "Description": "Event rules should be configured to notify on IAM group changes.",
  "Risk": "Without proper event monitoring, security-relevant changes may go unnoticed.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Events/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci events rule create --display-name <name> --condition <event-condition> --actions <notification-actions>",
      "NativeIaC": "",
      "Other": "1. Navigate to Observability & Management > Events Service\n2. Create a new rule\n3. Configure the event condition\n4. Add notification action\n5. Save the rule",
      "Terraform": "resource \"oci_events_rule\" \"example\" {\n  display_name = \"rule\"\n  is_enabled = true\n  condition = jsonencode({\n    eventType = [\"com.oraclecloud.*\"]\n  })\n  actions {\n    actions {\n      action_type = \"ONS\"\n      topic_id = var.topic_id\n    }\n  }\n}"
    },
    "Recommendation": {
      "Text": "Ensure a notification is configured for IAM group changes",
      "Url": "https://hub.prowler.com/check/oci/events_rule_iam_group_changes"
    }
  },
  "Categories": [
    "logging",
    "monitoring"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: events_rule_iam_group_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_iam_group_changes/events_rule_iam_group_changes.py

```python
"""Check Ensure a notification is configured for IAM group changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_iam_group_changes(Check):
    """Check Ensure a notification is configured for IAM group changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_iam_group_changes check."""
        findings = []

        # Required event types for IAM group changes
        required_event_types = [
            "com.oraclecloud.identitycontrolplane.creategroup",
            "com.oraclecloud.identitycontrolplane.deletegroup",
            "com.oraclecloud.identitycontrolplane.updategroup",
        ]

        # Filter rules that monitor IAM group changes
        matching_rules = filter_rules_by_event_types(
            events_client.rules, required_event_types
        )

        # Create findings for each matching rule
        for rule, _ in matching_rules:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=rule,
                region=rule.region,
                resource_name=rule.name,
                resource_id=rule.id,
                compartment_id=rule.compartment_id,
            )

            # Check if the rule has notification actions
            if check_event_rule_has_notification_actions(rule):
                report.status = "PASS"
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor IAM group changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors IAM group changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="IAM Group Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor IAM group changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
