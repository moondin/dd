---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 45
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 45 of 867)

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

---[FILE: backfill.py]---
Location: prowler-master/api/src/backend/tasks/jobs/backfill.py
Signals: Django

```python
from collections import defaultdict
from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone
from tasks.jobs.scan import aggregate_category_counts

from api.db_router import READ_REPLICA_ALIAS
from api.db_utils import rls_transaction
from api.models import (
    ComplianceOverviewSummary,
    ComplianceRequirementOverview,
    DailySeveritySummary,
    Finding,
    Resource,
    ResourceFindingMapping,
    ResourceScanSummary,
    Scan,
    ScanCategorySummary,
    ScanSummary,
    StateChoices,
)


def backfill_resource_scan_summaries(tenant_id: str, scan_id: str):
    with rls_transaction(tenant_id, using=READ_REPLICA_ALIAS):
        if ResourceScanSummary.objects.filter(
            tenant_id=tenant_id, scan_id=scan_id
        ).exists():
            return {"status": "already backfilled"}

    with rls_transaction(tenant_id):
        if not Scan.objects.filter(
            tenant_id=tenant_id,
            id=scan_id,
            state__in=(StateChoices.COMPLETED, StateChoices.FAILED),
        ).exists():
            return {"status": "scan is not completed"}

        resource_ids_qs = (
            ResourceFindingMapping.objects.filter(
                tenant_id=tenant_id, finding__scan_id=scan_id
            )
            .values_list("resource_id", flat=True)
            .distinct()
        )

        resource_ids = list(resource_ids_qs)

        if not resource_ids:
            return {"status": "no resources to backfill"}

        resources_qs = Resource.objects.filter(
            tenant_id=tenant_id, id__in=resource_ids
        ).only("id", "service", "region", "type")

        summaries = []
        for resource in resources_qs.iterator():
            summaries.append(
                ResourceScanSummary(
                    tenant_id=tenant_id,
                    scan_id=scan_id,
                    resource_id=str(resource.id),
                    service=resource.service,
                    region=resource.region,
                    resource_type=resource.type,
                )
            )

        for i in range(0, len(summaries), 500):
            ResourceScanSummary.objects.bulk_create(
                summaries[i : i + 500], ignore_conflicts=True
            )

    return {"status": "backfilled", "inserted": len(summaries)}


def backfill_compliance_summaries(tenant_id: str, scan_id: str):
    """
    Backfill ComplianceOverviewSummary records for a completed scan.

    This function checks if summary records already exist for the scan.
    If not, it aggregates compliance requirement data and creates the summaries.

    Args:
        tenant_id: Target tenant UUID
        scan_id: Scan UUID to backfill

    Returns:
        dict: Status indicating whether backfill was performed
    """
    with rls_transaction(tenant_id):
        if ComplianceOverviewSummary.objects.filter(
            tenant_id=tenant_id, scan_id=scan_id
        ).exists():
            return {"status": "already backfilled"}

    with rls_transaction(tenant_id):
        if not Scan.objects.filter(
            tenant_id=tenant_id,
            id=scan_id,
            state__in=(StateChoices.COMPLETED, StateChoices.FAILED),
        ).exists():
            return {"status": "scan is not completed"}

        # Fetch all compliance requirement overview rows for this scan
        requirement_rows = ComplianceRequirementOverview.objects.filter(
            tenant_id=tenant_id, scan_id=scan_id
        ).values(
            "compliance_id",
            "requirement_id",
            "requirement_status",
        )

        if not requirement_rows:
            return {"status": "no compliance data to backfill"}

        # Group by (compliance_id, requirement_id) across regions
        requirement_statuses = defaultdict(
            lambda: {"fail_count": 0, "pass_count": 0, "total_count": 0}
        )

        for row in requirement_rows:
            compliance_id = row["compliance_id"]
            requirement_id = row["requirement_id"]
            requirement_status = row["requirement_status"]

            # Aggregate requirement status across regions
            key = (compliance_id, requirement_id)
            requirement_statuses[key]["total_count"] += 1

            if requirement_status == "FAIL":
                requirement_statuses[key]["fail_count"] += 1
            elif requirement_status == "PASS":
                requirement_statuses[key]["pass_count"] += 1

        # Determine per-requirement status and aggregate to compliance level
        compliance_summaries = defaultdict(
            lambda: {
                "total_requirements": 0,
                "requirements_passed": 0,
                "requirements_failed": 0,
                "requirements_manual": 0,
            }
        )

        for (compliance_id, requirement_id), counts in requirement_statuses.items():
            # Apply business rule: any FAIL → requirement fails
            if counts["fail_count"] > 0:
                req_status = "FAIL"
            elif counts["pass_count"] == counts["total_count"]:
                req_status = "PASS"
            else:
                req_status = "MANUAL"

            # Aggregate to compliance level
            compliance_summaries[compliance_id]["total_requirements"] += 1
            if req_status == "PASS":
                compliance_summaries[compliance_id]["requirements_passed"] += 1
            elif req_status == "FAIL":
                compliance_summaries[compliance_id]["requirements_failed"] += 1
            else:
                compliance_summaries[compliance_id]["requirements_manual"] += 1

        # Create summary objects
        summary_objects = []
        for compliance_id, data in compliance_summaries.items():
            summary_objects.append(
                ComplianceOverviewSummary(
                    tenant_id=tenant_id,
                    scan_id=scan_id,
                    compliance_id=compliance_id,
                    requirements_passed=data["requirements_passed"],
                    requirements_failed=data["requirements_failed"],
                    requirements_manual=data["requirements_manual"],
                    total_requirements=data["total_requirements"],
                )
            )

        # Bulk insert summaries
        if summary_objects:
            ComplianceOverviewSummary.objects.bulk_create(
                summary_objects, batch_size=500, ignore_conflicts=True
            )

    return {"status": "backfilled", "inserted": len(summary_objects)}


def backfill_daily_severity_summaries(tenant_id: str, days: int = None):
    """
    Backfill DailySeveritySummary from completed scans.
    Groups by provider+date, keeps latest scan per day.
    """
    created_count = 0
    updated_count = 0

    with rls_transaction(tenant_id, using=READ_REPLICA_ALIAS):
        scan_filter = {
            "tenant_id": tenant_id,
            "state": StateChoices.COMPLETED,
            "completed_at__isnull": False,
        }

        if days is not None:
            cutoff_date = timezone.now() - timedelta(days=days)
            scan_filter["completed_at__gte"] = cutoff_date

        completed_scans = (
            Scan.objects.filter(**scan_filter)
            .order_by("provider_id", "-completed_at")
            .values("id", "provider_id", "completed_at")
        )

        if not completed_scans:
            return {"status": "no scans to backfill"}

        # Keep only latest scan per provider/day
        latest_scans_by_day = {}
        for scan in completed_scans:
            key = (scan["provider_id"], scan["completed_at"].date())
            if key not in latest_scans_by_day:
                latest_scans_by_day[key] = scan

    # Process each provider/day
    for (provider_id, scan_date), scan in latest_scans_by_day.items():
        scan_id = scan["id"]

        with rls_transaction(tenant_id, using=READ_REPLICA_ALIAS):
            severity_totals = (
                ScanSummary.objects.filter(
                    tenant_id=tenant_id,
                    scan_id=scan_id,
                )
                .values("severity")
                .annotate(total_fail=Sum("fail"), total_muted=Sum("muted"))
            )

            severity_data = {
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0,
                "informational": 0,
                "muted": 0,
            }

            for row in severity_totals:
                severity = row["severity"]
                if severity in severity_data:
                    severity_data[severity] = row["total_fail"] or 0
                severity_data["muted"] += row["total_muted"] or 0

        with rls_transaction(tenant_id):
            _, created = DailySeveritySummary.objects.update_or_create(
                tenant_id=tenant_id,
                provider_id=provider_id,
                date=scan_date,
                defaults={
                    "scan_id": scan_id,
                    "critical": severity_data["critical"],
                    "high": severity_data["high"],
                    "medium": severity_data["medium"],
                    "low": severity_data["low"],
                    "informational": severity_data["informational"],
                    "muted": severity_data["muted"],
                },
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

    return {
        "status": "backfilled",
        "created": created_count,
        "updated": updated_count,
        "total_days": len(latest_scans_by_day),
    }


def backfill_scan_category_summaries(tenant_id: str, scan_id: str):
    """
    Backfill ScanCategorySummary for a completed scan.

    Aggregates category counts from all findings in the scan and creates
    one ScanCategorySummary row per (category, severity) combination.

    Args:
        tenant_id: Target tenant UUID
        scan_id: Scan UUID to backfill

    Returns:
        dict: Status indicating whether backfill was performed
    """
    with rls_transaction(tenant_id, using=READ_REPLICA_ALIAS):
        if ScanCategorySummary.objects.filter(
            tenant_id=tenant_id, scan_id=scan_id
        ).exists():
            return {"status": "already backfilled"}

        if not Scan.objects.filter(
            tenant_id=tenant_id,
            id=scan_id,
            state__in=(StateChoices.COMPLETED, StateChoices.FAILED),
        ).exists():
            return {"status": "scan is not completed"}

        category_counts: dict[tuple[str, str], dict[str, int]] = {}
        for finding in Finding.all_objects.filter(
            tenant_id=tenant_id, scan_id=scan_id
        ).values("categories", "severity", "status", "delta", "muted"):
            aggregate_category_counts(
                categories=finding.get("categories") or [],
                severity=finding.get("severity"),
                status=finding.get("status"),
                delta=finding.get("delta"),
                muted=finding.get("muted", False),
                cache=category_counts,
            )

        if not category_counts:
            return {"status": "no categories to backfill"}

    category_summaries = [
        ScanCategorySummary(
            tenant_id=tenant_id,
            scan_id=scan_id,
            category=category,
            severity=severity,
            total_findings=counts["total"],
            failed_findings=counts["failed"],
            new_failed_findings=counts["new_failed"],
        )
        for (category, severity), counts in category_counts.items()
    ]

    with rls_transaction(tenant_id):
        ScanCategorySummary.objects.bulk_create(
            category_summaries, batch_size=500, ignore_conflicts=True
        )

    return {"status": "backfilled", "categories_count": len(category_counts)}
```

--------------------------------------------------------------------------------

---[FILE: connection.py]---
Location: prowler-master/api/src/backend/tasks/jobs/connection.py
Signals: Celery

```python
from datetime import datetime, timezone

import openai
from celery.utils.log import get_task_logger

from api.models import Integration, LighthouseConfiguration, Provider
from api.utils import (
    prowler_integration_connection_test,
    prowler_provider_connection_test,
)

logger = get_task_logger(__name__)


def check_provider_connection(provider_id: str):
    """
    Business logic to check the connection status of a provider.

    Args:
        provider_id (str): The primary key of the Provider instance to check.

    Returns:
        dict: A dictionary containing:
            - 'connected' (bool): Indicates whether the provider is successfully connected.
            - 'error' (str or None): The error message if the connection failed, otherwise `None`.

    Raises:
        ValueError: If the provider type is not supported.
        Model.DoesNotExist: If the provider does not exist.
    """
    provider_instance = Provider.objects.get(pk=provider_id)
    try:
        connection_result = prowler_provider_connection_test(provider_instance)
    except Exception as e:
        logger.warning(
            f"Unexpected exception checking {provider_instance.provider} provider connection: {str(e)}"
        )
        raise e

    provider_instance.connected = connection_result.is_connected
    provider_instance.connection_last_checked_at = datetime.now(tz=timezone.utc)
    provider_instance.save()

    connection_error = f"{connection_result.error}" if connection_result.error else None
    return {"connected": connection_result.is_connected, "error": connection_error}


def check_lighthouse_connection(lighthouse_config_id: str):
    """
    Business logic to check the connection status of a Lighthouse configuration.

    Args:
        lighthouse_config_id (str): The primary key of the LighthouseConfiguration instance to check.

    Returns:
        dict: A dictionary containing:
            - 'connected' (bool): Indicates whether the connection is successful.
            - 'error' (str or None): The error message if the connection failed, otherwise `None`.
            - 'available_models' (list): List of available models if connection is successful.

    Raises:
        Model.DoesNotExist: If the lighthouse configuration does not exist.
    """
    lighthouse_config = LighthouseConfiguration.objects.get(pk=lighthouse_config_id)

    if not lighthouse_config.api_key_decoded:
        lighthouse_config.is_active = False
        lighthouse_config.save()
        return {
            "connected": False,
            "error": "API key is invalid or missing.",
            "available_models": [],
        }

    try:
        client = openai.OpenAI(api_key=lighthouse_config.api_key_decoded)
        models = client.models.list()
        lighthouse_config.is_active = True
        lighthouse_config.save()
        return {
            "connected": True,
            "error": None,
            "available_models": [model.id for model in models.data],
        }
    except Exception as e:
        lighthouse_config.is_active = False
        lighthouse_config.save()
        return {"connected": False, "error": str(e), "available_models": []}


def check_integration_connection(integration_id: str):
    """
    Business logic to check the connection status of an integration.

    Args:
        integration_id (str): The primary key of the Integration instance to check.
    """
    integration = Integration.objects.filter(pk=integration_id, enabled=True).first()

    if not integration:
        logger.info(f"Integration {integration_id} is not enabled")
        return {"connected": False, "error": "Integration is not enabled"}

    try:
        result = prowler_integration_connection_test(integration)
    except Exception as e:
        logger.warning(
            f"Unexpected exception checking {integration.integration_type} integration connection: {str(e)}"
        )
        raise e

    # Update integration connection status
    integration.connected = result.is_connected
    integration.connection_last_checked_at = datetime.now(tz=timezone.utc)
    integration.save()

    return {
        "connected": result.is_connected,
        "error": str(result.error) if result.error else None,
    }
```

--------------------------------------------------------------------------------

---[FILE: deletion.py]---
Location: prowler-master/api/src/backend/tasks/jobs/deletion.py
Signals: Django, Celery

```python
from celery.utils.log import get_task_logger
from django.db import DatabaseError

from api.db_router import MainRouter
from api.db_utils import batch_delete, rls_transaction
from api.models import Finding, Provider, Resource, Scan, ScanSummary, Tenant

logger = get_task_logger(__name__)


def delete_provider(tenant_id: str, pk: str):
    """
    Gracefully deletes an instance of a provider along with its related data.

    Args:
        tenant_id (str): Tenant ID the resources belong to.
        pk (str): The primary key of the Provider instance to delete.

    Returns:
        dict: A dictionary with the count of deleted objects per model,
              including related models.

    Raises:
        Provider.DoesNotExist: If no instance with the provided primary key exists.
    """
    with rls_transaction(tenant_id):
        instance = Provider.all_objects.get(pk=pk)
        deletion_summary = {}
        deletion_steps = [
            ("Scan Summaries", ScanSummary.all_objects.filter(scan__provider=instance)),
            ("Findings", Finding.all_objects.filter(scan__provider=instance)),
            ("Resources", Resource.all_objects.filter(provider=instance)),
            ("Scans", Scan.all_objects.filter(provider=instance)),
        ]

    for step_name, queryset in deletion_steps:
        try:
            _, step_summary = batch_delete(tenant_id, queryset)
            deletion_summary.update(step_summary)
        except DatabaseError as db_error:
            logger.error(f"Error deleting {step_name}: {db_error}")
            raise

    try:
        with rls_transaction(tenant_id):
            _, provider_summary = instance.delete()
        deletion_summary.update(provider_summary)
    except DatabaseError as db_error:
        logger.error(f"Error deleting Provider: {db_error}")
        raise
    return deletion_summary


def delete_tenant(pk: str):
    """
    Gracefully deletes an instance of a tenant along with its related data.

    Args:
        pk (str): The primary key of the Tenant instance to delete.

    Returns:
        dict: A dictionary with the count of deleted objects per model,
              including related models.
    """
    deletion_summary = {}

    for provider in Provider.objects.using(MainRouter.admin_db).filter(tenant_id=pk):
        summary = delete_provider(pk, provider.id)
        deletion_summary.update(summary)

    Tenant.objects.using(MainRouter.admin_db).filter(id=pk).delete()

    return deletion_summary
```

--------------------------------------------------------------------------------

---[FILE: export.py]---
Location: prowler-master/api/src/backend/tasks/jobs/export.py
Signals: Django, Celery

```python
import os
import re
import zipfile

import boto3
import config.django.base as base
from botocore.exceptions import ClientError, NoCredentialsError, ParamValidationError
from celery.utils.log import get_task_logger
from django.conf import settings

from api.db_utils import rls_transaction
from api.models import Scan
from prowler.config.config import (
    csv_file_suffix,
    html_file_suffix,
    json_asff_file_suffix,
    json_ocsf_file_suffix,
    set_output_timestamp,
)
from prowler.lib.outputs.asff.asff import ASFF
from prowler.lib.outputs.compliance.aws_well_architected.aws_well_architected import (
    AWSWellArchitected,
)
from prowler.lib.outputs.compliance.c5.c5_aws import AWSC5
from prowler.lib.outputs.compliance.c5.c5_azure import AzureC5
from prowler.lib.outputs.compliance.c5.c5_gcp import GCPC5
from prowler.lib.outputs.compliance.ccc.ccc_aws import CCC_AWS
from prowler.lib.outputs.compliance.ccc.ccc_azure import CCC_Azure
from prowler.lib.outputs.compliance.ccc.ccc_gcp import CCC_GCP
from prowler.lib.outputs.compliance.cis.cis_aws import AWSCIS
from prowler.lib.outputs.compliance.cis.cis_azure import AzureCIS
from prowler.lib.outputs.compliance.cis.cis_gcp import GCPCIS
from prowler.lib.outputs.compliance.cis.cis_github import GithubCIS
from prowler.lib.outputs.compliance.cis.cis_kubernetes import KubernetesCIS
from prowler.lib.outputs.compliance.cis.cis_m365 import M365CIS
from prowler.lib.outputs.compliance.cis.cis_oraclecloud import OracleCloudCIS
from prowler.lib.outputs.compliance.ens.ens_aws import AWSENS
from prowler.lib.outputs.compliance.ens.ens_azure import AzureENS
from prowler.lib.outputs.compliance.ens.ens_gcp import GCPENS
from prowler.lib.outputs.compliance.iso27001.iso27001_aws import AWSISO27001
from prowler.lib.outputs.compliance.iso27001.iso27001_azure import AzureISO27001
from prowler.lib.outputs.compliance.iso27001.iso27001_gcp import GCPISO27001
from prowler.lib.outputs.compliance.iso27001.iso27001_kubernetes import (
    KubernetesISO27001,
)
from prowler.lib.outputs.compliance.iso27001.iso27001_m365 import M365ISO27001
from prowler.lib.outputs.compliance.kisa_ismsp.kisa_ismsp_aws import AWSKISAISMSP
from prowler.lib.outputs.compliance.mitre_attack.mitre_attack_aws import AWSMitreAttack
from prowler.lib.outputs.compliance.mitre_attack.mitre_attack_azure import (
    AzureMitreAttack,
)
from prowler.lib.outputs.compliance.mitre_attack.mitre_attack_gcp import GCPMitreAttack
from prowler.lib.outputs.compliance.prowler_threatscore.prowler_threatscore_aws import (
    ProwlerThreatScoreAWS,
)
from prowler.lib.outputs.compliance.prowler_threatscore.prowler_threatscore_azure import (
    ProwlerThreatScoreAzure,
)
from prowler.lib.outputs.compliance.prowler_threatscore.prowler_threatscore_gcp import (
    ProwlerThreatScoreGCP,
)
from prowler.lib.outputs.compliance.prowler_threatscore.prowler_threatscore_kubernetes import (
    ProwlerThreatScoreKubernetes,
)
from prowler.lib.outputs.compliance.prowler_threatscore.prowler_threatscore_m365 import (
    ProwlerThreatScoreM365,
)
from prowler.lib.outputs.csv.csv import CSV
from prowler.lib.outputs.html.html import HTML
from prowler.lib.outputs.ocsf.ocsf import OCSF

logger = get_task_logger(__name__)


COMPLIANCE_CLASS_MAP = {
    "aws": [
        (lambda name: name.startswith("cis_"), AWSCIS),
        (lambda name: name == "mitre_attack_aws", AWSMitreAttack),
        (lambda name: name.startswith("ens_"), AWSENS),
        (
            lambda name: name.startswith("aws_well_architected_framework"),
            AWSWellArchitected,
        ),
        (lambda name: name.startswith("iso27001_"), AWSISO27001),
        (lambda name: name.startswith("kisa"), AWSKISAISMSP),
        (lambda name: name == "prowler_threatscore_aws", ProwlerThreatScoreAWS),
        (lambda name: name == "ccc_aws", CCC_AWS),
        (lambda name: name.startswith("c5_"), AWSC5),
    ],
    "azure": [
        (lambda name: name.startswith("cis_"), AzureCIS),
        (lambda name: name == "mitre_attack_azure", AzureMitreAttack),
        (lambda name: name.startswith("ens_"), AzureENS),
        (lambda name: name.startswith("iso27001_"), AzureISO27001),
        (lambda name: name == "ccc_azure", CCC_Azure),
        (lambda name: name == "prowler_threatscore_azure", ProwlerThreatScoreAzure),
        (lambda name: name == "c5_azure", AzureC5),
    ],
    "gcp": [
        (lambda name: name.startswith("cis_"), GCPCIS),
        (lambda name: name == "mitre_attack_gcp", GCPMitreAttack),
        (lambda name: name.startswith("ens_"), GCPENS),
        (lambda name: name.startswith("iso27001_"), GCPISO27001),
        (lambda name: name == "prowler_threatscore_gcp", ProwlerThreatScoreGCP),
        (lambda name: name == "ccc_gcp", CCC_GCP),
        (lambda name: name == "c5_gcp", GCPC5),
    ],
    "kubernetes": [
        (lambda name: name.startswith("cis_"), KubernetesCIS),
        (lambda name: name.startswith("iso27001_"), KubernetesISO27001),
        (
            lambda name: name == "prowler_threatscore_kubernetes",
            ProwlerThreatScoreKubernetes,
        ),
    ],
    "m365": [
        (lambda name: name.startswith("cis_"), M365CIS),
        (lambda name: name == "prowler_threatscore_m365", ProwlerThreatScoreM365),
        (lambda name: name.startswith("iso27001_"), M365ISO27001),
    ],
    "github": [
        (lambda name: name.startswith("cis_"), GithubCIS),
    ],
    "iac": [
        # IaC provider doesn't have specific compliance frameworks yet
        # Trivy handles its own compliance checks
    ],
    "oraclecloud": [
        (lambda name: name.startswith("cis_"), OracleCloudCIS),
    ],
}


# Predefined mapping for output formats and their configurations
OUTPUT_FORMATS_MAPPING = {
    "csv": {
        "class": CSV,
        "suffix": csv_file_suffix,
        "kwargs": {},
    },
    "json-ocsf": {"class": OCSF, "suffix": json_ocsf_file_suffix, "kwargs": {}},
    "json-asff": {"class": ASFF, "suffix": json_asff_file_suffix, "kwargs": {}},
    "html": {"class": HTML, "suffix": html_file_suffix, "kwargs": {"stats": {}}},
}


def _compress_output_files(output_directory: str) -> str:
    """
    Compress output files from all configured output formats into a ZIP archive.
    Args:
        output_directory (str): The directory where the output files are located.
            The function looks up all known suffixes in OUTPUT_FORMATS_MAPPING
            and compresses those files into a single ZIP.
    Returns:
        str: The full path to the newly created ZIP archive.
    """
    zip_path = f"{output_directory}.zip"
    parent_dir = os.path.dirname(output_directory)
    zip_path_abs = os.path.abspath(zip_path)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for foldername, _, filenames in os.walk(parent_dir):
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                if os.path.abspath(file_path) == zip_path_abs:
                    continue
                arcname = os.path.relpath(file_path, start=parent_dir)
                zipf.write(file_path, arcname)

    return zip_path


def get_s3_client():
    """
    Create and return a boto3 S3 client using AWS credentials from environment variables.

    This function attempts to initialize an S3 client by reading the AWS access key, secret key,
    session token, and region from environment variables. It then validates the client by listing
    available S3 buckets. If an error occurs during this process (for example, due to missing or
    invalid credentials), it falls back to creating an S3 client without explicitly provided credentials,
    which may rely on other configuration sources (e.g., IAM roles).

    Returns:
        boto3.client: A configured S3 client instance.

    Raises:
        ClientError, NoCredentialsError, or ParamValidationError if both attempts to create a client fail.
    """
    s3_client = None
    try:
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.DJANGO_OUTPUT_S3_AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.DJANGO_OUTPUT_S3_AWS_SECRET_ACCESS_KEY,
            aws_session_token=settings.DJANGO_OUTPUT_S3_AWS_SESSION_TOKEN,
            region_name=settings.DJANGO_OUTPUT_S3_AWS_DEFAULT_REGION,
        )
        s3_client.list_buckets()
    except (ClientError, NoCredentialsError, ParamValidationError, ValueError):
        s3_client = boto3.client("s3")
        s3_client.list_buckets()

    return s3_client


def _upload_to_s3(
    tenant_id: str, scan_id: str, local_path: str, relative_key: str
) -> str | None:
    """
    Upload a local artifact to an S3 bucket under the tenant/scan prefix.

    Args:
        tenant_id (str): The tenant identifier used as the first segment of the S3 key.
        scan_id (str): The scan identifier used as the second segment of the S3 key.
        local_path (str): Filesystem path to the artifact to upload.
        relative_key (str): Object key relative to `<tenant_id>/<scan_id>/`.

    Returns:
        str | None: S3 URI of the uploaded artifact, or None if the upload is skipped.

    Raises:
        botocore.exceptions.ClientError: If the upload attempt to S3 fails for any reason.
    """
    bucket = base.DJANGO_OUTPUT_S3_AWS_OUTPUT_BUCKET
    if not bucket:
        return

    if not relative_key:
        return

    if not os.path.isfile(local_path):
        return

    try:
        s3 = get_s3_client()

        s3_key = f"{tenant_id}/{scan_id}/{relative_key}"
        s3.upload_file(Filename=local_path, Bucket=bucket, Key=s3_key)

        return f"s3://{base.DJANGO_OUTPUT_S3_AWS_OUTPUT_BUCKET}/{s3_key}"
    except (ClientError, NoCredentialsError, ParamValidationError, ValueError) as e:
        logger.error(f"S3 upload failed: {str(e)}")


def _build_output_path(
    output_directory: str,
    prowler_provider: str,
    tenant_id: str,
    scan_id: str,
    subdirectory: str = None,
) -> str:
    """
    Build a file system path for the output directory of a prowler scan.

    Args:
        output_directory (str): The base output directory.
        prowler_provider (str): An identifier or descriptor for the prowler provider.
                               Typically, this is a string indicating the provider (e.g., "aws").
        tenant_id (str): The unique identifier for the tenant.
        scan_id (str): The unique identifier for the scan.
        subdirectory (str, optional): Optional subdirectory to include in the path
                                     (e.g., "compliance", "threatscore", "ens").

    Returns:
        str: The constructed path with directory created.

    Example:
        >>> _build_output_path("/tmp", "aws", "tenant-1234", "scan-5678")
        '/tmp/tenant-1234/scan-5678/prowler-output-aws-20230215123456'
        >>> _build_output_path("/tmp", "aws", "tenant-1234", "scan-5678", "threatscore")
        '/tmp/tenant-1234/scan-5678/threatscore/prowler-output-aws-20230215123456'
    """
    # Sanitize the prowler provider name to ensure it is a valid directory name
    prowler_provider_sanitized = re.sub(r"[^\w\-]", "-", prowler_provider)

    with rls_transaction(tenant_id):
        started_at = Scan.objects.get(id=scan_id).started_at

    set_output_timestamp(started_at)

    timestamp = started_at.strftime("%Y%m%d%H%M%S")

    if subdirectory:
        path = (
            f"{output_directory}/{tenant_id}/{scan_id}/{subdirectory}/prowler-output-"
            f"{prowler_provider_sanitized}-{timestamp}"
        )
    else:
        path = (
            f"{output_directory}/{tenant_id}/{scan_id}/prowler-output-"
            f"{prowler_provider_sanitized}-{timestamp}"
        )

    # Create directory for the path if it doesn't exist
    os.makedirs("/".join(path.split("/")[:-1]), exist_ok=True)

    return path


def _generate_compliance_output_directory(
    output_directory: str,
    prowler_provider: str,
    tenant_id: str,
    scan_id: str,
    compliance_framework: str,
) -> str:
    """
    Generate a file system path for a compliance framework output directory.

    This function constructs the output directory path specifically for a compliance
    framework (e.g., "threatscore", "ens") by combining a base temporary output directory,
    the tenant ID, the scan ID, the compliance framework name, and details about the
    prowler provider along with a timestamp.

    Args:
        output_directory (str): The base output directory.
        prowler_provider (str): An identifier or descriptor for the prowler provider.
                               Typically, this is a string indicating the provider (e.g., "aws").
        tenant_id (str): The unique identifier for the tenant.
        scan_id (str): The unique identifier for the scan.
        compliance_framework (str): The compliance framework name (e.g., "threatscore", "ens").

    Returns:
        str: The path for the compliance framework output directory.

    Example:
        >>> _generate_compliance_output_directory("/tmp", "aws", "tenant-1234", "scan-5678", "threatscore")
        '/tmp/tenant-1234/scan-5678/threatscore/prowler-output-aws-20230215123456'
        >>> _generate_compliance_output_directory("/tmp", "aws", "tenant-1234", "scan-5678", "ens")
        '/tmp/tenant-1234/scan-5678/ens/prowler-output-aws-20230215123456'
        >>> _generate_compliance_output_directory("/tmp", "aws", "tenant-1234", "scan-5678", "nis2")
        '/tmp/tenant-1234/scan-5678/nis2/prowler-output-aws-20230215123456'
    """
    return _build_output_path(
        output_directory,
        prowler_provider,
        tenant_id,
        scan_id,
        subdirectory=compliance_framework,
    )


def _generate_output_directory(
    output_directory: str,
    prowler_provider: str,
    tenant_id: str,
    scan_id: str,
) -> tuple[str, str]:
    """
    Generate file system paths for the standard and compliance output directories of a prowler scan.

    This function constructs both the standard output directory path and the compliance
    output directory path by combining a base temporary output directory, the tenant ID,
    the scan ID, and details about the prowler provider along with a timestamp.

    Args:
        output_directory (str): The base output directory.
        prowler_provider (str): An identifier or descriptor for the prowler provider.
                               Typically, this is a string indicating the provider (e.g., "aws").
        tenant_id (str): The unique identifier for the tenant.
        scan_id (str): The unique identifier for the scan.

    Returns:
        tuple[str, str]: A tuple containing (standard_path, compliance_path).

    Example:
        >>> _generate_output_directory("/tmp", "aws", "tenant-1234", "scan-5678")
        ('/tmp/tenant-1234/scan-5678/prowler-output-aws-20230215123456',
         '/tmp/tenant-1234/scan-5678/compliance/prowler-output-aws-20230215123456')
    """
    standard_path = _build_output_path(
        output_directory, prowler_provider, tenant_id, scan_id
    )
    compliance_path = _build_output_path(
        output_directory,
        prowler_provider,
        tenant_id,
        scan_id,
        subdirectory="compliance",
    )

    return standard_path, compliance_path
```

--------------------------------------------------------------------------------

````
