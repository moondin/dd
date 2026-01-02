---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 358
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 358 of 867)

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

---[FILE: cloudstorage_bucket_soft_delete_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_soft_delete_enabled/cloudstorage_bucket_soft_delete_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_bucket_soft_delete_enabled",
  "CheckTitle": "Cloud Storage buckets have Soft Delete enabled",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "storage.googleapis.com/Bucket",
  "Description": "**Google Cloud Storage buckets** are evaluated to ensure that **Soft Delete** is enabled. Soft Delete helps protect data from accidental or malicious deletion by retaining deleted objects for a specified duration, allowing recovery within that retention window.",
  "Risk": "Buckets without Soft Delete enabled are at higher risk of irreversible data loss caused by accidental or unauthorized deletions, since deleted objects cannot be recovered once removed.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://cloud.google.com/storage/docs/soft-delete",
    "https://cloud.google.com/blog/products/storage-data-transfer/understanding-cloud-storages-new-soft-delete-feature"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gcloud storage buckets update gs://<BUCKET_NAME> --soft-delete-retention-duration=<SECONDS>",
      "NativeIaC": "",
      "Other": "1) Open Google Cloud Console → Storage → Buckets → <BUCKET_NAME>\n2) Tab 'Configuration'\n3) Under 'Soft Delete', click 'Enable Soft Delete'\n4) Set the desired retention duration and save changes",
      "Terraform": "```hcl\n# Example: enable Soft Delete on a Cloud Storage bucket\nresource \"google_storage_bucket\" \"example\" {\n  name     = var.bucket_name\n  location = var.location\n\n  soft_delete_policy {\n    retention_duration_seconds = 604800  # 7 days\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable Soft Delete on Cloud Storage buckets to retain deleted objects for a defined period, improving data recoverability and resilience against accidental or malicious deletions.",
      "Url": "https://hub.prowler.com/check/cloudstorage_bucket_soft_delete_enabled"
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

---[FILE: cloudstorage_bucket_soft_delete_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_soft_delete_enabled/cloudstorage_bucket_soft_delete_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)


class cloudstorage_bucket_soft_delete_enabled(Check):
    """
    Ensure Cloud Storage buckets have Soft Delete enabled.

    Reports PASS if a bucket has Soft Delete enabled (retentionDurationSeconds > 0),
    otherwise FAIL.
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []
        for bucket in cloudstorage_client.buckets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=bucket)
            report.status = "FAIL"
            report.status_extended = (
                f"Bucket {bucket.name} does not have Soft Delete enabled."
            )

            if bucket.soft_delete_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"Bucket {bucket.name} has Soft Delete enabled."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_sufficient_retention_period.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_sufficient_retention_period/cloudstorage_bucket_sufficient_retention_period.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_bucket_sufficient_retention_period",
  "CheckTitle": "Cloud Storage bucket has a sufficient Retention Policy period",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "storage.googleapis.com/Bucket",
  "Description": "Cloud Storage bucket has a bucket-level Retention Policy with a retentionPeriod that meets or exceeds the organization-defined minimum, preventing deletion or modification of objects before the required time.",
  "Risk": "Insufficient or missing retention allows premature deletion or modification of objects, weakening data recovery and compliance with retention requirements.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/sufficient-retention-period.html"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gcloud storage buckets update gs://<BUCKET_NAME> --retention-period=<SECONDS>",
      "NativeIaC": "",
      "Other": "1) Console → Storage → Buckets → <BUCKET_NAME>\n2) Tab 'Configuration' → 'Retention policy'\n3) Set the required retention period (e.g., 90 or 365 days) and save\n4) (Optional) Lock the policy if required by compliance",
      "Terraform": "```hcl\nresource \"google_storage_bucket\" \"example\" {\n  name     = var.bucket_name\n  location = var.location\n\n  retention_policy {\n    retention_period = 7776000 # 90 days in seconds\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Define and apply a bucket-level Retention Policy that meets your minimum retention requirement (e.g., 90 or 365 days) to enforce data recoverability and compliance.",
      "Url": "https://hub.prowler.com/check/cloudstorage_bucket_sufficient_retention_period"
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

---[FILE: cloudstorage_bucket_sufficient_retention_period.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_sufficient_retention_period/cloudstorage_bucket_sufficient_retention_period.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)


class cloudstorage_bucket_sufficient_retention_period(Check):
    """
    Ensure there is a sufficient bucket-level retention period configured for GCS buckets.

    PASS: retentionPolicy.retentionPeriod >= min threshold (days)
    FAIL: no retention policy or period < threshold
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []

        min_retention_days = int(
            getattr(cloudstorage_client, "audit_config", {}).get(
                "storage_min_retention_days", 90
            )
        )

        for bucket in cloudstorage_client.buckets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=bucket)

            retention_policy = bucket.retention_policy

            if retention_policy is None:
                report.status = "FAIL"
                report.status_extended = (
                    f"Bucket {bucket.name} does not have a retention policy "
                    f"(minimum required: {min_retention_days} days)."
                )
                findings.append(report)
                continue

            days = retention_policy.retention_period // 86400  # seconds to days

            if days >= min_retention_days:
                report.status = "PASS"
                report.status_extended = (
                    f"Bucket {bucket.name} has a sufficient retention policy of {days} days "
                    f"(minimum required: {min_retention_days})."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    f"Bucket {bucket.name} has an insufficient retention policy of {days} days "
                    f"(minimum required: {min_retention_days})."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_uniform_bucket_level_access.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_uniform_bucket_level_access/cloudstorage_bucket_uniform_bucket_level_access.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_bucket_uniform_bucket_level_access",
  "CheckTitle": "Ensure That Cloud Storage Buckets Have Uniform Bucket-Level Access Enabled",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Bucket",
  "Description": "Ensure That Cloud Storage Buckets Have Uniform Bucket-Level Access Enabled",
  "Risk": "Enabling uniform bucket-level access guarantees that if a Storage bucket is not publicly accessible, no object in the bucket is publicly accessible either.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gsutil uniformbucketlevelaccess set on gs://BUCKET_NAME/",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/enable-uniform-bucket-level-access.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-storage-gcs-policies/bc_gcp_gcs_2#terraform"
    },
    "Recommendation": {
      "Text": "It is recommended that uniform bucket-level access is enabled on Cloud Storage buckets.",
      "Url": "https://cloud.google.com/storage/docs/using-uniform-bucket-level-access"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_uniform_bucket_level_access.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_uniform_bucket_level_access/cloudstorage_bucket_uniform_bucket_level_access.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)


class cloudstorage_bucket_uniform_bucket_level_access(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for bucket in cloudstorage_client.buckets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=bucket)
            report.status = "PASS"
            report.status_extended = (
                f"Bucket {bucket.name} has uniform Bucket Level Access enabled."
            )
            if not bucket.uniform_bucket_level_access:
                report.status = "FAIL"
                report.status_extended = (
                    f"Bucket {bucket.name} has uniform Bucket Level Access disabled."
                )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_versioning_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_versioning_enabled/cloudstorage_bucket_versioning_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_bucket_versioning_enabled",
  "CheckTitle": "Cloud Storage buckets have Object Versioning enabled",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "storage.googleapis.com/Bucket",
  "Description": "**Google Cloud Storage buckets** are evaluated to ensure that **Object Versioning** is enabled. Object Versioning preserves older versions of objects, allowing data recovery, maintaining audit trails, and protecting against accidental deletions or overwrites.",
  "Risk": "Buckets without Object Versioning enabled cannot recover previous object versions, which increases the risk of permanent data loss from accidental deletion or modification.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/enable-versioning.html",
    "https://cloud.google.com/storage/docs/object-versioning"
  ],
  "Remediation": {
    "Code": {
      "CLI": "gcloud storage buckets update gs://<BUCKET_NAME> --versioning",
      "NativeIaC": "",
      "Other": "1) Open Google Cloud Console → Storage → Buckets → <BUCKET_NAME>\n2) Tab 'Configuration'\n3) Under 'Object versioning', click 'Enable Object Versioning'\n4) Save changes",
      "Terraform": "```hcl\n# Example: enable Object Versioning on a Cloud Storage bucket\nresource \"google_storage_bucket\" \"example\" {\n  name     = var.bucket_name\n  location = var.location\n\n  versioning {\n    enabled = true\n  }\n}\n```"
    },
    "Recommendation": {
      "Text": "Enable Object Versioning on Cloud Storage buckets to preserve previous object versions and improve data recoverability and auditability.",
      "Url": "https://hub.prowler.com/check/cloudstorage_bucket_versioning_enabled"
    }
  },
  "Categories": [
    "resilience"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Buckets missing the 'versioning' block are treated as having Object Versioning disabled."
}
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_bucket_versioning_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_bucket_versioning_enabled/cloudstorage_bucket_versioning_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)


class cloudstorage_bucket_versioning_enabled(Check):
    """
    Ensure Cloud Storage buckets have Object Versioning enabled.

    Reports PASS if a bucket has versioning enabled, otherwise FAIL.
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []
        for bucket in cloudstorage_client.buckets:
            report = Check_Report_GCP(metadata=self.metadata(), resource=bucket)
            report.status = "FAIL"
            report.status_extended = (
                f"Bucket {bucket.name} does not have Object Versioning enabled."
            )

            if bucket.versioning_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"Bucket {bucket.name} has Object Versioning enabled."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: cloudstorage_uses_vpc_service_controls.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_uses_vpc_service_controls/cloudstorage_uses_vpc_service_controls.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "cloudstorage_uses_vpc_service_controls",
  "CheckTitle": "Cloud Storage services are protected by VPC Service Controls",
  "CheckType": [],
  "ServiceName": "cloudstorage",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "cloudresourcemanager.googleapis.com/Project",
  "Description": "**GCP Projects** are evaluated to ensure they have **VPC Service Controls** enabled for Cloud Storage. VPC Service Controls establish security boundaries by restricting access to Cloud Storage resources to specific networks and trusted clients, preventing unauthorized data access and exfiltration.",
  "Risk": "Projects without VPC Service Controls protection for Cloud Storage may be vulnerable to unauthorized data access and exfiltration, even with proper IAM policies in place. VPC Service Controls provide an additional layer of network-level security that restricts API access based on the context of the request.",
  "RelatedUrl": "",
  "AdditionalURLs": [
    "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudStorage/use-vpc-service-controls.html",
    "https://cloud.google.com/vpc-service-controls/docs/create-service-perimeters"
  ],
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1) Open Google Cloud Console → Security → VPC Service Controls\n2) Create a new service perimeter or select an existing one\n3) Add the relevant GCP projects to the perimeter's protected resources\n4) Add 'storage.googleapis.com' to the list of restricted services\n5) Configure appropriate ingress and egress rules\n6) Save the perimeter configuration",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable VPC Service Controls for all Cloud Storage buckets by adding their projects to a service perimeter with storage.googleapis.com as a restricted service. This prevents data exfiltration and ensures API calls are only allowed from authorized networks.",
      "Url": "https://hub.prowler.com/check/cloudstorage_uses_vpc_service_controls"
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

---[FILE: cloudstorage_uses_vpc_service_controls.py]---
Location: prowler-master/prowler/providers/gcp/services/cloudstorage/cloudstorage_uses_vpc_service_controls/cloudstorage_uses_vpc_service_controls.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.accesscontextmanager.accesscontextmanager_client import (
    accesscontextmanager_client,
)
from prowler.providers.gcp.services.cloudresourcemanager.cloudresourcemanager_client import (
    cloudresourcemanager_client,
)
from prowler.providers.gcp.services.cloudstorage.cloudstorage_client import (
    cloudstorage_client,
)


class cloudstorage_uses_vpc_service_controls(Check):
    """
    Ensure Cloud Storage is protected by VPC Service Controls at project level.

    Reports PASS if:
    - A project is in a VPC Service Controls perimeter with storage.googleapis.com
      as a restricted service, OR
    - The Cloud Storage API access is blocked by VPC Service Controls
      (verified by vpcServiceControlsUniqueIdentifier in the error response)

    Otherwise reports FAIL.
    """

    def execute(self) -> list[Check_Report_GCP]:
        findings = []

        protected_projects = {}
        for perimeter in accesscontextmanager_client.service_perimeters:
            if any(
                service == "storage.googleapis.com"
                for service in perimeter.restricted_services
            ):
                for resource in perimeter.resources:
                    protected_projects[resource] = perimeter.title

        for project in cloudresourcemanager_client.cloud_resource_manager_projects:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=cloudresourcemanager_client.projects[project.id],
                project_id=project.id,
                location=cloudresourcemanager_client.region,
                resource_name=(
                    cloudresourcemanager_client.projects[project.id].name
                    if cloudresourcemanager_client.projects[project.id].name
                    else "GCP Project"
                ),
            )
            report.status = "FAIL"
            report.status_extended = f"Project {project.id} does not have VPC Service Controls enabled for Cloud Storage."
            # GCP stores resources by project number, not project ID
            project_resource_id = f"projects/{project.number}"

            if project_resource_id in protected_projects:
                report.status = "PASS"
                report.status_extended = f"Project {project.id} has VPC Service Controls enabled for Cloud Storage in perimeter {protected_projects[project_resource_id]}."
            elif (
                project.id
                in cloudstorage_client.vpc_service_controls_protected_projects
            ):
                report.status = "PASS"
                report.status_extended = f"Project {project.id} has VPC Service Controls enabled for Cloud Storage in undetermined perimeter (verified by API access restriction)."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: compute_client.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.compute.compute_service import Compute

compute_client = Compute(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: compute_service.py]---
Location: prowler-master/prowler/providers/gcp/services/compute/compute_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class Compute(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider)
        self.regions = set()
        self.zones = set()
        self.instances = []
        self.networks = []
        self.subnets = []
        self.addresses = []
        self.firewalls = []
        self.compute_projects = []
        self.load_balancers = []
        self._get_regions()
        self._get_projects()
        self._get_url_maps()
        self._describe_backend_service()
        self._get_zones()
        self.__threading_call__(self._get_instances, self.zones)
        self._get_networks()
        self.__threading_call__(self._get_subnetworks, self.regions)
        self._get_firewalls()
        self.__threading_call__(self._get_addresses, self.regions)

    def _get_regions(self):
        for project_id in self.project_ids:
            try:
                request = self.client.regions().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for region in response.get("items", []):
                        self.regions.add(region["name"])

                    request = self.client.regions().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_zones(self):
        for project_id in self.project_ids:
            try:
                request = self.client.zones().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for zone in response.get("items", []):
                        self.zones.add(zone["name"])

                    request = self.client.zones().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_projects(self):
        for project_id in self.project_ids:
            try:
                enable_oslogin = False
                response = (
                    self.client.projects()
                    .get(project=project_id)
                    .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                )
                for item in response["commonInstanceMetadata"].get("items", []):
                    if item["key"] == "enable-oslogin" and item["value"] == "TRUE":
                        enable_oslogin = True
                self.compute_projects.append(
                    Project(id=project_id, enable_oslogin=enable_oslogin)
                )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_instances(self, zone):
        for project_id in self.project_ids:
            try:
                request = self.client.instances().list(project=project_id, zone=zone)
                while request is not None:
                    response = request.execute(
                        http=self.__get_AuthorizedHttp_client__(),
                        num_retries=DEFAULT_RETRY_ATTEMPTS,
                    )

                    for instance in response.get("items", []):
                        public_ip = False
                        for interface in instance.get("networkInterfaces", []):
                            for config in interface.get("accessConfigs", []):
                                if "natIP" in config:
                                    public_ip = True
                        self.instances.append(
                            Instance(
                                name=instance["name"],
                                id=instance["id"],
                                zone=zone,
                                region=zone.rsplit("-", 1)[0],
                                public_ip=public_ip,
                                metadata=instance.get("metadata", {}),
                                shielded_enabled_vtpm=instance.get(
                                    "shieldedInstanceConfig", {}
                                ).get("enableVtpm", False),
                                shielded_enabled_integrity_monitoring=instance.get(
                                    "shieldedInstanceConfig", {}
                                ).get("enableIntegrityMonitoring", False),
                                confidential_computing=instance.get(
                                    "confidentialInstanceConfig", {}
                                ).get("enableConfidentialCompute", False),
                                service_accounts=instance.get("serviceAccounts", []),
                                ip_forward=instance.get("canIpForward", False),
                                disks_encryption=[
                                    (
                                        disk["deviceName"],
                                        (
                                            True
                                            if disk.get("diskEncryptionKey", {}).get(
                                                "sha256"
                                            )
                                            else False
                                        ),
                                    )
                                    for disk in instance.get("disks", [])
                                ],
                                automatic_restart=instance.get("scheduling", {}).get(
                                    "automaticRestart", False
                                ),
                                provisioning_model=instance.get("scheduling", {}).get(
                                    "provisioningModel", "STANDARD"
                                ),
                                project_id=project_id,
                                preemptible=instance.get("scheduling", {}).get(
                                    "preemptible", False
                                ),
                                deletion_protection=instance.get(
                                    "deletionProtection", False
                                ),
                            )
                        )

                    request = self.client.instances().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{zone} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_networks(self):
        for project_id in self.project_ids:
            try:
                request = self.client.networks().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                    for network in response.get("items", []):
                        subnet_mode = (
                            "legacy"
                            if "autoCreateSubnetworks" not in network
                            else (
                                "auto" if network["autoCreateSubnetworks"] else "custom"
                            )
                        )
                        self.networks.append(
                            Network(
                                name=network["name"],
                                id=network["id"],
                                subnet_mode=subnet_mode,
                                project_id=project_id,
                            )
                        )

                    request = self.client.networks().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_subnetworks(self, region):
        for project_id in self.project_ids:
            try:
                request = self.client.subnetworks().list(
                    project=project_id, region=region
                )
                while request is not None:
                    response = request.execute(
                        http=self.__get_AuthorizedHttp_client__(),
                        num_retries=DEFAULT_RETRY_ATTEMPTS,
                    )
                    for subnet in response.get("items", []):
                        self.subnets.append(
                            Subnet(
                                name=subnet["name"],
                                id=subnet["id"],
                                project_id=project_id,
                                flow_logs=subnet.get("enableFlowLogs", False),
                                network=subnet["network"].split("/")[-1],
                                region=region,
                            )
                        )

                    request = self.client.subnetworks().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_addresses(self, region):
        for project_id in self.project_ids:
            try:
                request = self.client.addresses().list(
                    project=project_id, region=region
                )
                while request is not None:
                    response = request.execute(
                        http=self.__get_AuthorizedHttp_client__(),
                        num_retries=DEFAULT_RETRY_ATTEMPTS,
                    )
                    for address in response.get("items", []):
                        self.addresses.append(
                            Address(
                                name=address["name"],
                                id=address["id"],
                                project_id=project_id,
                                type=address.get("addressType", "EXTERNAL"),
                                ip=address["address"],
                                region=region,
                            )
                        )

                    request = self.client.subnetworks().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_firewalls(self):
        for project_id in self.project_ids:
            try:
                request = self.client.firewalls().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for firewall in response.get("items", []):
                        self.firewalls.append(
                            Firewall(
                                name=firewall["name"],
                                id=firewall["id"],
                                source_ranges=firewall.get("sourceRanges", []),
                                direction=firewall["direction"],
                                allowed_rules=firewall.get("allowed", []),
                                project_id=project_id,
                            )
                        )

                    request = self.client.firewalls().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_url_maps(self):
        for project_id in self.project_ids:
            try:
                # Global URL maps
                request = self.client.urlMaps().list(project=project_id)
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                    for urlmap in response.get("items", []):
                        self.load_balancers.append(
                            LoadBalancer(
                                name=urlmap["name"],
                                id=urlmap["id"],
                                service=urlmap.get("defaultService", ""),
                                project_id=project_id,
                            )
                        )

                    request = self.client.urlMaps().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )
            try:
                # Regional URL maps
                for region in self.regions:
                    request = self.client.regionUrlMaps().list(
                        project=project_id, region=region
                    )
                    while request is not None:
                        response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                        for urlmap in response.get("items", []):
                            self.load_balancers.append(
                                LoadBalancer(
                                    name=urlmap["name"],
                                    id=urlmap["id"],
                                    service=urlmap.get("defaultService", ""),
                                    project_id=project_id,
                                )
                            )

                        request = self.client.regionUrlMaps().list_next(
                            previous_request=request, previous_response=response
                        )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _describe_backend_service(self):
        for balancer in self.load_balancers:
            if balancer.service:
                try:
                    backend_service_name = balancer.service.split("/")[-1]
                    is_regional = "/regions/" in balancer.service
                    if is_regional:
                        region = balancer.service.split("/regions/")[1].split("/")[0]
                        response = (
                            self.client.regionBackendServices()
                            .get(
                                project=balancer.project_id,
                                region=region,
                                backendService=backend_service_name,
                            )
                            .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                        )
                    else:
                        response = (
                            self.client.backendServices()
                            .get(
                                project=balancer.project_id,
                                backendService=backend_service_name,
                            )
                            .execute(num_retries=DEFAULT_RETRY_ATTEMPTS)
                        )

                    balancer.logging = response.get("logConfig", {}).get(
                        "enable", False
                    )
                except Exception as error:
                    logger.error(
                        f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )


class Instance(BaseModel):
    name: str
    id: str
    zone: str
    region: str
    public_ip: bool
    project_id: str
    metadata: dict
    shielded_enabled_vtpm: bool
    shielded_enabled_integrity_monitoring: bool
    confidential_computing: bool
    service_accounts: list
    ip_forward: bool
    disks_encryption: list
    automatic_restart: bool = False
    preemptible: bool = False
    provisioning_model: str = "STANDARD"
    deletion_protection: bool = False


class Network(BaseModel):
    name: str
    id: str
    subnet_mode: str
    project_id: str


class Subnet(BaseModel):
    name: str
    id: str
    network: str
    project_id: str
    flow_logs: bool
    region: str


class Address(BaseModel):
    name: str
    id: str
    ip: str
    type: str
    project_id: str
    region: str


class Firewall(BaseModel):
    name: str
    id: str
    source_ranges: list
    direction: str
    allowed_rules: list
    project_id: str


class Project(BaseModel):
    id: str
    enable_oslogin: bool


class LoadBalancer(BaseModel):
    name: str
    id: str
    service: str
    logging: bool = False
    project_id: str
```

--------------------------------------------------------------------------------

````
