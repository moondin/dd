---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 359
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 359 of 867)

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

---[FILE: compute_firewall_rdp_access_from_the_internet_allowed.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_firewall_rdp_access_from_the_internet_allowed/compute_firewall_rdp_access_from_the_internet_allowed.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_firewall_rdp_access_from_the_internet_allowed",
  "CheckTitle": "Ensure That RDP Access Is Restricted From the Internet",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "FirewallRule",
  "Description": "GCP `Firewall Rules` are specific to a `VPC Network`. Each rule either `allows` or `denies` traffic when its conditions are met. Its conditions allow users to specify the type of traffic, such as ports and protocols, and the source or destination of the traffic, including IP addresses, subnets, and instances. Firewall rules are defined at the VPC network level and are specific to the network in which they are defined. The rules themselves cannot be shared among networks. Firewall rules only support IPv4 traffic. When specifying a source for an ingress rule or a destination for an egress rule by address, an `IPv4` address or `IPv4 block in CIDR` notation can be used. Generic `(0.0.0.0/0)` incoming traffic from the Internet to a VPC or VM instance using `RDP` on `Port 3389` can be avoided.",
  "Risk": "Allowing unrestricted Remote Desktop Protocol (RDP) access can increase opportunities for malicious activities such as hacking, Man-In-The-Middle attacks (MITM) and Pass-The-Hash (PTH) attacks.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute firewall-rules delete default-allow-rdp",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/unrestricted-rdp-access.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_2#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that Google Cloud Virtual Private Cloud (VPC) firewall rules do not allow unrestricted access (i.e. 0.0.0.0/0) on TCP port 3389 in order to restrict Remote Desktop Protocol (RDP) traffic to trusted IP addresses or IP ranges only and reduce the attack surface. TCP port 3389 is used for secure remote GUI login to Windows VM instances by connecting a RDP client application with an RDP server.",
      "Url": "https://cloud.google.com/vpc/docs/using-firewalls"
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

---[FILE: compute_firewall_rdp_access_from_the_internet_allowed.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_firewall_rdp_access_from_the_internet_allowed/compute_firewall_rdp_access_from_the_internet_allowed.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_firewall_rdp_access_from_the_internet_allowed(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for firewall in compute_client.firewalls:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=firewall,
                location=compute_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"Firewall {firewall.name} does not expose port 3389 (RDP) to the internet."
            opened_port = False
            for rule in firewall.allowed_rules:
                if rule["IPProtocol"] == "all":
                    opened_port = True
                    break
                elif rule["IPProtocol"] == "tcp":
                    if rule.get("ports") is None:
                        opened_port = True
                        break
                    else:
                        for port in rule["ports"]:
                            if port.find("-") != -1:
                                lower, higher = port.split("-")
                                if int(lower) <= 3389 and int(higher) >= 3389:
                                    opened_port = True
                                    break
                            elif int(port) == 3389:
                                opened_port = True
                            break
            if (
                "0.0.0.0/0" in firewall.source_ranges
                and firewall.direction == "INGRESS"
                and opened_port
            ):
                report.status = "FAIL"
                report.status_extended = f"Firewall {firewall.name} does exposes port 3389 (RDP) to the internet."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_firewall_ssh_access_from_the_internet_allowed.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_firewall_ssh_access_from_the_internet_allowed/compute_firewall_ssh_access_from_the_internet_allowed.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_firewall_ssh_access_from_the_internet_allowed",
  "CheckTitle": "Ensure That SSH Access Is Restricted From the Internet",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "FirewallRule",
  "Description": "GCP `Firewall Rules` are specific to a `VPC Network`. Each rule either `allows` or `denies` traffic when its conditions are met. Its conditions allow the user to specify the type of traffic, such as ports and protocols, and the source or destination of the traffic, including IP addresses, subnets, and instances. Firewall rules are defined at the VPC network level and are specific to the network in which they are defined. The rules themselves cannot be shared among networks. Firewall rules only support IPv4 traffic. When specifying a source for an ingress rule or a destination for an egress rule by address, only an `IPv4` address or `IPv4 block in CIDR` notation can be used. Generic `(0.0.0.0/0)` incoming traffic from the internet to VPC or VM instance using `SSH` on `Port 22` can be avoided.",
  "Risk": "Exposing Secure Shell (SSH) port 22 to the Internet can increase opportunities for malicious activities such as hacking, Man-In-The-Middle attacks (MITM) and brute-force attacks.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute firewall-rules delete default-allow-ssh",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/unrestricted-ssh-access.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_1#terraform"
    },
    "Recommendation": {
      "Text": "Check your Google Cloud Virtual Private Cloud (VPC) firewall rules for inbound rules that allow unrestricted access (i.e. 0.0.0.0/0) on TCP port 22 and restrict the access to trusted IP addresses or IP ranges only in order to implement the principle of least privilege and reduce the attack surface. TCP port 22 is used for secure remote login by connecting an SSH client application with an SSH server. It is strongly recommended to configure your Google Cloud VPC firewall rules to limit inbound traffic on TCP port 22 to known IP addresses only.",
      "Url": "https://cloud.google.com/vpc/docs/using-firewalls"
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

---[FILE: compute_firewall_ssh_access_from_the_internet_allowed.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_firewall_ssh_access_from_the_internet_allowed/compute_firewall_ssh_access_from_the_internet_allowed.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_firewall_ssh_access_from_the_internet_allowed(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for firewall in compute_client.firewalls:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=firewall,
                location=compute_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"Firewall {firewall.name} does not expose port 22 (SSH) to the internet."
            opened_port = False
            for rule in firewall.allowed_rules:
                if rule["IPProtocol"] == "all":
                    opened_port = True
                    break
                elif rule["IPProtocol"] == "tcp":
                    if rule.get("ports") is None:
                        opened_port = True
                        break
                    else:
                        for port in rule["ports"]:
                            if port.find("-") != -1:
                                lower, higher = port.split("-")
                                if int(lower) <= 22 and int(higher) >= 22:
                                    opened_port = True
                                    break
                            elif int(port) == 22:
                                opened_port = True
                            break
            if (
                "0.0.0.0/0" in firewall.source_ranges
                and firewall.direction == "INGRESS"
                and opened_port
            ):
                report.status = "FAIL"
                report.status_extended = f"Firewall {firewall.name} does exposes port 22 (SSH) to the internet."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_automatic_restart_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_automatic_restart_enabled/compute_instance_automatic_restart_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_automatic_restart_enabled",
  "CheckTitle": "Compute Engine VM instances have Automatic Restart enabled",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "compute.googleapis.com/Instance",
  "Description": "**Google Compute Engine virtual machine instances** are evaluated to ensure that **Automatic Restart** is enabled. This feature allows the Google Cloud Compute Engine service to automatically restart VM instances when they are terminated due to non-user-initiated reasons such as maintenance events, hardware failures, or software failures.",
  "Risk": "VM instances without Automatic Restart enabled will not recover automatically from host maintenance events or unexpected failures, potentially leading to prolonged service downtime and requiring manual intervention to restore services.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/enable-automatic-restart.html",
    "https://cloud.google.com/compute/docs/instances/setting-instance-scheduling-options"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute instances update <INSTANCE_NAME> --restart-on-failure --zone=<ZONE>",
      "NativeIaC": "",
      "Other": "1) Open Google Cloud Console → Compute Engine → VM instances\n2) Click on the instance name to view details\n3) Click 'Edit' at the top of the page\n4) Under 'Availability policies', set 'Automatic restart' to 'On (recommended)'\n5) Click 'Save' at the bottom of the page",
      "Terraform": "```hcl\n# Example: enable Automatic Restart for a Compute Engine VM instance\nresource \"google_compute_instance\" \"example\" {\n  name         = var.instance_name\n  machine_type = var.machine_type\n  zone         = var.zone\n\n  scheduling {\n    automatic_restart   = true\n    on_host_maintenance = \"MIGRATE\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable the Automatic Restart feature for Compute Engine VM instances to enhance system reliability by automatically recovering from crashes or system-initiated terminations. This setting does not interfere with user-initiated shutdowns or stops.",
      "Url": "https://hub.prowler.com/check/compute_instance_automatic_restart_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "VM instances missing the 'scheduling.automaticRestart' field are treated as having Automatic Restart enabled (defaults to true). Preemptible instances and instances with provisioning model set to SPOT are automatically marked as PASS, as they cannot have Automatic Restart enabled by design."
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_automatic_restart_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_automatic_restart_enabled/compute_instance_automatic_restart_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_automatic_restart_enabled(Check):
    """
    Ensure Compute Engine VM instances have Automatic Restart enabled.

    Reports PASS if a VM instance has automatic restart enabled, otherwise FAIL.
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)

            # Preemptible and Spot VMs cannot have automatic restart enabled
            if instance.preemptible or instance.provisioning_model == "SPOT":
                report.status = "FAIL"
                report.status_extended = (
                    f"VM Instance {instance.name} is a Preemptible or Spot instance, "
                    "which cannot have Automatic Restart enabled by design."
                )
            elif instance.automatic_restart:
                report.status = "PASS"
                report.status_extended = (
                    f"VM Instance {instance.name} has Automatic Restart enabled."
                )
            else:
                report.status = "FAIL"
                report.status_extended = f"VM Instance {instance.name} does not have Automatic Restart enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_block_project_wide_ssh_keys_disabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_block_project_wide_ssh_keys_disabled/compute_instance_block_project_wide_ssh_keys_disabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_block_project_wide_ssh_keys_disabled",
  "CheckTitle": "Ensure “Block Project-Wide SSH Keys” Is Enabled for VM Instances",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VMInstance",
  "Description": "It is recommended to use Instance specific SSH key(s) instead of using common/shared project-wide SSH key(s) to access Instances.",
  "Risk": "Project-wide SSH keys are stored in Compute/Project-meta-data. Project wide SSH keys can be used to login into all the instances within project. Using project-wide SSH keys eases the SSH key management but if compromised, poses the security risk which can impact all the instances within project.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute instances add-metadata <INSTANCE_NAME> --metadata block-projectssh-keys=TRUE",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/enable-block-project-wide-ssh-keys.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_8#terraform"
    },
    "Recommendation": {
      "Text": "It is recommended to use Instance specific SSH keys which can limit the attack surface if the SSH keys are compromised.",
      "Url": "https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_block_project_wide_ssh_keys_disabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_block_project_wide_ssh_keys_disabled/compute_instance_block_project_wide_ssh_keys_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_block_project_wide_ssh_keys_disabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "FAIL"
            report.status_extended = f"The VM Instance {instance.name} is making use of common/shared project-wide SSH key(s)."
            if instance.metadata.get("items"):
                for item in instance.metadata["items"]:
                    if (
                        item["key"] == "block-project-ssh-keys"
                        and item["value"].lower() == "true"
                    ):
                        report.status = "PASS"
                        report.status_extended = f"The VM Instance {instance.name} is not making use of common/shared project-wide SSH key(s)."
                        break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_confidential_computing_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_confidential_computing_enabled/compute_instance_confidential_computing_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_confidential_computing_enabled",
  "CheckTitle": "Ensure Compute Instances Have Confidential Computing Enabled",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VMInstance",
  "Description": "Ensure that the Confidential Computing security feature is enabled for your Google Cloud virtual machine (VM) instances in order to add protection to your sensitive data in use by keeping it encrypted in memory and using encryption keys that Google doesn't have access to. Confidential Computing is a breakthrough technology which encrypts data while it is being processed. This technology keeps data encrypted in memory, outside the CPU.",
  "Risk": "Confidential Computing keeps your sensitive data encrypted while it is used, indexed, queried, or trained on, and does not allow Google to access the encryption keys (these keys are generated in hardware, per VM instance, and can't be exported). In this way, the Confidential Computing feature can help alleviate concerns about risk related to either dependency on Google Cloud infrastructure or Google insiders' access to your data in the clear.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/confidential-computing.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the Confidential Computing security feature is enabled for your Google Cloud virtual machine (VM) instances in order to add protection to your sensitive data in use by keeping it encrypted in memory and using encryption keys that Google doesn't have access to. Confidential Computing is a breakthrough technology which encrypts data while it is being processed. This technology keeps data encrypted in memory, outside the CPU.",
      "Url": "https://cloud.google.com/compute/confidential-vm/docs/creating-cvm-instance:https://cloud.google.com/compute/confidential-vm/docs/about-cvm:https://cloud.google.com/confidential-computing:https://cloud.google.com/blog/products/identity-security/introducing-google-cloud-confidential-computing-with-confidential-vms"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_confidential_computing_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_confidential_computing_enabled/compute_instance_confidential_computing_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_confidential_computing_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"VM Instance {instance.name} has Confidential Computing enabled."
            )
            if not instance.confidential_computing:
                report.status = "FAIL"
                report.status_extended = f"VM Instance {instance.name} does not have Confidential Computing enabled."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_default_service_account_in_use.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_default_service_account_in_use/compute_instance_default_service_account_in_use.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_default_service_account_in_use",
  "CheckTitle": "Ensure That Instances Are Not Configured To Use the Default Service Account",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VMInstance",
  "Description": "It is recommended to configure your instance to not use the default Compute Engine service account because it has the Editor role on the project.",
  "Risk": "The default Compute Engine service account has the Editor role on the project, which allows read and write access to most Google Cloud Services. This can lead to a privilege escalations if your VM is compromised allowing an attacker gaining access to all of your project",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/default-service-accounts-in-use.html",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute instances set-service-account <INSTANCE_NAME> --service-account=<SERVICE_ACCOUNT_EMAIL>",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/google-cloud-iam-policies/bc_gcp_iam_1",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-iam-policies/bc_gcp_iam_1#terraform"
    },
    "Recommendation": {
      "Text": "To defend against privilege escalations if your VM is compromised and prevent an attacker from gaining access to all of your project, it is recommended to not use the default Compute Engine service account. Instead, you should create a new service account and assigning only the permissions needed by your instance. The default Compute Engine service account is named `[PROJECT_NUMBER]-compute@developer.gserviceaccount.com`.",
      "Url": "https://cloud.google.com/iam/docs/granting-changing-revoking-access"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_default_service_account_in_use.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_default_service_account_in_use/compute_instance_default_service_account_in_use.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_default_service_account_in_use(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"The default service account is not configured to be used with VM Instance {instance.name}."
            if (
                any(
                    [
                        ("-compute@developer.gserviceaccount.com" in sa["email"])
                        for sa in instance.service_accounts
                    ]
                )
                and instance.name[:4] != "gke-"
            ):
                report.status = "FAIL"
                report.status_extended = f"The default service account is configured to be used with VM Instance {instance.name}."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_default_service_account_in_use_with_full_api_access.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_default_service_account_in_use_with_full_api_access/compute_instance_default_service_account_in_use_with_full_api_access.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_default_service_account_in_use_with_full_api_access(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"The VM Instance {instance.name} is not configured to use the default service account with full access to all cloud APIs."
            for service_account in instance.service_accounts:
                if (
                    "-compute@developer.gserviceaccount.com" in service_account["email"]
                    and "https://www.googleapis.com/auth/cloud-platform"
                    in service_account["scopes"]
                    and instance.name[:4] != "gke-"
                ):
                    report.status = "FAIL"
                    report.status_extended = f"The VM Instance {instance.name} is configured to use the default service account with full access to all cloud APIs."
                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_deletion_protection_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_deletion_protection_enabled/compute_instance_deletion_protection_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_deletion_protection_enabled",
  "CheckTitle": "VM instance has deletion protection enabled",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "compute.googleapis.com/Instance",
  "Description": "This check verifies whether GCP Compute Engine VM instances have **deletion protection** enabled to prevent accidental termination of production or critical workloads.",
  "Risk": "Without deletion protection enabled, VM instances are vulnerable to **accidental deletion** by users with sufficient permissions.\n\nThis could result in:\n- **Service disruption** and downtime for critical applications\n- **Data loss** if persistent disks are also deleted\n- **Recovery delays** while recreating instances and restoring configurations",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://cloud.google.com/compute/docs/instances/preventing-accidental-vm-deletion",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/enable-deletion-protection.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute instances update INSTANCE_NAME --deletion-protection --zone=ZONE",
      "NativeIaC": "",
      "Other": "1. Open the Google Cloud Console\n2. Navigate to Compute Engine > VM instances\n3. Select the target VM instance\n4. Click Edit\n5. Under Deletion protection, check the box to enable\n6. Click Save",
      "Terraform": "```hcl\nresource \"google_compute_instance\" \"example_resource\" {\n  name         = \"example-instance\"\n  machine_type = \"e2-medium\"\n  zone         = \"us-central1-a\"\n\n  # Enable deletion protection\n  deletion_protection = true\n\n  boot_disk {\n    initialize_params {\n      image = \"debian-cloud/debian-11\"\n    }\n  }\n\n  network_interface {\n    network = \"default\"\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable deletion protection on all production and business-critical VM instances to prevent accidental termination. Regularly review instances to ensure critical workloads are protected.",
      "Url": "https://hub.prowler.com/check/compute_instance_deletion_protection_enabled"
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

---[FILE: compute_instance_deletion_protection_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_deletion_protection_enabled/compute_instance_deletion_protection_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_deletion_protection_enabled(Check):
    """
    Ensure that VM instance has deletion protection enabled.

    This check verifies whether GCP Compute Engine VM instances have deletion protection
    enabled to prevent accidental termination of production or critical workloads.

    - PASS: VM instance has deletion protection enabled.
    - FAIL: VM instance does not have deletion protection enabled.
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"VM Instance {instance.name} has deletion protection enabled."
            )
            if not instance.deletion_protection:
                report.status = "FAIL"
                report.status_extended = f"VM Instance {instance.name} does not have deletion protection enabled."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_encryption_with_csek_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_encryption_with_csek_enabled/compute_instance_encryption_with_csek_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_encryption_with_csek_enabled",
  "CheckTitle": "Ensure VM Disks for Critical VMs Are Encrypted With Customer-Supplied Encryption Keys (CSEK)",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Disks",
  "Description": "Customer-Supplied Encryption Keys (CSEK) are a feature in Google Cloud Storage and Google Compute Engine. If you supply your own encryption keys, Google uses your key to protect the Google-generated keys used to encrypt and decrypt your data. By default, Google Compute Engine encrypts all data at rest. Compute Engine handles and manages this encryption for you without any additional actions on your part. However, if you wanted to control and manage this encryption yourself, you can provide your own encryption keys.",
  "Risk": "By default, Compute Engine service encrypts all data at rest. The cloud service manages this type of encryption without any additional actions from you and your application. However, if you want to fully control and manage instance disk encryption, you can provide your own encryption keys.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute disks create <DISK_NAME> --size=<SIZE> --type=<TYPE> --zone=<ZONE> --source-snapshot=<SOURCE_SNAPSHOT> --csek-key-file=<KEY_FILE>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/enable-encryption-with-csek.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-general-policies/bc_gcp_general_x#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that the disks attached to your production Google Compute Engine instances are encrypted with Customer-Supplied Encryption Keys (CSEKs) in order to have complete control over the data-at-rest encryption and decryption process, and meet strict compliance requirements. These custom keys, also known as Customer-Supplied Encryption Keys (CSEKs), are used by Google Compute Engine to protect the Google-generated keys used to encrypt and decrypt your instance data. Compute Engine service does not store your CSEKs on its servers and cannot access your protected data unless you provide the required key.",
      "Url": "https://cloud.google.com/storage/docs/encryption/using-customer-supplied-keys"
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

---[FILE: compute_instance_encryption_with_csek_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_encryption_with_csek_enabled/compute_instance_encryption_with_csek_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_encryption_with_csek_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "FAIL"
            report.status_extended = f"The VM Instance {instance.name} has the following unencrypted disks: '{', '.join([i[0] for i in instance.disks_encryption if not i[1]])}'."
            if all([i[1] for i in instance.disks_encryption]):
                report.status = "PASS"
                report.status_extended = (
                    f"The VM Instance {instance.name} has every disk encrypted."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_ip_forwarding_is_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_ip_forwarding_is_enabled/compute_instance_ip_forwarding_is_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_ip_forwarding_is_enabled",
  "CheckTitle": "Ensure That IP Forwarding Is Not Enabled on Instances",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VMInstance",
  "Description": "Compute Engine instance cannot forward a packet unless the source IP address of the packet matches the IP address of the instance. Similarly, GCP won't deliver a packet whose destination IP address is different than the IP address of the instance receiving the packet. However, both capabilities are required if you want to use instances to help route packets. Forwarding of data packets should be disabled to prevent data loss or information disclosure.",
  "Risk": "When the IP Forwarding feature is enabled on a virtual machine's network interface (NIC), it allows the VM to act as a router and receive traffic addressed to other destinations. ",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/disable-ip-forwarding.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_12",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_12#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that IP Forwarding feature is not enabled at the Google Compute Engine instance level for security and compliance reasons, as instances with IP Forwarding enabled act as routers/packet forwarders. Because IP forwarding is rarely required, except when the virtual machine (VM) is used as a network virtual appliance, each Google Cloud VM instance should be reviewed in order to decide whether the IP forwarding is really needed for the verified instance. IP Forwarding is enabled at the VM instance level and applies to all network interfaces (NICs) attached to the instance. In addition, Instances created by GKE should be excluded from this recommendation because they need to have IP forwarding enabled and cannot be changed. Instances created by GKE have names that start with \"gke- \".",
      "Url": "https://cloud.google.com/compute/docs/instances/create-start-instance"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_ip_forwarding_is_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_ip_forwarding_is_enabled/compute_instance_ip_forwarding_is_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_ip_forwarding_is_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"The IP Forwarding of VM Instance {instance.name} is not enabled."
            )
            if instance.ip_forward and instance.name[:4] != "gke-":
                report.status = "FAIL"
                report.status_extended = (
                    f"The IP Forwarding of VM Instance {instance.name} is enabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
