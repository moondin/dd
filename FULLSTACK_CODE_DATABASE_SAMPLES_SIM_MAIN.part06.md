---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 6
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 6 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: ci.yml]---
Location: sim-main/.github/workflows/ci.yml
Signals: Docker

```yaml
name: CI

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: false

jobs:
  test-build:
    name: Test and Build
    uses: ./.github/workflows/test-build.yml
    secrets: inherit

  # Detect if this is a version release commit (e.g., "v0.5.24: ...")
  detect-version:
    name: Detect Version
    runs-on: blacksmith-4vcpu-ubuntu-2404
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging')
    outputs:
      version: ${{ steps.extract.outputs.version }}
      is_release: ${{ steps.extract.outputs.is_release }}
    steps:
      - name: Extract version from commit message
        id: extract
        run: |
          COMMIT_MSG="${{ github.event.head_commit.message }}"
          # Only tag versions on main branch
          if [ "${{ github.ref }}" = "refs/heads/main" ] && [[ "$COMMIT_MSG" =~ ^(v[0-9]+\.[0-9]+\.[0-9]+): ]]; then
            VERSION="${BASH_REMATCH[1]}"
            echo "version=${VERSION}" >> $GITHUB_OUTPUT
            echo "is_release=true" >> $GITHUB_OUTPUT
            echo "✅ Detected release commit: ${VERSION}"
          else
            echo "version=" >> $GITHUB_OUTPUT
            echo "is_release=false" >> $GITHUB_OUTPUT
            echo "ℹ️ Not a release commit"
          fi

  # Build AMD64 images and push to ECR immediately (+ GHCR for main)
  build-amd64:
    name: Build AMD64
    needs: [test-build, detect-version]
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging')
    runs-on: blacksmith-8vcpu-ubuntu-2404
    permissions:
      contents: read
      packages: write
      id-token: write
    strategy:
      fail-fast: false
      matrix:
        include:
          - dockerfile: ./docker/app.Dockerfile
            ghcr_image: ghcr.io/simstudioai/simstudio
            ecr_repo_secret: ECR_APP
          - dockerfile: ./docker/db.Dockerfile
            ghcr_image: ghcr.io/simstudioai/migrations
            ecr_repo_secret: ECR_MIGRATIONS
          - dockerfile: ./docker/realtime.Dockerfile
            ghcr_image: ghcr.io/simstudioai/realtime
            ecr_repo_secret: ECR_REALTIME
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ github.ref == 'refs/heads/main' && secrets.AWS_ROLE_TO_ASSUME || secrets.STAGING_AWS_ROLE_TO_ASSUME }}
          aws-region: ${{ github.ref == 'refs/heads/main' && secrets.AWS_REGION || secrets.STAGING_AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Login to GHCR
        if: github.ref == 'refs/heads/main'
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: useblacksmith/setup-docker-builder@v1

      - name: Generate tags
        id: meta
        run: |
          ECR_REGISTRY="${{ steps.login-ecr.outputs.registry }}"
          ECR_REPO="${{ secrets[matrix.ecr_repo_secret] }}"
          GHCR_IMAGE="${{ matrix.ghcr_image }}"

          # ECR tags (always build for ECR)
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            ECR_TAG="latest"
          else
            ECR_TAG="staging"
          fi
          ECR_IMAGE="${ECR_REGISTRY}/${ECR_REPO}:${ECR_TAG}"

          # Build tags list
          TAGS="${ECR_IMAGE}"

          # Add GHCR tags only for main branch
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            GHCR_AMD64="${GHCR_IMAGE}:latest-amd64"
            GHCR_SHA="${GHCR_IMAGE}:${{ github.sha }}-amd64"
            TAGS="${TAGS},$GHCR_AMD64,$GHCR_SHA"

            # Add version tag if this is a release commit
            if [ "${{ needs.detect-version.outputs.is_release }}" = "true" ]; then
              VERSION="${{ needs.detect-version.outputs.version }}"
              GHCR_VERSION="${GHCR_IMAGE}:${VERSION}-amd64"
              TAGS="${TAGS},$GHCR_VERSION"
              echo "📦 Adding version tag: ${VERSION}-amd64"
            fi
          fi

          echo "tags=${TAGS}" >> $GITHUB_OUTPUT

      - name: Build and push images
        uses: useblacksmith/build-push-action@v2
        with:
          context: .
          file: ${{ matrix.dockerfile }}
          platforms: linux/amd64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          provenance: false
          sbom: false

  # Build ARM64 images for GHCR (main branch only, runs in parallel)
  build-ghcr-arm64:
    name: Build ARM64 (GHCR Only)
    needs: [test-build, detect-version]
    runs-on: blacksmith-8vcpu-ubuntu-2404-arm
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    strategy:
      fail-fast: false
      matrix:
        include:
          - dockerfile: ./docker/app.Dockerfile
            image: ghcr.io/simstudioai/simstudio
          - dockerfile: ./docker/db.Dockerfile
            image: ghcr.io/simstudioai/migrations
          - dockerfile: ./docker/realtime.Dockerfile
            image: ghcr.io/simstudioai/realtime

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: useblacksmith/setup-docker-builder@v1

      - name: Generate ARM64 tags
        id: meta
        run: |
          IMAGE="${{ matrix.image }}"
          TAGS="${IMAGE}:latest-arm64,${IMAGE}:${{ github.sha }}-arm64"

          # Add version tag if this is a release commit
          if [ "${{ needs.detect-version.outputs.is_release }}" = "true" ]; then
            VERSION="${{ needs.detect-version.outputs.version }}"
            TAGS="${TAGS},${IMAGE}:${VERSION}-arm64"
            echo "📦 Adding version tag: ${VERSION}-arm64"
          fi

          echo "tags=${TAGS}" >> $GITHUB_OUTPUT

      - name: Build and push ARM64 to GHCR
        uses: useblacksmith/build-push-action@v2
        with:
          context: .
          file: ${{ matrix.dockerfile }}
          platforms: linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          provenance: false
          sbom: false

  # Create GHCR multi-arch manifests (only for main, after both builds)
  create-ghcr-manifests:
    name: Create GHCR Manifests
    runs-on: blacksmith-2vcpu-ubuntu-2404
    needs: [build-amd64, build-ghcr-arm64, detect-version]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions:
      packages: write
    strategy:
      matrix:
        include:
          - image: ghcr.io/simstudioai/simstudio
          - image: ghcr.io/simstudioai/migrations
          - image: ghcr.io/simstudioai/realtime

    steps:
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Create and push manifests
        run: |
          IMAGE_BASE="${{ matrix.image }}"

          # Create latest manifest
          docker manifest create "${IMAGE_BASE}:latest" \
            "${IMAGE_BASE}:latest-amd64" \
            "${IMAGE_BASE}:latest-arm64"
          docker manifest push "${IMAGE_BASE}:latest"

          # Create SHA manifest
          docker manifest create "${IMAGE_BASE}:${{ github.sha }}" \
            "${IMAGE_BASE}:${{ github.sha }}-amd64" \
            "${IMAGE_BASE}:${{ github.sha }}-arm64"
          docker manifest push "${IMAGE_BASE}:${{ github.sha }}"

          # Create version manifest if this is a release commit
          if [ "${{ needs.detect-version.outputs.is_release }}" = "true" ]; then
            VERSION="${{ needs.detect-version.outputs.version }}"
            echo "📦 Creating version manifest: ${VERSION}"
            docker manifest create "${IMAGE_BASE}:${VERSION}" \
              "${IMAGE_BASE}:${VERSION}-amd64" \
              "${IMAGE_BASE}:${VERSION}-arm64"
            docker manifest push "${IMAGE_BASE}:${VERSION}"
          fi

  # Check if docs changed
  check-docs-changes:
    name: Check Docs Changes
    runs-on: blacksmith-4vcpu-ubuntu-2404
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    outputs:
      docs_changed: ${{ steps.filter.outputs.docs }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2  # Need at least 2 commits to detect changes
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            docs:
              - 'apps/docs/content/docs/en/**'
              - 'apps/sim/scripts/process-docs.ts'
              - 'apps/sim/lib/chunkers/**'

  # Process docs embeddings (only when docs change, after ECR images are pushed)
  process-docs:
    name: Process Docs
    needs: [build-amd64, check-docs-changes]
    if: needs.check-docs-changes.outputs.docs_changed == 'true'
    uses: ./.github/workflows/docs-embeddings.yml
    secrets: inherit
```

--------------------------------------------------------------------------------

---[FILE: docs-embeddings.yml]---
Location: sim-main/.github/workflows/docs-embeddings.yml

```yaml
name: Process Docs Embeddings

on:
  workflow_call:
  workflow_dispatch: # Allow manual triggering

jobs:
  process-docs-embeddings:
    name: Process Documentation Embeddings
    runs-on: blacksmith-8vcpu-ubuntu-2404
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: latest

      - name: Cache Bun dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            node_modules
            **/node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Process docs embeddings
        working-directory: ./apps/sim
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: bun run scripts/process-docs.ts --clear
```

--------------------------------------------------------------------------------

---[FILE: i18n.yml]---
Location: sim-main/.github/workflows/i18n.yml

```yaml
name: 'Auto-translate Documentation'

on:
  push:
    branches: [ staging ]
    paths:
      - 'apps/docs/content/docs/en/**'
      - 'apps/docs/i18n.json'

permissions:
  contents: write
  pull-requests: write

jobs:
  translate:
    runs-on: blacksmith-4vcpu-ubuntu-2404
    if: github.actor != 'github-actions[bot]' # Prevent infinite loops
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GH_PAT }}
          fetch-depth: 0

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - name: Cache Bun dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            node_modules
            **/node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Run Lingo.dev translations
        env:
          LINGODOTDEV_API_KEY: ${{ secrets.LINGODOTDEV_API_KEY }}
        run: |
          cd apps/docs
          bunx lingo.dev@latest i18n
      
      - name: Check for translation changes
        id: changes
        run: |
          cd apps/docs
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          
          if [ -n "$(git status --porcelain content/docs)" ]; then
            echo "changes=true" >> $GITHUB_OUTPUT
          else
            echo "changes=false" >> $GITHUB_OUTPUT
          fi
      
      - name: Create Pull Request with translations
        if: steps.changes.outputs.changes == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GH_PAT }}
          commit-message: "feat(i18n): update translations"
          title: "feat(i18n): update translations"
          body: |
            ## Summary
            Automated translation updates triggered by changes to documentation.
            
            This PR was automatically created after content changes were made, updating translations for all supported languages using Lingo.dev AI translation engine.
            
            **Original trigger**: ${{ github.event.head_commit.message }}
            **Commit**: ${{ github.sha }}
            **Workflow**: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
            
            ## Type of Change
            - [ ] Bug fix
            - [ ] New feature  
            - [ ] Breaking change
            - [x] Documentation
            - [ ] Other: ___________
            
            ## Testing
            This PR includes automated translations for modified English documentation content:
            - 🇪🇸 Spanish (es) translations
            - 🇫🇷 French (fr) translations
            - 🇨🇳 Chinese (zh) translations
            - 🇯🇵 Japanese (ja) translations
            - 🇩🇪 German (de) translations
            
            **What reviewers should focus on:**
            - Verify translated content accuracy and context
            - Check that all links and references work correctly in translated versions
            - Ensure formatting, code blocks, and structure are preserved
            - Validate that technical terms are appropriately translated
            
            ## Checklist
            - [x] Code follows project style guidelines (automated translation)
            - [x] Self-reviewed my changes (automated process)
            - [ ] Tests added/updated and passing
            - [x] No new warnings introduced
            - [x] I confirm that I have read and agree to the terms outlined in the [Contributor License Agreement (CLA)](./CONTRIBUTING.md#contributor-license-agreement-cla)
            
            ## Screenshots/Videos
            <!-- Translation changes are text-based - no visual changes expected -->
            <!-- Reviewers should check the documentation site renders correctly for all languages -->
          branch: auto-translate/staging-merge-${{ github.run_id }}
          base: staging
          labels: |
            i18n

  verify-translations:
    needs: translate
    runs-on: blacksmith-4vcpu-ubuntu-2404
    if: always() # Run even if translation fails
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          ref: staging

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - name: Cache Bun dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            node_modules
            **/node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: |
          cd apps/docs
          bun install --frozen-lockfile

      - name: Build documentation to verify translations
        run: |
          cd apps/docs
          bun run build

      - name: Report translation status
        run: |
          cd apps/docs
          echo "## Translation Status Report" >> $GITHUB_STEP_SUMMARY
          echo "**Triggered by merge to staging branch**" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          
          en_count=$(find content/docs/en -name "*.mdx" | wc -l)
          es_count=$(find content/docs/es -name "*.mdx" 2>/dev/null | wc -l || echo 0)
          fr_count=$(find content/docs/fr -name "*.mdx" 2>/dev/null | wc -l || echo 0)
          zh_count=$(find content/docs/zh -name "*.mdx" 2>/dev/null | wc -l || echo 0)
          ja_count=$(find content/docs/ja -name "*.mdx" 2>/dev/null | wc -l || echo 0)
          de_count=$(find content/docs/de -name "*.mdx" 2>/dev/null | wc -l || echo 0)
          
          es_percentage=$((es_count * 100 / en_count))
          fr_percentage=$((fr_count * 100 / en_count))
          zh_percentage=$((zh_count * 100 / en_count))
          ja_percentage=$((ja_count * 100 / en_count))
          de_percentage=$((de_count * 100 / en_count))
          
          echo "### Coverage Statistics" >> $GITHUB_STEP_SUMMARY
          echo "- **🇬🇧 English**: $en_count files (source)" >> $GITHUB_STEP_SUMMARY
          echo "- **🇪🇸 Spanish**: $es_count/$en_count files ($es_percentage%)" >> $GITHUB_STEP_SUMMARY
          echo "- **🇫🇷 French**: $fr_count/$en_count files ($fr_percentage%)" >> $GITHUB_STEP_SUMMARY
          echo "- **🇨🇳 Chinese**: $zh_count/$en_count files ($zh_percentage%)" >> $GITHUB_STEP_SUMMARY
          echo "- **🇯🇵 Japanese**: $ja_count/$en_count files ($ja_percentage%)" >> $GITHUB_STEP_SUMMARY
          echo "- **🇩🇪 German**: $de_count/$en_count files ($de_percentage%)" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "🔄 **Auto-translation PR**: Check for new pull request with updated translations" >> $GITHUB_STEP_SUMMARY
```

--------------------------------------------------------------------------------

---[FILE: images.yml]---
Location: sim-main/.github/workflows/images.yml
Signals: Docker

```yaml
name: Build and Push Images

on:
  workflow_call:
  workflow_dispatch:

permissions:
  contents: read
  packages: write
  id-token: write

jobs:
  build-amd64:
    name: Build AMD64
    runs-on: blacksmith-8vcpu-ubuntu-2404
    strategy:
      fail-fast: false
      matrix:
        include:
          - dockerfile: ./docker/app.Dockerfile
            ghcr_image: ghcr.io/simstudioai/simstudio
            ecr_repo_secret: ECR_APP
          - dockerfile: ./docker/db.Dockerfile
            ghcr_image: ghcr.io/simstudioai/migrations
            ecr_repo_secret: ECR_MIGRATIONS
          - dockerfile: ./docker/realtime.Dockerfile
            ghcr_image: ghcr.io/simstudioai/realtime
            ecr_repo_secret: ECR_REALTIME
    outputs:
      registry: ${{ steps.login-ecr.outputs.registry }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ github.ref == 'refs/heads/main' && secrets.AWS_ROLE_TO_ASSUME || secrets.STAGING_AWS_ROLE_TO_ASSUME }}
          aws-region: ${{ github.ref == 'refs/heads/main' && secrets.AWS_REGION || secrets.STAGING_AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Login to GHCR
        if: github.ref == 'refs/heads/main'
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: useblacksmith/setup-docker-builder@v1

      - name: Generate tags
        id: meta
        run: |
          ECR_REGISTRY="${{ steps.login-ecr.outputs.registry }}"
          ECR_REPO="${{ secrets[matrix.ecr_repo_secret] }}"
          GHCR_IMAGE="${{ matrix.ghcr_image }}"

          # ECR tags (always build for ECR)
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            ECR_TAG="latest"
          else
            ECR_TAG="staging"
          fi
          ECR_IMAGE="${ECR_REGISTRY}/${ECR_REPO}:${ECR_TAG}"

          # Build tags list
          TAGS="${ECR_IMAGE}"

          # Add GHCR tags only for main branch
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            GHCR_AMD64="${GHCR_IMAGE}:latest-amd64"
            GHCR_SHA="${GHCR_IMAGE}:${{ github.sha }}-amd64"
            TAGS="${TAGS},$GHCR_AMD64,$GHCR_SHA"
          fi

          echo "tags=${TAGS}" >> $GITHUB_OUTPUT

      - name: Build and push images
        uses: useblacksmith/build-push-action@v2
        with:
          context: .
          file: ${{ matrix.dockerfile }}
          platforms: linux/amd64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          provenance: false
          sbom: false

  build-ghcr-arm64:
    name: Build ARM64 (GHCR Only)
    runs-on: blacksmith-8vcpu-ubuntu-2404-arm
    if: github.ref == 'refs/heads/main'
    strategy:
      fail-fast: false
      matrix:
        include:
          - dockerfile: ./docker/app.Dockerfile
            image: ghcr.io/simstudioai/simstudio
          - dockerfile: ./docker/db.Dockerfile
            image: ghcr.io/simstudioai/migrations
          - dockerfile: ./docker/realtime.Dockerfile
            image: ghcr.io/simstudioai/realtime

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: useblacksmith/setup-docker-builder@v1

      - name: Generate ARM64 tags
        id: meta
        run: |
          IMAGE="${{ matrix.image }}"
          echo "tags=${IMAGE}:latest-arm64,${IMAGE}:${{ github.sha }}-arm64" >> $GITHUB_OUTPUT

      - name: Build and push ARM64 to GHCR
        uses: useblacksmith/build-push-action@v2
        with:
          context: .
          file: ${{ matrix.dockerfile }}
          platforms: linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          provenance: false
          sbom: false

  create-ghcr-manifests:
    name: Create GHCR Manifests
    runs-on: blacksmith-8vcpu-ubuntu-2404
    needs: [build-amd64, build-ghcr-arm64]
    if: github.ref == 'refs/heads/main'
    strategy:
      matrix:
        include:
          - image: ghcr.io/simstudioai/simstudio
          - image: ghcr.io/simstudioai/migrations
          - image: ghcr.io/simstudioai/realtime

    steps:
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Create and push manifests
        run: |
          IMAGE_BASE="${{ matrix.image }}"

          # Create latest manifest
          docker manifest create "${IMAGE_BASE}:latest" \
            "${IMAGE_BASE}:latest-amd64" \
            "${IMAGE_BASE}:latest-arm64"
          docker manifest push "${IMAGE_BASE}:latest"

          # Create SHA manifest
          docker manifest create "${IMAGE_BASE}:${{ github.sha }}" \
            "${IMAGE_BASE}:${{ github.sha }}-amd64" \
            "${IMAGE_BASE}:${{ github.sha }}-arm64"
          docker manifest push "${IMAGE_BASE}:${{ github.sha }}"
```

--------------------------------------------------------------------------------

---[FILE: migrations.yml]---
Location: sim-main/.github/workflows/migrations.yml

```yaml
name: Database Migrations

on:
  workflow_call:
  workflow_dispatch:

jobs:
  migrate:
    name: Apply Database Migrations
    runs-on: blacksmith-4vcpu-ubuntu-2404

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - name: Cache Bun dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            node_modules
            **/node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Apply migrations
        working-directory: ./packages/db
        env:
          DATABASE_URL: ${{ github.ref == 'refs/heads/main' && secrets.DATABASE_URL || secrets.STAGING_DATABASE_URL }}
        run: bunx drizzle-kit migrate --config=./drizzle.config.ts
```

--------------------------------------------------------------------------------

---[FILE: publish-cli.yml]---
Location: sim-main/.github/workflows/publish-cli.yml

```yaml
name: Publish CLI Package

on:
  push:
    branches: [main]
    paths:
      - 'packages/cli/**'

jobs:
  publish-npm:
    runs-on: blacksmith-4vcpu-ubuntu-2404
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - name: Setup Node.js for npm publishing
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org/'

      - name: Cache Bun dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            node_modules
            **/node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        working-directory: packages/cli
        run: bun install --frozen-lockfile

      - name: Build package
        working-directory: packages/cli
        run: bun run build

      - name: Get package version
        id: package_version
        working-directory: packages/cli
        run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

      - name: Check if version already exists
        id: version_check
        run: |
          if npm view simstudio@${{ steps.package_version.outputs.version }} version &> /dev/null; then
            echo "exists=true" >> $GITHUB_OUTPUT
          else
            echo "exists=false" >> $GITHUB_OUTPUT
          fi

      - name: Publish to npm
        if: steps.version_check.outputs.exists == 'false'
        working-directory: packages/cli
        run: npm publish --access=public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Log skipped publish
        if: steps.version_check.outputs.exists == 'true'
        run: echo "Skipped publishing because version ${{ steps.package_version.outputs.version }} already exists on npm"
```

--------------------------------------------------------------------------------

---[FILE: publish-python-sdk.yml]---
Location: sim-main/.github/workflows/publish-python-sdk.yml

```yaml
name: Publish Python SDK

on:
  push:
    branches: [main]
    paths:
      - 'packages/python-sdk/**'

jobs:
  publish-pypi:
    runs-on: blacksmith-4vcpu-ubuntu-2404
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install build dependencies
        run: |
          python -m pip install --upgrade pip
          pip install build twine pytest requests tomli

      - name: Run tests
        working-directory: packages/python-sdk
        run: |
          PYTHONPATH=. pytest tests/ -v

      - name: Get package version
        id: package_version
        working-directory: packages/python-sdk
        run: echo "version=$(python -c "import tomli; print(tomli.load(open('pyproject.toml', 'rb'))['project']['version'])")" >> $GITHUB_OUTPUT

      - name: Check if version already exists
        id: version_check
        run: |
          if pip index versions simstudio-sdk | grep -q "${{ steps.package_version.outputs.version }}"; then
            echo "exists=true" >> $GITHUB_OUTPUT
          else
            echo "exists=false" >> $GITHUB_OUTPUT
          fi

      - name: Build package
        if: steps.version_check.outputs.exists == 'false'
        working-directory: packages/python-sdk
        run: python -m build

      - name: Check package
        if: steps.version_check.outputs.exists == 'false'
        working-directory: packages/python-sdk
        run: twine check dist/*

      - name: Publish to PyPI
        if: steps.version_check.outputs.exists == 'false'
        working-directory: packages/python-sdk
        env:
          TWINE_USERNAME: __token__
          TWINE_PASSWORD: ${{ secrets.PYPI_API_TOKEN }}
        run: twine upload dist/*

      - name: Log skipped publish
        if: steps.version_check.outputs.exists == 'true'
        run: echo "Skipped publishing because version ${{ steps.package_version.outputs.version }} already exists on PyPI"

      - name: Create GitHub Release
        if: steps.version_check.outputs.exists == 'false'
        uses: softprops/action-gh-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: python-sdk-v${{ steps.package_version.outputs.version }}
          name: Python SDK v${{ steps.package_version.outputs.version }}
          body: |
            ## Python SDK v${{ steps.package_version.outputs.version }}
            
            Published simstudio-sdk==${{ steps.package_version.outputs.version }} to PyPI.
            
            ### Installation
            ```bash
            pip install simstudio-sdk==${{ steps.package_version.outputs.version }}
            ```
            
            ### Documentation
            See the [README](https://github.com/simstudioai/sim/tree/main/packages/python-sdk) or the [docs](https://docs.sim.ai/sdks/python) for more information.
          draft: false
          prerelease: false
```

--------------------------------------------------------------------------------

---[FILE: publish-ts-sdk.yml]---
Location: sim-main/.github/workflows/publish-ts-sdk.yml

```yaml
name: Publish TypeScript SDK

on:
  push:
    branches: [main]
    paths:
      - 'packages/ts-sdk/**'

jobs:
  publish-npm:
    runs-on: blacksmith-4vcpu-ubuntu-2404
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - name: Setup Node.js for npm publishing
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org/'

      - name: Cache Bun dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            node_modules
            **/node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run tests
        working-directory: packages/ts-sdk
        run: bun run test

      - name: Build package
        working-directory: packages/ts-sdk
        run: bun run build

      - name: Get package version
        id: package_version
        working-directory: packages/ts-sdk
        run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

      - name: Check if version already exists
        id: version_check
        run: |
          if npm view simstudio-ts-sdk@${{ steps.package_version.outputs.version }} version &> /dev/null; then
            echo "exists=true" >> $GITHUB_OUTPUT
          else
            echo "exists=false" >> $GITHUB_OUTPUT
          fi

      - name: Publish to npm
        if: steps.version_check.outputs.exists == 'false'
        working-directory: packages/ts-sdk
        run: npm publish --access=public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Log skipped publish
        if: steps.version_check.outputs.exists == 'true'
        run: echo "Skipped publishing because version ${{ steps.package_version.outputs.version }} already exists on npm"

      - name: Create GitHub Release
        if: steps.version_check.outputs.exists == 'false'
        uses: softprops/action-gh-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: typescript-sdk-v${{ steps.package_version.outputs.version }}
          name: TypeScript SDK v${{ steps.package_version.outputs.version }}
          body: |
            ## TypeScript SDK v${{ steps.package_version.outputs.version }}
            
            Published simstudio-ts-sdk@${{ steps.package_version.outputs.version }} to npm.
            
            ### Installation
            ```bash
            npm install simstudio-ts-sdk@${{ steps.package_version.outputs.version }}
            ```
            
            ### Documentation
            See the [README](https://github.com/simstudioai/sim/tree/main/packages/ts-sdk) or the [docs](https://docs.sim.ai/sdks/typescript) for more information.
          draft: false
          prerelease: false
```

--------------------------------------------------------------------------------

---[FILE: test-build.yml]---
Location: sim-main/.github/workflows/test-build.yml

```yaml
name: Test and Build

on:
  workflow_call:
  workflow_dispatch:

jobs:
  test-build:
    name: Test and Build
    runs-on: blacksmith-4vcpu-ubuntu-2404

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.3

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: latest

      - name: Cache Bun dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            node_modules
            **/node_modules
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lock') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint code
        run: bun run lint:check

      - name: Run tests with coverage
        env:
          NODE_OPTIONS: '--no-warnings'
          NEXT_PUBLIC_APP_URL: 'https://www.sim.ai'
          DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/simstudio'
          ENCRYPTION_KEY: '7cf672e460e430c1fba707575c2b0e2ad5a99dddf9b7b7e3b5646e630861db1c' # dummy key for CI only
        run: bun run test

      - name: Build application
        env:
          NODE_OPTIONS: '--no-warnings'
          NEXT_PUBLIC_APP_URL: 'https://www.sim.ai'
          DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/simstudio'
          STRIPE_SECRET_KEY: 'dummy_key_for_ci_only'
          STRIPE_WEBHOOK_SECRET: 'dummy_secret_for_ci_only'
          RESEND_API_KEY: 'dummy_key_for_ci_only'
          AWS_REGION: 'us-west-2'
          ENCRYPTION_KEY: '7cf672e460e430c1fba707575c2b0e2ad5a99dddf9b7b7e3b5646e630861db1c' # dummy key for CI only
        run: bun run build

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v5
        with:
          directory: ./apps/sim/coverage
          fail_ci_if_error: false
          verbose: true
```

--------------------------------------------------------------------------------

---[FILE: pre-commit]---
Location: sim-main/.husky/pre-commit

```text
bunx lint-staged
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: sim-main/apps/docs/.gitignore

```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules

# bun specific
.bun
bun.lockb
bun-debug.log*

# testing
/coverage

# next.js
/.next/
/out/
/build

# misc
.DS_Store
*.pem

# env files
.env
*.env
.env.local
.env.development
.env.test
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# Fumadocs
/.source/
```

--------------------------------------------------------------------------------

---[FILE: cli.json]---
Location: sim-main/apps/docs/cli.json

```json
{
  "aliases": {
    "uiDir": "./components/ui",
    "componentsDir": "./components",
    "blockDir": "./components",
    "cssDir": "./styles",
    "libDir": "./lib"
  },
  "baseDir": "",
  "commands": {}
}
```

--------------------------------------------------------------------------------

---[FILE: i18n.json]---
Location: sim-main/apps/docs/i18n.json

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "zh", "ja", "de"]
  },
  "buckets": {
    "mdx": {
      "include": [
        "content/docs/[locale]/*.mdx",
        "content/docs/[locale]/*/*.mdx",
        "content/docs/[locale]/*/*/*.mdx"
      ]
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: next.config.ts]---
Location: sim-main/apps/docs/next.config.ts

```typescript
import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/introduction',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ]
  },
}

export default withMDX(config)
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: sim-main/apps/docs/package.json
Signals: React, Next.js

```json
{
  "name": "docs",
  "version": "0.0.0",
  "private": true,
  "license": "Apache-2.0",
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "fumadocs-mdx && NODE_OPTIONS='--max-old-space-size=8192' next build",
    "start": "next start",
    "postinstall": "fumadocs-mdx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@tabler/icons-react": "^3.31.0",
    "@vercel/og": "^0.6.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "fumadocs-core": "16.2.3",
    "fumadocs-mdx": "14.1.0",
    "fumadocs-ui": "16.2.3",
    "lucide-react": "^0.511.0",
    "next": "16.1.0-canary.21",
    "next-themes": "^0.4.6",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.12",
    "@types/mdx": "^2.0.13",
    "@types/node": "^22.14.1",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.0.4",
    "dotenv-cli": "^8.0.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.0.12",
    "typescript": "^5.8.2"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postcss.config.mjs]---
Location: sim-main/apps/docs/postcss.config.mjs

```text
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

--------------------------------------------------------------------------------

````
