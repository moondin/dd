---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 510
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 510 of 552)

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

---[FILE: src/vs/workbench/services/extensions/test/browser/extensionService.test.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/test/browser/extensionService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestDialogService } from '../../../../../platform/dialogs/test/common/testDialogService.js';
import { ExtensionKind, IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { ExtensionIdentifier, IExtension, IExtensionDescription } from '../../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TestInstantiationService, createServices } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { TestNotificationService } from '../../../../../platform/notification/test/common/testNotificationService.js';
import product from '../../../../../platform/product/common/product.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { RemoteAuthorityResolverService } from '../../../../../platform/remote/browser/remoteAuthorityResolverService.js';
import { IRemoteAuthorityResolverService, ResolverResult } from '../../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IRemoteExtensionsScannerService } from '../../../../../platform/remote/common/remoteExtensionsScanner.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { IUserDataProfilesService, UserDataProfilesService } from '../../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustEnablementService } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchEnvironmentService } from '../../../environment/common/environmentService.js';
import { IWebExtensionsScannerService, IWorkbenchExtensionEnablementService, IWorkbenchExtensionManagementService } from '../../../extensionManagement/common/extensionManagement.js';
import { BrowserExtensionHostKindPicker } from '../../browser/extensionService.js';
import { AbstractExtensionService, IExtensionHostFactory, ResolvedExtensions } from '../../common/abstractExtensionService.js';
import { ExtensionHostKind, ExtensionRunningPreference } from '../../common/extensionHostKind.js';
import { IExtensionHostManager } from '../../common/extensionHostManagers.js';
import { ExtensionManifestPropertiesService, IExtensionManifestPropertiesService } from '../../common/extensionManifestPropertiesService.js';
import { ExtensionRunningLocation } from '../../common/extensionRunningLocation.js';
import { ExtensionRunningLocationTracker } from '../../common/extensionRunningLocationTracker.js';
import { IExtensionHost, IExtensionService } from '../../common/extensions.js';
import { ExtensionsProposedApi } from '../../common/extensionsProposedApi.js';
import { ILifecycleService } from '../../../lifecycle/common/lifecycle.js';
import { IRemoteAgentService } from '../../../remote/common/remoteAgentService.js';
import { IUserDataProfileService } from '../../../userDataProfile/common/userDataProfile.js';
import { WorkspaceTrustEnablementService } from '../../../workspaces/common/workspaceTrust.js';
import { TestEnvironmentService, TestLifecycleService, TestRemoteAgentService, TestRemoteExtensionsScannerService, TestWebExtensionsScannerService, TestWorkbenchExtensionEnablementService, TestWorkbenchExtensionManagementService } from '../../../../test/browser/workbenchTestServices.js';
import { TestContextService, TestFileService, TestUserDataProfileService } from '../../../../test/common/workbenchTestServices.js';

suite('BrowserExtensionService', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('pickRunningLocation', () => {
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation([], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation([], false, true, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation([], true, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation([], true, true, ExtensionRunningPreference.None), null);

		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui'], true, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);

		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace'], true, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);

		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);


		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'workspace'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'workspace'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'workspace'], true, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'workspace'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'ui'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'ui'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'ui'], true, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'ui'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);

		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'workspace'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'workspace'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'workspace'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'workspace'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'web'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'web'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'web'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'web'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);

		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'web'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'web'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'web'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'web'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'ui'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'ui'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'ui'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'ui'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);


		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'web', 'workspace'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'web', 'workspace'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'web', 'workspace'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'web', 'workspace'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'workspace', 'web'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'workspace', 'web'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'workspace', 'web'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['ui', 'workspace', 'web'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);

		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'ui', 'workspace'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'ui', 'workspace'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'ui', 'workspace'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'ui', 'workspace'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'workspace', 'ui'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'workspace', 'ui'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'workspace', 'ui'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['web', 'workspace', 'ui'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);

		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'ui', 'web'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'ui', 'web'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'ui', 'web'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'ui', 'web'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'web', 'ui'], false, false, ExtensionRunningPreference.None), null);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'web', 'ui'], false, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'web', 'ui'], true, false, ExtensionRunningPreference.None), ExtensionHostKind.LocalWebWorker);
		assert.deepStrictEqual(BrowserExtensionHostKindPicker.pickRunningLocation(['workspace', 'web', 'ui'], true, true, ExtensionRunningPreference.None), ExtensionHostKind.Remote);
	});
});

suite('ExtensionService', () => {

	class MyTestExtensionService extends AbstractExtensionService {

		constructor(
			@IInstantiationService instantiationService: IInstantiationService,
			@INotificationService notificationService: INotificationService,
			@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
			@ITelemetryService telemetryService: ITelemetryService,
			@IWorkbenchExtensionEnablementService extensionEnablementService: IWorkbenchExtensionEnablementService,
			@IFileService fileService: IFileService,
			@IProductService productService: IProductService,
			@IWorkbenchExtensionManagementService extensionManagementService: IWorkbenchExtensionManagementService,
			@IWorkspaceContextService contextService: IWorkspaceContextService,
			@IConfigurationService configurationService: IConfigurationService,
			@IExtensionManifestPropertiesService extensionManifestPropertiesService: IExtensionManifestPropertiesService,
			@ILogService logService: ILogService,
			@IRemoteAgentService remoteAgentService: IRemoteAgentService,
			@IRemoteExtensionsScannerService remoteExtensionsScannerService: IRemoteExtensionsScannerService,
			@ILifecycleService lifecycleService: ILifecycleService,
			@IRemoteAuthorityResolverService remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		) {
			const extensionsProposedApi = instantiationService.createInstance(ExtensionsProposedApi);
			const extensionHostFactory = new class implements IExtensionHostFactory {
				createExtensionHost(runningLocations: ExtensionRunningLocationTracker, runningLocation: ExtensionRunningLocation, isInitialStart: boolean): IExtensionHost | null {
					return new class extends mock<IExtensionHost>() {
						override runningLocation = runningLocation;
					};
				}
			};
			super(
				{ allowRemoteExtensionsInLocalWebWorker: false, hasLocalProcess: true },
				extensionsProposedApi,
				extensionHostFactory,
				null!,
				instantiationService,
				notificationService,
				environmentService,
				telemetryService,
				extensionEnablementService,
				fileService,
				productService,
				extensionManagementService,
				contextService,
				configurationService,
				extensionManifestPropertiesService,
				logService,
				remoteAgentService,
				remoteExtensionsScannerService,
				lifecycleService,
				remoteAuthorityResolverService,
				new TestDialogService()
			);
		}

		private _extHostId = 0;
		public readonly order: string[] = [];
		protected _pickExtensionHostKind(extensionId: ExtensionIdentifier, extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference): ExtensionHostKind | null {
			throw new Error('Method not implemented.');
		}
		protected override _doCreateExtensionHostManager(extensionHost: IExtensionHost, initialActivationEvents: string[]): IExtensionHostManager {
			const order = this.order;
			const extensionHostId = ++this._extHostId;
			order.push(`create ${extensionHostId}`);
			return new class extends mock<IExtensionHostManager>() {
				override onDidExit = Event.None;
				override onDidChangeResponsiveState = Event.None;
				override disconnect() {
					return Promise.resolve();
				}
				override start(): Promise<void> {
					return Promise.resolve();
				}
				override dispose(): void {
					order.push(`dispose ${extensionHostId}`);
				}
				override representsRunningLocation(runningLocation: ExtensionRunningLocation): boolean {
					return extensionHost.runningLocation.equals(runningLocation);
				}
			};
		}
		protected _resolveExtensions(): AsyncIterable<ResolvedExtensions> {
			throw new Error('Method not implemented.');
		}
		protected _scanSingleExtension(extension: IExtension): Promise<IExtensionDescription | null> {
			throw new Error('Method not implemented.');
		}
		protected _onExtensionHostExit(code: number): Promise<void> {
			throw new Error('Method not implemented.');
		}
		protected _resolveAuthority(remoteAuthority: string): Promise<ResolverResult> {
			throw new Error('Method not implemented.');
		}
	}

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let extService: MyTestExtensionService;

	setup(() => {
		disposables = new DisposableStore();
		const testProductService = { _serviceBrand: undefined, ...product };
		disposables.add(instantiationService = createServices(disposables, [
			// custom
			[IExtensionService, MyTestExtensionService],
			// default
			[ILifecycleService, TestLifecycleService],
			[IWorkbenchExtensionManagementService, TestWorkbenchExtensionManagementService],
			[INotificationService, TestNotificationService],
			[IRemoteAgentService, TestRemoteAgentService],
			[ILogService, NullLogService],
			[IWebExtensionsScannerService, TestWebExtensionsScannerService],
			[IExtensionManifestPropertiesService, ExtensionManifestPropertiesService],
			[IConfigurationService, TestConfigurationService],
			[IWorkspaceContextService, TestContextService],
			[IProductService, testProductService],
			[IFileService, TestFileService],
			[IWorkbenchExtensionEnablementService, TestWorkbenchExtensionEnablementService],
			[ITelemetryService, NullTelemetryService],
			[IEnvironmentService, TestEnvironmentService],
			[IWorkspaceTrustEnablementService, WorkspaceTrustEnablementService],
			[IUserDataProfilesService, UserDataProfilesService],
			[IUserDataProfileService, TestUserDataProfileService],
			[IUriIdentityService, UriIdentityService],
			[IRemoteExtensionsScannerService, TestRemoteExtensionsScannerService],
			[IRemoteAuthorityResolverService, new RemoteAuthorityResolverService(false, undefined, undefined, undefined, testProductService, new NullLogService())]
		]));
		extService = <MyTestExtensionService>instantiationService.get(IExtensionService);
	});

	teardown(async () => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #152204: Remote extension host not disposed after closing vscode client', async () => {
		await extService.startExtensionHosts();
		await extService.stopExtensionHosts('foo');
		assert.deepStrictEqual(extService.order, (['create 1', 'create 2', 'create 3', 'dispose 3', 'dispose 2', 'dispose 1']));
	});

	test('Extension host disposed when awaited', async () => {
		await extService.startExtensionHosts();
		await extService.stopExtensionHosts('foo');
		assert.deepStrictEqual(extService.order, (['create 1', 'create 2', 'create 3', 'dispose 3', 'dispose 2', 'dispose 1']));
	});

	test('Extension host not disposed when vetoed (sync)', async () => {
		await extService.startExtensionHosts();

		disposables.add(extService.onWillStop(e => e.veto(true, 'test 1')));
		disposables.add(extService.onWillStop(e => e.veto(false, 'test 2')));

		await extService.stopExtensionHosts('foo');
		assert.deepStrictEqual(extService.order, (['create 1', 'create 2', 'create 3']));
	});

	test('Extension host not disposed when vetoed (async)', async () => {
		await extService.startExtensionHosts();

		disposables.add(extService.onWillStop(e => e.veto(false, 'test 1')));
		disposables.add(extService.onWillStop(e => e.veto(Promise.resolve(true), 'test 2')));
		disposables.add(extService.onWillStop(e => e.veto(Promise.resolve(false), 'test 3')));

		await extService.stopExtensionHosts('foo');
		assert.deepStrictEqual(extService.order, (['create 1', 'create 2', 'create 3']));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/test/browser/extensionStorageMigration.test.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/test/browser/extensionStorageMigration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IExtensionStorageService, ExtensionStorageService } from '../../../../../platform/extensionManagement/common/extensionStorage.js';
import { URI } from '../../../../../base/common/uri.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { TestWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { migrateExtensionStorage } from '../../common/extensionStorageMigration.js';
import { IStorageService, StorageScope } from '../../../../../platform/storage/common/storage.js';
import { IUserDataProfilesService, UserDataProfilesService } from '../../../../../platform/userDataProfile/common/userDataProfile.js';
import { UserDataProfileService } from '../../../userDataProfile/common/userDataProfileService.js';
import { IUserDataProfileService } from '../../../userDataProfile/common/userDataProfile.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('ExtensionStorageMigration', () => {

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();
	const ROOT = URI.file('tests').with({ scheme: 'vscode-tests' });
	const workspaceStorageHome = joinPath(ROOT, 'workspaceStorageHome');

	let instantiationService: TestInstantiationService;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);

		const fileService = disposables.add(new FileService(new NullLogService()));
		disposables.add(fileService.registerProvider(ROOT.scheme, disposables.add(new InMemoryFileSystemProvider())));
		instantiationService.stub(IFileService, fileService);
		const environmentService = instantiationService.stub(IEnvironmentService, { userRoamingDataHome: ROOT, workspaceStorageHome, cacheHome: ROOT });
		const userDataProfilesService = instantiationService.stub(IUserDataProfilesService, disposables.add(new UserDataProfilesService(environmentService, fileService, disposables.add(new UriIdentityService(fileService)), new NullLogService())));
		instantiationService.stub(IUserDataProfileService, disposables.add(new UserDataProfileService(userDataProfilesService.defaultProfile)));

		instantiationService.stub(IExtensionStorageService, disposables.add(instantiationService.createInstance(ExtensionStorageService)));
	});

	test('migrate extension storage', async () => {
		const fromExtensionId = 'pub.from', toExtensionId = 'pub.to', storageMigratedKey = `extensionStorage.migrate.${fromExtensionId}-${toExtensionId}`;
		const extensionStorageService = instantiationService.get(IExtensionStorageService), fileService = instantiationService.get(IFileService), storageService = instantiationService.get(IStorageService), userDataProfilesService = instantiationService.get(IUserDataProfilesService);

		extensionStorageService.setExtensionState(fromExtensionId, { globalKey: 'hello global state' }, true);
		extensionStorageService.setExtensionState(fromExtensionId, { workspaceKey: 'hello workspace state' }, false);
		await fileService.writeFile(joinPath(userDataProfilesService.defaultProfile.globalStorageHome, fromExtensionId), VSBuffer.fromString('hello global storage'));
		await fileService.writeFile(joinPath(workspaceStorageHome, TestWorkspace.id, fromExtensionId), VSBuffer.fromString('hello workspace storage'));

		await migrateExtensionStorage(fromExtensionId, toExtensionId, true, instantiationService);
		await migrateExtensionStorage(fromExtensionId, toExtensionId, false, instantiationService);

		assert.deepStrictEqual(extensionStorageService.getExtensionState(fromExtensionId, true), undefined);
		assert.deepStrictEqual(extensionStorageService.getExtensionState(fromExtensionId, false), undefined);
		assert.deepStrictEqual((await fileService.exists(joinPath(userDataProfilesService.defaultProfile.globalStorageHome, fromExtensionId))), false);
		assert.deepStrictEqual((await fileService.exists(joinPath(workspaceStorageHome, TestWorkspace.id, fromExtensionId))), false);

		assert.deepStrictEqual(extensionStorageService.getExtensionState(toExtensionId, true), { globalKey: 'hello global state' });
		assert.deepStrictEqual(extensionStorageService.getExtensionState(toExtensionId, false), { workspaceKey: 'hello workspace state' });
		assert.deepStrictEqual((await fileService.readFile(joinPath(userDataProfilesService.defaultProfile.globalStorageHome, toExtensionId))).value.toString(), 'hello global storage');
		assert.deepStrictEqual((await fileService.readFile(joinPath(workspaceStorageHome, TestWorkspace.id, toExtensionId))).value.toString(), 'hello workspace storage');

		assert.deepStrictEqual(storageService.get(storageMigratedKey, StorageScope.PROFILE), 'true');
		assert.deepStrictEqual(storageService.get(storageMigratedKey, StorageScope.WORKSPACE), 'true');

	});

	test('migrate extension storage when does not exist', async () => {
		const fromExtensionId = 'pub.from', toExtensionId = 'pub.to', storageMigratedKey = `extensionStorage.migrate.${fromExtensionId}-${toExtensionId}`;
		const extensionStorageService = instantiationService.get(IExtensionStorageService), fileService = instantiationService.get(IFileService), storageService = instantiationService.get(IStorageService), userDataProfilesService = instantiationService.get(IUserDataProfilesService);

		await migrateExtensionStorage(fromExtensionId, toExtensionId, true, instantiationService);
		await migrateExtensionStorage(fromExtensionId, toExtensionId, false, instantiationService);

		assert.deepStrictEqual(extensionStorageService.getExtensionState(fromExtensionId, true), undefined);
		assert.deepStrictEqual(extensionStorageService.getExtensionState(fromExtensionId, false), undefined);
		assert.deepStrictEqual((await fileService.exists(joinPath(userDataProfilesService.defaultProfile.globalStorageHome, fromExtensionId))), false);
		assert.deepStrictEqual((await fileService.exists(joinPath(workspaceStorageHome, TestWorkspace.id, fromExtensionId))), false);

		assert.deepStrictEqual(extensionStorageService.getExtensionState(toExtensionId, true), undefined);
		assert.deepStrictEqual(extensionStorageService.getExtensionState(toExtensionId, false), undefined);
		assert.deepStrictEqual((await fileService.exists(joinPath(userDataProfilesService.defaultProfile.globalStorageHome, toExtensionId))), false);
		assert.deepStrictEqual((await fileService.exists(joinPath(workspaceStorageHome, TestWorkspace.id, toExtensionId))), false);

		assert.deepStrictEqual(storageService.get(storageMigratedKey, StorageScope.PROFILE), 'true');
		assert.deepStrictEqual(storageService.get(storageMigratedKey, StorageScope.WORKSPACE), 'true');

	});


});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/test/common/extensionDescriptionRegistry.test.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/test/common/extensionDescriptionRegistry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ExtensionIdentifier, IExtensionDescription, TargetPlatform } from '../../../../../platform/extensions/common/extensions.js';
import { ExtensionDescriptionRegistry, IActivationEventsReader } from '../../common/extensionDescriptionRegistry.js';

suite('ExtensionDescriptionRegistry', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('allow removing and adding the same extension at a different version', () => {
		const idA = new ExtensionIdentifier('a');
		const extensionA1 = desc(idA, '1.0.0');
		const extensionA2 = desc(idA, '2.0.0');

		const basicActivationEventsReader: IActivationEventsReader = {
			readActivationEvents: (extensionDescription: IExtensionDescription): string[] => {
				return extensionDescription.activationEvents?.slice() ?? [];
			}
		};

		const registry = new ExtensionDescriptionRegistry(basicActivationEventsReader, [extensionA1]);
		registry.deltaExtensions([extensionA2], [idA]);

		assert.deepStrictEqual(registry.getAllExtensionDescriptions(), [extensionA2]);

		registry.dispose();
	});

	function desc(id: ExtensionIdentifier, version: string, activationEvents: string[] = ['*']): IExtensionDescription {
		return {
			name: id.value,
			publisher: 'test',
			version: '0.0.0',
			engines: { vscode: '^1.0.0' },
			identifier: id,
			extensionLocation: URI.parse(`nothing://nowhere`),
			isBuiltin: false,
			isUnderDevelopment: false,
			isUserBuiltin: false,
			activationEvents,
			main: 'index.js',
			targetPlatform: TargetPlatform.UNDEFINED,
			extensionDependencies: [],
			enabledApiProposals: undefined,
			preRelease: false,
		};
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/test/common/extensionManifestPropertiesService.test.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/test/common/extensionManifestPropertiesService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { isWeb } from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ExtensionUntrustedWorkspaceSupportType, IExtensionManifest } from '../../../../../platform/extensions/common/extensions.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IWorkspaceTrustEnablementService } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { ExtensionManifestPropertiesService } from '../../common/extensionManifestPropertiesService.js';
import { TestProductService, TestWorkspaceTrustEnablementService } from '../../../../test/common/workbenchTestServices.js';

suite('ExtensionManifestPropertiesService - ExtensionKind', () => {

	let disposables: DisposableStore;
	let testObject: ExtensionManifestPropertiesService;

	setup(() => {
		disposables = new DisposableStore();
		testObject = disposables.add(new ExtensionManifestPropertiesService(TestProductService, new TestConfigurationService(), new TestWorkspaceTrustEnablementService(), new NullLogService()));
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('declarative with extension dependencies', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ extensionDependencies: ['ext1'] }), isWeb ? ['workspace', 'web'] : ['workspace']);
	});

	test('declarative extension pack', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ extensionPack: ['ext1', 'ext2'] }), isWeb ? ['workspace', 'web'] : ['workspace']);
	});

	test('declarative extension pack and extension dependencies', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ extensionPack: ['ext1', 'ext2'], extensionDependencies: ['ext1', 'ext2'] }), isWeb ? ['workspace', 'web'] : ['workspace']);
	});

	test('declarative with unknown contribution point => workspace, web in web and => workspace in desktop', () => {
		// eslint-disable-next-line local/code-no-any-casts
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ contributes: <any>{ 'unknownPoint': { something: true } } }), isWeb ? ['workspace', 'web'] : ['workspace']);
	});

	test('declarative extension pack with unknown contribution point', () => {
		// eslint-disable-next-line local/code-no-any-casts
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ extensionPack: ['ext1', 'ext2'], contributes: <any>{ 'unknownPoint': { something: true } } }), isWeb ? ['workspace', 'web'] : ['workspace']);
	});

	test('simple declarative => ui, workspace, web', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{}), ['ui', 'workspace', 'web']);
	});

	test('only browser => web', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ browser: 'main.browser.js' }), ['web']);
	});

	test('only main => workspace', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ main: 'main.js' }), ['workspace']);
	});

	test('main and browser => workspace, web in web and workspace in desktop', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ main: 'main.js', browser: 'main.browser.js' }), isWeb ? ['workspace', 'web'] : ['workspace']);
	});

	test('browser entry point with workspace extensionKind => workspace, web in web and workspace in desktop', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ main: 'main.js', browser: 'main.browser.js', extensionKind: ['workspace'] }), isWeb ? ['workspace', 'web'] : ['workspace']);
	});

	test('only browser entry point with out extensionKind => web', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ browser: 'main.browser.js' }), ['web']);
	});

	test('simple descriptive with workspace, ui extensionKind => workspace, ui, web in web and workspace, ui in desktop', () => {
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ extensionKind: ['workspace', 'ui'] }), isWeb ? ['workspace', 'ui', 'web'] : ['workspace', 'ui']);
	});

	test('opt out from web through settings even if it can run in web', () => {
		testObject = disposables.add(new ExtensionManifestPropertiesService(TestProductService, new TestConfigurationService({ remote: { extensionKind: { 'pub.a': ['-web'] } } }), new TestWorkspaceTrustEnablementService(), new NullLogService()));
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ browser: 'main.browser.js', publisher: 'pub', name: 'a' }), ['ui', 'workspace']);
	});

	test('opt out from web and include only workspace through settings even if it can run in web', () => {
		testObject = disposables.add(new ExtensionManifestPropertiesService(TestProductService, new TestConfigurationService({ remote: { extensionKind: { 'pub.a': ['-web', 'workspace'] } } }), new TestWorkspaceTrustEnablementService(), new NullLogService()));
		assert.deepStrictEqual(testObject.getExtensionKind(<IExtensionManifest>{ browser: 'main.browser.js', publisher: 'pub', name: 'a' }), ['workspace']);
	});

	test('extension cannot opt out from web', () => {
		// eslint-disable-next-line local/code-no-any-casts
		assert.deepStrictEqual(testObject.getExtensionKind(<any>{ browser: 'main.browser.js', extensionKind: ['-web'] }), ['web']);
	});

	test('extension cannot opt into web', () => {
		// eslint-disable-next-line local/code-no-any-casts
		assert.deepStrictEqual(testObject.getExtensionKind(<any>{ main: 'main.js', extensionKind: ['web', 'workspace', 'ui'] }), ['workspace', 'ui']);
	});

	test('extension cannot opt into web only', () => {
		// eslint-disable-next-line local/code-no-any-casts
		assert.deepStrictEqual(testObject.getExtensionKind(<any>{ main: 'main.js', extensionKind: ['web'] }), ['workspace']);
	});
});


// Workspace Trust is disabled in web at the moment
if (!isWeb) {
	suite('ExtensionManifestPropertiesService - ExtensionUntrustedWorkspaceSupportType', () => {
		let testObject: ExtensionManifestPropertiesService;
		let instantiationService: TestInstantiationService;
		let testConfigurationService: TestConfigurationService;

		setup(async () => {
			instantiationService = new TestInstantiationService();

			testConfigurationService = new TestConfigurationService();
			instantiationService.stub(IConfigurationService, testConfigurationService);
		});

		teardown(() => {
			testObject.dispose();
			instantiationService.dispose();
		});

		function assertUntrustedWorkspaceSupport(extensionManifest: IExtensionManifest, expected: ExtensionUntrustedWorkspaceSupportType): void {
			testObject = instantiationService.createInstance(ExtensionManifestPropertiesService);
			const untrustedWorkspaceSupport = testObject.getExtensionUntrustedWorkspaceSupportType(extensionManifest);

			assert.strictEqual(untrustedWorkspaceSupport, expected);
		}

		function getExtensionManifest(properties: any = {}): IExtensionManifest {
			return Object.create({ name: 'a', publisher: 'pub', version: '1.0.0', ...properties }) as IExtensionManifest;
		}

		test('test extension workspace trust request when main entry point is missing', () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			const extensionManifest = getExtensionManifest();
			assertUntrustedWorkspaceSupport(extensionManifest, true);
		});

		test('test extension workspace trust request when workspace trust is disabled', async () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService(false));

			const extensionManifest = getExtensionManifest({ main: './out/extension.js' });
			assertUntrustedWorkspaceSupport(extensionManifest, true);
		});

		test('test extension workspace trust request when "true" override exists in settings.json', async () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			await testConfigurationService.setUserConfiguration('extensions', { supportUntrustedWorkspaces: { 'pub.a': { supported: true } } });
			const extensionManifest = getExtensionManifest({ main: './out/extension.js', capabilities: { untrustedWorkspaces: { supported: 'limited' } } });
			assertUntrustedWorkspaceSupport(extensionManifest, true);
		});

		test('test extension workspace trust request when override (false) exists in settings.json', async () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			await testConfigurationService.setUserConfiguration('extensions', { supportUntrustedWorkspaces: { 'pub.a': { supported: false } } });
			const extensionManifest = getExtensionManifest({ main: './out/extension.js', capabilities: { untrustedWorkspaces: { supported: 'limited' } } });
			assertUntrustedWorkspaceSupport(extensionManifest, false);
		});

		test('test extension workspace trust request when override (true) for the version exists in settings.json', async () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			await testConfigurationService.setUserConfiguration('extensions', { supportUntrustedWorkspaces: { 'pub.a': { supported: true, version: '1.0.0' } } });
			const extensionManifest = getExtensionManifest({ main: './out/extension.js', capabilities: { untrustedWorkspaces: { supported: 'limited' } } });
			assertUntrustedWorkspaceSupport(extensionManifest, true);
		});

		test('test extension workspace trust request when override (false) for the version exists in settings.json', async () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			await testConfigurationService.setUserConfiguration('extensions', { supportUntrustedWorkspaces: { 'pub.a': { supported: false, version: '1.0.0' } } });
			const extensionManifest = getExtensionManifest({ main: './out/extension.js', capabilities: { untrustedWorkspaces: { supported: 'limited' } } });
			assertUntrustedWorkspaceSupport(extensionManifest, false);
		});

		test('test extension workspace trust request when override for a different version exists in settings.json', async () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			await testConfigurationService.setUserConfiguration('extensions', { supportUntrustedWorkspaces: { 'pub.a': { supported: true, version: '2.0.0' } } });
			const extensionManifest = getExtensionManifest({ main: './out/extension.js', capabilities: { untrustedWorkspaces: { supported: 'limited' } } });
			assertUntrustedWorkspaceSupport(extensionManifest, 'limited');
		});

		test('test extension workspace trust request when default (true) exists in product.json', () => {
			instantiationService.stub(IProductService, { extensionUntrustedWorkspaceSupport: { 'pub.a': { default: true } } });
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			const extensionManifest = getExtensionManifest({ main: './out/extension.js' });
			assertUntrustedWorkspaceSupport(extensionManifest, true);
		});

		test('test extension workspace trust request when default (false) exists in product.json', () => {
			instantiationService.stub(IProductService, { extensionUntrustedWorkspaceSupport: { 'pub.a': { default: false } } });
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			const extensionManifest = getExtensionManifest({ main: './out/extension.js' });
			assertUntrustedWorkspaceSupport(extensionManifest, false);
		});

		test('test extension workspace trust request when override (limited) exists in product.json', () => {
			instantiationService.stub(IProductService, { extensionUntrustedWorkspaceSupport: { 'pub.a': { override: 'limited' } } });
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			const extensionManifest = getExtensionManifest({ main: './out/extension.js', capabilities: { untrustedWorkspaces: { supported: true } } });
			assertUntrustedWorkspaceSupport(extensionManifest, 'limited');
		});

		test('test extension workspace trust request when override (false) exists in product.json', () => {
			instantiationService.stub(IProductService, { extensionUntrustedWorkspaceSupport: { 'pub.a': { override: false } } });
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			const extensionManifest = getExtensionManifest({ main: './out/extension.js', capabilities: { untrustedWorkspaces: { supported: true } } });
			assertUntrustedWorkspaceSupport(extensionManifest, false);
		});

		test('test extension workspace trust request when value exists in package.json', () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			const extensionManifest = getExtensionManifest({ main: './out/extension.js', capabilities: { untrustedWorkspaces: { supported: 'limited' } } });
			assertUntrustedWorkspaceSupport(extensionManifest, 'limited');
		});

		test('test extension workspace trust request when no value exists in package.json', () => {
			instantiationService.stub(IProductService, {});
			instantiationService.stub(IWorkspaceTrustEnablementService, new TestWorkspaceTrustEnablementService());

			const extensionManifest = getExtensionManifest({ main: './out/extension.js' });
			assertUntrustedWorkspaceSupport(extensionManifest, false);
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/test/common/rpcProtocol.test.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/test/common/rpcProtocol.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IMessagePassingProtocol } from '../../../../../base/parts/ipc/common/ipc.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ProxyIdentifier, SerializableObjectWithBuffers } from '../../common/proxyIdentifier.js';
import { RPCProtocol } from '../../common/rpcProtocol.js';

suite('RPCProtocol', () => {

	let disposables: DisposableStore;

	class MessagePassingProtocol implements IMessagePassingProtocol {
		private _pair?: MessagePassingProtocol;

		private readonly _onMessage = new Emitter<VSBuffer>();
		public readonly onMessage: Event<VSBuffer> = this._onMessage.event;

		public setPair(other: MessagePassingProtocol) {
			this._pair = other;
		}

		public send(buffer: VSBuffer): void {
			Promise.resolve().then(() => {
				this._pair!._onMessage.fire(buffer);
			});
		}
	}

	let delegate: (a1: any, a2: any) => any;
	let bProxy: BClass;
	class BClass {
		$m(a1: any, a2: any): Promise<any> {
			return Promise.resolve(delegate.call(null, a1, a2));
		}
	}

	setup(() => {
		disposables = new DisposableStore();

		const a_protocol = new MessagePassingProtocol();
		const b_protocol = new MessagePassingProtocol();
		a_protocol.setPair(b_protocol);
		b_protocol.setPair(a_protocol);

		const A = disposables.add(new RPCProtocol(a_protocol));
		const B = disposables.add(new RPCProtocol(b_protocol));

		const bIdentifier = new ProxyIdentifier<BClass>('bb');
		const bInstance = new BClass();
		B.set(bIdentifier, bInstance);
		bProxy = A.getProxy(bIdentifier);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('simple call', function (done) {
		delegate = (a1: number, a2: number) => a1 + a2;
		bProxy.$m(4, 1).then((res: number) => {
			assert.strictEqual(res, 5);
			done(null);
		}, done);
	});

	test('simple call without result', function (done) {
		delegate = (a1: number, a2: number) => { };
		bProxy.$m(4, 1).then((res: number) => {
			assert.strictEqual(res, undefined);
			done(null);
		}, done);
	});

	test('passing buffer as argument', function (done) {
		delegate = (a1: VSBuffer, a2: number) => {
			assert.ok(a1 instanceof VSBuffer);
			return a1.buffer[a2];
		};
		const b = VSBuffer.alloc(4);
		b.buffer[0] = 1;
		b.buffer[1] = 2;
		b.buffer[2] = 3;
		b.buffer[3] = 4;
		bProxy.$m(b, 2).then((res: number) => {
			assert.strictEqual(res, 3);
			done(null);
		}, done);
	});

	test('returning a buffer', function (done) {
		delegate = (a1: number, a2: number) => {
			const b = VSBuffer.alloc(4);
			b.buffer[0] = 1;
			b.buffer[1] = 2;
			b.buffer[2] = 3;
			b.buffer[3] = 4;
			return b;
		};
		bProxy.$m(4, 1).then((res: VSBuffer) => {
			assert.ok(res instanceof VSBuffer);
			assert.strictEqual(res.buffer[0], 1);
			assert.strictEqual(res.buffer[1], 2);
			assert.strictEqual(res.buffer[2], 3);
			assert.strictEqual(res.buffer[3], 4);
			done(null);
		}, done);
	});

	test('cancelling a call via CancellationToken before', function (done) {
		delegate = (a1: number, a2: number) => a1 + a2;
		const p = bProxy.$m(4, CancellationToken.Cancelled);
		p.then((res: number) => {
			assert.fail('should not receive result');
		}, (err) => {
			assert.ok(true);
			done(null);
		});
	});

	test('passing CancellationToken.None', function (done) {
		delegate = (a1: number, token: CancellationToken) => {
			assert.ok(!!token);
			return a1 + 1;
		};
		bProxy.$m(4, CancellationToken.None).then((res: number) => {
			assert.strictEqual(res, 5);
			done(null);
		}, done);
	});

	test('cancelling a call via CancellationToken quickly', function (done) {
		// this is an implementation which, when cancellation is triggered, will return 7
		delegate = (a1: number, token: CancellationToken) => {
			return new Promise((resolve, reject) => {
				const disposable = token.onCancellationRequested((e) => {
					disposable.dispose();
					resolve(7);
				});
			});
		};
		const tokenSource = new CancellationTokenSource();
		const p = bProxy.$m(4, tokenSource.token);
		p.then((res: number) => {
			assert.strictEqual(res, 7);
		}, (err) => {
			assert.fail('should not receive error');
		}).finally(done);
		tokenSource.cancel();
	});

	test('throwing an error', function (done) {
		delegate = (a1: number, a2: number) => {
			throw new Error(`nope`);
		};
		bProxy.$m(4, 1).then((res) => {
			assert.fail('unexpected');
		}, (err) => {
			assert.strictEqual(err.message, 'nope');
		}).finally(done);
	});

	test('error promise', function (done) {
		delegate = (a1: number, a2: number) => {
			return Promise.reject(undefined);
		};
		bProxy.$m(4, 1).then((res) => {
			assert.fail('unexpected');
		}, (err) => {
			assert.strictEqual(err, undefined);
		}).finally(done);
	});

	test('issue #60450: Converting circular structure to JSON', function (done) {
		delegate = (a1: number, a2: number) => {
			// eslint-disable-next-line local/code-no-any-casts
			const circular = <any>{};
			circular.self = circular;
			return circular;
		};
		bProxy.$m(4, 1).then((res) => {
			assert.strictEqual(res, null);
		}, (err) => {
			assert.fail('unexpected');
		}).finally(done);
	});

	test('issue #72798: null errors are hard to digest', function (done) {
		delegate = (a1: number, a2: number) => {
			// eslint-disable-next-line no-throw-literal
			throw { 'what': 'what' };
		};
		bProxy.$m(4, 1).then((res) => {
			assert.fail('unexpected');
		}, (err) => {
			assert.strictEqual(err.what, 'what');
		}).finally(done);
	});

	test('undefined arguments arrive as null', function () {
		delegate = (a1: any, a2: any) => {
			assert.strictEqual(typeof a1, 'undefined');
			assert.strictEqual(a2, null);
			return 7;
		};
		return bProxy.$m(undefined, null).then((res) => {
			assert.strictEqual(res, 7);
		});
	});

	test('issue #81424: SerializeRequest should throw if an argument can not be serialized', () => {
		const badObject = {};
		// eslint-disable-next-line local/code-no-any-casts
		(<any>badObject).loop = badObject;

		assert.throws(() => {
			bProxy.$m(badObject, '2');
		});
	});

	test('SerializableObjectWithBuffers is correctly transfered', function (done) {
		delegate = (a1: SerializableObjectWithBuffers<{ string: string; buff: VSBuffer }>, a2: number) => {
			return new SerializableObjectWithBuffers({ string: a1.value.string + ' world', buff: a1.value.buff });
		};

		const b = VSBuffer.alloc(4);
		b.buffer[0] = 1;
		b.buffer[1] = 2;
		b.buffer[2] = 3;
		b.buffer[3] = 4;

		bProxy.$m(new SerializableObjectWithBuffers({ string: 'hello', buff: b }), undefined).then((res: SerializableObjectWithBuffers<any>) => {
			assert.ok(res instanceof SerializableObjectWithBuffers);
			assert.strictEqual(res.value.string, 'hello world');

			assert.ok(res.value.buff instanceof VSBuffer);

			const bufferValues = Array.from(res.value.buff.buffer);

			assert.strictEqual(bufferValues[0], 1);
			assert.strictEqual(bufferValues[1], 2);
			assert.strictEqual(bufferValues[2], 3);
			assert.strictEqual(bufferValues[3], 4);
			done(null);
		}, done);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/worker/polyfillNestedWorker.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/worker/polyfillNestedWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NewWorkerMessage, TerminateWorkerMessage } from '../common/polyfillNestedWorker.protocol.js';

declare function postMessage(data: any, transferables?: Transferable[]): void;

declare type MessageEventHandler = ((ev: MessageEvent<any>) => any) | null;

const _bootstrapFnSource = (function _bootstrapFn(workerUrl: string) {

	const listener: EventListener = (event: Event): void => {
		// uninstall handler
		globalThis.removeEventListener('message', listener);

		// get data
		const port = <MessagePort>(<MessageEvent>event).data;

		// postMessage
		// onmessage
		Object.defineProperties(globalThis, {
			'postMessage': {
				value(data: any, transferOrOptions?: any) {
					port.postMessage(data, transferOrOptions);
				}
			},
			'onmessage': {
				get() {
					return port.onmessage;
				},
				set(value: MessageEventHandler) {
					port.onmessage = value;
				}
			}
			// todo onerror
		});

		port.addEventListener('message', msg => {
			globalThis.dispatchEvent(new MessageEvent('message', { data: msg.data, ports: msg.ports ? [...msg.ports] : undefined }));
		});

		port.start();

		// fake recursively nested worker
		// eslint-disable-next-line local/code-no-any-casts
		globalThis.Worker = <any>class { constructor() { throw new TypeError('Nested workers from within nested worker are NOT supported.'); } };

		// load module
		importScripts(workerUrl);
	};

	globalThis.addEventListener('message', listener);
}).toString();


export class NestedWorker extends EventTarget implements Worker {

	onmessage: ((this: Worker, ev: MessageEvent<any>) => any) | null = null;
	onmessageerror: ((this: Worker, ev: MessageEvent<any>) => any) | null = null;
	onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null = null;

	readonly terminate: () => void;
	readonly postMessage: (message: any, options?: any) => void;

	constructor(nativePostMessage: typeof postMessage, stringOrUrl: string | URL, options?: WorkerOptions) {
		super();

		// create bootstrap script
		const bootstrap = `((${_bootstrapFnSource})('${stringOrUrl}'))`;
		const blob = new Blob([bootstrap], { type: 'application/javascript' });
		const blobUrl = URL.createObjectURL(blob);

		const channel = new MessageChannel();
		const id = blobUrl; // works because blob url is unique, needs ID pool otherwise

		const msg: NewWorkerMessage = {
			type: '_newWorker',
			id,
			port: channel.port2,
			url: blobUrl,
			options,
		};
		nativePostMessage(msg, [channel.port2]);

		// worker-impl: functions
		this.postMessage = channel.port1.postMessage.bind(channel.port1);
		this.terminate = () => {
			const msg: TerminateWorkerMessage = {
				type: '_terminateWorker',
				id
			};
			nativePostMessage(msg);
			URL.revokeObjectURL(blobUrl);

			channel.port1.close();
			channel.port2.close();
		};

		// worker-impl: events
		Object.defineProperties(this, {
			'onmessage': {
				get() {
					return channel.port1.onmessage;
				},
				set(value: MessageEventHandler) {
					channel.port1.onmessage = value;
				}
			},
			'onmessageerror': {
				get() {
					return channel.port1.onmessageerror;
				},
				set(value: MessageEventHandler) {
					channel.port1.onmessageerror = value;
				}
			},
			// todo onerror
		});

		channel.port1.addEventListener('messageerror', evt => {
			const msgEvent = new MessageEvent('messageerror', { data: evt.data });
			this.dispatchEvent(msgEvent);
		});

		channel.port1.addEventListener('message', evt => {
			const msgEvent = new MessageEvent('message', { data: evt.data });
			this.dispatchEvent(msgEvent);
		});

		channel.port1.start();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.html]---
Location: vscode-main/src/vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.html

```html
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Security-Policy" content="
			default-src 'none';
			child-src 'self' data: blob:;
			script-src 'self' 'unsafe-eval' 'sha256-cl8ijlOzEe+0GRCQNJQu2k6nUQ0fAYNYIuuKEm72JDs=' https: http://localhost:* blob:;
			connect-src 'self' https: wss: http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*;"/>
	</head>
	<body>
	<script>
(function () {
	const searchParams = new URL(document.location.href).searchParams;
	const vscodeWebWorkerExtHostId = searchParams.get('vscodeWebWorkerExtHostId') || '';
	// DO NOT CHANGE the name of the worker without also updating js-debug, as that
	// is used to filter targets to attach to (e.g. #232544)
	const name = searchParams.get('debugged') ? 'DebugExtensionHostWorker' : 'ExtensionHostWorker';
	const parentOrigin = searchParams.get('parentOrigin') || window.origin;
	const salt = searchParams.get('salt');

	(async function () {
		const hostnameValidationMarker = 'v--';
		const hostname = location.hostname;
		if (!hostname.startsWith(hostnameValidationMarker)) {
			// validation not requested
			return start();
		}
		if (!crypto.subtle) {
			// cannot validate, not running in a secure context
			return sendError(new Error(`Cannot validate in current context!`));
		}

		// Here the `parentOriginHash()` function from `src/vs/base/browser/iframe.ts` is inlined
		// compute a sha-256 composed of `parentOrigin` and `salt` converted to base 32
		/** @type {string} */
		let parentOriginHash;
		try {
			const strData = JSON.stringify({ parentOrigin, salt });
			const encoder = new TextEncoder();
			const arrData = encoder.encode(strData);
			const hash = await crypto.subtle.digest('sha-256', arrData);
			const hashArray = Array.from(new Uint8Array(hash));
			const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
			// sha256 has 256 bits, so we need at most ceil(lg(2^256-1)/lg(32)) = 52 chars to represent it in base 32
			parentOriginHash = BigInt(`0x${hashHex}`).toString(32).padStart(52, '0');
		} catch (err) {
			return sendError(err instanceof Error ? err : new Error(String(err)));
		}

		const requiredSubdomain = `${hostnameValidationMarker}${parentOriginHash}.`;
		if (hostname.substring(0, requiredSubdomain.length) === requiredSubdomain) {
			// validation succeeded!
			return start();
		}

		return sendError(new Error(`Expected '${requiredSubdomain}' as subdomain!`));
	})();

	function sendError(error) {
		window.parent.postMessage({
			vscodeWebWorkerExtHostId,
			error: {
				name: error ? error.name : '',
				message: error ? error.message : '',
				stack: error ? error.stack : []
			}
		}, '*');
	}

	function start() {

		// Before we can load the worker, we need to get the current set of NLS
		// configuration into this iframe. We ask the parent window to send it
		// together with the necessary information to load the worker via Blob.

		const bootstrapNlsType = 'vscode.bootstrap.nls';

		self.onmessage = (event) => {
			if (event.origin !== parentOrigin || event.data.type !== bootstrapNlsType) {
				return;
			}
			const { data } = event.data;
			createWorker(data.workerUrl, data.fileRoot, data.nls.messages, data.nls.language);
		};

		window.parent.postMessage({
			vscodeWebWorkerExtHostId,
			type: bootstrapNlsType
		}, '*');
	}

	function createWorker(workerUrl, fileRoot, nlsMessages, nlsLanguage) {
		try {
			if (globalThis.crossOriginIsolated) {
				workerUrl += '?vscode-coi=2'; // COEP
			}

			// In below blob code, we are using JSON.stringify to ensure the passed
			// in values are not breaking our script. The values may contain string
			// terminating characters (such as ' or ").

			const blob = new Blob([[
				`/*extensionHostWorker*/`,
				`globalThis._VSCODE_NLS_MESSAGES = ${JSON.stringify(nlsMessages)};`,
				`globalThis._VSCODE_NLS_LANGUAGE = ${JSON.stringify(nlsLanguage)};`,
				`globalThis._VSCODE_FILE_ROOT = ${JSON.stringify(fileRoot)};`,
				`await import(${JSON.stringify(workerUrl)});`,
				`/*extensionHostWorker*/`
			].join('')], { type: 'application/javascript' });

			const worker = new Worker(URL.createObjectURL(blob), { name, type: 'module' });
			const nestedWorkers = new Map();

			worker.onmessage = (event) => {
				const { data } = event;

				if (data?.type === '_newWorker') {
					const { id, port, url, options } = data;
					const newWorker = new Worker(url, options);
					newWorker.postMessage(port, [port]);
					newWorker.onerror = console.error.bind(console);
					nestedWorkers.set(id, newWorker);

				} else if (data?.type === '_terminateWorker') {
					const { id } = data;
					if (nestedWorkers.has(id)) {
						nestedWorkers.get(id).terminate();
						nestedWorkers.delete(id);
					}
				} else {
					worker.onerror = console.error.bind(console);
					window.parent.postMessage({
						vscodeWebWorkerExtHostId,
						data
					}, parentOrigin, [data]);
				}
			};

			worker.onerror = (event) => {
				console.error(event.message, event.error);
				sendError(event.error);
			};

			self.onmessage = (event) => {
				if (event.origin !== parentOrigin) {
					return;
				}
				worker.postMessage(event.data, event.ports);
			};
		} catch (err) {
			console.error(err);
			sendError(err);
		}
	}
})();
	</script>
	</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/files/browser/elevatedFileService.ts]---
Location: vscode-main/src/vs/workbench/services/files/browser/elevatedFileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileStatWithMetadata, IWriteFileOptions } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IElevatedFileService } from '../common/elevatedFileService.js';

export class BrowserElevatedFileService implements IElevatedFileService {

	readonly _serviceBrand: undefined;

	isSupported(resource: URI): boolean {
		// Saving elevated is currently not supported in web for as
		// long as we have no generic support from the file service
		// (https://github.com/microsoft/vscode/issues/48659)
		return false;
	}

	async writeFileElevated(resource: URI, value: VSBuffer | VSBufferReadable | VSBufferReadableStream, options?: IWriteFileOptions): Promise<IFileStatWithMetadata> {
		throw new Error('Unsupported');
	}
}

registerSingleton(IElevatedFileService, BrowserElevatedFileService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/files/common/elevatedFileService.ts]---
Location: vscode-main/src/vs/workbench/services/files/common/elevatedFileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { IFileStatWithMetadata, IWriteFileOptions } from '../../../../platform/files/common/files.js';

export const IElevatedFileService = createDecorator<IElevatedFileService>('elevatedFileService');

export interface IElevatedFileService {

	readonly _serviceBrand: undefined;

	/**
	 * Whether saving elevated is supported for the provided resource.
	 */
	isSupported(resource: URI): boolean;

	/**
	 * Attempts to write to the target resource elevated. This may bring
	 * up a dialog to ask for admin username / password.
	 */
	writeFileElevated(resource: URI, value: VSBuffer | VSBufferReadable | VSBufferReadableStream, options?: IWriteFileOptions): Promise<IFileStatWithMetadata>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/files/electron-browser/diskFileSystemProvider.ts]---
Location: vscode-main/src/vs/workbench/services/files/electron-browser/diskFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Event } from '../../../../base/common/event.js';
import { isLinux } from '../../../../base/common/platform.js';
import { FileSystemProviderCapabilities, IFileDeleteOptions, IStat, FileType, IFileReadStreamOptions, IFileWriteOptions, IFileOpenOptions, IFileOverwriteOptions, IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, IFileSystemProviderWithFileReadStreamCapability, IFileSystemProviderWithFileFolderCopyCapability, IFileSystemProviderWithFileAtomicReadCapability, IFileAtomicReadOptions, IFileSystemProviderWithFileCloneCapability, IFileChange } from '../../../../platform/files/common/files.js';
import { AbstractDiskFileSystemProvider } from '../../../../platform/files/common/diskFileSystemProvider.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ReadableStreamEvents } from '../../../../base/common/stream.js';
import { URI } from '../../../../base/common/uri.js';
import { DiskFileSystemProviderClient, LOCAL_FILE_SYSTEM_CHANNEL_NAME } from '../../../../platform/files/common/diskFileSystemProviderClient.js';
import { ILogMessage, AbstractUniversalWatcherClient } from '../../../../platform/files/common/watcher.js';
import { UniversalWatcherClient } from './watcherClient.js';
import { ILoggerService, ILogService } from '../../../../platform/log/common/log.js';
import { IUtilityProcessWorkerWorkbenchService } from '../../utilityProcess/electron-browser/utilityProcessWorkerWorkbenchService.js';
import { LogService } from '../../../../platform/log/common/logService.js';

/**
 * A sandbox ready disk file system provider that delegates almost all calls
 * to the main process via `DiskFileSystemProviderServer` except for recursive
 * file watching that is done via shared process workers due to CPU intensity.
 */
export class DiskFileSystemProvider extends AbstractDiskFileSystemProvider implements
	IFileSystemProviderWithFileReadWriteCapability,
	IFileSystemProviderWithOpenReadWriteCloseCapability,
	IFileSystemProviderWithFileReadStreamCapability,
	IFileSystemProviderWithFileFolderCopyCapability,
	IFileSystemProviderWithFileAtomicReadCapability,
	IFileSystemProviderWithFileCloneCapability {

	private readonly provider: DiskFileSystemProviderClient;

	constructor(
		mainProcessService: IMainProcessService,
		private readonly utilityProcessWorkerWorkbenchService: IUtilityProcessWorkerWorkbenchService,
		logService: ILogService,
		private readonly loggerService: ILoggerService
	) {
		super(logService, { watcher: { forceUniversal: true /* send all requests to universal watcher process */ } });

		this.provider = this._register(new DiskFileSystemProviderClient(mainProcessService.getChannel(LOCAL_FILE_SYSTEM_CHANNEL_NAME), { pathCaseSensitive: isLinux, trash: true }));

		this.registerListeners();
	}

	private registerListeners(): void {

		// Forward events from the embedded provider
		this._register(this.provider.onDidChangeFile(changes => this._onDidChangeFile.fire(changes)));
		this._register(this.provider.onDidWatchError(error => this._onDidWatchError.fire(error)));
	}

	//#region File Capabilities

	get onDidChangeCapabilities(): Event<void> { return this.provider.onDidChangeCapabilities; }

	get capabilities(): FileSystemProviderCapabilities { return this.provider.capabilities; }

	//#endregion

	//#region File Metadata Resolving

	stat(resource: URI): Promise<IStat> {
		return this.provider.stat(resource);
	}

	realpath(resource: URI): Promise<string> {
		return this.provider.realpath(resource);
	}

	readdir(resource: URI): Promise<[string, FileType][]> {
		return this.provider.readdir(resource);
	}

	//#endregion

	//#region File Reading/Writing

	readFile(resource: URI, opts?: IFileAtomicReadOptions): Promise<Uint8Array> {
		return this.provider.readFile(resource, opts);
	}

	readFileStream(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> {
		return this.provider.readFileStream(resource, opts, token);
	}

	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		return this.provider.writeFile(resource, content, opts);
	}

	open(resource: URI, opts: IFileOpenOptions): Promise<number> {
		return this.provider.open(resource, opts);
	}

	close(fd: number): Promise<void> {
		return this.provider.close(fd);
	}

	read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		return this.provider.read(fd, pos, data, offset, length);
	}

	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		return this.provider.write(fd, pos, data, offset, length);
	}

	//#endregion

	//#region Move/Copy/Delete/Create Folder

	mkdir(resource: URI): Promise<void> {
		return this.provider.mkdir(resource);
	}

	delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		return this.provider.delete(resource, opts);
	}

	rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		return this.provider.rename(from, to, opts);
	}

	copy(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> {
		return this.provider.copy(from, to, opts);
	}

	//#endregion

	//#region Clone File

	cloneFile(from: URI, to: URI): Promise<void> {
		return this.provider.cloneFile(from, to);
	}

	//#endregion

	//#region File Watching

	protected createUniversalWatcher(
		onChange: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean
	): AbstractUniversalWatcherClient {
		return new UniversalWatcherClient(changes => onChange(changes), msg => onLogMessage(msg), verboseLogging, this.utilityProcessWorkerWorkbenchService);
	}

	protected createNonRecursiveWatcher(): never {
		throw new Error('Method not implemented in sandbox.'); // we never expect this to be called given we set `forceUniversal: true`
	}

	private _watcherLogService: ILogService | undefined = undefined;
	private get watcherLogService(): ILogService {
		if (!this._watcherLogService) {
			this._watcherLogService = new LogService(this.loggerService.createLogger('fileWatcher', { name: localize('fileWatcher', "File Watcher") }));
		}

		return this._watcherLogService;
	}

	protected override logWatcherMessage(msg: ILogMessage): void {
		this.watcherLogService[msg.type](msg.message);

		if (msg.type !== 'trace' && msg.type !== 'debug') {
			super.logWatcherMessage(msg); // allow non-verbose log messages in window log
		}
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/files/electron-browser/elevatedFileService.ts]---
Location: vscode-main/src/vs/workbench/services/files/electron-browser/elevatedFileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { randomPath } from '../../../../base/common/extpath.js';
import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileService, IFileStatWithMetadata, IWriteFileOptions } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IWorkspaceTrustRequestService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IElevatedFileService } from '../common/elevatedFileService.js';
import { isWindows } from '../../../../base/common/platform.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
export class NativeElevatedFileService implements IElevatedFileService {

	readonly _serviceBrand: undefined;

	constructor(
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@IFileService private readonly fileService: IFileService,
		@INativeWorkbenchEnvironmentService private readonly environmentService: INativeWorkbenchEnvironmentService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@ILabelService private readonly labelService: ILabelService
	) { }

	isSupported(resource: URI): boolean {
		// Saving elevated is currently only supported for local
		// files for as long as we have no generic support from
		// the file service
		// (https://github.com/microsoft/vscode/issues/48659)
		return resource.scheme === Schemas.file;
	}

	async writeFileElevated(resource: URI, value: VSBuffer | VSBufferReadable | VSBufferReadableStream, options?: IWriteFileOptions): Promise<IFileStatWithMetadata> {
		const trusted = await this.workspaceTrustRequestService.requestWorkspaceTrust({
			message: isWindows ? localize('fileNotTrustedMessageWindows', "You are about to save '{0}' as admin.", this.labelService.getUriLabel(resource)) : localize('fileNotTrustedMessagePosix', "You are about to save '{0}' as super user.", this.labelService.getUriLabel(resource)),
		});
		if (!trusted) {
			throw new Error(localize('fileNotTrusted', "Workspace is not trusted."));
		}

		const source = URI.file(randomPath(this.environmentService.userDataPath, 'code-elevated'));
		try {
			// write into a tmp file first
			await this.fileService.writeFile(source, value, options);

			// then sudo prompt copy
			await this.nativeHostService.writeElevated(source, resource, options);
		} finally {

			// clean up
			await this.fileService.del(source);
		}

		return this.fileService.resolve(resource, { resolveMetadata: true });
	}
}

registerSingleton(IElevatedFileService, NativeElevatedFileService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/files/electron-browser/watcherClient.ts]---
Location: vscode-main/src/vs/workbench/services/files/electron-browser/watcherClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { getDelayedChannel, ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IFileChange } from '../../../../platform/files/common/files.js';
import { AbstractUniversalWatcherClient, ILogMessage, IRecursiveWatcher } from '../../../../platform/files/common/watcher.js';
import { IUtilityProcessWorkerWorkbenchService } from '../../utilityProcess/electron-browser/utilityProcessWorkerWorkbenchService.js';

export class UniversalWatcherClient extends AbstractUniversalWatcherClient {

	constructor(
		onFileChanges: (changes: IFileChange[]) => void,
		onLogMessage: (msg: ILogMessage) => void,
		verboseLogging: boolean,
		private readonly utilityProcessWorkerWorkbenchService: IUtilityProcessWorkerWorkbenchService
	) {
		super(onFileChanges, onLogMessage, verboseLogging);

		this.init();
	}

	protected override createWatcher(disposables: DisposableStore): IRecursiveWatcher {
		const watcher = ProxyChannel.toService<IRecursiveWatcher>(getDelayedChannel((async () => {

			// Acquire universal watcher via utility process worker
			//
			// We explicitly do not add the worker as a disposable
			// because we need to call `stop` on disposal to prevent
			// a crash on shutdown (see below).
			//
			// The utility process worker services ensures to terminate
			// the process automatically when the window closes or reloads.
			const { client, onDidTerminate } = disposables.add(await this.utilityProcessWorkerWorkbenchService.createWorker({
				moduleId: 'vs/platform/files/node/watcher/watcherMain',
				type: 'fileWatcher',
				name: 'file-watcher'
			}));

			// React on unexpected termination of the watcher process
			// by listening to the `onDidTerminate` event. We do not
			// consider an exit code of `0` as abnormal termination.

			onDidTerminate.then(({ reason }) => {
				if (reason?.code === 0) {
					this.trace(`terminated by itself with code ${reason.code}, signal: ${reason.signal}`);
				} else {
					this.onError(`terminated by itself unexpectedly with code ${reason?.code}, signal: ${reason?.signal} (ETERM)`);
				}
			});

			return client.getChannel('watcher');
		})()));

		return watcher;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/filesConfiguration/common/filesConfigurationService.ts]---
Location: vscode-main/src/vs/workbench/services/filesConfiguration/common/filesConfigurationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { RawContextKey, IContextKeyService, IContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFilesConfiguration, AutoSaveConfiguration, HotExitConfiguration, FILES_READONLY_INCLUDE_CONFIG, FILES_READONLY_EXCLUDE_CONFIG, IFileStatWithMetadata, IFileService, IBaseFileStat, hasReadonlyCapability, IFilesConfigurationNode } from '../../../../platform/files/common/files.js';
import { equals } from '../../../../base/common/objects.js';
import { URI } from '../../../../base/common/uri.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ResourceGlobMatcher } from '../../../common/resources.js';
import { GlobalIdleValue } from '../../../../base/common/async.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { LRUCache, ResourceMap } from '../../../../base/common/map.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorResourceAccessor, SaveReason, SideBySideEditor } from '../../../common/editor.js';
import { IMarkerService, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IStringDictionary } from '../../../../base/common/collections.js';

export const AutoSaveAfterShortDelayContext = new RawContextKey<boolean>('autoSaveAfterShortDelayContext', false, true);

export interface IAutoSaveConfiguration {
	autoSave?: 'afterDelay' | 'onFocusChange' | 'onWindowChange';
	autoSaveDelay?: number;
	autoSaveWorkspaceFilesOnly?: boolean;
	autoSaveWhenNoErrors?: boolean;
}

interface ICachedAutoSaveConfiguration extends IAutoSaveConfiguration {

	// Some extra state that we cache to reduce the amount
	// of lookup we have to do since auto save methods
	// are being called very often, e.g. when content changes

	isOutOfWorkspace?: boolean;
	isShortAutoSaveDelay?: boolean;
}

export const enum AutoSaveMode {
	OFF,
	AFTER_SHORT_DELAY,
	AFTER_LONG_DELAY,
	ON_FOCUS_CHANGE,
	ON_WINDOW_CHANGE
}

export const enum AutoSaveDisabledReason {
	SETTINGS = 1,
	OUT_OF_WORKSPACE,
	ERRORS,
	DISABLED
}

export type IAutoSaveMode = IEnabledAutoSaveMode | IDisabledAutoSaveMode;

export interface IEnabledAutoSaveMode {
	readonly mode: AutoSaveMode.AFTER_SHORT_DELAY | AutoSaveMode.AFTER_LONG_DELAY | AutoSaveMode.ON_FOCUS_CHANGE | AutoSaveMode.ON_WINDOW_CHANGE;
}

export interface IDisabledAutoSaveMode {
	readonly mode: AutoSaveMode.OFF;
	readonly reason: AutoSaveDisabledReason;
}

export const IFilesConfigurationService = createDecorator<IFilesConfigurationService>('filesConfigurationService');

export interface IFilesConfigurationService {

	readonly _serviceBrand: undefined;

	//#region Auto Save

	readonly onDidChangeAutoSaveConfiguration: Event<void>;

	readonly onDidChangeAutoSaveDisabled: Event<URI>;

	getAutoSaveConfiguration(resourceOrEditor: EditorInput | URI | undefined): IAutoSaveConfiguration;

	hasShortAutoSaveDelay(resourceOrEditor: EditorInput | URI | undefined): boolean;

	getAutoSaveMode(resourceOrEditor: EditorInput | URI | undefined, saveReason?: SaveReason): IAutoSaveMode;

	toggleAutoSave(): Promise<void>;

	enableAutoSaveAfterShortDelay(resourceOrEditor: EditorInput | URI): IDisposable;
	disableAutoSave(resourceOrEditor: EditorInput | URI): IDisposable;

	//#endregion

	//#region Configured Readonly

	readonly onDidChangeReadonly: Event<void>;

	isReadonly(resource: URI, stat?: IBaseFileStat): boolean | IMarkdownString;

	updateReadonly(resource: URI, readonly: true | false | 'toggle' | 'reset'): Promise<void>;

	//#endregion

	readonly onDidChangeFilesAssociation: Event<void>;

	readonly isHotExitEnabled: boolean;

	readonly hotExitConfiguration: string | undefined;

	preventSaveConflicts(resource: URI, language?: string): boolean;
}

export class FilesConfigurationService extends Disposable implements IFilesConfigurationService {

	declare readonly _serviceBrand: undefined;

	private static readonly DEFAULT_AUTO_SAVE_MODE = isWeb ? AutoSaveConfiguration.AFTER_DELAY : AutoSaveConfiguration.OFF;
	private static readonly DEFAULT_AUTO_SAVE_DELAY = 1000;

	private static readonly READONLY_MESSAGES = {
		providerReadonly: { value: localize('providerReadonly', "Editor is read-only because the file system of the file is read-only."), isTrusted: true },
		sessionReadonly: { value: localize({ key: 'sessionReadonly', comment: ['Please do not translate the word "command", it is part of our internal syntax which must not change', '{Locked="](command:{0})"}'] }, "Editor is read-only because the file was set read-only in this session. [Click here](command:{0}) to set writeable.", 'workbench.action.files.setActiveEditorWriteableInSession'), isTrusted: true },
		configuredReadonly: { value: localize({ key: 'configuredReadonly', comment: ['Please do not translate the word "command", it is part of our internal syntax which must not change', '{Locked="](command:{0})"}'] }, "Editor is read-only because the file was set read-only via settings. [Click here](command:{0}) to configure or [toggle for this session](command:{1}).", `workbench.action.openSettings?${encodeURIComponent('["files.readonly"]')}`, 'workbench.action.files.toggleActiveEditorReadonlyInSession'), isTrusted: true },
		fileLocked: { value: localize({ key: 'fileLocked', comment: ['Please do not translate the word "command", it is part of our internal syntax which must not change', '{Locked="](command:{0})"}'] }, "Editor is read-only because of file permissions. [Click here](command:{0}) to set writeable anyway.", 'workbench.action.files.setActiveEditorWriteableInSession'), isTrusted: true },
		fileReadonly: { value: localize('fileReadonly', "Editor is read-only because the file is read-only."), isTrusted: true }
	};

	private readonly _onDidChangeAutoSaveConfiguration = this._register(new Emitter<void>());
	readonly onDidChangeAutoSaveConfiguration = this._onDidChangeAutoSaveConfiguration.event;

	private readonly _onDidChangeAutoSaveDisabled = this._register(new Emitter<URI>());
	readonly onDidChangeAutoSaveDisabled = this._onDidChangeAutoSaveDisabled.event;

	private readonly _onDidChangeFilesAssociation = this._register(new Emitter<void>());
	readonly onDidChangeFilesAssociation = this._onDidChangeFilesAssociation.event;

	private readonly _onDidChangeReadonly = this._register(new Emitter<void>());
	readonly onDidChangeReadonly = this._onDidChangeReadonly.event;

	private currentGlobalAutoSaveConfiguration: IAutoSaveConfiguration;
	private currentFilesAssociationConfiguration: IStringDictionary<string> | undefined;
	private currentHotExitConfiguration: string;

	private readonly autoSaveConfigurationCache = new LRUCache<URI, ICachedAutoSaveConfiguration>(1000);

	private readonly autoSaveAfterShortDelayOverrides = new ResourceMap<number /* counter */>();
	private readonly autoSaveDisabledOverrides = new ResourceMap<number /* counter */>();

	private readonly autoSaveAfterShortDelayContext: IContextKey<boolean>;

	private readonly readonlyIncludeMatcher = this._register(new GlobalIdleValue(() => this.createReadonlyMatcher(FILES_READONLY_INCLUDE_CONFIG)));
	private readonly readonlyExcludeMatcher = this._register(new GlobalIdleValue(() => this.createReadonlyMatcher(FILES_READONLY_EXCLUDE_CONFIG)));
	private configuredReadonlyFromPermissions: boolean | undefined;

	private readonly sessionReadonlyOverrides = new ResourceMap<boolean>(resource => this.uriIdentityService.extUri.getComparisonKey(resource));

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IFileService private readonly fileService: IFileService,
		@IMarkerService private readonly markerService: IMarkerService,
		@ITextResourceConfigurationService private readonly textResourceConfigurationService: ITextResourceConfigurationService
	) {
		super();

		this.autoSaveAfterShortDelayContext = AutoSaveAfterShortDelayContext.bindTo(contextKeyService);

		const configuration = configurationService.getValue<IFilesConfiguration>();

		this.currentGlobalAutoSaveConfiguration = this.computeAutoSaveConfiguration(undefined, configuration.files);
		this.currentFilesAssociationConfiguration = configuration?.files?.associations;
		this.currentHotExitConfiguration = configuration?.files?.hotExit || HotExitConfiguration.ON_EXIT;

		this.onFilesConfigurationChange(configuration, false);

		this.registerListeners();
	}

	private createReadonlyMatcher(config: string) {
		const matcher = this._register(new ResourceGlobMatcher(
			resource => this.configurationService.getValue(config, { resource }),
			event => event.affectsConfiguration(config),
			this.contextService,
			this.configurationService
		));

		this._register(matcher.onExpressionChange(() => this._onDidChangeReadonly.fire()));

		return matcher;
	}

	isReadonly(resource: URI, stat?: IBaseFileStat): boolean | IMarkdownString {

		// if the entire file system provider is readonly, we respect that
		// and do not allow to change readonly. we take this as a hint that
		// the provider has no capabilities of writing.
		const provider = this.fileService.getProvider(resource.scheme);
		if (provider && hasReadonlyCapability(provider)) {
			return provider.readOnlyMessage ?? FilesConfigurationService.READONLY_MESSAGES.providerReadonly;
		}

		// session override always wins over the others
		const sessionReadonlyOverride = this.sessionReadonlyOverrides.get(resource);
		if (typeof sessionReadonlyOverride === 'boolean') {
			return sessionReadonlyOverride === true ? FilesConfigurationService.READONLY_MESSAGES.sessionReadonly : false;
		}

		if (
			this.uriIdentityService.extUri.isEqualOrParent(resource, this.environmentService.userRoamingDataHome) ||
			this.uriIdentityService.extUri.isEqual(resource, this.contextService.getWorkspace().configuration ?? undefined)
		) {
			return false; // explicitly exclude some paths from readonly that we need for configuration
		}

		// configured glob patterns win over stat information
		if (this.readonlyIncludeMatcher.value.matches(resource)) {
			return !this.readonlyExcludeMatcher.value.matches(resource) ? FilesConfigurationService.READONLY_MESSAGES.configuredReadonly : false;
		}

		// check if file is locked and configured to treat as readonly
		if (this.configuredReadonlyFromPermissions && stat?.locked) {
			return FilesConfigurationService.READONLY_MESSAGES.fileLocked;
		}

		// check if file is marked readonly from the file system provider
		if (stat?.readonly) {
			return FilesConfigurationService.READONLY_MESSAGES.fileReadonly;
		}

		return false;
	}

	async updateReadonly(resource: URI, readonly: true | false | 'toggle' | 'reset'): Promise<void> {
		if (readonly === 'toggle') {
			let stat: IFileStatWithMetadata | undefined = undefined;
			try {
				stat = await this.fileService.resolve(resource, { resolveMetadata: true });
			} catch (error) {
				// ignore
			}

			readonly = !this.isReadonly(resource, stat);
		}

		if (readonly === 'reset') {
			this.sessionReadonlyOverrides.delete(resource);
		} else {
			this.sessionReadonlyOverrides.set(resource, readonly);
		}

		this._onDidChangeReadonly.fire();
	}

	private registerListeners(): void {

		// Files configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('files')) {
				this.onFilesConfigurationChange(this.configurationService.getValue<IFilesConfiguration>(), true);
			}
		}));
	}

	protected onFilesConfigurationChange(configuration: IFilesConfiguration, fromEvent: boolean): void {

		// Auto Save
		this.currentGlobalAutoSaveConfiguration = this.computeAutoSaveConfiguration(undefined, configuration.files);
		this.autoSaveConfigurationCache.clear();
		this.autoSaveAfterShortDelayContext.set(this.getAutoSaveMode(undefined).mode === AutoSaveMode.AFTER_SHORT_DELAY);
		if (fromEvent) {
			this._onDidChangeAutoSaveConfiguration.fire();
		}

		// Check for change in files associations
		const filesAssociation = configuration?.files?.associations;
		if (!equals(this.currentFilesAssociationConfiguration, filesAssociation)) {
			this.currentFilesAssociationConfiguration = filesAssociation;
			if (fromEvent) {
				this._onDidChangeFilesAssociation.fire();
			}
		}

		// Hot exit
		const hotExitMode = configuration?.files?.hotExit;
		if (hotExitMode === HotExitConfiguration.OFF || hotExitMode === HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
			this.currentHotExitConfiguration = hotExitMode;
		} else {
			this.currentHotExitConfiguration = HotExitConfiguration.ON_EXIT;
		}

		// Readonly
		const readonlyFromPermissions = Boolean(configuration?.files?.readonlyFromPermissions);
		if (readonlyFromPermissions !== Boolean(this.configuredReadonlyFromPermissions)) {
			this.configuredReadonlyFromPermissions = readonlyFromPermissions;
			if (fromEvent) {
				this._onDidChangeReadonly.fire();
			}
		}
	}

	getAutoSaveConfiguration(resourceOrEditor: EditorInput | URI | undefined): ICachedAutoSaveConfiguration {
		const resource = this.toResource(resourceOrEditor);
		if (resource) {
			let resourceAutoSaveConfiguration = this.autoSaveConfigurationCache.get(resource);
			if (!resourceAutoSaveConfiguration) {
				resourceAutoSaveConfiguration = this.computeAutoSaveConfiguration(resource, this.textResourceConfigurationService.getValue<IFilesConfigurationNode>(resource, 'files'));
				this.autoSaveConfigurationCache.set(resource, resourceAutoSaveConfiguration);
			}

			return resourceAutoSaveConfiguration;
		}

		return this.currentGlobalAutoSaveConfiguration;
	}

	private computeAutoSaveConfiguration(resource: URI | undefined, filesConfiguration: IFilesConfigurationNode | undefined): ICachedAutoSaveConfiguration {
		let autoSave: 'afterDelay' | 'onFocusChange' | 'onWindowChange' | undefined;
		let autoSaveDelay: number | undefined;
		let autoSaveWorkspaceFilesOnly: boolean | undefined;
		let autoSaveWhenNoErrors: boolean | undefined;

		let isOutOfWorkspace: boolean | undefined;
		let isShortAutoSaveDelay: boolean | undefined;

		switch (filesConfiguration?.autoSave ?? FilesConfigurationService.DEFAULT_AUTO_SAVE_MODE) {
			case AutoSaveConfiguration.AFTER_DELAY: {
				autoSave = 'afterDelay';
				autoSaveDelay = typeof filesConfiguration?.autoSaveDelay === 'number' && filesConfiguration.autoSaveDelay >= 0 ? filesConfiguration.autoSaveDelay : FilesConfigurationService.DEFAULT_AUTO_SAVE_DELAY;
				isShortAutoSaveDelay = autoSaveDelay <= FilesConfigurationService.DEFAULT_AUTO_SAVE_DELAY;
				break;
			}

			case AutoSaveConfiguration.ON_FOCUS_CHANGE:
				autoSave = 'onFocusChange';
				break;

			case AutoSaveConfiguration.ON_WINDOW_CHANGE:
				autoSave = 'onWindowChange';
				break;
		}

		if (filesConfiguration?.autoSaveWorkspaceFilesOnly === true) {
			autoSaveWorkspaceFilesOnly = true;

			if (resource && !this.contextService.isInsideWorkspace(resource)) {
				isOutOfWorkspace = true;
				isShortAutoSaveDelay = undefined; // out of workspace file are not auto saved with this configuration
			}
		}

		if (filesConfiguration?.autoSaveWhenNoErrors === true) {
			autoSaveWhenNoErrors = true;
			isShortAutoSaveDelay = undefined; // this configuration disables short auto save delay
		}

		return {
			autoSave,
			autoSaveDelay,
			autoSaveWorkspaceFilesOnly,
			autoSaveWhenNoErrors,
			isOutOfWorkspace,
			isShortAutoSaveDelay
		};
	}

	private toResource(resourceOrEditor: EditorInput | URI | undefined): URI | undefined {
		if (resourceOrEditor instanceof EditorInput) {
			return EditorResourceAccessor.getOriginalUri(resourceOrEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
		}

		return resourceOrEditor;
	}

	hasShortAutoSaveDelay(resourceOrEditor: EditorInput | URI | undefined): boolean {
		const resource = this.toResource(resourceOrEditor);

		if (resource && this.autoSaveAfterShortDelayOverrides.has(resource)) {
			return true; // overridden to be enabled after short delay
		}

		if (this.getAutoSaveConfiguration(resource).isShortAutoSaveDelay) {
			return !resource || !this.autoSaveDisabledOverrides.has(resource);
		}

		return false;
	}

	getAutoSaveMode(resourceOrEditor: EditorInput | URI | undefined, saveReason?: SaveReason): IAutoSaveMode {
		const resource = this.toResource(resourceOrEditor);
		if (resource && this.autoSaveAfterShortDelayOverrides.has(resource)) {
			return { mode: AutoSaveMode.AFTER_SHORT_DELAY }; // overridden to be enabled after short delay
		}

		if (resource && this.autoSaveDisabledOverrides.has(resource)) {
			return { mode: AutoSaveMode.OFF, reason: AutoSaveDisabledReason.DISABLED };
		}

		const autoSaveConfiguration = this.getAutoSaveConfiguration(resource);
		if (typeof autoSaveConfiguration.autoSave === 'undefined') {
			return { mode: AutoSaveMode.OFF, reason: AutoSaveDisabledReason.SETTINGS };
		}

		if (typeof saveReason === 'number') {
			if (
				(autoSaveConfiguration.autoSave === 'afterDelay' && saveReason !== SaveReason.AUTO) ||
				(autoSaveConfiguration.autoSave === 'onFocusChange' && saveReason !== SaveReason.FOCUS_CHANGE && saveReason !== SaveReason.WINDOW_CHANGE) ||
				(autoSaveConfiguration.autoSave === 'onWindowChange' && saveReason !== SaveReason.WINDOW_CHANGE)
			) {
				return { mode: AutoSaveMode.OFF, reason: AutoSaveDisabledReason.SETTINGS };
			}
		}

		if (resource) {
			if (autoSaveConfiguration.autoSaveWorkspaceFilesOnly && autoSaveConfiguration.isOutOfWorkspace) {
				return { mode: AutoSaveMode.OFF, reason: AutoSaveDisabledReason.OUT_OF_WORKSPACE };
			}

			if (autoSaveConfiguration.autoSaveWhenNoErrors && this.markerService.read({ resource, take: 1, severities: MarkerSeverity.Error }).length > 0) {
				return { mode: AutoSaveMode.OFF, reason: AutoSaveDisabledReason.ERRORS };
			}
		}

		switch (autoSaveConfiguration.autoSave) {
			case 'afterDelay':
				if (typeof autoSaveConfiguration.autoSaveDelay === 'number' && autoSaveConfiguration.autoSaveDelay <= FilesConfigurationService.DEFAULT_AUTO_SAVE_DELAY) {
					// Explicitly mark auto save configurations as long running
					// if they are configured to not run when there are errors.
					// The rationale here is that errors may come in after auto
					// save has been scheduled and then further delay the auto
					// save until resolved.
					return { mode: autoSaveConfiguration.autoSaveWhenNoErrors ? AutoSaveMode.AFTER_LONG_DELAY : AutoSaveMode.AFTER_SHORT_DELAY };
				}
				return { mode: AutoSaveMode.AFTER_LONG_DELAY };
			case 'onFocusChange':
				return { mode: AutoSaveMode.ON_FOCUS_CHANGE };
			case 'onWindowChange':
				return { mode: AutoSaveMode.ON_WINDOW_CHANGE };
		}
	}

	async toggleAutoSave(): Promise<void> {
		const currentSetting = this.configurationService.getValue('files.autoSave');

		let newAutoSaveValue: string;
		if ([AutoSaveConfiguration.AFTER_DELAY, AutoSaveConfiguration.ON_FOCUS_CHANGE, AutoSaveConfiguration.ON_WINDOW_CHANGE].some(setting => setting === currentSetting)) {
			newAutoSaveValue = AutoSaveConfiguration.OFF;
		} else {
			newAutoSaveValue = AutoSaveConfiguration.AFTER_DELAY;
		}

		return this.configurationService.updateValue('files.autoSave', newAutoSaveValue);
	}

	enableAutoSaveAfterShortDelay(resourceOrEditor: EditorInput | URI): IDisposable {
		const resource = this.toResource(resourceOrEditor);
		if (!resource) {
			return Disposable.None;
		}

		const counter = this.autoSaveAfterShortDelayOverrides.get(resource) ?? 0;
		this.autoSaveAfterShortDelayOverrides.set(resource, counter + 1);

		return toDisposable(() => {
			const counter = this.autoSaveAfterShortDelayOverrides.get(resource) ?? 0;
			if (counter <= 1) {
				this.autoSaveAfterShortDelayOverrides.delete(resource);
			} else {
				this.autoSaveAfterShortDelayOverrides.set(resource, counter - 1);
			}
		});
	}

	disableAutoSave(resourceOrEditor: EditorInput | URI): IDisposable {
		const resource = this.toResource(resourceOrEditor);
		if (!resource) {
			return Disposable.None;
		}

		const counter = this.autoSaveDisabledOverrides.get(resource) ?? 0;
		this.autoSaveDisabledOverrides.set(resource, counter + 1);

		if (counter === 0) {
			this._onDidChangeAutoSaveDisabled.fire(resource);
		}

		return toDisposable(() => {
			const counter = this.autoSaveDisabledOverrides.get(resource) ?? 0;
			if (counter <= 1) {
				this.autoSaveDisabledOverrides.delete(resource);
				this._onDidChangeAutoSaveDisabled.fire(resource);
			} else {
				this.autoSaveDisabledOverrides.set(resource, counter - 1);
			}
		});
	}

	get isHotExitEnabled(): boolean {
		if (this.contextService.getWorkspace().transient) {
			// Transient workspace: hot exit is disabled because
			// transient workspaces are not restored upon restart
			return false;
		}

		return this.currentHotExitConfiguration !== HotExitConfiguration.OFF;
	}

	get hotExitConfiguration(): string {
		return this.currentHotExitConfiguration;
	}

	preventSaveConflicts(resource: URI, language?: string): boolean {
		return this.configurationService.getValue('files.saveConflictResolution', { resource, overrideIdentifier: language }) !== 'overwriteFileOnDisk';
	}
}

registerSingleton(IFilesConfigurationService, FilesConfigurationService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/history/browser/historyService.ts]---
Location: vscode-main/src/vs/workbench/services/history/browser/historyService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { IResourceEditorInput, IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IEditorPane, IEditorCloseEvent, EditorResourceAccessor, IEditorIdentifier, GroupIdentifier, EditorsOrder, SideBySideEditor, IUntypedEditorInput, isResourceEditorInput, isEditorInput, isSideBySideEditorInput, EditorCloseContext, IEditorPaneSelection, EditorPaneSelectionCompareResult, EditorPaneSelectionChangeReason, isEditorPaneWithSelection, IEditorPaneSelectionChangeEvent, IEditorPaneWithSelection, IEditorWillMoveEvent, GroupModelChangeKind } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { GoFilter, GoScope, IHistoryService } from '../common/history.js';
import { FileChangesEvent, IFileService, FileChangeType, FILES_EXCLUDE_CONFIG, FileOperationEvent, FileOperation } from '../../../../platform/files/common/files.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { Disposable, DisposableStore, IDisposable, DisposableMap } from '../../../../base/common/lifecycle.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEditorGroup, IEditorGroupsService } from '../../editor/common/editorGroupsService.js';
import { getExcludes, ISearchConfiguration, SEARCH_EXCLUDE_CONFIG } from '../../search/common/search.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { EditorServiceImpl } from '../../../browser/parts/editor/editor.js';
import { IWorkbenchLayoutService } from '../../layout/browser/layoutService.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { coalesce, remove } from '../../../../base/common/arrays.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { addDisposableListener, EventType, EventHelper, WindowIdleValue } from '../../../../base/browser/dom.js';
import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { Schemas } from '../../../../base/common/network.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { ResourceGlobMatcher } from '../../../common/resources.js';
import { IPathService } from '../../path/common/pathService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { ILogService, LogLevel } from '../../../../platform/log/common/log.js';
import { mainWindow } from '../../../../base/browser/window.js';

interface ISerializedEditorHistoryEntry {
	readonly editor: Omit<IResourceEditorInput, 'resource'> & { resource: string };
}

interface IRecentlyClosedEditor {
	readonly editorId: string | undefined;
	readonly editor: IUntypedEditorInput;

	readonly resource: URI | undefined;
	readonly associatedResources: URI[];

	readonly index: number;
	readonly sticky: boolean;
}

export class HistoryService extends Disposable implements IHistoryService {

	declare readonly _serviceBrand: undefined;

	private static readonly MOUSE_NAVIGATION_SETTING = 'workbench.editor.mouseBackForwardToNavigate';
	private static readonly NAVIGATION_SCOPE_SETTING = 'workbench.editor.navigationScope';

	private readonly activeEditorListeners = this._register(new DisposableStore());
	private lastActiveEditor: IEditorIdentifier | undefined = undefined;

	private readonly editorHelper: EditorHelper;

	constructor(
		@IEditorService private readonly editorService: EditorServiceImpl,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IFileService private readonly fileService: IFileService,
		@IWorkspacesService private readonly workspacesService: IWorkspacesService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.editorHelper = this.instantiationService.createInstance(EditorHelper);

		this.canNavigateBackContextKey = (new RawContextKey<boolean>('canNavigateBack', false, localize('canNavigateBack', "Whether it is possible to navigate back in editor history"))).bindTo(this.contextKeyService);
		this.canNavigateForwardContextKey = (new RawContextKey<boolean>('canNavigateForward', false, localize('canNavigateForward', "Whether it is possible to navigate forward in editor history"))).bindTo(this.contextKeyService);

		this.canNavigateBackInNavigationsContextKey = (new RawContextKey<boolean>('canNavigateBackInNavigationLocations', false, localize('canNavigateBackInNavigationLocations', "Whether it is possible to navigate back in editor navigation locations history"))).bindTo(this.contextKeyService);
		this.canNavigateForwardInNavigationsContextKey = (new RawContextKey<boolean>('canNavigateForwardInNavigationLocations', false, localize('canNavigateForwardInNavigationLocations', "Whether it is possible to navigate forward in editor navigation locations history"))).bindTo(this.contextKeyService);
		this.canNavigateToLastNavigationLocationContextKey = (new RawContextKey<boolean>('canNavigateToLastNavigationLocation', false, localize('canNavigateToLastNavigationLocation', "Whether it is possible to navigate to the last editor navigation location"))).bindTo(this.contextKeyService);

		this.canNavigateBackInEditsContextKey = (new RawContextKey<boolean>('canNavigateBackInEditLocations', false, localize('canNavigateBackInEditLocations', "Whether it is possible to navigate back in editor edit locations history"))).bindTo(this.contextKeyService);
		this.canNavigateForwardInEditsContextKey = (new RawContextKey<boolean>('canNavigateForwardInEditLocations', false, localize('canNavigateForwardInEditLocations', "Whether it is possible to navigate forward in editor edit locations history"))).bindTo(this.contextKeyService);
		this.canNavigateToLastEditLocationContextKey = (new RawContextKey<boolean>('canNavigateToLastEditLocation', false, localize('canNavigateToLastEditLocation', "Whether it is possible to navigate to the last editor edit location"))).bindTo(this.contextKeyService);

		this.canReopenClosedEditorContextKey = (new RawContextKey<boolean>('canReopenClosedEditor', false, localize('canReopenClosedEditor', "Whether it is possible to reopen the last closed editor"))).bindTo(this.contextKeyService);

		this.registerListeners();

		// if the service is created late enough that an editor is already opened
		// make sure to trigger the onActiveEditorChanged() to track the editor
		// properly (fixes https://github.com/microsoft/vscode/issues/59908)
		if (this.editorService.activeEditorPane) {
			this.onDidActiveEditorChange();
		}
	}

	private registerListeners(): void {

		// Mouse back/forward support
		this.registerMouseNavigationListener();

		// Editor changes
		this._register(this.editorService.onDidActiveEditorChange(() => this.onDidActiveEditorChange()));
		this._register(this.editorService.onDidOpenEditorFail(event => this.remove(event.editor)));
		this._register(this.editorService.onDidCloseEditor(event => this.onDidCloseEditor(event)));
		this._register(this.editorService.onDidMostRecentlyActiveEditorsChange(() => this.handleEditorEventInRecentEditorsStack()));

		// Editor group changes
		this._register(this.editorGroupService.onDidRemoveGroup(e => this.onDidRemoveGroup(e)));

		// File changes
		this._register(this.fileService.onDidFilesChange(event => this.onDidFilesChange(event)));
		this._register(this.fileService.onDidRunOperation(event => this.onDidFilesChange(event)));

		// Storage
		this._register(this.storageService.onWillSaveState(() => this.saveState()));

		// Configuration
		this.registerEditorNavigationScopeChangeListener();

		// Context keys
		this._register(this.onDidChangeEditorNavigationStack(() => this.updateContextKeys()));
		this._register(this.editorGroupService.onDidChangeActiveGroup(() => this.updateContextKeys()));
	}

	private onDidCloseEditor(e: IEditorCloseEvent): void {
		this.handleEditorCloseEventInHistory(e);
		this.handleEditorCloseEventInReopen(e);
	}

	private registerMouseNavigationListener(): void {
		const mouseBackForwardSupportListener = this._register(new DisposableStore());
		const handleMouseBackForwardSupport = () => {
			mouseBackForwardSupportListener.clear();

			if (this.configurationService.getValue(HistoryService.MOUSE_NAVIGATION_SETTING)) {
				this._register(Event.runAndSubscribe(this.layoutService.onDidAddContainer, ({ container, disposables }) => {
					const eventDisposables = disposables.add(new DisposableStore());
					eventDisposables.add(addDisposableListener(container, EventType.MOUSE_DOWN, e => this.onMouseDownOrUp(e, true)));
					eventDisposables.add(addDisposableListener(container, EventType.MOUSE_UP, e => this.onMouseDownOrUp(e, false)));

					mouseBackForwardSupportListener.add(eventDisposables);
				}, { container: this.layoutService.mainContainer, disposables: this._store }));
			}
		};

		this._register(this.configurationService.onDidChangeConfiguration(event => {
			if (event.affectsConfiguration(HistoryService.MOUSE_NAVIGATION_SETTING)) {
				handleMouseBackForwardSupport();
			}
		}));

		handleMouseBackForwardSupport();
	}

	private onMouseDownOrUp(event: MouseEvent, isMouseDown: boolean): void {

		// Support to navigate in history when mouse buttons 4/5 are pressed
		// We want to trigger this on mouse down for a faster experience
		// but we also need to prevent mouse up from triggering the default
		// which is to navigate in the browser history.

		switch (event.button) {
			case 3:
				EventHelper.stop(event);
				if (isMouseDown) {
					this.goBack();
				}
				break;
			case 4:
				EventHelper.stop(event);
				if (isMouseDown) {
					this.goForward();
				}

				break;
		}
	}

	private onDidRemoveGroup(group: IEditorGroup): void {
		this.handleEditorGroupRemoveInNavigationStacks(group);
	}

	private onDidActiveEditorChange(): void {
		const activeEditorGroup = this.editorGroupService.activeGroup;
		const activeEditorPane = activeEditorGroup.activeEditorPane;

		if (this.lastActiveEditor && this.editorHelper.matchesEditorIdentifier(this.lastActiveEditor, activeEditorPane)) {
			return; // return if the active editor is still the same
		}

		// Remember as last active editor (can be undefined if none opened)
		this.lastActiveEditor = activeEditorPane?.input ? { editor: activeEditorPane.input, groupId: activeEditorPane.group.id } : undefined;

		// Dispose old listeners
		this.activeEditorListeners.clear();

		// Handle editor change unless the editor is transient. In that case
		// setup a listener to see if the transient editor becomes non-transient
		// (https://github.com/microsoft/vscode/issues/211769)
		if (!activeEditorPane?.group.isTransient(activeEditorPane.input)) {
			this.handleActiveEditorChange(activeEditorGroup, activeEditorPane);
		} else {
			this.logService.trace(`[History]: ignoring transient editor change until becoming non-transient (editor: ${activeEditorPane.input?.resource?.toString()}})`);

			const transientListener = activeEditorGroup.onDidModelChange(e => {
				if (e.kind === GroupModelChangeKind.EDITOR_TRANSIENT && e.editor === activeEditorPane.input && !activeEditorPane.group.isTransient(activeEditorPane.input)) {
					transientListener.dispose();

					this.handleActiveEditorChange(activeEditorGroup, activeEditorPane);
				}
			});

			this.activeEditorListeners.add(transientListener);
		}

		// Listen to selection changes unless the editor is transient
		if (isEditorPaneWithSelection(activeEditorPane)) {
			this.activeEditorListeners.add(activeEditorPane.onDidChangeSelection(e => {
				if (!activeEditorPane.group.isTransient(activeEditorPane.input)) {
					this.handleActiveEditorSelectionChangeEvent(activeEditorGroup, activeEditorPane, e);
				} else {
					this.logService.trace(`[History]: ignoring transient editor selection change (editor: ${activeEditorPane.input?.resource?.toString()}})`);
				}
			}));
		}

		// Context keys
		this.updateContextKeys();
	}

	private onDidFilesChange(event: FileChangesEvent | FileOperationEvent): void {

		// External file changes (watcher)
		if (event instanceof FileChangesEvent) {
			if (event.gotDeleted()) {
				this.remove(event);
			}
		}

		// Internal file changes (e.g. explorer)
		else {

			// Delete
			if (event.isOperation(FileOperation.DELETE)) {
				this.remove(event);
			}

			// Move
			else if (event.isOperation(FileOperation.MOVE) && event.target.isFile) {
				this.move(event);
			}
		}
	}

	private handleActiveEditorChange(group: IEditorGroup, editorPane?: IEditorPane): void {
		this.handleActiveEditorChangeInHistory(editorPane);
		this.handleActiveEditorChangeInNavigationStacks(group, editorPane);
	}

	private handleActiveEditorSelectionChangeEvent(group: IEditorGroup, editorPane: IEditorPaneWithSelection, event: IEditorPaneSelectionChangeEvent): void {
		this.handleActiveEditorSelectionChangeInNavigationStacks(group, editorPane, event);
	}

	private move(event: FileOperationEvent): void {
		this.moveInHistory(event);
		this.moveInEditorNavigationStacks(event);
	}

	private remove(editor: EditorInput): void;
	private remove(event: FileChangesEvent): void;
	private remove(event: FileOperationEvent): void;
	private remove(arg1: EditorInput | FileChangesEvent | FileOperationEvent): void {
		this.removeFromHistory(arg1);
		this.removeFromEditorNavigationStacks(arg1);
		this.removeFromRecentlyClosedEditors(arg1);
		this.removeFromRecentlyOpened(arg1);
	}

	private removeFromRecentlyOpened(arg1: EditorInput | FileChangesEvent | FileOperationEvent): void {
		let resource: URI | undefined = undefined;
		if (isEditorInput(arg1)) {
			resource = EditorResourceAccessor.getOriginalUri(arg1);
		} else if (arg1 instanceof FileChangesEvent) {
			// Ignore for now (recently opened are most often out of workspace files anyway for which there are no file events)
		} else {
			resource = arg1.resource;
		}

		if (resource) {
			this.workspacesService.removeRecentlyOpened([resource]);
		}
	}

	clear(): void {

		// History
		this.clearRecentlyOpened();

		// Navigation (next, previous)
		this.clearEditorNavigationStacks();

		// Recently closed editors
		this.recentlyClosedEditors = [];

		// Context Keys
		this.updateContextKeys();
	}

	//#region History Context Keys

	private readonly canNavigateBackContextKey: IContextKey<boolean>;
	private readonly canNavigateForwardContextKey: IContextKey<boolean>;

	private readonly canNavigateBackInNavigationsContextKey: IContextKey<boolean>;
	private readonly canNavigateForwardInNavigationsContextKey: IContextKey<boolean>;
	private readonly canNavigateToLastNavigationLocationContextKey: IContextKey<boolean>;

	private readonly canNavigateBackInEditsContextKey: IContextKey<boolean>;
	private readonly canNavigateForwardInEditsContextKey: IContextKey<boolean>;
	private readonly canNavigateToLastEditLocationContextKey: IContextKey<boolean>;

	private readonly canReopenClosedEditorContextKey: IContextKey<boolean>;

	updateContextKeys(): void {
		this.contextKeyService.bufferChangeEvents(() => {
			const activeStack = this.getStack();

			this.canNavigateBackContextKey.set(activeStack.canGoBack(GoFilter.NONE));
			this.canNavigateForwardContextKey.set(activeStack.canGoForward(GoFilter.NONE));

			this.canNavigateBackInNavigationsContextKey.set(activeStack.canGoBack(GoFilter.NAVIGATION));
			this.canNavigateForwardInNavigationsContextKey.set(activeStack.canGoForward(GoFilter.NAVIGATION));
			this.canNavigateToLastNavigationLocationContextKey.set(activeStack.canGoLast(GoFilter.NAVIGATION));

			this.canNavigateBackInEditsContextKey.set(activeStack.canGoBack(GoFilter.EDITS));
			this.canNavigateForwardInEditsContextKey.set(activeStack.canGoForward(GoFilter.EDITS));
			this.canNavigateToLastEditLocationContextKey.set(activeStack.canGoLast(GoFilter.EDITS));

			this.canReopenClosedEditorContextKey.set(this.recentlyClosedEditors.length > 0);
		});
	}

	//#endregion

	//#region Editor History Navigation (limit: 50)

	private readonly _onDidChangeEditorNavigationStack = this._register(new Emitter<void>());
	readonly onDidChangeEditorNavigationStack = this._onDidChangeEditorNavigationStack.event;

	private defaultScopedEditorNavigationStack: IEditorNavigationStacks | undefined = undefined;
	private readonly editorGroupScopedNavigationStacks = new Map<GroupIdentifier, { stack: IEditorNavigationStacks; disposable: IDisposable }>();
	private readonly editorScopedNavigationStacks = new Map<GroupIdentifier, Map<EditorInput, { stack: IEditorNavigationStacks; disposable: IDisposable }>>();

	private editorNavigationScope = GoScope.DEFAULT;

	private registerEditorNavigationScopeChangeListener(): void {
		const handleEditorNavigationScopeChange = () => {

			// Ensure to start fresh when setting changes
			this.disposeEditorNavigationStacks();

			// Update scope
			const configuredScope = this.configurationService.getValue(HistoryService.NAVIGATION_SCOPE_SETTING);
			if (configuredScope === 'editorGroup') {
				this.editorNavigationScope = GoScope.EDITOR_GROUP;
			} else if (configuredScope === 'editor') {
				this.editorNavigationScope = GoScope.EDITOR;
			} else {
				this.editorNavigationScope = GoScope.DEFAULT;
			}
		};

		this._register(this.configurationService.onDidChangeConfiguration(event => {
			if (event.affectsConfiguration(HistoryService.NAVIGATION_SCOPE_SETTING)) {
				handleEditorNavigationScopeChange();
			}
		}));

		handleEditorNavigationScopeChange();
	}

	private getStack(group = this.editorGroupService.activeGroup, editor = group.activeEditor): IEditorNavigationStacks {
		switch (this.editorNavigationScope) {

			// Per Editor
			case GoScope.EDITOR: {
				if (!editor) {
					return new NoOpEditorNavigationStacks();
				}

				let stacksForGroup = this.editorScopedNavigationStacks.get(group.id);
				if (!stacksForGroup) {
					stacksForGroup = new Map<EditorInput, { stack: IEditorNavigationStacks; disposable: IDisposable }>();
					this.editorScopedNavigationStacks.set(group.id, stacksForGroup);
				}

				let stack = stacksForGroup.get(editor)?.stack;
				if (!stack) {
					const disposable = new DisposableStore();

					stack = disposable.add(this.instantiationService.createInstance(EditorNavigationStacks, GoScope.EDITOR));
					disposable.add(stack.onDidChange(() => this._onDidChangeEditorNavigationStack.fire()));

					stacksForGroup.set(editor, { stack, disposable });
				}

				return stack;
			}

			// Per Editor Group
			case GoScope.EDITOR_GROUP: {
				let stack = this.editorGroupScopedNavigationStacks.get(group.id)?.stack;
				if (!stack) {
					const disposable = new DisposableStore();

					stack = disposable.add(this.instantiationService.createInstance(EditorNavigationStacks, GoScope.EDITOR_GROUP));
					disposable.add(stack.onDidChange(() => this._onDidChangeEditorNavigationStack.fire()));

					this.editorGroupScopedNavigationStacks.set(group.id, { stack, disposable });
				}

				return stack;
			}

			// Global
			case GoScope.DEFAULT: {
				if (!this.defaultScopedEditorNavigationStack) {
					this.defaultScopedEditorNavigationStack = this._register(this.instantiationService.createInstance(EditorNavigationStacks, GoScope.DEFAULT));

					this._register(this.defaultScopedEditorNavigationStack.onDidChange(() => this._onDidChangeEditorNavigationStack.fire()));
				}

				return this.defaultScopedEditorNavigationStack;
			}
		}
	}

	goForward(filter?: GoFilter): Promise<void> {
		return this.getStack().goForward(filter);
	}

	goBack(filter?: GoFilter): Promise<void> {
		return this.getStack().goBack(filter);
	}

	goPrevious(filter?: GoFilter): Promise<void> {
		return this.getStack().goPrevious(filter);
	}

	goLast(filter?: GoFilter): Promise<void> {
		return this.getStack().goLast(filter);
	}

	private handleActiveEditorChangeInNavigationStacks(group: IEditorGroup, editorPane?: IEditorPane): void {
		this.getStack(group, editorPane?.input).handleActiveEditorChange(editorPane);
	}

	private handleActiveEditorSelectionChangeInNavigationStacks(group: IEditorGroup, editorPane: IEditorPaneWithSelection, event: IEditorPaneSelectionChangeEvent): void {
		this.getStack(group, editorPane.input).handleActiveEditorSelectionChange(editorPane, event);
	}

	private handleEditorCloseEventInHistory(e: IEditorCloseEvent): void {
		const editors = this.editorScopedNavigationStacks.get(e.groupId);
		if (editors) {
			const editorStack = editors.get(e.editor);
			if (editorStack) {
				editorStack.disposable.dispose();
				editors.delete(e.editor);
			}

			if (editors.size === 0) {
				this.editorScopedNavigationStacks.delete(e.groupId);
			}
		}
	}

	private handleEditorGroupRemoveInNavigationStacks(group: IEditorGroup): void {

		// Global
		this.defaultScopedEditorNavigationStack?.remove(group.id);

		// Editor groups
		const editorGroupStack = this.editorGroupScopedNavigationStacks.get(group.id);
		if (editorGroupStack) {
			editorGroupStack.disposable.dispose();
			this.editorGroupScopedNavigationStacks.delete(group.id);
		}
	}

	private clearEditorNavigationStacks(): void {
		this.withEachEditorNavigationStack(stack => stack.clear());
	}

	private removeFromEditorNavigationStacks(arg1: EditorInput | FileChangesEvent | FileOperationEvent): void {
		this.withEachEditorNavigationStack(stack => stack.remove(arg1));
	}

	private moveInEditorNavigationStacks(event: FileOperationEvent): void {
		this.withEachEditorNavigationStack(stack => stack.move(event));
	}

	private withEachEditorNavigationStack(fn: (stack: IEditorNavigationStacks) => void): void {

		// Global
		if (this.defaultScopedEditorNavigationStack) {
			fn(this.defaultScopedEditorNavigationStack);
		}

		// Per editor group
		for (const [, entry] of this.editorGroupScopedNavigationStacks) {
			fn(entry.stack);
		}

		// Per editor
		for (const [, entries] of this.editorScopedNavigationStacks) {
			for (const [, entry] of entries) {
				fn(entry.stack);
			}
		}
	}

	private disposeEditorNavigationStacks(): void {

		// Global
		this.defaultScopedEditorNavigationStack?.dispose();
		this.defaultScopedEditorNavigationStack = undefined;

		// Per Editor group
		for (const [, stack] of this.editorGroupScopedNavigationStacks) {
			stack.disposable.dispose();
		}
		this.editorGroupScopedNavigationStacks.clear();

		// Per Editor
		for (const [, stacks] of this.editorScopedNavigationStacks) {
			for (const [, stack] of stacks) {
				stack.disposable.dispose();
			}
		}
		this.editorScopedNavigationStacks.clear();
	}

	//#endregion

	//#region Navigation: Next/Previous Used Editor

	private recentlyUsedEditorsStack: readonly IEditorIdentifier[] | undefined = undefined;
	private recentlyUsedEditorsStackIndex = 0;

	private recentlyUsedEditorsInGroupStack: readonly IEditorIdentifier[] | undefined = undefined;
	private recentlyUsedEditorsInGroupStackIndex = 0;

	private navigatingInRecentlyUsedEditorsStack = false;
	private navigatingInRecentlyUsedEditorsInGroupStack = false;

	openNextRecentlyUsedEditor(groupId?: GroupIdentifier): Promise<void> {
		const [stack, index] = this.ensureRecentlyUsedStack(index => index - 1, groupId);

		return this.doNavigateInRecentlyUsedEditorsStack(stack[index], groupId);
	}

	openPreviouslyUsedEditor(groupId?: GroupIdentifier): Promise<void> {
		const [stack, index] = this.ensureRecentlyUsedStack(index => index + 1, groupId);

		return this.doNavigateInRecentlyUsedEditorsStack(stack[index], groupId);
	}

	private async doNavigateInRecentlyUsedEditorsStack(editorIdentifier: IEditorIdentifier | undefined, groupId?: GroupIdentifier): Promise<void> {
		if (editorIdentifier) {
			const acrossGroups = typeof groupId !== 'number' || !this.editorGroupService.getGroup(groupId);

			if (acrossGroups) {
				this.navigatingInRecentlyUsedEditorsStack = true;
			} else {
				this.navigatingInRecentlyUsedEditorsInGroupStack = true;
			}

			const group = this.editorGroupService.getGroup(editorIdentifier.groupId) ?? this.editorGroupService.activeGroup;
			try {
				await group.openEditor(editorIdentifier.editor);
			} finally {
				if (acrossGroups) {
					this.navigatingInRecentlyUsedEditorsStack = false;
				} else {
					this.navigatingInRecentlyUsedEditorsInGroupStack = false;
				}
			}
		}
	}

	private ensureRecentlyUsedStack(indexModifier: (index: number) => number, groupId?: GroupIdentifier): [readonly IEditorIdentifier[], number] {
		let editors: readonly IEditorIdentifier[];
		let index: number;

		const group = typeof groupId === 'number' ? this.editorGroupService.getGroup(groupId) : undefined;

		// Across groups
		if (!group) {
			editors = this.recentlyUsedEditorsStack || this.editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE);
			index = this.recentlyUsedEditorsStackIndex;
		}

		// Within group
		else {
			editors = this.recentlyUsedEditorsInGroupStack || group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).map(editor => ({ groupId: group.id, editor }));
			index = this.recentlyUsedEditorsInGroupStackIndex;
		}

		// Adjust index
		let newIndex = indexModifier(index);
		if (newIndex < 0) {
			newIndex = 0;
		} else if (newIndex > editors.length - 1) {
			newIndex = editors.length - 1;
		}

		// Remember index and editors
		if (!group) {
			this.recentlyUsedEditorsStack = editors;
			this.recentlyUsedEditorsStackIndex = newIndex;
		} else {
			this.recentlyUsedEditorsInGroupStack = editors;
			this.recentlyUsedEditorsInGroupStackIndex = newIndex;
		}

		return [editors, newIndex];
	}

	private handleEditorEventInRecentEditorsStack(): void {

		// Drop all-editors stack unless navigating in all editors
		if (!this.navigatingInRecentlyUsedEditorsStack) {
			this.recentlyUsedEditorsStack = undefined;
			this.recentlyUsedEditorsStackIndex = 0;
		}

		// Drop in-group-editors stack unless navigating in group
		if (!this.navigatingInRecentlyUsedEditorsInGroupStack) {
			this.recentlyUsedEditorsInGroupStack = undefined;
			this.recentlyUsedEditorsInGroupStackIndex = 0;
		}
	}

	//#endregion

	//#region File: Reopen Closed Editor (limit: 20)

	private static readonly MAX_RECENTLY_CLOSED_EDITORS = 20;

	private recentlyClosedEditors: IRecentlyClosedEditor[] = [];
	private ignoreEditorCloseEvent = false;

	private handleEditorCloseEventInReopen(event: IEditorCloseEvent): void {
		if (this.ignoreEditorCloseEvent) {
			return; // blocked
		}

		const { editor, context } = event;
		if (context === EditorCloseContext.REPLACE || context === EditorCloseContext.MOVE) {
			return; // ignore if editor was replaced or moved
		}

		if (!editor.canReopen()) {
			return; // only editors that can be reopened
		}

		const untypedEditor = editor.toUntyped();
		if (!untypedEditor) {
			return; // we need a untyped editor to restore from going forward
		}

		const associatedResources: URI[] = [];
		const editorResource = EditorResourceAccessor.getOriginalUri(editor, { supportSideBySide: SideBySideEditor.BOTH });
		if (URI.isUri(editorResource)) {
			associatedResources.push(editorResource);
		} else if (editorResource) {
			associatedResources.push(...coalesce([editorResource.primary, editorResource.secondary]));
		}

		// Remove from list of recently closed before...
		this.removeFromRecentlyClosedEditors(editor);

		// ...adding it as last recently closed
		this.recentlyClosedEditors.push({
			editorId: editor.editorId,
			editor: untypedEditor,
			resource: EditorResourceAccessor.getOriginalUri(editor),
			associatedResources,
			index: event.index,
			sticky: event.sticky
		});

		// Bounding
		if (this.recentlyClosedEditors.length > HistoryService.MAX_RECENTLY_CLOSED_EDITORS) {
			this.recentlyClosedEditors.shift();
		}

		// Context
		this.canReopenClosedEditorContextKey.set(true);
	}

	async reopenLastClosedEditor(): Promise<void> {

		// Open editor if we have one
		const lastClosedEditor = this.recentlyClosedEditors.pop();
		let reopenClosedEditorPromise: Promise<void> | undefined = undefined;
		if (lastClosedEditor) {
			reopenClosedEditorPromise = this.doReopenLastClosedEditor(lastClosedEditor);
		}

		// Update context
		this.canReopenClosedEditorContextKey.set(this.recentlyClosedEditors.length > 0);

		return reopenClosedEditorPromise;
	}

	private async doReopenLastClosedEditor(lastClosedEditor: IRecentlyClosedEditor): Promise<void> {
		const options: IEditorOptions = { pinned: true, sticky: lastClosedEditor.sticky, index: lastClosedEditor.index, ignoreError: true };

		// Special sticky handling: remove the index property from options
		// if that would result in sticky state to not preserve or apply
		// wrongly.
		if (
			(lastClosedEditor.sticky && !this.editorGroupService.activeGroup.isSticky(lastClosedEditor.index)) ||
			(!lastClosedEditor.sticky && this.editorGroupService.activeGroup.isSticky(lastClosedEditor.index))
		) {
			options.index = undefined;
		}

		// Re-open editor unless already opened
		let editorPane: IEditorPane | undefined = undefined;
		if (!this.editorGroupService.activeGroup.contains(lastClosedEditor.editor)) {

			// Fix for https://github.com/microsoft/vscode/issues/107850
			// If opening an editor fails, it is possible that we get
			// another editor-close event as a result. But we really do
			// want to ignore that in our list of recently closed editors
			//  to prevent endless loops.

			this.ignoreEditorCloseEvent = true;
			try {
				editorPane = await this.editorService.openEditor({
					...lastClosedEditor.editor,
					options: {
						...lastClosedEditor.editor.options,
						...options
					}
				});
			} finally {
				this.ignoreEditorCloseEvent = false;
			}
		}

		// If no editor was opened, try with the next one
		if (!editorPane) {

			// Fix for https://github.com/microsoft/vscode/issues/67882
			// If opening of the editor fails, make sure to try the next one
			// but make sure to remove this one from the list to prevent
			// endless loops.
			remove(this.recentlyClosedEditors, lastClosedEditor);

			// Try with next one
			this.reopenLastClosedEditor();
		}
	}

	private removeFromRecentlyClosedEditors(arg1: EditorInput | FileChangesEvent | FileOperationEvent): void {
		this.recentlyClosedEditors = this.recentlyClosedEditors.filter(recentlyClosedEditor => {
			if (isEditorInput(arg1) && recentlyClosedEditor.editorId !== arg1.editorId) {
				return true; // keep: different editor identifiers
			}

			if (recentlyClosedEditor.resource && this.editorHelper.matchesFile(recentlyClosedEditor.resource, arg1)) {
				return false; // remove: editor matches directly
			}

			if (recentlyClosedEditor.associatedResources.some(associatedResource => this.editorHelper.matchesFile(associatedResource, arg1))) {
				return false; // remove: an associated resource matches
			}

			return true; // keep
		});

		// Update context
		this.canReopenClosedEditorContextKey.set(this.recentlyClosedEditors.length > 0);
	}

	//#endregion

	//#region Go to: Recently Opened Editor (limit: 200, persisted)

	private static readonly MAX_HISTORY_ITEMS = 200;
	private static readonly HISTORY_STORAGE_KEY = 'history.entries';

	private history: Array<EditorInput | IResourceEditorInput> | undefined = undefined;

	private readonly editorHistoryListeners = this._register(new DisposableMap<EditorInput, DisposableStore>());

	private readonly resourceExcludeMatcher = this._register(new WindowIdleValue(mainWindow, () => {
		const matcher = this._register(this.instantiationService.createInstance(
			ResourceGlobMatcher,
			root => getExcludes(root ? this.configurationService.getValue<ISearchConfiguration>({ resource: root }) : this.configurationService.getValue<ISearchConfiguration>()) || Object.create(null),
			event => event.affectsConfiguration(FILES_EXCLUDE_CONFIG) || event.affectsConfiguration(SEARCH_EXCLUDE_CONFIG)
		));

		this._register(matcher.onExpressionChange(() => this.removeExcludedFromHistory()));

		return matcher;
	}));

	private handleActiveEditorChangeInHistory(editorPane?: IEditorPane): void {

		// Ensure we have not configured to exclude input and don't track invalid inputs
		const editor = editorPane?.input;
		if (!editor || editor.isDisposed() || !this.includeInHistory(editor)) {
			return;
		}

		// Remove any existing entry and add to the beginning
		this.removeFromHistory(editor);
		this.addToHistory(editor);
	}

	private addToHistory(editor: EditorInput | IResourceEditorInput, insertFirst = true): void {
		this.ensureHistoryLoaded(this.history);

		const historyInput = this.editorHelper.preferResourceEditorInput(editor);
		if (!historyInput) {
			return;
		}

		// Insert based on preference
		if (insertFirst) {
			this.history.unshift(historyInput);
		} else {
			this.history.push(historyInput);
		}

		// Respect max entries setting
		if (this.history.length > HistoryService.MAX_HISTORY_ITEMS) {
			this.editorHelper.clearOnEditorDispose(this.history.pop()!, this.editorHistoryListeners);
		}

		// React to editor input disposing
		if (isEditorInput(editor)) {
			this.editorHelper.onEditorDispose(editor, () => this.updateHistoryOnEditorDispose(historyInput), this.editorHistoryListeners);
		}
	}

	private updateHistoryOnEditorDispose(editor: EditorInput | IResourceEditorInput): void {
		if (isEditorInput(editor)) {

			// Any non side-by-side editor input gets removed directly on dispose
			if (!isSideBySideEditorInput(editor)) {
				this.removeFromHistory(editor);
			}

			// Side-by-side editors get special treatment: we try to distill the
			// possibly untyped resource inputs from both sides to be able to
			// offer these entries from the history to the user still unless
			// they are excluded.
			else {
				const resourceInputs: IResourceEditorInput[] = [];
				const sideInputs = editor.primary.matches(editor.secondary) ? [editor.primary] : [editor.primary, editor.secondary];
				for (const sideInput of sideInputs) {
					const candidateResourceInput = this.editorHelper.preferResourceEditorInput(sideInput);
					if (isResourceEditorInput(candidateResourceInput) && this.includeInHistory(candidateResourceInput)) {
						resourceInputs.push(candidateResourceInput);
					}
				}

				// Insert the untyped resource inputs where our disposed
				// side-by-side editor input is in the history stack
				this.replaceInHistory(editor, ...resourceInputs);
			}
		} else {

			// Remove any editor that should not be included in history
			if (!this.includeInHistory(editor)) {
				this.removeFromHistory(editor);
			}
		}
	}

	private includeInHistory(editor: EditorInput | IResourceEditorInput): boolean {
		if (isEditorInput(editor)) {
			return true; // include any non files
		}

		return !this.resourceExcludeMatcher.value.matches(editor.resource);
	}

	private removeExcludedFromHistory(): void {
		this.ensureHistoryLoaded(this.history);

		this.history = this.history.filter(entry => {
			const include = this.includeInHistory(entry);

			// Cleanup any listeners associated with the input when removing from history
			if (!include) {
				this.editorHelper.clearOnEditorDispose(entry, this.editorHistoryListeners);
			}

			return include;
		});
	}

	private moveInHistory(event: FileOperationEvent): void {
		if (event.isOperation(FileOperation.MOVE)) {
			const removed = this.removeFromHistory(event);
			if (removed) {
				this.addToHistory({ resource: event.target.resource });
			}
		}
	}

	removeFromHistory(arg1: EditorInput | IResourceEditorInput | FileChangesEvent | FileOperationEvent): boolean {
		let removed = false;

		this.ensureHistoryLoaded(this.history);

		this.history = this.history.filter(entry => {
			const matches = this.editorHelper.matchesEditor(arg1, entry);

			// Cleanup any listeners associated with the input when removing from history
			if (matches) {
				this.editorHelper.clearOnEditorDispose(arg1, this.editorHistoryListeners);
				removed = true;
			}

			return !matches;
		});

		return removed;
	}

	private replaceInHistory(editor: EditorInput | IResourceEditorInput, ...replacements: ReadonlyArray<EditorInput | IResourceEditorInput>): void {
		this.ensureHistoryLoaded(this.history);

		let replaced = false;

		const newHistory: Array<EditorInput | IResourceEditorInput> = [];
		for (const entry of this.history) {

			// Entry matches and is going to be disposed + replaced
			if (this.editorHelper.matchesEditor(editor, entry)) {

				// Cleanup any listeners associated with the input when replacing from history
				this.editorHelper.clearOnEditorDispose(editor, this.editorHistoryListeners);

				// Insert replacements but only once
				if (!replaced) {
					newHistory.push(...replacements);
					replaced = true;
				}
			}

			// Entry does not match, but only add it if it didn't match
			// our replacements already
			else if (!replacements.some(replacement => this.editorHelper.matchesEditor(replacement, entry))) {
				newHistory.push(entry);
			}
		}

		// If the target editor to replace was not found, make sure to
		// insert the replacements to the end to ensure we got them
		if (!replaced) {
			newHistory.push(...replacements);
		}

		this.history = newHistory;
	}

	clearRecentlyOpened(): void {
		this.history = [];

		this.editorHistoryListeners.clearAndDisposeAll();
	}

	getHistory(): readonly (EditorInput | IResourceEditorInput)[] {
		this.ensureHistoryLoaded(this.history);

		return this.history;
	}

	private ensureHistoryLoaded(history: Array<EditorInput | IResourceEditorInput> | undefined): asserts history {
		if (!this.history) {

			// Until history is loaded, it is just empty
			this.history = [];

			// We want to seed history from opened editors
			// too as well as previous stored state, so we
			// need to wait for the editor groups being ready
			if (this.editorGroupService.isReady) {
				this.loadHistory();
			} else {
				(async () => {
					await this.editorGroupService.whenReady;

					this.loadHistory();
				})();
			}
		}
	}

	private loadHistory(): void {

		// Init as empty before adding - since we are about to
		// populate the history from opened editors, we capture
		// the right order here.
		this.history = [];

		// All stored editors from previous session
		const storedEditorHistory = this.loadHistoryFromStorage();

		// All restored editors from previous session
		// in reverse editor from least to most recently
		// used.
		const openedEditorsLru = [...this.editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE)].reverse();

		// We want to merge the opened editors from the last
		// session with the stored editors from the last
		// session. Because not all editors can be serialised
		// we want to make sure to include all opened editors
		// too.
		// Opened editors should always be first in the history

		const handledEditors = new Set<string /* resource + editorId */>();

		// Add all opened editors first
		for (const { editor } of openedEditorsLru) {
			if (!this.includeInHistory(editor)) {
				continue;
			}

			// Make sure to skip duplicates from the editors LRU
			if (editor.resource) {
				const historyEntryId = `${editor.resource.toString()}/${editor.editorId}`;
				if (handledEditors.has(historyEntryId)) {
					continue; // already added
				}

				handledEditors.add(historyEntryId);
			}

			// Add into history
			this.addToHistory(editor);
		}

		// Add remaining from storage if not there already
		// We check on resource and `editorId` (from `override`)
		// to figure out if the editor has been already added.
		for (const editor of storedEditorHistory) {
			const historyEntryId = `${editor.resource.toString()}/${editor.options?.override}`;
			if (
				!handledEditors.has(historyEntryId) &&
				this.includeInHistory(editor)
			) {
				handledEditors.add(historyEntryId);
				this.addToHistory(editor, false /* at the end */);
			}
		}
	}

	private loadHistoryFromStorage(): Array<IResourceEditorInput> {
		const entries: IResourceEditorInput[] = [];

		const entriesRaw = this.storageService.get(HistoryService.HISTORY_STORAGE_KEY, StorageScope.WORKSPACE);
		if (entriesRaw) {
			try {
				const entriesParsed: ISerializedEditorHistoryEntry[] = JSON.parse(entriesRaw);
				for (const entryParsed of entriesParsed) {
					if (!entryParsed.editor || !entryParsed.editor.resource) {
						continue; // unexpected data format
					}

					try {
						entries.push({
							...entryParsed.editor,
							resource: typeof entryParsed.editor.resource === 'string' ?
								URI.parse(entryParsed.editor.resource) :  	//  from 1.67.x: URI is stored efficiently as URI.toString()
								URI.from(entryParsed.editor.resource)		// until 1.66.x: URI was stored very verbose as URI.toJSON()
						});
					} catch (error) {
						onUnexpectedError(error); // do not fail entire history when one entry fails
					}
				}
			} catch (error) {
				onUnexpectedError(error); // https://github.com/microsoft/vscode/issues/99075
			}
		}

		return entries;
	}

	private saveState(): void {
		if (!this.history) {
			return; // nothing to save because history was not used
		}

		const entries: ISerializedEditorHistoryEntry[] = [];
		for (const editor of this.history) {
			if (isEditorInput(editor) || !isResourceEditorInput(editor)) {
				continue; // only save resource editor inputs
			}

			entries.push({
				editor: {
					...editor,
					resource: editor.resource.toString()
				}
			});
		}

		this.storageService.store(HistoryService.HISTORY_STORAGE_KEY, JSON.stringify(entries), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	//#endregion

	//#region Last Active Workspace/File

	getLastActiveWorkspaceRoot(schemeFilter?: string, authorityFilter?: string): URI | undefined {

		// No Folder: return early
		const folders = this.contextService.getWorkspace().folders;
		if (folders.length === 0) {
			return undefined;
		}

		// Single Folder: return early
		if (folders.length === 1) {
			const resource = folders[0].uri;
			if ((!schemeFilter || resource.scheme === schemeFilter) && (!authorityFilter || resource.authority === authorityFilter)) {
				return resource;
			}

			return undefined;
		}

		// Multiple folders: find the last active one
		for (const input of this.getHistory()) {
			if (isEditorInput(input)) {
				continue;
			}

			if (schemeFilter && input.resource.scheme !== schemeFilter) {
				continue;
			}

			if (authorityFilter && input.resource.authority !== authorityFilter) {
				continue;
			}

			const resourceWorkspace = this.contextService.getWorkspaceFolder(input.resource);
			if (resourceWorkspace) {
				return resourceWorkspace.uri;
			}
		}

		// Fallback to first workspace matching scheme filter if any
		for (const folder of folders) {
			const resource = folder.uri;
			if ((!schemeFilter || resource.scheme === schemeFilter) && (!authorityFilter || resource.authority === authorityFilter)) {
				return resource;
			}
		}

		return undefined;
	}

	getLastActiveFile(filterByScheme: string, filterByAuthority?: string): URI | undefined {
		for (const input of this.getHistory()) {
			let resource: URI | undefined;
			if (isEditorInput(input)) {
				resource = EditorResourceAccessor.getOriginalUri(input, { filterByScheme });
			} else {
				resource = input.resource;
			}

			if (resource && resource.scheme === filterByScheme && (!filterByAuthority || resource.authority === filterByAuthority)) {
				return resource;
			}
		}

		return undefined;
	}

	//#endregion

	override dispose(): void {
		super.dispose();

		for (const [, stack] of this.editorGroupScopedNavigationStacks) {
			stack.disposable.dispose();
		}

		for (const [, editors] of this.editorScopedNavigationStacks) {
			for (const [, stack] of editors) {
				stack.disposable.dispose();
			}
		}

		for (const [, listener] of this.editorHistoryListeners) {
			listener.dispose();
		}
	}
}

registerSingleton(IHistoryService, HistoryService, InstantiationType.Eager);

class EditorSelectionState {

	constructor(
		private readonly editorIdentifier: IEditorIdentifier,
		readonly selection: IEditorPaneSelection | undefined,
		private readonly reason: EditorPaneSelectionChangeReason | undefined
	) { }

	justifiesNewNavigationEntry(other: EditorSelectionState): boolean {
		if (this.editorIdentifier.groupId !== other.editorIdentifier.groupId) {
			return true; // different group
		}

		if (!this.editorIdentifier.editor.matches(other.editorIdentifier.editor)) {
			return true; // different editor
		}

		if (!this.selection || !other.selection) {
			return true; // unknown selections
		}

		const result = this.selection.compare(other.selection);

		if (result === EditorPaneSelectionCompareResult.SIMILAR && (other.reason === EditorPaneSelectionChangeReason.NAVIGATION || other.reason === EditorPaneSelectionChangeReason.JUMP)) {
			// let navigation sources win even if the selection is `SIMILAR`
			// (e.g. "Go to definition" should add a history entry)
			return true;
		}

		return result === EditorPaneSelectionCompareResult.DIFFERENT;
	}
}

interface IEditorNavigationStacks extends IDisposable {
	readonly onDidChange: Event<void>;

	canGoForward(filter?: GoFilter): boolean;
	goForward(filter?: GoFilter): Promise<void>;
	canGoBack(filter?: GoFilter): boolean;
	goBack(filter?: GoFilter): Promise<void>;
	goPrevious(filter?: GoFilter): Promise<void>;
	canGoLast(filter?: GoFilter): boolean;
	goLast(filter?: GoFilter): Promise<void>;

	handleActiveEditorChange(editorPane?: IEditorPane): void;
	handleActiveEditorSelectionChange(editorPane: IEditorPaneWithSelection, event: IEditorPaneSelectionChangeEvent): void;

	clear(): void;
	remove(arg1: EditorInput | FileChangesEvent | FileOperationEvent | GroupIdentifier): void;
	move(event: FileOperationEvent): void;
}

class EditorNavigationStacks extends Disposable implements IEditorNavigationStacks {

	private readonly selectionsStack: EditorNavigationStack;
	private readonly editsStack: EditorNavigationStack;
	private readonly navigationsStack: EditorNavigationStack;

	private readonly stacks: EditorNavigationStack[];

	readonly onDidChange: Event<void>;

	constructor(
		private readonly scope: GoScope,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		this.selectionsStack = this._register(this.instantiationService.createInstance(EditorNavigationStack, GoFilter.NONE, this.scope));
		this.editsStack = this._register(this.instantiationService.createInstance(EditorNavigationStack, GoFilter.EDITS, this.scope));
		this.navigationsStack = this._register(this.instantiationService.createInstance(EditorNavigationStack, GoFilter.NAVIGATION, this.scope));

		this.stacks = [
			this.selectionsStack,
			this.editsStack,
			this.navigationsStack
		];

		this.onDidChange = Event.any(
			this.selectionsStack.onDidChange,
			this.editsStack.onDidChange,
			this.navigationsStack.onDidChange
		);
	}

	canGoForward(filter?: GoFilter): boolean {
		return this.getStack(filter).canGoForward();
	}

	goForward(filter?: GoFilter): Promise<void> {
		return this.getStack(filter).goForward();
	}

	canGoBack(filter?: GoFilter): boolean {
		return this.getStack(filter).canGoBack();
	}

	goBack(filter?: GoFilter): Promise<void> {
		return this.getStack(filter).goBack();
	}

	goPrevious(filter?: GoFilter): Promise<void> {
		return this.getStack(filter).goPrevious();
	}

	canGoLast(filter?: GoFilter): boolean {
		return this.getStack(filter).canGoLast();
	}

	goLast(filter?: GoFilter): Promise<void> {
		return this.getStack(filter).goLast();
	}

	private getStack(filter = GoFilter.NONE): EditorNavigationStack {
		switch (filter) {
			case GoFilter.NONE: return this.selectionsStack;
			case GoFilter.EDITS: return this.editsStack;
			case GoFilter.NAVIGATION: return this.navigationsStack;
		}
	}

	handleActiveEditorChange(editorPane?: IEditorPane): void {

		// Always send to selections navigation stack
		this.selectionsStack.notifyNavigation(editorPane);
	}

	handleActiveEditorSelectionChange(editorPane: IEditorPaneWithSelection, event: IEditorPaneSelectionChangeEvent): void {
		const previous = this.selectionsStack.current;

		// Always send to selections navigation stack
		this.selectionsStack.notifyNavigation(editorPane, event);

		// Check for edits
		if (event.reason === EditorPaneSelectionChangeReason.EDIT) {
			this.editsStack.notifyNavigation(editorPane, event);
		}

		// Check for navigations
		//
		// Note: ignore if selections navigation stack is navigating because
		// in that case we do not want to receive repeated entries in
		// the navigation stack.
		else if (
			(event.reason === EditorPaneSelectionChangeReason.NAVIGATION || event.reason === EditorPaneSelectionChangeReason.JUMP) &&
			!this.selectionsStack.isNavigating()
		) {

			// A "JUMP" navigation selection change always has a source and
			// target. As such, we add the previous entry of the selections
			// navigation stack so that our navigation stack receives both
			// entries unless the user is currently navigating.

			if (event.reason === EditorPaneSelectionChangeReason.JUMP && !this.navigationsStack.isNavigating()) {
				if (previous) {
					this.navigationsStack.addOrReplace(previous.groupId, previous.editor, previous.selection);
				}
			}

			this.navigationsStack.notifyNavigation(editorPane, event);
		}
	}

	clear(): void {
		for (const stack of this.stacks) {
			stack.clear();
		}
	}

	remove(arg1: EditorInput | FileChangesEvent | FileOperationEvent | GroupIdentifier): void {
		for (const stack of this.stacks) {
			stack.remove(arg1);
		}
	}

	move(event: FileOperationEvent): void {
		for (const stack of this.stacks) {
			stack.move(event);
		}
	}
}

class NoOpEditorNavigationStacks implements IEditorNavigationStacks {
	onDidChange = Event.None;

	canGoForward(): boolean { return false; }
	async goForward(): Promise<void> { }
	canGoBack(): boolean { return false; }
	async goBack(): Promise<void> { }
	async goPrevious(): Promise<void> { }
	canGoLast(): boolean { return false; }
	async goLast(): Promise<void> { }

	handleActiveEditorChange(): void { }
	handleActiveEditorSelectionChange(): void { }

	clear(): void { }
	remove(): void { }
	move(): void { }

	dispose(): void { }
}

interface IEditorNavigationStackEntry {
	groupId: GroupIdentifier;
	editor: EditorInput | IResourceEditorInput;
	selection?: IEditorPaneSelection;
}

export class EditorNavigationStack extends Disposable {

	private static readonly MAX_STACK_SIZE = 50;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private readonly mapEditorToDisposable = this._register(new DisposableMap<EditorInput, DisposableStore>());
	private readonly mapGroupToDisposable = this._register(new DisposableMap<GroupIdentifier, IDisposable>);

	private readonly editorHelper: EditorHelper;

	private stack: IEditorNavigationStackEntry[] = [];

	private index = -1;
	private previousIndex = -1;

	private navigating = false;

	private currentSelectionState: EditorSelectionState | undefined = undefined;

	get current(): IEditorNavigationStackEntry | undefined {
		return this.stack[this.index];
	}

	private set current(entry: IEditorNavigationStackEntry | undefined) {
		if (entry) {
			this.stack[this.index] = entry;
		}
	}

	constructor(
		private readonly filter: GoFilter,
		private readonly scope: GoScope,
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditorService private readonly editorService: IEditorService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.editorHelper = instantiationService.createInstance(EditorHelper);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.onDidChange(() => this.traceStack()));
		this._register(this.logService.onDidChangeLogLevel(() => this.traceStack()));
		this._register(this.editorGroupService.onDidRemoveGroup(group => {
			this.mapGroupToDisposable.deleteAndDispose(group.id);
		}));
	}

	private traceStack(): void {
		if (this.logService.getLevel() !== LogLevel.Trace) {
			return;
		}

		const entryLabels: string[] = [];
		for (const entry of this.stack) {
			if (typeof entry.selection?.log === 'function') {
				entryLabels.push(`- group: ${entry.groupId}, editor: ${entry.editor.resource?.toString()}, selection: ${entry.selection.log()}`);
			} else {
				entryLabels.push(`- group: ${entry.groupId}, editor: ${entry.editor.resource?.toString()}, selection: <none>`);
			}
		}

		if (entryLabels.length === 0) {
			this.trace(`index: ${this.index}, navigating: ${this.isNavigating()}: <empty>`);
		} else {
			this.trace(`index: ${this.index}, navigating: ${this.isNavigating()}
${entryLabels.join('\n')}
			`);
		}
	}

	private trace(msg: string, editor: EditorInput | IResourceEditorInput | undefined | null = null, event?: IEditorPaneSelectionChangeEvent): void {
		if (this.logService.getLevel() !== LogLevel.Trace) {
			return;
		}

		let filterLabel: string;
		switch (this.filter) {
			case GoFilter.NONE: filterLabel = 'global';
				break;
			case GoFilter.EDITS: filterLabel = 'edits';
				break;
			case GoFilter.NAVIGATION: filterLabel = 'navigation';
				break;
		}

		let scopeLabel: string;
		switch (this.scope) {
			case GoScope.DEFAULT: scopeLabel = 'default';
				break;
			case GoScope.EDITOR_GROUP: scopeLabel = 'editorGroup';
				break;
			case GoScope.EDITOR: scopeLabel = 'editor';
				break;
		}

		if (editor !== null) {
			this.logService.trace(`[History stack ${filterLabel}-${scopeLabel}]: ${msg} (editor: ${editor?.resource?.toString()}, event: ${this.traceEvent(event)})`);
		} else {
			this.logService.trace(`[History stack ${filterLabel}-${scopeLabel}]: ${msg}`);
		}
	}

	private traceEvent(event?: IEditorPaneSelectionChangeEvent): string {
		if (!event) {
			return '<none>';
		}

		switch (event.reason) {
			case EditorPaneSelectionChangeReason.EDIT: return 'edit';
			case EditorPaneSelectionChangeReason.NAVIGATION: return 'navigation';
			case EditorPaneSelectionChangeReason.JUMP: return 'jump';
			case EditorPaneSelectionChangeReason.PROGRAMMATIC: return 'programmatic';
			case EditorPaneSelectionChangeReason.USER: return 'user';
		}
	}

	private registerGroupListeners(groupId: GroupIdentifier): void {
		if (!this.mapGroupToDisposable.has(groupId)) {
			const group = this.editorGroupService.getGroup(groupId);
			if (group) {
				this.mapGroupToDisposable.set(groupId, group.onWillMoveEditor(e => this.onWillMoveEditor(e)));
			}
		}
	}

	private onWillMoveEditor(e: IEditorWillMoveEvent): void {
		this.trace('onWillMoveEditor()', e.editor);

		if (this.scope === GoScope.EDITOR_GROUP) {
			return; // ignore move events if our scope is group based
		}

		for (const entry of this.stack) {
			if (entry.groupId !== e.groupId) {
				continue; // not in the group that reported the event
			}

			if (!this.editorHelper.matchesEditor(e.editor, entry.editor)) {
				continue; // not the editor this event is about
			}

			// Update to target group
			entry.groupId = e.target;
		}
	}

	//#region Stack Mutation

	notifyNavigation(editorPane: IEditorPane | undefined, event?: IEditorPaneSelectionChangeEvent): void {
		this.trace('notifyNavigation()', editorPane?.input, event);

		const isSelectionAwareEditorPane = isEditorPaneWithSelection(editorPane);
		const hasValidEditor = editorPane?.input && !editorPane.input.isDisposed();

		// Treat editor changes that happen as part of stack navigation specially
		// we do not want to add a new stack entry as a matter of navigating the
		// stack but we need to keep our currentEditorSelectionState up to date
		// with the navigtion that occurs.
		if (this.navigating) {
			this.trace(`notifyNavigation() ignoring (navigating)`, editorPane?.input, event);

			if (isSelectionAwareEditorPane && hasValidEditor) {
				this.trace('notifyNavigation() updating current selection state', editorPane?.input, event);

				this.currentSelectionState = new EditorSelectionState({ groupId: editorPane.group.id, editor: editorPane.input }, editorPane.getSelection(), event?.reason);
			} else {
				this.trace('notifyNavigation() dropping current selection state', editorPane?.input, event);

				this.currentSelectionState = undefined; // we navigated to a non-selection aware or disposed editor
			}
		}

		// Normal navigation not part of stack navigation
		else {
			this.trace(`notifyNavigation() not ignoring`, editorPane?.input, event);

			// Navigation inside selection aware editor
			if (isSelectionAwareEditorPane && hasValidEditor) {
				this.onSelectionAwareEditorNavigation(editorPane.group.id, editorPane.input, editorPane.getSelection(), event);
			}

			// Navigation to non-selection aware or disposed editor
			else {
				this.currentSelectionState = undefined; // at this time we have no active selection aware editor

				if (hasValidEditor) {
					this.onNonSelectionAwareEditorNavigation(editorPane.group.id, editorPane.input);
				}
			}
		}
	}

	private onSelectionAwareEditorNavigation(groupId: GroupIdentifier, editor: EditorInput, selection: IEditorPaneSelection | undefined, event?: IEditorPaneSelectionChangeEvent): void {
		if (this.current?.groupId === groupId && !selection && this.editorHelper.matchesEditor(this.current.editor, editor)) {
			return; // do not push same editor input again of same group if we have no valid selection
		}

		this.trace('onSelectionAwareEditorNavigation()', editor, event);

		const stateCandidate = new EditorSelectionState({ groupId, editor }, selection, event?.reason);

		// Add to stack if we dont have a current state or this new state justifies a push
		if (!this.currentSelectionState || this.currentSelectionState.justifiesNewNavigationEntry(stateCandidate)) {
			this.doAdd(groupId, editor, stateCandidate.selection);
		}

		// Otherwise we replace the current stack entry with this one
		else {
			this.doReplace(groupId, editor, stateCandidate.selection);
		}

		// Update our current navigation editor state
		this.currentSelectionState = stateCandidate;
	}

	private onNonSelectionAwareEditorNavigation(groupId: GroupIdentifier, editor: EditorInput): void {
		if (this.current?.groupId === groupId && this.editorHelper.matchesEditor(this.current.editor, editor)) {
			return; // do not push same editor input again of same group
		}

		this.trace('onNonSelectionAwareEditorNavigation()', editor);

		this.doAdd(groupId, editor);
	}

	private doAdd(groupId: GroupIdentifier, editor: EditorInput | IResourceEditorInput, selection?: IEditorPaneSelection): void {
		if (!this.navigating) {
			this.addOrReplace(groupId, editor, selection);
		}
	}

	private doReplace(groupId: GroupIdentifier, editor: EditorInput | IResourceEditorInput, selection?: IEditorPaneSelection): void {
		if (!this.navigating) {
			this.addOrReplace(groupId, editor, selection, true /* force replace */);
		}
	}

	addOrReplace(groupId: GroupIdentifier, editorCandidate: EditorInput | IResourceEditorInput, selection?: IEditorPaneSelection, forceReplace?: boolean): void {

		// Ensure we listen to changes in group
		this.registerGroupListeners(groupId);

		// Check whether to replace an existing entry or not
		let replace = false;
		if (this.current) {
			if (forceReplace) {
				replace = true; // replace if we are forced to
			} else if (this.shouldReplaceStackEntry(this.current, { groupId, editor: editorCandidate, selection })) {
				replace = true; // replace if the group & input is the same and selection indicates as such
			}
		}

		const editor = this.editorHelper.preferResourceEditorInput(editorCandidate);
		if (!editor) {
			return;
		}

		if (replace) {
			this.trace('replace()', editor);
		} else {
			this.trace('add()', editor);
		}

		const newStackEntry: IEditorNavigationStackEntry = { groupId, editor, selection };

		// Replace at current position
		const removedEntries: IEditorNavigationStackEntry[] = [];
		if (replace) {
			if (this.current) {
				removedEntries.push(this.current);
			}
			this.current = newStackEntry;
		}

		// Add to stack at current position
		else {

			// If we are not at the end of history, we remove anything after
			if (this.stack.length > this.index + 1) {
				for (let i = this.index + 1; i < this.stack.length; i++) {
					removedEntries.push(this.stack[i]);
				}

				this.stack = this.stack.slice(0, this.index + 1);
			}

			// Insert entry at index
			this.stack.splice(this.index + 1, 0, newStackEntry);

			// Check for limit
			if (this.stack.length > EditorNavigationStack.MAX_STACK_SIZE) {
				removedEntries.push(this.stack.shift()!); // remove first
				if (this.previousIndex >= 0) {
					this.previousIndex--;
				}
			} else {
				this.setIndex(this.index + 1, true /* skip event, we fire it later */);
			}
		}

		// Clear editor listeners from removed entries
		for (const removedEntry of removedEntries) {
			this.editorHelper.clearOnEditorDispose(removedEntry.editor, this.mapEditorToDisposable);
		}

		// Remove this from the stack unless the stack input is a resource
		// that can easily be restored even when the input gets disposed
		if (isEditorInput(editor)) {
			this.editorHelper.onEditorDispose(editor, () => this.remove(editor), this.mapEditorToDisposable);
		}

		// Event
		this._onDidChange.fire();
	}

	private shouldReplaceStackEntry(entry: IEditorNavigationStackEntry, candidate: IEditorNavigationStackEntry): boolean {
		if (entry.groupId !== candidate.groupId) {
			return false; // different group
		}

		if (!this.editorHelper.matchesEditor(entry.editor, candidate.editor)) {
			return false; // different editor
		}

		if (!entry.selection) {
			return true; // always replace when we have no specific selection yet
		}

		if (!candidate.selection) {
			return false; // otherwise, prefer to keep existing specific selection over new unspecific one
		}

		// Finally, replace when selections are considered identical
		return entry.selection.compare(candidate.selection) === EditorPaneSelectionCompareResult.IDENTICAL;
	}

	move(event: FileOperationEvent): void {
		if (event.isOperation(FileOperation.MOVE)) {
			for (const entry of this.stack) {
				if (this.editorHelper.matchesEditor(event, entry.editor)) {
					entry.editor = { resource: event.target.resource };
				}
			}
		}
	}

	remove(arg1: EditorInput | FileChangesEvent | FileOperationEvent | GroupIdentifier): void {
		const previousStackSize = this.stack.length;

		// Remove all stack entries that match `arg1`
		this.stack = this.stack.filter(entry => {
			const matches = typeof arg1 === 'number' ? entry.groupId === arg1 : this.editorHelper.matchesEditor(arg1, entry.editor);

			// Cleanup any listeners associated with the input when removing
			if (matches) {
				this.editorHelper.clearOnEditorDispose(entry.editor, this.mapEditorToDisposable);
			}

			return !matches;
		});

		if (previousStackSize === this.stack.length) {
			return; // nothing removed
		}

		// Given we just removed entries, we need to make sure
		// to remove entries that are now identical and next
		// to each other to prevent no-op navigations.
		this.flatten();

		// Reset indeces
		this.index = this.stack.length - 1;
		this.previousIndex = -1;

		// Clear group listener
		if (typeof arg1 === 'number') {
			this.mapGroupToDisposable.deleteAndDispose(arg1);
		}

		// Event
		this._onDidChange.fire();
	}

	private flatten(): void {
		const flattenedStack: IEditorNavigationStackEntry[] = [];

		let previousEntry: IEditorNavigationStackEntry | undefined = undefined;
		for (const entry of this.stack) {
			if (previousEntry && this.shouldReplaceStackEntry(entry, previousEntry)) {
				continue; // skip over entry when it is considered the same
			}

			previousEntry = entry;
			flattenedStack.push(entry);
		}

		this.stack = flattenedStack;
	}

	clear(): void {
		this.index = -1;
		this.previousIndex = -1;
		this.stack.splice(0);

		this.mapEditorToDisposable.clearAndDisposeAll();
		this.mapGroupToDisposable.clearAndDisposeAll();
	}

	override dispose(): void {
		this.clear();

		super.dispose();
	}

	//#endregion

	//#region Navigation

	canGoForward(): boolean {
		return this.stack.length > this.index + 1;
	}

	async goForward(): Promise<void> {
		const navigated = await this.maybeGoCurrent();
		if (navigated) {
			return;
		}

		if (!this.canGoForward()) {
			return;
		}

		this.setIndex(this.index + 1);
		return this.navigate();
	}

	canGoBack(): boolean {
		return this.index > 0;
	}

	async goBack(): Promise<void> {
		const navigated = await this.maybeGoCurrent();
		if (navigated) {
			return;
		}

		if (!this.canGoBack()) {
			return;
		}

		this.setIndex(this.index - 1);
		return this.navigate();
	}

	async goPrevious(): Promise<void> {
		const navigated = await this.maybeGoCurrent();
		if (navigated) {
			return;
		}

		// If we never navigated, just go back
		if (this.previousIndex === -1) {
			return this.goBack();
		}

		// Otherwise jump to previous stack entry
		this.setIndex(this.previousIndex);
		return this.navigate();
	}

	canGoLast(): boolean {
		return this.stack.length > 0;
	}

	async goLast(): Promise<void> {
		if (!this.canGoLast()) {
			return;
		}

		this.setIndex(this.stack.length - 1);
		return this.navigate();
	}

	private async maybeGoCurrent(): Promise<boolean> {

		// When this navigation stack works with a specific
		// filter where not every selection change is added
		// to the stack, we want to first reveal the current
		// selection before attempting to navigate in the
		// stack.

		if (this.filter === GoFilter.NONE) {
			return false; // only applies when  we are a filterd stack
		}

		if (this.isCurrentSelectionActive()) {
			return false; // we are at the current navigation stop
		}

		// Go to current selection
		await this.navigate();

		return true;
	}

	private isCurrentSelectionActive(): boolean {
		if (!this.current?.selection) {
			return false; // we need a current selection
		}

		const pane = this.editorService.activeEditorPane;
		if (!isEditorPaneWithSelection(pane)) {
			return false; // we need an active editor pane with selection support
		}

		if (pane.group.id !== this.current.groupId) {
			return false; // we need matching groups
		}

		if (!pane.input || !this.editorHelper.matchesEditor(pane.input, this.current.editor)) {
			return false; // we need matching editors
		}

		const paneSelection = pane.getSelection();
		if (!paneSelection) {
			return false; // we need a selection to compare with
		}

		return paneSelection.compare(this.current.selection) === EditorPaneSelectionCompareResult.IDENTICAL;
	}

	private setIndex(newIndex: number, skipEvent?: boolean): void {
		this.previousIndex = this.index;
		this.index = newIndex;

		// Event
		if (!skipEvent) {
			this._onDidChange.fire();
		}
	}

	private async navigate(): Promise<void> {
		this.navigating = true;

		try {
			if (this.current) {
				await this.doNavigate(this.current);
			}
		} finally {
			this.navigating = false;
		}
	}

	private doNavigate(location: IEditorNavigationStackEntry): Promise<IEditorPane | undefined> {
		let options: IEditorOptions = Object.create(null);

		// Apply selection if any
		if (location.selection) {
			options = location.selection.restore(options);
		}

		if (isEditorInput(location.editor)) {
			return this.editorService.openEditor(location.editor, options, location.groupId);
		}

		return this.editorService.openEditor({
			...location.editor,
			options: {
				...location.editor.options,
				...options
			}
		}, location.groupId);
	}

	isNavigating(): boolean {
		return this.navigating;
	}

	//#endregion
}

class EditorHelper {

	constructor(
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IFileService private readonly fileService: IFileService,
		@IPathService private readonly pathService: IPathService
	) { }

	preferResourceEditorInput(editor: EditorInput): EditorInput | IResourceEditorInput;
	preferResourceEditorInput(editor: IResourceEditorInput): IResourceEditorInput | undefined;
	preferResourceEditorInput(editor: EditorInput | IResourceEditorInput): EditorInput | IResourceEditorInput | undefined;
	preferResourceEditorInput(editor: EditorInput | IResourceEditorInput): EditorInput | IResourceEditorInput | undefined {
		const resource = EditorResourceAccessor.getOriginalUri(editor);

		// For now, only prefer well known schemes that we control to prevent
		// issues such as https://github.com/microsoft/vscode/issues/85204
		// from being used as resource inputs
		// resource inputs survive editor disposal and as such are a lot more
		// durable across editor changes and restarts
		const hasValidResourceEditorInputScheme =
			resource?.scheme === Schemas.file ||
			resource?.scheme === Schemas.vscodeRemote ||
			resource?.scheme === Schemas.vscodeUserData ||
			resource?.scheme === this.pathService.defaultUriScheme;

		// Scheme is valid: prefer the untyped input
		// over the typed input if possible to keep
		// the entry across restarts
		if (hasValidResourceEditorInputScheme) {
			if (isEditorInput(editor)) {
				const untypedInput = editor.toUntyped();
				if (isResourceEditorInput(untypedInput)) {
					return untypedInput;
				}
			}

			return editor;
		}

		// Scheme is invalid: allow the editor input
		// for as long as it is not disposed
		else {
			return isEditorInput(editor) ? editor : undefined;
		}
	}

	matchesEditor(arg1: EditorInput | IResourceEditorInput | FileChangesEvent | FileOperationEvent, inputB: EditorInput | IResourceEditorInput): boolean {
		if (arg1 instanceof FileChangesEvent || arg1 instanceof FileOperationEvent) {
			if (isEditorInput(inputB)) {
				return false; // we only support this for `IResourceEditorInputs` that are file based
			}

			if (arg1 instanceof FileChangesEvent) {
				return arg1.contains(inputB.resource, FileChangeType.DELETED);
			}

			return this.matchesFile(inputB.resource, arg1);
		}

		if (isEditorInput(arg1)) {
			if (isEditorInput(inputB)) {
				return arg1.matches(inputB);
			}

			return this.matchesFile(inputB.resource, arg1);
		}

		if (isEditorInput(inputB)) {
			return this.matchesFile(arg1.resource, inputB);
		}

		return arg1 && inputB && this.uriIdentityService.extUri.isEqual(arg1.resource, inputB.resource);
	}

	matchesFile(resource: URI, arg2: EditorInput | IResourceEditorInput | FileChangesEvent | FileOperationEvent): boolean {
		if (arg2 instanceof FileChangesEvent) {
			return arg2.contains(resource, FileChangeType.DELETED);
		}

		if (arg2 instanceof FileOperationEvent) {
			return this.uriIdentityService.extUri.isEqualOrParent(resource, arg2.resource);
		}

		if (isEditorInput(arg2)) {
			const inputResource = arg2.resource;
			if (!inputResource) {
				return false;
			}

			if (this.lifecycleService.phase >= LifecyclePhase.Restored && !this.fileService.hasProvider(inputResource)) {
				return false; // make sure to only check this when workbench has restored (for https://github.com/microsoft/vscode/issues/48275)
			}

			return this.uriIdentityService.extUri.isEqual(inputResource, resource);
		}

		return this.uriIdentityService.extUri.isEqual(arg2?.resource, resource);
	}

	matchesEditorIdentifier(identifier: IEditorIdentifier, editorPane?: IEditorPane): boolean {
		if (!editorPane?.group) {
			return false;
		}

		if (identifier.groupId !== editorPane.group.id) {
			return false;
		}

		return editorPane.input ? identifier.editor.matches(editorPane.input) : false;
	}

	onEditorDispose(editor: EditorInput, listener: Function, mapEditorToDispose: DisposableMap<EditorInput, DisposableStore>): void {
		const toDispose = Event.once(editor.onWillDispose)(() => listener());

		let disposables = mapEditorToDispose.get(editor);
		if (!disposables) {
			disposables = new DisposableStore();
			mapEditorToDispose.set(editor, disposables);
		}

		disposables.add(toDispose);
	}

	clearOnEditorDispose(editor: EditorInput | IResourceEditorInput | FileChangesEvent | FileOperationEvent, mapEditorToDispose: DisposableMap<EditorInput, DisposableStore>): void {
		if (!isEditorInput(editor)) {
			return; // only supported when passing in an actual editor input
		}

		mapEditorToDispose.deleteAndDispose(editor);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/history/common/history.ts]---
Location: vscode-main/src/vs/workbench/services/history/common/history.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { GroupIdentifier } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { URI } from '../../../../base/common/uri.js';

export const IHistoryService = createDecorator<IHistoryService>('historyService');

/**
 * Limit editor navigation to certain kinds.
 */
export const enum GoFilter {

	/**
	 * Navigate between editor navigation history
	 * entries from any kind of navigation source.
	 */
	NONE,

	/**
	 * Only navigate between editor navigation history
	 * entries that were resulting from edits.
	 */
	EDITS,

	/**
	 * Only navigate between editor navigation history
	 * entries that were resulting from navigations, such
	 * as "Go to definition".
	 */
	NAVIGATION
}

/**
 * Limit editor navigation to certain scopes.
 */
export const enum GoScope {

	/**
	 * Navigate across all editors and editor groups.
	 */
	DEFAULT,

	/**
	 * Navigate only in editors of the active editor group.
	 */
	EDITOR_GROUP,

	/**
	 * Navigate only in the active editor.
	 */
	EDITOR
}

export interface IHistoryService {

	readonly _serviceBrand: undefined;

	/**
	 * Navigate forwards in editor navigation history.
	 */
	goForward(filter?: GoFilter): Promise<void>;

	/**
	 * Navigate backwards in editor navigation history.
	 */
	goBack(filter?: GoFilter): Promise<void>;

	/**
	 * Navigate between the current editor navigtion history entry
	 * and the previous one that was navigated to. This commands is
	 * like a toggle for `forward` and `back` to jump between 2 points
	 * in editor navigation history.
	 */
	goPrevious(filter?: GoFilter): Promise<void>;

	/**
	 * Navigate to the last entry in editor navigation history.
	 */
	goLast(filter?: GoFilter): Promise<void>;

	/**
	 * Re-opens the last closed editor if any.
	 */
	reopenLastClosedEditor(): Promise<void>;

	/**
	 * Get the entire history of editors that were opened.
	 */
	getHistory(): readonly (EditorInput | IResourceEditorInput)[];

	/**
	 * Removes an entry from history.
	 */
	removeFromHistory(input: EditorInput | IResourceEditorInput): void;

	/**
	 * Looking at the editor history, returns the workspace root of the last file that was
	 * inside the workspace and part of the editor history.
	 *
	 * @param schemeFilter filter to restrict roots by scheme.
	 */
	getLastActiveWorkspaceRoot(schemeFilter?: string, authorityFilter?: string): URI | undefined;

	/**
	 * Looking at the editor history, returns the resource of the last file that was opened.
	 *
	 * @param schemeFilter filter to restrict roots by scheme.
	 */
	getLastActiveFile(schemeFilter: string, authorityFilter?: string): URI | undefined;

	/**
	 * Opens the next used editor if any.
	 *
	 * @param group optional indicator to scope to a specific group.
	 */
	openNextRecentlyUsedEditor(group?: GroupIdentifier): Promise<void>;

	/**
	 * Opens the previously used editor if any.
	 *
	 * @param group optional indicator to scope to a specific group.
	 */
	openPreviouslyUsedEditor(group?: GroupIdentifier): Promise<void>;

	/**
	 * Clears all history.
	 */
	clear(): void;

	/**
	 * Clear list of recently opened editors.
	 */
	clearRecentlyOpened(): void;
}
```

--------------------------------------------------------------------------------

````
