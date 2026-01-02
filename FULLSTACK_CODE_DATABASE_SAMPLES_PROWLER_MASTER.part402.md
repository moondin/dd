---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 402
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 402 of 867)

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

---[FILE: events_rule_iam_policy_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_iam_policy_changes/events_rule_iam_policy_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_iam_policy_changes",
  "CheckTitle": "Ensure a notification is configured for IAM policy changes",
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
  "Description": "Event rules should be configured to notify on IAM policy changes.",
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
      "Text": "Ensure a notification is configured for IAM policy changes",
      "Url": "https://hub.prowler.com/check/oci/events_rule_iam_policy_changes"
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

---[FILE: events_rule_iam_policy_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_iam_policy_changes/events_rule_iam_policy_changes.py

```python
"""Check Ensure a notification is configured for IAM policy changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_iam_policy_changes(Check):
    """Check Ensure a notification is configured for IAM policy changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_iam_policy_changes check."""
        findings = []

        # Required event types for IAM policy changes
        required_event_types = [
            "com.oraclecloud.identitycontrolplane.createpolicy",
            "com.oraclecloud.identitycontrolplane.deletepolicy",
            "com.oraclecloud.identitycontrolplane.updatepolicy",
        ]

        # Filter rules that monitor IAM policy changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor IAM policy changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors IAM policy changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Iam Policy Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor IAM policy changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_identity_provider_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_identity_provider_changes/events_rule_identity_provider_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_identity_provider_changes",
  "CheckTitle": "Ensure a notification is configured for Identity Provider changes",
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
  "Description": "Event rules should be configured to notify on identity provider changes.",
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
      "Text": "Ensure a notification is configured for Identity Provider changes",
      "Url": "https://hub.prowler.com/check/oci/events_rule_identity_provider_changes"
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

---[FILE: events_rule_identity_provider_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_identity_provider_changes/events_rule_identity_provider_changes.py

```python
"""Check Ensure a notification is configured for identity provider changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_identity_provider_changes(Check):
    """Check Ensure a notification is configured for identity provider changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_identity_provider_changes check."""
        findings = []

        # Required event types for identity provider changes
        required_event_types = [
            "com.oraclecloud.identitycontrolplane.createidentityprovider",
            "com.oraclecloud.identitycontrolplane.deleteidentityprovider",
            "com.oraclecloud.identitycontrolplane.updateidentityprovider",
        ]

        # Filter rules that monitor identity provider changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor identity provider changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors identity provider changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Identity Provider Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor identity provider changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_idp_group_mapping_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_idp_group_mapping_changes/events_rule_idp_group_mapping_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_idp_group_mapping_changes",
  "CheckTitle": "Ensure a notification is configured for IdP group mapping changes",
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
  "Description": "Event rules should be configured to notify on IdP group mapping changes.",
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
      "Text": "Ensure a notification is configured for IdP group mapping changes",
      "Url": "https://hub.prowler.com/check/oci/events_rule_idp_group_mapping_changes"
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

---[FILE: events_rule_idp_group_mapping_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_idp_group_mapping_changes/events_rule_idp_group_mapping_changes.py

```python
"""Check Ensure a notification is configured for IdP group mapping changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_idp_group_mapping_changes(Check):
    """Check Ensure a notification is configured for IdP group mapping changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_idp_group_mapping_changes check."""
        findings = []

        # Required event types for IdP group mapping changes
        required_event_types = [
            "com.oraclecloud.identitycontrolplane.createidpgroupmapping",
            "com.oraclecloud.identitycontrolplane.deleteidpgroupmapping",
            "com.oraclecloud.identitycontrolplane.updateidpgroupmapping",
        ]

        # Filter rules that monitor IdP group mapping changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor IdP group mapping changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors IdP group mapping changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Idp Group Mapping Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor IdP group mapping changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_local_user_authentication.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_local_user_authentication/events_rule_local_user_authentication.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_local_user_authentication",
  "CheckTitle": "Ensure a notification is configured for Local OCI User Authentication",
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
  "Description": "Ensure that an Event Rule and Notification are configured to detect when a user authenticates via OCI local authentication. Event Rules are compartment-scoped and will detect events in child compartments. This Event rule is required to be created at the root compartment level.",
  "Risk": "Without proper notification for local user authentication events, unauthorized access attempts or suspicious authentication activity may go undetected, increasing the risk of security breaches.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Events/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci events rule create --display-name user-authentication-rule --is-enabled true --condition '{\"eventType\":[\"com.oraclecloud.identitysignon.interactivelogin\"]}' --compartment-id <root-compartment-ocid> --actions '{\"actions\":[{\"actionType\":\"ONS\",\"isEnabled\":true,\"topicId\":\"<topic-ocid>\"}]}'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-Events/detect-oci-local-authentication.html",
      "Terraform": "resource \"oci_events_rule\" \"user_auth_rule\" {\n  display_name    = \"user-authentication-events\"\n  is_enabled      = true\n  compartment_id  = var.tenancy_ocid\n  condition       = \"{\\\"eventType\\\":[\\\"com.oraclecloud.identitysignon.interactivelogin\\\"]}\"\n  actions {\n    actions {\n      action_type = \"ONS\"\n      is_enabled  = true\n      topic_id    = oci_ons_notification_topic.topic.id\n    }\n  }\n}"
    },
    "Recommendation": {
      "Text": "Create an Event Rule with notifications configured to monitor local OCI user authentication events (com.oraclecloud.identitysignon.interactivelogin)",
      "Url": "https://hub.prowler.com/check/oci/events_rule_local_user_authentication"
    }
  },
  "Categories": [
    "logging",
    "monitoring",
    "security-configuration"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: events_rule_local_user_authentication.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_local_user_authentication/events_rule_local_user_authentication.py

```python
"""Check Ensure a notification is configured for Local OCI User Authentication."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_local_user_authentication(Check):
    """Check Ensure a notification is configured for Local OCI User Authentication."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_local_user_authentication check."""
        findings = []

        # Required event type for user authentication
        required_event_types = ["com.oraclecloud.identitysignon.interactivelogin"]

        # Filter rules that monitor user authentication
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor local OCI user authentication with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors local OCI user authentication but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Local User Authentication Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor local OCI user authentication."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_network_gateway_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_network_gateway_changes/events_rule_network_gateway_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_network_gateway_changes",
  "CheckTitle": "Ensure a notification is configured for changes to network gateways",
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
  "Description": "Event rules should be configured to notify on network gateway changes.",
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
      "Text": "Ensure a notification is configured for changes to network gateways",
      "Url": "https://hub.prowler.com/check/oci/events_rule_network_gateway_changes"
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

---[FILE: events_rule_network_gateway_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_network_gateway_changes/events_rule_network_gateway_changes.py

```python
"""Check Ensure a notification is configured for network gateway changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_network_gateway_changes(Check):
    """Check Ensure a notification is configured for network gateway changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_network_gateway_changes check."""
        findings = []

        # Required event types for network gateway changes
        required_event_types = [
            "com.oraclecloud.virtualnetwork.createdrg",
            "com.oraclecloud.virtualnetwork.deletedrg",
            "com.oraclecloud.virtualnetwork.updatedrg",
            "com.oraclecloud.virtualnetwork.createdrgattachment",
            "com.oraclecloud.virtualnetwork.deletedrgattachment",
            "com.oraclecloud.virtualnetwork.updatedrgattachment",
            "com.oraclecloud.virtualnetwork.changeinternetgatewaycompartment",
            "com.oraclecloud.virtualnetwork.createinternetgateway",
            "com.oraclecloud.virtualnetwork.deleteinternetgateway",
            "com.oraclecloud.virtualnetwork.updateinternetgateway",
            "com.oraclecloud.virtualnetwork.changelocalpeeringgatewaycompartment",
            "com.oraclecloud.virtualnetwork.createlocalpeeringgateway",
            "com.oraclecloud.virtualnetwork.deletelocalpeeringgateway.end",
            "com.oraclecloud.virtualnetwork.updatelocalpeeringgateway",
            "com.oraclecloud.natgateway.changenatgatewaycompartment",
            "com.oraclecloud.natgateway.createnatgateway",
            "com.oraclecloud.natgateway.deletenatgateway",
            "com.oraclecloud.natgateway.updatenatgateway",
            "com.oraclecloud.servicegateway.attachserviceid",
            "com.oraclecloud.servicegateway.changeservicegatewaycompartment",
            "com.oraclecloud.servicegateway.createservicegateway",
            "com.oraclecloud.servicegateway.deleteservicegateway.end",
            "com.oraclecloud.servicegateway.detachserviceid",
            "com.oraclecloud.servicegateway.updateservicegateway",
        ]

        # Filter rules that monitor network gateway changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor network gateway changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors network gateway changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Network Gateway Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor network gateway changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_network_security_group_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_network_security_group_changes/events_rule_network_security_group_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_network_security_group_changes",
  "CheckTitle": "Ensure a notification is configured for network security group changes",
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
  "Description": "Event rules should be configured to notify on network security group changes.",
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
      "Text": "Ensure a notification is configured for network security group changes",
      "Url": "https://hub.prowler.com/check/oci/events_rule_network_security_group_changes"
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

---[FILE: events_rule_network_security_group_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_network_security_group_changes/events_rule_network_security_group_changes.py

```python
"""Check Ensure a notification is configured for network security group changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_network_security_group_changes(Check):
    """Check Ensure a notification is configured for network security group changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_network_security_group_changes check."""
        findings = []

        # Required event types for network security group changes
        required_event_types = [
            "com.oraclecloud.virtualnetwork.changenetworksecuritygroupcompartment",
            "com.oraclecloud.virtualnetwork.createnetworksecuritygroup",
            "com.oraclecloud.virtualnetwork.deletenetworksecuritygroup",
            "com.oraclecloud.virtualnetwork.updatenetworksecuritygroup",
        ]

        # Filter rules that monitor network security group changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor network security group changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors network security group changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Network Security Group Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor network security group changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_route_table_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_route_table_changes/events_rule_route_table_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_route_table_changes",
  "CheckTitle": "Ensure a notification is configured for changes to route tables",
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
  "Description": "Event rules should be configured to notify on route table changes.",
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
      "Text": "Ensure a notification is configured for changes to route tables",
      "Url": "https://hub.prowler.com/check/oci/events_rule_route_table_changes"
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

---[FILE: events_rule_route_table_changes.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_route_table_changes/events_rule_route_table_changes.py

```python
"""Check Ensure a notification is configured for route table changes."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.events.events_client import events_client
from prowler.providers.oraclecloud.services.events.lib.helpers import (
    check_event_rule_has_notification_actions,
    filter_rules_by_event_types,
)


class events_rule_route_table_changes(Check):
    """Check Ensure a notification is configured for route table changes."""

    def execute(self) -> Check_Report_OCI:
        """Execute the events_rule_route_table_changes check."""
        findings = []

        # Required event types for route table changes
        required_event_types = [
            "com.oraclecloud.virtualnetwork.changeroutetablecompartment",
            "com.oraclecloud.virtualnetwork.createroutetable",
            "com.oraclecloud.virtualnetwork.deleteroutetable",
            "com.oraclecloud.virtualnetwork.updateroutetable",
        ]

        # Filter rules that monitor route table changes
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
                report.status_extended = f"Event rule '{rule.name}' is configured to monitor route table changes with notifications."
            else:
                report.status = "FAIL"
                report.status_extended = f"Event rule '{rule.name}' monitors route table changes but does not have notification actions configured."

            findings.append(report)

        # If no matching rules found, create a single FAIL finding
        if not findings:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Route Table Changes Event Rule",
                resource_id=events_client.audited_tenancy,
                compartment_id=events_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = (
                "No event rules configured to monitor route table changes."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: events_rule_security_list_changes.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/events/events_rule_security_list_changes/events_rule_security_list_changes.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "events_rule_security_list_changes",
  "CheckTitle": "Ensure a notification is configured for security list changes",
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
  "Description": "Event rules should be configured to notify on security list changes.",
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
      "Text": "Ensure a notification is configured for security list changes",
      "Url": "https://hub.prowler.com/check/oci/events_rule_security_list_changes"
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

````
