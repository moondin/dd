---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 403
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 403 of 867)

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

---[FILE: events_rule_security_list_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_security_list_changes/events_rule_security_list_changes.py

```python
"""Check Ensure a notification is configured for security list changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_security_list_changes(Check):
    """Check Ensure a notification is configured for security list changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_security_list_changes check."""
        findings = []

        # Required event types for security list changes
        required_event_types = [
            "com.oraclecloud.virtualnetwork.changesecuritylistcompartment",
            "com.oraclecloud.virtualnetwork.createsecuritylist",
            "com.oraclecloud.virtualnetwork.deletesecuritylist",
            "com.oraclecloud.virtualnetwork.updatesecuritylist",
        ]

        # Filter rules that monitor security list changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor security list changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors security list changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Security List Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor security list changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_user_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_user_changes/events_rule_user_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_user_changes",
  "CheckTitle": "Ensure a notification is configured for user changes",
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
  "Description": "Event rules should be configured to notify on user changes.",
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
      "Text": "Ensure a notification is configured for user changes",
      "Url": "https://hub.prowler.com/check/oci/events_rule_user_changes"
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

---[FILE: events_rule_user_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_user_changes/events_rule_user_changes.py

```python
"""Check Ensure a notification is configured for user changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_user_changes(Check):
    """Check Ensure a notification is configured for user changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_user_changes check."""
        findings = []

        # Required event types for user changes
        required_event_types = [
            "com.oraclecloud.identitycontrolplane.createuser",
            "com.oraclecloud.identitycontrolplane.deleteuser",
            "com.oraclecloud.identitycontrolplane.updateuser",
            "com.oraclecloud.identitycontrolplane.updateusercapabilities",
            "com.oraclecloud.identitycontrolplane.updateuserstate",
        ]

        # Filter rules that monitor user changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor user changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors user changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="User Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor user changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_vcn_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_vcn_changes/events_rule_vcn_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_vcn_changes",
  "CheckTitle": "Ensure a notification is configured for VCN changes",
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
  "Description": "Event rules should be configured to notify on VCN changes.",
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
      "Text": "Ensure a notification is configured for VCN changes",
      "Url": "https://hub.prowler.com/check/oci/events_rule_vcn_changes"
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

---[FILE: events_rule_vcn_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_vcn_changes/events_rule_vcn_changes.py

```python
"""Check Ensure a notification is configured for VCN changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_vcn_changes(Check):
    """Check Ensure a notification is configured for VCN changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_vcn_changes check."""
        findings = []

        # Required event types for VCN changes
        required_event_types = [
            "com.oraclecloud.virtualnetwork.createvcn",
            "com.oraclecloud.virtualnetwork.deletevcn",
            "com.oraclecloud.virtualnetwork.updatevcn",
        ]

        # Filter rules that monitor VCN changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor VCN changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors VCN changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Vcn Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = "No event rules configured to monitor VCN changes."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: helpers.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/lib/helpers.py

```python
"""Helper functions for OCI Events service checks."""

import json
from typing import List, Optional

from prowler.lib.logger import logger


def check_event_rule_has_event_types(
    rule, required_event_types: List[str]
) -> tuple[bool, Optional[dict]]:
    """
    Check if an event rule contains all required event types in its condition.

    Args:
        rule: The OCI Event Rule object with condition attribute
        required_event_types: List of required event type strings (e.g., ['com.oraclecloud.cloudguard.problemdetected'])

    Returns:
        tuple: (has_all_types: bool, condition_dict: dict or None)
            - has_all_types: True if rule contains all required event types
            - condition_dict: Parsed condition dictionary, or None if parsing failed

    Example:
        >>> has_types, condition = check_event_rule_has_event_types(
        ...     rule,
        ...     ['com.oraclecloud.identitysignon.interactivelogin']
        ... )
        >>> if has_types:
        ...     print("Rule monitors user authentication")
    """
    try:
        # Parse the event condition JSON (handle single quotes)
        condition_str = rule.condition.lower().replace("'", '"')
        condition_dict = json.loads(condition_str)

        # Check if all required event types are in the condition
        if "eventtype" in condition_dict:
            event_types = condition_dict["eventtype"]
            if isinstance(event_types, list):
                # Check if all required event types are present
                has_all = all(evt in event_types for evt in required_event_types)
                return has_all, condition_dict

        return False, condition_dict

    except (json.JSONDecodeError, KeyError, AttributeError) as error:
        logger.debug(
            f"Failed to parse event rule condition for rule {getattr(rule, 'id', 'unknown')}: {error}"
        )
        return False, None


def check_event_rule_has_notification_actions(rule) -> bool:
    """
    Check if an event rule has notification actions configured.

    Args:
        rule: The OCI Event Rule object with actions attribute

    Returns:
        bool: True if rule has notification actions configured

    Example:
        >>> if check_event_rule_has_notification_actions(rule):
        ...     print("Rule has notifications configured")
    """
    try:
        return bool(rule.actions) and len(rule.actions) > 0
    except (AttributeError, TypeError):
        return False


def filter_rules_by_event_types(
    rules: List, required_event_types: List[str], check_active_only: bool = True
) -> List[tuple]:
    """
    Filter event rules by required event types.

    Args:
        rules: List of OCI Event Rule objects
        required_event_types: List of required event type strings
        check_active_only: If True, only check ACTIVE and enabled rules (default: True)

    Returns:
        List of tuples: [(rule, condition_dict), ...] for rules that match the criteria

    Example:
        >>> matching_rules = filter_rules_by_event_types(
        ...     events_client.rules,
        ...     ['com.oraclecloud.identitysignon.interactivelogin']
        ... )
        >>> for rule, condition in matching_rules:
        ...     print(f"Found matching rule: {rule.name}")
    """
    matching_rules = []

    for rule in rules:
        # Skip non-active or disabled rules if requested
        if check_active_only:
            if not (
                hasattr(rule, "lifecycle_state")
                and rule.lifecycle_state == "ACTIVE"
                and hasattr(rule, "is_enabled")
                and rule.is_enabled
            ):
                continue

        # Check if rule has required event types
        has_types, condition_dict = check_event_rule_has_event_types(
            rule, required_event_types
        )
        if has_types:
            matching_rules.append((rule, condition_dict))

    return matching_rules
```

--------------------------------------------------------------------------------

---[FILE: filestorage_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/filestorage/filestorage_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.filestorage.filestorage_service import (
    Filestorage,
)

filestorage_client = Filestorage(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: filestorage_service.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/filestorage/filestorage_service.py
Signals: Pydantic

```python
"""OCI Filestorage Service Module."""

from typing import Optional

import oci
from pydantic import BaseModel

from prowler.lib.logger import logger
from prowler.providers.oraclecloud.lib.service.service import OCIService


class Filestorage(OCIService):
    """OCI Filestorage Service class."""

    def __init__(self, provider):
        """Initialize the Filestorage service."""
        super().__init__("filestorage", provider)
        self.file_systems = []
        self.__threading_call__(self.__list_file_systems__)

    def __get_client__(self, region):
        """Get the Filestorage client for a region."""
        client_region = self.regional_clients.get(region)
        if client_region:
            return self._create_oci_client(oci.file_storage.FileStorageClient)
        return None

    def __list_file_systems__(self, regional_client):
        """List all file_systems."""
        try:
            client = self.__get_client__(regional_client.region)
            if not client:
                return

            logger.info(
                f"Filestorage - Listing file_systems in {regional_client.region}..."
            )

            for compartment in self.audited_compartments:
                try:
                    # Get availability domains for this compartment
                    identity_client = self._create_oci_client(
                        oci.identity.IdentityClient
                    )
                    availability_domains = identity_client.list_availability_domains(
                        compartment_id=compartment.id
                    ).data

                    # List file systems in each availability domain
                    for ad in availability_domains:
                        items = oci.pagination.list_call_get_all_results(
                            client.list_file_systems,
                            compartment_id=compartment.id,
                            availability_domain=ad.name,
                        ).data

                        for item in items:
                            if item.lifecycle_state not in ["DELETED", "DELETING"]:
                                self.file_systems.append(
                                    FileSystem(
                                        id=item.id,
                                        name=(
                                            item.display_name
                                            if hasattr(item, "display_name")
                                            else item.id
                                        ),
                                        compartment_id=compartment.id,
                                        region=regional_client.region,
                                        lifecycle_state=item.lifecycle_state,
                                        kms_key_id=(
                                            item.kms_key_id
                                            if hasattr(item, "kms_key_id")
                                            else None
                                        ),
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


class FileSystem(BaseModel):
    """FileSystem model."""

    id: str
    name: str
    compartment_id: str
    region: str
    lifecycle_state: str
    kms_key_id: Optional[str] = None
```

--------------------------------------------------------------------------------

---[FILE: filestorage_file_system_encrypted_with_cmk.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/filestorage/filestorage_file_system_encrypted_with_cmk/filestorage_file_system_encrypted_with_cmk.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "filestorage_file_system_encrypted_with_cmk",
  "CheckTitle": "Ensure File Storage Systems are encrypted with Customer Managed Keys",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "filestorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:filestorage:resource",
  "Severity": "medium",
  "ResourceType": "OciFilestorageResource",
  "Description": "File systems should be encrypted with Customer Managed Keys (CMK) for enhanced security and control over encryption keys.",
  "Risk": "Not meeting this requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-FileStorage/file-storage-systems-encrypted-with-cmks.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure File Storage Systems are encrypted with Customer Managed Keys",
      "Url": "https://hub.prowler.com/check/oci/filestorage_file_system_encrypted_with_cmk"
    }
  },
  "Categories": [
    "security-configuration"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: filestorage_file_system_encrypted_with_cmk.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/filestorage/filestorage_file_system_encrypted_with_cmk/filestorage_file_system_encrypted_with_cmk.py

```python
"""Check Ensure File Storage Systems are encrypted with Customer Managed Keys."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.filestorage.filestorage_client import (
    filestorage_client,
)


class filestorage_file_system_encrypted_with_cmk(Check):
    """Check Ensure File Storage Systems are encrypted with Customer Managed Keys."""

    def execute(self) -> Check_Report_OCI:
        """Execute the filestorage_file_system_encrypted_with_cmk check."""
        findings = []

        for resource in filestorage_client.file_systems:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=resource,
                region=resource.region,
                resource_name=resource.name,
                resource_id=resource.id,
                compartment_id=resource.compartment_id,
            )

            if resource.kms_key_id is not None:
                report.status = "PASS"
                report.status_extended = (
                    f"{resource.name} meets the security requirement."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"{resource.name} does not meet the security requirement."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_client.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.oraclecloud.services.identity.identity_service import Identity

identity_client = Identity(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
