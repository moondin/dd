---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 10
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 10 of 552)

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

---[FILE: build/package.json]---
Location: vscode-main/build/package.json

```json
{
  "name": "code-oss-dev-build",
  "version": "1.0.0",
  "license": "MIT",
  "devDependencies": {
    "@azure/core-auth": "^1.9.0",
    "@azure/cosmos": "^3",
    "@azure/identity": "^4.2.1",
    "@azure/msal-node": "^2.16.1",
    "@azure/storage-blob": "^12.25.0",
    "@electron/get": "^2.0.0",
    "@electron/osx-sign": "^2.0.0",
    "@types/ansi-colors": "^3.2.0",
    "@types/byline": "^4.2.32",
    "@types/debounce": "^1.0.0",
    "@types/debug": "^4.1.5",
    "@types/fancy-log": "^1.3.0",
    "@types/fs-extra": "^9.0.12",
    "@types/glob": "^7.1.1",
    "@types/gulp": "^4.0.17",
    "@types/gulp-filter": "^3.0.32",
    "@types/gulp-flatmap": "^1.0.0",
    "@types/gulp-gzip": "^0.0.31",
    "@types/gulp-json-editor": "^2.2.31",
    "@types/gulp-plumber": "^0.0.37",
    "@types/gulp-rename": "^0.0.33",
    "@types/gulp-replace": "^0.0.31",
    "@types/gulp-sort": "^2.0.4",
    "@types/gulp-sourcemaps": "^0.0.32",
    "@types/jws": "^3.2.10",
    "@types/lazy.js": "^0.5.9",
    "@types/mime": "0.0.29",
    "@types/minimatch": "^3.0.3",
    "@types/minimist": "^1.2.1",
    "@types/node": "^22.18.10",
    "@types/p-all": "^1.0.0",
    "@types/pump": "^1.0.1",
    "@types/rimraf": "^2.0.4",
    "@types/through": "^0.0.29",
    "@types/through2": "^2.0.36",
    "@types/vinyl": "^2.0.12",
    "@types/workerpool": "^6.4.0",
    "@types/xml2js": "0.0.33",
    "@vscode/iconv-lite-umd": "0.7.1",
    "@vscode/ripgrep": "^1.15.13",
    "@vscode/vsce": "3.6.1",
    "ansi-colors": "^3.2.3",
    "byline": "^5.0.0",
    "debug": "^4.3.2",
    "esbuild": "0.25.5",
    "extract-zip": "^2.0.1",
    "gulp-merge-json": "^2.1.1",
    "gulp-sort": "^2.0.0",
    "jsonc-parser": "^2.3.0",
    "jws": "^4.0.1",
    "mime": "^1.4.1",
    "source-map": "0.6.1",
    "ternary-stream": "^3.0.0",
    "through2": "^4.0.2",
    "tree-sitter": "^0.22.4",
    "vscode-universal-bundler": "^0.1.3",
    "workerpool": "^6.4.0",
    "yauzl": "^2.10.0"
  },
  "type": "module",
  "scripts": {
    "copy-policy-dto": "node lib/policies/copyPolicyDto.ts",
    "pretypecheck": "npm run copy-policy-dto",
    "typecheck": "cd .. && npx tsgo --project build/tsconfig.json",
    "watch": "npm run typecheck -- --watch",
    "test": "mocha --ui tdd 'lib/**/*.test.ts'"
  },
  "optionalDependencies": {
    "tree-sitter-typescript": "^0.23.2",
    "vscode-gulp-watch": "^5.0.3"
  },
  "overrides": {
    "path-scurry": {
      "lru-cache": "11.2.1"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: build/setup-npm-registry.ts]---
Location: vscode-main/build/setup-npm-registry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Recursively find all package-lock.json files in a directory
 */
async function* getPackageLockFiles(dir: string): AsyncGenerator<string> {
	const files = await fs.readdir(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = await fs.stat(fullPath);

		if (stat.isDirectory()) {
			yield* getPackageLockFiles(fullPath);
		} else if (file === 'package-lock.json') {
			yield fullPath;
		}
	}
}

/**
 * Replace the registry URL in a package-lock.json file
 */
async function setup(url: string, file: string): Promise<void> {
	let contents = await fs.readFile(file, 'utf8');
	contents = contents.replace(/https:\/\/registry\.[^.]+\.org\//g, url);
	await fs.writeFile(file, contents);
}

/**
 * Main function to set up custom NPM registry
 */
async function main(url: string, dir?: string): Promise<void> {
	const root = dir ?? process.cwd();

	for await (const file of getPackageLockFiles(root)) {
		console.log(`Enabling custom NPM registry: ${path.relative(root, file)}`);
		await setup(url, file);
	}
}

main(process.argv[2], process.argv[3]);
```

--------------------------------------------------------------------------------

---[FILE: build/stylelint.ts]---
Location: vscode-main/build/stylelint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import es from 'event-stream';
import vfs from 'vinyl-fs';
import { stylelintFilter } from './filters.ts';
import { getVariableNameValidator } from './lib/stylelint/validateVariableNames.ts';

interface FileWithLines {
	__lines?: string[];
	relative: string;
	contents: Buffer;
}

type Reporter = (message: string, isError: boolean) => void;

/**
 * Stylelint gulpfile task
 */
export default function gulpstylelint(reporter: Reporter): NodeJS.ReadWriteStream {
	const variableValidator = getVariableNameValidator();
	let errorCount = 0;
	const monacoWorkbenchPattern = /\.monaco-workbench/;
	const restrictedPathPattern = /^src[\/\\]vs[\/\\](base|platform|editor)[\/\\]/;
	const layerCheckerDisablePattern = /\/\*\s*stylelint-disable\s+layer-checker\s*\*\//;

	return es.through(function (this, file: FileWithLines) {
		const lines = file.__lines || file.contents.toString('utf8').split(/\r\n|\r|\n/);
		file.__lines = lines;

		const isRestrictedPath = restrictedPathPattern.test(file.relative);

		// Check if layer-checker is disabled for the entire file
		const isLayerCheckerDisabled = lines.some(line => layerCheckerDisablePattern.test(line));

		lines.forEach((line, i) => {
			variableValidator(line, (unknownVariable: string) => {
				reporter(file.relative + '(' + (i + 1) + ',1): Unknown variable: ' + unknownVariable, true);
				errorCount++;
			});

			if (isRestrictedPath && !isLayerCheckerDisabled && monacoWorkbenchPattern.test(line)) {
				reporter(file.relative + '(' + (i + 1) + ',1): The class .monaco-workbench cannot be used in files under src/vs/{base,platform,editor} because only src/vs/workbench applies it', true);
				errorCount++;
			}
		});

		this.emit('data', file);
	}, function () {
		if (errorCount > 0) {
			reporter('All valid variable names are in `build/lib/stylelint/vscode-known-variables.json`\nTo update that file, run `./scripts/test-documentation.sh|bat.`', false);
		}
		this.emit('end');
	});
}

function stylelint(): NodeJS.ReadWriteStream {
	return vfs
		.src(Array.from(stylelintFilter), { base: '.', follow: true, allowEmpty: true })
		.pipe(gulpstylelint((message, isError) => {
			if (isError) {
				console.error(message);
			} else {
				console.info(message);
			}
		}))
		.pipe(es.through(function () { /* noop, important for the stream to end */ }));
}

if (import.meta.main) {
	stylelint().on('error', (err: Error) => {
		console.error();
		console.error(err);
		process.exit(1);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: build/tsconfig.json]---
Location: vscode-main/build/tsconfig.json

```json
{
	"compilerOptions": {
		"target": "es2024",
		"lib": [
			"ES2024"
		],
		"module": "nodenext",
		"noEmit": true,
		"erasableSyntaxOnly": true,
		"verbatimModuleSyntax": true,
		"allowImportingTsExtensions": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"strict": true,
		"exactOptionalPropertyTypes": false,
		"useUnknownInCatchVariables": false,
		"noUnusedLocals": true,
		"noUnusedParameters": true
	},
	"exclude": [
		"node_modules/**",
		"monaco-editor-playground/**",
		"builtin/**",
		"vite/**"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/distro-build.yml]---
Location: vscode-main/build/azure-pipelines/distro-build.yml

```yaml
pool:
  name: 1es-ubuntu-22.04-x64
  os: linux

trigger:
  branches:
    include: ["main", "release/*"]
pr: none

steps:
  - task: NodeTool@0
    inputs:
      versionSource: fromFile
      versionFilePath: .nvmrc
  - template: ./distro/download-distro.yml@self
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/product-build-macos.yml]---
Location: vscode-main/build/azure-pipelines/product-build-macos.yml

```yaml
pr: none

trigger: none

parameters:
  - name: VSCODE_QUALITY
    displayName: Quality
    type: string
    default: insider
  - name: NPM_REGISTRY
    displayName: "Custom NPM Registry"
    type: string
    default: 'https://pkgs.dev.azure.com/monacotools/Monaco/_packaging/vscode/npm/registry/'
  - name: CARGO_REGISTRY
    displayName: "Custom Cargo Registry"
    type: string
    default: 'sparse+https://pkgs.dev.azure.com/monacotools/Monaco/_packaging/vscode/Cargo/index/'

variables:
  - name: NPM_REGISTRY
    ${{ if in(variables['Build.Reason'], 'IndividualCI', 'BatchedCI') }}: # disable terrapin when in VSCODE_CIBUILD
      value: none
    ${{ else }}:
      value: ${{ parameters.NPM_REGISTRY }}
  - name: CARGO_REGISTRY
    value: ${{ parameters.CARGO_REGISTRY }}
  - name: VSCODE_QUALITY
    value: ${{ parameters.VSCODE_QUALITY }}
  - name: VSCODE_CIBUILD
    value: ${{ in(variables['Build.Reason'], 'IndividualCI', 'BatchedCI') }}
  - name: VSCODE_STEP_ON_IT
    value: false
  - name: skipComponentGovernanceDetection
    value: true
  - name: ComponentDetection.Timeout
    value: 600
  - name: Codeql.SkipTaskAutoInjection
    value: true
  - name: ARTIFACT_PREFIX
    value: ''

name: "$(Date:yyyyMMdd).$(Rev:r) (${{ parameters.VSCODE_QUALITY }})"

resources:
  repositories:
    - repository: 1ESPipelines
      type: git
      name: 1ESPipelineTemplates/1ESPipelineTemplates
      ref: refs/tags/release

extends:
  template: v1/1ES.Official.PipelineTemplate.yml@1esPipelines
  parameters:
    sdl:
      tsa:
        enabled: true
        configFile: $(Build.SourcesDirectory)/build/azure-pipelines/config/tsaoptions.json
      codeql:
        runSourceLanguagesInSourceAnalysis: true
        compiled:
          enabled: false
          justificationForDisabling: "CodeQL breaks ESRP CodeSign on macOS (ICM #520035761, githubcustomers/microsoft-codeql-support#198)"
      credscan:
        suppressionsFile: $(Build.SourcesDirectory)/build/azure-pipelines/config/CredScanSuppressions.json
      eslint:
        enabled: true
        enableExclusions: true
        exclusionsFilePath: $(Build.SourcesDirectory)/.eslint-ignore
      sourceAnalysisPool: 1es-windows-2022-x64
      createAdoIssuesForJustificationsForDisablement: false
    containers:
      ubuntu-2004-arm64:
        image: onebranch.azurecr.io/linux/ubuntu-2004-arm64:latest
    stages:
      - stage: Compile
        pool:
          name: AcesShared
          os: macOS
          demands:
            - ImageOverride -equals ACES_VM_SharedPool_Sequoia
        jobs:
          - template: build/azure-pipelines/product-compile.yml@self

      - stage: macOS
        dependsOn:
          - Compile
        pool:
          name: AcesShared
          os: macOS
          demands:
            - ImageOverride -equals ACES_VM_SharedPool_Sequoia
        variables:
          BUILDSECMON_OPT_IN: true
        jobs:
          - template: build/azure-pipelines/darwin/product-build-darwin-ci.yml@self
            parameters:
              VSCODE_CIBUILD: true
              VSCODE_TEST_SUITE: Electron
          - template: build/azure-pipelines/darwin/product-build-darwin-ci.yml@self
            parameters:
              VSCODE_CIBUILD: true
              VSCODE_TEST_SUITE: Browser
          - template: build/azure-pipelines/darwin/product-build-darwin-ci.yml@self
            parameters:
              VSCODE_CIBUILD: true
              VSCODE_TEST_SUITE: Remote
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/product-build.yml]---
Location: vscode-main/build/azure-pipelines/product-build.yml

```yaml
pr: none

schedules:
  - cron: "0 5 * * Mon-Fri"
    displayName: Mon-Fri at 7:00
    branches:
      include:
        - main

trigger:
  batch: true
  branches:
    include: ["main", "release/*"]

parameters:
  - name: VSCODE_QUALITY
    displayName: Quality
    type: string
    default: insider
    values:
      - exploration
      - insider
      - stable
  - name: NPM_REGISTRY
    displayName: "Custom NPM Registry"
    type: string
    default: 'https://pkgs.dev.azure.com/monacotools/Monaco/_packaging/vscode/npm/registry/'
  - name: CARGO_REGISTRY
    displayName: "Custom Cargo Registry"
    type: string
    default: 'sparse+https://pkgs.dev.azure.com/monacotools/Monaco/_packaging/vscode/Cargo/index/'
  - name: VSCODE_BUILD_WIN32
    displayName: "🎯 Windows x64"
    type: boolean
    default: true
  - name: VSCODE_BUILD_WIN32_ARM64
    displayName: "🎯 Windows arm64"
    type: boolean
    default: true
  - name: VSCODE_BUILD_LINUX
    displayName: "🎯 Linux x64"
    type: boolean
    default: true
  - name: VSCODE_BUILD_LINUX_SNAP
    displayName: "🎯 Linux x64 Snap"
    type: boolean
    default: true
  - name: VSCODE_BUILD_LINUX_ARM64
    displayName: "🎯 Linux arm64"
    type: boolean
    default: true
  - name: VSCODE_BUILD_LINUX_ARMHF
    displayName: "🎯 Linux armhf"
    type: boolean
    default: true
  - name: VSCODE_BUILD_ALPINE
    displayName: "🎯 Alpine x64"
    type: boolean
    default: true
  - name: VSCODE_BUILD_ALPINE_ARM64
    displayName: "🎯 Alpine arm64"
    type: boolean
    default: true
  - name: VSCODE_BUILD_MACOS
    displayName: "🎯 macOS x64"
    type: boolean
    default: true
  - name: VSCODE_BUILD_MACOS_ARM64
    displayName: "🎯 macOS arm64"
    type: boolean
    default: true
  - name: VSCODE_BUILD_MACOS_UNIVERSAL
    displayName: "🎯 macOS universal"
    type: boolean
    default: true
  - name: VSCODE_BUILD_WEB
    displayName: "🎯 Web"
    type: boolean
    default: true
  - name: VSCODE_PUBLISH
    displayName: "Publish to builds.code.visualstudio.com"
    type: boolean
    default: true
  - name: VSCODE_RELEASE
    displayName: "Release build if successful"
    type: boolean
    default: false
  - name: VSCODE_COMPILE_ONLY
    displayName: "Run Compile stage exclusively"
    type: boolean
    default: false
  - name: VSCODE_STEP_ON_IT
    displayName: "Skip tests"
    type: boolean
    default: false

variables:
  - name: VSCODE_PRIVATE_BUILD
    value: ${{ ne(variables['Build.Repository.Uri'], 'https://github.com/microsoft/vscode.git') }}
  - name: NPM_REGISTRY
    value: ${{ parameters.NPM_REGISTRY }}
  - name: CARGO_REGISTRY
    value: ${{ parameters.CARGO_REGISTRY }}
  - name: VSCODE_QUALITY
    value: ${{ parameters.VSCODE_QUALITY }}
  - name: VSCODE_BUILD_STAGE_WINDOWS
    value: ${{ or(eq(parameters.VSCODE_BUILD_WIN32, true), eq(parameters.VSCODE_BUILD_WIN32_ARM64, true)) }}
  - name: VSCODE_BUILD_STAGE_LINUX
    value: ${{ or(eq(parameters.VSCODE_BUILD_LINUX, true), eq(parameters.VSCODE_BUILD_LINUX_SNAP, true), eq(parameters.VSCODE_BUILD_LINUX_ARMHF, true), eq(parameters.VSCODE_BUILD_LINUX_ARM64, true)) }}
  - name: VSCODE_BUILD_STAGE_ALPINE
    value: ${{ or(eq(parameters.VSCODE_BUILD_ALPINE, true), eq(parameters.VSCODE_BUILD_ALPINE_ARM64, true)) }}
  - name: VSCODE_BUILD_STAGE_MACOS
    value: ${{ or(eq(parameters.VSCODE_BUILD_MACOS, true), eq(parameters.VSCODE_BUILD_MACOS_ARM64, true)) }}
  - name: VSCODE_BUILD_STAGE_WEB
    value: ${{ eq(parameters.VSCODE_BUILD_WEB, true) }}
  - name: VSCODE_CIBUILD
    value: ${{ in(variables['Build.Reason'], 'IndividualCI', 'BatchedCI') }}
  - name: VSCODE_PUBLISH
    value: ${{ and(eq(parameters.VSCODE_PUBLISH, true), eq(variables.VSCODE_CIBUILD, false), eq(parameters.VSCODE_COMPILE_ONLY, false)) }}
  - name: VSCODE_SCHEDULEDBUILD
    value: ${{ eq(variables['Build.Reason'], 'Schedule') }}
  - name: VSCODE_STEP_ON_IT
    value: ${{ eq(parameters.VSCODE_STEP_ON_IT, true) }}
  - name: VSCODE_BUILD_MACOS_UNIVERSAL
    value: ${{ and(eq(parameters.VSCODE_BUILD_MACOS, true), eq(parameters.VSCODE_BUILD_MACOS_ARM64, true), eq(parameters.VSCODE_BUILD_MACOS_UNIVERSAL, true)) }}
  - name: VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME
    value: vscodeesrp
  - name: PRSS_CDN_URL
    value: https://vscode.download.prss.microsoft.com/dbazure/download
  - name: VSCODE_ESRP_SERVICE_CONNECTION_ID
    value: fe07e6ce-6ffb-4df9-8d27-d129523a3f3e
  - name: VSCODE_ESRP_TENANT_ID
    value: 975f013f-7f24-47e8-a7d3-abc4752bf346
  - name: VSCODE_ESRP_CLIENT_ID
    value: 4ac7ed59-b5e9-4f66-9c30-8d1afa72d32d
  - name: ESRP_TENANT_ID
    value: 975f013f-7f24-47e8-a7d3-abc4752bf346
  - name: ESRP_CLIENT_ID
    value: c24324f7-e65f-4c45-8702-ed2d4c35df99
  - name: AZURE_DOCUMENTDB_ENDPOINT
    value: https://vscode.documents.azure.com/
  - name: VSCODE_MIXIN_REPO
    value: microsoft/vscode-distro
  - name: skipComponentGovernanceDetection
    value: true
  - name: ComponentDetection.Timeout
    value: 600
  - name: Codeql.SkipTaskAutoInjection
    value: true
  - name: ARTIFACT_PREFIX
    value: ''

name: "$(Date:yyyyMMdd).$(Rev:r) (${{ parameters.VSCODE_QUALITY }})"

resources:
  pipelines:
    - pipeline: vscode-7pm-kick-off
      source: 'VS Code 7PM Kick-Off'
      trigger: true
  repositories:
    - repository: 1ESPipelines
      type: git
      name: 1ESPipelineTemplates/1ESPipelineTemplates
      ref: refs/tags/release

extends:
  template: v1/1ES.Official.PipelineTemplate.yml@1esPipelines
  parameters:
    sdl:
      tsa:
        enabled: true
        configFile: $(Build.SourcesDirectory)/build/azure-pipelines/config/tsaoptions.json
      binskim:
        analyzeTargetGlob: '+:file|$(Agent.BuildDirectory)/VSCode-*/**/*.exe;+:file|$(Agent.BuildDirectory)/VSCode-*/**/*.node;+:file|$(Agent.BuildDirectory)/VSCode-*/**/*.dll;-:file|$(Build.SourcesDirectory)/.build/**/system-setup/VSCodeSetup*.exe;-:file|$(Build.SourcesDirectory)/.build/**/user-setup/VSCodeUserSetup*.exe'
      codeql:
        runSourceLanguagesInSourceAnalysis: true
        compiled:
          enabled: false
          justificationForDisabling: "CodeQL breaks ESRP CodeSign on macOS (ICM #520035761, githubcustomers/microsoft-codeql-support#198)"
      credscan:
        suppressionsFile: $(Build.SourcesDirectory)/build/azure-pipelines/config/CredScanSuppressions.json
      eslint:
        enabled: true
        enableExclusions: true
        exclusionsFilePath: $(Build.SourcesDirectory)/.eslint-ignore
      sourceAnalysisPool: 1es-windows-2022-x64
      createAdoIssuesForJustificationsForDisablement: false
    containers:
      ubuntu-2004-arm64:
        image: onebranch.azurecr.io/linux/ubuntu-2004-arm64:latest
    stages:
      - stage: Compile
        pool:
          name: AcesShared
          os: macOS
        jobs:
          - template: build/azure-pipelines/product-compile.yml@self

      - ${{ if or(eq(parameters.VSCODE_BUILD_LINUX, true),eq(parameters.VSCODE_BUILD_LINUX_ARMHF, true),eq(parameters.VSCODE_BUILD_LINUX_ARM64, true),eq(parameters.VSCODE_BUILD_ALPINE, true),eq(parameters.VSCODE_BUILD_ALPINE_ARM64, true),eq(parameters.VSCODE_BUILD_MACOS, true),eq(parameters.VSCODE_BUILD_MACOS_ARM64, true),eq(parameters.VSCODE_BUILD_WIN32, true),eq(parameters.VSCODE_BUILD_WIN32_ARM64, true)) }}:
        - stage: CompileCLI
          dependsOn: []
          jobs:
            - ${{ if eq(parameters.VSCODE_BUILD_WIN32, true) }}:
              - template: build/azure-pipelines/win32/product-build-win32-cli.yml@self
                parameters:
                  VSCODE_ARCH: x64
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_CHECK_ONLY: ${{ variables.VSCODE_CIBUILD }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_WIN32_ARM64, true)) }}:
              - template: build/azure-pipelines/win32/product-build-win32-cli.yml@self
                parameters:
                  VSCODE_ARCH: arm64
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

            - ${{ if eq(parameters.VSCODE_BUILD_LINUX, true) }}:
              - template: build/azure-pipelines/linux/product-build-linux-cli.yml@self
                parameters:
                  VSCODE_ARCH: x64
                  VSCODE_CHECK_ONLY: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_LINUX_ARM64, true)) }}:
              - template: build/azure-pipelines/linux/product-build-linux-cli.yml@self
                parameters:
                  VSCODE_ARCH: arm64
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_LINUX_ARMHF, true)) }}:
              - template: build/azure-pipelines/linux/product-build-linux-cli.yml@self
                parameters:
                  VSCODE_ARCH: armhf
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_ALPINE, true)) }}:
              - template: build/azure-pipelines/alpine/product-build-alpine-cli.yml@self
                parameters:
                  VSCODE_ARCH: x64
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_ALPINE_ARM64, true)) }}:
              - template: build/azure-pipelines/alpine/product-build-alpine-cli.yml@self
                parameters:
                  VSCODE_ARCH: arm64
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

            - ${{ if eq(parameters.VSCODE_BUILD_MACOS, true) }}:
              - template: build/azure-pipelines/darwin/product-build-darwin-cli.yml@self
                parameters:
                  VSCODE_ARCH: x64
                  VSCODE_CHECK_ONLY: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_MACOS_ARM64, true)) }}:
              - template: build/azure-pipelines/darwin/product-build-darwin-cli.yml@self
                parameters:
                  VSCODE_ARCH: arm64
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

      - ${{ if and(eq(variables['VSCODE_CIBUILD'], true), eq(parameters.VSCODE_COMPILE_ONLY, false)) }}:
        - stage: node_modules
          dependsOn: []
          jobs:
            - template: build/azure-pipelines/win32/product-build-win32-node-modules.yml@self
              parameters:
                VSCODE_ARCH: arm64
            - template: build/azure-pipelines/linux/product-build-linux-node-modules.yml@self
              parameters:
                NPM_ARCH: arm64
                VSCODE_ARCH: arm64
            - template: build/azure-pipelines/linux/product-build-linux-node-modules.yml@self
              parameters:
                NPM_ARCH: arm
                VSCODE_ARCH: armhf
            - template: build/azure-pipelines/alpine/product-build-alpine-node-modules.yml@self
              parameters:
                VSCODE_ARCH: x64
            - template: build/azure-pipelines/alpine/product-build-alpine-node-modules.yml@self
              parameters:
                VSCODE_ARCH: arm64
            - template: build/azure-pipelines/darwin/product-build-darwin-node-modules.yml@self
              parameters:
                VSCODE_ARCH: x64
            - template: build/azure-pipelines/web/product-build-web-node-modules.yml@self

      - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_COMPILE_ONLY, false)) }}:
        - stage: APIScan
          dependsOn: []
          pool:
            name: 1es-windows-2022-x64
            os: windows
          jobs:
            - job: WindowsAPIScan
              steps:
                - template: build/azure-pipelines/win32/sdl-scan-win32.yml@self
                  parameters:
                    VSCODE_ARCH: x64
                    VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

      - ${{ if and(eq(parameters.VSCODE_COMPILE_ONLY, false), eq(variables['VSCODE_BUILD_STAGE_WINDOWS'], true)) }}:
        - stage: Windows
          dependsOn:
            - Compile
            - ${{ if or(eq(parameters.VSCODE_BUILD_LINUX, true),eq(parameters.VSCODE_BUILD_LINUX_ARMHF, true),eq(parameters.VSCODE_BUILD_LINUX_ARM64, true),eq(parameters.VSCODE_BUILD_ALPINE, true),eq(parameters.VSCODE_BUILD_ALPINE_ARM64, true),eq(parameters.VSCODE_BUILD_MACOS, true),eq(parameters.VSCODE_BUILD_MACOS_ARM64, true),eq(parameters.VSCODE_BUILD_WIN32, true),eq(parameters.VSCODE_BUILD_WIN32_ARM64, true)) }}:
              - CompileCLI
          pool:
            name: 1es-windows-2022-x64
            os: windows
          jobs:
            - ${{ if eq(variables['VSCODE_CIBUILD'], true) }}:
              - template: build/azure-pipelines/win32/product-build-win32-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_TEST_SUITE: Electron
              - template: build/azure-pipelines/win32/product-build-win32-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_TEST_SUITE: Browser
              - template: build/azure-pipelines/win32/product-build-win32-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_TEST_SUITE: Remote

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_WIN32, true)) }}:
              - template: build/azure-pipelines/win32/product-build-win32.yml@self
                parameters:
                  VSCODE_ARCH: x64
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_RUN_ELECTRON_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}
                  VSCODE_RUN_BROWSER_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}
                  VSCODE_RUN_REMOTE_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_WIN32_ARM64, true)) }}:
              - template: build/azure-pipelines/win32/product-build-win32.yml@self
                parameters:
                  VSCODE_ARCH: arm64
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), or(eq(parameters.VSCODE_BUILD_WIN32, true), eq(parameters.VSCODE_BUILD_WIN32_ARM64, true))) }}:
              - template: build/azure-pipelines/win32/product-build-win32-cli-sign.yml@self
                parameters:
                  VSCODE_BUILD_WIN32: ${{ parameters.VSCODE_BUILD_WIN32 }}
                  VSCODE_BUILD_WIN32_ARM64: ${{ parameters.VSCODE_BUILD_WIN32_ARM64 }}

      - ${{ if and(eq(parameters.VSCODE_COMPILE_ONLY, false), eq(variables['VSCODE_BUILD_STAGE_LINUX'], true)) }}:
        - stage: Linux
          dependsOn:
            - Compile
            - ${{ if or(eq(parameters.VSCODE_BUILD_LINUX, true),eq(parameters.VSCODE_BUILD_LINUX_ARMHF, true),eq(parameters.VSCODE_BUILD_LINUX_ARM64, true),eq(parameters.VSCODE_BUILD_ALPINE, true),eq(parameters.VSCODE_BUILD_ALPINE_ARM64, true),eq(parameters.VSCODE_BUILD_MACOS, true),eq(parameters.VSCODE_BUILD_MACOS_ARM64, true),eq(parameters.VSCODE_BUILD_WIN32, true),eq(parameters.VSCODE_BUILD_WIN32_ARM64, true)) }}:
              - CompileCLI
          pool:
            name: 1es-ubuntu-22.04-x64
            os: linux
          jobs:
            - ${{ if eq(variables['VSCODE_CIBUILD'], true) }}:
              - template: build/azure-pipelines/linux/product-build-linux-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_TEST_SUITE: Electron
              - template: build/azure-pipelines/linux/product-build-linux-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_TEST_SUITE: Browser
              - template: build/azure-pipelines/linux/product-build-linux-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_TEST_SUITE: Remote

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), or(eq(parameters.VSCODE_BUILD_LINUX, true), eq(parameters.VSCODE_BUILD_LINUX_SNAP, true))) }}:
              - template: build/azure-pipelines/linux/product-build-linux.yml@self
                parameters:
                  NPM_ARCH: x64
                  VSCODE_ARCH: x64
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_RUN_ELECTRON_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}
                  VSCODE_RUN_BROWSER_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}
                  VSCODE_RUN_REMOTE_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}
                  VSCODE_BUILD_LINUX_SNAP: ${{ parameters.VSCODE_BUILD_LINUX_SNAP }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_LINUX_ARMHF, true)) }}:
              - template: build/azure-pipelines/linux/product-build-linux.yml@self
                parameters:
                  NPM_ARCH: arm
                  VSCODE_ARCH: armhf
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_LINUX_ARM64, true)) }}:
              - template: build/azure-pipelines/linux/product-build-linux.yml@self
                parameters:
                  NPM_ARCH: arm64
                  VSCODE_ARCH: arm64
                  VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}

      - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_COMPILE_ONLY, false), eq(variables['VSCODE_BUILD_STAGE_ALPINE'], true)) }}:
        - stage: Alpine
          dependsOn:
            - Compile
            - ${{ if or(eq(parameters.VSCODE_BUILD_LINUX, true),eq(parameters.VSCODE_BUILD_LINUX_ARMHF, true),eq(parameters.VSCODE_BUILD_LINUX_ARM64, true),eq(parameters.VSCODE_BUILD_ALPINE, true),eq(parameters.VSCODE_BUILD_ALPINE_ARM64, true),eq(parameters.VSCODE_BUILD_MACOS, true),eq(parameters.VSCODE_BUILD_MACOS_ARM64, true),eq(parameters.VSCODE_BUILD_WIN32, true),eq(parameters.VSCODE_BUILD_WIN32_ARM64, true)) }}:
              - CompileCLI
          jobs:
            - ${{ if eq(parameters.VSCODE_BUILD_ALPINE, true) }}:
              - template: build/azure-pipelines/alpine/product-build-alpine.yml@self
                parameters:
                  VSCODE_ARCH: x64
            - ${{ if eq(parameters.VSCODE_BUILD_ALPINE_ARM64, true) }}:
              - template: build/azure-pipelines/alpine/product-build-alpine.yml@self
                parameters:
                  VSCODE_ARCH: arm64

      - ${{ if and(eq(parameters.VSCODE_COMPILE_ONLY, false), eq(variables['VSCODE_BUILD_STAGE_MACOS'], true)) }}:
        - stage: macOS
          dependsOn:
            - Compile
            - ${{ if or(eq(parameters.VSCODE_BUILD_LINUX, true),eq(parameters.VSCODE_BUILD_LINUX_ARMHF, true),eq(parameters.VSCODE_BUILD_LINUX_ARM64, true),eq(parameters.VSCODE_BUILD_ALPINE, true),eq(parameters.VSCODE_BUILD_ALPINE_ARM64, true),eq(parameters.VSCODE_BUILD_MACOS, true),eq(parameters.VSCODE_BUILD_MACOS_ARM64, true),eq(parameters.VSCODE_BUILD_WIN32, true),eq(parameters.VSCODE_BUILD_WIN32_ARM64, true)) }}:
              - CompileCLI
          pool:
            name: AcesShared
            os: macOS
          variables:
            BUILDSECMON_OPT_IN: true
          jobs:
            - ${{ if eq(variables['VSCODE_CIBUILD'], true) }}:
              - template: build/azure-pipelines/darwin/product-build-darwin-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_TEST_SUITE: Electron
              - template: build/azure-pipelines/darwin/product-build-darwin-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_TEST_SUITE: Browser
              - template: build/azure-pipelines/darwin/product-build-darwin-ci.yml@self
                parameters:
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_TEST_SUITE: Remote

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_MACOS, true)) }}:
              - template: build/azure-pipelines/darwin/product-build-darwin.yml@self
                parameters:
                  VSCODE_ARCH: x64
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_BUILD_MACOS_ARM64, true)) }}:
              - template: build/azure-pipelines/darwin/product-build-darwin.yml@self
                parameters:
                  VSCODE_ARCH: arm64
                  VSCODE_CIBUILD: ${{ variables.VSCODE_CIBUILD }}
                  VSCODE_RUN_ELECTRON_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}
                  VSCODE_RUN_BROWSER_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}
                  VSCODE_RUN_REMOTE_TESTS: ${{ eq(parameters.VSCODE_STEP_ON_IT, false) }}

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(variables['VSCODE_BUILD_MACOS_UNIVERSAL'], true)) }}:
              - template: build/azure-pipelines/darwin/product-build-darwin-universal.yml@self

            - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), or(eq(parameters.VSCODE_BUILD_MACOS, true), eq(parameters.VSCODE_BUILD_MACOS_ARM64, true))) }}:
              - template: build/azure-pipelines/darwin/product-build-darwin-cli-sign.yml@self
                parameters:
                  VSCODE_BUILD_MACOS: ${{ parameters.VSCODE_BUILD_MACOS }}
                  VSCODE_BUILD_MACOS_ARM64: ${{ parameters.VSCODE_BUILD_MACOS_ARM64 }}

      - ${{ if and(eq(variables['VSCODE_CIBUILD'], false), eq(parameters.VSCODE_COMPILE_ONLY, false), eq(variables['VSCODE_BUILD_STAGE_WEB'], true)) }}:
        - stage: Web
          dependsOn:
            - Compile
          jobs:
            - template: build/azure-pipelines/web/product-build-web.yml@self

      - ${{ if eq(variables['VSCODE_PUBLISH'], 'true') }}:
        - stage: Publish
          dependsOn: []
          jobs:
            - template: build/azure-pipelines/product-publish.yml@self
              parameters:
                VSCODE_QUALITY: ${{ variables.VSCODE_QUALITY }}
                VSCODE_SCHEDULEDBUILD: ${{ variables.VSCODE_SCHEDULEDBUILD }}

        - ${{ if and(parameters.VSCODE_RELEASE, eq(variables['VSCODE_PRIVATE_BUILD'], false)) }}:
          - stage: ApproveRelease
            dependsOn: [] # run in parallel to compile stage
            pool:
              name: 1es-ubuntu-22.04-x64
              os: linux
            jobs:
              - job: ApproveRelease
                displayName: "Approve Release"
                variables:
                  - group: VSCodePeerApproval
                  - name: skipComponentGovernanceDetection
                    value: true

          - stage: Release
            dependsOn:
              - Publish
              - ApproveRelease
            pool:
              name: 1es-ubuntu-22.04-x64
              os: linux
            jobs:
              - job: ReleaseBuild
                displayName: Release Build
                steps:
                  - template: build/azure-pipelines/product-release.yml@self
                    parameters:
                      VSCODE_RELEASE: ${{ parameters.VSCODE_RELEASE }}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/product-compile.yml]---
Location: vscode-main/build/azure-pipelines/product-compile.yml

```yaml
jobs:
  - job: Compile
    timeoutInMinutes: 60
    templateContext:
      outputs:
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/compilation.tar.gz
          artifactName: Compilation
          displayName: Publish compilation artifact
          isProduction: false
          sbomEnabled: false
    steps:
      - template: ./common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - template: ./distro/download-distro.yml@self

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password"

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts compile $(node -p process.arch) > .build/packagelockhash
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

      - template: common/install-builtin-extensions.yml@self

      - script: npm exec -- npm-run-all -lp core-ci extensions-ci hygiene eslint valid-layers-check define-class-fields-check vscode-dts-compile-check tsec-compile-check test-build-scripts
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Compile & Hygiene

      - script: |
          set -e
          npm run compile
        displayName: Compile smoke test suites (non-OSS)
        workingDirectory: test/smoke
        condition: and(succeeded(), eq(variables['VSCODE_STEP_ON_IT'], 'false'))

      - script: |
          set -e
          npm run compile
        displayName: Compile integration test suites (non-OSS)
        workingDirectory: test/integration/browser
        condition: and(succeeded(), eq(variables['VSCODE_STEP_ON_IT'], 'false'))

      - task: AzureCLI@2
        displayName: Fetch secrets
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
            node build/azure-pipelines/upload-sourcemaps.ts
        displayName: Upload sourcemaps to Azure

      - script: ./build/azure-pipelines/common/extract-telemetry.sh
        displayName: Generate lists of telemetry events

      - script: tar -cz --exclude='.build/node_modules_cache' --exclude='.build/node_modules_list.txt' --exclude='.build/distro' -f $(Build.ArtifactStagingDirectory)/compilation.tar.gz $(ls -d .build out-* test/integration/browser/out test/smoke/out test/automation/out 2>/dev/null)
        displayName: Compress compilation artifact

      - script: npm run download-builtin-extensions-cg
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Download component details of built-in extensions

      - task: ms.vss-governance-buildtask.governance-build-task-component-detection.ComponentGovernanceComponentDetection@0
        displayName: "Component Detection"
        inputs:
          sourceScanPath: $(Build.SourcesDirectory)
          alertWarningLevel: Medium
        continueOnError: true
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/product-npm-package-validate.yml]---
Location: vscode-main/build/azure-pipelines/product-npm-package-validate.yml

```yaml
trigger: none

pr:
  branches:
    include: ["main"]

variables:
  - name: NPM_REGISTRY
    value: "https://pkgs.dev.azure.com/monacotools/Monaco/_packaging/vscode/npm/registry/"
  - name: VSCODE_QUALITY
    value: oss

jobs:
  - job: ValidateNpmPackages
    displayName: Valiate NPM packages against Terrapin
    pool:
      name: 1es-ubuntu-22.04-x64
      os: linux
    timeoutInMinutes: 40000
    continueOnError: true
    variables:
      VSCODE_ARCH: x64
    steps:
      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - script: |
          set -e
          echo "Checking if package.json or package-lock.json files were modified..."

          # Get the list of changed files in the PR
          git fetch origin main
          CHANGED_FILES=$(git diff --name-only origin/main...HEAD)
          echo "Changed files:"
          echo "$CHANGED_FILES"

          # Check if package.json or package-lock.json are in the changed files
          if echo "$CHANGED_FILES" | grep -E '^(package\.json|package-lock\.json)$'; then
            echo "##vso[task.setvariable variable=SHOULD_VALIDATE]true"
            echo "Package files were modified, proceeding with validation"
          else
            echo "##vso[task.setvariable variable=SHOULD_VALIDATE]false"
            echo "No package files were modified, skipping validation"
            echo "##vso[task.complete result=Succeeded;]Pipeline completed successfully - no package validation needed"
          fi
        displayName: Check if package files were modified

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'), eq(variables['SHOULD_VALIDATE'], 'true'))
        displayName: Setup NPM Registry

      - script: |
          set -e
          # Set the private NPM registry to the global npmrc file
          # so that authentication works for subfolders like build/, remote/, extensions/ etc
          # which does not have their own .npmrc file
          echo "NPMRC Path: $(npm config get userconfig)"
          echo "NPM Registry: $(npm config get registry)"
          npm config set registry "$NPM_REGISTRY"
          echo "##vso[task.setvariable variable=NPMRC_PATH]$(npm config get userconfig)"
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'), eq(variables['SHOULD_VALIDATE'], 'true'))
        displayName: Setup NPM

      - task: npmAuthenticate@0
        inputs:
          workingFile: $(NPMRC_PATH)
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'), eq(variables['SHOULD_VALIDATE'], 'true'))
        displayName: Setup NPM Authentication

      - script: sudo apt update -y && sudo apt install -y build-essential pkg-config libx11-dev libx11-xcb-dev libxkbfile-dev libnotify-bin libkrb5-dev
        displayName: Install build tools
        condition: and(succeeded(), eq(variables['SHOULD_VALIDATE'], 'true'))

      - script: |
          set -e

          for attempt in {1..12}; do
            if [ $attempt -gt 1 ]; then
              echo "Attempt $attempt: Waiting for 30 minutes before retrying..."
              sleep 1800
            fi

            echo "Attempt $attempt: Running npm ci"
            if npm i --ignore-scripts; then
              if node build/npm/postinstall.ts; then
                echo "npm i succeeded on attempt $attempt"
                exit 0
              else
                echo "node build/npm/postinstall.ts failed on attempt $attempt"
              fi
            else
              echo "npm i failed on attempt $attempt"
            fi
          done

          echo "npm i failed after 12 attempts"
          exit 1
        env:
          npm_command: 'install --ignore-scripts'
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Install dependencies with retries
        timeoutInMinutes: 400
        condition: and(succeeded(), eq(variables['SHOULD_VALIDATE'], 'true'))

      - script: .github/workflows/check-clean-git-state.sh
        displayName: Check clean git state
        condition: and(succeeded(), eq(variables['SHOULD_VALIDATE'], 'true'))
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/product-publish.yml]---
Location: vscode-main/build/azure-pipelines/product-publish.yml

```yaml
parameters:
  - name: VSCODE_QUALITY
    type: string
  - name: VSCODE_SCHEDULEDBUILD
    type: boolean

jobs:
  - job: PublishBuild
    displayName: Publish Build
    timeoutInMinutes: 180
    pool:
      name: 1es-windows-2022-x64
      os: windows
    variables:
      - name: BUILDS_API_URL
        value: $(System.CollectionUri)$(System.TeamProject)/_apis/build/builds/$(Build.BuildId)/
    templateContext:
      outputs:
        - output: pipelineArtifact
          targetPath: $(Pipeline.Workspace)/artifacts_processed_$(System.StageAttempt)/artifacts_processed_$(System.StageAttempt).txt
          artifactName: artifacts_processed_$(System.StageAttempt)
          displayName: Publish the artifacts processed for this stage attempt
          sbomEnabled: false
          isProduction: false
          condition: always()
    steps:
      - template: ./common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password"

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get ESRP Secrets"
        inputs:
          azureSubscription: vscode-esrp
          KeyVaultName: vscode-esrp
          SecretsFilter: esrp-auth,esrp-sign

      # allow-any-unicode-next-line
      - pwsh: Write-Host "##vso[build.addbuildtag]🚀"
        displayName: Add build tag

      - pwsh: |
          npm ci
        workingDirectory: build
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Install build dependencies

      - download: current
        patterns: "**/artifacts_processed_*.txt"
        displayName: Download all artifacts_processed text files

      - task: AzureCLI@2
        displayName: Fetch secrets
        inputs:
          azureSubscription: vscode
          scriptType: pscore
          scriptLocation: inlineScript
          addSpnToEnvironment: true
          inlineScript: |
            Write-Host "##vso[task.setvariable variable=AZURE_TENANT_ID]$env:tenantId"
            Write-Host "##vso[task.setvariable variable=AZURE_CLIENT_ID]$env:servicePrincipalId"
            Write-Host "##vso[task.setvariable variable=AZURE_ID_TOKEN;issecret=true]$env:idToken"

      - pwsh: |
          . build/azure-pipelines/win32/exec.ps1

          if (Test-Path "$(Pipeline.Workspace)/artifacts_processed_*/artifacts_processed_*.txt") {
            Write-Host "Artifacts already processed so a build must have already been created."
            return
          }

          $VERSION = node -p "require('./package.json').version"
          Write-Host "Creating build with version: $VERSION"
          exec { node build/azure-pipelines/common/createBuild.ts $VERSION }
        env:
          AZURE_TENANT_ID: "$(AZURE_TENANT_ID)"
          AZURE_CLIENT_ID: "$(AZURE_CLIENT_ID)"
          AZURE_ID_TOKEN: "$(AZURE_ID_TOKEN)"
        displayName: Create build if it hasn't been created before

      - pwsh: |
          $publishAuthTokens = (node build/azure-pipelines/common/getPublishAuthTokens.ts)
          Write-Host "##vso[task.setvariable variable=PUBLISH_AUTH_TOKENS;issecret=true]$publishAuthTokens"
        env:
          AZURE_TENANT_ID: "$(AZURE_TENANT_ID)"
          AZURE_CLIENT_ID: "$(AZURE_CLIENT_ID)"
          AZURE_ID_TOKEN: "$(AZURE_ID_TOKEN)"
        displayName: Get publish auth tokens

      - pwsh: node build/azure-pipelines/common/publish.ts
        env:
          SYSTEM_ACCESSTOKEN: $(System.AccessToken)
          PUBLISH_AUTH_TOKENS: "$(PUBLISH_AUTH_TOKENS)"
          RELEASE_TENANT_ID: "$(ESRP_TENANT_ID)"
          RELEASE_CLIENT_ID: "$(ESRP_CLIENT_ID)"
          RELEASE_AUTH_CERT: "$(esrp-auth)"
          RELEASE_REQUEST_SIGNING_CERT: "$(esrp-sign)"
        displayName: Process artifacts
        retryCountOnTaskFailure: 3

      - ${{ if and(in(parameters.VSCODE_QUALITY, 'insider', 'exploration'), eq(parameters.VSCODE_SCHEDULEDBUILD, true)) }}:
        - script: node build/azure-pipelines/common/releaseBuild.ts
          env:
            PUBLISH_AUTH_TOKENS: "$(PUBLISH_AUTH_TOKENS)"
          displayName: Release build
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/product-release.yml]---
Location: vscode-main/build/azure-pipelines/product-release.yml

```yaml
parameters:
  - name: VSCODE_RELEASE
    type: boolean

steps:
  - template: ./common/checkout.yml@self

  - task: NodeTool@0
    inputs:
      versionSource: fromFile
      versionFilePath: .nvmrc

  - task: AzureCLI@2
    displayName: Fetch secrets
    inputs:
      azureSubscription: vscode
      scriptType: pscore
      scriptLocation: inlineScript
      addSpnToEnvironment: true
      inlineScript: |
        Write-Host "##vso[task.setvariable variable=AZURE_TENANT_ID]$env:tenantId"
        Write-Host "##vso[task.setvariable variable=AZURE_CLIENT_ID]$env:servicePrincipalId"
        Write-Host "##vso[task.setvariable variable=AZURE_ID_TOKEN;issecret=true]$env:idToken"

  - script: npm ci
    workingDirectory: build
    displayName: Install build dependencies

  - pwsh: |
      $publishAuthTokens = (node build/azure-pipelines/common/getPublishAuthTokens.ts)
      Write-Host "##vso[task.setvariable variable=PUBLISH_AUTH_TOKENS;issecret=true]$publishAuthTokens"
    env:
      AZURE_TENANT_ID: "$(AZURE_TENANT_ID)"
      AZURE_CLIENT_ID: "$(AZURE_CLIENT_ID)"
      AZURE_ID_TOKEN: "$(AZURE_ID_TOKEN)"
    displayName: Get publish auth tokens

  - script: node build/azure-pipelines/common/releaseBuild.ts ${{ parameters.VSCODE_RELEASE }}
    displayName: Release build
    env:
      PUBLISH_AUTH_TOKENS: "$(PUBLISH_AUTH_TOKENS)"
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/upload-cdn.ts]---
Location: vscode-main/build/azure-pipelines/upload-cdn.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import es from 'event-stream';
import Vinyl from 'vinyl';
import vfs from 'vinyl-fs';
import filter from 'gulp-filter';
import gzip from 'gulp-gzip';
import mime from 'mime';
import { ClientAssertionCredential } from '@azure/identity';
import { VinylStat } from '../lib/util.ts';
import azure from 'gulp-azure-storage';

const commit = process.env['BUILD_SOURCEVERSION'];
const credential = new ClientAssertionCredential(process.env['AZURE_TENANT_ID']!, process.env['AZURE_CLIENT_ID']!, () => Promise.resolve(process.env['AZURE_ID_TOKEN']!));

mime.define({
	'application/typescript': ['ts'],
	'application/json': ['code-snippets'],
});

// From default AFD configuration
const MimeTypesToCompress = new Set([
	'application/eot',
	'application/font',
	'application/font-sfnt',
	'application/javascript',
	'application/json',
	'application/opentype',
	'application/otf',
	'application/pkcs7-mime',
	'application/truetype',
	'application/ttf',
	'application/typescript',
	'application/vnd.ms-fontobject',
	'application/xhtml+xml',
	'application/xml',
	'application/xml+rss',
	'application/x-font-opentype',
	'application/x-font-truetype',
	'application/x-font-ttf',
	'application/x-httpd-cgi',
	'application/x-javascript',
	'application/x-mpegurl',
	'application/x-opentype',
	'application/x-otf',
	'application/x-perl',
	'application/x-ttf',
	'font/eot',
	'font/ttf',
	'font/otf',
	'font/opentype',
	'image/svg+xml',
	'text/css',
	'text/csv',
	'text/html',
	'text/javascript',
	'text/js',
	'text/markdown',
	'text/plain',
	'text/richtext',
	'text/tab-separated-values',
	'text/xml',
	'text/x-script',
	'text/x-component',
	'text/x-java-source'
]);

function wait(stream: es.ThroughStream): Promise<void> {
	return new Promise<void>((c, e) => {
		stream.on('end', () => c());
		stream.on('error', (err) => e(err));
	});
}

async function main(): Promise<void> {
	const files: string[] = [];
	const options = (compressed: boolean) => ({
		account: process.env.AZURE_STORAGE_ACCOUNT,
		credential,
		container: '$web',
		prefix: `${process.env.VSCODE_QUALITY}/${commit}/`,
		contentSettings: {
			contentEncoding: compressed ? 'gzip' : undefined,
			cacheControl: 'max-age=31536000, public'
		}
	});

	const all = vfs.src('**', { cwd: '../vscode-web', base: '../vscode-web', dot: true })
		.pipe(filter(f => !f.isDirectory()));

	const compressed = all
		.pipe(filter(f => MimeTypesToCompress.has(mime.lookup(f.path))))
		.pipe(gzip({ append: false }))
		.pipe(azure.upload(options(true)));

	const uncompressed = all
		.pipe(filter(f => !MimeTypesToCompress.has(mime.lookup(f.path))))
		.pipe(azure.upload(options(false)));

	const out = es.merge(compressed, uncompressed)
		.pipe(es.through(function (f) {
			console.log('Uploaded:', f.relative);
			files.push(f.relative);
			this.emit('data', f);
		}));

	console.log(`Uploading files to CDN...`); // debug
	await wait(out);

	const listing = new Vinyl({
		path: 'files.txt',
		contents: Buffer.from(files.join('\n')),
		stat: new VinylStat({ mode: 0o666 })
	});

	const filesOut = es.readArray([listing])
		.pipe(gzip({ append: false }))
		.pipe(azure.upload(options(true)));

	console.log(`Uploading: files.txt (${files.length} files)`); // debug
	await wait(filesOut);
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/upload-nlsmetadata.ts]---
Location: vscode-main/build/azure-pipelines/upload-nlsmetadata.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import es from 'event-stream';
import Vinyl from 'vinyl';
import vfs from 'vinyl-fs';
import merge from 'gulp-merge-json';
import gzip from 'gulp-gzip';
import { ClientAssertionCredential } from '@azure/identity';
import path from 'path';
import { readFileSync } from 'fs';
import azure from 'gulp-azure-storage';

const commit = process.env['BUILD_SOURCEVERSION'];
const credential = new ClientAssertionCredential(process.env['AZURE_TENANT_ID']!, process.env['AZURE_CLIENT_ID']!, () => Promise.resolve(process.env['AZURE_ID_TOKEN']!));

interface NlsMetadata {
	keys: { [module: string]: string };
	messages: { [module: string]: string };
	bundles: { [bundle: string]: string[] };
}

function main(): Promise<void> {
	return new Promise((c, e) => {
		const combinedMetadataJson = es.merge(
			// vscode: we are not using `out-build/nls.metadata.json` here because
			// it includes metadata for translators for `keys`. but for our purpose
			// we want only the `keys` and `messages` as `string`.
			es.merge(
				vfs.src('out-build/nls.keys.json', { base: 'out-build' }),
				vfs.src('out-build/nls.messages.json', { base: 'out-build' }))
				.pipe(merge({
					fileName: 'vscode.json',
					jsonSpace: '',
					concatArrays: true,
					edit: (parsedJson, file) => {
						if (file.base === 'out-build') {
							if (file.basename === 'nls.keys.json') {
								return { keys: parsedJson };
							} else {
								return { messages: parsedJson };
							}
						}
					}
				})),

			// extensions
			vfs.src('.build/extensions/**/nls.metadata.json', { base: '.build/extensions' }),
			vfs.src('.build/extensions/**/nls.metadata.header.json', { base: '.build/extensions' }),
			vfs.src('.build/extensions/**/package.nls.json', { base: '.build/extensions' })
		).pipe(merge({
			fileName: 'combined.nls.metadata.json',
			jsonSpace: '',
			concatArrays: true,
			edit: (parsedJson, file) => {
				if (file.basename === 'vscode.json') {
					return { vscode: parsedJson };
				}

				// Handle extensions and follow the same structure as the Core nls file.
				switch (file.basename) {
					case 'package.nls.json':
						// put package.nls.json content in Core NlsMetadata format
						// language packs use the key "package" to specify that
						// translations are for the package.json file
						parsedJson = {
							messages: {
								package: Object.values(parsedJson)
							},
							keys: {
								package: Object.keys(parsedJson)
							},
							bundles: {
								main: ['package']
							}
						};
						break;

					case 'nls.metadata.header.json':
						parsedJson = { header: parsedJson };
						break;

					case 'nls.metadata.json': {
						// put nls.metadata.json content in Core NlsMetadata format
						const modules = Object.keys(parsedJson);

						const json: NlsMetadata = {
							keys: {},
							messages: {},
							bundles: {
								main: []
							}
						};
						for (const module of modules) {
							json.messages[module] = parsedJson[module].messages;
							json.keys[module] = parsedJson[module].keys;
							json.bundles.main.push(module);
						}
						parsedJson = json;
						break;
					}
				}

				// Get extension id and use that as the key
				const folderPath = path.join(file.base, file.relative.split('/')[0]);
				const manifest = readFileSync(path.join(folderPath, 'package.json'), 'utf-8');
				const manifestJson = JSON.parse(manifest);
				const key = manifestJson.publisher + '.' + manifestJson.name;
				return { [key]: parsedJson };
			},
		}));

		const nlsMessagesJs = vfs.src('out-build/nls.messages.js', { base: 'out-build' });

		es.merge(combinedMetadataJson, nlsMessagesJs)
			.pipe(gzip({ append: false }))
			.pipe(vfs.dest('./nlsMetadata'))
			.pipe(es.through(function (data: Vinyl) {
				console.log(`Uploading ${data.path}`);
				// trigger artifact upload
				console.log(`##vso[artifact.upload containerfolder=nlsmetadata;artifactname=${data.basename}]${data.path}`);
				this.emit('data', data);
			}))
			.pipe(azure.upload({
				account: process.env.AZURE_STORAGE_ACCOUNT,
				credential,
				container: '$web',
				prefix: `nlsmetadata/${commit}/`,
				contentSettings: {
					contentEncoding: 'gzip',
					cacheControl: 'max-age=31536000, public'
				}
			}))
			.on('end', () => c())
			.on('error', (err: unknown) => e(err));
	});
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/upload-sourcemaps.ts]---
Location: vscode-main/build/azure-pipelines/upload-sourcemaps.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path from 'path';
import es from 'event-stream';
import Vinyl from 'vinyl';
import vfs from 'vinyl-fs';
import * as util from '../lib/util.ts';
import { getProductionDependencies } from '../lib/dependencies.ts';
import { ClientAssertionCredential } from '@azure/identity';
import Stream from 'stream';
import azure from 'gulp-azure-storage';

const root = path.dirname(path.dirname(import.meta.dirname));
const commit = process.env['BUILD_SOURCEVERSION'];
const credential = new ClientAssertionCredential(process.env['AZURE_TENANT_ID']!, process.env['AZURE_CLIENT_ID']!, () => Promise.resolve(process.env['AZURE_ID_TOKEN']!));

// optionally allow to pass in explicit base/maps to upload
const [, , base, maps] = process.argv;

function src(base: string, maps = `${base}/**/*.map`) {
	return vfs.src(maps, { base })
		.pipe(es.mapSync((f: Vinyl) => {
			f.path = `${f.base}/core/${f.relative}`;
			return f;
		}));
}

function main(): Promise<void> {
	const sources: Stream[] = [];

	// vscode client maps (default)
	if (!base) {
		const vs = src('out-vscode-min'); // client source-maps only
		sources.push(vs);

		const productionDependencies = getProductionDependencies(root);
		const productionDependenciesSrc = productionDependencies.map((d: string) => path.relative(root, d)).map((d: string) => `./${d}/**/*.map`);
		const nodeModules = vfs.src(productionDependenciesSrc, { base: '.' })
			.pipe(util.cleanNodeModules(path.join(root, 'build', '.moduleignore')))
			.pipe(util.cleanNodeModules(path.join(root, 'build', `.moduleignore.${process.platform}`)));
		sources.push(nodeModules);

		const extensionsOut = vfs.src(['.build/extensions/**/*.js.map', '!**/node_modules/**'], { base: '.build' });
		sources.push(extensionsOut);
	}

	// specific client base/maps
	else {
		sources.push(src(base, maps));
	}

	return new Promise((c, e) => {
		es.merge(...sources)
			.pipe(es.through(function (data: Vinyl) {
				console.log('Uploading Sourcemap', data.relative); // debug
				this.emit('data', data);
			}))
			.pipe(azure.upload({
				account: process.env.AZURE_STORAGE_ACCOUNT,
				credential,
				container: '$web',
				prefix: `sourcemaps/${commit}/`
			}))
			.on('end', () => c())
			.on('error', (err) => e(err));
	});
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/alpine/product-build-alpine-cli.yml]---
Location: vscode-main/build/azure-pipelines/alpine/product-build-alpine-cli.yml

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
- job: AlpineCLI_${{ parameters.VSCODE_ARCH }}
  displayName: Alpine (${{ upper(parameters.VSCODE_ARCH) }})
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
          targetPath: $(Build.ArtifactStagingDirectory)/vscode_cli_alpine_$(VSCODE_ARCH)_cli.tar.gz
          artifactName: vscode_cli_alpine_$(VSCODE_ARCH)_cli
          displayName: Publish vscode_cli_alpine_$(VSCODE_ARCH)_cli artifact
          sbomBuildDropPath: $(Build.ArtifactStagingDirectory)/cli
          sbomPackageName: "VS Code Alpine $(VSCODE_ARCH) CLI"
          sbomPackageVersion: $(Build.SourceVersion)
  steps:
    - template: ../common/checkout.yml@self

    - task: NodeTool@0
      inputs:
        versionSource: fromFile
        versionFilePath: .nvmrc

    - template: ../cli/cli-apply-patches.yml@self

    - script: |
        set -e
        npm ci
      workingDirectory: build
      env:
        GITHUB_TOKEN: "$(github-distro-mixin-password)"
      displayName: Install build dependencies

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

    # inspired by: https://github.com/emk/rust-musl-builder/blob/main/Dockerfile
    - bash: |
        set -e
        sudo apt-get update
        sudo apt-get install -yq build-essential musl-dev musl-tools linux-libc-dev pkgconf xutils-dev lld
        sudo ln -s "/usr/bin/g++" "/usr/bin/musl-g++" || echo "link exists"
      displayName: Install musl build dependencies

    - template: ../cli/install-rust-posix.yml@self
      parameters:
        targets:
          - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
            - x86_64-unknown-linux-musl
          - ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
            - aarch64-unknown-linux-musl

    - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
      - template: ../cli/cli-compile.yml@self
        parameters:
          VSCODE_CLI_TARGET: x86_64-unknown-linux-musl
          VSCODE_CLI_ARTIFACT: vscode_cli_alpine_x64_cli
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          VSCODE_CLI_ENV:
            CXX_aarch64-unknown-linux-musl: musl-g++
            CC_aarch64-unknown-linux-musl: musl-gcc
            OPENSSL_LIB_DIR: $(Build.ArtifactStagingDirectory)/openssl/x64-linux-musl/lib
            OPENSSL_INCLUDE_DIR: $(Build.ArtifactStagingDirectory)/openssl/x64-linux-musl/include
            OPENSSL_STATIC: "1"

    - ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
      - template: ../cli/cli-compile.yml@self
        parameters:
          VSCODE_CLI_TARGET: aarch64-unknown-linux-musl
          VSCODE_CLI_ARTIFACT: vscode_cli_alpine_arm64_cli
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          VSCODE_CLI_ENV:
            OPENSSL_LIB_DIR: $(Build.ArtifactStagingDirectory)/openssl/arm64-linux-musl/lib
            OPENSSL_INCLUDE_DIR: $(Build.ArtifactStagingDirectory)/openssl/arm64-linux-musl/include
            OPENSSL_STATIC: "1"
            SYSROOT_ARCH: arm64
            IS_MUSL: "1"
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/alpine/product-build-alpine-node-modules.yml]---
Location: vscode-main/build/azure-pipelines/alpine/product-build-alpine-node-modules.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string

jobs:
  - job: LinuxAlpine_${{ parameters.VSCODE_ARCH }}
    displayName: Linux Alpine (${{ upper(parameters.VSCODE_ARCH) }})
    pool:
      name: 1es-ubuntu-22.04-x64
      os: linux
    timeoutInMinutes: 60
    variables:
      NPM_ARCH: ${{ parameters.VSCODE_ARCH }}
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

      - script: node build/setup-npm-registry.ts $NPM_REGISTRY
        condition: and(succeeded(), ne(variables['NPM_REGISTRY'], 'none'))
        displayName: Setup NPM Registry

      - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts alpine $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash
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

      - task: Docker@1
        inputs:
          azureSubscriptionEndpoint: vscode
          azureContainerRegistry: vscodehub.azurecr.io
          command: "Run an image"
          imageName: "vscode-linux-build-agent:alpine-$(VSCODE_ARCH)"
          containerCommand: uname
        displayName: "Pull image"
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: sudo apt-get update && sudo apt-get install -y libkrb5-dev
        displayName: Install build dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: |
          set -e
          mkdir -p .build/nodejs-musl
          NODE_VERSION=$(grep '^target=' remote/.npmrc | cut -d '"' -f 2)
          BUILD_ID=$(grep '^ms_build_id=' remote/.npmrc | cut -d '"' -f 2)
          gh release download "v${NODE_VERSION}-${BUILD_ID}" -R microsoft/vscode-node -p "node-v${NODE_VERSION}-linux-${VSCODE_ARCH}-musl.tar.gz" --dir .build/nodejs-musl --clobber
          tar -xzf ".build/nodejs-musl/node-v${NODE_VERSION}-linux-${VSCODE_ARCH}-musl.tar.gz" -C ".build/nodejs-musl" --strip-components=1
          rm ".build/nodejs-musl/node-v${NODE_VERSION}-linux-${VSCODE_ARCH}-musl.tar.gz"
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Download NodeJS MUSL
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
          npm_config_arch: $(NPM_ARCH)
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
          VSCODE_REMOTE_DEPENDENCIES_CONTAINER_NAME: vscodehub.azurecr.io/vscode-linux-build-agent:alpine-$(VSCODE_ARCH)
          VSCODE_HOST_MOUNT: "/mnt/vss/_work/1/s"
          VSCODE_NPMRC_PATH: $(NPMRC_PATH)
        displayName: Install dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: node build/azure-pipelines/distro/mixin-npm.ts
        displayName: Mixin distro node modules
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: |
          set -e
          node build/azure-pipelines/common/listNodeModules.ts .build/node_modules_list.txt
          mkdir -p .build/node_modules_cache
          tar -czf .build/node_modules_cache/cache.tgz --files-from .build/node_modules_list.txt
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))
        displayName: Create node_modules archive
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/alpine/product-build-alpine.yml]---
Location: vscode-main/build/azure-pipelines/alpine/product-build-alpine.yml

```yaml
parameters:
  - name: VSCODE_ARCH
    type: string

jobs:
  - job: Alpine_${{ parameters.VSCODE_ARCH }}
    displayName: Alpine (${{ upper(parameters.VSCODE_ARCH) }})
    timeoutInMinutes: 30
    pool:
      name: 1es-ubuntu-22.04-x64
      os: linux
    variables:
      NPM_ARCH: ${{ parameters.VSCODE_ARCH }}
      VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
    templateContext:
      outputParentDirectory: $(Build.ArtifactStagingDirectory)/out
      outputs:
        - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
          # keep legacy name
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/server/vscode-server-linux-alpine.tar.gz
            artifactName: vscode_server_linux_alpine_archive-unsigned
            displayName: Publish x64 server archive
            sbomBuildDropPath: $(SERVER_DIR_PATH)
            sbomPackageName: "VS Code Alpine x64 Server"
            sbomPackageVersion: $(Build.SourceVersion)
          # keep legacy name
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/web/vscode-server-linux-alpine-web.tar.gz
            artifactName: vscode_web_linux_alpine_archive-unsigned
            displayName: Publish x64 web server archive
            sbomBuildDropPath: $(WEB_DIR_PATH)
            sbomPackageName: "VS Code Alpine x64 Web"
            sbomPackageVersion: $(Build.SourceVersion)
        - ${{ if ne(parameters.VSCODE_ARCH, 'x64') }}:
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/server/vscode-server-alpine-$(VSCODE_ARCH).tar.gz
            artifactName: vscode_server_alpine_$(VSCODE_ARCH)_archive-unsigned
            displayName: Publish server archive
            sbomBuildDropPath: $(SERVER_DIR_PATH)
            sbomPackageName: "VS Code Alpine $(VSCODE_ARCH) Server"
            sbomPackageVersion: $(Build.SourceVersion)
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/web/vscode-server-alpine-$(VSCODE_ARCH)-web.tar.gz
            artifactName: vscode_web_alpine_$(VSCODE_ARCH)_archive-unsigned
            displayName: Publish web server archive
            sbomBuildDropPath: $(WEB_DIR_PATH)
            sbomPackageName: "VS Code Alpine $(VSCODE_ARCH) Web"
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

      - script: mkdir -p .build && node build/azure-pipelines/common/computeNodeModulesCacheKey.ts alpine $VSCODE_ARCH $(node -p process.arch) > .build/packagelockhash
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

      - task: Docker@1
        inputs:
          azureSubscriptionEndpoint: vscode
          azureContainerRegistry: vscodehub.azurecr.io
          command: "Run an image"
          imageName: "vscode-linux-build-agent:alpine-$(VSCODE_ARCH)"
          containerCommand: uname
        displayName: "Pull image"
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: sudo apt-get update && sudo apt-get install -y libkrb5-dev
        displayName: Install build dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: |
          set -e
          mkdir -p .build/nodejs-musl
          NODE_VERSION=$(grep '^target=' remote/.npmrc | cut -d '"' -f 2)
          BUILD_ID=$(grep '^ms_build_id=' remote/.npmrc | cut -d '"' -f 2)
          gh release download "v${NODE_VERSION}-${BUILD_ID}" -R microsoft/vscode-node -p "node-v${NODE_VERSION}-linux-${VSCODE_ARCH}-musl.tar.gz" --dir .build/nodejs-musl --clobber
          tar -xzf ".build/nodejs-musl/node-v${NODE_VERSION}-linux-${VSCODE_ARCH}-musl.tar.gz" -C ".build/nodejs-musl" --strip-components=1
          rm ".build/nodejs-musl/node-v${NODE_VERSION}-linux-${VSCODE_ARCH}-musl.tar.gz"
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Download NodeJS MUSL
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
          npm_config_arch: $(NPM_ARCH)
          ELECTRON_SKIP_BINARY_DOWNLOAD: 1
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: 1
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
          VSCODE_REMOTE_DEPENDENCIES_CONTAINER_NAME: vscodehub.azurecr.io/vscode-linux-build-agent:alpine-$(VSCODE_ARCH)
          VSCODE_HOST_MOUNT: "/mnt/vss/_work/1/s"
          VSCODE_NPMRC_PATH: $(NPMRC_PATH)
        displayName: Install dependencies
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

      - script: node build/azure-pipelines/distro/mixin-npm.ts
        displayName: Mixin distro node modules
        condition: and(succeeded(), ne(variables.NODE_MODULES_RESTORED, 'true'))

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
          TARGET=$([ "$VSCODE_ARCH" == "x64" ] && echo "linux-alpine" || echo "alpine-arm64") # TODO@joaomoreno
          npm run gulp vscode-reh-$TARGET-min-ci
          (cd .. && mv vscode-reh-$TARGET vscode-server-$TARGET) # TODO@joaomoreno
          ARCHIVE_PATH="$(Build.ArtifactStagingDirectory)/out/server/vscode-server-$TARGET.tar.gz"
          DIR_PATH="$(realpath ../vscode-server-$TARGET)"
          mkdir -p $(dirname $ARCHIVE_PATH)
          tar --owner=0 --group=0 -czf $ARCHIVE_PATH -C .. vscode-server-$TARGET
          echo "##vso[task.setvariable variable=SERVER_DIR_PATH]$DIR_PATH"
          echo "##vso[task.setvariable variable=SERVER_PATH]$ARCHIVE_PATH"
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Build server

      - script: |
          set -e
          TARGET=$([ "$VSCODE_ARCH" == "x64" ] && echo "linux-alpine" || echo "alpine-arm64")
          npm run gulp vscode-reh-web-$TARGET-min-ci
          (cd .. && mv vscode-reh-web-$TARGET vscode-server-$TARGET-web) # TODO@joaomoreno
          ARCHIVE_PATH="$(Build.ArtifactStagingDirectory)/out/web/vscode-server-$TARGET-web.tar.gz"
          DIR_PATH="$(realpath ../vscode-server-$TARGET-web)"
          mkdir -p $(dirname $ARCHIVE_PATH)
          tar --owner=0 --group=0 -czf $ARCHIVE_PATH -C .. vscode-server-$TARGET-web
          echo "##vso[task.setvariable variable=WEB_DIR_PATH]$DIR_PATH"
          echo "##vso[task.setvariable variable=WEB_PATH]$ARCHIVE_PATH"
        env:
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
        displayName: Build server (web)
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/cli/cli-apply-patches.yml]---
Location: vscode-main/build/azure-pipelines/cli/cli-apply-patches.yml

```yaml
steps:
  - template: ../distro/download-distro.yml@self

  - script: node build/azure-pipelines/distro/mixin-quality.ts
    displayName: Mixin distro quality

  - script: node .build/distro/cli-patches/index.js
    displayName: Apply distro patches
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/cli/cli-compile.yml]---
Location: vscode-main/build/azure-pipelines/cli/cli-compile.yml

```yaml
parameters:
  - name: VSCODE_QUALITY
    type: string
  - name: VSCODE_CLI_TARGET
    type: string
  - name: VSCODE_CLI_ARTIFACT
    type: string
  - name: VSCODE_CLI_ENV
    type: object
    default: {}
  - name: VSCODE_CHECK_ONLY
    type: boolean
    default: false

steps:
  - ${{ if contains(parameters.VSCODE_CLI_TARGET, '-windows-') }}:
    - pwsh: Write-Host "##vso[task.setvariable variable=VSCODE_CLI_PRODUCT_JSON]$(Build.SourcesDirectory)/.build/distro/mixin/${{ parameters.VSCODE_QUALITY }}/product.json"
      displayName: Set product.json path
  - ${{ else }}:
    - script: echo "##vso[task.setvariable variable=VSCODE_CLI_PRODUCT_JSON]$(Build.SourcesDirectory)/.build/distro/mixin/${{ parameters.VSCODE_QUALITY }}/product.json"
      displayName: Set product.json path

  - ${{ if parameters.VSCODE_CHECK_ONLY }}:
    - script: cargo clippy --target ${{ parameters.VSCODE_CLI_TARGET }} --bin=code
      displayName: Lint ${{ parameters.VSCODE_CLI_TARGET }}
      workingDirectory: $(Build.SourcesDirectory)/cli
      env:
        CARGO_NET_GIT_FETCH_WITH_CLI: true
        ${{ each pair in parameters.VSCODE_CLI_ENV }}:
          ${{ pair.key }}: ${{ pair.value }}

  - ${{ else }}:
    - ${{ if contains(parameters.VSCODE_CLI_TARGET, '-linux-') }}:
      - script: |
          set -e
          if [ -n "$SYSROOT_ARCH" ]; then
            export VSCODE_SYSROOT_DIR=$(Build.SourcesDirectory)/.build/sysroots
            node -e 'import { getVSCodeSysroot } from "../build/linux/debian/install-sysroot.ts"; (async () => { await getVSCodeSysroot(process.env["SYSROOT_ARCH"], process.env["IS_MUSL"] === "1"); })()'
            if [ "$SYSROOT_ARCH" == "arm64" ]; then
              if [ -n "$IS_MUSL" ]; then
                export CARGO_TARGET_AARCH64_UNKNOWN_LINUX_MUSL_LINKER="$VSCODE_SYSROOT_DIR/output/bin/aarch64-linux-musl-gcc"
                export CC_aarch64_unknown_linux_musl="$VSCODE_SYSROOT_DIR/output/bin/aarch64-linux-musl-gcc"
                export CXX_aarch64_unknown_linux_musl="$VSCODE_SYSROOT_DIR/output/bin/aarch64-linux-musl-g++"
              else
                export CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER="$VSCODE_SYSROOT_DIR/aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc"
                export CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_RUSTFLAGS="-C link-arg=--sysroot=$VSCODE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot"
                export CC_aarch64_unknown_linux_gnu="$VSCODE_SYSROOT_DIR/aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc --sysroot=$VSCODE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot"
                export PKG_CONFIG_LIBDIR_aarch64_unknown_linux_gnu="$VSCODE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot/usr/lib/aarch64-linux-gnu/pkgconfig:$VSCODE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot/usr/share/pkgconfig"
                export PKG_CONFIG_SYSROOT_DIR_aarch64_unknown_linux_gnu="$VSCODE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/sysroot"
                export OBJDUMP="$VSCODE_SYSROOT_DIR/aarch64-linux-gnu/aarch64-linux-gnu/bin/objdump"
              fi
            elif [ "$SYSROOT_ARCH" == "amd64" ]; then
              export CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER="$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/bin/x86_64-linux-gnu-gcc"
              export CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_RUSTFLAGS="-C link-arg=--sysroot=$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot -C link-arg=-L$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot/usr/lib/x86_64-linux-gnu"
              export CC_x86_64_unknown_linux_gnu="$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/bin/x86_64-linux-gnu-gcc --sysroot=$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot"
              export PKG_CONFIG_LIBDIR_x86_64_unknown_linux_gnu="$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot/usr/lib/x86_64-linux-gnu/pkgconfig:$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot/usr/share/pkgconfig"
              export PKG_CONFIG_SYSROOT_DIR_x86_64_unknown_linux_gnu="$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/sysroot"
              export OBJDUMP="$VSCODE_SYSROOT_DIR/x86_64-linux-gnu/x86_64-linux-gnu/bin/objdump"
            elif [ "$SYSROOT_ARCH" == "armhf" ]; then
              export CARGO_TARGET_ARMV7_UNKNOWN_LINUX_GNUEABIHF_LINKER="$VSCODE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/bin/arm-rpi-linux-gnueabihf-gcc"
              export CARGO_TARGET_ARMV7_UNKNOWN_LINUX_GNUEABIHF_RUSTFLAGS="-C link-arg=--sysroot=$VSCODE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot"
              export CC_armv7_unknown_linux_gnueabihf="$VSCODE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/bin/arm-rpi-linux-gnueabihf-gcc --sysroot=$VSCODE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot"
              export PKG_CONFIG_LIBDIR_armv7_unknown_linux_gnueabihf="$VSCODE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot/usr/lib/arm-rpi-linux-gnueabihf/pkgconfig:$VSCODE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot/usr/share/pkgconfig"
              export PKG_CONFIG_SYSROOT_DIR_armv7_unknown_linux_gnueabihf="$VSCODE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/sysroot"
              export OBJDUMP="$VSCODE_SYSROOT_DIR/arm-rpi-linux-gnueabihf/arm-rpi-linux-gnueabihf/bin/objdump"
            fi
          fi

          cargo build --release --target ${{ parameters.VSCODE_CLI_TARGET }} --bin=code

          # verify glibc requirement
          if [ -n "$SYSROOT_ARCH" ] && [ -n "$OBJDUMP" ]; then
            glibc_version="2.28"
            while IFS= read -r line; do
              if [[ $line == *"GLIBC_"* ]]; then
                version=$(echo "$line" | awk '{print $5}' | tr -d '()')
                version=${version#*_}
                if [[ $(printf "%s\n%s" "$version" "$glibc_version" | sort -V | tail -n1) == "$version" ]]; then
                  glibc_version=$version
                fi
              fi
            done < <("$OBJDUMP" -T "$PWD/target/${{ parameters.VSCODE_CLI_TARGET }}/release/code")
            if [[ "$glibc_version" != "2.28" ]]; then
              echo "Error: binary has dependency on GLIBC > 2.28, found $glibc_version"
              exit 1
            else
              echo "Maximum GLIBC version is $glibc_version as expected."
            fi
          fi
        displayName: Compile ${{ parameters.VSCODE_CLI_TARGET }}
        workingDirectory: $(Build.SourcesDirectory)/cli
        env:
          CARGO_NET_GIT_FETCH_WITH_CLI: true
          VSCODE_CLI_COMMIT: $(Build.SourceVersion)
          GITHUB_TOKEN: "$(github-distro-mixin-password)"
          ${{ each pair in parameters.VSCODE_CLI_ENV }}:
            ${{ pair.key }}: ${{ pair.value }}

    - ${{ else }}:
      - script: cargo build --release --target ${{ parameters.VSCODE_CLI_TARGET }} --bin=code
        displayName: Compile ${{ parameters.VSCODE_CLI_TARGET }}
        workingDirectory: $(Build.SourcesDirectory)/cli
        env:
          CARGO_NET_GIT_FETCH_WITH_CLI: true
          VSCODE_CLI_COMMIT: $(Build.SourceVersion)
          ${{ each pair in parameters.VSCODE_CLI_ENV }}:
            ${{ pair.key }}: ${{ pair.value }}

    - ${{ if contains(parameters.VSCODE_CLI_TARGET, '-windows-') }}:
      - task: PublishSymbols@2
        inputs:
          IndexSources: false
          SymbolsFolder: $(Build.SourcesDirectory)/cli/target/${{ parameters.VSCODE_CLI_TARGET }}/release
          SearchPattern: 'code.pdb'
          SymbolServerType: TeamServices
          SymbolsProduct: 'code'
          ArtifactServices.Symbol.AccountName: microsoft
          ArtifactServices.Symbol.PAT: $(System.AccessToken)
          ArtifactServices.Symbol.UseAAD: false
        displayName: Publish Symbols

      - powershell: |
          . build/azure-pipelines/win32/exec.ps1
          $ErrorActionPreference = "Stop"
          $AppProductJson = Get-Content -Raw -Path "$env:VSCODE_CLI_PRODUCT_JSON" | ConvertFrom-Json
          $env:VSCODE_CLI_APPLICATION_NAME = $AppProductJson.applicationName

          Write-Host "##vso[task.setvariable variable=VSCODE_CLI_APPLICATION_NAME]$env:VSCODE_CLI_APPLICATION_NAME"

          New-Item -ItemType Directory -Force -Path "$(Build.ArtifactStagingDirectory)/cli"
          Move-Item -Path $(Build.SourcesDirectory)/cli/target/${{ parameters.VSCODE_CLI_TARGET }}/release/code.exe -Destination "$(Build.ArtifactStagingDirectory)/cli/${env:VSCODE_CLI_APPLICATION_NAME}.exe"
        displayName: Stage CLI

      - task: ArchiveFiles@2
        displayName: Archive CLI
        inputs:
          rootFolderOrFile: $(Build.ArtifactStagingDirectory)/cli/$(VSCODE_CLI_APPLICATION_NAME).exe
          includeRootFolder: false
          archiveType: zip
          archiveFile: $(Build.ArtifactStagingDirectory)/${{ parameters.VSCODE_CLI_ARTIFACT }}.zip

    - ${{ else }}:
      - script: |
          set -e
          VSCODE_CLI_APPLICATION_NAME=$(node -p "require(\"$VSCODE_CLI_PRODUCT_JSON\").applicationName")
          echo "##vso[task.setvariable variable=VSCODE_CLI_APPLICATION_NAME]$VSCODE_CLI_APPLICATION_NAME"

          mkdir -p $(Build.ArtifactStagingDirectory)/cli
          mv $(Build.SourcesDirectory)/cli/target/${{ parameters.VSCODE_CLI_TARGET }}/release/code $(Build.ArtifactStagingDirectory)/cli/$VSCODE_CLI_APPLICATION_NAME
        displayName: Stage CLI

      - task: ArchiveFiles@2
        displayName: Archive CLI
        inputs:
          rootFolderOrFile: $(Build.ArtifactStagingDirectory)/cli/$(VSCODE_CLI_APPLICATION_NAME)
          includeRootFolder: false
          ${{ if contains(parameters.VSCODE_CLI_TARGET, '-darwin') }}:
            archiveType: zip
            archiveFile: $(Build.ArtifactStagingDirectory)/${{ parameters.VSCODE_CLI_ARTIFACT }}.zip
          ${{ else }}:
            archiveType: tar
            tarCompression: gz
            archiveFile: $(Build.ArtifactStagingDirectory)/${{ parameters.VSCODE_CLI_ARTIFACT }}.tar.gz
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/cli/install-rust-posix.yml]---
Location: vscode-main/build/azure-pipelines/cli/install-rust-posix.yml

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

  - script: |
      set -e
      curl https://sh.rustup.rs -sSf | sh -s -- -y --profile minimal --default-toolchain $RUSTUP_TOOLCHAIN
      echo "##vso[task.setvariable variable=PATH;]$PATH:$HOME/.cargo/bin"
    env:
      RUSTUP_TOOLCHAIN: ${{ parameters.channel }}
    displayName: Install OSS Rust
    condition: and(succeeded(), eq(variables['CARGO_REGISTRY'], 'none'))

  - script: |
      set -e
      rustup default $RUSTUP_TOOLCHAIN
      rustup update $RUSTUP_TOOLCHAIN
      rustup component add clippy
    env:
      RUSTUP_TOOLCHAIN: ${{ parameters.channel }}
    displayName: "Set Rust version"
    condition: and(succeeded(), eq(variables['CARGO_REGISTRY'], 'none'))

  - ${{ each target in parameters.targets }}:
    - script: rustup target add ${{ target }}
      displayName: "Adding Rust target '${{ target }}'"
      condition: and(succeeded(), eq(variables['CARGO_REGISTRY'], 'none'))

  - script: |
      set -e
      rustc --version
      cargo --version
    displayName: "Check Rust versions"
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/checkForArtifact.ts]---
Location: vscode-main/build/azure-pipelines/common/checkForArtifact.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { type Artifact, requestAZDOAPI } from './publish.ts';
import { retry } from './retry.ts';

async function getPipelineArtifacts(): Promise<Artifact[]> {
	const result = await requestAZDOAPI<{ readonly value: Artifact[] }>('artifacts');
	return result.value.filter(a => !/sbom$/.test(a.name));
}

async function main([variableName, artifactName]: string[]): Promise<void> {
	if (!variableName || !artifactName) {
		throw new Error(`Usage: node checkForArtifact.ts <variableName> <artifactName>`);
	}

	try {
		const artifacts = await retry(() => getPipelineArtifacts());
		const artifact = artifacts.find(a => a.name === artifactName);
		console.log(`##vso[task.setvariable variable=${variableName}]${artifact ? 'true' : 'false'}`);
	} catch (err) {
		console.error(`ERROR: Failed to get pipeline artifacts: ${err}`);
		console.log(`##vso[task.setvariable variable=${variableName}]false`);
	}
}

main(process.argv.slice(2))
	.then(() => {
		process.exit(0);
	}, err => {
		console.error(err);
		process.exit(1);
	});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/checkout.yml]---
Location: vscode-main/build/azure-pipelines/common/checkout.yml

```yaml
steps:
  - checkout: self
    fetchDepth: 1
    fetchTags: false
    displayName: Checkout microsoft/vscode
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/codesign.ts]---
Location: vscode-main/build/azure-pipelines/common/codesign.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, ProcessPromise } from 'zx';

export function printBanner(title: string) {
	title = `${title} (${new Date().toISOString()})`;

	console.log('\n');
	console.log('#'.repeat(75));
	console.log(`# ${title.padEnd(71)} #`);
	console.log('#'.repeat(75));
	console.log('\n');
}

export async function streamProcessOutputAndCheckResult(name: string, promise: ProcessPromise): Promise<void> {
	const result = await promise.pipe(process.stdout);
	if (result.ok) {
		console.log(`\n${name} completed successfully. Duration: ${result.duration} ms`);
		return;
	}

	throw new Error(`${name} failed: ${result.stderr}`);
}

export function spawnCodesignProcess(esrpCliDLLPath: string, type: 'sign-windows' | 'sign-windows-appx' | 'sign-pgp' | 'sign-darwin' | 'notarize-darwin', folder: string, glob: string): ProcessPromise {
	return $`node build/azure-pipelines/common/sign.ts ${esrpCliDLLPath} ${type} ${folder} ${glob}`;
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/computeBuiltInDepsCacheKey.ts]---
Location: vscode-main/build/azure-pipelines/common/computeBuiltInDepsCacheKey.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const productjson = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../../../product.json'), 'utf8'));
const shasum = crypto.createHash('sha256');

for (const ext of productjson.builtInExtensions) {
	shasum.update(`${ext.name}@${ext.version}`);
}

process.stdout.write(shasum.digest('hex'));
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/computeNodeModulesCacheKey.ts]---
Location: vscode-main/build/azure-pipelines/common/computeNodeModulesCacheKey.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { dirs } from '../../npm/dirs.ts';

const ROOT = path.join(import.meta.dirname, '../../../');

const shasum = crypto.createHash('sha256');

shasum.update(fs.readFileSync(path.join(ROOT, 'build/.cachesalt')));
shasum.update(fs.readFileSync(path.join(ROOT, '.npmrc')));
shasum.update(fs.readFileSync(path.join(ROOT, 'build', '.npmrc')));
shasum.update(fs.readFileSync(path.join(ROOT, 'remote', '.npmrc')));

// Add `package.json` and `package-lock.json` files
for (const dir of dirs) {
	const packageJsonPath = path.join(ROOT, dir, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
	const relevantPackageJsonSections = {
		dependencies: packageJson.dependencies,
		devDependencies: packageJson.devDependencies,
		optionalDependencies: packageJson.optionalDependencies,
		resolutions: packageJson.resolutions,
		distro: packageJson.distro
	};
	shasum.update(JSON.stringify(relevantPackageJsonSections));

	const packageLockPath = path.join(ROOT, dir, 'package-lock.json');
	shasum.update(fs.readFileSync(packageLockPath));
}

// Add any other command line arguments
for (let i = 2; i < process.argv.length; i++) {
	shasum.update(process.argv[i]);
}

process.stdout.write(shasum.digest('hex'));
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/createBuild.ts]---
Location: vscode-main/build/azure-pipelines/common/createBuild.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ClientAssertionCredential } from '@azure/identity';
import { CosmosClient } from '@azure/cosmos';
import { retry } from './retry.ts';

if (process.argv.length !== 3) {
	console.error('Usage: node createBuild.ts VERSION');
	process.exit(-1);
}

function getEnv(name: string): string {
	const result = process.env[name];

	if (typeof result === 'undefined') {
		throw new Error('Missing env: ' + name);
	}

	return result;
}

async function main(): Promise<void> {
	const [, , _version] = process.argv;
	const quality = getEnv('VSCODE_QUALITY');
	const commit = getEnv('BUILD_SOURCEVERSION');
	const queuedBy = getEnv('BUILD_QUEUEDBY');
	const sourceBranch = getEnv('BUILD_SOURCEBRANCH');
	const version = _version + (quality === 'stable' ? '' : `-${quality}`);

	console.log('Creating build...');
	console.log('Quality:', quality);
	console.log('Version:', version);
	console.log('Commit:', commit);

	const timestamp = Date.now();
	const build = {
		id: commit,
		timestamp,
		version,
		isReleased: false,
		private: process.env['VSCODE_PRIVATE_BUILD']?.toLowerCase() === 'true',
		sourceBranch,
		queuedBy,
		assets: [],
		updates: {},
		firstReleaseTimestamp: null,
		history: [
			{ event: 'created', timestamp }
		]
	};

	const aadCredentials = new ClientAssertionCredential(process.env['AZURE_TENANT_ID']!, process.env['AZURE_CLIENT_ID']!, () => Promise.resolve(process.env['AZURE_ID_TOKEN']!));
	const client = new CosmosClient({ endpoint: process.env['AZURE_DOCUMENTDB_ENDPOINT']!, aadCredentials });
	const scripts = client.database('builds').container(quality).scripts;
	await retry(() => scripts.storedProcedure('createBuild').execute('', [{ ...build, _partitionKey: '' }]));
}

main().then(() => {
	console.log('Build successfully created');
	process.exit(0);
}, err => {
	console.error(err);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/extract-telemetry.sh]---
Location: vscode-main/build/azure-pipelines/common/extract-telemetry.sh

```bash
#!/usr/bin/env bash
set -e

cd $BUILD_STAGINGDIRECTORY
mkdir extraction
cd extraction
git clone --depth 1 https://github.com/microsoft/vscode-extension-telemetry.git
git clone --depth 1 https://github.com/microsoft/vscode-chrome-debug-core.git
git clone --depth 1 https://github.com/microsoft/vscode-node-debug2.git
git clone --depth 1 https://github.com/microsoft/vscode-node-debug.git
git clone --depth 1 https://github.com/microsoft/vscode-html-languageservice.git
git clone --depth 1 https://github.com/microsoft/vscode-json-languageservice.git
node $BUILD_SOURCESDIRECTORY/node_modules/.bin/vscode-telemetry-extractor --sourceDir $BUILD_SOURCESDIRECTORY --excludedDir $BUILD_SOURCESDIRECTORY/extensions --outputDir . --applyEndpoints
node $BUILD_SOURCESDIRECTORY/node_modules/.bin/vscode-telemetry-extractor --config $BUILD_SOURCESDIRECTORY/build/azure-pipelines/common/telemetry-config.json -o .
mkdir -p $BUILD_SOURCESDIRECTORY/.build/telemetry
mv declarations-resolved.json $BUILD_SOURCESDIRECTORY/.build/telemetry/telemetry-core.json
mv config-resolved.json $BUILD_SOURCESDIRECTORY/.build/telemetry/telemetry-extensions.json
cd ..
rm -rf extraction
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/getPublishAuthTokens.ts]---
Location: vscode-main/build/azure-pipelines/common/getPublishAuthTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from '@azure/core-auth';
import { ConfidentialClientApplication } from '@azure/msal-node';

function e(name: string): string {
	const result = process.env[name];

	if (typeof result !== 'string') {
		throw new Error(`Missing env: ${name}`);
	}

	return result;
}

export async function getAccessToken(endpoint: string, tenantId: string, clientId: string, idToken: string): Promise<AccessToken> {
	const app = new ConfidentialClientApplication({
		auth: {
			clientId,
			authority: `https://login.microsoftonline.com/${tenantId}`,
			clientAssertion: idToken
		}
	});

	const result = await app.acquireTokenByClientCredential({ scopes: [`${endpoint}.default`] });

	if (!result) {
		throw new Error('Failed to get access token');
	}

	return {
		token: result.accessToken,
		expiresOnTimestamp: result.expiresOn!.getTime(),
		refreshAfterTimestamp: result.refreshOn?.getTime()
	};
}

async function main() {
	const cosmosDBAccessToken = await getAccessToken(e('AZURE_DOCUMENTDB_ENDPOINT')!, e('AZURE_TENANT_ID')!, e('AZURE_CLIENT_ID')!, e('AZURE_ID_TOKEN')!);
	const blobServiceAccessToken = await getAccessToken(`https://${e('VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net/`, process.env['AZURE_TENANT_ID']!, process.env['AZURE_CLIENT_ID']!, process.env['AZURE_ID_TOKEN']!);
	console.log(JSON.stringify({ cosmosDBAccessToken, blobServiceAccessToken }));
}

if (import.meta.main) {
	main().then(() => {
		process.exit(0);
	}, err => {
		console.error(err);
		process.exit(1);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/install-builtin-extensions.yml]---
Location: vscode-main/build/azure-pipelines/common/install-builtin-extensions.yml

```yaml
steps:
  - pwsh: mkdir .build -ea 0
    condition: and(succeeded(), contains(variables['Agent.OS'], 'windows'))
    displayName: Create .build folder

  - script: mkdir -p .build
    condition: and(succeeded(), not(contains(variables['Agent.OS'], 'windows')))
    displayName: Create .build folder

  - script: node build/azure-pipelines/common/computeBuiltInDepsCacheKey.ts > .build/builtindepshash
    displayName: Prepare built-in extensions cache key

  - task: Cache@2
    inputs:
      key: '"builtin-extensions" | .build/builtindepshash'
      path: .build/builtInExtensions
      cacheHitVar: BUILTIN_EXTENSIONS_RESTORED
    displayName: Restore built-in extensions cache

  - script: node build/lib/builtInExtensions.ts
    env:
      GITHUB_TOKEN: "$(github-distro-mixin-password)"
    condition: and(succeeded(), ne(variables.BUILTIN_EXTENSIONS_RESTORED, 'true'))
    displayName: Download built-in extensions
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/installPlaywright.js]---
Location: vscode-main/build/azure-pipelines/common/installPlaywright.js

```javascript
"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
process.env.DEBUG = 'pw:install'; // enable logging for this (https://github.com/microsoft/playwright/issues/17394)
const { installDefaultBrowsersForNpmInstall } = require('playwright-core/lib/server');
async function install() {
    await installDefaultBrowsersForNpmInstall();
}
install();
//# sourceMappingURL=installPlaywright.js.map
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/listNodeModules.ts]---
Location: vscode-main/build/azure-pipelines/common/listNodeModules.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';

if (process.argv.length !== 3) {
	console.error('Usage: node listNodeModules.ts OUTPUT_FILE');
	process.exit(-1);
}

const ROOT = path.join(import.meta.dirname, '../../../');

function findNodeModulesFiles(location: string, inNodeModules: boolean, result: string[]) {
	const entries = fs.readdirSync(path.join(ROOT, location));
	for (const entry of entries) {
		const entryPath = `${location}/${entry}`;

		if (/(^\/out)|(^\/src$)|(^\/.git$)|(^\/.build$)/.test(entryPath)) {
			continue;
		}

		let stat: fs.Stats;
		try {
			stat = fs.statSync(path.join(ROOT, entryPath));
		} catch (err) {
			continue;
		}

		if (stat.isDirectory()) {
			findNodeModulesFiles(entryPath, inNodeModules || (entry === 'node_modules'), result);
		} else {
			if (inNodeModules) {
				result.push(entryPath.substr(1));
			}
		}
	}
}

const result: string[] = [];
findNodeModulesFiles('', false, result);
fs.writeFileSync(process.argv[2], result.join('\n') + '\n');
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/publish-artifact.yml]---
Location: vscode-main/build/azure-pipelines/common/publish-artifact.yml

```yaml
parameters:
  - name: artifactName
    type: string
  - name: targetPath
    type: string
  - name: displayName
    type: string
    default: "Publish artifact"
  - name: sbomEnabled
    type: boolean
    default: true
  - name: sbomBuildDropPath
    type: string
    default: ""
  - name: sbomPackageName
    type: string
    default: ""
  - name: sbomPackageVersion
    type: string
    default: ""
  - name: condition
    type: string
    default: succeeded()
  - name: continueOnError
    type: boolean
    default: false

steps:
  - powershell: |
      $ArtifactName = "${{ parameters.artifactName }}"

      if ("$(Agent.JobStatus)" -notin @('Succeeded', 'SucceededWithIssues')) {
        $ArtifactName = "attempt$(System.JobAttempt)_$ArtifactName"
      }

      echo "##vso[task.setvariable variable=ARTIFACT_NAME]$ArtifactName"

      $NormalizedArtifactName = $ArtifactName.Replace('-', '_')
      echo "##vso[task.setvariable variable=NORMALIZED_ARTIFACT_NAME]$NormalizedArtifactName"
    condition: ${{ parameters.condition }}
    displayName: Generate artifact name

  - powershell: |
      $ErrorActionPreference = "Stop"

      $Uri = "$(System.TeamFoundationCollectionUri)$(System.TeamProject)/_apis/build/builds/$(Build.BuildId)/artifacts?api-version=6.0"

      try {
        $Headers = @{
          Authorization = "Bearer $(System.AccessToken)"
          'User-Agent' = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0'
          'Accept' = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
          'Accept-Encoding' = 'gzip, deflate, br'
          'Accept-Language' = 'en-US,en;q=0.9'
          'Referer' = 'https://dev.azure.com'
        }
        $Response = Invoke-RestMethod -Uri $Uri -Headers $Headers -Method Get
        Write-Host "API Response: $($Response | ConvertTo-Json -Depth 3)"
        $ArtifactExists = $Response.value | Where-Object { $_.name -eq "$(ARTIFACT_NAME)" }

        if ($ArtifactExists) {
          Write-Host "Artifact '$(ARTIFACT_NAME)' already exists, skipping publish"
          echo "##vso[task.setvariable variable=SHOULD_PUBLISH_ARTIFACT_$(NORMALIZED_ARTIFACT_NAME)]false"
        } else {
          Write-Host "Artifact '$(ARTIFACT_NAME)' does not exist, will publish"
          echo "##vso[task.setvariable variable=SHOULD_PUBLISH_ARTIFACT_$(NORMALIZED_ARTIFACT_NAME)]true"
        }
      } catch {
        Write-Host "Failed to check artifacts, will attempt to publish: $_"
        echo "##vso[task.setvariable variable=SHOULD_PUBLISH_ARTIFACT_$(NORMALIZED_ARTIFACT_NAME)]true"
      }
    condition: ${{ parameters.condition }}
    displayName: Check if artifact exists

  - task: 1ES.PublishPipelineArtifact@1
    inputs:
      targetPath: ${{ parameters.targetPath }}
      artifactName: $(ARTIFACT_NAME)
      sbomEnabled: ${{ parameters.sbomEnabled }}
      isProduction: ${{ parameters.sbomEnabled }}
      ${{ if ne(parameters.sbomBuildDropPath, '') }}:
        sbomBuildDropPath: ${{ parameters.sbomBuildDropPath }}
      ${{ if ne(parameters.sbomPackageName, '') }}:
        sbomPackageName: ${{ parameters.sbomPackageName }}
      ${{ if ne(parameters.sbomPackageVersion, '') }}:
        sbomPackageVersion: ${{ parameters.sbomPackageVersion }}
    condition: and(${{ parameters.condition }}, eq(variables[format('SHOULD_PUBLISH_ARTIFACT_{0}', variables.NORMALIZED_ARTIFACT_NAME)], 'true'))
    ${{ if ne(parameters.continueOnError, false) }}:
      continueOnError: ${{ parameters.continueOnError }}
    displayName: ${{ parameters.displayName }}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/publish.ts]---
Location: vscode-main/build/azure-pipelines/common/publish.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import type { ReadableStream } from 'stream/web';
import { pipeline } from 'node:stream/promises';
import yauzl from 'yauzl';
import crypto from 'crypto';
import { retry } from './retry.ts';
import { CosmosClient } from '@azure/cosmos';
import cp from 'child_process';
import os from 'os';
import { Worker, isMainThread, workerData } from 'node:worker_threads';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { BlobClient, BlobServiceClient, BlockBlobClient, ContainerClient, ContainerSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob';
import jws from 'jws';
import { clearInterval, setInterval } from 'node:timers';

export function e(name: string): string {
	const result = process.env[name];

	if (typeof result !== 'string') {
		throw new Error(`Missing env: ${name}`);
	}

	return result;
}

function hashStream(hashName: string, stream: Readable): Promise<Buffer> {
	return new Promise<Buffer>((c, e) => {
		const shasum = crypto.createHash(hashName);

		stream
			.on('data', shasum.update.bind(shasum))
			.on('error', e)
			.on('close', () => c(shasum.digest()));
	});
}

interface ReleaseSubmitResponse {
	operationId: string;
	esrpCorrelationId: string;
	code?: string;
	message?: string;
	target?: string;
	innerError?: any;
}

interface ReleaseActivityInfo {
	activityId: string;
	activityType: string;
	name: string;
	status: string;
	errorCode: number;
	errorMessages: string[];
	beginTime?: Date;
	endTime?: Date;
	lastModifiedAt?: Date;
}

interface InnerServiceError {
	code: string;
	details: { [key: string]: string };
	innerError?: InnerServiceError;
}

interface ReleaseError {
	errorCode: number;
	errorMessages: string[];
}

const StatusCode = Object.freeze({
	Pass: 'pass',
	Aborted: 'aborted',
	Inprogress: 'inprogress',
	FailCanRetry: 'failCanRetry',
	FailDoNotRetry: 'failDoNotRetry',
	PendingAnalysis: 'pendingAnalysis',
	Cancelled: 'cancelled'
});
type StatusCode = typeof StatusCode[keyof typeof StatusCode];

interface ReleaseResultMessage {
	activities: ReleaseActivityInfo[];
	childWorkflowType: string;
	clientId: string;
	customerCorrelationId: string;
	errorInfo: InnerServiceError;
	groupId: string;
	lastModifiedAt: Date;
	operationId: string;
	releaseError: ReleaseError;
	requestSubmittedAt: Date;
	routedRegion: string;
	status: StatusCode;
	totalFileCount: number;
	totalReleaseSize: number;
	version: string;
}

interface ReleaseFileInfo {
	name?: string;
	hash?: number[];
	sourceLocation?: FileLocation;
	sizeInBytes?: number;
	hashType?: FileHashType;
	fileId?: any;
	distributionRelativePath?: string;
	partNumber?: string;
	friendlyFileName?: string;
	tenantFileLocationType?: string;
	tenantFileLocation?: string;
	signedEngineeringCopyLocation?: string;
	encryptedDistributionBlobLocation?: string;
	preEncryptedDistributionBlobLocation?: string;
	secondaryDistributionHashRequired?: boolean;
	secondaryDistributionHashType?: FileHashType;
	lastModifiedAt?: Date;
	cultureCodes?: string[];
	displayFileInDownloadCenter?: boolean;
	isPrimaryFileInDownloadCenter?: boolean;
	fileDownloadDetails?: FileDownloadDetails[];
}

interface ReleaseDetailsFileInfo extends ReleaseFileInfo { }

interface ReleaseDetailsMessage extends ReleaseResultMessage {
	clusterRegion: string;
	correlationVector: string;
	releaseCompletedAt?: Date;
	releaseInfo: ReleaseInfo;
	productInfo: ProductInfo;
	createdBy: UserInfo;
	owners: OwnerInfo[];
	accessPermissionsInfo: AccessPermissionsInfo;
	files: ReleaseDetailsFileInfo[];
	comments: string[];
	cancellationReason: string;
	downloadCenterInfo: DownloadCenterInfo;
}


interface ProductInfo {
	name?: string;
	version?: string;
	description?: string;
}

interface ReleaseInfo {
	title?: string;
	minimumNumberOfApprovers: number;
	properties?: { [key: string]: string };
	isRevision?: boolean;
	revisionNumber?: string;
}

type FileLocationType = 'azureBlob';

interface FileLocation {
	type: FileLocationType;
	blobUrl: string;
	uncPath?: string;
	url?: string;
}

type FileHashType = 'sha256' | 'sha1';

interface FileDownloadDetails {
	portalName: string;
	downloadUrl: string;
}

interface RoutingInfo {
	intent?: string;
	contentType?: string;
	contentOrigin?: string;
	productState?: string;
	audience?: string;
}

interface ReleaseFileInfo {
	name?: string;
	hash?: number[];
	sourceLocation?: FileLocation;
	sizeInBytes?: number;
	hashType?: FileHashType;
	fileId?: any;
	distributionRelativePath?: string;
	partNumber?: string;
	friendlyFileName?: string;
	tenantFileLocationType?: string;
	tenantFileLocation?: string;
	signedEngineeringCopyLocation?: string;
	encryptedDistributionBlobLocation?: string;
	preEncryptedDistributionBlobLocation?: string;
	secondaryDistributionHashRequired?: boolean;
	secondaryDistributionHashType?: FileHashType;
	lastModifiedAt?: Date;
	cultureCodes?: string[];
	displayFileInDownloadCenter?: boolean;
	isPrimaryFileInDownloadCenter?: boolean;
	fileDownloadDetails?: FileDownloadDetails[];
}

interface UserInfo {
	userPrincipalName?: string;
}

interface OwnerInfo {
	owner: UserInfo;
}

interface ApproverInfo {
	approver: UserInfo;
	isAutoApproved: boolean;
	isMandatory: boolean;
}

interface AccessPermissionsInfo {
	mainPublisher?: string;
	releasePublishers?: string[];
	channelDownloadEntityDetails?: { [key: string]: string[] };
}

interface DownloadCenterLocaleInfo {
	cultureCode?: string;
	downloadTitle?: string;
	shortName?: string;
	shortDescription?: string;
	longDescription?: string;
	instructions?: string;
	additionalInfo?: string;
	keywords?: string[];
	version?: string;
	relatedLinks?: { [key: string]: URL };
}

interface DownloadCenterInfo {
	downloadCenterId: number;
	publishToDownloadCenter?: boolean;
	publishingGroup?: string;
	operatingSystems?: string[];
	relatedReleases?: string[];
	kbNumbers?: string[];
	sbNumbers?: string[];
	locales?: DownloadCenterLocaleInfo[];
	additionalProperties?: { [key: string]: string };
}

interface ReleaseRequestMessage {
	driEmail: string[];
	groupId?: string;
	customerCorrelationId: string;
	esrpCorrelationId: string;
	contextData?: { [key: string]: string };
	releaseInfo: ReleaseInfo;
	productInfo: ProductInfo;
	files: ReleaseFileInfo[];
	routingInfo?: RoutingInfo;
	createdBy: UserInfo;
	owners: OwnerInfo[];
	approvers: ApproverInfo[];
	accessPermissionsInfo: AccessPermissionsInfo;
	jwsToken?: string;
	publisherId?: string;
	downloadCenterInfo?: DownloadCenterInfo;
}

function getCertificateBuffer(input: string) {
	return Buffer.from(input.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, ''), 'base64');
}

function getThumbprint(input: string, algorithm: string): Buffer {
	const buffer = getCertificateBuffer(input);
	return crypto.createHash(algorithm).update(buffer).digest();
}

function getKeyFromPFX(pfx: string): string {
	const pfxCertificatePath = path.join(os.tmpdir(), 'cert.pfx');
	const pemKeyPath = path.join(os.tmpdir(), 'key.pem');

	try {
		const pfxCertificate = Buffer.from(pfx, 'base64');
		fs.writeFileSync(pfxCertificatePath, pfxCertificate);
		cp.execSync(`openssl pkcs12 -in "${pfxCertificatePath}" -nocerts -nodes -out "${pemKeyPath}" -passin pass:`);
		const raw = fs.readFileSync(pemKeyPath, 'utf-8');
		const result = raw.match(/-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----/g)![0];
		return result;
	} finally {
		fs.rmSync(pfxCertificatePath, { force: true });
		fs.rmSync(pemKeyPath, { force: true });
	}
}

function getCertificatesFromPFX(pfx: string): string[] {
	const pfxCertificatePath = path.join(os.tmpdir(), 'cert.pfx');
	const pemCertificatePath = path.join(os.tmpdir(), 'cert.pem');

	try {
		const pfxCertificate = Buffer.from(pfx, 'base64');
		fs.writeFileSync(pfxCertificatePath, pfxCertificate);
		cp.execSync(`openssl pkcs12 -in "${pfxCertificatePath}" -nokeys -out "${pemCertificatePath}" -passin pass:`);
		const raw = fs.readFileSync(pemCertificatePath, 'utf-8');
		const matches = raw.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g);
		return matches ? matches.reverse() : [];
	} finally {
		fs.rmSync(pfxCertificatePath, { force: true });
		fs.rmSync(pemCertificatePath, { force: true });
	}
}

class ESRPReleaseService {

	static async create(
		log: (...args: unknown[]) => void,
		tenantId: string,
		clientId: string,
		authCertificatePfx: string,
		requestSigningCertificatePfx: string,
		containerClient: ContainerClient,
		stagingSasToken: string
	) {
		const authKey = getKeyFromPFX(authCertificatePfx);
		const authCertificate = getCertificatesFromPFX(authCertificatePfx)[0];
		const requestSigningKey = getKeyFromPFX(requestSigningCertificatePfx);
		const requestSigningCertificates = getCertificatesFromPFX(requestSigningCertificatePfx);

		const app = new ConfidentialClientApplication({
			auth: {
				clientId,
				authority: `https://login.microsoftonline.com/${tenantId}`,
				clientCertificate: {
					thumbprintSha256: getThumbprint(authCertificate, 'sha256').toString('hex'),
					privateKey: authKey,
					x5c: authCertificate
				}
			}
		});

		const response = await app.acquireTokenByClientCredential({
			scopes: ['https://api.esrp.microsoft.com/.default']
		});

		return new ESRPReleaseService(log, clientId, response!.accessToken, requestSigningCertificates, requestSigningKey, containerClient, stagingSasToken);
	}

	private static API_URL = 'https://api.esrp.microsoft.com/api/v3/releaseservices/clients/';

	private readonly log: (...args: unknown[]) => void;
	private readonly clientId: string;
	private readonly accessToken: string;
	private readonly requestSigningCertificates: string[];
	private readonly requestSigningKey: string;
	private readonly containerClient: ContainerClient;
	private readonly stagingSasToken: string;

	private constructor(
		log: (...args: unknown[]) => void,
		clientId: string,
		accessToken: string,
		requestSigningCertificates: string[],
		requestSigningKey: string,
		containerClient: ContainerClient,
		stagingSasToken: string
	) {
		this.log = log;
		this.clientId = clientId;
		this.accessToken = accessToken;
		this.requestSigningCertificates = requestSigningCertificates;
		this.requestSigningKey = requestSigningKey;
		this.containerClient = containerClient;
		this.stagingSasToken = stagingSasToken;
	}

	async createRelease(version: string, filePath: string, friendlyFileName: string) {
		const correlationId = crypto.randomUUID();
		const blobClient = this.containerClient.getBlockBlobClient(correlationId);

		this.log(`Uploading ${filePath} to ${blobClient.url}`);
		await blobClient.uploadFile(filePath);
		this.log('Uploaded blob successfully');

		try {
			this.log(`Submitting release for ${version}: ${filePath}`);
			const submitReleaseResult = await this.submitRelease(version, filePath, friendlyFileName, correlationId, blobClient);

			this.log(`Successfully submitted release ${submitReleaseResult.operationId}. Polling for completion...`);

			// Poll every 5 seconds, wait 60 minutes max -> poll 60/5*60=720 times
			for (let i = 0; i < 720; i++) {
				await new Promise(c => setTimeout(c, 5000));
				const releaseStatus = await this.getReleaseStatus(submitReleaseResult.operationId);

				if (releaseStatus.status === 'pass') {
					break;
				} else if (releaseStatus.status === 'aborted') {
					this.log(JSON.stringify(releaseStatus));
					throw new Error(`Release was aborted`);
				} else if (releaseStatus.status !== 'inprogress') {
					this.log(JSON.stringify(releaseStatus));
					throw new Error(`Unknown error when polling for release`);
				}
			}

			const releaseDetails = await this.getReleaseDetails(submitReleaseResult.operationId);

			if (releaseDetails.status !== 'pass') {
				throw new Error(`Timed out waiting for release: ${JSON.stringify(releaseDetails)}`);
			}

			this.log('Successfully created release:', releaseDetails.files[0].fileDownloadDetails![0].downloadUrl);
			return releaseDetails.files[0].fileDownloadDetails![0].downloadUrl;
		} finally {
			this.log(`Deleting blob ${blobClient.url}`);
			await blobClient.delete();
			this.log('Deleted blob successfully');
		}
	}

	private async submitRelease(
		version: string,
		filePath: string,
		friendlyFileName: string,
		correlationId: string,
		blobClient: BlobClient
	): Promise<ReleaseSubmitResponse> {
		const size = fs.statSync(filePath).size;
		const hash = await hashStream('sha256', fs.createReadStream(filePath));
		const blobUrl = `${blobClient.url}?${this.stagingSasToken}`;

		const message: ReleaseRequestMessage = {
			customerCorrelationId: correlationId,
			esrpCorrelationId: correlationId,
			driEmail: ['joao.moreno@microsoft.com'],
			createdBy: { userPrincipalName: 'jomo@microsoft.com' },
			owners: [{ owner: { userPrincipalName: 'jomo@microsoft.com' } }],
			approvers: [{ approver: { userPrincipalName: 'jomo@microsoft.com' }, isAutoApproved: true, isMandatory: false }],
			releaseInfo: {
				title: 'VS Code',
				properties: {
					'ReleaseContentType': 'InstallPackage'
				},
				minimumNumberOfApprovers: 1
			},
			productInfo: {
				name: 'VS Code',
				version,
				description: 'VS Code'
			},
			accessPermissionsInfo: {
				mainPublisher: 'VSCode',
				channelDownloadEntityDetails: {
					AllDownloadEntities: ['VSCode']
				}
			},
			routingInfo: {
				intent: 'filedownloadlinkgeneration'
			},
			files: [{
				name: path.basename(filePath),
				friendlyFileName,
				tenantFileLocation: blobUrl,
				tenantFileLocationType: 'AzureBlob',
				sourceLocation: {
					type: 'azureBlob',
					blobUrl
				},
				hashType: 'sha256',
				hash: Array.from(hash),
				sizeInBytes: size
			}]
		};

		message.jwsToken = await this.generateJwsToken(message);

		const res = await fetch(`${ESRPReleaseService.API_URL}${this.clientId}/workflows/release/operations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.accessToken}`
			},
			body: JSON.stringify(message)
		});

		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to submit release: ${res.statusText}\n${text}`);
		}

		return await res.json() as ReleaseSubmitResponse;
	}

	private async getReleaseStatus(releaseId: string): Promise<ReleaseResultMessage> {
		const url = `${ESRPReleaseService.API_URL}${this.clientId}/workflows/release/operations/grs/${releaseId}`;

		const res = await retry(() => fetch(url, {
			headers: {
				'Authorization': `Bearer ${this.accessToken}`
			}
		}));

		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to get release status: ${res.statusText}\n${text}`);
		}

		return await res.json() as ReleaseResultMessage;
	}

	private async getReleaseDetails(releaseId: string): Promise<ReleaseDetailsMessage> {
		const url = `${ESRPReleaseService.API_URL}${this.clientId}/workflows/release/operations/grd/${releaseId}`;

		const res = await retry(() => fetch(url, {
			headers: {
				'Authorization': `Bearer ${this.accessToken}`
			}
		}));

		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Failed to get release status: ${res.statusText}\n${text}`);
		}

		return await res.json() as ReleaseDetailsMessage;
	}

	private async generateJwsToken(message: ReleaseRequestMessage): Promise<string> {
		// Create header with properly typed properties, then override x5c with the non-standard string format
		const header: jws.Header = {
			alg: 'RS256',
			crit: ['exp', 'x5t'],
			// Release service uses ticks, not seconds :roll_eyes: (https://stackoverflow.com/a/7968483)
			exp: ((Date.now() + (6 * 60 * 1000)) * 10000) + 621355968000000000,
			// Release service uses hex format, not base64url :roll_eyes:
			x5t: getThumbprint(this.requestSigningCertificates[0], 'sha1').toString('hex'),
		};

		// The Release service expects x5c as a '.' separated string, not the standard array format
		(header as Record<string, unknown>)['x5c'] = this.requestSigningCertificates.map(c => getCertificateBuffer(c).toString('base64url')).join('.');

		return jws.sign({
			header,
			payload: message,
			privateKey: this.requestSigningKey,
		});
	}
}

class State {

	private statePath: string;
	private set = new Set<string>();

	constructor() {
		const pipelineWorkspacePath = e('PIPELINE_WORKSPACE');
		const previousState = fs.readdirSync(pipelineWorkspacePath)
			.map(name => /^artifacts_processed_(\d+)$/.exec(name))
			.filter((match): match is RegExpExecArray => !!match)
			.map(match => ({ name: match![0], attempt: Number(match![1]) }))
			.sort((a, b) => b.attempt - a.attempt)[0];

		if (previousState) {
			const previousStatePath = path.join(pipelineWorkspacePath, previousState.name, previousState.name + '.txt');
			fs.readFileSync(previousStatePath, 'utf8').split(/\n/).filter(name => !!name).forEach(name => this.set.add(name));
		}

		const stageAttempt = e('SYSTEM_STAGEATTEMPT');
		this.statePath = path.join(pipelineWorkspacePath, `artifacts_processed_${stageAttempt}`, `artifacts_processed_${stageAttempt}.txt`);
		fs.mkdirSync(path.dirname(this.statePath), { recursive: true });
		fs.writeFileSync(this.statePath, [...this.set.values()].map(name => `${name}\n`).join(''));
	}

	get size(): number {
		return this.set.size;
	}

	has(name: string): boolean {
		return this.set.has(name);
	}

	add(name: string): void {
		this.set.add(name);
		fs.appendFileSync(this.statePath, `${name}\n`);
	}

	[Symbol.iterator](): IterableIterator<string> {
		return this.set[Symbol.iterator]();
	}
}

const azdoFetchOptions = {
	headers: {
		// Pretend we're a web browser to avoid download rate limits
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
		'Accept-Encoding': 'gzip, deflate, br',
		'Accept-Language': 'en-US,en;q=0.9',
		'Referer': 'https://dev.azure.com',
		Authorization: `Bearer ${e('SYSTEM_ACCESSTOKEN')}`
	}
};

export async function requestAZDOAPI<T>(path: string): Promise<T> {
	const abortController = new AbortController();
	const timeout = setTimeout(() => abortController.abort(), 2 * 60 * 1000);

	try {
		const res = await retry(() => fetch(`${e('BUILDS_API_URL')}${path}?api-version=6.0`, { ...azdoFetchOptions, signal: abortController.signal }));

		if (!res.ok) {
			throw new Error(`Unexpected status code: ${res.status}`);
		}

		return await res.json();
	} finally {
		clearTimeout(timeout);
	}
}

export interface Artifact {
	readonly name: string;
	readonly resource: {
		readonly downloadUrl: string;
		readonly properties: {
			readonly artifactsize: number;
		};
	};
}

async function getPipelineArtifacts(): Promise<Artifact[]> {
	const result = await requestAZDOAPI<{ readonly value: Artifact[] }>('artifacts');
	return result.value.filter(a => /^vscode_/.test(a.name) && !/sbom$/.test(a.name));
}

interface Timeline {
	readonly records: {
		readonly name: string;
		readonly type: string;
		readonly state: string;
		readonly result: string;
	}[];
}

async function getPipelineTimeline(): Promise<Timeline> {
	return await requestAZDOAPI<Timeline>('timeline');
}

async function downloadArtifact(artifact: Artifact, downloadPath: string): Promise<void> {
	const abortController = new AbortController();
	const timeout = setTimeout(() => abortController.abort(), 4 * 60 * 1000);

	try {
		const res = await fetch(artifact.resource.downloadUrl, { ...azdoFetchOptions, signal: abortController.signal });

		if (!res.ok) {
			throw new Error(`Unexpected status code: ${res.status}`);
		}

		await pipeline(Readable.fromWeb(res.body as ReadableStream), fs.createWriteStream(downloadPath));
	} finally {
		clearTimeout(timeout);
	}
}

async function unzip(packagePath: string, outputPath: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
		yauzl.open(packagePath, { lazyEntries: true, autoClose: true }, (err, zipfile) => {
			if (err) {
				return reject(err);
			}

			const result: string[] = [];
			zipfile!.on('entry', entry => {
				if (/\/$/.test(entry.fileName)) {
					zipfile!.readEntry();
				} else {
					zipfile!.openReadStream(entry, (err, istream) => {
						if (err) {
							return reject(err);
						}

						const filePath = path.join(outputPath, entry.fileName);
						fs.mkdirSync(path.dirname(filePath), { recursive: true });

						const ostream = fs.createWriteStream(filePath);
						ostream.on('finish', () => {
							result.push(filePath);
							zipfile!.readEntry();
						});
						istream?.on('error', err => reject(err));
						istream!.pipe(ostream);
					});
				}
			});

			zipfile!.on('close', () => resolve(result));
			zipfile!.readEntry();
		});
	});
}

interface Asset {
	platform: string;
	type: string;
	url: string;
	mooncakeUrl?: string;
	prssUrl?: string;
	hash: string;
	sha256hash: string;
	size: number;
	supportsFastUpdate?: boolean;
}

// Contains all of the logic for mapping details to our actual product names in CosmosDB
function getPlatform(product: string, os: string, arch: string, type: string): string {
	switch (os) {
		case 'win32':
			switch (product) {
				case 'client': {
					switch (type) {
						case 'archive':
							return `win32-${arch}-archive`;
						case 'setup':
							return `win32-${arch}`;
						case 'user-setup':
							return `win32-${arch}-user`;
						default:
							throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
					}
				}
				case 'server':
					return `server-win32-${arch}`;
				case 'web':
					return `server-win32-${arch}-web`;
				case 'cli':
					return `cli-win32-${arch}`;
				default:
					throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
			}
		case 'alpine':
			switch (product) {
				case 'server':
					return `server-alpine-${arch}`;
				case 'web':
					return `server-alpine-${arch}-web`;
				case 'cli':
					return `cli-alpine-${arch}`;
				default:
					throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
			}
		case 'linux':
			switch (type) {
				case 'snap':
					return `linux-snap-${arch}`;
				case 'archive-unsigned':
					switch (product) {
						case 'client':
							return `linux-${arch}`;
						case 'server':
							return `server-linux-${arch}`;
						case 'web':
							if (arch === 'standalone') {
								return 'web-standalone';
							}
							return `server-linux-${arch}-web`;
						default:
							throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
					}
				case 'deb-package':
					return `linux-deb-${arch}`;
				case 'rpm-package':
					return `linux-rpm-${arch}`;
				case 'cli':
					return `cli-linux-${arch}`;
				default:
					throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
			}
		case 'darwin':
			switch (product) {
				case 'client':
					if (arch === 'x64') {
						return 'darwin';
					}
					return `darwin-${arch}`;
				case 'server':
					if (arch === 'x64') {
						return 'server-darwin';
					}
					return `server-darwin-${arch}`;
				case 'web':
					if (arch === 'x64') {
						return 'server-darwin-web';
					}
					return `server-darwin-${arch}-web`;
				case 'cli':
					return `cli-darwin-${arch}`;
				default:
					throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
			}
		default:
			throw new Error(`Unrecognized: ${product} ${os} ${arch} ${type}`);
	}
}

// Contains all of the logic for mapping types to our actual types in CosmosDB
function getRealType(type: string) {
	switch (type) {
		case 'user-setup':
			return 'setup';
		case 'deb-package':
		case 'rpm-package':
			return 'package';
		default:
			return type;
	}
}

async function withLease<T>(client: BlockBlobClient, fn: () => Promise<T>) {
	const lease = client.getBlobLeaseClient();

	for (let i = 0; i < 360; i++) { // Try to get lease for 30 minutes
		try {
			await client.uploadData(new ArrayBuffer()); // blob needs to exist for lease to be acquired
			await lease.acquireLease(60);

			try {
				const abortController = new AbortController();
				const refresher = new Promise<void>((c, e) => {
					abortController.signal.onabort = () => {
						clearInterval(interval);
						c();
					};

					const interval = setInterval(() => {
						lease.renewLease().catch(err => {
							clearInterval(interval);
							e(new Error('Failed to renew lease ' + err));
						});
					}, 30_000);
				});

				const result = await Promise.race([fn(), refresher]);
				abortController.abort();
				return result;
			} finally {
				await lease.releaseLease();
			}
		} catch (err) {
			if (err.statusCode !== 409 && err.statusCode !== 412) {
				throw err;
			}

			await new Promise(c => setTimeout(c, 5000));
		}
	}

	throw new Error('Failed to acquire lease on blob after 30 minutes');
}

async function processArtifact(
	artifact: Artifact,
	filePath: string
) {
	const log = (...args: unknown[]) => console.log(`[${artifact.name}]`, ...args);
	const match = /^vscode_(?<product>[^_]+)_(?<os>[^_]+)(?:_legacy)?_(?<arch>[^_]+)_(?<unprocessedType>[^_]+)$/.exec(artifact.name);

	if (!match) {
		throw new Error(`Invalid artifact name: ${artifact.name}`);
	}

	const { cosmosDBAccessToken, blobServiceAccessToken } = JSON.parse(e('PUBLISH_AUTH_TOKENS'));
	const quality = e('VSCODE_QUALITY');
	const version = e('BUILD_SOURCEVERSION');
	const friendlyFileName = `${quality}/${version}/${path.basename(filePath)}`;

	const blobServiceClient = new BlobServiceClient(`https://${e('VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net/`, { getToken: async () => blobServiceAccessToken });
	const leasesContainerClient = blobServiceClient.getContainerClient('leases');
	await leasesContainerClient.createIfNotExists();
	const leaseBlobClient = leasesContainerClient.getBlockBlobClient(friendlyFileName);

	log(`Acquiring lease for: ${friendlyFileName}`);

	await withLease(leaseBlobClient, async () => {
		log(`Successfully acquired lease for: ${friendlyFileName}`);

		const url = `${e('PRSS_CDN_URL')}/${friendlyFileName}`;
		const res = await retry(() => fetch(url));

		if (res.status === 200) {
			log(`Already released and provisioned: ${url}`);
		} else {
			const stagingContainerClient = blobServiceClient.getContainerClient('staging');
			await stagingContainerClient.createIfNotExists();

			const now = new Date().valueOf();
			const oneHour = 60 * 60 * 1000;
			const oneHourAgo = new Date(now - oneHour);
			const oneHourFromNow = new Date(now + oneHour);
			const userDelegationKey = await blobServiceClient.getUserDelegationKey(oneHourAgo, oneHourFromNow);
			const sasOptions = { containerName: 'staging', permissions: ContainerSASPermissions.from({ read: true }), startsOn: oneHourAgo, expiresOn: oneHourFromNow };
			const stagingSasToken = generateBlobSASQueryParameters(sasOptions, userDelegationKey, e('VSCODE_STAGING_BLOB_STORAGE_ACCOUNT_NAME')).toString();

			const releaseService = await ESRPReleaseService.create(
				log,
				e('RELEASE_TENANT_ID'),
				e('RELEASE_CLIENT_ID'),
				e('RELEASE_AUTH_CERT'),
				e('RELEASE_REQUEST_SIGNING_CERT'),
				stagingContainerClient,
				stagingSasToken
			);

			await releaseService.createRelease(version, filePath, friendlyFileName);
		}

		const { product, os, arch, unprocessedType } = match.groups!;
		const platform = getPlatform(product, os, arch, unprocessedType);
		const type = getRealType(unprocessedType);
		const size = fs.statSync(filePath).size;
		const stream = fs.createReadStream(filePath);
		const [hash, sha256hash] = await Promise.all([hashStream('sha1', stream), hashStream('sha256', stream)]); // CodeQL [SM04514] Using SHA1 only for legacy reasons, we are actually only respecting SHA256
		const asset: Asset = { platform, type, url, hash: hash.toString('hex'), sha256hash: sha256hash.toString('hex'), size, supportsFastUpdate: true };
		log('Creating asset...');

		const result = await retry(async (attempt) => {
			log(`Creating asset in Cosmos DB (attempt ${attempt})...`);
			const client = new CosmosClient({ endpoint: e('AZURE_DOCUMENTDB_ENDPOINT')!, tokenProvider: () => Promise.resolve(`type=aad&ver=1.0&sig=${cosmosDBAccessToken.token}`) });
			const scripts = client.database('builds').container(quality).scripts;
			const { resource: result } = await scripts.storedProcedure('createAsset').execute<'ok' | 'already exists'>('', [version, asset, true]);
			return result;
		});

		if (result === 'already exists') {
			log('Asset already exists!');
		} else {
			log('Asset successfully created: ', JSON.stringify(asset, undefined, 2));
		}
	});

	log(`Successfully released lease for: ${friendlyFileName}`);
}

// It is VERY important that we don't download artifacts too much too fast from AZDO.
// AZDO throttles us SEVERELY if we do. Not just that, but they also close open
// sockets, so the whole things turns to a grinding halt. So, downloading and extracting
// happens serially in the main thread, making the downloads are spaced out
// properly. For each extracted artifact, we spawn a worker thread to upload it to
// the CDN and finally update the build in Cosmos DB.
async function main() {
	if (!isMainThread) {
		const { artifact, artifactFilePath } = workerData;
		await processArtifact(artifact, artifactFilePath);
		return;
	}

	const done = new State();
	const processing = new Set<string>();

	for (const name of done) {
		console.log(`\u2705 ${name}`);
	}

	const stages = new Set<string>(['Compile']);

	if (
		e('VSCODE_BUILD_STAGE_LINUX') === 'True' ||
		e('VSCODE_BUILD_STAGE_ALPINE') === 'True' ||
		e('VSCODE_BUILD_STAGE_MACOS') === 'True' ||
		e('VSCODE_BUILD_STAGE_WINDOWS') === 'True'
	) {
		stages.add('CompileCLI');
	}

	if (e('VSCODE_BUILD_STAGE_WINDOWS') === 'True') { stages.add('Windows'); }
	if (e('VSCODE_BUILD_STAGE_LINUX') === 'True') { stages.add('Linux'); }
	if (e('VSCODE_BUILD_STAGE_ALPINE') === 'True') { stages.add('Alpine'); }
	if (e('VSCODE_BUILD_STAGE_MACOS') === 'True') { stages.add('macOS'); }
	if (e('VSCODE_BUILD_STAGE_WEB') === 'True') { stages.add('Web'); }

	let timeline: Timeline;
	let artifacts: Artifact[];
	let resultPromise = Promise.resolve<PromiseSettledResult<void>[]>([]);
	const operations: { name: string; operation: Promise<void> }[] = [];

	while (true) {
		[timeline, artifacts] = await Promise.all([retry(() => getPipelineTimeline()), retry(() => getPipelineArtifacts())]);
		const stagesCompleted = new Set<string>(timeline.records.filter(r => r.type === 'Stage' && r.state === 'completed' && stages.has(r.name)).map(r => r.name));
		const stagesInProgress = [...stages].filter(s => !stagesCompleted.has(s));
		const artifactsInProgress = artifacts.filter(a => processing.has(a.name));

		if (stagesInProgress.length === 0 && artifacts.length === done.size + processing.size) {
			break;
		} else if (stagesInProgress.length > 0) {
			console.log('Stages in progress:', stagesInProgress.join(', '));
		} else if (artifactsInProgress.length > 0) {
			console.log('Artifacts in progress:', artifactsInProgress.map(a => a.name).join(', '));
		} else {
			console.log(`Waiting for a total of ${artifacts.length}, ${done.size} done, ${processing.size} in progress...`);
		}

		for (const artifact of artifacts) {
			if (done.has(artifact.name) || processing.has(artifact.name)) {
				continue;
			}

			console.log(`[${artifact.name}] Found new artifact`);

			const artifactZipPath = path.join(e('AGENT_TEMPDIRECTORY'), `${artifact.name}.zip`);

			await retry(async (attempt) => {
				const start = Date.now();
				console.log(`[${artifact.name}] Downloading (attempt ${attempt})...`);
				await downloadArtifact(artifact, artifactZipPath);
				const archiveSize = fs.statSync(artifactZipPath).size;
				const downloadDurationS = (Date.now() - start) / 1000;
				const downloadSpeedKBS = Math.round((archiveSize / 1024) / downloadDurationS);
				console.log(`[${artifact.name}] Successfully downloaded after ${Math.floor(downloadDurationS)} seconds(${downloadSpeedKBS} KB/s).`);
			});

			const artifactFilePaths = await unzip(artifactZipPath, e('AGENT_TEMPDIRECTORY'));
			const artifactFilePath = artifactFilePaths.filter(p => !/_manifest/.test(p))[0];

			processing.add(artifact.name);
			const promise = new Promise<void>((resolve, reject) => {
				const worker = new Worker(import.meta.filename, { workerData: { artifact, artifactFilePath } });
				worker.on('error', reject);
				worker.on('exit', code => {
					if (code === 0) {
						resolve();
					} else {
						reject(new Error(`[${artifact.name}] Worker stopped with exit code ${code}`));
					}
				});
			});

			const operation = promise.then(() => {
				processing.delete(artifact.name);
				done.add(artifact.name);
				console.log(`\u2705 ${artifact.name} `);
			});

			operations.push({ name: artifact.name, operation });
			resultPromise = Promise.allSettled(operations.map(o => o.operation));
		}

		await new Promise(c => setTimeout(c, 10_000));
	}

	console.log(`Found all ${done.size + processing.size} artifacts, waiting for ${processing.size} artifacts to finish publishing...`);

	const artifactsInProgress = operations.filter(o => processing.has(o.name));

	if (artifactsInProgress.length > 0) {
		console.log('Artifacts in progress:', artifactsInProgress.map(a => a.name).join(', '));
	}

	const results = await resultPromise;

	for (let i = 0; i < operations.length; i++) {
		const result = results[i];

		if (result.status === 'rejected') {
			console.error(`[${operations[i].name}]`, result.reason);
		}
	}

	// Fail the job if any of the artifacts failed to publish
	if (results.some(r => r.status === 'rejected')) {
		throw new Error('Some artifacts failed to publish');
	}

	// Also fail the job if any of the stages did not succeed
	let shouldFail = false;

	for (const stage of stages) {
		const record = timeline.records.find(r => r.name === stage && r.type === 'Stage')!;

		if (record.result !== 'succeeded' && record.result !== 'succeededWithIssues') {
			shouldFail = true;
			console.error(`Stage ${stage} did not succeed: ${record.result}`);
		}
	}

	if (shouldFail) {
		throw new Error('Some stages did not succeed');
	}

	console.log(`All ${done.size} artifacts published!`);
}

if (import.meta.main) {
	main().then(() => {
		process.exit(0);
	}, err => {
		console.error(err);
		process.exit(1);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/releaseBuild.ts]---
Location: vscode-main/build/azure-pipelines/common/releaseBuild.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CosmosClient } from '@azure/cosmos';
import { retry } from './retry.ts';

function getEnv(name: string): string {
	const result = process.env[name];

	if (typeof result === 'undefined') {
		throw new Error('Missing env: ' + name);
	}

	return result;
}

interface Config {
	id: string;
	frozen: boolean;
}

function createDefaultConfig(quality: string): Config {
	return {
		id: quality,
		frozen: false
	};
}

async function getConfig(client: CosmosClient, quality: string): Promise<Config> {
	const query = `SELECT TOP 1 * FROM c WHERE c.id = "${quality}"`;

	const res = await client.database('builds').container('config').items.query(query).fetchAll();

	if (res.resources.length === 0) {
		return createDefaultConfig(quality);
	}

	return res.resources[0] as Config;
}

async function main(force: boolean): Promise<void> {
	const commit = getEnv('BUILD_SOURCEVERSION');
	const quality = getEnv('VSCODE_QUALITY');
	const { cosmosDBAccessToken } = JSON.parse(getEnv('PUBLISH_AUTH_TOKENS'));
	const client = new CosmosClient({ endpoint: process.env['AZURE_DOCUMENTDB_ENDPOINT']!, tokenProvider: () => Promise.resolve(`type=aad&ver=1.0&sig=${cosmosDBAccessToken.token}`) });

	if (!force) {
		const config = await getConfig(client, quality);

		console.log('Quality config:', config);

		if (config.frozen) {
			console.log(`Skipping release because quality ${quality} is frozen.`);
			return;
		}
	}

	console.log(`Releasing build ${commit}...`);

	let rolloutDurationMs = undefined;

	// If the build is insiders or exploration, start a rollout of 4 hours
	if (quality === 'insider') {
		rolloutDurationMs = 4 * 60 * 60 * 1000; // 4 hours
	}

	const scripts = client.database('builds').container(quality).scripts;
	await retry(() => scripts.storedProcedure('releaseBuild').execute('', [commit, rolloutDurationMs]));
}

const [, , force] = process.argv;

console.log(process.argv);

main(/^true$/i.test(force)).then(() => {
	console.log('Build successfully released');
	process.exit(0);
}, err => {
	console.error(err);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/retry.ts]---
Location: vscode-main/build/azure-pipelines/common/retry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export async function retry<T>(fn: (attempt: number) => Promise<T>): Promise<T> {
	let lastError: Error | undefined;

	for (let run = 1; run <= 10; run++) {
		try {
			return await fn(run);
		} catch (err) {
			if (!/fetch failed|terminated|aborted|timeout|TimeoutError|Timeout Error|RestError|Client network socket disconnected|socket hang up|ECONNRESET|CredentialUnavailableError|endpoints_resolution_error|Audience validation failed|end of central directory record signature not found/i.test(err.message)) {
				throw err;
			}

			lastError = err;

			// maximum delay is 10th retry: ~3 seconds
			const millis = Math.floor((Math.random() * 200) + (50 * Math.pow(1.5, run)));
			await new Promise(c => setTimeout(c, millis));
		}
	}

	console.error(`Too many retries, aborting.`);
	throw lastError;
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/sign-win32.ts]---
Location: vscode-main/build/azure-pipelines/common/sign-win32.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { main } from './sign.ts';
import path from 'path';

main([
	process.env['EsrpCliDllPath']!,
	'sign-windows',
	path.dirname(process.argv[2]),
	path.basename(process.argv[2])
]);
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/sign.ts]---
Location: vscode-main/build/azure-pipelines/common/sign.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import cp from 'child_process';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import os from 'os';

export class Temp {
	private _files: string[] = [];

	tmpNameSync(): string {
		const file = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'));
		this._files.push(file);
		return file;
	}

	dispose(): void {
		for (const file of this._files) {
			try {
				fs.unlinkSync(file);
			} catch (err) {
				// noop
			}
		}
	}
}

interface Params {
	readonly keyCode: string;
	readonly operationSetCode: string;
	readonly parameters: {
		readonly parameterName: string;
		readonly parameterValue: string;
	}[];
	readonly toolName: string;
	readonly toolVersion: string;
}

function getParams(type: string): Params[] {
	switch (type) {
		case 'sign-windows':
			return [
				{
					keyCode: 'CP-230012',
					operationSetCode: 'SigntoolSign',
					parameters: [
						{ parameterName: 'OpusName', parameterValue: 'VS Code' },
						{ parameterName: 'OpusInfo', parameterValue: 'https://code.visualstudio.com/' },
						{ parameterName: 'Append', parameterValue: '/as' },
						{ parameterName: 'FileDigest', parameterValue: '/fd "SHA256"' },
						{ parameterName: 'PageHash', parameterValue: '/NPH' },
						{ parameterName: 'TimeStamp', parameterValue: '/tr "http://rfc3161.gtm.corp.microsoft.com/TSS/HttpTspServer" /td sha256' }
					],
					toolName: 'sign',
					toolVersion: '1.0'
				},
				{
					keyCode: 'CP-230012',
					operationSetCode: 'SigntoolVerify',
					parameters: [
						{ parameterName: 'VerifyAll', parameterValue: '/all' }
					],
					toolName: 'sign',
					toolVersion: '1.0'
				}
			];
		case 'sign-windows-appx':
			return [
				{
					keyCode: 'CP-229979',
					operationSetCode: 'SigntoolSign',
					parameters: [
						{ parameterName: 'OpusName', parameterValue: 'VS Code' },
						{ parameterName: 'OpusInfo', parameterValue: 'https://code.visualstudio.com/' },
						{ parameterName: 'FileDigest', parameterValue: '/fd "SHA256"' },
						{ parameterName: 'PageHash', parameterValue: '/NPH' },
						{ parameterName: 'TimeStamp', parameterValue: '/tr "http://rfc3161.gtm.corp.microsoft.com/TSS/HttpTspServer" /td sha256' }
					],
					toolName: 'sign',
					toolVersion: '1.0'
				},
				{
					keyCode: 'CP-229979',
					operationSetCode: 'SigntoolVerify',
					parameters: [],
					toolName: 'sign',
					toolVersion: '1.0'
				}
			];
		case 'sign-pgp':
			return [{
				keyCode: 'CP-450779-Pgp',
				operationSetCode: 'LinuxSign',
				parameters: [],
				toolName: 'sign',
				toolVersion: '1.0'
			}];
		case 'sign-darwin':
			return [{
				keyCode: 'CP-401337-Apple',
				operationSetCode: 'MacAppDeveloperSign',
				parameters: [{ parameterName: 'Hardening', parameterValue: '--options=runtime' }],
				toolName: 'sign',
				toolVersion: '1.0'
			}];
		case 'notarize-darwin':
			return [{
				keyCode: 'CP-401337-Apple',
				operationSetCode: 'MacAppNotarize',
				parameters: [],
				toolName: 'sign',
				toolVersion: '1.0'
			}];
		case 'nuget':
			return [{
				keyCode: 'CP-401405',
				operationSetCode: 'NuGetSign',
				parameters: [],
				toolName: 'sign',
				toolVersion: '1.0'
			}, {
				keyCode: 'CP-401405',
				operationSetCode: 'NuGetVerify',
				parameters: [],
				toolName: 'sign',
				toolVersion: '1.0'
			}];
		default:
			throw new Error(`Sign type ${type} not found`);
	}
}

export function main([esrpCliPath, type, folderPath, pattern]: string[]) {
	const tmp = new Temp();
	process.on('exit', () => tmp.dispose());

	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	const encryptedToken = cipher.update(process.env['SYSTEM_ACCESSTOKEN']!.trim(), 'utf8', 'hex') + cipher.final('hex');

	const encryptionDetailsPath = tmp.tmpNameSync();
	fs.writeFileSync(encryptionDetailsPath, JSON.stringify({ key: key.toString('hex'), iv: iv.toString('hex') }));

	const encryptedTokenPath = tmp.tmpNameSync();
	fs.writeFileSync(encryptedTokenPath, encryptedToken);

	const patternPath = tmp.tmpNameSync();
	fs.writeFileSync(patternPath, pattern);

	const paramsPath = tmp.tmpNameSync();
	fs.writeFileSync(paramsPath, JSON.stringify(getParams(type)));

	const dotnetVersion = cp.execSync('dotnet --version', { encoding: 'utf8' }).trim();
	const adoTaskVersion = path.basename(path.dirname(path.dirname(esrpCliPath)));

	const federatedTokenData = {
		jobId: process.env['SYSTEM_JOBID'],
		planId: process.env['SYSTEM_PLANID'],
		projectId: process.env['SYSTEM_TEAMPROJECTID'],
		hub: process.env['SYSTEM_HOSTTYPE'],
		uri: process.env['SYSTEM_COLLECTIONURI'],
		managedIdentityId: process.env['VSCODE_ESRP_CLIENT_ID'],
		managedIdentityTenantId: process.env['VSCODE_ESRP_TENANT_ID'],
		serviceConnectionId: process.env['VSCODE_ESRP_SERVICE_CONNECTION_ID'],
		tempDirectory: os.tmpdir(),
		systemAccessToken: encryptedTokenPath,
		encryptionKey: encryptionDetailsPath
	};

	const args = [
		esrpCliPath,
		'vsts.sign',
		'-a', process.env['ESRP_CLIENT_ID']!,
		'-d', process.env['ESRP_TENANT_ID']!,
		'-k', JSON.stringify({ akv: 'vscode-esrp' }),
		'-z', JSON.stringify({ akv: 'vscode-esrp', cert: 'esrp-sign' }),
		'-f', folderPath,
		'-p', patternPath,
		'-u', 'false',
		'-x', 'regularSigning',
		'-b', 'input.json',
		'-l', 'AzSecPack_PublisherPolicyProd.xml',
		'-y', 'inlineSignParams',
		'-j', paramsPath,
		'-c', '9997',
		'-t', '120',
		'-g', '10',
		'-v', 'Tls12',
		'-s', 'https://api.esrp.microsoft.com/api/v1',
		'-m', '0',
		'-o', 'Microsoft',
		'-i', 'https://www.microsoft.com',
		'-n', '5',
		'-r', 'true',
		'-w', dotnetVersion,
		'-skipAdoReportAttachment', 'false',
		'-pendingAnalysisWaitTimeoutMinutes', '5',
		'-adoTaskVersion', adoTaskVersion,
		'-resourceUri', 'https://msazurecloud.onmicrosoft.com/api.esrp.microsoft.com',
		'-esrpClientId', process.env['ESRP_CLIENT_ID']!,
		'-useMSIAuthentication', 'true',
		'-federatedTokenData', JSON.stringify(federatedTokenData)
	];

	try {
		cp.execFileSync('dotnet', args, { stdio: 'inherit' });
	} catch (err) {
		console.error('ESRP failed');
		console.error(err);
		process.exit(1);
	}
}

if (import.meta.main) {
	main(process.argv.slice(2));
	process.exit(0);
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/telemetry-config.json]---
Location: vscode-main/build/azure-pipelines/common/telemetry-config.json

```json
[
	{
		"eventPrefix": "typescript-language-features/",
		"sourceDirs": [
			"../../s/extensions/typescript-language-features"
		],
		"excludedDirs": [],
		"applyEndpoints": true
	},
	{
		"eventPrefix": "git/",
		"sourceDirs": [
			"../../s/extensions/git"
		],
		"excludedDirs": [],
		"applyEndpoints": true
	},
	{
		"eventPrefix": "extension-telemetry/",
		"sourceDirs": [
			"vscode-extension-telemetry"
		],
		"excludedDirs": [],
		"applyEndpoints": true
	},
	{
		"eventPrefix": "vscode-markdown/",
		"sourceDirs": [
			"../../s/extensions/markdown-language-features"
		],
		"excludedDirs": [],
		"applyEndpoints": true
	},
	{
		"eventPrefix": "html-language-features/",
		"sourceDirs": [
			"../../s/extensions/html-language-features",
			"vscode-html-languageservice"
		],
		"excludedDirs": [],
		"applyEndpoints": true
	},
	{
		"eventPrefix": "json-language-features/",
		"sourceDirs": [
			"../../s/extensions/json-language-features",
			"vscode-json-languageservice"
		],
		"excludedDirs": [],
		"applyEndpoints": true
	},
	{
		"eventPrefix": "ms-vscode.node/",
		"sourceDirs": [
			"vscode-chrome-debug-core",
			"vscode-node-debug"
		],
		"excludedDirs": [],
		"applyEndpoints": true,
		"patchDebugEvents": true
	}
]
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/common/waitForArtifacts.ts]---
Location: vscode-main/build/azure-pipelines/common/waitForArtifacts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { type Artifact, requestAZDOAPI } from '../common/publish.ts';
import { retry } from '../common/retry.ts';

async function getPipelineArtifacts(): Promise<Artifact[]> {
	const result = await requestAZDOAPI<{ readonly value: Artifact[] }>('artifacts');
	return result.value.filter(a => !/sbom$/.test(a.name));
}

async function main(artifacts: string[]): Promise<void> {
	if (artifacts.length === 0) {
		throw new Error(`Usage: node waitForArtifacts.ts <artifactName1> <artifactName2> ...`);
	}

	// This loop will run for 30 minutes and waits to the x64 and arm64 artifacts
	// to be uploaded to the pipeline by the `macOS` and `macOSARM64` jobs. As soon
	// as these artifacts are found, the loop completes and the `macOSUnivesrsal`
	// job resumes.
	for (let index = 0; index < 60; index++) {
		try {
			console.log(`Waiting for artifacts (${artifacts.join(', ')}) to be uploaded (${index + 1}/60)...`);
			const allArtifacts = await retry(() => getPipelineArtifacts());
			console.log(`  * Artifacts attached to the pipelines: ${allArtifacts.length > 0 ? allArtifacts.map(a => a.name).join(', ') : 'none'}`);

			const foundArtifacts = allArtifacts.filter(a => artifacts.includes(a.name));
			console.log(`  * Found artifacts: ${foundArtifacts.length > 0 ? foundArtifacts.map(a => a.name).join(', ') : 'none'}`);

			if (foundArtifacts.length === artifacts.length) {
				console.log(`  * All artifacts were found`);
				return;
			}
		} catch (err) {
			console.error(`ERROR: Failed to get pipeline artifacts: ${err}`);
		}

		await new Promise(c => setTimeout(c, 30_000));
	}

	throw new Error(`ERROR: Artifacts (${artifacts.join(', ')}) were not uploaded within 30 minutes.`);
}

main(process.argv.splice(2)).then(() => {
	process.exit(0);
}, err => {
	console.error(err);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/config/CredScanSuppressions.json]---
Location: vscode-main/build/azure-pipelines/config/CredScanSuppressions.json

```json
{
	"tool": "Credential Scanner",
	"suppressions": [
		{
			"file": [
				"src/vs/base/test/common/uri.test.ts",
				"src/vs/workbench/api/test/browser/extHostTelemetry.test.ts",
				"src/vs/base/test/common/yaml.test.ts"
			],
			"_justification": "These are dummy credentials in tests."
		},
		{
			"file": [
				".build/linux/deb/amd64/code-amd64/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/amd64/code-amd64/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/deb/armhf/code-armhf/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/armhf/code-armhf/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/deb/arm64/code-arm64/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/arm64/code-arm64/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/x86_64/rpmbuild/BUILD/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/x86_64/rpmbuild/BUILD/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/armv7hl/rpmbuild/BUILD/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/armv7hl/rpmbuild/BUILD/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/aarch64/rpmbuild/BUILD/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/aarch64/rpmbuild/BUILD/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-x64/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-x64/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-x64/stage/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-x64/stage/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-x64/prime/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-x64/prime/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-x64/parts/code/build/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-x64/parts/code/install/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-x64/parts/code/src/usr/share/code/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-x64/parts/code/build/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-x64/parts/code/install/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-x64/parts/code/src/usr/share/code/resources/app/extensions/emmet/dist/node/emmetNodeMain.js"
			],
			"_justification": "These are safe to ignore, since they are built artifacts (stable)."
		},
		{
			"file": [
				".build/linux/deb/amd64/code-insiders-amd64/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/amd64/code-insiders-amd64/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/deb/armhf/code-insiders-armhf/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/armhf/code-insiders-armhf/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/deb/arm64/code-insiders-arm64/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/arm64/code-insiders-arm64/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/x86_64/rpmbuild/BUILD/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/x86_64/rpmbuild/BUILD/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/armv7hl/rpmbuild/BUILD/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/armv7hl/rpmbuild/BUILD/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/aarch64/rpmbuild/BUILD/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/aarch64/rpmbuild/BUILD/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-insiders-x64/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-insiders-x64/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-insiders-x64/stage/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-insiders-x64/stage/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-insiders-x64/prime/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-insiders-x64/prime/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-insiders-x64/parts/code/build/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-insiders-x64/parts/code/install/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-insiders-x64/parts/code/src/usr/share/code-insiders/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-insiders-x64/parts/code/build/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-insiders-x64/parts/code/install/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-insiders-x64/parts/code/src/usr/share/code-insiders/resources/app/extensions/emmet/dist/node/emmetNodeMain.js"
			],
			"_justification": "These are safe to ignore, since they are built artifacts (insiders)."
		},
		{
			"file": [
				".build/linux/deb/amd64/code-exploration-amd64/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/amd64/code-exploration-amd64/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/deb/armhf/code-exploration-armhf/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/armhf/code-exploration-armhf/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/deb/arm64/code-exploration-arm64/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/deb/arm64/code-exploration-arm64/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/x86_64/rpmbuild/BUILD/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/x86_64/rpmbuild/BUILD/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/armv7hl/rpmbuild/BUILD/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/armv7hl/rpmbuild/BUILD/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/rpm/aarch64/rpmbuild/BUILD/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/rpm/aarch64/rpmbuild/BUILD/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-exploration-x64/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-exploration-x64/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-exploration-x64/stage/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-exploration-x64/stage/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-exploration-x64/prime/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-exploration-x64/prime/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-exploration-x64/parts/code/build/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-exploration-x64/parts/code/install/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-exploration-x64/parts/code/src/usr/share/code-exploration/resources/app/extensions/github-authentication/dist/extension.js",
				".build/linux/snap/x64/code-exploration-x64/parts/code/build/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-exploration-x64/parts/code/install/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js",
				".build/linux/snap/x64/code-exploration-x64/parts/code/src/usr/share/code-exploration/resources/app/extensions/emmet/dist/node/emmetNodeMain.js"
			],
			"_justification": "These are safe to ignore, since they are built artifacts (exploration)."
		},
		{
			"file": [
				".build/web/extensions/github-authentication/dist/browser/extension.js",
				".build/web/extensions/emmet/dist/browser/emmetBrowserMain.js.map",
				".build/web/extensions/emmet/dist/browser/emmetBrowserMain.js"
			],
			"_justification": "These are safe to ignore, since they are built artifacts (web)."
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/config/tsaoptions.json]---
Location: vscode-main/build/azure-pipelines/config/tsaoptions.json

```json
{
	"codebaseName": "devdiv_microsoft_vscode",
	"serviceTreeID": "79c048b2-322f-4ed5-a1ea-252a1250e4b3",
	"instanceUrl": "https://devdiv.visualstudio.com/defaultcollection",
	"projectName": "DevDiv",
	"areaPath": "DevDiv\\VS Code (compliance tracking only)\\Visual Studio Code Client",
	"notificationAliases": [
		"monacotools@microsoft.com"
	],
	"validateToolOutput": "None",
	"allTools": true
}
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/app-entitlements.plist]---
Location: vscode-main/build/azure-pipelines/darwin/app-entitlements.plist

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.device.audio-input</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
    <key>com.apple.security.automation.apple-events</key>
    <true/>
</dict>
</plist>
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/codesign.ts]---
Location: vscode-main/build/azure-pipelines/darwin/codesign.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { printBanner, spawnCodesignProcess, streamProcessOutputAndCheckResult } from '../common/codesign.ts';
import { e } from '../common/publish.ts';

async function main() {
	const arch = e('VSCODE_ARCH');
	const esrpCliDLLPath = e('EsrpCliDllPath');
	const pipelineWorkspace = e('PIPELINE_WORKSPACE');

	const folder = `${pipelineWorkspace}/vscode_client_darwin_${arch}_archive`;
	const glob = `VSCode-darwin-${arch}.zip`;

	// Codesign
	printBanner('Codesign');
	const codeSignTask = spawnCodesignProcess(esrpCliDLLPath, 'sign-darwin', folder, glob);
	await streamProcessOutputAndCheckResult('Codesign', codeSignTask);

	// Notarize
	printBanner('Notarize');
	const notarizeTask = spawnCodesignProcess(esrpCliDLLPath, 'notarize-darwin', folder, glob);
	await streamProcessOutputAndCheckResult('Notarize', notarizeTask);
}

main().then(() => {
	process.exit(0);
}, err => {
	console.error(`ERROR: ${err}`);
	process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/helper-gpu-entitlements.plist]---
Location: vscode-main/build/azure-pipelines/darwin/helper-gpu-entitlements.plist

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
</dict>
</plist>
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/helper-plugin-entitlements.plist]---
Location: vscode-main/build/azure-pipelines/darwin/helper-plugin-entitlements.plist

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.cs.allow-jit</key>
	<true/>
	<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
	<true/>
	<key>com.apple.security.cs.disable-library-validation</key>
	<true/>
</dict>
</plist>
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/helper-renderer-entitlements.plist]---
Location: vscode-main/build/azure-pipelines/darwin/helper-renderer-entitlements.plist

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
</dict>
</plist>
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/product-build-darwin-ci.yml]---
Location: vscode-main/build/azure-pipelines/darwin/product-build-darwin-ci.yml

```yaml
parameters:
  - name: VSCODE_CIBUILD
    type: boolean
  - name: VSCODE_TEST_SUITE
    type: string

jobs:
  - job: macOS${{ parameters.VSCODE_TEST_SUITE }}
    displayName: ${{ parameters.VSCODE_TEST_SUITE }} Tests
    timeoutInMinutes: 30
    variables:
      VSCODE_ARCH: arm64
    templateContext:
      outputs:
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/.build/crashes
          artifactName: crash-dump-macos-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Crash Reports
          sbomEnabled: false
          isProduction: false
          condition: failed()
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/node_modules
          artifactName: node-modules-macos-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Node Modules
          sbomEnabled: false
          isProduction: false
          condition: failed()
        - output: pipelineArtifact
          targetPath: $(Build.SourcesDirectory)/.build/logs
          artifactName: logs-macos-$(VSCODE_ARCH)-${{ lower(parameters.VSCODE_TEST_SUITE) }}-$(System.JobAttempt)
          displayName: Publish Log Files
          sbomEnabled: false
          isProduction: false
          condition: succeededOrFailed()
    steps:
      - template: ./steps/product-build-darwin-compile.yml@self
        parameters:
          VSCODE_ARCH: arm64
          VSCODE_CIBUILD: ${{ parameters.VSCODE_CIBUILD }}
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Electron') }}:
            VSCODE_RUN_ELECTRON_TESTS: true
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Browser') }}:
            VSCODE_RUN_BROWSER_TESTS: true
          ${{ if eq(parameters.VSCODE_TEST_SUITE, 'Remote') }}:
            VSCODE_RUN_REMOTE_TESTS: true
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/product-build-darwin-cli-sign.yml]---
Location: vscode-main/build/azure-pipelines/darwin/product-build-darwin-cli-sign.yml

```yaml
parameters:
  - name: VSCODE_BUILD_MACOS
    type: boolean
  - name: VSCODE_BUILD_MACOS_ARM64
    type: boolean

jobs:
  - job: macOSCLISign
    timeoutInMinutes: 90
    templateContext:
      outputParentDirectory: $(Build.ArtifactStagingDirectory)/out
      outputs:
        - ${{ if eq(parameters.VSCODE_BUILD_MACOS, true) }}:
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_cli_darwin_x64_cli/vscode_cli_darwin_x64_cli.zip
            artifactName: vscode_cli_darwin_x64_cli
            displayName: Publish signed artifact with ID vscode_cli_darwin_x64_cli
            sbomBuildDropPath: $(Build.ArtifactStagingDirectory)/sign/unsigned_vscode_cli_darwin_x64_cli
            sbomPackageName: "VS Code macOS x64 CLI"
            sbomPackageVersion: $(Build.SourceVersion)
        - ${{ if eq(parameters.VSCODE_BUILD_MACOS_ARM64, true) }}:
          - output: pipelineArtifact
            targetPath: $(Build.ArtifactStagingDirectory)/out/vscode_cli_darwin_arm64_cli/vscode_cli_darwin_arm64_cli.zip
            artifactName: vscode_cli_darwin_arm64_cli
            displayName: Publish signed artifact with ID vscode_cli_darwin_arm64_cli
            sbomBuildDropPath: $(Build.ArtifactStagingDirectory)/sign/unsigned_vscode_cli_darwin_arm64_cli
            sbomPackageName: "VS Code macOS arm64 CLI"
            sbomPackageVersion: $(Build.SourceVersion)
    steps:
      - template: ../common/checkout.yml@self

      - task: NodeTool@0
        inputs:
          versionSource: fromFile
          versionFilePath: .nvmrc

      - task: AzureKeyVault@2
        displayName: "Azure Key Vault: Get Secrets"
        inputs:
          azureSubscription: vscode
          KeyVaultName: vscode-build-secrets
          SecretsFilter: "github-distro-mixin-password"

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

      - template: ./steps/product-build-darwin-cli-sign.yml@self
        parameters:
          VSCODE_CLI_ARTIFACTS:
            - ${{ if eq(parameters.VSCODE_BUILD_MACOS, true) }}:
              - unsigned_vscode_cli_darwin_x64_cli
            - ${{ if eq(parameters.VSCODE_BUILD_MACOS_ARM64, true) }}:
              - unsigned_vscode_cli_darwin_arm64_cli
```

--------------------------------------------------------------------------------

---[FILE: build/azure-pipelines/darwin/product-build-darwin-cli.yml]---
Location: vscode-main/build/azure-pipelines/darwin/product-build-darwin-cli.yml

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
- job: macOSCLI_${{ parameters.VSCODE_ARCH }}
  displayName: macOS (${{ upper(parameters.VSCODE_ARCH) }})
  timeoutInMinutes: 60
  pool:
    name: AcesShared
    os: macOS
  variables:
    # todo@connor4312 to diagnose build flakes
    MSRUSTUP_LOG: debug
    VSCODE_ARCH: ${{ parameters.VSCODE_ARCH }}
  templateContext:
    outputs:
      - ${{ if not(parameters.VSCODE_CHECK_ONLY) }}:
        - output: pipelineArtifact
          targetPath: $(Build.ArtifactStagingDirectory)/unsigned_vscode_cli_darwin_$(VSCODE_ARCH)_cli.zip
          artifactName: unsigned_vscode_cli_darwin_$(VSCODE_ARCH)_cli
          displayName: Publish unsigned_vscode_cli_darwin_$(VSCODE_ARCH)_cli artifact
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

    - script: |
        set -e
        mkdir $(Build.ArtifactStagingDirectory)/openssl
        tar -xvzf $(Build.ArtifactStagingDirectory)/vscode-internal-openssl-prebuilt-0.0.11.tgz --strip-components=1 --directory=$(Build.ArtifactStagingDirectory)/openssl
      displayName: Extract openssl prebuilt

    - template: ../cli/install-rust-posix.yml@self
      parameters:
        targets:
          - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
            - x86_64-apple-darwin
          - ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
            - aarch64-apple-darwin

    - ${{ if eq(parameters.VSCODE_ARCH, 'x64') }}:
      - template: ../cli/cli-compile.yml@self
        parameters:
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          VSCODE_CLI_TARGET: x86_64-apple-darwin
          VSCODE_CLI_ARTIFACT: unsigned_vscode_cli_darwin_x64_cli
          VSCODE_CHECK_ONLY: ${{ parameters.VSCODE_CHECK_ONLY }}
          VSCODE_CLI_ENV:
            OPENSSL_LIB_DIR: $(Build.ArtifactStagingDirectory)/openssl/x64-osx/lib
            OPENSSL_INCLUDE_DIR: $(Build.ArtifactStagingDirectory)/openssl/x64-osx/include

    - ${{ if eq(parameters.VSCODE_ARCH, 'arm64') }}:
      - template: ../cli/cli-compile.yml@self
        parameters:
          VSCODE_QUALITY: ${{ parameters.VSCODE_QUALITY }}
          VSCODE_CLI_TARGET: aarch64-apple-darwin
          VSCODE_CLI_ARTIFACT: unsigned_vscode_cli_darwin_arm64_cli
          VSCODE_CHECK_ONLY: ${{ parameters.VSCODE_CHECK_ONLY }}
          VSCODE_CLI_ENV:
            OPENSSL_LIB_DIR: $(Build.ArtifactStagingDirectory)/openssl/arm64-osx/lib
            OPENSSL_INCLUDE_DIR: $(Build.ArtifactStagingDirectory)/openssl/arm64-osx/include
```

--------------------------------------------------------------------------------

````
