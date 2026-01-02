---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 270
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 270 of 552)

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

---[FILE: src/vs/platform/extensionManagement/node/extensionTipsService.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/node/extensionTipsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionManagementService } from '../common/extensionManagement.js';
import { IFileService } from '../../files/common/files.js';
import { IProductService } from '../../product/common/productService.js';
import { INativeEnvironmentService } from '../../environment/common/environment.js';
import { IExtensionRecommendationNotificationService } from '../../extensionRecommendations/common/extensionRecommendations.js';
import { INativeHostService } from '../../native/common/native.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { AbstractNativeExtensionTipsService } from '../common/extensionTipsService.js';

export class ExtensionTipsService extends AbstractNativeExtensionTipsService {

	constructor(
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IStorageService storageService: IStorageService,
		@INativeHostService nativeHostService: INativeHostService,
		@IExtensionRecommendationNotificationService extensionRecommendationNotificationService: IExtensionRecommendationNotificationService,
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
	) {
		super(environmentService.userHome, nativeHostService, telemetryService, extensionManagementService, storageService, extensionRecommendationNotificationService, fileService, productService);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/test/common/allowedExtensionsService.test.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/test/common/allowedExtensionsService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { AllowedExtensionsService } from '../../common/allowedExtensionsService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IProductService } from '../../../product/common/productService.js';
import { TestConfigurationService } from '../../../configuration/test/common/testConfigurationService.js';
import { AllowedExtensionsConfigKey, IGalleryExtension, ILocalExtension } from '../../common/extensionManagement.js';
import { ExtensionType, IExtensionManifest, TargetPlatform } from '../../../extensions/common/extensions.js';
import { Event } from '../../../../base/common/event.js';
import { ConfigurationTarget } from '../../../configuration/common/configuration.js';
import { getGalleryExtensionId } from '../../common/extensionManagementUtil.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { URI } from '../../../../base/common/uri.js';
import { IStringDictionary } from '../../../../base/common/collections.js';

suite('AllowedExtensionsService', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	const configurationService = new TestConfigurationService();

	setup(() => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, '*');
	});

	test('should allow all extensions if no allowed extensions are configured', () => {
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }) === true, true);
	});

	test('should not allow specific extension if not in allowed list', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': false });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }) === true, false);
	});

	test('should allow specific extension if in allowed list', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }) === true, true);
	});

	test('should not allow pre-release extension if only stable is allowed', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': 'stable' });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, prerelease: true }) === true, false);
	});

	test('should allow pre-release extension if pre-release is allowed', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, prerelease: true }) === true, true);
	});

	test('should allow specific version of an extension when configured to that version', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.2.3'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3' }) === true, true);
	});

	test('should allow any version of an extension when a specific version is configured', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.2.3'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }) === true, true);
	});

	test('should allow any version of an extension when stable is configured', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': 'stable' });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }) === true, true);
	});

	test('should allow a version of an extension when stable is configured', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': 'stable' });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3' }) === true, true);
	});

	test('should allow a pre-release version of an extension when stable is configured', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': 'stable' });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3', prerelease: true }) === true, false);
	});

	test('should allow specific version of an extension when configured to multiple versions', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.2.3', '2.0.1', '3.1.2'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3' }) === true, true);
	});

	test('should allow platform specific version of an extension when configured to platform specific version', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.2.3@darwin-x64'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3', targetPlatform: TargetPlatform.DARWIN_X64 }) === true, true);
	});

	test('should allow universal platform specific version of an extension when configured to platform specific version', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.2.3@darwin-x64'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3', targetPlatform: TargetPlatform.UNIVERSAL }) === true, true);
	});

	test('should allow specific version of an extension when configured to platform specific version', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.2.3@darwin-x64'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3' }) === true, true);
	});

	test('should allow platform specific version of an extension when configured to multiple versions', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.0.0', '1.2.3@darwin-x64', '1.2.3@darwin-arm64'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3', targetPlatform: TargetPlatform.DARWIN_X64 }) === true, true);
	});

	test('should not allow platform specific version of an extension when configured to different platform specific version', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.2.3@darwin-x64'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.2.3', targetPlatform: TargetPlatform.DARWIN_ARM64 }) === true, false);
	});

	test('should specific version of an extension when configured to different versions', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test.extension': ['1.0.0', '1.2.3@darwin-x64', '1.2.3@darwin-arm64'] });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, version: '1.0.1' }) === true, false);
	});

	test('should allow extension if publisher is in allowed list', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }), true);
	});

	test('should allow extension if publisher is not in allowed list and has publisher mapping', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'hello': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(['hello']), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: 'Hello' }), true);
	});

	test('should allow extension if publisher is not in allowed list and has different publisher mapping', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'hello': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(['bar']), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: 'Hello' }) === true, false);
	});

	test('should not allow extension if publisher is not in allowed list', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test': false });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }) === true, false);
	});

	test('should not allow prerelease extension if publisher is allowed only to stable', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test': 'stable' });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, prerelease: true }) === true, false);
	});

	test('should allow extension if publisher is set to random value', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'test': 'hello' });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined, prerelease: true }) === true, true);
	});

	test('should allow extension if only wildcard is in allowed list', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { '*': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }), true);
	});

	test('should allow extension if wildcard is in allowed list', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { '*': true, 'hello': false });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }), true);
	});

	test('should not allow extension if wildcard is not in allowed list', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { '*': false, 'hello': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed({ id: 'test.extension', publisherDisplayName: undefined }) === true, false);
	});

	test('should allow a gallery extension', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'pub': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed(aGalleryExtension('name')) === true, true);
	});

	test('should allow a local extension', () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { 'pub': true });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		assert.strictEqual(testObject.isAllowed(aLocalExtension('pub.name')) === true, true);
	});

	test('should trigger change event when allowed list change', async () => {
		configurationService.setUserConfiguration(AllowedExtensionsConfigKey, { '*': false });
		const testObject = disposables.add(new AllowedExtensionsService(aProductService(), configurationService));
		const promise = Event.toPromise(testObject.onDidChangeAllowedExtensionsConfigValue);
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: () => true, affectedKeys: new Set([AllowedExtensionsConfigKey]), change: { keys: [], overrides: [] }, source: ConfigurationTarget.USER });
		await promise;
	});

	function aProductService(extensionPublisherOrgs?: string[]): IProductService {
		return {
			_serviceBrand: undefined,
			extensionPublisherOrgs
		} as IProductService;
	}

	function aGalleryExtension(name: string, properties: Partial<IGalleryExtension> = {}, galleryExtensionProperties: IStringDictionary<unknown> = {}): IGalleryExtension {
		const galleryExtension = <IGalleryExtension>Object.create({ type: 'gallery', name, publisher: 'pub', publisherDisplayName: 'Pub', version: '1.0.0', allTargetPlatforms: [TargetPlatform.UNIVERSAL], properties: {}, assets: {}, isSigned: true, ...properties });
		galleryExtension.properties = { ...galleryExtension.properties, dependencies: [], ...galleryExtensionProperties };
		galleryExtension.identifier = { id: getGalleryExtensionId(galleryExtension.publisher, galleryExtension.name), uuid: generateUuid() };
		return <IGalleryExtension>galleryExtension;
	}

	function aLocalExtension(id: string, manifest: Partial<IExtensionManifest> = {}, properties: IStringDictionary<unknown> = {}): ILocalExtension {
		const [publisher, name] = id.split('.');
		manifest = { name, publisher, ...manifest };
		properties = {
			identifier: { id },
			location: URI.file(`pub.${name}`),
			galleryIdentifier: { id, uuid: undefined },
			type: ExtensionType.User,
			...properties,
			isValid: properties.isValid ?? true,
		};
		properties.isBuiltin = properties.type === ExtensionType.System;
		return <ILocalExtension>Object.create({ manifest, ...properties });
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/test/common/configRemotes.test.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/test/common/configRemotes.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { getDomainsOfRemotes, getRemotes } from '../../common/configRemotes.js';

suite('Config Remotes', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const allowedDomains = [
		'github.com',
		'github2.com',
		'github3.com',
		'example.com',
		'example2.com',
		'example3.com',
		'server.org',
		'server2.org',
	];

	test('HTTPS remotes', function () {
		assert.deepStrictEqual(getDomainsOfRemotes(remote('https://github.com/microsoft/vscode.git'), allowedDomains), ['github.com']);
		assert.deepStrictEqual(getDomainsOfRemotes(remote('https://git.example.com/gitproject.git'), allowedDomains), ['example.com']);
		assert.deepStrictEqual(getDomainsOfRemotes(remote('https://username@github2.com/username/repository.git'), allowedDomains), ['github2.com']);
		assert.deepStrictEqual(getDomainsOfRemotes(remote('https://username:password@github3.com/username/repository.git'), allowedDomains), ['github3.com']);
		assert.deepStrictEqual(getDomainsOfRemotes(remote('https://username:password@example2.com:1234/username/repository.git'), allowedDomains), ['example2.com']);
		assert.deepStrictEqual(getDomainsOfRemotes(remote('https://example3.com:1234/username/repository.git'), allowedDomains), ['example3.com']);
	});

	test('SSH remotes', function () {
		assert.deepStrictEqual(getDomainsOfRemotes(remote('ssh://user@git.server.org/project.git'), allowedDomains), ['server.org']);
	});

	test('SCP-like remotes', function () {
		assert.deepStrictEqual(getDomainsOfRemotes(remote('git@github.com:microsoft/vscode.git'), allowedDomains), ['github.com']);
		assert.deepStrictEqual(getDomainsOfRemotes(remote('user@git.server.org:project.git'), allowedDomains), ['server.org']);
		assert.deepStrictEqual(getDomainsOfRemotes(remote('git.server2.org:project.git'), allowedDomains), ['server2.org']);
	});

	test('Local remotes', function () {
		assert.deepStrictEqual(getDomainsOfRemotes(remote('/opt/git/project.git'), allowedDomains), []);
		assert.deepStrictEqual(getDomainsOfRemotes(remote('file:///opt/git/project.git'), allowedDomains), []);
	});

	test('Multiple remotes', function () {
		const config = ['https://github.com/microsoft/vscode.git', 'https://git.example.com/gitproject.git'].map(remote).join('');
		assert.deepStrictEqual(getDomainsOfRemotes(config, allowedDomains).sort(), ['example.com', 'github.com']);
	});

	test('Non allowed domains are anonymized', () => {
		const config = ['https://github.com/microsoft/vscode.git', 'https://git.foobar.com/gitproject.git'].map(remote).join('');
		assert.deepStrictEqual(getDomainsOfRemotes(config, allowedDomains).sort(), ['aaaaaa.aaa', 'github.com']);
	});

	test('HTTPS remotes to be hashed', function () {
		assert.deepStrictEqual(getRemotes(remote('https://github.com/microsoft/vscode.git')), ['github.com/microsoft/vscode.git']);
		assert.deepStrictEqual(getRemotes(remote('https://git.example.com/gitproject.git')), ['git.example.com/gitproject.git']);
		assert.deepStrictEqual(getRemotes(remote('https://username@github2.com/username/repository.git')), ['github2.com/username/repository.git']);
		assert.deepStrictEqual(getRemotes(remote('https://username:password@github3.com/username/repository.git')), ['github3.com/username/repository.git']);
		assert.deepStrictEqual(getRemotes(remote('https://username:password@example2.com:1234/username/repository.git')), ['example2.com/username/repository.git']);
		assert.deepStrictEqual(getRemotes(remote('https://example3.com:1234/username/repository.git')), ['example3.com/username/repository.git']);

		// Strip .git
		assert.deepStrictEqual(getRemotes(remote('https://github.com/microsoft/vscode.git'), true), ['github.com/microsoft/vscode']);
		assert.deepStrictEqual(getRemotes(remote('https://git.example.com/gitproject.git'), true), ['git.example.com/gitproject']);
		assert.deepStrictEqual(getRemotes(remote('https://username@github2.com/username/repository.git'), true), ['github2.com/username/repository']);
		assert.deepStrictEqual(getRemotes(remote('https://username:password@github3.com/username/repository.git'), true), ['github3.com/username/repository']);
		assert.deepStrictEqual(getRemotes(remote('https://username:password@example2.com:1234/username/repository.git'), true), ['example2.com/username/repository']);
		assert.deepStrictEqual(getRemotes(remote('https://example3.com:1234/username/repository.git'), true), ['example3.com/username/repository']);

		// Compare Striped .git with no .git
		assert.deepStrictEqual(getRemotes(remote('https://github.com/microsoft/vscode.git'), true), getRemotes(remote('https://github.com/microsoft/vscode')));
		assert.deepStrictEqual(getRemotes(remote('https://git.example.com/gitproject.git'), true), getRemotes(remote('https://git.example.com/gitproject')));
		assert.deepStrictEqual(getRemotes(remote('https://username@github2.com/username/repository.git'), true), getRemotes(remote('https://username@github2.com/username/repository')));
		assert.deepStrictEqual(getRemotes(remote('https://username:password@github3.com/username/repository.git'), true), getRemotes(remote('https://username:password@github3.com/username/repository')));
		assert.deepStrictEqual(getRemotes(remote('https://username:password@example2.com:1234/username/repository.git'), true), getRemotes(remote('https://username:password@example2.com:1234/username/repository')));
		assert.deepStrictEqual(getRemotes(remote('https://example3.com:1234/username/repository.git'), true), getRemotes(remote('https://example3.com:1234/username/repository')));
	});

	test('SSH remotes to be hashed', function () {
		assert.deepStrictEqual(getRemotes(remote('ssh://user@git.server.org/project.git')), ['git.server.org/project.git']);

		// Strip .git
		assert.deepStrictEqual(getRemotes(remote('ssh://user@git.server.org/project.git'), true), ['git.server.org/project']);

		// Compare Striped .git with no .git
		assert.deepStrictEqual(getRemotes(remote('ssh://user@git.server.org/project.git'), true), getRemotes(remote('ssh://user@git.server.org/project')));
	});

	test('SCP-like remotes to be hashed', function () {
		assert.deepStrictEqual(getRemotes(remote('git@github.com:microsoft/vscode.git')), ['github.com/microsoft/vscode.git']);
		assert.deepStrictEqual(getRemotes(remote('user@git.server.org:project.git')), ['git.server.org/project.git']);
		assert.deepStrictEqual(getRemotes(remote('git.server2.org:project.git')), ['git.server2.org/project.git']);

		// Strip .git
		assert.deepStrictEqual(getRemotes(remote('git@github.com:microsoft/vscode.git'), true), ['github.com/microsoft/vscode']);
		assert.deepStrictEqual(getRemotes(remote('user@git.server.org:project.git'), true), ['git.server.org/project']);
		assert.deepStrictEqual(getRemotes(remote('git.server2.org:project.git'), true), ['git.server2.org/project']);

		// Compare Striped .git with no .git
		assert.deepStrictEqual(getRemotes(remote('git@github.com:microsoft/vscode.git'), true), getRemotes(remote('git@github.com:microsoft/vscode')));
		assert.deepStrictEqual(getRemotes(remote('user@git.server.org:project.git'), true), getRemotes(remote('user@git.server.org:project')));
		assert.deepStrictEqual(getRemotes(remote('git.server2.org:project.git'), true), getRemotes(remote('git.server2.org:project')));
	});

	test('Local remotes to be hashed', function () {
		assert.deepStrictEqual(getRemotes(remote('/opt/git/project.git')), []);
		assert.deepStrictEqual(getRemotes(remote('file:///opt/git/project.git')), []);
	});

	test('Multiple remotes to be hashed', function () {
		const config = ['https://github.com/microsoft/vscode.git', 'https://git.example.com/gitproject.git'].map(remote).join(' ');
		assert.deepStrictEqual(getRemotes(config), ['github.com/microsoft/vscode.git', 'git.example.com/gitproject.git']);

		// Strip .git
		assert.deepStrictEqual(getRemotes(config, true), ['github.com/microsoft/vscode', 'git.example.com/gitproject']);

		// Compare Striped .git with no .git
		const noDotGitConfig = ['https://github.com/microsoft/vscode', 'https://git.example.com/gitproject'].map(remote).join(' ');
		assert.deepStrictEqual(getRemotes(config, true), getRemotes(noDotGitConfig));
	});

	function remote(url: string): string {
		return `[remote "origin"]
	url = ${url}
	fetch = +refs/heads/*:refs/remotes/origin/*
`;
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/test/common/extensionGalleryService.test.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/test/common/extensionGalleryService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { isUUID } from '../../../../base/common/uuid.js';
import { mock } from '../../../../base/test/common/mock.js';
import { IConfigurationService } from '../../../configuration/common/configuration.js';
import { TestConfigurationService } from '../../../configuration/test/common/testConfigurationService.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { IRawGalleryExtensionVersion, sortExtensionVersions, filterLatestExtensionVersionsForTargetPlatform } from '../../common/extensionGalleryService.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { NullLogService } from '../../../log/common/log.js';
import product from '../../../product/common/product.js';
import { IProductService } from '../../../product/common/productService.js';
import { resolveMarketplaceHeaders } from '../../../externalServices/common/marketplace.js';
import { InMemoryStorageService, IStorageService } from '../../../storage/common/storage.js';
import { TelemetryConfiguration, TELEMETRY_SETTING_ID } from '../../../telemetry/common/telemetry.js';
import { TargetPlatform } from '../../../extensions/common/extensions.js';
import { NullTelemetryService } from '../../../telemetry/common/telemetryUtils.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

class EnvironmentServiceMock extends mock<IEnvironmentService>() {
	override readonly serviceMachineIdResource: URI;
	constructor(serviceMachineIdResource: URI) {
		super();
		this.serviceMachineIdResource = serviceMachineIdResource;
		this.isBuilt = true;
	}
}

suite('Extension Gallery Service', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let fileService: IFileService, environmentService: IEnvironmentService, storageService: IStorageService, productService: IProductService, configurationService: IConfigurationService;

	setup(() => {
		const serviceMachineIdResource = joinPath(URI.file('tests').with({ scheme: 'vscode-tests' }), 'machineid');
		environmentService = new EnvironmentServiceMock(serviceMachineIdResource);
		fileService = disposables.add(new FileService(new NullLogService()));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(serviceMachineIdResource.scheme, fileSystemProvider));
		storageService = disposables.add(new InMemoryStorageService());
		configurationService = new TestConfigurationService({ [TELEMETRY_SETTING_ID]: TelemetryConfiguration.ON });
		configurationService.updateValue(TELEMETRY_SETTING_ID, TelemetryConfiguration.ON);
		productService = { _serviceBrand: undefined, ...product, enableTelemetry: true };
	});

	test('marketplace machine id', async () => {
		const headers = await resolveMarketplaceHeaders(product.version, productService, environmentService, configurationService, fileService, storageService, NullTelemetryService);
		assert.ok(headers['X-Market-User-Id']);
		assert.ok(isUUID(headers['X-Market-User-Id']));
		const headers2 = await resolveMarketplaceHeaders(product.version, productService, environmentService, configurationService, fileService, storageService, NullTelemetryService);
		assert.strictEqual(headers['X-Market-User-Id'], headers2['X-Market-User-Id']);
	});

	test('sorting single extension version without target platform', async () => {
		const actual = [aExtensionVersion('1.1.2')];
		const expected = [...actual];
		sortExtensionVersions(actual, TargetPlatform.DARWIN_X64);
		assert.deepStrictEqual(actual, expected);
	});

	test('sorting single extension version with preferred target platform', async () => {
		const actual = [aExtensionVersion('1.1.2', TargetPlatform.DARWIN_X64)];
		const expected = [...actual];
		sortExtensionVersions(actual, TargetPlatform.DARWIN_X64);
		assert.deepStrictEqual(actual, expected);
	});

	test('sorting single extension version with not compatible target platform', async () => {
		const actual = [aExtensionVersion('1.1.2', TargetPlatform.DARWIN_ARM64)];
		const expected = [...actual];
		sortExtensionVersions(actual, TargetPlatform.WIN32_X64);
		assert.deepStrictEqual(actual, expected);
	});

	test('sorting multiple extension versions without target platforms', async () => {
		const actual = [aExtensionVersion('1.2.4'), aExtensionVersion('1.1.3'), aExtensionVersion('1.1.2'), aExtensionVersion('1.1.1')];
		const expected = [...actual];
		sortExtensionVersions(actual, TargetPlatform.WIN32_ARM64);
		assert.deepStrictEqual(actual, expected);
	});

	test('sorting multiple extension versions with target platforms - 1', async () => {
		const actual = [aExtensionVersion('1.2.4', TargetPlatform.DARWIN_ARM64), aExtensionVersion('1.2.4', TargetPlatform.WIN32_ARM64), aExtensionVersion('1.2.4', TargetPlatform.LINUX_ARM64), aExtensionVersion('1.1.3'), aExtensionVersion('1.1.2'), aExtensionVersion('1.1.1')];
		const expected = [actual[1], actual[0], actual[2], actual[3], actual[4], actual[5]];
		sortExtensionVersions(actual, TargetPlatform.WIN32_ARM64);
		assert.deepStrictEqual(actual, expected);
	});

	test('sorting multiple extension versions with target platforms - 2', async () => {
		const actual = [aExtensionVersion('1.2.4'), aExtensionVersion('1.2.3', TargetPlatform.DARWIN_ARM64), aExtensionVersion('1.2.3', TargetPlatform.WIN32_ARM64), aExtensionVersion('1.2.3', TargetPlatform.LINUX_ARM64), aExtensionVersion('1.1.2'), aExtensionVersion('1.1.1')];
		const expected = [actual[0], actual[3], actual[1], actual[2], actual[4], actual[5]];
		sortExtensionVersions(actual, TargetPlatform.LINUX_ARM64);
		assert.deepStrictEqual(actual, expected);
	});

	test('sorting multiple extension versions with target platforms - 3', async () => {
		const actual = [aExtensionVersion('1.2.4'), aExtensionVersion('1.1.2'), aExtensionVersion('1.1.1'), aExtensionVersion('1.0.0', TargetPlatform.DARWIN_ARM64), aExtensionVersion('1.0.0', TargetPlatform.WIN32_ARM64)];
		const expected = [actual[0], actual[1], actual[2], actual[4], actual[3]];
		sortExtensionVersions(actual, TargetPlatform.WIN32_ARM64);
		assert.deepStrictEqual(actual, expected);
	});

	function aExtensionVersion(version: string, targetPlatform?: TargetPlatform): IRawGalleryExtensionVersion {
		return { version, targetPlatform } as IRawGalleryExtensionVersion;
	}

	function aPreReleaseExtensionVersion(version: string, targetPlatform?: TargetPlatform): IRawGalleryExtensionVersion {
		return {
			version,
			targetPlatform,
			properties: [{ key: 'Microsoft.VisualStudio.Code.PreRelease', value: 'true' }]
		} as IRawGalleryExtensionVersion;
	}

	suite('filterLatestExtensionVersionsForTargetPlatform', () => {

		test('should return empty array for empty input', () => {
			const result = filterLatestExtensionVersionsForTargetPlatform([], TargetPlatform.WIN32_X64, [TargetPlatform.WIN32_X64]);
			assert.deepStrictEqual(result, []);
		});

		test('should return single version when only one version provided', () => {
			const versions = [aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64)];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];
			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);
			assert.deepStrictEqual(result, versions);
		});

		test('should include both release and pre-release versions for same platform', () => {
			const version1 = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64);
			const version2 = aPreReleaseExtensionVersion('0.9.0', TargetPlatform.WIN32_X64); // Different version number
			const versions = [version1, version2];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should include both since they have different version numbers
			assert.strictEqual(result.length, 2);
			assert.strictEqual(result[0], version1);
			assert.strictEqual(result[1], version2);

		});

		test('should include one version per target platform for release versions', () => {
			const version1 = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64);
			const version2 = aExtensionVersion('1.0.0', TargetPlatform.DARWIN_X64);
			const version3 = aExtensionVersion('1.0.0', TargetPlatform.LINUX_X64);
			const versions = [version1, version2, version3];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64, TargetPlatform.LINUX_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should include all three versions: WIN32_X64 (compatible, first of type) + DARWIN_X64 & LINUX_X64 (non-compatible)
			assert.strictEqual(result.length, 3);
			assert.ok(result.includes(version1)); // Compatible with target platform
			assert.ok(result.includes(version2)); // Non-compatible, included
			assert.ok(result.includes(version3)); // Non-compatible, included
		});

		test('should separate release and pre-release versions', () => {
			const releaseVersion = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64);
			const preReleaseVersion = aPreReleaseExtensionVersion('1.1.0', TargetPlatform.WIN32_X64);
			const versions = [releaseVersion, preReleaseVersion];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should include both since they are different types (release vs pre-release)
			assert.strictEqual(result.length, 2);
			assert.ok(result.includes(releaseVersion));
			assert.ok(result.includes(preReleaseVersion));
		});

		test('should include both release and pre-release versions for same platform with different version numbers', () => {
			const preRelease1 = aPreReleaseExtensionVersion('1.1.0', TargetPlatform.WIN32_X64);
			const release2 = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64); // Different version number
			const versions = [preRelease1, release2];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should include both since they have different version numbers
			assert.strictEqual(result.length, 2);
			assert.strictEqual(result[0], preRelease1);
			assert.strictEqual(result[1], release2);
		});

		test('should handle versions without target platform (UNDEFINED)', () => {
			const version1 = aExtensionVersion('1.0.0'); // No target platform specified
			const version2 = aExtensionVersion('0.9.0'); // No target platform specified
			const versions = [version1, version2];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should only include the first version since they both have UNDEFINED platform
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0], version1);
		});

		test('should handle mixed release and pre-release versions across multiple platforms', () => {
			const releaseWin = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64);
			const releaseMac = aExtensionVersion('1.0.0', TargetPlatform.DARWIN_X64);
			const preReleaseWin = aPreReleaseExtensionVersion('1.1.0', TargetPlatform.WIN32_X64);
			const preReleaseMac = aPreReleaseExtensionVersion('1.1.0', TargetPlatform.DARWIN_X64);

			const versions = [releaseWin, releaseMac, preReleaseWin, preReleaseMac];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should include: WIN32_X64 compatible (release + prerelease) + DARWIN_X64 non-compatible (all versions)
			assert.strictEqual(result.length, 4);
			assert.ok(result.includes(releaseWin)); // Compatible release
			assert.ok(result.includes(releaseMac)); // Non-compatible, included
			assert.ok(result.includes(preReleaseWin)); // Compatible pre-release
			assert.ok(result.includes(preReleaseMac)); // Non-compatible, included
		});

		test('should handle complex scenario with multiple versions and platforms', () => {
			const versions = [
				aExtensionVersion('2.0.0', TargetPlatform.WIN32_X64),
				aExtensionVersion('2.0.0', TargetPlatform.DARWIN_X64),
				aPreReleaseExtensionVersion('2.1.0', TargetPlatform.WIN32_X64),
				aPreReleaseExtensionVersion('2.1.0', TargetPlatform.LINUX_X64),
				aExtensionVersion('2.0.0'), // No platform specified
				aPreReleaseExtensionVersion('2.1.0'), // Pre-release, no platform specified
			];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64, TargetPlatform.LINUX_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Expected for WIN32_X64 target platform:
			// - Compatible (WIN32_X64 + UNDEFINED): release (2.0.0 WIN32_X64) and pre-release (2.1.0 WIN32_X64)
			// - Non-compatible: DARWIN_X64 release, LINUX_X64 pre-release
			// Total: 4 versions (1 compatible release + 1 compatible pre-release + 2 non-compatible)
			assert.strictEqual(result.length, 4);

			// Check specific versions are included
			assert.ok(result.includes(versions[0])); // 2.0.0 WIN32_X64 (compatible release)
			assert.ok(result.includes(versions[1])); // 2.0.0 DARWIN_X64 (non-compatible)
			assert.ok(result.includes(versions[2])); // 2.1.0 WIN32_X64 (compatible pre-release)
			assert.ok(result.includes(versions[3])); // 2.1.0 LINUX_X64 (non-compatible)
		});

		test('should keep only first compatible version when specific platform comes before undefined', () => {
			// Test how UNDEFINED platform interacts with specific platforms
			const versions = [
				aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64),
				aExtensionVersion('1.0.0'), // UNDEFINED platform - compatible with all
			];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Both are compatible with WIN32_X64, first one should be included (specific platform preferred)
			assert.strictEqual(result.length, 1);
			assert.ok(result.includes(versions[0])); // WIN32_X64 should be included (specific platform)
		});

		test('should handle higher version with specific platform vs lower version with universal platform', () => {
			// Scenario: newer version for specific platform vs older version with universal compatibility
			const higherVersionSpecificPlatform = aExtensionVersion('2.0.0', TargetPlatform.WIN32_X64);
			const lowerVersionUniversal = aExtensionVersion('1.5.0'); // UNDEFINED/universal platform

			const versions = [higherVersionSpecificPlatform, lowerVersionUniversal];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Both are compatible with WIN32_X64, but only the first release version should be included
			assert.strictEqual(result.length, 1);
			assert.ok(result.includes(higherVersionSpecificPlatform)); // First compatible release
			assert.ok(!result.includes(lowerVersionUniversal)); // Filtered (second compatible release)
		});

		test('should handle lower version with specific platform vs higher version with universal platform', () => {
			// Reverse scenario: older version for specific platform vs newer version with universal compatibility
			const lowerVersionSpecificPlatform = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64);
			const higherVersionUniversal = aExtensionVersion('2.0.0'); // UNDEFINED/universal platform

			const versions = [lowerVersionSpecificPlatform, higherVersionUniversal];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Both are compatible with WIN32_X64, but only the first release version should be included
			assert.strictEqual(result.length, 1);
			assert.ok(result.includes(lowerVersionSpecificPlatform)); // First compatible release
			assert.ok(!result.includes(higherVersionUniversal)); // Filtered (second compatible release)
		});

		test('should handle multiple specific platforms vs universal platform with version differences', () => {
			// Complex scenario with multiple platforms and universal compatibility
			const versions = [
				aExtensionVersion('2.0.0', TargetPlatform.WIN32_X64),    // Highest version, specific platform
				aExtensionVersion('1.9.0', TargetPlatform.DARWIN_X64),  // Lower version, different specific platform
				aExtensionVersion('1.8.0'),                             // Lowest version, universal platform
			];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64, TargetPlatform.LINUX_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should include:
			// - 2.0.0 WIN32_X64 (specific target platform match - replaces UNDEFINED if it came first)
			// - 1.9.0 DARWIN_X64 (non-compatible, included)
			assert.strictEqual(result.length, 2);
			assert.ok(result.includes(versions[0])); // 2.0.0 WIN32_X64
			assert.ok(result.includes(versions[1])); // 1.9.0 DARWIN_X64
		});

		test('should include universal platform when no specific platforms conflict', () => {
			// Test where universal platform is included because no specific platforms conflict
			const universalVersion = aExtensionVersion('1.0.0'); // UNDEFINED/universal platform
			const specificVersion = aExtensionVersion('1.0.0', TargetPlatform.LINUX_ARM64);

			const versions = [universalVersion, specificVersion];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64]; // Note: LINUX_ARM64 not in target platforms

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Universal is compatible with WIN32_X64, specific version is not compatible
			// So we should get: universal (first compatible release) + specific (non-compatible)
			assert.strictEqual(result.length, 2);
			assert.ok(result.includes(universalVersion)); // Compatible with WIN32_X64
			assert.ok(result.includes(specificVersion)); // Non-compatible, included
		});

		test('should include all non-compatible platform versions', () => {
			const version1 = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64);
			const version2 = aExtensionVersion('1.0.0', TargetPlatform.DARWIN_X64);
			const version3 = aPreReleaseExtensionVersion('1.1.0', TargetPlatform.LINUX_X64);
			const versions = [version1, version2, version3];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64, TargetPlatform.LINUX_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			assert.ok(result.includes(version2)); // Non-compatible, included
			assert.ok(result.includes(version3)); // Non-compatible, included
		});

		test('should prefer specific target platform over undefined when same version exists for both', () => {
			const undefinedVersion = aExtensionVersion('1.0.0'); // UNDEFINED platform, appears first
			const specificVersion = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64); // Specific platform, appears second

			const versions = [undefinedVersion, specificVersion];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should return the specific platform version (WIN32_X64), not the undefined one
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0], specificVersion);
			assert.ok(!result.includes(undefinedVersion));
		});

		test('should replace undefined pre-release with specific platform pre-release', () => {
			const undefinedPreRelease = aPreReleaseExtensionVersion('1.0.0'); // UNDEFINED platform pre-release, appears first
			const specificPreRelease = aPreReleaseExtensionVersion('1.0.0', TargetPlatform.WIN32_X64); // Specific platform pre-release, appears second

			const versions = [undefinedPreRelease, specificPreRelease];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should return the specific platform pre-release, not the undefined one
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0], specificPreRelease);
			assert.ok(!result.includes(undefinedPreRelease));
		});

		test('should handle explicit UNIVERSAL platform', () => {
			const universalVersion = aExtensionVersion('1.0.0', TargetPlatform.UNIVERSAL);
			const specificVersion = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64);

			const versions = [universalVersion, specificVersion];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should return the specific platform version, not the universal one
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0], specificVersion);
			assert.ok(!result.includes(universalVersion));
		});

		test('should handle both release and pre-release with replacement', () => {
			// Both release and pre-release starting with undefined and then getting specific platform
			const undefinedRelease = aExtensionVersion('1.0.0'); // UNDEFINED release
			const specificRelease = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64); // Specific release
			const undefinedPreRelease = aPreReleaseExtensionVersion('1.1.0'); // UNDEFINED pre-release
			const specificPreRelease = aPreReleaseExtensionVersion('1.1.0', TargetPlatform.WIN32_X64); // Specific pre-release

			const versions = [undefinedRelease, undefinedPreRelease, specificRelease, specificPreRelease];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should return both specific platform versions
			assert.strictEqual(result.length, 2);
			assert.ok(result.includes(specificRelease));
			assert.ok(result.includes(specificPreRelease));
			assert.ok(!result.includes(undefinedRelease));
			assert.ok(!result.includes(undefinedPreRelease));
		});

		test('should not replace when specific platform is for different platform', () => {
			const undefinedVersion = aExtensionVersion('1.0.0'); // UNDEFINED, compatible with WIN32_X64
			const specificVersionDarwin = aExtensionVersion('1.0.0', TargetPlatform.DARWIN_X64); // Specific for DARWIN, not compatible with WIN32_X64

			const versions = [undefinedVersion, specificVersionDarwin];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should return undefined version (compatible with WIN32_X64) and specific DARWIN version (non-compatible, always included)
			assert.strictEqual(result.length, 2);
			assert.ok(result.includes(undefinedVersion));
			assert.ok(result.includes(specificVersionDarwin));
		});

		test('should handle replacement with non-compatible versions in between', () => {
			const undefinedVersion = aExtensionVersion('1.0.0'); // UNDEFINED, compatible with WIN32_X64
			const nonCompatibleVersion = aExtensionVersion('0.9.0', TargetPlatform.LINUX_ARM64); // Non-compatible platform
			const specificVersion = aExtensionVersion('1.0.0', TargetPlatform.WIN32_X64); // Specific for WIN32_X64

			const versions = [undefinedVersion, nonCompatibleVersion, specificVersion];
			const allTargetPlatforms = [TargetPlatform.WIN32_X64, TargetPlatform.DARWIN_X64];

			const result = filterLatestExtensionVersionsForTargetPlatform(versions, TargetPlatform.WIN32_X64, allTargetPlatforms);

			// Should return specific WIN32_X64 version (replacing undefined) and non-compatible LINUX_ARM64 version
			assert.strictEqual(result.length, 2);
			assert.ok(result.includes(specificVersion));
			assert.ok(result.includes(nonCompatibleVersion));
			assert.ok(!result.includes(undefinedVersion));
		});

	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/test/common/extensionManagement.test.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/test/common/extensionManagement.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { EXTENSION_IDENTIFIER_PATTERN } from '../../common/extensionManagement.js';
import { ExtensionKey } from '../../common/extensionManagementUtil.js';
import { TargetPlatform } from '../../../extensions/common/extensions.js';

suite('Extension Identifier Pattern', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('extension identifier pattern', () => {
		const regEx = new RegExp(EXTENSION_IDENTIFIER_PATTERN);
		assert.strictEqual(true, regEx.test('publisher.name'));
		assert.strictEqual(true, regEx.test('publiSher.name'));
		assert.strictEqual(true, regEx.test('publisher.Name'));
		assert.strictEqual(true, regEx.test('PUBLISHER.NAME'));
		assert.strictEqual(true, regEx.test('PUBLISHEr.NAMe'));
		assert.strictEqual(true, regEx.test('PUBLISHEr.N-AMe'));
		assert.strictEqual(true, regEx.test('PUB-LISHEr.NAMe'));
		assert.strictEqual(true, regEx.test('PUB-LISHEr.N-AMe'));
		assert.strictEqual(true, regEx.test('PUBLISH12Er90.N-A54Me123'));
		assert.strictEqual(true, regEx.test('111PUBLISH12Er90.N-1111A54Me123'));
		assert.strictEqual(false, regEx.test('publishername'));
		assert.strictEqual(false, regEx.test('-publisher.name'));
		assert.strictEqual(false, regEx.test('publisher.-name'));
		assert.strictEqual(false, regEx.test('-publisher.-name'));
		assert.strictEqual(false, regEx.test('publ_isher.name'));
		assert.strictEqual(false, regEx.test('publisher._name'));
	});

	test('extension key', () => {
		assert.strictEqual(new ExtensionKey({ id: 'pub.extension-name' }, '1.0.1').toString(), 'pub.extension-name-1.0.1');
		assert.strictEqual(new ExtensionKey({ id: 'pub.extension-name' }, '1.0.1', TargetPlatform.UNDEFINED).toString(), 'pub.extension-name-1.0.1');
		assert.strictEqual(new ExtensionKey({ id: 'pub.extension-name' }, '1.0.1', TargetPlatform.WIN32_X64).toString(), `pub.extension-name-1.0.1-${TargetPlatform.WIN32_X64}`);
	});

	test('extension key parsing', () => {
		assert.strictEqual(ExtensionKey.parse('pub.extension-name'), null);
		assert.strictEqual(ExtensionKey.parse('pub.extension-name@1.2.3'), null);
		assert.strictEqual(ExtensionKey.parse('pub.extension-name-1.0.1')?.toString(), 'pub.extension-name-1.0.1');
		assert.strictEqual(ExtensionKey.parse('pub.extension-name-1.0.1-win32-x64')?.toString(), 'pub.extension-name-1.0.1-win32-x64');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/test/common/extensionNls.test.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/test/common/extensionNls.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { deepClone } from '../../../../base/common/objects.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ILocalizedString } from '../../../action/common/action.js';
import { IConfigurationNode } from '../../../configuration/common/configurationRegistry.js';
import { localizeManifest } from '../../common/extensionNls.js';
import { IExtensionManifest } from '../../../extensions/common/extensions.js';
import { NullLogger } from '../../../log/common/log.js';

const manifest: IExtensionManifest = {
	name: 'test',
	publisher: 'test',
	version: '1.0.0',
	engines: {
		vscode: '*'
	},
	contributes: {
		commands: [
			{
				command: 'test.command',
				title: '%test.command.title%',
				category: '%test.command.category%'
			},
		],
		authentication: [
			{
				id: 'test.authentication',
				label: '%test.authentication.label%',
			}
		],
		configuration: {
			// to ensure we test another "title" property
			title: '%test.configuration.title%',
			properties: {
				'test.configuration': {
					type: 'string',
					description: 'not important',
				}
			}
		}
	}
};

suite('Localize Manifest', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	test('replaces template strings', function () {
		const localizedManifest = localizeManifest(
			store.add(new NullLogger()),
			deepClone(manifest),
			{
				'test.command.title': 'Test Command',
				'test.command.category': 'Test Category',
				'test.authentication.label': 'Test Authentication',
				'test.configuration.title': 'Test Configuration',
			}
		);

		assert.strictEqual(localizedManifest.contributes?.commands?.[0].title, 'Test Command');
		assert.strictEqual(localizedManifest.contributes?.commands?.[0].category, 'Test Category');
		assert.strictEqual(localizedManifest.contributes?.authentication?.[0].label, 'Test Authentication');
		assert.strictEqual((localizedManifest.contributes?.configuration as IConfigurationNode).title, 'Test Configuration');
	});

	test('replaces template strings with fallback if not found in translations', function () {
		const localizedManifest = localizeManifest(
			store.add(new NullLogger()),
			deepClone(manifest),
			{},
			{
				'test.command.title': 'Test Command',
				'test.command.category': 'Test Category',
				'test.authentication.label': 'Test Authentication',
				'test.configuration.title': 'Test Configuration',
			}
		);

		assert.strictEqual(localizedManifest.contributes?.commands?.[0].title, 'Test Command');
		assert.strictEqual(localizedManifest.contributes?.commands?.[0].category, 'Test Category');
		assert.strictEqual(localizedManifest.contributes?.authentication?.[0].label, 'Test Authentication');
		assert.strictEqual((localizedManifest.contributes?.configuration as IConfigurationNode).title, 'Test Configuration');
	});

	test('replaces template strings - command title & categories become ILocalizedString', function () {
		const localizedManifest = localizeManifest(
			store.add(new NullLogger()),
			deepClone(manifest),
			{
				'test.command.title': 'Befehl test',
				'test.command.category': 'Testkategorie',
				'test.authentication.label': 'Testauthentifizierung',
				'test.configuration.title': 'Testkonfiguration',
			},
			{
				'test.command.title': 'Test Command',
				'test.command.category': 'Test Category',
				'test.authentication.label': 'Test Authentication',
				'test.configuration.title': 'Test Configuration',
			}
		);

		const title = localizedManifest.contributes?.commands?.[0].title as ILocalizedString;
		const category = localizedManifest.contributes?.commands?.[0].category as ILocalizedString;
		assert.strictEqual(title.value, 'Befehl test');
		assert.strictEqual(title.original, 'Test Command');
		assert.strictEqual(category.value, 'Testkategorie');
		assert.strictEqual(category.original, 'Test Category');

		// Everything else stays as a string.
		assert.strictEqual(localizedManifest.contributes?.authentication?.[0].label, 'Testauthentifizierung');
		assert.strictEqual((localizedManifest.contributes?.configuration as IConfigurationNode).title, 'Testkonfiguration');
	});

	test('replaces template strings - is best effort #164630', function () {
		const manifestWithTypo: IExtensionManifest = {
			name: 'test',
			publisher: 'test',
			version: '1.0.0',
			engines: {
				vscode: '*'
			},
			contributes: {
				authentication: [
					{
						id: 'test.authentication',
						// This not existing in the bundle shouldn't cause an error.
						label: '%doesnotexist%',
					}
				],
				commands: [
					{
						command: 'test.command',
						title: '%test.command.title%',
						category: '%test.command.category%'
					},
				],
			}
		};

		const localizedManifest = localizeManifest(
			store.add(new NullLogger()),
			deepClone(manifestWithTypo),
			{
				'test.command.title': 'Test Command',
				'test.command.category': 'Test Category'
			});

		assert.strictEqual(localizedManifest.contributes?.commands?.[0].title, 'Test Command');
		assert.strictEqual(localizedManifest.contributes?.commands?.[0].category, 'Test Category');
		assert.strictEqual(localizedManifest.contributes?.authentication?.[0].label, '%doesnotexist%');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/test/common/extensionsProfileScannerService.test.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/test/common/extensionsProfileScannerService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { IEnvironmentService } from '../../../environment/common/environment.js';
import { AbstractExtensionsProfileScannerService, ProfileExtensionsEvent } from '../../common/extensionsProfileScannerService.js';
import { ExtensionType, IExtension, IExtensionManifest, TargetPlatform } from '../../../extensions/common/extensions.js';
import { FileService } from '../../../files/common/fileService.js';
import { IFileService } from '../../../files/common/files.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../log/common/log.js';
import { ITelemetryService } from '../../../telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../telemetry/common/telemetryUtils.js';
import { IUriIdentityService } from '../../../uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { IUserDataProfilesService, UserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';

class TestObject extends AbstractExtensionsProfileScannerService { }

suite('ExtensionsProfileScannerService', () => {

	const ROOT = URI.file('/ROOT');
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	const extensionsLocation = joinPath(ROOT, 'extensions');
	let instantiationService: TestInstantiationService;

	setup(async () => {
		instantiationService = disposables.add(new TestInstantiationService());
		const logService = new NullLogService();
		const fileService = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(ROOT.scheme, fileSystemProvider));
		instantiationService.stub(ILogService, logService);
		instantiationService.stub(IFileService, fileService);
		instantiationService.stub(ITelemetryService, NullTelemetryService);
		const uriIdentityService = instantiationService.stub(IUriIdentityService, disposables.add(new UriIdentityService(fileService)));
		const environmentService = instantiationService.stub(IEnvironmentService, { userRoamingDataHome: ROOT, cacheHome: joinPath(ROOT, 'cache'), });
		const userDataProfilesService = disposables.add(new UserDataProfilesService(environmentService, fileService, uriIdentityService, logService));
		instantiationService.stub(IUserDataProfilesService, userDataProfilesService);
	});

	suiteTeardown(() => sinon.restore());

	test('write extensions located in the same extensions folder', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined }]);
	});

	test('write extensions located in the different folder', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(ROOT, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined }]);
	});

	test('write extensions located in the same extensions folder has relative location ', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const actual = JSON.parse((await instantiationService.get(IFileService).readFile(extensionsManifest)).value.toString());
		assert.deepStrictEqual(actual, [{ identifier: extension.identifier, location: extension.location.toJSON(), relativeLocation: 'pub.a-1.0.0', version: extension.manifest.version }]);
	});

	test('write extensions located in different extensions folder does not has relative location ', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(ROOT, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const actual = JSON.parse((await instantiationService.get(IFileService).readFile(extensionsManifest)).value.toString());
		assert.deepStrictEqual(actual, [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version }]);
	});

	test('extension in old format is read and migrated', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			location: extension.location.toJSON(),
			version: extension.manifest.version,
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined }]);

		const manifestContent = JSON.parse((await instantiationService.get(IFileService).readFile(extensionsManifest)).value.toString());
		assert.deepStrictEqual(manifestContent, [{ identifier: extension.identifier, location: extension.location.toJSON(), relativeLocation: 'pub.a-1.0.0', version: extension.manifest.version }]);
	});

	test('extension in old format is not migrated if not exists in same location', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(ROOT, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			location: extension.location.toJSON(),
			version: extension.manifest.version,
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined }]);

		const manifestContent = JSON.parse((await instantiationService.get(IFileService).readFile(extensionsManifest)).value.toString());
		assert.deepStrictEqual(manifestContent, [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version }]);
	});

	test('extension in old format is read and migrated during write', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			location: extension.location.toJSON(),
			version: extension.manifest.version,
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));
		const extension2 = aExtension('pub.b', joinPath(extensionsLocation, 'pub.b-1.0.0'));
		await testObject.addExtensionsToProfile([[extension2, undefined]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [
			{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined },
			{ identifier: extension2.identifier, location: extension2.location.toJSON(), version: extension2.manifest.version, metadata: undefined }
		]);

		const manifestContent = JSON.parse((await instantiationService.get(IFileService).readFile(extensionsManifest)).value.toString());
		assert.deepStrictEqual(manifestContent, [
			{ identifier: extension.identifier, location: extension.location.toJSON(), relativeLocation: 'pub.a-1.0.0', version: extension.manifest.version },
			{ identifier: extension2.identifier, location: extension2.location.toJSON(), relativeLocation: 'pub.b-1.0.0', version: extension2.manifest.version }
		]);
	});

	test('extensions in old format and new format is read and migrated', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		const extension2 = aExtension('pub.b', joinPath(extensionsLocation, 'pub.b-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			location: extension.location.toJSON(),
			version: extension.manifest.version,
		}, {
			identifier: extension2.identifier,
			location: extension2.location.toJSON(),
			relativeLocation: 'pub.b-1.0.0',
			version: extension2.manifest.version,
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [
			{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined },
			{ identifier: extension2.identifier, location: extension2.location.toJSON(), version: extension2.manifest.version, metadata: undefined }
		]);

		const manifestContent = JSON.parse((await instantiationService.get(IFileService).readFile(extensionsManifest)).value.toString());
		assert.deepStrictEqual(manifestContent, [
			{ identifier: extension.identifier, location: extension.location.toJSON(), relativeLocation: 'pub.a-1.0.0', version: extension.manifest.version },
			{ identifier: extension2.identifier, location: extension2.location.toJSON(), relativeLocation: 'pub.b-1.0.0', version: extension2.manifest.version }
		]);
	});

	test('throws error if extension has invalid relativePath', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			location: extension.location.toJSON(),
			version: extension.manifest.version,
			relativePath: 2
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		try {
			await testObject.scanProfileExtensions(extensionsManifest);
			assert.fail('Should throw error');
		} catch (error) { /*expected*/ }
	});

	test('throws error if extension has no location', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			version: extension.manifest.version,
			relativePath: 'pub.a-1.0.0'
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		try {
			await testObject.scanProfileExtensions(extensionsManifest);
			assert.fail('Should throw error');
		} catch (error) { /*expected*/ }
	});

	test('throws error if extension location is invalid', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			location: {},
			version: extension.manifest.version,
			relativePath: 'pub.a-1.0.0'
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		try {
			await testObject.scanProfileExtensions(extensionsManifest);
			assert.fail('Should throw error');
		} catch (error) { /*expected*/ }
	});

	test('throws error if extension has no identifier', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			location: extension.location.toJSON(),
			version: extension.manifest.version,
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		try {
			await testObject.scanProfileExtensions(extensionsManifest);
			assert.fail('Should throw error');
		} catch (error) { /*expected*/ }
	});

	test('throws error if extension identifier is invalid', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: 'pub.a',
			location: extension.location.toJSON(),
			version: extension.manifest.version,
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		try {
			await testObject.scanProfileExtensions(extensionsManifest);
			assert.fail('Should throw error');
		} catch (error) { /*expected*/ }
	});

	test('throws error if extension has no version', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			location: extension.location.toJSON(),
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		try {
			await testObject.scanProfileExtensions(extensionsManifest);
			assert.fail('Should throw error');
		} catch (error) { /*expected*/ }
	});

	test('read extension when manifest is empty', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(''));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));
		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual, []);
	});

	test('read extension when manifest has empty lines and spaces', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(`


		`));
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));
		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual, []);
	});

	test('read extension when the relative location is empty', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(extensionsLocation, 'pub.a-1.0.0'));
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: extension.identifier,
			location: extension.location.toJSON(),
			relativeLocation: '',
			version: extension.manifest.version,
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined }]);

		const manifestContent = JSON.parse((await instantiationService.get(IFileService).readFile(extensionsManifest)).value.toString());
		assert.deepStrictEqual(manifestContent, [{ identifier: extension.identifier, location: extension.location.toJSON(), relativeLocation: 'pub.a-1.0.0', version: extension.manifest.version }]);
	});

	test('add extension trigger events', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));
		const target1 = sinon.stub();
		const target2 = sinon.stub();
		disposables.add(testObject.onAddExtensions(target1));
		disposables.add(testObject.onDidAddExtensions(target2));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension = aExtension('pub.a', joinPath(ROOT, 'foo', 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined }]);

		assert.ok(target1.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].identifier, extension.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].version, extension.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].location.toString(), extension.location.toString());

		assert.ok(target2.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].identifier, extension.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].version, extension.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].location.toString(), extension.location.toString());
	});

	test('remove extensions trigger events', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));
		const target1 = sinon.stub();
		const target2 = sinon.stub();
		disposables.add(testObject.onRemoveExtensions(target1));
		disposables.add(testObject.onDidRemoveExtensions(target2));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		const extension1 = aExtension('pub.a', joinPath(ROOT, 'foo', 'pub.a-1.0.0'));
		const extension2 = aExtension('pub.b', joinPath(ROOT, 'foo', 'pub.b-1.0.0'));
		await testObject.addExtensionsToProfile([[extension1, undefined], [extension2, undefined]], extensionsManifest);
		await testObject.removeExtensionsFromProfile([extension1.identifier, extension2.identifier], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.length, 0);

		assert.ok(target1.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions.length, 2);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].identifier, extension1.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].version, extension1.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].location.toString(), extension1.location.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[1].identifier, extension2.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[1].version, extension2.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[1].location.toString(), extension2.location.toString());

		assert.ok(target2.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions.length, 2);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].identifier, extension1.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].version, extension1.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].location.toString(), extension1.location.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[1].identifier, extension2.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[1].version, extension2.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[1].location.toString(), extension2.location.toString());
	});

	test('add extension with same id but different version', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');

		const extension1 = aExtension('pub.a', joinPath(ROOT, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension1, undefined]], extensionsManifest);

		const target1 = sinon.stub();
		const target2 = sinon.stub();
		const target3 = sinon.stub();
		const target4 = sinon.stub();
		disposables.add(testObject.onAddExtensions(target1));
		disposables.add(testObject.onRemoveExtensions(target2));
		disposables.add(testObject.onDidAddExtensions(target3));
		disposables.add(testObject.onDidRemoveExtensions(target4));
		const extension2 = aExtension('pub.a', joinPath(ROOT, 'pub.a-2.0.0'), undefined, { version: '2.0.0' });
		await testObject.addExtensionsToProfile([[extension2, undefined]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension2.identifier, location: extension2.location.toJSON(), version: extension2.manifest.version, metadata: undefined }]);

		assert.ok(target1.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].identifier, extension2.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].version, extension2.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].location.toString(), extension2.location.toString());

		assert.ok(target2.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].identifier, extension1.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].version, extension1.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].location.toString(), extension1.location.toString());

		assert.ok(target3.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].identifier, extension2.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].version, extension2.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].location.toString(), extension2.location.toString());

		assert.ok(target4.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].identifier, extension1.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].version, extension1.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].location.toString(), extension1.location.toString());
	});

	test('add same extension', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');

		const extension = aExtension('pub.a', joinPath(ROOT, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const target1 = sinon.stub();
		const target2 = sinon.stub();
		const target3 = sinon.stub();
		const target4 = sinon.stub();
		disposables.add(testObject.onAddExtensions(target1));
		disposables.add(testObject.onRemoveExtensions(target2));
		disposables.add(testObject.onDidAddExtensions(target3));
		disposables.add(testObject.onDidRemoveExtensions(target4));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined }]);
		assert.ok(target1.notCalled);
		assert.ok(target2.notCalled);
		assert.ok(target3.notCalled);
		assert.ok(target4.notCalled);
	});

	test('add same extension with different metadata', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');

		const extension = aExtension('pub.a', joinPath(ROOT, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const target1 = sinon.stub();
		const target2 = sinon.stub();
		const target3 = sinon.stub();
		const target4 = sinon.stub();
		disposables.add(testObject.onAddExtensions(target1));
		disposables.add(testObject.onRemoveExtensions(target2));
		disposables.add(testObject.onDidAddExtensions(target3));
		disposables.add(testObject.onDidRemoveExtensions(target4));
		await testObject.addExtensionsToProfile([[extension, { isApplicationScoped: true }]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON(), metadata: a.metadata })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: { isApplicationScoped: true } }]);
		assert.ok(target1.notCalled);
		assert.ok(target2.notCalled);
		assert.ok(target3.notCalled);
		assert.ok(target4.notCalled);
	});

	test('add extension with different version and metadata', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');

		const extension1 = aExtension('pub.a', joinPath(ROOT, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension1, undefined]], extensionsManifest);
		const extension2 = aExtension('pub.a', joinPath(ROOT, 'pub.a-2.0.0'), undefined, { version: '2.0.0' });

		const target1 = sinon.stub();
		const target2 = sinon.stub();
		const target3 = sinon.stub();
		const target4 = sinon.stub();
		disposables.add(testObject.onAddExtensions(target1));
		disposables.add(testObject.onRemoveExtensions(target2));
		disposables.add(testObject.onDidAddExtensions(target3));
		disposables.add(testObject.onDidRemoveExtensions(target4));
		await testObject.addExtensionsToProfile([[extension2, { isApplicationScoped: true }]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON(), metadata: a.metadata })), [{ identifier: extension2.identifier, location: extension2.location.toJSON(), version: extension2.manifest.version, metadata: { isApplicationScoped: true } }]);

		assert.ok(target1.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].identifier, extension2.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].version, extension2.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].location.toString(), extension2.location.toString());

		assert.ok(target2.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].identifier, extension1.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].version, extension1.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].location.toString(), extension1.location.toString());

		assert.ok(target3.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].identifier, extension2.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].version, extension2.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target1.args[0][0])).extensions[0].location.toString(), extension2.location.toString());

		assert.ok(target4.calledOnce);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).profileLocation.toString(), extensionsManifest.toString());
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions.length, 1);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].identifier, extension1.identifier);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].version, extension1.manifest.version);
		assert.deepStrictEqual((<ProfileExtensionsEvent>(target2.args[0][0])).extensions[0].location.toString(), extension1.location.toString());
	});

	test('add extension with same id and version located in the different folder', async () => {
		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));

		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');

		let extension = aExtension('pub.a', joinPath(ROOT, 'foo', 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const target1 = sinon.stub();
		const target2 = sinon.stub();
		const target3 = sinon.stub();
		const target4 = sinon.stub();
		disposables.add(testObject.onAddExtensions(target1));
		disposables.add(testObject.onRemoveExtensions(target2));
		disposables.add(testObject.onDidAddExtensions(target3));
		disposables.add(testObject.onDidRemoveExtensions(target4));
		extension = aExtension('pub.a', joinPath(ROOT, 'pub.a-1.0.0'));
		await testObject.addExtensionsToProfile([[extension, undefined]], extensionsManifest);

		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.map(a => ({ ...a, location: a.location.toJSON() })), [{ identifier: extension.identifier, location: extension.location.toJSON(), version: extension.manifest.version, metadata: undefined }]);
		assert.ok(target1.notCalled);
		assert.ok(target2.notCalled);
		assert.ok(target3.notCalled);
		assert.ok(target4.notCalled);
	});

	test('read extension when uuid is different in identifier and manifest', async () => {
		const extensionsManifest = joinPath(extensionsLocation, 'extensions.json');
		await instantiationService.get(IFileService).writeFile(extensionsManifest, VSBuffer.fromString(JSON.stringify([{
			identifier: {
				id: 'pub.a',
				uuid: 'uuid1`'
			},
			version: '1.0.0',
			location: joinPath(extensionsLocation, 'pub.a-1.0.0').toString(),
			relativeLocation: 'pub.a-1.0.0',
			metadata: {
				id: 'uuid',
			}
		}])));

		const testObject = disposables.add(instantiationService.createInstance(TestObject, extensionsLocation));
		const actual = await testObject.scanProfileExtensions(extensionsManifest);
		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier.id, 'pub.a');
		assert.deepStrictEqual(actual[0].identifier.uuid, 'uuid');
	});

	function aExtension(id: string, location: URI, e?: Partial<IExtension>, manifest?: Partial<IExtensionManifest>): IExtension {
		return {
			identifier: { id },
			location,
			type: ExtensionType.User,
			targetPlatform: TargetPlatform.DARWIN_X64,
			isBuiltin: false,
			manifest: {
				name: 'name',
				publisher: 'publisher',
				version: '1.0.0',
				engines: { vscode: '1.0.0' },
				...manifest,
			},
			isValid: true,
			preRelease: false,
			validations: [],
			...e
		};
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/test/node/extensionDownloader.test.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/test/node/extensionDownloader.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { platform } from '../../../../base/common/platform.js';
import { arch } from '../../../../base/common/process.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { INativeEnvironmentService } from '../../../environment/common/environment.js';
import { ExtensionSignatureVerificationCode, getTargetPlatform, IExtensionGalleryService, IGalleryExtension, IGalleryExtensionAssets, InstallOperation } from '../../common/extensionManagement.js';
import { getGalleryExtensionId } from '../../common/extensionManagementUtil.js';
import { ExtensionsDownloader } from '../../node/extensionDownloader.js';
import { IExtensionSignatureVerificationResult, IExtensionSignatureVerificationService } from '../../node/extensionSignatureVerificationService.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../log/common/log.js';
import { IUriIdentityService } from '../../../uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { IStringDictionary } from '../../../../base/common/collections.js';

const ROOT = URI.file('tests').with({ scheme: 'vscode-tests' });

class TestExtensionSignatureVerificationService extends mock<IExtensionSignatureVerificationService>() {

	constructor(
		private readonly verificationResult: string | boolean) {
		super();
	}

	override async verify(): Promise<IExtensionSignatureVerificationResult | undefined> {
		if (this.verificationResult === true) {
			return {
				code: ExtensionSignatureVerificationCode.Success
			};
		}
		if (this.verificationResult === false) {
			return undefined;
		}
		return {
			code: this.verificationResult as ExtensionSignatureVerificationCode,
		};
	}
}

class TestExtensionDownloader extends ExtensionsDownloader {
	protected override async validate(): Promise<void> { }
}

suite('ExtensionDownloader Tests', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;

	setup(() => {
		instantiationService = disposables.add(new TestInstantiationService());

		const logService = new NullLogService();
		const fileService = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(ROOT.scheme, fileSystemProvider));

		instantiationService.stub(ILogService, logService);
		instantiationService.stub(IFileService, fileService);
		instantiationService.stub(ILogService, logService);
		instantiationService.stub(IUriIdentityService, disposables.add(new UriIdentityService(fileService)));
		instantiationService.stub(INativeEnvironmentService, { extensionsDownloadLocation: joinPath(ROOT, 'CachedExtensionVSIXs') });
		instantiationService.stub(IExtensionGalleryService, {
			async download(extension, location, operation) {
				await fileService.writeFile(location, VSBuffer.fromString('extension vsix'));
			},
			async downloadSignatureArchive(extension, location) {
				await fileService.writeFile(location, VSBuffer.fromString('extension signature'));
			},
		});
	});

	test('download completes successfully if verification is disabled by options', async () => {
		const testObject = aTestObject({ verificationResult: 'error' });

		const actual = await testObject.download(aGalleryExtension('a', { isSigned: true }), InstallOperation.Install, false);

		assert.strictEqual(actual.verificationStatus, undefined);
	});

	test('download completes successfully if verification is disabled because the module is not loaded', async () => {
		const testObject = aTestObject({ verificationResult: false });

		const actual = await testObject.download(aGalleryExtension('a', { isSigned: true }), InstallOperation.Install, true);

		assert.strictEqual(actual.verificationStatus, undefined);
	});

	test('download completes successfully if verification fails to execute', async () => {
		const errorCode = 'ENOENT';
		const testObject = aTestObject({ verificationResult: errorCode });

		const actual = await testObject.download(aGalleryExtension('a', { isSigned: true }), InstallOperation.Install, true);

		assert.strictEqual(actual.verificationStatus, errorCode);
	});

	test('download completes successfully if verification fails ', async () => {
		const errorCode = 'IntegrityCheckFailed';
		const testObject = aTestObject({ verificationResult: errorCode });

		const actual = await testObject.download(aGalleryExtension('a', { isSigned: true }), InstallOperation.Install, true);

		assert.strictEqual(actual.verificationStatus, errorCode);
	});

	test('download completes successfully if verification succeeds', async () => {
		const testObject = aTestObject({ verificationResult: true });

		const actual = await testObject.download(aGalleryExtension('a', { isSigned: true }), InstallOperation.Install, true);

		assert.strictEqual(actual.verificationStatus, ExtensionSignatureVerificationCode.Success);
	});

	test('download completes successfully for unsigned extension', async () => {
		const testObject = aTestObject({ verificationResult: true });

		const actual = await testObject.download(aGalleryExtension('a', { isSigned: false }), InstallOperation.Install, true);

		assert.strictEqual(actual.verificationStatus, ExtensionSignatureVerificationCode.NotSigned);
	});

	test('download completes successfully for an unsigned extension even when signature verification throws error', async () => {
		const testObject = aTestObject({ verificationResult: 'error' });

		const actual = await testObject.download(aGalleryExtension('a', { isSigned: false }), InstallOperation.Install, true);

		assert.strictEqual(actual.verificationStatus, ExtensionSignatureVerificationCode.NotSigned);
	});

	function aTestObject(options: { verificationResult: boolean | string }): ExtensionsDownloader {
		instantiationService.stub(IExtensionSignatureVerificationService, new TestExtensionSignatureVerificationService(options.verificationResult));
		return disposables.add(instantiationService.createInstance(TestExtensionDownloader));
	}

	function aGalleryExtension(name: string, properties: Partial<IGalleryExtension> = {}, galleryExtensionProperties: IStringDictionary<unknown> = {}, assets: Partial<IGalleryExtensionAssets> = {}): IGalleryExtension {
		const targetPlatform = getTargetPlatform(platform, arch);
		const galleryExtension = <IGalleryExtension>Object.create({ name, publisher: 'pub', version: '1.0.0', allTargetPlatforms: [targetPlatform], properties: {}, assets: {}, ...properties });
		galleryExtension.properties = { ...galleryExtension.properties, dependencies: [], targetPlatform, ...galleryExtensionProperties };
		galleryExtension.assets = { ...galleryExtension.assets, ...assets };
		galleryExtension.identifier = { id: getGalleryExtensionId(galleryExtension.publisher, galleryExtension.name), uuid: generateUuid() };
		return <IGalleryExtension>galleryExtension;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionManagement/test/node/extensionsScannerService.test.ts]---
Location: vscode-main/src/vs/platform/extensionManagement/test/node/extensionsScannerService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { dirname, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { INativeEnvironmentService } from '../../../environment/common/environment.js';
import { IExtensionsProfileScannerService, IProfileExtensionsScanOptions } from '../../common/extensionsProfileScannerService.js';
import { AbstractExtensionsScannerService, ExtensionScannerInput, IExtensionsScannerService, IScannedExtensionManifest, Translations } from '../../common/extensionsScannerService.js';
import { ExtensionsProfileScannerService } from '../../node/extensionsProfileScannerService.js';
import { ExtensionType, IExtensionManifest, TargetPlatform } from '../../../extensions/common/extensions.js';
import { IFileService } from '../../../files/common/files.js';
import { FileService } from '../../../files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../files/common/inMemoryFilesystemProvider.js';
import { IInstantiationService } from '../../../instantiation/common/instantiation.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../log/common/log.js';
import { IProductService } from '../../../product/common/productService.js';
import { IUriIdentityService } from '../../../uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { IUserDataProfilesService, UserDataProfilesService } from '../../../userDataProfile/common/userDataProfile.js';

let translations: Translations = Object.create(null);
const ROOT = URI.file('/ROOT');

class ExtensionsScannerService extends AbstractExtensionsScannerService implements IExtensionsScannerService {

	constructor(
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@INativeEnvironmentService nativeEnvironmentService: INativeEnvironmentService,
		@IProductService productService: IProductService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(
			URI.file(nativeEnvironmentService.builtinExtensionsPath),
			URI.file(nativeEnvironmentService.extensionsPath),
			joinPath(nativeEnvironmentService.userHome, '.vscode-oss-dev', 'extensions', 'control.json'),
			userDataProfilesService.defaultProfile,
			userDataProfilesService, extensionsProfileScannerService, fileService, logService, nativeEnvironmentService, productService, uriIdentityService, instantiationService);
	}

	protected async getTranslations(language: string): Promise<Translations> {
		return translations;
	}

}

suite('NativeExtensionsScanerService Test', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	let instantiationService: TestInstantiationService;

	setup(async () => {
		translations = {};
		instantiationService = disposables.add(new TestInstantiationService());
		const logService = new NullLogService();
		const fileService = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(ROOT.scheme, fileSystemProvider));
		instantiationService.stub(ILogService, logService);
		instantiationService.stub(IFileService, fileService);
		const systemExtensionsLocation = joinPath(ROOT, 'system');
		const userExtensionsLocation = joinPath(ROOT, 'extensions');
		const environmentService = instantiationService.stub(INativeEnvironmentService, {
			userHome: ROOT,
			userRoamingDataHome: ROOT,
			builtinExtensionsPath: systemExtensionsLocation.fsPath,
			extensionsPath: userExtensionsLocation.fsPath,
			cacheHome: joinPath(ROOT, 'cache'),
		});
		instantiationService.stub(IProductService, { version: '1.66.0' });
		const uriIdentityService = disposables.add(new UriIdentityService(fileService));
		instantiationService.stub(IUriIdentityService, uriIdentityService);
		const userDataProfilesService = disposables.add(new UserDataProfilesService(environmentService, fileService, uriIdentityService, logService));
		instantiationService.stub(IUserDataProfilesService, userDataProfilesService);
		instantiationService.stub(IExtensionsProfileScannerService, disposables.add(new ExtensionsProfileScannerService(environmentService, fileService, userDataProfilesService, uriIdentityService, logService)));
		await fileService.createFolder(systemExtensionsLocation);
		await fileService.createFolder(userExtensionsLocation);
	});

	test('scan system extension', async () => {
		const manifest: Partial<IExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const extensionLocation = await aSystemExtension(manifest);
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanSystemExtensions({});

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual[0].isBuiltin, true);
		assert.deepStrictEqual(actual[0].type, ExtensionType.System);
		assert.deepStrictEqual(actual[0].isValid, true);
		assert.deepStrictEqual(actual[0].validations, []);
		assert.deepStrictEqual(actual[0].metadata, undefined);
		assert.deepStrictEqual(actual[0].targetPlatform, TargetPlatform.UNDEFINED);
		assert.deepStrictEqual(actual[0].manifest, manifest);
	});

	test('scan user extensions', async () => {
		const manifest: Partial<IScannedExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const extensionLocation = await aUserExtension(manifest);
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions();

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual[0].isBuiltin, false);
		assert.deepStrictEqual(actual[0].type, ExtensionType.User);
		assert.deepStrictEqual(actual[0].isValid, true);
		assert.deepStrictEqual(actual[0].validations, []);
		assert.deepStrictEqual(actual[0].metadata, undefined);
		assert.deepStrictEqual(actual[0].targetPlatform, TargetPlatform.UNDEFINED);
		delete manifest.__metadata;
		assert.deepStrictEqual(actual[0].manifest, manifest);
	});

	test('scan existing extension', async () => {
		const manifest: Partial<IExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const extensionLocation = await aUserExtension(manifest);
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanExistingExtension(extensionLocation, ExtensionType.User, {});

		assert.notEqual(actual, null);
		assert.deepStrictEqual(actual!.identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual!.location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual!.isBuiltin, false);
		assert.deepStrictEqual(actual!.type, ExtensionType.User);
		assert.deepStrictEqual(actual!.isValid, true);
		assert.deepStrictEqual(actual!.validations, []);
		assert.deepStrictEqual(actual!.metadata, undefined);
		assert.deepStrictEqual(actual!.targetPlatform, TargetPlatform.UNDEFINED);
		assert.deepStrictEqual(actual!.manifest, manifest);
	});

	test('scan single extension', async () => {
		const manifest: Partial<IExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const extensionLocation = await aUserExtension(manifest);
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanOneOrMultipleExtensions(extensionLocation, ExtensionType.User, {});

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual[0].isBuiltin, false);
		assert.deepStrictEqual(actual[0].type, ExtensionType.User);
		assert.deepStrictEqual(actual[0].isValid, true);
		assert.deepStrictEqual(actual[0].validations, []);
		assert.deepStrictEqual(actual[0].metadata, undefined);
		assert.deepStrictEqual(actual[0].targetPlatform, TargetPlatform.UNDEFINED);
		assert.deepStrictEqual(actual[0].manifest, manifest);
	});

	test('scan multiple extensions', async () => {
		const extensionLocation = await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name2', 'publisher': 'pub' }));
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanOneOrMultipleExtensions(dirname(extensionLocation), ExtensionType.User, {});

		assert.deepStrictEqual(actual.length, 2);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[1].identifier, { id: 'pub.name2' });
	});

	test('scan all user extensions with different versions', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.1' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.2' }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions({ includeAllVersions: false, includeInvalid: false });

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.version, '1.0.2');
	});

	test('scan all user extensions include all versions', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.1' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.2' }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions();

		assert.deepStrictEqual(actual.length, 2);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.version, '1.0.1');
		assert.deepStrictEqual(actual[1].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[1].manifest.version, '1.0.2');
	});

	test('scan all user extensions with different versions and higher version is not compatible', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.1' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.2', engines: { vscode: '^1.67.0' } }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions({ includeAllVersions: false, includeInvalid: false });

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.version, '1.0.1');
	});

	test('scan all user extensions exclude invalid extensions', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name2', 'publisher': 'pub', engines: { vscode: '^1.67.0' } }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions({ includeAllVersions: false, includeInvalid: false });

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
	});

	test('scan all user extensions include invalid extensions', async () => {
		await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub' }));
		await aUserExtension(anExtensionManifest({ 'name': 'name2', 'publisher': 'pub', engines: { vscode: '^1.67.0' } }));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions({ includeAllVersions: false, includeInvalid: true });

		assert.deepStrictEqual(actual.length, 2);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[1].identifier, { id: 'pub.name2' });
	});

	test('scan system extensions include additional builtin extensions', async () => {
		instantiationService.stub(IProductService, {
			version: '1.66.0',
			builtInExtensions: [
				{ name: 'pub.name2', version: '', repo: '', metadata: undefined },
				{ name: 'pub.name', version: '', repo: '', metadata: undefined }
			]
		});
		await anExtension(anExtensionManifest({ 'name': 'name2', 'publisher': 'pub' }), joinPath(ROOT, 'additional'));
		const extensionLocation = await anExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub' }), joinPath(ROOT, 'additional'));
		await aSystemExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', version: '1.0.1' }));
		await instantiationService.get(IFileService).writeFile(joinPath(instantiationService.get(INativeEnvironmentService).userHome, '.vscode-oss-dev', 'extensions', 'control.json'), VSBuffer.fromString(JSON.stringify({ 'pub.name2': 'disabled', 'pub.name': extensionLocation.fsPath })));
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanSystemExtensions({ checkControlFile: true });

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.version, '1.0.0');
	});

	test('scan all user extensions with default nls replacements', async () => {
		const extensionLocation = await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', displayName: '%displayName%' }));
		await instantiationService.get(IFileService).writeFile(joinPath(extensionLocation, 'package.nls.json'), VSBuffer.fromString(JSON.stringify({ displayName: 'Hello World' })));
		const testObject = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanAllUserExtensions();

		assert.deepStrictEqual(actual.length, 1);
		assert.deepStrictEqual(actual[0].identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual[0].manifest.displayName, 'Hello World');
	});

	test('scan extension with en nls replacements', async () => {
		const extensionLocation = await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', displayName: '%displayName%' }));
		await instantiationService.get(IFileService).writeFile(joinPath(extensionLocation, 'package.nls.json'), VSBuffer.fromString(JSON.stringify({ displayName: 'Hello World' })));
		const nlsLocation = joinPath(extensionLocation, 'package.en.json');
		await instantiationService.get(IFileService).writeFile(nlsLocation, VSBuffer.fromString(JSON.stringify({ contents: { package: { displayName: 'Hello World EN' } } })));
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		translations = { 'pub.name': nlsLocation.fsPath };
		const actual = await testObject.scanExistingExtension(extensionLocation, ExtensionType.User, { language: 'en' });

		assert.ok(actual !== null);
		assert.deepStrictEqual(actual!.identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual!.manifest.displayName, 'Hello World EN');
	});

	test('scan extension falls back to default nls replacements', async () => {
		const extensionLocation = await aUserExtension(anExtensionManifest({ 'name': 'name', 'publisher': 'pub', displayName: '%displayName%' }));
		await instantiationService.get(IFileService).writeFile(joinPath(extensionLocation, 'package.nls.json'), VSBuffer.fromString(JSON.stringify({ displayName: 'Hello World' })));
		const nlsLocation = joinPath(extensionLocation, 'package.en.json');
		await instantiationService.get(IFileService).writeFile(nlsLocation, VSBuffer.fromString(JSON.stringify({ contents: { package: { displayName: 'Hello World EN' } } })));
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		translations = { 'pub.name2': nlsLocation.fsPath };
		const actual = await testObject.scanExistingExtension(extensionLocation, ExtensionType.User, { language: 'en' });

		assert.ok(actual !== null);
		assert.deepStrictEqual(actual!.identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual!.manifest.displayName, 'Hello World');
	});

	test('scan single extension with manifest metadata retains manifest metadata', async () => {
		const manifest: Partial<IExtensionManifest> = anExtensionManifest({ 'name': 'name', 'publisher': 'pub' });
		const expectedMetadata = { size: 12345, installedTimestamp: 1234567890, targetPlatform: TargetPlatform.DARWIN_ARM64 };
		const extensionLocation = await aUserExtension({
			...manifest,
			__metadata: expectedMetadata
		});
		const testObject: IExtensionsScannerService = disposables.add(instantiationService.createInstance(ExtensionsScannerService));

		const actual = await testObject.scanExistingExtension(extensionLocation, ExtensionType.User, {});

		assert.notStrictEqual(actual, null);
		assert.deepStrictEqual(actual!.identifier, { id: 'pub.name' });
		assert.deepStrictEqual(actual!.location.toString(), extensionLocation.toString());
		assert.deepStrictEqual(actual!.isBuiltin, false);
		assert.deepStrictEqual(actual!.type, ExtensionType.User);
		assert.deepStrictEqual(actual!.isValid, true);
		assert.deepStrictEqual(actual!.validations, []);
		assert.deepStrictEqual(actual!.metadata, expectedMetadata);
		assert.deepStrictEqual(actual!.manifest, manifest);
	});

	async function aUserExtension(manifest: Partial<IScannedExtensionManifest>): Promise<URI> {
		const environmentService = instantiationService.get(INativeEnvironmentService);
		return anExtension(manifest, URI.file(environmentService.extensionsPath));
	}

	async function aSystemExtension(manifest: Partial<IScannedExtensionManifest>): Promise<URI> {
		const environmentService = instantiationService.get(INativeEnvironmentService);
		return anExtension(manifest, URI.file(environmentService.builtinExtensionsPath));
	}

	async function anExtension(manifest: Partial<IScannedExtensionManifest>, root: URI): Promise<URI> {
		const fileService = instantiationService.get(IFileService);
		const extensionLocation = joinPath(root, `${manifest.publisher}.${manifest.name}-${manifest.version}`);
		await fileService.writeFile(joinPath(extensionLocation, 'package.json'), VSBuffer.fromString(JSON.stringify(manifest)));
		return extensionLocation;
	}

	function anExtensionManifest(manifest: Partial<IScannedExtensionManifest>): Partial<IExtensionManifest> {
		return { engines: { vscode: '^1.66.0' }, version: '1.0.0', main: 'main.js', activationEvents: ['*'], ...manifest };
	}
});

suite('ExtensionScannerInput', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('compare inputs - location', () => {
		const anInput = (location: URI, mtime: number | undefined) => new ExtensionScannerInput(location, mtime, undefined, undefined, false, undefined, ExtensionType.User, true, '1.1.1', undefined, undefined, true, undefined, {});

		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, undefined), anInput(ROOT, undefined)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, 100), anInput(ROOT, 100)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(joinPath(ROOT, 'foo'), undefined), anInput(ROOT, undefined)), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, 100), anInput(ROOT, 200)), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, undefined), anInput(ROOT, 200)), false);
	});

	test('compare inputs - application location', () => {
		const anInput = (location: URI, mtime: number | undefined) => new ExtensionScannerInput(ROOT, undefined, location, mtime, false, undefined, ExtensionType.User, true, '1.1.1', undefined, undefined, true, undefined, {});

		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, undefined), anInput(ROOT, undefined)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, 100), anInput(ROOT, 100)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(joinPath(ROOT, 'foo'), undefined), anInput(ROOT, undefined)), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, 100), anInput(ROOT, 200)), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ROOT, undefined), anInput(ROOT, 200)), false);
	});

	test('compare inputs - profile', () => {
		const anInput = (profile: boolean, profileScanOptions: IProfileExtensionsScanOptions | undefined) => new ExtensionScannerInput(ROOT, undefined, undefined, undefined, profile, profileScanOptions, ExtensionType.User, true, '1.1.1', undefined, undefined, true, undefined, {});

		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, { bailOutWhenFileNotFound: true }), anInput(true, { bailOutWhenFileNotFound: true })), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(false, { bailOutWhenFileNotFound: true }), anInput(false, { bailOutWhenFileNotFound: true })), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, { bailOutWhenFileNotFound: false }), anInput(true, { bailOutWhenFileNotFound: false })), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, {}), anInput(true, {})), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, { bailOutWhenFileNotFound: true }), anInput(true, { bailOutWhenFileNotFound: false })), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, {}), anInput(true, { bailOutWhenFileNotFound: true })), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(true, undefined), anInput(true, {})), false);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(false, { bailOutWhenFileNotFound: true }), anInput(true, { bailOutWhenFileNotFound: true })), false);
	});

	test('compare inputs - extension type', () => {
		const anInput = (type: ExtensionType) => new ExtensionScannerInput(ROOT, undefined, undefined, undefined, false, undefined, type, true, '1.1.1', undefined, undefined, true, undefined, {});

		assert.strictEqual(ExtensionScannerInput.equals(anInput(ExtensionType.System), anInput(ExtensionType.System)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ExtensionType.User), anInput(ExtensionType.User)), true);
		assert.strictEqual(ExtensionScannerInput.equals(anInput(ExtensionType.User), anInput(ExtensionType.System)), false);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionRecommendations/common/extensionRecommendations.ts]---
Location: vscode-main/src/vs/platform/extensionRecommendations/common/extensionRecommendations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const enum RecommendationSource {
	FILE = 1,
	WORKSPACE = 2,
	EXE = 3
}

export interface IExtensionRecommendations {
	source: RecommendationSource;
	extensions: string[];
	name: string;
	searchValue?: string;
}

export function RecommendationSourceToString(source: RecommendationSource) {
	switch (source) {
		case RecommendationSource.FILE: return 'file';
		case RecommendationSource.WORKSPACE: return 'workspace';
		case RecommendationSource.EXE: return 'exe';
	}
}

export const enum RecommendationsNotificationResult {
	Ignored = 'ignored',
	Cancelled = 'cancelled',
	TooMany = 'toomany',
	IncompatibleWindow = 'incompatibleWindow',
	Accepted = 'reacted',
}

export const IExtensionRecommendationNotificationService = createDecorator<IExtensionRecommendationNotificationService>('IExtensionRecommendationNotificationService');

export interface IExtensionRecommendationNotificationService {
	readonly _serviceBrand: undefined;

	readonly ignoredRecommendations: string[];
	hasToIgnoreRecommendationNotifications(): boolean;

	promptImportantExtensionsInstallNotification(recommendations: IExtensionRecommendations): Promise<RecommendationsNotificationResult>;
	promptWorkspaceRecommendations(recommendations: Array<string | URI>): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionRecommendations/common/extensionRecommendationsIpc.ts]---
Location: vscode-main/src/vs/platform/extensionRecommendations/common/extensionRecommendationsIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IExtensionRecommendationNotificationService, IExtensionRecommendations, RecommendationsNotificationResult } from './extensionRecommendations.js';

export class ExtensionRecommendationNotificationServiceChannelClient implements IExtensionRecommendationNotificationService {

	declare readonly _serviceBrand: undefined;

	constructor(private readonly channel: IChannel) { }

	get ignoredRecommendations(): string[] { throw new Error('not supported'); }

	promptImportantExtensionsInstallNotification(extensionRecommendations: IExtensionRecommendations): Promise<RecommendationsNotificationResult> {
		return this.channel.call('promptImportantExtensionsInstallNotification', [extensionRecommendations]);
	}

	promptWorkspaceRecommendations(recommendations: string[]): Promise<void> {
		throw new Error('not supported');
	}

	hasToIgnoreRecommendationNotifications(): boolean {
		throw new Error('not supported');
	}

}

export class ExtensionRecommendationNotificationServiceChannel implements IServerChannel {

	constructor(private service: IExtensionRecommendationNotificationService) { }

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	listen(_: unknown, event: string): Event<any> {
		throw new Error(`Event not found: ${event}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	call(_: unknown, command: string, args?: any): Promise<any> {
		switch (command) {
			case 'promptImportantExtensionsInstallNotification': return this.service.promptImportantExtensionsInstallNotification(args[0]);
		}

		throw new Error(`Call not found: ${command}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionResourceLoader/browser/extensionResourceLoaderService.ts]---
Location: vscode-main/src/vs/platform/extensionResourceLoader/browser/extensionResourceLoaderService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { IFileService } from '../../files/common/files.js';
import { FileAccess, Schemas } from '../../../base/common/network.js';
import { IProductService } from '../../product/common/productService.js';
import { IStorageService } from '../../storage/common/storage.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { ILogService } from '../../log/common/log.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { AbstractExtensionResourceLoaderService, IExtensionResourceLoaderService } from '../common/extensionResourceLoader.js';
import { IExtensionGalleryManifestService } from '../../extensionManagement/common/extensionGalleryManifest.js';

class ExtensionResourceLoaderService extends AbstractExtensionResourceLoaderService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IFileService fileService: IFileService,
		@IStorageService storageService: IStorageService,
		@IProductService productService: IProductService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IConfigurationService configurationService: IConfigurationService,
		@IExtensionGalleryManifestService extensionGalleryManifestService: IExtensionGalleryManifestService,
		@ILogService logService: ILogService,
	) {
		super(fileService, storageService, productService, environmentService, configurationService, extensionGalleryManifestService, logService);
	}

	async readExtensionResource(uri: URI): Promise<string> {
		uri = FileAccess.uriToBrowserUri(uri);

		if (uri.scheme !== Schemas.http && uri.scheme !== Schemas.https && uri.scheme !== Schemas.data) {
			const result = await this._fileService.readFile(uri);
			return result.value.toString();
		}

		const requestInit: RequestInit = {};
		if (await this.isExtensionGalleryResource(uri)) {
			requestInit.headers = await this.getExtensionGalleryRequestHeaders();
			requestInit.mode = 'cors'; /* set mode to cors so that above headers are always passed */
		}

		const response = await fetch(uri.toString(true), requestInit);
		if (response.status !== 200) {
			this._logService.info(`Request to '${uri.toString(true)}' failed with status code ${response.status}`);
			throw new Error(response.statusText);
		}
		return response.text();
	}
}

registerSingleton(IExtensionResourceLoaderService, ExtensionResourceLoaderService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionResourceLoader/common/extensionResourceLoader.ts]---
Location: vscode-main/src/vs/platform/extensionResourceLoader/common/extensionResourceLoader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isWeb } from '../../../base/common/platform.js';
import { format2 } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IProductService } from '../../product/common/productService.js';
import { getServiceMachineId } from '../../externalServices/common/serviceMachineId.js';
import { IStorageService } from '../../storage/common/storage.js';
import { TelemetryLevel } from '../../telemetry/common/telemetry.js';
import { getTelemetryLevel, supportsTelemetry } from '../../telemetry/common/telemetryUtils.js';
import { RemoteAuthorities } from '../../../base/common/network.js';
import { TargetPlatform } from '../../extensions/common/extensions.js';
import { ExtensionGalleryResourceType, getExtensionGalleryManifestResourceUri, IExtensionGalleryManifest, IExtensionGalleryManifestService } from '../../extensionManagement/common/extensionGalleryManifest.js';
import { ILogService } from '../../log/common/log.js';
import { Disposable } from '../../../base/common/lifecycle.js';

const WEB_EXTENSION_RESOURCE_END_POINT_SEGMENT = '/web-extension-resource/';

export const IExtensionResourceLoaderService = createDecorator<IExtensionResourceLoaderService>('extensionResourceLoaderService');

/**
 * A service useful for reading resources from within extensions.
 */
export interface IExtensionResourceLoaderService {
	readonly _serviceBrand: undefined;

	/**
	 * Read a certain resource within an extension.
	 */
	readExtensionResource(uri: URI): Promise<string>;

	/**
	 * Returns whether the gallery provides extension resources.
	 */
	supportsExtensionGalleryResources(): Promise<boolean>;

	/**
	 * Return true if the given URI is a extension gallery resource.
	 */
	isExtensionGalleryResource(uri: URI): Promise<boolean>;

	/**
	 * Computes the URL of a extension gallery resource. Returns `undefined` if gallery does not provide extension resources.
	 */
	getExtensionGalleryResourceURL(galleryExtension: { publisher: string; name: string; version: string; targetPlatform?: TargetPlatform }, path?: string): Promise<URI | undefined>;
}

export function migratePlatformSpecificExtensionGalleryResourceURL(resource: URI, targetPlatform: TargetPlatform): URI | undefined {
	if (resource.query !== `target=${targetPlatform}`) {
		return undefined;
	}
	const paths = resource.path.split('/');
	if (!paths[3]) {
		return undefined;
	}
	paths[3] = `${paths[3]}+${targetPlatform}`;
	return resource.with({ query: null, path: paths.join('/') });
}

export abstract class AbstractExtensionResourceLoaderService extends Disposable implements IExtensionResourceLoaderService {

	readonly _serviceBrand: undefined;

	private readonly _initPromise: Promise<void>;

	private _extensionGalleryResourceUrlTemplate: string | undefined;
	private _extensionGalleryAuthority: string | undefined;

	constructor(
		protected readonly _fileService: IFileService,
		private readonly _storageService: IStorageService,
		private readonly _productService: IProductService,
		private readonly _environmentService: IEnvironmentService,
		private readonly _configurationService: IConfigurationService,
		private readonly _extensionGalleryManifestService: IExtensionGalleryManifestService,
		protected readonly _logService: ILogService,
	) {
		super();
		this._initPromise = this._init();
	}

	private async _init(): Promise<void> {
		try {
			const manifest = await this._extensionGalleryManifestService.getExtensionGalleryManifest();
			this.resolve(manifest);
			this._register(this._extensionGalleryManifestService.onDidChangeExtensionGalleryManifest(() => this.resolve(manifest)));
		} catch (error) {
			this._logService.error(error);
		}
	}

	private resolve(manifest: IExtensionGalleryManifest | null): void {
		this._extensionGalleryResourceUrlTemplate = manifest ? getExtensionGalleryManifestResourceUri(manifest, ExtensionGalleryResourceType.ExtensionResourceUri) : undefined;
		this._extensionGalleryAuthority = this._extensionGalleryResourceUrlTemplate ? this._getExtensionGalleryAuthority(URI.parse(this._extensionGalleryResourceUrlTemplate)) : undefined;
	}

	public async supportsExtensionGalleryResources(): Promise<boolean> {
		await this._initPromise;
		return this._extensionGalleryResourceUrlTemplate !== undefined;
	}

	public async getExtensionGalleryResourceURL({ publisher, name, version, targetPlatform }: { publisher: string; name: string; version: string; targetPlatform?: TargetPlatform }, path?: string): Promise<URI | undefined> {
		await this._initPromise;
		if (this._extensionGalleryResourceUrlTemplate) {
			const uri = URI.parse(format2(this._extensionGalleryResourceUrlTemplate, {
				publisher,
				name,
				version: targetPlatform !== undefined
					&& targetPlatform !== TargetPlatform.UNDEFINED
					&& targetPlatform !== TargetPlatform.UNKNOWN
					&& targetPlatform !== TargetPlatform.UNIVERSAL
					? `${version}+${targetPlatform}`
					: version,
				path: 'extension'
			}));
			return this._isWebExtensionResourceEndPoint(uri) ? uri.with({ scheme: RemoteAuthorities.getPreferredWebSchema() }) : uri;
		}
		return undefined;
	}

	public abstract readExtensionResource(uri: URI): Promise<string>;

	async isExtensionGalleryResource(uri: URI): Promise<boolean> {
		await this._initPromise;
		return !!this._extensionGalleryAuthority && this._extensionGalleryAuthority === this._getExtensionGalleryAuthority(uri);
	}

	protected async getExtensionGalleryRequestHeaders(): Promise<Record<string, string>> {
		const headers: Record<string, string> = {
			'X-Client-Name': `${this._productService.applicationName}${isWeb ? '-web' : ''}`,
			'X-Client-Version': this._productService.version
		};
		if (supportsTelemetry(this._productService, this._environmentService) && getTelemetryLevel(this._configurationService) === TelemetryLevel.USAGE) {
			headers['X-Machine-Id'] = await this._getServiceMachineId();
		}
		if (this._productService.commit) {
			headers['X-Client-Commit'] = this._productService.commit;
		}
		return headers;
	}

	private _serviceMachineIdPromise: Promise<string> | undefined;
	private _getServiceMachineId(): Promise<string> {
		if (!this._serviceMachineIdPromise) {
			this._serviceMachineIdPromise = getServiceMachineId(this._environmentService, this._fileService, this._storageService);
		}
		return this._serviceMachineIdPromise;
	}

	private _getExtensionGalleryAuthority(uri: URI): string | undefined {
		if (this._isWebExtensionResourceEndPoint(uri)) {
			return uri.authority;
		}
		const index = uri.authority.indexOf('.');
		return index !== -1 ? uri.authority.substring(index + 1) : undefined;
	}

	protected _isWebExtensionResourceEndPoint(uri: URI): boolean {
		const uriPath = uri.path, serverRootPath = RemoteAuthorities.getServerRootPath();
		// test if the path starts with the server root path followed by the web extension resource end point segment
		return uriPath.startsWith(serverRootPath) && uriPath.startsWith(WEB_EXTENSION_RESOURCE_END_POINT_SEGMENT, serverRootPath.length);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensionResourceLoader/common/extensionResourceLoaderService.ts]---
Location: vscode-main/src/vs/platform/extensionResourceLoader/common/extensionResourceLoaderService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { IFileService } from '../../files/common/files.js';
import { IProductService } from '../../product/common/productService.js';
import { asTextOrError, IRequestService } from '../../request/common/request.js';
import { IStorageService } from '../../storage/common/storage.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { AbstractExtensionResourceLoaderService, IExtensionResourceLoaderService } from './extensionResourceLoader.js';
import { IExtensionGalleryManifestService } from '../../extensionManagement/common/extensionGalleryManifest.js';
import { ILogService } from '../../log/common/log.js';

export class ExtensionResourceLoaderService extends AbstractExtensionResourceLoaderService {

	constructor(
		@IFileService fileService: IFileService,
		@IStorageService storageService: IStorageService,
		@IProductService productService: IProductService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IConfigurationService configurationService: IConfigurationService,
		@IExtensionGalleryManifestService extensionGalleryManifestService: IExtensionGalleryManifestService,
		@IRequestService private readonly _requestService: IRequestService,
		@ILogService logService: ILogService,
	) {
		super(fileService, storageService, productService, environmentService, configurationService, extensionGalleryManifestService, logService);
	}

	async readExtensionResource(uri: URI): Promise<string> {
		if (await this.isExtensionGalleryResource(uri)) {
			const headers = await this.getExtensionGalleryRequestHeaders();
			const requestContext = await this._requestService.request({ url: uri.toString(), headers }, CancellationToken.None);
			return (await asTextOrError(requestContext)) || '';
		}
		const result = await this._fileService.readFile(uri);
		return result.value.toString();
	}

}

registerSingleton(IExtensionResourceLoaderService, ExtensionResourceLoaderService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensions/common/extensionHostStarter.ts]---
Location: vscode-main/src/vs/platform/extensions/common/extensionHostStarter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IExtensionHostStarter = createDecorator<IExtensionHostStarter>('extensionHostStarter');

export const ipcExtensionHostStarterChannelName = 'extensionHostStarter';

export interface IExtensionHostProcessOptions {
	responseWindowId: number;
	responseChannel: string;
	responseNonce: string;
	env: { [key: string]: string | undefined };
	detached: boolean;
	execArgv: string[] | undefined;
	silent: boolean;
}

export interface IExtensionHostStarter {
	readonly _serviceBrand: undefined;

	onDynamicStdout(id: string): Event<string>;
	onDynamicStderr(id: string): Event<string>;
	onDynamicMessage(id: string): Event<unknown>;
	onDynamicExit(id: string): Event<{ code: number; signal: string }>;

	createExtensionHost(): Promise<{ id: string }>;
	start(id: string, opts: IExtensionHostProcessOptions): Promise<{ pid: number | undefined }>;
	enableInspectPort(id: string): Promise<boolean>;
	kill(id: string): Promise<void>;

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensions/common/extensions.ts]---
Location: vscode-main/src/vs/platform/extensions/common/extensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Severity from '../../../base/common/severity.js';
import * as strings from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { ILocalizedString } from '../../action/common/action.js';
import { ExtensionKind } from '../../environment/common/environment.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { getRemoteName } from '../../remote/common/remoteHosts.js';

export const USER_MANIFEST_CACHE_FILE = 'extensions.user.cache';
export const BUILTIN_MANIFEST_CACHE_FILE = 'extensions.builtin.cache';
export const UNDEFINED_PUBLISHER = 'undefined_publisher';

export interface ICommand {
	command: string;
	title: string | ILocalizedString;
	category?: string | ILocalizedString;
}

export interface IDebugger {
	label?: string;
	type: string;
	runtime?: string;
}

export interface IGrammar {
	language?: string;
}

export interface IJSONValidation {
	fileMatch: string | string[];
	url: string;
}

export interface IKeyBinding {
	command: string;
	key: string;
	when?: string;
	mac?: string;
	linux?: string;
	win?: string;
}

export interface ILanguage {
	id: string;
	extensions: string[];
	aliases: string[];
}

export interface IMenu {
	command: string;
	alt?: string;
	when?: string;
	group?: string;
}

export interface ISnippet {
	language: string;
}

export interface ITheme {
	label: string;
}

export interface IViewContainer {
	id: string;
	title: string;
}

export interface IView {
	id: string;
	name: string;
}

export interface IColor {
	id: string;
	description: string;
	defaults: { light: string; dark: string; highContrast: string };
}

interface IWebviewEditor {
	readonly viewType: string;
	readonly priority: string;
	readonly selector: readonly {
		readonly filenamePattern?: string;
	}[];
}

export interface ICodeActionContributionAction {
	readonly kind: string;
	readonly title: string;
	readonly description?: string;
}

export interface ICodeActionContribution {
	readonly languages: readonly string[];
	readonly actions: readonly ICodeActionContributionAction[];
}

export interface IAuthenticationContribution {
	readonly id: string;
	readonly label: string;
	readonly authorizationServerGlobs?: string[];
}

export interface IWalkthroughStep {
	readonly id: string;
	readonly title: string;
	readonly description: string | undefined;
	readonly media:
	| { image: string | { dark: string; light: string; hc: string }; altText: string; markdown?: never; svg?: never; video?: never }
	| { markdown: string; image?: never; svg?: never; video?: never }
	| { svg: string; altText: string; markdown?: never; image?: never; video?: never }
	| { video: string | { dark: string; light: string; hc: string }; poster: string | { dark: string; light: string; hc: string }; altText: string; markdown?: never; image?: never; svg?: never };
	readonly completionEvents?: string[];
	/** @deprecated use `completionEvents: 'onCommand:...'` */
	readonly doneOn?: { command: string };
	readonly when?: string;
}

export interface IWalkthrough {
	readonly id: string;
	readonly title: string;
	readonly icon?: string;
	readonly description: string;
	readonly steps: IWalkthroughStep[];
	readonly featuredFor: string[] | undefined;
	readonly when?: string;
}

export interface IStartEntry {
	readonly title: string;
	readonly description: string;
	readonly command: string;
	readonly when?: string;
	readonly category: 'file' | 'folder' | 'notebook';
}

export interface INotebookEntry {
	readonly type: string;
	readonly displayName: string;
}

export interface INotebookRendererContribution {
	readonly id: string;
	readonly displayName: string;
	readonly mimeTypes: string[];
}

export interface IDebugVisualizationContribution {
	readonly id: string;
	readonly when: string;
}

export interface ITranslation {
	id: string;
	path: string;
}

export interface ILocalizationContribution {
	languageId: string;
	languageName?: string;
	localizedLanguageName?: string;
	translations: ITranslation[];
	minimalTranslations?: { [key: string]: string };
}

export interface IChatParticipantContribution {
	id: string;
	name: string;
	fullName: string;
	description?: string;
	isDefault?: boolean;
	commands?: { name: string }[];
}

export interface IToolContribution {
	name: string;
	displayName: string;
	modelDescription: string;
	userDescription?: string;
}

export interface IToolSetContribution {
	name: string;
	referenceName: string;
	description: string;
	icon?: string;
	tools: string[];
}

export interface IMcpCollectionContribution {
	readonly id: string;
	readonly label: string;
	readonly when?: string;
}

export interface IExtensionContributions {
	commands?: ICommand[];
	configuration?: any;
	configurationDefaults?: any;
	debuggers?: IDebugger[];
	grammars?: IGrammar[];
	jsonValidation?: IJSONValidation[];
	keybindings?: IKeyBinding[];
	languages?: ILanguage[];
	menus?: { [context: string]: IMenu[] };
	snippets?: ISnippet[];
	themes?: ITheme[];
	iconThemes?: ITheme[];
	productIconThemes?: ITheme[];
	viewsContainers?: { [location: string]: IViewContainer[] };
	views?: { [location: string]: IView[] };
	colors?: IColor[];
	localizations?: ILocalizationContribution[];
	readonly customEditors?: readonly IWebviewEditor[];
	readonly codeActions?: readonly ICodeActionContribution[];
	authentication?: IAuthenticationContribution[];
	walkthroughs?: IWalkthrough[];
	startEntries?: IStartEntry[];
	readonly notebooks?: INotebookEntry[];
	readonly notebookRenderer?: INotebookRendererContribution[];
	readonly debugVisualizers?: IDebugVisualizationContribution[];
	readonly chatParticipants?: ReadonlyArray<IChatParticipantContribution>;
	readonly languageModelTools?: ReadonlyArray<IToolContribution>;
	readonly languageModelToolSets?: ReadonlyArray<IToolSetContribution>;
	readonly mcpServerDefinitionProviders?: ReadonlyArray<IMcpCollectionContribution>;
}

export interface IExtensionCapabilities {
	readonly virtualWorkspaces?: ExtensionVirtualWorkspaceSupport;
	readonly untrustedWorkspaces?: ExtensionUntrustedWorkspaceSupport;
}


export const ALL_EXTENSION_KINDS: readonly ExtensionKind[] = ['ui', 'workspace', 'web'];

export type LimitedWorkspaceSupportType = 'limited';
export type ExtensionUntrustedWorkspaceSupportType = boolean | LimitedWorkspaceSupportType;
export type ExtensionUntrustedWorkspaceSupport = { supported: true } | { supported: false; description: string } | { supported: LimitedWorkspaceSupportType; description: string; restrictedConfigurations?: string[] };

export type ExtensionVirtualWorkspaceSupportType = boolean | LimitedWorkspaceSupportType;
export type ExtensionVirtualWorkspaceSupport = boolean | { supported: true } | { supported: false | LimitedWorkspaceSupportType; description: string };

export function getWorkspaceSupportTypeMessage(supportType: ExtensionUntrustedWorkspaceSupport | ExtensionVirtualWorkspaceSupport | undefined): string | undefined {
	if (typeof supportType === 'object' && supportType !== null) {
		if (supportType.supported !== true) {
			return supportType.description;
		}
	}
	return undefined;
}


export interface IExtensionIdentifier {
	id: string;
	uuid?: string;
}

export const EXTENSION_CATEGORIES = [
	'AI',
	'Azure',
	'Chat',
	'Data Science',
	'Debuggers',
	'Extension Packs',
	'Education',
	'Formatters',
	'Keymaps',
	'Language Packs',
	'Linters',
	'Machine Learning',
	'Notebooks',
	'Programming Languages',
	'SCM Providers',
	'Snippets',
	'Testing',
	'Themes',
	'Visualization',
	'Other',
];

export interface IRelaxedExtensionManifest {
	name: string;
	displayName?: string;
	publisher: string;
	version: string;
	engines: { readonly vscode: string };
	description?: string;
	main?: string;
	type?: string;
	browser?: string;
	preview?: boolean;
	// For now this only supports pointing to l10n bundle files
	// but it will be used for package.l10n.json files in the future
	l10n?: string;
	icon?: string;
	categories?: string[];
	keywords?: string[];
	activationEvents?: readonly string[];
	extensionDependencies?: string[];
	extensionPack?: string[];
	extensionKind?: ExtensionKind | ExtensionKind[];
	contributes?: IExtensionContributions;
	repository?: { url: string };
	bugs?: { url: string };
	originalEnabledApiProposals?: readonly string[];
	enabledApiProposals?: readonly string[];
	api?: string;
	scripts?: { [key: string]: string };
	capabilities?: IExtensionCapabilities;
}

export type IExtensionManifest = Readonly<IRelaxedExtensionManifest>;

export const enum ExtensionType {
	System,
	User
}

export const enum TargetPlatform {
	WIN32_X64 = 'win32-x64',
	WIN32_ARM64 = 'win32-arm64',

	LINUX_X64 = 'linux-x64',
	LINUX_ARM64 = 'linux-arm64',
	LINUX_ARMHF = 'linux-armhf',

	ALPINE_X64 = 'alpine-x64',
	ALPINE_ARM64 = 'alpine-arm64',

	DARWIN_X64 = 'darwin-x64',
	DARWIN_ARM64 = 'darwin-arm64',

	WEB = 'web',

	UNIVERSAL = 'universal',
	UNKNOWN = 'unknown',
	UNDEFINED = 'undefined',
}

export interface IExtension {
	readonly type: ExtensionType;
	readonly isBuiltin: boolean;
	readonly identifier: IExtensionIdentifier;
	readonly manifest: IExtensionManifest;
	readonly location: URI;
	readonly targetPlatform: TargetPlatform;
	readonly publisherDisplayName?: string;
	readonly readmeUrl?: URI;
	readonly changelogUrl?: URI;
	readonly isValid: boolean;
	readonly validations: readonly [Severity, string][];
	readonly preRelease: boolean;
}

/**
 * **!Do not construct directly!**
 *
 * **!Only static methods because it gets serialized!**
 *
 * This represents the "canonical" version for an extension identifier. Extension ids
 * have to be case-insensitive (due to the marketplace), but we must ensure case
 * preservation because the extension API is already public at this time.
 *
 * For example, given an extension with the publisher `"Hello"` and the name `"World"`,
 * its canonical extension identifier is `"Hello.World"`. This extension could be
 * referenced in some other extension's dependencies using the string `"hello.world"`.
 *
 * To make matters more complicated, an extension can optionally have an UUID. When two
 * extensions have the same UUID, they are considered equal even if their identifier is different.
 */
export class ExtensionIdentifier {
	public readonly value: string;

	/**
	 * Do not use directly. This is public to avoid mangling and thus
	 * allow compatibility between running from source and a built version.
	 */
	readonly _lower: string;

	constructor(value: string) {
		this.value = value;
		this._lower = value.toLowerCase();
	}

	public static equals(a: ExtensionIdentifier | string | null | undefined, b: ExtensionIdentifier | string | null | undefined) {
		if (typeof a === 'undefined' || a === null) {
			return (typeof b === 'undefined' || b === null);
		}
		if (typeof b === 'undefined' || b === null) {
			return false;
		}
		if (typeof a === 'string' || typeof b === 'string') {
			// At least one of the arguments is an extension id in string form,
			// so we have to use the string comparison which ignores case.
			const aValue = (typeof a === 'string' ? a : a.value);
			const bValue = (typeof b === 'string' ? b : b.value);
			return strings.equalsIgnoreCase(aValue, bValue);
		}

		// Now we know both arguments are ExtensionIdentifier
		return (a._lower === b._lower);
	}

	/**
	 * Gives the value by which to index (for equality).
	 */
	public static toKey(id: ExtensionIdentifier | string): string {
		if (typeof id === 'string') {
			return id.toLowerCase();
		}
		return id._lower;
	}
}

export class ExtensionIdentifierSet {

	private readonly _set = new Set<string>();

	public get size(): number {
		return this._set.size;
	}

	constructor(iterable?: Iterable<ExtensionIdentifier | string>) {
		if (iterable) {
			for (const value of iterable) {
				this.add(value);
			}
		}
	}

	public add(id: ExtensionIdentifier | string): void {
		this._set.add(ExtensionIdentifier.toKey(id));
	}

	public delete(extensionId: ExtensionIdentifier): boolean {
		return this._set.delete(ExtensionIdentifier.toKey(extensionId));
	}

	public has(id: ExtensionIdentifier | string): boolean {
		return this._set.has(ExtensionIdentifier.toKey(id));
	}
}

export class ExtensionIdentifierMap<T> {

	private readonly _map = new Map<string, T>();

	public clear(): void {
		this._map.clear();
	}

	public delete(id: ExtensionIdentifier | string): void {
		this._map.delete(ExtensionIdentifier.toKey(id));
	}

	public get(id: ExtensionIdentifier | string): T | undefined {
		return this._map.get(ExtensionIdentifier.toKey(id));
	}

	public has(id: ExtensionIdentifier | string): boolean {
		return this._map.has(ExtensionIdentifier.toKey(id));
	}

	public set(id: ExtensionIdentifier | string, value: T): void {
		this._map.set(ExtensionIdentifier.toKey(id), value);
	}

	public values(): IterableIterator<T> {
		return this._map.values();
	}

	forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void): void {
		this._map.forEach(callbackfn);
	}

	[Symbol.iterator](): IterableIterator<[string, T]> {
		return this._map[Symbol.iterator]();
	}
}

/**
 * An error that is clearly from an extension, identified by the `ExtensionIdentifier`
 */
export class ExtensionError extends Error {

	readonly extension: ExtensionIdentifier;

	constructor(extensionIdentifier: ExtensionIdentifier, cause: Error, message?: string) {
		super(`Error in extension ${ExtensionIdentifier.toKey(extensionIdentifier)}: ${message ?? cause.message}`, { cause });
		this.name = 'ExtensionError';
		this.extension = extensionIdentifier;
	}
}

export interface IRelaxedExtensionDescription extends IRelaxedExtensionManifest {
	id?: string;
	identifier: ExtensionIdentifier;
	uuid?: string;
	publisherDisplayName?: string;
	targetPlatform: TargetPlatform;
	isBuiltin: boolean;
	isUserBuiltin: boolean;
	isUnderDevelopment: boolean;
	extensionLocation: URI;
	preRelease: boolean;
}

export type IExtensionDescription = Readonly<IRelaxedExtensionDescription>;

export function isApplicationScopedExtension(manifest: IExtensionManifest): boolean {
	return isLanguagePackExtension(manifest);
}

export function isLanguagePackExtension(manifest: IExtensionManifest): boolean {
	return manifest.contributes && manifest.contributes.localizations ? manifest.contributes.localizations.length > 0 : false;
}

export function isAuthenticationProviderExtension(manifest: IExtensionManifest): boolean {
	return manifest.contributes && manifest.contributes.authentication ? manifest.contributes.authentication.length > 0 : false;
}

export function isResolverExtension(manifest: IExtensionManifest, remoteAuthority: string | undefined): boolean {
	if (remoteAuthority) {
		const activationEvent = `onResolveRemoteAuthority:${getRemoteName(remoteAuthority)}`;
		return !!manifest.activationEvents?.includes(activationEvent);
	}
	return false;
}

export function parseApiProposals(enabledApiProposals: string[]): { proposalName: string; version?: number }[] {
	return enabledApiProposals.map(proposal => {
		const [proposalName, version] = proposal.split('@');
		return { proposalName, version: version ? parseInt(version) : undefined };
	});
}

export function parseEnabledApiProposalNames(enabledApiProposals: string[]): string[] {
	return enabledApiProposals.map(proposal => proposal.split('@')[0]);
}

export const IBuiltinExtensionsScannerService = createDecorator<IBuiltinExtensionsScannerService>('IBuiltinExtensionsScannerService');
export interface IBuiltinExtensionsScannerService {
	readonly _serviceBrand: undefined;
	scanBuiltinExtensions(): Promise<IExtension[]>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/extensions/common/extensionsApiProposals.ts]---
Location: vscode-main/src/vs/platform/extensions/common/extensionsApiProposals.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY.

const _allApiProposals = {
	activeComment: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.activeComment.d.ts',
	},
	aiRelatedInformation: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.aiRelatedInformation.d.ts',
	},
	aiSettingsSearch: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.aiSettingsSearch.d.ts',
	},
	aiTextSearchProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.aiTextSearchProvider.d.ts',
		version: 2
	},
	authIssuers: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.authIssuers.d.ts',
	},
	authLearnMore: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.authLearnMore.d.ts',
	},
	authProviderSpecific: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.authProviderSpecific.d.ts',
	},
	authSession: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.authSession.d.ts',
	},
	authenticationChallenges: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.authenticationChallenges.d.ts',
	},
	canonicalUriProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.canonicalUriProvider.d.ts',
	},
	chatContextProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatContextProvider.d.ts',
	},
	chatEditing: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatEditing.d.ts',
	},
	chatOutputRenderer: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatOutputRenderer.d.ts',
	},
	chatParticipantAdditions: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatParticipantAdditions.d.ts',
	},
	chatParticipantPrivate: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatParticipantPrivate.d.ts',
		version: 11
	},
	chatProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatProvider.d.ts',
		version: 4
	},
	chatReferenceBinaryData: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatReferenceBinaryData.d.ts',
	},
	chatReferenceDiagnostic: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatReferenceDiagnostic.d.ts',
	},
	chatSessionsProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatSessionsProvider.d.ts',
		version: 3
	},
	chatStatusItem: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatStatusItem.d.ts',
	},
	chatTab: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.chatTab.d.ts',
	},
	codeActionAI: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.codeActionAI.d.ts',
	},
	codeActionRanges: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.codeActionRanges.d.ts',
	},
	codiconDecoration: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.codiconDecoration.d.ts',
	},
	commentReactor: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.commentReactor.d.ts',
	},
	commentReveal: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.commentReveal.d.ts',
	},
	commentThreadApplicability: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.commentThreadApplicability.d.ts',
	},
	commentingRangeHint: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.commentingRangeHint.d.ts',
	},
	commentsDraftState: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.commentsDraftState.d.ts',
	},
	contribAccessibilityHelpContent: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribAccessibilityHelpContent.d.ts',
	},
	contribCommentEditorActionsMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribCommentEditorActionsMenu.d.ts',
	},
	contribCommentPeekContext: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribCommentPeekContext.d.ts',
	},
	contribCommentThreadAdditionalMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribCommentThreadAdditionalMenu.d.ts',
	},
	contribCommentsViewThreadMenus: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribCommentsViewThreadMenus.d.ts',
	},
	contribDebugCreateConfiguration: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribDebugCreateConfiguration.d.ts',
	},
	contribDiffEditorGutterToolBarMenus: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribDiffEditorGutterToolBarMenus.d.ts',
	},
	contribEditSessions: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribEditSessions.d.ts',
	},
	contribEditorContentMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribEditorContentMenu.d.ts',
	},
	contribLabelFormatterWorkspaceTooltip: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribLabelFormatterWorkspaceTooltip.d.ts',
	},
	contribLanguageModelToolSets: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribLanguageModelToolSets.d.ts',
	},
	contribMenuBarHome: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribMenuBarHome.d.ts',
	},
	contribMergeEditorMenus: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribMergeEditorMenus.d.ts',
	},
	contribMultiDiffEditorMenus: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribMultiDiffEditorMenus.d.ts',
	},
	contribNotebookStaticPreloads: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribNotebookStaticPreloads.d.ts',
	},
	contribRemoteHelp: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribRemoteHelp.d.ts',
	},
	contribShareMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribShareMenu.d.ts',
	},
	contribSourceControlArtifactGroupMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribSourceControlArtifactGroupMenu.d.ts',
	},
	contribSourceControlArtifactMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribSourceControlArtifactMenu.d.ts',
	},
	contribSourceControlHistoryItemMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribSourceControlHistoryItemMenu.d.ts',
	},
	contribSourceControlHistoryTitleMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribSourceControlHistoryTitleMenu.d.ts',
	},
	contribSourceControlInputBoxMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribSourceControlInputBoxMenu.d.ts',
	},
	contribSourceControlTitleMenu: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribSourceControlTitleMenu.d.ts',
	},
	contribStatusBarItems: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribStatusBarItems.d.ts',
	},
	contribViewContainerTitle: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribViewContainerTitle.d.ts',
	},
	contribViewsRemote: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribViewsRemote.d.ts',
	},
	contribViewsWelcome: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.contribViewsWelcome.d.ts',
	},
	customEditorMove: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.customEditorMove.d.ts',
	},
	dataChannels: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.dataChannels.d.ts',
	},
	debugVisualization: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.debugVisualization.d.ts',
	},
	defaultChatParticipant: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.defaultChatParticipant.d.ts',
		version: 4
	},
	devDeviceId: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.devDeviceId.d.ts',
	},
	diffCommand: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.diffCommand.d.ts',
	},
	diffContentOptions: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.diffContentOptions.d.ts',
	},
	documentFiltersExclusive: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.documentFiltersExclusive.d.ts',
	},
	editSessionIdentityProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.editSessionIdentityProvider.d.ts',
	},
	editorHoverVerbosityLevel: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.editorHoverVerbosityLevel.d.ts',
	},
	editorInsets: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.editorInsets.d.ts',
	},
	embeddings: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.embeddings.d.ts',
	},
	extensionRuntime: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.extensionRuntime.d.ts',
	},
	extensionsAny: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.extensionsAny.d.ts',
	},
	externalUriOpener: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.externalUriOpener.d.ts',
	},
	fileSearchProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.fileSearchProvider.d.ts',
	},
	fileSearchProvider2: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.fileSearchProvider2.d.ts',
	},
	findFiles2: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.findFiles2.d.ts',
		version: 2
	},
	findTextInFiles: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.findTextInFiles.d.ts',
	},
	findTextInFiles2: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.findTextInFiles2.d.ts',
	},
	fsChunks: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.fsChunks.d.ts',
	},
	inlineCompletionsAdditions: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.inlineCompletionsAdditions.d.ts',
	},
	interactive: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.interactive.d.ts',
	},
	interactiveWindow: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.interactiveWindow.d.ts',
	},
	ipc: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.ipc.d.ts',
	},
	languageModelCapabilities: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.languageModelCapabilities.d.ts',
	},
	languageModelProxy: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.languageModelProxy.d.ts',
	},
	languageModelSystem: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.languageModelSystem.d.ts',
	},
	languageModelThinkingPart: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.languageModelThinkingPart.d.ts',
		version: 1
	},
	languageModelToolResultAudience: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.languageModelToolResultAudience.d.ts',
	},
	languageStatusText: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.languageStatusText.d.ts',
	},
	mappedEditsProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.mappedEditsProvider.d.ts',
	},
	markdownAlertSyntax: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.markdownAlertSyntax.d.ts',
	},
	mcpToolDefinitions: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.mcpToolDefinitions.d.ts',
	},
	multiDocumentHighlightProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.multiDocumentHighlightProvider.d.ts',
	},
	nativeWindowHandle: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.nativeWindowHandle.d.ts',
	},
	newSymbolNamesProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.newSymbolNamesProvider.d.ts',
	},
	notebookCellExecution: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookCellExecution.d.ts',
	},
	notebookControllerAffinityHidden: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookControllerAffinityHidden.d.ts',
	},
	notebookDeprecated: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookDeprecated.d.ts',
	},
	notebookExecution: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookExecution.d.ts',
	},
	notebookKernelSource: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookKernelSource.d.ts',
	},
	notebookLiveShare: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookLiveShare.d.ts',
	},
	notebookMessaging: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookMessaging.d.ts',
	},
	notebookMime: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookMime.d.ts',
	},
	notebookReplDocument: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookReplDocument.d.ts',
	},
	notebookVariableProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.notebookVariableProvider.d.ts',
	},
	portsAttributes: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.portsAttributes.d.ts',
	},
	profileContentHandlers: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.profileContentHandlers.d.ts',
	},
	quickDiffProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.quickDiffProvider.d.ts',
	},
	quickInputButtonLocation: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.quickInputButtonLocation.d.ts',
	},
	quickPickItemTooltip: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.quickPickItemTooltip.d.ts',
	},
	quickPickSortByLabel: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.quickPickSortByLabel.d.ts',
	},
	remoteCodingAgents: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.remoteCodingAgents.d.ts',
	},
	resolvers: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.resolvers.d.ts',
	},
	scmActionButton: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.scmActionButton.d.ts',
	},
	scmArtifactProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.scmArtifactProvider.d.ts',
	},
	scmHistoryProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.scmHistoryProvider.d.ts',
	},
	scmMultiDiffEditor: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.scmMultiDiffEditor.d.ts',
	},
	scmProviderOptions: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.scmProviderOptions.d.ts',
	},
	scmSelectedProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.scmSelectedProvider.d.ts',
	},
	scmTextDocument: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.scmTextDocument.d.ts',
	},
	scmValidation: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.scmValidation.d.ts',
	},
	shareProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.shareProvider.d.ts',
	},
	speech: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.speech.d.ts',
	},
	statusBarItemTooltip: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.statusBarItemTooltip.d.ts',
	},
	tabInputMultiDiff: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.tabInputMultiDiff.d.ts',
	},
	tabInputTextMerge: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.tabInputTextMerge.d.ts',
	},
	taskExecutionTerminal: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.taskExecutionTerminal.d.ts',
	},
	taskPresentationGroup: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.taskPresentationGroup.d.ts',
	},
	taskProblemMatcherStatus: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.taskProblemMatcherStatus.d.ts',
	},
	telemetry: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.telemetry.d.ts',
	},
	terminalCompletionProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.terminalCompletionProvider.d.ts',
	},
	terminalDataWriteEvent: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.terminalDataWriteEvent.d.ts',
	},
	terminalDimensions: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.terminalDimensions.d.ts',
	},
	terminalExecuteCommandEvent: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.terminalExecuteCommandEvent.d.ts',
	},
	terminalQuickFixProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.terminalQuickFixProvider.d.ts',
	},
	terminalSelection: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.terminalSelection.d.ts',
	},
	terminalShellEnv: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.terminalShellEnv.d.ts',
	},
	testObserver: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.testObserver.d.ts',
	},
	testRelatedCode: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.testRelatedCode.d.ts',
	},
	textDocumentChangeReason: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.textDocumentChangeReason.d.ts',
	},
	textEditorDiffInformation: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.textEditorDiffInformation.d.ts',
	},
	textSearchComplete2: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.textSearchComplete2.d.ts',
	},
	textSearchProvider: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.textSearchProvider.d.ts',
	},
	textSearchProvider2: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.textSearchProvider2.d.ts',
	},
	timeline: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.timeline.d.ts',
	},
	tokenInformation: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.tokenInformation.d.ts',
	},
	toolProgress: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.toolProgress.d.ts',
	},
	treeItemMarkdownLabel: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.treeItemMarkdownLabel.d.ts',
	},
	treeViewActiveItem: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.treeViewActiveItem.d.ts',
	},
	treeViewMarkdownMessage: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.treeViewMarkdownMessage.d.ts',
	},
	treeViewReveal: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.treeViewReveal.d.ts',
	},
	tunnelFactory: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.tunnelFactory.d.ts',
	},
	tunnels: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.tunnels.d.ts',
	},
	valueSelectionInQuickPick: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.valueSelectionInQuickPick.d.ts',
	},
	workspaceTrust: {
		proposal: 'https://raw.githubusercontent.com/microsoft/vscode/main/src/vscode-dts/vscode.proposed.workspaceTrust.d.ts',
	}
};
export const allApiProposals = Object.freeze<{ [proposalName: string]: Readonly<{ proposal: string; version?: number }> }>(_allApiProposals);
export type ApiProposalName = keyof typeof _allApiProposals;
```

--------------------------------------------------------------------------------

````
