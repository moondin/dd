---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 263
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 263 of 552)

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

---[FILE: src/vs/platform/clipboard/browser/clipboardService.ts]---
Location: vscode-main/src/vs/platform/clipboard/browser/clipboardService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isSafari, isWebkitWebView } from '../../../base/browser/browser.js';
import { $, addDisposableListener, getActiveDocument, getActiveWindow, isHTMLElement, onDidRegisterWindow } from '../../../base/browser/dom.js';
import { mainWindow } from '../../../base/browser/window.js';
import { DeferredPromise } from '../../../base/common/async.js';
import { Event } from '../../../base/common/event.js';
import { hash } from '../../../base/common/hash.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IClipboardService } from '../common/clipboardService.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
import { ILogService } from '../../log/common/log.js';

/**
 * Custom mime type used for storing a list of uris in the clipboard.
 *
 * Requires support for custom web clipboards https://github.com/w3c/clipboard-apis/pull/175
 */
const vscodeResourcesMime = 'application/vnd.code.resources';

export class BrowserClipboardService extends Disposable implements IClipboardService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@ILayoutService private readonly layoutService: ILayoutService,
		@ILogService protected readonly logService: ILogService
	) {
		super();

		if (isSafari || isWebkitWebView) {
			this.installWebKitWriteTextWorkaround();
		}

		// Keep track of copy operations to reset our set of
		// copied resources: since we keep resources in memory
		// and not in the clipboard, we have to invalidate
		// that state when the user copies other data.
		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			disposables.add(addDisposableListener(window.document, 'copy', () => this.clearResourcesState()));
		}, { window: mainWindow, disposables: this._store }));
	}

	triggerPaste(): Promise<void> | undefined {
		this.logService.trace('BrowserClipboardService#triggerPaste');
		return undefined;
	}

	async readImage(): Promise<Uint8Array> {
		try {
			const clipboardItems = await navigator.clipboard.read();
			const clipboardItem = clipboardItems[0];

			const supportedImageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/tiff', 'image/bmp'];
			const mimeType = supportedImageTypes.find(type => clipboardItem.types.includes(type));

			if (mimeType) {
				const blob = await clipboardItem.getType(mimeType);
				const buffer = await blob.arrayBuffer();
				return new Uint8Array(buffer);
			} else {
				console.error('No supported image type found in the clipboard');
			}
		} catch (error) {
			console.error('Error reading image from clipboard:', error);
		}

		// Return an empty Uint8Array if no image is found or an error occurs
		return new Uint8Array(0);
	}

	private webKitPendingClipboardWritePromise: DeferredPromise<string> | undefined;

	// In Safari, it has the following note:
	//
	// "The request to write to the clipboard must be triggered during a user gesture.
	// A call to clipboard.write or clipboard.writeText outside the scope of a user
	// gesture(such as "click" or "touch" event handlers) will result in the immediate
	// rejection of the promise returned by the API call."
	// From: https://webkit.org/blog/10855/async-clipboard-api/
	//
	// Since extensions run in a web worker, and handle gestures in an asynchronous way,
	// they are not classified by Safari as "in response to a user gesture" and will reject.
	//
	// This function sets up some handlers to work around that behavior.
	private installWebKitWriteTextWorkaround(): void {
		const handler = () => {
			const currentWritePromise = new DeferredPromise<string>();

			// Cancel the previous promise since we just created a new one in response to this new event
			if (this.webKitPendingClipboardWritePromise && !this.webKitPendingClipboardWritePromise.isSettled) {
				this.webKitPendingClipboardWritePromise.cancel();
			}
			this.webKitPendingClipboardWritePromise = currentWritePromise;

			// The ctor of ClipboardItem allows you to pass in a promise that will resolve to a string.
			// This allows us to pass in a Promise that will either be cancelled by another event or
			// resolved with the contents of the first call to this.writeText.
			// see https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/ClipboardItem#parameters
			getActiveWindow().navigator.clipboard.write([new ClipboardItem({
				'text/plain': currentWritePromise.p,
			})]).catch(async err => {
				if (!(err instanceof Error) || err.name !== 'NotAllowedError' || !currentWritePromise.isRejected) {
					this.logService.error(err);
				}
			});
		};


		this._register(Event.runAndSubscribe(this.layoutService.onDidAddContainer, ({ container, disposables }) => {
			disposables.add(addDisposableListener(container, 'click', handler));
			disposables.add(addDisposableListener(container, 'keydown', handler));
		}, { container: this.layoutService.mainContainer, disposables: this._store }));
	}

	private readonly mapTextToType = new Map<string, string>(); // unsupported in web (only in-memory)

	async writeText(text: string, type?: string): Promise<void> {
		this.logService.trace('BrowserClipboardService#writeText called with type:', type, ' text.length:', text.length);
		// Clear resources given we are writing text
		this.clearResourcesState();

		// With type: only in-memory is supported
		if (type) {
			this.mapTextToType.set(type, text);
			this.logService.trace('BrowserClipboardService#writeText');
			return;
		}

		if (this.webKitPendingClipboardWritePromise) {
			// For Safari, we complete this Promise which allows the call to `navigator.clipboard.write()`
			// above to resolve and successfully copy to the clipboard. If we let this continue, Safari
			// would throw an error because this call stack doesn't appear to originate from a user gesture.
			return this.webKitPendingClipboardWritePromise.complete(text);
		}

		// Guard access to navigator.clipboard with try/catch
		// as we have seen DOMExceptions in certain browsers
		// due to security policies.
		try {
			this.logService.trace('before navigator.clipboard.writeText');
			return await getActiveWindow().navigator.clipboard.writeText(text);
		} catch (error) {
			console.error(error);
		}

		// Fallback to textarea and execCommand solution
		this.fallbackWriteText(text);
	}

	private fallbackWriteText(text: string): void {
		this.logService.trace('BrowserClipboardService#fallbackWriteText');
		const activeDocument = getActiveDocument();
		const activeElement = activeDocument.activeElement;

		const textArea: HTMLTextAreaElement = activeDocument.body.appendChild($('textarea', { 'aria-hidden': true }));
		textArea.style.height = '1px';
		textArea.style.width = '1px';
		textArea.style.position = 'absolute';

		textArea.value = text;
		textArea.focus();
		textArea.select();

		activeDocument.execCommand('copy');

		if (isHTMLElement(activeElement)) {
			activeElement.focus();
		}

		textArea.remove();
	}

	async readText(type?: string): Promise<string> {
		this.logService.trace('BrowserClipboardService#readText called with type:', type);
		// With type: only in-memory is supported
		if (type) {
			const readText = this.mapTextToType.get(type) || '';
			this.logService.trace('BrowserClipboardService#readText text.length:', readText.length);
			return readText;
		}

		// Guard access to navigator.clipboard with try/catch
		// as we have seen DOMExceptions in certain browsers
		// due to security policies.
		try {
			const readText = await getActiveWindow().navigator.clipboard.readText();
			this.logService.trace('BrowserClipboardService#readText text.length:', readText.length);
			return readText;
		} catch (error) {
			console.error(error);
		}

		return '';
	}

	private findText = ''; // unsupported in web (only in-memory)

	async readFindText(): Promise<string> {
		return this.findText;
	}

	async writeFindText(text: string): Promise<void> {
		this.findText = text;
	}

	private resources: URI[] = []; // unsupported in web (only in-memory)
	private resourcesStateHash: number | undefined = undefined;

	private static readonly MAX_RESOURCE_STATE_SOURCE_LENGTH = 1000;

	async writeResources(resources: URI[]): Promise<void> {
		// Guard access to navigator.clipboard with try/catch
		// as we have seen DOMExceptions in certain browsers
		// due to security policies.
		try {
			await getActiveWindow().navigator.clipboard.write([
				new ClipboardItem({
					[`web ${vscodeResourcesMime}`]: new Blob([
						JSON.stringify(resources.map(x => x.toJSON()))
					], {
						type: vscodeResourcesMime
					})
				})
			]);

			// Continue to write to the in-memory clipboard as well.
			// This is needed because some browsers allow the paste but then can't read the custom resources.
		} catch (error) {
			// Noop
		}

		if (resources.length === 0) {
			this.clearResourcesState();
		} else {
			this.resources = resources;
			this.resourcesStateHash = await this.computeResourcesStateHash();
		}
	}

	async readResources(): Promise<URI[]> {
		// Guard access to navigator.clipboard with try/catch
		// as we have seen DOMExceptions in certain browsers
		// due to security policies.
		try {
			const items = await getActiveWindow().navigator.clipboard.read();
			for (const item of items) {
				if (item.types.includes(`web ${vscodeResourcesMime}`)) {
					const blob = await item.getType(`web ${vscodeResourcesMime}`);
					const resources = (JSON.parse(await blob.text()) as URI[]).map(x => URI.from(x));
					return resources;
				}
			}
		} catch (error) {
			// Noop
		}

		const resourcesStateHash = await this.computeResourcesStateHash();
		if (this.resourcesStateHash !== resourcesStateHash) {
			this.clearResourcesState(); // state mismatch, resources no longer valid
		}

		return this.resources;
	}

	private async computeResourcesStateHash(): Promise<number | undefined> {
		if (this.resources.length === 0) {
			return undefined; // no resources, no hash needed
		}

		// Resources clipboard is managed in-memory only and thus
		// fails to invalidate when clipboard data is changing.
		// As such, we compute the hash of the current clipboard
		// and use that to later validate the resources clipboard.

		const clipboardText = await this.readText();
		return hash(clipboardText.substring(0, BrowserClipboardService.MAX_RESOURCE_STATE_SOURCE_LENGTH));
	}

	async hasResources(): Promise<boolean> {
		// Guard access to navigator.clipboard with try/catch
		// as we have seen DOMExceptions in certain browsers
		// due to security policies.
		try {
			const items = await getActiveWindow().navigator.clipboard.read();
			for (const item of items) {
				if (item.types.includes(`web ${vscodeResourcesMime}`)) {
					return true;
				}
			}
		} catch (error) {
			// Noop
		}

		return this.resources.length > 0;
	}

	public clearInternalState(): void {
		this.clearResourcesState();
	}

	private clearResourcesState(): void {
		this.resources = [];
		this.resourcesStateHash = undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/clipboard/common/clipboardService.ts]---
Location: vscode-main/src/vs/platform/clipboard/common/clipboardService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IClipboardService = createDecorator<IClipboardService>('clipboardService');

export interface IClipboardService {

	readonly _serviceBrand: undefined;

	/**
	 * Trigger the paste. Returns undefined if the paste was not triggered or a promise that resolves on paste end.
	 */
	triggerPaste(targetWindowId: number): Promise<void> | undefined;

	/**
	 * Writes text to the system clipboard.
	 */
	writeText(text: string, type?: string): Promise<void>;

	/**
	 * Reads the content of the clipboard in plain text
	 */
	readText(type?: string): Promise<string>;

	/**
	 * Reads text from the system find pasteboard.
	 */
	readFindText(): Promise<string>;

	/**
	 * Writes text to the system find pasteboard.
	 */
	writeFindText(text: string): Promise<void>;

	/**
	 * Writes resources to the system clipboard.
	 */
	writeResources(resources: URI[]): Promise<void>;

	/**
	 * Reads resources from the system clipboard.
	 */
	readResources(): Promise<URI[]>;

	/**
	 * Find out if resources are copied to the clipboard.
	 */
	hasResources(): Promise<boolean>;

	/**
	 * Resets the internal state of the clipboard (if any) without touching the real clipboard.
	 *
	 * Used for implementations such as web which do not always support using the real clipboard.
	 */
	clearInternalState?(): void;

	/**
	 * Reads resources from the system clipboard as an image. If the clipboard does not contain an
	 * image, an empty buffer is returned.
	 */
	readImage(): Promise<Uint8Array>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/clipboard/test/common/testClipboardService.ts]---
Location: vscode-main/src/vs/platform/clipboard/test/common/testClipboardService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IClipboardService } from '../../common/clipboardService.js';

export class TestClipboardService implements IClipboardService {
	readImage(): Promise<Uint8Array> {
		throw new Error('Method not implemented.');
	}

	_serviceBrand: undefined;

	private text: string | undefined = undefined;

	triggerPaste(): Promise<void> | undefined {
		return Promise.resolve();
	}

	async writeText(text: string, type?: string): Promise<void> {
		this.text = text;
	}

	async readText(type?: string): Promise<string> {
		return this.text ?? '';
	}

	private findText: string | undefined = undefined;

	async readFindText(): Promise<string> {
		return this.findText ?? '';
	}

	async writeFindText(text: string): Promise<void> {
		this.findText = text;
	}

	private resources: URI[] | undefined = undefined;

	async writeResources(resources: URI[]): Promise<void> {
		this.resources = resources;
	}

	async readResources(): Promise<URI[]> {
		return this.resources ?? [];
	}

	async hasResources(): Promise<boolean> {
		return Array.isArray(this.resources) && this.resources.length > 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/commands/common/commands.ts]---
Location: vscode-main/src/vs/platform/commands/common/commands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import { IDisposable, markAsSingleton, toDisposable } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';
import { TypeConstraint, validateConstraints } from '../../../base/common/types.js';
import { ILocalizedString } from '../../action/common/action.js';
import { createDecorator, ServicesAccessor } from '../../instantiation/common/instantiation.js';

export const ICommandService = createDecorator<ICommandService>('commandService');

export interface ICommandEvent {
	readonly commandId: string;
	readonly args: unknown[];
}

export interface ICommandService {
	readonly _serviceBrand: undefined;
	readonly onWillExecuteCommand: Event<ICommandEvent>;
	readonly onDidExecuteCommand: Event<ICommandEvent>;
	executeCommand<R = unknown>(commandId: string, ...args: unknown[]): Promise<R | undefined>;
}

export type ICommandsMap = Map<string, ICommand>;

export type ICommandHandler<Args extends unknown[] = unknown[], R = void> = (accessor: ServicesAccessor, ...args: Args) => R;

export interface ICommand<Args extends unknown[] = unknown[], R = void> {
	id: string;
	handler: ICommandHandler<Args, R>;
	metadata?: ICommandMetadata | null;
}

export interface ICommandMetadata {
	/**
	 * NOTE: Please use an ILocalizedString. string is in the type for backcompat for now.
	 * A short summary of what the command does. This will be used in:
	 * - API commands
	 * - when showing keybindings that have no other UX
	 * - when searching for commands in the Command Palette
	 */
	readonly description: ILocalizedString | string;
	readonly args?: ReadonlyArray<{
		readonly name: string;
		readonly isOptional?: boolean;
		readonly description?: string;
		readonly constraint?: TypeConstraint;
		readonly schema?: IJSONSchema;
	}>;
	readonly returns?: string;
}

export interface ICommandRegistry {
	readonly onDidRegisterCommand: Event<string>;
	registerCommand<Args extends unknown[]>(id: string, command: ICommandHandler<Args>): IDisposable;
	registerCommand<Args extends unknown[]>(command: ICommand<Args>): IDisposable;
	registerCommandAlias(oldId: string, newId: string): IDisposable;
	getCommand(id: string): ICommand | undefined;
	getCommands(): ICommandsMap;
}

export const CommandsRegistry: ICommandRegistry = new class implements ICommandRegistry {

	private readonly _commands = new Map<string, LinkedList<ICommand>>();

	private readonly _onDidRegisterCommand = new Emitter<string>();
	readonly onDidRegisterCommand: Event<string> = this._onDidRegisterCommand.event;

	registerCommand(idOrCommand: string | ICommand, handler?: ICommandHandler): IDisposable {

		if (!idOrCommand) {
			throw new Error(`invalid command`);
		}

		if (typeof idOrCommand === 'string') {
			if (!handler) {
				throw new Error(`invalid command`);
			}
			return this.registerCommand({ id: idOrCommand, handler });
		}

		// add argument validation if rich command metadata is provided
		if (idOrCommand.metadata && Array.isArray(idOrCommand.metadata.args)) {
			const constraints: Array<TypeConstraint | undefined> = [];
			for (const arg of idOrCommand.metadata.args) {
				constraints.push(arg.constraint);
			}
			const actualHandler = idOrCommand.handler;
			idOrCommand.handler = function (accessor, ...args: unknown[]) {
				validateConstraints(args, constraints);
				return actualHandler(accessor, ...args);
			};
		}

		// find a place to store the command
		const { id } = idOrCommand;

		let commands = this._commands.get(id);
		if (!commands) {
			commands = new LinkedList<ICommand>();
			this._commands.set(id, commands);
		}

		const removeFn = commands.unshift(idOrCommand);

		const ret = toDisposable(() => {
			removeFn();
			const command = this._commands.get(id);
			if (command?.isEmpty()) {
				this._commands.delete(id);
			}
		});

		// tell the world about this command
		this._onDidRegisterCommand.fire(id);

		return markAsSingleton(ret);
	}

	registerCommandAlias(oldId: string, newId: string): IDisposable {
		return CommandsRegistry.registerCommand(oldId, (accessor, ...args) => accessor.get(ICommandService).executeCommand(newId, ...args));
	}

	getCommand(id: string): ICommand | undefined {
		const list = this._commands.get(id);
		if (!list || list.isEmpty()) {
			return undefined;
		}
		return Iterable.first(list);
	}

	getCommands(): ICommandsMap {
		const result = new Map<string, ICommand>();
		for (const key of this._commands.keys()) {
			const command = this.getCommand(key);
			if (command) {
				result.set(key, command);
			}
		}
		return result;
	}
};

CommandsRegistry.registerCommand('noop', () => { });
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/commands/test/common/commands.test.ts]---
Location: vscode-main/src/vs/platform/commands/test/common/commands.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { combinedDisposable } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { CommandsRegistry } from '../../common/commands.js';

suite('Command Tests', function () {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('register command - no handler', function () {
		assert.throws(() => CommandsRegistry.registerCommand('foo', null!));
	});

	test('register/dispose', () => {
		const command = function () { };
		const reg = CommandsRegistry.registerCommand('foo', command);
		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command);
		reg.dispose();
		assert.ok(CommandsRegistry.getCommand('foo') === undefined);
	});

	test('register/register/dispose', () => {
		const command1 = function () { };
		const command2 = function () { };

		// dispose overriding command
		let reg1 = CommandsRegistry.registerCommand('foo', command1);
		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command1);

		let reg2 = CommandsRegistry.registerCommand('foo', command2);
		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command2);
		reg2.dispose();

		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command1);
		reg1.dispose();
		assert.ok(CommandsRegistry.getCommand('foo') === undefined);

		// dispose override command first
		reg1 = CommandsRegistry.registerCommand('foo', command1);
		reg2 = CommandsRegistry.registerCommand('foo', command2);
		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command2);

		reg1.dispose();
		assert.ok(CommandsRegistry.getCommand('foo')!.handler === command2);

		reg2.dispose();
		assert.ok(CommandsRegistry.getCommand('foo') === undefined);
	});

	test('command with description', function () {

		const r1 = CommandsRegistry.registerCommand('test', function (accessor, args) {
			assert.ok(typeof args === 'string');
		});

		const r2 = CommandsRegistry.registerCommand('test2', function (accessor, args) {
			assert.ok(typeof args === 'string');
		});

		const r3 = CommandsRegistry.registerCommand({
			id: 'test3',
			handler: function (accessor, args) {
				return true;
			},
			metadata: {
				description: 'a command',
				args: [{ name: 'value', constraint: Number }]
			}
		});

		CommandsRegistry.getCommands().get('test')!.handler.apply(undefined, [undefined!, 'string']);
		CommandsRegistry.getCommands().get('test2')!.handler.apply(undefined, [undefined!, 'string']);
		assert.throws(() => CommandsRegistry.getCommands().get('test3')!.handler.apply(undefined, [undefined!, 'string']));
		assert.strictEqual(CommandsRegistry.getCommands().get('test3')!.handler.apply(undefined, [undefined!, 1]), true);

		combinedDisposable(r1, r2, r3).dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/commands/test/common/nullCommandService.ts]---
Location: vscode-main/src/vs/platform/commands/test/common/nullCommandService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ICommandService } from '../../common/commands.js';

export const NullCommandService: ICommandService = {
	_serviceBrand: undefined,
	onWillExecuteCommand: () => Disposable.None,
	onDidExecuteCommand: () => Disposable.None,
	executeCommand() {
		return Promise.resolve(undefined);
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/common/configuration.ts]---
Location: vscode-main/src/vs/platform/configuration/common/configuration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../base/common/assert.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Event } from '../../../base/common/event.js';
import * as types from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IWorkspaceFolder } from '../../workspace/common/workspace.js';

export const IConfigurationService = createDecorator<IConfigurationService>('configurationService');

export function isConfigurationOverrides(obj: unknown): obj is IConfigurationOverrides {
	const thing = obj as IConfigurationOverrides;
	return thing
		&& typeof thing === 'object'
		&& (!thing.overrideIdentifier || typeof thing.overrideIdentifier === 'string')
		&& (!thing.resource || thing.resource instanceof URI);
}

export interface IConfigurationOverrides {
	overrideIdentifier?: string | null;
	resource?: URI | null;
}

export function isConfigurationUpdateOverrides(obj: unknown): obj is IConfigurationUpdateOverrides {
	const thing = obj as IConfigurationUpdateOverrides | IConfigurationOverrides;
	return thing
		&& typeof thing === 'object'
		&& (!(thing as IConfigurationUpdateOverrides).overrideIdentifiers || Array.isArray((thing as IConfigurationUpdateOverrides).overrideIdentifiers))
		&& !(thing as IConfigurationOverrides).overrideIdentifier
		&& (!thing.resource || thing.resource instanceof URI);
}

export type IConfigurationUpdateOverrides = Omit<IConfigurationOverrides, 'overrideIdentifier'> & { overrideIdentifiers?: string[] | null };

export const enum ConfigurationTarget {
	APPLICATION = 1,
	USER,
	USER_LOCAL,
	USER_REMOTE,
	WORKSPACE,
	WORKSPACE_FOLDER,
	DEFAULT,
	MEMORY
}
export function ConfigurationTargetToString(configurationTarget: ConfigurationTarget) {
	switch (configurationTarget) {
		case ConfigurationTarget.APPLICATION: return 'APPLICATION';
		case ConfigurationTarget.USER: return 'USER';
		case ConfigurationTarget.USER_LOCAL: return 'USER_LOCAL';
		case ConfigurationTarget.USER_REMOTE: return 'USER_REMOTE';
		case ConfigurationTarget.WORKSPACE: return 'WORKSPACE';
		case ConfigurationTarget.WORKSPACE_FOLDER: return 'WORKSPACE_FOLDER';
		case ConfigurationTarget.DEFAULT: return 'DEFAULT';
		case ConfigurationTarget.MEMORY: return 'MEMORY';
	}
}

export interface IConfigurationChange {
	keys: string[];
	overrides: [string, string[]][];
}

export interface IConfigurationChangeEvent {

	readonly source: ConfigurationTarget;
	readonly affectedKeys: ReadonlySet<string>;
	readonly change: IConfigurationChange;

	affectsConfiguration(configuration: string, overrides?: IConfigurationOverrides): boolean;
}

export interface IInspectValue<T> {
	readonly value?: T;
	readonly override?: T;
	readonly overrides?: { readonly identifiers: string[]; readonly value: T }[];
}

export interface IConfigurationValue<T> {

	readonly defaultValue?: T;
	readonly applicationValue?: T;
	readonly userValue?: T;
	readonly userLocalValue?: T;
	readonly userRemoteValue?: T;
	readonly workspaceValue?: T;
	readonly workspaceFolderValue?: T;
	readonly memoryValue?: T;
	readonly policyValue?: T;
	readonly value?: T;

	readonly default?: IInspectValue<T>;
	readonly application?: IInspectValue<T>;
	readonly user?: IInspectValue<T>;
	readonly userLocal?: IInspectValue<T>;
	readonly userRemote?: IInspectValue<T>;
	readonly workspace?: IInspectValue<T>;
	readonly workspaceFolder?: IInspectValue<T>;
	readonly memory?: IInspectValue<T>;
	readonly policy?: { value?: T };

	readonly overrideIdentifiers?: string[];
}

export function getConfigValueInTarget<T>(configValue: IConfigurationValue<T>, scope: ConfigurationTarget): T | undefined {
	switch (scope) {
		case ConfigurationTarget.APPLICATION:
			return configValue.applicationValue;
		case ConfigurationTarget.USER:
			return configValue.userValue;
		case ConfigurationTarget.USER_LOCAL:
			return configValue.userLocalValue;
		case ConfigurationTarget.USER_REMOTE:
			return configValue.userRemoteValue;
		case ConfigurationTarget.WORKSPACE:
			return configValue.workspaceValue;
		case ConfigurationTarget.WORKSPACE_FOLDER:
			return configValue.workspaceFolderValue;
		case ConfigurationTarget.DEFAULT:
			return configValue.defaultValue;
		case ConfigurationTarget.MEMORY:
			return configValue.memoryValue;
		default:
			assertNever(scope);
	}
}

export function isConfigured<T>(configValue: IConfigurationValue<T>): configValue is IConfigurationValue<T> & { value: T } {
	return configValue.applicationValue !== undefined ||
		configValue.userValue !== undefined ||
		configValue.userLocalValue !== undefined ||
		configValue.userRemoteValue !== undefined ||
		configValue.workspaceValue !== undefined ||
		configValue.workspaceFolderValue !== undefined;
}

export interface IConfigurationUpdateOptions {
	/**
	 * If `true`, do not notifies the error to user by showing the message box. Default is `false`.
	 */
	donotNotifyError?: boolean;
	/**
	 * How to handle dirty file when updating the configuration.
	 */
	handleDirtyFile?: 'save' | 'revert';
}

export interface IConfigurationService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeConfiguration: Event<IConfigurationChangeEvent>;

	getConfigurationData(): IConfigurationData | null;

	/**
	 * Fetches the value of the section for the given overrides.
	 * Value can be of native type or an object keyed off the section name.
	 *
	 * @param section - Section of the configuration. Can be `null` or `undefined`.
	 * @param overrides - Overrides that has to be applied while fetching
	 *
	 */
	getValue<T>(): T;
	getValue<T>(section: string): T;
	getValue<T>(overrides: IConfigurationOverrides): T;
	getValue<T>(section: string, overrides: IConfigurationOverrides): T;

	/**
	 * Update a configuration value.
	 *
	 * Use `target` to update the configuration in a specific `ConfigurationTarget`.
	 *
	 * Use `overrides` to update the configuration for a resource or for override identifiers or both.
	 *
	 * Passing a resource through overrides will update the configuration in the workspace folder containing that resource.
	 *
	 * *Note 1:* Updating configuration to a default value will remove the configuration from the requested target. If not target is passed, it will be removed from all writeable targets.
	 *
	 * *Note 2:* Use `undefined` value to remove the configuration from the given target. If not target is passed, it will be removed from all writeable targets.
	 *
	 * Use `donotNotifyError` and set it to `true` to surpresss errors.
	 *
	 * @param key setting to be updated
	 * @param value The new value
	 */
	updateValue(key: string, value: unknown): Promise<void>;
	updateValue(key: string, value: unknown, target: ConfigurationTarget): Promise<void>;
	updateValue(key: string, value: unknown, overrides: IConfigurationOverrides | IConfigurationUpdateOverrides): Promise<void>;
	updateValue(key: string, value: unknown, overrides: IConfigurationOverrides | IConfigurationUpdateOverrides, target: ConfigurationTarget, options?: IConfigurationUpdateOptions): Promise<void>;

	inspect<T>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<Readonly<T>>;

	reloadConfiguration(target?: ConfigurationTarget | IWorkspaceFolder): Promise<void>;

	keys(): {
		default: string[];
		policy: string[];
		user: string[];
		workspace: string[];
		workspaceFolder: string[];
		memory?: string[];
	};
}

export interface IConfigurationModel {
	contents: IStringDictionary<unknown>;
	keys: string[];
	overrides: IOverrides[];
	raw?: ReadonlyArray<IStringDictionary<unknown>> | IStringDictionary<unknown>;
}

export interface IOverrides {
	keys: string[];
	contents: IStringDictionary<unknown>;
	identifiers: string[];
}

export interface IConfigurationData {
	defaults: IConfigurationModel;
	policy: IConfigurationModel;
	application: IConfigurationModel;
	userLocal: IConfigurationModel;
	userRemote: IConfigurationModel;
	workspace: IConfigurationModel;
	folders: [UriComponents, IConfigurationModel][];
}

export interface IConfigurationCompareResult {
	added: string[];
	removed: string[];
	updated: string[];
	overrides: [string, string[]][];
}

export function toValuesTree(properties: IStringDictionary<unknown>, conflictReporter: (message: string) => void): IStringDictionary<unknown> {
	const root = Object.create(null);

	for (const key in properties) {
		addToValueTree(root, key, properties[key], conflictReporter);
	}

	return root;
}

export function addToValueTree(settingsTreeRoot: IStringDictionary<unknown>, key: string, value: unknown, conflictReporter: (message: string) => void): void {
	const segments = key.split('.');
	const last = segments.pop()!;

	let curr: IStringDictionary<unknown> = settingsTreeRoot;
	for (let i = 0; i < segments.length; i++) {
		const s = segments[i];
		let obj = curr[s];
		switch (typeof obj) {
			case 'undefined':
				obj = curr[s] = Object.create(null);
				break;
			case 'object':
				if (obj === null) {
					conflictReporter(`Ignoring ${key} as ${segments.slice(0, i + 1).join('.')} is null`);
					return;
				}
				break;
			default:
				conflictReporter(`Ignoring ${key} as ${segments.slice(0, i + 1).join('.')} is ${JSON.stringify(obj)}`);
				return;
		}
		curr = obj as IStringDictionary<unknown>;
	}

	if (typeof curr === 'object' && curr !== null) {
		try {
			(curr as IStringDictionary<unknown>)[last] = value; // workaround https://github.com/microsoft/vscode/issues/13606
		} catch (e) {
			conflictReporter(`Ignoring ${key} as ${segments.join('.')} is ${JSON.stringify(curr)}`);
		}
	} else {
		conflictReporter(`Ignoring ${key} as ${segments.join('.')} is ${JSON.stringify(curr)}`);
	}
}

export function removeFromValueTree(valueTree: IStringDictionary<unknown>, key: string): void {
	const segments = key.split('.');
	doRemoveFromValueTree(valueTree, segments);
}

function doRemoveFromValueTree(valueTree: IStringDictionary<unknown> | unknown, segments: string[]): void {
	if (!valueTree) {
		return;
	}

	const valueTreeRecord = valueTree as IStringDictionary<unknown>;
	const first = segments.shift()!;
	if (segments.length === 0) {
		// Reached last segment
		delete valueTreeRecord[first];
		return;
	}

	if (Object.keys(valueTreeRecord).indexOf(first) !== -1) {
		const value = valueTreeRecord[first];
		if (typeof value === 'object' && !Array.isArray(value)) {
			doRemoveFromValueTree(value, segments);
			if (Object.keys(value as object).length === 0) {
				delete valueTreeRecord[first];
			}
		}
	}
}

/**
 * A helper function to get the configuration value with a specific settings path (e.g. config.some.setting)
 */
export function getConfigurationValue<T>(config: IStringDictionary<unknown>, settingPath: string): T | undefined;
export function getConfigurationValue<T>(config: IStringDictionary<unknown>, settingPath: string, defaultValue: T): T;
export function getConfigurationValue<T>(config: IStringDictionary<unknown>, settingPath: string, defaultValue?: T): T | undefined {
	function accessSetting(config: IStringDictionary<unknown>, path: string[]): unknown {
		let current: unknown = config;
		for (const component of path) {
			if (typeof current !== 'object' || current === null) {
				return undefined;
			}
			current = (current as IStringDictionary<unknown>)[component];
		}
		return current as T;
	}

	const path = settingPath.split('.');
	const result = accessSetting(config, path);

	return typeof result === 'undefined' ? defaultValue : result as T;
}

export function merge(base: IStringDictionary<unknown>, add: IStringDictionary<unknown>, overwrite: boolean): void {
	Object.keys(add).forEach(key => {
		if (key !== '__proto__') {
			if (key in base) {
				if (types.isObject(base[key]) && types.isObject(add[key])) {
					merge(base[key] as IStringDictionary<unknown>, add[key] as IStringDictionary<unknown>, overwrite);
				} else if (overwrite) {
					base[key] = add[key];
				}
			} else {
				base[key] = add[key];
			}
		}
	});
}

export function getLanguageTagSettingPlainKey(settingKey: string) {
	return settingKey
		.replace(/^\[/, '')
		.replace(/]$/g, '')
		.replace(/\]\[/g, ', ');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/common/configurationModels.ts]---
Location: vscode-main/src/vs/platform/configuration/common/configurationModels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as arrays from '../../../base/common/arrays.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Emitter, Event } from '../../../base/common/event.js';
import * as json from '../../../base/common/json.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { getOrSet, ResourceMap } from '../../../base/common/map.js';
import * as objects from '../../../base/common/objects.js';
import { IExtUri } from '../../../base/common/resources.js';
import * as types from '../../../base/common/types.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { addToValueTree, ConfigurationTarget, getConfigurationValue, IConfigurationChange, IConfigurationChangeEvent, IConfigurationCompareResult, IConfigurationData, IConfigurationModel, IConfigurationOverrides, IConfigurationUpdateOverrides, IConfigurationValue, IInspectValue, IOverrides, removeFromValueTree, toValuesTree } from './configuration.js';
import { ConfigurationScope, Extensions, IConfigurationPropertySchema, IConfigurationRegistry, overrideIdentifiersFromKey, OVERRIDE_PROPERTY_REGEX, IRegisteredConfigurationPropertySchema } from './configurationRegistry.js';
import { FileOperation, IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { Registry } from '../../registry/common/platform.js';
import { Workspace } from '../../workspace/common/workspace.js';

function freeze<T>(data: T): T {
	return Object.isFrozen(data) ? data : objects.deepFreeze(data);
}

type InspectValue<V> = IInspectValue<V> & { merged?: V };

export class ConfigurationModel implements IConfigurationModel {

	static createEmptyModel(logService: ILogService): ConfigurationModel {
		return new ConfigurationModel({}, [], [], undefined, logService);
	}

	private readonly overrideConfigurations = new Map<string, ConfigurationModel>();

	constructor(
		private readonly _contents: IStringDictionary<unknown>,
		private readonly _keys: string[],
		private readonly _overrides: IOverrides[],
		private readonly _raw: IStringDictionary<unknown> | ReadonlyArray<IStringDictionary<unknown> | ConfigurationModel> | undefined,
		private readonly logService: ILogService
	) {
	}

	private _rawConfiguration: ConfigurationModel | undefined;
	get rawConfiguration(): ConfigurationModel {
		if (!this._rawConfiguration) {
			if (this._raw) {
				const rawConfigurationModels = (Array.isArray(this._raw) ? this._raw : [this._raw]).map(raw => {
					if (raw instanceof ConfigurationModel) {
						return raw;
					}
					const parser = new ConfigurationModelParser('', this.logService);
					parser.parseRaw(raw);
					return parser.configurationModel;
				});
				this._rawConfiguration = rawConfigurationModels.reduce((previous, current) => current === previous ? current : previous.merge(current), rawConfigurationModels[0]);
			} else {
				// raw is same as current
				this._rawConfiguration = this;
			}
		}
		return this._rawConfiguration;
	}

	get contents(): IStringDictionary<unknown> {
		return this._contents;
	}

	get overrides(): IOverrides[] {
		return this._overrides;
	}

	get keys(): string[] {
		return this._keys;
	}

	get raw(): IStringDictionary<unknown> | IStringDictionary<unknown>[] | undefined {
		if (!this._raw) {
			return undefined;
		}
		if (Array.isArray(this._raw) && this._raw.every(raw => raw instanceof ConfigurationModel)) {
			return undefined;
		}
		return this._raw as IStringDictionary<unknown> | IStringDictionary<unknown>[];
	}

	isEmpty(): boolean {
		return this._keys.length === 0 && Object.keys(this._contents).length === 0 && this._overrides.length === 0;
	}

	getValue<V>(section: string | undefined): V | undefined {
		return section ? getConfigurationValue<V>(this.contents, section) : this.contents as V;
	}

	inspect<V>(section: string | undefined, overrideIdentifier?: string | null): InspectValue<V> {
		const that = this;
		return {
			get value() {
				return freeze(that.rawConfiguration.getValue<V>(section));
			},
			get override() {
				return overrideIdentifier ? freeze(that.rawConfiguration.getOverrideValue<V>(section, overrideIdentifier)) : undefined;
			},
			get merged() {
				return freeze(overrideIdentifier ? that.rawConfiguration.override(overrideIdentifier).getValue<V>(section) : that.rawConfiguration.getValue<V>(section));
			},
			get overrides() {
				const overrides: { readonly identifiers: string[]; readonly value: V }[] = [];
				for (const { contents, identifiers, keys } of that.rawConfiguration.overrides) {
					const value = new ConfigurationModel(contents, keys, [], undefined, that.logService).getValue<V>(section);
					if (value !== undefined) {
						overrides.push({ identifiers, value });
					}
				}
				return overrides.length ? freeze(overrides) : undefined;
			}
		};
	}

	getOverrideValue<V>(section: string | undefined, overrideIdentifier: string): V | undefined {
		const overrideContents = this.getContentsForOverrideIdentifer(overrideIdentifier);
		return overrideContents
			? section ? getConfigurationValue<V>(overrideContents, section) : overrideContents as V
			: undefined;
	}

	getKeysForOverrideIdentifier(identifier: string): string[] {
		const keys: string[] = [];
		for (const override of this.overrides) {
			if (override.identifiers.includes(identifier)) {
				keys.push(...override.keys);
			}
		}
		return arrays.distinct(keys);
	}

	getAllOverrideIdentifiers(): string[] {
		const result: string[] = [];
		for (const override of this.overrides) {
			result.push(...override.identifiers);
		}
		return arrays.distinct(result);
	}

	override(identifier: string): ConfigurationModel {
		let overrideConfigurationModel = this.overrideConfigurations.get(identifier);
		if (!overrideConfigurationModel) {
			overrideConfigurationModel = this.createOverrideConfigurationModel(identifier);
			this.overrideConfigurations.set(identifier, overrideConfigurationModel);
		}
		return overrideConfigurationModel;
	}

	merge(...others: ConfigurationModel[]): ConfigurationModel {
		const contents = objects.deepClone(this.contents);
		const overrides = objects.deepClone(this.overrides);
		const keys = [...this.keys];
		const raws = this._raw ? Array.isArray(this._raw) ? [...this._raw] : [this._raw] : [this];

		for (const other of others) {
			raws.push(...(other._raw ? Array.isArray(other._raw) ? other._raw : [other._raw] : [other]));
			if (other.isEmpty()) {
				continue;
			}
			this.mergeContents(contents, other.contents);

			for (const otherOverride of other.overrides) {
				const [override] = overrides.filter(o => arrays.equals(o.identifiers, otherOverride.identifiers));
				if (override) {
					this.mergeContents(override.contents, otherOverride.contents);
					override.keys.push(...otherOverride.keys);
					override.keys = arrays.distinct(override.keys);
				} else {
					overrides.push(objects.deepClone(otherOverride));
				}
			}
			for (const key of other.keys) {
				if (keys.indexOf(key) === -1) {
					keys.push(key);
				}
			}
		}
		return new ConfigurationModel(contents, keys, overrides, !raws.length || raws.every(raw => raw instanceof ConfigurationModel) ? undefined : raws, this.logService);
	}

	private createOverrideConfigurationModel(identifier: string): ConfigurationModel {
		const overrideContents = this.getContentsForOverrideIdentifer(identifier);

		if (!overrideContents || typeof overrideContents !== 'object' || !Object.keys(overrideContents).length) {
			// If there are no valid overrides, return self
			return this;
		}

		const contents: IStringDictionary<unknown> = {};
		for (const key of arrays.distinct([...Object.keys(this.contents), ...Object.keys(overrideContents)])) {

			let contentsForKey = this.contents[key];
			const overrideContentsForKey = overrideContents[key];

			// If there are override contents for the key, clone and merge otherwise use base contents
			if (overrideContentsForKey) {
				// Clone and merge only if base contents and override contents are of type object otherwise just override
				if (typeof contentsForKey === 'object' && typeof overrideContentsForKey === 'object') {
					contentsForKey = objects.deepClone(contentsForKey);
					this.mergeContents(contentsForKey as IStringDictionary<unknown>, overrideContentsForKey as IStringDictionary<unknown>);
				} else {
					contentsForKey = overrideContentsForKey;
				}
			}

			contents[key] = contentsForKey;
		}

		return new ConfigurationModel(contents, this.keys, this.overrides, undefined, this.logService);
	}

	private mergeContents(source: IStringDictionary<unknown>, target: IStringDictionary<unknown>): void {
		for (const key of Object.keys(target)) {
			if (key in source) {
				if (types.isObject(source[key]) && types.isObject(target[key])) {
					this.mergeContents(source[key] as IStringDictionary<unknown>, target[key] as IStringDictionary<unknown>);
					continue;
				}
			}
			source[key] = objects.deepClone(target[key]);
		}
	}

	private getContentsForOverrideIdentifer(identifier: string): IStringDictionary<unknown> | null {
		let contentsForIdentifierOnly: IStringDictionary<unknown> | null = null;
		let contents: IStringDictionary<unknown> | null = null;
		const mergeContents = (contentsToMerge: IStringDictionary<unknown> | null) => {
			if (contentsToMerge) {
				if (contents) {
					this.mergeContents(contents, contentsToMerge);
				} else {
					contents = objects.deepClone(contentsToMerge);
				}
			}
		};
		for (const override of this.overrides) {
			if (override.identifiers.length === 1 && override.identifiers[0] === identifier) {
				contentsForIdentifierOnly = override.contents;
			} else if (override.identifiers.includes(identifier)) {
				mergeContents(override.contents);
			}
		}
		// Merge contents of the identifier only at the end to take precedence.
		mergeContents(contentsForIdentifierOnly);
		return contents;
	}

	toJSON(): IConfigurationModel {
		return {
			contents: this.contents,
			overrides: this.overrides,
			keys: this.keys
		};
	}

	// Update methods

	public addValue(key: string, value: unknown): void {
		this.updateValue(key, value, true);
	}

	public setValue(key: string, value: unknown): void {
		this.updateValue(key, value, false);
	}

	public removeValue(key: string): void {
		const index = this.keys.indexOf(key);
		if (index === -1) {
			return;
		}
		this.keys.splice(index, 1);
		removeFromValueTree(this.contents, key);
		if (OVERRIDE_PROPERTY_REGEX.test(key)) {
			this.overrides.splice(this.overrides.findIndex(o => arrays.equals(o.identifiers, overrideIdentifiersFromKey(key))), 1);
		}
	}

	private updateValue(key: string, value: unknown, add: boolean): void {
		addToValueTree(this.contents, key, value, e => this.logService.error(e));
		add = add || this.keys.indexOf(key) === -1;
		if (add) {
			this.keys.push(key);
		}
		if (OVERRIDE_PROPERTY_REGEX.test(key)) {
			const overrideContents = this.contents[key] as IStringDictionary<unknown>;
			const identifiers = overrideIdentifiersFromKey(key);
			const override = {
				identifiers,
				keys: Object.keys(overrideContents),
				contents: toValuesTree(overrideContents, message => this.logService.error(message)),
			};
			const index = this.overrides.findIndex(o => arrays.equals(o.identifiers, identifiers));
			if (index !== -1) {
				this.overrides[index] = override;
			} else {
				this.overrides.push(override);
			}
		}
	}
}

export interface ConfigurationParseOptions {
	skipUnregistered?: boolean;
	scopes?: ConfigurationScope[];
	skipRestricted?: boolean;
	include?: string[];
	exclude?: string[];
}

export class ConfigurationModelParser {

	private _raw: IStringDictionary<unknown> | null = null;
	private _configurationModel: ConfigurationModel | null = null;
	private _restrictedConfigurations: string[] = [];
	private _parseErrors: json.ParseError[] = [];

	constructor(
		protected readonly _name: string,
		protected readonly logService: ILogService
	) { }

	get configurationModel(): ConfigurationModel {
		return this._configurationModel || ConfigurationModel.createEmptyModel(this.logService);
	}

	get restrictedConfigurations(): string[] {
		return this._restrictedConfigurations;
	}

	get errors(): json.ParseError[] {
		return this._parseErrors;
	}

	public parse(content: string | null | undefined, options?: ConfigurationParseOptions): void {
		if (!types.isUndefinedOrNull(content)) {
			const raw = this.doParseContent(content);
			this.parseRaw(raw, options);
		}
	}

	public reparse(options: ConfigurationParseOptions): void {
		if (this._raw) {
			this.parseRaw(this._raw, options);
		}
	}

	public parseRaw(raw: IStringDictionary<unknown>, options?: ConfigurationParseOptions): void {
		this._raw = raw;
		const { contents, keys, overrides, restricted, hasExcludedProperties } = this.doParseRaw(raw, options);
		this._configurationModel = new ConfigurationModel(contents, keys, overrides, hasExcludedProperties ? [raw] : undefined /* raw has not changed */, this.logService);
		this._restrictedConfigurations = restricted || [];
	}

	private doParseContent(content: string): IStringDictionary<unknown> {
		let raw: IStringDictionary<unknown> = {};
		let currentProperty: string | null = null;
		let currentParent: unknown[] | IStringDictionary<unknown> = [];
		const previousParents: (unknown[] | IStringDictionary<unknown>)[] = [];
		const parseErrors: json.ParseError[] = [];

		function onValue(value: unknown) {
			if (Array.isArray(currentParent)) {
				currentParent.push(value);
			} else if (currentProperty !== null) {
				currentParent[currentProperty] = value;
			}
		}

		const visitor: json.JSONVisitor = {
			onObjectBegin: () => {
				const object = {};
				onValue(object);
				previousParents.push(currentParent);
				currentParent = object;
				currentProperty = null;
			},
			onObjectProperty: (name: string) => {
				currentProperty = name;
			},
			onObjectEnd: () => {
				currentParent = previousParents.pop()!;
			},
			onArrayBegin: () => {
				const array: unknown[] = [];
				onValue(array);
				previousParents.push(currentParent);
				currentParent = array;
				currentProperty = null;
			},
			onArrayEnd: () => {
				currentParent = previousParents.pop()!;
			},
			onLiteralValue: onValue,
			onError: (error: json.ParseErrorCode, offset: number, length: number) => {
				parseErrors.push({ error, offset, length });
			}
		};
		if (content) {
			try {
				json.visit(content, visitor);
				raw = (currentParent[0] as IStringDictionary<unknown>) || {};
			} catch (e) {
				this.logService.error(`Error while parsing settings file ${this._name}: ${e}`);
				this._parseErrors = [e as json.ParseError];
			}
		}

		return raw;
	}

	protected doParseRaw(raw: IStringDictionary<unknown>, options?: ConfigurationParseOptions): IConfigurationModel & { restricted?: string[]; hasExcludedProperties?: boolean } {
		const registry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
		const configurationProperties = registry.getConfigurationProperties();
		const excludedConfigurationProperties = registry.getExcludedConfigurationProperties();
		const filtered = this.filter(raw, configurationProperties, excludedConfigurationProperties, true, options);
		raw = filtered.raw;
		const contents = toValuesTree(raw, message => this.logService.error(`Conflict in settings file ${this._name}: ${message}`));
		const keys = Object.keys(raw);
		const overrides = this.toOverrides(raw, message => this.logService.error(`Conflict in settings file ${this._name}: ${message}`));
		return { contents, keys, overrides, restricted: filtered.restricted, hasExcludedProperties: filtered.hasExcludedProperties };
	}

	private filter(properties: IStringDictionary<unknown>, configurationProperties: IStringDictionary<IRegisteredConfigurationPropertySchema>, excludedConfigurationProperties: IStringDictionary<IRegisteredConfigurationPropertySchema>, filterOverriddenProperties: boolean, options?: ConfigurationParseOptions): { raw: IStringDictionary<unknown>; restricted: string[]; hasExcludedProperties: boolean } {
		let hasExcludedProperties = false;
		if (!options?.scopes && !options?.skipRestricted && !options?.skipUnregistered && !options?.exclude?.length) {
			return { raw: properties, restricted: [], hasExcludedProperties };
		}
		const raw: IStringDictionary<unknown> = {};
		const restricted: string[] = [];
		for (const key in properties) {
			if (OVERRIDE_PROPERTY_REGEX.test(key) && filterOverriddenProperties) {
				const result = this.filter(properties[key] as IStringDictionary<unknown>, configurationProperties, excludedConfigurationProperties, false, options);
				raw[key] = result.raw;
				hasExcludedProperties = hasExcludedProperties || result.hasExcludedProperties;
				restricted.push(...result.restricted);
			} else {
				const propertySchema = configurationProperties[key];
				if (propertySchema?.restricted) {
					restricted.push(key);
				}
				if (this.shouldInclude(key, propertySchema, excludedConfigurationProperties, options)) {
					raw[key] = properties[key];
				} else {
					hasExcludedProperties = true;
				}
			}
		}
		return { raw, restricted, hasExcludedProperties };
	}

	private shouldInclude(key: string, propertySchema: IConfigurationPropertySchema | undefined, excludedConfigurationProperties: IStringDictionary<IRegisteredConfigurationPropertySchema>, options: ConfigurationParseOptions): boolean {
		if (options.exclude?.includes(key)) {
			return false;
		}

		if (options.include?.includes(key)) {
			return true;
		}

		if (options.skipRestricted && propertySchema?.restricted) {
			return false;
		}

		if (options.skipUnregistered && !propertySchema) {
			return false;
		}

		const schema = propertySchema ?? excludedConfigurationProperties[key];
		const scope = schema ? typeof schema.scope !== 'undefined' ? schema.scope : ConfigurationScope.WINDOW : undefined;
		if (scope === undefined || options.scopes === undefined) {
			return true;
		}

		return options.scopes.includes(scope);
	}

	private toOverrides(raw: IStringDictionary<unknown>, conflictReporter: (message: string) => void): IOverrides[] {
		const overrides: IOverrides[] = [];
		for (const key of Object.keys(raw)) {
			if (OVERRIDE_PROPERTY_REGEX.test(key)) {
				const overrideRaw: IStringDictionary<unknown> = {};
				const rawKey = raw[key] as IStringDictionary<unknown>;
				for (const keyInOverrideRaw in rawKey) {
					overrideRaw[keyInOverrideRaw] = rawKey[keyInOverrideRaw];
				}
				overrides.push({
					identifiers: overrideIdentifiersFromKey(key),
					keys: Object.keys(overrideRaw),
					contents: toValuesTree(overrideRaw, conflictReporter)
				});
			}
		}
		return overrides;
	}

}

export class UserSettings extends Disposable {

	private readonly parser: ConfigurationModelParser;
	protected readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor(
		private readonly userSettingsResource: URI,
		protected parseOptions: ConfigurationParseOptions,
		extUri: IExtUri,
		private readonly fileService: IFileService,
		private readonly logService: ILogService,
	) {
		super();
		this.parser = new ConfigurationModelParser(this.userSettingsResource.toString(), logService);
		this._register(this.fileService.watch(extUri.dirname(this.userSettingsResource)));
		// Also listen to the resource incase the resource is a symlink - https://github.com/microsoft/vscode/issues/118134
		this._register(this.fileService.watch(this.userSettingsResource));
		this._register(Event.any(
			Event.filter(this.fileService.onDidFilesChange, e => e.contains(this.userSettingsResource)),
			Event.filter(this.fileService.onDidRunOperation, e => (e.isOperation(FileOperation.CREATE) || e.isOperation(FileOperation.COPY) || e.isOperation(FileOperation.DELETE) || e.isOperation(FileOperation.WRITE)) && extUri.isEqual(e.resource, userSettingsResource))
		)(() => this._onDidChange.fire()));
	}

	async loadConfiguration(): Promise<ConfigurationModel> {
		try {
			const content = await this.fileService.readFile(this.userSettingsResource);
			this.parser.parse(content.value.toString() || '{}', this.parseOptions);
			return this.parser.configurationModel;
		} catch (e) {
			return ConfigurationModel.createEmptyModel(this.logService);
		}
	}

	reparse(parseOptions?: ConfigurationParseOptions): ConfigurationModel {
		if (parseOptions) {
			this.parseOptions = parseOptions;
		}
		this.parser.reparse(this.parseOptions);
		return this.parser.configurationModel;
	}

	getRestrictedSettings(): string[] {
		return this.parser.restrictedConfigurations;
	}
}

class ConfigurationInspectValue<V> implements IConfigurationValue<V> {

	constructor(
		private readonly key: string,
		private readonly overrides: IConfigurationOverrides,
		private readonly _value: V | undefined,
		readonly overrideIdentifiers: string[] | undefined,
		private readonly defaultConfiguration: ConfigurationModel,
		private readonly policyConfiguration: ConfigurationModel | undefined,
		private readonly applicationConfiguration: ConfigurationModel | undefined,
		private readonly userConfiguration: ConfigurationModel,
		private readonly localUserConfiguration: ConfigurationModel,
		private readonly remoteUserConfiguration: ConfigurationModel,
		private readonly workspaceConfiguration: ConfigurationModel | undefined,
		private readonly folderConfigurationModel: ConfigurationModel | undefined,
		private readonly memoryConfigurationModel: ConfigurationModel
	) {
	}

	get value(): V | undefined {
		return freeze(this._value);
	}

	private toInspectValue(inspectValue: IInspectValue<V> | undefined | null): IInspectValue<V> | undefined {
		return inspectValue?.value !== undefined || inspectValue?.override !== undefined || inspectValue?.overrides !== undefined ? inspectValue : undefined;
	}

	private _defaultInspectValue: InspectValue<V> | undefined;
	private get defaultInspectValue(): InspectValue<V> {
		if (!this._defaultInspectValue) {
			this._defaultInspectValue = this.defaultConfiguration.inspect<V>(this.key, this.overrides.overrideIdentifier);
		}
		return this._defaultInspectValue;
	}

	get defaultValue(): V | undefined {
		return this.defaultInspectValue.merged;
	}

	get default(): IInspectValue<V> | undefined {
		return this.toInspectValue(this.defaultInspectValue);
	}

	private _policyInspectValue: InspectValue<V> | undefined | null;
	private get policyInspectValue(): InspectValue<V> | null {
		if (this._policyInspectValue === undefined) {
			this._policyInspectValue = this.policyConfiguration ? this.policyConfiguration.inspect<V>(this.key) : null;
		}
		return this._policyInspectValue;
	}

	get policyValue(): V | undefined {
		return this.policyInspectValue?.merged;
	}

	get policy(): IInspectValue<V> | undefined {
		return this.policyInspectValue?.value !== undefined ? { value: this.policyInspectValue.value } : undefined;
	}

	private _applicationInspectValue: InspectValue<V> | undefined | null;
	private get applicationInspectValue(): InspectValue<V> | null {
		if (this._applicationInspectValue === undefined) {
			this._applicationInspectValue = this.applicationConfiguration ? this.applicationConfiguration.inspect<V>(this.key) : null;
		}
		return this._applicationInspectValue;
	}

	get applicationValue(): V | undefined {
		return this.applicationInspectValue?.merged;
	}

	get application(): IInspectValue<V> | undefined {
		return this.toInspectValue(this.applicationInspectValue);
	}

	private _userInspectValue: InspectValue<V> | undefined;
	private get userInspectValue(): InspectValue<V> {
		if (!this._userInspectValue) {
			this._userInspectValue = this.userConfiguration.inspect<V>(this.key, this.overrides.overrideIdentifier);
		}
		return this._userInspectValue;
	}

	get userValue(): V | undefined {
		return this.userInspectValue.merged;
	}

	get user(): IInspectValue<V> | undefined {
		return this.toInspectValue(this.userInspectValue);
	}

	private _userLocalInspectValue: InspectValue<V> | undefined;
	private get userLocalInspectValue(): InspectValue<V> {
		if (!this._userLocalInspectValue) {
			this._userLocalInspectValue = this.localUserConfiguration.inspect<V>(this.key, this.overrides.overrideIdentifier);
		}
		return this._userLocalInspectValue;
	}

	get userLocalValue(): V | undefined {
		return this.userLocalInspectValue.merged;
	}

	get userLocal(): IInspectValue<V> | undefined {
		return this.toInspectValue(this.userLocalInspectValue);
	}

	private _userRemoteInspectValue: InspectValue<V> | undefined;
	private get userRemoteInspectValue(): InspectValue<V> {
		if (!this._userRemoteInspectValue) {
			this._userRemoteInspectValue = this.remoteUserConfiguration.inspect<V>(this.key, this.overrides.overrideIdentifier);
		}
		return this._userRemoteInspectValue;
	}

	get userRemoteValue(): V | undefined {
		return this.userRemoteInspectValue.merged;
	}

	get userRemote(): IInspectValue<V> | undefined {
		return this.toInspectValue(this.userRemoteInspectValue);
	}

	private _workspaceInspectValue: InspectValue<V> | undefined | null;
	private get workspaceInspectValue(): InspectValue<V> | null {
		if (this._workspaceInspectValue === undefined) {
			this._workspaceInspectValue = this.workspaceConfiguration ? this.workspaceConfiguration.inspect<V>(this.key, this.overrides.overrideIdentifier) : null;
		}
		return this._workspaceInspectValue;
	}

	get workspaceValue(): V | undefined {
		return this.workspaceInspectValue?.merged;
	}

	get workspace(): IInspectValue<V> | undefined {
		return this.toInspectValue(this.workspaceInspectValue);
	}

	private _workspaceFolderInspectValue: InspectValue<V> | undefined | null;
	private get workspaceFolderInspectValue(): InspectValue<V> | null {
		if (this._workspaceFolderInspectValue === undefined) {
			this._workspaceFolderInspectValue = this.folderConfigurationModel ? this.folderConfigurationModel.inspect<V>(this.key, this.overrides.overrideIdentifier) : null;
		}
		return this._workspaceFolderInspectValue;
	}

	get workspaceFolderValue(): V | undefined {
		return this.workspaceFolderInspectValue?.merged;
	}

	get workspaceFolder(): IInspectValue<V> | undefined {
		return this.toInspectValue(this.workspaceFolderInspectValue);
	}

	private _memoryInspectValue: InspectValue<V> | undefined;
	private get memoryInspectValue(): InspectValue<V> {
		if (this._memoryInspectValue === undefined) {
			this._memoryInspectValue = this.memoryConfigurationModel.inspect<V>(this.key, this.overrides.overrideIdentifier);
		}
		return this._memoryInspectValue;
	}

	get memoryValue(): V | undefined {
		return this.memoryInspectValue.merged;
	}

	get memory(): IInspectValue<V> | undefined {
		return this.toInspectValue(this.memoryInspectValue);
	}

}

export class Configuration {

	private _workspaceConsolidatedConfiguration: ConfigurationModel | null = null;
	private _foldersConsolidatedConfigurations = new ResourceMap<ConfigurationModel>();

	constructor(
		private _defaultConfiguration: ConfigurationModel,
		private _policyConfiguration: ConfigurationModel,
		private _applicationConfiguration: ConfigurationModel,
		private _localUserConfiguration: ConfigurationModel,
		private _remoteUserConfiguration: ConfigurationModel,
		private _workspaceConfiguration: ConfigurationModel,
		private _folderConfigurations: ResourceMap<ConfigurationModel>,
		private _memoryConfiguration: ConfigurationModel,
		private _memoryConfigurationByResource: ResourceMap<ConfigurationModel>,
		private readonly logService: ILogService
	) {
	}

	getValue(section: string | undefined, overrides: IConfigurationOverrides, workspace: Workspace | undefined): unknown {
		const consolidateConfigurationModel = this.getConsolidatedConfigurationModel(section, overrides, workspace);
		return consolidateConfigurationModel.getValue(section);
	}

	updateValue(key: string, value: unknown, overrides: IConfigurationUpdateOverrides = {}): void {
		let memoryConfiguration: ConfigurationModel | undefined;
		if (overrides.resource) {
			memoryConfiguration = this._memoryConfigurationByResource.get(overrides.resource);
			if (!memoryConfiguration) {
				memoryConfiguration = ConfigurationModel.createEmptyModel(this.logService);
				this._memoryConfigurationByResource.set(overrides.resource, memoryConfiguration);
			}
		} else {
			memoryConfiguration = this._memoryConfiguration;
		}

		if (value === undefined) {
			memoryConfiguration.removeValue(key);
		} else {
			memoryConfiguration.setValue(key, value);
		}

		if (!overrides.resource) {
			this._workspaceConsolidatedConfiguration = null;
		}
	}

	inspect<C>(key: string, overrides: IConfigurationOverrides, workspace: Workspace | undefined): IConfigurationValue<C> {
		const consolidateConfigurationModel = this.getConsolidatedConfigurationModel(key, overrides, workspace);
		const folderConfigurationModel = this.getFolderConfigurationModelForResource(overrides.resource, workspace);
		const memoryConfigurationModel = overrides.resource ? this._memoryConfigurationByResource.get(overrides.resource) || this._memoryConfiguration : this._memoryConfiguration;
		const overrideIdentifiers = new Set<string>();
		for (const override of consolidateConfigurationModel.overrides) {
			for (const overrideIdentifier of override.identifiers) {
				if (consolidateConfigurationModel.getOverrideValue(key, overrideIdentifier) !== undefined) {
					overrideIdentifiers.add(overrideIdentifier);
				}
			}
		}

		return new ConfigurationInspectValue<C>(
			key,
			overrides,
			consolidateConfigurationModel.getValue<C>(key),
			overrideIdentifiers.size ? [...overrideIdentifiers] : undefined,
			this._defaultConfiguration,
			this._policyConfiguration.isEmpty() ? undefined : this._policyConfiguration,
			this.applicationConfiguration.isEmpty() ? undefined : this.applicationConfiguration,
			this.userConfiguration,
			this.localUserConfiguration,
			this.remoteUserConfiguration,
			workspace ? this._workspaceConfiguration : undefined,
			folderConfigurationModel ? folderConfigurationModel : undefined,
			memoryConfigurationModel
		);

	}

	keys(workspace: Workspace | undefined): {
		default: string[];
		policy: string[];
		user: string[];
		workspace: string[];
		workspaceFolder: string[];
	} {
		const folderConfigurationModel = this.getFolderConfigurationModelForResource(undefined, workspace);
		return {
			default: this._defaultConfiguration.keys.slice(0),
			policy: this._policyConfiguration.keys.slice(0),
			user: this.userConfiguration.keys.slice(0),
			workspace: this._workspaceConfiguration.keys.slice(0),
			workspaceFolder: folderConfigurationModel ? folderConfigurationModel.keys.slice(0) : []
		};
	}

	updateDefaultConfiguration(defaultConfiguration: ConfigurationModel): void {
		this._defaultConfiguration = defaultConfiguration;
		this._workspaceConsolidatedConfiguration = null;
		this._foldersConsolidatedConfigurations.clear();
	}

	updatePolicyConfiguration(policyConfiguration: ConfigurationModel): void {
		this._policyConfiguration = policyConfiguration;
	}

	updateApplicationConfiguration(applicationConfiguration: ConfigurationModel): void {
		this._applicationConfiguration = applicationConfiguration;
		this._workspaceConsolidatedConfiguration = null;
		this._foldersConsolidatedConfigurations.clear();
	}

	updateLocalUserConfiguration(localUserConfiguration: ConfigurationModel): void {
		this._localUserConfiguration = localUserConfiguration;
		this._userConfiguration = null;
		this._workspaceConsolidatedConfiguration = null;
		this._foldersConsolidatedConfigurations.clear();
	}

	updateRemoteUserConfiguration(remoteUserConfiguration: ConfigurationModel): void {
		this._remoteUserConfiguration = remoteUserConfiguration;
		this._userConfiguration = null;
		this._workspaceConsolidatedConfiguration = null;
		this._foldersConsolidatedConfigurations.clear();
	}

	updateWorkspaceConfiguration(workspaceConfiguration: ConfigurationModel): void {
		this._workspaceConfiguration = workspaceConfiguration;
		this._workspaceConsolidatedConfiguration = null;
		this._foldersConsolidatedConfigurations.clear();
	}

	updateFolderConfiguration(resource: URI, configuration: ConfigurationModel): void {
		this._folderConfigurations.set(resource, configuration);
		this._foldersConsolidatedConfigurations.delete(resource);
	}

	deleteFolderConfiguration(resource: URI): void {
		this.folderConfigurations.delete(resource);
		this._foldersConsolidatedConfigurations.delete(resource);
	}

	compareAndUpdateDefaultConfiguration(defaults: ConfigurationModel, keys?: string[]): IConfigurationChange {
		const overrides: [string, string[]][] = [];
		if (!keys) {
			const { added, updated, removed } = compare(this._defaultConfiguration, defaults);
			keys = [...added, ...updated, ...removed];
		}
		for (const key of keys) {
			for (const overrideIdentifier of overrideIdentifiersFromKey(key)) {
				const fromKeys = this._defaultConfiguration.getKeysForOverrideIdentifier(overrideIdentifier);
				const toKeys = defaults.getKeysForOverrideIdentifier(overrideIdentifier);
				const keys = [
					...toKeys.filter(key => fromKeys.indexOf(key) === -1),
					...fromKeys.filter(key => toKeys.indexOf(key) === -1),
					...fromKeys.filter(key => !objects.equals(this._defaultConfiguration.override(overrideIdentifier).getValue(key), defaults.override(overrideIdentifier).getValue(key)))
				];
				overrides.push([overrideIdentifier, keys]);
			}
		}
		this.updateDefaultConfiguration(defaults);
		return { keys, overrides };
	}

	compareAndUpdatePolicyConfiguration(policyConfiguration: ConfigurationModel): IConfigurationChange {
		const { added, updated, removed } = compare(this._policyConfiguration, policyConfiguration);
		const keys = [...added, ...updated, ...removed];
		if (keys.length) {
			this.updatePolicyConfiguration(policyConfiguration);
		}
		return { keys, overrides: [] };
	}

	compareAndUpdateApplicationConfiguration(application: ConfigurationModel): IConfigurationChange {
		const { added, updated, removed, overrides } = compare(this.applicationConfiguration, application);
		const keys = [...added, ...updated, ...removed];
		if (keys.length) {
			this.updateApplicationConfiguration(application);
		}
		return { keys, overrides };
	}

	compareAndUpdateLocalUserConfiguration(user: ConfigurationModel): IConfigurationChange {
		const { added, updated, removed, overrides } = compare(this.localUserConfiguration, user);
		const keys = [...added, ...updated, ...removed];
		if (keys.length) {
			this.updateLocalUserConfiguration(user);
		}
		return { keys, overrides };
	}

	compareAndUpdateRemoteUserConfiguration(user: ConfigurationModel): IConfigurationChange {
		const { added, updated, removed, overrides } = compare(this.remoteUserConfiguration, user);
		const keys = [...added, ...updated, ...removed];
		if (keys.length) {
			this.updateRemoteUserConfiguration(user);
		}
		return { keys, overrides };
	}

	compareAndUpdateWorkspaceConfiguration(workspaceConfiguration: ConfigurationModel): IConfigurationChange {
		const { added, updated, removed, overrides } = compare(this.workspaceConfiguration, workspaceConfiguration);
		const keys = [...added, ...updated, ...removed];
		if (keys.length) {
			this.updateWorkspaceConfiguration(workspaceConfiguration);
		}
		return { keys, overrides };
	}

	compareAndUpdateFolderConfiguration(resource: URI, folderConfiguration: ConfigurationModel): IConfigurationChange {
		const currentFolderConfiguration = this.folderConfigurations.get(resource);
		const { added, updated, removed, overrides } = compare(currentFolderConfiguration, folderConfiguration);
		const keys = [...added, ...updated, ...removed];
		if (keys.length || !currentFolderConfiguration) {
			this.updateFolderConfiguration(resource, folderConfiguration);
		}
		return { keys, overrides };
	}

	compareAndDeleteFolderConfiguration(folder: URI): IConfigurationChange {
		const folderConfig = this.folderConfigurations.get(folder);
		if (!folderConfig) {
			throw new Error('Unknown folder');
		}
		this.deleteFolderConfiguration(folder);
		const { added, updated, removed, overrides } = compare(folderConfig, undefined);
		return { keys: [...added, ...updated, ...removed], overrides };
	}

	get defaults(): ConfigurationModel {
		return this._defaultConfiguration;
	}

	get applicationConfiguration(): ConfigurationModel {
		return this._applicationConfiguration;
	}

	private _userConfiguration: ConfigurationModel | null = null;
	get userConfiguration(): ConfigurationModel {
		if (!this._userConfiguration) {
			if (this._remoteUserConfiguration.isEmpty()) {
				this._userConfiguration = this._localUserConfiguration;
			} else {
				const merged = this._localUserConfiguration.merge(this._remoteUserConfiguration);
				this._userConfiguration = new ConfigurationModel(merged.contents, merged.keys, merged.overrides, undefined, this.logService);
			}
		}
		return this._userConfiguration;
	}

	get localUserConfiguration(): ConfigurationModel {
		return this._localUserConfiguration;
	}

	get remoteUserConfiguration(): ConfigurationModel {
		return this._remoteUserConfiguration;
	}

	get workspaceConfiguration(): ConfigurationModel {
		return this._workspaceConfiguration;
	}

	get folderConfigurations(): ResourceMap<ConfigurationModel> {
		return this._folderConfigurations;
	}

	private getConsolidatedConfigurationModel(section: string | undefined, overrides: IConfigurationOverrides, workspace: Workspace | undefined): ConfigurationModel {
		let configurationModel = this.getConsolidatedConfigurationModelForResource(overrides, workspace);
		if (overrides.overrideIdentifier) {
			configurationModel = configurationModel.override(overrides.overrideIdentifier);
		}
		if (!this._policyConfiguration.isEmpty() && this._policyConfiguration.getValue(section) !== undefined) {
			// clone by merging
			configurationModel = configurationModel.merge();
			for (const key of this._policyConfiguration.keys) {
				configurationModel.setValue(key, this._policyConfiguration.getValue(key));
			}
		}
		return configurationModel;
	}

	private getConsolidatedConfigurationModelForResource({ resource }: IConfigurationOverrides, workspace: Workspace | undefined): ConfigurationModel {
		let consolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();

		if (workspace && resource) {
			const root = workspace.getFolder(resource);
			if (root) {
				consolidateConfiguration = this.getFolderConsolidatedConfiguration(root.uri) || consolidateConfiguration;
			}
			const memoryConfigurationForResource = this._memoryConfigurationByResource.get(resource);
			if (memoryConfigurationForResource) {
				consolidateConfiguration = consolidateConfiguration.merge(memoryConfigurationForResource);
			}
		}

		return consolidateConfiguration;
	}

	private getWorkspaceConsolidatedConfiguration(): ConfigurationModel {
		if (!this._workspaceConsolidatedConfiguration) {
			this._workspaceConsolidatedConfiguration = this._defaultConfiguration.merge(this.applicationConfiguration, this.userConfiguration, this._workspaceConfiguration, this._memoryConfiguration);
		}
		return this._workspaceConsolidatedConfiguration;
	}

	private getFolderConsolidatedConfiguration(folder: URI): ConfigurationModel {
		let folderConsolidatedConfiguration = this._foldersConsolidatedConfigurations.get(folder);
		if (!folderConsolidatedConfiguration) {
			const workspaceConsolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
			const folderConfiguration = this._folderConfigurations.get(folder);
			if (folderConfiguration) {
				folderConsolidatedConfiguration = workspaceConsolidateConfiguration.merge(folderConfiguration);
				this._foldersConsolidatedConfigurations.set(folder, folderConsolidatedConfiguration);
			} else {
				folderConsolidatedConfiguration = workspaceConsolidateConfiguration;
			}
		}
		return folderConsolidatedConfiguration;
	}

	private getFolderConfigurationModelForResource(resource: URI | null | undefined, workspace: Workspace | undefined): ConfigurationModel | undefined {
		if (workspace && resource) {
			const root = workspace.getFolder(resource);
			if (root) {
				return this._folderConfigurations.get(root.uri);
			}
		}
		return undefined;
	}

	toData(): IConfigurationData {
		return {
			defaults: {
				contents: this._defaultConfiguration.contents,
				overrides: this._defaultConfiguration.overrides,
				keys: this._defaultConfiguration.keys,
			},
			policy: {
				contents: this._policyConfiguration.contents,
				overrides: this._policyConfiguration.overrides,
				keys: this._policyConfiguration.keys
			},
			application: {
				contents: this.applicationConfiguration.contents,
				overrides: this.applicationConfiguration.overrides,
				keys: this.applicationConfiguration.keys,
				raw: Array.isArray(this.applicationConfiguration.raw) ? undefined : this.applicationConfiguration.raw
			},
			userLocal: {
				contents: this.localUserConfiguration.contents,
				overrides: this.localUserConfiguration.overrides,
				keys: this.localUserConfiguration.keys,
				raw: Array.isArray(this.localUserConfiguration.raw) ? undefined : this.localUserConfiguration.raw
			},
			userRemote: {
				contents: this.remoteUserConfiguration.contents,
				overrides: this.remoteUserConfiguration.overrides,
				keys: this.remoteUserConfiguration.keys,
				raw: Array.isArray(this.remoteUserConfiguration.raw) ? undefined : this.remoteUserConfiguration.raw
			},
			workspace: {
				contents: this._workspaceConfiguration.contents,
				overrides: this._workspaceConfiguration.overrides,
				keys: this._workspaceConfiguration.keys
			},
			folders: [...this._folderConfigurations.keys()].reduce<[UriComponents, IConfigurationModel][]>((result, folder) => {
				const { contents, overrides, keys } = this._folderConfigurations.get(folder)!;
				result.push([folder, { contents, overrides, keys }]);
				return result;
			}, [])
		};
	}

	allKeys(): string[] {
		const keys: Set<string> = new Set<string>();
		this._defaultConfiguration.keys.forEach(key => keys.add(key));
		this.userConfiguration.keys.forEach(key => keys.add(key));
		this._workspaceConfiguration.keys.forEach(key => keys.add(key));
		this._folderConfigurations.forEach(folderConfiguration => folderConfiguration.keys.forEach(key => keys.add(key)));
		return [...keys.values()];
	}

	protected allOverrideIdentifiers(): string[] {
		const keys: Set<string> = new Set<string>();
		this._defaultConfiguration.getAllOverrideIdentifiers().forEach(key => keys.add(key));
		this.userConfiguration.getAllOverrideIdentifiers().forEach(key => keys.add(key));
		this._workspaceConfiguration.getAllOverrideIdentifiers().forEach(key => keys.add(key));
		this._folderConfigurations.forEach(folderConfiguration => folderConfiguration.getAllOverrideIdentifiers().forEach(key => keys.add(key)));
		return [...keys.values()];
	}

	protected getAllKeysForOverrideIdentifier(overrideIdentifier: string): string[] {
		const keys: Set<string> = new Set<string>();
		this._defaultConfiguration.getKeysForOverrideIdentifier(overrideIdentifier).forEach(key => keys.add(key));
		this.userConfiguration.getKeysForOverrideIdentifier(overrideIdentifier).forEach(key => keys.add(key));
		this._workspaceConfiguration.getKeysForOverrideIdentifier(overrideIdentifier).forEach(key => keys.add(key));
		this._folderConfigurations.forEach(folderConfiguration => folderConfiguration.getKeysForOverrideIdentifier(overrideIdentifier).forEach(key => keys.add(key)));
		return [...keys.values()];
	}

	static parse(data: IConfigurationData, logService: ILogService): Configuration {
		const defaultConfiguration = this.parseConfigurationModel(data.defaults, logService);
		const policyConfiguration = this.parseConfigurationModel(data.policy, logService);
		const applicationConfiguration = this.parseConfigurationModel(data.application, logService);
		const userLocalConfiguration = this.parseConfigurationModel(data.userLocal, logService);
		const userRemoteConfiguration = this.parseConfigurationModel(data.userRemote, logService);
		const workspaceConfiguration = this.parseConfigurationModel(data.workspace, logService);
		const folders: ResourceMap<ConfigurationModel> = data.folders.reduce((result, value) => {
			result.set(URI.revive(value[0]), this.parseConfigurationModel(value[1], logService));
			return result;
		}, new ResourceMap<ConfigurationModel>());
		return new Configuration(
			defaultConfiguration,
			policyConfiguration,
			applicationConfiguration,
			userLocalConfiguration,
			userRemoteConfiguration,
			workspaceConfiguration,
			folders,
			ConfigurationModel.createEmptyModel(logService),
			new ResourceMap<ConfigurationModel>(),
			logService
		);
	}

	private static parseConfigurationModel(model: IConfigurationModel, logService: ILogService): ConfigurationModel {
		return new ConfigurationModel(model.contents, model.keys, model.overrides, model.raw, logService);
	}

}

export function mergeChanges(...changes: IConfigurationChange[]): IConfigurationChange {
	if (changes.length === 0) {
		return { keys: [], overrides: [] };
	}
	if (changes.length === 1) {
		return changes[0];
	}
	const keysSet = new Set<string>();
	const overridesMap = new Map<string, Set<string>>();
	for (const change of changes) {
		change.keys.forEach(key => keysSet.add(key));
		change.overrides.forEach(([identifier, keys]) => {
			const result = getOrSet(overridesMap, identifier, new Set<string>());
			keys.forEach(key => result.add(key));
		});
	}
	const overrides: [string, string[]][] = [];
	overridesMap.forEach((keys, identifier) => overrides.push([identifier, [...keys.values()]]));
	return { keys: [...keysSet.values()], overrides };
}

export class ConfigurationChangeEvent implements IConfigurationChangeEvent {

	private readonly _marker = '\n';
	private readonly _markerCode1 = this._marker.charCodeAt(0);
	private readonly _markerCode2 = '.'.charCodeAt(0);
	private readonly _affectsConfigStr: string;

	readonly affectedKeys = new Set<string>();
	source!: ConfigurationTarget;

	constructor(
		readonly change: IConfigurationChange,
		private readonly previous: { workspace?: Workspace; data: IConfigurationData } | undefined,
		private readonly currentConfiguraiton: Configuration,
		private readonly currentWorkspace: Workspace | undefined,
		private readonly logService: ILogService
	) {
		for (const key of change.keys) {
			this.affectedKeys.add(key);
		}
		for (const [, keys] of change.overrides) {
			for (const key of keys) {
				this.affectedKeys.add(key);
			}
		}

		// Example: '\nfoo.bar\nabc.def\n'
		this._affectsConfigStr = this._marker;
		for (const key of this.affectedKeys) {
			this._affectsConfigStr += key + this._marker;
		}
	}

	private _previousConfiguration: Configuration | undefined = undefined;
	get previousConfiguration(): Configuration | undefined {
		if (!this._previousConfiguration && this.previous) {
			this._previousConfiguration = Configuration.parse(this.previous.data, this.logService);
		}
		return this._previousConfiguration;
	}

	affectsConfiguration(section: string, overrides?: IConfigurationOverrides): boolean {
		// we have one large string with all keys that have changed. we pad (marker) the section
		// and check that either find it padded or before a segment character
		const needle = this._marker + section;
		const idx = this._affectsConfigStr.indexOf(needle);
		if (idx < 0) {
			// NOT: (marker + section)
			return false;
		}
		const pos = idx + needle.length;
		if (pos >= this._affectsConfigStr.length) {
			return false;
		}
		const code = this._affectsConfigStr.charCodeAt(pos);
		if (code !== this._markerCode1 && code !== this._markerCode2) {
			// NOT: section + (marker | segment)
			return false;
		}
		if (overrides) {
			const value1 = this.previousConfiguration ? this.previousConfiguration.getValue(section, overrides, this.previous?.workspace) : undefined;
			const value2 = this.currentConfiguraiton.getValue(section, overrides, this.currentWorkspace);
			return !objects.equals(value1, value2);
		}
		return true;
	}
}

function compare(from: ConfigurationModel | undefined, to: ConfigurationModel | undefined): IConfigurationCompareResult {
	const { added, removed, updated } = compareConfigurationContents(to?.rawConfiguration, from?.rawConfiguration);
	const overrides: [string, string[]][] = [];

	const fromOverrideIdentifiers = from?.getAllOverrideIdentifiers() || [];
	const toOverrideIdentifiers = to?.getAllOverrideIdentifiers() || [];

	if (to) {
		const addedOverrideIdentifiers = toOverrideIdentifiers.filter(key => !fromOverrideIdentifiers.includes(key));
		for (const identifier of addedOverrideIdentifiers) {
			overrides.push([identifier, to.getKeysForOverrideIdentifier(identifier)]);
		}
	}

	if (from) {
		const removedOverrideIdentifiers = fromOverrideIdentifiers.filter(key => !toOverrideIdentifiers.includes(key));
		for (const identifier of removedOverrideIdentifiers) {
			overrides.push([identifier, from.getKeysForOverrideIdentifier(identifier)]);
		}
	}

	if (to && from) {
		for (const identifier of fromOverrideIdentifiers) {
			if (toOverrideIdentifiers.includes(identifier)) {
				const result = compareConfigurationContents({ contents: from.getOverrideValue(undefined, identifier) || {}, keys: from.getKeysForOverrideIdentifier(identifier) }, { contents: to.getOverrideValue(undefined, identifier) || {}, keys: to.getKeysForOverrideIdentifier(identifier) });
				overrides.push([identifier, [...result.added, ...result.removed, ...result.updated]]);
			}
		}
	}

	return { added, removed, updated, overrides };
}

function compareConfigurationContents(to: { keys: string[]; contents: IStringDictionary<unknown> } | undefined, from: { keys: string[]; contents: IStringDictionary<unknown> } | undefined) {
	const added = to
		? from ? to.keys.filter(key => from.keys.indexOf(key) === -1) : [...to.keys]
		: [];
	const removed = from
		? to ? from.keys.filter(key => to.keys.indexOf(key) === -1) : [...from.keys]
		: [];
	const updated: string[] = [];

	if (to && from) {
		for (const key of from.keys) {
			if (to.keys.indexOf(key) !== -1) {
				const value1 = getConfigurationValue(from.contents, key);
				const value2 = getConfigurationValue(to.contents, key);
				if (!objects.equals(value1, value2)) {
					updated.push(key);
				}
			}
		}
	}
	return { added, removed, updated };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/common/configurationRegistry.ts]---
Location: vscode-main/src/vs/platform/configuration/common/configurationRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../base/common/arrays.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import * as types from '../../../base/common/types.js';
import * as nls from '../../../nls.js';
import { getLanguageTagSettingPlainKey } from './configuration.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../jsonschemas/common/jsonContributionRegistry.js';
import { Registry } from '../../registry/common/platform.js';
import { IPolicy, PolicyName } from '../../../base/common/policy.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import product from '../../product/common/product.js';

export enum EditPresentationTypes {
	Multiline = 'multilineText',
	Singleline = 'singlelineText'
}

export const Extensions = {
	Configuration: 'base.contributions.configuration'
};

export interface IConfigurationDelta {
	removedDefaults?: IConfigurationDefaults[];
	removedConfigurations?: IConfigurationNode[];
	addedDefaults?: IConfigurationDefaults[];
	addedConfigurations?: IConfigurationNode[];
}

export interface IConfigurationRegistry {

	/**
	 * Register a configuration to the registry.
	 */
	registerConfiguration(configuration: IConfigurationNode): IConfigurationNode;

	/**
	 * Register multiple configurations to the registry.
	 */
	registerConfigurations(configurations: IConfigurationNode[], validate?: boolean): void;

	/**
	 * Deregister multiple configurations from the registry.
	 */
	deregisterConfigurations(configurations: IConfigurationNode[]): void;

	/**
	 * update the configuration registry by
	 * 	- registering the configurations to add
	 * 	- dereigstering the configurations to remove
	 */
	updateConfigurations(configurations: { add: IConfigurationNode[]; remove: IConfigurationNode[] }): void;

	/**
	 * Register multiple default configurations to the registry.
	 */
	registerDefaultConfigurations(defaultConfigurations: IConfigurationDefaults[]): void;

	/**
	 * Deregister multiple default configurations from the registry.
	 */
	deregisterDefaultConfigurations(defaultConfigurations: IConfigurationDefaults[]): void;

	/**
	 * Bulk update of the configuration registry (default and configurations, remove and add)
	 * @param delta
	 */
	deltaConfiguration(delta: IConfigurationDelta): void;

	/**
	 * Return the registered default configurations
	 */
	getRegisteredDefaultConfigurations(): IConfigurationDefaults[];

	/**
	 * Return the registered configuration defaults overrides
	 */
	getConfigurationDefaultsOverrides(): Map<string, IConfigurationDefaultOverrideValue>;

	/**
	 * Signal that the schema of a configuration setting has changes. It is currently only supported to change enumeration values.
	 * Property or default value changes are not allowed.
	 */
	notifyConfigurationSchemaUpdated(...configurations: IConfigurationNode[]): void;

	/**
	 * Event that fires whenever a configuration has been
	 * registered.
	 */
	readonly onDidSchemaChange: Event<void>;

	/**
	 * Event that fires whenever a configuration has been
	 * registered.
	 */
	readonly onDidUpdateConfiguration: Event<{ properties: ReadonlySet<string>; defaultsOverrides?: boolean }>;

	/**
	 * Returns all configuration nodes contributed to this registry.
	 */
	getConfigurations(): IConfigurationNode[];

	/**
	 * Returns all configurations settings of all configuration nodes contributed to this registry.
	 */
	getConfigurationProperties(): IStringDictionary<IRegisteredConfigurationPropertySchema>;

	/**
	 * Return all configurations by policy name
	 */
	getPolicyConfigurations(): Map<PolicyName, string>;

	/**
	 * Returns all excluded configurations settings of all configuration nodes contributed to this registry.
	 */
	getExcludedConfigurationProperties(): IStringDictionary<IRegisteredConfigurationPropertySchema>;

	/**
	 * Register the identifiers for editor configurations
	 */
	registerOverrideIdentifiers(identifiers: string[]): void;
}

export const enum ConfigurationScope {
	/**
	 * Application specific configuration, which can be configured only in default profile user settings.
	 */
	APPLICATION = 1,
	/**
	 * Machine specific configuration, which can be configured only in local and remote user settings.
	 */
	MACHINE,
	/**
	 * An application machine specific configuration, which can be configured only in default profile user settings and remote user settings.
	 */
	APPLICATION_MACHINE,
	/**
	 * Window specific configuration, which can be configured in the user or workspace settings.
	 */
	WINDOW,
	/**
	 * Resource specific configuration, which can be configured in the user, workspace or folder settings.
	 */
	RESOURCE,
	/**
	 * Resource specific configuration that can be configured in language specific settings
	 */
	LANGUAGE_OVERRIDABLE,
	/**
	 * Machine specific configuration that can also be configured in workspace or folder settings.
	 */
	MACHINE_OVERRIDABLE,
}


export interface IConfigurationPropertySchema extends IJSONSchema {

	scope?: ConfigurationScope;

	/**
	 * When restricted, value of this configuration will be read only from trusted sources.
	 * For eg., If the workspace is not trusted, then the value of this configuration is not read from workspace settings file.
	 */
	restricted?: boolean;

	/**
	 * When `false` this property is excluded from the registry. Default is to include.
	 */
	included?: boolean;

	/**
	 * List of tags associated to the property.
	 *  - A tag can be used for filtering
	 *  - Use `experimental` tag for marking the setting as experimental.
	 */
	tags?: string[];

	/**
	 * When enabled this setting is ignored during sync and user can override this.
	 */
	ignoreSync?: boolean;

	/**
	 * When enabled this setting is ignored during sync and user cannot override this.
	 */
	disallowSyncIgnore?: boolean;

	/**
	 * Disallow extensions to contribute configuration default value for this setting.
	 */
	disallowConfigurationDefault?: boolean;

	/**
	 * Labels for enumeration items
	 */
	enumItemLabels?: string[];

	/**
	 * When specified, controls the presentation format of string settings.
	 * Otherwise, the presentation format defaults to `singleline`.
	 */
	editPresentation?: EditPresentationTypes;

	/**
	 * When specified, gives an order number for the setting
	 * within the settings editor. Otherwise, the setting is placed at the end.
	 */
	order?: number;

	/**
	 * When specified, this setting's value can always be overwritten by
	 * a system-wide policy.
	 */
	policy?: IPolicy;

	/**
	 * When specified, this setting's default value can always be overwritten by
	 * an experiment.
	 */
	experiment?: {
		/**
		 * The mode of the experiment.
		 * - `startup`: The setting value is updated to the experiment value only on startup.
		 * - `auto`: The setting value is updated to the experiment value automatically (whenever the experiment value changes).
		 */
		mode: 'startup' | 'auto';

		/**
		 * The name of the experiment. By default, this is `config.${settingId}`
		 */
		name?: string;
	};
}

export interface IExtensionInfo {
	id: string;
	displayName?: string;
}

export interface IConfigurationNode {
	id?: string;
	order?: number;
	type?: string | string[];
	title?: string;
	description?: string;
	properties?: IStringDictionary<IConfigurationPropertySchema>;
	allOf?: IConfigurationNode[];
	scope?: ConfigurationScope;
	extensionInfo?: IExtensionInfo;
	restrictedProperties?: string[];
}

export type ConfigurationDefaultValueSource = IExtensionInfo | Map<string, IExtensionInfo>;

export interface IConfigurationDefaults {
	overrides: IStringDictionary<unknown>;
	source?: IExtensionInfo;
}

export type IRegisteredConfigurationPropertySchema = IConfigurationPropertySchema & {
	section?: {
		id?: string;
		title?: string;
		order?: number;
		extensionInfo?: IExtensionInfo;
	};
	defaultDefaultValue?: unknown;
	source?: IExtensionInfo; // Source of the Property
	defaultValueSource?: ConfigurationDefaultValueSource; // Source of the Default Value
};

export interface IConfigurationDefaultOverride {
	readonly value: unknown;
	readonly source?: IExtensionInfo;  // Source of the default override
}

export interface IConfigurationDefaultOverrideValue {
	readonly value: unknown;
	readonly source?: ConfigurationDefaultValueSource;
}

export const allSettings: { properties: IStringDictionary<IConfigurationPropertySchema>; patternProperties: IStringDictionary<IConfigurationPropertySchema> } = { properties: {}, patternProperties: {} };
export const applicationSettings: { properties: IStringDictionary<IConfigurationPropertySchema>; patternProperties: IStringDictionary<IConfigurationPropertySchema> } = { properties: {}, patternProperties: {} };
export const applicationMachineSettings: { properties: IStringDictionary<IConfigurationPropertySchema>; patternProperties: IStringDictionary<IConfigurationPropertySchema> } = { properties: {}, patternProperties: {} };
export const machineSettings: { properties: IStringDictionary<IConfigurationPropertySchema>; patternProperties: IStringDictionary<IConfigurationPropertySchema> } = { properties: {}, patternProperties: {} };
export const machineOverridableSettings: { properties: IStringDictionary<IConfigurationPropertySchema>; patternProperties: IStringDictionary<IConfigurationPropertySchema> } = { properties: {}, patternProperties: {} };
export const windowSettings: { properties: IStringDictionary<IConfigurationPropertySchema>; patternProperties: IStringDictionary<IConfigurationPropertySchema> } = { properties: {}, patternProperties: {} };
export const resourceSettings: { properties: IStringDictionary<IConfigurationPropertySchema>; patternProperties: IStringDictionary<IConfigurationPropertySchema> } = { properties: {}, patternProperties: {} };

export const resourceLanguageSettingsSchemaId = 'vscode://schemas/settings/resourceLanguage';
export const configurationDefaultsSchemaId = 'vscode://schemas/settings/configurationDefaults';

const contributionRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);

class ConfigurationRegistry extends Disposable implements IConfigurationRegistry {

	private readonly registeredConfigurationDefaults: IConfigurationDefaults[] = [];
	private readonly configurationDefaultsOverrides: Map<string, { configurationDefaultOverrides: IConfigurationDefaultOverride[]; configurationDefaultOverrideValue?: IConfigurationDefaultOverrideValue }>;
	private readonly defaultLanguageConfigurationOverridesNode: IConfigurationNode;
	private readonly configurationContributors: IConfigurationNode[];
	private readonly configurationProperties: IStringDictionary<IRegisteredConfigurationPropertySchema>;
	private readonly policyConfigurations: Map<PolicyName, string>;
	private readonly excludedConfigurationProperties: IStringDictionary<IRegisteredConfigurationPropertySchema>;
	private readonly resourceLanguageSettingsSchema: IJSONSchema;
	private readonly overrideIdentifiers = new Set<string>();

	private readonly _onDidSchemaChange = this._register(new Emitter<void>());
	readonly onDidSchemaChange: Event<void> = this._onDidSchemaChange.event;

	private readonly _onDidUpdateConfiguration = this._register(new Emitter<{ properties: ReadonlySet<string>; defaultsOverrides?: boolean }>());
	readonly onDidUpdateConfiguration = this._onDidUpdateConfiguration.event;

	constructor() {
		super();
		this.configurationDefaultsOverrides = new Map();
		this.defaultLanguageConfigurationOverridesNode = {
			id: 'defaultOverrides',
			title: nls.localize('defaultLanguageConfigurationOverrides.title', "Default Language Configuration Overrides"),
			properties: {}
		};
		this.configurationContributors = [this.defaultLanguageConfigurationOverridesNode];
		this.resourceLanguageSettingsSchema = {
			properties: {},
			patternProperties: {},
			additionalProperties: true,
			allowTrailingCommas: true,
			allowComments: true
		};
		this.configurationProperties = {};
		this.policyConfigurations = new Map<PolicyName, string>();
		this.excludedConfigurationProperties = {};

		contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
		this.registerOverridePropertyPatternKey();
	}

	public registerConfiguration(configuration: IConfigurationNode, validate: boolean = true): IConfigurationNode {
		this.registerConfigurations([configuration], validate);
		return configuration;
	}

	public registerConfigurations(configurations: IConfigurationNode[], validate: boolean = true): void {
		const properties = new Set<string>();
		this.doRegisterConfigurations(configurations, validate, properties);

		contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
		this._onDidSchemaChange.fire();
		this._onDidUpdateConfiguration.fire({ properties });
	}

	public deregisterConfigurations(configurations: IConfigurationNode[]): void {
		const properties = new Set<string>();
		this.doDeregisterConfigurations(configurations, properties);

		contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
		this._onDidSchemaChange.fire();
		this._onDidUpdateConfiguration.fire({ properties });
	}

	public updateConfigurations({ add, remove }: { add: IConfigurationNode[]; remove: IConfigurationNode[] }): void {
		const properties = new Set<string>();
		this.doDeregisterConfigurations(remove, properties);
		this.doRegisterConfigurations(add, false, properties);

		contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
		this._onDidSchemaChange.fire();
		this._onDidUpdateConfiguration.fire({ properties });
	}

	public registerDefaultConfigurations(configurationDefaults: IConfigurationDefaults[]): void {
		const properties = new Set<string>();
		this.doRegisterDefaultConfigurations(configurationDefaults, properties);
		this._onDidSchemaChange.fire();
		this._onDidUpdateConfiguration.fire({ properties, defaultsOverrides: true });
	}

	private doRegisterDefaultConfigurations(configurationDefaults: IConfigurationDefaults[], bucket: Set<string>) {

		this.registeredConfigurationDefaults.push(...configurationDefaults);

		const overrideIdentifiers: string[] = [];

		for (const { overrides, source } of configurationDefaults) {
			for (const key in overrides) {
				bucket.add(key);

				const configurationDefaultOverridesForKey = this.configurationDefaultsOverrides.get(key)
					?? this.configurationDefaultsOverrides.set(key, { configurationDefaultOverrides: [] }).get(key)!;

				const value = overrides[key];
				configurationDefaultOverridesForKey.configurationDefaultOverrides.push({ value, source });

				// Configuration defaults for Override Identifiers
				if (OVERRIDE_PROPERTY_REGEX.test(key)) {
					const newDefaultOverride = this.mergeDefaultConfigurationsForOverrideIdentifier(key, value as IStringDictionary<unknown>, source, configurationDefaultOverridesForKey.configurationDefaultOverrideValue);
					if (!newDefaultOverride) {
						continue;
					}

					configurationDefaultOverridesForKey.configurationDefaultOverrideValue = newDefaultOverride;
					this.updateDefaultOverrideProperty(key, newDefaultOverride, source);
					overrideIdentifiers.push(...overrideIdentifiersFromKey(key));
				}

				// Configuration defaults for Configuration Properties
				else {
					const newDefaultOverride = this.mergeDefaultConfigurationsForConfigurationProperty(key, value, source, configurationDefaultOverridesForKey.configurationDefaultOverrideValue);
					if (!newDefaultOverride) {
						continue;
					}

					configurationDefaultOverridesForKey.configurationDefaultOverrideValue = newDefaultOverride;
					const property = this.configurationProperties[key];
					if (property) {
						this.updatePropertyDefaultValue(key, property);
						this.updateSchema(key, property);
					}
				}

			}
		}

		this.doRegisterOverrideIdentifiers(overrideIdentifiers);
	}

	public deregisterDefaultConfigurations(defaultConfigurations: IConfigurationDefaults[]): void {
		const properties = new Set<string>();
		this.doDeregisterDefaultConfigurations(defaultConfigurations, properties);
		this._onDidSchemaChange.fire();
		this._onDidUpdateConfiguration.fire({ properties, defaultsOverrides: true });
	}

	private doDeregisterDefaultConfigurations(defaultConfigurations: IConfigurationDefaults[], bucket: Set<string>): void {
		for (const defaultConfiguration of defaultConfigurations) {
			const index = this.registeredConfigurationDefaults.indexOf(defaultConfiguration);
			if (index !== -1) {
				this.registeredConfigurationDefaults.splice(index, 1);
			}
		}

		for (const { overrides, source } of defaultConfigurations) {
			for (const key in overrides) {
				const configurationDefaultOverridesForKey = this.configurationDefaultsOverrides.get(key);
				if (!configurationDefaultOverridesForKey) {
					continue;
				}

				const index = configurationDefaultOverridesForKey.configurationDefaultOverrides
					.findIndex(configurationDefaultOverride => source ? configurationDefaultOverride.source?.id === source.id : configurationDefaultOverride.value === overrides[key]);
				if (index === -1) {
					continue;
				}

				configurationDefaultOverridesForKey.configurationDefaultOverrides.splice(index, 1);
				if (configurationDefaultOverridesForKey.configurationDefaultOverrides.length === 0) {
					this.configurationDefaultsOverrides.delete(key);
				}

				if (OVERRIDE_PROPERTY_REGEX.test(key)) {
					let configurationDefaultOverrideValue: IConfigurationDefaultOverrideValue | undefined;
					for (const configurationDefaultOverride of configurationDefaultOverridesForKey.configurationDefaultOverrides) {
						configurationDefaultOverrideValue = this.mergeDefaultConfigurationsForOverrideIdentifier(key, configurationDefaultOverride.value as IStringDictionary<unknown>, configurationDefaultOverride.source, configurationDefaultOverrideValue);
					}
					if (configurationDefaultOverrideValue && !types.isEmptyObject(configurationDefaultOverrideValue.value)) {
						configurationDefaultOverridesForKey.configurationDefaultOverrideValue = configurationDefaultOverrideValue;
						this.updateDefaultOverrideProperty(key, configurationDefaultOverrideValue, source);
					} else {
						this.configurationDefaultsOverrides.delete(key);
						delete this.configurationProperties[key];
						delete this.defaultLanguageConfigurationOverridesNode.properties![key];
					}
				} else {
					let configurationDefaultOverrideValue: IConfigurationDefaultOverrideValue | undefined;
					for (const configurationDefaultOverride of configurationDefaultOverridesForKey.configurationDefaultOverrides) {
						configurationDefaultOverrideValue = this.mergeDefaultConfigurationsForConfigurationProperty(key, configurationDefaultOverride.value, configurationDefaultOverride.source, configurationDefaultOverrideValue);
					}
					configurationDefaultOverridesForKey.configurationDefaultOverrideValue = configurationDefaultOverrideValue;
					const property = this.configurationProperties[key];
					if (property) {
						this.updatePropertyDefaultValue(key, property);
						this.updateSchema(key, property);
					}
				}
				bucket.add(key);
			}
		}
		this.updateOverridePropertyPatternKey();
	}

	private updateDefaultOverrideProperty(key: string, newDefaultOverride: IConfigurationDefaultOverrideValue, source: IExtensionInfo | undefined): void {
		const property: IRegisteredConfigurationPropertySchema = {
			section: {
				id: this.defaultLanguageConfigurationOverridesNode.id,
				title: this.defaultLanguageConfigurationOverridesNode.title,
				order: this.defaultLanguageConfigurationOverridesNode.order,
				extensionInfo: this.defaultLanguageConfigurationOverridesNode.extensionInfo
			},
			type: 'object',
			default: newDefaultOverride.value,
			description: nls.localize('defaultLanguageConfiguration.description', "Configure settings to be overridden for {0}.", getLanguageTagSettingPlainKey(key)),
			$ref: resourceLanguageSettingsSchemaId,
			defaultDefaultValue: newDefaultOverride.value,
			source,
			defaultValueSource: source
		};
		this.configurationProperties[key] = property;
		this.defaultLanguageConfigurationOverridesNode.properties![key] = property;
	}

	private mergeDefaultConfigurationsForOverrideIdentifier(overrideIdentifier: string, configurationValueObject: IStringDictionary<unknown>, valueSource: IExtensionInfo | undefined, existingDefaultOverride: IConfigurationDefaultOverrideValue | undefined): IConfigurationDefaultOverrideValue | undefined {
		const defaultValue = existingDefaultOverride?.value || {};
		const source = existingDefaultOverride?.source ?? new Map<string, IExtensionInfo>();

		// This should not happen
		if (!(source instanceof Map)) {
			console.error('objectConfigurationSources is not a Map');
			return undefined;
		}

		for (const propertyKey of Object.keys(configurationValueObject)) {
			const propertyDefaultValue = configurationValueObject[propertyKey];

			const isObjectSetting = types.isObject(propertyDefaultValue) &&
				(types.isUndefined((defaultValue as IStringDictionary<unknown>)[propertyKey]) || types.isObject((defaultValue as IStringDictionary<unknown>)[propertyKey]));

			// If the default value is an object, merge the objects and store the source of each keys
			if (isObjectSetting) {
				(defaultValue as IStringDictionary<unknown>)[propertyKey] = { ...((defaultValue as IStringDictionary<unknown>)[propertyKey] ?? {}), ...propertyDefaultValue };
				// Track the source of each value in the object
				if (valueSource) {
					for (const objectKey in propertyDefaultValue) {
						source.set(`${propertyKey}.${objectKey}`, valueSource);
					}
				}
			}

			// Primitive values are overridden
			else {
				(defaultValue as IStringDictionary<unknown>)[propertyKey] = propertyDefaultValue;
				if (valueSource) {
					source.set(propertyKey, valueSource);
				} else {
					source.delete(propertyKey);
				}
			}
		}

		return { value: defaultValue, source };
	}

	private mergeDefaultConfigurationsForConfigurationProperty(propertyKey: string, value: unknown, valuesSource: IExtensionInfo | undefined, existingDefaultOverride: IConfigurationDefaultOverrideValue | undefined): IConfigurationDefaultOverrideValue | undefined {
		const property = this.configurationProperties[propertyKey];
		const existingDefaultValue = existingDefaultOverride?.value ?? property?.defaultDefaultValue;
		let source: ConfigurationDefaultValueSource | undefined = valuesSource;

		const isObjectSetting = types.isObject(value) &&
			(
				property !== undefined && property.type === 'object' ||
				property === undefined && (types.isUndefined(existingDefaultValue) || types.isObject(existingDefaultValue))
			);

		// If the default value is an object, merge the objects and store the source of each keys
		if (isObjectSetting) {
			source = existingDefaultOverride?.source ?? new Map<string, IExtensionInfo>();

			// This should not happen
			if (!(source instanceof Map)) {
				console.error('defaultValueSource is not a Map');
				return undefined;
			}

			for (const objectKey in (value as IStringDictionary<unknown>)) {
				if (valuesSource) {
					source.set(`${propertyKey}.${objectKey}`, valuesSource);
				}
			}
			value = { ...(types.isObject(existingDefaultValue) ? existingDefaultValue : {}), ...(value as IStringDictionary<unknown>) };
		}

		return { value, source };
	}

	public deltaConfiguration(delta: IConfigurationDelta): void {
		// defaults: remove
		let defaultsOverrides = false;
		const properties = new Set<string>();
		if (delta.removedDefaults) {
			this.doDeregisterDefaultConfigurations(delta.removedDefaults, properties);
			defaultsOverrides = true;
		}
		// defaults: add
		if (delta.addedDefaults) {
			this.doRegisterDefaultConfigurations(delta.addedDefaults, properties);
			defaultsOverrides = true;
		}
		// configurations: remove
		if (delta.removedConfigurations) {
			this.doDeregisterConfigurations(delta.removedConfigurations, properties);
		}
		// configurations: add
		if (delta.addedConfigurations) {
			this.doRegisterConfigurations(delta.addedConfigurations, false, properties);
		}
		this._onDidSchemaChange.fire();
		this._onDidUpdateConfiguration.fire({ properties, defaultsOverrides });
	}

	public notifyConfigurationSchemaUpdated(...configurations: IConfigurationNode[]) {
		this._onDidSchemaChange.fire();
	}

	public registerOverrideIdentifiers(overrideIdentifiers: string[]): void {
		this.doRegisterOverrideIdentifiers(overrideIdentifiers);
		this._onDidSchemaChange.fire();
	}

	private doRegisterOverrideIdentifiers(overrideIdentifiers: string[]) {
		for (const overrideIdentifier of overrideIdentifiers) {
			this.overrideIdentifiers.add(overrideIdentifier);
		}
		this.updateOverridePropertyPatternKey();
	}

	private doRegisterConfigurations(configurations: IConfigurationNode[], validate: boolean, bucket: Set<string>): void {

		configurations.forEach(configuration => {

			this.validateAndRegisterProperties(configuration, validate, configuration.extensionInfo, configuration.restrictedProperties, undefined, bucket);

			this.configurationContributors.push(configuration);
			this.registerJSONConfiguration(configuration);
		});
	}

	private doDeregisterConfigurations(configurations: IConfigurationNode[], bucket: Set<string>): void {

		const deregisterConfiguration = (configuration: IConfigurationNode) => {
			if (configuration.properties) {
				for (const key in configuration.properties) {
					bucket.add(key);
					const property = this.configurationProperties[key];
					if (property?.policy?.name) {
						this.policyConfigurations.delete(property.policy.name);
					}
					delete this.configurationProperties[key];
					this.removeFromSchema(key, configuration.properties[key]);
				}
			}
			configuration.allOf?.forEach(node => deregisterConfiguration(node));
		};
		for (const configuration of configurations) {
			deregisterConfiguration(configuration);
			const index = this.configurationContributors.indexOf(configuration);
			if (index !== -1) {
				this.configurationContributors.splice(index, 1);
			}
		}
	}

	private validateAndRegisterProperties(configuration: IConfigurationNode, validate: boolean = true, extensionInfo: IExtensionInfo | undefined, restrictedProperties: string[] | undefined, scope: ConfigurationScope = ConfigurationScope.WINDOW, bucket: Set<string>): void {
		scope = types.isUndefinedOrNull(configuration.scope) ? scope : configuration.scope;
		const properties = configuration.properties;
		if (properties) {
			for (const key in properties) {
				const property: IRegisteredConfigurationPropertySchema = properties[key];
				property.section = {
					id: configuration.id,
					title: configuration.title,
					order: configuration.order,
					extensionInfo: configuration.extensionInfo
				};
				if (validate && validateProperty(key, property, extensionInfo?.id)) {
					delete properties[key];
					continue;
				}

				property.source = extensionInfo;

				// update default value
				property.defaultDefaultValue = properties[key].default;
				this.updatePropertyDefaultValue(key, property);

				// update scope
				if (OVERRIDE_PROPERTY_REGEX.test(key)) {
					property.scope = undefined; // No scope for overridable properties `[${identifier}]`
				} else {
					property.scope = types.isUndefinedOrNull(property.scope) ? scope : property.scope;
					property.restricted = types.isUndefinedOrNull(property.restricted) ? !!restrictedProperties?.includes(key) : property.restricted;
				}

				if (property.experiment) {
					if (!property.tags?.some(tag => tag.toLowerCase() === 'onexp')) {
						property.tags = property.tags ?? [];
						property.tags.push('onExP');
					}
				} else if (property.tags?.some(tag => tag.toLowerCase() === 'onexp')) {
					console.error(`Invalid tag 'onExP' found for property '${key}'. Please use 'experiment' property instead.`);
					property.experiment = { mode: 'startup' };
				}

				const excluded = properties[key].hasOwnProperty('included') && !properties[key].included;
				const policyName = properties[key].policy?.name;

				if (excluded) {
					this.excludedConfigurationProperties[key] = properties[key];
					if (policyName) {
						this.policyConfigurations.set(policyName, key);
						bucket.add(key);
					}
					delete properties[key];
				} else {
					bucket.add(key);
					if (policyName) {
						this.policyConfigurations.set(policyName, key);
					}
					this.configurationProperties[key] = properties[key];
					if (!properties[key].deprecationMessage && properties[key].markdownDeprecationMessage) {
						// If not set, default deprecationMessage to the markdown source
						properties[key].deprecationMessage = properties[key].markdownDeprecationMessage;
					}
				}


			}
		}
		const subNodes = configuration.allOf;
		if (subNodes) {
			for (const node of subNodes) {
				this.validateAndRegisterProperties(node, validate, extensionInfo, restrictedProperties, scope, bucket);
			}
		}
	}

	// Only for tests
	getConfigurations(): IConfigurationNode[] {
		return this.configurationContributors;
	}

	getConfigurationProperties(): IStringDictionary<IRegisteredConfigurationPropertySchema> {
		return this.configurationProperties;
	}

	getPolicyConfigurations(): Map<PolicyName, string> {
		return this.policyConfigurations;
	}

	getExcludedConfigurationProperties(): IStringDictionary<IRegisteredConfigurationPropertySchema> {
		return this.excludedConfigurationProperties;
	}

	getRegisteredDefaultConfigurations(): IConfigurationDefaults[] {
		return [...this.registeredConfigurationDefaults];
	}

	getConfigurationDefaultsOverrides(): Map<string, IConfigurationDefaultOverrideValue> {
		const configurationDefaultsOverrides = new Map<string, IConfigurationDefaultOverrideValue>();
		for (const [key, value] of this.configurationDefaultsOverrides) {
			if (value.configurationDefaultOverrideValue) {
				configurationDefaultsOverrides.set(key, value.configurationDefaultOverrideValue);
			}
		}
		return configurationDefaultsOverrides;
	}

	private registerJSONConfiguration(configuration: IConfigurationNode) {
		const register = (configuration: IConfigurationNode) => {
			const properties = configuration.properties;
			if (properties) {
				for (const key in properties) {
					this.updateSchema(key, properties[key]);
				}
			}
			const subNodes = configuration.allOf;
			subNodes?.forEach(register);
		};
		register(configuration);
	}

	private updateSchema(key: string, property: IConfigurationPropertySchema): void {
		allSettings.properties[key] = property;
		switch (property.scope) {
			case ConfigurationScope.APPLICATION:
				applicationSettings.properties[key] = property;
				break;
			case ConfigurationScope.MACHINE:
				machineSettings.properties[key] = property;
				break;
			case ConfigurationScope.APPLICATION_MACHINE:
				applicationMachineSettings.properties[key] = property;
				break;
			case ConfigurationScope.MACHINE_OVERRIDABLE:
				machineOverridableSettings.properties[key] = property;
				break;
			case ConfigurationScope.WINDOW:
				windowSettings.properties[key] = property;
				break;
			case ConfigurationScope.RESOURCE:
				resourceSettings.properties[key] = property;
				break;
			case ConfigurationScope.LANGUAGE_OVERRIDABLE:
				resourceSettings.properties[key] = property;
				this.resourceLanguageSettingsSchema.properties![key] = property;
				break;
		}
	}

	private removeFromSchema(key: string, property: IConfigurationPropertySchema): void {
		delete allSettings.properties[key];
		switch (property.scope) {
			case ConfigurationScope.APPLICATION:
				delete applicationSettings.properties[key];
				break;
			case ConfigurationScope.MACHINE:
				delete machineSettings.properties[key];
				break;
			case ConfigurationScope.APPLICATION_MACHINE:
				delete applicationMachineSettings.properties[key];
				break;
			case ConfigurationScope.MACHINE_OVERRIDABLE:
				delete machineOverridableSettings.properties[key];
				break;
			case ConfigurationScope.WINDOW:
				delete windowSettings.properties[key];
				break;
			case ConfigurationScope.RESOURCE:
			case ConfigurationScope.LANGUAGE_OVERRIDABLE:
				delete resourceSettings.properties[key];
				delete this.resourceLanguageSettingsSchema.properties![key];
				break;
		}
	}

	private updateOverridePropertyPatternKey(): void {
		for (const overrideIdentifier of this.overrideIdentifiers.values()) {
			const overrideIdentifierProperty = `[${overrideIdentifier}]`;
			const resourceLanguagePropertiesSchema: IJSONSchema = {
				type: 'object',
				description: nls.localize('overrideSettings.defaultDescription', "Configure editor settings to be overridden for a language."),
				errorMessage: nls.localize('overrideSettings.errorMessage', "This setting does not support per-language configuration."),
				$ref: resourceLanguageSettingsSchemaId,
			};
			this.updatePropertyDefaultValue(overrideIdentifierProperty, resourceLanguagePropertiesSchema);
			allSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
			applicationSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
			applicationMachineSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
			machineSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
			machineOverridableSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
			windowSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
			resourceSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
		}
	}

	private registerOverridePropertyPatternKey(): void {
		const resourceLanguagePropertiesSchema: IJSONSchema = {
			type: 'object',
			description: nls.localize('overrideSettings.defaultDescription', "Configure editor settings to be overridden for a language."),
			errorMessage: nls.localize('overrideSettings.errorMessage', "This setting does not support per-language configuration."),
			$ref: resourceLanguageSettingsSchemaId,
		};
		allSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
		applicationSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
		applicationMachineSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
		machineSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
		machineOverridableSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
		windowSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
		resourceSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
		this._onDidSchemaChange.fire();
	}

	private updatePropertyDefaultValue(key: string, property: IRegisteredConfigurationPropertySchema): void {
		const configurationdefaultOverride = this.configurationDefaultsOverrides.get(key)?.configurationDefaultOverrideValue;
		let defaultValue = undefined;
		let defaultSource = undefined;
		if (configurationdefaultOverride
			&& (!property.disallowConfigurationDefault || !configurationdefaultOverride.source) // Prevent overriding the default value if the property is disallowed to be overridden by configuration defaults from extensions
		) {
			defaultValue = configurationdefaultOverride.value;
			defaultSource = configurationdefaultOverride.source;
		}
		if (types.isUndefined(defaultValue)) {
			defaultValue = property.defaultDefaultValue;
			defaultSource = undefined;
		}
		if (types.isUndefined(defaultValue)) {
			defaultValue = getDefaultValue(property.type);
		}
		property.default = defaultValue;
		property.defaultValueSource = defaultSource;
	}
}

const OVERRIDE_IDENTIFIER_PATTERN = `\\[([^\\]]+)\\]`;
const OVERRIDE_IDENTIFIER_REGEX = new RegExp(OVERRIDE_IDENTIFIER_PATTERN, 'g');
export const OVERRIDE_PROPERTY_PATTERN = `^(${OVERRIDE_IDENTIFIER_PATTERN})+$`;
export const OVERRIDE_PROPERTY_REGEX = new RegExp(OVERRIDE_PROPERTY_PATTERN);

export function overrideIdentifiersFromKey(key: string): string[] {
	const identifiers: string[] = [];
	if (OVERRIDE_PROPERTY_REGEX.test(key)) {
		let matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
		while (matches?.length) {
			const identifier = matches[1].trim();
			if (identifier) {
				identifiers.push(identifier);
			}
			matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
		}
	}
	return distinct(identifiers);
}

export function keyFromOverrideIdentifiers(overrideIdentifiers: string[]): string {
	return overrideIdentifiers.reduce((result, overrideIdentifier) => `${result}[${overrideIdentifier}]`, '');
}

export function getDefaultValue(type: string | string[] | undefined) {
	const t = Array.isArray(type) ? type[0] : <string>type;
	switch (t) {
		case 'boolean':
			return false;
		case 'integer':
		case 'number':
			return 0;
		case 'string':
			return '';
		case 'array':
			return [];
		case 'object':
			return {};
		default:
			return null;
	}
}

const configurationRegistry = new ConfigurationRegistry();
Registry.add(Extensions.Configuration, configurationRegistry);

export function validateProperty(property: string, schema: IRegisteredConfigurationPropertySchema, extensionId?: string): string | null {
	if (!property.trim()) {
		return nls.localize('config.property.empty', "Cannot register an empty property");
	}
	if (OVERRIDE_PROPERTY_REGEX.test(property)) {
		return nls.localize('config.property.languageDefault', "Cannot register '{0}'. This matches property pattern '\\\\[.*\\\\]$' for describing language specific editor settings. Use 'configurationDefaults' contribution.", property);
	}
	if (configurationRegistry.getConfigurationProperties()[property] !== undefined && (!extensionId || !EXTENSION_UNIFICATION_EXTENSION_IDS.has(extensionId.toLowerCase()))) {
		return nls.localize('config.property.duplicate', "Cannot register '{0}'. This property is already registered.", property);
	}
	if (schema.policy?.name && configurationRegistry.getPolicyConfigurations().get(schema.policy?.name) !== undefined) {
		return nls.localize('config.policy.duplicate', "Cannot register '{0}'. The associated policy {1} is already registered with {2}.", property, schema.policy?.name, configurationRegistry.getPolicyConfigurations().get(schema.policy?.name));
	}
	return null;
}

export function getScopes(): [string, ConfigurationScope | undefined][] {
	const scopes: [string, ConfigurationScope | undefined][] = [];
	const configurationProperties = configurationRegistry.getConfigurationProperties();
	for (const key of Object.keys(configurationProperties)) {
		scopes.push([key, configurationProperties[key].scope]);
	}
	scopes.push(['launch', ConfigurationScope.RESOURCE]);
	scopes.push(['task', ConfigurationScope.RESOURCE]);
	return scopes;
}

export function getAllConfigurationProperties(configurationNode: IConfigurationNode[]): IStringDictionary<IRegisteredConfigurationPropertySchema> {
	const result: IStringDictionary<IRegisteredConfigurationPropertySchema> = {};
	for (const configuration of configurationNode) {
		const properties = configuration.properties;
		if (types.isObject(properties)) {
			for (const key in properties) {
				result[key] = properties[key];
			}
		}
		if (configuration.allOf) {
			Object.assign(result, getAllConfigurationProperties(configuration.allOf));
		}
	}
	return result;
}

export function parseScope(scope: string): ConfigurationScope {
	switch (scope) {
		case 'application':
			return ConfigurationScope.APPLICATION;
		case 'machine':
			return ConfigurationScope.MACHINE;
		case 'resource':
			return ConfigurationScope.RESOURCE;
		case 'machine-overridable':
			return ConfigurationScope.MACHINE_OVERRIDABLE;
		case 'language-overridable':
			return ConfigurationScope.LANGUAGE_OVERRIDABLE;
		default:
			return ConfigurationScope.WINDOW;
	}
}

// Used for extension unification. Should be removed when complete.
export const EXTENSION_UNIFICATION_EXTENSION_IDS: Set<string> = new Set(product.defaultChatAgent ? [product.defaultChatAgent.extensionId, product.defaultChatAgent.chatExtensionId].map(id => id.toLowerCase()) : []);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/common/configurations.ts]---
Location: vscode-main/src/vs/platform/configuration/common/configurations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../base/common/arrays.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { deepClone, equals } from '../../../base/common/objects.js';
import { isEmptyObject, isString } from '../../../base/common/types.js';
import { ConfigurationModel } from './configurationModels.js';
import { Extensions, IConfigurationRegistry, IRegisteredConfigurationPropertySchema } from './configurationRegistry.js';
import { ILogService, NullLogService } from '../../log/common/log.js';
import { IPolicyService, PolicyDefinition, PolicyValue } from '../../policy/common/policy.js';
import { Registry } from '../../registry/common/platform.js';
import { getErrorMessage } from '../../../base/common/errors.js';
import * as json from '../../../base/common/json.js';
import { PolicyName } from '../../../base/common/policy.js';

export class DefaultConfiguration extends Disposable {

	private readonly _onDidChangeConfiguration = this._register(new Emitter<{ defaults: ConfigurationModel; properties: string[] }>());
	readonly onDidChangeConfiguration = this._onDidChangeConfiguration.event;

	private _configurationModel: ConfigurationModel;
	get configurationModel(): ConfigurationModel {
		return this._configurationModel;
	}

	constructor(private readonly logService: ILogService) {
		super();
		this._configurationModel = ConfigurationModel.createEmptyModel(logService);
	}

	async initialize(): Promise<ConfigurationModel> {
		this.resetConfigurationModel();
		this._register(Registry.as<IConfigurationRegistry>(Extensions.Configuration).onDidUpdateConfiguration(({ properties, defaultsOverrides }) => this.onDidUpdateConfiguration(Array.from(properties), defaultsOverrides)));
		return this.configurationModel;
	}

	reload(): ConfigurationModel {
		this.resetConfigurationModel();
		return this.configurationModel;
	}

	protected onDidUpdateConfiguration(properties: string[], defaultsOverrides?: boolean): void {
		this.updateConfigurationModel(properties, Registry.as<IConfigurationRegistry>(Extensions.Configuration).getConfigurationProperties());
		this._onDidChangeConfiguration.fire({ defaults: this.configurationModel, properties });
	}

	protected getConfigurationDefaultOverrides(): IStringDictionary<unknown> {
		return {};
	}

	private resetConfigurationModel(): void {
		this._configurationModel = ConfigurationModel.createEmptyModel(this.logService);
		const properties = Registry.as<IConfigurationRegistry>(Extensions.Configuration).getConfigurationProperties();
		this.updateConfigurationModel(Object.keys(properties), properties);
	}

	private updateConfigurationModel(properties: string[], configurationProperties: IStringDictionary<IRegisteredConfigurationPropertySchema>): void {
		const configurationDefaultsOverrides = this.getConfigurationDefaultOverrides();
		for (const key of properties) {
			const defaultOverrideValue = configurationDefaultsOverrides[key];
			const propertySchema = configurationProperties[key];
			if (defaultOverrideValue !== undefined) {
				this._configurationModel.setValue(key, defaultOverrideValue);
			} else if (propertySchema) {
				this._configurationModel.setValue(key, deepClone(propertySchema.default));
			} else {
				this._configurationModel.removeValue(key);
			}
		}
	}

}

export interface IPolicyConfiguration {
	readonly onDidChangeConfiguration: Event<ConfigurationModel>;
	readonly configurationModel: ConfigurationModel;
	initialize(): Promise<ConfigurationModel>;
}

export class NullPolicyConfiguration implements IPolicyConfiguration {
	readonly onDidChangeConfiguration = Event.None;
	readonly configurationModel = ConfigurationModel.createEmptyModel(new NullLogService());
	async initialize() { return this.configurationModel; }
}

type ParsedType = IStringDictionary<unknown> | Array<unknown>;

export class PolicyConfiguration extends Disposable implements IPolicyConfiguration {

	private readonly _onDidChangeConfiguration = this._register(new Emitter<ConfigurationModel>());
	readonly onDidChangeConfiguration = this._onDidChangeConfiguration.event;

	private readonly configurationRegistry: IConfigurationRegistry;

	private _configurationModel: ConfigurationModel;
	get configurationModel() { return this._configurationModel; }

	constructor(
		private readonly defaultConfiguration: DefaultConfiguration,
		@IPolicyService private readonly policyService: IPolicyService,
		@ILogService private readonly logService: ILogService
	) {
		super();
		this._configurationModel = ConfigurationModel.createEmptyModel(this.logService);
		this.configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
	}

	async initialize(): Promise<ConfigurationModel> {
		this.logService.trace('PolicyConfiguration#initialize');

		this.update(await this.updatePolicyDefinitions(this.defaultConfiguration.configurationModel.keys), false);
		this.update(await this.updatePolicyDefinitions(Object.keys(this.configurationRegistry.getExcludedConfigurationProperties())), false);
		this._register(this.policyService.onDidChange(policyNames => this.onDidChangePolicies(policyNames)));
		this._register(this.defaultConfiguration.onDidChangeConfiguration(async ({ properties }) => this.update(await this.updatePolicyDefinitions(properties), true)));
		return this._configurationModel;
	}

	private async updatePolicyDefinitions(properties: string[]): Promise<string[]> {
		this.logService.trace('PolicyConfiguration#updatePolicyDefinitions', properties);
		const policyDefinitions: IStringDictionary<PolicyDefinition> = {};
		const keys: string[] = [];
		const configurationProperties = this.configurationRegistry.getConfigurationProperties();
		const excludedConfigurationProperties = this.configurationRegistry.getExcludedConfigurationProperties();

		for (const key of properties) {
			const config = configurationProperties[key] ?? excludedConfigurationProperties[key];
			if (!config) {
				// Config is removed. So add it to the list if in case it was registered as policy before
				keys.push(key);
				continue;
			}
			if (config.policy) {
				if (config.type !== 'string' && config.type !== 'number' && config.type !== 'array' && config.type !== 'object' && config.type !== 'boolean') {
					this.logService.warn(`Policy ${config.policy.name} has unsupported type ${config.type}`);
					continue;
				}
				const { value } = config.policy;
				keys.push(key);
				policyDefinitions[config.policy.name] = {
					type: config.type === 'number' ? 'number' : config.type === 'boolean' ? 'boolean' : 'string',
					value,
				};
			}
		}

		if (!isEmptyObject(policyDefinitions)) {
			await this.policyService.updatePolicyDefinitions(policyDefinitions);
		}

		return keys;
	}

	private onDidChangePolicies(policyNames: readonly PolicyName[]): void {
		this.logService.trace('PolicyConfiguration#onDidChangePolicies', policyNames);
		const policyConfigurations = this.configurationRegistry.getPolicyConfigurations();
		const keys = coalesce(policyNames.map(policyName => policyConfigurations.get(policyName)));
		this.update(keys, true);
	}

	private update(keys: string[], trigger: boolean): void {
		this.logService.trace('PolicyConfiguration#update', keys);
		const configurationProperties = this.configurationRegistry.getConfigurationProperties();
		const excludedConfigurationProperties = this.configurationRegistry.getExcludedConfigurationProperties();
		const changed: [string, unknown][] = [];
		const wasEmpty = this._configurationModel.isEmpty();

		for (const key of keys) {
			const proprety = configurationProperties[key] ?? excludedConfigurationProperties[key];
			const policyName = proprety?.policy?.name;
			if (policyName) {
				let policyValue: PolicyValue | ParsedType | undefined = this.policyService.getPolicyValue(policyName);
				if (isString(policyValue) && proprety.type !== 'string') {
					try {
						policyValue = this.parse(policyValue);
					} catch (e) {
						this.logService.error(`Error parsing policy value ${policyName}:`, getErrorMessage(e));
						continue;
					}
				}
				if (wasEmpty ? policyValue !== undefined : !equals(this._configurationModel.getValue(key), policyValue)) {
					changed.push([key, policyValue]);
				}
			} else {
				if (this._configurationModel.getValue(key) !== undefined) {
					changed.push([key, undefined]);
				}
			}
		}

		if (changed.length) {
			this.logService.trace('PolicyConfiguration#changed', changed);
			const old = this._configurationModel;
			this._configurationModel = ConfigurationModel.createEmptyModel(this.logService);
			for (const key of old.keys) {
				this._configurationModel.setValue(key, old.getValue(key));
			}
			for (const [key, policyValue] of changed) {
				if (policyValue === undefined) {
					this._configurationModel.removeValue(key);
				} else {
					this._configurationModel.setValue(key, policyValue);
				}
			}
			if (trigger) {
				this._onDidChangeConfiguration.fire(this._configurationModel);
			}
		}
	}

	private parse(content: string): ParsedType {
		let raw: ParsedType = {};
		let currentProperty: string | null = null;
		let currentParent: ParsedType = [];
		const previousParents: Array<ParsedType> = [];
		const parseErrors: json.ParseError[] = [];

		function onValue(value: unknown) {
			if (Array.isArray(currentParent)) {
				currentParent.push(value);
			} else if (currentProperty !== null) {
				if (currentParent[currentProperty] !== undefined) {
					throw new Error(`Duplicate property found: ${currentProperty}`);
				}
				currentParent[currentProperty] = value;
			}
		}

		const visitor: json.JSONVisitor = {
			onObjectBegin: () => {
				const object = {};
				onValue(object);
				previousParents.push(currentParent);
				currentParent = object;
				currentProperty = null;
			},
			onObjectProperty: (name: string) => {
				currentProperty = name;
			},
			onObjectEnd: () => {
				currentParent = previousParents.pop()!;
			},
			onArrayBegin: () => {
				const array: unknown[] = [];
				onValue(array);
				previousParents.push(currentParent);
				currentParent = array;
				currentProperty = null;
			},
			onArrayEnd: () => {
				currentParent = previousParents.pop()!;
			},
			onLiteralValue: onValue,
			onError: (error: json.ParseErrorCode, offset: number, length: number) => {
				parseErrors.push({ error, offset, length });
			}
		};

		if (content) {
			json.visit(content, visitor);
			raw = (currentParent[0] as ParsedType | undefined) || raw;
		}

		if (parseErrors.length > 0) {
			throw new Error(parseErrors.map(e => getErrorMessage(e.error)).join('\n'));
		}

		return raw;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/common/configurationService.ts]---
Location: vscode-main/src/vs/platform/configuration/common/configurationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct, equals as arrayEquals } from '../../../base/common/arrays.js';
import { Queue, RunOnceScheduler } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { JSONPath, ParseError, parse } from '../../../base/common/json.js';
import { applyEdits, setProperty } from '../../../base/common/jsonEdit.js';
import { Edit, FormattingOptions } from '../../../base/common/jsonFormatter.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { equals } from '../../../base/common/objects.js';
import { OS, OperatingSystem } from '../../../base/common/platform.js';
import { extUriBiasedIgnorePathCase } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { ConfigurationTarget, IConfigurationChange, IConfigurationChangeEvent, IConfigurationData, IConfigurationOverrides, IConfigurationService, IConfigurationUpdateOptions, IConfigurationUpdateOverrides, IConfigurationValue, isConfigurationOverrides, isConfigurationUpdateOverrides } from './configuration.js';
import { Configuration, ConfigurationChangeEvent, ConfigurationModel, UserSettings } from './configurationModels.js';
import { keyFromOverrideIdentifiers } from './configurationRegistry.js';
import { DefaultConfiguration, IPolicyConfiguration, NullPolicyConfiguration, PolicyConfiguration } from './configurations.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IPolicyService, NullPolicyService } from '../../policy/common/policy.js';

export class ConfigurationService extends Disposable implements IConfigurationService, IDisposable {

	declare readonly _serviceBrand: undefined;

	private configuration: Configuration;
	private readonly defaultConfiguration: DefaultConfiguration;
	private readonly policyConfiguration: IPolicyConfiguration;
	private readonly userConfiguration: UserSettings;
	private readonly reloadConfigurationScheduler: RunOnceScheduler;

	private readonly _onDidChangeConfiguration: Emitter<IConfigurationChangeEvent> = this._register(new Emitter<IConfigurationChangeEvent>());
	readonly onDidChangeConfiguration: Event<IConfigurationChangeEvent> = this._onDidChangeConfiguration.event;

	private readonly configurationEditing: ConfigurationEditing;

	constructor(
		private readonly settingsResource: URI,
		fileService: IFileService,
		policyService: IPolicyService,
		private readonly logService: ILogService,
	) {
		super();
		this.defaultConfiguration = this._register(new DefaultConfiguration(logService));
		this.policyConfiguration = policyService instanceof NullPolicyService ? new NullPolicyConfiguration() : this._register(new PolicyConfiguration(this.defaultConfiguration, policyService, logService));
		this.userConfiguration = this._register(new UserSettings(this.settingsResource, {}, extUriBiasedIgnorePathCase, fileService, logService));
		this.configuration = new Configuration(
			this.defaultConfiguration.configurationModel,
			this.policyConfiguration.configurationModel,
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			ConfigurationModel.createEmptyModel(logService),
			new ResourceMap<ConfigurationModel>(),
			ConfigurationModel.createEmptyModel(logService),
			new ResourceMap<ConfigurationModel>(),
			logService
		);
		this.configurationEditing = new ConfigurationEditing(settingsResource, fileService, this);

		this.reloadConfigurationScheduler = this._register(new RunOnceScheduler(() => this.reloadConfiguration(), 50));
		this._register(this.defaultConfiguration.onDidChangeConfiguration(({ defaults, properties }) => this.onDidDefaultConfigurationChange(defaults, properties)));
		this._register(this.policyConfiguration.onDidChangeConfiguration(model => this.onDidPolicyConfigurationChange(model)));
		this._register(this.userConfiguration.onDidChange(() => this.reloadConfigurationScheduler.schedule()));
	}

	async initialize(): Promise<void> {
		const [defaultModel, policyModel, userModel] = await Promise.all([this.defaultConfiguration.initialize(), this.policyConfiguration.initialize(), this.userConfiguration.loadConfiguration()]);
		this.configuration = new Configuration(
			defaultModel,
			policyModel,
			ConfigurationModel.createEmptyModel(this.logService),
			userModel,
			ConfigurationModel.createEmptyModel(this.logService),
			ConfigurationModel.createEmptyModel(this.logService),
			new ResourceMap<ConfigurationModel>(),
			ConfigurationModel.createEmptyModel(this.logService),
			new ResourceMap<ConfigurationModel>(),
			this.logService
		);
	}

	getConfigurationData(): IConfigurationData {
		return this.configuration.toData();
	}

	getValue<T>(): T;
	getValue<T>(section: string): T;
	getValue<T>(overrides: IConfigurationOverrides): T;
	getValue<T>(section: string, overrides: IConfigurationOverrides): T;
	getValue(arg1?: unknown, arg2?: unknown): unknown {
		const section = typeof arg1 === 'string' ? arg1 : undefined;
		const overrides = isConfigurationOverrides(arg1) ? arg1 : isConfigurationOverrides(arg2) ? arg2 : {};
		return this.configuration.getValue(section, overrides, undefined);
	}

	updateValue(key: string, value: unknown): Promise<void>;
	updateValue(key: string, value: unknown, overrides: IConfigurationOverrides | IConfigurationUpdateOverrides): Promise<void>;
	updateValue(key: string, value: unknown, target: ConfigurationTarget): Promise<void>;
	updateValue(key: string, value: unknown, overrides: IConfigurationOverrides | IConfigurationUpdateOverrides, target: ConfigurationTarget, options?: IConfigurationUpdateOptions): Promise<void>;
	async updateValue(key: string, value: unknown, arg3?: unknown, arg4?: unknown, options?: IConfigurationUpdateOptions): Promise<void> {
		const overrides: IConfigurationUpdateOverrides | undefined = isConfigurationUpdateOverrides(arg3) ? arg3
			: isConfigurationOverrides(arg3) ? { resource: arg3.resource, overrideIdentifiers: arg3.overrideIdentifier ? [arg3.overrideIdentifier] : undefined } : undefined;

		const target: ConfigurationTarget | undefined = (overrides ? arg4 : arg3) as ConfigurationTarget | undefined;
		if (target !== undefined) {
			if (target !== ConfigurationTarget.USER_LOCAL && target !== ConfigurationTarget.USER) {
				throw new Error(`Unable to write ${key} to target ${target}.`);
			}
		}

		if (overrides?.overrideIdentifiers) {
			overrides.overrideIdentifiers = distinct(overrides.overrideIdentifiers);
			overrides.overrideIdentifiers = overrides.overrideIdentifiers.length ? overrides.overrideIdentifiers : undefined;
		}

		const inspect = this.inspect(key, { resource: overrides?.resource, overrideIdentifier: overrides?.overrideIdentifiers ? overrides.overrideIdentifiers[0] : undefined });
		if (inspect.policyValue !== undefined) {
			throw new Error(`Unable to write ${key} because it is configured in system policy.`);
		}

		// Remove the setting, if the value is same as default value
		if (equals(value, inspect.defaultValue)) {
			value = undefined;
		}

		if (overrides?.overrideIdentifiers?.length && overrides.overrideIdentifiers.length > 1) {
			const overrideIdentifiers = overrides.overrideIdentifiers.sort();
			const existingOverrides = this.configuration.localUserConfiguration.overrides.find(override => arrayEquals([...override.identifiers].sort(), overrideIdentifiers));
			if (existingOverrides) {
				overrides.overrideIdentifiers = existingOverrides.identifiers;
			}
		}

		const path = overrides?.overrideIdentifiers?.length ? [keyFromOverrideIdentifiers(overrides.overrideIdentifiers), key] : [key];

		await this.configurationEditing.write(path, value);
		await this.reloadConfiguration();
	}

	inspect<T>(key: string, overrides: IConfigurationOverrides = {}): IConfigurationValue<T> {
		return this.configuration.inspect<T>(key, overrides, undefined);
	}

	keys(): {
		default: string[];
		policy: string[];
		user: string[];
		workspace: string[];
		workspaceFolder: string[];
	} {
		return this.configuration.keys(undefined);
	}

	async reloadConfiguration(): Promise<void> {
		const configurationModel = await this.userConfiguration.loadConfiguration();
		this.onDidChangeUserConfiguration(configurationModel);
	}

	private onDidChangeUserConfiguration(userConfigurationModel: ConfigurationModel): void {
		const previous = this.configuration.toData();
		const change = this.configuration.compareAndUpdateLocalUserConfiguration(userConfigurationModel);
		this.trigger(change, previous, ConfigurationTarget.USER);
	}

	private onDidDefaultConfigurationChange(defaultConfigurationModel: ConfigurationModel, properties: string[]): void {
		const previous = this.configuration.toData();
		const change = this.configuration.compareAndUpdateDefaultConfiguration(defaultConfigurationModel, properties);
		this.trigger(change, previous, ConfigurationTarget.DEFAULT);
	}

	private onDidPolicyConfigurationChange(policyConfiguration: ConfigurationModel): void {
		const previous = this.configuration.toData();
		const change = this.configuration.compareAndUpdatePolicyConfiguration(policyConfiguration);
		this.trigger(change, previous, ConfigurationTarget.DEFAULT);
	}

	private trigger(configurationChange: IConfigurationChange, previous: IConfigurationData, source: ConfigurationTarget): void {
		const event = new ConfigurationChangeEvent(configurationChange, { data: previous }, this.configuration, undefined, this.logService);
		event.source = source;
		this._onDidChangeConfiguration.fire(event);
	}
}

class ConfigurationEditing {

	private readonly queue: Queue<void>;

	constructor(
		private readonly settingsResource: URI,
		private readonly fileService: IFileService,
		private readonly configurationService: IConfigurationService,
	) {
		this.queue = new Queue<void>();
	}

	write(path: JSONPath, value: unknown): Promise<void> {
		return this.queue.queue(() => this.doWriteConfiguration(path, value)); // queue up writes to prevent race conditions
	}

	private async doWriteConfiguration(path: JSONPath, value: unknown): Promise<void> {
		let content: string;
		try {
			const fileContent = await this.fileService.readFile(this.settingsResource);
			content = fileContent.value.toString();
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				content = '{}';
			} else {
				throw error;
			}
		}

		const parseErrors: ParseError[] = [];
		parse(content, parseErrors, { allowTrailingComma: true, allowEmptyContent: true });
		if (parseErrors.length > 0) {
			throw new Error('Unable to write into the settings file. Please open the file to correct errors/warnings in the file and try again.');
		}

		const edits = this.getEdits(content, path, value);
		content = applyEdits(content, edits);

		await this.fileService.writeFile(this.settingsResource, VSBuffer.fromString(content));
	}

	private getEdits(content: string, path: JSONPath, value: unknown): Edit[] {
		const { tabSize, insertSpaces, eol } = this.formattingOptions;

		// With empty path the entire file is being replaced, so we just use JSON.stringify
		if (!path.length) {
			const content = JSON.stringify(value, null, insertSpaces ? ' '.repeat(tabSize) : '\t');
			return [{
				content,
				length: content.length,
				offset: 0
			}];
		}

		return setProperty(content, path, value, { tabSize, insertSpaces, eol });
	}

	private _formattingOptions: Required<FormattingOptions> | undefined;
	private get formattingOptions(): Required<FormattingOptions> {
		if (!this._formattingOptions) {
			let eol = OS === OperatingSystem.Linux || OS === OperatingSystem.Macintosh ? '\n' : '\r\n';
			const configuredEol = this.configurationService.getValue('files.eol', { overrideIdentifier: 'jsonc' });
			if (configuredEol && typeof configuredEol === 'string' && configuredEol !== 'auto') {
				eol = configuredEol;
			}
			this._formattingOptions = {
				eol,
				insertSpaces: !!this.configurationService.getValue('editor.insertSpaces', { overrideIdentifier: 'jsonc' }),
				tabSize: this.configurationService.getValue('editor.tabSize', { overrideIdentifier: 'jsonc' })
			};
		}
		return this._formattingOptions;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/configuration/test/common/configuration.test.ts]---
Location: vscode-main/src/vs/platform/configuration/test/common/configuration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { merge, removeFromValueTree } from '../../common/configuration.js';
import { mergeChanges } from '../../common/configurationModels.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('Configuration', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('simple merge', () => {
		let base = { 'a': 1, 'b': 2 };
		merge(base, { 'a': 3, 'c': 4 }, true);
		assert.deepStrictEqual(base, { 'a': 3, 'b': 2, 'c': 4 });
		base = { 'a': 1, 'b': 2 };
		merge(base, { 'a': 3, 'c': 4 }, false);
		assert.deepStrictEqual(base, { 'a': 1, 'b': 2, 'c': 4 });
	});

	test('object merge', () => {
		const base = { 'a': { 'b': 1, 'c': true, 'd': 2 } };
		merge(base, { 'a': { 'b': undefined, 'c': false, 'e': 'a' } }, true);
		assert.deepStrictEqual(base, { 'a': { 'b': undefined, 'c': false, 'd': 2, 'e': 'a' } });
	});

	test('array merge', () => {
		const base = { 'a': ['b', 'c'] };
		merge(base, { 'a': ['b', 'd'] }, true);
		assert.deepStrictEqual(base, { 'a': ['b', 'd'] });
	});

	test('removeFromValueTree: remove a non existing key', () => {
		const target = { 'a': { 'b': 2 } };

		removeFromValueTree(target, 'c');

		assert.deepStrictEqual(target, { 'a': { 'b': 2 } });
	});

	test('removeFromValueTree: remove a multi segmented key from an object that has only sub sections of the key', () => {
		const target = { 'a': { 'b': 2 } };

		removeFromValueTree(target, 'a.b.c');

		assert.deepStrictEqual(target, { 'a': { 'b': 2 } });
	});

	test('removeFromValueTree: remove a single segmented key', () => {
		const target = { 'a': 1 };

		removeFromValueTree(target, 'a');

		assert.deepStrictEqual(target, {});
	});

	test('removeFromValueTree: remove a single segmented key when its value is undefined', () => {
		const target = { 'a': undefined };

		removeFromValueTree(target, 'a');

		assert.deepStrictEqual(target, {});
	});

	test('removeFromValueTree: remove a multi segmented key when its value is undefined', () => {
		const target = { 'a': { 'b': 1 } };

		removeFromValueTree(target, 'a.b');

		assert.deepStrictEqual(target, {});
	});

	test('removeFromValueTree: remove a multi segmented key when its value is array', () => {
		const target = { 'a': { 'b': [1] } };

		removeFromValueTree(target, 'a.b');

		assert.deepStrictEqual(target, {});
	});

	test('removeFromValueTree: remove a multi segmented key first segment value is array', () => {
		const target = { 'a': [1] };

		removeFromValueTree(target, 'a.0');

		assert.deepStrictEqual(target, { 'a': [1] });
	});

	test('removeFromValueTree: remove when key is the first segmenet', () => {
		const target = { 'a': { 'b': 1 } };

		removeFromValueTree(target, 'a');

		assert.deepStrictEqual(target, {});
	});

	test('removeFromValueTree: remove a multi segmented key when the first node has more values', () => {
		const target = { 'a': { 'b': { 'c': 1 }, 'd': 1 } };

		removeFromValueTree(target, 'a.b.c');

		assert.deepStrictEqual(target, { 'a': { 'd': 1 } });
	});

	test('removeFromValueTree: remove a multi segmented key when in between node has more values', () => {
		const target = { 'a': { 'b': { 'c': { 'd': 1 }, 'd': 1 } } };

		removeFromValueTree(target, 'a.b.c.d');

		assert.deepStrictEqual(target, { 'a': { 'b': { 'd': 1 } } });
	});

	test('removeFromValueTree: remove a multi segmented key when the last but one node has more values', () => {
		const target = { 'a': { 'b': { 'c': 1, 'd': 1 } } };

		removeFromValueTree(target, 'a.b.c');

		assert.deepStrictEqual(target, { 'a': { 'b': { 'd': 1 } } });
	});

});

suite('Configuration Changes: Merge', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('merge only keys', () => {
		const actual = mergeChanges({ keys: ['a', 'b'], overrides: [] }, { keys: ['c', 'd'], overrides: [] });
		assert.deepStrictEqual(actual, { keys: ['a', 'b', 'c', 'd'], overrides: [] });
	});

	test('merge only keys with duplicates', () => {
		const actual = mergeChanges({ keys: ['a', 'b'], overrides: [] }, { keys: ['c', 'd'], overrides: [] }, { keys: ['a', 'd', 'e'], overrides: [] });
		assert.deepStrictEqual(actual, { keys: ['a', 'b', 'c', 'd', 'e'], overrides: [] });
	});

	test('merge only overrides', () => {
		const actual = mergeChanges({ keys: [], overrides: [['a', ['1', '2']]] }, { keys: [], overrides: [['b', ['3', '4']]] });
		assert.deepStrictEqual(actual, { keys: [], overrides: [['a', ['1', '2']], ['b', ['3', '4']]] });
	});

	test('merge only overrides with duplicates', () => {
		const actual = mergeChanges({ keys: [], overrides: [['a', ['1', '2']], ['b', ['5', '4']]] }, { keys: [], overrides: [['b', ['3', '4']]] }, { keys: [], overrides: [['c', ['1', '4']], ['a', ['2', '3']]] });
		assert.deepStrictEqual(actual, { keys: [], overrides: [['a', ['1', '2', '3']], ['b', ['5', '4', '3']], ['c', ['1', '4']]] });
	});

	test('merge', () => {
		const actual = mergeChanges({ keys: ['b', 'b'], overrides: [['a', ['1', '2']], ['b', ['5', '4']]] }, { keys: ['b'], overrides: [['b', ['3', '4']]] }, { keys: ['c', 'a'], overrides: [['c', ['1', '4']], ['a', ['2', '3']]] });
		assert.deepStrictEqual(actual, { keys: ['b', 'c', 'a'], overrides: [['a', ['1', '2', '3']], ['b', ['5', '4', '3']], ['c', ['1', '4']]] });
	});

	test('merge single change', () => {
		const actual = mergeChanges({ keys: ['b', 'b'], overrides: [['a', ['1', '2']], ['b', ['5', '4']]] });
		assert.deepStrictEqual(actual, { keys: ['b', 'b'], overrides: [['a', ['1', '2']], ['b', ['5', '4']]] });
	});

	test('merge no changes', () => {
		const actual = mergeChanges();
		assert.deepStrictEqual(actual, { keys: [], overrides: [] });
	});

});
```

--------------------------------------------------------------------------------

````
