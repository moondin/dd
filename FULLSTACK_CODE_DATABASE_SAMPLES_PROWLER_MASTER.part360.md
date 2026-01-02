---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 360
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 360 of 867)

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

---[FILE: compute_instance_preemptible_vm_disabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_preemptible_vm_disabled/compute_instance_preemptible_vm_disabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_preemptible_vm_disabled",
  "CheckTitle": "VM instance is not configured as preemptible or Spot VM",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "compute.googleapis.com/Instance",
  "Description": "This check verifies that VM instances are not configured as **preemptible** or **Spot VMs**.\n\nBoth preemptible and Spot VMs can be terminated by Google at any time when resources are needed elsewhere, making them unsuitable for production and business-critical workloads. Spot VMs are the newer version of preemptible VMs and are Google's recommended approach for interruptible workloads.",
  "Risk": "Preemptible and Spot VMs may be **terminated at any time** by Google Cloud, causing:\n\n- **Service disruptions** for production workloads\n- **Data loss** if workloads are not fault-tolerant\n- **Availability issues** for business-critical applications\n\nThey are designed for batch jobs and fault-tolerant workloads only.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://cloud.google.com/compute/docs/instances/preemptible",
    "https://cloud.google.com/compute/docs/instances/spot",
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/disable-preemptibility.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Go to Compute Engine console\n2. Select the preemptible or Spot VM instance\n3. Create a machine image from the instance\n4. Create a new instance from the machine image\n5. During creation, set **VM provisioning model** to **Standard** (not Spot)\n6. Delete the original preemptible or Spot VM instance",
      "Terraform": "```hcl\nresource \"google_compute_instance\" \"example_resource\" {\n  name         = \"example-instance\"\n  machine_type = \"e2-medium\"\n  zone         = \"us-central1-a\"\n\n  scheduling {\n    # Use standard provisioning model for production workloads (not Spot)\n    provisioning_model = \"STANDARD\"\n    # Also ensure preemptible is false (legacy field)\n    preemptible = false\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Use standard provisioning model for production and business-critical VM instances. Preemptible and Spot VMs should only be used for fault-tolerant, batch processing, or non-critical workloads that can handle interruptions.",
      "Url": "https://hub.prowler.com/checks/compute_instance_preemptible_vm_disabled"
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

---[FILE: compute_instance_preemptible_vm_disabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_preemptible_vm_disabled/compute_instance_preemptible_vm_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_preemptible_vm_disabled(Check):
    """
    Ensure GCP Compute Engine VM instances are not preemptible or Spot VMs.

    - PASS: VM instance is not preemptible (preemptible=False) and not Spot
      (provisioningModel != "SPOT").
    - FAIL: VM instance is preemptible (preemptible=True) or Spot
      (provisioningModel="SPOT").
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"VM Instance {instance.name} is not preemptible or Spot VM."
            )

            if instance.preemptible or instance.provisioning_model == "SPOT":
                report.status = "FAIL"
                vm_type = "preemptible" if instance.preemptible else "Spot VM"
                report.status_extended = (
                    f"VM Instance {instance.name} is configured as {vm_type}."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_public_ip.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_public_ip/compute_instance_public_ip.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_public_ip",
  "CheckTitle": "Check for Virtual Machine Instances with Public IP Addresses",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "VMInstance",
  "Description": "Check for Virtual Machine Instances with Public IP Addresses",
  "Risk": "To reduce your attack surface, Compute instances should not have public IP addresses. Instead, instances should be configured behind load balancers, to minimize the instance's exposure to the internet.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/google-cloud-public-policies/bc_gcp_public_2",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-public-policies/bc_gcp_public_2#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that your Google Compute Engine instances are not configured to have external IP addresses in order to minimize their exposure to the Internet.",
      "Url": "https://cloud.google.com/compute/docs/instances/connecting-to-instance"
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

---[FILE: compute_instance_public_ip.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_public_ip/compute_instance_public_ip.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_public_ip(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = (
                f"VM Instance {instance.name} does not have a public IP."
            )
            if instance.public_ip:
                report.status = "FAIL"
                report.status_extended = f"VM Instance {instance.name} has a public IP."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_serial_ports_in_use.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_serial_ports_in_use/compute_instance_serial_ports_in_use.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_serial_ports_in_use",
  "CheckTitle": "Ensure ‘Enable Connecting to Serial Ports’ Is Not Enabled for VM Instance",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VMInstance",
  "Description": "Interacting with a serial port is often referred to as the serial console, which is similar to using a terminal window, in that input and output is entirely in text mode and there is no graphical interface or mouse support. If you enable the interactive serial console on an instance, clients can attempt to connect to that instance from any IP address. Therefore interactive serial console support should be disabled.",
  "Risk": "If you enable the interactive serial console on your VM instance, clients can attempt to connect to your instance from any IP address and this allows anybody to access the instance if they know the user name, the SSH key, the project ID, and the instance name and zone.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute instances add-metadata <INSTANCE_NAME> --zone=<ZONE> --metadata=serial-port-enable=false",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/disable-interactive-serial-console-support.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_11#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that \"Enable connecting to serial ports\" configuration setting is disabled for all your production Google Compute Engine instances. A Google Cloud virtual machine (VM) instance has 4 virtual serial ports. On your VM instances, the operating system (OS), BIOS, and other system-level entities write often output data to the serial ports and can accept input, such as commands or answers, to prompts. Usually, these system-level entities use the first serial port (Port 1) and Serial Port 1 is often referred to as the interactive serial console. This interactive serial console does not support IP-based access restrictions such as IP address whitelists. To adhere to cloud security best practices and reduce the risk of unauthorized access, interactive serial console support should be disabled for all instances used in production.",
      "Url": "https://cloud.google.com/compute"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_serial_ports_in_use.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_serial_ports_in_use/compute_instance_serial_ports_in_use.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_serial_ports_in_use(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"VM Instance {instance.name} has Enable Connecting to Serial Ports off."
            if instance.metadata.get("items"):
                for item in instance.metadata["items"]:
                    if item["key"] == "serial-port-enable" and item["value"] in [
                        "1",
                        "true",
                    ]:
                        report.status = "FAIL"
                        report.status_extended = f"VM Instance {instance.name} has Enable Connecting to Serial Ports set to on."
                        break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_shielded_vm_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_shielded_vm_enabled/compute_instance_shielded_vm_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_instance_shielded_vm_enabled",
  "CheckTitle": "Ensure Compute Instances Are Launched With Shielded VM Enabled",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "VMInstance",
  "Description": "To defend against advanced threats and ensure that the boot loader and firmware on your VMs are signed and untampered, it is recommended that Compute instances are launched with Shielded VM enabled.",
  "Risk": "Whithout shielded VM enabled is not possible to defend against advanced threats and ensure that the boot loader and firmware on your Google Compute Engine instances are signed and untampered.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute instances update <INSTANCE_NAME> --shielded-vtpm --shielded-vmintegrity-monitoring",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/enable-shielded-vm.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-general-policies/bc_gcp_general_y#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that your Google Compute Engine instances are configured to use Shielded VM security feature for protection against rootkits and bootkits.Google Compute Engine service can enable 3 advanced security components for Shielded VM instances: 1. Virtual Trusted Platform Module (vTPM) - this component validates the guest virtual machine (VM) pre-boot and boot integrity, and provides key generation and protection. 2. Integrity Monitoring - lets you monitor and verify the runtime boot integrity of your shielded VM instances using Google Cloud Operations reports (also known as Stackdriver reports). 3. Secure boot helps - this security component protects your VM instances against boot-level and kernel-level malware and rootkits. To defend against advanced threats and ensure that the boot loader and firmware on your Google Compute Engine instances are signed and untampered, it is strongly recommended that your production instances are launched with Shielded VM enabled.",
      "Url": "https://cloud.google.com/compute/docs/instances/modifying-shielded-vm"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_instance_shielded_vm_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_instance_shielded_vm_enabled/compute_instance_shielded_vm_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_instance_shielded_vm_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for instance in compute_client.instances:
            report = Check_Report_GCP(metadata=self.metadata(), resource=instance)
            report.status = "PASS"
            report.status_extended = f"VM Instance {instance.name} has vTPM or Integrity Monitoring set to on."
            if (
                not instance.shielded_enabled_vtpm
                or not instance.shielded_enabled_integrity_monitoring
            ):
                report.status = "FAIL"
                report.status_extended = f"VM Instance {instance.name} doesn't have vTPM and Integrity Monitoring set to on."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_loadbalancer_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_loadbalancer_logging_enabled/compute_loadbalancer_logging_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_loadbalancer_logging_enabled",
  "CheckTitle": "Ensure Logging is enabled for HTTP(S) Load Balancer",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "LoadBalancer",
  "Description": "Logging enabled on a HTTPS Load Balancer will show all network traffic and its destination.",
  "Risk": "HTTP(S) load balancing log entries contain information useful for monitoring and debugging web traffic. Google Cloud exports this logging data to Cloud Monitoring service so that monitoring metrics can be created to evaluate a load balancer's configuration, usage, and performance, troubleshoot problems, and improve resource utilization and user experience.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute backend-services update <serviceName> --region=REGION --enable-logging --logging-sample-rate=<percentageAsADecimal>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudLoadBalancing/enableLoad-balancing-backend-service-logging.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Logging will allow you to view HTTPS network traffic to your web applications.",
      "Url": "https://cloud.google.com/load-balancing/docs/https/https-logging-monitoring#gcloud:-global-mode"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_loadbalancer_logging_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_loadbalancer_logging_enabled/compute_loadbalancer_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_loadbalancer_logging_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for lb in compute_client.load_balancers:
            # Only load balancers with backend service can have logging enabled
            if lb.service:
                report = Check_Report_GCP(
                    metadata=self.metadata(),
                    resource=lb,
                    location=compute_client.region,
                )
                report.status = "PASS"
                report.status_extended = f"LoadBalancer {lb.name} has logging enabled."
                if not lb.logging:
                    report.status = "FAIL"
                    report.status_extended = (
                        f"LoadBalancer {lb.name} does not have logging enabled."
                    )
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_network_default_in_use.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_network_default_in_use/compute_network_default_in_use.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_network_default_in_use",
  "CheckTitle": "Ensure that the default network does not exist",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Network",
  "Description": "Ensure that the default network does not exist",
  "Risk": "The default network has a preconfigured network configuration and automatically generates insecure firewall rules.",
  "RelatedUrl": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/default-vpc-in-use.html",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_7",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_7#terraform"
    },
    "Recommendation": {
      "Text": "When an organization deletes the default network, it may need to migrate or service onto a new network.",
      "Url": "https://cloud.google.com/vpc/docs/using-vpc"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_network_default_in_use.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_network_default_in_use/compute_network_default_in_use.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_network_default_in_use(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        projects_with_default_network = {}

        # Identify projects with the default network
        for network in compute_client.networks:
            if network.name == "default":
                projects_with_default_network[network.project_id] = network

        # Generate reports for all projects
        for project in compute_client.project_ids:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=compute_client.projects[project],
                project_id=project,
                resource_id="default",
                resource_name="default",
                location=compute_client.region,
            )
            if project in projects_with_default_network:
                report.status = "FAIL"
                report.status_extended = (
                    f"Default network is in use in project {project}."
                )
                report.resource = projects_with_default_network[project]
            else:
                report.status = "PASS"
                report.status_extended = (
                    f"Default network does not exist in project {project}."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_network_dns_logging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_network_dns_logging_enabled/compute_network_dns_logging_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_network_dns_logging_enabled",
  "CheckTitle": "Enable Cloud DNS Logging for VPC Networks",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Network",
  "Description": "Ensure that Cloud DNS logging is enabled for all your Virtual Private Cloud (VPC) networks using DNS server policies. Cloud DNS logging records queries that the name servers resolve for your Google Cloud VPC networks, as well as queries from external entities directly to a public DNS zone. Recorded queries can come from virtual machine (VM) instances, GKE containers running in the same VPC network, peering zones, or other Google Cloud resources provisioned within your VPC.",
  "Risk": "Cloud DNS logging is disabled by default on each Google Cloud VPC network. By enabling monitoring of Cloud DNS logs, you can increase visibility into the DNS names requested by the clients within your VPC network. Cloud DNS logs can be monitored for anomalous domain names and evaluated against threat intelligence.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/dns-logging-for-vpcs.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Cloud DNS logging records the queries from the name servers within your VPC to Stackdriver. Logged queries can come from Compute Engine VMs, GKE containers, or other GCP resources provisioned within the VPC.",
      "Url": "https://cloud.google.com/dns/docs/monitoring"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_network_dns_logging_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_network_dns_logging_enabled/compute_network_dns_logging_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client
from prowler.providers.gcp.services.dns.dns_client import dns_client


class compute_network_dns_logging_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for network in compute_client.networks:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=network,
                location=compute_client.region,
            )
            report.status = "FAIL"
            report.status_extended = (
                f"Network {network.name} does not have DNS logging enabled."
            )
            for policy in dns_client.policies:
                if network.name in policy.networks and policy.logging:
                    report.status = "PASS"
                    report.status_extended = (
                        f"Network {network.name} has DNS logging enabled."
                    )
                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_network_not_legacy.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_network_not_legacy/compute_network_not_legacy.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_network_not_legacy",
  "CheckTitle": "Ensure Legacy Networks Do Not Exist",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Network",
  "Description": "In order to prevent use of legacy networks, a project should not have a legacy network configured. As of now, Legacy Networks are gradually being phased out, and you can no longer create projects with them. This recommendation is to check older projects to ensure that they are not using Legacy Networks.",
  "Risk": "Google Cloud legacy networks have a single global IPv4 range which cannot be divided into subnets, and a single gateway IP address for the whole network. Legacy networks do not support several Google Cloud networking features such as subnets, alias IP ranges, multiple network interfaces, Cloud NAT (Network Address Translation), Virtual Private Cloud (VPC) Peering, and private access options for GCP services. Legacy networks are not recommended for high network traffic projects and are subject to a single point of contention or failure.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute networks delete <LEGACY_NETWORK_NAME>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/legacy-vpc-in-use.html#",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/ensure-legacy-networks-do-not-exist-for-a-project#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that your Google Cloud Platform (GCP) projects are not using legacy networks as this type of network is no longer recommended for production environments because it does not support advanced networking features. Instead, it is strongly recommended to use Virtual Private Cloud (VPC) networks for existing and future GCP projects.",
      "Url": "https://cloud.google.com/vpc/docs/using-legacy#deleting_a_legacy_network"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_network_not_legacy.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_network_not_legacy/compute_network_not_legacy.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_network_not_legacy(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for network in compute_client.networks:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=network,
                location=compute_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"Network {network.name} is not legacy."
            if network.subnet_mode == "legacy":
                report.status = "FAIL"
                report.status_extended = f"Legacy network {network.name} exists."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_project_os_login_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_project_os_login_enabled/compute_project_os_login_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_project_os_login_enabled",
  "CheckTitle": "Ensure Os Login Is Enabled for a Project",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "GCPProject",
  "Description": "Ensure that the OS Login feature is enabled at the Google Cloud Platform (GCP) project level in order to provide you with centralized and automated SSH key pair management.",
  "Risk": "Enabling OS Login feature ensures that the SSH keys used to connect to VM instances are mapped with Google Cloud IAM users. Revoking access to corresponding IAM users will revoke all the SSH keys associated with these users, therefore it facilitates centralized SSH key pair management, which is extremely useful in handling compromised or stolen SSH key pairs and/or revocation of external/third-party/vendor users.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute project-info add-metadata --metadata enable-oslogin=TRUE",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/ComputeEngine/enable-os-login.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_9#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that the OS Login feature is enabled at the Google Cloud Platform (GCP) project level in order to provide you with centralized and automated SSH key pair management.",
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

---[FILE: compute_project_os_login_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_project_os_login_enabled/compute_project_os_login_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_project_os_login_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project in compute_client.compute_projects:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=compute_client.projects[project.id],
                project_id=project.id,
                location=compute_client.region,
                resource_name=(
                    compute_client.projects[project.id].name
                    if compute_client.projects[project.id].name
                    else "GCP Project"
                ),
            )
            report.status = "PASS"
            report.status_extended = f"Project {project.id} has OS Login enabled."
            if not project.enable_oslogin:
                report.status = "FAIL"
                report.status_extended = (
                    f"Project {project.id} does not have OS Login enabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_public_address_shodan.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_public_address_shodan/compute_public_address_shodan.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_public_address_shodan",
  "CheckTitle": "Check if any of the Public Addresses are in Shodan (requires Shodan API KEY).",
  "CheckType": [
    "Infrastructure Security"
  ],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "GCPComputeAddress",
  "Description": "Check if any of the Public Addresses are in Shodan (requires Shodan API KEY).",
  "Risk": "Sites like Shodan index exposed systems and further expose them to wider audiences as a quick way to find exploitable systems.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Check Identified IPs, consider changing them to private ones and delete them from Shodan.",
      "Url": "https://www.shodan.io/"
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

---[FILE: compute_public_address_shodan.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_public_address_shodan/compute_public_address_shodan.py

```python
import shodan

from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.lib.logger import logger
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_public_address_shodan(Check):
    def execute(self):
        findings = []
        shodan_api_key = compute_client.audit_config.get("shodan_api_key")
        if shodan_api_key:
            api = shodan.Shodan(shodan_api_key)
            for address in compute_client.addresses:
                if address.type == "EXTERNAL":
                    report = Check_Report_GCP(
                        metadata=self.metadata(), resource=address
                    )
                    try:
                        shodan_info = api.host(address.ip)
                        report.status = "FAIL"
                        report.status_extended = f"Public Address {address.ip} listed in Shodan with open ports {str(shodan_info['ports'])} and ISP {shodan_info['isp']} in {shodan_info['country_name']}. More info at https://www.shodan.io/host/{address.ip}."
                        findings.append(report)
                    except shodan.APIError as error:
                        if "No information available for that IP" in error.value:
                            report.status = "PASS"
                            report.status_extended = (
                                f"Public Address {address.ip} is not listed in Shodan."
                            )
                            findings.append(report)
                            continue
                        else:
                            logger.error(f"Unknown Shodan API Error: {error.value}")

        else:
            logger.error(
                "No Shodan API Key -- Please input a Shodan API Key with -N/--shodan or in config.yaml"
            )
        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_subnet_flow_logs_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_subnet_flow_logs_enabled/compute_subnet_flow_logs_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "compute_subnet_flow_logs_enabled",
  "CheckTitle": "Enable VPC Flow Logs for VPC Subnets",
  "CheckType": [],
  "ServiceName": "compute",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Subnet",
  "Description": "Ensure that VPC Flow Logs is enabled for every subnet created within your production Virtual Private Cloud (VPC) network. Flow Logs is a logging feature that enables users to capture information about the IP traffic (accepted, rejected, or all traffic) going to and from the network interfaces (ENIs) available within your VPC subnets.",
  "Risk": "By default, the VPC Flow Logs feature is disabled when a new VPC network subnet is created. Once enabled, VPC Flow Logs will start collecting network traffic data to and from your Virtual Private Cloud (VPC) subnets, logging data that can be useful for understanding network usage, network traffic expense optimization, network forensics, and real-time security analysis. To enhance Google Cloud VPC network visibility and security it is strongly recommended to enable Flow Logs for every business-critical or production VPC subnet.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud compute networks subnets update [SUBNET_NAME] --region [REGION] --enable-flow-logs",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudVPC/enable-vpc-flow-logs.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/logging-policies-1/bc_gcp_logging_1#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that VPC Flow Logs is enabled for every subnet created within your production Virtual Private Cloud (VPC) network. Flow Logs is a logging feature that enables users to capture information about the IP traffic (accepted, rejected, or all traffic) going to and from the network interfaces (ENIs) available within your VPC subnets.",
      "Url": "https://cloud.google.com/vpc/docs/using-flow-logs#enabling_vpc_flow_logging"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: compute_subnet_flow_logs_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_subnet_flow_logs_enabled/compute_subnet_flow_logs_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.compute.compute_client import compute_client


class compute_subnet_flow_logs_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for subnet in compute_client.subnets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=subnet)
            report.status = "PASS"
            report.status_extended = f"Subnet {subnet.name} in network {subnet.network} has flow logs enabled."
            if not subnet.flow_logs:
                report.status = "FAIL"
                report.status_extended = f"Subnet {subnet.name} in network {subnet.network} does not have flow logs enabled."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dataproc_client.py]---
Location: prowler-master/prowler/providers/gcp/services/dataproc/dataproc_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.dataproc.dataproc_service import Dataproc

dataproc_client = Dataproc(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
