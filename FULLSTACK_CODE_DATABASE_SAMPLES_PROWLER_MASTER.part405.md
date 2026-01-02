---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 405
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 405 of 867)

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

---[FILE: identity_instance_principal_used.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_instance_principal_used/identity_instance_principal_used.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_instance_principal_used",
  "CheckTitle": "Ensure Instance Principal authentication is used for OCI instances, OCI Cloud Databases and OCI Functions to access OCI resources",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "medium",
  "ResourceType": "OciIamUser",
  "Description": "Instance Principal authentication should be used instead of user credentials.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure Instance Principal authentication is used for OCI instances, OCI Cloud Databases and OCI Functions to access OCI resources",
      "Url": "https://hub.prowler.com/check/oci/identity_instance_principal_used"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: identity_instance_principal_used.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_instance_principal_used/identity_instance_principal_used.py

```python
"""Check Ensure Instance Principal authentication is used for OCI instances, OCI Cloud Databases and OCI Functions to access OCI resources."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_instance_principal_used(Check):
    """Check Ensure Instance Principal authentication is used for OCI instances, OCI Cloud Databases and OCI Functions to access OCI resources."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_instance_principal_used check."""
        findings = []

        # Resources to check for in matching rules
        oci_resources = [
            "fnfunc",
            "instance",
            "autonomousdatabase",
            "resource.compartment.id",
        ]

        # Track which dynamic groups have valid instance principal configurations
        valid_dynamic_groups = []
        invalid_dynamic_groups = []

        for dynamic_group in identity_client.dynamic_groups:
            matching_rule_upper = dynamic_group.matching_rule.upper()

            # Check if any of the OCI resources are in the matching rule
            if any(
                oci_resource.upper() in matching_rule_upper
                for oci_resource in oci_resources
            ):
                valid_dynamic_groups.append(dynamic_group)
            else:
                invalid_dynamic_groups.append(dynamic_group)

        # Determine the region - use the first dynamic group's region if available, otherwise first audited region
        region = "global"
        if identity_client.dynamic_groups:
            region = identity_client.dynamic_groups[0].region
        elif identity_client.audited_regions:
            first_region = identity_client.audited_regions[0]
            region = (
                first_region.key if hasattr(first_region, "key") else str(first_region)
            )

        # Create a report for the tenancy
        report = Check_Report_OCI(
            metadata=self.metadata(),
            resource={},
            region=region,
            resource_name="Instance Principal Configuration",
            resource_id=identity_client.audited_tenancy,
            compartment_id=identity_client.audited_tenancy,
        )

        # If there are valid dynamic groups for instance principals, PASS
        if valid_dynamic_groups:
            report.status = "PASS"
            report.status_extended = f"Dynamic Groups are configured for instance principal authentication. Found {len(valid_dynamic_groups)} dynamic group(s) with proper matching rules."
        else:
            report.status = "FAIL"
            report.status_extended = "No Dynamic Groups found with matching rules for instance principals (instances, functions, or databases)."

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_non_root_compartment_exists.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_non_root_compartment_exists/identity_non_root_compartment_exists.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_non_root_compartment_exists",
  "CheckTitle": "Create at least one non-root compartment in your tenancy to store cloud resources",
  "CheckType": [],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:tenancy",
  "Severity": "high",
  "ResourceType": "OciTenancy",
  "Description": "Compartments are used to organize and isolate your cloud resources. Creating at least one compartment is a fundamental best practice for organizing resources in your tenancy. The root compartment should not be used directly for resource creation.",
  "Risk": "Without proper compartmentalization, resource management becomes difficult, access control is harder to implement, and it violates the principle of least privilege. Using only the root compartment makes it impossible to implement proper resource isolation and access controls.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci iam compartment create --compartment-id <tenancy_ocid> --name <compartment_name> --description '<description>'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-IAM/create-non-root-compartment.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create at least one compartment to organize your cloud resources. From OCI Console: 1. Navigate to Identity & Security -> Compartments. 2. Click 'Create Compartment'. 3. Enter a name and description. 4. Select the parent compartment (typically the root). 5. Click 'Create Compartment'.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: identity_non_root_compartment_exists.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_non_root_compartment_exists/identity_non_root_compartment_exists.py

```python
"""Check if at least one non-root compartment exists in the tenancy."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_non_root_compartment_exists(Check):
    """Check if at least one non-root compartment exists in the tenancy."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_non_root_compartment_exists check."""
        findings = []

        # Get active non-root compartments from search
        active_compartments = identity_client.active_non_root_compartments
        compartment_count = len(active_compartments)

        # Create a single finding for the tenancy
        report = Check_Report_OCI(
            metadata=self.metadata(),
            resource={},
            region=identity_client.provider.identity.region,
            resource_name="Tenancy Compartments",
            resource_id=identity_client.audited_tenancy,
            compartment_id=identity_client.audited_tenancy,
        )

        if compartment_count > 0:
            report.status = "PASS"
            report.status_extended = f"Tenancy has {compartment_count} active non-root compartment(s) created for organizing cloud resources."
        else:
            report.status = "FAIL"
            report.status_extended = "Tenancy has no active non-root compartments created. At least one non-root compartment should be created to organize cloud resources."

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_no_resources_in_root_compartment.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_no_resources_in_root_compartment/identity_no_resources_in_root_compartment.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_no_resources_in_root_compartment",
  "CheckTitle": "Ensure no resources are created in the root compartment",
  "CheckType": [],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:tenancy",
  "Severity": "high",
  "ResourceType": "OciTenancy",
  "Description": "The root compartment is the top-level compartment in your tenancy and should be used only for management purposes. All other cloud resources should be created in child compartments to maintain proper organization, access control, and resource isolation.",
  "Risk": "Creating resources in the root compartment bypasses the benefits of compartmentalization, makes access control management difficult, violates the principle of least privilege, and increases the risk of unauthorized access to resources. It also makes it harder to implement effective IAM policies and resource governance.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-IAM/check-for-root-compartment-resources.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Move all resources from the root compartment to appropriate child compartments. From OCI Console: 1. Identify resources in the root compartment. 2. Create or select appropriate child compartments. 3. Move resources to child compartments using the 'Move Resource' option available for most resource types. 4. Update any policies or automation that reference root compartment resources.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: identity_no_resources_in_root_compartment.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_no_resources_in_root_compartment/identity_no_resources_in_root_compartment.py

```python
"""Check if no resources are created in the root compartment."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_no_resources_in_root_compartment(Check):
    """Check if no resources are created in the root compartment."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_no_resources_in_root_compartment check."""
        findings = []

        # Get the root compartment ID (tenancy OCID)
        root_compartment_id = identity_client.audited_tenancy

        # Get resources found in root compartment via search
        resources_in_root = identity_client.root_compartment_resources
        resource_count = len(resources_in_root)

        # Create finding
        report = Check_Report_OCI(
            metadata=self.metadata(),
            resource={},
            region=identity_client.provider.identity.region,
            resource_name="Root Compartment Resources",
            resource_id=root_compartment_id,
            compartment_id=root_compartment_id,
        )

        if resource_count == 0:
            report.status = "PASS"
            report.status_extended = "No resources found in the root compartment."
        else:
            report.status = "FAIL"
            # Get resource type summary
            resource_types = {}
            for resource in resources_in_root:
                resource_type = resource.resource_type
                resource_types[resource_type] = resource_types.get(resource_type, 0) + 1

            resource_summary = ", ".join(
                [f"{count} {rtype}(s)" for rtype, count in resource_types.items()]
            )
            report.status_extended = f"Found {resource_count} resource(s) in root compartment: {resource_summary}."

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_password_policy_expires_within_365_days.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_password_policy_expires_within_365_days/identity_password_policy_expires_within_365_days.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_password_policy_expires_within_365_days",
  "CheckTitle": "Ensure IAM password policy expires passwords within 365 days",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "medium",
  "ResourceType": "OciIamUser",
  "Description": "Password policy should expire passwords within 365 days.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure IAM password policy expires passwords within 365 days",
      "Url": "https://hub.prowler.com/check/oci/identity_password_policy_expires_within_365_days"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: identity_password_policy_expires_within_365_days.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_password_policy_expires_within_365_days/identity_password_policy_expires_within_365_days.py

```python
"""Check Ensure IAM password policy expires passwords within 365 days."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_password_policy_expires_within_365_days(Check):
    """Check Ensure IAM password policy expires passwords within 365 days."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_password_policy_expires_within_365_days check.

        Note: Password expiration policies are only available in OCI Identity Domains.
        The legacy IAM password policy does not support password expiration settings.
        This check requires Identity Domains to be enabled in the tenancy.
        """
        findings = []

        # This check only applies to Identity Domains, not the legacy password policy

        # If no Identity Domains are found, the legacy password policy is in use
        if not identity_client.domains:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Password Expiration Policy",
                resource_id=identity_client.audited_tenancy,
                compartment_id=identity_client.audited_tenancy,
            )
            report.status = "MANUAL"
            report.status_extended = "Identity Domains not enabled. Password expiration policies are only available in OCI Identity Domains. Legacy password policy does not support password expiration."
            findings.append(report)
            return findings

        # Check each Identity Domain's password policies
        for domain in identity_client.domains:
            # Determine the region
            region = domain.region if hasattr(domain, "region") else "global"

            # Check each password policy in the domain
            for policy in domain.password_policies:
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource=policy,
                    region=region,
                    resource_name=f"Domain: {domain.display_name} - Policy: {policy.name}",
                    resource_id=policy.id,
                    compartment_id=domain.compartment_id,
                )

                # Check if password expiration is configured
                if policy.password_expires_after is None:
                    report.status = "FAIL"
                    report.status_extended = f"Password policy '{policy.name}' in domain '{domain.display_name}' does not have password expiration configured."
                elif policy.password_expires_after > 365:
                    report.status = "FAIL"
                    report.status_extended = f"Password policy '{policy.name}' in domain '{domain.display_name}' allows passwords to expire after {policy.password_expires_after} days, which exceeds the recommended 365 days."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Password policy '{policy.name}' in domain '{domain.display_name}' expires passwords within {policy.password_expires_after} days."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_password_policy_minimum_length_14.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_password_policy_minimum_length_14/identity_password_policy_minimum_length_14.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_password_policy_minimum_length_14",
  "CheckTitle": "Ensure IAM password policy requires minimum length of 14 or greater",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:tenancy",
  "Severity": "medium",
  "ResourceType": "OciIamPasswordPolicy",
  "Description": "Ensure IAM password policy requires minimum length of 14 or greater. Password policies are used to enforce password complexity requirements. IAM password policies can be used to ensure password are at least a certain length. It is recommended that the password policy require a minimum password length 14.",
  "Risk": "Setting a password complexity policy increases account resiliency against brute force login attempts.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcredentials.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci iam authentication-policy update --compartment-id <tenancy-ocid> --password-policy '{\"minimumPasswordLength\": 14}'",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-IAM/require-14-characters-password-policy.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Make sure IAM password policy requires a minimum password length of 14 or more characters.",
      "Url": "https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcredentials.htm"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: identity_password_policy_minimum_length_14.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_password_policy_minimum_length_14/identity_password_policy_minimum_length_14.py

```python
"""Check if IAM password policy requires minimum length of 14 or greater."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_password_policy_minimum_length_14(Check):
    """Check if IAM password policy requires minimum length of 14 or greater."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_password_policy_minimum_length_14 check.

        Returns:
            List of Check_Report_OCI objects with findings
        """
        findings = []

        # Prioritize Identity Domains password policies if available

        # Check Identity Domains first
        if identity_client.domains:
            for domain in identity_client.domains:
                region = domain.region if hasattr(domain, "region") else "global"

                if not domain.password_policies:
                    report = Check_Report_OCI(
                        metadata=self.metadata(),
                        resource={},
                        region=region,
                        resource_name=f"Domain: {domain.display_name}",
                        resource_id=domain.id,
                        compartment_id=domain.compartment_id,
                    )
                    report.status = "FAIL"
                    report.status_extended = f"Identity Domain '{domain.display_name}' has no password policy configured."
                    findings.append(report)
                else:
                    for policy in domain.password_policies:
                        report = Check_Report_OCI(
                            metadata=self.metadata(),
                            resource=policy,
                            region=region,
                            resource_name=f"Domain: {domain.display_name} - Policy: {policy.name}",
                            resource_id=policy.id,
                            compartment_id=domain.compartment_id,
                        )

                        # Check if minimum password length is 14 or greater
                        if policy.min_length and policy.min_length >= 14:
                            report.status = "PASS"
                            report.status_extended = f"Password policy '{policy.name}' in domain '{domain.display_name}' requires minimum length of {policy.min_length} characters."
                        else:
                            report.status = "FAIL"
                            min_len = (
                                policy.min_length if policy.min_length else "not set"
                            )
                            report.status_extended = f"Password policy '{policy.name}' in domain '{domain.display_name}' requires minimum length of {min_len} characters, which is less than 14."

                        findings.append(report)

        # Fallback to legacy password policy if no Identity Domains
        elif identity_client.password_policy:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=identity_client.password_policy,
                region=identity_client.provider.identity.region,
                resource_name="Password Policy (Legacy)",
                resource_id=identity_client.audited_tenancy,
                compartment_id=identity_client.audited_tenancy,
            )

            # Check if minimum password length is 14 or greater
            if identity_client.password_policy.minimum_password_length >= 14:
                report.status = "PASS"
                report.status_extended = f"Legacy IAM password policy requires minimum length of {identity_client.password_policy.minimum_password_length} characters."
            else:
                report.status = "FAIL"
                report.status_extended = f"Legacy IAM password policy requires minimum length of {identity_client.password_policy.minimum_password_length} characters, which is less than 14."

            findings.append(report)
        else:
            # No password policy found at all
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region=identity_client.provider.identity.region,
                resource_name="Password Policy",
                resource_id=identity_client.audited_tenancy,
                compartment_id=identity_client.audited_tenancy,
            )
            report.status = "FAIL"
            report.status_extended = "No password policy configured for the tenancy."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_password_policy_prevents_reuse.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_password_policy_prevents_reuse/identity_password_policy_prevents_reuse.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_password_policy_prevents_reuse",
  "CheckTitle": "Ensure IAM password policy prevents password reuse",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "medium",
  "ResourceType": "OciIamUser",
  "Description": "Password policy should prevent password reuse.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure IAM password policy prevents password reuse",
      "Url": "https://hub.prowler.com/check/oci/identity_password_policy_prevents_reuse"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: identity_password_policy_prevents_reuse.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_password_policy_prevents_reuse/identity_password_policy_prevents_reuse.py

```python
"""Check Ensure IAM password policy prevents password reuse."""

from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_password_policy_prevents_reuse(Check):
    """Check Ensure IAM password policy prevents password reuse."""

    def execute(self) -> Check_Report_OCI:
        """Execute the identity_password_policy_prevents_reuse check.

        Note: Password reuse prevention is only available in OCI Identity Domains.
        The legacy IAM password policy does not support password history.
        """
        findings = []

        # This check only applies to Identity Domains, not the legacy password policy

        # If no Identity Domains are found, the legacy password policy is in use
        if not identity_client.domains:
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region="global",
                resource_name="Password Reuse Policy",
                resource_id=identity_client.audited_tenancy,
                compartment_id=identity_client.audited_tenancy,
            )
            report.status = "MANUAL"
            report.status_extended = "Identity Domains not enabled. Password reuse prevention is only available in OCI Identity Domains. Legacy password policy does not support password history."
            findings.append(report)
            return findings

        # Check each Identity Domain's password policies
        for domain in identity_client.domains:
            region = domain.region if hasattr(domain, "region") else "global"

            if not domain.password_policies:
                report = Check_Report_OCI(
                    metadata=self.metadata(),
                    resource={},
                    region=region,
                    resource_name=f"Domain: {domain.display_name}",
                    resource_id=domain.id,
                    compartment_id=domain.compartment_id,
                )
                report.status = "FAIL"
                report.status_extended = f"Identity Domain '{domain.display_name}' has no password policy configured."
                findings.append(report)
            else:
                for policy in domain.password_policies:
                    report = Check_Report_OCI(
                        metadata=self.metadata(),
                        resource=policy,
                        region=region,
                        resource_name=f"Domain: {domain.display_name} - Policy: {policy.name}",
                        resource_id=policy.id,
                        compartment_id=domain.compartment_id,
                    )

                    # Check if password history is configured (CIS recommends 24 passwords)
                    if policy.num_passwords_in_history is None:
                        report.status = "FAIL"
                        report.status_extended = f"Password policy '{policy.name}' in domain '{domain.display_name}' does not have password history configured."
                    elif policy.num_passwords_in_history < 24:
                        report.status = "FAIL"
                        report.status_extended = f"Password policy '{policy.name}' in domain '{domain.display_name}' remembers {policy.num_passwords_in_history} passwords, which is less than the recommended 24."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"Password policy '{policy.name}' in domain '{domain.display_name}' prevents password reuse by remembering {policy.num_passwords_in_history} passwords."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_service_level_admins_exist.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_service_level_admins_exist/identity_service_level_admins_exist.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_service_level_admins_exist",
  "CheckTitle": "Ensure service level admins are created to manage resources of particular service",
  "CheckType": [],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "OciIdentityPolicy",
  "Description": "To apply least-privilege security principle, create service-level administrators in corresponding groups and assign specific users to each service-level administrative group in a tenancy. This limits administrative access to specific services.",
  "Risk": "Without service-level administrators, there is a risk of excessive permissions being granted, violating the principle of least privilege.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/policygetstarted.htm",
  "Remediation": {
    "Code": {
      "CLI": "oci iam policy create --compartment-id <compartment-ocid> --name <policy-name> --description '<policy-description>' --statements '[\"Allow group <GroupName> to manage <service>-family in compartment <CompartmentName>\"]'",
      "NativeIaC": "",
      "Other": "1. Navigate to Identity → Policies\n2. Click 'Create Policy'\n3. Create policies granting service-level admin permissions to specific groups in specific compartments\n4. Example: 'Allow group VolumeAdmins to manage volume-family in compartment Production'",
      "Terraform": "resource \"oci_identity_policy\" \"service_admin_policy\" {\n  compartment_id = var.compartment_id\n  name = \"ServiceLevelAdminPolicy\"\n  description = \"Service-level admin policy\"\n  statements = [\n    \"Allow group VolumeAdmins to manage volume-family in compartment Production\"\n  ]\n}"
    },
    "Recommendation": {
      "Text": "Create service-level administrators with limited permissions to specific services within compartments.",
      "Url": "https://docs.prowler.com/checks/oci/oci-iam-policies/identity_service_level_admins_exist"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: identity_service_level_admins_exist.py]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_service_level_admins_exist/identity_service_level_admins_exist.py

```python
from prowler.lib.check.models import Check, Check_Report_OCI
from prowler.providers.oraclecloud.services.identity.identity_client import (
    identity_client,
)


class identity_service_level_admins_exist(Check):
    """Ensure service level admins are created to manage resources of particular service (CIS 1.1)"""

    def execute(self):
        """Ensure service level admins are created to manage resources of particular service.

        This check ensures that policies don't grant overly broad permissions like "manage all-resources"
        without being restricted to specific services or compartments.
        """
        findings = []

        # Check for policies that violate least privilege by granting manage all-resources
        for policy in identity_client.policies:
            # Skip non-active policies
            if policy.lifecycle_state != "ACTIVE":
                continue

            # Skip default tenant admin policy
            if policy.name.upper() == "TENANT ADMIN POLICY":
                continue

            region = policy.region if hasattr(policy, "region") else "global"

            has_violation = False
            for statement in policy.statements:
                statement_upper = statement.upper()

                # Check for "allow group ... to manage all-resources" (not specific to service/compartment)
                if (
                    "ALLOW GROUP" in statement_upper
                    and "TO MANAGE ALL-RESOURCES" in statement_upper
                ):
                    has_violation = True
                    break

            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource=policy,
                region=region,
                resource_id=policy.id,
                resource_name=policy.name,
                compartment_id=policy.compartment_id,
            )

            if has_violation:
                report.status = "FAIL"
                report.status_extended = f"Policy '{policy.name}' grants 'manage all-resources' permissions. Service-level administrators should be created with permissions limited to specific services (e.g., manage instance-family, manage volume-family) in specific compartments."
            else:
                report.status = "PASS"
                report.status_extended = f"Policy '{policy.name}' follows least privilege principle by not granting broad 'manage all-resources' permissions."

            findings.append(report)

        # If no policies found, that's also a finding
        if not findings:
            region = (
                identity_client.audited_regions[0].key
                if identity_client.audited_regions
                else "global"
            )
            report = Check_Report_OCI(
                metadata=self.metadata(),
                resource={},
                region=region,
                resource_id=identity_client.audited_tenancy,
                resource_name="Tenancy",
                compartment_id=identity_client.audited_tenancy,
            )
            report.status = "PASS"
            report.status_extended = (
                "No active policies found with overly broad permissions."
            )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: identity_tenancy_admin_permissions_limited.metadata.json]---
Location: prowler-master/prowler/providers/oraclecloud/services/identity/identity_tenancy_admin_permissions_limited/identity_tenancy_admin_permissions_limited.metadata.json

```json
{
  "Provider": "oraclecloud",
  "CheckID": "identity_tenancy_admin_permissions_limited",
  "CheckTitle": "Ensure permissions on all resources are given only to the tenancy administrator group",
  "CheckType": [
    "Software and Configuration Checks",
    "Industry and Regulatory Standards",
    "CIS OCI Foundations Benchmark"
  ],
  "ServiceName": "identity",
  "SubServiceName": "",
  "ResourceIdTemplate": "oci:identity:user",
  "Severity": "high",
  "ResourceType": "OciIamUser",
  "Description": "Only the tenancy administrator group should have permissions to manage all resources in the tenancy.",
  "Risk": "Not meeting this IAM requirement increases security risk.",
  "RelatedUrl": "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/oci/OCI-IAM/tenancy-administrator-group-access.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure permissions on all resources are given only to the tenancy administrator group",
      "Url": "https://hub.prowler.com/check/oci/identity_tenancy_admin_permissions_limited"
    }
  },
  "Categories": [
    "identity-access"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
