---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 57
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 57 of 867)

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

---[FILE: test_utils.py]---
Location: prowler-master/api/src/backend/tasks/tests/test_utils.py

```python
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
from django_celery_beat.models import IntervalSchedule, PeriodicTask
from django_celery_results.models import TaskResult
from tasks.utils import batched, get_next_execution_datetime


@pytest.mark.django_db
class TestGetNextExecutionDatetime:
    @pytest.fixture
    def setup_periodic_task(self, db):
        # Create a periodic task with an hourly interval
        interval = IntervalSchedule.objects.create(
            every=1, period=IntervalSchedule.HOURS
        )
        periodic_task = PeriodicTask.objects.create(
            name="scan-perform-scheduled-123",
            task="scan-perform-scheduled",
            interval=interval,
        )
        return periodic_task

    @pytest.fixture
    def setup_task_result(self, db):
        # Create a task result record
        task_result = TaskResult.objects.create(
            task_id="abc123",
            task_name="scan-perform-scheduled",
            status="SUCCESS",
            date_created=datetime.now(timezone.utc) - timedelta(hours=1),
            result="Success",
        )
        return task_result

    def test_get_next_execution_datetime_success(
        self, setup_task_result, setup_periodic_task
    ):
        task_result = setup_task_result
        periodic_task = setup_periodic_task

        # Mock periodic_task_name on TaskResult
        with patch.object(
            TaskResult, "periodic_task_name", return_value=periodic_task.name
        ):
            next_execution = get_next_execution_datetime(
                task_id=task_result.task_id, provider_id="123"
            )

        expected_time = task_result.date_created + timedelta(hours=1)
        assert next_execution == expected_time

    def test_get_next_execution_datetime_fallback_to_provider_id(
        self, setup_task_result, setup_periodic_task
    ):
        task_result = setup_task_result

        # Simulate the case where `periodic_task_name` is missing
        with patch.object(TaskResult, "periodic_task_name", return_value=None):
            next_execution = get_next_execution_datetime(
                task_id=task_result.task_id, provider_id="123"
            )

        expected_time = task_result.date_created + timedelta(hours=1)
        assert next_execution == expected_time

    def test_get_next_execution_datetime_periodic_task_does_not_exist(
        self, setup_task_result
    ):
        task_result = setup_task_result

        with pytest.raises(PeriodicTask.DoesNotExist):
            get_next_execution_datetime(
                task_id=task_result.task_id, provider_id="nonexistent"
            )


class TestBatchedFunction:
    def test_empty_iterable(self):
        result = list(batched([], 3))
        assert result == [([], True)]

    def test_exact_batches(self):
        result = list(batched([1, 2, 3, 4], 2))
        expected = [([1, 2], False), ([3, 4], False), ([], True)]
        assert result == expected

    def test_inexact_batches(self):
        result = list(batched([1, 2, 3, 4, 5], 2))
        expected = [([1, 2], False), ([3, 4], False), ([5], True)]
        assert result == expected

    def test_batch_size_one(self):
        result = list(batched([1, 2, 3], 1))
        expected = [([1], False), ([2], False), ([3], False), ([], True)]
        assert result == expected

    def test_batch_size_greater_than_length(self):
        result = list(batched([1, 2, 3], 5))
        expected = [([1, 2, 3], True)]
        assert result == expected
```

--------------------------------------------------------------------------------

---[FILE: test_simple.py]---
Location: prowler-master/api/tests/test_simple.py

```python
# for use with CI pipeline. Can be removed once other tests are added.
def test_always_passes():
    assert True
```

--------------------------------------------------------------------------------

---[FILE: benchmark.py]---
Location: prowler-master/api/tests/performance/benchmark.py

```python
#!/usr/bin/env python3
import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

plt.style.use("ggplot")


def run_locust(
    locust_file: str,
    host: str,
    users: int,
    hatch_rate: int,
    run_time: str,
    csv_prefix: Path,
) -> Path:
    artifacts_dir = Path("artifacts")
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    cmd = [
        "locust",
        "-f",
        f"scenarios/{locust_file}",
        "--headless",
        "-u",
        str(users),
        "-r",
        str(hatch_rate),
        "-t",
        run_time,
        "--host",
        host,
        "--csv",
        str(artifacts_dir / csv_prefix.name),
    ]
    print(f"Running Locust: {' '.join(cmd)}")
    process = subprocess.run(cmd)
    if process.returncode:
        sys.exit("Locust execution failed")

    stats_file = artifacts_dir / f"{csv_prefix.stem}_stats.csv"
    if not stats_file.exists():
        sys.exit(f"Stats CSV not found: {stats_file}")
    return stats_file


def load_percentiles(csv_path: Path) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    mapping = {"50%": "p50", "75%": "p75", "90%": "p90", "95%": "p95"}
    available = [col for col in mapping if col in df.columns]
    renamed = {col: mapping[col] for col in available}
    df = df.rename(columns=renamed).set_index("Name")[renamed.values()]
    return df.drop(index=["Aggregated"], errors="ignore")


def sanitize_label(label: str) -> str:
    text = re.sub(r"[^\w]+", "_", label.strip().lower())
    return text.strip("_")


def plot_multi_comparison(metrics: dict[str, pd.DataFrame]) -> None:
    common = sorted(set.intersection(*(set(df.index) for df in metrics.values())))
    percentiles = list(next(iter(metrics.values())).columns)
    groups = len(metrics)
    width = 0.8 / groups

    for endpoint in common:
        fig, ax = plt.subplots(figsize=(10, 5), dpi=100)
        for idx, (label, df) in enumerate(metrics.items()):
            series = df.loc[endpoint]
            positions = [
                i + (idx - groups / 2) * width + width / 2
                for i in range(len(percentiles))
            ]
            bars = ax.bar(positions, series.values, width, label=label)
            for bar in bars:
                height = bar.get_height()
                ax.annotate(
                    f"{int(height)}",
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),
                    textcoords="offset points",
                    ha="center",
                    va="bottom",
                    fontsize=8,
                )

        ax.set_xticks(range(len(percentiles)))
        ax.set_xticklabels(percentiles)
        ax.set_ylabel("Latency (ms)")
        ax.set_title(endpoint, fontsize=12)
        ax.grid(True, axis="y", linestyle="--", alpha=0.7)

        fig.tight_layout()
        fig.subplots_adjust(right=0.75)
        ax.legend(loc="center left", bbox_to_anchor=(1, 0.5), framealpha=0.9)

        output = Path("artifacts") / f"comparison_{sanitize_label(endpoint)}.png"
        plt.savefig(output)
        plt.close(fig)
        print(f"Saved chart: {output}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Locust and compare metrics")
    parser.add_argument("--locustfile", required=True, help="Locust file in scenarios/")
    parser.add_argument("--host", required=True, help="Target host URL")
    parser.add_argument(
        "--users", type=int, default=10, help="Number of simulated users"
    )
    parser.add_argument("--rate", type=int, default=1, help="Hatch rate per second")
    parser.add_argument("--time", default="1m", help="Test duration (e.g. 30s, 1m)")
    parser.add_argument(
        "--metrics-dir", default="baselines", help="Directory with CSV baselines"
    )
    parser.add_argument("--version", default="current", help="Test version")
    args = parser.parse_args()

    metrics_dir = Path(args.metrics_dir)
    os.makedirs(metrics_dir, exist_ok=True)

    metrics_data: dict[str, pd.DataFrame] = {}
    for csv_file in sorted(metrics_dir.glob("*.csv")):
        metrics_data[csv_file.stem] = load_percentiles(csv_file)

    current_prefix = Path(args.version)
    current_csv = run_locust(
        locust_file=args.locustfile,
        host=args.host,
        users=args.users,
        hatch_rate=args.rate,
        run_time=args.time,
        csv_prefix=current_prefix,
    )
    metrics_data[args.version] = load_percentiles(current_csv)

    for endpoint in sorted(
        set.intersection(*(set(df.index) for df in metrics_data.values()))
    ):
        parts = [endpoint]
        for label, df in metrics_data.items():
            s = df.loc[endpoint]
            parts.append(f"{label}: p50 {s.p50}, p75 {s.p75}, p90 {s.p90}, p95 {s.p95}")
        print(" | ".join(parts))

    plot_multi_comparison(metrics_data)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: prowler-master/api/tests/performance/requirements.txt

```text
locust==2.34.1
matplotlib==3.10.1
pandas==2.2.3
```

--------------------------------------------------------------------------------

---[FILE: compliance.py]---
Location: prowler-master/api/tests/performance/scenarios/compliance.py

```python
import random
from collections import defaultdict

import requests
from locust import events, task
from utils.helpers import APIUserBase, get_api_token, get_auth_headers

GLOBAL = {
    "token": None,
    "available_scans_info": {},
}
SUPPORTED_COMPLIANCE_IDS = {
    "aws": ["ens_rd2022", "cis_2.0", "prowler_threatscore", "soc2"],
    "gcp": ["ens_rd2022", "cis_2.0", "prowler_threatscore", "soc2"],
    "azure": ["ens_rd2022", "cis_2.0", "prowler_threatscore", "soc2"],
    "m365": ["cis_4.0", "iso27001_2022", "prowler_threatscore"],
}


def _get_random_scan() -> tuple:
    provider_type = random.choice(list(GLOBAL["available_scans_info"].keys()))
    scan_info = random.choice(GLOBAL["available_scans_info"][provider_type])
    return provider_type, scan_info


def _get_random_compliance_id(provider: str) -> str:
    return f"{random.choice(SUPPORTED_COMPLIANCE_IDS[provider])}_{provider}"


def _get_compliance_available_scans_by_provider_type(host: str, token: str) -> dict:
    excluded_providers = ["kubernetes"]

    response_dict = defaultdict(list)
    provider_response = requests.get(
        f"{host}/providers?fields[providers]=id,provider&filter[connected]=true",
        headers=get_auth_headers(token),
    )
    for provider in provider_response.json()["data"]:
        provider_id = provider["id"]
        provider_type = provider["attributes"]["provider"]
        if provider_type in excluded_providers:
            continue

        scan_response = requests.get(
            f"{host}/scans?fields[scans]=id&filter[provider]={provider_id}&filter[state]=completed",
            headers=get_auth_headers(token),
        )
        scan_data = scan_response.json()["data"]
        if not scan_data:
            continue
        scan_id = scan_data[0]["id"]
        response_dict[provider_type].append(scan_id)
    return response_dict


def _get_compliance_regions_from_scan(host: str, token: str, scan_id: str) -> list:
    response = requests.get(
        f"{host}/compliance-overviews/metadata?filter[scan_id]={scan_id}",
        headers=get_auth_headers(token),
    )
    assert response.status_code == 200, f"Failed to get scan: {response.text}"
    return response.json()["data"]["attributes"]["regions"]


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    GLOBAL["token"] = get_api_token(environment.host)
    scans_by_provider = _get_compliance_available_scans_by_provider_type(
        environment.host, GLOBAL["token"]
    )
    scan_info = defaultdict(list)
    for provider, scans in scans_by_provider.items():
        for scan in scans:
            scan_info[provider].append(
                {
                    "scan_id": scan,
                    "regions": _get_compliance_regions_from_scan(
                        environment.host, GLOBAL["token"], scan
                    ),
                }
            )
    GLOBAL["available_scans_info"] = scan_info


class APIUser(APIUserBase):
    def on_start(self):
        self.token = GLOBAL["token"]

    @task(3)
    def compliance_overviews_default(self):
        provider_type, scan_info = _get_random_scan()
        name = f"/compliance-overviews ({provider_type})"
        endpoint = f"/compliance-overviews?" f"filter[scan_id]={scan_info['scan_id']}"
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(2)
    def compliance_overviews_region(self):
        provider_type, scan_info = _get_random_scan()
        name = f"/compliance-overviews?filter[region] ({provider_type})"
        endpoint = (
            f"/compliance-overviews"
            f"?filter[scan_id]={scan_info['scan_id']}"
            f"&filter[region]={random.choice(scan_info['regions'])}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(2)
    def compliance_overviews_requirements(self):
        provider_type, scan_info = _get_random_scan()
        compliance_id = _get_random_compliance_id(provider_type)
        name = f"/compliance-overviews/requirements ({compliance_id})"
        endpoint = (
            f"/compliance-overviews/requirements"
            f"?filter[scan_id]={scan_info['scan_id']}"
            f"&filter[compliance_id]={compliance_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def compliance_overviews_attributes(self):
        provider_type, _ = _get_random_scan()
        compliance_id = _get_random_compliance_id(provider_type)
        name = f"/compliance-overviews/attributes ({compliance_id})"
        endpoint = (
            f"/compliance-overviews/attributes"
            f"?filter[compliance_id]={compliance_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)
```

--------------------------------------------------------------------------------

---[FILE: findings.py]---
Location: prowler-master/api/tests/performance/scenarios/findings.py

```python
from locust import events, task
from utils.config import (
    FINDINGS_UI_SORT_VALUES,
    L_PROVIDER_NAME,
    M_PROVIDER_NAME,
    S_PROVIDER_NAME,
    TARGET_INSERTED_AT,
)
from utils.helpers import (
    APIUserBase,
    get_api_token,
    get_auth_headers,
    get_next_resource_filter,
    get_resource_filters_pairs,
    get_scan_id_from_provider_name,
    get_sort_value,
)

GLOBAL = {
    "token": None,
    "scan_ids": {},
    "resource_filters": None,
    "large_resource_filters": None,
}


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    GLOBAL["token"] = get_api_token(environment.host)

    GLOBAL["scan_ids"]["small"] = get_scan_id_from_provider_name(
        environment.host, GLOBAL["token"], S_PROVIDER_NAME
    )
    GLOBAL["scan_ids"]["medium"] = get_scan_id_from_provider_name(
        environment.host, GLOBAL["token"], M_PROVIDER_NAME
    )
    GLOBAL["scan_ids"]["large"] = get_scan_id_from_provider_name(
        environment.host, GLOBAL["token"], L_PROVIDER_NAME
    )

    GLOBAL["resource_filters"] = get_resource_filters_pairs(
        environment.host, GLOBAL["token"]
    )
    GLOBAL["large_resource_filters"] = get_resource_filters_pairs(
        environment.host, GLOBAL["token"], GLOBAL["scan_ids"]["large"]
    )


class APIUser(APIUserBase):
    def on_start(self):
        self.token = GLOBAL["token"]
        self.s_scan_id = GLOBAL["scan_ids"]["small"]
        self.m_scan_id = GLOBAL["scan_ids"]["medium"]
        self.l_scan_id = GLOBAL["scan_ids"]["large"]
        self.available_resource_filters = GLOBAL["resource_filters"]
        self.available_resource_filters_large_scan = GLOBAL["large_resource_filters"]

    @task
    def findings_default(self):
        name = "/findings"
        page_number = self._next_page(name)
        endpoint = (
            f"/findings?page[number]={page_number}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
            f"&filter[inserted_at]={TARGET_INSERTED_AT}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def findings_default_include(self):
        name = "/findings?include"
        page = self._next_page(name)
        endpoint = (
            f"/findings?page[number]={page}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
            f"&filter[inserted_at]={TARGET_INSERTED_AT}"
            f"&include=scan.provider,resources"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def findings_metadata(self):
        endpoint = f"/findings/metadata?" f"filter[inserted_at]={TARGET_INSERTED_AT}"
        self.client.get(
            endpoint, headers=get_auth_headers(self.token), name="/findings/metadata"
        )

    @task
    def findings_scan_small(self):
        name = "/findings?filter[scan_id] - 50k"
        page_number = self._next_page(name)
        endpoint = (
            f"/findings?page[number]={page_number}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
            f"&filter[scan]={self.s_scan_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def findings_metadata_scan_small(self):
        endpoint = f"/findings/metadata?" f"&filter[scan]={self.s_scan_id}"
        self.client.get(
            endpoint,
            headers=get_auth_headers(self.token),
            name="/findings/metadata?filter[scan_id] - 50k",
        )

    @task(2)
    def findings_scan_medium(self):
        name = "/findings?filter[scan_id] - 250k"
        page_number = self._next_page(name)
        endpoint = (
            f"/findings?page[number]={page_number}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
            f"&filter[scan]={self.m_scan_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def findings_metadata_scan_medium(self):
        endpoint = f"/findings/metadata?" f"&filter[scan]={self.m_scan_id}"
        self.client.get(
            endpoint,
            headers=get_auth_headers(self.token),
            name="/findings/metadata?filter[scan_id] - 250k",
        )

    @task
    def findings_scan_large(self):
        name = "/findings?filter[scan_id] - 500k"
        page_number = self._next_page(name)
        endpoint = (
            f"/findings?page[number]={page_number}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
            f"&filter[scan]={self.l_scan_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def findings_scan_large_include(self):
        name = "/findings?filter[scan_id]&include - 500k"
        page_number = self._next_page(name)
        endpoint = (
            f"/findings?page[number]={page_number}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
            f"&filter[scan]={self.l_scan_id}"
            f"&include=scan.provider,resources"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def findings_metadata_scan_large(self):
        endpoint = f"/findings/metadata?" f"&filter[scan]={self.l_scan_id}"
        self.client.get(
            endpoint,
            headers=get_auth_headers(self.token),
            name="/findings/metadata?filter[scan_id] - 500k",
        )

    @task(2)
    def findings_resource_filter(self):
        name = "/findings?filter[resource_filter]&include"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = (
            f"/findings?filter[{filter_name}]={filter_value}"
            f"&filter[inserted_at]={TARGET_INSERTED_AT}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
            f"&include=scan.provider,resources"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def findings_metadata_resource_filter(self):
        name = "/findings/metadata?filter[resource_filter]"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = (
            f"/findings/metadata?filter[{filter_name}]={filter_value}"
            f"&filter[inserted_at]={TARGET_INSERTED_AT}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def findings_metadata_resource_filter_scan_large(self):
        name = "/findings/metadata?filter[resource_filter]&filter[scan_id] - 500k"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = (
            f"/findings/metadata?filter[{filter_name}]={filter_value}"
            f"&filter[scan]={self.l_scan_id}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(2)
    def findings_resource_filter_large_scan_include(self):
        name = "/findings?filter[resource_filter][scan]&include - 500k"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = (
            f"/findings?filter[{filter_name}]={filter_value}"
            f"&{get_sort_value(FINDINGS_UI_SORT_VALUES)}"
            f"&filter[scan]={self.l_scan_id}"
            f"&include=scan.provider,resources"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)
```

--------------------------------------------------------------------------------

---[FILE: resources.py]---
Location: prowler-master/api/tests/performance/scenarios/resources.py

```python
from locust import events, task
from utils.config import (
    L_PROVIDER_NAME,
    M_PROVIDER_NAME,
    RESOURCES_UI_FIELDS,
    S_PROVIDER_NAME,
    TARGET_INSERTED_AT,
)
from utils.helpers import (
    APIUserBase,
    get_api_token,
    get_auth_headers,
    get_dynamic_filters_pairs,
    get_next_resource_filter,
    get_scan_id_from_provider_name,
)

GLOBAL = {
    "token": None,
    "scan_ids": {},
    "resource_filters": None,
    "large_resource_filters": None,
}


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    GLOBAL["token"] = get_api_token(environment.host)

    GLOBAL["scan_ids"]["small"] = get_scan_id_from_provider_name(
        environment.host, GLOBAL["token"], S_PROVIDER_NAME
    )
    GLOBAL["scan_ids"]["medium"] = get_scan_id_from_provider_name(
        environment.host, GLOBAL["token"], M_PROVIDER_NAME
    )
    GLOBAL["scan_ids"]["large"] = get_scan_id_from_provider_name(
        environment.host, GLOBAL["token"], L_PROVIDER_NAME
    )

    GLOBAL["resource_filters"] = get_dynamic_filters_pairs(
        environment.host, GLOBAL["token"], "resources"
    )
    GLOBAL["large_resource_filters"] = get_dynamic_filters_pairs(
        environment.host, GLOBAL["token"], "resources", GLOBAL["scan_ids"]["large"]
    )


class APIUser(APIUserBase):
    def on_start(self):
        self.token = GLOBAL["token"]
        self.s_scan_id = GLOBAL["scan_ids"]["small"]
        self.m_scan_id = GLOBAL["scan_ids"]["medium"]
        self.l_scan_id = GLOBAL["scan_ids"]["large"]
        self.available_resource_filters = GLOBAL["resource_filters"]
        self.available_resource_filters_large_scan = GLOBAL["large_resource_filters"]

    @task
    def resources_default(self):
        name = "/resources"
        page_number = self._next_page(name)
        endpoint = (
            f"/resources?page[number]={page_number}"
            f"&filter[updated_at]={TARGET_INSERTED_AT}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def resources_default_ui_fields(self):
        name = "/resources?fields"
        page_number = self._next_page(name)
        endpoint = (
            f"/resources?page[number]={page_number}"
            f"&fields[resources]={','.join(RESOURCES_UI_FIELDS)}"
            f"&filter[updated_at]={TARGET_INSERTED_AT}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def resources_default_include(self):
        name = "/resources?include"
        page = self._next_page(name)
        endpoint = (
            f"/resources?page[number]={page}"
            f"&filter[updated_at]={TARGET_INSERTED_AT}"
            f"&include=provider"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def resources_metadata(self):
        name = "/resources/metadata"
        endpoint = f"/resources/metadata?filter[updated_at]={TARGET_INSERTED_AT}"
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def resources_scan_small(self):
        name = "/resources?filter[scan_id] - 50k"
        page_number = self._next_page(name)
        endpoint = (
            f"/resources?page[number]={page_number}" f"&filter[scan]={self.s_scan_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def resources_metadata_scan_small(self):
        name = "/resources/metadata?filter[scan_id] - 50k"
        endpoint = f"/resources/metadata?&filter[scan]={self.s_scan_id}"
        self.client.get(
            endpoint,
            headers=get_auth_headers(self.token),
            name=name,
        )

    @task(2)
    def resources_scan_medium(self):
        name = "/resources?filter[scan_id] - 250k"
        page_number = self._next_page(name)
        endpoint = (
            f"/resources?page[number]={page_number}" f"&filter[scan]={self.m_scan_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def resources_metadata_scan_medium(self):
        name = "/resources/metadata?filter[scan_id] - 250k"
        endpoint = f"/resources/metadata?&filter[scan]={self.m_scan_id}"
        self.client.get(
            endpoint,
            headers=get_auth_headers(self.token),
            name=name,
        )

    @task
    def resources_scan_large(self):
        name = "/resources?filter[scan_id] - 500k"
        page_number = self._next_page(name)
        endpoint = (
            f"/resources?page[number]={page_number}" f"&filter[scan]={self.l_scan_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def resources_scan_large_include(self):
        name = "/resources?filter[scan_id]&include - 500k"
        page_number = self._next_page(name)
        endpoint = (
            f"/resources?page[number]={page_number}"
            f"&filter[scan]={self.l_scan_id}"
            f"&include=provider"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task
    def resources_metadata_scan_large(self):
        endpoint = f"/resources/metadata?&filter[scan]={self.l_scan_id}"
        self.client.get(
            endpoint,
            headers=get_auth_headers(self.token),
            name="/resources/metadata?filter[scan_id] - 500k",
        )

    @task(2)
    def resources_filters(self):
        name = "/resources?filter[resource_filter]&include"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = (
            f"/resources?filter[{filter_name}]={filter_value}"
            f"&filter[updated_at]={TARGET_INSERTED_AT}"
            f"&include=provider"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def resources_metadata_filters(self):
        name = "/resources/metadata?filter[resource_filter]"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = (
            f"/resources/metadata?filter[{filter_name}]={filter_value}"
            f"&filter[updated_at]={TARGET_INSERTED_AT}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def resources_metadata_filters_scan_large(self):
        name = "/resources/metadata?filter[resource_filter]&filter[scan_id] - 500k"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = (
            f"/resources/metadata?filter[{filter_name}]={filter_value}"
            f"&filter[scan]={self.l_scan_id}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(2)
    def resourcess_filter_large_scan_include(self):
        name = "/resources?filter[resource_filter][scan]&include - 500k"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = (
            f"/resources?filter[{filter_name}]={filter_value}"
            f"&filter[scan]={self.l_scan_id}"
            f"&include=provider"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def resources_latest_default_ui_fields(self):
        name = "/resources/latest?fields"
        page_number = self._next_page(name)
        endpoint = (
            f"/resources/latest?page[number]={page_number}"
            f"&fields[resources]={','.join(RESOURCES_UI_FIELDS)}"
        )
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)

    @task(3)
    def resources_latest_metadata_filters(self):
        name = "/resources/metadata/latest?filter[resource_filter]"
        filter_name, filter_value = get_next_resource_filter(
            self.available_resource_filters
        )

        endpoint = f"/resources/metadata/latest?filter[{filter_name}]={filter_value}"
        self.client.get(endpoint, headers=get_auth_headers(self.token), name=name)
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: prowler-master/api/tests/performance/utils/config.py

```python
import os

USER_EMAIL = os.environ.get("USER_EMAIL")
USER_PASSWORD = os.environ.get("USER_PASSWORD")

BASE_HEADERS = {"Content-Type": "application/vnd.api+json"}

FINDINGS_UI_SORT_VALUES = ["severity", "status", "-inserted_at"]
TARGET_INSERTED_AT = os.environ.get("TARGET_INSERTED_AT", "2025-04-22")

FINDINGS_RESOURCE_METADATA = {
    "regions": "region",
    "resource_types": "resource_type",
    "services": "service",
}
RESOURCE_METADATA = {
    "regions": "region",
    "types": "type",
    "services": "service",
}

RESOURCES_UI_FIELDS = [
    "name",
    "failed_findings_count",
    "region",
    "service",
    "type",
    "provider",
    "inserted_at",
    "updated_at",
    "uid",
]

S_PROVIDER_NAME = "provider-50k"
M_PROVIDER_NAME = "provider-250k"
L_PROVIDER_NAME = "provider-500k"
```

--------------------------------------------------------------------------------

---[FILE: helpers.py]---
Location: prowler-master/api/tests/performance/utils/helpers.py

```python
import random
from collections import defaultdict
from threading import Lock

import requests
from locust import HttpUser, between
from utils.config import (
    BASE_HEADERS,
    FINDINGS_RESOURCE_METADATA,
    RESOURCE_METADATA,
    TARGET_INSERTED_AT,
    USER_EMAIL,
    USER_PASSWORD,
)

_global_page_counters = defaultdict(int)
_page_lock = Lock()


class APIUserBase(HttpUser):
    """
    Base class for API user simulation in Locust performance tests.

    Attributes:
        abstract (bool): Indicates this is an abstract user class.
        wait_time: Time between task executions, randomized between 1 and 5 seconds.
    """

    abstract = True
    wait_time = between(1, 5)

    def _next_page(self, endpoint_name: str) -> int:
        """
        Returns the next page number for a given endpoint. Thread-safe.

        Args:
            endpoint_name (str): Name of the API endpoint being paginated.

        Returns:
            int: The next page number for the given endpoint.
        """
        with _page_lock:
            _global_page_counters[endpoint_name] += 1
            return _global_page_counters[endpoint_name]


def get_next_resource_filter(available_values: dict) -> tuple:
    """
    Randomly selects a filter type and value from available options.

    Args:
        available_values (dict): Dictionary with filter types as keys and list of possible values.

    Returns:
        tuple: A (filter_type, filter_value) pair randomly selected.
    """
    filter_type = random.choice(list(available_values.keys()))
    filter_value = random.choice(available_values[filter_type])
    return filter_type, filter_value


def get_auth_headers(token: str) -> dict:
    """
    Returns the headers for the API requests.

    Args:
        token (str): The token to be included in the headers.

    Returns:
        dict: The headers for the API requests.
    """
    return {
        "Authorization": f"Bearer {token}",
        **BASE_HEADERS,
    }


def get_api_token(host: str) -> str:
    """
    Authenticates with the API and retrieves a bearer token.

    Args:
        host (str): The host URL of the API.

    Returns:
        str: The access token for authenticated requests.

    Raises:
        AssertionError: If the request fails or does not return a 200 status code.
    """
    login_payload = {
        "data": {
            "type": "tokens",
            "attributes": {"email": USER_EMAIL, "password": USER_PASSWORD},
        }
    }
    response = requests.post(f"{host}/tokens", json=login_payload, headers=BASE_HEADERS)
    assert response.status_code == 200, f"Failed to get token: {response.text}"
    return response.json()["data"]["attributes"]["access"]


def get_scan_id_from_provider_name(host: str, token: str, provider_name: str) -> str:
    """
    Retrieves the scan ID associated with a specific provider name.

    Args:
        host (str): The host URL of the API.
        token (str): Bearer token for authentication.
        provider_name (str): Name of the provider to filter scans by.

    Returns:
        str: The ID of the scan.

    Raises:
        AssertionError: If the request fails or does not return a 200 status code.
    """
    response = requests.get(
        f"{host}/scans?fields[scans]=id&filter[provider_alias]={provider_name}",
        headers=get_auth_headers(token),
    )
    assert response.status_code == 200, f"Failed to get scan: {response.text}"
    return response.json()["data"][0]["id"]


def get_dynamic_filters_pairs(
    host: str, token: str, endpoint: str, scan_id: str = ""
) -> dict:
    """
    Retrieves and maps metadata filter values from a given endpoint.

    Args:
        host (str): The host URL of the API.
        token (str): Bearer token for authentication.
        endpoint (str): The API endpoint to query for metadata.
        scan_id (str, optional): Optional scan ID to filter metadata. Defaults to using inserted_at timestamp.

    Returns:
        dict: A dictionary of resource filter metadata.

    Raises:
        AssertionError: If the request fails or does not return a 200 status code.
    """
    metadata_mapping = (
        FINDINGS_RESOURCE_METADATA if endpoint == "findings" else RESOURCE_METADATA
    )
    date_filter = "inserted_at" if endpoint == "findings" else "updated_at"
    metadata_filters = (
        f"filter[scan]={scan_id}"
        if scan_id
        else f"filter[{date_filter}]={TARGET_INSERTED_AT}"
    )
    response = requests.get(
        f"{host}/{endpoint}/metadata?{metadata_filters}",
        headers=get_auth_headers(token),
    )
    assert (
        response.status_code == 200
    ), f"Failed to get resource filters values: {response.text}"
    attributes = response.json()["data"]["attributes"]

    return {
        metadata_mapping[key]: values
        for key, values in attributes.items()
        if key in metadata_mapping.keys()
    }


def get_sort_value(sort_values: list) -> str:
    """
    Constructs a sort query string from a list of sort keys.

    Args:
        sort_values (list): The list of sort values to include in the query.

    Returns:
        str: A formatted sort query string (e.g., "sort=created_at,-severity").
    """
    return f"sort={','.join(sort_values)}"
```

--------------------------------------------------------------------------------

````
