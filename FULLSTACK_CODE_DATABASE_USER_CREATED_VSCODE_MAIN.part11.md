---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 11
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 11 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: build/azure-pipelines/darwin/product-build-darwin-node-modules.yml]---
Location: vscode-main/build/azure-pipelines/darwin/product-build-darwin-node-modules.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string

jobs:
  - job: macOSNodeModules_${{ parameters.VSCODE_ARCH }}
    displayName: macOS (${{ upper(parameters.VSCODE_ARCH) }})
    pool:
      name: AcesShared
      os: macOS
    timeoutInMinutes: 60
    variables:
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - template: ../distro/download-distro.yml@self

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password,macos-developer-certificate,macos-developer-certificate-key"

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts darwin $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash
        displayName: Prepare node_modules cache key

      - task: Cache@2
        inputs:
          key: '"node_modules" | .build/packagelockhash'
          path: .build/node_modules_cache
          cacheHitVar: NODE_MODULES_RESTORED
        displayName: Restore node_modules cache

      - script: |
          set -e
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          npm config set registry "$NPM_REGISTRY"
          echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Authentication

      - script: |
          set -e
          c++ --version
          xcode-select -print-path
          python3 -m pip install setuptools

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          npm_config_arch: $(VSCODE_ARCH)
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
          # Avoid using dlopen to load Kerberos on macOS which can cause missing libraries
          # https://github.com/mongodb-js/kerberos/commit/04044d2814ad1d01e77f1ce87f26b03d86692cf2
          # flipped the default to support legacy linux distros which shouldn't happen
          # on macOS.
          GYP_DEFINES: "kerberos_use_rtld=false"
        displayName: Install dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: node build/azure-pipelines/distro/mixin-npm.ts
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Mixin distro node modules

      - script: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Create node_modules archive
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/product-build-darwin-universal.yml]---
Location: vscode-main/build/azure-pipelines/darwin/product-build-darwin-universal.yml

```yaml
jobs:
  - job: macOSUniversal
    displayName: macOS (UNIVERSAL)
    timeoutInMinutes: 90
    variables:
      VSCODE_ARCH: universal
      BUILDS_API_URL: $(System.CollectionUri)$(System.TeamProject)/_apis/build/builds/$(Build.BuildId)/
    templateContext:
      outputs:
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-universal.zip
          artifactName: vscode_client_darwin_$(VSCODE_ARCH)_archive
          displayName: Publish client archive
          sbomBuildDropPath: $(Build.ArtifactStagingDirectory)/VSCode-darwin-$(VSCODE_ARCH)
          sbomPackageName: "VS Code macOS $(VSCODE_ARCH)"
          sbomPackageVersion: $(Build.SourceVersion)
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - template: ../distro/download-distro.yml@self

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password,macos-developer-certificate,macos-developer-certificate-key"

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY build
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - script: |
          set -e
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          npm config set registry "$NPM_REGISTRY"
          echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Authentication

      - script: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        workingDirectory: build
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Install build dependencies

      - pwsh: node -- build/azure-pipelines/common/waitForArtifacts.ts unsigned_vscode_client_darwin_x64_archive unsigned_vscode_client_darwin_arm64_archive
        env:
          SYSTEM_ACCESSTOKEN: $(System.AccessToken)
        displayName: Wait for x64 and arm64 artifacts

      - download: current
        artifact: unsigned_vscode_client_darwin_x64_archive
        displayName: Download x64 artifact

      - download: current
        artifact: unsigned_vscode_client_darwin_arm64_archive
        displayName: Download arm64 artifact

      - script: node build/azure-pipelines/distro/mixin-quality.ts
        displayName: Mixin distro quality

      - script: |
          set -e
          unzip $(Pipeline.Workspace)/unsigned_vscode_client_darwin_x64_archive/VSCode-darwin-x64.zip -d $(agent.builddirectory)/VSCode-darwin-x64 &
          unzip $(Pipeline.Workspace)/unsigned_vscode_client_darwin_arm64_archive/VSCode-darwin-arm64.zip -d $(agent.builddirectory)/VSCode-darwin-arm64 &
          wait
          DEBUG=* node build/darwin/create-universal-app.ts $(agent.builddirectory)
        displayName: Create Universal App

      - script: |
          set -e
          APP_ROOT="$(Agent.BuildDirectory)/VSCode-darwin-$(VSCODE_ARCH)"
          APP_NAME="`ls $APP_ROOT | head -n 1`"
          APP_PATH="$APP_ROOT/$APP_NAME" node build/darwin/verify-macho.ts universal
        displayName: Verify arch of Mach-O objects

      - script: |
          set -e
          security create-keychain -p pwd $(agent.tempdirectory)/buildagent.keychain
          security default-keychain -s $(agent.tempdirectory)/buildagent.keychain
          security unlock-keychain -p pwd $(agent.tempdirectory)/buildagent.keychain
          echo "$(macos-developer-certificate)" | base64 -D > $(agent.tempdirectory)/cert.p12
          security import $(agent.tempdirectory)/cert.p12 -k $(agent.tempdirectory)/buildagent.keychain -P "$(macos-developer-certificate-key)" -T /usr/bin/codesign
          export CODESIGN_IDENTITY=$(security find-identity -v -p codesigning $(agent.tempdirectory)/buildagent.keychain | grep -oEi "([0-9A-F]{40})" | head -n 1)
          security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k pwd $(agent.tempdirectory)/buildagent.keychain
          DEBUG=electron-osx-sign* node build/darwin/sign.ts $(agent.builddirectory)
        displayName: Set Hardened Entitlements

      - script: |
          set -e
          mkdir -p $(Pipeline.Workspace)/unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive
          pushd $(agent.builddirectory)/VSCode-darwin-$(VSCODE_ARCH) && zip -r -X -y $(Pipeline.Workspace)/unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-$(VSCODE_ARCH).zip * && popd
        displayName: Archive build

      - task: UseDotNet@2
        inputs:
          version: 6.x

      - task: EsrpCodeSigning@5
        inputs:
          UseMSIAuthentication: true
          ConnectedServiceName: vscode-esrp
          AppRegistrationClientId: $(ESRP_CLIENT_ID)
          AppRegistrationTenantId: $(ESRP_TENANT_ID)
          AuthAKVName: vscode-esrp
          AuthSignCertName: esrp-sign
          FolderPath: .
          Pattern: noop
        displayName: 'Install ESRP Tooling'

      - script: node build/azure-pipelines/common/sign.ts $(Agent.RootDirectory)/_tasks/EsrpCodeSigning_*/*/net6.0/esrpcli.dll sign-darwin $(Pipeline.Workspace)/unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive VSCode-darwin-$(VSCODE_ARCH).zip
        env:
          SYSTEM_ACCESSTOKEN: $(System.AccessToken)
        displayName: ✍️ Codesign

      - script: node build/azure-pipelines/common/sign.ts $(Agent.RootDirectory)/_tasks/EsrpCodeSigning_*/*/net6.0/esrpcli.dll notarize-darwin $(Pipeline.Workspace)/unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive VSCode-darwin-$(VSCODE_ARCH).zip
        env:
          SYSTEM_ACCESSTOKEN: $(System.AccessToken)
        displayName: ✍️ Notarize

      - script: unzip $(Pipeline.Workspace)/unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-$(VSCODE_ARCH).zip -d $(Build.ArtifactStagingDirectory)/VSCode-darwin-$(VSCODE_ARCH)
        displayName: Extract signed app

      - script: |
          set -e
          APP_ROOT="$(Build.ArtifactStagingDirectory)/VSCode-darwin-$(VSCODE_ARCH)"
          APP_NAME="`ls $APP_ROOT | head -n 1`"
          APP_PATH="$APP_ROOT/$APP_NAME"
          codesign -dv --deep --verbose=4 "$APP_PATH"
          "$APP_PATH/Contents/Resources/app/bin/code" --export-default-configuration=.build
        displayName: Verify signature

      - script: |
          set -e
          mkdir -p $(Build.ArtifactStagingDirectory)/out/vscode_client_darwin_$(VSCODE_ARCH)_archive
          mv $(Pipeline.Workspace)/unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-$(VSCODE_ARCH).zip $(Build.ArtifactStagingDirectory)/out/vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-$(VSCODE_ARCH).zip
        displayName: Move artifact to out directory
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/product-build-darwin.yml]---
Location: vscode-main/build/azure-pipelines/darwin/product-build-darwin.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean
    default: false

jobs:
  - job: macOS_${{ parameters.VSCODE_ARCH }}
    displayName: macOS (${{ upper(parameters.VSCODE_ARCH) }})
    timeoutInMinutes: 90
    variables:
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
      BUILDS_API_URL: $(System.CollectionUri)$(System.TeamProject)/_apis/build/builds/$(Build.BuildId)/
    templateContext:
      outputParentDirectory: $(Build.ArtifactStagingDirectory)/out
      outputs:
        - ${{ if or(eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true), eq(parameters.VSCODE_RUN_BROWSER_TESTS, true), eq(parameters.VSCODE_RUN_REMOTE_TESTS, true)) }}:
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/.build/crashes
            artifactName: crash-dump-macos-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: "Publish Crash Reports"
            sbomEnabled: false
            isProduction: false
            condition: failed()
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/node_modules
            artifactName: node-modules-macos-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: "Publish Node Modules"
            sbomEnabled: false
            isProduction: false
            condition: failed()
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/.build/logs
            artifactName: logs-macos-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: "Publish Log Files"
            sbomEnabled: false
            isProduction: false
            condition: succeededOrFailed()
        - output: pipelineArtifact
          ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
            targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin.zip
          ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
            targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-arm64.zip
          artifactName: vscode_client_darwin_$(VSCODE_ARCH)_archive
          displayName: Publish client archive
          sbomBuildDropPath: $(Build.ArtifactStagingDirectory)/VSCode-darwin-$(VSCODE_ARCH)
          sbomPackageName: "VS Code macOS $(VSCODE_ARCH)"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_server_darwin_$(VSCODE_ARCH)_archive/vscode-server-darwin-$(VSCODE_ARCH).zip
          artifactName: vscode_server_darwin_$(VSCODE_ARCH)_archive-unsigned
          displayName: Publish server archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/vscode-server-darwin-$(VSCODE_ARCH)
          sbomPackageName: "VS Code macOS $(VSCODE_ARCH) Server"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_web_darwin_$(VSCODE_ARCH)_archive/vscode-server-darwin-$(VSCODE_ARCH)-web.zip
          artifactName: vscode_web_darwin_$(VSCODE_ARCH)_archive-unsigned
          displayName: Publish web server archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/vscode-server-darwin-$(VSCODE_ARCH)-web
          sbomPackageName: "VS Code macOS $(VSCODE_ARCH) Web"
          sbomPackageVersion: $(Build.SourceVersion)
    steps:
      - template: ./steps/product-build-darwin-compile.yml@self
        parameters:
          VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
          VSCODE_CIBUILD: ${{ parameters.VSCODE_CIBUILD }}
          VSCODE_RUN_ELECTRON_TESTS: ${{ parameters.VSCODE_RUN_ELECTRON_TESTS }}
          VSCODE_RUN_BROWSER_TESTS: ${{ parameters.VSCODE_RUN_BROWSER_TESTS }}
          VSCODE_RUN_REMOTE_TESTS: ${{ parameters.VSCODE_RUN_REMOTE_TESTS }}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/steps/product-build-darwin-cli-sign.yml]---
Location: vscode-main/build/azure-pipelines/darwin/steps/product-build-darwin-cli-sign.yml

```yaml
parameters:
  - name: VSCODE_CLI_ARTIFACTS
    type: object
    default: []

steps:
  - task: UseDotNet@2
    inputs:
      version: 6.x

  - task: EsrpCodeSigning@5
    inputs:
      UseMSIAuthentication: true
      ConnectedServiceName: vscode-esrp
      AppRegistrationClientId: $(ESRP_CLIENT_ID)
      AppRegistrationTenantId: $(ESRP_TENANT_ID)
      AuthAKVName: vscode-esrp
      AuthSignCertName: esrp-sign
      FolderPath: .
      Pattern: noop
    displayName: 'Install ESRP Tooling'

  - ${{ each target in parameters.VSCODE_CLI_ARTIFACTS }}:
    - task: DownloadPipelineArtifact@2
      displayName: Download ${{ target }}
      inputs:
        artifact: ${{ target }}
        path: $(Build.ArtifactStagingDirectory)/pkg/${{ target }}

    - task: ExtractFiles@1
      displayName: Extract artifact
      inputs:
        archiveFilePatterns: $(Build.ArtifactStagingDirectory)/pkg/${{ target }}/*.zip
        destinationFolder: $(Build.ArtifactStagingDirectory)/sign/${{ target }}

  - script: node build/azure-pipelines/common/sign.ts $(Agent.RootDirectory)/_tasks/EsrpCodeSigning_*/*/net6.0/esrpcli.dll sign-darwin $(Build.ArtifactStagingDirectory)/pkg "*.zip"
    env:
      SYSTEM_ACCESSTOKEN: $(System.AccessToken)
    displayName: ✍️ Codesign

  - script: node build/azure-pipelines/common/sign.ts $(Agent.RootDirectory)/_tasks/EsrpCodeSigning_*/*/net6.0/esrpcli.dll notarize-darwin $(Build.ArtifactStagingDirectory)/pkg "*.zip"
    env:
      SYSTEM_ACCESSTOKEN: $(System.AccessToken)
    displayName: ✍️ Notarize

  - ${{ each target in parameters.VSCODE_CLI_ARTIFACTS }}:
    - script: |
        set -e
        ASSET_ID=$(echo "${{ target }}" | sed "s/unsigned_//")
        mkdir -p $(Build.ArtifactStagingDirectory)/out/$ASSET_ID
        mv $(Build.ArtifactStagingDirectory)/pkg/${{ target }}/${{ target }}.zip $(Build.ArtifactStagingDirectory)/out/$ASSET_ID/$ASSET_ID.zip
        echo "##vso[task.setvariable variable=ASSET_ID]$ASSET_ID"
      displayName: Set asset id variable
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/steps/product-build-darwin-compile.yml]---
Location: vscode-main/build/azure-pipelines/darwin/steps/product-build-darwin-compile.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean
    default: false

steps:
  - template: ../../common/checkout.yml@self

  - task: NodeTool@0
    inputs:
      versionSource: fromFile
      versionFilePath: .nvmrc

  - template: ../../distro/download-distro.yml@self

  - task: AzureKeyVault@2
    displayName: "Azure Key Vault: Get Secrets"
    inputs:
      azureSubscription: vscode
      KeyVaultName: vscode-build-secrets
      SecretsFilter: "github-distro-mixin-password,macos-developer-certificate,macos-developer-certificate-key"

  - task: DownloadPipelineArtifact@2
    inputs:
      artifact: Compilation
      path: $(Build.ArtifactStagingDirectory)
    displayName: Download compilation output

  - script: tar -xzf $(Build.ArtifactStagingDirectory)/compilation.tar.gz
    displayName: Extract compilation output

  - script: node build/setup-npm-registry.ts $NPM_REGISTRY
    condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM Registry

  - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts darwin $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash
    displayName: Prepare node_modules cache key

  - task: Cache@2
    inputs:
      key: '"node_modules" | .build/packagelockhash'
      path: .build/node_modules_cache
      cacheHitVar: NODE_MODULES_RESTORED
    displayName: Restore node_modules cache

  - script: tar -xzf .build/node_modules_cache/cache.tgz
    condition: and(succeeded(), eq(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Extract node_modules cache

  - script: |
      set -e
      # Set the private NPM registry to the global npmrc file
      # so that authentication works for subfolders like build/, remote/, extensions/ etc
      # which does not have their own .npmrc file
      npm config set registry "$NPM_REGISTRY"
      echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM

  - task: npmAuthenticate@0
    inputs:
      workingFile: $(NPMRC_PATH)
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM Authentication

  - script: |
      set -e
      c++ --version
      xcode-select -print-path
      python3 -m pip install setuptools

      for i in {1..5}; do # try 5 times
        npm ci && break
        if [ $i -eq 5 ]; then
          echo "Npm install failed too many times" >&2
          exit 1
        fi
        echo "Npm install failed $i, trying again..."
      done
    env:
      npm_config_arch: $(VSCODE_ARCH)
      ELECTRON_SKIP_BINARY_DOWNLOAD: 1
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
      # Avoid using dlopen to load Kerberos on macOS which can cause missing libraries
      # https://github.com/mongodb-js/kerberos/commit/04044d2814ad1d01e77f1ce87f26b03d86692cf2
      # flipped the default to support legacy linux distros which shouldn't happen
      # on macOS.
      GYP_DEFINES: "kerberos_use_rtld=false"
    displayName: Install dependencies
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

  - script: node build/azure-pipelines/distro/mixin-npm.ts
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Mixin distro node modules

  - script: |
      set -e
      node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
      mkdir -p .build/node_modules_cache
      tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Create node_modules archive

  - script: node build/azure-pipelines/distro/mixin-quality.ts
    displayName: Mixin distro quality

  - template: ../../common/install-builtin-extensions.yml@self

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - script: npm run copy-policy-dto --prefix build && node build/lib/policies/policyGenerator.ts build/lib/policies/policyData.jsonc darwin
      displayName: Generate policy definitions
      retryCountOnTaskFailure: 3

  - script: |
      set -e
      npm run gulp vscode-darwin-$(VSCODE_ARCH)-min-ci
      echo "##vso[task.setvariable variable=BUILT_CLIENT]true"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build client

  - script: |
      set -e
      npm run gulp vscode-reh-darwin-$(VSCODE_ARCH)-min-ci
      mv ../vscode-reh-darwin-$(VSCODE_ARCH) ../vscode-server-darwin-$(VSCODE_ARCH) # TODO@joaomoreno
      ARCHIVE_PATH=".build/darwin/server/vscode-server-darwin-$(VSCODE_ARCH).zip"
      mkdir -p $(dirname $ARCHIVE_PATH)
      (cd .. && zip -Xry $(Build.SourcesDirectory)/$ARCHIVE_PATH vscode-server-darwin-$(VSCODE_ARCH))
      echo "##vso[task.setvariable variable=SERVER_PATH]$ARCHIVE_PATH"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build server

  - script: |
      set -e
      npm run gulp vscode-reh-web-darwin-$(VSCODE_ARCH)-min-ci
      mv ../vscode-reh-web-darwin-$(VSCODE_ARCH) ../vscode-server-darwin-$(VSCODE_ARCH)-web # TODO@joaomoreno
      ARCHIVE_PATH=".build/darwin/server/vscode-server-darwin-$(VSCODE_ARCH)-web.zip"
      mkdir -p $(dirname $ARCHIVE_PATH)
      (cd .. && zip -Xry $(Build.SourcesDirectory)/$ARCHIVE_PATH vscode-server-darwin-$(VSCODE_ARCH)-web)
      echo "##vso[task.setvariable variable=WEB_PATH]$ARCHIVE_PATH"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build server (web)

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - task: DownloadPipelineArtifact@2
      inputs:
        artifact: unsigned_vscode_cli_darwin_$(VSCODE_ARCH)_cli
        patterns: "**"
        path: $(Build.ArtifactStagingDirectory)/cli
      displayName: Download VS Code CLI

    - script: |
        set -e
        APP_ROOT="$(Agent.BuildDirectory)/VSCode-darwin-$(VSCODE_ARCH)"
        APP_NAME="`ls $APP_ROOT | head -n 1`"
        APP_PATH="$APP_ROOT/$APP_NAME"
        unzip $(Build.ArtifactStagingDirectory)/cli/*.zip -d $(Build.ArtifactStagingDirectory)/cli
        CLI_APP_NAME=$(node -p "require(\"$APP_PATH/Contents/Resources/app/product.json\").tunnelApplicationName")
        APP_NAME=$(node -p "require(\"$APP_PATH/Contents/Resources/app/product.json\").applicationName")
        mv "$(Build.ArtifactStagingDirectory)/cli/$APP_NAME" "$APP_PATH/Contents/Resources/app/bin/$CLI_APP_NAME"
        chmod +x "$APP_PATH/Contents/Resources/app/bin/$CLI_APP_NAME"
      displayName: Make CLI executable

    - script: |
        set -e
        APP_ROOT="$(Agent.BuildDirectory)/VSCode-darwin-$(VSCODE_ARCH)"
        APP_NAME="`ls $APP_ROOT | head -n 1`"
        APP_PATH="$APP_ROOT/$APP_NAME" node build/darwin/verify-macho.ts $(VSCODE_ARCH)
        APP_PATH="$(Agent.BuildDirectory)/vscode-server-darwin-$(VSCODE_ARCH)" node build/darwin/verify-macho.ts $(VSCODE_ARCH)
      displayName: Verify arch of Mach-O objects

    - script: |
        set -e
        ARCHIVE_PATH="$(Pipeline.Workspace)/unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-$(VSCODE_ARCH).zip"
        mkdir -p $(dirname $ARCHIVE_PATH)
        (cd ../VSCode-darwin-$(VSCODE_ARCH) && zip -Xry $ARCHIVE_PATH *)
        echo "##vso[task.setvariable variable=CLIENT_PATH]$ARCHIVE_PATH"
      condition: eq(variables['BUILT_CLIENT'], 'true')
      displayName: Package client

    - pwsh: node build/azure-pipelines/common/checkForArtifact.ts CLIENT_ARCHIVE_UPLOADED unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive
      env:
        SYSTEM_ACCESSTOKEN: $(System.AccessToken)
      displayName: Check for client artifact

    # We are publishing the unsigned client artifact before running tests
    # since the macOS (UNIVERSAL) job is blocked waiting for the artifact.
    - template: ../../common/publish-artifact.yml@self
      parameters:
        targetPath: $(CLIENT_PATH)
        artifactName: unsigned_vscode_client_darwin_$(VSCODE_ARCH)_archive
        displayName: Publish client archive (unsigned)
        sbomEnabled: false
        condition: and(ne(variables['CLIENT_PATH'], ''), eq(variables['CLIENT_ARCHIVE_UPLOADED'], 'false'))

    # Hardened entitlements should be set after publishing unsigned client artifacts
    # to ensure entitlement signing doesn't modify sha that would affect universal build.
    #
    # Setting hardened entitlements is a requirement for:
    # * Apple notarization
    # * Running tests on Big Sur (because Big Sur has additional security precautions)
    - script: |
        set -e
        security create-keychain -p pwd $(agent.tempdirectory)/buildagent.keychain
        security default-keychain -s $(agent.tempdirectory)/buildagent.keychain
        security unlock-keychain -p pwd $(agent.tempdirectory)/buildagent.keychain
        echo "$(macos-developer-certificate)" | base64 -D > $(agent.tempdirectory)/cert.p12
        security import $(agent.tempdirectory)/cert.p12 -k $(agent.tempdirectory)/buildagent.keychain -P "$(macos-developer-certificate-key)" -T /usr/bin/codesign
        export CODESIGN_IDENTITY=$(security find-identity -v -p codesigning $(agent.tempdirectory)/buildagent.keychain | grep -oEi "([0-9A-F]{40})" | head -n 1)
        security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k pwd $(agent.tempdirectory)/buildagent.keychain
        DEBUG=electron-osx-sign* node build/darwin/sign.ts $(agent.builddirectory)
      displayName: Set Hardened Entitlements

    - script: |
        set -e
        ARCHIVE_PATH="$(Pipeline.Workspace)/vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-$(VSCODE_ARCH).zip"
        mkdir -p $(dirname $ARCHIVE_PATH)
        (cd ../VSCode-darwin-$(VSCODE_ARCH) && zip -Xry $ARCHIVE_PATH *)
        echo "##vso[task.setvariable variable=CLIENT_PATH]$ARCHIVE_PATH"
      condition: eq(variables['BUILT_CLIENT'], 'true')
      displayName: Re-package client after entitlement

    - task: UseDotNet@2
      inputs:
        version: 6.x

    - task: EsrpCodeSigning@5
      inputs:
        UseMSIAuthentication: true
        ConnectedServiceName: vscode-esrp
        AppRegistrationClientId: $(ESRP_CLIENT_ID)
        AppRegistrationTenantId: $(ESRP_TENANT_ID)
        AuthAKVName: vscode-esrp
        AuthSignCertName: esrp-sign
        FolderPath: .
        Pattern: noop
      displayName: 'Install ESRP Tooling'

    - pwsh: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        $EsrpCodeSigningTool = (gci -directory -filter EsrpCodeSigning_* $(Agent.RootDirectory)/_tasks | Select-Object -last 1).FullName
        $Version = (gci -directory $EsrpCodeSigningTool | Select-Object -last 1).FullName
        echo "##vso[task.setvariable variable=EsrpCliDllPath]$Version/net6.0/esrpcli.dll"
      displayName: Find ESRP CLI

    - script: npx deemon --detach --wait node build/azure-pipelines/darwin/codesign.ts
      env:
        EsrpCliDllPath: $(EsrpCliDllPath)
        SYSTEM_ACCESSTOKEN: $(System.AccessToken)
      displayName: ✍️ Codesign & Notarize

  - ${{ if or(eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true), eq(parameters.VSCODE_RUN_BROWSER_TESTS, true), eq(parameters.VSCODE_RUN_REMOTE_TESTS, true)) }}:
    - template: product-build-darwin-test.yml@self
      parameters:
        VSCODE_RUN_ELECTRON_TESTS: ${{ parameters.VSCODE_RUN_ELECTRON_TESTS }}
        VSCODE_RUN_BROWSER_TESTS: ${{ parameters.VSCODE_RUN_BROWSER_TESTS }}
        VSCODE_RUN_REMOTE_TESTS: ${{ parameters.VSCODE_RUN_REMOTE_TESTS }}

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - script: npx deemon --attach node build/azure-pipelines/darwin/codesign.ts
      condition: succeededOrFailed()
      displayName: "Post-job: ✍️ Codesign & Notarize"

    - script: unzip $(Pipeline.Workspace)/vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-$(VSCODE_ARCH).zip -d $(Build.ArtifactStagingDirectory)/VSCode-darwin-$(VSCODE_ARCH)
      displayName: Extract signed app

    - script: |
        set -e
        APP_ROOT="$(Build.ArtifactStagingDirectory)/VSCode-darwin-$(VSCODE_ARCH)"
        APP_NAME="`ls $APP_ROOT | head -n 1`"
        APP_PATH="$APP_ROOT/$APP_NAME"
        codesign -dv --deep --verbose=4 "$APP_PATH"
        "$APP_PATH/Contents/Resources/app/bin/code" --export-default-configuration=.build
      displayName: Verify signature

    - script: |
        set -e

        mkdir -p $(Build.ArtifactStagingDirectory)/out/vscode_client_darwin_$(VSCODE_ARCH)_archive
        if [ "$VSCODE_ARCH" == "x64" ]; then
          # Use legacy name for x64 builds
          mv $(CLIENT_PATH) $(Build.ArtifactStagingDirectory)/out/vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin.zip
        else
          mv $(CLIENT_PATH) $(Build.ArtifactStagingDirectory)/out/vscode_client_darwin_$(VSCODE_ARCH)_archive/VSCode-darwin-$(VSCODE_ARCH).zip
        fi

        mkdir -p $(Build.ArtifactStagingDirectory)/out/vscode_server_darwin_$(VSCODE_ARCH)_archive
        mv $(SERVER_PATH) $(Build.ArtifactStagingDirectory)/out/vscode_server_darwin_$(VSCODE_ARCH)_archive/vscode-server-darwin-$(VSCODE_ARCH).zip

        mkdir -p $(Build.ArtifactStagingDirectory)/out/vscode_web_darwin_$(VSCODE_ARCH)_archive
        mv $(WEB_PATH) $(Build.ArtifactStagingDirectory)/out/vscode_web_darwin_$(VSCODE_ARCH)_archive/vscode-server-darwin-$(VSCODE_ARCH)-web.zip
      displayName: Move artifacts to out directory
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/steps/product-build-darwin-test.yml]---
Location: vscode-main/build/azure-pipelines/darwin/steps/product-build-darwin-test.yml

```yaml
parameters:
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean

steps:
  - script: npm exec -- npm-run-all -lp "electron $(VSCODE_ARCH)" "playwright-install"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Download Electron and Playwright
    retryCountOnTaskFailure: 3

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - script: ./scripts/test.sh --build --tfs "Unit Tests"
      displayName: 🧪 Run unit tests (Electron)
      timeoutInMinutes: 15
    - script: npm run test-node -- --build
      displayName: 🧪 Run unit tests (node.js)
      timeoutInMinutes: 15

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - script: npm run test-browser-no-install -- --build --browser webkit --tfs "Browser Unit Tests"
      env:
        DEBUG: "*browser*"
      displayName: 🧪 Run unit tests (Browser, Webkit)
      timeoutInMinutes: 30

  - script: |
      set -e
      npm run gulp \
        compile-extension:configuration-editing \
        compile-extension:css-language-features-server \
        compile-extension:emmet \
        compile-extension:git \
        compile-extension:github-authentication \
        compile-extension:html-language-features-server \
        compile-extension:ipynb \
        compile-extension:notebook-renderers \
        compile-extension:json-language-features-server \
        compile-extension:markdown-language-features \
        compile-extension-media \
        compile-extension:microsoft-authentication \
        compile-extension:typescript-language-features \
        compile-extension:vscode-api-tests \
        compile-extension:vscode-colorize-tests \
        compile-extension:vscode-colorize-perf-tests \
        compile-extension:vscode-test-resolver
    displayName: Build integration tests

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - script: |
        # Figure out the full absolute path of the product we just built
        # including the remote server and configure the integration tests
        # to run with these builds instead of running out of sources.
        set -e
        APP_ROOT="$(agent.builddirectory)/VSCode-darwin-$(VSCODE_ARCH)"
        APP_NAME="`ls $APP_ROOT | head -n 1`"
        INTEGRATION_TEST_ELECTRON_PATH="$APP_ROOT/$APP_NAME/Contents/MacOS/Electron" \
        ./scripts/test-integration.sh --build --tfs "Integration Tests"
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-darwin-$(VSCODE_ARCH)
      displayName: 🧪 Run integration tests (Electron)
      timeoutInMinutes: 20

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - script: ./scripts/test-web-integration.sh --browser webkit
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-darwin-$(VSCODE_ARCH)-web
      displayName: 🧪 Run integration tests (Browser, Webkit)
      timeoutInMinutes: 20

  - ${{ if eq(parameters.VSCODE_RUN_REMOTE_TESTS, true) }}:
    - script: |
        set -e
        APP_ROOT=$(agent.builddirectory)/VSCode-darwin-$(VSCODE_ARCH)
        APP_NAME="`ls $APP_ROOT | head -n 1`"
        INTEGRATION_TEST_ELECTRON_PATH="$APP_ROOT/$APP_NAME/Contents/MacOS/Electron" \
        ./scripts/test-remote-integration.sh
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-darwin-$(VSCODE_ARCH)
      displayName: 🧪 Run integration tests (Remote)
      timeoutInMinutes: 20

  - script: ps -ef
    displayName: Diagnostics before smoke test run
    continueOnError: true
    condition: succeededOrFailed()

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - script: |
        set -e
        APP_ROOT=$(agent.builddirectory)/VSCode-darwin-$(VSCODE_ARCH)
        APP_NAME="`ls $APP_ROOT | head -n 1`"
        npm run smoketest-no-compile -- --tracing --build "$APP_ROOT/$APP_NAME"
      timeoutInMinutes: 20
      displayName: 🧪 Run smoke tests (Electron)

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - script: npm run smoketest-no-compile -- --web --tracing --headless
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-darwin-$(VSCODE_ARCH)-web
      timeoutInMinutes: 20
      displayName: 🧪 Run smoke tests (Browser, Chromium)

  - ${{ if eq(parameters.VSCODE_RUN_REMOTE_TESTS, true) }}:
    - script: |
        set -e
        npm run gulp compile-extension:vscode-test-resolver
        APP_ROOT=$(agent.builddirectory)/VSCode-darwin-$(VSCODE_ARCH)
        APP_NAME="`ls $APP_ROOT | head -n 1`"
        npm run smoketest-no-compile -- --tracing --remote --build "$APP_ROOT/$APP_NAME"
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-darwin-$(VSCODE_ARCH)
      timeoutInMinutes: 20
      displayName: 🧪 Run smoke tests (Remote)

  - script: ps -ef
    displayName: Diagnostics after smoke test run
    continueOnError: true
    condition: succeededOrFailed()

  - task: PublishTestResults@2
    displayName: Publish Tests Results
    inputs:
      testResultsFiles: "*-results.xml"
      searchFolder: "$(Build.ArtifactStagingDirectory)/test-results"
    condition: succeededOrFailed()
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/distro/download-distro.yml]---
Location: vscode-main/build/azure-pipelines/distro/download-distro.yml

```yaml
steps:
  - task: AzureKeyVault@2
    displayName: "Azure Key Vault: Get Secrets"
    inputs:
      azureSubscription: vscode
      KeyVaultName: vscode-build-secrets
      SecretsFilter: "github-distro-mixin-password"

  # TODO@joaomoreno: Keep pwsh once we move out of running entire jobs in containers
  - pwsh: |
      "machine github.com`nlogin vscode`npassword $(github-distro-mixin-password)" | Out-File "$Home/_netrc" -Encoding ASCII
    condition: and(succeeded(), contains(variables['Agent.OS'], 'windows'))
    displayName: Setup distro auth (Windows)

  - pwsh: |
      $ErrorActionPreference = "Stop"
      $ArchivePath = "$(Agent.TempDirectory)/distro.zip"
      $PackageJson = Get-Content -Path package.json -Raw | ConvertFrom-Json
      $DistroVersion = $PackageJson.distro

      Invoke-WebRequest -Uri "https://api.github.com/repos/microsoft/vscode-distro/zipball/$DistroVersion" `
        -OutFile $ArchivePath `
        -Headers @{ "Accept" = "application/vnd.github+json"; "Authorization" = "Bearer $(github-distro-mixin-password)"; "X-GitHub-Api-Version" = "2022-11-28" }

      New-Item -ItemType Directory -Path .build -Force
      Expand-Archive -Path $ArchivePath -DestinationPath .build
      Rename-Item -Path ".build/microsoft-vscode-distro-$DistroVersion" -NewName distro
    condition: and(succeeded(), contains(variables['Agent.OS'], 'windows'))
    displayName: Download distro (Windows)

  - script: |
      mkdir -p .build
      cat << EOF | tee ~/.netrc .build/.netrc > /dev/null
      machine github.com
      login vscode
      password $(github-distro-mixin-password)
      EOF
    condition: and(succeeded(), not(contains(variables['Agent.OS'], 'windows')))
    displayName: Setup distro auth (non-Windows)

  - script: |
      set -e
      ArchivePath="$(Agent.TempDirectory)/distro.zip"
      DistroVersion=$(node -p "require('./package.json').distro")

      curl -H "Accept: application/vnd.github+json" \
        -H "Authorization: Bearer $(github-distro-mixin-password)" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        -o $ArchivePath \
        -L "https://api.github.com/repos/microsoft/vscode-distro/zipball/$DistroVersion"

      unzip $ArchivePath -d .build
      mv .build/microsoft-vscode-distro-$DistroVersion .build/distro
    condition: and(succeeded(), not(contains(variables['Agent.OS'], 'windows')))
    displayName: Download distro (non-Windows)
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/distro/mixin-npm.ts]---
Location: vscode-main/build/azure-pipelines/distro/mixin-npm.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import { dirs } from '../../npm/dirs.ts';

function log(...args: unknown[]): void {
	console.log(`[${new Date().toLocaleTimeString('en', { hour12: false })}]`, '[distro]', ...args);
}

function mixin(mixinPath: string) {
	if (!fs.existsSync(`${mixinPath}/node_modules`)) {
		log(`Skipping distro npm dependencies: ${mixinPath} (no node_modules)`);
		return;
	}

	log(`Mixing in distro npm dependencies: ${mixinPath}`);

	const distroPackageJson = JSON.parse(fs.readFileSync(`${mixinPath}/package.json`, 'utf8'));
	const targetPath = path.relative('.build/distro/npm', mixinPath);

	for (const dependency of Object.keys(distroPackageJson.dependencies)) {
		fs.rmSync(`./${targetPath}/node_modules/${dependency}`, { recursive: true, force: true });
		fs.cpSync(`${mixinPath}/node_modules/${dependency}`, `./${targetPath}/node_modules/${dependency}`, { recursive: true, force: true, dereference: true });
	}

	log(`Mixed in distro npm dependencies: ${mixinPath} ✔︎`);
}

function main() {
	log(`Mixing in distro npm dependencies...`);

	const mixinPaths = dirs.filter(d => /^.build\/distro\/npm/.test(d));

	for (const mixinPath of mixinPaths) {
		mixin(mixinPath);
	}
}

main();
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/distro/mixin-quality.ts]---
Location: vscode-main/build/azure-pipelines/distro/mixin-quality.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';

interface IBuiltInExtension {
	readonly name: string;
	readonly version: string;
	readonly repo: string;
	readonly metadata: any;
}

interface OSSProduct {
	readonly builtInExtensions: IBuiltInExtension[];
	readonly webBuiltInExtensions?: IBuiltInExtension[];
}

interface Product {
	readonly builtInExtensions?: IBuiltInExtension[] | { 'include'?: IBuiltInExtension[]; 'exclude'?: string[] };
	readonly webBuiltInExtensions?: IBuiltInExtension[];
}

function log(...args: unknown[]): void {
	console.log(`[${new Date().toLocaleTimeString('en', { hour12: false })}]`, '[distro]', ...args);
}

function main() {
	const quality = process.env['VSCODE_QUALITY'];

	if (!quality) {
		throw new Error('Missing VSCODE_QUALITY, skipping mixin');
	}

	log(`Mixing in distro quality...`);

	const basePath = `.build/distro/mixin/${quality}`;

	for (const name of fs.readdirSync(basePath)) {
		const distroPath = path.join(basePath, name);
		const ossPath = path.relative(basePath, distroPath);

		if (ossPath === 'product.json') {
			const distro = JSON.parse(fs.readFileSync(distroPath, 'utf8')) as Product;
			const oss = JSON.parse(fs.readFileSync(ossPath, 'utf8')) as OSSProduct;
			let builtInExtensions = oss.builtInExtensions;

			if (Array.isArray(distro.builtInExtensions)) {
				log('Overwriting built-in extensions:', distro.builtInExtensions.map(e => e.name));

				builtInExtensions = distro.builtInExtensions;
			} else if (distro.builtInExtensions) {
				const include = distro.builtInExtensions['include'] ?? [];
				const exclude = distro.builtInExtensions['exclude'] ?? [];

				log('OSS built-in extensions:', builtInExtensions.map(e => e.name));
				log('Including built-in extensions:', include.map(e => e.name));
				log('Excluding built-in extensions:', exclude);

				builtInExtensions = builtInExtensions.filter(ext => !include.find(e => e.name === ext.name) && !exclude.find(name => name === ext.name));
				builtInExtensions = [...builtInExtensions, ...include];

				log('Final built-in extensions:', builtInExtensions.map(e => e.name));
			} else {
				log('Inheriting OSS built-in extensions', builtInExtensions.map(e => e.name));
			}

			const result = { webBuiltInExtensions: oss.webBuiltInExtensions, ...distro, builtInExtensions };
			fs.writeFileSync(ossPath, JSON.stringify(result, null, '\t'), 'utf8');
		} else {
			fs.cpSync(distroPath, ossPath, { force: true, recursive: true });
		}

		log(distroPath, '✔︎');
	}
}

main();
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/.gitignore]---
Location: vscode-main/build/azure-pipelines/linux/.gitignore

```text
pat
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/apt-retry.sh]---
Location: vscode-main/build/azure-pipelines/linux/apt-retry.sh

```bash
#!/bin/sh
################################################################################
##  Copied from https://github.com/actions/runner-images/blob/ubuntu22/20240825.1/images/ubuntu/scripts/build/configure-apt-mock.sh
################################################################################

i=1
while [ $i -le 30 ];do
  err=$(mktemp)
  "$@" 2>$err

  # no errors, break the loop and continue normal flow
  test -f $err || break
  cat $err >&2

  retry=false

  if grep -q 'Could not get lock' $err;then
    # apt db locked needs retry
    retry=true
  elif grep -q 'Could not open file /var/lib/apt/lists' $err;then
    # apt update is not completed, needs retry
    retry=true
  elif grep -q 'IPC connect call failed' $err;then
    # the delay should help with gpg-agent not ready
    retry=true
  elif grep -q 'Temporary failure in name resolution' $err;then
    # It looks like DNS is not updated with random generated hostname yet
    retry=true
  elif grep -q 'dpkg frontend is locked by another process' $err;then
    # dpkg process is busy by another process
    retry=true
  fi

  rm $err
  if [ $retry = false ]; then
    break
  fi

  sleep 5
  echo "...retry $i"
  i=$((i + 1))
done
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/build-snap.sh]---
Location: vscode-main/build/azure-pipelines/linux/build-snap.sh

```bash
#!/usr/bin/env bash
set -e

# Get snapcraft version
snapcraft --version

# Make sure we get latest packages
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y curl apt-transport-https ca-certificates

# Define variables
SNAP_ROOT="$(pwd)/.build/linux/snap/$VSCODE_ARCH"

# Create snap package
BUILD_VERSION="$(date +%s)"
SNAP_FILENAME="code-$VSCODE_QUALITY-$VSCODE_ARCH-$BUILD_VERSION.snap"
SNAP_PATH="$SNAP_ROOT/$SNAP_FILENAME"
case $VSCODE_ARCH in
  x64) SNAPCRAFT_TARGET_ARGS="" ;;
  *) SNAPCRAFT_TARGET_ARGS="--target-arch $VSCODE_ARCH" ;;
esac
(cd $SNAP_ROOT/code-* && sudo --preserve-env snapcraft snap $SNAPCRAFT_TARGET_ARGS --output "$SNAP_PATH")
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/codesign.ts]---
Location: vscode-main/build/azure-pipelines/linux/codesign.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { printBanner, spawnCodesignProcess, streamProcessOutputAndCheckResult } from '../common/codesign.ts';
import { e } from '../common/publish.ts';

async function main() {
	const esrpCliDLLPath = e('EsrpCliDllPath');

	// Start the code sign processes in parallel
	// 1. Codesign deb package
	// 2. Codesign rpm package
	const codesignTask1 = spawnCodesignProcess(esrpCliDLLPath, 'sign-pgp', '.build/linux/deb', '*.deb');
	const codesignTask2 = spawnCodesignProcess(esrpCliDLLPath, 'sign-pgp', '.build/linux/rpm', '*.rpm');

	// Codesign deb package
	printBanner('Codesign deb package');
	await streamProcessOutputAndCheckResult('Codesign deb package', codesignTask1);

	// Codesign rpm package
	printBanner('Codesign rpm package');
	await streamProcessOutputAndCheckResult('Codesign rpm package', codesignTask2);
}

main().then(() => {
	process.exit(0);
}, err => {
	console.error(`ERROR: ${err}`);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/product-build-linux-ci.yml]---
Location: vscode-main/build/azure-pipelines/linux/product-build-linux-ci.yml

```yaml
parameters:
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_QUALITY
    type: string
  - name: VSCODE_TEST_SUITE
    type: string

jobs:
  - job: Linux${{ parameters.VSCODE_TEST_SUITE }}
    displayName: ${{ parameters.VSCODE_TEST_SUITE }} Tests
    timeoutInMinutes: 30
    variables:
      DISPLAY: ":10"
      NPM_ARCH: x64
      VSCODE_ARCH: x64
    templateContext:
      outputs:
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/.build/crashes
          artifactName: crash-dump-linux-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Crash Reports
          sbomEnabled: false
          isProduction: false
          condition: failed()
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/node_modules
          artifactName: node-modules-linux-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Node Modules
          sbomEnabled: false
          isProduction: false
          condition: failed()
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/.build/logs
          artifactName: logs-linux-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Log Files
          sbomEnabled: false
          isProduction: false
          condition: succeededOrFailed()
    steps:
      - template: ./steps/product-build-linux-compile.yml@self
        parameters:
          VSCODE_ARCH: x64
          VSCODE_CIBUILD: ${{ parameters.VSCODE_CIBUILD }}
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Electron') }}:
            VSCODE_RUN_ELECTRON_TESTS: true
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Browser') }}:
            VSCODE_RUN_BROWSER_TESTS: true
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Remote') }}:
            VSCODE_RUN_REMOTE_TESTS: true
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/product-build-linux-cli.yml]---
Location: vscode-main/build/azure-pipelines/linux/product-build-linux-cli.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_CHECK_ONLY
    type: boolean
    default: false
  - name: VSCODE_QUALITY
    type: string

jobs:
  - job: LinuxCLI_${{ parameters.VSCODE_ARCH }}
    displayName: Linux (${{ upper(parameters.VSCODE_ARCH) }})
    timeoutInMinutes: 60
    pool:
      name: 1es-ubuntu-22.04-x64
      os: linux
    variables:
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
    templateContext:
      outputs:
        - ${{ if not(parameters.VSCODE_CHECK_ONLY) }}:
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/vscode_cli_linux_$(VSCODE_ARCH)_cli.tar.gz
            artifactName: vscode_cli_linux_$(VSCODE_ARCH)_cli
            displayName: Publish vscode_cli_linux_$(VSCODE_ARCH)_cli artifact
            sbomBuildDropPath: $(Build.ArtifactStagingDirectory)/cli
            sbomPackageName: "VS Code Linux $(VSCODE_ARCH) CLI"
            sbomPackageVersion: $(Build.SourceVersion)
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - template: ../cli/cli-apply-patches.yml@self

      - task: Npm@1
        displayName: Download openssl prebuilt
        inputs:
          command: custom
          customCommand: pack @vscode-internal/openssl-prebuilt@0.0.11
          customRegistry: useFeed
          customFeed: "Monaco/openssl-prebuilt"
          workingDir: $(Build.ArtifactStagingDirectory)

      - script: |
          set -e
          mkdir $(Build.ArtifactStagingDirectory)/openssl
          tar -xvzf $(Build.ArtifactStagingDirectory)/vscode-internal-openssl-prebuilt-0.0.11.tgz --strip-components=1 --directory=$(Build.ArtifactStagingDirectory)/openssl
        displayName: Extract openssl prebuilt

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY build
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - script: |
          set -e
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          npm config set registry "$NPM_REGISTRY"
          echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Authentication

      - script: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        workingDirectory: build
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Install build dependencies

      - script: |
          set -e
          mkdir -p $(Build.SourcesDirectory)/.build
        displayName: Create .build folder for misc dependencies

      - template: ../cli/install-rust-posix.yml@self
        parameters:
          targets:
            - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
              - x86_64-unknown-linux-gnu
            - ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
              - aarch64-unknown-linux-gnu
            - ${{ if eq(parameters.VSCODE_ARCH, 'armhf') }}:
              - armv7-unknown-linux-gnueabihf

      - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
        - template: ../cli/cli-compile.yml@self
          parameters:
            VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
            VSCODE_CLI_TARGET: x86_64-unknown-linux-gnu
            VSCODE_CLI_ARTIFACT: vscode_cli_linux_x64_cli
            VSCODE_CHECK_ONLY: ${{ parameters.VSCODE_CHECK_ONLY }}
            VSCODE_CLI_ENV:
              OPENSSL_LIB_DIR: $(Build.ArtifactStagingDirectory)/openssl/x64-linux/lib
              OPENSSL_INCLUDE_DIR: $(Build.ArtifactStagingDirectory)/openssl/x64-linux/include
              SYSROOT_ARCH: amd64

      - ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
        - template: ../cli/cli-compile.yml@self
          parameters:
            VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
            VSCODE_CLI_TARGET: aarch64-unknown-linux-gnu
            VSCODE_CLI_ARTIFACT: vscode_cli_linux_arm64_cli
            VSCODE_CHECK_ONLY: ${{ parameters.VSCODE_CHECK_ONLY }}
            VSCODE_CLI_ENV:
              OPENSSL_LIB_DIR: $(Build.ArtifactStagingDirectory)/openssl/arm64-linux/lib
              OPENSSL_INCLUDE_DIR: $(Build.ArtifactStagingDirectory)/openssl/arm64-linux/include
              SYSROOT_ARCH: arm64

      - ${{ if eq(parameters.VSCODE_ARCH, 'armhf') }}:
        - template: ../cli/cli-compile.yml@self
          parameters:
            VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
            VSCODE_CLI_TARGET: armv7-unknown-linux-gnueabihf
            VSCODE_CLI_ARTIFACT: vscode_cli_linux_armhf_cli
            VSCODE_CHECK_ONLY: ${{ parameters.VSCODE_CHECK_ONLY }}
            VSCODE_CLI_ENV:
              OPENSSL_LIB_DIR: $(Build.ArtifactStagingDirectory)/openssl/arm-linux/lib
              OPENSSL_INCLUDE_DIR: $(Build.ArtifactStagingDirectory)/openssl/arm-linux/include
              SYSROOT_ARCH: armhf
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/product-build-linux-node-modules.yml]---
Location: vscode-main/build/azure-pipelines/linux/product-build-linux-node-modules.yml

```yaml
parameters:
  - name: NPM_ARCH
    type: string
  - name: VSCODE_ARCH
    type: string

jobs:
  - job: LinuxNodeModules_${{ parameters.VSCODE_ARCH }}
    displayName: Linux (${{ upper(parameters.VSCODE_ARCH) }})
    pool:
      name: 1es-ubuntu-22.04-x64
      os: linux
    timeoutInMinutes: 60
    variables:
      NPM_ARCH: ${{ parameters.NPM_ARCH }}
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - template: ../distro/download-distro.yml@self

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password"

      - script: |
          set -e
          # Start X server
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get update
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get install -y pkg-config \
            xvfb \
            libgtk-3-0 \
            libxkbfile-dev \
            libkrb5-dev \
            libgbm1 \
            rpm
          sudo cp build/azure-pipelines/linux/xvfb.init /etc/init.d/xvfb
          sudo chmod +x /etc/init.d/xvfb
          sudo update-rc.d xvfb defaults
          sudo service xvfb start
        displayName: Setup system services

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts linux $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash
        displayName: Prepare node_modules cache key

      - task: Cache@2
        inputs:
          key: '"node_modules" | .build/packagelockhash'
          path: .build/node_modules_cache
          cacheHitVar: NODE_MODULES_RESTORED
        displayName: Restore node_modules cache

      - script: |
          set -e
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          npm config set registry "$NPM_REGISTRY"
          echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Authentication

      - script: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        workingDirectory: build
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Install build dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      # Step will be used by both verify glibcxx version for remote server and building rpm package,
      # hence avoid adding it behind NODE_MODULES_RESTORED condition.
      - script: |
          set -e
          SYSROOT_ARCH=$VSCODE_ARCH
          if [ "$SYSROOT_ARCH" == "x64" ]; then
            SYSROOT_ARCH="amd64"
          fi
          export VSCODE_SYSROOT_DIR=$(Build.SourcesDirectory)/.build/sysroots/glibc-2.28-gcc-8.5.0
          SYSROOT_ARCH="$SYSROOT_ARCH" VSCODE_SYSROOT_PREFIX="-glibc-2.28-gcc-8.5.0" node -e 'import { getVSCodeSysroot } from "./build/linux/debian/install-sysroot.ts"; (async () => { await getVSCodeSysroot(process.env["SYSROOT_ARCH"]); })()'
        env:
          VSCODE_ARCH: $(VSCODE_ARCH)
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Download vscode sysroots
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: |
          set -e

          source ./build/azure-pipelines/linux/setup-env.sh

          # Run preinstall script before root dependencies are installed
          # so that v8 headers are patched correctly for native modules.
          node build/npm/preinstall.ts

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          npm_config_arch: $(NPM_ARCH)
          VSCODE_ARCH: $(VSCODE_ARCH)
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Install dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: node build/azure-pipelines/distro/mixin-npm.ts
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Mixin distro node modules

      - script: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Create node_modules archive
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/product-build-linux.yml]---
Location: vscode-main/build/azure-pipelines/linux/product-build-linux.yml

```yaml
parameters:
  - name: NPM_ARCH
    type: string
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_QUALITY
    type: string
  - name: VSCODE_BUILD_LINUX_SNAP
    type: boolean
    default: false
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean
    default: false

jobs:
  - job: Linux_${{ parameters.VSCODE_ARCH }}
    displayName: Linux (${{ upper(parameters.VSCODE_ARCH) }})
    timeoutInMinutes: 90
    variables:
      DISPLAY: ":10"
      NPM_ARCH: ${{ parameters.NPM_ARCH }}
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
    templateContext:
      sdl:
        binskim:
          analyzeTargetGlob: '$(Agent.BuildDirectory)/VSCode-linux-$(VSCODE_ARCH)/**/*.node;$(Agent.BuildDirectory)/vscode-server-linux-$(VSCODE_ARCH)/**/*.node;$(Agent.BuildDirectory)/vscode-server-linux-$(VSCODE_ARCH)-web/**/*.node'
          preReleaseVersion: '4.3.1'
      outputParentDirectory: $(Build.ArtifactStagingDirectory)/out
      outputs:
        - ${{ if or(eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true), eq(parameters.VSCODE_RUN_BROWSER_TESTS, true), eq(parameters.VSCODE_RUN_REMOTE_TESTS, true)) }}:
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/.build/crashes
            artifactName: crash-dump-linux-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: Publish Crash Reports
            sbomEnabled: false
            isProduction: false
            condition: failed()
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/node_modules
            artifactName: node-modules-linux-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: Publish Node Modules
            sbomEnabled: false
            isProduction: false
            condition: failed()
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/.build/logs
            artifactName: logs-linux-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: Publish Log Files
            sbomEnabled: false
            isProduction: false
            condition: succeededOrFailed()
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/client/$(CLIENT_ARCHIVE_NAME)
          artifactName: vscode_client_linux_$(VSCODE_ARCH)_archive-unsigned
          displayName: Publish client archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/VSCode-linux-$(VSCODE_ARCH)
          sbomPackageName: "VS Code Linux $(VSCODE_ARCH) (unsigned)"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/server/vscode-server-linux-$(VSCODE_ARCH).tar.gz
          artifactName: vscode_server_linux_$(VSCODE_ARCH)_archive-unsigned
          displayName: Publish server archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/vscode-server-linux-$(VSCODE_ARCH)
          sbomPackageName: "VS Code Linux $(VSCODE_ARCH) Server"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/web/vscode-server-linux-$(VSCODE_ARCH)-web.tar.gz
          artifactName: vscode_web_linux_$(VSCODE_ARCH)_archive-unsigned
          displayName: Publish web server archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/vscode-server-linux-$(VSCODE_ARCH)-web
          sbomPackageName: "VS Code Linux $(VSCODE_ARCH) Web"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/deb/$(DEB_PACKAGE_NAME)
          artifactName: vscode_client_linux_$(VSCODE_ARCH)_deb-package
          displayName: Publish deb package
          sbomBuildDropPath: .build/linux/deb
          sbomPackageName: "VS Code Linux $(VSCODE_ARCH) DEB"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/rpm/$(RPM_PACKAGE_NAME)
          artifactName: vscode_client_linux_$(VSCODE_ARCH)_rpm-package
          displayName: Publish rpm package
          sbomBuildDropPath: .build/linux/rpm
          sbomPackageName: "VS Code Linux $(VSCODE_ARCH) RPM"
          sbomPackageVersion: $(Build.SourceVersion)
        - ${{ if eq(parameters.VSCODE_BUILD_LINUX_SNAP, true) }}:
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/snap/$(SNAP_PACKAGE_NAME)
            artifactName: vscode_client_linux_$(VSCODE_ARCH)_snap
            displayName: Publish snap package
            sbomBuildDropPath: $(SNAP_EXTRACTED_PATH)
            sbomPackageName: "VS Code Linux $(VSCODE_ARCH) SNAP"
            sbomPackageVersion: $(Build.SourceVersion)
    steps:
      - template: ./steps/product-build-linux-compile.yml@self
        parameters:
          VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
          VSCODE_CIBUILD: ${{ parameters.VSCODE_CIBUILD }}
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          VSCODE_BUILD_LINUX_SNAP: ${{ parameters.VSCODE_BUILD_LINUX_SNAP }}
          VSCODE_RUN_ELECTRON_TESTS: ${{ parameters.VSCODE_RUN_ELECTRON_TESTS }}
          VSCODE_RUN_BROWSER_TESTS: ${{ parameters.VSCODE_RUN_BROWSER_TESTS }}
          VSCODE_RUN_REMOTE_TESTS: ${{ parameters.VSCODE_RUN_REMOTE_TESTS }}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/setup-env.sh]---
Location: vscode-main/build/azure-pipelines/linux/setup-env.sh

```bash
#!/usr/bin/env bash

set -e

SYSROOT_ARCH=$VSCODE_ARCH
if [ "$SYSROOT_ARCH" == "x64" ]; then
  SYSROOT_ARCH="amd64"
fi

export VSCODE_CLIENT_SYSROOT_DIR=$PWD/.build/sysroots/glibc-2.28-gcc-10.5.0
export VSCODE_REMOTE_SYSROOT_DIR=$PWD/.build/sysroots/glibc-2.28-gcc-8.5.0
if [ -d "$VSCODE_CLIENT_SYSROOT_DIR" ]; then
  echo "Using cached client sysroot"
else
  echo "Downloading client sysroot"
  SYSROOT_ARCH="$SYSROOT_ARCH" VSCODE_SYSROOT_DIR="$VSCODE_CLIENT_SYSROOT_DIR" node -e 'import { getVSCodeSysroot } from "./build/linux/debian/install-sysroot.ts"; (async () => { await getVSCodeSysroot(process.env["SYSROOT_ARCH"]); })()'
fi

if [ -d "$VSCODE_REMOTE_SYSROOT_DIR" ]; then
  echo "Using cached remote sysroot"
else
  echo "Downloading remote sysroot"
  SYSROOT_ARCH="$SYSROOT_ARCH" VSCODE_SYSROOT_DIR="$VSCODE_REMOTE_SYSROOT_DIR" VSCODE_SYSROOT_PREFIX="-glibc-2.28-gcc-8.5.0" node -e 'import { getVSCodeSysroot } from "./build/linux/debian/install-sysroot.ts"; (async () => { await getVSCodeSysroot(process.env["SYSROOT_ARCH"]); })()'
fi

if [ "$npm_config_arch" == "x64" ]; then
  # Download clang based on chromium revision used by vscode
  curl -s https://raw.githubusercontent.com/chromium/chromium/142.0.7444.235/tools/clang/scripts/update.py | python - --output-dir=$PWD/.build/CR_Clang --host-os=linux

  # Download libcxx headers and objects from upstream electron releases
  DEBUG=libcxx-fetcher \
  VSCODE_LIBCXX_OBJECTS_DIR=$PWD/.build/libcxx-objects \
  VSCODE_LIBCXX_HEADERS_DIR=$PWD/.build/libcxx_headers  \
  VSCODE_LIBCXXABI_HEADERS_DIR=$PWD/.build/libcxxabi_headers \
  VSCODE_ARCH="$npm_config_arch" \
  node build/linux/libcxx-fetcher.ts

  # Set compiler toolchain
  # Flags for the client build are based on
  # https://source.chromium.org/chromium/chromium/src/+/refs/tags/142.0.7444.235:build/config/arm.gni
  # https://source.chromium.org/chromium/chromium/src/+/refs/tags/142.0.7444.235:build/config/compiler/BUILD.gn
  # https://source.chromium.org/chromium/chromium/src/+/refs/tags/142.0.7444.235:build/config/c++/BUILD.gn
  export CC="$PWD/.build/CR_Clang/bin/clang --gcc-toolchain=$VSCODE_CLIENT_SYSROOT_DIR/x86_64-linux-gnu"
  export CXX="$PWD/.build/CR_Clang/bin/clang++ --gcc-toolchain=$VSCODE_CLIENT_SYSROOT_DIR/x86_64-linux-gnu"
  export CXXFLAGS="-nostdinc++ -D__NO_INLINE__ -DSPDLOG_USE_STD_FORMAT -I$PWD/.build/libcxx_headers -isystem$PWD/.build/libcxx_headers/include -isystem$PWD/.build/libcxxabi_headers/include -fPIC -flto=thin -fsplit-lto-unit -D_LIBCPP_ABI_NAMESPACE=Cr -D_LIBCPP_HARDENING_MODE=_LIBCPP_HARDENING_MODE_EXTENSIVE --sysroot=$VSCODE_CLIENT_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot"
  export LDFLAGS="-stdlib=libc++ --sysroot=$VSCODE_CLIENT_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot -fuse-ld=lld -flto=thin -L$PWD/.build/libcxx-objects -lc++abi -L$VSCODE_CLIENT_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot/usr/lib/x86_64-linux-gnu -L$VSCODE_CLIENT_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot/lib/x86_64-linux-gnu -Wl,--lto-O0"

  # Set compiler toolchain for remote server
  export VSCODE_REMOTE_CC=$VSCODE_REMOTE_SYSROOT_DIR/x86_64-linux-gnu/bin/x86_64-linux-gnu-gcc
  export VSCODE_REMOTE_CXX=$VSCODE_REMOTE_SYSROOT_DIR/x86_64-linux-gnu/bin/x86_64-linux-gnu-g++
  export VSCODE_REMOTE_CXXFLAGS="--sysroot=$VSCODE_REMOTE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot"
  export VSCODE_REMOTE_LDFLAGS="--sysroot=$VSCODE_REMOTE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot -L$VSCODE_REMOTE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot/usr/lib/x86_64-linux-gnu -L$VSCODE_REMOTE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot/lib/x86_64-linux-gnu"
elif [ "$npm_config_arch" == "arm64" ]; then
  # Set compiler toolchain for client native modules
  export CC=$VSCODE_CLIENT_SYSROOT_DIR/aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc
  export CXX=$VSCODE_CLIENT_SYSROOT_DIR/aarch64-linux-gnu/bin/aarch64-linux-gnu-g++
  export CXXFLAGS="--sysroot=$VSCODE_CLIENT_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot"
  export LDFLAGS="--sysroot=$VSCODE_CLIENT_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot -L$VSCODE_CLIENT_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot/usr/lib/aarch64-linux-gnu -L$VSCODE_CLIENT_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot/lib/aarch64-linux-gnu"

  # Set compiler toolchain for remote server
  export VSCODE_REMOTE_CC=$VSCODE_REMOTE_SYSROOT_DIR/aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc
  export VSCODE_REMOTE_CXX=$VSCODE_REMOTE_SYSROOT_DIR/aarch64-linux-gnu/bin/aarch64-linux-gnu-g++
  export VSCODE_REMOTE_CXXFLAGS="--sysroot=$VSCODE_REMOTE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot"
  export VSCODE_REMOTE_LDFLAGS="--sysroot=$VSCODE_REMOTE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot -L$VSCODE_REMOTE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot/usr/lib/aarch64-linux-gnu -L$VSCODE_REMOTE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot/lib/aarch64-linux-gnu"
elif [ "$npm_config_arch" == "arm" ]; then
  # Set compiler toolchain for client native modules
  export CC=$VSCODE_CLIENT_SYSROOT_DIR/arm-rpi-linux-gnueabihf/bin/arm-rpi-linux-gnueabihf-gcc
  export CXX=$VSCODE_CLIENT_SYSROOT_DIR/arm-rpi-linux-gnueabihf/bin/arm-rpi-linux-gnueabihf-g++
  export CXXFLAGS="--sysroot=$VSCODE_CLIENT_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot"
  export LDFLAGS="--sysroot=$VSCODE_CLIENT_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot -L$VSCODE_CLIENT_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot/usr/lib/arm-linux-gnueabihf -L$VSCODE_CLIENT_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot/lib/arm-linux-gnueabihf"

  # Set compiler toolchain for remote server
  export VSCODE_REMOTE_CC=$VSCODE_REMOTE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/bin/arm-rpi-linux-gnueabihf-gcc
  export VSCODE_REMOTE_CXX=$VSCODE_REMOTE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/bin/arm-rpi-linux-gnueabihf-g++
  export VSCODE_REMOTE_CXXFLAGS="--sysroot=$VSCODE_REMOTE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot"
  export VSCODE_REMOTE_LDFLAGS="--sysroot=$VSCODE_REMOTE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot -L$VSCODE_REMOTE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot/usr/lib/arm-linux-gnueabihf -L$VSCODE_REMOTE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot/lib/arm-linux-gnueabihf"
fi
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/verify-glibc-requirements.sh]---
Location: vscode-main/build/azure-pipelines/linux/verify-glibc-requirements.sh

```bash
#!/usr/bin/env bash

set -e

TRIPLE="x86_64-linux-gnu"
if [ "$VSCODE_ARCH" == "arm64" ]; then
  TRIPLE="aarch64-linux-gnu"
elif [ "$VSCODE_ARCH" == "armhf" ]; then
  TRIPLE="arm-rpi-linux-gnueabihf"
fi

# Get all files with .node extension from server folder
files=$(find $SEARCH_PATH -name "*.node" -not -path "*prebuilds*" -not -path "*extensions/node_modules/@parcel/watcher*" -o -type f -executable -name "node")

echo "Verifying requirements for files: $files"

for file in $files; do
  glibc_version="$EXPECTED_GLIBC_VERSION"
  glibcxx_version="$EXPECTED_GLIBCXX_VERSION"
  while IFS= read -r line; do
    if [[ $line == *"GLIBC_"* ]]; then
      version=$(echo "$line" | awk '{if ($5 ~ /^[0-9a-fA-F]+$/) print $6; else print $5}' | tr -d '()')
      version=${version#*_}
      if [[ $(printf "%s\n%s" "$version" "$glibc_version" | sort -V | tail -n1) == "$version" ]]; then
        glibc_version=$version
      fi
    elif [[ $line == *"GLIBCXX_"* ]]; then
      version=$(echo "$line" | awk '{if ($5 ~ /^[0-9a-fA-F]+$/) print $6; else print $5}' | tr -d '()')
      version=${version#*_}
      if [[ $(printf "%s\n%s" "$version" "$glibcxx_version" | sort -V | tail -n1) == "$version" ]]; then
        glibcxx_version=$version
      fi
    fi
  done < <("$VSCODE_SYSROOT_DIR/$TRIPLE/$TRIPLE/bin/objdump" -T "$file")

  if [[ "$glibc_version" != "$EXPECTED_GLIBC_VERSION" ]]; then
    echo "Error: File $file has dependency on GLIBC > $EXPECTED_GLIBC_VERSION, found $glibc_version"
    exit 1
  fi
  if [[ "$glibcxx_version" != "$EXPECTED_GLIBCXX_VERSION" ]]; then
    echo "Error: File $file has dependency on GLIBCXX > $EXPECTED_GLIBCXX_VERSION, found $glibcxx_version"
  fi
done
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/xvfb.init]---
Location: vscode-main/build/azure-pipelines/linux/xvfb.init

```text
#!/bin/bash
#
# /etc/rc.d/init.d/xvfbd
#
# chkconfig: 345 95 28
# description: Starts/Stops X Virtual Framebuffer server
# processname: Xvfb
#
### BEGIN INIT INFO
# Provides:          xvfb
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start xvfb at boot time
# Description:       Enable xvfb provided by daemon.
### END INIT INFO

[ "${NETWORKING}" = "no" ] && exit 0

PROG="/usr/bin/Xvfb"
PROG_OPTIONS=":10 -ac -screen 0 1024x768x24"
PROG_OUTPUT="/tmp/Xvfb.out"

case "$1" in
	start)
		echo "Starting : X Virtual Frame Buffer "
		$PROG $PROG_OPTIONS>>$PROG_OUTPUT 2>&1 &
		disown -ar
	;;
	stop)
		echo "Shutting down : X Virtual Frame Buffer"
		killproc $PROG
		RETVAL=$?
		[ $RETVAL -eq 0 ] && /bin/rm -f /var/lock/subsys/Xvfb
		/var/run/Xvfb.pid
		echo
	;;
	restart|reload)
		$0 stop
		$0 start
		RETVAL=$?
	;;
	status)
		status Xvfb
		RETVAL=$?
	;;
	*)
		echo $"Usage: $0 (start|stop|restart|reload|status)"
		exit 1
esac

exit $RETVAL
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/steps/product-build-linux-compile.yml]---
Location: vscode-main/build/azure-pipelines/linux/steps/product-build-linux-compile.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_QUALITY
    type: string
  - name: VSCODE_BUILD_LINUX_SNAP
    type: boolean
    default: false
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean
    default: false

steps:
  - template: ../../common/checkout.yml@self

  - task: NodeTool@0
    inputs:
      versionSource: fromFile
      versionFilePath: .nvmrc

  - template: ../../distro/download-distro.yml@self

  - task: AzureKeyVault@2
    displayName: "Azure Key Vault: Get Secrets"
    inputs:
      azureSubscription: vscode
      KeyVaultName: vscode-build-secrets
      SecretsFilter: "github-distro-mixin-password"

  - task: DownloadPipelineArtifact@2
    inputs:
      artifact: Compilation
      path: $(Build.ArtifactStagingDirectory)
    displayName: Download compilation output

  - script: tar -xzf $(Build.ArtifactStagingDirectory)/compilation.tar.gz
    displayName: Extract compilation output

  - script: |
      set -e
      # Start X server
      ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get update
      ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get install -y pkg-config \
        xvfb \
        libgtk-3-0 \
        libxkbfile-dev \
        libkrb5-dev \
        libgbm1 \
        rpm
      sudo cp build/azure-pipelines/linux/xvfb.init /etc/init.d/xvfb
      sudo chmod +x /etc/init.d/xvfb
      sudo update-rc.d xvfb defaults
      sudo service xvfb start
    displayName: Setup system services

  - script: node build/setup-npm-registry.ts $NPM_REGISTRY
    condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM Registry

  - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts linux $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash
    displayName: Prepare node_modules cache key

  - task: Cache@2
    inputs:
      key: '"node_modules" | .build/packagelockhash'
      path: .build/node_modules_cache
      cacheHitVar: NODE_MODULES_RESTORED
    displayName: Restore node_modules cache

  - script: tar -xzf .build/node_modules_cache/cache.tgz
    condition: and(succeeded(), eq(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Extract node_modules cache

  - script: |
      set -e
      # Set the private NPM registry to the global npmrc file
      # so that authentication works for subfolders like build/, remote/, extensions/ etc
      # which does not have their own .npmrc file
      npm config set registry "$NPM_REGISTRY"
      echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM

  - task: npmAuthenticate@0
    inputs:
      workingFile: $(NPMRC_PATH)
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM Authentication

  - script: |
      set -e

      for i in {1..5}; do # try 5 times
        npm ci && break
        if [ $i -eq 5 ]; then
          echo "Npm install failed too many times" >&2
          exit 1
        fi
        echo "Npm install failed $i, trying again..."
      done
    workingDirectory: build
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Install build dependencies
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

  # Step will be used by both verify glibcxx version for remote server and building rpm package,
  # hence avoid adding it behind NODE_MODULES_RESTORED condition.
  - script: |
      set -e
      SYSROOT_ARCH=$VSCODE_ARCH
      if [ "$SYSROOT_ARCH" == "x64" ]; then
        SYSROOT_ARCH="amd64"
      fi
      export VSCODE_SYSROOT_DIR=$(Build.SourcesDirectory)/.build/sysroots/glibc-2.28-gcc-8.5.0
      SYSROOT_ARCH="$SYSROOT_ARCH" VSCODE_SYSROOT_PREFIX="-glibc-2.28-gcc-8.5.0" node -e 'import { getVSCodeSysroot } from "./build/linux/debian/install-sysroot.ts"; (async () => { await getVSCodeSysroot(process.env["SYSROOT_ARCH"]); })()'
    env:
      VSCODE_ARCH: $(VSCODE_ARCH)
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Download vscode sysroots

  - script: |
      set -e

      source ./build/azure-pipelines/linux/setup-env.sh

      # Run preinstall script before root dependencies are installed
      # so that v8 headers are patched correctly for native modules.
      node build/npm/preinstall.ts

      for i in {1..5}; do # try 5 times
        npm ci && break
        if [ $i -eq 5 ]; then
          echo "Npm install failed too many times" >&2
          exit 1
        fi
        echo "Npm install failed $i, trying again..."
      done
    env:
      npm_config_arch: $(NPM_ARCH)
      VSCODE_ARCH: $(VSCODE_ARCH)
      ELECTRON_SKIP_BINARY_DOWNLOAD: 1
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Install dependencies
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

  - script: node build/azure-pipelines/distro/mixin-npm.ts
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Mixin distro node modules

  - script: |
      set -e
      node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
      mkdir -p .build/node_modules_cache
      tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Create node_modules archive

  - script: node build/azure-pipelines/distro/mixin-quality.ts
    displayName: Mixin distro quality

  - template: ../../common/install-builtin-extensions.yml@self

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - script: npm run copy-policy-dto --prefix build && node build/lib/policies/policyGenerator.ts build/lib/policies/policyData.jsonc linux
      displayName: Generate policy definitions
      retryCountOnTaskFailure: 3

  - script: |
      set -e
      npm run gulp vscode-linux-$(VSCODE_ARCH)-min-ci
      ARCHIVE_PATH=".build/linux/client/code-${{ parameters.VSCODE_QUALITY }}-$(VSCODE_ARCH)-$(date +%s).tar.gz"
      mkdir -p $(dirname $ARCHIVE_PATH)
      echo "##vso[task.setvariable variable=CLIENT_PATH]$ARCHIVE_PATH"
      echo "##vso[task.setvariable variable=CLIENT_ARCHIVE_NAME]$(basename $ARCHIVE_PATH)"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build client

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - task: DownloadPipelineArtifact@2
      inputs:
        artifact: $(ARTIFACT_PREFIX)vscode_cli_linux_$(VSCODE_ARCH)_cli
        patterns: "**"
        path: $(Build.ArtifactStagingDirectory)/cli
      displayName: Download VS Code CLI

    - script: |
        set -e
        tar -xzvf $(Build.ArtifactStagingDirectory)/cli/*.tar.gz -C $(Build.ArtifactStagingDirectory)/cli
        CLI_APP_NAME=$(node -p "require(\"$(agent.builddirectory)/VSCode-linux-$(VSCODE_ARCH)/resources/app/product.json\").tunnelApplicationName")
        APP_NAME=$(node -p "require(\"$(agent.builddirectory)/VSCode-linux-$(VSCODE_ARCH)/resources/app/product.json\").applicationName")
        mv $(Build.ArtifactStagingDirectory)/cli/$APP_NAME $(agent.builddirectory)/VSCode-linux-$(VSCODE_ARCH)/bin/$CLI_APP_NAME
      displayName: Mix in CLI

  - script: |
      set -e
      tar -czf $CLIENT_PATH -C .. VSCode-linux-$(VSCODE_ARCH)
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Archive client

  - script: |
      set -e
      npm run gulp vscode-reh-linux-$(VSCODE_ARCH)-min-ci
      mv ../vscode-reh-linux-$(VSCODE_ARCH) ../vscode-server-linux-$(VSCODE_ARCH) # TODO@joaomoreno
      ARCHIVE_PATH=".build/linux/server/vscode-server-linux-$(VSCODE_ARCH).tar.gz"
      UNARCHIVE_PATH="`pwd`/../vscode-server-linux-$(VSCODE_ARCH)"
      mkdir -p $(dirname $ARCHIVE_PATH)
      tar --owner=0 --group=0 -czf $ARCHIVE_PATH -C .. vscode-server-linux-$(VSCODE_ARCH)
      echo "##vso[task.setvariable variable=SERVER_PATH]$ARCHIVE_PATH"
      echo "##vso[task.setvariable variable=SERVER_UNARCHIVE_PATH]$UNARCHIVE_PATH"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build server

  - script: |
      set -e
      npm run gulp vscode-reh-web-linux-$(VSCODE_ARCH)-min-ci
      mv ../vscode-reh-web-linux-$(VSCODE_ARCH) ../vscode-server-linux-$(VSCODE_ARCH)-web # TODO@joaomoreno
      ARCHIVE_PATH=".build/linux/web/vscode-server-linux-$(VSCODE_ARCH)-web.tar.gz"
      mkdir -p $(dirname $ARCHIVE_PATH)
      tar --owner=0 --group=0 -czf $ARCHIVE_PATH -C .. vscode-server-linux-$(VSCODE_ARCH)-web
      echo "##vso[task.setvariable variable=WEB_PATH]$ARCHIVE_PATH"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build server (web)

  - ${{ if or(eq(parameters.VSCODE_ARCH, 'x64'), eq(parameters.VSCODE_ARCH, 'arm64')) }}:
    - script: |
        set -e

        EXPECTED_GLIBC_VERSION="2.28" \
        EXPECTED_GLIBCXX_VERSION="3.4.25" \
        VSCODE_SYSROOT_DIR="$(Build.SourcesDirectory)/.build/sysroots/glibc-2.28-gcc-8.5.0" \
        ./build/azure-pipelines/linux/verify-glibc-requirements.sh
      env:
        SEARCH_PATH: $(SERVER_UNARCHIVE_PATH)
        npm_config_arch: $(NPM_ARCH)
        VSCODE_ARCH: $(VSCODE_ARCH)
      displayName: Check GLIBC and GLIBCXX dependencies in server archive

  - ${{ else }}:
    - script: |
        set -e

        EXPECTED_GLIBC_VERSION="2.28" \
        EXPECTED_GLIBCXX_VERSION="3.4.26" \
        VSCODE_SYSROOT_DIR="$(Build.SourcesDirectory)/.build/sysroots/glibc-2.28-gcc-8.5.0" \
        ./build/azure-pipelines/linux/verify-glibc-requirements.sh
      env:
        SEARCH_PATH: $(SERVER_UNARCHIVE_PATH)
        npm_config_arch: $(NPM_ARCH)
        VSCODE_ARCH: $(VSCODE_ARCH)
      displayName: Check GLIBC and GLIBCXX dependencies in server archive

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - script:  |
        set -e
        npm run gulp "vscode-linux-$(VSCODE_ARCH)-prepare-deb"
      env:
        GITHUB_TOKEN: "$(github-distro-mixin-password)"
      displayName: Prepare deb package

    - script:  |
        set -e
        npm run gulp "vscode-linux-$(VSCODE_ARCH)-build-deb"
        mkdir -p .build/linux/deb
        cp .build/linux/deb/*/deb/*.deb .build/linux/deb/
        file_output=$(file $(ls .build/linux/deb/*.deb))
        if [[ "$file_output" != *"data compression xz"* ]]; then
          echo "Error: unknown compression. $file_output"
          exit 1
        fi
        echo "##vso[task.setvariable variable=DEB_PATH]$(ls .build/linux/deb/*.deb)"
        echo "##vso[task.setvariable variable=DEB_PACKAGE_NAME]$(basename $(ls .build/linux/deb/*.deb))"
      displayName: Build deb package

    - script:  |
        set -e
        TRIPLE=""
        if [ "$VSCODE_ARCH" == "x64" ]; then
          TRIPLE="x86_64-linux-gnu"
        elif [ "$VSCODE_ARCH" == "arm64" ]; then
          TRIPLE="aarch64-linux-gnu"
        elif [ "$VSCODE_ARCH" == "armhf" ]; then
          TRIPLE="arm-rpi-linux-gnueabihf"
        fi
        export VSCODE_SYSROOT_DIR=$(Build.SourcesDirectory)/.build/sysroots/glibc-2.28-gcc-10.5.0
        export STRIP="$VSCODE_SYSROOT_DIR/$TRIPLE/$TRIPLE/bin/strip"
        npm run gulp "vscode-linux-$(VSCODE_ARCH)-prepare-rpm"
      env:
        VSCODE_ARCH: $(VSCODE_ARCH)
      displayName: Prepare rpm package

    - script:  |
        set -e
        npm run gulp "vscode-linux-$(VSCODE_ARCH)-build-rpm"
        mkdir -p .build/linux/rpm
        cp .build/linux/rpm/*/*.rpm .build/linux/rpm/
        echo "##vso[task.setvariable variable=RPM_PATH]$(ls .build/linux/rpm/*.rpm)"
        echo "##vso[task.setvariable variable=RPM_PACKAGE_NAME]$(basename $(ls .build/linux/rpm/*.rpm))"
      displayName: Build rpm package

    - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
      - task: Docker@1
        inputs:
          azureSubscriptionEndpoint: vscode
          azureContainerRegistry: vscodehub.azurecr.io
          command: login
        displayName: Login to Container Registry

      - ${{ if eq(parameters.VSCODE_BUILD_LINUX_SNAP, true) }}:
        - script: |
            set -e
            npm run gulp "vscode-linux-$(VSCODE_ARCH)-prepare-snap"
            sudo -E docker run -e VSCODE_ARCH -e VSCODE_QUALITY -v $(pwd):/work -w /work vscodehub.azurecr.io/vscode-linux-build-agent:snapcraft-x64 /bin/bash -c "./build/azure-pipelines/linux/build-snap.sh"

            SNAP_ROOT="$(pwd)/.build/linux/snap/$(VSCODE_ARCH)"
            SNAP_EXTRACTED_PATH=$(find $SNAP_ROOT -maxdepth 1 -type d -name 'code-*')

            mkdir -p .build/linux/snap
            cp $(find $SNAP_ROOT -maxdepth 1 -type f -name '*.snap') .build/linux/snap/

            # SBOM tool doesn't like recursive symlinks
            sudo find $SNAP_EXTRACTED_PATH -type l -delete

            echo "##vso[task.setvariable variable=SNAP_EXTRACTED_PATH]$SNAP_EXTRACTED_PATH"
            echo "##vso[task.setvariable variable=SNAP_PATH]$(ls .build/linux/snap/*.snap)"
            echo "##vso[task.setvariable variable=SNAP_PACKAGE_NAME]$(basename $(ls .build/linux/snap/*.snap))"
          env:
            VSCODE_ARCH: $(VSCODE_ARCH)
          displayName: Build snap package

    - task: UseDotNet@2
      inputs:
        version: 6.x

    - task: EsrpCodeSigning@5
      inputs:
        UseMSIAuthentication: true
        ConnectedServiceName: vscode-esrp
        AppRegistrationClientId: $(ESRP_CLIENT_ID)
        AppRegistrationTenantId: $(ESRP_TENANT_ID)
        AuthAKVName: vscode-esrp
        AuthSignCertName: esrp-sign
        FolderPath: .
        Pattern: noop
      displayName: 'Install ESRP Tooling'

    - pwsh: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        $EsrpCodeSigningTool = (gci -directory -filter EsrpCodeSigning_* $(Agent.RootDirectory)/_tasks | Select-Object -last 1).FullName
        $Version = (gci -directory $EsrpCodeSigningTool | Select-Object -last 1).FullName
        echo "##vso[task.setvariable variable=EsrpCliDllPath]$Version/net6.0/esrpcli.dll"
      displayName: Find ESRP CLI

    - script: npx deemon --detach --wait node build/azure-pipelines/linux/codesign.ts
      env:
        EsrpCliDllPath: $(EsrpCliDllPath)
        SYSTEM_ACCESSTOKEN: $(System.AccessToken)
      displayName: ✍️ Codesign deb & rpm

  - ${{ if or(eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true), eq(parameters.VSCODE_RUN_BROWSER_TESTS, true), eq(parameters.VSCODE_RUN_REMOTE_TESTS, true)) }}:
    - template: product-build-linux-test.yml@self
      parameters:
        VSCODE_RUN_ELECTRON_TESTS: ${{ parameters.VSCODE_RUN_ELECTRON_TESTS }}
        VSCODE_RUN_BROWSER_TESTS: ${{ parameters.VSCODE_RUN_BROWSER_TESTS }}
        VSCODE_RUN_REMOTE_TESTS: ${{ parameters.VSCODE_RUN_REMOTE_TESTS }}

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - script: npx deemon --attach node build/azure-pipelines/linux/codesign.ts
      condition: succeededOrFailed()
      displayName: "✍️ Post-job: Codesign deb & rpm"

    - script: |
        set -e

        mkdir -p $(Build.ArtifactStagingDirectory)/out/client
        mv $(CLIENT_PATH) $(Build.ArtifactStagingDirectory)/out/client/$(CLIENT_ARCHIVE_NAME)

        mkdir -p $(Build.ArtifactStagingDirectory)/out/server
        mv $(SERVER_PATH) $(Build.ArtifactStagingDirectory)/out/server/$(basename $(SERVER_PATH))

        mkdir -p $(Build.ArtifactStagingDirectory)/out/web
        mv $(WEB_PATH) $(Build.ArtifactStagingDirectory)/out/web/$(basename $(WEB_PATH))

        mkdir -p $(Build.ArtifactStagingDirectory)/out/deb
        mv $(DEB_PATH) $(Build.ArtifactStagingDirectory)/out/deb/$(DEB_PACKAGE_NAME)

        mkdir -p $(Build.ArtifactStagingDirectory)/out/rpm
        mv $(RPM_PATH) $(Build.ArtifactStagingDirectory)/out/rpm/$(RPM_PACKAGE_NAME)

        if [ -n "$SNAP_PATH" ]; then
          mkdir -p $(Build.ArtifactStagingDirectory)/out/snap
          mv $(SNAP_PATH) $(Build.ArtifactStagingDirectory)/out/snap/$(SNAP_PACKAGE_NAME)
        fi

        # SBOM generation uses hard links which are not supported by the Linux kernel
        # for files that have the SUID bit set, so we need to remove the SUID bit from
        # the chrome-sandbox file.
        sudo ls -l $(Agent.BuildDirectory)/VSCode-linux-$(VSCODE_ARCH)/chrome-sandbox
        sudo chmod u-s $(Agent.BuildDirectory)/VSCode-linux-$(VSCODE_ARCH)/chrome-sandbox
        sudo ls -l $(Agent.BuildDirectory)/VSCode-linux-$(VSCODE_ARCH)/chrome-sandbox
      displayName: Move artifacts to out directory
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/linux/steps/product-build-linux-test.yml]---
Location: vscode-main/build/azure-pipelines/linux/steps/product-build-linux-test.yml

```yaml
parameters:
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean

steps:
  - script: npm exec -- npm-run-all -lp "electron $(VSCODE_ARCH)" "playwright-install"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Download Electron and Playwright
    retryCountOnTaskFailure: 3

  - script: |
      set -e
      APP_ROOT=$(agent.builddirectory)/VSCode-linux-$(VSCODE_ARCH)
      ELECTRON_ROOT=.build/electron
      sudo chown root $APP_ROOT/chrome-sandbox
      sudo chown root $ELECTRON_ROOT/chrome-sandbox
      sudo chmod 4755 $APP_ROOT/chrome-sandbox
      sudo chmod 4755 $ELECTRON_ROOT/chrome-sandbox
      stat $APP_ROOT/chrome-sandbox
      stat $ELECTRON_ROOT/chrome-sandbox
    displayName: Change setuid helper binary permission

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - script: ./scripts/test.sh --build --tfs "Unit Tests"
      displayName: 🧪 Run unit tests (Electron)
      timeoutInMinutes: 15
    - script: npm run test-node -- --build
      displayName: 🧪 Run unit tests (node.js)
      timeoutInMinutes: 15

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - script: npm run test-browser-no-install -- --build --browser chromium --tfs "Browser Unit Tests"
      env:
        DEBUG: "*browser*"
      displayName: 🧪 Run unit tests (Browser, Chromium)
      timeoutInMinutes: 15

  - script: |
      set -e
      npm run gulp \
        compile-extension:configuration-editing \
        compile-extension:css-language-features-server \
        compile-extension:emmet \
        compile-extension:git \
        compile-extension:github-authentication \
        compile-extension:html-language-features-server \
        compile-extension:ipynb \
        compile-extension:notebook-renderers \
        compile-extension:json-language-features-server \
        compile-extension:markdown-language-features \
        compile-extension-media \
        compile-extension:microsoft-authentication \
        compile-extension:typescript-language-features \
        compile-extension:vscode-api-tests \
        compile-extension:vscode-colorize-tests \
        compile-extension:vscode-colorize-perf-tests \
        compile-extension:vscode-test-resolver
    displayName: Build integration tests

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - script: |
        # Figure out the full absolute path of the product we just built
        # including the remote server and configure the integration tests
        # to run with these builds instead of running out of sources.
        set -e
        APP_ROOT=$(agent.builddirectory)/VSCode-linux-$(VSCODE_ARCH)
        APP_NAME=$(node -p "require(\"$APP_ROOT/resources/app/product.json\").applicationName")
        INTEGRATION_TEST_APP_NAME="$APP_NAME" \
        INTEGRATION_TEST_ELECTRON_PATH="$APP_ROOT/$APP_NAME" \
        ./scripts/test-integration.sh --build --tfs "Integration Tests"
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-linux-$(VSCODE_ARCH)
      displayName: 🧪 Run integration tests (Electron)
      timeoutInMinutes: 20

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - script: ./scripts/test-web-integration.sh --browser chromium
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-linux-$(VSCODE_ARCH)-web
      displayName: 🧪 Run integration tests (Browser, Chromium)
      timeoutInMinutes: 20

  - ${{ if eq(parameters.VSCODE_RUN_REMOTE_TESTS, true) }}:
    - script: |
        set -e
        APP_ROOT=$(agent.builddirectory)/VSCode-linux-$(VSCODE_ARCH)
        APP_NAME=$(node -p "require(\"$APP_ROOT/resources/app/product.json\").applicationName")
        INTEGRATION_TEST_APP_NAME="$APP_NAME" \
        INTEGRATION_TEST_ELECTRON_PATH="$APP_ROOT/$APP_NAME" \
        ./scripts/test-remote-integration.sh
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-linux-$(VSCODE_ARCH)
      displayName: 🧪 Run integration tests (Remote)
      timeoutInMinutes: 20

  - script: |
      set -e
      ps -ef
      cat /proc/sys/fs/inotify/max_user_watches
      lsof | wc -l
    displayName: Diagnostics before smoke test run (processes, max_user_watches, number of opened file handles)
    continueOnError: true
    condition: succeededOrFailed()

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - script: npm run smoketest-no-compile -- --tracing --build "$(agent.builddirectory)/VSCode-linux-$(VSCODE_ARCH)"
      timeoutInMinutes: 20
      displayName: 🧪 Run smoke tests (Electron)

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - script: npm run smoketest-no-compile -- --web --tracing --headless
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)/vscode-server-linux-$(VSCODE_ARCH)-web
      timeoutInMinutes: 20
      displayName: 🧪 Run smoke tests (Browser, Chromium)

  - ${{ if eq(parameters.VSCODE_RUN_REMOTE_TESTS, true) }}:
    - script: |
        set -e
        APP_PATH=$(agent.builddirectory)/VSCode-linux-$(VSCODE_ARCH)
        VSCODE_REMOTE_SERVER_PATH="$(agent.builddirectory)/vscode-server-linux-$(VSCODE_ARCH)" \
        npm run smoketest-no-compile -- --tracing --remote --build "$APP_PATH"
      timeoutInMinutes: 20
      displayName: 🧪 Run smoke tests (Remote)

  - script: |
      set -e
      ps -ef
      cat /proc/sys/fs/inotify/max_user_watches
      lsof | wc -l
    displayName: Diagnostics after smoke test run (processes, max_user_watches, number of opened file handles)
    continueOnError: true
    condition: succeededOrFailed()

  - task: PublishTestResults@2
    displayName: Publish Tests Results
    inputs:
      testResultsFiles: "*-results.xml"
      searchFolder: "$(Build.ArtifactStagingDirectory)/test-results"
    condition: succeededOrFailed()
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/publish-types/check-version.ts]---
Location: vscode-main/build/azure-pipelines/publish-types/check-version.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import cp from 'child_process';

let tag = '';
try {
	tag = cp
		.execSync('git describe --tags `git rev-list --tags --max-count=1`')
		.toString()
		.trim();

	if (!isValidTag(tag)) {
		throw Error(`Invalid tag ${tag}`);
	}
} catch (err) {
	console.error(err);
	console.error('Failed to update types');
	process.exit(1);
}

function isValidTag(t: string) {
	if (t.split('.').length !== 3) {
		return false;
	}

	const [major, minor, bug] = t.split('.');

	// Only release for tags like 1.34.0
	if (bug !== '0') {
		return false;
	}

	if (isNaN(parseInt(major, 10)) || isNaN(parseInt(minor, 10))) {
		return false;
	}

	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/publish-types/publish-types.yml]---
Location: vscode-main/build/azure-pipelines/publish-types/publish-types.yml

```yaml
# Publish @types/vscode for each release

trigger:
  branches:
    include: ["refs/tags/*"]

pr: none

pool:
  vmImage: ubuntu-latest

steps:
  - task: NodeTool@0
    inputs:
      versionSource: fromFile
      versionFilePath: .nvmrc

  - bash: |
      TAG_VERSION=$(git describe --tags `git rev-list --tags --max-count=1`)
      CHANNEL="C1C14HJ2F"

      if [ "$TAG_VERSION" == "1.999.0" ]; then
        MESSAGE="<!here>. Someone pushed 1.999.0 tag. Please delete it ASAP from remote and local."

        curl -X POST -H "Authorization: Bearer $(SLACK_TOKEN)" \
        -H 'Content-type: application/json; charset=utf-8' \
        --data '{"channel":"'"$CHANNEL"'", "link_names": true, "text":"'"$MESSAGE"'"}' \
        https://slack.com/api/chat.postMessage

        exit 1
      fi
    displayName: Check 1.999.0 tag

  - bash: |
      # Install build dependencies
      (cd build && npm ci)
      node build/azure-pipelines/publish-types/check-version.ts
    displayName: Check version

  - bash: |
      git config --global user.email "vscode@microsoft.com"
      git config --global user.name "VSCode"

      git clone https://$(GITHUB_TOKEN)@github.com/DefinitelyTyped/DefinitelyTyped.git --depth=1
      node build/azure-pipelines/publish-types/update-types.ts

      TAG_VERSION=$(git describe --tags `git rev-list --tags --max-count=1`)

      cd DefinitelyTyped

      git diff --color | cat
      git add -A
      git status
      git checkout -b "vscode-types-$TAG_VERSION"
      git commit -m "VS Code $TAG_VERSION Extension API"
      git push origin "vscode-types-$TAG_VERSION"

    displayName: Push update to DefinitelyTyped

  - bash: |
      TAG_VERSION=$(git describe --tags `git rev-list --tags --max-count=1`)
      CHANNEL="C1C14HJ2F"

      MESSAGE="DefinitelyTyped/DefinitelyTyped#vscode-types-$TAG_VERSION created. Endgame champion, please open this link, examine changes and create a PR:"
      LINK="https://github.com/DefinitelyTyped/DefinitelyTyped/compare/vscode-types-$TAG_VERSION?quick_pull=1&body=Updating%20VS%20Code%20Extension%20API.%20See%20https%3A%2F%2Fgithub.com%2Fmicrosoft%2Fvscode%2Fissues%2F70175%20for%20details."
      MESSAGE2="[@jrieken, @kmaetzel, @egamma]. Please review and merge PR to publish @types/vscode."

      curl -X POST -H "Authorization: Bearer $(SLACK_TOKEN)" \
      -H 'Content-type: application/json; charset=utf-8' \
      --data '{"channel":"'"$CHANNEL"'", "link_names": true, "text":"'"$MESSAGE"'"}' \
      https://slack.com/api/chat.postMessage

      curl -X POST -H "Authorization: Bearer $(SLACK_TOKEN)" \
      -H 'Content-type: application/json; charset=utf-8' \
      --data '{"channel":"'"$CHANNEL"'", "link_names": true, "text":"'"$LINK"'"}' \
      https://slack.com/api/chat.postMessage

      curl -X POST -H "Authorization: Bearer $(SLACK_TOKEN)" \
      -H 'Content-type: application/json; charset=utf-8' \
      --data '{"channel":"'"$CHANNEL"'", "link_names": true, "text":"'"$MESSAGE2"'"}' \
      https://slack.com/api/chat.postMessage

    displayName: Send message linking to changes on Slack
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/publish-types/update-types.ts]---
Location: vscode-main/build/azure-pipelines/publish-types/update-types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import cp from 'child_process';
import path from 'path';

let tag = '';
try {
	tag = cp
		.execSync('git describe --tags `git rev-list --tags --max-count=1`')
		.toString()
		.trim();

	const [major, minor] = tag.split('.');
	const shorttag = `${major}.${minor}`;

	const dtsUri = `https://raw.githubusercontent.com/microsoft/vscode/${tag}/src/vscode-dts/vscode.d.ts`;
	const outDtsPath = path.resolve(process.cwd(), 'DefinitelyTyped/types/vscode/index.d.ts');
	cp.execSync(`curl ${dtsUri} --output ${outDtsPath}`);

	updateDTSFile(outDtsPath, shorttag);

	const outPackageJsonPath = path.resolve(process.cwd(), 'DefinitelyTyped/types/vscode/package.json');
	const packageJson = JSON.parse(fs.readFileSync(outPackageJsonPath, 'utf-8'));
	packageJson.version = shorttag + '.9999';
	fs.writeFileSync(outPackageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

	console.log(`Done updating vscode.d.ts at ${outDtsPath} and package.json to version ${packageJson.version}`);
} catch (err) {
	console.error(err);
	console.error('Failed to update types');
	process.exit(1);
}

function updateDTSFile(outPath: string, shorttag: string) {
	const oldContent = fs.readFileSync(outPath, 'utf-8');
	const newContent = getNewFileContent(oldContent, shorttag);

	fs.writeFileSync(outPath, newContent);
}

function repeat(str: string, times: number): string {
	const result = new Array(times);
	for (let i = 0; i < times; i++) {
		result[i] = str;
	}
	return result.join('');
}

function convertTabsToSpaces(str: string): string {
	return str.replace(/\t/gm, value => repeat('    ', value.length));
}

function getNewFileContent(content: string, shorttag: string) {
	const oldheader = [
		`/*---------------------------------------------------------------------------------------------`,
		` *  Copyright (c) Microsoft Corporation. All rights reserved.`,
		` *  Licensed under the MIT License. See License.txt in the project root for license information.`,
		` *--------------------------------------------------------------------------------------------*/`
	].join('\n');

	return convertTabsToSpaces(getNewFileHeader(shorttag) + content.slice(oldheader.length));
}

function getNewFileHeader(shorttag: string) {
	const header = [
		`// Type definitions for Visual Studio Code ${shorttag}`,
		`// Project: https://github.com/microsoft/vscode`,
		`// Definitions by: Visual Studio Code Team, Microsoft <https://github.com/microsoft>`,
		`// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped`,
		``,
		`/*---------------------------------------------------------------------------------------------`,
		` *  Copyright (c) Microsoft Corporation. All rights reserved.`,
		` *  Licensed under the MIT License.`,
		` *  See https://github.com/microsoft/vscode/blob/main/LICENSE.txt for license information.`,
		` *--------------------------------------------------------------------------------------------*/`,
		``,
		`/**`,
		` * Type Definition for Visual Studio Code ${shorttag} Extension API`,
		` * See https://code.visualstudio.com/api for more information`,
		` */`
	].join('\n');

	return header;
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/web/product-build-web-node-modules.yml]---
Location: vscode-main/build/azure-pipelines/web/product-build-web-node-modules.yml

```yaml
jobs:
  - job: WebNodeModules
    displayName: Web
    pool:
      name: 1es-ubuntu-22.04-x64
      os: linux
    timeoutInMinutes: 60
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - template: ../distro/download-distro.yml@self

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password"

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts web $(node -p process.arch) > .build/packagelockhash
        displayName: Prepare node_modules cache key

      - task: Cache@2
        inputs:
          key: '"node_modules" | .build/packagelockhash'
          path: .build/node_modules_cache
          cacheHitVar: NODE_MODULES_RESTORED
        displayName: Restore node_modules cache

      - script: |
          set -e
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          npm config set registry "$NPM_REGISTRY"
          echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Authentication

      - script: |
          set -e
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get update
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get install -y libkrb5-dev
        displayName: Setup system services
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Install dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: node build/azure-pipelines/distro/mixin-npm.ts
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Mixin distro node modules

      - script: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Create node_modules archive
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/web/product-build-web.yml]---
Location: vscode-main/build/azure-pipelines/web/product-build-web.yml

```yaml
jobs:
  - job: Web
    displayName: Web
    timeoutInMinutes: 30
    pool:
      name: 1es-ubuntu-22.04-x64
      os: linux
    variables:
      VSCODE_ARCH: x64
    templateContext:
      outputs:
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/web/vscode-web.tar.gz
          artifactName: vscode_web_linux_standalone_archive-unsigned
          displayName: Publish web archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/vscode-web
          sbomPackageName: "VS Code Linux x64 Web (Standalone)"
          sbomPackageVersion: $(Build.SourceVersion)
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - template: ../distro/download-distro.yml@self

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password"

      - task: DownloadPipelineArtifact@2
        inputs:
          artifact: Compilation
          path: $(Build.ArtifactStagingDirectory)
        displayName: Download compilation output

      - script: tar -xzf $(Build.ArtifactStagingDirectory)/compilation.tar.gz
        displayName: Extract compilation output

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts web $(node -p process.arch) > .build/packagelockhash
        displayName: Prepare node_modules cache key

      - task: Cache@2
        inputs:
          key: '"node_modules" | .build/packagelockhash'
          path: .build/node_modules_cache
          cacheHitVar: NODE_MODULES_RESTORED
        displayName: Restore node_modules cache

      - script: tar -xzf .build/node_modules_cache/cache.tgz
        condition: and(succeeded(), eq(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Extract node_modules cache

      - script: |
          set -e
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          npm config set registry "$NPM_REGISTRY"
          echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Authentication

      - script: |
          set -e
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get update
          ./build/azure-pipelines/linux/apt-retry.sh sudo apt-get install -y libkrb5-dev
        displayName: Setup system services
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: |
          set -e

          for i in {1..5}; do # try 5 times
            npm ci && break
            if [ $i -eq 5 ]; then
              echo "Npm install failed too many times" >&2
              exit 1
            fi
            echo "Npm install failed $i, trying again..."
          done
        env:
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Install dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: node build/azure-pipelines/distro/mixin-npm.ts
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Mixin distro node modules

      - script: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Create node_modules archive

      - script: node build/azure-pipelines/distro/mixin-quality.ts
        displayName: Mixin distro quality

      - template: ../common/install-builtin-extensions.yml@self

      - script: |
          set -e
          npm run gulp vscode-web-min-ci
          ARCHIVE_PATH="$(Build.ArtifactStagingDirectory)/out/web/vscode-web.tar.gz"
          mkdir -p $(dirname $ARCHIVE_PATH)
          tar --owner=0 --group=0 -czf $ARCHIVE_PATH -C .. vscode-web
          echo "##vso[task.setvariable variable=WEB_PATH]$ARCHIVE_PATH"
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Build

      - task: AzureCLI@2
        displayName: Fetch secrets from Azure
        inputs:
          azureSubscription: vscode
          scriptType: pscore
          scriptLocation: inlineScript
          addSpnToEnvironment: true
          inlineScript: |
            Write-Host "##vso[task.setvariable variable=AZURE_TENANT_ID]$env:tenantId"
            Write-Host "##vso[task.setvariable variable=AZURE_CLIENT_ID]$env:servicePrincipalId"
            Write-Host "##vso[task.setvariable variable=AZURE_ID_TOKEN;issecret=true]$env:idToken"

      - script: |
          set -e
          AZURE_STORAGE_ACCOUNT="vscodeweb" \
          AZURE_TENANT_ID="$(AZURE_TENANT_ID)" \
          AZURE_CLIENT_ID="$(AZURE_CLIENT_ID)" \
          AZURE_ID_TOKEN="$(AZURE_ID_TOKEN)" \
            node build/azure-pipelines/upload-cdn.ts
        displayName: Upload to CDN

      - script: |
          set -e
          AZURE_STORAGE_ACCOUNT="vscodeweb" \
          AZURE_TENANT_ID="$(AZURE_TENANT_ID)" \
          AZURE_CLIENT_ID="$(AZURE_CLIENT_ID)" \
          AZURE_ID_TOKEN="$(AZURE_ID_TOKEN)" \
            node build/azure-pipelines/upload-sourcemaps.ts out-vscode-web-min out-vscode-web-min/vs/workbench/workbench.web.main.js.map
        displayName: Upload sourcemaps (Web Main)

      - script: |
          set -e
          AZURE_STORAGE_ACCOUNT="vscodeweb" \
          AZURE_TENANT_ID="$(AZURE_TENANT_ID)" \
          AZURE_CLIENT_ID="$(AZURE_CLIENT_ID)" \
          AZURE_ID_TOKEN="$(AZURE_ID_TOKEN)" \
            node build/azure-pipelines/upload-sourcemaps.ts out-vscode-web-min out-vscode-web-min/vs/workbench/workbench.web.main.internal.js.map
        displayName: Upload sourcemaps (Web Internal)

      - script: |
          set -e
          AZURE_STORAGE_ACCOUNT="vscodeweb" \
          AZURE_TENANT_ID="$(AZURE_TENANT_ID)" \
          AZURE_CLIENT_ID="$(AZURE_CLIENT_ID)" \
          AZURE_ID_TOKEN="$(AZURE_ID_TOKEN)" \
            node build/azure-pipelines/upload-nlsmetadata.ts
        displayName: Upload NLS Metadata
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/codesign.ts]---
Location: vscode-main/build/azure-pipelines/win32/codesign.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, usePwsh } from 'zx';
import { printBanner, spawnCodesignProcess, streamProcessOutputAndCheckResult } from '../common/codesign.ts';
import { e } from '../common/publish.ts';

async function main() {
	usePwsh();

	const arch = e('VSCODE_ARCH');
	const esrpCliDLLPath = e('EsrpCliDllPath');
	const codeSigningFolderPath = e('CodeSigningFolderPath');

	// Start the code sign processes in parallel
	// 1. Codesign executables and shared libraries
	// 2. Codesign Powershell scripts
	// 3. Codesign context menu appx package (insiders only)
	const codesignTask1 = spawnCodesignProcess(esrpCliDLLPath, 'sign-windows', codeSigningFolderPath, '*.dll,*.exe,*.node');
	const codesignTask2 = spawnCodesignProcess(esrpCliDLLPath, 'sign-windows-appx', codeSigningFolderPath, '*.ps1');
	const codesignTask3 = process.env['VSCODE_QUALITY'] === 'insider'
		? spawnCodesignProcess(esrpCliDLLPath, 'sign-windows-appx', codeSigningFolderPath, '*.appx')
		: undefined;

	// Codesign executables and shared libraries
	printBanner('Codesign executables and shared libraries');
	await streamProcessOutputAndCheckResult('Codesign executables and shared libraries', codesignTask1);

	// Codesign Powershell scripts
	printBanner('Codesign Powershell scripts');
	await streamProcessOutputAndCheckResult('Codesign Powershell scripts', codesignTask2);

	if (codesignTask3) {
		// Codesign context menu appx package
		printBanner('Codesign context menu appx package');
		await streamProcessOutputAndCheckResult('Codesign context menu appx package', codesignTask3);
	}

	// Create build artifact directory
	await $`New-Item -ItemType Directory -Path .build/win32-${arch} -Force`;

	// Package client
	if (process.env['BUILT_CLIENT']) {
		printBanner('Package client');
		const clientArchivePath = `.build/win32-${arch}/VSCode-win32-${arch}.zip`;
		await $`7z.exe a -tzip ${clientArchivePath} ../VSCode-win32-${arch}/* "-xr!CodeSignSummary*.md"`.pipe(process.stdout);
		await $`7z.exe l ${clientArchivePath}`.pipe(process.stdout);
	}

	// Package server
	if (process.env['BUILT_SERVER']) {
		printBanner('Package server');
		const serverArchivePath = `.build/win32-${arch}/vscode-server-win32-${arch}.zip`;
		await $`7z.exe a -tzip ${serverArchivePath} ../vscode-server-win32-${arch}`.pipe(process.stdout);
		await $`7z.exe l ${serverArchivePath}`.pipe(process.stdout);
	}

	// Package server (web)
	if (process.env['BUILT_WEB']) {
		printBanner('Package server (web)');
		const webArchivePath = `.build/win32-${arch}/vscode-server-win32-${arch}-web.zip`;
		await $`7z.exe a -tzip ${webArchivePath} ../vscode-server-win32-${arch}-web`.pipe(process.stdout);
		await $`7z.exe l ${webArchivePath}`.pipe(process.stdout);
	}

	// Sign setup
	if (process.env['BUILT_CLIENT']) {
		printBanner('Sign setup packages (system, user)');
		const task = $`npm exec -- npm-run-all -lp "gulp vscode-win32-${arch}-system-setup -- --sign" "gulp vscode-win32-${arch}-user-setup -- --sign"`;
		await streamProcessOutputAndCheckResult('Sign setup packages (system, user)', task);
	}
}

main().then(() => {
	process.exit(0);
}, err => {
	console.error(`ERROR: ${err}`);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/exec.ps1]---
Location: vscode-main/build/azure-pipelines/win32/exec.ps1

```powershell
# Taken from psake https://github.com/psake/psake

<#
.SYNOPSIS
  This is a helper function that runs a scriptblock and checks the PS variable $lastexitcode
  to see if an error occcured. If an error is detected then an exception is thrown.
  This function allows you to run command-line programs without having to
  explicitly check the $lastexitcode variable.

.EXAMPLE
  exec { svn info $repository_trunk } "Error executing SVN. Please verify SVN command-line client is installed"
#>
function Exec
{
	[CmdletBinding()]
	param(
		[Parameter(Position=0,Mandatory=1)][scriptblock]$cmd,
		[Parameter(Position=1,Mandatory=0)][string]$errorMessage = ($msgs.error_bad_command -f $cmd)
	)
	& $cmd
	if ($lastexitcode -ne 0) {
		throw ("Exec: " + $errorMessage)
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/import-esrp-auth-cert.ps1]---
Location: vscode-main/build/azure-pipelines/win32/import-esrp-auth-cert.ps1

```powershell
param ($CertBase64)
$ErrorActionPreference = "Stop"

$CertBytes = [System.Convert]::FromBase64String($CertBase64)
$CertCollection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
$CertCollection.Import($CertBytes, $null, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable -bxor [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::PersistKeySet)

$CertStore = New-Object System.Security.Cryptography.X509Certificates.X509Store("My","LocalMachine")
$CertStore.Open("ReadWrite")
$CertStore.AddRange($CertCollection)
$CertStore.Close()

$ESRPAuthCertificateSubjectName = $CertCollection[0].Subject
Write-Output ("##vso[task.setvariable variable=ESRPAuthCertificateSubjectName;]$ESRPAuthCertificateSubjectName")
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/listprocesses.bat]---
Location: vscode-main/build/azure-pipelines/win32/listprocesses.bat

```bat
echo "------------------------------------"
tasklist /V
echo "------------------------------------"
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/product-build-win32-ci.yml]---
Location: vscode-main/build/azure-pipelines/win32/product-build-win32-ci.yml

```yaml
parameters:
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_QUALITY
    type: string
  - name: VSCODE_TEST_SUITE
    type: string

jobs:
  - job: Windows${{ parameters.VSCODE_TEST_SUITE }}
    displayName: ${{ parameters.VSCODE_TEST_SUITE }} Tests
    timeoutInMinutes: 50
    variables:
      VSCODE_ARCH: x64
    templateContext:
      outputs:
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/.build/crashes
          artifactName: crash-dump-windows-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Crash Reports
          sbomEnabled: false
          isProduction: false
          condition: failed()
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/node_modules
          artifactName: node-modules-windows-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Node Modules
          sbomEnabled: false
          isProduction: false
          condition: failed()
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/.build/logs
          artifactName: logs-windows-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Log Files
          sbomEnabled: false
          isProduction: false
          condition: succeededOrFailed()
    steps:
      - template: ./steps/product-build-win32-compile.yml@self
        parameters:
          VSCODE_ARCH: x64
          VSCODE_CIBUILD: ${{ parameters.VSCODE_CIBUILD }}
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Electron') }}:
            VSCODE_RUN_ELECTRON_TESTS: true
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Browser') }}:
            VSCODE_RUN_BROWSER_TESTS: true
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Remote') }}:
            VSCODE_RUN_REMOTE_TESTS: true
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/product-build-win32-cli-sign.yml]---
Location: vscode-main/build/azure-pipelines/win32/product-build-win32-cli-sign.yml

```yaml
parameters:
  - name: VSCODE_BUILD_WIN32
    type: boolean
  - name: VSCODE_BUILD_WIN32_ARM64
    type: boolean

jobs:
  - job: WindowsCLISign
    timeoutInMinutes: 90
    templateContext:
      outputParentDirectory: $(Build.ArtifactStagingDirectory)/out
      outputs:
        - ${{ if eq(parameters.VSCODE_BUILD_WIN32, true) }}:
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_cli_win32_x64_cli.zip
            artifactName: vscode_cli_win32_x64_cli
            displayName: Publish signed artifact with ID vscode_cli_win32_x64_cli
            sbomBuildDropPath: $(Build.BinariesDirectory)/sign/unsigned_vscode_cli_win32_x64_cli
            sbomPackageName: "VS Code Windows x64 CLI"
            sbomPackageVersion: $(Build.SourceVersion)
        - ${{ if eq(parameters.VSCODE_BUILD_WIN32_ARM64, true) }}:
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_cli_win32_arm64_cli.zip
            artifactName: vscode_cli_win32_arm64_cli
            displayName: Publish signed artifact with ID vscode_cli_win32_arm64_cli
            sbomBuildDropPath: $(Build.BinariesDirectory)/sign/unsigned_vscode_cli_win32_arm64_cli
            sbomPackageName: "VS Code Windows arm64 CLI"
            sbomPackageVersion: $(Build.SourceVersion)
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        displayName: "Use Node.js"
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password"

      - powershell: node build/setup-npm-registry.ts $env:NPM_REGISTRY build
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - powershell: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          exec { npm config set registry "$env:NPM_REGISTRY" }
          $NpmrcPath = (npm config get userconfig)
          echo "##vso[task.setvariable variable=NPMRC_PATH]$NpmrcPath"
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Authentication

      - powershell: |
          . azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          exec { npm ci }
        workingDirectory: build
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        retryCountOnTaskFailure: 5
        displayName: Install build dependencies

      - template: ./steps/product-build-win32-cli-sign.yml@self
        parameters:
          VSCODE_CLI_ARTIFACTS:
            - ${{ if eq(parameters.VSCODE_BUILD_WIN32, true) }}:
              - unsigned_vscode_cli_win32_x64_cli
            - ${{ if eq(parameters.VSCODE_BUILD_WIN32_ARM64, true) }}:
              - unsigned_vscode_cli_win32_arm64_cli
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/product-build-win32-cli.yml]---
Location: vscode-main/build/azure-pipelines/win32/product-build-win32-cli.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_CHECK_ONLY
    type: boolean
    default: false
  - name: VSCODE_QUALITY
    type: string

jobs:
  - job: WindowsCLI_${{ upper(parameters.VSCODE_ARCH) }}
    displayName: Windows (${{ upper(parameters.VSCODE_ARCH) }})
    pool:
      name: 1es-windows-2022-x64
      os: windows
    timeoutInMinutes: 30
    variables:
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
    templateContext:
      outputs:
        - ${{ if not(parameters.VSCODE_CHECK_ONLY) }}:
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/unsigned_vscode_cli_win32_$(VSCODE_ARCH)_cli.zip
            artifactName: unsigned_vscode_cli_win32_$(VSCODE_ARCH)_cli
            displayName: Publish unsigned_vscode_cli_win32_$(VSCODE_ARCH)_cli artifact
            sbomEnabled: false
            isProduction: false

    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - template: ../cli/cli-apply-patches.yml@self

      - task: Npm@1
        displayName: Download openssl prebuilt
        inputs:
          command: custom
          customCommand: pack @vscode-internal/openssl-prebuilt@0.0.11
          customRegistry: useFeed
          customFeed: "Monaco/openssl-prebuilt"
          workingDir: $(Build.ArtifactStagingDirectory)

      - powershell: |
          mkdir $(Build.ArtifactStagingDirectory)/openssl
          tar -xvzf $(Build.ArtifactStagingDirectory)/vscode-internal-openssl-prebuilt-0.0.11.tgz --strip-components=1 --directory=$(Build.ArtifactStagingDirectory)/openssl
        displayName: Extract openssl prebuilt

      - template: ./steps/product-build-win32-install-rust.yml@self
        parameters:
          targets:
            - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
              - x86_64-pc-windows-msvc
            - ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
              - aarch64-pc-windows-msvc

      - template: ../cli/cli-compile.yml@self
        parameters:
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
            VSCODE_CLI_TARGET: x86_64-pc-windows-msvc
          ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
            VSCODE_CLI_TARGET: aarch64-pc-windows-msvc
          VSCODE_CLI_ARTIFACT: unsigned_vscode_cli_win32_$(VSCODE_ARCH)_cli
          VSCODE_CHECK_ONLY: ${{ parameters.VSCODE_CHECK_ONLY }}
          VSCODE_CLI_ENV:
            OPENSSL_LIB_DIR: $(Build.ArtifactStagingDirectory)/openssl/$(VSCODE_ARCH)-windows-static/lib
            OPENSSL_INCLUDE_DIR: $(Build.ArtifactStagingDirectory)/openssl/$(VSCODE_ARCH)-windows-static/include
            ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
              RUSTFLAGS: "-Ctarget-feature=+crt-static -Clink-args=/guard:cf -Clink-args=/CETCOMPAT"
            ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
              RUSTFLAGS: "-Ctarget-feature=+crt-static -Clink-args=/guard:cf -Clink-args=/CETCOMPAT:NO"
            CFLAGS: "/guard:cf /Qspectre"
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/product-build-win32-node-modules.yml]---
Location: vscode-main/build/azure-pipelines/win32/product-build-win32-node-modules.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string

jobs:
  - job: WindowsNodeModules_${{ parameters.VSCODE_ARCH }}
    displayName: Windows (${{ upper(parameters.VSCODE_ARCH) }})
    pool:
      name: 1es-windows-2022-x64
      os: windows
    timeoutInMinutes: 60
    variables:
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - task: UsePythonVersion@0
        inputs:
          versionSpec: "3.x"
          addToPath: true

      - template: ../distro/download-distro.yml@self

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password"

      - powershell: node build/setup-npm-registry.ts $env:NPM_REGISTRY
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - pwsh: |
          mkdir .build -ea 0
          node build/azure-pipelines/common/computeNodeModulesCacheKey.ts win32 $(VSCODE_ARCH) $(node -p process.arch) > .build/packagelockhash
        displayName: Prepare node_modules cache key

      - task: Cache@2
        inputs:
          key: '"node_modules" | .build/packagelockhash'
          path: .build/node_modules_cache
          cacheHitVar: NODE_MODULES_RESTORED
        displayName: Restore node_modules cache

      - powershell: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          exec { npm config set registry "$env:NPM_REGISTRY" }
          $NpmrcPath = (npm config get userconfig)
          echo "##vso[task.setvariable variable=NPMRC_PATH]$NpmrcPath"
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Authentication

      - powershell: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          exec { npm ci }
        env:
          npm_config_arch: $(VSCODE_ARCH)
          npm_config_foreground_scripts: "true"
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        retryCountOnTaskFailure: 5
        displayName: Install dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - powershell: node build/azure-pipelines/distro/mixin-npm.ts
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Mixin distro node modules

      - powershell: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          exec { node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt }
          exec { mkdir -Force .build/node_modules_cache }
          exec { 7z.exe a .build/node_modules_cache/cache.7z -mx3 `@.build/node_modules_list.txt }
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Create node_modules archive
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/product-build-win32.yml]---
Location: vscode-main/build/azure-pipelines/win32/product-build-win32.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_QUALITY
    type: string
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean
    default: false

jobs:
  - job: Windows_${{ parameters.VSCODE_ARCH }}
    displayName: Windows (${{ upper(parameters.VSCODE_ARCH) }})
    timeoutInMinutes: 90
    variables:
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
    templateContext:
      outputParentDirectory: $(Build.ArtifactStagingDirectory)/out
      outputs:
        - ${{ if or(eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true), eq(parameters.VSCODE_RUN_BROWSER_TESTS, true), eq(parameters.VSCODE_RUN_REMOTE_TESTS, true)) }}:
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/.build/crashes
            artifactName: crash-dump-windows-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: Publish Crash Reports
            sbomEnabled: false
            isProduction: false
            condition: failed()
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/node_modules
            artifactName: node-modules-windows-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: Publish Node Modules
            sbomEnabled: false
            isProduction: false
            condition: failed()
          - output: pipelineArtifact
            targetPath: $(Build.SourcesDirectory)/.build/logs
            artifactName: logs-windows-$(VSCODE_ARCH)-$(System.JobAttempt)
            displayName: Publish Log Files
            sbomEnabled: false
            isProduction: false
            condition: succeededOrFailed()
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/system-setup/VSCodeSetup-$(VSCODE_ARCH)-$(VSCODE_VERSION).exe
          artifactName: vscode_client_win32_$(VSCODE_ARCH)_setup
          displayName: Publish system setup
          sbomBuildDropPath: $(Agent.BuildDirectory)/VSCode-win32-$(VSCODE_ARCH)
          sbomPackageName: "VS Code Windows $(VSCODE_ARCH) System Setup"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/user-setup/VSCodeUserSetup-$(VSCODE_ARCH)-$(VSCODE_VERSION).exe
          artifactName: vscode_client_win32_$(VSCODE_ARCH)_user-setup
          displayName: Publish user setup
          sbomBuildDropPath: $(Agent.BuildDirectory)/VSCode-win32-$(VSCODE_ARCH)
          sbomPackageName: "VS Code Windows $(VSCODE_ARCH) User Setup"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/archive/VSCode-win32-$(VSCODE_ARCH)-$(VSCODE_VERSION).zip
          artifactName: vscode_client_win32_$(VSCODE_ARCH)_archive
          displayName: Publish archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/VSCode-win32-$(VSCODE_ARCH)
          sbomPackageName: "VS Code Windows $(VSCODE_ARCH)"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/server/vscode-server-win32-$(VSCODE_ARCH).zip
          artifactName: vscode_server_win32_$(VSCODE_ARCH)_archive
          displayName: Publish server archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/vscode-server-win32-$(VSCODE_ARCH)
          sbomPackageName: "VS Code Windows $(VSCODE_ARCH) Server"
          sbomPackageVersion: $(Build.SourceVersion)
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/out/web/vscode-server-win32-$(VSCODE_ARCH)-web.zip
          artifactName: vscode_web_win32_$(VSCODE_ARCH)_archive
          displayName: Publish web server archive
          sbomBuildDropPath: $(Agent.BuildDirectory)/vscode-server-win32-$(VSCODE_ARCH)-web
          sbomPackageName: "VS Code Windows $(VSCODE_ARCH) Web"
          sbomPackageVersion: $(Build.SourceVersion)
      sdl:
        suppression:
          suppressionFile: $(Build.SourcesDirectory)\.config\guardian\.gdnsuppress
    steps:
      - template: ./steps/product-build-win32-compile.yml@self
        parameters:
          VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
          VSCODE_CIBUILD: ${{ parameters.VSCODE_CIBUILD }}
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          VSCODE_RUN_ELECTRON_TESTS: ${{ parameters.VSCODE_RUN_ELECTRON_TESTS }}
          VSCODE_RUN_BROWSER_TESTS: ${{ parameters.VSCODE_RUN_BROWSER_TESTS }}
          VSCODE_RUN_REMOTE_TESTS: ${{ parameters.VSCODE_RUN_REMOTE_TESTS }}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/retry.ps1]---
Location: vscode-main/build/azure-pipelines/win32/retry.ps1

```powershell
function Retry
{
	[CmdletBinding()]
	param(
		[Parameter(Position=0,Mandatory=1)][scriptblock]$cmd
	)
	$retry = 0

	while ($retry++ -lt 5) {
		try {
			& $cmd
			return
		} catch {
			# noop
		}
	}

	throw "Max retries reached"
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/sdl-scan-win32.yml]---
Location: vscode-main/build/azure-pipelines/win32/sdl-scan-win32.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_QUALITY
    type: string

steps:
  - template: ../common/checkout.yml@self

  - task: NodeTool@0
    inputs:
      versionSource: fromFile
      versionFilePath: .nvmrc

  - task: UsePythonVersion@0
    inputs:
      versionSpec: "3.x"
      addToPath: true

  - template: ../distro/download-distro.yml@self

  - task: AzureKeyVault@2
    displayName: "Azure Key Vault: Get Secrets"
    inputs:
      azureSubscription: vscode
      KeyVaultName: vscode-build-secrets
      SecretsFilter: "github-distro-mixin-password"

  - powershell: node build/setup-npm-registry.ts $env:NPM_REGISTRY
    condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM Registry

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      # Set the private NPM registry to the global npmrc file
      # so that authentication works for subfolders like build/, remote/, extensions/ etc
      # which does not have their own .npmrc file
      exec { npm config set registry "$env:NPM_REGISTRY" }
      $NpmrcPath = (npm config get userconfig)
      echo "##vso[task.setvariable variable=NPMRC_PATH]$NpmrcPath"
    condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM

  - task: npmAuthenticate@0
    inputs:
      workingFile: $(NPMRC_PATH)
    condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM Authentication

  - pwsh: |
      $includes = @'
        {
          'target_defaults': {
            'conditions': [
              ['OS=="win"', {
                'msvs_settings': {
                  'VCCLCompilerTool': {
                    'AdditionalOptions': [
                      '/Zi',
                      '/FS'
                    ],
                  },
                  'VCLinkerTool': {
                    'AdditionalOptions': [
                      '/profile'
                    ]
                  }
                }
              }]
            ]
          }
        }
      '@

      if (!(Test-Path "~/.gyp")) {
        mkdir "~/.gyp"
      }
      echo $includes > "~/.gyp/include.gypi"
    displayName: Create include.gypi

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      exec { npm ci }
    env:
      npm_config_arch: ${{ parameters.VSCODE_ARCH }}
      npm_config_foreground_scripts: "true"
      ELECTRON_SKIP_BINARY_DOWNLOAD: 1
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    retryCountOnTaskFailure: 5
    displayName: Install dependencies

  - script: node build/azure-pipelines/distro/mixin-npm.ts
    displayName: Mixin distro node modules

  - script: node build/azure-pipelines/distro/mixin-quality.ts
    displayName: Mixin distro quality
    env:
      VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}

  - powershell: npm run compile
    displayName: Compile

  - powershell: npm run gulp "vscode-symbols-win32-${{ parameters.VSCODE_ARCH }}"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Download Symbols

  - powershell: |
      Get-ChildItem '$(Agent.BuildDirectory)\scanbin' -Recurse -Filter "*.exe"
      Get-ChildItem '$(Agent.BuildDirectory)\scanbin' -Recurse -Filter "*.dll"
      Get-ChildItem '$(Agent.BuildDirectory)\scanbin' -Recurse -Filter "*.node"
      Get-ChildItem '$(Agent.BuildDirectory)\scanbin' -Recurse -Filter "*.pdb"
    displayName: List files

  - task: PublishSymbols@2
    displayName: 'Publish Symbols to Artifacts'
    inputs:
      SymbolsFolder: '$(Agent.BuildDirectory)\scanbin'
      SearchPattern: '**/*.pdb'
      IndexSources: false
      PublishSymbols: true
      SymbolServerType: 'TeamServices'
      SymbolsProduct: 'vscode-client'

  - task: CopyFiles@2
    displayName: 'Collect Symbols for API Scan'
    inputs:
      SourceFolder: $(Agent.BuildDirectory)
      Contents: 'scanbin\**\*.pdb'
      TargetFolder: '$(Agent.BuildDirectory)\symbols'
      flattenFolders: true
    condition: succeeded()

  - task: APIScan@2
    inputs:
      softwareFolder: $(Agent.BuildDirectory)\scanbin
      softwareName: 'vscode-client'
      softwareVersionNum: '1'
      symbolsFolder: 'srv*https://symweb.azurefd.net;$(Agent.BuildDirectory)\symbols'
      isLargeApp: false
      toolVersion: 'Latest'
      azureSubscription: 'vscode-apiscan'
    displayName: Run ApiScan
    condition: succeeded()
    env:
      AzureServicesAuthConnectionString: RunAs=App;AppId=c0940da5-8bd3-4dd3-8af1-40774b50edbd;TenantId=72f988bf-86f1-41af-91ab-2d7cd011db47;ServiceConnectionId=3e55d992-b60d-414d-9071-e4fad359c748;
      SYSTEM_ACCESSTOKEN: $(System.AccessToken)

  - task: PublishSecurityAnalysisLogs@3
    inputs:
      ArtifactName: CodeAnalysisLogs
      ArtifactType: Container
      PublishProcessedResults: false
      AllTools: true

  # TSA Upload
  - task: securedevelopmentteam.vss-secure-development-tools.build-task-uploadtotsa.TSAUpload@2
    displayName: TSA Upload
    continueOnError: true
    inputs:
      GdnPublishTsaOnboard: true
      GdnPublishTsaConfigFile: '$(Build.SourcesDirectory)/build/azure-pipelines/config/tsaoptions.json'
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/steps/product-build-win32-cli-sign.yml]---
Location: vscode-main/build/azure-pipelines/win32/steps/product-build-win32-cli-sign.yml

```yaml
parameters:
  - name: VSCODE_CLI_ARTIFACTS
    type: object
    default: []

steps:
  - task: UseDotNet@2
    inputs:
      version: 6.x

  - task: EsrpCodeSigning@5
    inputs:
      UseMSIAuthentication: true
      ConnectedServiceName: vscode-esrp
      AppRegistrationClientId: $(ESRP_CLIENT_ID)
      AppRegistrationTenantId: $(ESRP_TENANT_ID)
      AuthAKVName: vscode-esrp
      AuthSignCertName: esrp-sign
      FolderPath: .
      Pattern: noop
    displayName: 'Install ESRP Tooling'

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      $EsrpCodeSigningTool = (gci -directory -filter EsrpCodeSigning_* $(Agent.RootDirectory)\_tasks | Select-Object -last 1).FullName
      $Version = (gci -directory $EsrpCodeSigningTool | Select-Object -last 1).FullName
      echo "##vso[task.setvariable variable=EsrpCliDllPath]$Version\net6.0\esrpcli.dll"
    displayName: Find ESRP CLI

  - ${{ each target in parameters.VSCODE_CLI_ARTIFACTS }}:
      - task: DownloadPipelineArtifact@2
        displayName: Download artifact
        inputs:
          artifact: ${{ target }}
          path: $(Build.BinariesDirectory)/pkg/${{ target }}

      - task: ExtractFiles@1
        displayName: Extract artifact
        inputs:
          archiveFilePatterns: $(Build.BinariesDirectory)/pkg/${{ target }}/*.zip
          destinationFolder: $(Build.BinariesDirectory)/sign/${{ target }}

  - powershell: node build\azure-pipelines\common\sign.ts $env:EsrpCliDllPath sign-windows $(Build.BinariesDirectory)/sign "*.exe"
    env:
      SYSTEM_ACCESSTOKEN: $(System.AccessToken)
    displayName: ✍️ Codesign

  - ${{ each target in parameters.VSCODE_CLI_ARTIFACTS }}:
      - powershell: |
          $ASSET_ID = "${{ target }}".replace("unsigned_", "");
          echo "##vso[task.setvariable variable=ASSET_ID]$ASSET_ID"
        displayName: Set asset id variable

      - task: ArchiveFiles@2
        displayName: Archive signed files
        inputs:
          rootFolderOrFile: $(Build.BinariesDirectory)/sign/${{ target }}
          includeRootFolder: false
          archiveType: zip
          archiveFile: $(Build.ArtifactStagingDirectory)/out/$(ASSET_ID).zip
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/steps/product-build-win32-compile.yml]---
Location: vscode-main/build/azure-pipelines/win32/steps/product-build-win32-compile.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_QUALITY
    type: string
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
    default: false
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean
    default: false

steps:
  - template: ../../common/checkout.yml@self

  - task: NodeTool@0
    inputs:
      versionSource: fromFile
      versionFilePath: .nvmrc

  - task: UsePythonVersion@0
    inputs:
      versionSpec: "3.x"
      addToPath: true

  - template: ../../distro/download-distro.yml@self

  - task: AzureKeyVault@2
    displayName: "Azure Key Vault: Get Secrets"
    inputs:
      azureSubscription: vscode
      KeyVaultName: vscode-build-secrets
      SecretsFilter: "github-distro-mixin-password"

  - task: DownloadPipelineArtifact@2
    inputs:
      artifact: Compilation
      path: $(Build.ArtifactStagingDirectory)
    displayName: Download compilation output

  - task: ExtractFiles@1
    displayName: Extract compilation output
    inputs:
      archiveFilePatterns: "$(Build.ArtifactStagingDirectory)/compilation.tar.gz"
      cleanDestinationFolder: false

  - powershell: node build/setup-npm-registry.ts $env:NPM_REGISTRY
    condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM Registry

  - pwsh: |
      mkdir .build -ea 0
      node build/azure-pipelines/common/computeNodeModulesCacheKey.ts win32 $(VSCODE_ARCH) $(node -p process.arch) > .build/packagelockhash
    displayName: Prepare node_modules cache key

  - task: Cache@2
    inputs:
      key: '"node_modules" | .build/packagelockhash'
      path: .build/node_modules_cache
      cacheHitVar: NODE_MODULES_RESTORED
    displayName: Restore node_modules cache

  - powershell: 7z.exe x .build/node_modules_cache/cache.7z -aoa
    condition: and(succeeded(), eq(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Extract node_modules cache

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      # Set the private NPM registry to the global npmrc file
      # so that authentication works for subfolders like build/, remote/, extensions/ etc
      # which does not have their own .npmrc file
      exec { npm config set registry "$env:NPM_REGISTRY" }
      $NpmrcPath = (npm config get userconfig)
      echo "##vso[task.setvariable variable=NPMRC_PATH]$NpmrcPath"
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM

  - task: npmAuthenticate@0
    inputs:
      workingFile: $(NPMRC_PATH)
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'), ne(variables['NPM_REGISTRY'], 'none'))
    displayName: Setup NPM Authentication

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      exec { npm ci }
    env:
      npm_config_arch: $(VSCODE_ARCH)
      npm_config_foreground_scripts: "true"
      ELECTRON_SKIP_BINARY_DOWNLOAD: 1
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    retryCountOnTaskFailure: 5
    displayName: Install dependencies
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

  - powershell: node build/azure-pipelines/distro/mixin-npm.ts
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Mixin distro node modules

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      exec { node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt }
      exec { mkdir -Force .build/node_modules_cache }
      exec { 7z.exe a .build/node_modules_cache/cache.7z -mx3 `@.build/node_modules_list.txt }
    condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
    displayName: Create node_modules archive

  - powershell: node build/azure-pipelines/distro/mixin-quality.ts
    displayName: Mixin distro quality

  - template: ../../common/install-builtin-extensions.yml@self

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - powershell: |
        npm run copy-policy-dto --prefix build
        node build\lib\policies\policyGenerator.ts build\lib\policies\policyData.jsonc win32
      displayName: Generate Group Policy definitions
      retryCountOnTaskFailure: 3

  - ${{ if and(ne(parameters.VSCODE_CIBUILD, true), ne(parameters.VSCODE_QUALITY, 'exploration')) }}:
    - powershell: node build/win32/explorer-dll-fetcher.ts .build/win32/appx
      displayName: Download Explorer dll

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      exec { npm run gulp "vscode-win32-$(VSCODE_ARCH)-min-ci" }
      exec { npm run gulp "vscode-win32-$(VSCODE_ARCH)-inno-updater" }
      echo "##vso[task.setvariable variable=BUILT_CLIENT]true"
      echo "##vso[task.setvariable variable=CodeSigningFolderPath]$(Agent.BuildDirectory)/VSCode-win32-$(VSCODE_ARCH)"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build client

  # Note: the appx prepare step has to follow Build client step since build step replaces the template
  # strings in the raw manifest file at resources/win32/appx/AppxManifest.xml and places it under
  # <build-out-dir>/appx/manifest, we need a separate step to prepare the appx package with the
  # final contents. In our case only the manifest file is bundled into the appx package.
  - ${{ if and(ne(parameters.VSCODE_CIBUILD, true), ne(parameters.VSCODE_QUALITY, 'exploration')) }}:
    - powershell: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        # Add Windows SDK to path
        $sdk = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x64"
        $env:PATH = "$sdk;$env:PATH"
        $AppxName = if ('$(VSCODE_QUALITY)' -eq 'stable') { 'code' } else { 'code_insider' }
        makeappx pack /d "$(Agent.BuildDirectory)/VSCode-win32-$(VSCODE_ARCH)/appx/manifest" /p "$(Agent.BuildDirectory)/VSCode-win32-$(VSCODE_ARCH)/appx/${AppxName}_$(VSCODE_ARCH).appx" /nv
        # Remove the raw manifest folder
        Remove-Item -Path "$(Agent.BuildDirectory)/VSCode-win32-$(VSCODE_ARCH)/appx/manifest" -Recurse -Force
      displayName: Prepare appx package

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      exec { npm run gulp "vscode-reh-win32-$(VSCODE_ARCH)-min-ci" }
      mv ..\vscode-reh-win32-$(VSCODE_ARCH) ..\vscode-server-win32-$(VSCODE_ARCH) # TODO@joaomoreno
      echo "##vso[task.setvariable variable=BUILT_SERVER]true"
      echo "##vso[task.setvariable variable=CodeSigningFolderPath]$(CodeSigningFolderPath),$(Agent.BuildDirectory)/vscode-server-win32-$(VSCODE_ARCH)"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build server

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      exec { npm run gulp "vscode-reh-web-win32-$(VSCODE_ARCH)-min-ci" }
      mv ..\vscode-reh-web-win32-$(VSCODE_ARCH) ..\vscode-server-win32-$(VSCODE_ARCH)-web # TODO@joaomoreno
      echo "##vso[task.setvariable variable=BUILT_WEB]true"
      echo "##vso[task.setvariable variable=CodeSigningFolderPath]$(CodeSigningFolderPath),$(Agent.BuildDirectory)/vscode-server-win32-$(VSCODE_ARCH)-web"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Build server (web)

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - task: DownloadPipelineArtifact@2
      inputs:
        artifact: unsigned_vscode_cli_win32_$(VSCODE_ARCH)_cli
        patterns: "**"
        path: $(Build.ArtifactStagingDirectory)/cli
      displayName: Download VS Code CLI

    - powershell: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        $ArtifactName = (gci -Path "$(Build.ArtifactStagingDirectory)/cli" | Select-Object -last 1).FullName
        Expand-Archive -Path $ArtifactName -DestinationPath "$(Build.ArtifactStagingDirectory)/cli"
        $ProductJsonPath = (Get-ChildItem -Path "$(Agent.BuildDirectory)\VSCode-win32-$(VSCODE_ARCH)" -Name "product.json" -Recurse | Select-Object -First 1)
        $AppProductJson = Get-Content -Raw -Path "$(Agent.BuildDirectory)\VSCode-win32-$(VSCODE_ARCH)\$ProductJsonPath" | ConvertFrom-Json
        $CliAppName = $AppProductJson.tunnelApplicationName
        $AppName = $AppProductJson.applicationName
        Move-Item -Path "$(Build.ArtifactStagingDirectory)/cli/$AppName.exe" -Destination "$(Agent.BuildDirectory)/VSCode-win32-$(VSCODE_ARCH)/bin/$CliAppName.exe"
      displayName: Move VS Code CLI

    - task: UseDotNet@2
      inputs:
        version: 6.x

    - task: EsrpCodeSigning@5
      inputs:
        UseMSIAuthentication: true
        ConnectedServiceName: vscode-esrp
        AppRegistrationClientId: $(ESRP_CLIENT_ID)
        AppRegistrationTenantId: $(ESRP_TENANT_ID)
        AuthAKVName: vscode-esrp
        AuthSignCertName: esrp-sign
        FolderPath: .
        Pattern: noop
      displayName: 'Install ESRP Tooling'

    - powershell: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        $EsrpCodeSigningTool = (gci -directory -filter EsrpCodeSigning_* $(Agent.RootDirectory)\_tasks | Select-Object -last 1).FullName
        $Version = (gci -directory $EsrpCodeSigningTool | Select-Object -last 1).FullName
        echo "##vso[task.setvariable variable=EsrpCliDllPath]$Version\net6.0\esrpcli.dll"
      displayName: Find ESRP CLI

    - powershell: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        exec { npx deemon --detach --wait -- npx zx build/azure-pipelines/win32/codesign.ts }
      env:
        SYSTEM_ACCESSTOKEN: $(System.AccessToken)
      displayName: ✍️ Codesign

  - ${{ if or(eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true), eq(parameters.VSCODE_RUN_BROWSER_TESTS, true), eq(parameters.VSCODE_RUN_REMOTE_TESTS, true)) }}:
    - template: product-build-win32-test.yml@self
      parameters:
        VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
        VSCODE_RUN_ELECTRON_TESTS: ${{ parameters.VSCODE_RUN_ELECTRON_TESTS }}
        VSCODE_RUN_BROWSER_TESTS: ${{ parameters.VSCODE_RUN_BROWSER_TESTS }}
        VSCODE_RUN_REMOTE_TESTS: ${{ parameters.VSCODE_RUN_REMOTE_TESTS }}

  - ${{ if ne(parameters.VSCODE_CIBUILD, true) }}:
    - powershell: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        exec { npx deemon --attach -- npx zx build/azure-pipelines/win32/codesign.ts }
      condition: succeededOrFailed()
      displayName: "✍️ Post-job: Codesign"

    - powershell: |
        $ErrorActionPreference = "Stop"

        $PackageJsonPath = (Get-ChildItem -Path "..\VSCode-win32-$(VSCODE_ARCH)" -Name "package.json" -Recurse | Select-Object -First 1)
        $PackageJson = Get-Content -Raw -Path ..\VSCode-win32-$(VSCODE_ARCH)\$PackageJsonPath | ConvertFrom-Json
        $Version = $PackageJson.version

        mkdir $(Build.ArtifactStagingDirectory)\out\system-setup -Force
        mv .build\win32-$(VSCODE_ARCH)\system-setup\VSCodeSetup.exe $(Build.ArtifactStagingDirectory)\out\system-setup\VSCodeSetup-$(VSCODE_ARCH)-$Version.exe

        mkdir $(Build.ArtifactStagingDirectory)\out\user-setup -Force
        mv .build\win32-$(VSCODE_ARCH)\user-setup\VSCodeSetup.exe $(Build.ArtifactStagingDirectory)\out\user-setup\VSCodeUserSetup-$(VSCODE_ARCH)-$Version.exe

        mkdir $(Build.ArtifactStagingDirectory)\out\archive -Force
        mv .build\win32-$(VSCODE_ARCH)\VSCode-win32-$(VSCODE_ARCH).zip $(Build.ArtifactStagingDirectory)\out\archive\VSCode-win32-$(VSCODE_ARCH)-$Version.zip

        mkdir $(Build.ArtifactStagingDirectory)\out\server -Force
        mv .build\win32-$(VSCODE_ARCH)\vscode-server-win32-$(VSCODE_ARCH).zip $(Build.ArtifactStagingDirectory)\out\server\vscode-server-win32-$(VSCODE_ARCH).zip

        mkdir $(Build.ArtifactStagingDirectory)\out\web -Force
        mv .build\win32-$(VSCODE_ARCH)\vscode-server-win32-$(VSCODE_ARCH)-web.zip $(Build.ArtifactStagingDirectory)\out\web\vscode-server-win32-$(VSCODE_ARCH)-web.zip

        echo "##vso[task.setvariable variable=VSCODE_VERSION]$Version"
      displayName: Move artifacts to out directory
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/steps/product-build-win32-install-rust.yml]---
Location: vscode-main/build/azure-pipelines/win32/steps/product-build-win32-install-rust.yml

```yaml
parameters:
  - name: channel
    type: string
    default: 1.88
  - name: targets
    default: []
    type: object

# Todo: use 1ES pipeline once extension is installed in ADO

steps:
  - task: RustInstaller@1
    inputs:
      rustVersion: ms-${{ parameters.channel }}
      cratesIoFeedOverride: $(CARGO_REGISTRY)
      additionalTargets: ${{ join(' ', parameters.targets) }}
      toolchainFeed: https://pkgs.dev.azure.com/monacotools/Monaco/_packaging/vscode/nuget/v3/index.json
      default: true
      addToPath: true
    displayName: Install MSFT Rust
    condition: and(succeeded(), ne(variables['CARGO_REGISTRY'], 'none'))

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      Invoke-WebRequest -Uri "https://win.rustup.rs" -Outfile $(Build.ArtifactStagingDirectory)/rustup-init.exe
      exec { $(Build.ArtifactStagingDirectory)/rustup-init.exe -y --profile minimal --default-toolchain $env:RUSTUP_TOOLCHAIN --default-host x86_64-pc-windows-msvc }
      echo "##vso[task.prependpath]$env:USERPROFILE\.cargo\bin"
    env:
      RUSTUP_TOOLCHAIN: ${{ parameters.channel }}
    displayName: Install OSS Rust
    condition: and(succeeded(), eq(variables['CARGO_REGISTRY'], 'none'))

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      exec { rustup default $RUSTUP_TOOLCHAIN }
      exec { rustup update $RUSTUP_TOOLCHAIN }
    env:
      RUSTUP_TOOLCHAIN: ${{ parameters.channel }}
    displayName: "Set Rust version"
    condition: and(succeeded(), eq(variables['CARGO_REGISTRY'], 'none'))

  - ${{ each target in parameters.targets }}:
    - script: rustup target add ${{ target }}
      displayName: "Adding Rust target '${{ target }}'"
      condition: and(succeeded(), eq(variables['CARGO_REGISTRY'], 'none'))

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      exec { rustc --version }
      exec { cargo --version }
    displayName: "Check Rust versions"
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/win32/steps/product-build-win32-test.yml]---
Location: vscode-main/build/azure-pipelines/win32/steps/product-build-win32-test.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string
  - name: VSCODE_RUN_ELECTRON_TESTS
    type: boolean
  - name: VSCODE_RUN_BROWSER_TESTS
    type: boolean
  - name: VSCODE_RUN_REMOTE_TESTS
    type: boolean

steps:
  - powershell: npm exec -- npm-run-all -lp "electron $(VSCODE_ARCH)" "playwright-install"
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    displayName: Download Electron and Playwright
    retryCountOnTaskFailure: 3

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - powershell: .\scripts\test.bat --build --tfs "Unit Tests"
      displayName: 🧪 Run unit tests (Electron)
      timeoutInMinutes: 15
    - powershell: npm run test-node -- --build
      displayName: 🧪 Run unit tests (node.js)
      timeoutInMinutes: 15

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - powershell: npm run test-browser-no-install -- --build --browser chromium --tfs "Browser Unit Tests"
      displayName: 🧪 Run unit tests (Browser, Chromium)
      timeoutInMinutes: 20

  - powershell: |
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      exec { npm run gulp `
        compile-extension:configuration-editing `
        compile-extension:css-language-features-server `
        compile-extension:emmet `
        compile-extension:git `
        compile-extension:github-authentication `
        compile-extension:html-language-features-server `
        compile-extension:ipynb `
        compile-extension:notebook-renderers `
        compile-extension:json-language-features-server `
        compile-extension:markdown-language-features `
        compile-extension-media `
        compile-extension:microsoft-authentication `
        compile-extension:typescript-language-features `
        compile-extension:vscode-api-tests `
        compile-extension:vscode-colorize-tests `
        compile-extension:vscode-colorize-perf-tests `
        compile-extension:vscode-test-resolver `
      }
    displayName: Build integration tests

  - powershell: .\build\azure-pipelines\win32\listprocesses.bat
    displayName: Diagnostics before integration test runs
    continueOnError: true
    condition: succeededOrFailed()

  - powershell: |
      # Copy client, server and web builds to a separate test directory, to avoid Access Denied errors in codesign
      . build/azure-pipelines/win32/exec.ps1
      $ErrorActionPreference = "Stop"
      $TestDir = "$(agent.builddirectory)\test"
      New-Item -ItemType Directory -Path $TestDir -Force
      Copy-Item -Path "$(agent.builddirectory)\VSCode-win32-$(VSCODE_ARCH)" -Destination "$TestDir\VSCode-win32-$(VSCODE_ARCH)" -Recurse -Force
      Copy-Item -Path "$(agent.builddirectory)\vscode-server-win32-$(VSCODE_ARCH)" -Destination "$TestDir\vscode-server-win32-$(VSCODE_ARCH)" -Recurse -Force
      Copy-Item -Path "$(agent.builddirectory)\vscode-server-win32-$(VSCODE_ARCH)-web" -Destination "$TestDir\vscode-server-win32-$(VSCODE_ARCH)-web" -Recurse -Force
    displayName: Copy builds to test directory

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - powershell: |
        # Figure out the full absolute path of the product we just built
        # including the remote server and configure the integration tests
        # to run with these builds instead of running out of sources.
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        $AppRoot = "$(agent.builddirectory)\test\VSCode-win32-$(VSCODE_ARCH)"
        $ProductJsonPath = (Get-ChildItem -Path "$AppRoot" -Name "product.json" -Recurse | Select-Object -First 1)
        $AppProductJson = Get-Content -Raw -Path "$AppRoot\$ProductJsonPath" | ConvertFrom-Json
        $AppNameShort = $AppProductJson.nameShort
        $env:INTEGRATION_TEST_ELECTRON_PATH = "$AppRoot\$AppNameShort.exe"
        $env:VSCODE_REMOTE_SERVER_PATH = "$(agent.builddirectory)\test\vscode-server-win32-$(VSCODE_ARCH)"
        exec { .\scripts\test-integration.bat --build --tfs "Integration Tests" }
      displayName: 🧪 Run integration tests (Electron)
      timeoutInMinutes: 20

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - powershell: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        $env:VSCODE_REMOTE_SERVER_PATH = "$(agent.builddirectory)\test\vscode-server-win32-$(VSCODE_ARCH)-web"
        exec { .\scripts\test-web-integration.bat --browser firefox }
      displayName: 🧪 Run integration tests (Browser, Firefox)
      timeoutInMinutes: 20

  - ${{ if eq(parameters.VSCODE_RUN_REMOTE_TESTS, true) }}:
    - powershell: |
        . build/azure-pipelines/win32/exec.ps1
        $ErrorActionPreference = "Stop"
        $AppRoot = "$(agent.builddirectory)\test\VSCode-win32-$(VSCODE_ARCH)"
        $ProductJsonPath = (Get-ChildItem -Path "$AppRoot" -Name "product.json" -Recurse | Select-Object -First 1)
        $AppProductJson = Get-Content -Raw -Path "$AppRoot\$ProductJsonPath" | ConvertFrom-Json
        $AppNameShort = $AppProductJson.nameShort
        $env:INTEGRATION_TEST_ELECTRON_PATH = "$AppRoot\$AppNameShort.exe"
        $env:VSCODE_REMOTE_SERVER_PATH = "$(agent.builddirectory)\test\vscode-server-win32-$(VSCODE_ARCH)"
        exec { .\scripts\test-remote-integration.bat }
      displayName: 🧪 Run integration tests (Remote)
      timeoutInMinutes: 20

  - powershell: .\build\azure-pipelines\win32\listprocesses.bat
    displayName: Diagnostics after integration test runs
    continueOnError: true
    condition: succeededOrFailed()

  - powershell: .\build\azure-pipelines\win32\listprocesses.bat
    displayName: Diagnostics before smoke test run
    continueOnError: true
    condition: succeededOrFailed()

  - ${{ if eq(parameters.VSCODE_RUN_ELECTRON_TESTS, true) }}:
    - powershell: npm run smoketest-no-compile -- --tracing --build "$(agent.builddirectory)\test\VSCode-win32-$(VSCODE_ARCH)"
      displayName: 🧪 Run smoke tests (Electron)
      timeoutInMinutes: 20

  - ${{ if eq(parameters.VSCODE_RUN_BROWSER_TESTS, true) }}:
    - powershell: npm run smoketest-no-compile -- --web --tracing --headless
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)\test\vscode-server-win32-$(VSCODE_ARCH)-web
      displayName: 🧪 Run smoke tests (Browser, Chromium)
      timeoutInMinutes: 20

  - ${{ if eq(parameters.VSCODE_RUN_REMOTE_TESTS, true) }}:
    - powershell: npm run smoketest-no-compile -- --tracing --remote --build "$(agent.builddirectory)\test\VSCode-win32-$(VSCODE_ARCH)"
      env:
        VSCODE_REMOTE_SERVER_PATH: $(agent.builddirectory)\test\vscode-server-win32-$(VSCODE_ARCH)
      displayName: 🧪 Run smoke tests (Remote)
      timeoutInMinutes: 20

  - powershell: .\build\azure-pipelines\win32\listprocesses.bat
    displayName: Diagnostics after smoke test run
    continueOnError: true
    condition: succeededOrFailed()

  - task: PublishTestResults@2
    displayName: Publish Tests Results
    inputs:
      testResultsFiles: "*-results.xml"
      searchFolder: "$(Build.ArtifactStagingDirectory)/test-results"
    condition: succeededOrFailed()
```

--------------------------------------------------------------------------------

---[FILE: build/builtin/browser-main.js]---
Location: vscode-main/build/builtin/browser-main.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//@ts-check

const fs = require('fs');
const path = require('path');
const os = require('os');
const { ipcRenderer } = require('electron');

const builtInExtensionsPath = path.join(__dirname, '..', '..', 'product.json');
const controlFilePath = path.join(os.homedir(), '.vscode-oss-dev', 'extensions', 'control.json');

/**
 * @param {string} filePath
 */
function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
}

/**
 * @param {string} filePath
 * @param {any} obj
 */
function writeJson(filePath, obj) {
	fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
}

/**
 * @param {HTMLFormElement} form
 * @param {string} id
 * @param {string} title
 * @param {string} value
 * @param {boolean} checked
 */
function renderOption(form, id, title, value, checked) {
	const input = document.createElement('input');
	input.type = 'radio';
	input.id = id;
	input.name = 'choice';
	input.value = value;
	input.checked = !!checked;
	form.appendChild(input);

	const label = document.createElement('label');
	label.setAttribute('for', id);
	label.textContent = title;
	form.appendChild(label);

	return input;
}

/**
 * @param {HTMLElement} el
 * @param {any} state
 */
function render(el, state) {
	/**
	 * @param {any} state
	 */
	function setState(state) {
		try {
			writeJson(controlFilePath, state.control);
		} catch (err) {
			console.error(err);
		}

		el.innerHTML = '';
		render(el, state);
	}

	const ul = document.createElement('ul');
	const { builtin, control } = state;

	for (const ext of builtin) {
		const controlState = control[ext.name] || 'marketplace';

		const li = document.createElement('li');
		ul.appendChild(li);

		const name = document.createElement('code');
		name.textContent = ext.name;
		li.appendChild(name);

		const form = document.createElement('form');
		li.appendChild(form);

		const marketplaceInput = renderOption(form, `marketplace-${ext.name}`, 'Marketplace', 'marketplace', controlState === 'marketplace');
		marketplaceInput.onchange = function () {
			control[ext.name] = 'marketplace';
			setState({ builtin, control });
		};

		const disabledInput = renderOption(form, `disabled-${ext.name}`, 'Disabled', 'disabled', controlState === 'disabled');
		disabledInput.onchange = function () {
			control[ext.name] = 'disabled';
			setState({ builtin, control });
		};

		let local = undefined;

		if (controlState !== 'marketplace' && controlState !== 'disabled') {
			local = controlState;
		}

		const localInput = renderOption(form, `local-${ext.name}`, 'Local', 'local', !!local);
		localInput.onchange = async function () {
			const result = await ipcRenderer.invoke('pickdir');

			if (result) {
				control[ext.name] = result;
				setState({ builtin, control });
			}
		};

		if (local) {
			const localSpan = document.createElement('code');
			localSpan.className = 'local';
			localSpan.textContent = local;
			form.appendChild(localSpan);
		}
	}

	el.appendChild(ul);
}

function main() {
	const el = document.getElementById('extensions');
	const builtin = readJson(builtInExtensionsPath).builtInExtensions;
	let control;

	try {
		control = readJson(controlFilePath);
	} catch (err) {
		control = {};
	}

	if (el) {
		render(el, { builtin, control });
	}
}

window.onload = main;
```

--------------------------------------------------------------------------------

---[FILE: build/builtin/index.html]---
Location: vscode-main/build/builtin/index.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->

<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8" />
	<title>Manage Built-in Extensions</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="browser-main.js"></script>
	<style>
		body {
			font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
			font-size: 10pt;
		}

		code {
			font-family: 'Menlo', 'Courier New', 'Courier', monospace;
		}

		ul {
			padding-left: 1em;
		}

		li {
			list-style: none;
			padding: 0.3em 0;
		}

		label {
			margin-right: 1em;
		}

		form {
			padding: 0.3em 0 0.3em 0.3em;
		}
	</style>
</head>

<body>
	<h1>Built-in Extensions</h1>
	<div id="extensions"></div>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: build/builtin/main.js]---
Location: vscode-main/build/builtin/main.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const url = require('url');
const path = require('path');

let window = null;

ipcMain.handle('pickdir', async () => {
	const result = await dialog.showOpenDialog(window, {
		title: 'Choose Folder',
		properties: ['openDirectory']
	});

	if (result.canceled || result.filePaths.length < 1) {
		return undefined;
	}

	return result.filePaths[0];
});

app.once('ready', () => {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableWebSQL: false
		}
	});
	window.setMenuBarVisibility(false);
	window.loadURL(url.format({ pathname: path.join(__dirname, 'index.html'), protocol: 'file:', slashes: true }));
	// window.webContents.openDevTools();
	window.once('closed', () => window = null);
});

app.on('window-all-closed', () => app.quit());
```

--------------------------------------------------------------------------------

---[FILE: build/builtin/package.json]---
Location: vscode-main/build/builtin/package.json

```json
{
	"name": "builtin",
	"version": "0.1.0",
	"main": "main.js"
}
```

--------------------------------------------------------------------------------

---[FILE: build/checker/layersChecker.ts]---
Location: vscode-main/build/checker/layersChecker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import ts from 'typescript';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import minimatch from 'minimatch';

//
// #############################################################################################
//
// A custom typescript checker for the specific task of detecting the use of certain types in a
// layer that does not allow such use.
//
// Make changes to below RULES to lift certain files from these checks only if absolutely needed
//
// NOTE: Most layer checks are done via tsconfig.<layer>.json files.
//
// #############################################################################################
//

// Types that are defined in a common layer but are known to be only
// available in native environments should not be allowed in browser
const NATIVE_TYPES = [
	'NativeParsedArgs',
	'INativeEnvironmentService',
	'AbstractNativeEnvironmentService',
	'INativeWindowConfiguration',
	'ICommonNativeHostService',
	'INativeHostService',
	'IMainProcessService',
	'INativeBrowserElementsService',
];

const RULES: IRule[] = [

	// Tests: skip
	{
		target: '**/vs/**/test/**',
		skip: true // -> skip all test files
	},

	// Common: vs/platform services that can access native types
	{
		target: `**/vs/platform/{${[
			'environment/common/*.ts',
			'window/common/window.ts',
			'native/common/native.ts',
			'native/common/nativeHostService.ts',
			'browserElements/common/browserElements.ts',
			'browserElements/common/nativeBrowserElementsService.ts'
		].join(',')}}`,
		disallowedTypes: [/* Ignore native types that are defined from here */],
	},

	// Common: vs/base/parts/sandbox/electron-browser/preload{,-aux}.ts
	{
		target: '**/vs/base/parts/sandbox/electron-browser/preload{,-aux}.ts',
		disallowedTypes: NATIVE_TYPES,
	},

	// Common
	{
		target: '**/vs/**/common/**',
		disallowedTypes: NATIVE_TYPES,
	},

	// Common
	{
		target: '**/vs/**/worker/**',
		disallowedTypes: NATIVE_TYPES,
	},

	// Browser
	{
		target: '**/vs/**/browser/**',
		disallowedTypes: NATIVE_TYPES,
	},

	// Electron (main, utility)
	{
		target: '**/vs/**/{electron-main,electron-utility}/**',
		disallowedTypes: [
			'ipcMain' // not allowed, use validatedIpcMain instead
		]
	}
];

const TS_CONFIG_PATH = join(import.meta.dirname, '../../', 'src', 'tsconfig.json');

interface IRule {
	target: string;
	skip?: boolean;
	disallowedTypes?: string[];
}

let hasErrors = false;

function checkFile(program: ts.Program, sourceFile: ts.SourceFile, rule: IRule) {
	checkNode(sourceFile);

	function checkNode(node: ts.Node): void {
		if (node.kind !== ts.SyntaxKind.Identifier) {
			return ts.forEachChild(node, checkNode); // recurse down
		}

		const checker = program.getTypeChecker();
		const symbol = checker.getSymbolAtLocation(node);

		if (!symbol) {
			return;
		}

		let text = symbol.getName();
		let _parentSymbol: any = symbol;

		while (_parentSymbol.parent) {
			_parentSymbol = _parentSymbol.parent;
		}

		const parentSymbol = _parentSymbol as ts.Symbol;
		text = parentSymbol.getName();

		if (rule.disallowedTypes?.some(disallowed => disallowed === text)) {
			const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
			console.log(`[build/checker/layersChecker.ts]: Reference to type '${text}' violates layer '${rule.target}' (${sourceFile.fileName} (${line + 1},${character + 1}). Learn more about our source code organization at https://github.com/microsoft/vscode/wiki/Source-Code-Organization.`);

			hasErrors = true;
			return;
		}
	}
}

function createProgram(tsconfigPath: string): ts.Program {
	const tsConfig = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

	const configHostParser: ts.ParseConfigHost = { fileExists: existsSync, readDirectory: ts.sys.readDirectory, readFile: file => readFileSync(file, 'utf8'), useCaseSensitiveFileNames: process.platform === 'linux' };
	const tsConfigParsed = ts.parseJsonConfigFileContent(tsConfig.config, configHostParser, resolve(dirname(tsconfigPath)), { noEmit: true });

	const compilerHost = ts.createCompilerHost(tsConfigParsed.options, true);

	return ts.createProgram(tsConfigParsed.fileNames, tsConfigParsed.options, compilerHost);
}

//
// Create program and start checking
//
const program = createProgram(TS_CONFIG_PATH);

for (const sourceFile of program.getSourceFiles()) {
	for (const rule of RULES) {
		if (minimatch.match([sourceFile.fileName], rule.target).length > 0) {
			if (!rule.skip) {
				checkFile(program, sourceFile, rule);
			}

			break;
		}
	}
}

if (hasErrors) {
	process.exit(1);
}
```

--------------------------------------------------------------------------------

---[FILE: build/checker/tsconfig.browser.json]---
Location: vscode-main/build/checker/tsconfig.browser.json

```json
{
	"extends": "../../src/tsconfig.base.json",
	"compilerOptions": {
		"lib": [
			"ES2024",
			"DOM",
			"DOM.Iterable"
		],
		"types": [],
		"noEmit": true,
		"skipLibCheck": true
	},
	"include": [
		"../../src/*.ts",
		"../../src/**/common/**/*.ts",
		"../../src/**/browser/**/*.ts",
		"../../src/typings/*.d.ts",
		"../../src/vs/monaco.d.ts",
		"../../src/vscode-dts/vscode.proposed.*.d.ts",
		"../../src/vscode-dts/vscode.d.ts",
		"../../node_modules/@webgpu/types/dist/index.d.ts",
		"../../node_modules/@types/trusted-types/index.d.ts",
		"../../node_modules/@types/wicg-file-system-access/index.d.ts"
	],
	"exclude": [
		"../../src/**/test/**",
		"../../src/**/fixtures/**"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: build/checker/tsconfig.electron-browser.json]---
Location: vscode-main/build/checker/tsconfig.electron-browser.json

```json
{
	"extends": "./tsconfig.browser.json",
	"include": [
		"../../src/**/common/**/*.ts",
		"../../src/**/browser/**/*.ts",
		"../../src/**/electron-browser/**/*.ts",
		"../../src/typings/*.d.ts",
		"../../src/vs/monaco.d.ts",
		"../../src/vscode-dts/vscode.proposed.*.d.ts",
		"../../src/vscode-dts/vscode.d.ts",
		"../../node_modules/@webgpu/types/dist/index.d.ts",
		"../../node_modules/@types/trusted-types/index.d.ts",
		"../../node_modules/@types/wicg-file-system-access/index.d.ts"
	],
	"exclude": [
		"../../src/**/test/**",
		"../../src/**/fixtures/**",
		"../../src/vs/base/parts/sandbox/electron-browser/preload.ts", 		// Preload scripts for Electron sandbox
		"../../src/vs/base/parts/sandbox/electron-browser/preload-aux.ts"	// have limited access to node.js APIs
	]
}
```

--------------------------------------------------------------------------------

---[FILE: build/checker/tsconfig.electron-main.json]---
Location: vscode-main/build/checker/tsconfig.electron-main.json

```json
{
	"extends": "./tsconfig.node.json",
	"include": [
		"../../src/**/common/**/*.ts",
		"../../src/**/node/**/*.ts",
		"../../src/**/electron-main/**/*.ts",
		"../../src/typings/*.d.ts",
		"../../src/vs/monaco.d.ts",
		"../../src/vscode-dts/vscode.proposed.*.d.ts",
		"../../src/vscode-dts/vscode.d.ts",
		"../../node_modules/@types/trusted-types/index.d.ts",
	],
	"exclude": [
		"../../src/**/test/**",
		"../../src/**/fixtures/**",
	]
}
```

--------------------------------------------------------------------------------

---[FILE: build/checker/tsconfig.electron-utility.json]---
Location: vscode-main/build/checker/tsconfig.electron-utility.json

```json
{
	"extends": "./tsconfig.node.json",
	"include": [
		"../../src/**/common/**/*.ts",
		"../../src/**/node/**/*.ts",
		"../../src/**/electron-utility/**/*.ts",
		"../../src/typings/*.d.ts",
		"../../src/vs/monaco.d.ts",
		"../../src/vscode-dts/vscode.proposed.*.d.ts",
		"../../src/vscode-dts/vscode.d.ts",
		"../../node_modules/@types/trusted-types/index.d.ts",
	],
	"exclude": [
		"../../src/**/test/**",
		"../../src/**/fixtures/**",
	]
}
```

--------------------------------------------------------------------------------

---[FILE: build/checker/tsconfig.node.json]---
Location: vscode-main/build/checker/tsconfig.node.json

```json
{
	"extends": "../../src/tsconfig.base.json",
	"compilerOptions": {
		"lib": [
			"ES2024"
		],
		"types": [
			"node"
		],
		"noEmit": true,
		"skipLibCheck": true
	},
	"include": [
		"../../src/*.ts",
		"../../src/**/common/**/*.ts",
		"../../src/**/node/**/*.ts",
		"../../src/typings/*.d.ts",
		"../../src/vs/monaco.d.ts",
		"../../src/vscode-dts/vscode.proposed.*.d.ts",
		"../../src/vscode-dts/vscode.d.ts",
		"../../node_modules/@types/trusted-types/index.d.ts",
	],
	"exclude": [
		"../../src/**/test/**",
		"../../src/**/fixtures/**"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: build/checker/tsconfig.worker.json]---
Location: vscode-main/build/checker/tsconfig.worker.json

```json
{
	"extends": "../../src/tsconfig.base.json",
	"compilerOptions": {
		"lib": [
			"ES2024",
			"WebWorker",
			"Webworker.Iterable",
			"WebWorker.AsyncIterable"
		],
		"types": [],
		"noEmit": true,
		"skipLibCheck": true
	},
	"include": [
		"../../src/**/common/**/*.ts",
		"../../src/**/worker/**/*.ts",
		"../../src/typings/*.d.ts",
		"../../src/vs/monaco.d.ts",
		"../../src/vscode-dts/vscode.proposed.*.d.ts",
		"../../src/vscode-dts/vscode.d.ts",
		"../../node_modules/@types/trusted-types/index.d.ts",
		"../../node_modules/@types/wicg-file-system-access/index.d.ts"
	],
	"exclude": [
		"../../src/**/test/**",
		"../../src/**/fixtures/**"
	]
}
```

--------------------------------------------------------------------------------

````
