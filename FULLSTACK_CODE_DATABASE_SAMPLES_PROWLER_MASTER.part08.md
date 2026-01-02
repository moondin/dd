---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 8
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 8 of 867)

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

---[FILE: prepare-release.yml]---
Location: prowler-master/.github/workflows/prepare-release.yml
Signals: Next.js

```yaml
name: 'Tools: Prepare Release'

run-name: 'Prepare Release for Prowler ${{ inputs.prowler_version }}'

on:
  workflow_dispatch:
    inputs:
      prowler_version:
        description: 'Prowler version to release (e.g., 5.9.0)'
        required: true
        type: string

concurrency:
  group: ${{ github.workflow }}-${{ inputs.prowler_version }}
  cancel-in-progress: false

env:
  PROWLER_VERSION: ${{ inputs.prowler_version }}

jobs:
  prepare-release:
    if: github.event_name == 'workflow_dispatch' && github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write
      pull-requests: write
    steps:
    - name: Checkout repository
      uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
      with:
        fetch-depth: 0
        token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}

    - name: Set up Python
      uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
      with:
        python-version: '3.12'

    - name: Install Poetry
      run: |
        python3 -m pip install --user poetry==2.1.1
        echo "$HOME/.local/bin" >> $GITHUB_PATH

    - name: Configure Git
      run: |
        git config --global user.name 'prowler-bot'
        git config --global user.email '179230569+prowler-bot@users.noreply.github.com'

    - name: Parse version and determine branch
      run: |
        # Validate version format (reusing pattern from sdk-bump-version.yml)
        if [[ $PROWLER_VERSION =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
          MAJOR_VERSION=${BASH_REMATCH[1]}
          MINOR_VERSION=${BASH_REMATCH[2]}
          PATCH_VERSION=${BASH_REMATCH[3]}

          # Export version components to environment
          echo "MAJOR_VERSION=${MAJOR_VERSION}" >> "${GITHUB_ENV}"
          echo "MINOR_VERSION=${MINOR_VERSION}" >> "${GITHUB_ENV}"
          echo "PATCH_VERSION=${PATCH_VERSION}" >> "${GITHUB_ENV}"

          # Determine branch name (format: v5.9)
          BRANCH_NAME="v${MAJOR_VERSION}.${MINOR_VERSION}"
          echo "BRANCH_NAME=${BRANCH_NAME}" >> "${GITHUB_ENV}"

          echo "Prowler version: $PROWLER_VERSION"
          echo "Branch name: $BRANCH_NAME"
          echo "Is minor release: $([ $PATCH_VERSION -eq 0 ] && echo 'true' || echo 'false')"
        else
          echo "Invalid version syntax: '$PROWLER_VERSION' (must be N.N.N)" >&2
          exit 1
        fi

    - name: Checkout release branch
      run: |
        echo "Checking out branch $BRANCH_NAME for release $PROWLER_VERSION..."
        if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
          echo "Branch $BRANCH_NAME exists locally, checking out..."
          git checkout "$BRANCH_NAME"
        elif git show-ref --verify --quiet "refs/remotes/origin/$BRANCH_NAME"; then
          echo "Branch $BRANCH_NAME exists remotely, checking out..."
          git checkout -b "$BRANCH_NAME" "origin/$BRANCH_NAME"
        else
          echo "ERROR: Branch $BRANCH_NAME does not exist. For minor releases (X.Y.0), create it manually first. For patch releases (X.Y.Z), the branch should already exist."
          exit 1
        fi

    - name: Read changelog versions from release branch
      run: |
        # Function to extract the version for a specific Prowler release from changelog
        # This looks for entries with "(Prowler X.Y.Z)" to find the released version
        extract_version_for_release() {
          local changelog_file="$1"
          local prowler_version="$2"
          if [ -f "$changelog_file" ]; then
            # Extract version that matches this Prowler release
            # Format: ## [version] (Prowler X.Y.Z) or ## [vversion] (Prowler vX.Y.Z)
            local version=$(grep '^## \[' "$changelog_file" | grep "(Prowler v\?${prowler_version})" | head -1 | sed 's/^## \[\(.*\)\].*/\1/' | sed 's/^v//' | tr -d '[:space:]')
            echo "$version"
          else
            echo ""
          fi
        }

        # Read versions from changelogs for this specific Prowler release
        SDK_VERSION=$(extract_version_for_release "prowler/CHANGELOG.md" "$PROWLER_VERSION")
        API_VERSION=$(extract_version_for_release "api/CHANGELOG.md" "$PROWLER_VERSION")
        UI_VERSION=$(extract_version_for_release "ui/CHANGELOG.md" "$PROWLER_VERSION")
        MCP_VERSION=$(extract_version_for_release "mcp_server/CHANGELOG.md" "$PROWLER_VERSION")

        echo "SDK_VERSION=${SDK_VERSION}" >> "${GITHUB_ENV}"
        echo "API_VERSION=${API_VERSION}" >> "${GITHUB_ENV}"
        echo "UI_VERSION=${UI_VERSION}" >> "${GITHUB_ENV}"
        echo "MCP_VERSION=${MCP_VERSION}" >> "${GITHUB_ENV}"

        if [ -n "$SDK_VERSION" ]; then
          echo "✓ SDK version for Prowler $PROWLER_VERSION: $SDK_VERSION"
        else
          echo "ℹ No SDK version found for Prowler $PROWLER_VERSION in prowler/CHANGELOG.md"
        fi

        if [ -n "$API_VERSION" ]; then
          echo "✓ API version for Prowler $PROWLER_VERSION: $API_VERSION"
        else
          echo "ℹ No API version found for Prowler $PROWLER_VERSION in api/CHANGELOG.md"
        fi

        if [ -n "$UI_VERSION" ]; then
          echo "✓ UI version for Prowler $PROWLER_VERSION: $UI_VERSION"
        else
          echo "ℹ No UI version found for Prowler $PROWLER_VERSION in ui/CHANGELOG.md"
        fi

        if [ -n "$MCP_VERSION" ]; then
          echo "✓ MCP version for Prowler $PROWLER_VERSION: $MCP_VERSION"
        else
          echo "ℹ No MCP version found for Prowler $PROWLER_VERSION in mcp_server/CHANGELOG.md"
        fi

    - name: Extract and combine changelog entries
      run: |
        set -e

        # Function to extract changelog for a specific version
        extract_changelog() {
          local file="$1"
          local version="$2"
          local output_file="$3"

          if [ ! -f "$file" ]; then
            echo "Warning: $file not found, skipping..."
            touch "$output_file"
            return
          fi

          # Extract changelog section for this version
          awk -v version="$version" '
            /^## \[v?'"$version"'\]/ { found=1; next }
            found && /^## \[v?[0-9]+\.[0-9]+\.[0-9]+\]/ { found=0 }
            found && !/^## \[v?'"$version"'\]/ { print }
          ' "$file" > "$output_file"

          # Remove --- separators
          sed -i '/^---$/d' "$output_file"
        }

        # Determine if components have changes for this specific release
        if [ -n "$SDK_VERSION" ]; then
          echo "HAS_SDK_CHANGES=true" >> $GITHUB_ENV
          HAS_SDK_CHANGES="true"
          echo "✓ SDK changes detected - version: $SDK_VERSION"
          extract_changelog "prowler/CHANGELOG.md" "$SDK_VERSION" "prowler_changelog.md"
        else
          echo "HAS_SDK_CHANGES=false" >> $GITHUB_ENV
          HAS_SDK_CHANGES="false"
          echo "ℹ No SDK changes for this release"
          touch "prowler_changelog.md"
        fi

        if [ -n "$API_VERSION" ]; then
          echo "HAS_API_CHANGES=true" >> $GITHUB_ENV
          HAS_API_CHANGES="true"
          echo "✓ API changes detected - version: $API_VERSION"
          extract_changelog "api/CHANGELOG.md" "$API_VERSION" "api_changelog.md"
        else
          echo "HAS_API_CHANGES=false" >> $GITHUB_ENV
          HAS_API_CHANGES="false"
          echo "ℹ No API changes for this release"
          touch "api_changelog.md"
        fi

        if [ -n "$UI_VERSION" ]; then
          echo "HAS_UI_CHANGES=true" >> $GITHUB_ENV
          HAS_UI_CHANGES="true"
          echo "✓ UI changes detected - version: $UI_VERSION"
          extract_changelog "ui/CHANGELOG.md" "$UI_VERSION" "ui_changelog.md"
        else
          echo "HAS_UI_CHANGES=false" >> $GITHUB_ENV
          HAS_UI_CHANGES="false"
          echo "ℹ No UI changes for this release"
          touch "ui_changelog.md"
        fi

        if [ -n "$MCP_VERSION" ]; then
          echo "HAS_MCP_CHANGES=true" >> $GITHUB_ENV
          HAS_MCP_CHANGES="true"
          echo "✓ MCP changes detected - version: $MCP_VERSION"
          extract_changelog "mcp_server/CHANGELOG.md" "$MCP_VERSION" "mcp_changelog.md"
        else
          echo "HAS_MCP_CHANGES=false" >> $GITHUB_ENV
          HAS_MCP_CHANGES="false"
          echo "ℹ No MCP changes for this release"
          touch "mcp_changelog.md"
        fi

        # Combine changelogs in order: UI, API, SDK, MCP
        > combined_changelog.md

        if [ "$HAS_UI_CHANGES" = "true" ] && [ -s "ui_changelog.md" ]; then
          echo "## UI" >> combined_changelog.md
          echo "" >> combined_changelog.md
          cat ui_changelog.md >> combined_changelog.md
          echo "" >> combined_changelog.md
        fi

        if [ "$HAS_API_CHANGES" = "true" ] && [ -s "api_changelog.md" ]; then
          echo "## API" >> combined_changelog.md
          echo "" >> combined_changelog.md
          cat api_changelog.md >> combined_changelog.md
          echo "" >> combined_changelog.md
        fi

        if [ "$HAS_SDK_CHANGES" = "true" ] && [ -s "prowler_changelog.md" ]; then
          echo "## SDK" >> combined_changelog.md
          echo "" >> combined_changelog.md
          cat prowler_changelog.md >> combined_changelog.md
          echo "" >> combined_changelog.md
        fi

        if [ "$HAS_MCP_CHANGES" = "true" ] && [ -s "mcp_changelog.md" ]; then
          echo "## MCP" >> combined_changelog.md
          echo "" >> combined_changelog.md
          cat mcp_changelog.md >> combined_changelog.md
          echo "" >> combined_changelog.md
        fi

        # Add fallback message if no changelogs were added
        if [ ! -s combined_changelog.md ]; then
          echo "No component changes detected for this release." >> combined_changelog.md
        fi

        echo "Combined changelog preview:"
        cat combined_changelog.md

    - name: Verify SDK version in pyproject.toml
      run: |
        CURRENT_VERSION=$(grep '^version = ' pyproject.toml | sed -E 's/version = "([^"]+)"/\1/' | tr -d '[:space:]')
        PROWLER_VERSION_TRIMMED=$(echo "$PROWLER_VERSION" | tr -d '[:space:]')
        if [ "$CURRENT_VERSION" != "$PROWLER_VERSION_TRIMMED" ]; then
          echo "ERROR: Version mismatch in pyproject.toml (expected: '$PROWLER_VERSION_TRIMMED', found: '$CURRENT_VERSION')"
          exit 1
        fi
        echo "✓ pyproject.toml version: $CURRENT_VERSION"

    - name: Verify SDK version in prowler/config/config.py
      run: |
        CURRENT_VERSION=$(grep '^prowler_version = ' prowler/config/config.py | sed -E 's/prowler_version = "([^"]+)"/\1/' | tr -d '[:space:]')
        PROWLER_VERSION_TRIMMED=$(echo "$PROWLER_VERSION" | tr -d '[:space:]')
        if [ "$CURRENT_VERSION" != "$PROWLER_VERSION_TRIMMED" ]; then
          echo "ERROR: Version mismatch in prowler/config/config.py (expected: '$PROWLER_VERSION_TRIMMED', found: '$CURRENT_VERSION')"
          exit 1
        fi
        echo "✓ prowler/config/config.py version: $CURRENT_VERSION"

    - name: Verify API version in api/pyproject.toml
      if: ${{ env.HAS_API_CHANGES == 'true' }}
      run: |
        CURRENT_API_VERSION=$(grep '^version = ' api/pyproject.toml | sed -E 's/version = "([^"]+)"/\1/' | tr -d '[:space:]')
        API_VERSION_TRIMMED=$(echo "$API_VERSION" | tr -d '[:space:]')
        if [ "$CURRENT_API_VERSION" != "$API_VERSION_TRIMMED" ]; then
          echo "ERROR: API version mismatch in api/pyproject.toml (expected: '$API_VERSION_TRIMMED', found: '$CURRENT_API_VERSION')"
          exit 1
        fi
        echo "✓ api/pyproject.toml version: $CURRENT_API_VERSION"

    - name: Verify API prowler dependency in api/pyproject.toml
      if: ${{ env.PATCH_VERSION != '0' && env.HAS_API_CHANGES == 'true' }}
      run: |
        CURRENT_PROWLER_REF=$(grep 'prowler @ git+https://github.com/prowler-cloud/prowler.git@' api/pyproject.toml | sed -E 's/.*@([^"]+)".*/\1/' | tr -d '[:space:]')
        BRANCH_NAME_TRIMMED=$(echo "$BRANCH_NAME" | tr -d '[:space:]')
        if [ "$CURRENT_PROWLER_REF" != "$BRANCH_NAME_TRIMMED" ]; then
          echo "ERROR: Prowler dependency mismatch in api/pyproject.toml (expected: '$BRANCH_NAME_TRIMMED', found: '$CURRENT_PROWLER_REF')"
          exit 1
        fi
        echo "✓ api/pyproject.toml prowler dependency: $CURRENT_PROWLER_REF"

    - name: Verify API version in api/src/backend/api/v1/views.py
      if: ${{ env.HAS_API_CHANGES == 'true' }}
      run: |
        CURRENT_API_VERSION=$(grep 'spectacular_settings.VERSION = ' api/src/backend/api/v1/views.py | sed -E 's/.*spectacular_settings.VERSION = "([^"]+)".*/\1/' | tr -d '[:space:]')
        API_VERSION_TRIMMED=$(echo "$API_VERSION" | tr -d '[:space:]')
        if [ "$CURRENT_API_VERSION" != "$API_VERSION_TRIMMED" ]; then
          echo "ERROR: API version mismatch in views.py (expected: '$API_VERSION_TRIMMED', found: '$CURRENT_API_VERSION')"
          exit 1
        fi
        echo "✓ api/src/backend/api/v1/views.py version: $CURRENT_API_VERSION"

    - name: Verify API version in api/src/backend/api/specs/v1.yaml
      if: ${{ env.HAS_API_CHANGES == 'true' }}
      run: |
        CURRENT_API_VERSION=$(grep '^  version: ' api/src/backend/api/specs/v1.yaml | sed -E 's/  version: ([0-9]+\.[0-9]+\.[0-9]+)/\1/' | tr -d '[:space:]')
        API_VERSION_TRIMMED=$(echo "$API_VERSION" | tr -d '[:space:]')
        if [ "$CURRENT_API_VERSION" != "$API_VERSION_TRIMMED" ]; then
          echo "ERROR: API version mismatch in api/src/backend/api/specs/v1.yaml (expected: '$API_VERSION_TRIMMED', found: '$CURRENT_API_VERSION')"
          exit 1
        fi
        echo "✓ api/src/backend/api/specs/v1.yaml version: $CURRENT_API_VERSION"

    - name: Update API prowler dependency for minor release
      if: ${{ env.PATCH_VERSION == '0' }}
      run: |
        CURRENT_PROWLER_REF=$(grep 'prowler @ git+https://github.com/prowler-cloud/prowler.git@' api/pyproject.toml | sed -E 's/.*@([^"]+)".*/\1/' | tr -d '[:space:]')
        BRANCH_NAME_TRIMMED=$(echo "$BRANCH_NAME" | tr -d '[:space:]')

        # Minor release: update the dependency to use the release branch
        echo "Updating prowler dependency from '$CURRENT_PROWLER_REF' to '$BRANCH_NAME_TRIMMED'"
        sed -i "s|prowler @ git+https://github.com/prowler-cloud/prowler.git@[^\"]*\"|prowler @ git+https://github.com/prowler-cloud/prowler.git@$BRANCH_NAME_TRIMMED\"|" api/pyproject.toml

        # Verify the change was made
        UPDATED_PROWLER_REF=$(grep 'prowler @ git+https://github.com/prowler-cloud/prowler.git@' api/pyproject.toml | sed -E 's/.*@([^"]+)".*/\1/' | tr -d '[:space:]')
        if [ "$UPDATED_PROWLER_REF" != "$BRANCH_NAME_TRIMMED" ]; then
          echo "ERROR: Failed to update prowler dependency in api/pyproject.toml"
          exit 1
        fi

        # Update poetry lock file
        echo "Updating poetry.lock file..."
        cd api
        poetry lock
        cd ..

        echo "✓ Prepared prowler dependency update to: $UPDATED_PROWLER_REF"

    - name: Create PR for API dependency update
      if: ${{ env.PATCH_VERSION == '0' }}
      uses: peter-evans/create-pull-request@271a8d0340265f705b14b6d32b9829c1cb33d45e # v7.0.8
      with:
        token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
        commit-message: 'chore(api): update prowler dependency to ${{ env.BRANCH_NAME }} for release ${{ env.PROWLER_VERSION }}'
        branch: update-api-dependency-${{ env.BRANCH_NAME }}-${{ github.run_number }}
        base: ${{ env.BRANCH_NAME }}
        add-paths: |
          api/pyproject.toml
          api/poetry.lock
        title: "chore(api): Update prowler dependency to ${{ env.BRANCH_NAME }} for release ${{ env.PROWLER_VERSION }}"
        body: |
          ### Description

          Updates the API prowler dependency for release ${{ env.PROWLER_VERSION }}.

          **Changes:**
          - Updates `api/pyproject.toml` prowler dependency from `@master` to `@${{ env.BRANCH_NAME }}`
          - Updates `api/poetry.lock` file with resolved dependencies

          This PR should be merged into the `${{ env.BRANCH_NAME }}` release branch.

          ### License

          By submitting this pull request, I confirm that my contribution is made under the terms of the Apache 2.0 license.
        author: prowler-bot <179230569+prowler-bot@users.noreply.github.com>
        labels: |
          component/api
          no-changelog

    - name: Create draft release
      uses: softprops/action-gh-release@6da8fa9354ddfdc4aeace5fc48d7f679b5214090 # v2.4.1
      with:
        tag_name: ${{ env.PROWLER_VERSION }}
        name: Prowler ${{ env.PROWLER_VERSION }}
        body_path: combined_changelog.md
        draft: true
        target_commitish: ${{ env.BRANCH_NAME }}
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Clean up temporary files
      if: always()
      run: |
        rm -f prowler_changelog.md api_changelog.md ui_changelog.md mcp_changelog.md combined_changelog.md
```

--------------------------------------------------------------------------------

---[FILE: sdk-bump-version.yml]---
Location: prowler-master/.github/workflows/sdk-bump-version.yml
Signals: Next.js

```yaml
name: 'SDK: Bump Version'

on:
  release:
    types:
      - 'published'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.release.tag_name }}
  cancel-in-progress: false

env:
  PROWLER_VERSION: ${{ github.event.release.tag_name }}
  BASE_BRANCH: master

jobs:
  detect-release-type:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: read
    outputs:
      is_minor: ${{ steps.detect.outputs.is_minor }}
      is_patch: ${{ steps.detect.outputs.is_patch }}
      major_version: ${{ steps.detect.outputs.major_version }}
      minor_version: ${{ steps.detect.outputs.minor_version }}
      patch_version: ${{ steps.detect.outputs.patch_version }}
    steps:
      - name: Detect release type and parse version
        id: detect
        run: |
          if [[ $PROWLER_VERSION =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
            MAJOR_VERSION=${BASH_REMATCH[1]}
            MINOR_VERSION=${BASH_REMATCH[2]}
            PATCH_VERSION=${BASH_REMATCH[3]}

            echo "major_version=${MAJOR_VERSION}" >> "${GITHUB_OUTPUT}"
            echo "minor_version=${MINOR_VERSION}" >> "${GITHUB_OUTPUT}"
            echo "patch_version=${PATCH_VERSION}" >> "${GITHUB_OUTPUT}"

            if (( MAJOR_VERSION != 5 )); then
              echo "::error::Releasing another Prowler major version, aborting..."
              exit 1
            fi

            if (( PATCH_VERSION == 0 )); then
              echo "is_minor=true" >> "${GITHUB_OUTPUT}"
              echo "is_patch=false" >> "${GITHUB_OUTPUT}"
              echo "✓ Minor release detected: $PROWLER_VERSION"
            else
              echo "is_minor=false" >> "${GITHUB_OUTPUT}"
              echo "is_patch=true" >> "${GITHUB_OUTPUT}"
              echo "✓ Patch release detected: $PROWLER_VERSION"
            fi
          else
            echo "::error::Invalid version syntax: '$PROWLER_VERSION' (must be X.Y.Z)"
            exit 1
          fi

  bump-minor-version:
    needs: detect-release-type
    if: needs.detect-release-type.outputs.is_minor == 'true'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Calculate next minor version
        run: |
          MAJOR_VERSION=${{ needs.detect-release-type.outputs.major_version }}
          MINOR_VERSION=${{ needs.detect-release-type.outputs.minor_version }}

          NEXT_MINOR_VERSION=${MAJOR_VERSION}.$((MINOR_VERSION + 1)).0
          echo "NEXT_MINOR_VERSION=${NEXT_MINOR_VERSION}" >> "${GITHUB_ENV}"

          echo "Current version: $PROWLER_VERSION"
          echo "Next minor version: $NEXT_MINOR_VERSION"

      - name: Bump versions in files for master
        run: |
          set -e

          sed -i "s|version = \"${PROWLER_VERSION}\"|version = \"${NEXT_MINOR_VERSION}\"|" pyproject.toml
          sed -i "s|prowler_version = \"${PROWLER_VERSION}\"|prowler_version = \"${NEXT_MINOR_VERSION}\"|" prowler/config/config.py
          sed -i "s|NEXT_PUBLIC_PROWLER_RELEASE_VERSION=v${PROWLER_VERSION}|NEXT_PUBLIC_PROWLER_RELEASE_VERSION=v${NEXT_MINOR_VERSION}|" .env

          echo "Files modified:"
          git --no-pager diff

      - name: Create PR for next minor version to master
        uses: peter-evans/create-pull-request@271a8d0340265f705b14b6d32b9829c1cb33d45e # v7.0.8
        with:
          author: prowler-bot <179230569+prowler-bot@users.noreply.github.com>
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          base: master
          commit-message: 'chore(release): Bump version to v${{ env.NEXT_MINOR_VERSION }}'
          branch: version-bump-to-v${{ env.NEXT_MINOR_VERSION }}
          title: 'chore(release): Bump version to v${{ env.NEXT_MINOR_VERSION }}'
          labels: no-changelog
          body: |
            ### Description

            Bump Prowler version to v${{ env.NEXT_MINOR_VERSION }} after releasing v${{ env.PROWLER_VERSION }}.

            ### License

            By submitting this pull request, I confirm that my contribution is made under the terms of the Apache 2.0 license.

      - name: Checkout version branch
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
        with:
          ref: v${{ needs.detect-release-type.outputs.major_version }}.${{ needs.detect-release-type.outputs.minor_version }}

      - name: Calculate first patch version
        run: |
          MAJOR_VERSION=${{ needs.detect-release-type.outputs.major_version }}
          MINOR_VERSION=${{ needs.detect-release-type.outputs.minor_version }}

          FIRST_PATCH_VERSION=${MAJOR_VERSION}.${MINOR_VERSION}.1
          VERSION_BRANCH=v${MAJOR_VERSION}.${MINOR_VERSION}

          echo "FIRST_PATCH_VERSION=${FIRST_PATCH_VERSION}" >> "${GITHUB_ENV}"
          echo "VERSION_BRANCH=${VERSION_BRANCH}" >> "${GITHUB_ENV}"

          echo "First patch version: $FIRST_PATCH_VERSION"
          echo "Version branch: $VERSION_BRANCH"

      - name: Bump versions in files for version branch
        run: |
          set -e

          sed -i "s|version = \"${PROWLER_VERSION}\"|version = \"${FIRST_PATCH_VERSION}\"|" pyproject.toml
          sed -i "s|prowler_version = \"${PROWLER_VERSION}\"|prowler_version = \"${FIRST_PATCH_VERSION}\"|" prowler/config/config.py
          sed -i "s|NEXT_PUBLIC_PROWLER_RELEASE_VERSION=v${PROWLER_VERSION}|NEXT_PUBLIC_PROWLER_RELEASE_VERSION=v${FIRST_PATCH_VERSION}|" .env

          echo "Files modified:"
          git --no-pager diff

      - name: Create PR for first patch version to version branch
        uses: peter-evans/create-pull-request@271a8d0340265f705b14b6d32b9829c1cb33d45e # v7.0.8
        with:
          author: prowler-bot <179230569+prowler-bot@users.noreply.github.com>
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          base: ${{ env.VERSION_BRANCH }}
          commit-message: 'chore(release): Bump version to v${{ env.FIRST_PATCH_VERSION }}'
          branch: version-bump-to-v${{ env.FIRST_PATCH_VERSION }}
          title: 'chore(release): Bump version to v${{ env.FIRST_PATCH_VERSION }}'
          labels: no-changelog
          body: |
            ### Description

            Bump Prowler version to v${{ env.FIRST_PATCH_VERSION }} in version branch after releasing v${{ env.PROWLER_VERSION }}.

            ### License

            By submitting this pull request, I confirm that my contribution is made under the terms of the Apache 2.0 license.

  bump-patch-version:
    needs: detect-release-type
    if: needs.detect-release-type.outputs.is_patch == 'true'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Calculate next patch version
        run: |
          MAJOR_VERSION=${{ needs.detect-release-type.outputs.major_version }}
          MINOR_VERSION=${{ needs.detect-release-type.outputs.minor_version }}
          PATCH_VERSION=${{ needs.detect-release-type.outputs.patch_version }}

          NEXT_PATCH_VERSION=${MAJOR_VERSION}.${MINOR_VERSION}.$((PATCH_VERSION + 1))
          VERSION_BRANCH=v${MAJOR_VERSION}.${MINOR_VERSION}

          echo "NEXT_PATCH_VERSION=${NEXT_PATCH_VERSION}" >> "${GITHUB_ENV}"
          echo "VERSION_BRANCH=${VERSION_BRANCH}" >> "${GITHUB_ENV}"

          echo "Current version: $PROWLER_VERSION"
          echo "Next patch version: $NEXT_PATCH_VERSION"
          echo "Target branch: $VERSION_BRANCH"

      - name: Bump versions in files for version branch
        run: |
          set -e

          sed -i "s|version = \"${PROWLER_VERSION}\"|version = \"${NEXT_PATCH_VERSION}\"|" pyproject.toml
          sed -i "s|prowler_version = \"${PROWLER_VERSION}\"|prowler_version = \"${NEXT_PATCH_VERSION}\"|" prowler/config/config.py
          sed -i "s|NEXT_PUBLIC_PROWLER_RELEASE_VERSION=v${PROWLER_VERSION}|NEXT_PUBLIC_PROWLER_RELEASE_VERSION=v${NEXT_PATCH_VERSION}|" .env

          echo "Files modified:"
          git --no-pager diff

      - name: Create PR for next patch version to version branch
        uses: peter-evans/create-pull-request@271a8d0340265f705b14b6d32b9829c1cb33d45e # v7.0.8
        with:
          author: prowler-bot <179230569+prowler-bot@users.noreply.github.com>
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          base: ${{ env.VERSION_BRANCH }}
          commit-message: 'chore(release): Bump version to v${{ env.NEXT_PATCH_VERSION }}'
          branch: version-bump-to-v${{ env.NEXT_PATCH_VERSION }}
          title: 'chore(release): Bump version to v${{ env.NEXT_PATCH_VERSION }}'
          labels: no-changelog
          body: |
            ### Description

            Bump Prowler version to v${{ env.NEXT_PATCH_VERSION }} after releasing v${{ env.PROWLER_VERSION }}.

            ### License

            By submitting this pull request, I confirm that my contribution is made under the terms of the Apache 2.0 license.
```

--------------------------------------------------------------------------------

---[FILE: sdk-code-quality.yml]---
Location: prowler-master/.github/workflows/sdk-code-quality.yml
Signals: Docker

```yaml
name: 'SDK: Code Quality'

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

jobs:
  sdk-code-quality:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: read
    strategy:
      matrix:
        python-version:
          - '3.9'
          - '3.10'
          - '3.11'
          - '3.12'

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check for SDK changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: ./**
          files_ignore: |
            .github/**
            prowler/CHANGELOG.md
            docs/**
            permissions/**
            api/**
            ui/**
            dashboard/**
            mcp_server/**
            README.md
            mkdocs.yml
            .backportrc.json
            .env
            docker-compose*
            examples/**
            .gitignore
            contrib/**

      - name: Install Poetry
        if: steps.check-changes.outputs.any_changed == 'true'
        run: pipx install poetry==2.1.1

      - name: Set up Python ${{ matrix.python-version }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'poetry'

      - name: Install dependencies
        if: steps.check-changes.outputs.any_changed == 'true'
        run: |
          poetry install --no-root
          poetry run pip list

      - name: Check Poetry lock file
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry check --lock

      - name: Lint with flake8
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run flake8 . --ignore=E266,W503,E203,E501,W605,E128 --exclude contrib,ui,api

      - name: Check format with black
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run black --exclude api ui --check .

      - name: Lint with pylint
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run pylint --disable=W,C,R,E -j 0 -rn -sn prowler/
```

--------------------------------------------------------------------------------

---[FILE: sdk-codeql.yml]---
Location: prowler-master/.github/workflows/sdk-codeql.yml

```yaml
name: 'SDK: CodeQL'

on:
  push:
    branches:
      - 'master'
      - 'v5.*'
    paths:
      - 'prowler/**'
      - 'tests/**'
      - 'pyproject.toml'
      - '.github/workflows/sdk-codeql.yml'
      - '.github/codeql/sdk-codeql-config.yml'
      - '!prowler/CHANGELOG.md'
  pull_request:
    branches:
      - 'master'
      - 'v5.*'
    paths:
      - 'prowler/**'
      - 'tests/**'
      - 'pyproject.toml'
      - '.github/workflows/sdk-codeql.yml'
      - '.github/codeql/sdk-codeql-config.yml'
      - '!prowler/CHANGELOG.md'
  schedule:
    - cron: '00 12 * * *'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  sdk-analyze:
    if: github.repository == 'prowler-cloud/prowler'
    name: CodeQL Security Analysis
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language:
          - 'python'

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Initialize CodeQL
        uses: github/codeql-action/init@0499de31b99561a6d14a36a5f662c2a54f91beee # v4.31.2
        with:
          languages: ${{ matrix.language }}
          config-file: ./.github/codeql/sdk-codeql-config.yml

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@0499de31b99561a6d14a36a5f662c2a54f91beee # v4.31.2
        with:
          category: '/language:${{ matrix.language }}'
```

--------------------------------------------------------------------------------

````
