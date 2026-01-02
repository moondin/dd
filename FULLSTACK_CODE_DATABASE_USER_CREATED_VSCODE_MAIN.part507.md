---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 507
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 507 of 552)

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

---[FILE: src/vs/workbench/services/extensionManagement/test/browser/extensionEnablementService.test.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/test/browser/extensionEnablementService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as sinon from 'sinon';
import { IExtensionManagementService, DidUninstallExtensionEvent, ILocalExtension, InstallExtensionEvent, InstallExtensionResult, UninstallExtensionEvent, DidUpdateExtensionMetadata, InstallOperation, IAllowedExtensionsService, AllowedExtensionsConfigKey, IExtensionsControlManifest } from '../../../../../platform/extensionManagement/common/extensionManagement.js';
import { EnablementState, IExtensionManagementServerService, IExtensionManagementServer, IWorkbenchExtensionManagementService, ExtensionInstallLocation, IProfileAwareExtensionManagementService, DidChangeProfileEvent } from '../../common/extensionManagement.js';
import { ExtensionEnablementService } from '../../browser/extensionEnablementService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IWorkspace, IWorkspaceContextService, WorkbenchState } from '../../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEnvironmentService } from '../../../environment/common/environmentService.js';
import { IStorageService, InMemoryStorageService } from '../../../../../platform/storage/common/storage.js';
import { IExtensionContributions, ExtensionType, IExtension, IExtensionManifest, IExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { isUndefinedOrNull } from '../../../../../base/common/types.js';
import { areSameExtensions } from '../../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { URI } from '../../../../../base/common/uri.js';
import { Schemas } from '../../../../../base/common/network.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { productService, TestLifecycleService } from '../../../../test/browser/workbenchTestServices.js';
import { GlobalExtensionEnablementService } from '../../../../../platform/extensionManagement/common/extensionEnablementService.js';
import { IUserDataSyncAccountService, UserDataSyncAccountService } from '../../../../../platform/userDataSync/common/userDataSyncAccount.js';
import { IUserDataSyncEnablementService } from '../../../../../platform/userDataSync/common/userDataSync.js';
import { ILifecycleService } from '../../../lifecycle/common/lifecycle.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { TestNotificationService } from '../../../../../platform/notification/test/common/testNotificationService.js';
import { IHostService } from '../../../host/browser/host.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { IExtensionBisectService } from '../../browser/extensionBisect.js';
import { IWorkspaceTrustManagementService, IWorkspaceTrustRequestService, WorkspaceTrustRequestOptions } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { ExtensionManifestPropertiesService, IExtensionManifestPropertiesService } from '../../../extensions/common/extensionManifestPropertiesService.js';
import { TestContextService, TestProductService, TestWorkspaceTrustEnablementService, TestWorkspaceTrustManagementService } from '../../../../test/common/workbenchTestServices.js';
import { TestWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { ExtensionManagementService } from '../../common/extensionManagementService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { AllowedExtensionsService } from '../../../../../platform/extensionManagement/common/allowedExtensionsService.js';
import { IStringDictionary } from '../../../../../base/common/collections.js';

function createStorageService(instantiationService: TestInstantiationService, disposableStore: DisposableStore): IStorageService {
	let service = instantiationService.get(IStorageService);
	if (!service) {
		let workspaceContextService = instantiationService.get(IWorkspaceContextService);
		if (!workspaceContextService) {
			workspaceContextService = instantiationService.stub(IWorkspaceContextService, <IWorkspaceContextService>{
				getWorkbenchState: () => WorkbenchState.FOLDER,
				getWorkspace: () => TestWorkspace as IWorkspace
			});
		}
		service = instantiationService.stub(IStorageService, disposableStore.add(new InMemoryStorageService()));
	}
	return service;
}

export class TestExtensionEnablementService extends ExtensionEnablementService {
	constructor(instantiationService: TestInstantiationService) {
		const disposables = new DisposableStore();
		const storageService = createStorageService(instantiationService, disposables);
		const extensionManagementServerService = instantiationService.get(IExtensionManagementServerService) ||
			instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService({
				id: 'local',
				label: 'local',
				extensionManagementService: <IProfileAwareExtensionManagementService>{
					onInstallExtension: disposables.add(new Emitter<InstallExtensionEvent>()).event,
					onDidInstallExtensions: disposables.add(new Emitter<readonly InstallExtensionResult[]>()).event,
					onUninstallExtension: disposables.add(new Emitter<UninstallExtensionEvent>()).event,
					onDidUninstallExtension: disposables.add(new Emitter<DidUninstallExtensionEvent>()).event,
					onDidChangeProfile: disposables.add(new Emitter<DidChangeProfileEvent>()).event,
					onDidUpdateExtensionMetadata: disposables.add(new Emitter<DidUpdateExtensionMetadata>()).event,
					onProfileAwareDidInstallExtensions: Event.None,
				},
			}, null, null));
		const extensionManagementService = disposables.add(instantiationService.createInstance(ExtensionManagementService));
		const workbenchExtensionManagementService = instantiationService.get(IWorkbenchExtensionManagementService) || instantiationService.stub(IWorkbenchExtensionManagementService, extensionManagementService);
		const workspaceTrustManagementService = instantiationService.get(IWorkspaceTrustManagementService) || instantiationService.stub(IWorkspaceTrustManagementService, disposables.add(new TestWorkspaceTrustManagementService()));
		super(
			storageService,
			disposables.add(new GlobalExtensionEnablementService(storageService, extensionManagementService)),
			instantiationService.get(IWorkspaceContextService) || new TestContextService(),
			instantiationService.get(IWorkbenchEnvironmentService) || instantiationService.stub(IWorkbenchEnvironmentService, {}),
			workbenchExtensionManagementService,
			instantiationService.get(IConfigurationService),
			extensionManagementServerService,
			instantiationService.get(IUserDataSyncEnablementService) || instantiationService.stub(IUserDataSyncEnablementService, <Partial<IUserDataSyncEnablementService>>{ isEnabled() { return false; } }),
			instantiationService.get(IUserDataSyncAccountService) || instantiationService.stub(IUserDataSyncAccountService, UserDataSyncAccountService),
			instantiationService.get(ILifecycleService) || instantiationService.stub(ILifecycleService, disposables.add(new TestLifecycleService())),
			instantiationService.get(INotificationService) || instantiationService.stub(INotificationService, new TestNotificationService()),
			instantiationService.get(IHostService),
			new class extends mock<IExtensionBisectService>() { override isDisabledByBisect() { return false; } },
			instantiationService.stub(IAllowedExtensionsService, disposables.add(new AllowedExtensionsService(instantiationService.get(IProductService), instantiationService.get(IConfigurationService)))),
			workspaceTrustManagementService,
			new class extends mock<IWorkspaceTrustRequestService>() { override requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Promise<boolean> { return Promise.resolve(true); } },
			instantiationService.get(IExtensionManifestPropertiesService) || instantiationService.stub(IExtensionManifestPropertiesService, disposables.add(new ExtensionManifestPropertiesService(TestProductService, new TestConfigurationService(), new TestWorkspaceTrustEnablementService(), new NullLogService()))),
			instantiationService,
			new NullLogService(),
			productService
		);
		this._register(disposables);
	}

	public async waitUntilInitialized(): Promise<void> {
		await this.extensionsManager.whenInitialized();
	}

	public reset(): void {
		let extensions = this.globalExtensionEnablementService.getDisabledExtensions();
		for (const e of this._getWorkspaceDisabledExtensions()) {
			if (!extensions.some(r => areSameExtensions(r, e))) {
				extensions.push(e);
			}
		}
		const workspaceEnabledExtensions = this._getWorkspaceEnabledExtensions();
		if (workspaceEnabledExtensions.length) {
			extensions = extensions.filter(r => !workspaceEnabledExtensions.some(e => areSameExtensions(e, r)));
		}
		extensions.forEach(d => this.setEnablement([aLocalExtension(d.id)], EnablementState.EnabledGlobally));
	}
}

suite('ExtensionEnablementService Test', () => {

	const disposableStore = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let testObject: TestExtensionEnablementService;

	const didInstallEvent = new Emitter<readonly InstallExtensionResult[]>();
	const didUninstallEvent = new Emitter<DidUninstallExtensionEvent>();
	const didChangeProfileExtensionsEvent = new Emitter<DidChangeProfileEvent>();
	const installed: ILocalExtension[] = [];
	const malicious: IExtensionIdentifier[] = [];

	setup(() => {
		installed.splice(0, installed.length);
		instantiationService = disposableStore.add(new TestInstantiationService());
		instantiationService.stub(IFileService, disposableStore.add(new FileService(new NullLogService())));
		instantiationService.stub(IProductService, TestProductService);
		const testConfigurationService = new TestConfigurationService();
		testConfigurationService.setUserConfiguration(AllowedExtensionsConfigKey, { '*': true, 'unallowed': false });
		instantiationService.stub(IConfigurationService, testConfigurationService);
		instantiationService.stub(IWorkspaceContextService, new TestContextService());
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService({
			id: 'local',
			label: 'local',
			extensionManagementService: <IProfileAwareExtensionManagementService>{
				onDidInstallExtensions: didInstallEvent.event,
				onDidUninstallExtension: didUninstallEvent.event,
				onDidChangeProfile: didChangeProfileExtensionsEvent.event,
				onProfileAwareDidInstallExtensions: Event.None,
				getInstalled: () => Promise.resolve(installed),
				async getExtensionsControlManifest(): Promise<IExtensionsControlManifest> {
					return {
						malicious: malicious.map(e => ({ extensionOrPublisher: e })),
						deprecated: {},
						search: []
					};
				}
			},
		}, null, null));
		instantiationService.stub(ILogService, NullLogService);
		instantiationService.stub(IWorkbenchExtensionManagementService, disposableStore.add(instantiationService.createInstance(ExtensionManagementService)));
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
	});

	test('test disable an extension globally', async () => {
		const extension = aLocalExtension('pub.a');
		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);
		assert.ok(!testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.DisabledGlobally);
	});

	test('test disable an extension globally should return truthy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(value => assert.ok(value));
	});

	test('test disable an extension globally triggers the change event', async () => {
		const target = sinon.spy();
		disposableStore.add(testObject.onEnablementChanged(target));
		await testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally);
		assert.ok(target.calledOnce);
		assert.deepStrictEqual((<IExtension>target.args[0][0][0]).identifier, { id: 'pub.a' });
	});

	test('test disable an extension globally again should return a falsy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally))
			.then(value => assert.ok(!value[0]));
	});

	test('test state of globally disabled extension', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.DisabledGlobally));
	});

	test('test state of globally enabled extension', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledGlobally))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.EnabledGlobally));
	});

	test('test disable an extension for workspace', async () => {
		const extension = aLocalExtension('pub.a');
		await testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		assert.ok(!testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.DisabledWorkspace);
	});

	test('test disable an extension for workspace returns a truthy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(value => assert.ok(value));
	});

	test('test disable an extension for workspace again should return a falsy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace))
			.then(value => assert.ok(!value[0]));
	});

	test('test state of workspace disabled extension', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.DisabledWorkspace));
	});

	test('test state of workspace and globally disabled extension', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.DisabledWorkspace));
	});

	test('test state of workspace enabled extension', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledWorkspace))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.EnabledWorkspace));
	});

	test('test state of globally disabled and workspace enabled extension', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace))
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledWorkspace))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.EnabledWorkspace));
	});

	test('test state of an extension when disabled for workspace from workspace enabled', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledWorkspace))
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.DisabledWorkspace));
	});

	test('test state of an extension when disabled globally from workspace enabled', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledWorkspace))
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.DisabledGlobally));
	});

	test('test state of an extension when disabled globally from workspace disabled', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.DisabledGlobally));
	});

	test('test state of an extension when enabled globally from workspace enabled', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledWorkspace))
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledGlobally))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.EnabledGlobally));
	});

	test('test state of an extension when enabled globally from workspace disabled', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledGlobally))
			.then(() => assert.strictEqual(testObject.getEnablementState(aLocalExtension('pub.a')), EnablementState.EnabledGlobally));
	});

	test('test disable an extension for workspace and then globally', async () => {
		const extension = aLocalExtension('pub.a');
		await testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);
		assert.ok(!testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.DisabledGlobally);
	});

	test('test disable an extension for workspace and then globally return a truthy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally))
			.then(value => assert.ok(value));
	});

	test('test disable an extension for workspace and then globally trigger the change event', () => {
		const target = sinon.spy();
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => disposableStore.add(testObject.onEnablementChanged(target)))
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally))
			.then(() => {
				assert.ok(target.calledOnce);
				assert.deepStrictEqual((<IExtension>target.args[0][0][0]).identifier, { id: 'pub.a' });
			});
	});

	test('test disable an extension globally and then for workspace', async () => {
		const extension = aLocalExtension('pub.a');
		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);
		await testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		assert.ok(!testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.DisabledWorkspace);
	});

	test('test disable an extension globally and then for workspace return a truthy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace))
			.then(value => assert.ok(value));
	});

	test('test disable an extension globally and then for workspace triggers the change event', () => {
		const target = sinon.spy();
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => disposableStore.add(testObject.onEnablementChanged(target)))
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace))
			.then(() => {
				assert.ok(target.calledOnce);
				assert.deepStrictEqual((<IExtension>target.args[0][0][0]).identifier, { id: 'pub.a' });
			});
	});

	test('test disable an extension for workspace when there is no workspace throws error', () => {
		instantiationService.stub(IWorkspaceContextService, 'getWorkbenchState', WorkbenchState.EMPTY);
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => assert.fail('should throw an error'), error => assert.ok(error));
	});

	test('test enable an extension globally', async () => {
		const extension = aLocalExtension('pub.a');
		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);
		await testObject.setEnablement([extension], EnablementState.EnabledGlobally);
		assert.ok(testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test enable an extension globally return truthy promise', async () => {
		await testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally);
		const value = await testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledGlobally);
		assert.strictEqual(value[0], true);
	});

	test('test enable an extension globally triggers change event', () => {
		const target = sinon.spy();
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => disposableStore.add(testObject.onEnablementChanged(target)))
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledGlobally))
			.then(() => {
				assert.ok(target.calledOnce);
				assert.deepStrictEqual((<IExtension>target.args[0][0][0]).identifier, { id: 'pub.a' });
			});
	});

	test('test enable an extension globally when already enabled return falsy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledGlobally)
			.then(value => assert.ok(!value[0]));
	});

	test('test enable an extension for workspace', async () => {
		const extension = aLocalExtension('pub.a');
		await testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		await testObject.setEnablement([extension], EnablementState.EnabledWorkspace);
		assert.ok(testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledWorkspace);
	});

	test('test enable an extension for workspace return truthy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledWorkspace))
			.then(value => assert.ok(value));
	});

	test('test enable an extension for workspace triggers change event', () => {
		const target = sinon.spy();
		return testObject.setEnablement([aLocalExtension('pub.b')], EnablementState.DisabledWorkspace)
			.then(() => disposableStore.add(testObject.onEnablementChanged(target)))
			.then(() => testObject.setEnablement([aLocalExtension('pub.b')], EnablementState.EnabledWorkspace))
			.then(() => {
				assert.ok(target.calledOnce);
				assert.deepStrictEqual((<IExtension>target.args[0][0][0]).identifier, { id: 'pub.b' });
			});
	});

	test('test enable an extension for workspace when already enabled return truthy promise', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.EnabledWorkspace)
			.then(value => assert.ok(value));
	});

	test('test enable an extension for workspace when disabled in workspace and gloablly', async () => {
		const extension = aLocalExtension('pub.a');
		await testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);
		await testObject.setEnablement([extension], EnablementState.EnabledWorkspace);
		assert.ok(testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledWorkspace);
	});

	test('test enable an extension globally when disabled in workspace and gloablly', async () => {
		const extension = aLocalExtension('pub.a');
		await testObject.setEnablement([extension], EnablementState.EnabledWorkspace);
		await testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);
		await testObject.setEnablement([extension], EnablementState.EnabledGlobally);
		assert.ok(testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test enable an extension also enables dependencies', async () => {
		installed.push(...[aLocalExtension2('pub.a', { extensionDependencies: ['pub.b'] }), aLocalExtension('pub.b')]);
		const target = installed[0];
		const dep = installed[1];
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();
		await testObject.setEnablement([dep, target], EnablementState.DisabledGlobally);
		await testObject.setEnablement([target], EnablementState.EnabledGlobally);
		assert.ok(testObject.isEnabled(target));
		assert.ok(testObject.isEnabled(dep));
		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledGlobally);
		assert.strictEqual(testObject.getEnablementState(dep), EnablementState.EnabledGlobally);
	});

	test('test enable an extension in workspace with a dependency extension that has auth providers', async () => {
		installed.push(...[aLocalExtension2('pub.a', { extensionDependencies: ['pub.b'] }), aLocalExtension('pub.b', { authentication: [{ id: 'a', label: 'a' }] })]);
		const target = installed[0];
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();
		await testObject.setEnablement([target], EnablementState.DisabledWorkspace);
		await testObject.setEnablement([target], EnablementState.EnabledWorkspace);
		assert.ok(testObject.isEnabled(target));
		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledWorkspace);
	});

	test('test enable an extension with a dependency extension that cannot be enabled', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(anExtensionManagementServer('vscode-local', instantiationService), anExtensionManagementServer('vscode-remote', instantiationService), null));
		const localWorkspaceDepExtension = aLocalExtension2('pub.b', { extensionKind: ['workspace'] }, { location: URI.file(`pub.b`) });
		const remoteWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['workspace'], extensionDependencies: ['pub.b'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		const remoteWorkspaceDepExtension = aLocalExtension2('pub.b', { extensionKind: ['workspace'] }, { location: URI.file(`pub.b`).with({ scheme: Schemas.vscodeRemote }) });
		installed.push(localWorkspaceDepExtension, remoteWorkspaceExtension, remoteWorkspaceDepExtension);

		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		await testObject.setEnablement([remoteWorkspaceExtension], EnablementState.DisabledGlobally);
		await testObject.setEnablement([remoteWorkspaceExtension], EnablementState.EnabledGlobally);
		assert.ok(testObject.isEnabled(remoteWorkspaceExtension));
		assert.strictEqual(testObject.getEnablementState(remoteWorkspaceExtension), EnablementState.EnabledGlobally);
	});

	test('test enable an extension also enables packed extensions', async () => {
		installed.push(...[aLocalExtension2('pub.a', { extensionPack: ['pub.b'] }), aLocalExtension('pub.b')]);
		const target = installed[0];
		const dep = installed[1];
		await testObject.setEnablement([dep, target], EnablementState.DisabledGlobally);
		await testObject.setEnablement([target], EnablementState.EnabledGlobally);
		assert.ok(testObject.isEnabled(target));
		assert.ok(testObject.isEnabled(dep));
		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledGlobally);
		assert.strictEqual(testObject.getEnablementState(dep), EnablementState.EnabledGlobally);
	});

	test('test remove an extension from disablement list when uninstalled', async () => {
		const extension = aLocalExtension('pub.a');
		installed.push(extension);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		await testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);
		didUninstallEvent.fire({ identifier: { id: 'pub.a' }, profileLocation: null! });

		assert.ok(testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test isEnabled return false extension is disabled globally', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledGlobally)
			.then(() => assert.ok(!testObject.isEnabled(aLocalExtension('pub.a'))));
	});

	test('test isEnabled return false extension is disabled in workspace', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => assert.ok(!testObject.isEnabled(aLocalExtension('pub.a'))));
	});

	test('test isEnabled return true extension is not disabled', () => {
		return testObject.setEnablement([aLocalExtension('pub.a')], EnablementState.DisabledWorkspace)
			.then(() => testObject.setEnablement([aLocalExtension('pub.c')], EnablementState.DisabledGlobally))
			.then(() => assert.ok(testObject.isEnabled(aLocalExtension('pub.b'))));
	});

	test('test canChangeEnablement return false for language packs', () => {
		assert.strictEqual(testObject.canChangeEnablement(aLocalExtension('pub.a', { localizations: [{ languageId: 'gr', translations: [{ id: 'vscode', path: 'path' }] }] })), false);
	});

	test('test canChangeEnablement return true for auth extension', () => {
		assert.strictEqual(testObject.canChangeEnablement(aLocalExtension('pub.a', { authentication: [{ id: 'a', label: 'a' }] })), true);
	});

	test('test canChangeEnablement return true for auth extension when user data sync account does not depends on it', () => {
		instantiationService.stub(IUserDataSyncAccountService, <Partial<IUserDataSyncAccountService>>{
			account: { authenticationProviderId: 'b' }
		});
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(aLocalExtension('pub.a', { authentication: [{ id: 'a', label: 'a' }] })), true);
	});

	test('test canChangeEnablement return true for auth extension when user data sync account depends on it but auto sync is off', () => {
		instantiationService.stub(IUserDataSyncAccountService, <Partial<IUserDataSyncAccountService>>{
			account: { authenticationProviderId: 'a' }
		});
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(aLocalExtension('pub.a', { authentication: [{ id: 'a', label: 'a' }] })), true);
	});

	test('test canChangeEnablement return false for auth extension and user data sync account depends on it and auto sync is on', () => {
		instantiationService.stub(IUserDataSyncEnablementService, <Partial<IUserDataSyncEnablementService>>{ isEnabled() { return true; } });
		instantiationService.stub(IUserDataSyncAccountService, <Partial<IUserDataSyncAccountService>>{
			account: { authenticationProviderId: 'a' }
		});
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(aLocalExtension('pub.a', { authentication: [{ id: 'a', label: 'a' }] })), false);
	});

	test('test canChangeWorkspaceEnablement return true', () => {
		assert.strictEqual(testObject.canChangeWorkspaceEnablement(aLocalExtension('pub.a')), true);
	});

	test('test canChangeWorkspaceEnablement return false if there is no workspace', () => {
		instantiationService.stub(IWorkspaceContextService, 'getWorkbenchState', WorkbenchState.EMPTY);
		assert.strictEqual(testObject.canChangeWorkspaceEnablement(aLocalExtension('pub.a')), false);
	});

	test('test canChangeWorkspaceEnablement return false for auth extension', () => {
		assert.strictEqual(testObject.canChangeWorkspaceEnablement(aLocalExtension('pub.a', { authentication: [{ id: 'a', label: 'a' }] })), false);
	});

	test('test canChangeEnablement return false when extensions are disabled in environment', () => {
		instantiationService.stub(IWorkbenchEnvironmentService, { disableExtensions: true });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(aLocalExtension('pub.a')), false);
	});

	test('test canChangeEnablement return false when the extension is disabled in environment', () => {
		instantiationService.stub(IWorkbenchEnvironmentService, { disableExtensions: ['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(aLocalExtension('pub.a')), false);
	});

	test('test canChangeEnablement return true for system extensions when extensions are disabled in environment', () => {
		instantiationService.stub(IWorkbenchEnvironmentService, { disableExtensions: true });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		const extension = aLocalExtension('pub.a', undefined, ExtensionType.System);
		assert.strictEqual(testObject.canChangeEnablement(extension), true);
	});

	test('test canChangeEnablement return false for system extension when extension is disabled in environment', () => {
		instantiationService.stub(IWorkbenchEnvironmentService, { disableExtensions: ['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		const extension = aLocalExtension('pub.a', undefined, ExtensionType.System);
		assert.ok(!testObject.canChangeEnablement(extension));
	});

	test('test extension is disabled when disabled in environment', async () => {
		const extension = aLocalExtension('pub.a');
		installed.push(extension);

		instantiationService.stub(IWorkbenchEnvironmentService, { disableExtensions: ['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		assert.ok(!testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.DisabledByEnvironment);
	});

	test('test extension is enabled globally when enabled in environment', async () => {
		const extension = aLocalExtension('pub.a');
		installed.push(extension);

		instantiationService.stub(IWorkbenchEnvironmentService, { enableExtensions: <readonly string[]>['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		assert.ok(testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test extension is enabled workspace when enabled in environment', async () => {
		const extension = aLocalExtension('pub.a');
		installed.push(extension);

		await testObject.setEnablement([extension], EnablementState.EnabledWorkspace);
		instantiationService.stub(IWorkbenchEnvironmentService, { enableExtensions: <readonly string[]>['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		assert.ok(testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.EnabledWorkspace);
	});

	test('test extension is enabled by environment when disabled globally', async () => {
		const extension = aLocalExtension('pub.a');
		installed.push(extension);

		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);
		instantiationService.stub(IWorkbenchEnvironmentService, { enableExtensions: <readonly string[]>['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		assert.ok(testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.EnabledByEnvironment);
	});

	test('test extension is enabled by environment when disabled workspace', async () => {
		const extension = aLocalExtension('pub.a');
		installed.push(extension);

		await testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		instantiationService.stub(IWorkbenchEnvironmentService, { enableExtensions: <readonly string[]>['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		assert.ok(testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.EnabledByEnvironment);
	});

	test('test extension is disabled by environment when also enabled in environment', async () => {
		const extension = aLocalExtension('pub.a');
		installed.push(extension);

		testObject.setEnablement([extension], EnablementState.DisabledWorkspace);
		instantiationService.stub(IWorkbenchEnvironmentService, { disableExtensions: true, enableExtensions: <readonly string[]>['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		assert.ok(!testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.DisabledByEnvironment);
	});

	test('test canChangeEnablement return false when the extension is enabled in environment', () => {
		instantiationService.stub(IWorkbenchEnvironmentService, { enableExtensions: <readonly string[]>['pub.a'] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(aLocalExtension('pub.a')), false);
	});

	test('test extension does not support vitrual workspace is not enabled in virtual workspace', async () => {
		const extension = aLocalExtension2('pub.a', { capabilities: { virtualWorkspaces: false } });
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA').with(({ scheme: 'virtual' })) }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(!testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.DisabledByVirtualWorkspace);
	});

	test('test web extension from web extension management server and does not support vitrual workspace is enabled in virtual workspace', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(null, anExtensionManagementServer('vscode-remote', instantiationService), anExtensionManagementServer('web', instantiationService)));
		const extension = aLocalExtension2('pub.a', { capabilities: { virtualWorkspaces: false }, browser: 'browser.js' }, { location: URI.file(`pub.a`).with({ scheme: 'web' }) });
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA').with(({ scheme: 'virtual' })) }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test web extension from remote extension management server and does not support vitrual workspace is disabled in virtual workspace', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(null, anExtensionManagementServer('vscode-remote', instantiationService), anExtensionManagementServer('web', instantiationService)));
		const extension = aLocalExtension2('pub.a', { capabilities: { virtualWorkspaces: false }, browser: 'browser.js' }, { location: URI.file(`pub.a`).with({ scheme: 'vscode-remote' }) });
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA').with(({ scheme: 'virtual' })) }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(!testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.DisabledByVirtualWorkspace);
	});

	test('test enable a remote workspace extension and local ui extension that is a dependency of remote', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(anExtensionManagementServer('vscode-local', instantiationService), anExtensionManagementServer('vscode-remote', instantiationService), null));
		const localUIExtension = aLocalExtension2('pub.a', { main: 'main.js', extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		const remoteUIExtension = aLocalExtension2('pub.a', { main: 'main.js', extensionKind: ['ui'] }, { location: URI.file(`pub.a`).with({ scheme: 'vscode-remote' }) });
		const target = aLocalExtension2('pub.b', { main: 'main.js', extensionDependencies: ['pub.a'] }, { location: URI.file(`pub.b`).with({ scheme: 'vscode-remote' }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		installed.push(localUIExtension, remoteUIExtension, target);
		await testObject.setEnablement([target, localUIExtension], EnablementState.DisabledGlobally);
		await testObject.setEnablement([target, localUIExtension], EnablementState.EnabledGlobally);
		assert.ok(testObject.isEnabled(target));
		assert.ok(testObject.isEnabled(localUIExtension));
		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledGlobally);
		assert.strictEqual(testObject.getEnablementState(localUIExtension), EnablementState.EnabledGlobally);
	});

	test('test enable a remote workspace extension also enables its dependency in local', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(anExtensionManagementServer('vscode-local', instantiationService), anExtensionManagementServer('vscode-remote', instantiationService), null));
		const localUIExtension = aLocalExtension2('pub.a', { main: 'main.js', extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		const remoteUIExtension = aLocalExtension2('pub.a', { main: 'main.js', extensionKind: ['ui'] }, { location: URI.file(`pub.a`).with({ scheme: 'vscode-remote' }) });
		const target = aLocalExtension2('pub.b', { main: 'main.js', extensionDependencies: ['pub.a'] }, { location: URI.file(`pub.b`).with({ scheme: 'vscode-remote' }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		installed.push(localUIExtension, remoteUIExtension, target);
		await testObject.setEnablement([target, localUIExtension], EnablementState.DisabledGlobally);
		await testObject.setEnablement([target], EnablementState.EnabledGlobally);
		assert.ok(testObject.isEnabled(target));
		assert.ok(testObject.isEnabled(localUIExtension));
		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledGlobally);
		assert.strictEqual(testObject.getEnablementState(localUIExtension), EnablementState.EnabledGlobally);
	});

	test('test canChangeEnablement return false when extension is disabled in virtual workspace', () => {
		const extension = aLocalExtension2('pub.a', { capabilities: { virtualWorkspaces: false } });
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA').with(({ scheme: 'virtual' })) }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(!testObject.canChangeEnablement(extension));
	});

	test('test extension does not support vitrual workspace is enabled in normal workspace', async () => {
		const extension = aLocalExtension2('pub.a', { capabilities: { virtualWorkspaces: false } });
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA') }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test extension supports virtual workspace is enabled in virtual workspace', async () => {
		const extension = aLocalExtension2('pub.a', { capabilities: { virtualWorkspaces: true } });
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA').with(({ scheme: 'virtual' })) }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test extension does not support untrusted workspaces is disabled in untrusted workspace', () => {
		const extension = aLocalExtension2('pub.a', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: false, description: 'hello' } } });
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return false; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.DisabledByTrustRequirement);
	});

	test('test canChangeEnablement return true when extension is disabled by workspace trust', () => {
		const extension = aLocalExtension2('pub.a', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: false, description: 'hello' } } });
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return false; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.canChangeEnablement(extension));
	});

	test('test extension supports untrusted workspaces is enabled in untrusted workspace', () => {
		const extension = aLocalExtension2('pub.a', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: true } } });
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return false; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test extension does not support untrusted workspaces is enabled in trusted workspace', () => {
		const extension = aLocalExtension2('pub.a', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: false, description: '' } } });
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return true; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test extension supports untrusted workspaces is enabled in trusted workspace', () => {
		const extension = aLocalExtension2('pub.a', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: true } } });
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return true; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test extension without any value for virtual worksapce is enabled in virtual workspace', async () => {
		const extension = aLocalExtension2('pub.a');
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA').with(({ scheme: 'virtual' })) }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.isEnabled(extension));
		assert.deepStrictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
	});

	test('test local workspace extension is disabled by kind', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['workspace'] }, { location: URI.file(`pub.a`) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(!testObject.isEnabled(localWorkspaceExtension));
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.DisabledByExtensionKind);
	});

	test('test local workspace + ui extension is enabled by kind', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['workspace', 'ui'] }, { location: URI.file(`pub.a`) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.isEnabled(localWorkspaceExtension));
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.EnabledGlobally);
	});

	test('test local ui extension is not disabled by kind', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.isEnabled(localWorkspaceExtension));
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.EnabledGlobally);
	});

	test('test canChangeEnablement return true when the local workspace extension is disabled by kind', () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['workspace'] }, { location: URI.file(`pub.a`) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(localWorkspaceExtension), false);
	});

	test('test canChangeEnablement return true for local ui extension', () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(localWorkspaceExtension), true);
	});

	test('test remote ui extension is disabled by kind', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['ui'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(!testObject.isEnabled(localWorkspaceExtension));
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.DisabledByExtensionKind);
	});

	test('test remote ui+workspace extension is disabled by kind', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['ui', 'workspace'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.isEnabled(localWorkspaceExtension));
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.EnabledGlobally);
	});

	test('test remote ui extension is disabled by kind when there is no local server', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(null, anExtensionManagementServer('vscode-remote', instantiationService), null));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['ui'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(!testObject.isEnabled(localWorkspaceExtension));
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.DisabledByExtensionKind);
	});

	test('test remote workspace extension is not disabled by kind', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['workspace'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.ok(testObject.isEnabled(localWorkspaceExtension));
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.EnabledGlobally);
	});

	test('test canChangeEnablement return true when the remote ui extension is disabled by kind', () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['ui'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(localWorkspaceExtension), false);
	});

	test('test canChangeEnablement return true for remote workspace extension', () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { extensionKind: ['workspace'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.canChangeEnablement(localWorkspaceExtension), true);
	});

	test('test web extension on local server is disabled by kind when web worker is not enabled', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { browser: 'browser.js' }, { location: URI.file(`pub.a`) });
		(<TestConfigurationService>instantiationService.get(IConfigurationService)).setUserConfiguration('extensions', { webWorker: false });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.isEnabled(localWorkspaceExtension), false);
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.DisabledByExtensionKind);
	});

	test('test web extension on local server is not disabled by kind when web worker is enabled', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { browser: 'browser.js' }, { location: URI.file(`pub.a`) });
		(<TestConfigurationService>instantiationService.get(IConfigurationService)).setUserConfiguration('extensions', { webWorker: true });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.isEnabled(localWorkspaceExtension), true);
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.EnabledGlobally);
	});

	test('test web extension on remote server is disabled by kind when web worker is not enabled', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(anExtensionManagementServer('vscode-local', instantiationService), anExtensionManagementServer('vscode-remote', instantiationService), null));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { browser: 'browser.js' }, { location: URI.file(`pub.a`).with({ scheme: 'vscode-remote' }) });
		(<TestConfigurationService>instantiationService.get(IConfigurationService)).setUserConfiguration('extensions', { webWorker: false });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.isEnabled(localWorkspaceExtension), false);
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.DisabledByExtensionKind);
	});

	test('test web extension on remote server is disabled by kind when web worker is enabled', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(anExtensionManagementServer('vscode-local', instantiationService), anExtensionManagementServer('vscode-remote', instantiationService), null));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { browser: 'browser.js' }, { location: URI.file(`pub.a`).with({ scheme: 'vscode-remote' }) });
		(<TestConfigurationService>instantiationService.get(IConfigurationService)).setUserConfiguration('extensions', { webWorker: true });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.isEnabled(localWorkspaceExtension), false);
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.DisabledByExtensionKind);
	});

	test('test web extension on remote server is enabled in web', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(anExtensionManagementServer('vscode-local', instantiationService), anExtensionManagementServer('vscode-remote', instantiationService), anExtensionManagementServer('web', instantiationService)));
		const localWorkspaceExtension = aLocalExtension2('pub.a', { browser: 'browser.js' }, { location: URI.file(`pub.a`).with({ scheme: 'vscode-remote' }) });
		(<TestConfigurationService>instantiationService.get(IConfigurationService)).setUserConfiguration('extensions', { webWorker: false });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.isEnabled(localWorkspaceExtension), true);
		assert.deepStrictEqual(testObject.getEnablementState(localWorkspaceExtension), EnablementState.EnabledGlobally);
	});

	test('test web extension on web server is not disabled by kind', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(anExtensionManagementServer('vscode-local', instantiationService), anExtensionManagementServer('vscode-remote', instantiationService), anExtensionManagementServer('web', instantiationService)));
		const webExtension = aLocalExtension2('pub.a', { browser: 'browser.js' }, { location: URI.file(`pub.a`).with({ scheme: 'web' }) });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.isEnabled(webExtension), true);
		assert.deepStrictEqual(testObject.getEnablementState(webExtension), EnablementState.EnabledGlobally);
	});

	test('test state of multipe extensions', async () => {
		installed.push(...[aLocalExtension('pub.a'), aLocalExtension('pub.b'), aLocalExtension('pub.c'), aLocalExtension('pub.d'), aLocalExtension('pub.e')]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		await testObject.setEnablement([installed[0]], EnablementState.DisabledGlobally);
		await testObject.setEnablement([installed[1]], EnablementState.DisabledWorkspace);
		await testObject.setEnablement([installed[2]], EnablementState.EnabledWorkspace);
		await testObject.setEnablement([installed[3]], EnablementState.EnabledGlobally);

		assert.deepStrictEqual(testObject.getEnablementStates(installed), [EnablementState.DisabledGlobally, EnablementState.DisabledWorkspace, EnablementState.EnabledWorkspace, EnablementState.EnabledGlobally, EnablementState.EnabledGlobally]);
	});

	test('test extension is disabled by dependency if it has a dependency that is disabled', async () => {
		installed.push(...[aLocalExtension2('pub.a'), aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'] })]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		await testObject.setEnablement([installed[0]], EnablementState.DisabledGlobally);

		assert.strictEqual(testObject.getEnablementState(installed[1]), EnablementState.DisabledByExtensionDependency);
	});

	test('test extension is disabled by dependency if it has a dependency that is disabled by virtual workspace', async () => {
		installed.push(...[aLocalExtension2('pub.a', { capabilities: { virtualWorkspaces: false } }), aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'], capabilities: { virtualWorkspaces: true } })]);
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA').with(({ scheme: 'virtual' })) }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.strictEqual(testObject.getEnablementState(installed[0]), EnablementState.DisabledByVirtualWorkspace);
		assert.strictEqual(testObject.getEnablementState(installed[1]), EnablementState.DisabledByExtensionDependency);
	});

	test('test canChangeEnablement return false when extension is disabled by dependency if it has a dependency that is disabled by virtual workspace', async () => {
		installed.push(...[aLocalExtension2('pub.a', { capabilities: { virtualWorkspaces: false } }), aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'], capabilities: { virtualWorkspaces: true } })]);
		instantiationService.stub(IWorkspaceContextService, 'getWorkspace', <IWorkspace>{ folders: [{ uri: URI.file('worskapceA').with(({ scheme: 'virtual' })) }] });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.ok(!testObject.canChangeEnablement(installed[1]));
	});

	test('test extension is disabled by dependency if it has a dependency that is disabled by workspace trust', async () => {
		installed.push(...[aLocalExtension2('pub.a', { main: 'hello.js', capabilities: { untrustedWorkspaces: { supported: false, description: '' } } }), aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'], capabilities: { untrustedWorkspaces: { supported: true } } })]);
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return false; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.strictEqual(testObject.getEnablementState(installed[0]), EnablementState.DisabledByTrustRequirement);
		assert.strictEqual(testObject.getEnablementState(installed[1]), EnablementState.DisabledByExtensionDependency);
	});

	test('test extension is not disabled by dependency if it has a dependency that is disabled by extension kind', async () => {
		instantiationService.stub(IExtensionManagementServerService, anExtensionManagementServerService(anExtensionManagementServer('vscode-local', instantiationService), anExtensionManagementServer('vscode-remote', instantiationService), null));
		const localUIExtension = aLocalExtension2('pub.a', { extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		const remoteUIExtension = aLocalExtension2('pub.a', { extensionKind: ['ui'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		const remoteWorkspaceExtension = aLocalExtension2('pub.n', { extensionKind: ['workspace'], extensionDependencies: ['pub.a'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		installed.push(localUIExtension, remoteUIExtension, remoteWorkspaceExtension);

		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.strictEqual(testObject.getEnablementState(localUIExtension), EnablementState.EnabledGlobally);
		assert.strictEqual(testObject.getEnablementState(remoteUIExtension), EnablementState.DisabledByExtensionKind);
		assert.strictEqual(testObject.getEnablementState(remoteWorkspaceExtension), EnablementState.EnabledGlobally);
	});

	test('test canChangeEnablement return false when extension is disabled by dependency if it has a dependency that is disabled by workspace trust', async () => {
		installed.push(...[aLocalExtension2('pub.a', { main: 'hello.js', capabilities: { untrustedWorkspaces: { supported: false, description: '' } } }), aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'], capabilities: { untrustedWorkspaces: { supported: true } } })]);
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return false; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.deepEqual(testObject.canChangeEnablement(installed[1]), false);
	});

	test('test canChangeEnablement return false when extension is disabled by dependency if it has a dependency that is disabled globally', async () => {
		installed.push(...[aLocalExtension2('pub.a', {}), aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'] })]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		await testObject.setEnablement([installed[0]], EnablementState.DisabledGlobally);

		assert.deepEqual(testObject.canChangeEnablement(installed[1]), false);
	});

	test('test canChangeEnablement return false when extension is disabled by dependency if it has a dependency that is disabled workspace', async () => {
		installed.push(...[aLocalExtension2('pub.a', {}), aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'] })]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		await testObject.setEnablement([installed[0]], EnablementState.DisabledWorkspace);

		assert.deepEqual(testObject.canChangeEnablement(installed[1]), false);
	});

	test('test extension is not disabled by dependency even if it has a dependency that is disabled when installed extensions are not set', async () => {
		await testObject.setEnablement([aLocalExtension2('pub.a')], EnablementState.DisabledGlobally);

		assert.strictEqual(testObject.getEnablementState(aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'] })), EnablementState.EnabledGlobally);
	});

	test('test extension is disabled by dependency if it has a dependency that is disabled when all extensions are passed', async () => {
		installed.push(...[aLocalExtension2('pub.a'), aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'] })]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		await testObject.setEnablement([installed[0]], EnablementState.DisabledGlobally);

		assert.deepStrictEqual(testObject.getEnablementStates(installed), [EnablementState.DisabledGlobally, EnablementState.DisabledByExtensionDependency]);
	});

	test('test extension is not disabled when it has a missing dependency', async () => {
		const target = aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'] });
		installed.push(target);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledGlobally);
	});

	test('test extension is not disabled when it has a dependency in another server', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const target = aLocalExtension2('pub.a', { extensionDependencies: ['pub.b'], extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		const depdencyOnAnotherServer = aLocalExtension2('pub.b', {}, { location: URI.file(`pub.b`).with({ scheme: Schemas.vscodeRemote }) });
		installed.push(...[target, depdencyOnAnotherServer]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledGlobally);
	});

	test('test extension is enabled when it has a dependency in another server which is disabled', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const target = aLocalExtension2('pub.a', { extensionDependencies: ['pub.b'], extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		const depdencyOnAnotherServer = aLocalExtension2('pub.b', {}, { location: URI.file(`pub.b`).with({ scheme: Schemas.vscodeRemote }) });
		installed.push(...[target, depdencyOnAnotherServer]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();
		await testObject.setEnablement([depdencyOnAnotherServer], EnablementState.DisabledGlobally);

		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledGlobally);
	});

	test('test extension is enabled when it has a dependency in another server which is disabled and with no exports and no main and no browser entrypoints', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const target = aLocalExtension2('pub.a', { extensionDependencies: ['pub.b'], extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		const depdencyOnAnotherServer = aLocalExtension2('pub.b', { api: 'none' }, { location: URI.file(`pub.b`).with({ scheme: Schemas.vscodeRemote }) });
		installed.push(...[target, depdencyOnAnotherServer]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();
		await testObject.setEnablement([depdencyOnAnotherServer], EnablementState.DisabledGlobally);

		assert.strictEqual(testObject.getEnablementState(target), EnablementState.EnabledGlobally);
	});

	test('test extension is disabled by dependency when it has a dependency in another server  which is disabled and with no exports and has main entry point', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const target = aLocalExtension2('pub.a', { extensionDependencies: ['pub.b'], extensionKind: ['ui'] }, { location: URI.file(`pub.a`) });
		const depdencyOnAnotherServer = aLocalExtension2('pub.b', { api: 'none', main: 'main.js' }, { location: URI.file(`pub.b`).with({ scheme: Schemas.vscodeRemote }) });
		installed.push(...[target, depdencyOnAnotherServer]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();
		await testObject.setEnablement([depdencyOnAnotherServer], EnablementState.DisabledGlobally);

		assert.strictEqual(testObject.getEnablementState(target), EnablementState.DisabledByExtensionDependency);
	});

	test('test extension is disabled by dependency when it has a dependency in another server  which is disabled and with no exports and has browser entry point', async () => {
		instantiationService.stub(IExtensionManagementServerService, aMultiExtensionManagementServerService(instantiationService));
		const target = aLocalExtension2('pub.a', { extensionDependencies: ['pub.b'] }, { location: URI.file(`pub.a`).with({ scheme: Schemas.vscodeRemote }) });
		const depdencyOnAnotherServer = aLocalExtension2('pub.b', { api: 'none', browser: 'browser.js', extensionKind: 'ui' }, { location: URI.file(`pub.b`) });
		installed.push(...[target, depdencyOnAnotherServer]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();
		await testObject.setEnablement([depdencyOnAnotherServer], EnablementState.DisabledGlobally);

		assert.strictEqual(testObject.getEnablementState(target), EnablementState.DisabledByExtensionDependency);
	});

	test('test extension is disabled by invalidity', async () => {
		const target = aLocalExtension2('pub.b', {}, { isValid: false });
		assert.strictEqual(testObject.getEnablementState(target), EnablementState.DisabledByInvalidExtension);
	});

	test('test extension is disabled by dependency when it has a dependency that is invalid', async () => {
		const target = aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'] });
		installed.push(...[target, aLocalExtension2('pub.a', {}, { isValid: false })]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.strictEqual(testObject.getEnablementState(target), EnablementState.DisabledByExtensionDependency);
	});

	test('test extension is enabled when its dependency becomes valid', async () => {
		const extension = aLocalExtension2('pub.b', { extensionDependencies: ['pub.a'] });
		installed.push(...[extension, aLocalExtension2('pub.a', {}, { isValid: false })]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();

		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.DisabledByExtensionDependency);

		const target = sinon.spy();
		disposableStore.add(testObject.onEnablementChanged(target));

		const validExtension = aLocalExtension2('pub.a');
		didInstallEvent.fire([{
			identifier: validExtension.identifier,
			operation: InstallOperation.Install,
			source: validExtension.location,
			profileLocation: validExtension.location,
			local: validExtension,
		}]);

		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.EnabledGlobally);
		assert.deepStrictEqual((<IExtension>target.args[0][0][0]).identifier, { id: 'pub.b' });
	});

	test('test override workspace to trusted when getting extensions enablements', async () => {
		const extension = aLocalExtension2('pub.a', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: false, description: 'hello' } } });
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return false; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		assert.strictEqual(testObject.getEnablementStates([extension], { trusted: true })[0], EnablementState.EnabledGlobally);
	});

	test('test override workspace to not trusted when getting extensions enablements', async () => {
		const extension = aLocalExtension2('pub.a', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: false, description: 'hello' } } });
		instantiationService.stub(IWorkspaceTrustManagementService, <Partial<IWorkspaceTrustManagementService>>{ isWorkspaceTrusted() { return true; } });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));

		assert.strictEqual(testObject.getEnablementStates([extension], { trusted: false })[0], EnablementState.DisabledByTrustRequirement);
	});

	test('test update extensions enablements on trust change triggers change events for extensions depending on workspace trust', async () => {
		installed.push(...[
			aLocalExtension2('pub.a', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: false, description: 'hello' } } }),
			aLocalExtension2('pub.b', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: true } } }),
			aLocalExtension2('pub.c', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: false, description: 'hello' } } }),
			aLocalExtension2('pub.d', { main: 'main.js', capabilities: { untrustedWorkspaces: { supported: true } } }),
		]);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		const target = sinon.spy();
		disposableStore.add(testObject.onEnablementChanged(target));

		await testObject.updateExtensionsEnablementsWhenWorkspaceTrustChanges();
		assert.strictEqual(target.args[0][0].length, 2);
		assert.deepStrictEqual((<IExtension>target.args[0][0][0]).identifier, { id: 'pub.a' });
		assert.deepStrictEqual((<IExtension>target.args[0][0][1]).identifier, { id: 'pub.c' });
	});

	test('test adding an extension that was disabled', async () => {
		const extension = aLocalExtension('pub.a');
		installed.push(extension);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await testObject.setEnablement([extension], EnablementState.DisabledGlobally);

		const target = sinon.spy();
		disposableStore.add(testObject.onEnablementChanged(target));
		didChangeProfileExtensionsEvent.fire({ added: [extension], removed: [] });

		assert.ok(!testObject.isEnabled(extension));
		assert.strictEqual(testObject.getEnablementState(extension), EnablementState.DisabledGlobally);
		assert.strictEqual(target.args[0][0].length, 1);
		assert.deepStrictEqual((<IExtension>target.args[0][0][0]).identifier, { id: 'pub.a' });
	});

	test('test extension is disabled by allowed list', async () => {
		const target = aLocalExtension2('unallowed.extension');
		assert.strictEqual(testObject.getEnablementState(target), EnablementState.DisabledByAllowlist);
	});

	test('test extension is disabled by malicious', async () => {
		malicious.push({ id: 'malicious.extensionA' });
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		await (<TestExtensionEnablementService>testObject).waitUntilInitialized();
		const target = aLocalExtension2('malicious.extensionA');
		assert.strictEqual(testObject.getEnablementState(target), EnablementState.DisabledByMalicious);
	});

	test('test installed malicious extension triggers change event', async () => {
		testObject.dispose();
		malicious.push({ id: 'malicious.extensionB' });
		const local = aLocalExtension2('malicious.extensionB');
		installed.push(local);
		testObject = disposableStore.add(new TestExtensionEnablementService(instantiationService));
		assert.strictEqual(testObject.getEnablementState(local), EnablementState.EnabledGlobally);
		const promise = Event.toPromise(testObject.onEnablementChanged);

		const result = await promise;
		assert.deepStrictEqual(result[0], local);
		assert.strictEqual(testObject.getEnablementState(local), EnablementState.DisabledByMalicious);
	});

});

function anExtensionManagementServer(authority: string, instantiationService: TestInstantiationService): IExtensionManagementServer {
	return {
		id: authority,
		label: authority,
		extensionManagementService: instantiationService.get(IExtensionManagementService) as IProfileAwareExtensionManagementService,
	};
}

function aMultiExtensionManagementServerService(instantiationService: TestInstantiationService): IExtensionManagementServerService {
	const localExtensionManagementServer = anExtensionManagementServer('vscode-local', instantiationService);
	const remoteExtensionManagementServer = anExtensionManagementServer('vscode-remote', instantiationService);
	return anExtensionManagementServerService(localExtensionManagementServer, remoteExtensionManagementServer, null);
}

export function anExtensionManagementServerService(localExtensionManagementServer: IExtensionManagementServer | null, remoteExtensionManagementServer: IExtensionManagementServer | null, webExtensionManagementServer: IExtensionManagementServer | null): IExtensionManagementServerService {
	return {
		_serviceBrand: undefined,
		localExtensionManagementServer,
		remoteExtensionManagementServer,
		webExtensionManagementServer,
		getExtensionManagementServer: (extension: IExtension) => {
			if (extension.location.scheme === Schemas.file) {
				return localExtensionManagementServer;
			}
			if (extension.location.scheme === Schemas.vscodeRemote) {
				return remoteExtensionManagementServer;
			}
			return webExtensionManagementServer;
		},
		getExtensionInstallLocation(extension: IExtension): ExtensionInstallLocation | null {
			const server = this.getExtensionManagementServer(extension);
			return server === remoteExtensionManagementServer ? ExtensionInstallLocation.Remote
				: server === webExtensionManagementServer ? ExtensionInstallLocation.Web
					: ExtensionInstallLocation.Local;
		}
	};
}

function aLocalExtension(id: string, contributes?: IExtensionContributions, type?: ExtensionType): ILocalExtension {
	return aLocalExtension2(id, contributes ? { contributes } : {}, isUndefinedOrNull(type) ? {} : { type });
}

function aLocalExtension2(id: string, manifest: Partial<IExtensionManifest> = {}, properties: IStringDictionary<unknown> = {}): ILocalExtension {
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
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionRecommendations/common/extensionIgnoredRecommendationsService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionRecommendations/common/extensionIgnoredRecommendationsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IExtensionIgnoredRecommendationsService, IgnoredRecommendationChangeNotification } from './extensionRecommendations.js';
import { IWorkspaceExtensionsConfigService } from './workspaceExtensionsConfig.js';

const ignoredRecommendationsStorageKey = 'extensionsAssistant/ignored_recommendations';

export class ExtensionIgnoredRecommendationsService extends Disposable implements IExtensionIgnoredRecommendationsService {

	declare readonly _serviceBrand: undefined;

	private _onDidChangeIgnoredRecommendations = this._register(new Emitter<void>());
	readonly onDidChangeIgnoredRecommendations = this._onDidChangeIgnoredRecommendations.event;

	// Global Ignored Recommendations
	private _globalIgnoredRecommendations: string[] = [];
	get globalIgnoredRecommendations(): string[] { return [...this._globalIgnoredRecommendations]; }
	private _onDidChangeGlobalIgnoredRecommendation = this._register(new Emitter<IgnoredRecommendationChangeNotification>());
	readonly onDidChangeGlobalIgnoredRecommendation = this._onDidChangeGlobalIgnoredRecommendation.event;

	// Ignored Workspace Recommendations
	private ignoredWorkspaceRecommendations: string[] = [];

	get ignoredRecommendations(): string[] { return distinct([...this.globalIgnoredRecommendations, ...this.ignoredWorkspaceRecommendations]); }

	constructor(
		@IWorkspaceExtensionsConfigService private readonly workspaceExtensionsConfigService: IWorkspaceExtensionsConfigService,
		@IStorageService private readonly storageService: IStorageService,
	) {
		super();
		this._globalIgnoredRecommendations = this.getCachedIgnoredRecommendations();
		this._register(this.storageService.onDidChangeValue(StorageScope.PROFILE, ignoredRecommendationsStorageKey, this._store)(() => this.onDidStorageChange()));

		this.initIgnoredWorkspaceRecommendations();
	}

	private async initIgnoredWorkspaceRecommendations(): Promise<void> {
		this.ignoredWorkspaceRecommendations = await this.workspaceExtensionsConfigService.getUnwantedRecommendations();
		this._onDidChangeIgnoredRecommendations.fire();
		this._register(this.workspaceExtensionsConfigService.onDidChangeExtensionsConfigs(async () => {
			this.ignoredWorkspaceRecommendations = await this.workspaceExtensionsConfigService.getUnwantedRecommendations();
			this._onDidChangeIgnoredRecommendations.fire();
		}));
	}

	toggleGlobalIgnoredRecommendation(extensionId: string, shouldIgnore: boolean): void {
		extensionId = extensionId.toLowerCase();
		const ignored = this._globalIgnoredRecommendations.indexOf(extensionId) !== -1;
		if (ignored === shouldIgnore) {
			return;
		}

		this._globalIgnoredRecommendations = shouldIgnore ? [...this._globalIgnoredRecommendations, extensionId] : this._globalIgnoredRecommendations.filter(id => id !== extensionId);
		this.storeCachedIgnoredRecommendations(this._globalIgnoredRecommendations);
		this._onDidChangeGlobalIgnoredRecommendation.fire({ extensionId, isRecommended: !shouldIgnore });
		this._onDidChangeIgnoredRecommendations.fire();
	}

	private getCachedIgnoredRecommendations(): string[] {
		const ignoredRecommendations: string[] = JSON.parse(this.ignoredRecommendationsValue);
		return ignoredRecommendations.map(e => e.toLowerCase());
	}

	private onDidStorageChange(): void {
		if (this.ignoredRecommendationsValue !== this.getStoredIgnoredRecommendationsValue() /* This checks if current window changed the value or not */) {
			this._ignoredRecommendationsValue = undefined;
			this._globalIgnoredRecommendations = this.getCachedIgnoredRecommendations();
			this._onDidChangeIgnoredRecommendations.fire();
		}
	}

	private storeCachedIgnoredRecommendations(ignoredRecommendations: string[]): void {
		this.ignoredRecommendationsValue = JSON.stringify(ignoredRecommendations);
	}

	private _ignoredRecommendationsValue: string | undefined;
	private get ignoredRecommendationsValue(): string {
		if (!this._ignoredRecommendationsValue) {
			this._ignoredRecommendationsValue = this.getStoredIgnoredRecommendationsValue();
		}

		return this._ignoredRecommendationsValue;
	}

	private set ignoredRecommendationsValue(ignoredRecommendationsValue: string) {
		if (this.ignoredRecommendationsValue !== ignoredRecommendationsValue) {
			this._ignoredRecommendationsValue = ignoredRecommendationsValue;
			this.setStoredIgnoredRecommendationsValue(ignoredRecommendationsValue);
		}
	}

	private getStoredIgnoredRecommendationsValue(): string {
		return this.storageService.get(ignoredRecommendationsStorageKey, StorageScope.PROFILE, '[]');
	}

	private setStoredIgnoredRecommendationsValue(value: string): void {
		this.storageService.store(ignoredRecommendationsStorageKey, value, StorageScope.PROFILE, StorageTarget.USER);
	}

}

registerSingleton(IExtensionIgnoredRecommendationsService, ExtensionIgnoredRecommendationsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionRecommendations/common/extensionRecommendations.ts]---
Location: vscode-main/src/vs/workbench/services/extensionRecommendations/common/extensionRecommendations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';

export const enum ExtensionRecommendationReason {
	Workspace,
	File,
	Executable,
	WorkspaceConfig,
	DynamicWorkspace,
	Experimental,
	Application,
}

export interface IExtensionRecommendationReason {
	reasonId: ExtensionRecommendationReason;
	reasonText: string;
}

export const IExtensionRecommendationsService = createDecorator<IExtensionRecommendationsService>('extensionRecommendationsService');

export interface IExtensionRecommendationsService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeRecommendations: Event<void>;
	getAllRecommendationsWithReason(): IStringDictionary<IExtensionRecommendationReason>;

	getImportantRecommendations(): Promise<string[]>;
	getOtherRecommendations(): Promise<string[]>;
	getFileBasedRecommendations(): string[];
	getExeBasedRecommendations(exe?: string): Promise<{ important: string[]; others: string[] }>;
	getConfigBasedRecommendations(): Promise<{ important: string[]; others: string[] }>;
	getWorkspaceRecommendations(): Promise<Array<string | URI>>;
	getKeymapRecommendations(): string[];
	getLanguageRecommendations(): string[];
	getRemoteRecommendations(): string[];
}

export type IgnoredRecommendationChangeNotification = {
	extensionId: string;
	isRecommended: boolean;
};

export const IExtensionIgnoredRecommendationsService = createDecorator<IExtensionIgnoredRecommendationsService>('IExtensionIgnoredRecommendationsService');

export interface IExtensionIgnoredRecommendationsService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeIgnoredRecommendations: Event<void>;
	readonly ignoredRecommendations: string[];

	readonly onDidChangeGlobalIgnoredRecommendation: Event<IgnoredRecommendationChangeNotification>;
	readonly globalIgnoredRecommendations: string[];
	toggleGlobalIgnoredRecommendation(extensionId: string, ignore: boolean): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionRecommendations/common/workspaceExtensionsConfig.ts]---
Location: vscode-main/src/vs/workbench/services/extensionRecommendations/common/workspaceExtensionsConfig.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { JSONPath, parse } from '../../../../base/common/json.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { FileKind, IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { isWorkspace, IWorkspace, IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { IJSONEditingService, IJSONValue } from '../../configuration/common/jsonEditing.js';
import { ResourceMap } from '../../../../base/common/map.js';

export const EXTENSIONS_CONFIG = '.vscode/extensions.json';

export interface IExtensionsConfigContent {
	recommendations?: string[];
	unwantedRecommendations?: string[];
}

export const IWorkspaceExtensionsConfigService = createDecorator<IWorkspaceExtensionsConfigService>('IWorkspaceExtensionsConfigService');

export interface IWorkspaceExtensionsConfigService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeExtensionsConfigs: Event<void>;
	getExtensionsConfigs(): Promise<IExtensionsConfigContent[]>;
	getRecommendations(): Promise<string[]>;
	getUnwantedRecommendations(): Promise<string[]>;

	toggleRecommendation(extensionId: string): Promise<void>;
	toggleUnwantedRecommendation(extensionId: string): Promise<void>;
}

export class WorkspaceExtensionsConfigService extends Disposable implements IWorkspaceExtensionsConfigService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeExtensionsConfigs = this._register(new Emitter<void>());
	readonly onDidChangeExtensionsConfigs = this._onDidChangeExtensionsConfigs.event;

	constructor(
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IFileService private readonly fileService: IFileService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IJSONEditingService private readonly jsonEditingService: IJSONEditingService,
	) {
		super();
		this._register(workspaceContextService.onDidChangeWorkspaceFolders(e => this._onDidChangeExtensionsConfigs.fire()));
		this._register(fileService.onDidFilesChange(e => {
			const workspace = workspaceContextService.getWorkspace();
			if ((workspace.configuration && e.affects(workspace.configuration))
				|| workspace.folders.some(folder => e.affects(folder.toResource(EXTENSIONS_CONFIG)))
			) {
				this._onDidChangeExtensionsConfigs.fire();
			}
		}));
	}

	async getExtensionsConfigs(): Promise<IExtensionsConfigContent[]> {
		const workspace = this.workspaceContextService.getWorkspace();
		const result: IExtensionsConfigContent[] = [];
		const workspaceExtensionsConfigContent = workspace.configuration ? await this.resolveWorkspaceExtensionConfig(workspace.configuration) : undefined;
		if (workspaceExtensionsConfigContent) {
			result.push(workspaceExtensionsConfigContent);
		}
		result.push(...await Promise.all(workspace.folders.map(workspaceFolder => this.resolveWorkspaceFolderExtensionConfig(workspaceFolder))));
		return result;
	}

	async getRecommendations(): Promise<string[]> {
		const configs = await this.getExtensionsConfigs();
		return distinct(configs.flatMap(c => c.recommendations ? c.recommendations.map(c => c.toLowerCase()) : []));
	}

	async getUnwantedRecommendations(): Promise<string[]> {
		const configs = await this.getExtensionsConfigs();
		return distinct(configs.flatMap(c => c.unwantedRecommendations ? c.unwantedRecommendations.map(c => c.toLowerCase()) : []));
	}

	async toggleRecommendation(extensionId: string): Promise<void> {
		extensionId = extensionId.toLowerCase();
		const workspace = this.workspaceContextService.getWorkspace();
		const workspaceExtensionsConfigContent = workspace.configuration ? await this.resolveWorkspaceExtensionConfig(workspace.configuration) : undefined;
		const workspaceFolderExtensionsConfigContents = new ResourceMap<IExtensionsConfigContent>();
		await Promise.all(workspace.folders.map(async workspaceFolder => {
			const extensionsConfigContent = await this.resolveWorkspaceFolderExtensionConfig(workspaceFolder);
			workspaceFolderExtensionsConfigContents.set(workspaceFolder.uri, extensionsConfigContent);
		}));

		const isWorkspaceRecommended = workspaceExtensionsConfigContent && workspaceExtensionsConfigContent.recommendations?.some(r => r.toLowerCase() === extensionId);
		const recommendedWorksapceFolders = workspace.folders.filter(workspaceFolder => workspaceFolderExtensionsConfigContents.get(workspaceFolder.uri)?.recommendations?.some(r => r.toLowerCase() === extensionId));
		const isRecommended = isWorkspaceRecommended || recommendedWorksapceFolders.length > 0;

		const workspaceOrFolders = isRecommended
			? await this.pickWorkspaceOrFolders(recommendedWorksapceFolders, isWorkspaceRecommended ? workspace : undefined, localize('select for remove', "Remove extension recommendation from"))
			: await this.pickWorkspaceOrFolders(workspace.folders, workspace.configuration ? workspace : undefined, localize('select for add', "Add extension recommendation to"));

		for (const workspaceOrWorkspaceFolder of workspaceOrFolders) {
			if (isWorkspace(workspaceOrWorkspaceFolder)) {
				await this.addOrRemoveWorkspaceRecommendation(extensionId, workspaceOrWorkspaceFolder, workspaceExtensionsConfigContent, !isRecommended);
			} else {
				await this.addOrRemoveWorkspaceFolderRecommendation(extensionId, workspaceOrWorkspaceFolder, workspaceFolderExtensionsConfigContents.get(workspaceOrWorkspaceFolder.uri)!, !isRecommended);
			}
		}
	}

	async toggleUnwantedRecommendation(extensionId: string): Promise<void> {
		const workspace = this.workspaceContextService.getWorkspace();
		const workspaceExtensionsConfigContent = workspace.configuration ? await this.resolveWorkspaceExtensionConfig(workspace.configuration) : undefined;
		const workspaceFolderExtensionsConfigContents = new ResourceMap<IExtensionsConfigContent>();
		await Promise.all(workspace.folders.map(async workspaceFolder => {
			const extensionsConfigContent = await this.resolveWorkspaceFolderExtensionConfig(workspaceFolder);
			workspaceFolderExtensionsConfigContents.set(workspaceFolder.uri, extensionsConfigContent);
		}));

		const isWorkspaceUnwanted = workspaceExtensionsConfigContent && workspaceExtensionsConfigContent.unwantedRecommendations?.some(r => r === extensionId);
		const unWantedWorksapceFolders = workspace.folders.filter(workspaceFolder => workspaceFolderExtensionsConfigContents.get(workspaceFolder.uri)?.unwantedRecommendations?.some(r => r === extensionId));
		const isUnwanted = isWorkspaceUnwanted || unWantedWorksapceFolders.length > 0;

		const workspaceOrFolders = isUnwanted
			? await this.pickWorkspaceOrFolders(unWantedWorksapceFolders, isWorkspaceUnwanted ? workspace : undefined, localize('select for remove', "Remove extension recommendation from"))
			: await this.pickWorkspaceOrFolders(workspace.folders, workspace.configuration ? workspace : undefined, localize('select for add', "Add extension recommendation to"));

		for (const workspaceOrWorkspaceFolder of workspaceOrFolders) {
			if (isWorkspace(workspaceOrWorkspaceFolder)) {
				await this.addOrRemoveWorkspaceUnwantedRecommendation(extensionId, workspaceOrWorkspaceFolder, workspaceExtensionsConfigContent, !isUnwanted);
			} else {
				await this.addOrRemoveWorkspaceFolderUnwantedRecommendation(extensionId, workspaceOrWorkspaceFolder, workspaceFolderExtensionsConfigContents.get(workspaceOrWorkspaceFolder.uri)!, !isUnwanted);
			}
		}
	}

	private async addOrRemoveWorkspaceFolderRecommendation(extensionId: string, workspaceFolder: IWorkspaceFolder, extensionsConfigContent: IExtensionsConfigContent, add: boolean): Promise<void> {
		const values: IJSONValue[] = [];
		if (add) {
			if (Array.isArray(extensionsConfigContent.recommendations)) {
				values.push({ path: ['recommendations', -1], value: extensionId });
			} else {
				values.push({ path: ['recommendations'], value: [extensionId] });
			}
			const unwantedRecommendationEdit = this.getEditToRemoveValueFromArray(['unwantedRecommendations'], extensionsConfigContent.unwantedRecommendations, extensionId);
			if (unwantedRecommendationEdit) {
				values.push(unwantedRecommendationEdit);
			}
		} else if (extensionsConfigContent.recommendations) {
			const recommendationEdit = this.getEditToRemoveValueFromArray(['recommendations'], extensionsConfigContent.recommendations, extensionId);
			if (recommendationEdit) {
				values.push(recommendationEdit);
			}
		}

		if (values.length) {
			return this.jsonEditingService.write(workspaceFolder.toResource(EXTENSIONS_CONFIG), values, true);
		}
	}

	private async addOrRemoveWorkspaceRecommendation(extensionId: string, workspace: IWorkspace, extensionsConfigContent: IExtensionsConfigContent | undefined, add: boolean): Promise<void> {
		const values: IJSONValue[] = [];
		if (extensionsConfigContent) {
			if (add) {
				const path: JSONPath = ['extensions', 'recommendations'];
				if (Array.isArray(extensionsConfigContent.recommendations)) {
					values.push({ path: [...path, -1], value: extensionId });
				} else {
					values.push({ path, value: [extensionId] });
				}
				const unwantedRecommendationEdit = this.getEditToRemoveValueFromArray(['extensions', 'unwantedRecommendations'], extensionsConfigContent.unwantedRecommendations, extensionId);
				if (unwantedRecommendationEdit) {
					values.push(unwantedRecommendationEdit);
				}
			} else if (extensionsConfigContent.recommendations) {
				const recommendationEdit = this.getEditToRemoveValueFromArray(['extensions', 'recommendations'], extensionsConfigContent.recommendations, extensionId);
				if (recommendationEdit) {
					values.push(recommendationEdit);
				}
			}
		} else if (add) {
			values.push({ path: ['extensions'], value: { recommendations: [extensionId] } });
		}

		if (values.length) {
			return this.jsonEditingService.write(workspace.configuration!, values, true);
		}
	}

	private async addOrRemoveWorkspaceFolderUnwantedRecommendation(extensionId: string, workspaceFolder: IWorkspaceFolder, extensionsConfigContent: IExtensionsConfigContent, add: boolean): Promise<void> {
		const values: IJSONValue[] = [];
		if (add) {
			const path: JSONPath = ['unwantedRecommendations'];
			if (Array.isArray(extensionsConfigContent.unwantedRecommendations)) {
				values.push({ path: [...path, -1], value: extensionId });
			} else {
				values.push({ path, value: [extensionId] });
			}
			const recommendationEdit = this.getEditToRemoveValueFromArray(['recommendations'], extensionsConfigContent.recommendations, extensionId);
			if (recommendationEdit) {
				values.push(recommendationEdit);
			}
		} else if (extensionsConfigContent.unwantedRecommendations) {
			const unwantedRecommendationEdit = this.getEditToRemoveValueFromArray(['unwantedRecommendations'], extensionsConfigContent.unwantedRecommendations, extensionId);
			if (unwantedRecommendationEdit) {
				values.push(unwantedRecommendationEdit);
			}
		}
		if (values.length) {
			return this.jsonEditingService.write(workspaceFolder.toResource(EXTENSIONS_CONFIG), values, true);
		}
	}

	private async addOrRemoveWorkspaceUnwantedRecommendation(extensionId: string, workspace: IWorkspace, extensionsConfigContent: IExtensionsConfigContent | undefined, add: boolean): Promise<void> {
		const values: IJSONValue[] = [];
		if (extensionsConfigContent) {
			if (add) {
				const path: JSONPath = ['extensions', 'unwantedRecommendations'];
				if (Array.isArray(extensionsConfigContent.recommendations)) {
					values.push({ path: [...path, -1], value: extensionId });
				} else {
					values.push({ path, value: [extensionId] });
				}
				const recommendationEdit = this.getEditToRemoveValueFromArray(['extensions', 'recommendations'], extensionsConfigContent.recommendations, extensionId);
				if (recommendationEdit) {
					values.push(recommendationEdit);
				}
			} else if (extensionsConfigContent.unwantedRecommendations) {
				const unwantedRecommendationEdit = this.getEditToRemoveValueFromArray(['extensions', 'unwantedRecommendations'], extensionsConfigContent.unwantedRecommendations, extensionId);
				if (unwantedRecommendationEdit) {
					values.push(unwantedRecommendationEdit);
				}
			}
		} else if (add) {
			values.push({ path: ['extensions'], value: { unwantedRecommendations: [extensionId] } });
		}

		if (values.length) {
			return this.jsonEditingService.write(workspace.configuration!, values, true);
		}
	}

	private async pickWorkspaceOrFolders(workspaceFolders: IWorkspaceFolder[], workspace: IWorkspace | undefined, placeHolder: string): Promise<(IWorkspace | IWorkspaceFolder)[]> {
		const workspaceOrFolders = workspace ? [...workspaceFolders, workspace] : [...workspaceFolders];
		if (workspaceOrFolders.length === 1) {
			return workspaceOrFolders;
		}

		const folderPicks: (IQuickPickItem & { workspaceOrFolder: IWorkspace | IWorkspaceFolder } | IQuickPickSeparator)[] = workspaceFolders.map(workspaceFolder => {
			return {
				label: workspaceFolder.name,
				description: localize('workspace folder', "Workspace Folder"),
				workspaceOrFolder: workspaceFolder,
				iconClasses: getIconClasses(this.modelService, this.languageService, workspaceFolder.uri, FileKind.ROOT_FOLDER)
			};
		});

		if (workspace) {
			folderPicks.push({ type: 'separator' });
			folderPicks.push({
				label: localize('workspace', "Workspace"),
				workspaceOrFolder: workspace,
			});
		}

		const result = await this.quickInputService.pick(folderPicks, { placeHolder, canPickMany: true }) || [];
		return result.map(r => r.workspaceOrFolder);
	}

	private async resolveWorkspaceExtensionConfig(workspaceConfigurationResource: URI): Promise<IExtensionsConfigContent | undefined> {
		try {
			const content = await this.fileService.readFile(workspaceConfigurationResource);
			const extensionsConfigContent = <IExtensionsConfigContent | undefined>parse(content.value.toString())['extensions'];
			return extensionsConfigContent ? this.parseExtensionConfig(extensionsConfigContent) : undefined;
		} catch (e) { /* Ignore */ }
		return undefined;
	}

	private async resolveWorkspaceFolderExtensionConfig(workspaceFolder: IWorkspaceFolder): Promise<IExtensionsConfigContent> {
		try {
			const content = await this.fileService.readFile(workspaceFolder.toResource(EXTENSIONS_CONFIG));
			const extensionsConfigContent = <IExtensionsConfigContent>parse(content.value.toString());
			return this.parseExtensionConfig(extensionsConfigContent);
		} catch (e) { /* ignore */ }
		return {};
	}

	private parseExtensionConfig(extensionsConfigContent: IExtensionsConfigContent): IExtensionsConfigContent {
		return {
			recommendations: distinct((extensionsConfigContent.recommendations || []).map(e => e.toLowerCase())),
			unwantedRecommendations: distinct((extensionsConfigContent.unwantedRecommendations || []).map(e => e.toLowerCase()))
		};
	}

	private getEditToRemoveValueFromArray(path: JSONPath, array: string[] | undefined, value: string): IJSONValue | undefined {
		const index = array?.indexOf(value);
		if (index !== undefined && index !== -1) {
			return { path: [...path, index], value: undefined };
		}
		return undefined;
	}

}

registerSingleton(IWorkspaceExtensionsConfigService, WorkspaceExtensionsConfigService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/browser/extensionService.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/browser/extensionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from '../../../../base/browser/window.js';
import { Schemas } from '../../../../base/common/network.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ExtensionKind } from '../../../../platform/environment/common/environment.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IAutomatedWindow, getLogs } from '../../../../platform/log/browser/log.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { PersistentConnectionEventType } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { IRemoteAuthorityResolverService, RemoteAuthorityResolverError, ResolverResult } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IRemoteExtensionsScannerService } from '../../../../platform/remote/common/remoteExtensionsScanner.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { IWebExtensionsScannerService, IWorkbenchExtensionEnablementService, IWorkbenchExtensionManagementService } from '../../extensionManagement/common/extensionManagement.js';
import { IWebWorkerExtensionHostDataProvider, IWebWorkerExtensionHostInitData, WebWorkerExtensionHost } from './webWorkerExtensionHost.js';
import { FetchFileSystemProvider } from './webWorkerFileSystemProvider.js';
import { AbstractExtensionService, IExtensionHostFactory, LocalExtensions, RemoteExtensions, ResolvedExtensions, ResolverExtensions, checkEnabledAndProposedAPI, isResolverExtension } from '../common/abstractExtensionService.js';
import { ExtensionDescriptionRegistrySnapshot } from '../common/extensionDescriptionRegistry.js';
import { ExtensionHostKind, ExtensionRunningPreference, IExtensionHostKindPicker, extensionHostKindToString, extensionRunningPreferenceToString } from '../common/extensionHostKind.js';
import { IExtensionManifestPropertiesService } from '../common/extensionManifestPropertiesService.js';
import { ExtensionRunningLocation } from '../common/extensionRunningLocation.js';
import { ExtensionRunningLocationTracker, filterExtensionDescriptions } from '../common/extensionRunningLocationTracker.js';
import { ExtensionHostExtensions, ExtensionHostStartup, IExtensionHost, IExtensionService, toExtensionDescription } from '../common/extensions.js';
import { ExtensionsProposedApi } from '../common/extensionsProposedApi.js';
import { dedupExtensions } from '../common/extensionsUtil.js';
import { IRemoteExtensionHostDataProvider, IRemoteExtensionHostInitData, RemoteExtensionHost } from '../common/remoteExtensionHost.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IRemoteExplorerService } from '../../remote/common/remoteExplorerService.js';
import { IUserDataInitializationService } from '../../userData/browser/userDataInit.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { AsyncIterableEmitter, AsyncIterableProducer } from '../../../../base/common/async.js';

export class ExtensionService extends AbstractExtensionService implements IExtensionService {

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@INotificationService notificationService: INotificationService,
		@IBrowserWorkbenchEnvironmentService private readonly _browserEnvironmentService: IBrowserWorkbenchEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IWorkbenchExtensionEnablementService extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
		@IWorkbenchExtensionManagementService extensionManagementService: IWorkbenchExtensionManagementService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IConfigurationService configurationService: IConfigurationService,
		@IExtensionManifestPropertiesService extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IWebExtensionsScannerService private readonly _webExtensionsScannerService: IWebExtensionsScannerService,
		@ILogService logService: ILogService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IRemoteExtensionsScannerService remoteExtensionsScannerService: IRemoteExtensionsScannerService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IRemoteAuthorityResolverService remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IUserDataInitializationService private readonly _userDataInitializationService: IUserDataInitializationService,
		@IUserDataProfileService private readonly _userDataProfileService: IUserDataProfileService,
		@IWorkspaceTrustManagementService private readonly _workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IRemoteExplorerService private readonly _remoteExplorerService: IRemoteExplorerService,
		@IDialogService dialogService: IDialogService,
	) {
		const extensionsProposedApi = instantiationService.createInstance(ExtensionsProposedApi);
		const extensionHostFactory = new BrowserExtensionHostFactory(
			extensionsProposedApi,
			() => this._scanWebExtensions(),
			() => this._getExtensionRegistrySnapshotWhenReady(),
			instantiationService,
			remoteAgentService,
			remoteAuthorityResolverService,
			extensionEnablementService,
			logService
		);
		super(
			{ hasLocalProcess: false, allowRemoteExtensionsInLocalWebWorker: true },
			extensionsProposedApi,
			extensionHostFactory,
			new BrowserExtensionHostKindPicker(logService),
			instantiationService,
			notificationService,
			_browserEnvironmentService,
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
			dialogService
		);

		// Initialize installed extensions first and do it only after workbench is ready
		lifecycleService.when(LifecyclePhase.Ready).then(async () => {
			await this._userDataInitializationService.initializeInstalledExtensions(this._instantiationService);
			this._initialize();
		});

		this._initFetchFileSystem();
	}

	private _initFetchFileSystem(): void {
		const provider = new FetchFileSystemProvider();
		this._register(this._fileService.registerProvider(Schemas.http, provider));
		this._register(this._fileService.registerProvider(Schemas.https, provider));
	}

	private _scanWebExtensionsPromise: Promise<IExtensionDescription[]> | undefined;
	private async _scanWebExtensions(): Promise<IExtensionDescription[]> {
		if (!this._scanWebExtensionsPromise) {
			this._scanWebExtensionsPromise = (async () => {
				const system: IExtensionDescription[] = [], user: IExtensionDescription[] = [], development: IExtensionDescription[] = [];
				try {
					await Promise.all([
						this._webExtensionsScannerService.scanSystemExtensions().then(extensions => system.push(...extensions.map(e => toExtensionDescription(e)))),
						this._webExtensionsScannerService.scanUserExtensions(this._userDataProfileService.currentProfile.extensionsResource, { skipInvalidExtensions: true }).then(extensions => user.push(...extensions.map(e => toExtensionDescription(e)))),
						this._webExtensionsScannerService.scanExtensionsUnderDevelopment().then(extensions => development.push(...extensions.map(e => toExtensionDescription(e, true))))
					]);
				} catch (error) {
					this._logService.error(error);
				}
				return dedupExtensions(system, user, [], development, this._logService);
			})();
		}
		return this._scanWebExtensionsPromise;
	}

	private async _resolveExtensionsDefault(emitter: AsyncIterableEmitter<ResolvedExtensions>) {
		const [localExtensions, remoteExtensions] = await Promise.all([
			this._scanWebExtensions(),
			this._remoteExtensionsScannerService.scanExtensions()
		]);

		if (remoteExtensions.length) {
			emitter.emitOne(new RemoteExtensions(remoteExtensions));
		}
		emitter.emitOne(new LocalExtensions(localExtensions));
	}

	protected _resolveExtensions(): AsyncIterable<ResolvedExtensions> {
		return new AsyncIterableProducer(emitter => this._doResolveExtensions(emitter));
	}

	private async _doResolveExtensions(emitter: AsyncIterableEmitter<ResolvedExtensions>): Promise<void> {
		if (!this._browserEnvironmentService.expectsResolverExtension) {
			return this._resolveExtensionsDefault(emitter);
		}

		const remoteAuthority = this._environmentService.remoteAuthority!;

		// Now that the canonical URI provider has been registered, we need to wait for the trust state to be
		// calculated. The trust state will be used while resolving the authority, however the resolver can
		// override the trust state through the resolver result.
		await this._workspaceTrustManagementService.workspaceResolved;

		const localExtensions = await this._scanWebExtensions();
		const resolverExtensions = localExtensions.filter(extension => isResolverExtension(extension));
		if (resolverExtensions.length) {
			emitter.emitOne(new ResolverExtensions(resolverExtensions));
		}

		let resolverResult: ResolverResult;
		try {
			resolverResult = await this._resolveAuthorityInitial(remoteAuthority);
		} catch (err) {
			if (RemoteAuthorityResolverError.isHandled(err)) {
				console.log(`Error handled: Not showing a notification for the error`);
			}
			this._remoteAuthorityResolverService._setResolvedAuthorityError(remoteAuthority, err);

			// Proceed with the local extension host
			return this._resolveExtensionsDefault(emitter);
		}

		// set the resolved authority
		this._remoteAuthorityResolverService._setResolvedAuthority(resolverResult.authority, resolverResult.options);
		this._remoteExplorerService.setTunnelInformation(resolverResult.tunnelInformation);

		// monitor for breakage
		const connection = this._remoteAgentService.getConnection();
		if (connection) {
			this._register(connection.onDidStateChange(async (e) => {
				if (e.type === PersistentConnectionEventType.ConnectionLost) {
					this._remoteAuthorityResolverService._clearResolvedAuthority(remoteAuthority);
				}
			}));
			this._register(connection.onReconnecting(() => this._resolveAuthorityAgain()));
		}

		return this._resolveExtensionsDefault(emitter);
	}

	protected async _onExtensionHostExit(code: number): Promise<void> {
		// Dispose everything associated with the extension host
		await this._doStopExtensionHosts();

		// If we are running extension tests, forward logs and exit code
		const automatedWindow = mainWindow as unknown as IAutomatedWindow;
		if (typeof automatedWindow.codeAutomationExit === 'function') {
			automatedWindow.codeAutomationExit(code, await getLogs(this._fileService, this._environmentService));
		}
	}

	protected async _resolveAuthority(remoteAuthority: string): Promise<ResolverResult> {
		return this._resolveAuthorityOnExtensionHosts(ExtensionHostKind.LocalWebWorker, remoteAuthority);
	}
}

class BrowserExtensionHostFactory implements IExtensionHostFactory {

	constructor(
		private readonly _extensionsProposedApi: ExtensionsProposedApi,
		private readonly _scanWebExtensions: () => Promise<IExtensionDescription[]>,
		private readonly _getExtensionRegistrySnapshotWhenReady: () => Promise<ExtensionDescriptionRegistrySnapshot>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IRemoteAgentService private readonly _remoteAgentService: IRemoteAgentService,
		@IRemoteAuthorityResolverService private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IWorkbenchExtensionEnablementService private readonly _extensionEnablementService: IWorkbenchExtensionEnablementService,
		@ILogService private readonly _logService: ILogService,
	) { }

	createExtensionHost(runningLocations: ExtensionRunningLocationTracker, runningLocation: ExtensionRunningLocation, isInitialStart: boolean): IExtensionHost | null {
		switch (runningLocation.kind) {
			case ExtensionHostKind.LocalProcess: {
				return null;
			}
			case ExtensionHostKind.LocalWebWorker: {
				const startup = (
					isInitialStart
						? ExtensionHostStartup.EagerManualStart
						: ExtensionHostStartup.EagerAutoStart
				);
				return this._instantiationService.createInstance(WebWorkerExtensionHost, runningLocation, startup, this._createLocalExtensionHostDataProvider(runningLocations, runningLocation, isInitialStart));
			}
			case ExtensionHostKind.Remote: {
				const remoteAgentConnection = this._remoteAgentService.getConnection();
				if (remoteAgentConnection) {
					return this._instantiationService.createInstance(RemoteExtensionHost, runningLocation, this._createRemoteExtensionHostDataProvider(runningLocations, remoteAgentConnection.remoteAuthority));
				}
				return null;
			}
		}
	}

	private _createLocalExtensionHostDataProvider(runningLocations: ExtensionRunningLocationTracker, desiredRunningLocation: ExtensionRunningLocation, isInitialStart: boolean): IWebWorkerExtensionHostDataProvider {
		return {
			getInitData: async (): Promise<IWebWorkerExtensionHostInitData> => {
				if (isInitialStart) {
					// Here we load even extensions that would be disabled by workspace trust
					const localExtensions = checkEnabledAndProposedAPI(this._logService, this._extensionEnablementService, this._extensionsProposedApi, await this._scanWebExtensions(), /* ignore workspace trust */true);
					const runningLocation = runningLocations.computeRunningLocation(localExtensions, [], false);
					const myExtensions = filterExtensionDescriptions(localExtensions, runningLocation, extRunningLocation => desiredRunningLocation.equals(extRunningLocation));
					const extensions = new ExtensionHostExtensions(0, localExtensions, myExtensions.map(extension => extension.identifier));
					return { extensions };
				} else {
					// restart case
					const snapshot = await this._getExtensionRegistrySnapshotWhenReady();
					const myExtensions = runningLocations.filterByRunningLocation(snapshot.extensions, desiredRunningLocation);
					const extensions = new ExtensionHostExtensions(snapshot.versionId, snapshot.extensions, myExtensions.map(extension => extension.identifier));
					return { extensions };
				}
			}
		};
	}

	private _createRemoteExtensionHostDataProvider(runningLocations: ExtensionRunningLocationTracker, remoteAuthority: string): IRemoteExtensionHostDataProvider {
		return {
			remoteAuthority: remoteAuthority,
			getInitData: async (): Promise<IRemoteExtensionHostInitData> => {
				const snapshot = await this._getExtensionRegistrySnapshotWhenReady();

				const remoteEnv = await this._remoteAgentService.getEnvironment();
				if (!remoteEnv) {
					throw new Error('Cannot provide init data for remote extension host!');
				}

				const myExtensions = runningLocations.filterByExtensionHostKind(snapshot.extensions, ExtensionHostKind.Remote);
				const extensions = new ExtensionHostExtensions(snapshot.versionId, snapshot.extensions, myExtensions.map(extension => extension.identifier));

				return {
					connectionData: this._remoteAuthorityResolverService.getConnectionData(remoteAuthority),
					pid: remoteEnv.pid,
					appRoot: remoteEnv.appRoot,
					extensionHostLogsPath: remoteEnv.extensionHostLogsPath,
					globalStorageHome: remoteEnv.globalStorageHome,
					workspaceStorageHome: remoteEnv.workspaceStorageHome,
					extensions,
				};
			}
		};
	}
}

export class BrowserExtensionHostKindPicker implements IExtensionHostKindPicker {

	constructor(
		@ILogService private readonly _logService: ILogService,
	) { }

	pickExtensionHostKind(extensionId: ExtensionIdentifier, extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference): ExtensionHostKind | null {
		const result = BrowserExtensionHostKindPicker.pickRunningLocation(extensionKinds, isInstalledLocally, isInstalledRemotely, preference);
		this._logService.trace(`pickRunningLocation for ${extensionId.value}, extension kinds: [${extensionKinds.join(', ')}], isInstalledLocally: ${isInstalledLocally}, isInstalledRemotely: ${isInstalledRemotely}, preference: ${extensionRunningPreferenceToString(preference)} => ${extensionHostKindToString(result)}`);
		return result;
	}

	public static pickRunningLocation(extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference): ExtensionHostKind | null {
		const result: ExtensionHostKind[] = [];
		let canRunRemotely = false;
		for (const extensionKind of extensionKinds) {
			if (extensionKind === 'ui' && isInstalledRemotely) {
				// ui extensions run remotely if possible (but only as a last resort)
				if (preference === ExtensionRunningPreference.Remote) {
					return ExtensionHostKind.Remote;
				} else {
					canRunRemotely = true;
				}
			}
			if (extensionKind === 'workspace' && isInstalledRemotely) {
				// workspace extensions run remotely if possible
				if (preference === ExtensionRunningPreference.None || preference === ExtensionRunningPreference.Remote) {
					return ExtensionHostKind.Remote;
				} else {
					result.push(ExtensionHostKind.Remote);
				}
			}
			if (extensionKind === 'web' && (isInstalledLocally || isInstalledRemotely)) {
				// web worker extensions run in the local web worker if possible
				if (preference === ExtensionRunningPreference.None || preference === ExtensionRunningPreference.Local) {
					return ExtensionHostKind.LocalWebWorker;
				} else {
					result.push(ExtensionHostKind.LocalWebWorker);
				}
			}
		}
		if (canRunRemotely) {
			result.push(ExtensionHostKind.Remote);
		}
		return (result.length > 0 ? result[0] : null);
	}
}

registerSingleton(IExtensionService, ExtensionService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/browser/extensionsScannerService.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/browser/extensionsScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionsProfileScannerService } from '../../../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { AbstractExtensionsScannerService, IExtensionsScannerService, Translations, } from '../../../../platform/extensionManagement/common/extensionsScannerService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';

export class ExtensionsScannerService extends AbstractExtensionsScannerService implements IExtensionsScannerService {

	constructor(
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IExtensionsProfileScannerService extensionsProfileScannerService: IExtensionsProfileScannerService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IProductService productService: IProductService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(
			uriIdentityService.extUri.joinPath(environmentService.userRoamingDataHome, 'systemExtensions'),
			uriIdentityService.extUri.joinPath(environmentService.userRoamingDataHome, 'userExtensions'),
			uriIdentityService.extUri.joinPath(environmentService.userRoamingDataHome, 'userExtensions', 'control.json'),
			userDataProfileService.currentProfile,
			userDataProfilesService, extensionsProfileScannerService, fileService, logService, environmentService, productService, uriIdentityService, instantiationService);
	}

	protected async getTranslations(): Promise<Translations> {
		return {};
	}

}

registerSingleton(IExtensionsScannerService, ExtensionsScannerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/browser/extensionUrlHandler.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/browser/extensionUrlHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { IDisposable, combinedDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { createDecorator, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IURLHandler, IURLService, IOpenURLOptions } from '../../../../platform/url/common/url.js';
import { IHostService } from '../../host/browser/host.js';
import { ActivationKind, IExtensionService } from '../common/extensions.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { disposableWindowInterval } from '../../../../base/browser/dom.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { equalsIgnoreCase } from '../../../../base/common/strings.js';

const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_SECONDS = 30 * 1000;
const URL_TO_HANDLE = 'extensionUrlHandler.urlToHandle';
const USER_TRUSTED_EXTENSIONS_CONFIGURATION_KEY = 'extensions.confirmedUriHandlerExtensionIds';
const USER_TRUSTED_EXTENSIONS_STORAGE_KEY = 'extensionUrlHandler.confirmedExtensions';

function isExtensionId(value: string): boolean {
	return /^[a-z0-9][a-z0-9\-]*\.[a-z0-9][a-z0-9\-]*$/i.test(value);
}

class UserTrustedExtensionIdStorage {

	get extensions(): string[] {
		const userTrustedExtensionIdsJson = this.storageService.get(USER_TRUSTED_EXTENSIONS_STORAGE_KEY, StorageScope.PROFILE, '[]');

		try {
			return JSON.parse(userTrustedExtensionIdsJson);
		} catch {
			return [];
		}
	}

	constructor(private storageService: IStorageService) { }

	has(id: string): boolean {
		return this.extensions.indexOf(id) > -1;
	}

	add(id: string): void {
		this.set([...this.extensions, id]);
	}

	set(ids: string[]): void {
		this.storageService.store(USER_TRUSTED_EXTENSIONS_STORAGE_KEY, JSON.stringify(ids), StorageScope.PROFILE, StorageTarget.MACHINE);
	}
}

export const IExtensionUrlHandler = createDecorator<IExtensionUrlHandler>('extensionUrlHandler');

export interface IExtensionContributedURLHandler extends IURLHandler {
	extensionDisplayName: string;
}

export interface IExtensionUrlHandler {
	readonly _serviceBrand: undefined;
	registerExtensionHandler(extensionId: ExtensionIdentifier, handler: IExtensionContributedURLHandler): void;
	unregisterExtensionHandler(extensionId: ExtensionIdentifier): void;
}

export interface IExtensionUrlHandlerOverride {
	canHandleURL(uri: URI): boolean;
	handleURL(uri: URI): Promise<boolean>;
}

export class ExtensionUrlHandlerOverrideRegistry {

	private static readonly handlers = new Set<IExtensionUrlHandlerOverride>();

	static registerHandler(handler: IExtensionUrlHandlerOverride): IDisposable {
		this.handlers.add(handler);

		return toDisposable(() => this.handlers.delete(handler));
	}

	static getHandler(uri: URI): IExtensionUrlHandlerOverride | undefined {
		for (const handler of this.handlers) {
			if (handler.canHandleURL(uri)) {
				return handler;
			}
		}

		return undefined;
	}
}

/**
 * This class handles URLs which are directed towards extensions.
 * If a URL is directed towards an inactive extension, it buffers it,
 * activates the extension and re-opens the URL once the extension registers
 * a URL handler. If the extension never registers a URL handler, the urls
 * will eventually be garbage collected.
 *
 * It also makes sure the user confirms opening URLs directed towards extensions.
 */
class ExtensionUrlHandler implements IExtensionUrlHandler, IURLHandler {

	readonly _serviceBrand: undefined;

	private extensionHandlers = new Map<string, IExtensionContributedURLHandler>();
	private uriBuffer = new Map<string, { timestamp: number; uri: URI }[]>();
	private userTrustedExtensionsStorage: UserTrustedExtensionIdStorage;
	private disposable: IDisposable;

	constructor(
		@IURLService urlService: IURLService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IDialogService private readonly dialogService: IDialogService,
		@ICommandService private readonly commandService: ICommandService,
		@IHostService private readonly hostService: IHostService,
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INotificationService private readonly notificationService: INotificationService,
		@IProductService private readonly productService: IProductService,
	) {
		this.userTrustedExtensionsStorage = new UserTrustedExtensionIdStorage(storageService);

		const interval = disposableWindowInterval(mainWindow, () => this.garbageCollect(), THIRTY_SECONDS);
		const urlToHandleValue = this.storageService.get(URL_TO_HANDLE, StorageScope.WORKSPACE);
		if (urlToHandleValue) {
			this.storageService.remove(URL_TO_HANDLE, StorageScope.WORKSPACE);
			this.handleURL(URI.revive(JSON.parse(urlToHandleValue)), { trusted: true });
		}

		this.disposable = combinedDisposable(
			urlService.registerHandler(this),
			interval
		);

		const cache = ExtensionUrlBootstrapHandler.cache;
		setTimeout(() => cache.forEach(([uri, option]) => this.handleURL(uri, option)));
	}

	async handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		if (!isExtensionId(uri.authority)) {
			return false;
		}

		const overrideHandler = ExtensionUrlHandlerOverrideRegistry.getHandler(uri);
		if (overrideHandler) {
			const handled = await overrideHandler.handleURL(uri);
			if (handled) {
				return handled;
			}
		}

		const extensionId = uri.authority;

		const initialHandler = this.extensionHandlers.get(ExtensionIdentifier.toKey(extensionId));
		let extensionDisplayName: string;

		if (!initialHandler) {
			// The extension is not yet activated, so let's check if it is installed and enabled
			const extension = await this.extensionService.getExtension(extensionId);
			if (!extension) {
				await this.handleUnhandledURL(uri, extensionId, options);
				return true;
			} else {
				extensionDisplayName = extension.displayName ?? '';
			}
		} else {
			extensionDisplayName = initialHandler.extensionDisplayName;
		}

		const trusted = options?.trusted
			|| this.productService.trustedExtensionProtocolHandlers?.some(value => equalsIgnoreCase(value, extensionId))
			|| this.didUserTrustExtension(ExtensionIdentifier.toKey(extensionId));

		if (!trusted) {
			const uriString = uri.toString(false);
			let uriLabel = uriString;

			if (uriLabel.length > 40) {
				uriLabel = `${uriLabel.substring(0, 30)}...${uriLabel.substring(uriLabel.length - 5)}`;
			}

			const result = await this.dialogService.confirm({
				message: localize('confirmUrl', "Allow '{0}' extension to open this URI?", extensionDisplayName),
				checkbox: {
					label: localize('rememberConfirmUrl', "Do not ask me again for this extension"),
				},
				primaryButton: localize({ key: 'open', comment: ['&& denotes a mnemonic'] }, "&&Open"),
				custom: {
					markdownDetails: [{
						markdown: new MarkdownString(`<div title="${uriString}" aria-label='${uriString}'>${uriLabel}</div>`, { supportHtml: true }),
					}]
				}
			});

			if (!result.confirmed) {
				return true;
			}

			if (result.checkboxChecked) {
				this.userTrustedExtensionsStorage.add(ExtensionIdentifier.toKey(extensionId));
			}
		}

		const handler = this.extensionHandlers.get(ExtensionIdentifier.toKey(extensionId));

		if (handler) {
			if (!initialHandler) {
				// forward it directly
				return await this.handleURLByExtension(extensionId, handler, uri, options);
			}

			// let the ExtensionUrlHandler instance handle this
			return false;
		}

		// collect URI for eventual extension activation
		const timestamp = new Date().getTime();
		let uris = this.uriBuffer.get(ExtensionIdentifier.toKey(extensionId));

		if (!uris) {
			uris = [];
			this.uriBuffer.set(ExtensionIdentifier.toKey(extensionId), uris);
		}

		uris.push({ timestamp, uri });

		// activate the extension using ActivationKind.Immediate because URI handling might be part
		// of resolving authorities (via authentication extensions)
		await this.extensionService.activateByEvent(`onUri:${ExtensionIdentifier.toKey(extensionId)}`, ActivationKind.Immediate);
		return true;
	}

	registerExtensionHandler(extensionId: ExtensionIdentifier, handler: IExtensionContributedURLHandler): void {
		this.extensionHandlers.set(ExtensionIdentifier.toKey(extensionId), handler);

		const uris = this.uriBuffer.get(ExtensionIdentifier.toKey(extensionId)) || [];

		for (const { uri } of uris) {
			this.handleURLByExtension(extensionId, handler, uri);
		}

		this.uriBuffer.delete(ExtensionIdentifier.toKey(extensionId));
	}

	unregisterExtensionHandler(extensionId: ExtensionIdentifier): void {
		this.extensionHandlers.delete(ExtensionIdentifier.toKey(extensionId));
	}

	private async handleURLByExtension(extensionId: ExtensionIdentifier | string, handler: IURLHandler, uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		return await handler.handleURL(uri, options);
	}

	private async handleUnhandledURL(uri: URI, extensionId: string, options?: IOpenURLOptions): Promise<void> {
		try {
			await this.commandService.executeCommand('workbench.extensions.installExtension', extensionId, {
				justification: {
					reason: `${localize('installDetail', "This extension wants to open a URI:")}\n${uri.toString()}`,
					action: localize('openUri', "Open URI")
				},
				enable: true,
				installPreReleaseVersion: this.productService.quality !== 'stable'
			});
		} catch (error) {
			if (!isCancellationError(error)) {
				this.notificationService.error(error);
			}
			return;
		}

		const extension = await this.extensionService.getExtension(extensionId);

		if (extension) {
			await this.handleURL(uri, { ...options, trusted: true });
		}

		/* Extension cannot be added and require window reload */
		else {
			const result = await this.dialogService.confirm({
				message: localize('reloadAndHandle', "Extension '{0}' is not loaded. Would you like to reload the window to load the extension and open the URL?", extensionId),
				primaryButton: localize({ key: 'reloadAndOpen', comment: ['&& denotes a mnemonic'] }, "&&Reload Window and Open")
			});

			if (!result.confirmed) {
				return;
			}

			this.storageService.store(URL_TO_HANDLE, JSON.stringify(uri.toJSON()), StorageScope.WORKSPACE, StorageTarget.MACHINE);
			await this.hostService.reload();
		}
	}

	// forget about all uris buffered more than 5 minutes ago
	private garbageCollect(): void {
		const now = new Date().getTime();
		const uriBuffer = new Map<string, { timestamp: number; uri: URI }[]>();

		this.uriBuffer.forEach((uris, extensionId) => {
			uris = uris.filter(({ timestamp }) => now - timestamp < FIVE_MINUTES);

			if (uris.length > 0) {
				uriBuffer.set(extensionId, uris);
			}
		});

		this.uriBuffer = uriBuffer;
	}

	private didUserTrustExtension(id: string): boolean {
		if (this.userTrustedExtensionsStorage.has(id)) {
			return true;
		}

		return this.getConfirmedTrustedExtensionIdsFromConfiguration().indexOf(id) > -1;
	}

	private getConfirmedTrustedExtensionIdsFromConfiguration(): Array<string> {
		const trustedExtensionIds = this.configurationService.getValue(USER_TRUSTED_EXTENSIONS_CONFIGURATION_KEY);

		if (!Array.isArray(trustedExtensionIds)) {
			return [];
		}

		return trustedExtensionIds;
	}

	dispose(): void {
		this.disposable.dispose();
		this.extensionHandlers.clear();
		this.uriBuffer.clear();
	}
}

registerSingleton(IExtensionUrlHandler, ExtensionUrlHandler, InstantiationType.Eager);

/**
 * This class handles URLs before `ExtensionUrlHandler` is instantiated.
 * More info: https://github.com/microsoft/vscode/issues/73101
 */
class ExtensionUrlBootstrapHandler implements IWorkbenchContribution, IURLHandler {

	static readonly ID = 'workbench.contrib.extensionUrlBootstrapHandler';

	private static _cache: [URI, IOpenURLOptions | undefined][] = [];
	private static disposable: IDisposable;

	static get cache(): [URI, IOpenURLOptions | undefined][] {
		ExtensionUrlBootstrapHandler.disposable.dispose();

		const result = ExtensionUrlBootstrapHandler._cache;
		ExtensionUrlBootstrapHandler._cache = [];
		return result;
	}

	constructor(@IURLService urlService: IURLService) {
		ExtensionUrlBootstrapHandler.disposable = urlService.registerHandler(this);
	}

	async handleURL(uri: URI, options?: IOpenURLOptions): Promise<boolean> {
		if (!isExtensionId(uri.authority)) {
			return false;
		}

		ExtensionUrlBootstrapHandler._cache.push([uri, options]);
		return true;
	}
}

registerWorkbenchContribution2(ExtensionUrlBootstrapHandler.ID, ExtensionUrlBootstrapHandler, WorkbenchPhase.BlockRestore /* registration only */);

class ManageAuthorizedExtensionURIsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.extensions.action.manageAuthorizedExtensionURIs',
			title: localize2('manage', 'Manage Authorized Extension URIs...'),
			category: localize2('extensions', 'Extensions'),
			menu: {
				id: MenuId.CommandPalette,
				when: IsWebContext.toNegated()
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const storageService = accessor.get(IStorageService);
		const quickInputService = accessor.get(IQuickInputService);
		const storage = new UserTrustedExtensionIdStorage(storageService);
		const items = storage.extensions.map((label): IQuickPickItem => ({ label, picked: true }));

		if (items.length === 0) {
			await quickInputService.pick([{ label: localize('no', 'There are currently no authorized extension URIs.') }]);
			return;
		}

		const result = await quickInputService.pick(items, { canPickMany: true });

		if (!result) {
			return;
		}

		storage.set(result.map(item => item.label));
	}
}

registerAction2(ManageAuthorizedExtensionURIsAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/browser/webWorkerExtensionHost.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/browser/webWorkerExtensionHost.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { parentOriginHash } from '../../../../base/browser/iframe.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Barrier } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { canceled, onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { AppResourcePath, COI, FileAccess } from '../../../../base/common/network.js';
import * as platform from '../../../../base/common/platform.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc.js';
import { getNLSLanguage, getNLSMessages } from '../../../../nls.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { ILogService, ILoggerService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { isLoggingOnly } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { WebWorkerDescriptor } from '../../../../platform/webWorker/browser/webWorkerDescriptor.js';
import { IWebWorkerService } from '../../../../platform/webWorker/browser/webWorkerService.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { ExtensionHostExitCode, IExtensionHostInitData, MessageType, UIKind, createMessageOfType, isMessageOfType } from '../common/extensionHostProtocol.js';
import { LocalWebWorkerRunningLocation } from '../common/extensionRunningLocation.js';
import { ExtensionHostExtensions, ExtensionHostStartup, IExtensionHost } from '../common/extensions.js';

export interface IWebWorkerExtensionHostInitData {
	readonly extensions: ExtensionHostExtensions;
}

export interface IWebWorkerExtensionHostDataProvider {
	getInitData(): Promise<IWebWorkerExtensionHostInitData>;
}

export class WebWorkerExtensionHost extends Disposable implements IExtensionHost {

	public readonly pid = null;
	public readonly remoteAuthority = null;
	public extensions: ExtensionHostExtensions | null = null;

	private readonly _onDidExit = this._register(new Emitter<[number, string | null]>());
	public readonly onExit: Event<[number, string | null]> = this._onDidExit.event;

	private _isTerminating: boolean;
	private _protocolPromise: Promise<IMessagePassingProtocol> | null;
	private _protocol: IMessagePassingProtocol | null;

	private readonly _extensionHostLogsLocation: URI;

	constructor(
		public readonly runningLocation: LocalWebWorkerRunningLocation,
		public readonly startup: ExtensionHostStartup,
		private readonly _initDataProvider: IWebWorkerExtensionHostDataProvider,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IWorkspaceContextService private readonly _contextService: IWorkspaceContextService,
		@ILabelService private readonly _labelService: ILabelService,
		@ILogService private readonly _logService: ILogService,
		@ILoggerService private readonly _loggerService: ILoggerService,
		@IBrowserWorkbenchEnvironmentService private readonly _environmentService: IBrowserWorkbenchEnvironmentService,
		@IUserDataProfilesService private readonly _userDataProfilesService: IUserDataProfilesService,
		@IProductService private readonly _productService: IProductService,
		@ILayoutService private readonly _layoutService: ILayoutService,
		@IStorageService private readonly _storageService: IStorageService,
		@IWebWorkerService private readonly _webWorkerService: IWebWorkerService,
	) {
		super();
		this._isTerminating = false;
		this._protocolPromise = null;
		this._protocol = null;
		this._extensionHostLogsLocation = joinPath(this._environmentService.extHostLogsPath, 'webWorker');
	}

	private async _getWebWorkerExtensionHostIframeSrc(): Promise<string> {
		const suffixSearchParams = new URLSearchParams();
		if (this._environmentService.debugExtensionHost && this._environmentService.debugRenderer) {
			suffixSearchParams.set('debugged', '1');
		}
		COI.addSearchParam(suffixSearchParams, true, true);

		const suffix = `?${suffixSearchParams.toString()}`;

		const iframeModulePath: AppResourcePath = `vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.html`;
		if (platform.isWeb) {
			const webEndpointUrlTemplate = this._productService.webEndpointUrlTemplate;
			const commit = this._productService.commit;
			const quality = this._productService.quality;
			if (webEndpointUrlTemplate && commit && quality) {
				// Try to keep the web worker extension host iframe origin stable by storing it in workspace storage
				const key = 'webWorkerExtensionHostIframeStableOriginUUID';
				let stableOriginUUID = this._storageService.get(key, StorageScope.WORKSPACE);
				if (typeof stableOriginUUID === 'undefined') {
					stableOriginUUID = generateUuid();
					this._storageService.store(key, stableOriginUUID, StorageScope.WORKSPACE, StorageTarget.MACHINE);
				}
				const hash = await parentOriginHash(mainWindow.origin, stableOriginUUID);
				const baseUrl = (
					webEndpointUrlTemplate
						.replace('{{uuid}}', `v--${hash}`) // using `v--` as a marker to require `parentOrigin`/`salt` verification
						.replace('{{commit}}', commit)
						.replace('{{quality}}', quality)
				);

				const res = new URL(`${baseUrl}/out/${iframeModulePath}${suffix}`);
				res.searchParams.set('parentOrigin', mainWindow.origin);
				res.searchParams.set('salt', stableOriginUUID);
				return res.toString();
			}

			console.warn(`The web worker extension host is started in a same-origin iframe!`);
		}

		const relativeExtensionHostIframeSrc = this._webWorkerService.getWorkerUrl(new WebWorkerDescriptor({
			esmModuleLocation: FileAccess.asBrowserUri(iframeModulePath),
			esmModuleLocationBundler: new URL(`../worker/webWorkerExtensionHostIframe.html`, import.meta.url),
			label: 'webWorkerExtensionHostIframe'
		}));

		return `${relativeExtensionHostIframeSrc}${suffix}`;
	}

	public async start(): Promise<IMessagePassingProtocol> {
		if (!this._protocolPromise) {
			this._protocolPromise = this._startInsideIframe();
			this._protocolPromise.then(protocol => this._protocol = protocol);
		}
		return this._protocolPromise;
	}

	private async _startInsideIframe(): Promise<IMessagePassingProtocol> {
		const webWorkerExtensionHostIframeSrc = await this._getWebWorkerExtensionHostIframeSrc();
		const emitter = this._register(new Emitter<VSBuffer>());

		const iframe = document.createElement('iframe');
		iframe.setAttribute('class', 'web-worker-ext-host-iframe');
		iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
		iframe.setAttribute('allow', 'usb; serial; hid; cross-origin-isolated; local-network-access;');
		iframe.setAttribute('aria-hidden', 'true');
		iframe.style.display = 'none';

		const vscodeWebWorkerExtHostId = generateUuid();
		iframe.setAttribute('src', `${webWorkerExtensionHostIframeSrc}&vscodeWebWorkerExtHostId=${vscodeWebWorkerExtHostId}`);

		const barrier = new Barrier();
		let port!: MessagePort;
		let barrierError: Error | null = null;
		let barrierHasError = false;
		let startTimeout: Timeout | undefined = undefined;

		const rejectBarrier = (exitCode: number, error: Error) => {
			barrierError = error;
			barrierHasError = true;
			onUnexpectedError(barrierError);
			clearTimeout(startTimeout);
			this._onDidExit.fire([ExtensionHostExitCode.UnexpectedError, barrierError.message]);
			barrier.open();
		};

		const resolveBarrier = (messagePort: MessagePort) => {
			port = messagePort;
			clearTimeout(startTimeout);
			barrier.open();
		};

		startTimeout = setTimeout(() => {
			console.warn(`The Web Worker Extension Host did not start in 60s, that might be a problem.`);
		}, 60000);

		this._register(dom.addDisposableListener(mainWindow, 'message', (event) => {
			if (event.source !== iframe.contentWindow) {
				return;
			}
			if (event.data.vscodeWebWorkerExtHostId !== vscodeWebWorkerExtHostId) {
				return;
			}
			if (event.data.error) {
				const { name, message, stack } = event.data.error;
				const err = new Error();
				err.message = message;
				err.name = name;
				err.stack = stack;
				return rejectBarrier(ExtensionHostExitCode.UnexpectedError, err);
			}
			if (event.data.type === 'vscode.bootstrap.nls') {
				iframe.contentWindow!.postMessage({
					type: event.data.type,
					data: {
						workerUrl: this._webWorkerService.getWorkerUrl(extensionHostWorkerMainDescriptor),
						fileRoot: globalThis._VSCODE_FILE_ROOT,
						nls: {
							messages: getNLSMessages(),
							language: getNLSLanguage()
						}
					}
				}, '*');
				return;
			}
			const { data } = event.data;
			if (barrier.isOpen() || !(data instanceof MessagePort)) {
				console.warn('UNEXPECTED message', event);
				const err = new Error('UNEXPECTED message');
				return rejectBarrier(ExtensionHostExitCode.UnexpectedError, err);
			}
			resolveBarrier(data);
		}));

		this._layoutService.mainContainer.appendChild(iframe);
		this._register(toDisposable(() => iframe.remove()));

		// await MessagePort and use it to directly communicate
		// with the worker extension host
		await barrier.wait();

		if (barrierHasError) {
			throw barrierError;
		}

		// Send over message ports for extension API
		const messagePorts = this._environmentService.options?.messagePorts ?? new Map();
		iframe.contentWindow!.postMessage({ type: 'vscode.init', data: messagePorts }, '*', [...messagePorts.values()]);

		port.onmessage = (event) => {
			const { data } = event;
			if (!(data instanceof ArrayBuffer)) {
				console.warn('UNKNOWN data received', data);
				this._onDidExit.fire([77, 'UNKNOWN data received']);
				return;
			}
			emitter.fire(VSBuffer.wrap(new Uint8Array(data, 0, data.byteLength)));
		};

		const protocol: IMessagePassingProtocol = {
			onMessage: emitter.event,
			send: vsbuf => {
				const data = vsbuf.buffer.buffer.slice(vsbuf.buffer.byteOffset, vsbuf.buffer.byteOffset + vsbuf.buffer.byteLength);
				port.postMessage(data, [data]);
			}
		};

		return this._performHandshake(protocol);
	}

	private async _performHandshake(protocol: IMessagePassingProtocol): Promise<IMessagePassingProtocol> {
		// extension host handshake happens below
		// (1) <== wait for: Ready
		// (2) ==> send: init data
		// (3) <== wait for: Initialized

		await Event.toPromise(Event.filter(protocol.onMessage, msg => isMessageOfType(msg, MessageType.Ready)));
		if (this._isTerminating) {
			throw canceled();
		}
		protocol.send(VSBuffer.fromString(JSON.stringify(await this._createExtHostInitData())));
		if (this._isTerminating) {
			throw canceled();
		}
		await Event.toPromise(Event.filter(protocol.onMessage, msg => isMessageOfType(msg, MessageType.Initialized)));
		if (this._isTerminating) {
			throw canceled();
		}

		return protocol;
	}

	public override dispose(): void {
		if (this._isTerminating) {
			return;
		}
		this._isTerminating = true;
		this._protocol?.send(createMessageOfType(MessageType.Terminate));
		super.dispose();
	}

	getInspectPort(): undefined {
		return undefined;
	}

	enableInspectPort(): Promise<boolean> {
		return Promise.resolve(false);
	}

	private async _createExtHostInitData(): Promise<IExtensionHostInitData> {
		const initData = await this._initDataProvider.getInitData();
		this.extensions = initData.extensions;
		const workspace = this._contextService.getWorkspace();
		const nlsBaseUrl = this._productService.extensionsGallery?.nlsBaseUrl;
		let nlsUrlWithDetails: URI | undefined = undefined;
		// Only use the nlsBaseUrl if we are using a language other than the default, English.
		if (nlsBaseUrl && this._productService.commit && !platform.Language.isDefaultVariant()) {
			nlsUrlWithDetails = URI.joinPath(URI.parse(nlsBaseUrl), this._productService.commit, this._productService.version, platform.Language.value());
		}
		return {
			commit: this._productService.commit,
			version: this._productService.version,
			quality: this._productService.quality,
			date: this._productService.date,
			parentPid: 0,
			environment: {
				isExtensionDevelopmentDebug: this._environmentService.debugRenderer,
				appName: this._productService.nameLong,
				appHost: this._productService.embedderIdentifier ?? (platform.isWeb ? 'web' : 'desktop'),
				appUriScheme: this._productService.urlProtocol,
				appLanguage: platform.language,
				isExtensionTelemetryLoggingOnly: isLoggingOnly(this._productService, this._environmentService),
				extensionDevelopmentLocationURI: this._environmentService.extensionDevelopmentLocationURI,
				extensionTestsLocationURI: this._environmentService.extensionTestsLocationURI,
				globalStorageHome: this._userDataProfilesService.defaultProfile.globalStorageHome,
				workspaceStorageHome: this._environmentService.workspaceStorageHome,
				extensionLogLevel: this._environmentService.extensionLogLevel
			},
			workspace: this._contextService.getWorkbenchState() === WorkbenchState.EMPTY ? undefined : {
				configuration: workspace.configuration || undefined,
				id: workspace.id,
				name: this._labelService.getWorkspaceLabel(workspace),
				transient: workspace.transient
			},
			consoleForward: {
				includeStack: false,
				logNative: this._environmentService.debugRenderer
			},
			extensions: this.extensions.toSnapshot(),
			nlsBaseUrl: nlsUrlWithDetails,
			telemetryInfo: {
				sessionId: this._telemetryService.sessionId,
				machineId: this._telemetryService.machineId,
				sqmId: this._telemetryService.sqmId,
				devDeviceId: this._telemetryService.devDeviceId ?? this._telemetryService.machineId,
				firstSessionDate: this._telemetryService.firstSessionDate,
				msftInternal: this._telemetryService.msftInternal
			},
			logLevel: this._logService.getLevel(),
			loggers: [...this._loggerService.getRegisteredLoggers()],
			logsLocation: this._extensionHostLogsLocation,
			autoStart: (this.startup === ExtensionHostStartup.EagerAutoStart || this.startup === ExtensionHostStartup.LazyAutoStart),
			remote: {
				authority: this._environmentService.remoteAuthority,
				connectionData: null,
				isRemote: false
			},
			uiKind: platform.isWeb ? UIKind.Web : UIKind.Desktop
		};
	}
}

const extensionHostWorkerMainDescriptor = new WebWorkerDescriptor({
	label: 'extensionHostWorkerMain',
	esmModuleLocation: () => FileAccess.asBrowserUri('vs/workbench/api/worker/extensionHostWorkerMain.js'),
	esmModuleLocationBundler: () => new URL('../../../api/worker/extensionHostWorkerMain.ts?workerModule', import.meta.url),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/browser/webWorkerFileSystemProvider.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/browser/webWorkerFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FileSystemProviderCapabilities, IStat, FileType, IFileDeleteOptions, IFileOverwriteOptions, IFileWriteOptions, FileSystemProviderErrorCode, IFileSystemProviderWithFileReadWriteCapability, createFileSystemProviderError } from '../../../../platform/files/common/files.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable, Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { NotSupportedError } from '../../../../base/common/errors.js';

export class FetchFileSystemProvider implements IFileSystemProviderWithFileReadWriteCapability {

	readonly capabilities = FileSystemProviderCapabilities.Readonly + FileSystemProviderCapabilities.FileReadWrite + FileSystemProviderCapabilities.PathCaseSensitive;
	readonly onDidChangeCapabilities = Event.None;
	readonly onDidChangeFile = Event.None;

	// working implementations
	async readFile(resource: URI): Promise<Uint8Array> {
		try {
			const res = await fetch(resource.toString(true));
			if (res.status === 200) {
				return new Uint8Array(await res.arrayBuffer());
			}
			throw createFileSystemProviderError(res.statusText, FileSystemProviderErrorCode.Unknown);
		} catch (err) {
			throw createFileSystemProviderError(err, FileSystemProviderErrorCode.Unknown);
		}
	}

	// fake implementations
	async stat(_resource: URI): Promise<IStat> {
		return {
			type: FileType.File,
			size: 0,
			mtime: 0,
			ctime: 0
		};
	}

	watch(): IDisposable {
		return Disposable.None;
	}

	// error implementations
	writeFile(_resource: URI, _content: Uint8Array, _opts: IFileWriteOptions): Promise<void> {
		throw new NotSupportedError();
	}
	readdir(_resource: URI): Promise<[string, FileType][]> {
		throw new NotSupportedError();
	}
	mkdir(_resource: URI): Promise<void> {
		throw new NotSupportedError();
	}
	delete(_resource: URI, _opts: IFileDeleteOptions): Promise<void> {
		throw new NotSupportedError();
	}
	rename(_from: URI, _to: URI, _opts: IFileOverwriteOptions): Promise<void> {
		throw new NotSupportedError();
	}
}
```

--------------------------------------------------------------------------------

````
