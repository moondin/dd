---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 395
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 395 of 552)

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

---[FILE: src/vs/workbench/contrib/extensions/test/electron-browser/extensionsViews.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/test/electron-browser/extensionsViews.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ExtensionsListView } from '../../browser/extensionsViews.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IExtensionsWorkbenchService } from '../../common/extensions.js';
import { ExtensionsWorkbenchService } from '../../browser/extensionsWorkbenchService.js';
import {
	IExtensionManagementService, IExtensionGalleryService, ILocalExtension, IGalleryExtension, IQueryOptions,
	getTargetPlatform, SortBy
} from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { IWorkbenchExtensionEnablementService, EnablementState, IExtensionManagementServerService, IExtensionManagementServer, IProfileAwareExtensionManagementService, IWorkbenchExtensionManagementService } from '../../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionRecommendationsService, ExtensionRecommendationReason } from '../../../../services/extensionRecommendations/common/extensionRecommendations.js';
import { getGalleryExtensionId } from '../../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { TestExtensionEnablementService } from '../../../../services/extensionManagement/test/browser/extensionEnablementService.test.js';
import { ExtensionGalleryService } from '../../../../../platform/extensionManagement/common/extensionGalleryService.js';
import { IURLService } from '../../../../../platform/url/common/url.js';
import { Event } from '../../../../../base/common/event.js';
import { IPager } from '../../../../../base/common/paging.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IExtensionService, toExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { TestMenuService } from '../../../../test/browser/workbenchTestServices.js';
import { TestSharedProcessService } from '../../../../test/electron-browser/workbenchTestServices.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { NativeURLService } from '../../../../../platform/url/common/urlService.js';
import { URI } from '../../../../../base/common/uri.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { SinonStub } from 'sinon';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { RemoteAgentService } from '../../../../services/remote/electron-browser/remoteAgentService.js';
import { ExtensionType, IExtension } from '../../../../../platform/extensions/common/extensions.js';
import { ISharedProcessService } from '../../../../../platform/ipc/electron-browser/services.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { IMenuService } from '../../../../../platform/actions/common/actions.js';
import { TestContextService } from '../../../../test/common/workbenchTestServices.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../../common/views.js';
import { Schemas } from '../../../../../base/common/network.js';
import { platform } from '../../../../../base/common/platform.js';
import { arch } from '../../../../../base/common/process.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IUpdateService, State } from '../../../../../platform/update/common/update.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { IUserDataProfileService } from '../../../../services/userDataProfile/common/userDataProfile.js';
import { UserDataProfileService } from '../../../../services/userDataProfile/common/userDataProfileService.js';
import { toUserDataProfile } from '../../../../../platform/userDataProfile/common/userDataProfile.js';

suite('ExtensionsViews Tests', () => {

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let testableView: ExtensionsListView;

	const localEnabledTheme = aLocalExtension('first-enabled-extension', { categories: ['Themes', 'random'] }, { installedTimestamp: 123456 });
	const localEnabledLanguage = aLocalExtension('second-enabled-extension', { categories: ['Programming languages'], version: '1.0.0' }, { installedTimestamp: Date.now(), updated: false });
	const localDisabledTheme = aLocalExtension('first-disabled-extension', { categories: ['themes'] }, { installedTimestamp: 234567 });
	const localDisabledLanguage = aLocalExtension('second-disabled-extension', { categories: ['programming languages'] }, { installedTimestamp: Date.now() - 50000, updated: true });
	const localRandom = aLocalExtension('random-enabled-extension', { categories: ['random'] }, { installedTimestamp: 345678 });
	const builtInTheme = aLocalExtension('my-theme', { categories: ['Themes'], contributes: { themes: ['my-theme'] } }, { type: ExtensionType.System, installedTimestamp: 222 });
	const builtInBasic = aLocalExtension('my-lang', { categories: ['Programming Languages'], contributes: { grammars: [{ language: 'my-language' }] } }, { type: ExtensionType.System, installedTimestamp: 666666 });

	let queryPage = aPage([]);
	const galleryExtensions: IGalleryExtension[] = [];

	const workspaceRecommendationA = aGalleryExtension('workspace-recommendation-A');
	const workspaceRecommendationB = aGalleryExtension('workspace-recommendation-B');
	const configBasedRecommendationA = aGalleryExtension('configbased-recommendation-A');
	const configBasedRecommendationB = aGalleryExtension('configbased-recommendation-B');
	const fileBasedRecommendationA = aGalleryExtension('filebased-recommendation-A');
	const fileBasedRecommendationB = aGalleryExtension('filebased-recommendation-B');
	const otherRecommendationA = aGalleryExtension('other-recommendation-A');

	setup(async () => {
		instantiationService = disposableStore.add(new TestInstantiationService());
		instantiationService.stub(ITelemetryService, NullTelemetryService);
		instantiationService.stub(ILogService, NullLogService);
		instantiationService.stub(IFileService, disposableStore.add(new FileService(new NullLogService())));
		instantiationService.stub(IProductService, {});

		instantiationService.stub(IWorkspaceContextService, new TestContextService());
		instantiationService.stub(IConfigurationService, new TestConfigurationService());

		instantiationService.stub(IExtensionGalleryService, ExtensionGalleryService);
		instantiationService.stub(ISharedProcessService, TestSharedProcessService);

		instantiationService.stub(IWorkbenchExtensionManagementService, {
			onInstallExtension: Event.None,
			onDidInstallExtensions: Event.None,
			onUninstallExtension: Event.None,
			onDidUninstallExtension: Event.None,
			onDidUpdateExtensionMetadata: Event.None,
			onDidChangeProfile: Event.None,
			onProfileAwareDidInstallExtensions: Event.None,
			async getInstalled() { return []; },
			async getInstalledWorkspaceExtensions() { return []; },
			async canInstall() { return true; },
			async getExtensionsControlManifest() { return { malicious: [], deprecated: {}, search: [], publisherMapping: {} }; },
			async getTargetPlatform() { return getTargetPlatform(platform, arch); },
			async updateMetadata(local) { return local; }
		});
		instantiationService.stub(IRemoteAgentService, RemoteAgentService);
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IMenuService, new TestMenuService());

		const localExtensionManagementServer = { extensionManagementService: instantiationService.get(IExtensionManagementService) as IProfileAwareExtensionManagementService, label: 'local', id: 'vscode-local' };
		instantiationService.stub(IExtensionManagementServerService, {
			get localExtensionManagementServer(): IExtensionManagementServer {
				return localExtensionManagementServer;
			},
			getExtensionManagementServer(extension: IExtension): IExtensionManagementServer | null {
				if (extension.location.scheme === Schemas.file) {
					return localExtensionManagementServer;
				}
				throw new Error(`Invalid Extension ${extension.location}`);
			}
		});

		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		instantiationService.stub(IUserDataProfileService, disposableStore.add(new UserDataProfileService(toUserDataProfile('test', 'test', URI.file('foo'), URI.file('cache')))));

		const reasons: { [key: string]: any } = {};
		reasons[workspaceRecommendationA.identifier.id] = { reasonId: ExtensionRecommendationReason.Workspace };
		reasons[workspaceRecommendationB.identifier.id] = { reasonId: ExtensionRecommendationReason.Workspace };
		reasons[fileBasedRecommendationA.identifier.id] = { reasonId: ExtensionRecommendationReason.File };
		reasons[fileBasedRecommendationB.identifier.id] = { reasonId: ExtensionRecommendationReason.File };
		reasons[otherRecommendationA.identifier.id] = { reasonId: ExtensionRecommendationReason.Executable };
		reasons[configBasedRecommendationA.identifier.id] = { reasonId: ExtensionRecommendationReason.WorkspaceConfig };
		instantiationService.stub(IExtensionRecommendationsService, {
			getWorkspaceRecommendations() {
				return Promise.resolve([
					workspaceRecommendationA.identifier.id,
					workspaceRecommendationB.identifier.id]);
			},
			getConfigBasedRecommendations() {
				return Promise.resolve({
					important: [configBasedRecommendationA.identifier.id],
					others: [configBasedRecommendationB.identifier.id],
				});
			},
			getImportantRecommendations(): Promise<string[]> {
				return Promise.resolve([]);
			},
			getFileBasedRecommendations() {
				return [
					fileBasedRecommendationA.identifier.id,
					fileBasedRecommendationB.identifier.id
				];
			},
			getOtherRecommendations() {
				return Promise.resolve([
					configBasedRecommendationB.identifier.id,
					otherRecommendationA.identifier.id
				]);
			},
			getAllRecommendationsWithReason() {
				return reasons;
			}
		});
		instantiationService.stub(IURLService, NativeURLService);

		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [localEnabledTheme, localEnabledLanguage, localRandom, localDisabledTheme, localDisabledLanguage, builtInTheme, builtInBasic]);
		instantiationService.stubPromise(IExtensionManagementService, 'getExtensgetExtensionsControlManifestionsReport', {});

		instantiationService.stub(IExtensionGalleryService, <Partial<IExtensionGalleryService>>{
			query: async () => {
				return queryPage;
			},
			getCompatibleExtension: async (gallery) => {
				return gallery;
			},
			getExtensions: async (infos) => {
				const result: IGalleryExtension[] = [];
				for (const info of infos) {
					const extension = galleryExtensions.find(e => e.identifier.id === info.id);
					if (extension) {
						result.push(extension);
					}
				}
				return result;
			},
			isEnabled: () => true,
			isExtensionCompatible: async () => true,
		});

		instantiationService.stub(IViewDescriptorService, {
			getViewLocationById(): ViewContainerLocation {
				return ViewContainerLocation.Sidebar;
			},
			onDidChangeLocation: Event.None
		});

		instantiationService.stub(IExtensionService, {
			onDidChangeExtensions: Event.None,
			extensions: [
				toExtensionDescription(localEnabledTheme),
				toExtensionDescription(localEnabledLanguage),
				toExtensionDescription(localRandom),
				toExtensionDescription(builtInTheme),
				toExtensionDescription(builtInBasic)
			],
			canAddExtension: (extension) => true,
			whenInstalledExtensionsRegistered: () => Promise.resolve(true)
		});
		await (<TestExtensionEnablementService>instantiationService.get(IWorkbenchExtensionEnablementService)).setEnablement([localDisabledTheme], EnablementState.DisabledGlobally);
		await (<TestExtensionEnablementService>instantiationService.get(IWorkbenchExtensionEnablementService)).setEnablement([localDisabledLanguage], EnablementState.DisabledGlobally);

		instantiationService.stub(IUpdateService, { onStateChange: Event.None, state: State.Uninitialized });
		instantiationService.set(IExtensionsWorkbenchService, disposableStore.add(instantiationService.createInstance(ExtensionsWorkbenchService)));
		testableView = disposableStore.add(instantiationService.createInstance(ExtensionsListView, {}, { id: '', title: '' }));
		queryPage = aPage([]);

		galleryExtensions.splice(0, galleryExtensions.length, ...[
			workspaceRecommendationA,
			workspaceRecommendationB,
			configBasedRecommendationA,
			configBasedRecommendationB,
			fileBasedRecommendationA,
			fileBasedRecommendationB,
			otherRecommendationA
		]);
	});

	test('Test query types', () => {
		assert.strictEqual(ExtensionsListView.isBuiltInExtensionsQuery('@builtin'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@installed'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@enabled'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@disabled'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@outdated'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@updates'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@sort:name'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@sort:updateDate'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@installed searchText'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@enabled searchText'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@disabled searchText'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@outdated searchText'), true);
		assert.strictEqual(ExtensionsListView.isLocalExtensionsQuery('@updates searchText'), true);
	});

	test('Test empty query equates to sort by install count', async () => {
		const target = <SinonStub>instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage());
		await testableView.show('');
		assert.ok(target.calledOnce);
		const options: IQueryOptions = target.args[0][0];
		assert.strictEqual(options.sortBy, SortBy.InstallCount);
	});

	test('Test non empty query without sort doesnt use sortBy', async () => {
		const target = <SinonStub>instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage());
		await testableView.show('some extension');
		assert.ok(target.calledOnce);
		const options: IQueryOptions = target.args[0][0];
		assert.strictEqual(options.sortBy, undefined);
	});

	test('Test query with sort uses sortBy', async () => {
		const target = <SinonStub>instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage());
		await testableView.show('some extension @sort:rating');
		assert.ok(target.calledOnce);
		const options: IQueryOptions = target.args[0][0];
		assert.strictEqual(options.sortBy, SortBy.WeightedRating);
	});

	test('Test default view actions required sorting', async () => {
		queryPage = aPage([aGalleryExtension(localEnabledLanguage.manifest.name, { ...localEnabledLanguage.manifest, version: '1.0.1', identifier: localDisabledLanguage.identifier })]);

		const workbenchService = instantiationService.get(IExtensionsWorkbenchService);
		const extension = (await workbenchService.queryLocal()).find(ex => ex.identifier.id === localEnabledLanguage.identifier.id);

		await new Promise<void>(c => {
			const disposable = workbenchService.onChange(() => {
				if (extension?.outdated) {
					disposable.dispose();
					c();
				}
			});
			instantiationService.get(IExtensionsWorkbenchService).queryGallery(CancellationToken.None);
		});

		const result = await testableView.show('@installed');
		assert.strictEqual(result.length, 5, 'Unexpected number of results for @installed query');
		const actual = [result.get(0).name, result.get(1).name, result.get(2).name, result.get(3).name, result.get(4).name];
		const expected = [localEnabledLanguage.manifest.name, localEnabledTheme.manifest.name, localRandom.manifest.name, localDisabledTheme.manifest.name, localDisabledLanguage.manifest.name];
		for (let i = 0; i < result.length; i++) {
			assert.strictEqual(actual[i], expected[i], 'Unexpected extension for @installed query with outadted extension.');
		}
	});

	test('Test installed query results', async () => {
		await testableView.show('@installed').then(result => {
			assert.strictEqual(result.length, 5, 'Unexpected number of results for @installed query');
			const actual = [result.get(0).name, result.get(1).name, result.get(2).name, result.get(3).name, result.get(4).name].sort();
			const expected = [localDisabledTheme.manifest.name, localEnabledTheme.manifest.name, localRandom.manifest.name, localDisabledLanguage.manifest.name, localEnabledLanguage.manifest.name];
			for (let i = 0; i < result.length; i++) {
				assert.strictEqual(actual[i], expected[i], 'Unexpected extension for @installed query.');
			}
		});

		await testableView.show('@installed first').then(result => {
			assert.strictEqual(result.length, 2, 'Unexpected number of results for @installed query');
			assert.strictEqual(result.get(0).name, localEnabledTheme.manifest.name, 'Unexpected extension for @installed query with search text.');
			assert.strictEqual(result.get(1).name, localDisabledTheme.manifest.name, 'Unexpected extension for @installed query with search text.');
		});

		await testableView.show('@disabled').then(result => {
			assert.strictEqual(result.length, 2, 'Unexpected number of results for @disabled query');
			assert.strictEqual(result.get(0).name, localDisabledTheme.manifest.name, 'Unexpected extension for @disabled query.');
			assert.strictEqual(result.get(1).name, localDisabledLanguage.manifest.name, 'Unexpected extension for @disabled query.');
		});

		await testableView.show('@enabled').then(result => {
			assert.strictEqual(result.length, 3, 'Unexpected number of results for @enabled query');
			assert.strictEqual(result.get(0).name, localEnabledTheme.manifest.name, 'Unexpected extension for @enabled query.');
			assert.strictEqual(result.get(1).name, localRandom.manifest.name, 'Unexpected extension for @enabled query.');
			assert.strictEqual(result.get(2).name, localEnabledLanguage.manifest.name, 'Unexpected extension for @enabled query.');
		});

		await testableView.show('@builtin category:themes').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @builtin category:themes query');
			assert.strictEqual(result.get(0).name, builtInTheme.manifest.name, 'Unexpected extension for @builtin:themes query.');
		});

		await testableView.show('@builtin category:"programming languages"').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @builtin:basics query');
			assert.strictEqual(result.get(0).name, builtInBasic.manifest.name, 'Unexpected extension for @builtin:basics query.');
		});

		await testableView.show('@builtin').then(result => {
			assert.strictEqual(result.length, 2, 'Unexpected number of results for @builtin query');
			assert.strictEqual(result.get(0).name, builtInBasic.manifest.name, 'Unexpected extension for @builtin query.');
			assert.strictEqual(result.get(1).name, builtInTheme.manifest.name, 'Unexpected extension for @builtin query.');
		});

		await testableView.show('@builtin my-theme').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @builtin query');
			assert.strictEqual(result.get(0).name, builtInTheme.manifest.name, 'Unexpected extension for @builtin query.');
		});
	});

	test('Test installed query with category', async () => {
		await testableView.show('@installed category:themes').then(result => {
			assert.strictEqual(result.length, 2, 'Unexpected number of results for @installed query with category');
			assert.strictEqual(result.get(0).name, localEnabledTheme.manifest.name, 'Unexpected extension for @installed query with category.');
			assert.strictEqual(result.get(1).name, localDisabledTheme.manifest.name, 'Unexpected extension for @installed query with category.');
		});

		await testableView.show('@installed category:"themes"').then(result => {
			assert.strictEqual(result.length, 2, 'Unexpected number of results for @installed query with quoted category');
			assert.strictEqual(result.get(0).name, localEnabledTheme.manifest.name, 'Unexpected extension for @installed query with quoted category.');
			assert.strictEqual(result.get(1).name, localDisabledTheme.manifest.name, 'Unexpected extension for @installed query with quoted category.');
		});

		await testableView.show('@installed category:"programming languages"').then(result => {
			assert.strictEqual(result.length, 2, 'Unexpected number of results for @installed query with quoted category including space');
			assert.strictEqual(result.get(0).name, localEnabledLanguage.manifest.name, 'Unexpected extension for @installed query with quoted category including space.');
			assert.strictEqual(result.get(1).name, localDisabledLanguage.manifest.name, 'Unexpected extension for @installed query with quoted category inlcuding space.');
		});

		await testableView.show('@installed category:themes category:random').then(result => {
			assert.strictEqual(result.length, 3, 'Unexpected number of results for @installed query with multiple category');
			assert.strictEqual(result.get(0).name, localEnabledTheme.manifest.name, 'Unexpected extension for @installed query with multiple category.');
			assert.strictEqual(result.get(1).name, localRandom.manifest.name, 'Unexpected extension for @installed query with multiple category.');
			assert.strictEqual(result.get(2).name, localDisabledTheme.manifest.name, 'Unexpected extension for @installed query with multiple category.');
		});

		await testableView.show('@enabled category:themes').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @enabled query with category');
			assert.strictEqual(result.get(0).name, localEnabledTheme.manifest.name, 'Unexpected extension for @enabled query with category.');
		});

		await testableView.show('@enabled category:"themes"').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @enabled query with quoted category');
			assert.strictEqual(result.get(0).name, localEnabledTheme.manifest.name, 'Unexpected extension for @enabled query with quoted category.');
		});

		await testableView.show('@enabled category:"programming languages"').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @enabled query with quoted category inlcuding space');
			assert.strictEqual(result.get(0).name, localEnabledLanguage.manifest.name, 'Unexpected extension for @enabled query with quoted category including space.');
		});

		await testableView.show('@disabled category:themes').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @disabled query with category');
			assert.strictEqual(result.get(0).name, localDisabledTheme.manifest.name, 'Unexpected extension for @disabled query with category.');
		});

		await testableView.show('@disabled category:"themes"').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @disabled query with quoted category');
			assert.strictEqual(result.get(0).name, localDisabledTheme.manifest.name, 'Unexpected extension for @disabled query with quoted category.');
		});

		await testableView.show('@disabled category:"programming languages"').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @disabled query with quoted category inlcuding space');
			assert.strictEqual(result.get(0).name, localDisabledLanguage.manifest.name, 'Unexpected extension for @disabled query with quoted category including space.');
		});
	});

	test('Test local query with sorting order', async () => {
		await testableView.show('@recentlyUpdated').then(result => {
			assert.strictEqual(result.length, 1, 'Unexpected number of results for @recentlyUpdated');
			assert.strictEqual(result.get(0).name, localDisabledLanguage.manifest.name, 'Unexpected default sort order of extensions for @recentlyUpdate query');
		});

		await testableView.show('@installed @sort:updateDate').then(result => {
			assert.strictEqual(result.length, 5, 'Unexpected number of results for @sort:updateDate. Expected all localy installed Extension which are not builtin');
			const actual = [result.get(0).local?.installedTimestamp, result.get(1).local?.installedTimestamp, result.get(2).local?.installedTimestamp, result.get(3).local?.installedTimestamp, result.get(4).local?.installedTimestamp];
			const expected = [localEnabledLanguage.installedTimestamp, localDisabledLanguage.installedTimestamp, localRandom.installedTimestamp, localDisabledTheme.installedTimestamp, localEnabledTheme.installedTimestamp];
			for (let i = 0; i < result.length; i++) {
				assert.strictEqual(actual[i], expected[i], 'Unexpected extension sorting for @sort:updateDate query.');
			}
		});
	});

	test('Test @recommended:workspace query', () => {
		const workspaceRecommendedExtensions = [
			workspaceRecommendationA,
			workspaceRecommendationB,
			configBasedRecommendationA,
		];

		return testableView.show('@recommended:workspace').then(result => {
			assert.strictEqual(result.length, workspaceRecommendedExtensions.length);
			for (let i = 0; i < workspaceRecommendedExtensions.length; i++) {
				assert.strictEqual(result.get(i).identifier.id, workspaceRecommendedExtensions[i].identifier.id);
			}
		});
	});

	test('Test @recommended query', async () => {
		const allRecommendedExtensions = [
			fileBasedRecommendationA,
			fileBasedRecommendationB,
			configBasedRecommendationB,
			otherRecommendationA
		];

		const result = await testableView.show('@recommended');
		assert.strictEqual(result.length, allRecommendedExtensions.length);
		for (let i = 0; i < allRecommendedExtensions.length; i++) {
			assert.strictEqual(result.get(i).identifier.id, allRecommendedExtensions[i].identifier.id);
		}
	});


	test('Test @recommended:all query', async () => {
		const allRecommendedExtensions = [
			workspaceRecommendationA,
			workspaceRecommendationB,
			configBasedRecommendationA,
			fileBasedRecommendationA,
			fileBasedRecommendationB,
			configBasedRecommendationB,
			otherRecommendationA,
		];

		const result = await testableView.show('@recommended:all');
		assert.strictEqual(result.length, allRecommendedExtensions.length);
		for (let i = 0; i < allRecommendedExtensions.length; i++) {
			assert.strictEqual(result.get(i).identifier.id, allRecommendedExtensions[i].identifier.id);
		}
	});

	test('Test search', async () => {
		const results = [
			fileBasedRecommendationA,
			workspaceRecommendationA,
			otherRecommendationA,
			workspaceRecommendationB
		];
		queryPage = aPage(results);
		const result = await testableView.show('search-me');
		assert.strictEqual(result.length, results.length);
		for (let i = 0; i < results.length; i++) {
			assert.strictEqual(result.get(i).identifier.id, results[i].identifier.id);
		}
	});

	test('Test preferred search experiment', async () => {
		queryPage = aPage([
			fileBasedRecommendationA,
			workspaceRecommendationA,
			otherRecommendationA,
			workspaceRecommendationB
		], 5);
		const notInFirstPage = aGalleryExtension('not-in-first-page');
		galleryExtensions.push(notInFirstPage);
		const expected = [
			workspaceRecommendationA,
			notInFirstPage,
			workspaceRecommendationB,
			fileBasedRecommendationA,
			otherRecommendationA,
		];

		instantiationService.stubPromise(IWorkbenchExtensionManagementService, 'getExtensionsControlManifest', {
			malicious: [], deprecated: {},
			search: [{
				query: 'search-me',
				preferredResults: [
					workspaceRecommendationA.identifier.id,
					notInFirstPage.identifier.id,
					workspaceRecommendationB.identifier.id
				]
			}]
		});

		const testObject = disposableStore.add(instantiationService.createInstance(ExtensionsListView, {}, { id: '', title: '' }));
		const result = await testObject.show('search-me');
		assert.strictEqual(result.length, expected.length);
		for (let i = 0; i < expected.length; i++) {
			assert.strictEqual(result.get(i).identifier.id, expected[i].identifier.id);
		}
	});

	test('Skip preferred search experiment when user defines sort order', async () => {
		const realResults = [
			fileBasedRecommendationA,
			workspaceRecommendationA,
			otherRecommendationA,
			workspaceRecommendationB
		];
		queryPage = aPage(realResults);

		const result = await testableView.show('search-me @sort:installs');
		assert.strictEqual(result.length, realResults.length);
		for (let i = 0; i < realResults.length; i++) {
			assert.strictEqual(result.get(i).identifier.id, realResults[i].identifier.id);
		}
	});

	function aLocalExtension(name: string = 'someext', manifest: any = {}, properties: any = {}): ILocalExtension {
		manifest = { name, publisher: 'pub', version: '1.0.0', ...manifest };
		properties = {
			type: ExtensionType.User,
			location: URI.file(`pub.${name}`),
			identifier: { id: getGalleryExtensionId(manifest.publisher, manifest.name) },
			metadata: { id: getGalleryExtensionId(manifest.publisher, manifest.name), publisherId: manifest.publisher, publisherDisplayName: 'somename' },
			...properties,
			isValid: properties.isValid ?? true,
		};
		properties.isBuiltin = properties.type === ExtensionType.System;
		return <ILocalExtension>Object.create({ manifest, ...properties });
	}

	function aGalleryExtension(name: string, properties: any = {}, galleryExtensionProperties: any = {}, assets: any = {}): IGalleryExtension {
		const targetPlatform = getTargetPlatform(platform, arch);
		const galleryExtension = <IGalleryExtension>Object.create({ name, publisher: 'pub', version: '1.0.0', allTargetPlatforms: [targetPlatform], properties: {}, assets: {}, ...properties });
		galleryExtension.properties = { ...galleryExtension.properties, dependencies: [], targetPlatform, ...galleryExtensionProperties };
		galleryExtension.assets = { ...galleryExtension.assets, ...assets };
		galleryExtension.identifier = { id: getGalleryExtensionId(galleryExtension.publisher, galleryExtension.name), uuid: generateUuid() };
		return <IGalleryExtension>galleryExtension;
	}

	function aPage<T>(objects: IGalleryExtension[] = [], total?: number): IPager<IGalleryExtension> {
		return { firstPage: objects, total: total ?? objects.length, pageSize: objects.length, getPage: () => null! };
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/extensions/test/electron-browser/extensionsWorkbenchService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/extensions/test/electron-browser/extensionsWorkbenchService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as sinon from 'sinon';
import assert from 'assert';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { ExtensionState, AutoCheckUpdatesConfigurationKey, AutoUpdateConfigurationKey } from '../../common/extensions.js';
import { ExtensionsWorkbenchService } from '../../browser/extensionsWorkbenchService.js';
import {
	IExtensionManagementService, IExtensionGalleryService, ILocalExtension, IGalleryExtension,
	DidUninstallExtensionEvent, InstallExtensionEvent, IGalleryExtensionAssets, InstallOperation, IExtensionTipsService, InstallExtensionResult, getTargetPlatform, IExtensionsControlManifest, UninstallExtensionEvent, Metadata
} from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { IWorkbenchExtensionEnablementService, EnablementState, IExtensionManagementServerService, IExtensionManagementServer, IProfileAwareExtensionManagementService, IWorkbenchExtensionManagementService } from '../../../../services/extensionManagement/common/extensionManagement.js';
import { IExtensionRecommendationsService } from '../../../../services/extensionRecommendations/common/extensionRecommendations.js';
import { getGalleryExtensionId } from '../../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { anExtensionManagementServerService, TestExtensionEnablementService } from '../../../../services/extensionManagement/test/browser/extensionEnablementService.test.js';
import { ExtensionGalleryService } from '../../../../../platform/extensionManagement/common/extensionGalleryService.js';
import { IURLService } from '../../../../../platform/url/common/url.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { Event, Emitter } from '../../../../../base/common/event.js';
import { IPager } from '../../../../../base/common/paging.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { TestExtensionTipsService, TestSharedProcessService } from '../../../../test/electron-browser/workbenchTestServices.js';
import { ConfigurationTarget, IConfigurationChangeEvent, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IProgressService } from '../../../../../platform/progress/common/progress.js';
import { ProgressService } from '../../../../services/progress/browser/progressService.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { NativeURLService } from '../../../../../platform/url/common/urlService.js';
import { URI } from '../../../../../base/common/uri.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ExtensionType } from '../../../../../platform/extensions/common/extensions.js';
import { ExtensionKind } from '../../../../../platform/environment/common/environment.js';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { RemoteAgentService } from '../../../../services/remote/electron-browser/remoteAgentService.js';
import { ISharedProcessService } from '../../../../../platform/ipc/electron-browser/services.js';
import { TestContextService } from '../../../../test/common/workbenchTestServices.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { TestLifecycleService } from '../../../../test/browser/workbenchTestServices.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { platform } from '../../../../../base/common/platform.js';
import { arch } from '../../../../../base/common/process.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { toDisposable } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Mutable } from '../../../../../base/common/types.js';
import { IUpdateService, State } from '../../../../../platform/update/common/update.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { UserDataProfileService } from '../../../../services/userDataProfile/common/userDataProfileService.js';
import { IUserDataProfileService } from '../../../../services/userDataProfile/common/userDataProfile.js';
import { toUserDataProfile } from '../../../../../platform/userDataProfile/common/userDataProfile.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';

suite('ExtensionsWorkbenchServiceTest', () => {

	let instantiationService: TestInstantiationService;
	let testObject: ExtensionsWorkbenchService;
	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	let installEvent: Emitter<InstallExtensionEvent>,
		didInstallEvent: Emitter<readonly InstallExtensionResult[]>,
		uninstallEvent: Emitter<UninstallExtensionEvent>,
		didUninstallEvent: Emitter<DidUninstallExtensionEvent>;

	setup(async () => {
		disposableStore.add(toDisposable(() => sinon.restore()));
		installEvent = disposableStore.add(new Emitter<InstallExtensionEvent>());
		didInstallEvent = disposableStore.add(new Emitter<readonly InstallExtensionResult[]>());
		uninstallEvent = disposableStore.add(new Emitter<UninstallExtensionEvent>());
		didUninstallEvent = disposableStore.add(new Emitter<DidUninstallExtensionEvent>());

		instantiationService = disposableStore.add(new TestInstantiationService());
		instantiationService.stub(ITelemetryService, NullTelemetryService);
		instantiationService.stub(ILogService, NullLogService);
		instantiationService.stub(IFileService, disposableStore.add(new FileService(new NullLogService())));
		instantiationService.stub(IProgressService, ProgressService);
		instantiationService.stub(IProductService, {});

		instantiationService.stub(IExtensionGalleryService, ExtensionGalleryService);
		instantiationService.stub(IURLService, NativeURLService);
		instantiationService.stub(ISharedProcessService, TestSharedProcessService);
		instantiationService.stub(IContextKeyService, new MockContextKeyService());

		instantiationService.stub(IWorkspaceContextService, new TestContextService());
		stubConfiguration();

		instantiationService.stub(IRemoteAgentService, RemoteAgentService);
		instantiationService.stub(IUserDataProfileService, disposableStore.add(new UserDataProfileService(toUserDataProfile('test', 'test', URI.file('foo'), URI.file('cache')))));

		instantiationService.stub(IWorkbenchExtensionManagementService, {
			onDidInstallExtensions: didInstallEvent.event,
			// eslint-disable-next-line local/code-no-any-casts
			onInstallExtension: installEvent.event as any,
			// eslint-disable-next-line local/code-no-any-casts
			onUninstallExtension: uninstallEvent.event as any,
			// eslint-disable-next-line local/code-no-any-casts
			onDidUninstallExtension: didUninstallEvent.event as any,
			onDidUpdateExtensionMetadata: Event.None,
			onDidChangeProfile: Event.None,
			onProfileAwareDidInstallExtensions: Event.None,
			async getInstalled() { return []; },
			async getInstalledWorkspaceExtensions() { return []; },
			async getExtensionsControlManifest() { return { malicious: [], deprecated: {}, search: [], publisherMapping: {} }; },
			async updateMetadata(local: Mutable<ILocalExtension>, metadata: Partial<Metadata>) {
				local.identifier.uuid = metadata.id;
				local.publisherDisplayName = metadata.publisherDisplayName!;
				local.publisherId = metadata.publisherId!;
				return local;
			},
			async canInstall() { return true; },
			getTargetPlatform: async () => getTargetPlatform(platform, arch),
			async resetPinnedStateForAllUserExtensions(pinned: boolean) { }
		});

		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService({
			id: 'local',
			label: 'local',
			extensionManagementService: instantiationService.get(IExtensionManagementService) as IProfileAwareExtensionManagementService,
		}, null, null));

		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));

		instantiationService.stub(ILifecycleService, disposableStore.add(new TestLifecycleService()));
		instantiationService.stub(IExtensionTipsService, disposableStore.add(instantiationService.createInstance(TestExtensionTipsService)));
		instantiationService.stub(IExtensionRecommendationsService, {});

		instantiationService.stub(INotificationService, { prompt: () => null! });

		instantiationService.stub(IExtensionService, {
			onDidChangeExtensions: Event.None,
			extensions: [],
			async whenInstalledExtensionsRegistered() { return true; }
		});

		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', []);
		instantiationService.stub(IExtensionGalleryService, 'isEnabled', true);
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage());
		instantiationService.stubPromise(IExtensionGalleryService, 'getExtensions', []);
		instantiationService.stubPromise(INotificationService, 'prompt', 0);
		(<TestExtensionEnablementService>instantiationService.get(IWorkbenchExtensionEnablementService)).reset();
		instantiationService.stub(IUpdateService, { onStateChange: Event.None, state: State.Uninitialized });
	});

	test('test gallery extension', async () => {
		const expected = aGalleryExtension('expectedName', {
			displayName: 'expectedDisplayName',
			version: '1.5.0',
			publisherId: 'expectedPublisherId',
			publisher: 'expectedPublisher',
			publisherDisplayName: 'expectedPublisherDisplayName',
			description: 'expectedDescription',
			installCount: 1000,
			rating: 4,
			ratingCount: 100
		}, {
			dependencies: ['pub.1', 'pub.2'],
		}, {
			manifest: { uri: 'uri:manifest', fallbackUri: 'fallback:manifest' },
			readme: { uri: 'uri:readme', fallbackUri: 'fallback:readme' },
			changelog: { uri: 'uri:changelog', fallbackUri: 'fallback:changlog' },
			download: { uri: 'uri:download', fallbackUri: 'fallback:download' },
			icon: { uri: 'uri:icon', fallbackUri: 'fallback:icon' },
			license: { uri: 'uri:license', fallbackUri: 'fallback:license' },
			repository: { uri: 'uri:repository', fallbackUri: 'fallback:repository' },
			signature: { uri: 'uri:signature', fallbackUri: 'fallback:signature' },
			coreTranslations: []
		});

		testObject = await aWorkbenchService();
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(expected));

		return testObject.queryGallery(CancellationToken.None).then(pagedResponse => {
			assert.strictEqual(1, pagedResponse.firstPage.length);
			const actual = pagedResponse.firstPage[0];

			assert.strictEqual(ExtensionType.User, actual.type);
			assert.strictEqual('expectedName', actual.name);
			assert.strictEqual('expectedDisplayName', actual.displayName);
			assert.strictEqual('expectedpublisher.expectedname', actual.identifier.id);
			assert.strictEqual('expectedPublisher', actual.publisher);
			assert.strictEqual('expectedPublisherDisplayName', actual.publisherDisplayName);
			assert.strictEqual('1.5.0', actual.version);
			assert.strictEqual('1.5.0', actual.latestVersion);
			assert.strictEqual('expectedDescription', actual.description);
			assert.strictEqual('uri:icon', actual.iconUrl);
			assert.strictEqual('fallback:icon', actual.iconUrlFallback);
			assert.strictEqual('uri:license', actual.licenseUrl);
			assert.strictEqual(ExtensionState.Uninstalled, actual.state);
			assert.strictEqual(1000, actual.installCount);
			assert.strictEqual(4, actual.rating);
			assert.strictEqual(100, actual.ratingCount);
			assert.strictEqual(false, actual.outdated);
			assert.deepStrictEqual(['pub.1', 'pub.2'], actual.dependencies);
		});
	});

	test('test for empty installed extensions', async () => {
		testObject = await aWorkbenchService();

		assert.deepStrictEqual([], testObject.local);
	});

	test('test for installed extensions', async () => {
		const expected1 = aLocalExtension('local1', {
			publisher: 'localPublisher1',
			version: '1.1.0',
			displayName: 'localDisplayName1',
			description: 'localDescription1',
			icon: 'localIcon1',
			extensionDependencies: ['pub.1', 'pub.2'],
		}, {
			type: ExtensionType.User,
			readmeUrl: 'localReadmeUrl1',
			changelogUrl: 'localChangelogUrl1',
			location: URI.file('localPath1')
		});
		const expected2 = aLocalExtension('local2', {
			publisher: 'localPublisher2',
			version: '1.2.0',
			displayName: 'localDisplayName2',
			description: 'localDescription2',
		}, {
			type: ExtensionType.System,
			readmeUrl: 'localReadmeUrl2',
			changelogUrl: 'localChangelogUrl2',
		});
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [expected1, expected2]);
		testObject = await aWorkbenchService();

		const actuals = testObject.local;
		assert.strictEqual(2, actuals.length);

		let actual = actuals[0];
		assert.strictEqual(ExtensionType.User, actual.type);
		assert.strictEqual('local1', actual.name);
		assert.strictEqual('localDisplayName1', actual.displayName);
		assert.strictEqual('localpublisher1.local1', actual.identifier.id);
		assert.strictEqual('localPublisher1', actual.publisher);
		assert.strictEqual('1.1.0', actual.version);
		assert.strictEqual('1.1.0', actual.latestVersion);
		assert.strictEqual('localDescription1', actual.description);
		assert.ok(actual.iconUrl === 'file:///localPath1/localIcon1' || actual.iconUrl === 'vscode-file://vscode-app/localPath1/localIcon1');
		assert.ok(actual.iconUrlFallback === undefined);
		assert.strictEqual(undefined, actual.licenseUrl);
		assert.strictEqual(ExtensionState.Installed, actual.state);
		assert.strictEqual(undefined, actual.installCount);
		assert.strictEqual(undefined, actual.rating);
		assert.strictEqual(undefined, actual.ratingCount);
		assert.strictEqual(false, actual.outdated);
		assert.deepStrictEqual(['pub.1', 'pub.2'], actual.dependencies);

		actual = actuals[1];
		assert.strictEqual(ExtensionType.System, actual.type);
		assert.strictEqual('local2', actual.name);
		assert.strictEqual('localDisplayName2', actual.displayName);
		assert.strictEqual('localpublisher2.local2', actual.identifier.id);
		assert.strictEqual('localPublisher2', actual.publisher);
		assert.strictEqual('1.2.0', actual.version);
		assert.strictEqual('1.2.0', actual.latestVersion);
		assert.strictEqual('localDescription2', actual.description);
		assert.strictEqual(undefined, actual.licenseUrl);
		assert.strictEqual(ExtensionState.Installed, actual.state);
		assert.strictEqual(undefined, actual.installCount);
		assert.strictEqual(undefined, actual.rating);
		assert.strictEqual(undefined, actual.ratingCount);
		assert.strictEqual(false, actual.outdated);
		assert.deepStrictEqual([], actual.dependencies);
	});

	test('test installed extensions get syncs with gallery', async () => {
		const local1 = aLocalExtension('local1', {
			publisher: 'localPublisher1',
			version: '1.1.0',
			displayName: 'localDisplayName1',
			description: 'localDescription1',
			icon: 'localIcon1',
			extensionDependencies: ['pub.1', 'pub.2'],
		}, {
			type: ExtensionType.User,
			readmeUrl: 'localReadmeUrl1',
			changelogUrl: 'localChangelogUrl1',
			location: URI.file('localPath1')
		});
		const local2 = aLocalExtension('local2', {
			publisher: 'localPublisher2',
			version: '1.2.0',
			displayName: 'localDisplayName2',
			description: 'localDescription2',
		}, {
			type: ExtensionType.System,
			readmeUrl: 'localReadmeUrl2',
			changelogUrl: 'localChangelogUrl2',
		});
		const gallery1 = aGalleryExtension(local1.manifest.name, {
			identifier: local1.identifier,
			displayName: 'expectedDisplayName',
			version: '1.5.0',
			publisherId: 'expectedPublisherId',
			publisher: local1.manifest.publisher,
			publisherDisplayName: 'expectedPublisherDisplayName',
			description: 'expectedDescription',
			installCount: 1000,
			rating: 4,
			ratingCount: 100
		}, {
			dependencies: ['pub.1'],
		}, {
			manifest: { uri: 'uri:manifest', fallbackUri: 'fallback:manifest' },
			readme: { uri: 'uri:readme', fallbackUri: 'fallback:readme' },
			changelog: { uri: 'uri:changelog', fallbackUri: 'fallback:changlog' },
			download: { uri: 'uri:download', fallbackUri: 'fallback:download' },
			icon: { uri: 'uri:icon', fallbackUri: 'fallback:icon' },
			license: { uri: 'uri:license', fallbackUri: 'fallback:license' },
			repository: { uri: 'uri:repository', fallbackUri: 'fallback:repository' },
			signature: { uri: 'uri:signature', fallbackUri: 'fallback:signature' },
			coreTranslations: []
		});
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local1, local2]);
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(gallery1));
		instantiationService.stubPromise(IExtensionGalleryService, 'getCompatibleExtension', gallery1);
		instantiationService.stubPromise(IExtensionGalleryService, 'getExtensions', [gallery1]);
		testObject = await aWorkbenchService();
		await testObject.queryLocal();

		return Event.toPromise(testObject.onChange).then(() => {
			const actuals = testObject.local;
			assert.strictEqual(2, actuals.length);

			let actual = actuals[0];
			assert.strictEqual(ExtensionType.User, actual.type);
			assert.strictEqual('local1', actual.name);
			assert.strictEqual('expectedDisplayName', actual.displayName);
			assert.strictEqual('localpublisher1.local1', actual.identifier.id);
			assert.strictEqual('localPublisher1', actual.publisher);
			assert.strictEqual('1.1.0', actual.version);
			assert.strictEqual('1.5.0', actual.latestVersion);
			assert.strictEqual('expectedDescription', actual.description);
			assert.strictEqual('uri:icon', actual.iconUrl);
			assert.strictEqual('fallback:icon', actual.iconUrlFallback);
			assert.strictEqual(ExtensionState.Installed, actual.state);
			assert.strictEqual('uri:license', actual.licenseUrl);
			assert.strictEqual(1000, actual.installCount);
			assert.strictEqual(4, actual.rating);
			assert.strictEqual(100, actual.ratingCount);
			assert.strictEqual(true, actual.outdated);
			assert.deepStrictEqual(['pub.1'], actual.dependencies);

			actual = actuals[1];
			assert.strictEqual(ExtensionType.System, actual.type);
			assert.strictEqual('local2', actual.name);
			assert.strictEqual('localDisplayName2', actual.displayName);
			assert.strictEqual('localpublisher2.local2', actual.identifier.id);
			assert.strictEqual('localPublisher2', actual.publisher);
			assert.strictEqual('1.2.0', actual.version);
			assert.strictEqual('1.2.0', actual.latestVersion);
			assert.strictEqual('localDescription2', actual.description);
			assert.strictEqual(undefined, actual.licenseUrl);
			assert.strictEqual(ExtensionState.Installed, actual.state);
			assert.strictEqual(undefined, actual.installCount);
			assert.strictEqual(undefined, actual.rating);
			assert.strictEqual(undefined, actual.ratingCount);
			assert.strictEqual(false, actual.outdated);
			assert.deepStrictEqual([], actual.dependencies);
		});
	});

	test('test extension state computation', async () => {
		const gallery = aGalleryExtension('gallery1');
		testObject = await aWorkbenchService();
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(gallery));

		return testObject.queryGallery(CancellationToken.None).then(page => {
			const extension = page.firstPage[0];
			assert.strictEqual(ExtensionState.Uninstalled, extension.state);

			const identifier = gallery.identifier;

			// Installing
			installEvent.fire({ identifier, source: gallery, profileLocation: null! });
			const local = testObject.local;
			assert.strictEqual(1, local.length);
			const actual = local[0];
			assert.strictEqual(`${gallery.publisher}.${gallery.name}`, actual.identifier.id);
			assert.strictEqual(ExtensionState.Installing, actual.state);

			// Installed
			didInstallEvent.fire([{ identifier, source: gallery, operation: InstallOperation.Install, local: aLocalExtension(gallery.name, gallery, { identifier }), profileLocation: null! }]);
			assert.strictEqual(ExtensionState.Installed, actual.state);
			assert.strictEqual(1, testObject.local.length);

			testObject.uninstall(actual);

			// Uninstalling
			uninstallEvent.fire({ identifier, profileLocation: null! });
			assert.strictEqual(ExtensionState.Uninstalling, actual.state);

			// Uninstalled
			didUninstallEvent.fire({ identifier, profileLocation: null! });
			assert.strictEqual(ExtensionState.Uninstalled, actual.state);

			assert.strictEqual(0, testObject.local.length);
		});
	});

	test('test extension doesnot show outdated for system extensions', async () => {
		const local = aLocalExtension('a', { version: '1.0.1' }, { type: ExtensionType.System });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local]);
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(aGalleryExtension(local.manifest.name, { identifier: local.identifier, version: '1.0.2' })));
		testObject = await aWorkbenchService();
		await testObject.queryLocal();

		assert.ok(!testObject.local[0].outdated);
	});

	test('test canInstall returns false for extensions with out gallery', async () => {
		const local = aLocalExtension('a', { version: '1.0.1' }, { type: ExtensionType.System });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local]);
		testObject = await aWorkbenchService();
		const target = testObject.local[0];
		testObject.uninstall(target);
		uninstallEvent.fire({ identifier: local.identifier, profileLocation: null! });
		didUninstallEvent.fire({ identifier: local.identifier, profileLocation: null! });

		assert.ok(await testObject.canInstall(target) !== true);
	});

	test('test canInstall returns false for a system extension', async () => {
		const local = aLocalExtension('a', { version: '1.0.1' }, { type: ExtensionType.System });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local]);
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(aGalleryExtension(local.manifest.name, { identifier: local.identifier })));
		testObject = await aWorkbenchService();
		const target = testObject.local[0];

		assert.ok(await testObject.canInstall(target) !== true);
	});

	test('test canInstall returns true for extensions with gallery', async () => {
		const local = aLocalExtension('a', { version: '1.0.1' }, { type: ExtensionType.User });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local]);
		const gallery = aGalleryExtension(local.manifest.name, { identifier: local.identifier });
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(gallery));
		instantiationService.stubPromise(IExtensionGalleryService, 'getCompatibleExtension', gallery);
		instantiationService.stubPromise(IExtensionGalleryService, 'getExtensions', [gallery]);
		testObject = await aWorkbenchService();
		const target = testObject.local[0];

		await Event.toPromise(Event.filter(testObject.onChange, e => !!e?.gallery));
		assert.equal(await testObject.canInstall(target), true);
	});

	test('test onchange event is triggered while installing', async () => {
		const gallery = aGalleryExtension('gallery1');
		testObject = await aWorkbenchService();
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(gallery));

		const page = await testObject.queryGallery(CancellationToken.None);
		const extension = page.firstPage[0];
		assert.strictEqual(ExtensionState.Uninstalled, extension.state);

		installEvent.fire({ identifier: gallery.identifier, source: gallery, profileLocation: null! });
		const promise = Event.toPromise(testObject.onChange);

		// Installed
		didInstallEvent.fire([{ identifier: gallery.identifier, source: gallery, operation: InstallOperation.Install, local: aLocalExtension(gallery.name, gallery, gallery), profileLocation: null! }]);

		await promise;
	});

	test('test onchange event is triggered when installation is finished', async () => {
		const gallery = aGalleryExtension('gallery1');
		testObject = await aWorkbenchService();
		instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(gallery));
		const target = sinon.spy();

		return testObject.queryGallery(CancellationToken.None).then(page => {
			const extension = page.firstPage[0];
			assert.strictEqual(ExtensionState.Uninstalled, extension.state);

			disposableStore.add(testObject.onChange(target));

			// Installing
			installEvent.fire({ identifier: gallery.identifier, source: gallery, profileLocation: null! });

			assert.ok(target.calledOnce);
		});
	});

	test('test onchange event is triggered while uninstalling', async () => {
		const local = aLocalExtension('a', {}, { type: ExtensionType.System });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local]);
		testObject = await aWorkbenchService();
		const target = sinon.spy();

		testObject.uninstall(testObject.local[0]);
		disposableStore.add(testObject.onChange(target));
		uninstallEvent.fire({ identifier: local.identifier, profileLocation: null! });

		assert.ok(target.calledOnce);
	});

	test('test onchange event is triggered when uninstalling is finished', async () => {
		const local = aLocalExtension('a', {}, { type: ExtensionType.System });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local]);
		testObject = await aWorkbenchService();
		const target = sinon.spy();

		testObject.uninstall(testObject.local[0]);
		uninstallEvent.fire({ identifier: local.identifier, profileLocation: null! });
		disposableStore.add(testObject.onChange(target));
		didUninstallEvent.fire({ identifier: local.identifier, profileLocation: null! });

		assert.ok(target.calledOnce);
	});

	test('test uninstalled extensions are always enabled', async () => {
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('b')], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('c')], EnablementState.DisabledWorkspace))
			.then(async () => {
				testObject = await aWorkbenchService();
				instantiationService.stubPromise(IExtensionGalleryService, 'query', aPage(aGalleryExtension('a')));
				return testObject.queryGallery(CancellationToken.None).then(pagedResponse => {
					const actual = pagedResponse.firstPage[0];
					assert.strictEqual(actual.enablementState, EnablementState.EnabledGlobally);
				});
			});
	});

	test('test enablement state installed enabled extension', async () => {
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('b')], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('c')], EnablementState.DisabledWorkspace))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [aLocalExtension('a')]);
				testObject = await aWorkbenchService();

				const actual = testObject.local[0];

				assert.strictEqual(actual.enablementState, EnablementState.EnabledGlobally);
			});
	});

	test('test workspace disabled extension', async () => {
		const extensionA = aLocalExtension('a');
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('b')], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('d')], EnablementState.DisabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.DisabledWorkspace))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('e')], EnablementState.DisabledWorkspace))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA]);
				testObject = await aWorkbenchService();

				const actual = testObject.local[0];

				assert.strictEqual(actual.enablementState, EnablementState.DisabledWorkspace);
			});
	});

	test('test globally disabled extension', async () => {
		const localExtension = aLocalExtension('a');
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([localExtension], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('d')], EnablementState.DisabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('c')], EnablementState.DisabledWorkspace))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [localExtension]);
				testObject = await aWorkbenchService();

				const actual = testObject.local[0];

				assert.strictEqual(actual.enablementState, EnablementState.DisabledGlobally);
			});
	});

	test('test enablement state is updated for user extensions', async () => {
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('c')], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('b')], EnablementState.DisabledWorkspace))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [aLocalExtension('a')]);
				testObject = await aWorkbenchService();
				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledWorkspace)
					.then(() => {
						const actual = testObject.local[0];
						assert.strictEqual(actual.enablementState, EnablementState.DisabledWorkspace);
					});
			});
	});

	test('test enable extension globally when extension is disabled for workspace', async () => {
		const localExtension = aLocalExtension('a');
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([localExtension], EnablementState.DisabledWorkspace)
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [localExtension]);
				testObject = await aWorkbenchService();
				return testObject.setEnablement(testObject.local[0], EnablementState.EnabledGlobally)
					.then(() => {
						const actual = testObject.local[0];
						assert.strictEqual(actual.enablementState, EnablementState.EnabledGlobally);
					});
			});
	});

	test('test disable extension globally', async () => {
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [aLocalExtension('a')]);
		testObject = await aWorkbenchService();

		return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
			.then(() => {
				const actual = testObject.local[0];
				assert.strictEqual(actual.enablementState, EnablementState.DisabledGlobally);
			});
	});

	test('test system extensions can be disabled', async () => {
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [aLocalExtension('a', {}, { type: ExtensionType.System })]);
		testObject = await aWorkbenchService();

		return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
			.then(() => {
				const actual = testObject.local[0];
				assert.strictEqual(actual.enablementState, EnablementState.DisabledGlobally);
			});
	});

	test('test enablement state is updated on change from outside', async () => {
		const localExtension = aLocalExtension('a');
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('c')], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('b')], EnablementState.DisabledWorkspace))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [localExtension]);
				testObject = await aWorkbenchService();

				return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([localExtension], EnablementState.DisabledGlobally)
					.then(() => {
						const actual = testObject.local[0];
						assert.strictEqual(actual.enablementState, EnablementState.DisabledGlobally);
					});
			});
	});

	test('test disable extension with dependencies disable only itself', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => {
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.DisabledGlobally);
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.EnabledGlobally);
					});
			});
	});

	test('test disable extension pack disables the pack', async () => {
		const extensionA = aLocalExtension('a', { extensionPack: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => {
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.DisabledGlobally);
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.DisabledGlobally);
					});
			});
	});

	test('test disable extension pack disable all', async () => {
		const extensionA = aLocalExtension('a', { extensionPack: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => {
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.DisabledGlobally);
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.DisabledGlobally);
					});
			});
	});

	test('test disable extension fails if extension is a dependent of other', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		instantiationService.stub(INotificationService, {
			prompt(severity, message, choices, options) {
				options!.onCancel!();
				return null!;
			}
		});
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();
				return testObject.setEnablement(testObject.local[1], EnablementState.DisabledGlobally).then(() => assert.fail('Should fail'), error => assert.ok(true));
			});
	});

	test('test disable extension disables all dependents when chosen to disable all', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		instantiationService.stub(IDialogService, {
			prompt() {
				return Promise.resolve({ result: true });
			}
		});
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();
				await testObject.setEnablement(testObject.local[1], EnablementState.DisabledGlobally);
				assert.strictEqual(testObject.local[0].enablementState, EnablementState.DisabledGlobally);
				assert.strictEqual(testObject.local[1].enablementState, EnablementState.DisabledGlobally);
			});
	});

	test('test disable extension when extension is part of a pack', async () => {
		const extensionA = aLocalExtension('a', { extensionPack: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();
				return testObject.setEnablement(testObject.local[1], EnablementState.DisabledGlobally)
					.then(() => {
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.DisabledGlobally);
					});
			});
	});

	test('test disable both dependency and dependent do not promot and do not fail', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				const target = sinon.spy();
				testObject = await aWorkbenchService();

				return testObject.setEnablement([testObject.local[1], testObject.local[0]], EnablementState.DisabledGlobally)
					.then(() => {
						assert.ok(!target.called);
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.DisabledGlobally);
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.DisabledGlobally);
					});
			});
	});

	test('test enable both dependency and dependent do not promot and do not fail', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.DisabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.DisabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				const target = sinon.spy();
				testObject = await aWorkbenchService();

				return testObject.setEnablement([testObject.local[1], testObject.local[0]], EnablementState.EnabledGlobally)
					.then(() => {
						assert.ok(!target.called);
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.EnabledGlobally);
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.EnabledGlobally);
					});
			});
	});

	test('test disable extension does not fail if its dependency is a dependent of other but chosen to disable only itself', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c', { extensionDependencies: ['pub.b'] });

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => {
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.DisabledGlobally);
					});
			});
	});

	test('test disable extension if its dependency is a dependent of other disabled extension', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c', { extensionDependencies: ['pub.b'] });

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.DisabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => {
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.DisabledGlobally);
					});
			});
	});

	test('test disable extension if its dependencys dependency is itself', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b', { extensionDependencies: ['pub.a'] });
		const extensionC = aLocalExtension('c');

		instantiationService.stub(INotificationService, {
			prompt(severity, message, choices, options) {
				options!.onCancel!();
				return null!;
			}
		});
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => assert.fail('An extension with dependent should not be disabled'), () => null);
			});
	});

	test('test disable extension if its dependency is dependent and is disabled', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c', { extensionDependencies: ['pub.b'] });

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.DisabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);

				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => assert.strictEqual(testObject.local[0].enablementState, EnablementState.DisabledGlobally));
			});
	});

	test('test disable extension with cyclic dependencies', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b', { extensionDependencies: ['pub.c'] });
		const extensionC = aLocalExtension('c', { extensionDependencies: ['pub.a'] });

		instantiationService.stub(INotificationService, {
			prompt(severity, message, choices, options) {
				options!.onCancel!();
				return null!;
			}
		});
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.EnabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.EnabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();
				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => assert.fail('An extension with dependent should not be disabled'), () => null);
			});
	});

	test('test enable extension with dependencies enable all', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.DisabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.DisabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.EnabledGlobally)
					.then(() => {
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.EnabledGlobally);
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.EnabledGlobally);
					});
			});
	});

	test('test enable extension with dependencies does not prompt if dependency is enabled already', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.EnabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.DisabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				const target = sinon.spy();
				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.EnabledGlobally)
					.then(() => {
						assert.ok(!target.called);
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.EnabledGlobally);
					});
			});
	});

	test('test enable extension with dependency does not prompt if both are enabled', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b');
		const extensionC = aLocalExtension('c');

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.DisabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.DisabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);
				const target = sinon.spy();
				testObject = await aWorkbenchService();

				return testObject.setEnablement([testObject.local[1], testObject.local[0]], EnablementState.EnabledGlobally)
					.then(() => {
						assert.ok(!target.called);
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.EnabledGlobally);
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.EnabledGlobally);
					});
			});
	});

	test('test enable extension with cyclic dependencies', async () => {
		const extensionA = aLocalExtension('a', { extensionDependencies: ['pub.b'] });
		const extensionB = aLocalExtension('b', { extensionDependencies: ['pub.c'] });
		const extensionC = aLocalExtension('c', { extensionDependencies: ['pub.a'] });

		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionA], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionB], EnablementState.DisabledGlobally))
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([extensionC], EnablementState.DisabledGlobally))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extensionA, extensionB, extensionC]);

				testObject = await aWorkbenchService();

				return testObject.setEnablement(testObject.local[0], EnablementState.EnabledGlobally)
					.then(() => {
						assert.strictEqual(testObject.local[0].enablementState, EnablementState.EnabledGlobally);
						assert.strictEqual(testObject.local[1].enablementState, EnablementState.EnabledGlobally);
						assert.strictEqual(testObject.local[2].enablementState, EnablementState.EnabledGlobally);
					});
			});
	});

	test('test change event is fired when disablement flags are changed', async () => {
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('c')], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('b')], EnablementState.DisabledWorkspace))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [aLocalExtension('a')]);
				testObject = await aWorkbenchService();
				const target = sinon.spy();
				disposableStore.add(testObject.onChange(target));

				return testObject.setEnablement(testObject.local[0], EnablementState.DisabledGlobally)
					.then(() => assert.ok(target.calledOnce));
			});
	});

	test('test change event is fired when disablement flags are changed from outside', async () => {
		const localExtension = aLocalExtension('a');
		return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('c')], EnablementState.DisabledGlobally)
			.then(() => instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([aLocalExtension('b')], EnablementState.DisabledWorkspace))
			.then(async () => {
				instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [localExtension]);
				testObject = await aWorkbenchService();
				const target = sinon.spy();
				disposableStore.add(testObject.onChange(target));

				return instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([localExtension], EnablementState.DisabledGlobally)
					.then(() => assert.ok(target.calledOnce));
			});
	});

	test('test updating an extension does not re-eanbles it when disabled globally', async () => {
		testObject = await aWorkbenchService();
		const local = aLocalExtension('pub.a');
		await instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([local], EnablementState.DisabledGlobally);
		didInstallEvent.fire([{ local, identifier: local.identifier, operation: InstallOperation.Update, profileLocation: null! }]);
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local]);
		const actual = await testObject.queryLocal();
		assert.strictEqual(actual[0].enablementState, EnablementState.DisabledGlobally);
	});

	test('test updating an extension does not re-eanbles it when workspace disabled', async () => {
		testObject = await aWorkbenchService();
		const local = aLocalExtension('pub.a');
		await instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([local], EnablementState.DisabledWorkspace);
		didInstallEvent.fire([{ local, identifier: local.identifier, operation: InstallOperation.Update, profileLocation: null! }]);
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [local]);
		const actual = await testObject.queryLocal();
		assert.strictEqual(actual[0].enablementState, EnablementState.DisabledWorkspace);
	});

	test('test user extension is preferred when the same extension exists as system and user extension', async () => {
		testObject = await aWorkbenchService();
		const userExtension = aLocalExtension('pub.a');
		const systemExtension = aLocalExtension('pub.a', {}, { type: ExtensionType.System });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [systemExtension, userExtension]);

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, userExtension);
	});

	test('test user extension is disabled when the same extension exists as system and user extension and system extension is disabled', async () => {
		testObject = await aWorkbenchService();
		const systemExtension = aLocalExtension('pub.a', {}, { type: ExtensionType.System });
		await instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([systemExtension], EnablementState.DisabledGlobally);
		const userExtension = aLocalExtension('pub.a');
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [systemExtension, userExtension]);

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, userExtension);
		assert.strictEqual(actual[0].enablementState, EnablementState.DisabledGlobally);
	});

	test('Test local ui extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['ui'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local workspace extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local web extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['web'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local ui,workspace extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['ui', 'workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local workspace,ui extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['workspace', 'ui'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local ui,workspace,web extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['ui', 'workspace', 'web'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local ui,web,workspace extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['ui', 'web', 'workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local web,ui,workspace extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['web', 'ui', 'workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local web,workspace,ui extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['web', 'workspace', 'ui'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local workspace,web,ui extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['workspace', 'web', 'ui'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local workspace,ui,web extension is chosen if it exists only in local server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['workspace', 'ui', 'web'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local UI extension is chosen if it exists in both servers', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['ui'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test local ui,workspace extension is chosen if it exists in both servers', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['ui', 'workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test remote workspace extension is chosen if it exists in remote server', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['workspace'];
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService(), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, remoteExtension);
	});

	test('Test remote workspace extension is chosen if it exists in both servers', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, remoteExtension);
	});

	test('Test remote workspace extension is chosen if it exists in both servers and local is disabled', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		await instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([remoteExtension], EnablementState.DisabledGlobally);
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, remoteExtension);
		assert.strictEqual(actual[0].enablementState, EnablementState.DisabledGlobally);
	});

	test('Test remote workspace extension is chosen if it exists in both servers and remote is disabled in workspace', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		await instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([remoteExtension], EnablementState.DisabledWorkspace);
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, remoteExtension);
		assert.strictEqual(actual[0].enablementState, EnablementState.DisabledWorkspace);
	});

	test('Test local ui, workspace extension is chosen if it exists in both servers and local is disabled', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['ui', 'workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		await instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([localExtension], EnablementState.DisabledGlobally);
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
		assert.strictEqual(actual[0].enablementState, EnablementState.DisabledGlobally);
	});

	test('Test local ui, workspace extension is chosen if it exists in both servers and local is disabled in workspace', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['ui', 'workspace'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		await instantiationService.get(IWorkbenchExtensionEnablementService).setEnablement([localExtension], EnablementState.DisabledWorkspace);
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
		assert.strictEqual(actual[0].enablementState, EnablementState.DisabledWorkspace);
	});

	test('Test local web extension is chosen if it exists in both servers', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['web'];
		const localExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`) });
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([localExtension]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, localExtension);
	});

	test('Test remote web extension is chosen if it exists only in remote', async () => {
		// multi server setup
		const extensionKind: ExtensionKind[] = ['web'];
		const remoteExtension = aLocalExtension('a', { extensionKind }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });

		const extensionManagementServerService = aMultiExtensionManagementServerService(instantiationService, createExtensionManagementService([]), createExtensionManagementService([remoteExtension]));
		instantiationService.stub(IExtensionManagementServerService, extensionManagementServerService);
		instantiationService.stub(IWorkbenchExtensionEnablementService, disposableStore.add(new TestExtensionEnablementService(instantiationService)));
		testObject = await aWorkbenchService();

		const actual = await testObject.queryLocal();

		assert.strictEqual(actual.length, 1);
		assert.strictEqual(actual[0].local, remoteExtension);
	});

	test('Test disable autoupdate for extension when auto update is enabled for all', async () => {
		const extension1 = aLocalExtension('a');
		const extension2 = aLocalExtension('b');
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		instantiationService.stub(IExtensionManagementService, 'updateMetadata', (local: Mutable<ILocalExtension>, metadata: Partial<Metadata>) => {
			local.pinned = !!metadata.pinned;
			return local;
		});
		testObject = await aWorkbenchService();

		assert.strictEqual(testObject.local[0].local?.pinned, undefined);
		assert.strictEqual(testObject.local[1].local?.pinned, undefined);

		await testObject.updateAutoUpdateEnablementFor(testObject.local[0], false);

		assert.strictEqual(testObject.local[0].local?.pinned, undefined);
		assert.strictEqual(testObject.local[1].local?.pinned, undefined);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), []);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), ['pub.a']);
	});

	test('Test disable autoupdate for extension when auto update is enabled for enabled extensions', async () => {
		stubConfiguration('onlyEnabledExtensions');

		const extension1 = aLocalExtension('a');
		const extension2 = aLocalExtension('b');
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		instantiationService.stub(IExtensionManagementService, 'updateMetadata', (local: Mutable<ILocalExtension>, metadata: Partial<Metadata>) => {
			local.pinned = !!metadata.pinned;
			return local;
		});
		testObject = await aWorkbenchService();

		assert.strictEqual(testObject.local[0].local?.pinned, undefined);
		assert.strictEqual(testObject.local[1].local?.pinned, undefined);

		await testObject.updateAutoUpdateEnablementFor(testObject.local[0], false);

		assert.strictEqual(testObject.local[0].local?.pinned, undefined);
		assert.strictEqual(testObject.local[1].local?.pinned, undefined);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), []);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), ['pub.a']);
	});

	test('Test enable autoupdate for extension when auto update is enabled for all', async () => {
		const extension1 = aLocalExtension('a');
		const extension2 = aLocalExtension('b');
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		instantiationService.stub(IExtensionManagementService, 'updateMetadata', (local: Mutable<ILocalExtension>, metadata: Partial<Metadata>) => {
			local.pinned = !!metadata.pinned;
			return local;
		});
		testObject = await aWorkbenchService();

		assert.strictEqual(testObject.local[0].local?.pinned, undefined);
		assert.strictEqual(testObject.local[1].local?.pinned, undefined);

		await testObject.updateAutoUpdateEnablementFor(testObject.local[0], false);
		await testObject.updateAutoUpdateEnablementFor(testObject.local[0], true);

		assert.strictEqual(testObject.local[0].local?.pinned, undefined);
		assert.strictEqual(testObject.local[1].local?.pinned, undefined);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), []);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), []);
	});

	test('Test enable autoupdate for pinned extension when auto update is enabled', async () => {
		const extension1 = aLocalExtension('a', undefined, { pinned: true });
		const extension2 = aLocalExtension('b');
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		instantiationService.stub(IExtensionManagementService, 'updateMetadata', (local: Mutable<ILocalExtension>, metadata: Partial<Metadata>) => {
			local.pinned = !!metadata.pinned;
			return local;
		});
		testObject = await aWorkbenchService();

		assert.strictEqual(testObject.local[0].local?.pinned, true);
		assert.strictEqual(testObject.local[1].local?.pinned, undefined);

		await testObject.updateAutoUpdateEnablementFor(testObject.local[0], true);

		assert.strictEqual(testObject.local[0].local?.pinned, false);
		assert.strictEqual(testObject.local[1].local?.pinned, undefined);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), []);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), []);
	});

	test('Test updateAutoUpdateEnablementFor throws error when auto update is disabled', async () => {
		stubConfiguration(false);

		const extension1 = aLocalExtension('a');
		const extension2 = aLocalExtension('b');
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		testObject = await aWorkbenchService();

		try {
			await testObject.updateAutoUpdateEnablementFor(testObject.local[0], true);
			assert.fail('error expected');
		} catch (error) {
			// expected
		}
	});

	test('Test updateAutoUpdateEnablementFor throws error for publisher when auto update is enabled', async () => {
		const extension1 = aLocalExtension('a');
		const extension2 = aLocalExtension('b');
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		testObject = await aWorkbenchService();

		try {
			await testObject.updateAutoUpdateEnablementFor(testObject.local[0].publisher, true);
			assert.fail('error expected');
		} catch (error) {
			// expected
		}
	});

	test('Test enable autoupdate for extension when auto update is disabled', async () => {
		stubConfiguration(false);

		const extension1 = aLocalExtension('a', undefined, { pinned: true });
		const extension2 = aLocalExtension('b', undefined, { pinned: true });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		instantiationService.stub(IExtensionManagementService, 'updateMetadata', (local: Mutable<ILocalExtension>, metadata: Partial<Metadata>) => {
			local.pinned = !!metadata.pinned;
			return local;
		});
		testObject = await aWorkbenchService();

		assert.strictEqual(testObject.local[0].local?.pinned, true);
		assert.strictEqual(testObject.local[1].local?.pinned, true);

		await testObject.updateAutoUpdateEnablementFor(testObject.local[0], true);

		assert.strictEqual(testObject.local[0].local?.pinned, true);
		assert.strictEqual(testObject.local[1].local?.pinned, true);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), ['pub.a']);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), []);
	});

	test('Test reset autoupdate extensions state when auto update is disabled', async () => {
		instantiationService.stub(IDialogService, {
			confirm: () => Promise.resolve({ confirmed: true })
		});

		const extension1 = aLocalExtension('a', undefined, { pinned: true });
		const extension2 = aLocalExtension('b', undefined, { pinned: true });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		instantiationService.stub(IExtensionManagementService, 'updateMetadata', (local: Mutable<ILocalExtension>, metadata: Partial<Metadata>) => {
			local.pinned = !!metadata.pinned;
			return local;
		});
		testObject = await aWorkbenchService();

		await testObject.updateAutoUpdateEnablementFor(testObject.local[0], false);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), []);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), ['pub.a']);

		await testObject.updateAutoUpdateForAllExtensions(false);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), []);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), []);
	});

	test('Test reset autoupdate extensions state when auto update is enabled', async () => {
		stubConfiguration(false);
		instantiationService.stub(IDialogService, {
			confirm: () => Promise.resolve({ confirmed: true })
		});

		const extension1 = aLocalExtension('a', undefined, { pinned: true });
		const extension2 = aLocalExtension('b', undefined, { pinned: true });
		instantiationService.stubPromise(IExtensionManagementService, 'getInstalled', [extension1, extension2]);
		instantiationService.stub(IExtensionManagementService, 'updateMetadata', (local: Mutable<ILocalExtension>, metadata: Partial<Metadata>) => {
			local.pinned = !!metadata.pinned;
			return local;
		});
		testObject = await aWorkbenchService();

		await testObject.updateAutoUpdateEnablementFor(testObject.local[0], true);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), ['pub.a']);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), []);

		await testObject.updateAutoUpdateForAllExtensions(true);

		assert.deepStrictEqual(testObject.getEnabledAutoUpdateExtensions(), []);
		assert.deepStrictEqual(testObject.getDisabledAutoUpdateExtensions(), []);
	});

	async function aWorkbenchService(): Promise<ExtensionsWorkbenchService> {
		const workbenchService: ExtensionsWorkbenchService = disposableStore.add(instantiationService.createInstance(ExtensionsWorkbenchService));
		await workbenchService.queryLocal();
		return workbenchService;
	}

	function stubConfiguration(autoUpdateValue?: any, autoCheckUpdatesValue?: any): void {
		const values: any = {
			[AutoUpdateConfigurationKey]: autoUpdateValue ?? true,
			[AutoCheckUpdatesConfigurationKey]: autoCheckUpdatesValue ?? true
		};
		const emitter = disposableStore.add(new Emitter<IConfigurationChangeEvent>());
		instantiationService.stub(IConfigurationService, {
			onDidChangeConfiguration: emitter.event,
			getValue: (key?: any) => {
				return key ? values[key] : undefined;
			},
			updateValue: async (key: string, value: any) => {
				values[key] = value;
				emitter.fire({
					affectedKeys: new Set([key]),
					source: ConfigurationTarget.USER,
					change: { keys: [], overrides: [] },
					affectsConfiguration(configuration, overrides) {
						return true;
					},
				});
			},
			inspect: (key: string) => {
				return {};
			}
		});
	}

	function aLocalExtension(name: string = 'someext', manifest: any = {}, properties: any = {}): ILocalExtension {
		manifest = { name, publisher: 'pub', version: '1.0.0', ...manifest };
		properties = {
			type: ExtensionType.User,
			location: URI.file(`pub.${name}`),
			identifier: { id: getGalleryExtensionId(manifest.publisher, manifest.name) },
			...properties,
			isValid: properties.isValid ?? true,
		};
		return <ILocalExtension>Object.create({ manifest, ...properties });
	}

	const noAssets: IGalleryExtensionAssets = {
		changelog: null,
		download: null!,
		icon: null!,
		license: null,
		manifest: null,
		readme: null,
		repository: null,
		signature: null,
		coreTranslations: []
	};

	function aGalleryExtension(name: string, properties: any = {}, galleryExtensionProperties: any = {}, assets: IGalleryExtensionAssets = noAssets): IGalleryExtension {
		const targetPlatform = getTargetPlatform(platform, arch);
		const galleryExtension = <IGalleryExtension>Object.create({ name, publisher: 'pub', version: '1.0.0', allTargetPlatforms: [targetPlatform], properties: {}, assets: {}, isSigned: true, ...properties });
		galleryExtension.properties = { ...galleryExtension.properties, dependencies: [], targetPlatform, ...galleryExtensionProperties };
		galleryExtension.assets = { ...galleryExtension.assets, ...assets };
		galleryExtension.identifier = { id: getGalleryExtensionId(galleryExtension.publisher, galleryExtension.name), uuid: generateUuid() };
		return <IGalleryExtension>galleryExtension;
	}

	function aPage<T>(...objects: T[]): IPager<T> {
		return { firstPage: objects, total: objects.length, pageSize: objects.length, getPage: () => null! };
	}

	function aMultiExtensionManagementServerService(instantiationService: TestInstantiationService, localExtensionManagementService?: IProfileAwareExtensionManagementService, remoteExtensionManagementService?: IProfileAwareExtensionManagementService): IExtensionManagementServerService {
		const localExtensionManagementServer: IExtensionManagementServer = {
			id: 'vscode-local',
			label: 'local',
			extensionManagementService: localExtensionManagementService || createExtensionManagementService(),
		};
		const remoteExtensionManagementServer: IExtensionManagementServer = {
			id: 'vscode-remote',
			label: 'remote',
			extensionManagementService: remoteExtensionManagementService || createExtensionManagementService(),
		};
		return anExtensionManagementServerService(localExtensionManagementServer, remoteExtensionManagementServer, null);
	}

	function createExtensionManagementService(installed: ILocalExtension[] = []): IProfileAwareExtensionManagementService {
		return <IProfileAwareExtensionManagementService>{
			onInstallExtension: Event.None,
			onDidInstallExtensions: Event.None,
			onUninstallExtension: Event.None,
			onDidUninstallExtension: Event.None,
			onDidChangeProfile: Event.None,
			onDidUpdateExtensionMetadata: Event.None,
			onProfileAwareDidInstallExtensions: Event.None,
			getInstalled: () => Promise.resolve<ILocalExtension[]>(installed),
			installFromGallery: (extension: IGalleryExtension) => Promise.reject(new Error('not supported')),
			updateMetadata: async (local: Mutable<ILocalExtension>, metadata: Partial<Metadata>, profileLocation: URI) => {
				local.identifier.uuid = metadata.id;
				local.publisherDisplayName = metadata.publisherDisplayName!;
				local.publisherId = metadata.publisherId!;
				return local;
			},
			getTargetPlatform: async () => getTargetPlatform(platform, arch),
			async getExtensionsControlManifest() { return <IExtensionsControlManifest>{ malicious: [], deprecated: {}, search: [], publisherMapping: {} }; },
			async resetPinnedStateForAllUserExtensions(pinned: boolean) { }
		};
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/externalTerminal/browser/externalTerminal.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/externalTerminal/browser/externalTerminal.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { URI } from '../../../../base/common/uri.js';
import { MenuId, MenuRegistry, IMenuItem } from '../../../../platform/actions/common/actions.js';
import { ITerminalGroupService, ITerminalService as IIntegratedTerminalService } from '../../terminal/browser/terminal.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { getMultiSelectedResources, IExplorerService } from '../../files/browser/files.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { Schemas } from '../../../../base/common/network.js';
import { distinct } from '../../../../base/common/arrays.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isWindows } from '../../../../base/common/platform.js';
import { dirname, basename } from '../../../../base/common/path.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IExternalTerminalConfiguration, IExternalTerminalService } from '../../../../platform/externalTerminal/common/externalTerminal.js';
import { TerminalLocation } from '../../../../platform/terminal/common/terminal.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';

const OPEN_IN_TERMINAL_COMMAND_ID = 'openInTerminal';
const OPEN_IN_INTEGRATED_TERMINAL_COMMAND_ID = 'openInIntegratedTerminal';

function registerOpenTerminalCommand(id: string, explorerKind: 'integrated' | 'external') {
	CommandsRegistry.registerCommand({
		id: id,
		handler: async (accessor, resource: URI) => {

			const configurationService = accessor.get(IConfigurationService);
			const fileService = accessor.get(IFileService);
			const integratedTerminalService = accessor.get(IIntegratedTerminalService);
			const remoteAgentService = accessor.get(IRemoteAgentService);
			const terminalGroupService = accessor.get(ITerminalGroupService);
			let externalTerminalService: IExternalTerminalService | undefined = undefined;
			try {
				externalTerminalService = accessor.get(IExternalTerminalService);
			} catch { }

			const resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IExplorerService));
			return fileService.resolveAll(resources.map(r => ({ resource: r }))).then(async stats => {
				// Always use integrated terminal when using a remote
				const config = configurationService.getValue<IExternalTerminalConfiguration>();

				const useIntegratedTerminal = remoteAgentService.getConnection() || explorerKind === 'integrated';
				const targets = distinct(stats.filter(data => data.success));
				if (useIntegratedTerminal) {
					// TODO: Use uri for cwd in createterminal
					const opened: { [path: string]: boolean } = {};
					const cwds = targets.map(({ stat }) => {
						const resource = stat!.resource;
						if (stat!.isDirectory) {
							return resource;
						}
						return URI.from({
							scheme: resource.scheme,
							authority: resource.authority,
							fragment: resource.fragment,
							query: resource.query,
							path: dirname(resource.path)
						});
					});
					for (const cwd of cwds) {
						if (opened[cwd.path]) {
							return;
						}
						opened[cwd.path] = true;
						const instance = await integratedTerminalService.createTerminal({ config: { cwd } });
						if (instance && instance.target !== TerminalLocation.Editor && (resources.length === 1 || !resource || cwd.path === resource.path || cwd.path === dirname(resource.path))) {
							integratedTerminalService.setActiveInstance(instance);
							terminalGroupService.showPanel(true);
						}
					}
				} else if (externalTerminalService) {
					distinct(targets.map(({ stat }) => stat!.isDirectory ? stat!.resource.fsPath : dirname(stat!.resource.fsPath))).forEach(cwd => {
						externalTerminalService.openTerminal(config.terminal.external, cwd);
					});
				}
			});
		}
	});
}

registerOpenTerminalCommand(OPEN_IN_TERMINAL_COMMAND_ID, 'external');
registerOpenTerminalCommand(OPEN_IN_INTEGRATED_TERMINAL_COMMAND_ID, 'integrated');

export class ExternalTerminalContribution extends Disposable implements IWorkbenchContribution {
	private _openInIntegratedTerminalMenuItem: IMenuItem;
	private _openInTerminalMenuItem: IMenuItem;

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		super();

		const shouldShowIntegratedOnLocal = ContextKeyExpr.and(
			ResourceContextKey.Scheme.isEqualTo(Schemas.file),
			ContextKeyExpr.or(ContextKeyExpr.equals('config.terminal.explorerKind', 'integrated'), ContextKeyExpr.equals('config.terminal.explorerKind', 'both')));


		const shouldShowExternalKindOnLocal = ContextKeyExpr.and(
			ResourceContextKey.Scheme.isEqualTo(Schemas.file),
			ContextKeyExpr.or(ContextKeyExpr.equals('config.terminal.explorerKind', 'external'), ContextKeyExpr.equals('config.terminal.explorerKind', 'both')));

		this._openInIntegratedTerminalMenuItem = {
			group: 'navigation',
			order: 30,
			command: {
				id: OPEN_IN_INTEGRATED_TERMINAL_COMMAND_ID,
				title: nls.localize('scopedConsoleAction.Integrated', "Open in Integrated Terminal")
			},
			when: ContextKeyExpr.or(shouldShowIntegratedOnLocal, ResourceContextKey.Scheme.isEqualTo(Schemas.vscodeRemote))
		};


		this._openInTerminalMenuItem = {
			group: 'navigation',
			order: 31,
			command: {
				id: OPEN_IN_TERMINAL_COMMAND_ID,
				title: nls.localize('scopedConsoleAction.external', "Open in External Terminal")
			},
			when: shouldShowExternalKindOnLocal
		};


		MenuRegistry.appendMenuItem(MenuId.ExplorerContext, this._openInTerminalMenuItem);
		MenuRegistry.appendMenuItem(MenuId.ExplorerContext, this._openInIntegratedTerminalMenuItem);

		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('terminal.explorerKind') || e.affectsConfiguration('terminal.external')) {
				this._refreshOpenInTerminalMenuItemTitle();
			}
		}));

		this._refreshOpenInTerminalMenuItemTitle();
	}

	private isWindows(): boolean {
		const config = this._configurationService.getValue<IExternalTerminalConfiguration>().terminal;
		if (isWindows && config.external?.windowsExec) {
			const file = basename(config.external.windowsExec);
			if (file === 'wt' || file === 'wt.exe') {
				return true;
			}
		}
		return false;
	}

	private _refreshOpenInTerminalMenuItemTitle(): void {
		if (this.isWindows()) {
			this._openInTerminalMenuItem.command.title = nls.localize('scopedConsoleAction.wt', "Open in Windows Terminal");
		}
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ExternalTerminalContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/externalTerminal/electron-browser/externalTerminal.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/externalTerminal/electron-browser/externalTerminal.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as paths from '../../../../base/common/path.js';
import { DEFAULT_TERMINAL_OSX, IExternalTerminalSettings } from '../../../../platform/externalTerminal/common/externalTerminal.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Schemas } from '../../../../base/common/network.js';
import { IConfigurationRegistry, Extensions, ConfigurationScope, type IConfigurationPropertySchema } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { IExternalTerminalService } from '../../../../platform/externalTerminal/electron-browser/externalTerminalService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { TerminalContextKeys } from '../../terminal/common/terminalContextKey.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';

const OPEN_NATIVE_CONSOLE_COMMAND_ID = 'workbench.action.terminal.openNativeConsole';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: OPEN_NATIVE_CONSOLE_COMMAND_ID,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyC,
	when: TerminalContextKeys.notFocus,
	weight: KeybindingWeight.WorkbenchContrib,
	handler: async (accessor) => {
		const historyService = accessor.get(IHistoryService);
		// Open external terminal in local workspaces
		const terminalService = accessor.get(IExternalTerminalService);
		const configurationService = accessor.get(IConfigurationService);
		const remoteAuthorityResolverService = accessor.get(IRemoteAuthorityResolverService);
		const root = historyService.getLastActiveWorkspaceRoot();
		const config = configurationService.getValue<IExternalTerminalSettings>('terminal.external');

		// It's a local workspace, open the root
		if (root?.scheme === Schemas.file) {
			terminalService.openTerminal(config, root.fsPath);
			return;
		}

		// If it's a remote workspace, open the canonical URI if it is a local folder
		try {
			if (root?.scheme === Schemas.vscodeRemote) {
				const canonicalUri = await remoteAuthorityResolverService.getCanonicalURI(root);
				if (canonicalUri.scheme === Schemas.file) {
					terminalService.openTerminal(config, canonicalUri.fsPath);
					return;
				}
			}
		} catch { }

		// Open the current file's folder if it's local or its canonical URI is local
		// Opens current file's folder, if no folder is open in editor
		const activeFile = historyService.getLastActiveFile(Schemas.file);
		if (activeFile?.scheme === Schemas.file) {
			terminalService.openTerminal(config, paths.dirname(activeFile.fsPath));
			return;
		}
		try {
			if (activeFile?.scheme === Schemas.vscodeRemote) {
				const canonicalUri = await remoteAuthorityResolverService.getCanonicalURI(activeFile);
				if (canonicalUri.scheme === Schemas.file) {
					terminalService.openTerminal(config, canonicalUri.fsPath);
					return;
				}
			}
		} catch { }

		// Fallback to opening without a cwd which will end up using the local home path
		terminalService.openTerminal(config, undefined);
	}
});

MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
	command: {
		id: OPEN_NATIVE_CONSOLE_COMMAND_ID,
		title: nls.localize2('globalConsoleAction', "Open New External Terminal")
	}
});

export class ExternalTerminalContribution implements IWorkbenchContribution {

	public _serviceBrand: undefined;
	constructor(@IExternalTerminalService private readonly _externalTerminalService: IExternalTerminalService) {
		this._updateConfiguration();
	}

	private async _updateConfiguration(): Promise<void> {
		const terminals = await this._externalTerminalService.getDefaultTerminalForPlatforms();
		const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
		const terminalKindProperties: Partial<IConfigurationPropertySchema> = {
			type: 'string',
			enum: [
				'integrated',
				'external',
				'both'
			],
			enumDescriptions: [
				nls.localize('terminal.kind.integrated', "Show the integrated terminal action."),
				nls.localize('terminal.kind.external', "Show the external terminal action."),
				nls.localize('terminal.kind.both', "Show both integrated and external terminal actions.")
			],
			default: 'integrated'
		};
		configurationRegistry.registerConfiguration({
			id: 'externalTerminal',
			order: 100,
			title: nls.localize('terminalConfigurationTitle', "External Terminal"),
			type: 'object',
			properties: {
				'terminal.explorerKind': {
					...terminalKindProperties,
					description: nls.localize('explorer.openInTerminalKind', "When opening a file from the Explorer in a terminal, determines what kind of terminal will be launched"),
				},
				'terminal.sourceControlRepositoriesKind': {
					...terminalKindProperties,
					description: nls.localize('sourceControlRepositories.openInTerminalKind', "When opening a repository from the Source Control Repositories view in a terminal, determines what kind of terminal will be launched"),
				},
				'terminal.external.windowsExec': {
					type: 'string',
					description: nls.localize('terminal.external.windowsExec', "Customizes which terminal to run on Windows."),
					default: terminals.windows,
					scope: ConfigurationScope.APPLICATION
				},
				'terminal.external.osxExec': {
					type: 'string',
					description: nls.localize('terminal.external.osxExec', "Customizes which terminal application to run on macOS."),
					default: DEFAULT_TERMINAL_OSX,
					scope: ConfigurationScope.APPLICATION
				},
				'terminal.external.linuxExec': {
					type: 'string',
					description: nls.localize('terminal.external.linuxExec', "Customizes which terminal to run on Linux."),
					default: terminals.linux,
					scope: ConfigurationScope.APPLICATION
				}
			}
		});
	}
}

// Register workbench contributions
const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(ExternalTerminalContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/externalUriOpener/common/configuration.ts]---
Location: vscode-main/src/vs/workbench/contrib/externalUriOpener/common/configuration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationNode, IConfigurationRegistry, Extensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import * as nls from '../../../../nls.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { Registry } from '../../../../platform/registry/common/platform.js';

export const defaultExternalUriOpenerId = 'default';

export const externalUriOpenersSettingId = 'workbench.externalUriOpeners';

export interface ExternalUriOpenersConfiguration {
	readonly [uriGlob: string]: string;
}

const externalUriOpenerIdSchemaAddition: IJSONSchema = {
	type: 'string',
	enum: []
};

const exampleUriPatterns = `
- \`https://microsoft.com\`: Matches this specific domain using https
- \`https://microsoft.com:8080\`: Matches this specific domain on this port using https
- \`https://microsoft.com:*\`: Matches this specific domain on any port using https
- \`https://microsoft.com/foo\`: Matches \`https://microsoft.com/foo\` and \`https://microsoft.com/foo/bar\`, but not \`https://microsoft.com/foobar\` or \`https://microsoft.com/bar\`
- \`https://*.microsoft.com\`: Match all domains ending in \`microsoft.com\` using https
- \`microsoft.com\`: Match this specific domain using either http or https
- \`*.microsoft.com\`: Match all domains ending in \`microsoft.com\` using either http or https
- \`http://192.168.0.1\`: Matches this specific IP using http
- \`http://192.168.0.*\`: Matches all IP's with this prefix using http
- \`*\`: Match all domains using either http or https`;

export const externalUriOpenersConfigurationNode: IConfigurationNode = {
	...workbenchConfigurationNodeBase,
	properties: {
		[externalUriOpenersSettingId]: {
			type: 'object',
			markdownDescription: nls.localize('externalUriOpeners', "Configure the opener to use for external URIs (http, https)."),
			defaultSnippets: [{
				body: {
					'example.com': '$1'
				}
			}],
			additionalProperties: {
				anyOf: [
					{
						type: 'string',
						markdownDescription: nls.localize('externalUriOpeners.uri', "Map URI pattern to an opener id.\nExample patterns: \n{0}", exampleUriPatterns),
					},
					{
						type: 'string',
						markdownDescription: nls.localize('externalUriOpeners.uri', "Map URI pattern to an opener id.\nExample patterns: \n{0}", exampleUriPatterns),
						enum: [defaultExternalUriOpenerId],
						enumDescriptions: [nls.localize('externalUriOpeners.defaultId', "Open using VS Code's standard opener.")],
					},
					externalUriOpenerIdSchemaAddition
				]
			}
		}
	}
};

export function updateContributedOpeners(enumValues: string[], enumDescriptions: string[]): void {
	externalUriOpenerIdSchemaAddition.enum = enumValues;
	externalUriOpenerIdSchemaAddition.enumDescriptions = enumDescriptions;

	Registry.as<IConfigurationRegistry>(Extensions.Configuration)
		.notifyConfigurationSchemaUpdated(externalUriOpenersConfigurationNode);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/externalUriOpener/common/contributedOpeners.ts]---
Location: vscode-main/src/vs/workbench/contrib/externalUriOpener/common/contributedOpeners.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Memento } from '../../../common/memento.js';
import { updateContributedOpeners } from './configuration.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';

interface RegisteredExternalOpener {
	readonly extensionId: string;

	isCurrentlyRegistered: boolean;
}

interface OpenersMemento {
	[id: string]: RegisteredExternalOpener | undefined;
}

export class ContributedExternalUriOpenersStore extends Disposable {

	private static readonly STORAGE_ID = 'externalUriOpeners';

	private readonly _openers = new Map<string, RegisteredExternalOpener>();
	private readonly _memento: Memento<OpenersMemento>;
	private _mementoObject: OpenersMemento;

	constructor(
		@IStorageService storageService: IStorageService,
		@IExtensionService private readonly _extensionService: IExtensionService
	) {
		super();

		this._memento = new Memento(ContributedExternalUriOpenersStore.STORAGE_ID, storageService);
		this._mementoObject = this._memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		for (const [id, value] of Object.entries(this._mementoObject || {})) {
			if (value) {
				this.add(id, value.extensionId, { isCurrentlyRegistered: false });
			}
		}

		this.invalidateOpenersOnExtensionsChanged();

		this._register(this._extensionService.onDidChangeExtensions(() => this.invalidateOpenersOnExtensionsChanged()));
		this._register(this._extensionService.onDidChangeExtensionsStatus(() => this.invalidateOpenersOnExtensionsChanged()));
	}

	public didRegisterOpener(id: string, extensionId: string): void {
		this.add(id, extensionId, {
			isCurrentlyRegistered: true
		});
	}

	private add(id: string, extensionId: string, options: { isCurrentlyRegistered: boolean }): void {
		const existing = this._openers.get(id);
		if (existing) {
			existing.isCurrentlyRegistered = existing.isCurrentlyRegistered || options.isCurrentlyRegistered;
			return;
		}

		const entry = {
			extensionId,
			isCurrentlyRegistered: options.isCurrentlyRegistered
		};
		this._openers.set(id, entry);

		this._mementoObject[id] = entry;
		this._memento.saveMemento();

		this.updateSchema();
	}

	public delete(id: string): void {
		this._openers.delete(id);

		delete this._mementoObject[id];
		this._memento.saveMemento();

		this.updateSchema();
	}

	private async invalidateOpenersOnExtensionsChanged() {
		await this._extensionService.whenInstalledExtensionsRegistered();
		const registeredExtensions = this._extensionService.extensions;

		for (const [id, entry] of this._openers) {
			const extension = registeredExtensions.find(r => r.identifier.value === entry.extensionId);
			if (extension) {
				if (!this._extensionService.canRemoveExtension(extension)) {
					// The extension is running. We should have registered openers at this point
					if (!entry.isCurrentlyRegistered) {
						this.delete(id);
					}
				}
			} else {
				// The opener came from an extension that is no longer enabled/installed
				this.delete(id);
			}
		}
	}

	private updateSchema() {
		const ids: string[] = [];
		const descriptions: string[] = [];

		for (const [id, entry] of this._openers) {
			ids.push(id);
			descriptions.push(entry.extensionId);
		}

		updateContributedOpeners(ids, descriptions);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/externalUriOpener/common/externalUriOpener.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/externalUriOpener/common/externalUriOpener.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { externalUriOpenersConfigurationNode } from './configuration.js';
import { ExternalUriOpenerService, IExternalUriOpenerService } from './externalUriOpenerService.js';

registerSingleton(IExternalUriOpenerService, ExternalUriOpenerService, InstantiationType.Delayed);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerConfiguration(externalUriOpenersConfigurationNode);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/externalUriOpener/common/externalUriOpenerService.ts]---
Location: vscode-main/src/vs/workbench/contrib/externalUriOpener/common/externalUriOpenerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { isWeb } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import * as languages from '../../../../editor/common/languages.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IExternalOpener, IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { defaultExternalUriOpenerId, ExternalUriOpenersConfiguration, externalUriOpenersSettingId } from './configuration.js';
import { testUrlMatchesGlob } from '../../url/common/urlGlob.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';


export const IExternalUriOpenerService = createDecorator<IExternalUriOpenerService>('externalUriOpenerService');


export interface IExternalOpenerProvider {
	getOpeners(targetUri: URI): AsyncIterable<IExternalUriOpener>;
}

export interface IExternalUriOpener {
	readonly id: string;
	readonly label: string;

	canOpen(uri: URI, token: CancellationToken): Promise<languages.ExternalUriOpenerPriority>;
	openExternalUri(uri: URI, ctx: { sourceUri: URI }, token: CancellationToken): Promise<boolean>;
}

export interface IExternalUriOpenerService {
	readonly _serviceBrand: undefined;

	/**
	 * Registers a provider for external resources openers.
	 */
	registerExternalOpenerProvider(provider: IExternalOpenerProvider): IDisposable;

	/**
	 * Get the configured IExternalUriOpener for the uri.
	 * If there is no opener configured, then returns the first opener that can handle the uri.
	 */
	getOpener(uri: URI, ctx: { sourceUri: URI; preferredOpenerId?: string }, token: CancellationToken): Promise<IExternalUriOpener | undefined>;
}

export class ExternalUriOpenerService extends Disposable implements IExternalUriOpenerService, IExternalOpener {

	public readonly _serviceBrand: undefined;

	private readonly _providers = new LinkedList<IExternalOpenerProvider>();

	constructor(
		@IOpenerService openerService: IOpenerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILogService private readonly logService: ILogService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
	) {
		super();
		this._register(openerService.registerExternalOpener(this));
	}

	registerExternalOpenerProvider(provider: IExternalOpenerProvider): IDisposable {
		const remove = this._providers.push(provider);
		return { dispose: remove };
	}

	private async getOpeners(targetUri: URI, allowOptional: boolean, ctx: { sourceUri: URI; preferredOpenerId?: string }, token: CancellationToken): Promise<IExternalUriOpener[]> {
		const allOpeners = await this.getAllOpenersForUri(targetUri);

		if (allOpeners.size === 0) {
			return [];
		}

		// First see if we have a preferredOpener
		if (ctx.preferredOpenerId) {
			if (ctx.preferredOpenerId === defaultExternalUriOpenerId) {
				return [];
			}

			const preferredOpener = allOpeners.get(ctx.preferredOpenerId);
			if (preferredOpener) {
				// Skip the `canOpen` check here since the opener was specifically requested.
				return [preferredOpener];
			}
		}

		// Check to see if we have a configured opener
		const configuredOpener = this.getConfiguredOpenerForUri(allOpeners, targetUri);
		if (configuredOpener) {
			// Skip the `canOpen` check here since the opener was specifically requested.
			return configuredOpener === defaultExternalUriOpenerId ? [] : [configuredOpener];
		}

		// Then check to see if there is a valid opener
		const validOpeners: Array<{ opener: IExternalUriOpener; priority: languages.ExternalUriOpenerPriority }> = [];
		await Promise.all(Array.from(allOpeners.values()).map(async opener => {
			let priority: languages.ExternalUriOpenerPriority;
			try {
				priority = await opener.canOpen(ctx.sourceUri, token);
			} catch (e) {
				this.logService.error(e);
				return;
			}

			switch (priority) {
				case languages.ExternalUriOpenerPriority.Option:
				case languages.ExternalUriOpenerPriority.Default:
				case languages.ExternalUriOpenerPriority.Preferred:
					validOpeners.push({ opener, priority });
					break;
			}
		}));

		if (validOpeners.length === 0) {
			return [];
		}

		// See if we have a preferred opener first
		const preferred = validOpeners.filter(x => x.priority === languages.ExternalUriOpenerPriority.Preferred).at(0);
		if (preferred) {
			return [preferred.opener];
		}

		// See if we only have optional openers, use the default opener
		if (!allowOptional && validOpeners.every(x => x.priority === languages.ExternalUriOpenerPriority.Option)) {
			return [];
		}

		return validOpeners.map(value => value.opener);
	}

	async openExternal(href: string, ctx: { sourceUri: URI; preferredOpenerId?: string }, token: CancellationToken): Promise<boolean> {

		const targetUri = typeof href === 'string' ? URI.parse(href) : href;

		const allOpeners = await this.getOpeners(targetUri, false, ctx, token);
		if (allOpeners.length === 0) {
			return false;
		} else if (allOpeners.length === 1) {
			return allOpeners[0].openExternalUri(targetUri, ctx, token);
		}

		// Otherwise prompt
		return this.showOpenerPrompt(allOpeners, targetUri, ctx, token);
	}

	async getOpener(targetUri: URI, ctx: { sourceUri: URI; preferredOpenerId?: string }, token: CancellationToken): Promise<IExternalUriOpener | undefined> {
		const allOpeners = await this.getOpeners(targetUri, true, ctx, token);
		if (allOpeners.length >= 1) {
			return allOpeners[0];
		}
		return undefined;
	}

	private async getAllOpenersForUri(targetUri: URI): Promise<Map<string, IExternalUriOpener>> {
		const allOpeners = new Map<string, IExternalUriOpener>();
		await Promise.all(Iterable.map(this._providers, async (provider) => {
			for await (const opener of provider.getOpeners(targetUri)) {
				allOpeners.set(opener.id, opener);
			}
		}));
		return allOpeners;
	}

	private getConfiguredOpenerForUri(openers: Map<string, IExternalUriOpener>, targetUri: URI): IExternalUriOpener | 'default' | undefined {
		const config = this.configurationService.getValue<ExternalUriOpenersConfiguration>(externalUriOpenersSettingId) || {};
		for (const [uriGlob, id] of Object.entries(config)) {
			if (testUrlMatchesGlob(targetUri, uriGlob)) {
				if (id === defaultExternalUriOpenerId) {
					return 'default';
				}

				const entry = openers.get(id);
				if (entry) {
					return entry;
				}
			}
		}
		return undefined;
	}

	private async showOpenerPrompt(
		openers: ReadonlyArray<IExternalUriOpener>,
		targetUri: URI,
		ctx: { sourceUri: URI },
		token: CancellationToken
	): Promise<boolean> {
		type PickItem = IQuickPickItem & { opener?: IExternalUriOpener | 'configureDefault' };

		const items: Array<PickItem | IQuickPickSeparator> = openers.map((opener): PickItem => {
			return {
				label: opener.label,
				opener: opener
			};
		});
		items.push(
			{
				label: isWeb
					? nls.localize('selectOpenerDefaultLabel.web', 'Open in new browser window')
					: nls.localize('selectOpenerDefaultLabel', 'Open in default browser'),
				opener: undefined
			},
			{ type: 'separator' },
			{
				label: nls.localize('selectOpenerConfigureTitle', "Configure default opener..."),
				opener: 'configureDefault'
			});

		const picked = await this.quickInputService.pick(items, {
			placeHolder: nls.localize('selectOpenerPlaceHolder', "How would you like to open: {0}", targetUri.toString())
		});

		if (!picked) {
			// Still cancel the default opener here since we prompted the user
			return true;
		}

		if (typeof picked.opener === 'undefined') {
			return false; // Fallback to default opener
		} else if (picked.opener === 'configureDefault') {
			await this.preferencesService.openUserSettings({
				jsonEditor: true,
				revealSetting: { key: externalUriOpenersSettingId, edit: true }
			});
			return true;
		} else {
			return picked.opener.openExternalUri(targetUri, ctx, token);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/externalUriOpener/test/common/externalUriOpenerService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/externalUriOpener/test/common/externalUriOpenerService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ExternalUriOpenerPriority } from '../../../../../editor/common/languages.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IPickOptions, IQuickInputService, IQuickPickItem, QuickPickInput } from '../../../../../platform/quickinput/common/quickInput.js';
import { ExternalUriOpenerService, IExternalOpenerProvider, IExternalUriOpener } from '../../common/externalUriOpenerService.js';


class MockQuickInputService implements Partial<IQuickInputService> {

	constructor(
		private readonly pickIndex: number
	) { }

	public pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: IPickOptions<T> & { canPickMany: true }, token?: CancellationToken): Promise<T[]>;
	public pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: IPickOptions<T> & { canPickMany: false }, token?: CancellationToken): Promise<T>;
	public async pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: Omit<IPickOptions<T>, 'canPickMany'>, token?: CancellationToken): Promise<T | undefined> {
		const resolvedPicks = await picks;
		const item = resolvedPicks[this.pickIndex];
		if (item.type === 'separator') {
			return undefined;
		}
		return item;
	}

}

suite('ExternalUriOpenerService', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = disposables.add(new TestInstantiationService());

		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IOpenerService, {
			registerExternalOpener: () => { return Disposable.None; }
		});
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Should not open if there are no openers', async () => {
		const externalUriOpenerService = disposables.add(instantiationService.createInstance(ExternalUriOpenerService));

		externalUriOpenerService.registerExternalOpenerProvider(new class implements IExternalOpenerProvider {
			async *getOpeners(_targetUri: URI): AsyncGenerator<IExternalUriOpener> {
				// noop
			}
		});

		const uri = URI.parse('http://contoso.com');
		const didOpen = await externalUriOpenerService.openExternal(uri.toString(), { sourceUri: uri }, CancellationToken.None);
		assert.strictEqual(didOpen, false);
	});

	test('Should prompt if there is at least one enabled opener', async () => {
		instantiationService.stub(IQuickInputService, new MockQuickInputService(0));

		const externalUriOpenerService = disposables.add(instantiationService.createInstance(ExternalUriOpenerService));

		let openedWithEnabled = false;
		externalUriOpenerService.registerExternalOpenerProvider(new class implements IExternalOpenerProvider {
			async *getOpeners(_targetUri: URI): AsyncGenerator<IExternalUriOpener> {
				yield {
					id: 'disabled-id',
					label: 'disabled',
					canOpen: async () => ExternalUriOpenerPriority.None,
					openExternalUri: async () => true,
				};
				yield {
					id: 'enabled-id',
					label: 'enabled',
					canOpen: async () => ExternalUriOpenerPriority.Default,
					openExternalUri: async () => {
						openedWithEnabled = true;
						return true;
					}
				};
			}
		});

		const uri = URI.parse('http://contoso.com');
		const didOpen = await externalUriOpenerService.openExternal(uri.toString(), { sourceUri: uri }, CancellationToken.None);
		assert.strictEqual(didOpen, true);
		assert.strictEqual(openedWithEnabled, true);
	});

	test('Should automatically pick single preferred opener without prompt', async () => {
		const externalUriOpenerService = disposables.add(instantiationService.createInstance(ExternalUriOpenerService));

		let openedWithPreferred = false;
		externalUriOpenerService.registerExternalOpenerProvider(new class implements IExternalOpenerProvider {
			async *getOpeners(_targetUri: URI): AsyncGenerator<IExternalUriOpener> {
				yield {
					id: 'other-id',
					label: 'other',
					canOpen: async () => ExternalUriOpenerPriority.Default,
					openExternalUri: async () => {
						return true;
					}
				};
				yield {
					id: 'preferred-id',
					label: 'preferred',
					canOpen: async () => ExternalUriOpenerPriority.Preferred,
					openExternalUri: async () => {
						openedWithPreferred = true;
						return true;
					}
				};
			}
		});

		const uri = URI.parse('http://contoso.com');
		const didOpen = await externalUriOpenerService.openExternal(uri.toString(), { sourceUri: uri }, CancellationToken.None);
		assert.strictEqual(didOpen, true);
		assert.strictEqual(openedWithPreferred, true);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/explorerFileContrib.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/explorerFileContrib.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';

export const enum ExplorerExtensions {
	FileContributionRegistry = 'workbench.registry.explorer.fileContributions'
}

/**
 * Contributes to the rendering of a file in the explorer.
 */
export interface IExplorerFileContribution extends IDisposable {
	/**
	 * Called to render a file in the container. The implementation should
	 * remove any rendered elements if `resource` is undefined.
	 */
	setResource(resource: URI | undefined): void;
}

export interface IExplorerFileContributionDescriptor {
	create(insta: IInstantiationService, container: HTMLElement): IExplorerFileContribution;
}

export interface IExplorerFileContributionRegistry {
	/**
	 * Registers a new contribution. A new instance of the contribution will be
	 * instantiated for each template in the explorer.
	 */
	register(descriptor: IExplorerFileContributionDescriptor): void;
}

class ExplorerFileContributionRegistry extends Disposable implements IExplorerFileContributionRegistry {
	private readonly _onDidRegisterDescriptor = this._register(new Emitter<IExplorerFileContributionDescriptor>());
	public readonly onDidRegisterDescriptor = this._onDidRegisterDescriptor.event;

	private readonly descriptors: IExplorerFileContributionDescriptor[] = [];

	/** @inheritdoc */
	public register(descriptor: IExplorerFileContributionDescriptor): void {
		this.descriptors.push(descriptor);
		this._onDidRegisterDescriptor.fire(descriptor);
	}

	/**
	 * Creates a new instance of all registered contributions.
	 */
	public create(insta: IInstantiationService, container: HTMLElement, store: DisposableStore): IExplorerFileContribution[] {
		return this.descriptors.map(d => {
			const i = d.create(insta, container);
			store.add(i);
			return i;
		});
	}
}

export const explorerFileContribRegistry = new ExplorerFileContributionRegistry();
Registry.add(ExplorerExtensions.FileContributionRegistry, explorerFileContribRegistry);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/explorerService.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/explorerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IFilesConfiguration, ISortOrderConfiguration, SortOrder, LexicographicOptions } from '../common/files.js';
import { ExplorerItem, ExplorerModel } from '../common/explorerModel.js';
import { URI } from '../../../../base/common/uri.js';
import { FileOperationEvent, FileOperation, IFileService, FileChangesEvent, FileChangeType, IResolveFileOptions } from '../../../../platform/files/common/files.js';
import { dirname, basename } from '../../../../base/common/resources.js';
import { IConfigurationService, IConfigurationChangeEvent } from '../../../../platform/configuration/common/configuration.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IEditableData } from '../../../common/views.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IBulkEditService, ResourceFileEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { UndoRedoSource } from '../../../../platform/undoRedo/common/undoRedo.js';
import { IExplorerView, IExplorerService } from './files.js';
import { IProgressService, ProgressLocation, IProgressCompositeOptions, IProgressOptions } from '../../../../platform/progress/common/progress.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IExpression } from '../../../../base/common/glob.js';
import { ResourceGlobMatcher } from '../../../common/resources.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';

export const UNDO_REDO_SOURCE = new UndoRedoSource();

export class ExplorerService implements IExplorerService {
	declare readonly _serviceBrand: undefined;

	private static readonly EXPLORER_FILE_CHANGES_REACT_DELAY = 500; // delay in ms to react to file changes to give our internal events a chance to react first

	private readonly disposables = new DisposableStore();
	private editable: { stat: ExplorerItem; data: IEditableData } | undefined;
	private config: IFilesConfiguration['explorer'];
	private cutItems: ExplorerItem[] | undefined;
	private view: IExplorerView | undefined;
	private model: ExplorerModel;
	private onFileChangesScheduler: RunOnceScheduler;
	private fileChangeEvents: FileChangesEvent[] = [];
	private revealExcludeMatcher: ResourceGlobMatcher;

	constructor(
		@IFileService private fileService: IFileService,
		@IConfigurationService private configurationService: IConfigurationService,
		@IWorkspaceContextService private contextService: IWorkspaceContextService,
		@IClipboardService private clipboardService: IClipboardService,
		@IEditorService private editorService: IEditorService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IBulkEditService private readonly bulkEditService: IBulkEditService,
		@IProgressService private readonly progressService: IProgressService,
		@IHostService hostService: IHostService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService
	) {
		this.config = this.configurationService.getValue('explorer');

		this.model = new ExplorerModel(this.contextService, this.uriIdentityService, this.fileService, this.configurationService, this.filesConfigurationService);
		this.disposables.add(this.model);
		this.disposables.add(this.fileService.onDidRunOperation(e => this.onDidRunOperation(e)));

		this.onFileChangesScheduler = new RunOnceScheduler(async () => {
			const events = this.fileChangeEvents;
			this.fileChangeEvents = [];

			// Filter to the ones we care
			const types = [FileChangeType.DELETED];
			if (this.config.sortOrder === SortOrder.Modified) {
				types.push(FileChangeType.UPDATED);
			}

			let shouldRefresh = false;
			// For DELETED and UPDATED events go through the explorer model and check if any of the items got affected
			this.roots.forEach(r => {
				if (this.view && !shouldRefresh) {
					shouldRefresh = doesFileEventAffect(r, this.view, events, types);
				}
			});
			// For ADDED events we need to go through all the events and check if the explorer is already aware of some of them
			// Or if they affect not yet resolved parts of the explorer. If that is the case we will not refresh.
			events.forEach(e => {
				if (!shouldRefresh) {
					for (const resource of e.rawAdded) {
						const parent = this.model.findClosest(dirname(resource));
						// Parent of the added resource is resolved and the explorer model is not aware of the added resource - we need to refresh
						if (parent && !parent.getChild(basename(resource))) {
							shouldRefresh = true;
							break;
						}
					}
				}
			});

			if (shouldRefresh) {
				await this.refresh(false);
			}

		}, ExplorerService.EXPLORER_FILE_CHANGES_REACT_DELAY);

		this.disposables.add(this.fileService.onDidFilesChange(e => {
			this.fileChangeEvents.push(e);
			// Don't mess with the file tree while in the process of editing. #112293
			if (this.editable) {
				return;
			}
			if (!this.onFileChangesScheduler.isScheduled()) {
				this.onFileChangesScheduler.schedule();
			}
		}));
		this.disposables.add(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));
		this.disposables.add(Event.any<{ scheme: string }>(this.fileService.onDidChangeFileSystemProviderRegistrations, this.fileService.onDidChangeFileSystemProviderCapabilities)(async e => {
			let affected = false;
			this.model.roots.forEach(r => {
				if (r.resource.scheme === e.scheme) {
					affected = true;
					r.forgetChildren();
				}
			});
			if (affected) {
				if (this.view) {
					await this.view.setTreeInput();
				}
			}
		}));
		this.disposables.add(this.model.onDidChangeRoots(() => {
			this.view?.setTreeInput();
		}));

		// Refresh explorer when window gets focus to compensate for missing file events #126817
		this.disposables.add(hostService.onDidChangeFocus(hasFocus => {
			if (hasFocus) {
				this.refresh(false);
			}
		}));
		this.revealExcludeMatcher = new ResourceGlobMatcher(
			(uri) => getRevealExcludes(configurationService.getValue<IFilesConfiguration>({ resource: uri })),
			(event) => event.affectsConfiguration('explorer.autoRevealExclude'),
			contextService, configurationService);
		this.disposables.add(this.revealExcludeMatcher);
	}

	get roots(): ExplorerItem[] {
		return this.model.roots;
	}

	get sortOrderConfiguration(): ISortOrderConfiguration {
		return {
			sortOrder: this.config.sortOrder,
			lexicographicOptions: this.config.sortOrderLexicographicOptions,
			reverse: this.config.sortOrderReverse,
		};
	}

	registerView(contextProvider: IExplorerView): void {
		this.view = contextProvider;
	}

	getContext(respectMultiSelection: boolean, ignoreNestedChildren: boolean = false): ExplorerItem[] {
		if (!this.view) {
			return [];
		}

		const items = new Set<ExplorerItem>(this.view.getContext(respectMultiSelection));
		items.forEach(item => {
			try {
				if (respectMultiSelection && !ignoreNestedChildren && this.view?.isItemCollapsed(item) && item.nestedChildren) {
					for (const child of item.nestedChildren) {
						items.add(child);
					}
				}
			} catch {
				// We will error out trying to resolve collapsed nodes that have not yet been resolved.
				// So we catch and ignore them in the multiSelect context
				return;
			}
		});

		return [...items];
	}

	async applyBulkEdit(edit: ResourceFileEdit[], options: { undoLabel: string; progressLabel: string; confirmBeforeUndo?: boolean; progressLocation?: ProgressLocation.Explorer | ProgressLocation.Window }): Promise<void> {
		const cancellationTokenSource = new CancellationTokenSource();
		const location = options.progressLocation ?? ProgressLocation.Window;
		let progressOptions;
		if (location === ProgressLocation.Window) {
			progressOptions = {
				location: location,
				title: options.progressLabel,
				cancellable: edit.length > 1,
			} satisfies IProgressOptions;
		} else {
			progressOptions = {
				location: location,
				title: options.progressLabel,
				cancellable: edit.length > 1,
				delay: 500,
			} satisfies IProgressCompositeOptions;
		}
		const promise = this.progressService.withProgress(progressOptions, async progress => {
			await this.bulkEditService.apply(edit, {
				undoRedoSource: UNDO_REDO_SOURCE,
				label: options.undoLabel,
				code: 'undoredo.explorerOperation',
				progress,
				token: cancellationTokenSource.token,
				confirmBeforeUndo: options.confirmBeforeUndo
			});
		}, () => cancellationTokenSource.cancel());
		await this.progressService.withProgress({ location: ProgressLocation.Explorer, delay: 500 }, () => promise);
		cancellationTokenSource.dispose();
	}

	hasViewFocus(): boolean {
		return !!this.view && this.view.hasFocus();
	}

	// IExplorerService methods

	findClosest(resource: URI): ExplorerItem | null {
		return this.model.findClosest(resource);
	}

	findClosestRoot(resource: URI): ExplorerItem | null {
		const parentRoots = this.model.roots.filter(r => this.uriIdentityService.extUri.isEqualOrParent(resource, r.resource))
			.sort((first, second) => second.resource.path.length - first.resource.path.length);
		return parentRoots.length ? parentRoots[0] : null;
	}

	async setEditable(stat: ExplorerItem, data: IEditableData | null): Promise<void> {
		if (!this.view) {
			return;
		}

		if (!data) {
			this.editable = undefined;
		} else {
			this.editable = { stat, data };
		}
		const isEditing = this.isEditable(stat);
		try {
			await this.view.setEditable(stat, isEditing);
		} catch {
			return;
		}


		if (!this.editable && this.fileChangeEvents.length && !this.onFileChangesScheduler.isScheduled()) {
			this.onFileChangesScheduler.schedule();
		}
	}

	async setToCopy(items: ExplorerItem[], cut: boolean): Promise<void> {
		const previouslyCutItems = this.cutItems;
		this.cutItems = cut ? items : undefined;
		await this.clipboardService.writeResources(items.map(s => s.resource));

		this.view?.itemsCopied(items, cut, previouslyCutItems);
	}

	isCut(item: ExplorerItem): boolean {
		return !!this.cutItems && this.cutItems.some(i => this.uriIdentityService.extUri.isEqual(i.resource, item.resource));
	}

	getEditable(): { stat: ExplorerItem; data: IEditableData } | undefined {
		return this.editable;
	}

	getEditableData(stat: ExplorerItem): IEditableData | undefined {
		return this.editable && this.editable.stat === stat ? this.editable.data : undefined;
	}

	isEditable(stat: ExplorerItem | undefined): boolean {
		return !!this.editable && (this.editable.stat === stat || !stat);
	}

	async select(resource: URI, reveal?: boolean | string): Promise<void> {
		if (!this.view) {
			return;
		}

		// If file or parent matches exclude patterns, do not reveal unless reveal argument is 'force'
		const ignoreRevealExcludes = reveal === 'force';

		const fileStat = this.findClosest(resource);
		if (fileStat) {
			if (!this.shouldAutoRevealItem(fileStat, ignoreRevealExcludes)) {
				return;
			}
			await this.view.selectResource(fileStat.resource, reveal);
			return Promise.resolve(undefined);
		}

		// Stat needs to be resolved first and then revealed
		const options: IResolveFileOptions = { resolveTo: [resource], resolveMetadata: this.config.sortOrder === SortOrder.Modified };
		const root = this.findClosestRoot(resource);
		if (!root) {
			return undefined;
		}

		try {
			const stat = await this.fileService.resolve(root.resource, options);

			// Convert to model
			const modelStat = ExplorerItem.create(this.fileService, this.configurationService, this.filesConfigurationService, stat, undefined, options.resolveTo);
			// Update Input with disk Stat
			ExplorerItem.mergeLocalWithDisk(modelStat, root);
			const item = root.find(resource);
			await this.view.refresh(true, root);

			// Once item is resolved, check again if folder should be expanded
			if (item && !this.shouldAutoRevealItem(item, ignoreRevealExcludes)) {
				return;
			}
			await this.view.selectResource(item ? item.resource : undefined, reveal);
		} catch (error) {
			root.error = error;
			await this.view.refresh(false, root);
		}
	}

	async refresh(reveal = true): Promise<void> {
		// Do not refresh the tree when it is showing temporary nodes (phantom elements)
		if (this.view?.hasPhantomElements()) {
			return;
		}

		this.model.roots.forEach(r => r.forgetChildren());
		if (this.view) {
			await this.view.refresh(true);
			const resource = this.editorService.activeEditor?.resource;
			const autoReveal = this.configurationService.getValue<IFilesConfiguration>().explorer.autoReveal;

			if (reveal && resource && autoReveal) {
				// We did a top level refresh, reveal the active file #67118
				this.select(resource, autoReveal);
			}
		}
	}

	// File events

	private async onDidRunOperation(e: FileOperationEvent): Promise<void> {
		// When nesting, changes to one file in a folder may impact the rendered structure
		// of all the folder's immediate children, thus a recursive refresh is needed.
		// Ideally the tree would be able to recusively refresh just one level but that does not yet exist.
		const shouldDeepRefresh = this.config.fileNesting.enabled;

		// Add
		if (e.isOperation(FileOperation.CREATE) || e.isOperation(FileOperation.COPY)) {
			const addedElement = e.target;
			const parentResource = dirname(addedElement.resource);
			const parents = this.model.findAll(parentResource);

			if (parents.length) {

				// Add the new file to its parent (Model)
				await Promise.all(parents.map(async p => {
					// We have to check if the parent is resolved #29177
					const resolveMetadata = this.config.sortOrder === `modified`;
					if (!p.isDirectoryResolved) {
						const stat = await this.fileService.resolve(p.resource, { resolveMetadata });
						if (stat) {
							const modelStat = ExplorerItem.create(this.fileService, this.configurationService, this.filesConfigurationService, stat, p.parent);
							ExplorerItem.mergeLocalWithDisk(modelStat, p);
						}
					}

					const childElement = ExplorerItem.create(this.fileService, this.configurationService, this.filesConfigurationService, addedElement, p.parent);
					// Make sure to remove any previous version of the file if any
					p.removeChild(childElement);
					p.addChild(childElement);
					// Refresh the Parent (View)
					await this.view?.refresh(shouldDeepRefresh, p);
				}));
			}
		}

		// Move (including Rename)
		else if (e.isOperation(FileOperation.MOVE)) {
			const oldResource = e.resource;
			const newElement = e.target;
			const oldParentResource = dirname(oldResource);
			const newParentResource = dirname(newElement.resource);
			const modelElements = this.model.findAll(oldResource);
			const sameParentMove = modelElements.every(e => !e.nestedParent) && this.uriIdentityService.extUri.isEqual(oldParentResource, newParentResource);

			// Handle Rename
			if (sameParentMove) {
				await Promise.all(modelElements.map(async modelElement => {
					// Rename File (Model)
					modelElement.rename(newElement);
					await this.view?.refresh(shouldDeepRefresh, modelElement.parent);
				}));
			}

			// Handle Move
			else {
				const newParents = this.model.findAll(newParentResource);
				if (newParents.length && modelElements.length) {
					// Move in Model
					await Promise.all(modelElements.map(async (modelElement, index) => {
						const oldParent = modelElement.parent;
						const oldNestedParent = modelElement.nestedParent;
						modelElement.move(newParents[index]);
						if (oldNestedParent) {
							await this.view?.refresh(false, oldNestedParent);
						}
						await this.view?.refresh(false, oldParent);
						await this.view?.refresh(shouldDeepRefresh, newParents[index]);
					}));
				}
			}
		}

		// Delete
		else if (e.isOperation(FileOperation.DELETE)) {
			const modelElements = this.model.findAll(e.resource);
			await Promise.all(modelElements.map(async modelElement => {
				if (modelElement.parent) {
					// Remove Element from Parent (Model)
					const parent = modelElement.parent;
					parent.removeChild(modelElement);
					this.view?.focusNext();

					const oldNestedParent = modelElement.nestedParent;
					if (oldNestedParent) {
						oldNestedParent.removeChild(modelElement);
						await this.view?.refresh(false, oldNestedParent);
					}
					// Refresh Parent (View)
					await this.view?.refresh(shouldDeepRefresh, parent);

					if (this.view?.getFocus().length === 0) {
						this.view?.focusLast();
					}
				}
			}));
		}
	}

	// Check if an item matches a explorer.autoRevealExclude pattern
	private shouldAutoRevealItem(item: ExplorerItem | undefined, ignore: boolean): boolean {
		if (item === undefined || ignore) {
			return true;
		}
		if (this.revealExcludeMatcher.matches(item.resource, name => !!(item.parent?.getChild(name)))) {
			return false;
		}
		const root = item.root;
		let currentItem = item.parent;
		while (currentItem !== root) {
			if (currentItem === undefined) {
				return true;
			}
			if (this.revealExcludeMatcher.matches(currentItem.resource)) {
				return false;
			}
			currentItem = currentItem.parent;
		}
		return true;
	}

	private async onConfigurationUpdated(event: IConfigurationChangeEvent): Promise<void> {
		if (!event.affectsConfiguration('explorer')) {
			return;
		}

		let shouldRefresh = false;

		if (event.affectsConfiguration('explorer.fileNesting')) {
			shouldRefresh = true;
		}

		const configuration = this.configurationService.getValue<IFilesConfiguration>();

		const configSortOrder = configuration?.explorer?.sortOrder || SortOrder.Default;
		if (this.config.sortOrder !== configSortOrder) {
			shouldRefresh = this.config.sortOrder !== undefined;
		}

		const configLexicographicOptions = configuration?.explorer?.sortOrderLexicographicOptions || LexicographicOptions.Default;
		if (this.config.sortOrderLexicographicOptions !== configLexicographicOptions) {
			shouldRefresh = shouldRefresh || this.config.sortOrderLexicographicOptions !== undefined;
		}
		const sortOrderReverse = configuration?.explorer?.sortOrderReverse || false;

		if (this.config.sortOrderReverse !== sortOrderReverse) {
			shouldRefresh = shouldRefresh || this.config.sortOrderReverse !== undefined;
		}

		this.config = configuration.explorer;

		if (shouldRefresh) {
			await this.refresh();
		}
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

function doesFileEventAffect(item: ExplorerItem, view: IExplorerView, events: FileChangesEvent[], types: FileChangeType[]): boolean {
	for (const [_name, child] of item.children) {
		if (view.isItemVisible(child)) {
			if (events.some(e => e.contains(child.resource, ...types))) {
				return true;
			}
			if (child.isDirectory && child.isDirectoryResolved) {
				if (doesFileEventAffect(child, view, events, types)) {
					return true;
				}
			}
		}
	}

	return false;
}

function getRevealExcludes(configuration: IFilesConfiguration): IExpression {
	const revealExcludes = configuration?.explorer?.autoRevealExclude;

	if (!revealExcludes) {
		return {};
	}

	return revealExcludes;
}
```

--------------------------------------------------------------------------------

````
