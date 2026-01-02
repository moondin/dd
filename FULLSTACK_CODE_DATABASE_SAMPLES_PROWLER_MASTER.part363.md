---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 363
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 363 of 867)

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

---[FILE: iam_sa_user_managed_key_unused.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_sa_user_managed_key_unused/iam_sa_user_managed_key_unused.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.iam.iam_client import iam_client
from prowler.providers.gcp.services.monitoring.monitoring_client import (
    monitoring_client,
)


class iam_sa_user_managed_key_unused(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        max_unused_days = monitoring_client.audit_config.get(
            "max_unused_account_days", 180
        )
        keys_used = monitoring_client.sa_keys_metrics
        for account in iam_client.service_accounts:
            for key in account.keys:
                if key.type == "USER_MANAGED":
                    report = Check_Report_GCP(
                        metadata=self.metadata(),
                        resource=account,
                        resource_id=key.name,
                        resource_name=account.email,
                        location=iam_client.region,
                    )
                    if key.name in keys_used:
                        report.status = "PASS"
                        report.status_extended = f"User-managed key {key.name} for Service Account {account.email} was used over the last {max_unused_days} days."
                    else:
                        report.status = "FAIL"
                        report.status_extended = f"User-managed key {key.name} for Service Account {account.email} was not used over the last {max_unused_days} days."
                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: iam_service_account_unused.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_service_account_unused/iam_service_account_unused.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "iam_service_account_unused",
  "CheckTitle": "Ensure That There Are No Unused Service Accounts",
  "CheckType": [],
  "ServiceName": "iam",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "ServiceAccount",
  "Description": "Ensure That There Are No Unused Service Accounts.",
  "Risk": "A malicious actor could make use of privilege escalation or impersonation to access an unused Service Account that is over-privileged.",
  "RelatedUrl": "https://cloud.google.com/iam/docs/service-account-overview#identify-unused",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to disable or remove unused Service Accounts.",
      "Url": "https://cloud.google.com/iam/docs/service-account-overview#identify-unused"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: iam_service_account_unused.py]---
Location: prowler-master/prowler/providers/gcp/services/iam/iam_service_account_unused/iam_service_account_unused.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.iam.iam_client import iam_client
from prowler.providers.gcp.services.monitoring.monitoring_client import (
    monitoring_client,
)


class iam_service_account_unused(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        max_unused_days = monitoring_client.audit_config.get(
            "max_unused_account_days", 180
        )
        sa_ids_used = monitoring_client.sa_api_metrics
        for account in iam_client.service_accounts:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=account,
                resource_id=account.email,
                location=iam_client.region,
            )
            if account.uniqueId in sa_ids_used:
                report.status = "PASS"
                report.status_extended = f"Service Account {account.email} was used over the last {max_unused_days} days."
            else:
                report.status = "FAIL"
                report.status_extended = f"Service Account {account.email} was not used over the last {max_unused_days} days."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kms_client.py]---
Location: prowler-master/prowler/providers/gcp/services/kms/kms_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.kms.kms_service import KMS

kms_client = KMS(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: kms_service.py]---
Location: prowler-master/prowler/providers/gcp/services/kms/kms_service.py
Signals: Pydantic

```python
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class KMS(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__("cloudkms", provider)
        self.locations = []
        self.key_rings = []
        self.crypto_keys = []
        self._get_locations()
        self.__threading_call__(self._get_key_rings, self.locations)
        self._get_crypto_keys()
        self._get_crypto_keys_iam_policy()

    def _get_locations(self):
        for project_id in self.project_ids:
            try:
                request = (
                    self.client.projects()
                    .locations()
                    .list(name="projects/" + project_id)
                )
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for location in response["locations"]:
                        self.locations.append(
                            KeyLocation(name=location["name"], project_id=project_id)
                        )

                    request = (
                        self.client.projects()
                        .locations()
                        .list_next(previous_request=request, previous_response=response)
                    )
            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_key_rings(self, location):
        try:
            request = (
                self.client.projects().locations().keyRings().list(parent=location.name)
            )
            while request is not None:
                response = request.execute(
                    http=self.__get_AuthorizedHttp_client__(),
                    num_retries=DEFAULT_RETRY_ATTEMPTS,
                )

                for ring in response.get("keyRings", []):
                    self.key_rings.append(
                        KeyRing(
                            name=ring["name"],
                            project_id=location.project_id,
                        )
                    )

                request = (
                    self.client.projects()
                    .locations()
                    .keyRings()
                    .list_next(previous_request=request, previous_response=response)
                )
        except Exception as error:
            logger.error(
                f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_crypto_keys(self):
        for ring in self.key_rings:
            try:
                request = (
                    self.client.projects()
                    .locations()
                    .keyRings()
                    .cryptoKeys()
                    .list(parent=ring.name)
                )
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for key in response.get("cryptoKeys", []):
                        self.crypto_keys.append(
                            CriptoKey(
                                id=key["name"],
                                name=key["name"].split("/")[-1],
                                location=key["name"].split("/")[3],
                                rotation_period=key.get("rotationPeriod"),
                                next_rotation_time=key.get("nextRotationTime"),
                                key_ring=ring.name,
                                project_id=ring.project_id,
                            )
                        )

                    request = (
                        self.client.projects()
                        .locations()
                        .keyRings()
                        .cryptoKeys()
                        .list_next(previous_request=request, previous_response=response)
                    )
            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_crypto_keys_iam_policy(self):
        for key in self.crypto_keys:
            try:
                request = (
                    self.client.projects()
                    .locations()
                    .keyRings()
                    .cryptoKeys()
                    .getIamPolicy(resource=key.key_ring + "/cryptoKeys/" + key.name)
                )
                response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                for binding in response.get("bindings", []):
                    key.members.extend(binding.get("members", []))
            except Exception as error:
                logger.error(
                    f"{self.region} -- {error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class KeyLocation(BaseModel):
    name: str
    project_id: str


class KeyRing(BaseModel):
    name: str
    project_id: str


class CriptoKey(BaseModel):
    id: str
    name: str
    location: str
    rotation_period: Optional[str] = None
    next_rotation_time: Optional[str] = None
    key_ring: str
    members: list = []
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: kms_key_not_publicly_accessible.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/kms/kms_key_not_publicly_accessible/kms_key_not_publicly_accessible.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "kms_key_not_publicly_accessible",
  "CheckTitle": "Check for Publicly Accessible Cloud KMS Keys",
  "CheckType": [],
  "ServiceName": "kms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "CryptoKey",
  "Description": "Check for Publicly Accessible Cloud KMS Keys",
  "Risk": "Ensure that the IAM policy associated with your Cloud Key Management Service (KMS) keys is restricting anonymous and/or public access",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudKMS/publicly-accessible-kms-cryptokeys.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-general-policies/ensure-that-cloud-kms-cryptokeys-are-not-anonymously-or-publicly-accessible#terraform"
    },
    "Recommendation": {
      "Text": "To deny access from anonymous and public users, remove the bindings for 'allUsers' and 'allAuthenticatedUsers' members from the KMS key's IAM policy.",
      "Url": "https://cloud.google.com/kms/docs/iam"
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

---[FILE: kms_key_not_publicly_accessible.py]---
Location: prowler-master/prowler/providers/gcp/services/kms/kms_key_not_publicly_accessible/kms_key_not_publicly_accessible.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.kms.kms_client import kms_client


class kms_key_not_publicly_accessible(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for key in kms_client.crypto_keys:
            report = Check_Report_GCP(metadata=self.metadata(), resource=key)
            report.status = "PASS"
            report.status_extended = f"Key {key.name} is not exposed to Public."
            for member in key.members:
                if member == "allUsers" or member == "allAuthenticatedUsers":
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Key {key.name} may be publicly accessible."
                    )
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: kms_key_rotation_enabled.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/kms/kms_key_rotation_enabled/kms_key_rotation_enabled.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "kms_key_rotation_enabled",
  "CheckTitle": "Ensure KMS keys are rotated within a period of 90 days",
  "CheckType": [],
  "ServiceName": "kms",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "CryptoKey",
  "Description": "Ensure KMS keys are rotated within a period of 90 days",
  "Risk": "Ensure that all your Cloud Key Management Service (KMS) keys are rotated within a period of 90 days in order to meet security and compliance requirements",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud kms keys update new --keyring=<KEY_RING> --location=<LOCATION> --nextrotation-time=<NEXT_ROTATION_TIME> --rotation-period=<ROTATION_PERIOD>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudKMS/rotate-kms-encryption-keys.html",
      "Terraform": "https://docs.prowler.com/checks/gcp/google-cloud-general-policies/bc_gcp_general_4#terraform"
    },
    "Recommendation": {
      "Text": "After a successful key rotation, the older key version is required in order to decrypt the data encrypted by that previous key version.",
      "Url": "https://cloud.google.com/iam/docs/manage-access-service-accounts"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: kms_key_rotation_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/kms/kms_key_rotation_enabled/kms_key_rotation_enabled.py

```python
import datetime

from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.kms.kms_client import kms_client


class kms_key_rotation_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for key in kms_client.crypto_keys:
            report = Check_Report_GCP(metadata=self.metadata(), resource=key)
            now = datetime.datetime.now()
            condition_next_rotation_time = False
            if key.next_rotation_time:
                try:
                    next_rotation_time = datetime.datetime.strptime(
                        key.next_rotation_time, "%Y-%m-%dT%H:%M:%S.%fZ"
                    )
                except ValueError:
                    next_rotation_time = datetime.datetime.strptime(
                        key.next_rotation_time, "%Y-%m-%dT%H:%M:%SZ"
                    )
                condition_next_rotation_time = (
                    abs((next_rotation_time - now).days) <= 90
                )
            condition_rotation_period = False
            if key.rotation_period:
                condition_rotation_period = (
                    int(key.rotation_period[:-1]) // (24 * 3600) <= 90
                )
            if condition_rotation_period and condition_next_rotation_time:
                report.status = "PASS"
                report.status_extended = f"Key {key.name} is rotated every 90 days or less and the next rotation time is in less than 90 days."
            else:
                report.status = "FAIL"
                if condition_rotation_period:
                    report.status_extended = f"Key {key.name} is rotated every 90 days or less but the next rotation time is in more than 90 days."
                elif condition_next_rotation_time:
                    report.status_extended = f"Key {key.name} is not rotated every 90 days or less but the next rotation time is in less than 90 days."
                else:
                    report.status_extended = f"Key {key.name} is not rotated every 90 days or less and the next rotation time is in more than 90 days."
            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: logging_client.py]---
Location: prowler-master/prowler/providers/gcp/services/logging/logging_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.logging.logging_service import Logging

logging_client = Logging(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: logging_service.py]---
Location: prowler-master/prowler/providers/gcp/services/logging/logging_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class Logging(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider, api_version="v2")
        self.sinks = []
        self.metrics = []
        self._get_sinks()
        self._get_metrics()

    def _get_sinks(self):
        for project_id in self.project_ids:
            try:
                request = self.client.sinks().list(parent=f"projects/{project_id}")
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for sink in response.get("sinks", []):
                        self.sinks.append(
                            Sink(
                                name=sink["name"],
                                destination=sink["destination"],
                                filter=sink.get("filter", "all"),
                                project_id=project_id,
                            )
                        )

                    request = self.client.sinks().list_next(
                        previous_request=request, previous_response=response
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_metrics(self):
        for project_id in self.project_ids:
            try:
                request = (
                    self.client.projects()
                    .metrics()
                    .list(parent=f"projects/{project_id}")
                )
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for metric in response.get("metrics", []):
                        self.metrics.append(
                            Metric(
                                name=metric["name"],
                                type=metric["metricDescriptor"]["type"],
                                filter=metric["filter"],
                                project_id=project_id,
                            )
                        )

                    request = (
                        self.client.projects()
                        .metrics()
                        .list_next(previous_request=request, previous_response=response)
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )


class Sink(BaseModel):
    name: str
    destination: str
    filter: str
    project_id: str


class Metric(BaseModel):
    name: str
    type: str
    filter: str
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: logging_log_metric_filter_and_alert_for_custom_role_changes_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/logging/logging_log_metric_filter_and_alert_for_custom_role_changes_enabled/logging_log_metric_filter_and_alert_for_custom_role_changes_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.logging.logging_client import logging_client
from prowler.providers.gcp.services.monitoring.monitoring_client import (
    monitoring_client,
)


class logging_log_metric_filter_and_alert_for_custom_role_changes_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        projects_with_metric = set()
        for metric in logging_client.metrics:
            if (
                'resource.type="iam_role" AND (protoPayload.methodName="google.iam.admin.v1.CreateRole" OR protoPayload.methodName="google.iam.admin.v1.DeleteRole" OR protoPayload.methodName="google.iam.admin.v1.UpdateRole")'
                in metric.filter
            ):
                report = Check_Report_GCP(
                    metadata=self.metadata(),
                    resource=metric,
                    location=logging_client.region,
                    resource_name=metric.name if metric.name else "Log Metric Filter",
                )
                projects_with_metric.add(metric.project_id)
                report.status = "FAIL"
                report.status_extended = f"Log metric filter {metric.name} found but no alerts associated in project {metric.project_id}."
                for alert_policy in monitoring_client.alert_policies:
                    for filter in alert_policy.filters:
                        if metric.name in filter:
                            report.status = "PASS"
                            report.status_extended = f"Log metric filter {metric.name} found with alert policy {alert_policy.display_name} associated in project {metric.project_id}."
                            break
                findings.append(report)

        for project in logging_client.project_ids:
            if project not in projects_with_metric:
                report = Check_Report_GCP(
                    metadata=self.metadata(),
                    resource=logging_client.projects[project],
                    project_id=project,
                    location=logging_client.region,
                    resource_name=(
                        logging_client.projects[project].name
                        if logging_client.projects[project].name
                        else "GCP Project"
                    ),
                )
                report.status = "FAIL"
                report.status_extended = f"There are no log metric filters or alerts associated in project {project}."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled.py]---
Location: prowler-master/prowler/providers/gcp/services/logging/logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled/logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.logging.logging_client import logging_client
from prowler.providers.gcp.services.monitoring.monitoring_client import (
    monitoring_client,
)


class logging_log_metric_filter_and_alert_for_vpc_network_changes_enabled(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        projects_with_metric = set()
        for metric in logging_client.metrics:
            if (
                'resource.type="gce_network" AND (protoPayload.methodName:"compute.networks.insert" OR protoPayload.methodName:"compute.networks.patch" OR protoPayload.methodName:"compute.networks.delete" OR protoPayload.methodName:"compute.networks.removePeering" OR protoPayload.methodName:"compute.networks.addPeering")'
                in metric.filter
            ):
                report = Check_Report_GCP(
                    metadata=self.metadata(),
                    resource=metric,
                    location=logging_client.region,
                    resource_name=metric.name if metric.name else "Log Metric Filter",
                )
                projects_with_metric.add(metric.project_id)
                report.status = "FAIL"
                report.status_extended = f"Log metric filter {metric.name} found but no alerts associated in project {metric.project_id}."
                for alert_policy in monitoring_client.alert_policies:
                    for filter in alert_policy.filters:
                        if metric.name in filter:
                            report.status = "PASS"
                            report.status_extended = f"Log metric filter {metric.name} found with alert policy {alert_policy.display_name} associated in project {metric.project_id}."
                            break
                findings.append(report)

        for project in logging_client.project_ids:
            if project not in projects_with_metric:
                report = Check_Report_GCP(
                    metadata=self.metadata(),
                    resource=logging_client.projects[project],
                    project_id=project,
                    location=logging_client.region,
                    resource_name=(
                        logging_client.projects[project].name
                        if logging_client.projects[project].name
                        else "GCP Project"
                    ),
                )
                report.status = "FAIL"
                report.status_extended = f"There are no log metric filters or alerts associated in project {project}."
                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: logging_sink_created.metadata.json]---
Location: prowler-master/prowler/providers/gcp/services/logging/logging_sink_created/logging_sink_created.metadata.json

```json
{
  "Provider": "gcp",
  "CheckID": "logging_sink_created",
  "CheckTitle": "Ensure there is at least one sink used to export copies of all the log entries.",
  "CheckType": [],
  "ServiceName": "logging",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Sink",
  "Description": "Ensure there is at least one sink used to export copies of all the log entries.",
  "Risk": "If sinks are not created, logs would be deleted after the configured retention period, and would not be backed up.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "gcloud logging sinks create <project_id> <destination_bucket>",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/gcp/CloudLogging/export-all-log-entries.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "It is recommended to create a sink that will export copies of all the log entries. This can help aggregate logs from multiple projects and export them to a Security Information and Event Management (SIEM).",
      "Url": "https://cloud.google.com/logging/docs/export"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: logging_sink_created.py]---
Location: prowler-master/prowler/providers/gcp/services/logging/logging_sink_created/logging_sink_created.py

```python
from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.logging.logging_client import logging_client


class logging_sink_created(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        projects_with_logging_sink = {}
        for sink in logging_client.sinks:
            if sink.filter == "all":
                projects_with_logging_sink[sink.project_id] = sink

        for project in logging_client.project_ids:
            if project not in projects_with_logging_sink.keys():
                project_obj = logging_client.projects.get(project)
                report = Check_Report_GCP(
                    metadata=self.metadata(),
                    resource=project_obj,
                    resource_id=project,
                    project_id=project,
                    location=logging_client.region,
                    resource_name=(getattr(project_obj, "name", None) or "GCP Project"),
                )
                report.status = "FAIL"
                report.status_extended = f"There are no logging sinks to export copies of all the log entries in project {project}."
                findings.append(report)
            else:
                sink = projects_with_logging_sink[project]
                sink_name = getattr(sink, "name", None) or "unknown"
                report = Check_Report_GCP(
                    metadata=self.metadata(),
                    resource=sink,
                    resource_id=sink_name,
                    project_id=project,
                    location=logging_client.region,
                    resource_name=(
                        sink_name if sink_name != "unknown" else "Logging Sink"
                    ),
                )
                report.status = "PASS"
                report.status_extended = f"Sink {sink_name} is enabled exporting copies of all the log entries in project {project}."
                findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: monitoring_client.py]---
Location: prowler-master/prowler/providers/gcp/services/monitoring/monitoring_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.monitoring.monitoring_service import Monitoring

monitoring_client = Monitoring(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: monitoring_service.py]---
Location: prowler-master/prowler/providers/gcp/services/monitoring/monitoring_service.py
Signals: Pydantic

```python
import datetime

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.gcp.config import DEFAULT_RETRY_ATTEMPTS
from prowler.providers.gcp.gcp_provider import GcpProvider
from prowler.providers.gcp.lib.service.service import GCPService


class Monitoring(GCPService):
    def __init__(self, provider: GcpProvider):
        super().__init__(__class__.__name__, provider, api_version="v3")
        self.alert_policies = []
        self.sa_keys_metrics = set()
        self.sa_api_metrics = set()
        self._get_alert_policies()
        self._get_sa_keys_metrics(
            "iam.googleapis.com/service_account/key/authn_events_count"
        )
        self._get_sa_api_metrics("serviceruntime.googleapis.com/api/request_count")

    def _get_alert_policies(self):
        for project_id in self.project_ids:
            try:
                request = (
                    self.client.projects()
                    .alertPolicies()
                    .list(name=f"projects/{project_id}")
                )
                while request is not None:
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for policy in response.get("alertPolicies", []):
                        filters = []
                        for condition in policy.get("conditions", []):
                            # Handle different condition types
                            if "conditionThreshold" in condition:
                                filter_value = condition["conditionThreshold"].get(
                                    "filter", ""
                                )
                                if filter_value:
                                    filters.append(filter_value)
                            elif "conditionAbsent" in condition:
                                filter_value = condition["conditionAbsent"].get(
                                    "filter", ""
                                )
                                if filter_value:
                                    filters.append(filter_value)
                            elif "conditionMatchedLog" in condition:
                                filter_value = condition["conditionMatchedLog"].get(
                                    "filter", ""
                                )
                                if filter_value:
                                    filters.append(filter_value)
                            elif "conditionMonitoringQueryLanguage" in condition:
                                query = condition[
                                    "conditionMonitoringQueryLanguage"
                                ].get("query", "")
                                if query:
                                    filters.append(query)
                            else:
                                logger.warning(
                                    f"Unknown condition type in alert policy {policy.get('name', 'Unknown')}: {condition.keys()}"
                                )
                        self.alert_policies.append(
                            AlertPolicy(
                                name=policy["name"],
                                display_name=policy["displayName"],
                                enabled=policy["enabled"],
                                filters=filters,
                                project_id=project_id,
                            )
                        )

                    request = (
                        self.client.projects()
                        .alertPolicies()
                        .list_next(previous_request=request, previous_response=response)
                    )
            except Exception as error:
                logger.error(
                    f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                )

    def _get_sa_keys_metrics(self, metric_type):
        try:
            max_unused_days = int(self.audit_config.get("max_unused_account_days", 180))
            end_time = (
                datetime.datetime.now(datetime.timezone.utc)
                .replace(microsecond=0)
                .isoformat()
            )
            start_time = (
                (
                    datetime.datetime.now(datetime.timezone.utc)
                    - datetime.timedelta(days=max_unused_days)
                )
                .replace(microsecond=0)
                .isoformat()
            )
            for project_id in self.project_ids:
                try:
                    request = (
                        self.client.projects()
                        .timeSeries()
                        .list(
                            name=f"projects/{project_id}",
                            filter=f'metric.type = "{metric_type}"',
                            interval_startTime=start_time,
                            interval_endTime=end_time,
                            view="HEADERS",
                        )
                    )
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for metric in response.get("timeSeries", []):
                        key_id = metric["metric"]["labels"].get("key_id")
                        if key_id:
                            self.sa_keys_metrics.add(key_id)

                except Exception as error:
                    logger.error(
                        f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

    def _get_sa_api_metrics(self, metric_type):
        try:
            max_unused_days = int(self.audit_config.get("max_unused_account_days", 180))
            end_time = (
                datetime.datetime.now(datetime.timezone.utc)
                .replace(microsecond=0)
                .isoformat()
            )
            start_time = (
                (
                    datetime.datetime.now(datetime.timezone.utc)
                    - datetime.timedelta(days=max_unused_days)
                )
                .replace(microsecond=0)
                .isoformat()
            )
            for project_id in self.project_ids:
                try:
                    request = (
                        self.client.projects()
                        .timeSeries()
                        .list(
                            name=f"projects/{project_id}",
                            filter=f'metric.type = "{metric_type}"',
                            interval_startTime=start_time,
                            interval_endTime=end_time,
                            view="HEADERS",
                        )
                    )
                    response = request.execute(num_retries=DEFAULT_RETRY_ATTEMPTS)

                    for metric in response.get("timeSeries", []):
                        sa_id = metric["resource"]["labels"].get("credential_id")
                        if sa_id and "serviceaccount:" in sa_id:
                            self.sa_api_metrics.add(
                                sa_id.replace("serviceaccount:", "")
                            )

                except Exception as error:
                    logger.error(
                        f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )


class AlertPolicy(BaseModel):
    name: str
    display_name: str
    filters: list[str]
    enabled: bool
    project_id: str
```

--------------------------------------------------------------------------------

---[FILE: serviceusage_client.py]---
Location: prowler-master/prowler/providers/gcp/services/serviceusage/serviceusage_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.gcp.services.serviceusage.serviceusage_service import (
    ServiceUsage,
)

serviceusage_client = ServiceUsage(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
