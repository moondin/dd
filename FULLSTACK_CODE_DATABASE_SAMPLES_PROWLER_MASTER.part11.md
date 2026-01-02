---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 11
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 11 of 867)

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

---[FILE: ui-tests.yml]---
Location: prowler-master/.github/workflows/ui-tests.yml

```yaml
name: 'UI: Tests'

on:
  push:
    branches:
      - 'master'
      - 'v5.*'
  pull_request:
    branches:
      - 'master'
      - 'v5.*'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  UI_WORKING_DIR: ./ui
  NODE_VERSION: '20.x'

jobs:
  ui-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: read
    defaults:
      run:
        working-directory: ./ui

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check for UI changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ui/**
            .github/workflows/ui-tests.yml
          files_ignore: |
            ui/CHANGELOG.md
            ui/README.md

      - name: Setup Node.js ${{ env.NODE_VERSION }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903 # v6.0.0
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: pnpm/action-setup@v4
        with:
          version: 10
          run_install: false

      - name: Get pnpm store directory
        if: steps.check-changes.outputs.any_changed == 'true'
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('ui/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        if: steps.check-changes.outputs.any_changed == 'true'
        run: pnpm install --frozen-lockfile

      - name: Run healthcheck
        if: steps.check-changes.outputs.any_changed == 'true'
        run: pnpm run healthcheck

      - name: Build application
        if: steps.check-changes.outputs.any_changed == 'true'
        run: pnpm run build
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: prowler-master/api/.env.example

```text
# Django settings
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DJANGO_BIND_ADDRESS=0.0.0.0
DJANGO_PORT=8000
DJANGO_DEBUG=False
# Select one of [production|devel]
DJANGO_SETTINGS_MODULE=config.django.[production|devel]
# Select one of [ndjson|human_readable]
DJANGO_LOGGING_FORMATTER=[ndjson|human_readable]
# Select one of [DEBUG|INFO|WARNING|ERROR|CRITICAL]
# Applies to both Django and Celery Workers
DJANGO_LOGGING_LEVEL=INFO
DJANGO_WORKERS=4 # Defaults to the maximum available based on CPU cores if not set.
DJANGO_TOKEN_SIGNING_KEY=""
DJANGO_TOKEN_VERIFYING_KEY=""
# Token lifetime is in minutes
DJANGO_ACCESS_TOKEN_LIFETIME=30
DJANGO_REFRESH_TOKEN_LIFETIME=1440
DJANGO_CACHE_MAX_AGE=3600
DJANGO_STALE_WHILE_REVALIDATE=60
DJANGO_SECRETS_ENCRYPTION_KEY=""
# Throttle, two options: Empty means no throttle; or if desired use one in DRF format: https://www.django-rest-framework.org/api-guide/throttling/#setting-the-throttling-policy
DJANGO_THROTTLE_TOKEN_OBTAIN=50/minute
# Decide whether to allow Django manage database table partitions
DJANGO_MANAGE_DB_PARTITIONS=[True|False]
DJANGO_CELERY_DEADLOCK_ATTEMPTS=5
DJANGO_BROKER_VISIBILITY_TIMEOUT=86400
DJANGO_SENTRY_DSN=

# PostgreSQL settings
# If running django and celery on host, use 'localhost', else use 'postgres-db'
POSTGRES_HOST=[localhost|postgres-db]
POSTGRES_PORT=5432
POSTGRES_ADMIN_USER=prowler
POSTGRES_ADMIN_PASSWORD=S3cret
POSTGRES_USER=prowler_user
POSTGRES_PASSWORD=S3cret
POSTGRES_DB=prowler_db

# Valkey settings
# If running django and celery on host, use localhost, else use 'valkey'
VALKEY_HOST=[localhost|valkey]
VALKEY_PORT=6379
VALKEY_DB=0

# Sentry settings
SENTRY_ENVIRONMENT=local
SENTRY_RELEASE=local

# Social login credentials
DJANGO_GOOGLE_OAUTH_CLIENT_ID=""
DJANGO_GOOGLE_OAUTH_CLIENT_SECRET=""
DJANGO_GOOGLE_OAUTH_CALLBACK_URL=""

DJANGO_GITHUB_OAUTH_CLIENT_ID=""
DJANGO_GITHUB_OAUTH_CLIENT_SECRET=""
DJANGO_GITHUB_OAUTH_CALLBACK_URL=""

# Deletion Task Batch Size
DJANGO_DELETION_BATCH_SIZE=5000
```

--------------------------------------------------------------------------------

---[FILE: CHANGELOG.md]---
Location: prowler-master/api/CHANGELOG.md

```text
# Prowler API Changelog

All notable changes to the **Prowler API** are documented in this file.

## [1.17.0] (Prowler UNRELEASED)

### Added
- New endpoint to retrieve and overview of the categories based on finding severities [(#9529)](https://github.com/prowler-cloud/prowler/pull/9529)
- Endpoints `GET /findings` and `GET /findings/latests` can now use the category filter [(#9529)](https://github.com/prowler-cloud/prowler/pull/9529)
- Account id, alias and provider name to PDF reporting table [(#9574)](https://github.com/prowler-cloud/prowler/pull/9574)

### Changed
- Endpoint `GET /overviews/attack-surfaces` no longer returns the related check IDs [(#9529)](https://github.com/prowler-cloud/prowler/pull/9529)
- OpenAI provider to only load chat-compatible models with tool calling support [(#9523)](https://github.com/prowler-cloud/prowler/pull/9523)
- Increased execution delay for the first scheduled scan tasks to 5 seconds[(#9558)](https://github.com/prowler-cloud/prowler/pull/9558)

### Fixed
- Made `scan_id` a required filter in the compliance overview endpoint [(#9560)](https://github.com/prowler-cloud/prowler/pull/9560)
- Reduced unnecessary UPDATE resources operations by only saving when tag mappings change, lowering write load during scans [(#9569)](https://github.com/prowler-cloud/prowler/pull/9569)

---

## [1.16.1] (Prowler v5.15.1)

### Fixed
- Race condition in scheduled scan creation by adding countdown to task [(#9516)](https://github.com/prowler-cloud/prowler/pull/9516)

## [1.16.0] (Prowler v5.15.0)

### Added
- New endpoint to retrieve an overview of the attack surfaces [(#9309)](https://github.com/prowler-cloud/prowler/pull/9309)
- New endpoint `GET /api/v1/overviews/findings_severity/timeseries` to retrieve daily aggregated findings by severity level [(#9363)](https://github.com/prowler-cloud/prowler/pull/9363)
- Lighthouse AI support for Amazon Bedrock API key [(#9343)](https://github.com/prowler-cloud/prowler/pull/9343)
- Exception handler for provider deletions during scans [(#9414)](https://github.com/prowler-cloud/prowler/pull/9414)
- Support to use admin credentials through the read replica database [(#9440)](https://github.com/prowler-cloud/prowler/pull/9440)

### Changed
- Error messages from Lighthouse celery tasks [(#9165)](https://github.com/prowler-cloud/prowler/pull/9165)
- Restore the compliance overview endpoint's mandatory filters [(#9338)](https://github.com/prowler-cloud/prowler/pull/9338)

---

## [1.15.2] (Prowler v5.14.2)

### Fixed
- Unique constraint violation during compliance overviews task [(#9436)](https://github.com/prowler-cloud/prowler/pull/9436)
- Division by zero error in ENS PDF report when all requirements are manual [(#9443)](https://github.com/prowler-cloud/prowler/pull/9443)

---

## [1.15.1] (Prowler v5.14.1)

### Fixed
- Fix typo in PDF reporting [(#9345)](https://github.com/prowler-cloud/prowler/pull/9345)
- Fix IaC provider initialization failure when mutelist processor is configured [(#9331)](https://github.com/prowler-cloud/prowler/pull/9331)
- Match logic for ThreatScore when counting findings [(#9348)](https://github.com/prowler-cloud/prowler/pull/9348)

---

## [1.15.0] (Prowler v5.14.0)

### Added
- IaC (Infrastructure as Code) provider support for remote repositories [(#8751)](https://github.com/prowler-cloud/prowler/pull/8751)
- Extend `GET /api/v1/providers` with provider-type filters and optional pagination disable to support the new Overview filters [(#8975)](https://github.com/prowler-cloud/prowler/pull/8975)
- New endpoint to retrieve the number of providers grouped by provider type [(#8975)](https://github.com/prowler-cloud/prowler/pull/8975)
- Support for configuring multiple LLM providers [(#8772)](https://github.com/prowler-cloud/prowler/pull/8772)
- Support C5 compliance framework for Azure provider [(#9081)](https://github.com/prowler-cloud/prowler/pull/9081)
- Support for Oracle Cloud Infrastructure (OCI) provider [(#8927)](https://github.com/prowler-cloud/prowler/pull/8927)
- Support muting findings based on simple rules with custom reason [(#9051)](https://github.com/prowler-cloud/prowler/pull/9051)
- Support C5 compliance framework for the GCP provider [(#9097)](https://github.com/prowler-cloud/prowler/pull/9097)
- Support for Amazon Bedrock and OpenAI compatible providers in Lighthouse AI [(#8957)](https://github.com/prowler-cloud/prowler/pull/8957)
- Support PDF reporting for ENS compliance framework [(#9158)](https://github.com/prowler-cloud/prowler/pull/9158)
- Support PDF reporting for NIS2 compliance framework [(#9170)](https://github.com/prowler-cloud/prowler/pull/9170)
- Tenant-wide ThreatScore overview aggregation and snapshot persistence with backfill support [(#9148)](https://github.com/prowler-cloud/prowler/pull/9148)
- Added `metadata`, `details`, and `partition` attributes to `/resources` endpoint & `details`, and `partition` to `/findings` endpoint [(#9098)](https://github.com/prowler-cloud/prowler/pull/9098)
- Support for MongoDB Atlas provider [(#9167)](https://github.com/prowler-cloud/prowler/pull/9167)
- Support Prowler ThreatScore for the K8S provider [(#9235)](https://github.com/prowler-cloud/prowler/pull/9235)
- Enhanced compliance overview endpoint with provider filtering and latest scan aggregation [(#9244)](https://github.com/prowler-cloud/prowler/pull/9244)
- New endpoint `GET /api/v1/overview/regions` to retrieve aggregated findings data by region [(#9273)](https://github.com/prowler-cloud/prowler/pull/9273)

### Changed
- Optimized database write queries for scan related tasks [(#9190)](https://github.com/prowler-cloud/prowler/pull/9190)
- Date filters are now optional for `GET /api/v1/overviews/services` endpoint; returns latest scan data by default [(#9248)](https://github.com/prowler-cloud/prowler/pull/9248)

### Fixed
- Scans no longer fail when findings have UIDs exceeding 300 characters; such findings are now skipped with detailed logging [(#9246)](https://github.com/prowler-cloud/prowler/pull/9246)
- Updated unique constraint for `Provider` model to exclude soft-deleted entries, resolving duplicate errors when re-deleting providers [(#9054)](https://github.com/prowler-cloud/prowler/pull/9054)
- Removed compliance generation for providers without compliance frameworks [(#9208)](https://github.com/prowler-cloud/prowler/pull/9208)
- Refresh output report timestamps for each scan [(#9272)](https://github.com/prowler-cloud/prowler/pull/9272)
- Severity overview endpoint now ignores muted findings as expected [(#9283)](https://github.com/prowler-cloud/prowler/pull/9283)
- Fixed discrepancy between ThreatScore PDF report values and database calculations [(#9296)](https://github.com/prowler-cloud/prowler/pull/9296)

### Security
- Django updated to the latest 5.1 security release, 5.1.14, due to problems with potential [SQL injection](https://github.com/prowler-cloud/prowler/security/dependabot/113) and [denial-of-service vulnerability](https://github.com/prowler-cloud/prowler/security/dependabot/114) [(#9176)](https://github.com/prowler-cloud/prowler/pull/9176)

---

## [1.14.1] (Prowler v5.13.1)

### Fixed
- `/api/v1/overviews/providers` collapses data by provider type so the UI receives a single aggregated record per cloud family even when multiple accounts exist [(#9053)](https://github.com/prowler-cloud/prowler/pull/9053)
- Added retry logic to database transactions to handle Aurora read replica connection failures during scale-down events [(#9064)](https://github.com/prowler-cloud/prowler/pull/9064)
- Security Hub integrations stop failing when they read relationships via the replica by allowing replica relations and saving updates through the primary [(#9080)](https://github.com/prowler-cloud/prowler/pull/9080)

---

## [1.14.0] (Prowler v5.13.0)

### Added
- Default JWT keys are generated and stored if they are missing from configuration [(#8655)](https://github.com/prowler-cloud/prowler/pull/8655)
- `compliance_name` for each compliance [(#7920)](https://github.com/prowler-cloud/prowler/pull/7920)
- Support C5 compliance framework for the AWS provider [(#8830)](https://github.com/prowler-cloud/prowler/pull/8830)
- Support for M365 Certificate authentication [(#8538)](https://github.com/prowler-cloud/prowler/pull/8538)
- API Key support [(#8805)](https://github.com/prowler-cloud/prowler/pull/8805)
- SAML role mapping protection for single-admin tenants to prevent accidental lockout [(#8882)](https://github.com/prowler-cloud/prowler/pull/8882)
- Support for `passed_findings` and `total_findings` fields in compliance requirement overview for accurate Prowler ThreatScore calculation [(#8582)](https://github.com/prowler-cloud/prowler/pull/8582)
- PDF reporting for Prowler ThreatScore [(#8867)](https://github.com/prowler-cloud/prowler/pull/8867)
- Database read replica support [(#8869)](https://github.com/prowler-cloud/prowler/pull/8869)
- Support Common Cloud Controls for AWS, Azure and GCP [(#8000)](https://github.com/prowler-cloud/prowler/pull/8000)
- Add `provider_id__in` filter support to findings and findings severity overview endpoints [(#8951)](https://github.com/prowler-cloud/prowler/pull/8951)

### Changed
- Now the MANAGE_ACCOUNT permission is required to modify or read user permissions instead of MANAGE_USERS [(#8281)](https://github.com/prowler-cloud/prowler/pull/8281)
- Now at least one user with MANAGE_ACCOUNT permission is required in the tenant [(#8729)](https://github.com/prowler-cloud/prowler/pull/8729)

### Security
- Django updated to the latest 5.1 security release, 5.1.13, due to problems with potential [SQL injection](https://github.com/prowler-cloud/prowler/security/dependabot/104) and [directory traversals](https://github.com/prowler-cloud/prowler/security/dependabot/103) [(#8842)](https://github.com/prowler-cloud/prowler/pull/8842)

---

## [1.13.2] (Prowler v5.12.3)

### Fixed
- 500 error when deleting user [(#8731)](https://github.com/prowler-cloud/prowler/pull/8731)

---

## [1.13.1] (Prowler v5.12.2)

### Changed
- Renamed compliance overview task queue to `compliance` [(#8755)](https://github.com/prowler-cloud/prowler/pull/8755)

### Security
- Django updated to the latest 5.1 security release, 5.1.12, due to [problems](https://www.djangoproject.com/weblog/2025/sep/03/security-releases/) with potential SQL injection in FilteredRelation column aliases [(#8693)](https://github.com/prowler-cloud/prowler/pull/8693)

---

## [1.13.0] (Prowler v5.12.0)

### Added
- Integration with JIRA, enabling sending findings to a JIRA project [(#8622)](https://github.com/prowler-cloud/prowler/pull/8622), [(#8637)](https://github.com/prowler-cloud/prowler/pull/8637)
- `GET /overviews/findings_severity` now supports `filter[status]` and `filter[status__in]` to aggregate by specific statuses (`FAIL`, `PASS`)[(#8186)](https://github.com/prowler-cloud/prowler/pull/8186)
- Throttling options for `/api/v1/tokens` using the `DJANGO_THROTTLE_TOKEN_OBTAIN` environment variable [(#8647)](https://github.com/prowler-cloud/prowler/pull/8647)

---

## [1.12.0] (Prowler v5.11.0)

### Added
- Lighthouse support for OpenAI GPT-5 [(#8527)](https://github.com/prowler-cloud/prowler/pull/8527)
- Integration with Amazon Security Hub, enabling sending findings to Security Hub [(#8365)](https://github.com/prowler-cloud/prowler/pull/8365)
- Generate ASFF output for AWS providers with SecurityHub integration enabled [(#8569)](https://github.com/prowler-cloud/prowler/pull/8569)

### Fixed
- GitHub provider always scans user instead of organization when using provider UID [(#8587)](https://github.com/prowler-cloud/prowler/pull/8587)

---

## [1.11.0] (Prowler v5.10.0)

### Added
- Github provider support [(#8271)](https://github.com/prowler-cloud/prowler/pull/8271)
- Integration with Amazon S3, enabling storage and retrieval of scan data via S3 buckets [(#8056)](https://github.com/prowler-cloud/prowler/pull/8056)

### Fixed
- Avoid sending errors to Sentry in M365 provider when user authentication fails [(#8420)](https://github.com/prowler-cloud/prowler/pull/8420)

---

## [1.10.2] (Prowler v5.9.2)

### Changed
- Optimized queries for resources views [(#8336)](https://github.com/prowler-cloud/prowler/pull/8336)

---

## [v1.10.1] (Prowler v5.9.1)

### Fixed
- Calculate failed findings during scans to prevent heavy database queries [(#8322)](https://github.com/prowler-cloud/prowler/pull/8322)

---

## [v1.10.0] (Prowler v5.9.0)

### Added
- SSO with SAML support [(#8175)](https://github.com/prowler-cloud/prowler/pull/8175)
- `GET /resources/metadata`, `GET /resources/metadata/latest` and `GET /resources/latest` to expose resource metadata and latest scan results [(#8112)](https://github.com/prowler-cloud/prowler/pull/8112)

### Changed
- `/processors` endpoints to post-process findings. Currently, only the Mutelist processor is supported to allow to mute findings.
- Optimized the underlying queries for resources endpoints [(#8112)](https://github.com/prowler-cloud/prowler/pull/8112)
- Optimized include parameters for resources view [(#8229)](https://github.com/prowler-cloud/prowler/pull/8229)
- Optimized overview background tasks [(#8300)](https://github.com/prowler-cloud/prowler/pull/8300)

### Fixed
- Search filter for findings and resources [(#8112)](https://github.com/prowler-cloud/prowler/pull/8112)
- RBAC is now applied to `GET /overviews/providers` [(#8277)](https://github.com/prowler-cloud/prowler/pull/8277)

### Changed
- `POST /schedules/daily` returns a `409 CONFLICT` if already created [(#8258)](https://github.com/prowler-cloud/prowler/pull/8258)

### Security
- Enhanced password validation to enforce 12+ character passwords with special characters, uppercase, lowercase, and numbers [(#8225)](https://github.com/prowler-cloud/prowler/pull/8225)

---

## [v1.9.1] (Prowler v5.8.1)

### Added
- Custom exception for provider connection errors during scans [(#8234)](https://github.com/prowler-cloud/prowler/pull/8234)

### Changed
- Summary and overview tasks now use a dedicated queue and no longer propagate errors to compliance tasks [(#8214)](https://github.com/prowler-cloud/prowler/pull/8214)

### Fixed
- Scan with no resources will not trigger legacy code for findings metadata [(#8183)](https://github.com/prowler-cloud/prowler/pull/8183)
- Invitation email comparison case-insensitive [(#8206)](https://github.com/prowler-cloud/prowler/pull/8206)

### Removed
- Validation of the provider's secret type during updates [(#8197)](https://github.com/prowler-cloud/prowler/pull/8197)

---

## [v1.9.0] (Prowler v5.8.0)

### Added
- Support GCP Service Account key [(#7824)](https://github.com/prowler-cloud/prowler/pull/7824)
- `GET /compliance-overviews` endpoints to retrieve compliance metadata and specific requirements statuses [(#7877)](https://github.com/prowler-cloud/prowler/pull/7877)
- Lighthouse configuration support [(#7848)](https://github.com/prowler-cloud/prowler/pull/7848)

### Changed
- Reworked `GET /compliance-overviews` to return proper requirement metrics [(#7877)](https://github.com/prowler-cloud/prowler/pull/7877)
- Optional `user` and `password` for M365 provider [(#7992)](https://github.com/prowler-cloud/prowler/pull/7992)

### Fixed
- Scheduled scans are no longer deleted when their daily schedule run is disabled [(#8082)](https://github.com/prowler-cloud/prowler/pull/8082)

---

## [v1.8.5] (Prowler v5.7.5)

### Fixed
- Normalize provider UID to ensure safe and unique export directory paths [(#8007)](https://github.com/prowler-cloud/prowler/pull/8007).
- Blank resource types in `/metadata` endpoints [(#8027)](https://github.com/prowler-cloud/prowler/pull/8027)

---

## [v1.8.4] (Prowler v5.7.4)

### Removed
- Reverted RLS transaction handling and DB custom backend [(#7994)](https://github.com/prowler-cloud/prowler/pull/7994)

---

## [v1.8.3] (Prowler v5.7.3)

### Added
- Database backend to handle already closed connections [(#7935)](https://github.com/prowler-cloud/prowler/pull/7935)

### Changed
- Renamed field encrypted_password to password for M365 provider [(#7784)](https://github.com/prowler-cloud/prowler/pull/7784)

### Fixed
- Transaction persistence with RLS operations [(#7916)](https://github.com/prowler-cloud/prowler/pull/7916)
- Reverted the change `get_with_retry` to use the original `get` method for retrieving tasks [(#7932)](https://github.com/prowler-cloud/prowler/pull/7932)

---

## [v1.8.2] (Prowler v5.7.2)

### Fixed
- Task lookup to use task_kwargs instead of task_args for scan report resolution [(#7830)](https://github.com/prowler-cloud/prowler/pull/7830)
- Kubernetes UID validation to allow valid context names [(#7871)](https://github.com/prowler-cloud/prowler/pull/7871)
- Connection status verification before launching a scan [(#7831)](https://github.com/prowler-cloud/prowler/pull/7831)
- Race condition when creating background tasks [(#7876)](https://github.com/prowler-cloud/prowler/pull/7876)
- Error when modifying or retrieving tenants due to missing user UUID in transaction context [(#7890)](https://github.com/prowler-cloud/prowler/pull/7890)

---

## [v1.8.1] (Prowler v5.7.1)

### Fixed
- Added database index to improve performance on finding lookup [(#7800)](https://github.com/prowler-cloud/prowler/pull/7800)

---

## [v1.8.0] (Prowler v5.7.0)

### Added
- Huge improvements to `/findings/metadata` and resource related filters for findings [(#7690)](https://github.com/prowler-cloud/prowler/pull/7690)
- Improvements to `/overviews` endpoints [(#7690)](https://github.com/prowler-cloud/prowler/pull/7690)
- Queue to perform backfill background tasks [(#7690)](https://github.com/prowler-cloud/prowler/pull/7690)
- New endpoints to retrieve latest findings and metadata [(#7743)](https://github.com/prowler-cloud/prowler/pull/7743)
- Export support for Prowler ThreatScore in M365 [(7783)](https://github.com/prowler-cloud/prowler/pull/7783)

---

## [v1.7.0] (Prowler v5.6.0)

### Added

- M365 as a new provider [(#7563)](https://github.com/prowler-cloud/prowler/pull/7563)
- `compliance/` folder and ZIP‐export functionality for all compliance reports [(#7653)](https://github.com/prowler-cloud/prowler/pull/7653)
- API endpoint to fetch and download any specific compliance file by name [(#7653)](https://github.com/prowler-cloud/prowler/pull/7653)

---

## [v1.6.0] (Prowler v5.5.0)

### Added

- Support for developing new integrations [(#7167)](https://github.com/prowler-cloud/prowler/pull/7167)
- HTTP Security Headers [(#7289)](https://github.com/prowler-cloud/prowler/pull/7289)
- New endpoint to get the compliance overviews metadata [(#7333)](https://github.com/prowler-cloud/prowler/pull/7333)
- Support for muted findings [(#7378)](https://github.com/prowler-cloud/prowler/pull/7378)
- Missing fields to API findings and resources [(#7318)](https://github.com/prowler-cloud/prowler/pull/7318)

---

## [v1.5.4] (Prowler v5.4.4)

### Fixed
- Bug with periodic tasks when trying to delete a provider [(#7466)](https://github.com/prowler-cloud/prowler/pull/7466)

---

## [v1.5.3] (Prowler v5.4.3)

### Fixed
- Duplicated scheduled scans handling [(#7401)](https://github.com/prowler-cloud/prowler/pull/7401)
- Environment variable to configure the deletion task batch size [(#7423)](https://github.com/prowler-cloud/prowler/pull/7423)

---

## [v1.5.2] (Prowler v5.4.2)

### Changed
- Refactored deletion logic and implemented retry mechanism for deletion tasks [(#7349)](https://github.com/prowler-cloud/prowler/pull/7349)

---

## [v1.5.1] (Prowler v5.4.1)

### Fixed
- Handle response in case local files are missing [(#7183)](https://github.com/prowler-cloud/prowler/pull/7183)
- Race condition when deleting export files after the S3 upload [(#7172)](https://github.com/prowler-cloud/prowler/pull/7172)
- Handle exception when a provider has no secret in test connection [(#7283)](https://github.com/prowler-cloud/prowler/pull/7283)

---

## [v1.5.0] (Prowler v5.4.0)

### Added
- Social login integration with Google and GitHub [(#6906)](https://github.com/prowler-cloud/prowler/pull/6906)
- API scan report system, now all scans launched from the API will generate a compressed file with the report in OCSF, CSV and HTML formats [(#6878)](https://github.com/prowler-cloud/prowler/pull/6878)
- Configurable Sentry integration [(#6874)](https://github.com/prowler-cloud/prowler/pull/6874)

### Changed
- Optimized `GET /findings` endpoint to improve response time and size [(#7019)](https://github.com/prowler-cloud/prowler/pull/7019)

---

## [v1.4.0] (Prowler v5.3.0)

### Changed
- Daily scheduled scan instances are now created beforehand with `SCHEDULED` state [(#6700)](https://github.com/prowler-cloud/prowler/pull/6700)
- Findings endpoints now require at least one date filter [(#6800)](https://github.com/prowler-cloud/prowler/pull/6800)
- Findings metadata endpoint received a performance improvement [(#6863)](https://github.com/prowler-cloud/prowler/pull/6863)
- Increased the allowed length of the provider UID for Kubernetes providers [(#6869)](https://github.com/prowler-cloud/prowler/pull/6869)

---
```

--------------------------------------------------------------------------------

---[FILE: docker-entrypoint.sh]---
Location: prowler-master/api/docker-entrypoint.sh

```bash
#!/bin/sh


apply_migrations() {
  echo "Applying database migrations..."

  # Fix Inconsistent migration history after adding sites app
  poetry run python manage.py check_and_fix_socialaccount_sites_migration --database admin

  poetry run python manage.py migrate --database admin
}

apply_fixtures() {
  echo "Applying Django fixtures..."
  for fixture in api/fixtures/dev/*.json; do
    if [ -f "$fixture" ]; then
      echo "Loading $fixture"
      poetry run python manage.py loaddata "$fixture" --database admin
    fi
  done
}

start_dev_server() {
  echo "Starting the development server..."
  poetry run python manage.py runserver 0.0.0.0:"${DJANGO_PORT:-8080}"
}

start_prod_server() {
  echo "Starting the Gunicorn server..."
  poetry run gunicorn -c config/guniconf.py config.wsgi:application
}

start_worker() {
  echo "Starting the worker..."
  poetry run python -m celery -A config.celery worker -l "${DJANGO_LOGGING_LEVEL:-info}" -Q celery,scans,scan-reports,deletion,backfill,overview,integrations,compliance -E --max-tasks-per-child 1
}

start_worker_beat() {
  echo "Starting the worker-beat..."
  sleep 15
  poetry run python -m celery -A config.celery beat -l "${DJANGO_LOGGING_LEVEL:-info}" --scheduler django_celery_beat.schedulers:DatabaseScheduler
}

manage_db_partitions() {
  if [ "${DJANGO_MANAGE_DB_PARTITIONS}" = "True" ]; then
    echo "Managing DB partitions..."
    # For now we skip the deletion of partitions until we define the data retention policy
    # --yes auto approves the operation without the need of an interactive terminal
    poetry run python manage.py pgpartition --using admin --skip-delete --yes
  fi
}

case "$1" in
  dev)
    apply_migrations
    apply_fixtures
    manage_db_partitions
    start_dev_server
    ;;
  prod)
    apply_migrations
    manage_db_partitions
    start_prod_server
    ;;
  worker)
    start_worker
    ;;
  beat)
    start_worker_beat
    ;;
  *)
    echo "Usage: $0 {dev|prod|worker|beat}"
    exit 1
    ;;
esac
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: prowler-master/api/Dockerfile

```text
FROM python:3.12.10-slim-bookworm AS build

LABEL maintainer="https://github.com/prowler-cloud/api"

ARG POWERSHELL_VERSION=7.5.0
ENV POWERSHELL_VERSION=${POWERSHELL_VERSION}

ARG TRIVY_VERSION=0.66.0
ENV TRIVY_VERSION=${TRIVY_VERSION}

# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    libicu72 \
    gcc \
    g++ \
    make \
    libxml2-dev \
    libxmlsec1-dev \
    libxmlsec1-openssl \
    pkg-config \
    libtool \
    libxslt1-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PowerShell
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget --progress=dot:giga https://github.com/PowerShell/PowerShell/releases/download/v${POWERSHELL_VERSION}/powershell-${POWERSHELL_VERSION}-linux-x64.tar.gz -O /tmp/powershell.tar.gz ; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget --progress=dot:giga https://github.com/PowerShell/PowerShell/releases/download/v${POWERSHELL_VERSION}/powershell-${POWERSHELL_VERSION}-linux-arm64.tar.gz -O /tmp/powershell.tar.gz ; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1 ; \
    fi && \
    mkdir -p /opt/microsoft/powershell/7 && \
    tar zxf /tmp/powershell.tar.gz -C /opt/microsoft/powershell/7 && \
    chmod +x /opt/microsoft/powershell/7/pwsh && \
    ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh && \
    rm /tmp/powershell.tar.gz

# Install Trivy for IaC scanning
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        TRIVY_ARCH="Linux-64bit" ; \
    elif [ "$ARCH" = "aarch64" ]; then \
        TRIVY_ARCH="Linux-ARM64" ; \
    else \
        echo "Unsupported architecture for Trivy: $ARCH" && exit 1 ; \
    fi && \
    wget --progress=dot:giga "https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/trivy_${TRIVY_VERSION}_${TRIVY_ARCH}.tar.gz" -O /tmp/trivy.tar.gz && \
    tar zxf /tmp/trivy.tar.gz -C /tmp && \
    mv /tmp/trivy /usr/local/bin/trivy && \
    chmod +x /usr/local/bin/trivy && \
    rm /tmp/trivy.tar.gz && \
    # Create trivy cache directory with proper permissions
    mkdir -p /tmp/.cache/trivy && \
    chmod 777 /tmp/.cache/trivy

# Add prowler user
RUN addgroup --gid 1000 prowler && \
    adduser --uid 1000 --gid 1000 --disabled-password --gecos "" prowler

USER prowler

WORKDIR /home/prowler

# Ensure output directory exists
RUN mkdir -p /tmp/prowler_api_output

COPY pyproject.toml ./

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir poetry

ENV PATH="/home/prowler/.local/bin:$PATH"

# Add `--no-root` to avoid installing the current project as a package
RUN poetry install --no-root && \
    rm -rf ~/.cache/pip

RUN poetry run python "$(poetry env info --path)/src/prowler/prowler/providers/m365/lib/powershell/m365_powershell.py"

COPY src/backend/ ./backend/
COPY docker-entrypoint.sh ./docker-entrypoint.sh

WORKDIR /home/prowler/backend

# Development image
FROM build AS dev

ENTRYPOINT ["../docker-entrypoint.sh", "dev"]

# Production image
FROM build

ENTRYPOINT ["../docker-entrypoint.sh", "prod"]
```

--------------------------------------------------------------------------------

````
