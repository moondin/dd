---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 50
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 50 of 867)

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

---[FILE: threatscore.py]---
Location: prowler-master/api/src/backend/tasks/jobs/threatscore.py
Signals: Celery

```python
from celery.utils.log import get_task_logger
from tasks.jobs.threatscore_utils import (
    _aggregate_requirement_statistics_from_database,
    _calculate_requirements_data_from_statistics,
)

from api.db_router import READ_REPLICA_ALIAS
from api.db_utils import rls_transaction
from api.models import Provider, StatusChoices
from prowler.lib.check.compliance_models import Compliance

logger = get_task_logger(__name__)


def compute_threatscore_metrics(
    tenant_id: str,
    scan_id: str,
    provider_id: str,
    compliance_id: str,
    min_risk_level: int = 4,
) -> dict:
    """
    Compute ThreatScore metrics for a given scan.

    This function calculates all the metrics needed for a ThreatScore snapshot:
    - Overall ThreatScore percentage
    - Section-by-section scores
    - Critical failed requirements (risk >= min_risk_level)
    - Summary statistics (requirements and findings counts)

    Args:
        tenant_id (str): The tenant ID for Row-Level Security context.
        scan_id (str): The ID of the scan to analyze.
        provider_id (str): The ID of the provider used in the scan.
        compliance_id (str): Compliance framework ID (e.g., "prowler_threatscore_aws").
        min_risk_level (int): Minimum risk level for critical requirements. Defaults to 4.

    Returns:
        dict: A dictionary containing:
            - overall_score (float): Overall ThreatScore percentage (0-100)
            - section_scores (dict): Section name -> score percentage mapping
            - critical_requirements (list): List of critical failed requirement dicts
            - total_requirements (int): Total number of requirements
            - passed_requirements (int): Number of PASS requirements
            - failed_requirements (int): Number of FAIL requirements
            - manual_requirements (int): Number of MANUAL requirements
            - total_findings (int): Total findings count
            - passed_findings (int): Passed findings count
            - failed_findings (int): Failed findings count

    Example:
        >>> metrics = compute_threatscore_metrics(
        ...     tenant_id="tenant-123",
        ...     scan_id="scan-456",
        ...     provider_id="provider-789",
        ...     compliance_id="prowler_threatscore_aws"
        ... )
        >>> print(f"Overall ThreatScore: {metrics['overall_score']:.2f}%")
    """
    # Get provider and compliance information
    with rls_transaction(tenant_id, using=READ_REPLICA_ALIAS):
        provider_obj = Provider.objects.get(id=provider_id)
        provider_type = provider_obj.provider

        frameworks_bulk = Compliance.get_bulk(provider_type)
        compliance_obj = frameworks_bulk[compliance_id]

    # Aggregate requirement statistics from database
    requirement_statistics_by_check_id = (
        _aggregate_requirement_statistics_from_database(tenant_id, scan_id)
    )

    # Calculate requirements data using aggregated statistics
    attributes_by_requirement_id, requirements_list = (
        _calculate_requirements_data_from_statistics(
            compliance_obj, requirement_statistics_by_check_id
        )
    )

    # Initialize metrics
    overall_numerator = 0
    overall_denominator = 0
    overall_has_findings = False

    sections_data = {}

    total_requirements = len(requirements_list)
    passed_requirements = 0
    failed_requirements = 0
    manual_requirements = 0
    total_findings = 0
    passed_findings = 0
    failed_findings = 0

    critical_requirements_list = []

    # Process each requirement
    for requirement in requirements_list:
        requirement_id = requirement["id"]
        requirement_status = requirement["attributes"]["status"]
        requirement_attributes = attributes_by_requirement_id.get(requirement_id, {})

        # Count requirements by status
        if requirement_status == StatusChoices.PASS:
            passed_requirements += 1
        elif requirement_status == StatusChoices.FAIL:
            failed_requirements += 1
        elif requirement_status == StatusChoices.MANUAL:
            manual_requirements += 1

        # Get findings data
        req_passed_findings = requirement["attributes"].get("passed_findings", 0)
        req_total_findings = requirement["attributes"].get("total_findings", 0)

        # Accumulate findings counts
        total_findings += req_total_findings
        passed_findings += req_passed_findings
        failed_findings += req_total_findings - req_passed_findings

        # Skip requirements with no findings
        if req_total_findings == 0:
            continue

        overall_has_findings = True

        # Get requirement metadata
        metadata = requirement_attributes.get("attributes", {}).get(
            "req_attributes", []
        )
        if not metadata or len(metadata) == 0:
            continue

        m = metadata[0]
        risk_level = getattr(m, "LevelOfRisk", 0)
        weight = getattr(m, "Weight", 0)
        section = getattr(m, "Section", "Unknown")

        # Calculate ThreatScore components using formula from UI
        rate_i = req_passed_findings / req_total_findings
        rfac_i = 1 + 0.25 * risk_level

        # Update overall score
        overall_numerator += rate_i * req_total_findings * weight * rfac_i
        overall_denominator += req_total_findings * weight * rfac_i

        # Update section scores
        if section not in sections_data:
            sections_data[section] = {
                "numerator": 0,
                "denominator": 0,
                "has_findings": False,
            }

        sections_data[section]["has_findings"] = True
        sections_data[section]["numerator"] += (
            rate_i * req_total_findings * weight * rfac_i
        )
        sections_data[section]["denominator"] += req_total_findings * weight * rfac_i

        # Identify critical failed requirements
        if requirement_status == StatusChoices.FAIL and risk_level >= min_risk_level:
            critical_requirements_list.append(
                {
                    "requirement_id": requirement_id,
                    "title": getattr(m, "Title", "N/A"),
                    "section": section,
                    "subsection": getattr(m, "SubSection", "N/A"),
                    "risk_level": risk_level,
                    "weight": weight,
                    "passed_findings": req_passed_findings,
                    "total_findings": req_total_findings,
                    "description": getattr(m, "AttributeDescription", "N/A"),
                }
            )

    # Calculate overall ThreatScore
    if not overall_has_findings:
        overall_score = 100.0
    elif overall_denominator > 0:
        overall_score = (overall_numerator / overall_denominator) * 100
    else:
        overall_score = 0.0

    # Calculate section scores
    section_scores = {}
    for section, data in sections_data.items():
        if data["has_findings"] and data["denominator"] > 0:
            section_scores[section] = (data["numerator"] / data["denominator"]) * 100
        else:
            section_scores[section] = 100.0

    # Sort critical requirements by risk level (desc) and weight (desc)
    critical_requirements_list.sort(
        key=lambda x: (x["risk_level"], x["weight"]), reverse=True
    )

    logger.info(
        f"ThreatScore computed: {overall_score:.2f}% "
        f"({passed_requirements}/{total_requirements} requirements passed, "
        f"{len(critical_requirements_list)} critical failures)"
    )

    return {
        "overall_score": round(overall_score, 2),
        "section_scores": {k: round(v, 2) for k, v in section_scores.items()},
        "critical_requirements": critical_requirements_list,
        "total_requirements": total_requirements,
        "passed_requirements": passed_requirements,
        "failed_requirements": failed_requirements,
        "manual_requirements": manual_requirements,
        "total_findings": total_findings,
        "passed_findings": passed_findings,
        "failed_findings": failed_findings,
    }
```

--------------------------------------------------------------------------------

---[FILE: threatscore_utils.py]---
Location: prowler-master/api/src/backend/tasks/jobs/threatscore_utils.py
Signals: Django, Celery

```python
from collections import defaultdict

from celery.utils.log import get_task_logger
from config.django.base import DJANGO_FINDINGS_BATCH_SIZE
from django.db.models import Count, Q
from tasks.utils import batched

from api.db_router import READ_REPLICA_ALIAS
from api.db_utils import rls_transaction
from api.models import Finding, StatusChoices
from prowler.lib.outputs.finding import Finding as FindingOutput

logger = get_task_logger(__name__)


def _aggregate_requirement_statistics_from_database(
    tenant_id: str, scan_id: str
) -> dict[str, dict[str, int]]:
    """
    Aggregate finding statistics by check_id using database aggregation.

    This function uses Django ORM aggregation to calculate pass/fail statistics
    entirely in the database, avoiding the need to load findings into memory.

    Args:
        tenant_id (str): The tenant ID for Row-Level Security context.
        scan_id (str): The ID of the scan to retrieve findings for.

    Returns:
        dict[str, dict[str, int]]: Dictionary mapping check_id to statistics:
            - 'passed' (int): Number of passed findings for this check
            - 'total' (int): Total number of findings for this check

    Example:
        {
            'aws_iam_user_mfa_enabled': {'passed': 10, 'total': 15},
            'aws_s3_bucket_public_access': {'passed': 0, 'total': 5}
        }
    """
    requirement_statistics_by_check_id = {}

    with rls_transaction(tenant_id, using=READ_REPLICA_ALIAS):
        aggregated_statistics_queryset = (
            Finding.all_objects.filter(
                tenant_id=tenant_id, scan_id=scan_id, muted=False
            )
            .values("check_id")
            .annotate(
                total_findings=Count(
                    "id",
                    filter=Q(status__in=[StatusChoices.PASS, StatusChoices.FAIL]),
                ),
                passed_findings=Count("id", filter=Q(status=StatusChoices.PASS)),
            )
        )

        for aggregated_stat in aggregated_statistics_queryset:
            check_id = aggregated_stat["check_id"]
            requirement_statistics_by_check_id[check_id] = {
                "passed": aggregated_stat["passed_findings"],
                "total": aggregated_stat["total_findings"],
            }

    logger.info(
        f"Aggregated statistics for {len(requirement_statistics_by_check_id)} unique checks"
    )
    return requirement_statistics_by_check_id


def _calculate_requirements_data_from_statistics(
    compliance_obj, requirement_statistics_by_check_id: dict[str, dict[str, int]]
) -> tuple[dict[str, dict], list[dict]]:
    """
    Calculate requirement status and statistics using pre-aggregated database statistics.

    Args:
        compliance_obj: The compliance framework object containing requirements.
        requirement_statistics_by_check_id (dict[str, dict[str, int]]): Pre-aggregated statistics
            mapping check_id to {'passed': int, 'total': int} counts.

    Returns:
        tuple[dict[str, dict], list[dict]]: A tuple containing:
            - attributes_by_requirement_id: Dictionary mapping requirement IDs to their attributes.
            - requirements_list: List of requirement dictionaries with status and statistics.
    """
    attributes_by_requirement_id = {}
    requirements_list = []

    compliance_framework = getattr(compliance_obj, "Framework", "N/A")
    compliance_version = getattr(compliance_obj, "Version", "N/A")

    for requirement in compliance_obj.Requirements:
        requirement_id = requirement.Id
        requirement_description = getattr(requirement, "Description", "")
        requirement_checks = getattr(requirement, "Checks", [])
        requirement_attributes = getattr(requirement, "Attributes", [])

        attributes_by_requirement_id[requirement_id] = {
            "attributes": {
                "req_attributes": requirement_attributes,
                "checks": requirement_checks,
            },
            "description": requirement_description,
        }

        total_passed_findings = 0
        total_findings_count = 0

        for check_id in requirement_checks:
            if check_id in requirement_statistics_by_check_id:
                check_statistics = requirement_statistics_by_check_id[check_id]
                total_findings_count += check_statistics["total"]
                total_passed_findings += check_statistics["passed"]

        if total_findings_count > 0:
            if total_passed_findings == total_findings_count:
                requirement_status = StatusChoices.PASS
            else:
                requirement_status = StatusChoices.FAIL
        else:
            requirement_status = StatusChoices.MANUAL

        requirements_list.append(
            {
                "id": requirement_id,
                "attributes": {
                    "framework": compliance_framework,
                    "version": compliance_version,
                    "status": requirement_status,
                    "description": requirement_description,
                    "passed_findings": total_passed_findings,
                    "total_findings": total_findings_count,
                },
            }
        )

    return attributes_by_requirement_id, requirements_list


def _load_findings_for_requirement_checks(
    tenant_id: str,
    scan_id: str,
    check_ids: list[str],
    prowler_provider,
    findings_cache: dict[str, list[FindingOutput]] | None = None,
) -> dict[str, list[FindingOutput]]:
    """
    Load findings for specific check IDs on-demand with optional caching.

    This function loads only the findings needed for a specific set of checks,
    minimizing memory usage by avoiding loading all findings at once. This is used
    when generating detailed findings tables for specific requirements in the PDF.

    Supports optional caching to avoid duplicate queries when generating multiple
    reports for the same scan.

    Args:
        tenant_id (str): The tenant ID for Row-Level Security context.
        scan_id (str): The ID of the scan to retrieve findings for.
        check_ids (list[str]): List of check IDs to load findings for.
        prowler_provider: The initialized Prowler provider instance.
        findings_cache (dict, optional): Cache of already loaded findings.
            If provided, checks are first looked up in cache before querying database.

    Returns:
        dict[str, list[FindingOutput]]: Dictionary mapping check_id to list of FindingOutput objects.

    Example:
        {
            'aws_iam_user_mfa_enabled': [FindingOutput(...), FindingOutput(...)],
            'aws_s3_bucket_public_access': [FindingOutput(...)]
        }
    """
    findings_by_check_id = defaultdict(list)

    if not check_ids:
        return dict(findings_by_check_id)

    # Initialize cache if not provided
    if findings_cache is None:
        findings_cache = {}

    # Separate cached and non-cached check_ids
    check_ids_to_load = []
    cache_hits = 0
    cache_misses = 0

    for check_id in check_ids:
        if check_id in findings_cache:
            # Reuse from cache
            findings_by_check_id[check_id] = findings_cache[check_id]
            cache_hits += 1
        else:
            # Need to load from database
            check_ids_to_load.append(check_id)
            cache_misses += 1

    if cache_hits > 0:
        logger.info(
            f"Findings cache: {cache_hits} hits, {cache_misses} misses "
            f"({cache_hits / (cache_hits + cache_misses) * 100:.1f}% hit rate)"
        )

    # If all check_ids were in cache, return early
    if not check_ids_to_load:
        return dict(findings_by_check_id)

    logger.info(f"Loading findings for {len(check_ids_to_load)} checks on-demand")

    findings_queryset = (
        Finding.all_objects.filter(
            tenant_id=tenant_id, scan_id=scan_id, check_id__in=check_ids_to_load
        )
        .order_by("uid")
        .iterator()
    )

    with rls_transaction(tenant_id, using=READ_REPLICA_ALIAS):
        for batch, is_last_batch in batched(
            findings_queryset, DJANGO_FINDINGS_BATCH_SIZE
        ):
            for finding_model in batch:
                finding_output = FindingOutput.transform_api_finding(
                    finding_model, prowler_provider
                )
                findings_by_check_id[finding_output.check_id].append(finding_output)
                # Update cache with newly loaded findings
                if finding_output.check_id not in findings_cache:
                    findings_cache[finding_output.check_id] = []
                findings_cache[finding_output.check_id].append(finding_output)

    total_findings_loaded = sum(
        len(findings) for findings in findings_by_check_id.values()
    )
    logger.info(
        f"Loaded {total_findings_loaded} findings for {len(findings_by_check_id)} checks"
    )

    return dict(findings_by_check_id)
```

--------------------------------------------------------------------------------

---[FILE: test_backfill.py]---
Location: prowler-master/api/src/backend/tasks/tests/test_backfill.py

```python
from uuid import uuid4

import pytest
from tasks.jobs.backfill import (
    backfill_compliance_summaries,
    backfill_resource_scan_summaries,
    backfill_scan_category_summaries,
)

from api.models import (
    ComplianceOverviewSummary,
    Finding,
    ResourceScanSummary,
    Scan,
    ScanCategorySummary,
    StateChoices,
)
from prowler.lib.check.models import Severity
from prowler.lib.outputs.finding import Status


@pytest.fixture(scope="function")
def resource_scan_summary_data(scans_fixture):
    scan = scans_fixture[0]
    return ResourceScanSummary.objects.create(
        tenant_id=scan.tenant_id,
        scan_id=scan.id,
        resource_id=str(uuid4()),
        service="aws",
        region="us-east-1",
        resource_type="instance",
    )


@pytest.fixture(scope="function")
def get_not_completed_scans(providers_fixture):
    provider_id = providers_fixture[0].id
    tenant_id = providers_fixture[0].tenant_id
    scan_1 = Scan.objects.create(
        tenant_id=tenant_id,
        trigger=Scan.TriggerChoices.MANUAL,
        state=StateChoices.EXECUTING,
        provider_id=provider_id,
    )
    scan_2 = Scan.objects.create(
        tenant_id=tenant_id,
        trigger=Scan.TriggerChoices.MANUAL,
        state=StateChoices.AVAILABLE,
        provider_id=provider_id,
    )
    return scan_1, scan_2


@pytest.fixture(scope="function")
def findings_with_categories_fixture(scans_fixture, resources_fixture):
    scan = scans_fixture[0]
    resource = resources_fixture[0]

    finding = Finding.objects.create(
        tenant_id=scan.tenant_id,
        uid="finding_with_categories",
        scan=scan,
        delta="new",
        status=Status.FAIL,
        status_extended="test status",
        impact=Severity.critical,
        impact_extended="test impact",
        severity=Severity.critical,
        raw_result={"status": Status.FAIL},
        check_id="test_check",
        check_metadata={"CheckId": "test_check"},
        categories=["gen-ai", "security"],
        first_seen_at="2024-01-02T00:00:00Z",
    )
    finding.add_resources([resource])
    return finding


@pytest.fixture(scope="function")
def scan_category_summary_fixture(scans_fixture):
    scan = scans_fixture[0]
    return ScanCategorySummary.objects.create(
        tenant_id=scan.tenant_id,
        scan=scan,
        category="existing-category",
        severity=Severity.critical,
        total_findings=1,
        failed_findings=0,
        new_failed_findings=0,
    )


@pytest.mark.django_db
class TestBackfillResourceScanSummaries:
    def test_already_backfilled(self, resource_scan_summary_data):
        tenant_id = resource_scan_summary_data.tenant_id
        scan_id = resource_scan_summary_data.scan_id

        result = backfill_resource_scan_summaries(tenant_id, scan_id)

        assert result == {"status": "already backfilled"}

    def test_not_completed_scan(self, get_not_completed_scans):
        for scan_instance in get_not_completed_scans:
            tenant_id = scan_instance.tenant_id
            scan_id = scan_instance.id
            result = backfill_resource_scan_summaries(tenant_id, scan_id)

            assert result == {"status": "scan is not completed"}

    def test_successful_backfill_inserts_one_summary(
        self, resources_fixture, findings_fixture
    ):
        tenant_id = findings_fixture[0].tenant_id
        scan_id = findings_fixture[0].scan_id

        # This scan affects the first two resources
        resources = resources_fixture[:2]

        result = backfill_resource_scan_summaries(tenant_id, scan_id)
        assert result == {"status": "backfilled", "inserted": len(resources)}

        # Verify correct values
        summaries = ResourceScanSummary.objects.filter(
            tenant_id=tenant_id, scan_id=scan_id
        )
        assert summaries.count() == len(resources)
        for resource in resources:
            summary = summaries.get(resource_id=resource.id)
            assert summary.resource_id == resource.id
            assert summary.service == resource.service
            assert summary.region == resource.region
            assert summary.resource_type == resource.type

    def test_no_resources_to_backfill(self, scans_fixture):
        scan = scans_fixture[1]  # Failed scan with no findings/resources
        tenant_id = str(scan.tenant_id)
        scan_id = str(scan.id)

        result = backfill_resource_scan_summaries(tenant_id, scan_id)

        assert result == {"status": "no resources to backfill"}


@pytest.mark.django_db
class TestBackfillComplianceSummaries:
    def test_already_backfilled(self, scans_fixture):
        scan = scans_fixture[0]
        tenant_id = str(scan.tenant_id)
        ComplianceOverviewSummary.objects.create(
            tenant_id=scan.tenant_id,
            scan=scan,
            compliance_id="aws_account_security_onboarding_aws",
            requirements_passed=1,
            requirements_failed=0,
            requirements_manual=0,
            total_requirements=1,
        )

        result = backfill_compliance_summaries(tenant_id, str(scan.id))

        assert result == {"status": "already backfilled"}

    def test_not_completed_scan(self, get_not_completed_scans):
        for scan in get_not_completed_scans:
            result = backfill_compliance_summaries(str(scan.tenant_id), str(scan.id))
            assert result == {"status": "scan is not completed"}

    def test_no_compliance_data(self, scans_fixture):
        scan = scans_fixture[1]  # Failed scan with no compliance rows

        result = backfill_compliance_summaries(str(scan.tenant_id), str(scan.id))

        assert result == {"status": "no compliance data to backfill"}

    def test_backfill_creates_compliance_summaries(
        self, tenants_fixture, scans_fixture, compliance_requirements_overviews_fixture
    ):
        tenant = tenants_fixture[0]
        scan = scans_fixture[0]

        result = backfill_compliance_summaries(str(tenant.id), str(scan.id))

        expected = {
            "aws_account_security_onboarding_aws": {
                "requirements_passed": 1,
                "requirements_failed": 1,
                "requirements_manual": 1,
                "total_requirements": 3,
            },
            "cis_1.4_aws": {
                "requirements_passed": 0,
                "requirements_failed": 1,
                "requirements_manual": 0,
                "total_requirements": 1,
            },
            "mitre_attack_aws": {
                "requirements_passed": 0,
                "requirements_failed": 1,
                "requirements_manual": 0,
                "total_requirements": 1,
            },
        }

        assert result == {"status": "backfilled", "inserted": len(expected)}

        summaries = ComplianceOverviewSummary.objects.filter(
            tenant_id=str(tenant.id), scan_id=str(scan.id)
        )
        assert summaries.count() == len(expected)

        for summary in summaries:
            assert summary.compliance_id in expected
            expected_counts = expected[summary.compliance_id]
            assert summary.requirements_passed == expected_counts["requirements_passed"]
            assert summary.requirements_failed == expected_counts["requirements_failed"]
            assert summary.requirements_manual == expected_counts["requirements_manual"]
            assert summary.total_requirements == expected_counts["total_requirements"]


@pytest.mark.django_db
class TestBackfillScanCategorySummaries:
    def test_already_backfilled(self, scan_category_summary_fixture):
        tenant_id = scan_category_summary_fixture.tenant_id
        scan_id = scan_category_summary_fixture.scan_id

        result = backfill_scan_category_summaries(str(tenant_id), str(scan_id))

        assert result == {"status": "already backfilled"}

    def test_not_completed_scan(self, get_not_completed_scans):
        for scan in get_not_completed_scans:
            result = backfill_scan_category_summaries(str(scan.tenant_id), str(scan.id))
            assert result == {"status": "scan is not completed"}

    def test_no_categories_to_backfill(self, scans_fixture):
        scan = scans_fixture[1]  # Failed scan with no findings
        result = backfill_scan_category_summaries(str(scan.tenant_id), str(scan.id))
        assert result == {"status": "no categories to backfill"}

    def test_successful_backfill(self, findings_with_categories_fixture):
        finding = findings_with_categories_fixture
        tenant_id = str(finding.tenant_id)
        scan_id = str(finding.scan_id)

        result = backfill_scan_category_summaries(tenant_id, scan_id)

        # 2 categories × 1 severity = 2 rows
        assert result == {"status": "backfilled", "categories_count": 2}

        summaries = ScanCategorySummary.objects.filter(
            tenant_id=tenant_id, scan_id=scan_id
        )
        assert summaries.count() == 2
        categories = set(summaries.values_list("category", flat=True))
        assert categories == {"gen-ai", "security"}

        for summary in summaries:
            assert summary.severity == Severity.critical
            assert summary.total_findings == 1
            assert summary.failed_findings == 1
            assert summary.new_failed_findings == 1
```

--------------------------------------------------------------------------------

---[FILE: test_beat.py]---
Location: prowler-master/api/src/backend/tasks/tests/test_beat.py

```python
import json
from unittest.mock import patch

import pytest
from django_celery_beat.models import IntervalSchedule, PeriodicTask
from tasks.beat import schedule_provider_scan

from api.exceptions import ConflictException
from api.models import Scan


@pytest.mark.django_db
class TestScheduleProviderScan:
    def test_schedule_provider_scan_success(self, providers_fixture):
        provider_instance, *_ = providers_fixture

        with patch(
            "tasks.tasks.perform_scheduled_scan_task.apply_async"
        ) as mock_apply_async:
            assert Scan.all_objects.count() == 0
            result = schedule_provider_scan(provider_instance)

            assert result is not None
            assert Scan.all_objects.count() == 1

            mock_apply_async.assert_called_once_with(
                kwargs={
                    "tenant_id": str(provider_instance.tenant_id),
                    "provider_id": str(provider_instance.id),
                },
                countdown=5,
            )

            task_name = f"scan-perform-scheduled-{provider_instance.id}"
            periodic_task = PeriodicTask.objects.get(name=task_name)
            assert periodic_task is not None
            assert periodic_task.interval.every == 24
            assert periodic_task.interval.period == IntervalSchedule.HOURS
            assert periodic_task.task == "scan-perform-scheduled"
            assert json.loads(periodic_task.kwargs) == {
                "tenant_id": str(provider_instance.tenant_id),
                "provider_id": str(provider_instance.id),
            }

    def test_schedule_provider_scan_already_exists(self, providers_fixture):
        provider_instance, *_ = providers_fixture

        # First, schedule the scan
        with patch("tasks.tasks.perform_scheduled_scan_task.apply_async"):
            schedule_provider_scan(provider_instance)

        # Now, try scheduling again, should raise ConflictException
        with pytest.raises(ConflictException) as exc_info:
            schedule_provider_scan(provider_instance)

        assert "There is already a scheduled scan for this provider." in str(
            exc_info.value
        )

    def test_remove_periodic_task(self, providers_fixture):
        provider_instance = providers_fixture[0]

        assert Scan.objects.count() == 0
        with patch("tasks.tasks.perform_scheduled_scan_task.apply_async"):
            schedule_provider_scan(provider_instance)

        assert Scan.objects.count() == 1
        scan = Scan.objects.first()
        periodic_task = scan.scheduler_task
        assert periodic_task is not None

        periodic_task.delete()

        scan.refresh_from_db()
        # Assert the scan still exists but its scheduler_task is set to None
        # Otherwise, Scan.DoesNotExist would be raised
        assert Scan.objects.get(id=scan.id).scheduler_task is None
```

--------------------------------------------------------------------------------

---[FILE: test_connection.py]---
Location: prowler-master/api/src/backend/tasks/tests/test_connection.py

```python
import uuid
from datetime import datetime, timezone
from unittest.mock import MagicMock, patch

import pytest
from tasks.jobs.connection import (
    check_integration_connection,
    check_lighthouse_connection,
    check_provider_connection,
)

from api.models import Integration, LighthouseConfiguration, Provider


@pytest.mark.parametrize(
    "provider_data",
    [
        {"provider": "aws", "uid": "123456789012", "alias": "aws"},
    ],
)
@patch("tasks.jobs.connection.prowler_provider_connection_test")
@pytest.mark.django_db
def test_check_provider_connection(
    mock_provider_connection_test, tenants_fixture, provider_data
):
    provider = Provider.objects.create(**provider_data, tenant_id=tenants_fixture[0].id)

    mock_test_connection_result = MagicMock()
    mock_test_connection_result.is_connected = True

    mock_provider_connection_test.return_value = mock_test_connection_result

    check_provider_connection(
        provider_id=str(provider.id),
    )
    provider.refresh_from_db()

    mock_provider_connection_test.assert_called_once()
    assert provider.connected is True
    assert provider.connection_last_checked_at is not None
    assert provider.connection_last_checked_at <= datetime.now(tz=timezone.utc)


@patch("tasks.jobs.connection.Provider.objects.get")
@pytest.mark.django_db
def test_check_provider_connection_unsupported_provider(mock_provider_get):
    mock_provider_instance = MagicMock()
    mock_provider_instance.provider = "UNSUPPORTED_PROVIDER"
    mock_provider_get.return_value = mock_provider_instance

    with pytest.raises(
        ValueError, match="Provider type UNSUPPORTED_PROVIDER not supported"
    ):
        check_provider_connection("provider_id")


@patch("tasks.jobs.connection.Provider.objects.get")
@patch("tasks.jobs.connection.prowler_provider_connection_test")
@pytest.mark.django_db
def test_check_provider_connection_exception(
    mock_provider_connection_test, mock_provider_get
):
    mock_provider_instance = MagicMock()
    mock_provider_instance.provider = Provider.ProviderChoices.AWS.value
    mock_provider_get.return_value = mock_provider_instance

    mock_provider_connection_test.return_value = MagicMock()
    mock_provider_connection_test.return_value.is_connected = False
    mock_provider_connection_test.return_value.error = Exception()

    result = check_provider_connection(provider_id="provider_id")

    assert result["connected"] is False
    assert result["error"] is not None

    mock_provider_instance.save.assert_called_once()
    assert mock_provider_instance.connected is False


@pytest.mark.parametrize(
    "lighthouse_data",
    [
        {
            "name": "OpenAI",
            "api_key_decoded": "sk-test1234567890T3BlbkFJtest1234567890",
            "model": "gpt-4o",
            "temperature": 0,
            "max_tokens": 4000,
            "business_context": "Test business context",
            "is_active": True,
        },
    ],
)
@patch("tasks.jobs.connection.openai.OpenAI")
@pytest.mark.django_db
def test_check_lighthouse_connection(
    mock_openai_client, tenants_fixture, lighthouse_data
):
    lighthouse_config = LighthouseConfiguration.objects.create(
        **lighthouse_data, tenant_id=tenants_fixture[0].id
    )

    mock_models = MagicMock()
    mock_models.data = [MagicMock(id="gpt-4o"), MagicMock(id="gpt-4o-mini")]
    mock_openai_client.return_value.models.list.return_value = mock_models

    result = check_lighthouse_connection(
        lighthouse_config_id=str(lighthouse_config.id),
    )
    lighthouse_config.refresh_from_db()

    mock_openai_client.assert_called_once_with(
        api_key=lighthouse_data["api_key_decoded"]
    )
    assert lighthouse_config.is_active is True
    assert result["connected"] is True
    assert result["error"] is None
    assert result["available_models"] == ["gpt-4o", "gpt-4o-mini"]


@patch("tasks.jobs.connection.LighthouseConfiguration.objects.get")
@pytest.mark.django_db
def test_check_lighthouse_connection_missing_api_key(mock_lighthouse_get):
    mock_lighthouse_instance = MagicMock()
    mock_lighthouse_instance.api_key_decoded = None
    mock_lighthouse_get.return_value = mock_lighthouse_instance

    result = check_lighthouse_connection("lighthouse_config_id")

    assert result["connected"] is False
    assert result["error"] == "API key is invalid or missing."
    assert result["available_models"] == []
    assert mock_lighthouse_instance.is_active is False
    mock_lighthouse_instance.save.assert_called_once()


@pytest.mark.django_db
class TestCheckIntegrationConnection:
    def setup_method(self):
        self.integration_id = str(uuid.uuid4())

    @patch("tasks.jobs.connection.Integration.objects.filter")
    @patch("tasks.jobs.connection.prowler_integration_connection_test")
    def test_check_integration_connection_success(
        self, mock_prowler_test, mock_integration_filter
    ):
        """Test successful integration connection check with enabled=True filter."""
        mock_integration = MagicMock()
        mock_integration.id = self.integration_id
        mock_integration.integration_type = Integration.IntegrationChoices.AMAZON_S3

        mock_queryset = MagicMock()
        mock_queryset.first.return_value = mock_integration
        mock_integration_filter.return_value = mock_queryset

        mock_connection_result = MagicMock()
        mock_connection_result.is_connected = True
        mock_connection_result.error = None
        mock_prowler_test.return_value = mock_connection_result

        result = check_integration_connection(integration_id=self.integration_id)

        # Verify that Integration.objects.filter was called with enabled=True filter
        mock_integration_filter.assert_called_once_with(
            pk=self.integration_id, enabled=True
        )
        mock_queryset.first.assert_called_once()
        mock_prowler_test.assert_called_once_with(mock_integration)

        # Verify the integration properties were updated
        assert mock_integration.connected is True
        assert mock_integration.connection_last_checked_at is not None
        mock_integration.save.assert_called_once()

        # Verify the return value
        assert result["connected"] is True
        assert result["error"] is None

    @patch("tasks.jobs.connection.Integration.objects.filter")
    @patch("tasks.jobs.connection.prowler_integration_connection_test")
    def test_check_integration_connection_failure(
        self, mock_prowler_test, mock_integration_filter
    ):
        """Test failed integration connection check."""
        mock_integration = MagicMock()
        mock_integration.id = self.integration_id

        mock_queryset = MagicMock()
        mock_queryset.first.return_value = mock_integration
        mock_integration_filter.return_value = mock_queryset

        test_error = Exception("Connection failed")
        mock_connection_result = MagicMock()
        mock_connection_result.is_connected = False
        mock_connection_result.error = test_error
        mock_prowler_test.return_value = mock_connection_result

        result = check_integration_connection(integration_id=self.integration_id)

        # Verify that Integration.objects.filter was called with enabled=True filter
        mock_integration_filter.assert_called_once_with(
            pk=self.integration_id, enabled=True
        )
        mock_queryset.first.assert_called_once()

        # Verify the integration properties were updated
        assert mock_integration.connected is False
        assert mock_integration.connection_last_checked_at is not None
        mock_integration.save.assert_called_once()

        # Verify the return value
        assert result["connected"] is False
        assert result["error"] == str(test_error)

    @patch("tasks.jobs.connection.Integration.objects.filter")
    def test_check_integration_connection_not_enabled(self, mock_integration_filter):
        """Test that disabled integrations return proper error response."""
        # Mock that no enabled integration is found
        mock_queryset = MagicMock()
        mock_queryset.first.return_value = None
        mock_integration_filter.return_value = mock_queryset

        result = check_integration_connection(integration_id=self.integration_id)

        # Verify the filter was called with enabled=True
        mock_integration_filter.assert_called_once_with(
            pk=self.integration_id, enabled=True
        )
        mock_queryset.first.assert_called_once()

        # Verify the return value matches the expected error response
        assert result["connected"] is False
        assert result["error"] == "Integration is not enabled"

    @patch("tasks.jobs.connection.Integration.objects.filter")
    @patch("tasks.jobs.connection.prowler_integration_connection_test")
    def test_check_integration_connection_exception(
        self, mock_prowler_test, mock_integration_filter
    ):
        """Test integration connection check when prowler test raises exception."""
        mock_integration = MagicMock()
        mock_integration.id = self.integration_id

        mock_queryset = MagicMock()
        mock_queryset.first.return_value = mock_integration
        mock_integration_filter.return_value = mock_queryset

        test_exception = Exception("Unexpected error during connection test")
        mock_prowler_test.side_effect = test_exception

        with pytest.raises(Exception, match="Unexpected error during connection test"):
            check_integration_connection(integration_id=self.integration_id)

        # Verify that Integration.objects.filter was called with enabled=True filter
        mock_integration_filter.assert_called_once_with(
            pk=self.integration_id, enabled=True
        )
        mock_queryset.first.assert_called_once()
        mock_prowler_test.assert_called_once_with(mock_integration)
```

--------------------------------------------------------------------------------

````
