---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 361
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 361 of 867)

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

---[FILE: dataproc_service.py]---
Location: prowler-master/prowler/providers/gcp/services/dataproc/dataproc_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService
from prowler.providers.gcp.services.compute.compute_client import compute_client


class Dataproc(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider)
        self.regions = compute_client.regions
        self.clusters = []
        self.__threading_call__(self._get_clusters, self.regions)

    def _get_clusters(self, region):
        for project_id in self.project_ids:
            try:
                request = (
                    self.client.projects()
                    .regions()
                    .clusters()
                    .list(projectId=project_id, region=region)
                )
                while request is not None:
                    response = request.execute(
                        http=self.__get_AuthorizedHttp_client__(),
                        num_retries=DEFAULT_RETRY_ATTEMPTS,
                    )

                    for cluster in response.get("clusters", []):
                        self.clusters.append(
                            Cluster(
                                name=cluster["clusterName"],
                                id=cluster["clusterUuid"],
                                encryption_config=cluster["config"]["encryptionConfig"],
                                project_id=project_id,
                            )
                        )

                    request = (
                        self.client.projects()
                        .regions()
                        .clusters()
                        .list_next(previous_request=request, previous_response=response)
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Cluster(BaseModel):
    name: str
    id: str
    encryption_config: dict
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: dataproc_encrypted_with_cmks_disabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/dataproc/dataproc_encrypted_with_cmks_disabled/dataproc_encrypted_with_cmks_disabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "dataproc_encrypted_with_cmks_disabled",
  "CheckTitle": "Ensure that Dataproc Cluster is encrypted using Customer-Managed Encryption Key",
  "CheckType": [],
  "ServiceName": "dataproc",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Cluster",
  "Description": "When you use Dataproc, cluster and job data is stored on Persistent Disks (PDs) associated with the Compute Engine VMs in your cluster and in a Cloud Storage staging bucket. This PD and bucket data is encrypted using a Google-generated data encryption key (DEK) and key encryption key (KEK). The CMEK feature allows you to create, use, and revoke the key encryption key (KEK). Google still controls the data encryption key (DEK).",
  "Risk": "The Dataproc cluster data is encrypted using a Google-generated Data Encryption Key (DEK) and a Key Encryption Key (KEK). If you need to control and manage your cluster data encryption yourself, you can use your own Customer-Managed Keys (CMKs). Cloud KMS Customer-Managed Keys can be implemented as an additional security layer on top of existing data encryption, and are often used in the enterprise world, where compliance and security controls are very strict.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/Dataproc/enable-encryption-with-cmks-for-dataproc-clusters.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-general-policies/ensure-gcp-dataproc-cluster-is-encrypted-with-customer-supplied-encryption-keys-cseks#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that your Google Cloud Dataproc clusters on Compute Engine are encrypted with Customer-Managed Keys (CMKs) in order to control the cluster data encryption/decryption process. You can create and manage your own Customer-Managed Keys (CMKs) with Cloud Key Management Service (Cloud KMS). Cloud KMS provides secure and efficient encryption key management, controlled key rotation, and revocation mechanisms.",
      "Url": "https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/customer-managed-encryption"
    }
  },
  "Categories": [
    "encryption",
    "gen-ai"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: dataproc_encrypted_with_cmks_disabled.py]---
Location: prowler-master/prowler/providers/gcp/services/dataproc/dataproc_encrypted_with_cmks_disabled/dataproc_encrypted_with_cmks_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.dataproc.dataproc_client import dataproc_client


class dataproc_encrypted_with_cmks_disabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for cluster in dataproc_client.clusters:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=cluster,
                location=dataproc_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"Dataproc cluster {cluster.name} is encrypted with customer managed encryption keys."
            if cluster.encryption_config.get("gcePdKmsKeyName") is None:
                report.status = "FAIL"
                report.status_extended = f"Dataproc cluster {cluster.name} is not encrypted with customer managed encryption keys."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dns_client.py]---
Location: prowler-master/prowler/providers/gcp/services/dns/dns_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.dns.dns_service import DNS

dns_client = DNS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: dns_service.py]---
Location: prowler-master/prowler/providers/gcp/services/dns/dns_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class DNS(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider)
        self.managed_zones = []
        self._get_managed_zones()
        self.policies = []
        self._get_policies()

    def _get_managed_zones(self):
        for project_id in self.project_ids:
            try:
                request = self.client.managedZones().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                    for managed_zone in response.get("managedZones"):
                        self.managed_zones.append(
                            ManagedZone(
                                name=managed_zone["name"],
                                id=managed_zone["id"],
                                dnssec=managed_zone.get("dnssecConfig", {}).get(
                                    "state", ""
                                )
                                == "on",
                                key_specs=managed_zone.get("dnssecConfig", {}).get(
                                    "defaultKeySpecs", []
                                ),
                                project_id=project_id,
                            )
                        )

                    request = self.client.managedZones().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_policies(self):
        for project_id in self.project_ids:
            try:
                request = self.client.policies().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for policy in response.get("policies", []):
                        policy_networks = []
                        for network in policy.get("networks", []):
                            policy_networks.append(network["networkUrl"].split("/")[-1])
                        self.policies.append(
                            Policy(
                                name=policy["name"],
                                id=policy["id"],
                                logging=policy.get("enableLogging", False),
                                networks=policy_networks,
                                project_id=project_id,
                            )
                        )

                    request = self.client.policies().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class ManagedZone(BaseModel):
    name: str
    id: str
    dnssec: bool
    key_specs: list
    project_id: str


class Policy(BaseModel):
    name: str
    id: str
    logging: bool
    networks: list
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: dns_dnssec_disabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/dns/dns_dnssec_disabled/dns_dnssec_disabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "dns_dnssec_disabled",
  "CheckTitle": "Ensure That DNSSEC Is Enabled for Cloud DNS",
  "CheckType": [],
  "ServiceName": "dns",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DNS_Zone",
  "Description": "Cloud Domain Name System (DNS) is a fast, reliable and cost-effective domain name system that powers millions of domains on the internet. Domain Name System Security Extensions (DNSSEC) in Cloud DNS enables domain owners to take easy steps to protect their domains against DNS hijacking and man-in-the-middle and other attacks.",
  "Risk": "Attackers can hijack the process of domain/IP lookup and redirect users to malicious web content through DNS hijacking and Man-In-The-Middle (MITM) attacks.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud dns managed-zones update <DNS_ZONE> --dnssec-state on",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudDNS/enable-dns-sec.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_5#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that DNSSEC security feature is enabled for all your Google Cloud DNS managed zones in order to protect your domains against spoofing and cache poisoning attacks. By default, DNSSEC is not enabled for Google Cloud public DNS managed zones. DNSSEC security feature helps mitigate the risk of such attacks by encrypting signing DNS records. As a result, it prevents attackers from issuing fake DNS responses that may misdirect web clients to fake, fraudulent or scam websites.",
      "Url": "https://cloud.google.com/dns/docs/dnssec-config"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: dns_dnssec_disabled.py]---
Location: prowler-master/prowler/providers/gcp/services/dns/dns_dnssec_disabled/dns_dnssec_disabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.dns.dns_client import dns_client


class dns_dnssec_disabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for managed_zone in dns_client.managed_zones:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=managed_zone,
                location=dns_client.region,
            )
            report.status = "PASS"
            report.status_extended = (
                f"Cloud DNS {managed_zone.name} has DNSSEC enabled."
            )
            if not managed_zone.dnssec:
                report.status = "FAIL"
                report.status_extended = (
                    f"Cloud DNS {managed_zone.name} doesn't have DNSSEC enabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dns_rsasha1_in_use_to_key_sign_in_dnssec.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/dns/dns_rsasha1_in_use_to_key_sign_in_dnssec/dns_rsasha1_in_use_to_key_sign_in_dnssec.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "dns_rsasha1_in_use_to_key_sign_in_dnssec",
  "CheckTitle": "Ensure That RSASHA1 Is Not Used for the Key-Signing Key in Cloud DNS DNSSEC",
  "CheckType": [],
  "ServiceName": "dns",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DNS_Zone",
  "Description": "NOTE: Currently, the SHA1 algorithm has been removed from general use by Google, and, if being used, needs to be whitelisted on a project basis by Google and will also, therefore, require a Google Cloud support contract. DNSSEC algorithm numbers in this registry may be used in CERT RRs. Zone signing (DNSSEC) and transaction security mechanisms (SIG(0) and TSIG) make use of particular subsets of these algorithms. The algorithm used for key signing should be a recommended one and it should be strong.",
  "Risk": "SHA1 is considered weak and vulnerable to collision attacks.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudDNS/dns-sec-key-signing-algorithm-in-use.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_6#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that Domain Name System Security Extensions (DNSSEC) feature is not using the deprecated RSASHA1 algorithm for the Key-Signing Key (KSK) associated with your DNS managed zone file. The algorithm used for DNSSEC signing should be a strong one, such as ECDSAP256SHA256 algorithm, as this is secure and widely deployed, and therefore it is a good choice for both DNSSEC validation and signing.",
      "Url": "https://cloud.google.com/dns/docs/dnssec-config"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: dns_rsasha1_in_use_to_key_sign_in_dnssec.py]---
Location: prowler-master/prowler/providers/gcp/services/dns/dns_rsasha1_in_use_to_key_sign_in_dnssec/dns_rsasha1_in_use_to_key_sign_in_dnssec.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.dns.dns_client import dns_client


class dns_rsasha1_in_use_to_key_sign_in_dnssec(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for managed_zone in dns_client.managed_zones:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=managed_zone,
                location=dns_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"Cloud DNS {managed_zone.name} is not using RSASHA1 algorithm as key signing."
            if any(
                [
                    key["algorithm"] == "rsasha1"
                    for key in managed_zone.key_specs
                    if key["keyType"] == "keySigning"
                ]
            ):
                report.status = "FAIL"
                report.status_extended = f"Cloud DNS {managed_zone.name} is using RSASHA1 algorithm as key signing."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: dns_rsasha1_in_use_to_zone_sign_in_dnssec.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/dns/dns_rsasha1_in_use_to_zone_sign_in_dnssec/dns_rsasha1_in_use_to_zone_sign_in_dnssec.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "dns_rsasha1_in_use_to_zone_sign_in_dnssec",
  "CheckTitle": "Ensure That RSASHA1 Is Not Used for the Zone-Signing Key in Cloud DNS DNSSEC",
  "CheckType": [],
  "ServiceName": "dns",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "DNS_Zone",
  "Description": "NOTE: Currently, the SHA1 algorithm has been removed from general use by Google, and, if being used, needs to be whitelisted on a project basis by Google and will also, therefore, require a Google Cloud support contract. DNSSEC algorithm numbers in this registry may be used in CERT RRs. Zone signing (DNSSEC) and transaction security mechanisms (SIG(0) and TSIG) make use of particular subsets of these algorithms. The algorithm used for key signing should be a recommended one and it should be strong.",
  "Risk": "SHA1 is considered weak and vulnerable to collision attacks.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudDNS/dns-sec-zone-signing-algorithm-in-use.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/bc_gcp_networking_6#terraform"
    },
    "Recommendation": {
      "Text": "Ensure that Domain Name System Security Extensions (DNSSEC) feature is not using the deprecated RSASHA1 algorithm for the Zone-Signing Key (ZSK) associated with your public DNS managed zone. The algorithm used for DNSSEC signing should be a strong one, such as RSASHA256, as this algorithm is secure and widely deployed, and therefore it is a good candidate for both DNSSEC validation and signing.",
      "Url": "https://cloud.google.com/dns/docs/dnssec-config"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: dns_rsasha1_in_use_to_zone_sign_in_dnssec.py]---
Location: prowler-master/prowler/providers/gcp/services/dns/dns_rsasha1_in_use_to_zone_sign_in_dnssec/dns_rsasha1_in_use_to_zone_sign_in_dnssec.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.dns.dns_client import dns_client


class dns_rsasha1_in_use_to_zone_sign_in_dnssec(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for managed_zone in dns_client.managed_zones:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=managed_zone,
                location=dns_client.region,
            )
            report.status = "PASS"
            report.status_extended = f"Cloud DNS {managed_zone.name} is not using RSASHA1 algorithm as zone signing."
            if any(
                [
                    key["algorithm"] == "rsasha1"
                    for key in managed_zone.key_specs
                    if key["keyType"] == "zoneSigning"
                ]
            ):
                report.status = "FAIL"
                report.status_extended = f"Cloud DNS {managed_zone.name} is using RSASHA1 algorithm as zone signing."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: gcr_container_scanning_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/gcr/gcr_container_scanning_enabled/gcr_container_scanning_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "gcr_container_scanning_enabled",
  "CheckTitle": "Ensure Image Vulnerability Scanning using GCR Container Scanning or a third-party provider",
  "CheckType": [
    "Security",
    "Configuration"
  ],
  "ServiceName": "gcr",
  "SubServiceName": "Container Scanning",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Service",
  "Description": "Scan images stored in Google Container Registry (GCR) for vulnerabilities using GCR Container Scanning or a third-party provider. This helps identify and mitigate security risks associated with known vulnerabilities in container images.",
  "Risk": "Without image vulnerability scanning, container images stored in GCR may contain known vulnerabilities, increasing the risk of exploitation by malicious actors.",
  "RelatedUrl": "https://cloud.google.com/container-registry/docs/container-analysis",
  "Remediation": {
    "Code": {
      "CLI": "gcloud services enable containerscanning.googleapis.com",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-networking-policies/ensure-gcp-gcr-container-vulnerability-scanning-is-enabled#terraform"
    },
    "Recommendation": {
      "Text": "Enable vulnerability scanning for images stored in GCR using GCR Container Scanning or a third-party provider.",
      "Url": "https://cloud.google.com/container-registry/docs/container-best-practices"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, GCR Container Scanning is disabled."
}
```

--------------------------------------------------------------------------------

---[FILE: gcr_container_scanning_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/gcr/gcr_container_scanning_enabled/gcr_container_scanning_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.serviceusage.serviceusage_client import (
    serviceusage_client,
)


class gcr_container_scanning_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for project_id in serviceusage_client.project_ids:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=serviceusage_client.projects[project_id],
                resource_id="containerscanning.googleapis.com",
                resource_name="GCR Container Scanning",
                project_id=project_id,
                location=serviceusage_client.region,
            )
            report.status = "FAIL"
            report.status_extended = (
                f"GCR Container Scanning is not enabled in project {project_id}."
            )
            for active_service in serviceusage_client.active_services.get(
                project_id, []
            ):
                if active_service.name == "containerscanning.googleapis.com":
                    report.status = "PASS"
                    report.status_extended = (
                        f"GCR Container Scanning is enabled in project {project_id}."
                    )
                    break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: gke_client.py]---
Location: prowler-master/prowler/providers/gcp/services/gke/gke_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.gke.gke_service import GKE

gke_client = GKE(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: gke_service.py]---
Location: prowler-master/prowler/providers/gcp/services/gke/gke_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class GKE(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__("container", provider, api_version="v1beta1")
        self.locations = []
        self._get_locations()
        self.clusters = {}
        self.__threading_call__(self._get_clusters, self.locations)

    def _get_locations(self):
        for project_id in self.project_ids:
            try:
                request = (
                    self.client.projects()
                    .locations()
                    .list(parent="projects/" + project_id)
                )
                response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                for location in response["locations"]:
                    self.locations.append(
                        Location(name=location["name"], project_id=project_id)
                    )

            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_clusters(self, location):
        try:
            request = (
                self.client.projects()
                .locations()
                .clusters()
                .list(
                    parent=f"projects/{location.project_id}/locations/{location.name}"
                )
            )
            response = request.execute(
                http=self.__get_AuthorizedHttp_client__(),
                num_retries=DEFAULT_RETRY_ATTEMPTS,
            )
            for cluster in response.get("clusters", []):
                node_pools = []
                for node_pool in cluster["nodePools"]:
                    node_pools.append(
                        NodePool(
                            name=node_pool["name"],
                            locations=node_pool["locations"],
                            service_account=node_pool["config"]["serviceAccount"],
                            project_id=location.project_id,
                        )
                    )
                self.clusters[cluster["id"]] = Cluster(
                    name=cluster["name"],
                    id=cluster["id"],
                    location=cluster["location"],
                    region=cluster["location"].rsplit("-", 1)[0],
                    service_account=cluster["nodeConfig"]["serviceAccount"],
                    node_pools=node_pools,
                    project_id=location.project_id,
                )
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Location(BaseModel):
    name: str
    project_id: str


class NodePool(BaseModel):
    name: str
    locations: list
    service_account: str
    project_id: str


class Cluster(BaseModel):
    name: str
    id: str
    region: str
    location: str
    service_account: str
    node_pools: list[NodePool]
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: gke_cluster_no_default_service_account.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/gke/gke_cluster_no_default_service_account/gke_cluster_no_default_service_account.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "gke_cluster_no_default_service_account",
  "CheckTitle": "Ensure GKE clusters are not running using the Compute Engine default service account",
  "CheckType": [
    "Security",
    "Configuration"
  ],
  "ServiceName": "gke",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Service",
  "Description": "Ensure GKE clusters are not running using the Compute Engine default service account. Create and use minimally privileged service accounts for GKE cluster nodes instead of using the Compute Engine default service account to minimize unnecessary permissions.",
  "Risk": "Using the Compute Engine default service account for GKE cluster nodes may grant excessive permissions, increasing the risk of unauthorized access or compromise if a node is compromised.",
  "RelatedUrl": "https://cloud.google.com/compute/docs/access/service-accounts#default_service_account",
  "Remediation": {
    "Code": {
      "CLI": "gcloud container node-pools create [NODE_POOL] --service-account=[SA_NAME]@[PROJECT_ID].iam.gserviceaccount.com --cluster=[CLUSTER_NAME] --zone [COMPUTE_ZONE]",
      "NativeIaC": "",
      "Other": "",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-kubernetes-policies/ensure-gke-clusters-are-not-running-using-the-compute-engine-default-service-account#terraform"
    },
    "Recommendation": {
      "Text": "Create and use minimally privileged service accounts for GKE cluster nodes instead of using the Compute Engine default service account.",
      "Url": "https://cloud.google.com/compute/docs/access/service-accounts#default_service_account"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "By default, nodes use the Compute Engine default service account when you create a new cluster."
}
```

--------------------------------------------------------------------------------

---[FILE: gke_cluster_no_default_service_account.py]---
Location: prowler-master/prowler/providers/gcp/services/gke/gke_cluster_no_default_service_account/gke_cluster_no_default_service_account.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.gke.gke_client import gke_client


class gke_cluster_no_default_service_account(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for cluster in gke_client.clusters.values():
            report = Check_Report_GCP(metadata=self.metadata(), resource=cluster)
            report.status = "PASS"
            report.status_extended = f"GKE cluster {cluster.name} is not using the Compute Engine default service account."
            if not cluster.node_pools and cluster.service_account == "default":
                report.status = "FAIL"
                report.status_extended = f"GKE cluster {cluster.name} is using the Compute Engine default service account."
            for node_pool in cluster.node_pools:
                if node_pool.service_account == "default":
                    report.status = "FAIL"
                    report.status_extended = f"GKE cluster {cluster.name} is using the Compute Engine default service account."
                break
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: accessapproval_client.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/accessapproval_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.iam.iam_service import AccessApproval

accessapproval_client = AccessApproval(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: essentialcontacts_client.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/essentialcontacts_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.iam.iam_service import EssentialContacts

essentialcontacts_client = EssentialContacts(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: iam_client.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.iam.iam_service import IAM

iam_client = IAM(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: iam_service.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_service.py
Signals: Pydantic

```python
from datetime import datetime

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)


class IAM(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider)
        self.service_accounts = []
        self._get_service_accounts()
        self._get_service_accounts_keys()

    def _get_service_accounts(self):
        for project_id in self.project_ids:
            try:
                request = (
                    self.client.projects()
                    .serviceAccounts()
                    .list(name="projects/" + project_id)
                )
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for account in response.get("accounts", []):
                        self.service_accounts.append(
                            ServiceAccount(
                                name=account["name"],
                                email=account["email"],
                                display_name=account.get("displayName", ""),
                                project_id=project_id,
                                uniqueId=account.get("uniqueId", ""),
                            )
                        )

                    request = (
                        self.client.projects()
                        .serviceAccounts()
                        .list_next(previous_request=request, previous_response=response)
                    )
            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_service_accounts_keys(self):
        try:
            for sa in self.service_accounts:
                request = (
                    self.client.projects()
                    .serviceAccounts()
                    .keys()
                    .list(
                        name="projects/"
                        + sa.project_id
                        + "/serviceAccounts/"
                        + sa.email
                    )
                )
                response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                for key in response.get("keys", []):
                    sa.keys.append(
                        Key(
                            name=key["name"].split("/")[-1],
                            origin=key["keyOrigin"],
                            type=key["keyType"],
                            valid_after=datetime.strptime(
                                key["validAfterTime"], "%Y-%m-%dT%H:%M:%SZ"
                            ),
                            valid_before=datetime.strptime(
                                key["validBeforeTime"], "%Y-%m-%dT%H:%M:%SZ"
                            ),
                        )
                    )

        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class Key(BaseModel):
    name: str
    origin: str
    type: str
    valid_after: datetime
    valid_before: datetime


class ServiceAccount(BaseModel):
    name: str
    email: str
    display_name: str
    keys: list[Key] = []
    project_id: str
    uniqueId: str


class AccessApproval(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider)
        self.settings = {}
        self._get_settings()

    def _get_settings(self):
        for project_id in self.project_ids:
            try:
                response = (
                    self.client.projects().getAccessApprovalSettings(
                        name=f"projects/{project_id}/accessApprovalSettings"
                    )
                ).execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                self.settings[project_id] = Setting(
                    name=response["name"],
                    project_id=project_id,
                )

            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Setting(BaseModel):
    name: str
    project_id: str


class EssentialContacts(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider)
        self.organizations = []
        self._get_contacts()

    def _get_contacts(self):
        for org in cloudresourcemanager_client.organizations:
            try:
                contacts = False
                response = (
                    self.client.organizations()
                    .contacts()
                    .list(parent="organizations/" + org.id)
                ).execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                if len(response.get("contacts", [])) > 0:
                    contacts = True

                self.organizations.append(
                    Organization(
                        name=org.name,
                        id=org.id,
                        contacts=contacts,
                    )
                )
            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Organization(BaseModel):
    name: str
    id: str
    contacts: bool
```

--------------------------------------------------------------------------------

````
