---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 24
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 24 of 867)

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

---[FILE: 6_dev_rbac.json]---
Location: prowler-master/api/src/backend/api/fixtures/dev/6_dev_rbac.json

```json
[
  {
    "model": "api.providergroup",
    "pk": "3fe28fb8-e545-424c-9b8f-69aff638f430",
    "fields": {
      "name": "first_group",
      "inserted_at": "2024-11-13T11:36:19.503Z",
      "updated_at": "2024-11-13T11:36:19.503Z",
      "tenant": "12646005-9067-4d2a-a098-8bb378604362"
    }
  },
  {
    "model": "api.providergroup",
    "pk": "525e91e7-f3f3-4254-bbc3-27ce1ade86b1",
    "fields": {
      "name": "second_group",
      "inserted_at": "2024-11-13T11:36:25.421Z",
      "updated_at": "2024-11-13T11:36:25.421Z",
      "tenant": "12646005-9067-4d2a-a098-8bb378604362"
    }
  },
  {
    "model": "api.providergroup",
    "pk": "481769f5-db2b-447b-8b00-1dee18db90ec",
    "fields": {
      "name": "third_group",
      "inserted_at": "2024-11-13T11:36:37.603Z",
      "updated_at": "2024-11-13T11:36:37.603Z",
      "tenant": "12646005-9067-4d2a-a098-8bb378604362"
    }
  },
  {
    "model": "api.providergroupmembership",
    "pk": "13625bd3-f428-4021-ac1b-b0bd41b6e02f",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "1b59e032-3eb6-4694-93a5-df84cd9b3ce2",
      "provider_group": "3fe28fb8-e545-424c-9b8f-69aff638f430",
      "inserted_at": "2024-11-13T11:55:17.138Z"
    }
  },
  {
    "model": "api.providergroupmembership",
    "pk": "54784ebe-42d2-4937-aa6a-e21c62879567",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "15fce1fa-ecaa-433f-a9dc-62553f3a2555",
      "provider_group": "3fe28fb8-e545-424c-9b8f-69aff638f430",
      "inserted_at": "2024-11-13T11:55:17.138Z"
    }
  },
  {
    "model": "api.providergroupmembership",
    "pk": "c8bd52d5-42a5-48fe-8e0a-3eef154b8ebe",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "provider": "15fce1fa-ecaa-433f-a9dc-62553f3a2555",
      "provider_group": "525e91e7-f3f3-4254-bbc3-27ce1ade86b1",
      "inserted_at": "2024-11-13T11:55:41.237Z"
    }
  },
  {
    "model": "api.role",
    "pk": "3f01e759-bdf9-4a99-8888-1ab805b79f93",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "name": "admin_test",
      "manage_users": true,
      "manage_account": true,
      "manage_billing": true,
      "manage_providers": true,
      "manage_integrations": true,
      "manage_scans": true,
      "unlimited_visibility": true,
      "inserted_at": "2024-11-20T15:32:42.402Z",
      "updated_at": "2024-11-20T15:32:42.402Z"
    }
  },
  {
    "model": "api.role",
    "pk": "845ff03a-87ef-42ba-9786-6577c70c4df0",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "name": "first_role",
      "manage_users": true,
      "manage_account": true,
      "manage_billing": true,
      "manage_providers": true,
      "manage_integrations": false,
      "manage_scans": false,
      "unlimited_visibility": true,
      "inserted_at": "2024-11-20T15:31:53.239Z",
      "updated_at": "2024-11-20T15:31:53.239Z"
    }
  },
  {
    "model": "api.role",
    "pk": "902d726c-4bd5-413a-a2a4-f7b4754b6b20",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "name": "third_role",
      "manage_users": false,
      "manage_account": false,
      "manage_billing": false,
      "manage_providers": false,
      "manage_integrations": false,
      "manage_scans": true,
      "unlimited_visibility": false,
      "inserted_at": "2024-11-20T15:34:05.440Z",
      "updated_at": "2024-11-20T15:34:05.440Z"
    }
  },
  {
    "model": "api.roleprovidergrouprelationship",
    "pk": "57fd024a-0a7f-49b4-a092-fa0979a07aaf",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "role": "3f01e759-bdf9-4a99-8888-1ab805b79f93",
      "provider_group": "3fe28fb8-e545-424c-9b8f-69aff638f430",
      "inserted_at": "2024-11-20T15:32:42.402Z"
    }
  },
  {
    "model": "api.roleprovidergrouprelationship",
    "pk": "a3cd0099-1c13-4df1-a5e5-ecdfec561b35",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "role": "3f01e759-bdf9-4a99-8888-1ab805b79f93",
      "provider_group": "481769f5-db2b-447b-8b00-1dee18db90ec",
      "inserted_at": "2024-11-20T15:32:42.402Z"
    }
  },
  {
    "model": "api.roleprovidergrouprelationship",
    "pk": "cfd84182-a058-40c2-af3c-0189b174940f",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "role": "3f01e759-bdf9-4a99-8888-1ab805b79f93",
      "provider_group": "525e91e7-f3f3-4254-bbc3-27ce1ade86b1",
      "inserted_at": "2024-11-20T15:32:42.402Z"
    }
  },
  {
    "model": "api.userrolerelationship",
    "pk": "92339663-e954-4fd8-98fb-8bfe15949975",
    "fields": {
      "tenant": "12646005-9067-4d2a-a098-8bb378604362",
      "role": "3f01e759-bdf9-4a99-8888-1ab805b79f93",
      "user": "8b38e2eb-6689-4f1e-a4ba-95b275130200",
      "inserted_at": "2024-11-20T15:36:14.302Z"
    }
  },
  {
    "model": "api.role",
    "pk": "a5b6c7d8-9e0f-1234-5678-90abcdef1234",
    "fields": {
      "tenant": "7c8f94a3-e2d1-4b3a-9f87-2c4d5e6f1a2b",
      "name": "e2e_admin",
      "manage_users": true,
      "manage_account": true,
      "manage_billing": true,
      "manage_providers": true,
      "manage_integrations": true,
      "manage_scans": true,
      "unlimited_visibility": true,
      "inserted_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  },
  {
    "model": "api.userrolerelationship",
    "pk": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
    "fields": {
      "tenant": "7c8f94a3-e2d1-4b3a-9f87-2c4d5e6f1a2b",
      "role": "a5b6c7d8-9e0f-1234-5678-90abcdef1234",
      "user": "6d4f8a91-3c2e-4b5a-8f7d-1e9c5b2a4d6f",
      "inserted_at": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: check_and_fix_socialaccount_sites_migration.py]---
Location: prowler-master/api/src/backend/api/management/commands/check_and_fix_socialaccount_sites_migration.py
Signals: Django

```python
from django.contrib.sites.models import Site
from django.core.management.base import BaseCommand
from django.db import DEFAULT_DB_ALIAS, connection, connections, transaction
from django.db.migrations.recorder import MigrationRecorder


def table_exists(table_name):
    with connection.cursor() as cursor:
        cursor.execute(
            """
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables
                    WHERE table_name = %s
                )
            """,
            [table_name],
        )
        return cursor.fetchone()[0]


class Command(BaseCommand):
    help = "Fix migration inconsistency between socialaccount and sites"

    def add_arguments(self, parser):
        parser.add_argument(
            "--database",
            default=DEFAULT_DB_ALIAS,
            help="Specifies the database to operate on.",
        )

    def handle(self, *args, **options):
        db = options["database"]
        connection = connections[db]
        recorder = MigrationRecorder(connection)

        applied = set(recorder.applied_migrations())

        has_social = ("socialaccount", "0001_initial") in applied

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'django_site'
                );
            """
            )
            site_table_exists = cursor.fetchone()[0]

        if has_social and not site_table_exists:
            self.stdout.write(
                f"Detected inconsistency in '{db}'. Creating 'django_site' table manually..."
            )

            with transaction.atomic(using=db):
                with connection.schema_editor() as schema_editor:
                    schema_editor.create_model(Site)

                recorder.record_applied("sites", "0001_initial")
                recorder.record_applied("sites", "0002_alter_domain_unique")

            self.stdout.write(
                "Fixed: 'django_site' table created and migrations registered."
            )

            # Ensure the relationship table also exists
            if not table_exists("socialaccount_socialapp_sites"):
                self.stdout.write(
                    "Detected missing 'socialaccount_socialapp_sites' table. Creating manually..."
                )
                with connection.schema_editor() as schema_editor:
                    from allauth.socialaccount.models import SocialApp

                    schema_editor.create_model(
                        SocialApp._meta.get_field("sites").remote_field.through
                    )
                self.stdout.write(
                    "Fixed: 'socialaccount_socialapp_sites' table created."
                )
```

--------------------------------------------------------------------------------

---[FILE: findings.py]---
Location: prowler-master/api/src/backend/api/management/commands/findings.py
Signals: Django

```python
import random
from datetime import datetime, timezone
from math import ceil
from uuid import uuid4

from django.core.management.base import BaseCommand
from tqdm import tqdm

from api.db_utils import rls_transaction
from api.models import (
    Finding,
    Provider,
    Resource,
    ResourceFindingMapping,
    ResourceScanSummary,
    Scan,
    StatusChoices,
)
from prowler.lib.check.models import CheckMetadata


class Command(BaseCommand):
    help = "Populates the database with test data for performance testing."

    def add_arguments(self, parser):
        parser.add_argument(
            "--tenant",
            type=str,
            required=True,
            help="Tenant id for which the data will be populated.",
        )
        parser.add_argument(
            "--resources",
            type=int,
            required=True,
            help="The number of resources to create.",
        )
        parser.add_argument(
            "--findings",
            type=int,
            required=True,
            help="The number of findings to create.",
        )
        parser.add_argument(
            "--batch", type=int, required=True, help="The batch size for bulk creation."
        )
        parser.add_argument(
            "--alias",
            type=str,
            required=False,
            help="Optional alias for the provider and scan",
        )

    def handle(self, *args, **options):
        tenant_id = options["tenant"]
        num_resources = options["resources"]
        num_findings = options["findings"]
        batch_size = options["batch"]
        alias = options["alias"] or "Testing"
        uid_token = str(uuid4())

        self.stdout.write(self.style.NOTICE("Starting data population"))
        self.stdout.write(self.style.NOTICE(f"\tTenant: {tenant_id}"))
        self.stdout.write(self.style.NOTICE(f"\tAlias: {alias}"))
        self.stdout.write(self.style.NOTICE(f"\tResources: {num_resources}"))
        self.stdout.write(self.style.NOTICE(f"\tFindings: {num_findings}"))
        self.stdout.write(self.style.NOTICE(f"\tBatch size: {batch_size}\n\n"))

        # Resource metadata
        possible_regions = [
            "us-east-1",
            "us-east-2",
            "us-west-1",
            "us-west-2",
            "ca-central-1",
            "eu-central-1",
            "eu-west-1",
            "eu-west-2",
            "eu-west-3",
            "ap-southeast-1",
            "ap-southeast-2",
            "ap-northeast-1",
            "ap-northeast-2",
            "ap-south-1",
            "sa-east-1",
        ]
        possible_services = []
        possible_types = []

        bulk_check_metadata = CheckMetadata.get_bulk(provider="aws")
        for check_metadata in bulk_check_metadata.values():
            if check_metadata.ServiceName not in possible_services:
                possible_services.append(check_metadata.ServiceName)
            if (
                check_metadata.ResourceType
                and check_metadata.ResourceType not in possible_types
            ):
                possible_types.append(check_metadata.ResourceType)

        with rls_transaction(tenant_id):
            provider, _ = Provider.all_objects.get_or_create(
                tenant_id=tenant_id,
                provider="aws",
                connected=True,
                uid=str(random.randint(100000000000, 999999999999)),
                defaults={
                    "alias": alias,
                },
            )

        with rls_transaction(tenant_id):
            scan = Scan.all_objects.create(
                tenant_id=tenant_id,
                provider=provider,
                name=alias,
                trigger="manual",
                state="executing",
                progress=0,
                started_at=datetime.now(timezone.utc),
            )
        scan_state = "completed"

        try:
            # Create resources
            resources = []

            for i in range(num_resources):
                resources.append(
                    Resource(
                        tenant_id=tenant_id,
                        provider_id=provider.id,
                        uid=f"testing-{uid_token}-{i}",
                        name=f"Testing {uid_token}-{i}",
                        region=random.choice(possible_regions),
                        service=random.choice(possible_services),
                        type=random.choice(possible_types),
                        inserted_at="2024-10-01T00:00:00Z",
                    )
                )

            num_batches = ceil(len(resources) / batch_size)
            self.stdout.write(self.style.WARNING("Creating resources..."))
            for i in tqdm(range(0, len(resources), batch_size), total=num_batches):
                with rls_transaction(tenant_id):
                    Resource.all_objects.bulk_create(resources[i : i + batch_size])
            self.stdout.write(self.style.SUCCESS("Resources created successfully.\n\n"))

            with rls_transaction(tenant_id):
                scan.progress = 33
                scan.save()

            # Create Findings
            findings = []
            possible_deltas = ["new", "changed", None]
            possible_severities = ["critical", "high", "medium", "low"]
            findings_resources_mapping = []

            for i in range(num_findings):
                severity = random.choice(possible_severities)
                check_id = random.randint(1, 1000)
                assigned_resource_num = random.randint(0, len(resources) - 1)
                assigned_resource = resources[assigned_resource_num]
                findings_resources_mapping.append(assigned_resource_num)

                findings.append(
                    Finding(
                        tenant_id=tenant_id,
                        scan=scan,
                        uid=f"testing-{uid_token}-{i}",
                        delta=random.choice(possible_deltas),
                        check_id=f"check-{check_id}",
                        status=random.choice(list(StatusChoices)),
                        severity=severity,
                        impact=severity,
                        raw_result={},
                        check_metadata={
                            "checktitle": f"Test title for check {check_id}",
                            "risk": f"Testing risk {uid_token}-{i}",
                            "provider": "aws",
                            "severity": severity,
                            "categories": ["category1", "category2", "category3"],
                            "description": "This is a random description that should not matter for testing purposes.",
                            "servicename": assigned_resource.service,
                            "resourcetype": assigned_resource.type,
                        },
                        resource_types=[assigned_resource.type],
                        resource_regions=[assigned_resource.region],
                        resource_services=[assigned_resource.service],
                        inserted_at="2024-10-01T00:00:00Z",
                    )
                )

            num_batches = ceil(len(findings) / batch_size)
            self.stdout.write(self.style.WARNING("Creating findings..."))
            for i in tqdm(range(0, len(findings), batch_size), total=num_batches):
                with rls_transaction(tenant_id):
                    Finding.all_objects.bulk_create(findings[i : i + batch_size])
            self.stdout.write(self.style.SUCCESS("Findings created successfully.\n\n"))

            with rls_transaction(tenant_id):
                scan.progress = 66
                scan.save()

            # Create ResourceFindingMapping
            mappings = []
            scan_resource_cache: set[tuple] = set()
            for index, finding_instance in enumerate(findings):
                resource_instance = resources[findings_resources_mapping[index]]
                mappings.append(
                    ResourceFindingMapping(
                        tenant_id=tenant_id,
                        resource=resource_instance,
                        finding=finding_instance,
                    )
                )
                scan_resource_cache.add(
                    (
                        str(resource_instance.id),
                        resource_instance.service,
                        resource_instance.region,
                        resource_instance.type,
                    )
                )

            num_batches = ceil(len(mappings) / batch_size)
            self.stdout.write(
                self.style.WARNING("Creating resource-finding mappings...")
            )
            for i in tqdm(range(0, len(mappings), batch_size), total=num_batches):
                with rls_transaction(tenant_id):
                    ResourceFindingMapping.objects.bulk_create(
                        mappings[i : i + batch_size]
                    )
            self.stdout.write(
                self.style.SUCCESS(
                    "Resource-finding mappings created successfully.\n\n"
                )
            )

            with rls_transaction(tenant_id):
                scan.progress = 99
                scan.save()

            self.stdout.write(self.style.WARNING("Creating finding filter values..."))
            resource_scan_summaries = [
                ResourceScanSummary(
                    tenant_id=tenant_id,
                    scan_id=str(scan.id),
                    resource_id=resource_id,
                    service=service,
                    region=region,
                    resource_type=resource_type,
                )
                for resource_id, service, region, resource_type in scan_resource_cache
            ]
            num_batches = ceil(len(resource_scan_summaries) / batch_size)
            with rls_transaction(tenant_id):
                for i in tqdm(
                    range(0, len(resource_scan_summaries), batch_size),
                    total=num_batches,
                ):
                    with rls_transaction(tenant_id):
                        ResourceScanSummary.objects.bulk_create(
                            resource_scan_summaries[i : i + batch_size],
                            ignore_conflicts=True,
                        )

            self.stdout.write(
                self.style.SUCCESS("Finding filter values created successfully.\n\n")
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to populate test data: {e}"))
            scan_state = "failed"
        finally:
            scan.completed_at = datetime.now(timezone.utc)
            scan.duration = int(
                (datetime.now(timezone.utc) - scan.started_at).total_seconds()
            )
            scan.progress = 100
            scan.state = scan_state
            scan.unique_resource_count = num_resources
            with rls_transaction(tenant_id):
                scan.save()

        self.stdout.write(self.style.NOTICE("Successfully populated test data."))
```

--------------------------------------------------------------------------------

````
