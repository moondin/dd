---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 14
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 14 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: main.yml]---
Location: payload-main/.github/workflows/main.yml
Signals: Next.js, Docker

```yaml
name: ci

on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize
  push:
    branches:
      - main

concurrency:
  # <workflow_name>-<branch_name>-<true || commit_sha if branch is protected>
  group: ${{ github.workflow }}-${{ github.ref }}-${{ github.ref_protected && github.sha || ''}}
  cancel-in-progress: true

env:
  DO_NOT_TRACK: 1 # Disable Turbopack telemetry
  NEXT_TELEMETRY_DISABLED: 1 # Disable Next telemetry

jobs:
  changes:
    runs-on: ubuntu-24.04
    permissions:
      pull-requests: read
    outputs:
      needs_build: ${{ steps.filter.outputs.needs_build }}
      needs_tests: ${{ steps.filter.outputs.needs_tests }}
      templates: ${{ steps.filter.outputs.templates }}
    steps:
      # https://github.com/actions/virtual-environments/issues/1187
      - name: tune linux network
        run: sudo ethtool -K eth0 tx off rx off

      - uses: actions/checkout@v5
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            needs_build:
              - '.github/workflows/main.yml'
              - 'packages/**'
              - 'test/**'
              - 'pnpm-lock.yaml'
              - 'package.json'
              - 'templates/**'
            needs_tests:
              - '.github/workflows/main.yml'
              - 'packages/**'
              - 'test/**'
              - 'pnpm-lock.yaml'
              - 'package.json'
            templates:
              - 'templates/**'
      - name: Log all filter results
        run: |
          echo "needs_build: ${{ steps.filter.outputs.needs_build }}"
          echo "needs_tests: ${{ steps.filter.outputs.needs_tests }}"
          echo "templates: ${{ steps.filter.outputs.templates }}"

  lint:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v5
        with:
          fetch-depth: 0

      - name: Node setup
        uses: ./.github/actions/setup

      - name: Lint
        run: pnpm lint -- --quiet

  build:
    needs: changes
    if: ${{ needs.changes.outputs.needs_build == 'true' }}
    runs-on: ubuntu-24.04

    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup

      - run: pnpm run build:all
        env:
          DO_NOT_TRACK: 1 # Disable Turbopack telemetry

      - name: Cache build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

  tests-unit:
    runs-on: ubuntu-24.04
    needs: [changes, build]
    if: ${{ needs.changes.outputs.needs_tests == 'true' }}
    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup
        with:
          pnpm-run-install: false
          pnpm-restore-cache: false # Full build is restored below

      - name: Restore build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

      - name: Unit Tests
        run: pnpm test:unit
        env:
          NODE_OPTIONS: --max-old-space-size=8096

  tests-types:
    runs-on: ubuntu-24.04
    needs: [changes, build]
    if: ${{ needs.changes.outputs.needs_tests == 'true' }}
    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup
        with:
          pnpm-run-install: false
          pnpm-restore-cache: false # Full build is restored below

      - name: Restore build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

      - name: Types Tests
        run: pnpm test:types --target '>=5.7'
        env:
          NODE_OPTIONS: --max-old-space-size=8096

  tests-int:
    runs-on: ubuntu-24.04
    needs: [changes, build]
    if: ${{ needs.changes.outputs.needs_tests == 'true' }}
    name: int-${{ matrix.database }}
    timeout-minutes: 45
    strategy:
      fail-fast: false
      matrix:
        database:
          - mongodb
          - documentdb
          - cosmosdb
          - firestore
          - postgres
          - postgres-custom-schema
          - postgres-uuid
          - supabase
          - sqlite
          - sqlite-uuid

    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: payloadtests
      AWS_ENDPOINT_URL: http://127.0.0.1:4566
      AWS_ACCESS_KEY_ID: localstack
      AWS_SECRET_ACCESS_KEY: localstack
      AWS_REGION: us-east-1

    services:
      postgres:
        # Custom postgres 17 docker image that supports both pg-vector and postgis: https://github.com/payloadcms/postgis-vector
        image: ${{ (startsWith(matrix.database, 'postgres') ) && 'ghcr.io/payloadcms/postgis-vector:latest' || '' }}
        env:
          # must specify password for PG Docker container image, see: https://registry.hub.docker.com/_/postgres?tab=description&page=1&name=10
          POSTGRES_USER: ${{ env.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
          POSTGRES_DB: ${{ env.POSTGRES_DB }}
        ports:
          - 5432:5432
        # needed because the postgres container does not provide a healthcheck
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

      redis:
        image: redis:latest
        ports:
          - 6379:6379

        options: --health-cmd "redis-cli ping" --health-timeout 30s --health-retries 3

    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup
        with:
          pnpm-run-install: false
          pnpm-restore-cache: false # Full build is restored below

      - name: Restore build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

      - name: Start LocalStack
        run: pnpm docker:start

      - name: Install Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
        if: matrix.database == 'supabase'

      - name: Initialize Supabase
        run: |
          supabase init
          supabase start
        if: matrix.database == 'supabase'

      - name: Configure PostgreSQL
        run: |
          psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" -c "CREATE ROLE runner SUPERUSER LOGIN;"
          psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" -c "SELECT version();"
          echo "POSTGRES_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" >> $GITHUB_ENV
        if: startsWith(matrix.database, 'postgres')

      - name: Configure PostgreSQL with custom schema
        run: |
          psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" -c "CREATE SCHEMA custom;"
        if: matrix.database == 'postgres-custom-schema'

      - name: Configure Supabase
        run: |
          echo "POSTGRES_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres" >> $GITHUB_ENV
        if: matrix.database == 'supabase'

      - name: Configure Redis
        run: |
          echo  "REDIS_URL=redis://127.0.0.1:6379" >> $GITHUB_ENV

      - name: Integration Tests
        run: pnpm test:int
        env:
          NODE_OPTIONS: --max-old-space-size=8096
          PAYLOAD_DATABASE: ${{ matrix.database }}
          POSTGRES_URL: ${{ env.POSTGRES_URL }}

  tests-e2e:
    runs-on: ubuntu-24.04
    needs: [changes, build]
    if: ${{ needs.changes.outputs.needs_tests == 'true' }}
    name: e2e-${{ matrix.suite }}
    timeout-minutes: 45
    strategy:
      fail-fast: false
      matrix:
        # find test -type f -name 'e2e.spec.ts' | sort | xargs dirname | xargs -I {} basename {}
        suite:
          - _community
          - a11y
          - access-control
          - admin__e2e__general
          - admin__e2e__list-view
          - admin__e2e__document-view
          - admin-bar
          - admin-root
          - auth
          - auth-basic
          - bulk-edit
          - joins
          - field-error-states
          - fields-relationship
          - fields__collections__Array
          - fields__collections__Blocks
          - fields__collections__Blocks#config.blockreferences.ts
          - fields__collections__Checkbox
          - fields__collections__Collapsible
          - fields__collections__ConditionalLogic
          - fields__collections__CustomID
          - fields__collections__Date
          - fields__collections__Email
          - fields__collections__Indexed
          - fields__collections__JSON
          - fields__collections__Number
          - fields__collections__Point
          - fields__collections__Radio
          - fields__collections__Relationship
          - fields__collections__Row
          - fields__collections__Select
          - fields__collections__Tabs
          - fields__collections__Tabs2
          - fields__collections__Text
          - fields__collections__UI
          - fields__collections__Upload
          - fields__collections__UploadPoly
          - fields__collections__UploadMultiPoly
          - group-by
          - folders
          - hooks
          - lexical__collections___LexicalFullyFeatured
          - lexical__collections___LexicalFullyFeatured__db
          - lexical__collections__LexicalHeadingFeature
          - lexical__collections__LexicalJSXConverter
          - lexical__collections__LexicalLinkFeature
          - lexical__collections__OnDemandForm
          - lexical__collections__Lexical__e2e__main
          - lexical__collections__Lexical__e2e__blocks
          - lexical__collections__Lexical__e2e__blocks#config.blockreferences.ts
          - lexical__collections__RichText
          - query-presets
          - form-state
          - live-preview
          - localization
          - locked-documents
          - i18n
          - plugin-cloud-storage
          - plugin-form-builder
          - plugin-import-export
          - plugin-multi-tenant
          - plugin-nested-docs
          - plugin-redirects
          - plugin-seo
          - sort
          - server-url
          - trash
          - versions
          - uploads
    env:
      SUITE_NAME: ${{ matrix.suite }}
    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup
        with:
          pnpm-run-install: false
          pnpm-restore-cache: false # Full build is restored below

      - name: Restore build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

      - name: Start LocalStack
        run: pnpm docker:start
        if: ${{ matrix.suite == 'plugin-cloud-storage' }}

      - name: Store Playwright's Version
        run: |
          # Extract the version number using a more targeted regex pattern with awk
          PLAYWRIGHT_VERSION=$(pnpm ls @playwright/test --depth=0 | awk '/@playwright\/test/ {print $2}')
          echo "Playwright's Version: $PLAYWRIGHT_VERSION"
          echo "PLAYWRIGHT_VERSION=$PLAYWRIGHT_VERSION" >> $GITHUB_ENV

      - name: Cache Playwright Browsers for Playwright's Version
        id: cache-playwright-browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-browsers-${{ env.PLAYWRIGHT_VERSION }}

      - name: Setup Playwright - Browsers and Dependencies
        if: steps.cache-playwright-browsers.outputs.cache-hit != 'true'
        run: pnpm exec playwright install --with-deps chromium --no-shell

      - name: Setup Playwright - Dependencies-only
        if: steps.cache-playwright-browsers.outputs.cache-hit == 'true'
        run: pnpm exec playwright install-deps chromium

      - name: E2E Tests
        run: PLAYWRIGHT_JSON_OUTPUT_NAME=results_${{ matrix.suite }}.json pnpm test:e2e:prod:ci:noturbo ${{ matrix.suite }}
        env:
          PLAYWRIGHT_JSON_OUTPUT_NAME: results_${{ matrix.suite }}.json
          NEXT_TELEMETRY_DISABLED: 1

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-${{ matrix.suite }}
          path: test/test-results/
          if-no-files-found: ignore
          retention-days: 1

      # Disabled until this is fixed: https://github.com/daun/playwright-report-summary/issues/156
      # - uses: daun/playwright-report-summary@v3
      #   with:
      #     report-file: results_${{ matrix.suite }}.json
      #     report-tag: ${{ matrix.suite }}
      #     job-summary: true

  # This is unused, keeping it here for reference and possibly enabling in the future
  tests-e2e-turbo:
    runs-on: ubuntu-24.04
    needs: [changes, build]
    if: >-
      needs.changes.outputs.needs_tests == 'true' &&
      (
        contains(github.event.pull_request.labels.*.name, 'run-e2e-turbo') ||
        github.event.label.name == 'run-e2e-turbo'
      )
    name: e2e-turbo-${{ matrix.suite }}
    strategy:
      fail-fast: false
      matrix:
        # find test -type f -name 'e2e.spec.ts' | sort | xargs dirname | xargs -I {} basename {}
        suite:
          - _community
          - access-control
          - admin__e2e__general
          - admin__e2e__list-view
          - admin__e2e__document-view
          - admin-bar
          - admin-root
          - auth
          - auth-basic
          - bulk-edit
          - joins
          - field-error-states
          - fields-relationship
          - fields__collections__Array
          - fields__collections__Blocks
          - fields__collections__Blocks#config.blockreferences.ts
          - fields__collections__Checkbox
          - fields__collections__Collapsible
          - fields__collections__ConditionalLogic
          - fields__collections__CustomID
          - fields__collections__Date
          - fields__collections__Email
          - fields__collections__Indexed
          - fields__collections__JSON
          - fields__collections__Number
          - fields__collections__Point
          - fields__collections__Radio
          - fields__collections__Relationship
          - fields__collections__Row
          - fields__collections__Select
          - fields__collections__Tabs
          - fields__collections__Tabs2
          - fields__collections__Text
          - fields__collections__UI
          - fields__collections__Upload
          - group-by
          - folders
          - hooks
          - lexical__collections___LexicalFullyFeatured
          - lexical__collections___LexicalFullyFeatured__db
          - lexical__collections__LexicalHeadingFeature
          - lexical__collections__LexicalJSXConverter
          - lexical__collections__LexicalLinkFeature
          - lexical__collections__OnDemandForm
          - lexical__collections__Lexical__e2e__main
          - lexical__collections__Lexical__e2e__blocks
          - lexical__collections__Lexical__e2e__blocks#config.blockreferences.ts
          - lexical__collections__RichText
          - query-presets
          - form-state
          - live-preview
          - localization
          - locked-documents
          - i18n
          - plugin-cloud-storage
          - plugin-form-builder
          - plugin-import-export
          - plugin-multi-tenant
          - plugin-nested-docs
          - plugin-seo
          - sort
          - trash
          - versions
          - uploads
    env:
      SUITE_NAME: ${{ matrix.suite }}
    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup
        with:
          pnpm-run-install: false
          pnpm-restore-cache: false # Full build is restored below

      - name: Restore build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

      - name: Start LocalStack
        run: pnpm docker:start
        if: ${{ matrix.suite == 'plugin-cloud-storage' }}

      - name: Store Playwright's Version
        run: |
          # Extract the version number using a more targeted regex pattern with awk
          PLAYWRIGHT_VERSION=$(pnpm ls @playwright/test --depth=0 | awk '/@playwright\/test/ {print $2}')
          echo "Playwright's Version: $PLAYWRIGHT_VERSION"
          echo "PLAYWRIGHT_VERSION=$PLAYWRIGHT_VERSION" >> $GITHUB_ENV

      - name: Cache Playwright Browsers for Playwright's Version
        id: cache-playwright-browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-browsers-${{ env.PLAYWRIGHT_VERSION }}

      - name: Setup Playwright - Browsers and Dependencies
        if: steps.cache-playwright-browsers.outputs.cache-hit != 'true'
        run: pnpm exec playwright install --with-deps chromium

      - name: Setup Playwright - Dependencies-only
        if: steps.cache-playwright-browsers.outputs.cache-hit == 'true'
        run: pnpm exec playwright install-deps chromium

      - name: E2E Tests
        run: PLAYWRIGHT_JSON_OUTPUT_NAME=results_${{ matrix.suite }}.json pnpm test:e2e:prod:ci ${{ matrix.suite }}
        env:
          PLAYWRIGHT_JSON_OUTPUT_NAME: results_${{ matrix.suite }}.json
          NEXT_TELEMETRY_DISABLED: 1

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-turbo${{ matrix.suite }}
          path: test/test-results/
          if-no-files-found: ignore
          retention-days: 1

      # Disabled until this is fixed: https://github.com/daun/playwright-report-summary/issues/156
      # - uses: daun/playwright-report-summary@v3
      #   with:
      #     report-file: results_${{ matrix.suite }}.json
      #     report-tag: ${{ matrix.suite }}
      #     job-summary: true

  # Build listed templates with packed local packages and then runs their int and e2e tests
  build-and-test-templates:
    runs-on: ubuntu-24.04
    needs: [changes, build]
    if: ${{ needs.changes.outputs.needs_build == 'true' }}
    name: build-template-${{ matrix.template }}-${{ matrix.database }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - template: blank
            database: mongodb

          - template: website
            database: mongodb

          - template: with-vercel-mongodb
            database: mongodb

          # Postgres
          - template: with-postgres
            database: postgres

          - template: with-vercel-postgres
            database: postgres

          - template: plugin

          # Re-enable once PG conncection is figured out
          # - template: with-vercel-website
          #   database: postgres

    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: payloadtests
      MONGODB_VERSION: 6.0

    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup
        with:
          pnpm-run-install: false
          pnpm-restore-cache: false # Full build is restored below

      - name: Restore build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

      - name: Start PostgreSQL
        uses: CasperWA/postgresql-action@v1.2
        with:
          postgresql version: '14' # See https://hub.docker.com/_/postgres for available versions
          postgresql db: ${{ env.POSTGRES_DB }}
          postgresql user: ${{ env.POSTGRES_USER }}
          postgresql password: ${{ env.POSTGRES_PASSWORD }}
        if: matrix.database == 'postgres'

      - name: Wait for PostgreSQL
        run: sleep 30
        if: matrix.database == 'postgres'

      - name: Configure PostgreSQL
        run: |
          psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" -c "CREATE ROLE runner SUPERUSER LOGIN;"
          psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" -c "SELECT version();"
          echo "POSTGRES_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" >> $GITHUB_ENV
        if: matrix.database == 'postgres'

      # Avoid dockerhub rate-limiting
      - name: Cache Docker images
        uses: ScribeMD/docker-cache@0.5.0
        with:
          key: docker-${{ runner.os }}-mongo-${{ env.MONGODB_VERSION }}

      - name: Start MongoDB
        uses: supercharge/mongodb-github-action@1.12.0
        with:
          mongodb-version: 6.0
        if: matrix.database == 'mongodb'

      - name: Build Template
        run: |
          pnpm run script:pack --dest templates/${{ matrix.template }}
          pnpm run script:build-template-with-local-pkgs ${{ matrix.template }} $POSTGRES_URL
        env:
          NODE_OPTIONS: --max-old-space-size=8096

      - name: Store Playwright's Version
        run: |
          # Extract the version number using a more targeted regex pattern with awk
          PLAYWRIGHT_VERSION=$(pnpm ls @playwright/test --depth=0 | awk '/@playwright\/test/ {print $2}')
          echo "Playwright's Version: $PLAYWRIGHT_VERSION"
          echo "PLAYWRIGHT_VERSION=$PLAYWRIGHT_VERSION" >> $GITHUB_ENV

      - name: Cache Playwright Browsers for Playwright's Version
        id: cache-playwright-browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-browsers-${{ env.PLAYWRIGHT_VERSION }}

      - name: Setup Playwright - Browsers and Dependencies
        if: steps.cache-playwright-browsers.outputs.cache-hit != 'true'
        run: pnpm exec playwright install --with-deps chromium

      - name: Setup Playwright - Dependencies-only
        if: steps.cache-playwright-browsers.outputs.cache-hit == 'true'
        run: pnpm exec playwright install-deps chromium

      - name: Runs Template Int Tests
        run: pnpm --filter ${{ matrix.template }} run test:int
        env:
          NODE_OPTIONS: --max-old-space-size=8096
          PAYLOAD_DATABASE: ${{ matrix.database }}
          POSTGRES_URL: ${{ env.POSTGRES_URL }}
          MONGODB_URL: mongodb://localhost:27017/payloadtests

      - name: Runs Template E2E Tests
        run: PLAYWRIGHT_JSON_OUTPUT_NAME=results_${{ matrix.template }}.json pnpm --filter ${{ matrix.template }} test:e2e
        env:
          NODE_OPTIONS: --max-old-space-size=8096
          PAYLOAD_DATABASE: ${{ matrix.database }}
          POSTGRES_URL: ${{ env.POSTGRES_URL }}
          MONGODB_URL: mongodb://localhost:27017/payloadtests
          NEXT_TELEMETRY_DISABLED: 1

  tests-type-generation:
    runs-on: ubuntu-24.04
    needs: [changes, build]
    if: ${{ needs.changes.outputs.needs_tests == 'true' }}
    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup
        with:
          pnpm-run-install: false
          pnpm-restore-cache: false # Full build is restored below

      - name: Restore build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

      - name: Generate Payload Types
        run: pnpm dev:generate-types fields

      - name: Generate GraphQL schema file
        run: pnpm dev:generate-graphql-schema graphql-schema-gen

  all-green:
    name: All Green
    if: always()
    runs-on: ubuntu-24.04
    needs:
      - lint
      - build
      - build-and-test-templates
      - tests-unit
      - tests-int
      - tests-e2e
      - tests-types
      - tests-type-generation

    steps:
      - if: ${{ always() && (contains(needs.*.result, 'failure') || contains(needs.*.result, 'cancelled')) }}
        run: exit 1

  publish-canary:
    name: Publish Canary
    runs-on: ubuntu-24.04
    if: ${{ needs.all-green.result == 'success' && github.ref_name == 'main' }}
    needs:
      - all-green

    steps:
      # debug github.ref output
      - run: |
          echo github.ref: ${{ github.ref }}
          echo isV3: ${{ github.ref == 'refs/heads/main' }}
  analyze:
    runs-on: ubuntu-latest
    needs: [changes, build]
    timeout-minutes: 5
    permissions:
      contents: read # for checkout repository
      actions: read # for fetching base branch bundle stats
      pull-requests: write # for comments
    steps:
      - uses: actions/checkout@v5

      - name: Node setup
        uses: ./.github/actions/setup
        with:
          pnpm-run-install: false
          pnpm-restore-cache: false # Full build is restored below

      - name: Restore build
        uses: actions/cache@v4
        with:
          path: ./*
          key: ${{ github.sha }}

      - run: pnpm run build:bundle-for-analysis # Esbuild packages that haven't already been built in the build step for the purpose of analyzing bundle size
        env:
          DO_NOT_TRACK: 1 # Disable Turbopack telemetry

      - name: Analyze esbuild bundle size
        # Temporarily disable this for community PRs until this can be implemented in a separate workflow
        if: github.event.pull_request.head.repo.fork == false
        uses: exoego/esbuild-bundle-analyzer@v1
        with:
          metafiles: 'packages/payload/meta_index.json,packages/payload/meta_shared.json,packages/ui/meta_client.json,packages/ui/meta_shared.json,packages/next/meta_index.json,packages/richtext-lexical/meta_client.json'
```

--------------------------------------------------------------------------------

---[FILE: post-release-templates.yml]---
Location: payload-main/.github/workflows/post-release-templates.yml
Signals: Next.js, Docker

```yaml
name: post-release-templates

on:
  release:
    types:
      - published
  workflow_dispatch:

env:
  DO_NOT_TRACK: 1 # Disable Turbopack telemetry
  NEXT_TELEMETRY_DISABLED: 1 # Disable Next telemetry

jobs:
  wait_for_release:
    runs-on: ubuntu-24.04
    outputs:
      release_tag: ${{ steps.determine_tag.outputs.release_tag }}
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0
          sparse-checkout: .github/workflows

      - name: Determine Release Tag
        id: determine_tag
        run: |
          if [ "${{ github.event_name }}" == "release" ]; then
            echo "Using tag from release event: ${{ github.event.release.tag_name }}"
            echo "release_tag=${{ github.event.release.tag_name }}" >> "$GITHUB_OUTPUT"
          else
            # pull latest tag from github, must match any version except v2. Should match v3, v4, v99, etc.
            echo "Fetching latest tag from github..."
            LATEST_TAG=$(git describe --tags --abbrev=0 --match 'v[0-9]*' --exclude 'v2*')
            echo "Latest tag: $LATEST_TAG"
            echo "release_tag=$LATEST_TAG" >> "$GITHUB_OUTPUT"
          fi

      - name: Wait until latest versions resolve on npm registry
        run: |
          ./.github/workflows/wait-until-package-version.sh payload ${{ steps.determine_tag.outputs.release_tag }}
          ./.github/workflows/wait-until-package-version.sh @payloadcms/translations ${{ steps.determine_tag.outputs.release_tag }}
          ./.github/workflows/wait-until-package-version.sh @payloadcms/next ${{ steps.determine_tag.outputs.release_tag }}

  update_templates:
    needs: wait_for_release
    runs-on: ubuntu-24.04
    permissions:
      contents: write
      pull-requests: write
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: payloadtests
    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Setup
        uses: ./.github/actions/setup

      - name: Start PostgreSQL
        uses: CasperWA/postgresql-action@v1.2
        with:
          postgresql version: '14' # See https://hub.docker.com/_/postgres for available versions
          postgresql db: ${{ env.POSTGRES_DB }}
          postgresql user: ${{ env.POSTGRES_USER }}
          postgresql password: ${{ env.POSTGRES_PASSWORD }}

      - name: Wait for PostgreSQL
        run: sleep 30

      - name: Configure PostgreSQL
        run: |
          psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" -c "CREATE ROLE runner SUPERUSER LOGIN;"
          psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" -c "SELECT version();"
          echo "POSTGRES_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" >> $GITHUB_ENV
          echo "DATABASE_URI=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB" >> $GITHUB_ENV

      - name: Start MongoDB
        uses: supercharge/mongodb-github-action@1.12.0
        with:
          mongodb-version: 6.0

        # The template generation script runs import map generation which needs the built payload bin scripts
      - run: pnpm run build:all
        env:
          DO_NOT_TRACK: 1 # Disable Turbopack telemetry

      - name: Update template lockfiles and migrations
        run: pnpm script:gen-templates

      - name: Commit and push changes
        id: commit
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          set -ex
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"

          git diff --name-only

          export BRANCH_NAME=templates/bump-${{ needs.wait_for_release.outputs.release_tag }}-$(date +%s)
          echo "branch=$BRANCH_NAME" >> "$GITHUB_OUTPUT"

      - name: Create pull request
        uses: peter-evans/create-pull-request@v7
        with:
          token: ${{ secrets.GH_TOKEN_POST_RELEASE_TEMPLATES }}
          labels: 'area: templates'
          author: github-actions[bot] <github-actions[bot]@users.noreply.github.com>
          commit-message: 'templates: bump templates for ${{ needs.wait_for_release.outputs.release_tag }}'
          branch: ${{ steps.commit.outputs.branch }}
          base: main
          assignees: ${{ github.actor }}
          title: 'templates: bump for ${{ needs.wait_for_release.outputs.release_tag }}'
          body: |
            🤖 Automated bump of templates for ${{ needs.wait_for_release.outputs.release_tag }}

            Triggered by user: @${{ github.actor }}
```

--------------------------------------------------------------------------------

---[FILE: post-release.yml]---
Location: payload-main/.github/workflows/post-release.yml
Signals: Next.js

```yaml
name: post-release

on:
  release:
    types:
      - published
  workflow_dispatch:
    inputs:
      tag:
        description: 'Release tag to process (optional)'
        required: false
        default: ''

env:
  DO_NOT_TRACK: 1 # Disable Turbopack telemetry
  NEXT_TELEMETRY_DISABLED: 1 # Disable Next telemetry
  PAYLOAD_RELEASE_EVENT: payload-release-event

jobs:
  post_release:
    permissions:
      issues: write
      pull-requests: write
    runs-on: ubuntu-24.04
    if: ${{ github.event_name != 'workflow_dispatch' }}
    steps:
      - uses: actions/checkout@v5
      - uses: ./.github/actions/release-commenter
        continue-on-error: true
        env:
          ACTIONS_STEP_DEBUG: true
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          tag-filter: 'v\d'

          # Change to blank to disable commenting
          # comment-template: ''

          comment-template: |
            🚀 This is included in version {release_link}

  github-releases-to-discord:
    runs-on: ubuntu-24.04
    if: ${{ github.event_name != 'workflow_dispatch' }}
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      - name: Github Releases To Discord
        uses: SethCohen/github-releases-to-discord@v1.19.0
        with:
          webhook_url: ${{ secrets.DISCORD_RELEASES_WEBHOOK_URL }}
          color: '16777215'
          username: 'Payload Releases'
          avatar_url: 'https://l4wlsi8vxy8hre4v.public.blob.vercel-storage.com/discord-bot-logo.png'

  notify-website-repo:
    name: Notify website repo
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Dispatch event
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PAYLOAD_REPOSITORY_DISPATCH }}
          repository: payloadcms/website
          event-type: ${{ env.PAYLOAD_RELEASE_EVENT }}
          client-payload: '{"event": {"message": "New Payload Release"}}'
```

--------------------------------------------------------------------------------

---[FILE: pr-title.yml]---
Location: payload-main/.github/workflows/pr-title.yml
Signals: React, Next.js

```yaml
name: pr-title

on:
  pull_request_target:
    types:
      - opened
      - edited

permissions:
  pull-requests: write

jobs:
  main:
    name: lint-pr-title
    runs-on: ubuntu-24.04
    steps:
      - uses: amannn/action-semantic-pull-request@v6
        id: lint_pr_title
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          types: |
            build
            chore
            ci
            docs
            examples
            feat
            fix
            perf
            refactor
            revert
            style
            templates
            test
          scopes: |
            cpa
            claude
            db-\*
            db-d1-sqlite
            db-mongodb
            db-postgres
            db-vercel-postgres
            db-sqlite
            db-d1-sqlite
            drizzle
            email-\*
            email-nodemailer
            email-resend
            eslint
            graphql
            kv
            kv-redis
            live-preview
            live-preview-react
            next
            payload-cloud
            plugin-cloud
            plugin-cloud-storage
            plugin-ecommerce
            plugin-form-builder
            plugin-import-export
            plugin-mcp
            plugin-multi-tenant
            plugin-nested-docs
            plugin-redirects
            plugin-search
            plugin-sentry
            plugin-seo
            plugin-stripe
            richtext-\*
            richtext-lexical
            richtext-slate
            sdk
            storage-\*
            storage-azure
            storage-gcs
            storage-r2
            storage-uploadthing
            storage-vercel-blob
            storage-s3
            translations
            ui
            templates
            examples(\/(\w|-)+)?
            deps

          # Disallow uppercase letters at the beginning of the subject
          subjectPattern: ^(?![A-Z]).+$
          subjectPatternError: |
            The subject "{subject}" found in the pull request title "{title}"
            didn't match the configured pattern. Please ensure that the subject
            doesn't start with an uppercase character.

      - uses: marocchino/sticky-pull-request-comment@v2
        # When the previous steps fails, the workflow would stop. By adding this
        # condition you can continue the execution with the populated error message.
        if: always() && (steps.lint_pr_title.outputs.error_message != null)
        with:
          header: pr-title-lint-error
          message: |
            Pull Request titles must follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) and have valid scopes.

            ${{ steps.lint_pr_title.outputs.error_message }}

            ```
            feat(ui): add Button component
            ^    ^    ^
            |    |    |__ Subject
            |    |_______ Scope
            |____________ Type
            ```

      # Delete a previous comment when the issue has been resolved
      - if: ${{ steps.lint_pr_title.outputs.error_message == null }}
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: pr-title-lint-error
          delete: true

  label-pr-on-open:
    name: label-pr-on-open
    runs-on: ubuntu-24.04
    if: github.event.action == 'opened'
    steps:
      - name: Tag with 2.x branch with v2
        if: github.event.pull_request.base.ref == '2.x'
        uses: actions-ecosystem/action-add-labels@v1
        with:
          labels: v2
```

--------------------------------------------------------------------------------

---[FILE: publish-prerelease.yml]---
Location: payload-main/.github/workflows/publish-prerelease.yml
Signals: Next.js

```yaml
name: publish-prerelease

on:
  schedule:
    # Run nightly at 10pm EST
    - cron: '0 3 * * *'
  workflow_dispatch:
    inputs:
      debug_build:
        description: 'Enable debug build (uses internal-debug tag and pnpm build:debug)'
        required: false
        default: false
        type: boolean

env:
  DO_NOT_TRACK: 1 # Disable Turbopack telemetry
  NEXT_TELEMETRY_DISABLED: 1 # Disable Next telemetry

jobs:
  release:
    name: publish-prerelease-${{ github.ref_name }}-${{ github.sha }}
    permissions:
      id-token: write
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      - name: Setup
        uses: ./.github/actions/setup
      - name: Load npm token
        run: echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Determine release type and debug flag
        id: determine_release_type
        # Use 'internal-debug' if debug mode, 'canary' for main branch, 'internal' for others
        run: |
          if [[ "${{ inputs.debug_build }}" == "true" ]]; then
            echo "release_type=internal-debug" >> $GITHUB_OUTPUT
            echo "debug_flag=--debug" >> $GITHUB_OUTPUT
          elif [[ ${{ github.ref_name }} == "main" ]]; then
            echo "release_type=canary" >> $GITHUB_OUTPUT
            echo "debug_flag=" >> $GITHUB_OUTPUT
          else
            echo "release_type=internal" >> $GITHUB_OUTPUT
            echo "debug_flag=" >> $GITHUB_OUTPUT
          fi

      - name: Release
        run: pnpm publish-prerelease --tag ${{ steps.determine_release_type.outputs.release_type }} ${{ steps.determine_release_type.outputs.debug_flag }}
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NPM_CONFIG_PROVENANCE: true
```

--------------------------------------------------------------------------------

---[FILE: stale.yml]---
Location: payload-main/.github/workflows/stale.yml

```yaml
name: stale

on:
  schedule:
    # Run nightly at 1am EST, staggered with lock-issues workflow
    - cron: '0 6 * * *'

  workflow_dispatch:
    inputs:
      dry-run:
        description: Run the stale action in debug-only mode
        default: false
        required: false
        type: boolean

jobs:
  stale:
    runs-on: ubuntu-24.04
    permissions:
      issues: write
      pull-requests: write
    steps:
      - uses: actions/stale@v9
        id: stale
        with:
          debug-only: ${{ inputs.dry-run || false }}

          days-before-stale: 30
          days-before-close: -1 # Disable closing
          ascending: true
          operations-per-run: 300
          exempt-all-assignees: true

          # Issues
          stale-issue-label: stale
          exempt-issue-labels: 'prioritized,keep,created-by: Payload team,created-by: Contributor,status: verified'
          stale-issue-message: ''

          close-issue-message: |
            This issue was automatically closed due to lack of activity.

          # Pull Requests
          stale-pr-label: stale
          exempt-pr-labels: 'prioritized,keep,created-by: Payload team,created-by: Contributor'
          stale-pr-message: ''
          close-pr-message: |
            This pull request was automatically closed due to lack of activity.

      # TODO: Add a step to notify team
      - name: Print outputs
        run: echo ${{ format('{0},{1}', toJSON(steps.stale.outputs.staled-issues-prs), toJSON(steps.stale.outputs.closed-issues-prs)) }}
```

--------------------------------------------------------------------------------

````
