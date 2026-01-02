---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 369
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 369 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/test/common/languageModels.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/languageModels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { AsyncIterableSource, DeferredPromise, timeout } from '../../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { ChatMessageRole, languageModelChatProviderExtensionPoint, LanguageModelsService, IChatMessage, IChatResponsePart } from '../../common/languageModels.js';
import { IExtensionService, nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../../services/extensions/common/extensionsRegistry.js';
import { DEFAULT_MODEL_PICKER_CATEGORY } from '../../common/modelPicker/modelPickerWidget.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { TestChatEntitlementService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { Event } from '../../../../../base/common/event.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyExpression } from '../../../../../platform/contextkey/common/contextkey.js';

suite('LanguageModels', function () {

	let languageModels: LanguageModelsService;

	const store = new DisposableStore();
	const activationEvents = new Set<string>();

	setup(function () {

		languageModels = new LanguageModelsService(
			new class extends mock<IExtensionService>() {
				override activateByEvent(name: string) {
					activationEvents.add(name);
					return Promise.resolve();
				}
			},
			new NullLogService(),
			new TestStorageService(),
			new MockContextKeyService(),
			new TestConfigurationService(),
			new TestChatEntitlementService()
		);

		const ext = ExtensionsRegistry.getExtensionPoints().find(e => e.name === languageModelChatProviderExtensionPoint.name)!;

		ext.acceptUsers([{
			description: { ...nullExtensionDescription },
			value: { vendor: 'test-vendor' },
			collector: null!
		}, {
			description: { ...nullExtensionDescription },
			value: { vendor: 'actual-vendor' },
			collector: null!
		}]);

		store.add(languageModels.registerLanguageModelProvider('test-vendor', {
			onDidChange: Event.None,
			provideLanguageModelChatInfo: async () => {
				const modelMetadata = [
					{
						extension: nullExtensionDescription.identifier,
						name: 'Pretty Name',
						vendor: 'test-vendor',
						family: 'test-family',
						version: 'test-version',
						modelPickerCategory: undefined,
						id: 'test-id-1',
						maxInputTokens: 100,
						maxOutputTokens: 100,
					},
					{
						extension: nullExtensionDescription.identifier,
						name: 'Pretty Name',
						vendor: 'test-vendor',
						family: 'test2-family',
						version: 'test2-version',
						modelPickerCategory: undefined,
						id: 'test-id-12',
						maxInputTokens: 100,
						maxOutputTokens: 100,
					}
				];
				const modelMetadataAndIdentifier = modelMetadata.map(m => ({
					metadata: m,
					identifier: m.id,
				}));
				return modelMetadataAndIdentifier;
			},
			sendChatRequest: async () => {
				throw new Error();
			},
			provideTokenCount: async () => {
				throw new Error();
			}
		}));
	});

	teardown(function () {
		languageModels.dispose();
		activationEvents.clear();
		store.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty selector returns all', async function () {

		const result1 = await languageModels.selectLanguageModels({});
		assert.deepStrictEqual(result1.length, 2);
		assert.deepStrictEqual(result1[0], 'test-id-1');
		assert.deepStrictEqual(result1[1], 'test-id-12');
	});

	test('selector with id works properly', async function () {
		const result1 = await languageModels.selectLanguageModels({ id: 'test-id-1' });
		assert.deepStrictEqual(result1.length, 1);
		assert.deepStrictEqual(result1[0], 'test-id-1');
	});

	test('no warning that a matching model was not found #213716', async function () {
		const result1 = await languageModels.selectLanguageModels({ vendor: 'test-vendor' });
		assert.deepStrictEqual(result1.length, 2);

		const result2 = await languageModels.selectLanguageModels({ vendor: 'test-vendor', family: 'FAKE' });
		assert.deepStrictEqual(result2.length, 0);
	});

	test('sendChatRequest returns a response-stream', async function () {

		store.add(languageModels.registerLanguageModelProvider('actual-vendor', {
			onDidChange: Event.None,
			provideLanguageModelChatInfo: async () => {
				const modelMetadata = [
					{
						extension: nullExtensionDescription.identifier,
						name: 'Pretty Name',
						vendor: 'actual-vendor',
						family: 'actual-family',
						version: 'actual-version',
						id: 'actual-lm',
						maxInputTokens: 100,
						maxOutputTokens: 100,
						modelPickerCategory: DEFAULT_MODEL_PICKER_CATEGORY,
					}
				];
				const modelMetadataAndIdentifier = modelMetadata.map(m => ({
					metadata: m,
					identifier: m.id,
				}));
				return modelMetadataAndIdentifier;
			},
			sendChatRequest: async (modelId: string, messages: IChatMessage[], _from: ExtensionIdentifier, _options: { [name: string]: any }, token: CancellationToken) => {
				// const message = messages.at(-1);

				const defer = new DeferredPromise();
				const stream = new AsyncIterableSource<IChatResponsePart>();

				(async () => {
					while (!token.isCancellationRequested) {
						stream.emitOne({ type: 'text', value: Date.now().toString() });
						await timeout(10);
					}
					defer.complete(undefined);
				})();

				return {
					stream: stream.asyncIterable,
					result: defer.p
				};
			},
			provideTokenCount: async () => {
				throw new Error();
			}
		}));

		// Register the extension point for the actual vendor
		const ext = ExtensionsRegistry.getExtensionPoints().find(e => e.name === languageModelChatProviderExtensionPoint.name)!;
		ext.acceptUsers([{
			description: { ...nullExtensionDescription },
			value: { vendor: 'actual-vendor' },
			collector: null!
		}]);

		const models = await languageModels.selectLanguageModels({ id: 'actual-lm' });
		assert.ok(models.length === 1);

		const first = models[0];

		const cts = new CancellationTokenSource();

		const request = await languageModels.sendChatRequest(first, nullExtensionDescription.identifier, [{ role: ChatMessageRole.User, content: [{ type: 'text', value: 'hello' }] }], {}, cts.token);

		assert.ok(request);

		cts.dispose(true);

		await request.result;
	});

	test('when clause defaults to true when omitted', async function () {
		const vendors = languageModels.getVendors();
		// Both test-vendor and actual-vendor have no when clause, so they should be visible
		assert.ok(vendors.length >= 2);
		assert.ok(vendors.some(v => v.vendor === 'test-vendor'));
		assert.ok(vendors.some(v => v.vendor === 'actual-vendor'));
	});
});

suite('LanguageModels - When Clause', function () {

	class TestContextKeyService extends MockContextKeyService {
		override contextMatchesRules(rules: ContextKeyExpression): boolean {
			if (!rules) {
				return true;
			}
			// Simple evaluation based on stored keys
			const keys = rules.keys();
			for (const key of keys) {
				const contextKey = this.getContextKeyValue(key);
				// If the key exists and is truthy, the rule matches
				if (contextKey) {
					return true;
				}
			}
			return false;
		}
	}

	let languageModelsWithWhen: LanguageModelsService;
	let contextKeyService: TestContextKeyService;

	setup(function () {
		contextKeyService = new TestContextKeyService();
		contextKeyService.createKey('testKey', true);

		languageModelsWithWhen = new LanguageModelsService(
			new class extends mock<IExtensionService>() {
				override activateByEvent(name: string) {
					return Promise.resolve();
				}
			},
			new NullLogService(),
			new TestStorageService(),
			contextKeyService,
			new TestConfigurationService(),
			new TestChatEntitlementService()
		);

		const ext = ExtensionsRegistry.getExtensionPoints().find(e => e.name === languageModelChatProviderExtensionPoint.name)!;

		ext.acceptUsers([{
			description: { ...nullExtensionDescription },
			value: { vendor: 'visible-vendor', displayName: 'Visible Vendor' },
			collector: null!
		}, {
			description: { ...nullExtensionDescription },
			value: { vendor: 'conditional-vendor', displayName: 'Conditional Vendor', when: 'testKey' },
			collector: null!
		}, {
			description: { ...nullExtensionDescription },
			value: { vendor: 'hidden-vendor', displayName: 'Hidden Vendor', when: 'falseKey' },
			collector: null!
		}]);
	});

	teardown(function () {
		languageModelsWithWhen.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('when clause filters vendors correctly', async function () {
		const vendors = languageModelsWithWhen.getVendors();
		assert.strictEqual(vendors.length, 2);
		assert.ok(vendors.some(v => v.vendor === 'visible-vendor'));
		assert.ok(vendors.some(v => v.vendor === 'conditional-vendor'));
		assert.ok(!vendors.some(v => v.vendor === 'hidden-vendor'));
	});

	test('when clause evaluates to true when context key is true', async function () {
		const vendors = languageModelsWithWhen.getVendors();
		assert.ok(vendors.some(v => v.vendor === 'conditional-vendor'), 'conditional-vendor should be visible when testKey is true');
	});

	test('when clause evaluates to false when context key is false', async function () {
		const vendors = languageModelsWithWhen.getVendors();
		assert.ok(!vendors.some(v => v.vendor === 'hidden-vendor'), 'hidden-vendor should be hidden when falseKey is false');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/languageModels.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/languageModels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { IChatMessage, ILanguageModelChatMetadata, ILanguageModelChatMetadataAndIdentifier, ILanguageModelChatProvider, ILanguageModelChatResponse, ILanguageModelChatSelector, ILanguageModelsService, IUserFriendlyLanguageModel } from '../../common/languageModels.js';

export class NullLanguageModelsService implements ILanguageModelsService {
	_serviceBrand: undefined;

	registerLanguageModelProvider(vendor: string, provider: ILanguageModelChatProvider): IDisposable {
		return Disposable.None;
	}

	onDidChangeLanguageModels = Event.None;

	updateModelPickerPreference(modelIdentifier: string, showInModelPicker: boolean): void {
		return;
	}

	getVendors(): IUserFriendlyLanguageModel[] {
		return [];
	}

	getLanguageModelIds(): string[] {
		return [];
	}

	lookupLanguageModel(identifier: string): ILanguageModelChatMetadata | undefined {
		return undefined;
	}

	getLanguageModels(): ILanguageModelChatMetadataAndIdentifier[] {
		return [];
	}

	setContributedSessionModels(): void {
		return;
	}

	clearContributedSessionModels(): void {
		return;
	}

	async selectLanguageModels(selector: ILanguageModelChatSelector): Promise<string[]> {
		return [];
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sendChatRequest(identifier: string, from: ExtensionIdentifier, messages: IChatMessage[], options: { [name: string]: any }, token: CancellationToken): Promise<ILanguageModelChatResponse> {
		throw new Error('Method not implemented.');
	}

	computeTokenLength(identifier: string, message: string | IChatMessage, token: CancellationToken): Promise<number> {
		throw new Error('Method not implemented.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/mockChatModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/mockChatModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { IChatEditingSession } from '../../common/chatEditingService.js';
import { IChatChangeEvent, IChatModel, IChatRequestModel, IChatRequestNeedsInputInfo, IExportableChatData, IInputModel, ISerializableChatData } from '../../common/chatModel.js';
import { ChatAgentLocation } from '../../common/constants.js';

export class MockChatModel extends Disposable implements IChatModel {
	readonly onDidDispose = this._register(new Emitter<void>()).event;
	readonly onDidChange = this._register(new Emitter<IChatChangeEvent>()).event;
	readonly sessionId = '';
	readonly timestamp = 0;
	readonly timing = { startTime: 0 };
	readonly initialLocation = ChatAgentLocation.Chat;
	readonly title = '';
	readonly hasCustomTitle = false;
	readonly requestInProgress = observableValue('requestInProgress', false);
	readonly requestNeedsInput = observableValue<IChatRequestNeedsInputInfo | undefined>('requestNeedsInput', undefined);
	readonly inputPlaceholder = undefined;
	readonly editingSession = undefined;
	readonly checkpoint = undefined;
	readonly willKeepAlive = true;
	readonly inputModel: IInputModel = {
		state: observableValue('inputModelState', undefined),
		setState: () => { },
		clearState: () => { },
		toJSON: () => undefined
	};
	readonly contributedChatSession = undefined;
	isDisposed = false;
	lastRequestObs: IObservable<IChatRequestModel | undefined>;

	constructor(readonly sessionResource: URI) {
		super();
		this.lastRequest = undefined;
		this.lastRequestObs = observableValue('lastRequest', undefined);
	}

	readonly hasRequests = false;
	readonly lastRequest: IChatRequestModel | undefined;

	override dispose() {
		this.isDisposed = true;
		super.dispose();
	}

	startEditingSession(isGlobalEditingSession?: boolean, transferFromSession?: IChatEditingSession): void { }
	getRequests(): IChatRequestModel[] { return []; }
	setCheckpoint(requestId: string | undefined): void { }
	toExport(): IExportableChatData {
		return {
			initialLocation: this.initialLocation,
			requests: [],
			responderUsername: '',
			responderAvatarIconUri: undefined
		};
	}
	toJSON(): ISerializableChatData {
		return {
			version: 3,
			sessionId: this.sessionId,
			creationDate: this.timestamp,
			lastMessageDate: this.timestamp,
			customTitle: undefined,
			initialLocation: this.initialLocation,
			requests: [],
			responderUsername: '',
			responderAvatarIconUri: undefined
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/mockChatModeService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/mockChatModeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { Event } from '../../../../../base/common/event.js';
import { ChatMode, IChatMode, IChatModeService } from '../../common/chatModes.js';

export class MockChatModeService implements IChatModeService {
	declare readonly _serviceBrand: undefined;

	public readonly onDidChangeChatModes = Event.None;

	constructor(
		private readonly _modes: { builtin: readonly IChatMode[]; custom: readonly IChatMode[] } = { builtin: [ChatMode.Ask], custom: [] }
	) { }

	getModes(): { builtin: readonly IChatMode[]; custom: readonly IChatMode[] } {
		return this._modes;
	}

	findModeById(id: string): IChatMode | undefined {
		return this._modes.builtin.find(mode => mode.id === id) ?? this._modes.custom.find(mode => mode.id === id);
	}

	findModeByName(name: string): IChatMode | undefined {
		return this._modes.builtin.find(mode => mode.name.get() === name) ?? this._modes.custom.find(mode => mode.name.get() === name);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/mockChatService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/mockChatService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { IObservable, observableValue } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { IChatModel, IChatRequestModel, IChatRequestVariableData, ISerializableChatData } from '../../common/chatModel.js';
import { IParsedChatRequest } from '../../common/chatParserTypes.js';
import { IChatCompleteResponse, IChatDetail, IChatModelReference, IChatProgress, IChatProviderInfo, IChatSendRequestData, IChatSendRequestOptions, IChatService, IChatSessionContext, IChatSessionStartOptions, IChatTransferredSessionData, IChatUserActionEvent } from '../../common/chatService.js';
import { ChatAgentLocation } from '../../common/constants.js';

export class MockChatService implements IChatService {
	chatModels: IObservable<Iterable<IChatModel>> = observableValue('chatModels', []);
	requestInProgressObs = observableValue('name', false);
	edits2Enabled: boolean = false;
	_serviceBrand: undefined;
	editingSessions = [];
	transferredSessionData: IChatTransferredSessionData | undefined;
	readonly onDidSubmitRequest: Event<{ readonly chatSessionResource: URI }> = Event.None;

	private sessions = new ResourceMap<IChatModel>();

	setSaveModelsEnabled(enabled: boolean): void {

	}
	isEnabled(location: ChatAgentLocation): boolean {
		throw new Error('Method not implemented.');
	}
	hasSessions(): boolean {
		throw new Error('Method not implemented.');
	}
	getProviderInfos(): IChatProviderInfo[] {
		throw new Error('Method not implemented.');
	}
	startSession(location: ChatAgentLocation, options?: IChatSessionStartOptions): IChatModelReference {
		throw new Error('Method not implemented.');
	}
	addSession(session: IChatModel): void {
		this.sessions.set(session.sessionResource, session);
	}
	getSession(sessionResource: URI): IChatModel | undefined {
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		return this.sessions.get(sessionResource) ?? {} as IChatModel;
	}
	async getOrRestoreSession(sessionResource: URI): Promise<IChatModelReference | undefined> {
		throw new Error('Method not implemented.');
	}
	getPersistedSessionTitle(sessionResource: URI): string | undefined {
		throw new Error('Method not implemented.');
	}
	loadSessionFromContent(data: ISerializableChatData): IChatModelReference | undefined {
		throw new Error('Method not implemented.');
	}
	loadSessionForResource(resource: URI, position: ChatAgentLocation, token: CancellationToken): Promise<IChatModelReference | undefined> {
		throw new Error('Method not implemented.');
	}
	getActiveSessionReference(sessionResource: URI): IChatModelReference | undefined {
		return undefined;
	}
	setTitle(sessionResource: URI, title: string): void {
		throw new Error('Method not implemented.');
	}
	appendProgress(request: IChatRequestModel, progress: IChatProgress): void {

	}
	/**
	 * Returns whether the request was accepted.
	 */
	sendRequest(sessionResource: URI, message: string): Promise<IChatSendRequestData | undefined> {
		throw new Error('Method not implemented.');
	}
	resendRequest(request: IChatRequestModel, options?: IChatSendRequestOptions | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}
	adoptRequest(sessionResource: URI, request: IChatRequestModel): Promise<void> {
		throw new Error('Method not implemented.');
	}
	removeRequest(sessionResource: URI, requestId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	cancelCurrentRequestForSession(sessionResource: URI): void {
		throw new Error('Method not implemented.');
	}
	addCompleteRequest(sessionResource: URI, message: IParsedChatRequest | string, variableData: IChatRequestVariableData | undefined, attempt: number | undefined, response: IChatCompleteResponse): void {
		throw new Error('Method not implemented.');
	}
	async getLocalSessionHistory(): Promise<IChatDetail[]> {
		throw new Error('Method not implemented.');
	}
	async clearAllHistoryEntries() {
		throw new Error('Method not implemented.');
	}
	async removeHistoryEntry(resource: URI) {
		throw new Error('Method not implemented.');
	}

	readonly onDidPerformUserAction: Event<IChatUserActionEvent> = undefined!;
	notifyUserAction(event: IChatUserActionEvent): void {
		throw new Error('Method not implemented.');
	}
	readonly onDidDisposeSession: Event<{ sessionResource: URI[]; reason: 'cleared' }> = undefined!;

	transferChatSession(transferredSessionData: IChatTransferredSessionData, toWorkspace: URI): void {
		throw new Error('Method not implemented.');
	}

	setChatSessionTitle(sessionResource: URI, title: string): void {
		throw new Error('Method not implemented.');
	}

	isEditingLocation(location: ChatAgentLocation): boolean {
		throw new Error('Method not implemented.');
	}

	getChatStorageFolder(): URI {
		throw new Error('Method not implemented.');
	}

	logChatIndex(): void {
		throw new Error('Method not implemented.');
	}

	isPersistedSessionEmpty(sessionResource: URI): boolean {
		throw new Error('Method not implemented.');
	}

	activateDefaultAgent(location: ChatAgentLocation): Promise<void> {
		throw new Error('Method not implemented.');
	}

	getChatSessionFromInternalUri(sessionResource: URI): IChatSessionContext | undefined {
		throw new Error('Method not implemented.');
	}

	async getLiveSessionItems(): Promise<IChatDetail[]> {
		throw new Error('Method not implemented.');
	}
	getHistorySessionItems(): Promise<IChatDetail[]> {
		throw new Error('Method not implemented.');
	}

	waitForModelDisposals(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getMetadataForSession(sessionResource: URI): Promise<IChatDetail | undefined> {
		throw new Error('Method not implemented.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/mockChatSessionsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/mockChatSessionsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { URI } from '../../../../../base/common/uri.js';
import { IChatAgentAttachmentCapabilities } from '../../common/chatAgents.js';
import { IChatModel } from '../../common/chatModel.js';
import { IChatService } from '../../common/chatService.js';
import { IChatSession, IChatSessionContentProvider, IChatSessionItem, IChatSessionItemProvider, IChatSessionProviderOptionGroup, IChatSessionsExtensionPoint, IChatSessionsService, SessionOptionsChangedCallback } from '../../common/chatSessionsService.js';

export class MockChatSessionsService implements IChatSessionsService {
	_serviceBrand: undefined;

	private readonly _onDidChangeSessionOptions = new Emitter<URI>();
	readonly onDidChangeSessionOptions = this._onDidChangeSessionOptions.event;
	private readonly _onDidChangeItemsProviders = new Emitter<IChatSessionItemProvider>();
	readonly onDidChangeItemsProviders = this._onDidChangeItemsProviders.event;

	private readonly _onDidChangeSessionItems = new Emitter<string>();
	readonly onDidChangeSessionItems = this._onDidChangeSessionItems.event;

	private readonly _onDidChangeAvailability = new Emitter<void>();
	readonly onDidChangeAvailability = this._onDidChangeAvailability.event;

	private readonly _onDidChangeInProgress = new Emitter<void>();
	readonly onDidChangeInProgress = this._onDidChangeInProgress.event;

	private readonly _onDidChangeContentProviderSchemes = new Emitter<{ readonly added: string[]; readonly removed: string[] }>();
	readonly onDidChangeContentProviderSchemes = this._onDidChangeContentProviderSchemes.event;

	private readonly _onDidChangeOptionGroups = new Emitter<string>();
	readonly onDidChangeOptionGroups = this._onDidChangeOptionGroups.event;

	private sessionItemProviders = new Map<string, IChatSessionItemProvider>();
	private contentProviders = new Map<string, IChatSessionContentProvider>();
	private contributions: IChatSessionsExtensionPoint[] = [];
	private optionGroups = new Map<string, IChatSessionProviderOptionGroup[]>();
	private sessionOptions = new ResourceMap<Map<string, string>>();
	private inProgress = new Map<string, number>();
	private onChange = () => { };

	// For testing: allow triggering events
	fireDidChangeItemsProviders(provider: IChatSessionItemProvider): void {
		this._onDidChangeItemsProviders.fire(provider);
	}

	fireDidChangeSessionItems(chatSessionType: string): void {
		this._onDidChangeSessionItems.fire(chatSessionType);
	}

	fireDidChangeAvailability(): void {
		this._onDidChangeAvailability.fire();
	}

	fireDidChangeInProgress(): void {
		this._onDidChangeInProgress.fire();
	}

	registerChatSessionItemProvider(provider: IChatSessionItemProvider): IDisposable {
		this.sessionItemProviders.set(provider.chatSessionType, provider);
		return {
			dispose: () => {
				this.sessionItemProviders.delete(provider.chatSessionType);
			}
		};
	}

	getAllChatSessionContributions(): IChatSessionsExtensionPoint[] {
		return this.contributions;
	}

	getChatSessionContribution(chatSessionType: string): IChatSessionsExtensionPoint | undefined {
		return this.contributions.find(contrib => contrib.type === chatSessionType);
	}

	setContributions(contributions: IChatSessionsExtensionPoint[]): void {
		this.contributions = contributions;
	}

	async activateChatSessionItemProvider(chatSessionType: string): Promise<IChatSessionItemProvider | undefined> {
		return this.sessionItemProviders.get(chatSessionType);
	}

	getAllChatSessionItemProviders(): IChatSessionItemProvider[] {
		return Array.from(this.sessionItemProviders.values());
	}

	getIconForSessionType(chatSessionType: string): ThemeIcon | URI | undefined {
		const contribution = this.contributions.find(c => c.type === chatSessionType);
		return contribution?.icon && typeof contribution.icon === 'string' ? ThemeIcon.fromId(contribution.icon) : undefined;
	}

	getWelcomeTitleForSessionType(chatSessionType: string): string | undefined {
		return this.contributions.find(c => c.type === chatSessionType)?.welcomeTitle;
	}

	getWelcomeMessageForSessionType(chatSessionType: string): string | undefined {
		return this.contributions.find(c => c.type === chatSessionType)?.welcomeMessage;
	}

	getInputPlaceholderForSessionType(chatSessionType: string): string | undefined {
		return this.contributions.find(c => c.type === chatSessionType)?.inputPlaceholder;
	}

	getAllChatSessionItems(token: CancellationToken): Promise<Array<{ readonly chatSessionType: string; readonly items: IChatSessionItem[] }>> {
		return Promise.all(Array.from(this.sessionItemProviders.values(), async provider => {
			return {
				chatSessionType: provider.chatSessionType,
				items: await provider.provideChatSessionItems(token),
			};
		}));
	}

	reportInProgress(chatSessionType: string, count: number): void {
		this.inProgress.set(chatSessionType, count);
		this._onDidChangeInProgress.fire();
	}

	getInProgress(): { displayName: string; count: number }[] {
		return Array.from(this.inProgress.entries()).map(([displayName, count]) => ({ displayName, count }));
	}

	registerChatSessionContentProvider(chatSessionType: string, provider: IChatSessionContentProvider): IDisposable {
		this.contentProviders.set(chatSessionType, provider);
		this._onDidChangeContentProviderSchemes.fire({ added: [chatSessionType], removed: [] });
		return {
			dispose: () => {
				this.contentProviders.delete(chatSessionType);
			}
		};
	}

	async canResolveContentProvider(chatSessionType: string): Promise<boolean> {
		return this.contentProviders.has(chatSessionType);
	}

	async getOrCreateChatSession(sessionResource: URI, token: CancellationToken): Promise<IChatSession> {
		const provider = this.contentProviders.get(sessionResource.scheme);
		if (!provider) {
			throw new Error(`No content provider for ${sessionResource.scheme}`);
		}
		return provider.provideChatSessionContent(sessionResource, token);
	}

	async canResolveChatSession(chatSessionResource: URI): Promise<boolean> {
		return this.contentProviders.has(chatSessionResource.scheme);
	}

	getOptionGroupsForSessionType(chatSessionType: string): IChatSessionProviderOptionGroup[] | undefined {
		return this.optionGroups.get(chatSessionType);
	}

	setOptionGroupsForSessionType(chatSessionType: string, handle: number, optionGroups?: IChatSessionProviderOptionGroup[]): void {
		if (optionGroups) {
			this.optionGroups.set(chatSessionType, optionGroups);
		} else {
			this.optionGroups.delete(chatSessionType);
		}
	}

	private optionsChangeCallback?: SessionOptionsChangedCallback;

	setOptionsChangeCallback(callback: SessionOptionsChangedCallback): void {
		this.optionsChangeCallback = callback;
	}

	async notifySessionOptionsChange(sessionResource: URI, updates: ReadonlyArray<{ optionId: string; value: string }>): Promise<void> {
		await this.optionsChangeCallback?.(sessionResource, updates);
	}

	notifySessionItemsChanged(chatSessionType: string): void {
		this._onDidChangeSessionItems.fire(chatSessionType);
	}

	getSessionOption(sessionResource: URI, optionId: string): string | undefined {
		return this.sessionOptions.get(sessionResource)?.get(optionId);
	}

	setSessionOption(sessionResource: URI, optionId: string, value: string): boolean {
		if (!this.sessionOptions.has(sessionResource)) {
			this.sessionOptions.set(sessionResource, new Map());
		}
		this.sessionOptions.get(sessionResource)!.set(optionId, value);
		return true;
	}

	hasAnySessionOptions(resource: URI): boolean {
		return this.sessionOptions.has(resource) && this.sessionOptions.get(resource)!.size > 0;
	}

	getCapabilitiesForSessionType(chatSessionType: string): IChatAgentAttachmentCapabilities | undefined {
		return this.contributions.find(c => c.type === chatSessionType)?.capabilities;
	}

	getContentProviderSchemes(): string[] {
		return Array.from(this.contentProviders.keys());
	}

	getInProgressSessionDescription(chatModel: IChatModel): string | undefined {
		return undefined;
	}

	registerChatModelChangeListeners(chatService: IChatService, chatSessionType: string, onChange: () => void): IDisposable {
		// Store the emitter so tests can trigger it
		this.onChange = onChange;
		return {
			dispose: () => {
			}
		};
	}

	// Helper method for tests to trigger progress events
	triggerProgressEvent(): void {
		if (this.onChange) {
			this.onChange();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/mockChatVariables.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/mockChatVariables.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResourceMap } from '../../../../../base/common/map.js';
import { URI } from '../../../../../base/common/uri.js';
import { IChatVariablesService, IDynamicVariable } from '../../common/chatVariables.js';
import { IToolAndToolSetEnablementMap } from '../../common/languageModelToolsService.js';

export class MockChatVariablesService implements IChatVariablesService {
	_serviceBrand: undefined;

	private _dynamicVariables = new ResourceMap<readonly IDynamicVariable[]>();
	private _selectedToolAndToolSets = new ResourceMap<IToolAndToolSetEnablementMap>();

	getDynamicVariables(sessionResource: URI): readonly IDynamicVariable[] {
		return this._dynamicVariables.get(sessionResource) ?? [];
	}

	getSelectedToolAndToolSets(sessionResource: URI): IToolAndToolSetEnablementMap {
		return this._selectedToolAndToolSets.get(sessionResource) ?? new Map();
	}

	setDynamicVariables(sessionResource: URI, variables: readonly IDynamicVariable[]): void {
		this._dynamicVariables.set(sessionResource, variables);
	}

	setSelectedToolAndToolSets(sessionResource: URI, tools: IToolAndToolSetEnablementMap): void {
		this._selectedToolAndToolSets.set(sessionResource, tools);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/mockLanguageModelToolsConfirmationService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/mockLanguageModelToolsConfirmationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { ConfirmedReason } from '../../common/chatService.js';
import { ILanguageModelToolConfirmationActions, ILanguageModelToolConfirmationContribution, ILanguageModelToolConfirmationRef, ILanguageModelToolsConfirmationService } from '../../common/languageModelToolsConfirmationService.js';
import { IToolData } from '../../common/languageModelToolsService.js';

export class MockLanguageModelToolsConfirmationService implements ILanguageModelToolsConfirmationService {
	manageConfirmationPreferences(tools: readonly IToolData[], options?: { defaultScope?: 'workspace' | 'profile' | 'session' }): void {
		throw new Error('Method not implemented.');
	}
	registerConfirmationContribution(toolName: string, contribution: ILanguageModelToolConfirmationContribution): IDisposable {
		throw new Error('Method not implemented.');
	}
	resetToolAutoConfirmation(): void {

	}
	getPreConfirmAction(ref: ILanguageModelToolConfirmationRef): ConfirmedReason | undefined {
		return undefined;
	}
	getPostConfirmAction(ref: ILanguageModelToolConfirmationRef): ConfirmedReason | undefined {
		return undefined;
	}
	getPreConfirmActions(ref: ILanguageModelToolConfirmationRef): ILanguageModelToolConfirmationActions[] {
		return [];
	}
	getPostConfirmActions(ref: ILanguageModelToolConfirmationRef): ILanguageModelToolConfirmationActions[] {
		return [];
	}
	declare readonly _serviceBrand: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/mockLanguageModelToolsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/mockLanguageModelToolsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { constObservable, IObservable } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { IProgressStep } from '../../../../../platform/progress/common/progress.js';
import { IVariableReference } from '../../common/chatModes.js';
import { ChatRequestToolReferenceEntry } from '../../common/chatVariableEntries.js';
import { CountTokensCallback, ILanguageModelToolsService, IToolAndToolSetEnablementMap, IToolData, IToolImpl, IToolInvocation, IToolResult, ToolDataSource, ToolSet } from '../../common/languageModelToolsService.js';

export class MockLanguageModelToolsService implements ILanguageModelToolsService {
	_serviceBrand: undefined;
	vscodeToolSet: ToolSet = new ToolSet('vscode', 'vscode', ThemeIcon.fromId(Codicon.code.id), ToolDataSource.Internal);
	executeToolSet: ToolSet = new ToolSet('execute', 'execute', ThemeIcon.fromId(Codicon.terminal.id), ToolDataSource.Internal);
	readToolSet: ToolSet = new ToolSet('read', 'read', ThemeIcon.fromId(Codicon.eye.id), ToolDataSource.Internal);

	constructor() { }

	readonly onDidChangeTools: Event<void> = Event.None;
	readonly onDidPrepareToolCallBecomeUnresponsive: Event<{ sessionId: string; toolData: IToolData }> = Event.None;

	registerToolData(toolData: IToolData): IDisposable {
		return Disposable.None;
	}

	resetToolAutoConfirmation(): void {

	}

	getToolPostExecutionAutoConfirmation(toolId: string): 'workspace' | 'profile' | 'session' | 'never' {
		return 'never';
	}

	resetToolPostExecutionAutoConfirmation(): void {

	}

	flushToolUpdates(): void {

	}

	cancelToolCallsForRequest(requestId: string): void {

	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setToolAutoConfirmation(toolId: string, scope: any): void {

	}

	getToolAutoConfirmation(toolId: string): 'never' {
		return 'never';
	}

	registerToolImplementation(name: string, tool: IToolImpl): IDisposable {
		return Disposable.None;
	}

	registerTool(toolData: IToolData, tool: IToolImpl): IDisposable {
		return Disposable.None;
	}

	getTools(): Iterable<IToolData> {
		return [];
	}

	toolsObservable: IObservable<readonly IToolData[]> = constObservable([]);

	getTool(id: string): IToolData | undefined {
		return undefined;
	}

	getToolByName(name: string, includeDisabled?: boolean): IToolData | undefined {
		return undefined;
	}

	acceptProgress(sessionId: string | undefined, callId: string, progress: IProgressStep): void {

	}

	async invokeTool(dto: IToolInvocation, countTokens: CountTokensCallback, token: CancellationToken): Promise<IToolResult> {
		return {
			content: [{ kind: 'text', value: 'result' }]
		};
	}

	toolSets: IObservable<readonly ToolSet[]> = constObservable([]);

	getToolSetByName(name: string): ToolSet | undefined {
		return undefined;
	}

	getToolSet(id: string): ToolSet | undefined {
		return undefined;
	}

	createToolSet(): ToolSet & IDisposable {
		throw new Error('Method not implemented.');
	}

	toToolAndToolSetEnablementMap(toolOrToolSetNames: readonly string[]): IToolAndToolSetEnablementMap {
		throw new Error('Method not implemented.');
	}

	toToolReferences(variableReferences: readonly IVariableReference[]): ChatRequestToolReferenceEntry[] {
		throw new Error('Method not implemented.');
	}

	getFullReferenceNames(): Iterable<string> {
		throw new Error('Method not implemented.');
	}

	getToolByFullReferenceName(qualifiedName: string): IToolData | ToolSet | undefined {
		throw new Error('Method not implemented.');
	}

	getFullReferenceName(tool: IToolData, set?: ToolSet): string {
		throw new Error('Method not implemented.');
	}

	toFullReferenceNames(map: IToolAndToolSetEnablementMap): string[] {
		throw new Error('Method not implemented.');
	}

	getDeprecatedFullReferenceNames(): Map<string, Set<string>> {
		throw new Error('Method not implemented.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/mockPromptsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/mockPromptsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IExtensionDescription } from '../../../../../platform/extensions/common/extensions.js';
import { PromptsType } from '../../common/promptSyntax/promptTypes.js';
import { ParsedPromptFile } from '../../common/promptSyntax/promptFileParser.js';
import { IAgentSkill, ICustomAgent, ICustomAgentQueryOptions, IExternalCustomAgent, IPromptPath, IPromptsService, PromptsStorage } from '../../common/promptSyntax/service/promptsService.js';
import { ResourceSet } from '../../../../../base/common/map.js';

export class MockPromptsService implements IPromptsService {

	_serviceBrand: undefined;

	private readonly _onDidChangeCustomChatModes = new Emitter<void>();
	readonly onDidChangeCustomAgents = this._onDidChangeCustomChatModes.event;

	private _customModes: ICustomAgent[] = [];

	setCustomModes(modes: ICustomAgent[]): void {
		this._customModes = modes;
		this._onDidChangeCustomChatModes.fire();
	}

	async getCustomAgents(token: CancellationToken): Promise<readonly ICustomAgent[]> {
		return this._customModes;
	}

	// Stub implementations for required interface methods
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getSyntaxParserFor(_model: any): any { throw new Error('Not implemented'); }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	listPromptFiles(_type: any): Promise<readonly any[]> { throw new Error('Not implemented'); }
	listPromptFilesForStorage(type: PromptsType, storage: PromptsStorage, token: CancellationToken): Promise<readonly IPromptPath[]> { throw new Error('Not implemented'); }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getSourceFolders(_type: any): readonly any[] { throw new Error('Not implemented'); }
	isValidSlashCommandName(_command: string): boolean { return false; }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	resolvePromptSlashCommand(command: string, _token: CancellationToken): Promise<any> { throw new Error('Not implemented'); }
	get onDidChangeSlashCommands(): Event<void> { throw new Error('Not implemented'); }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getPromptSlashCommands(_token: CancellationToken): Promise<any[]> { throw new Error('Not implemented'); }
	getPromptSlashCommandName(uri: URI, _token: CancellationToken): Promise<string> { throw new Error('Not implemented'); }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parse(_uri: URI, _type: any, _token: CancellationToken): Promise<any> { throw new Error('Not implemented'); }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parseNew(_uri: URI, _token: CancellationToken): Promise<any> { throw new Error('Not implemented'); }
	getParsedPromptFile(textModel: ITextModel): ParsedPromptFile { throw new Error('Not implemented'); }
	registerContributedFile(type: PromptsType, uri: URI, extension: IExtensionDescription, name: string | undefined, description: string | undefined): IDisposable { throw new Error('Not implemented'); }
	getPromptLocationLabel(promptPath: IPromptPath): string { throw new Error('Not implemented'); }
	findAgentMDsInWorkspace(token: CancellationToken): Promise<URI[]> { throw new Error('Not implemented'); }
	listAgentMDs(token: CancellationToken): Promise<URI[]> { throw new Error('Not implemented'); }
	listCopilotInstructionsMDs(token: CancellationToken): Promise<URI[]> { throw new Error('Not implemented'); }
	getAgentFileURIFromModeFile(oldURI: URI): URI | undefined { throw new Error('Not implemented'); }
	getDisabledPromptFiles(type: PromptsType): ResourceSet { throw new Error('Method not implemented.'); }
	setDisabledPromptFiles(type: PromptsType, uris: ResourceSet): void { throw new Error('Method not implemented.'); }
	registerCustomAgentsProvider(extension: IExtensionDescription, provider: { provideCustomAgents: (options: ICustomAgentQueryOptions, token: CancellationToken) => Promise<IExternalCustomAgent[] | undefined> }): IDisposable { throw new Error('Method not implemented.'); }
	findAgentSkills(token: CancellationToken): Promise<IAgentSkill[] | undefined> { throw new Error('Method not implemented.'); }
	dispose(): void { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/voiceChatService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/voiceChatService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { ISpeechProvider, ISpeechService, ISpeechToTextEvent, ISpeechToTextSession, ITextToSpeechSession, KeywordRecognitionStatus, SpeechToTextStatus } from '../../../speech/common/speechService.js';
import { IChatAgent, IChatAgentCommand, IChatAgentCompletionItem, IChatAgentData, IChatAgentHistoryEntry, IChatAgentImplementation, IChatAgentMetadata, IChatAgentRequest, IChatAgentResult, IChatAgentService, IChatParticipantDetectionProvider, UserSelectedTools } from '../../common/chatAgents.js';
import { IChatModel } from '../../common/chatModel.js';
import { IChatFollowup, IChatProgress } from '../../common/chatService.js';
import { ChatAgentLocation, ChatModeKind } from '../../common/constants.js';
import { IVoiceChatSessionOptions, IVoiceChatTextEvent, VoiceChatService } from '../../common/voiceChatService.js';

suite('VoiceChat', () => {

	class TestChatAgentCommand implements IChatAgentCommand {
		constructor(readonly name: string, readonly description: string) { }
	}

	class TestChatAgent implements IChatAgent {

		extensionId: ExtensionIdentifier = nullExtensionDescription.identifier;
		extensionVersion: string | undefined = undefined;
		extensionPublisher = '';
		extensionDisplayName = '';
		extensionPublisherId = '';
		locations: ChatAgentLocation[] = [ChatAgentLocation.Chat];
		modes = [ChatModeKind.Ask];
		public readonly name: string;
		constructor(readonly id: string, readonly slashCommands: IChatAgentCommand[]) {
			this.name = id;
		}
		fullName?: string | undefined;
		description?: string | undefined;
		when?: string | undefined;
		publisherDisplayName?: string | undefined;
		isDefault?: boolean | undefined;
		isDynamic?: boolean | undefined;
		disambiguation: { category: string; description: string; examples: string[] }[] = [];
		provideFollowups?(request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]> {
			throw new Error('Method not implemented.');
		}
		setRequestTools(requestId: string, tools: UserSelectedTools): void {
		}
		invoke(request: IChatAgentRequest, progress: (part: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> { throw new Error('Method not implemented.'); }
		metadata = {};
	}

	const agents: IChatAgent[] = [
		new TestChatAgent('workspace', [
			new TestChatAgentCommand('fix', 'fix'),
			new TestChatAgentCommand('explain', 'explain')
		]),
		new TestChatAgent('vscode', [
			new TestChatAgentCommand('search', 'search')
		]),
	];

	class TestChatAgentService implements IChatAgentService {
		_serviceBrand: undefined;
		readonly onDidChangeAgents = Event.None;
		registerAgentImplementation(id: string, agent: IChatAgentImplementation): IDisposable { throw new Error(); }
		registerDynamicAgent(data: IChatAgentData, agentImpl: IChatAgentImplementation): IDisposable { throw new Error('Method not implemented.'); }
		invokeAgent(id: string, request: IChatAgentRequest, progress: (part: IChatProgress[]) => void, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatAgentResult> { throw new Error(); }
		setRequestTools(agent: string, requestId: string, tools: UserSelectedTools): void { }
		getFollowups(id: string, request: IChatAgentRequest, result: IChatAgentResult, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<IChatFollowup[]> { throw new Error(); }
		getActivatedAgents(): IChatAgent[] { return agents; }
		getAgents(): IChatAgent[] { return agents; }
		getDefaultAgent(): IChatAgent | undefined { throw new Error(); }
		getContributedDefaultAgent(): IChatAgentData | undefined { throw new Error(); }
		registerAgent(id: string, data: IChatAgentData): IDisposable { throw new Error('Method not implemented.'); }
		getAgent(id: string): IChatAgentData | undefined { throw new Error('Method not implemented.'); }
		getAgentsByName(name: string): IChatAgentData[] { throw new Error('Method not implemented.'); }
		updateAgent(id: string, updateMetadata: IChatAgentMetadata): void { throw new Error('Method not implemented.'); }
		getAgentByFullyQualifiedId(id: string): IChatAgentData | undefined { throw new Error('Method not implemented.'); }
		registerAgentCompletionProvider(id: string, provider: (query: string, token: CancellationToken) => Promise<IChatAgentCompletionItem[]>): IDisposable { throw new Error('Method not implemented.'); }
		getAgentCompletionItems(id: string, query: string, token: CancellationToken): Promise<IChatAgentCompletionItem[]> { throw new Error('Method not implemented.'); }
		agentHasDupeName(id: string): boolean { throw new Error('Method not implemented.'); }
		getChatTitle(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> { throw new Error('Method not implemented.'); }
		getChatSummary(id: string, history: IChatAgentHistoryEntry[], token: CancellationToken): Promise<string | undefined> { throw new Error('Method not implemented.'); }
		hasToolsAgent: boolean = false;
		hasChatParticipantDetectionProviders(): boolean {
			throw new Error('Method not implemented.');
		}
		registerChatParticipantDetectionProvider(handle: number, provider: IChatParticipantDetectionProvider): IDisposable {
			throw new Error('Method not implemented.');
		}
		detectAgentOrCommand(request: IChatAgentRequest, history: IChatAgentHistoryEntry[], options: { location: ChatAgentLocation }, token: CancellationToken): Promise<{ agent: IChatAgentData; command?: IChatAgentCommand } | undefined> {
			throw new Error('Method not implemented.');
		}
	}

	class TestSpeechService implements ISpeechService {
		_serviceBrand: undefined;

		onDidChangeHasSpeechProvider = Event.None;

		readonly hasSpeechProvider = true;
		readonly hasActiveSpeechToTextSession = false;
		readonly hasActiveTextToSpeechSession = false;
		readonly hasActiveKeywordRecognition = false;

		registerSpeechProvider(identifier: string, provider: ISpeechProvider): IDisposable { throw new Error('Method not implemented.'); }
		onDidStartSpeechToTextSession = Event.None;
		onDidEndSpeechToTextSession = Event.None;

		async createSpeechToTextSession(token: CancellationToken): Promise<ISpeechToTextSession> {
			return {
				onDidChange: emitter.event
			};
		}

		onDidStartTextToSpeechSession = Event.None;
		onDidEndTextToSpeechSession = Event.None;

		async createTextToSpeechSession(token: CancellationToken): Promise<ITextToSpeechSession> {
			return {
				onDidChange: Event.None,
				synthesize: async () => { }
			};
		}

		onDidStartKeywordRecognition = Event.None;
		onDidEndKeywordRecognition = Event.None;
		recognizeKeyword(token: CancellationToken): Promise<KeywordRecognitionStatus> { throw new Error('Method not implemented.'); }
	}

	const disposables = new DisposableStore();
	let emitter: Emitter<ISpeechToTextEvent>;

	let service: VoiceChatService;
	let event: IVoiceChatTextEvent | undefined;

	async function createSession(options: IVoiceChatSessionOptions) {
		const cts = new CancellationTokenSource();
		disposables.add(toDisposable(() => cts.dispose(true)));
		const session = await service.createVoiceChatSession(cts.token, options);
		disposables.add(session.onDidChange(e => {
			event = e;
		}));
	}

	setup(() => {
		emitter = disposables.add(new Emitter<ISpeechToTextEvent>());
		service = disposables.add(new VoiceChatService(new TestSpeechService(), new TestChatAgentService(), new MockContextKeyService()));
	});

	teardown(() => {
		disposables.clear();
	});

	test('Agent and slash command detection (useAgents: false)', async () => {
		await testAgentsAndSlashCommandsDetection({ usesAgents: false, model: {} as IChatModel });
	});

	test('Agent and slash command detection (useAgents: true)', async () => {
		await testAgentsAndSlashCommandsDetection({ usesAgents: true, model: {} as IChatModel });
	});

	async function testAgentsAndSlashCommandsDetection(options: IVoiceChatSessionOptions) {

		// Nothing to detect
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Started });
		assert.strictEqual(event?.status, SpeechToTextStatus.Started);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'Hello' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, 'Hello');
		assert.strictEqual(event?.waitingForInput, undefined);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'Hello World' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, 'Hello World');
		assert.strictEqual(event?.waitingForInput, undefined);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'Hello World' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, 'Hello World');
		assert.strictEqual(event?.waitingForInput, undefined);

		// Agent
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, 'At');

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace' : 'At workspace');
		assert.strictEqual(event?.waitingForInput, options.usesAgents);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'at workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace' : 'at workspace');
		assert.strictEqual(event?.waitingForInput, options.usesAgents);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At workspace help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At workspace help');
		assert.strictEqual(event?.waitingForInput, false);

		// Agent with punctuation
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At workspace, help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At workspace, help');
		assert.strictEqual(event?.waitingForInput, false);

		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At Workspace. help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At Workspace. help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At Workspace. help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace help' : 'At Workspace. help');
		assert.strictEqual(event?.waitingForInput, false);

		// Slash Command
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'Slash fix' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace /fix' : '/fix');
		assert.strictEqual(event?.waitingForInput, true);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'Slash fix' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace /fix' : '/fix');
		assert.strictEqual(event?.waitingForInput, true);

		// Agent + Slash Command
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At code slash search help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code slash search help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At code slash search help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code slash search help');
		assert.strictEqual(event?.waitingForInput, false);

		// Agent + Slash Command with punctuation
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At code, slash search, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code, slash search, help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At code, slash search, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code, slash search, help');
		assert.strictEqual(event?.waitingForInput, false);

		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At code. slash, search help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code. slash, search help');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At code. slash search, help' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@vscode /search help' : 'At code. slash search, help');
		assert.strictEqual(event?.waitingForInput, false);

		// Agent not detected twice
		await createSession(options);

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace, for at workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace for at workspace' : 'At workspace, for at workspace');
		assert.strictEqual(event?.waitingForInput, false);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace, for at workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, options.usesAgents ? '@workspace for at workspace' : 'At workspace, for at workspace');
		assert.strictEqual(event?.waitingForInput, false);

		// Slash command detected after agent recognized
		if (options.usesAgents) {
			await createSession(options);

			emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
			assert.strictEqual(event?.text, '@workspace');
			assert.strictEqual(event?.waitingForInput, true);

			emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'slash' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
			assert.strictEqual(event?.text, 'slash');
			assert.strictEqual(event?.waitingForInput, false);

			emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'slash fix' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
			assert.strictEqual(event?.text, '/fix');
			assert.strictEqual(event?.waitingForInput, true);

			emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'slash fix' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
			assert.strictEqual(event?.text, '/fix');
			assert.strictEqual(event?.waitingForInput, true);

			await createSession(options);

			emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
			assert.strictEqual(event?.text, '@workspace');
			assert.strictEqual(event?.waitingForInput, true);

			emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'slash fix' });
			assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
			assert.strictEqual(event?.text, '/fix');
			assert.strictEqual(event?.waitingForInput, true);
		}
	}

	test('waiting for input', async () => {

		// Agent
		await createSession({ usesAgents: true, model: {} as IChatModel });

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, '@workspace');
		assert.strictEqual(event.waitingForInput, true);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, '@workspace');
		assert.strictEqual(event.waitingForInput, true);

		// Slash Command
		await createSession({ usesAgents: true, model: {} as IChatModel });

		emitter.fire({ status: SpeechToTextStatus.Recognizing, text: 'At workspace slash explain' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognizing);
		assert.strictEqual(event?.text, '@workspace /explain');
		assert.strictEqual(event.waitingForInput, true);

		emitter.fire({ status: SpeechToTextStatus.Recognized, text: 'At workspace slash explain' });
		assert.strictEqual(event?.status, SpeechToTextStatus.Recognized);
		assert.strictEqual(event?.text, '@workspace /explain');
		assert.strictEqual(event.waitingForInput, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/model/chatStreamStats.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/model/chatStreamStats.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../../../base/common/async.js';
import { runWithFakedTimers } from '../../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../../platform/log/common/log.js';
import { ChatStreamStatsTracker, type IChatStreamStatsInternal } from '../../../common/model/chatStreamStats.js';

suite('ChatStreamStatsTracker', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	function createTracker(): ChatStreamStatsTracker {
		return new ChatStreamStatsTracker(store.add(new NullLogService()));
	}

	test('drops bootstrap once sufficient markdown streamed', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();

		let data = tracker.update({ totalWordCount: 10 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, true);
		assert.strictEqual(data.totalTime, 250);

		await timeout(100);
		data = tracker.update({ totalWordCount: 35 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, false);
		assert.strictEqual(data.totalTime, 100);
		assert.strictEqual(data.lastWordCount, 35);
	}));

	test('large initial chunk uses higher bootstrap minimum', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();

		const data = tracker.update({ totalWordCount: 40 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, true);
		assert.strictEqual(data.totalTime, 500);
	}));

	test('ignores updates without new words', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();

		const first = tracker.update({ totalWordCount: 5 });
		assert.ok(first);

		await timeout(50);
		const second = tracker.update({ totalWordCount: 5 });
		assert.strictEqual(second, undefined);
	}));

	test('ignores zero-word totals until words arrive', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();

		const zero = tracker.update({ totalWordCount: 0 });
		assert.strictEqual(zero, undefined);
		assert.strictEqual(tracker.internalData.lastWordCount, 0);
		assert.strictEqual(tracker.internalData.totalTime, 0);

		await timeout(100);
		const data = tracker.update({ totalWordCount: 12 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, true);
		assert.strictEqual(data.totalTime, 500);
	}));

	test('unchanged totals do not advance timers', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();

		const first = tracker.update({ totalWordCount: 6 }) as IChatStreamStatsInternal | undefined;
		assert.ok(first);
		const initialTotalTime = first.totalTime;
		const initialLastUpdateTime = first.lastUpdateTime;

		await timeout(400);
		const second = tracker.update({ totalWordCount: 6 });
		assert.strictEqual(second, undefined);

		assert.strictEqual(tracker.internalData.totalTime, initialTotalTime);
		assert.strictEqual(tracker.internalData.lastUpdateTime, initialLastUpdateTime);
	}));

	test('records first markdown time but keeps bootstrap active', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();

		const data = tracker.update({ totalWordCount: 12 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, true);
		assert.strictEqual(data.firstMarkdownTime, 0);
		assert.strictEqual(data.totalTime, 500);
	}));

	test('implied rate uses elapsed time after bootstrap drops', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();
		assert.ok(tracker.update({ totalWordCount: 10 }));

		await timeout(300);
		const data = tracker.update({ totalWordCount: 40 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, false);
		assert.strictEqual(data.totalTime, 300);
		const expectedRate = 30 / 0.3;
		assert.ok(Math.abs(data.impliedWordLoadRate - expectedRate) < 0.0001);
	}));

	test('keeps bootstrap active until both thresholds satisfied', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();
		let data = tracker.update({ totalWordCount: 8 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, true);
		assert.strictEqual(data.wordCountAtBootstrapExit, undefined);
		assert.strictEqual(data.totalTime, 250);

		await timeout(200);
		data = tracker.update({ totalWordCount: 12 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, false);
		assert.strictEqual(data.wordCountAtBootstrapExit, 8);
		assert.strictEqual(data.totalTime, 200);
	}));

	test('caps interval contribution to max interval time', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();
		assert.ok(tracker.update({ totalWordCount: 5 }));

		await timeout(2000);
		const data = tracker.update({ totalWordCount: 9 }) as IChatStreamStatsInternal | undefined;
		assert.ok(data);
		assert.strictEqual(data.bootstrapActive, true);
		assert.strictEqual(data.totalTime, 250 + 250);
	}));

	test('uses larger interval cap for large updates', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();
		assert.ok(tracker.update({ totalWordCount: 10 }));

		await timeout(200);
		const exitData = tracker.update({ totalWordCount: 40 }) as IChatStreamStatsInternal | undefined;
		assert.ok(exitData);
		assert.strictEqual(exitData.bootstrapActive, false);
		const baselineTotal = exitData.totalTime;

		await timeout(2000);
		const postData = tracker.update({ totalWordCount: 90 }) as IChatStreamStatsInternal | undefined;
		assert.ok(postData);
		assert.strictEqual(postData.bootstrapActive, false);
		assert.strictEqual(postData.totalTime, baselineTotal + 1000);
	}));

	test('tracks words since bootstrap exit for rate calculation', () => runWithFakedTimers<void>({ startTime: 0, useFakeTimers: true }, async () => {
		const tracker = createTracker();
		assert.ok(tracker.update({ totalWordCount: 12 }));

		await timeout(200);
		const exitData = tracker.update({ totalWordCount: 45 }) as IChatStreamStatsInternal | undefined;
		assert.ok(exitData);
		assert.strictEqual(exitData.bootstrapActive, false);
		assert.strictEqual(exitData.wordCountAtBootstrapExit, 12);
		assert.strictEqual(exitData.totalTime, 200);

		await timeout(200);
		const postBootstrap = tracker.update({ totalWordCount: 60 }) as IChatStreamStatsInternal | undefined;
		assert.ok(postBootstrap);
		assert.strictEqual(postBootstrap.bootstrapActive, false);
		assert.strictEqual(postBootstrap.totalTime, 400);
		assert.strictEqual(postBootstrap.wordCountAtBootstrapExit, 12);
		const expectedRate = (60 - 12) / 0.4;
		assert.strictEqual(postBootstrap.impliedWordLoadRate, expectedRate);
	}));
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/promptFileLocations.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/promptFileLocations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { getPromptFileType, getCleanPromptName } from '../../../common/promptSyntax/config/promptFileLocations.js';
import { PromptsType } from '../../../common/promptSyntax/promptTypes.js';

suite('promptFileLocations', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('getPromptFileType', () => {
		test('.prompt.md files', () => {
			const uri = URI.file('/workspace/test.prompt.md');
			assert.strictEqual(getPromptFileType(uri), PromptsType.prompt);
		});

		test('.instructions.md files', () => {
			const uri = URI.file('/workspace/test.instructions.md');
			assert.strictEqual(getPromptFileType(uri), PromptsType.instructions);
		});

		test('.agent.md files', () => {
			const uri = URI.file('/workspace/test.agent.md');
			assert.strictEqual(getPromptFileType(uri), PromptsType.agent);
		});

		test('.chatmode.md files (legacy)', () => {
			const uri = URI.file('/workspace/test.chatmode.md');
			assert.strictEqual(getPromptFileType(uri), PromptsType.agent);
		});

		test('.md files in .github/agents/ folder should be recognized as agent files', () => {
			const uri = URI.file('/workspace/.github/agents/demonstrate.md');
			assert.strictEqual(getPromptFileType(uri), PromptsType.agent);
		});

		test('.md files in .github/agents/ subfolder should NOT be recognized as agent files', () => {
			const uri = URI.file('/workspace/.github/agents/subfolder/test.md');
			assert.strictEqual(getPromptFileType(uri), undefined);
		});

		test('.md files outside .github/agents/ should not be recognized as agent files', () => {
			const uri = URI.file('/workspace/test/foo.md');
			assert.strictEqual(getPromptFileType(uri), undefined);
		});

		test('.md files in other .github/ subfolders should not be recognized as agent files', () => {
			const uri = URI.file('/workspace/.github/prompts/test.md');
			assert.strictEqual(getPromptFileType(uri), undefined);
		});

		test('copilot-instructions.md should be recognized as instructions', () => {
			const uri = URI.file('/workspace/.github/copilot-instructions.md');
			assert.strictEqual(getPromptFileType(uri), PromptsType.instructions);
		});

		test('regular .md files should return undefined', () => {
			const uri = URI.file('/workspace/README.md');
			assert.strictEqual(getPromptFileType(uri), undefined);
		});
	});

	suite('getCleanPromptName', () => {
		test('removes .prompt.md extension', () => {
			const uri = URI.file('/workspace/test.prompt.md');
			assert.strictEqual(getCleanPromptName(uri), 'test');
		});

		test('removes .instructions.md extension', () => {
			const uri = URI.file('/workspace/test.instructions.md');
			assert.strictEqual(getCleanPromptName(uri), 'test');
		});

		test('removes .agent.md extension', () => {
			const uri = URI.file('/workspace/test.agent.md');
			assert.strictEqual(getCleanPromptName(uri), 'test');
		});

		test('removes .chatmode.md extension (legacy)', () => {
			const uri = URI.file('/workspace/test.chatmode.md');
			assert.strictEqual(getCleanPromptName(uri), 'test');
		});

		test('removes .md extension for files in .github/agents/', () => {
			const uri = URI.file('/workspace/.github/agents/demonstrate.md');
			assert.strictEqual(getCleanPromptName(uri), 'demonstrate');
		});

		test('removes .md extension for copilot-instructions.md', () => {
			const uri = URI.file('/workspace/.github/copilot-instructions.md');
			assert.strictEqual(getCleanPromptName(uri), 'copilot-instructions');
		});

		test('keeps .md extension for regular files', () => {
			const uri = URI.file('/workspace/README.md');
			assert.strictEqual(getCleanPromptName(uri), 'README.md');
		});

		test('keeps full filename for files without known extensions', () => {
			const uri = URI.file('/workspace/test.txt');
			assert.strictEqual(getCleanPromptName(uri), 'test.txt');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/promptFileReference.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/promptFileReference.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../../editor/common/services/model.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { ConfigurationService } from '../../../../../../platform/configuration/common/configurationService.js';
import { IFileService } from '../../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../../platform/files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService, NullLogService } from '../../../../../../platform/log/common/log.js';
import { NullPolicyService } from '../../../../../../platform/policy/common/policy.js';
import { ChatModeKind } from '../../../common/constants.js';
import { getPromptFileType } from '../../../common/promptSyntax/config/promptFileLocations.js';
import { PromptsType } from '../../../common/promptSyntax/promptTypes.js';
import { IMockFolder, MockFilesystem } from './testUtils/mockFilesystem.js';
import { IBodyFileReference, PromptFileParser } from '../../../common/promptSyntax/promptFileParser.js';

/**
 * Represents a file reference with an expected
 * error condition value for testing purposes.
 */
class ExpectedReference {
	/**
	 * URI component of the expected reference.
	 */
	public readonly uri: URI;

	constructor(
		dirname: URI,
		public readonly ref: IBodyFileReference,
	) {
		this.uri = (ref.content.startsWith('/'))
			? URI.file(ref.content)
			: URI.joinPath(dirname, ref.content);
	}

	/**
	 * Range of the underlying file reference token.
	 */
	public get range(): Range {
		return this.ref.range;
	}

	/**
	 * String representation of the expected reference.
	 */
	public toString(): string {
		return `file-prompt:${this.uri.path}`;
	}
}

function toUri(filePath: string): URI {
	return URI.parse('testFs://' + filePath);
}

/**
 * A reusable test utility to test the `PromptFileReference` class.
 */
class TestPromptFileReference extends Disposable {
	constructor(
		private readonly fileStructure: IMockFolder[],
		private readonly rootFileUri: URI,
		private readonly expectedReferences: ExpectedReference[],
		@IFileService private readonly fileService: IFileService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		// create in-memory file system
		const fileSystemProvider = this._register(new InMemoryFileSystemProvider());
		this._register(this.fileService.registerProvider('testFs', fileSystemProvider));
	}

	/**
	 * Run the test.
	 */
	public async run(): Promise<any> {
		// create the files structure on the disk
		const mockFs = this.instantiationService.createInstance(MockFilesystem, this.fileStructure);
		await mockFs.mock(toUri('/'));

		const content = await this.fileService.readFile(this.rootFileUri);

		const ast = new PromptFileParser().parse(this.rootFileUri, content.value.toString());
		assert(ast.body, 'Prompt file must have a body');

		// resolve the root file reference including all nested references
		const resolvedReferences = ast.body.fileReferences ?? [];

		for (let i = 0; i < this.expectedReferences.length; i++) {
			const expectedReference = this.expectedReferences[i];
			const resolvedReference = resolvedReferences[i];

			const resolvedUri = ast.body.resolveFilePath(resolvedReference.content);

			assert.equal(resolvedUri?.fsPath, expectedReference.uri.fsPath);
			assert.deepStrictEqual(resolvedReference.range, expectedReference.range);
		}

		assert.strictEqual(
			resolvedReferences.length,
			this.expectedReferences.length,
			[
				`\nExpected(${this.expectedReferences.length}): [\n ${this.expectedReferences.join('\n ')}\n]`,
				`Received(${resolvedReferences.length}): [\n ${resolvedReferences.join('\n ')}\n]`,
			].join('\n'),
		);

		const result: any = {};
		result.promptType = getPromptFileType(this.rootFileUri);
		if (ast.header) {
			for (const key of ['tools', 'model', 'agent', 'applyTo', 'description'] as const) {
				if (ast.header[key]) {
					result[key] = ast.header[key];
				}
			}
		}

		await mockFs.delete();

		return result;
	}
}

/**
 * Create expected file reference for testing purposes.
 *
 * Note! This utility also use for `markdown links` at the moment.
 *
 * @param filePath The expected path of the file reference (without the `#file:` prefix).
 * @param lineNumber The expected line number of the file reference.
 * @param startColumnNumber The expected start column number of the file reference.
 */
function createFileReference(filePath: string, lineNumber: number, startColumnNumber: number): IBodyFileReference {
	const range = new Range(
		lineNumber,
		startColumnNumber + '#file:'.length,
		lineNumber,
		startColumnNumber + '#file:'.length + filePath.length,
	);

	return {
		range,
		content: filePath,
		isMarkdownLink: false,
	};
}

function createMarkdownReference(lineNumber: number, startColumnNumber: number, firstSeg: string, secondSeg: string): IBodyFileReference {
	const range = new Range(
		lineNumber,
		startColumnNumber + firstSeg.length + 1,
		lineNumber,
		startColumnNumber + firstSeg.length + secondSeg.length - 1,
	);

	return {
		range,
		content: secondSeg.substring(1, secondSeg.length - 1),
		isMarkdownLink: true,
	};
}

suite('PromptFileReference', function () {
	const testDisposables = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	setup(async () => {
		const nullPolicyService = new NullPolicyService();
		const nullLogService = testDisposables.add(new NullLogService());
		const nullFileService = testDisposables.add(new FileService(nullLogService));
		const nullConfigService = testDisposables.add(new ConfigurationService(
			URI.file('/config.json'),
			nullFileService,
			nullPolicyService,
			nullLogService,
		));
		instantiationService = testDisposables.add(new TestInstantiationService());

		instantiationService.stub(IFileService, nullFileService);
		instantiationService.stub(ILogService, nullLogService);
		instantiationService.stub(IConfigurationService, nullConfigService);
		instantiationService.stub(IModelService, { getModel() { return null; } });
		instantiationService.stub(ILanguageService, {
			guessLanguageIdByFilepathOrFirstLine(uri: URI) {
				return getPromptFileType(uri) ?? null;
			}
		});
	});

	test('resolves nested file references', async function () {
		const rootFolderName = 'resolves-nested-file-references';
		const rootFolder = `/${rootFolderName}`;
		const rootUri = toUri(rootFolder);

		const test = testDisposables.add(instantiationService.createInstance(TestPromptFileReference,
			/**
			 * The file structure to be created on the disk for the test.
			 */
			[{
				name: rootFolderName,
				children: [
					{
						name: 'file1.prompt.md',
						contents: '## Some Header\nsome contents\n ',
					},
					{
						name: 'file2.prompt.md',
						contents: '## Files\n\t- this file #file:folder1/file3.prompt.md \n\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!\n ',
					},
					{
						name: 'folder1',
						children: [
							{
								name: 'file3.prompt.md',
								contents: `\n[](./some-other-folder/non-existing-folder)\n\t- some seemingly random #file:${rootFolder}/folder1/some-other-folder/yetAnotherFolder🤭/another-file.prompt.md contents\n some more\t content`,
							},
							{
								name: 'some-other-folder',
								children: [
									{
										name: 'file4.prompt.md',
										contents: 'this file has a non-existing #file:./some-non-existing/file.prompt.md\t\treference\n\n\nand some\n non-prompt #file:./some-non-prompt-file.md\t\t \t[](../../folder1/)\t',
									},
									{
										name: 'file.txt',
										contents: 'contents of a non-prompt-snippet file',
									},
									{
										name: 'yetAnotherFolder🤭',
										children: [
											{
												name: 'another-file.prompt.md',
												contents: `[caption](${rootFolder}/folder1/some-other-folder)\nanother-file.prompt.md contents\t [#file:file.txt](../file.txt)`,
											},
											{
												name: 'one_more_file_just_in_case.prompt.md',
												contents: 'one_more_file_just_in_case.prompt.md contents',
											},
										],
									},
								],
							},
						],
					},
				],
			}],
			/**
			 * The root file path to start the resolve process from.
			 */
			toUri(`/${rootFolderName}/file2.prompt.md`),
			/**
			 * The expected references to be resolved.
			 */
			[
				new ExpectedReference(
					rootUri,
					createFileReference('folder1/file3.prompt.md', 2, 14),
				),
				new ExpectedReference(
					rootUri,
					createMarkdownReference(
						3, 14,
						'[file4.prompt.md]', '(./folder1/some-other-folder/file4.prompt.md)',
					),
				),
			]
		));

		await test.run();
	});


	suite('metadata', () => {
		test('tools', async function () {
			const rootFolderName = 'resolves-nested-file-references';
			const rootFolder = `/${rootFolderName}`;
			const rootUri = toUri(rootFolder);

			const test = testDisposables.add(instantiationService.createInstance(TestPromptFileReference,
				/**
				 * The file structure to be created on the disk for the test.
				 */
				[{
					name: rootFolderName,
					children: [
						{
							name: 'file1.prompt.md',
							contents: [
								'## Some Header',
								'some contents',
								' ',
							],
						},
						{
							name: 'file2.prompt.md',
							contents: [
								'---',
								'description: \'Root prompt description.\'',
								'tools: [\'my-tool1\']',
								'agent: "agent" ',
								'---',
								'## Files',
								'\t- this file #file:folder1/file3.prompt.md ',
								'\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!',
								' ',
							],
						},
						{
							name: 'folder1',
							children: [
								{
									name: 'file3.prompt.md',
									contents: [
										'---',
										'tools: [ false, \'my-tool1\' , ]',
										'---',
										'',
										'[](./some-other-folder/non-existing-folder)',
										`\t- some seemingly random #file:${rootFolder}/folder1/some-other-folder/yetAnotherFolder🤭/another-file.prompt.md contents`,
										' some more\t content',
									],
								},
								{
									name: 'some-other-folder',
									children: [
										{
											name: 'file4.prompt.md',
											contents: [
												'---',
												'tools: [\'my-tool1\', "my-tool2", true, , ]',
												'something: true',
												'agent: \'ask\'\t',
												'---',
												'this file has a non-existing #file:./some-non-existing/file.prompt.md\t\treference',
												'',
												'',
												'and some',
												' non-prompt #file:./some-non-prompt-file.md\t\t \t[](../../folder1/)\t',
											],
										},
										{
											name: 'file.txt',
											contents: 'contents of a non-prompt-snippet file',
										},
										{
											name: 'yetAnotherFolder🤭',
											children: [
												{
													name: 'another-file.prompt.md',
													contents: [
														'---',
														'tools: [\'my-tool3\', false, "my-tool2" ]',
														'---',
														`[](${rootFolder}/folder1/some-other-folder)`,
														'another-file.prompt.md contents\t [#file:file.txt](../file.txt)',
													],
												},
												{
													name: 'one_more_file_just_in_case.prompt.md',
													contents: 'one_more_file_just_in_case.prompt.md contents',
												},
											],
										},
									],
								},
							],
						},
					],
				}],
				/**
				 * The root file path to start the resolve process from.
				 */
				toUri(`/${rootFolderName}/file2.prompt.md`),
				/**
				 * The expected references to be resolved.
				 */
				[
					new ExpectedReference(
						rootUri,
						createFileReference('folder1/file3.prompt.md', 7, 14),
					),
					new ExpectedReference(
						rootUri,
						createMarkdownReference(
							8, 14,
							'[file4.prompt.md]', '(./folder1/some-other-folder/file4.prompt.md)',
						),
					),
				]
			));

			const metadata = await test.run();

			assert.deepStrictEqual(
				metadata,
				{
					promptType: PromptsType.prompt,
					agent: 'agent',
					description: 'Root prompt description.',
					tools: ['my-tool1'],
				},
				'Must have correct metadata.',
			);

		});

		suite('applyTo', () => {
			test('prompt language', async function () {
				const rootFolderName = 'resolves-nested-file-references';
				const rootFolder = `/${rootFolderName}`;
				const rootUri = toUri(rootFolder);

				const test = testDisposables.add(instantiationService.createInstance(TestPromptFileReference,
					/**
					 * The file structure to be created on the disk for the test.
					 */
					[{
						name: rootFolderName,
						children: [
							{
								name: 'file1.prompt.md',
								contents: [
									'## Some Header',
									'some contents',
									' ',
								],
							},
							{
								name: 'file2.prompt.md',
								contents: [
									'---',
									'applyTo: \'**/*\'',
									'tools: [ false, \'my-tool12\' , ]',
									'description: \'Description of my prompt.\'',
									'---',
									'## Files',
									'\t- this file #file:folder1/file3.prompt.md ',
									'\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!',
									' ',
								],
							},
							{
								name: 'folder1',
								children: [
									{
										name: 'file3.prompt.md',
										contents: [
											'---',
											'tools: [ false, \'my-tool1\' , ]',
											'---',
											' some more\t content',
										],
									},
									{
										name: 'some-other-folder',
										children: [
											{
												name: 'file4.prompt.md',
												contents: [
													'---',
													'tools: [\'my-tool1\', "my-tool2", true, , \'my-tool3\' , ]',
													'something: true',
													'agent: \'agent\'\t',
													'---',
													'',
													'',
													'and some more content',
												],
											},
										],
									},
								],
							},
						],
					}],
					/**
					 * The root file path to start the resolve process from.
					 */
					toUri(`/${rootFolderName}/file2.prompt.md`),
					/**
					 * The expected references to be resolved.
					 */
					[
						new ExpectedReference(
							rootUri,
							createFileReference('folder1/file3.prompt.md', 7, 14),
						),
						new ExpectedReference(
							rootUri,
							createMarkdownReference(
								8, 14,
								'[file4.prompt.md]', '(./folder1/some-other-folder/file4.prompt.md)',
							),
						),
					]
				));

				const metadata = await test.run();

				assert.deepStrictEqual(
					metadata,
					{
						promptType: PromptsType.prompt,
						description: 'Description of my prompt.',
						tools: ['my-tool12'],
						applyTo: '**/*',
					},
					'Must have correct metadata.',
				);

			});


			test('instructions language', async function () {
				const rootFolderName = 'resolves-nested-file-references';
				const rootFolder = `/${rootFolderName}`;
				const rootUri = toUri(rootFolder);

				const test = testDisposables.add(instantiationService.createInstance(TestPromptFileReference,
					/**
					 * The file structure to be created on the disk for the test.
					 */
					[{
						name: rootFolderName,
						children: [
							{
								name: 'file1.prompt.md',
								contents: [
									'## Some Header',
									'some contents',
									' ',
								],
							},
							{
								name: 'file2.instructions.md',
								contents: [
									'---',
									'applyTo: \'**/*\'',
									'tools: [ false, \'my-tool12\' , ]',
									'description: \'Description of my instructions file.\'',
									'---',
									'## Files',
									'\t- this file #file:folder1/file3.prompt.md ',
									'\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!',
									' ',
								],
							},
							{
								name: 'folder1',
								children: [
									{
										name: 'file3.prompt.md',
										contents: [
											'---',
											'tools: [ false, \'my-tool1\' , ]',
											'---',
											' some more\t content',
										],
									},
									{
										name: 'some-other-folder',
										children: [
											{
												name: 'file4.prompt.md',
												contents: [
													'---',
													'tools: [\'my-tool1\', "my-tool2", true, , \'my-tool3\' , ]',
													'something: true',
													'agent: \'agent\'\t',
													'---',
													'',
													'',
													'and some more content',
												],
											},
										],
									},
								],
							},
						],
					}],
					/**
					 * The root file path to start the resolve process from.
					 */
					toUri(`/${rootFolderName}/file2.instructions.md`),
					/**
					 * The expected references to be resolved.
					 */
					[
						new ExpectedReference(
							rootUri,
							createFileReference('folder1/file3.prompt.md', 7, 14),
						),
						new ExpectedReference(
							rootUri,
							createMarkdownReference(
								8, 14,
								'[file4.prompt.md]', '(./folder1/some-other-folder/file4.prompt.md)',
							),
						),
					]
				));

				const metadata = await test.run();

				assert.deepStrictEqual(
					metadata,
					{
						promptType: PromptsType.instructions,
						applyTo: '**/*',
						description: 'Description of my instructions file.',
						tools: ['my-tool12'],
					},
					'Must have correct metadata.',
				);
			});
		});

		suite('tools and agent compatibility', () => {
			test('ask agent', async function () {
				const rootFolderName = 'resolves-nested-file-references';
				const rootFolder = `/${rootFolderName}`;
				const rootUri = toUri(rootFolder);

				const test = testDisposables.add(instantiationService.createInstance(TestPromptFileReference,
					/**
					 * The file structure to be created on the disk for the test.
					 */
					[{
						name: rootFolderName,
						children: [
							{
								name: 'file1.prompt.md',
								contents: [
									'## Some Header',
									'some contents',
									' ',
								],
							},
							{
								name: 'file2.prompt.md',
								contents: [
									'---',
									'description: \'Description of my prompt.\'',
									'agent: "ask" ',
									'---',
									'## Files',
									'\t- this file #file:folder1/file3.prompt.md ',
									'\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!',
									' ',
								],
							},
							{
								name: 'folder1',
								children: [
									{
										name: 'file3.prompt.md',
										contents: [
											'---',
											'tools: [ false, \'my-tool1\' , ]',
											'agent: \'agent\'\t',
											'---',
											' some more\t content',
										],
									},
									{
										name: 'some-other-folder',
										children: [
											{
												name: 'file4.prompt.md',
												contents: [
													'---',
													'tools: [\'my-tool1\', "my-tool2", true, , ]',
													'something: true',
													'agent: \'ask\'\t',
													'---',
													'',
													'',
													'and some more content',
												],
											},
										],
									},
								],
							},
						],
					}],
					/**
					 * The root file path to start the resolve process from.
					 */
					toUri(`/${rootFolderName}/file2.prompt.md`),
					/**
					 * The expected references to be resolved.
					 */
					[
						new ExpectedReference(
							rootUri,
							createFileReference('folder1/file3.prompt.md', 6, 14),
						),
						new ExpectedReference(
							rootUri,
							createMarkdownReference(
								7, 14,
								'[file4.prompt.md]', '(./folder1/some-other-folder/file4.prompt.md)',
							),
						),
					]
				));

				const metadata = await test.run();

				assert.deepStrictEqual(
					metadata,
					{
						promptType: PromptsType.prompt,
						agent: ChatModeKind.Ask,
						description: 'Description of my prompt.',
					},
					'Must have correct metadata.',
				);
			});

			test('edit agent', async function () {
				const rootFolderName = 'resolves-nested-file-references';
				const rootFolder = `/${rootFolderName}`;
				const rootUri = toUri(rootFolder);

				const test = testDisposables.add(instantiationService.createInstance(TestPromptFileReference,
					/**
					 * The file structure to be created on the disk for the test.
					 */
					[{
						name: rootFolderName,
						children: [
							{
								name: 'file1.prompt.md',
								contents: [
									'## Some Header',
									'some contents',
									' ',
								],
							},
							{
								name: 'file2.prompt.md',
								contents: [
									'---',
									'description: \'Description of my prompt.\'',
									'agent:\t\t"edit"\t\t',
									'---',
									'## Files',
									'\t- this file #file:folder1/file3.prompt.md ',
									'\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!',
									' ',
								],
							},
							{
								name: 'folder1',
								children: [
									{
										name: 'file3.prompt.md',
										contents: [
											'---',
											'tools: [ false, \'my-tool1\' , ]',
											'---',
											' some more\t content',
										],
									},
									{
										name: 'some-other-folder',
										children: [
											{
												name: 'file4.prompt.md',
												contents: [
													'---',
													'tools: [\'my-tool1\', "my-tool2", true, , ]',
													'something: true',
													'agent: \'agent\'\t',
													'---',
													'',
													'',
													'and some more content',
												],
											},
										],
									},
								],
							},
						],
					}],
					/**
					 * The root file path to start the resolve process from.
					 */
					toUri(`/${rootFolderName}/file2.prompt.md`),
					/**
					 * The expected references to be resolved.
					 */
					[
						new ExpectedReference(
							rootUri,
							createFileReference('folder1/file3.prompt.md', 6, 14),
						),
						new ExpectedReference(
							rootUri,
							createMarkdownReference(
								7, 14,
								'[file4.prompt.md]', '(./folder1/some-other-folder/file4.prompt.md)',
							),
						),
					]
				));

				const metadata = await test.run();

				assert.deepStrictEqual(
					metadata,
					{
						promptType: PromptsType.prompt,
						agent: ChatModeKind.Edit,
						description: 'Description of my prompt.',
					},
					'Must have correct metadata.',
				);

			});

			test('agent', async function () {
				const rootFolderName = 'resolves-nested-file-references';
				const rootFolder = `/${rootFolderName}`;
				const rootUri = toUri(rootFolder);

				const test = testDisposables.add(instantiationService.createInstance(TestPromptFileReference,
					/**
					 * The file structure to be created on the disk for the test.
					 */
					[{
						name: rootFolderName,
						children: [
							{
								name: 'file1.prompt.md',
								contents: [
									'## Some Header',
									'some contents',
									' ',
								],
							},
							{
								name: 'file2.prompt.md',
								contents: [
									'---',
									'description: \'Description of my prompt.\'',
									'agent: \t\t "agent" \t\t ',
									'---',
									'## Files',
									'\t- this file #file:folder1/file3.prompt.md ',
									'\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!',
									' ',
								],
							},
							{
								name: 'folder1',
								children: [
									{
										name: 'file3.prompt.md',
										contents: [
											'---',
											'tools: [ false, \'my-tool1\' , ]',
											'---',
											' some more\t content',
										],
									},
									{
										name: 'some-other-folder',
										children: [
											{
												name: 'file4.prompt.md',
												contents: [
													'---',
													'tools: [\'my-tool1\', "my-tool2", true, , \'my-tool3\' , ]',
													'something: true',
													'agent: \'agent\'\t',
													'---',
													'',
													'',
													'and some more content',
												],
											},
										],
									},
								],
							},
						],
					}],
					/**
					 * The root file path to start the resolve process from.
					 */
					toUri(`/${rootFolderName}/file2.prompt.md`),
					/**
					 * The expected references to be resolved.
					 */
					[
						new ExpectedReference(
							rootUri,
							createFileReference('folder1/file3.prompt.md', 6, 14),
						),
						new ExpectedReference(
							rootUri,
							createMarkdownReference(
								7, 14,
								'[file4.prompt.md]', '(./folder1/some-other-folder/file4.prompt.md)',
							),
						),
					]
				));

				const metadata = await test.run();

				assert.deepStrictEqual(
					metadata,
					{
						promptType: PromptsType.prompt,
						agent: ChatModeKind.Agent,
						description: 'Description of my prompt.',
					},
					'Must have correct metadata.',
				);

			});

			test('no agent', async function () {
				const rootFolderName = 'resolves-nested-file-references';
				const rootFolder = `/${rootFolderName}`;
				const rootUri = toUri(rootFolder);

				const test = testDisposables.add(instantiationService.createInstance(TestPromptFileReference,
					/**
					 * The file structure to be created on the disk for the test.
					 */
					[{
						name: rootFolderName,
						children: [
							{
								name: 'file1.prompt.md',
								contents: [
									'## Some Header',
									'some contents',
									' ',
								],
							},
							{
								name: 'file2.prompt.md',
								contents: [
									'---',
									'tools: [ false, \'my-tool12\' , ]',
									'description: \'Description of the prompt file.\'',
									'---',
									'## Files',
									'\t- this file #file:folder1/file3.prompt.md ',
									'\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!',
									' ',
								],
							},
							{
								name: 'folder1',
								children: [
									{
										name: 'file3.prompt.md',
										contents: [
											'---',
											'tools: [ false, \'my-tool1\' , ]',
											'---',
											' some more\t content',
										],
									},
									{
										name: 'some-other-folder',
										children: [
											{
												name: 'file4.prompt.md',
												contents: [
													'---',
													'tools: [\'my-tool1\', "my-tool2", true, , \'my-tool3\' , ]',
													'something: true',
													'agent: \'agent\'\t',
													'---',
													'',
													'',
													'and some more content',
												],
											},
										],
									},
								],
							},
						],
					}],
					/**
					 * The root file path to start the resolve process from.
					 */
					toUri(`/${rootFolderName}/file2.prompt.md`),
					/**
					 * The expected references to be resolved.
					 */
					[
						new ExpectedReference(
							rootUri,
							createFileReference('folder1/file3.prompt.md', 6, 14),
						),
						new ExpectedReference(
							rootUri,
							createMarkdownReference(
								7, 14,
								'[file4.prompt.md]', '(./folder1/some-other-folder/file4.prompt.md)',
							),
						),
					]
				));

				const metadata = await test.run();

				assert.deepStrictEqual(
					metadata,
					{
						promptType: PromptsType.prompt,
						tools: ['my-tool12'],
						description: 'Description of the prompt file.',
					},
					'Must have correct metadata.',
				);

			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/config/config.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/config/config.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { mockService } from '../utils/mock.js';
import { PromptsConfig } from '../../../../common/promptSyntax/config/config.js';
import { PromptsType } from '../../../../common/promptSyntax/promptTypes.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../base/test/common/utils.js';
import { IConfigurationOverrides, IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';

/**
 * Mocked instance of {@link IConfigurationService}.
 */
function createMock<T>(value: T): IConfigurationService {
	return mockService<IConfigurationService>({
		getValue(key?: string | IConfigurationOverrides) {
			assert(
				typeof key === 'string',
				`Expected string configuration key, got '${typeof key}'.`,
			);

			assert(
				[PromptsConfig.PROMPT_LOCATIONS_KEY, PromptsConfig.INSTRUCTIONS_LOCATION_KEY, PromptsConfig.MODE_LOCATION_KEY].includes(key),
				`Unsupported configuration key '${key}'.`,
			);

			return value;
		},
	});
}

suite('PromptsConfig', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('getLocationsValue', () => {
		test('undefined', () => {
			const configService = createMock(undefined);

			assert.strictEqual(
				PromptsConfig.getLocationsValue(configService, PromptsType.prompt),
				undefined,
				'Must read correct value.',
			);
		});

		test('null', () => {
			const configService = createMock(null);

			assert.strictEqual(
				PromptsConfig.getLocationsValue(configService, PromptsType.prompt),
				undefined,
				'Must read correct value.',
			);
		});

		suite('object', () => {
			test('empty', () => {
				assert.deepStrictEqual(
					PromptsConfig.getLocationsValue(createMock({}), PromptsType.prompt),
					{},
					'Must read correct value.',
				);
			});

			test('only valid strings', () => {
				assert.deepStrictEqual(
					PromptsConfig.getLocationsValue(createMock({
						'/root/.bashrc': true,
						'../../folder/.hidden-folder/config.xml': true,
						'/srv/www/Public_html/.htaccess': true,
						'../../another.folder/.WEIRD_FILE.log': true,
						'./folder.name/file.name': true,
						'/media/external/backup.tar.gz': true,
						'/Media/external/.secret.backup': true,
						'../relative/path.to.file': true,
						'./folderName.with.dots/more.dots.extension': true,
						'some/folder.with.dots/another.file': true,
						'/var/logs/app.01.05.error': true,
						'./.tempfile': true,
					}), PromptsType.prompt),
					{
						'/root/.bashrc': true,
						'../../folder/.hidden-folder/config.xml': true,
						'/srv/www/Public_html/.htaccess': true,
						'../../another.folder/.WEIRD_FILE.log': true,
						'./folder.name/file.name': true,
						'/media/external/backup.tar.gz': true,
						'/Media/external/.secret.backup': true,
						'../relative/path.to.file': true,
						'./folderName.with.dots/more.dots.extension': true,
						'some/folder.with.dots/another.file': true,
						'/var/logs/app.01.05.error': true,
						'./.tempfile': true,
					},
					'Must read correct value.',
				);
			});

			test('filters out non valid entries', () => {
				assert.deepStrictEqual(
					PromptsConfig.getLocationsValue(createMock({
						'/etc/hosts.backup': '\t\n\t',
						'./run.tests.sh': '\v',
						'../assets/img/logo.v2.png': true,
						'/mnt/storage/video.archive/episode.01.mkv': false,
						'../.local/bin/script.sh': true,
						'/usr/local/share/.fonts/CustomFont.otf': '',
						'../../development/branch.name/some.test': true,
						'/Home/user/.ssh/config': true,
						'./hidden.dir/.subhidden': '\f',
						'/tmp/.temp.folder/cache.db': true,
						'/opt/software/v3.2.1/build.log': '  ',
						'': true,
						'./scripts/.old.build.sh': true,
						'/var/data/datafile.2025-02-05.json': '\n',
						'\n\n': true,
						'\t': true,
						'\v': true,
						'\f': true,
						'\r\n': true,
						'\f\f': true,
						'../lib/some_library.v1.0.1.so': '\r\n',
						'/dev/shm/.shared_resource': 1234,
					}), PromptsType.prompt),
					{
						'../assets/img/logo.v2.png': true,
						'/mnt/storage/video.archive/episode.01.mkv': false,
						'../.local/bin/script.sh': true,
						'../../development/branch.name/some.test': true,
						'/Home/user/.ssh/config': true,
						'/tmp/.temp.folder/cache.db': true,
						'./scripts/.old.build.sh': true,
					},
					'Must read correct value.',
				);
			});

			test('only invalid or false values', () => {
				assert.deepStrictEqual(
					PromptsConfig.getLocationsValue(createMock({
						'/etc/hosts.backup': '\t\n\t',
						'./run.tests.sh': '\v',
						'../assets/IMG/logo.v2.png': '',
						'/mnt/storage/video.archive/episode.01.mkv': false,
						'/usr/local/share/.fonts/CustomFont.otf': '',
						'./hidden.dir/.subhidden': '\f',
						'/opt/Software/v3.2.1/build.log': '  ',
						'/var/data/datafile.2025-02-05.json': '\n',
						'../lib/some_library.v1.0.1.so': '\r\n',
						'/dev/shm/.shared_resource': 2345,
					}), PromptsType.prompt),
					{
						'/mnt/storage/video.archive/episode.01.mkv': false,
					},
					'Must read correct value.',
				);
			});
		});
	});

	suite('sourceLocations', () => {
		test('undefined', () => {
			const configService = createMock(undefined);

			assert.deepStrictEqual(
				PromptsConfig.promptSourceFolders(configService, PromptsType.prompt),
				[],
				'Must read correct value.',
			);
		});

		test('null', () => {
			const configService = createMock(null);

			assert.deepStrictEqual(
				PromptsConfig.promptSourceFolders(configService, PromptsType.prompt),
				[],
				'Must read correct value.',
			);
		});

		suite('object', () => {
			test('empty', () => {
				assert.deepStrictEqual(
					PromptsConfig.promptSourceFolders(createMock({}), PromptsType.prompt),
					['.github/prompts'],
					'Must read correct value.',
				);
			});

			test('only valid strings', () => {
				assert.deepStrictEqual(
					PromptsConfig.promptSourceFolders(createMock({
						'/root/.bashrc': true,
						'../../folder/.hidden-folder/config.xml': true,
						'/srv/www/Public_html/.htaccess': true,
						'../../another.folder/.WEIRD_FILE.log': true,
						'./folder.name/file.name': true,
						'/media/external/backup.tar.gz': true,
						'/Media/external/.secret.backup': true,
						'../relative/path.to.file': true,
						'./folderName.with.dots/more.dots.extension': true,
						'some/folder.with.dots/another.file': true,
						'/var/logs/app.01.05.error': true,
						'.GitHub/prompts': true,
						'./.tempfile': true,
					}), PromptsType.prompt),
					[
						'.github/prompts',
						'/root/.bashrc',
						'../../folder/.hidden-folder/config.xml',
						'/srv/www/Public_html/.htaccess',
						'../../another.folder/.WEIRD_FILE.log',
						'./folder.name/file.name',
						'/media/external/backup.tar.gz',
						'/Media/external/.secret.backup',
						'../relative/path.to.file',
						'./folderName.with.dots/more.dots.extension',
						'some/folder.with.dots/another.file',
						'/var/logs/app.01.05.error',
						'.GitHub/prompts',
						'./.tempfile',
					],
					'Must read correct value.',
				);
			});

			test('filters out non valid entries', () => {
				assert.deepStrictEqual(
					PromptsConfig.promptSourceFolders(createMock({
						'/etc/hosts.backup': '\t\n\t',
						'./run.tests.sh': '\v',
						'../assets/img/logo.v2.png': true,
						'/mnt/storage/video.archive/episode.01.mkv': false,
						'../.local/bin/script.sh': true,
						'/usr/local/share/.fonts/CustomFont.otf': '',
						'../../development/branch.name/some.test': true,
						'.giThub/prompts': true,
						'/Home/user/.ssh/config': true,
						'./hidden.dir/.subhidden': '\f',
						'/tmp/.temp.folder/cache.db': true,
						'.github/prompts': true,
						'/opt/software/v3.2.1/build.log': '  ',
						'': true,
						'./scripts/.old.build.sh': true,
						'/var/data/datafile.2025-02-05.json': '\n',
						'\n\n': true,
						'\t': true,
						'\v': true,
						'\f': true,
						'\r\n': true,
						'\f\f': true,
						'../lib/some_library.v1.0.1.so': '\r\n',
						'/dev/shm/.shared_resource': 2345,
					}), PromptsType.prompt),
					[
						'.github/prompts',
						'../assets/img/logo.v2.png',
						'../.local/bin/script.sh',
						'../../development/branch.name/some.test',
						'.giThub/prompts',
						'/Home/user/.ssh/config',
						'/tmp/.temp.folder/cache.db',
						'./scripts/.old.build.sh',
					],
					'Must read correct value.',
				);
			});

			test('only invalid or false values', () => {
				assert.deepStrictEqual(
					PromptsConfig.promptSourceFolders(createMock({
						'/etc/hosts.backup': '\t\n\t',
						'./run.tests.sh': '\v',
						'../assets/IMG/logo.v2.png': '',
						'/mnt/storage/video.archive/episode.01.mkv': false,
						'/usr/local/share/.fonts/CustomFont.otf': '',
						'./hidden.dir/.subhidden': '\f',
						'/opt/Software/v3.2.1/build.log': '  ',
						'/var/data/datafile.2025-02-05.json': '\n',
						'../lib/some_library.v1.0.1.so': '\r\n',
						'/dev/shm/.shared_resource': 7654,
					}), PromptsType.prompt),
					[
						'.github/prompts',
					],
					'Must read correct value.',
				);
			});

			test('filters out disabled default location', () => {
				assert.deepStrictEqual(
					PromptsConfig.promptSourceFolders(createMock({
						'/etc/hosts.backup': '\t\n\t',
						'./run.tests.sh': '\v',
						'.github/prompts': false,
						'../assets/img/logo.v2.png': true,
						'/mnt/storage/video.archive/episode.01.mkv': false,
						'../.local/bin/script.sh': true,
						'/usr/local/share/.fonts/CustomFont.otf': '',
						'../../development/branch.name/some.test': true,
						'.giThub/prompts': true,
						'/Home/user/.ssh/config': true,
						'./hidden.dir/.subhidden': '\f',
						'/tmp/.temp.folder/cache.db': true,
						'/opt/software/v3.2.1/build.log': '  ',
						'': true,
						'./scripts/.old.build.sh': true,
						'/var/data/datafile.2025-02-05.json': '\n',
						'\n\n': true,
						'\t': true,
						'\v': true,
						'\f': true,
						'\r\n': true,
						'\f\f': true,
						'../lib/some_library.v1.0.1.so': '\r\n',
						'/dev/shm/.shared_resource': 853,
					}), PromptsType.prompt),
					[
						'../assets/img/logo.v2.png',
						'../.local/bin/script.sh',
						'../../development/branch.name/some.test',
						'.giThub/prompts',
						'/Home/user/.ssh/config',
						'/tmp/.temp.folder/cache.db',
						'./scripts/.old.build.sh',
					],
					'Must read correct value.',
				);
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/config/constants.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/config/constants.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { getCleanPromptName, isPromptOrInstructionsFile } from '../../../../common/promptSyntax/config/promptFileLocations.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../base/test/common/utils.js';
import { URI } from '../../../../../../../base/common/uri.js';


suite('Prompt Constants', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('getCleanPromptName', () => {
		test('returns a clean prompt name', () => {
			assert.strictEqual(
				getCleanPromptName(URI.file('/path/to/my-prompt.prompt.md')),
				'my-prompt',
			);

			assert.strictEqual(
				getCleanPromptName(URI.file('../common.prompt.md')),
				'common',
			);

			const expectedPromptName = `some-3095`;
			assert.strictEqual(
				getCleanPromptName(URI.file(`./${expectedPromptName}.prompt.md`)),
				expectedPromptName,
			);

			assert.strictEqual(
				getCleanPromptName(URI.file('.github/copilot-instructions.md')),
				'copilot-instructions',
			);

			assert.strictEqual(
				getCleanPromptName(URI.file('/etc/prompts/my-prompt')),
				'my-prompt',
			);

			assert.strictEqual(
				getCleanPromptName(URI.file('../some-folder/frequent.txt')),
				'frequent.txt',
			);

			assert.strictEqual(
				getCleanPromptName(URI.parse('untitled:Untitled-1')),
				'Untitled-1',
			);
		});
	});

	suite('isPromptOrInstructionsFile', () => {
		test('returns `true` for prompt files', () => {
			assert(
				isPromptOrInstructionsFile(URI.file('/path/to/my-prompt.prompt.md')),
			);

			assert(
				isPromptOrInstructionsFile(URI.file('../common.prompt.md')),
			);

			assert(
				isPromptOrInstructionsFile(URI.file(`./some-38294.prompt.md`)),
			);

			assert(
				isPromptOrInstructionsFile(URI.file('.github/copilot-instructions.md')),
			);
		});

		test('returns `false` for non-prompt files', () => {
			assert(
				!isPromptOrInstructionsFile(URI.file('/path/to/my-prompt.prompt.md1')),
			);

			assert(
				!isPromptOrInstructionsFile(URI.file('../common.md')),
			);

			assert(
				!isPromptOrInstructionsFile(URI.file(`./some-2530.txt`)),
			);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/service/newPromptsParser.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/service/newPromptsParser.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';

import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../base/test/common/utils.js';
import { Range } from '../../../../../../../editor/common/core/range.js';
import { URI } from '../../../../../../../base/common/uri.js';
import { PromptFileParser } from '../../../../common/promptSyntax/promptFileParser.js';

suite('NewPromptsParser', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('agent', async () => {
		const uri = URI.parse('file:///test/test.agent.md');
		const content = [
			/* 01 */'---',
			/* 02 */`description: "Agent test"`,
			/* 03 */'model: GPT 4.1',
			/* 04 */`tools: ['tool1', 'tool2']`,
			/* 05 */'---',
			/* 06 */'This is an agent test.',
			/* 07 */'Here is a #tool:tool1 variable (and one with closing parenthesis after: #tool:tool-2) and a #file:./reference1.md as well as a [reference](./reference2.md).',
		].join('\n');
		const result = new PromptFileParser().parse(uri, content);
		assert.deepEqual(result.uri, uri);
		assert.ok(result.header);
		assert.ok(result.body);
		assert.deepEqual(result.header.range, { startLineNumber: 2, startColumn: 1, endLineNumber: 5, endColumn: 1 });
		assert.deepEqual(result.header.attributes, [
			{ key: 'description', range: new Range(2, 1, 2, 26), value: { type: 'string', value: 'Agent test', range: new Range(2, 14, 2, 26) } },
			{ key: 'model', range: new Range(3, 1, 3, 15), value: { type: 'string', value: 'GPT 4.1', range: new Range(3, 8, 3, 15) } },
			{
				key: 'tools', range: new Range(4, 1, 4, 26), value: {
					type: 'array',
					items: [{ type: 'string', value: 'tool1', range: new Range(4, 9, 4, 16) }, { type: 'string', value: 'tool2', range: new Range(4, 18, 4, 25) }],
					range: new Range(4, 8, 4, 26)
				}
			},
		]);
		assert.deepEqual(result.body.range, { startLineNumber: 6, startColumn: 1, endLineNumber: 8, endColumn: 1 });
		assert.equal(result.body.offset, 75);
		assert.equal(result.body.getContent(), 'This is an agent test.\nHere is a #tool:tool1 variable (and one with closing parenthesis after: #tool:tool-2) and a #file:./reference1.md as well as a [reference](./reference2.md).');

		assert.deepEqual(result.body.fileReferences, [
			{ range: new Range(7, 99, 7, 114), content: './reference1.md', isMarkdownLink: false },
			{ range: new Range(7, 140, 7, 155), content: './reference2.md', isMarkdownLink: true }
		]);
		assert.deepEqual(result.body.variableReferences, [
			{ range: new Range(7, 17, 7, 22), name: 'tool1', offset: 108 },
			{ range: new Range(7, 79, 7, 85), name: 'tool-2', offset: 170 }
		]);
		assert.deepEqual(result.header.description, 'Agent test');
		assert.deepEqual(result.header.model, 'GPT 4.1');
		assert.ok(result.header.tools);
		assert.deepEqual(result.header.tools, ['tool1', 'tool2']);
	});

	test('mode with handoff', async () => {
		const uri = URI.parse('file:///test/test.agent.md');
		const content = [
			/* 01 */'---',
			/* 02 */`description: "Agent test"`,
			/* 03 */'model: GPT 4.1',
			/* 04 */'handoffs:',
			/* 05 */'  - label: "Implement"',
			/* 06 */'    agent: Default',
			/* 07 */'    prompt: "Implement the plan"',
			/* 08 */'    send: false',
			/* 09 */'  - label: "Save"',
			/* 10 */'    agent: Default',
			/* 11 */'    prompt: "Save the plan to a file"',
			/* 12 */'    send: true',
			/* 13 */'---',
		].join('\n');
		const result = new PromptFileParser().parse(uri, content);
		assert.deepEqual(result.uri, uri);
		assert.ok(result.header);
		assert.deepEqual(result.header.range, { startLineNumber: 2, startColumn: 1, endLineNumber: 13, endColumn: 1 });
		assert.deepEqual(result.header.attributes, [
			{ key: 'description', range: new Range(2, 1, 2, 26), value: { type: 'string', value: 'Agent test', range: new Range(2, 14, 2, 26) } },
			{ key: 'model', range: new Range(3, 1, 3, 15), value: { type: 'string', value: 'GPT 4.1', range: new Range(3, 8, 3, 15) } },
			{
				key: 'handoffs', range: new Range(4, 1, 12, 15), value: {
					type: 'array',
					range: new Range(5, 3, 12, 15),
					items: [
						{
							type: 'object', range: new Range(5, 5, 8, 16),
							properties: [
								{ key: { type: 'string', value: 'label', range: new Range(5, 5, 5, 10) }, value: { type: 'string', value: 'Implement', range: new Range(5, 12, 5, 23) } },
								{ key: { type: 'string', value: 'agent', range: new Range(6, 5, 6, 10) }, value: { type: 'string', value: 'Default', range: new Range(6, 12, 6, 19) } },
								{ key: { type: 'string', value: 'prompt', range: new Range(7, 5, 7, 11) }, value: { type: 'string', value: 'Implement the plan', range: new Range(7, 13, 7, 33) } },
								{ key: { type: 'string', value: 'send', range: new Range(8, 5, 8, 9) }, value: { type: 'boolean', value: false, range: new Range(8, 11, 8, 16) } },
							]
						},
						{
							type: 'object', range: new Range(9, 5, 12, 15),
							properties: [
								{ key: { type: 'string', value: 'label', range: new Range(9, 5, 9, 10) }, value: { type: 'string', value: 'Save', range: new Range(9, 12, 9, 18) } },
								{ key: { type: 'string', value: 'agent', range: new Range(10, 5, 10, 10) }, value: { type: 'string', value: 'Default', range: new Range(10, 12, 10, 19) } },
								{ key: { type: 'string', value: 'prompt', range: new Range(11, 5, 11, 11) }, value: { type: 'string', value: 'Save the plan to a file', range: new Range(11, 13, 11, 38) } },
								{ key: { type: 'string', value: 'send', range: new Range(12, 5, 12, 9) }, value: { type: 'boolean', value: true, range: new Range(12, 11, 12, 15) } },
							]
						},
					]
				}
			},
		]);
		assert.deepEqual(result.header.description, 'Agent test');
		assert.deepEqual(result.header.model, 'GPT 4.1');
		assert.ok(result.header.handOffs);
		assert.deepEqual(result.header.handOffs, [
			{ label: 'Implement', agent: 'Default', prompt: 'Implement the plan', send: false },
			{ label: 'Save', agent: 'Default', prompt: 'Save the plan to a file', send: true }
		]);
	});

	test('mode with handoff and showContinueOn per handoff', async () => {
		const uri = URI.parse('file:///test/test.agent.md');
		const content = [
			/* 01 */'---',
			/* 02 */`description: "Agent test"`,
			/* 03 */'model: GPT 4.1',
			/* 04 */'handoffs:',
			/* 05 */'  - label: "Implement"',
			/* 06 */'    agent: Default',
			/* 07 */'    prompt: "Implement the plan"',
			/* 08 */'    send: false',
			/* 09 */'    showContinueOn: false',
			/* 10 */'  - label: "Save"',
			/* 11 */'    agent: Default',
			/* 12 */'    prompt: "Save the plan"',
			/* 13 */'    send: true',
			/* 14 */'    showContinueOn: true',
			/* 15 */'---',
		].join('\n');
		const result = new PromptFileParser().parse(uri, content);
		assert.deepEqual(result.uri, uri);
		assert.ok(result.header);
		assert.ok(result.header.handOffs);
		assert.deepEqual(result.header.handOffs, [
			{ label: 'Implement', agent: 'Default', prompt: 'Implement the plan', send: false, showContinueOn: false },
			{ label: 'Save', agent: 'Default', prompt: 'Save the plan', send: true, showContinueOn: true }
		]);
	});

	test('showContinueOn defaults to undefined when not specified per handoff', async () => {
		const uri = URI.parse('file:///test/test.agent.md');
		const content = [
			/* 01 */'---',
			/* 02 */`description: "Agent test"`,
			/* 03 */'handoffs:',
			/* 04 */'  - label: "Save"',
			/* 05 */'    agent: Default',
			/* 06 */'    prompt: "Save the plan"',
			/* 07 */'---',
		].join('\n');
		const result = new PromptFileParser().parse(uri, content);
		assert.deepEqual(result.uri, uri);
		assert.ok(result.header);
		assert.ok(result.header.handOffs);
		assert.deepEqual(result.header.handOffs[0].showContinueOn, undefined);
	});

	test('instructions', async () => {
		const uri = URI.parse('file:///test/prompt1.md');
		const content = [
			/* 01 */'---',
			/* 02 */`description: "Code style instructions for TypeScript"`,
			/* 03 */'applyTo: *.ts',
			/* 04 */'---',
			/* 05 */'Follow my companies coding guidlines at [mycomp-ts-guidelines](https://mycomp/guidelines#typescript.md)',
		].join('\n');
		const result = new PromptFileParser().parse(uri, content);
		assert.deepEqual(result.uri, uri);
		assert.ok(result.header);
		assert.ok(result.body);
		assert.deepEqual(result.header.range, { startLineNumber: 2, startColumn: 1, endLineNumber: 4, endColumn: 1 });
		assert.deepEqual(result.header.attributes, [
			{ key: 'description', range: new Range(2, 1, 2, 54), value: { type: 'string', value: 'Code style instructions for TypeScript', range: new Range(2, 14, 2, 54) } },
			{ key: 'applyTo', range: new Range(3, 1, 3, 14), value: { type: 'string', value: '*.ts', range: new Range(3, 10, 3, 14) } },
		]);
		assert.deepEqual(result.body.range, { startLineNumber: 5, startColumn: 1, endLineNumber: 6, endColumn: 1 });
		assert.equal(result.body.offset, 76);
		assert.equal(result.body.getContent(), 'Follow my companies coding guidlines at [mycomp-ts-guidelines](https://mycomp/guidelines#typescript.md)');

		assert.deepEqual(result.body.fileReferences, [
			{ range: new Range(5, 64, 5, 103), content: 'https://mycomp/guidelines#typescript.md', isMarkdownLink: true },
		]);
		assert.deepEqual(result.body.variableReferences, []);
		assert.deepEqual(result.header.description, 'Code style instructions for TypeScript');
		assert.deepEqual(result.header.applyTo, '*.ts');
	});

	test('prompt file', async () => {
		const uri = URI.parse('file:///test/prompt2.md');
		const content = [
			/* 01 */'---',
			/* 02 */`description: "General purpose coding assistant"`,
			/* 03 */'agent: agent',
			/* 04 */'model: GPT 4.1',
			/* 05 */`tools: ['search', 'terminal']`,
			/* 06 */'---',
			/* 07 */'This is a prompt file body referencing #tool:search and [docs](https://example.com/docs).',
		].join('\n');
		const result = new PromptFileParser().parse(uri, content);
		assert.deepEqual(result.uri, uri);
		assert.ok(result.header);
		assert.ok(result.body);
		assert.deepEqual(result.header.range, { startLineNumber: 2, startColumn: 1, endLineNumber: 6, endColumn: 1 });
		assert.deepEqual(result.header.attributes, [
			{ key: 'description', range: new Range(2, 1, 2, 48), value: { type: 'string', value: 'General purpose coding assistant', range: new Range(2, 14, 2, 48) } },
			{ key: 'agent', range: new Range(3, 1, 3, 13), value: { type: 'string', value: 'agent', range: new Range(3, 8, 3, 13) } },
			{ key: 'model', range: new Range(4, 1, 4, 15), value: { type: 'string', value: 'GPT 4.1', range: new Range(4, 8, 4, 15) } },
			{
				key: 'tools', range: new Range(5, 1, 5, 30), value: {
					type: 'array',
					items: [{ type: 'string', value: 'search', range: new Range(5, 9, 5, 17) }, { type: 'string', value: 'terminal', range: new Range(5, 19, 5, 29) }],
					range: new Range(5, 8, 5, 30)
				}
			},
		]);
		assert.deepEqual(result.body.range, { startLineNumber: 7, startColumn: 1, endLineNumber: 8, endColumn: 1 });
		assert.equal(result.body.offset, 114);
		assert.equal(result.body.getContent(), 'This is a prompt file body referencing #tool:search and [docs](https://example.com/docs).');
		assert.deepEqual(result.body.fileReferences, [
			{ range: new Range(7, 64, 7, 88), content: 'https://example.com/docs', isMarkdownLink: true },
		]);
		assert.deepEqual(result.body.variableReferences, [
			{ range: new Range(7, 46, 7, 52), name: 'search', offset: 153 }
		]);
		assert.deepEqual(result.header.description, 'General purpose coding assistant');
		assert.deepEqual(result.header.agent, 'agent');
		assert.deepEqual(result.header.model, 'GPT 4.1');
		assert.ok(result.header.tools);
		assert.deepEqual(result.header.tools, ['search', 'terminal']);
	});

	test('prompt file tools as map', async () => {
		const uri = URI.parse('file:///test/prompt2.md');
		const content = [
			/* 01 */'---',
			/* 02 */'tools:',
			/* 03 */'  built-in: true',
			/* 04 */'  mcp:',
			/* 05 */'    vscode-playright-mcp:',
			/* 06 */'      browser-click: true',
			/* 07 */'  extensions:',
			/* 08 */'    github.vscode-pull-request-github:',
			/* 09 */'      openPullRequest: true',
			/* 10 */'      copilotCodingAgent: false',
			/* 11 */'---',
		].join('\n');
		const result = new PromptFileParser().parse(uri, content);
		assert.deepEqual(result.uri, uri);
		assert.ok(result.header);
		assert.ok(!result.body);
		assert.deepEqual(result.header.range, { startLineNumber: 2, startColumn: 1, endLineNumber: 11, endColumn: 1 });
		assert.deepEqual(result.header.attributes, [
			{
				key: 'tools', range: new Range(2, 1, 10, 32), value: {
					type: 'object',
					properties: [
						{
							'key': { type: 'string', value: 'built-in', range: new Range(3, 3, 3, 11) },
							'value': { type: 'boolean', value: true, range: new Range(3, 13, 3, 17) }
						},
						{
							'key': { type: 'string', value: 'mcp', range: new Range(4, 3, 4, 6) },
							'value': {
								type: 'object', range: new Range(5, 5, 6, 26), properties: [
									{
										'key': { type: 'string', value: 'vscode-playright-mcp', range: new Range(5, 5, 5, 25) }, 'value': {
											type: 'object', range: new Range(6, 7, 6, 26), properties: [
												{ 'key': { type: 'string', value: 'browser-click', range: new Range(6, 7, 6, 20) }, 'value': { type: 'boolean', value: true, range: new Range(6, 22, 6, 26) } }
											]
										}
									}
								]
							}
						},
						{
							'key': { type: 'string', value: 'extensions', range: new Range(7, 3, 7, 13) },
							'value': {
								type: 'object', range: new Range(8, 5, 10, 32), properties: [
									{
										'key': { type: 'string', value: 'github.vscode-pull-request-github', range: new Range(8, 5, 8, 38) }, 'value': {
											type: 'object', range: new Range(9, 7, 10, 32), properties: [
												{ 'key': { type: 'string', value: 'openPullRequest', range: new Range(9, 7, 9, 22) }, 'value': { type: 'boolean', value: true, range: new Range(9, 24, 9, 28) } },
												{ 'key': { type: 'string', value: 'copilotCodingAgent', range: new Range(10, 7, 10, 25) }, 'value': { type: 'boolean', value: false, range: new Range(10, 27, 10, 32) } }
											]
										}
									}
								]
							}
						},
					],
					range: new Range(3, 3, 10, 32)
				},
			}
		]);
		assert.deepEqual(result.header.description, undefined);
		assert.deepEqual(result.header.agent, undefined);
		assert.deepEqual(result.header.model, undefined);
		assert.ok(result.header.tools);
		assert.deepEqual(result.header.tools, ['built-in', 'browser-click', 'openPullRequest', 'copilotCodingAgent']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/test/common/promptSyntax/service/promptsService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/test/common/promptSyntax/service/promptsService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { CancellationToken } from '../../../../../../../base/common/cancellation.js';
import { ResourceSet } from '../../../../../../../base/common/map.js';
import { Schemas } from '../../../../../../../base/common/network.js';
import { URI } from '../../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../../base/test/common/utils.js';
import { Range } from '../../../../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../../../editor/common/services/model.js';
import { ModelService } from '../../../../../../../editor/common/services/modelService.js';
import { IConfigurationService } from '../../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IExtensionDescription } from '../../../../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../../../platform/files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { TestInstantiationService } from '../../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILabelService } from '../../../../../../../platform/label/common/label.js';
import { ILogService, NullLogService } from '../../../../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService } from '../../../../../../../platform/workspace/common/workspace.js';
import { testWorkspace } from '../../../../../../../platform/workspace/test/common/testWorkspace.js';
import { IWorkbenchEnvironmentService } from '../../../../../../services/environment/common/environmentService.js';
import { IFilesConfigurationService } from '../../../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IUserDataProfileService } from '../../../../../../services/userDataProfile/common/userDataProfile.js';
import { TestContextService, TestUserDataProfileService } from '../../../../../../test/common/workbenchTestServices.js';
import { ChatRequestVariableSet, isPromptFileVariableEntry, toFileVariableEntry } from '../../../../common/chatVariableEntries.js';
import { ComputeAutomaticInstructions, newInstructionsCollectionEvent } from '../../../../common/promptSyntax/computeAutomaticInstructions.js';
import { PromptsConfig } from '../../../../common/promptSyntax/config/config.js';
import { INSTRUCTION_FILE_EXTENSION, INSTRUCTIONS_DEFAULT_SOURCE_FOLDER, LEGACY_MODE_DEFAULT_SOURCE_FOLDER, PROMPT_DEFAULT_SOURCE_FOLDER, PROMPT_FILE_EXTENSION } from '../../../../common/promptSyntax/config/promptFileLocations.js';
import { INSTRUCTIONS_LANGUAGE_ID, PROMPT_LANGUAGE_ID, PromptsType } from '../../../../common/promptSyntax/promptTypes.js';
import { ExtensionAgentSourceType, ICustomAgent, ICustomAgentQueryOptions, IPromptsService, PromptsStorage } from '../../../../common/promptSyntax/service/promptsService.js';
import { PromptsService } from '../../../../common/promptSyntax/service/promptsServiceImpl.js';
import { mockFiles } from '../testUtils/mockFilesystem.js';
import { InMemoryStorageService, IStorageService } from '../../../../../../../platform/storage/common/storage.js';
import { IPathService } from '../../../../../../services/path/common/pathService.js';
import { ISearchService } from '../../../../../../services/search/common/search.js';
import { IExtensionService } from '../../../../../../services/extensions/common/extensions.js';
import { IDefaultAccountService } from '../../../../../../../platform/defaultAccount/common/defaultAccount.js';
import { IDefaultAccount } from '../../../../../../../base/common/defaultAccount.js';

suite('PromptsService', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	let service: IPromptsService;
	let instaService: TestInstantiationService;
	let workspaceContextService: TestContextService;
	let testConfigService: TestConfigurationService;
	let fileService: IFileService;

	setup(async () => {
		instaService = disposables.add(new TestInstantiationService());
		instaService.stub(ILogService, new NullLogService());

		workspaceContextService = new TestContextService();
		instaService.stub(IWorkspaceContextService, workspaceContextService);

		testConfigService = new TestConfigurationService();
		testConfigService.setUserConfiguration(PromptsConfig.USE_COPILOT_INSTRUCTION_FILES, true);
		testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_MD, true);
		testConfigService.setUserConfiguration(PromptsConfig.USE_NESTED_AGENT_MD, false);
		testConfigService.setUserConfiguration(PromptsConfig.INSTRUCTIONS_LOCATION_KEY, { [INSTRUCTIONS_DEFAULT_SOURCE_FOLDER]: true });
		testConfigService.setUserConfiguration(PromptsConfig.PROMPT_LOCATIONS_KEY, { [PROMPT_DEFAULT_SOURCE_FOLDER]: true });
		testConfigService.setUserConfiguration(PromptsConfig.MODE_LOCATION_KEY, { [LEGACY_MODE_DEFAULT_SOURCE_FOLDER]: true });

		instaService.stub(IConfigurationService, testConfigService);
		instaService.stub(IWorkbenchEnvironmentService, {});
		instaService.stub(IUserDataProfileService, new TestUserDataProfileService());
		instaService.stub(ITelemetryService, NullTelemetryService);
		instaService.stub(IStorageService, InMemoryStorageService);
		instaService.stub(IExtensionService, {
			whenInstalledExtensionsRegistered: () => Promise.resolve(true),
			activateByEvent: () => Promise.resolve()
		});

		instaService.stub(IDefaultAccountService, {
			getDefaultAccount: () => Promise.resolve({ chat_preview_features_enabled: true } as IDefaultAccount)
		});

		fileService = disposables.add(instaService.createInstance(FileService));
		instaService.stub(IFileService, fileService);

		const modelService = disposables.add(instaService.createInstance(ModelService));
		instaService.stub(IModelService, modelService);
		instaService.stub(ILanguageService, {
			guessLanguageIdByFilepathOrFirstLine(uri: URI) {
				if (uri.path.endsWith(PROMPT_FILE_EXTENSION)) {
					return PROMPT_LANGUAGE_ID;
				}

				if (uri.path.endsWith(INSTRUCTION_FILE_EXTENSION)) {
					return INSTRUCTIONS_LANGUAGE_ID;
				}

				return 'plaintext';
			}
		});
		instaService.stub(ILabelService, { getUriLabel: (uri: URI) => uri.path });

		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		disposables.add(fileService.registerProvider(Schemas.file, fileSystemProvider));

		instaService.stub(IFilesConfigurationService, { updateReadonly: () => Promise.resolve() });

		const pathService = {
			userHome: (): URI | Promise<URI> => {
				return Promise.resolve(URI.file('/home/user'));
			},
		} as IPathService;
		instaService.stub(IPathService, pathService);

		instaService.stub(ISearchService, {});

		service = disposables.add(instaService.createInstance(PromptsService));
		instaService.stub(IPromptsService, service);
	});

	suite('parse', () => {
		test('explicit', async function () {
			const rootFolderName = 'resolves-nested-file-references';
			const rootFolder = `/${rootFolderName}`;

			const rootFileName = 'file2.prompt.md';

			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			const rootFileUri = URI.joinPath(rootFolderUri, rootFileName);

			await mockFiles(fileService, [
				{
					path: `${rootFolder}/file1.prompt.md`,
					contents: [
						'## Some Header',
						'some contents',
						' ',
					],
				},
				{
					path: `${rootFolder}/${rootFileName}`,
					contents: [
						'---',
						'description: \'Root prompt description.\'',
						'tools: [\'my-tool1\', , true]',
						'agent: "agent" ',
						'---',
						'## Files',
						'\t- this file #file:folder1/file3.prompt.md ',
						'\t- also this [file4.prompt.md](./folder1/some-other-folder/file4.prompt.md) please!',
						'## Vars',
						'\t- #tool:my-tool',
						'\t- #tool:my-other-tool',
						' ',
					],
				},
				{
					path: `${rootFolder}/folder1/file3.prompt.md`,
					contents: [
						'---',
						'tools: [ false, \'my-tool1\' , ]',
						'agent: \'edit\'',
						'---',
						'',
						'[](./some-other-folder/non-existing-folder)',
						`\t- some seemingly random #file:${rootFolder}/folder1/some-other-folder/yetAnotherFolder🤭/another-file.instructions.md contents`,
						' some more\t content',
					],
				},
				{
					path: `${rootFolder}/folder1/some-other-folder/file4.prompt.md`,
					contents: [
						'---',
						'tools: [\'my-tool1\', "my-tool2", true, , ]',
						'something: true',
						'agent: \'ask\'\t',
						'description: "File 4 splendid description."',
						'---',
						'this file has a non-existing #file:./some-non-existing/file.prompt.md\t\treference',
						'',
						'',
						'and some',
						' non-prompt #file:./some-non-prompt-file.md\t\t \t[](../../folder1/)\t',
					],
				},
				{
					path: `${rootFolder}/folder1/some-other-folder/file.txt`,
					contents: [
						'---',
						'description: "Non-prompt file description".',
						'tools: ["my-tool-24"]',
						'---',
					],
				},
				{
					path: `${rootFolder}/folder1/some-other-folder/yetAnotherFolder🤭/another-file.instructions.md`,
					contents: [
						'---',
						'description: "Another file description."',
						'tools: [\'my-tool3\', false, "my-tool2" ]',
						'applyTo: "**/*.tsx"',
						'---',
						`[](${rootFolder}/folder1/some-other-folder)`,
						'another-file.instructions.md contents\t [#file:file.txt](../file.txt)',
					],
				},
				{
					path: `${rootFolder}/folder1/some-other-folder/yetAnotherFolder🤭/one_more_file_just_in_case.prompt.md`,
					contents: ['one_more_file_just_in_case.prompt.md contents'],
				},
			]);

			const file3 = URI.joinPath(rootFolderUri, 'folder1/file3.prompt.md');
			const file4 = URI.joinPath(rootFolderUri, 'folder1/some-other-folder/file4.prompt.md');
			const someOtherFolder = URI.joinPath(rootFolderUri, '/folder1/some-other-folder');
			const someOtherFolderFile = URI.joinPath(rootFolderUri, '/folder1/some-other-folder/file.txt');
			const nonExistingFolder = URI.joinPath(rootFolderUri, 'folder1/some-other-folder/non-existing-folder');
			const yetAnotherFile = URI.joinPath(rootFolderUri, 'folder1/some-other-folder/yetAnotherFolder🤭/another-file.instructions.md');


			const result1 = await service.parseNew(rootFileUri, CancellationToken.None);
			assert.deepEqual(result1.uri, rootFileUri);
			assert.deepEqual(result1.header?.description, 'Root prompt description.');
			assert.deepEqual(result1.header?.tools, ['my-tool1']);
			assert.deepEqual(result1.header?.agent, 'agent');
			assert.ok(result1.body);
			assert.deepEqual(
				result1.body.fileReferences.map(r => result1.body?.resolveFilePath(r.content)),
				[file3, file4],
			);
			assert.deepEqual(
				result1.body.variableReferences,
				[
					{ name: 'my-tool', range: new Range(10, 10, 10, 17), offset: 240 },
					{ name: 'my-other-tool', range: new Range(11, 10, 11, 23), offset: 257 },
				]
			);

			const result2 = await service.parseNew(file3, CancellationToken.None);
			assert.deepEqual(result2.uri, file3);
			assert.deepEqual(result2.header?.agent, 'edit');
			assert.ok(result2.body);
			assert.deepEqual(
				result2.body.fileReferences.map(r => result2.body?.resolveFilePath(r.content)),
				[nonExistingFolder, yetAnotherFile],
			);

			const result3 = await service.parseNew(yetAnotherFile, CancellationToken.None);
			assert.deepEqual(result3.uri, yetAnotherFile);
			assert.deepEqual(result3.header?.description, 'Another file description.');
			assert.deepEqual(result3.header?.applyTo, '**/*.tsx');
			assert.ok(result3.body);
			assert.deepEqual(
				result3.body.fileReferences.map(r => result3.body?.resolveFilePath(r.content)),
				[someOtherFolder, someOtherFolderFile],
			);
			assert.deepEqual(result3.body.variableReferences, []);

			const result4 = await service.parseNew(file4, CancellationToken.None);
			assert.deepEqual(result4.uri, file4);
			assert.deepEqual(result4.header?.description, 'File 4 splendid description.');
			assert.ok(result4.body);
			assert.deepEqual(
				result4.body.fileReferences.map(r => result4.body?.resolveFilePath(r.content)),
				[
					URI.joinPath(rootFolderUri, '/folder1/some-other-folder/some-non-existing/file.prompt.md'),
					URI.joinPath(rootFolderUri, '/folder1/some-other-folder/some-non-prompt-file.md'),
					URI.joinPath(rootFolderUri, '/folder1/'),
				],
			);
			assert.deepEqual(result4.body.variableReferences, []);
		});
	});

	suite('findInstructionFilesFor', () => {
		teardown(() => {
			sinon.restore();
		});

		test('finds correct instruction files', async () => {
			const rootFolderName = 'finds-instruction-files';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			const userPromptsFolderName = '/tmp/user-data/prompts';
			const userPromptsFolderUri = URI.file(userPromptsFolderName);

			sinon.stub(service, 'listPromptFiles')
				.returns(Promise.resolve([
					// local instructions
					{
						uri: URI.joinPath(rootFolderUri, '.github/prompts/file1.instructions.md'),
						storage: PromptsStorage.local,
						type: PromptsType.instructions,
					},
					{
						uri: URI.joinPath(rootFolderUri, '.github/prompts/file2.instructions.md'),
						storage: PromptsStorage.local,
						type: PromptsType.instructions,
					},
					{
						uri: URI.joinPath(rootFolderUri, '.github/prompts/file3.instructions.md'),
						storage: PromptsStorage.local,
						type: PromptsType.instructions,
					},
					{
						uri: URI.joinPath(rootFolderUri, '.github/prompts/file4.instructions.md'),
						storage: PromptsStorage.local,
						type: PromptsType.instructions,
					},
					// user instructions
					{
						uri: URI.joinPath(userPromptsFolderUri, 'file10.instructions.md'),
						storage: PromptsStorage.user,
						type: PromptsType.instructions,
					},
					{
						uri: URI.joinPath(userPromptsFolderUri, 'file11.instructions.md'),
						storage: PromptsStorage.user,
						type: PromptsType.instructions,
					},
				]));

			// mock current workspace file structure
			await mockFiles(fileService, [
				{
					path: `${rootFolder}/file1.prompt.md`,
					contents: [
						'## Some Header',
						'some contents',
						' ',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file1.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 1.\'',
						'applyTo: "**/*.tsx"',
						'---',
						'Some instructions 1 contents.',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file2.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 2.\'',
						'applyTo: "**/folder1/*.tsx"',
						'---',
						'Some instructions 2 contents.',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file3.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 3.\'',
						'applyTo: "**/folder2/*.tsx"',
						'---',
						'Some instructions 3 contents.',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file4.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 4.\'',
						'applyTo: "src/build/*.tsx"',
						'---',
						'Some instructions 4 contents.',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file5.prompt.md`,
					contents: [
						'---',
						'description: \'Prompt file 5.\'',
						'---',
						'Some prompt 5 contents.',
					]
				},
				{
					path: `${rootFolder}/folder1/main.tsx`,
					contents: [
						'console.log("Haalou!")'
					]
				}
			]);

			// mock user data instructions
			await mockFiles(fileService, [
				{
					path: `${userPromptsFolderName}/file10.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 10.\'',
						'applyTo: "**/folder1/*.tsx"',
						'---',
						'Some instructions 10 contents.',
					]
				},
				{
					path: `${userPromptsFolderName}/file11.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 11.\'',
						'applyTo: "**/folder1/*.py"',
						'---',
						'Some instructions 11 contents.',
					]
				},
				{
					path: `${userPromptsFolderName}/file12.prompt.md`,
					contents: [
						'---',
						'description: \'Prompt file 12.\'',
						'---',
						'Some prompt 12 contents.',
					]
				}
			]);

			const instructionFiles = await service.listPromptFiles(PromptsType.instructions, CancellationToken.None);
			const contextComputer = instaService.createInstance(ComputeAutomaticInstructions, undefined);
			const context = {
				files: new ResourceSet([
					URI.joinPath(rootFolderUri, 'folder1/main.tsx'),
				]),
				instructions: new ResourceSet(),
			};
			const result = new ChatRequestVariableSet();

			await contextComputer.addApplyingInstructions(instructionFiles, context, result, newInstructionsCollectionEvent(), CancellationToken.None);

			assert.deepStrictEqual(
				result.asArray().map(i => isPromptFileVariableEntry(i) ? i.value.path : undefined),
				[
					// local instructions
					URI.joinPath(rootFolderUri, '.github/prompts/file1.instructions.md').path,
					URI.joinPath(rootFolderUri, '.github/prompts/file2.instructions.md').path,
					// user instructions
					URI.joinPath(userPromptsFolderUri, 'file10.instructions.md').path,
				],
				'Must find correct instruction files.',
			);
		});

		test('does not have duplicates', async () => {
			const rootFolderName = 'finds-instruction-files-without-duplicates';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			const userPromptsFolderName = '/tmp/user-data/prompts';
			const userPromptsFolderUri = URI.file(userPromptsFolderName);

			sinon.stub(service, 'listPromptFiles')
				.returns(Promise.resolve([
					// local instructions
					{
						uri: URI.joinPath(rootFolderUri, '.github/prompts/file1.instructions.md'),
						storage: PromptsStorage.local,
						type: PromptsType.instructions,
					},
					{
						uri: URI.joinPath(rootFolderUri, '.github/prompts/file2.instructions.md'),
						storage: PromptsStorage.local,
						type: PromptsType.instructions,
					},
					{
						uri: URI.joinPath(rootFolderUri, '.github/prompts/file3.instructions.md'),
						storage: PromptsStorage.local,
						type: PromptsType.instructions,
					},
					{
						uri: URI.joinPath(rootFolderUri, '.github/prompts/file4.instructions.md'),
						storage: PromptsStorage.local,
						type: PromptsType.instructions,
					},
					// user instructions
					{
						uri: URI.joinPath(userPromptsFolderUri, 'file10.instructions.md'),
						storage: PromptsStorage.user,
						type: PromptsType.instructions,
					},
					{
						uri: URI.joinPath(userPromptsFolderUri, 'file11.instructions.md'),
						storage: PromptsStorage.user,
						type: PromptsType.instructions,
					},
				]));

			// mock current workspace file structure
			await mockFiles(fileService, [
				{
					path: `${rootFolder}/file1.prompt.md`,
					contents: [
						'## Some Header',
						'some contents',
						' ',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file1.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 1.\'',
						'applyTo: "**/*.tsx"',
						'---',
						'Some instructions 1 contents.',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file2.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 2.\'',
						'applyTo: "**/folder1/*.tsx"',
						'---',
						'Some instructions 2 contents. [](./file1.instructions.md)',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file3.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 3.\'',
						'applyTo: "**/folder2/*.tsx"',
						'---',
						'Some instructions 3 contents.',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file4.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 4.\'',
						'applyTo: "src/build/*.tsx"',
						'---',
						'[](./file3.instructions.md) Some instructions 4 contents.',
					]
				},
				{
					path: `${rootFolder}/.github/prompts/file5.prompt.md`,
					contents: [
						'---',
						'description: \'Prompt file 5.\'',
						'---',
						'Some prompt 5 contents.',
					]
				},
				{
					path: `${rootFolder}/folder1/main.tsx`,
					contents: [
						'console.log("Haalou!")'
					]
				}
			]);

			// mock user data instructions
			await mockFiles(fileService, [
				{
					path: `${userPromptsFolderName}/file10.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 10.\'',
						'applyTo: "**/folder1/*.tsx"',
						'---',
						'Some instructions 10 contents.',
					]
				},
				{
					path: `${userPromptsFolderName}/file11.instructions.md`,
					contents: [
						'---',
						'description: \'Instructions file 11.\'',
						'applyTo: "**/folder1/*.py"',
						'---',
						'Some instructions 11 contents.',
					]
				},
				{
					path: `${userPromptsFolderName}/file12.prompt.md`,
					contents: [
						'---',
						'description: \'Prompt file 12.\'',
						'---',
						'Some prompt 12 contents.',
					]
				}
			]);

			const instructionFiles = await service.listPromptFiles(PromptsType.instructions, CancellationToken.None);
			const contextComputer = instaService.createInstance(ComputeAutomaticInstructions, undefined);
			const context = {
				files: new ResourceSet([
					URI.joinPath(rootFolderUri, 'folder1/main.tsx'),
					URI.joinPath(rootFolderUri, 'folder1/index.tsx'),
					URI.joinPath(rootFolderUri, 'folder1/constants.tsx'),
				]),
				instructions: new ResourceSet(),
			};

			const result = new ChatRequestVariableSet();
			await contextComputer.addApplyingInstructions(instructionFiles, context, result, newInstructionsCollectionEvent(), CancellationToken.None);

			assert.deepStrictEqual(
				result.asArray().map(i => isPromptFileVariableEntry(i) ? i.value.path : undefined),
				[
					// local instructions
					URI.joinPath(rootFolderUri, '.github/prompts/file1.instructions.md').path,
					URI.joinPath(rootFolderUri, '.github/prompts/file2.instructions.md').path,
					// user instructions
					URI.joinPath(userPromptsFolderUri, 'file10.instructions.md').path,
				],
				'Must find correct instruction files.',
			);
		});

		test('copilot-instructions and AGENTS.md', async () => {
			const rootFolderName = 'copilot-instructions-and-agents';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			// mock current workspace file structure
			await mockFiles(fileService, [
				{
					path: `${rootFolder}/codestyle.md`,
					contents: [
						'Can you see this?',
					]
				},
				{
					path: `${rootFolder}/AGENTS.md`,
					contents: [
						'What about this?',
					]
				},
				{
					path: `${rootFolder}/README.md`,
					contents: [
						'Thats my project?',
					]
				},
				{
					path: `${rootFolder}/.github/copilot-instructions.md`,
					contents: [
						'Be nice and friendly. Also look at instructions at #file:../codestyle.md and [more-codestyle.md](./more-codestyle.md).',
					]
				},
				{
					path: `${rootFolder}/.github/more-codestyle.md`,
					contents: [
						'I like it clean.',
					]
				},
				{
					path: `${rootFolder}/folder1/AGENTS.md`,
					contents: [
						'An AGENTS.md file in another repo'
					]
				}
			]);


			const contextComputer = instaService.createInstance(ComputeAutomaticInstructions, undefined);
			const context = new ChatRequestVariableSet();
			context.add(toFileVariableEntry(URI.joinPath(rootFolderUri, 'README.md')));

			await contextComputer.collect(context, CancellationToken.None);

			assert.deepStrictEqual(
				context.asArray().map(i => isPromptFileVariableEntry(i) ? i.value.path : undefined).filter(e => !!e).sort(),
				[
					URI.joinPath(rootFolderUri, '.github/copilot-instructions.md').path,
					URI.joinPath(rootFolderUri, '.github/more-codestyle.md').path,
					URI.joinPath(rootFolderUri, 'AGENTS.md').path,
					URI.joinPath(rootFolderUri, 'codestyle.md').path,
				].sort(),
				'Must find correct instruction files.',
			);
		});
	});

	suite('getCustomAgents', () => {
		teardown(() => {
			sinon.restore();
		});


		test('header with handOffs', async () => {
			const rootFolderName = 'custom-agents-with-handoffs';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/agents/agent1.agent.md`,
					contents: [
						'---',
						'description: \'Agent file 1.\'',
						'handoffs: [ { agent: "Edit", label: "Do it", prompt: "Do it now" } ]',
						'---',
					]
				}
			]);

			const result = (await service.getCustomAgents(CancellationToken.None)).map(agent => ({ ...agent, uri: URI.from(agent.uri) }));
			const expected: ICustomAgent[] = [
				{
					name: 'agent1',
					description: 'Agent file 1.',
					handOffs: [{ agent: 'Edit', label: 'Do it', prompt: 'Do it now' }],
					agentInstructions: {
						content: '',
						toolReferences: [],
						metadata: undefined
					},
					model: undefined,
					argumentHint: undefined,
					tools: undefined,
					target: undefined,
					infer: undefined,
					uri: URI.joinPath(rootFolderUri, '.github/agents/agent1.agent.md'),
					source: { storage: PromptsStorage.local }
				},
			];

			assert.deepEqual(
				result,
				expected,
				'Must get custom agents.',
			);
		});

		test('body with tool references', async () => {
			const rootFolderName = 'custom-agents';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			// mock current workspace file structure
			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/agents/agent1.agent.md`,
					contents: [
						'---',
						'description: \'Agent file 1.\'',
						'tools: [ tool1, tool2 ]',
						'---',
						'Do it with #tool:tool1',
					]
				},
				{
					path: `${rootFolder}/.github/agents/agent2.agent.md`,
					contents: [
						'First use #tool:tool2\nThen use #tool:tool1',
					]
				}
			]);

			const result = (await service.getCustomAgents(CancellationToken.None)).map(agent => ({ ...agent, uri: URI.from(agent.uri) }));
			const expected: ICustomAgent[] = [
				{
					name: 'agent1',
					description: 'Agent file 1.',
					tools: ['tool1', 'tool2'],
					agentInstructions: {
						content: 'Do it with #tool:tool1',
						toolReferences: [{ name: 'tool1', range: { start: 11, endExclusive: 17 } }],
						metadata: undefined
					},
					handOffs: undefined,
					model: undefined,
					argumentHint: undefined,
					target: undefined,
					infer: undefined,
					uri: URI.joinPath(rootFolderUri, '.github/agents/agent1.agent.md'),
					source: { storage: PromptsStorage.local },
				},
				{
					name: 'agent2',
					agentInstructions: {
						content: 'First use #tool:tool2\nThen use #tool:tool1',
						toolReferences: [
							{ name: 'tool1', range: { start: 31, endExclusive: 37 } },
							{ name: 'tool2', range: { start: 10, endExclusive: 16 } }
						],
						metadata: undefined
					},
					uri: URI.joinPath(rootFolderUri, '.github/agents/agent2.agent.md'),
					source: { storage: PromptsStorage.local },
				}
			];

			assert.deepEqual(
				result,
				expected,
				'Must get custom agents.',
			);
		});

		test('header with argumentHint', async () => {
			const rootFolderName = 'custom-agents-with-argument-hint';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/agents/agent1.agent.md`,
					contents: [
						'---',
						'description: \'Code review agent.\'',
						'argument-hint: \'Provide file path or code snippet to review\'',
						'tools: [ code-analyzer, linter ]',
						'---',
						'I will help review your code for best practices.',
					]
				},
				{
					path: `${rootFolder}/.github/agents/agent2.agent.md`,
					contents: [
						'---',
						'description: \'Documentation generator.\'',
						'argument-hint: \'Specify function or class name to document\'',
						'---',
						'I generate comprehensive documentation.',
					]
				}
			]);

			const result = (await service.getCustomAgents(CancellationToken.None)).map(agent => ({ ...agent, uri: URI.from(agent.uri) }));
			const expected: ICustomAgent[] = [
				{
					name: 'agent1',
					description: 'Code review agent.',
					argumentHint: 'Provide file path or code snippet to review',
					tools: ['code-analyzer', 'linter'],
					agentInstructions: {
						content: 'I will help review your code for best practices.',
						toolReferences: [],
						metadata: undefined
					},
					handOffs: undefined,
					model: undefined,
					target: undefined,
					infer: undefined,
					uri: URI.joinPath(rootFolderUri, '.github/agents/agent1.agent.md'),
					source: { storage: PromptsStorage.local }
				},
				{
					name: 'agent2',
					description: 'Documentation generator.',
					argumentHint: 'Specify function or class name to document',
					agentInstructions: {
						content: 'I generate comprehensive documentation.',
						toolReferences: [],
						metadata: undefined
					},
					handOffs: undefined,
					model: undefined,
					tools: undefined,
					target: undefined,
					infer: undefined,
					uri: URI.joinPath(rootFolderUri, '.github/agents/agent2.agent.md'),
					source: { storage: PromptsStorage.local }
				},
			];

			assert.deepEqual(
				result,
				expected,
				'Must get custom agents with argumentHint.',
			);
		});

		test('header with target', async () => {
			const rootFolderName = 'custom-agents-with-target';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/agents/github-agent.agent.md`,
					contents: [
						'---',
						'description: \'GitHub Copilot specialized agent.\'',
						'target: \'github-copilot\'',
						'tools: [ github-api, code-search ]',
						'---',
						'I am optimized for GitHub Copilot workflows.',
					]
				},
				{
					path: `${rootFolder}/.github/agents/vscode-agent.agent.md`,
					contents: [
						'---',
						'description: \'VS Code specialized agent.\'',
						'target: \'vscode\'',
						'model: \'gpt-4\'',
						'---',
						'I am specialized for VS Code editor tasks.',
					]
				},
				{
					path: `${rootFolder}/.github/agents/generic-agent.agent.md`,
					contents: [
						'---',
						'description: \'Generic agent without target.\'',
						'---',
						'I work everywhere.',
					]
				}
			]);

			const result = (await service.getCustomAgents(CancellationToken.None)).map(agent => ({ ...agent, uri: URI.from(agent.uri) }));
			const expected: ICustomAgent[] = [
				{
					name: 'github-agent',
					description: 'GitHub Copilot specialized agent.',
					target: 'github-copilot',
					tools: ['github-api', 'code-search'],
					agentInstructions: {
						content: 'I am optimized for GitHub Copilot workflows.',
						toolReferences: [],
						metadata: undefined
					},
					handOffs: undefined,
					model: undefined,
					argumentHint: undefined,
					infer: undefined,
					uri: URI.joinPath(rootFolderUri, '.github/agents/github-agent.agent.md'),
					source: { storage: PromptsStorage.local }
				},
				{
					name: 'vscode-agent',
					description: 'VS Code specialized agent.',
					target: 'vscode',
					model: 'gpt-4',
					agentInstructions: {
						content: 'I am specialized for VS Code editor tasks.',
						toolReferences: [],
						metadata: undefined
					},
					handOffs: undefined,
					argumentHint: undefined,
					tools: undefined,
					infer: undefined,
					uri: URI.joinPath(rootFolderUri, '.github/agents/vscode-agent.agent.md'),
					source: { storage: PromptsStorage.local }
				},
				{
					name: 'generic-agent',
					description: 'Generic agent without target.',
					agentInstructions: {
						content: 'I work everywhere.',
						toolReferences: [],
						metadata: undefined
					},
					handOffs: undefined,
					model: undefined,
					argumentHint: undefined,
					tools: undefined,
					target: undefined,
					infer: undefined,
					uri: URI.joinPath(rootFolderUri, '.github/agents/generic-agent.agent.md'),
					source: { storage: PromptsStorage.local }
				},
			];

			assert.deepEqual(
				result,
				expected,
				'Must get custom agents with target attribute.',
			);
		});

		test('agents with .md extension (no .agent.md)', async () => {
			const rootFolderName = 'custom-agents-md-extension';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/agents/demonstrate.md`,
					contents: [
						'---',
						'description: \'Demonstrate agent.\'',
						'tools: [ demo-tool ]',
						'---',
						'This is a demonstration agent using .md extension.',
					]
				},
				{
					path: `${rootFolder}/.github/agents/test.md`,
					contents: [
						'Test agent without header.',
					]
				}
			]);

			const result = (await service.getCustomAgents(CancellationToken.None)).map(agent => ({ ...agent, uri: URI.from(agent.uri) }));
			const expected: ICustomAgent[] = [
				{
					name: 'demonstrate',
					description: 'Demonstrate agent.',
					tools: ['demo-tool'],
					agentInstructions: {
						content: 'This is a demonstration agent using .md extension.',
						toolReferences: [],
						metadata: undefined
					},
					handOffs: undefined,
					model: undefined,
					argumentHint: undefined,
					target: undefined,
					infer: undefined,
					uri: URI.joinPath(rootFolderUri, '.github/agents/demonstrate.md'),
					source: { storage: PromptsStorage.local },
				},
				{
					name: 'test',
					agentInstructions: {
						content: 'Test agent without header.',
						toolReferences: [],
						metadata: undefined
					},
					uri: URI.joinPath(rootFolderUri, '.github/agents/test.md'),
					source: { storage: PromptsStorage.local },
				}
			];

			assert.deepEqual(
				result,
				expected,
				'Must get custom agents with .md extension from .github/agents/ folder.',
			);
		});
	});

	suite('listPromptFiles - extensions', () => {

		test('Contributed prompt file', async () => {
			const uri = URI.parse('file://extensions/my-extension/textMate.instructions.md');
			const extension = {} as IExtensionDescription;
			const registered = service.registerContributedFile(PromptsType.instructions,
				uri,
				extension,
				'TextMate Instructions',
				'Instructions to follow when authoring TextMate grammars',
			);

			const actual = await service.listPromptFiles(PromptsType.instructions, CancellationToken.None);
			assert.strictEqual(actual.length, 1);
			assert.strictEqual(actual[0].uri.toString(), uri.toString());
			assert.strictEqual(actual[0].name, 'TextMate Instructions');
			assert.strictEqual(actual[0].storage, PromptsStorage.extension);
			assert.strictEqual(actual[0].type, PromptsType.instructions);
			registered.dispose();
		});

		test('Custom agent provider', async () => {
			const agentUri = URI.parse('file://extensions/my-extension/myAgent.agent.md');
			const extension = {
				identifier: { value: 'test.my-extension' },
				enabledApiProposals: ['chatParticipantPrivate']
			} as unknown as IExtensionDescription;

			// Mock the agent file content
			await mockFiles(fileService, [
				{
					path: agentUri.path,
					contents: [
						'---',
						'description: \'My custom agent from provider\'',
						'tools: [ tool1, tool2 ]',
						'---',
						'I am a custom agent from a provider.',
					]
				}
			]);

			const provider = {
				provideCustomAgents: async (_options: ICustomAgentQueryOptions, _token: CancellationToken) => {
					return [
						{
							name: 'myAgent',
							description: 'My custom agent from provider',
							uri: agentUri
						}
					];
				}
			};

			const registered = service.registerCustomAgentsProvider(extension, provider);

			const actual = await service.getCustomAgents(CancellationToken.None);
			assert.strictEqual(actual.length, 1);
			assert.strictEqual(actual[0].name, 'myAgent');
			assert.strictEqual(actual[0].description, 'My custom agent from provider');
			assert.strictEqual(actual[0].uri.toString(), agentUri.toString());
			assert.strictEqual(actual[0].source.storage, PromptsStorage.extension);
			if (actual[0].source.storage === PromptsStorage.extension) {
				assert.strictEqual(actual[0].source.type, ExtensionAgentSourceType.provider);
			}

			registered.dispose();

			// After disposal, the agent should no longer be listed
			const actualAfterDispose = await service.getCustomAgents(CancellationToken.None);
			assert.strictEqual(actualAfterDispose.length, 0);
		});

		test('Custom agent provider with isEditable', async () => {
			const readonlyAgentUri = URI.parse('file://extensions/my-extension/readonlyAgent.agent.md');
			const editableAgentUri = URI.parse('file://extensions/my-extension/editableAgent.agent.md');
			const extension = {
				identifier: { value: 'test.my-extension' },
				enabledApiProposals: ['chatParticipantPrivate']
			} as unknown as IExtensionDescription;

			// Mock the agent file content
			await mockFiles(fileService, [
				{
					path: readonlyAgentUri.path,
					contents: [
						'---',
						'description: \'Readonly agent from provider\'',
						'---',
						'I am a readonly agent.',
					]
				},
				{
					path: editableAgentUri.path,
					contents: [
						'---',
						'description: \'Editable agent from provider\'',
						'---',
						'I am an editable agent.',
					]
				}
			]);

			const provider = {
				provideCustomAgents: async (_options: ICustomAgentQueryOptions, _token: CancellationToken) => {
					return [
						{
							name: 'readonlyAgent',
							description: 'Readonly agent from provider',
							uri: readonlyAgentUri,
							isEditable: false
						},
						{
							name: 'editableAgent',
							description: 'Editable agent from provider',
							uri: editableAgentUri,
							isEditable: true
						}
					];
				}
			};

			const registered = service.registerCustomAgentsProvider(extension, provider);

			// Spy on updateReadonly to verify it's called correctly
			const filesConfigService = instaService.get(IFilesConfigurationService);
			const updateReadonlySpy = sinon.spy(filesConfigService, 'updateReadonly');

			// List prompt files to trigger the readonly check
			await service.listPromptFiles(PromptsType.agent, CancellationToken.None);

			// Verify updateReadonly was called only for the non-editable agent
			assert.strictEqual(updateReadonlySpy.callCount, 1, 'updateReadonly should be called once');
			assert.ok(updateReadonlySpy.calledWith(readonlyAgentUri, true), 'updateReadonly should be called with readonly agent URI and true');

			const actual = await service.getCustomAgents(CancellationToken.None);
			assert.strictEqual(actual.length, 2);

			const readonlyAgent = actual.find(a => a.name === 'readonlyAgent');
			const editableAgent = actual.find(a => a.name === 'editableAgent');

			assert.ok(readonlyAgent, 'Readonly agent should be found');
			assert.ok(editableAgent, 'Editable agent should be found');
			assert.strictEqual(readonlyAgent!.description, 'Readonly agent from provider');
			assert.strictEqual(editableAgent!.description, 'Editable agent from provider');

			registered.dispose();
		});

		test('Contributed agent file that does not exist should not crash', async () => {
			const nonExistentUri = URI.parse('file://extensions/my-extension/nonexistent.agent.md');
			const existingUri = URI.parse('file://extensions/my-extension/existing.agent.md');
			const extension = {
				identifier: { value: 'test.my-extension' }
			} as unknown as IExtensionDescription;

			// Only create the existing file
			await mockFiles(fileService, [
				{
					path: existingUri.path,
					contents: [
						'---',
						'name: \'Existing Agent\'',
						'description: \'An agent that exists\'',
						'---',
						'I am an existing agent.',
					]
				}
			]);

			// Register both agents (one exists, one doesn't)
			const registered1 = service.registerContributedFile(
				PromptsType.agent,
				nonExistentUri,
				extension,
				'NonExistent Agent',
				'An agent that does not exist',
			);

			const registered2 = service.registerContributedFile(
				PromptsType.agent,
				existingUri,
				extension,
				'Existing Agent',
				'An agent that exists',
			);

			// Verify that getCustomAgents doesn't crash and returns only the valid agent
			const agents = await service.getCustomAgents(CancellationToken.None);

			// Should only get the existing agent, not the non-existent one
			assert.strictEqual(agents.length, 1, 'Should only return the agent that exists');
			assert.strictEqual(agents[0].name, 'Existing Agent');
			assert.strictEqual(agents[0].description, 'An agent that exists');
			assert.strictEqual(agents[0].uri.toString(), existingUri.toString());

			registered1.dispose();
			registered2.dispose();
		});
	});

	suite('findAgentSkills', () => {
		teardown(() => {
			sinon.restore();
		});

		test('should return undefined when USE_AGENT_SKILLS is disabled', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, false);

			const result = await service.findAgentSkills(CancellationToken.None);
			assert.strictEqual(result, undefined);
		});

		test('should return undefined when chat_preview_features_enabled is false', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, true);
			instaService.stub(IDefaultAccountService, {
				getDefaultAccount: () => Promise.resolve({ chat_preview_features_enabled: false } as IDefaultAccount)
			});

			// Recreate service with new stub
			service = disposables.add(instaService.createInstance(PromptsService));

			const result = await service.findAgentSkills(CancellationToken.None);
			assert.strictEqual(result, undefined);

			// Restore default stub for other tests
			instaService.stub(IDefaultAccountService, {
				getDefaultAccount: () => Promise.resolve({ chat_preview_features_enabled: true } as IDefaultAccount)
			});
		});

		test('should return undefined when USE_AGENT_SKILLS is enabled but chat_preview_features_enabled is false', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, true);
			instaService.stub(IDefaultAccountService, {
				getDefaultAccount: () => Promise.resolve({ chat_preview_features_enabled: false } as IDefaultAccount)
			});

			// Recreate service with new stub
			service = disposables.add(instaService.createInstance(PromptsService));

			const result = await service.findAgentSkills(CancellationToken.None);
			assert.strictEqual(result, undefined);

			// Restore default stub for other tests
			instaService.stub(IDefaultAccountService, {
				getDefaultAccount: () => Promise.resolve({ chat_preview_features_enabled: true } as IDefaultAccount)
			});
		});

		test('should find skills in workspace and user home', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, true);

			const rootFolderName = 'agent-skills-test';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			// Create mock filesystem with skills in both .github/skills and .claude/skills
			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/skills/github-skill-1/SKILL.md`,
					contents: [
						'---',
						'name: "GitHub Skill 1"',
						'description: "A GitHub skill for testing"',
						'---',
						'This is GitHub skill 1 content',
					],
				},
				{
					path: `${rootFolder}/.claude/skills/claude-skill-1/SKILL.md`,
					contents: [
						'---',
						'name: "Claude Skill 1"',
						'description: "A Claude skill for testing"',
						'---',
						'This is Claude skill 1 content',
					],
				},
				{
					path: `${rootFolder}/.claude/skills/invalid-skill/SKILL.md`,
					contents: [
						'---',
						'description: "Invalid skill, no name"',
						'---',
						'This is invalid skill content',
					],
				},
				{
					path: `${rootFolder}/.github/skills/not-a-skill-dir/README.md`,
					contents: ['This is not a skill'],
				},
				{
					path: '/home/user/.claude/skills/personal-skill-1/SKILL.md',
					contents: [
						'---',
						'name: "Personal Skill 1"',
						'description: "A personal skill for testing"',
						'---',
						'This is personal skill 1 content',
					],
				},
				{
					path: '/home/user/.claude/skills/not-a-skill/other-file.md',
					contents: ['Not a skill file'],
				},
			]);

			const result = await service.findAgentSkills(CancellationToken.None);

			assert.ok(result, 'Should return results when agent skills are enabled');
			assert.strictEqual(result.length, 3, 'Should find 3 skills total');

			// Check project skills (both from .github/skills and .claude/skills)
			const projectSkills = result.filter(skill => skill.type === 'project');
			assert.strictEqual(projectSkills.length, 2, 'Should find 2 project skills');

			const githubSkill1 = projectSkills.find(skill => skill.name === 'GitHub Skill 1');
			assert.ok(githubSkill1, 'Should find GitHub skill 1');
			assert.strictEqual(githubSkill1.description, 'A GitHub skill for testing');
			assert.strictEqual(githubSkill1.uri.path, `${rootFolder}/.github/skills/github-skill-1/SKILL.md`);

			const claudeSkill1 = projectSkills.find(skill => skill.name === 'Claude Skill 1');
			assert.ok(claudeSkill1, 'Should find Claude skill 1');
			assert.strictEqual(claudeSkill1.description, 'A Claude skill for testing');
			assert.strictEqual(claudeSkill1.uri.path, `${rootFolder}/.claude/skills/claude-skill-1/SKILL.md`);

			// Check personal skills
			const personalSkills = result.filter(skill => skill.type === 'personal');
			assert.strictEqual(personalSkills.length, 1, 'Should find 1 personal skill');

			const personalSkill1 = personalSkills[0];
			assert.strictEqual(personalSkill1.name, 'Personal Skill 1');
			assert.strictEqual(personalSkill1.description, 'A personal skill for testing');
			assert.strictEqual(personalSkill1.uri.path, '/home/user/.claude/skills/personal-skill-1/SKILL.md');
		});

		test('should handle parsing errors gracefully', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, true);

			const rootFolderName = 'skills-error-test';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			// Create mock filesystem with malformed skill file in .github/skills
			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/skills/valid-skill/SKILL.md`,
					contents: [
						'---',
						'name: "Valid Skill"',
						'description: "A valid skill"',
						'---',
						'Valid skill content',
					],
				},
				{
					path: `${rootFolder}/.claude/skills/invalid-skill/SKILL.md`,
					contents: [
						'---',
						'invalid yaml: [unclosed',
						'---',
						'Invalid skill content',
					],
				},
			]);

			const result = await service.findAgentSkills(CancellationToken.None);

			// Should still return the valid skill, even if one has parsing errors
			assert.ok(result, 'Should return results even with parsing errors');
			assert.strictEqual(result.length, 1, 'Should find 1 valid skill');
			assert.strictEqual(result[0].name, 'Valid Skill');
			assert.strictEqual(result[0].type, 'project');
		});

		test('should return empty array when no skills found', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, true);

			const rootFolderName = 'empty-workspace';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			// Create empty mock filesystem
			await mockFiles(fileService, []);

			const result = await service.findAgentSkills(CancellationToken.None);

			assert.ok(result, 'Should return results array');
			assert.strictEqual(result.length, 0, 'Should find no skills');
		});

		test('should truncate long names and descriptions', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, true);

			const rootFolderName = 'truncation-test';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			const longName = 'A'.repeat(100); // Exceeds 64 characters
			const longDescription = 'B'.repeat(1500); // Exceeds 1024 characters

			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/skills/long-skill/SKILL.md`,
					contents: [
						'---',
						`name: "${longName}"`,
						`description: "${longDescription}"`,
						'---',
						'Skill content',
					],
				},
			]);

			const result = await service.findAgentSkills(CancellationToken.None);

			assert.ok(result, 'Should return results');
			assert.strictEqual(result.length, 1, 'Should find 1 skill');
			assert.strictEqual(result[0].name.length, 64, 'Name should be truncated to 64 characters');
			assert.strictEqual(result[0].description?.length, 1024, 'Description should be truncated to 1024 characters');
		});

		test('should remove XML tags from name and description', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, true);

			const rootFolderName = 'xml-test';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/skills/xml-skill/SKILL.md`,
					contents: [
						'---',
						'name: "Skill <b>with</b> <em>XML</em> tags"',
						'description: "Description with <strong>HTML</strong> and <span>other</span> tags"',
						'---',
						'Skill content',
					],
				},
			]);

			const result = await service.findAgentSkills(CancellationToken.None);

			assert.ok(result, 'Should return results');
			assert.strictEqual(result.length, 1, 'Should find 1 skill');
			assert.strictEqual(result[0].name, 'Skill with XML tags', 'XML tags should be removed from name');
			assert.strictEqual(result[0].description, 'Description with HTML and other tags', 'XML tags should be removed from description');
		});

		test('should handle both truncation and XML removal', async () => {
			testConfigService.setUserConfiguration(PromptsConfig.USE_AGENT_SKILLS, true);

			const rootFolderName = 'combined-test';
			const rootFolder = `/${rootFolderName}`;
			const rootFolderUri = URI.file(rootFolder);

			workspaceContextService.setWorkspace(testWorkspace(rootFolderUri));

			const longNameWithXml = '<p>' + 'A'.repeat(100) + '</p>'; // Exceeds 64 chars and has XML
			const longDescWithXml = '<div>' + 'B'.repeat(1500) + '</div>'; // Exceeds 1024 chars and has XML

			await mockFiles(fileService, [
				{
					path: `${rootFolder}/.github/skills/combined-skill/SKILL.md`,
					contents: [
						'---',
						`name: "${longNameWithXml}"`,
						`description: "${longDescWithXml}"`,
						'---',
						'Skill content',
					],
				},
			]);

			const result = await service.findAgentSkills(CancellationToken.None);

			assert.ok(result, 'Should return results');
			assert.strictEqual(result.length, 1, 'Should find 1 skill');
			// XML tags are removed first, then truncation happens
			assert.ok(!result[0].name.includes('<'), 'Name should not contain XML tags');
			assert.ok(!result[0].name.includes('>'), 'Name should not contain XML tags');
			assert.strictEqual(result[0].name.length, 64, 'Name should be truncated to 64 characters');
			assert.ok(!result[0].description?.includes('<'), 'Description should not contain XML tags');
			assert.ok(!result[0].description?.includes('>'), 'Description should not contain XML tags');
			assert.strictEqual(result[0].description?.length, 1024, 'Description should be truncated to 1024 characters');
		});
	});
});
```

--------------------------------------------------------------------------------

````
